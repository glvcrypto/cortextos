import { NextRequest, NextResponse } from 'next/server';
import { getLivePosts } from '@/lib/data/social-live';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const platform = req.nextUrl.searchParams.get('platform');
  const rows = getLivePosts();
  const filtered = platform
    ? rows.filter(r => r.entry.platform === platform)
    : rows;
  return NextResponse.json(filtered, { headers: { 'Cache-Control': 'no-store' } });
}
