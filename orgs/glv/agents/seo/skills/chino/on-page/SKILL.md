---
name: chino:on-page
description: Group A-E per-page optimization — analyses a specific URL across all five optimization groups (centerpiece, secondary, supporting, hidden markup, structural signals) and provides specific fix recommendations. Trigger with /chino:on-page <client> <url>.
---

# /chino:on-page — Group A-E Page Optimization

> Analyses a specific page across the 5 optimization groups from Episode 6 + Ben Pelta's structural signals. Scores each group, checks internal linking, identifies SERP feature opportunities, and provides specific fix recommendations.

## Trigger

- `/chino:on-page <client> <url>`
- "Optimize page <url> for <client>"
- "On-page analysis for <url>"

## Autonomy

**Assignment:** `agent-autonomous` — read-only analysis + recommendations.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| `client` | Yes | Command parameter — resolved via alias map |
| `url` | Yes | The specific page URL to analyse (full URL or path) |

---

## Process

### Step 1: Resolve Client Config

1. Resolve client alias
2. Read `projects/<client>/CONTEXT.md` → extract `seo:` block
3. If `url` is a path (e.g., `/services`), prepend `https://<domain>`

### Step 2: Load Knowledge Base

Read `.claude/skills/chino/references/6-level-framework.md` — focus on Level 6:
- Group A (Centerpiece): Title tags, H1, URLs, opening paragraphs
- Group B: H2s, anchor text
- Group C: Alt text on images, bold/italic keyword variations
- Group D: Hidden markup — schema, semantic HTML

### Research Integration (Optional)

Before starting, check if `projects/<client>/research/` exists:

1. If `avatars/` folder exists → read `test-group-panel.md` and `avatars/*.md`. Assess whether the page speaks to the right avatar and whether the language matches customer voice from the avatar profiles.
2. If `pillar-f-supplier-manufacturer.md` exists → read it. Check if co-op brand assets are being leveraged on product pages and if manufacturer guidelines are followed.
3. If `pillar-b-direct-competitors.md` exists → read it. Compare this page's optimization against competitor equivalent pages identified in research.
4. If `synthesis-opportunities-and-threats.md` exists → read it for strategic context.

Use research insights to enrich output. Cite specific findings when they inform recommendations. If research files don't exist, proceed normally — all core functionality works without research.

### Step 3: Fetch Page Content

Use WebFetch to analyse the page:

```
WebFetch: <full_url>
Prompt: "Analyse this page comprehensively. Extract:
1. Page title tag (exact text)
2. Meta description (exact text)
3. H1 tag(s) (exact text, note if multiple)
4. H2 tags (list all)
5. H3 tags (list all)
6. URL structure
7. Opening paragraph (first 200 words)
8. Internal links (list URLs and anchor text)
9. External links (list URLs and anchor text)
10. Images (count, and list alt text for each)
11. Bold/italic text (list any emphasized keywords)
12. Schema markup (types and content)
13. Canonical URL
14. Meta robots
15. Open Graph tags
16. Word count estimate
17. Any structured data (tables, lists, FAQ markup)"
```

### Step 4: Pull GSC Data for This Page

```
mcp__google-search-console__enhanced_search_analytics
siteUrl: <gsc_property>
startDate: 90 days ago
endDate: today
dimensions: query
pageFilter: <full_url>
filterOperator: equals
rowLimit: 100
```

This shows which queries this page ranks for and their positions.

### Step 5: Assess Each Group

#### Group A — Centerpiece (Primary Keyword Focus)

| Element | Check | Score |
|---------|-------|-------|
| Title tag | Contains primary keyword? Near the start? Under 60 chars? | pass/partial/fail |
| H1 | Contains primary keyword? Only one H1? Matches page intent? | pass/partial/fail |
| URL slug | Contains primary keyword? Short and clean? No unnecessary parameters? | pass/partial/fail |
| Opening paragraph | Primary keyword in first 100 words? Natural inclusion? | pass/partial/fail |
| Meta description | Contains primary keyword? Compelling? Under 160 chars? | pass/partial/fail |

#### Group B — Secondary Elements

| Element | Check | Score |
|---------|-------|-------|
| H2 headings | Contain secondary/related keywords? Logical structure? | pass/partial/fail |
| Internal link anchor text | Descriptive anchors? Keyword-relevant? Not generic ("click here")? | pass/partial/fail |

#### Group C — Supporting Elements

| Element | Check | Score |
|---------|-------|-------|
| Image alt text | All images have alt text? Keyword variations included? | pass/partial/fail |
| Bold/italic emphasis | Key terms emphasized? Natural usage? | pass/partial/fail |

#### Group D — Hidden Markup

