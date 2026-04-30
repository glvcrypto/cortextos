---
name: campaign-workflow
description: Full 4-stage campaign pipeline — research, planning, creative generation, and implementation. Orchestrates GSC, Semrush, GA4, fal.ai, and Remotion into one workflow with approval gates. Trigger on "campaign for [client]", "run campaign workflow", or "full campaign".
---

# Campaign Workflow

> A 4-stage campaign pipeline that orchestrates research, planning, creative generation, and implementation into a single end-to-end workflow with parallel subagents and approval gates.

## Trigger

- "Campaign for [client]"
- "Run campaign workflow"
- "Full campaign for [client]"
- "Run campaign pipeline"
- Any request to build a complete ad campaign from research through implementation

---

## Intake — Required Inputs

Before starting, gather or confirm these inputs:

| Input | Required | Default | Example |
|-------|----------|---------|---------|
| **Client** | Yes | — | Fusion Financial, Titan Tiny Homes, Soo Sackers |
| **Objective** | Yes | Lead generation | Awareness / Consideration / Conversion / Lead generation |
| **Budget** | Yes | — | $500/month, $2000 total |
| **Platforms** | Yes | Facebook + Instagram | Facebook, Instagram, Google Ads, YouTube, TikTok |
| **Timeframe** | No | 30 days | Campaign duration |
| **Target area** | No | Sault Ste. Marie & Northern Ontario | Geo-targeting |
| **Key offer** | No | — | "Free consultation", "20% off", etc. |

If any required input is missing, ask Aiden before proceeding.

---

## Dependency Check

Before running, verify required research exists:

| Required | Path | If Missing |
|----------|------|------------|
| Niche research | `projects/glv-marketing/research/niche/[niche]-[area].md` | "No niche research found. Run `/prospecting [niche] [area]` or `/onboard [client]` first." |
| Client research | `projects/[client]/research/` | "No client research found. Run `/onboard [client]` first." |
| Avatar panel | `projects/[client]/research/test-group-panel.md` | "No avatars found. Run `/onboard [client]` first." |

**STOP if any required dependency is missing.** Tell the user exactly what to run first. Do not proceed with partial or missing data.

---

## GA4 Property Map

Each client maps to a specific GA4 MCP server:

| Client | GA4 MCP Server | Property |
|--------|---------------|----------|
| Fusion Financial | `ga4-fusion` | Fusion Financial website |
| GLV Marketing | `ga4-glv` | GLV Marketing website |
| Titan Tiny Homes | `ga4-titan` | Titan Tiny Homes website |
| Soo Sackers | `ga4-glv` | Shared property (limited data) |

When pulling GA4 data in Stage 1, use the correct MCP server for the client. If no GA4 data exists (e.g., new client), skip analytics and note it in the research report.

---

## Stage 1: Research (agent-autonomous) — Parallel Subagents

**Assignment:** `agent-autonomous`
**Goal:** Pull all available data from GSC, Semrush, GA4, and the web in parallel, then compile into a unified research report.

### Spawn 3 Subagents Simultaneously

Use the Task tool to launch all three in a single message (parallel execution):

#### Agent 1: SEO Research (`general-purpose`)

**Prompt template:**
```
You are researching [CLIENT] ([DOMAIN]) for a paid campaign.
Use the Semrush and Google Search Console MCP tools to gather:

1. Semrush overview_research — domain authority, traffic estimate, top organic keywords
2. Semrush keyword_research — keywords related to [OBJECTIVE/OFFER]
3. Semrush organic_research — top organic positions, competitor overlap
4. Semrush backlink_research — referring domains, backlink profile summary
5. GSC search_analytics — last 90 days: top queries, pages, CTR, average position
6. GSC detect_quick_wins — keywords close to ranking (positions 8-20)
7. GSC index_inspect — indexing status of key pages

Return a structured markdown report with:
- Domain overview (authority, traffic, top keywords)
- Keyword opportunities (high volume, low competition)
- Quick wins (GSC positions 8-20 that could rank with a push)
- Competitor gap analysis
- Backlink summary
- Indexing issues (if any)
```

**Tools used:** Semrush MCP (`overview_research`, `keyword_research`, `organic_research`, `backlink_research`), GSC MCP (`search_analytics`, `detect_quick_wins`, `index_inspect`)

#### Agent 2: Analytics (`general-purpose`)

**Prompt template:**
```
You are pulling web analytics for [CLIENT] using the [GA4_SERVER] MCP server.
Gather the following GA4 data:

1. runReport — sessions, users, bounce rate, avg session duration (last 90 days, trended weekly)
2. getPageViews — top 20 pages by views
3. getEvents — key conversion events (form_submit, phone_click, contact, purchase)
4. getUserBehavior — traffic sources, device breakdown, new vs returning

Return a structured markdown report with:
- Traffic overview (sessions, users, trends)
- Top performing pages
- Conversion events and rates
- Audience profile (sources, devices, new vs returning)
- Recommendations for campaign targeting based on the data
```

**Tools used:** GA4 MCP (`runReport`, `getPageViews`, `getEvents`, `getUserBehavior`)

#### Agent 3: Market Research (`general-purpose`)

**Prompt template:**
```
You are researching the competitive landscape for [CLIENT] in [TARGET_AREA] ([INDUSTRY]).
Use WebSearch and WebFetch to gather:

1. Competitor ad activity — search for competitor Facebook ads (Meta Ad Library), Google Ads
2. Market trends — industry trends for [INDUSTRY] in [YEAR]
3. Audience language — how the target audience talks about [SERVICE/PRODUCT]
4. Industry benchmarks — typical CPC, CTR, conversion rates for [INDUSTRY] ads
5. Local competitor analysis — what competitors in [TARGET_AREA] are doing

Return a structured markdown report with:
- Top 3-5 competitors and their ad strategies
- Market trends and opportunities
- Audience language and pain points
- Industry benchmarks (CPC, CTR, CPA)
- Competitive gaps we can exploit
```

