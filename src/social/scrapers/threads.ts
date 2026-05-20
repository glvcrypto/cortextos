import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import type { LiveChannelSnapshot } from '../types-channel.js';
import { emptyChannelSnapshot } from '../types-channel.js';
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

/**
 * Lightweight channel snapshot — single profile-page nav, header counts only.
 * Used by the 15-min channel-stats cron (see channel-tracker.ts).
 *
 * Primary path is the og:description meta tag, rendered server-side. Observed
 * format: "0 Followers • 4 Threads • <bio>". The body-text scan is a fallback.
 */
export async function scrapeChannel(): Promise<LiveChannelSnapshot> {
  try {
    await goto(PROFILE_URL);

    const data = await evaluate<{ followers: string | null; posts: string | null }>(`
      (() => {
        const og = document.querySelector('meta[property="og:description"]')?.getAttribute('content')
          ?? document.querySelector('meta[name="description"]')?.getAttribute('content')
          ?? '';
        const fM = og.match(/([\\d,.KM]+)\\s+Followers/i);
        const pM = og.match(/([\\d,.KM]+)\\s+Threads/i);
        let followers = fM ? fM[1] : null;
        let posts = pM ? pM[1] : null;
        if (!followers) {
          const bM = document.body.innerText.match(/([\\d,.KM]+)\\s*follower/i);
          followers = bM ? bM[1] : null;
        }
        return { followers, posts };
      })()
    `);

    const followers = parseCompact(data?.followers ?? null);
    if (followers === null) {
      return emptyChannelSnapshot('threads', HANDLE, 'follower count not found (login wall or layout change)');
    }

    return {
      platform: 'threads',
      handle: HANDLE,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      posts: parseCompact(data?.posts ?? null),
      following: null,
    };
  } catch (err) {
    return emptyChannelSnapshot('threads', HANDLE, String(err));
  }
}
