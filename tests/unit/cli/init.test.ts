import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import type { OrgContext } from '../../../src/types/index';
import {
  findOrgTemplateDir,
  copyOrgTemplateFiles,
  buildAgentSystemMd,
} from '../../../src/cli/init';

// ── findOrgTemplateDir ──────────────────────────────────────────────────────

describe('findOrgTemplateDir', () => {
  let testRoot: string;

  beforeEach(() => {
    testRoot = mkdtempSync(join(tmpdir(), 'ctx-init-fot-'));
  });

  afterEach(() => {
    rmSync(testRoot, { recursive: true, force: true });
  });

  it('returns first candidate when templates/org exists', () => {
    const first = join(testRoot, 'templates', 'org');
    mkdirSync(first, { recursive: true });
    expect(findOrgTemplateDir(testRoot)).toBe(first);
  });

  it('returns second candidate when only node_modules/cortextos/templates/org exists', () => {
    const second = join(testRoot, 'node_modules', 'cortextos', 'templates', 'org');
    mkdirSync(second, { recursive: true });
    expect(findOrgTemplateDir(testRoot)).toBe(second);
  });

  it('returns first candidate over second when both exist', () => {
    const first = join(testRoot, 'templates', 'org');
    const second = join(testRoot, 'node_modules', 'cortextos', 'templates', 'org');
    mkdirSync(first, { recursive: true });
    mkdirSync(second, { recursive: true });
    expect(findOrgTemplateDir(testRoot)).toBe(first);
  });

  it('falls back to third candidate when first two are absent', () => {
    // Third candidate resolves to the repo's own templates/org — exists in this checkout.
    const result = findOrgTemplateDir(testRoot);
    expect(result).not.toBeNull();
    expect(existsSync(result!)).toBe(true);
  });

  it('returned path always exists on disk', () => {
    const first = join(testRoot, 'templates', 'org');
    mkdirSync(first, { recursive: true });
    const result = findOrgTemplateDir(testRoot);
    expect(result).not.toBeNull();
    expect(existsSync(result!)).toBe(true);
  });
});

// ── buildAgentSystemMd ──────────────────────────────────────────────────────

describe('buildAgentSystemMd', () => {
  it('starts with # System Context', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md.startsWith('# System Context')).toBe(true);
  });

  it('uses ctx.name when present', () => {
    const md = buildAgentSystemMd({ name: 'AcmeCo' }, 'fallback');
    expect(md).toContain('**Organization:** AcmeCo');
  });

  it('falls back to orgName when ctx.name is absent', () => {
    const md = buildAgentSystemMd({}, 'fallback-org');
    expect(md).toContain('**Organization:** fallback-org');
  });

  it('shows description when present', () => {
    const md = buildAgentSystemMd({ description: 'A digital agency' }, 'org');
    expect(md).toContain('**Description:** A digital agency');
  });

  it('shows (not set) for description when absent', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Description:** (not set)');
  });

  it('shows timezone when present', () => {
    const md = buildAgentSystemMd({ timezone: 'America/Toronto' }, 'org');
    expect(md).toContain('**Timezone:** America/Toronto');
  });

  it('defaults timezone to UTC when absent', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Timezone:** UTC');
  });

  it('shows orchestrator when present', () => {
    const md = buildAgentSystemMd({ orchestrator: 'alpha' }, 'org');
    expect(md).toContain('**Orchestrator:** alpha');
  });

  it('shows (not set) for orchestrator when absent', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Orchestrator:** (not set)');
  });

  it('shows dashboard_url when present', () => {
    const md = buildAgentSystemMd({ dashboard_url: 'http://localhost:3000' }, 'org');
    expect(md).toContain('**Dashboard:** http://localhost:3000');
  });

  it('shows (not configured) for dashboard_url when absent', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Dashboard:** (not configured)');
  });

  it('shows communication_style when present', () => {
    const md = buildAgentSystemMd({ communication_style: 'formal' }, 'org');
    expect(md).toContain('**Communication Style:** formal');
  });

  it('defaults communication_style to casual when absent', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Communication Style:** casual');
  });

  it('shows day mode range from ctx', () => {
    const md = buildAgentSystemMd({ day_mode_start: '09:00', day_mode_end: '22:00' }, 'org');
    expect(md).toContain('**Day Mode:** 09:00 - 22:00');
  });

  it('defaults day mode to 08:00 - 00:00 when absent', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Day Mode:** 08:00 - 00:00');
  });

  it('contains cortextOS Node.js framework marker', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('**Framework:** cortextOS Node.js');
  });

  it('contains all three section headers', () => {
    const md = buildAgentSystemMd({}, 'org');
    expect(md).toContain('## Team Roster');
    expect(md).toContain('## Agent Health');
    expect(md).toContain('## Communication');
  });

  it('full ctx fills all fields correctly', () => {
    const ctx: Partial<OrgContext> = {
      name: 'GLV Marketing',
      description: 'Digital marketing agency',
      timezone: 'America/Toronto',
      orchestrator: 'alpha',
      dashboard_url: 'http://localhost:3000',
      communication_style: 'direct and casual',
      day_mode_start: '08:00',
      day_mode_end: '22:00',
    };
    const md = buildAgentSystemMd(ctx, 'glv');
    expect(md).toContain('**Organization:** GLV Marketing');
    expect(md).toContain('**Description:** Digital marketing agency');
    expect(md).toContain('**Timezone:** America/Toronto');
    expect(md).toContain('**Orchestrator:** alpha');
    expect(md).toContain('**Dashboard:** http://localhost:3000');
    expect(md).toContain('**Communication Style:** direct and casual');
    expect(md).toContain('**Day Mode:** 08:00 - 22:00');
  });
});

