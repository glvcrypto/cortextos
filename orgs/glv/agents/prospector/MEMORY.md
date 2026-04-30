# Long-Term Memory

*Last updated: 2026-04-19*

---

## Who I Am

Prospector agent for GLV Marketing. Runs the full outbound pipeline: niche research by city → scout → investigate → draft → review gate → Gmail draft. Goal is to book clients for GLV.

## Prospecting Workflow

- Full skill: `skills/prospecting/SKILL.md` (ported from life-OS 2026-04-19)
- Templates: `skills/prospecting/templates/lead-dossier.md`, `outreach-deliverable.md`
- Brand voice validation: `skills/brand-voice/SKILL.md`
- Default area: Sault Ste. Marie, Ontario (expandable to Thunder Bay, Sudbury, North Bay, Canada-wide)
- Target: businesses ranked #6 and below in local search
- Compare every prospect to local #1 competitor

## Key Rules (Autonomy)

- Research, scout, investigate, draft — fully autonomous
- Sending emails: Aiden approves via review gate, then I send directly via Gmail API (not draft). Log each as email_sent event.
- Send window: 9am-6pm Mon-Fri America/Toronto. Outside window = schedule for next slot, confirm time to Aiden.
- Hard cap: 100 emails sent per UTC day
- CASL: cold outreach is one-time intro only. No follow-up sequences. Ever.
- CASL PS: every outreach email MUST include a PS at the bottom stating it is a one-time introduction and recipient will not receive follow-up emails. Wording to be confirmed by Aiden (2026-04-23).

## GLV Context

- Aiden Glave, founder. Co-founded with Ben Pelta (input-only, Mexico-based).
- Booking link: https://calendar.app.google/5hcxx2tWmVkNvS1c6
- Email: info@glvmarketing.ca | Phone: 705-975-0579
- Services: Local SEO, Google Ads, website dev, AI automation, GEO
- ICP: Local SMBs in Northern Ontario. Owner-operators. HVAC, plumbing, golf, construction, roofing, etc.
- Active clients: Reyco Marine ($5K setup + $2K/mo), Fusion Financial, Titan Tiny Homes, Soo Sackers (test)
- No clients paying via prospecting yet — pipeline is the priority

## Tools Available (from life-OS memory)

| Tool | Status |
|------|--------|
| Gmail MCP | Working — drafts to info@glvmarketing.ca |
| Semrush MCP | Working — params must be JSON object, not string |
| Playwright MCP | Available — browser automation for screenshots |
| Google Calendar | Working |
| Google Drive | Working |

## Communication Style

- Aiden: detailed messages fine, emojis fine, proactive updates, casual tone
- Outreach copy: plain language a tradesman would use. No jargon. No em-dashes. Canadian English.
- Banned words: genuinely, excited, thrilled, leverage, navigate, landscape, unlock, elevate, harness, delve, robust, seamless, synergy, and others listed in SKILL.md
- NO marketing jargon in outreach: "Local 3-Pack" = "first results on Google". "NAP" = "your business info". "GBP" = "your Google listing". "Local SEO" = "showing up on Google". Tradesmen don't know these terms. (Aiden flagged 2026-04-20)

## Onboarding

- Onboarded: 2026-04-19
- Prospecting skill ported from life-OS: /mnt/c/Users/joshu/Desktop/Agentic Workspace/life-os/.claude/skills/prospecting

## Email Verification
Email addresses pulled from the prospect's own website are considered verified. No MX lookup or third-party verification needed. (Aiden confirmed 2026-04-20)

## 2026-04-21 — v5 copy direction + hook re-verification

- v5 voice directive confirmed: passive niche-research framing ("we were mapping X market in Y, you came up") replaces v4 direct-observation framing ("I noticed this about you")
- 33 drafts in registry need rewrite — blocked on explicit go from Ben+Aiden in #internal-sales
- 3 stale hooks re-verified: polar-mech-tb (H1-pride), klimit-mech-tb (H5-NAP, 3 addresses), evolved-thermal-tb (H2-search-gap)
- 2 new Sudbury roofing leads staged: C&R Roofing (H5-opportunity, site-down), Strategic Roofing (H2-curiosity-search-gap, 3 indexed pages vs uncontested service keywords)
- reply_rate experiment (exp_1776674200_om4zb): n=0 across all cells, window 14d (expires May 4), need 2 more H2-curiosity leads for n=10 threshold

