---
title: manage-cycle cross-agent routing bug — operational context block
author: analyst (Jerry)
date: 2026-04-27T07:35Z
purpose: User-facing context block for pentester's finding doc + dev-side patch description
status: definitive — to be folded into pentester's catalog #4 vector finding
---

# Operational context: manage-cycle cross-agent routing bug

## Theta-wave Phase 7 implications

The analyst's theta-wave protocol (`.claude/skills/theta-wave/SKILL.md`) Phase 7 expects to execute cross-agent cycle modifications: pause stale cycles, modify metric definitions, create new cycles for any agent in the fleet, remove converged cycles. The whole point is fleet-level cycle hygiene driven from a central agent (analyst) with cross-agent write authority.

The CLI surface (`cortextos bus manage-cycle <action> <agent> [opts]`) is consistent with this Phase 7 expectation — `<agent>` parameter naming reads as "the target agent whose cycles you're managing." Theta-wave SKILL Phase 7 examples invoke this CLI assuming the routing actually happens.

**The implementation does not honor this contract.** `agentDir` resolves from caller's CWD (`env.agentDir || process.cwd()` at src/cli/bus.ts:797); the `<agent>` argument is passed forward as a metadata field stored inside the cycle record. Filesystem reads/writes follow CWD; the `<agent>` arg does not route.

