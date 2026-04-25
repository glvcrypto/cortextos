'use client';

import { useEffect, useState } from 'react';
import { useOrg } from '@/hooks/use-org';
import { IconMail, IconMessageCircle, IconCalendarCheck, IconBuildingStore } from '@tabler/icons-react';
import type { OutreachSummaryRow, OutreachEvent } from '@/lib/data/outreach';

interface OutreachStats {
  total_sent: number;
  total_replies: number;
  total_meetings: number;
  reply_rate: number;
  cities: number;
  industries: number;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default function OutreachPage() {
  const { currentOrg } = useOrg();
  const org = currentOrg !== 'all' ? currentOrg : undefined;

  const [stats, setStats] = useState<OutreachStats | null>(null);
  const [summary, setSummary] = useState<OutreachSummaryRow[]>([]);
  const [events, setEvents] = useState<OutreachEvent[]>([]);
  const [tab, setTab] = useState<'summary' | 'log'>('summary');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [statsRes, summaryRes, eventsRes] = await Promise.all([
        fetch(`/api/outreach?view=stats${org ? `&org=${encodeURIComponent(org)}` : ''}`),
        fetch(`/api/outreach?view=summary${org ? `&org=${encodeURIComponent(org)}` : ''}`),
        fetch(`/api/outreach?view=events${org ? `&org=${encodeURIComponent(org)}` : ''}`),
      ]);
      const [s, sum, ev] = await Promise.all([statsRes.json(), summaryRes.json(), eventsRes.json()]);
      setStats(s);
      setSummary(Array.isArray(sum) ? sum : []);
      setEvents(Array.isArray(ev) ? ev : []);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [org]);

  function formatDate(iso: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const sentEvents = events.filter((e) => e.type === 'email_sent');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Outreach</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cold email pipeline — sent by the prospector agent.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Sent" value={loading ? '—' : (stats?.total_sent ?? 0)} />
        <StatCard label="Replies" value={loading ? '—' : (stats?.total_replies ?? 0)} />
        <StatCard label="Meetings" value={loading ? '—' : (stats?.total_meetings ?? 0)} />
        <StatCard label="Reply Rate" value={loading ? '—' : `${stats?.reply_rate ?? 0}%`} />
        <StatCard label="Cities" value={loading ? '—' : (stats?.cities ?? 0)} />
        <StatCard label="Industries" value={loading ? '—' : (stats?.industries ?? 0)} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['summary', 'log'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'summary' ? 'By City / Industry' : 'Email Log'}
          </button>
        ))}
      </div>

      {/* Summary table */}
      {tab === 'summary' && (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">City</th>
                <th className="px-4 py-2.5 text-left font-medium">Industry</th>
                <th className="px-4 py-2.5 text-right font-medium">Sent</th>
                <th className="px-4 py-2.5 text-right font-medium">Replies</th>
                <th className="px-4 py-2.5 text-right font-medium">Meetings</th>
                <th className="px-4 py-2.5 text-right font-medium">Reply %</th>
                <th className="px-4 py-2.5 text-right font-medium">Last Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    Loading...
                  </td>
                </tr>
              ) : summary.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No emails sent yet. Approve emails in the review gate to start tracking.
                  </td>
                </tr>
              ) : (
                summary.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 font-medium capitalize">{row.city || '—'}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{row.industry || '—'}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.sent}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.replies}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{row.meetings}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      <span
                        className={
                          row.reply_rate >= 10
                            ? 'text-green-600 font-medium'
                            : row.reply_rate > 0
                            ? 'text-yellow-600'
                            : 'text-muted-foreground'
                        }
                      >
                        {row.reply_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground text-xs">
                      {formatDate(row.last_sent)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Email log */}
      {tab === 'log' && (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-left font-medium">To</th>
                <th className="px-4 py-2.5 text-left font-medium">City</th>
                <th className="px-4 py-2.5 text-left font-medium">Industry</th>
                <th className="px-4 py-2.5 text-left font-medium">Hook</th>
                <th className="px-4 py-2.5 text-left font-medium">Structure</th>
                <th className="px-4 py-2.5 text-left font-medium">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    Loading...
                  </td>
                </tr>
              ) : sentEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No emails sent yet.
                  </td>
                </tr>
              ) : (
                sentEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(e.timestamp)}
                    </td>
                    <td className="px-4 py-2 font-medium">{e.decision_maker || e.email || '—'}</td>
                    <td className="px-4 py-2 capitalize text-muted-foreground">{e.city || '—'}</td>
                    <td className="px-4 py-2 capitalize text-muted-foreground">{e.industry || '—'}</td>
                    <td className="px-4 py-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {e.hook_variant || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {e.structure_variant || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground capitalize">{e.channel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
