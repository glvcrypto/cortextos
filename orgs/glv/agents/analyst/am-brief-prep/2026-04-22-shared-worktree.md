# AM Brief Prep: Fleet Shared Working-Tree — Direction Decision
**Prepared 2026-04-22 04:55 UTC / 00:55 EDT by Jerry (analyst) for 08:03 ET brief**

**Context:** Tonight's auto-commit near-miss (analyst unstaged `dashboard/cortextos.db` before commit) surfaced that agents share a single cortextos working tree. Analyst started session on `sync/upstream-17-commits-apr21` but auto-commit operated on `content/reyco-blog-verify-placeholders-apr22` because content had checked out their branch in between. Bug was caught; next near-miss might not be.

Two candidate fixes:
1. **Per-agent git worktrees** — each agent gets its own `.git/worktrees/<agent>` pointing at the same object store; branch state is agent-local
2. **Bus-serialized git** — every git op goes through a lock-acquiring bus call; still one tree, but operations queue

---

## Dimension Comparison

| Dimension | Per-agent worktrees | Bus-serialized git |
|---|---|---|
| **Disk overhead** | ~1 working tree per agent (~200–500MB each on this repo). 10 agents = 2–5GB. Trivial at our scale, laptop storage not a constraint. | None — stays at one working tree. |
| **Dashboard routing work** | Known cost. Dashboard needs to render per-agent branch state; `AgentCard` currently assumes single checkout. Maybe 1 day of dev work. | Zero — existing single-tree rendering stays. |
| **Active-period contention latency** | Zero contention — agents work in parallel trees. | Estimated impact: today's event logs show ~4 real git ops across 5h (0.8 ops/hour fleet-wide). Contention window = git-op duration (2–30s for add/commit, 10–60s for merge/rebase). At current rate, collision probability <1%/hour. Will spike during active dev cycles (multiple PRs open). |
| **Recovery from crash** | Each tree independent — one agent's crash mid-commit doesn't leave others locked. | Stale lock risk if agent crashes mid-op; needs TTL + cleanup logic. Not free. |
| **Migration path** | One-time: `git worktree add` per agent + update each agent's `working_directory` in config.json. Can do incrementally, per-agent. | Need to build lock mechanism + wrap all bus git calls + migrate auto-commit/check-upstream etc. Bigger code surface but no per-agent config change. |

---

## Hidden Considerations

- **Upstream sync timing**: the 17-commit upstream sync waiting for AM approval touches `src/cli/bus.ts` and adds new PTY files. If we go bus-serialized, that sync will likely conflict with the new lock wrapper. Worktrees are cleaner to sequence around the upstream merge.
- **Cross-agent branch visibility**: worktrees mean agents CAN'T see each other's in-flight branches by accident, which is good safety but bad for `analyst` monitoring (I currently scan PRs via `gh pr list`, which is remote-based anyway — no regression).
- **Rebase workflow**: per-agent worktrees need each agent to `git fetch origin` individually; bus-serialized gets it free via single checkout. Minor.

---

## Recommendation

**Per-agent worktrees.** Reasons:
1. Zero runtime contention — matters more as fleet scales
2. Crash isolation is a real safety property, not a nice-to-have
3. Disk cost is truly negligible
4. Upstream sync merge next — cleaner to absorb into worktree setup than wrap with new lock code
5. Incremental migration path (per-agent) lowers risk

Dashboard routing work is the one real cost, but it's ~1 day and dev already has capacity post-upstream-sync.

**If user prefers minimal changes:** bus-serialized git is valid — just accept the contention-latency risk grows with fleet activity.

---

## Data References
- Tonight's near-miss: analyst memory 2026-04-22.md § "Auto-Commit Cycle - 04:37 UTC" + boss correction § 04:45 UTC
- Git-op event count today: analyst 2, boss 1 (pr_merged), dev 1 (pr_opened), content 1 (guardrail_check); no concurrent ops observed in 5h window
- Dev task reference: src/bus/system.ts:199-205 (auto-commit staging); BINARY_TEMP_EXTENSIONS at :35-37
