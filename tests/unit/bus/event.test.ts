import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { logEvent } from '../../../src/bus/event';
import type { BusPaths } from '../../../src/types/index';

let tmpDir: string;
let paths: BusPaths;

function makePaths(root: string): BusPaths {
  return {
    ctxRoot: root,
    inbox: join(root, 'inbox', 'dev'),
    inflight: join(root, 'inflight', 'dev'),
    processed: join(root, 'processed', 'dev'),
    logDir: join(root, 'logs', 'dev'),
    stateDir: join(root, 'state', 'dev'),
    taskDir: join(root, 'orgs', 'glv', 'tasks'),
    approvalDir: join(root, 'orgs', 'glv', 'approvals'),
    analyticsDir: join(root, 'orgs', 'glv', 'analytics'),
    deliverablesDir: join(root, 'orgs', 'glv', 'deliverables'),
  };
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'ctx-event-test-'));
  paths = makePaths(tmpDir);
});

afterEach(() => {
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
});

function readTodayEvents(): object[] {
  const today = new Date().toISOString().split('T')[0];
  const eventsDir = join(tmpDir, 'orgs', 'glv', 'analytics', 'events', 'dev');
  const file = join(eventsDir, `${today}.jsonl`);
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

// ---------------------------------------------------------------------------
// logEvent — file creation + JSONL format
// ---------------------------------------------------------------------------

describe('logEvent — file creation', () => {
  it('creates the events JSONL file on first call', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test_event', 'info');
    const events = readTodayEvents();
    expect(events.length).toBeGreaterThanOrEqual(1);
  });

  it('appends multiple events to the same daily file', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'event_1', 'info');
    logEvent(paths, 'dev', 'glv', 'action', 'event_2', 'info');
    logEvent(paths, 'dev', 'glv', 'heartbeat', 'agent_heartbeat', 'info');
    const events = readTodayEvents();
    expect(events.length).toBeGreaterThanOrEqual(3);
  });
});

describe('logEvent — event structure', () => {
  it('written event has required fields', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'session_start', 'info');
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    expect(ev).toHaveProperty('id');
    expect(ev).toHaveProperty('agent', 'dev');
    expect(ev).toHaveProperty('org', 'glv');
    expect(ev).toHaveProperty('timestamp');
    expect(ev).toHaveProperty('category', 'action');
    expect(ev).toHaveProperty('event', 'session_start');
    expect(ev).toHaveProperty('severity', 'info');
    expect(ev).toHaveProperty('metadata');
  });

  it('id contains agentName', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info');
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    expect(String(ev.id)).toContain('dev');
  });

  it('timestamp is ISO format', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info');
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    expect(String(ev.timestamp)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });
});

// ---------------------------------------------------------------------------
// logEvent — metadata handling
// ---------------------------------------------------------------------------

describe('logEvent — metadata', () => {
  it('accepts object metadata and writes it', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info', { task_id: 'abc', agent: 'dev' });
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    const meta = ev.metadata as Record<string, unknown>;
    expect(meta.task_id).toBe('abc');
    expect(meta.agent).toBe('dev');
  });

  it('accepts JSON string metadata and parses it', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info', '{"key":"value"}');
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    const meta = ev.metadata as Record<string, unknown>;
    expect(meta.key).toBe('value');
  });

  it('treats invalid JSON string metadata as empty object', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info', 'not-json');
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    expect(ev.metadata).toEqual({});
  });

  it('uses empty object when no metadata provided', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info');
    const events = readTodayEvents();
    const ev = events[events.length - 1] as Record<string, unknown>;
    expect(ev.metadata).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// logEvent — validation
// ---------------------------------------------------------------------------

describe('logEvent — category validation', () => {
  it('accepts valid categories', () => {
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'info')).not.toThrow();
    expect(() => logEvent(paths, 'dev', 'glv', 'heartbeat', 'ev', 'info')).not.toThrow();
    expect(() => logEvent(paths, 'dev', 'glv', 'task', 'ev', 'info')).not.toThrow();
  });

  it('rejects invalid category', () => {
    expect(() => logEvent(paths, 'dev', 'glv', 'bad_cat' as never, 'ev', 'info')).toThrow();
  });
});

describe('logEvent — severity validation', () => {
  it('accepts valid severities', () => {
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'info')).not.toThrow();
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'warning')).not.toThrow();
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'error')).not.toThrow();
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'critical')).not.toThrow();
  });

  it('rejects invalid severity', () => {
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'warn' as never)).toThrow();
    expect(() => logEvent(paths, 'dev', 'glv', 'action', 'ev', 'debug' as never)).toThrow();
  });
});

describe('logEvent — path isolation', () => {
  it('events for different agents go to different dirs', () => {
    const paths2 = makePaths(tmpDir);
    paths2.analyticsDir = join(tmpDir, 'orgs', 'glv', 'analytics');
    logEvent(paths, 'dev', 'glv', 'action', 'ev1', 'info');
    logEvent(paths2, 'seo', 'glv', 'action', 'ev2', 'info');

    const today = new Date().toISOString().split('T')[0];
    const devFile = join(tmpDir, 'orgs', 'glv', 'analytics', 'events', 'dev', `${today}.jsonl`);
    const seoFile = join(tmpDir, 'orgs', 'glv', 'analytics', 'events', 'seo', `${today}.jsonl`);
    expect(existsSync(devFile)).toBe(true);
    expect(existsSync(seoFile)).toBe(true);
  });
});
