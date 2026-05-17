export interface PostMetric {
  id: string;
  url: string | null;
  date: string;            // ISO date YYYY-MM-DD
  type: 'reel' | 'image' | 'carousel' | 'video' | 'text' | 'story' | 'short' | 'other';
  caption: string | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  views: number | null;    // video views / impressions
  reach: number | null;
}

export interface AnalyticsSnapshot {
  date: string;            // YYYY-MM-DD — the calendar day this snapshot represents
  platform: Platform;
  scrapedAt: string;       // ISO timestamp
  ok: boolean;             // false = scrape failed, rest of fields may be null
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

export type Platform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'youtube'
  | 'gbp'
  | 'x'
  | 'threads'
  | 'tiktok';

export const PLATFORMS: Platform[] = [
  'instagram', 'facebook', 'linkedin', 'youtube',
  'gbp', 'x', 'threads', 'tiktok',
];

export function emptySnapshot(platform: Platform, date: string, error: string): AnalyticsSnapshot {
  return {
    date,
    platform,
    scrapedAt: new Date().toISOString(),
    ok: false,
    error,
    followers: null,
    following: null,
    postCount: null,
    impressions: null,
    reach: null,
    profileViews: null,
    likes: null,
    comments: null,
    shares: null,
    saves: null,
    videoViews: null,
    recentPosts: [],
  };
}
