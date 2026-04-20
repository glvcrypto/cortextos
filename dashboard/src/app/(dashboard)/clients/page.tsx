'use client';

import { useEffect, useState, useCallback } from 'react';
import { useOrg } from '@/hooks/use-org';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconCurrencyDollar,
  IconRefresh,
} from '@tabler/icons-react';

interface Deliverables {
  [key: string]: 'pending' | 'in-progress' | 'complete' | 'blocked' | 'n/a' | 'skipped' | string;
}

interface Contract {
  seo?: boolean;
  dev?: boolean;
  content?: boolean;
  ads?: boolean;
  automation?: boolean;
  custom_ai?: boolean;
}

interface RecentEvent {
  id: string;
  timestamp: string;
  agent: string;
  type: string;
  message: string | null;
  severity: string;
}

interface Client {
  id: string;
  org: string;
  display_name: string;
  stage: string;
  retainer_mrr: number;
  retainer_health: string;
  contract: Contract;
  deliverables: Deliverables;
  blockers: string[];
  notes: string | null;
  updated_at: string | null;
  recent_events: RecentEvent[];
  open_tasks: number;
  blocked_tasks: number;
}

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  onboarding: 'Onboarding',
  'active-retainer': 'Active Retainer',
  'active-project': 'Active Project',
  maintenance: 'Maintenance',
  sandbox: 'Sandbox',
  churned: 'Churned',
};

const STAGE_COLORS: Record<string, string> = {
  prospect: 'bg-gray-100 text-gray-700',
  onboarding: 'bg-blue-100 text-blue-700',
  'active-retainer': 'bg-green-100 text-green-700',
  'active-project': 'bg-cyan-100 text-cyan-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  sandbox: 'bg-purple-100 text-purple-700',
  churned: 'bg-red-100 text-red-700',
};

const HEALTH_COLORS: Record<string, string> = {
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  unpaid: 'text-gray-400',
  none: 'text-gray-300',
};

const DELIVERABLE_LABELS: Record<string, string> = {
  '8-pillar-research': '8-Pillar Research',
  avatar: 'Avatar',
  positioning: 'Positioning',
  'voice-doc': 'Voice Doc',
  'site-audit': 'Site Audit',
  'content-plan': 'Content Plan',
  kickoff: 'Kickoff',
  'site-build': 'Site Build',
};

function deliverableProgress(deliverables: Deliverables): number {
  const values = Object.values(deliverables).filter((v) => v !== 'n/a' && v !== 'skipped');
  if (!values.length) return 0;
  const done = values.filter((v) => v === 'complete').length;
  return Math.round((done / values.length) * 100);
}

function DeliverableStatus({ status }: { status: string }) {
  if (status === 'complete') return <IconCircleCheck size={14} className="text-green-500 shrink-0" />;
  if (status === 'in-progress') return <IconClock size={14} className="text-blue-500 shrink-0" />;
  if (status === 'blocked') return <IconAlertTriangle size={14} className="text-red-500 shrink-0" />;
  if (status === 'n/a' || status === 'skipped') return <span className="text-[10px] text-muted-foreground">—</span>;
  return <span className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 inline-block shrink-0" />;
}

function ClientCard({ client }: { client: Client }) {
  const progress = deliverableProgress(client.deliverables);
  const activeServices = Object.entries(client.contract)
    .filter(([, v]) => v)
    .map(([k]) => k.replace('_', ' ').replace('custom ai', 'AI'));

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{client.display_name}</CardTitle>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STAGE_COLORS[client.stage] ?? 'bg-gray-100 text-gray-600'}`}>
                {STAGE_LABELS[client.stage] ?? client.stage}
              </span>
              {activeServices.map((s) => (
                <span key={s} className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-primary/10 text-primary capitalize">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            {client.retainer_mrr > 0 ? (
              <div className="flex items-center gap-0.5 text-sm font-semibold text-foreground">
                <IconCurrencyDollar size={14} />
                {client.retainer_mrr.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">unpaid</span>
            )}
            <div className={`text-xs font-medium mt-0.5 capitalize ${HEALTH_COLORS[client.retainer_health] ?? ''}`}>
              {client.retainer_health !== 'none' ? client.retainer_health : '—'}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-0">
        {/* Deliverables */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Deliverables</span>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5 mb-2" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(DELIVERABLE_LABELS).map(([key, label]) => {
              const status = client.deliverables[key] ?? 'pending';
              if (status === 'n/a') return null;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <DeliverableStatus status={status} />
                  <span className="text-xs text-muted-foreground truncate">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blockers */}
        {(client.blockers.length > 0 || client.blocked_tasks > 0) && (
          <>
            <Separator />
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-1.5">
                <IconAlertTriangle size={11} className="text-yellow-500" />
                Blockers
              </span>
              <div className="flex flex-col gap-1">
                {client.blockers.map((b, i) => (
                  <span key={i} className="text-xs text-yellow-700 bg-yellow-50 rounded px-2 py-0.5">
                    {b.replace(/-/g, ' ')}
                  </span>
                ))}
                {client.blocked_tasks > 0 && (
                  <span className="text-xs text-red-700 bg-red-50 rounded px-2 py-0.5">
                    {client.blocked_tasks} blocked task{client.blocked_tasks !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {/* Open tasks */}
        {client.open_tasks > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{client.open_tasks} open task{client.open_tasks !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <>
            <Separator />
            <p className="text-xs text-muted-foreground leading-relaxed">{client.notes}</p>
          </>
        )}

        {/* Recent activity */}
        {client.recent_events.length > 0 && (
          <>
            <Separator />
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Recent Activity</span>
              <div className="flex flex-col gap-1">
                {client.recent_events.slice(0, 3).map((e) => (
                  <div key={e.id} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="shrink-0 mt-0.5 text-[10px] text-muted-foreground/50">
                      {new Date(e.timestamp).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="truncate">{e.message ?? e.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function ClientsPage() {
  const { currentOrg } = useOrg();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentOrg && currentOrg !== 'all') params.set('org', currentOrg);
      const res = await fetch(`/api/clients?${params.toString()}`);
      const data = await res.json();
      setClients(data.clients ?? []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  }, [currentOrg]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const paying = clients.filter((c) => c.retainer_mrr > 0);
  const nonPaying = clients.filter((c) => c.retainer_mrr === 0);
  const totalMrr = paying.reduce((sum, c) => sum + c.retainer_mrr, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Client Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {clients.length} client{clients.length !== 1 ? 's' : ''} · ${totalMrr.toLocaleString()}/mo MRR
          </p>
        </div>
        <button
          onClick={fetchClients}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconRefresh size={14} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading clients...</div>
      )}

      {!loading && clients.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No clients found. Add pipeline.json files to orgs/{currentOrg || 'glv'}/clients/*/
        </div>
      )}

      {/* Paying clients */}
      {paying.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
            Active Retainers
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paying.map((c) => <ClientCard key={c.id} client={c} />)}
          </div>
        </div>
      )}

      {/* Non-paying clients */}
      {nonPaying.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
            Non-Retainer
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nonPaying.map((c) => <ClientCard key={c.id} client={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
