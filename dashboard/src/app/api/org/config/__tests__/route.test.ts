import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpFw = fs.mkdtempSync(path.join(os.tmpdir(), 'org-config-route-'));
process.env.CTX_FRAMEWORK_ROOT = tmpFw;

type OrgConfigRoute = typeof import('../route');
let route: OrgConfigRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpFw, { recursive: true, force: true });
});

function makeGet(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

function makePatch(url: string, body: unknown): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function writeContext(org: string, data: Record<string, unknown>) {
  const orgDir = path.join(tmpFw, 'orgs', org);
  fs.mkdirSync(orgDir, { recursive: true });
  fs.writeFileSync(path.join(orgDir, 'context.json'), JSON.stringify(data));
}

// ---------------------------------------------------------------------------
// GET /api/org/config
// ---------------------------------------------------------------------------

describe('GET /api/org/config', () => {
  it('returns 400 when org is missing', async () => {
    const res = await route.GET(makeGet('http://localhost/api/org/config'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/org/i);
  });

  it('returns 400 when org contains invalid characters', async () => {
    const res = await route.GET(makeGet('http://localhost/api/org/config?org=GLV ORG!'));
    expect(res.status).toBe(400);
  });

  it('returns 404 when context.json does not exist', async () => {
    fs.mkdirSync(path.join(tmpFw, 'orgs', 'nofile'), { recursive: true });
    const res = await route.GET(makeGet('http://localhost/api/org/config?org=nofile'));
    expect(res.status).toBe(404);
  });

  it('returns context config on success', async () => {
    writeContext('glv', { name: 'GLV Marketing', timezone: 'America/Toronto' });
    const res = await route.GET(makeGet('http://localhost/api/org/config?org=glv'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.config.name).toBe('GLV Marketing');
    expect(data.org).toBe('glv');
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/org/config
// ---------------------------------------------------------------------------

describe('PATCH /api/org/config', () => {
  it('returns 400 when org is missing', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config', { name: 'Test' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when context.json does not exist', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=nofile', { name: 'Test' }));
    expect(res.status).toBe(404);
  });

  it('returns 400 for malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/org/config?org=glv'), {
      method: 'PATCH',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await route.PATCH(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it('returns 400 for invalid day_mode_start format', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=glv', {
      day_mode_start: '9am',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/HH:MM/);
  });

  it('returns 400 for invalid day_mode_end format', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=glv', {
      day_mode_end: 'not-a-time',
    }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/HH:MM/);
  });

  it('returns 400 when require_deliverables is not boolean', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=glv', {
      require_deliverables: 'yes',
    }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/boolean/);
  });

  it('returns 400 when default_approval_categories is not an array', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=glv', {
      default_approval_categories: 'deliverables',
    }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/array/);
  });

  it('returns 400 when default_approval_categories contains empty string', async () => {
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=glv', {
      default_approval_categories: ['deliverables', ''],
    }));
    expect(res.status).toBe(400);
  });

  it('updates allowed fields and returns merged config', async () => {
    writeContext('glv', { name: 'GLV Marketing', timezone: 'America/Toronto', description: 'old' });
    const res = await route.PATCH(makePatch('http://localhost/api/org/config?org=glv', {
      description: 'updated desc',
      day_mode_start: '09:00',
      require_deliverables: true,
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.config.description).toBe('updated desc');
    expect(data.config.day_mode_start).toBe('09:00');
    expect(data.config.require_deliverables).toBe(true);
    expect(data.config.name).toBe('GLV Marketing');
  });
});
