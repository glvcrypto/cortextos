import { db } from '@/lib/db';
import type { Lead, LeadStatus } from '@/lib/types';

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    org: row.org as string,
    business_name: row.business_name as string,
    contact_name: (row.contact_name as string) ?? undefined,
    contact_email: (row.contact_email as string) ?? undefined,
    phone: (row.phone as string) ?? undefined,
    niche: (row.niche as string) ?? undefined,
    area: (row.area as string) ?? undefined,
    province: (row.province as string) ?? undefined,
    status: row.status as LeadStatus,
    priority: (row.priority as Lead['priority']),
    outreach_sent_at: (row.outreach_sent_at as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    source: (row.source as string) ?? undefined,
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) ?? undefined,
  };
}

export function getLeads(org?: string, status?: LeadStatus): Lead[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (org) { conditions.push('org = ?'); params.push(org); }
  if (status) { conditions.push('status = ?'); params.push(status); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const rows = db
      .prepare(`SELECT * FROM leads ${where} ORDER BY created_at DESC`)
      .all(...params) as Record<string, unknown>[];
    return rows.map(rowToLead);
  } catch (err) {
    console.error('[data/leads] getLeads error:', err);
    return [];
  }
}

export function getLeadById(id: string): Lead | null {
  try {
    const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? rowToLead(row) : null;
  } catch {
    return null;
  }
}

export function createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO leads (id, org, business_name, contact_name, contact_email, phone, niche, area, province, status, priority, notes, source, created_at)
    VALUES (@id, @org, @business_name, @contact_name, @contact_email, @phone, @niche, @area, @province, @status, @priority, @notes, @source, @created_at)
  `).run({
    id,
    org: data.org ?? '',
    business_name: data.business_name,
    contact_name: data.contact_name ?? null,
    contact_email: data.contact_email ?? null,
    phone: data.phone ?? null,
    niche: data.niche ?? null,
    area: data.area ?? null,
    province: data.province ?? null,
    status: data.status ?? 'scouted',
    priority: data.priority ?? 'normal',
    notes: data.notes ?? null,
    source: data.source ?? 'manual',
    created_at: now,
  });

  return getLeadById(id)!;
}

export function updateLead(id: string, patch: Partial<Omit<Lead, 'id' | 'created_at'>>): Lead | null {
  const existing = getLeadById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields = Object.keys(patch).filter((k) => k !== 'id' && k !== 'created_at');
  if (fields.length === 0) return existing;

  const setClause = fields.map((f) => `${f} = @${f}`).join(', ');

  db.prepare(`UPDATE leads SET ${setClause}, updated_at = @updated_at WHERE id = @id`).run({
    ...patch,
    updated_at: now,
    id,
  });

  return getLeadById(id);
}

export function deleteLead(id: string): boolean {
  try {
    const result = db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    return result.changes > 0;
  } catch {
    return false;
  }
}