Net consequence: every theta-wave Phase 7 cross-agent cycle modification across cycles 1-6 has been a silent dual-failure (target gets nothing, caller gets the action). Same-agent calls (caller's CWD = named agent) work correctly because the misleading param happens to match actual routing. Cross-agent calls fail silently 100% of the time, pre-detection.

## Blast radius bullets

- **Confirmed silent dual-failure (Mode 1 + Mode 2 co-occurrent), reconciled tonight**: 3 calls (cycle-6 prospector — modify/create/remove during 04:55-06:10Z theta-wave run + mid-cycle correction)
- **Confirmed silent dual-failure, leaked-but-inert**: 1 call (cycle-2 scout ecosystem_scan_adoption — analyst attempted create from analyst CWD at 06:06:06Z; scout self-resolved at 06:08:24Z via independent create from scout CWD; analyst-local leak cleaned 2026-04-27T07:25Z)
- **Likely-never-ran (cycle-4 gated proposals)**: 3 calls (modify prospector, modify content, defer seo) — all approval-gated; no leaked artifacts in analyst config (other than scout cycle-2 entry); evidence-of-absence weighs toward "never executed." Pending user banking-confirm in AM brief.
- **Same-agent calls**: zero corruption (work-by-coincidence — caller CWD = target agent → param matches actual routing)
- **Silent-corruption rate on cross-agent calls pre-detection**: 100%
- **Detection mechanism that surfaced this**: prospector peer-substantiation question on bus-list output at 06:18Z, ~12min after Phase 7 reported complete. Same detection pattern as the load-bearing-claim-substantiation case earlier in the cycle (~3min latency on that one).

## Cycle-by-cycle table

| Cycle | Date | Action attempted | Target agent | Caller | Mode 1 (target no-op) | Mode 2 (caller corruption) | Reconciliation status |
|---|---|---|---|---|---|---|---|
| 1 | 2026-04-20 | (no cross-agent calls) | — | — | n/a | n/a | n/a |
| 2 | 2026-04-21 | create ecosystem_scan_adoption | scout | analyst | yes | yes (leaked, inert) | scout self-created correct version 2min later; analyst-local leak cleaned 2026-04-27T07:25Z |
| 3 | 2026-04-22 | (no cross-agent calls) | — | — | n/a | n/a | n/a |
| 4 | 2026-04-24 | modify prospector pause (proposal) | prospector | analyst | likely-never-ran | likely-never-ran | gated — pending user banking-confirm |
| 4 | 2026-04-24 | modify content cycle (proposal) | content | analyst | likely-never-ran | likely-never-ran | gated — pending user banking-confirm |
| 4 | 2026-04-24 | defer seo cycle (proposal) | seo | analyst | likely-never-ran | likely-never-ran | gated — pending user banking-confirm |
| 4 | 2026-04-24 | create override_retrospective_match_rate | analyst | analyst | n/a (same-agent) | n/a (same-agent) | works correctly; analyst-self-write |
| 5 | 2026-04-26 | (no cross-agent calls) | — | — | n/a | n/a | n/a |
| 6 | 2026-04-27 | modify reply_rate_by_hook_structure pause | prospector | analyst | yes | yes (leaked) | prospector ran modify from prospector CWD ~07:00Z; analyst-local leak cleaned 2026-04-27T07:00Z |
| 6 | 2026-04-27 | create outreach_conversion (underscore) | prospector | analyst | yes | yes (leaked) | analyst removed from analyst-local 2026-04-27T06:18Z |
| 6 | 2026-04-27 | remove outreach_conversion | prospector | analyst | yes (no-op on prospector) | yes (removed from analyst-local — but the entry only existed on analyst-local because of the create above) | self-cleaning artifact |
| 6 | 2026-04-27 | modify outreach-conversion (hyphen) pause | prospector | prospector | n/a (same-agent) | n/a (same-agent) | works correctly; landed on prospector config |
| 6 | 2026-04-27 | modify reply_rate_by_hook_structure pause | prospector | prospector | n/a (same-agent) | n/a (same-agent) | works correctly; landed on prospector config |

## Mode-1-Mode-2 co-occurrence annotation

Mode 1 (target-side no-op) and Mode 2 (caller-side silent-corruption) are not separable — they fire on the same write call, simultaneously, by mechanism. Mode 1 is "what was supposed to happen, didn't"; Mode 2 is "what actually happened, shouldn't have." Same call, two consequences.

"Inertness" of the leak is a CONSEQUENCE class, not a MODE class. Whether a leaked cycle has operational effect on caller depends on whether caller's runtime reads cycles tagged for other agents. Analyst's runtime does not — leaked entries are inert. Other agents (TBD) may have different runtime behavior; need per-agent verification.

## Cross-agent-only caveat

Same-agent calls (caller's CWD = named agent) work correctly. The misleading parameter happens to match actual routing. Bug surface is cross-agent only. This is what enabled the bug to persist across 6 cycles undetected — same-agent test paths passed (override_retrospective_match_rate self-creation in cycle 4 worked fine), masking the cross-agent failure mode.

This is itself a meta-pattern worth surfacing: "API works on the test path that matches caller-context; fails silently on the path the test path does not exercise." Adjacent to the convention-with-misleading-API risk-amplifier — both are cases where the API surface-promise is true on a subset of inputs but false on a different subset, and the failing subset is the one that would otherwise trigger detection.

## Convention-with-misleading-API risk-amplifier

Per pentester's catalog #3 vector framing: convention-with-misleading-API surface is WORSE than pure convention because operator can't even know convention is load-bearing — API suggests a control exists. Pure convention has honesty-of-discipline ("we agreed to do this manually"); misleading-API has a false-positive of perceived-control ("the param exists therefore it must work").

For dev/scout patch design: framework should standardize "params that look like routing but aren't" as a code-smell. Detection in code review: any CLI parameter named `<target>` / `<agent>` / `<scope>` should either route on that param OR not exist. Same-name-different-semantics (where param is metadata-only) is the smell.

## Fix recommendation summary (input to dev, not normative)

- **v1 ship**: option (2) validate-and-reject mismatch — fail loudly when caller's resolved agentDir's agent name ≠ `<agent>` arg. Preserves backward-compat for correct callers, surfaces silent corruption with explicit error.
- **v2 design**: option (1) honor-routing — `<agent>` arg overrides agentDir resolution for cross-agent management; gated by permission allowlist (analyst + boss can manage any agent's cycles; other agents own-cycles only).
- **Tracking issue must explicitly note v1→v2 path** — without that, v2 stays unfunded and v1 becomes permanent half-fix that preserves the misleading-API surface.

## References

- src/cli/bus.ts:780-817 (manage-cycle action handler)
- src/bus/experiment.ts:120 (loadExperimentConfig — resolves config path from passed agentDir)
- orgs/glv/agents/analyst/.claude/skills/theta-wave/SKILL.md (Phase 7 cross-agent cycle expectations)
- orgs/glv/agents/pentester/.claude/skills/convention-vs-control-ledger/SKILL.md (Case #3 ROOT — warning-copy-as-control)
- orgs/glv/agents/analyst/memory/2026-04-27.md (cycle-6 mid-cycle correction PART 2 entry)
- orgs/glv/agents/analyst/notes/theta-wave-cycle-phase7-actions-2026-04-24.md (cycle-4 Phase 7 proposal commands; basis for "likely-never-ran" classification)
