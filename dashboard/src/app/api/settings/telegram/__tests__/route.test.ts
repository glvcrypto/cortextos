import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpFw = fs.mkdtempSync(path.join(os.tmpdir(), 'settings-telegram-'));
process.env.CTX_FRAMEWORK_ROOT = tmpFw;

type TelegramRoute = typeof import('../route');
let route: TelegramRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpFw, { recursive: true, force: true });
});

function writeAgentEnv(org: string, agent: string, content: string) {
  const agentDir = path.join(tmpFw, 'orgs', org, 'agents', agent);
  fs.mkdirSync(agentDir, { recursive: true });
  fs.writeFileSync(path.join(agentDir, '.env'), content);
}

// ---------------------------------------------------------------------------
// GET /api/settings/telegram
// ---------------------------------------------------------------------------

describe('GET /api/settings/telegram', () => {
  it('returns empty configs when no orgs exist', async () => {
    const res = await route.GET(new NextRequest('http://localhost/api/settings/telegram'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.configs).toEqual([]);
  });

  it('returns masked botToken for agent with BOT_TOKEN in .env', async () => {
    writeAgentEnv('glv', 'dev', 'BOT_TOKEN=1234567890abcdefghij\nCHAT_ID=987654321\n');

    const res = await route.GET(new NextRequest('http://localhost/api/settings/telegram'));
    const data = await res.json();
    const entry = data.configs.find(
      (c: { agent: string; org: string }) => c.agent === 'dev' && c.org === 'glv',
    );
    expect(entry).toBeTruthy();
    expect(entry.botToken).toMatch(/^\d{4}\*{4}/);
    expect(entry.botToken).not.toContain('1234567890abcdefghij');
    expect(entry.chatId).toBe('987654321');
  });

  it('returns "-" for missing botToken or chatId', async () => {
    writeAgentEnv('glv', 'seo', 'BOT_TOKEN=tok123456789abc\n');

    const res = await route.GET(new NextRequest('http://localhost/api/settings/telegram'));
    const data = await res.json();
    const entry = data.configs.find(
      (c: { agent: string }) => c.agent === 'seo',
    );
    expect(entry.chatId).toBe('-');
  });

  it('skips agents without a .env file', async () => {
    const agentDir = path.join(tmpFw, 'orgs', 'glv', 'agents', 'noenv');
    fs.mkdirSync(agentDir, { recursive: true });

    const res = await route.GET(new NextRequest('http://localhost/api/settings/telegram'));
    const data = await res.json();
    expect(data.configs.find((c: { agent: string }) => c.agent === 'noenv')).toBeUndefined();
  });

  it('accepts TELEGRAM_BOT_TOKEN key variant', async () => {
    writeAgentEnv('glv', 'boss', 'TELEGRAM_BOT_TOKEN=abcdefghijklmnopqrst\nTELEGRAM_CHAT_ID=111222333\n');

    const res = await route.GET(new NextRequest('http://localhost/api/settings/telegram'));
    const data = await res.json();
    const entry = data.configs.find((c: { agent: string }) => c.agent === 'boss');
    expect(entry).toBeTruthy();
    expect(entry.chatId).toBe('111222333');
  });
});
