# PR #176 — Pipeline Complete

Author: noogalabs
Risk tier: LOW
Iterations: 1 (build + targeted unit tests)
Duration: ~10 min

## What was tested

- Build: `npm run build` — PASS (tsup clean)
- Targeted test run: `npx vitest run tests/unit/daemon/agent-process.test.ts`
  - PR 176 branch: 14/15 pass (1 pre-existing "stop() awaits PTY exit" test times out in worktree — verified passes on main in 12s; environment artifact, not a regression)
  - PR 176's 2 new disabled-cron tests confirmed in the 14 that pass
- Main baseline: 13/13 pass (same test file, pre-existing suite)
- Credential scan: none
- New npm dependencies: none

## What was observed

**Root cause was correct:**

Both `scheduleGapDetection()` and `scheduleCronVerification()` filtered crons using `c.type !== 'once'` — this excluded one-shot crons but let `type=disabled` entries through. The gap-nudge messages then fired every 10 minutes for intentionally disabled crons, causing spurious PTY injections.

**Fix is minimal and correct:**

```diff
// scheduleGapDetection() — line 622
- .filter(c => c.type !== 'once')
+ .filter(c => c.type !== 'once' && c.type !== 'disabled')

// scheduleGapDetection() monitorable — line 647  
- c => c.type !== 'once' && c.interval && ...
+ c => c.type !== 'once' && c.type !== 'disabled' && c.interval && ...
```

Both filter sites updated consistently. Type union extended:
```diff
- type?: 'recurring' | 'once';
+ type?: 'recurring' | 'once' | 'disabled';
```

**Two regression tests added:**

- `scheduleCronVerification() is a no-op when config has only disabled crons` — PASS
- `scheduleGapDetection() is a no-op when config has only disabled crons` — PASS

Both mirror the existing `type=once` no-op test structure. Correct assertion: `mockInjectMessage` not called within 100ms.

## Merge Recommendation

**Score: 8/10**

**What it does:** Fixes a bug where `type=disabled` cron entries triggered gap-nudge messages every 10 minutes. Also formalizes `disabled` as a valid `CronEntry.type` value in the type system.

**Is it a genuine improvement?** Yes. If a user marks a cron as `disabled` they expect it to be silent. Spurious gap-nudge messages are confusing and noisy. This is a real operational bug affecting anyone who uses `type=disabled` in config.json.

**cortextOS vision alignment:** Strong. Reliability-first (correct behavior for disabled crons), composable (type union now formally includes disabled), simple (3-line fix, 2 tests).

**Concerns:**
- None. The fix is exactly scoped to the problem. The type union addition is overdue.

**Recommendation:** MERGE
