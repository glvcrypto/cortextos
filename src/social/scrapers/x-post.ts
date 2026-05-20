/**
 * Per-post X (Twitter) metrics scraper.
 *
 * X exposes engagement counts in aria-labels on the post page (no auth
 * required). Format observed:
 *   "N Replies. Reply"      → comments
 *   "N reposts. Repost"     → shares
 *   "N Likes. Like"         → likes
 *   "N Bookmarks. Bookmark" → saves
 *   "N view"                → views
 *
 * When the post is unavailable, the page title typically reads "Post" with
 * no author or "This post is from a suspended account" / "Post not found".
 */
import { goto, evaluate, parseCompact, waitFor } from './base.js';
import type { LivePostSnapshot, PostRegistryEntry } from '../types-live.js';
import { emptyLiveSnapshot } from '../types-live.js';

interface DomCounts {
  replies: string | null;
  reposts: string | null;
  likes: string | null;
  bookmarks: string | null;
  views: string | null;
  ogImage: string | null;
  ogDescription: string | null;
  unavailable: boolean;
}

function parseAriaCount(label: string | null): number | null {
  if (!label) return null;
  const m = label.match(/^([\d,.]+[KMB]?)/i);
  if (!m) return null;
  return parseCompact(m[1]);
}

export async function scrapePost(entry: PostRegistryEntry): Promise<LivePostSnapshot> {
  try {
    await goto(entry.post_url);
    await waitFor('article', 15_000).catch(() => { /* tolerate slow paint */ });

    const counts = await evaluate<DomCounts>(`
      (() => {
        const title = document.title ?? '';
        const unavailable = /post.*not.*(found|available)|suspended.*account|hmm.*page/i.test(title);

        const og = document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? null;
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null;

        const labels = Array.from(document.querySelectorAll('[aria-label]'))
          .map(el => el.getAttribute('aria-label'))
          .filter(l => l && /\\d/.test(l));

        const find = (re) => labels.find(l => re.test(l)) ?? null;

        return {
          replies: find(/replies?\\.?\\s*Reply/i),
          reposts: find(/reposts?\\.?\\s*Repost/i),
          likes: find(/likes?\\.?\\s*Like/i),
          bookmarks: find(/bookmarks?\\.?\\s*Bookmark/i),
          views: find(/views?$/i) ?? find(/\\bview\\b/i),
          ogImage,
          ogDescription: og,
          unavailable,
        };
      })()
    `);

    if (counts?.unavailable) {
      return emptyLiveSnapshot(entry, 'post not available (deleted, suspended, or removed)');
    }

    return {
      post_id: entry.post_id,
      platform: entry.platform,
      post_url: entry.post_url,
      platform_post_id: entry.platform_post_id,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      likes: parseAriaCount(counts?.likes ?? null),
      comments: parseAriaCount(counts?.replies ?? null),
      shares: parseAriaCount(counts?.reposts ?? null),
      saves: parseAriaCount(counts?.bookmarks ?? null),
      views: parseAriaCount(counts?.views ?? null),
      thumbnail_url: counts?.ogImage ?? null,
      caption: counts?.ogDescription ?? null,
    };
  } catch (err) {
    return emptyLiveSnapshot(entry, String(err));
  }
}
