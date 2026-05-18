/**
 * Agent-browser invocation logger.
 * Daily-rotating error log + bus event emission for critical failures.
 *
 * Log files:
 *   orgs/glv/clients/glv-marketing/socials/agent-browser-errors-YYYY-MM-DD.log
 *   orgs/glv/clients/glv-marketing/socials/agent-browser-watchdog.log
 */
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { execFile } from 'child_process';

function socialsDir(): string {
  const ctxRoot = process.env.CTX_ROOT ?? join(homedir(), 'cortextos');
  return join(ctxRoot, '..', '..', 'orgs', 'glv', 'clients', 'glv-marketing', 'socials');
}

function ensureDir(): string {
  const dir = socialsDir();
  mkdirSync(dir, { recursive: true });
  return dir;
}

export interface AbLogEntry {
  ts: string;
  command: string[];
  durationMs: number;
  exitCode: number;
  stderr: string;
}

export function logAbCall(entry: AbLogEntry): void {
  try {
    const dir = ensureDir();
    const date = new Date().toISOString().split('T')[0];
    appendFileSync(join(dir, `agent-browser-errors-${date}.log`), JSON.stringify(entry) + '\n', 'utf-8');
  } catch { /* non-critical */ }
}

export function logWatchdog(msg: string): void {
  try {
    const dir = ensureDir();
    appendFileSync(join(dir, 'agent-browser-watchdog.log'), `${new Date().toISOString()} ${msg}\n`, 'utf-8');
  } catch { /* non-critical */ }
}

export function emitBusEvent(severity: 'info' | 'error' | 'critical', source: string, message: string): void {
  const meta = JSON.stringify({ source, message, severity });
  execFile(
    'cortextos',
    ['bus', 'log-event', 'agent-browser-watchdog', `ab_${severity}`, severity, '--meta', meta],
    { timeout: 5_000 },
    () => { /* fire-and-forget */ },
  );
}

export function notifyBoss(level: 'normal' | 'high', message: string): void {
  execFile(
    'cortextos',
    ['bus', 'send-message', 'boss', level, message],
    { timeout: 10_000 },
    () => { /* fire-and-forget */ },
  );
}
