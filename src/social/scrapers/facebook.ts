import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import type { LiveChannelSnapshot } from '../types-channel.js';
import { emptyChannelSnapshot } from '../types-channel.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = 'GLV Marketing';
const PAGE_URL = 'https://www.facebook.com/glvmarketing';
const INSIGHTS_URL = 'https://www.facebook.com/glvmarketing/insights';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    await goto(PAGE_URL);

    const pageData = await evaluate<{ likes: string | null; followers: string | null }>(`
      (() => {
        // FB page header: "X likes · Y followers"
        const text = document.body.innerText;
        const likesM  = text.match(/([\d,\.KM]+)\s*(?:people\s+)?like/i);
        const followM = text.match(/([\d,\.KM]+)\s*(?:people\s+)?follow/i);
        return {
          likes:     likesM?.[1]  ?? null,
          followers: followM?.[1] ?? null,
        };
      })()
    `);

    // Facebook Insights requires admin access to the page
    await goto(INSIGHTS_URL);

    const insights = await evaluate<{ reach: string | null; impressions: string | null }>(`
      (() => {
        const cards = [...document.querySelectorAll('[class*="insight"], [class*="metric"]')];
        const get = (label: string) =>
          cards.find(c => c.textContent?.toLowerCase().includes(label))
               ?.querySelector('[class*="value"], strong')?.textContent?.trim() ?? null;
        return { reach: get('reach'), impressions: get('impression') };
      })()
    `);

    return {
      date,
      platform: 'facebook',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers: parseCompact(pageData?.followers ?? null),
      following: null,
      postCount: null,
      impressions: parseCompact(insights?.impressions ?? null),
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
    return emptySnapshot('facebook', date, String(err));
  }
}

export const meta = { platform: 'facebook' as const, handle: HANDLE };

/**
 * Lightweight channel snapshot — single page nav, follower count only.
 * FB pages frequently sit behind a login wall for unauthenticated sessions;
 * when the count can't be read this returns an explicit ok:false snapshot
 * rather than guessing.
 */
export async function scrapeChannel(): Promise<LiveChannelSnapshot> {
  try {
    await goto(PAGE_URL);

    const data = await evaluate<{ followers: string | null; loginWall: boolean }>(`
      (() => {
        const loginWall = /\\/login/.test(location.href) || /^Facebook$/.test(document.title.trim());
        const text = document.body.innerText;
        const followM = text.match(/([\\d,.KM]+)\\s*(?:people\\s+)?follow/i);
        return { followers: followM?.[1] ?? null, loginWall };
      })()
    `);

    if (data?.loginWall) {
      return emptyChannelSnapshot('facebook', HANDLE, 'page behind login wall — authenticated session required');
    }

    const followers = parseCompact(data?.followers ?? null);
    if (followers === null) {
      return emptyChannelSnapshot('facebook', HANDLE, 'follower count not found (login wall or layout change)');
    }

    return {
      platform: 'facebook',
      handle: HANDLE,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      posts: null,
      following: null,
    };
  } catch (err) {
    return emptyChannelSnapshot('facebook', HANDLE, String(err));
  }
}
