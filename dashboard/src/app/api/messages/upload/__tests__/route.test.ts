import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';
import { POST } from '../route';

// Minimal valid PNG (8-byte magic + IHDR)
const PNG_BYTES = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108020000009001' + '2e00000000049494441540789c6260000000200016337ci', 'hex'
).slice(0, 8); // just the PNG magic bytes — enough for MIME detection

function makeUploadReq(fields: Record<string, string>, fileOpts?: {
  name: string;
  type: string;
  size?: number;
}): NextRequest {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  if (fileOpts) {
    const buf = fileOpts.size
      ? new Uint8Array(fileOpts.size)
      : PNG_BYTES;
    const file = new File([buf], fileOpts.name, { type: fileOpts.type });
    form.append('file', file);
  }
  return new NextRequest('http://localhost/api/messages/upload', {
    method: 'POST',
    body: form,
  });
}

const ctxRoot = getCTXRoot();
const uploadAgent = '__test_upload_agent__';
const uploadMediaDir = path.join(ctxRoot, 'media', uploadAgent);
const uploadInboxDir = path.join(ctxRoot, 'inbox', uploadAgent);
const uploadLogDir = path.join(ctxRoot, 'logs', uploadAgent);

afterEach(() => {
  // Clean up uploaded test files
  for (const dir of [uploadMediaDir, uploadInboxDir, uploadLogDir]) {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (f.includes('test') || f.match(/^\d{13}-/)) {
          try { fs.unlinkSync(path.join(dir, f)); } catch { /* ignore */ }
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// POST /api/messages/upload
// ---------------------------------------------------------------------------

describe('POST /api/messages/upload', () => {
  it('returns 400 when agent is missing', async () => {
    const req = makeUploadReq({}, { name: 'test.png', type: 'image/png' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/agent/i);
  });

  it('returns 400 when agent has invalid characters', async () => {
    const req = makeUploadReq({ agent: 'bad agent!' }, { name: 'test.png', type: 'image/png' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/agent/i);
  });

  it('returns 400 when no file is provided', async () => {
    const form = new FormData();
    form.append('agent', uploadAgent);
    const req = new NextRequest('http://localhost/api/messages/upload', {
      method: 'POST',
      body: form,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/file/i);
  });

  it('returns 400 for unsupported file type (.exe)', async () => {
    const req = makeUploadReq(
      { agent: uploadAgent },
      { name: 'malware.exe', type: 'application/octet-stream' },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/unsupported file type/i);
  });

  it('returns 413 when file exceeds 50 MB limit', async () => {
    const req = makeUploadReq(
      { agent: uploadAgent },
      { name: 'big.png', type: 'image/png', size: 51 * 1024 * 1024 },
    );
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect((await res.json()).error).toMatch(/too large/i);
  });

  it('saves a valid PNG and returns mediaUrl + messageId', async () => {
    const req = makeUploadReq(
      { agent: uploadAgent, type: 'photo', caption: 'hello' },
      { name: 'photo.png', type: 'image/png' },
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.messageId).toBe('string');
    expect(body.mediaUrl).toMatch(/^\/api\/media\//);
    // Inbox entry created
    expect(fs.existsSync(uploadInboxDir)).toBe(true);
    const inboxFiles = fs.readdirSync(uploadInboxDir);
    expect(inboxFiles.length).toBeGreaterThan(0);
    const inboxMsg = JSON.parse(fs.readFileSync(path.join(uploadInboxDir, inboxFiles[0]), 'utf-8'));
    expect(inboxMsg.type).toBe('photo');
    expect(inboxMsg.text).toContain('hello');
  });

  it('rejects a filename with path traversal sequences', async () => {
    const form = new FormData();
    form.append('agent', uploadAgent);
    const file = new File([PNG_BYTES], '../../../etc/passwd', { type: 'image/png' });
    form.append('file', file);
    const req = new NextRequest('http://localhost/api/messages/upload', {
      method: 'POST',
      body: form,
    });
    const res = await POST(req);
    // Traversal sequences are stripped by path.basename; the remaining name
    // 'etc/passwd' still has no allowed extension → 400 unsupported file type
    expect(res.status).toBe(400);
  });
});
