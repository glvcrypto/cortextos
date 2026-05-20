/**
 * Live per-post metrics types. Companion to ./types.ts.
 *
 * AnalyticsSnapshot in ./types.ts covers PROFILE-level daily snapshots.
 * LivePostSnapshot covers PER-POST 15-min refresh used by the live-tracker.
 *
 * Why a separate file: avoids breaking the existing emptySnapshot signature
 * and keeps the live-tracker self-contained for future per-platform extension.
 */
import type { Platform } from './types.js';

export interface LivePostSnapshot {
  post_id: string;
  platform: Platform;
  post_url: string;
  platform_post_id: string;
  scraped_at: string;
  ok: boolean;
  error: string | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  views: number | null;
  thumbnail_url: string | null;
  caption: string | null;
}

export interface PostRegistryEntry {
  post_id: string;
  platform: Platform;
  intro: string;
  post_url: string;
  blotato_submission_id: string;
  published_at: string;
  platform_post_id: string;
}

export interface PostRegistry {
  generated_at: string;
  client: string;
  posts: PostRegistryEntry[];
}

export function emptyLiveSnapshot(
  entry: PostRegistryEntry,
  error: string,
): LivePostSnapshot {
  return {
    post_id: entry.post_id,
    platform: entry.platform,
    post_url: entry.post_url,
    platform_post_id: entry.platform_post_id,
    scraped_at: new Date().toISOString(),
    ok: false,
    error,
    likes: null,
    comments: null,
    shares: null,
    saves: null,
    views: null,
    thumbnail_url: null,
    caption: null,
  };
}
