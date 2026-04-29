import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { IPCServer, IPCClient } from '../../../src/daemon/ipc-server';
import type { IPCRequest } from '../../../src/types';

function createMockAgentManager() {
  return {
    getAllStatuses: vi.fn().mockReturnValue([{ name: 'dev', status: 'running' }]),
    getAgentNames: vi.fn().mockReturnValue(['dev', 'boss']),
    startAgent: vi.fn().mockResolvedValue(undefined),
    stopAgent: vi.fn().mockResolvedValue(undefined),
    restartAgent: vi.fn().mockResolvedValue(undefined),
    getFastChecker: vi.fn().mockReturnValue(undefined),
    spawnWorker: vi.fn().mockResolvedValue(undefined),
    terminateWorker: vi.fn().mockResolvedValue(undefined),
    listWorkers: vi.fn().mockReturnValue([{ name: 'worker-1' }]),
    injectWorker: vi.fn().mockReturnValue(true),
  };
}

describe('IPCServer / IPCClient', () => {
  let instanceId: string;
  let socketDir: string;
  let agentManager: ReturnType<typeof createMockAgentManager>;
  let server: IPCServer;
  let client: IPCClient;

  beforeEach(async () => {
    instanceId = `test-ipc-${process.pid}-${Date.now()}`;
    socketDir = join(homedir(), '.cortextos', instanceId);
    mkdirSync(socketDir, { recursive: true });
    agentManager = createMockAgentManager();
    server = new IPCServer(agentManager as any, instanceId);
    await server.start();
    client = new IPCClient(instanceId);
  });

  afterEach(() => {
    server.stop();
    rmSync(socketDir, { recursive: true, force: true });
  });

  // ── Basic read commands ────────────────────────────────────────────────────

  describe('status', () => {
    it('returns getAllStatuses data', async () => {
      const res = await client.send({ type: 'status' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual([{ name: 'dev', status: 'running' }]);
      expect(agentManager.getAllStatuses).toHaveBeenCalled();
    });
  });

  describe('list-agents', () => {
    it('returns getAgentNames data', async () => {
      const res = await client.send({ type: 'list-agents' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual(['dev', 'boss']);
      expect(agentManager.getAgentNames).toHaveBeenCalled();
    });
  });

  describe('list-workers', () => {
    it('returns listWorkers data', async () => {
      const res = await client.send({ type: 'list-workers' });
      expect(res.success).toBe(true);
      expect(res.data).toEqual([{ name: 'worker-1' }]);
      expect(agentManager.listWorkers).toHaveBeenCalled();
    });
  });

  describe('unknown command type', () => {
    it('returns error for unrecognised type', async () => {
      const res = await client.send({ type: 'totally-unknown' as IPCRequest['type'] });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/unknown command/i);
    });
  });

  // ── Agent lifecycle ────────────────────────────────────────────────────────

  describe('start-agent', () => {
    it('without agent name — error', async () => {
      const res = await client.send({ type: 'start-agent' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/agent name required/i);
    });

    it('with agent name — success, calls startAgent', async () => {
      const res = await client.send({ type: 'start-agent', agent: 'dev' });
      expect(res.success).toBe(true);
      expect(agentManager.startAgent).toHaveBeenCalledWith('dev', '');
    });
  });

  describe('stop-agent', () => {
    it('without agent name — error', async () => {
      const res = await client.send({ type: 'stop-agent' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/agent name required/i);
    });

    it('with agent name — success, calls stopAgent', async () => {
      const res = await client.send({ type: 'stop-agent', agent: 'dev' });
      expect(res.success).toBe(true);
      expect(agentManager.stopAgent).toHaveBeenCalledWith('dev');
    });
  });

  describe('restart-agent', () => {
    it('without agent name — error', async () => {
      const res = await client.send({ type: 'restart-agent' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/agent name required/i);
    });

    it('with agent name — success, calls restartAgent', async () => {
      const res = await client.send({ type: 'restart-agent', agent: 'dev' });
      expect(res.success).toBe(true);
      expect(agentManager.restartAgent).toHaveBeenCalledWith('dev');
    });
  });

  // ── Wake ───────────────────────────────────────────────────────────────────

  describe('wake', () => {
    it('without agent name — error', async () => {
      const res = await client.send({ type: 'wake' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/agent name required/i);
    });

    it('agent not found — error', async () => {
      agentManager.getFastChecker.mockReturnValue(undefined);
      const res = await client.send({ type: 'wake', agent: 'ghost' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/not found/i);
    });

    it('agent found — success, checker.wake() invoked', async () => {
      const mockChecker = { wake: vi.fn() };
      agentManager.getFastChecker.mockReturnValue(mockChecker);
      const res = await client.send({ type: 'wake', agent: 'dev' });
      expect(res.success).toBe(true);
      expect(mockChecker.wake).toHaveBeenCalled();
    });
  });

  // ── spawn-worker validation ────────────────────────────────────────────────

  describe('spawn-worker', () => {
    const validName = 'my-worker';
    const validDir = process.cwd();
    const validPrompt = 'Do some work';

    it('missing all data — error', async () => {
      const res = await client.send({ type: 'spawn-worker' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/name, dir, prompt/);
    });

    it('missing prompt — error', async () => {
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: validName, dir: validDir },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/name, dir, prompt/);
    });

    it('missing dir — error', async () => {
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: validName, prompt: validPrompt },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/name, dir, prompt/);
    });

    it('name with uppercase letter — invalid worker name', async () => {
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: 'MyWorker', dir: validDir, prompt: validPrompt },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/invalid worker name/i);
    });

    it('name longer than 64 chars — invalid worker name', async () => {
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: 'a'.repeat(65), dir: validDir, prompt: validPrompt },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/invalid worker name/i);
    });

    it('name with space — invalid worker name', async () => {
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: 'my worker', dir: validDir, prompt: validPrompt },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/invalid worker name/i);
    });

    it('dir outside ctxRoot and cwd — invalid worker dir', async () => {
      const saved = process.env.CTX_ROOT;
      delete process.env.CTX_ROOT;
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: validName, dir: '/etc', prompt: validPrompt },
      });
      if (saved !== undefined) process.env.CTX_ROOT = saved;
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/invalid worker dir/i);
    });

    it('dir = cwd — success, spawnWorker called', async () => {
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: validName, dir: validDir, prompt: validPrompt },
      });
      expect(res.success).toBe(true);
      expect(agentManager.spawnWorker).toHaveBeenCalledWith(
        validName, validDir, validPrompt, undefined, undefined,
      );
    });

    it('dir under cwd — success', async () => {
      const subDir = join(process.cwd(), 'src');
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: validName, dir: subDir, prompt: validPrompt },
      });
      expect(res.success).toBe(true);
      expect(agentManager.spawnWorker).toHaveBeenCalledWith(
        validName, subDir, validPrompt, undefined, undefined,
      );
    });

    it('dir = CTX_ROOT — success', async () => {
      const saved = process.env.CTX_ROOT;
      process.env.CTX_ROOT = socketDir;
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: validName, dir: socketDir, prompt: validPrompt },
      });
      if (saved !== undefined) process.env.CTX_ROOT = saved;
      else delete process.env.CTX_ROOT;
      expect(res.success).toBe(true);
    });

    it('name with all valid chars [a-z0-9_-] exactly 64 chars — success', async () => {
      const exactName = 'a'.repeat(64);
      expect(exactName.length).toBe(64);
      const res = await client.send({
        type: 'spawn-worker',
        data: { name: exactName, dir: validDir, prompt: validPrompt },
      });
      expect(res.success).toBe(true);
    });
  });

  // ── terminate-worker ───────────────────────────────────────────────────────

  describe('terminate-worker', () => {
    it('without name — error', async () => {
      const res = await client.send({ type: 'terminate-worker' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/requires: name/i);
    });

    it('with name — success, terminateWorker called', async () => {
      const res = await client.send({
        type: 'terminate-worker',
        data: { name: 'worker-1' },
      });
      expect(res.success).toBe(true);
      expect(agentManager.terminateWorker).toHaveBeenCalledWith('worker-1');
    });
  });

  // ── inject-worker ──────────────────────────────────────────────────────────

  describe('inject-worker', () => {
    it('without name — error', async () => {
      const res = await client.send({ type: 'inject-worker' });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/requires: name, text/i);
    });

    it('name only, no text — error', async () => {
      const res = await client.send({
        type: 'inject-worker',
        data: { name: 'worker-1' },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/requires: name, text/i);
    });

    it('both name + text, worker found — success', async () => {
      agentManager.injectWorker.mockReturnValue(true);
      const res = await client.send({
        type: 'inject-worker',
        data: { name: 'worker-1', text: 'hello' },
      });
      expect(res.success).toBe(true);
      expect(agentManager.injectWorker).toHaveBeenCalledWith('worker-1', 'hello');
    });

    it('both name + text, worker not found — error', async () => {
      agentManager.injectWorker.mockReturnValue(false);
      const res = await client.send({
        type: 'inject-worker',
        data: { name: 'missing', text: 'hello' },
      });
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/not found|not running/i);
    });
  });
});
