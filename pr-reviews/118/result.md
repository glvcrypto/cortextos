# PR #118 — Pipeline Passed

Author: noogalabs
Risk tier: MEDIUM
Iterations: 1 (static analysis)
Duration: ~15 min

## What was tested

Static diff analysis of `src/daemon/fast-checker.ts` (+193/-2). No live agent test run (only one file changed, behavior is Gmail-specific and requires a configured Gmail org to exercise meaningfully).

## What was observed

**Fix 1 — Restart-safe lastCheckedAt persistence**: `gmailLastCheckedAt` now persisted to `state/<agent>/gmail-last-checked.txt` on each successful poll and loaded in the constructor. On restart the interval correctly picks up where it left off rather than resetting to 0 and re-scanning the same 100 emails.

**Fix 2 — Message-ID dedup with 2h TTL**: `gmailDeliveredIds: Map<string, number>` persisted to `state/<agent>/gmail-delivered-ids.json`. IDs filtered before delivery, added after, pruned in-memory at TTL boundary. Prevents re-injection of unread messages every 15 min.

**Implementation quality**:
- `existsSync` guard before reads — defensive
- Load failures log warnings rather than silently falling back to broken state (good observability)
- 20-message cap per poll — prevents runaway fetch loops
- `pruneGmailDeliveredIds()` called before filtering each cycle (correct order)
- `TTL_MS = 2h` is a reasonable window assuming Claude reads within 2h

**Concern 1**: No new unit tests for the persistence behavior. The PR description's test plan is manual only. Regression risk if persistence paths break in future.

**Concern 2**: Depends on `gws` CLI binary. If `gws` isn't installed, `execFile('gws', ...)` silently logs a warning and returns — graceful degradation is good, but operators need to know this dependency exists.

**Concern 3**: `sendMessage` import added at top (`from '../bus/message.js'`) but `sendMessage` was already presumably available. Confirmed by diff: only `sendMessage` is new in the import.

## Fix branches applied

None.

## Merge Recommendation

**Score: 7/10**

**What it does:** Fixes two bugs in the Gmail watch feature that caused restart loops (re-scanning same 100 emails on every daemon restart) and re-injection loops (same unread messages delivered every poll cycle until Claude marked them read).

**Is it a genuine improvement?** Yes. These are real bugs that make Gmail watch unusable across daemon restarts. The fix is correct and well-scoped.

**cortextOS vision alignment:** Good — reliability-first (persistence survives restarts), observability (load failures warn rather than silently fail), bounded (20-message cap).

**Concerns:** Missing unit tests for the persistence paths (load/save/prune). Manual test plan only. A future refactor could silently break persistence without catching it.

**Recommendation:** MERGE
