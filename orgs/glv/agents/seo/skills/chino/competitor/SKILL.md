---
name: chino:competitor
description: Organic SEO competitor analysis — identifies top competitors, analyses their content strategy, site architecture, SERP features, and keyword gaps. Trigger with /chino:competitor <client>.
---

# /chino:competitor — Competitor Analysis

> Analyses the organic SEO competitive landscape for a client. Identifies top competitors, their strategies, content templates, and keyword gaps to exploit. Based on Episodes 1, 3, and 6 of the SEO training course.

## Trigger

- `/chino:competitor <client>`
- "Competitor analysis for <client>"
- "Who are <client>'s SEO competitors?"

## Autonomy

**Assignment:** `agent-autonomous` — read-only data pulling + analysis.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| `client` | Yes | Command parameter — resolved via alias map |

---

## Process

### Step 1: Resolve Client Config

1. Resolve client alias
2. Read `projects/<client>/CONTEXT.md` → extract `seo:` block and industry context
3. Note the domain, services, target location

### Step 2: Load Knowledge Base

Read `.claude/skills/chino/references/6-level-framework.md` — focus on:
- Level 1: External presence and link building
- Level 3: Competitor template research, navigation patterns
- Level 6: Competitor gap analysis, SERP feature tracking

### Research Integration (Optional)

Before starting, check if `projects/<client>/research/` exists:

1. If `pillar-b-direct-competitors.md` exists → READ it. Use the existing deep competitor profiles instead of re-discovering from scratch. Focus this skill's effort on SEO-specific gaps (keyword overlap, content gaps, SERP features) that Pillar B didn't cover in depth.
2. If `pillar-c-indirect-competitors.md` exists → read it. Check if indirect competitors have SEO strategies worth noting or cross-industry patterns to monitor.
3. If `synthesis-opportunities-and-threats.md` exists → read it for competitive positioning context.

Use research insights to enrich output. Cite specific findings when they inform recommendations. If research files don't exist, proceed normally — all core functionality works without research.

### Step 3: Identify Competitors

#### Via GSC (overlapping queries)

```
mcp__google-search-console__enhanced_search_analytics
siteUrl: <gsc_property>
startDate: 90 days ago
endDate: today
dimensions: query
rowLimit: 200
```

Take the top queries and use WebSearch to identify which domains appear for those queries.

#### Via Semrush (if available)

Use Semrush organic research tools to pull:
1. Organic competitors (domains competing for the same keywords)
2. Competitor keyword overlap
3. Competitor traffic estimates

#### Via Web Search

Search for the client's core service + location keywords and note which competitors appear:
- Search: "[service] sault ste marie"
- Search: "[service] northern ontario"
- Search: "[industry] near me" (from Sault Ste. Marie context)

### Step 4: Analyse Each Competitor (Top 3-5)

For each identified competitor, gather:

#### Domain Metrics
- Domain authority / traffic estimates (Semrush if available)
- Approximate organic traffic
- Number of ranking keywords

#### Content Strategy
Use WebFetch on competitor homepages and key pages:
- Blog frequency and topics
- Content types (guides, case studies, FAQs, tools)
- Content depth and quality indicators
- Author pages and E-E-A-T signals

#### Site Architecture (from Episode 3)
- Navigation patterns (mega menu, simple nav, footer links)
- Click depth to key pages
- URL structure (flat vs nested)
- Category/silo organization

#### Template Elements (from Episode 3)
Check what page elements competitors use:
- Author bylines and bio sections
- References and citations
- Data tables and comparison charts
- FAQ sections with structured data
- Calculators or interactive tools
- Disclaimers and legal notices
- Video embeds
- Customer reviews/testimonials on service pages

#### SERP Features (from Episode 6)
For the client's target keywords, note which SERP features competitors appear in:
- Map pack / local pack
- People Also Ask (PAA)
- Featured snippets
- Video carousels
- Knowledge panels
- Image packs

#### Backlink Profile
- Referring domains count (Semrush if available)
- Notable high-authority links
- Link building patterns (directories, guest posts, local citations)

### Step 5: Gap Analysis

Identify:
1. **Keyword gaps** — Keywords competitors rank for that the client doesn't
2. **Content gaps** — Topics competitors cover that the client hasn't addressed
3. **Template gaps** — Page elements competitors use that the client is missing
4. **SERP feature gaps** — Features competitors capture that the client doesn't
5. **Link gaps** — Sources linking to competitors but not the client

