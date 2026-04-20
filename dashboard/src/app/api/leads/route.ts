import { NextRequest } from 'next/server';
import { getLeads, createLead } from '@/lib/data/leads';
import type { LeadStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const org = searchParams.get('org') || undefined;
  const status = (searchParams.get('status') as LeadStatus) || undefined;

  try {
    const leads = getLeads(org, status);
    return Response.json(leads);
  } catch (err) {
    console.error('[api/leads] GET error:', err);
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.business_name) {
      return Response.json({ error: 'business_name is required' }, { status: 400 });
    }

    const lead = createLead({
      org: body.org ?? '',
      business_name: body.business_name,
      contact_name: body.contact_name,
      contact_email: body.contact_email,
      phone: body.phone,
      niche: body.niche,
      area: body.area,
      province: body.province,
      status: body.status ?? 'scouted',
      priority: body.priority ?? 'normal',
      notes: body.notes,
      source: body.source ?? 'manual',
    });

    return Response.json(lead, { status: 201 });
  } catch (err) {
    console.error('[api/leads] POST error:', err);
    return Response.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
