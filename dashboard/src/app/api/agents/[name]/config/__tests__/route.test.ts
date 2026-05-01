import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'config-route-test-'));
process.env.CTX_FRAMEWORK_ROOT = tmpRoot;
process.env.CTX_ROOT = tmpRoot;

const agentDir = path.join(tmpRoot, 'orgs', 'glv', 'agents', 'dev');
fs.mkdirSync(agentDir, { recursive: true });

type ConfigRoute = typeof import('../route');
let route: ConfigRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* ignore */ }
});

const configPath = path.join(agentDir, 'config.json');

const baseConfig = {
  agent_name: 'dev',
  enabled: true,
  timezone: 'UTC',
  day_mode_start: '09:00',
  day_mode_end: '17:00',
  max_session_seconds: 3600,
  max_crashes_per_day: 3,
  startup_delay: 0,
  model: 'claude-sonnet-4-6',
  approval_rules: { always_ask: [], never_ask: [] },
};

function seedConfig(overrides: Record<string, unknown> = {}) {
  fs.writeFileSync(configPath, JSON.stringify({ ...baseConfig, ...overrides }, null, 2) + '\n');
}

function makeGet(name: string): NextRequest {
  return new NextRequest(new URL('http://localhost/api/agents/' + name + '/config'));
}

function makePatch(name: string, body: Record<string, unknown>): NextRequest {
  return new NextRequest(new URL('http://localhost/api/agents/' + name + '/config'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function getParams(name: string) {
  return { params: Promise.resolve({ name }) };
}

describe('GET /api/agents/[name]/config', () => {
  it('returns 400 for an invalid agent name (uppercase)', async () => {
    const res = await route.GET(makeGet('Dev'), getParams('Dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid agent name/);
  });

  it('returns 404 when config.json does not exist', async () => {
    try { fs.rmSync(configPath); } catch { /* ignore */ }
    const res = await route.GET(makeGet('dev'), getParams('dev'));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/not found/i);
  });

  it('returns config and name on success', async () => {
    seedConfig();
    const res = await route.GET(makeGet('dev'), getParams('dev'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('dev');
    expect(body.config.agent_name).toBe('dev');
    expect(body.config.timezone).toBe('UTC');
  });
});

describe('PATCH /api/agents/[name]/config — validation', () => {
  beforeEach(() => {
    seedConfig();
  });

  it('returns 400 for an invalid agent name', async () => {
    const res = await route.PATCH(makePatch('Dev-Agent', { timezone: 'UTC' }), getParams('Dev-Agent'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid agent name/);
  });

  it('returns 404 when config.json does not exist', async () => {
    try { fs.rmSync(configPath); } catch { /* ignore */ }
    const res = await route.PATCH(makePatch('dev', { timezone: 'UTC' }), getParams('dev'));
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/agents/dev/config'), {
      method: 'PATCH',
      body: '{not-json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await route.PATCH(req, getParams('dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Invalid JSON/);
  });

  it('returns 400 when day_mode_start format is wrong', async () => {
    const res = await route.PATCH(makePatch('dev', { day_mode_start: '9am' }), getParams('dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/HH:MM/);
  });

  it('returns 400 when day_mode_end format is wrong', async () => {
    const res = await route.PATCH(makePatch('dev', { day_mode_end: '5:00 PM' }), getParams('dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/HH:MM/);
  });

  it('returns 400 when approval_rules has wrong shape', async () => {
    const res = await route.PATCH(
      makePatch('dev', { approval_rules: { always_ask: 'not-array', never_ask: [] } }),
      getParams('dev'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/approval_rules/);
  });

  it('returns 400 when ctx_warning_threshold is below 50', async () => {
    const res = await route.PATCH(makePatch('dev', { ctx_warning_threshold: 40 }), getParams('dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/ctx_warning_threshold/);
  });

  it('returns 400 when ctx_warning_threshold >= ctx_handoff_threshold', async () => {
    const res = await route.PATCH(
      makePatch('dev', { ctx_warning_threshold: 80, ctx_handoff_threshold: 75 }),
      getParams('dev'),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/less than ctx_handoff_threshold/);
  });

  it('returns 400 when max_session_seconds is negative', async () => {
    const res = await route.PATCH(makePatch('dev', { max_session_seconds: -1 }), getParams('dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/max_session_seconds/);
  });
});

describe('PATCH /api/agents/[name]/config — success', () => {
  beforeEach(() => {
    seedConfig();
  });

  it('updates allowed fields and persists them to config.json', async () => {
    const res = await route.PATCH(
      makePatch('dev', {
        timezone: 'America/Toronto',
        day_mode_start: '08:00',
        day_mode_end: '18:00',
        max_session_seconds: 7200,
        startup_delay: 30,
      }),
      getParams('dev'),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.name).toBe('dev');

    const saved = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(saved.timezone).toBe('America/Toronto');
    expect(saved.day_mode_start).toBe('08:00');
    expect(saved.max_session_seconds).toBe(7200);
    expect(saved.startup_delay).toBe(30);
    expect(saved.model).toBe('claude-sonnet-4-6');
  });
});
