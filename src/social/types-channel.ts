/**
 * Live channel-level (profile) snapshot types. Companion to ./types.ts and
 * ./types-live.ts.
 *
 *   AnalyticsSnapshot (./types.ts)      — full daily profile snapshot, incl.
 *                                         insights + recent-posts grid.
 *   LivePostSnapshot  (./types-live.ts) — per-post 15-min refresh.
 *   LiveChannelSnapshot (this file)     — lightweight profile-header refresh
 *                                         (followers/posts/following only).
 *
 * Why separate from AnalyticsSnapshot: the daily scrape does 3+ page navs per
 * platform (profile + insights + posts grid) — far too heavy for a 15-min cron
 * across every platform. The channel tracker does a single profile-page nav
 * and reads only the header counts.
 */
import type { Platform } from './types.js';

export interface LiveChannelSnapshot {
  platform: Platform;
  handle: string;
  scraped_at: string;
  ok: boolean;
  error: string | null;
  followers: number | null;
  posts: number | null;
  following: number | null;
}

export function emptyChannelSnapshot(
  platform: Platform,
  handle: string,
  error: string,
): LiveChannelSnapshot {
  return {
    platform,
    handle,
    scraped_at: new Date().toISOString(),
    ok: false,
    error,
    followers: null,
    posts: null,
    following: null,
  };
}
