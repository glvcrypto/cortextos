# PR #152 — Pipeline Complete

Author: ClintMoody
Risk tier: MEDIUM
Iterations: 1 (build + unit tests)
Duration: ~15 min

## What was tested

- Build: `npm run build` — PASS (tsup clean)
- Unit tests: `npx vitest run tests/unit/daemon/quota-tracker.test.ts` — 9/9 PASS
- Full test suite: 43 files (41 pass, 2 fail on `dashboard/routes.test.ts`) — dashboard failures are pre-existing missing-dep issue in worktree, not regressions from this PR
- Diff review: `src/daemon/quota-tracker.ts`, `src/types/index.ts`, new test file
- Credential scan: none
- New npm dependencies: none

## What was observed

**QuotaTracker implementation (131 lines):**

Clean TypeScript class with:
- `recordSpend(amountUsd)` → accumulates, saves state, returns check result
- `check()` → evaluates soft/hard thresholds
- `isBlocked()` → persistent check after hard trigger
- `getState()` → read-only state snapshot
- `reset()` → manual clear
- `ensureFreshDay()` → auto-resets on date change
- State persisted to `<stateDir>/quota-<date>.json` at mode 0o600 (correct)

9 unit tests cover all documented behaviors. Day-reset test correctly simulates stale date file.

**API design concern (non-blocking but worth noting):**

After `hard_blocked` fires once, subsequent `check()` calls return `{ status: 'ok' }` (the `!this.state.hard_blocked` guard prevents re-emitting the event). But `isBlocked()` still returns `true`. This means callers who only inspect `recordSpend()` return values will see `ok` even when blocked. The correct pattern is to call both `recordSpend()` AND `isBlocked()`, which is non-obvious. The tests demonstrate this correctly (test 5 explicitly checks both), but callers without the tests as reference may get it wrong when the class is eventually wired into the daemon.

**Scope creep in types/index.ts:**

```typescript
crash_window?: {
  seconds?: number;
  max_crashes?: number;
};
```

This field was added to `AgentConfig` alongside `quota` but has no corresponding implementation in this PR. It's unrelated to QuotaTracker. This should be a separate PR tied to actual crash-window logic.

**Not wired into daemon:**

The PR's TODO comment is honest: `recordSpend()` is a stub pending Anthropic usage API availability. The class exists as a ready-to-integrate module. Nothing in the daemon currently instantiates or calls `QuotaTracker`. This is fine as a draft module, but should be labeled as such.

## Merge Recommendation

**Score: 7/10**

**What it does:** Adds a per-agent daily API cost tracking module with configurable soft/hard thresholds and disk-persisted state that auto-resets daily. Not yet wired into the daemon — ready for integration when the Anthropic usage API is available.

**Is it a genuine improvement?** Yes, eventually. The QuotaTracker class is well-implemented and the tests are thorough. As a foundation for cost load-shedding, it earns its place. The concern is that it's not wired, so merging just adds dead code for now.

**cortextOS vision alignment:** Good. Cost control is a real reliability concern. Reliability-first, composable module, no credentials. The human-in-the-loop aspect is missing (no Telegram notification on hard-block yet) but the architecture clearly supports adding one.

**Concerns:**
1. `crash_window` field added to AgentConfig has no implementation — should be a separate PR
2. API footgun: `check()` returns `ok` after `hard_blocked` fires (callers must also call `isBlocked()`) — should be documented in the class or the API changed to make `hard_blocked` sticky
3. No daemon wiring — this is dead code until integrated

**Recommendation:** MERGE WITH CHANGES — remove the `crash_window` type field (separate PR), add JSDoc note to `check()` clarifying the sticky-block behavior. The QuotaTracker core is ready.
