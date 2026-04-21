import { NextRequest } from 'next/server';
import { getOutreachEvents, getOutreachSummary, getOutreachStats, getOutreachPipeline } from '@/lib/data/outreach';
import type { PipelineFilters } from '@/lib/data/outreach';

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

    if (view === 'pipeline') {
      const filters: PipelineFilters = {};
      const city = searchParams.get('city');
      const industry = searchParams.get('industry');
      const tier = searchParams.get('tier') as 'A' | 'B' | 'C' | null;
      if (city) filters.city = city;
      if (industry) filters.industry = industry;
      if (tier && ['A', 'B', 'C'].includes(tier)) filters.tier = tier;
      return Response.json(getOutreachPipeline(filters));
    }

    return Response.json(getOutreachSummary(org));
  } catch (err) {
    console.error('[api/outreach]', err);
    return Response.json({ error: 'Failed to query outreach data' }, { status: 500 });
  }
}
