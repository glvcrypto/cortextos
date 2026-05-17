import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-route-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpRoot;

type SyncRoute = typeof import('../route');
let route: SyncRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// GET + POST /api/sync
// ---------------------------------------------------------------------------

describe('GET /api/sync', () => {
  it('returns success:true and sync result shape', async () => {
    const res = await route.GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});

describe('POST /api/sync', () => {
  it('returns success:true and sync result shape', async () => {
    const res = await route.POST();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
