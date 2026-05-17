import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

import { GET, PATCH, DELETE } from '../route';

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function insertLead(id: string, overrides: Record<string, unknown> = {}) {
  db.prepare(`
    INSERT INTO leads (id, org, business_name, status, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    overrides.org ?? 'glv',
    overrides.business_name ?? 'Acme Plumbing',
    overrides.status ?? 'scouted',
    new Date().toISOString(),
  );
}

afterEach(() => {
  db.prepare('DELETE FROM leads').run();
});

// ---------------------------------------------------------------------------
// GET /api/leads/[id]
// ---------------------------------------------------------------------------

describe('GET /api/leads/[id]', () => {
  it('returns 404 for unknown lead', async () => {
    const req = new NextRequest('http://localhost/api/leads/ghost');
    const res = await GET(req, makeParams('ghost'));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it('returns lead data for valid ID', async () => {
    insertLead('lead001', { business_name: 'Ajax Heating', org: 'glv' });
    const req = new NextRequest('http://localhost/api/leads/lead001');
    const res = await GET(req, makeParams('lead001'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('lead001');
    expect(body.business_name).toBe('Ajax Heating');
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/leads/[id]
// ---------------------------------------------------------------------------

describe('PATCH /api/leads/[id]', () => {
  it('returns 404 for unknown lead', async () => {
    const req = new NextRequest('http://localhost/api/leads/noexist', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'contacted' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('noexist'));
    expect(res.status).toBe(404);
  });

  it('updates and returns lead', async () => {
    insertLead('lead002', { business_name: 'Barrie Electric' });
    const req = new NextRequest('http://localhost/api/leads/lead002', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'contacted', notes: 'Called Monday' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('lead002'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('contacted');
    expect(body.notes).toBe('Called Monday');
  });

  it('returns 500 on invalid JSON', async () => {
    insertLead('lead003');
    const req = new NextRequest('http://localhost/api/leads/lead003', {
      method: 'PATCH',
      body: 'bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('lead003'));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/leads/[id]
// ---------------------------------------------------------------------------

describe('DELETE /api/leads/[id]', () => {
  it('returns 404 for unknown lead', async () => {
    const req = new NextRequest('http://localhost/api/leads/ghost', { method: 'DELETE' });
    const res = await DELETE(req, makeParams('ghost'));
    expect(res.status).toBe(404);
  });

  it('deletes lead and returns ok', async () => {
    insertLead('lead_del');
    const req = new NextRequest('http://localhost/api/leads/lead_del', { method: 'DELETE' });
    const res = await DELETE(req, makeParams('lead_del'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    // Verify it's gone
    const check = db.prepare('SELECT id FROM leads WHERE id = ?').get('lead_del');
    expect(check).toBeUndefined();
  });
});
