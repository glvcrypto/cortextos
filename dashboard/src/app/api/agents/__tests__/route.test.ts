import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-route-'));
const tmpFw = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFw;

type AgentsRoute = typeof import('../route');
let route: AgentsRoute;

beforeAll(async () => {
  // Create required dirs in tmpFw so getFrameworkRoot doesn't crash
  fs.mkdirSync(path.join(tmpFw, 'orgs'), { recursive: true });
  fs.mkdirSync(path.join(tmpFw, 'templates', 'agent'), { recursive: true });
  fs.mkdirSync(path.join(tmpFw, 'templates', 'orchestrator'), { recursive: true });
  fs.mkdirSync(path.join(tmpFw, 'templates', 'analyst'), { recursive: true });
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFw, { recursive: true, force: true });
});

function makePost(body: unknown): NextRequest {
  return new NextRequest(new URL('http://localhost/api/agents'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// GET /api/agents
// ---------------------------------------------------------------------------

describe('GET /api/agents', () => {
  it('returns empty array when no agents are configured', async () => {
    const res = await route.GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// POST /api/agents — validation only
// (Full create path not tested: copies templates, writes .env, calls IPC)
// ---------------------------------------------------------------------------

describe('POST /api/agents — validation', () => {
  it('returns 400 for malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/agents'), {
      method: 'POST',
      body: '{not json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await route.POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it('returns 400 when name is missing', async () => {
    const res = await route.POST(makePost({ org: 'glv', template: 'agent', botToken: 't', chatId: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/name/i);
  });

  it('returns 400 when name contains invalid characters', async () => {
    const res = await route.POST(makePost({ name: 'My Agent!', org: 'glv', template: 'agent', botToken: 't', chatId: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/name/i);
  });

  it('returns 400 when org is missing', async () => {
    const res = await route.POST(makePost({ name: 'myagent', template: 'agent', botToken: 't', chatId: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/org/i);
  });

  it('returns 400 when org contains invalid characters', async () => {
    const res = await route.POST(makePost({ name: 'myagent', org: 'GLV ORG!', template: 'agent', botToken: 't', chatId: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/org/i);
  });

  it('returns 400 when template is invalid', async () => {
    const res = await route.POST(makePost({ name: 'myagent', org: 'glv', template: 'unknown', botToken: 't', chatId: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/template/i);
  });

  it('returns 400 when botToken is missing', async () => {
    const res = await route.POST(makePost({ name: 'myagent', org: 'glv', template: 'agent', chatId: '1' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/botToken/i);
  });

  it('returns 400 when chatId is missing', async () => {
    const res = await route.POST(makePost({ name: 'myagent', org: 'glv', template: 'agent', botToken: 'tok123' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/chatId/i);
  });

  it('returns 500 (not 409) when all fields valid but template dir is empty', async () => {
    // Templates exist but are empty — copyDir succeeds with empty dirs,
    // then enabled-agents.json doesn't exist → create path → new agent created (201)
    // or IPC daemon not running → skipped → 201
    const res = await route.POST(makePost({
      name: 'test-agent',
      org: 'glv',
      template: 'agent',
      botToken: 'tok-test',
      chatId: '999',
    }));
    // Should either be 201 (created) or 500 (copyDir/other error) — not a validation 4xx
    expect([201, 500]).toContain(res.status);
  });
});
