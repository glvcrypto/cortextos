import { describe, it, expect } from 'vitest';
import { isAgentHealthy, computeHealth, getHealthStatus } from '../heartbeats';
import type { Heartbeat } from '@/lib/types';

// Helpers — build a minimal Heartbeat with a last_heartbeat offset from now
function hb(minutesAgo: number | null): Heartbeat {
  return {
    agent: 'test-agent',
    org: 'glv',
    status: 'active',
    last_heartbeat: minutesAgo === null
      ? undefined
      : new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// isAgentHealthy
// ---------------------------------------------------------------------------

describe('isAgentHealthy', () => {
  it('returns false when last_heartbeat is missing', () => {
    expect(isAgentHealthy(hb(null))).toBe(false);
  });

  it('returns true for a heartbeat from 1 minute ago', () => {
    expect(isAgentHealthy(hb(1))).toBe(true);
  });

  it('returns true at exactly the default threshold (300 min)', () => {
    expect(isAgentHealthy(hb(300))).toBe(true);
  });

  it('returns false just past the default threshold (301 min)', () => {
    expect(isAgentHealthy(hb(301))).toBe(false);
  });

  it('respects a custom threshold — healthy within custom window', () => {
    expect(isAgentHealthy(hb(60), 120)).toBe(true);
  });

  it('respects a custom threshold — stale outside custom window', () => {
    expect(isAgentHealthy(hb(121), 120)).toBe(false);
  });

  it('returns false for a very old heartbeat (days ago)', () => {
    expect(isAgentHealthy(hb(10000))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// computeHealth
// ---------------------------------------------------------------------------

describe('computeHealth', () => {
  it('returns "healthy" for a recent heartbeat', () => {
    expect(computeHealth(hb(10))).toBe('healthy');
  });

  it('returns "stale" when heartbeat is past the default threshold', () => {
    expect(computeHealth(hb(600))).toBe('stale');
  });

  it('returns "stale" when last_heartbeat is missing (delegates to isAgentHealthy)', () => {
    expect(computeHealth(hb(null))).toBe('stale');
  });

  it('uses custom threshold when supplied', () => {
    // 90 min ago, custom threshold 60 min → stale
    expect(computeHealth(hb(90), 60)).toBe('stale');
    // 30 min ago, custom threshold 60 min → healthy
    expect(computeHealth(hb(30), 60)).toBe('healthy');
  });
});

// ---------------------------------------------------------------------------
// getHealthStatus
// ---------------------------------------------------------------------------

describe('getHealthStatus', () => {
  it('returns "down" when last_heartbeat is missing', () => {
    expect(getHealthStatus(hb(null))).toBe('down');
  });

  it('returns "healthy" for a heartbeat from 1 minute ago', () => {
    expect(getHealthStatus(hb(1))).toBe('healthy');
  });

  it('returns "healthy" at exactly the STALE boundary (300 min)', () => {
    expect(getHealthStatus(hb(300))).toBe('healthy');
  });

  it('returns "stale" just past the STALE boundary (301 min)', () => {
    expect(getHealthStatus(hb(301))).toBe('stale');
  });

  it('returns "stale" at exactly the DOWN boundary (1440 min)', () => {
    expect(getHealthStatus(hb(1440))).toBe('stale');
  });

  it('returns "down" just past the DOWN boundary (1441 min)', () => {
    expect(getHealthStatus(hb(1441))).toBe('down');
  });

  it('returns "down" for a very old heartbeat', () => {
    expect(getHealthStatus(hb(10000))).toBe('down');
  });
});
