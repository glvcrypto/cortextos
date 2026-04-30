import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tasks-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getTasks: typeof import('../tasks')['getTasks'];
let getTaskById: typeof import('../tasks')['getTaskById'];
let getTasksByStatus: typeof import('../tasks')['getTasksByStatus'];
let getTasksByAgent: typeof import('../tasks')['getTasksByAgent'];
let getTasksCompletedToday: typeof import('../tasks')['getTasksCompletedToday'];
let getInProgressCount: typeof import('../tasks')['getInProgressCount'];
let getTaskCount: typeof import('../tasks')['getTaskCount'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../tasks');
  getTasks = mod.getTasks;
  getTaskById = mod.getTaskById;
  getTasksByStatus = mod.getTasksByStatus;
  getTasksByAgent = mod.getTasksByAgent;
  getTasksCompletedToday = mod.getTasksCompletedToday;
  getInProgressCount = mod.getInProgressCount;
  getTaskCount = mod.getTaskCount;
});

afterEach(() => {
  db.prepare('DELETE FROM tasks').run();
});

let _seq = 0;
function insertTask(overrides: Partial<{
  id: string; title: string; status: string; priority: string;
  assignee: string; org: string; project: string; needs_approval: number;
  created_at: string; completed_at: string | null; description: string;
}> = {}) {
  _seq++;
  const row = {
    id: overrides.id ?? `task-${_seq}`,
    title: overrides.title ?? `Task ${_seq}`,
    description: overrides.description ?? null,
    status: overrides.status ?? 'pending',
    priority: overrides.priority ?? 'normal',
    assignee: overrides.assignee ?? null,
    org: overrides.org ?? 'glv',
    project: overrides.project ?? null,
    needs_approval: overrides.needs_approval ?? 0,
    created_at: overrides.created_at ?? new Date().toISOString(),
    completed_at: overrides.completed_at ?? null,
  };
  db.prepare(
    `INSERT INTO tasks (id, title, description, status, priority, assignee, org, project,
                        needs_approval, created_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(row.id, row.title, row.description, row.status, row.priority, row.assignee,
        row.org, row.project, row.needs_approval, row.created_at, row.completed_at);
  return row;
}

// ---------------------------------------------------------------------------
// getTasks
// ---------------------------------------------------------------------------

describe('getTasks', () => {
  it('returns empty array when table is empty', () => {
    expect(getTasks()).toEqual([]);
  });

  it('returns all tasks when no filters given', () => {
    insertTask(); insertTask();
    expect(getTasks()).toHaveLength(2);
  });

  it('filters by org', () => {
    insertTask({ org: 'glv' });
    insertTask({ org: 'other' });
    expect(getTasks({ org: 'glv' })).toHaveLength(1);
  });

  it('filters by status', () => {
    insertTask({ status: 'in_progress' });
    insertTask({ status: 'completed' });
    expect(getTasks({ status: 'in_progress' })).toHaveLength(1);
  });

  it('filters by priority', () => {
    insertTask({ priority: 'critical' });
    insertTask({ priority: 'normal' });
    expect(getTasks({ priority: 'critical' })).toHaveLength(1);
  });

  it('filters by assignee (agent)', () => {
    insertTask({ assignee: 'dev' });
    insertTask({ assignee: 'seo' });
    const result = getTasks({ agent: 'dev' });
    expect(result).toHaveLength(1);
    expect(result[0].assignee).toBe('dev');
  });

  it('agent filter "human" matches human/user assignees and [HUMAN] titles', () => {
    insertTask({ assignee: 'human' });
    insertTask({ assignee: 'user' });
    insertTask({ title: '[HUMAN] review this' });
    insertTask({ assignee: 'dev' }); // should NOT match
    const result = getTasks({ agent: 'human' });
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result.every((t) =>
      t.assignee === 'human' || t.assignee === 'user' || t.title.startsWith('[HUMAN]')
    )).toBe(true);
  });

  it('filters by project', () => {
    insertTask({ project: 'reyco' });
    insertTask({ project: 'cortextos' });
    expect(getTasks({ project: 'reyco' })).toHaveLength(1);
  });

  it('filters by search (title match)', () => {
    insertTask({ title: 'Fix breadcrumb schema' });
    insertTask({ title: 'Build expense tracker' });
    const result = getTasks({ search: 'breadcrumb' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('breadcrumb');
  });

  it('filters by search (description match)', () => {
    insertTask({ title: 'Some task', description: 'involves GSC indexing fix' });
    insertTask({ title: 'Other', description: 'nothing special' });
    expect(getTasks({ search: 'GSC indexing' })).toHaveLength(1);
  });

  it('maps needs_approval=1 to boolean true', () => {
    insertTask({ needs_approval: 1 });
    expect(getTasks()[0].needs_approval).toBe(true);
  });

  it('maps needs_approval=0 to boolean false', () => {
    insertTask({ needs_approval: 0 });
    expect(getTasks()[0].needs_approval).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getTaskById
// ---------------------------------------------------------------------------

describe('getTaskById', () => {
  it('returns null for non-existent ID', () => {
    expect(getTaskById('no-such-id')).toBeNull();
  });

  it('returns the task when ID matches', () => {
    insertTask({ id: 'abc-123', title: 'Find me' });
    const result = getTaskById('abc-123');
    expect(result).not.toBeNull();
    expect(result?.title).toBe('Find me');
  });
});

// ---------------------------------------------------------------------------
// getTasksByStatus
// ---------------------------------------------------------------------------

describe('getTasksByStatus', () => {
  it('returns tasks with matching status', () => {
    insertTask({ status: 'in_progress' });
    insertTask({ status: 'pending' });
    expect(getTasksByStatus('in_progress')).toHaveLength(1);
  });

  it('also filters by org when provided', () => {
    insertTask({ status: 'blocked', org: 'glv' });
    insertTask({ status: 'blocked', org: 'other' });
    expect(getTasksByStatus('blocked', 'glv')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getTasksByAgent
// ---------------------------------------------------------------------------

describe('getTasksByAgent', () => {
  it('returns tasks assigned to the given agent', () => {
    insertTask({ assignee: 'dev' });
    insertTask({ assignee: 'content' });
    const result = getTasksByAgent('dev');
    expect(result.every((t) => t.assignee === 'dev')).toBe(true);
  });

  it('returns empty when agent has no tasks', () => {
    expect(getTasksByAgent('no-agent')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getTasksCompletedToday
// ---------------------------------------------------------------------------

describe('getTasksCompletedToday', () => {
  it('returns empty when no tasks completed today', () => {
    const yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
    insertTask({ completed_at: yesterday, status: 'completed' });
    expect(getTasksCompletedToday()).toHaveLength(0);
  });

  it('returns tasks completed today', () => {
    insertTask({ completed_at: new Date().toISOString(), status: 'completed' });
    expect(getTasksCompletedToday()).toHaveLength(1);
  });

  it('filters by org', () => {
    const now = new Date().toISOString();
    insertTask({ completed_at: now, org: 'glv' });
    insertTask({ completed_at: now, org: 'other' });
    expect(getTasksCompletedToday('glv')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getInProgressCount / getTaskCount
// ---------------------------------------------------------------------------

describe('getTaskCount', () => {
  it('returns 0 when table is empty', () => {
    expect(getTaskCount()).toBe(0);
  });

  it('returns total count when no filters given', () => {
    insertTask(); insertTask(); insertTask();
    expect(getTaskCount()).toBe(3);
  });

  it('filters by status', () => {
    insertTask({ status: 'in_progress' });
    insertTask({ status: 'completed' });
    expect(getTaskCount(undefined, 'in_progress')).toBe(1);
  });

  it('filters by org', () => {
    insertTask({ org: 'glv' });
    insertTask({ org: 'other' });
    expect(getTaskCount('glv')).toBe(1);
  });
});

describe('getInProgressCount', () => {
  it('returns count of in_progress tasks', () => {
    insertTask({ status: 'in_progress' });
    insertTask({ status: 'in_progress' });
    insertTask({ status: 'pending' });
    expect(getInProgressCount()).toBe(2);
  });

  it('returns 0 when no in_progress tasks', () => {
    insertTask({ status: 'completed' });
    expect(getInProgressCount()).toBe(0);
  });
});
