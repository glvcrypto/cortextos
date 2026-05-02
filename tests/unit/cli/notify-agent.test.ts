import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../../src/bus/agents.js', () => ({
  notifyAgent: vi.fn(),
}));

vi.mock('../../../src/utils/paths.js', () => ({
  resolvePaths: vi.fn(() => ({ inbox: '/tmp/inbox', outbox: '/tmp/outbox' })),
}));

import { notifyAgentCommand } from '../../../src/cli/notify-agent.js';
import { notifyAgent } from '../../../src/bus/agents.js';

describe('notify-agent command', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls notifyAgent with positional args and default options', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await notifyAgentCommand.parseAsync(['node', 'cli', 'boss', 'urgent task']);
    expect(notifyAgent).toHaveBeenCalledWith(
      expect.any(Object), // paths
      'cli',              // default --from
      'boss',             // target name
      'urgent task',      // message
      expect.stringContaining('.cortextos'), // ctxRoot
    );
    expect(logSpy).toHaveBeenCalledWith('Signal sent to boss');
  });

  it('passes custom --from option through to notifyAgent', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await notifyAgentCommand.parseAsync(
      ['node', 'cli', 'analyst', 'check metrics', '--from', 'dev'],
    );
    expect(notifyAgent).toHaveBeenCalledWith(
      expect.any(Object),
      'dev',
      'analyst',
      'check metrics',
      expect.any(String),
    );
  });

  it('uses custom --instance in ctxRoot path', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await notifyAgentCommand.parseAsync(
      ['node', 'cli', 'worker', 'hello', '--instance', 'staging'],
    );
    expect(notifyAgent).toHaveBeenCalledWith(
      expect.any(Object),
      'cli',
      'worker',
      'hello',
      expect.stringContaining('staging'),
    );
  });

  it('logs the target agent name in confirmation message', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await notifyAgentCommand.parseAsync(['node', 'cli', 'seo', 'ping']);
    expect(logSpy).toHaveBeenCalledWith('Signal sent to seo');
  });
});
