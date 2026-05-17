import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot, getFrameworkRoot } from '@/lib/config';

// vi.hoisted ensures mockSend is available when the vi.mock factory runs (before imports)
const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

// Mock IPCClient with a real class so `new IPCClient()` works in the route
vi.mock('@/lib/ipc-client', () => ({
  IPCClient: class MockIPCClient {
    send = mockSend;
  },
}));

import { POST, DELETE } from '../route';

const ctxRoot = getCTXRoot();
const enabledAgentsPath = path.join(ctxRoot, 'config', 'enabled-agents.json');
const TEST_AGENT = '__test_lifecycle_agent__';

function makePostReq(name: string, body?: unknown) {
  return new NextRequest(`http://localhost/api/agents/${name}/lifecycle`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function makeDeleteReq(name: string, deleteFiles = false) {
  const url = `http://localhost/api/agents/${name}/lifecycle${deleteFiles ? '?deleteFiles=true' : ''}`;
  return new NextRequest(url, { method: 'DELETE' });
}

function readRegistry(): Record<string, unknown> {
  if (!fs.existsSync(enabledAgentsPath)) return {};
  try { return JSON.parse(fs.readFileSync(enabledAgentsPath, 'utf-8')); } catch { return {}; }
}

beforeAll(() => {
  fs.mkdirSync(path.join(ctxRoot, 'config'), { recursive: true });
});

afterEach(() => {
  // Remove test agent from registry
  const registry = readRegistry();
  delete registry[TEST_AGENT];
  fs.writeFileSync(enabledAgentsPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
  mockSend.mockReset();
});

// ---------------------------------------------------------------------------
// POST /api/agents/[name]/lifecycle
// ---------------------------------------------------------------------------

describe('POST /api/agents/[name]/lifecycle', () => {
  it('returns 400 for invalid agent name', async () => {
    const res = await POST(
      makePostReq('bad agent!'),
      { params: Promise.resolve({ name: 'bad agent!' }) },
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/agents/dev/lifecycle', {
      method: 'POST', body: 'bad', headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req, { params: Promise.resolve({ name: 'dev' }) });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid action', async () => {
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'invalid-action' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/action must be one of/i);
  });

  it('returns 400 for invalid org', async () => {
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'enable', org: 'bad org!' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid org/i);
  });

  it('enables agent — writes registry + calls IPC start-agent', async () => {
    mockSend.mockResolvedValueOnce({ success: true, data: 'started' });
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'enable', org: 'glv' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.action).toBe('enable');
    const registry = readRegistry();
    expect((registry[TEST_AGENT] as Record<string, unknown>).enabled).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'start-agent', agent: TEST_AGENT }));
  });

  it('enable with daemon down still returns success with note', async () => {
    mockSend.mockResolvedValueOnce({ success: false, error: 'Daemon is not running' });
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'enable', org: 'glv' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(200);
    expect((await res.json()).output).toMatch(/daemon not running/i);
  });

  it('disables agent — calls IPC stop-agent + updates registry', async () => {
    // Set up registry first
    const reg = readRegistry();
    reg[TEST_AGENT] = { enabled: true, org: 'glv' };
    fs.writeFileSync(enabledAgentsPath, JSON.stringify(reg, null, 2) + '\n', 'utf-8');
    mockSend.mockResolvedValueOnce({ success: true, data: 'stopped' });
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'disable' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(200);
    expect((await res.json()).action).toBe('disable');
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'stop-agent', agent: TEST_AGENT }));
  });

  it('restarts agent — calls IPC restart-agent', async () => {
    mockSend.mockResolvedValueOnce({ success: true, data: 'restarted' });
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'restart' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(200);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'restart-agent', agent: TEST_AGENT }));
  });

  it('restart_fresh sends mode=fresh to IPC', async () => {
    mockSend.mockResolvedValueOnce({ success: true, data: 'restarted' });
    await POST(
      makePostReq(TEST_AGENT, { action: 'restart_fresh' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ type: 'restart-agent', mode: 'fresh' }));
  });

  it('returns 500 when IPC fails for non-daemon-down error', async () => {
    mockSend.mockResolvedValueOnce({ success: false, error: 'socket error' });
    const res = await POST(
      makePostReq(TEST_AGENT, { action: 'disable' }),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/agents/[name]/lifecycle
// ---------------------------------------------------------------------------

describe('DELETE /api/agents/[name]/lifecycle', () => {
  it('returns 400 for invalid agent name', async () => {
    const res = await DELETE(
      makeDeleteReq('bad agent!'),
      { params: Promise.resolve({ name: 'bad agent!' }) },
    );
    expect(res.status).toBe(400);
  });

  it('removes agent from registry and calls IPC stop', async () => {
    const reg = readRegistry();
    reg[TEST_AGENT] = { enabled: true, org: 'glv' };
    fs.writeFileSync(enabledAgentsPath, JSON.stringify(reg, null, 2) + '\n', 'utf-8');
    mockSend.mockResolvedValueOnce({ success: true });
    const res = await DELETE(
      makeDeleteReq(TEST_AGENT),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.deleted).toBe(TEST_AGENT);
    const updatedReg = readRegistry();
    expect(updatedReg[TEST_AGENT]).toBeUndefined();
  });

  it('deleteFiles=true attempts to remove agent dir (non-fatal if missing)', async () => {
    const reg = readRegistry();
    reg[TEST_AGENT] = { enabled: true, org: 'glv' };
    fs.writeFileSync(enabledAgentsPath, JSON.stringify(reg, null, 2) + '\n', 'utf-8');
    mockSend.mockResolvedValueOnce({ success: true });
    // Agent dir doesn't exist — force:true means no error
    const res = await DELETE(
      makeDeleteReq(TEST_AGENT, true),
      { params: Promise.resolve({ name: TEST_AGENT }) },
    );
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
  });
});
