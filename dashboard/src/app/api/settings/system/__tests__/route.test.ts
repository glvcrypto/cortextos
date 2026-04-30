import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'settings-system-'));
process.env.CTX_ROOT = tmpRoot;

type SystemRoute = typeof import('../route');
let route: SystemRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// GET /api/settings/system
// ---------------------------------------------------------------------------

describe('GET /api/settings/system', () => {
  it('returns default config when no file exists', async () => {
    const res = await route.GET(new NextRequest('http://localhost/api/settings/system'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.config).toMatchObject({
      heartbeatStalenessThreshold: 120,
      maxCrashesPerDay: 5,
      sessionRefreshInterval: 300,
    });
  });

  it('merges persisted values over defaults', async () => {
    const configDir = path.join(tmpRoot, 'config');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(
      path.join(configDir, 'dashboard-settings.json'),
      JSON.stringify({ heartbeatStalenessThreshold: 60 }),
    );

    const res = await route.GET(new NextRequest('http://localhost/api/settings/system'));
    const data = await res.json();
    expect(data.config.heartbeatStalenessThreshold).toBe(60);
    expect(data.config.maxCrashesPerDay).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/settings/system
// ---------------------------------------------------------------------------

describe('PUT /api/settings/system', () => {
  it('saves and returns updated config', async () => {
    const res = await route.PUT(new NextRequest('http://localhost/api/settings/system', {
      method: 'PUT',
      body: JSON.stringify({ heartbeatStalenessThreshold: 90, maxCrashesPerDay: 10, sessionRefreshInterval: 600 }),
      headers: { 'content-type': 'application/json' },
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.config.heartbeatStalenessThreshold).toBe(90);
    expect(data.config.maxCrashesPerDay).toBe(10);
    expect(data.config.sessionRefreshInterval).toBe(600);
  });

  it('clamps values to allowed min/max', async () => {
    const res = await route.PUT(new NextRequest('http://localhost/api/settings/system', {
      method: 'PUT',
      body: JSON.stringify({ heartbeatStalenessThreshold: 0, maxCrashesPerDay: 9999, sessionRefreshInterval: 1 }),
      headers: { 'content-type': 'application/json' },
    }));
    const data = await res.json();
    expect(data.config.heartbeatStalenessThreshold).toBe(10);
    expect(data.config.maxCrashesPerDay).toBe(100);
    expect(data.config.sessionRefreshInterval).toBe(30);
  });

  it('persists values readable by GET', async () => {
    await route.PUT(new NextRequest('http://localhost/api/settings/system', {
      method: 'PUT',
      body: JSON.stringify({ maxCrashesPerDay: 7 }),
      headers: { 'content-type': 'application/json' },
    }));
    const res = await route.GET(new NextRequest('http://localhost/api/settings/system'));
    const data = await res.json();
    expect(data.config.maxCrashesPerDay).toBe(7);
  });
});
