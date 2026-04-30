---
name: chino:content-plan
description: Siloed content calendar with cannibalization checks, funnel stage mapping, and cross-channel distribution flags. Integrates with Marketing Director plan when available. Builds structured content plan with hub pages, supporting content, content codes, and internal linking maps. Trigger with /chino:content-plan <client>.
---

# /chino:content-plan — Siloed Content Calendar

> Builds a structured content calendar using the silo/hub model from Episode 5. Includes content codes, cannibalization checks, internal linking plans, and priority ordering.

## Trigger

- `/chino:content-plan <client>`
- "Content plan for <client>"
- "Build content calendar for <client>"

## Autonomy

**Assignment:** `agent-autonomous` — read-only data analysis + content planning.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| `client` | Yes | Command parameter — resolved via alias map |

---

## Process

### Step 1: Resolve Client Config

1. Resolve client alias
2. Read `projects/<client>/CONTEXT.md` → extract `seo:` block and business context

### Step 2: Load Knowledge Base

Read `.claude/skills/chino/references/6-level-framework.md` — focus on Level 5:
- Content plan development with content codes
- Silo strategy (hub + spoke model)
- Internal linking framework (previous/next chain)
- Cannibalization detection
- Content bloat prevention

### Research Integration (Optional)

Before starting, check if `projects/<client>/research/` exists:

1. If `avatars/` folder exists → read `test-group-panel.md` and `avatars/*.md`. Map content topics to avatar pain points and buying stage — ensure each silo addresses a real customer journey.
2. If `pillar-d-global-intelligence.md` exists → read it. Pull content formats that work globally in this niche and adapt for local context.
3. If `pillar-g-community-local.md` exists → read it. Identify trending local topics from community groups and media for timely content opportunities.
4. If `synthesis-opportunities-and-threats.md` exists → read it. Align content priorities with top opportunities identified across all research pillars.

Use research insights to enrich output. Cite specific findings when they inform recommendations. If research files don't exist, proceed normally — all core functionality works without research.

### Director Plan Integration (when run as part of /onboard Stage 5)

If `projects/<client>/strategy/marketing-director-plan.md` exists, read it BEFORE starting the content plan. The Director plan provides:

- **Funnel stage mapping:** Which keyword clusters map to TOFU (awareness articles), MOFU (consideration guides), or BOFU (money/service pages)
- **Grand messages:** Content should support and reinforce the grand messages — articles that echo the emotional themes
- **Campaign themes:** Quarterly campaign themes that content should align with (publish supporting content before campaigns launch)
- **Email content needs:** The email automation flows need blog articles to fuel the content drip — prioritise articles that feed Flow A (Content & Information)
- **Social distribution value:** Which content pieces are most shareable and should be flagged for social teasing
- **Ad landing pages:** Which content pieces serve as landing pages for MOFU/BOFU ad campaigns

**When the Director plan exists, apply these rules:**

1. **Money pages (Priority 1)** align with BOFU keywords — these are the conversion pages the Director plan's BOFU grand message drives traffic to
2. **Category/comparison pages (Priority 2)** align with MOFU — consideration content that supports the MOFU grand message
3. **Articles (Priority 3)** prioritised by:
   - (a) Email automation feed needs — articles that enter the content flow drip
   - (b) Social distribution value — shareable, engaging pieces the client's team can post
   - (c) TOFU awareness building — articles that support the TOFU grand message themes
   - (d) Campaign support — articles published before quarterly campaign launches
4. **Content calendar timing** aligns with quarterly campaign themes from the Director plan
5. **Internal linking** reinforces the funnel — articles (TOFU) link to guides (MOFU) which link to service pages (BOFU)

### Step 3: Gather Existing Content Data

#### Pull indexed content from GSC

```
mcp__google-search-console__enhanced_search_analytics
siteUrl: <gsc_property>
startDate: 90 days ago
endDate: today
dimensions: page
rowLimit: 1000
```

This tells us what content already exists and performs.

#### Check for existing keyword research

Look in `projects/<client>/seo/keyword-research/` for recent keyword research files. If available, use them as input for the content plan.

#### Check for existing competitor analysis

Look in `projects/<client>/seo/keyword-research/` for competitor analysis files. Use content gaps as input.

### Step 4: Build Silo Structure

Based on the client's services/products and keyword data:

1. **Identify 3-5 silos** (topic clusters) based on:
   - Core services/products
   - Keyword clusters from research
   - Competitor content gaps

2. **For each silo, define:**
   - Hub page (pillar content — comprehensive guide or service page)
   - Supporting content (blog posts, FAQs, case studies targeting long-tail keywords)
   - Internal linking plan (spoke → hub, sequential linking between related posts)

### Step 5: Assign Content Codes

Use the Episode 5 content code system:
- Format: `[PREFIX]-[NUMBER]` (e.g., `T001`, `T002` for Titan; `F001` for Fusion)
- Prefix based on client: T=Titan, F=Fusion, G=GLV, S=Soo Sackers
- Sequential numbering within each silo

### Step 6: Cannibalization Check

For each planned piece of content:
1. Check if an existing page already targets the same primary keyword
2. Check if the planned content would compete with existing indexed pages
3. Flag any potential cannibalization conflicts
4. Recommend: merge, differentiate, or skip

### Step 7: Priority Ordering

Prioritize content pieces by:
1. **Business impact** — Money pages and transactional content first
2. **Quick wins** — Topics where the site already has some authority
3. **Gap filling** — Content competitors have but client doesn't
4. **Supporting content** — Blog posts that boost hub page authority

### Step 8: Save Output

Save to: `projects/<client>/seo/content-plans/YYYY-MM-DD-content-plan.md`

### Step 9: Update State

