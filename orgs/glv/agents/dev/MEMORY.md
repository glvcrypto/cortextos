# Dev Agent Long-Term Memory

## System Patterns

### cron-gap false positives
- **Root cause**: Agents using ScheduleWakeup-based loops never write to `cron-state.json` unless they call `update-cron-fire`. Daemon gap-detector reads stale snapshot and fires phantom alerts.
- **Fix A (PR #17)**: Agent-side — add `cortextos bus update-cron-fire heartbeat --interval 4h` to template Step 1 in HEARTBEAT.md.
- **Fix B (PR #14)**: Daemon-side — seed `cron-state.json` at startup with `last_fire = now` for all configured crons without an existing record.
- **Status**: Both PRs open, not yet merged. Until merged, phantom gap nudges will continue.

### PM2 PATH issue on WSL boot
- **Root cause**: PM2 god daemon resurrects from `~/.pm2/dump.pm2` under the boot shell's PATH, which may lack nvm/fnm bin dir. node-pty's `execvp('claude')` then fails with EACCES (WSL interop masking ENOENT).
- **Fix (PR #16)**: Bake `dirname(process.execPath)` into generated `ecosystem.config.js` PATH env for both daemon and dashboard apps.
- **Fleet impact**: Confirmed on 12 agents — all bootstrap cleanly after PM2 reload post-fix.

### SQLite artifacts in git
- `dashboard/cortextos.db` must be .gitignored — PII near-miss (auto-commit would have staged it).
- PR #6 (.gitignore) + PR #11 (auto-commit gate) pending merge.

### ecosystem.ts JSON.stringify pattern
- Using `JSON.stringify(someString)` inside template literals that generate .js files is the correct approach. It handles escaping for all special chars and produces a valid JS string literal.
- Reviewed and confirmed correct in PR #16 (2026-04-26).

## Repo Context

- This repo (`glvcrypto/cortextos`) is a fork of `grandamenium/cortextos`. Upstream syncs happen periodically (PR #7 = 17-commit sync, pending).
- Dashboard uses SQLite (not Postgres/Supabase) for the local fleet — all API routes query `dashboard/cortextos.db`.
- Agent configs live in `orgs/<org>/agents/<name>/` — `ecosystem` command scans this tree.

## Client Context

### Reyco Marine
- Lightspeed DMS (not Retail R-Series) — 3PA API is read-only. WebUnit flags must be set by Casey via DMS desktop UI or bulk spreadsheet import.
- Images missing for 58 products (Mercury 38, Toro 7, Cub Cadet 10, Princecraft 3) because products not yet synced from Lightspeed to WC. Unblocks automatically when Casey runs sync.
- v2 service-page sprint complete as of 2026-04-25.
- PHP: `single-product.php`, `service-detail.php`, `header.php` — key templates.
- `page_type=form` + `suppress_booking_modal` flags added for Order Parts form page.

### Dashboard TypeScript errors (identified 2026-05-06)
Two pre-existing TypeScript errors block Dashboard Build CI on ALL branches:
1. **viewport in Metadata** (`dashboard/src/app/layout.tsx`) — fixed by PR #85. `viewport` must be a separate `export const viewport: Viewport` (Next.js 15+ requirement).
2. **Lead interface missing `}`** (`dashboard/src/lib/types.ts` line 178) — fixed by PR #86. TypeScript was parsing ContentStatus/ContentItem/CostEntry/User/SSEEvent/etc. as members of Lead. esbuild (Vitest + Next.js bundler) strips types without semantic checking so tests + build passed; only `npx tsc --noEmit` catches this.
- Neither PR alone fixes Dashboard Build CI (they're each branched from main which has both errors)
- Merge sequence: PR #84 → PR #86 → rebase PR #85 → PR #85 → all CI green
- Static analysis from cloud session identified error #2 without running tsc

## Cloud Session Protocol

When running in cloud (no local daemon):
- Skip all `cortextos bus` commands — log each as "skipped, daemon required"
- Use Slack MCP (channel C0APQ0TFS93) for #internal-dev updates
- Use GitHub MCP + git for all code/PR work
- Memory-only commits can go direct to main; code changes need PR
- **`npm test` and `npm run build` DO NOT WORK in cloud sessions** — `node_modules` is not installed in the repo checkout. Do not attempt to run tests or build; log as infeasible. All build/test verification must be done locally before PRs are opened.

## n8n Workflow Notes

- Gmail send workflow at `integrations/n8n/prospector-gmail-send.json`
- Always `active: false` until Aiden explicitly approves flip
- Prerequisites before activating: SPF/DKIM/DMARC verified on `glvmarketing.ca` + warm-up (20–30/day ~2 weeks)
