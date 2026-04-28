'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrg } from '@/hooks/use-org';

interface WeeklyRollup {
  posted: number;
  adopted: number;
  modified: number;
  rejected: number;
  superseded: number;
  pending: number;
}

interface AdoptionData {
  weekly_rollup: WeeklyRollup;
  adoption_rate_14d: number | null;
  total_proposals_14d: number;
}

function TrendArrow({ rate }: { rate: number | null }) {
  if (rate === null) return <span className="text-muted-foreground">—</span>;
  if (rate >= 40) return <span className="text-green-500">↑</span>;
  if (rate >= 25) return <span className="text-yellow-500">→</span>;
  return <span className="text-red-500">↓</span>;
}

function rateColor(rate: number | null): string {
  if (rate === null) return 'text-muted-foreground';
  if (rate >= 40) return 'text-green-600 dark:text-green-400';
  if (rate >= 25) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function ProposalKPICard({ agent = 'scout' }: { agent?: string }) {
  const { currentOrg } = useOrg();
  const [data, setData] = useState<AdoptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const params = new URLSearchParams({ agent });
    if (currentOrg !== 'all') params.set('org', currentOrg);
    try {
      const res = await fetch(`/api/proposals/adoption?${params.toString()}`);
      if (res.ok) setData(await res.json());
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [currentOrg, agent]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 120_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const rollup = data?.weekly_rollup;
  const rate = data?.adoption_rate_14d ?? null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          Proposal Adoption KPI
          <span className="text-xs text-muted-foreground font-normal ml-auto">14d</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : !data ? (
          <p className="text-xs text-muted-foreground">No data</p>
        ) : (
          <>
            {/* 14-day adoption rate headline */}
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${rateColor(rate)}`}>
                {rate !== null ? `${rate}%` : '—'}
              </span>
              <TrendArrow rate={rate} />
              <span className="text-xs text-muted-foreground">adoption rate</span>
            </div>

            {/* Weekly breakdown */}
            {rollup && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">This week</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-medium">{rollup.posted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium text-muted-foreground">{rollup.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 dark:text-green-400">Adopted</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {rollup.adopted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600 dark:text-yellow-400">Modified</span>
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                      {rollup.modified}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Rejected</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {rollup.rejected}
                    </span>
                  </div>
                  {rollup.superseded > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Superseded</span>
                      <span className="font-medium">{rollup.superseded}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Target reminder */}
            <p className="text-[11px] text-muted-foreground border-t pt-2">
              Target: ≥40% adoption, &lt;30% rejected
              {rate !== null && rate < 40 && (
                <Badge variant="outline" className="ml-2 text-[10px] py-0">
                  below target
                </Badge>
              )}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
