import { describe, it, expect } from 'vitest';
import { formatUptime, formatHeartbeatAge } from '../../../src/cli/status';

describe('formatUptime', () => {
  describe('seconds tier (< 60s)', () => {
    it('returns "0s" for 0 seconds', () => {
      expect(formatUptime(0)).toBe('0s');
    });
    it('returns "1s" for 1 second', () => {
      expect(formatUptime(1)).toBe('1s');
    });
    it('returns "59s" for 59 seconds (boundary below 1m)', () => {
      expect(formatUptime(59)).toBe('59s');
    });
  });

  describe('minutes tier (60s–3599s)', () => {
    it('returns "1m" for exactly 60 seconds (lower boundary)', () => {
      expect(formatUptime(60)).toBe('1m');
    });
    it('returns "1m" for 61 seconds (floor)', () => {
      expect(formatUptime(61)).toBe('1m');
    });
    it('returns "1m" for 90 seconds (1.5m floors to 1m)', () => {
      expect(formatUptime(90)).toBe('1m');
    });
    it('returns "1m" for 119 seconds (just below 2m)', () => {
      expect(formatUptime(119)).toBe('1m');
    });
    it('returns "2m" for exactly 120 seconds', () => {
      expect(formatUptime(120)).toBe('2m');
    });
    it('returns "59m" for 3599 seconds (boundary below 1h)', () => {
      expect(formatUptime(3599)).toBe('59m');
    });
  });

  describe('hours tier (3600s–86399s)', () => {
    it('returns "1h 0m" for exactly 3600 seconds (lower boundary)', () => {
      expect(formatUptime(3600)).toBe('1h 0m');
    });
    it('returns "1h 0m" for 3601 seconds (no extra minute yet)', () => {
      expect(formatUptime(3601)).toBe('1h 0m');
    });
    it('returns "1h 1m" for 3660 seconds (1h + 1m)', () => {
      expect(formatUptime(3660)).toBe('1h 1m');
    });
    it('returns "1h 30m" for 5400 seconds (90 minutes)', () => {
      expect(formatUptime(5400)).toBe('1h 30m');
    });
    it('returns "1h 59m" for 7199 seconds', () => {
      expect(formatUptime(7199)).toBe('1h 59m');
    });
    it('returns "23h 59m" for 86399 seconds (boundary below 24h)', () => {
      expect(formatUptime(86399)).toBe('23h 59m');
    });
  });

  describe('days tier (>= 86400s)', () => {
    it('returns "1d 0h" for exactly 86400 seconds (24h)', () => {
      expect(formatUptime(86400)).toBe('1d 0h');
    });
    it('returns "1d 1h" for 90000 seconds (25h)', () => {
      expect(formatUptime(90000)).toBe('1d 1h');
    });
    it('returns "2d 2h" for 180000 seconds (50h)', () => {
      expect(formatUptime(180000)).toBe('2d 2h');
    });
  });
});

describe('formatHeartbeatAge', () => {
  describe('seconds tier (< 60s)', () => {
    it('returns "0s ago" for 0 seconds', () => {
      expect(formatHeartbeatAge(0)).toBe('0s ago');
    });
    it('returns "1s ago" for 1 second', () => {
      expect(formatHeartbeatAge(1)).toBe('1s ago');
    });
    it('returns "59s ago" for 59 seconds (boundary below 1m)', () => {
      expect(formatHeartbeatAge(59)).toBe('59s ago');
    });
  });

  describe('minutes tier (60s–3599s)', () => {
    it('returns "1m ago" for exactly 60 seconds', () => {
      expect(formatHeartbeatAge(60)).toBe('1m ago');
    });
    it('returns "1m ago" for 61 seconds (floor)', () => {
      expect(formatHeartbeatAge(61)).toBe('1m ago');
    });
    it('returns "1m ago" for 119 seconds (just below 2m)', () => {
      expect(formatHeartbeatAge(119)).toBe('1m ago');
    });
    it('returns "2m ago" for exactly 120 seconds', () => {
      expect(formatHeartbeatAge(120)).toBe('2m ago');
    });
    it('returns "59m ago" for 3599 seconds (boundary below 1h)', () => {
      expect(formatHeartbeatAge(3599)).toBe('59m ago');
    });
  });

  describe('hours tier (>= 3600s)', () => {
    it('returns "1h ago" for exactly 3600 seconds', () => {
      expect(formatHeartbeatAge(3600)).toBe('1h ago');
    });
    it('returns "1h ago" for 3601 seconds (floor, no partial hour shown)', () => {
      expect(formatHeartbeatAge(3601)).toBe('1h ago');
    });
    it('returns "2h ago" for 7200 seconds', () => {
      expect(formatHeartbeatAge(7200)).toBe('2h ago');
    });
    it('returns "5h ago" for 18000 seconds', () => {
      expect(formatHeartbeatAge(18000)).toBe('5h ago');
    });
  });
});
