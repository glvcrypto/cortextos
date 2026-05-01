import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

import { GET } from '../route';

const instanceId = process.env.CTX_INSTANCE_ID ?? 'default';
const logsBase = path.join(os.homedir(), '.cortextos', instanceId, 'logs');

const testAgent1 = '__test_cmd_agent1__';
const testAgent2 = '__test_cmd_agent2__';

function writeInbound(agent: string, messages: object[]) {
  const dir = path.join(logsBase, agent);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'inbound-messages.jsonl'),
    messages.map((m) => JSON.stringify(m)).join('\n')
  );
}

function makeReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/commands${qs ? '?' + qs : ''}`);
}

afterEach(() => {
  for (const agent of [testAgent1, testAgent2]) {
    const dir = path.join(logsBase, agent);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// GET /api/commands
// ---------------------------------------------------------------------------

describe('GET /api/commands', () => {
  it('returns empty array when logs dir does not exist', async () => {
    // Use a non-existent instance so logsBase won't exist
    const originalHome = process.env.HOME;
    process.env.HOME = path.join(os.tmpdir(), 'nonexistent-home-' + Date.now());
    try {
      const res = await GET(makeReq());
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual([]);
    } finally {
      process.env.HOME = originalHome;
    }
  });

  it('returns commands from all agents when no filter', async () => {
    // Use far-future timestamps so test entries always sort to the top of results
    writeInbound(testAgent1, [
      { message_id: 1, from: 10, from_name: 'Alice', chat_id: 99, text: 'hello', timestamp: '2099-12-31T10:00:00Z' },
    ]);
    writeInbound(testAgent2, [
      { message_id: 2, from: 11, from_name: 'Bob', chat_id: 99, text: '/status', timestamp: '2099-12-31T09:00:00Z' },
    ]);
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    const agents = body.commands.map((c: { agent: string }) => c.agent);
    expect(agents).toContain(testAgent1);
    expect(agents).toContain(testAgent2);
    expect(body.total).toBeGreaterThanOrEqual(2);
  });

  it('filters by agent name', async () => {
    writeInbound(testAgent1, [
      { message_id: 1, from: 10, from_name: 'Alice', chat_id: 99, text: 'only-agent1', timestamp: '2026-01-01T10:00:00Z' },
    ]);
    writeInbound(testAgent2, [
      { message_id: 2, from: 11, from_name: 'Bob', chat_id: 99, text: 'only-agent2', timestamp: '2026-01-01T09:00:00Z' },
    ]);
    const res = await GET(makeReq({ agent: testAgent1 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const agents = new Set(body.commands.map((c: { agent: string }) => c.agent));
    expect(agents.has(testAgent1)).toBe(true);
    expect(agents.has(testAgent2)).toBe(false);
  });

  it('marks slash commands with is_slash true', async () => {
    writeInbound(testAgent1, [
      { message_id: 1, from: 10, from_name: 'Alice', chat_id: 99, text: '/help', timestamp: '2026-01-01T10:00:00Z' },
      { message_id: 2, from: 10, from_name: 'Alice', chat_id: 99, text: 'plain message', timestamp: '2026-01-01T10:01:00Z' },
    ]);
    const res = await GET(makeReq({ agent: testAgent1 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const slash = body.commands.find((c: { text: string }) => c.text === '/help');
    const plain = body.commands.find((c: { text: string }) => c.text === 'plain message');
    expect(slash?.is_slash).toBe(true);
    expect(plain?.is_slash).toBe(false);
  });

  it('sorts newest first', async () => {
    writeInbound(testAgent1, [
      { message_id: 1, from: 10, from_name: 'Alice', chat_id: 99, text: 'old', timestamp: '2026-01-01T08:00:00Z' },
      { message_id: 2, from: 10, from_name: 'Alice', chat_id: 99, text: 'new', timestamp: '2026-01-01T12:00:00Z' },
    ]);
    const res = await GET(makeReq({ agent: testAgent1 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const relevant = body.commands.filter((c: { agent: string }) => c.agent === testAgent1);
    expect(relevant[0].text).toBe('new');
    expect(relevant[1].text).toBe('old');
  });

  it('paginates with limit and offset', async () => {
    const messages = Array.from({ length: 5 }, (_, i) => ({
      message_id: i + 1,
      from: 10,
      from_name: 'Alice',
      chat_id: 99,
      text: `msg-${i + 1}`,
      timestamp: `2026-01-01T${String(i + 10).padStart(2, '0')}:00:00Z`,
    }));
    writeInbound(testAgent1, messages);
    const res = await GET(makeReq({ agent: testAgent1, limit: '2', offset: '1' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.commands).toHaveLength(2);
    expect(body.total).toBe(5);
  });
});
