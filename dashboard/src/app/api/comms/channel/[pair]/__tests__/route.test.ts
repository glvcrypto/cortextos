import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';

import { GET } from '../route';

const ctxRoot = getCTXRoot();
const logsBase = path.join(ctxRoot, 'logs');
const historyLog = path.join(ctxRoot, 'logs', 'message-history.jsonl');
const configPath = path.join(ctxRoot, 'config', 'enabled-agents.json');

// Two test agents — alphabetically sorted → pair key is "agentA--agentB"
const agentA = '__test_pair_a__';
const agentB = '__test_pair_b__';
const PAIR = `${agentA}--${agentB}`;

function makeReq(pair: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(
    `http://localhost/api/comms/channel/${pair}${qs ? '?' + qs : ''}`,
  );
}

function writeHistory(messages: object[]) {
  fs.mkdirSync(logsBase, { recursive: true });
  const lines = messages.map(m => JSON.stringify(m)).join('\n') + '\n';
  fs.appendFileSync(historyLog, lines);
}

function registerAgents() {
  // resolveIdentity reads enabled-agents.json to build the known-agents set.
  // Unrecognised names are normalised to canonicalUser, breaking pair-key matching.
  fs.mkdirSync(path.join(ctxRoot, 'config'), { recursive: true });
  let existing: Record<string, unknown> = {};
  try {
    const raw = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '';
    if (raw.trim()) existing = JSON.parse(raw);
  } catch { /* empty or malformed — start fresh */ }
  existing[agentA] = true;
  existing[agentB] = true;
  fs.writeFileSync(configPath, JSON.stringify(existing));
}

beforeEach(() => {
  registerAgents();
});

afterEach(() => {
  // Remove test agents from config
  if (fs.existsSync(configPath)) {
    const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    delete data[agentA];
    delete data[agentB];
    fs.writeFileSync(configPath, JSON.stringify(data));
  }
  if (fs.existsSync(historyLog)) {
    const remaining = fs.readFileSync(historyLog, 'utf-8').split('\n')
      .filter(l => l.trim() && !l.includes(agentA) && !l.includes(agentB));
    if (remaining.length) {
      fs.writeFileSync(historyLog, remaining.join('\n') + '\n');
    } else {
      fs.unlinkSync(historyLog);
    }
  }
  // Clean up agent log dirs
  for (const agent of [agentA, agentB]) {
    const dir = path.join(logsBase, agent);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// GET /api/comms/channel/[pair]
// ---------------------------------------------------------------------------

describe('GET /api/comms/channel/[pair]', () => {
  it('returns 400 for invalid pair format', async () => {
    const res = await GET(makeReq('single-agent'), { params: Promise.resolve({ pair: 'single-agent' }) });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid pair/i);
  });

  it('returns 400 when agent names contain invalid chars', async () => {
    const res = await GET(makeReq('bad agent!--dev'), { params: Promise.resolve({ pair: 'bad agent!--dev' }) });
    expect(res.status).toBe(400);
  });

  it('returns messages from message-history.jsonl for this pair', async () => {
    const now = new Date().toISOString();
    writeHistory([
      { id: `pair-1-${Date.now()}`, from: agentA, to: agentB, priority: 'normal', timestamp: now, text: 'hello pair', reply_to: null },
    ]);
    const res = await GET(makeReq(PAIR), { params: Promise.resolve({ pair: PAIR }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    const msg = body.find((m: { text: string }) => m.text === 'hello pair');
    expect(msg).toBeTruthy();
    expect(msg.from).toBe(agentA);
  });

  it('does not include messages from other pairs', async () => {
    const now = new Date().toISOString();
    const uniqueText = `pair-other-${Date.now()}`;
    writeHistory([
      { id: `pair-x1-${Date.now()}`, from: 'other-agent', to: 'another-agent', priority: 'normal', timestamp: now, text: uniqueText, reply_to: null },
    ]);
    const res = await GET(makeReq(PAIR), { params: Promise.resolve({ pair: PAIR }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.some((m: { text: string }) => m.text === uniqueText)).toBe(false);
  });

  it('applies before-cursor filter', async () => {
    const old = new Date(Date.now() - 3600_000).toISOString();
    const recent = new Date().toISOString();
    writeHistory([
      { id: `pair-old-${Date.now()}`, from: agentA, to: agentB, priority: 'normal', timestamp: old, text: 'old pair msg', reply_to: null },
      { id: `pair-new-${Date.now()}`, from: agentA, to: agentB, priority: 'normal', timestamp: recent, text: 'new pair msg', reply_to: null },
    ]);
    const before = new Date(Date.now() - 1800_000).toISOString();
    const res = await GET(makeReq(PAIR, { before }), { params: Promise.resolve({ pair: PAIR }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.some((m: { text: string }) => m.text === 'old pair msg')).toBe(true);
    expect(body.some((m: { text: string }) => m.text === 'new pair msg')).toBe(false);
  });

  it('applies search filter', async () => {
    const now = new Date().toISOString();
    const term = `uniquepairterm${Date.now()}`;
    writeHistory([
      { id: `pair-s1-${Date.now()}`, from: agentA, to: agentB, priority: 'normal', timestamp: now, text: `${term} found it`, reply_to: null },
      { id: `pair-s2-${Date.now()}`, from: agentA, to: agentB, priority: 'normal', timestamp: now, text: 'unrelated content', reply_to: null },
    ]);
    const res = await GET(makeReq(PAIR, { search: term }), { params: Promise.resolve({ pair: PAIR }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.some((m: { text: string }) => m.text.includes(term))).toBe(true);
    expect(body.some((m: { text: string }) => m.text === 'unrelated content')).toBe(false);
  });

  it('respects limit param', async () => {
    const msgs = Array.from({ length: 10 }, (_, i) => ({
      id: `pair-lim-${i}-${Date.now()}`,
      from: agentA, to: agentB, priority: 'normal',
      timestamp: new Date(Date.now() - i * 1000).toISOString(),
      text: `pair limit msg ${i}`, reply_to: null,
    }));
    writeHistory(msgs);
    const res = await GET(makeReq(PAIR, { limit: '3' }), { params: Promise.resolve({ pair: PAIR }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.length).toBeLessThanOrEqual(3);
  });
});
