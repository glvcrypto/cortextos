import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Mock next-auth and its providers — they require a Next.js runtime not available in vitest.
// We only test seedAdminUser() which has no dependency on NextAuth internals.
vi.mock('next-auth', () => ({
  default: () => ({ handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() }),
}));
vi.mock('next-auth/providers/credentials', () => ({ default: (cfg: unknown) => cfg }));

// Set CTX_ROOT + env before db.ts evaluates.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auth-test-'));
process.env.CTX_ROOT = tmpDir;

let seedAdminUser: typeof import('../auth')['seedAdminUser'];
let db: typeof import('../db')['db'];

beforeAll(async () => {
  const dbMod = await import('../db');
  db = dbMod.db;

  const authMod = await import('../auth');
  seedAdminUser = authMod.seedAdminUser;
});

afterEach(() => {
  // Reset to clean state between tests
  db.prepare('DELETE FROM users').run();
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_USERNAME;
  delete process.env.SYNC_ADMIN_PASSWORD;
  // Ensure NODE_ENV is not 'production' unless a test sets it
  process.env.NODE_ENV = 'test';
});

// ---------------------------------------------------------------------------
// Error guards (no db write needed)
// ---------------------------------------------------------------------------

describe('seedAdminUser — guard conditions', () => {
  it('throws when ADMIN_PASSWORD is not set and table is empty', async () => {
    delete process.env.ADMIN_PASSWORD;
    await expect(seedAdminUser()).rejects.toThrow(/ADMIN_PASSWORD/);
  });

  it('throws when ADMIN_PASSWORD is a known default in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ADMIN_PASSWORD = 'password';
    await expect(seedAdminUser()).rejects.toThrow(/known default/i);
    process.env.NODE_ENV = 'test';
  });

  it('does not throw for known-default passwords outside production', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ADMIN_PASSWORD = 'cortextos';
    // Will seed since table is empty — just checking no throw on default-check
    await expect(seedAdminUser()).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// First-time seeding
// ---------------------------------------------------------------------------

describe('seedAdminUser — first-time seeding', () => {
  it('creates admin user when users table is empty', async () => {
    process.env.ADMIN_PASSWORD = 'test-password-abc';
    await seedAdminUser();
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    expect(row.count).toBe(1);
  });

  it('uses ADMIN_USERNAME env var for the username', async () => {
    process.env.ADMIN_USERNAME = 'superadmin';
    process.env.ADMIN_PASSWORD = 'test-password-xyz';
    await seedAdminUser();
    const user = db.prepare("SELECT username FROM users WHERE username = 'superadmin'").get();
    expect(user).toBeDefined();
  });

  it('falls back to "admin" when ADMIN_USERNAME is not set', async () => {
    delete process.env.ADMIN_USERNAME;
    process.env.ADMIN_PASSWORD = 'test-password-fallback';
    await seedAdminUser();
    const user = db.prepare("SELECT username FROM users WHERE username = 'admin'").get();
    expect(user).toBeDefined();
  });

  it('stores a bcrypt hash — not the plain password', async () => {
    process.env.ADMIN_PASSWORD = 'my-plain-password';
    await seedAdminUser();
    const user = db
      .prepare("SELECT password_hash FROM users WHERE username = 'admin'")
      .get() as { password_hash: string } | undefined;
    expect(user?.password_hash).not.toBe('my-plain-password');
    expect(user?.password_hash).toMatch(/^\$2[ab]\$/); // bcrypt prefix
  });
});

// ---------------------------------------------------------------------------
// Idempotency — returns early when users already exist
// ---------------------------------------------------------------------------

describe('seedAdminUser — idempotency', () => {
  it('returns early without error when users exist and SYNC_ADMIN_PASSWORD is unset', async () => {
    // Seed once
    process.env.ADMIN_PASSWORD = 'initial-password';
    await seedAdminUser();
    const countBefore = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;

    // Remove password env — would throw if it tried to re-seed
    delete process.env.ADMIN_PASSWORD;

    // Should return early without touching db or throwing
    await expect(seedAdminUser()).resolves.toBeUndefined();
    const countAfter = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
    expect(countAfter).toBe(countBefore);
  });
});

// ---------------------------------------------------------------------------
// Password sync (SYNC_ADMIN_PASSWORD=true)
// ---------------------------------------------------------------------------

describe('seedAdminUser — SYNC_ADMIN_PASSWORD=true', () => {
  it('updates the stored hash when password changed and SYNC_ADMIN_PASSWORD=true', async () => {
    // Seed initial user
    process.env.ADMIN_PASSWORD = 'original-password';
    await seedAdminUser();
    const hashBefore = (
      db.prepare("SELECT password_hash FROM users WHERE username = 'admin'").get() as { password_hash: string }
    ).password_hash;

    // Sync with new password
    process.env.ADMIN_PASSWORD = 'new-password-456';
    process.env.SYNC_ADMIN_PASSWORD = 'true';
    await seedAdminUser();

    const hashAfter = (
      db.prepare("SELECT password_hash FROM users WHERE username = 'admin'").get() as { password_hash: string }
    ).password_hash;

    expect(hashAfter).not.toBe(hashBefore);
  });

  it('does not update the hash when SYNC_ADMIN_PASSWORD=true but password matches current', async () => {
    process.env.ADMIN_PASSWORD = 'stable-password';
    await seedAdminUser();
    const hashBefore = (
      db.prepare("SELECT password_hash FROM users WHERE username = 'admin'").get() as { password_hash: string }
    ).password_hash;

    // Sync with same password
    process.env.SYNC_ADMIN_PASSWORD = 'true';
    await seedAdminUser();

    const hashAfter = (
      db.prepare("SELECT password_hash FROM users WHERE username = 'admin'").get() as { password_hash: string }
    ).password_hash;

    expect(hashAfter).toBe(hashBefore);
  });
});
