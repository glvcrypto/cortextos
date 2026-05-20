/**
 * Per-post live metrics tracker.
 * Invoked by the post-tracker-15m cron (every 15 minutes).
 *
 * Usage: node dist/social/post-tracker.js [--platform=instagram]
 *
 * Reads:  orgs/glv/clients/glv-marketing/socials/posts-registry.json
 * Writes: orgs/glv/clients/glv-marketing/socials/analytics/live/<platform>/<platform_post_id>.json
 *
 * Phase 1 ships instagram only. FB/Threads/LinkedIn/X scrapers land in Phase 2.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { PostRegistry, LivePostSnapshot } from './types-live.js';
import type { Platform } from './types.js';
import { SESSION } from './scrapers/base.js';
import { startWatchdog } from './watchdog.js';
import { scrapePost as scrapeInstagramPost } from './scrapers/instagram-post.js';

const SUPPORTED_PLATFORMS: Platform[] = ['instagram'];
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
  const clientBase = join(
    projectRoot, 'orgs', 'glv', 'clients', 'glv-marketing', 'socials',
  );
  const registryPath = join(clientBase, 'posts-registry.json');
  const liveBase = join(clientBase, 'analytics', 'live');

  if (!existsSync(registryPath)) {
    console.error(`[post-tracker] no registry at ${registryPath}`);
    process.exit(1);
  }

  const registry = JSON.parse(readFileSync(registryPath, 'utf-8')) as PostRegistry;

  const platformArg = process.argv.find(a => a.startsWith('--platform='))?.split('=')[1];
  const targets: Platform[] = platformArg
    ? (platformArg.split(',') as Platform[])
    : SUPPORTED_PLATFORMS;

  const targetsSupported = targets.filter(p => SUPPORTED_PLATFORMS.includes(p));
  const skipped = targets.filter(p => !SUPPORTED_PLATFORMS.includes(p));
  if (skipped.length) {
    console.log(`[post-tracker] skipping unsupported platforms (Phase 1): ${skipped.join(', ')}`);
  }

  console.log(`[post-tracker] platforms=${targetsSupported.join(',')} registry-size=${registry.posts.length}`);

  const watchdog = startWatchdog(SESSION);
  let ok = 0, fail = 0;

  for (const platform of targetsSupported) {
    const posts = registry.posts.filter(p => p.platform === platform);
    const outDir = join(liveBase, platform);
    mkdirSync(outDir, { recursive: true });

    for (const entry of posts) {
      let snapshot: LivePostSnapshot;
      try {
        if (platform === 'instagram') {
          snapshot = await scrapeInstagramPost(entry);
        } else {
          throw new Error(`unsupported platform ${platform}`);
        }
      } catch (err) {
        snapshot = {
          post_id: entry.post_id,
          platform,
          post_url: entry.post_url,
          platform_post_id: entry.platform_post_id,
          scraped_at: new Date().toISOString(),
          ok: false,
          error: String(err),
          likes: null, comments: null, shares: null, saves: null, views: null,
          thumbnail_url: null, caption: null,
        };
      }

      const outFile = join(outDir, `${entry.platform_post_id}.json`);
      writeFileSync(outFile, JSON.stringify(snapshot, null, 2));
      if (snapshot.ok) {
        ok++;
        console.log(`[post-tracker] ${platform}/${entry.platform_post_id}: likes=${snapshot.likes} comments=${snapshot.comments} views=${snapshot.views}`);
      } else {
        fail++;
        console.error(`[post-tracker] ${platform}/${entry.platform_post_id}: FAILED — ${snapshot.error}`);
      }
      await sleep(SCRAPE_GAP_MS);
    }
  }

  watchdog.stop();
  const sessionStatus = watchdog.getStatus();
  console.log(`[post-tracker] done — ${ok} ok, ${fail} failed | session=${sessionStatus.state}`);

  if (fail > 0 && ok === 0) process.exitCode = 1;
}

run().catch(err => {
  console.error('[post-tracker] fatal:', err);
  process.exit(1);
});
