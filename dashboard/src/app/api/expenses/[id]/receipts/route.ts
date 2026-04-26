import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTransaction } from '@/lib/data/expenses';

// Stub: receipt file storage is not yet implemented (needs S3/R2 or local uploads dir).
// This endpoint accepts the upload request and returns a 202 so the UI can ship
// without a broken form. Full implementation requires a storage backend decision.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const txn = getTransaction(parseInt(id, 10));
  if (!txn) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file field in form' }, { status: 400 });

  return NextResponse.json({
    ok: true,
    stub: true,
    message: 'Receipt upload received but not yet persisted — storage backend pending.',
    file_name: file.name,
    file_size_bytes: file.size,
    transaction_id: txn.id,
  }, { status: 202 });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const txn = getTransaction(parseInt(id, 10));
  if (!txn) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ receipts: [] });
}
