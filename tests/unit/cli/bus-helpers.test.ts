import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  parseDisplayNameFromLines,
  checkDeliverableRequirement,
  pct,
} from '../../../src/cli/bus';

// ─── parseDisplayNameFromLines ───────────────────────────────────────────────

describe('parseDisplayNameFromLines', () => {
  describe('## Name section', () => {
    it('returns the first non-empty line after ## Name', () => {
      const lines = ['## Name', 'Commander'];
      expect(parseDisplayNameFromLines(lines)).toBe('Commander');
    });

    it('skips blank lines between ## Name and the value', () => {
      const lines = ['## Name', '', '  ', 'Tally'];
      expect(parseDisplayNameFromLines(lines)).toBe('Tally');
    });

    it('skips <!-- comment lines after ## Name', () => {
      const lines = ['## Name', '<!-- internal note -->', 'Analyst'];
      expect(parseDisplayNameFromLines(lines)).toBe('Analyst');
    });

    it('stops at next heading and falls back to H1 when ## Name body is empty', () => {
      const lines = ['## Name', '## Next Section', '# H1 Fallback'];
      expect(parseDisplayNameFromLines(lines)).toBe('H1 Fallback');
    });

    it('## Name takes priority over H1 when both are present', () => {
      const lines = ['# Commander', '## Name', 'Overridden Name'];
      expect(parseDisplayNameFromLines(lines)).toBe('Overridden Name');
    });

    it('## Name section with only comments falls back to H1', () => {
      const lines = ['## Name', '<!-- skip -->', '## Role', '# H1 Name'];
      expect(parseDisplayNameFromLines(lines)).toBe('H1 Name');
    });

    it('trims surrounding whitespace from the found name', () => {
      const lines = ['## Name', '  Scout  '];
      expect(parseDisplayNameFromLines(lines)).toBe('Scout');
    });
  });

  describe('H1 fallback', () => {
    it('returns H1 value when no ## Name section exists', () => {
      const lines = ['# Boss'];
      expect(parseDisplayNameFromLines(lines)).toBe('Boss');
    });

    it('strips the leading # and trims H1 value', () => {
      const lines = ['#   Spaced Name  '];
      expect(parseDisplayNameFromLines(lines)).toBe('Spaced Name');
    });

    it('does not match ## headings as H1', () => {
      const lines = ['## Not H1', '### Also Not H1'];
      expect(parseDisplayNameFromLines(lines)).toBeUndefined();
    });

    it('returns the first H1 when multiple H1 lines exist', () => {
      const lines = ['# First', '# Second'];
      expect(parseDisplayNameFromLines(lines)).toBe('First');
    });
  });

  describe('edge cases', () => {
    it('returns undefined for an empty array', () => {
      expect(parseDisplayNameFromLines([])).toBeUndefined();
    });

    it('returns undefined when no ## Name and no H1', () => {
      const lines = ['Some content', '## Section', 'More content'];
      expect(parseDisplayNameFromLines(lines)).toBeUndefined();
    });

    it('handles realistic IDENTITY.md structure', () => {
      const lines = [
        '# GLV Dev Agent',
        '',
        '## Name',
        '<!-- User-facing display name shown on dashboard -->',
        'Dev',
        '',
        '## Role',
        'Software engineer',
      ];
      expect(parseDisplayNameFromLines(lines)).toBe('Dev');
    });
  });
});

// ─── checkDeliverableRequirement ────────────────────────────────────────────

