import { db } from '@/lib/db';
import type { ContentItem, ContentStatus } from '@/lib/types';

function rowToContent(row: Record<string, unknown>): ContentItem {
  return {
    id: row.id as string,
    org: row.org as string,
    client_slug: (row.client_slug as string) ?? undefined,
    title: row.title as string,
    platform: (row.platform as string) ?? undefined,
    content_type: (row.content_type as ContentItem['content_type']) ?? 'blog',
    status: row.status as ContentStatus,
    scheduled_date: (row.scheduled_date as string) ?? undefined,
    published_date: (row.published_date as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) ?? undefined,
  };
}

export function getContentItems(org?: string, status?: ContentStatus): ContentItem[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (org) { conditions.push('org = ?'); params.push(org); }
  if (status) { conditions.push('status = ?'); params.push(status); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const rows = db
      .prepare(`SELECT * FROM content_items ${where} ORDER BY COALESCE(scheduled_date, created_at) DESC`)
      .all(...params) as Record<string, unknown>[];
    return rows.map(rowToContent);
  } catch (err) {
    console.error('[data/content] getContentItems error:', err);
    return [];
  }
}

export function getContentItemById(id: string): ContentItem | null {
  try {
    const row = db.prepare('SELECT * FROM content_items WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? rowToContent(row) : null;
  } catch { return null; }
}

export function createContentItem(data: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): ContentItem {
  const id = `content_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO content_items (id, org, client_slug, title, platform, content_type, status, scheduled_date, notes, created_at)
    VALUES (@id, @org, @client_slug, @title, @platform, @content_type, @status, @scheduled_date, @notes, @created_at)
  `).run({
    id,
    org: data.org ?? '',
    client_slug: data.client_slug ?? null,
    title: data.title,
    platform: data.platform ?? null,
    content_type: data.content_type ?? 'blog',
    status: data.status ?? 'draft',
    scheduled_date: data.scheduled_date ?? null,
    notes: data.notes ?? null,
    created_at: now,
  });

  return getContentItemById(id)!;
}

export function updateContentItem(id: string, patch: Partial<Omit<ContentItem, 'id' | 'created_at'>>): ContentItem | null {
  const existing = getContentItemById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields = Object.keys(patch).filter((k) => k !== 'id' && k !== 'created_at');
  if (fields.length === 0) return existing;

  const setClause = fields.map((f) => `${f} = @${f}`).join(', ');

  db.prepare(`UPDATE content_items SET ${setClause}, updated_at = @updated_at WHERE id = @id`).run({
    ...patch,
    updated_at: now,
    id,
  });

  return getContentItemById(id);
}

export function deleteContentItem(id: string): boolean {
  try {
    const result = db.prepare('DELETE FROM content_items WHERE id = ?').run(id);
    return result.changes > 0;
  } catch { return false; }
}
