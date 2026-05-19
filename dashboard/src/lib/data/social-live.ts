/**
 * Live per-post metrics data layer.
 *
 * Reads:
 *  - orgs/glv/clients/glv-marketing/socials/posts-registry.json (post URL registry)
 *  - orgs/glv/clients/glv-marketing/socials/analytics/live/<platform>/<platform_post_id>.json
 *    (15-min snapshots written by src/social/post-tracker.ts)
 *
 * Joins the registry entry against the latest snapshot so the dashboard can
 * render one row per tracked post with current likes/comments/views.
 *
 * Pure types live in social-live-types.ts for client component reuse.
 */
import fs from 'fs';
import path from 'path';
import type { LivePostRow, PostRegistry } from './social-live-types';
export type { LivePostRow, LivePostSnapshot, PostRegistryEntry, PostRegistry } from './social-live-types';

const CTX_ROOT = process.env.CTX_ROOT ?? path.join(process.cwd(), '..');
const CLIENT_BASE = path.join(
  CTX_ROOT, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials',
);
const REGISTRY_PATH = path.join(CLIENT_BASE, 'posts-registry.json');
const LIVE_BASE = path.join(CLIENT_BASE, 'analytics', 'live');

export function getLivePosts(): LivePostRow[] {
  if (!fs.existsSync(REGISTRY_PATH)) return [];

  let registry: PostRegistry;
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8')) as PostRegistry;
  } catch {
    return [];
  }

  const rows: LivePostRow[] = [];

  for (const entry of registry.posts) {
    const snapPath = path.join(LIVE_BASE, entry.platform, `${entry.platform_post_id}.json`);
    let snapshot: LivePostRow['snapshot'] = null;
    if (fs.existsSync(snapPath)) {
      try {
        snapshot = JSON.parse(fs.readFileSync(snapPath, 'utf-8')) as LivePostRow['snapshot'];
      } catch { /* skip malformed */ }
    }
    rows.push({ entry, snapshot });
  }

  // Sort newest published first
  return rows.sort((a, b) => b.entry.published_at.localeCompare(a.entry.published_at));
}

export function liveBase(): string {
  return LIVE_BASE;
}
