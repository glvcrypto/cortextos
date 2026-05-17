import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'outreach-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getOutreachEvents: typeof import('../outreach')['getOutreachEvents'];
let getOutreachSummary: typeof import('../outreach')['getOutreachSummary'];
let getOutreachStats: typeof import('../outreach')['getOutreachStats'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../outreach');
  getOutreachEvents = mod.getOutreachEvents;
  getOutreachSummary = mod.getOutreachSummary;
  getOutreachStats = mod.getOutreachStats;
});

afterEach(() => {
  db.prepare('DELETE FROM events').run();
});

let _seq = 0;
function insertOutreachEvent(overrides: Partial<{
  type: string; org: string; city: string; industry: string; timestamp: string;
  prospect_id: string; email: string;
}> = {}) {
  _seq++;
  const data = {
    city: overrides.city ?? 'Sault Ste. Marie',
    industry: overrides.industry ?? 'plumbing',
    prospect_id: overrides.prospect_id ?? `p-${_seq}`,
    email: overrides.email ?? `lead-${_seq}@example.com`,
    hook_variant: 'v1',
    hook_family: 'local',
    structure_variant: 'short',
    batch_id: 'batch-1',
    channel: 'email',
  };
  db.prepare(
    `INSERT INTO events (id, timestamp, agent, org, type, data)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    `evt-${_seq}`,
    overrides.timestamp ?? new Date().toISOString(),
    'prospector',
    overrides.org ?? 'glv',
    overrides.type ?? 'email_sent',
    JSON.stringify(data),
  );
}

function insertNonOutreachEvent() {
  _seq++;
  db.prepare(
    `INSERT INTO events (id, timestamp, agent, org, type, data)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(`non-${_seq}`, new Date().toISOString(), 'dev', 'glv', 'action', null);
}

// ---------------------------------------------------------------------------
// getOutreachEvents
// ---------------------------------------------------------------------------

describe('getOutreachEvents', () => {
  it('returns empty when table is empty', () => {
    expect(getOutreachEvents()).toEqual([]);
  });

  it('excludes non-outreach event types', () => {
    insertNonOutreachEvent();
    expect(getOutreachEvents()).toHaveLength(0);
  });

  it('returns email_sent events', () => {
    insertOutreachEvent({ type: 'email_sent' });
    expect(getOutreachEvents()).toHaveLength(1);
  });

  it('returns reply_received events', () => {
    insertOutreachEvent({ type: 'reply_received' });
    expect(getOutreachEvents()).toHaveLength(1);
  });

  it('returns meeting_booked events', () => {
    insertOutreachEvent({ type: 'meeting_booked' });
    expect(getOutreachEvents()).toHaveLength(1);
  });

  it('filters by org', () => {
    insertOutreachEvent({ org: 'glv' });
    insertOutreachEvent({ org: 'other' });
    expect(getOutreachEvents('glv')).toHaveLength(1);
  });

  it('populates city + industry from data JSON', () => {
    insertOutreachEvent({ city: 'Toronto', industry: 'hvac' });
    const result = getOutreachEvents();
    expect(result[0].city).toBe('Toronto');
    expect(result[0].industry).toBe('hvac');
  });

  it('respects the limit parameter', () => {
    for (let i = 0; i < 5; i++) insertOutreachEvent();
    expect(getOutreachEvents(undefined, 3)).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// getOutreachSummary
// ---------------------------------------------------------------------------

describe('getOutreachSummary', () => {
  it('returns empty array when no outreach events', () => {
    expect(getOutreachSummary()).toEqual([]);
  });

  it('groups by city + industry', () => {
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing' });
    insertOutreachEvent({ city: 'Toronto', industry: 'hvac' });
    const result = getOutreachSummary();
    expect(result).toHaveLength(2);
  });

  it('counts sent, replies, and meetings per group', () => {
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'email_sent' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'email_sent' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'reply_received' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'meeting_booked' });
    const row = getOutreachSummary().find((r) => r.city === 'SSM');
    expect(row?.sent).toBe(2);
    expect(row?.replies).toBe(1);
    expect(row?.meetings).toBe(1);
  });

  it('computes reply_rate as percentage of sent', () => {
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'email_sent' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'email_sent' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'reply_received' });
    const row = getOutreachSummary()[0];
    expect(row.reply_rate).toBe(50);
  });

  it('returns reply_rate 0 when sent is 0', () => {
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'reply_received' });
    const row = getOutreachSummary()[0];
    expect(row.reply_rate).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getOutreachStats
// ---------------------------------------------------------------------------

describe('getOutreachStats', () => {
  it('returns zeroed stats when no events', () => {
    const stats = getOutreachStats();
    expect(stats.total_sent).toBe(0);
    expect(stats.total_replies).toBe(0);
    expect(stats.total_meetings).toBe(0);
    expect(stats.reply_rate).toBe(0);
    expect(stats.cities).toBe(0);
    expect(stats.industries).toBe(0);
  });

  it('aggregates totals across all groups', () => {
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'email_sent' });
    insertOutreachEvent({ city: 'Toronto', industry: 'hvac', type: 'email_sent' });
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'reply_received' });
    const stats = getOutreachStats();
    expect(stats.total_sent).toBe(2);
    expect(stats.total_replies).toBe(1);
    expect(stats.reply_rate).toBe(50);
  });

  it('counts unique cities and industries', () => {
    insertOutreachEvent({ city: 'SSM', industry: 'plumbing', type: 'email_sent' });
    insertOutreachEvent({ city: 'Toronto', industry: 'hvac', type: 'email_sent' });
    insertOutreachEvent({ city: 'SSM', industry: 'hvac', type: 'email_sent' });
    const stats = getOutreachStats();
    expect(stats.cities).toBe(2);
    expect(stats.industries).toBe(2);
  });
});
