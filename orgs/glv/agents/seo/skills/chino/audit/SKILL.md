---
name: chino:audit
description: Weekly site health audit pulling data from GSC, GA4, and Semrush. Produces a comprehensive level-by-level assessment with prioritized issues and quick wins. Trigger with /chino:audit <client>.
---

# /chino:audit — Weekly Site Health Audit

> The most important /chino skill. Pulls data from all available sources, assesses site health across all 6 levels of the SEO framework, and produces a prioritized action report.

## Trigger

- `/chino:audit <client>`
- "Run SEO audit for <client>"
- "Audit <client>"
- Weekly automated run via `tasks/clients/chino-weekly-audits.md`

## Autonomy

**Assignment:** `agent-autonomous` — this is read-only data pulling + reporting.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| `client` | Yes | Command parameter — resolved via alias map |

No other inputs needed. All config comes from the client's CONTEXT.md `seo:` block.

---

## Process

### Step 1: Resolve Client Config

1. Resolve client alias (soo → soo-sackers, titan → titan-tiny-homes, etc.)
2. Read `projects/<client>/CONTEXT.md`
3. Extract the `seo:` YAML block:
   - `domain` — bare domain
   - `gsc_property` — GSC property identifier
   - `ga4_mcp` — GA4 MCP server name (may be null)
   - `ga4_property_id` — GA4 property ID (may be null)
   - `semrush_project` — Semrush project domain
   - `output_path` — where to save results

### Step 2: Load Knowledge Base

Read these reference files for assessment criteria:
- `.claude/skills/chino/references/6-level-framework.md`
- `.claude/skills/chino/references/routine-audit-sop.md`

### Research Integration (Optional)

Before starting, check if `projects/<client>/research/` exists:

1. If `synthesis-opportunities-and-threats.md` exists → read it. Align quick wins and prioritized issues with the top opportunities identified in the cross-pillar synthesis.
2. If `pillar-e-market-sizing.md` exists → read it. Include market-sizing context in recommendations — is the effort worth the addressable market?

Use research insights to enrich output. Cite specific findings when they inform recommendations. If research files don't exist, proceed normally — all core functionality works without research.

### Step 3: Pull Data (Parallel Subagents)

Launch up to 3 Task agents simultaneously using the Task tool. Each agent pulls data from one source. If a source is unavailable (null config or auth failure), skip it gracefully.

#### GSC Agent (always run)

**Subagent type:** `general-purpose`

Pull from Google Search Console:
1. `mcp__google-search-console__enhanced_search_analytics` — last 28 days, dimensions: `query,page`, rowLimit: 1000
2. `mcp__google-search-console__list_sitemaps` — get all sitemaps for the property
3. `mcp__google-search-console__detect_quick_wins` — positions 4-10, min 10 impressions

Use the client's `gsc_property` value for the `siteUrl` parameter.

Return structured markdown with:
- Top queries (clicks, impressions, CTR, position)
- Top pages (clicks, impressions, CTR, position)
- Sitemap status (submitted vs indexed counts)
- Quick wins (queries in positions 4-10 with improvement potential)

#### GA4 Agent (if ga4_mcp is not null)

**Subagent type:** `general-purpose`

Pull from the client's specific GA4 MCP server. Use the exact MCP tool names with the client's server prefix (e.g., `mcp__ga4-fusion__runReport`, `mcp__ga4-titan__getPageViews`).

1. `runReport` — metrics: sessions, activeUsers, bounceRate; dimensions: date; last 28 days
2. `getPageViews` — top pages by views, last 28 days
3. `getUserBehavior` — traffic sources, device breakdown

Return structured markdown with:
- Traffic overview (sessions, users, bounce rate, trends)
- Top pages by views
- Traffic source breakdown
- Device breakdown

#### Semrush Agent (if available)

**Subagent type:** `general-purpose`

Use Semrush MCP tools. First call `mcp__semrush__overview_research` to discover available reports, then use `mcp__semrush__get_report_schema` and `mcp__semrush__execute_report` to pull:

1. Domain overview — authority, organic traffic, keyword count
2. Site audit health score (if project exists)
3. Top organic keywords — positions, traffic share
4. Backlink summary — referring domains count

Return structured markdown with:
- Domain metrics (authority, traffic estimate)
- Health score (if available)
- Top keyword positions
- Backlink profile summary

