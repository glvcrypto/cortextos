import { describe, it, expect } from 'vitest';
import { resolveConfig, formatConfigText, ResolvedConfig } from '../../../src/cli/get-config';

const HARDCODED_CATEGORIES = ['external-comms', 'financial', 'deployment', 'data-deletion'];

describe('resolveConfig', () => {
  describe('hardcoded defaults — both inputs empty', () => {
    it('returns UTC timezone when neither org nor agent specifies one', () => {
      const r = resolveConfig({}, {});
      expect(r.timezone).toBe('UTC');
    });

    it('returns 08:00 day_mode_start when neither specifies one', () => {
      expect(resolveConfig({}, {}).day_mode_start).toBe('08:00');
    });

    it('returns 00:00 day_mode_end when neither specifies one', () => {
      expect(resolveConfig({}, {}).day_mode_end).toBe('00:00');
    });

    it('returns "direct and casual" communication_style when neither specifies one', () => {
      expect(resolveConfig({}, {}).communication_style).toBe('direct and casual');
    });

    it('returns hardcoded 4-category approval list and empty never_ask', () => {
      const r = resolveConfig({}, {});
      expect(r.approval_rules.always_ask).toEqual(HARDCODED_CATEGORIES);
      expect(r.approval_rules.never_ask).toEqual([]);
    });
  });

  describe('org context wins over hardcoded defaults', () => {
    it('uses org timezone over default', () => {
      expect(resolveConfig({ timezone: 'America/Toronto' }, {}).timezone).toBe('America/Toronto');
    });

    it('uses org day_mode_start over default', () => {
      expect(resolveConfig({ day_mode_start: '09:00' }, {}).day_mode_start).toBe('09:00');
    });

    it('uses org day_mode_end over default', () => {
      expect(resolveConfig({ day_mode_end: '22:00' }, {}).day_mode_end).toBe('22:00');
    });

    it('uses org communication_style over default', () => {
      expect(resolveConfig({ communication_style: 'formal' }, {}).communication_style).toBe('formal');
    });

    it('uses org default_approval_categories array as always_ask', () => {
      const r = resolveConfig({ default_approval_categories: ['financial', 'deployment'] }, {});
      expect(r.approval_rules.always_ask).toEqual(['financial', 'deployment']);
    });
  });

  describe('agent config wins over org context', () => {
    it('agent timezone overrides org timezone', () => {
      const r = resolveConfig({ timezone: 'UTC' }, { timezone: 'America/Vancouver' });
      expect(r.timezone).toBe('America/Vancouver');
    });

    it('agent day_mode_start overrides org', () => {
      const r = resolveConfig({ day_mode_start: '08:00' }, { day_mode_start: '10:00' });
      expect(r.day_mode_start).toBe('10:00');
    });

    it('agent day_mode_end overrides org', () => {
      const r = resolveConfig({ day_mode_end: '22:00' }, { day_mode_end: '23:00' });
      expect(r.day_mode_end).toBe('23:00');
    });

    it('agent communication_style overrides org', () => {
      const r = resolveConfig({ communication_style: 'formal' }, { communication_style: 'brief' });
      expect(r.communication_style).toBe('brief');
    });

    it('agent approval_rules replaces org default_approval_categories', () => {
      const agentRules = { always_ask: ['financial'], never_ask: ['deployment'] };
      const r = resolveConfig(
        { default_approval_categories: ['external-comms'] },
        { approval_rules: agentRules }
      );
      expect(r.approval_rules).toEqual(agentRules);
    });

    it('agent fields win while unset agent fields fall back to org', () => {
      const r = resolveConfig(
        { timezone: 'UTC', communication_style: 'formal' },
        { timezone: 'America/New_York' }
      );
      expect(r.timezone).toBe('America/New_York');
      expect(r.communication_style).toBe('formal');
    });
  });

  describe('default_approval_categories fallback guard', () => {
    it('falls back to hardcoded list when org value is null', () => {
      const r = resolveConfig({ default_approval_categories: null }, {});
      expect(r.approval_rules.always_ask).toEqual(HARDCODED_CATEGORIES);
    });

    it('falls back when org value is a plain string', () => {
      const r = resolveConfig({ default_approval_categories: 'financial' }, {});
      expect(r.approval_rules.always_ask).toEqual(HARDCODED_CATEGORIES);
    });

    it('falls back when org value is a number', () => {
      const r = resolveConfig({ default_approval_categories: 42 }, {});
      expect(r.approval_rules.always_ask).toEqual(HARDCODED_CATEGORIES);
    });

    it('falls back when org value is a plain object', () => {
      const r = resolveConfig({ default_approval_categories: { a: 1 } }, {});
      expect(r.approval_rules.always_ask).toEqual(HARDCODED_CATEGORIES);
    });

    it('accepts an empty array as a valid (empty) approval list', () => {
      const r = resolveConfig({ default_approval_categories: [] }, {});
      expect(r.approval_rules.always_ask).toEqual([]);
    });

    it('agent approval_rules wins even when org has a valid category array', () => {
      const agentRules = { always_ask: ['data-deletion'], never_ask: [] };
      const r = resolveConfig(
        { default_approval_categories: HARDCODED_CATEGORIES },
        { approval_rules: agentRules }
      );
      expect(r.approval_rules).toEqual(agentRules);
    });
  });
});

