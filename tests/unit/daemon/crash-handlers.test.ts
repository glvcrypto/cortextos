import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  recordCrash,
  resetCrashHistory,
  getCrashCountInWindow,
  CRASH_ALERT_THRESHOLD,
  sendOperatorAlert,
} from '../../../src/daemon/crash-handlers';

beforeEach(() => {
  resetCrashHistory();
});

describe('recordCrash', () => {
  it('returns 1 on first crash', () => {
    expect(recordCrash()).toBe(1);
  });

  it('accumulates crashes within the 15-min window', () => {
    const base = Date.now();
    recordCrash(base);
    recordCrash(base + 1000);
    expect(getCrashCountInWindow()).toBe(2);
  });

  it('purges entries older than 15 minutes', () => {
    const old = Date.now() - 16 * 60 * 1000;
    recordCrash(old);
    expect(getCrashCountInWindow()).toBe(1); // before purge
    // next recordCrash with current time purges old entry
    const count = recordCrash(Date.now());
    expect(count).toBe(1); // old entry evicted
  });

  it('reaches CRASH_ALERT_THRESHOLD correctly', () => {
    const base = Date.now();
    for (let i = 0; i < CRASH_ALERT_THRESHOLD - 1; i++) {
      expect(recordCrash(base + i * 100)).toBeLessThan(CRASH_ALERT_THRESHOLD);
    }
    expect(recordCrash(base + CRASH_ALERT_THRESHOLD * 100)).toBe(CRASH_ALERT_THRESHOLD);
  });
});

describe('resetCrashHistory', () => {
  it('clears all recorded crashes', () => {
    recordCrash();
    recordCrash();
    resetCrashHistory();
    expect(getCrashCountInWindow()).toBe(0);
  });
});

describe('sendOperatorAlert', () => {
  it('no-ops when BOT_TOKEN is absent', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const saved = process.env.BOT_TOKEN;
    delete process.env.BOT_TOKEN;
    await sendOperatorAlert(new Error('test'));
    expect(fetchSpy).not.toHaveBeenCalled();
    if (saved !== undefined) process.env.BOT_TOKEN = saved;
    fetchSpy.mockRestore();
  });

  it('no-ops when CHAT_ID is absent', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    process.env.BOT_TOKEN = 'fake-token';
    const saved = process.env.CHAT_ID;
    delete process.env.CHAT_ID;
    await sendOperatorAlert(new Error('test'));
    expect(fetchSpy).not.toHaveBeenCalled();
    delete process.env.BOT_TOKEN;
    if (saved !== undefined) process.env.CHAT_ID = saved;
    fetchSpy.mockRestore();
  });

  it('sends Telegram request when credentials are present', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    process.env.BOT_TOKEN = 'bot123';
    process.env.CHAT_ID = 'chat456';
    await sendOperatorAlert(new Error('PTY null-write'));
    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, opts] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('bot123/sendMessage');
    const body = JSON.parse(opts.body as string) as Record<string, unknown>;
    expect(body.chat_id).toBe('chat456');
    expect(String(body.text)).toContain('PTY null-write');
    delete process.env.BOT_TOKEN;
    delete process.env.CHAT_ID;
    fetchSpy.mockRestore();
  });

  it('swallows fetch errors silently', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'));
    process.env.BOT_TOKEN = 'bot123';
    process.env.CHAT_ID = 'chat456';
    await expect(sendOperatorAlert('boom')).resolves.toBeUndefined();
    delete process.env.BOT_TOKEN;
    delete process.env.CHAT_ID;
    fetchSpy.mockRestore();
  });
});