**Tools used:** `WebSearch`, `WebFetch`

### Compile Research Report

After all 3 agents return, the main thread compiles their outputs into a single report using this template:

```markdown
# Campaign Research Report — [Client]

**Date:** [YYYY-MM-DD]
**Prepared by:** GLV Marketing (AI-assisted)
**Campaign objective:** [Objective]
**Platforms:** [Platforms]
**Budget:** [Budget]

---

## Executive Summary

[2-3 paragraph synthesis of all research findings. What does the data tell us?
What are the biggest opportunities? What should the campaign focus on?]

---

## 1. Search Performance (GSC)

[Compiled from Agent 1 — GSC data]

### Top Queries (Last 90 Days)
| Query | Clicks | Impressions | CTR | Position |
|-------|--------|-------------|-----|----------|
| ... | ... | ... | ... | ... |

### Quick Wins (Positions 8-20)
| Query | Current Position | Impressions | Opportunity |
|-------|-----------------|-------------|-------------|
| ... | ... | ... | ... |

### Indexing Status
[Any issues flagged]

---

## 2. SEO & Competitive Intelligence (Semrush)

[Compiled from Agent 1 — Semrush data]

### Domain Overview
- Domain Authority: [X]
- Organic Traffic: [X]/month
- Top Organic Keywords: [count]

### Keyword Opportunities
| Keyword | Volume | KD | CPC | Current Position |
|---------|--------|-----|-----|-----------------|
| ... | ... | ... | ... | ... |

### Competitor Overlap
[Key competitors and shared keywords]

### Backlink Profile
- Referring Domains: [X]
- Backlinks: [X]
- Notable gaps: [...]

---

## 3. Web Analytics (GA4)

[Compiled from Agent 2]

### Traffic Overview
| Metric | Last 30 Days | Trend |
|--------|-------------|-------|
| Sessions | ... | ... |
| Users | ... | ... |
| Bounce Rate | ... | ... |
| Avg Session Duration | ... | ... |

### Top Pages
| Page | Views | Avg Time | Bounce Rate |
|------|-------|----------|-------------|
| ... | ... | ... | ... |

### Conversions
| Event | Count | Rate |
|-------|-------|------|
| ... | ... | ... |

### Audience Profile
- **Sources:** [breakdown]
- **Devices:** [breakdown]
- **New vs Returning:** [breakdown]

---

## 4. Market & Competitor Research

[Compiled from Agent 3]

### Competitor Activity
| Competitor | Platforms | Ad Types | Key Messages |
|-----------|-----------|----------|--------------|
| ... | ... | ... | ... |

### Market Trends
[Key trends]

### Audience Language
[How the target audience talks about this]

### Industry Benchmarks
| Metric | Benchmark | Source |
|--------|-----------|--------|
| CPC | $X.XX | ... |
| CTR | X.X% | ... |
| CPA | $X.XX | ... |

---

## 5. Recommendations

### Campaign Focus
[What the campaign should prioritise based on all data]

### Target Keywords (Paid)
[Top 10-15 keywords to target in paid campaigns]

### Audience Segments
[Suggested targeting based on GA4 + market research]

### Creative Direction
[Initial creative direction based on competitor gaps and audience language]

---

*Generated by GLV Marketing campaign workflow. Proceed to Stage 2 for campaign planning.*
```

### Deliverable

**Save to:** `H:\Shared drives\Clients\<Client>\Campaigns\YYYY-MM\research-report.md`

**Discord notification:**
```bash
curl -s -X POST "$(cat ~/.claude/credentials/discord-webhook.txt)" \
  -H "Content-Type: application/json" \
  -d '{"username": "Life-OS", "content": "📊 **Campaign Workflow — Stage 1 Complete**\nClient: [CLIENT]\nResearch report compiled. Moving to Stage 2 (campaign planning)."}'
```

**State update:**
```json
{
  "client": "[CLIENT]",
  "stage": 1,
  "status": "complete",
  "started": "[ISO_TIMESTAMP]",
  "stage_1_completed": "[ISO_TIMESTAMP]",
  "deliverables": {
    "research_report": "H:\\Shared drives\\Clients\\[CLIENT]\\Campaigns\\YYYY-MM\\research-report.md"
  }
}
```

Save to `.state/campaign-workflow.json`.

---

## Stage 2: Campaign Planning (agent-autonomous)

**Assignment:** `agent-autonomous`
**Goal:** Synthesise the research report into a detailed campaign brief.
**Depends on:** Stage 1 output (sequential — needs the research report)

### Process — Agency Swarm Pipeline

Stage 2 uses a structured agency hierarchy to produce the campaign brief. Each agent has specialised skills and passes output to the next.

**Pipeline overview:**
```
Selected ideas (from Director idea bank or campaign objective)
    │
    ▼
Creative Director (generates 10-25 angle variations)
    │
    ▼
Art Director (picks direction, sets visual specs + scene descriptions)
    │
    ▼
Copywriter → Writer → Editor → Copywriter (copy refinement loop)
    │
    ▼
Creative Producer (generates actual images via fal.ai NB2 with final copy baked in)
    │
    ▼
Campaign Brief (copy + visuals, production-ready)
```

### Per-Demographic Funnel Generation

The agency swarm generates creative sets PER demographic segment:

1. **Input:** Director plan with per-segment funnel definitions (from `projects/[client]/strategy/marketing-director-plan.md`)
2. **For EACH segment:**
   - Creative Director generates angle variations specific to THIS segment's psychology and pain points
   - Art Director sets visual specs matching THIS segment's demographics (age-appropriate people, lifestyle-appropriate settings, no cross-demographic imagery)
   - Copy agents write headlines/body tailored to THIS segment's communication style, values, and objection patterns
   - Creative Producer generates images matching THIS segment (retiree ads show retirees, family ads show families)
