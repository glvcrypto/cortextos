import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Isolated CTX_ROOT + FRAMEWORK_ROOT so getCTXRoot/getFrameworkRoot pick them
// up when the route module is first imported in beforeAll.
// ---------------------------------------------------------------------------
const ctxTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'media-ctx-'));
const fwTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'media-fw-'));
process.env.CTX_ROOT = ctxTmp;
process.env.CTX_FRAMEWORK_ROOT = fwTmp;

type MediaRoute = typeof import('../[...filepath]/route');
let media: MediaRoute;

beforeAll(async () => {
  media = await import('../[...filepath]/route');
});

afterAll(() => {
  fs.rmSync(ctxTmp, { recursive: true, force: true });
  fs.rmSync(fwTmp, { recursive: true, force: true });
});

beforeEach(() => {
  for (const entry of fs.readdirSync(ctxTmp)) {
    fs.rmSync(path.join(ctxTmp, entry), { recursive: true, force: true });
  }
});

function makeReq(filepath: string[], query = ''): [NextRequest, { params: Promise<{ filepath: string[] }> }] {
  const url = `http://localhost/api/media/${filepath.join('/')}${query}`;
  return [
    new NextRequest(new URL(url)),
    { params: Promise.resolve({ filepath }) },
  ];
}

// ---------------------------------------------------------------------------
// GET /api/media/[...filepath]
// ---------------------------------------------------------------------------
describe('GET /api/media/[...filepath]', () => {
  it('returns 404 with not_found error when file does not exist', async () => {
    const [req, ctx] = makeReq(['nonexistent.txt']);
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('not_found');
  });

  it('returns 404 for path traversal that escapes CTX_ROOT', async () => {
    const [req, ctx] = makeReq(['..', '..', 'etc', 'passwd']);
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(404);
  });

  it('serves a PNG file with image/png content-type', async () => {
    const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    fs.writeFileSync(path.join(ctxTmp, 'photo.png'), Buffer.from(pngBytes));
    const [req, ctx] = makeReq(['photo.png']);
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    expect(res.headers.get('content-disposition')).toContain('inline');
  });

  it('serves a .txt file with text/plain content-type', async () => {
    fs.writeFileSync(path.join(ctxTmp, 'notes.txt'), 'hello world');
    const [req, ctx] = makeReq(['notes.txt']);
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
  });

  it('serves a .md file as plain text by default (no render param)', async () => {
    fs.writeFileSync(path.join(ctxTmp, 'doc.md'), '# Hello\n\nWorld');
    const [req, ctx] = makeReq(['doc.md']);
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
    const body = await res.text();
    expect(body).toContain('# Hello');
  });

  it('renders .md as sanitized HTML when ?render=true', async () => {
    fs.writeFileSync(path.join(ctxTmp, 'doc.md'), '# Hello\n\nWorld\n\n<script>evil()</script>');
    const [req, ctx] = makeReq(['doc.md'], '?render=true');
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/html/i);
    const html = await res.text();
    expect(html).toContain('<h1');
    expect(html).not.toContain('<script>');
  });

  it('serves unknown extensions with application/octet-stream and attachment disposition', async () => {
    fs.writeFileSync(path.join(ctxTmp, 'data.bin'), Buffer.from([0x00, 0x01, 0x02]));
    const [req, ctx] = makeReq(['data.bin']);
    const res = await media.GET(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/octet-stream');
    expect(res.headers.get('content-disposition')).toContain('attachment');
  });
});
