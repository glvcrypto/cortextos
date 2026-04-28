---
name: page-by-page-audit
description: Boss-orchestrated full-site audit of a client website using Playwright + multi-agent calibration + boss-solo bulk + pattern-batch writes to a shared Sheet. Reyco run 2026-04-26 produced 689-row Sheet + 4-PR fix family + 4 ledger pattern candidates in ~7 hours.
when_to_use: Client has a finished or near-finished website with 100+ pages and you need per-page findings synthesized into a single artifact (typically a Google Sheet with AI Check + AI Notes columns). Especially valuable pre-launch when bug families and SEO/UX gaps need catching before traffic hits.
---

# Page-by-Page Audit Skill

A boss-orchestrated full-site audit pattern. Combines Playwright-based content rendering, multi-agent calibration, boss-solo bulk processing, and pattern-batch writes to scale efficiently from 5-page calibration to 600+ page bulk runs.

## Pre-requisites

1. **Client URL inventory** — a list of all URLs to audit. Typically built via wp-cli post list / sitemap scrape. Should include type/title/slug/url at minimum.
2. **Aiden Sheet** — shared Google Sheet with columns:
   - `type | id | title | slug | url | Manual Check | Notes | IF BLOCKER | AI Check | AI Notes`
   - User fills Manual Check + Notes + IF BLOCKER manually
   - Boss fills AI Check + AI Notes through this audit
3. **Tag taxonomy** — agreed legend for AI Check column. Reyco's:
   - 🟢 Finalized — page is good as-is
   - 🟡 Needs Finalization — minor polish, ship-blocker = no
   - 🔴 Errored — technically broken, ship-blocker = yes
   - 🟠 Design Issue — visual problem
   - 🟣 Needs Rewrite — copy issue
   - ⚫ Delete — page shouldn't exist
   - 🩷 Missing Product Tagged Carousels — page-template + data taxonomy issue
   - **Multiple tags allowed** — comma-separated (e.g., "Errored, Needs Rewrite")
4. **Service account** for Sheet writes (per `reference_glv_service_account` memory)
5. **WP Application Password** OR equivalent auth if REST API metadata reads needed (operating-conditions discipline per `feedback_credentials_routing`)

## Architecture

### Tools to set up at audit start

1. **Playwright SG-WAF bypass** (`tools/sg-waf-page-fetch-v2.mjs`) — chromium with stealth navigator overrides + persistent context + 30s sgcaptcha JS-challenge wait. Bypasses host-WAF on read-only static page fetches.

2. **Boss-solo technical audit script** (`tools/page-tech-audit.sh`) — bash script that greps rendered HTML for: META title/desc, H1/H2 counts, schema blocks, canonical, broken images, alt-empty count, ext/int/tel link counts, PHP errors, EMPTY_STATE_FIRES (template-defined empty-state markers).

3. **REST API broker** (`tools/sg-waf-rest-broker.mjs`) — Playwright-brokered REST calls using cached sgcaptcha clearance + Basic Auth via App Password. Read-only; mutations route back to standard credential pipeline.

4. **Audit state file** (`deliverables/audits/page-by-page/state.json`) — tracks progress, completed_rows, in_flight, pre-fetched, telegram pings.

### Phases

**PHASE 1 — Setup (~10 min)**
- Confirm Sheet structure + tag legend with user
- Set up Playwright + page-tech-audit.sh + REST broker
- Prep state.json
- Pre-fetch first 5 pages

**PHASE 2 — Calibration (multi-agent, ~30-45 min for 5 pages)**
- For first 5 pages with user manual notes already filled:
  - Playwright fetch page → save HTML + screenshot
  - Dispatch in PARALLEL to designer + dev + web-copy + (SEO if responsive)
  - Each agent returns DOMAIN_TAG + DOMAIN_NOTES (3-6 bullets)
  - Boss aggregates into AI Check (highest-blocker tag) + AI Notes (multi-domain bullets)
  - Compare AI tag to user's manual tag for calibration

