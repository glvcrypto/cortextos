// cortextOS Dashboard — Social data fetcher
// Reads from filesystem: social-accounts.md, baseline-audit, drafts, renders, reel-output

import fs from 'fs';
import path from 'path';

const CTX_ROOT = process.env.CTX_ROOT ?? path.join(process.cwd(), '..');
const GLV_ROOT = path.join(CTX_ROOT, 'orgs', 'glv');
const SOCIAL_ROOT = path.join(GLV_ROOT, 'social', 'glvbuilds');
const DRAFTS_DIR = path.join(SOCIAL_ROOT, 'drafts');
const REEL_OUTPUT_DIR = path.join(SOCIAL_ROOT, 'reel-output');
const REPORTS_DIR = path.join(SOCIAL_ROOT, 'reports');
const RENDERS_DIR = path.join(GLV_ROOT, 'clients', 'glv-marketing', 'socials', 'remotion', 'renders');

export interface SocialChannel {
  platform: string;
  handle: string;
  followers: number | null;
  lastPostDate: string | null;
  postsThisWeek: number;
  engagementPct: number | null;
  state: string;
  completeness: string;
}

export interface DraftItem {
  filename: string;
  title: string;
  date: string;
  type: 'carousel' | 'reel' | 'content-calendar' | 'other';
}

export interface RenderItem {
  name: string;
  compositePath: string;
  slideCount: number;
  date: string;
}

export interface ReelPipelineState {
  lastRunTimestamp: string | null;
  lastOutputFile: string | null;
  lastOutputSizeKB: number | null;
  jobCount: number;
  recentErrors: string[];
}

export interface WeeklyRollup {
  weekOf: string | null;
  available: boolean;
  filePath: string | null;
}

export interface ContentPipeline {
  drafts: DraftItem[];
  renders: RenderItem[];
  scheduled: never[];
  postedThisWeek: never[];
}

// --- Channel data (baseline-audit-2026-05-16.md + social-accounts.md) ---
const CHANNEL_BASELINE: SocialChannel[] = [
  { platform: 'Instagram', handle: '@glv.marketing', followers: 3, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Zero', completeness: 'LOW' },
  { platform: 'Threads', handle: '@glv.marketing', followers: 0, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Zero', completeness: 'LOW' },
  { platform: 'TikTok', handle: '@glv.marketing', followers: 0, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Zero', completeness: 'LOW' },
  { platform: 'X / Twitter', handle: '@glvmarketing', followers: 0, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Zero', completeness: 'LOW' },
  { platform: 'Facebook', handle: 'GLV Marketing', followers: null, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Login-gated', completeness: 'UNKNOWN' },
  { platform: 'LinkedIn', handle: 'GLV Marketing', followers: 5, lastPostDate: '2026-03', postsThisWeek: 0, engagementPct: null, state: 'Dormant (2mo)', completeness: 'HIGH' },
  { platform: 'YouTube', handle: '@GLVMarketing', followers: null, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Zero (born May 16)', completeness: 'LOW' },
  { platform: 'GBP', handle: 'GLV Marketing', followers: null, lastPostDate: null, postsThisWeek: 0, engagementPct: null, state: 'Live (5.0★)', completeness: 'MEDIUM' },
];

export function getSocialChannels(): SocialChannel[] {
  // Future: merge with per-channel JSON files when social agent starts writing them
  return CHANNEL_BASELINE;
}

// --- Content pipeline ---
function getDraftType(filename: string): DraftItem['type'] {
  if (filename.includes('reel')) return 'reel';
  if (filename.includes('carousel')) return 'carousel';
  if (filename.includes('content-calendar')) return 'content-calendar';
  return 'other';
}

function parseDraftTitle(filename: string): string {
  // e.g. 2026-05-15_carousel-first-client-story.md → First Client Story
  const base = filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}_/, '');
  return base.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getContentPipeline(): ContentPipeline {
  const drafts: DraftItem[] = [];
  const renders: RenderItem[] = [];

  // Drafts
  if (fs.existsSync(DRAFTS_DIR)) {
    const files = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.md')).sort().reverse();
    for (const file of files) {
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
      drafts.push({
        filename: file,
        title: parseDraftTitle(file),
        date: dateMatch ? dateMatch[1] : '',
        type: getDraftType(file),
      });
    }
  }

  // Renders (directories with composite-preview.png)
  if (fs.existsSync(RENDERS_DIR)) {
    const dirs = fs.readdirSync(RENDERS_DIR).filter((d) => {
      const full = path.join(RENDERS_DIR, d);
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'composite-preview.png'));
    }).sort().reverse();

    for (const dir of dirs) {
      const full = path.join(RENDERS_DIR, dir);
      const slides = fs.readdirSync(full).filter((f) => f.startsWith('slide-') && f.endsWith('.png'));
      const dateMatch = dir.match(/(\d{4}-\d{2}-\d{2})$/);
      renders.push({
        name: dir,
        compositePath: path.join(RENDERS_DIR, dir, 'composite-preview.png'),
        slideCount: slides.length,
        date: dateMatch ? dateMatch[1] : '',
      });
    }
  }

  return { drafts, renders, scheduled: [], postedThisWeek: [] };
}

// --- Reel pipeline ---
export function getReelPipelineState(): ReelPipelineState {
  const result: ReelPipelineState = {
    lastRunTimestamp: null,
    lastOutputFile: null,
    lastOutputSizeKB: null,
    jobCount: 0,
    recentErrors: [],
  };

  if (!fs.existsSync(REEL_OUTPUT_DIR)) return result;

  const entries = fs.readdirSync(REEL_OUTPUT_DIR);

  // Count top-level .mp4 files + subdirectories with props.json
  const mp4Files = entries.filter((e) => e.endsWith('.mp4')).map((e) => path.join(REEL_OUTPUT_DIR, e));
  const jobDirs = entries.filter((e) => {
    const full = path.join(REEL_OUTPUT_DIR, e);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'props.json'));
  });

  result.jobCount = mp4Files.length + jobDirs.length;

  // Find most recent .mp4
  const allMp4s = [
    ...mp4Files,
    ...jobDirs.map((d) => {
      const full = path.join(REEL_OUTPUT_DIR, d);
      const mp4 = fs.readdirSync(full).find((f) => f.endsWith('.mp4'));
      return mp4 ? path.join(full, mp4) : null;
    }).filter(Boolean) as string[],
  ];

  if (allMp4s.length > 0) {
    const sorted = allMp4s
      .map((f) => ({ f, mtime: fs.statSync(f).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    const latest = sorted[0];
    result.lastOutputFile = path.basename(latest.f);
    result.lastOutputSizeKB = Math.round(fs.statSync(latest.f).size / 1024);
    result.lastRunTimestamp = latest.mtime.toISOString();
  }

  return result;
}

// --- Weekly rollup ---
export function getWeeklyRollup(): WeeklyRollup {
  if (!fs.existsSync(REPORTS_DIR)) {
    return { weekOf: null, available: false, filePath: null };
  }

  const files = fs.readdirSync(REPORTS_DIR)
    .filter((f) => f.startsWith('weekly-') && f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) {
    return { weekOf: null, available: false, filePath: null };
  }

  const latest = files[0];
  const match = latest.match(/weekly-(\d{4}-\d{2}-\d{2})\.md/);
  return {
    weekOf: match ? match[1] : null,
    available: true,
    filePath: path.join(REPORTS_DIR, latest),
  };
}
