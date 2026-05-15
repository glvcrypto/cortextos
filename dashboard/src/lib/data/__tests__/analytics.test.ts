import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'analytics-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getTaskThroughput: typeof import('../analytics')['getTaskThroughput'];
let getAgentEffectiveness: typeof import('../analytics')['getAgentEffectiveness'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../analytics');
  getTaskThroughput = mod.getTaskThroughput;
  getAgentEffectiveness = mod.getAgentEffectiveness;
});

afterEach(() => {
  db.prepare('DELETE FROM tasks').run();
  db.prepare('DELETE FROM events').run();
});

let _seq = 0;
function insertTask(overrides: Partial<{
  id: string; status: string; org: string; assignee: string | null;
  completed_at: string | null; created_at: string;
}> = {}) {
  _seq++;
  db.prepare(
    `INSERT INTO tasks (id, title, status, priority, org, assignee, created_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    overrides.id ?? `t-${_seq}`,
    `Task ${_seq}`,
    overrides.status ?? 'pending',
    'normal',
    overrides.org ?? 'glv',
    overrides.assignee ?? null,
    overrides.created_at ?? new Date().toISOString(),
    overrides.completed_at ?? null,
  );
}

function insertErrorEvent(agent: string, org = 'glv') {
  _seq++;
  db.prepare(
    `INSERT INTO events (id, timestamp, agent, org, type) VALUES (?, ?, ?, ?, ?)`
  ).run(`err-${_seq}`, new Date().toISOString(), agent, org, 'error');
}

// ---------------------------------------------------------------------------
// getTaskThroughput
// ---------------------------------------------------------------------------

describe('getTaskThroughput', () => {
  it('returns empty when no completed tasks', () => {
    insertTask({ status: 'pending' });
    expect(getTaskThroughput()).toEqual([]);
  });

  it('returns a row for a task completed today', () => {
    insertTask({ status: 'completed', completed_at: new Date().toISOString() });
    const result = getTaskThroughput();
    expect(result).toHaveLength(1);
    expect(result[0].tasks).toBe(1);
  });

  it('groups multiple tasks completed on the same day', () => {
    const today = new Date().toISOString();
    insertTask({ status: 'completed', completed_at: today });
    insertTask({ status: 'completed', completed_at: today });
    const result = getTaskThroughput();
    expect(result[0].tasks).toBe(2);
  });

  it('excludes tasks completed outside the day window', () => {
    const old = new Date(Date.now() - 60 * 86400 * 1000).toISOString();
    insertTask({ status: 'completed', completed_at: old });
    const result = getTaskThroughput(30);
    expect(result).toHaveLength(0);
  });

  it('filters by org', () => {
    const today = new Date().toISOString();
    insertTask({ status: 'completed', completed_at: today, org: 'glv' });
    insertTask({ status: 'completed', completed_at: today, org: 'other' });
    const result = getTaskThroughput(30, 'glv');
    expect(result).toHaveLength(1);
  });

  it('date column is a date string (YYYY-MM-DD)', () => {
    insertTask({ status: 'completed', completed_at: new Date().toISOString() });
    const result = getTaskThroughput();
    expect(result[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ---------------------------------------------------------------------------
// getAgentEffectiveness
// ---------------------------------------------------------------------------

describe('getAgentEffectiveness', () => {
  it('returns empty when no tasks', () => {
    expect(getAgentEffectiveness()).toEqual([]);
  });

  it('returns a row per unique assignee', () => {
    insertTask({ assignee: 'dev', status: 'completed', completed_at: new Date().toISOString() });
    insertTask({ assignee: 'seo', status: 'pending' });
    const result = getAgentEffectiveness();
    const names = result.map((r) => r.name);
    expect(names).toContain('dev');
    expect(names).toContain('seo');
  });

  it('excludes tasks with null assignee', () => {
    insertTask({ assignee: null, status: 'completed', completed_at: new Date().toISOString() });
    expect(getAgentEffectiveness()).toHaveLength(0);
  });

  it('computes completionRate as percentage', () => {
    insertTask({ assignee: 'dev', status: 'completed', completed_at: new Date().toISOString() });
    insertTask({ assignee: 'dev', status: 'pending' });
    const result = getAgentEffectiveness();
    const dev = result.find((r) => r.name === 'dev');
    expect(dev?.completionRate).toBeCloseTo(50, 0);
  });

  it('includes error count from events', () => {
    insertTask({ assignee: 'dev', status: 'pending' });
    insertErrorEvent('dev');
    insertErrorEvent('dev');
    const result = getAgentEffectiveness();
    const dev = result.find((r) => r.name === 'dev');
    expect(dev?.errorCount).toBe(2);
  });

  it('errorCount is 0 when agent has no error events', () => {
    insertTask({ assignee: 'dev', status: 'pending' });
    const result = getAgentEffectiveness();
    expect(result[0].errorCount).toBe(0);
  });

  it('recentTrend is a 7-element array', () => {
    insertTask({ assignee: 'dev', status: 'completed', completed_at: new Date().toISOString() });
    const result = getAgentEffectiveness();
    expect(result[0].recentTrend).toHaveLength(7);
  });

  it('filters by org', () => {
    insertTask({ assignee: 'dev', status: 'pending', org: 'glv' });
    insertTask({ assignee: 'dev', status: 'pending', org: 'other' });
    const result = getAgentEffectiveness('glv');
    expect(result).toHaveLength(1);
  });
});
