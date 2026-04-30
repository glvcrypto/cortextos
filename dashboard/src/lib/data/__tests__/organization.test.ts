import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// organization.ts reads from CTX_FRAMEWORK_ROOT via config helpers
const tmpState = fs.mkdtempSync(path.join(os.tmpdir(), 'org-test-state-'));
const tmpFramework = fs.mkdtempSync(path.join(os.tmpdir(), 'org-test-fw-'));
process.env.CTX_ROOT = tmpState;
process.env.CTX_FRAMEWORK_ROOT = tmpFramework;

let getOrganizationContext: typeof import('../organization')['getOrganizationContext'];
let getBrandVoice: typeof import('../organization')['getBrandVoice'];

beforeAll(async () => {
  const mod = await import('../organization');
  getOrganizationContext = mod.getOrganizationContext;
  getBrandVoice = mod.getBrandVoice;
});

afterAll(() => {
  fs.rmSync(tmpState, { recursive: true, force: true });
  fs.rmSync(tmpFramework, { recursive: true, force: true });
});

function orgDir(org: string) {
  return path.join(tmpFramework, 'orgs', org);
}

// ---------------------------------------------------------------------------
// getOrganizationContext
// ---------------------------------------------------------------------------

describe('getOrganizationContext', () => {
  it('returns defaults when context.json does not exist', () => {
    const result = getOrganizationContext('no-org');
    expect(result).toEqual({ name: '', description: '', industry: '', icp: '', value_prop: '' });
  });

  it('returns defaults when JSON is corrupt', () => {
    const dir = orgDir('bad-org');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'context.json'), 'not json');
    expect(getOrganizationContext('bad-org')).toEqual({ name: '', description: '', industry: '', icp: '', value_prop: '' });
  });

  it('returns parsed context when file is valid', () => {
    const dir = orgDir('glv');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'context.json'), JSON.stringify({
      name: 'GLV Marketing',
      description: 'Full-service digital agency',
      industry: 'marketing',
      icp: 'small business owners',
      value_prop: 'done-for-you AI-powered marketing',
    }));
    const result = getOrganizationContext('glv');
    expect(result.name).toBe('GLV Marketing');
    expect(result.industry).toBe('marketing');
  });

  it('defaults missing fields to empty string', () => {
    const dir = orgDir('partial-org');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'context.json'), JSON.stringify({ name: 'Partial' }));
    const result = getOrganizationContext('partial-org');
    expect(result.name).toBe('Partial');
    expect(result.description).toBe('');
    expect(result.icp).toBe('');
  });
});

// ---------------------------------------------------------------------------
// getBrandVoice
// ---------------------------------------------------------------------------

describe('getBrandVoice', () => {
  it('returns empty string when brand-voice.md does not exist', () => {
    expect(getBrandVoice('no-voice-org')).toBe('');
  });

  it('returns the file contents when present', () => {
    const dir = orgDir('voice-org');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'brand-voice.md'), '# Brand Voice\n\nDirect and friendly.');
    expect(getBrandVoice('voice-org')).toContain('Direct and friendly');
  });
});
