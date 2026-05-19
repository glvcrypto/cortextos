/**
 * Per-post Instagram metrics scraper.
 *
 * Distinct from ./instagram.ts (profile/daily snapshot). This scrapes a
 * SINGLE post URL via the authenticated agent-browser session "glv-socials"
 * and returns visible engagement counts: likes, comments, views.
 *
 * Primary extraction path is the `og:description` meta tag, which IG renders
 * server-side and is available even on the unauthenticated login-wall variant.
 * Format observed: "N likes, M comments - <author> on <date>: <caption>"
 * (videos/reels may include "X views" before "likes" or in place of it).
 *
 * Saves: shares and saves are NOT exposed publicly for non-author viewers —
 * both return null. Author-side scraping (Insights panel) is a Phase 3 add-on.
 */
import { goto, evaluate, parseCompact, waitFor } from './base.js';
import type { LivePostSnapshot, PostRegistryEntry } from '../types-live.js';
import { emptyLiveSnapshot } from '../types-live.js';

interface DomCounts {
  likesText: string | null;
  commentsText: string | null;
  viewsText: string | null;
  ogDescription: string | null;
  unavailable: boolean;
}

/** Parse "1.2k" / "12,345" / "No" → number | null. "No" → 0 (IG writes "No likes" for zero). */
function parseCount(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^no$/i.test(trimmed)) return 0;
  return parseCompact(trimmed);
}

export async function scrapePost(entry: PostRegistryEntry): Promise<LivePostSnapshot> {
  try {
    await goto(entry.post_url);
    await waitFor('meta[property="og:description"]', 15_000).catch(() => { /* tolerate slow paint */ });

    const counts = await evaluate<DomCounts>(`
      (() => {
        const og = document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? null;
        const unavailable = /isn['\\u2019]t available/i.test(document.title ?? '');

        // og:description format: "N likes, M comments - <author> on <date>: <caption>"
        // Reels sometimes include "X views" — pattern: "X views, N likes, M comments - ..."
        let likes = null, comments = null, views = null;
        if (og) {
          const likeMatch = og.match(/([\\d,.]+|No)\\s+likes?/i);
          if (likeMatch) likes = likeMatch[1];
          const commentMatch = og.match(/([\\d,.]+|No)\\s+comments?/i);
          if (commentMatch) comments = commentMatch[1];
          const viewMatch = og.match(/([\\d,.]+|No)\\s+(?:views?|plays?)/i);
          if (viewMatch) views = viewMatch[1];
        }

        // Fallback: scan body text for the same patterns (covers logged-in DOM variant).
        if (!likes || !comments) {
          const txt = document.body?.innerText ?? '';
          const matchN = (re) => {
            const m = txt.match(re);
            return m ? m[1] : null;
          };
          if (!likes) likes = matchN(/([\\d,.]+)\\s+likes?/i);
          if (!comments) {
            comments = matchN(/View all ([\\d,.]+) comments?/i)
              ?? matchN(/([\\d,.]+) comments?/i);
          }
          if (!views) {
            views = matchN(/([\\d,.]+)\\s+views?/i)
              ?? matchN(/([\\d,.]+)\\s+plays?/i);
          }
        }

        return { likesText: likes, commentsText: comments, viewsText: views, ogDescription: og, unavailable };
      })()
    `);

    if (counts?.unavailable) {
      return emptyLiveSnapshot(entry, 'post not available (deleted, private, or removed)');
    }

    return {
      post_id: entry.post_id,
      platform: 'instagram',
      post_url: entry.post_url,
      platform_post_id: entry.platform_post_id,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      likes: parseCount(counts?.likesText ?? null),
      comments: parseCount(counts?.commentsText ?? null),
      shares: null,
      saves: null,
      views: parseCount(counts?.viewsText ?? null),
    };
  } catch (err) {
    return emptyLiveSnapshot(entry, String(err));
  }
}
