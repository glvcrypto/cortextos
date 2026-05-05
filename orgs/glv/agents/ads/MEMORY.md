# Long-Term Memory

## Client Tier for Ads Work

**No active paying ad clients yet** (as of onboarding 2026-04-19).

- *Reyco Marine* — retainer is SEO only ($5K setup + $2K/mo). Ads NOT included. Do not run ad work for Reyco without explicit instruction.
- *Titan Tiny Homes* — potential ads client, not live yet. Prep and monitor.
- *Fusion Financial* — Aiden running ads for them but not a paying arrangement. Low priority.
- *Soo Sackers* — sandbox only.

Rule: no scheduled reporting or proactive ad work until a paying ad client is confirmed. Suspend budget monitor cron until first live paid campaign. Ask boss or Aiden when a client is ready to go live.

## Approval Rules (from onboarding)

- nb2 creative generation: ALWAYS requires explicit approval before running
- Major campaign changes (structure, targeting overhauls): check first
- All budget commits, campaign launches, client deliverables: approval required
- Routine work (drafts, research, planning): autonomous

## Communication Style (from onboarding)

- Casual but technical, detailed with emojis
- Always provide progress updates on long tasks
- Proactively flag major findings and blockers

## Boss Briefing Notes (2026-04-19)

### Client Ad Status (authoritative from boss)
- Reyco: SEO retainer ONLY. Co-op advertising (Mercury/Cub Cadet/Toro/Echo) is FUTURE scope — do NOT propose without boss greenlight
- Fusion: Meta ads ACTIVE, 2 ads, $15/day CAD, ends Apr 30. Not paying. Final perf report task queued.
- Titan: 12 ad concepts + competitor research READY but Joseph not paying — do NOT proactively launch
- Soo Sackers: no paid scope
- @glvbuilds: user personal brand — coordinate with content agent if ads layer on

### API Credential Gap
No Meta Ads API or Google Ads API credentials in org secrets. Reports require Aiden to export data manually OR credentials added. Flag this when a report task fires.

### Campaign rebuild doc gap
fusion/deliverables/ads/meta-campaign-rebuild-mar2026.md referenced in context.json but NOT ported to cortextos. Needed for Fusion report.

## Fusion Deliverable Docs (confirmed present 2026-04-19)
- orgs/glv/clients/fusion/deliverables/ads/meta-campaign-rebuild-mar2026.md
- orgs/glv/clients/fusion/deliverables/ads/tax-season-meta-briefs.md

## API Reporting Skill (from scout 2026-04-19)
- orgs/glv/agents/ads/skills/api-reporting/SKILL.md — Meta Graph API + Google Ads API query patterns
- For Fusion report: campaign level first, then adset breakdown
- Requires META_ACCESS_TOKEN in org secrets before live pull

## Reyco Co-op Advertising Rules (from scout 2026-04-20)
Research at: orgs/glv/clients/reyco/research/coop-advertising-brief.md

RULE: No Mercury, Toro, or Cub Cadet paid campaign launches without co-op eligibility check first.
- Mercury Canada: 50% co-op on qualifying digital ads — pre-approve via MercNET before launch
- Toro / Cub Cadet: 50-70% reimbursement on spring campaigns — pre-approval required
- STIHL: 1% accrual fund — Territory Manager pre-approval required

Gate: Reyco ads scope is FUTURE only. No proposals without boss greenlight first.

## Meta Andromeda Update (Apr 2026) — from scout
Source: socialmediaexaminer.com, 1clickreport.com

Creative is now the primary targeting signal, not audience settings.

Key implications:
1. Need 15-50+ active creatives for Meta to optimize properly — 2-3 ads = dead campaign
2. UGC (raw/authentic) outperforms polished production. Founder selfie-style clips = lowest cost entry
3. Best structure: 2 campaigns only — one for testing new creatives, one for scaling winners

For Fusion post-Apr 30 (if continuing): first priority is creative volume, not budget increase. JB/Tony phone video clips are the move.
For Titan (when live): 12 concepts ready — natural fit for test/scale structure.
All future campaign briefs should default to 2-campaign structure and UGC-first creative guidance.

Advertisers using this structure: 20-35% higher ROAS vs legacy setups.

## Slack Mirror Policy (from boss 2026-04-21)
Mirror deliverables and status to Slack channel #internal-sales (C0APTSFSHU2).

