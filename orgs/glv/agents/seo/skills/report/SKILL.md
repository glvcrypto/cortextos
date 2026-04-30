---
name: report
description: Client Reporting — modular reporting system for monthly performance reports, weekly check-ins, and ad hoc reports across all GLV clients. Trigger with /report:<type> <client>.
---

# Report — Client Reporting System

> Professional client-facing reports for GLV Marketing. Pulls live data, applies GLV + client co-branding, and outputs markdown + HTML.

## Usage

`/report:<type> <client>`

## Available Skills

| Skill | Command | Purpose | Frequency |
|-------|---------|---------|-----------|
| monthly | `/report:monthly <client>` | Full monthly performance report | Monthly |

## Client Resolution

Every skill reads `projects/<client>/CONTEXT.md` for config blocks (`seo:`, `brand:`, etc.).
Valid client slugs: `soo`, `soo-sackers`, `titan`, `titan-tiny-homes`, `fusion`, `fusion-financial`, `reyco`, `reyco-marine`, `glv`, `glv-marketing`.

Aliases: soo -> soo-sackers, titan -> titan-tiny-homes, fusion -> fusion-financial, reyco -> reyco-marine, glv -> glv-marketing.

### Client Resolution Logic

When a skill receives a `<client>` parameter:

1. Normalise the input using the alias map:
   - `soo` -> `soo-sackers`
   - `titan` -> `titan-tiny-homes`
   - `fusion` -> `fusion-financial`
   - `reyco` -> `reyco-marine`
   - `glv` -> `glv-marketing`
   - Full slugs pass through unchanged
2. Read `projects/<resolved-slug>/CONTEXT.md`
3. Extract config blocks (`seo:`, `brand:`) for identifiers and branding
4. If CONTEXT.md is missing, fail with a clear error

## Output Convention

All outputs saved to: `projects/<client>/reports/YYYY-MM-DD-<report-type>.md` and `.html`

Example paths:
- `projects/fusion-financial/reports/2026-03-01-monthly-report.md`
- `projects/titan-tiny-homes/reports/2026-03-01-monthly-report.html`

## State Tracking

All runs update `.state/report-state.json` with timestamps and report metadata.

## Graceful Degradation

If an MCP tool fails (Semrush auth, GA4 permission denied, GSC unavailable):
1. Complete the report with whatever data IS available
2. Flag the missing data source in the output with a note
3. Log the failure in report-state.json
4. Do NOT fail the entire report

## Autonomy Boundaries

| Action | Level |
|--------|-------|
| Pull GSC/GA4/Semrush/Gmail data | agent-autonomous |
| Generate reports | agent-autonomous |
| Create/update files in projects/*/reports/ | agent-autonomous |
| Update .state/report-state.json | agent-autonomous |
| Send reports to clients | user (Aiden sends) |
| Upload to Google Drive | user (Aiden executes) |

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Use AI-sounding language | Write like you're talking to the client in a meeting |
| Hardcode client domains or property IDs | Read from CONTEXT.md every time |
| Skip client resolution | Always read CONTEXT.md for config |
| Fail entirely if one MCP is down | Complete with available data, flag missing |
| Overwrite previous reports | Use dated filenames (YYYY-MM-DD) |
| Use em dashes | Use commas, periods, or restructure |
