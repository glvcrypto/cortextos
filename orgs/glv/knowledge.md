# GLV Marketing — Org Knowledge Base

## Overview

GLV Marketing is a digital marketing agency running a cortextOS agent fleet to automate client work, content production, and internal tooling.

## Repos

| Repo | Purpose |
|------|---------|
| `glvcrypto/cortextos` | Fork of `grandamenium/cortextos` — fleet framework + dashboard |
| `glvcrypto/reyco-marine` | Reyco Marine WordPress/WooCommerce site |

## Client Context Protocol

**Before doing ANY work on a client, load that client's context files:**

- `orgs/glv/clients/<client>/CLIENT.md` — static reference (identity, tech stack, brand rules, staff, gotchas)
- `orgs/glv/clients/<client>/CLIENT_STATUS.md` — current operational state (pipeline, open gates, last touch)

This is mandatory — it prevents re-learning client specifics each session and prevents acting on stale assumptions. Boss maintains both files; boss updates CLIENT_STATUS.md as work is done. When boss dispatches a client task, the dispatch names the client — load its two files first.

## Active Clients

Client dirs: `orgs/glv/clients/{reyco, titan, fusion, soo-sackers, glv-marketing}/`

- **Reyco Marine** (`clients/reyco/`) — primary paying client ($2K/mo SEO retainer). Marine/power equipment dealer. WordPress + WooCommerce, Lightspeed DMS sync. Live at `reycomarine.com`. Owner: Casey Davieaux.
- **Titan Tiny Homes** (`clients/titan/`) — active. Indigenous-owned tiny home builder. Vite SPA, WordPress migration planned. `titantinyhomes.ca`.
- **Fusion Financial** (`clients/fusion/`) — favour engagement (not paying). Bookkeeping/tax. React SPA + Supabase. `fusionfinancialssm.com`.
- **Soo Sackers** (`clients/soo-sackers/`) — sandbox/testing ground (Aiden's brother's softball team). Netlify SPA. `soosackers.com`.
- **GLV Marketing** (`clients/glv-marketing/`) — the agency's own marketing (self-as-client). WordPress on SiteGround. `glvmarketing.ca`.

## Internal Infrastructure

- **cortextOS fleet** — 12 agents running under PM2 on the dev machine
- **Dashboard** — Next.js 14 at port 3000. SQLite (`dashboard/cortextos.db`). Tabs: Tasks, Approvals, Strategy, Content, Leads, Clients, Outreach, MCP, Commands, Expenses.
- **n8n** — workflow automation. Gmail send workflow at `integrations/n8n/`.
- **Slack** — `#internal-dev` (C0APQ0TFS93) for dev team comms. Creator: Aiden Glave (@U0APRAY5FPY).

## Slack Channels

| Channel | ID | Purpose |
|---------|-----|---------|
| #internal-dev | C0APQ0TFS93 | Web dev, deployments, technical builds |

## Key People

- **Aiden Glave** (`@U0APRAY5FPY`) — owner/principal. All PR merges require his approval.
- **Casey** — Reyco client contact. Manages Lightspeed DMS inventory WebUnit flags.

## GitHub PR Merge Protocol

All PRs require Aiden review before merge. Dev agent opens PRs; never self-merges. Current open PRs as of 2026-04-26:
- #18 — n8n Gmail send workflow (import-ready, `active: false`)
- #17 — fix(heartbeat): Option A cron-fire (single clean commit)
- #16 — fix(ecosystem): pin node bin PATH (fleet-verified)
- #15 — 3 scout specs (approval queue aging, ctx pre-alert, proposal KPI)
- #14 — fix(daemon): Option B cron-state seed
- #10, #8, #7, #6, #11 — older, various sequencing decisions pending

## Environment Notes

- SQLite database at `dashboard/cortextos.db` is .gitignored (PR #6 pending merge)
- `npm run build` + `npm test` must pass before any PR is opened
- Cloud sessions: no local daemon, no bus commands, no Telegram. Use Slack MCP + GitHub MCP.
