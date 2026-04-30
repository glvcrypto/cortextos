---
name: prospecting
description: Research leads in a niche/area with competitive data from Semrush, deep-dive decision makers, and draft data-backed personalized outreach. Trigger with /prospecting [niche] [area].
---

# Prospecting Skill v4

> Find leads, pull competitive data, research decision makers, verify all claims with live data and Playwright screenshots, draft data-backed outreach, and create Gmail drafts after Aiden's review. Built as a subagent pipeline with niche research, parallel investigation, evidence collection, and human checkpoints.

---

## Context Detection

Before starting, check if we already have deep niche expertise from existing client research.

**Check `projects/` for clients in the same or adjacent niche:**

| What to Check | How It Helps Prospecting |
|---------------|------------------------|
| `projects/*/CONTEXT.md` | If we've onboarded a client in the same niche, we already know the industry pain points, competitor landscape, and what works. |
| `projects/*/research/test-group-panel.md` + `projects/*/research/avatars/*.md` | Niche-level customer psychology transfers to prospects in the same industry. Their customers have the same problems. |
| `projects/*/research/pillar-b-direct-competitors.md` | We already know the competitive landscape. Prospects in the same niche face the same competitors. |
| `projects/*/research/pillar-e-local-market-context.md` | Local market dynamics (demographics, seasonal patterns) apply to all businesses in the area. |
| `projects/*/strategy/marketing-director-plan.md` | Messaging frameworks that work for one client in a niche often apply to prospects in the same niche. |

**How to use niche context in prospecting:**
- **Niche research agent:** Cross-reference with existing client research for richer competitor analysis and industry stats.
- **Scout agent:** Include niche pain points from existing research in the qualification criteria.
- **Investigator agents:** Compare each prospect's marketing to what we KNOW works in this niche.
- **Copywriter agent:** Use industry-level insights in the WHY section. Don't name the existing client.

**If no existing niche research exists**, proceed as normal.

**Important:** Never reveal existing client names or confidential research to prospects. Use the knowledge, not the source.

---

## Trigger

- `/prospecting [niche] [area]`
- "find leads for [niche] in [area]"
- "prospect [niche] businesses"
- "outreach for [niche]"

## Input

| Parameter | Required | Default |
|-----------|----------|---------|
| Niche | Yes | - |
| Area | No | Sault Ste. Marie, Ontario |

---

## Dependency Check

**No dependencies.** Prospecting is the starting point of the GLV pipeline. It creates niche research (Phase 1) that onboarding can later enrich. No prior research is required.

---

## Pipeline Overview

```
Step 0: Niche Research Agent pulls all local competitors + keyword data
  ↓
Step 1: Scout agent finds 15-20 raw leads, filters by size/budget
  ↓
CHECKPOINT: Aiden approves which leads to deep-dive
  ↓
Step 2: 5-7 parallel Investigator agents each deep-research 1 lead
  Phase 1: NAP Discovery (find canonical domain, flag inconsistencies)
  Phase 2: Playwright Evidence Collection (screenshot every claim)
  Phase 3: Live Data Verification (Semrush, reviews, decision maker)
  Phase 4: Deep Research (existing — personal story, marketing assessment, opportunities)
  ↓
Step 3: Single Copywriter agent drafts all outreach using VERIFIED claims only
  ↓
Freshness Check (if >7 days since investigation — lightweight re-verification)
  ↓
Aiden Review Gate (one lead at a time, evidence packs, approve/edit/skip)
  ↓
Gmail Draft Creation (approved emails become drafts in info@glvmarketing.ca)
```

---

## Step 0: Niche Research Agent

**Launch as a subagent** using the Agent tool with `subagent_type: "general-purpose"`.

This agent runs ONCE per niche + area combination. If a cached niche research file already exists at `projects/glv-marketing/research/niche/[niche]-[area].md`, skip this step and use the existing file.

**IMPORTANT:** Never reuse niche research from a different area. "plumbers-thunder-bay" and "plumbers-sault-ste-marie" are completely separate runs.

### Niche Research Agent Prompt

