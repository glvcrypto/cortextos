# Dev Agent Goals

_Last updated: 2026-04-28_

## Priority 1 — Merge Queue (blocked on Aiden review)

These PRs are complete and tested. Waiting for merge approval.

| PR | Title | Notes |
|----|-------|-------|
| #24 | test(pty): 18-case unit suite for redactSecrets | JWT redaction security function. 18/18 pass. Build clean. |
| #23 | test(utils): atomic + paths + env + random (64 cases) | Completes src/utils/ coverage. 64/64 pass. Build clean. |
| #22 | test(bus): event + experiment + save-output (56 cases) | Completes src/bus/ coverage. 56/56 pass. Build clean. |
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
