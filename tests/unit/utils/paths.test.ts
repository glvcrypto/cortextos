import { describe, it, expect } from 'vitest';
import { homedir } from 'os';
import { join } from 'path';
import { resolvePaths, getIpcPath } from '../../../src/utils/paths';

const HOME = homedir();

describe('resolvePaths', () => {
  it('uses default instanceId when not provided', () => {
    const p = resolvePaths('myagent');
    expect(p.ctxRoot).toBe(join(HOME, '.cortextos', 'default'));
  });

  it('uses provided instanceId in ctxRoot', () => {
    const p = resolvePaths('myagent', 'prod');
    expect(p.ctxRoot).toBe(join(HOME, '.cortextos', 'prod'));
  });

  it('includes agentName in per-agent paths', () => {
    const p = resolvePaths('dev', 'default');
    expect(p.inbox).toBe(join(HOME, '.cortextos', 'default', 'inbox', 'dev'));
    expect(p.inflight).toBe(join(HOME, '.cortextos', 'default', 'inflight', 'dev'));
    expect(p.processed).toBe(join(HOME, '.cortextos', 'default', 'processed', 'dev'));
    expect(p.logDir).toBe(join(HOME, '.cortextos', 'default', 'logs', 'dev'));
    expect(p.stateDir).toBe(join(HOME, '.cortextos', 'default', 'state', 'dev'));
  });

  it('without org: taskDir/approvalDir/analyticsDir/deliverablesDir root at ctxRoot', () => {
    const p = resolvePaths('dev', 'default');
    const root = join(HOME, '.cortextos', 'default');
    expect(p.taskDir).toBe(join(root, 'tasks'));
    expect(p.approvalDir).toBe(join(root, 'approvals'));
    expect(p.analyticsDir).toBe(join(root, 'analytics'));
    expect(p.deliverablesDir).toBe(join(root, 'deliverables'));
  });

  it('with org: taskDir/approvalDir/analyticsDir/deliverablesDir are org-scoped', () => {
    const p = resolvePaths('dev', 'default', 'glv');
    const orgBase = join(HOME, '.cortextos', 'default', 'orgs', 'glv');
    expect(p.taskDir).toBe(join(orgBase, 'tasks'));
    expect(p.approvalDir).toBe(join(orgBase, 'approvals'));
    expect(p.analyticsDir).toBe(join(orgBase, 'analytics'));
    expect(p.deliverablesDir).toBe(join(orgBase, 'deliverables'));
  });

  it('with org: per-agent paths (inbox/stateDir etc.) remain flat under ctxRoot', () => {
    const p = resolvePaths('dev', 'default', 'glv');
    expect(p.inbox).toBe(join(HOME, '.cortextos', 'default', 'inbox', 'dev'));
    expect(p.stateDir).toBe(join(HOME, '.cortextos', 'default', 'state', 'dev'));
  });

  it('throws on invalid instanceId', () => {
    expect(() => resolvePaths('dev', 'bad instance')).toThrow();
    expect(() => resolvePaths('dev', '../traversal')).toThrow();
  });

  it('returns a BusPaths object with all expected keys', () => {
    const p = resolvePaths('dev');
    const keys = ['ctxRoot', 'inbox', 'inflight', 'processed', 'logDir', 'stateDir',
                  'taskDir', 'approvalDir', 'analyticsDir', 'deliverablesDir'];
    for (const key of keys) {
      expect(p).toHaveProperty(key);
      expect(typeof (p as Record<string, string>)[key]).toBe('string');
    }
  });
});

describe('getIpcPath', () => {
  it('returns a path containing the instanceId', () => {
    const p = getIpcPath('default');
    expect(p).toContain('default');
  });

  it('on non-Windows: returns a Unix socket path under ~/.cortextos', () => {
    if (process.platform === 'win32') return;
    const p = getIpcPath('default');
    expect(p).toBe(join(HOME, '.cortextos', 'default', 'daemon.sock'));
  });

  it('different instanceIds produce different paths', () => {
    const a = getIpcPath('alpha');
    const b = getIpcPath('beta');
    expect(a).not.toBe(b);
  });

  it('throws on invalid instanceId', () => {
    expect(() => getIpcPath('bad id')).toThrow();
    expect(() => getIpcPath('../escape')).toThrow();
  });
});
