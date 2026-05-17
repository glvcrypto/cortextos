import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = '@glvmarketing';
const PROFILE_URL = 'https://x.com/glvmarketing';
const ANALYTICS_URL = 'https://analytics.twitter.com/user/glvmarketing/home';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    await goto(PROFILE_URL);

    const profileData = await evaluate<{ followers: string | null; following: string | null }>(`
      (() => {
        // X profile stats bar
        const links = [...document.querySelectorAll('a[href*="/following"], a[href*="/followers"]')];
        const following = links.find(a => a.href.includes('/following'))
          ?.querySelector('span[data-testid]')?.textContent?.trim() ?? null;
        const followers = links.find(a => a.href.includes('/followers'))
          ?.querySelector('span[data-testid]')?.textContent?.trim() ?? null;
        return { followers, following };
      })()
    `);

    // X Analytics (twitter.com analytics) — requires login
    await goto(ANALYTICS_URL);

    const analytics = await evaluate<{
      impressions: string | null;
      engagements: string | null;
      profileVisits: string | null;
    }>(`
      (() => {
        const stats = [...document.querySelectorAll('[class*="summary-stats"] td, [class*="stat-block"]')];
        const get = (label: string) =>
          stats.find(el => el.textContent?.toLowerCase().includes(label))
               ?.nextElementSibling?.textContent?.trim() ?? null;
        return {
          impressions:    get('impression'),
          engagements:    get('engagement'),
          profileVisits:  get('profile visit'),
        };
      })()
    `);

    return {
      date,
      platform: 'x',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers: parseCompact(profileData?.followers ?? null),
      following: parseCompact(profileData?.following ?? null),
      postCount: null,
      impressions: parseCompact(analytics?.impressions ?? null),
      reach: null,
      profileViews: parseCompact(analytics?.profileVisits ?? null),
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      videoViews: null,
      recentPosts: [],
    };
  } catch (err) {
    return emptySnapshot('x', date, String(err));
  }
}

export const meta = { platform: 'x' as const, handle: HANDLE };
