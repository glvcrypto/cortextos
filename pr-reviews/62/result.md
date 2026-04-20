# PR #62 — Pipeline Passed

Author: community
Risk tier: MEDIUM
Iterations: 1 (static analysis + unit test verification)
Duration: ~20 min

## What was tested

Static diff analysis of 6 files (+277/-21). Unit tests: 464/464 passing per PR.

## What was observed

**Bug 1 — Ghost state dirs from case-drifted --org args**: `buildKBEnv()` in `src/bus/knowledge-base.ts` joined org names verbatim into filesystem paths. Lowercase `--org acmecorp` created `~/.cortextos/<instance>/orgs/acmecorp/` as an orphan alongside canonical `AcmeCorp/`. The Python MMRAG tool auto-initialized `knowledge-base/config.json` at the ghost path — including a `GEMINI_API_KEY` copy. Security concern: key stored at unexpected path.

**Bug 2 — Dashboard log flood**: `getOrgs()` in `dashboard/src/lib/config.ts` scanned both state dir and framework root and unioned into a case-sensitive `Set`. Both `AcmeCorp` and `acmecorp` returned. Every `syncAll()` cycle produced `"syncTasks org=acmecorp exists=false"` misses against ghost dir.

**Fix — `normalizeOrgName(frameworkRoot, org)`**: Resolves canonical FS casing. Resolution order: exact match → case-insensitive scan → unchanged input (passthrough). Never creates new names. Wired at 3 call sites in `knowledge-base.ts` (`queryKnowledgeBase`, `ingestKnowledgeBase`, `ensureKBDirs`).

**`getOrgs()` rewrite**: Deduplication via `Map<lowercase, canonical>`. Framework root entries win over state dir entries (framework is source of truth). Same org with drifted casing now returns ONE entry.

**Unit test coverage**: 8 tests for `normalizeOrgName`, 5 tests for `getOrgs()` including: case drift, exact match wins, case-sensitive FS scenario, multi-org regression guard, empty input.

**Caveats documented**: Stale ghost dirs not cleaned up (explicit — safe), existing duplicate ChromaDB collections orphaned (safe), case-sensitive FS where both casings legitimately exist handled correctly (exact match wins).

## Fix branches applied

None.

## Merge Recommendation

**Score: 8/10**

**What it does:** Fixes org name case normalization at KB-write and dashboard sync — eliminates ghost state dirs (which contained redundant credential copies) and stops the log flood from duplicate org entries.

**Is it a genuine improvement?** Yes — fixes a real security-adjacent bug (stale key copies at ghost paths) and a genuine operational nuisance (log flood masking real issues).

**cortextOS vision alignment:** Excellent — reliability-first (eliminates silent ghost dir accumulation), security (removes orphan key copies), simplicity (normalization in one utility rather than per-call patches).

**Concerns:** PR author's org names were in original fixture data (`ElementOneSound`, `agentnet`) — scrubbed to generic names before filing, which is correct. The PR description is very thorough.

**Recommendation:** MERGE
