/**
 * Per-post Threads metrics scraper.
 *
 * Threads exposes engagement counts in button text on the post page (no auth
 * required). Each action button (Like / Comment / Repost / Share) renders as
 * "<Action><count>" — e.g. "Like848" / "Comment123" / "Repost37" / "Share28".
 * When the count is zero, the button text is just the action name with no
 * trailing digits.
 *
 * Threads has no concept of "views" or "saves" exposed publicly, so both
 * return null.
 */
import { goto, evaluate, parseCompact, waitFor } from './base.js';
import type { LivePostSnapshot, PostRegistryEntry } from '../types-live.js';
import { emptyLiveSnapshot } from '../types-live.js';

interface DomCounts {
  likeText: string | null;
  commentText: string | null;
  repostText: string | null;
  shareText: string | null;
  unavailable: boolean;
}

function extractCount(buttonText: string | null, action: string): number | null {
  if (!buttonText) return null;
  const m = buttonText.match(new RegExp(`^${action}([\\d.,KMB]*)$`, 'i'));
  if (!m) return null;
  const raw = m[1].trim();
  if (!raw) return 0;
  return parseCompact(raw);
}

export async function scrapePost(entry: PostRegistryEntry): Promise<LivePostSnapshot> {
  try {
    await goto(entry.post_url);
    await waitFor('[role="button"]', 15_000).catch(() => { /* tolerate slow paint */ });

    const counts = await evaluate<DomCounts>(`
      (() => {
        const unavailable = /post.*not.*available|sorry.*page/i.test(document.title ?? '');
        const buttons = Array.from(document.querySelectorAll('[role="button"]')).filter(b => {
          const t = b.textContent?.trim() ?? '';
          return /^(Like|Comment|Repost|Share)/.test(t);
        });
        const firstFour = buttons.slice(0, 4).map(b => b.textContent?.trim() ?? null);
        return {
          likeText: firstFour[0] ?? null,
          commentText: firstFour[1] ?? null,
          repostText: firstFour[2] ?? null,
          shareText: firstFour[3] ?? null,
          unavailable,
        };
      })()
    `);

    if (counts?.unavailable) {
      return emptyLiveSnapshot(entry, 'post not available (deleted, private, or removed)');
    }

    return {
      post_id: entry.post_id,
      platform: 'threads',
      post_url: entry.post_url,
      platform_post_id: entry.platform_post_id,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      likes: extractCount(counts?.likeText ?? null, 'Like'),
      comments: extractCount(counts?.commentText ?? null, 'Comment'),
      shares: extractCount(counts?.repostText ?? null, 'Repost'),
      saves: null,
      views: null,
    };
  } catch (err) {
    return emptyLiveSnapshot(entry, String(err));
  }
}
