import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { logEvent } from '../../../src/bus/event';
import type { BusPaths, Heartbeat } from '../../../src/types';

// ---------------------------------------------------------------------------
// logEvent — core behavior
// ---------------------------------------------------------------------------

let testDir: string;

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

beforeEach(() => {
  testDir = mkdtempSync(join(tmpdir(), 'cortextos-event-test-'));
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

function readTodayEvents(root: string, agent: string): string[] {
  const today = new Date().toISOString().split('T')[0];
  const eventFile = join(root, 'analytics', 'events', agent, `${today}.jsonl`);
  return readFileSync(eventFile, 'utf-8').trim().split('\n');
}

describe('logEvent', () => {
  it('creates date-keyed event file and writes a valid JSONL line', () => {
    const paths = mkPaths(testDir);
    logEvent(paths, 'test-agent', 'glv', 'heartbeat', 'agent_heartbeat', 'info');

    const today = new Date().toISOString().split('T')[0];
    const eventFile = join(testDir, 'analytics', 'events', 'test-agent', `${today}.jsonl`);
    expect(existsSync(eventFile)).toBe(true);

    const line = JSON.parse(readFileSync(eventFile, 'utf-8').trim());
    expect(line.agent).toBe('test-agent');
    expect(line.org).toBe('glv');
    expect(line.category).toBe('heartbeat');
    expect(line.event).toBe('agent_heartbeat');
    expect(line.severity).toBe('info');
    expect(typeof line.timestamp).toBe('string');
  });

  it('event id has format {epoch}-{agentName}-{rand5}', () => {
    const paths = mkPaths(testDir);
    const before = Math.floor(Date.now() / 1000);
    logEvent(paths, 'my-agent', 'glv', 'action', 'do_thing', 'info');
    const after = Math.floor(Date.now() / 1000);

    const line = JSON.parse(readTodayEvents(testDir, 'my-agent')[0]);
    expect(line.id).toMatch(/^\d+-my-agent-[a-z0-9]{5}$/);

    const epoch = parseInt(line.id.split('-')[0], 10);
    expect(epoch).toBeGreaterThanOrEqual(before);
    expect(epoch).toBeLessThanOrEqual(after);
  });

  it('stores object metadata in the event', () => {
    const paths = mkPaths(testDir);
    logEvent(paths, 'test-agent', 'glv', 'metric', 'collect', 'info', { count: 5, key: 'val' });

    const line = JSON.parse(readTodayEvents(testDir, 'test-agent')[0]);
    expect(line.metadata).toEqual({ count: 5, key: 'val' });
  });

  it('parses string metadata when it is valid JSON', () => {
    const paths = mkPaths(testDir);
    logEvent(paths, 'test-agent', 'glv', 'action', 'test', 'info', '{"source":"cli","count":3}');

    const line = JSON.parse(readTodayEvents(testDir, 'test-agent')[0]);
    expect(line.metadata).toEqual({ source: 'cli', count: 3 });
  });

  it('stores empty metadata when string is not valid JSON', () => {
    const paths = mkPaths(testDir);
    logEvent(paths, 'test-agent', 'glv', 'action', 'test', 'info', 'not-valid-json');

    const line = JSON.parse(readTodayEvents(testDir, 'test-agent')[0]);
    expect(line.metadata).toEqual({});
  });

  it('stores empty metadata when metadata is undefined', () => {
    const paths = mkPaths(testDir);
    logEvent(paths, 'test-agent', 'glv', 'action', 'test', 'info');

    const line = JSON.parse(readTodayEvents(testDir, 'test-agent')[0]);
    expect(line.metadata).toEqual({});
  });

  it('appends each call as a separate JSONL line', () => {
    const paths = mkPaths(testDir);
    logEvent(paths, 'test-agent', 'glv', 'heartbeat', 'first', 'info');
    logEvent(paths, 'test-agent', 'glv', 'heartbeat', 'second', 'warning');

    const lines = readTodayEvents(testDir, 'test-agent');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).event).toBe('first');
    expect(JSON.parse(lines[1]).event).toBe('second');
  });

  it('throws on invalid category', () => {
    const paths = mkPaths(testDir);
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logEvent(paths, 'test-agent', 'glv', 'invalid_cat' as any, 'test', 'info'),
    ).toThrow(/Invalid event category/);
  });

  it('throws on invalid severity', () => {
    const paths = mkPaths(testDir);
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      logEvent(paths, 'test-agent', 'glv', 'action', 'test', 'debug' as any),
    ).toThrow(/Invalid severity/);
  });
});

// ---------------------------------------------------------------------------
// Bus events — heartbeat-refresh side-effect on logEvent
// Data point: 76.4% of fleet activity events landed while the agent's
// heartbeat was >5min stale — every event implies the agent is alive,
// so the stale-monitor should never fire on an actively logging agent.
// ---------------------------------------------------------------------------

