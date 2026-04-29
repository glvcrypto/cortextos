import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface ResolvedConfig {
  timezone: string;
  day_mode_start: string;
  day_mode_end: string;
  communication_style: string;
  approval_rules: { always_ask: string[]; never_ask: string[] };
}

export function resolveConfig(
  orgCtx: Record<string, unknown>,
  agentCfg: Record<string, unknown>
): ResolvedConfig {
  const defaultApprovalCategories = Array.isArray(orgCtx.default_approval_categories)
    ? orgCtx.default_approval_categories as string[]
    : ['external-comms', 'financial', 'deployment', 'data-deletion'];
  return {
    timezone: (agentCfg.timezone as string) || (orgCtx.timezone as string) || 'UTC',
    day_mode_start: (agentCfg.day_mode_start as string) || (orgCtx.day_mode_start as string) || '08:00',
    day_mode_end: (agentCfg.day_mode_end as string) || (orgCtx.day_mode_end as string) || '00:00',
    communication_style: (agentCfg.communication_style as string) || (orgCtx.communication_style as string) || 'direct and casual',
    approval_rules: (agentCfg.approval_rules as ResolvedConfig['approval_rules']) || {
      always_ask: defaultApprovalCategories,
      never_ask: [],
    },
  };
}

export function formatConfigText(
  resolved: ResolvedConfig,
  agentName: string,
  org: string
): string {
  const header = agentName ? `=== Config: ${agentName} (org: ${org}) ===` : `=== Org Config: ${org} ===`;
  return [
    header,
    `Timezone:            ${resolved.timezone}`,
    `Day Mode:            ${resolved.day_mode_start} – ${resolved.day_mode_end}`,
    `Night Mode:          ${resolved.day_mode_end} – ${resolved.day_mode_start}`,
    `Approval Required:   ${resolved.approval_rules.always_ask.join(', ') || '(none)'}`,
    `Never Need Approval: ${resolved.approval_rules.never_ask.join(', ') || '(none)'}`,
    `Communication:       ${resolved.communication_style}`,
  ].join('\n');
}

export const getConfigCommand = new Command('get-config')
  .description('Show resolved operational config for an agent (org defaults + agent overrides)')
  .option('--agent <name>', 'Agent name')
  .option('--org <org>', 'Org name')
  .option('--format <format>', 'Output format: text or json', 'text')
  .action((options) => {
    const frameworkRoot = process.env.CTX_FRAMEWORK_ROOT || process.cwd();
    const org = options.org || process.env.CTX_ORG || '';
    const agentName = options.agent || process.env.CTX_AGENT_NAME || '';

    // Require org
    if (!org) {
      process.stderr.write('Error: --org is required (or set CTX_ORG)\n');
      process.exit(1);
    }

    // Read org defaults
    let orgCtx: Record<string, unknown> = {};
    const orgCtxPath = join(frameworkRoot, 'orgs', org, 'context.json');
    if (existsSync(orgCtxPath)) {
      try { orgCtx = JSON.parse(readFileSync(orgCtxPath, 'utf-8')); } catch {}
    } else {
      process.stderr.write(`Warning: org context not found at ${orgCtxPath}, using hardcoded defaults\n`);
    }

    // Read agent overrides
    let agentCfg: Record<string, unknown> = {};
    if (agentName) {
      const agentCfgPath = join(frameworkRoot, 'orgs', org, 'agents', agentName, 'config.json');
      if (existsSync(agentCfgPath)) {
        try { agentCfg = JSON.parse(readFileSync(agentCfgPath, 'utf-8')); } catch {}
      } else if (options.agent) {
        // --agent was explicitly passed but no config found — warn, don't exit
        process.stderr.write(`Warning: agent config not found at ${agentCfgPath}, showing org defaults only\n`);
      }
    }

    const resolved = resolveConfig(orgCtx, agentCfg);

    if (options.format === 'json') {
      console.log(JSON.stringify(resolved, null, 2));
      return;
    }

    console.log(formatConfigText(resolved, agentName, org));
  });
