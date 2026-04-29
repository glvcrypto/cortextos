import { describe, it, expect } from 'vitest';
import { randomString, randomDigits } from '../../../src/utils/random';

// ---------------------------------------------------------------------------
// randomString
// ---------------------------------------------------------------------------

describe('randomString', () => {
  it('returns a string of the requested length', () => {
    expect(randomString(8)).toHaveLength(8);
    expect(randomString(16)).toHaveLength(16);
    expect(randomString(32)).toHaveLength(32);
    expect(randomString(1)).toHaveLength(1);
  });

  it('contains only alphanumeric lowercase characters', () => {
    const result = randomString(200);
    expect(result).toMatch(/^[a-z0-9]+$/);
  });

  it('returns distinct values across calls (collision resistance)', () => {
    const values = new Set(Array.from({ length: 20 }, () => randomString(12)));
    expect(values.size).toBe(20);
  });

  it('length 0 returns empty string', () => {
    expect(randomString(0)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// randomDigits
// ---------------------------------------------------------------------------

describe('randomDigits', () => {
  it('returns a string of the requested length', () => {
    expect(randomDigits(6)).toHaveLength(6);
    expect(randomDigits(10)).toHaveLength(10);
    expect(randomDigits(1)).toHaveLength(1);
  });

  it('contains only digit characters 0–9', () => {
    const result = randomDigits(200);
    expect(result).toMatch(/^[0-9]+$/);
  });

  it('contains no letters', () => {
    const result = randomDigits(100);
    expect(result).not.toMatch(/[a-zA-Z]/);
  });

  it('returns distinct values across calls', () => {
    const values = new Set(Array.from({ length: 20 }, () => randomDigits(8)));
    // With 8 digits there are 100M possibilities; 20 calls should all differ
    expect(values.size).toBeGreaterThan(15);
  });

  it('length 0 returns empty string', () => {
    expect(randomDigits(0)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// randomString vs randomDigits — charset disjoint check
// ---------------------------------------------------------------------------

describe('randomString vs randomDigits', () => {
  it('randomString can produce letters; randomDigits never does', () => {
    // Run enough iterations that randomString will produce at least one letter
    const strResult = Array.from({ length: 10 }, () => randomString(20)).join('');
    expect(strResult).toMatch(/[a-z]/); // letters expected
    const digResult = Array.from({ length: 10 }, () => randomDigits(20)).join('');
    expect(digResult).not.toMatch(/[a-z]/); // no letters
  });
});
