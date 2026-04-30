---
title: Upstream sync — 7 commits pending for AM brief 2026-04-24
author: analyst
date: 2026-04-24T04:40Z
status: design note for AM brief; no apply action (night mode guardrail)
related_specs: orgs/glv/agents/analyst/notes/phantom-endpoint-gap-detector-patch-spec.md
---

# Upstream sync — 2026-04-24 04:40 UTC

Checked `git log HEAD..upstream/main` at 04:40 UTC. 7 commits queued. Night mode in effect (day_mode_start 08:00 America/Toronto; it is 00:40 EDT). Per skill SAFETY rule "NEVER apply during night mode," no apply attempted. This note is AM-brief fodder.

## Commit list

1. **eb119a9** `fix(telegram)`: validate BOT_TOKEN and CHAT_ID against Telegram API before enable + setup writes .env (#235)
2. **b85cb69** `fix(daemon)`: extend gap detection to cron-expression crons (#169) (#184) — **HIGH ATTENTION**
3. **5f1943e** `fix(telegram)`: switch to HTML parse mode — eliminates silent content drops (#181)
4. **b6e4515** `fix(daemon)`: use CronCreate directly on boot to skip /loop cloud-prompt (#210)
5. **a38ef7a** `fix(bus)`: hard-restart now sends IPC restart-agent to terminate the session (#217)
6. **a803002** `fix(daemon)`: guard worker PTY null-write + add crash visibility (#223)
7. **3420b5b** `fix(test)`: use relative timestamps in channels route test (#226)

## Commit-by-commit impact analysis

### b85cb69 — gap detection extends to cron-expression crons (HIGH ATTENTION)

**What it does:**
- Extends `scheduleGapDetection()` filter to monitor crons with `cron:` field in addition to `interval:` field
- Adds `cronExpressionMinIntervalMs(expr)` helper (every-N-min, every-N-hour, daily patterns; 48h fallback)
- Clamps `lastFireMs = Math.max(lastFireMs, loopStartedAt)` for the has-record branch (partial restart-storm mitigation)
- Updates nudge message to handle no-`/loop`-syntax for cron-expression crons

**What it does NOT do:**
- Does NOT add a writer for `cron-state.json`. `updateCronFire()` still has zero production call sites. Pre-existing phantom-endpoint catalog entry #4 root cause is untouched.
- Does NOT add the hermes runtime guard my Task B §4.1 proposes.

**Critical interaction with Task B patch spec:**
Applying #184 alone EXPANDS the phantom blast radius. Pre-#184: the detector-orphan class fires on ~7 `interval:` crons (heartbeat / nightly-metrics / auto-commit / check-upstream / slack-internal-digest / slack-client-digest / check-approvals). Post-#184: it also fires on `cron:` expression crons (my own theta-wave at `"33 1 * * *"`, and per commit body: `morning-review`, `evening-review`, `autoresearch`). Blast radius roughly doubles.

The `Math.max(lastFireMs, loopStartedAt)` clamp only helps the has-record branch. For the no-record branch — which is 100% of cases today because no writer exists — the clamp is a no-op. Phantom FP storm post-#184-without-Task-B is strictly worse than current state.

**Recommended merge order:**
- **DO NOT apply #184 alone to fleet.** Would amplify current phantom problem.
- **Apply #184 + Task B Option B bundled** (daemon auto-write at cron-injection site, ~10 LOC + §4.1 hermes guard 1 LOC) — closes the loop end-to-end.
- Alternative: apply #184 FIRST and accept short-term FP amplification if Task B bundle can land within 24h — boss call on risk appetite vs latency.

Request for dev: confirm Task B Option B implementation can ship within the #184 apply window. If yes → atomic bundle. If no → hold #184 until Task B ready.

### 5f1943e — Telegram HTML parse mode (MEDIUM)

Switches send-telegram.sh to HTML parse mode. Addresses silent content drops where Markdown special chars (`_*`[]`) would fail silently. Relevant to:
- Our saved memory `feedback_telegram_formatting.md` — user said avoid `*bold*`. HTML mode removes that constraint entirely.
- Recent backtick-expansion gotcha (my saved `feedback_shell_escape_send_message.md`) — orthogonal, this is about Telegram parsing, not shell escape.

Recommend apply + test on one agent (analyst) first; validate a Telegram send with formatting characters survives intact. Low risk.

### b6e4515 — CronCreate-direct on boot (MEDIUM)

Skips the `/loop` cloud-prompt dialog during session-start cron restoration. Relevant to CLAUDE.md Step 5 (Restore crons from config.json) — removes a failure mode where session restart could get stuck waiting on an interactive loop dialog. Good hygiene. Low risk.

### a803002 — worker PTY null-write guard + crash visibility (MEDIUM-HIGH)

Relevant to recent boss crash-cluster we've been tracking. Adds:
- Null-write guard for PTY (prevents a class of daemon crash on missing handle)
- Additional crash visibility logging

Should land before next boss restart-storm. Non-breaking. Recommend apply.

### a38ef7a — hard-restart sends IPC restart-agent (MEDIUM)

Changes `cortextos bus hard-restart` behaviour: now sends IPC signal to terminate the session, where previously it may have let the old PTY linger. Interacts with my `feedback_no_autonomous_self_restart` memory only insofar as it makes hard-restart more reliable WHEN user triggers one. Low risk.

### eb119a9 — validate BOT_TOKEN + CHAT_ID before enable (LOW for existing agents, HIGH for new spawns)

Adds Telegram API ping before `cortextos start <agent>` finishes. Catches "I mistyped the token in .env" class of error at enable time rather than on first message. Relevant to: any future agent spawn flow (pentester was a recent example that hit token issues during onboarding).

### 3420b5b — test fixture timestamp change (LOW)

Pure test hygiene. Non-breaking. Apply freely.

## Template / Skill / Community impact: NONE

All 7 commits are in `dashboard/`, `src/`, `tests/`, or `ecosystem.config.js`. No `templates/`, `skills/`, or `community/` changes — which means NO agent bootstrap files or skill prose shifts. Agents on current bootstrap files stay compatible. Good — removes the "did upstream change my SKILL.md out from under me" risk for this batch.

## Dashboard impact

~32 `dashboard/` files touched (pages, api routes, data lib). Size: 49 files changed / 1445 insertions / 3348 deletions across the whole batch. Net minus-1900 LOC suggests a dashboard refactor/consolidation underway upstream. Needs dev eyes before apply to confirm compatibility with any local dashboard customization. Separate from the framework fix-bundle risk.

## Recommended apply order for user review

1. **Day-mode only.** User is in bed; do not ping at night.
2. **Batch 1 (framework fixes — safe):** 3420b5b, a38ef7a, b6e4515, a803002, eb119a9 — pure daemon/bus/test fixes, no coupling to Task B.
3. **Batch 2 (Telegram):** 5f1943e — test on analyst first, then roll.
4. **Batch 3 (coupled — HOLD):** b85cb69 #184 — gate behind Task B Option B merge. If Task B lands same day, atomic bundle. If not, hold.
5. **Dashboard review (separate track):** dev should scan the 32 dashboard files for local-custom conflicts before batches 1-3 apply.

## Next action

- Ping boss agent-to-agent now with TL;DR so AM brief has it queued (internal comms, night-OK).
- Do NOT apply tonight.
- Do NOT Telegram user tonight.
- On AM brief landing, user decides merge order.

---

**End of note. No apply. Standing by for AM brief.**
