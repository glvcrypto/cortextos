/**
 * Tests for GET + PATCH /api/agents/[name]
 *
 * GET delegates to getAgentDetail (mocked).
 * PATCH reads/writes IDENTITY.md, SOUL.md, MEMORY.md via real fs ops
 * into a temp directory returned by the mocked getAgentPaths.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Env setup — must happen before any module is imported.
// ---------------------------------------------------------------------------
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-main-route-'));
process.env.CTX_ROOT = tmpRoot;
process.env.CTX_FRAMEWORK_ROOT = tmpRoot;

// ---------------------------------------------------------------------------
// Mock @/lib/data/agents so we control getAgentDetail and getAgentPaths.
// ---------------------------------------------------------------------------
vi.mock('@/lib/data/agents', () => ({
  getAgentDetail: vi.fn(),
  getAgentPaths: vi.fn(),
}));

type AgentRoute = typeof import('../route');
let route: AgentRoute;

import type { getAgentDetail as GetAgentDetail, getAgentPaths as GetAgentPaths } from '@/lib/data/agents';
let mockGetDetail: ReturnType<typeof vi.fn>;
let mockGetPaths: ReturnType<typeof vi.fn>;

beforeAll(async () => {
  route = await import('../route');
  const agentsMod = await import('@/lib/data/agents');
  mockGetDetail = agentsMod.getAgentDetail as unknown as ReturnType<typeof vi.fn>;
  mockGetPaths = agentsMod.getAgentPaths as unknown as ReturnType<typeof vi.fn>;
});

afterAll(() => {
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* ignore */ }
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const agentDir = path.join(tmpRoot, 'test-agent');

function seedAgentDir() {
  fs.mkdirSync(agentDir, { recursive: true });
  mockGetPaths.mockReturnValue({
    identityMd: path.join(agentDir, 'IDENTITY.md'),
    soulMd: path.join(agentDir, 'SOUL.md'),
    memoryMd: path.join(agentDir, 'MEMORY.md'),
  });
}

function patchRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest(new URL('http://localhost/api/agents/dev'), {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function params(name: string) {
  return { params: Promise.resolve({ name }) };
}

// ---------------------------------------------------------------------------
// GET /api/agents/[name]
// ---------------------------------------------------------------------------
describe('GET /api/agents/[name]', () => {
  it('returns agent detail from getAgentDetail', async () => {
    const detail = { name: 'dev', role: 'Developer', org: 'glv', tasks: [] };
    mockGetDetail.mockResolvedValue(detail);

    const req = new NextRequest(new URL('http://localhost/api/agents/dev'));
    const res = await route.GET(req, params('dev'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('dev');
    expect(body.org).toBe('glv');
  });

  it('returns 404 when getAgentDetail throws', async () => {
    mockGetDetail.mockRejectedValue(new Error('Agent config not found'));

    const req = new NextRequest(new URL('http://localhost/api/agents/unknown'));
    const res = await route.GET(req, params('unknown'));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Agent not found');
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/agents/[name]
// ---------------------------------------------------------------------------
describe('PATCH /api/agents/[name]', () => {
  beforeEach(() => {
    seedAgentDir();
    // Clean up any files from previous test
    for (const f of ['IDENTITY.md', 'SOUL.md', 'MEMORY.md']) {
      try { fs.rmSync(path.join(agentDir, f)); } catch { /* ignore */ }
    }
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost/api/agents/dev'), {
      method: 'PATCH',
      body: '{bad json',
      headers: { 'content-type': 'application/json' },
    });
    const res = await route.PATCH(req, params('dev'));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid JSON body');
  });

  it('updates IDENTITY.md and returns updated.identity = true', async () => {
    const res = await route.PATCH(
      patchRequest({ identity: { name: 'Dev', role: 'Developer', emoji: '💻', vibe: 'calm', workStyle: 'async' } }),
      params('dev'),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.updated.identity).toBe(true);
    expect(fs.existsSync(path.join(agentDir, 'IDENTITY.md'))).toBe(true);
  });

  it('creates IDENTITY.md from scratch when file does not exist', async () => {
    // Confirm no IDENTITY.md pre-exists
    expect(fs.existsSync(path.join(agentDir, 'IDENTITY.md'))).toBe(false);

    const res = await route.PATCH(
      patchRequest({ identity: { name: 'Fresh', role: 'Analyst', emoji: '', vibe: '', workStyle: '' } }),
      params('fresh'),
    );
    expect(res.status).toBe(200);
    // File is written even starting from empty string
    const content = fs.readFileSync(path.join(agentDir, 'IDENTITY.md'), 'utf-8');
    expect(content).toContain('Fresh');
  });

  it('updates SOUL.md and returns updated.soul = true', async () => {
    const res = await route.PATCH(
      patchRequest({ soul: { coreValues: 'honesty', autonomyRules: 'ask first', communicationStyle: 'direct', guardRails: '', personality: '' } }),
      params('dev'),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.updated.soul).toBe(true);
    expect(fs.existsSync(path.join(agentDir, 'SOUL.md'))).toBe(true);
  });

  it('writes MEMORY.md when memoryRaw is a string', async () => {
    const res = await route.PATCH(
      patchRequest({ memoryRaw: '# Dev Memory\nLearned: test isolation matters.' }),
      params('dev'),
    );
    expect(res.status).toBe(200);
    const content = fs.readFileSync(path.join(agentDir, 'MEMORY.md'), 'utf-8');
    expect(content).toBe('# Dev Memory\nLearned: test isolation matters.');
  });

  it('updates all three sections in one request', async () => {
    const res = await route.PATCH(
      patchRequest({
        identity: { name: 'Dev', role: 'Dev', emoji: '', vibe: '', workStyle: '' },
        soul: { coreValues: 'speed', autonomyRules: 'proceed', communicationStyle: 'terse', guardRails: '', personality: '' },
        memoryRaw: 'all updated',
      }),
      params('dev'),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.updated.identity).toBe(true);
    expect(body.updated.soul).toBe(true);
    expect(fs.readFileSync(path.join(agentDir, 'MEMORY.md'), 'utf-8')).toBe('all updated');
  });

  it('passes org to getAgentPaths when org is in body', async () => {
    await route.PATCH(
      patchRequest({ org: 'glv', memoryRaw: 'org-scoped update' }),
      params('dev'),
    );
    expect(mockGetPaths).toHaveBeenCalledWith('dev', 'glv');
  });
});
