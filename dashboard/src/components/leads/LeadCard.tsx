'use client';

import { Card } from '@/components/ui/card';
import { TimeAgo } from '@/components/shared';
import { IconBuilding, IconMail, IconPhone } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import type { Lead } from '@/lib/types';

const priorityDot: Record<string, string> = {
  critical: 'bg-red-500',
  urgent: 'bg-orange-500',
  high: 'bg-yellow-500',
  normal: 'bg-blue-400',
  low: 'bg-muted-foreground/40',
};

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: Lead['status']) => void;
  onDelete: (id: string) => void;
}

export function LeadCard({ lead, onStatusChange: _onStatusChange, onDelete: _onDelete }: LeadCardProps) {
  return (
    <Card className={cn('p-3 cursor-default hover:bg-muted/30 transition-colors text-left')}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-xs font-semibold leading-snug line-clamp-2 flex-1">
          {lead.business_name}
        </p>
        <span className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', priorityDot[lead.priority])} />
      </div>

      {(lead.area || lead.niche) && (
        <p className="text-[10px] text-muted-foreground mb-1.5 truncate">
          {[lead.niche, lead.area, lead.province].filter(Boolean).join(' · ')}
        </p>
      )}

      {lead.contact_name && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
          <IconBuilding size={10} />
          <span className="truncate">{lead.contact_name}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-1.5">
        {lead.contact_email && (
          <a
            href={`mailto:${lead.contact_email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground/60 hover:text-primary transition-colors"
          >
            <IconMail size={11} />
          </a>
        )}
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground/60 hover:text-primary transition-colors"
          >
            <IconPhone size={11} />
          </a>
        )}
        <TimeAgo date={lead.created_at} className="text-[10px] text-muted-foreground/50 ml-auto" />
      </div>
    </Card>
  );
}
