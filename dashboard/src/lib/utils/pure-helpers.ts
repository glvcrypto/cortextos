// Pure utility functions extracted from settings.ts so they can be exported
// from a non-'use server' module (Turbopack rejects non-async exports from
// 'use server' files).

export function maskToken(token: string): string {
  if (token.length <= 8) return '****';
  return token.slice(0, 4) + '****' + token.slice(-4);
}

export function normalizeFsPath(p: string): string {
  let n = p.replace(/\\/g, '/');
  if (n.length > 1 && n.endsWith('/') && !/^[A-Za-z]:\/$/.test(n)) {
    n = n.slice(0, -1);
  }
  return n;
}
