'use client';

import { useEffect, useState } from 'react';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandGoogle,
  IconRefresh,
  IconVideo,
  IconPhoto,
  IconFileText,
  IconClock,
  IconAlertCircle,
  IconCheck,
} from '@tabler/icons-react';
import type { SocialChannel, ContentPipeline, ReelPipelineState, WeeklyRollup, DraftItem, RenderItem } from '@/lib/data/social';

// --- Platform icon map ---
function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <IconBrandInstagram size={size} />;
  if (p.includes('threads')) return <IconBrandInstagram size={size} className="opacity-60" />;
  if (p.includes('tiktok')) return <IconBrandTiktok size={size} />;
  if (p.includes('x ') || p === 'x') return <IconBrandX size={size} />;
  if (p.includes('facebook')) return <IconBrandFacebook size={size} />;
  if (p.includes('linkedin')) return <IconBrandLinkedin size={size} />;
  if (p.includes('youtube')) return <IconBrandYoutube size={size} />;
  if (p.includes('gbp') || p.includes('google')) return <IconBrandGoogle size={size} />;
  return <IconPhoto size={size} />;
}

function CompletenessBadge({ value }: { value: string }) {
  const color =
    value === 'HIGH' ? 'bg-green-100 text-green-700' :
    value === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
    value === 'UNKNOWN' ? 'bg-gray-100 text-gray-500' :
    'bg-red-100 text-red-600';
  return (
    <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${color}`}>{value}</span>
  );
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-2">
      <div className="text-muted-foreground/40">{icon}</div>
      <p className="text-sm font-medium text-foreground/60">{title}</p>
      <p className="text-xs max-w-xs">{sub}</p>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {count !== undefined && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      )}
    </div>
  );
}

function draftTypeIcon(type: DraftItem['type']) {
  if (type === 'reel') return <IconVideo size={13} className="text-purple-500" />;
  if (type === 'carousel') return <IconPhoto size={13} className="text-blue-500" />;
  if (type === 'content-calendar') return <IconClock size={13} className="text-orange-500" />;
  return <IconFileText size={13} className="text-muted-foreground" />;
}

export default function SocialPage() {
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [pipeline, setPipeline] = useState<ContentPipeline | null>(null);
  const [reel, setReel] = useState<ReelPipelineState | null>(null);
  const [rollup, setRollup] = useState<WeeklyRollup | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [previewRender, setPreviewRender] = useState<RenderItem | null>(null);

  async function load(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const [cRes, pRes, rRes, wRes] = await Promise.all([
      fetch('/api/social?view=channels'),
      fetch('/api/social?view=pipeline'),
      fetch('/api/social?view=reel'),
      fetch('/api/social?view=rollup'),
    ]);
    const [c, p, r, w] = await Promise.all([cRes.json(), pRes.json(), rRes.json(), wRes.json()]);
    setChannels(Array.isArray(c) ? c : []);
    setPipeline(p && typeof p === 'object' ? p : null);
    setReel(r && typeof r === 'object' ? r : null);
    setRollup(w && typeof w === 'object' ? w : null);

    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 30_000);
    return () => clearInterval(interval);
  }, []);

  function fmtDate(iso: string | null) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return iso; }
  }

  function fmtTs(iso: string | null) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return iso; }
  }

  const draftsOnly = pipeline?.drafts.filter((d) => d.type !== 'content-calendar') ?? [];
  const calendars = pipeline?.drafts.filter((d) => d.type === 'content-calendar') ?? [];
  const renders = pipeline?.renders ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Social</h1>
          <p className="text-sm text-muted-foreground mt-1">
            8-channel snapshot · Content pipeline · Reel state · Weekly rollup
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40"
        >
          <IconRefresh size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* PANEL 1 — 8-Channel Snapshot */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold">Channel Snapshot</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            Baseline 2026-05-16
          </span>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Platform</th>
                <th className="px-4 py-2.5 text-left font-medium">Handle</th>
                <th className="px-4 py-2.5 text-right font-medium">Followers</th>
                <th className="px-4 py-2.5 text-right font-medium">Last Post</th>
                <th className="px-4 py-2.5 text-right font-medium">Posts/Wk</th>
                <th className="px-4 py-2.5 text-right font-medium">Eng %</th>
                <th className="px-4 py-2.5 text-right font-medium">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    Loading…
                  </td>
                </tr>
              ) : (
                channels.map((ch) => (
                  <tr key={ch.platform} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2 font-medium">
                        <PlatformIcon platform={ch.platform} />
                        {ch.platform}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs font-mono">{ch.handle}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {ch.followers === null ? <span className="text-muted-foreground">—</span> : ch.followers}
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                      {ch.lastPostDate ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                      {ch.postsThisWeek}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground">
                      {ch.engagementPct === null ? '—' : `${ch.engagementPct}%`}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <CompletenessBadge value={ch.completeness} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Live analytics pending Blotato account IDs in secrets.env · Facebook gated behind login
        </p>
      </section>

      {/* PANEL 2 — Content Pipeline */}
      <section>
        <h2 className="text-base font-semibold mb-4">Content Pipeline</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Drafts pending QC */}
          <div className="rounded-lg border p-4">
            <SectionHeader title="Drafts pending QC" count={draftsOnly.length} />
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : draftsOnly.length === 0 ? (
              <EmptyState
                icon={<IconFileText size={32} />}
                title="No drafts"
                sub="Social agent writes drafts to orgs/glv/social/glvbuilds/drafts/"
              />
            ) : (
              <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                {draftsOnly.map((d) => (
                  <li key={d.filename} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0">{draftTypeIcon(d.type)}</span>
                    <div className="min-w-0">
                      <p className="truncate font-medium leading-tight">{d.title}</p>
                      <p className="text-[11px] text-muted-foreground">{d.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {calendars.length > 0 && (
              <p className="mt-2 text-[11px] text-muted-foreground">
                + {calendars.length} content calendar file{calendars.length > 1 ? 's' : ''} not shown
              </p>
            )}
          </div>

          {/* Renders awaiting Aiden review */}
          <div className="rounded-lg border p-4">
            <SectionHeader title="Renders awaiting review" count={renders.length} />
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : renders.length === 0 ? (
              <EmptyState
                icon={<IconPhoto size={32} />}
                title="No renders"
                sub="Remotion renders appear here once composite-preview.png is built"
              />
            ) : (
              <ul className="space-y-1.5 max-h-60 overflow-y-auto">
                {renders.map((r) => (
                  <li key={r.name}>
                    <button
                      onClick={() => setPreviewRender(previewRender?.name === r.name ? null : r)}
                      className="flex w-full items-start gap-2 rounded px-1 py-1 text-sm hover:bg-muted/40 transition-colors text-left"
                    >
                      <IconPhoto size={13} className="mt-0.5 shrink-0 text-blue-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium leading-tight">{r.name}</p>
                        <p className="text-[11px] text-muted-foreground">{r.slideCount} slides · {r.date}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {previewRender?.name === r.name ? 'hide' : 'preview'}
                      </span>
                    </button>
                    {previewRender?.name === r.name && (
                      <div className="mt-2 rounded border bg-muted/20 p-2">
                        <p className="text-[11px] text-muted-foreground mb-1 font-mono truncate">
                          {r.compositePath}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Open in file browser to preview · {r.slideCount} slides
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Scheduled posts */}
          <div className="rounded-lg border p-4">
            <SectionHeader title="Scheduled (next 7 days)" count={0} />
            <EmptyState
              icon={<IconClock size={32} />}
              title="No scheduled posts"
              sub="Social agent will write scheduled.json once Blotato account IDs land in secrets.env"
            />
          </div>

          {/* Posted this week */}
          <div className="rounded-lg border p-4">
            <SectionHeader title="Posted this week" count={0} />
            <EmptyState
              icon={<IconCheck size={32} />}
              title="No posts yet"
              sub="Social agent writes posted.json after each Blotato syndication run"
            />
          </div>
        </div>
      </section>

      {/* PANEL 3 — Reel Pipeline State */}
      <section>
        <h2 className="text-base font-semibold mb-4">Reel Pipeline</h2>
        <div className="rounded-lg border p-4">
          {loading || !reel ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : reel.jobCount === 0 ? (
            <EmptyState
              icon={<IconVideo size={32} />}
              title="No renders yet"
              sub="Run reel-pipeline.sh to generate the first output"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Last Run</p>
                <p className="text-sm font-medium">{fmtTs(reel.lastRunTimestamp)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Last Output</p>
                <p className="text-sm font-medium font-mono truncate">{reel.lastOutputFile ?? '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">File Size</p>
                <p className="text-sm font-medium">{reel.lastOutputSizeKB !== null ? `${reel.lastOutputSizeKB} KB` : '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Job Count</p>
                <p className="text-sm font-medium">{reel.jobCount}</p>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Blotato Queue</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <IconAlertCircle size={13} className="text-yellow-500" />
                  Awaiting account IDs in secrets.env — not yet wired
                </div>
              </div>
              {reel.recentErrors.length > 0 && (
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Recent Errors</p>
                  <ul className="space-y-1">
                    {reel.recentErrors.map((e, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-red-600">
                        <IconAlertCircle size={12} className="mt-0.5 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* PANEL 4 — Weekly Performance Rollup */}
      <section>
        <h2 className="text-base font-semibold mb-4">Weekly Rollup</h2>
        <div className="rounded-lg border p-4">
          {loading || !rollup ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !rollup.available ? (
            <EmptyState
              icon={<IconFileText size={32} />}
              title="No weekly reports yet"
              sub="Social agent generates weekly-YYYY-MM-DD.md every Monday at 9am EDT via the weekly-report cron"
            />
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IconCheck size={14} className="text-green-600" />
                <span className="text-sm font-medium">Report available — week of {rollup.weekOf}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{rollup.filePath}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Top post / follower deltas / engagement trend chart displayed here in v2
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
