---
title: Theta wave cycle — Phase 7 action proposals (2026-04-24 05:33Z)
author: analyst
date: 2026-04-24T05:33Z
status: proposals for AM-brief user approval (auto_modify_agent_cycles not set → approval-gated)
boss_alignment: msgs 1777010732491, 1777010789174, 1777010811383 all green-lit
---

# Phase 7 action proposals

All 5 actions below are user-gated per `feedback_no_agent_self_approve` (auto-modify flag absent in analyst config.json). Executing as proposals, not direct cycle mods. Boss pre-aligned on all 5 across the Phase 6 conversation.

## Action 1 — MODIFY prospector cycle (pause, gated)

**Command for user approval:**
```bash
cortextos bus manage-cycle modify prospector --cycle outreach_conversion --enabled false
```

**Re-enable trigger (event-based, not date-based per boss nuance):**
Watch event log for `batch_1_sent` emitted by prospector. On observation:
```bash
cortextos bus manage-cycle modify prospector --cycle outreach_conversion --enabled true
```

**Rationale:** cycle is GATED not stale. 5 experiments, 3 discards, all null-result due to send-gate RED. Surface + metric are correct; volume is zero. Re-enable on event (batch ship), not calendar date (Apr 25 might slip with Gmail MCP re-auth timing).

**Interim watch responsibility:** analyst tracks batch_1_sent event; recommends re-enable to boss on observation. Not autonomous flip.

## Action 2 — MODIFY content cycle (raise target, add lede sub-surface)

**Command for user approval:**
```bash
cortextos bus manage-cycle modify content --cycle content-quality \
  --measurement "score 1-10 on opening-hook quality + single verifiable local fact as lede (snowfall, ice-out, water depth, etc). Target 9/10; 8/10 = baseline."
```

**Rationale:** content's own keep-rate trajectory (7 → 8) identified "single verifiable local fact as lede" as the 8-to-9 gap in its own learning note. Respecting the agent's own finding. Next cycle targets the specific refinement that the data flagged.

## Action 3 — CREATE analyst cycle (override_retrospective_match_rate)

**Command for user approval:**
```bash
cortextos bus manage-cycle create analyst \
  --cycle override_retrospective_match_rate \
  --metric override_retrospective_match_rate \
  --metric-type qualitative \
  --surface orgs/glv/agents/analyst/GUARDRAILS.md \
  --direction higher \
  --window 2w \
  --measurement "Per override event, log {pentester_reject_ts, user_override_ts, reason_enum, override_scope}. At 30d post-event per override, retro review: was override right (yes/no/mixed)? Aggregate match rate = keep score. Target >=80% = protocol calibrated; <60% = re-tune at cycle N+5." \
  --loop-interval "2w"
```

**Sample-size rule (flagged in hypothesis per boss caveat):**
> "N<3 at 2wk window → roll forward another 2wk rather than conclude early. Current baseline: 2 override events in fleet history (v2 ceremony pull + WP admin). First measurable conclusion window is 4-6wk, not 2wk."

**Pairing with boss's system-exp #5:**
Analyst's `override_retrospective_match_rate` (outcome-side, decision-layer) pairs with boss's `pentester_pre_commit_hypothesis_compliance` (prediction-side, sweep-scope layer) as triangulated pentester calibration. AM brief should surface together: "user picks {both default / either alone with reason}," not one-or-the-other.

## Action 4 — DEFER new seo cycle to May retainer launch

No command — deferred creation.

**Flagged for AM brief framework items (boss adding):** seo goals.md staleness — "awaiting first-boot onboarding" bottleneck is stale; actual blocker is WC REST key from Casey. Needs refresh before May retainer contract goes live. Framework item, not launch-critical.

## Action 5 — NO new cycles for dev / ads / scout / designer / imagegen / web-copy / pentester

No commands — acceptance of current operational modes.

**Rationale:**
- dev: operational-heavy on Reyco launch; experiments are registered but secondary. Revisit post-launch.
- pentester: first-week ramp; Sunday weekly scan is first measurable surface. Too early.
- ads: external-blocked (Meta BM) — no measurable cycle until unblocker.
- scout / designer / imagegen / web-copy: on-demand specialists; cycles don't fit their model without restructuring their invocation cadence (out of scope for this theta-wave).

## SKILL.md framework updates — COMPLETED DIRECTLY (own skill)

Already applied in Phase 7:
1. Phase 4 cycle_state enum {active, gated, stale, converged} added. Prospector cited as gated archetype.
2. "Load-bearing discard" pattern (seed-discard) added with `exp_1776665201_toiv0` as worked example.

Commit in-progress: next auto-commit cycle if working directory is git-tracked (theta-wave/SKILL.md is under orgs/glv/agents/analyst/.claude/ — likely gitignored by org-scope per phantom-endpoint catalog #5).

## Launch-adjacent note

Upstream commit b85cb69 (#184) merge-order question remains AM-brief launch-critical per prior note `upstream-sync-2026-04-24-am-brief.md`. Task B Option B + #184 bundling call is the user decision I cannot make overnight.

---

**End of Phase 7 proposals. Phase 8 score next.**
