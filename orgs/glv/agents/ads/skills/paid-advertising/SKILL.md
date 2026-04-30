---
name: paid-advertising
description: Paid media strategy and optimization across platforms. Use when planning paid campaigns, optimizing ad performance, managing budgets, or setting up tracking for paid channels.
---

# Paid Advertising

Paid media strategy and optimization across platforms for profitable customer acquisition.

---

## Context Detection

Before planning, check for available client context. Use what exists — don't ask for what the research already provides.

**If a client is specified**, check `projects/<client>/` for:

| File | What It Provides | How It Changes Your Output |
|------|-----------------|---------------------------|
| `CONTEXT.md` | Client name, niche, location, ad accounts | Ground campaigns in real business context. |
| `strategy/marketing-director-plan.md` | Grand messages, small messages (avatar × funnel), idea bank with confidence scores, retargeting handoff chain, channel roles | **Primary source for ad copy and campaign structure.** Organise campaigns by Avatar × Funnel Stage (not random standalone). TOFU = impressions only (plant feeling). MOFU = retarget engaged. BOFU = conversion. Use idea bank concepts ranked by confidence. Follow the retargeting chain logic. |
| `brand/*-brand-identity.md` | Tone spectrum, personality, visual style, photography direction | **Ad creative direction pre-defined.** Ad copy matches tone spectrum. Visual style follows brand identity. |
| `brand/brand-package/` | Logos, colours, fonts | Use brand assets in ad creative. |
| `research/test-group-panel.md` + `research/avatars/*.md` | Avatar names, platform preferences, buyer types, pre-trigger psychology | **Targeting is avatar-driven.** Mike = Facebook. Karen = Google Search. Jen = Facebook + Google. Doug/Marc-Andre = NOT paid ad targets (walk-in buyers). Pre-trigger emotions drive TOFU creative. |
| `research/pillar-b-direct-competitors.md` | Competitor ad presence (or absence) | If no competitor runs ads = first-mover advantage. Zero competition on key terms. |
| `research/pillar-c-indirect-competitors.md` | Larger player ad strategies | Pull inspiration from indirect competitors when no local ads exist (e.g., MarineMax Florida for marine). |
| `research/pillar-f-supplier-brand-dynamics.md` | Co-op advertising budgets per manufacturer | **Co-op subsidises 50-70% of spend.** Mercury 50%, Cub Cadet 60-70%, Toro 50-70%. Factor into budget recommendations. |

**If no client context exists**, gather info from the user as normal.

**Precedence:** Director plan messages > brand identity tone > user instructions > skill defaults.

---

## Language & Quality Standards

**CRITICAL**: Respond in the same language the user is using. If Vietnamese, respond in Vietnamese. If Spanish, respond in Spanish.

**Standards**: Token efficiency, sacrifice grammar for concision, list unresolved questions at end.

---

## When to Use This Skill

Apply paid advertising expertise when:
- Planning paid campaign strategy
- Optimizing ad performance and ROAS
- Managing budgets across platforms
- Setting up tracking and attribution
- Creating ad copy and creative briefs
- Troubleshooting underperforming campaigns

## Core Concepts

### Campaign Objectives by Goal

| Objective | Use When | Primary KPI | Platform Features |
|-----------|----------|-------------|-------------------|
| Awareness | Building brand | CPM, Reach | Brand awareness, video views |
| Traffic | Driving site visits | CPC, CTR | Traffic campaigns |
| Engagement | Growing social | CPE, engagement rate | Engagement campaigns |
| Leads | Generating contacts | CPL, lead quality | Lead forms, conversions |
| Conversions | Driving sales | ROAS, CPA | Purchase, signup events |
| App Installs | Mobile acquisition | CPI, install rate | App campaigns |

### Funnel-Based Targeting Strategy

**TOFU (Awareness) - Cold Audiences**
- Broad interest targeting
- Lookalike audiences (1-3%)
- Video viewers (3s+)
- Content: Educational, entertaining
- Bid: CPM or ThruPlay

**MOFU (Consideration) - Warm Audiences**
- Website visitors (7-30 days)
- Email list matches
- Engaged social audiences
- Content: Case studies, comparisons
- Bid: Landing page views

