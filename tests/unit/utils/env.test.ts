import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';
import { resolveEnv, writeCortextosEnv, sourceEnvFile } from '../../../src/utils/env';

let tmpDir: string;
const origCwd = process.cwd();
const origEnv: Record<string, string | undefined> = {};

const CTX_KEYS = [
  'CTX_INSTANCE_ID', 'CTX_ROOT', 'CTX_FRAMEWORK_ROOT', 'CTX_AGENT_NAME',
  'CTX_ORG', 'CTX_AGENT_DIR', 'CTX_PROJECT_ROOT', 'CTX_TIMEZONE', 'CTX_ORCHESTRATOR',
];

function saveEnv() {
  for (const k of CTX_KEYS) origEnv[k] = process.env[k];
}
function restoreEnv() {
  for (const k of CTX_KEYS) {
    if (origEnv[k] === undefined) delete process.env[k];
    else process.env[k] = origEnv[k];
  }
}
function clearEnv() {
  for (const k of CTX_KEYS) delete process.env[k];
  // tmpdir basenames contain uppercase (e.g. ctx-env-test-XyZ123) which fails
  // agentName validation. Set a known-good default so all tests can isolate
  // the variable they actually care about.
  process.env.CTX_AGENT_NAME = 'test-dev';
}

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'ctx-env-test-'));
  saveEnv();
  clearEnv();
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(origCwd);
  restoreEnv();
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
});

// ---------------------------------------------------------------------------
// resolveEnv — defaults
// ---------------------------------------------------------------------------

describe('resolveEnv — defaults', () => {
  it('instanceId defaults to "default"', () => {
    expect(resolveEnv().instanceId).toBe('default');
  });

  it('ctxRoot defaults to ~/.cortextos/default', () => {
    expect(resolveEnv().ctxRoot).toBe(join(homedir(), '.cortextos', 'default'));
  });

  it('agentName defaults to basename(cwd) when CTX_AGENT_NAME unset', () => {
    // Create a tmpdir whose basename is a valid agent name so the fallback path
    // resolves without triggering the validator.
    const validAgentDir = require('path').join(tmpDir, 'my-valid-agent');
    require('fs').mkdirSync(validAgentDir, { recursive: true });
    delete process.env.CTX_AGENT_NAME;
    const origCwdLocal = process.cwd();
    process.chdir(validAgentDir);
    try {
      expect(resolveEnv().agentName).toBe('my-valid-agent');
    } finally {
      process.chdir(origCwdLocal);
      process.env.CTX_AGENT_NAME = 'test-dev';
    }
  });

  it('org defaults to empty string', () => {
    expect(resolveEnv().org).toBe('');
  });

  it('frameworkRoot defaults to empty string', () => {
    expect(resolveEnv().frameworkRoot).toBe('');
  });
});

// ---------------------------------------------------------------------------
// resolveEnv — env var priority
// ---------------------------------------------------------------------------

describe('resolveEnv — env var priority', () => {
  it('reads CTX_INSTANCE_ID from process.env', () => {
    process.env.CTX_INSTANCE_ID = 'my-instance';
    expect(resolveEnv().instanceId).toBe('my-instance');
  });

  it('reads CTX_ORG from process.env', () => {
    process.env.CTX_ORG = 'glv';
    expect(resolveEnv().org).toBe('glv');
  });

  it('reads CTX_AGENT_NAME from process.env', () => {
    process.env.CTX_AGENT_NAME = 'dev';
    expect(resolveEnv().agentName).toBe('dev');
  });

  it('reads CTX_TIMEZONE from process.env', () => {
    process.env.CTX_TIMEZONE = 'America/Toronto';
    expect(resolveEnv().timezone).toBe('America/Toronto');
  });

  it('reads CTX_ORCHESTRATOR from process.env', () => {
    process.env.CTX_ORCHESTRATOR = 'boss';
    expect(resolveEnv().orchestrator).toBe('boss');
  });
});

// ---------------------------------------------------------------------------
// resolveEnv — overrides win over env vars
// ---------------------------------------------------------------------------

