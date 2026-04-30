---
name: proposal
description: Generate a full client proposal from a business name and website URL
---

# Proposal Generator

> "Show them exactly where they stand, what they're missing, and what we'll do about it."

This skill runs a comprehensive audit of a prospect's website and digital presence, then generates both a **client-facing proposal** and an **internal reference file** for GLV Marketing.

---

## Trigger

Activate this skill when Aiden says any of:
- "proposal for [business name]"
- "audit [website]"
- "run a proposal on [url]"
- "pitch for [business]"
- `/proposal`

---

## Required Input

| Field | Required | Example |
|-------|----------|---------|
| Business name | Yes | "Joe's Plumbing" |
| Website URL | Yes | "joesplumbing.ca" |
| Business type/niche | Helpful | "plumber", "accountant", "ecommerce" |
| City | Default: Sault Ste. Marie | "Sudbury" |
| Contact name | Optional | "Joe Smith" |

If business type or city aren't provided, infer from the website content.

---

## Workflow

**This runs all at once. No stage gates. One prompt, one output.**

Spawn parallel subagents where marked with `[parallel]` to maximise speed.

### Step 1: Discovery [parallel — run all 3 simultaneously]

#### 1A: Technical & SEO Audit
Use Semrush MCP tools:
- `semrush > overview_research` — Domain overview (traffic, authority, top keywords)
- `semrush > organic_research` — Organic keyword positions, traffic value
- `semrush > backlink_research` — Backlink profile, referring domains, toxic links

Use Google Search Console (only if prospect is already a client with GSC access):
- `search_analytics` — Impressions, clicks, CTR, average position

Use WebFetch:
- Fetch the homepage and 2-3 key pages (about, services, contact)
- Check: page load indicators, mobile responsiveness meta tags, SSL, structured data, meta descriptions, H1 tags, image alt text, internal linking

#### 1B: GEO / AI Search Visibility Audit
Use WebSearch:
- Search ChatGPT-style queries relevant to their business and location
  - Example for a plumber in SSM: "best plumber in Sault Ste Marie", "emergency plumbing Sault Ste Marie", "[business name] reviews"
- Search 3-5 queries that a customer would ask an AI assistant
- Document: Do they appear? How are they described? Are competitors mentioned instead?

#### 1C: Local Competitor Detection
Use Semrush MCP tools:
- `semrush > organic_research` on the prospect domain to find competing domains
- Use WebSearch to search "[niche] in [city]" and "[niche] near [city]"
- Identify 2-3 direct local competitors
- Run `semrush > overview_research` on each competitor for comparison data

### Step 2: Analysis

Score the prospect across 8 dimensions. Use this exact scorecard:

```
DIGITAL PRESENCE SCORECARD — [Business Name]

Category                | Score (/10) | Notes
------------------------|-------------|------------------
Website Quality         |     /10     | Design, speed, mobile, UX
SEO Foundations         |     /10     | Keywords, meta, structure, backlinks
Content & Messaging     |     /10     | Copy quality, CTAs, value proposition
Local Presence          |     /10     | GBP, local keywords, directory listings
AI/LLM Visibility       |     /10     | How they appear in ChatGPT/AI search
Paid Advertising        |     /10     | Active campaigns, ad presence, or N/A
Automation & Systems    |     /10     | Email capture, CRM, follow-up sequences
Competitive Position    |     /10     | vs. local competitors identified above

OVERALL SCORE:            /80
```

**Scoring guide:**
- 1-3: Critical — not present or severely broken
- 4-5: Weak — exists but underperforming
- 6-7: Average — functional but has clear gaps
- 8-9: Strong — performing well, minor improvements possible
- 10: Excellent — industry-leading for their market

For each dimension, write:
- **What they're doing well** (be specific, cite evidence)
- **What's missing or broken** (be specific, cite evidence)
- **What GLV would do** (tie to a specific GLV service)

### Step 3: Recommendation Engine

**Reference:** `H:\Shared drives\GlvMarketingInternal\Business Development\markdown\Business Plan.md` — Section 3 (Services Offered) for all pricing and module details.

Based on the scorecard, recommend a combination of GLV's **base retainer + service modules**:

**Base Retainer (every client):** $750/month
Includes: Monthly strategy session, performance dashboard, account management, direct founder access

