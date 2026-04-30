---
name: report:monthly
description: Monthly client performance report pulling live data from GSC, GA4, Semrush, and Gmail. Auto-detects onboarding vs recurring mode. Outputs co-branded .md and .html files. Trigger with /report:monthly <client>.
---

# /report:monthly — Monthly Performance Report

> The core client deliverable. Pulls live data from all available sources, compiles a professional performance report, and outputs both markdown and client-ready HTML with co-branding.

## Trigger

- `/report:monthly <client>`
- "Generate monthly report for <client>"
- "Monthly report for <client>"

## Autonomy

**Assignment:** `agent-autonomous` — this is read-only data pulling + reporting.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| `client` | Yes | Command parameter — resolved via alias map |

No other inputs needed. All config comes from the client's CONTEXT.md.

---

## Process

### Step 1: Resolve Client Config

1. Resolve client alias:
   - `soo` -> `soo-sackers`
   - `titan` -> `titan-tiny-homes`
   - `fusion` -> `fusion-financial`
   - `reyco` -> `reyco-marine`
   - `glv` -> `glv-marketing`
   - Full slugs pass through unchanged
2. Read `projects/<client>/CONTEXT.md`
3. Extract config blocks:
   - `seo:` — domain, gsc_property, ga4_mcp, ga4_property_id, semrush_project
   - `brand:` — primary_colour (defaults to `#B22222` if not set)
4. If CONTEXT.md is missing, fail with a clear error

### Step 2: Detect Report Mode

Check `projects/<client>/reports/` for existing monthly report files (pattern: `*-monthly-report.md`).

- **If no prior monthly reports exist:** ONBOARDING MODE
  - Cover the full engagement period (from start date in CONTEXT.md to today)
  - Focus on what was built, where things stand, what's next
  - Use the onboarding section structure

- **If prior monthly reports exist:** MONTHLY MODE
  - Cover the last 30 days
  - Include month-over-month comparisons using data from the most recent prior report
  - Use the monthly section structure

### Step 3: Pull Data (5 Parallel Agents)

Launch up to 5 Task agents simultaneously using the Task tool. Each agent reads CONTEXT.md first for identifiers. If a source is unavailable (null config or auth failure), skip gracefully.

#### GSC Agent (always run)

**Subagent type:** `general-purpose`

Read CONTEXT.md to get `seo.gsc_property`. Pull from Google Search Console:

1. `mcp__google-search-console__enhanced_search_analytics` — last 28 days (or full period in onboarding mode), dimensions: `query,page`, rowLimit: 1000
2. `mcp__google-search-console__list_sitemaps` — get all sitemaps
3. `mcp__google-search-console__detect_quick_wins` — positions 4-20, min 5 impressions
4. `mcp__google-search-console__index_inspect` — check indexation status of key pages

Return structured markdown with:
- Total clicks, impressions, CTR, average position
- Top queries (clicks, impressions, CTR, position)
- Top pages (clicks, impressions, CTR, position)
- Sitemap status (submitted vs indexed counts)
- Indexed pages count and any indexation issues
- Quick wins (queries with improvement potential)

#### GA4 Agent (if ga4_mcp is not null)

**Subagent type:** `general-purpose`

Read CONTEXT.md to get `seo.ga4_mcp` and `seo.ga4_property_id`. Use the client-specific GA4 MCP server (e.g., `mcp__ga4-fusion__runReport`).

1. `getActiveUsers` — last 28 days
2. `getPageViews` — top pages by views, last 28 days
3. `getUserBehavior` — traffic sources, device breakdown
4. `getEvents` — conversion events if configured

Return structured markdown with:
- Sessions by channel (organic, direct, social, paid, referral)
- Bounce rate and average session duration per channel
- Top pages by views
- Device breakdown (desktop/mobile/tablet)
- Any conversion events

#### Semrush Agent (if semrush_project is configured)

**Subagent type:** `general-purpose`

Read CONTEXT.md to get `seo.semrush_project`. Use Semrush MCP tools:

1. `mcp__semrush__overview_research` — domain overview
2. `mcp__semrush__organic_research` — organic keyword positions
3. `mcp__semrush__backlink_research` — referring domains, backlink count

Return structured markdown with:
- Authority score
- Total backlinks and referring domains
- Organic keyword count and top positions
- Organic traffic estimate

#### Meta Agent (if Meta ads are mentioned in CONTEXT.md)

**Subagent type:** `general-purpose`

Read CONTEXT.md to check for Meta campaign information. Search Gmail for Meta ad receipts:

1. Use `mcp__claude_ai_Gmail__gmail_search_messages` — search for "Meta" or "Facebook Ads" receipts in the reporting period
2. Extract: daily spend amounts, total spend, campaign names

Return structured markdown with:
- Total spend for the period
- Daily average spend
- Any lead/conversion data found in receipts
- Budget vs actual comparison (if budget target is in CONTEXT.md)

If no Meta data is found, return a note that Meta section should be skipped.

#### Work Log Agent

**Subagent type:** `general-purpose`

