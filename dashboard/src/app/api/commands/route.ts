import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

interface InboundMessage {
  message_id: number;
  from: number;
  from_name: string;
  chat_id: number;
  text: string;
  timestamp: string;
  archived_at?: string;
  agent: string;
}

interface CommandEntry {
  id: string;
  agent: string;
  from_name: string;
  text: string;
  timestamp: string;
  is_slash: boolean;
}

/**
 * GET /api/commands
 *
 * Query params:
 *   agent  - filter by agent name
 *   limit  - max rows (default 100)
 *   offset - pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const agentFilter = searchParams.get('agent') || undefined;
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10) || 100, 500);
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10) || 0, 0);

  const instanceId = process.env.CTX_INSTANCE_ID ?? 'default';
  const logsBase = path.join(
    process.env.HOME ?? '/home/aiden',
    '.cortextos',
    instanceId,
    'logs'
  );

  const commands: CommandEntry[] = [];

  try {
    if (!fs.existsSync(logsBase)) {
      return Response.json([]);
    }

    const agentDirs = fs.readdirSync(logsBase, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const agent of agentDirs) {
      if (agentFilter && agent !== agentFilter) continue;

      const inboundPath = path.join(logsBase, agent, 'inbound-messages.jsonl');
      if (!fs.existsSync(inboundPath)) continue;

      const raw = fs.readFileSync(inboundPath, 'utf-8');
      const lines = raw.split('\n').filter((l) => l.trim());

      for (let i = 0; i < lines.length; i++) {
        try {
          const msg: InboundMessage = JSON.parse(lines[i]);
          commands.push({
            id: `${agent}-${msg.message_id ?? i}`,
            agent,
            from_name: msg.from_name ?? 'unknown',
            text: msg.text ?? '',
            timestamp: msg.timestamp,
            is_slash: (msg.text ?? '').startsWith('/'),
          });
        } catch {
          // skip malformed lines
        }
      }
    }
  } catch (err) {
    console.error('[api/commands] error:', err);
    return Response.json({ error: 'Failed to read commands' }, { status: 500 });
  }

  // Sort newest first, then paginate
  commands.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const page = commands.slice(offset, offset + limit);

  return Response.json({ commands: page, total: commands.length });
}
