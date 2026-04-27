import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { tmpdir } from 'os';
import { resolveEnv, writeCortextosEnv, sourceEnvFile } from '../../../src/utils/env';

// Keys we inject into env during tests — cleaned up in afterEach
const ENV_KEYS = [
  'CTX_INSTANCE_ID', 'CTX_ROOT', 'CTX_FRAMEWORK_ROOT', 'CTX_AGENT_NAME',
  'CTX_ORG', 'CTX_AGENT_DIR', 'CTX_PROJECT_ROOT', 'CTX_TIMEZONE', 'CTX_ORCHESTRATOR',
];

let tmpDir: string;
let originalCwd: string;
let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'cortextos-env-test-'));
  originalCwd = process.cwd();
  savedEnv = {};
  for (const k of ENV_KEYS) {
    savedEnv[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  // Restore cwd
  process.chdir(originalCwd);
  // Restore env
  for (const [k, v] of Object.entries(savedEnv)) {
    if (v === undefined) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
  try {
    rmSync(tmpDir, { recursive: true, force: true });
  } catch { /* ignore */ }
});

describe('resolveEnv — defaults', () => {
  it('instanceId defaults to "default"', () => {
    const env = resolveEnv();
    expect(env.instanceId).toBe('default');
  });

  it('agentName defaults to basename of cwd', () => {
    // Use a fixed lowercase name — mkdtempSync appends uppercase chars that fail agent name validation
    const namedDir = join(tmpDir, 'my-test-agent');
    require('fs').mkdirSync(namedDir, { recursive: true });
    process.chdir(namedDir);
    const env = resolveEnv();
    expect(env.agentName).toBe('my-test-agent');
  });

  it('org defaults to empty string', () => {
    const env = resolveEnv();
    expect(env.org).toBe('');
  });

  it('frameworkRoot defaults to empty string', () => {
    const env = resolveEnv();
    expect(env.frameworkRoot).toBe('');
  });
});

describe('resolveEnv — env vars', () => {
  it('CTX_INSTANCE_ID overrides default', () => {
    process.env.CTX_INSTANCE_ID = 'staging';
    expect(resolveEnv().instanceId).toBe('staging');
  });

  it('CTX_AGENT_NAME overrides basename(cwd)', () => {
    process.env.CTX_AGENT_NAME = 'dev';
    expect(resolveEnv().agentName).toBe('dev');
  });

  it('CTX_ORG is returned as org', () => {
    process.env.CTX_ORG = 'glv';
    expect(resolveEnv().org).toBe('glv');
  });
});

describe('resolveEnv — overrides parameter', () => {
  it('overrides.instanceId wins over env var', () => {
    process.env.CTX_INSTANCE_ID = 'fromenv';
    expect(resolveEnv({ instanceId: 'fromoverride' }).instanceId).toBe('fromoverride');
  });

  it('overrides.agentName wins over env var', () => {
    process.env.CTX_AGENT_NAME = 'fromenv';
    expect(resolveEnv({ agentName: 'fromoverride' }).agentName).toBe('fromoverride');
  });

  it('overrides.org wins over env var', () => {
    process.env.CTX_ORG = 'fromenv';
    expect(resolveEnv({ org: 'fromoverride' }).org).toBe('fromoverride');
  });
});

describe('resolveEnv — .cortextos-env file', () => {
  // All tests that call chdir(tmpDir) must supply a valid agent name in the file,
  // because mkdtempSync produces uppercase chars in the dir name that fail validation.
  const AGENT_LINE = 'CTX_AGENT_NAME=dev\n';

  it('reads CTX_AGENT_NAME from .cortextos-env in cwd', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), 'CTX_AGENT_NAME=fileagent\n');
    process.chdir(tmpDir);
    expect(resolveEnv().agentName).toBe('fileagent');
  });

  it('env var overrides .cortextos-env value', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), `${AGENT_LINE}CTX_INSTANCE_ID=fromfile\n`);
    process.chdir(tmpDir);
    process.env.CTX_INSTANCE_ID = 'fromenv';
    expect(resolveEnv().instanceId).toBe('fromenv');
  });

  it('parses double-quoted values', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), `${AGENT_LINE}CTX_INSTANCE_ID="quoted"\n`);
    process.chdir(tmpDir);
    expect(resolveEnv().instanceId).toBe('quoted');
  });

  it('parses single-quoted values', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), `${AGENT_LINE}CTX_INSTANCE_ID='singlequoted'\n`);
    process.chdir(tmpDir);
    expect(resolveEnv().instanceId).toBe('singlequoted');
  });

  it('ignores # comment lines', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), `${AGENT_LINE}# this is a comment\nCTX_INSTANCE_ID=aftercomment\n`);
    process.chdir(tmpDir);
    expect(resolveEnv().instanceId).toBe('aftercomment');
  });

  it('strips inline # comments from unquoted values', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), `${AGENT_LINE}CTX_INSTANCE_ID=myval # inline comment\n`);
    process.chdir(tmpDir);
    expect(resolveEnv().instanceId).toBe('myval');
  });

  it('skips lines without =', () => {
    writeFileSync(join(tmpDir, '.cortextos-env'), `${AGENT_LINE}NOT_A_PAIR\nCTX_INSTANCE_ID=valid\n`);
    process.chdir(tmpDir);
    expect(resolveEnv().instanceId).toBe('valid');
  });
});

