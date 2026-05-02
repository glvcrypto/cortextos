import { describe, it, expect, vi } from 'vitest';
import { commandExists, SAFE_CMD } from '../../../src/cli/start.js';
import type { SpawnSyncReturns } from 'child_process';

function makeSpawn(status: number): typeof import('child_process').spawnSync {
  return vi.fn().mockReturnValue({ status, pid: 1, output: [], stdout: '', stderr: '', signal: null, error: undefined } as unknown as SpawnSyncReturns<string>);
}

describe('SAFE_CMD regex', () => {
  it('allows typical command names (letters, digits, dots, hyphens)', () => {
    expect(SAFE_CMD.test('pm2')).toBe(true);
    expect(SAFE_CMD.test('node')).toBe(true);
    expect(SAFE_CMD.test('npm')).toBe(true);
    expect(SAFE_CMD.test('cloudflared')).toBe(true);
  });

  it('allows @ prefix (e.g. scoped bin paths)', () => {
    expect(SAFE_CMD.test('@scope/bin')).toBe(true);
  });

  it('rejects shell metacharacters that could enable injection', () => {
    expect(SAFE_CMD.test('; rm -rf /')).toBe(false);
    expect(SAFE_CMD.test('$(malicious)')).toBe(false);
    expect(SAFE_CMD.test('`echo`')).toBe(false);
    expect(SAFE_CMD.test('a&&b')).toBe(false);
    expect(SAFE_CMD.test('cmd|pipe')).toBe(false);
  });
});

describe('commandExists', () => {
  it('returns false immediately for commands with unsafe characters (no spawnSync call)', () => {
    const spy = makeSpawn(0);
    const result = commandExists('; evil', spy, false);
    expect(result).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('returns true when which exits 0 (command found)', () => {
    const spy = makeSpawn(0);
    const result = commandExists('pm2', spy, false);
    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledWith('which', ['pm2'], { stdio: 'pipe' });
  });

  it('returns false when which exits non-zero (command not found)', () => {
    const spy = makeSpawn(1);
    const result = commandExists('nonexistent-tool', spy, false);
    expect(result).toBe(false);
  });

  it('uses "where" on Windows instead of "which"', () => {
    const spy = makeSpawn(0);
    commandExists('pm2', spy, true);
    expect(spy).toHaveBeenCalledWith('where', ['pm2'], { stdio: 'pipe' });
  });
});
