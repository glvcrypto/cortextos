import { describe, it, expect } from 'vitest';
import { normalizeName, buildPairKey } from '../comms-identity';
import type { CommsIdentity } from '../comms-identity';

// ---------------------------------------------------------------------------
// Shared fixture — 3 known agents, canonical user is 'aiden'
// ---------------------------------------------------------------------------

const identity: CommsIdentity = {
  agents: new Set(['boss', 'dev', 'analyst']),
  canonicalUser: 'aiden',
};

// ---------------------------------------------------------------------------
// normalizeName
// ---------------------------------------------------------------------------

describe('normalizeName', () => {
  it('returns agent name unchanged for a known agent (lowercase)', () => {
    expect(normalizeName('boss', identity)).toBe('boss');
    expect(normalizeName('dev', identity)).toBe('dev');
    expect(normalizeName('analyst', identity)).toBe('analyst');
  });

  it('lowercases and returns known agent name when given uppercase', () => {
    expect(normalizeName('BOSS', identity)).toBe('boss');
    expect(normalizeName('DEV', identity)).toBe('dev');
  });

  it('normalizes unknown name to canonicalUser', () => {
    expect(normalizeName('someone-else', identity)).toBe('aiden');
  });

  it('normalizes the canonicalUser itself (not in agents set) to canonicalUser', () => {
    expect(normalizeName('aiden', identity)).toBe('aiden');
  });

  it('normalizes empty string to canonicalUser', () => {
    expect(normalizeName('', identity)).toBe('aiden');
  });

  it('handles Telegram display names (not agents) → canonicalUser', () => {
    expect(normalizeName('Aiden Glave', identity)).toBe('aiden');
    expect(normalizeName('Joshua B', identity)).toBe('aiden');
  });
});

// ---------------------------------------------------------------------------
// buildPairKey
// ---------------------------------------------------------------------------

describe('buildPairKey', () => {
  it('produces alphabetically sorted key — agent to user', () => {
    // 'aiden' < 'boss' alphabetically
    expect(buildPairKey('boss', 'aiden', identity)).toBe('aiden--boss');
  });

  it('is direction-independent — same key regardless of from/to order', () => {
    const forward = buildPairKey('boss', 'aiden', identity);
    const reverse = buildPairKey('aiden', 'boss', identity);
    expect(forward).toBe(reverse);
  });

  it('two agents produce alphabetically sorted key', () => {
    // 'boss' < 'dev'
    expect(buildPairKey('dev', 'boss', identity)).toBe('boss--dev');
    expect(buildPairKey('boss', 'dev', identity)).toBe('boss--dev');
  });

  it('unknown from normalizes to canonicalUser before sorting', () => {
    // unknown → 'aiden', to='boss' → 'aiden--boss'
    expect(buildPairKey('unknown-sender', 'boss', identity)).toBe('aiden--boss');
  });

  it('two unknowns both normalize to canonicalUser — produces user--user key', () => {
    expect(buildPairKey('nobody', 'also-nobody', identity)).toBe('aiden--aiden');
  });

  it('is case-insensitive — BOSS and dev produce same key as boss and dev', () => {
    expect(buildPairKey('BOSS', 'DEV', identity)).toBe('boss--dev');
  });

  it('symmetry: swap from and to gives identical key', () => {
    const pairs: [string, string][] = [
      ['boss', 'analyst'],
      ['dev', 'unknown'],
      ['aiden', 'dev'],
    ];
    for (const [a, b] of pairs) {
      expect(buildPairKey(a, b, identity)).toBe(buildPairKey(b, a, identity));
    }
  });
});