describe('formatConfigText', () => {
  const base: ResolvedConfig = {
    timezone: 'America/Toronto',
    day_mode_start: '08:00',
    day_mode_end: '22:00',
    communication_style: 'direct and casual',
    approval_rules: { always_ask: ['financial', 'deployment'], never_ask: [] },
  };

  it('header includes agent name when agentName is set', () => {
    const out = formatConfigText(base, 'dev', 'glv');
    expect(out).toContain('=== Config: dev (org: glv) ===');
  });

  it('header uses org-only form when agentName is empty', () => {
    const out = formatConfigText(base, '', 'glv');
    expect(out).toContain('=== Org Config: glv ===');
  });

  it('output contains all 7 lines', () => {
    const lines = formatConfigText(base, 'dev', 'glv').split('\n');
    expect(lines).toHaveLength(7);
  });

  it('timezone line is present', () => {
    expect(formatConfigText(base, 'dev', 'glv')).toContain('Timezone:            America/Toronto');
  });

  it('day mode line shows start–end range', () => {
    expect(formatConfigText(base, 'dev', 'glv')).toContain('Day Mode:            08:00 – 22:00');
  });

  it('night mode line inverts the range', () => {
    expect(formatConfigText(base, 'dev', 'glv')).toContain('Night Mode:          22:00 – 08:00');
  });

  it('approval required line joins categories', () => {
    expect(formatConfigText(base, 'dev', 'glv')).toContain('Approval Required:   financial, deployment');
  });

  it('approval required shows (none) when always_ask is empty', () => {
    const cfg: ResolvedConfig = { ...base, approval_rules: { always_ask: [], never_ask: [] } };
    expect(formatConfigText(cfg, 'dev', 'glv')).toContain('Approval Required:   (none)');
  });

  it('never need approval shows (none) when never_ask is empty', () => {
    expect(formatConfigText(base, 'dev', 'glv')).toContain('Never Need Approval: (none)');
  });

  it('never need approval joins items when never_ask is non-empty', () => {
    const cfg: ResolvedConfig = {
      ...base,
      approval_rules: { always_ask: [], never_ask: ['deployment', 'data-deletion'] },
    };
    expect(formatConfigText(cfg, 'dev', 'glv')).toContain('Never Need Approval: deployment, data-deletion');
  });

  it('communication style line is present', () => {
    expect(formatConfigText(base, 'dev', 'glv')).toContain('Communication:       direct and casual');
  });
});
