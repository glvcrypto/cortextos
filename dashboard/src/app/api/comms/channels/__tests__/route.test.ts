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
const configPath = path.join(ctxRoot, 'config', 'enabled-agents.json');

const agentA = '__test_comms_a__';
const agentB = '__test_comms_b__';

function setupAgents() {
  fs.mkdirSync(path.join(ctxRoot, 'config'), { recursive: true });
  fs.mkdirSync(inboxBase, { recursive: true });
  const existing = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf-8')) : {};
  existing[agentA] = true;
  existing[agentB] = true;
  fs.writeFileSync(configPath, JSON.stringify(existing));
}

function writeHistory(messages: object[]) {
  fs.mkdirSync(logsBase, { recursive: true });
  const append = messages.map(m => JSON.stringify(m)).join('\n') + '\n';
  fs.appendFileSync(historyLog, append);
}

function makeReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/comms/channels${qs ? '?' + qs : ''}`);
}

afterEach(() => {
  // Remove test agent entries from config
  if (fs.existsSync(configPath)) {
    const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    delete data[agentA];
    delete data[agentB];
    fs.writeFileSync(configPath, JSON.stringify(data));
  }
  // Remove test messages from history log
  if (fs.existsSync(historyLog)) {
    const lines = fs.readFileSync(historyLog, 'utf-8').split('\n')
      .filter(l => l.trim() && !l.includes(agentA) && !l.includes(agentB));
    if (lines.length) {
      fs.writeFileSync(historyLog, lines.join('\n') + '\n');
    } else {
      fs.unlinkSync(historyLog);
    }
  }
  // Clean up test agent log dirs
  for (const agent of [agentA, agentB]) {
    const dir = path.join(logsBase, agent);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// GET /api/comms/channels
// ---------------------------------------------------------------------------

describe('GET /api/comms/channels', () => {
  it('returns 200 with an array response', async () => {
    setupAgents();
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  it('groups messages by pair from message-history.jsonl', async () => {
    setupAgents();
    const now = new Date().toISOString();
    writeHistory([
      { id: 'h1', from: agentA, to: agentB, priority: 'normal', timestamp: now, text: 'ping', reply_to: null },
      { id: 'h2', from: agentB, to: agentA, priority: 'normal', timestamp: now, text: 'pong', reply_to: null },
    ]);
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const channels = await res.json();
    const pair = channels.find((c: { agents: string[] }) =>
      c.agents.includes(agentA) && c.agents.includes(agentB));
    expect(pair).toBeTruthy();
    expect(pair.message_count).toBe(2);
  });

  it('excludes archived channels by default', async () => {
    setupAgents();
    // Old timestamp — more than 7 days ago
    const oldTs = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    writeHistory([
      { id: 'h3', from: agentA, to: agentB, priority: 'normal', timestamp: oldTs, text: 'old msg', reply_to: null },
    ]);
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const channels = await res.json();
    const pair = channels.find((c: { agents: string[] }) =>
      c.agents.includes(agentA) && c.agents.includes(agentB));
    expect(pair).toBeUndefined();
  });

  it('includes archived channels when include_archived=true', async () => {
    setupAgents();
    const oldTs = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    writeHistory([
      { id: 'h4', from: agentA, to: agentB, priority: 'normal', timestamp: oldTs, text: 'stale', reply_to: null },
    ]);
    const res = await GET(makeReq({ include_archived: 'true' }));
    expect(res.status).toBe(200);
    const channels = await res.json();
    const pair = channels.find((c: { agents: string[]; archived: boolean }) =>
      c.agents.includes(agentA) && c.agents.includes(agentB));
    expect(pair).toBeTruthy();
    expect(pair.archived).toBe(true);
  });

  it('reads inbound/outbound JSONL from agent log dirs', async () => {
    setupAgents();
    const now = new Date().toISOString();
    const dir = path.join(logsBase, agentA);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'inbound-messages.jsonl'),
      JSON.stringify({ message_id: 'tg1', text: 'hello from user', timestamp: now, from_name: 'user' }) + '\n');
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    const channels = await res.json();
    // Should have at least one channel involving agentA
    const found = channels.some((c: { agents: string[] }) => c.agents.includes(agentA));
    expect(found).toBe(true);
  });
});
