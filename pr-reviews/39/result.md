# PR #39 — Pipeline Passed (with concerns)

Author: community
Risk tier: HIGH
Iterations: 1 (static analysis)
Duration: ~20 min

## What was tested

Static diff analysis of 9 files (+210/-0). Reviewed hook implementation, .mcp.json configuration, settings.json wiring, and tsup build config.

## What was observed

**hook-session-restore.ts** (new, 130 lines):
- Only fires on `source === 'compact'` — skips startup, --continue, /clear. Correct.
- Reads last 2 days of `memory/facts/<date>.jsonl`, filters `source === 'precompact'` entries.
- MAX_SUMMARY_CHARS = 3000 cap. Staleness guard: skips entries > 6 hours old.
- Returns `hookSpecificOutput.additionalContext` shape per Claude Code contract.
- Silent on all errors — never blocks session start. Good.
- Properly registered in tsup.config.ts as CJS entry point.
- Correctly wired in all 3 template settings.json under `SessionStart`.

**hook-extract-facts** registration: Previously wired in settings.json but missing from `src/cli/bus.ts` as a bus command. Now registered. Fix is correct.

**agentmemory-mcp via .mcp.json**:
```json
{ "command": "npx", "args": ["-y", "agentmemory-mcp"] }
```
**CONCERN — unpinned `npx -y`**: No version pin. Every agent start fetches whatever version is current on npm. This is a supply chain risk — a compromised `agentmemory-mcp` package would silently affect all agents. `@xenova/transformers` downloads ML model files on first use (~100MB+), which will fail in restricted/offline environments and add significant cold-start time for new installs.

**Breaking change from claude-mem**: PR description says "operators should remove any user-level claude-mem plugin install" but provides no automated migration. Operators upgrading existing installs get a new MCP server added to templates without guidance on removing the old one.

## Fix branches applied

None.

## Merge Recommendation

**Score: 6/10**

**What it does:** Adds automatic working-state recovery after Claude context compaction via a SessionStart hook that injects the most recent PreCompact snapshot as additionalContext. Replaces claude-mem with agentmemory-mcp as the memory backend (local-only, SQLite + BM25 + embeddings).

**Is it a genuine improvement?** The hook-session-restore logic is well-implemented and solves a real pain point. The agentmemory migration is reasonable. The execution has critical gaps.

**cortextOS vision alignment:** Good vision fit — reliability-first (recover state after compaction), human-in-the-loop (transparent restoration). Security concern with unpinned npx dependency undermines the security pillar.

**Concerns:**
1. `npx -y agentmemory-mcp` with no version pin — supply chain risk. Should pin: `npx -y agentmemory-mcp@<exact-version>`.
2. `@xenova/transformers` model download on cold start — no documentation, could fail silently or time out.
3. No migration guide for operators removing claude-mem.
4. No new unit tests for hook-session-restore (only manual test plan).

**Recommendation:** MERGE WITH CHANGES — pin the agentmemory-mcp version in .mcp.json before merging. The hook itself is solid.
