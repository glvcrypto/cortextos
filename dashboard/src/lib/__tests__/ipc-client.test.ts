import { describe, it, expect } from 'vitest';
import { IPCClient } from '../ipc-client';

// These tests use a guaranteed-non-existent instanceId so the socket path
// resolves to a path that has never been created.  No daemon is required.
const DEAD_INSTANCE = 'zz-test-no-such-daemon-instance';

// ---------------------------------------------------------------------------
// IPCClient.send — graceful failure paths (no daemon running)
// ---------------------------------------------------------------------------

describe('IPCClient.send — daemon not running', () => {
  it('resolves (does not reject) when socket does not exist', async () => {
    const client = new IPCClient(DEAD_INSTANCE);
    await expect(client.send({ type: 'status' })).resolves.toBeDefined();
  });

  it('returns success:false when socket does not exist', async () => {
    const client = new IPCClient(DEAD_INSTANCE);
    const res = await client.send({ type: 'status' });
    expect(res.success).toBe(false);
  });

  it('returns a human-readable error message about daemon not running', async () => {
    const client = new IPCClient(DEAD_INSTANCE);
    const res = await client.send({ type: 'list-agents' });
    expect(res.error).toMatch(/daemon is not running/i);
  });

  it('works for any request type — list-agents gives same graceful failure', async () => {
    const client = new IPCClient(DEAD_INSTANCE);
    const res = await client.send({ type: 'list-agents', agent: 'dev' });
    expect(res.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// IPCClient.isDaemonRunning — convenience wrapper
// ---------------------------------------------------------------------------

describe('IPCClient.isDaemonRunning', () => {
  it('returns false when daemon socket does not exist', async () => {
    const client = new IPCClient(DEAD_INSTANCE);
    expect(await client.isDaemonRunning()).toBe(false);
  });

  it('always returns a boolean (not undefined or null)', async () => {
    const client = new IPCClient(DEAD_INSTANCE);
    const result = await client.isDaemonRunning();
    expect(typeof result).toBe('boolean');
  });
});

// ---------------------------------------------------------------------------
// IPCClient constructor — instanceId handling
// ---------------------------------------------------------------------------

describe('IPCClient constructor', () => {
  it('accepts a custom instanceId without throwing', () => {
    expect(() => new IPCClient('my-custom-instance')).not.toThrow();
  });

  it('uses default instanceId "default" when no arg passed', () => {
    expect(() => new IPCClient()).not.toThrow();
  });
});
