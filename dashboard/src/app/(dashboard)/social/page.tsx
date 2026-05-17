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
import type { SocialChannel, ContentPipeline, ReelPipelineState, WeeklyRollup, DraftItem, RenderItem } from '@/lib/data/social';
import type { PlatformTimeseries, Platform } from '@/lib/data/social-analytics';
import type { ScheduledPost, PostStatus } from '@/lib/data/social-scheduled';
import { GLV_CATEGORIES } from '@/lib/data/social-scheduled';

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
        {latest && (
          <span className="text-sm tabular-nums font-medium ml-4">
            {fmtK(latest.followers)} followers
          </span>
        )}
        {!latest && !loading && (
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
                  { label: 'Followers', value: latest?.followers },
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

// --- Queued Posts panel ---
function QueuedPostsPanel() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'platform' | 'status'>('date');
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

  useEffect(() => { void load(); }, [load]);

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

  const visible = posts
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
          className="rounded-md border px-2 py-1 text-xs focus:outline-none"
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
                    formatter={(v: number, name: string) => [`${v} posts (${total > 0 ? Math.round(v / total * 100) : 0}%)`, name]}
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

// ============================================================
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
          Data collected by social-analytics-scrape cron · Sessions at ~/.cache/agent-browser/sessions/glv-socials
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

      {/* PANEL 4 — Category Balance */}
      <CategoryBalancePanel />

      {/* PANEL 5 — Best Times to Post */}
      <BestTimesWidget />

      {/* PANEL 6 — Content Pipeline */}
      <section>
        <h2 className="text-base font-semibold mb-4">Content Pipeline</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

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

          <div className="rounded-lg border p-4">
            <SectionHeader title="Scheduled (next 7 days)" count={0} />
            <EmptyState
              icon={<IconClock size={32} />}
              title="No scheduled posts"
              sub="Social agent will write scheduled.json once Blotato account IDs land in secrets.env"
            />
          </div>

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
