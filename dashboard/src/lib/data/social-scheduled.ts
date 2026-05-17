/**
 * Scheduled posts data layer.
 * Reads per-date, per-platform JSON files from the scheduled/ directory.
 * File path: orgs/glv/clients/glv-marketing/socials/scheduled/YYYY-MM-DD/platform-slug.json
 */
import fs from 'fs';
import path from 'path';

const CTX_ROOT = process.env.CTX_ROOT ?? path.join(process.cwd(), '..');
const SCHEDULED_BASE = path.join(
  CTX_ROOT, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials', 'scheduled',
);

export type PostStatus = 'draft' | 'scheduled' | 'posted' | 'failed' | 'cancelled';

export const GLV_CATEGORIES = [
  'Marketing',
  'SEO',
  'Email Marketing',
  'Paid Ad Strategy',
  'Website Building',
  'Claude Code for GLV',
  'Local SEO & GBP',
  'AI Integration for SMBs',
  'Lead Gen & Cold Outreach',
] as const;

export type GlvCategory = typeof GLV_CATEGORIES[number];

export interface ScheduledPost {
  id: string;
  platform: string;
  scheduled_at: string;
  status: PostStatus;
  carousel_ref: string | null;
  caption: string | null;
  hashtags: string[];
  audio_brief: string | null;
  geotag: string | null;
  blotato_job_id: string | null;
  // Item 2 — content categorization
  category: GlvCategory | null;
  // Item 3 schema fields (implementation gated on ManyChat credentials)
  first_comment: string | null;
  manychat_keyword_triggers: string[];
  manychat_dm_template_id: string | null;
  // Derived
  _file: string;
  _date: string;
}

export interface EditRequest {
  post_id: string;
  platform: string;
  change_description: string;
  urgency: 'now' | 'next_sync' | 'nightly_batch';
  requested_at: string;
}

export function getAllScheduledPosts(): ScheduledPost[] {
  const posts: ScheduledPost[] = [];

  if (!fs.existsSync(SCHEDULED_BASE)) return posts;

  const dateDirs = fs.readdirSync(SCHEDULED_BASE)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();

  for (const dateDir of dateDirs) {
    const dirPath = path.join(SCHEDULED_BASE, dateDir);
    let files: string[];
    try { files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json')); }
    catch { continue; }

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8');
        const data = JSON.parse(raw) as Omit<ScheduledPost, '_file' | '_date'>;
        posts.push({
          ...data,
          hashtags: data.hashtags ?? [],
          category: data.category ?? null,
          first_comment: data.first_comment ?? null,
          manychat_keyword_triggers: data.manychat_keyword_triggers ?? [],
          manychat_dm_template_id: data.manychat_dm_template_id ?? null,
          _file: path.join(dateDir, file),
          _date: dateDir,
        });
      } catch { /* skip malformed */ }
    }
  }

  // Sort by scheduled_at ascending
  return posts.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
}

export function scheduledBase(): string {
  return SCHEDULED_BASE;
}
