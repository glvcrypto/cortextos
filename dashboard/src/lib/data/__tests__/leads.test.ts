import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leads-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getLeads: typeof import('../leads')['getLeads'];
let getLeadById: typeof import('../leads')['getLeadById'];
let createLead: typeof import('../leads')['createLead'];
let updateLead: typeof import('../leads')['updateLead'];
let deleteLead: typeof import('../leads')['deleteLead'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../leads');
  getLeads = mod.getLeads;
  getLeadById = mod.getLeadById;
  createLead = mod.createLead;
  updateLead = mod.updateLead;
  deleteLead = mod.deleteLead;
});

afterEach(() => {
  db.prepare('DELETE FROM leads').run();
});

const BASE_LEAD = {
  org: 'glv',
  business_name: 'Test Plumbing Co',
  status: 'scouted' as const,
  priority: 'normal' as const,
};

// ---------------------------------------------------------------------------
// createLead
// ---------------------------------------------------------------------------

describe('createLead', () => {
  it('creates a lead and returns it with an id', () => {
    const lead = createLead(BASE_LEAD);
    expect(lead.id).toMatch(/^lead_/);
    expect(lead.business_name).toBe('Test Plumbing Co');
  });

  it('defaults status to "scouted" when not provided', () => {
    const { status: _, ...noStatus } = BASE_LEAD;
    const lead = createLead(noStatus as typeof BASE_LEAD);
    expect(lead.status).toBe('scouted');
  });

  it('defaults priority to "normal" when not provided', () => {
    const { priority: _, ...noPriority } = BASE_LEAD;
    const lead = createLead(noPriority as typeof BASE_LEAD);
    expect(lead.priority).toBe('normal');
  });

  it('stores optional fields when provided', () => {
    const lead = createLead({
      ...BASE_LEAD,
      contact_name: 'Jane Doe',
      contact_email: 'jane@example.com',
      niche: 'plumbing',
      area: 'Sault Ste. Marie',
      province: 'ON',
    });
    expect(lead.contact_name).toBe('Jane Doe');
    expect(lead.niche).toBe('plumbing');
    expect(lead.province).toBe('ON');
  });

  it('persists to db (getLeadById returns it)', () => {
    const lead = createLead(BASE_LEAD);
    const found = getLeadById(lead.id);
    expect(found?.id).toBe(lead.id);
  });
});

// ---------------------------------------------------------------------------
// getLeads
// ---------------------------------------------------------------------------

describe('getLeads', () => {
  it('returns empty array when table is empty', () => {
    expect(getLeads()).toEqual([]);
  });

  it('returns all leads with no filter', () => {
    createLead(BASE_LEAD);
    createLead({ ...BASE_LEAD, business_name: 'Another Co' });
    expect(getLeads()).toHaveLength(2);
  });

  it('filters by org', () => {
    createLead({ ...BASE_LEAD, org: 'glv' });
    createLead({ ...BASE_LEAD, org: 'other', business_name: 'Other Corp' });
    expect(getLeads('glv')).toHaveLength(1);
  });

  it('filters by status', () => {
    createLead({ ...BASE_LEAD, status: 'contacted' });
    createLead({ ...BASE_LEAD, business_name: 'B2', status: 'client' });
    expect(getLeads(undefined, 'contacted')).toHaveLength(1);
  });

  it('stacks org + status filter', () => {
    createLead({ ...BASE_LEAD, org: 'glv', status: 'researched' });
    createLead({ ...BASE_LEAD, org: 'glv', status: 'contacted', business_name: 'C' });
    createLead({ ...BASE_LEAD, org: 'other', status: 'researched', business_name: 'D' });
    expect(getLeads('glv', 'researched')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getLeadById
// ---------------------------------------------------------------------------

describe('getLeadById', () => {
  it('returns null for non-existent ID', () => {
    expect(getLeadById('no-such-id')).toBeNull();
  });

  it('returns the lead when found', () => {
    const lead = createLead(BASE_LEAD);
    const found = getLeadById(lead.id);
    expect(found?.business_name).toBe('Test Plumbing Co');
  });
});

// ---------------------------------------------------------------------------
// updateLead
// ---------------------------------------------------------------------------

describe('updateLead', () => {
  it('returns null for non-existent ID', () => {
    expect(updateLead('no-such', { status: 'client' })).toBeNull();
  });

  it('updates a single field', () => {
    const lead = createLead(BASE_LEAD);
    const updated = updateLead(lead.id, { status: 'contacted' });
    expect(updated?.status).toBe('contacted');
  });

  it('updates multiple fields at once', () => {
    const lead = createLead(BASE_LEAD);
    const updated = updateLead(lead.id, { status: 'meeting', notes: 'Call scheduled' });
    expect(updated?.status).toBe('meeting');
    expect(updated?.notes).toBe('Call scheduled');
  });

  it('returns the existing lead when patch is empty', () => {
    const lead = createLead(BASE_LEAD);
    const result = updateLead(lead.id, {});
    expect(result?.id).toBe(lead.id);
    expect(result?.status).toBe('scouted');
  });

  it('sets updated_at timestamp', () => {
    const lead = createLead(BASE_LEAD);
    const updated = updateLead(lead.id, { notes: 'changed' });
    expect(updated?.updated_at).toBeTruthy();
  });

  it('does not change id or created_at', () => {
    const lead = createLead(BASE_LEAD);
    const updated = updateLead(lead.id, { status: 'client' });
    expect(updated?.id).toBe(lead.id);
    expect(updated?.created_at).toBe(lead.created_at);
  });
});

// ---------------------------------------------------------------------------
// deleteLead
// ---------------------------------------------------------------------------

describe('deleteLead', () => {
  it('returns false for non-existent ID', () => {
    expect(deleteLead('no-such')).toBe(false);
  });

  it('returns true and removes the lead', () => {
    const lead = createLead(BASE_LEAD);
    expect(deleteLead(lead.id)).toBe(true);
    expect(getLeadById(lead.id)).toBeNull();
  });

  it('only deletes the specified lead', () => {
    const a = createLead(BASE_LEAD);
    const b = createLead({ ...BASE_LEAD, business_name: 'B Corp' });
    deleteLead(a.id);
    expect(getLeadById(b.id)).not.toBeNull();
  });
});
