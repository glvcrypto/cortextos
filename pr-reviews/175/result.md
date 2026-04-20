# PR #175 — Pipeline Complete

Author: noogalabs
Risk tier: LOW
Iterations: 1 (build + targeted unit tests)
Duration: ~10 min

## What was tested

- Build: `npm run build` — PASS (tsup clean)
- Targeted test run: `npx vitest run tests/unit/pty/` — 10/10 PASS (all PTY tests including OutputBuffer)
- Diff review: `src/pty/output-buffer.ts` only — 1 file, +9/-1 lines
- Credential scan: none
- New npm dependencies: none

## What was observed

**Two bugs fixed in one change:**

**Bug 1 (primary): Unbounded stdout.log growth**

Long-running agents accumulate `stdout.log` without limit. At 50–100 MB on macOS the OS file cache starts showing pressure and log writes degrade. Fix: rotate at 50 MB — rename to `stdout.log.1` (discarding prior `.1`), start fresh `stdout.log`. Lightweight and no configuration required.

```typescript
const MAX_LOG_BYTES = 50 * 1024 * 1024; // 50 MB
```

**Bug 2 (secondary, caught by existing tests): ENOENT on first write**

Before this fix, `statSync` and `appendFileSync` shared the same `try` block:

```typescript
try {
  const size = statSync(this.logPath).size; // throws ENOENT on first write
  // ... rotation check ...
  appendFileSync(this.logPath, safe, 'utf-8'); // NEVER REACHED
} catch { /* swallowed */ }
```

On first write (file doesn't exist yet), `statSync` throws `ENOENT`, the outer catch swallows it, and `appendFileSync` never runs — the log file is never created. The PR's author correctly identified this was caught by 5 existing `OutputBuffer` tests that were failing before the fix.

**Fix structure (correct):**

```typescript
try {
  try {
    const size = statSync(this.logPath).size;
    if (size >= MAX_LOG_BYTES) {
      try { renameSync(this.logPath, this.logPath + '.1'); } catch { /* ignore */ }
    }
  } catch { /* file doesn't exist yet — skip rotation check */ }
  appendFileSync(this.logPath, safe, 'utf-8'); // always reached
} catch {
  // Ignore log write errors
}
```

Inner try handles rotation-check ENOENT gracefully without preventing the append. `appendFileSync` is now always reached regardless of whether the file exists yet. The three-level nesting is unusual visually but each level has clear purpose.

**`renameSync` error suppressed:** correct — if the log file is somehow unwritable at rotation time, silently continuing is right behavior for a logging path.

## Merge Recommendation

**Score: 9/10**

**What it does:** Fixes two bugs in `OutputBuffer.push()`: (1) adds 50 MB log rotation so stdout.log doesn't grow unboundedly for long-running agents; (2) fixes a pre-existing ENOENT bug that prevented the log file from ever being created on first write.

**Is it a genuine improvement?** Yes, on both counts. The rotation fix directly addresses a known pain point for overnight agents (mentioned in PR as regular occurrence at 12+ hours). The ENOENT fix was silently swallowing a failure that made logging appear to work but produce nothing.

**cortextOS vision alignment:** Strong. Reliability-first (overnight agent stability), simple (+9/-1 lines in 1 file), no new dependencies.

**Concerns:**
- `stdout.log.1` rotation keeps only 1 backup generation — at very high log rates the `.1` file could also overflow. But for current agent usage patterns (one PTY per agent, conversational throughput) this is fine and adding generational rotation would be over-engineering.
- No new unit tests for rotation behavior specifically, though the existing 10 PTY tests cover the OutputBuffer correctly and the ENOENT fix is validated by the 5 that were previously failing.

**Recommendation:** MERGE
