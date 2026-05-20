// Dashboard social analytics data layer.
// Reads per-platform daily JSON snapshots from the analytics directory.
// Called once per page load — no streaming, no DB.

import fs from 'fs';
import path from 'path';

const CTX_ROOT = process.env.CTX_ROOT ?? path.join(process.cwd(), '..');
const ANALYTICS_BASE = path.join(
  CTX_ROOT, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials', 'analytics',
);

export type Platform =
  | 'instagram' | 'facebook' | 'linkedin' | 'youtube'
  | 'gbp' | 'x' | 'threads' | 'tiktok';

export const PLATFORMS: Platform[] = [
  'instagram', 'facebook', 'linkedin', 'youtube',
  'gbp', 'x', 'threads', 'tiktok',
];

export interface DailySnapshot {
  date: string;
  scrapedAt: string;
  ok: boolean;
  error: string | null;
  followers: number | null;
  following: number | null;
  postCount: number | null;
  impressions: number | null;
  reach: number | null;
  profileViews: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  videoViews: number | null;
  recentPosts: PostMetric[];
}

export interface PostMetric {
  id: string;
  url: string | null;
  date: string;
  type: string;
  caption: string | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  views: number | null;
  reach: number | null;
}

// Channel-level snapshot written by the channel-stats-15m cron
// (src/social/channel-tracker.ts) — a 15-min follower/posts refresh that is
// far fresher than the 06:00 UTC daily scrape.
export interface LiveChannelSnapshot {
  platform: string;
  handle: string;
  scraped_at: string;
  ok: boolean;
  error: string | null;
  followers: number | null;
  posts: number | null;
  following: number | null;
}

export interface PlatformTimeseries {
  platform: Platform;
  handle: string;
  snapshots: DailySnapshot[];   // sorted ascending by date
  latestSnapshot: DailySnapshot | null;
  lastScrapedAt: string | null;
  liveSnapshot: LiveChannelSnapshot | null;  // 15-min channel refresh, when available
}

const HANDLES: Record<Platform, string> = {
  instagram: '@glv.marketing',
  facebook:  'GLV Marketing',
  linkedin:  'GLV Marketing',
  youtube:   '@glvmarketing',
  gbp:       'GLV Marketing',
  x:         '@glvmarketing',
  threads:   '@glv.marketing',
  tiktok:    '@glvmarketing',
};

function readLiveChannel(platform: Platform): LiveChannelSnapshot | null {
  try {
    const raw = fs.readFileSync(
      path.join(ANALYTICS_BASE, 'live-channels', `${platform}.json`), 'utf-8',
    );
    return JSON.parse(raw) as LiveChannelSnapshot;
  } catch {
    return null;
  }
}

export function getPlatformTimeseries(platform: Platform): PlatformTimeseries {
  const dir = path.join(ANALYTICS_BASE, platform);
  const snapshots: DailySnapshot[] = [];

  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir)
      .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort();

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
        const snap = JSON.parse(raw) as DailySnapshot;
        snapshots.push(snap);
      } catch { /* skip malformed */ }
    }
  }

  const latest = snapshots.at(-1) ?? null;

  return {
    platform,
    handle: HANDLES[platform],
    snapshots,
    latestSnapshot: latest,
    lastScrapedAt: latest?.scrapedAt ?? null,
    liveSnapshot: readLiveChannel(platform),
  };
}

export function getAllPlatformTimeseries(): PlatformTimeseries[] {
  return PLATFORMS.map(getPlatformTimeseries);
}
