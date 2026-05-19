/**
 * Live-tracker types — safe to import in client components (no fs dependency).
 * Mirrors src/social/types-live.ts on the framework side.
 */

export type LivePlatform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'gbp'
  | 'x'
  | 'twitter'
  | 'threads'
  | 'tiktok';

export interface PostRegistryEntry {
  post_id: string;
  platform: LivePlatform;
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

export interface LivePostSnapshot {
  post_id: string;
  platform: LivePlatform;
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
}

export interface LivePostRow {
  entry: PostRegistryEntry;
  snapshot: LivePostSnapshot | null;
}