// ── copyOrgTemplateFiles ─────────────────────────────────────────────────────

describe('copyOrgTemplateFiles', () => {
  let tmplDir: string;
  let orgDir: string;

  beforeEach(() => {
    tmplDir = mkdtempSync(join(tmpdir(), 'ctx-tmpl-'));
    orgDir = mkdtempSync(join(tmpdir(), 'ctx-org-'));
  });

  afterEach(() => {
    rmSync(tmplDir, { recursive: true, force: true });
    rmSync(orgDir, { recursive: true, force: true });
  });

  it('does not throw when templateDir does not exist', () => {
    expect(() => copyOrgTemplateFiles('/nonexistent/dir', orgDir, 'testorg')).not.toThrow();
  });

  it('copies a template file into orgDir', () => {
    writeFileSync(join(tmplDir, 'README.md'), 'Hello', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'testorg');
    expect(existsSync(join(orgDir, 'README.md'))).toBe(true);
  });

  it('substitutes {{org_name}} with the orgName argument', () => {
    writeFileSync(join(tmplDir, 'context.md'), 'Org: {{org_name}}', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'my-org');
    expect(readFileSync(join(orgDir, 'context.md'), 'utf-8')).toBe('Org: my-org');
  });

  it('replaces all occurrences of {{org_name}} in a file', () => {
    writeFileSync(join(tmplDir, 'multi.md'), '{{org_name}} is {{org_name}}', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'acme');
    expect(readFileSync(join(orgDir, 'multi.md'), 'utf-8')).toBe('acme is acme');
  });

  it('does not overwrite an existing file in orgDir', () => {
    writeFileSync(join(tmplDir, 'config.json'), 'new content', 'utf-8');
    writeFileSync(join(orgDir, 'config.json'), 'original content', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'testorg');
    expect(readFileSync(join(orgDir, 'config.json'), 'utf-8')).toBe('original content');
  });

  it('skips subdirectories (copies files only)', () => {
    mkdirSync(join(tmplDir, 'subdir'));
    writeFileSync(join(tmplDir, 'file.txt'), 'content', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'testorg');
    expect(existsSync(join(orgDir, 'subdir', 'file.txt'))).toBe(false);
    expect(existsSync(join(orgDir, 'file.txt'))).toBe(true);
  });

  it('copies multiple files', () => {
    writeFileSync(join(tmplDir, 'a.md'), 'A', 'utf-8');
    writeFileSync(join(tmplDir, 'b.md'), 'B', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'testorg');
    expect(existsSync(join(orgDir, 'a.md'))).toBe(true);
    expect(existsSync(join(orgDir, 'b.md'))).toBe(true);
  });

  it('copies new file but skips existing file in same call', () => {
    writeFileSync(join(tmplDir, 'existing.md'), 'new', 'utf-8');
    writeFileSync(join(tmplDir, 'fresh.md'), 'fresh content', 'utf-8');
    writeFileSync(join(orgDir, 'existing.md'), 'kept', 'utf-8');
    copyOrgTemplateFiles(tmplDir, orgDir, 'testorg');
    expect(readFileSync(join(orgDir, 'existing.md'), 'utf-8')).toBe('kept');
    expect(readFileSync(join(orgDir, 'fresh.md'), 'utf-8')).toBe('fresh content');
  });
});
