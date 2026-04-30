---
title: Exp #7 — Cross-agent QC pilot (analyst → dev, next 3 PRs)
author: analyst
date: 2026-04-24T13:15Z
status: in flight; PR #1 of 3 = PR #14 (Option B) reviewed 2026-04-24T13:13Z
experiment_id: exp7_cross_agent_qc (system-experiments-2026-04-24.md §7)
---

# Exp #7 — Cross-agent QC pilot: analyst QCs dev's code

## Hypothesis

Cross-agent QC (analyst reviews dev's PR code before user merges) either:
(a) catches a merge-blocking issue at least once in 3 PRs, OR
(b) adds zero measurable cycle-time cost while producing a paper trail that informs future pattern-matching, OR
(c) degrades cycle time >20% — in which case the pattern doesn't scale and we pull back.

**Success criterion (boss-approved):** cycle time does NOT degrade >20% AND post-merge bugs trend down OR no change OR delta too small to measure — any of these keeps the option live.

## Measurement methodology

**Per-PR metrics:**
1. **Cycle time** = `(user_merge_ts - pr_open_ts)` in minutes.
2. **Post-merge bugs** = count of related bug-fix commits within 7d of merge, filtered by git log grep for PR # reference or file-touch overlap.
3. **QC friction** = dev's subjective friction rating (1-10) + my subjective rating (1-10), captured in reply-thread.
4. **QC findings count** = number of issues I flagged per PR (blocking vs non-blocking split).

**Baseline comparison:** avg cycle time of last 5 pre-pilot dev PRs (pre-2026-04-24) as the no-QC control.

## Pilot scope (locked)

- Target agent: **dev**
- Review depth: full diff read + spec-cross-ref
- Duration: next 3 dev PRs OR 7 days, whichever lands first
- No-go triggers: (a) dev friction rating ≥7/10 on any PR, (b) cycle time degrades >25% on 2 consecutive PRs, (c) user calls it off

## PR tracking

### PR #1 — cortextos #14 — Option B daemon patch

**Opened:** 2026-04-24T13:09Z (per dev msg 1777036139500)
**QC started:** 2026-04-24T13:10Z
**QC completed:** 2026-04-24T13:13Z (~3 min elapsed)
**QC verdict:** APPROVE with 2 non-blocking notes
**Findings:**
- Blocking: 0
- Non-blocking notes: 2 (writeFileSync vs atomic; N-rewrite batching micro-opt)
- Spec compliance: ✅ (Hermes guard + seed-without-overwrite, matches patch-spec §4.1)
**Dev response:** pending
**Merge status:** pending user merge decision
**Cycle-time bookkeeping:** will capture merge timestamp + delta when it lands.

**QC friction:** diff was small (~15 LOC), spec was already written, so review was fast. If PR #2 is bigger, calibration data-point on how review time scales with LOC.

### PR #2 — cortextos #15 — scout-specs bundle + ctx-watchdog + approval queued_at

**Opened:** 2026-04-24T16:38Z (per dev msg 1777048710974)
**QC started:** 2026-04-24T16:38Z
**QC completed:** 2026-04-24T16:40Z (~2 min elapsed)
**Diff size:** ~730 LOC / 12 files
**QC verdict:** APPROVE with 1 significant (non-blocking) + 3 non-blocking notes
**Findings:**
- Blocking: 0
- Significant (non-blocking, follow-up): 1
  - `src/daemon/ctx-watchdog.ts:21` — `MAX_CONTEXT_TOKENS = 200_000` hardcoded as "Sonnet 4.6 context window size". Threshold is model-relative. Haiku 4.5 (smaller window) will fire 55% alert too late; future Opus (potentially larger) too early. Suggest per-model lookup table driven by agent config.
- Non-blocking: 3
  1. `dashboard/src/app/api/approvals/pending/route.ts:57` uses `row.created_at` not new `row.queued_at` for age calc. Identical values today; diverge if semantics split later.
  2. `dashboard/src/app/api/proposals/adoption/route.ts:83-89` loads ALL proposal_adopted events with no date filter. Fine at current volume; scales poorly.
  3. Same file line 99: `meta.outcome ?? 'rejected'` silently mislabels missing metadata; prefer `'unknown'` + warn log.
- Spec compliance: ✅ (ctx-watchdog precompact alert, approval queued_at field with type extension, API route integration)

**Dev response:** pending
**Merge status:** pending user merge decision

**QC friction (self-rated):** 2/10 — diff was large but additive/isolated; most files were new or pure additions. Complex files (ctx-watchdog.ts new logic, two API routes) required careful read but no ambiguity.

**Calibration datapoint:** ~2 min / ~730 LOC = ~6 sec/LOC on additive diff. PR #1 was ~3 min / ~15 LOC = ~12 sec/LOC on patch-to-existing-logic. Per-LOC throughput tracks diff complexity, not size — useful signal for future effort estimation.

**Boss relay requested:** significant finding (MAX_CONTEXT_TOKENS model-hardcoding) to be posted as PR #15 review comment via Windows gh workaround (same path as PR #14).

### PR #3 — TBD

Next dev PR that opens after #2. Logged below when detected.

## Tracking logistics

**Discovery:** I'll monitor `processed/analyst/*-from-dev-*.json` inbox entries for "PR #" patterns, OR read `~/.cortextos/default/logs/dev/outbound-messages.jsonl` directly for dev's "PR ready" Telegram mentions.

**Baseline (last 5 pre-pilot dev PRs):** deferred — will pull via `git log --author="GLV Dev Agent"` after pilot ends so we have the control number.

## Friction capture protocol

After each QC complete:
1. Dev's rating (1-10, 1=frictionless, 10=blocking) → dev sends via agent-msg reply.
2. My rating (1-10, 1=easy, 10=rework-heavy) → self-recorded here.
3. Both go into final rollup at pilot end.

## Pilot completion report

Due 2026-05-01 (7-day cap) OR when PR #3 merges, whichever is first.

**Artifact:** `orgs/glv/agents/analyst/notes/exp7-qc-pilot-rollup-YYYY-MM-DD.md`

**Decision tree:**
- If success criteria met AND friction ≤5/10 both sides: propose extending to all dev PRs permanently + adding scout ↔ content pair.
- If cycle-time degrades 10-20%: evaluate if findings justified the slowdown. Scale back to "major PRs only."
- If friction ≥7/10 OR cycle-time degrades >20%: discard and document why.

---

**End of pilot setup. PR #1 reviewed; standing by for PR #2.**
