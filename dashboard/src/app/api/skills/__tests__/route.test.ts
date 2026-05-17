import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-route-'));
process.env.CTX_FRAMEWORK_ROOT = tmpRoot;

type SkillsRoute = typeof import('../route');
let route: SkillsRoute;

beforeAll(async () => {
  route = await import('../route');
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

function makeRequest(url: string, method = 'GET', body?: unknown): Request {
  return new Request(new URL(url, 'http://localhost'), {
    method,
    ...(body
      ? { body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }
      : {}),
  });
}

function addSkill(slug: string, skillMd?: string) {
  const skillDir = path.join(tmpRoot, 'skills', slug);
  fs.mkdirSync(skillDir, { recursive: true });
  const content = skillMd ?? `---\nname: ${slug}\ndescription: A test skill\n---\n# ${slug}\nContent here.`;
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content);
  return skillDir;
}

function addAgent(org: string, agent: string) {
  const agentDir = path.join(tmpRoot, 'orgs', org, 'agents', agent);
  fs.mkdirSync(path.join(agentDir, 'skills'), { recursive: true });
  return agentDir;
}

// ---------------------------------------------------------------------------
// GET /api/skills
// ---------------------------------------------------------------------------

describe('GET /api/skills', () => {
  it('returns empty array when skills dir is missing', async () => {
    const res = await route.GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('returns skills from catalog with frontmatter name + description', async () => {
    addSkill('autoresearch', '---\nname: Auto Research\ndescription: Runs experiments automatically.\n---\n');
    const res = await route.GET();
    const data = await res.json() as Array<{ slug: string; name: string; description: string }>;
    const skill = data.find(s => s.slug === 'autoresearch');
    expect(skill).toBeTruthy();
    expect(skill!.name).toBe('Auto Research');
    expect(skill!.description).toBe('Runs experiments automatically.');
  });

  it('falls back to README.md when SKILL.md is missing', async () => {
    const skillDir = path.join(tmpRoot, 'skills', 'fallback-skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'README.md'), '---\nname: Fallback\ndescription: readme-based\n---\n');

    const res = await route.GET();
    const data = await res.json() as Array<{ slug: string; name: string }>;
    const skill = data.find(s => s.slug === 'fallback-skill');
    expect(skill).toBeTruthy();
    expect(skill!.name).toBe('Fallback');
  });

  it('falls back to "Unnamed Skill" when frontmatter and heading are absent', async () => {
    const skillDir = path.join(tmpRoot, 'skills', 'bare-skill');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), 'No frontmatter here at all.');

    const res = await route.GET();
    const data = await res.json() as Array<{ slug: string; name: string }>;
    const skill = data.find(s => s.slug === 'bare-skill');
    expect(skill!.name).toBe('Unnamed Skill');
  });

  it('reports installed=false when no agents have the skill', async () => {
    const res = await route.GET();
    const data = await res.json() as Array<{ slug: string; installed: boolean; installedFor: string[] }>;
    const skill = data.find(s => s.slug === 'autoresearch');
    expect(skill!.installed).toBe(false);
    expect(skill!.installedFor).toEqual([]);
  });

  it('reports installed=true and installedFor when a symlink exists in agent skills', async () => {
    const skillCatalogDir = path.join(tmpRoot, 'skills', 'autoresearch');
    addAgent('glv', 'dev');
    const linkPath = path.join(tmpRoot, 'orgs', 'glv', 'agents', 'dev', 'skills', 'autoresearch');
    fs.symlinkSync(skillCatalogDir, linkPath, 'dir');

    const res = await route.GET();
    const data = await res.json() as Array<{ slug: string; installed: boolean; installedFor: string[] }>;
    const skill = data.find(s => s.slug === 'autoresearch');
    expect(skill!.installed).toBe(true);
    expect(skill!.installedFor).toContain('glv/dev');
  });

  it('skips dotfile directories', async () => {
    const hiddenDir = path.join(tmpRoot, 'skills', '.hidden-skill');
    fs.mkdirSync(hiddenDir, { recursive: true });
    fs.writeFileSync(path.join(hiddenDir, 'SKILL.md'), '---\nname: Hidden\n---\n');

    const res = await route.GET();
    const data = await res.json() as Array<{ slug: string }>;
    expect(data.find(s => s.slug === '.hidden-skill')).toBeUndefined();
  });

  it('returns skills sorted alphabetically by name', async () => {
    addSkill('zzz-last', '---\nname: ZZZ Last\n---\n');
    addSkill('aaa-first', '---\nname: AAA First\n---\n');

    const res = await route.GET();
    const data = await res.json() as Array<{ name: string }>;
    const names = data.map(s => s.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

// ---------------------------------------------------------------------------
// POST /api/skills
// ---------------------------------------------------------------------------

describe('POST /api/skills — validation', () => {
  it('returns 400 when slug/org/agent are missing', async () => {
    const res = await route.POST(makeRequest('http://localhost/api/skills', 'POST', { slug: 'autoresearch' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/required/);
  });

  it('returns 404 when skill slug does not exist in catalog', async () => {
    const res = await route.POST(makeRequest('http://localhost/api/skills', 'POST', {
      slug: 'nonexistent-skill',
      org: 'glv',
      agent: 'dev',
    }));
    expect(res.status).toBe(404);
  });

  it('installs skill symlink to agent skills dir', async () => {
    const res = await route.POST(makeRequest('http://localhost/api/skills', 'POST', {
      slug: 'autoresearch',
      org: 'glv',
      agent: 'dev',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/skills
// ---------------------------------------------------------------------------

describe('DELETE /api/skills — validation', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await route.DELETE(makeRequest('http://localhost/api/skills', 'DELETE', { slug: 'autoresearch' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when skill is not installed for agent', async () => {
    const res = await route.DELETE(makeRequest('http://localhost/api/skills', 'DELETE', {
      slug: 'nonexistent-skill',
      org: 'glv',
      agent: 'dev',
    }));
    expect(res.status).toBe(404);
  });

  it('removes installed skill symlink', async () => {
    const res = await route.DELETE(makeRequest('http://localhost/api/skills', 'DELETE', {
      slug: 'autoresearch',
      org: 'glv',
      agent: 'dev',
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
