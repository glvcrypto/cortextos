---
title: Upstream b85cb69 verification — Option B writer presence check
author: analyst (Jerry)
date: 2026-04-26T08:55Z
status: definitive — Option B writer ABSENT in upstream/main
purpose: AM brief decision support for cycle-5 upstream sync (24 commits, 89 files)
---

# Verification: Does upstream/main include the cycle-4 Option B daemon-side writer?

## Question

b85cb69 (#169+#184 bundle) extends phantom-endpoint gap detection to cron-expression crons. Per cycle-4 narrative, applying b85cb69 ALONE expands the FP storm because no daemon-side writer was paired with it. Need to verify whether any commit between b85cb69 and upstream/main HEAD adds the missing writer.

## Methodology

1. Read cycle-4 Option B spec (notes/phantom-endpoint-gap-detector-patch-spec.md, section 4 + 4.1)
2. Grep upstream/main for `updateCronFire` callers
3. Inspect upstream/main src/daemon/agent-process.ts at scheduleGapDetection() (line 723) for hermes exemption
4. List commits between b85cb69 and upstream/main HEAD; inspect for writer-related descriptions

## Findings

**Finding 1: Daemon-side writer ABSENT.**

`git grep "updateCronFire" upstream/main` returns:
- `src/bus/cron-state.ts` — function definition (already there)
- `src/cli/bus.ts` — single call site, the existing CLI command (agent-call contract that was never honored)
- `tests/unit/bus/cron-state.test.ts` — unit tests
- **NO matches in src/daemon/**

Cycle-4 Option B spec required: `updateCronFire(stateDir, cron.name, cron.interval)` at the daemon's cron-injection site. That call does not exist in upstream.

**Finding 2: Hermes exemption ABSENT in scheduleGapDetection.**

upstream/main src/daemon/agent-process.ts lines 720-745:

```typescript
scheduleGapDetection(): void {
  const crons = this.config.crons;
  if (!crons || crons.length === 0) return;

  // Monitor recurring crons with either a parseable interval or a cron expression
  const monitorable = crons.filter(c => {
    if (c.type === 'once' || c.type === 'disabled') return false;
    if (c.interval && !isNaN(parseDurationMs(c.interval))) return true;
    if (c.cron) return true;
    return false;
  });
  // ...
}
```

scheduleCronVerification at line 690 has `if (this.config.runtime === 'hermes') return;` (correctly exempted). scheduleGapDetection at line 723 has NO matching exemption — would be the first line inside the function, but isn't there.

Cycle-4 Section 4.1 added this exemption as part of the same atomic patch.

**Finding 3: Commits between b85cb69 and upstream/main HEAD.**

`git log b85cb69..upstream/main --oneline` returns exactly ONE commit:
- eb119a9 fix(telegram): validate BOT_TOKEN and CHAT_ID against Telegram API before enable + setup writes .env (#235)

Telegram-only. No daemon writer landed in that gap.

## Verdict

**Option B writer = STILL ABSENT in upstream/main.**

Applying the upstream bundle as-is = unmodified Path B-blocked state from cycle-4. b85cb69 expands gap detection scope to cron-expression crons (covering ~90% of production crons per the commit message: autoresearch, morning-review, evening-review). With NO writer satisfying the broadened detector, the phantom-endpoint FP storm will EXPAND.

## AM brief decision-support framing for Aiden

A. **Skip the entire bundle** — defer until upstream merges Option B writer + hermes exemption.
   - Cost: lose telegram parse fix (5f1943e), crash guards (2ee1db2 + a803002), watchdog suite this week.
   - Benefit: zero phantom-storm risk.

B. **Cherry-pick safe commits** — apply telegram fixes, PTY null-write guards, watchdog suite, hermes runtime (post-scout-triage); EXPLICITLY exclude b85cb69 (#169+#184).
   - Cost: requires manual cherry-pick coordination; check-upstream tool is whole-or-nothing per SKILL design (need dev to drive selective apply).
   - Benefit: get all safe wins, keep storm contained.

C. **Apply bundle + immediately patch locally** — apply all 24 commits, then before next cron fire write Option B + hermes-exemption locally on top.
   - Cost: stacks a known-required local patch on a 24-commit merge; dev must land patch in same merge window.
   - Benefit: fastest path to all upstream features.

**Analyst recommendation: B.** Cleanest given dev still has expense-tracking work in flight on dashboard layer; merge-window risk for C is real.

## Cherry-pick decision matrix (all 24 commits)

Conflict-risk flagged where the commit touches files modified locally tonight (src/cli/bus.ts has my fetch-fx-rates addition; dashboard/* has dev's expense-tracking sprint; ecosystem.config.js has dev's cron registrations). Conflict size shown where >5 lines.

### CHERRY-PICK (apply — safe wins, low FP-storm risk) — 19 commits

| SHA | PR | Summary | Category | Conflict |
|---|---|---|---|---|
| eb119a9 | #235 | telegram BOT_TOKEN/CHAT_ID API validation before enable | security | — |
| 5f1943e | #181 | telegram HTML parse mode — eliminates silent content drops | safety (fixes tonight's byte-863 drop) | src/cli/bus.ts ~10L |
| 2ee1db2 | #196 | PTY write callback null-guard prevents daemon crash | crash safety | — |
| a803002 | #223 | worker PTY null-write + crash visibility | crash safety | ecosystem.config.js ~19L |
| ac7fb9e | #175 | rotate stdout.log at 50MB to prevent file-cache pressure | resource safety | — |
| a38ef7a | #217 | hard-restart sends IPC restart-agent to terminate session | restart correctness | src/cli/bus.ts ~19L |
| 657f3fa | — | handoff pickup as concrete tool call (not prose) | UX/restart | — |
| 9d3b92c | #197 | handoff doc on Tier 3 force-restart + elevate pickup priority | UX/restart | — |
| 737be8e | #194 | pre-arm .force-fresh at Tier 2 to break --continue loop | restart correctness | — |
| 49ecb3f | — | clear stale handoff deadline on new session | watchdog | — |
| fda2f98 | — | persist circuit breaker state across --continue restarts | watchdog | — |
| b9d45df | — | Tier 1 Telegram warning fires once per session only | watchdog UX | — |
| b6e4515 | #210 | CronCreate directly on boot to skip /loop cloud-prompt | boot correctness | — |
| 4de3246 | #174 | merge fix/ctx-watchdog-ux | watchdog (parent merge of 60a2677/b8a2901 path) | DEPENDS on 60a2677 |
| 259432e | — | restore getAgentDir/getConfig + consumeHandoffBlock | regression fix | — |
| b5608ba | — | AGENTS.md templates skip boot msg on handoff restarts | template/UX | templates/* (low risk on existing agents) |
| 519c195 | — | suppress boot message + cold-restart phrasing on handoff | UX | — |
| 3420b5b | #226 | test fix — relative timestamps in channels route test | test stability | dashboard test (~6L, low risk) |
| 113d2e7 | #183 | stagger gap nudges + guard duplicate cron verification | gap-detection narrowing (cycle-2 DISCARD on >=90% threshold but ~17% drop is still real) | — |
| 32013a7 | #176 | skip type=disabled cron entries in gap detector and verification | gap-detection narrowing | — |

(20 rows above — recount: 20 actually. See "DECISION-REQUIRED" below for the 60a2677/b8a2901 split.)

### EXCLUDE (skip — would expand FP storm) — 1 commit

| SHA | PR | Summary | Reason |
|---|---|---|---|
| b85cb69 | #169+#184 | extend gap detection to cron-expression crons | Verified — Option B writer ABSENT in upstream/main. Applying expands phantom-endpoint storm to ~90% of production crons (autoresearch, morning-review, evening-review etc). Block until upstream merges Option B writer + hermes exemption (cycle-4 Path B spec) OR until dev lands local Option B patch on top. |

### DEFER (apply later, separate window) — 1 commit

| SHA | PR | Summary | Reason |
|---|---|---|---|
| b94aa8f | — | Hermes agent runtime support (templates/hermes/* + src/pty/hermes-pty.ts) | Triggers scout's cycle-3 hermes-triage task at +48h post-apply. No urgency this week given Reyco-launch + RTK-pilot in flight. Apply when ready to spawn a hermes-runtime agent. |

### DECISION-REQUIRED (large scope + conflict risk — needs dev eyes-on) — 2 commits

| SHA | PR | Summary | Decision context |
|---|---|---|---|
| 60a2677 | — | feat(daemon): context-aware handoff + hard restart watchdog | 96-line change to src/cli/bus.ts. High conflict risk vs my tonight's fetch-fx-rates command (~15L) addition. Substantively changes fleet-wide restart behavior — Aiden flagged this category for "quiet-window apply, not mid-Reyco-launch." Recommend dev drive merge after Reyco launch settles. |
| b8a2901 | — | feat(daemon): context-aware handoff + hard restart watchdog | IDENTICAL commit message + 96L src/cli/bus.ts stat to 60a2677 — almost certainly the same content (likely original feature commit + rebased version, or PR #174 chain). Apply together with 60a2677 OR skip together. Need dev to confirm this is a duplicate-on-merge artifact. |

### Bundle-apply mechanism note

`cortextos bus check-upstream --apply` is whole-or-nothing per skill design. Cherry-pick path requires dev to manually `git cherry-pick <sha>` selected commits in order. Workflow:
1. Aiden approves the cherry-pick list
2. Dev creates a clean branch off current HEAD
3. Cherry-picks the 20 APPLY commits in topological order
4. Resolves the 4 conflict-flagged commits manually (5f1943e, a38ef7a, a803002, 3420b5b) — small enough scope to handle in single sitting
5. Tags 60a2677 + b8a2901 + b94aa8f for separate later merge
6. PR for review, npm install + npm audit + npm run build + npm test (per upstream-sync SKILL Step 4-5)
7. Merge

Estimated dev time: 30-60 min depending on conflict resolution complexity in src/cli/bus.ts overlapping fetch-fx-rates.

## Files referenced

- /home/aiden/cortextos/orgs/glv/agents/analyst/notes/phantom-endpoint-gap-detector-patch-spec.md (Option B spec, sections 4 + 4.1)
- /home/aiden/cortextos/orgs/glv/agents/analyst/notes/exp3-phantom-fp-baseline-2026-04-24.md (Exp #3 baseline)
- /home/aiden/cortextos/orgs/glv/agents/analyst/experiments/learnings.md (cycle-4 Path A/B analysis)
- upstream/main src/daemon/agent-process.ts:690-745
- upstream/main src/bus/cron-state.ts (writer definition)
- upstream/main src/cli/bus.ts (existing CLI caller — agent-call contract)