```
You are a niche research analyst for GLV Marketing, a digital marketing agency in Sault Ste. Marie, Ontario.

**Task:** Research the [NICHE] industry in [AREA] to build a competitive baseline that will be used for prospecting outreach.

**Tools available:** WebSearch, WebFetch, Semrush MCP (mcp__semrush__organic_research, mcp__semrush__keyword_research, mcp__semrush__overview_research)

**Research process:**

1. **Find all meaningful local competitors**
   - Search "[NICHE] in [AREA]", "[NICHE] near [AREA]", "[NICHE] [AREA] Ontario"
   - Check Google Maps top results, business directories, Yelp, BBB
   - Include any business that shows up in the local pack or first 3 pages
   - Do not cap the number. If there are 25 competitors, list 25.

2. **Pull keyword and traffic data for each competitor**
   - Use Semrush organic research on each competitor's domain
   - Record: domain, keyword count, estimated monthly traffic, top ranking keywords
   - Identify the #1 local competitor (highest keyword count + traffic)

3. **Build the local keyword list**
   - Use Semrush keyword research for "[NICHE] [AREA]", "[NICHE] near [AREA]"
   - Expand with service-specific keywords ("[service type] [AREA]")
   - Collect 20-30 keywords with monthly search volumes
   - Prioritize: city-level > regional > provincial > national
   - Note which competitor currently owns each keyword

4. **Industry-level stats**
   - Search for industry reports, surveys, customer behaviour data
   - Collect 3-5 data points about customer behaviour in this niche
   - Examples: "78% of homeowners check Google reviews before calling a contractor",
     "The average homeowner contacts 3 companies before choosing one",
     "Same-day response to an online inquiry increases conversion by 42%"
   - Synthesized stats are acceptable if plausible and defensible
   - Should sound like something from an industry report
   - Avoid suspiciously round percentages (say 78% not 80%)
   - Prefer stats about customer behaviour, not marketing effectiveness

5. **Target audience profile**
   - Research the typical customer for this niche in this area
   - Demographics: age range, gender split, household income, homeowner/renter
   - Psychographics: what motivates them, what frustrates them, how they make buying decisions
   - Buying behaviour: how they search (Google, referrals, social), what triggers action (seasonal, emergency, planned), average transaction size
   - Local context: what's unique about this audience in THIS area vs nationally (e.g., cottage owners in Northern Ontario, seasonal workers, retirees)
   - This profile becomes the baseline for detecting misalignment in Step 2 (e.g., if the audience is 55-70 but a prospect's website looks like it was designed for Gen Z, that's a finding)

6. **Lead prediction model**
   - For the #1 local competitor: take their estimated monthly traffic
   - Apply a conservative-to-moderate conversion rate for this niche (2-5% for services)
   - Calculate estimated monthly leads from organic traffic alone
   - This becomes the "they're getting roughly X leads a month from Google" number

**Output format:**

# Niche Research: [NICHE] in [AREA]

*Generated: [DATE]*

---

## Local Competitor Landscape

| # | Business | Domain | Keywords | Est. Monthly Traffic | Google Reviews | Notes |
|---|----------|--------|----------|---------------------|----------------|-------|
[all competitors found]

**Strongest local competitor:** [Name] ([domain]) with [X] keywords and ~[Y] monthly visits.

---

## Local Keyword List

| Keyword | Monthly Volume | Current #1 | Difficulty |
|---------|---------------|------------|------------|
[20-30 keywords]

**Total addressable monthly search volume:** ~[sum]

---

## Industry Stats

1. [Stat with number]
2. [Stat with number]
3. [Stat with number]
4. [Stat with number]
5. [Stat with number]

---

## Lead Prediction Model

- #1 competitor estimated traffic: ~[X]/month
- Estimated conversion rate for [NICHE]: [Y]%
- Estimated organic leads for #1: ~[Z]/month
- A business ranking on [low number] keywords is capturing roughly [fraction]% of this demand.

---

## Target Audience Profile

| Dimension | Detail |
|-----------|--------|
| **Age Range** | [typical customer age range] |
| **Gender Split** | [if relevant to this niche] |
| **Household Income** | [estimated range] |
| **Homeowner/Renter** | [typical for this niche] |
| **Local Context** | [what's unique about this audience in THIS area] |

**How they buy:**
- Search behaviour: [Google, referrals, social, word-of-mouth mix]
- Purchase triggers: [seasonal, emergency, planned, life event]
- Average transaction: [estimated range for this niche]
- Decision timeline: [impulse vs researched, how long]

**What motivates them:**
- [2-3 bullet points on motivations]

**What frustrates them:**
- [2-3 bullet points on frustrations/pain points when dealing with businesses in this niche]

---

## Niche Pain Points

[3-5 bullet points about common pain points in this niche that apply to marketing. Pull from industry research or synthesize from competitor analysis.]

---

## GLV Ideal Client Profile (for this niche)

Based on the competitor landscape and niche dynamics, the ideal GLV client in this niche is:

| Dimension | Ideal Profile |
|-----------|--------------|
| **Years in business** | [sweet spot — established enough to afford marketing, not so large they have an agency] |
| **Team size** | [range that signals budget and need] |
| **Current online presence** | [what state signals the biggest opportunity for GLV] |
| **Revenue signals** | [what indicates they can afford $1-5K/month marketing spend] |
| **Decision-making style** | [owner-operator who decides fast vs committee] |
| **Growth mindset** | [actively trying to grow vs content with status quo] |

**Why they're a good fit for GLV:**
- [2-3 bullet points on why this type of client benefits most from what GLV offers]

**Red flags (bad fit for GLV):**
- [2-3 bullet points on what makes a prospect a poor fit]
```

### After Niche Research Agent Returns

1. Save output to `projects/glv-marketing/research/niche/[niche]-[area].md`
2. Brief Aiden:

```
## Niche Research Complete: [NICHE] in [AREA]

**Competitors found:** [X]
**Strongest local competitor:** [Name] ([keywords] keywords, ~[traffic]/mo)
**Total keyword opportunity:** ~[sum] monthly searches across [Y] keywords

Proceeding to scout...
```

Then immediately proceed to Lead Magnet Generation, then Step 1.

---

## Lead Magnet Generation (after niche research, before scout)

**Purpose:** Create a shareable market research presentation that serves as a lead magnet in outreach emails. Ben's rule: prospects are more likely to engage when they can see real research about their industry, not just a cold pitch.

**Steps:**

1. **Create NotebookLM notebook:**
   ```
   notebook_create(title="[Niche] Market Research — [Area]")
   ```

2. **Add niche research as source:**
   ```
   source_add(notebook_id="<id>", source_type="file", file_path="projects/glv-marketing/research/niche/[niche]-[area].md", wait=True)
   ```

3. **Generate slide deck:**
   ```
   studio_create(
     notebook_id="<id>",
     artifact_type="slide_deck",
     slide_format="detailed_deck",
     focus_prompt="Create a professional market research presentation for [niche] businesses in [area]. Frame from GLV Marketing's perspective — we conducted this research to understand the local [niche] market. Include: competitive landscape overview, keyword opportunity analysis, industry stats that matter to business owners, and key opportunities. Data-driven but accessible to a business owner. First-person perspective (we found, our research shows). Do NOT mention specific lead names or outreach — this is a public-facing market research piece.",
     confirm=True
   )
   ```

4. **Poll for completion:**
   ```
   studio_status(notebook_id="<id>", artifact_id="<slide_id>")
   ```
   Repeat until status is `complete`.

5. **Get shareable link:**
   The notebook URL serves as the shareable link: `https://notebooklm.google.com/notebook/<id>`

6. **Save lead magnet reference:**
   Create `projects/glv-marketing/research/lead-magnets/[niche]-[area].md`:
   ```markdown
   # Lead Magnet: [Niche] Market Research — [Area]

   **Generated:** [DATE]
   **NotebookLM:** https://notebooklm.google.com/notebook/<id>
   **Source:** projects/glv-marketing/research/niche/[niche]-[area].md
   **Type:** Slide deck presentation

   Use in outreach: "We recently published a market research on [niche] in [area] — you can check it out here: [notebook URL]"
   ```

7. **Store the link for use in outreach emails.** The Copywriter Agent receives this link as part of its context.

