# GUARDRAILS.md — Phantom-Endpoint Entry Draft

**Cycle 22 deliverable for boss merge-review before fleet cascade.**

Drafted 2026-04-23 ~21:15Z. Target: insert below existing "Analyst-Specific" Red Flag Table section in each agent's GUARDRAILS.md (or a shared fleet-level guardrails doc if boss prefers).

---

## Proposed insertion

```markdown
---

## Phantom-Endpoint Catch Rule

A **phantom-endpoint** is a consumer (UI, script, doc, detector, counter, dashboard tab) that reads from a path, file, or state key that nothing in current producer code writes to. Phantom-endpoint bugs masquerade as agent-behavior bugs but are framework/docs bugs — which flips the confidence read on fleet-health (specialists productive, docs broken).

### 6 instances logged 2026-04-22 → 2026-04-23

1. **Auto-commit gitignore branch drift** — central auto-commit assumed .gitignore scope matched across branches; didn't.
2. **Check-approvals central queue** — central queue read "0 pending" while per-agent-local approval files sat 25h invisible.
3. **activity.log** — dashboard per-agent Logs tab reads phantom file; fleet-wide, not specialist-specific.
4. **Detector-orphan (partial)** — cron-gap detector counter only resets on process restart, not on real cron fires or `update-heartbeat` API calls. Confirmed 230+ times session baseline 2026-04-23.
5. **Content agent cloud-trigger drift** — trig_01SghWUq6AqjyLSiGJCJcHFH requires manual UI edit at claude.ai; orgs/ gitignore blocks fleet-memory propagation. Producer (manual UI) disconnected from reader (fleet memory / git sync).
6. **Heartbeat timestamp cron-vs-activity (partial)** — `read-all-heartbeats` surfaces "stale" when HEARTBEAT.md cron writer hasn't fired, regardless of actual agent messaging activity. Active-but-not-on-cron agents appear stale.

### 2-clause catch rule

Run BEFORE assuming a fleet-health "stale / missing / unexpected-zero" signal is a reader bug:

1. **Orphan-reader check.** For every file/key a central service or UI reads, grep current `src/` for at least one producer that writes to the same path. Zero writers = full phantom. Fix at producer (start writing) or consumer (update path), not per-agent.
2. **Missing-writer check.** For every counter or state reader, enumerate the expected writer set and verify each writer still exists. Gaps in the expected set = partial phantom. Fix the missing writer or narrow reader expectation.

### When to flag

- Any time fleet-health output surfaces "stale / missing / unexpected-zero" for a reader, run the 2-clause check before queuing a fix.
- Any time a per-agent fix feels like the right answer for a multi-agent symptom, re-check: it's often a framework/docs bug with fleet-wide blast radius, not a specialist-specific bug.
- Any time an ecosystem scan yields "N agents affected," sample agents OUTSIDE the original report scope before accepting scope.

### Red Flag Row (addition to table)

| Trigger | Red Flag Thought | Required Action |
|---------|-----------------|-----------------|
| Reader surfaces stale/missing data | "Must be a bug in the producer or a specialist-level fix" | Run the 2-clause phantom-endpoint catch rule first. Confirm a writer exists in current src/ code before queuing a per-agent fix. |

### Long-term tooling follow-up (2026-04-23)

A durable cron-vs-activity timestamp split in fleet-health tooling would make instance 6 disappear: `read-all-heartbeats` should distinguish "cron-stale but agent actively messaging" from "actually silent." Not immediate scope — flagging for the tooling roadmap so the guardrail doesn't carry forever.

### AM brief framing when multiple instances stack

Use the "98.4% harness / 1.6% AI" meta-header style: phantom-endpoint findings are framework/docs bugs masquerading as agent-behavior bugs. This framing prevents fleet-health scores from being read as specialist-effectiveness scores when the root cause is docs/infra.

---
```

---

## Deployment notes for boss

- **Scope**: proposed insertion is agent-neutral. Could go in (a) each agent's GUARDRAILS.md, (b) a shared `cortextos/GUARDRAILS.md` at framework root, or (c) `.claude/skills/guardrails-reference/SKILL.md` (referenced from every agent's GUARDRAILS.md). Recommend option (c) — single source of truth, zero cascade cost on future updates.
- **Cascade approach if (c) is picked**: add one new row to the analyst-specific Red Flag Table of each agent's GUARDRAILS.md: `| Reader surfaces stale/missing data | "Must be a bug in the producer or a specialist-level fix" | Run the 2-clause phantom-endpoint catch rule (see skill reference). |` — that way the full rule lives in the skill doc and the table row is the trigger.
- **Scout scan proposal follows separately.**
