import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTransaction, updateTransaction, deleteTransaction } from '@/lib/data/expenses';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const txn = getTransaction(parseInt(id, 10));
  if (!txn) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ transaction: txn });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = updateTransaction(parseInt(id, 10), {
    ...body,
    amount_cents: body.amount !== undefined ? Math.round(parseFloat(body.amount) * 100) : undefined,
  });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ transaction: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (!getTransaction(numId)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  deleteTransaction(numId);
  return NextResponse.json({ ok: true });
}
