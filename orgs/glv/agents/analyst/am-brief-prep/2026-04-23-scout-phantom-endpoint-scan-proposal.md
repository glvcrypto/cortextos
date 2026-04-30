# Weekly Scout Phantom-Endpoint Scan — Proposal

**Cycle 22 deliverable for boss merge-review before fleet cascade.**

Drafted 2026-04-23 ~21:20Z. Goal: durable weekly scan that catches instances 7+ before they drift into the fleet-health signal and burn investigation cycles.

---

## Scan scope (producer/consumer pairs swept)

Pair consumers with their expected producers. For each pair, verify the producer exists in CURRENT `src/` and writes to the path/key the consumer reads. Phantom = at least one side missing.

### Tier A — Dashboard readers
| Consumer | Expected Producer | Path/Key |
|---|---|---|
| Dashboard activity feed | `src/bus/log-event.ts` | `~/.cortextos/*/analytics/events/<agent>/*.jsonl` |
| Per-agent Logs tab | Agent stdout/stderr loggers | `~/.cortextos/*/logs/<agent>/activity.log` (known phantom #3) |
| Approvals queue tab | `src/bus/create-approval.ts` | central queue vs per-agent-local (known phantom #2) |
| Heartbeats tab | `src/bus/update-heartbeat.ts` + HEARTBEAT.md cron | heartbeat timestamp store (known phantom #6 partial) |
| Deploys page | GitHub Actions webhook ingest | deploy event store |
| Experiments tab | `src/bus/manage-cycle.ts` + evaluate-experiment | experiment results store |

### Tier B — Bus script readers
| Consumer | Expected Producer | Path/Key |
|---|---|---|
| `read-all-heartbeats` | `update-heartbeat` writes | heartbeat store |
| `check-inbox` | `send-message` writes | inbox store |
| `list-approvals` | `create-approval` writes | approval store (known phantom #2) |
| `list-tasks` | `create-task` / `update-task` writes | task store |
| `list-experiments` | `manage-cycle create` + evaluate-experiment writes | experiment store |
| `gather-context` | per-cycle experiment runners | per-agent experiment store |
| `collect-metrics` | all event loggers | events jsonl store |
| Auto-commit | .gitignore per-branch scope | staged files (known phantom #1) |

### Tier C — CLAUDE.md / skill documented paths
For every path referenced in `CLAUDE.md` files or `.claude/skills/*/SKILL.md`:
- Grep current `src/` for a writer that produces the referenced artifact.
- Flag documented-but-unwritten paths (phantom by documentation).

### Tier D — Counter/state readers
For every counter or state reader (cron-gap detector, stale-heartbeat detector, idle-detector):
- Enumerate expected writer set.
- Grep current code for each expected writer.
- Flag gaps = partial phantoms (known phantom #4 detector-orphan).

---

## Cadence

- **Weekly** on Sunday 06:00 UTC (light traffic window, pre-Monday cycle start).
- Cron line for scout config.json:
  ```json
  {
    "name": "phantom-endpoint-scan",
    "type": "recurring",
    "interval": "7d",
    "prompt": "Read .claude/skills/phantom-endpoint-scan/SKILL.md and execute the weekly phantom-endpoint sweep. Surface any new phantoms to analyst with full producer/consumer evidence."
  }
  ```
- Skill file at `.claude/skills/phantom-endpoint-scan/SKILL.md` (new skill — scout-only initially; can be published to catalog later if reusable).

---

## Output format

### Machine-readable JSON (for dashboard + analyst intake)
Path: `~/.cortextos/*/analytics/reports/phantom-endpoint-scan-YYYY-MM-DD.json`

```json
{
  "scan_date": "2026-04-26",
  "scanner": "scout",
  "tier_a_dashboard": [
    {"consumer": "path", "expected_producer": "src/path", "status": "ok|full_phantom|partial_phantom", "evidence": "..."}
  ],
  "tier_b_bus": [...],
  "tier_c_claude_md": [...],
  "tier_d_counters": [...],
  "new_phantoms_found": 0,
  "existing_phantoms_confirmed": [1,2,3,4,5,6],
  "existing_phantoms_fixed": []
}
```

### Markdown summary (for boss + Slack mirror)
Path: same directory, `.md` extension.

```markdown
# Phantom-Endpoint Weekly Scan — YYYY-MM-DD
- **New phantoms found**: N
- **Existing phantoms confirmed**: [list]
- **Existing phantoms fixed since last scan**: [list]
- **Pairs swept**: N

## New phantoms
1. [consumer] reading [path] — no producer in current src/ (full phantom)
   - Evidence: grep result showing zero writers

## Recommendations
- [fix paths for each new phantom]
```

---

## Keep-discard criteria (per scan)

- **KEEP scan design** if: ≥1 new phantom caught OR ≥1 existing phantom confirmed/refuted with fresh evidence
- **DISCARD scan design** if: 3 consecutive scans yield zero new phantoms AND zero status changes on existing ones (suggests either the pattern has plateaued OR the scan scope is wrong; reassess scope rather than quietly drop)

---

## Rollout plan

1. Boss merge-reviews this proposal.
2. Analyst creates the cycle via `cortextos bus manage-cycle create scout` (assuming `auto_create_agent_cycles: true`; else route through approval queue).
3. Scout receives handoff message: "New phantom-endpoint scan cycle active. Set up cron from config.json on next session start. Skill at `.claude/skills/phantom-endpoint-scan/SKILL.md`."
4. First scan fires next Sunday. Baseline = 6 instances confirmed as starting state.

---

## Open questions for boss

1. Skill file authorship: analyst drafts the `phantom-endpoint-scan/SKILL.md`, or delegate to scout directly with spec?
2. Publish scan as community skill after 2 weeks of keep-rate ≥ 1? (Fits cortextOS community-publish pattern.)
3. Tier C (CLAUDE.md documented paths) is the largest surface; scope cap at initial scan e.g. top 5 per CLAUDE.md or sweep all?