**Service Modules** (recommend based on audit findings):

| Module | Monthly | When to Recommend |
|--------|---------|-------------------|
| **SEO & GEO** | $1,500 - $2,500 | Weak organic presence, poor AI search visibility, local competitors ranking higher |
| **Paid Advertising** | $1,000 - $2,000 + ad spend | Need immediate leads/sales, competitors running ads, budget available |
| **Content Pipeline** | $800 - $1,500 | Thin/outdated site content, no blog, weak messaging |
| **Automation & Systems** | $1,000 - $1,500 | No email capture, no follow-up sequences, manual processes |
| **Website Maintenance** | $500 - $1,000 | Existing site that needs ongoing care |

**One-time projects** (recommend where relevant):
- Website Build: $3,500-$6,000 (if current site needs full rebuild)
- Ad Account Setup: $1,000-$1,500
- AI Automation Build: $1,500-$2,500

**AI Consulting** (for business owners who want to use AI themselves):
- AI Strategy Session: $500 (half-day)
- AI Implementation Package: $2,000-$4,000 (2-4 weeks)

**Entry point:** Always recommend the **Performance Pilot** (90-day trial):
- Setup fee: $750
- Monthly base: $750
- Commission: 10-15% of attributed revenue
- Minimum ad spend: $500/month (client funded)
- Converts to base retainer + modules at Day 90

**When building the recommendation:**
- Pick SPECIFIC dollar amounts based on the scope of work (not ranges)
- Calculate the total monthly cost for the client (base + modules)
- Show what they get for that price — tied directly to the audit findings
- Always include the Performance Pilot as the entry option
- Reference the Business Plan for exact pricing if in doubt

### Step 4: Generate Documents

Produce TWO files:

---

#### File 1: Client-Facing Proposal

**Filename:** `[business-name]-proposal.md`
**Tone:** Professional, educational, confident but not pushy. Canadian English. Show expertise without being condescending. This is a local business owner — speak plainly.

**Structure:**

```markdown
# Digital Marketing Proposal for [Business Name]

**Prepared by:** GLV Marketing
**Date:** [date]
**Prepared for:** [Contact name if known, otherwise business name]

---

## Your Digital Presence Today

[2-3 paragraph executive summary of their current state. Lead with something positive, then the gaps. Be specific — cite actual data from the audit.]

---

## Scorecard

[The 8-dimension scorecard from Step 2, formatted cleanly]

---

## What You're Doing Well

[Bullet points of genuine strengths found in the audit. Be specific.]

---

## Opportunities We've Identified

[Organized by priority. Each opportunity should include:
- What the issue is (plain language, no jargon)
- Why it matters (impact on their business)
- What the fix looks like]

---

## How Your Customers Find You Online

[GEO audit results. Show the actual AI search queries and whether/how they appeared. This is the "wow" section — most business owners have never seen this.]

---

## Your Local Competition

[Competitor comparison. Show where they're ahead and behind. Use specific metrics — traffic, keywords, backlinks.]

---

## What We'd Do For You

[Map their specific gaps to GLV services. This isn't a generic list — tie each recommendation directly to something found in the audit.]

### Month 1-3: [Recommended Stack Name]
[Specific deliverables, tied to their audit findings]

### Ongoing
[What the monthly relationship looks like]

---

## Investment

### Getting Started — Performance Pilot (90 Days)

[Specific pricing for this prospect. Include:]
- Setup fee
- Monthly retainer
- Performance commission structure
- Recommended ad budget
- What's included in the pilot

### After the Pilot
[Growth retainer pricing and what it unlocks]

### Payment Methods
- **E-transfer:** info@glvmarketing.ca
- **Direct Deposit:** Transit 40972 | Institution 002 | Account 0151319
- **Stripe Invoice:** Available on request (2.9% service fee applies)

---

## Why GLV Marketing

- Only agency in Sault Ste. Marie specialising in AI search optimisation (GEO)
- $15M+ in proven e-commerce revenue generation
- Performance-based pricing — we succeed when you succeed
- Local presence with modern technical capabilities
- Direct access to the founder — no account managers, no runaround

---

## Next Steps

1. [Simple, specific next action — e.g., "15-minute call to walk through this proposal"]
2. [What happens after they say yes — e.g., "We'll set up your Performance Pilot within 5 business days"]

**Aiden Glave**
GLV Marketing
705-975-0579
info@glvmarketing.ca
www.glvmarketing.ca
```

