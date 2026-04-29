import { describe, it, expect } from 'vitest';
import { validateAgentName, validateOrgName, buildAgentEnvContent } from '../../../src/cli/setup.js';
import { parseEnvContent, buildNextEnvContent, type NextEnvOpts } from '../../../src/cli/dashboard.js';

// ─── validateAgentName ────────────────────────────────────────────────────────

describe('validateAgentName', () => {
  it('accepts lowercase letters', () => {
    expect(validateAgentName('abc')).toBe(true);
  });

  it('accepts digits', () => {
    expect(validateAgentName('123')).toBe(true);
  });

  it('accepts hyphens', () => {
    expect(validateAgentName('my-agent')).toBe(true);
  });

  it('accepts underscores', () => {
    expect(validateAgentName('my_agent')).toBe(true);
  });

  it('accepts mixed valid characters', () => {
    expect(validateAgentName('dev-agent_2')).toBe(true);
  });

  it('accepts single character', () => {
    expect(validateAgentName('a')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateAgentName('')).toBe(false);
  });

  it('rejects uppercase letters', () => {
    expect(validateAgentName('MyAgent')).toBe(false);
  });

  it('rejects spaces', () => {
    expect(validateAgentName('my agent')).toBe(false);
  });

  it('rejects at-sign', () => {
    expect(validateAgentName('my@agent')).toBe(false);
  });

  it('rejects dot', () => {
    expect(validateAgentName('my.agent')).toBe(false);
  });
});

// ─── validateOrgName ─────────────────────────────────────────────────────────