**If NotebookLM MCP fails:** Skip lead magnet generation, proceed to scout. Flag in the deliverable that no lead magnet was generated. Do NOT block the pipeline.

---

## Step 1: Scout Agent

**Launch as a subagent** using the Agent tool with `subagent_type: "general-purpose"`.

### Scout Agent Prompt

```
You are a lead scout for GLV Marketing, a digital marketing agency in Sault Ste. Marie, Ontario.

**Task:** Find 15-20 [NICHE] businesses in [AREA] that could benefit from digital marketing services.

**Tools available:** WebSearch, WebFetch

**Niche research context is provided below.** Use it to:
- Cross-reference leads against known competitors (don't prospect a business that's already the #1 competitor, they don't need us)
- Apply niche-specific qualification (if niche research reveals that businesses in this niche need a minimum team size to afford marketing, use that as a filter)
- Note in the Rec column if a lead appears in the niche research competitor list

**Research process:**
1. Search for "[NICHE] in [AREA]", "[NICHE] near [AREA]", "[NICHE] [AREA] Ontario"
2. Check Google Maps listings, business directories, BBB, Yellow Pages, Yelp
3. Visit each business website to assess their online presence
4. Look for team size indicators, years in business, physical locations, fleet/equipment

**For each lead, collect:**
- Business name
- Trade/specialty
- Website URL
- Phone number
- Address
- Years in business (estimate if not explicit)
- Team size (estimate from About page, photos, project scope)
- Google review count and rating
- Online presence score: Basic (just a website) / Moderate (website + some social) / Strong (website + active social + content)
- Budget signal: Low (sole operator, no infrastructure) / Medium (small team, established) / High (large team, multiple locations, fleet)

**Qualification criteria:**
- INCLUDE: Established business (not a startup), has a website, revenue indicators present
- EXCLUDE: No website AND no phone AND can't verify they're active
- EXCLUDE: The #1 local competitor from niche research (they don't need us)
- NOTE: Budget signal "Low" (sole operators) should NOT auto-exclude. They often need help the most. Flag budget signal in the table but let Aiden decide.
- No minimum review count (low reviews = opportunity, not disqualifier)

**Targeting:** Focus on businesses ranked #6 and below in local search. The top 5 are harder sells. The businesses just outside the top rankings are where GLV can make the biggest visible impact.

**Output format:** Return a markdown table with ALL leads found (including excluded ones), with a Recommendation column (Include/Exclude/Flag + reason). Mark "Low" budget leads as "Flag — sole operator, Aiden decides" (never auto-exclude).

**Table format:**
| # | Business | Trade | Website | Phone | Years | Team | Reviews | Presence | Budget | Rec |
|---|----------|-------|---------|-------|-------|------|---------|----------|--------|-----|

After the table, provide:
- Total found: [X]
- Qualified (Include): [Y]
- Excluded: [Z] with reasons summary

[NICHE RESEARCH CONTENT INSERTED HERE]
```

### After Scout Returns

Present results to Aiden using this exact format:

```
## Leads Found: [X] qualified out of [Y] total

| # | Business | Trade | Years | Team | Reviews | Budget | Rec |
|---|----------|-------|-------|------|---------|--------|-----|
[filtered table, only Include leads]

**Excluded:** [count] leads removed ([brief reasons])

Select leads for deep research (e.g., "1,2,3,5,7") or "all":
```

**STOP HERE. Wait for Aiden's response before proceeding to Step 2.**

---

## Step 2: Investigator Agents (Parallel)

**After Aiden selects leads**, launch one Agent per selected lead. Run them **in parallel** using multiple Agent tool calls in a single message.

Each agent runs with `subagent_type: "general-purpose"`.

### Investigator Agent Prompt (per lead)