Search for what was actually done this period:

1. Read `memory/` files for the reporting period — look for entries mentioning the client
2. Check git log for commits mentioning the client: `git log --oneline --since="30 days ago" --grep="<client>"`
3. Check `projects/<client>/` for recently modified files
4. Read any task files in `tasks/clients/` related to this client

Return structured markdown with:
- Bulleted list of completed work items
- Categorised by type: SEO, Meta Ads, Website, Content, Technical

### Step 4: Compile Report

After all agents return, compile their outputs into a single report using the appropriate section structure below. For any data source that failed or was unavailable, skip that section and add a note at the bottom.

### Step 5: Apply Writing Rules

Before finalising, review the entire report against these rules:

**Banned characters:**
- No em dashes (—). Use commas, periods, or restructure the sentence.
- No exclamation marks.

**Banned words/phrases:**
- leverage, utilize, robust, seamless, comprehensive, delve into, furthermore
- it's worth noting, game-changer, cutting-edge, in order to

**Style rules:**
- Short sentences. Plain language. Write like talking to the client in a meeting.
- Canadian English: optimise, organised, colour, centre, favour, analyse
- "We" = GLV Marketing. Never assign actions to the client except in a "Your Input Needed" section.
- Frame as agency reporting to client, not auditor telling client what's broken.
- Use directional indicators where data allows: up X%, down X%, stable, new
- Numbers: use commas for thousands (1,000), round percentages to one decimal (26.2%)

### Step 6: Generate Outputs

1. Save markdown report to: `projects/<client>/reports/YYYY-MM-DD-monthly-report.md`
2. Read the HTML template from `.claude/skills/report/monthly/template.html`
3. Convert the markdown sections to HTML and inject into the template:
   - Replace `{{CLIENT_NAME}}` with the client's display name from CONTEXT.md
   - Replace `{{CLIENT_DOMAIN}}` with the domain from `seo.domain`
   - Replace `{{REPORT_DATE}}` with today's date formatted as "Month YYYY" (e.g., "March 2026")
   - Replace `{{DATA_PERIOD}}` with the reporting period (e.g., "February 1 - 28, 2026")
   - Replace `{{ACCENT_COLOUR}}` with `brand.primary_colour` (or `#B22222` if not set)
   - Replace `{{SECTIONS}}` with the compiled HTML sections
4. Save HTML report to: `projects/<client>/reports/YYYY-MM-DD-monthly-report.html`

### Step 7: Update State

Update `.state/report-state.json`:
```json
{
  "lastReport": {
    "<client>": {
      "date": "YYYY-MM-DD",
      "mode": "onboarding|monthly",
      "data_sources": ["gsc", "ga4", "semrush", "meta", "worklog"],
      "missing_sources": [],
      "output_md": "projects/<client>/reports/YYYY-MM-DD-monthly-report.md",
      "output_html": "projects/<client>/reports/YYYY-MM-DD-monthly-report.html"
    }
  },
  "runs": [
    {
      "client": "<client>",
      "date": "YYYY-MM-DD",
      "mode": "onboarding|monthly",
      "status": "complete",
      "data_sources": ["gsc", "ga4", "semrush"]
    }
  ]
}
```

---

## Section Structure: Onboarding Mode

Use this structure when no prior monthly reports exist for the client.

```markdown
# [Client Name] — Digital Performance Report
### [Month Year]

**Prepared by:** GLV Marketing
**Date:** [Full date]
**Domain:** [domain]
**Data period:** [Start date] — [End date]

---

## Executive Summary

[2-3 paragraphs: What we built, where things stand now, what we're focused on next. Keep it high-level. Lead with outcomes.]

**What we've built:**
- [Bullet list of major deliverables]

**What we're focused on now:**
1. [Top priority with brief explanation]
2. [Second priority]
3. [Third priority]

---

# PART 1: WHAT WE'VE BUILT

## Website
[Table of what was delivered: platform, pages, blog posts, hosting]

## Search Engine Optimisation (SEO) Foundation
[Table of technical SEO setup items and their status]

## Google Business Profile
[If GBP was set up — describe what it is and why it matters]

## Meta Ads Setup
[If Meta campaign exists — describe initial configuration]

## Content and Copywriting
[What was written: website copy, blog posts, ad copy]

---

# PART 2: META ADS CAMPAIGN
[Only include if CONTEXT.md has Meta campaign info]

## Campaign Overview
[Key metrics table: campaign type, budget, spend, leads, CPL, target CPL]

## What We've Done
[Changes made: paused ads, consolidated, optimised]

## What's Next for Meta
[Action table with timeline and expected impact]

---

# PART 3: SEO PERFORMANCE

## Current Search Visibility
[Key metrics table: clicks, impressions, CTR, pages indexed]

## Rankings Snapshot
[Table of top queries with clicks, position, trend]

## Technical Fixes
[Any technical work completed — canonical fixes, redirects, schema, etc.]

## Pages We're Getting Indexed
[Table of pages not yet indexed with plan for each]

## Backlink Profile
[Referring domains, quality backlinks, authority score]

## Traffic Quality
[Channel breakdown with sessions, bounce rate, duration]

---

# PART 4: WEBSITE IMPROVEMENTS

## What's Working Well
- [Bullet list of positives]

## Improvements We're Making
[Numbered list of planned improvements with brief explanation of each]

---

# PART 5: OUR 90-DAY PLAN

## Already Completed ([Month])
- [Bullet list of completed items]

## This Month ([Month])
[Grouped by category: Meta Ads, SEO, Website]

## Month 2 ([Month])
[Key initiatives]

## Month 3 ([Month])
[Key initiatives]

---

## Performance Targets

| Metric | Current | 30-Day Target | 90-Day Target |
|--------|---------|---------------|---------------|
| [metric] | [value] | [target] | [target] |

---

*Questions about anything in this report? Reach out anytime.*

**GLV Marketing** | info@glvmarketing.ca | 705-975-0579 | www.glvmarketing.ca
```

