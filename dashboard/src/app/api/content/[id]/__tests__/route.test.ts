import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

import { GET, PATCH, DELETE } from '../route';

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function insertContent(id: string, overrides: Record<string, unknown> = {}) {
  db.prepare(`
    INSERT INTO content_items (id, org, title, status, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    overrides.org ?? 'glv',
    overrides.title ?? 'Draft Post',
    overrides.status ?? 'draft',
    new Date().toISOString(),
  );
}

afterEach(() => {
  db.prepare('DELETE FROM content_items').run();
});

// ---------------------------------------------------------------------------
// GET /api/content/[id]
// ---------------------------------------------------------------------------

describe('GET /api/content/[id]', () => {
  it('returns 404 for unknown item', async () => {
    const req = new NextRequest('http://localhost/api/content/ghost');
    const res = await GET(req, makeParams('ghost'));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toMatch(/not found/i);
  });

  it('returns content item for valid ID', async () => {
    insertContent('ci001', { title: 'May Newsletter', org: 'glv' });
    const req = new NextRequest('http://localhost/api/content/ci001');
    const res = await GET(req, makeParams('ci001'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe('ci001');
    expect(body.title).toBe('May Newsletter');
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/content/[id]
// ---------------------------------------------------------------------------

describe('PATCH /api/content/[id]', () => {
  it('returns 404 for unknown item', async () => {
    const req = new NextRequest('http://localhost/api/content/noexist', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'published' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('noexist'));
    expect(res.status).toBe(404);
  });

  it('updates and returns content item', async () => {
    insertContent('ci002', { title: 'Spring Deals' });
    const req = new NextRequest('http://localhost/api/content/ci002', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'scheduled', scheduled_date: '2026-05-10' }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('ci002'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('scheduled');
    expect(body.scheduled_date).toBe('2026-05-10');
  });

  it('returns 500 on invalid JSON', async () => {
    insertContent('ci003');
    const req = new NextRequest('http://localhost/api/content/ci003', {
      method: 'PATCH',
      body: 'not json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams('ci003'));
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/content/[id]
// ---------------------------------------------------------------------------

describe('DELETE /api/content/[id]', () => {
  it('returns 404 for unknown item', async () => {
    const req = new NextRequest('http://localhost/api/content/ghost', { method: 'DELETE' });
    const res = await DELETE(req, makeParams('ghost'));
    expect(res.status).toBe(404);
  });

  it('deletes item and returns ok', async () => {
    insertContent('ci_del');
    const req = new NextRequest('http://localhost/api/content/ci_del', { method: 'DELETE' });
    const res = await DELETE(req, makeParams('ci_del'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);

    const check = db.prepare('SELECT id FROM content_items WHERE id = ?').get('ci_del');
    expect(check).toBeUndefined();
  });
});
