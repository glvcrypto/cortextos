import { NextRequest } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

/**
 * POST /api/mcp/restart
 *
 * Soft-restart one or more agents after MCP config changes.
 * Body: { agents: string[], reason?: string }
 */
export async function POST(request: NextRequest) {
  let body: { agents: string[]; reason?: string };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { agents, reason = 'MCP config updated via dashboard' } = body;

  if (!Array.isArray(agents) || agents.length === 0) {
    return Response.json({ error: 'agents must be a non-empty array' }, { status: 400 });
  }

  const results: Record<string, { ok: boolean; error?: string }> = {};

  for (const agent of agents) {
    if (!/^[a-z0-9_-]+$/.test(agent)) {
      results[agent] = { ok: false, error: 'Invalid agent name' };
      continue;
    }

    try {
      execSync(`cortextos bus soft-restart "${agent}" "${reason}"`, {
        timeout: 10000,
        env: { ...process.env },
      });
      results[agent] = { ok: true };
    } catch (err) {
      results[agent] = { ok: false, error: String(err) };
    }
  }

  const allOk = Object.values(results).every((r) => r.ok);
  return Response.json({ results }, { status: allOk ? 200 : 207 });
}
