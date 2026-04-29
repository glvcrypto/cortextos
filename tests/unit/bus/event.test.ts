import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { logEvent } from '../../../src/bus/event';
import type { BusPaths } from '../../../src/types';

describe('logEvent', () => {
  let testDir: string;
  let paths: BusPaths;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-event-test-'));
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
  });

  it('creates a JSONL file at the correct analytics path', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test_event', 'info');
    const today = new Date().toISOString().split('T')[0];
    const eventsDir = join(testDir, 'analytics', 'events', 'dev');
    const files = readdirSync(eventsDir);
    expect(files).toContain(`${today}.jsonl`);
  });

  it('writes a valid JSON line with all required fields', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'session_start', 'info');
    const today = new Date().toISOString().split('T')[0];
    const filePath = join(testDir, 'analytics', 'events', 'dev', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(filePath, 'utf-8').trim());
    expect(line).toHaveProperty('id');
    expect(line).toHaveProperty('agent', 'dev');
    expect(line).toHaveProperty('org', 'glv');
    expect(line).toHaveProperty('category', 'action');
    expect(line).toHaveProperty('event', 'session_start');
    expect(line).toHaveProperty('severity', 'info');
    expect(line).toHaveProperty('timestamp');
    expect(line).toHaveProperty('metadata');
  });

  it('parses metadata string as JSON object', () => {
    logEvent(paths, 'dev', 'glv', 'task', 'task_completed', 'info', '{"task_id":"abc123"}');
    const today = new Date().toISOString().split('T')[0];
    const filePath = join(testDir, 'analytics', 'events', 'dev', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(filePath, 'utf-8').trim());
    expect(line.metadata).toEqual({ task_id: 'abc123' });
  });

  it('passes metadata object through unchanged', () => {
    logEvent(paths, 'dev', 'glv', 'task', 'task_completed', 'info', { task_id: 'abc123', count: 5 });
    const today = new Date().toISOString().split('T')[0];
    const filePath = join(testDir, 'analytics', 'events', 'dev', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(filePath, 'utf-8').trim());
    expect(line.metadata).toEqual({ task_id: 'abc123', count: 5 });
  });

  it('uses empty metadata when no metadata argument provided', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info');
    const today = new Date().toISOString().split('T')[0];
    const filePath = join(testDir, 'analytics', 'events', 'dev', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(filePath, 'utf-8').trim());
    expect(line.metadata).toEqual({});
  });

  it('uses empty metadata when metadata string is not valid JSON', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'test', 'info', '{not valid json}');
    const today = new Date().toISOString().split('T')[0];
    const filePath = join(testDir, 'analytics', 'events', 'dev', `${today}.jsonl`);
    const line = JSON.parse(readFileSync(filePath, 'utf-8').trim());
    expect(line.metadata).toEqual({});
  });

  it('appends multiple events without overwriting previous lines', () => {
    logEvent(paths, 'dev', 'glv', 'action', 'first', 'info');
    logEvent(paths, 'dev', 'glv', 'action', 'second', 'warning');
    const today = new Date().toISOString().split('T')[0];
    const filePath = join(testDir, 'analytics', 'events', 'dev', `${today}.jsonl`);
    const lines = readFileSync(filePath, 'utf-8').trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0]).event).toBe('first');
    expect(JSON.parse(lines[1]).event).toBe('second');
  });

  it('rejects an invalid event category', () => {
    expect(() =>
      logEvent(paths, 'dev', 'glv', 'invalid_cat' as never, 'test', 'info'),
    ).toThrow();
  });

  it('rejects an invalid event severity', () => {
    expect(() =>
      logEvent(paths, 'dev', 'glv', 'action', 'test', 'verbose' as never),
    ).toThrow();
  });
});
