import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { updateHeartbeat, detectDayNightMode, readAllHeartbeats } from '../../../src/bus/heartbeat';
import type { BusPaths } from '../../../src/types';

describe('Heartbeat', () => {
  let testDir: string;
  let paths: BusPaths;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-hb-test-'));
    paths = {
      ctxRoot: testDir,
      inbox: join(testDir, 'inbox'),
      inflight: join(testDir, 'inflight'),
      processed: join(testDir, 'processed'),
      logDir: join(testDir, 'logs'),
      stateDir: join(testDir, 'state', 'dev'),
      taskDir: join(testDir, 'tasks'),
      approvalDir: join(testDir, 'approvals'),
      analyticsDir: join(testDir, 'analytics'),
      deliverablesDir: join(testDir, 'deliverables'),
    };
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
    vi.useRealTimers();
  });

  describe('updateHeartbeat', () => {
    it('writes heartbeat.json to stateDir', () => {
      updateHeartbeat(paths, 'dev', 'online');
      const hb = JSON.parse(readFileSync(join(paths.stateDir, 'heartbeat.json'), 'utf-8'));
      expect(hb).toHaveProperty('agent', 'dev');
      expect(hb).toHaveProperty('status', 'online');
      expect(hb).toHaveProperty('last_heartbeat');
    });

    it('sets optional fields when provided', () => {
      updateHeartbeat(paths, 'dev', 'working', {
        org: 'glv',
        displayName: 'Dev Agent',
        currentTask: 'build-feature',
        loopInterval: '5m',
      });
      const hb = JSON.parse(readFileSync(join(paths.stateDir, 'heartbeat.json'), 'utf-8'));
      expect(hb.org).toBe('glv');
      expect(hb.display_name).toBe('Dev Agent');
      expect(hb.current_task).toBe('build-feature');
      expect(hb.loop_interval).toBe('5m');
    });

    it('omits display_name when not provided', () => {
      updateHeartbeat(paths, 'dev', 'online');
      const hb = JSON.parse(readFileSync(join(paths.stateDir, 'heartbeat.json'), 'utf-8'));
      expect(hb).not.toHaveProperty('display_name');
    });

    it('includes mode field', () => {
      updateHeartbeat(paths, 'dev', 'online');
      const hb = JSON.parse(readFileSync(join(paths.stateDir, 'heartbeat.json'), 'utf-8'));
      expect(['day', 'night']).toContain(hb.mode);
    });

    it('overwrites an existing heartbeat file on repeat calls', () => {
      updateHeartbeat(paths, 'dev', 'online');
      updateHeartbeat(paths, 'dev', 'offline');
      const hb = JSON.parse(readFileSync(join(paths.stateDir, 'heartbeat.json'), 'utf-8'));
      expect(hb.status).toBe('offline');
    });
  });

  describe('detectDayNightMode', () => {
    it('returns "day" at noon UTC', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-29T12:00:00Z'));
      expect(detectDayNightMode('UTC')).toBe('day');
    });

    it('returns "night" at 2am UTC', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-29T02:00:00Z'));
      expect(detectDayNightMode('UTC')).toBe('night');
    });

    it('returns "day" at exactly 08:00 UTC (inclusive lower bound)', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-29T08:00:00Z'));
      expect(detectDayNightMode('UTC')).toBe('day');
    });

    it('returns "night" at exactly 22:00 UTC (exclusive upper bound)', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-29T22:00:00Z'));
      expect(detectDayNightMode('UTC')).toBe('night');
    });

    it('returns "day" or "night" without throwing for an invalid timezone', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-29T12:00:00Z'));
      expect(() => detectDayNightMode('Invalid/Timezone')).not.toThrow();
      expect(['day', 'night']).toContain(detectDayNightMode('Invalid/Timezone'));
    });
  });

  describe('readAllHeartbeats', () => {
    it('returns empty array when state directory does not exist', () => {
      expect(readAllHeartbeats(paths)).toEqual([]);
    });

    it('reads heartbeats from all agent subdirectories', () => {
      for (const agent of ['alpha', 'beta']) {
        const dir = join(testDir, 'state', agent);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'heartbeat.json'), JSON.stringify({ agent, status: 'online' }));
      }
      const result = readAllHeartbeats(paths);
      expect(result).toHaveLength(2);
      expect(result.map(h => h.agent).sort()).toEqual(['alpha', 'beta']);
    });

    it('skips agent subdirectory that has no heartbeat.json', () => {
      mkdirSync(join(testDir, 'state', 'no-hb'), { recursive: true });
      expect(readAllHeartbeats(paths)).toEqual([]);
    });

    it('skips agent heartbeat.json with malformed JSON', () => {
      const dir = join(testDir, 'state', 'broken');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'heartbeat.json'), '{not valid json');
      expect(readAllHeartbeats(paths)).toEqual([]);
    });

    it('returns only healthy heartbeats when mixed with broken ones', () => {
      const goodDir = join(testDir, 'state', 'good');
      mkdirSync(goodDir, { recursive: true });
      writeFileSync(join(goodDir, 'heartbeat.json'), JSON.stringify({ agent: 'good', status: 'online' }));

      const badDir = join(testDir, 'state', 'bad');
      mkdirSync(badDir, { recursive: true });
      writeFileSync(join(badDir, 'heartbeat.json'), 'garbage');

      const result = readAllHeartbeats(paths);
      expect(result).toHaveLength(1);
      expect(result[0].agent).toBe('good');
    });
  });
});
