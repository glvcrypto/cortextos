import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { atomicWriteSync, ensureDir } from '../../../src/utils/atomic';

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'cortextos-atomic-test-'));
});

afterEach(() => {
  try {
    rmSync(tmpDir, { recursive: true, force: true });
  } catch { /* ignore */ }
});

describe('atomicWriteSync', () => {
  it('writes content to file', () => {
    const dest = join(tmpDir, 'out.json');
    atomicWriteSync(dest, '{"x":1}');
    expect(readFileSync(dest, 'utf-8')).toBe('{"x":1}\n');
  });

  it('always appends a trailing newline', () => {
    const dest = join(tmpDir, 'out.txt');
    atomicWriteSync(dest, 'hello');
    expect(readFileSync(dest, 'utf-8')).toBe('hello\n');
  });

  it('creates parent directories recursively', () => {
    const dest = join(tmpDir, 'a', 'b', 'c', 'out.txt');
    atomicWriteSync(dest, 'data');
    expect(existsSync(dest)).toBe(true);
  });

  it('sets file mode 0o600 (owner read/write only)', () => {
    const dest = join(tmpDir, 'private.json');
    atomicWriteSync(dest, '{}');
    const mode = statSync(dest).mode & 0o777;
    expect(mode).toBe(0o600);
  });

  it('overwrites an existing file', () => {
    const dest = join(tmpDir, 'overwrite.txt');
    atomicWriteSync(dest, 'first');
    atomicWriteSync(dest, 'second');
    expect(readFileSync(dest, 'utf-8')).toBe('second\n');
  });

  it('leaves no temp artifacts after successful write', () => {
    const dest = join(tmpDir, 'clean.txt');
    atomicWriteSync(dest, 'content');
    const entries = readdirSync(tmpDir);
    const tmps = entries.filter(e => e.startsWith('.tmp.'));
    expect(tmps).toHaveLength(0);
  });

  it('preserves multi-line content', () => {
    const dest = join(tmpDir, 'multi.txt');
    atomicWriteSync(dest, 'line1\nline2\nline3');
    expect(readFileSync(dest, 'utf-8')).toBe('line1\nline2\nline3\n');
  });

  it('handles empty string content', () => {
    const dest = join(tmpDir, 'empty.txt');
    atomicWriteSync(dest, '');
    expect(readFileSync(dest, 'utf-8')).toBe('\n');
  });
});

describe('ensureDir', () => {
  it('creates a directory', () => {
    const dir = join(tmpDir, 'newdir');
    ensureDir(dir);
    expect(existsSync(dir)).toBe(true);
    expect(statSync(dir).isDirectory()).toBe(true);
  });

  it('creates nested directories recursively', () => {
    const dir = join(tmpDir, 'a', 'b', 'c');
    ensureDir(dir);
    expect(existsSync(dir)).toBe(true);
  });

  it('does not throw if directory already exists', () => {
    const dir = join(tmpDir, 'existing');
    ensureDir(dir);
    expect(() => ensureDir(dir)).not.toThrow();
  });
});
