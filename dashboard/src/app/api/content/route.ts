import { NextRequest } from 'next/server';
import { getContentItems, createContentItem } from '@/lib/data/content';
import type { ContentStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const org = searchParams.get('org') || undefined;
  const status = (searchParams.get('status') as ContentStatus) || undefined;

  try {
    const items = getContentItems(org, status);
    return Response.json(items);
  } catch (err) {
    console.error('[api/content] GET error:', err);
    return Response.json({ error: 'Failed to fetch content items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return Response.json({ error: 'title is required' }, { status: 400 });
    }

    const item = createContentItem({
      org: body.org ?? '',
      client_slug: body.client_slug,
      title: body.title,
      platform: body.platform,
      content_type: body.content_type ?? 'blog',
      status: body.status ?? 'draft',
      scheduled_date: body.scheduled_date,
      notes: body.notes,
    });

    return Response.json(item, { status: 201 });
  } catch (err) {
    console.error('[api/content] POST error:', err);
    return Response.json({ error: 'Failed to create content item' }, { status: 500 });
  }
}
