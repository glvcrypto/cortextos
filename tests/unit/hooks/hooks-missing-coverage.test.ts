/**
 * Coverage for three exported helpers in src/hooks/index.ts that had
 * zero test coverage in hooks.test.ts:
 *
 *   generateId         — crypto random hex ID
 *   waitForResponseFile — fs.watch + poll + timeout gate
 *   cleanupResponseFile — idempotent file removal
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  generateId,
  waitForResponseFile,
  cleanupResponseFile,
} from '../../../src/hooks/index';

describe('generateId', () => {
  it('returns a 32-character lowercase hex string', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it('returns a different value on each call', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()));
    expect(ids.size).toBe(10);
  });
});

describe('waitForResponseFile', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'ctx-hooks-wait-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('resolves immediately when file already exists', async () => {
    const filePath = join(tmpDir, 'response.json');
    writeFileSync(filePath, '{"answer":"yes"}');

    const result = await waitForResponseFile(filePath, 2000);
    expect(result).toBe('{"answer":"yes"}');
  });

  it('resolves with content when file is written after a short delay', async () => {
    const filePath = join(tmpDir, 'late.json');

    // Write the file 80ms after the watcher is armed
    const timer = setTimeout(() => writeFileSync(filePath, 'late-content'), 80);

    const result = await waitForResponseFile(filePath, 2000);
    clearTimeout(timer);

    expect(result).toBe('late-content');
  }, 3000);

  it('returns null when file never appears (timeout)', async () => {
    const filePath = join(tmpDir, 'never.json');
    const result = await waitForResponseFile(filePath, 150);
    expect(result).toBeNull();
  }, 1000);
});

describe('cleanupResponseFile', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'ctx-hooks-cleanup-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('deletes the file when it exists', () => {
    const filePath = join(tmpDir, 'response.json');
    writeFileSync(filePath, 'data');

    cleanupResponseFile(filePath);
    expect(existsSync(filePath)).toBe(false);
  });

  it('does not throw when file does not exist', () => {
    const filePath = join(tmpDir, 'nonexistent.json');
    expect(() => cleanupResponseFile(filePath)).not.toThrow();
  });

  it('is idempotent — calling twice does not throw', () => {
    const filePath = join(tmpDir, 'response.json');
    writeFileSync(filePath, 'data');

    cleanupResponseFile(filePath);
    expect(() => cleanupResponseFile(filePath)).not.toThrow();
  });
});
