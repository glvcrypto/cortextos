import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  browseCatalog,
  installCommunityItem,
  prepareSubmission,
  submitCommunityItem,
} from '../../../src/bus/catalog';

// ─── fixtures ────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<{
  name: string; type: string; tags: string[]; description: string; install_path: string;
}> = {}) {
  return {
    name: overrides.name ?? 'my-skill',
    description: overrides.description ?? 'a test skill',
    author: 'tester',
    type: overrides.type ?? 'skill',
    version: '1.0.0',
    tags: overrides.tags ?? ['seo'],
    review_status: 'community',
    dependencies: [],
    install_path: overrides.install_path ?? `community/skills/${overrides.name ?? 'my-skill'}`,
    submitted_at: '2026-04-01T00:00:00Z',
  };
}

function writeCatalog(frameworkRoot: string, items: object[]) {
  const communityDir = join(frameworkRoot, 'community');
  mkdirSync(communityDir, { recursive: true });
  writeFileSync(join(communityDir, 'catalog.json'), JSON.stringify({ version: '1.0.0', updated_at: '2026-04-01T00:00:00Z', items }));
}

function makeSkillSource(frameworkRoot: string, skillName: string): string {
  const skillDir = join(frameworkRoot, 'community', 'skills', skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), `# ${skillName}`);
  return skillDir;
}

// ─── browseCatalog ───────────────────────────────────────────────────────────

describe('browseCatalog', () => {
  let frameworkRoot: string;
  let ctxRoot: string;

  beforeEach(() => {
    frameworkRoot = mkdtempSync(join(tmpdir(), 'catalog-browse-fw-'));
    ctxRoot = mkdtempSync(join(tmpdir(), 'catalog-browse-ctx-'));
  });

  afterEach(() => {
    rmSync(frameworkRoot, { recursive: true, force: true });
    rmSync(ctxRoot, { recursive: true, force: true });
  });

  it('returns error when catalog.json is missing', () => {
    const r = browseCatalog(frameworkRoot, ctxRoot);
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/catalog\.json not found/);
    expect(r.count).toBe(0);
    expect(r.items).toHaveLength(0);
  });

  it('returns error when catalog.json is invalid JSON', () => {
    mkdirSync(join(frameworkRoot, 'community'), { recursive: true });
    writeFileSync(join(frameworkRoot, 'community', 'catalog.json'), '{{{not json');
    const r = browseCatalog(frameworkRoot, ctxRoot);
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/parse/i);
  });

  it('returns empty when catalog has no items', () => {
    writeCatalog(frameworkRoot, []);
    const r = browseCatalog(frameworkRoot, ctxRoot);
    expect(r.status).toBe('empty');
    expect(r.count).toBe(0);
    expect(r.items).toHaveLength(0);
  });

  it('returns all items when no filters applied', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'alpha' }), makeItem({ name: 'beta', type: 'agent' })]);
    const r = browseCatalog(frameworkRoot, ctxRoot);
    expect(r.status).toBe('ok');
    expect(r.count).toBe(2);
    expect(r.items.map(i => i.name)).toEqual(['alpha', 'beta']);
  });

  it('filters by type — matching items returned', () => {
    writeCatalog(frameworkRoot, [
      makeItem({ name: 'alpha', type: 'skill' }),
      makeItem({ name: 'beta', type: 'agent' }),
      makeItem({ name: 'gamma', type: 'skill' }),
    ]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { type: 'skill' });
    expect(r.status).toBe('ok');
    expect(r.count).toBe(2);
    expect(r.items.every(i => i.type === 'skill')).toBe(true);
  });

  it('filters by type — no matches returns count 0', () => {
    writeCatalog(frameworkRoot, [makeItem({ type: 'skill' })]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { type: 'org' });
    expect(r.status).toBe('ok');
    expect(r.count).toBe(0);
    expect(r.items).toHaveLength(0);
  });

  it('filters by tag — matching items returned', () => {
    writeCatalog(frameworkRoot, [
      makeItem({ name: 'alpha', tags: ['seo', 'content'] }),
      makeItem({ name: 'beta', tags: ['analytics'] }),
    ]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { tag: 'seo' });
    expect(r.status).toBe('ok');
    expect(r.count).toBe(1);
    expect(r.items[0].name).toBe('alpha');
  });

  it('filters by tag — no matches returns count 0', () => {
    writeCatalog(frameworkRoot, [makeItem({ tags: ['analytics'] })]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { tag: 'seo' });
    expect(r.status).toBe('ok');
    expect(r.count).toBe(0);
  });

  it('filters by search — name match (case-insensitive)', () => {
    writeCatalog(frameworkRoot, [
      makeItem({ name: 'seo-audit', description: 'Audits pages' }),
      makeItem({ name: 'content-plan', description: 'Plans content' }),
    ]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { search: 'SEO' });
    expect(r.count).toBe(1);
    expect(r.items[0].name).toBe('seo-audit');
  });

  it('filters by search — description match', () => {
    writeCatalog(frameworkRoot, [
      makeItem({ name: 'alpha', description: 'Plans content strategy' }),
      makeItem({ name: 'beta', description: 'Sends email campaigns' }),
    ]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { search: 'content strategy' });
    expect(r.count).toBe(1);
    expect(r.items[0].name).toBe('alpha');
  });

  it('filters by search — no matches returns count 0', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'alpha', description: 'something' })]);
    const r = browseCatalog(frameworkRoot, ctxRoot, { search: 'zzznomatch' });
    expect(r.count).toBe(0);
  });

  it('enriches items with installed: true when already installed', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'my-skill' })]);
    // Write installed record
    const installed = { 'my-skill': { version: '1.0.0', type: 'skill', installed_at: '2026-04-01T00:00:00Z', path: '/some/path' } };
    writeFileSync(join(ctxRoot, '.installed-community.json'), JSON.stringify(installed));

    const r = browseCatalog(frameworkRoot, ctxRoot);
    expect(r.status).toBe('ok');
    expect(r.items[0].installed).toBe(true);
  });

  it('enriches items with installed: false when not installed', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'my-skill' })]);
    const r = browseCatalog(frameworkRoot, ctxRoot);
    expect(r.items[0].installed).toBe(false);
  });
});