describe('resolveEnv — agentDir computation', () => {
  it('computes agentDir from projectRoot + org + agentName', () => {
    const env = resolveEnv({
      projectRoot: '/repo',
      org: 'glv',
      agentName: 'dev',
    });
    expect(env.agentDir).toBe(join('/repo', 'orgs', 'glv', 'agents', 'dev'));
  });

  it('computes agentDir from projectRoot alone when no org', () => {
    const env = resolveEnv({
      projectRoot: '/repo',
      org: '',
      agentName: 'dev',
    });
    expect(env.agentDir).toBe(join('/repo', 'agents', 'dev'));
  });

  it('explicit agentDir overrides computed value', () => {
    const env = resolveEnv({
      projectRoot: '/repo',
      org: 'glv',
      agentName: 'dev',
      agentDir: '/custom/path',
    });
    expect(env.agentDir).toBe('/custom/path');
  });
});

describe('resolveEnv — timezone/orchestrator from context.json', () => {
  it('reads timezone + orchestrator from orgs/{org}/context.json', () => {
    const orgDir = join(tmpDir, 'orgs', 'glv');
    require('fs').mkdirSync(orgDir, { recursive: true });
    writeFileSync(
      join(orgDir, 'context.json'),
      JSON.stringify({ timezone: 'America/Toronto', orchestrator: 'boss' }),
    );
    const env = resolveEnv({ projectRoot: tmpDir, org: 'glv', agentName: 'dev' });
    expect(env.timezone).toBe('America/Toronto');
    expect(env.orchestrator).toBe('boss');
  });

  it('explicit overrides win over context.json values', () => {
    const orgDir = join(tmpDir, 'orgs', 'glv');
    require('fs').mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'context.json'), JSON.stringify({ timezone: 'UTC', orchestrator: 'boss' }));
    const env = resolveEnv({
      projectRoot: tmpDir,
      org: 'glv',
      agentName: 'dev',
      timezone: 'America/Vancouver',
      orchestrator: 'custom',
    });
    expect(env.timezone).toBe('America/Vancouver');
    expect(env.orchestrator).toBe('custom');
  });
});

