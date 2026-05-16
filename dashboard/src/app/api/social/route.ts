import { type NextRequest } from 'next/server';
import {
  getSocialChannels,
  getContentPipeline,
  getReelPipelineState,
  getWeeklyRollup,
} from '@/lib/data/social';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view') ?? 'channels';

  try {
    switch (view) {
      case 'channels':
        return Response.json(getSocialChannels());
      case 'pipeline':
        return Response.json(getContentPipeline());
      case 'reel':
        return Response.json(getReelPipelineState());
      case 'rollup':
        return Response.json(getWeeklyRollup());
      default:
        return Response.json({ error: 'Unknown view' }, { status: 400 });
    }
  } catch (err) {
    console.error('[api/social]', err);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