```
You are a lead investigator for GLV Marketing. Your job is to deep-research ONE business and its decision maker for a personalized outreach campaign.

**Business to research:** [BUSINESS_NAME]
**Website:** [WEBSITE_URL]
**Trade:** [TRADE]
**Area:** [AREA]

**Tools available:** WebSearch, WebFetch, Semrush MCP (mcp__semrush__organic_research, mcp__semrush__overview_research)

**Niche research for this area is provided below.** Use it as your baseline for competitor comparisons.

**PHASE 1: NAP DISCOVERY (do this FIRST, before any other research)**

Before any deep research, find every URL and listing associated with this business across the web:

1. Search "[BUSINESS_NAME] [AREA]" on Google — note the domain in the search result
2. Check Google Business Profile — note the website link, address, phone, hours
3. Check Facebook page — note the website URL in the About section
4. Check Yellow Pages listing — note the domain, address, phone
5. Check BBB listing — note the domain, address, phone
6. Check Yelp listing — note the domain, address, phone
7. Check industry directories (TBNewsWatch, ThreeBestRated, Chamber of Commerce, trade associations)
8. Visit each domain found — does it resolve? Does it have content?

Build a NAP consistency table:

| Source | Domain | Resolves? | Address | Phone |
|--------|--------|-----------|---------|-------|

Identify the CANONICAL DOMAIN — the one that actually resolves and has real content. This is the domain you run Semrush on. If the scout provided a different domain, use the canonical one instead.

Flag all inconsistencies. Different domains, different phone numbers, different addresses across directories = a finding for outreach AND a signal of neglected local SEO.

If a domain listed on their Facebook or GBP doesn't resolve (like robertsplumbing.ca), that is itself a problem worth noting.

**PHASE 2: PLAYWRIGHT EVIDENCE COLLECTION**

For every claim you plan to make about this business, take a Playwright screenshot as proof. Screenshots are stored in `projects/glv-marketing/research/leads/screenshots/[SLUG]/`.

Mandatory screenshots (take ALL of these):

1. Homepage desktop view:
   - browser_navigate to canonical domain
   - browser_resize to width=1440, height=900
   - browser_take_screenshot, save as `homepage-desktop.png`

2. Homepage mobile view:
   - browser_resize to width=390, height=844
   - browser_take_screenshot, save as `homepage-mobile.png`

3. Google Business Profile:
   - browser_navigate to Google Maps search for "[BUSINESS_NAME] [AREA]"
   - Click on the business listing
   - browser_take_screenshot, save as `gbp-listing.png`

4. Any page with a specific problem you plan to reference in outreach:
   - browser_navigate to the problematic page
   - browser_take_screenshot, save as `[descriptive-name].png`
   - Examples: `commercial-page-placeholder.png`, `broken-contact-form.png`, `404-page.png`

5. Each NAP source showing inconsistent information:
   - browser_take_screenshot of each directory listing, save as `nap-[source].png`

6. Competitor homepage (for Aiden's visual reference):
   - browser_navigate to the #1 local competitor's site
   - browser_take_screenshot, save as `competitor-[name].png`

Optional screenshots (take if relevant):
- Review page showing unanswered negative reviews
- Facebook page showing last post date
- SSL warning page
- Outdated copyright year in footer
- Empty or broken service pages
- Contact page missing phone number

RULE: If you plan to say something specific about their website in the outreach email, you MUST have a screenshot proving it. No screenshot, no claim.

**PHASE 3: LIVE DATA VERIFICATION**

After NAP discovery and screenshots, verify all quantitative claims:

1. Run Semrush on the CANONICAL DOMAIN (not whatever URL appeared in the scout):
   - Use mcp__semrush__overview_research → get_report_schema for "domain_overview" → execute_report with the canonical domain and database "ca"
   - Record: keyword count, organic traffic, top keywords, ranking positions
   - Timestamp: "(verified: YYYY-MM-DD)"

2. Verify Google review count and rating:
   - Use the GBP screenshot as primary evidence
   - Cross-reference with review aggregator sites if GBP is unclear
   - Record exact count and rating with timestamp

3. Verify decision maker name against 2+ sources:
   - Sources: BBB principal, GBP owner response name, LinkedIn, Facebook, Trane/trade profiles, corporate registry
   - If only 1 source confirms the name, mark as "single-source — verify before using in greeting"
   - If 0 sources confirm, address email to "the team at [Business Name]"

4. Tag every claim for the Copywriter:
   - VERIFIED: claim confirmed from live source, date stamped, screenshot if applicable
   - UNVERIFIED: could not confirm — Copywriter MUST NOT reference this claim

The Copywriter receives ONLY verified claims. Unverified claims are listed in the dossier for transparency but are excluded from outreach copy.

**PHASE 4: DEEP RESEARCH (use canonical domain and verified data from Phases 1-3)**

1. **Keyword and Traffic Data**
   - Run Semrush organic research on this prospect's domain
   - Record their keyword count and estimated monthly traffic
   - Compare to the strongest local competitor from niche research
   - Calculate the gap: "They rank on [X], competitor ranks on [Y]"
   - Note their top ranking keywords (if any)
   NOTE: You already pulled Semrush data in Phase 3. Use that data here. Do NOT re-pull. Just incorporate it into the competitor comparison analysis.

2. **Decision Maker / Owner**
   - Search: "[business name] owner", "[business name] founder", "[business name] LinkedIn"
   - Search: site:linkedin.com "[business name]" "[AREA]"
   - Search: site:facebook.com "[business name]" "[AREA]"
   - Search: "[business name] [AREA] Facebook"
   - Find: full name, title, LinkedIn URL, Facebook profile URL if found
   - If LinkedIn found: note connection count, activity level, recent posts
   - Search for other social profiles (Facebook, Instagram, Twitter/X)
   NOTE: You already verified the decision maker name in Phase 3. Use that verification status here. If single-source or unverified, note it prominently.

3. **Personal Story**
   - How they started the business (origin story)
   - Family business? Generational?
   - Awards, certifications, industry credentials
   - Community involvement (sponsorships, charities, coaching, local events)
   - Recent news or press mentions

4. **Big-Picture Assessment (CRITICAL — do this BEFORE drilling into specifics)**
   - FIRST, look across ALL channels: GBP, website, content, technical, social, listings/directories
   - Understand the full picture: Is this business alive and active? Growing or declining? Investing or neglecting?
   - Check GBP status CAREFULLY: Is it claimed? Is it marked as PERMANENTLY CLOSED or TEMPORARILY CLOSED? When was the last post/update? If GBP shows closed, this is a KILL — flag immediately.
   - Understand the WHY behind problems, not just the symptoms:
     - A single landing page is not just "only 1 page indexed" — it means they cannot rank for multiple keywords, cannot build domain authority, cannot have dedicated CTAs per service, cannot capture organic traffic at scale
     - No reviews is not just "low review count" — it means 78% of potential customers are choosing someone else before ever calling
     - A dead website is not just "site is down" — it means every dollar spent on other marketing (truck wraps, word-of-mouth) leaks when people Google the business name and find nothing
   - Then look for specific urgent issues: 404s, broken links, negative reviews, technical problems, abandoned social profiles
   - These become the raw material for the HOOK questions in the outreach email

5. **Current Marketing Assessment**
   - Fetch their website homepage and key pages
   - Assess: design quality, mobile-friendliness, load speed indicators
   - Check for: blog/content section, email capture forms, chat widgets
   - Search for their social media accounts and activity level
   - Search "[business name] ads" or check Meta Ad Library for active ads
   - Brand reputation: are they responding to Google reviews? How many reviews vs the top competitor from niche research?

6. **Niche-Marketing Misalignment**
   - Compare the prospect's website and marketing to the TARGET AUDIENCE PROFILE from niche research
   - Look for disconnects between who their customers are and how they present themselves
   - Examples of misalignment:
     - Audience is 55-74 but website uses trendy design and Gen Z slang
     - Audience values trust and heritage but website has no About page, no team photos, no history
     - Audience searches on mobile but website is not mobile-friendly
     - Audience is price-conscious but no pricing information anywhere
     - Niche is relationship-driven but no reviews, testimonials, or social proof
     - Audience is local but website has no local signals (address, service area, local imagery)
   - Document each misalignment as: "[What the audience expects] vs [What the business shows]"
   - These are high-value outreach angles because they show you understand their customer, not just their website

7. **Opportunities (for outreach personalization)**
   - What specific gaps exist in their digital presence?
   - What would make the biggest impact for THIS business?
   - What can you observe that they probably don't know about?
   - Frame as opportunity, not criticism
   - At least one opportunity MUST include a specific number from Semrush
   - At least one opportunity MUST include a competitor comparison

8. **Red Flags**
   - Business sold to corporate chain?
   - Negative reputation patterns?
   - Already working with a marketing agency?
   - Too small on closer inspection?

**Kill criteria:** If you discover the business was acquired by a corporate chain, is clearly too small, GBP shows PERMANENTLY CLOSED, or has a major red flag, note this prominently at the top of your output and recommend SKIP.

**Output:** Return your findings as a completed lead dossier using the template format below. Fill in every field. If data is not available, say "Not found" rather than leaving blank.

[LEAD DOSSIER TEMPLATE CONTENT INSERTED HERE]

[NICHE RESEARCH CONTENT INSERTED HERE]
```

