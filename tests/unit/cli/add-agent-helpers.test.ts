/**
 * Unit tests for the four private helper functions in src/cli/add-agent.ts,
 * which were extracted and exported to enable this coverage:
 *
 *   createAgentsMd    — pure string builder; produces AGENTS.md content
 *   findTemplateDir   — scans candidate directories for a named template
 *   copyTemplateFiles — copies + substitutes placeholder files from a template dir
 *   createMinimalAgent — writes the full minimal agent file set from scratch
 *
 * None of these functions touch the CLI layer, so they're unit-testable
 * with tmp directories and no Commander involvement.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync,
  existsSync, readdirSync,
} from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  createAgentsMd,
  findTemplateDir,
  copyTemplateFiles,
  createMinimalAgent,
} from '../../../src/cli/add-agent';

describe('add-agent helper functions', () => {
  let tmpDir: string;
  const origFwRoot = process.env.CTX_FRAMEWORK_ROOT;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'cortextos-add-agent-'));
    delete process.env.CTX_FRAMEWORK_ROOT;
  });

  afterEach(() => {
    if (origFwRoot === undefined) delete process.env.CTX_FRAMEWORK_ROOT;
    else process.env.CTX_FRAMEWORK_ROOT = origFwRoot;
    rmSync(tmpDir, { recursive: true, force: true });
  });

  // ─── createAgentsMd ────────────────────────────────────────────────────────

  describe('createAgentsMd', () => {
    it('sets role to "Agent" for template=agent', () => {
      expect(createAgentsMd('myagent', 'myorg', 'agent')).toContain('# cortextOS Agent');
    });

    it('sets role to "Orchestrator" for template=orchestrator', () => {
      expect(createAgentsMd('boss', 'myorg', 'orchestrator')).toContain('# cortextOS Orchestrator');
    });

    it('sets role to "Analyst" for template=analyst', () => {
      expect(createAgentsMd('scout', 'myorg', 'analyst')).toContain('# cortextOS Analyst');
    });

    it('capitalizes first char of unknown template name', () => {
      expect(createAgentsMd('x', 'y', 'worker')).toContain('# cortextOS Worker');
    });

    it('capitalizes single-char template name', () => {
      expect(createAgentsMd('x', 'y', 'a')).toContain('# cortextOS A');
    });

    it('contains the BOOTSTRAP PROTOCOL section header', () => {
      expect(createAgentsMd('x', 'y', 'agent'))
        .toContain('## BOOTSTRAP PROTOCOL - READ EVERY FILE BEFORE DOING ANYTHING');
    });

    it('lists IDENTITY.md as step 1', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('1. IDENTITY.md');
    });

    it('lists USER.md as step 10', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('10. USER.md');
    });

    it('lists all 10 bootstrap steps (1 through 10)', () => {
      const out = createAgentsMd('x', 'y', 'agent');
      for (let i = 1; i <= 10; i++) {
        expect(out).toContain(`${i}.`);
      }
    });

    it('contains the Bus Commands section', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('## Bus Commands');
    });

    it('contains send-message bus command', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('cortextos bus send-message');
    });

    it('contains check-inbox bus command', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('cortextos bus check-inbox');
    });

    it('contains update-heartbeat bus command', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('cortextos bus update-heartbeat');
    });

    it('contains send-telegram bus command', () => {
      expect(createAgentsMd('x', 'y', 'agent')).toContain('cortextos bus send-telegram');
    });

    it('returns a non-empty string for any inputs', () => {
      const out = createAgentsMd('', '', '');
      expect(typeof out).toBe('string');
      expect(out.length).toBeGreaterThan(0);
    });
  });

  // ─── findTemplateDir ───────────────────────────────────────────────────────

  describe('findTemplateDir', () => {
    it('returns null when template does not exist in any candidate directory', () => {
      // tmpDir has no templates/; unique name avoids the real __dirname-based candidate
      expect(findTemplateDir(tmpDir, 'zzz-does-not-exist-xyz-abc')).toBeNull();
    });

    it('finds template at join(projectRoot, "templates", template)', () => {
      const tplName = 'zzz-test-tpl-unique';
      const tplDir = join(tmpDir, 'templates', tplName);
      mkdirSync(tplDir, { recursive: true });
      expect(findTemplateDir(tmpDir, tplName)).toBe(tplDir);
    });

    it('finds template via CTX_FRAMEWORK_ROOT when projectRoot lacks it', () => {
      const fwRoot = join(tmpDir, 'fw');
      const tplName = 'zzz-fw-test-tpl';
      const tplDir = join(fwRoot, 'templates', tplName);
      mkdirSync(tplDir, { recursive: true });
      process.env.CTX_FRAMEWORK_ROOT = fwRoot;
      // tmpDir has no templates/ → candidate 1 misses; CTX_FRAMEWORK_ROOT candidate 2 hits
      expect(findTemplateDir(tmpDir, tplName)).toBe(tplDir);
    });

    it('returns projectRoot candidate when both projectRoot and CTX_FRAMEWORK_ROOT have it', () => {
      const fwRoot = join(tmpDir, 'fw');
      const tplName = 'zzz-both-tpl';
      const projTplDir = join(tmpDir, 'templates', tplName);
      const fwTplDir = join(fwRoot, 'templates', tplName);
      mkdirSync(projTplDir, { recursive: true });
      mkdirSync(fwTplDir, { recursive: true });
      process.env.CTX_FRAMEWORK_ROOT = fwRoot;
      // Candidate 1 (projectRoot) is checked before candidate 2 (frameworkRoot)
      expect(findTemplateDir(tmpDir, tplName)).toBe(projTplDir);
    });

    it('when CTX_FRAMEWORK_ROOT is unset, frameworkRoot equals projectRoot', () => {
      const tplName = 'zzz-same-root-tpl';
      const tplDir = join(tmpDir, 'templates', tplName);
      mkdirSync(tplDir, { recursive: true });
      // With no env var set both candidate 1 and 2 resolve to the same path
      expect(findTemplateDir(tmpDir, tplName)).toBe(tplDir);
    });
  });

  // ─── copyTemplateFiles ─────────────────────────────────────────────────────

  describe('copyTemplateFiles', () => {
    let srcDir: string;
    let destDir: string;

    beforeEach(() => {
      srcDir = join(tmpDir, 'src');
      destDir = join(tmpDir, 'dest');
      mkdirSync(srcDir, { recursive: true });
      mkdirSync(destDir, { recursive: true });
    });

    it('does nothing when template directory is empty', () => {
      copyTemplateFiles(srcDir, destDir, 'agent', 'org');
      expect(readdirSync(destDir)).toHaveLength(0);
    });

    it('copies a plain file with no placeholders unchanged', () => {
      writeFileSync(join(srcDir, 'README.md'), 'hello world');
      copyTemplateFiles(srcDir, destDir, 'any', 'org');
      expect(readFileSync(join(destDir, 'README.md'), 'utf-8')).toBe('hello world');
    });

    it('replaces {{agent_name}} placeholder', () => {
      writeFileSync(join(srcDir, 'IDENTITY.md'), 'Name: {{agent_name}}');
      copyTemplateFiles(srcDir, destDir, 'mybot', 'org');
      expect(readFileSync(join(destDir, 'IDENTITY.md'), 'utf-8')).toBe('Name: mybot');
    });

    it('replaces {{org}} placeholder', () => {
      writeFileSync(join(srcDir, 'SYSTEM.md'), 'Org: {{org}}');
      copyTemplateFiles(srcDir, destDir, 'agent', 'acme');
      expect(readFileSync(join(destDir, 'SYSTEM.md'), 'utf-8')).toBe('Org: acme');
    });

    it('replaces {{current_timestamp}} with ISO string without milliseconds', () => {
      writeFileSync(join(srcDir, 'meta.md'), 'Created: {{current_timestamp}}');
      const before = Math.floor(Date.now() / 1000) * 1000;
      copyTemplateFiles(srcDir, destDir, 'a', 'b');
      const after = Math.ceil(Date.now() / 1000) * 1000;
      const out = readFileSync(join(destDir, 'meta.md'), 'utf-8');
      const ts = out.replace('Created: ', '');
      // Must match YYYY-MM-DDTHH:MM:SSZ — no milliseconds component
      expect(ts).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      expect(new Date(ts).getTime()).toBeGreaterThanOrEqual(before);
      expect(new Date(ts).getTime()).toBeLessThanOrEqual(after);
    });

    it('globally replaces all occurrences of {{agent_name}}', () => {
      writeFileSync(join(srcDir, 'f.md'), '{{agent_name}} and {{agent_name}}');
      copyTemplateFiles(srcDir, destDir, 'hal', 'org');
      expect(readFileSync(join(destDir, 'f.md'), 'utf-8')).toBe('hal and hal');
    });

    it('skips the node_modules directory', () => {
      const nmDir = join(srcDir, 'node_modules');
      mkdirSync(nmDir, { recursive: true });
      writeFileSync(join(nmDir, 'ignored.js'), 'secret');
      copyTemplateFiles(srcDir, destDir, 'a', 'b');
      expect(existsSync(join(destDir, 'node_modules'))).toBe(false);
    });

    it('recurses into non-node_modules subdirectory', () => {
      const subSrc = join(srcDir, 'subdir');
      mkdirSync(subSrc, { recursive: true });
      writeFileSync(join(subSrc, 'inner.md'), 'nested content');
      copyTemplateFiles(srcDir, destDir, 'a', 'b');
      expect(readFileSync(join(destDir, 'subdir', 'inner.md'), 'utf-8')).toBe('nested content');
    });

    it('copies multiple files in one pass', () => {
      writeFileSync(join(srcDir, 'A.md'), 'aaa');
      writeFileSync(join(srcDir, 'B.md'), 'bbb');
      writeFileSync(join(srcDir, 'C.md'), 'ccc');
      copyTemplateFiles(srcDir, destDir, 'x', 'y');
      expect(readFileSync(join(destDir, 'A.md'), 'utf-8')).toBe('aaa');
      expect(readFileSync(join(destDir, 'B.md'), 'utf-8')).toBe('bbb');
      expect(readFileSync(join(destDir, 'C.md'), 'utf-8')).toBe('ccc');
    });
  });

  // ─── createMinimalAgent ────────────────────────────────────────────────────

  describe('createMinimalAgent', () => {
    let agentDir: string;

    beforeEach(() => {
      agentDir = join(tmpDir, 'agent');
      mkdirSync(agentDir, { recursive: true });
    });

    it('IDENTITY.md uses "Agent" role for template=agent', () => {
      createMinimalAgent(agentDir, 'hal', 'myorg', 'agent');
      expect(readFileSync(join(agentDir, 'IDENTITY.md'), 'utf-8')).toContain('a Agent');
    });

    it('IDENTITY.md uses "Orchestrator" role for template=orchestrator', () => {
      createMinimalAgent(agentDir, 'boss', 'myorg', 'orchestrator');
      expect(readFileSync(join(agentDir, 'IDENTITY.md'), 'utf-8')).toContain('Orchestrator');
    });

    it('IDENTITY.md uses "Analyst" role for template=analyst', () => {
      createMinimalAgent(agentDir, 'scout', 'myorg', 'analyst');
      expect(readFileSync(join(agentDir, 'IDENTITY.md'), 'utf-8')).toContain('Analyst');
    });

    it('IDENTITY.md contains both agent name and org', () => {
      createMinimalAgent(agentDir, 'sentinel', 'acmecorp', 'agent');
      const content = readFileSync(join(agentDir, 'IDENTITY.md'), 'utf-8');
      expect(content).toContain('sentinel');
      expect(content).toContain('acmecorp');
    });

    it('creates SOUL.md with non-empty content', () => {
      createMinimalAgent(agentDir, 'a', 'b', 'agent');
      expect(existsSync(join(agentDir, 'SOUL.md'))).toBe(true);
      expect(readFileSync(join(agentDir, 'SOUL.md'), 'utf-8')).toContain('Soul');
    });

    it('CLAUDE.md contains @AGENTS.md import', () => {
      createMinimalAgent(agentDir, 'a', 'b', 'agent');
      expect(readFileSync(join(agentDir, 'CLAUDE.md'), 'utf-8')).toContain('@AGENTS.md');
    });

    it('AGENTS.md role heading matches the template argument', () => {
      createMinimalAgent(agentDir, 'x', 'y', 'orchestrator');
      expect(readFileSync(join(agentDir, 'AGENTS.md'), 'utf-8'))
        .toContain('# cortextOS Orchestrator');
    });

    it('SYSTEM.md contains the org name', () => {
      createMinimalAgent(agentDir, 'a', 'testorg', 'agent');
      expect(readFileSync(join(agentDir, 'SYSTEM.md'), 'utf-8')).toContain('testorg');
    });
  });
});
