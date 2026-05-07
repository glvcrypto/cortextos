import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Path-aware fs mocks. existsSync is the one we actually drive per-test:
// it returns true for any path EXCEPT the MMRAG_CONFIG one (when the test
// wants to simulate a missing config) so loadSecretsEnv and other path
// lookups still work normally inside the module under test.
const fsMocks = {
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  mkdirSync: vi.fn(),
};

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: (...args: Parameters<typeof fsMocks.existsSync>) => fsMocks.existsSync(...args),
    readFileSync: (...args: Parameters<typeof fsMocks.readFileSync>) => fsMocks.readFileSync(...args),
    mkdirSync: (...args: Parameters<typeof fsMocks.mkdirSync>) => fsMocks.mkdirSync(...args),
  };
});

// Mock execFileSync so we can assert whether it was called (and optionally
// simulate a successful python response).
const execFileSyncMock = vi.fn();
vi.mock('child_process', async () => {
  const actual = await vi.importActual<typeof import('child_process')>('child_process');
  return {
    ...actual,
    execFileSync: (...args: unknown[]) => execFileSyncMock(...args),
  };
});

// Mock normalizeOrgName to a passthrough identity — we are not testing org
// normalization here, that has its own dedicated test file.
vi.mock('../../../src/utils/org.js', () => ({
  normalizeOrgName: (_root: string, org: string) => org,
}));

const { queryKnowledgeBase, ingestKnowledgeBase, ensureKBDirs } = await import('../../../src/bus/knowledge-base.js');

// Minimal BusPaths stub — knowledge-base.ts doesn't actually USE the paths
// object at call time, just the options/env it constructs.
const dummyPaths = {
  stateDir: '/tmp/agent/state',
  logDir: '/tmp/agent/logs',
  ctxRoot: '/tmp/agent',
  instanceId: 'test',
  agentName: 'tester',
  org: 'TestOrg',
  inboxDir: '/tmp/agent/inbox',
  inflightDir: '/tmp/agent/inflight',
  processedDir: '/tmp/agent/processed',
  outboxDir: '/tmp/agent/outbox',
} as any;

const baseOptions = {
  org: 'TestOrg',
  agent: 'tester',
  frameworkRoot: '/home/test/cortextOS',
  instanceId: 'test',
};

let warnLog: string[] = [];
let originalWarn: typeof console.warn;
let logLog: string[] = [];
let originalLog: typeof console.log;

beforeEach(() => {
  fsMocks.existsSync.mockReset();
  fsMocks.readFileSync.mockReset().mockReturnValue('');
  fsMocks.mkdirSync.mockReset();
  execFileSyncMock.mockReset();

  warnLog = [];
  logLog = [];
  originalWarn = console.warn;
  originalLog = console.log;
  console.warn = (...args: unknown[]) => {
    warnLog.push(args.map((a) => String(a)).join(' '));
  };
  console.log = (...args: unknown[]) => {
    logLog.push(args.map((a) => String(a)).join(' '));
  };
});

afterEach(() => {
  console.warn = originalWarn;
  console.log = originalLog;
});

/**
 * Helper: make existsSync return false ONLY for paths that end with
 * knowledge-base/config.json (i.e. the MMRAG_CONFIG file), true for everything
 * else. Simulates a freshly-created agent with no KB configured yet.
 */
function mockMissingKbConfig(): void {
  fsMocks.existsSync.mockImplementation((p: any) => {
    const path = String(p);
    if (path.endsWith('/knowledge-base/config.json')) return false;
    return true;
  });
}

/**
 * Helper: make existsSync return true for everything, simulating a fully
 * configured KB with config.json present on disk.
 */
function mockConfiguredKb(): void {
  fsMocks.existsSync.mockImplementation(() => true);
}

