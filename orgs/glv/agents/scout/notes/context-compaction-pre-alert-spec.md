# Context Compaction Pre-Alert at 55% — Implementation Spec
**Scout | For dev | User-approved Apr 24 2026**

---

## Problem

Agents currently reach the 70% context handoff threshold before compaction triggers, burning 30% of context before the system reacts. Hard restarts at 90%+ lose more session state than early compaction.

## Proposed Behavior

Add a pre-alert step to the CTX watchdog at 55% context utilization:

```
55% → Telegram alert to user: "Context at 55% — compact now or continue?"
60% → existing Tier 1 warning (no change)
70% → existing handoff threshold (no change)
90% → existing hard restart (no change)
```

The 55% alert is advisory only — user chooses. If user ignores, normal thresholds proceed unchanged.

## Implementation

### In `src/daemon/ctx-watchdog.ts` (or equivalent)

Add a new threshold constant:

```typescript
const CTX_PRECOMPACT_THRESHOLD = 0.55;  // 55%
```

In the watchdog tick function, before the existing Tier 1 check:

```typescript
if (ctxPercent >= CTX_PRECOMPACT_THRESHOLD && !this.precompactAlertSent) {
  this.precompactAlertSent = true;
  await sendTelegram(
    chatId,
    `Context at ${Math.round(ctxPercent * 100)}% on ${agentName}. Compact now for a clean snapshot, or continue. Reply "compact" to trigger, or ignore to continue.`
  );
  await logEvent('action', 'ctx_precompact_alert', 'info', {
    agent: agentName,
    ctx_percent: ctxPercent
  });
}
```

Reset `precompactAlertSent = false` on session start.

### Telegram command handler

If user replies "compact" → trigger `/compact` equivalent (or instruct agent to compact in next turn).

This can be a simple keyword check in the fast-checker message handler:

```typescript
if (message.text?.toLowerCase() === 'compact') {
  // inject compact instruction into agent PTY
  pty.write('/compact\r');
}
```

### State flag

`precompactAlertSent: boolean` on AgentProcess — prevents repeat alerts for the same session at the 55% threshold. Reset on restart.

---

## Notes

- Aligns with VILA-Lab harness pattern #1 (5-stage graduated compaction) already adopted by boss
- The 55% threshold is conservative — leaves 15% headroom before Tier 1 fires, enough for a clean compaction snapshot
- No change to existing thresholds or restart behavior
- The alert is Telegram-only (no dashboard action needed for v1)
- If user is AFK, the existing Tier 1 / handoff / restart chain proceeds normally — this is advisory only

## Files likely to touch

- `src/daemon/ctx-watchdog.ts` — add threshold + alert logic
- `src/daemon/agent-process.ts` — add `precompactAlertSent` state flag
- `src/daemon/fast-checker.ts` — add "compact" keyword handler (optional, v2)

---

*Spec v1.0 | Scout | Apr 24 2026*
