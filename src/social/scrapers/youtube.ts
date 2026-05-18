import { AnalyticsSnapshot, PostMetric, emptySnapshot } from '../types.js';
import { goto, evaluate, parseCompact } from './base.js';

const HANDLE = '@glvmarketing';
const CHANNEL_URL = 'https://www.youtube.com/@glvmarketing';
const STUDIO_URL = 'https://studio.youtube.com/channel/content';
const ANALYTICS_URL = 'https://studio.youtube.com/channel/analytics/tab-overview';

export async function scrape(date: string): Promise<AnalyticsSnapshot> {
  try {
    // Channel public page — subscribers + video count
    await goto(CHANNEL_URL);

    const channelData = await evaluate<{ subscribers: string; videoCount: string }>(`
      (() => {
        const subEl = document.querySelector('#subscriber-count, yt-formatted-string#subscriber-count');
        const vidEl = document.querySelector('#videos-count, [class*="tab-content"]');
        return {
          subscribers: subEl?.textContent?.trim() ?? null,
          videoCount:  vidEl?.textContent?.replace(/[^0-9KM.]/g, '') ?? null,
        };
      })()
    `);

    const followers = parseCompact(channelData?.subscribers ?? null);
    const postCount = parseCompact(channelData?.videoCount ?? null);

    // YouTube Studio analytics — requires login
    await goto(ANALYTICS_URL);

    const analytics = await evaluate<{
      views: string | null;
      watchTime: string | null;
      subscribers: string | null;
      impressions: string | null;
    }>(`
      (() => {
        // YT Studio overview cards
        const cards = [...document.querySelectorAll('ytcp-analytics-overview-card, [class*="analytics-card"]')];
        const getCard = (label: string) => {
          const c = cards.find(el => el.textContent?.toLowerCase().includes(label));
          return c?.querySelector('[class*="metric-value"], .scalar-value')?.textContent?.trim() ?? null;
        };
        return {
          views:       getCard('view'),
          watchTime:   getCard('watch time'),
          subscribers: getCard('subscriber'),
          impressions: getCard('impression'),
        };
      })()
    `);

    // Recent videos from Studio content tab
    await goto(STUDIO_URL);
    const recentVideos = await evaluate<PostMetric[]>(`
      (() => {
        const rows = [...document.querySelectorAll('ytcp-video-row, [class*="video-row"]')].slice(0, 10);
        return rows.map((row, i) => {
          const titleEl = row.querySelector('[class*="video-title"] a, ytcp-ve a');
          const statsEls = [...row.querySelectorAll('[class*="video-analytics"], [class*="metric"]')];
          const getStat = (idx: number) => statsEls[idx]?.textContent?.trim() ?? null;
          return {
            id:       titleEl?.getAttribute('href')?.split('/').pop() ?? String(i),
            url:      titleEl?.getAttribute('href') ?? null,
            date:     null,
            type:     'video' as const,
            caption:  titleEl?.textContent?.trim() ?? null,
            views:    null,
            likes:    null,
            comments: getStat(2),
            shares:   null,
            saves:    null,
            reach:    null,
          };
        });
      })()
    `);

    return {
      date,
      platform: 'youtube',
      scrapedAt: new Date().toISOString(),
      ok: true,
      error: null,
      followers,
      following: null,
      postCount,
      impressions: parseCompact(analytics?.impressions ?? null),
      reach: null,
      profileViews: null,
      likes: null,
      comments: null,
      shares: null,
      saves: null,
      videoViews: parseCompact(analytics?.views ?? null),
      recentPosts: recentVideos ?? [],
    };
  } catch (err) {
    return emptySnapshot('youtube', date, String(err));
  }
}

export const meta = { platform: 'youtube' as const, handle: HANDLE };
