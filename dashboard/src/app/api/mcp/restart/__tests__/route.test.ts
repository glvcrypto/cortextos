import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

import { execSync } from 'child_process';
import { POST } from '../route';

function makeReq(body?: unknown) {
  return new NextRequest('http://localhost/api/mcp/restart', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// POST /api/mcp/restart
// ---------------------------------------------------------------------------

describe('POST /api/mcp/restart', () => {
  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/mcp/restart', {
      method: 'POST', body: 'bad', headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid json/i);
  });

  it('returns 400 when agents is not an array', async () => {
    const res = await POST(makeReq({ agents: 'dev' }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/non-empty array/i);
  });

  it('returns 400 when agents array is empty', async () => {
    const res = await POST(makeReq({ agents: [] }));
    expect(res.status).toBe(400);
  });

  it('marks invalid agent names as failed without calling execSync', async () => {
    vi.mocked(execSync).mockClear();
    const res = await POST(makeReq({ agents: ['bad agent!'] }));
    expect(res.status).toBe(207);
    const body = await res.json();
    expect(body.results['bad agent!'].ok).toBe(false);
    expect(body.results['bad agent!'].error).toMatch(/invalid agent name/i);
    expect(vi.mocked(execSync)).not.toHaveBeenCalled();
  });

  it('returns 200 and ok:true when all agents restart successfully', async () => {
    vi.mocked(execSync).mockReturnValue('' as never);
    const res = await POST(makeReq({ agents: ['dev', 'boss'] }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.results.dev.ok).toBe(true);
    expect(body.results.boss.ok).toBe(true);
    expect(vi.mocked(execSync)).toHaveBeenCalledTimes(2);
  });

  it('returns 207 with mixed results when some agents fail', async () => {
    vi.mocked(execSync)
      .mockReturnValueOnce('' as never)
      .mockImplementationOnce(() => { throw new Error('daemon not running'); });
    const res = await POST(makeReq({ agents: ['dev', 'boss'] }));
    expect(res.status).toBe(207);
    const body = await res.json();
    expect(body.results.dev.ok).toBe(true);
    expect(body.results.boss.ok).toBe(false);
  });

  it('passes custom reason to execSync command', async () => {
    vi.mocked(execSync).mockReturnValue('' as never);
    await POST(makeReq({ agents: ['dev'], reason: 'slack config added' }));
    const call = vi.mocked(execSync).mock.calls[vi.mocked(execSync).mock.calls.length - 1][0] as string;
    expect(call).toContain('slack config added');
  });
});
