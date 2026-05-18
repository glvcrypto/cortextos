/**
 * Social analytics daily scrape entry point.
 * Invoked by the social-analytics-scrape cron (daily at 06:00 UTC).
 *
 * Usage: node dist/social/scrape.js [--platform=instagram,youtube,...]
 *
 * Writes: orgs/glv/clients/glv-marketing/socials/analytics/<platform>/YYYY-MM-DD.json
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import type { Platform } from './types.js';
import { PLATFORMS, emptySnapshot } from './types.js';

async function run(): Promise<void> {
  const date = new Date().toISOString().split('T')[0];
  const ctxRoot = process.env.CTX_ROOT ?? join(homedir(), '.cortextos', 'default');
  const analyticsBase = join(
    ctxRoot, '..', '..', 'orgs', 'glv', 'clients', 'glv-marketing', 'socials', 'analytics',
  );

  // Parse optional --platform filter
  const platformArg = process.argv.find(a => a.startsWith('--platform='))?.split('=')[1];
  const targets: Platform[] = platformArg
    ? (platformArg.split(',') as Platform[])
    : PLATFORMS;

  console.log(`[social-scrape] ${date} — platforms: ${targets.join(', ')}`);

  const results: Record<string, boolean> = {};

  for (const platform of targets) {
    const outDir = join(analyticsBase, platform);
    const outFile = join(outDir, `${date}.json`);
    mkdirSync(outDir, { recursive: true });

    try {
      // Dynamic import so we only load scrapers we need
      const mod = await import(`./scrapers/${platform}.js`);
      const snapshot = await (mod.scrape as (d: string) => Promise<unknown>)(date);
      writeFileSync(outFile, JSON.stringify(snapshot, null, 2));
      results[platform] = true;
      console.log(`[social-scrape] ${platform}: ok — ${outFile}`);
    } catch (err) {
      const snapshot = emptySnapshot(platform, date, String(err));
      writeFileSync(outFile, JSON.stringify(snapshot, null, 2));
      results[platform] = false;
      console.error(`[social-scrape] ${platform}: FAILED — ${err}`);
    }
  }

  const ok = Object.values(results).filter(Boolean).length;
  const fail = Object.values(results).filter(r => !r).length;
  console.log(`[social-scrape] done — ${ok} ok, ${fail} failed`);

  if (fail > 0) process.exitCode = 1;
}

run().catch(err => {
  console.error('[social-scrape] fatal:', err);
  process.exit(1);
});
