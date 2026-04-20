import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

export interface McpServer {
  name: string;
  type: string;
  url?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  enabled: boolean;
}

export interface AgentMcpConfig {
  agent: string;
  org: string;
  servers: McpServer[];
  filePath: string | null;
}

function getFrameworkRoot(): string {
  return process.env.CTX_FRAMEWORK_ROOT ?? '/home/aiden/cortextos';
}

function readAgentMcp(agentDir: string, agent: string, org: string): AgentMcpConfig {
  const filePath = path.join(agentDir, '.mcp.json');
  const servers: McpServer[] = [];

  if (fs.existsSync(filePath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      for (const [name, cfg] of Object.entries(raw as Record<string, Record<string, unknown>>)) {
        servers.push({
          name,
          type: (cfg.type as string) ?? 'stdio',
          url: cfg.url as string | undefined,
          command: cfg.command as string | undefined,
          args: cfg.args as string[] | undefined,
          env: cfg.env as Record<string, string> | undefined,
          enabled: (cfg.enabled as boolean) ?? true,
        });
      }
    } catch {
      // malformed JSON — treat as empty
    }
  }

  return { agent, org, servers, filePath: fs.existsSync(filePath) ? filePath : null };
}

/**
 * GET /api/mcp — List MCP configs for all agents across all orgs.
 */
export async function GET() {
  const root = getFrameworkRoot();
  const orgsDir = path.join(root, 'orgs');
  const configs: AgentMcpConfig[] = [];

  try {
    if (!fs.existsSync(orgsDir)) return Response.json([]);

    const orgs = fs.readdirSync(orgsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const org of orgs) {
      const agentsDir = path.join(orgsDir, org, 'agents');
      if (!fs.existsSync(agentsDir)) continue;

      const agents = fs.readdirSync(agentsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      for (const agent of agents) {
        const agentDir = path.join(agentsDir, agent);
        configs.push(readAgentMcp(agentDir, agent, org));
      }
    }
  } catch (err) {
    console.error('[api/mcp] GET error:', err);
    return Response.json({ error: 'Failed to read MCP configs' }, { status: 500 });
  }

  return Response.json(configs);
}

/**
 * POST /api/mcp — Write a server entry to an agent's .mcp.json.
 *
 * Body: { org: string, agent: string, name: string, config: object }
 */
export async function POST(request: NextRequest) {
  let body: { org: string; agent: string; name: string; config: Record<string, unknown> };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { org, agent, name, config } = body;
  if (!org || !agent || !name || !config) {
    return Response.json({ error: 'Missing required fields: org, agent, name, config' }, { status: 400 });
  }

  const root = getFrameworkRoot();
  const filePath = path.join(root, 'orgs', org, 'agents', agent, '.mcp.json');

  let existing: Record<string, unknown> = {};
  if (fs.existsSync(filePath)) {
    try { existing = JSON.parse(fs.readFileSync(filePath, 'utf-8')); } catch { /* reset */ }
  }

  existing[name] = config;

  try {
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  } catch (err) {
    console.error('[api/mcp] POST write error:', err);
    return Response.json({ error: 'Failed to write .mcp.json' }, { status: 500 });
  }

  return Response.json({ ok: true, filePath });
}

/**
 * DELETE /api/mcp — Remove a server from an agent's .mcp.json.
 *
 * Body: { org: string, agent: string, name: string }
 */
export async function DELETE(request: NextRequest) {
  let body: { org: string; agent: string; name: string };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { org, agent, name } = body;
  if (!org || !agent || !name) {
    return Response.json({ error: 'Missing required fields: org, agent, name' }, { status: 400 });
  }

  const root = getFrameworkRoot();
  const filePath = path.join(root, 'orgs', org, 'agents', agent, '.mcp.json');

  if (!fs.existsSync(filePath)) {
    return Response.json({ error: 'No .mcp.json found for this agent' }, { status: 404 });
  }

  let existing: Record<string, unknown> = {};
  try { existing = JSON.parse(fs.readFileSync(filePath, 'utf-8')); } catch {
    return Response.json({ error: 'Malformed .mcp.json' }, { status: 500 });
  }

  delete existing[name];

  try {
    if (Object.keys(existing).length === 0) {
      fs.unlinkSync(filePath);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    }
  } catch (err) {
    return Response.json({ error: 'Failed to write .mcp.json' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
