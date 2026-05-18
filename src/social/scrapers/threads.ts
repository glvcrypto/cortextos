import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = '@glv.marketing';
const PROFILE_URL = 'https://www.threads.net/@glv.marketing';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    await goto(PROFILE_URL);

    const profileData = await evaluate<{ followers: string | null; posts: string | null }>(`
      (() => {
        // Threads profile header — follower count
        const followerEl = document.querySelector(
          '[class*="follower"], [class*="followers-count"], span[class*="count"]'
        );
        const text = document.body.innerText;
        const followM = text.match(/([\d,\.KM]+)\s*follower/i);
        return {
          followers: followerEl?.textContent?.trim() ?? followM?.[1] ?? null,
          posts: null,
        };
      })()
    `);

    // Threads Insights (available for professional accounts)
    // Navigate to insights if available
    const insightsUrl = 'https://www.threads.net/@glv.marketing/insights';
    await goto(insightsUrl);

    const insights = await evaluate<{ reach: string | null; views: string | null }>(`
      (() => {
        const cards = [...document.querySelectorAll('[class*="insight"], [class*="stat-card"]')];
        const get = (label: string) =>
          cards.find(c => c.textContent?.toLowerCase().includes(label))
               ?.querySelector('[class*="number"], strong')?.textContent?.trim() ?? null;
        return { reach: get('reach'), views: get('view') };
      })()
    `);

    return {
      date,
      platform: 'threads',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers: parseCompact(profileData?.followers ?? null),
      following: null,
      postCount: null,
      impressions: parseCompact(insights?.views ?? null),
      reach: parseCompact(insights?.reach ?? null),
      profileViews: null,
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      videoViews: null,
      recentPosts: [],
    };
  } catch (err) {
    return emptySnapshot('threads', date, String(err));
  }
}

export const meta = { platform: 'threads' as const, handle: HANDLE };
