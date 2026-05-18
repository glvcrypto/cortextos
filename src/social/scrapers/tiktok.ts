import { AnalyticsSnapshot, emptySnapshot } from '../types.js';

// TikTok scraping deferred — aggressive rate limiting + CAPTCHA walls make
// automated scraping unreliable. Will revisit when TT rate limit situation
// improves or when TT Business API access is available.
export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  return emptySnapshot('tiktok', date, 'TikTok scraper deferred — rate limiting active');
}

export const meta = { platform: 'tiktok' as const, handle: '@glvmarketing' };