// ─── installCommunityItem — gap coverage ─────────────────────────────────────

describe('installCommunityItem — gap coverage', () => {
  let frameworkRoot: string;
  let ctxRoot: string;

  beforeEach(() => {
    frameworkRoot = mkdtempSync(join(tmpdir(), 'catalog-install-fw-'));
    ctxRoot = mkdtempSync(join(tmpdir(), 'catalog-install-ctx-'));
  });

  afterEach(() => {
    rmSync(frameworkRoot, { recursive: true, force: true });
    rmSync(ctxRoot, { recursive: true, force: true });
  });

  it('returns error when item name is empty', () => {
    const r = installCommunityItem(frameworkRoot, ctxRoot, '');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/required/i);
  });

  it('returns error for invalid item name (spaces)', () => {
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my skill');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/invalid item name/i);
  });

  it('returns error for invalid item name (dots)', () => {
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my.skill');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/invalid item name/i);
  });

  it('returns error when catalog.json is missing', () => {
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/catalog\.json not found/i);
  });

  it('returns error when catalog.json is invalid JSON', () => {
    mkdirSync(join(frameworkRoot, 'community'), { recursive: true });
    writeFileSync(join(frameworkRoot, 'community', 'catalog.json'), 'bad json');
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/parse/i);
  });

  it('returns error when item is not found in catalog', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'other-skill' })]);
    makeSkillSource(frameworkRoot, 'other-skill');
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/not found in catalog/i);
  });

  it('returns error for unknown item type', () => {
    const item = makeItem({ name: 'my-skill', install_path: 'community/skills/my-skill' });
    (item as any).type = 'plugin';
    writeCatalog(frameworkRoot, [item]);
    makeSkillSource(frameworkRoot, 'my-skill');
    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/unknown item type/i);
  });

  it('dryRun returns file list without copying to target', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'my-skill' })]);
    makeSkillSource(frameworkRoot, 'my-skill');

    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill', { dryRun: true });
    expect(r.status).toBe('dry_run');
    expect(r.file_count).toBe(1);
    expect(r.files).toContain('SKILL.md');
    // No target directory should be created
    expect(existsSync(join(frameworkRoot, '.claude', 'skills', 'my-skill'))).toBe(false);
  });

  it('returns already_exists when target directory exists', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'my-skill' })]);
    makeSkillSource(frameworkRoot, 'my-skill');

    // Pre-create the target
    const targetDir = join(frameworkRoot, '.claude', 'skills', 'my-skill');
    mkdirSync(targetDir, { recursive: true });

    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill');
    expect(r.status).toBe('already_exists');
    expect(r.path).toBe(targetDir);
  });

  it('agent type installs to templates/personas/<name>', () => {
    const item = makeItem({ name: 'my-agent', type: 'agent', install_path: 'community/agents/my-agent' });
    writeCatalog(frameworkRoot, [item]);
    const agentDir = join(frameworkRoot, 'community', 'agents', 'my-agent');
    mkdirSync(agentDir, { recursive: true });
    writeFileSync(join(agentDir, 'AGENT.md'), '# agent');

    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-agent', { dryRun: true });
    expect(r.status).toBe('dry_run');
    expect(r.target).toBe(join(frameworkRoot, 'templates', 'personas', 'my-agent'));
  });

  it('org type installs to templates/orgs/<name>', () => {
    const item = makeItem({ name: 'my-org', type: 'org', install_path: 'community/orgs/my-org' });
    writeCatalog(frameworkRoot, [item]);
    const orgDir = join(frameworkRoot, 'community', 'orgs', 'my-org');
    mkdirSync(orgDir, { recursive: true });
    writeFileSync(join(orgDir, 'README.md'), '# org');

    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-org', { dryRun: true });
    expect(r.status).toBe('dry_run');
    expect(r.target).toBe(join(frameworkRoot, 'templates', 'orgs', 'my-org'));
  });

  it('records installation in .installed-community.json', () => {
    writeCatalog(frameworkRoot, [makeItem({ name: 'my-skill' })]);
    makeSkillSource(frameworkRoot, 'my-skill');

    const r = installCommunityItem(frameworkRoot, ctxRoot, 'my-skill');
    expect(r.status).toBe('installed');

    const installed = JSON.parse(readFileSync(join(ctxRoot, '.installed-community.json'), 'utf-8'));
    expect(installed['my-skill']).toBeDefined();
    expect(installed['my-skill'].version).toBe('1.0.0');
    expect(installed['my-skill'].type).toBe('skill');
  });
});

