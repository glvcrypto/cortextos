// cortextOS Dashboard - Outreach data fetcher
// Reads email_sent / reply_received / meeting_booked events logged by the prospector agent.

import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';

export interface OutreachEvent {
  id: string;
  timestamp: string;
  agent: string;
  org: string;
  type: string;
  city: string;
  industry: string;
  prospect_id: string;
  email: string;
  hook_variant: string;
  hook_family: string;
  structure_variant: string;
  batch_id: string;
  channel: string;
  decision_maker?: string;
  subject?: string;
}

export interface OutreachSummaryRow {
  city: string;
  industry: string;
  sent: number;
  replies: number;
  meetings: number;
  reply_rate: number;
  last_sent: string;
}

function parseOutreachEvent(row: Record<string, unknown>): OutreachEvent | null {
  let data: Record<string, unknown> = {};
  try {
    data = row.data ? JSON.parse(row.data as string) : {};
  } catch {
    return null;
  }

  return {
    id: row.id as string,
    timestamp: row.timestamp as string,
    agent: row.agent as string,
    org: row.org as string,
    type: row.type as string,
    city: (data.city as string) ?? '',
    industry: (data.industry as string) ?? '',
    prospect_id: (data.prospect_id as string) ?? '',
    email: (data.email as string) ?? '',
    hook_variant: (data.hook_variant as string) ?? '',
    hook_family: (data.hook_family as string) ?? '',
    structure_variant: (data.structure_variant as string) ?? '',
    batch_id: (data.batch_id as string) ?? '',
    channel: (data.channel as string) ?? 'email',
    decision_maker: (data.decision_maker as string) ?? undefined,
    subject: (data.subject as string) ?? undefined,
  };
}

export function getOutreachEvents(org?: string, limit = 500): OutreachEvent[] {
  const conditions = ["type IN ('email_sent', 'reply_received', 'meeting_booked')"];
  const params: (string | number)[] = [];

  if (org) {
    conditions.push('org = ?');
    params.push(org);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  try {
    const rows = db
      .prepare(
        `SELECT id, timestamp, agent, org, type, data
         FROM events ${where}
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      .all(...params, limit) as Record<string, unknown>[];

    return rows.map(parseOutreachEvent).filter((e): e is OutreachEvent => e !== null);
  } catch (err) {
    console.error('[data/outreach] getOutreachEvents error:', err);
    return [];
  }
}

export function getOutreachSummary(org?: string): OutreachSummaryRow[] {
  const events = getOutreachEvents(org);

  // Group by city + industry
  const map = new Map<string, { sent: number; replies: number; meetings: number; last_sent: string }>();

  for (const e of events) {
    const key = `${e.city}|||${e.industry}`;
    const existing = map.get(key) ?? { sent: 0, replies: 0, meetings: 0, last_sent: '' };

    if (e.type === 'email_sent') {
      existing.sent++;
      if (!existing.last_sent || e.timestamp > existing.last_sent) {
        existing.last_sent = e.timestamp;
      }
    } else if (e.type === 'reply_received') {
      existing.replies++;
    } else if (e.type === 'meeting_booked') {
      existing.meetings++;
    }

    map.set(key, existing);
  }

  return Array.from(map.entries())
    .map(([key, stats]) => {
      const [city, industry] = key.split('|||');
      return {
        city,
        industry,
        ...stats,
        reply_rate: stats.sent > 0 ? Math.round((stats.replies / stats.sent) * 100) : 0,
      };
    })
    .sort((a, b) => b.last_sent.localeCompare(a.last_sent));
}

// ── Prospect registry (read from file) ──────────────────────────────────────

const REGISTRY_PATH = path.resolve(
  process.cwd(),
  '../orgs/glv/agents/prospector/projects/glv-marketing/outreach/prospect-registry.json'
);

export type ProspectStatus =
  | 'researched'
  | 'shortlisted'
  | 'drafted'
  | 'approved'
  | 'sent'
  | 'replied'
  | 'meeting_booked'
  | 'skipped'
  | 'do_not_contact';

export interface ProspectRecord {
  prospect_id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  channel: string;
  industry: string;
  city: string;
  tier: 'A' | 'B' | 'C';
  last_contact_at: string | null;
  batch_id: string | null;
  status: ProspectStatus;
  notes: string | null;
}

function loadRegistry(): ProspectRecord[] {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const obj = JSON.parse(raw) as Record<string, Omit<ProspectRecord, 'prospect_id' | 'tier'> & { tier?: 'A' | 'B' | 'C' }>;
    return Object.entries(obj).map(([id, rec]) => ({
      ...rec,
      prospect_id: id,
      tier: rec.tier ?? 'A',
    }));
  } catch {
    return [];
  }
}

export const PIPELINE_STAGES: ProspectStatus[] = [
  'researched',
  'shortlisted',
  'drafted',
  'approved',
  'sent',
  'replied',
  'meeting_booked',
];

export const STAGE_LABELS: Record<ProspectStatus, string> = {
  researched: 'Researched',
  shortlisted: 'Shortlisted',
  drafted: 'Copy Drafted',
  approved: 'Approved',
  sent: 'Sent',
  replied: 'Replied',
  meeting_booked: 'Meeting Booked',
  skipped: 'Skipped',
  do_not_contact: 'DNC',
};

export interface PipelineStageCount {
  stage: ProspectStatus;
  label: string;
  count: number;
  is_terminal: boolean;
}

export interface PipelineFilters {
  city?: string;
  industry?: string;
  tier?: 'A' | 'B' | 'C';
}

export function getOutreachPipeline(filters?: PipelineFilters): {
  stages: PipelineStageCount[];
  total_active: number;
  cities: string[];
  industries: string[];
  tiers: string[];
} {
  const prospects = loadRegistry();

  const filtered = prospects.filter((p) => {
    if (filters?.city && p.city !== filters.city) return false;
    if (filters?.industry && p.industry !== filters.industry) return false;
    if (filters?.tier && p.tier !== filters.tier) return false;
    return true;
  });

  const counts = new Map<ProspectStatus, number>();
  for (const p of filtered) {
    counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
  }

  const stages: PipelineStageCount[] = PIPELINE_STAGES.map((s) => ({
    stage: s,
    label: STAGE_LABELS[s],
    count: counts.get(s) ?? 0,
    is_terminal: false,
  }));

  const active = filtered.filter(
    (p) => p.status !== 'skipped' && p.status !== 'do_not_contact'
  );

  const all = loadRegistry();
  const cities = [...new Set(all.map((p) => p.city).filter(Boolean))].sort();
  const industries = [...new Set(all.map((p) => p.industry).filter(Boolean))].sort();
  const tiers = [...new Set(all.map((p) => p.tier).filter(Boolean))].sort();

  return { stages, total_active: active.length, cities, industries, tiers };
}

export function getOutreachStats(org?: string): {
  total_sent: number;
  total_replies: number;
  total_meetings: number;
  reply_rate: number;
  cities: number;
  industries: number;
} {
  const summary = getOutreachSummary(org);

  const total_sent = summary.reduce((s, r) => s + r.sent, 0);
  const total_replies = summary.reduce((s, r) => s + r.replies, 0);
  const total_meetings = summary.reduce((s, r) => s + r.meetings, 0);
  const cities = new Set(summary.map((r) => r.city)).size;
  const industries = new Set(summary.map((r) => r.industry)).size;

  return {
    total_sent,
    total_replies,
    total_meetings,
    reply_rate: total_sent > 0 ? Math.round((total_replies / total_sent) * 100) : 0,
    cities,
    industries,
  };
}
