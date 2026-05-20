/**
 * Blotato status writeback.
 *
 * The Queued Posts panel reads scheduled-post JSON files, but those files keep
 * their authoring status ('draft' / 'scheduled') even after the post publishes
 * through Blotato — so the panel shows already-live posts as still queued.
 *
 * This reconciler reads posts-registry.json (the Blotato-derived record of what
 * actually published) and stamps each matching scheduled-post file with
 * status='posted' plus the published_at / post_url / blotato_submission_id from
 * the registry. Run on a cron so the panel stays accurate.
 *
 * Usage: node dist/social/blotato-writeback.js [--dry-run]
 *
 * Reads:  orgs/glv/clients/glv-marketing/socials/posts-registry.json
 *         orgs/glv/clients/glv-marketing/socials/scheduled/<date>/<slug>.json
 * Writes: the scheduled-post files in place (atomic).
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { atomicWriteSync } from '../utils/atomic.js';
import type { PostRegistry, PostRegistryEntry } from './types-live.js';

export interface ScheduledPostRecord {
  id: string;
  platform: string;
  status: string;
  [k: string]: unknown;
}

/** Normalise a platform label so the two sources compare cleanly. */
export function normalizePlatform(p: string): string {
  const s = p.trim().toLowerCase();
  return s === 'x' ? 'twitter' : s;
}

/**
 * True when a registry entry corresponds to a given scheduled post. The
 * scheduled-post id embeds the intro slug (e.g. `intro-1-instagram`); the
 * registry stores the bare intro (`intro-1`). The trailing dash guards against
 * `intro-1` falsely prefix-matching `intro-10`.
 */
export function registryEntryMatches(post: ScheduledPostRecord, entry: PostRegistryEntry): boolean {
  if (normalizePlatform(post.platform) !== normalizePlatform(entry.platform)) return false;
  const intro = entry.intro?.trim();
  if (!intro || intro.toLowerCase() === 'unknown') return false;
  return post.id === intro || post.id.startsWith(intro + '-');
}

export interface WritebackFields {
  status: 'posted';
  published_at: string;
  post_url: string;
  blotato_submission_id: string;
}

export interface WritebackResult {
  changed: boolean;
  fields?: WritebackFields;
}

/**
 * Decide the writeback for one scheduled post. Only draft/scheduled posts are
 * reconcilable — posted/cancelled/failed are left untouched. When the Blotato
 * retry bug produced duplicate registry entries, the earliest publish wins.
 */
export function reconcileScheduledPost(
  post: ScheduledPostRecord,
  registry: PostRegistryEntry[],
): WritebackResult {
  if (post.status !== 'draft' && post.status !== 'scheduled') return { changed: false };
  const matches = registry.filter(e => registryEntryMatches(post, e));
  if (matches.length === 0) return { changed: false };
  const canonical = matches.reduce((a, b) => (a.published_at <= b.published_at ? a : b));
  return {
    changed: true,
    fields: {
      status: 'posted',
      published_at: canonical.published_at,
      post_url: canonical.post_url,
      blotato_submission_id: canonical.blotato_submission_id,
    },
  };
}

function run(): void {
  const dryRun = process.argv.includes('--dry-run');

  // Same root resolution as post-tracker.ts: CTX_PROJECT_ROOT (daemon) or
  // CTX_ROOT (per-instance state dir) or the plain repo root.
  const projectRoot = process.env.CTX_PROJECT_ROOT
    ?? process.env.CTX_ROOT
    ?? join(homedir(), 'cortextos');
  const clientBase = join(
    projectRoot, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials',
  );
  const registryPath = join(clientBase, 'posts-registry.json');
  const scheduledBase = join(clientBase, 'scheduled');

  if (!existsSync(registryPath)) {
    console.log(`[blotato-writeback] no registry at ${registryPath} — nothing to reconcile`);
    return;
  }
  if (!existsSync(scheduledBase)) {
    console.log(`[blotato-writeback] no scheduled dir at ${scheduledBase} — nothing to reconcile`);
    return;
  }

  const registry = (JSON.parse(readFileSync(registryPath, 'utf-8')) as PostRegistry).posts;

  const dateDirs = readdirSync(scheduledBase)
    .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();

  let updated = 0, scanned = 0;

  for (const dateDir of dateDirs) {
    const dirPath = join(scheduledBase, dateDir);
    let files: string[];
    try { files = readdirSync(dirPath).filter(f => f.endsWith('.json')); }
    catch { continue; }

    for (const file of files) {
      const filePath = join(dirPath, file);
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(readFileSync(filePath, 'utf-8')) as Record<string, unknown>;
      } catch {
        console.error(`[blotato-writeback] skip malformed ${dateDir}/${file}`);
        continue;
      }

      if (typeof data.id !== 'string' || typeof data.platform !== 'string' || typeof data.status !== 'string') {
        continue;
      }
      scanned++;

      const result = reconcileScheduledPost(data as ScheduledPostRecord, registry);
      if (!result.changed || !result.fields) continue;

      console.log(
        `[blotato-writeback] ${dryRun ? 'WOULD UPDATE' : 'update'} ${dateDir}/${file}: `
        + `${String(data.status)} -> posted (${result.fields.post_url})`,
      );
      updated++;

      if (dryRun) continue;

      const next = {
        ...data,
        status: result.fields.status,
        published_at: result.fields.published_at,
        post_url: result.fields.post_url,
        blotato_submission_id: result.fields.blotato_submission_id,
        blotato_writeback_at: new Date().toISOString(),
      };
      atomicWriteSync(filePath, JSON.stringify(next, null, 2));
    }
  }

  console.log(
    `[blotato-writeback] done — ${updated} ${dryRun ? 'would be updated' : 'updated'}, `
    + `${scanned} scanned, registry-size=${registry.length}`,
  );
}

// Guard so importing the pure helpers (e.g. from tests) does not run the
// filesystem reconciler as a side effect.
if (require.main === module) {
  run();
}
