import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'clients-route-'));
process.env.CTX_ROOT = tmpRoot;

type ClientsRoute = typeof import('../route');
let route: ClientsRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM clients').run();
  db.prepare('DELETE FROM tasks').run();
  db.prepare('DELETE FROM events').run();
});

let seq = 0;
function insertClient(overrides: Partial<{
  id: string; org: string; display_name: string; stage: string;
  retainer_mrr: number; retainer_health: string;
}> = {}) {
  const id = overrides.id ?? `client-${++seq}`;
  db.prepare(`
    INSERT INTO clients (id, org, display_name, stage, retainer_mrr, retainer_health)
    VALUES (@id, @org, @display_name, @stage, @retainer_mrr, @retainer_health)
  `).run({
    id,
    org: overrides.org ?? 'glv',
    display_name: overrides.display_name ?? id,
    stage: overrides.stage ?? 'prospect',
    retainer_mrr: overrides.retainer_mrr ?? 0,
    retainer_health: overrides.retainer_health ?? 'green',
  });
  return id;
}

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

// ---------------------------------------------------------------------------
// GET /api/clients
// ---------------------------------------------------------------------------

describe('GET /api/clients', () => {
  it('returns empty clients array when table is empty', async () => {
    const res = await route.GET(makeGet('http://localhost/api/clients'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.clients).toEqual([]);
  });

  it('returns all clients with no org filter', async () => {
    insertClient({ org: 'glv' });
    insertClient({ org: 'other' });
    const res = await route.GET(makeGet('http://localhost/api/clients'));
    const data = await res.json();
    expect(data.clients).toHaveLength(2);
  });

  it('filters by org', async () => {
    insertClient({ org: 'glv' });
    insertClient({ org: 'other' });
    const res = await route.GET(makeGet('http://localhost/api/clients?org=glv'));
    const data = await res.json();
    expect(data.clients).toHaveLength(1);
    expect(data.clients[0].org).toBe('glv');
  });

  it('returns open_tasks and blocked_tasks counts', async () => {
    const clientId = insertClient({ org: 'glv' });
    db.prepare(`
      INSERT INTO tasks (id, title, status, priority, assignee, org, project, created_at)
      VALUES ('t1', 'Task 1', 'pending', 'normal', 'dev', 'glv', @project, '2026-04-01T00:00:00Z')
    `).run({ project: clientId });
    db.prepare(`
      INSERT INTO tasks (id, title, status, priority, assignee, org, project, created_at)
      VALUES ('t2', 'Task 2', 'blocked', 'normal', 'dev', 'glv', @project, '2026-04-01T00:00:00Z')
    `).run({ project: clientId });
    db.prepare(`
      INSERT INTO tasks (id, title, status, priority, assignee, org, project, created_at)
      VALUES ('t3', 'Task 3', 'completed', 'normal', 'dev', 'glv', @project, '2026-04-01T00:00:00Z')
    `).run({ project: clientId });

    const res = await route.GET(makeGet('http://localhost/api/clients'));
    const data = await res.json();
    const client = data.clients.find((c: { id: string }) => c.id === clientId);
    expect(client.open_tasks).toBe(2);
    expect(client.blocked_tasks).toBe(1);
  });

  it('orders clients by retainer_mrr DESC', async () => {
    insertClient({ retainer_mrr: 500, org: 'glv' });
    insertClient({ retainer_mrr: 1000, org: 'glv' });
    insertClient({ retainer_mrr: 200, org: 'glv' });
    const res = await route.GET(makeGet('http://localhost/api/clients?org=glv'));
    const data = await res.json();
    const mrrs = data.clients.map((c: { retainer_mrr: number }) => c.retainer_mrr);
    expect(mrrs[0]).toBeGreaterThanOrEqual(mrrs[1]);
    expect(mrrs[1]).toBeGreaterThanOrEqual(mrrs[2]);
  });

  it('skips org filter when org=all', async () => {
    insertClient({ org: 'glv' });
    insertClient({ org: 'other' });
    const res = await route.GET(makeGet('http://localhost/api/clients?org=all'));
    const data = await res.json();
    expect(data.clients).toHaveLength(2);
  });
});
