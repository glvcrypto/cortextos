---
name: ecosystem-sources
description: Canonical source list for Scout's daily ecosystem scans and weekly domain scans. Check these in order before hitting the open web.
---

# Ecosystem Sources

## Step 0: Check Internal First

Before any web search, read the life-OS Slack channel — it has nightly intel digests already compiled:
- **Slack #glv-life-os** (C0AQFQ8FRBP) — read last 5 messages for evening digest summaries
- If you see "intel digest" or "evening review" entries, extract findings and skip duplicate web searches

---

## Daily Ecosystem Scan Sources

### Anthropic / Claude
- Blog: https://www.anthropic.com/news
- Claude Code changelog: https://github.com/anthropics/claude-code/releases
- Simon Willison's blog (system prompt diffs, Claude analysis): https://simonwillison.net
- r/ClaudeAI (top posts, last 24h): https://www.reddit.com/r/ClaudeAI/top/?t=day
- HN front page AI items: search "site:news.ycombinator.com Claude OR Anthropic"

### Agentic Repos
- GitHub trending (filter: Claude, agent, MCP): https://github.com/trending?q=claude+agent&since=daily
- cortextOS community catalog: `cortextos bus list-skills --format text`

---

## Weekly Domain Scan Sources (per specialist)

### SEO Agent
- Search Engine Journal: https://www.searchenginejournal.com
- Moz Blog: https://moz.com/blog
- Ahrefs Blog: https://ahrefs.com/blog

### Content Agent
- Copyblogger: https://copyblogger.com/blog
- Backlinko (SEO + content): https://backlinko.com/blog
- Creator economy: look for top posts on X/LinkedIn with "creator" + engagement data

### Dev Agent
- WP Tavern: https://wptavern.com
- CSS-Tricks / Smashing Magazine for CRO/UX: https://www.smashingmagazine.com
- CXL Blog (CRO/CTA): https://cxl.com/blog

### Prospector Agent
- Alex Berman / Reply.io blog for cold outreach frameworks
- Woodpecker Blog: https://woodpecker.co/blog
- Close.io Blog: https://blog.close.com

### Ads Agent
- Google Ads Help Center updates: https://support.google.com/google-ads
- Meta for Business blog: https://www.facebook.com/business/news
- TikTok for Business: https://www.tiktok.com/business/en/blog

---

## Scan Protocol

1. Check #glv-life-os first (Step 0)
2. For each source category relevant to today's scan type (daily vs weekly), fetch the latest
3. Filter for items published in the last 24h (daily) or 7d (weekly)
4. Rate each finding: is it directly actionable for a specific agent? If yes, message that agent.
5. Assign a `suggestion_id` to every upgrade recommendation sent: format `scout-sugg-<short-id>` (e.g. `scout-sugg-a3x9k`). Include it in the agent message meta so the specialist can reference it if they act on it.
6. Log all findings using the analyst-standard meta schema (see below)
7. Only escalate to boss if it's a major model change or fleet-wide impact item

## Event Meta Schemas (analyst standard — use exactly these fields)

### action/ecosystem_scan
```bash
cortextos bus log-event action ecosystem_scan info --meta '{
  "agent":"scout",
  "scan_scope":"mixed",
  "items_reviewed":<int>,
  "items_flagged":<int>,
  "duration_sec":<int>
}'
```

### action/domain_scan
```bash
cortextos bus log-event action domain_scan info --meta '{
  "agent":"scout",
  "target_agent":"<specialist>",
  "domain":"seo|content|prospecting|ads|dev|ops",
  "findings_count":<int>,
  "suggestions_made":<int>
}'
```

### action/agent_audit
```bash
cortextos bus log-event action agent_audit info --meta '{
  "agent":"scout",
  "target_agent":"<specialist or fleet>",
  "audit_type":"health|config|skill_coverage|kpi_alignment",
  "pass_items":<int>,
  "fail_items":<int>,
  "suggestions_count":<int>
}'
```

### action/skill_created
```bash
cortextos bus log-event action skill_created info --meta '{
  "agent":"scout",
  "target_agent":"<who the skill was dropped to>",
  "skill_name":"<name>",
  "source":"imported_from_life_os|newly_authored|catalog_install|remix",
  "lines_of_code":<int>
}'
```

### Suggestion ID Convention
Every outbound upgrade recommendation gets a `suggestion_id: "scout-sugg-<short-nanoid>"`.
Include in the agent message text so the specialist can log `triggered_by: "<suggestion_id>"` when they act on it.

---

## Routing Table

| Finding type | Route to |
|---|---|
| New Claude model / major Claude Code feature | boss (escalate) + all specialists |
| Prompt technique / agentic pattern | All specialists via broadcast |
| SEO algorithm update | seo |
| Cold outreach tactic | prospector |
| WP/CRO/dev best practice | dev |
| Content/creator strategy | content |
| Ad platform change | ads |
| cortextOS new skill | All specialists |
