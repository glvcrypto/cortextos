import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'approvals-id-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'approvals-id-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type ApprovalsIdRoute = typeof import('../route');
let route: ApprovalsIdRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM approvals').run();
});

function insertApproval(id: string, org = 'glv') {
  db.prepare(`
    INSERT INTO approvals (id, title, category, status, agent, org, created_at)
    VALUES (@id, @title, @category, @status, @agent, @org, @created_at)
  `).run({
    id,
    title: 'Deploy feature X',
    category: 'deploy',
    status: 'pending',
    agent: 'dev',
    org,
    created_at: new Date().toISOString(),
  });
}

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

function makePatch(url: string, body: unknown): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

// ---------------------------------------------------------------------------
// GET /api/approvals/[id]
// ---------------------------------------------------------------------------

describe('GET /api/approvals/[id]', () => {
  it('returns 400 for an ID containing path-traversal characters', async () => {
    const res = await route.GET(
      makeGet('http://localhost/api/approvals/../../etc/passwd'),
      params('../../etc/passwd'),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid approval id/i);
  });

  it('returns 200 with the approval when ID is found', async () => {
    insertApproval('appr-abc123');

    const res = await route.GET(
      makeGet('http://localhost/api/approvals/appr-abc123'),
      params('appr-abc123'),
    );
    expect(res.status).toBe(200);
    const data = await res.json() as { id: string; title: string };
    expect(data.id).toBe('appr-abc123');
    expect(data.title).toBe('Deploy feature X');
  });

  it('returns 404 when approval ID does not exist', async () => {
    const res = await route.GET(
      makeGet('http://localhost/api/approvals/nonexistent-id'),
      params('nonexistent-id'),
    );
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toMatch(/not found/i);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/approvals/[id]
// ---------------------------------------------------------------------------

describe('PATCH /api/approvals/[id]', () => {
  it('returns 400 for an ID containing invalid characters', async () => {
    const res = await route.PATCH(
      makePatch('http://localhost/api/approvals/bad/id', { decision: 'approved' }),
      params('bad/id'),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid approval id/i);
  });

  it('returns 400 for a malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/approvals/appr-x1'), {
      method: 'PATCH',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await route.PATCH(req, params('appr-x1'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it('returns 400 when decision is missing', async () => {
    const res = await route.PATCH(
      makePatch('http://localhost/api/approvals/appr-x1', { note: 'ok' }),
      params('appr-x1'),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/approved.*rejected|decision/i);
  });

  it('returns 400 for an unrecognised decision value', async () => {
    const res = await route.PATCH(
      makePatch('http://localhost/api/approvals/appr-x1', { decision: 'maybe' }),
      params('appr-x1'),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/approved.*rejected|decision/i);
  });

  it('returns 400 when note exceeds 1000 characters', async () => {
    const res = await route.PATCH(
      makePatch('http://localhost/api/approvals/appr-x1', {
        decision: 'approved',
        note: 'x'.repeat(1001),
      }),
      params('appr-x1'),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/1000/);
  });

  it('returns 404 when the approval is not found in the DB', async () => {
    const res = await route.PATCH(
      makePatch('http://localhost/api/approvals/no-such-id', { decision: 'approved' }),
      params('no-such-id'),
    );
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toMatch(/not found/i);
  });

  it('returns 500 when the bus shell script is missing from CTX_FRAMEWORK_ROOT', async () => {
    insertApproval('appr-real-1', 'glv');

    const res = await route.PATCH(
      makePatch('http://localhost/api/approvals/appr-real-1', {
        decision: 'approved',
        note: 'Looks good',
      }),
      params('appr-real-1'),
    );
    // Bus script doesn't exist in tmpFramework so spawnSync fails → 500
    expect(res.status).toBe(500);
  });
});