// ─── prepareSubmission ───────────────────────────────────────────────────────

describe('prepareSubmission', () => {
  let ctxRoot: string;
  let sourceDir: string;

  beforeEach(() => {
    ctxRoot = mkdtempSync(join(tmpdir(), 'catalog-prep-ctx-'));
    sourceDir = mkdtempSync(join(tmpdir(), 'catalog-prep-src-'));
  });

  afterEach(() => {
    rmSync(ctxRoot, { recursive: true, force: true });
    rmSync(sourceDir, { recursive: true, force: true });
  });

  it('returns error when args are missing', () => {
    const r = prepareSubmission(ctxRoot, '', '', '');
    expect(r.status).toBe('error');
  });

  it('returns error for invalid item name', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# skill');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my skill');
    expect(r.status).toBe('error');
    expect(r.pii_detected.join(' ')).toMatch(/invalid item name/i);
  });

  it('returns error when source path does not exist', () => {
    const r = prepareSubmission(ctxRoot, 'skill', '/nonexistent/path', 'my-skill');
    expect(r.status).toBe('error');
    expect(r.pii_detected.join(' ')).toMatch(/source path not found/i);
  });

  it('returns clean when source has no PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# My Skill\n\nDoes useful things.\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('clean');
    expect(r.pii_detected).toHaveLength(0);
    expect(r.file_count).toBe(1);
    expect(r.files).toContain('SKILL.md');
  });

  it('detects email address as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nContact: admin@example.com\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('email_address'))).toBe(true);
  });

  it('detects phone number as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nCall: +1-555-867-5309\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('phone_number'))).toBe(true);
  });

  it('detects credential pattern (sk-) as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\napi_key=sk-abc123\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('credential_pattern'))).toBe(true);
  });

  it('detects credential pattern (ghp_) as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\ntoken=ghp_abc123\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('credential_pattern'))).toBe(true);
  });

  it('detects telegram chat_id as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nchat_id: 123456789\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('telegram_chat_id'))).toBe(true);
  });

  it('detects deployment URL (railway.app) as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nSee https://myapp.railway.app\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('deployment_url'))).toBe(true);
  });

  it('detects deployment URL (vercel.app) as PII', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nSee https://myapp.vercel.app\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('deployment_url'))).toBe(true);
  });

  it('detects user names when provided', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nBuilt by John Smith for internal use\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill', { userNames: ['john smith'] });
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('user_name:john smith'))).toBe(true);
  });

  it('detects company name when provided in orgContext', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n\nBuilt for AcmeCorp internal workflow\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill', { orgContext: { name: 'AcmeCorp' } });
    expect(r.status).toBe('pii_detected');
    expect(r.pii_detected.some(p => p.includes('company_name:AcmeCorp'))).toBe(true);
  });

  it('dryRun scans for PII but removes staging dir afterward', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Clean skill\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill', { dryRun: true });
    expect(r.status).toBe('clean');
    // staging dir removed after dryRun
    expect(existsSync(r.staging_dir)).toBe(false);
  });

  it('staging_dir path is under ctxRoot/community-staging/<name>', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.staging_dir).toBe(join(ctxRoot, 'community-staging', 'my-skill'));
  });

  it('reports correct file_count for multi-file source', () => {
    writeFileSync(join(sourceDir, 'SKILL.md'), '# Skill\n');
    writeFileSync(join(sourceDir, 'README.md'), '# Readme\n');
    const r = prepareSubmission(ctxRoot, 'skill', sourceDir, 'my-skill');
    expect(r.file_count).toBe(2);
    expect(r.files).toContain('SKILL.md');
    expect(r.files).toContain('README.md');
  });
});

