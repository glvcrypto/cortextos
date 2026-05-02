import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const mockSpawnSync = vi.hoisted(() => vi.fn());
vi.mock('child_process', () => ({ spawnSync: mockSpawnSync }));

import { uninstallCommand } from '../../../src/cli/uninstall';

function run(...args: string[]) {
  return uninstallCommand.parseAsync(['node', 'cli', ...args]);
}

describe('uninstallCommand', () => {
  let tmpHome: string;
  const origHome = process.env.HOME;

  beforeEach(() => {
    tmpHome = mkdtempSync(join(tmpdir(), 'ctx-uninstall-'));
    process.env.HOME = tmpHome;
    mockSpawnSync.mockReturnValue({ status: 1, stdout: '', stderr: '' });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    if (origHome === undefined) delete process.env.HOME;
    else process.env.HOME = origHome;
    rmSync(tmpHome, { recursive: true, force: true });
    vi.restoreAllMocks();
    mockSpawnSync.mockReset();
  });

  function makeCtxRoot(instanceId = 'default') {
    const ctxRoot = join(tmpHome, '.cortextos', instanceId);
    mkdirSync(join(ctxRoot, 'config'), { recursive: true });
    mkdirSync(join(ctxRoot, 'state'), { recursive: true });
    writeFileSync(join(ctxRoot, 'config', 'enabled-agents.json'), '{"dev":{"enabled":true}}');
    return ctxRoot;
  }

  // ─── early exit ─────────────────────────────────────────────────────────────

  describe('early exit when no state directory exists', () => {
    it('logs "No cortextOS state found" when ctxRoot is missing', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      await run();
      expect(logSpy.mock.calls.flat().join('\n')).toContain('No cortextOS state found');
    });

    it('does not invoke PM2 when ctxRoot is absent', async () => {
      await run();
      expect(mockSpawnSync).not.toHaveBeenCalled();
    });

    it('resolves cleanly when ctxRoot is absent', async () => {
      await expect(run()).resolves.toBeDefined();
    });
  });

  // ─── full uninstall ──────────────────────────────────────────────────────────

  describe('full uninstall', () => {
    it('removes the entire ctxRoot directory', async () => {
      const ctxRoot = makeCtxRoot();
      await run();
      expect(existsSync(ctxRoot)).toBe(false);
    });

    it('logs "cortextOS uninstalled" on success', async () => {
      makeCtxRoot();
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      await run();
      expect(logSpy.mock.calls.flat().join('\n')).toContain('cortextOS uninstalled');
    });

    it('routes to the correct path when --instance is specified', async () => {
      const ctxRoot = makeCtxRoot('myinst');
      // default instance is NOT touched
      const defaultRoot = join(tmpHome, '.cortextos', 'default');
      mkdirSync(defaultRoot, { recursive: true });

      await run('--instance', 'myinst');

      expect(existsSync(ctxRoot)).toBe(false);
      expect(existsSync(defaultRoot)).toBe(true);
    });
  });

  // ─── --keep-state ─────────────────────────────────────────────────────────--

  describe('--keep-state', () => {
    it('removes enabled-agents.json', async () => {
      const ctxRoot = makeCtxRoot();
      await run('--keep-state');
      expect(existsSync(join(ctxRoot, 'config', 'enabled-agents.json'))).toBe(false);
    });

    it('preserves the ctxRoot directory', async () => {
      const ctxRoot = makeCtxRoot();
      await run('--keep-state');
      expect(existsSync(ctxRoot)).toBe(true);
    });

    it('preserves files under state/', async () => {
      const ctxRoot = makeCtxRoot();
      writeFileSync(join(ctxRoot, 'state', 'heartbeat.json'), '{}');
      await run('--keep-state');
      expect(existsSync(join(ctxRoot, 'state', 'heartbeat.json'))).toBe(true);
    });

    it('resolves cleanly when enabled-agents.json is absent', async () => {
      const ctxRoot = join(tmpHome, '.cortextos', 'default');
      mkdirSync(join(ctxRoot, 'config'), { recursive: true }); // no enabled-agents.json
      await expect(run('--keep-state')).resolves.toBeDefined();
    });
  });

  // ─── PM2 cleanup ─────────────────────────────────────────────────────────---

  describe('PM2 process cleanup', () => {
    function withPM2(processes: Array<{ name: string }>) {
      mockSpawnSync.mockImplementation((cmd: string, args: string[]) => {
        if (cmd === 'pm2' && args[0] === 'jlist') {
          return { status: 0, stdout: JSON.stringify(processes), stderr: '' };
        }
        return { status: 0, stdout: '', stderr: '' };
      });
    }

    function deletedNames(): string[] {
      return mockSpawnSync.mock.calls
        .filter((call) => Array.isArray(call[1]) && call[1][0] === 'delete')
        .map((call) => call[1][1] as string);
    }

    it('deletes cortextos-* processes', async () => {
      makeCtxRoot();
      withPM2([{ name: 'cortextos-daemon' }, { name: 'unrelated-app' }]);
      await run();
      expect(deletedNames()).toEqual(['cortextos-daemon']);
    });

    it('deletes ctx-<instanceId> prefixed processes', async () => {
      makeCtxRoot();
      withPM2([{ name: 'ctx-default-agent' }]);
      await run();
      expect(deletedNames()).toEqual(['ctx-default-agent']);
    });

    it('skips processes that match neither prefix', async () => {
      makeCtxRoot();
      withPM2([{ name: 'nginx' }, { name: 'my-custom-app' }]);
      await run();
      expect(deletedNames()).toHaveLength(0);
    });

    it('tolerates PM2 not found (spawnSync status 1)', async () => {
      makeCtxRoot();
      mockSpawnSync.mockReturnValue({ status: 1, stdout: '' });
      await expect(run()).resolves.toBeDefined();
    });

    it('tolerates invalid JSON from PM2 jlist', async () => {
      makeCtxRoot();
      mockSpawnSync.mockReturnValue({ status: 0, stdout: 'not-valid-json' });
      await expect(run()).resolves.toBeDefined();
    });
  });
});
