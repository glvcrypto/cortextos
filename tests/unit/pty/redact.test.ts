import { describe, it, expect } from 'vitest';
import { redactSecrets } from '../../../src/pty/redact';

// Representative JWT — three base64url segments, eyJ header
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QiLCJpYXQiOjE1MTYyMzkwMjJ9' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Short segments that should NOT match (< 10 chars each beyond eyJ)
const SHORT_DOTTED = 'v1.2.3';
const FAKE_JWT_SHORT = 'eyJ123.abc.def'; // segments too short

describe('redactSecrets — JWT detection', () => {
  it('redacts a standard JWT', () => {
    expect(redactSecrets(SAMPLE_JWT)).toBe('[REDACTED_JWT]');
  });

  it('redacts JWT embedded in a longer string', () => {
    const input = `Authorization: Bearer ${SAMPLE_JWT} extra`;
    expect(redactSecrets(input)).toBe('Authorization: Bearer [REDACTED_JWT] extra');
  });

  it('redacts multiple JWTs in one string', () => {
    const input = `token1=${SAMPLE_JWT} token2=${SAMPLE_JWT}`;
    const result = redactSecrets(input);
    expect(result).toBe('token1=[REDACTED_JWT] token2=[REDACTED_JWT]');
  });

  it('replaces JWT but preserves surrounding text', () => {
    const input = `prefix ${SAMPLE_JWT} suffix`;
    expect(redactSecrets(input)).toBe('prefix [REDACTED_JWT] suffix');
  });
});

describe('redactSecrets — non-JWT passthrough', () => {
  it('passes through plain text unchanged', () => {
    expect(redactSecrets('hello world')).toBe('hello world');
  });

  it('passes through empty string', () => {
    expect(redactSecrets('')).toBe('');
  });

  it('passes through version strings (v1.2.3)', () => {
    expect(redactSecrets(SHORT_DOTTED)).toBe(SHORT_DOTTED);
  });

  it('passes through short dotted sequences that are not JWTs', () => {
    expect(redactSecrets(FAKE_JWT_SHORT)).toBe(FAKE_JWT_SHORT);
  });

  it('passes through ANSI escape sequences unchanged', () => {
    const ansi = '[32mGreen text[0m';
    expect(redactSecrets(ansi)).toBe(ansi);
  });

  it('passes through base64 without eyJ prefix', () => {
    // Looks like a JWT structure but lacks eyJ prefix
    const notJwt = 'aGVsbG8.d29ybGQ.dGVzdA';
    expect(redactSecrets(notJwt)).toBe(notJwt);
  });

  it('passes through JSON objects (no false positives)', () => {
    const json = '{"agent":"dev","status":"online"}';
    expect(redactSecrets(json)).toBe(json);
  });
});

describe('redactSecrets — edge cases', () => {
  it('handles multiline input', () => {
    const input = `line1\nAuthorization: ${SAMPLE_JWT}\nline3`;
    const result = redactSecrets(input);
    expect(result).toContain('[REDACTED_JWT]');
    expect(result).toContain('line1');
    expect(result).toContain('line3');
    expect(result).not.toContain(SAMPLE_JWT);
  });

  it('does not mutate the original string (returns new string)', () => {
    const original = `token: ${SAMPLE_JWT}`;
    const copy = original;
    redactSecrets(original);
    // strings are immutable in JS, but verify return value differs
    expect(redactSecrets(original)).not.toBe(original);
    expect(original).toBe(copy);
  });

  // Chunk-boundary documented limitation: if a JWT spans two OS PTY chunks,
  // neither chunk alone matches the regex and the token slips through.
  // This test locks in the documented behavior so any future buffer-aware
  // fix has to be explicit.
  it('chunk-boundary regression guard — partial JWT does not match', () => {
    const half1 = SAMPLE_JWT.slice(0, 30);
    const half2 = SAMPLE_JWT.slice(30);
    // Neither half alone is a full JWT
    expect(redactSecrets(half1)).toBe(half1);
    expect(redactSecrets(half2)).toBe(half2);
  });
});
