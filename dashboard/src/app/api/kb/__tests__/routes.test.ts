import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Mock execFileSync — Python subprocess calls can't run in CI/test without a
// real venv. The factory wraps the mock fn so the hoisting TDZ is avoided.
// ---------------------------------------------------------------------------
const execFileSyncMock = vi.fn<(...args: unknown[]) => string>(() => '');
vi.mock('child_process', async () => {
  const actual = await vi.importActual<typeof import('child_process')>('child_process');
  return {
    ...actual,
    execFileSync: (...args: unknown[]) => execFileSyncMock(...args),
  };
});

// ---------------------------------------------------------------------------
// Set env vars BEFORE any module is imported so getCTXRoot() / getFrameworkRoot()
// read the right paths at module-load time.
// ---------------------------------------------------------------------------
const ctxTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-ctx-'));
const fwTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kb-fw-'));
process.env.CTX_ROOT = ctxTmp;
process.env.CTX_FRAMEWORK_ROOT = fwTmp;
delete process.env.GEMINI_API_KEY;

const INSTANCE_ID = path.basename(ctxTmp);

type SearchRoute = typeof import('../search/route');
type KnowledgeSearchRoute = typeof import('../../knowledge/search/route');

let search: SearchRoute;
let knowledgeSearch: KnowledgeSearchRoute;

beforeAll(async () => {
  search = await import('../search/route');
  knowledgeSearch = await import('../../knowledge/search/route');
});

afterAll(() => {
  fs.rmSync(ctxTmp, { recursive: true, force: true });
  fs.rmSync(fwTmp, { recursive: true, force: true });
  const kbBase = path.join(os.homedir(), '.cortextos', INSTANCE_ID);
  if (fs.existsSync(kbBase)) fs.rmSync(kbBase, { recursive: true, force: true });
  delete process.env.GEMINI_API_KEY;
});

beforeEach(() => {
  execFileSyncMock.mockReset().mockReturnValue('');
  const venv = path.join(fwTmp, 'knowledge-base', 'venv');
  if (fs.existsSync(venv)) fs.rmSync(venv, { recursive: true, force: true });
  const kbBase = path.join(os.homedir(), '.cortextos', INSTANCE_ID);
  if (fs.existsSync(kbBase)) fs.rmSync(kbBase, { recursive: true, force: true });
});

function makeReq(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'));
}

// ---------------------------------------------------------------------------
// GET /api/kb/search
// ---------------------------------------------------------------------------
describe('GET /api/kb/search', () => {
  it('returns 400 for invalid org characters', async () => {
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=BAD+ORG&q=test'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/invalid org/i);
  });

  it('returns 400 for invalid agent characters', async () => {
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&agent=BAD!&q=test'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/invalid agent/i);
  });

  it('returns 400 when query exceeds 500 characters', async () => {
    const q = 'a'.repeat(501);
    const res = await search.GET(makeReq(`http://localhost/api/kb/search?org=glv&q=${q}`));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/too long/i);
  });

  it('returns 400 when q is empty', async () => {
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&q='));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/q parameter required/i);
  });

  it('returns 400 for invalid scope value', async () => {
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&q=test&scope=bad'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/scope/i);
  });

  it('returns 400 when limit is out of range', async () => {
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&q=test&limit=51'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/limit/i);
  });

  it('returns 400 when threshold is out of range', async () => {
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&q=test&threshold=1.5'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/threshold/i);
  });

  it('returns 503 when GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&q=test+query'));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(String(data.error)).toMatch(/GEMINI_API_KEY/i);
  });

  it('returns empty results when venv is not installed', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const res = await search.GET(makeReq('http://localhost/api/kb/search?org=glv&q=test+query'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.results).toEqual([]);
    expect(data.total).toBe(0);
    delete process.env.GEMINI_API_KEY;
  });
});

// ---------------------------------------------------------------------------
// GET /api/knowledge/search — backwards-compat alias for /api/kb/search
// ---------------------------------------------------------------------------
describe('GET /api/knowledge/search', () => {
  it('exports the same GET handler as /api/kb/search', () => {
    expect(knowledgeSearch.GET).toBe(search.GET);
  });
});
