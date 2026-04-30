import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { detectDayNightMode, updateHeartbeat, readAllHeartbeats } from '../../../src/bus/heartbeat';
import type { BusPaths } from '../../../src/types';

// ---- helpers ----------------------------------------------------------------

function mkPaths(root: string): BusPaths {
  return {
    ctxRoot: root,
    inbox: join(root, 'inbox'),
    inflight: join(root, 'inflight'),
    processed: join(root, 'processed'),
    logDir: join(root, 'logs'),
    stateDir: join(root, 'state'),
    taskDir: join(root, 'tasks'),
    approvalDir: join(root, 'approvals'),
    analyticsDir: join(root, 'analytics'),
    deliverablesDir: join(root, 'deliverables'),
  };
}

/** Set the system clock to a specific UTC hour (minute=30, stable non-DST date). */
function setUTCHour(h: number) {
  const d = new Date('2024-01-15T00:00:00Z'); // Jan, no DST in UTC
  d.setUTCHours(h, 30, 0, 0);
  vi.setSystemTime(d);
}

// ---- detectDayNightMode -----------------------------------------------------

describe('detectDayNightMode', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns day at 8:xx UTC (inclusive boundary start)', () => {
    setUTCHour(8);
    expect(detectDayNightMode('UTC')).toBe('day');
  });

  it('returns day at noon UTC', () => {
    setUTCHour(12);
    expect(detectDayNightMode('UTC')).toBe('day');
  });

  it('returns day at 21:xx UTC (last hour before cutoff)', () => {
    setUTCHour(21);
    expect(detectDayNightMode('UTC')).toBe('day');
  });

  it('returns night at 22:xx UTC (exclusive boundary end)', () => {
    setUTCHour(22);
    expect(detectDayNightMode('UTC')).toBe('night');
  });

  it('returns night at 7:xx UTC (before morning start)', () => {
    setUTCHour(7);
    expect(detectDayNightMode('UTC')).toBe('night');
  });

  it('returns night at midnight UTC', () => {
    setUTCHour(0);
    expect(detectDayNightMode('UTC')).toBe('night');
  });

  it('returns night at 23:xx UTC', () => {
    setUTCHour(23);
    expect(detectDayNightMode('UTC')).toBe('night');
  });

  it('falls back to UTC when timezone is invalid', () => {
    setUTCHour(12); // noon UTC → day in fallback path too
    expect(detectDayNightMode('Not/A/Timezone')).toBe('day');
  });

  it('always returns exactly "day" or "night" for every UTC hour', () => {
    for (let h = 0; h < 24; h++) {
      setUTCHour(h);
      expect(['day', 'night']).toContain(detectDayNightMode('UTC'));
    }
  });
});

// ---- updateHeartbeat --------------------------------------------------------