Update `.state/chino-state.json`:
- Set `lastContentPlan` to today's date
- Append to `runs` array

---

## Output Template

```markdown
# Content Plan — [Client Name] — [YYYY-MM-DD]

> Generated by /chino:content-plan | Domain: [domain]

## Content Strategy Summary

- **Total content pieces planned:** [X]
- **Silos defined:** [X]
- **Existing indexed pages:** [X]
- **Content gaps identified:** [X]
- **Cannibalization risks:** [X]

## Existing Content Inventory

| # | URL | Clicks (90d) | Impressions | CTR | Position | Status |
|---|-----|-------------|-------------|-----|----------|--------|
| 1 | / | ... | ... | ... | ... | Performing |
| 2 | /services | ... | ... | ... | ... | Underperforming |
| ... | ... | ... | ... | ... | ... | ... |

## Silo Structure

### Silo 1: [Topic/Service Area]

**Hub Page:** [URL or "NEW — create"]
**Target Keyword:** [primary keyword]
**Status:** [exists / needs creation / needs update]

| Code | Content Piece | Target Keyword | Type | Funnel Stage | Priority | Status | Internal Links |
|------|--------------|----------------|------|-------------|----------|--------|----------------|
| [X]001 | [Title] | [keyword] | Hub page | BOFU | 1 | [new/update] | Links to all spoke pages |
| [X]002 | [Title] | [keyword] | Blog post | TOFU | 2 | [new] | Links to hub + [X]003 |
| [X]003 | [Title] | [keyword] | Comparison guide | MOFU | 3 | [new] | Links to hub + [X]002 |

### Silo 2: [Topic/Service Area]

[Same structure]

### Silo 3: [Topic/Service Area]

[Same structure]

## Internal Linking Map

### Sequential Links (Previous/Next Chain)

Within each silo, blog posts link in sequence:

| Silo | Chain |
|------|-------|
| Silo 1 | [X]002 → [X]003 → [X]004 |
| Silo 2 | [X]005 → [X]006 → [X]007 |

### Hub-Spoke Links

| Hub | Spoke Pages |
|-----|-------------|
| [X]001 | [X]002, [X]003, [X]004 |
| [X]005 | [X]006, [X]007, [X]008 |

### Cross-Silo Links

| From | To | Anchor Text | Reason |
|------|-----|-------------|--------|
| [X]003 | [X]006 | [anchor] | Related topic |

**Funnel-reinforcing links:** Internal links should guide readers through the funnel:
- TOFU articles → link to related MOFU guides and comparison pages
- MOFU guides → link to relevant BOFU service/money pages
- BOFU pages → link back to supporting TOFU/MOFU content for visitors who aren't ready to convert

This creates a content funnel where organic visitors naturally progress from awareness → consideration → conversion through internal navigation.

## Cannibalization Check

| Planned Content | Existing Page | Overlapping Keyword | Risk | Resolution |
|----------------|--------------|-------------------|------|------------|
| [new piece] | [existing URL] | [keyword] | High/Med/Low | [Merge / Differentiate / Skip] |

## Content Calendar (Priority Order)

| Priority | Code | Content Piece | Silo | Target Keyword | Funnel Stage | Est. Word Count | Distribution | Due Date |
|----------|------|--------------|------|----------------|-------------|----------------|-------------|----------|
| 1 | [X]001 | [Title] | 1 | [keyword] | BOFU | [X] | Ad landing | [date] |
| 2 | [X]002 | [Title] | 1 | [keyword] | TOFU | [X] | Email + Social | [date] |

## Cross-Channel Distribution Flags

Each content piece should be flagged for its cross-channel value:

| Code | Title | Funnel | Email Drip? | Social Share? | Ad Landing? | Campaign Aligned? |
|------|-------|--------|------------|--------------|-------------|------------------|
| [X]001 | [Title] | BOFU | No | No | Yes — BOFU ads | — |
| [X]002 | [Title] | TOFU | Yes — Flow A queue | Yes — shareable | No | Q2 campaign |
| [X]003 | [Title] | MOFU | Yes — Flow A queue | Yes — educational | Yes — MOFU ads | — |

**Flag definitions:**
- **Email Drip:** Should this article be added to the email automation Flow A (Content & Information) queue? Most TOFU and MOFU articles should be.
- **Social Share:** Is this piece shareable enough for the client's social media team to post about? Include a suggested social caption.
- **Ad Landing:** Will any ad campaigns use this page as a landing page? If yes, note which funnel stage ads point here.
- **Campaign Aligned:** Does this piece support a specific quarterly campaign from the Director plan? If yes, it should publish 1-2 weeks BEFORE the campaign launches.

## Status Tracking

| Code | Title | Status | Date Published | Indexed |
|------|-------|--------|---------------|---------|
| [X]001 | [Title] | planned | — | — |
| [X]002 | [Title] | planned | — | — |

---

*Generated by /chino:content-plan on [date].*
*Update status column as content is created and published.*
*Run /chino:index-check after publishing to verify indexation.*
```

---

## Graceful Degradation

| Source | If Unavailable | Impact |
|--------|---------------|--------|
| GSC | Cannot inventory existing content — plan from scratch | Significant |
| Previous keyword research | Generate basic keyword targets from business context | Moderate |
| Previous competitor analysis | Skip gap analysis, focus on business priorities | Moderate |

---

## Related Skills

- `/chino:keyword-research` — Provides keyword clusters as input to content plan
- `/chino:competitor` — Provides content gaps as input to content plan
- `/chino:internal-linking` — Validates and expands the linking plan
- `/chino:on-page` — Optimizes individual content pieces after creation
- `/chino:index-check` — Verifies content is indexed after publishing
