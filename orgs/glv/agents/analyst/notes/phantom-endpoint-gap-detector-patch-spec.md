---
title: Phantom-endpoint gap detector — root cause confirmation + patch spec
author: analyst
date: 2026-04-24
status: DRAFT for boss review (Task B, overnight proposal #4, user green-lit 23:52 EDT Apr 23)
related_memory: project_phantom_endpoint_pattern.md (entry #4, detector-orphan CLASS)
scope: design only, no code — boss overnight guardrail
---

# Phantom-endpoint gap detector — patch spec

## 1. Root cause — confirmed by direct inspection (no hypothesis left)

The cron-gap detector is a **full phantom endpoint** (per phantom-endpoint catalog entry #4, detector-orphan CLASS).

### Reader (detector loop)
`src/daemon/agent-process.ts:741-812` — `runGapDetectionLoop()`:
```
const state = readCronState(stateDir);   // reads state/<agent>/cron-state.json
for (const cronDef of crons) {
  const record = state.crons.find(r => r.name === cronDef.name);
  lastFireMs = record ? Date.parse(record.last_fire) : loopStartedAt;  // fallback
  if (now - lastFireMs > intervalMs * 2.0) → emit gap-nudge
}
```
Runs every 10 minutes (`GAP_POLL_MS = 10 * 60 * 1000`), nudge suppressed for 1× interval after each fire.

### Expected producer (`updateCronFire`)
`src/bus/cron-state.ts:57-77` — writes `state/<agent>/cron-state.json` with `{name, last_fire: ISO8601, interval}`. Header doc (lines 10-14) explicitly states the contract:
> "1. Agent calls `cortextos bus update-cron-fire <name> --interval <interval>` at the end of each cron prompt execution."

### Actual producer set — EMPTY
Grep of the entire repo for `update-cron-fire` / `updateCronFire`:
- `src/bus/cron-state.ts` — defines the function
- `src/cli/bus.ts:1761-1768` — exposes the CLI command
- `tests/unit/bus/cron-state.test.ts` — unit tests only
- **Zero production call sites.** No HEARTBEAT.md, no SKILL.md, no agent CLAUDE.md, no daemon auto-write, no hook.

### Live confirmation
- `ls /home/aiden/.cortextos/default/state/analyst/` → no `cron-state.json` file (only `heartbeat.json` + `last-telegram-*`)
- Falls to `loopStartedAt` branch → lastFireMs = daemon boot time (2d4h ago per `cortextos status`)
- Observed counter: 3170-3194 min — matches daemon uptime exactly, increments by `GAP_POLL_MS` (10 min)
- Counter clusters identically across ≥7 cron types (heartbeat, nightly-metrics, auto-commit, check-upstream, check-approvals, slack-internal-digest, slack-client-digest) — because all of them read from the same empty file and fall to the same `loopStartedAt`

**Result:** every cron on every agent emits a forever-false-positive gap alert from daemon restart + 2× interval forward. The "2-hour-heartbeat" cron at 120 min interval trips first (at ~240 min uptime); 24h crons trip after 48h uptime. Post-restart rescue condition can never trigger because no writer updates the counter.

## 2. Why shared counter = class-level symptom

The "detector-orphan CLASS" framing in the phantom-endpoint catalog is correct: the missing-writer is a single function (`updateCronFire`), so the symptom replicates across ALL crons identically. Per-cron fixes would require N duplicate patches; the class-level fix is one hook in one place.

## 3. Patch options — three approaches, trade-off matrix

### Option A — Agent-side write (honour the documented contract)
Add `cortextos bus update-cron-fire <name> --interval <interval>` to every cron prompt's trailer, OR add a one-liner to HEARTBEAT.md and every other cron-invoked skill.

| Dimension | Value |
|---|---|
| Code change | None to daemon; 1 line per cron prompt + 1 line per cron-invoked skill (~15 touch points) |
| Requires | Agent cooperation; new agents must inherit the pattern |
| Failure mode | Forgotten in new crons → phantom re-emerges |
| Honours existing contract | Yes (docs already say this) |

### Option B — Daemon-side auto-write (close the loop in the producer that already knows)
When the daemon injects a cron prompt into the PTY, it writes the `last_fire` timestamp for that cron name at injection time. The daemon already knows which cron it's firing — capture the fact at source.

| Dimension | Value |
|---|---|
| Code change | ~10 lines in `agent-process.ts` cron-injection path |
| Requires | Nothing from agents |
| Failure mode | Injection-vs-execution skew — if cron injects but agent ignores/crashes, we record a fire that didn't produce work. Acceptable: gap detector's purpose is to catch "cron not firing at all," not "cron firing but agent not working" (the latter is a different problem, tracked via heartbeat staleness). |
| Honours existing contract | Overrides the documented agent-call contract, which is fine because that contract was never implemented |

### Option C — Read live scheduler state, drop the state file entirely
Query the scheduler (CronCreate/CronList in the Claude Code session) directly. `last_fire` becomes `lastInvocation` from the session's cron runtime. Delete `cron-state.json` and `updateCronFire` altogether.

| Dimension | Value |
|---|---|
| Code change | Daemon cannot reach session-internal state (cron runtime lives inside the Claude process). Requires an IPC hop (file-watch, named pipe, or a session-side hook writing state) |
| Requires | Session hook that writes whenever a cron fires internally; effectively reduces to Option A or B |
| Failure mode | Same as A or B depending on where the hook is placed |
| Honours existing contract | Supersedes it |

## 4. Recommended patch — Option B (daemon-side auto-write)

**Rationale:**
- Single code change, zero dependency on agent prompts
- Resilient to new agent spawns (framework-level fix, not per-agent)
- Consistent with cortextOS "framework, not agent responsibility" principle for infra plumbing
- Option A leaves a permanent risk surface (next cron added without the trailer → new phantom instance)

### Patch shape (agent-process.ts)

Locate the cron-injection site (where the daemon writes the cron prompt to the PTY). Before/after injection, call `updateCronFire(stateDir, cron.name, cron.interval)`. Pseudocode:

```typescript
// At cron-fire dispatch site (~wherever the daemon currently injects cron prompts)
async function dispatchCron(cron: CronDef) {
  // ... existing injection logic ...
  updateCronFire(stateDir, cron.name, cron.interval);  // <-- new line
}
```

The `updateCronFire` function is already atomic-safe (`writeFileSync` with formatted JSON). No new utility needed.

### Backwards compatibility
Keep `bus update-cron-fire` CLI command. Re-purpose it as "manual override / test helper" — strip the HEARTBEAT-contract language from the header doc to reflect reality.

### 4.1 Hermes runtime — additional patch scope (added post-scout finding 2026-04-24 03:30 UTC)

Scout's hermes-triage pass surfaced a companion surface of the same class. `scheduleCronVerification()` at `agent-process.ts:690` correctly exempts hermes runtime (`if (this.config.runtime === 'hermes') return;`) because hermes manages its own cron scheduler natively. `scheduleGapDetection()` at `agent-process.ts:723` has NO matching exemption.

Consequence: when a hermes-runtime agent spawns, gap detection will run, read the empty `cron-state.json`, fall through to `loopStartedAt`, and false-positive storm on a runtime where the entire concept of daemon-captured cron fires doesn't apply.

**Patch addition:** copy the hermes guard into `scheduleGapDetection`:
```typescript
scheduleGapDetection(): void {
  if (this.config.runtime === 'hermes') return;  // <-- new line, mirror of line 690
  const crons = this.config.crons;
  if (!crons || crons.length === 0) return;
  // ... rest unchanged
}
```

No hermes agents currently exist in the fleet — pre-emptive fix. Adding to Option B patch scope so it lands as one atomic change.

**Class-collapse note:** this is the THIRD confirmed surface of detector-orphan CLASS (after heartbeat/nightly-metrics/auto-commit/check-upstream cluster). NOT a new phantom instance — same root cause (empty cron-state.json, missing producer), just a runtime that the existing exemption path didn't cover. Catalog entry #4 receives baseline-evidence augmentation, not a new row.

## 5. Write/read parity verification — MANDATORY

After patch lands, verify that for every cron in every agent's `config.json`, the detector observes a fresh `last_fire` within one cron interval of when the cron is known to have fired.

### Test matrix (all agents × all crons)

1. **Pre-patch baseline snapshot:** capture current `cron-state.json` contents for each agent (likely empty or absent). Record daemon `loopStartedAt` per agent.
2. **Apply patch** (dev's work, not analyst scope).
3. **Trigger each cron manually** (daemon cron queue or `cortextos bus send-message <agent> high "<prompt>"` substitute) — one at a time, capture server-side timestamp.
4. **Read `cron-state.json`** within 30 seconds; confirm:
   - Record exists for the triggered cron
   - `last_fire` ISO timestamp matches trigger time ± 5 seconds
   - `interval` field matches config
5. **Wait 2× interval**, confirm NO gap nudge fires (detector must see the fresh timestamp and stay silent).
6. **Stop the cron** (remove from config.json, CronDelete), wait 2× interval, confirm nudge DOES fire (detector must correctly flag a genuinely missing cron — no regression on the real-positive case).

### Parity test pairs (per cron)
| Condition | Expected detector output |
|---|---|
| Cron fires on schedule, state file writes match | Silent (no nudge) |
| Cron fires but state write fails (fs error) | Nudge after 2× interval (acceptable: write failure is the disease) |
| Cron config removed, state file stale | Nudge after 2× interval (real positive) |
| Daemon restart, cron fires once post-restart | Silent after first post-restart fire |
| Daemon restart, cron does NOT fire post-restart | Nudge after 2× interval from restart |

### Verification artifact
New test file `tests/integration/daemon/cron-gap-parity.test.ts` (not in scope for this spec, but is required before merge). Covers the 5-row matrix above for at least 3 cron intervals (2h / 24h / 7d).

## 6. Rollout

1. Dev implements Option B on a branch (est. 30 min code + 1h test)
2. Pentester Tier 0 pre-finalization review (is the new state-file write a tamper surface? Low risk — state files already in gitignored runtime dir, but worth a look)
3. Stage on one agent first (analyst — I'm happy to be the canary), verify 2h heartbeat cycle produces fresh state in cron-state.json
4. Roll to fleet on next --continue restart (natural daemon refresh)
5. Close out phantom catalog entry #4 once 3× 24h cycles pass with zero FP nudges

## 7. Follow-ups (out of scope for this patch, but flagged)

- **Phantom catalog entry #6 (heartbeat cron-vs-activity drift):** separate from this patch. `read-all-heartbeats` surfaces "stale" when HEARTBEAT.md cron writer hasn't fired, regardless of actual agent messaging activity. Different reader, different producer, different file. Tracked separately.
- **Scout weekly phantom-endpoint scan (lands Sunday Apr 26):** this patch will retire entry #4; scout's next scan should confirm catalog shrinkage and log the close-out.
- **Framework-level pattern:** if Option B lands cleanly, codify "daemon captures intent, not agent self-report" as a phantom-prevention guideline in the shared guardrails-reference skill. Next-class prevention, not just this-class fix.

## 8. Open questions for boss / dev review

1. Write ordering — before injection, or after PTY confirms prompt delivery? Lean: **before injection**. If the agent crashes mid-prompt, we still want the "fire was attempted" record. Heartbeat staleness catches the agent-side failure.
2. Interval-parse failure behaviour — `parseDurationMs` returns NaN for cron-expression formats like `0 8 * * *`. Current detector silently skips NaN intervals (line 780: `if (isNaN(lastFireMs)) continue;`). Should the patch log a warning so we notice unsupported interval formats? Lean: **yes, one-time warning per cron per daemon session**.
3. Retention — `cron-state.json` grows monotonically with the cron set size, never prunes removed crons. Worth a periodic cleanup pass? Lean: **defer** — 7 crons × ~100 bytes = 700B, negligible; cleanup is optimisation that can land post-patch if we hit real scale.

## 9. Sign-off requirements

- Boss: approve Option B over A/C, approve leans on opens 1-3
- Dev: implement + write parity tests
- Pentester: Tier 0 review of new write path
- Analyst: track close-out of phantom catalog entry #4 in theta-wave cycle N+3 post-rollout

---

**End of spec. Task B (task_1777002444662_322) complete. Posting to #internal-agents alongside Task A per boss instruction.**
