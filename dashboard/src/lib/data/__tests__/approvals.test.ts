import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'approvals-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getPendingApprovals: typeof import('../approvals')['getPendingApprovals'];
let getResolvedApprovals: typeof import('../approvals')['getResolvedApprovals'];
let getPendingCount: typeof import('../approvals')['getPendingCount'];
let getApprovalById: typeof import('../approvals')['getApprovalById'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../approvals');
  getPendingApprovals = mod.getPendingApprovals;
  getResolvedApprovals = mod.getResolvedApprovals;
  getPendingCount = mod.getPendingCount;
  getApprovalById = mod.getApprovalById;
});

afterEach(() => {
  db.prepare('DELETE FROM approvals').run();
});

let _seq = 0;
function insertApproval(overrides: Partial<{
  id: string; title: string; category: string; status: string;
  agent: string; org: string; created_at: string; resolved_at: string | null;
}> = {}) {
  _seq++;
  const row = {
    id: overrides.id ?? `appr-${_seq}`,
    title: overrides.title ?? `Approval ${_seq}`,
    category: overrides.category ?? 'other',
    status: overrides.status ?? 'pending',
    agent: overrides.agent ?? 'dev',
    org: overrides.org ?? 'glv',
    created_at: overrides.created_at ?? new Date().toISOString(),
    resolved_at: overrides.resolved_at ?? null,
  };
  db.prepare(
    `INSERT INTO approvals (id, title, category, status, agent, org, created_at, resolved_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(row.id, row.title, row.category, row.status, row.agent, row.org, row.created_at, row.resolved_at);
  return row;
}

// ---------------------------------------------------------------------------
// getPendingApprovals
// ---------------------------------------------------------------------------

describe('getPendingApprovals', () => {
  it('returns empty when table is empty', () => {
    expect(getPendingApprovals()).toEqual([]);
  });

  it('returns only pending approvals', () => {
    insertApproval({ status: 'pending' });
    insertApproval({ status: 'approved' });
    expect(getPendingApprovals()).toHaveLength(1);
  });

  it('filters pending by org', () => {
    insertApproval({ status: 'pending', org: 'glv' });
    insertApproval({ status: 'pending', org: 'other' });
    expect(getPendingApprovals('glv')).toHaveLength(1);
  });

  it('filters pending by category', () => {
    insertApproval({ status: 'pending', category: 'deployment' });
    insertApproval({ status: 'pending', category: 'cost' });
    expect(getPendingApprovals(undefined, 'deployment')).toHaveLength(1);
  });

  it('stacks org + category filter', () => {
    insertApproval({ status: 'pending', org: 'glv', category: 'outreach' });
    insertApproval({ status: 'pending', org: 'glv', category: 'cost' });
    insertApproval({ status: 'pending', org: 'other', category: 'outreach' });
    expect(getPendingApprovals('glv', 'outreach')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getResolvedApprovals
// ---------------------------------------------------------------------------

describe('getResolvedApprovals', () => {
  it('returns empty when no resolved approvals', () => {
    insertApproval({ status: 'pending' });
    expect(getResolvedApprovals()).toHaveLength(0);
  });

  it('returns approved and rejected (not pending)', () => {
    insertApproval({ status: 'approved' });
    insertApproval({ status: 'rejected' });
    insertApproval({ status: 'pending' });
    expect(getResolvedApprovals()).toHaveLength(2);
  });

  it('filters by org', () => {
    insertApproval({ status: 'approved', org: 'glv' });
    insertApproval({ status: 'approved', org: 'other' });
    expect(getResolvedApprovals('glv')).toHaveLength(1);
  });

  it('filters by agent', () => {
    insertApproval({ status: 'approved', agent: 'dev' });
    insertApproval({ status: 'approved', agent: 'seo' });
    expect(getResolvedApprovals(undefined, { agent: 'dev' })).toHaveLength(1);
  });

  it('filters by category', () => {
    insertApproval({ status: 'approved', category: 'cost' });
    insertApproval({ status: 'approved', category: 'access' });
    expect(getResolvedApprovals(undefined, { category: 'cost' })).toHaveLength(1);
  });

  it('filters by date range', () => {
    const yesterday = new Date(Date.now() - 86400 * 1000);
    const tomorrow = new Date(Date.now() + 86400 * 1000);
    insertApproval({ status: 'approved', resolved_at: new Date().toISOString() });
    const dateRange: [Date, Date] = [yesterday, tomorrow];
    expect(getResolvedApprovals(undefined, { dateRange })).toHaveLength(1);
  });

  it('excludes approvals outside date range', () => {
    const old = new Date(Date.now() - 10 * 86400 * 1000); // 10 days ago
    insertApproval({ status: 'approved', resolved_at: old.toISOString() });
    const yesterday = new Date(Date.now() - 86400 * 1000);
    const tomorrow = new Date(Date.now() + 86400 * 1000);
    expect(getResolvedApprovals(undefined, { dateRange: [yesterday, tomorrow] })).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getPendingCount
// ---------------------------------------------------------------------------

describe('getPendingCount', () => {
  it('returns 0 when table is empty', () => {
    expect(getPendingCount()).toBe(0);
  });

  it('counts only pending', () => {
    insertApproval({ status: 'pending' });
    insertApproval({ status: 'pending' });
    insertApproval({ status: 'approved' });
    expect(getPendingCount()).toBe(2);
  });

  it('filters count by org', () => {
    insertApproval({ status: 'pending', org: 'glv' });
    insertApproval({ status: 'pending', org: 'other' });
    expect(getPendingCount('glv')).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// getApprovalById
// ---------------------------------------------------------------------------

describe('getApprovalById', () => {
  it('returns null for non-existent ID', () => {
    expect(getApprovalById('no-such')).toBeNull();
  });

  it('returns the approval when found', () => {
    insertApproval({ id: 'find-me', title: 'Deploy to prod' });
    const result = getApprovalById('find-me');
    expect(result?.title).toBe('Deploy to prod');
  });
});