describe('ingestKnowledgeBase — graceful missing-config', () => {
  it('missing config: warn + return cleanly, execFileSync NEVER called', () => {
    mockMissingKbConfig();

    // Must NOT throw. Previously this path threw an unhandled execFileSync
    // error that dumped a Node stack trace on top of the python stderr.
    expect(() =>
      ingestKnowledgeBase(['/some/file.md'], baseOptions),
    ).not.toThrow();

    expect(execFileSyncMock).not.toHaveBeenCalled();
    // Warn must include the org name AND an actionable hint ("run setup").
    expect(warnLog.some((m) => m.includes('TestOrg') && /run setup/i.test(m))).toBe(true);
    // Warn must carry the [kb] prefix so operators can filter log lines.
    expect(warnLog.some((m) => m.includes('[kb]'))).toBe(true);
  });

  it('config present: execFileSync IS called with the mmrag ingest args', () => {
    mockConfiguredKb();
    execFileSyncMock.mockReturnValue('');

    ingestKnowledgeBase(['/some/file.md'], baseOptions);

    expect(execFileSyncMock).toHaveBeenCalledTimes(1);
    // First positional arg is the python path, second is the argv array.
    const [pythonPath, argv] = execFileSyncMock.mock.calls[0] as [string, string[], object];
    expect(String(pythonPath)).toMatch(/python/);
    expect(argv).toEqual(expect.arrayContaining(['ingest', '/some/file.md']));
    // Happy path emits no [kb] warning.
    expect(warnLog.filter((m) => m.includes('[kb]'))).toHaveLength(0);
  });
});

describe('queryKnowledgeBase — graceful missing-config', () => {
  it('missing config: warn + return empty KBQueryResponse, execFileSync NEVER called', () => {
    mockMissingKbConfig();

    const result = queryKnowledgeBase(dummyPaths, 'what is cortextos?', baseOptions);

    expect(execFileSyncMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      results: [],
      total: 0,
      query: 'what is cortextos?',
      collection: 'shared-TestOrg',
    });
    expect(warnLog.some((m) => m.includes('TestOrg') && /run setup/i.test(m))).toBe(true);
    expect(warnLog.some((m) => m.includes('[kb]'))).toBe(true);
  });

  it('config present: execFileSync IS called, happy-path query returns results', () => {
    mockConfiguredKb();
    // Mock mmrag.py --json output: a JSON blob with one result.
    execFileSyncMock.mockReturnValue(
      JSON.stringify({
        results: [
          { content: 'hit', similarity: 0.9, source: 'foo.md', type: 'markdown' },
        ],
      }),
    );

    const result = queryKnowledgeBase(dummyPaths, 'test query', baseOptions);

    expect(execFileSyncMock).toHaveBeenCalled();
    expect(result.total).toBeGreaterThan(0);
    expect(result.results[0].content).toBe('hit');
    // Happy path emits no [kb] warning.
    expect(warnLog.filter((m) => m.includes('[kb]'))).toHaveLength(0);
  });
});

describe('kb warn messages — UX invariants', () => {
  it('both warn messages name the org and suggest "run setup"', () => {
    // Drive ingest path
    mockMissingKbConfig();
    ingestKnowledgeBase(['/f.md'], { ...baseOptions, org: 'SpecificOrg' });
    // Drive query path
    mockMissingKbConfig();
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, org: 'SpecificOrg' });

    // At least one warn per call site, each containing the org name + hint
    const specificOrgWarns = warnLog.filter((m) => m.includes('SpecificOrg'));
    expect(specificOrgWarns.length).toBeGreaterThanOrEqual(2);
    expect(specificOrgWarns.every((m) => /run setup/i.test(m))).toBe(true);
  });
});

