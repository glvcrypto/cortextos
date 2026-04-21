'use client';

import { useEffect, useState } from 'react';
import { useOrg } from '@/hooks/use-org';
import type { OutreachSummaryRow, OutreachEvent, PipelineStageCount } from '@/lib/data/outreach';

interface OutreachStats {
  total_sent: number;
  total_replies: number;
  total_meetings: number;
  reply_rate: number;
  cities: number;
  industries: number;
}

interface PipelineData {
  stages: PipelineStageCount[];
  total_active: number;
  cities: string[];
  industries: string[];
  tiers: string[];
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

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs border rounded px-2 py-1 bg-background text-foreground"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function OutreachPage() {
  const { currentOrg } = useOrg();
  const org = currentOrg !== 'all' ? currentOrg : undefined;

  const [stats, setStats] = useState<OutreachStats | null>(null);
  const [summary, setSummary] = useState<OutreachSummaryRow[]>([]);
  const [events, setEvents] = useState<OutreachEvent[]>([]);
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [tab, setTab] = useState<'pipeline' | 'summary' | 'log'>('pipeline');
  const [loading, setLoading] = useState(true);

  const [filterCity, setFilterCity] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterTier, setFilterTier] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const oq = org ? `&org=${encodeURIComponent(org)}` : '';
      const pq = [
        filterCity ? `&city=${encodeURIComponent(filterCity)}` : '',
        filterIndustry ? `&industry=${encodeURIComponent(filterIndustry)}` : '',
        filterTier ? `&tier=${encodeURIComponent(filterTier)}` : '',
      ].join('');

      const [statsRes, summaryRes, eventsRes, pipelineRes] = await Promise.all([
        fetch(`/api/outreach?view=stats${oq}`),
        fetch(`/api/outreach?view=summary${oq}`),
        fetch(`/api/outreach?view=events${oq}`),
        fetch(`/api/outreach?view=pipeline${pq}`),
      ]);
      const [s, sum, ev, pip] = await Promise.all([
        statsRes.json(),
        summaryRes.json(),
        eventsRes.json(),
        pipelineRes.json(),
      ]);
      setStats(s);
      setSummary(Array.isArray(sum) ? sum : []);
      setEvents(Array.isArray(ev) ? ev : []);
      setPipeline(pip && typeof pip === 'object' ? pip : null);
      setLoading(false);
    }
    load();
  }, [org, filterCity, filterIndustry, filterTier]);

  function formatDate(iso: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const sentEvents = events.filter((e) => e.type === 'email_sent');

  const maxStageCount = Math.max(1, ...(pipeline?.stages.map((s) => s.count) ?? [1]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Outreach</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cold email pipeline — managed by the prospector agent.
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
        {(['pipeline', 'summary', 'log'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'pipeline' ? 'Pipeline' : t === 'summary' ? 'By City / Industry' : 'Email Log'}
          </button>
        ))}
      </div>

      {/* Pipeline tab */}
      {tab === 'pipeline' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <FilterSelect
              label="City"
              value={filterCity}
              options={pipeline?.cities ?? []}
              onChange={setFilterCity}
            />
            <FilterSelect
              label="Industry"
              value={filterIndustry}
              options={pipeline?.industries ?? []}
              onChange={setFilterIndustry}
            />
            <FilterSelect
              label="Tier"
              value={filterTier}
              options={pipeline?.tiers ?? ['A', 'B', 'C']}
              onChange={setFilterTier}
            />
            {(filterCity || filterIndustry || filterTier) && (
              <button
                onClick={() => { setFilterCity(''); setFilterIndustry(''); setFilterTier(''); }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear filters
              </button>
            )}
            {pipeline && (
              <span className="text-xs text-muted-foreground ml-auto">
                {pipeline.total_active} active prospect{pipeline.total_active !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Stage funnel */}
          {loading ? (
            <div className="text-center text-muted-foreground text-sm py-12">Loading...</div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium w-36">Stage</th>
                    <th className="px-4 py-2.5 text-right font-medium w-20">Count</th>
                    <th className="px-4 py-2.5 text-left font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(pipeline?.stages ?? []).map((stage) => {
                    const pct = Math.round((stage.count / maxStageCount) * 100);
                    const isMeeting = stage.stage === 'meeting_booked';
                    return (
                      <tr key={stage.stage} className={isMeeting ? 'bg-green-50 dark:bg-green-950/20' : 'hover:bg-muted/20 transition-colors'}>
                        <td className={`px-4 py-3 font-medium ${isMeeting ? 'text-green-700 dark:text-green-400' : ''}`}>
                          {stage.label}
                          {isMeeting && ' ★'}
                        </td>
                        <td className={`px-4 py-3 text-right tabular-nums font-semibold ${isMeeting ? 'text-green-700 dark:text-green-400' : ''}`}>
                          {stage.count}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isMeeting ? 'bg-green-500' : 'bg-primary/60'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(pipeline?.stages ?? []).every((s) => s.count === 0) && (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No prospects in pipeline yet. Registry populates as batch sends go out.
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
