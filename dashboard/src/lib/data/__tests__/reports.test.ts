import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// reports.ts reads CTX_ROOT directly from process.env (no @/lib/config import),
// so we just need to set it before the module loads.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reports-test-'));
process.env.CTX_ROOT = tmpDir;

let getLatestSnapshot: typeof import('../reports')['getLatestSnapshot'];
let getPlanUsage: typeof import('../reports')['getPlanUsage'];
let getUsageHistory: typeof import('../reports')['getUsageHistory'];

beforeAll(async () => {
  const mod = await import('../reports');
  getLatestSnapshot = mod.getLatestSnapshot;
  getPlanUsage = mod.getPlanUsage;
  getUsageHistory = mod.getUsageHistory;
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// Helpers
function reportsDir(org: string) {
  return path.join(tmpDir, 'orgs', org, 'analytics', 'reports');
}
function usageDir() {
  return path.join(tmpDir, 'state', 'usage');
}
function writeLatest(org: string, data: unknown) {
  const dir = reportsDir(org);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'latest.json'), JSON.stringify(data), 'utf-8');
}

// ---------------------------------------------------------------------------
// getLatestSnapshot
// ---------------------------------------------------------------------------

describe('getLatestSnapshot', () => {
  it('returns null when file does not exist', () => {
    expect(getLatestSnapshot('no-org')).toBeNull();
  });

  it('returns null when JSON is corrupt', () => {
    const dir = reportsDir('bad-org');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'latest.json'), 'not json');
    expect(getLatestSnapshot('bad-org')).toBeNull();
  });

  it('returns parsed snapshot when file is valid', () => {
    writeLatest('glv', {
      date: '2026-04-30',
      generated_at: '2026-04-30T12:00:00Z',
      health: { agents: {} },
      productivity: {},
      cost: {},
      alignment: {},
    });
    const snap = getLatestSnapshot('glv');
    expect(snap?.date).toBe('2026-04-30');
    expect(snap?.generatedAt).toBe('2026-04-30T12:00:00Z');
  });

  it('defaults missing fields to empty objects', () => {
    writeLatest('defaults-org', { date: '2026-04-30' });
    const snap = getLatestSnapshot('defaults-org');
    expect(snap?.health).toEqual({});
    expect(snap?.productivity).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// getPlanUsage
// ---------------------------------------------------------------------------

describe('getPlanUsage', () => {
  it('returns null when file does not exist', () => {
    expect(getPlanUsage()).toBeNull();
  });

  it('returns null when file JSON is invalid', () => {
    const dir = path.join(tmpDir, 'state', 'usage');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'latest.json'), '{bad}');
    expect(getPlanUsage()).toBeNull();
    fs.unlinkSync(path.join(dir, 'latest.json'));
  });

  it('returns parsed usage when file exists', () => {
    const dir = path.join(tmpDir, 'state', 'usage');
    fs.mkdirSync(dir, { recursive: true });
    const data = { session_pct: 45, week_pct: 30 };
    fs.writeFileSync(path.join(dir, 'latest.json'), JSON.stringify(data));
    const result = getPlanUsage() as Record<string, number>;
    expect(result.session_pct).toBe(45);
    expect(result.week_pct).toBe(30);
  });
});

// ---------------------------------------------------------------------------
// getUsageHistory
// ---------------------------------------------------------------------------

describe('getUsageHistory', () => {
  it('returns empty array when usage dir does not exist', () => {
    // tmpDir has a state/usage dir from prior test — remove it
    const dir = usageDir();
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    expect(getUsageHistory()).toEqual([]);
  });

  it('returns empty array when no JSONL files in range', () => {
    fs.mkdirSync(usageDir(), { recursive: true });
    expect(getUsageHistory(7)).toEqual([]);
  });

  it('parses a JSONL file for today', () => {
    const today = new Date().toISOString().split('T')[0];
    const dir = usageDir();
    fs.mkdirSync(dir, { recursive: true });
    const entry = {
      timestamp: new Date().toISOString(),
      session: { used_pct: 55 },
      week_all_models: { used_pct: 40 },
      week_sonnet: { used_pct: 30 },
    };
    fs.writeFileSync(path.join(dir, `${today}.jsonl`), JSON.stringify(entry) + '\n');

    const result = getUsageHistory(1);
    expect(result).toHaveLength(1);
    expect(result[0].session_pct).toBe(55);
    expect(result[0].week_pct).toBe(40);
    expect(result[0].sonnet_pct).toBe(30);
  });

  it('skips corrupt lines without throwing', () => {
    const today = new Date().toISOString().split('T')[0];
    const dir = usageDir();
    fs.mkdirSync(dir, { recursive: true });
    const good = JSON.stringify({ timestamp: 't', session: { used_pct: 10 }, week_all_models: { used_pct: 5 }, week_sonnet: { used_pct: 3 } });
    fs.writeFileSync(path.join(dir, `${today}.jsonl`), 'BAD LINE\n' + good + '\n');
    const result = getUsageHistory(1);
    expect(result).toHaveLength(1); // only the valid line
    expect(result[0].session_pct).toBe(10);
  });

  it('defaults missing usage fields to 0', () => {
    const today = new Date().toISOString().split('T')[0];
    const dir = usageDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${today}.jsonl`), JSON.stringify({ timestamp: 't' }) + '\n');
    const result = getUsageHistory(1);
    expect(result[0].session_pct).toBe(0);
    expect(result[0].week_pct).toBe(0);
    expect(result[0].sonnet_pct).toBe(0);
  });
});
