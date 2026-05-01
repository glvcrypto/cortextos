import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CTX_ROOT } from '@/lib/config';

import { GET } from '../route';

function makeReq(name: string, params?: Record<string, string>) {
  const url = new URL(`http://localhost/api/agents/${name}/logs`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return new NextRequest(url.toString());
}

function makeParams(name: string) {
  return { params: Promise.resolve({ name }) };
}

// logsDir = CTX_ROOT/logs/<name> — create files there for tests
const agentName = 'test-agent-logs';
const logsDir = path.join(CTX_ROOT, 'logs', agentName);

describe('GET /api/agents/[name]/logs', () => {
  it('returns 400 for invalid log type (shell metacharacters)', async () => {
    const res = await GET(makeReq(agentName, { type: '../etc/passwd' }), makeParams(agentName));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid log type/i);
  });

  it('returns empty string when log file does not exist', async () => {
    const res = await GET(makeReq(agentName, { type: 'nonexistent' }), makeParams(agentName));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('');
  });

  it('returns log file contents', async () => {
    fs.mkdirSync(logsDir, { recursive: true });
    const logFile = path.join(logsDir, 'activity.log');
    fs.writeFileSync(logFile, 'line 1\nline 2\nline 3\n');
    try {
      const res = await GET(makeReq(agentName, { type: 'activity' }), makeParams(agentName));
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('line 1');
      expect(text).toContain('line 3');
    } finally {
      fs.unlinkSync(logFile);
    }
  });

  it('strips ANSI escape codes from log output', async () => {
    fs.mkdirSync(logsDir, { recursive: true });
    const logFile = path.join(logsDir, 'activity.log');
    fs.writeFileSync(logFile, '\x1b[32mGreen text\x1b[0m\nPlain text\n');
    try {
      const res = await GET(makeReq(agentName, { type: 'activity' }), makeParams(agentName));
      const text = await res.text();
      expect(text).not.toContain('\x1b[');
      expect(text).toContain('Green text');
      expect(text).toContain('Plain text');
    } finally {
      fs.unlinkSync(logFile);
    }
  });

  it('tails only the last N lines when lines param given', async () => {
    fs.mkdirSync(logsDir, { recursive: true });
    const logFile = path.join(logsDir, 'activity.log');
    const content = Array.from({ length: 10 }, (_, i) => `line ${i + 1}`).join('\n');
    fs.writeFileSync(logFile, content);
    try {
      const res = await GET(makeReq(agentName, { type: 'activity', lines: '3' }), makeParams(agentName));
      const text = await res.text();
      const lines = text.trim().split('\n');
      expect(lines.length).toBe(3);
      expect(lines[0]).toBe('line 8');
      expect(lines[2]).toBe('line 10');
    } finally {
      fs.unlinkSync(logFile);
    }
  });

  it('uses correct content-type header', async () => {
    const res = await GET(makeReq(agentName, { type: 'missing' }), makeParams(agentName));
    expect(res.headers.get('content-type')).toMatch(/text\/plain/);
  });
});
