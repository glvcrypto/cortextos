/**
 * Scheduled posts data layer.
 * Reads per-date, per-platform JSON files from the scheduled/ directory.
 * File path: orgs/glv/clients/glv-marketing/socials/scheduled/YYYY-MM-DD/platform-slug.json
 *
 * Pure types and constants are in social-scheduled-types.ts so client components
 * can import them without pulling in Node.js `fs`.
 */
import fs from 'fs';
import path from 'path';
export type { PostStatus, GlvCategory, ScheduledPost, EditRequest } from './social-scheduled-types';
export { GLV_CATEGORIES } from './social-scheduled-types';
import type { ScheduledPost } from './social-scheduled-types';

const CTX_ROOT = process.env.CTX_ROOT ?? path.join(process.cwd(), '..');
const SCHEDULED_BASE = path.join(
  CTX_ROOT, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials', 'scheduled',
);

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
