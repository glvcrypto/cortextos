import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'goals-route-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'goals-route-fw-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

type GoalsRoute = typeof import('../route');
let goals: GoalsRoute;

beforeAll(async () => {
  goals = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

beforeEach(() => {
  for (const entry of fs.readdirSync(tmpRoot)) {
    fs.rmSync(path.join(tmpRoot, entry), { recursive: true, force: true });
  }
  for (const entry of fs.readdirSync(tmpFramework)) {
    fs.rmSync(path.join(tmpFramework, entry), { recursive: true, force: true });
  }
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

function writeGoalsFile(org: string, data: Record<string, unknown>) {
  const dir = path.join(tmpRoot, 'orgs', org);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'goals.json'), JSON.stringify(data));
}

function ensureOrg(org: string) {
  fs.mkdirSync(path.join(tmpRoot, 'orgs', org), { recursive: true });
}

// ---------------------------------------------------------------------------
// GET /api/goals
// ---------------------------------------------------------------------------

describe('GET /api/goals', () => {
  it('defaults org to "default" when no ?org= param and returns shape', async () => {
    const res = await goals.GET(makeGet('http://localhost/api/goals'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('goals');
    expect(data).toHaveProperty('bottleneck');
    expect(data).toHaveProperty('north_star');
    expect(data).toHaveProperty('daily_focus');
  });

  it('returns 400 for invalid org param', async () => {
    const res = await goals.GET(makeGet('http://localhost/api/goals?org=My+Org!'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid org/i);
  });

  it('returns empty defaults when goals.json does not exist', async () => {
    const res = await goals.GET(makeGet('http://localhost/api/goals?org=no-org'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.north_star).toBe('');
    expect(data.daily_focus).toBe('');
    expect(Array.isArray(data.goals)).toBe(true);
  });

  it('returns parsed north_star, daily_focus, and goals array', async () => {
    writeGoalsFile('test-org', {
      north_star: 'Grow to $10k MRR',
      daily_focus: 'Close 2 leads today',
      bottleneck: 'Empty pipeline',
      goals: [{ id: 'g1', title: 'Sign first client', progress: 50, order: 0 }],
    });
    const res = await goals.GET(makeGet('http://localhost/api/goals?org=test-org'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.north_star).toBe('Grow to $10k MRR');
    expect(data.daily_focus).toBe('Close 2 leads today');
    expect(data.goals).toHaveLength(1);
    expect(data.goals[0].title).toBe('Sign first client');
  });

  it('returns empty north_star and daily_focus when fields are absent from file', async () => {
    writeGoalsFile('partial-org', { bottleneck: 'Some blocker', goals: [] });
    const res = await goals.GET(makeGet('http://localhost/api/goals?org=partial-org'));
    const data = await res.json();
    expect(data.north_star).toBe('');
    expect(data.daily_focus).toBe('');
    expect(data.bottleneck).toBe('Some blocker');
  });

  it('returns defaults and 200 when goals.json is corrupt JSON', async () => {
    const dir = path.join(tmpRoot, 'orgs', 'bad-org');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'goals.json'), 'not json at all');
    const res = await goals.GET(makeGet('http://localhost/api/goals?org=bad-org'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.north_star).toBe('');
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/goals
// ---------------------------------------------------------------------------

describe('PATCH /api/goals', () => {
  it('returns 400 when org param is absent', async () => {
    const res = await goals.PATCH(makePatch('http://localhost/api/goals', {}));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid or missing org/i);
  });

  it('returns 400 for invalid org param', async () => {
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=Bad Org', {}));
    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/goals?org=glv'), {
      method: 'PATCH',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await goals.PATCH(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid json/i);
  });

  it('updates north_star and returns success', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      north_star: 'Reach $20k MRR',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.north_star).toBe('Reach $20k MRR');
  });

  it('updates daily_focus and auto-sets daily_focus_set_at', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      daily_focus: 'Write 3 outreach emails',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.daily_focus).toBe('Write 3 outreach emails');
    expect(data.daily_focus_set_at).toBeTruthy();
    expect(new Date(data.daily_focus_set_at).getTime()).toBeGreaterThan(0);
  });

  it('updates bottleneck', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      bottleneck: 'Need more leads',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.bottleneck).toBe('Need more leads');
  });

  it('replaces goals array', async () => {
    ensureOrg('glv');
    const newGoals = [{ id: 'g1', title: 'Ship the feature', progress: 0, order: 0 }];
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      goals: newGoals,
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.goals).toEqual(newGoals);
  });

  it('returns 400 when north_star is not a string', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      north_star: 42,
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/north_star must be a string/i);
  });

  it('returns 400 when daily_focus is not a string', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      daily_focus: { text: 'oops' },
    }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when bottleneck is not a string (null)', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      bottleneck: null,
    }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when goals is not an array', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      goals: 'should-be-array',
    }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/goals must be an array/i);
  });

  it('preserves untouched fields when patch is partial', async () => {
    writeGoalsFile('preserve-org', {
      north_star: 'Original north star',
      daily_focus: 'Original focus',
      goals: [{ id: 'g1', title: 'Keep this goal', progress: 80, order: 0 }],
      bottleneck: 'Original bottleneck',
    });
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=preserve-org', {
      bottleneck: 'New bottleneck',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.north_star).toBe('Original north star');
    expect(data.goals[0].title).toBe('Keep this goal');
    expect(data.bottleneck).toBe('New bottleneck');
  });

  it('sets updated_at on every successful PATCH', async () => {
    ensureOrg('glv');
    const res = await goals.PATCH(makePatch('http://localhost/api/goals?org=glv', {
      bottleneck: 'timing-test',
    }));
    const data = await res.json();
    expect(data.updated_at).toBeTruthy();
    expect(new Date(data.updated_at).getTime()).toBeGreaterThan(0);
  });
});
