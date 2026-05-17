import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
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