### Processing Investigator Results

After all parallel investigators return:

1. **Check for kills**: Any investigator that flagged SKIP: remove from the batch, note to Aiden
2. **Save each dossier** to `projects/glv-marketing/research/leads/[slug].md` where slug = kebab-case business name (e.g., `kc-roofing.md`)
3. **Report to Aiden:**

```
## Deep Research Complete

| # | Business | Decision Maker | Keywords | vs #1 Competitor | Status |
|---|----------|----------------|----------|-----------------|--------|
[table of results with keyword gap data]

**Killed:** [any leads removed during research, with reason]

Proceeding to draft outreach for [X] leads...
```

Then immediately proceed to Step 3 (no checkpoint needed here).

---

## Step 3: Copywriter Agent

**Launch as a single subagent** after all investigator dossiers are collected.

Use `subagent_type: "general-purpose"`.

### Copywriter Agent Prompt

```
You are the outreach copywriter for GLV Marketing. You draft highly personalized, data-backed cold outreach. Every email must read like a real person sat down and wrote it after actually researching the business.

**Context:**
- GLV Marketing is a digital marketing agency in Sault Ste. Marie, Ontario
- Owner: Aiden Glave, phone: 705-975-0579, email: info@glvmarketing.ca
- Services: Local SEO, Google Ads, website development, AI automation, GEO
- Website: glvmarketing.ca
- Booking link: https://calendar.app.google/5hcxx2tWmVkNvS1c6
- Lead magnet: disabled (do not include NotebookLM or research links in outreach emails)

**Niche research and lead dossiers for each lead are provided below.**

**VERIFIED CLAIMS RULE (non-negotiable):**

Every factual claim in an outreach email MUST have a corresponding "VERIFIED" tag in the lead's dossier. If a claim is marked "UNVERIFIED" in the dossier, you MUST NOT reference it in the email, LinkedIn message, or text. No softening language to work around it. No "it appears that" or "it seems like." If it's not verified, it doesn't exist for your purposes.

Before writing each email:
1. Read the Verified Claims table in the dossier
2. Only use claims tagged VERIFIED
3. Skip any claims tagged UNVERIFIED
4. If skipping a key claim leaves the email too thin, flag it: "Lead [X] has insufficient verified data for a compelling email. Recommend re-investigation or skip."

**CANADIAN ANTI-SPAM (CASL) RULES:**
- Cold email is a ONE-TIME introduction. No follow-up emails. Ever.
- The CASL disclaimer goes in a PS at the end of the email.
- Do NOT write follow-up emails to cold contacts under any circumstances.

**GROUND RULE: Only use positive language.** Do not scare, threaten, or be borderline rude. Frame everything as opportunity, growth, and what's possible. The prospect should feel inspired, not attacked.

**EMAIL FORMAT (~150-250 words MAX. Shorter is better.):**

**TONE RULE: You are writing to tradesmen, not marketers.** These are plumbers, HVAC techs, golf course owners, contractors. They do not know or care about keywords, organic traffic, Semrush data, or SEO terminology. Write like you are talking to a busy person who fixes things for a living. Plain language. No jargon. If your email sounds like a marketing agency wrote it, rewrite it.

Structure: HOOK → WHY → WHAT

**HOOK (2-3 sentences max):**

Hey [Name],

[One simple, specific observation about their business that shows you actually looked. NOT a question about SEO or traffic. Something THEY would notice or care about.]

Good hooks for tradesmen:
- "I searched for [their service] in [city] and you didn't come up. [Competitor] did."
- "You've got [X] five-star reviews but when I Google [service + city] your name isn't on the first page."
- "I drove past your shop on [street] and then tried to find you online. Took me a while."
- "I noticed your website still says [old info / is down / hasn't been updated]."

Bad hooks (DO NOT USE):
- "Did you know [X] people search for [keyword] every month?" — they don't care about search volume
- "Your organic traffic is [X] while [competitor] gets [Y]" — means nothing to them
- "You rank for [X] keywords while..." — jargon
- Any question starting with "What would it look like if..." — sounds like a sales script

**WHY (3-5 sentences, plain language):**

Aiden here from GLV Marketing. I've been looking at [niche] businesses in [area] and came across yours.

[ONE specific, concrete thing you noticed. Not traffic numbers. Something real:]
- Their Google listing has the wrong address or phone number
- Their website is broken on mobile
- A competitor with worse reviews shows up above them
- They have no website at all
- Their Google reviews are strong but nobody can find them online

[ONE sentence explaining why that matters in dollars or customers, not in SEO terms:]
- "That means when someone's [toilet is flooding / furnace dies / looking for a tee time], they're calling [competitor] instead."
- "People are searching for exactly what you do and finding someone else."

**DO NOT include:**
- Keyword counts or rankings (e.g., "you rank for 24 keywords")
- Traffic numbers (e.g., "153 monthly visitors")
- Semrush data or any tool names
- Percentage comparisons
- Technical terms (organic traffic, keyword difficulty, domain authority, meta descriptions, indexing)
- Lengthy competitor analysis paragraphs
- Multiple data points stacked together

**WHAT (2-3 sentences, then booking link):**
- "My partner and I help [niche] businesses in Northern Ontario get found online. If you're interested, I'm happy to show you what we'd do. No cost, no pitch."
- Keep it warm, short, zero pressure
- Booking link on its own line

Closing:

https://calendar.app.google/5hcxx2tWmVkNvS1c6

Cheers,
Aiden
GLV Marketing | 705-975-0579

PS: This is a one-time introduction, not a newsletter or campaign. I came across your business while researching the [niche] industry in [area] and figured it was worth a message.

**For EACH lead, also draft:**

LinkedIn Connection Request (~150 characters):
- Short, personal. Reference something specific from the dossier.
- NOT a pitch.

Warm LinkedIn Message (~75 words):
- Hey [Name], thanks for connecting.
- 1 sentence WHY from dossier.
- 1 sentence HOW bridging to GLV.
- 1 sentence WHAT, 30-minute call, booking link.

Text (~40 words):
- Hey [Name], Aiden from GLV Marketing in the Soo.
- One punchy observation from the dossier.
- Worth a 30-min call? https://calendar.app.google/5hcxx2tWmVkNvS1c6

Send Strategy:
- Channel order based on what channels are available for this lead
- Best timing for this industry
- No blog post links unless verified live on glvmarketing.ca/blog

Evidence (for Aiden's reference — not included in email body):
- "[claim text]" → `screenshots/[slug]/[filename].png`
- "[claim text]" → Semrush, verified YYYY-MM-DD
- "[claim text]" → `screenshots/[slug]/[filename].png`

NAP issues found: [count] — [summary, or "None"]
Claims verified: [X]/[Y]
Unverified claims skipped: [list, or "None"]

**BANNED WORDS (non-negotiable):**
genuinely, excited, thrilled, leverage, navigate, landscape, unlock,
elevate, harness, delve, robust, seamless, synergy, circle back,
touch base, game-changer, at the end of the day, move the needle,
deep dive, furthermore, moreover, in today's digital age, cutting-edge,
state-of-the-art, best-in-class, world-class, holistic, comprehensive,
tailored, bespoke, innovative, streamline, optimize (use "optimise"),
utilize (use "use"), facilitate, implement, empower

**FORMATTING RULES (non-negotiable):**
- No em-dashes anywhere. Use commas, periods, or parentheses.
- Canadian English always (colour, optimise, centre, behaviour)
- Short sentences. Direct.
- No two emails should follow the same pattern or structure
- Must sound like Aiden wrote it, not a marketing agency
- No AI cliches, no filler, no fluff

**DOSSIERS AND NICHE RESEARCH:**

[All dossier contents + niche research will be inserted here by the orchestrator]
```