| Element | Check | Score |
|---------|-------|-------|
| Schema markup | Present? Correct type for page? (LocalBusiness, FAQ, Product, etc.) | pass/partial/fail |
| Semantic HTML | Proper heading hierarchy? Article/main/section tags? | pass/partial/fail |
| Open Graph tags | Present and correct? Image specified? | pass/partial/fail |
| Canonical URL | Present and correct? Points to this page? | pass/partial/fail |

#### Group E — Structural Signals (Page-Level Architecture)

These are NOT content optimizations — they're architectural signals that tell Google about page priority and business identity.

**E1: Navigation Order Audit**

Check the site's main navigation and flag issues:

- **Local businesses:** About Us / Our Story MUST be first nav item (before products/services)
  - Why: "dealer" and "business" keywords map to About Us, not homepage
  - Google reads nav order as priority declaration
- **Product businesses:** Category structure must be logical
  - Category → Subcategory → Product (e.g., Boats → Yamaha → Yamaha 550)
  - If selling multiple product lines: use "Products" as unclickable parent dropdown
- **Seasonal businesses:** Consider "Browse by Season" nav section
  - Tag-based pages (summer, winter, spring, fall) for seasonal product grouping
  - These won't rank for big keywords but add relevance signals
- **Flag:** Any nav item that links externally (sends Google's crawler away)
- **Flag:** Any nav with more than 7 top-level items (cognitive overload)

**E2: Above-the-Fold Analysis**

The first scroll of every page gets highest priority from Google.

Check for:
- [ ] Hero section has text content (not just an image/banner)
- [ ] H1 is visible above the fold
- [ ] Primary CTA is above the fold
- [ ] No excessive whitespace or padding eating fold space
- [ ] Font sizes are appropriate:
  - Body: 14.5-15px minimum (not smaller, not excessively large)
  - H1: proportional but not so large it wastes fold space
  - Reduce if current font size pushes key content below fold
- [ ] Product/service cards visible above fold where applicable
- [ ] No auto-playing video that pushes content down

Score each page:
- 🟢 Strong: Text + CTA + products visible in first scroll
- 🟡 Okay: Text visible but CTA or key content below fold
- 🔴 Weak: Just a hero image/banner with no meaningful content

**E3: Entity Reinforcement**

Check that each page reinforces the business entity:

- [ ] Business name appears naturally in page content (2-3 times)
- [ ] Location mentioned naturally (city name, neighbourhood, landmark)
- [ ] Phone number in footer AND on contact-relevant pages
- [ ] Schema markup (LocalBusiness) present on key pages
- [ ] "About Us" link accessible from every page
- [ ] Real team photos (not stock) on About/Team pages

**E4: Internal Link Health**

- [ ] No page links to itself
- [ ] No reciprocal links between same two pages (A→B and B→A)
  - Exception: button links (not text links) can loop back — Google treats buttons as optional
- [ ] Orphan pages check (pages with no internal links pointing to them)
- [ ] Key pages (About, Services, Contact) linked from multiple locations

### Step 6: Internal Linking Audit

Check the page's internal linking context:
- **Inbound links:** What pages on the site link TO this page? (Use GSC page data or site crawl)
- **Outbound links:** What does this page link to? Are they relevant?
- **Anchor text:** What anchor text is used for links to this page?
- **Orphan check:** Is this page accessible from navigation or only through direct links?

### Step 7: SERP Feature Opportunity

Based on the page's target queries, identify which SERP features could be captured:
- **Featured snippet** — Is the content structured for position 0? (lists, tables, definitions)
- **People Also Ask** — Could FAQ content target PAA questions?
- **Map pack** — Is this a local service page that could appear in local results?
- **Video carousel** — Could a video be added to capture video SERP space?
- **Image pack** — Are images optimized for image search?

### Step 8: Save Output

Save to: `projects/<client>/seo/on-page/YYYY-MM-DD-<page-slug>-on-page.md`

(Generate page-slug from the URL path, e.g., `/services/bookkeeping` → `services-bookkeeping`)

---

## Output Template

```markdown
# On-Page Optimization — [Client Name] — [Page URL] — [YYYY-MM-DD]

> Generated by /chino:on-page | Analysing: [full URL]

## Page Overview

| Item | Value |
|------|-------|
| URL | [full URL] |
| Title | [current title tag] |
| H1 | [current H1] |
| Word Count | [estimate] |
| Primary Keyword | [identified from GSC data] |
| Current Position | [for primary keyword] |
| Clicks (90d) | [from GSC] |
| Impressions (90d) | [from GSC] |

## Ranking Keywords

| Query | Clicks | Impressions | CTR | Position |
|-------|--------|-------------|-----|----------|
| ... | ... | ... | ... | ... |

## Group A: Centerpiece — [pass/partial/fail]

| Element | Current | Issue | Recommendation |
|---------|---------|-------|---------------|
| Title tag | "[current]" | [issue or "Good"] | [specific fix] |
| H1 | "[current]" | [issue or "Good"] | [specific fix] |
| URL | [current path] | [issue or "Good"] | [specific fix] |
| Opening paragraph | [summary] | [issue or "Good"] | [specific fix] |
| Meta description | "[current]" | [issue or "Good"] | [specific fix] |

## Group B: Secondary — [pass/partial/fail]

| Element | Current | Issue | Recommendation |
|---------|---------|-------|---------------|
| H2 headings | [list] | [issues] | [specific fixes] |
| Internal link anchors | [summary] | [issues] | [specific fixes] |

## Group C: Supporting — [pass/partial/fail]

| Element | Current | Issue | Recommendation |
|---------|---------|-------|---------------|
| Image alt text | [X of Y images have alt] | [issues] | [specific fixes] |
| Bold/italic emphasis | [summary] | [issues] | [specific fixes] |

## Group D: Hidden Markup — [pass/partial/fail]

| Element | Current | Issue | Recommendation |
|---------|---------|-------|---------------|
| Schema markup | [types found] | [issues] | [specific schema to add] |
| Semantic HTML | [summary] | [issues] | [specific fixes] |
| Open Graph | [present/missing] | [issues] | [specific fixes] |
| Canonical | [URL] | [issues] | [specific fixes] |

## Group E: Structural Signals — [pass/partial/fail]

### E1: Navigation Order
| Check | Status | Issue | Recommendation |
|-------|--------|-------|---------------|
| About Us first (local) | [pass/fail/n-a] | [issue] | [fix] |
| Category hierarchy | [pass/fail/n-a] | [issue] | [fix] |
| External nav links | [pass/fail] | [issue] | [fix] |
| Top-level item count | [count] / 7 max | [issue] | [fix] |

### E2: Above-the-Fold — [🟢/🟡/🔴]
| Check | Status | Notes |
|-------|--------|-------|
| Hero has text content | [yes/no] | [details] |
| H1 above fold | [yes/no] | [details] |
| CTA above fold | [yes/no] | [details] |
| Font sizing appropriate | [yes/no] | [body: Xpx, H1: Xpx] |
| Products/services visible | [yes/no] | [details] |

### E3: Entity Reinforcement
| Signal | Present | Notes |
|--------|---------|-------|
| Business name (2-3x) | [yes/no] | [count] |
| Location mentions | [yes/no] | [details] |
| Phone in footer | [yes/no] | |
| LocalBusiness schema | [yes/no] | |
| About Us accessible | [yes/no] | |
| Real team photos | [yes/no/n-a] | |

### E4: Internal Link Health
| Check | Status | Notes |
|-------|--------|-------|
| Self-links | [none/found] | [details] |
| Reciprocal text links | [none/found] | [details] |
| Orphan page risk | [yes/no] | [details] |
| Key pages linked | [yes/no] | [details] |

## Overall Score

| Group | Score | Priority |
|-------|-------|----------|
| A — Centerpiece | [pass/partial/fail] | [fix priority] |
| B — Secondary | [pass/partial/fail] | [fix priority] |
| C — Supporting | [pass/partial/fail] | [fix priority] |
| D — Hidden Markup | [pass/partial/fail] | [fix priority] |
| E — Structural | [pass/partial/fail] | [fix priority] |

## Internal Linking

- **Inbound internal links:** [count] pages link to this page
- **Outbound internal links:** [count] links from this page
- **Anchor text quality:** [good/needs improvement]
- **Orphan risk:** [yes/no]

## SERP Feature Opportunities

| Feature | Possible | Current Status | Action |
|---------|----------|---------------|--------|
| Featured Snippet | Yes/No | Not captured / Captured | [action] |
| People Also Ask | Yes/No | Not targeted | [action] |
| Map Pack | Yes/No | [status] | [action] |
| Video Carousel | Yes/No | No video | [action] |

## Prioritized Fix List

1. **[Highest impact fix]** — [specific instruction]
2. **[Second priority]** — [specific instruction]
3. **[Third priority]** — [specific instruction]
4. [Additional fixes in order of impact]

---

*Generated by /chino:on-page on [date].*
*Implement fixes and re-run after changes to verify improvement.*
```

---

## Graceful Degradation

| Source | If Unavailable | Impact |
|--------|---------------|--------|
| WebFetch | Skill cannot run — need to read the page | Fatal |
| GSC | Skip ranking data — analyse page structure only | Moderate |
| Semrush | No impact — not primary for on-page | None |

---

## Related Skills

- `/chino:audit` — Identifies pages that need on-page optimization
- `/chino:keyword-research` — Provides target keywords for optimization
- `/chino:internal-linking` — Broader linking context for the page
- `/chino:content-plan` — Strategic context for where this page fits in the silo