### Step 6: Save Output

Save to: `projects/<client>/seo/keyword-research/YYYY-MM-DD-competitor-analysis.md`

### Step 7: Update State

Append to `.state/chino-state.json` runs array.

---

## Output Template

```markdown
# Competitor Analysis — [Client Name] — [YYYY-MM-DD]

> Generated by /chino:competitor | Domain: [domain] | Industry: [industry]

## Competitor Overview

| # | Competitor | Domain | Est. Traffic | Ranking Keywords | Domain Authority |
|---|-----------|--------|-------------|-----------------|-----------------|
| 1 | [Name] | [domain] | [X/mo] | [X] | [X] |
| 2 | [Name] | [domain] | [X/mo] | [X] | [X] |
| 3 | [Name] | [domain] | [X/mo] | [X] | [X] |

## Detailed Competitor Profiles

### Competitor 1: [Name] ([domain])

**Strengths:**
- [What they do well]

**Weaknesses:**
- [Where they fall short]

**Content Strategy:**
- Blog frequency: [X posts/month]
- Top topics: [list]
- Content types: [guides, case studies, FAQs, etc.]

**Site Architecture:**
- Navigation: [description]
- URL structure: [flat/nested]
- Click depth: [X clicks to key pages]

**Template Elements:**
| Element | Present |
|---------|---------|
| Author bylines | Yes/No |
| References/citations | Yes/No |
| FAQ sections | Yes/No |
| Schema markup | Yes/No |
| Customer reviews | Yes/No |
| Video content | Yes/No |
| Interactive tools | Yes/No |

**Top Ranking Keywords:**
| Keyword | Position | Page |
|---------|----------|------|
| ... | ... | ... |

### Competitor 2: [Name]

[Same structure]

### Competitor 3: [Name]

[Same structure]

## Gap Analysis

### Keyword Gaps

Keywords competitors rank for that [client] doesn't:

| Keyword | Competitor | Their Position | Est. Volume | Opportunity |
|---------|-----------|---------------|-------------|-------------|
| ... | ... | ... | ... | [High/Medium/Low] |

### Content Gaps

Topics competitors cover that [client] hasn't addressed:

| Topic | Competitors Covering | Content Type Needed | Priority |
|-------|---------------------|-------------------|----------|
| ... | ... | ... | ... |

### Template Gaps

Page elements competitors use that [client] is missing:

| Element | Competitors Using | Impact | Effort |
|---------|------------------|--------|--------|
| ... | [list] | [High/Med/Low] | [High/Med/Low] |

### SERP Feature Opportunities

| Feature | Target Keywords | Competitor Holding | Strategy |
|---------|----------------|-------------------|----------|
| Map Pack | [keywords] | [competitor] | Optimize GBP |
| PAA | [keywords] | [competitor] | Add FAQ content |
| Featured Snippet | [keywords] | [competitor] | Structure content for snippets |

### Link Gaps

Sources linking to competitors but not [client]:

| Source | Links To | Type | Opportunity |
|--------|---------|------|-------------|
| [domain] | [competitor] | Directory | Submit listing |
| [domain] | [competitor] | Guest post | Pitch article |

## Competitive Advantages

Areas where [client] can win:

1. [Advantage 1 — e.g., local presence, unique service, niche expertise]
2. [Advantage 2]
3. [Advantage 3]

## Recommendations

### Quick Wins (This Month)
1. [Specific action to close a gap]
2. [Specific action]

### Medium Term (Next Quarter)
1. [Content strategy adjustment]
2. [Template improvements]

### Long Term (6+ Months)
1. [Link building campaign]
2. [Authority building]

---

*Generated by /chino:competitor on [date].*
*Feed gaps into /chino:keyword-research and /chino:content-plan for action planning.*
```

---

## Graceful Degradation

| Source | If Unavailable | Impact |
|--------|---------------|--------|
| GSC | Use web search to identify competitors | Reduced — no query overlap data |
| Semrush | Use web search + WebFetch only | Significant — no traffic/authority estimates |
| WebSearch | Skill cannot run | Fatal — need web access to find competitors |
| WebFetch | Skip template analysis | Reduced — can't check competitor page elements |

---

## Related Skills

- `/chino:keyword-research` — Uses competitor gaps as keyword input
- `/chino:content-plan` — Incorporates competitor content gaps
- `/chino:on-page` — Applies competitor template insights to page optimization
