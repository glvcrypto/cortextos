import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { goalsCommand } from '../../../src/cli/goals.js';

let tmpRoot: string;

async function runGenerateMd(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const out: string[] = [];
  const err: string[] = [];
  let exitCode = 0;
  const origLog = console.log;
  const origStderr = process.stderr.write.bind(process.stderr);
  const origExit = process.exit.bind(process);
  const origFrameworkRoot = process.env.CTX_FRAMEWORK_ROOT;

  process.env.CTX_FRAMEWORK_ROOT = tmpRoot;
  console.log = (...a) => out.push(a.join(' '));
  process.stderr.write = (s: any) => { err.push(String(s)); return true; };
  process.exit = ((code: number) => { exitCode = code; throw new Error(`exit:${code}`); }) as any;

  try {
    await goalsCommand.parseAsync(['node', 'cli', 'generate-md', ...args]);
  } catch (e: any) {
    if (!String(e?.message).startsWith('exit:')) throw e;
  } finally {
    console.log = origLog;
    process.stderr.write = origStderr;
    process.exit = origExit;
    if (origFrameworkRoot === undefined) delete process.env.CTX_FRAMEWORK_ROOT;
    else process.env.CTX_FRAMEWORK_ROOT = origFrameworkRoot;
  }
  return { stdout: out.join('\n'), stderr: err.join('\n'), exitCode };
}

function makeAgentDir(org: string, agent: string): string {
  const dir = join(tmpRoot, 'orgs', org, 'agents', agent);
  mkdirSync(dir, { recursive: true });
  return dir;
}

beforeEach(() => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'goals-test-'));
});
afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('goals generate-md command', () => {
  it('exits 1 when goals.json not found', async () => {
    makeAgentDir('glv', 'dev');
    const { stderr, exitCode } = await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('goals.json not found');
  });

  it('exits 1 when goals.json is invalid JSON', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), 'not json');
    const { exitCode, stderr } = await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Failed to parse');
  });

  it('generates GOALS.md with string goals as numbered list', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), JSON.stringify({
      goals: ['Ship PR #1', 'Fix bug #2'],
      focus: 'Test coverage',
      bottleneck: 'PR backlog',
    }));
    await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    const md = readFileSync(join(dir, 'GOALS.md'), 'utf-8');
    expect(md).toContain('1. Ship PR #1');
    expect(md).toContain('2. Fix bug #2');
  });

  it('generates GOALS.md with object goals using .title', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), JSON.stringify({
      goals: [{ title: 'Objective A' }, { title: 'Objective B' }],
    }));
    await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    const md = readFileSync(join(dir, 'GOALS.md'), 'utf-8');
    expect(md).toContain('1. Objective A');
    expect(md).toContain('2. Objective B');
  });

  it('shows placeholder when goals array is empty', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), JSON.stringify({ goals: [] }));
    await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    const md = readFileSync(join(dir, 'GOALS.md'), 'utf-8');
    expect(md).toContain('none set');
  });

  it('includes focus and bottleneck sections', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), JSON.stringify({
      goals: [],
      focus: 'Client acquisition',
      bottleneck: 'Domain transfer',
    }));
    await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    const md = readFileSync(join(dir, 'GOALS.md'), 'utf-8');
    expect(md).toContain('Client acquisition');
    expect(md).toContain('Domain transfer');
  });

  it('shows "(none)" when bottleneck is absent', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), JSON.stringify({ goals: [] }));
    await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    const md = readFileSync(join(dir, 'GOALS.md'), 'utf-8');
    expect(md).toContain('(none)');
  });

  it('prints success message and creates GOALS.md', async () => {
    const dir = makeAgentDir('glv', 'dev');
    writeFileSync(join(dir, 'goals.json'), JSON.stringify({ goals: ['Do thing'] }));
    const { stdout } = await runGenerateMd(['--agent', 'dev', '--org', 'glv']);
    expect(stdout).toContain('Generated GOALS.md');
    expect(existsSync(join(dir, 'GOALS.md'))).toBe(true);
  });

  it('exits 1 for invalid agent name characters', async () => {
    makeAgentDir('glv', 'dev');
    const { exitCode, stderr } = await runGenerateMd(['--agent', '../bad', '--org', 'glv']);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('alphanumeric');
  });
});
