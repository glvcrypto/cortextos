import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { getConfigCommand } from '../../../src/cli/get-config.js';

let tmpRoot: string;

async function runCommand(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const out: string[] = [];
  const err: string[] = [];
  let exitCode = 0;
  const origLog = console.log;
  const origStderr = process.stderr.write.bind(process.stderr);
  const origExit = process.exit.bind(process);
  const origEnv = { ...process.env };

  process.env.CTX_FRAMEWORK_ROOT = tmpRoot;
  delete process.env.CTX_ORG;
  delete process.env.CTX_AGENT_NAME;
  console.log = (...a) => out.push(a.join(' '));
  process.stderr.write = (s: any) => { err.push(String(s)); return true; };
  process.exit = ((code: number) => { exitCode = code; throw new Error(`exit:${code}`); }) as any;

  try {
    await getConfigCommand.parseAsync(['node', 'cli', ...args]);
  } catch (e: any) {
    if (!String(e?.message).startsWith('exit:')) throw e;
  } finally {
    console.log = origLog;
    process.stderr.write = origStderr;
    process.exit = origExit;
    Object.assign(process.env, origEnv);
    delete process.env.CTX_FRAMEWORK_ROOT;
    if (origEnv.CTX_FRAMEWORK_ROOT !== undefined) process.env.CTX_FRAMEWORK_ROOT = origEnv.CTX_FRAMEWORK_ROOT;
  }
  return { stdout: out.join('\n'), stderr: err.join('\n'), exitCode };
}

beforeEach(() => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'get-config-test-'));
});
afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('get-config command', () => {
  it('exits 1 and errors when --org not provided', async () => {
    const { stderr, exitCode } = await runCommand([]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('--org is required');
  });

  it('warns and uses hardcoded defaults when org context.json missing', async () => {
    const { stdout, stderr } = await runCommand(['--org', 'missing']);
    expect(stderr).toContain('Warning');
    expect(stdout).toContain('Timezone:');
    expect(stdout).toContain('UTC');
  });

  it('reads timezone from org context.json', async () => {
    const orgDir = join(tmpRoot, 'orgs', 'myorg');
    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({ timezone: 'America/Toronto' }));
    const { stdout } = await runCommand(['--org', 'myorg']);
    expect(stdout).toContain('America/Toronto');
  });

  it('agent config overrides org timezone', async () => {
    const orgDir = join(tmpRoot, 'orgs', 'myorg');
    const agentDir = join(orgDir, 'agents', 'myagent');
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({ timezone: 'UTC' }));
    writeFileSync(join(agentDir, 'config.json'), JSON.stringify({ timezone: 'America/Vancouver' }));
    const { stdout } = await runCommand(['--org', 'myorg', '--agent', 'myagent']);
    expect(stdout).toContain('America/Vancouver');
  });

  it('JSON format outputs valid JSON with expected keys', async () => {
    const orgDir = join(tmpRoot, 'orgs', 'myorg');
    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({ timezone: 'UTC' }));
    const { stdout } = await runCommand(['--org', 'myorg', '--format', 'json']);
    const parsed = JSON.parse(stdout);
    expect(parsed).toHaveProperty('timezone');
    expect(parsed).toHaveProperty('approval_rules');
  });

  it('falls back to hardcoded approval categories when not an array', async () => {
    const orgDir = join(tmpRoot, 'orgs', 'myorg');
    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({ default_approval_categories: 'not-an-array' }));
    const { stdout } = await runCommand(['--org', 'myorg', '--format', 'json']);
    const parsed = JSON.parse(stdout);
    expect(parsed.approval_rules.always_ask).toContain('financial');
  });

  it('shows org-only header when no agent specified', async () => {
    const orgDir = join(tmpRoot, 'orgs', 'myorg');
    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({}));
    const { stdout } = await runCommand(['--org', 'myorg']);
    expect(stdout).toContain('Org Config: myorg');
  });

  it('warns when explicit --agent config not found', async () => {
    const orgDir = join(tmpRoot, 'orgs', 'myorg');
    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({}));
    const { stderr } = await runCommand(['--org', 'myorg', '--agent', 'missing']);
    expect(stderr).toContain('Warning');
  });
});