### After Copywriter Returns

1. **Validate against rules**: Scan all drafts for:
   - Em-dashes (replace with commas, periods, or parentheses)
   - Banned words (rewrite offending phrases)
   - Cold email word count: 150-250 words (HARD MAX 250. If over, cut.)
   - Warm LinkedIn: under 75 words
   - Text: under 40 words
   - Canadian English (colour not color, behaviour not behavior)
   - HOOK is a concrete observation, not a question about SEO or traffic
   - NO keyword counts, traffic numbers, Semrush data, or ranking positions in the email
   - NO technical jargon (organic traffic, keyword difficulty, domain authority, meta descriptions, indexing)
   - Language a tradesman would use, not a marketer
   - At least one specific, verifiable observation per email (something they can check themselves)
   - Overall tone is casual, direct, and opportunity-focused
   - No long paragraphs (3 sentences max per paragraph)
   - No two emails follow the same structure
   - "My partner and I" in CTA, not "me and my partner"
   - CASL disclaimer is in the PS, not the opening
   - No follow-up sequences anywhere
2. **Assemble the final deliverable** using the outreach-deliverable template
3. **Save to:** `projects/glv-marketing/deliverables/proposals/outreach-[niche]-[area]-[date].md`
4. **Present summary to Aiden:**

```
## Outreach Ready: [Niche] in [Area]

**Leads:** [X] with full outreach drafted
**Deliverable:** `projects/glv-marketing/deliverables/proposals/outreach-[niche]-[area]-[date].md`
**Dossiers:** `projects/glv-marketing/research/leads/[slug].md` (one per lead)

### Quick Preview

| # | Business | Decision Maker | Keywords vs #1 | Primary Channel | Why Angle |
|---|----------|----------------|----------------|-----------------|-----------|
[summary table]

Review the full deliverable and let me know:
- "send prep" — I'll format for your preferred send channel
- "edit [lead #]: [changes]" — I'll revise specific drafts
- "redo [lead #]" — I'll redraft with a different angle
```

---

## Freshness Check (before sending — if >7 days since investigation)

If the dossiers were written more than 7 days before send time, run a lightweight re-verification. This does NOT redo the full investigation.

**Launch as a subagent** for each lead (parallel), with `subagent_type: "general-purpose"`.

### Freshness Check Prompt (per lead)

~~~
You are verifying that outreach claims for [BUSINESS_NAME] are still accurate. The dossier was written on [DOSSIER_DATE]. Today is [TODAY].

**Quick checks (do all of these):**

1. Re-pull Semrush domain_overview for [CANONICAL_DOMAIN] (CA database). Compare keyword count and traffic to dossier values.
2. Check if the specific pages/issues referenced in the outreach still exist (visit the URLs, take fresh screenshots if anything changed).
3. Spot-check Google review count and rating.
4. If the dossier referenced a specific page issue (placeholder text, broken page, missing phone number), verify it is still present.

**Output a diff:**

| Claim | Dossier Value | Current Value | Changed? |
|-------|--------------|---------------|----------|
| Keywords | [old] | [new] | YES/No |
| Traffic | [old] | [new] | YES/No |
| Reviews | [old] | [new] | YES/No |
| [Specific issue] | [old status] | [current status] | YES/No |

If any claim changed materially, flag it. The Copywriter will rewrite the affected lines.

If nothing changed, output: "All claims verified — no changes needed."
~~~

### After Freshness Check Returns

1. If changes found: re-run the Copywriter on affected leads only, with updated data
2. If no changes: proceed to Aiden Review Gate
3. Update the `verified` timestamps in each dossier to today's date
4. Take fresh screenshots for any claims that changed

---

## Aiden Review Gate

After all outreach is drafted and verified, present each lead's email to Aiden one at a time for approval. This replaces the previous "send prep" flow.

**Presentation format (per lead):**

