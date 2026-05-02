import { describe, it, expect, vi } from 'vitest';
import { sendCompactNotification } from '../../../src/hooks/hook-compact-telegram.js';
import { buildPermissionMessage } from '../../../src/hooks/hook-permission-telegram.js';

// ─── sendCompactNotification ─────────────────────────────────────────────────

describe('sendCompactNotification', () => {
  it('returns early without calling fetch when botToken is missing', async () => {
    const mockFetch = vi.fn();
    await sendCompactNotification({ chatId: '123' }, mockFetch as any);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns early without calling fetch when chatId is missing', async () => {
    const mockFetch = vi.fn();
    await sendCompactNotification({ botToken: 'tok' }, mockFetch as any);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls fetch with the correct Telegram sendMessage URL', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    await sendCompactNotification({ botToken: 'mytoken', chatId: '42' }, mockFetch as any);
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.telegram.org/botmytoken/sendMessage');
  });

  it('sends correct chat_id and compacting text in body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    await sendCompactNotification({ botToken: 'tok', chatId: '99', agentName: 'dev' }, mockFetch as any);
    const [, init] = mockFetch.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.chat_id).toBe('99');
    expect(body.text).toBe('[dev] Context compacting... resuming shortly');
  });

  it('defaults agentName to "agent" when not provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    await sendCompactNotification({ botToken: 'tok', chatId: '1' }, mockFetch as any);
    const [, init] = mockFetch.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.text).toBe('[agent] Context compacting... resuming shortly');
  });

  it('attaches an AbortSignal to the fetch call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    await sendCompactNotification({ botToken: 'tok', chatId: '1', agentName: 'x' }, mockFetch as any);
    const [, init] = mockFetch.mock.calls[0];
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('does not throw when fetch rejects', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('network error'));
    await expect(
      sendCompactNotification({ botToken: 'tok', chatId: '1' }, mockFetch as any)
    ).resolves.toBeUndefined();
  });

  it('does not throw when fetch throws synchronously (abort signal fires)', async () => {
    const mockFetch = vi.fn().mockImplementation(() => { throw new Error('abort'); });
    await expect(
      sendCompactNotification({ botToken: 'tok', chatId: '1' }, mockFetch as any)
    ).resolves.toBeUndefined();
  });
});

// ─── buildPermissionMessage ───────────────────────────────────────────────────

describe('buildPermissionMessage', () => {
  it('includes PERMISSION REQUEST header', () => {
    const msg = buildPermissionMessage('dev', 'Bash', 'ls');
    expect(msg).toContain('PERMISSION REQUEST');
  });

  it('includes agent name and tool name', () => {
    const msg = buildPermissionMessage('seo', 'Edit', 'file.txt');
    expect(msg).toContain('Agent: seo');
    expect(msg).toContain('Tool: Edit');
  });

  it('wraps summary in a fenced code block', () => {
    const msg = buildPermissionMessage('dev', 'Bash', 'echo hello');
    expect(msg).toContain('```\necho hello\n```');
  });

  it('does not truncate when message is under 3800 chars', () => {
    const msg = buildPermissionMessage('dev', 'Bash', 'short');
    expect(msg).not.toContain('...(truncated)');
    expect(msg.length).toBeLessThan(3800);
  });

  it('truncates at 3800 chars and appends ...(truncated) when summary is very long', () => {
    const longSummary = 'x'.repeat(4000);
    const msg = buildPermissionMessage('dev', 'Write', longSummary);
    expect(msg.endsWith('...(truncated)')).toBe(true);
    expect(msg.length).toBe(3800 + '...(truncated)'.length);
  });

  it('escapes triple-backticks in summary via sanitizeCodeBlock', () => {
    const msg = buildPermissionMessage('dev', 'Bash', 'echo ```hello```');
    // sanitizeCodeBlock replaces ``` with ``\` to prevent premature code-fence close
    expect(msg).not.toContain('```hello```');
    expect(msg).toContain('``\\`hello``\\`');
  });
});
