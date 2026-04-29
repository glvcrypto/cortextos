import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { homedir } from 'os';
import { resolvePaths, getIpcPath } from '../../../src/utils/paths';

// ---------------------------------------------------------------------------
// resolvePaths
// ---------------------------------------------------------------------------

describe('resolvePaths — structure', () => {
  it('returns all expected keys', () => {
    const p = resolvePaths('dev');
    expect(p).toHaveProperty('ctxRoot');
    expect(p).toHaveProperty('inbox');
    expect(p).toHaveProperty('inflight');
    expect(p).toHaveProperty('processed');
    expect(p).toHaveProperty('logDir');
    expect(p).toHaveProperty('stateDir');
    expect(p).toHaveProperty('taskDir');
    expect(p).toHaveProperty('approvalDir');
    expect(p).toHaveProperty('analyticsDir');
    expect(p).toHaveProperty('deliverablesDir');
  });
});

describe('resolvePaths — ctxRoot', () => {
  it('defaults instanceId to "default"', () => {
    const p = resolvePaths('dev');
    expect(p.ctxRoot).toBe(join(homedir(), '.cortextos', 'default'));
  });

  it('uses provided instanceId', () => {
    const p = resolvePaths('dev', 'my-instance');
    expect(p.ctxRoot).toBe(join(homedir(), '.cortextos', 'my-instance'));
  });
});

describe('resolvePaths — flat agent paths', () => {
  it('inbox is flat under ctxRoot/inbox/{agent}', () => {
    const p = resolvePaths('dev', 'test-inst');
    expect(p.inbox).toBe(join(homedir(), '.cortextos', 'test-inst', 'inbox', 'dev'));
  });

  it('inflight is flat under ctxRoot/inflight/{agent}', () => {
    const p = resolvePaths('dev', 'test-inst');
    expect(p.inflight).toBe(join(homedir(), '.cortextos', 'test-inst', 'inflight', 'dev'));
  });

  it('processed is flat under ctxRoot/processed/{agent}', () => {
    const p = resolvePaths('dev', 'test-inst');
    expect(p.processed).toBe(join(homedir(), '.cortextos', 'test-inst', 'processed', 'dev'));
  });

  it('logDir is flat under ctxRoot/logs/{agent}', () => {
    const p = resolvePaths('dev', 'test-inst');
    expect(p.logDir).toBe(join(homedir(), '.cortextos', 'test-inst', 'logs', 'dev'));
  });

  it('stateDir is flat under ctxRoot/state/{agent}', () => {
    const p = resolvePaths('dev', 'test-inst');
    expect(p.stateDir).toBe(join(homedir(), '.cortextos', 'test-inst', 'state', 'dev'));
  });
});

describe('resolvePaths — org-scoped paths', () => {
  it('taskDir is org-scoped when org provided', () => {
    const p = resolvePaths('dev', 'inst', 'glv');
    expect(p.taskDir).toBe(join(homedir(), '.cortextos', 'inst', 'orgs', 'glv', 'tasks'));
  });

  it('approvalDir is org-scoped when org provided', () => {
    const p = resolvePaths('dev', 'inst', 'glv');
    expect(p.approvalDir).toBe(join(homedir(), '.cortextos', 'inst', 'orgs', 'glv', 'approvals'));
  });

  it('analyticsDir is org-scoped when org provided', () => {
    const p = resolvePaths('dev', 'inst', 'glv');
    expect(p.analyticsDir).toBe(join(homedir(), '.cortextos', 'inst', 'orgs', 'glv', 'analytics'));
  });

  it('deliverablesDir is org-scoped when org provided', () => {
    const p = resolvePaths('dev', 'inst', 'glv');
    expect(p.deliverablesDir).toBe(join(homedir(), '.cortextos', 'inst', 'orgs', 'glv', 'deliverables'));
  });

  it('taskDir falls back to ctxRoot when org absent', () => {
    const p = resolvePaths('dev', 'inst');
    expect(p.taskDir).toBe(join(homedir(), '.cortextos', 'inst', 'tasks'));
  });

  it('analyticsDir falls back to ctxRoot when org absent', () => {
    const p = resolvePaths('dev', 'inst');
    expect(p.analyticsDir).toBe(join(homedir(), '.cortextos', 'inst', 'analytics'));
  });
});

describe('resolvePaths — instanceId validation', () => {
  it('throws on empty instanceId', () => {
    expect(() => resolvePaths('dev', '')).toThrow();
  });

  it('throws on instanceId with path separator', () => {
    expect(() => resolvePaths('dev', 'bad/instance')).toThrow();
  });

  it('throws on path-traversal instanceId', () => {
    expect(() => resolvePaths('dev', '../traversal')).toThrow();
  });

  it('accepts valid instanceId with hyphen', () => {
    expect(() => resolvePaths('dev', 'ci-test')).not.toThrow();
  });

  it('accepts valid instanceId with underscore', () => {
    expect(() => resolvePaths('dev', 'e2e_run')).not.toThrow();
  });
});

describe('resolvePaths — different agents share same instanceId ctxRoot', () => {
  it('two agents same instance share same ctxRoot', () => {
    const p1 = resolvePaths('dev', 'shared');
    const p2 = resolvePaths('seo', 'shared');
    expect(p1.ctxRoot).toBe(p2.ctxRoot);
  });

  it('two agents have distinct stateDir', () => {
    const p1 = resolvePaths('dev', 'shared');
    const p2 = resolvePaths('seo', 'shared');
    expect(p1.stateDir).not.toBe(p2.stateDir);
  });

  it('two agents have distinct inbox', () => {
    const p1 = resolvePaths('dev', 'shared');
    const p2 = resolvePaths('seo', 'shared');
    expect(p1.inbox).not.toBe(p2.inbox);
  });
});

// ---------------------------------------------------------------------------
// getIpcPath
// ---------------------------------------------------------------------------

describe('getIpcPath', () => {
  it('returns a string', () => {
    expect(typeof getIpcPath()).toBe('string');
  });

  it('defaults instanceId to "default"', () => {
    const path = getIpcPath();
    expect(path).toContain('default');
  });

  it('embeds instanceId in path', () => {
    const path = getIpcPath('my-inst');
    expect(path).toContain('my-inst');
  });

  it('returns daemon.sock path on non-Windows', () => {
    if (process.platform !== 'win32') {
      expect(getIpcPath('test')).toContain('daemon.sock');
    }
  });

  it('throws on invalid instanceId', () => {
    expect(() => getIpcPath('../bad')).toThrow();
  });
});
