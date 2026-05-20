import { describe, it, expect } from 'vitest';
import {
  normalizePlatform,
  registryEntryMatches,
  reconcileScheduledPost,
  type ScheduledPostRecord,
} from '../../../src/social/blotato-writeback.js';
import type { PostRegistryEntry } from '../../../src/social/types-live.js';

function entry(over: Partial<PostRegistryEntry>): PostRegistryEntry {
  return {
    post_id: 'p',
    platform: 'instagram',
    intro: 'intro-1',
    post_url: 'https://example.com/p',
    blotato_submission_id: '4193860',
    published_at: '2026-05-18T13:00:00Z',
    platform_post_id: 'DYhWoAfoAeu',
    ...over,
  };
}

function post(over: Partial<ScheduledPostRecord>): ScheduledPostRecord {
  return { id: 'intro-1-instagram', platform: 'Instagram', status: 'draft', ...over };
}

describe('normalizePlatform', () => {
  it('lowercases and aliases x to twitter', () => {
    expect(normalizePlatform('Instagram')).toBe('instagram');
    expect(normalizePlatform('X')).toBe('twitter');
    expect(normalizePlatform(' x ')).toBe('twitter');
    expect(normalizePlatform('twitter')).toBe('twitter');
  });
});

describe('registryEntryMatches', () => {
  it('matches on intro prefix and platform', () => {
    expect(registryEntryMatches(post({}), entry({}))).toBe(true);
  });

  it('matches X posts to twitter registry entries', () => {
    expect(registryEntryMatches(
      post({ id: 'intro-2-x', platform: 'X' }),
      entry({ platform: 'twitter', intro: 'intro-2' }),
    )).toBe(true);
  });

  it('rejects a platform mismatch', () => {
    expect(registryEntryMatches(post({}), entry({ platform: 'facebook' }))).toBe(false);
  });

  it('rejects the "unknown" intro placeholder', () => {
    expect(registryEntryMatches(
      post({ id: 'unknown-instagram' }),
      entry({ intro: 'unknown' }),
    )).toBe(false);
  });

  it('does not let intro-1 falsely prefix-match intro-10', () => {
    expect(registryEntryMatches(
      post({ id: 'intro-10-instagram' }),
      entry({ intro: 'intro-1' }),
    )).toBe(false);
  });
});

describe('reconcileScheduledPost', () => {
  it('marks a matched draft post as posted', () => {
    const result = reconcileScheduledPost(post({}), [entry({})]);
    expect(result.changed).toBe(true);
    expect(result.fields).toEqual({
      status: 'posted',
      published_at: '2026-05-18T13:00:00Z',
      post_url: 'https://example.com/p',
      blotato_submission_id: '4193860',
    });
  });

  it('leaves an unmatched post unchanged', () => {
    expect(reconcileScheduledPost(post({ id: 'reviews-system-instagram' }), [entry({})]).changed)
      .toBe(false);
  });

  it('does not touch posts that are already posted or cancelled', () => {
    expect(reconcileScheduledPost(post({ status: 'posted' }), [entry({})]).changed).toBe(false);
    expect(reconcileScheduledPost(post({ status: 'cancelled' }), [entry({})]).changed).toBe(false);
  });

  it('picks the earliest publish when the dup-posting bug yields several', () => {
    const result = reconcileScheduledPost(post({}), [
      entry({ blotato_submission_id: 'late', published_at: '2026-05-18T14:00:00Z' }),
      entry({ blotato_submission_id: 'early', published_at: '2026-05-18T13:00:00Z' }),
    ]);
    expect(result.fields?.blotato_submission_id).toBe('early');
  });
});
