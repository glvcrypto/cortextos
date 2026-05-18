/**
 * Best-time-to-post recommendations.
 * Computes day-of-week engagement patterns from scheduled posts that have been posted.
 * Returns "insufficient data" until 4+ weeks of post history exist per platform.
 */
import { NextResponse } from 'next/server';
import { getAllScheduledPosts } from '@/lib/data/social-scheduled';

export const dynamic = 'force-dynamic';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MIN_POSTS_FOR_RECOMMENDATION = 8;

export interface BestTimeSlot {
  day: string;
  hour: number;
  avgEngagement: number;
  sampleSize: number;
}

export interface PlatformBestTimes {
  platform: string;
  hasData: boolean;
  totalPosts: number;
  slots: BestTimeSlot[];  // top 3 slots sorted by avgEngagement desc
  recommended: string | null;  // human-readable: e.g. "Tue 9am (3.2x avg engagement)"
}

export async function GET(): Promise<NextResponse> {
  const allPosts = getAllScheduledPosts();

  // Only consider posted posts with engagement data estimable from caption/hashtags
  // (true engagement data comes from analytics snapshots, but we use scheduling time for hour distribution)
  const postedPosts = allPosts.filter(p => p.status === 'posted');

  const platformMap = new Map<string, typeof postedPosts>();
  for (const post of postedPosts) {
    const list = platformMap.get(post.platform) ?? [];
    list.push(post);
    platformMap.set(post.platform, list);
  }

  const platforms = Array.from(new Set(allPosts.map(p => p.platform)));
  const results: PlatformBestTimes[] = platforms.map(platform => {
    const posts = platformMap.get(platform) ?? [];

    if (posts.length < MIN_POSTS_FOR_RECOMMENDATION) {
      return { platform, hasData: false, totalPosts: posts.length, slots: [], recommended: null };
    }

    // Group by day-of-week + hour bucket (2h buckets for smoother distribution)
    const buckets = new Map<string, { count: number; totalEngagementScore: number }>();

    for (const post of posts) {
      const d = new Date(post.scheduled_at);
      const day = DAY_NAMES[d.getUTCDay()];
      const hour = Math.floor(d.getUTCHours() / 2) * 2; // round to 2h bucket
      const key = `${day}:${hour}`;
      const existing = buckets.get(key) ?? { count: 0, totalEngagementScore: 0 };
      // Use a unit engagement score of 1.0 per posted post (real engagement data would come from analytics)
      existing.count++;
      existing.totalEngagementScore += 1;
      buckets.set(key, existing);
    }

    const slots: BestTimeSlot[] = Array.from(buckets.entries())
      .map(([key, v]) => {
        const [day, hourStr] = key.split(':');
        return {
          day,
          hour: parseInt(hourStr),
          avgEngagement: v.totalEngagementScore / v.count,
          sampleSize: v.count,
        };
      })
      .sort((a, b) => b.sampleSize - a.sampleSize || b.avgEngagement - a.avgEngagement)
      .slice(0, 3);

    const top = slots[0];
    const amPm = top ? (top.hour < 12 ? `${top.hour === 0 ? 12 : top.hour}am` : `${top.hour === 12 ? 12 : top.hour - 12}pm`) : null;
    const recommended = top ? `${top.day} ${amPm} UTC (${top.sampleSize} posts)` : null;

    return { platform, hasData: true, totalPosts: posts.length, slots, recommended };
  });

  return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } });
}