3. **Output organization:**
   ```
   projects/[client]/paid-advertising/creatives/[campaign]/
   ├── [segment-1-slug]/
   │   ├── tofu/
   │   ├── mofu/
   │   └── bofu/
   ├── [segment-2-slug]/
   │   ├── tofu/
   │   ├── mofu/
   │   └── bofu/
   └── ...
   ```
4. **Each ad is tagged with its target segment** via the folder path so test-group can route it correctly

### Creative Rules (Per Segment)

- No cross-demographic imagery (retiree ads show retirees, not young families)
- Messaging adapts to the segment's pain points, values, and communication style
- Time/health references are careful with older demographics
- Each funnel is a complete TOFU/MOFU/BOFU set, not partial
- Imagery, tone, and CTA all match the segment's avatar profiles

#### Agent 1: Creative Director (`general-purpose` subagent)

**Skills loaded:** marketing-fundamentals, content-strategy, research data
**Receives:** Research report (Stage 1) + Director plan (if from onboard pipeline) + selected ideas from idea bank (if available) + campaign objective
**Behaviour:** Thinks in ANGLES and HOOKS, not copy. Generates volume.

**Prompt template:**
```
You are the Creative Director for [CLIENT]'s campaign.

Your job is to generate 10-25 creative angle variations for this campaign.

**Input:**
- Research report: [paste or reference]
- Campaign objective: [objective]
- Selected ideas (if any): [from idea bank]
- Target avatars: [from research or brief]

**Process:**
1. For each angle, think from MULTIPLE perspectives:
   - Young vs. old audience
   - Male vs. female audience
   - Different life stages (single, family, retired)
   - Different emotional states (aspirational, fearful, curious, sceptical)
2. Generate 10-25 distinct angles. Each angle needs:
   - Hook (1 sentence)
   - Emotional driver (nostalgia, freedom, status, safety, family, etc.)
   - Target avatar(s)
   - Why it works (1 sentence rationale)
3. Self-debate: For each angle, argue FOR and AGAINST from at least 2 demographic viewpoints
4. Filter: Remove weak/redundant angles, cluster similar ones
5. Rate remaining angles 1-10 with percentage confidence

**Output:** Top 5-7 angles ranked, with ratings and rationale. Format as a table:
| Rank | Hook | Emotional Driver | Avatars | For (perspective) | Against (perspective) | Score |
|------|------|-----------------|---------|-------------------|----------------------|-------|

**Rules:**
- VOLUME first, quality filtering second
- No copy — just angles and hooks
- Use Emotional Framing Rules (positive/aspirational default, barbecue test)
- Cite research findings that support each angle
```

#### Agent 2: Art Director (`general-purpose` subagent)

**Skills loaded:** ad-creative, platform specs, brand identity
**Receives:** Creative Director's top 5-7 angles
**Behaviour:** Thinks VISUALLY. Specifies sizes, formats, visual tone.

**Prompt template:**
```
You are the Art Director for [CLIENT]'s campaign.

The Creative Director has produced these top angles:
[paste Creative Director output]

**Your job:**
1. Classify each angle for visual/campaign viability (1-10)
2. Pick the winning direction (or recommend 2 for A/B testing)
3. For the chosen direction(s), define:

**Campaign timeline:** [duration, phases]

**Visual tone:** [mood, colour palette, photography style, typography feel]

**Platform sizing requirements — EVERY creative needs ALL sizes:**
| Platform | Placement | Aspect Ratio | Resolution | Format |
|----------|-----------|-------------|------------|--------|
| Facebook | Feed | 1:1 | 1080x1080 | Static image |
| Facebook | Feed | 4:5 | 1080x1350 | Static image |
| Instagram | Feed | 1:1 | 1080x1080 | Static image |
| Instagram | Story/Reel | 9:16 | 1080x1920 | Video (5-15s) |
| Google Display | Leaderboard | 728x90 | — | Static |
| Google Display | Rectangle | 300x250 | — | Static |
[Add/remove platforms per campaign brief]

**Per creative asset, specify:**
- Scene description (what the viewer sees)
- Emotional intent (what the viewer should feel)
- Text overlay requirements (headline placement, CTA placement)
- Brand elements (logo placement, colour usage)

**Output:** Creative direction brief with visual specs for each approved angle.
```

#### Agent 3-6: Copy Refinement Loop (4 sequential `general-purpose` subagents)

**Pass 1 — Copywriter:**
**Skills loaded:** copywriting (with Emotional Framing Rules), brand-voice
**Receives:** Art Director's chosen direction + brand voice rules

```
You are the Copywriter for [CLIENT]'s campaign.

**Input:**
- Art Director's creative direction: [paste]
- Brand voice: [paste brand-voice guidelines or client brand identity]
- Emotional Framing Rules: Lead positive/aspirational. Negative hooks limited to 1-sentence setup max. Banned phrases: "Don't miss out," "You're losing...," "Stop wasting...," "Before it's too late," "You can't afford to...," "Don't let [bad thing] happen." Apply the Barbecue Test.

**Write:**
1. Headlines (3-5 variations per creative)
2. Subheadlines
3. Body copy structure (bullet points, not full prose yet)
4. CTAs (action verb + what they get + qualifier)
5. Ad copy variants per platform (Facebook feed ≠ Instagram Reel ≠ Google Display)

**Rules:**
- Positive framing by default
- Specific over vague (numbers, outcomes, timeframes)
- Customer language (from research), not company language
- Each headline must pass the Barbecue Test
- Canadian English
```

**Pass 2 — Writer:**
**Skills loaded:** copywriting, content-strategy, email-sequence
**Receives:** Copywriter's structured draft

