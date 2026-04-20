'use client';

import { useEffect, useState, useCallback } from 'react';
import { useOrg } from '@/hooks/use-org';
import { LeadsKanban } from '@/components/leads/LeadsKanban';
import { CreateLeadDialog } from '@/components/leads/CreateLeadDialog';
import { Button } from '@/components/ui/button';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { Lead, LeadStatus } from '@/lib/types';

export default function LeadsPage() {
  const { currentOrg } = useOrg();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<LeadStatus>('scouted');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const orgParam = currentOrg !== 'all' ? `?org=${currentOrg}` : '';
      const res = await fetch(`/api/leads${orgParam}`);
      if (res.ok) setLeads(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [currentOrg]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch { await fetchLeads(); }
  }

  async function handleDelete(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    } catch { await fetchLeads(); }
  }

  function handleAddLead(status: LeadStatus) {
    setDialogStatus(status);
    setDialogOpen(true);
  }

  function handleLeadCreated(lead: Lead) {
    setLeads((prev) => [lead, ...prev]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} in pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchLeads} disabled={loading}>
            <IconRefresh size={15} className={cn('mr-1.5', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => handleAddLead('scouted')}>
            <IconPlus size={14} className="mr-1.5" />
            Add Lead
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-64 w-48 shrink-0 rounded-lg bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <LeadsKanban
          leads={leads}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddLead={handleAddLead}
        />
      )}

      {dialogOpen && (
        <CreateLeadDialog
          org={currentOrg !== 'all' ? currentOrg : 'glv'}
          defaultStatus={dialogStatus}
          onClose={() => setDialogOpen(false)}
          onCreated={handleLeadCreated}
        />
      )}
    </div>
  );
}
