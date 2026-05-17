# crash_count_today daily-reset bug — investigation + fix

**Date:** 2026-05-17  
**Dispatch:** boss msg 1778992870222-boss-bbn1o  
**PR:** fix/crash-count-stale-reset  
**Status:** PR open — awaiting Aiden merge + pm2 restart

---

## Root Cause

The `.crash_count_today` file is never proactively cleared at UTC midnight. The reset is entirely lazy — it only fires when a crash event fires and calls `resetCrashCountIfNewDay()`. Between crashes (or across daemon restarts with no crashes), the file persists indefinitely with its last-crash date.

**Why this matters:** The stale file is misleading to direct readers (analyst, bus CLI). On disk today (2026-05-17) the fleet snapshot shows:

| Agent | logs/ file | state/ file |
|-------|-----------|------------|
| dev | `2026-05-14:2` | `2026-05-17:1` |
| pentester | `2026-05-14:1` | (absent) |
| imagegen | `2026-05-14:1` | (absent) |
| ads | `2026-04-28:3` | `2026-04-19:4` |
| scout/seo/designer/content/web-copy | `2026-04-25:10` | varies |

The `2026-04-25:10` entries are permanently-halted agents — they hit `maxCrashesPerDay=10` on April 25 and were never restarted. Their files will stay at `2026-04-25:10` forever without this fix.

---

## Two Independent Counters (path discrepancy)

There are **two separate `.crash_count_today` files** per agent, written by two different code paths:

| Writer | File path | Trigger |
|--------|-----------|---------|
| `src/daemon/agent-process.ts:717` | `~/.cortextos/default/logs/{agent}/.crash_count_today` | On crash, via `handleExit()` |
| `src/hooks/hook-crash-alert.ts:206` | `~/.cortextos/default/state/{agent}/.crash_count_today` | On session end (any type), via Claude Code hook |

These files are **independent**. They don't communicate. The daemon (`agent-process.ts`) re-seeds its in-memory counter from `logs/`. The hook reads from `state/` to report "crashes today" in Telegram alerts.

This creates a split-brain condition when cloud-session crashes happen: the Claude Code hook fires (updating `state/`), but `agent-process.ts` never ran (no local PTY) so `logs/` stays stale. That's exactly what we see for `dev` today — `state/dev = 2026-05-17:1` (cloud crash today) while `logs/dev = 2026-05-14:2` (last local crash, 3 days ago).

---

## Is the crash LIMIT enforcement broken?

**No — the per-day limit still works correctly.** When a crash fires:

1. `this.crashCount++` (in-memory increment)
2. `resetCrashCountIfNewDay(today)` reads the `logs/` file:
   - If `storedDate !== today` → `this.crashCount = 1` (reset)
   - If `storedDate === today` → `this.crashCount = parseInt(count) + 1` (accumulate)
3. Writes updated count back to file

The stale date guarantees a clean reset on the first crash of a new day. The limit logic is sound. The bug is **presentational** — the file stays dirty, confusing diagnostic reads.

---

## Fix

### Approach: Clear stale file at agent startup (logs/) and at session-end hook invocation (state/)

Chosen over a midnight cron because both natural lifecycle events already happen and don't require a new scheduled job.

**`src/daemon/agent-process.ts`** — new `clearStaleCrashCountFile()` called from `start()`:

```typescript
private clearStaleCrashCountFile(): void {
  const today = new Date().toISOString().split('T')[0];
  const crashFile = join(this.env.ctxRoot, 'logs', this.name, '.crash_count_today');
  try {
    if (existsSync(crashFile)) {
      const [storedDate] = readFileSync(crashFile, 'utf-8').trim().split(':');
      if (storedDate !== today) unlinkSync(crashFile);
    }
  } catch { /* ignore */ }
}
```

Called at `start()` after `this.stopRequested = false` — before PTY creation.

**`src/hooks/hook-crash-alert.ts`** — stale-clear before reading `countFile`:

```typescript
try {
  if (existsSync(countFile)) {
    const [storedDate] = readFileSync(countFile, 'utf-8').trim().split(':');
    if (storedDate !== today) unlinkSync(countFile);
  }
} catch { /* ignore */ }
```

Both changes are try/catch-wrapped and idempotent. No behavior change for same-day files.

### Alternatives considered

| Option | Verdict |
|--------|---------|
| Midnight UTC cron in daemon | More complete but requires a new timer + shutdown cleanup |
| Rolling 24h window via mtime | Handles edge case of crashes at 23:59, but adds mtime dependency |
| Rename to `.crash_count_all` + compute today | Changes the data model, requires consumer updates |

The startup-clear approach is minimal, surgical, and covers the 90% case. The path discrepancy (logs/ vs state/) is a separate structural issue — documenting it here but not fixing in this PR to keep scope tight.

---

## One-Shot Manual Reset (Aiden)

Run this to clear all stale crash count files across the fleet right now, without waiting for a restart:

```bash
find ~/.cortextos/default/logs ~/.cortextos/default/state -name ".crash_count_today" -exec sh -c '
  TODAY=$(date +%Y-%m-%d)
  content=$(cat "$1" 2>/dev/null)
  date_part="${content%%:*}"
  if [ "$date_part" != "$TODAY" ]; then
    echo "${TODAY}:0" > "$1"
    echo "RESET: $1  ($content -> ${TODAY}:0)"
  else
    echo "OK:    $1  ($content)"
  fi
' _ {} \;
```

This writes `today:0` into stale files (rather than deleting them) so the lazy-reset code still has a file to read on next crash. Safe to run while daemon is running — the file writes are atomic enough for this purpose.

---

## Deploy steps (post-merge)

1. `npm run build` (already passing)
2. `pm2 restart cortextos-daemon` — picks up new `dist/daemon.js` + `dist/hooks/hook-crash-alert.js`
3. Optionally run the one-shot reset above to clean fleet files immediately

The fix takes effect on the next agent startup after the daemon restarts.
