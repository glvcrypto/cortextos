import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

// Mock bcrypt for speed (cost 12 is ~300ms per compare)
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn().mockResolvedValue('$2b$12$mockhash'),
  },
  compare: vi.fn(),
  hash: vi.fn().mockResolvedValue('$2b$12$mockhash'),
}));

// Mock jsonwebtoken — sign returns predictable token, verify works normally
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mock.jwt.token'),
    verify: vi.fn(),
  },
  sign: vi.fn().mockReturnValue('mock.jwt.token'),
  verify: vi.fn(),
}));

import bcrypt from 'bcryptjs';
import { POST } from '../route';

const TEST_USER = 'mobile_test_user';
const TEST_HASH = '$2b$12$mockhash';
// Use a unique IP per test file to avoid cross-test rate-limit pollution
const TEST_IP = '10.99.88.77';
const RATE_IP = '10.99.88.78';

function makeReq(body?: unknown, ip = TEST_IP) {
  const init: RequestInit = { method: 'POST' };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'content-type': 'application/json', 'x-real-ip': ip };
  }
  return new NextRequest('http://localhost/api/auth/mobile', init);
}

beforeAll(() => {
  process.env.AUTH_SECRET = 'test-secret-32-chars-minimum-len!';
  db.prepare("INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)").run(TEST_USER, TEST_HASH);
  // Clear any leftover rate-limit state from previous runs to avoid 429 bleed
  db.prepare('DELETE FROM rate_limits').run();
});

afterEach(() => {
  vi.mocked(bcrypt.compare).mockReset();
  // Clear rate-limit state for both test IPs so tests don't bleed into each other
  db.prepare('DELETE FROM rate_limits WHERE ip IN (?, ?)').run(TEST_IP, RATE_IP);
});

// ---------------------------------------------------------------------------
// POST /api/auth/mobile
// ---------------------------------------------------------------------------

describe('POST /api/auth/mobile', () => {
  it('returns 500 when AUTH_SECRET is not set', async () => {
    const savedSecret = process.env.AUTH_SECRET;
    const savedNextauth = process.env.NEXTAUTH_SECRET;
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    try {
      const res = await POST(makeReq({ username: TEST_USER, password: 'pass' }));
      expect(res.status).toBe(500);
      expect((await res.json()).error).toMatch(/server configuration/i);
    } finally {
      if (savedSecret) process.env.AUTH_SECRET = savedSecret;
      if (savedNextauth) process.env.NEXTAUTH_SECRET = savedNextauth;
    }
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/auth/mobile', {
      method: 'POST', body: 'bad', headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when username or password is missing', async () => {
    const res = await POST(makeReq({ username: TEST_USER }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/username and password/i);
  });

  it('returns 401 for unknown username (runs dummy bcrypt)', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);
    const res = await POST(makeReq({ username: 'no-such-user', password: 'pass' }));
    expect(res.status).toBe(401);
    expect((await res.json()).error).toMatch(/invalid credentials/i);
    // Dummy compare must have been called (constant-time defence)
    expect(vi.mocked(bcrypt.compare)).toHaveBeenCalledTimes(1);
  });

  it('returns 401 when password does not match', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never);
    const res = await POST(makeReq({ username: TEST_USER, password: 'wrongpass' }));
    expect(res.status).toBe(401);
  });

  it('returns 200 with token and user on valid credentials', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never);
    const res = await POST(makeReq({ username: TEST_USER, password: 'correctpass' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.token).toBe('mock.jwt.token');
    expect(body.user.name).toBe(TEST_USER);
    expect(typeof body.user.id).toBe('string');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
    const req = () => new NextRequest('http://localhost/api/auth/mobile', {
      method: 'POST',
      body: JSON.stringify({ username: 'rate_limit_test', password: 'x' }),
      headers: { 'content-type': 'application/json', 'x-real-ip': RATE_IP },
    });
    let lastStatus = 0;
    for (let i = 0; i < 7; i++) {
      const res = await POST(req());
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
