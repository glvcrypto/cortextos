import { NextRequest, NextResponse } from 'next/server';
import { getPlatformTimeseries, PLATFORMS, type Platform } from '@/lib/data/social-analytics';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ platform: string }> },
): Promise<NextResponse> {
  const { platform } = await params;

  if (!PLATFORMS.includes(platform as Platform)) {
    return NextResponse.json({ error: `Unknown platform: ${platform}` }, { status: 400 });
  }

  const data = getPlatformTimeseries(platform as Platform);
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
