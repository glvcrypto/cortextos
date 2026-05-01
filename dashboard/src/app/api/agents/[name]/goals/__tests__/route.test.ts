import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFrameworkRoot } from '@/lib/config';

import { GET, PATCH } from '../route';

function makeGetReq(name: string, org: string) {
  const url = new URL(`http://localhost/api/agents/${name}/goals`);
  url.searchParams.set('org', org);
  return new NextRequest(url.toString());
}

function makePatchReq(name: string, org: string, body: Record<string, unknown>) {
  const url = new URL(`http://localhost/api/agents/${name}/goals`);
  url.searchParams.set('org', org);
  return new NextRequest(url.toString(), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function makeParams(name: string) {
  return { params: Promise.resolve({ name }) };
}

const fw = getFrameworkRoot();
const org = 'glv';
const agentName = 'test-agent-goals';
const agentDir = path.join(fw, 'orgs', org, 'agents', agentName);
const goalsPath = path.join(agentDir, 'goals.json');

afterEach(() => {
  if (fs.existsSync(goalsPath)) fs.unlinkSync(goalsPath);
  // Don't remove agentDir — it might be used by other things
});

// ---------------------------------------------------------------------------
// GET /api/agents/[name]/goals
// ---------------------------------------------------------------------------

describe('GET /api/agents/[name]/goals', () => {
  it('returns 400 for invalid agent name (uppercase)', async () => {
    const res = await GET(makeGetReq('BadName', org), makeParams('BadName'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid/i);
  });

  it('returns 400 for missing org', async () => {
    const url = new URL(`http://localhost/api/agents/${agentName}/goals`);
    const res = await GET(new NextRequest(url.toString()), makeParams(agentName));
    expect(res.status).toBe(400);
  });

  it('returns default empty goals when goals.json does not exist', async () => {
    const res = await GET(makeGetReq(agentName, org), makeParams(agentName));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.goals).toHaveProperty('focus');
    expect(body.goals.goals).toEqual([]);
  });

  it('returns goals from existing goals.json', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const data = { focus: 'Ship tests', goals: ['#1', '#2'], bottleneck: 'reviews', updated_at: '2026-04-30', updated_by: 'dev' };
    fs.writeFileSync(goalsPath, JSON.stringify(data));
    const res = await GET(makeGetReq(agentName, org), makeParams(agentName));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.goals.focus).toBe('Ship tests');
    expect(body.goals.goals).toEqual(['#1', '#2']);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/agents/[name]/goals
// ---------------------------------------------------------------------------

describe('PATCH /api/agents/[name]/goals', () => {
  it('returns 400 for invalid agent name', async () => {
    const res = await PATCH(makePatchReq('BAD', org, { focus: 'x' }), makeParams('BAD'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for bad JSON body', async () => {
    const url = new URL(`http://localhost/api/agents/${agentName}/goals`);
    url.searchParams.set('org', org);
    const req = new NextRequest(url.toString(), {
      method: 'PATCH',
      body: 'bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await PATCH(req, makeParams(agentName));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid JSON body');
  });

  it('returns 404 when agent directory does not exist', async () => {
    const res = await PATCH(makePatchReq('nonexistent-agent-xyz', org, { focus: 'x' }), makeParams('nonexistent-agent-xyz'));
    expect(res.status).toBe(404);
  });

  it('returns 400 when focus is not a string', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await PATCH(makePatchReq(agentName, org, { focus: 123 }), makeParams(agentName));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/string/i);
  });

  it('returns 400 when goals is not an array', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await PATCH(makePatchReq(agentName, org, { goals: 'not-array' }), makeParams(agentName));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/array/i);
  });

  it('writes goals.json and returns success with updated fields', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await PATCH(makePatchReq(agentName, org, {
      focus: 'Merge PRs',
      goals: ['PR #61', 'PR #60'],
      bottleneck: 'Aiden review',
    }), makeParams(agentName));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.goals.focus).toBe('Merge PRs');
    expect(body.goals.goals).toEqual(['PR #61', 'PR #60']);
    expect(body.goals.bottleneck).toBe('Aiden review');
    expect(body.goals.updated_at).toBeTruthy();
    // Verify it was persisted
    expect(fs.existsSync(goalsPath)).toBe(true);
    const saved = JSON.parse(fs.readFileSync(goalsPath, 'utf-8'));
    expect(saved.focus).toBe('Merge PRs');
  });
});
