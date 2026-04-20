# PR #114 — Live Test Required

Author: community
Risk tier: LOW
Iterations: Live sandbox test in progress
Duration: ~10 min static

## What was tested

Static diff analysis of 1 file (+2/-2, text-only). Live agent sandbox test in progress.

## What was observed

**Change**: Two boot prompts in `src/daemon/agent-process.ts` strengthened:
- Boot prompt: `"Run CronList first to avoid duplicates"` → `"CRITICAL DEDUP: Always call CronList BEFORE creating any cron. For each config.json entry, search the CronList output for its prompt text — if the prompt already appears, SKIP that cron entirely..."`
- Continue prompt: similar strengthening with explicit "ONLY if missing" qualifier

**Problem addressed**: Rapid `--continue` restarts accumulated duplicate crons (72 dupes from 9 restarts in one reported incident). Previous wording was too soft — agents could interpret "Run CronList first — no duplicates" as advisory.

**Implementation quality**: Text-only, no code logic change. Effectiveness depends entirely on LLM compliance with the new prompt wording. This is the correct layer for this fix (the agent is responsible for cron lifecycle, daemon can only instruct).

**Relationship to PR #35**: PR #35 implements a complementary hardware-level enforcement (`scheduleCronVerification()` polling mechanism). PR #114 is the soft-enforcement (prompt). If both merge, the system has belt-and-suspenders: agent is told to dedup at boot, AND daemon verifies after startup. These are compatible — no conflict.

## Live Agent Test Plan

Scenario: Agent with 2 recurring crons configured. Rapid double --continue restart. Verify agent calls CronList before recreating crons and correctly skips ones already listed.

Expected: No duplicate crons after 3 rapid restarts.
Wrong: Duplicate entries accumulate in CronList output.

*Test results pending.*

## Merge Recommendation (Static)

**Score: 8/10** (pending live confirmation)

**What it does:** Strengthens the boot/continue prompt to require explicit CronList-first-then-skip behavior, preventing duplicate cron accumulation from rapid restarts.

**Is it a genuine improvement?** Yes — fixes a reported real-world incident (72 dupes, 9 restarts). Prompt-level enforcement is appropriate for a behavior the agent controls.

**cortextOS vision alignment:** Excellent — reliability-first (prevents state corruption from duplicate schedules), simplicity (1 file, 2 lines changed, no added complexity).

**Concerns:** Pure prompt change — no fallback enforcement if LLM ignores it. PR #35's cron verification mechanism would provide that fallback. Recommend merging both.

**Recommendation:** MERGE (pending live test confirmation of agent behavior with new prompt wording)
