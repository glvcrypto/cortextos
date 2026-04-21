'use client';

import { useEffect, useState, useCallback } from 'react';
import { IconRefresh, IconExternalLink, IconCircleCheck, IconCircleX, IconCircleDashed, IconClock } from '@tabler/icons-react';

interface DeployRun {
  id: number;
  run_number: number;
  name: string;
  status: string;
  conclusion: string | null;
  branch: string;
  sha: string;
  commit_message: string;
  event: string;
  created_at: string;
  updated_at: string;
  duration_sec: number | null;
  url: string;
}

interface RepoRuns {
  repo: string;
  label: string;
  runs: DeployRun[];
}

function statusInfo(run: DeployRun): { label: string; color: string; icon: React.ReactNode } {
  if (run.status === 'in_progress') return {
    label: 'Running',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: <IconClock size={13} className="animate-pulse" />,
  };
  if (run.status === 'queued') return {
    label: 'Queued',
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    icon: <IconCircleDashed size={13} />,
  };
  if (run.conclusion === 'success') return {
    label: 'Passed',
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: <IconCircleCheck size={13} />,
  };
  if (run.conclusion === 'failure') return {
    label: 'Failed',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: <IconCircleX size={13} />,
  };
  if (run.conclusion === 'cancelled') return {
    label: 'Cancelled',
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    icon: <IconCircleDashed size={13} />,
  };
  return {
    label: run.conclusion ?? run.status,
    color: 'text-muted-foreground bg-muted border',
    icon: <IconCircleDashed size={13} />,
  };
}

function formatDuration(sec: number | null): string {
  if (sec === null) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DeploysPage() {
  const [repos, setRepos] = useState<RepoRuns[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/deploys?limit=5');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRepos(data);
        setLastRefresh(new Date());
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, load]);

  const hasActiveRun = repos.some((r) =>
    r.runs.some((run) => run.status === 'in_progress' || run.status === 'queued')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Deploys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            GitHub Actions workflow runs across client repos.
            {lastRefresh && (
              <span className="ml-2 text-xs">
                Last refresh: {timeAgo(lastRefresh.toISOString())}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-primary"
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border rounded px-2.5 py-1.5 transition-colors"
          >
            <IconRefresh size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {hasActiveRun && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm text-blue-700">
          <IconClock size={14} className="animate-pulse shrink-0" />
          <span>Deploy in progress — auto-refreshing every 30s.</span>
        </div>
      )}

      {loading && repos.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm py-16">Loading workflow runs...</div>
      ) : (
        <div className="space-y-6">
          {repos.map(({ repo, label, runs }) => (
            <div key={repo} className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b">
                <div>
                  <span className="font-medium text-sm">{label}</span>
                  <span className="text-xs text-muted-foreground ml-2">glvcrypto/{repo}</span>
                </div>
                {runs[0] && (
                  <span className={`inline-flex items-center gap-1 text-xs border rounded-full px-2 py-0.5 font-medium ${statusInfo(runs[0]).color}`}>
                    {statusInfo(runs[0]).icon}
                    {statusInfo(runs[0]).label}
                  </span>
                )}
              </div>
              {runs.length === 0 ? (
                <div className="px-4 py-6 text-center text-muted-foreground text-sm">No workflow runs found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground uppercase tracking-wide bg-muted/20">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium w-24">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Commit</th>
                      <th className="px-4 py-2 text-left font-medium hidden sm:table-cell">Branch</th>
                      <th className="px-4 py-2 text-right font-medium hidden md:table-cell">Duration</th>
                      <th className="px-4 py-2 text-right font-medium">Triggered</th>
                      <th className="px-4 py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {runs.map((run) => {
                      const si = statusInfo(run);
                      return (
                        <tr key={run.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 text-xs border rounded-full px-2 py-0.5 font-medium ${si.color}`}>
                              {si.icon}
                              {si.label}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 max-w-xs">
                            <span className="font-mono text-xs text-muted-foreground mr-2">{run.sha}</span>
                            <span className="text-xs truncate">{run.commit_message || '—'}</span>
                          </td>
                          <td className="px-4 py-2.5 hidden sm:table-cell">
                            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{run.branch}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-xs text-muted-foreground hidden md:table-cell">
                            {formatDuration(run.duration_sec)}
                          </td>
                          <td className="px-4 py-2.5 text-right text-xs text-muted-foreground whitespace-nowrap">
                            {timeAgo(run.created_at)}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <a
                              href={run.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <IconExternalLink size={13} />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
