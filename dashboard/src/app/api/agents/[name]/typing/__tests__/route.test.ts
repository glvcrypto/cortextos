import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';

import { GET } from '../route';

function makeReq(name: string) {
  return new NextRequest(`http://localhost/api/agents/${name}/typing`);
}

function makeParams(name: string) {
  return { params: Promise.resolve({ name }) };
}

const ctxRoot = getCTXRoot();
const agentName = 'test-agent-typing';
const flagDir = path.join(ctxRoot, 'logs', agentName);
const flagFile = path.join(flagDir, 'typing.flag');

afterEach(() => {
  if (fs.existsSync(flagFile)) fs.unlinkSync(flagFile);
});

describe('GET /api/agents/[name]/typing', () => {
  it('returns typing:false for invalid agent name (uppercase)', async () => {
    const res = await GET(makeReq('BadAgent'), makeParams('BadAgent'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.typing).toBe(false);
  });

  it('returns typing:false when flag file does not exist', async () => {
    const res = await GET(makeReq(agentName), makeParams(agentName));
    const body = await res.json();
    expect(body.typing).toBe(false);
  });

  it('returns typing:true when flag has a recent Unix timestamp', async () => {
    fs.mkdirSync(flagDir, { recursive: true });
    const now = Math.floor(Date.now() / 1000);
    fs.writeFileSync(flagFile, String(now));
    const res = await GET(makeReq(agentName), makeParams(agentName));
    const body = await res.json();
    expect(body.typing).toBe(true);
  });

  it('returns typing:false when flag timestamp is stale (>5s ago)', async () => {
    fs.mkdirSync(flagDir, { recursive: true });
    const stale = Math.floor(Date.now() / 1000) - 10;
    fs.writeFileSync(flagFile, String(stale));
    const res = await GET(makeReq(agentName), makeParams(agentName));
    const body = await res.json();
    expect(body.typing).toBe(false);
  });

  it('returns typing:false when flag contains non-numeric content', async () => {
    fs.mkdirSync(flagDir, { recursive: true });
    fs.writeFileSync(flagFile, 'not-a-timestamp');
    const res = await GET(makeReq(agentName), makeParams(agentName));
    const body = await res.json();
    expect(body.typing).toBe(false);
  });
});
