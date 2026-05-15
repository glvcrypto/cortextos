import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Set both roots to fresh temp dirs before any module import.
// This ensures getGoalsPath() always falls back to the state path (CTX_ROOT),
// since CTX_FRAMEWORK_ROOT has no org directories.
const tmpState = fs.mkdtempSync(path.join(os.tmpdir(), 'goals-test-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'goals-test-fw-'));
process.env.CTX_ROOT = tmpState;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

let getGoals: typeof import('../goals')['getGoals'];
let writeGoals: typeof import('../goals')['writeGoals'];

beforeAll(async () => {
  const mod = await import('../goals');
  getGoals = mod.getGoals;
  writeGoals = mod.writeGoals;
});

afterAll(() => {
  fs.rmSync(tmpState, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// getGoals — file missing
// ---------------------------------------------------------------------------

describe('getGoals — missing file', () => {
  it('returns default structure when goals.json does not exist', () => {
    const result = getGoals('no-such-org');
    expect(result).toEqual({ bottleneck: '', goals: [] });
  });

  it('returns an empty goals array (not null or undefined)', () => {
    const result = getGoals('another-missing-org');
    expect(Array.isArray(result.goals)).toBe(true);
    expect(result.goals).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// writeGoals + getGoals round-trip
// ---------------------------------------------------------------------------

describe('writeGoals + getGoals round-trip', () => {
  it('writes and reads back bottleneck', () => {
    writeGoals('rw-org', { bottleneck: 'token refresh blocked', goals: [] });
    const result = getGoals('rw-org');
    expect(result.bottleneck).toBe('token refresh blocked');
  });

  it('writes and reads back a goals array', () => {
    writeGoals('goals-org', {
      bottleneck: '',
      goals: [
        { id: 'g1', title: 'Ship PR #55', progress: 80, order: 0 },
        { id: 'g2', title: 'Reyco SEO retainer', progress: 20, order: 1 },
      ],
    });
    const result = getGoals('goals-org');
    expect(result.goals).toHaveLength(2);
    expect(result.goals[0].title).toBe('Ship PR #55');
    expect(result.goals[0].progress).toBe(80);
    expect(result.goals[1].title).toBe('Reyco SEO retainer');
  });

  it('overwrites on second write', () => {
    writeGoals('overwrite-org', { bottleneck: 'first', goals: [] });
    writeGoals('overwrite-org', { bottleneck: 'second', goals: [] });
    expect(getGoals('overwrite-org').bottleneck).toBe('second');
  });

  it('preserves optional daily_focus field', () => {
    writeGoals('focus-org', {
      bottleneck: '',
      goals: [],
      daily_focus: 'Land test coverage PR',
      daily_focus_set_at: '2026-04-30T10:00:00Z',
    });
    const result = getGoals('focus-org');
    expect(result.daily_focus).toBe('Land test coverage PR');
    expect(result.daily_focus_set_at).toBe('2026-04-30T10:00:00Z');
  });
});

// ---------------------------------------------------------------------------
// getGoals — legacy string format
// ---------------------------------------------------------------------------

describe('getGoals — legacy string-array format', () => {
  it('normalises legacy string goals into Goal objects', () => {
    // Write raw JSON with the legacy array-of-strings format
    const filePath = path.join(tmpState, 'orgs', 'legacy-org');
    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(
      path.join(filePath, 'goals.json'),
      JSON.stringify({ bottleneck: '', goals: ['Goal A', 'Goal B'] }),
      'utf-8',
    );

    const result = getGoals('legacy-org');
    expect(result.goals[0].title).toBe('Goal A');
    expect(result.goals[0].id).toBe('goal-0');
    expect(result.goals[1].title).toBe('Goal B');
    expect(result.goals[1].id).toBe('goal-1');
  });
});

// ---------------------------------------------------------------------------
// getGoals — corrupt JSON
// ---------------------------------------------------------------------------

describe('getGoals — corrupt file', () => {
  it('returns default structure when JSON is invalid', () => {
    const filePath = path.join(tmpState, 'orgs', 'bad-json-org');
    fs.mkdirSync(filePath, { recursive: true });
    fs.writeFileSync(path.join(filePath, 'goals.json'), '{ not valid json', 'utf-8');

    const result = getGoals('bad-json-org');
    expect(result).toEqual({ bottleneck: '', goals: [] });
  });
});
