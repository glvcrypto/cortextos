import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot, getAllAgents } from '@/lib/config';

// Mock getAllAgents so the route's agent-existence check is controllable
vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>();
  return {
    ...actual,
    getAllAgents: vi.fn().mockReturnValue([{ name: 'test-agent', org: 'glv' }]),
  };
});

import { POST } from '../route';

function makeReq(body?: unknown) {
  const init: RequestInit = { method: 'POST' };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'content-type': 'application/json' };
  }
  return new NextRequest('http://localhost/api/messages/send', init);
}

const ctxRoot = getCTXRoot();
const agentInboxDir = path.join(ctxRoot, 'inbox', 'test-agent');
const agentLogDir = path.join(ctxRoot, 'logs', 'test-agent');

afterEach(() => {
  // Clean up test inbox and log entries
  if (fs.existsSync(agentInboxDir)) {
    for (const f of fs.readdirSync(agentInboxDir)) {
      fs.unlinkSync(path.join(agentInboxDir, f));
    }
  }
  const logFile = path.join(agentLogDir, 'inbound-messages.jsonl');
  if (fs.existsSync(logFile)) {
    // Remove lines written by test (source=dashboard)
    const lines = fs.readFileSync(logFile, 'utf-8').split('\n')
      .filter(l => l.trim() && !l.includes('"source":"dashboard"'));
    if (lines.length) {
      fs.writeFileSync(logFile, lines.join('\n') + '\n');
    } else {
      fs.unlinkSync(logFile);
    }
  }
});

// ---------------------------------------------------------------------------
// POST /api/messages/send
// ---------------------------------------------------------------------------

describe('POST /api/messages/send', () => {
  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/messages/send', {
      method: 'POST',
      body: 'not-json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid json/i);
  });

  it('returns 400 when agent is missing', async () => {
    const res = await POST(makeReq({ text: 'hello' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/agent is required/i);
  });

  it('returns 400 when agent name has invalid characters', async () => {
    const res = await POST(makeReq({ agent: 'bad agent!', text: 'hi' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid agent name/i);
  });

  it('returns 400 when text is missing', async () => {
    const res = await POST(makeReq({ agent: 'test-agent' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/text is required/i);
  });

  it('returns 404 when agent not in registry', async () => {
    vi.mocked(getAllAgents).mockReturnValueOnce([]);
    const res = await POST(makeReq({ agent: 'unknown-agent', text: 'hi' }));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/agent not found/i);
  });

  it('writes inbox file and logs inbound message on success', async () => {
    const res = await POST(makeReq({ agent: 'test-agent', text: 'hello world' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.messageId).toBe('string');

    // Inbox file should exist
    const files = fs.readdirSync(agentInboxDir).filter(f => !f.startsWith('.tmp'));
    expect(files).toHaveLength(1);
    const msg = JSON.parse(fs.readFileSync(path.join(agentInboxDir, files[0]), 'utf-8'));
    expect(msg.text).toBe('hello world');
    expect(msg.to).toBe('test-agent');

    // Log entry should exist
    const logFile = path.join(agentLogDir, 'inbound-messages.jsonl');
    expect(fs.existsSync(logFile)).toBe(true);
  });

  it('includes optional type in log entry', async () => {
    const res = await POST(makeReq({ agent: 'test-agent', text: '/status', type: 'command' }));
    expect(res.status).toBe(200);
    const logFile = path.join(agentLogDir, 'inbound-messages.jsonl');
    const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);
    const entry = JSON.parse(lines[lines.length - 1]);
    expect(entry.type).toBe('command');
  });
});
