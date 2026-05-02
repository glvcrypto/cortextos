import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mkdtempSync, rmSync, mkdirSync, writeFileSync, chmodSync, statSync,
} from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fixSpawnHelper } from '../../../src/cli/install.js';

describe('fixSpawnHelper', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'ctx-install-test-'));
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('returns false when node-pty is not installed (no node_modules/node-pty)', () => {
    expect(fixSpawnHelper(tmpRoot)).toBe(false);
  });

  it('returns false when prebuilds dir exists but is empty', () => {
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds'), { recursive: true });
    expect(fixSpawnHelper(tmpRoot)).toBe(false);
  });

  it('returns false when platform dir exists but no spawn-helper file inside', () => {
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64'), { recursive: true });
    expect(fixSpawnHelper(tmpRoot)).toBe(false);
  });

  it('chmods a non-executable spawn-helper in prebuilds and returns true', () => {
    const helperPath = join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64', 'spawn-helper');
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64'), { recursive: true });
    writeFileSync(helperPath, '');
    chmodSync(helperPath, 0o644); // not executable

    const result = fixSpawnHelper(tmpRoot);

    expect(result).toBe(true);
    const mode = statSync(helperPath).mode & 0o777;
    expect(mode & 0o111).not.toBe(0); // at least one execute bit set
  });

  it('returns false when prebuilds spawn-helper is already executable', () => {
    const helperPath = join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64', 'spawn-helper');
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64'), { recursive: true });
    writeFileSync(helperPath, '');
    chmodSync(helperPath, 0o755); // already executable

    expect(fixSpawnHelper(tmpRoot)).toBe(false);
  });

  it('chmods a non-executable spawn-helper in build/Release and returns true', () => {
    const helperPath = join(tmpRoot, 'node_modules', 'node-pty', 'build', 'Release', 'spawn-helper');
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'build', 'Release'), { recursive: true });
    writeFileSync(helperPath, '');
    chmodSync(helperPath, 0o644);

    const result = fixSpawnHelper(tmpRoot);

    expect(result).toBe(true);
    const mode = statSync(helperPath).mode & 0o777;
    expect(mode & 0o111).not.toBe(0);
  });

  it('returns false when build/Release spawn-helper is already executable', () => {
    const helperPath = join(tmpRoot, 'node_modules', 'node-pty', 'build', 'Release', 'spawn-helper');
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'build', 'Release'), { recursive: true });
    writeFileSync(helperPath, '');
    chmodSync(helperPath, 0o755);

    expect(fixSpawnHelper(tmpRoot)).toBe(false);
  });

  it('fixes spawn-helpers in both prebuilds and build/Release when both need it', () => {
    const prebuildHelper = join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64', 'spawn-helper');
    const buildHelper = join(tmpRoot, 'node_modules', 'node-pty', 'build', 'Release', 'spawn-helper');
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds', 'linux-x64'), { recursive: true });
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty', 'build', 'Release'), { recursive: true });
    writeFileSync(prebuildHelper, '');
    writeFileSync(buildHelper, '');
    chmodSync(prebuildHelper, 0o644);
    chmodSync(buildHelper, 0o644);

    const result = fixSpawnHelper(tmpRoot);

    expect(result).toBe(true);
    expect(statSync(prebuildHelper).mode & 0o111).not.toBe(0);
    expect(statSync(buildHelper).mode & 0o111).not.toBe(0);
  });

  it('does not throw when prebuilds path is a file instead of a directory', () => {
    const prebuildsPath = join(tmpRoot, 'node_modules', 'node-pty', 'prebuilds');
    mkdirSync(join(tmpRoot, 'node_modules', 'node-pty'), { recursive: true });
    writeFileSync(prebuildsPath, 'not a directory'); // file, not dir

    // readdirSync on a file throws ENOTDIR; fixSpawnHelper must swallow it
    let result: boolean | undefined;
    expect(() => { result = fixSpawnHelper(tmpRoot); }).not.toThrow();
    expect(result).toBe(false);
  });
});
