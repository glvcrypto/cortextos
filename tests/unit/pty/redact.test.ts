import { describe, it, expect } from 'vitest';
import { redactSecrets } from '../../../src/pty/redact';

// Synthetic JWT used across tests. Three segments, each well above the
// {10,} minimum. Header begins with `eyJ` (standard base64url of `{"alg`).
const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiJ0ZXN0LXVzZXItaWQifQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('redactSecrets', () => {
  describe('no-op cases', () => {
    it('returns plain text unchanged', () => {
      expect(redactSecrets('Hello, world!')).toBe('Hello, world!');
    });

    it('returns empty string unchanged', () => {
      expect(redactSecrets('')).toBe('');
    });

    it('passes through ANSI escape sequences', () => {
      const ansi = '\x1b[32mGreen text\x1b[0m normal';
      expect(redactSecrets(ansi)).toBe(ansi);
    });

    it('does not match a.b.c — segments are too short', () => {
      expect(redactSecrets('a.b.c')).toBe('a.b.c');
    });

    it('does not match semver strings like v1.2.3', () => {
      expect(redactSecrets('v1.2.3')).toBe('v1.2.3');
    });

    it('does not match without the eyJ prefix', () => {
      const noPrefix = 'xxxhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefghijkl.abcdefghijkl';
      expect(redactSecrets(noPrefix)).toBe(noPrefix);
    });

    it('does not match two-segment token (missing third segment)', () => {
      const twoSegments =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefghijkl';
      expect(redactSecrets(twoSegments)).toBe(twoSegments);
    });

    it('does not match when middle segment is 9 chars (below {10,} minimum)', () => {
      const shortMiddle =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefghi.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      expect(redactSecrets(shortMiddle)).toBe(shortMiddle);
    });

    it('does not match when last segment is 9 chars (below {10,} minimum)', () => {
      const shortLast =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefghijkl.abcdefghi';
      expect(redactSecrets(shortLast)).toBe(shortLast);
    });
  });

  describe('redaction cases', () => {
    it('replaces a valid JWT with [REDACTED_JWT]', () => {
      expect(redactSecrets(FAKE_JWT)).toBe('[REDACTED_JWT]');
    });

    it('matches when each segment is exactly 10 chars (boundary inclusive)', () => {
      // Header: eyJ + 10 alphanums = 13 chars; middle + last = 10 each
      const minimal =
        'eyJabcdefghij.abcdefghij.abcdefghij';
      expect(redactSecrets(minimal)).toBe('[REDACTED_JWT]');
    });

    it('preserves surrounding text when JWT is embedded', () => {
      const line = `curl output: Cookie: authjs.session-token=${FAKE_JWT}; Path=/`;
      expect(redactSecrets(line)).toBe(
        'curl output: Cookie: authjs.session-token=[REDACTED_JWT]; Path=/',
      );
    });

    it('accepts base64url characters — underscore and hyphen', () => {
      const withSpecialChars =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X2lkLTEifQ.abc-defghij_klmnopqrstuvwx';
      expect(redactSecrets(withSpecialChars)).toBe('[REDACTED_JWT]');
    });

    it('redacts a realistic NextAuth session-token line', () => {
      // Origin of the feature: gitleaks found tokens in agent stdout.log
      const curl_v_line =
        `< Set-Cookie: authjs.session-token=${FAKE_JWT}; Path=/; HttpOnly; Secure`;
      expect(redactSecrets(curl_v_line)).toBe(
        '< Set-Cookie: authjs.session-token=[REDACTED_JWT]; Path=/; HttpOnly; Secure',
      );
    });
  });

  describe('multiple JWTs in a single string', () => {
    it('redacts all JWTs when multiple appear in one chunk', () => {
      const multi = `token1=${FAKE_JWT} token2=${FAKE_JWT}`;
      expect(redactSecrets(multi)).toBe('token1=[REDACTED_JWT] token2=[REDACTED_JWT]');
    });

    it('redacts two different JWTs independently', () => {
      const jwt2 =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.XYZabcdefghijklmnopqrstuvwx_ABCDEFGHIJ';
      const multi = `first=${FAKE_JWT}&second=${jwt2}`;
      expect(redactSecrets(multi)).toBe('first=[REDACTED_JWT]&second=[REDACTED_JWT]');
    });
  });

  describe('stateless / global regex safety', () => {
    it('returns correct result on consecutive calls (global flag does not leave stale lastIndex)', () => {
      // .replace() with a global regex resets lastIndex internally, but this
      // test locks that behavior in place as a regression guard.
      expect(redactSecrets(FAKE_JWT)).toBe('[REDACTED_JWT]');
      expect(redactSecrets(FAKE_JWT)).toBe('[REDACTED_JWT]');
      expect(redactSecrets('plain text')).toBe('plain text');
      expect(redactSecrets(FAKE_JWT)).toBe('[REDACTED_JWT]');
    });

    it('alternating calls between JWT and plain text stay correct', () => {
      for (let i = 0; i < 5; i++) {
        expect(redactSecrets(FAKE_JWT)).toBe('[REDACTED_JWT]');
        expect(redactSecrets('safe text')).toBe('safe text');
      }
    });
  });
});
