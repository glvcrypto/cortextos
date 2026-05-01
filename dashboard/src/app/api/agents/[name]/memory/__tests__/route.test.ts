import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFrameworkRoot, getAgentDir } from '@/lib/config';

import { GET } from '../route';

function makeParams(name: string) {
  return { params: Promise.resolve({ name }) };
}

function makeReq(name: string, searchParams?: Record<string, string>) {
  const url = new URL(`http://localhost/api/agents/${name}/memory`);
  if (searchParams) Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString());
}

const fw = getFrameworkRoot();
const org = 'glv';
const agentName = 'test-agent-memory';

// Route uses process.env.CTX_FRAMEWORK_ROOT ?? homedir() for path resolution
// getAgentDir returns fw/orgs/<org>/agents/<name>
const agentDir = path.join(fw, 'orgs', org, 'agents', agentName);
const memoryMd = path.join(agentDir, 'MEMORY.md');

afterEach(() => {
  if (fs.existsSync(memoryMd)) fs.unlinkSync(memoryMd);
});

// ---------------------------------------------------------------------------
// GET /api/agents/[name]/memory — no path param (returns MEMORY.md)
// ---------------------------------------------------------------------------

describe('GET /api/agents/[name]/memory — no path param', () => {
  it('returns empty string when MEMORY.md does not exist', async () => {
    const res = await GET(makeReq(agentName), makeParams(agentName));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('');
  });

  it('returns MEMORY.md content when file exists', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(memoryMd, '# Memory\n\nSome notes here.\n');
    const res = await GET(makeReq(agentName), makeParams(agentName));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('Some notes here.');
  });
});

// ---------------------------------------------------------------------------
// GET /api/agents/[name]/memory?path=... — explicit file path
// ---------------------------------------------------------------------------

describe('GET /api/agents/[name]/memory — with path param', () => {
  it('returns 400 when file does not end with .md', async () => {
    const res = await GET(makeReq(agentName, { path: 'config.json', org }), makeParams(agentName));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid file path/i);
  });

  it('returns 403 for path traversal attempt', async () => {
    // The route resolves CTX_FRAMEWORK_ROOT/orgs/<org>/agents/<name> as base
    // A traversal like ../../../etc/passwd.md would escape the agentDir
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await GET(makeReq(agentName, { path: '../../../evil.md', org }), makeParams(agentName));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toMatch(/forbidden/i);
  });

  it('returns empty string when file not found within agent dir', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await GET(makeReq(agentName, { path: 'memory/2026-05-01.md', org }), makeParams(agentName));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('');
  });

  it('returns file content when path is valid and within agent dir', async () => {
    const memDir = path.join(agentDir, 'memory');
    fs.mkdirSync(memDir, { recursive: true });
    const dailyFile = path.join(memDir, '2026-04-30.md');
    fs.writeFileSync(dailyFile, '# Daily notes\nWorked on batch 6.\n');
    try {
      const res = await GET(makeReq(agentName, { path: 'memory/2026-04-30.md', org }), makeParams(agentName));
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('Worked on batch 6.');
    } finally {
      fs.unlinkSync(dailyFile);
    }
  });
});
