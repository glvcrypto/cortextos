import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-test-'));
process.env.CTX_ROOT = tmpDir;

let db: typeof import('@/lib/db')['db'];
let getContentItems: typeof import('../content')['getContentItems'];
let getContentItemById: typeof import('../content')['getContentItemById'];
let createContentItem: typeof import('../content')['createContentItem'];
let updateContentItem: typeof import('../content')['updateContentItem'];
let deleteContentItem: typeof import('../content')['deleteContentItem'];

beforeAll(async () => {
  const dbMod = await import('@/lib/db');
  db = dbMod.db;
  const mod = await import('../content');
  getContentItems = mod.getContentItems;
  getContentItemById = mod.getContentItemById;
  createContentItem = mod.createContentItem;
  updateContentItem = mod.updateContentItem;
  deleteContentItem = mod.deleteContentItem;
});

afterEach(() => {
  db.prepare('DELETE FROM content_items').run();
});

const BASE = {
  org: 'glv',
  title: 'How to pick a boat motor',
  status: 'draft' as const,
  content_type: 'blog' as const,
};

// ---------------------------------------------------------------------------
// createContentItem
// ---------------------------------------------------------------------------

describe('createContentItem', () => {
  it('creates an item and returns it with a generated id', () => {
    const item = createContentItem(BASE);
    expect(item.id).toMatch(/^content_/);
    expect(item.title).toBe(BASE.title);
  });

  it('defaults content_type to "blog"', () => {
    const { content_type: _, ...noType } = BASE;
    const item = createContentItem(noType as typeof BASE);
    expect(item.content_type).toBe('blog');
  });

  it('defaults status to "draft"', () => {
    const { status: _, ...noStatus } = BASE;
    const item = createContentItem(noStatus as typeof BASE);
    expect(item.status).toBe('draft');
  });

  it('stores optional client_slug and platform', () => {
    const item = createContentItem({ ...BASE, client_slug: 'reyco', platform: 'wordpress' });
    expect(item.client_slug).toBe('reyco');
    expect(item.platform).toBe('wordpress');
  });

  it('persists to db', () => {
    const item = createContentItem(BASE);
    expect(getContentItemById(item.id)).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getContentItems
// ---------------------------------------------------------------------------

describe('getContentItems', () => {
  it('returns empty when table is empty', () => {
    expect(getContentItems()).toEqual([]);
  });

  it('returns all items with no filter', () => {
    createContentItem(BASE);
    createContentItem({ ...BASE, title: 'Another' });
    expect(getContentItems()).toHaveLength(2);
  });

  it('filters by org', () => {
    createContentItem({ ...BASE, org: 'glv' });
    createContentItem({ ...BASE, org: 'other', title: 'B' });
    expect(getContentItems('glv')).toHaveLength(1);
  });

  it('filters by status', () => {
    createContentItem({ ...BASE, status: 'published' });
    createContentItem({ ...BASE, status: 'draft', title: 'B' });
    expect(getContentItems(undefined, 'published')).toHaveLength(1);
  });

  it('stacks org + status filter', () => {
    createContentItem({ ...BASE, org: 'glv', status: 'scheduled' });
    createContentItem({ ...BASE, org: 'glv', status: 'draft', title: 'X' });
    createContentItem({ ...BASE, org: 'other', status: 'scheduled', title: 'Y' });
    expect(getContentItems('glv', 'scheduled')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getContentItemById
// ---------------------------------------------------------------------------

describe('getContentItemById', () => {
  it('returns null for non-existent ID', () => {
    expect(getContentItemById('no-such')).toBeNull();
  });

  it('returns the item when found', () => {
    const item = createContentItem(BASE);
    expect(getContentItemById(item.id)?.title).toBe(BASE.title);
  });
});

// ---------------------------------------------------------------------------
// updateContentItem
// ---------------------------------------------------------------------------

describe('updateContentItem', () => {
  it('returns null for non-existent ID', () => {
    expect(updateContentItem('no-such', { status: 'published' })).toBeNull();
  });

  it('updates a field', () => {
    const item = createContentItem(BASE);
    const updated = updateContentItem(item.id, { status: 'published' });
    expect(updated?.status).toBe('published');
  });

  it('returns existing when patch is empty', () => {
    const item = createContentItem(BASE);
    expect(updateContentItem(item.id, {})?.id).toBe(item.id);
  });

  it('sets updated_at', () => {
    const item = createContentItem(BASE);
    const updated = updateContentItem(item.id, { notes: 'updated' });
    expect(updated?.updated_at).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// deleteContentItem
// ---------------------------------------------------------------------------

describe('deleteContentItem', () => {
  it('returns false for non-existent ID', () => {
    expect(deleteContentItem('no-such')).toBe(false);
  });

  it('deletes and returns true', () => {
    const item = createContentItem(BASE);
    expect(deleteContentItem(item.id)).toBe(true);
    expect(getContentItemById(item.id)).toBeNull();
  });

  it('only deletes the targeted item', () => {
    const a = createContentItem(BASE);
    const b = createContentItem({ ...BASE, title: 'B' });
    deleteContentItem(a.id);
    expect(getContentItemById(b.id)).not.toBeNull();
  });
});