describe('queryKnowledgeBase — scope routing', () => {
  beforeEach(() => {
    mockConfiguredKb();
    execFileSyncMock.mockReturnValue(JSON.stringify({ results: [] }));
  });

  it('scope=shared queries only the shared-<org> collection', () => {
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(execFileSyncMock).toHaveBeenCalledTimes(1);
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).toContain('shared-TestOrg');
  });

  it('scope=private with agent queries only the agent-<agent> collection', () => {
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'private', agent: 'tester' });
    expect(execFileSyncMock).toHaveBeenCalledTimes(1);
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).toContain('agent-tester');
    expect(argv).not.toContain('shared-TestOrg');
  });

  it('scope=private without agent falls back to shared-<org>', () => {
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'private', agent: undefined });
    expect(execFileSyncMock).toHaveBeenCalledTimes(1);
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).toContain('shared-TestOrg');
    expect(argv).not.toContain('agent-');
  });

  it('scope=all with agent queries both shared and agent collections', () => {
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'all', agent: 'tester' });
    expect(execFileSyncMock).toHaveBeenCalledTimes(2);
    const allArgvs = execFileSyncMock.mock.calls.map(([, argv]) => argv as string[]);
    expect(allArgvs.some((a) => a.includes('shared-TestOrg'))).toBe(true);
    expect(allArgvs.some((a) => a.includes('agent-tester'))).toBe(true);
  });

  it('scope=all without agent queries only the shared collection', () => {
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'all', agent: undefined });
    expect(execFileSyncMock).toHaveBeenCalledTimes(1);
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).toContain('shared-TestOrg');
  });

  it('passes --top-k and --threshold options through to execFileSync', () => {
    queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, topK: 3, threshold: 0.75 });
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    const topKIdx = argv.indexOf('--top-k');
    const threshIdx = argv.indexOf('--threshold');
    expect(topKIdx).toBeGreaterThan(-1);
    expect(argv[topKIdx + 1]).toBe('3');
    expect(threshIdx).toBeGreaterThan(-1);
    expect(argv[threshIdx + 1]).toBe('0.75');
  });
});

describe('queryKnowledgeBase — result merging + parseOutput edge cases', () => {
  beforeEach(() => mockConfiguredKb());

  it('merges results from both collections when scope=all with agent', () => {
    execFileSyncMock
      .mockReturnValueOnce(JSON.stringify({ results: [{ content: 'shared-hit', similarity: 0.8, source: 's.md', type: 'markdown' }] }))
      .mockReturnValueOnce(JSON.stringify({ results: [{ content: 'agent-hit', similarity: 0.7, source: 'a.md', type: 'markdown' }] }));

    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'all', agent: 'tester' });
    expect(result.total).toBe(2);
    expect(result.results.map((r) => r.content)).toEqual(expect.arrayContaining(['shared-hit', 'agent-hit']));
  });

  it('falls back to r.result when r.content is absent', () => {
    execFileSyncMock.mockReturnValue(
      JSON.stringify({ results: [{ result: 'fallback-content', similarity: 0.6, source: 'f.md', type: 'doc' }] }),
    );
    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(result.results[0].content).toBe('fallback-content');
  });

  it('parses output that has a preamble before the opening { of the JSON block', () => {
    execFileSyncMock.mockReturnValue(
      'Python verbose preamble\n{"results":[{"content":"ok","similarity":0.5,"source":"x.md","type":"markdown"}]}',
    );
    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(result.results).toHaveLength(1);
    expect(result.results[0].content).toBe('ok');
  });

  it('returns empty when execFileSync throws (python crash)', () => {
    execFileSyncMock.mockImplementation(() => { throw new Error('python error'); });
    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(result.results).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('returns empty when output has no JSON block at all', () => {
    execFileSyncMock.mockReturnValue('no json here');
    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(result.results).toEqual([]);
  });

  it('returns empty when JSON is malformed', () => {
    execFileSyncMock.mockReturnValue('{not: valid json}');
    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(result.results).toEqual([]);
  });

  it('sets score to 0 when similarity is absent from result', () => {
    execFileSyncMock.mockReturnValue(
      JSON.stringify({ results: [{ content: 'no-sim', source: 'z.md', type: 'markdown' }] }),
    );
    const result = queryKnowledgeBase(dummyPaths, 'q', { ...baseOptions, scope: 'shared' });
    expect(result.results[0].score).toBe(0);
  });
});

