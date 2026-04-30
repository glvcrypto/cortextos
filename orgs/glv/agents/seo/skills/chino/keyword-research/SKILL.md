---
name: chino:keyword-research
description: 5-step keyword research framework with 4-tier local priority (city→sub-region→province→national), GEO/AI search layer, and page-type hierarchy. Pulls data from GSC and Semrush. Trigger with /chino:keyword-research <client> <topic>.
---

# /chino:keyword-research — 5-Step Keyword Research

> Executes the 5-step keyword research framework from Episode 5 of the SEO training course. Expands seed keywords, classifies intent, clusters by topic, and prioritizes by business value.

## Trigger

- `/chino:keyword-research <client> <topic>`
- "Keyword research for <client> about <topic>"
- "Find keywords for <client> related to <topic>"

## Autonomy

**Assignment:** `agent-autonomous` — read-only data pulling + analysis.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| `client` | Yes | Command parameter — resolved via alias map |
| `topic` | Yes | Command parameter — the seed topic to research |

---

## Process

### Step 1: Resolve Client Config

1. Resolve client alias
2. Read `projects/<client>/CONTEXT.md` → extract `seo:` block
3. Note the domain, industry context, and location (Sault Ste. Marie / Northern Ontario)

### Step 2: Load Knowledge Base

Read `.claude/skills/chino/references/6-level-framework.md` — focus on Level 5 keyword research methodology:
- Seed keyword expansion with synonyms and colloquial names
- Modifier framework (who/what/where/how)
- Intent classification (informational, commercial, transactional, navigational)
- Silo/cluster grouping for content planning

### Research Integration (Optional)

Before starting, check if `projects/<client>/research/` exists:

1. If `avatars/` folder exists → read `test-group-panel.md` and `avatars/*.md`. Use customer language patterns and search terminology from avatar profiles to inform seed keyword generation.
2. If `pillar-b-direct-competitors.md` exists → read it. Pre-load competitor keyword gaps already identified — skip re-discovering what research already found.
3. If `pillar-e-market-sizing.md` exists → read it. Validate demand — is there enough local search volume to justify targeting?
4. If `pillar-g-community-local.md` exists → read it. Mine community group topics for long-tail keyword ideas.
5. If `synthesis-opportunities-and-threats.md` exists → read it for cross-pillar insights.

Use research insights to enrich output. Cite specific findings when they inform recommendations. If research files don't exist, proceed normally — all core functionality works without research.

### Step 3: Seed Keywords (Step 1 of 5)

Generate seed keywords from the topic:
1. Primary keyword (the topic itself)
2. Synonyms and alternate phrasing
3. Colloquial/regional terms (Canadian English, Northern Ontario context)
4. Related service/product terms from the client's business

### Step 4: Expand with Modifiers (Step 2 of 5)

Apply modifier framework to each seed keyword:
- **Who:** [audience] + keyword (e.g., "small business bookkeeping")
- **What:** keyword + [service type] (e.g., "bookkeeping services")
- **Where:** keyword + [location] (e.g., "bookkeeping sault ste marie", "bookkeeping northern ontario")
- **How:** "how to" + keyword, keyword + "tips", keyword + "guide"
- **Cost/pricing:** keyword + "cost", keyword + "pricing", "affordable" + keyword
- **Comparison:** keyword + "vs", "best" + keyword
- **Question:** "what is" + keyword, "why" + keyword, "when to" + keyword

### Step 4b: Apply 4-Tier Local Priority System

ALL keyword research MUST be organized by geographic tier. Local keywords are ALWAYS the #1 priority regardless of search volume.

