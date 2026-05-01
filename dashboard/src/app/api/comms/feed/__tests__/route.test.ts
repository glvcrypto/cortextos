import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';

import { GET } from '../route';

const ctxRoot = getCTXRoot();
const inboxBase = path.join(ctxRoot, 'inbox');
const logsBase = path.join(ctxRoot, 'logs');
const historyLog = path.join(ctxRoot, 'logs', 'message-history.jsonl');

const agentFeed = '__test_feed_agent__';

function makeReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/comms/feed${qs ? '?' + qs : ''}`);
}

function writeHistory(messages: object[]) {
  fs.mkdirSync(logsBase, { recursive: true });
  fs.mkdirSync(inboxBase, { recursive: true });
  const append = messages.map(m => JSON.stringify(m)).join('\n') + '\n';
  fs.appendFileSync(historyLog, append);
}

afterEach(() => {
  // Remove test messages from history log
  if (fs.existsSync(historyLog)) {
    const lines = fs.readFileSync(historyLog, 'utf-8').split('\n')
      .filter(l => l.trim() && !l.includes(agentFeed));
    if (lines.length) {
      fs.writeFileSync(historyLog, lines.join('\n') + '\n');
    } else {
      fs.unlinkSync(historyLog);
    }
  }
  // Clean up test agent log dir
  const dir = path.join(logsBase, agentFeed);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  // Remove test inbox entry
  const agentInbox = path.join(inboxBase, agentFeed);
  if (fs.existsSync(agentInbox)) fs.rmSync(agentInbox, { recursive: true });
});

// ---------------------------------------------------------------------------
// GET /api/comms/feed
// ---------------------------------------------------------------------------

describe('GET /api/comms/feed', () => {
  it('returns 200 with an array response', async () => {
    fs.mkdirSync(inboxBase, { recursive: true });
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  it('returns messages from message-history.jsonl', async () => {
    const ts = new Date().toISOString();
    writeHistory([
      { id: `feed-1-${Date.now()}`, from: agentFeed, to: 'user', priority: 'normal', timestamp: ts, text: 'hello feed', reply_to: null },
    ]);
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    const msg = body.find((m: { text: string }) => m.text === 'hello feed');
    expect(msg).toBeTruthy();
    expect(msg.from).toBe(agentFeed);
  });

  it('filters by agent (sender or recipient)', async () => {
    const ts = new Date().toISOString();
    const uniqueText = `feed-agent-filter-${Date.now()}`;
    writeHistory([
      { id: `feed-f1-${Date.now()}`, from: agentFeed, to: 'user', priority: 'normal', timestamp: ts, text: uniqueText, reply_to: null },
    ]);
    const res = await GET(makeReq({ agent: agentFeed }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.some((m: { text: string }) => m.text === uniqueText)).toBe(true);
    // All returned messages should involve the agent
    for (const m of body) {
      expect(m.from === agentFeed || m.to === agentFeed).toBe(true);
    }
  });

  it('filters by search term (word boundary)', async () => {
    const ts = new Date().toISOString();
    const uniqueWord = `xyzunique${Date.now()}`;
    writeHistory([
      { id: `feed-s1-${Date.now()}`, from: agentFeed, to: 'user', priority: 'normal', timestamp: ts, text: `${uniqueWord} task done`, reply_to: null },
      { id: `feed-s2-${Date.now()}`, from: agentFeed, to: 'user', priority: 'normal', timestamp: ts, text: 'unrelated message', reply_to: null },
    ]);
    const res = await GET(makeReq({ search: uniqueWord }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const match = body.find((m: { text: string }) => m.text.includes(uniqueWord));
    expect(match).toBeTruthy();
    const noMatch = body.find((m: { text: string }) => m.text === 'unrelated message');
    expect(noMatch).toBeUndefined();
  });

  it('applies before cursor for pagination', async () => {
    const old = new Date(Date.now() - 3600_000).toISOString();
    const recent = new Date().toISOString();
    writeHistory([
      { id: `feed-p1-${Date.now()}`, from: agentFeed, to: 'user', priority: 'normal', timestamp: old, text: 'old feed msg', reply_to: null },
      { id: `feed-p2-${Date.now()}`, from: agentFeed, to: 'user', priority: 'normal', timestamp: recent, text: 'new feed msg', reply_to: null },
    ]);
    const res = await GET(makeReq({ before: new Date(Date.now() - 1800_000).toISOString(), agent: agentFeed }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.some((m: { text: string }) => m.text === 'old feed msg')).toBe(true);
    expect(body.some((m: { text: string }) => m.text === 'new feed msg')).toBe(false);
  });

  it('respects limit parameter', async () => {
    fs.mkdirSync(inboxBase, { recursive: true });
    fs.mkdirSync(logsBase, { recursive: true });
    const msgs = Array.from({ length: 10 }, (_, i) => ({
      id: `feed-lim-${i}-${Date.now()}`,
      from: agentFeed, to: 'user', priority: 'normal',
      timestamp: new Date(Date.now() - i * 1000).toISOString(),
      text: `feed limit msg ${i}`, reply_to: null,
    }));
    writeHistory(msgs);
    const res = await GET(makeReq({ agent: agentFeed, limit: '3' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBeLessThanOrEqual(3);
  });
});
