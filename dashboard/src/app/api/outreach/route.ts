import { NextRequest } from 'next/server';
import { getOutreachEvents, getOutreachSummary, getOutreachStats } from '@/lib/data/outreach';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const org = searchParams.get('org') ?? undefined;
  const view = searchParams.get('view') ?? 'summary';

  try {
    if (view === 'events') {
      const limit = Math.min(parseInt(searchParams.get('limit') ?? '200', 10) || 200, 500);
      return Response.json(getOutreachEvents(org, limit));
    }

    if (view === 'stats') {
      return Response.json(getOutreachStats(org));
    }

    return Response.json(getOutreachSummary(org));
  } catch (err) {
    console.error('[api/outreach]', err);
    return Response.json({ error: 'Failed to query outreach data' }, { status: 500 });
  }
}
