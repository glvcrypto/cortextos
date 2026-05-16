import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { browseCatalog, installCommunityItem } from '../../../src/bus/catalog';

// --- Shared catalog fixture helpers ---

function makeDirs() {
  const frameworkRoot = mkdtempSync(join(tmpdir(), 'catalog-fw-'));
  const ctxRoot = mkdtempSync(join(tmpdir(), 'catalog-ctx-'));
  return { frameworkRoot, ctxRoot };
}

function writeCatalogItems(frameworkRoot: string, items: object[]) {
  mkdirSync(join(frameworkRoot, 'community'), { recursive: true });
  writeFileSync(
    join(frameworkRoot, 'community', 'catalog.json'),
    JSON.stringify({ version: '1.0.0', updated_at: '2026-04-01T00:00:00Z', items }),
  );
}

function cleanup(...dirs: string[]) {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
}

// --- browseCatalog ---

describe('browseCatalog', () => {
  it('returns error when catalog.json is missing', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      const r = browseCatalog(frameworkRoot, ctxRoot);
      expect(r.status).toBe('error');
      expect(r.error).toMatch(/catalog\.json not found/);
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('returns error when catalog.json is malformed JSON', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      mkdirSync(join(frameworkRoot, 'community'), { recursive: true });
      writeFileSync(join(frameworkRoot, 'community', 'catalog.json'), '{invalid json');
      const r = browseCatalog(frameworkRoot, ctxRoot);
      expect(r.status).toBe('error');
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('returns empty status when catalog has no items', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, []);
      const r = browseCatalog(frameworkRoot, ctxRoot);
      expect(r.status).toBe('empty');
      expect(r.count).toBe(0);
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('returns all items with no filter options', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'tasks', type: 'skill', description: 'task mgmt', tags: [], version: '1.0.0', author: 'glv', review_status: 'approved', dependencies: [], install_path: 'community/skills/tasks', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'my-agent', type: 'agent', description: 'agent template', tags: [], version: '1.0.0', author: 'glv', review_status: 'approved', dependencies: [], install_path: 'community/agents/my-agent', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot);
      expect(r.status).toBe('ok');
      expect(r.count).toBe(2);
      expect(r.items.map(i => i.name)).toEqual(['tasks', 'my-agent']);
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('filters by type', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'tasks', type: 'skill', description: 'skill', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/tasks', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'bot', type: 'agent', description: 'agent', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/agents/bot', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot, { type: 'skill' });
      expect(r.count).toBe(1);
      expect(r.items[0].name).toBe('tasks');
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('filters by tag', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'inbox', type: 'skill', description: 'inbox', tags: ['comms', 'automation'], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/inbox', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'audit', type: 'skill', description: 'audit', tags: ['seo'], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/audit', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot, { tag: 'comms' });
      expect(r.count).toBe(1);
      expect(r.items[0].name).toBe('inbox');
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('filters by search — matches name substring case-insensitively', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'heartbeat-monitor', type: 'skill', description: 'monitors uptime', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/heartbeat-monitor', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'onboarding', type: 'skill', description: 'agent setup wizard', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/onboarding', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot, { search: 'HEART' });
      expect(r.count).toBe(1);
      expect(r.items[0].name).toBe('heartbeat-monitor');
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('filters by search — matches description substring', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'alpha', type: 'skill', description: 'manages outreach campaigns', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/alpha', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'beta', type: 'skill', description: 'schedules reminders', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/beta', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot, { search: 'outreach' });
      expect(r.count).toBe(1);
      expect(r.items[0].name).toBe('alpha');
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('enriches items with installed:true when item is in installed registry', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'tasks', type: 'skill', description: 'tasks', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/tasks', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      // Simulate a previously installed item
      writeFileSync(
        join(ctxRoot, '.installed-community.json'),
        JSON.stringify({ tasks: { version: '1.0.0', type: 'skill', installed_at: '2026-04-01T00:00:00Z', path: '/some/path' } }),
      );
      const r = browseCatalog(frameworkRoot, ctxRoot);
      expect(r.items[0].installed).toBe(true);
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('marks items as installed:false when not in registry', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'tasks', type: 'skill', description: 'tasks', tags: [], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/tasks', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot);
      expect(r.items[0].installed).toBe(false);
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });

  it('type + tag filters compose (AND logic)', () => {
    const { frameworkRoot, ctxRoot } = makeDirs();
    try {
      writeCatalogItems(frameworkRoot, [
        { name: 'skill-tagged', type: 'skill', description: 'x', tags: ['seo'], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/skill-tagged', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'agent-tagged', type: 'agent', description: 'x', tags: ['seo'], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/agents/agent-tagged', submitted_at: '2026-01-01T00:00:00Z' },
        { name: 'skill-untagged', type: 'skill', description: 'x', tags: ['other'], version: '1.0.0', author: 'g', review_status: 'approved', dependencies: [], install_path: 'community/skills/skill-untagged', submitted_at: '2026-01-01T00:00:00Z' },
      ]);
      const r = browseCatalog(frameworkRoot, ctxRoot, { type: 'skill', tag: 'seo' });
      expect(r.count).toBe(1);
      expect(r.items[0].name).toBe('skill-tagged');
    } finally { cleanup(frameworkRoot, ctxRoot); }
  });
});

describe('installCommunityItem — install_path normalization (task_1776232775374_418)', () => {
  let frameworkRoot: string;
  let ctxRoot: string;

  beforeEach(() => {
    frameworkRoot = mkdtempSync(join(tmpdir(), 'catalog-fw-'));
    ctxRoot = mkdtempSync(join(tmpdir(), 'catalog-ctx-'));
    mkdirSync(join(frameworkRoot, 'community', 'skills', 'tasks'), { recursive: true });
    writeFileSync(join(frameworkRoot, 'community', 'skills', 'tasks', 'SKILL.md'), '# tasks');
  });

  afterEach(() => {
    rmSync(frameworkRoot, { recursive: true, force: true });
    rmSync(ctxRoot, { recursive: true, force: true });
  });

  function writeCatalog(installPath: string) {
    const catalog = {
      version: '1.0.0',
      updated_at: '2026-04-15T00:00:00Z',
      items: [{
        name: 'tasks',
        description: 'test',
        author: 'test',
        type: 'skill',
        version: '1.0.0',
        tags: [],
        dependencies: [],
        install_path: installPath,
      }],
    };
    writeFileSync(join(frameworkRoot, 'community', 'catalog.json'), JSON.stringify(catalog));
  }

  it('shipped shape: install_path with leading "community/" prefix resolves correctly', () => {
    writeCatalog('community/skills/tasks');
    const agentDir = mkdtempSync(join(tmpdir(), 'catalog-agent-'));
    try {
      const r = installCommunityItem(frameworkRoot, ctxRoot, 'tasks', { agentDir });
      expect(r.status).toBe('installed');
    } finally {
      rmSync(agentDir, { recursive: true, force: true });
    }
  });

  it('submit shape: install_path as bare "skills/X" also resolves correctly', () => {
    writeCatalog('skills/tasks');
    const agentDir = mkdtempSync(join(tmpdir(), 'catalog-agent-'));
    try {
      const r = installCommunityItem(frameworkRoot, ctxRoot, 'tasks', { agentDir });
      expect(r.status).toBe('installed');
    } finally {
      rmSync(agentDir, { recursive: true, force: true });
    }
  });

  it('skill targets .claude/skills/<name>/ under agentDir — the Claude Code harness path', () => {
    writeCatalog('community/skills/tasks');
    const agentDir = mkdtempSync(join(tmpdir(), 'catalog-agent-'));
    try {
      const r = installCommunityItem(frameworkRoot, ctxRoot, 'tasks', { agentDir });
      expect(r.status).toBe('installed');
      expect((r as { target: string }).target).toBe(join(agentDir, '.claude', 'skills', 'tasks'));
    } finally {
      rmSync(agentDir, { recursive: true, force: true });
    }
  });

  it('path traversal still rejected after normalization', () => {
    writeCatalog('community/../../../etc/passwd');
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'tasks');
    expect(r.status).toBe('error');
    expect(r.error).toContain('path traversal');
  });
});
