import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';

const mockIsDaemonRunning = vi.hoisted(() => vi.fn());
const mockSend = vi.hoisted(() => vi.fn());

vi.mock('../../../src/daemon/ipc-server.js', () => ({
  IPCClient: vi.fn().mockImplementation(function () {
    this.isDaemonRunning = mockIsDaemonRunning;
    this.send = mockSend;
  }),
}));

import { stopCommand } from '../../../src/cli/stop';

function run(...args: string[]) {
  return stopCommand.parseAsync(['node', 'cli', ...args]);
}

describe('stopCommand', () => {
  let tmpHome: string;
  const origHome = process.env.HOME;

  beforeEach(() => {
    tmpHome = mkdtempSync(join(tmpdir(), 'ctx-stop-'));
    process.env.HOME = tmpHome;
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockIsDaemonRunning.mockResolvedValue(true);
    mockSend.mockResolvedValue({ success: true, data: 'agent stopped' });
  });

  afterEach(() => {
    if (origHome === undefined) delete process.env.HOME;
    else process.env.HOME = origHome;
    rmSync(tmpHome, { recursive: true, force: true });
    vi.restoreAllMocks();
    mockIsDaemonRunning.mockReset();
    mockSend.mockReset();
  });

  // ─── guard: no args ──────────────────────────────────────────────────────────

  describe('no-arg guard', () => {
    it('exits with code 2 when neither agent nor --all is given', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
        throw new Error(`__EXIT_${code}__`);
      }) as never);

      await expect(run()).rejects.toThrow(/__EXIT_2__/);
      expect(exitSpy).toHaveBeenCalledWith(2);
    });

    it('prints instructions for stopping one vs all agents', async () => {
      vi.spyOn(process, 'exit').mockImplementation((() => { throw new Error('exit'); }) as never);
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(run()).rejects.toThrow();
      const output = errSpy.mock.calls.flat().join('\n');
      expect(output).toContain('cortextos stop <agent>');
      expect(output).toContain('cortextos stop --all');
    });

    it('does not call the IPC layer when guard fires', async () => {
      vi.spyOn(process, 'exit').mockImplementation((() => { throw new Error('exit'); }) as never);

      await expect(run()).rejects.toThrow();
      expect(mockIsDaemonRunning).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  // ─── guard: agent + --all conflict ──────────────────────────────────────────

  describe('agent + --all conflict', () => {
    it('exits with code 2 when both agent name and --all are provided', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
        throw new Error(`__EXIT_${code}__`);
      }) as never);

      await expect(run('dev', '--all')).rejects.toThrow(/__EXIT_2__/);
      expect(exitSpy).toHaveBeenCalledWith(2);
    });

    it('prints an error about mutually exclusive options', async () => {
      vi.spyOn(process, 'exit').mockImplementation((() => { throw new Error('exit'); }) as never);
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(run('dev', '--all')).rejects.toThrow();
      expect(errSpy.mock.calls.flat().join('\n')).toContain('not both');
    });
  });

  // ─── daemon not running ──────────────────────────────────────────────────────

  describe('daemon not running', () => {
    it('logs "Daemon is not running." and resolves cleanly', async () => {
      mockIsDaemonRunning.mockResolvedValue(false);
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await expect(run('dev')).resolves.toBeDefined();
      expect(logSpy.mock.calls.flat().join('\n')).toContain('Daemon is not running.');
    });

    it('does not call ipc.send when daemon is not running', async () => {
      mockIsDaemonRunning.mockResolvedValue(false);

      await run('dev');
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  // ─── single agent stop ───────────────────────────────────────────────────────

  describe('single agent stop', () => {
    it('sends a stop-agent IPC request with the correct agent name', async () => {
      await run('dev');
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'stop-agent', agent: 'dev' })
      );
    });

    it('writes a .user-stop marker before the IPC call', async () => {
      await run('dev');
      const markerPath = join(homedir(), '.cortextos', 'default', 'state', 'dev', '.user-stop');
      expect(existsSync(markerPath)).toBe(true);
    });

    it('logs the success message returned by the daemon', async () => {
      mockSend.mockResolvedValue({ success: true, data: 'agent dev stopped' });
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await run('dev');
      expect(logSpy.mock.calls.flat().join('\n')).toContain('agent dev stopped');
    });

    it('exits with code 1 when the daemon returns an error', async () => {
      mockSend.mockResolvedValue({ success: false, error: 'agent not found' });
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
        throw new Error(`__EXIT_${code}__`);
      }) as never);

      await expect(run('dev')).rejects.toThrow(/__EXIT_1__/);
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('logs the error when daemon stop fails', async () => {
      mockSend.mockResolvedValue({ success: false, error: 'agent not found' });
      vi.spyOn(process, 'exit').mockImplementation((() => { throw new Error('exit'); }) as never);
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(run('dev')).rejects.toThrow();
      expect(errSpy.mock.calls.flat().join('\n')).toContain('agent not found');
    });

    it('respects a custom --instance value in the IPC call', async () => {
      await run('dev', '--instance', 'staging');
      const markerPath = join(homedir(), '.cortextos', 'staging', 'state', 'dev', '.user-stop');
      expect(existsSync(markerPath)).toBe(true);
    });
  });

  // ─── stop --all ──────────────────────────────────────────────────────────────

  describe('stop --all', () => {
    it('sends a list-agents request before stopping', async () => {
      mockSend
        .mockResolvedValueOnce({ success: true, data: ['dev', 'content'] })
        .mockResolvedValue({ success: true, data: 'stopped' });

      await run('--all');
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'list-agents' })
      );
    });

    it('exits with code 1 when list-agents fails', async () => {
      mockSend.mockResolvedValue({ success: false, error: 'IPC error' });
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
        throw new Error(`__EXIT_${code}__`);
      }) as never);

      await expect(run('--all')).rejects.toThrow(/__EXIT_1__/);
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('logs "No agents are running." when the agent list is empty', async () => {
      mockSend.mockResolvedValue({ success: true, data: [] });
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await run('--all');
      expect(logSpy.mock.calls.flat().join('\n')).toContain('No agents are running.');
    });

    it('writes a .user-stop marker for each running agent', async () => {
      mockSend
        .mockResolvedValueOnce({ success: true, data: ['dev', 'content'] })
        .mockResolvedValue({ success: true, data: 'stopped' });

      await run('--all');

      for (const agent of ['dev', 'content']) {
        const markerPath = join(homedir(), '.cortextos', 'default', 'state', agent, '.user-stop');
        expect(existsSync(markerPath)).toBe(true);
      }
    });

    it('sends a stop-agent IPC call for every listed agent', async () => {
      mockSend
        .mockResolvedValueOnce({ success: true, data: ['dev', 'content'] })
        .mockResolvedValue({ success: true, data: 'stopped' });

      await run('--all');

      // 1 list-agents + 2 stop-agent calls
      expect(mockSend).toHaveBeenCalledTimes(3);
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'stop-agent', agent: 'dev' }));
      expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'stop-agent', agent: 'content' }));
    });

    it('logs the pm2 daemon hint after stopping all agents', async () => {
      mockSend
        .mockResolvedValueOnce({ success: true, data: ['dev'] })
        .mockResolvedValue({ success: true, data: 'stopped' });
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await run('--all');
      expect(logSpy.mock.calls.flat().join('\n')).toContain('pm2 stop cortextos-daemon');
    });
  });
});
