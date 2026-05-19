/**
 * Per-post Instagram metrics scraper.
 *
 * Distinct from ./instagram.ts (profile/daily snapshot). This scrapes a
 * SINGLE post URL via the authenticated agent-browser session "glv-socials"
 * and returns visible engagement counts: likes, comments, views.
 *
 * Saves: shares and saves are NOT exposed in IG's public-DOM for non-author
 * viewers — both return null for now. Author-side scraping (via Insights
 * panel per post) is a Phase 3 add-on.
 */
import { goto, evaluate, parseCompact, waitFor } from './base.js';
import type { LivePostSnapshot, PostRegistryEntry } from '../types-live.js';
import { emptyLiveSnapshot } from '../types-live.js';

interface DomCounts {
  likesText: string | null;
  commentsText: string | null;
  viewsText: string | null;
}

export async function scrapePost(entry: PostRegistryEntry): Promise<LivePostSnapshot> {
  try {
    await goto(entry.post_url);
    // Wait for the main article — IG renders the post content here.
    await waitFor('article', 15_000).catch(() => { /* tolerate slow paint */ });

    const counts = await evaluate<DomCounts>(`
      (() => {
        // Helper: scan text content for a "N likes" / "N comments" pattern.
        const txt = document.body?.innerText ?? '';
        const matchN = (re) => {
          const m = txt.match(re);
          return m ? m[1] : null;
        };

        // Likes: anchor pointing to /liked_by/ contains the like count.
        let likes = null;
        const likeAnchor = document.querySelector('a[href*="/liked_by/"]');
        if (likeAnchor) {
          const span = likeAnchor.querySelector('span[title], span > span');
          likes = span?.getAttribute?.('title') ?? span?.textContent?.trim() ?? likeAnchor.textContent?.trim() ?? null;
        }
        // Fallback: "Liked by X and N others" or "N likes" pattern in body text.
        if (!likes) {
          likes = matchN(/([\\d,.]+)\\s+likes?/i);
        }

        // Comments: "View all N comments" / "N comments" pattern.
        let comments = matchN(/View all ([\\d,.]+) comments?/i)
          ?? matchN(/([\\d,.]+) comments?/i);

        // Views: only on reels/videos. "N views" / "N plays" pattern.
        let views = matchN(/([\\d,.]+)\\s+views?/i)
          ?? matchN(/([\\d,.]+)\\s+plays?/i);

        return { likesText: likes, commentsText: comments, viewsText: views };
      })()
    `);

    return {
      post_id: entry.post_id,
      platform: 'instagram',
      post_url: entry.post_url,
      platform_post_id: entry.platform_post_id,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      likes: parseCompact(counts?.likesText ?? null),
      comments: parseCompact(counts?.commentsText ?? null),
      shares: null,
      saves: null,
      views: parseCompact(counts?.viewsText ?? null),
    };
  } catch (err) {
    return emptyLiveSnapshot(entry, String(err));
  }
}
