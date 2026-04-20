# PR #35 — Pipeline: Concerns Flagged

Author: community
Risk tier: HIGH
Iterations: 1 (static analysis + live sandbox test pending)
Duration: ~25 min

## What was tested

Static diff analysis of 11 files (+438/-148). Live sandbox test in progress for `scheduleCronVerification()` behavior.

## What was observed

**Stated fix (`\bsk-` word boundary)**: Correct. One-line change in `src/bus/system.ts`:
```diff
-const CREDENTIAL_PATTERNS = /(?:token=|key=|password=|secret=|sk-|ghp_|xoxb-|AKIA)/;
+const CREDENTIAL_PATTERNS = /(?:token=|key=|password=|secret=|\bsk-|ghp_|xoxb-|AKIA)/;
```
`\b` anchors before `s`, so `hook-ask-telegram` correctly passes while `sk-ant-api03-...` correctly fails. Fix is sound.

**UNDISCLOSED SCOPE — `scheduleCronVerification()` (NEW, 100 lines)**:
This is a significant behavioral addition not mentioned in the PR title or description. Added to `src/daemon/agent-process.ts`:
- Polls `last_idle.flag` every 15s for up to 10 minutes after agent start
- On idle detection, injects a PTY prompt: "[SYSTEM] Cron verification: your config.json defines these recurring crons: ..."
- Wired in `src/daemon/agent-manager.ts` to fire on every agent start
- Guards: lifecycle generation check, status check, foundIdle check before injection
- Fire-and-forget with error logging (non-fatal)

**Dashboard renderMarkdown extraction** (also undisclosed): `renderMarkdown()` extracted from `kb-view.tsx` into `dashboard/src/lib/render-markdown.tsx`. Additive refactor. No behavior change. Also used in organization-tab.tsx.

**SparkLine span→div** (also undisclosed): Minor component fix.

**Tests**: 439/439 passing per PR.

## Fix branches applied

None.

## Merge Recommendation

**Score: 5/10**

**What it does:** The PR title describes a 1-line credential regex fix. It actually delivers: (1) that fix, (2) a 100-line cron verification mechanism that injects PTY prompts post-startup, (3) a dashboard renderMarkdown refactor, (4) a SparkLine component fix.

**Is it a genuine improvement?** The individual changes are each improvements. The bundling is the problem — the cron verification mechanism is a significant behavioral change to agent startup that deserves independent review, test coverage, and a live sandbox test.

**cortextOS vision alignment:** The `scheduleCronVerification()` mechanism aligns with reliability-first goals. The bundled PR structure does not align with the simplicity pillar (single responsibility, small PRs).

**Concerns:**
1. PR description is misleading — describes only the `\bsk-` fix. The cron verification is hidden in the diff.
2. `scheduleCronVerification()` adds a polling loop (15s × up to 40 iterations) per agent per startup. No tests for the injection timing logic.
3. Overlaps with PR #114 which takes a different approach (prompt-only, no polling mechanism). If both merge, agents will receive two layers of cron dedup enforcement.
4. Live sandbox test for `scheduleCronVerification()` behavior is required before merge recommendation can be finalized.

**Recommendation:** MERGE WITH CHANGES — the credential fix and dashboard refactor can merge as-is. The `scheduleCronVerification()` mechanism should be in its own PR with dedicated tests and a live agent validation. As bundled: hold pending live test results.

---

## Live Sandbox Test Notes

Live sandbox test attempted. Sandbox daemon started successfully but PTY agent spawn failed (`posix_spawnp`) — Claude Code requires its OAuth state from `~/.claude/` which isn't present in the isolated sandbox environment for test agents. This is a sandbox infrastructure limitation, not a code defect.

**Static analysis conclusion for scheduleCronVerification():**
- Reads `last_idle.flag` at startup (records `bootIdleTs`): correct
- Polls every 15s, max 10 min: bounded, fire-and-forget (non-fatal)
- `currentIdleTs > bootIdleTs` comparison: correct (epoch seconds, change detection)
- Lifecycle generation guard + status check before injection: correct
- Uses same `injectMessage()` function used by fast-checker elsewhere: proven path
- 15s × ~40 iterations max per agent per restart: acceptable overhead

Code logic is correct. The undisclosed scope concern remains: this mechanism is not mentioned in the PR description and has no dedicated unit tests.
