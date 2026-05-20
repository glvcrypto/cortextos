import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import type { LiveChannelSnapshot } from '../types-channel.js';
import { emptyChannelSnapshot } from '../types-channel.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = 'GLV Marketing';
const PAGE_URL = 'https://www.linkedin.com/company/glv-marketing/';
const ANALYTICS_URL = 'https://www.linkedin.com/company/glv-marketing/admin/analytics/visitors/';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    await goto(PAGE_URL);

    const pageData = await evaluate<{ followers: string | null }>(`
      (() => {
        const el = document.querySelector('[class*="followers"], [data-test-id*="follow-count"]');
        const text = el?.textContent?.trim() ?? null;
        return { followers: text ? text.replace(/[^0-9KM,\.]/g, '') : null };
      })()
    `);

    await goto(ANALYTICS_URL);

    const analytics = await evaluate<{
      visitors: string | null;
      impressions: string | null;
      followers: string | null;
    }>(`
      (() => {
        const cards = [...document.querySelectorAll('[class*="analytics-module__metric"], [class*="insight-card"]')];
        const get = (label: string) =>
          cards.find(c => c.textContent?.toLowerCase().includes(label))
               ?.querySelector('[class*="number"], strong')?.textContent?.trim() ?? null;
        return {
          visitors:    get('visitor'),
          impressions: get('impression'),
          followers:   get('follower'),
        };
      })()
    `);

    return {
      date,
      platform: 'linkedin',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers: parseCompact(analytics?.followers ?? pageData?.followers ?? null),
      following: null,
      postCount: null,
      impressions: parseCompact(analytics?.impressions ?? null),
      reach: null,
      profileViews: parseCompact(analytics?.visitors ?? null),
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      videoViews: null,
      recentPosts: [],
    };
  } catch (err) {
    return emptySnapshot('linkedin', date, String(err));
  }
}

export const meta = { platform: 'linkedin' as const, handle: HANDLE };

/**
 * Lightweight channel snapshot — single page nav, follower count only.
 * LinkedIn company pages often require an authenticated session; when the
 * count can't be read this returns an explicit ok:false snapshot rather
 * than guessing.
 */
export async function scrapeChannel(): Promise<LiveChannelSnapshot> {
  try {
    await goto(PAGE_URL);

    const data = await evaluate<{ followers: string | null; loginWall: boolean }>(`
      (() => {
        const loginWall = /authwall|\\/login|\\/signup/.test(location.href)
          || /Sign Up|Log In/i.test(document.title);
        const el = document.querySelector('[class*="followers"], [data-test-id*="follow-count"]');
        let followers = el?.textContent?.trim() ?? null;
        if (!followers) {
          const m = document.body.innerText.match(/([\\d,.KM]+)\\s*followers/i);
          followers = m?.[1] ?? null;
        }
        return { followers: followers ? followers.replace(/[^0-9KM,.]/g, '') : null, loginWall };
      })()
    `);

    if (data?.loginWall) {
      return emptyChannelSnapshot('linkedin', HANDLE, 'page behind login wall — authenticated session required');
    }

    const followers = parseCompact(data?.followers ?? null);
    if (followers === null) {
      return emptyChannelSnapshot('linkedin', HANDLE, 'follower count not found (login wall or layout change)');
    }

    return {
      platform: 'linkedin',
      handle: HANDLE,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      posts: null,
      following: null,
    };
  } catch (err) {
    return emptyChannelSnapshot('linkedin', HANDLE, String(err));
  }
}