```
You are the Writer for [CLIENT]'s campaign.

**Input:** Copywriter's draft: [paste]

**Your job:** Flesh out the structured draft into complete copy:
1. Full body copy for each ad variant
2. Long-form sections (landing page copy if needed)
3. Email sequence copy (if campaign includes email)
4. Ensure narrative flow — TOFU → MOFU → BOFU tells a connected story
5. Story arc consistency across all touchpoints

**Rules:**
- Maintain the Copywriter's headline choices (don't rewrite them)
- Add depth, not length — every sentence earns its place
- Canadian English, local Northern Ontario context where relevant
- No fabricated statistics or testimonials
```

**Pass 3 — Editor:**
**Skills loaded:** brand-voice, Emotional Framing Rules
**Receives:** Writer's complete copy

```
You are the Editor for [CLIENT]'s campaign.

**Input:** Writer's complete copy: [paste]

**Your job — quality gate:**
1. **Brand voice compliance:** Does this sound like the client's brand? Check against brand identity doc.
2. **Emotional Framing Rules check:**
   - Scan for banned phrases (remove any found)
   - Word Polarity Check: count negative-polarity words. If >20% of emotional hooks are negative, flag for rebalance.
   - Barbecue Test: read each headline aloud — would you say this at a barbecue?
3. **Tighten:** Remove filler words, fix passive voice, cut redundancy
4. **Validate:** Canadian English spelling, no fabricated claims, local context accurate
5. **Style:** Remove exclamation points, ensure one idea per section, check sentence length

**Output:** Edited copy with tracked changes (show what you changed and why in [EDIT: reason] annotations). Flag any sections that need Copywriter revision.
```

**Pass 4 — Copywriter (Final Polish):**
**Skills loaded:** copywriting, brand-voice
**Receives:** Editor's annotated output

```
You are the Copywriter doing final polish for [CLIENT]'s campaign.

**Input:** Editor's annotated copy: [paste]

**Your job — final pass:**
1. Address any [EDIT] flags from the Editor
2. Headline punch — are they sharp enough? Would you stop scrolling?
3. CTA strength — is the action clear and compelling?
4. Emotional hook calibration — does the positive framing land?
5. Remove the [EDIT] annotations — output is production-ready

**Output:** Final, clean, production-ready copy for all campaign assets.
```

#### Agent 7: Creative Producer (`general-purpose` subagent) — APPROVAL GATE

**Skills loaded:** ad-creative (fal.ai workflow, platform specs, cost management)
**Receives:** Art Director's visual specs + Copywriter's production-ready copy (headlines, subheadlines, CTAs)
**Behaviour:** Generates actual visual assets using fal.ai Nano Banana Pro 2 with final copy baked into images. Iterates on composition, prompt, and text placement.

**Why this agent runs LAST in the creative pipeline:** Nano Banana Pro 2 renders text directly onto images. The Creative Producer needs final, approved copy (headlines, CTAs, subheadlines) to generate visuals with text baked in — not placeholders.

**APPROVAL GATE (MANDATORY):**
Before ANY fal.ai API call, present this cost table and wait for approval:

```markdown
## CREATIVE PRODUCER APPROVAL GATE

| #  | Asset                      | Copy Baked In          | Aspect Ratio | Est. Cost |
|----|----------------------------|------------------------|--------------|-----------|
| C1 | Facebook feed image        | "[Final headline]"     | 1:1          | $0.15     |
| C2 | Facebook feed image        | "[Final headline]"     | 4:5          | $0.15     |
| C3 | Instagram feed image       | "[Final headline]"     | 1:1          | $0.15     |
| C4 | Instagram Story            | "[Final headline]"     | 9:16         | $0.15     |
| ... | ...                       | ...                    | ...          | ...       |

**Total estimated draft cost: $X.XX**

Reply:
- **"all"** — Generate all assets
- **Specific codes** — e.g., "C1, C2" (skip others)
- **"revise"** — Change specs before generating
```

**Prompt template:**
```
You are the Creative Producer for [CLIENT]'s campaign.

You have the Art Director's visual specs AND the Copywriter's final, production-ready copy.
Your job is to generate actual ad images with text baked in using fal.ai Nano Banana Pro 2.

**Inputs:**
- Art Director's visual direction: [paste — scene descriptions, colour palette, photography style, brand elements]
- Final copy per creative: [paste — headlines, subheadlines, CTAs from Copywriter final output]
- Platform sizing: [paste — Art Director's platform × aspect ratio table]

**For each creative asset:**

1. **Build the fal.ai prompt** using this structure:
   [Scene/background description from Art Director], [style/mood/lighting],
   [composition with text placement], text overlay: "[EXACT HEADLINE]",
   subtext: "[EXACT CTA]", [brand elements: logo position, brand colours],
   professional ad layout, clean marketing design, [platform context]

2. **Nano Banana Pro 2 text rendering rules:**
   - Put ALL text content in quotes for accurate rendering
   - Limit to 3-5 text elements per image (headline + subheadline + CTA max)
   - Specify exact text placement (top-third, center, bottom-third)
   - Use contrasting text colours against the scene (white on dark, dark on light)
   - Include "clean typography" and "marketing layout" in every prompt
   - Specify font style intent: bold sans-serif for headlines, lighter for body
   - For longer headlines, specify line breaks in the prompt

3. **Generate 2 variations per creative** at 1K resolution (draft tier)

4. **Platform-specific prompt adjustments:**
   - 1:1 (Feed): Center-weighted composition, headline in top or bottom third
   - 4:5 (Feed): More vertical space — headline top, CTA bottom, scene middle
   - 9:16 (Story/Reel): Vertical composition, text in safe zones (avoid top 15% and bottom 20% for UI overlays)
   - 728x90 (Leaderboard): Ultra-wide — headline left, CTA right, minimal scene
   - 300x250 (Rectangle): Compact — scene background, headline center, CTA below

5. **Quality check each generated image:**
   - [ ] Text is legible and correctly rendered (no garbled letters)
   - [ ] Headline matches the Copywriter's exact final copy
   - [ ] CTA is visible and clear
   - [ ] Brand colours/logo present per Art Director specs
   - [ ] No AI artefacts (extra fingers, warped objects, distorted faces)
   - [ ] Correct aspect ratio for target platform
   - [ ] Emotional tone matches Art Director's direction
   - If text rendering fails: regenerate with simplified prompt or fewer text elements

6. **Present results** with URLs, cost breakdown, and side-by-side comparison of variations

**API call format:**
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)

curl -X POST "https://queue.fal.run/fal-ai/nano-banana-2" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[CONSTRUCTED PROMPT WITH BAKED TEXT]",
    "num_images": 2,
    "aspect_ratio": "[FROM ART DIRECTOR SPECS]",
    "resolution": "1K",
    "output_format": "png"
  }'

**Iteration rules:**
- If text renders poorly: simplify to headline + CTA only, retry
- If scene doesn't match Art Director's vision: adjust scene description, keep text the same
- If composition feels wrong: try different text placement (top vs. bottom vs. center)
- Maximum 3 iteration rounds per creative before escalating to Aiden

**Output:**
- Generated image URLs per creative per platform size
- Cost log (model, count, cost per image)
- Quality check results (pass/fail per image)
- Any text rendering issues flagged for manual review

**After approval for premium tier:**
Regenerate approved drafts at 2K resolution for production use.
```

