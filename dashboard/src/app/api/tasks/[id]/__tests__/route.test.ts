import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { getCTXRoot } from '@/lib/config';

// tmpRoot used only for source_file enrichment (GET) and to stage output files
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ctx-tasks-id-'));

vi.mock('@/lib/sync', () => ({ syncAll: vi.fn() }));
vi.mock('child_process', () => ({
  spawnSync: vi.fn().mockReturnValue({ status: 0, stdout: '', stderr: '', pid: 1, signal: null, output: [] }),
  execFileSync: vi.fn().mockReturnValue('task_abc\n'),
}));

import { GET, DELETE, PUT, PATCH } from '../route';

function makeReq(method = 'GET', body?: Record<string, unknown>) {
  const url = 'http://localhost/api/tasks/t1';
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'content-type': 'application/json' };
  }
  return new NextRequest(url, init);
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function insertTask(id: string, overrides: Record<string, unknown> = {}) {
  db.prepare(`
    INSERT INTO tasks (id, title, status, priority, assignee, org, created_at, source_file)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    overrides.title ?? 'Test task',
    overrides.status ?? 'pending',
    overrides.priority ?? 'normal',
    overrides.assignee ?? null,
    overrides.org ?? 'glv',
    overrides.created_at ?? new Date().toISOString(),
    overrides.source_file ?? null,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  db.prepare('DELETE FROM tasks').run();
});

// ---------------------------------------------------------------------------
// GET /api/tasks/[id]
// ---------------------------------------------------------------------------

describe('GET /api/tasks/[id]', () => {
  it('rejects path-traversal IDs', async () => {
    const res = await GET(makeReq(), makeParams('../../../etc/passwd'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid task ID');
  });

  it('returns 404 for unknown task', async () => {
    const res = await GET(makeReq(), makeParams('nope'));
    expect(res.status).toBe(404);
  });

  it('returns task data for valid ID', async () => {
    insertTask('task001', { title: 'Write tests', org: 'glv' });
    const res = await GET(makeReq(), makeParams('task001'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('task001');
    expect(body.title).toBe('Write tests');
  });

  it('enriches task with outputs from source_file', async () => {
    const taskFile = path.join(tmpRoot, 'task-with-outputs.json');
    fs.writeFileSync(taskFile, JSON.stringify({ outputs: ['result one'] }));
    insertTask('task_src', { title: 'With outputs', source_file: taskFile });
    const res = await GET(makeReq(), makeParams('task_src'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.outputs).toEqual(['result one']);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/tasks/[id]
// ---------------------------------------------------------------------------

describe('DELETE /api/tasks/[id]', () => {
  it('rejects path-traversal IDs', async () => {
    const res = await DELETE(makeReq('DELETE'), makeParams('../../bad'));
    expect(res.status).toBe(400);
  });

  it('returns 404 when task not found', async () => {
    const res = await DELETE(makeReq('DELETE'), makeParams('ghost'));
    expect(res.status).toBe(404);
  });

  it('deletes task file and returns success', async () => {
    // Route uses getCTXRoot() to build the path — use the same root for the file
    const ctxRoot = getCTXRoot();
    const orgTaskDir = path.join(ctxRoot, 'orgs', 'glv', 'tasks');
    fs.mkdirSync(orgTaskDir, { recursive: true });
    const taskFile = path.join(orgTaskDir, 'task_del.json');
    fs.writeFileSync(taskFile, JSON.stringify({ id: 'task_del', title: 'To delete' }));

    insertTask('task_del', { org: 'glv' });
    const res = await DELETE(makeReq('DELETE'), makeParams('task_del'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(fs.existsSync(taskFile)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/tasks/[id]
// ---------------------------------------------------------------------------

describe('PUT /api/tasks/[id]', () => {
  it('rejects path-traversal IDs', async () => {
    const res = await PUT(makeReq('PUT', { title: 'x' }), makeParams('../etc'));
    expect(res.status).toBe(400);
  });

  it('returns 404 when task not found', async () => {
    const res = await PUT(makeReq('PUT', { title: 'x' }), makeParams('noexist'));
    expect(res.status).toBe(404);
  });

  it('rejects bad JSON', async () => {
    insertTask('task_put');
    const req = new NextRequest('http://localhost/api/tasks/task_put', {
      method: 'PUT',
      body: 'not json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await PUT(req, makeParams('task_put'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid JSON body');
  });

  it('rejects empty title', async () => {
    insertTask('task_put2');
    const res = await PUT(makeReq('PUT', { title: '   ' }), makeParams('task_put2'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/empty/i);
  });

  it('rejects invalid priority', async () => {
    insertTask('task_put3');
    const res = await PUT(makeReq('PUT', { priority: 'critical' }), makeParams('task_put3'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/priority/i);
  });

  it('rejects invalid assignee (shell metacharacters)', async () => {
    insertTask('task_put4');
    const res = await PUT(makeReq('PUT', { assignee: 'agent; rm -rf /' }), makeParams('task_put4'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/assignee/i);
  });

  it('updates task file and returns success', async () => {
    // Route uses getCTXRoot() — create the file at the same root
    const ctxRoot = getCTXRoot();
    const orgDir = path.join(ctxRoot, 'orgs', 'glv', 'tasks');
    fs.mkdirSync(orgDir, { recursive: true });
    const taskFile = path.join(orgDir, 'task_put5.json');
    fs.writeFileSync(taskFile, JSON.stringify({ id: 'task_put5', title: 'Old', priority: 'normal', created_at: new Date().toISOString() }));

    insertTask('task_put5', { org: 'glv' });
    const res = await PUT(makeReq('PUT', { title: 'New title', priority: 'high' }), makeParams('task_put5'));
    expect(res.status).toBe(200);
    const saved = JSON.parse(fs.readFileSync(taskFile, 'utf-8'));
    expect(saved.title).toBe('New title');
    expect(saved.priority).toBe('high');
    fs.unlinkSync(taskFile);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/tasks/[id] — status updates via bus scripts
// ---------------------------------------------------------------------------

describe('PATCH /api/tasks/[id]', () => {
  it('rejects path-traversal IDs', async () => {
    const res = await PATCH(makeReq('PATCH', { status: 'pending' }), makeParams('../../bad'));
    expect(res.status).toBe(400);
  });

  it('rejects bad JSON', async () => {
    const req = new NextRequest('http://localhost/api/tasks/t1', {
      method: 'PATCH',
      body: '{not json}',
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('t1'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid JSON body');
  });

  it('rejects invalid status', async () => {
    const res = await PATCH(makeReq('PATCH', { status: 'done' }), makeParams('t1'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid status/i);
  });

  it('rejects invalid blockedBy (shell metacharacters)', async () => {
    const res = await PATCH(makeReq('PATCH', { status: 'blocked', blockedBy: 'agent; echo pwned' }), makeParams('t1'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/blockedBy/i);
  });

  it('calls update-task.sh for non-completed status and returns success', async () => {
    insertTask('task_patch1');
    const res = await PATCH(makeReq('PATCH', { status: 'in_progress' }), makeParams('task_patch1'));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  it('calls complete-task.sh for completed status', async () => {
    insertTask('task_patch2');
    const res = await PATCH(makeReq('PATCH', { status: 'completed', outputSummary: 'All done' }), makeParams('task_patch2'));
    expect(res.status).toBe(200);
    // Verify complete-task.sh was invoked (first spawnSync call is for completion, not update)
    const { spawnSync } = await import('child_process');
    const calls = vi.mocked(spawnSync).mock.calls;
    const completedCall = calls.find(c => (c[1] as string[]).some(a => typeof a === 'string' && a.includes('complete-task.sh')));
    expect(completedCall).toBeTruthy();
  });
});
