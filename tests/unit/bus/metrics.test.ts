import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { parseUsageOutput, storeUsageData } from '../../../src/bus/metrics';

// ---- parseUsageOutput -------------------------------------------------------

/** Realistic /usage output from Claude Code with all three sections. */
const FULL_USAGE = `
╔══════════════════════════════════════╗
║           Claude Code Usage          ║
╚══════════════════════════════════════╝

Current session
  ████░░░░░░ 45%
  Resets on Monday at 9:00 AM

Current week (all models)
  ██░░░░░░░░ 23%
  Resets in 3 days

Current week (Sonnet 3.5)
  █░░░░░░░░░ 15%
`;

const SESSION_ONLY = `
Current session
  ████░░░░░░ 72%
  Resets tomorrow at 6 AM
`;

const NO_USAGE_OUTPUT = '';

const ZERO_USAGE = `
Current session
  0%
  Resets in 5 hours
Current week (all models)
  0%
Current week (Sonnet 4)
  0%
`;

describe('parseUsageOutput', () => {
  it('extracts session percentage from full output', () => {
    const result = parseUsageOutput(FULL_USAGE, 'dev');
    expect(result.session.used_pct).toBe(45);
  });

  it('extracts week all-models percentage from full output', () => {
    const result = parseUsageOutput(FULL_USAGE, 'dev');
    expect(result.week_all_models.used_pct).toBe(23);
  });

  it('extracts week Sonnet percentage from full output', () => {
    const result = parseUsageOutput(FULL_USAGE, 'dev');
    expect(result.week_sonnet.used_pct).toBe(15);
  });

  it('extracts session reset time', () => {
    const result = parseUsageOutput(FULL_USAGE, 'dev');
    expect(result.session.resets).toBe('on Monday at 9:00 AM');
  });

  it('extracts week reset time', () => {
    const result = parseUsageOutput(FULL_USAGE, 'dev');
    expect(result.week_all_models.resets).toBe('in 3 days');
  });

  it('sets agent name from argument', () => {
    const result = parseUsageOutput(FULL_USAGE, 'analyst');
    expect(result.agent).toBe('analyst');
  });

  it('produces a valid ISO timestamp', () => {
    const result = parseUsageOutput(FULL_USAGE, 'dev');
    expect(Date.parse(result.timestamp)).not.toBeNaN();
  });

  it('returns 0 for all percentages when output is empty', () => {
    const result = parseUsageOutput(NO_USAGE_OUTPUT, 'dev');
    expect(result.session.used_pct).toBe(0);
    expect(result.week_all_models.used_pct).toBe(0);
    expect(result.week_sonnet.used_pct).toBe(0);
  });

  it('returns empty strings for reset times when absent', () => {
    const result = parseUsageOutput(NO_USAGE_OUTPUT, 'dev');
    expect(result.session.resets).toBe('');
    expect(result.week_all_models.resets).toBe('');
  });

  it('extracts correctly from session-only output (no week section)', () => {
    const result = parseUsageOutput(SESSION_ONLY, 'dev');
    expect(result.session.used_pct).toBe(72);
    expect(result.week_all_models.used_pct).toBe(0);
    expect(result.week_sonnet.used_pct).toBe(0);
  });

  it('handles 0% values without false zero-exclusion', () => {
    const result = parseUsageOutput(ZERO_USAGE, 'dev');
    expect(result.session.used_pct).toBe(0);
    expect(result.week_all_models.used_pct).toBe(0);
    expect(result.week_sonnet.used_pct).toBe(0);
  });
});

// ---- storeUsageData ---------------------------------------------------------

describe('storeUsageData', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'usage-test-'));
  });

  afterEach(() => {
    try { rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
  });

  const sampleData = {
    agent: 'dev',
    timestamp: '2024-01-15T12:30:00Z',
    session: { used_pct: 45, resets: 'tomorrow' },
    week_all_models: { used_pct: 23, resets: 'in 3 days' },
    week_sonnet: { used_pct: 15 },
  };

  it('writes latest.json under state/usage/', () => {
    storeUsageData(tmpDir, sampleData);
    const latestPath = join(tmpDir, 'state', 'usage', 'latest.json');
    expect(existsSync(latestPath)).toBe(true);
    const written = JSON.parse(readFileSync(latestPath, 'utf-8'));
    expect(written.agent).toBe('dev');
    expect(written.session.used_pct).toBe(45);
  });

  it('creates the daily JSONL file named after the timestamp date', () => {
    storeUsageData(tmpDir, sampleData);
    const dailyPath = join(tmpDir, 'state', 'usage', '2024-01-15.jsonl');
    expect(existsSync(dailyPath)).toBe(true);
  });

  it('appends a valid JSONL line to the daily file', () => {
    storeUsageData(tmpDir, sampleData);
    const dailyPath = join(tmpDir, 'state', 'usage', '2024-01-15.jsonl');
    const lines = readFileSync(dailyPath, 'utf-8').trim().split('\n').filter(Boolean);
    expect(lines).toHaveLength(1);
    const entry = JSON.parse(lines[0]);
    expect(entry.agent).toBe('dev');
    expect(entry.session.used_pct).toBe(45);
  });

  it('appends multiple entries to the same daily file', () => {
    storeUsageData(tmpDir, sampleData);
    storeUsageData(tmpDir, { ...sampleData, session: { used_pct: 60, resets: 'tomorrow' } });
    const dailyPath = join(tmpDir, 'state', 'usage', '2024-01-15.jsonl');
    const lines = readFileSync(dailyPath, 'utf-8').trim().split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
  });

  it('overwrites latest.json on each call', () => {
    storeUsageData(tmpDir, sampleData);
    storeUsageData(tmpDir, { ...sampleData, session: { used_pct: 80, resets: '' } });
    const latest = JSON.parse(readFileSync(join(tmpDir, 'state', 'usage', 'latest.json'), 'utf-8'));
    expect(latest.session.used_pct).toBe(80);
  });

  it('creates state/usage/ directories automatically', () => {
    // tmpDir is fresh, no subdirs created yet
    storeUsageData(tmpDir, sampleData);
    expect(existsSync(join(tmpDir, 'state', 'usage'))).toBe(true);
  });
});
