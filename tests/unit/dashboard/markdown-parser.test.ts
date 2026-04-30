import { describe, it, expect } from 'vitest';
import {
  parseMarkdown,
  serializeMarkdown,
  parseIdentityMd,
  serializeIdentityMd,
  parseSoulMd,
  serializeSoulMd,
  parseGoalsMd,
  serializeGoalsMd,
} from '../../../dashboard/src/lib/markdown-parser';

// ---------------------------------------------------------------------------
// parseMarkdown
// ---------------------------------------------------------------------------

describe('parseMarkdown', () => {
  it('empty string → empty result', () => {
    const result = parseMarkdown('');
    expect(result).toEqual({ preamble: '', sections: [], raw: '' });
  });

  it('content with no headings → preamble only', () => {
    const content = 'Just some text\nno headings here';
    const result = parseMarkdown(content);
    expect(result.preamble).toBe(content);
    expect(result.sections).toEqual([]);
    expect(result.raw).toBe(content);
  });

  it('single ## heading with no content', () => {
    const content = '## Title';
    const result = parseMarkdown(content);
    expect(result.preamble).toBe('');
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].heading).toBe('Title');
    expect(result.sections[0].level).toBe(2);
    expect(result.sections[0].content).toBe('');
  });

  it('single heading with content', () => {
    const content = '## Name\nAlice';
    const result = parseMarkdown(content);
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].heading).toBe('Name');
    expect(result.sections[0].content).toBe('Alice');
  });

  it('preamble before first heading is preserved', () => {
    const content = 'preamble text\n## Section\nbody';
    const result = parseMarkdown(content);
    expect(result.preamble).toBe('preamble text');
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].heading).toBe('Section');
    expect(result.sections[0].content).toBe('body');
  });

  it('multiple sections split correctly', () => {
    const content = '## Alpha\nalpha body\n## Beta\nbeta body';
    const result = parseMarkdown(content);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].heading).toBe('Alpha');
    expect(result.sections[0].content).toBe('alpha body');
    expect(result.sections[1].heading).toBe('Beta');
    expect(result.sections[1].content).toBe('beta body');
  });

  it('mixed heading levels — level captured correctly', () => {
    const content = '# H1\n## H2\n### H3\n#### H4';
    const result = parseMarkdown(content);
    expect(result.sections.map((s) => s.level)).toEqual([1, 2, 3, 4]);
    expect(result.sections.map((s) => s.heading)).toEqual(['H1', 'H2', 'H3', 'H4']);
  });

  it('raw field captures the full original input', () => {
    const content = 'pre\n## S\nbody';
    expect(parseMarkdown(content).raw).toBe(content);
  });

  it('section.raw contains only its own heading + body (not next section)', () => {
    const content = '## A\nbody-a\n## B\nbody-b';
    const result = parseMarkdown(content);
    expect(result.sections[0].raw).toBe('## A\nbody-a');
    expect(result.sections[1].raw).toBe('## B\nbody-b');
  });

  it('multi-line section content preserved', () => {
    const content = '## Section\nline1\nline2\nline3';
    const result = parseMarkdown(content);
    expect(result.sections[0].content).toBe('line1\nline2\nline3');
  });
});

// ---------------------------------------------------------------------------
// serializeMarkdown
// ---------------------------------------------------------------------------

describe('serializeMarkdown', () => {
  it('empty parsed → empty string', () => {
    expect(serializeMarkdown({ preamble: '', sections: [], raw: '' })).toBe('');
  });

  it('preamble only (no sections) → preamble returned', () => {
    const result = serializeMarkdown({ preamble: 'just text', sections: [], raw: 'just text' });
    expect(result).toBe('just text');
  });

  it('reconstructs single section correctly', () => {
    const raw = '## Name\nAlice';
    const parsed = parseMarkdown(raw);
    expect(serializeMarkdown(parsed)).toBe(raw);
  });

  it('round-trip: serializeMarkdown(parseMarkdown(s)) === s', () => {
    const inputs = [
      '',
      '## Name\nBob',
      'preamble\n## A\nfoo\n## B\nbar',
      '# H1\n## H2\n### H3\ncontent',
      'multi\nline\npreamble\n## Sec\nline1\nline2',
    ];
    for (const s of inputs) {
      expect(serializeMarkdown(parseMarkdown(s))).toBe(s);
    }
  });
});

