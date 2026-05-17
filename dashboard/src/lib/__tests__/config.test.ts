import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Set env vars BEFORE config.ts evaluates so module-level constants pick them up.
const tmpState = fs.mkdtempSync(path.join(os.tmpdir(), 'config-test-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'config-test-fw-'));
process.env.CTX_ROOT = tmpState;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

let CTX_ROOT: string;
let CTX_FRAMEWORK_ROOT: string;
let getCTXRoot: typeof import('../config')['getCTXRoot'];
let getFrameworkRoot: typeof import('../config')['getFrameworkRoot'];
let getOrgDir: typeof import('../config')['getOrgDir'];
let getTaskDir: typeof import('../config')['getTaskDir'];
let getApprovalDir: typeof import('../config')['getApprovalDir'];
let getAnalyticsDir: typeof import('../config')['getAnalyticsDir'];
let getEventsDir: typeof import('../config')['getEventsDir'];
let getGoalsPath: typeof import('../config')['getGoalsPath'];
let getOrgContextPath: typeof import('../config')['getOrgContextPath'];
let getOrgBrandVoicePath: typeof import('../config')['getOrgBrandVoicePath'];
let getAgentStateDir: typeof import('../config')['getAgentStateDir'];
let getHeartbeatPath: typeof import('../config')['getHeartbeatPath'];
let getInboxDir: typeof import('../config')['getInboxDir'];
let getLogDir: typeof import('../config')['getLogDir'];
let getAgentDir: typeof import('../config')['getAgentDir'];
let getAllowedRootsConfigPath: typeof import('../config')['getAllowedRootsConfigPath'];
let getClientsDir: typeof import('../config')['getClientsDir'];
let getClientDir: typeof import('../config')['getClientDir'];
let getOrgs: typeof import('../config')['getOrgs'];
let getAgentsForOrg: typeof import('../config')['getAgentsForOrg'];
let getAllAgents: typeof import('../config')['getAllAgents'];

beforeAll(async () => {
  const mod = await import('../config');
  CTX_ROOT = mod.CTX_ROOT;
  CTX_FRAMEWORK_ROOT = mod.CTX_FRAMEWORK_ROOT;
  getCTXRoot = mod.getCTXRoot;
  getFrameworkRoot = mod.getFrameworkRoot;
  getOrgDir = mod.getOrgDir;
  getTaskDir = mod.getTaskDir;
  getApprovalDir = mod.getApprovalDir;
  getAnalyticsDir = mod.getAnalyticsDir;
  getEventsDir = mod.getEventsDir;
  getGoalsPath = mod.getGoalsPath;
  getOrgContextPath = mod.getOrgContextPath;
  getOrgBrandVoicePath = mod.getOrgBrandVoicePath;
  getAgentStateDir = mod.getAgentStateDir;
  getHeartbeatPath = mod.getHeartbeatPath;
  getInboxDir = mod.getInboxDir;
  getLogDir = mod.getLogDir;
  getAgentDir = mod.getAgentDir;
  getAllowedRootsConfigPath = mod.getAllowedRootsConfigPath;
  getClientsDir = mod.getClientsDir;
  getClientDir = mod.getClientDir;
  getOrgs = mod.getOrgs;
  getAgentsForOrg = mod.getAgentsForOrg;
  getAllAgents = mod.getAllAgents;
});

// ---------------------------------------------------------------------------
// Module constants
// ---------------------------------------------------------------------------

describe('module constants', () => {
  it('CTX_ROOT resolves to the env-var value', () => {
    expect(CTX_ROOT).toBe(tmpState);
  });

  it('getCTXRoot() returns the same value as the CTX_ROOT constant', () => {
    expect(getCTXRoot()).toBe(tmpState);
  });

  it('CTX_FRAMEWORK_ROOT resolves to the env-var value', () => {
    expect(CTX_FRAMEWORK_ROOT).toBe(tmpFramework);
  });

  it('getFrameworkRoot() returns the same value as the CTX_FRAMEWORK_ROOT constant', () => {
    expect(getFrameworkRoot()).toBe(tmpFramework);
  });
});

// ---------------------------------------------------------------------------
// Pure path helpers — org-scoped (state root)
// ---------------------------------------------------------------------------

describe('org-scoped path helpers (state root)', () => {
  it('getOrgDir returns <CTX_ROOT>/orgs/<org>', () => {
    expect(getOrgDir('glv')).toBe(path.join(tmpState, 'orgs', 'glv'));
  });

  it('getTaskDir with org returns <CTX_ROOT>/orgs/<org>/tasks', () => {
    expect(getTaskDir('glv')).toBe(path.join(tmpState, 'orgs', 'glv', 'tasks'));
  });

  it('getTaskDir without org returns <CTX_ROOT>/tasks', () => {
    expect(getTaskDir()).toBe(path.join(tmpState, 'tasks'));
  });

  it('getApprovalDir with org returns <CTX_ROOT>/orgs/<org>/approvals', () => {
    expect(getApprovalDir('glv')).toBe(path.join(tmpState, 'orgs', 'glv', 'approvals'));
  });

  it('getApprovalDir without org returns <CTX_ROOT>/approvals', () => {
    expect(getApprovalDir()).toBe(path.join(tmpState, 'approvals'));
  });

  it('getAnalyticsDir with org returns <CTX_ROOT>/orgs/<org>/analytics', () => {
    expect(getAnalyticsDir('glv')).toBe(path.join(tmpState, 'orgs', 'glv', 'analytics'));
  });

  it('getAnalyticsDir without org returns <CTX_ROOT>/analytics', () => {
    expect(getAnalyticsDir()).toBe(path.join(tmpState, 'analytics'));
  });

  it('getEventsDir returns <CTX_ROOT>/orgs/<org>/analytics/events/<agent>', () => {
    expect(getEventsDir('glv', 'dev')).toBe(
      path.join(tmpState, 'orgs', 'glv', 'analytics', 'events', 'dev'),
    );
  });
});

// ---------------------------------------------------------------------------
// getGoalsPath — prefers framework root if file exists there
// ---------------------------------------------------------------------------

describe('getGoalsPath', () => {
  it('returns state path when neither framework nor state file exists', () => {
    const expected = path.join(tmpState, 'orgs', 'no-org', 'goals.json');
    expect(getGoalsPath('no-org')).toBe(expected);
  });

  it('returns framework path when goals.json exists in framework root', () => {
    const fwPath = path.join(tmpFramework, 'orgs', 'goalsorg', 'goals.json');
    fs.mkdirSync(path.dirname(fwPath), { recursive: true });
    fs.writeFileSync(fwPath, '{}');
    expect(getGoalsPath('goalsorg')).toBe(fwPath);
    fs.rmSync(path.join(tmpFramework, 'orgs', 'goalsorg'), { recursive: true, force: true });
  });

  it('returns state path when goals.json exists only in state root', () => {
    const statePath = path.join(tmpState, 'orgs', 'stateorg', 'goals.json');
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, '{}');
    expect(getGoalsPath('stateorg')).toBe(statePath);
    fs.rmSync(path.join(tmpState, 'orgs', 'stateorg'), { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// Pure path helpers — framework root
// ---------------------------------------------------------------------------

describe('framework-root path helpers', () => {
  it('getOrgContextPath returns <CTX_FRAMEWORK_ROOT>/orgs/<org>/context.json', () => {
    expect(getOrgContextPath('glv')).toBe(
      path.join(tmpFramework, 'orgs', 'glv', 'context.json'),
    );
  });

  it('getOrgBrandVoicePath returns <CTX_FRAMEWORK_ROOT>/orgs/<org>/brand-voice.md', () => {
    expect(getOrgBrandVoicePath('glv')).toBe(
      path.join(tmpFramework, 'orgs', 'glv', 'brand-voice.md'),
    );
  });

  it('getClientsDir returns <CTX_FRAMEWORK_ROOT>/orgs/<org>/clients', () => {
    expect(getClientsDir('glv')).toBe(path.join(tmpFramework, 'orgs', 'glv', 'clients'));
  });

  it('getClientDir returns <CTX_FRAMEWORK_ROOT>/orgs/<org>/clients/<client>', () => {
    expect(getClientDir('glv', 'reyco')).toBe(
      path.join(tmpFramework, 'orgs', 'glv', 'clients', 'reyco'),
    );
  });
});

// ---------------------------------------------------------------------------
// Agent-scoped path helpers (state root)
// ---------------------------------------------------------------------------

describe('agent-scoped path helpers', () => {
  it('getAgentStateDir returns <CTX_ROOT>/state/<agent>', () => {
    expect(getAgentStateDir('dev')).toBe(path.join(tmpState, 'state', 'dev'));
  });

  it('getHeartbeatPath returns <CTX_ROOT>/state/<agent>/heartbeat.json', () => {
    expect(getHeartbeatPath('dev')).toBe(
      path.join(tmpState, 'state', 'dev', 'heartbeat.json'),
    );
  });

  it('getInboxDir returns <CTX_ROOT>/inbox/<agent>', () => {
    expect(getInboxDir('dev')).toBe(path.join(tmpState, 'inbox', 'dev'));
  });

  it('getLogDir returns <CTX_ROOT>/logs/<agent>', () => {
    expect(getLogDir('dev')).toBe(path.join(tmpState, 'logs', 'dev'));
  });

  it('getAllowedRootsConfigPath returns <CTX_ROOT>/config/allowed-roots.json', () => {
    expect(getAllowedRootsConfigPath()).toBe(
      path.join(tmpState, 'config', 'allowed-roots.json'),
    );
  });
});

// ---------------------------------------------------------------------------
// getAgentDir — prefers framework root if dir exists there
// ---------------------------------------------------------------------------

describe('getAgentDir', () => {
  it('returns state path when framework dir does not exist (org variant)', () => {
    const expected = path.join(tmpState, 'orgs', 'glv', 'agents', 'ghost');
    expect(getAgentDir('ghost', 'glv')).toBe(expected);
  });

  it('returns framework path when framework dir exists (org variant)', () => {
    const fwDir = path.join(tmpFramework, 'orgs', 'agentorg', 'agents', 'dev');
    fs.mkdirSync(fwDir, { recursive: true });
    expect(getAgentDir('dev', 'agentorg')).toBe(fwDir);
    fs.rmSync(path.join(tmpFramework, 'orgs', 'agentorg'), { recursive: true, force: true });
  });

  it('returns state path when framework dir does not exist (no-org variant)', () => {
    const expected = path.join(tmpState, 'agents', 'orphan');
    expect(getAgentDir('orphan')).toBe(expected);
  });

  it('returns framework path when framework dir exists (no-org variant)', () => {
    const fwDir = path.join(tmpFramework, 'agents', 'global-agent');
    fs.mkdirSync(fwDir, { recursive: true });
    expect(getAgentDir('global-agent')).toBe(fwDir);
    fs.rmSync(fwDir, { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// getOrgs — discovery
// ---------------------------------------------------------------------------

describe('getOrgs', () => {
  it('returns empty array when both roots have no orgs dir', () => {
    expect(getOrgs()).toEqual([]);
  });

  it('returns orgs from framework root', () => {
    const orgDir = path.join(tmpFramework, 'orgs', 'acme');
    fs.mkdirSync(orgDir, { recursive: true });
    expect(getOrgs()).toContain('acme');
    fs.rmSync(orgDir, { recursive: true, force: true });
  });

  it('returns orgs from state root when not in framework root', () => {
    const stateOrgDir = path.join(tmpState, 'orgs', 'stateonly');
    fs.mkdirSync(stateOrgDir, { recursive: true });
    expect(getOrgs()).toContain('stateonly');
    fs.rmSync(stateOrgDir, { recursive: true, force: true });
  });

  it('framework casing wins when same org exists in both roots with different casing', () => {
    const fwDir = path.join(tmpFramework, 'orgs', 'UpperCaseOrg');
    const stateDir = path.join(tmpState, 'orgs', 'uppercaseorg');
    fs.mkdirSync(fwDir, { recursive: true });
    fs.mkdirSync(stateDir, { recursive: true });
    const orgs = getOrgs();
    expect(orgs).toContain('UpperCaseOrg');
    expect(orgs).not.toContain('uppercaseorg');
    fs.rmSync(fwDir, { recursive: true, force: true });
    fs.rmSync(stateDir, { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// getAgentsForOrg — discovery
// ---------------------------------------------------------------------------

describe('getAgentsForOrg', () => {
  it('returns empty array when no agents dirs exist', () => {
    expect(getAgentsForOrg('empty-org')).toEqual([]);
  });

  it('returns agents from state agents dir', () => {
    const dir = path.join(tmpState, 'orgs', 'myorg', 'agents', 'worker');
    fs.mkdirSync(dir, { recursive: true });
    expect(getAgentsForOrg('myorg')).toContain('worker');
    fs.rmSync(path.join(tmpState, 'orgs', 'myorg'), { recursive: true, force: true });
  });

  it('merges agents from both state and framework dirs (union)', () => {
    const stateDir = path.join(tmpState, 'orgs', 'combo', 'agents', 'alpha');
    const fwDir = path.join(tmpFramework, 'orgs', 'combo', 'agents', 'beta');
    fs.mkdirSync(stateDir, { recursive: true });
    fs.mkdirSync(fwDir, { recursive: true });
    const agents = getAgentsForOrg('combo');
    expect(agents).toContain('alpha');
    expect(agents).toContain('beta');
    fs.rmSync(path.join(tmpState, 'orgs', 'combo'), { recursive: true, force: true });
    fs.rmSync(path.join(tmpFramework, 'orgs', 'combo'), { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// getAllAgents — enabled-agents.json + org scan
// ---------------------------------------------------------------------------

describe('getAllAgents', () => {
  it('returns empty array when no config file and no orgs', () => {
    expect(getAllAgents()).toEqual([]);
  });

  it('returns agents from enabled-agents.json (enabled: true)', () => {
    const configDir = path.join(tmpState, 'config');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(
      path.join(configDir, 'enabled-agents.json'),
      JSON.stringify({ dev: { enabled: true, org: 'glv' } }),
    );
    const agents = getAllAgents();
    expect(agents).toContainEqual({ name: 'dev', org: 'glv' });
    fs.unlinkSync(path.join(configDir, 'enabled-agents.json'));
  });

  it('excludes agents with enabled: false from enabled-agents.json', () => {
    const configDir = path.join(tmpState, 'config');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(
      path.join(configDir, 'enabled-agents.json'),
      JSON.stringify({ disabled: { enabled: false, org: 'glv' } }),
    );
    const agents = getAllAgents();
    expect(agents.find((a) => a.name === 'disabled')).toBeUndefined();
    fs.unlinkSync(path.join(configDir, 'enabled-agents.json'));
  });

  it('deduplicates agents found in both enabled-agents.json and org scan', () => {
    const configDir = path.join(tmpState, 'config');
    const agentDir = path.join(tmpFramework, 'orgs', 'dedup', 'agents', 'scout');
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(
      path.join(configDir, 'enabled-agents.json'),
      JSON.stringify({ scout: { enabled: true, org: 'dedup' } }),
    );
    const agents = getAllAgents();
    const scoutEntries = agents.filter((a) => a.name === 'scout');
    expect(scoutEntries).toHaveLength(1);
    fs.unlinkSync(path.join(configDir, 'enabled-agents.json'));
    fs.rmSync(path.join(tmpFramework, 'orgs', 'dedup'), { recursive: true, force: true });
  });
});
