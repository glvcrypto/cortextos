import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';

import { POST } from '../route';

function makeReq(body?: unknown) {
  const init: RequestInit = { method: 'POST' };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'content-type': 'application/json' };
  }
  return new NextRequest('http://localhost/api/notifications/register', init);
}

const ctxRoot = getCTXRoot();
const tokensFile = path.join(ctxRoot, 'config', 'push-tokens.json');

afterEach(() => {
  if (fs.existsSync(tokensFile)) fs.unlinkSync(tokensFile);
});

// ---------------------------------------------------------------------------
// POST /api/notifications/register
// ---------------------------------------------------------------------------

describe('POST /api/notifications/register', () => {
  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/notifications/register', {
      method: 'POST', body: 'bad', headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid json/i);
  });

  it('returns 400 when token is missing', async () => {
    const res = await POST(makeReq({ device: 'iPhone' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/token is required/i);
  });

  it('returns 400 for non-Expo token format', async () => {
    const res = await POST(makeReq({ token: 'not-a-valid-expo-token' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid expo push token/i);
  });

  it('registers an ExponentPushToken and writes to file', async () => {
    const token = 'ExponentPushToken[abc123]';
    const res = await POST(makeReq({ token, device: 'iPhone15' }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    const tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    expect(tokens).toHaveLength(1);
    expect(tokens[0].token).toBe(token);
    expect(tokens[0].device).toBe('iPhone15');
    expect(tokens[0].registeredAt).toBeTruthy();
  });

  it('registers an ExpoPushToken format', async () => {
    const token = 'ExpoPushToken[xyz789]';
    const res = await POST(makeReq({ token }));
    expect(res.status).toBe(200);
    const tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    expect(tokens[0].token).toBe(token);
  });

  it('updates existing token rather than duplicating', async () => {
    const token = 'ExponentPushToken[dup123]';
    await POST(makeReq({ token, device: 'OldDevice' }));
    await POST(makeReq({ token, device: 'NewDevice' }));
    const tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    expect(tokens).toHaveLength(1);
    expect(tokens[0].device).toBe('NewDevice');
  });

  it('accumulates multiple distinct tokens', async () => {
    await POST(makeReq({ token: 'ExponentPushToken[tok1]' }));
    await POST(makeReq({ token: 'ExponentPushToken[tok2]' }));
    const tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));
    expect(tokens).toHaveLength(2);
  });
});
