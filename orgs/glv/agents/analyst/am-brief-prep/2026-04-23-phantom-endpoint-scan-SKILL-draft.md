---
name: phantom-endpoint-scan
description: "You are running the weekly phantom-endpoint sweep on the cortextOS codebase. A phantom-endpoint is a consumer (UI, script, doc, detector, counter) that reads from a path, file, or state key that nothing in current producer code writes to. The scan catches framework/docs bugs masquerading as agent-behavior bugs. Execute the 4-tier sweep, produce JSON + markdown reports, surface new phantoms to analyst with full producer/consumer evidence. Do not propose fixes per-agent — phantom fixes land at the producer or consumer, not at specialists."
triggers: ["phantom-endpoint scan", "weekly phantom sweep", "ecosystem audit", "producer/consumer check", "orphan-reader check", "missing-writer check"]
---

# Phantom-Endpoint Scan

**Drafted by analyst 2026-04-23 for boss + user merge-review. Not yet active — scout does not run this until user green-lights cascade.**

You are scout, running a weekly sweep of the cortextOS codebase to catch phantom-endpoints before they drift into fleet-health noise.

## What a phantom-endpoint is

A **phantom-endpoint** is a consumer (UI, script, doc, detector, counter, dashboard tab) that reads from a path, file, or state key that nothing in current producer code writes to.

Two sub-variants:
- **Full phantom**: zero writers exist in current `src/`. Fix: update reader path OR start writing at producer.
- **Partial phantom**: expected writer set has gaps. Fix: add the missing writer OR narrow reader expectation.

## Why this catch rule matters

Phantom-endpoint bugs masquerade as agent-behavior bugs. Without the catch rule, fleet-health "stale / missing / unexpected-zero" signals trigger per-agent investigations that waste cycles and undercount blast radius. With the catch rule, phantoms land as framework/docs bugs with fleet-wide fix paths — cheaper to resolve, correctly scoped.

### 6 instances logged 2026-04-22 → 2026-04-23 (baseline)

1. **Auto-commit gitignore branch drift** (2026-04-22, full) — central auto-commit assumed .gitignore scope matched across branches; didn't. Phantom at branch-scope expectation.
2. **Check-approvals central queue** (2026-04-22, full) — central queue read "0 pending" while per-agent-local approval files sat 25h invisible.
3. **activity.log dashboard tab** (2026-04-22, full) — dashboard per-agent Logs tab reads a file nothing in `src/bus/` writes to. Actual event writer: `log-event` → `~/.cortextos/*/analytics/events/<agent>/YYYY-MM-DD.jsonl`.
4. **Detector-orphan (partial)** (2026-04-22) — cron-gap detector counter resets only on process restart, NOT on real cron fires or `update-heartbeat` API calls. Direct confirmation 2026-04-23: counter climbed past 2700 min across ~20 active cycles while heartbeats fired and API was called on every cycle.
5. **Content agent cloud-trigger drift** (2026-04-23, full) — trig_01SghWUq6AqjyLSiGJCJcHFH requires manual UI edit at claude.ai; orgs/ gitignore blocks fleet-memory propagation. Producer (manual UI) disconnected from reader (fleet memory / git sync).
6. **Heartbeat timestamp cron-vs-activity (partial)** (2026-04-23) — `read-all-heartbeats` surfaces "stale" when HEARTBEAT.md cron writer hasn't fired, regardless of actual agent messaging activity. Active-but-not-on-cron agents appear stale.

## The 4-tier scan

### Tier A — Dashboard readers

For each dashboard tab in `dashboard/` that reads from state/files:
1. Identify the path/key the component reads.
2. Grep `src/` for a producer that writes to the SAME path.
3. Record: `consumer`, `expected_producer_path`, `status` (ok | full_phantom | partial_phantom), `evidence`.