### Step 4: Compile Audit Report

After all agents return, compile their outputs into a single report using the template below. For any data source that failed or was unavailable, mark it with a warning and note what's missing.

### Step 5: Save Output

Save the compiled report to:
`projects/<client>/seo/audits/YYYY-MM-DD-audit.md`

### Step 6: Update State

Update `.state/chino-state.json`:
- Set `lastAudit` to today's date
- Increment `auditStreak` by 1
- Update `openIssues` count based on issues found
- Append to `runs` array:
  ```json
  {
    "skill": "audit",
    "date": "YYYY-MM-DD",
    "status": "complete",
    "issues_found": <count>,
    "data_sources": ["gsc", "ga4", "semrush"]
  }
  ```

---

## Output Template

```markdown
# SEO Audit — [Client Name] — [YYYY-MM-DD]

> Generated by /chino:audit | Data sources: [list available sources]

## Health Summary

| Metric | Value | Trend | Status |
|--------|-------|-------|--------|
| Semrush Health Score | X/100 | up/down/stable | green/yellow/red |
| Indexed Pages | X/Y | ... | ... |
| GSC Clicks (28d) | X | ... | ... |
| GSC Impressions (28d) | X | ... | ... |
| Avg CTR | X% | ... | ... |
| Avg Position | X | ... | ... |
| GA4 Sessions (28d) | X | ... | ... |
| Open Issues | X | ... | ... |

## Level-by-Level Assessment

### Level 1: External
- Backlink profile: X referring domains
- Citations status: [known/unknown]
- GBP status: [active/not set up/unknown]
- Notes: [any observations]

### Level 2: Domain
- Hosting: [provider if known]
- SSL: [active/expired/unknown]
- Server status: [any issues detected]

### Level 3: Navigation
- Site structure issues: [any click depth or architecture problems]
- Sitemap status: X pages submitted, Y indexed
- robots.txt: [properly configured / issues found]

### Level 4: Crawlability
- Crawl errors: [count and types]
- 404s found: [count]
- Soft 404s: [count]
- Blocked pages: [any issues]

### Level 5: Indexation
- Total indexed: X pages
- Crawled, not indexed: X pages
- Discovered, not indexed: X pages
- Index coverage: X%
- Content health: [healthy / bloat warning / critical]

### Level 6: On-Page
- Top keyword positions: [summary]
- Quick wins available: [count]
- SERP features present: [map pack, PAA, featured snippets, etc.]

## Top Issues (Prioritized)

| # | Level | Severity | Issue | Recommendation |
|---|-------|----------|-------|---------------|
| 1 | LX | red/yellow | [Issue description] | [Fix recommendation] |
| 2 | ... | ... | ... | ... |

## Quick Wins

Queries in positions 4-10 with potential for improvement:

| Query | Current Pos | Impressions | CTR | Page | Action |
|-------|------------|-------------|-----|------|--------|
| ... | ... | ... | ... | ... | Optimize title/description |

## AI Visibility

[If GA4 data available: check for AI referral sources (chatgpt, perplexity, claude)]
[If not available: "AI visibility data requires GA4 — not configured for this client"]

## Next Actions

1. [Highest priority fix — with specific steps]
2. [Second priority]
3. [Third priority]

---

*Generated by /chino:audit on [date]. Next audit due: [date + 7 days].*
*Data sources: [list which sources returned data vs which failed]*
```

---

## Graceful Degradation

| Source | If Unavailable | Impact |
|--------|---------------|--------|
| GSC | Skill cannot run — GSC is required | Fatal (GSC is the baseline) |
| GA4 | Skip GA4 section, note "No GA4 configured" | Reduced — no traffic/conversion data |
| Semrush | Skip Semrush sections, note "Semrush unavailable" | Reduced — no health score/backlink data |

If Semrush OR GA4 fails, the audit still runs with GSC data. If GSC fails, report the error and do not produce a partial audit.

---

## Previous Audit Comparison

When running an audit, check for the most recent previous audit in the client's audits folder. If one exists, include trend indicators (up/down/stable) by comparing current values to the previous audit's values.

---

## Related Skills

- `/chino:index-check` — Deeper dive into indexation issues found in audit
- `/chino:tech-stack` — Technical foundation details
- `/chino:on-page` — Per-page optimization for quick win pages
