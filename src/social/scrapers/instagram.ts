import { AnalyticsSnapshot, PostMetric, emptySnapshot } from '../types.js';
import type { LiveChannelSnapshot } from '../types-channel.js';
import { emptyChannelSnapshot } from '../types-channel.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = '@glv.marketing';
const PROFILE_URL = 'https://www.instagram.com/glv.marketing/';
const INSIGHTS_URL = 'https://www.instagram.com/glv.marketing/insights/';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    await goto(PROFILE_URL);

    // Extract follower/following/post counts from the profile header
    const profile = await evaluate<{ followers: string; following: string; posts: string }>(`
      (() => {
        const stats = document.querySelectorAll('header section ul li');
        if (!stats.length) return null;
        return {
          posts:     stats[0]?.querySelector('span[title], span > span')?.textContent?.trim() ?? null,
          followers: stats[1]?.querySelector('span[title], span > span')?.getAttribute('title') ??
                     stats[1]?.querySelector('span[title], span > span')?.textContent?.trim() ?? null,
          following: stats[2]?.querySelector('span[title], span > span')?.textContent?.trim() ?? null,
        };
      })()
    `);

    const followers = parseCompact(profile?.followers ?? null);
    const following = parseCompact(profile?.following ?? null);
    const postCount = parseCompact(profile?.posts ?? null);

    // Navigate to insights for engagement metrics (requires Creator/Business account)
    await goto(INSIGHTS_URL);

    const insights = await evaluate<{
      reach: string | null;
      impressions: string | null;
      profileViews: string | null;
    }>(`
      (() => {
        // IG insights DOM: summary cards at top of overview
        const cards = [...document.querySelectorAll('[class*="InsightCard"], [class*="insight-card"]')];
        const get = (label: string) =>
          cards.find(c => c.textContent?.toLowerCase().includes(label))
               ?.querySelector('[class*="value"], strong, [class*="number"]')
               ?.textContent?.trim() ?? null;
        return {
          reach:        get('reach'),
          impressions:  get('impression'),
          profileViews: get('profile visit'),
        };
      })()
    `);

    // Scrape recent posts grid from profile
    await goto(PROFILE_URL);
    const recentPosts = await evaluate<PostMetric[]>(`
      (() => {
        const links = [...document.querySelectorAll('article a[href*="/p/"], article a[href*="/reel/"]')]
          .slice(0, 12);
        return links.map(a => ({
          id:       a.href.split('/').filter(Boolean).pop() ?? '',
          url:      a.href,
          date:     null,
          type:     a.href.includes('/reel/') ? 'reel' : 'image',
          caption:  a.querySelector('img')?.alt ?? null,
          likes:    null,
          comments: null,
          shares:   null,
          saves:    null,
          views:    null,
          reach:    null,
        }));
      })()
    `);

    return {
      date,
      platform: 'instagram',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      following,
      postCount,
      impressions: parseCompact(insights?.impressions ?? null),
      reach: parseCompact(insights?.reach ?? null),
      profileViews: parseCompact(insights?.profileViews ?? null),
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      videoViews: null,
      recentPosts: recentPosts ?? [],
    };
  } catch (err) {
    return emptySnapshot('instagram', date, String(err));
  }
}

export const meta = { platform: 'instagram' as const, handle: HANDLE };

/**
 * Lightweight channel snapshot — single profile-page nav, header counts only.
 * Used by the 15-min channel-stats cron (see channel-tracker.ts).
 *
 * Primary path is the og:description meta tag, which IG renders server-side
 * even on the login-wall variant. Observed format:
 *   "4 Followers, 0 Following, 3 Posts - See Instagram photos and videos..."
 * The header-li DOM is a fallback for when that string format shifts.
 */
export async function scrapeChannel(): Promise<LiveChannelSnapshot> {
  try {
    await goto(PROFILE_URL);

    const profile = await evaluate<{ followers: string | null; following: string | null; posts: string | null }>(`
      (() => {
        const og = document.querySelector('meta[property="og:description"]')?.getAttribute('content')
          ?? document.querySelector('meta[name="description"]')?.getAttribute('content')
          ?? '';
        const m1 = og.match(/([\\d,.KM]+)\\s+Followers/i);
        const m2 = og.match(/([\\d,.KM]+)\\s+Following/i);
        const m3 = og.match(/([\\d,.KM]+)\\s+Posts/i);
        let followers = m1 ? m1[1] : null;
        let following = m2 ? m2[1] : null;
        let posts = m3 ? m3[1] : null;

        if (!followers) {
          const stats = document.querySelectorAll('header section ul li');
          const cell = (el) => el?.querySelector('span[title], span > span')?.getAttribute('title')
            ?? el?.querySelector('span[title], span > span')?.textContent?.trim() ?? null;
          posts = posts ?? cell(stats[0]);
          followers = followers ?? cell(stats[1]);
          following = following ?? cell(stats[2]);
        }
        return { followers, following, posts };
      })()
    `);

    const followers = parseCompact(profile?.followers ?? null);
    if (followers === null) {
      return emptyChannelSnapshot('instagram', HANDLE, 'profile header not found (login wall or layout change)');
    }

    return {
      platform: 'instagram',
      handle: HANDLE,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      posts: parseCompact(profile?.posts ?? null),
      following: parseCompact(profile?.following ?? null),
    };
  } catch (err) {
    return emptyChannelSnapshot('instagram', HANDLE, String(err));
  }
}