Known pairs (sweep these explicitly each scan):
- Activity feed → `src/bus/log-event.ts` → `~/.cortextos/*/analytics/events/<agent>/*.jsonl`
- Per-agent Logs tab → agent stdout/stderr loggers → `~/.cortextos/*/logs/<agent>/activity.log` (known phantom #3)
- Approvals queue tab → `src/bus/create-approval.ts` → central queue (known phantom #2)
- Heartbeats tab → `src/bus/update-heartbeat.ts` + HEARTBEAT.md cron → heartbeat store (known phantom #6 partial)
- Deploys page → GitHub Actions webhook ingest → deploy event store
- Experiments tab → `src/bus/manage-cycle.ts` + evaluate-experiment → experiment store

### Tier B — Bus script readers

For each bus script in `src/bus/` that reads state, enumerate expected writers and verify each exists in current code.

Known pairs (sweep these explicitly each scan):
- `read-all-heartbeats` ← `update-heartbeat`
- `check-inbox` ← `send-message`
- `list-approvals` ← `create-approval` (known phantom #2)
- `list-tasks` ← `create-task` / `update-task`
- `list-experiments` ← `manage-cycle create` + evaluate-experiment
- `gather-context` ← per-cycle experiment runners
- `collect-metrics` ← all event loggers
- Auto-commit ← .gitignore per-branch scope (known phantom #1)

### Tier C — CLAUDE.md / skill documented paths

For every path referenced in `CLAUDE.md` files across the repo OR in `.claude/skills/*/SKILL.md`:
1. Extract the path with a grep over `*.md` for `~/.cortextos/`, `src/`, or similar path patterns.
2. For each extracted path, grep `src/` for a writer that produces the referenced artifact.
3. Flag documented-but-unwritten paths as phantom by documentation.

**Scope: sweep all initially.** Boss's call 2026-04-23: cortextOS is small enough that full enumeration is a one-time cost; capping risks missing the phantom you most want to catch.

### Tier D — Counter/state readers

For every counter or state reader (cron-gap detector, stale-heartbeat detector, idle-detector, any polling script):
1. Enumerate expected writer set from current code.
2. Grep current code for each expected writer.
3. Flag gaps = partial phantoms.

Known pair: cron-gap detector counter (known phantom #4 detector-orphan — resets only on process restart, not on real cron fires or `update-heartbeat` API).

## Execution steps

### Step 1: Gather baseline

```bash
# Read the known-phantom manifest — these are expected to confirm each scan
cat ~/.cortextos/$CTX_INSTANCE_ID/analytics/reports/phantom-endpoint-scan-*.json 2>/dev/null | tail -1
```

If no prior scan exists: the baseline is the 6-instance starting state listed above in "6 instances logged 2026-04-22 → 2026-04-23".

### Step 2: Execute 4 tiers

Run each tier in order. For each pair, record the verdict into a working JSON structure.

**Use Grep tool aggressively.** This is a static-analysis scan — no runtime checks. Example grep pattern for Tier B:
```
pattern: "functionName.*writes.*path" or just the string literal of the path/key
path: src/bus/
output_mode: content
```

### Step 3: Build reports

**JSON report** at `~/.cortextos/$CTX_INSTANCE_ID/analytics/reports/phantom-endpoint-scan-YYYY-MM-DD.json`:

```json
{
  "scan_date": "YYYY-MM-DD",
  "scanner": "scout",
  "tier_a_dashboard": [
    {"consumer": "path", "expected_producer": "src/path", "status": "ok|full_phantom|partial_phantom", "evidence": "grep snippet or reason"}
  ],
  "tier_b_bus": [...],
  "tier_c_claude_md": [...],
  "tier_d_counters": [...],
  "new_phantoms_found": 0,
  "existing_phantoms_confirmed": [1,2,3,4,5,6],
  "existing_phantoms_fixed": [],
  "scan_runtime_seconds": 0
}
```

**Markdown summary** at the same directory, `.md` extension:

```markdown
# Phantom-Endpoint Weekly Scan — YYYY-MM-DD

- **New phantoms found**: N
- **Existing phantoms confirmed**: [list]
- **Existing phantoms fixed since last scan**: [list]
- **Pairs swept**: N
- **Runtime**: Ns

## New phantoms
1. [consumer] reading [path] — no producer in current src/ (full phantom)
   - Evidence: grep result showing zero writers

## Recommendations
- [fix paths for each new phantom]
```

### Step 4: Surface findings

Send to analyst via `send-message`:
```bash
cortextos bus send-message analyst normal "Phantom-endpoint weekly scan complete. New phantoms: N. Report: ~/.cortextos/$CTX_INSTANCE_ID/analytics/reports/phantom-endpoint-scan-YYYY-MM-DD.md"
```

If new phantoms found: also post to `#internal-agents` per fleet slack-mirror rule.

### Step 5: Log events

```bash
cortextos bus log-event action phantom_endpoint_scan_complete info --meta '{"agent":"scout","new_phantoms":N,"existing_confirmed":[1,2,3,4,5,6]}'
```

If any new phantom found: also log as `warning` with the phantom details:
```bash
cortextos bus log-event action phantom_endpoint_found warning --meta '{"consumer":"...","producer":"...","variant":"full|partial"}'
```

## Keep-discard criteria (scan design itself)

The scan is itself an experiment:
- **KEEP** scan design if: ≥1 new phantom caught OR ≥1 existing phantom confirmed/refuted with fresh evidence during the week
- **DISCARD** scan design if: 3 consecutive scans yield zero new phantoms AND zero status changes on existing ones (suggests pattern plateau OR scope error; reassess scope before quietly dropping)

Analyst evaluates keep/discard on the theta wave cycle AFTER each scan.

## What NOT to do

- **Do NOT propose per-agent fixes.** Phantom fixes land at the producer or consumer, not at specialists. Per-agent fix recommendations undercount blast radius.
- **Do NOT skip Tier C because it's large.** Boss's call: sweep all; cortextOS is small enough for a one-time full enumeration. Revisit only if runtime >5 min.
- **Do NOT self-approve any fixes.** Surface findings; analyst queues structural fixes; user approves. (See `no-agent-self-approve` rule in MEMORY.)
- **Do NOT sample agents inside the original report scope only.** Always sample at least 2 agents outside the originally-affected set to verify blast radius.

## Reference

- 2-clause catch rule: GUARDRAILS.md phantom-endpoint entry (reference version in `.claude/skills/guardrails-reference/SKILL.md` once cascade lands)
- Long-term tooling follow-up: cron-vs-activity timestamp split for `read-all-heartbeats` (tracked separately, not scope of this scan)
- Pattern owner: analyst — new phantoms found in the scan should be reported to analyst, who maintains the canonical instance history in analyst-internal memory. This skill file is the self-contained executable spec; analyst's memory is the rolling incident log.

---

**Draft metadata:**
- Drafted 2026-04-23 ~21:35Z by analyst
- For boss merge-review before user green-light
- Gated cascade: no scout cron add, no scout handoff, no GUARDRAILS edits until user OK
- Deployment target path (when cascaded): `orgs/glv/agents/scout/.claude/skills/phantom-endpoint-scan/SKILL.md`
