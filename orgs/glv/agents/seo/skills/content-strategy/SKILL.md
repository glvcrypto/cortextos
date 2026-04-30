---
name: content-strategy
description: Content planning, creation, and distribution strategy. Use when planning content calendars, developing content pillars, creating editorial strategies, or optimizing content for different funnel stages.
---

# Content Strategy

Content planning, creation, and distribution for sustainable organic growth.

---

## Context Detection

Before planning, check for available client context. Use what exists — don't ask for what the research already provides.

**If a client is specified**, check `projects/<client>/` for:

| File | What It Provides | How It Changes Your Output |
|------|-----------------|---------------------------|
| `CONTEXT.md` | Client name, niche, location, services | Ground content strategy in real business context. |
| `strategy/marketing-director-plan.md` | Grand messages (TOFU/MOFU/BOFU), small messages (avatar × funnel), content distribution chain, channel roles | **Primary source for content pillars.** Content pillars map to grand messages. Funnel-stage mapping comes from Director plan. Distribution chain defines how content flows (blog → email → social → ads retarget). |
| `brand/*-brand-identity.md` | Tone spectrum, personality, messaging pillars | **Content voice is pre-defined.** All content follows the brand personality and tone spectrum. |
| `research/test-group-panel.md` + `research/avatars/*.md` | Avatar names, content consumption habits, buyer types, discovery channels | **Content targets specific avatars.** Comparers need educational content. Decided Buyers need product/inventory content. Map content types to avatar preferences (Mike = YouTube reviews, Jen = Facebook groups + Pinterest, Ryan = forums). |
| `research/pillar-b-direct-competitors.md` | Competitor content presence, gaps | Content differentiation — what topics competitors cover vs. what they miss. |
| `research/pillar-g-local-media-community.md` | Local events, organisations, media outlets | **Local content goldmine.** Community events, fishing reports, seasonal guides, partner features. |
| `seo/keyword-research/*-full-keyword-research.md` | Keywords, clusters, search volume, difficulty | **SEO-driven topic selection.** Map keywords to content pieces. Prioritise by local tier (city → region → province → national). |

**If no client context exists**, gather info from the user as normal.

**Precedence:** Director plan content distribution chain > keyword research > brand identity tone > user instructions > skill defaults.

---

## Language & Quality Standards

**CRITICAL**: Respond in the same language the user is using. If Vietnamese, respond in Vietnamese. If Spanish, respond in Spanish.

**Standards**: Token efficiency, sacrifice grammar for concision, list unresolved questions at end.

---

## When to Use This Skill

Apply content strategy expertise when:
- Planning content calendars and editorial workflows
- Developing content pillars and themes
- Creating distribution strategies
- Mapping content to funnel stages
- Repurposing content across channels
- Measuring content performance

## Core Concepts

### Content Pillars

Content pillars are the main themes your content revolves around.

**Criteria for Strong Pillars**:
- Aligned with business goals
- Relevant to audience pain points
- Differentiates from competitors
- Sustainable long-term (evergreen potential)
- SEO opportunity (search volume)

**Example Pillar Structure**:
| Pillar | Purpose | Content Types |
|--------|---------|---------------|
| Industry Insights | Thought leadership | Reports, trends, analysis |
| How-To/Tutorials | Education | Guides, videos, templates |
| Customer Success | Social proof | Case studies, testimonials |
| Product Updates | Awareness | Release notes, feature deep-dives |
| Company Culture | Employer brand | Behind-scenes, team stories |

### Content by Funnel Stage

| Stage | Goal | Content Type | Format | CTA |
|-------|------|--------------|--------|-----|
| TOFU (Awareness) | Attract | Blog posts, social, video | Short, shareable | Subscribe, Follow |
| MOFU (Consideration) | Educate | Ebooks, webinars, guides | In-depth, gated | Download, Register |
| BOFU (Decision) | Convert | Case studies, demos, comparisons | Specific, proof-heavy | Trial, Demo, Buy |
| Retention | Retain | Tutorials, community, newsletters | Ongoing value | Upgrade, Refer |

### Content Mix Framework

**70-20-10 Rule**:
- 70% proven content (what works, repeat it)
- 20% iterative improvements (variations on winners)
- 10% experimental (new formats, topics, channels)

**Content Type Mix**:
- 40% Educational (builds trust)
- 30% Engaging (builds community)
- 20% Inspirational (builds connection)
- 10% Promotional (drives action)

### Content Calendar Structure

**Weekly Cadence Example**:
| Day | Primary Channel | Content Type | Goal |
|-----|-----------------|--------------|------|
| Monday | Blog | Educational | SEO traffic |
| Tuesday | LinkedIn | Thought leadership | B2B engagement |
| Wednesday | Email | Nurture | Subscriber retention |
| Thursday | Social | Community | Engagement |
| Friday | Video | Educational | Multi-channel |

### Content Repurposing Matrix

| Original | → Blog Post | → Social | → Email | → Video |
|----------|-------------|----------|---------|---------|
| Webinar | Recap post | Key quotes | Summary | Clips |
| Case Study | Detailed post | Stats carousel | Teaser | Interview |
| Research Report | Analysis post | Data graphics | Key findings | Explainer |
| Podcast | Transcript post | Audiograms | Highlights | Video version |

## Best Practices

### Planning Excellence
1. **Audience-First**: Research pain points before creating
2. **Keyword Integration**: SEO considerations in topic selection
3. **Competitive Gap**: What are competitors NOT covering?
4. **Resource Reality**: Plan for actual capacity, not aspirations

### Creation Excellence
1. **Hook First**: Lead with value, not background
2. **Scannable Format**: Headers, bullets, visuals
3. **One CTA per Piece**: Clear next step
4. **Evergreen Priority**: Maximize content lifespan

### Distribution Excellence
1. **Channel-Native**: Adapt format per platform
2. **Timing Optimization**: Post when audience is active
3. **Promotion Balance**: 20% creation, 80% promotion
4. **Amplification Partners**: Influencers, communities, syndication

## Agent Integration

| Agent | How They Use This Skill |
|-------|------------------------|
| `planner` | Building content calendars and editorial plans |
| `copywriter` | Creating content aligned with strategy |
| `attraction-specialist` | SEO-optimized content creation |
| `email-wizard` | Email content aligned with nurture goals |

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | Do This Instead |
|--------------|----------------|-----------------|
| Creating without strategy | Random content, no compounding | Define pillars first |
| All BOFU content | Ignores 97% not ready to buy | Full-funnel approach |
| Publish and forget | Wastes content investment | Promote and repurpose |
| Quantity over quality | Dilutes brand, wastes resources | Better content, less often |
| Ignoring data | Repeating what doesn't work | Analyze and iterate |

## Content Performance Metrics

| Stage | Key Metrics | Good Benchmark |
|-------|-------------|----------------|
| TOFU | Traffic, reach, impressions | +10% MoM growth |
| MOFU | Downloads, signups, engagement | 2-5% conversion |
| BOFU | Demos, trials, influenced revenue | 10-20% of pipeline |
| Overall | Content ROI, CAC impact | 3:1 return |

## Related Commands

- `/campaign/calendar` - Generate content calendar
- `/content/blog` - Create SEO-optimized blog post
- `/content/social` - Create platform-specific social content

## References

- `references/content-pillars.md` - Building pillar strategy
- `references/editorial-calendar.md` - Calendar planning
- `references/repurposing.md` - Content multiplication
- `references/distribution.md` - Amplification strategies
