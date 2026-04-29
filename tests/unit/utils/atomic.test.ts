import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { atomicWriteSync, ensureDir } from '../../../src/utils/atomic';

let tmpDir: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'ctx-atomic-test-'));
});

afterEach(() => {
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
});

// ---------------------------------------------------------------------------
// atomicWriteSync
// ---------------------------------------------------------------------------

describe('atomicWriteSync', () => {
  it('writes file at the specified path', () => {
    const target = join(tmpDir, 'out.json');
    atomicWriteSync(target, '{"ok":true}');
    expect(existsSync(target)).toBe(true);
  });

  it('written content matches input (plus trailing newline)', () => {
    const target = join(tmpDir, 'out.txt');
    atomicWriteSync(target, 'hello world');
    expect(readFileSync(target, 'utf-8')).toBe('hello world\n');
  });

  it('creates intermediate directories if missing', () => {
    const target = join(tmpDir, 'nested', 'deep', 'file.txt');
    atomicWriteSync(target, 'data');
    expect(existsSync(target)).toBe(true);
  });

  it('overwrites existing file', () => {
    const target = join(tmpDir, 'existing.txt');
    atomicWriteSync(target, 'first');
    atomicWriteSync(target, 'second');
    expect(readFileSync(target, 'utf-8')).toBe('second\n');
  });

  it('sets file mode to 0o600 (owner rw only)', () => {
    if (process.platform === 'win32') return; // skip on Windows
    const target = join(tmpDir, 'secure.txt');
    atomicWriteSync(target, 'secret');
    const mode = statSync(target).mode & 0o777;
    expect(mode).toBe(0o600);
  });

  it('leaves no .tmp.* files in the directory on success', () => {
    const target = join(tmpDir, 'clean.txt');
    atomicWriteSync(target, 'data');
    const { readdirSync } = require('fs');
    const leftover = readdirSync(tmpDir).filter((f: string) => f.startsWith('.tmp.'));
    expect(leftover).toHaveLength(0);
  });

  it('handles empty string content', () => {
    const target = join(tmpDir, 'empty.txt');
    atomicWriteSync(target, '');
    expect(readFileSync(target, 'utf-8')).toBe('\n');
  });

  it('handles JSON content without corruption', () => {
    const data = JSON.stringify({ agent: 'dev', status: 'online', ts: '2026-04-29T12:00:00Z' });
    const target = join(tmpDir, 'hb.json');
    atomicWriteSync(target, data);
    const read = JSON.parse(readFileSync(target, 'utf-8'));
    expect(read.agent).toBe('dev');
    expect(read.status).toBe('online');
  });

  it('concurrent calls to different paths both succeed', () => {
    const t1 = join(tmpDir, 'a.txt');
    const t2 = join(tmpDir, 'b.txt');
    atomicWriteSync(t1, 'alpha');
    atomicWriteSync(t2, 'beta');
    expect(readFileSync(t1, 'utf-8')).toBe('alpha\n');
    expect(readFileSync(t2, 'utf-8')).toBe('beta\n');
  });
});

// ---------------------------------------------------------------------------
// ensureDir
// ---------------------------------------------------------------------------

describe('ensureDir', () => {
  it('creates a directory that does not exist', () => {
    const dir = join(tmpDir, 'new-dir');
    ensureDir(dir);
    expect(existsSync(dir)).toBe(true);
    expect(statSync(dir).isDirectory()).toBe(true);
  });

  it('creates nested directories recursively', () => {
    const dir = join(tmpDir, 'a', 'b', 'c');
    ensureDir(dir);
    expect(existsSync(dir)).toBe(true);
  });

  it('is idempotent — does not throw if dir already exists', () => {
    const dir = join(tmpDir, 'already-exists');
    ensureDir(dir);
    expect(() => ensureDir(dir)).not.toThrow();
  });
});
