import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listAgentsCommand } from '../../../src/cli/list-agents.js';

vi.mock('../../../src/bus/agents.js', () => ({
  listAgents: vi.fn(),
}));

import { listAgents } from '../../../src/bus/agents.js';
const mockListAgents = vi.mocked(listAgents);

async function runCommand(args: string[]): Promise<{ stdout: string; stderr: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const origLog = console.log;
  const origErr = console.error;
  console.log = (...a) => out.push(a.join(' '));
  console.error = (...a) => err.push(a.join(' '));
  try {
    await listAgentsCommand.parseAsync(['node', 'cli', ...args]);
  } finally {
    console.log = origLog;
    console.error = origErr;
  }
  return { stdout: out.join('\n'), stderr: err.join('\n') };
}

const baseAgent = {
  name: 'dev',
  org: 'glv',
  display_name: 'Dev Agent',
  role: 'software engineer',
  enabled: true,
  running: true,
  last_heartbeat: '2026-05-02T12:00:00Z',
  current_task: null,
  mode: null,
};

beforeEach(() => { mockListAgents.mockReset(); });

describe('list-agents command', () => {
  it('prints "No agents found." when list is empty', async () => {
    mockListAgents.mockReturnValue([]);
    const { stdout } = await runCommand([]);
    expect(stdout).toContain('No agents found.');
  });

  it('JSON format outputs stringified array', async () => {
    mockListAgents.mockReturnValue([baseAgent]);
    const { stdout } = await runCommand(['--format', 'json']);
    const parsed = JSON.parse(stdout);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('dev');
  });

  it('text format shows agent name and org in table', async () => {
    mockListAgents.mockReturnValue([baseAgent]);
    const { stdout } = await runCommand([]);
    expect(stdout).toContain('dev');
    expect(stdout).toContain('glv');
    expect(stdout).toContain('Total: 1 agents');
  });

  it('running agent shows "● running"', async () => {
    mockListAgents.mockReturnValue([{ ...baseAgent, running: true }]);
    const { stdout } = await runCommand([]);
    expect(stdout).toContain('● running');
  });

  it('stopped agent shows "○ stopped"', async () => {
    mockListAgents.mockReturnValue([{ ...baseAgent, running: false }]);
    const { stdout } = await runCommand([]);
    expect(stdout).toContain('○ stopped');
  });

  it('passes --org option to listAgents', async () => {
    mockListAgents.mockReturnValue([]);
    await runCommand(['--org', 'glv']);
    expect(mockListAgents).toHaveBeenCalledWith(expect.any(String), 'glv');
  });

  it('displays display_name and role in table', async () => {
    mockListAgents.mockReturnValue([baseAgent]);
    const { stdout } = await runCommand([]);
    expect(stdout).toContain('Dev Agent');
    expect(stdout).toContain('software engineer');
  });

  it('omitted display_name falls back to dash', async () => {
    mockListAgents.mockReturnValue([{ ...baseAgent, display_name: undefined }]);
    const { stdout } = await runCommand([]);
    expect(stdout).toContain('-');
  });
});
