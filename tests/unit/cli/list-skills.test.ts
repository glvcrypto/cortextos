import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { parseFrontmatter, scanSkillsDir } from '../../../src/cli/list-skills';

// ─── helpers ────────────────────────────────────────────────────────────────

function makeSkillDir(root: string, skillName: string, content: string): string {
  const skillDir = join(root, skillName);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'SKILL.md'), content, 'utf-8');
  return skillDir;
}

// ─── parseFrontmatter ────────────────────────────────────────────────────────

describe('parseFrontmatter', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'cortextos-list-skills-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('returns null for a nonexistent file', () => {
    expect(parseFrontmatter(join(tmp, 'nonexistent.md'))).toBeNull();
  });

  it('returns null when there are no --- markers', () => {
    const p = join(tmp, 'no-fm.md');
    writeFileSync(p, '# Just a heading\nSome body text', 'utf-8');
    expect(parseFrontmatter(p)).toBeNull();
  });

  it('returns null when frontmatter has no name field', () => {
    const p = join(tmp, 'no-name.md');
    writeFileSync(p, '---\ndescription: Something\n---\n# Body', 'utf-8');
    expect(parseFrontmatter(p)).toBeNull();
  });

  it('returns null for an empty frontmatter block', () => {
    const p = join(tmp, 'empty-fm.md');
    writeFileSync(p, '---\n---\n# Body', 'utf-8');
    expect(parseFrontmatter(p)).toBeNull();
  });

  it('returns name and empty description when only name is present', () => {
    const p = join(tmp, 'name-only.md');
    writeFileSync(p, '---\nname: my-skill\n---\n# Body', 'utf-8');
    expect(parseFrontmatter(p)).toEqual({ name: 'my-skill', description: '' });
  });

  it('returns name and description for unquoted values', () => {
    const p = join(tmp, 'unquoted.md');
    writeFileSync(p, '---\nname: page-audit\ndescription: Audit a page for SEO\n---\n', 'utf-8');
    expect(parseFrontmatter(p)).toEqual({ name: 'page-audit', description: 'Audit a page for SEO' });
  });

  it('strips single quotes from name and description', () => {
    const p = join(tmp, 'single-quoted.md');
    writeFileSync(p, "---\nname: 'page-audit'\ndescription: 'Audit a page'\n---\n", 'utf-8');
    expect(parseFrontmatter(p)).toEqual({ name: 'page-audit', description: 'Audit a page' });
  });

  it('strips double quotes from name and description', () => {
    const p = join(tmp, 'double-quoted.md');
    writeFileSync(p, '---\nname: "page-audit"\ndescription: "Audit a page"\n---\n', 'utf-8');
    expect(parseFrontmatter(p)).toEqual({ name: 'page-audit', description: 'Audit a page' });
  });

  it('handles description values that contain a colon', () => {
    const p = join(tmp, 'colon-desc.md');
    writeFileSync(p, '---\nname: deploy\ndescription: Deploy: build then push\n---\n', 'utf-8');
    expect(parseFrontmatter(p)).toEqual({ name: 'deploy', description: 'Deploy: build then push' });
  });

  it('stops parsing at the closing --- (body lines do not bleed into frontmatter)', () => {
    const p = join(tmp, 'body-bleed.md');
    writeFileSync(
      p,
      '---\nname: real-skill\ndescription: Real desc\n---\nname: fake-name\ndescription: fake-desc\n',
      'utf-8',
    );
    expect(parseFrontmatter(p)).toEqual({ name: 'real-skill', description: 'Real desc' });
  });

  it('handles extra whitespace around values', () => {
    const p = join(tmp, 'whitespace.md');
    writeFileSync(p, '---\nname:   spaced-name   \ndescription:   spaced desc   \n---\n', 'utf-8');
    const result = parseFrontmatter(p);
    expect(result?.name).toBe('spaced-name');
    // trailing whitespace is consumed by \s*$ in the regex
    expect(result?.description).toBe('spaced desc');
  });

  it('handles name with hyphens and numbers', () => {
    const p = join(tmp, 'hyphen-name.md');
    writeFileSync(p, '---\nname: skill-v2-beta\ndescription: Version 2 beta\n---\n', 'utf-8');
    expect(parseFrontmatter(p)).toEqual({ name: 'skill-v2-beta', description: 'Version 2 beta' });
  });
});

