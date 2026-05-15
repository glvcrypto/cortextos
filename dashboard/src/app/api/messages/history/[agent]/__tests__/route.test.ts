import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';

import { GET } from '../route';

function makeParams(agent: string) {
  return { params: Promise.resolve({ agent }) };
}

function makeReq(agent: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/messages/history/${agent}${qs ? '?' + qs : ''}`);
}

const ctxRoot = getCTXRoot();
const testAgent = '__test_hist_agent__';
const logDir = path.join(ctxRoot, 'logs', testAgent);

function writeOutbound(messages: object[]) {
  fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(path.join(logDir, 'outbound-messages.jsonl'),
    messages.map(m => JSON.stringify(m)).join('\n'));
}

function writeInbound(messages: object[]) {
  fs.mkdirSync(logDir, { recursive: true });
  fs.writeFileSync(path.join(logDir, 'inbound-messages.jsonl'),
    messages.map(m => JSON.stringify(m)).join('\n'));
}

afterEach(() => {
  if (fs.existsSync(logDir)) fs.rmSync(logDir, { recursive: true });
});

// ---------------------------------------------------------------------------
// GET /api/messages/history/[agent]
// ---------------------------------------------------------------------------

describe('GET /api/messages/history/[agent]', () => {
  it('returns 400 for invalid agent name', async () => {
    const res = await GET(makeReq('bad name!'), makeParams('bad name!'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid agent/i);
  });

  it('returns empty array when no log files exist', async () => {
    const res = await GET(makeReq(testAgent), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it('returns outbound messages with direction=outbound', async () => {
    writeOutbound([
      { message_id: 'msg1', text: 'hi from agent', timestamp: '2026-01-01T10:00:00Z', chat_id: 99 },
    ]);
    const res = await GET(makeReq(testAgent), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].direction).toBe('outbound');
    expect(body[0].text).toBe('hi from agent');
  });

  it('returns inbound messages with direction=inbound', async () => {
    writeInbound([
      { id: 'in1', text: 'hi from user', timestamp: '2026-01-01T10:01:00Z', direction: 'inbound', type: 'text' },
    ]);
    const res = await GET(makeReq(testAgent), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].direction).toBe('inbound');
  });

  it('merges and sorts outbound + inbound by timestamp ascending', async () => {
    writeOutbound([
      { message_id: 'out1', text: 'agent reply', timestamp: '2026-01-01T10:02:00Z', chat_id: 99 },
    ]);
    writeInbound([
      { id: 'in1', text: 'user msg', timestamp: '2026-01-01T10:00:00Z', direction: 'inbound', type: 'text' },
      { id: 'in2', text: 'user msg 2', timestamp: '2026-01-01T10:04:00Z', direction: 'inbound', type: 'text' },
    ]);
    const res = await GET(makeReq(testAgent), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(3);
    expect(body[0].text).toBe('user msg');
    expect(body[1].text).toBe('agent reply');
    expect(body[2].text).toBe('user msg 2');
  });

  it('filters by before cursor', async () => {
    writeInbound([
      { id: 'a', text: 'old', timestamp: '2026-01-01T08:00:00Z', direction: 'inbound', type: 'text' },
      { id: 'b', text: 'new', timestamp: '2026-01-01T12:00:00Z', direction: 'inbound', type: 'text' },
    ]);
    const res = await GET(makeReq(testAgent, { before: '2026-01-01T10:00:00Z' }), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].text).toBe('old');
  });

  it('respects limit parameter', async () => {
    writeInbound(Array.from({ length: 10 }, (_, i) => ({
      id: `m${i}`, text: `msg ${i}`,
      timestamp: `2026-01-01T${String(i + 10).padStart(2, '0')}:00:00Z`,
      direction: 'inbound', type: 'text',
    })));
    const res = await GET(makeReq(testAgent, { limit: '3' }), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(3);
  });

  it('skips malformed JSONL lines gracefully', async () => {
    fs.mkdirSync(logDir, { recursive: true });
    fs.writeFileSync(path.join(logDir, 'inbound-messages.jsonl'),
      'not-json\n{"id":"ok","text":"good","timestamp":"2026-01-01T10:00:00Z","direction":"inbound","type":"text"}\n');
    const res = await GET(makeReq(testAgent), makeParams(testAgent));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].text).toBe('good');
  });
});
