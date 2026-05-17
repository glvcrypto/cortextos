import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Set roots before import so config module constants read the tmp dirs.
// CTX_FRAMEWORK_ROOT has no agent directories → getAgentDir() always falls back to CTX_ROOT.
const tmpState = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-paths-test-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-paths-test-fw-'));
process.env.CTX_ROOT = tmpState;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

let getAgentPaths: typeof import('../agents')['getAgentPaths'];

beforeAll(async () => {
  const mod = await import('../agents');
  getAgentPaths = mod.getAgentPaths;
});

// ---------------------------------------------------------------------------
// getAgentPaths — structure
// ---------------------------------------------------------------------------

describe('getAgentPaths — without org', () => {
  it('returns an object with all required keys', () => {
    const p = getAgentPaths('dev');
    const keys = ['agentDir', 'claudeDir', 'identityMd', 'soulMd', 'goalsMd', 'memoryMd', 'memoryDir', 'heartbeat', 'logsDir'];
    for (const key of keys) {
      expect(p).toHaveProperty(key);
    }
  });

  it('claudeDir is nested inside agentDir', () => {
    const p = getAgentPaths('dev');
    expect(p.claudeDir.startsWith(p.agentDir)).toBe(true);
  });

  it('identityMd ends with IDENTITY.md', () => {
    const p = getAgentPaths('dev');
    expect(p.identityMd.endsWith('IDENTITY.md')).toBe(true);
  });

  it('heartbeat path contains the agent name', () => {
    const p = getAgentPaths('dev');
    expect(p.heartbeat).toContain('dev');
  });

  it('logsDir contains the agent name', () => {
    const p = getAgentPaths('myagent');
    expect(p.logsDir).toContain('myagent');
  });
});

describe('getAgentPaths — with org', () => {
  it('agentDir includes org when org is provided', () => {
    // Ensure no framework dir exists for this org → state path used
    const p = getAgentPaths('dev', 'glv');
    expect(p.agentDir).toContain('glv');
    expect(p.agentDir).toContain('dev');
  });

  it('paths without org differ from paths with org (different agentDir)', () => {
    const withOrg = getAgentPaths('dev', 'glv');
    const withoutOrg = getAgentPaths('dev');
    expect(withOrg.agentDir).not.toBe(withoutOrg.agentDir);
  });

  it('goalsMd ends with GOALS.md regardless of org', () => {
    const p = getAgentPaths('dev', 'glv');
    expect(p.goalsMd.endsWith('GOALS.md')).toBe(true);
  });
});

describe('getAgentPaths — filesystem root', () => {
  it('agentDir is under CTX_ROOT when framework dir does not exist', () => {
    const p = getAgentPaths('scout', 'glv');
    expect(p.agentDir.startsWith(tmpState)).toBe(true);
  });

  it('heartbeat is always under CTX_ROOT/state/', () => {
    const p = getAgentPaths('dev', 'glv');
    const expectedBase = path.join(tmpState, 'state');
    expect(p.heartbeat.startsWith(expectedBase)).toBe(true);
  });

  it('uses framework root when agent dir exists there', () => {
    // Create a real agent dir in framework root
    const fwAgentDir = path.join(tmpFramework, 'orgs', 'glv', 'agents', 'existing-agent');
    fs.mkdirSync(fwAgentDir, { recursive: true });

    const p = getAgentPaths('existing-agent', 'glv');
    expect(p.agentDir.startsWith(tmpFramework)).toBe(true);

    // cleanup
    fs.rmSync(path.join(tmpFramework, 'orgs'), { recursive: true, force: true });
  });
});
