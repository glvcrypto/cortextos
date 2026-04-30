import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Set CTX_ROOT before db.ts evaluates so SQLite is created in a temp dir.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rate-limit-test-'));
process.env.CTX_ROOT = tmpDir;

let checkRateLimit: typeof import('../rate-limit')['checkRateLimit'];
let resetRateLimit: typeof import('../rate-limit')['resetRateLimit'];

beforeAll(async () => {
  const mod = await import('../rate-limit');
  checkRateLimit = mod.checkRateLimit;
  resetRateLimit = mod.resetRateLimit;
});

// ---------------------------------------------------------------------------
// checkRateLimit
// ---------------------------------------------------------------------------

describe('checkRateLimit', () => {
  it('allows the first request for a new IP', () => {
    const result = checkRateLimit('192.0.2.1');
    expect(result.allowed).toBe(true);
    expect(result.retryAfter).toBeUndefined();
  });

  it('allows up to MAX (5) requests then blocks on the 6th', () => {
    const ip = '192.0.2.2';
    // First 5 requests allowed (count goes 1→5, check fires at count>=5 BEFORE increment)
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
    // 6th request blocked (count=5 >= MAX=5)
    expect(checkRateLimit(ip).allowed).toBe(false);
  });

  it('returns retryAfter (seconds) when blocked', () => {
    const ip = '192.0.2.3';
    for (let i = 0; i < 6; i++) checkRateLimit(ip);
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(typeof result.retryAfter).toBe('number');
    expect(result.retryAfter!).toBeGreaterThan(0);
  });

  it('tracks different IPs independently', () => {
    // Exhaust one IP
    const exhausted = '192.0.2.4';
    for (let i = 0; i < 6; i++) checkRateLimit(exhausted);
    expect(checkRateLimit(exhausted).allowed).toBe(false);

    // A different IP should still be allowed
    const fresh = '192.0.2.5';
    expect(checkRateLimit(fresh).allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// resetRateLimit
// ---------------------------------------------------------------------------

describe('resetRateLimit', () => {
  it('clears the rate limit so the IP is allowed again', () => {
    const ip = '192.0.2.10';
    for (let i = 0; i < 6; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(false);

    resetRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(true);
  });

  it('is a no-op for an IP with no existing record', () => {
    expect(() => resetRateLimit('192.0.2.99')).not.toThrow();
  });
});