**Cost logging:**
After each generation round, append to daily memory (`memory/YYYY-MM-DD.md`):
```markdown
### fal.ai Spend — [Client] Campaign Swarm
| Time | Model | Asset | Aspect | Cost |
|------|-------|-------|--------|------|
| HH:MM | NB2 | C1 feed image | 1:1 | $0.15 |
| HH:MM | NB2 | C2 feed image | 4:5 | $0.15 |
**Running total: $X.XX**
```

### Compile Campaign Brief

After the swarm pipeline completes, the main thread compiles all outputs into the campaign brief using the existing brief template (below), now enriched with:
- Creative Director's angle analysis
- Art Director's visual specs and platform sizing
- Production-ready copy from the 4-pass refinement loop
- **Generated creative assets with URLs and quality check results from Creative Producer**

### Brief Template

```markdown
# Campaign Brief — [Client]

**Date:** [YYYY-MM-DD]
**Prepared by:** GLV Marketing (AI-assisted)
**Campaign:** [Campaign Name]
**Objective:** [Objective]
**Duration:** [Start] to [End]
**Total Budget:** [Budget]

---

## 1. Campaign Overview & Objectives

### Business Goal
[What does the client want to achieve?]

### Campaign Objective
[Awareness / Consideration / Conversion — with specific targets]

### Success Metrics
| KPI | Target | Measurement |
|-----|--------|-------------|
| ... | ... | ... |

---

## 2. Target Audience

### Persona 1: [Name]
- **Demographics:** Age, gender, location, income
- **Psychographics:** Interests, values, pain points
- **Online behaviour:** Platforms, content consumption
- **Trigger:** What makes them ready to buy/act?

### Persona 2: [Name]
[Same structure]

### Persona 3: [Name] (if applicable)
[Same structure]

---

## 3. Messaging Framework

### Core Message
[One sentence that captures the campaign's value proposition]

### Per-Persona Messaging

| Persona | Headline | Body Copy Angle | CTA |
|---------|----------|----------------|-----|
| [P1] | [Headline] | [Angle] | [CTA] |
| [P2] | [Headline] | [Angle] | [CTA] |
| [P3] | [Headline] | [Angle] | [CTA] |

### Headline Variations (A/B Testing)
| # | Headline | Formula Used | Test Hypothesis |
|---|----------|-------------|----------------|
| H1 | ... | Benefit-first | ... |
| H2 | ... | Problem-agitate | ... |
| H3 | ... | Social proof | ... |

---

## 4. Channel Strategy & Budget Allocation

| Channel | Budget | % of Total | Objective | Funnel Stage |
|---------|--------|-----------|-----------|-------------|
| Facebook | $X | X% | [Obj] | [Stage] |
| Instagram | $X | X% | [Obj] | [Stage] |
| Google Ads | $X | X% | [Obj] | [Stage] |
| ... | ... | ... | ... | ... |

### Budget Breakdown
- **Ad spend:** $X (X%)
- **Creative production:** $X (X%)
- **Management fee:** $X (X%)

---

## 5. Creative Requirements

### Images Needed

| # | Asset | Platform | Aspect Ratio | Resolution | Description |
|---|-------|----------|-------------|------------|-------------|
| C1 | Feed image | Facebook | 1:1 | 1080x1080 | [Description] |
| C2 | Feed image | Instagram | 4:5 | 1080x1350 | [Description] |
| ... | ... | ... | ... | ... | ... |

### Videos Needed

| # | Asset | Platform | Aspect Ratio | Duration | Description |
|---|-------|----------|-------------|----------|-------------|
| V1 | Reel | Instagram | 9:16 | 5-10s | [Description] |
| V2 | In-stream | YouTube | 16:9 | 15s | [Description] |
| ... | ... | ... | ... | ... | ... |

---

## 6. Content Calendar

| Week | Channel | Content Type | Message | Asset |
|------|---------|-------------|---------|-------|
| W1 | Facebook | Feed ad | [Message] | C1 |
| W1 | Instagram | Reel | [Message] | V1 |
| ... | ... | ... | ... | ... |

---

## 7. A/B Test Plan

| Test # | Variable | Control | Variant | Hypothesis | Success Metric | Duration |
|--------|----------|---------|---------|-----------|---------------|----------|
| T1 | Headline | H1 | H2 | [Hypothesis] | CTR | 7 days |
| T2 | Creative | C1 | C2 | [Hypothesis] | Conv. Rate | 7 days |
| ... | ... | ... | ... | ... | ... | ... |

---

## 8. Success Metrics & Reporting

### KPIs
| Metric | Target | Check Frequency |
|--------|--------|----------------|
| CTR | X.X% | Weekly |
| CPC | $X.XX | Weekly |
| Conversions | X | Weekly |
| ROAS | X.Xx | Monthly |
| CPA | $X.XX | Monthly |

### Optimisation Triggers
| Condition | Action |
|-----------|--------|
| CTR < X% after 7 days | Swap creative |
| CPC > $X after 5 days | Adjust targeting |
| No conversions after 14 days | Review landing page + offer |

### Reporting Schedule
- **Weekly:** Performance snapshot (spend, CTR, CPC, conversions)
- **Monthly:** Full report with recommendations

---

*Proceed to Stage 3 for creative asset generation (requires approval).*
```

