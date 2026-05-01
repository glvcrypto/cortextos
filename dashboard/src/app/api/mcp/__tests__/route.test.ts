import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFrameworkRoot } from '@/lib/config';

import { GET, POST, DELETE } from '../route';

const fw = getFrameworkRoot();
const org = 'glv';
const agentName = '__test_mcp_agent__';
const agentDir = path.join(fw, 'orgs', org, 'agents', agentName);
const mcpPath = path.join(agentDir, '.mcp.json');

function makePostReq(body: unknown) {
  return new NextRequest('http://localhost/api/mcp', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function makeDeleteReq(body: unknown) {
  return new NextRequest('http://localhost/api/mcp', {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

afterEach(() => {
  if (fs.existsSync(mcpPath)) fs.unlinkSync(mcpPath);
  // Clean up agent dir only if we created it and it's empty
  try {
    if (fs.existsSync(agentDir) && fs.readdirSync(agentDir).length === 0) {
      fs.rmdirSync(agentDir);
    }
  } catch { /* ignore */ }
});

// ---------------------------------------------------------------------------
// GET /api/mcp
// ---------------------------------------------------------------------------

describe('GET /api/mcp', () => {
  it('returns list including agent with no .mcp.json (empty servers array)', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    const entry = body.find((c: { agent: string }) => c.agent === agentName);
    expect(entry).toBeTruthy();
    expect(entry.servers).toEqual([]);
    expect(entry.filePath).toBeNull();
  });

  it('returns parsed servers from .mcp.json', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(mcpPath, JSON.stringify({
      'slack': { type: 'http', url: 'https://mcp.slack.com/mcp', enabled: true },
    }, null, 2));
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    const entry = body.find((c: { agent: string }) => c.agent === agentName);
    expect(entry.servers).toHaveLength(1);
    expect(entry.servers[0].name).toBe('slack');
    expect(entry.servers[0].url).toBe('https://mcp.slack.com/mcp');
    expect(entry.filePath).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// POST /api/mcp
// ---------------------------------------------------------------------------

describe('POST /api/mcp', () => {
  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/mcp', {
      method: 'POST', body: 'bad', headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makePostReq({ org, agent: agentName }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/missing required/i);
  });

  it('writes .mcp.json and returns ok', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const config = { type: 'http', url: 'https://example.com/mcp', enabled: true };
    const res = await POST(makePostReq({ org, agent: agentName, name: 'example', config }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    const saved = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    expect(saved.example).toMatchObject(config);
  });

  it('merges new server into existing .mcp.json', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(mcpPath, JSON.stringify({ existing: { type: 'stdio' } }));
    await POST(makePostReq({ org, agent: agentName, name: 'new-server', config: { type: 'http', url: 'https://x.com' } }));
    const saved = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    expect(Object.keys(saved)).toHaveLength(2);
    expect(saved['new-server']).toBeTruthy();
    expect(saved.existing).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/mcp
// ---------------------------------------------------------------------------

describe('DELETE /api/mcp', () => {
  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/mcp', {
      method: 'DELETE', body: 'bad', headers: { 'content-type': 'application/json' },
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await DELETE(makeDeleteReq({ org, agent: agentName }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/missing required/i);
  });

  it('returns 404 when .mcp.json does not exist', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    const res = await DELETE(makeDeleteReq({ org, agent: agentName, name: 'ghost' }));
    expect(res.status).toBe(404);
  });

  it('removes server and returns ok, deletes file when empty', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(mcpPath, JSON.stringify({ only: { type: 'stdio' } }));
    const res = await DELETE(makeDeleteReq({ org, agent: agentName, name: 'only' }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    // File removed because no servers remain
    expect(fs.existsSync(mcpPath)).toBe(false);
  });

  it('removes one server while keeping others', async () => {
    fs.mkdirSync(agentDir, { recursive: true });
    fs.writeFileSync(mcpPath, JSON.stringify({ a: { type: 'stdio' }, b: { type: 'http' } }));
    const res = await DELETE(makeDeleteReq({ org, agent: agentName, name: 'a' }));
    expect(res.status).toBe(200);
    const saved = JSON.parse(fs.readFileSync(mcpPath, 'utf-8'));
    expect(Object.keys(saved)).toEqual(['b']);
  });
});
