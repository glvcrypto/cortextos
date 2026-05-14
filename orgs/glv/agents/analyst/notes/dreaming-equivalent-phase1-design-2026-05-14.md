# cortextOS Dreaming-Equivalent - Phase 1 Design Doc

**Status:** DRAFT (analyst, 2026-05-14 17:14Z)
**Task:** task_1778777181333_901
**Joint owners:** analyst + dev
**ETA final:** 2026-05-17
**Approval reference:** Aiden AM brief #8 (2026-05-14), routed via boss msg 1778777181385-boss-12cil
**Pattern inspiration:** Anthropic Managed Agents Dreaming (cloud-hosted) - local-only adaptation per [[project_cortextos_pipeda_differentiator]]

---

## 1. Goal

Build a weekly skill `memory-consolidation-review` that:
- Reads agent memory files across the fleet (per-agent `memory/*.md` + `MEMORY.md`)
- Surfaces consolidation candidates (duplicates, stale references, index-bloat, conflicting rules)
- Posts proposals to `#overnight-proposals` Slack channel for human review
- NEVER auto-mutates memory content (read+surface only)

## 2. Anti-Goals (Phase 1 hard boundaries)

Per [[feedback_dreaming_layer_creep_guardrail]] - banked 2026-05-14 boss msg 1778777264716-boss-58gy4:

