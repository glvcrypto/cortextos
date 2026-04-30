---
name: avatar-research
description: Build deep, fully-dimensioned avatars using universal schema (40+ dimensions). Called by pillar-a during onboarding. Produces avatar files consumed by test-group, ad-creative, and campaign-workflow.
---

# Avatar Research Skill

> Owns the universal avatar schema. Builds fully-dimensioned avatars for a specific client and niche. Called by pillar-a during /onboard. Not invoked directly by user.

---

## Trigger

- Called by pillar-a during `/onboard`
- Not a user-facing command

## Inputs (All Derived from Research)

| Parameter | Source | Notes |
|-----------|--------|-------|
| Niche | /onboard command | e.g., "marine dealer", "plumber" |
| Area | /onboard command | e.g., "Sault Ste. Marie, Ontario" |
| Client | /onboard command | e.g., "Reyco Marine" |
| Demographic segments | Pillar-a initial customer research | Who actually buys in this niche |
| Niche research file | Prospecting (Phase 1) or onboard (Phase 2) | Competitor landscape, keyword data |
| Existing pillar research | Pillars b-h if available | Cross-referencing context |

No manual inputs from Aiden. Everything is derived from the research pipeline.

---

## Universal Avatar Schema

Every avatar gets ALL of these dimensions populated. No field left blank.

### Categories

1. **Demographics** — Age (specific), gender, location, ethnicity, relationship status, dependents, pets, living arrangement
2. **Socioeconomic** — Income, education, industry, job title, credit score, cost of living, works on weekends
3. **Psychology** — Personality temperament (4 types), MBTI, IQ range, emotional intelligence, risk profile, 8 dimensions of wellness (scored 1-10)
4. **Life Context** — Traumatic/stressful events (with severity + specific description), major life roles, daily transportation, sleep hours
5. **Digital Behaviour** — Preferred gadgets (ranked), communication tools, social networks, marketing channels, information sources
6. **Consumer Profile** — Customer type, range of influence
7. **Skepticism & Trust** — Marketing skepticism level, ad frustration triggers, trust anchors
8. **Communication Style** — How they talk, how they express disagreement
9. **Values & Cultural Anchors** — Core values (ranked), brand affinities (specific, regional), media consumption
10. **Decision-Making** — Purchase style, financial anxiety level
11. **Niche-Specific** — Primary goal, experience level, buying history, pain points

Plus 7 psychology frameworks applied to each avatar:
- Sinek's Golden Circle (WHY/HOW/WHAT)
- Jobs to Be Done (Functional/Emotional/Social)
- Schwartz's 5 Awareness Stages
- Before & After Grid (HAVE/FEEL/AVERAGE DAY/STATUS)
- Loss Aversion
- Aspirational Gap
- Regulatory Focus

Plus buyer profile: buyer type (Comparer/Decided), lead journey, evaluation criteria, decision triggers, objection patterns.

**Template:** `.claude/skills/avatar-research/templates/avatar-template.md`

---

## Process

```
Step 1: Receive demographic segments from pillar-a
  (e.g., "retiree cottage owners", "young families", "fishing enthusiasts")
  ↓
Step 2: For each segment, determine variant count
  Default: maximum depth. Research the niche to determine
  how many meaningfully different people exist in this segment.
  Minimum 3 variants per segment. No arbitrary cap.
  ↓
Step 3: For each variant, launch a research subagent (parallel)
  Each agent researches plausible values for ALL dimensions.
  ↓
Step 4: Validate variability across the panel
  No two avatars in same segment share temperament + life event.
  Mix of genders, skepticism levels, communication styles.
  If too homogeneous: regenerate specific variants.
  ↓
Step 5: Save outputs
  One avatar file per variant + panel summary.
```

---

## Step 2: Variant Design

For each segment, define variant constraints that ensure differentiation:

**Vary across:**
- Gender (minimum 2 represented per segment)
- Age (span the segment range, not all same age)
- Personality temperament (no two same in a segment)
- Skepticism level (mix of highly skeptical, cautious, neutral, receptive)
- Communication style (mix of blunt, analytical, emotional, terse)
- Life events (mix of N/A, recovered, permanent, etc.)
- Buyer type (both Comparers and Decided Buyers)
- Financial anxiety (mix of comfortable, cautious, stressed)

**Goal:** Engineer natural opposition so that when these avatars are used in a test-group debate, they genuinely disagree based on who they are, not because we told them to.

---

## Step 3: Avatar Research Agent (Parallel)

**Launch one Agent per variant** using the Agent tool with `subagent_type: "general-purpose"`.

### Avatar Research Agent Prompt

