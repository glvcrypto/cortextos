'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
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
  IconChevronDown,
  IconChevronRight,
  IconCalendar,
  IconEdit,
  IconX,
  IconPlayerPlay,
  IconSend,
} from '@tabler/icons-react';
import type { SocialChannel, ContentPipeline, ContentPipelineItem, PipelineStage, ReelPipelineState, WeeklyRollup, DraftItem, RenderItem } from '@/lib/data/social';
import type { PlatformTimeseries, Platform } from '@/lib/data/social-analytics';
import type { ScheduledPost, PostStatus } from '@/lib/data/social-scheduled-types';
import { GLV_CATEGORIES } from '@/lib/data/social-scheduled-types';
import type { LivePostRow } from '@/lib/data/social-live-types';

interface PlatformBestTimes {
  platform: string;
  hasData: boolean;
  totalPosts: number;
  slots: { day: string; hour: number; avgEngagement: number; sampleSize: number }[];
  recommended: string | null;
}

// --- Platform icon map ---
function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <IconBrandInstagram size={size} />;
  if (p.includes('threads')) return <IconBrandInstagram size={size} className="opacity-60" />;
  if (p.includes('tiktok')) return <IconBrandTiktok size={size} />;
  if (p === 'x') return <IconBrandX size={size} />;
  if (p.includes('facebook')) return <IconBrandFacebook size={size} />;
  if (p.includes('linkedin')) return <IconBrandLinkedin size={size} />;
  if (p.includes('youtube')) return <IconBrandYoutube size={size} />;
  if (p === 'gbp') return <IconBrandGoogle size={size} />;
  return <IconPhoto size={size} />;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  gbp: 'Google Business',
  x: 'X (Twitter)',
  threads: 'Threads',
  tiktok: 'TikTok',
};

const PLATFORMS: Platform[] = [
  'instagram', 'facebook', 'linkedin', 'youtube',
  'gbp', 'x', 'threads', 'tiktok',
];

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

function fmtK(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtTs(iso: string | null): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
}

// --- Per-platform analytics panel ---
function PlatformAnalyticsSection({ platform }: { platform: Platform }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PlatformTimeseries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!open || data) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/social/analytics/${platform}`);
      const json = await res.json() as PlatformTimeseries;
      setData(json);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [open, data, platform]);

  useEffect(() => { void load(); }, [load]);

  const latest = data?.latestSnapshot;
  const label = PLATFORM_LABELS[platform];
  const hasData = (data?.snapshots?.length ?? 0) > 0;

  // 15-min channel refresh (channel-stats cron) — fresher than the daily scrape.
  const live = data?.liveSnapshot;
  const liveFollowers = live?.ok && live.followers !== null ? live.followers : null;
  const headerFollowers = liveFollowers ?? latest?.followers ?? null;

  // Prep chart data — last 30 days
  const chartData = (data?.snapshots ?? []).slice(-30).map(s => ({
    date: s.date.slice(5),           // MM-DD
    followers: s.followers,
    impressions: s.impressions,
    reach: s.reach,
  }));

  const postRows = latest?.recentPosts?.slice(0, 8) ?? [];

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
      >
        <span className="text-muted-foreground">
          {open ? <IconChevronDown size={15} /> : <IconChevronRight size={15} />}
        </span>
        <span className="text-muted-foreground">
          <PlatformIcon platform={platform} size={16} />
        </span>
        <span className="text-sm font-medium flex-1">{label}</span>
        <span className="text-xs text-muted-foreground font-mono">{data?.handle ?? '—'}</span>
        {headerFollowers !== null && (
          <span className="text-sm tabular-nums font-medium ml-4 flex items-center gap-1.5">
            {liveFollowers !== null && (
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                title={`Live · refreshed ${live ? fmtTs(live.scraped_at) : ''}`}
              />
            )}
            {fmtK(headerFollowers)} followers
          </span>
        )}
        {headerFollowers === null && !loading && (
          <span className="text-xs text-muted-foreground ml-4">No data yet</span>
        )}
        {loading && (
          <span className="text-xs text-muted-foreground ml-4 animate-pulse">Loading…</span>
        )}
      </button>

      {/* Expanded body */}
      {open && (
        <div className="border-t px-4 py-4 space-y-5">
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              <IconAlertCircle size={13} /> {error}
            </p>
          )}

          {!hasData && !loading && (
            <EmptyState
              icon={<PlatformIcon platform={platform} size={32} />}
              title="No scraped data yet"
              sub={`Run social-analytics-scrape cron to start collecting daily snapshots for ${label}.`}
            />
          )}

          {hasData && (
            <>
              {/* Metric pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Followers', value: headerFollowers },
                  { label: 'Impressions', value: latest?.impressions },
                  { label: 'Reach', value: latest?.reach },
                  { label: 'Profile Views', value: latest?.profileViews },
                  { label: 'Video Views', value: latest?.videoViews },
                ].map(({ label: l, value: v }) => v !== null && v !== undefined ? (
                  <div key={l} className="rounded-md border bg-muted/20 px-3 py-1.5 text-center min-w-[90px]">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{l}</p>
                    <p className="text-base font-semibold tabular-nums">{fmtK(v)}</p>
                  </div>
                ) : null)}
              </div>

              {/* Followers over time chart */}
              {chartData.some(d => d.followers !== null) && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Followers — last {chartData.length} days
                  </p>
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={fmtK} width={40} />
                      <Tooltip
                        formatter={(v) => [fmtK(v as number | null), 'Followers']}
                        contentStyle={{ fontSize: 12, borderRadius: 6 }}
                      />
                      <Line
                        type="monotone" dataKey="followers" stroke="hsl(var(--primary))"
                        strokeWidth={2} dot={false} connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Impressions / reach chart */}
              {chartData.some(d => d.impressions !== null || d.reach !== null) && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Impressions &amp; Reach — last {chartData.length} days
                  </p>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={fmtK} width={40} />
                      <Tooltip formatter={(v) => fmtK(v as number | null)} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                      <Bar dataKey="impressions" fill="hsl(var(--primary) / 0.6)" name="Impressions" />
                      <Bar dataKey="reach" fill="hsl(var(--primary) / 0.3)" name="Reach" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Recent posts table */}
              {postRows.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Recent posts
                  </p>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/40 text-muted-foreground">
                        <tr>
                          <th className="px-3 py-1.5 text-left font-medium">Post</th>
                          <th className="px-3 py-1.5 text-right font-medium">Likes</th>
                          <th className="px-3 py-1.5 text-right font-medium">Comments</th>
                          <th className="px-3 py-1.5 text-right font-medium">Shares</th>
                          <th className="px-3 py-1.5 text-right font-medium">Views</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {postRows.map(post => (
                          <tr key={post.id} className="hover:bg-muted/20">
                            <td className="px-3 py-1.5 max-w-[200px]">
                              {post.url ? (
                                <a href={post.url} target="_blank" rel="noreferrer"
                                  className="truncate block text-primary hover:underline">
                                  {post.caption?.slice(0, 50) ?? post.id}
                                </a>
                              ) : (
                                <span className="truncate block text-muted-foreground">
                                  {post.caption?.slice(0, 50) ?? post.id}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{fmtK(post.likes)}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{fmtK(post.comments)}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{fmtK(post.shares)}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{fmtK(post.views)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-muted-foreground">
                Last scraped: {fmtTs(data?.lastScrapedAt ?? null)} · {data?.snapshots.length} days of data
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// --- Status badge for scheduled posts ---
function StatusBadge({ status }: { status: PostStatus }) {
  const cfg = {
    draft:     { bg: 'bg-gray-100',   text: 'text-gray-600'  },
    scheduled: { bg: 'bg-blue-100',   text: 'text-blue-700'  },
    posted:    { bg: 'bg-green-100',  text: 'text-green-700' },
    failed:    { bg: 'bg-red-100',    text: 'text-red-600'   },
    cancelled: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  }[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium capitalize ${cfg.bg} ${cfg.text}`}>
      {status}
    </span>
  );
}