---

## Section Structure: Monthly Mode

Use this structure when prior monthly reports exist for the client.

```markdown
# [Client Name] — Monthly Performance Report
### [Month Year]

**Prepared by:** GLV Marketing
**Date:** [Full date]
**Domain:** [domain]
**Data period:** [Start date] — [End date]
**Previous report:** [Date of last report]

---

## Executive Summary

[2-3 short paragraphs: Headline wins, key metrics with month-over-month movement, what's next.]

---

## Highlights This Month

| Win | Detail |
|-----|--------|
| [Metric] | [Value] [directional arrow/indicator vs last month] |
| [Metric] | [Value] [directional arrow/indicator vs last month] |

---

## What We Did This Month

### SEO
- [Work items from work log agent]

### Meta Ads
[Only if applicable]
- [Work items]

### Website
- [Work items]

### Content
- [Work items]

---

## Meta Ads Performance
[Only include if CONTEXT.md has Meta campaign info]

| Metric | This Month | Last Month | Change |
|--------|-----------|------------|--------|
| Total spend | $ | $ | +/-% |
| Leads | X | X | +/-% |
| Cost per lead | $ | $ | +/-% |
| Daily budget | $ | $ | - |

[Brief commentary on what changed and why]

---

## SEO Performance

| Metric | This Month | Last Month | Change |
|--------|-----------|------------|--------|
| Google clicks | X | X | +/-% |
| Impressions | X | X | +/-% |
| Average CTR | X% | X% | +/- |
| Average position | X | X | +/- |
| Pages indexed | X | X | +/- |
| Authority score | X | X | +/- |
| Referring domains | X | X | +/- |

### Top Queries

| Query | Clicks | Position | Change |
|-------|--------|----------|--------|
| [query] | X | X | up/down/new/stable |

### Quick Wins

| Query | Current Position | Impressions | Action |
|-------|-----------------|-------------|--------|
| [query] | X | X | [recommendation] |

---

## Website Updates

[What was changed/improved on the site this month]

---

## 90-Day Rolling Plan

### Completed
- [Items completed this month, checked off from last month's plan]

### This Month
- [Current priorities]

### Next Month
- [Upcoming priorities]

### Month After
- [Longer-term priorities]

---

## Performance Targets

| Metric | Last Month | This Month | Target | Status |
|--------|-----------|------------|--------|--------|
| [metric] | [value] | [value] | [target] | on track / behind / ahead |

---

*Questions about anything in this report? Reach out anytime.*

**GLV Marketing** | info@glvmarketing.ca | 705-975-0579 | www.glvmarketing.ca
```

---

## Conditional Sections

Include or exclude sections based on what's in CONTEXT.md:

| Section | Include When |
|---------|-------------|
| Meta Ads Campaign / Meta Ads Performance | CONTEXT.md mentions Meta campaign, ad spend, or CPL targets |
| Google Business Profile | GBP was set up (mentioned in CONTEXT.md or work log) |
| Blog / Content section | Client has a blog (check CONTEXT.md or site structure) |
| Backlink Profile | Semrush data is available |
| Traffic Quality | GA4 data is available |

If a section is excluded, do not leave a placeholder or "N/A" — just skip it entirely.

---

## Graceful Degradation

| Source | If Unavailable | Impact |
|--------|---------------|--------|
| GSC | Skip SEO performance metrics, note "GSC data unavailable" | Major — no search data |
| GA4 | Skip traffic quality and session data | Moderate — no traffic breakdown |
| Semrush | Skip authority score, backlinks, organic keyword count | Moderate — no competitive data |
| Gmail (Meta) | Skip Meta section or use manual data from CONTEXT.md | Minor — Meta data approximated |
| Work Log | Skip "What We Did" or use abbreviated version | Minor — less detail on completed work |

No single source failure should prevent the report from generating. Always produce the best report possible with available data.

---

## Related Skills

- `/chino:audit` — Detailed SEO audit (more technical, internal-facing)
- `/report:monthly` uses chino data sources but produces a client-facing narrative report