// ─── submitCommunityItem — validation + dryRun ───────────────────────────────

describe('submitCommunityItem — validation + dryRun', () => {
  let frameworkRoot: string;
  let ctxRoot: string;

  beforeEach(() => {
    frameworkRoot = mkdtempSync(join(tmpdir(), 'catalog-submit-fw-'));
    ctxRoot = mkdtempSync(join(tmpdir(), 'catalog-submit-ctx-'));
  });

  afterEach(() => {
    rmSync(frameworkRoot, { recursive: true, force: true });
    rmSync(ctxRoot, { recursive: true, force: true });
  });

  function makeStaging(ctxRoot: string, name: string): void {
    const stagingDir = join(ctxRoot, 'community-staging', name);
    mkdirSync(stagingDir, { recursive: true });
    writeFileSync(join(stagingDir, 'SKILL.md'), `# ${name}`);
  }

  it('returns error when item name is empty', () => {
    const r = submitCommunityItem(frameworkRoot, ctxRoot, '', 'skill', 'desc');
    expect(r.status).toBe('error');
  });

  it('returns error when item type is empty', () => {
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', '', 'desc');
    expect(r.status).toBe('error');
  });

  it('returns error when description is empty', () => {
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'skill', '');
    expect(r.status).toBe('error');
  });

  it('returns error for invalid item name', () => {
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my skill', 'skill', 'desc');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/invalid item name/i);
  });

  it('returns error for invalid type', () => {
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'plugin', 'desc');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/invalid type/i);
  });

  it('returns error when staging dir does not exist', () => {
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'skill', 'desc');
    expect(r.status).toBe('error');
    expect(r.error).toMatch(/staged submission not found/i);
  });

  it('dryRun returns dry_run status with branch and file_count', () => {
    makeStaging(ctxRoot, 'my-skill');
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'skill', 'A test skill', { dryRun: true });
    expect(r.status).toBe('dry_run');
    expect(r.name).toBe('my-skill');
    expect(r.branch).toBe('community/my-skill');
    expect(r.file_count).toBe(1);
    expect(r.target).toBe('community/skills/my-skill');
  });

  it('dryRun for agent type targets agents/<name>', () => {
    makeStaging(ctxRoot, 'my-agent');
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-agent', 'agent', 'An agent', { dryRun: true });
    expect(r.target).toBe('community/agents/my-agent');
  });

  it('dryRun for org type targets orgs/<name>', () => {
    makeStaging(ctxRoot, 'my-org');
    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-org', 'org', 'An org', { dryRun: true });
    expect(r.target).toBe('community/orgs/my-org');
  });

  it('successful submit copies files to community dir and updates catalog.json', () => {
    makeStaging(ctxRoot, 'my-skill');
    mkdirSync(join(frameworkRoot, 'community'), { recursive: true });

    const r = submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'skill', 'A useful skill');
    expect(r.status).toBe('submitted');
    expect(r.file_count).toBe(1);

    // File should exist in community/skills/my-skill/
    expect(existsSync(join(frameworkRoot, 'community', 'skills', 'my-skill', 'SKILL.md'))).toBe(true);

    // catalog.json should have the new entry
    const catalog = JSON.parse(readFileSync(join(frameworkRoot, 'community', 'catalog.json'), 'utf-8'));
    const entry = catalog.items.find((i: { name: string }) => i.name === 'my-skill');
    expect(entry).toBeDefined();
    expect(entry.type).toBe('skill');
    expect(entry.description).toBe('A useful skill');
    expect(entry.install_path).toBe('skills/my-skill');
  });

  it('successful submit cleans up staging dir', () => {
    makeStaging(ctxRoot, 'my-skill');
    mkdirSync(join(frameworkRoot, 'community'), { recursive: true });

    submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'skill', 'A useful skill');

    expect(existsSync(join(ctxRoot, 'community-staging', 'my-skill'))).toBe(false);
  });

  it('creates catalog.json when it does not exist yet', () => {
    makeStaging(ctxRoot, 'my-skill');
    mkdirSync(join(frameworkRoot, 'community'), { recursive: true });
    // catalog.json intentionally absent

    submitCommunityItem(frameworkRoot, ctxRoot, 'my-skill', 'skill', 'New skill');

    const catalog = JSON.parse(readFileSync(join(frameworkRoot, 'community', 'catalog.json'), 'utf-8'));
    expect(catalog.items).toHaveLength(1);
    expect(catalog.items[0].name).toBe('my-skill');
  });
});
