import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { logEvent } from '../../../src/bus/event';
import type { BusPaths } from '../../../src/types';

function makePaths(root: string): BusPaths {
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

describe('logEvent', () => {
  let testDir: string;
  let paths: BusPaths;
  const today = new Date().toISOString().split('T')[0];

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'ctx-event-test-'));
    paths = makePaths(testDir);
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('writes a valid JSONL line to the correct dated file', () => {
    logEvent(paths, 'boris', 'acme', 'heartbeat', 'agent_heartbeat', 'info');

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    expect(existsSync(file)).toBe(true);

    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    expect(line.agent).toBe('boris');
    expect(line.org).toBe('acme');
    expect(line.category).toBe('heartbeat');
    expect(line.event).toBe('agent_heartbeat');
    expect(line.severity).toBe('info');
    expect(line.metadata).toEqual({});
  });

  it('uses the agentName subdirectory under analyticsDir/events', () => {
    logEvent(paths, 'content-agent', 'glv', 'action', 'post_draft', 'info');

    const file = join(paths.analyticsDir, 'events', 'content-agent', `${today}.jsonl`);
    expect(existsSync(file)).toBe(true);
  });

  it('auto-creates the events directory if it does not exist', () => {
    expect(existsSync(join(paths.analyticsDir, 'events', 'new-agent'))).toBe(false);
    logEvent(paths, 'new-agent', 'org', 'metric', 'cpu_usage', 'info');
    expect(existsSync(join(paths.analyticsDir, 'events', 'new-agent', `${today}.jsonl`))).toBe(true);
  });

  it('stores object metadata correctly', () => {
    logEvent(paths, 'boris', 'acme', 'task', 'task_start', 'info', { task_id: 'T42', priority: 'high' });

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    expect(line.metadata).toEqual({ task_id: 'T42', priority: 'high' });
  });

  it('parses valid JSON string metadata', () => {
    logEvent(paths, 'boris', 'acme', 'error', 'crash', 'error', '{"code":500,"msg":"oops"}');

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    expect(line.metadata).toEqual({ code: 500, msg: 'oops' });
  });

  it('falls back to empty metadata for invalid JSON strings', () => {
    logEvent(paths, 'boris', 'acme', 'action', 'test', 'info', 'not-json');

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    expect(line.metadata).toEqual({});
  });

  it('appends multiple lines (JSONL format)', () => {
    logEvent(paths, 'boris', 'acme', 'heartbeat', 'ping', 'info');
    logEvent(paths, 'boris', 'acme', 'metric', 'latency', 'info', { ms: 120 });

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    const lines = readFileSync(file, 'utf-8').trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).event).toBe('ping');
    expect(JSON.parse(lines[1]).event).toBe('latency');
  });

  it('generates an event id in the format epoch-agentName-rand', () => {
    const before = Math.floor(Date.now() / 1000);
    logEvent(paths, 'boris', 'acme', 'heartbeat', 'ping', 'info');
    const after = Math.floor(Date.now() / 1000);

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    const [epoch, agentPart] = line.id.split('-');
    expect(parseInt(epoch)).toBeGreaterThanOrEqual(before);
    expect(parseInt(epoch)).toBeLessThanOrEqual(after);
    expect(agentPart).toBe('boris');
  });

  it('writes a timestamp without milliseconds (ISO, ends in Z)', () => {
    logEvent(paths, 'boris', 'acme', 'heartbeat', 'ping', 'info');

    const file = join(paths.analyticsDir, 'events', 'boris', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    expect(line.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it('throws on an invalid event category', () => {
    expect(() =>
      // @ts-expect-error intentionally invalid
      logEvent(paths, 'boris', 'acme', 'bad_category', 'test', 'info'),
    ).toThrow(/Invalid event category/);
  });

  it('throws on an invalid event severity', () => {
    expect(() =>
      // @ts-expect-error intentionally invalid
      logEvent(paths, 'boris', 'acme', 'heartbeat', 'test', 'loud'),
    ).toThrow(/Invalid.*severity/i);
  });

  it('stores all required fields on every event line', () => {
    logEvent(paths, 'agent-x', 'org-y', 'milestone', 'sprint_done', 'info');

    const file = join(paths.analyticsDir, 'events', 'agent-x', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(file, 'utf-8').trim());
    for (const field of ['id', 'agent', 'org', 'timestamp', 'category', 'event', 'severity', 'metadata']) {
      expect(line).toHaveProperty(field);
    }
  });
});