describe('validateOrgName', () => {
  it('accepts lowercase letters', () => {
    expect(validateOrgName('acme')).toBe(true);
  });

  it('accepts digits', () => {
    expect(validateOrgName('org42')).toBe(true);
  });

  it('accepts hyphens', () => {
    expect(validateOrgName('glv-marketing')).toBe(true);
  });

  it('accepts underscores', () => {
    expect(validateOrgName('my_org')).toBe(true);
  });

  it('accepts mixed valid characters', () => {
    expect(validateOrgName('glv_2-dev')).toBe(true);
  });

  it('accepts single character', () => {
    expect(validateOrgName('g')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(validateOrgName('')).toBe(false);
  });

  it('rejects uppercase letters', () => {
    expect(validateOrgName('GLV')).toBe(false);
  });

  it('rejects spaces', () => {
    expect(validateOrgName('my org')).toBe(false);
  });

  it('rejects slash', () => {
    expect(validateOrgName('my/org')).toBe(false);
  });

  it('rejects dot', () => {
    expect(validateOrgName('my.org')).toBe(false);
  });
});

// ─── buildAgentEnvContent ─────────────────────────────────────────────────────

describe('buildAgentEnvContent', () => {
  it('produces BOT_TOKEN line', () => {
    expect(buildAgentEnvContent('mytoken', '12345')).toContain('BOT_TOKEN=mytoken');
  });

  it('produces CHAT_ID line', () => {
    expect(buildAgentEnvContent('mytoken', '12345')).toContain('CHAT_ID=12345');
  });

  it('ends with trailing newline', () => {
    expect(buildAgentEnvContent('tok', 'id')).toMatch(/\n$/);
  });

  it('produces exactly two lines', () => {
    const lines = buildAgentEnvContent('tok', 'id').split('\n').filter(Boolean);
    expect(lines).toHaveLength(2);
  });

  it('handles empty token', () => {
    expect(buildAgentEnvContent('', '999')).toContain('BOT_TOKEN=\n');
  });

  it('handles empty chatId', () => {
    expect(buildAgentEnvContent('tok', '')).toContain('CHAT_ID=\n');
  });
});

// ─── parseEnvContent ─────────────────────────────────────────────────────────

describe('parseEnvContent', () => {
  it('returns empty object for empty string', () => {
    expect(parseEnvContent('')).toEqual({});
  });

  it('skips blank lines', () => {
    expect(parseEnvContent('\n\n\n')).toEqual({});
  });

  it('skips comment lines starting with #', () => {
    expect(parseEnvContent('# this is a comment\n# another')).toEqual({});
  });

  it('parses simple KEY=VALUE', () => {
    expect(parseEnvContent('FOO=bar')).toEqual({ FOO: 'bar' });
  });

  it('strips double quotes from value', () => {
    expect(parseEnvContent('FOO="hello world"')).toEqual({ FOO: 'hello world' });
  });

  it('strips single quotes from value', () => {
    expect(parseEnvContent("FOO='hello world'")).toEqual({ FOO: 'hello world' });
  });

  it('preserves empty value', () => {
    expect(parseEnvContent('FOO=')).toEqual({ FOO: '' });
  });

  it('skips line with no equals sign', () => {
    expect(parseEnvContent('NOEQUALS')).toEqual({});
  });

  it('skips line where equals is at position 0 (empty key)', () => {
    expect(parseEnvContent('=VALUE')).toEqual({});
  });

  it('includes equals signs in value', () => {
    expect(parseEnvContent('FOO=a=b=c')).toEqual({ FOO: 'a=b=c' });
  });

  it('parses multiple keys', () => {
    expect(parseEnvContent('A=1\nB=2\nC=3')).toEqual({ A: '1', B: '2', C: '3' });
  });

  it('handles mixed blank lines, comments, and key-value pairs', () => {
    const content = '# header\n\nFOO=bar\n# comment\nBAZ=qux\n';
    expect(parseEnvContent(content)).toEqual({ FOO: 'bar', BAZ: 'qux' });
  });

  it('does not strip mismatched quotes', () => {
    expect(parseEnvContent('FOO="no-end')).toEqual({ FOO: '"no-end' });
  });

  it('trims leading/trailing whitespace from the whole line before parsing', () => {
    expect(parseEnvContent('  FOO=bar  ')).toEqual({ FOO: 'bar' });
  });
});

// ─── buildNextEnvContent ─────────────────────────────────────────────────────

const baseOpts: NextEnvOpts = {
  ctxRoot: '/home/user/.cortextos/default',
  authSecret: 'abc123secret',
  adminUsername: 'admin',
  adminPassword: 'supersecret',
  instance: 'default',
  port: '3000',
  frameworkRoot: '/home/user/cortextos',
};

describe('buildNextEnvContent', () => {
  it('includes AUTO-GENERATED header comment', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('# AUTO-GENERATED by cortextos dashboard');
  });

  it('includes dashboard.env path comment', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('dashboard.env');
  });

  it('includes AUTH_SECRET', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('AUTH_SECRET=abc123secret');
  });

  it('sets AUTH_TRUST_HOST=true', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('AUTH_TRUST_HOST=true');
  });

  it('includes ADMIN_USERNAME', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('ADMIN_USERNAME=admin');
  });

  it('includes ADMIN_PASSWORD', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('ADMIN_PASSWORD=supersecret');
  });

  it('includes CTX_ROOT', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('CTX_ROOT=/home/user/.cortextos/default');
  });

  it('includes CTX_FRAMEWORK_ROOT', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('CTX_FRAMEWORK_ROOT=/home/user/cortextos');
  });

  it('includes CTX_INSTANCE_ID', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('CTX_INSTANCE_ID=default');
  });

  it('includes PORT', () => {
    expect(buildNextEnvContent(baseOpts)).toContain('PORT=3000');
  });

  it('ends with trailing newline', () => {
    expect(buildNextEnvContent(baseOpts)).toMatch(/\n$/);
  });

  it('propagates custom port', () => {
    expect(buildNextEnvContent({ ...baseOpts, port: '8080' })).toContain('PORT=8080');
  });

  it('propagates custom instance', () => {
    expect(buildNextEnvContent({ ...baseOpts, instance: 'staging' }))
      .toContain('CTX_INSTANCE_ID=staging');
  });

  it('propagates custom ctxRoot into path comment', () => {
    const result = buildNextEnvContent({ ...baseOpts, ctxRoot: '/tmp/myroot' });
    expect(result).toContain('/tmp/myroot');
  });
});