- This skill never proposes mutations beyond consolidation/dedup
- No auto-applying merge proposals (Aiden approval required)
- No rewriting memory file content (only proposing edits via #overnight-proposals)
- No cross-agent rule promotion (suggesting only - promotion is human decision)
- No archive mutation (archives are immutable historical record)

If Phase 2 (mutation tooling) is later approved, it gets its own named scope, separate approval, and separate skill file - not an extension of consolidation-review.

## 3. PIPEDA Posture

- All reads local to WSL filesystem; no cloud upload of memory content
- Slack proposals reference file paths and line numbers, NOT memory body content (PII-safe)
- Exception: short, content-free metadata (rule name, banking date, agent name) MAY appear in proposals
- Audit trail: every proposal logged to `~/.cortextos/$CTX_INSTANCE_ID/logs/dreaming/proposals.jsonl` (local, append-only)

## 4. Schedule

- Cron: `0 6 * * 0` (Sundays 02:00 EDT / 06:00 UTC)
- Rationale: after Saturday auto-commit, before Monday work week starts
- Owner: analyst (this agent)
- Loop interval string: `0 6 * * 0` via CronCreate (recurring=true)

## 5. Inputs (Read-Only Sweep)

### 5.1 Per-Agent Memory
- `/home/aiden/cortextos/orgs/glv/agents/<agent>/memory/YYYY-MM-DD.md` (past 7 days)
- `/home/aiden/cortextos/orgs/glv/agents/<agent>/MEMORY.md` (long-term index)

### 5.2 Org-Shared Memory
- `/home/aiden/.claude/projects/-home-aiden-cortextos/memory/MEMORY.md` (index)
- `/home/aiden/.claude/projects/-home-aiden-cortextos/memory/*.md` (topic files)
- `/home/aiden/.claude/projects/-home-aiden-cortextos/memory/MEMORY-archive-*.md` (archives - SKIP in active rule-conflict detection per boss msg 1778777264716-boss-58gy4)

### 5.3 Archive Handling Decisions

Per boss msg 1778777264716-boss-58gy4:

- Active rule-conflict detection: SKIP `MEMORY-archive-YYYY-MM.md` files (archived = de-prioritized, by definition stale)
- Provenance/history queries: archives ARE valid source (e.g. "when was rule X first banked")
- Resurrection detection: if archive contains rule, then current MEMORY.md re-introduces semantically-equivalent rule = surface as "potential re-bank, was archived YYYY-MM-DD reason: ___"
- Memory-tier scan order: current MEMORY.md → topic-files → archives (deepest last, only if needed)

## 6. Detection Categories

### 6.1 Per-Agent Detections
- **Duplicate entries:** same `name:` slug appears in multiple files
- **Stale references:** memory cites file path / function / flag that no longer exists (grep miss)
- **Superseded entries:** newer memory contradicts older without explicit `[[supersedes]]` link
- **Index bloat:** `MEMORY.md` exceeds size limit (24.4KB), or entries >200 chars violating one-line discipline
- **Frozen-time snapshots:** memory with explicit timestamp claims that have decayed (e.g., "last seen 2026-04-01" patterns)

### 6.2 Cross-Agent Detections
- **Rule duplication:** same banked feedback across multiple agents → candidate for org-shared promotion
- **Rule conflict:** same topic, divergent guidance across agents (e.g., agent A says "X is required", agent B says "X is forbidden")
- **Orphaned references:** `[[name]]` link points to non-existent slug in either source-agent or target-agent space

### 6.3 Vector F Filter (cycle-19 measurement window adjacency)
Per cycle-19 Vector F PLATFORM-INITIATED-RESTART finding (2026-05-14 17:12Z):
- Skill must filter detections within 90 sec of a fleet-wide session_start cluster (>=3 agents)
- Prevents alarm on restart-cascade-induced false positives
- Filter check: read `~/.cortextos/$CTX_INSTANCE_ID/analytics/events/*/session_start*.jsonl`, identify clusters, exclude detections that overlap

## 7. Output Surface (Slack)

### 7.1 Format
```
[DREAMING] Weekly memory consolidation proposals - 2026-MM-DD

PROPOSAL N: <category> - <one-line summary>
File(s): <path1>:<line>, <path2>:<line>
Action: <PROPOSE_MERGE | PROPOSE_DELETE | PROPOSE_PROMOTE | PROPOSE_REVIEW>
Rationale: <2-3 sentence reasoning, no memory-body content>

Approval: react with ✅ to approve, ❌ to reject, 🤔 to request more info
```

### 7.2 Channel
- `#overnight-proposals` (existing, used by scout for upgrade candidates)
- Adjacent to scout's cycle-5 surface but separate proposal-type tag for filtering

### 7.3 PII Guard
- Slack message body contains: paths, line numbers, rule-slugs, banking-dates, action verbs
- Slack message body does NOT contain: rule-body content, agent reasoning, user-specific details
- Aiden reviews by opening the cited file locally (path provided), not in Slack itself

## 8. Approval Loop

1. Proposal posted Sunday 06:00 UTC
2. Aiden / boss reviews during weekday
3. Reaction-based approval:
   - ✅ → analyst/dev applies the change in next manual session (NOT auto-applied)
   - ❌ → analyst marks proposal as rejected in `proposals.jsonl`, may skip same-topic for 30d
   - 🤔 → analyst replies in thread with file content excerpt + waits for next review
4. No approval after 14 days → auto-mark as stale, do not re-propose same exact merge

## 9. Apply-Mutation Tooling (Phase 2 - OUT OF SCOPE for this design)

Stub for awareness only - Phase 2 will need:
- `cortextos bus consolidate-memory --apply <proposal-id>` command (extends existing bus tooling)
- Atomic rollback on apply failure
- Per-proposal audit log entry
- Approval-gate enforcement (refuse apply without ✅ ack from Aiden)

This section exists to prevent scope-creep ambiguity: Phase 1 ships WITHOUT this command, even as a stub.

## 10. Implementation Plan

### Phase 1.1 - Skill Scaffold (dev primary)
- Create `/home/aiden/cortextos/orgs/glv/agents/analyst/.claude/skills/memory-consolidation-review/SKILL.md`
- Implement cron registration in `analyst/config.json`
- Implement scan-mechanism (read filesystem, no mutation)

### Phase 1.2 - Detection Logic (analyst primary)
- Per-agent detection rules (Section 6.1)
- Cross-agent detection rules (Section 6.2)
- Vector F filter integration (Section 6.3)

### Phase 1.3 - Slack Proposal Format (analyst + dev joint)
- Message template (Section 7.1)
- Slack channel routing through boss (per [[feedback_boss_owns_slack_comms]])
- PII-guard validation before send (Section 7.3)

### Phase 1.4 - Dry-Run + Acceptance Test (analyst primary)
- Run skill against current fleet state, output proposals to local file (not Slack)
- Manual review: are detections sensible? False-positive rate? Vector F filter working?
- Iterate until proposals look right, THEN enable Slack output

### Phase 1.5 - Initial Production Run (joint)
- First real Sunday run: 2026-05-24 (next Sunday after 2026-05-17 finalization)
- Aiden + boss + analyst on stand-by for first cycle's proposals

## 11. Success Criteria (Phase 1 acceptance)

- Skill runs weekly without crashing
- Detection rules produce <=10 proposals/week (above this = noisy, below = under-scoped, both are tunable)
- Aiden ✅-rate on proposals >=50% over first 4 weeks (calibrates detection thresholds)
- Vector F filter eliminates restart-cluster false-positives (measured by re-run on restart-day data)
- PII-guard catches 0 leaks of memory-body content to Slack (validated by manual review of first 4 weeks)

## 12. Open Questions (for dev review)

1. **Skill discoverability:** should this be community-publishable, or stays fleet-internal? Default: fleet-internal until Phase 2 mutation tooling lands.
2. **Multi-org generalization:** should the skill scan all `orgs/*/agents/*/memory/` or stay limited to `orgs/glv/`? Default: glv-only until pattern stabilizes.
3. **Cron ownership:** runs on analyst (current default) or its own dedicated agent? Default: analyst (this agent) owns it, can split later.
4. **Frequency:** weekly correct cadence? Monthly might be too sparse; daily is overkill. Default: weekly per Aiden AM brief.
5. **Conflict resolution:** what if dev disagrees with a detection rule? Phase 1 design doc is binding for Phase 1 build only; rule disputes get logged as issues for Phase 1.5 iteration.

## 13. References

- Task: task_1778777181333_901 (parent), task_1778777251811_846 (this design doc)
- Boss approval routing: msg 1778777181385-boss-12cil (initial), msg 1778777264716-boss-58gy4 (refinements)
- Banked memories: [[feedback_dreaming_layer_creep_guardrail]], [[project_cortextos_pipeda_differentiator]], [[feedback_no_agent_self_approve]]
- Cycle-19 measurement window: 2026-05-14 → 2026-05-21 (informs Vector F filter requirement)
- Pattern reference: Anthropic Managed Agents Dreaming (cloud-hosted, NOT a code source - local-only adaptation)

---

**Next actions:**
- analyst: complete Sections 6 + 8 detection-rule details by 2026-05-16 EOD, route to dev
- dev: review skill scaffold (Section 10.1), respond with implementation feasibility + open questions by 2026-05-17 morning
- joint: lock final design Sunday 2026-05-17, schedule Phase 1.1 work for week of 2026-05-19
