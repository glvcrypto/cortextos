/**
 * Channel-level live metrics tracker.
 * Invoked by the channel-stats-15m cron (every 15 minutes).
 *
 * Usage: node dist/social/channel-tracker.js [--platform=instagram,x]
 *
 * Writes: orgs/glv/clients/glv-marketing/socials/analytics/live-channels/<platform>.json
 *
 * Lightweight counterpart to the daily social-analytics-scrape: a single
 * profile-page nav per platform, reading only header counts (followers/posts/
 * following). The heavy insights navs stay in the daily scrape.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { LiveChannelSnapshot } from './types-channel.js';
import type { Platform } from './types.js';
import { SESSION } from './scrapers/base.js';
import { startWatchdog } from './watchdog.js';
import { scrapeChannel as scrapeInstagram } from './scrapers/instagram.js';
import { scrapeChannel as scrapeFacebook } from './scrapers/facebook.js';
import { scrapeChannel as scrapeThreads } from './scrapers/threads.js';
import { scrapeChannel as scrapeLinkedin } from './scrapers/linkedin.js';
import { scrapeChannel as scrapeX } from './scrapers/x.js';

const CHANNEL_SCRAPERS: Partial<Record<Platform, () => Promise<LiveChannelSnapshot>>> = {
  instagram: scrapeInstagram,
  facebook: scrapeFacebook,
  threads: scrapeThreads,
  linkedin: scrapeLinkedin,
  x: scrapeX,
};
const SUPPORTED_PLATFORMS = Object.keys(CHANNEL_SCRAPERS) as Platform[];
const SCRAPE_GAP_MS = 5_000;

async function sleep(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

async function run(): Promise<void> {
  // CTX_PROJECT_ROOT is the cortextos repo root (set by the daemon); CTX_ROOT is
  // the per-instance state dir which symlinks `orgs/glv/clients` to the repo,
  // so either resolves to the right location. Plain repo-root path is the final
  // fallback for direct `node dist/...` invocations.
  const projectRoot = process.env.CTX_PROJECT_ROOT
    ?? process.env.CTX_ROOT
    ?? join(homedir(), 'cortextos');
  const outDir = join(
    projectRoot, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials',
    'analytics', 'live-channels',
  );
  mkdirSync(outDir, { recursive: true });

  const platformArg = process.argv.find(a => a.startsWith('--platform='))?.split('=')[1];
  const targets: Platform[] = platformArg
    ? (platformArg.split(',') as Platform[])
    : SUPPORTED_PLATFORMS;

  const targetsSupported = targets.filter(p => SUPPORTED_PLATFORMS.includes(p));
  const skipped = targets.filter(p => !SUPPORTED_PLATFORMS.includes(p));
  if (skipped.length) {
    console.log(`[channel-tracker] skipping unsupported platforms: ${skipped.join(', ')}`);
  }

  console.log(`[channel-tracker] platforms=${targetsSupported.join(',')}`);

  const watchdog = startWatchdog(SESSION);
  let ok = 0, fail = 0;

  for (const platform of targetsSupported) {
    const scraper = CHANNEL_SCRAPERS[platform]!;
    let snapshot: LiveChannelSnapshot;
    try {
      snapshot = await scraper();
    } catch (err) {
      snapshot = {
        platform,
        handle: '',
        scraped_at: new Date().toISOString(),
        ok: false,
        error: String(err),
        followers: null, posts: null, following: null,
      };
    }

    const outFile = join(outDir, `${platform}.json`);
    writeFileSync(outFile, JSON.stringify(snapshot, null, 2));
    if (snapshot.ok) {
      ok++;
      console.log(`[channel-tracker] ${platform}: followers=${snapshot.followers} posts=${snapshot.posts} following=${snapshot.following}`);
    } else {
      fail++;
      console.error(`[channel-tracker] ${platform}: FAILED — ${snapshot.error}`);
    }
    await sleep(SCRAPE_GAP_MS);
  }

  watchdog.stop();
  const sessionStatus = watchdog.getStatus();
  console.log(`[channel-tracker] done — ${ok} ok, ${fail} failed | session=${sessionStatus.state}`);

  if (fail > 0 && ok === 0) process.exitCode = 1;
}

run().catch(err => {
  console.error('[channel-tracker] fatal:', err);
  process.exit(1);
});
