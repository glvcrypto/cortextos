import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'events-route-'));
process.env.CTX_ROOT = tmpDir;

type EventsRoute = typeof import('../route');
let events: EventsRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  events = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM events').run();
});

let counter = 0;
function insertEvent(overrides: Partial<{
  id: string; timestamp: string; agent: string; org: string;
  type: string; category: string; severity: string; data: string | null; message: string;
}> = {}) {
  const id = overrides.id ?? `evt-${++counter}-${Date.now()}`;
  const ts = overrides.timestamp ?? new Date().toISOString();
  db.prepare(`
    INSERT INTO events (id, timestamp, agent, org, type, category, severity, data, message)
    VALUES (@id, @timestamp, @agent, @org, @type, @category, @severity, @data, @message)
  `).run({
    id,
    timestamp: ts,
    agent: overrides.agent ?? 'dev',
    org: overrides.org ?? 'glv',
    type: overrides.type ?? 'task_completed',
    category: overrides.category ?? 'productivity',
    severity: overrides.severity ?? 'info',
    data: overrides.data !== undefined ? overrides.data : null,
    message: overrides.message ?? 'test event',
  });
  return id;
}

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

// ---------------------------------------------------------------------------
// GET /api/events
// ---------------------------------------------------------------------------

describe('GET /api/events', () => {
  it('returns empty array when table is empty', async () => {
    const res = await events.GET(makeGet('http://localhost/api/events'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('returns events ordered newest-first by timestamp', async () => {
    insertEvent({ timestamp: '2026-04-01T10:00:00Z', agent: 'dev' });
    insertEvent({ timestamp: '2026-04-03T10:00:00Z', agent: 'dev' });
    insertEvent({ timestamp: '2026-04-02T10:00:00Z', agent: 'dev' });
    const res = await events.GET(makeGet('http://localhost/api/events'));
    const data = await res.json() as Array<{ timestamp: string }>;
    expect(data).toHaveLength(3);
    expect(data[0].timestamp).toBe('2026-04-03T10:00:00Z');
    expect(data[2].timestamp).toBe('2026-04-01T10:00:00Z');
  });

  it('default limit is 50 — caps at 50 without param', async () => {
    for (let i = 0; i < 55; i++) {
      insertEvent({ timestamp: `2026-04-${String(i % 28 + 1).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:00:00Z` });
    }
    const res = await events.GET(makeGet('http://localhost/api/events'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(50);
  });

  it('limit param restricts results', async () => {
    insertEvent(); insertEvent(); insertEvent();
    const res = await events.GET(makeGet('http://localhost/api/events?limit=2'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('limit param is capped at 500', async () => {
    for (let i = 0; i < 10; i++) insertEvent();
    const res = await events.GET(makeGet('http://localhost/api/events?limit=9999'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(10);
  });

  it('offset paginates results', async () => {
    insertEvent({ timestamp: '2026-04-03T10:00:00Z' });
    insertEvent({ timestamp: '2026-04-02T10:00:00Z' });
    insertEvent({ timestamp: '2026-04-01T10:00:00Z' });
    const res = await events.GET(makeGet('http://localhost/api/events?limit=2&offset=1'));
    const data = await res.json() as Array<{ timestamp: string }>;
    expect(data).toHaveLength(2);
    expect(data[0].timestamp).toBe('2026-04-02T10:00:00Z');
  });

  it('filters by type', async () => {
    insertEvent({ type: 'task_completed' });
    insertEvent({ type: 'agent_heartbeat' });
    const res = await events.GET(makeGet('http://localhost/api/events?type=task_completed'));
    const data = await res.json() as Array<{ type: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].type).toBe('task_completed');
  });

  it('filters by agent', async () => {
    insertEvent({ agent: 'dev' });
    insertEvent({ agent: 'seo' });
    const res = await events.GET(makeGet('http://localhost/api/events?agent=dev'));
    const data = await res.json() as Array<{ agent: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].agent).toBe('dev');
  });

  it('filters by org', async () => {
    insertEvent({ org: 'glv' });
    insertEvent({ org: 'other' });
    const res = await events.GET(makeGet('http://localhost/api/events?org=glv'));
    const data = await res.json() as Array<{ org: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].org).toBe('glv');
  });

  it('from param filters events on or after the timestamp', async () => {
    insertEvent({ timestamp: '2026-04-01T00:00:00Z' });
    insertEvent({ timestamp: '2026-04-15T00:00:00Z' });
    insertEvent({ timestamp: '2026-04-30T00:00:00Z' });
    const res = await events.GET(makeGet('http://localhost/api/events?from=2026-04-15T00:00:00Z'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('to param filters events on or before the timestamp', async () => {
    insertEvent({ timestamp: '2026-04-01T00:00:00Z' });
    insertEvent({ timestamp: '2026-04-15T00:00:00Z' });
    insertEvent({ timestamp: '2026-04-30T00:00:00Z' });
    const res = await events.GET(makeGet('http://localhost/api/events?to=2026-04-15T00:00:00Z'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('stacks multiple filters', async () => {
    insertEvent({ type: 'task_completed', agent: 'dev', org: 'glv' });
    insertEvent({ type: 'task_completed', agent: 'seo', org: 'glv' });
    insertEvent({ type: 'agent_heartbeat', agent: 'dev', org: 'glv' });
    const res = await events.GET(makeGet('http://localhost/api/events?type=task_completed&agent=dev'));
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(1);
  });

  it('parses data column from JSON string to object', async () => {
    insertEvent({ data: JSON.stringify({ count: 42, label: 'test' }) });
    const res = await events.GET(makeGet('http://localhost/api/events'));
    const data = await res.json() as Array<{ data: unknown }>;
    expect(data[0].data).toEqual({ count: 42, label: 'test' });
  });

  it('returns null for events with no data payload', async () => {
    insertEvent({ data: null });
    const res = await events.GET(makeGet('http://localhost/api/events'));
    const data = await res.json() as Array<{ data: unknown }>;
    expect(data[0].data).toBeNull();
  });
});
