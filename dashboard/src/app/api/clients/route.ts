import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ClientRow {
  id: string;
  org: string;
  display_name: string | null;
  stage: string;
  retainer_mrr: number;
  retainer_health: string;
  contract: string | null;
  deliverables: string | null;
  blockers: string | null;
  notes: string | null;
  updated_at: string | null;
}

interface RecentEvent {
  id: string;
  timestamp: string;
  agent: string;
  type: string;
  message: string | null;
  severity: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const org = searchParams.get('org') ?? '';

  try {
    let query = 'SELECT * FROM clients';
    const params: string[] = [];

    if (org && org !== 'all') {
      query += ' WHERE org = ?';
      params.push(org);
    }

    query += ' ORDER BY retainer_mrr DESC, display_name ASC';

    const rows = db.prepare(query).all(...params) as ClientRow[];

    const clients = rows.map((row) => {
      // Pull recent activity for this client from events (project = client id)
      const recentEvents = db.prepare(`
        SELECT id, timestamp, agent, type, message, severity
        FROM events
        WHERE org = ? AND (
          data LIKE ? OR message LIKE ? OR type LIKE ?
        )
        ORDER BY timestamp DESC
        LIMIT 5
      `).all(
        row.org,
        `%"client":"${row.id}"%`,
        `%${row.id}%`,
        `%${row.id}%`,
      ) as RecentEvent[];

      // Open tasks for this client
      const openTasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE org = ? AND project = ? AND status NOT IN ('completed', 'cancelled')
      `).get(row.org, row.id) as { count: number };

      const blockedTasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks
        WHERE org = ? AND project = ? AND status = 'blocked'
      `).get(row.org, row.id) as { count: number };

      return {
        id: row.id,
        org: row.org,
        display_name: row.display_name ?? row.id,
        stage: row.stage,
        retainer_mrr: row.retainer_mrr,
        retainer_health: row.retainer_health,
        contract: row.contract ? JSON.parse(row.contract) : {},
        deliverables: row.deliverables ? JSON.parse(row.deliverables) : {},
        blockers: row.blockers ? JSON.parse(row.blockers) : [],
        notes: row.notes,
        updated_at: row.updated_at,
        recent_events: recentEvents,
        open_tasks: openTasks.count,
        blocked_tasks: blockedTasks.count,
      };
    });

    return NextResponse.json({ clients });
  } catch (err) {
    console.error('[api/clients] Error:', err);
    return NextResponse.json({ error: 'Failed to load clients' }, { status: 500 });
  }
}