describe('resolveEnv — overrides take priority over env vars', () => {
  it('override instanceId beats env var', () => {
    process.env.CTX_INSTANCE_ID = 'from-env';
    expect(resolveEnv({ instanceId: 'from-override' }).instanceId).toBe('from-override');
  });

  it('override agentName beats env var', () => {
    process.env.CTX_AGENT_NAME = 'env-agent';
    expect(resolveEnv({ agentName: 'override-agent' }).agentName).toBe('override-agent');
  });
});

// ---------------------------------------------------------------------------
// resolveEnv — .cortextos-env file parsing
// ---------------------------------------------------------------------------

describe('resolveEnv — .cortextos-env file', () => {
  it('reads instanceId from .cortextos-env when env var absent', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'CTX_INSTANCE_ID=file-instance\n');
    expect(resolveEnv().instanceId).toBe('file-instance');
  });

  it('reads CTX_ORG from .cortextos-env', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'CTX_ORG=myorg\n');
    expect(resolveEnv().org).toBe('myorg');
  });

  it('env var beats .cortextos-env', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'CTX_ORG=file-org\n');
    process.env.CTX_ORG = 'env-org';
    expect(resolveEnv().org).toBe('env-org');
  });

  it('handles quoted values in .cortextos-env', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'CTX_ORG="quoted-org"\n');
    expect(resolveEnv().org).toBe('quoted-org');
  });

  it('handles single-quoted values in .cortextos-env', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), "CTX_ORG='single-quoted'\n");
    expect(resolveEnv().org).toBe('single-quoted');
  });

  it('strips inline # comments from .cortextos-env', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'CTX_ORG=myorg # comment\n');
    expect(resolveEnv().org).toBe('myorg');
  });

  it('ignores comment lines in .cortextos-env', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), '# comment\nCTX_ORG=myorg\n');
    expect(resolveEnv().org).toBe('myorg');
  });

  it('ignores lines without =', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'NOT_A_PAIR\nCTX_ORG=myorg\n');
    expect(resolveEnv().org).toBe('myorg');
  });
});

// ---------------------------------------------------------------------------
// resolveEnv — agentDir inference
// ---------------------------------------------------------------------------

describe('resolveEnv — agentDir inference', () => {
  it('infers agentDir from projectRoot + org + agentName', () => {
    const env = resolveEnv({ projectRoot: '/proj', org: 'myorg', agentName: 'dev' });
    expect(env.agentDir).toBe('/proj/orgs/myorg/agents/dev');
  });

  it('infers agentDir from projectRoot + agentName when org empty', () => {
    const env = resolveEnv({ projectRoot: '/proj', org: '', agentName: 'dev' });
    expect(env.agentDir).toBe('/proj/agents/dev');
  });

  it('explicit CTX_AGENT_DIR beats inference', () => {
    process.env.CTX_AGENT_DIR = '/explicit/path';
    const env = resolveEnv({ projectRoot: '/proj', org: 'myorg', agentName: 'dev' });
    expect(env.agentDir).toBe('/explicit/path');
  });
});

// ---------------------------------------------------------------------------
// resolveEnv — context.json org enrichment
// ---------------------------------------------------------------------------

