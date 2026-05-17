/**
 * Agent-browser session freeze detector + auto-recovery watchdog.
 *
 * Polls the CDP socket every 30s via `agent-browser get title` (5s timeout).
 * Three consecutive probe failures → FROZEN.
 * Auto-recovery when frozen >60s: close-all + re-open last URL.
 * Recovery capped at 3 attempts per 10min → if exceeded → DEAD.
 *
 * Status file: ~/.cache/agent-browser/sessions/<name>/.status
 * Logs to:     orgs/glv/clients/glv-marketing/socials/agent-browser-watchdog.log
 */
import { execFile } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { logWatchdog, emitBusEvent, notifyBoss } from './logger.js';

const POLL_MS           = 30_000;
const PROBE_TIMEOUT_MS  = 5_000;
const FREEZE_THRESHOLD  = 3;
const FROZEN_MIN_MS     = 60_000;
const RECOVERY_CAP      = 3;
const RECOVERY_WINDOW_MS = 10 * 60_000;

export type SessionState = 'ok' | 'frozen' | 'dead';

export interface SessionStatus {
  state: SessionState;
  frozen_since: string | null;
  last_ok_at: string | null;
  recovery_attempts: number;
}

function statusPath(session: string): string {
  return join(homedir(), '.cache', 'agent-browser', 'sessions', session, '.status');
}

function writeStatus(session: string, s: SessionStatus): void {
  try {
    mkdirSync(join(homedir(), '.cache', 'agent-browser', 'sessions', session), { recursive: true });
    writeFileSync(statusPath(session), JSON.stringify(s, null, 2), 'utf-8');
  } catch { /* non-critical */ }
}

function probe(session: string): Promise<boolean> {
  return new Promise(resolve => {
    let settled = false;
    const settle = (v: boolean) => { if (!settled) { settled = true; resolve(v); } };

    const child = execFile(
      'agent-browser',
      ['--session', session, 'get', 'title'],
      { timeout: PROBE_TIMEOUT_MS },
      (err) => settle(!err),
    );

    setTimeout(() => {
      try { child.kill(); } catch {}
      settle(false);
    }, PROBE_TIMEOUT_MS + 500);
  });
}

function recoverSession(session: string, lastUrl: string | null): Promise<void> {
  return new Promise(resolve => {
    execFile('agent-browser', ['--session', session, 'close', '--all'], { timeout: 10_000 }, () => {
      const target = lastUrl ?? 'about:blank';
      execFile('agent-browser', ['--session', session, 'open', target], { timeout: 15_000 }, () => resolve());
    });
  });
}

export interface WatchdogHandle {
  stop(): void;
  getStatus(): SessionStatus;
}

export function startWatchdog(session: string, lastUrl?: string): WatchdogHandle {
  let consecutiveFails = 0;
  let frozenSince: Date | null = null;
  let lastOkAt: Date = new Date();
  let state: SessionState = 'ok';
  let recoveryAttempts = 0;
  let firstRecoveryAt: Date | null = null;
  let stopped = false;

  logWatchdog(`[watchdog:${session}] started`);
  writeStatus(session, { state: 'ok', frozen_since: null, last_ok_at: lastOkAt.toISOString(), recovery_attempts: 0 });

  async function tick(): Promise<void> {
    if (stopped || state === 'dead') return;

    const ok = await probe(session);

    if (ok) {
      if (consecutiveFails > 0) {
        logWatchdog(`[watchdog:${session}] probe OK — reset failure counter (was ${consecutiveFails})`);
      }
      consecutiveFails = 0;
      lastOkAt = new Date();
      if (state === 'frozen') {
        state = 'ok';
        frozenSince = null;
        logWatchdog(`[watchdog:${session}] session recovered — state → ok`);
        writeStatus(session, { state: 'ok', frozen_since: null, last_ok_at: lastOkAt.toISOString(), recovery_attempts: recoveryAttempts });
      }
      return;
    }

    consecutiveFails++;
    logWatchdog(`[watchdog:${session}] probe failed (${consecutiveFails}/${FREEZE_THRESHOLD})`);

    if (consecutiveFails < FREEZE_THRESHOLD) return;

    if (!frozenSince) {
      frozenSince = new Date();
      state = 'frozen';
      logWatchdog(`[watchdog:${session}] FROZEN since ${frozenSince.toISOString()}`);
      writeStatus(session, { state: 'frozen', frozen_since: frozenSince.toISOString(), last_ok_at: lastOkAt.toISOString(), recovery_attempts: recoveryAttempts });
      emitBusEvent('error', `agent-browser:${session}`, `Session FROZEN — CDP unresponsive since ${frozenSince.toISOString()}`);
      return; // wait FROZEN_MIN_MS before attempting recovery
    }

    const frozenMs = Date.now() - frozenSince.getTime();
    if (frozenMs < FROZEN_MIN_MS) return;

    // Reset recovery window if expired
    if (firstRecoveryAt && Date.now() - firstRecoveryAt.getTime() > RECOVERY_WINDOW_MS) {
      recoveryAttempts = 0;
      firstRecoveryAt = null;
    }

    if (recoveryAttempts >= RECOVERY_CAP) {
      state = 'dead';
      logWatchdog(`[watchdog:${session}] DEAD — recovery cap exceeded`);
      writeStatus(session, { state: 'dead', frozen_since: frozenSince.toISOString(), last_ok_at: lastOkAt.toISOString(), recovery_attempts: recoveryAttempts });
      emitBusEvent('critical', `agent-browser:${session}`, `Session DEAD — ${RECOVERY_CAP} recovery attempts exhausted. Manual restart required.`);
      notifyBoss('high', `🚨 agent-browser "${session}" DEAD: ${RECOVERY_CAP} recovery attempts exhausted in 10min. Manual restart needed before next analytics scrape.`);
      return;
    }

    recoveryAttempts++;
    if (!firstRecoveryAt) firstRecoveryAt = new Date();

    logWatchdog(`[watchdog:${session}] recovery attempt ${recoveryAttempts}/${RECOVERY_CAP}`);
    notifyBoss('normal', `⚠️ agent-browser "${session}" frozen — auto-recovery attempt ${recoveryAttempts}/${RECOVERY_CAP}`);
    emitBusEvent('info', `agent-browser:${session}`, `Recovery attempt ${recoveryAttempts}/${RECOVERY_CAP}`);

    await recoverSession(session, lastUrl ?? null);

    consecutiveFails = 0;
    frozenSince = null;
    state = 'ok';
    lastOkAt = new Date();
    logWatchdog(`[watchdog:${session}] recovery complete — state → ok`);
    writeStatus(session, { state: 'ok', frozen_since: null, last_ok_at: lastOkAt.toISOString(), recovery_attempts: recoveryAttempts });
  }

  const interval = setInterval(() => {
    tick().catch(err => logWatchdog(`[watchdog:${session}] tick error: ${err}`));
  }, POLL_MS);
  // Don't prevent clean process exit
  interval.unref();

  return {
    stop(): void {
      stopped = true;
      clearInterval(interval);
      logWatchdog(`[watchdog:${session}] stopped`);
    },
    getStatus(): SessionStatus {
      return {
        state,
        frozen_since: frozenSince?.toISOString() ?? null,
        last_ok_at: lastOkAt.toISOString(),
        recovery_attempts: recoveryAttempts,
      };
    },
  };
}