// ---------------------------------------------------------------------------
// parseIdentityMd + serializeIdentityMd
// ---------------------------------------------------------------------------

describe('parseIdentityMd', () => {
  it('parses all five identity fields', () => {
    const content = [
      '## Name',
      'Alice',
      '## Role',
      'Developer',
      '## Emoji',
      '🤖',
      '## Vibe',
      'Calm',
      '## Work Style',
      'Async-first',
    ].join('\n');

    const { fields } = parseIdentityMd(content);
    expect(fields.name).toBe('Alice');
    expect(fields.role).toBe('Developer');
    expect(fields.emoji).toBe('🤖');
    expect(fields.vibe).toBe('Calm');
    expect(fields.workStyle).toBe('Async-first');
  });

  it('heading matching is case-insensitive', () => {
    const { fields } = parseIdentityMd('## NAME\nAlice\n## ROLE\nDev');
    expect(fields.name).toBe('Alice');
    expect(fields.role).toBe('Dev');
  });

  it('missing sections default to empty string', () => {
    const { fields } = parseIdentityMd('## Name\nAlice');
    expect(fields.role).toBe('');
    expect(fields.emoji).toBe('');
    expect(fields.vibe).toBe('');
    expect(fields.workStyle).toBe('');
  });

  it('unknown sections included in parsed.sections but not in fields', () => {
    const content = '## Name\nAlice\n## CustomSection\nsome data';
    const { fields, parsed } = parseIdentityMd(content);
    expect(fields.name).toBe('Alice');
    expect(parsed.sections).toHaveLength(2);
    expect(parsed.sections[1].heading).toBe('CustomSection');
  });

  it('empty content → all fields empty', () => {
    const { fields } = parseIdentityMd('');
    expect(fields).toEqual({ name: '', role: '', emoji: '', vibe: '', workStyle: '' });
  });
});

describe('serializeIdentityMd', () => {
  it('updates an existing field in place', () => {
    const original = parseMarkdown('## Name\nAlice\n## Role\nDev');
    const { fields } = parseIdentityMd('## Name\nAlice\n## Role\nDev');
    const updated = serializeIdentityMd({ ...fields, name: 'Bob' }, original);
    expect(updated).toContain('Bob');
    // Alice must not appear — name was replaced
    expect(updated).not.toContain('Alice');
    // Role unchanged
    expect(updated).toContain('Dev');
  });

  it('appends a new section when field not present in original', () => {
    const original = parseMarkdown('## Name\nAlice');
    const { fields } = parseIdentityMd('## Name\nAlice');
    const updated = serializeIdentityMd({ ...fields, role: 'Engineer' }, original);
    expect(updated).toContain('Engineer');
  });

  it('preserves unknown sections through serialization', () => {
    const content = '## Name\nAlice\n## CustomSection\nsome data';
    const { fields, parsed } = parseIdentityMd(content);
    const updated = serializeIdentityMd(fields, parsed);
    expect(updated).toContain('CustomSection');
    expect(updated).toContain('some data');
  });
});

// ---------------------------------------------------------------------------
// parseSoulMd + serializeSoulMd
// ---------------------------------------------------------------------------

describe('parseSoulMd', () => {
  it('parses all five soul fields', () => {
    const content = [
      '## Autonomy Rules',
      'Act independently on small tasks',
      '## Communication Style',
      'Concise',
      '## Day Mode',
      'Focus mode',
      '## Night Mode',
      'Monitor only',
      '## Core Truths',
      'Ship it',
    ].join('\n');

    const { fields } = parseSoulMd(content);
    expect(fields.autonomyRules).toBe('Act independently on small tasks');
    expect(fields.communicationStyle).toBe('Concise');
    expect(fields.dayMode).toBe('Focus mode');
    expect(fields.nightMode).toBe('Monitor only');
    expect(fields.coreTruths).toBe('Ship it');
  });

  it('"Autonomy" alias maps to autonomyRules', () => {
    const { fields } = parseSoulMd('## Autonomy\nAct freely');
    expect(fields.autonomyRules).toBe('Act freely');
  });

  it('"Communication" alias maps to communicationStyle', () => {
    const { fields } = parseSoulMd('## Communication\nBrief');
    expect(fields.communicationStyle).toBe('Brief');
  });

  it('missing sections default to empty string', () => {
    const { fields } = parseSoulMd('## Core Truths\nKeep it simple');
    expect(fields.autonomyRules).toBe('');
    expect(fields.communicationStyle).toBe('');
    expect(fields.dayMode).toBe('');
    expect(fields.nightMode).toBe('');
    expect(fields.coreTruths).toBe('Keep it simple');
  });

  it('empty content → all fields empty', () => {
    const { fields } = parseSoulMd('');
    expect(fields).toEqual({
      autonomyRules: '',
      communicationStyle: '',
      dayMode: '',
      nightMode: '',
      coreTruths: '',
    });
  });
});