describe('resolveEnv — validation', () => {
  it('throws on invalid CTX_AGENT_NAME (uppercase)', () => {
    process.env.CTX_AGENT_NAME = 'BadAgent';
    expect(() => resolveEnv()).toThrow(/CTX_AGENT_NAME is invalid/);
  });

  it('throws on CTX_AGENT_NAME with path traversal', () => {
    process.env.CTX_AGENT_NAME = '../escape';
    expect(() => resolveEnv()).toThrow(/CTX_AGENT_NAME is invalid/);
  });

  it('throws on CTX_ORG with unsafe characters', () => {
    process.env.CTX_ORG = '../escape';
    expect(() => resolveEnv()).toThrow(/CTX_ORG is invalid/);
  });

  it('throws on CTX_ORG with path separator', () => {
    process.env.CTX_ORG = 'org/subdir';
    expect(() => resolveEnv()).toThrow(/CTX_ORG is invalid/);
  });

  it('accepts mixed-case org (legacy dirs predating strict enforcement)', () => {
    expect(() => resolveEnv({ org: 'AcmeCorp', agentName: 'dev' })).not.toThrow();
  });
});

describe('writeCortextosEnv', () => {
  it('creates .cortextos-env file in agentDir', () => {
    const agentDir = join(tmpDir, 'myagent');
    const env = resolveEnv({ instanceId: 'test', agentName: 'dev', org: 'glv' });
    writeCortextosEnv(agentDir, env);
    expect(existsSync(join(agentDir, '.cortextos-env'))).toBe(true);
  });

  it('file contains all expected KEY=VALUE pairs', () => {
    const agentDir = join(tmpDir, 'myagent');
    const env = resolveEnv({ instanceId: 'test', agentName: 'dev', org: 'glv', projectRoot: '/repo' });
    writeCortextosEnv(agentDir, env);
    const content = readFileSync(join(agentDir, '.cortextos-env'), 'utf-8');
    expect(content).toContain('CTX_INSTANCE_ID=test');
    expect(content).toContain('CTX_AGENT_NAME=dev');
    expect(content).toContain('CTX_ORG=glv');
    expect(content).toContain('CTX_PROJECT_ROOT=/repo');
  });

  it('creates agentDir if it does not exist', () => {
    const agentDir = join(tmpDir, 'new', 'nested', 'dir');
    const env = resolveEnv({ agentName: 'dev' });
    writeCortextosEnv(agentDir, env);
    expect(existsSync(agentDir)).toBe(true);
  });
});

describe('sourceEnvFile', () => {
  afterEach(() => {
    delete process.env.TEST_SOURCE_VAR;
    delete process.env.TEST_SOURCE_OTHER;
  });

  it('sets env vars from file', () => {
    writeFileSync(join(tmpDir, 'test.env'), 'TEST_SOURCE_VAR=hello\n');
    sourceEnvFile(join(tmpDir, 'test.env'));
    expect(process.env.TEST_SOURCE_VAR).toBe('hello');
  });

  it('does not override already-set env vars', () => {
    process.env.TEST_SOURCE_VAR = 'original';
    writeFileSync(join(tmpDir, 'test.env'), 'TEST_SOURCE_VAR=overridden\n');
    sourceEnvFile(join(tmpDir, 'test.env'));
    expect(process.env.TEST_SOURCE_VAR).toBe('original');
  });

  it('does not throw if file does not exist', () => {
    expect(() => sourceEnvFile(join(tmpDir, 'nonexistent.env'))).not.toThrow();
  });

  it('strips double-quoted values', () => {
    writeFileSync(join(tmpDir, 'test.env'), 'TEST_SOURCE_VAR="quoted value"\n');
    sourceEnvFile(join(tmpDir, 'test.env'));
    expect(process.env.TEST_SOURCE_VAR).toBe('quoted value');
  });

  it('strips inline comments from unquoted values', () => {
    writeFileSync(join(tmpDir, 'test.env'), 'TEST_SOURCE_VAR=clean # comment\n');
    sourceEnvFile(join(tmpDir, 'test.env'));
    expect(process.env.TEST_SOURCE_VAR).toBe('clean');
  });
});
