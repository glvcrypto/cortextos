import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export const dynamic = 'force-dynamic';

const SESSION = 'glv-socials';

interface SessionStatus {
  state: 'ok' | 'frozen' | 'dead' | 'unknown';
  frozen_since: string | null;
  last_ok_at: string | null;
  recovery_attempts: number;
}

export async function GET(): Promise<NextResponse> {
  const statusFile = join(homedir(), '.cache', 'agent-browser', 'sessions', SESSION, '.status');

  if (!existsSync(statusFile)) {
    return NextResponse.json<SessionStatus>({
      state: 'unknown',
      frozen_since: null,
      last_ok_at: null,
      recovery_attempts: 0,
    }, { headers: { 'Cache-Control': 'no-store' } });
  }

  try {
    const raw = readFileSync(statusFile, 'utf-8');
    const data = JSON.parse(raw) as SessionStatus;
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json<SessionStatus>({
      state: 'unknown',
      frozen_since: null,
      last_ok_at: null,
      recovery_attempts: 0,
    }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