describe('ingestKnowledgeBase — extended', () => {
  it('scope=private without agent throws an error', () => {
    mockConfiguredKb();
    expect(() =>
      ingestKnowledgeBase(['/f.md'], { ...baseOptions, scope: 'private', agent: undefined }),
    ).toThrow(/agent.*required/i);
    expect(execFileSyncMock).not.toHaveBeenCalled();
  });

  it('scope=private with agent uses agent-<agent> collection', () => {
    mockConfiguredKb();
    execFileSyncMock.mockReturnValue('');
    ingestKnowledgeBase(['/f.md'], { ...baseOptions, scope: 'private', agent: 'mybot' });
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).toContain('agent-mybot');
    expect(argv).not.toContain('shared-');
  });

  it('passes --force when force=true', () => {
    mockConfiguredKb();
    execFileSyncMock.mockReturnValue('');
    ingestKnowledgeBase(['/f.md'], { ...baseOptions, force: true });
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).toContain('--force');
  });

  it('does NOT include --force when force is unset', () => {
    mockConfiguredKb();
    execFileSyncMock.mockReturnValue('');
    ingestKnowledgeBase(['/f.md'], baseOptions);
    const argv = execFileSyncMock.mock.calls[0][1] as string[];
    expect(argv).not.toContain('--force');
  });

  it('creates the chromadb directory when it does not exist', () => {
    fsMocks.existsSync.mockImplementation((p: unknown) => {
      return !String(p).endsWith('/chromadb');
    });
    execFileSyncMock.mockReturnValue('');
    ingestKnowledgeBase(['/f.md'], baseOptions);
    expect(fsMocks.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('chromadb'),
      { recursive: true },
    );
  });

  it('does NOT call mkdirSync when chromadb directory already exists', () => {
    mockConfiguredKb();
    execFileSyncMock.mockReturnValue('');
    ingestKnowledgeBase(['/f.md'], baseOptions);
    expect(fsMocks.mkdirSync).not.toHaveBeenCalled();
  });
});

describe('ensureKBDirs', () => {
  it('creates the chromadb directory when missing', () => {
    fsMocks.existsSync.mockReturnValue(false);
    ensureKBDirs('test-instance', '/home/test/cortextOS', 'TestOrg');
    expect(fsMocks.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('chromadb'),
      { recursive: true },
    );
  });

  it('does NOT call mkdirSync when chromadb directory is already present', () => {
    fsMocks.existsSync.mockReturnValue(true);
    ensureKBDirs('test-instance', '/home/test/cortextOS', 'TestOrg');
    expect(fsMocks.mkdirSync).not.toHaveBeenCalled();
  });
});

describe('loadSecretsEnv — via queryKnowledgeBase env passthrough', () => {
  beforeEach(() => mockConfiguredKb());

  it('strips double-quoted values from .env key=value pairs', () => {
    fsMocks.readFileSync.mockImplementation((p: unknown) => {
      if (String(p).endsWith('.env')) return 'MY_KEY="my-value"\n';
      return '';
    });
    execFileSyncMock.mockReturnValue(JSON.stringify({ results: [] }));
    queryKnowledgeBase(dummyPaths, 'q', baseOptions);
    const opts = execFileSyncMock.mock.calls[0][2] as { env: Record<string, string> };
    expect(opts.env.MY_KEY).toBe('my-value');
  });

  it('strips single-quoted values from .env key=value pairs', () => {
    fsMocks.readFileSync.mockImplementation((p: unknown) => {
      if (String(p).endsWith('.env')) return "MY_KEY='my-value'\n";
      return '';
    });
    execFileSyncMock.mockReturnValue(JSON.stringify({ results: [] }));
    queryKnowledgeBase(dummyPaths, 'q', baseOptions);
    const opts = execFileSyncMock.mock.calls[0][2] as { env: Record<string, string> };
    expect(opts.env.MY_KEY).toBe('my-value');
  });

  it('skips comment lines and empty lines in .env files', () => {
    fsMocks.readFileSync.mockImplementation((p: unknown) => {
      if (String(p).endsWith('.env')) return '# comment line\n\nVALID_KEY=hello\n';
      return '';
    });
    execFileSyncMock.mockReturnValue(JSON.stringify({ results: [] }));
    queryKnowledgeBase(dummyPaths, 'q', baseOptions);
    const opts = execFileSyncMock.mock.calls[0][2] as { env: Record<string, string> };
    expect(opts.env.VALID_KEY).toBe('hello');
    expect(Object.keys(opts.env)).not.toContain('# comment line');
    expect(Object.keys(opts.env)).not.toContain('');
  });
});