describe('Bus events', () => {
  let busTestDir: string;
  let paths: BusPaths;

  beforeEach(() => {
    busTestDir = mkdtempSync(join(tmpdir(), 'cortextos-event-test-'));
    paths = {
      ctxRoot: busTestDir,
      inbox: join(busTestDir, 'inbox', 'spark'),
      inflight: join(busTestDir, 'inflight', 'spark'),
      processed: join(busTestDir, 'processed', 'spark'),
      logDir: join(busTestDir, 'logs', 'spark'),
      stateDir: join(busTestDir, 'state', 'spark'),
      taskDir: join(busTestDir, 'tasks'),
      approvalDir: join(busTestDir, 'approvals'),
      analyticsDir: join(busTestDir, 'analytics'),
      heartbeatDir: join(busTestDir, 'heartbeats'),
    };
    mkdirSync(paths.stateDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(busTestDir, { recursive: true, force: true });
  });

  it('logEvent appends a JSONL entry to the daily events file', () => {
    logEvent(paths, 'spark', 'eros-os', 'action', 'test_event', 'info', { foo: 'bar' });

    const today = new Date().toISOString().split('T')[0];
    const eventFile = join(paths.analyticsDir, 'events', 'spark', `${today}.jsonl`);
    expect(existsSync(eventFile)).toBe(true);

    const entries = readFileSync(eventFile, 'utf-8').trim().split('\n').map((l) => JSON.parse(l));
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      agent: 'spark',
      org: 'eros-os',
      category: 'action',
      event: 'test_event',
      severity: 'info',
      metadata: { foo: 'bar' },
    });
  });

  describe('heartbeat refresh side-effect', () => {
    it('bumps last_heartbeat on an existing heartbeat.json without overwriting other fields', async () => {
      const oldHeartbeat: Heartbeat = {
        agent: 'spark',
        org: 'eros-os',
        status: 'online',
        current_task: 'fix/log-event-refreshes-heartbeat',
        mode: 'day',
        last_heartbeat: '2026-04-23T12:00:00Z',
        loop_interval: '4h',
      };
      writeFileSync(join(paths.stateDir, 'heartbeat.json'), JSON.stringify(oldHeartbeat));

      // Let one millisecond tick so the new timestamp is strictly newer.
      await new Promise((resolve) => setTimeout(resolve, 2));
      logEvent(paths, 'spark', 'eros-os', 'action', 'activity_tick', 'info');

      const refreshed = JSON.parse(
        readFileSync(join(paths.stateDir, 'heartbeat.json'), 'utf-8'),
      ) as Heartbeat;

      // Timestamp bumped…
      expect(new Date(refreshed.last_heartbeat).getTime()).toBeGreaterThan(
        new Date(oldHeartbeat.last_heartbeat).getTime(),
      );
      // …other fields preserved intact.
      expect(refreshed.status).toBe('online');
      expect(refreshed.current_task).toBe('fix/log-event-refreshes-heartbeat');
      expect(refreshed.mode).toBe('day');
      expect(refreshed.loop_interval).toBe('4h');
      expect(refreshed.agent).toBe('spark');
      expect(refreshed.org).toBe('eros-os');
    });

    it('is a no-op when no heartbeat.json exists yet', () => {
      // Fresh agent — no heartbeat file written yet.
      expect(existsSync(join(paths.stateDir, 'heartbeat.json'))).toBe(false);

      logEvent(paths, 'spark', 'eros-os', 'action', 'first_boot', 'info');

      // Still no heartbeat file — refresh is a no-op when nothing exists.
      expect(existsSync(join(paths.stateDir, 'heartbeat.json'))).toBe(false);

      // But the event itself was written.
      const today = new Date().toISOString().split('T')[0];
      const eventFile = join(paths.analyticsDir, 'events', 'spark', `${today}.jsonl`);
      expect(existsSync(eventFile)).toBe(true);
    });

    it('never blocks event persistence when the heartbeat refresh fails', () => {
      // Write a corrupt heartbeat.json to exercise the error path.
      writeFileSync(join(paths.stateDir, 'heartbeat.json'), '{not valid json');

      // Must not throw.
      expect(() =>
        logEvent(paths, 'spark', 'eros-os', 'action', 'after_corrupt_hb', 'info'),
      ).not.toThrow();

      // Event still written.
      const today = new Date().toISOString().split('T')[0];
      const eventFile = join(paths.analyticsDir, 'events', 'spark', `${today}.jsonl`);
      const entries = readFileSync(eventFile, 'utf-8').trim().split('\n');
      expect(entries).toHaveLength(1);
    });
  });
});
