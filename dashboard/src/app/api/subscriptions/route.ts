import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listSchedules, createSchedule } from '@/lib/data/expenses';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const org = searchParams.get('org') ?? 'glv';
  const activeOnly = searchParams.get('active') === 'true';

  const schedules = listSchedules(org, { activeOnly });
  return NextResponse.json({ schedules });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const schedule = createSchedule({
    org: body.org ?? 'glv',
    vendor: body.vendor,
    description: body.description ?? null,
    amount_cents: Math.round(parseFloat(body.amount ?? '0') * 100),
    currency: body.currency ?? 'CAD',
    category_id: body.category_id ?? null,
    direction: body.direction ?? 'expense',
    cadence: body.cadence ?? 'monthly',
    cadence_interval_days: body.cadence_interval_days ?? null,
    start_date: body.start_date,
    next_bill_date: body.next_bill_date ?? body.start_date,
    end_date: body.end_date ?? null,
    payment_method: body.payment_method ?? null,
    counterparty_email: body.counterparty_email ?? null,
    notes: body.notes ?? null,
    tags: body.tags ?? [],
  });
  return NextResponse.json({ schedule }, { status: 201 });
}
