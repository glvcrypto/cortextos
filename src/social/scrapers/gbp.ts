import { AnalyticsSnapshot, emptySnapshot } from '../types.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = 'GLV Marketing';
// GBP performance metrics live in the Business Profile Manager
const GBP_PERFORMANCE_URL = 'https://business.google.com/dashboard/l/';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    // Navigate to GBP dashboard — lists all managed profiles
    await goto('https://business.google.com/locations');

    // Find GLV Marketing profile link
    const profileUrl = await evaluate<string | null>(`
      (() => {
        const links = [...document.querySelectorAll('a[href*="/dashboard/"], a[href*="/locations/"]')];
        const target = links.find(a => a.textContent?.includes('GLV Marketing'));
        return target?.href ?? null;
      })()
    `);

    if (profileUrl) {
      await goto(profileUrl);
    }

    // GBP Performance panel
    const perf = await evaluate<{
      searches: string | null;
      views: string | null;
      calls: string | null;
      directions: string | null;
      websiteClicks: string | null;
    }>(`
      (() => {
        // GBP dashboard metric tiles
        const tiles = [...document.querySelectorAll('[class*="metric-tile"], [class*="performance-stat"], [jscontroller*="stat"]')];
        const get = (label: string) => {
          const t = tiles.find(el => el.textContent?.toLowerCase().includes(label));
          return t?.querySelector('[class*="value"], strong')?.textContent?.trim() ?? null;
        };
        // Also try the overview summary bar
        const summaryNums = [...document.querySelectorAll('[class*="overview-stat"] [class*="number"], [data-stat-value]')]
          .map(el => el.textContent?.trim() ?? null);
        return {
          searches:      get('search') ?? summaryNums[0] ?? null,
          views:         get('view') ?? summaryNums[1] ?? null,
          calls:         get('call') ?? null,
          directions:    get('direction') ?? null,
          websiteClicks: get('website') ?? null,
        };
      })()
    `);

    // For GBP, "followers" maps to total searches (proxy metric for visibility)
    // Profile views are the closest analogue to social followers
    const profileViews = parseCompact(perf?.views ?? null);
    const searches = parseCompact(perf?.searches ?? null);

    return {
      date,
      platform: 'gbp',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers: null,      // GBP has no followers
      following: null,
      postCount: null,
      impressions: searches,
      reach: null,
      profileViews,
      likes: null,
      comments: null,
      shares: parseCompact(perf?.directions ?? null),    // repurpose: direction requests
      saves: parseCompact(perf?.websiteClicks ?? null),  // repurpose: website clicks
      videoViews: null,
      recentPosts: [],      // GBP posts ('Updates') not scraped in v1
    };
  } catch (err) {
    return emptySnapshot('gbp', date, String(err));
  }
}

export const meta = { platform: 'gbp' as const, handle: HANDLE };