**PHASE 3 — Boss-solo bulk (1-3 min/page)**
- Once calibration shows ≥80% tag alignment:
  - Pre-fetch 5-10 pages ahead in background
  - Per page: read screenshot + page-tech-audit.sh + apply rubric
  - Pattern-match against calibration findings
  - Write to Sheet
- Drift-check every 100 pages: re-engage multi-agent on 1 page to detect rubric decay

**PHASE 4 — Pattern-batch (seconds/page)**
- For pages sharing identifiable URL/render signatures (e.g., 374 product pages all on /product/[slug]/):
  - Write batched entries with shared notes per pattern group
  - Identify duplicates by URL slug pattern (e.g., -N suffix)
  - Tag duplicates as Delete with 301-redirect recommendation

**PHASE 5 — Findings synthesis + fix-shipping**
- Aggregate site-wide patterns (e.g., generic META_DESC, fabricated-authorisation flags)
- Bank ledger pattern candidates
- Propose Phase A/B/C fix-shipping plan (immediate / user-gated / post-launch backlog)
- Surface to user via Telegram digest + internal Slack mirror

## Anomaly escalation triggers (re-engage multi-agent)

Triggers worth escalating to multi-agent re-engagement during boss-solo:
- Cross-vertical product card leak (boat product on lawn brand page, etc.)
- Fabricated-authorisation claim (brand page claims "Authorised X Dealer" but X not on banked list)
- Render bug (PHP errors visible, broken images, missing template parts)
- Security finding (form input vuln, exposed admin path, exfil-able data)
- Template-rendering anomaly (page renders 5x bigger than peers, or missing standard sections)

## Routing patterns

- **PR review**: through-boss (dev opens PR → boss relays diff to pentester → verdict back through boss → dev merges)
- **Slack mirror**: post audit deliverables to internal-{client} channel (boss owns Slack comms)
- **App Password lifecycle**: pentester owns operating-conditions (rotation/revoke timing, audit-log sweep on revoke). Audit-end = revoke trigger.

## Lessons banked (Reyco run 2026-04-26)

1. **Multi-agent calibration validates rubric in 5 pages**, not 50 — pentester recommended drift-check every 100 pages as continuous calibration safety net
2. **Throughput bottleneck = agent response time, not Playwright fetch** — bulk solo with multi-agent on anomalies is the right cost-allocation
3. **URL slug pattern recognition shaves hours** — 141/374 product duplicates identified via -N suffix in seconds, no per-page audit needed
4. **App Password REST broker is read-only enumeration only** — write/mutation paths route back to standard credential pipeline regardless of carve-out
5. **Pattern-batch writes to Sheet (chunks of 100)** scale linearly — don't use per-row API calls for 500+ rows

## Ledger v1.1 candidates banked from Reyco run

1. **PHP-coerce-null-via-conditional-scope** (CODE class) — variable declared in conditional A, referenced outside A; PHP coerces null silently; downstream treats null as "no filter" — produces silent misbehavior. 4-element decomposition. Mitigation pair: variable hoist + absolute null guard.
2. **template-filename-construction-fragility** (CODE/path-construction sub-class) — template constructs include path from runtime data; file-not-found silently falls back to empty config; slug evolves independently of filename. 4-element decomposition. Mitigation: file_exists guard with error_log.
3. **audit-speculation-promoted-to-finding-without-verification** (AUDIT-METHOD class) — audit speculates mechanism + promotes to "MOST LIKELY" without state-query verification; downstream over-scopes work queue. 6-element decomposition incl avoided-cost variant.
4. **grid-orphan-when-items-don't-divide-evenly** (PRESENTATION/LAYOUT class) — items count modulo column count; CSS grid silently leaves orphan slots. 3+ instances threshold reached.

## Anti-patterns

- Don't fetch every page upfront — stream + pre-fetch ahead of audit pass
- Don't dispatch multi-agent on every page — burn agent context window for low marginal value on routine product pages
- Don't trust audit speculation as established finding — verify state via DB query / file content / HTTP response before treating as confirmed
- Don't hold credentials past audit-end — operating-conditions discipline doesn't bend on indefinite hold
- Don't skip the calibration phase — boss-solo bulk without calibrated rubric drifts silently