// ─── scanSkillsDir ───────────────────────────────────────────────────────────

describe('scanSkillsDir', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'cortextos-scan-skills-'));
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('returns [] for a nonexistent directory', () => {
    expect(scanSkillsDir(join(tmp, 'does-not-exist'), 'framework')).toEqual([]);
  });

  it('returns [] for an empty directory with no subdirectories', () => {
    expect(scanSkillsDir(tmp, 'framework')).toEqual([]);
  });

  it('returns [] when subdirectory has no SKILL.md', () => {
    mkdirSync(join(tmp, 'some-skill'));
    // no SKILL.md file created
    expect(scanSkillsDir(tmp, 'agent')).toEqual([]);
  });

  it('returns one entry for a valid SKILL.md', () => {
    makeSkillDir(tmp, 'seo-audit', '---\nname: seo-audit\ndescription: Audit SEO\n---\n');

    const result = scanSkillsDir(tmp, 'framework');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ name: 'seo-audit', description: 'Audit SEO', source: 'framework' });
  });

  it('passes the source parameter through correctly', () => {
    makeSkillDir(tmp, 'my-skill', '---\nname: my-skill\ndescription: desc\n---\n');

    const resultA = scanSkillsDir(tmp, 'template:orchestrator');
    expect(resultA[0].source).toBe('template:orchestrator');

    const resultB = scanSkillsDir(tmp, 'agent');
    expect(resultB[0].source).toBe('agent');
  });

  it('includes the full SKILL.md file path in each result', () => {
    makeSkillDir(tmp, 'my-skill', '---\nname: my-skill\ndescription: desc\n---\n');

    const result = scanSkillsDir(tmp, 'agent');
    expect(result[0].path).toBe(join(tmp, 'my-skill', 'SKILL.md'));
  });

  it('returns multiple entries when multiple skill dirs are valid', () => {
    makeSkillDir(tmp, 'skill-a', '---\nname: skill-a\ndescription: Desc A\n---\n');
    makeSkillDir(tmp, 'skill-b', '---\nname: skill-b\ndescription: Desc B\n---\n');
    makeSkillDir(tmp, 'skill-c', '---\nname: skill-c\ndescription: Desc C\n---\n');

    const result = scanSkillsDir(tmp, 'framework');
    expect(result).toHaveLength(3);
    const names = result.map((s) => s.name).sort();
    expect(names).toEqual(['skill-a', 'skill-b', 'skill-c']);
  });

  it('skips subdirs that have no SKILL.md among valid ones', () => {
    makeSkillDir(tmp, 'valid', '---\nname: valid\ndescription: Good\n---\n');
    mkdirSync(join(tmp, 'no-skill-file')); // no SKILL.md

    const result = scanSkillsDir(tmp, 'framework');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('valid');
  });

  it('skips SKILL.md with unparseable frontmatter (no name field)', () => {
    makeSkillDir(tmp, 'bad-fm', '---\ndescription: No name here\n---\n');

    expect(scanSkillsDir(tmp, 'agent')).toEqual([]);
  });

  it('skips flat files — only processes directories', () => {
    // A plain file sitting directly in tmp (not a directory) should be skipped
    writeFileSync(join(tmp, 'SKILL.md'), '---\nname: flat\ndescription: Should not appear\n---\n', 'utf-8');

    expect(scanSkillsDir(tmp, 'framework')).toEqual([]);
  });

  it('handles mixed valid and invalid entries returning only valid', () => {
    makeSkillDir(tmp, 'good',      '---\nname: good\ndescription: Good skill\n---\n');
    makeSkillDir(tmp, 'no-name',   '---\ndescription: Missing name\n---\n');
    mkdirSync(join(tmp, 'no-skill'));
    writeFileSync(join(tmp, 'flat-file.md'), 'not a dir', 'utf-8');

    const result = scanSkillsDir(tmp, 'agent');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('good');
  });
});
