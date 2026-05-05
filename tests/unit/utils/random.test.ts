import { describe, it, expect } from 'vitest';
import { randomString, randomDigits } from '../../../src/utils/random';

describe('randomString', () => {
  it('returns a string of the requested length', () => {
    expect(randomString(8)).toHaveLength(8);
    expect(randomString(1)).toHaveLength(1);
    expect(randomString(32)).toHaveLength(32);
  });

  it('contains only lowercase alphanumeric characters [a-z0-9]', () => {
    const s = randomString(200);
    expect(s).toMatch(/^[a-z0-9]+$/);
  });

  it('returns different values on successive calls', () => {
    const calls = Array.from({ length: 10 }, () => randomString(12));
    const unique = new Set(calls);
    expect(unique.size).toBeGreaterThan(1);
  });
});

describe('randomDigits', () => {
  it('returns a string of the requested length', () => {
    expect(randomDigits(6)).toHaveLength(6);
    expect(randomDigits(1)).toHaveLength(1);
    expect(randomDigits(16)).toHaveLength(16);
  });

  it('contains only digit characters [0-9]', () => {
    const s = randomDigits(200);
    expect(s).toMatch(/^[0-9]+$/);
  });

  it('returns different values on successive calls', () => {
    const calls = Array.from({ length: 10 }, () => randomDigits(8));
    const unique = new Set(calls);
    expect(unique.size).toBeGreaterThan(1);
  });
});
