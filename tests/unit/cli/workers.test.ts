import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

// Mock IPCClient so tests never touch a real Unix socket
vi.mock('../../../src/daemon/ipc-server.js', () => ({
  IPCClient: vi.fn(),
}));

// Mock resolveEnv so we don't read real config files
vi.mock('../../../src/utils/env.js', () => ({
  resolveEnv: vi.fn(() => ({ instanceId: 'default' })),
}));

import { IPCClient } from '../../../src/daemon/ipc-server.js';
import {
  spawnWorkerCommand,
  terminateWorkerCommand,
  listWorkersCommand,
  injectWorkerCommand,
} from '../../../src/cli/workers.js';

const MockIPCClient = IPCClient as unknown as { prototype: { send: ReturnType<typeof vi.fn> } };

describe('spawn-worker command', () => {
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    MockIPCClient.prototype = { send: sendMock };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends spawn-worker IPC and logs success', async () => {
    sendMock.mockResolvedValue({ success: true });
    await spawnWorkerCommand.parseAsync(
      ['node', 'cli', 'my-worker', '--dir', '/tmp/work', '--prompt', 'do the thing'],
    );
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'spawn-worker' }),
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('my-worker'));
  });

  it('exits 1 and logs error on failure response', async () => {
    sendMock.mockResolvedValue({ success: false, error: 'daemon unavailable' });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(
      spawnWorkerCommand.parseAsync(
        ['node', 'cli', 'bad-worker', '--dir', '/tmp', '--prompt', 'fail'],
      ),
    ).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('daemon unavailable'));
  });
});

describe('terminate-worker command', () => {
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    MockIPCClient.prototype = { send: sendMock };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends terminate-worker IPC and logs confirmation', async () => {
    sendMock.mockResolvedValue({ success: true });
    await terminateWorkerCommand.parseAsync(['node', 'cli', 'my-worker']);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'terminate-worker', data: { name: 'my-worker' } }),
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('terminating'));
  });

  it('exits 1 on failure', async () => {
    sendMock.mockResolvedValue({ success: false, error: 'not found' });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(
      terminateWorkerCommand.parseAsync(['node', 'cli', 'ghost']),
    ).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('list-workers command', () => {
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    MockIPCClient.prototype = { send: sendMock };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs "No active workers" when response data is empty', async () => {
    sendMock.mockResolvedValue({ success: true, data: [] });
    await listWorkersCommand.parseAsync(['node', 'cli']);
    expect(console.log).toHaveBeenCalledWith('No active workers');
  });

  it('logs worker name and status for each worker in response', async () => {
    sendMock.mockResolvedValue({
      success: true,
      data: [
        { name: 'worker-a', status: 'running', pid: 1234, dir: '/tmp/w', spawnedAt: new Date().toISOString() },
      ],
    });
    await listWorkersCommand.parseAsync(['node', 'cli']);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('worker-a'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('running'));
  });

  it('exits 1 on IPC failure', async () => {
    sendMock.mockResolvedValue({ success: false, error: 'daemon down' });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(
      listWorkersCommand.parseAsync(['node', 'cli']),
    ).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('inject-worker command', () => {
  let sendMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendMock = vi.fn();
    MockIPCClient.prototype = { send: sendMock };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends inject-worker IPC with name and text', async () => {
    sendMock.mockResolvedValue({ success: true });
    await injectWorkerCommand.parseAsync(['node', 'cli', 'worker-b', 'continue']);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'inject-worker',
        data: { name: 'worker-b', text: 'continue' },
      }),
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('worker-b'));
  });

  it('exits 1 on failure', async () => {
    sendMock.mockResolvedValue({ success: false, error: 'worker not found' });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    await expect(
      injectWorkerCommand.parseAsync(['node', 'cli', 'ghost', 'text']),
    ).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