**BOFU (Decision) - Hot Audiences**
- High-intent visitors (pricing, demo pages)
- Cart abandoners (1-7 days)
- Trial users, demo requesters
- Content: Offers, urgency, testimonials
- Bid: Conversions, ROAS

### Platform-Specific Guidelines

**Google Ads**
| Campaign Type | Best For | Key Settings |
|---------------|----------|--------------|
| Search | High intent, BOFU | Exact match, SKAG |
| Display | Awareness, retargeting | Placement exclusions |
| Shopping | E-commerce | Feed optimization |
| Performance Max | Full-funnel automation | Asset variety |
| YouTube | Awareness, TOFU | Audience targeting |

**Meta Ads (Facebook/Instagram)**
| Campaign Type | Best For | Key Settings |
|---------------|----------|--------------|
| Traffic | Website visits | Landing page optimization |
| Conversions | Sales, signups | Pixel setup, CAPI |
| Leads | B2B, services | Lead form optimization |
| Catalog Sales | E-commerce | Dynamic product ads |
| Advantage+ | Automation | Broad targeting |

**LinkedIn Ads**
| Campaign Type | Best For | Key Settings |
|---------------|----------|--------------|
| Sponsored Content | Awareness, leads | Job title targeting |
| Message Ads | Direct response | Personalization |
| Lead Gen Forms | B2B leads | Pre-filled forms |
| Document Ads | Thought leadership | Gated content |

### Key Metrics & Benchmarks

| Metric | Formula | Good Range | Action If Below |
|--------|---------|------------|-----------------|
| CTR | Clicks / Impressions | 1-3% | Improve creative/targeting |
| CPC | Spend / Clicks | <$1-5 (varies) | Improve quality score |
| CPL | Spend / Leads | <$20-100 | Optimize landing page |
| CPA | Spend / Conversions | < 1/3 LTV | Full funnel review |
| ROAS | Revenue / Ad Spend | 3:1+ | Improve AOV or CVR |
| CVR | Conversions / Clicks | 2-5% | Landing page optimization |

### Budget Allocation Framework

**70-20-10 Rule for Mature Programs**:
- 70% to proven, profitable campaigns
- 20% to optimization tests
- 10% to new channel/audience experiments

**Startup/Testing Phase**:
- Equal split across channels until data
- Minimum viable spend per test ($500-1000)
- 2 weeks minimum per test

## Best Practices

### Campaign Setup Excellence
1. **Pixel/Tracking First**: Never launch without proper tracking
2. **Exclusion Lists**: Exclude converters, competitors, irrelevant audiences
3. **Naming Conventions**: Consistent, searchable campaign names
4. **UTM Discipline**: Track all campaigns in analytics

### Creative Excellence
1. **Hook in 3 Seconds**: Capture attention immediately
2. **Mobile-First**: Design for mobile, adapt to desktop
3. **Test Variations**: 3-5 creatives per ad set minimum
4. **Refresh Regularly**: Combat creative fatigue

### Optimization Excellence
1. **Let Data Accumulate**: 50+ conversions before major changes
2. **One Variable at a Time**: Isolate what's working
3. **Weekly Review Cadence**: Regular but not daily changes
4. **Segment Performance**: Break down by audience, placement

## Agent Integration

| Agent | How They Use This Skill |
|-------|------------------------|
| `attraction-specialist` | Paid campaign strategy and setup |
| `copywriter` | Ad copy creation |
| `researcher` | Competitor ad analysis |
| `planner` | Budget allocation planning |

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | Do This Instead |
|--------------|----------------|-----------------|
| Launching without tracking | Can't measure success | Pixel first, always |
| Too broad targeting | Wasted spend | Start narrow, expand |
| One creative only | No learning, fatigue | Test 3-5 variations |
| Daily bid changes | Disrupts algorithm | Weekly optimization |
| Ignoring landing page | Blames ads for LP issues | Optimize full funnel |

## Platform-Specific Resources

- `references/meta-ads.md` - Facebook/Instagram advertising
- `references/google-ads.md` - Search and display
- `references/linkedin-ads.md` - B2B advertising
- `references/tiktok-ads.md` - TikTok advertising

## Related Commands

- `/content/ads` - Create ad copy for platforms
- `/analytics/roi` - Calculate campaign ROI
- `/campaign/plan` - Full campaign planning
