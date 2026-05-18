import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { execFile } from 'child_process';
import type { Platform, AnalyticsSnapshot } from './types.js';
import { PLATFORMS } from './types.js';

const GLV_CATEGORIES = [
  'Marketing', 'SEO', 'Email Marketing', 'Paid Ad Strategy',
  'Website Building', 'Claude Code for GLV', 'Local SEO & GBP',
  'AI Integration for SMBs', 'Lead Gen & Cold Outreach',
] as const;

interface ScheduledPost {
  id?: string;
  platform?: string;
  caption?: string;
  category?: string;
  status?: string;
  scheduledAt?: string;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  saves?: number | null;
}

interface PlatformStats {
  platform: Platform;
  followersStart: number | null;
  followersEnd: number | null;
  impressions: number;
  reach: number;
  scheduled: number;
  shipped: number;
  bestPost: { caption: string; engagement: number; date: string } | null;
  totalComments: number;
  totalEngagement: number;
  followersEndForRate: number | null;
}

function prevMonday(ref: Date): string {
  const d = new Date(ref);
  const day = d.getUTCDay();
  const daysBack = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - daysBack - 7);
  return d.toISOString().split('T')[0];
}

function weekDates(monday: string): string[] {
  const dates: string[] = [];
  const base = new Date(monday + 'T00:00:00Z');
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function readSnapshot(analyticsBase: string, platform: Platform, date: string): AnalyticsSnapshot | null {
  const p = join(analyticsBase, platform, `${date}.json`);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as AnalyticsSnapshot;
  } catch {
    return null;
  }
}

function readScheduledPosts(scheduledBase: string, date: string): ScheduledPost[] {
  const dir = join(scheduledBase, date);
  if (!existsSync(dir)) return [];
  const posts: ScheduledPost[] = [];
  for (const platform of PLATFORMS) {
    const p = join(dir, `${platform}.json`);
    if (!existsSync(p)) continue;
    try {
      const data = JSON.parse(readFileSync(p, 'utf8'));
      const items: ScheduledPost[] = Array.isArray(data) ? data : [data];
      posts.push(...items);
    } catch {
      // skip malformed files
    }
  }
  return posts;
}

function sum(...vals: (number | null | undefined)[]): number {
  return vals.reduce<number>((acc, v) => acc + (v ?? 0), 0);
}

function platformSlug(platform: Platform): string {
  return platform;
}

function buildPlatformStats(
  analyticsBase: string,
  scheduledBase: string,
  platform: Platform,
  dates: string[],
): PlatformStats {
  const snapshots = dates.map(d => readSnapshot(analyticsBase, platform, d)).filter(Boolean) as AnalyticsSnapshot[];

  const followersStart = snapshots.length > 0 ? snapshots[0].followers : null;
  const followersEnd = snapshots.length > 0 ? snapshots[snapshots.length - 1].followers : null;
  const impressions = snapshots.reduce((acc, s) => acc + (s.impressions ?? 0), 0);
  const reach = snapshots.reduce((acc, s) => acc + (s.reach ?? 0), 0);
  const totalComments = snapshots.reduce((acc, s) => acc + (s.comments ?? 0), 0);

  let bestPost: PlatformStats['bestPost'] = null;
  for (const s of snapshots) {
    for (const post of s.recentPosts) {
      const eng = sum(post.likes, post.comments, post.shares, post.saves);
      if (!bestPost || eng > bestPost.engagement) {
        bestPost = {
          caption: (post.caption ?? '').slice(0, 80),
          engagement: eng,
          date: post.date,
        };
      }
    }
  }

  let scheduled = 0;
  let shipped = 0;
  for (const date of dates) {
    const allPosts = readScheduledPosts(scheduledBase, date);
    const mine = allPosts.filter(p => !p.platform || p.platform === platformSlug(platform));
    scheduled += mine.length;
    shipped += mine.filter(p => p.status === 'posted').length;
  }

  const totalEngagement = snapshots.reduce(
    (acc, s) => acc + sum(s.likes, s.comments, s.shares, s.saves),
    0,
  );

  return {
    platform,
    followersStart,
    followersEnd,
    impressions,
    reach,
    scheduled,
    shipped,
    bestPost,
    totalComments,
    totalEngagement,
    followersEndForRate: followersEnd,
  };
}

function buildCategoryBalance(scheduledBase: string, dates: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of GLV_CATEGORIES) counts[cat] = 0;
  for (const date of dates) {
    for (const post of readScheduledPosts(scheduledBase, date)) {
      const cat = post.category;
      if (cat && cat in counts) counts[cat]++;
    }
  }
  return counts;
}

function buildRecommendations(
  stats: PlatformStats[],
  categoryBalance: Record<string, number>,
): string[] {
  const recs: string[] = [];

  const withComments = stats.filter(s => s.totalComments > 0).map(s => s.platform);
  if (withComments.length > 0) {
    recs.push(`Review and respond to comments on: ${withComments.join(', ')}.`);
  }

  const zeroCats = Object.entries(categoryBalance)
    .filter(([, n]) => n === 0)
    .map(([cat]) => cat);
  if (zeroCats.length > 0) {
    recs.push(`No posts this week in: ${zeroCats.slice(0, 3).join(', ')}. Consider adding content.`);
  }

  const best = stats
    .filter(s => s.followersEndForRate && s.followersEndForRate > 0)
    .sort((a, b) => {
      const rateA = (a.totalEngagement / (a.followersEndForRate ?? 1));
      const rateB = (b.totalEngagement / (b.followersEndForRate ?? 1));
      return rateB - rateA;
    })[0];
  if (best) {
    recs.push(`Top engagement rate this week: ${best.platform}. Prioritize content here next week.`);
  }

  return recs.slice(0, 3);
}