Post to this channel on:
- Campaign launches
- Fusion Apr report drop (when data fills in post-Apr 30)
- Any significant milestones

Use MCP Slack tool: mcp__claude_ai_Slack__slack_send_message, channel C0APTSFSHU2.

## Platform Updates (from scout 2026-04-22)

### Meta AI-Automated Campaigns
Meta now supports end-to-end AI campaign management: provide a business URL + budget, AI handles creative, targeting, placement, and bidding. 
Key implication: "give us a URL and a budget" is now a real client pitch, not a simplification. Use this framing when onboarding GLV's first paying ads client.

### TikTok Engaged Session Metric
New metric tracking users who spend 10+ seconds on site after clicking an ad — no pixel required.
More meaningful quality signal than raw CTR. Watch this over CTR for any future TikTok campaigns.

## Platform Updates (from scout 2026-05-05 — verified findings)

### Meta CTR Attribution Overhaul (Q1 2026) — CRITICAL FOR BENCHMARKS
Meta now counts only real link clicks (not reactions/comments/shares) in CTR metrics.
**Impact:** Historical CTR baselines drop ~15-30% on apples-to-apples comparison.
**Action:** Revise all CTR kill-signal thresholds downward by 15-30% before Stage 4 Titan launch. Old target ≥1.0-1.5% CTR → new realistic target ≥0.7-1.1% CTR. Do not kill ads based on pre-Q1-2026 CTR benchmarks.

### Meta "Sponsored" → "Ad" Label (Q1 2026)
All placements now show "Ad" instead of "Sponsored." Minor visual shift — note for creative design review.

### Meta UGC Content Preference (Q1 2026)
Creator-filmed, unpolished content getting preferential organic distribution. Phone-shot, direct-to-camera outperforms produced assets in CPM.
**Action:** Confirms Joey UGC-first creative strategy for Titan. No change needed — direction validated.

### "Maximize Interactions" New Objective
Replaces "Post Engagement." Optimizes for comments/shares, not likes. Not relevant for lead gen campaigns.

### GA4 Native Meta + TikTok Cost Import (Q1 2026)
GA4 now natively imports Meta and TikTok cost data — no manual CSVs or third-party connectors needed.
**Action:** Enable when Titan pixel goes live for unified ROAS view without manual exports.

### TikTok Search Ads (keyword-targeted)
New surface for product-intent queries. Low priority — no current TikTok clients.

## Platform Updates (from scout 2026-05-01 — UNVERIFIED, secondary sources only)

### Google AI Max Copy Restrictions (unverified — almcorp.com aggregator)
Reportedly 25 term exclusions + 40 messaging restrictions enforced globally as of late April 2026.
Cited stat: 27% performance lift when copy aligns to new rules.
**Action when confirmed:** Run Performance Max copy audit for prohibited terms before any Google campaign build.
**Action now:** Cross-check against Google Ads policy emails or official blog before acting.

### Meta WhatsApp Unified Campaigns (unverified — swipeinsight.app aggregator)
Reportedly Meta launched centralized WhatsApp campaign creation in Ads Manager — same creative assets + unified budget across FB/IG/Threads/WhatsApp simultaneously.
**Action when confirmed:** Opens cross-platform budget testing without duplicating creative setups.
**Relevance:** Low priority now (no clients with WhatsApp presence). Flag when Titan or future client has WhatsApp lead channel.

## Platform Updates (from scout 2026-04-29)

### Meta Format Consolidation (Apr 16, 2026)
"Flexible" and "Collection" ad formats deprecated. Replaced by unified "Format Display Options."
New standard formats: Single Image/Video (up to 10 media files) + Carousel (images, video, or collection tiles).
Advantage+ Leads is now global.
Threads gets static carousels + video ads.
**Action:** For Titan Stage 4 and all future campaigns — use Single Image/Video or Carousel ONLY. Do not use Flexible or Collection.

### Google DSA → AI Max Upgrade (Sept 2026 auto-rollout)
AI Max campaigns average 7% conversion lift vs DSA at similar CPA/ROAS.
Key shift: bidding moves from keyword-centric to journey-aware (user segments + intent signals, not queries).
Auto-upgrades begin Sept 2026; voluntary testing window open now.
**Action:** For Reyco or future marine/trades clients — test AI Max at 5-10% of budget when Google Ads scope opens. Discovers long-tail queries automatically. Flag for planning when Reyco ads scope is greenlit.
