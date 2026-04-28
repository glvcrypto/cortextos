import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { syncAll } from '@/lib/sync';

export const dynamic = 'force-dynamic';

interface EventRow {
  id: string;
  timestamp: string;
  agent: string;
  message: string | null;
  data: string | null;
}

interface ProposalMade {
  proposal_id: string;
  title: string;
  posted_at: string;
  agent: string;
  target_surface?: string;
}

interface ProposalAdopted {
  proposal_id: string;
  outcome: 'approved' | 'modified' | 'rejected' | 'superseded';
  decided_at: string;
  days_to_decision?: number;
}

// ---------------------------------------------------------------------------
// GET /api/proposals/adoption
//
// Returns proposal adoption KPI data for the last 14 days:
//   - Per-proposal list with outcome
//   - Weekly rollup: posted / reviewed / adopted / modified / rejected / pending
//   - 14-day adoption rate
//
// Query params:
//   org   - filter by org (optional)
//   agent - default "scout" (optional)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const org = searchParams.get('org') || undefined;
  const agent = searchParams.get('agent') || 'scout';

  try { syncAll(); } catch { /* best-effort */ }

  try {
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const conditions = ['message = ?', 'timestamp >= ?'];
    const baseParams: (string | number)[] = ['proposal_made', cutoff];
    if (org) { conditions.push('org = ?'); baseParams.push(org); }
    if (agent) { conditions.push('agent = ?'); baseParams.push(agent); }

    const madeRows = db
      .prepare(
        `SELECT id, timestamp, agent, message, data
         FROM events WHERE ${conditions.join(' AND ')}
         ORDER BY timestamp ASC`,
      )
      .all(...baseParams) as EventRow[];

    // Build map of proposal_id → made record
    const made = new Map<string, ProposalMade>();
    for (const row of madeRows) {
      if (!row.data) continue;
      try {
        const meta = JSON.parse(row.data);
        if (!meta.proposal_id) continue;
        made.set(meta.proposal_id, {
          proposal_id: meta.proposal_id,
          title: meta.title ?? meta.proposal_id,
          posted_at: row.timestamp,
          agent: row.agent,
          target_surface: meta.target_surface,
        });
      } catch { /* skip */ }
    }

    // Fetch matching adopted events (no agent/date filter — decisions can come from boss)
    const adoptedRows = db
      .prepare(
        `SELECT id, timestamp, agent, message, data
         FROM events WHERE message = 'proposal_adopted'
         ORDER BY timestamp ASC`,
      )
      .all() as EventRow[];

    const adopted = new Map<string, ProposalAdopted>();
    for (const row of adoptedRows) {
      if (!row.data) continue;
      try {
        const meta = JSON.parse(row.data);
        if (!meta.proposal_id) continue;
        adopted.set(meta.proposal_id, {
          proposal_id: meta.proposal_id,
          outcome: meta.outcome ?? 'rejected',
          decided_at: row.timestamp,
          days_to_decision: meta.days_to_decision,
        });
      } catch { /* skip */ }
    }

    // Build per-proposal list
    const proposals = Array.from(made.values()).map((p) => {
      const decision = adopted.get(p.proposal_id);
      const pendingDays = Math.floor(
        (Date.now() - new Date(p.posted_at).getTime()) / (24 * 60 * 60 * 1000),
      );
      return {
        proposal_id: p.proposal_id,
        title: p.title,
        posted_at: p.posted_at,
        agent: p.agent,
        target_surface: p.target_surface ?? null,
        outcome: decision?.outcome ?? 'pending',
        decided_at: decision?.decided_at ?? null,
        days_to_decision: decision?.days_to_decision ?? (decision ? null : pendingDays),
      };
    });

    // Weekly rollup (current week = last 7d)
    const weekCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thisWeek = proposals.filter((p) => p.posted_at >= weekCutoff);

    const rollup = {
      posted: thisWeek.length,
      adopted: thisWeek.filter((p) => p.outcome === 'approved').length,
      modified: thisWeek.filter((p) => p.outcome === 'modified').length,
      rejected: thisWeek.filter((p) => p.outcome === 'rejected').length,
      superseded: thisWeek.filter((p) => p.outcome === 'superseded').length,
      pending: thisWeek.filter((p) => p.outcome === 'pending').length,
    };

    // 14-day adoption rate = (approved + modified) / total decided
    const decided14d = proposals.filter((p) => p.outcome !== 'pending');
    const adopted14d = decided14d.filter(
      (p) => p.outcome === 'approved' || p.outcome === 'modified',
    );
    const adoptionRate14d =
      decided14d.length > 0
        ? Math.round((adopted14d.length / decided14d.length) * 100)
        : null;

    return Response.json({
      proposals,
      weekly_rollup: rollup,
      adoption_rate_14d: adoptionRate14d,
      total_proposals_14d: proposals.length,
    });
  } catch (err) {
    console.error('[api/proposals/adoption] GET error:', err);
    return Response.json({ error: 'Failed to fetch proposal adoption data' }, { status: 500 });
  }
}