function formatDelta(start: number | null, end: number | null): string {
  if (start === null || end === null) return 'n/a';
  const d = end - start;
  return d >= 0 ? `+${d}` : String(d);
}

function buildMarkdown(monday: string, stats: PlatformStats[], categoryBalance: Record<string, number>, recs: string[]): string {
  const lines: string[] = [];
  lines.push(`# GLV Social Weekly Summary — Week of Mon ${monday}`);
  lines.push('');
  lines.push('## Platform Performance');
  lines.push('');
  lines.push('| Platform | Followers | +/- | Impressions | Reach | Posts |');
  lines.push('|----------|-----------|-----|-------------|-------|-------|');

  for (const s of stats) {
    const followers = s.followersEnd ?? s.followersStart ?? 0;
    const delta = formatDelta(s.followersStart, s.followersEnd);
    lines.push(`| ${s.platform} | ${followers.toLocaleString()} | ${delta} | ${s.impressions.toLocaleString()} | ${s.reach.toLocaleString()} | ${s.shipped}/${s.scheduled} |`);
  }

  lines.push('');
  lines.push('## Top Posts This Week');
  lines.push('');
  for (const s of stats) {
    if (s.bestPost) {
      lines.push(`- **${s.platform}**: "${s.bestPost.caption}" — ${s.bestPost.engagement} engagement (${s.bestPost.date})`);
    }
  }
  if (stats.every(s => !s.bestPost)) lines.push('_No post data available._');

  lines.push('');
  lines.push('## Category Balance');
  lines.push('');
  for (const [cat, n] of Object.entries(categoryBalance)) {
    lines.push(`- ${cat}: ${n} posts`);
  }

  lines.push('');
  lines.push('## Recommendations');
  lines.push('');
  if (recs.length === 0) {
    lines.push('_No recommendations generated._');
  } else {
    recs.forEach((r, i) => lines.push(`${i + 1}. ${r}`));
  }

  lines.push('');
  lines.push(`_Generated: ${new Date().toISOString()}_`);
  lines.push('');

  return lines.join('\n');
}

function buildTelegram(monday: string, stats: PlatformStats[], recs: string[]): string {
  const top = stats
    .filter(s => s.followersEndForRate && s.followersEndForRate > 0)
    .sort((a, b) => (b.totalEngagement / (b.followersEndForRate ?? 1)) - (a.totalEngagement / (a.followersEndForRate ?? 1)))
    .slice(0, 3);

  const lines: string[] = [
    `GLV Social — Week of ${monday}`,
    '',
    'Platform highlights:',
  ];
  for (const s of top) {
    const delta = formatDelta(s.followersStart, s.followersEnd);
    lines.push(`  ${s.platform}: ${s.followersEnd ?? '?'} followers (${delta}), ${s.shipped} posts shipped`);
  }
  lines.push('');
  if (recs.length > 0) {
    lines.push('Actions:');
    recs.forEach((r, i) => lines.push(`  ${i + 1}. ${r}`));
  }
  return lines.join('\n').slice(0, 4096);
}

function sendTelegram(message: string): void {
  const chatId = process.env.CTX_TELEGRAM_CHAT_ID ?? '';
  if (!chatId) return;
  execFile('cortextos', ['bus', 'send-telegram', chatId, message], () => {});
}

function run(): void {
  const ctxRoot = process.env.CTX_ROOT ?? join(homedir(), '.cortextos', 'default');
  const socialsBase = join(ctxRoot, '..', '..', 'orgs', 'glv', 'clients', 'glv-marketing', 'socials');
  const analyticsBase = join(socialsBase, 'analytics');
  const scheduledBase = join(socialsBase, 'scheduled');
  const reportsBase = join(socialsBase, 'reports');

  const weekArg = process.argv.find(a => a.startsWith('--week='))?.split('=')[1];
  const monday = weekArg ?? prevMonday(new Date());

  const dates = weekDates(monday);
  console.log(`[weekly-summary] week=${monday} dates=${dates[0]}..${dates[6]}`);

  const stats = PLATFORMS.map(p => buildPlatformStats(analyticsBase, scheduledBase, p, dates));
  const categoryBalance = buildCategoryBalance(scheduledBase, dates);
  const recs = buildRecommendations(stats, categoryBalance);

  const markdown = buildMarkdown(monday, stats, categoryBalance, recs);
  mkdirSync(reportsBase, { recursive: true });
  const outFile = join(reportsBase, `weekly-${monday}.md`);
  writeFileSync(outFile, markdown);
  console.log(`[weekly-summary] wrote ${outFile}`);

  sendTelegram(buildTelegram(monday, stats, recs));
}

run();