describe('updateHeartbeat', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'hb-test-'));
  });

  afterEach(() => {
    try { rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
  });

  it('writes heartbeat.json with required fields', () => {
    const paths = mkPaths(tmpDir);
    updateHeartbeat(paths, 'dev', 'healthy');

    const hb = JSON.parse(readFileSync(join(tmpDir, 'state', 'heartbeat.json'), 'utf-8'));
    expect(hb.agent).toBe('dev');
    expect(hb.status).toBe('healthy');
    expect(hb.last_heartbeat).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('writes optional fields when provided', () => {
    const paths = mkPaths(tmpDir);
    updateHeartbeat(paths, 'dev', 'working', {
      org: 'glv',
      displayName: 'Dev Agent',
      currentTask: 'Task #19',
      loopInterval: '4h',
      timezone: 'UTC',
    });

    const hb = JSON.parse(readFileSync(join(tmpDir, 'state', 'heartbeat.json'), 'utf-8'));
    expect(hb.org).toBe('glv');
    expect(hb.display_name).toBe('Dev Agent');
    expect(hb.current_task).toBe('Task #19');
    expect(hb.loop_interval).toBe('4h');
    expect(['day', 'night']).toContain(hb.mode);
  });

  it('overwrites an existing heartbeat.json on each call', () => {
    const paths = mkPaths(tmpDir);
    updateHeartbeat(paths, 'dev', 'healthy');
    updateHeartbeat(paths, 'dev', 'working');

    const hb = JSON.parse(readFileSync(join(tmpDir, 'state', 'heartbeat.json'), 'utf-8'));
    expect(hb.status).toBe('working');
  });

  it('creates the state directory if it does not exist', () => {
    const paths = mkPaths(tmpDir);
    // stateDir does not exist yet
    updateHeartbeat(paths, 'dev', 'healthy');

    const hb = JSON.parse(readFileSync(join(tmpDir, 'state', 'heartbeat.json'), 'utf-8'));
    expect(hb.agent).toBe('dev');
  });
});

// ---- readAllHeartbeats -------------------------------------------------------

describe('readAllHeartbeats', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'hb-read-test-'));
  });

  afterEach(() => {
    try { rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
  });

  it('returns empty array when state dir does not exist', () => {
    const paths = mkPaths(tmpDir);
    // stateDir never created — ctxRoot/state does not exist
    expect(readAllHeartbeats(paths)).toEqual([]);
  });

  it('returns empty array when state dir exists but has no agent subdirs', () => {
    const paths = mkPaths(tmpDir);
    mkdirSync(join(tmpDir, 'state'), { recursive: true });
    expect(readAllHeartbeats(paths)).toEqual([]);
  });

  it('returns one heartbeat for a single agent dir', () => {
    const paths = mkPaths(tmpDir);
    const agentDir = join(tmpDir, 'state', 'boss');
    mkdirSync(agentDir, { recursive: true });
    const hb = { agent: 'boss', status: 'healthy', last_heartbeat: '2024-01-15T12:00:00Z', mode: 'day', org: '', current_task: '', loop_interval: '' };
    writeFileSync(join(agentDir, 'heartbeat.json'), JSON.stringify(hb));

    const results = readAllHeartbeats(paths);
    expect(results).toHaveLength(1);
    expect(results[0].agent).toBe('boss');
    expect(results[0].status).toBe('healthy');
  });

  it('returns heartbeats for multiple agents', () => {
    const paths = mkPaths(tmpDir);
    for (const name of ['boss', 'dev', 'analyst']) {
      const agentDir = join(tmpDir, 'state', name);
      mkdirSync(agentDir, { recursive: true });
      const hb = { agent: name, status: 'healthy', last_heartbeat: '2024-01-15T12:00:00Z', mode: 'day', org: '', current_task: '', loop_interval: '' };
      writeFileSync(join(agentDir, 'heartbeat.json'), JSON.stringify(hb));
    }

    const results = readAllHeartbeats(paths);
    expect(results).toHaveLength(3);
    expect(results.map(r => r.agent).sort()).toEqual(['analyst', 'boss', 'dev']);
  });

  it('silently skips agent dirs that have no heartbeat.json', () => {
    const paths = mkPaths(tmpDir);
    // Agent with heartbeat
    const withHb = join(tmpDir, 'state', 'dev');
    mkdirSync(withHb, { recursive: true });
    writeFileSync(join(withHb, 'heartbeat.json'), JSON.stringify({ agent: 'dev', status: 'healthy', last_heartbeat: '', mode: 'day', org: '', current_task: '', loop_interval: '' }));

    // Agent dir without heartbeat.json
    mkdirSync(join(tmpDir, 'state', 'orphan'), { recursive: true });

    const results = readAllHeartbeats(paths);
    expect(results).toHaveLength(1);
    expect(results[0].agent).toBe('dev');
  });

  it('silently skips dirs with malformed JSON', () => {
    const paths = mkPaths(tmpDir);
    const agentDir = join(tmpDir, 'state', 'broken');
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(agentDir, 'heartbeat.json'), 'not-valid-json');

    expect(readAllHeartbeats(paths)).toEqual([]);
  });
});
