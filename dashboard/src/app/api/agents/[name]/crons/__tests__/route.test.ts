/**
 * Tests for GET + PUT /api/agents/[name]/crons
 *
 * GET reads crons from the agent's config.json.
 * PUT validates the crons array and persists it, then notifies via bus (non-fatal).
 *
 * We create a real temp CTX_FRAMEWORK_ROOT so getAllAgents() discovers the test
 * agent and getAgentDir() resolves to the right directory.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Env setup — before any module import so config constants pick them up.
// ---------------------------------------------------------------------------
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'crons-route-test-'));
process.env.CTX_FRAMEWORK_ROOT = tmpRoot;
process.env.CTX_ROOT = tmpRoot;

// Create the agent directory so getAllAgents() finds 'testbot' in org 'test'.
const agentDir = path.join(tmpRoot, 'orgs', 'test', 'agents', 'testbot');
fs.mkdirSync(agentDir, { recursive: true });

type CronsRoute = typeof import('../route');
let route: CronsRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* ignore */ }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const configPath = path.join(agentDir, 'config.json');

function seedConfig(crons: unknown[] = []) {
  fs.writeFileSync(
    configPath,
    JSON.stringify({ agent_name: 'testbot', enabled: true, startup_delay: 0, max_session_seconds: 3600, working_directory: '/tmp', crons }),
  );
}

function makeGet(name = 'testbot'): NextRequest {
  return new NextRequest(new URL(`http://localhost/api/agents/${name}/crons`));
}

function makePut(name: string, body: unknown): NextRequest {
  return new NextRequest(new URL(`http://localhost/api/agents/${name}/crons`), {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function params(name: string) {
  return { params: Promise.resolve({ name }) };
}

// ---------------------------------------------------------------------------
// GET /api/agents/[name]/crons
// ---------------------------------------------------------------------------
describe('GET /api/agents/[name]/crons', () => {
  beforeEach(() => {
    try { fs.rmSync(configPath); } catch { /* ignore */ }
  });

  it('returns empty crons array when config.json is missing', async () => {
    const res = await route.GET(makeGet(), params('testbot'));
    expect(res.status).toBe(200);
    expect((await res.json()).crons).toEqual([]);
  });

  it('returns crons from config.json', async () => {
    seedConfig([{ name: 'heartbeat', type: 'recurring', interval: '4h', prompt: 'Run heartbeat.' }]);
    const res = await route.GET(makeGet(), params('testbot'));
    const body = await res.json();
    expect(body.crons).toHaveLength(1);
    expect(body.crons[0].name).toBe('heartbeat');
    expect(body.crons[0].interval).toBe('4h');
  });
});

// ---------------------------------------------------------------------------
// PUT /api/agents/[name]/crons — validation
// ---------------------------------------------------------------------------
describe('PUT /api/agents/[name]/crons — validation', () => {
  beforeEach(() => {
    seedConfig([]);
  });

  it('returns 400 when crons is not an array', async () => {
    const res = await route.PUT(makePut('testbot', { crons: 'not-array' }), params('testbot'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/array/);
  });

  it('returns 400 when a cron is missing name', async () => {
    const res = await route.PUT(makePut('testbot', { crons: [{ prompt: 'do something', interval: '1h' }] }), params('testbot'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/name and prompt/);
  });

  it('returns 400 when cron name has invalid characters', async () => {
    const res = await route.PUT(makePut('testbot', { crons: [{ name: 'bad name!', prompt: 'go' }] }), params('testbot'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid cron name/);
  });

  it('returns 400 when recurring cron has no interval', async () => {
    const res = await route.PUT(
      makePut('testbot', { crons: [{ name: 'heartbeat', type: 'recurring', prompt: 'go' }] }),
      params('testbot'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid interval/);
  });

  it('returns 400 when recurring cron interval has no unit', async () => {
    const res = await route.PUT(
      makePut('testbot', { crons: [{ name: 'heartbeat', type: 'recurring', interval: '60', prompt: 'go' }] }),
      params('testbot'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid interval/);
  });

  it('returns 400 when once cron has no fire_at', async () => {
    const res = await route.PUT(
      makePut('testbot', { crons: [{ name: 'once-job', type: 'once', prompt: 'go' }] }),
      params('testbot'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid fire_at/);
  });

  it('returns 400 when once cron fire_at is not a valid ISO timestamp', async () => {
    const res = await route.PUT(
      makePut('testbot', { crons: [{ name: 'once-job', type: 'once', fire_at: 'not-a-date', prompt: 'go' }] }),
      params('testbot'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid fire_at/);
  });

  it('returns 400 for an unknown cron type', async () => {
    const res = await route.PUT(
      makePut('testbot', { crons: [{ name: 'weird', type: 'daily', prompt: 'go' }] }),
      params('testbot'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid cron type/);
  });
});

// ---------------------------------------------------------------------------
// PUT /api/agents/[name]/crons — success paths
// ---------------------------------------------------------------------------
describe('PUT /api/agents/[name]/crons — success', () => {
  beforeEach(() => {
    seedConfig([]);
  });

  it('accepts and persists a valid recurring cron', async () => {
    const cron = { name: 'heartbeat', type: 'recurring', interval: '4h', prompt: 'Run heartbeat protocol.' };
    const res = await route.PUT(makePut('testbot', { crons: [cron] }), params('testbot'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.crons[0].name).toBe('heartbeat');

    // Verify config.json was updated on disk
    const saved = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(saved.crons).toHaveLength(1);
    expect(saved.crons[0].interval).toBe('4h');
  });

  it('accepts and persists a valid once cron', async () => {
    const cron = { name: 'launch-day', type: 'once', fire_at: '2026-06-01T09:00:00Z', prompt: 'Launch campaign.' };
    const res = await route.PUT(makePut('testbot', { crons: [cron] }), params('testbot'));
    expect(res.status).toBe(200);
    const saved = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(saved.crons[0].fire_at).toBe('2026-06-01T09:00:00Z');
  });
});