### Deliverable

**Save to:** `H:\Shared drives\Clients\<Client>\Campaigns\YYYY-MM\campaign-brief.md`

**Discord notification:**
```bash
curl -s -X POST "$(cat ~/.claude/credentials/discord-webhook.txt)" \
  -H "Content-Type: application/json" \
  -d '{"username": "Life-OS", "content": "📋 **Campaign Workflow — Stage 2 Complete**\nClient: [CLIENT]\nCampaign brief ready.\n\n⚠️ **APPROVAL NEEDED** for Stage 3 (creative generation).\nEstimated creative cost: $X.XX\n\nReview the brief and reply to proceed."}'
```

**State update:** Update `.state/campaign-workflow.json` with `"stage": 2, "status": "complete"`.

---

## Stage 3: Creative Asset Generation (agent-support — HARD STOP)

**Assignment:** `agent-support`
**Goal:** Generate ad creatives (images and video) using fal.ai based on the campaign brief.
**Depends on:** Stage 2 output AND explicit Aiden approval.

### APPROVAL GATE (MANDATORY)

**Before ANY fal.ai API call, present this approval table:**

```markdown
## STAGE 3 APPROVAL GATE

Campaign: [Campaign Name] for [Client]

| #  | Asset                      | Model            | Tier   | Est. Cost |
|----|----------------------------|------------------|--------|-----------|
| C1 | Facebook feed image 1:1    | Nano Banana Pro  | Draft  | $0.15     |
| C2 | Instagram feed image 4:5   | Nano Banana Pro  | Draft  | $0.15     |
| V1 | IG Reel draft 9:16, 5s     | Wan 2.6          | Draft  | $0.25     |
| ... | ...                       | ...              | ...    | ...       |

**Total estimated draft cost: $X.XX**

Reply:
- **"all"** — Generate all assets
- **Specific codes** — e.g., "C1, C2" (skip V1)
- **"revise"** — Change the brief before generating

⚠️ FAL_KEY will NOT be accessed until you approve.
```

### Hard Rules

1. **NO reading `~/.claude/credentials/fal-key.txt` before approval** — Do not access the API key until Aiden says "yes"
2. **NO `curl` to fal.ai endpoints before approval** — Zero API calls until approved
3. **Draft cheap first** — Always generate at draft tier (Wan 2.6 for video, NBP 1K for images)
4. **Second approval gate before premium tier** — If Aiden approves draft concepts for final generation (Kling 3.0, Veo 3, 4K), present a second cost table
5. **Log every API call and cost** in the daily memory file (`memory/YYYY-MM-DD.md`)

### Generation Workflow

After approval, reference the `ad-creative` skill for the full generation workflow:

1. **Read the API key:** `FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)`
2. **Generate images** using Nano Banana Pro at 1K resolution
3. **Generate video drafts** using Wan 2.6
4. **Poll for completion** and retrieve results
5. **Present results** with URLs and cost breakdown
6. **If approved for premium:** Re-generate selected assets at higher tier

### Premium Tier Approval Gate

```markdown
## PREMIUM TIER APPROVAL

Draft review complete. Ready to generate final versions.

| #  | Asset                      | Model            | Tier    | Est. Cost |
|----|----------------------------|------------------|---------|-----------|
| C1 | Facebook feed image 1:1    | Nano Banana Pro  | 2K      | $0.30     |
| V1 | IG Reel 9:16, 5s           | Kling 3.0 Pro    | Final   | $0.50     |
| ... | ...                       | ...              | ...     | ...       |

**Total estimated final cost: $X.XX**
**Total campaign creative spend so far: $X.XX**

Reply "all", specific codes, or "revise".
```

### Cost Logging

After each generation, append to daily memory:

```markdown
### fal.ai Spend — [Client] Campaign
| Time | Model | Asset | Cost |
|------|-------|-------|------|
| HH:MM | Nano Banana Pro | C1 feed image | $0.15 |
| HH:MM | Wan 2.6 | V1 reel draft | $0.25 |
**Running total: $X.XX**
```

### Creative Log

Save a creative log alongside the assets:

```markdown
# Creative Log — [Client] Campaign

## Assets Generated

| # | Asset | Model | Tier | Cost | URL | Status |
|---|-------|-------|------|------|-----|--------|
| C1 | FB feed 1:1 | NBP | Draft | $0.15 | [url] | Approved |
| C2 | IG feed 4:5 | NBP | Draft | $0.15 | [url] | Revision needed |
| V1 | IG Reel 9:16 | Wan 2.6 | Draft | $0.25 | [url] | Approved |

## Total Spend: $X.XX

## Prompts Used
[Record each prompt for reproducibility]

## Revisions
[Track any revision requests and outcomes]
```

### Deliverables

