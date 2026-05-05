import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Hoist all mock references so vi.mock factories can close over them.
const { mockIsDaemonRunning, mockSend, mockExecSync, mockSpawn, mockSpawnSync } = vi.hoisted(() => ({
  mockIsDaemonRunning: vi.fn(),
  mockSend: vi.fn(),
  mockExecSync: vi.fn(),
  mockSpawn: vi.fn(),
  mockSpawnSync: vi.fn(),
}));

vi.mock('../../../src/daemon/ipc-server.js', () => ({
  IPCClient: vi.fn().mockImplementation(() => ({
    isDaemonRunning: mockIsDaemonRunning,
    send: mockSend,
  })),
}));

vi.mock('child_process', () => ({
  execSync: mockExecSync,
  spawn: mockSpawn,
  spawnSync: mockSpawnSync,
}));

const { startCommand } = await import('../../../src/cli/start.js');

describe('startCommand', () => {
  let testDir: string;
  let tmpHome: string;
  let tmpProject: string;
  const origHome = process.env.HOME;
  let cwdSpy: ReturnType<typeof vi.spyOn>;
  let exitSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'ctx-start-'));
    tmpHome = join(testDir, 'home');
    tmpProject = join(testDir, 'project');
    mkdirSync(tmpHome, { recursive: true });
    mkdirSync(tmpProject, { recursive: true });

    process.env.HOME = tmpHome;
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tmpProject);
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code ?? 0})`);
    });
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockIsDaemonRunning.mockReset();
    mockSend.mockReset();
    mockExecSync.mockReset();
    mockSpawn.mockReset();
    mockSpawnSync.mockReset();

    mockSpawn.mockReturnValue({ unref: vi.fn(), on: vi.fn(), kill: vi.fn() });
  });

  afterEach(() => {
    vi.useRealTimers();
    if (origHome === undefined) delete process.env.HOME;
    else process.env.HOME = origHome;
    cwdSpy.mockRestore();
    exitSpy.mockRestore();
    logSpy.mockRestore();
    errorSpy.mockRestore();
    rmSync(testDir, { recursive: true, force: true });
  });

  // ── test helpers ──────────────────────────────────────────────────────────

  function createDaemonScript() {
    mkdirSync(join(tmpProject, 'dist'), { recursive: true });
    writeFileSync(join(tmpProject, 'dist', 'daemon.js'), '// daemon');
  }

  function withPm2(available = true) {
    mockSpawnSync.mockReturnValue({ status: available ? 0 : 1 });
  }

  function withEcosystem() {
    writeFileSync(join(tmpProject, 'ecosystem.config.js'), '// eco');
  }

  function createEnabledAgents(instance: string, content: Record<string, unknown>) {
    const dir = join(tmpHome, '.cortextos', instance, 'config');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'enabled-agents.json'), JSON.stringify(content, null, 2) + '\n');
  }

  function enabledAgentsPath(instance = 'default') {
    return join(tmpHome, '.cortextos', instance, 'config', 'enabled-agents.json');
  }

  // ── daemon not running ────────────────────────────────────────────────────

  describe('daemon not running', () => {
    beforeEach(() => {
      mockIsDaemonRunning.mockResolvedValueOnce(false);
    });

    it('exits(1) and prints build hint when daemon script is missing', async () => {
      await expect(startCommand.parseAsync([], { from: 'user' })).rejects.toThrow('process.exit(1)');
      expect(errorSpy).toHaveBeenCalledWith('Daemon not built. Run: npm run build');
    });

    it('spawns daemon with stdio:inherit when --foreground is set', async () => {
      createDaemonScript();
      await startCommand.parseAsync(['--foreground'], { from: 'user' });
      expect(mockSpawn).toHaveBeenCalledWith(
        process.execPath,
        [join(tmpProject, 'dist', 'daemon.js'), '--instance', 'default'],
        expect.objectContaining({ stdio: 'inherit' }),
      );
    });

    it('runs pm2 start and pm2 save when PM2 present and ecosystem.config.js exists', async () => {
      createDaemonScript();
      withPm2(true);
      withEcosystem();
      await startCommand.parseAsync([], { from: 'user' });
      expect(mockExecSync).toHaveBeenCalledWith('pm2 start ecosystem.config.js', expect.any(Object));
      expect(mockExecSync).toHaveBeenCalledWith('pm2 save', expect.any(Object));
    });

    it('generates ecosystem.config.js then starts via pm2 when no ecosystem file exists', async () => {
      createDaemonScript();
      withPm2(true);
      // No ecosystem.config.js
      await startCommand.parseAsync([], { from: 'user' });
      const firstArg = mockExecSync.mock.calls[0][0] as string;
      expect(firstArg).toContain('ecosystem');
      expect(mockExecSync).toHaveBeenCalledWith('pm2 start ecosystem.config.js', expect.any(Object));
    });

    it('logs PM2 error without calling process.exit when pm2 start throws', async () => {
      createDaemonScript();
      withPm2(true);
      withEcosystem();
      mockExecSync.mockImplementation((cmd: string) => {
        if (cmd.includes('pm2 start')) throw new Error('pm2 failure');
      });
      await startCommand.parseAsync([], { from: 'user' });
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('PM2 start failed'));
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('spawns detached daemon and logs success when process responds', async () => {
      createDaemonScript();
      withPm2(false);
      mockIsDaemonRunning.mockResolvedValueOnce(true); // second check, after spawn
      vi.useFakeTimers();
      const promise = startCommand.parseAsync([], { from: 'user' });
      await vi.runAllTimersAsync();
      await promise;
      expect(mockSpawn).toHaveBeenCalledWith(
        process.execPath,
        [join(tmpProject, 'dist', 'daemon.js'), '--instance', 'default'],
        expect.objectContaining({ detached: true }),
      );
      expect(logSpy).toHaveBeenCalledWith('Daemon started successfully (background process).');
    });

    it('shows log-path hint when daemon does not respond after spawn', async () => {
      createDaemonScript();
      withPm2(false);
      mockIsDaemonRunning.mockResolvedValueOnce(false); // second check: still not running
      vi.useFakeTimers();
      const promise = startCommand.parseAsync([], { from: 'user' });
      await vi.runAllTimersAsync();
      await promise;
      expect(logSpy).toHaveBeenCalledWith('Daemon spawned. Check logs if agents do not appear:');
    });
  });

  // ── daemon already running — no agent ────────────────────────────────────

  describe('daemon already running — no agent', () => {
    beforeEach(() => {
      mockIsDaemonRunning.mockResolvedValue(true);
    });

    it('shows "No agents configured" message when status returns empty list', async () => {
      mockSend.mockResolvedValue({ success: true, data: [] });
      await startCommand.parseAsync([], { from: 'user' });
      expect(logSpy).toHaveBeenCalledWith(
        'No agents configured. Add one with: cortextos add-agent <name>',
      );
    });

    it('lists running agents with statuses and pids', async () => {
      mockSend.mockResolvedValue({
        success: true,
        data: [
          { name: 'dev', status: 'running', pid: 1234 },
          { name: 'analyst', status: 'running', pid: 5678 },
        ],
      });
      await startCommand.parseAsync([], { from: 'user' });
      expect(logSpy).toHaveBeenCalledWith('Agent statuses:');
      expect(logSpy).toHaveBeenCalledWith('  dev: running (pid: 1234)');
      expect(logSpy).toHaveBeenCalledWith('  analyst: running (pid: 5678)');
    });

    it('shows "-" for pid when agent pid is undefined', async () => {
      mockSend.mockResolvedValue({
        success: true,
        data: [{ name: 'dev', status: 'stopped', pid: undefined }],
      });
      await startCommand.parseAsync([], { from: 'user' });
      expect(logSpy).toHaveBeenCalledWith('  dev: stopped (pid: -)');
    });
  });

  // ── daemon already running — with agent ──────────────────────────────────

  describe('daemon already running — with agent', () => {
    beforeEach(() => {
      mockIsDaemonRunning.mockResolvedValue(true);
      mockSend.mockResolvedValue({ success: true, data: 'Starting dev' });
    });

    it('registers new agent in enabled-agents.json with enabled:true', async () => {
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(existsSync(enabledAgentsPath())).toBe(true);
      const content = JSON.parse(readFileSync(enabledAgentsPath(), 'utf-8'));
      expect(content['dev']).toMatchObject({ enabled: true, status: 'configured' });
    });

    it('logs "Registered" message when auto-registering a new agent', async () => {
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(logSpy).toHaveBeenCalledWith('  Registered dev in enabled-agents.json');
    });

    it('propagates org to new agent from an existing enabled agent', async () => {
      createEnabledAgents('default', { analyst: { enabled: true, org: 'glv' } });
      await startCommand.parseAsync(['dev'], { from: 'user' });
      const content = JSON.parse(readFileSync(enabledAgentsPath(), 'utf-8'));
      expect(content['dev'].org).toBe('glv');
    });

    it('registers without org field when no existing agent has one', async () => {
      createEnabledAgents('default', { analyst: { enabled: true } });
      await startCommand.parseAsync(['dev'], { from: 'user' });
      const content = JSON.parse(readFileSync(enabledAgentsPath(), 'utf-8'));
      expect(content['dev'].org).toBeUndefined();
    });

    it('does not re-register an agent already present in enabled-agents.json', async () => {
      createEnabledAgents('default', { dev: { enabled: true, org: 'glv', status: 'configured' } });
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(logSpy).not.toHaveBeenCalledWith('  Registered dev in enabled-agents.json');
    });

    it('logs "Starting agent: {name}" before the IPC call', async () => {
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(logSpy).toHaveBeenCalledWith('Starting agent: dev');
    });

    it('sends start-agent IPC with correct agent name and type', async () => {
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'start-agent', agent: 'dev' }),
      );
    });

    it('logs IPC success response data', async () => {
      mockSend.mockResolvedValue({ success: true, data: 'Starting dev' });
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(logSpy).toHaveBeenCalledWith('  Starting dev');
    });

    it('logs error message on IPC failure', async () => {
      mockSend.mockResolvedValue({ success: false, error: 'Agent already running' });
      await startCommand.parseAsync(['dev'], { from: 'user' });
      expect(errorSpy).toHaveBeenCalledWith('  Error: Agent already running');
    });

    it('uses --instance flag for enabled-agents path', async () => {
      await startCommand.parseAsync(['dev', '--instance', 'fleet1'], { from: 'user' });
      expect(existsSync(enabledAgentsPath('fleet1'))).toBe(true);
    });
  });
});
