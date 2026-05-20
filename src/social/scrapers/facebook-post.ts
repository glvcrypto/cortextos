/**
 * Per-post Facebook metrics scraper.
 *
 * Facebook gates ALL post pages behind login — both the canonical
 * `facebook.com/<pageId>_<postId>` and the embed plugin endpoint route
 * unauthenticated visitors to the login wall. The glv-socials
 * agent-browser session is NOT logged in to Facebook as of writing.
 *
 * This scraper detects the login redirect and returns ok:false with an
 * explicit `auth-required` error. When session auth is set up (or the
 * Graph API path is wired with a page access token), extend this with
 * the post-page DOM selectors or a Graph API call.
 *
 * TODO (Phase 3): Add FB_PAGE_ACCESS_TOKEN env var path that calls
 *   GET /<post-id>?fields=likes.summary(total_count),comments.summary(total_count),shares
 * before falling through to DOM scraping.
 */
import { goto, evaluate, waitFor } from './base.js';
import type { LivePostSnapshot, PostRegistryEntry } from '../types-live.js';
import { emptyLiveSnapshot } from '../types-live.js';

interface DomState {
  url: string;
  unavailable: boolean;
  authWalled: boolean;
}

export async function scrapePost(entry: PostRegistryEntry): Promise<LivePostSnapshot> {
  try {
    await goto(entry.post_url);
    await waitFor('body', 10_000).catch(() => { /* tolerate slow paint */ });

    const state = await evaluate<DomState>(`
      (() => {
        const url = location.href;
        const txt = document.body?.innerText ?? '';
        const authWalled = /\\/login/.test(url) || /Log into Facebook/i.test(txt);
        const unavailable = /no longer available|removed|privacy settings/i.test(txt) && !authWalled;
        return { url, unavailable, authWalled };
      })()
    `);

    if (state?.authWalled) {
      return emptyLiveSnapshot(entry, 'auth-required (glv-socials session not logged in to Facebook)');
    }
    if (state?.unavailable) {
      return emptyLiveSnapshot(entry, 'post not available (deleted, private, or removed)');
    }

    // Once auth lands, replace this block with the real DOM extraction.
    return emptyLiveSnapshot(entry, 'facebook post extraction not yet implemented post-auth');
  } catch (err) {
    return emptyLiveSnapshot(entry, String(err));
  }
}
