/**
 * Tests for GET + POST + DELETE /api/settings/users
 *
 * The route uses @/lib/db (SQLite singleton). We mock it so tests don't
 * need a real database file on disk.
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Mock @/lib/db before importing the route.
// ---------------------------------------------------------------------------

// We build a fresh mock db per-test to avoid state leakage.
type MockStmt = { all: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn>; run: ReturnType<typeof vi.fn> };
let mockDb: { prepare: ReturnType<typeof vi.fn> };

vi.mock('@/lib/db', () => ({
  get db() { return mockDb; },
}));

// Also mock bcryptjs so tests don't spend real time hashing.
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2b$12$hashedpassword'),
  },
}));

type UsersRoute = typeof import('../route');
let route: UsersRoute;

beforeAll(async () => {
  route = await import('../route');
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeGet(): NextRequest {
  return new NextRequest(new URL('http://localhost/api/settings/users'));
}

function makePost(body: Record<string, unknown>): NextRequest {
  return new NextRequest(new URL('http://localhost/api/settings/users'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function makeDelete(body: Record<string, unknown>): NextRequest {
  return new NextRequest(new URL('http://localhost/api/settings/users'), {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function makeStmt(overrides: Partial<MockStmt> = {}): MockStmt {
  return {
    all: vi.fn().mockReturnValue([]),
    get: vi.fn().mockReturnValue(null),
    run: vi.fn().mockReturnValue({ changes: 1 }),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// GET /api/settings/users
// ---------------------------------------------------------------------------
describe('GET /api/settings/users', () => {
  it('returns the list of users from the database', async () => {
    const rows = [
      { id: 1, username: 'aiden', created_at: '2026-01-01T00:00:00Z' },
      { id: 2, username: 'dev', created_at: '2026-02-01T00:00:00Z' },
    ];
    mockDb = { prepare: vi.fn().mockReturnValue(makeStmt({ all: vi.fn().mockReturnValue(rows) })) };

    const res = await route.GET(makeGet());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.users).toHaveLength(2);
    expect(body.users[0].username).toBe('aiden');
    expect(body.users[1].username).toBe('dev');
  });

  it('returns 500 when the database throws', async () => {
    mockDb = { prepare: vi.fn().mockImplementation(() => { throw new Error('db locked'); }) };

    const res = await route.GET(makeGet());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/Failed to fetch users/);
  });
});

// ---------------------------------------------------------------------------
// POST /api/settings/users
// ---------------------------------------------------------------------------
describe('POST /api/settings/users', () => {
  it('returns 400 when username is too short', async () => {
    mockDb = { prepare: vi.fn() };
    const res = await route.POST(makePost({ username: 'ab', password: 'validpassword123' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/at least 3 characters/);
  });

  it('returns 400 when password is too short', async () => {
    mockDb = { prepare: vi.fn() };
    const res = await route.POST(makePost({ username: 'newuser', password: 'short' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/at least 12 characters/);
  });

  it('returns 409 when username already exists', async () => {
    const existingStmt = makeStmt({ get: vi.fn().mockReturnValue({ id: 1 }) });
    mockDb = { prepare: vi.fn().mockReturnValue(existingStmt) };

    const res = await route.POST(makePost({ username: 'aiden', password: 'validpassword123' }));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/already exists/);
  });

  it('returns 200 and creates the user when credentials are valid', async () => {
    const checkStmt = makeStmt({ get: vi.fn().mockReturnValue(null) });
    const insertStmt = makeStmt();
    mockDb = {
      prepare: vi.fn()
        .mockReturnValueOnce(checkStmt)   // SELECT id check
        .mockReturnValueOnce(insertStmt), // INSERT
    };

    const res = await route.POST(makePost({ username: 'newuser', password: 'validpassword123' }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(insertStmt.run).toHaveBeenCalledWith('newuser', '$2b$12$hashedpassword');
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/settings/users
// ---------------------------------------------------------------------------
describe('DELETE /api/settings/users', () => {
  it('returns 400 when deleting the last user', async () => {
    const countStmt = makeStmt({ get: vi.fn().mockReturnValue({ count: 1 }) });
    mockDb = { prepare: vi.fn().mockReturnValue(countStmt) };

    const res = await route.DELETE(makeDelete({ id: 1 }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/last user/);
  });

  it('returns 404 when the user id does not exist', async () => {
    const countStmt = makeStmt({ get: vi.fn().mockReturnValue({ count: 2 }) });
    const deleteStmt = makeStmt({ run: vi.fn().mockReturnValue({ changes: 0 }) });
    mockDb = {
      prepare: vi.fn()
        .mockReturnValueOnce(countStmt)
        .mockReturnValueOnce(deleteStmt),
    };

    const res = await route.DELETE(makeDelete({ id: 999 }));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toMatch(/not found/i);
  });

  it('returns 200 and removes the user on success', async () => {
    const countStmt = makeStmt({ get: vi.fn().mockReturnValue({ count: 3 }) });
    const deleteStmt = makeStmt({ run: vi.fn().mockReturnValue({ changes: 1 }) });
    mockDb = {
      prepare: vi.fn()
        .mockReturnValueOnce(countStmt)
        .mockReturnValueOnce(deleteStmt),
    };

    const res = await route.DELETE(makeDelete({ id: 2 }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});
