import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { mockExistsSync } = vi.hoisted(() => ({ mockExistsSync: vi.fn() }));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  const origReadFile = actual.readFileSync;
  return {
    ...actual,
    existsSync: mockExistsSync,
    readFileSync: ((...args: Parameters<typeof origReadFile>) => {
      if (String(args[0]).endsWith('secrets.env')) {
        throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
      }
      return origReadFile(...args);
    }) as typeof origReadFile,
  };
});

vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('child_process')>();
  return { ...actual, execFileSync: vi.fn() };
});

import { GET } from '../route';

function makeReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/knowledge/search${qs ? '?' + qs : ''}`);
}

beforeEach(() => {
  mockExistsSync.mockReturnValue(true);
  delete process.env.GEMINI_API_KEY;
});

// ---------------------------------------------------------------------------
// GET /api/knowledge/search  (backwards-compatibility alias → /api/kb/search)
// ---------------------------------------------------------------------------

describe('GET /api/knowledge/search', () => {
  it('returns 400 when q is missing — same handler as /api/kb/search', async () => {
    const res = await GET(makeReq({ org: 'glv' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/q parameter required/i);
  });

  it('returns 503 when GEMINI_API_KEY is not configured', async () => {
    const res = await GET(makeReq({ q: 'test', org: 'glv' }));
    expect(res.status).toBe(503);
    expect((await res.json()).error).toMatch(/GEMINI_API_KEY/i);
  });
});
