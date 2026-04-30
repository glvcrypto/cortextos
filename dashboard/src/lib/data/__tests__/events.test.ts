import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'events-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getRecentEvents: typeof import('../events')['getRecentEvents'];
let getEventsToday: typeof import('../events')['getEventsToday'];
let getEventsByAgent: typeof import('../events')['getEventsByAgent'];
let getEventsByCategory: typeof import('../events')['getEventsByCategory'];
let getMilestones: typeof import('../events')['getMilestones'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../events');
  getRecentEvents = mod.getRecentEvents;
  getEventsToday = mod.getEventsToday;
  getEventsByAgent = mod.getEventsByAgent;
  getEventsByCategory = mod.getEventsByCategory;
  getMilestones = mod.getMilestones;
});

afterEach(() => {
  db.prepare('DELETE FROM events').run();
});

// Helper — insert a minimal event row
function insertEvent(overrides: Partial<{
  id: string; timestamp: string; agent: string; org: string;
  type: string; category: string; severity: string; data: string | null; message: string;
}> = {}) {
  const row = {
    id: overrides.id ?? `evt-${Math.random().toString(36).slice(2)}`,
    timestamp: overrides.timestamp ?? new Date().toISOString(),
    agent: overrides.agent ?? 'dev',
    org: overrides.org ?? 'glv',
    type: overrides.type ?? 'action',
    category: overrides.category ?? '',
    severity: overrides.severity ?? 'info',
    data: overrides.data ?? null,
    message: overrides.message ?? 'test event',
  };
  db.prepare(
    `INSERT INTO events (id, timestamp, agent, org, type, category, severity, data, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(row.id, row.timestamp, row.agent, row.org, row.type, row.category, row.severity, row.data, row.message);
  return row;
}

// ---------------------------------------------------------------------------
// getRecentEvents
// ---------------------------------------------------------------------------

describe('getRecentEvents', () => {
  it('returns empty array when table is empty', () => {
    expect(getRecentEvents()).toEqual([]);
  });

  it('returns all events when no filters applied', () => {
    insertEvent({ id: 'e1' });
    insertEvent({ id: 'e2' });
    const result = getRecentEvents();
    expect(result).toHaveLength(2);
  });

  it('respects the limit parameter', () => {
    for (let i = 0; i < 5; i++) insertEvent();
    expect(getRecentEvents(3)).toHaveLength(3);
  });

  it('returns newest first (DESC order by timestamp)', () => {
    insertEvent({ id: 'old', timestamp: '2026-04-01T00:00:00Z' });
    insertEvent({ id: 'new', timestamp: '2026-04-30T00:00:00Z' });
    const result = getRecentEvents();
    expect(result[0].id).toBe('new');
    expect(result[1].id).toBe('old');
  });

  it('filters by org', () => {
    insertEvent({ id: 'glv', org: 'glv' });
    insertEvent({ id: 'other', org: 'other-org' });
    const result = getRecentEvents(50, 'glv');
    expect(result).toHaveLength(1);
    expect(result[0].org).toBe('glv');
  });

  it('filters by agent', () => {
    insertEvent({ id: 'dev', agent: 'dev' });
    insertEvent({ id: 'seo', agent: 'seo' });
    const result = getRecentEvents(50, undefined, 'dev');
    expect(result).toHaveLength(1);
    expect(result[0].agent).toBe('dev');
  });

  it('filters by category', () => {
    insertEvent({ id: 'cat-a', category: 'milestone' });
    insertEvent({ id: 'cat-b', category: 'error' });
    const result = getRecentEvents(50, undefined, undefined, 'milestone');
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('milestone');
  });

  it('stacks multiple filters (org + agent)', () => {
    insertEvent({ id: 'match', agent: 'dev', org: 'glv' });
    insertEvent({ id: 'wrong-org', agent: 'dev', org: 'other' });
    insertEvent({ id: 'wrong-agent', agent: 'seo', org: 'glv' });
    const result = getRecentEvents(50, 'glv', 'dev');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('match');
  });

  it('parses JSON data field', () => {
    insertEvent({ id: 'with-data', data: '{"key":"value"}' });
    const result = getRecentEvents();
    expect(result[0].data).toEqual({ key: 'value' });
  });

  it('sets data to undefined when JSON is corrupt', () => {
    insertEvent({ id: 'bad-json', data: 'not-json' });
    const result = getRecentEvents();
    expect(result[0].data).toBeUndefined();
  });

  it('sets data to undefined when data column is null', () => {
    insertEvent({ id: 'null-data', data: null });
    const result = getRecentEvents();
    expect(result[0].data).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getEventsToday
// ---------------------------------------------------------------------------

describe('getEventsToday', () => {
  it('returns empty when table is empty', () => {
    expect(getEventsToday()).toEqual([]);
  });

  it('returns events with today timestamp', () => {
    insertEvent({ id: 'today', timestamp: new Date().toISOString() });
    expect(getEventsToday()).toHaveLength(1);
  });

  it('excludes events from yesterday', () => {
    const yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
    insertEvent({ id: 'old', timestamp: yesterday });
    expect(getEventsToday()).toHaveLength(0);
  });

  it('filters by org', () => {
    insertEvent({ id: 't-glv', org: 'glv' });
    insertEvent({ id: 't-other', org: 'other' });
    const result = getEventsToday('glv');
    expect(result).toHaveLength(1);
    expect(result[0].org).toBe('glv');
  });
});

// ---------------------------------------------------------------------------
// getEventsByAgent
// ---------------------------------------------------------------------------

describe('getEventsByAgent', () => {
  it('returns only events for the specified agent', () => {
    insertEvent({ agent: 'dev' });
    insertEvent({ agent: 'content' });
    const result = getEventsByAgent('dev');
    expect(result.every((e) => e.agent === 'dev')).toBe(true);
  });

  it('returns empty when agent has no events', () => {
    expect(getEventsByAgent('no-such-agent')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getEventsByCategory
// ---------------------------------------------------------------------------

describe('getEventsByCategory', () => {
  it('returns events with the specified category', () => {
    insertEvent({ category: 'error' });
    insertEvent({ category: 'action' });
    expect(getEventsByCategory('error')).toHaveLength(1);
  });

  it('filters by category + org', () => {
    insertEvent({ category: 'metric', org: 'glv' });
    insertEvent({ category: 'metric', org: 'other' });
    expect(getEventsByCategory('metric', 'glv')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getMilestones
// ---------------------------------------------------------------------------

describe('getMilestones', () => {
  it('returns only milestone category events', () => {
    insertEvent({ id: 'm1', category: 'milestone' });
    insertEvent({ id: 'x1', category: 'action' });
    const result = getMilestones();
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('milestone');
  });

  it('filters milestones by org', () => {
    insertEvent({ category: 'milestone', org: 'glv' });
    insertEvent({ category: 'milestone', org: 'other' });
    expect(getMilestones('glv')).toHaveLength(1);
  });

  it('returns empty when no milestones exist', () => {
    insertEvent({ category: 'action' });
    expect(getMilestones()).toHaveLength(0);
  });
});
