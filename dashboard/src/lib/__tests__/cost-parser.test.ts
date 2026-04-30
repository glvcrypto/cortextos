import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Set CTX_ROOT before db.ts evaluates — controls where SQLite file is created.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cost-parser-test-'));
process.env.CTX_ROOT = tmpDir;

let calculateCost: typeof import('../cost-parser')['calculateCost'];

beforeAll(async () => {
  const mod = await import('../cost-parser');
  calculateCost = mod.calculateCost;
});

// ---------------------------------------------------------------------------
// Model routing via resolvePricingKey (tested through calculateCost)
// ---------------------------------------------------------------------------

describe('model routing', () => {
  it('routes model containing "opus" to opus pricing', () => {
    // 1M input-only: opus $15/M
    expect(calculateCost('claude-3-opus-20240229', 1_000_000, 0)).toBe(15);
  });

  it('routes model containing "haiku" to haiku pricing', () => {
    // 1M input-only: haiku $0.80/M
    expect(calculateCost('claude-haiku-4-5', 1_000_000, 0)).toBe(0.8);
  });

  it('routes model containing "sonnet" to sonnet pricing', () => {
    // 1M input-only: sonnet $3/M
    expect(calculateCost('claude-sonnet-4-6', 1_000_000, 0)).toBe(3);
  });

  it('defaults unknown model to sonnet pricing', () => {
    expect(calculateCost('gpt-unknown-9000', 1_000_000, 0)).toBe(3);
  });

  it('is case-insensitive — "CLAUDE-OPUS-LATEST" resolves to opus', () => {
    expect(calculateCost('CLAUDE-OPUS-LATEST', 1_000_000, 0)).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Basic pricing math
// ---------------------------------------------------------------------------

describe('basic pricing math', () => {
  it('returns 0 for zero tokens', () => {
    expect(calculateCost('claude-sonnet-4-6', 0, 0)).toBe(0);
    expect(calculateCost('claude-3-opus-20240229', 0, 0)).toBe(0);
  });

  it('sonnet: 1M input tokens → $3.00', () => {
    expect(calculateCost('claude-sonnet-4-6', 1_000_000, 0)).toBe(3);
  });

  it('sonnet: 1M output tokens → $15.00', () => {
    expect(calculateCost('claude-sonnet-4-6', 0, 1_000_000)).toBe(15);
  });

  it('opus: 1M input + 1M output → $90.00', () => {
    // input $15/M + output $75/M
    expect(calculateCost('claude-3-opus-20240229', 1_000_000, 1_000_000)).toBe(90);
  });

  it('haiku: 1M input + 1M output → $4.80', () => {
    // input $0.80/M + output $4/M
    expect(calculateCost('claude-haiku-4-5', 1_000_000, 1_000_000)).toBe(4.8);
  });
});

// ---------------------------------------------------------------------------
// Cache token pricing
// ---------------------------------------------------------------------------

describe('cache token pricing', () => {
  it('sonnet: 1M cache-write tokens → $3.75', () => {
    expect(calculateCost('claude-sonnet-4-6', 0, 0, 1_000_000, 0)).toBe(3.75);
  });

  it('sonnet: 1M cache-read tokens → $0.30', () => {
    expect(calculateCost('claude-sonnet-4-6', 0, 0, 0, 1_000_000)).toBe(0.3);
  });

  it('sonnet: all four token types combined', () => {
    // input $3 + output $15 + cacheWrite $3.75 + cacheRead $0.30 = $22.05
    expect(
      calculateCost('claude-sonnet-4-6', 1_000_000, 1_000_000, 1_000_000, 1_000_000),
    ).toBe(22.05);
  });

  it('opus: cache-read tokens charged at $1.50/M', () => {
    expect(calculateCost('claude-3-opus-20240229', 0, 0, 0, 1_000_000)).toBe(1.5);
  });
});

// ---------------------------------------------------------------------------
// Precision and small token counts
// ---------------------------------------------------------------------------

describe('precision', () => {
  it('rounds to 6 decimal places — 10 input + 10 output sonnet tokens', () => {
    // (10/1M * 3) + (10/1M * 15) = 0.00003 + 0.00015 = 0.00018
    expect(calculateCost('claude-sonnet-4-6', 10, 10)).toBe(0.00018);
  });

  it('rounds to 6 decimal places — 1 input opus token', () => {
    // (1/1M * 15) = 0.000015
    expect(calculateCost('claude-3-opus-20240229', 1, 0)).toBe(0.000015);
  });

  it('rounds to 6 decimal places — 1 input haiku token', () => {
    // (1/1M * 0.8) = 0.0000008 → Math.round(0.8) = 1 → 0.000001
    expect(calculateCost('claude-haiku-4-5', 1, 0)).toBe(0.000001);
  });
});
