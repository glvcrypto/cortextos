import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import type { LiveChannelSnapshot } from '../types-channel.js';
import { emptyChannelSnapshot } from '../types-channel.js';
import { goto, evaluate, parseCompact, waitFor } from './base.js';

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

/**
 * Lightweight channel snapshot — single profile-page nav, header counts only.
 * Used by the 15-min channel-stats cron (see channel-tracker.ts).
 */
export async function scrapeChannel(): Promise<LiveChannelSnapshot> {
  try {
    await goto(PROFILE_URL);
    // X is a client-rendered SPA — the follower links paint after `open`
    // resolves. Tolerate a timeout (login wall has no such links).
    await waitFor('a[href*="follow"]', 12_000).catch(() => { /* tolerate */ });

    const data = await evaluate<{ followers: string | null; following: string | null }>(`
      (() => {
        const links = [...document.querySelectorAll('a[href*="follow"]')];
        // X renders the count as "<n> Followers" / "<n> Following" — grab the
        // leading compact-number token so parseCompact gets a clean value.
        const pick = (re) => {
          const a = links.find(l => re.test(l.getAttribute('href') ?? ''));
          const t = a?.textContent?.trim() ?? '';
          const m = t.match(/^([\\d,.]+[KMB]?)/i);
          return m ? m[1] : null;
        };
        return {
          followers: pick(/\\/(verified_)?followers\\/?$/),
          following: pick(/\\/following\\/?$/),
        };
      })()
    `);

    const followers = parseCompact(data?.followers ?? null);
    if (followers === null) {
      return emptyChannelSnapshot('x', HANDLE, 'follower count not found (login wall or layout change)');
    }

    return {
      platform: 'x',
      handle: HANDLE,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      posts: null,
      following: parseCompact(data?.following ?? null),
    };
  } catch (err) {
    return emptyChannelSnapshot('x', HANDLE, String(err));
  }
}
