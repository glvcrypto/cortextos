import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Isolated CTX_ROOT so getCTXRoot() picks it up at module-load time.
// ---------------------------------------------------------------------------
const ctxTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'msgupload-ctx-'));
process.env.CTX_ROOT = ctxTmp;
process.env.ADMIN_USERNAME = 'testuser';

type UploadRoute = typeof import('../upload/route');
let upload: UploadRoute;

beforeAll(async () => {
  upload = await import('../upload/route');
});

afterAll(() => {
  fs.rmSync(ctxTmp, { recursive: true, force: true });
});

beforeEach(() => {
  for (const entry of fs.readdirSync(ctxTmp)) {
    fs.rmSync(path.join(ctxTmp, entry), { recursive: true, force: true });
  }
});

function buildFormRequest(fields: Record<string, string | File>): NextRequest {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    form.append(k, v as string);
  }
  return new NextRequest(new URL('http://localhost/api/messages/upload'), {
    method: 'POST',
    body: form,
  });
}

// ---------------------------------------------------------------------------
// POST /api/messages/upload
// ---------------------------------------------------------------------------
describe('POST /api/messages/upload', () => {
  it('returns 400 when request body is not multipart form data', async () => {
    const req = new NextRequest(new URL('http://localhost/api/messages/upload'), {
      method: 'POST',
      body: '{"agent":"dev"}',
      headers: { 'content-type': 'application/json' },
    });
    const res = await upload.POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error).toLowerCase()).toContain('form');
  });

  it('returns 400 when agent field is missing', async () => {
    const file = new File(['data'], 'shot.jpg', { type: 'image/jpeg' });
    const res = await upload.POST(buildFormRequest({ file }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/agent/i);
  });

  it('returns 400 when agent contains invalid characters', async () => {
    const file = new File(['data'], 'shot.jpg', { type: 'image/jpeg' });
    const res = await upload.POST(buildFormRequest({ agent: 'BAD AGENT', file }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/agent/i);
  });

  it('returns 400 when file field is missing', async () => {
    const res = await upload.POST(buildFormRequest({ agent: 'dev' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/file/i);
  });

  it('returns 400 when filename contains path traversal dots', async () => {
    const file = new File(['data'], '..evil.jpg', { type: 'image/jpeg' });
    const res = await upload.POST(buildFormRequest({ agent: 'dev', file }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/invalid filename/i);
  });

  it('returns 400 for an unsupported file extension', async () => {
    const file = new File(['data'], 'malware.exe', { type: 'application/octet-stream' });
    const res = await upload.POST(buildFormRequest({ agent: 'dev', file }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(String(data.error)).toMatch(/unsupported file type/i);
  });

  it('returns 413 when file exceeds 50 MB', async () => {
    const bigData = Buffer.alloc(50 * 1024 * 1024 + 1);
    const file = new File([bigData], 'huge.mp4', { type: 'video/mp4' });
    const res = await upload.POST(buildFormRequest({ agent: 'dev', file }));
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(String(data.error)).toMatch(/too large/i);
  }, 15000);

  it('saves media file, writes inbox message, and returns messageId + mediaUrl', async () => {
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'photo.jpg', { type: 'image/jpeg' });
    const res = await upload.POST(buildFormRequest({ agent: 'dev', type: 'photo', caption: 'test shot', file }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(typeof data.messageId).toBe('string');
    expect(data.mediaUrl).toMatch(/^\/api\/media\//);

    const inboxDir = path.join(ctxTmp, 'inbox', 'dev');
    expect(fs.existsSync(inboxDir)).toBe(true);
    const msgs = fs.readdirSync(inboxDir).filter(f => !f.startsWith('.tmp'));
    expect(msgs).toHaveLength(1);
    const msg = JSON.parse(fs.readFileSync(path.join(inboxDir, msgs[0]), 'utf-8'));
    expect(msg.to).toBe('dev');
    expect(msg.type).toBe('photo');
    expect(msg.text).toContain('test shot');

    const logFile = path.join(ctxTmp, 'logs', 'dev', 'inbound-messages.jsonl');
    expect(fs.existsSync(logFile)).toBe(true);
    const logLine = JSON.parse(fs.readFileSync(logFile, 'utf-8').trim().split('\n')[0]);
    expect(logLine.agent).toBe('dev');
    expect(logLine.direction).toBe('inbound');
  });
});