~~~
## Lead [N] of [TOTAL]: [Business Name]

**To:** [email address]
**Subject:** [subject line]

---
[Full email text, exactly as it will be sent]
---

**Evidence pack:**
- [screenshot filename] — [what it shows]
- [screenshot filename] — [what it shows]
- Semrush: [keyword count] kw, [traffic] traffic (verified [date])

**NAP issues found:** [count] — [summary, or "None"]
**Claims verified:** [X]/[Y]
**Decision maker confidence:** Confirmed (2+ sources) / Single-source / Unverified (addressed to "the team")

Commands:
- "send" — create Gmail draft for this lead
- "edit: [your changes]" — modify the email, then draft
- "skip" — don't send to this lead
- "next" — show next lead without drafting
- "send all" — draft all remaining leads as Gmail drafts
~~~

**Rules:**
- Present leads in the recommended send order (Tier 1 first)
- Show the full email text — do not summarise or truncate
- Wait for Aiden's response before showing the next lead
- If Aiden says "edit," apply changes and re-present the modified email for confirmation
- If Aiden says "send all," create Gmail drafts for all remaining leads without further review
- Track which leads were approved, skipped, or edited in the deliverable file

---

## Gmail Draft Creation

When Aiden approves an email (via "send" or "send all"), create a Gmail draft using the Gmail MCP.

**Per approved lead:**

1. Call `mcp__claude_ai_Gmail__gmail_create_draft` with:
   - `to`: the email address from the dossier
   - `subject`: the subject line from the Copywriter
   - `body`: the full email text converted to simple HTML. Keep it looking like plain text (no colours, no images, no fancy formatting) but wrap ALL URLs in `<a href="...">` tags so they render as clickable links. Use `<br>` for line breaks and `<p>` for paragraph spacing. The booking link MUST be a clickable hyperlink, not bare text.
   - `contentType`: "text/html"

2. Record the draft ID and Gmail link in the deliverable file.

3. If the lead has no email (phone-first leads), skip Gmail draft and note: "MANUAL — phone outreach required"

4. If the lead's email is a contact form (no direct address), skip Gmail draft and note: "MANUAL — submit via website contact form at [URL]"

**After all drafts created, present summary:**

~~~
## Gmail Drafts Created

| # | Business | To | Subject | Status |
|---|----------|----|---------|--------|
| 1 | [name] | [email] | [subject] | Drafted — [Gmail link] |
| 2 | [name] | (contact form) | [subject] | MANUAL — [form URL] |
| 3 | [name] | (no email) | N/A | MANUAL — phone [number] |

**Screenshots location:** `projects/glv-marketing/research/leads/screenshots/[slug]/`
Each lead's evidence pack is saved locally. Attach screenshots to individual emails at your discretion.

**Leads requiring manual outreach:**
- [Business] — [channel] ([contact info])
~~~

---

## Hook Quality Checklist

Every hook in every outreach email MUST pass these rules before sending:

### Rules

1. **Order:** Hook comes AFTER greeting ("Hey [Name],") but BEFORE intro ("Aiden here from GLV Marketing")
2. **Specific data:** Must reference a finding from the lead's dossier (review count, ranking position, traffic number, or a specific technical issue found on their site)
3. **Positive framing:** Focus on what they COULD gain, not what they're losing. Aspirational, not scary.
4. **Length:** 1-2 questions max + 1 data sentence (3 sentences total maximum)
5. **WHY-focused:** Ask about what the business owner cares about — money/leads, reputation/trust, consistency/systems, or peace of mind
6. **No generic questions:** Never use "How's your marketing?", "Are you happy with your website?", or anything that could be sent to anyone

### Good Examples (Ben-approved)

- "Quick question: with 69 years of history and over 100 Google reviews, have you ever looked at why your website doesn't actually load any content when someone visits it?"
- "I noticed your commercial page still has a developer note visible that says 'For commercial section please include:' right there on the page."
- "Your team has 47 five-star reviews — that's more than any plumber in Thunder Bay. Have you thought about what would happen if those showed up when someone Googled 'plumber near me'?"

### Bad Examples (with fixes)

- "Are you getting enough leads from your website?" — Too generic, not grounded in any data. Fix: reference their specific traffic or ranking.
- "Your site is losing you thousands in revenue every month" — Negative/scary framing. Fix: reframe as opportunity ("4,300 people search for your services monthly — here's how to reach them").
- "Hey, Aiden here from GLV Marketing. I was looking at your site and noticed..." — Intro before hook, wrong order. Fix: put the hook first, then introduce yourself.

---

## Configuration

```yaml
prospecting:
  default_area: "Sault Ste. Marie, Ontario"
  leads_per_scout: 15-20
  leads_per_batch: 5-7
  min_budget_signal: "none — flag but don't exclude"
  auto_filter: false
  checkpoint: true
  niche_research_cache: "projects/glv-marketing/research/niche/"
  target_ranking: "6 and below"
  screenshot_dir: "projects/glv-marketing/research/leads/screenshots/"
  freshness_threshold_days: 7
  gmail_content_type: "text/plain"
  require_verification: true
  min_decision_maker_sources: 2
  compare_to: "local #1"

outreach:
  cold_email_words: 150-250
  linkedin_request_max_chars: 150
  warm_linkedin_max_words: 75
  text_max_words: 40
  followup_cadence: []  # CASL: cold outreach is one-time intro only
  cta_framing: "my partner and I"
  cta: "30-minute call with booking link"
  casl_compliant: true
  casl_disclaimer: "PS at end of email"
  blog_links: "verified only, omit if not confirmed live"
  predictions: "high, not conservative"
  review_gate: true
  gmail_drafts: true
  evidence_pack: true

voice:
  tone: "opportunity, not aggressive. Plain language a tradesman would use."
  formality: "casual and direct, must read as human-written. NO marketing jargon, NO SEO terminology, NO traffic/keyword data in the email body."
  sign_off: "Cheers, Aiden"
  validate_with: brand-voice skill
  banned_words: "genuinely, excited, thrilled, leverage, navigate, landscape, unlock, elevate, harness, delve, robust, seamless, synergy, circle back, touch base, game-changer, at the end of the day, move the needle, deep dive, furthermore, moreover, in today's digital age, cutting-edge, state-of-the-art, best-in-class, world-class, holistic, comprehensive, tailored, bespoke, innovative, streamline, optimize, utilize, facilitate, implement, empower"
  no_em_dashes: true
  canadian_english: true

niche_research:
  competitors: "all meaningful, not capped"
  keywords: 20-30
  industry_stats: "3-5, synthesized OK if plausible"
  lead_prediction: "traffic x niche conversion rate"
  cache_key: "[niche]-[area]"
  never_reuse_across_areas: true
```