// --- Edit-via-boss modal ---
function EditModal({
  post,
  onClose,
  onSent,
}: {
  post: ScheduledPost;
  onClose: () => void;
  onSent: (msgId: string) => void;
}) {
  const [desc, setDesc] = useState('');
  const [urgency, setUrgency] = useState<'now' | 'next_sync' | 'nightly_batch'>('next_sync');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    if (!desc.trim()) { setErr('Describe the change.'); return; }
    setSending(true); setErr(null);
    try {
      const res = await fetch('/api/social/scheduled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'edit_request',
          post_id: post.id,
          platform: post.platform,
          _file: post._file,
          change_description: desc,
          urgency,
        }),
      });
      const data = await res.json() as { ok?: boolean; msg_id?: string; error?: string };
      if (!data.ok) throw new Error(data.error ?? 'unknown error');
      onSent(data.msg_id ?? '');
    } catch (e) {
      setErr(String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl border bg-background shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Edit via boss</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <IconX size={16} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">{post.platform}</span>
          {' · '}
          {new Date(post.scheduled_at).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        {post.caption && (
          <p className="text-xs text-muted-foreground line-clamp-2 italic">&ldquo;{post.caption}&rdquo;</p>
        )}
        <div className="space-y-2">
          <label className="text-xs font-medium">What to change</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder='e.g. "rewrite caption to be more punchy" or "drop the scheduled date by 1 day"'
            className="w-full rounded-md border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium">Urgency</label>
          <select
            value={urgency}
            onChange={e => setUrgency(e.target.value as 'now' | 'next_sync' | 'nightly_batch')}
            className="rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="now">Now — high priority</option>
            <option value="next_sync">Next sync</option>
            <option value="nightly_batch">Nightly batch</option>
          </select>
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50">
            Cancel
          </button>
          <button
            onClick={() => void send()}
            disabled={sending}
            className="flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <IconSend size={12} />
            {sending ? 'Sending…' : 'Send to boss'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Reschedule modal (date/time picker only) ---
function RescheduleModal({
  post,
  onClose,
  onDone,
}: {
  post: ScheduledPost;
  onClose: () => void;
  onDone: () => void;
}) {
  const current = post.scheduled_at.slice(0, 16); // YYYY-MM-DDTHH:MM
  const [dt, setDt] = useState(current);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    if (!dt) { setErr('Pick a date and time.'); return; }
    setSaving(true); setErr(null);
    try {
      const res = await fetch('/api/social/scheduled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reschedule',
          post_id: post.id,
          platform: post.platform,
          _file: post._file,
          new_scheduled_at: new Date(dt).toISOString(),
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? 'unknown error');
      onDone();
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xs rounded-xl border bg-background shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Reschedule</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <IconX size={16} />
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium">New date &amp; time</label>
          <input
            type="datetime-local"
            value={dt}
            onChange={e => setDt(e.target.value)}
            className="w-full rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50">
            Cancel
          </button>
          <button
            onClick={() => void save()}
            disabled={saving}
            className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Live Posts panel ---
// Reads /api/social/live-metrics, which joins posts-registry.json against
// per-platform snapshot files under analytics/live/<platform>/<post>.json
// (written by the post-tracker-15m cron). Phase 1 ships instagram only;
// other platforms in the registry appear once their scrapers ship.
function LivePostsPanel() {
  const [rows, setRows] = useState<LivePostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/social/live-metrics');
      const data = await res.json() as LivePostRow[];
      setRows(Array.isArray(data) ? data : []);
    } catch { /* no-op */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => { void load(); }, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const platforms = ['all', ...Array.from(new Set(rows.map(r => r.entry.platform))).sort()];
  const visible = rows.filter(r => filterPlatform === 'all' || r.entry.platform === filterPlatform);

  const fmt = (n: number | null | undefined): string =>
    n == null ? '—' : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const ageMin = (iso: string | undefined): string => {
    if (!iso) return '—';
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={filterPlatform}
          onChange={e => setFilterPlatform(e.target.value)}
          className="rounded-md border px-2 py-1 text-xs focus:outline-none"
        >
          {platforms.map(p => <option key={p} value={p}>{p === 'all' ? 'All platforms' : p}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <IconRefresh size={12} /> auto-refresh 60s · scrape cadence 15min
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<IconPhoto size={32} />}
          title="No tracked posts"
          sub="post-tracker-15m writes to orgs/glv/clients/glv-marketing/socials/analytics/live/<platform>/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map(row => {
            const { entry, snapshot } = row;
            const stale = snapshot && snapshot.ok === false;
            const intro = entry.intro && entry.intro !== 'unknown' ? entry.intro : null;
            return (
              <div
                key={entry.post_id}
                className={`rounded-lg border bg-card p-3 flex flex-col gap-2.5 ${
                  stale ? 'border-amber-300 bg-amber-50/40 dark:bg-amber-950/20' : ''
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <PlatformIcon platform={entry.platform} size={16} />
                  <span className="capitalize font-medium">{entry.platform}</span>
                  <span className="ml-auto text-muted-foreground">
                    {snapshot
                      ? <>scraped {ageMin(snapshot.scraped_at)}</>
                      : <span className="italic">not yet scraped</span>}
                  </span>
                </div>

                {snapshot?.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={snapshot.thumbnail_url}
                    alt={intro ?? entry.platform_post_id}
                    loading="lazy"
                    className="w-full aspect-square rounded-md object-cover bg-muted"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                {intro && (
                  <div className="text-sm font-medium leading-snug line-clamp-2">
                    {intro}
                  </div>
                )}

                {snapshot?.caption && (
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-3 italic">
                    &ldquo;{snapshot.caption}&rdquo;
                  </p>
                )}

                <div className="grid grid-cols-4 gap-1 py-1">
                  {[
                    { label: 'likes', value: snapshot?.likes },
                    { label: 'comments', value: snapshot?.comments },
                    { label: 'shares', value: snapshot?.shares },
                    { label: 'views', value: snapshot?.views },
                  ].map(m => (
                    <div key={m.label} className="text-center">
                      <div className="text-lg font-semibold tabular-nums leading-tight">
                        {fmt(m.value)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {stale && snapshot?.error && (
                  <div className="flex items-start gap-1 text-[11px] text-amber-700 dark:text-amber-400">
                    <IconAlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{snapshot.error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                  <a
                    href={entry.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[10rem]"
                    title={entry.post_url}
                  >
                    {entry.platform_post_id} →
                  </a>
                  <span>pub {ageMin(entry.published_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// --- Queued Posts panel ---
function QueuedPostsPanel() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'platform' | 'status'>('date');
  const [queuedOnly, setQueuedOnly] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editPost, setEditPost] = useState<ScheduledPost | null>(null);
  const [reschedulePost, setReschedulePost] = useState<ScheduledPost | null>(null);
  const [editSentIds, setEditSentIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/social/scheduled');
      const data = await res.json() as ScheduledPost[];
      setPosts(Array.isArray(data) ? data : []);
    } catch { /* no-op */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => { void load(); }, 60_000);
    return () => clearInterval(id);
  }, [load]);

  async function cancel(post: ScheduledPost) {
    if (!confirm(`Cancel this ${post.platform} post?`)) return;
    await fetch('/api/social/scheduled', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', post_id: post.id, platform: post.platform, _file: post._file }),
    });
    void load();
  }

  const platforms = ['all', ...Array.from(new Set(posts.map(p => p.platform))).sort()];
  const statuses = ['all', 'draft', 'scheduled', 'posted', 'failed', 'cancelled'];

  const now = Date.now();
  const visible = posts
    .filter(p => !queuedOnly || (
      p.status === 'scheduled' && new Date(p.scheduled_at).getTime() > now
    ))
    .filter(p => filterPlatform === 'all' || p.platform === filterPlatform)
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') return a.scheduled_at.localeCompare(b.scheduled_at);
      if (sortBy === 'platform') return a.platform.localeCompare(b.platform);
      return a.status.localeCompare(b.status);
    });

  return (
    <>
      {editPost && (
        <EditModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onSent={(msgId) => {
            setEditSentIds(s => new Set(s).add(editPost.id + ':' + msgId));
            setEditPost(null);
            void load();
          }}
        />
      )}
      {reschedulePost && (
        <RescheduleModal
          post={reschedulePost}
          onClose={() => setReschedulePost(null)}
          onDone={() => { setReschedulePost(null); void load(); }}
        />
      )}

      {/* Filters + sort bar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={queuedOnly}
            onChange={e => setQueuedOnly(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          <span>Queued only</span>
          <span className="text-muted-foreground">(future + scheduled)</span>
        </label>
        <select
          value={filterPlatform}
          onChange={e => setFilterPlatform(e.target.value)}
          className="rounded-md border px-2 py-1 text-xs focus:outline-none"
        >
          {platforms.map(p => <option key={p} value={p}>{p === 'all' ? 'All platforms' : p}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          disabled={queuedOnly}
          className="rounded-md border px-2 py-1 text-xs focus:outline-none disabled:opacity-50"
        >
          {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          Sort:
          {(['date', 'platform', 'status'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`rounded px-2 py-0.5 ${sortBy === s ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<IconCalendar size={32} />}
          title="No queued posts"
          sub="Scheduled posts appear here. Social agent writes to orgs/glv/clients/glv-marketing/socials/scheduled/"
        />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Platform</th>
                <th className="px-4 py-2.5 text-left font-medium">Caption</th>
                <th className="px-4 py-2.5 text-left font-medium">Scheduled</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.map(post => {
                const isExpanded = expandedId === post.id;
                const editSentKey = Array.from(editSentIds).find(k => k.startsWith(post.id + ':'));
                return (
                  <React.Fragment key={post.id}>
                    <tr
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={post.platform} />
                          <span className="font-medium capitalize">{post.platform}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 max-w-xs">
                        {post.carousel_ref && (
                          <span className="text-[11px] text-muted-foreground font-mono block truncate">{post.carousel_ref}</span>
                        )}
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {post.caption?.slice(0, 60) ?? '(no caption)'}
                          {(post.caption?.length ?? 0) > 60 ? '…' : ''}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(post.scheduled_at).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={post.status} />
                        {editSentKey && (
                          <span className="ml-2 text-[11px] text-blue-600">
                            Edit requested
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditPost(post)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] border hover:bg-muted/50 text-muted-foreground"
                            title="Edit via boss"
                          >
                            <IconEdit size={11} />Edit
                          </button>
                          {post.status !== 'posted' && post.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => setReschedulePost(post)}
                                className="flex items-center gap-1 rounded px-2 py-1 text-[11px] border hover:bg-muted/50 text-muted-foreground"
                                title="Reschedule"
                              >
                                <IconCalendar size={11} />
                              </button>
                              <button
                                onClick={() => void cancel(post)}
                                className="flex items-center gap-1 rounded px-2 py-1 text-[11px] border hover:bg-red-50 text-red-500 hover:text-red-600 border-red-200"
                                title="Cancel post"
                              >
                                <IconX size={11} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${post.id}-expanded`} className="bg-muted/10">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                              <p><span className="font-medium text-muted-foreground">Post ID:</span> {post.id}</p>
                              <p><span className="font-medium text-muted-foreground">Platform:</span> {post.platform}</p>
                              {post.carousel_ref && (
                                <p><span className="font-medium text-muted-foreground">Carousel:</span> {post.carousel_ref}</p>
                              )}
                              {post.audio_brief && (
                                <p><span className="font-medium text-muted-foreground">Audio:</span> {post.audio_brief}</p>
                              )}
                              {post.geotag && (
                                <p><span className="font-medium text-muted-foreground">Geotag:</span> {post.geotag}</p>
                              )}
                              {post.blotato_job_id && (
                                <p><span className="font-medium text-muted-foreground">Blotato job:</span> {post.blotato_job_id}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              {post.caption && (
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">Caption:</p>
                                  <p className="whitespace-pre-wrap leading-relaxed">{post.caption}</p>
                                </div>
                              )}
                              {post.hashtags.length > 0 && (
                                <div>
                                  <p className="font-medium text-muted-foreground mb-1">Hashtags:</p>
                                  <p className="text-blue-600">{post.hashtags.join(' ')}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// --- Content Calendar panel ---
function ContentCalendarPanel() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'week' | 'month'>('week');
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/social/scheduled');
      const data = await res.json() as ScheduledPost[];
      setPosts(Array.isArray(data) ? data : []);
    } catch { /* no-op */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => { void load(); }, 60_000);
    return () => clearInterval(id);
  }, [load]);

  const buckets = new Map<string, ScheduledPost[]>();
  for (const p of posts) {
    const key = p.scheduled_at?.slice(0, 10);
    if (!key) continue;
    const arr = buckets.get(key) ?? [];
    arr.push(p);
    buckets.set(key, arr);
  }

  function dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const days: Date[] = [];
  if (view === 'week') {
    const start = new Date(anchor);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
  } else {
    const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
  }

  function shiftAnchor(direction: -1 | 0 | 1): void {
    if (direction === 0) { setAnchor(new Date()); return; }
    const next = new Date(anchor);
    if (view === 'week') next.setDate(next.getDate() + direction * 7);
    else next.setMonth(next.getMonth() + direction);
    setAnchor(next);
  }

  const monthLabel = anchor.toLocaleString('en-CA', { month: 'long', year: 'numeric' });
  const selectedPosts = selectedDate ? buckets.get(selectedDate) ?? [] : [];
  const todayKey = dateKey(new Date());
  const currentMonth = anchor.getMonth();

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="inline-flex rounded-md border overflow-hidden">
          {(['week', 'month'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-xs ${view === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'}`}
            >
              {v === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
        <div className="inline-flex items-center gap-1">
          <button onClick={() => shiftAnchor(-1)} className="rounded border px-2 py-1 text-xs hover:bg-muted/50">‹</button>
          <button onClick={() => shiftAnchor(0)} className="rounded border px-2 py-1 text-xs hover:bg-muted/50">Today</button>
          <button onClick={() => shiftAnchor(1)} className="rounded border px-2 py-1 text-xs hover:bg-muted/50">›</button>
        </div>
        <span className="text-xs font-medium ml-1">{monthLabel}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {loading ? 'Loading…' : `${posts.length} scheduled total · auto-refresh 60s`}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-[10px] uppercase tracking-wide text-muted-foreground text-center pb-1">{d}</div>
        ))}
        {days.map(d => {
          const key = dateKey(d);
          const dayPosts = buckets.get(key) ?? [];
          const counts = {
            scheduled: dayPosts.filter(p => p.status === 'scheduled').length,
            posted: dayPosts.filter(p => p.status === 'posted').length,
            failed: dayPosts.filter(p => p.status === 'failed').length,
            other: dayPosts.filter(p => !['scheduled', 'posted', 'failed'].includes(p.status)).length,
          };
          const isOtherMonth = view === 'month' && d.getMonth() !== currentMonth;
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          return (
            <button
              key={key}
              onClick={() => setSelectedDate(isSelected ? null : key)}
              className={`text-left p-1.5 rounded border text-xs min-h-[3.5rem]
                ${isToday ? 'border-primary border-2' : 'border-border'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                ${isOtherMonth ? 'opacity-40' : ''}
                ${dayPosts.length > 0 ? 'bg-muted/30 hover:bg-muted/50' : 'hover:bg-muted/20'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`tabular-nums ${isToday ? 'font-bold text-primary' : ''}`}>{d.getDate()}</span>
                {dayPosts.length > 0 && (
                  <span className="text-[10px] text-muted-foreground tabular-nums">{dayPosts.length}</span>
                )}
              </div>
              {dayPosts.length > 0 && (
                <div className="flex flex-wrap gap-0.5">
                  {counts.scheduled > 0 && <span className="rounded bg-violet-200 dark:bg-violet-900 px-1 text-[9px]">{counts.scheduled}s</span>}
                  {counts.posted > 0 && <span className="rounded bg-green-200 dark:bg-green-900 px-1 text-[9px]">{counts.posted}p</span>}
                  {counts.failed > 0 && <span className="rounded bg-red-200 dark:bg-red-900 px-1 text-[9px]">{counts.failed}f</span>}
                  {counts.other > 0 && <span className="rounded bg-gray-200 dark:bg-gray-700 px-1 text-[9px]">{counts.other}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-3 rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">{selectedDate} · {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''}</h4>
            <button onClick={() => setSelectedDate(null)} className="text-xs text-muted-foreground hover:text-foreground">
              <IconX size={14} />
            </button>
          </div>
          {selectedPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No posts scheduled this day.</p>
          ) : (
            <ul className="space-y-1.5">
              {selectedPosts
                .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))
                .map(p => (
                  <li key={p.id} className="flex items-center gap-2 text-xs">
                    <PlatformIcon platform={p.platform} size={12} />
                    <span className="capitalize text-muted-foreground">{p.platform}</span>
                    <span className="tabular-nums">
                      {new Date(p.scheduled_at).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <StatusBadge status={p.status} />
                    <span className="text-muted-foreground line-clamp-1 flex-1">
                      {p.caption?.slice(0, 80) ?? '(no caption)'}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

// --- Category Balance panel ---
const CATEGORY_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#f97316', '#06b6d4', '#84cc16',
];

function CategoryBalancePanel() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/social/scheduled')
      .then(r => r.json())
      .then((data: ScheduledPost[]) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const recent = Array.isArray(data)
          ? data.filter(p => new Date(p.scheduled_at) >= cutoff)
          : [];
        setPosts(recent);
      })
      .catch(() => { /* no-op */ })
      .finally(() => setLoading(false));
  }, []);

  const counts = new Map<string, number>();
  for (const cat of GLV_CATEGORIES) counts.set(cat, 0);
  for (const p of posts) {
    if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }

  const pieData = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  const zeroCats = GLV_CATEGORIES.filter(c => (counts.get(c) ?? 0) === 0);
  const total = posts.length;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-semibold">Category Balance</h2>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
          Last 30 days
        </span>
      </div>
      <div className="rounded-lg border p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
        ) : total === 0 ? (
          <EmptyState
            icon={<IconFileText size={32} />}
            title="No categorized posts yet"
            sub="Scheduled posts with a 'category' field appear here. Social agent sets this on each post."
          />
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* Pie chart */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`${v as number} posts (${total > 0 ? Math.round((v as number) / total * 100) : 0}%)`, name]}
                    contentStyle={{ fontSize: 11, borderRadius: 6 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend + alerts */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                    />
                    <span className={`flex-1 truncate ${entry.value === 0 ? 'text-muted-foreground' : ''}`}>
                      {entry.name}
                    </span>
                    <span className={`tabular-nums font-medium ${entry.value === 0 ? 'text-muted-foreground' : ''}`}>
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>

              {zeroCats.length > 0 && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                  <span className="font-semibold">Rebalance needed:</span>{' '}
                  {zeroCats.slice(0, 3).join(', ')}
                  {zeroCats.length > 3 && ` + ${zeroCats.length - 3} more`}
                  {' '}— 0 posts in last 30 days.
                </div>
              )}

              <p className="text-[11px] text-muted-foreground">
                {total} categorized post{total !== 1 ? 's' : ''} in the last 30 days
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Best Times widget ---
function BestTimesWidget() {
  const [data, setData] = useState<PlatformBestTimes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/social/best-times')
      .then(r => r.json())
      .then((d: PlatformBestTimes[]) => setData(Array.isArray(d) ? d : []))
      .catch(() => { /* no-op */ })
      .finally(() => setLoading(false));
  }, []);

  const withData = data.filter(p => p.hasData);
  const insufficient = data.filter(p => !p.hasData && p.totalPosts > 0);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-semibold">Best Times to Post</h2>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
          Computed from posted history
        </span>
      </div>
      <div className="rounded-lg border p-4">
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
        ) : withData.length === 0 && insufficient.length === 0 ? (
          <EmptyState
            icon={<IconClock size={32} />}
            title="Insufficient data"
            sub="Need 8+ posted posts per platform to compute recommendations. Keep posting!"
          />
        ) : (
          <div className="space-y-4">
            {withData.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Recommended
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {withData.map(p => (
                    <div key={p.platform} className="rounded-md border bg-muted/10 px-3 py-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <PlatformIcon platform={p.platform} size={13} />
                        <span className="capitalize">{p.platform}</span>
                      </div>
                      {p.recommended && (
                        <p className="text-sm font-semibold text-primary">{p.recommended}</p>
                      )}
                      {p.slots.length > 1 && (
                        <p className="text-[11px] text-muted-foreground">
                          Also: {p.slots.slice(1).map(s => {
                            const amPm = s.hour < 12
                              ? `${s.hour === 0 ? 12 : s.hour}am`
                              : `${s.hour === 12 ? 12 : s.hour - 12}pm`;
                            return `${s.day} ${amPm}`;
                          }).join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insufficient.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Building history (&lt;8 posts)
                </p>
                <div className="flex flex-wrap gap-2">
                  {insufficient.map(p => (
                    <div key={p.platform} className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground">
                      <PlatformIcon platform={p.platform} size={12} />
                      <span className="capitalize">{p.platform}</span>
                      <span className="font-mono">{p.totalPosts}/8</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] text-muted-foreground">
              Based on historical posting times · UTC · Updates daily after scrape
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Browser Session Health widget ---
interface SessionStatus {
  state: 'ok' | 'frozen' | 'dead' | 'unknown';
  frozen_since: string | null;
  last_ok_at: string | null;
  recovery_attempts: number;
}

function BrowserSessionHealth() {
  const [status, setStatus] = useState<SessionStatus | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const res = await fetch('/api/social/session-status');
        const data = await res.json() as SessionStatus;
        setStatus(data);
      } catch { /* no-op */ }
    }
    void poll();
    const id = setInterval(() => void poll(), 30_000);
    return () => clearInterval(id);
  }, []);

  const s = status?.state ?? 'unknown';

  const stateConfig = {
    ok:      { label: 'OK',      bg: 'bg-green-100', text: 'text-green-700',  icon: <IconCheck size={12} /> },
    frozen:  { label: 'FROZEN',  bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <IconAlertCircle size={12} /> },
    dead:    { label: 'DEAD',    bg: 'bg-red-100',    text: 'text-red-600',    icon: <IconAlertCircle size={12} /> },
    unknown: { label: 'UNKNOWN', bg: 'bg-gray-100',   text: 'text-gray-500',   icon: null },
  }[s];

  return (
    <div className="rounded-lg border px-4 py-3 flex items-center gap-4 text-sm">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
        Browser Session
      </span>
      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${stateConfig.bg} ${stateConfig.text}`}>
        {stateConfig.icon}
        {stateConfig.label}
      </span>
      {status && (
        <>
          <span className="text-xs text-muted-foreground">
            Last OK: {fmtTs(status.last_ok_at)}
          </span>
          {status.recovery_attempts > 0 && (
            <span className="text-xs text-yellow-600">
              {status.recovery_attempts} auto-recovery{status.recovery_attempts !== 1 ? 's' : ''} this run
            </span>
          )}
          {s === 'frozen' && status.frozen_since && (
            <span className="text-xs text-yellow-600">
              Frozen since {fmtTs(status.frozen_since)}
            </span>
          )}
        </>
      )}
      <span className="ml-auto text-[11px] text-muted-foreground font-mono">glv-socials</span>
    </div>
  );
}

// --- Content Pipeline kanban ---
const PIPELINE_STAGES: { stage: PipelineStage; label: string; tone: string }[] = [
  { stage: 'idea',      label: 'Ideas',      tone: 'bg-slate-50  dark:bg-slate-900/40 border-slate-300' },
  { stage: 'drafted',   label: 'Drafted',    tone: 'bg-blue-50   dark:bg-blue-950/30   border-blue-300' },
  { stage: 'in_review', label: 'In review',  tone: 'bg-amber-50  dark:bg-amber-950/30  border-amber-300' },
  { stage: 'scheduled', label: 'Scheduled',  tone: 'bg-violet-50 dark:bg-violet-950/30 border-violet-300' },
  { stage: 'posted',    label: 'Posted (7d)',tone: 'bg-green-50  dark:bg-green-950/30  border-green-300' },
];

function ContentPipelineKanban(props: {
  items: ContentPipelineItem[];
  loading: boolean;
}) {
  const { items, loading } = props;

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>;
  }

  const grouped: Record<PipelineStage, ContentPipelineItem[]> = {
    idea: [], drafted: [], in_review: [], scheduled: [], posted: [],
  };
  for (const it of items) grouped[it.stage]?.push(it);

  // Sort within each column: scheduled by scheduled_at asc (soonest first),
  // posted by posted_at desc (newest first), others by updated_at desc.
  grouped.scheduled.sort((a, b) =>
    (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? ''),
  );
  grouped.posted.sort((a, b) =>
    (b.posted_at ?? b.updated_at).localeCompare(a.posted_at ?? a.updated_at),
  );
  for (const s of ['idea', 'drafted', 'in_review'] as PipelineStage[]) {
    grouped[s].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }

  const totalItems = items.length;
  if (totalItems === 0) {
    return (
      <EmptyState
        icon={<IconFileText size={32} />}
        title="Pipeline empty"
        sub="Content agent will write orgs/glv/clients/glv-marketing/socials/content-pipeline.json. Drafts + scheduled + posted entries also populate columns automatically."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {PIPELINE_STAGES.map(({ stage, label, tone }) => {
        const col = grouped[stage];
        return (
          <div key={stage} className={`rounded-lg border ${tone} p-2 min-h-[200px]`}>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{col.length}</span>
            </div>
            {col.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic px-1 py-2">none</p>
            ) : (
              <ul className="space-y-1.5 max-h-[26rem] overflow-y-auto pr-0.5">
                {col.map(it => <KanbanCard key={it.id} item={it} />)}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ item }: { item: ContentPipelineItem }) {
  const dateLabel =
    item.posted_at ? new Date(item.posted_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
    : item.scheduled_at ? new Date(item.scheduled_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : item.updated_at ? item.updated_at.slice(0, 10)
    : '';

  const body = (
    <>
      <p className="text-xs font-medium leading-snug line-clamp-2">{item.title}</p>
      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
        {item.platforms.slice(0, 3).map(p => (
          <PlatformIcon key={p} platform={p} size={10} />
        ))}
        {item.platforms.length > 3 && <span>+{item.platforms.length - 3}</span>}
        {dateLabel && <span className="ml-auto">{dateLabel}</span>}
      </div>
    </>
  );

  return (
    <li className="rounded bg-white dark:bg-gray-900 border border-border/60 px-1.5 py-1.5 shadow-sm">
      {item.post_url ? (
        <a href={item.post_url} target="_blank" rel="noopener noreferrer" className="block hover:underline">
          {body}
        </a>
      ) : body}
    </li>
  );
}

// --- Task at Hand panel ---
interface TaskRow {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee?: string;
  org: string;
  project?: string;
  updated_at?: string;
}

interface AgentRow {
  name: string;
  org: string;
  health: 'healthy' | 'warning' | 'down' | string;
  lastHeartbeat?: string;
  currentTask?: string;
  status?: string;
}

const PRIORITY_TONE: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-300',
  high:   'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-300',
  normal: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
  low:    'bg-slate-50 text-slate-500 dark:bg-slate-900/40 dark:text-slate-400 border-slate-200',
};

const HEALTH_DOT: Record<string, string> = {
  healthy: 'bg-green-500',
  warning: 'bg-yellow-500',
  down:    'bg-red-500',
};

function fmtRelative(iso: string | undefined): string {
  if (!iso) return 'never';
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 'unknown';
  const diff = Date.now() - t;
  if (diff < 60_000) return 'just now';
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function TaskAtHandPanel() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [tRes, aRes] = await Promise.all([
          fetch('/api/tasks?status=in_progress'),
          fetch('/api/agents'),
        ]);
        const [t, a] = await Promise.all([tRes.json(), aRes.json()]);
        if (cancelled) return;
        setTasks(Array.isArray(t) ? t : []);
        setAgents(Array.isArray(a) ? a : []);
        setErr(null);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const interval = setInterval(load, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const grouped = new Map<string, TaskRow[]>();
  const unassigned: TaskRow[] = [];
  for (const t of tasks) {
    if (!t.assignee) { unassigned.push(t); continue; }
    if (!grouped.has(t.assignee)) grouped.set(t.assignee, []);
    grouped.get(t.assignee)!.push(t);
  }
  const orderedAssignees = Array.from(grouped.keys()).sort();

  const sortedAgents = [...agents].sort((a, b) => {
    const rank = (h: string) => h === 'healthy' ? 0 : h === 'warning' ? 1 : 2;
    const r = rank(a.health) - rank(b.health);
    if (r !== 0) return r;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* In-progress tasks */}
      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">In-progress tasks</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{tasks.length}</span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground py-2">Loading…</p>
        ) : err ? (
          <p className="text-xs text-red-600">Failed to load tasks: {err}</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No tasks in progress.</p>
        ) : (
          <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
            {orderedAssignees.map(name => (
              <div key={name}>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  {name} · {grouped.get(name)!.length}
                </p>
                <ul className="space-y-1.5">
                  {grouped.get(name)!.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </ul>
              </div>
            ))}
            {unassigned.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  Unassigned · {unassigned.length}
                </p>
                <ul className="space-y-1.5">
                  {unassigned.map(task => <TaskItem key={task.id} task={task} />)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agent status */}
      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Agent status</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{agents.length}</span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground py-2">Loading…</p>
        ) : err ? (
          <p className="text-xs text-red-600">Failed to load agents: {err}</p>
        ) : agents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No agents registered.</p>
        ) : (
          <ul className="space-y-1.5 max-h-[26rem] overflow-y-auto pr-1">
            {sortedAgents.map(agent => (
              <li key={`${agent.org}/${agent.name}`} className="flex items-start gap-2 rounded border border-border/60 px-2 py-1.5">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${HEALTH_DOT[agent.health] ?? 'bg-slate-400'}`}
                  title={agent.health}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium truncate">{agent.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                      {fmtRelative(agent.lastHeartbeat)}
                    </span>
                  </div>
                  {agent.currentTask ? (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">{agent.currentTask}</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground italic">no current task</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: TaskRow }) {
  const tone = PRIORITY_TONE[task.priority] ?? PRIORITY_TONE.normal;
  return (
    <li className="rounded border border-border/60 px-2 py-1.5 bg-white dark:bg-gray-900">
      <div className="flex items-start gap-2">
        <span className={`shrink-0 mt-0.5 rounded border px-1.5 py-0 text-[10px] uppercase tracking-wide ${tone}`}>
          {task.priority}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-snug line-clamp-2">{task.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
            {task.project && <span className="font-mono">{task.project}</span>}
            {task.org && <span className="font-mono">· {task.org}</span>}
            {task.updated_at && <span className="ml-auto">{fmtRelative(task.updated_at)}</span>}
          </div>
        </div>
      </div>
    </li>
  );
}

// ============================================================
export default function SocialPage() {
  const [channels, setChannels] = useState<SocialChannel[]>([]);
  const [pipeline, setPipeline] = useState<ContentPipeline | null>(null);
  const [reel, setReel] = useState<ReelPipelineState | null>(null);
  const [rollup, setRollup] = useState<WeeklyRollup | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    void load();
    const interval = setInterval(() => void load(true), 30_000);
    return () => clearInterval(interval);
  }, []);

  function fmtDate(iso: string | null) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return iso; }
  }

  function fmtTsLocal(iso: string | null) {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return iso; }
  }


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Social</h1>
          <p className="text-sm text-muted-foreground mt-1">
            8-channel snapshot · Per-account analytics · Queued posts · Content pipeline · Reel state
          </p>
        </div>
        <button
          onClick={() => void load(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-40"
        >
          <IconRefresh size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* PANEL 0 — Task at Hand */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold">Task at Hand</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            In-progress · 60s refresh
          </span>
        </div>
        <TaskAtHandPanel />
      </section>

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
                      <span className="inline-flex items-center justify-end gap-1.5">
                        {ch.liveScrapedAt && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            title={`Live · scraped ${ch.liveScrapedAt}`}
                          />
                        )}
                        {ch.followers === null ? <span className="text-muted-foreground">—</span> : ch.followers}
                      </span>
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
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle mr-1" />
          Followers refreshed every 15 min by channel-stats cron (IG/Threads/X/FB/LinkedIn) · TikTok/YouTube/GBP from baseline audit
        </p>
      </section>

      {/* PANEL 2 — Per-Account Analytics (collapsible) */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold">Per-Account Analytics</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            Daily scrape · 06:00 UTC
          </span>
        </div>
        <div className="space-y-2">
          {PLATFORMS.map(p => (
            <PlatformAnalyticsSection key={p} platform={p} />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Daily metrics from social-analytics-scrape cron · Follower counts with a green dot are refreshed every 15 min by channel-stats cron · Sessions at ~/.cache/agent-browser/sessions/glv-socials
        </p>
        <div className="mt-3">
          <BrowserSessionHealth />
        </div>
      </section>

      {/* PANEL 3 — Queued Posts */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold">Queued Posts</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            Scheduled · Draft · Posted
          </span>
        </div>
        <QueuedPostsPanel />
      </section>

      {/* PANEL 3b — Live Posts (15-min scrape) */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold">Live Posts</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            15-min scrape · likes · comments · views
          </span>
        </div>
        <LivePostsPanel />
      </section>

      {/* PANEL 3c — Content Calendar */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold">Content Calendar</h2>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
            Week · Month
          </span>
        </div>
        <ContentCalendarPanel />
      </section>

      {/* PANEL 4 — Category Balance */}
      <CategoryBalancePanel />

      {/* PANEL 5 — Best Times to Post */}
      <BestTimesWidget />

      {/* PANEL 6 — Content Pipeline (kanban) */}
      <section>
        <h2 className="text-base font-semibold mb-4">Content Pipeline</h2>
        <ContentPipelineKanban
          items={pipeline?.items ?? []}
          loading={loading}
        />
      </section>

      {/* PANEL 7 — Reel Pipeline State */}
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
                <p className="text-sm font-medium">{fmtTsLocal(reel.lastRunTimestamp)}</p>
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

      {/* PANEL 8 — Weekly Performance Rollup */}
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
