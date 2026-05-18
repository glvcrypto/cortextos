import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllScheduledPosts, scheduledBase, type EditRequest } from '@/lib/data/social-scheduled';

export const dynamic = 'force-dynamic';

const CTX_ROOT = process.env.CTX_ROOT ?? path.join(process.cwd(), '..');
const BOSS_INBOX = path.join(CTX_ROOT, 'orgs', 'glv', 'agents', 'boss', 'inbox');

export async function GET(): Promise<NextResponse> {
  const posts = getAllScheduledPosts();
  return NextResponse.json(posts, { headers: { 'Cache-Control': 'no-store' } });
}

interface ActionBody {
  action: 'cancel' | 'reschedule' | 'edit_request';
  post_id: string;
  platform: string;
  _file: string;
  // reschedule
  new_scheduled_at?: string;
  // edit_request
  change_description?: string;
  urgency?: 'now' | 'next_sync' | 'nightly_batch';
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ActionBody;
  try {
    body = await req.json() as ActionBody;
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const { action, post_id, platform, _file } = body;
  if (!action || !post_id || !_file) {
    return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
  }

  const filePath = path.join(scheduledBase(), _file);

  // Safety check: must resolve under the scheduled base dir
  if (!filePath.startsWith(scheduledBase())) {
    return NextResponse.json({ error: 'path traversal rejected' }, { status: 400 });
  }

  if (action === 'cancel') {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as Record<string, unknown>;
      data.status = 'cancelled';
      data.cancelled_at = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  if (action === 'reschedule') {
    if (!body.new_scheduled_at) {
      return NextResponse.json({ error: 'new_scheduled_at required' }, { status: 400 });
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as Record<string, unknown>;
      data.scheduled_at = body.new_scheduled_at;
      data.status = 'scheduled';
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  if (action === 'edit_request') {
    if (!body.change_description) {
      return NextResponse.json({ error: 'change_description required' }, { status: 400 });
    }
    const editReq: EditRequest = {
      post_id,
      platform,
      change_description: body.change_description,
      urgency: body.urgency ?? 'next_sync',
      requested_at: new Date().toISOString(),
    };

    // Write structured inbox message for boss agent
    try {
      fs.mkdirSync(BOSS_INBOX, { recursive: true });
      const msgId = `${Date.now()}-dashboard-edit-${post_id.slice(-6)}`;
      const msgPath = path.join(BOSS_INBOX, `${msgId}.json`);
      const msg = {
        id: msgId,
        type: 'edit_request',
        from: 'dashboard',
        created_at: new Date().toISOString(),
        payload: editReq,
        post_file: _file,
        reply_status: 'pending',
      };
      fs.writeFileSync(msgPath, JSON.stringify(msg, null, 2), 'utf-8');

      // Update post file with edit_requested_at + msg_id for status polling
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw) as Record<string, unknown>;
        data.edit_requested_at = editReq.requested_at;
        data.edit_request_id = msgId;
        data.edit_reply = null;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      } catch { /* non-critical */ }

      return NextResponse.json({ ok: true, msg_id: msgId });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  return NextResponse.json({ error: `unknown action: ${action}` }, { status: 400 });
}
