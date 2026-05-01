import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { mockExistsSync, mockExecFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockExecFileSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  const origReadFile = actual.readFileSync;
  return {
    ...actual,
    existsSync: mockExistsSync,
    readFileSync: ((...args: Parameters<typeof origReadFile>) => {
      // Block real secrets.env so tests control GEMINI_API_KEY via process.env
      if (String(args[0]).endsWith('secrets.env')) {
        throw Object.assign(new Error('ENOENT: no such file'), { code: 'ENOENT' });
      }
      return origReadFile(...args);
    }) as typeof origReadFile,
  };
});

vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('child_process')>();
  return { ...actual, execFileSync: mockExecFileSync };
});

import { GET } from '../route';

function makeReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/kb/search${qs ? '?' + qs : ''}`);
}

beforeEach(() => {
  mockExistsSync.mockReturnValue(true);
  delete process.env.GEMINI_API_KEY;
});

afterEach(() => {
  mockExistsSync.mockReset();
  mockExecFileSync.mockReset();
  delete process.env.GEMINI_API_KEY;
});

// ---------------------------------------------------------------------------
// GET /api/kb/search
// ---------------------------------------------------------------------------

describe('GET /api/kb/search', () => {
  it('returns 400 when q is missing', async () => {
    const res = await GET(makeReq({ org: 'glv' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/q parameter required/i);
  });

  it('returns 400 when org contains invalid characters', async () => {
    const res = await GET(makeReq({ q: 'test', org: 'bad org!' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid org/i);
  });

  it('returns 400 when agent contains invalid characters', async () => {
    const res = await GET(makeReq({ q: 'test', agent: 'bad agent!' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid agent/i);
  });

  it('returns 400 when query is too long', async () => {
    const res = await GET(makeReq({ q: 'x'.repeat(501), org: 'glv' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/too long/i);
  });

  it('returns 400 for invalid scope', async () => {
    const res = await GET(makeReq({ q: 'test', org: 'glv', scope: 'bad' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/scope must be/i);
  });

  it('returns 400 for limit out of range', async () => {
    const res = await GET(makeReq({ q: 'test', org: 'glv', limit: '99' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/limit must be/i);
  });

  it('returns 400 for invalid threshold', async () => {
    const res = await GET(makeReq({ q: 'test', org: 'glv', threshold: '2.0' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/threshold must be/i);
  });

  it('returns 503 when GEMINI_API_KEY is not configured', async () => {
    // readFileSync is intercepted for secrets.env in the mock factory above;
    // process.env.GEMINI_API_KEY is cleared in beforeEach — no key anywhere
    const res = await GET(makeReq({ q: 'test', org: 'glv' }));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/GEMINI_API_KEY/i);
  });

  it('returns empty results when Python venv is not set up', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    mockExistsSync.mockImplementation((p: unknown) =>
      !String(p).includes('venv'),
    );
    const res = await GET(makeReq({ q: 'test', org: 'glv' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results).toEqual([]);
    expect(body.total).toBe(0);
  });
});
