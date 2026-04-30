# Dev Agent Goals

_Last updated: 2026-04-30_

## Priority 1 — Merge Queue (blocked on Aiden review)

These PRs are complete and tested. Waiting for merge approval.

> ⚠️ CONFLICT ALERT (flagged to Aiden via Telegram + #internal-dev 2026-04-30):
> - #46 (metrics) + #47 (experiment) duplicate coverage already in upstream #21 + #22 → **close #46 and #47 after #21/#22 merge**
> - PRs #35–#43 ALL carry 5 shared production source-file changes (`src/bus/cron-state.ts`, `src/cli/bus.ts`, `src/cli/enable-agent.ts`, `src/cli/setup.ts`, `src/daemon/agent-process.ts`) — these appear to be upstream changes rebased onto the test branches; each needs review or test-only extraction before merge
> - PR #42 (message HMAC) overlaps PR #49 (message security gaps) — likely superseded by #49
> - PR #43 test content (event + heartbeat + save-output) overlaps PRs #21 + #22 — likely superseded
> - PR #35 test content (133 cases) overlaps PR #23 (utils, 64 cases) — #35 is a superset but has the src changes issue
> - Safe merge order: audit src changes in #35–#43 → merge #21 + #22 → close superseded PRs → clear rest of queue

| PR | Title | Notes |
|----|-------|-------|
| #53 | fix(heartbeat): Step 5b outbound-log staleness filter — cloud session false-positive suppression | Docs-only. Adds suppress/fire truth table to HEARTBEAT.md. Analyst-calibrated 2026-04-30. |
| #52 | test(hooks): generateId + waitForResponseFile + cleanupResponseFile coverage (8 cases) | 8/8 pass. Covers hex-format check, uniqueness, file-pre-exists, fs.watch late-write, timeout→null, delete, no-op, idempotent. Build clean. |
| #51 | test(telegram): TelegramAPI method coverage — sendMessage + answerCallbackQuery + editMessageText + sendChatAction + setMyCommands (17 cases) | 17/17 pass. Adds 17 cases to existing 2 in api.test.ts. Covers parse-mode fallback, sanitizeMarkdown, chunking, retry logic, all 5 methods. Build clean. |
| #50 | test(utils): lock.ts stale-lock + corrupt-PID + releaseLock idempotency (3 cases) | 6/6 pass (3→6 total). Covers dead-PID stale recovery, NaN/corrupt PID, releaseLock no-op. Build clean. |
| #49 | test(bus): message.ts security + error-recovery gaps (9 cases) | 9/9 pass. HMAC signing/verification paths + corrupt JSON + stale inflight recovery + ackInbox no-match. Build clean. |
| #48 | test(cli): writeDisableMarker (BUG-036) coverage — 4 cases | 16/16 pass. Additive to existing enable-agent-validation.test.ts. |
| #47 | test(bus): experiment.ts coverage — 27 tests | ⚠️ SUPERSEDED by #22. Close after #22 merges. |
| #46 | test(bus): metrics.ts coverage — parseUsageOutput + storeUsageData + collectMetrics (21 cases) | ⚠️ SUPERSEDED by #21. Close after #21 merges. |
| #45 | test(bus): catalog browseCatalog + prepareSubmission + submitCommunityItem + installCommunityItem gaps (50 cases) | 50/50 pass. Build clean. |
| #44 | test(bus): fill coverage gaps in agents + approval modules | Adds 6 agents tests + 7 approval tests. Build clean. |
| #41 | test(cli): setup validators + dashboard env helpers (56 cases) | 56/56 pass. Build clean. |
| #34 | test(cli): ecosystem buildDashboardBlock + buildEcosystemContent (34 cases) | 34/34 pass. Build clean. |
| #33 | test(cli): bus.ts pure helpers — parseDisplayNameFromLines + checkDeliverableRequirement + pct (28 cases) | 28/28 pass. Build clean. |
| #32 | test(cli): add-agent helpers createAgentsMd + findTemplateDir + copyTemplateFiles + createMinimalAgent (37 cases) | 37/37 pass. Build clean. |
| #31 | test(cli): init findOrgTemplateDir + copyOrgTemplateFiles + buildAgentSystemMd (31 cases) | 31/31 pass. Build clean. |
| #30 | test(cli): status formatUptime + formatHeartbeatAge (30 cases) | 30/30 pass. Build clean. |
| #29 | test(cli): get-config resolveConfig + formatConfigText (33 cases) | 33/33 pass. Build clean. |
| #28 | test(cli): goals isValidGoalsName + buildGoalsMd (33 cases) | 33/33 pass. Build clean. |
| #27 | test(daemon): IPCServer + IPCClient (30 cases) | Real Unix socket tests. 30/30 pass. Build clean. |
| #26 | test(cli): list-skills parseFrontmatter + scanSkillsDir (23 cases) | 23/23 pass. Build clean. |
| #25 | test(hooks): crash-alert 29-case suite | isQuietHoursLA + detectRateLimitInLog + shouldSuppressDedup. 29/29 pass. |
| #24 | test(pty): 18-case unit suite for redactSecrets | JWT redaction security function. 18/18 pass. Build clean. |
| #23 | test(utils): atomic + paths + env + random (64 cases) | Completes src/utils/ coverage. 64/64 pass. Build clean. |
| #22 | test(bus): event + experiment + save-output (56 cases) | Completes src/bus/ coverage. 56/56 pass. Build clean. |
| #43 | test(bus): event + heartbeat + save-output coverage | ⚠️ Contains 5 production src changes + test content superseded by #21/#22. Audit src changes before merge. |
| #42 | test(bus): message.ts HMAC security + edge cases | ⚠️ Contains 5 production src changes + likely superseded by #49. Audit src changes. |
| #39 | test(validate): validateOrgName coverage | ⚠️ Contains 5 production src changes. Audit src changes before merge. |
| #38 | test(bus): extend cron-state suite — cronExpressionMinIntervalMs + parseDurationMs edge cases | ⚠️ Contains 5 production src changes. Audit src changes before merge. |
| #37 | docs(event-logging): severity landmine note — warn is invalid, use warning | ⚠️ Contains 5 production src changes alongside docs. Audit src changes before merge. |
| #36 | test(bus): save-output copy/move/collision/linking (22 cases) | ⚠️ Contains 5 production src changes. Audit src changes before merge. |
| #35 | test(utils,pty,bus): env/paths/random/atomic/redact/event/heartbeat (133 cases) | ⚠️ Contains 5 production src changes + superset of #23. Audit src changes before merge. |
| #21 | test(bus): heartbeat + metrics (36 cases) | 36/36 pass. Build clean. |
| #19 | feat(accounting): expense tracking dashboard + fx-fetcher CLI | Task #19 — clean cherry-pick, 7 commits. Build clean. |
| #17 | fix(heartbeat): Option A — add update-cron-fire to template Step 1 | Merge with #14 for full FP elimination |
| #14 | fix(daemon): Option B — seed cron-state.json at startup | Merge with #17 |
| #16 | fix(ecosystem): pin node bin dir into PATH | Fleet-verified on 12 agents |
| #15 | feat: 3 scout specs (approval queue aging, ctx pre-alert, proposal KPI) | User-approved specs |
| #18 | feat(prospector): n8n Gmail send workflow | active: false until Aiden approves + SPF/DKIM verified |

## Priority 2 — Active Workstreams

### Reyco Marine

- **Path C booking form** — interim wp_mail form + calendar embed slot. Standing by for Aiden spot-check on v2 service pages.
- **Visual regression CI** — design doc on branch `feat/playwright-visual-regression-design`. Awaiting user ACK on 4 open questions (Git LFS, fixture DB, threshold, block vs warn).
- **Lightspeed product sync** — 58 products still missing images (Mercury 38, Toro 7, Cub Cadet 10, Princecraft 3). Root cause: not yet synced from Lightspeed to WC. Unblocked when Casey runs sync.

### WC Pricing Sweep

- **Held** — pending pentester clearance on WP admin credential request.

## Priority 3 — Pending Sequencing Decisions

| PR | Title | Blocked On |
|----|-------|-----------|
| #7 | sync: upstream 17-commit merge | Aiden merge decision |
| #8 | feat(dashboard): Clients/Reyco tabs | Depends on #7 merge order? |
| #11 | fix(auto-commit): gate .db + .gitignore (draft) | Sync #7 sequencing |
| #20 | feat(community): add page-by-page-audit skill | Can merge independently (docs only) |
| #10 | docs(cron): loop skill cron-fire protocol | Can merge independently |
| #6 | chore: .gitignore .db artifacts | Can merge independently |

## Completed (Recent)

- PR #12 (merged) — outreach tab auto-refresh 30s poll
- PR #9 (merged) — suppress repeat gap-nudges within 1× cron interval
- PR #5 (merged) — Leads Pipeline Kanban
- PR #4 (merged) — Content Calendar
- Reyco v2 service-page sprint — 11/11 pages deployed
- Reyco image import — 127/185 products have images
