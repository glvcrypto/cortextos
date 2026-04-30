import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'leads-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'leads-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type LeadsRoute = typeof import('../route');
let leadsRoute: LeadsRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  leadsRoute = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM leads').run();
});

let seq = 0;
function insertLead(overrides: Partial<{
  business_name: string; org: string; status: string; priority: string;
}> = {}) {
  const id = `lead-${++seq}-${Date.now()}`;
  db.prepare(`
    INSERT INTO leads (id, org, business_name, status, priority, created_at)
    VALUES (@id, @org, @business_name, @status, @priority, @created_at)
  `).run({
    id,
    org: overrides.org ?? 'glv',
    business_name: overrides.business_name ?? 'ACME Corp',
    status: overrides.status ?? 'scouted',
    priority: overrides.priority ?? 'normal',
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
// GET /api/leads
// ---------------------------------------------------------------------------

describe('GET /api/leads', () => {
  it('returns all leads when no filters are applied', async () => {
    insertLead({ business_name: 'Alpha Inc' });
    insertLead({ business_name: 'Beta LLC' });

    const res = await leadsRoute.GET(makeGet('http://localhost/api/leads'));
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('filters leads by org', async () => {
    insertLead({ org: 'glv', business_name: 'GLV Lead' });
    insertLead({ org: 'other', business_name: 'Other Lead' });

    const res = await leadsRoute.GET(makeGet('http://localhost/api/leads?org=glv'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ org: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].org).toBe('glv');
  });

  it('filters leads by status', async () => {
    insertLead({ status: 'scouted' });
    insertLead({ status: 'contacted' });

    const res = await leadsRoute.GET(makeGet('http://localhost/api/leads?status=contacted'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ status: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].status).toBe('contacted');
  });
});

// ---------------------------------------------------------------------------
// POST /api/leads
// ---------------------------------------------------------------------------

describe('POST /api/leads', () => {
  it('returns 500 for a malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/leads'), {
      method: 'POST',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await leadsRoute.POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 400 when business_name is missing', async () => {
    const res = await leadsRoute.POST(makePost('http://localhost/api/leads', {
      org: 'glv',
      contact_name: 'John Doe',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/business_name/i);
  });

  it('creates a lead from a minimal body and returns 201', async () => {
    const res = await leadsRoute.POST(makePost('http://localhost/api/leads', {
      business_name: 'Minimal Corp',
    }));
    expect(res.status).toBe(201);
    const data = await res.json() as {
      id: string; business_name: string; status: string; source: string;
    };
    expect(data.id).toBeTruthy();
    expect(data.business_name).toBe('Minimal Corp');
    expect(data.status).toBe('scouted');
    expect(data.source).toBe('manual');
  });

  it('creates a lead from a full body and returns 201 with all fields', async () => {
    const res = await leadsRoute.POST(makePost('http://localhost/api/leads', {
      org: 'glv',
      business_name: 'Full Corp',
      contact_name: 'Jane Smith',
      contact_email: 'jane@fullcorp.com',
      phone: '555-0100',
      niche: 'plumbing',
      area: 'Downtown',
      province: 'ON',
      status: 'contacted',
      priority: 'high',
      notes: 'Warm intro via referral',
      source: 'referral',
    }));
    expect(res.status).toBe(201);
    const data = await res.json() as {
      business_name: string; contact_name: string; niche: string; province: string;
    };
    expect(data.business_name).toBe('Full Corp');
    expect(data.contact_name).toBe('Jane Smith');
    expect(data.niche).toBe('plumbing');
    expect(data.province).toBe('ON');
  });
});
