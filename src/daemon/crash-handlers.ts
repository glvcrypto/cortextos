/**
 * Daemon-level crash-storm detection + operator alerting.
 *
 * Tracks uncaughtException / unhandledRejection events in a 15-minute
 * sliding window.  When the count reaches CRASH_ALERT_THRESHOLD the
 * operator receives a Telegram alert so they can intervene before PM2
 * exhausts max_restarts and gives up entirely.
 *
 * Extracted from daemon/index.ts so the logic is unit-testable without
 * spawning a full daemon process.
 */

const CRASH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const CRASH_ALERT_THRESHOLD = 3;

const crashHistory: number[] = [];

/**
 * Record a crash event at the given timestamp (defaults to now).
 * Purges entries older than the 15-minute window.
 * Returns the number of crashes currently in the window.
 */
export function recordCrash(now: number = Date.now()): number {
  crashHistory.push(now);
  const windowStart = now - CRASH_WINDOW_MS;
  while (crashHistory.length > 0 && crashHistory[0] < windowStart) {
    crashHistory.shift();
  }
  return crashHistory.length;
}

/** Returns the number of crashes currently tracked in the sliding window. */
export function getCrashCountInWindow(): number {
  return crashHistory.length;
}

/** Reset history — used in tests and on clean daemon restart. */
export function resetCrashHistory(): void {
  crashHistory.length = 0;
}

/**
 * Send a Telegram operator alert when a crash storm is detected.
 * No-ops silently when BOT_TOKEN / CHAT_ID are absent.
 */
export async function sendOperatorAlert(err: unknown): Promise<void> {
  const botToken = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;
  if (!botToken || !chatId) return;

  const errStr = String(err).slice(0, 300);
  const msg =
    `🚨 DAEMON CRASH STORM: ${CRASH_ALERT_THRESHOLD}+ unhandled exceptions in 15 min.\n` +
    `Last error: ${errStr}\n` +
    `PM2 will stop after max_restarts=10 — check logs immediately.`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg }),
    });
  } catch { /* ignore send failures — network may be the root cause */ }
}