**Save to:**
- Assets: `H:\Shared drives\Clients\<Client>\Creative\YYYY-MM\` (images/ and video/ subdirectories)
- Log: `H:\Shared drives\Clients\<Client>\Campaigns\YYYY-MM\creative-log.md`

**Discord notification:**
```bash
curl -s -X POST "$(cat ~/.claude/credentials/discord-webhook.txt)" \
  -H "Content-Type: application/json" \
  -d '{"username": "Life-OS", "content": "🎨 **Campaign Workflow — Stage 3 Complete**\nClient: [CLIENT]\nCreative assets generated. Total spend: $X.XX\nMoving to Stage 4 (implementation plan)."}'
```

**State update:** Update `.state/campaign-workflow.json` with `"stage": 3, "status": "complete"`.

---

## Stage 4: Implementation Plan (agent-support)

**Assignment:** `agent-support`
**Goal:** Write a detailed implementation plan covering platform setup, targeting, budget allocation, and optimisation triggers.
**Depends on:** Stage 3 output (needs creative assets mapped to placements)

### Process

Launch a single `general-purpose` subagent with all prior deliverables (research report, campaign brief, creative log) and these instructions:

**Prompt template:**
```
You are writing the implementation plan for [CLIENT]'s campaign.
You have the research report, campaign brief, and creative assets.

Write a step-by-step implementation document that Aiden can follow
to set up the campaign in the actual ad platforms. Be specific about
settings, targeting parameters, and bid strategies.

All recommendations should follow Canadian regulations and
target the Northern Ontario / Sault Ste. Marie market.
```

### Implementation Plan Template

```markdown
# Implementation Plan — [Client] Campaign

**Date:** [YYYY-MM-DD]
**Campaign:** [Campaign Name]
**Prepared by:** GLV Marketing (AI-assisted)

---

## 1. Platform Setup

### Facebook / Instagram (Meta Ads Manager)

#### Campaign Structure
| Level | Name | Objective | Budget |
|-------|------|-----------|--------|
| Campaign | [Name] | [Objective] | $X/day |
| Ad Set 1 | [Persona 1 targeting] | — | $X/day |
| Ad Set 2 | [Persona 2 targeting] | — | $X/day |
| Ad 1a | [Creative C1 + Copy H1] | — | — |
| Ad 1b | [Creative C2 + Copy H2] | — | — |

#### Campaign Settings
- **Buying type:** Auction
- **Objective:** [Conversions / Traffic / Lead Generation]
- **Special ad categories:** [None / Housing / Credit / etc.]
- **Campaign budget optimisation:** [On/Off]

### Google Ads (if applicable)
[Similar structure for Google Ads campaigns]

---

## 2. Targeting Settings

### Ad Set 1: [Persona Name]
- **Location:** Sault Ste. Marie, ON + [X] km radius
- **Age:** [Range]
- **Gender:** [All / Specific]
- **Interests:** [List]
- **Behaviours:** [List]
- **Custom audiences:** [Description]
- **Lookalike audiences:** [Source audience, X% similarity]
- **Exclusions:** [Existing customers, recent converters, etc.]

### Ad Set 2: [Persona Name]
[Same structure]

---

## 3. Budget Allocation & Bid Strategy

| Ad Set | Daily Budget | Bid Strategy | Bid Cap |
|--------|-------------|-------------|---------|
| [AS1] | $X.XX | Lowest cost | — |
| [AS2] | $X.XX | Cost cap | $X.XX |

### Spending Schedule
- **Week 1:** Learning phase — monitor, don't adjust
- **Week 2:** Evaluate initial performance, pause underperformers
- **Week 3-4:** Scale winners, optimise targeting

---

## 4. Creative → Placement Mapping

| Ad | Creative | Headline | CTA | Placement |
|----|----------|----------|-----|-----------|
| Ad 1a | C1 (FB feed) | H1 | [CTA] | Facebook Feed, Marketplace |
| Ad 1b | V1 (Reel) | H2 | [CTA] | Instagram Reels, Stories |
| ... | ... | ... | ... | ... |

---

## 5. A/B Test Setup

### Test 1: [Variable]
- **Control:** [Ad 1a]
- **Variant:** [Ad 1b]
- **Hypothesis:** [Statement]
- **Split:** 50/50
- **Duration:** 7 days minimum
- **Success metric:** [CTR / Conversion rate]
- **Minimum sample:** [X] impressions per variant

### Test 2: [Variable]
[Same structure]

---

## 6. Tracking & Pixels

### Meta Pixel
- [ ] Pixel installed on [domain]
- [ ] Standard events configured: PageView, ViewContent, Lead, Purchase
- [ ] Custom conversions defined: [list]

### Google Analytics
- [ ] UTM parameters on all ad URLs
- [ ] Goals/conversions configured in GA4
- [ ] Campaign tagged: `utm_source=facebook&utm_medium=cpc&utm_campaign=[name]`

---

## 7. KPIs with Targets

| KPI | Target | Warning Threshold | Action if Below |
|-----|--------|-------------------|-----------------|
| CTR | >X.X% | <X.X% | Swap creative |
| CPC | <$X.XX | >$X.XX | Adjust targeting |
| Conversions/week | >X | <X after 14 days | Review landing page |
| ROAS | >X.Xx | <X.Xx | Reduce spend, optimise |
| CPA | <$X.XX | >$X.XX | Narrow targeting |

---

## 8. Reporting Schedule & Optimisation Triggers

### Weekly Check (Every Monday)
- Pull spend, impressions, clicks, CTR, CPC, conversions
- Compare to KPI targets
- Identify top/bottom performers
- Recommend adjustments

### Monthly Report
- Full performance analysis
- Budget efficiency review
- Creative performance breakdown
- Audience insights
- Recommendations for next month

### Optimisation Triggers (Act Immediately)
| Trigger | Action |
|---------|--------|
| CTR drops below X% | Refresh creative |
| CPC exceeds $X for 3+ days | Adjust targeting or bids |
| No conversions after 7 days | Review landing page, offer, tracking |
| Frequency exceeds 3.0 | Expand audience or refresh creative |
| Budget depleted before month-end | Reduce daily spend, focus on winners |

