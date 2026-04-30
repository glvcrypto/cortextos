# Long-Term Memory

## Operating Model
- Configured-but-stopped by default to conserve Claude Max tokens. User restarts with `cortextos start seo` when Reyco work or ad-hoc tasks land.
- Reyco Marine retainer starts May 2026 (~10 days from 2026-04-19). 62 content funnels + directory submissions. Target: measurable GSC lift by end of Q3 2026.
- Every website change, content draft, GBP post, schema update = explicit user approval required. No exceptions, even on retainer cadence.

## Copy/Content Rules
- Positive emotional levers only: curiosity, aspiration, pride, validation, upside FOMO.
- No fear-mongering, scare stats, or shame framing. Frame stakes as UPSIDE not DOWNSIDE.
- Reference prospector's variant library at orgs/glv/agents/prospector/skills/outreach-variants/SKILL.md for outbound copy.

## Coordination
- Page-CRO / form-CRO implementation → coordinate with dev agent (WordPress + web)
- Blog drafts / case studies / email campaigns → coordinate with content agent
- Agent-to-agent comms via `cortextos bus send-message` only — never edit other agents' directories

## Event Logging Standard
- Log every significant action (keyword_report_generated, schema_added, page_cro_recommended, audit_completed, etc.)
- Include in metadata: client, page/url, before/after metric where available
- Match prospector's pattern on metadata richness

## Clients
- Reyco Marine — primary retainer, May 2026 start
- Fusion Financial — ad-hoc SEO
- Titan Tiny Homes — ad-hoc SEO
- Soo Sackers — ad-hoc SEO / sandbox

## Skills Inventory
Ported from life-os:
- chino/ — full SEO brain (audit, keyword-research, content-plan, on-page, competitor, internal-linking, index-check, ai-visibility, tech-stack, launch-checklist). Trigger: /chino:<skill> <client>
- schema-markup, content-strategy, page-cro, form-cro, report

## Event Schema (agreed with analyst 2026-04-19)
- action/rankings_snapshot: client_slug, source, sampled_at, keywords_tracked, top3/10/20/100 counts, avg_position, total_clicks, total_impressions, ctr_avg
- action/keyword_change: client_slug, keyword, previous_position, new_position, delta, detected_at
- action/backlink_change: client_slug, source, metric, previous_value, new_value, delta, sampled_at
- action/seo_deliverable: client_slug, deliverable_type, page_count, keyword_count, shipped_at, approval_status, url
- First task on Reyco: fire rankings_snapshot baseline BEFORE any retainer work begins (pre-retainer anchor)

## Slack Channel Rule
Primary post always goes to #internal-seo (C0APTS6DLCA). Never post to #all-glv-marketing or any client-facing channel. Corrected by user 2026-04-20.
For client-specific SEO work, cross-post to #internal-<client> (e.g. #internal-reyco for Reyco work) in addition to the primary #internal-seo post. Fleet-wide pattern confirmed by boss 2026-04-21.
