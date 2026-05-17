import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { SignJWT } from 'jose';

// @api-messages-stream-route alias resolves the bracket dir (vitest.config.ts)
import { GET } from '@api-messages-stream-route';

const TEST_SECRET = 'test-secret-32-chars-minimum-len!';

async function makeJWT(secret = TEST_SECRET): Promise<string> {
  return new SignJWT({ sub: 'testuser' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(secret));
}

function makeReq(agent: string, token?: string) {
  const url = `http://localhost/api/messages/stream/${agent}${token ? `?token=${token}` : ''}`;
  return new NextRequest(url);
}

function mockParams(agent: string) {
  return { params: Promise.resolve({ agent }) };
}

beforeEach(() => {
  process.env.AUTH_SECRET = TEST_SECRET;
});

afterEach(() => {
  delete process.env.AUTH_SECRET;
  delete process.env.NEXTAUTH_SECRET;
});

// ---------------------------------------------------------------------------
// GET /api/messages/stream/[agent]  (SSE — guard paths + happy path header)
// ---------------------------------------------------------------------------

describe('GET /api/messages/stream/[agent]', () => {
  it('returns 401 when no token query param', async () => {
    const res = await GET(makeReq('dev'), mockParams('dev'));
    expect(res.status).toBe(401);
    expect(await res.text()).toMatch(/unauthorized/i);
  });

  it('returns 500 when AUTH_SECRET is not configured', async () => {
    delete process.env.AUTH_SECRET;
    const res = await GET(makeReq('dev', 'any.token.here'), mockParams('dev'));
    expect(res.status).toBe(500);
  });

  it('returns 401 when JWT is invalid/expired', async () => {
    const res = await GET(makeReq('dev', 'bad.jwt.token'), mockParams('dev'));
    expect(res.status).toBe(401);
  });

  it('returns 400 when agent name is invalid', async () => {
    const token = await makeJWT();
    const res = await GET(makeReq('bad agent!', token), mockParams('bad agent!'));
    expect(res.status).toBe(400);
    expect(await res.text()).toMatch(/invalid agent/i);
  });

  it('returns SSE stream with text/event-stream when authenticated', async () => {
    const token = await makeJWT();
    const res = await GET(makeReq('dev', token), mockParams('dev'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/event-stream');
    await res.body?.cancel();
  });
});
