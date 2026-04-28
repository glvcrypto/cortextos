/**
 * ctx-watchdog.ts — Context utilization pre-alert.
 *
 * Reads the agent's Claude Code session JSONL to estimate how full the
 * context window is. When it crosses CTX_PRECOMPACT_THRESHOLD (55%) for the
 * first time in a session, fires a Telegram advisory so the user can
 * trigger /compact before the automatic Tier-1 / handoff chain kicks in.
 *
 * Called from agent-manager.ts on a 2-minute interval after agent start.
 * The `precompactAlertSent` flag lives on AgentProcess and is reset on each
 * fresh start, so the alert fires at most once per session.
 */

import { closeSync, existsSync, openSync, readdirSync, readSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export const CTX_PRECOMPACT_THRESHOLD = 0.55;

/** Sonnet 4.6 context window size (tokens). */
const MAX_CONTEXT_TOKENS = 200_000;

/** How many bytes to read from the tail of the JSONL to find the latest usage. */
const TAIL_BYTES = 65_536; // 64 KB

/**
 * Estimate context utilization (0–1) by reading the tail of the agent's
 * active session JSONL file. Returns 0 if no session data is found.
 *
 * The total input sent to the API for the most recent turn equals:
 *   input_tokens + cache_read_input_tokens + cache_creation_input_tokens
 * That sum is the context window fill at that turn.
 */
export function computeCtxPercent(agentDir: string): number {
  // Claude encodes the project directory by replacing all '/' with '-'
  // (leading '/' becomes a leading '-').
  const encoded = agentDir.replace(/\//g, '-');
  const projectDir = join(homedir(), '.claude', 'projects', encoded);
  if (!existsSync(projectDir)) return 0;

  let latestFile: string | null = null;
  let latestMtime = 0;
  try {
    for (const f of readdirSync(projectDir)) {
      if (!f.endsWith('.jsonl')) continue;
      const fpath = join(projectDir, f);
      try {
        const { mtimeMs } = statSync(fpath);
        if (mtimeMs > latestMtime) {
          latestMtime = mtimeMs;
          latestFile = fpath;
        }
      } catch { /* unreadable — skip */ }
    }
  } catch { return 0; }

  if (!latestFile) return 0;

  let tail: string;
  try {
    const { size } = statSync(latestFile);
    const readSize = Math.min(TAIL_BYTES, size);
    const buf = Buffer.allocUnsafe(readSize);
    const fd = openSync(latestFile, 'r');
    readSync(fd, buf, 0, readSize, Math.max(0, size - readSize));
    closeSync(fd);
    tail = buf.toString('utf-8');
  } catch { return 0; }

  // Walk lines from the end, find the last entry with API usage data.
  interface UsageRecord {
    input_tokens?: number;
    cache_read_input_tokens?: number;
    cache_creation_input_tokens?: number;
  }
  let lastUsage: UsageRecord | null = null;
  for (const line of tail.split('\n')) {
    if (!line.includes('"usage"')) continue;
    try {
      const entry = JSON.parse(line);
      const usage: UsageRecord | undefined = entry?.message?.usage;
      if (usage) lastUsage = usage;
    } catch { /* malformed line — skip */ }
  }
  if (!lastUsage) return 0;

  const totalInput =
    (lastUsage.input_tokens ?? 0) +
    (lastUsage.cache_read_input_tokens ?? 0) +
    (lastUsage.cache_creation_input_tokens ?? 0);

  return totalInput / MAX_CONTEXT_TOKENS;
}

/**
 * Send a Telegram message via direct fetch. Best-effort — errors are swallowed
 * so a failed alert never crashes the watchdog interval.
 */
async function sendTelegram(botToken: string, chatId: string, text: string): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch { /* best-effort */ }
}

export interface CtxWatchdogDeps {
  botToken: string;
  chatId: string;
  agentName: string;
  agentDir: string;
  logEventFn: (category: string, eventName: string, severity: string, meta: Record<string, unknown>) => void;
}

/**
 * Run one watchdog tick. Called every 2 minutes by agent-manager.
 *
 * @param precompactAlertSent - current flag value from AgentProcess
 * @param setPrecompactAlertSent - setter to flip the flag on AgentProcess
 * @param deps - Telegram credentials + helpers
 */
export async function tickCtxWatchdog(
  precompactAlertSent: boolean,
  setPrecompactAlertSent: (v: boolean) => void,
  deps: CtxWatchdogDeps,
): Promise<void> {
  const ctxPercent = computeCtxPercent(deps.agentDir);
  if (ctxPercent <= 0) return; // no session data yet

  if (ctxPercent >= CTX_PRECOMPACT_THRESHOLD && !precompactAlertSent) {
    setPrecompactAlertSent(true);
    await sendTelegram(
      deps.botToken,
      deps.chatId,
      `Context at ${Math.round(ctxPercent * 100)}% on ${deps.agentName}. Compact now for a clean snapshot, or continue. Reply "compact" to trigger, or ignore to continue.`,
    );
    deps.logEventFn('action', 'ctx_precompact_alert', 'info', {
      agent: deps.agentName,
      ctx_percent: ctxPercent,
    });
  }
}
