import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Stub node-pty (native addon — unavailable in test sandbox)
vi.mock('node-pty', () => ({
  spawn: vi.fn().mockReturnValue({
    pid: 42,
    write: vi.fn(),
    onData: vi.fn(),
    onExit: vi.fn(),
    kill: vi.fn(),
    resize: vi.fn(),
  }),
}));

const { AgentPTY } = await import('../../../src/pty/agent-pty.js');

type AgentPTYPrivate = {
  getBinaryName(): string;
  buildClaudeArgs(mode: 'fresh' | 'continue', prompt: string): string[];
};

const mockEnv = {
  instanceId: 'test',
  ctxRoot: '/tmp/ctx',
  frameworkRoot: '/tmp/fw',
  agentName: 'test-agent',
  agentDir: '/tmp/fw/orgs/acme/agents/test-agent',
  org: 'acme',
  projectRoot: '/tmp/fw',
};

describe('AgentPTY — pre-spawn state', () => {
  it('isAlive() returns false before spawn', () => {
    const pty = new AgentPTY(mockEnv, {});
    expect(pty.isAlive()).toBe(false);
  });

  it('getPid() returns null before spawn', () => {
    const pty = new AgentPTY(mockEnv, {});
    expect(pty.getPid()).toBeNull();
  });

  it('getOutputBuffer() returns an object with a push method', () => {
    const pty = new AgentPTY(mockEnv, {});
    const buf = pty.getOutputBuffer();
    expect(buf).toBeDefined();
    expect(typeof buf.push).toBe('function');
  });

  it('write() throws when PTY is not spawned', () => {
    const pty = new AgentPTY(mockEnv, {});
    expect(() => pty.write('hello')).toThrow('PTY not spawned');
  });

  it('kill() does not throw when PTY is not spawned', () => {
    const pty = new AgentPTY(mockEnv, {});
    expect(() => pty.kill()).not.toThrow();
  });
});

describe('AgentPTY — getBinaryName', () => {
  it('returns "claude" on Linux (not win32)', () => {
    const pty = new AgentPTY(mockEnv, {});
    expect((pty as unknown as AgentPTYPrivate).getBinaryName()).toBe('claude');
  });
});

describe('AgentPTY — buildClaudeArgs', () => {
  it('fresh mode does not include --continue', () => {
    const pty = new AgentPTY(mockEnv, {});
    const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'do the thing');
    expect(args).not.toContain('--continue');
  });

  it('continue mode includes --continue as first arg', () => {
    const pty = new AgentPTY(mockEnv, {});
    const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('continue', 'do the thing');
    expect(args[0]).toBe('--continue');
  });

  it('always includes --dangerously-skip-permissions', () => {
    const pty = new AgentPTY(mockEnv, {});
    const fresh = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
    const cont = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('continue', 'p');
    expect(fresh).toContain('--dangerously-skip-permissions');
    expect(cont).toContain('--dangerously-skip-permissions');
  });

  it('prompt is always the last argument', () => {
    const pty = new AgentPTY(mockEnv, {});
    const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'my prompt text');
    expect(args[args.length - 1]).toBe('my prompt text');
  });

  it('includes --model and model name when config.model is set', () => {
    const pty = new AgentPTY(mockEnv, { model: 'claude-opus-4-5' });
    const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
    const idx = args.indexOf('--model');
    expect(idx).toBeGreaterThan(-1);
    expect(args[idx + 1]).toBe('claude-opus-4-5');
  });

  it('omits --model when config.model is not set', () => {
    const pty = new AgentPTY(mockEnv, {});
    const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
    expect(args).not.toContain('--model');
  });

  describe('local/ directory injection', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = mkdtempSync(join(tmpdir(), 'ctx-pty-test-'));
    });

    afterEach(() => {
      rmSync(tmpDir, { recursive: true, force: true });
    });

    it('no local/ dir → no --append-system-prompt', () => {
      const pty = new AgentPTY({ ...mockEnv, agentDir: tmpDir }, {});
      const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
      expect(args).not.toContain('--append-system-prompt');
    });

    it('empty local/ dir → no --append-system-prompt', () => {
      mkdirSync(join(tmpDir, 'local'));
      const pty = new AgentPTY({ ...mockEnv, agentDir: tmpDir }, {});
      const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
      expect(args).not.toContain('--append-system-prompt');
    });

    it('local/ with a .md file → --append-system-prompt with file content', () => {
      mkdirSync(join(tmpDir, 'local'));
      writeFileSync(join(tmpDir, 'local', 'rules.md'), '# Rules\n\nBe helpful.');
      const pty = new AgentPTY({ ...mockEnv, agentDir: tmpDir }, {});
      const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
      const idx = args.indexOf('--append-system-prompt');
      expect(idx).toBeGreaterThan(-1);
      expect(args[idx + 1]).toContain('# Rules');
    });

    it('multiple .md files are sorted alphabetically and concatenated', () => {
      mkdirSync(join(tmpDir, 'local'));
      writeFileSync(join(tmpDir, 'local', 'b-second.md'), 'SECOND');
      writeFileSync(join(tmpDir, 'local', 'a-first.md'), 'FIRST');
      const pty = new AgentPTY({ ...mockEnv, agentDir: tmpDir }, {});
      const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
      const idx = args.indexOf('--append-system-prompt');
      expect(idx).toBeGreaterThan(-1);
      const combined = args[idx + 1];
      expect(combined.indexOf('FIRST')).toBeLessThan(combined.indexOf('SECOND'));
    });

    it('non-.md files in local/ are ignored → no --append-system-prompt', () => {
      mkdirSync(join(tmpDir, 'local'));
      writeFileSync(join(tmpDir, 'local', 'notes.txt'), 'plain text');
      writeFileSync(join(tmpDir, 'local', 'config.json'), '{"key":"val"}');
      const pty = new AgentPTY({ ...mockEnv, agentDir: tmpDir }, {});
      const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'p');
      expect(args).not.toContain('--append-system-prompt');
    });

    it('prompt remains last even when --append-system-prompt is present', () => {
      mkdirSync(join(tmpDir, 'local'));
      writeFileSync(join(tmpDir, 'local', 'extra.md'), 'context');
      const pty = new AgentPTY({ ...mockEnv, agentDir: tmpDir }, {});
      const args = (pty as unknown as AgentPTYPrivate).buildClaudeArgs('fresh', 'final-prompt');
      expect(args[args.length - 1]).toBe('final-prompt');
    });
  });
});
