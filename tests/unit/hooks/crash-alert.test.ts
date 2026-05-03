import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  isQuietHoursLA,
  detectRateLimitInLog,
  shouldSuppressDedup,
} from '../../../src/hooks/hook-crash-alert';

// All date tests use April 28, 2026 (PDT = UTC-7, DST active)
// LA_time = UTC_time - 7h

describe('isQuietHoursLA', () => {
  it('22:00 PDT is quiet (start boundary, hour >= 22)', () => {
    // 05:00 UTC → 22:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T05:00:00Z'))).toBe(true);
  });

  it('21:59 PDT is not quiet (one minute before quiet starts)', () => {
    // 04:59 UTC → 21:59 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T04:59:00Z'))).toBe(false);
  });

  it('23:00 PDT is quiet', () => {
    // 06:00 UTC → 23:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T06:00:00Z'))).toBe(true);
  });

  it('00:00 PDT (midnight) is quiet (hour < 7)', () => {
    // 07:00 UTC → 00:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T07:00:00Z'))).toBe(true);
  });

  it('01:00 PDT is quiet', () => {
    // 08:00 UTC → 01:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T08:00:00Z'))).toBe(true);
  });

  it('06:00 PDT is quiet', () => {
    // 13:00 UTC → 06:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T13:00:00Z'))).toBe(true);
  });

  it('06:59 PDT is quiet (last quiet minute, hour < 7)', () => {
    // 13:59 UTC → 06:59 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T13:59:00Z'))).toBe(true);
  });

  it('07:00 PDT is not quiet (end boundary, hour is neither < 7 nor >= 22)', () => {
    // 14:00 UTC → 07:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T14:00:00Z'))).toBe(false);
  });

  it('13:00 PDT is not quiet (midday)', () => {
    // 20:00 UTC → 13:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T20:00:00Z'))).toBe(false);
  });

  it('21:00 PDT is not quiet', () => {
    // 04:00 UTC → 21:00 PDT
    expect(isQuietHoursLA(new Date('2026-04-28T04:00:00Z'))).toBe(false);
  });
});

describe('detectRateLimitInLog', () => {
  let tmpDir: string;
  let logPath: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'crash-alert-detect-'));
    logPath = join(tmpDir, 'stdout.log');
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns false for nonexistent file', () => {
    expect(detectRateLimitInLog('/nonexistent/path/stdout.log')).toBe(false);
  });

  it('returns false for file with no rate limit text', () => {
    writeFileSync(logPath, 'Normal output.\nTask complete.\n', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(false);
  });

  it('detects "rate limit" substring (case-insensitive)', () => {
    writeFileSync(logPath, 'Error: RATE LIMIT exceeded', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "rate-limit" substring', () => {
    writeFileSync(logPath, 'Backoff due to rate-limit policy.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "rate_limit_error"', () => {
    writeFileSync(logPath, '{"type":"rate_limit_error","message":"requests too fast"}', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "overloaded_error"', () => {
    writeFileSync(logPath, 'claude returned overloaded_error, retrying', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "too many requests"', () => {
    writeFileSync(logPath, 'HTTP 429: Too Many Requests from Anthropic API', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "quota exceeded"', () => {
    writeFileSync(logPath, 'Your quota exceeded for this billing period.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "usage limit"', () => {
    writeFileSync(logPath, 'Usage limit reached for your plan.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "weekly limit"', () => {
    writeFileSync(logPath, 'Your weekly limit has been reached. Resets Monday.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "5-hour limit"', () => {
    writeFileSync(logPath, 'You have hit the 5-hour limit for Claude Pro.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "5h limit"', () => {
    writeFileSync(logPath, 'The 5h limit applies to this usage tier.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('detects "used N% of your" regex pattern', () => {
    writeFileSync(logPath, 'You have used 87% of your weekly allowance.', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });

  it('strips ANSI escape codes before matching', () => {
    // ANSI red + reset wrapping "rate limit"
    writeFileSync(logPath, '\x1b[31mrate limit\x1b[0m hit — backing off', 'utf-8');
    expect(detectRateLimitInLog(logPath)).toBe(true);
  });
});

describe('shouldSuppressDedup', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'crash-alert-dedup-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns false on first call (no dedup file exists) and creates the file', () => {
    const suppressed = shouldSuppressDedup(tmpDir, 'crash');
    expect(suppressed).toBe(false);
    const dedupFile = join(tmpDir, '.crash_alert_dedup.json');
    expect(existsSync(dedupFile)).toBe(true);
    const data = JSON.parse(readFileSync(dedupFile, 'utf-8'));
    expect(typeof data['crash']).toBe('number');
  });

  it('returns true on second immediate call within 10-min window', () => {
    shouldSuppressDedup(tmpDir, 'crash'); // records timestamp
    expect(shouldSuppressDedup(tmpDir, 'crash')).toBe(true);
  });

  it('returns false for a different end type (types tracked separately)', () => {
    shouldSuppressDedup(tmpDir, 'crash'); // records crash timestamp
    expect(shouldSuppressDedup(tmpDir, 'planned-restart')).toBe(false);
  });

  it('returns false when existing entry is older than 10 minutes (window expired)', () => {
    const dedupFile = join(tmpDir, '.crash_alert_dedup.json');
    const staleTs = Date.now() - 11 * 60 * 1000;
    writeFileSync(dedupFile, JSON.stringify({ crash: staleTs }), 'utf-8');
    expect(shouldSuppressDedup(tmpDir, 'crash')).toBe(false);
  });

  it('returns false and recovers gracefully from a corrupt dedup file', () => {
    const dedupFile = join(tmpDir, '.crash_alert_dedup.json');
    writeFileSync(dedupFile, 'NOT VALID JSON!!!', 'utf-8');
    expect(shouldSuppressDedup(tmpDir, 'crash')).toBe(false);
  });
});