```
You are an avatar researcher for GLV Marketing. Your job is to build ONE fully-dimensioned avatar for a synthetic focus group.

**Client:** [CLIENT]
**Niche:** [NICHE]
**Area:** [AREA]
**Segment:** [SEGMENT_NAME] — [SEGMENT_DESCRIPTION]
**Variant constraints:** [specific constraints for this variant to ensure differentiation — e.g., "female, 40s, cautious skeptic, choleric temperament, recovered from job loss"]

**Tools available:** WebSearch, WebFetch

**Niche research is provided below for context.**
**Existing pillar research is provided below if available.**

**Your task:** Build a complete avatar by researching plausible values for EVERY field in the universal schema. This avatar must feel like a real person who lives in [AREA] and is a potential customer in the [NICHE] industry.

**Research guidance:**
- Use reference sources linked below where applicable
- Cross-reference with niche research for niche-specific fields
- Life events should be plausible for this person's age and background
- IQ, EQ, wellness scores should be consistent with their education, occupation, and life context
- Brand affinities should be specific and regional (Canadian brands where applicable — Tim Hortons not Dunkin, Canadian Tire not Home Depot)
- Communication style should match their temperament and background
- Skepticism level should match their education, marketing awareness, and life experiences
- All 7 psychology frameworks must be applied and filled completely

**Reference sources:**
- 8 dimensions of wellness: https://www.colorado.edu/health/sites/default/files/attached-files/personal_assessment_-_8_dimensions_of_wellness.pdf
- 5 major ethnicity/minority: https://sitn.hms.harvard.edu/flash/2017/science-genetics-reshaping-race-debate-21st-century/
- IQ scores: https://www.verywellmind.com/what-is-a-genius-iq-score-2795585
- Credit scores: https://www.credit.com/credit-scores/what-is-a-good-credit-score/
- Traumatic events: https://paindoctor.com/top-10-stressful-life-events-holmes-rahe-stress-scale/
- Qualifying life events: https://www.healthcare.gov/glossary/qualifying-life-event/
- Major life roles: https://journaledlife.com/life-roles/
- Personality types (MBTI): https://www.16personalities.com/personality-types
- Four temperaments: https://krav-maga-self-defence.com/the-four-temperaments/
- Customer types: https://www.channels.app/blog/types-of-customers
- Influencer tiers: https://influencermarketinghub.com/types-of-influencers/

**Output:** Return the completed avatar using the template format below. Fill in EVERY field. No field should be left blank.

[AVATAR TEMPLATE CONTENT INSERTED HERE BY ORCHESTRATOR]

[NICHE RESEARCH CONTENT INSERTED HERE BY ORCHESTRATOR]

[EXISTING PILLAR RESEARCH INSERTED HERE BY ORCHESTRATOR IF AVAILABLE]
```

---

## Step 4: Variability Validation

After all research agents return, check the full panel:

### Checks (per segment)

- [ ] At least 2 genders represented
- [ ] Age range spans the segment (not all same age)
- [ ] No two avatars share the same personality temperament
- [ ] Mix of skepticism levels (not all neutral or all skeptical)
- [ ] Mix of communication styles (not all verbose/formal)
- [ ] Mix of life events (not all N/A)
- [ ] Mix of buyer types (Comparers AND Decided Buyers)
- [ ] Mix of financial anxiety levels
- [ ] Brand affinities are regional and specific (not generic)
- [ ] Niche-specific fields are accurate to the client's actual business

### If Validation Fails

Identify which specific avatars are too similar and regenerate only those variants with different constraints. Do not regenerate the entire panel.

---

## Step 5: Save Outputs

1. **Avatar files:** One per variant at `projects/[client]/research/avatars/[slug].md`
   - Slug = kebab-case of avatar name (e.g., `doug-retired-electrician.md`)
2. **Panel summary:** `projects/[client]/research/test-group-panel.md`
   - Uses panel template from `.claude/skills/avatar-research/templates/panel-template.md`
   - Lists all avatars with key differentiators for quick reference
   - Includes segment funnel mapping (populated later by Director plan)

### Report to Orchestrator

```
## Avatars Built: [CLIENT]

**Segments:** [X]
**Total avatars:** [Y]
**Files:** projects/[client]/research/avatars/

| # | Name | Age | Gender | Segment | Temperament | Skepticism | Key Differentiator |
|---|------|-----|--------|---------|-------------|------------|-------------------|
[summary table]

Variability check: [PASS / issues found and resolved]
```

---

## File Locations

| Output | Path |
|--------|------|
| Avatar files | `projects/[client]/research/avatars/[slug].md` |
| Panel summary | `projects/[client]/research/test-group-panel.md` |
| Avatar template | `.claude/skills/avatar-research/templates/avatar-template.md` |
| Panel template | `.claude/skills/avatar-research/templates/panel-template.md` |

---

## Integration Points

- **Pillar-a** (`.claude/skills/onboard/research/SKILL.md`): Calls this skill during onboarding
- **Test-group** (`.claude/skills/test-group/SKILL.md`): Reads avatar files to spawn respondents
- **Ad-creative** (`.claude/skills/ad-creative/SKILL.md`): Reads panel for demographic targeting
- **Campaign-workflow** (`.claude/skills/campaign-workflow/SKILL.md`): Reads panel for funnel definitions
- **Director** (`.claude/skills/onboard/director/SKILL.md`): Reads panel to define per-segment funnels

---

## Autonomy Boundaries

```yaml
autonomous:
  - Research avatar dimensions (web search)
  - Generate avatar files
  - Save to projects/[client]/research/avatars/
  - Generate panel summary
  - Variability validation
  - Regenerate specific variants if validation fails

needs_approval:
  - None (called by pillar-a, which has its own approval gates)

never:
  - Override segment definitions (those come from pillar-a)
  - Skip fields in the universal schema
  - Reuse avatars from a different client
  - Use generic/American brand references (always Canadian/regional)
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Skip fields because "not relevant" | Every field gets populated for every avatar |
| Make all avatars in a segment the same temperament | Engineer variety — that's the whole point |
| Use American brand references | Use Canadian/regional brands (Tim Hortons, Canadian Tire, TSN) |
| Make all avatars N/A for life events | Real people have histories — vary this meaningfully |
| Build avatars that all agree with each other | Engineer natural opposition through different values, skepticism, communication styles |
| Leave psychology frameworks generic | Each framework must be specific to THIS avatar in THIS niche |
| Make all avatars marketing-receptive | Include highly skeptical people — they make test groups honest |
| Copy-paste niche-specific fields across avatars | Each avatar has their own relationship with the niche |