---

#### File 2: Internal Reference

**Filename:** `[business-name]-internal.md`
**Tone:** Direct, analytical, internal notes.

**Structure:**

```markdown
# [Business Name] — Internal Audit Notes

**Date:** [date]
**URL:** [website]
**Niche:** [business type]
**City:** [city]
**Contact:** [name if known]
**Proposal sent:** No

---

## Raw Audit Data

### Semrush Overview
[Paste key metrics: domain authority, organic traffic, top keywords, backlink count]

### Organic Keywords
[Top 10-20 keywords with position, volume, traffic]

### Backlink Profile
[Referring domains, top backlinks, toxic links if any]

### GEO Queries Tested
[Each query tested and the result — appeared/not appeared/competitor appeared instead]

### Competitor Comparison
| Metric | [Prospect] | [Competitor 1] | [Competitor 2] |
[Traffic, keywords, backlinks, domain authority]

---

## Scorecard Detail
[Full scorecard with detailed notes per dimension]

---

## Recommended Stack
[Stack letter and specific scope recommendation]

---

## Pricing Proposed
- Setup: $[X]
- Monthly: $[X]
- Commission: [X]%
- Ad budget recommendation: $[X]/month

---

## Notes
[Anything notable — red flags, opportunities, relationship context, how Aiden knows them, etc.]

---

## Follow-Up
- [ ] Send proposal
- [ ] Follow up call
- [ ] Pilot agreement signed
- [ ] Onboarding started
```

---

## File Locations

**Client-facing proposal:**
`H:\Shared drives\GlvMarketingInternal\Business Development\proposals\[business-name]\[business-name]-proposal.md`

**Internal reference:**
`H:\Shared drives\GlvMarketingInternal\Business Development\proposals\[business-name]\[business-name]-internal.md`

Create the `proposals\[business-name]\` directory if it doesn't exist.

---

## MCP Tools Used

| Tool | Purpose |
|------|---------|
| `semrush > overview_research` | Domain authority, traffic, top keywords |
| `semrush > organic_research` | Keyword positions and organic traffic value |
| `semrush > backlink_research` | Backlink profile and referring domains |
| `semrush > keyword_research` | Local keyword opportunities |
| `google-search-console > search_analytics` | Only if prospect has GSC access |
| `WebSearch` | GEO queries, local competitor discovery |
| `WebFetch` | Page content, technical checks |

---

## Autonomy

- **All research and document generation:** agent-autonomous
- **Sending the proposal to the client:** NEVER — Aiden reviews and sends manually
- **Pricing adjustments:** Agent recommends specific numbers based on scope, Aiden confirms before presenting

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Use marketing jargon in the client doc | Plain language — "how people find you on Google" not "SERP visibility" |
| Be vague about pricing | Pick specific numbers, not ranges |
| Trash their current website | Acknowledge what's working first, then show gaps |
| Promise specific results | Frame as "opportunity" and "what we'd focus on" |
| Copy-paste the same proposal for everyone | Every section must reference THIS business's actual data |
| Skip the GEO section | This is GLV's differentiator — always include it |
| Recommend every service | Only recommend what the audit actually supports |

---

## Related Skills

- `/seo-mastery` — Deep SEO knowledge for audit analysis
- `/brand-voice` — GLV's writing style for the proposal
- `/competitor-alternatives` — Competitive analysis framework
- `/research` — Deep dive protocol if more investigation needed

---

## Quality Checklist (Before Saving)

- [ ] Every scorecard rating is backed by specific evidence
- [ ] Client-facing doc has zero jargon a business owner wouldn't understand
- [ ] GEO section includes actual query results, not hypotheticals
- [ ] Competitor comparison uses real metrics, not guesses
- [ ] Pricing is specific (not ranges) and includes the Performance Pilot
- [ ] "What We'd Do" section maps directly to audit findings
- [ ] Canadian English throughout (colour, optimise, centre)
- [ ] Both files saved to correct Shared Drive location
- [ ] Internal file has raw data for future reference
