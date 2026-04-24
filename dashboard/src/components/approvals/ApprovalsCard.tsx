'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrg } from '@/hooks/use-org';

interface PendingApproval {
  id: string;
  type: string;
  description: string;
  queued_at: string;
  age_minutes: number | null;
}

interface ApprovalsData {
  pending: PendingApproval[];
  avg_decision_time_by_type: Record<string, number>;
}

function formatAge(minutes: number | null): string {
  if (minutes === null || isNaN(minutes)) return '?';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatAvg(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function ageBadgeVariant(minutes: number | null): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (minutes === null) return 'outline';
  if (minutes >= 240) return 'destructive';   // >4h → red
  if (minutes >= 120) return 'secondary';      // >2h → yellow-ish
  return 'outline';
}

export function ApprovalsCard() {
  const { currentOrg } = useOrg();
  const [data, setData] = useState<ApprovalsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const orgParam = currentOrg !== 'all' ? `?org=${currentOrg}` : '';
    try {
      const res = await fetch(`/api/approvals/pending${orgParam}`);
      if (res.ok) setData(await res.json());
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [currentOrg]);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const pending = data?.pending ?? [];
  const avgTimes = data?.avg_decision_time_by_type ?? {};

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          Pending Approvals
          {pending.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {pending.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-xs text-muted-foreground">No pending approvals</p>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 text-xs text-muted-foreground font-medium pb-1 border-b">
              <span>Type / Description</span>
              <span>Queued</span>
              <span>Age</span>
            </div>
            {pending.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xs"
              >
                <div className="truncate">
                  <span className="font-medium capitalize">{item.type}</span>
                  {item.description && (
                    <span className="text-muted-foreground ml-1 truncate">
                      — {item.description}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground whitespace-nowrap">
                  {item.queued_at
                    ? new Date(item.queued_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </span>
                <Badge variant={ageBadgeVariant(item.age_minutes)} className="text-xs">
                  {formatAge(item.age_minutes)}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {Object.keys(avgTimes).length > 0 && (
          <div className="pt-2 border-t space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Avg decision time (7d)
            </p>
            {Object.entries(avgTimes).map(([type, avg]) => (
              <div key={type} className="flex justify-between text-xs">
                <span className="capitalize text-muted-foreground">{type}</span>
                <span>{formatAvg(avg)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
