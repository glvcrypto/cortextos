import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// vi.hoisted ensures these refs are available when the hoisted vi.mock factories run
const { mockExistsSync, mockExecFileSync } = vi.hoisted(() => ({
  mockExistsSync: vi.fn(),
  mockExecFileSync: vi.fn(),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return { ...actual, existsSync: mockExistsSync, readFileSync: actual.readFileSync };
});

vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('child_process')>();
  return { ...actual, execFileSync: mockExecFileSync };
});

import { GET } from '../route';

function makeReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return new NextRequest(`http://localhost/api/kb/collections${qs ? '?' + qs : ''}`);
}

beforeEach(() => {
  // Default: all paths exist (allows tests to reach execFileSync if needed)
  mockExistsSync.mockReturnValue(true);
});

afterEach(() => {
  mockExistsSync.mockReset();
  mockExecFileSync.mockReset();
});

// ---------------------------------------------------------------------------
// GET /api/kb/collections
// ---------------------------------------------------------------------------

describe('GET /api/kb/collections', () => {
  it('returns 400 when org is missing', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/org parameter required/i);
  });

  it('returns 400 when org contains invalid characters', async () => {
    const res = await GET(makeReq({ org: 'bad org!' }));
    expect(res.status).toBe(400);
  });

  it('returns empty collections when Python venv is not set up', async () => {
    mockExistsSync.mockImplementation((p: unknown) =>
      !String(p).includes('venv'),
    );
    const res = await GET(makeReq({ org: 'glv' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.collections).toEqual([]);
    expect(body.org).toBe('glv');
  });

  it('returns empty collections when chromadb directory does not exist', async () => {
    mockExistsSync.mockImplementation((p: unknown) =>
      !String(p).includes('chromadb'),
    );
    const res = await GET(makeReq({ org: 'glv' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.collections).toEqual([]);
  });

  it('parses tabular output from mmrag.py when collections exist', async () => {
    mockExecFileSync.mockReturnValue(
      'Collection          Count\n---\nshared-glv          42\nagent-dev           17\n',
    );
    const res = await GET(makeReq({ org: 'glv' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.collections).toHaveLength(2);
    expect(body.collections[0].name).toBe('shared-glv');
    expect(body.collections[0].count).toBe(42);
    expect(body.collections[1].name).toBe('agent-dev');
    expect(body.collections[1].count).toBe(17);
  });
});
