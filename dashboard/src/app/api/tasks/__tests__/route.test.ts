import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type TasksRoute = typeof import('../route');
let taskRoute: TasksRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  taskRoute = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM tasks').run();
});

let seq = 0;
function insertTask(overrides: Partial<{
  id: string; title: string; status: string; priority: string;
  assignee: string; org: string; project: string;
}> = {}) {
  const id = overrides.id ?? `task-${++seq}-${Date.now()}`;
  db.prepare(`
    INSERT INTO tasks (id, title, status, priority, assignee, org, project, created_at)
    VALUES (@id, @title, @status, @priority, @assignee, @org, @project, @created_at)
  `).run({
    id,
    title: overrides.title ?? 'Test task',
    status: overrides.status ?? 'pending',
    priority: overrides.priority ?? 'normal',
    assignee: overrides.assignee ?? 'dev',
    org: overrides.org ?? 'glv',
    project: overrides.project ?? null,
    created_at: new Date().toISOString(),
  });
  return id;
}

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

function makePost(url: string, body: unknown): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// GET /api/tasks
// ---------------------------------------------------------------------------

describe('GET /api/tasks', () => {
  it('returns empty array when table is empty', async () => {
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('returns all tasks with no filters', async () => {
    insertTask({ title: 'Task A' });
    insertTask({ title: 'Task B' });
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('filters by status', async () => {
    insertTask({ status: 'pending' });
    insertTask({ status: 'completed' });
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks?status=pending'));
    const data = await res.json() as Array<{ status: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].status).toBe('pending');
  });

  it('filters by org', async () => {
    insertTask({ org: 'glv' });
    insertTask({ org: 'other' });
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks?org=glv'));
    const data = await res.json() as Array<{ org: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].org).toBe('glv');
  });

  it('filters by agent (assignee)', async () => {
    insertTask({ assignee: 'dev' });
    insertTask({ assignee: 'seo' });
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks?agent=dev'));
    const data = await res.json() as Array<{ assignee: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].assignee).toBe('dev');
  });

  it('filters by priority', async () => {
    insertTask({ priority: 'urgent' });
    insertTask({ priority: 'low' });
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks?priority=urgent'));
    const data = await res.json() as Array<{ priority: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].priority).toBe('urgent');
  });

  it('search filter matches against task title', async () => {
    insertTask({ title: 'Fix breadcrumb schema' });
    insertTask({ title: 'Update pricing' });
    const res = await taskRoute.GET(makeGet('http://localhost/api/tasks?search=breadcrumb'));
    const data = await res.json() as Array<{ title: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Fix breadcrumb schema');
  });
});

// ---------------------------------------------------------------------------
// POST /api/tasks (validation — exec path not tested; subprocess spawning
// would require a real dist/cli.js under CTX_FRAMEWORK_ROOT)
// ---------------------------------------------------------------------------

describe('POST /api/tasks — validation', () => {
  it('returns 400 for malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/tasks'), {
      method: 'POST',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await taskRoute.POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it('returns 400 when title is missing', async () => {
    const res = await taskRoute.POST(makePost('http://localhost/api/tasks', {
      description: 'No title provided',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/title is required/i);
  });

  it('returns 400 when title is empty string', async () => {
    const res = await taskRoute.POST(makePost('http://localhost/api/tasks', {
      title: '   ',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/title is required/i);
  });

  it('returns 400 when title exceeds 500 characters', async () => {
    const res = await taskRoute.POST(makePost('http://localhost/api/tasks', {
      title: 'x'.repeat(501),
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/500/);
  });

  it('returns 400 for invalid priority value', async () => {
    const res = await taskRoute.POST(makePost('http://localhost/api/tasks', {
      title: 'Valid title',
      priority: 'critical',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid priority/i);
  });

  it('returns 500 when exec fails (no dist/cli.js in CTX_FRAMEWORK_ROOT)', async () => {
    // CTX_FRAMEWORK_ROOT points to a tmpdir without dist/cli.js, so
    // execFileSync throws ENOENT and the handler returns 500.
    const res = await taskRoute.POST(makePost('http://localhost/api/tasks', {
      title: 'Build something cool',
      priority: 'normal',
    }));
    expect(res.status).toBe(500);
  });
});
