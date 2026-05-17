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

export interface ScheduledPost {
  id: string;
  platform: string;
  scheduled_at: string;         // ISO timestamp
  status: PostStatus;
  carousel_ref: string | null;
  caption: string | null;
  hashtags: string[];
  audio_brief: string | null;
  geotag: string | null;
  blotato_job_id: string | null;
  // Derived fields — populated by data layer
  _file: string;                // relative path for mutations
  _date: string;                // YYYY-MM-DD derived from scheduled_at
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
