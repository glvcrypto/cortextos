import { describe, it, expect, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';

import { POST } from '../route';

const ctxRoot = getCTXRoot();
const uploadDir = path.join(ctxRoot, 'media', 'dashboard-uploads');

// Minimal valid PNG magic bytes (1x1 transparent PNG)
const PNG_BYTES = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);

function makeFileReq(file?: File | null, extraFields?: Record<string, string>) {
  const form = new FormData();
  if (file !== undefined) {
    if (file !== null) form.append('file', file);
  }
  if (extraFields) {
    for (const [k, v] of Object.entries(extraFields)) form.append(k, v);
  }
  return new NextRequest('http://localhost/api/comms/upload', {
    method: 'POST',
    body: form,
  });
}

afterEach(() => {
  // Remove test uploads
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    for (const f of files) {
      try { fs.unlinkSync(path.join(uploadDir, f)); } catch { /* ignore */ }
    }
  }
});

// ---------------------------------------------------------------------------
// POST /api/comms/upload
// ---------------------------------------------------------------------------

describe('POST /api/comms/upload', () => {
  it('returns 400 when no file is provided', async () => {
    const req = makeFileReq(null);
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/no file/i);
  });

  it('returns 400 for unsupported file type', async () => {
    const file = new File(['<html></html>'], 'test.html', { type: 'text/html' });
    const res = await POST(makeFileReq(file));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/unsupported file type/i);
  });

  it('returns 400 when file exceeds 10 MB', async () => {
    const bigBuffer = Buffer.alloc(11 * 1024 * 1024, 0);
    const file = new File([bigBuffer], 'big.png', { type: 'image/png' });
    const res = await POST(makeFileReq(file));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/too large/i);
  });

  it('returns 200 and saves the file for a valid PNG upload', async () => {
    const file = new File([PNG_BYTES], 'test-upload.png', { type: 'image/png' });
    const res = await POST(makeFileReq(file));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.path).toMatch(/^media\/dashboard-uploads\/.+\.png$/);
    expect(body.url).toMatch(/^\/api\/media\/media\/dashboard-uploads\/.+\.png$/);
    expect(body.filename).toMatch(/\.png$/);
    // File should actually exist on disk
    const filePath = path.join(ctxRoot, body.path);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('sanitizes the filename and uses server-chosen extension', async () => {
    const file = new File([PNG_BYTES], '../../etc/passwd.exe', { type: 'image/png' });
    const res = await POST(makeFileReq(file));
    expect(res.status).toBe(200);
    const body = await res.json();
    // Extension must be .png (server-chosen), not .exe
    expect(body.filename).toMatch(/\.png$/);
    // No path traversal in the returned path
    expect(body.path).not.toContain('..');
  });
});
