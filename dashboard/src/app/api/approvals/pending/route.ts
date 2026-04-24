import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { syncAll } from '@/lib/sync';

export const dynamic = 'force-dynamic';

interface PendingApprovalRow {
  id: string;
  title: string;
  category: string;
  description: string | null;
  agent: string;
  org: string;
  created_at: string;
}

interface ResolvedRow {
  category: string;
  created_at: string;
  resolved_at: string;
}

// ---------------------------------------------------------------------------
// GET /api/approvals/pending
//
// Returns pending approvals with age_minutes, plus avg decision time by type
// computed from the last 7 days of resolved approvals.
//
// Query params:
//   org - filter by org (optional)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const org = searchParams.get('org') || undefined;

  try { syncAll(); } catch { /* best-effort */ }

  try {
    const conditions: string[] = ["status = 'pending'"];
    const params: (string | number)[] = [];

    if (org) {
      conditions.push('org = ?');
      params.push(org);
    }

    const pendingRows = db
      .prepare(
        `SELECT id, title, category, description, agent, org, created_at
         FROM approvals WHERE ${conditions.join(' AND ')}
         ORDER BY created_at ASC`,
      )
      .all(...params) as PendingApprovalRow[];

    const now = Date.now();
    const pending = pendingRows.map((row) => {
      const queuedMs = new Date(row.created_at).getTime();
      const ageMinutes = isNaN(queuedMs)
        ? null
        : Math.round((now - queuedMs) / 60_000);
      return {
        id: row.id,
        type: row.category,
        description: row.title,
        queued_at: row.created_at,
        age_minutes: ageMinutes,
      };
    });

    // Avg decision time by category from resolved approvals in last 7d
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const resolvedRows = db
      .prepare(
        `SELECT category, created_at, resolved_at
         FROM approvals
         WHERE status != 'pending'
           AND resolved_at IS NOT NULL
           AND resolved_at >= ?
         ORDER BY resolved_at DESC`,
      )
      .all(sevenDaysAgo) as ResolvedRow[];

    const latencyByType: Record<string, number[]> = {};
    for (const row of resolvedRows) {
      const created = new Date(row.created_at).getTime();
      const resolved = new Date(row.resolved_at).getTime();
      if (isNaN(created) || isNaN(resolved)) continue;
      const latencyMin = Math.round((resolved - created) / 60_000);
      if (!latencyByType[row.category]) latencyByType[row.category] = [];
      latencyByType[row.category].push(latencyMin);
    }

    const avgDecisionTimeByType: Record<string, number> = {};
    for (const [category, latencies] of Object.entries(latencyByType)) {
      avgDecisionTimeByType[category] = Math.round(
        latencies.reduce((s, v) => s + v, 0) / latencies.length,
      );
    }

    return Response.json({ pending, avg_decision_time_by_type: avgDecisionTimeByType });
  } catch (err) {
    console.error('[api/approvals/pending] GET error:', err);
    return Response.json({ error: 'Failed to fetch pending approvals' }, { status: 500 });
  }
}
