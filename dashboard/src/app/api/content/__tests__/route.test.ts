import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'content-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'content-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type ContentRoute = typeof import('../route');
let contentRoute: ContentRoute;
let db: typeof import('@/lib/db')['db'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  contentRoute = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

afterEach(() => {
  db.prepare('DELETE FROM content_items').run();
});

let seq = 0;
function insertContent(overrides: Partial<{
  org: string; title: string; status: string; content_type: string;
}> = {}) {
  const id = `content-${++seq}-${Date.now()}`;
  db.prepare(`
    INSERT INTO content_items (id, org, title, content_type, status, created_at)
    VALUES (@id, @org, @title, @content_type, @status, @created_at)
  `).run({
    id,
    org: overrides.org ?? 'glv',
    title: overrides.title ?? 'Test Post',
    content_type: overrides.content_type ?? 'blog',
    status: overrides.status ?? 'draft',
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
// GET /api/content
// ---------------------------------------------------------------------------

describe('GET /api/content', () => {
  it('returns all content items when no filters are applied', async () => {
    insertContent({ title: 'Post A' });
    insertContent({ title: 'Post B' });

    const res = await contentRoute.GET(makeGet('http://localhost/api/content'));
    expect(res.status).toBe(200);
    const data = await res.json() as unknown[];
    expect(data).toHaveLength(2);
  });

  it('filters content items by org', async () => {
    insertContent({ org: 'glv', title: 'GLV Post' });
    insertContent({ org: 'other', title: 'Other Post' });

    const res = await contentRoute.GET(makeGet('http://localhost/api/content?org=glv'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ org: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].org).toBe('glv');
  });

  it('filters content items by status', async () => {
    insertContent({ status: 'draft' });
    insertContent({ status: 'published' });

    const res = await contentRoute.GET(makeGet('http://localhost/api/content?status=published'));
    expect(res.status).toBe(200);
    const data = await res.json() as Array<{ status: string }>;
    expect(data).toHaveLength(1);
    expect(data[0].status).toBe('published');
  });
});

// ---------------------------------------------------------------------------
// POST /api/content
// ---------------------------------------------------------------------------

describe('POST /api/content', () => {
  it('returns 500 for a malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/content'), {
      method: 'POST',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await contentRoute.POST(req);
    expect(res.status).toBe(500);
  });

  it('returns 400 when title is missing', async () => {
    const res = await contentRoute.POST(makePost('http://localhost/api/content', {
      org: 'glv',
      platform: 'blog',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/title/i);
  });

  it('creates a content item from a minimal body and returns 201', async () => {
    const res = await contentRoute.POST(makePost('http://localhost/api/content', {
      title: 'Minimal Post',
    }));
    expect(res.status).toBe(201);
    const data = await res.json() as {
      id: string; title: string; status: string; content_type: string;
    };
    expect(data.id).toBeTruthy();
    expect(data.title).toBe('Minimal Post');
    expect(data.status).toBe('draft');
    expect(data.content_type).toBe('blog');
  });

  it('creates a content item from a full body and returns 201 with all fields', async () => {
    const res = await contentRoute.POST(makePost('http://localhost/api/content', {
      org: 'glv',
      client_slug: 'reyco-marine',
      title: 'Marine Buying Guide 2026',
      platform: 'wordpress',
      content_type: 'seo_article',
      status: 'review',
      scheduled_date: '2026-05-15',
      notes: 'Target keyword: buy pontoon boat Ontario',
    }));
    expect(res.status).toBe(201);
    const data = await res.json() as {
      title: string; content_type: string; platform: string; status: string;
    };
    expect(data.title).toBe('Marine Buying Guide 2026');
    expect(data.content_type).toBe('seo_article');
    expect(data.platform).toBe('wordpress');
    expect(data.status).toBe('review');
  });
});