---

## 9. Launch Checklist

- [ ] All creatives uploaded and approved
- [ ] Targeting configured per ad set
- [ ] Budget and bid strategy set
- [ ] Pixel/tracking verified
- [ ] UTM parameters on all URLs
- [ ] Landing page tested (mobile + desktop)
- [ ] A/B tests configured
- [ ] Notification set for first results (24h)
- [ ] Aiden's final approval to go live

---

*Campaign ready for launch. Awaiting Aiden's final go-ahead.*
```

### Deliverable

**Save to:** `H:\Shared drives\Clients\<Client>\Campaigns\YYYY-MM\implementation-plan.md`

**Discord notification:**
```bash
curl -s -X POST "$(cat ~/.claude/credentials/discord-webhook.txt)" \
  -H "Content-Type: application/json" \
  -d '{"username": "Life-OS", "content": "🚀 **Campaign Workflow — Stage 4 Complete**\nClient: [CLIENT]\nImplementation plan ready.\n\nAll 4 stages complete. Campaign is ready for launch setup.\nDeliverables in: Shared drives > Clients > [CLIENT] > Campaigns > YYYY-MM"}'
```

**State update:** Update `.state/campaign-workflow.json` with `"stage": 4, "status": "complete"`.

---

## State Tracking & Session Resumption

The workflow writes progress to `.state/campaign-workflow.json` after each stage:

```json
{
  "client": "Soo Sackers",
  "domain": "soosackers.com",
  "objective": "Lead generation",
  "platforms": ["Facebook", "Instagram"],
  "budget": "$500",
  "target_area": "Sault Ste. Marie, ON",
  "stage": 2,
  "status": "complete",
  "started": "2026-02-24T20:00:00Z",
  "stage_1_completed": "2026-02-24T20:15:00Z",
  "stage_2_completed": "2026-02-24T20:25:00Z",
  "stage_3_completed": null,
  "stage_4_completed": null,
  "deliverables": {
    "research_report": "H:\\Shared drives\\Clients\\Soo Sackers\\Campaigns\\2026-02\\research-report.md",
    "campaign_brief": "H:\\Shared drives\\Clients\\Soo Sackers\\Campaigns\\2026-02\\campaign-brief.md",
    "creative_log": null,
    "implementation_plan": null
  },
  "creative_spend": 0.00,
  "approved_assets": []
}
```

### Resuming a Workflow

If a session ends mid-workflow:

1. Read `.state/campaign-workflow.json`
2. Check the current `stage` and `status`
3. If `status: "complete"`, proceed to the next stage
4. If `status: "awaiting_approval"`, re-present the approval gate
5. If `status: "in_progress"`, check deliverables to determine where to resume

---

## Autonomy Boundaries

| Action | Level |
|--------|-------|
| Stage 1: Pull GSC, Semrush, GA4 data | agent-autonomous |
| Stage 1: Web/competitor research | agent-autonomous |
| Stage 1: Compile research report | agent-autonomous |
| Stage 2: Build campaign brief | agent-autonomous |
| Stage 3: ANY fal.ai API call | agent-support (HARD STOP) |
| Stage 3: Upgrade to premium tier | agent-support (second approval) |
| Stage 4: Write implementation plan | agent-support |
| Send deliverables to clients | user (Aiden sends) |
| Launch campaign in ad platforms | user (Aiden executes) |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Skip intake and assume inputs | Ask Aiden for missing required inputs |
| Run Stage 1 agents sequentially | Spawn all 3 in parallel using Task tool |
| Access FAL_KEY before Stage 3 approval | Wait for explicit "yes" before any fal.ai call |
| Generate at premium tier first | Draft cheap, get approval, then upgrade |
| Skip the approval gate | Always present the cost table and wait |
| Forget to log creative spend | Append to daily memory after every API call |
| Overwrite previous campaign state | Use YYYY-MM folder structure, one campaign per period |
| Send deliverables to clients directly | All client-facing communication goes through Aiden |

---

## Related Skills

- **copywriting** (with Emotional Framing Rules) — Used by Copywriter and Editor agents in the swarm pipeline
- **brand-voice** — Used by Copywriter and Editor agents for tone compliance
- **ad-creative** — Used by Art Director agent for visual specs and fal.ai generation
- **content-strategy** — Used by Creative Director agent for angle generation
- **marketing-fundamentals** — Used by Creative Director for strategic frameworks
- **paid-advertising** — Platform guidelines, budget allocation, funnel targeting (used in Stage 2)
- **ab-test-setup** — A/B test hypothesis framework (used in Stages 2 and 4)
- **analytics-attribution** — GA4 reporting and attribution models (used in Stage 1)
- **seo-mastery** — SEO audit and keyword research context (used in Stage 1)
- **competitor:deep** — Competitor analysis (used in Stage 1)

## Related Integrations

- **Semrush MCP** — Keyword research, organic research, backlinks, site audit
- **Google Search Console MCP** — Search analytics, quick wins, indexing
- **GA4 MCP** — `ga4-fusion`, `ga4-glv`, `ga4-titan` (one per client)
- **fal.ai REST API** — AI image and video generation (Stage 3 only)
- **Discord webhook** — Stage transition notifications

---

## Dependencies

- Semrush MCP server active
- Google Search Console MCP server active
- GA4 MCP server active (correct property for client)
- `FAL_KEY` in `~/.claude/credentials/fal-key.txt` (accessed only in Stage 3)
- Discord webhook in `~/.claude/credentials/discord-webhook.txt`
- Client folder structure: `H:\Shared drives\Clients\<Client>\Campaigns\YYYY-MM\`
- `curl` available in shell

---

*This skill orchestrates the full campaign lifecycle. Each stage builds on the last. The approval gate at Stage 3 protects against unintended API spend. When in doubt, ask Aiden.*
