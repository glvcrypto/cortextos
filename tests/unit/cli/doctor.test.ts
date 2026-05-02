import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Mock function instances — defined before vi.mock calls so the factory
// wrappers can reference them by closure. vi.mock factories are hoisted but
// their bodies run lazily (at first import of the target module), by which
// time these vi.fn() instances are fully initialized.
const mockExecSync = vi.fn<[cmd: string, ...rest: unknown[]], string>();
const mockHomedir = vi.fn<[], string>();
const mockSpawn = vi.fn();

vi.mock('child_process', async () => {
  const actual = await vi.importActual<typeof import('child_process')>('child_process');
  return {
    ...actual,
    execSync: (...args: unknown[]) => mockExecSync(args[0] as string, ...args.slice(1)),
  };
});

vi.mock('os', async () => {
  const actual = await vi.importActual<typeof import('os')>('os');
  return { ...actual, homedir: () => mockHomedir() };
});

// node-pty is require()'d dynamically inside the action body. vitest's module
// system intercepts dynamic require() calls the same as static imports.
vi.mock('node-pty', () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

// Import after mocks are registered so all require('node-pty') / execSync /
// homedir calls inside the module resolve to our mocks.
const { doctorCommand } = await import('../../../src/cli/doctor.js');

// ── test helpers ─────────────────────────────────────────────────────────

/**
 * Returns a spawn implementation that fires onData then onExit via setImmediate
 * so the doctor action's inner Promise resolves/rejects cleanly.
 */
function makePtyImpl(opts: { output?: string; exitCode?: number } = {}) {
  const { output = 'pty-ok\r\n', exitCode = 0 } = opts;
  return () => {
    let onDataCb: ((d: string) => void) | undefined;
    return {
      onData: (cb: (d: string) => void) => { onDataCb = cb; },
      onExit: (cb: (a: { exitCode: number }) => void) => {
        if (output) onDataCb?.(output);
        cb({ exitCode });
      },
    };
  };
}

/**
 * Configures mockExecSync with happy-path defaults for every command the
 * doctor action invokes on Linux (tunnel/cloudflared calls are darwin-only
 * and are never triggered in the test environment).
 *
 * Pass `overrides` to replace a specific command's return value or make it
 * throw:  setupExecSync({ 'pm2 --version': new Error('not found') })
 */
function setupExecSync(overrides: Record<string, string | Error> = {}) {
  mockExecSync.mockImplementation((cmd: string) => {
    if (Object.prototype.hasOwnProperty.call(overrides, cmd)) {
      const val = overrides[cmd];
      if (val instanceof Error) throw val;
      return val as string;
    }
    if (cmd === 'pm2 --version') return '5.3.0';
    if (cmd.startsWith('claude ')) return 'claude v1.2.0';
    if (cmd === 'gh --version') return 'gh version 2.40.0';
    if (cmd === 'git remote get-url upstream') return 'https://github.com/grandamenium/cortextos.git';
    throw new Error(`Unexpected execSync command in test: ${cmd}`);
  });
}

// ── suite ─────────────────────────────────────────────────────────────────

describe('doctorCommand', () => {
  let tmpHome: string;
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let exitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tmpHome = mkdtempSync(join(tmpdir(), 'doctor-test-'));
    mockHomedir.mockReturnValue(tmpHome);

    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`__EXIT_${code ?? ''}__`);
    }) as never);

    mockSpawn.mockImplementation(makePtyImpl());
    setupExecSync();
  });

  afterEach(() => {
    rmSync(tmpHome, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  function output(): string {
    return consoleSpy.mock.calls.map(args => String(args[0])).join('\n');
  }

  // ── header ──────────────────────────────────────────────────────────────

  it('prints the "cortextOS Doctor" header as the first line', async () => {
    await doctorCommand.parseAsync(['node', 'cli']);
    expect(String(consoleSpy.mock.calls[0][0])).toContain('cortextOS Doctor');
  });

  // ── happy path ───────────────────────────────────────────────────────────

  describe('happy path — all critical checks pass', () => {
    beforeEach(() => {
      mkdirSync(join(tmpHome, '.cortextos', 'default'), { recursive: true });
    });

    it('does not call process.exit', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('prints "All checks passed" summary', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toContain('All checks passed');
    });

    it('shows [OK] for Node.js version (running on Node 20+)', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+Node\.js version/);
    });

    it('shows [OK] for PM2 including the version string', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+PM2.*5\.3\.0/);
    });

    it('shows [OK] for Claude Code CLI', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+Claude Code CLI/);
    });

    it('shows [OK] for node-pty module load', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+node-pty/);
    });

    it('shows [OK] for node-pty spawn test', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+node-pty spawn test/);
    });

    it('shows [OK] for state directory and includes its path', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+State directory/);
      expect(output()).toContain(tmpHome);
    });

    it('shows [OK] for community/catalog.json (exists in repo cwd)', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[OK\]\s+community\/catalog\.json/);
    });
  });

  // ── --instance option ────────────────────────────────────────────────────

  describe('--instance option', () => {
    it('resolves state dir under the named instance', async () => {
      mkdirSync(join(tmpHome, '.cortextos', 'fleet-prod'), { recursive: true });
      await doctorCommand.parseAsync(['node', 'cli', '--instance', 'fleet-prod']);
      expect(output()).toMatch(/\[OK\]\s+State directory/);
      expect(output()).toContain('fleet-prod');
    });

    it('shows [WARN] when the named instance dir does not exist', async () => {
      // no dir created for 'fleet-prod'
      await doctorCommand.parseAsync(['node', 'cli', '--instance', 'fleet-prod']);
      expect(output()).toMatch(/\[WARN\]\s+State directory/);
    });
  });

  // ── warn-only checks ─────────────────────────────────────────────────────

  describe('warn-only checks (no process.exit)', () => {
    it('shows [WARN] + npm install fix when PM2 is not installed', async () => {
      setupExecSync({ 'pm2 --version': new Error('command not found: pm2') });
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[WARN\]\s+PM2/);
      expect(output()).toContain('Fix: Install with: npm install -g pm2');
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('shows [WARN] + init fix when state directory is missing', async () => {
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[WARN\]\s+State directory/);
      expect(output()).toContain('cortextos init');
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('shows [WARN] when gh CLI is not installed', async () => {
      setupExecSync({ 'gh --version': new Error('command not found: gh') });
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[WARN\]\s+gh CLI/);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('shows [WARN] + git-remote-add hint when upstream remote is not configured', async () => {
      setupExecSync({ 'git remote get-url upstream': new Error('No such remote: upstream') });
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\[WARN\]\s+upstream remote/);
      expect(output()).toContain('git remote add upstream');
      expect(exitSpy).not.toHaveBeenCalled();
    });
  });

  // ── fail checks ───────────────────────────────────────────────────────────

  describe('fail checks (exit 1)', () => {
    it('exits 1 and shows [FAIL] when Claude Code CLI is missing', async () => {
      setupExecSync({ 'claude --version': new Error('command not found: claude') });
      await expect(
        doctorCommand.parseAsync(['node', 'cli'])
      ).rejects.toThrow(/__EXIT_1__/);
      expect(output()).toMatch(/\[FAIL\]\s+Claude Code CLI/);
      expect(output()).toContain('npm install -g @anthropic-ai/claude-code');
    });

    it('exits 1 and shows [FAIL] when PTY spawn exits with non-zero code', async () => {
      mockSpawn.mockImplementationOnce(makePtyImpl({ output: '', exitCode: 1 }));
      mkdirSync(join(tmpHome, '.cortextos', 'default'), { recursive: true });
      await expect(
        doctorCommand.parseAsync(['node', 'cli'])
      ).rejects.toThrow(/__EXIT_1__/);
      expect(output()).toMatch(/\[FAIL\]\s+node-pty spawn test/);
      expect(output()).toContain('npm rebuild node-pty');
    });
  });

  // ── output format ────────────────────────────────────────────────────────

  describe('output format', () => {
    it('prints "X check(s) failed" count when there are failures', async () => {
      setupExecSync({ 'claude --version': new Error('not found') });
      await expect(
        doctorCommand.parseAsync(['node', 'cli'])
      ).rejects.toThrow(/__EXIT_1__/);
      expect(output()).toMatch(/\d+ check\(s\) failed/);
    });

    it('prints "X warning(s)" count summary when only warnings are present', async () => {
      // state dir absent → [WARN], no [FAIL]
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/\d+ warning\(s\)/);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('prints a "Fix:" line for every check that has a fix hint', async () => {
      setupExecSync({ 'pm2 --version': new Error('not found') });
      await doctorCommand.parseAsync(['node', 'cli']);
      expect(output()).toMatch(/Fix:/);
    });
  });
});