**Tier 1 — Local (City):** `[keyword] + [city]`, `[keyword] + [city abbreviation]`
- Example: "boat dealer Sault Ste Marie", "boat dealer SSM", "boat dealer the Soo"
- HIGHEST priority. Even if Semrush shows 0 volume, these are Tier 1.
- Always append the local modifier that matches how locals actually search
- Use all common local name variants (SSM, Sault Ste Marie, Sault Ste. Marie, the Soo — whatever is relevant to the client's city)

**Tier 2 — Sub-Regional:** `[keyword] + [sub-region]`
- Example: "boat dealer Northern Ontario", "boat dealer Algoma District"
- Second priority. Captures regional search intent beyond the city.

**Tier 3 — Provincial:** `[keyword] + [province]`
- Example: "boat dealer Ontario"
- Third priority. Broader competition but still geographically relevant.

**Tier 4 — National:** `[keyword]` (no geographic modifier) or `[keyword] + Canada`
- Example: "boat dealer Canada", "boats for sale"
- Lowest priority for local businesses. Primarily used for informational/article content.

**Mandatory local expansion rule:** For EVERY broad keyword discovered during research, AUTOMATICALLY generate Tier 1 (local) variants. If "fishing boat for sale" appears as a keyword, then "fishing boat for sale Sault Ste Marie", "fishing boat for sale SSM", etc. MUST be added to Tier 1 — whether or not Semrush/GSC shows any volume for them.

**Semantic SEO logic:** If a local variant is discovered organically (e.g., "boat in SSM"), that phrasing pattern applies to ALL related keywords. Write all local variants in the same linguistic form as the discovered local keywords.

### Step 4c: Classify Keywords by Page Type Priority

Organize all keywords into three tiers by page type. This determines content creation order and strategic importance.

**Priority 1 — Money Pages (Service/Product pages):**
- Transactional intent keywords with commercial value
- "[service] + [location]" patterns (always local-first — Tier 1 geographic)
- These pages generate revenue directly — they are the top priority
- Examples: "boat dealer Sault Ste Marie", "pontoon boats for sale SSM", "marine service near me"

**Priority 2 — Category Pages:**
- Commercial investigation keywords
- "[category] + [modifier]" patterns — users comparing, evaluating
- These support money pages and capture comparison shoppers
- Examples: "best fishing boats under $30,000", "pontoon vs deck boat", "boat financing options"

**Priority 3 — Articles (Blog/Informational):**
- Informational intent keywords — educational, how-to, guide content
- "how to", "what is", "guide", "tips" patterns
- These CAN be global/national (Tier 3-4 geographic is acceptable for articles)
- Feed email content automation and social media distribution
- Examples: "how to winterize a boat", "best fishing spots in Ontario", "boat maintenance checklist"

### Step 5: Pull Data from Sources

#### GSC Data

Use GSC MCP to find what the site already ranks for related to the topic:

```
mcp__google-search-console__enhanced_search_analytics
siteUrl: <gsc_property>
startDate: 90 days ago
endDate: today
dimensions: query
queryFilter: <topic>
filterOperator: contains
rowLimit: 500
```

Also run:
```
mcp__google-search-console__detect_quick_wins
siteUrl: <gsc_property>
startDate: 90 days ago
endDate: today
positionRangeMin: 4
positionRangeMax: 20
minImpressions: 5
```

#### Semrush Data (if available)

Use Semrush MCP to get volume, difficulty, and CPC data:
1. Call `mcp__semrush__keyword_research` to discover available reports
2. Use `mcp__semrush__get_report_schema` for the relevant report
3. Execute keyword research reports for the seed keywords

### Step 5b: GEO/AI Search Keyword Layer

AI search queries are conversational and long-form — fundamentally different from traditional Google searches:

- **Traditional search:** "boat dealer SSM"
- **AI search (ChatGPT/Claude/Perplexity):** "I'm looking for a boat dealer in Sault Ste Marie that carries fishing boats under $30,000 with financing options"

**Process:**

1. For each top keyword cluster, generate 5-10 conversational AI search queries that a real person would type into ChatGPT, Perplexity, or Google AI Overviews
2. Consider the avatar profiles (Pillar A if available) — how would each avatar phrase their question conversationally?
3. These queries become content topics and FAQ entries that optimise for AI citation
4. Focus on being the definitive, locally-authoritative answer for conversational queries in this niche and location

**AI Search Query Generation Rules:**
- Use natural language, not keyword syntax
- Include location context naturally ("in Sault Ste Marie", "near me in Northern Ontario")
- Include specifics that avatars care about (price ranges, features, use cases)
- Include comparison queries ("which is better for...", "should I get X or Y")
- Include problem-solving queries ("my boat engine won't start", "how much does it cost to...")

**Output:** Add an "AI Search Queries" subsection to each keyword cluster showing:

| AI Search Query | Target Avatar | Best Content Type | Content Structure Notes |
|----------------|---------------|-------------------|------------------------|
| [Conversational query] | [Which avatar] | [FAQ / Guide / Service page] | [How to structure for AI citation — clear answers, structured data, local signals] |

**Note:** GEO (Generative Engine Optimisation) is evolving rapidly. Key principle: be the most comprehensive, locally-authoritative answer to conversational queries in this niche. Structure content with clear headings, direct answers, and rich local context to maximise AI citation likelihood.

### Step 6: Classify Intent (Step 3 of 5)

For each keyword, classify search intent:

| Intent | Signals | Example |
|--------|---------|---------|
| **Informational** | "how to", "what is", "guide", "tips" | "how to do bookkeeping" |
| **Commercial** | "best", "top", "review", "vs", "compare" | "best bookkeeping software" |
| **Transactional** | "buy", "price", "near me", "hire", "services" | "bookkeeping services sault ste marie" |
| **Navigational** | Brand names, specific company names | "fusion financial services" |

### Step 7: Cluster Keywords (Step 4 of 5)

Group keywords into topic clusters/silos:
- Each cluster = one potential hub page + supporting content pieces
- Clusters should map to the client's service areas or content pillars
- Identify the "pillar" keyword for each cluster (highest volume, most commercial intent)
- Map supporting keywords to individual content pieces

### Step 8: Prioritize (Step 5 of 5)

Score each keyword cluster using the updated weighting that prioritises local relevance:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Geographic Tier | 30% | Tier 1 Local (3), Tier 2 Regional (2), Tier 3-4 Provincial/National (1) |
| Business Relevance | 25% | Money page keyword (3), Category page keyword (2), Article keyword (1) |
| Keyword Difficulty | 20% | Easy (3), Medium (2), Hard (1) |
| Search Volume | 15% | High (3), Medium (2), Low (1) — NOTE: low-volume local keywords still score high via Geographic Tier weight |
| Current Position | 10% | Positions 4-20 (3), 21-50 (2), Not ranking (1) |

Priority score = weighted average. Rank clusters by score.

### Step 9: Save Output

Save to: `projects/<client>/seo/keyword-research/YYYY-MM-DD-<topic-slug>-keywords.md`

### Step 10: Update State

Update `.state/chino-state.json`:
- Set `lastKeywordResearch` to today's date
- Append to `runs` array

---

## Output Template

```markdown
# Keyword Research — [Client Name] — [Topic] — [YYYY-MM-DD]

> Generated by /chino:keyword-research | Domain: [domain]

## Research Summary

- **Topic:** [topic]
- **Seed keywords:** [count]
- **Expanded keywords:** [count]
- **Clusters identified:** [count]
- **Quick wins found:** [count]
- **Data sources:** [GSC, Semrush, or GSC-only]

## Existing Rankings

Keywords the site already ranks for related to "[topic]":

| Query | Clicks (90d) | Impressions | CTR | Position | Page |
|-------|-------------|-------------|-----|----------|------|
| ... | ... | ... | ... | ... | ... |

## Quick Wins (Positions 4-20)

| Query | Position | Impressions | Page | Action |
|-------|----------|-------------|------|--------|
| ... | ... | ... | ... | Optimize title/content |

## Keyword Clusters

### Cluster 1: [Pillar Topic] (Priority: X/3)

**Pillar keyword:** [keyword] | Vol: [X] | KD: [X] | Intent: [type]

| Keyword | Geo Tier | Page Type | Volume | KD | CPC | Intent | Current Pos | Content Type |
|---------|----------|-----------|--------|-----|-----|--------|------------|-------------|
| [keyword] | Tier 1 | Money | ... | ... | ... | Transactional | ... | Service page |
| [supporting kw 1] | Tier 1 | Category | ... | ... | ... | Commercial | ... | Blog post |
| [supporting kw 2] | Tier 2 | Article | ... | ... | ... | Informational | ... | FAQ section |

### Cluster 2: [Pillar Topic] (Priority: X/3)

[Same structure]

### Cluster 3: [Pillar Topic] (Priority: X/3)

[Same structure]

## Priority Ranking

| Rank | Cluster | Priority Score | Recommended Action |
|------|---------|---------------|-------------------|
| 1 | [Cluster name] | X.X/3.0 | [Create hub page + X supporting posts] |
| 2 | [Cluster name] | X.X/3.0 | [Optimize existing page + add content] |
| 3 | [Cluster name] | X.X/3.0 | [New content series] |

## Top 50 Priority Keywords

Organised by geographic tier, then by page type within each tier:

### Tier 1 — Local ([City])

| # | Keyword | Page Type | Volume | KD | Priority Score | Recommended Action |
|---|---------|-----------|--------|-----|---------------|-------------------|
| 1 | [keyword] [city] | Money | ... | ... | X.X/3.0 | [Create service page] |

### Tier 2 — Sub-Regional ([Region])

| # | Keyword | Page Type | Volume | KD | Priority Score | Recommended Action |
|---|---------|-----------|--------|-----|---------------|-------------------|
[Same structure]

### Tier 3 — Provincial

| # | Keyword | Page Type | Volume | KD | Priority Score | Recommended Action |
|---|---------|-----------|--------|-----|---------------|-------------------|
[Same structure]

### Tier 4 — National

| # | Keyword | Page Type | Volume | KD | Priority Score | Recommended Action |
|---|---------|-----------|--------|-----|---------------|-------------------|
[Same structure]

## AI Search Queries

[Per cluster: conversational query table from Step 5b]

## Content Recommendations

Based on the keyword research, here are the recommended content pieces:

| # | Content Piece | Target Keyword | Type | Priority |
|---|--------------|----------------|------|----------|
| 1 | [Title idea] | [keyword] | Hub page | High |
| 2 | [Title idea] | [keyword] | Blog post | High |
| 3 | [Title idea] | [keyword] | FAQ | Medium |

## Cannibalization Check

[Check if any recommended keywords would compete with existing content. Flag potential conflicts.]

---

*Generated by /chino:keyword-research on [date].*
*Feed these results into /chino:content-plan to build a full content calendar.*
```

---

## Graceful Degradation

| Source | If Unavailable | Impact |
|--------|---------------|--------|
| GSC | Use Semrush only + manual seed expansion | Reduced — no current ranking data |
| Semrush | Use GSC only + manual estimation | Reduced — no volume/KD data |
| Both fail | Manual keyword expansion with web research | Significant — no data-backed prioritization |

---

## Related Skills

- `/chino:content-plan` — Takes keyword research output and builds content calendar
- `/chino:competitor` — Identifies keyword gaps vs competitors
- `/chino:on-page` — Optimizes pages for target keywords
