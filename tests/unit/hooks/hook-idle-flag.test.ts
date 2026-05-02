import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { writeIdleFlag } from '../../../src/hooks/hook-idle-flag.js';

describe('writeIdleFlag', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'ctx-idle-test-'));
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('creates state dir and writes Unix timestamp to last_idle.flag', () => {
    const before = Math.floor(Date.now() / 1000);
    writeIdleFlag('boss', 'default', tmpRoot);
    const flagPath = join(tmpRoot, '.cortextos', 'default', 'state', 'boss', 'last_idle.flag');
    expect(existsSync(flagPath)).toBe(true);
    const written = parseInt(readFileSync(flagPath, 'utf-8'), 10);
    const after = Math.floor(Date.now() / 1000);
    expect(written).toBeGreaterThanOrEqual(before);
    expect(written).toBeLessThanOrEqual(after);
  });

  it('uses instanceId segment in the path', () => {
    writeIdleFlag('seo', 'staging', tmpRoot);
    const flagPath = join(tmpRoot, '.cortextos', 'staging', 'state', 'seo', 'last_idle.flag');
    expect(existsSync(flagPath)).toBe(true);
  });

  it('overwrites existing flag on repeated call', () => {
    writeIdleFlag('dev', 'default', tmpRoot);
    const flagPath = join(tmpRoot, '.cortextos', 'default', 'state', 'dev', 'last_idle.flag');
    const first = parseInt(readFileSync(flagPath, 'utf-8'), 10);
    writeIdleFlag('dev', 'default', tmpRoot);
    const second = parseInt(readFileSync(flagPath, 'utf-8'), 10);
    expect(second).toBeGreaterThanOrEqual(first);
  });

  it('does not throw when state path is blocked by a file (ENOTDIR)', () => {
    const stateParent = join(tmpRoot, '.cortextos', 'default', 'state');
    mkdirSync(stateParent, { recursive: true });
    // Place a file where the dir would be — causes ENOTDIR on mkdir
    writeFileSync(join(stateParent, 'boss'), 'blocker', 'utf-8');
    expect(() => writeIdleFlag('boss', 'default', tmpRoot)).not.toThrow();
  });
});
