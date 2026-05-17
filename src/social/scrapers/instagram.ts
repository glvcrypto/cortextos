import { AnalyticsSnapshot, PostMetric, emptySnapshot } from '../types.js';
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
