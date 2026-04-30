import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'approvals-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'approvals-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type ApprovalsRoute = typeof import('../route');
let approvalsRoute: ApprovalsRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  approvalsRoute = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM approvals').run();
});

let seq = 0;
function insertApproval(overrides: Partial<{
  id: string; title: string; status: string; agent: string;
  org: string; category: string; resolved_at: string | null;
}> = {}) {
  const id = overrides.id ?? `approval-${++seq}-${Date.now()}`;
  db.prepare(`
    INSERT INTO approvals (id, title, category, status, agent, org, created_at, resolved_at)
    VALUES (@id, @title, @category, @status, @agent, @org, @created_at, @resolved_at)
  `).run({
    id,
    title: overrides.title ?? 'Test approval',
    category: overrides.category ?? 'deploy',
    status: overrides.status ?? 'pending',
    agent: overrides.agent ?? 'dev',
    org: overrides.org ?? 'glv',
    created_at: new Date().toISOString(),
    resolved_at: overrides.resolved_at ?? null,
  });
  return id;
}

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

// ---------------------------------------------------------------------------
// GET /api/approvals
// ---------------------------------------------------------------------------

describe('GET /api/approvals', () => {
  it('returns pending approvals by default', async () => {
    insertApproval({ status: 'pending', title: 'Pending A' });
    insertApproval({ status: 'approved', title: 'Resolved B', resolved_at: new Date().toISOString() });

    const res = await approvalsRoute.GET(makeGet('http://localhost/api/approvals'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ title: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Pending A');
  });

  it('returns resolved approvals when status=resolved', async () => {
    insertApproval({ status: 'pending', title: 'Still pending' });
    insertApproval({ status: 'approved', title: 'Approved one', resolved_at: new Date().toISOString() });

    const res = await approvalsRoute.GET(makeGet('http://localhost/api/approvals?status=resolved'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ title: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Approved one');
  });

  it('returns all approvals when status=all', async () => {
    insertApproval({ status: 'pending' });
    insertApproval({ status: 'approved', resolved_at: new Date().toISOString() });

    const res = await approvalsRoute.GET(makeGet('http://localhost/api/approvals?status=all'));
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('returns 400 for an unrecognised status value', async () => {
    const res = await approvalsRoute.GET(makeGet('http://localhost/api/approvals?status=bogus'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it('filters pending approvals by org', async () => {
    insertApproval({ org: 'glv', title: 'GLV approval' });
    insertApproval({ org: 'other', title: 'Other approval' });

    const res = await approvalsRoute.GET(makeGet('http://localhost/api/approvals?org=glv'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ org: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].org).toBe('glv');
  });

  it('filters resolved approvals by agent and category', async () => {
    const now = new Date().toISOString();
    insertApproval({ status: 'approved', agent: 'dev', category: 'deploy', resolved_at: now });
    insertApproval({ status: 'approved', agent: 'seo', category: 'content', resolved_at: now });

    const res = await approvalsRoute.GET(
      makeGet('http://localhost/api/approvals?status=resolved&agent=dev&category=deploy'),
    );
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ agent: string; category: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].agent).toBe('dev');
    expect(data[0].category).toBe('deploy');
  });
});
