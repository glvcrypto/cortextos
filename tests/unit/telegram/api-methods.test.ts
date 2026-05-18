import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TelegramAPI } from '../../../src/telegram/api';

const OK_RESPONSE = { ok: true, result: { message_id: 1 } };

function makeSuccessResponse(data: object = OK_RESPONSE): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeErrorResponse(description: string): Response {
  return new Response(JSON.stringify({ ok: false, description }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('TelegramAPI methods', () => {
  const origFetch = globalThis.fetch;
  let api: TelegramAPI;

  // Capture fetch calls for assertion
  type Call = { method: string; body: Record<string, unknown> };
  let calls: Call[];

  beforeEach(() => {
    calls = [];
    api = new TelegramAPI('123:TEST');
    globalThis.fetch = vi.fn(async (url: string, init?: RequestInit) => {
      const method = String(url).split('/').pop() ?? '';
      const body = JSON.parse((init?.body as string) ?? '{}');
      calls.push({ method, body });
      return makeSuccessResponse();
    }) as any;
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
    vi.restoreAllMocks();
  });

  // ── sendMessage ────────────────────────────────────────────────────────────

  describe('sendMessage', () => {
    it('sends correct payload with Markdown parse_mode by default', async () => {
      await api.sendMessage('999', 'hello world');
      expect(calls).toHaveLength(1);
      expect(calls[0].method).toBe('sendMessage');
      expect(calls[0].body.chat_id).toBe('999');
      expect(calls[0].body.text).toBe('hello world');
      expect(calls[0].body.parse_mode).toBe('Markdown');
    });

    it('includes reply_markup when provided', async () => {
      const kb = { inline_keyboard: [[{ text: 'Yes', callback_data: 'yes' }]] };
      await api.sendMessage('999', 'pick one', kb);
      expect(calls[0].body.reply_markup).toEqual(kb);
    });

    it('omits parse_mode when parseMode: null (plain-text opt-out)', async () => {
      await api.sendMessage('999', 'raw <text>', undefined, { parseMode: null });
      expect(calls[0].body.parse_mode).toBeUndefined();
    });

    it('sanitizes backslash before non-special chars (strips spurious escapes)', async () => {
      // \( is not a Markdown v1 special char — the backslash should be stripped.
      await api.sendMessage('999', 'hello\\(world');
      expect(calls[0].body.text).toBe('hello(world');
    });

    it('preserves backslash before Markdown special chars', async () => {
      // \_ and \* are valid Markdown v1 escapes — preserve them.
      await api.sendMessage('999', '\\_escaped\\_');
      expect(calls[0].body.text).toBe('\\_escaped\\_');
    });

    it('retries without parse_mode on parse-entity failure (fallback path)', async () => {
      let callCount = 0;
      globalThis.fetch = vi.fn(async (url: string, init?: RequestInit) => {
        callCount++;
        const body = JSON.parse((init?.body as string) ?? '{}');
        calls.push({ method: String(url).split('/').pop() ?? '', body });
        if (callCount === 1) return makeErrorResponse("can't parse entities: unexpected char");
        return makeSuccessResponse();
      }) as any;

      api = new TelegramAPI('123:TEST');
      await api.sendMessage('999', 'bad *markdown');

      // Two requests: first with parse_mode, second without.
      expect(calls).toHaveLength(2);
      expect(calls[0].body.parse_mode).toBe('Markdown');
      expect(calls[1].body.parse_mode).toBeUndefined();
    });

    it('calls onParseFallback when falling back to plain text', async () => {
      let callCount = 0;
      globalThis.fetch = vi.fn(async (_url: string, _init?: RequestInit) => {
        callCount++;
        if (callCount === 1) return makeErrorResponse("can't parse entities: unexpected char");
        return makeSuccessResponse();
      }) as any;

      api = new TelegramAPI('123:TEST');
      const fallbackReasons: string[] = [];
      await api.sendMessage('999', 'bad *md', undefined, {
        onParseFallback: (r) => fallbackReasons.push(r),
      });
      expect(fallbackReasons).toHaveLength(1);
      expect(fallbackReasons[0]).toMatch(/parse entities/i);
    });

    it('does NOT retry on non-parse errors (rethrows immediately)', async () => {
      globalThis.fetch = vi.fn(async () =>
        makeErrorResponse('chat not found'),
      ) as any;

      api = new TelegramAPI('123:TEST');
      await expect(api.sendMessage('999', 'hi')).rejects.toThrow(/chat not found/);
      // Only one attempt made
      expect((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1);
    });

    it('splits message longer than 4096 chars into two chunks', async () => {
      vi.useFakeTimers();
      api = new TelegramAPI('123:TEST');

      globalThis.fetch = vi.fn(async (url: string, init?: RequestInit) => {
        const body = JSON.parse((init?.body as string) ?? '{}');
        calls.push({ method: String(url).split('/').pop() ?? '', body });
        return makeSuccessResponse();
      }) as any;

      const long = 'x'.repeat(4097);
      const promise = api.sendMessage('999', long);
      // Advance the rate-limit timer (second chunk waits up to 1s)
      await vi.runAllTimersAsync();
      await promise;

      expect(calls).toHaveLength(2);
      expect(calls[0].body.text).toBe('x'.repeat(4096));
      expect(calls[1].body.text).toBe('x');
      // reply_markup only on last chunk
      expect(calls[0].body.reply_markup).toBeUndefined();

      vi.useRealTimers();
    });
  });

  // ── answerCallbackQuery ────────────────────────────────────────────────────

  describe('answerCallbackQuery', () => {
    it('sends correct payload with default text OK', async () => {
      await api.answerCallbackQuery('cbq-123');
      expect(calls[0].method).toBe('answerCallbackQuery');
      expect(calls[0].body.callback_query_id).toBe('cbq-123');
      expect(calls[0].body.text).toBe('OK');
    });

    it('sends custom text when provided', async () => {
      await api.answerCallbackQuery('cbq-123', 'Done!');
      expect(calls[0].body.text).toBe('Done!');
    });
  });

  // ── editMessageText ────────────────────────────────────────────────────────

  describe('editMessageText', () => {
    it('sends correct payload without reply_markup', async () => {
      await api.editMessageText('999', 42, 'updated text');
      expect(calls[0].method).toBe('editMessageText');
      expect(calls[0].body).toMatchObject({ chat_id: '999', message_id: 42, text: 'updated text' });
      expect(calls[0].body.reply_markup).toBeUndefined();
    });

    it('includes reply_markup when provided', async () => {
      const kb = { inline_keyboard: [[{ text: 'OK', callback_data: 'ok' }]] };
      await api.editMessageText('999', 42, 'updated', kb);
      expect(calls[0].body.reply_markup).toEqual(kb);
    });
  });

  // ── sendChatAction ─────────────────────────────────────────────────────────

  describe('sendChatAction', () => {
    it('defaults to typing action', async () => {
      await api.sendChatAction('999');
      expect(calls[0].method).toBe('sendChatAction');
      expect(calls[0].body.action).toBe('typing');
    });

    it('passes custom action through', async () => {
      await api.sendChatAction('999', 'upload_photo');
      expect(calls[0].body.action).toBe('upload_photo');
    });
  });

  // ── setMyCommands ──────────────────────────────────────────────────────────

  describe('setMyCommands', () => {
    it('sends commands array correctly', async () => {
      const cmds = [
        { command: 'start', description: 'Start the bot' },
        { command: 'help', description: 'Show help' },
      ];
      await api.setMyCommands(cmds);
      expect(calls[0].method).toBe('setMyCommands');
      expect(calls[0].body.commands).toEqual(cmds);
    });
  });

  // ── post error handling ────────────────────────────────────────────────────

  describe('post error handling', () => {
    it('throws with API description on non-ok response', async () => {
      globalThis.fetch = vi.fn(async () =>
        makeErrorResponse('Forbidden: bot was blocked by the user'),
      ) as any;
      api = new TelegramAPI('123:TEST');
      await expect(api.sendChatAction('999')).rejects.toThrow(/bot was blocked/);
    });

  });
});