## 2026-04-22 (heartbeat update)
- Batch 1 (5 leads) live in #internal-email thread ts 1776816947.419319 — confirmed visible to Aiden/Ben
- No feedback yet as of 00:45 UTC Apr 22
- outreach-conversion exp_1776637621_ul3os window expires 2026-04-22T22:27Z — evaluate at 0 (null result, send gate RED), then run v5 baseline experiment (approval_1776817803_bap7z pending)
- reply_rate exp_1776674200_om4zb: n=2 total (H2-search-gap x S1: 1, H5-NAP x S1: 1), no replies, 13d remaining
- GOALS.md stale since Apr 19 — requested refresh from boss

## 2026-04-22 update
- 35 drafted leads, 2 sent, 1 DNC = 38 total in registry
- Two new SDY roofing drafts added: cr-roofing-sdby (H5-opp, dead domain), strategic-roofing-sdby (H2-search-gap, 3 pages indexed)
- Batch 1 in #internal-email (thread 1776816947.419319) — no feedback after 7h, likely overnight
- outreach-conversion exp_1776637621_ul3os expires 2026-04-22T22:27Z; next eval target

## 2026-04-22 — Ben verdict + v6 direction

- Ben rejected v5 batch 1 — factual errors on ALL 5 samples
- 9-step research process now MANDATORY before any draft (see below)
- All 40 staged leads need re-research via 9-step before redraft
- v6 hooks: website issues first, always. Triple-check every claim. Top priority only.
- CTA must state: who we are + what we do + how we help (in a few words)
- v6 goes to Aiden → Ben for review, NOT to send queue

Ben's 9-step research process:
1. Google them: website, GBP, socials, LinkedIn, directories
2. Check website FIRST — broken/one-pager/no content = always biggest lead
3. Then GBP, then LinkedIn, then social
4. NAP gap analysis across all sources
5. SEMrush: keywords, traffic, errors, 404s
6. List + rate all issues by priority
7. TRIPLE-CHECK all details (wrong facts = disqualified email)
8. Estimate impact on traffic/leads/sales/rep
9. Compare to direct local competitor — use real delta for the hook

New verified hooks for batch 1 (v6):
- Priest PLB NB: 53 5-star reviews, website testimonials section broken (empty template)
- Fitzgerald Roofing NB: last blog post Jul 2022 (4yr stale), no SEO infra, 85yr old co invisible online
- Northern Climate SDY: website returns HTTP 500 — completely down
- Peppard TB: 12 blog posts, 644 visits/mo, content not aimed at buying searches
- Adept PLB TB: 3-page site, 0 service pages, 1 Google review

## 2026-04-23 — v6 batch 1 complete (01:37 UTC)
- All 5 leads re-researched fresh with live WebFetch checks
- v6 drafts posted to #internal-sales (thread 1776909722.199959) with evidence packs
- Gmail draft IDs: Priest r3303159962915492609, Fitzgerald r-66355339208118186, Northern Climate r7000724342698631914, Peppard r6791868901585935158, Adept r-6739750782005468023
- Key hook corrections: Priest domain redirect resolved (new hook: empty testimonials); Adept homepage updated (new hook: zero service pages); all other hooks confirmed
- Send gate: RED. Awaiting Aiden/Ben iteration-to-perfect sign-off in #internal-sales
- All 40 staged v4/v5 leads still need 9-step re-research — post-v6 approval task

## 2026-04-22 pipeline status (updated 13:40 UTC)
- 77 total registry entries: 70 drafted, 2 sent, 4 researched (no email), 1 DNC
- 7 cities: North Bay, Sudbury, Thunder Bay, Barrie, Kingston, Peterborough, Ottawa
- Batch 1 in #internal-email (thread 1776816947.419319) since 20:15 EDT Apr 21 — no feedback yet as of 13:30 UTC Apr 22
- Batch 2 pre-selected: providence-plumbing-nb, ldr-heating-tb, keenan-sheet-tb, witherell-sdby, bay-roofing-nb
- outreach-conversion exp_1776637621_ul3os expires 2026-04-22T22:27Z — null result (send gate RED); evaluate at 0, then run v5 baseline (approval_1776817803_bap7z green)
- reply_rate exp_1776674200_om4zb: n=2 (H2-search-gap x S1: 1, H5-NAP x S1: 1), 0 replies, expires 2026-05-04
- Hook variant distribution (drafted): H1-pride: 18, H2-curiosity-search-gap: 11, H2-curiosity-service-gap: 1, H3-aspiration: 11, H4-validation: 6, H5-opportunity: 6, H5-opportunity-NAP: 9
- 4 remaining researched leads (no email): willow-tree-plumbing-barrie, cinanni-hvac-ottawa, lemay-heating-ottawa, ottawa-home-services-ottawa
- Medium-confidence bellnet emails used: Tom's Heating (tomsheatingandcooling@bellnet.ca), L&B Mechanical (john.lbmech@bellnet.ca) — older directory data, publicly indexed
