import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  listTransactions,
  createTransaction,
  getCategoryBreakdown,
  getMonthlySummaries,
  getSubscriptionBurnRate,
  listCategories,
  createCategory,
  listTags,
  getRunway,
  getLastCashSnapshotAge,
  updateCashBalance,
  syncFxRates,
} from '@/lib/data/expenses';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const org = searchParams.get('org') ?? 'glv';
  const view = searchParams.get('view');

  if (view === 'summary') {
    const burn = getSubscriptionBurnRate(org);
    const runway = getRunway(org);
    const cashAge = getLastCashSnapshotAge(org);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonth = listTransactions(org, { from: `${currentMonth}-01` });
    const monthExpenses = thisMonth.filter((t) => t.direction === 'expense' && t.status === 'paid').reduce((s, t) => s + t.amount_cents, 0);
    const monthIncome = thisMonth.filter((t) => t.direction === 'income' && t.status === 'paid').reduce((s, t) => s + t.amount_cents, 0);
    return NextResponse.json({
      subscription_burn_cents: burn,
      month_expenses_cents: monthExpenses,
      month_income_cents: monthIncome,
      net_cents: monthIncome - monthExpenses,
      runway,
      cash_snapshot_age_days: cashAge,
    });
  }

  if (view === 'categories') {
    const direction = (searchParams.get('direction') ?? 'expense') as 'expense' | 'income';
    const from = searchParams.get('from') ?? undefined;
    const to = searchParams.get('to') ?? undefined;
    return NextResponse.json({ categories: getCategoryBreakdown(org, direction, from, to) });
  }

  if (view === 'monthly') {
    const months = parseInt(searchParams.get('months') ?? '12', 10);
    return NextResponse.json({ monthly: getMonthlySummaries(org, months) });
  }

  if (view === 'category-list') {
    return NextResponse.json({ categories: listCategories(org) });
  }

  if (view === 'tags') {
    return NextResponse.json({ tags: listTags(org) });
  }

  if (view === 'runway') {
    return NextResponse.json(getRunway(org));
  }

  if (view === 'sync-fx') {
    syncFxRates();
    return NextResponse.json({ ok: true });
  }

  const direction = searchParams.get('direction') as 'expense' | 'income' | undefined ?? undefined;
  const transaction_type = searchParams.get('transaction_type') as 'one_time' | 'subscription' | 'invoice' | undefined ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const category_id = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!, 10) : undefined;
  const from = searchParams.get('from') ?? undefined;
  const to = searchParams.get('to') ?? undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined;

  const transactions = listTransactions(org, { direction, transaction_type, status, category_id, from, to, limit, offset });
  return NextResponse.json({ transactions });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Category create
  if (body._action === 'create_category') {
    const cat = createCategory(body.org ?? 'glv', {
      name: body.name, color: body.color, cra_t2125_line: body.cra_t2125_line, cra_t2125_label: body.cra_t2125_label,
    });
    return NextResponse.json({ category: cat }, { status: 201 });
  }

  // Cash balance update
  if (body._action === 'update_cash_balance') {
    updateCashBalance(body.org ?? 'glv', Math.round(parseFloat(body.balance ?? '0') * 100), body.notes);
    return NextResponse.json({ ok: true });
  }

  const txn = createTransaction({
    org: body.org ?? 'glv',
    date: body.date,
    direction: body.direction ?? 'expense',
    transaction_type: body.transaction_type ?? 'one_time',
    amount_cents: Math.round(parseFloat(body.amount ?? '0') * 100),
    currency: body.currency ?? 'CAD',
    vendor: body.vendor ?? null,
    description: body.description ?? null,
    category_id: body.category_id ?? null,
    status: body.status,
    payment_method: body.payment_method ?? null,
    payment_reference: body.payment_reference ?? null,
    counterparty_email: body.counterparty_email ?? null,
    invoice_number: body.invoice_number ?? null,
    invoice_due_date: body.invoice_due_date ?? null,
    paid_at: body.paid_at ?? null,
    notes: body.notes ?? null,
    tags: body.tags ?? [],
  });

  return NextResponse.json({ transaction: txn }, { status: 201 });
}
