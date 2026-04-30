import { describe, it, expect, vi, beforeEach } from 'vitest';
import { injectMessage, sendKeySequence, selectOption, KEYS } from '../../../src/pty/inject';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('injectMessage', () => {
  it('wraps short content in bracketed paste escapes', () => {
    const writes: string[] = [];
    injectMessage((d) => writes.push(d), 'hello');
    expect(writes).toHaveLength(1);
    expect(writes[0]).toBe('\x1b[200~hello\x1b[201~');
  });

  it('sends Enter after enterDelay', () => {
    const writes: string[] = [];
    injectMessage((d) => writes.push(d), 'hello', 200);
    expect(writes).toHaveLength(1);
    vi.advanceTimersByTime(200);
    expect(writes).toHaveLength(2);
    expect(writes[1]).toBe(KEYS.ENTER);
  });

  it('chunks content longer than 4096 bytes', () => {
    const writes: string[] = [];
    const big = 'x'.repeat(5000);
    injectMessage((d) => writes.push(d), big);
    // PASTE_START + at least 2 chunks + PASTE_END = 4+ calls before Enter
    expect(writes.length).toBeGreaterThanOrEqual(4);
    expect(writes[0]).toBe('\x1b[200~');
    expect(writes[writes.length - 1]).toBe('\x1b[201~');
  });

  it('deferred Enter does not propagate PTY-closed exceptions', () => {
    const throwingWrite = (d: string) => {
      if (d === KEYS.ENTER) throw new Error('PTY closed');
    };
    injectMessage(throwingWrite, 'nudge', 50);
    // Should not throw when timer fires
    expect(() => vi.advanceTimersByTime(50)).not.toThrow();
  });
});

describe('sendKeySequence', () => {
  it('sends no keys for empty array', async () => {
    const writes: string[] = [];
    await sendKeySequence((d) => writes.push(d), []);
    expect(writes).toHaveLength(0);
  });

  it('sends keys in order', async () => {
    const writes: string[] = [];
    const promise = sendKeySequence((d) => writes.push(d), [KEYS.DOWN, KEYS.DOWN, KEYS.ENTER], 0);
    vi.runAllTimersAsync();
    await promise;
    expect(writes).toEqual([KEYS.DOWN, KEYS.DOWN, KEYS.ENTER]);
  });
});

describe('selectOption', () => {
  it('sends no DOWN keys for index 0, sends Enter', async () => {
    const writes: string[] = [];
    const promise = selectOption((d) => writes.push(d), 0, true);
    vi.runAllTimersAsync();
    await promise;
    expect(writes.filter(k => k === KEYS.DOWN)).toHaveLength(0);
    expect(writes).toContain(KEYS.ENTER);
  });

  it('sends correct number of DOWN keys for index 2, no Enter when submit=false', async () => {
    const writes: string[] = [];
    const promise = selectOption((d) => writes.push(d), 2, false);
    vi.runAllTimersAsync();
    await promise;
    expect(writes.filter(k => k === KEYS.DOWN)).toHaveLength(2);
    expect(writes).not.toContain(KEYS.ENTER);
  });
});