describe('checkDeliverableRequirement', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'cortextos-bus-helpers-'));
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  function writeContextJson(org: string, data: object): void {
    const dir = join(tmpRoot, 'orgs', org);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'context.json'), JSON.stringify(data));
  }

  function writeTaskJson(taskDir: string, taskId: string, data: object): void {
    mkdirSync(taskDir, { recursive: true });
    writeFileSync(join(taskDir, `${taskId}.json`), JSON.stringify(data));
  }

  it('returns null when context.json does not exist', () => {
    const result = checkDeliverableRequirement('t-001', tmpRoot, 'myorg', tmpRoot);
    expect(result).toBeNull();
  });

  it('returns null when context.json is invalid JSON', () => {
    const dir = join(tmpRoot, 'orgs', 'myorg');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'context.json'), 'not json{{{');
    const result = checkDeliverableRequirement('t-001', tmpRoot, 'myorg', tmpRoot);
    expect(result).toBeNull();
  });

  it('returns null when require_deliverables is false', () => {
    writeContextJson('myorg', { require_deliverables: false });
    const result = checkDeliverableRequirement('t-001', tmpRoot, 'myorg', tmpRoot);
    expect(result).toBeNull();
  });

  it('returns null when require_deliverables is absent', () => {
    writeContextJson('myorg', { some_other_key: true });
    const result = checkDeliverableRequirement('t-001', tmpRoot, 'myorg', tmpRoot);
    expect(result).toBeNull();
  });

  it('returns null when task file does not exist', () => {
    writeContextJson('myorg', { require_deliverables: true });
    const taskDir = join(tmpRoot, 'tasks');
    mkdirSync(taskDir, { recursive: true });
    const result = checkDeliverableRequirement('t-missing', tmpRoot, 'myorg', taskDir);
    expect(result).toBeNull();
  });

  it('returns null when task file is invalid JSON', () => {
    writeContextJson('myorg', { require_deliverables: true });
    const taskDir = join(tmpRoot, 'tasks');
    mkdirSync(taskDir, { recursive: true });
    writeFileSync(join(taskDir, 't-bad.json'), 'bad json');
    const result = checkDeliverableRequirement('t-bad', tmpRoot, 'myorg', taskDir);
    expect(result).toBeNull();
  });

  it('returns null when task has a non-empty outputs array', () => {
    writeContextJson('myorg', { require_deliverables: true });
    const taskDir = join(tmpRoot, 'tasks');
    writeTaskJson(taskDir, 't-001', { outputs: ['/path/to/file.pdf'] });
    const result = checkDeliverableRequirement('t-001', tmpRoot, 'myorg', taskDir);
    expect(result).toBeNull();
  });

  it('returns error message when task has an empty outputs array', () => {
    writeContextJson('myorg', { require_deliverables: true });
    const taskDir = join(tmpRoot, 'tasks');
    writeTaskJson(taskDir, 't-001', { outputs: [] });
    const result = checkDeliverableRequirement('t-001', tmpRoot, 'myorg', taskDir);
    expect(result).not.toBeNull();
    expect(result).toContain('t-001');
    expect(result).toContain('require_deliverables');
    expect(result).toContain('save-output');
  });

  it('returns error message when task has no outputs key', () => {
    writeContextJson('myorg', { require_deliverables: true });
    const taskDir = join(tmpRoot, 'tasks');
    writeTaskJson(taskDir, 't-002', { title: 'Task without outputs' });
    const result = checkDeliverableRequirement('t-002', tmpRoot, 'myorg', taskDir);
    expect(result).not.toBeNull();
    expect(result).toContain('t-002');
  });

  it('error message includes the taskId verbatim', () => {
    writeContextJson('myorg', { require_deliverables: true });
    const taskDir = join(tmpRoot, 'tasks');
    writeTaskJson(taskDir, 'task-xyz-42', { outputs: [] });
    const result = checkDeliverableRequirement('task-xyz-42', tmpRoot, 'myorg', taskDir);
    expect(result).toContain('task-xyz-42');
  });
});

// ─── pct ────────────────────────────────────────────────────────────────────

describe('pct', () => {
  it('formats 0 as 0%', () => {
    expect(pct(0)).toBe('0%');
  });

  it('formats 0.5 as 50%', () => {
    expect(pct(0.5)).toBe('50%');
  });

  it('formats 1 as 100%', () => {
    expect(pct(1)).toBe('100%');
  });

  it('rounds fractional percentages to the nearest integer', () => {
    expect(pct(0.666)).toBe('67%');
    expect(pct(0.334)).toBe('33%');
    expect(pct(0.995)).toBe('100%');
  });
});
