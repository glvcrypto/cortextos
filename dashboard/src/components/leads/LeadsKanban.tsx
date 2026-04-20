'use client';

import { useState, useCallback } from 'react';
import { LeadCard } from './LeadCard';
import { IconPlus } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { Lead, LeadStatus } from '@/lib/types';

const COLUMNS: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'scouted',    label: 'Scouted',    color: 'border-t-slate-400' },
  { status: 'researched', label: 'Researched', color: 'border-t-blue-400' },
  { status: 'contacted',  label: 'Contacted',  color: 'border-t-violet-400' },
  { status: 'responded',  label: 'Responded',  color: 'border-t-amber-400' },
  { status: 'meeting',    label: 'Meeting',    color: 'border-t-orange-400' },
  { status: 'client',     label: 'Client',     color: 'border-t-green-400' },
  { status: 'lost',       label: 'Lost',       color: 'border-t-red-400' },
];

interface LeadsKanbanProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddLead: (status: LeadStatus) => void;
}

export function LeadsKanban({ leads, onStatusChange, onDelete, onAddLead }: LeadsKanbanProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);

  const byStatus = useCallback(
    (status: LeadStatus) => leads.filter((l) => l.status === status),
    [leads]
  );

  function handleDragStart(e: React.DragEvent, leadId: string) {
    setDragging(leadId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverCol(status);
  }

  function handleDrop(e: React.DragEvent, status: LeadStatus) {
    e.preventDefault();
    if (dragging) onStatusChange(dragging, status);
    setDragging(null);
    setOverCol(null);
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[60vh]">
      {COLUMNS.map(({ status, label, color }) => {
        const colLeads = byStatus(status);
        const isOver = overCol === status;

        return (
          <div
            key={status}
            className={cn(
              'flex w-48 shrink-0 flex-col rounded-lg border border-t-2 bg-muted/20 transition-colors',
              color,
              isOver && 'bg-primary/5 border-primary/30'
            )}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={() => setOverCol(null)}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
              <span className="rounded-full bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                {colLeads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
              {colLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  onDragEnd={() => { setDragging(null); setOverCol(null); }}
                  className={cn('rounded-lg transition-opacity', dragging === lead.id && 'opacity-40')}
                >
                  <LeadCard lead={lead} onStatusChange={onStatusChange} onDelete={onDelete} />
                </div>
              ))}

              {/* Add button */}
              <button
                onClick={() => onAddLead(status)}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground/50 hover:bg-muted/60 hover:text-muted-foreground transition-colors"
              >
                <IconPlus size={11} />
                Add
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
