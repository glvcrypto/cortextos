import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';
import { acquireLock, releaseLock } from '../../../src/utils/lock';

describe('mkdir-based locking', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'cortextos-lock-test-'));
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it('acquires lock on empty directory', () => {
    expect(acquireLock(testDir)).toBe(true);
    releaseLock(testDir);
  });

  it('prevents double acquire', () => {
    expect(acquireLock(testDir)).toBe(true);
    // Same process, same PID - should fail since lock.d already exists
    // (but our PID check will see it's our own process and succeed)
    // Actually, mkdir will fail because it already exists, then we check PID
    // Since it's our own PID, it sees process alive and returns false
    expect(acquireLock(testDir)).toBe(false);
    releaseLock(testDir);
  });

  it('releases lock correctly', () => {
    expect(acquireLock(testDir)).toBe(true);
    releaseLock(testDir);
    expect(acquireLock(testDir)).toBe(true);
    releaseLock(testDir);
  });

  it('recovers a stale lock left by a dead process', () => {
    // Spawn a short-lived Node process; spawnSync waits until it exits, so
    // its PID is guaranteed dead by the time we read it.
    const { pid: deadPid } = spawnSync(process.execPath, ['-e', ''], { stdio: 'ignore' });
    const lockDir = join(testDir, '.lock.d');
    mkdirSync(lockDir);
    writeFileSync(join(lockDir, 'pid'), String(deadPid ?? 9999999));
    // The stale lock should be removed and a fresh one acquired.
    expect(acquireLock(testDir)).toBe(true);
    releaseLock(testDir);
  });

  it('recovers a lock whose PID file contains garbage (non-numeric)', () => {
    const lockDir = join(testDir, '.lock.d');
    mkdirSync(lockDir);
    writeFileSync(join(lockDir, 'pid'), 'not-a-pid');
    // Corrupt PID → NaN → rmSync + retry should succeed.
    expect(acquireLock(testDir)).toBe(true);
    releaseLock(testDir);
  });

  it('releaseLock is a no-op when no lock is held', () => {
    // Must not throw — callers may call release defensively.
    expect(() => releaseLock(testDir)).not.toThrow();
  });
});
