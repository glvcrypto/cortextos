import { describe, it, expect } from 'vitest';
import { categorizeFilePath } from '../watcher';

describe('categorizeFilePath', () => {
  it('returns "task" for paths containing /tasks/', () => {
    expect(categorizeFilePath('/home/user/.cortextos/orgs/glv/tasks/t1.json')).toBe('task');
  });

  it('returns "approval" for paths containing /approvals/', () => {
    expect(categorizeFilePath('/home/user/.cortextos/orgs/glv/approvals/a1.json')).toBe('approval');
  });

  it('returns "heartbeat" for paths ending with /heartbeat.json', () => {
    expect(categorizeFilePath('/home/user/.cortextos/state/dev/heartbeat.json')).toBe('heartbeat');
  });

  it('returns "event" for paths containing /analytics/events/', () => {
    expect(categorizeFilePath('/home/user/.cortextos/orgs/glv/analytics/events/2026-05.jsonl')).toBe('event');
  });

  it('returns "sync" for any other path (catch-all)', () => {
    expect(categorizeFilePath('/home/user/.cortextos/inbox/msg.json')).toBe('sync');
    expect(categorizeFilePath('/some/random/file.json')).toBe('sync');
  });

  it('task takes priority over approval when both segments present', () => {
    // tasks/ comes first in the if-chain — wins over approvals/
    expect(categorizeFilePath('/orgs/glv/tasks/approvals/edge.json')).toBe('task');
  });
});
