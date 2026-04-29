import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { updateCronFire, readCronState, parseDurationMs, cronExpressionMinIntervalMs } from '../../../src/bus/cron-state';

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'cron-state-test-'));
});

function cleanup() {
  try { rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
}

describe('parseDurationMs', () => {
  it('parses minutes', () => {
    expect(parseDurationMs('30m')).toBe(30 * 60_000);
  });

  it('parses hours', () => {
    expect(parseDurationMs('6h')).toBe(6 * 3_600_000);
    expect(parseDurationMs('24h')).toBe(24 * 3_600_000);
  });

  it('parses days', () => {
    expect(parseDurationMs('1d')).toBe(86_400_000);
  });

  it('parses weeks', () => {
    expect(parseDurationMs('2w')).toBe(2 * 604_800_000);
  });

  it('returns NaN for cron expressions', () => {
    expect(parseDurationMs('0 8 * * *')).toBeNaN();
    expect(parseDurationMs('*/5 * * * *')).toBeNaN();
  });

  it('returns NaN for empty string', () => {
    expect(parseDurationMs('')).toBeNaN();
  });

  it('returns NaN for unknown unit', () => {
    expect(parseDurationMs('5y')).toBeNaN();
    expect(parseDurationMs('10s')).toBeNaN();
  });

  it('trims surrounding whitespace', () => {
    expect(parseDurationMs('  30m  ')).toBe(30 * 60_000);
  });

  it('returns 0 for 0-value inputs', () => {
    expect(parseDurationMs('0m')).toBe(0);
    expect(parseDurationMs('0h')).toBe(0);
  });

  it('returns NaN for bare number with no unit', () => {
    expect(parseDurationMs('30')).toBeNaN();
  });
});

describe('readCronState', () => {
  it('returns empty state when file does not exist', () => {
    const state = readCronState(tmpDir);
    expect(state.crons).toEqual([]);
    cleanup();
  });
});

describe('updateCronFire', () => {
  it('creates a record when none exists', () => {
    updateCronFire(tmpDir, 'heartbeat', '6h');
    const state = readCronState(tmpDir);
    expect(state.crons).toHaveLength(1);
    expect(state.crons[0].name).toBe('heartbeat');
    expect(state.crons[0].interval).toBe('6h');
    expect(Date.parse(state.crons[0].last_fire)).not.toBeNaN();
    cleanup();
  });

  it('updates existing record for the same cron name', () => {
    updateCronFire(tmpDir, 'heartbeat', '6h');
    const first = readCronState(tmpDir).crons[0].last_fire;

    // Ensure time advances
    const before = Date.now();
    updateCronFire(tmpDir, 'heartbeat', '6h');
    const second = readCronState(tmpDir).crons[0].last_fire;

    expect(Date.parse(second)).toBeGreaterThanOrEqual(before);
    expect(readCronState(tmpDir).crons).toHaveLength(1); // no duplicate
    cleanup();
  });

  it('accumulates records for different cron names', () => {
    updateCronFire(tmpDir, 'heartbeat', '6h');
    updateCronFire(tmpDir, 'autoresearch', '24h');
    const state = readCronState(tmpDir);
    expect(state.crons).toHaveLength(2);
    const names = state.crons.map(r => r.name);
    expect(names).toContain('heartbeat');
    expect(names).toContain('autoresearch');
    cleanup();
  });

  it('works without interval argument', () => {
    updateCronFire(tmpDir, 'heartbeat');
    const state = readCronState(tmpDir);
    expect(state.crons[0].name).toBe('heartbeat');
    expect(state.crons[0].interval).toBeUndefined();
    cleanup();
  });

  it('survives a read-write-read cycle with correct values', () => {
    updateCronFire(tmpDir, 'inbox-triage', '2h');
    updateCronFire(tmpDir, 'heartbeat', '4h');
    const state = readCronState(tmpDir);
    const inbox = state.crons.find(r => r.name === 'inbox-triage');
    const hb = state.crons.find(r => r.name === 'heartbeat');
    expect(inbox?.interval).toBe('2h');
    expect(hb?.interval).toBe('4h');
    cleanup();
  });
});

// ---------------------------------------------------------------------------
// cronExpressionMinIntervalMs — previously untested exported function
// ---------------------------------------------------------------------------

describe('cronExpressionMinIntervalMs', () => {
  const MIN_MS = 60_000;
  const HOUR_MS = 3_600_000;
  const DAY_MS = 24 * HOUR_MS;
  const FALLBACK_MS = 48 * HOUR_MS;

  describe('every-N-minutes pattern (*/N * * * *)', () => {
    it('*/5 * * * * → 5 minutes', () => {
      expect(cronExpressionMinIntervalMs('*/5 * * * *')).toBe(5 * MIN_MS);
    });

    it('*/1 * * * * → 1 minute', () => {
      expect(cronExpressionMinIntervalMs('*/1 * * * *')).toBe(1 * MIN_MS);
    });

    it('*/30 * * * * → 30 minutes', () => {
      expect(cronExpressionMinIntervalMs('*/30 * * * *')).toBe(30 * MIN_MS);
    });

    it('*/5 with non-wildcard hour does NOT match every-minute pattern → falls through to fixed-hour', () => {
      // */5 8 * * * means "every 5 min during hour 8" — the function treats
      // hour=8 as a fixed hour and returns 24h (conservative: min gap is 1 day)
      expect(cronExpressionMinIntervalMs('*/5 8 * * *')).toBe(DAY_MS);
    });
  });

  describe('every-N-hours pattern (min */N * * *)', () => {
    it('0 */4 * * * → 4 hours', () => {
      expect(cronExpressionMinIntervalMs('0 */4 * * *')).toBe(4 * HOUR_MS);
    });

    it('0 */1 * * * → 1 hour', () => {
      expect(cronExpressionMinIntervalMs('0 */1 * * *')).toBe(1 * HOUR_MS);
    });

    it('0 */2 * * * → 2 hours', () => {
      expect(cronExpressionMinIntervalMs('0 */2 * * *')).toBe(2 * HOUR_MS);
    });

    it('30 */6 * * * → 6 hours', () => {
      expect(cronExpressionMinIntervalMs('30 */6 * * *')).toBe(6 * HOUR_MS);
    });
  });

  describe('fixed-hour pattern (min <N> * * *) → daily', () => {
    it('0 8 * * * → 24 hours (daily at 8am)', () => {
      expect(cronExpressionMinIntervalMs('0 8 * * *')).toBe(DAY_MS);
    });

    it('0 0 * * * → 24 hours (midnight daily)', () => {
      expect(cronExpressionMinIntervalMs('0 0 * * *')).toBe(DAY_MS);
    });

    it('30 14 * * 1 → 24 hours (fixed hour on Monday)', () => {
      expect(cronExpressionMinIntervalMs('30 14 * * 1')).toBe(DAY_MS);
    });

    it('0 9 1 * * → 24 hours (fixed hour, monthly day — still daily min gap)', () => {
      expect(cronExpressionMinIntervalMs('0 9 1 * *')).toBe(DAY_MS);
    });
  });

  describe('fallback for unrecognised patterns', () => {
    it('* * * * * (every minute wildcard) → fallback 48h', () => {
      // minute=*, hour=* — everyMin needs */N, everyHour needs */N, fixedHour needs \d+ — none match
      expect(cronExpressionMinIntervalMs('* * * * *')).toBe(FALLBACK_MS);
    });

    it('wrong field count → fallback 48h', () => {
      expect(cronExpressionMinIntervalMs('0 8 *')).toBe(FALLBACK_MS);
      expect(cronExpressionMinIntervalMs('0 8 * * * *')).toBe(FALLBACK_MS);
    });

    it('empty string → fallback 48h', () => {
      expect(cronExpressionMinIntervalMs('')).toBe(FALLBACK_MS);
    });

    it('plain duration string (not a cron) → fallback 48h', () => {
      expect(cronExpressionMinIntervalMs('4h')).toBe(FALLBACK_MS);
    });
  });
});
