import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCTXRoot } from '@/lib/config';
// @api-media-route alias resolves the bracket dir that static imports can't handle (vitest.config.ts)
import { GET } from '@api-media-route';

const ctxRoot = getCTXRoot();
const testDir = path.join(ctxRoot, 'media', '__test_media_route__');
const testPngName = 'sample.png';
const testMdName = 'note.md';
const testTxtName = 'data.txt';

// Minimal valid PNG magic bytes
const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function makeMediaReq(filepath: string[], params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `http://localhost/api/media/${filepath.join('/')}${qs ? '?' + qs : ''}`;
  return new NextRequest(url);
}

function mockParams(filepath: string[]) {
  return { params: Promise.resolve({ filepath }) };
}

beforeAll(() => {
  fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(path.join(testDir, testPngName), PNG_BYTES);
  fs.writeFileSync(path.join(testDir, testMdName), '# Hello\n\nWorld **bold**');
  fs.writeFileSync(path.join(testDir, testTxtName), 'plain text content');
});

afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// GET /api/media/[...filepath]
// ---------------------------------------------------------------------------

describe('GET /api/media/[...filepath]', () => {
  it('returns 404 for a file that does not exist', async () => {
    const res = await GET(
      makeMediaReq(['media', '__test_media_route__', 'nonexistent.png']),
      mockParams(['media', '__test_media_route__', 'nonexistent.png']),
    );
    expect(res.status).toBe(404);
    const body = await res.json() as { error: string };
    expect(body.error).toBe('not_found');
  });

  it('serves a PNG with correct Content-Type', async () => {
    const segs = ['media', '__test_media_route__', testPngName];
    const res = await GET(makeMediaReq(segs), mockParams(segs));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('image/png');
    const buf = Buffer.from(await res.arrayBuffer());
    expect(buf.slice(0, 8)).toEqual(PNG_BYTES);
  });

  it('serves a .txt file as text/plain', async () => {
    const segs = ['media', '__test_media_route__', testTxtName];
    const res = await GET(makeMediaReq(segs), mockParams(segs));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/plain');
  });

  it('renders markdown as sanitized HTML when ?render=true', async () => {
    const segs = ['media', '__test_media_route__', testMdName];
    const res = await GET(makeMediaReq(segs, { render: 'true' }), mockParams(segs));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('<h1');
    expect(html).toContain('World');
  });

  it('returns 404 for path traversal attempts (../ sequences)', async () => {
    const segs = ['media', '__test_media_route__', '..', '..', 'secrets.env'];
    const res = await GET(makeMediaReq(segs), mockParams(segs));
    // realpathSync fails on non-existent traversal path → 404
    expect(res.status).toBe(404);
  });
});
