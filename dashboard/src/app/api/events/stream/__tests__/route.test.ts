import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { mockAuth, mockInitWatcher } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockInitWatcher: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ auth: mockAuth }));
vi.mock('@/lib/watcher', () => ({ initWatcher: mockInitWatcher, onSSEEvent: vi.fn() }));

import { GET } from '../route';

function makeReq() {
  return new NextRequest('http://localhost/api/events/stream');
}

beforeEach(() => {
  mockAuth.mockResolvedValue({ user: { name: 'testuser' } });
  mockInitWatcher.mockReturnValue(undefined);
});

afterEach(() => {
  mockAuth.mockReset();
  mockInitWatcher.mockReset();
});

// ---------------------------------------------------------------------------
// GET /api/events/stream  (SSE — guard paths only; stream mechanics deferred)
// ---------------------------------------------------------------------------

describe('GET /api/events/stream', () => {
  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
    expect(await res.text()).toMatch(/unauthorized/i);
  });

  it('returns 500 when watcher fails to initialize', async () => {
    mockInitWatcher.mockImplementation(() => { throw new Error('watcher failed'); });
    const res = await GET(makeReq());
    expect(res.status).toBe(500);
  });

  it('returns a streaming response with text/event-stream when authenticated', async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/event-stream');
    // Cancel the stream immediately to avoid hanging the test
    await res.body?.cancel();
  });
});
