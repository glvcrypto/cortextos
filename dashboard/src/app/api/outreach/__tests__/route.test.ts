import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'outreach-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'outreach-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type OutreachRoute = typeof import('../route');
let outreachRoute: OutreachRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  outreachRoute = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare("DELETE FROM events WHERE type IN ('email_sent','reply_received','meeting_booked')").run();
});

let seq = 0;
function insertOutreachEvent(overrides: Partial<{
  id: string; type: string; org: string; city: string; industry: string;
}> = {}) {
  const id = overrides.id ?? `evt-${++seq}-${Date.now()}`;
  db.prepare(`
    INSERT INTO events (id, timestamp, agent, org, type, severity, data)
    VALUES (@id, @timestamp, @agent, @org, @type, @severity, @data)
  `).run({
    id,
    timestamp: new Date().toISOString(),
    agent: 'prospector',
    org: overrides.org ?? 'glv',
    type: overrides.type ?? 'email_sent',
    severity: 'info',
    data: JSON.stringify({
      city: overrides.city ?? 'Toronto',
      industry: overrides.industry ?? 'plumbing',
      prospect_id: 'p1',
      email: 'test@example.com',
      hook_variant: 'v1',
      hook_family: 'social_proof',
      structure_variant: 's1',
      batch_id: 'batch1',
      channel: 'email',
    }),
  });
  return id;
}

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

// ---------------------------------------------------------------------------
// GET /api/outreach
// ---------------------------------------------------------------------------

describe('GET /api/outreach', () => {
  it('default view returns summary array (empty when no events)', async () => {
    const res = await outreachRoute.GET(makeGet('http://localhost/api/outreach'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('view=events returns raw outreach events', async () => {
    insertOutreachEvent({ type: 'email_sent' });
    insertOutreachEvent({ type: 'reply_received' });

    const res = await outreachRoute.GET(makeGet('http://localhost/api/outreach?view=events'));
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('view=events respects the limit param', async () => {
    for (let i = 0; i < 5; i++) insertOutreachEvent({ type: 'email_sent' });

    const res = await outreachRoute.GET(makeGet('http://localhost/api/outreach?view=events&limit=3'));
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(3);
  });

  it('view=stats returns aggregate stats shape', async () => {
    insertOutreachEvent({ type: 'email_sent' });
    insertOutreachEvent({ type: 'reply_received' });

    const res = await outreachRoute.GET(makeGet('http://localhost/api/outreach?view=stats'));
    expect(res.status).toBe(200);
    const data = await res.json() as {
      total_sent: number; total_replies: number; total_meetings: number;
      reply_rate: number; cities: number; industries: number;
    };
    expect(data).toHaveProperty('total_sent');
    expect(data).toHaveProperty('total_replies');
    expect(data).toHaveProperty('reply_rate');
    expect(data.total_sent).toBe(1);
    expect(data.total_replies).toBe(1);
  });

  it('org filter limits events to the requested org', async () => {
    insertOutreachEvent({ org: 'glv', type: 'email_sent' });
    insertOutreachEvent({ org: 'other', type: 'email_sent' });

    const res = await outreachRoute.GET(makeGet('http://localhost/api/outreach?view=events&org=glv'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ org: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].org).toBe('glv');
  });
});
