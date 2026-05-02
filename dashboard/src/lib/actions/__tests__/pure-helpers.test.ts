import { describe, it, expect } from 'vitest';
import { maskToken, normalizeFsPath } from '../settings';
import { parseSkillMd } from '../skills';

// ─── maskToken ────────────────────────────────────────────────────────────────

describe('maskToken', () => {
  it('returns **** for tokens 8 chars or shorter', () => {
    expect(maskToken('')).toBe('****');
    expect(maskToken('abc')).toBe('****');
    expect(maskToken('12345678')).toBe('****');
  });

  it('shows first 4 and last 4 chars for tokens longer than 8', () => {
    expect(maskToken('abcdefghij')).toBe('abcd****ghij');
  });

  it('works on a typical Telegram bot token', () => {
    const token = '1234567890:ABCDEF-some-long-token-here';
    const masked = maskToken(token);
    expect(masked.startsWith('1234')).toBe(true);
    expect(masked.endsWith('here')).toBe(true);
    expect(masked).toContain('****');
  });
});

// ─── normalizeFsPath ──────────────────────────────────────────────────────────

describe('normalizeFsPath', () => {
  it('converts Windows backslashes to forward slashes', () => {
    expect(normalizeFsPath('C:\\Users\\aiden\\cortextos')).toBe('C:/Users/aiden/cortextos');
  });

  it('strips trailing slash from non-root paths', () => {
    expect(normalizeFsPath('/home/aiden/')).toBe('/home/aiden');
    expect(normalizeFsPath('/home/aiden/cortextos/')).toBe('/home/aiden/cortextos');
  });

  it('preserves trailing slash on Windows root drive (C:/)', () => {
    expect(normalizeFsPath('C:/')).toBe('C:/');
  });

  it('does not strip trailing slash from root /', () => {
    expect(normalizeFsPath('/')).toBe('/');
  });

  it('returns unchanged path with no trailing slash or backslashes', () => {
    expect(normalizeFsPath('/home/aiden/cortextos')).toBe('/home/aiden/cortextos');
  });
});

// ─── parseSkillMd ─────────────────────────────────────────────────────────────

describe('parseSkillMd', () => {
  it('parses name and description from frontmatter', () => {
    const content = `---\nname: My Skill\ndescription: Does something useful\n---\n\nBody text`;
    const result = parseSkillMd(content);
    expect(result.name).toBe('My Skill');
    expect(result.description).toBe('Does something useful');
  });

  it('strips surrounding quotes from frontmatter values', () => {
    const content = `---\nname: "Quoted Skill"\ndescription: 'Single quoted'\n---`;
    const result = parseSkillMd(content);
    expect(result.name).toBe('Quoted Skill');
    expect(result.description).toBe('Single quoted');
  });

  it('falls back to first heading when no frontmatter', () => {
    const content = `# My Heading\n\nSome description text`;
    const result = parseSkillMd(content);
    expect(result.name).toBe('My Heading');
  });

  it('falls back to first plain paragraph line when no frontmatter description', () => {
    const content = `---\nname: Skill\n---\n\nThis is the description`;
    const result = parseSkillMd(content);
    expect(result.description).toBe('This is the description');
  });

  it('returns defaults when content is empty', () => {
    const result = parseSkillMd('');
    expect(result.name).toBe('Unnamed Skill');
    expect(result.description).toBe('No description available.');
  });

  it('ignores heading and frontmatter lines when searching for fallback description', () => {
    const content = `# Skill Name\n---\nkey: value\n---\n\nReal description here`;
    const result = parseSkillMd(content);
    expect(result.description).toBe('Real description here');
  });
});
