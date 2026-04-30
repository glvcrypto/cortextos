---
title: Exp — RTK token-reduction pilot
author: analyst
date: 2026-04-25T16:50Z (updated 2026-04-25T20:50Z post-pentester verdict)
status: PATH A SELECTED 2026-04-25T21:00Z — scout v1 (48h) → dev v2 if v1 KEEPs. Awaiting Exp #4 close (2026-04-26 14:00Z) + pentester scout-config review + user final pre-install GO.
gate: Exp #4 close (Sun 14:00Z) → pentester scout-config review (~30 min) → user explicit pre-install GO
---

# Exp — RTK token-reduction pilot on dev

## Hypothesis

Installing RTK on the dev agent reduces token consumption per session by ≥30% (vs the 60-90% claim — we apply a conservative half-haircut for our custom `cortextos bus` commands not being in RTK's default ruleset). Either:

- (a) Token reduction ≥30% AND session-length ≥50% extension → KEEP, plan fleet-wide rollout
- (b) Reduction 10-29% → KEEP only on heaviest-consumer agents (dev, boss); skip on standby agents
- (c) Reduction <10% → DISCARD; effort doesn't justify the install/maintenance burden
- (d) Any agent-breaking regression (parser-corruption, missing data in output, hook conflicts) → IMMEDIATE DISCARD

## Pilot agent options (post-pentester C2 + dev-vs-scout framing)

Pentester C2 hard-rules OUT: boss, analyst, pentester, prospector-while-handling-SMTP-creds.
Cleared candidates: **dev** (when not handling client creds) OR **scout** OR **designer**.

### Path A — Phased: scout v1 → dev v2 (pentester's lean, lowest-risk-first)

**v1 (scout, 48h):**
- Moderate CLI consumer — grep/curl/web research, still meaningful compression signal
- Low secret-touching probability; blast radius if RTK zero-day = research notes not deploy keys
- Goal: behavioral stability + signal validation (does ≥30% reduction hold across diverse traffic)

**v2 (dev, 48h, only if v1 KEEP):**
- Heaviest consumer = real economics test
- Inherits all v1 calibration; risk class jumps to creds-touching but mitigated by C7
- Goal: confirm fleet-wide rollout is justified

Total elapsed: ~5 days (4d pilot + buffer). Highest rigor, slowest decision.

### Path B — Single-shot: dev with C7 exclude-pattern (user's spec original, fastest)

- Heaviest CLI consumer → biggest measurable delta → fastest signal in 48h
- Requires C7 (Stage 2 exclude-pattern enforcement audit, ~30 min, pre-install)
- Risk: exclude-pattern edge-case bypass detected at C7 → fall back to Path A
- C7 spec: pentester audits src/discover/ + src/cmds/exclude* — verify regex-based + case-insensitive + full-command-line matching against `.env*`, `*credential*`, `*secret*`, `*key*`, `*.pem`, `*.crt`. Bypass present → C7 fails → Path A.

Total elapsed: ~2 days (or ~30 min + 2d if C7 passes; ~30 min wasted then Path A if C7 fails). Lower rigor on agent-risk, faster on signal.

### Path C — designer

- Cleared but low-volume; probably not enough signal in 48h
- Skip unless dev AND scout are both off the table

### Decision frame for user

- Goal "maximum-info pilot, single-cycle decision" → **Path B (dev + C7)**
- Goal "lowest-risk first install, phased rigor" → **Path A (scout v1 → dev v2)**
- Pentester's lean: **Path A** (conservative).
- Analyst's lean: **Path B** if user comfortable with C7 exclude-pattern; otherwise **Path A**.

## Pre-install gates (BLOCKING — do not proceed until ALL clear)

1. ✅ Pentester audit verdict: GO-WITH-CONDITIONS (2026-04-25, full text /tmp/pentester-rtk-verdict-and-delta.txt)
2. ⬜ User agent-choice (Option A dev / Option B scout / Option C designer)
3. ⬜ User explicit greenlight on install (per feedback_no_agent_self_approve)
4. ⬜ Exp #4 closed (2026-04-26 14:00Z) — pilot must NOT corrupt fleet-wide latency experiment
5. ⬜ Backup/snapshot of pilot agent's current state (fall-back if RTK breaks)

## Install procedure (post-clearance, conditions-incorporated)

1. **Install via cargo (NOT brew, NOT curl|sh)** per C1:
   ```
   cargo install rtk --version 0.37.2
   ```
2. **Project-scoped init** per C3 — use `rtk init` (NOT `rtk init -g`) to scope the hook to the pilot agent's working directory only.
   - If `-g` is required for any reason: immediately edit `~/.claude/RTK.md` to a minimal stub ("RTK installed, no special instructions") to prevent global system-context injection.
3. **Telemetry default-off** per C4 — do NOT pass `--enable-telemetry` or `--opt-in` flags during install.
4. **Verify hook target** — confirm which Claude Code config file rtk modifies (`~/.claude/settings.json` per audit); add to upstream-sync watch list and check ~/.claude/settings.json.bak was created.
5. Restart pilot agent (soft restart — preserve conversation history).
6. Confirm `rtk` is on the pilot agent's PATH and hook is active by running `git status` and checking the agent's session jsonl for the rewrite signature.

## Uninstall procedure (per C6)

1. `rtk init --uninstall` (or `-g --uninstall` if global was used).
2. **Manual cleanup**: `rm ~/.claude/settings.json.bak` (NOT removed by rtk uninstall).
3. `cargo uninstall rtk` (binary removal is decoupled from hook removal).
4. Restart pilot agent and verify hook is gone from session traces.

## Measurement methodology

### Primary metric: tokens per task

Source: dev's `~/.claude/projects/<encoded-dir>/<session>.jsonl`
Each entry has `usage.input_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`.
Total per turn = sum of all three.

Baseline (pre-install): sum tokens across the 48h pre-install window, divide by task count.
Post-install: same calculation, post-install 48h window.
Delta = `(baseline - post) / baseline`.

### Secondary metric: session length before context-exhaustion

Source: timestamps of dev's session_start events (from analytics/events) and agent_manager hard-restart triggers.
Baseline: avg minutes between session starts in the pre-install 7d window.
Post-install: same, post-install 48h window.

### Tertiary metric: regression count

Source: dev's `inbox-error-replies` + boss's escalation messages from dev.
Any "X command output looked wrong / unexpected / missing data" complaint is a regression.
Threshold: ≥1 regression with confirmed RTK-as-root-cause = immediate uninstall.

## Pilot timeline

- T+0h: install (post pentester clearance + user GO)
- T+24h: midpoint metrics check (early-discard if regression count ≥1)
- T+48h: full rollup, decision (keep / extend pilot / discard)
- T+48h+: if KEEP, propose fleet-wide rollout to user with per-agent risk tiering

## Risks and mitigations

**Risk 1: RTK hook intercepts something cortextos bus expects verbatim.**
Mitigation: pentester audit covers this in advance (point c — network behavior + hook scope). Pilot on dev only limits blast radius. Uninstall path documented.

**Risk 2: Token measurement noise from inter-agent traffic.**
Our token counts are highly variable per session based on what the agent does. 48h window may not be enough to clear noise. Mitigation: compare same-task-class deltas (e.g., "git status" specifically) where possible, not just total session tokens.

**Risk 3: Pilot interferes with active experiments (#3, #4, #7).**
Exp #4 is fleet-wide so ANY change to dev's behavior corrupts it. Mitigation: do not start RTK pilot until Exp #4 closes (final verdict 2026-04-26 14:00Z). 22h gap from now.

**Risk 4: Apache-2.0 sublicense terms incompatible with our code-touching agents.**
Pentester point f covers this. Apache-2.0 generally permissive but if RTK pulls in any GPL-licensed crates transitively, our agents' code changes could be tainted. Pentester to flag.

## Decision tree at T+48h

| Token reduction | Session extension | Regressions | Decision |
|---|---|---|---|
| ≥30% | ≥50% | 0 | KEEP — propose fleet-wide |
| ≥30% | <50% | 0 | KEEP on dev — pilot 2nd agent (boss) before fleet |
| 10-29% | any | 0 | KEEP on heaviest consumers only (dev, boss); skip standby agents |
| <10% | any | 0 | DISCARD — install/maintenance cost > benefit |
| any | any | ≥1 | DISCARD — uninstall immediately, post-mortem to learn |

## Open questions for user (post-pentester-clearance, pre-install)

1. Run pilot now during the Reyco-launch crunch, or wait until post-launch (~2026-04-27)?
2. If RTK requires sudo for install, that's a separate user-action ask
3. Pilot on dev assumes Exp #4 finishes first (14:00Z 04-26) — confirm timing OK

## Next actions

1. Wait on pentester verdict
2. If GO: surface to user with this spec + pentester findings + open questions
3. If NO-GO: archive this spec with the blocker reasons; revisit if RTK upstream addresses them
4. Track via task_<id> created 2026-04-25T16:50Z