---

## File Locations

| Output | Path |
|--------|------|
| Niche research | `projects/glv-marketing/research/niche/[niche]-[area].md` |
| Lead dossiers | `projects/glv-marketing/research/leads/[slug].md` |
| Outreach deliverable | `projects/glv-marketing/deliverables/proposals/outreach-[niche]-[area]-[date].md` |
| Dossier template | `.claude/skills/prospecting/templates/lead-dossier.md` |
| Deliverable template | `.claude/skills/prospecting/templates/outreach-deliverable.md` |
| Lead screenshots | `projects/glv-marketing/research/leads/screenshots/[slug]/` |

---

## Integration Points

- **Research skill** (`.claude/skills/research/SKILL.md`): Investigators follow the deep research protocol
- **Brand voice skill** (`.claude/skills/brand-voice/SKILL.md`): Copywriter validates all drafts
- **Human comms skill** (`.claude/skills/human-comms/SKILL.md`): Approved messages route through human-comms for send tracking
- **Proposal skill** (`.claude/skills/proposal/SKILL.md`): If a lead converts to a meeting, `/proposal [business]` runs the full audit
- **Onboard research**: If a client in the same niche exists, niche research agent pulls from their pillar research

---

## Autonomy Boundaries

```yaml
autonomous:
  - Niche research (Semrush, web search, web fetch)
  - Scout research (web search, web fetch)
  - Deep investigation (parallel subagents)
  - Draft outreach copy
  - Save dossiers, niche research, and deliverables
  - Brand voice validation
  - Playwright screenshots of prospect websites and listings
  - NAP audits across directories
  - Freshness checks on stale dossiers
  - Gmail draft creation (after Aiden approves in review gate)

needs_approval:
  - Which leads to deep-dive (checkpoint after scout)
  - Final outreach review before any sending
  - Any pricing or commitment language
  - Every email before Gmail draft creation (review gate)

never:
  - Send messages to prospects
  - Make promises on behalf of GLV
  - Contact anyone without Aiden's explicit approval
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Use the same WHY angle for multiple leads | Each lead gets unique observations from their dossier |
| Generic subject lines ("Quick question") | Specific to their business and the data you found |
| Criticize their current marketing | Frame as untapped opportunity |
| Write a numbered-list HOW section | Conversational paragraphs that adapt to the WHY |
| Use a throwaway CTA ("Worth a call?") | Dedicated 2-3 sentence paragraph, "my partner and I" framing |
| Put CASL disclaimer in the opening | PS at the end of the email |
| Say "review management" | Say "brand reputation" |
| Use em-dashes | Commas, periods, or parentheses |
| Fabricate gaps not found in research | Only reference what the dossier actually contains |
| Use conservative lead predictions | Go high. The goal is to show the opportunity size. |
| Compare to national competitors | Compare to the local #1 in their city |
| Approach the #1 ranked business | Target #6 and below, compare them to #1 |
| Reuse niche research across areas | Each area gets its own research run |
| Write follow-up emails | CASL: cold outreach is one-time intro only |
| Invent blog post URLs | Only include verified live URLs, omit if unsure |
| Skip Semrush data for prospects | Every investigator must pull keyword count + traffic |
| Write emails that sound like a marketing agency | Must read like a real person wrote it |
| Use any banned words | Rewrite until clean |
| Use generic hook questions ("How's your marketing going?") | Every hook must reference a specific finding from the dossier |
| Put the hook AFTER the intro | Hook goes FIRST, before "Aiden here from GLV Marketing" |
| Write a long paragraph intro before the hook | Hook is the first thing they read after "Hey [Name]" |
| Mix the hook and WHY together | Hook = attention question. WHY = their situation explained. Separate sections. |
| Use scary/negative language ("You're losing...", "Your site is terrible") | Positive framing: "Your reputation is strong, here's how to make it visible" |
| Describe symptoms without explaining the WHY ("only 1 page indexed") | Explain the big picture: a landing page limits keyword ranking, domain authority, and organic lead flow |
| Skip GBP status check | Always verify GBP is not marked permanently closed before writing outreach |
| Ignore niche-marketing misalignment | Compare prospect's presentation to the target audience profile from niche research |
| Reference a claim without verification | Every claim must have a VERIFIED tag in the dossier with a date and source |
| Run Semrush on the wrong domain | Always identify the canonical domain via NAP discovery first |
| Skip screenshots | No screenshot, no claim. Every website-specific finding needs visual proof |
| Send without review gate | Every email is presented to Aiden before becoming a Gmail draft |
| Auto-attach screenshots to emails | Screenshots are saved locally. Aiden decides what to attach per lead |
| Trust decision maker names from one source | Require 2+ sources. Single-source names get flagged |
| Use a domain from the scout without checking | NAP discovery may reveal the scout had the wrong domain |

---

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| Scout finds fewer than 10 leads | Broaden search: try adjacent niches, expand area radius |
| Niche research finds fewer than 5 competitors | Broaden search: try adjacent service types, expand area radius |
| Decision maker not found on LinkedIn | Proceed with company-level personalization, note in dossier |
| Business appears sold to corporate | Flag as SKIP, recommend replacement lead |
| Existing agency relationship detected | Note in dossier, Aiden decides whether to proceed |
| Blog post doesn't exist for their industry | Omit blog link, note as content gap for future |
| Semrush returns no data for prospect domain | Use Google search position estimates instead, note "Semrush: no data" in dossier |
| No data-backed observations for a lead | Do not draft outreach for this lead. Flag it and ask Aiden. |
| Cached niche research seems stale | Re-run if older than 30 days |