describe('resolveEnv — context.json org enrichment', () => {
  it('reads timezone + orchestrator from org context.json', () => {
    const projRoot = join(tmpDir, 'proj');
    mkdirSync(join(projRoot, 'orgs', 'myorg'), { recursive: true });
    writeFileSync(
      join(projRoot, 'orgs', 'myorg', 'context.json'),
      JSON.stringify({ timezone: 'America/Toronto', orchestrator: 'boss' }),
    );
    const env = resolveEnv({ projectRoot: projRoot, org: 'myorg', agentName: 'dev' });
    expect(env.timezone).toBe('America/Toronto');
    expect(env.orchestrator).toBe('boss');
  });

  it('env var beats context.json for timezone', () => {
    const projRoot = join(tmpDir, 'proj');
    mkdirSync(join(projRoot, 'orgs', 'myorg'), { recursive: true });
    writeFileSync(
      join(projRoot, 'orgs', 'myorg', 'context.json'),
      JSON.stringify({ timezone: 'UTC' }),
    );
    process.env.CTX_TIMEZONE = 'America/Toronto';
    const env = resolveEnv({ projectRoot: projRoot, org: 'myorg', agentName: 'dev' });
    expect(env.timezone).toBe('America/Toronto');
  });

  it('missing context.json is silently ignored', () => {
    expect(() => resolveEnv({ projectRoot: '/no/such/path', org: 'myorg', agentName: 'dev' })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// resolveEnv — security validation
// ---------------------------------------------------------------------------

describe('resolveEnv — security validation', () => {
  it('rejects path-traversal in CTX_AGENT_NAME', () => {
    process.env.CTX_AGENT_NAME = '../traversal';
    expect(() => resolveEnv()).toThrow(/CTX_AGENT_NAME is invalid/);
  });

  it('rejects uppercase in CTX_AGENT_NAME', () => {
    process.env.CTX_AGENT_NAME = 'BadAgent';
    expect(() => resolveEnv()).toThrow(/CTX_AGENT_NAME is invalid/);
  });

  it('rejects path-separator in CTX_ORG', () => {
    process.env.CTX_ORG = '../evil';
    expect(() => resolveEnv()).toThrow(/CTX_ORG is invalid/);
  });

  it('rejects semicolon in CTX_ORG', () => {
    process.env.CTX_ORG = 'org;bad';
    expect(() => resolveEnv()).toThrow(/CTX_ORG is invalid/);
  });

  it('rejects space in CTX_ORG', () => {
    process.env.CTX_ORG = 'my org';
    expect(() => resolveEnv()).toThrow(/CTX_ORG is invalid/);
  });

  it('allows mixed-case CTX_ORG (legacy org dirs)', () => {
    process.env.CTX_ORG = 'AcmeCorp';
    expect(() => resolveEnv()).not.toThrow();
    expect(resolveEnv().org).toBe('AcmeCorp');
  });
});

// ---------------------------------------------------------------------------
// writeCortextosEnv
// ---------------------------------------------------------------------------

describe('writeCortextosEnv', () => {
  it('writes .cortextos-env with all keys', () => {
    const agentDir = join(tmpDir, 'agent');
    const env = resolveEnv({ instanceId: 'test', agentName: 'dev', org: 'glv', projectRoot: tmpDir });
    writeCortextosEnv(agentDir, env);
    const { readFileSync, existsSync } = require('fs');
    expect(existsSync(join(agentDir, '.cortextos-env'))).toBe(true);
    const content = readFileSync(join(agentDir, '.cortextos-env'), 'utf-8');
    expect(content).toContain('CTX_INSTANCE_ID=test');
    expect(content).toContain('CTX_AGENT_NAME=dev');
    expect(content).toContain('CTX_ORG=glv');
  });

  it('creates agentDir if missing', () => {
    const agentDir = join(tmpDir, 'nested', 'new-agent');
    const env = resolveEnv({ instanceId: 'default', agentName: 'new-agent' });
    expect(() => writeCortextosEnv(agentDir, env)).not.toThrow();
    const { existsSync } = require('fs');
    expect(existsSync(agentDir)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// sourceEnvFile
// ---------------------------------------------------------------------------

describe('sourceEnvFile', () => {
  it('injects values into process.env', () => {
    const envFile = join(tmpDir, 'test.env');
    writeFileSync(envFile, 'TEST_UNIQUE_VAR_12345=hello\n');
    delete process.env.TEST_UNIQUE_VAR_12345;
    sourceEnvFile(envFile);
    expect(process.env.TEST_UNIQUE_VAR_12345).toBe('hello');
    delete process.env.TEST_UNIQUE_VAR_12345;
  });

  it('does not overwrite existing process.env values', () => {
    const envFile = join(tmpDir, 'test2.env');
    writeFileSync(envFile, 'TEST_UNIQUE_VAR_67890=new\n');
    process.env.TEST_UNIQUE_VAR_67890 = 'existing';
    sourceEnvFile(envFile);
    expect(process.env.TEST_UNIQUE_VAR_67890).toBe('existing');
    delete process.env.TEST_UNIQUE_VAR_67890;
  });

  it('silently ignores missing files', () => {
    expect(() => sourceEnvFile(join(tmpDir, 'nonexistent.env'))).not.toThrow();
  });
});
