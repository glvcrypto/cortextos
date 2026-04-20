import { NextRequest } from 'next/server';
import { getLeadById, updateLead, deleteLead } from '@/lib/data/leads';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) return Response.json({ error: 'Lead not found' }, { status: 404 });
  return Response.json(lead);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const lead = updateLead(id, body);
    if (!lead) return Response.json({ error: 'Lead not found' }, { status: 404 });
    return Response.json(lead);
  } catch (err) {
    console.error('[api/leads/[id]] PATCH error:', err);
    return Response.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteLead(id);
  if (!ok) return Response.json({ error: 'Lead not found' }, { status: 404 });
  return Response.json({ ok: true });
}