describe('serializeSoulMd', () => {
  it('updates autonomyRules in place', () => {
    const content = '## Autonomy Rules\nold rules\n## Core Truths\nship it';
    const { fields, parsed } = parseSoulMd(content);
    const updated = serializeSoulMd({ ...fields, autonomyRules: 'new rules' }, parsed);
    expect(updated).toContain('new rules');
    expect(updated).not.toContain('old rules');
    expect(updated).toContain('ship it');
  });

  it('appends coreTruths section when not in original', () => {
    const { fields, parsed } = parseSoulMd('## Day Mode\nFocus');
    const updated = serializeSoulMd({ ...fields, coreTruths: 'Stay humble' }, parsed);
    expect(updated).toContain('Stay humble');
  });
});

// ---------------------------------------------------------------------------
// parseGoalsMd + serializeGoalsMd
// ---------------------------------------------------------------------------

describe('parseGoalsMd', () => {
  it('parses bottleneck and goals', () => {
    const content = '## Bottleneck\nWaiting on review\n## Goals\nShip v2';
    const { fields } = parseGoalsMd(content);
    expect(fields.bottleneck).toBe('Waiting on review');
    expect(fields.goals).toBe('Ship v2');
  });

  it('"Current Bottleneck" alias maps to bottleneck', () => {
    const { fields } = parseGoalsMd('## Current Bottleneck\nBlocked by PR');
    expect(fields.bottleneck).toBe('Blocked by PR');
  });

  it('"Active Goals" alias maps to goals', () => {
    const { fields } = parseGoalsMd('## Active Goals\n- Ship feature');
    expect(fields.goals).toBe('- Ship feature');
  });

  it('missing fields default to empty string', () => {
    const { fields } = parseGoalsMd('## Bottleneck\nBlocked');
    expect(fields.goals).toBe('');
  });

  it('empty content → all fields empty', () => {
    const { fields } = parseGoalsMd('');
    expect(fields).toEqual({ bottleneck: '', goals: '' });
  });
});

describe('serializeGoalsMd', () => {
  it('updates bottleneck in place preserving original heading name', () => {
    const content = '## Current Bottleneck\nold\n## Goals\ndo stuff';
    const { fields, parsed } = parseGoalsMd(content);
    const updated = serializeGoalsMd({ ...fields, bottleneck: 'new blocker' }, parsed);
    // Original heading "Current Bottleneck" preserved
    expect(updated).toContain('Current Bottleneck');
    expect(updated).toContain('new blocker');
    expect(updated).not.toContain('old');
    expect(updated).toContain('do stuff');
  });

  it('updates goals section', () => {
    const content = '## Bottleneck\nNone\n## Goals\nold goal';
    const { fields, parsed } = parseGoalsMd(content);
    const updated = serializeGoalsMd({ ...fields, goals: 'new goal' }, parsed);
    expect(updated).toContain('new goal');
    expect(updated).not.toContain('old goal');
  });

  it('appends bottleneck section when not present', () => {
    const { fields, parsed } = parseGoalsMd('## Goals\nBuild it');
    const updated = serializeGoalsMd({ ...fields, bottleneck: 'Waiting' }, parsed);
    expect(updated).toContain('Bottleneck');
    expect(updated).toContain('Waiting');
    expect(updated).toContain('Build it');
  });

  it('round-trip: parse → serialize → parse gives identical fields', () => {
    const content = '## Bottleneck\nPR review queue\n## Goals\n- Ship v2\n- Fix bugs';
    const first = parseGoalsMd(content);
    const serialized = serializeGoalsMd(first.fields, first.parsed);
    const second = parseGoalsMd(serialized);
    expect(second.fields).toEqual(first.fields);
  });
});
