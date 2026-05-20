/**
 * Per-post LinkedIn metrics scraper.
 *
 * LinkedIn renders the post body via og:description on the public preview
 * but hides engagement counts (reactions, comments, reposts) behind login.
 * The glv-socials agent-browser session is NOT logged in to LinkedIn as of
 * writing — public-DOM extraction yields content but zero engagement
 * numbers.
 *
 * This scraper attempts public-DOM extraction first and detects the
 * empty-counts state to return ok:false with `auth-required`. When session
 * auth (or LinkedIn Marketing API access tokens) is set up, swap in the
 * authenticated-DOM selectors.
 *
 * TODO (Phase 3): Wire LINKEDIN_ACCESS_TOKEN env var with the Marketing
 * Developer Platform `/socialActions/{shareUrn}` endpoint for reactions
 * and comment totals.
 */
import { goto, evaluate, parseCompact, waitFor } from './base.js';
import type { LivePostSnapshot, PostRegistryEntry } from '../types-live.js';
import { emptyLiveSnapshot } from '../types-live.js';

interface DomCounts {
  reactionsText: string | null;
  commentsText: string | null;
  repostsText: string | null;
  ogImage: string | null;
  ogDescription: string | null;
  unavailable: boolean;
  authWalled: boolean;
}

export async function scrapePost(entry: PostRegistryEntry): Promise<LivePostSnapshot> {
  try {
    await goto(entry.post_url);
    await waitFor('body', 10_000).catch(() => { /* tolerate slow paint */ });

    const counts = await evaluate<DomCounts>(`
      (() => {
        const url = location.href;
        const title = document.title ?? '';
        const txt = document.body?.innerText ?? '';
        const unavailable = /post.*not.*available|content.*removed|sign\\s*up/i.test(title);

        // LinkedIn public preview shows the post body but no engagement counts.
        // When numbers ARE visible (authenticated), they appear as:
        //   <N> reactions | <N> comments | <N> reposts
        const matchN = (re) => {
          const m = txt.match(re);
          return m ? m[1] : null;
        };

        const reactionsText = matchN(/([\\d,.]+)\\s+reactions?/i);
        const commentsText = matchN(/([\\d,.]+)\\s+comments?/i);
        const repostsText = matchN(/([\\d,.]+)\\s+reposts?/i);

        const og = document.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? null;
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null;

        const authWalled = !reactionsText && !commentsText && !repostsText;

        return { reactionsText, commentsText, repostsText, ogImage, ogDescription: og, unavailable, authWalled };
      })()
    `);

    if (counts?.unavailable) {
      return emptyLiveSnapshot(entry, 'post not available (deleted, private, or removed)');
    }
    if (counts?.authWalled) {
      return emptyLiveSnapshot(entry, 'auth-required (glv-socials session not logged in to LinkedIn)');
    }

    return {
      post_id: entry.post_id,
      platform: 'linkedin',
      post_url: entry.post_url,
      platform_post_id: entry.platform_post_id,
      scraped_at: new Date().toISOString(),
      ok: true,
      error: null,
      likes: parseCompact(counts?.reactionsText ?? null),
      comments: parseCompact(counts?.commentsText ?? null),
      shares: parseCompact(counts?.repostsText ?? null),
      saves: null,
      views: null,
      thumbnail_url: counts?.ogImage ?? null,
      caption: counts?.ogDescription ?? null,
    };
  } catch (err) {
    return emptyLiveSnapshot(entry, String(err));
  }
}
