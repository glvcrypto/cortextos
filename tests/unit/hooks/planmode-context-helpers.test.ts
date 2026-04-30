import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, utimesSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Mock os.homedir so findMostRecentPlan reads from a controlled tmp directory.
// Spread actual so tmpdir() and other exports remain functional.
vi.mock('os', async () => {
  const actual = await vi.importActual<typeof import('os')>('os');
  return { ...actual, homedir: vi.fn() };
});

import { homedir } from 'os';
import { findMostRecentPlan, readPlanContent } from '../../../src/hooks/hook-planmode-telegram';
import { buildContextStatusPayload } from '../../../src/hooks/hook-context-status';
import type { StatusLineInput } from '../../../src/hooks/hook-context-status';

// ---------------------------------------------------------------------------
// findMostRecentPlan
// ---------------------------------------------------------------------------

describe('findMostRecentPlan', () => {
  let homeDir: string;

  beforeEach(() => {
    homeDir = mkdtempSync(join(tmpdir(), 'cortextos-homedir-'));
    vi.mocked(homedir).mockReturnValue(homeDir);
  });

  afterEach(() => {
    rmSync(homeDir, { recursive: true, force: true });
    vi.mocked(homedir).mockReset();
  });

  it('returns null when plans dir does not exist', () => {
    // ~/.claude/plans does not exist in homeDir
    expect(findMostRecentPlan()).toBeNull();
  });

  it('returns null when plans dir exists but is empty', () => {
    const plansDir = join(homeDir, '.claude', 'plans');
    mkdirSync(plansDir, { recursive: true });
    expect(findMostRecentPlan()).toBeNull();
  });

  it('returns the single .md file path when only one exists', () => {
    const plansDir = join(homeDir, '.claude', 'plans');
    mkdirSync(plansDir, { recursive: true });
    const planFile = join(plansDir, 'plan-one.md');
    writeFileSync(planFile, '# Plan One');
    expect(findMostRecentPlan()).toBe(planFile);
  });

  it('returns the most recently modified .md file among multiple', () => {
    const plansDir = join(homeDir, '.claude', 'plans');
    mkdirSync(plansDir, { recursive: true });

    const older = join(plansDir, 'old-plan.md');
    const newer = join(plansDir, 'new-plan.md');
    writeFileSync(older, '# Old Plan');
    writeFileSync(newer, '# New Plan');

    // Force older to be 60s in the past, newer to be 30s in the past
    const now = Date.now() / 1000;
    utimesSync(older, now - 60, now - 60);
    utimesSync(newer, now - 30, now - 30);

    expect(findMostRecentPlan()).toBe(newer);
  });

  it('ignores non-.md files and returns null when only .txt present', () => {
    const plansDir = join(homeDir, '.claude', 'plans');
    mkdirSync(plansDir, { recursive: true });
    writeFileSync(join(plansDir, 'notes.txt'), 'some notes');
    expect(findMostRecentPlan()).toBeNull();
  });

  it('ignores non-.md files and still finds the .md file in a mixed dir', () => {
    const plansDir = join(homeDir, '.claude', 'plans');
    mkdirSync(plansDir, { recursive: true });
    const planFile = join(plansDir, 'current.md');
    writeFileSync(planFile, '# Current Plan');
    writeFileSync(join(plansDir, 'readme.txt'), 'ignore me');
    writeFileSync(join(plansDir, 'data.json'), '{}');
    expect(findMostRecentPlan()).toBe(planFile);
  });

  it('returns null and does not throw when plans dir is a file (readdirSync error)', () => {
    const dotClaude = join(homeDir, '.claude');
    mkdirSync(dotClaude, { recursive: true });
    // Write a regular file where the plans dir should be
    writeFileSync(join(dotClaude, 'plans'), 'not a directory');
    expect(findMostRecentPlan()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// readPlanContent
// ---------------------------------------------------------------------------

describe('readPlanContent', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-plans-'));
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('returns empty string for a nonexistent file', () => {
    expect(readPlanContent(join(testDir, 'no-such-file.md'))).toBe('');
  });

  it('returns full content when file has fewer than 100 lines', () => {
    const planPath = join(testDir, 'short.md');
    const content = Array.from({ length: 10 }, (_, i) => `Line ${i + 1}`).join('\n');
    writeFileSync(planPath, content);
    const result = readPlanContent(planPath);
    expect(result).toContain('Line 1');
    expect(result).toContain('Line 10');
  });

  it('returns all content when file has exactly 100 lines', () => {
    const planPath = join(testDir, 'exact100.md');
    const lines = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}`);
    writeFileSync(planPath, lines.join('\n'));
    const result = readPlanContent(planPath);
    expect(result).toContain('Line 1');
    expect(result).toContain('Line 100');
  });

  it('returns only the first 100 lines when file has more', () => {
    const planPath = join(testDir, 'long.md');
    const lines = Array.from({ length: 150 }, (_, i) => `Line ${i + 1}`);
    writeFileSync(planPath, lines.join('\n'));
    const result = readPlanContent(planPath);
    expect(result).toContain('Line 100');
    expect(result).not.toContain('Line 101');
  });

  it('returns empty string when path is a directory (readFileSync error)', () => {
    const subDir = join(testDir, 'subdir');
    mkdirSync(subDir);
    expect(readPlanContent(subDir)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// buildContextStatusPayload
// ---------------------------------------------------------------------------

describe('buildContextStatusPayload', () => {
  const TS = '2026-04-30T12:00:00.000Z';

  it('preserves used_percentage when it is a number', () => {
    const data: StatusLineInput = { context_window: { used_percentage: 42.5 } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.used_percentage).toBe(42.5);
  });

  it('converts null used_percentage to null', () => {
    const data: StatusLineInput = { context_window: { used_percentage: null } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.used_percentage).toBeNull();
  });

  it('converts undefined used_percentage to null', () => {
    const data: StatusLineInput = { context_window: {} };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.used_percentage).toBeNull();
  });

  it('converts non-number used_percentage (string) to null', () => {
    const data = { context_window: { used_percentage: '75%' as any } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.used_percentage).toBeNull();
  });

  it('preserves context_window_size when set', () => {
    const data: StatusLineInput = { context_window: { context_window_size: 200000 } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.context_window_size).toBe(200000);
  });

  it('maps undefined context_window_size to null', () => {
    const data: StatusLineInput = { context_window: {} };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.context_window_size).toBeNull();
  });

  it('sets exceeds_200k_tokens true when flag is true', () => {
    const data: StatusLineInput = { context_window: { exceeds_200k_tokens: true } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.exceeds_200k_tokens).toBe(true);
  });

  it('sets exceeds_200k_tokens false when flag is false', () => {
    const data: StatusLineInput = { context_window: { exceeds_200k_tokens: false } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.exceeds_200k_tokens).toBe(false);
  });

  it('sets exceeds_200k_tokens false when flag is undefined (Boolean coercion)', () => {
    const data: StatusLineInput = { context_window: {} };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.exceeds_200k_tokens).toBe(false);
  });

  it('preserves current_usage when provided', () => {
    const usage = { input_tokens: 100, output_tokens: 200, cache_creation_input_tokens: 0, cache_read_input_tokens: 50 };
    const data: StatusLineInput = { context_window: { current_usage: usage } };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.current_usage).toEqual(usage);
  });

  it('maps undefined current_usage to null', () => {
    const data: StatusLineInput = { context_window: {} };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.current_usage).toBeNull();
  });

  it('preserves session_id when provided', () => {
    const data: StatusLineInput = { context_window: {}, session_id: 'sess-abc' };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.session_id).toBe('sess-abc');
  });

  it('maps undefined session_id to null and echoes writtenAt verbatim', () => {
    const data: StatusLineInput = { context_window: {} };
    const result = JSON.parse(buildContextStatusPayload(data, TS));
    expect(result.session_id).toBeNull();
    expect(result.written_at).toBe(TS);
  });
});
