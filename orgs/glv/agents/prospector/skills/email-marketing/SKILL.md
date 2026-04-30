---
name: email-marketing
description: Email campaign strategy, automation, and optimization. Use when creating email sequences, improving deliverability, designing automation workflows, or optimizing email performance.
---

# Email Marketing

Email campaign strategy, automation, and optimization for engagement and conversion.

---

## Context Detection

Before planning, check for available client context. Use what exists — don't ask for what the research already provides.

**If a client is specified**, check `projects/<client>/` for:

| File | What It Provides | How It Changes Your Output |
|------|-----------------|---------------------------|
| `CONTEXT.md` | Client name, niche, location, email platform (e.g., MailerLite) | Ground all email strategy in their actual business and tools. |
| `strategy/marketing-director-plan.md` | Grand messages (TOFU/MOFU/BOFU), small messages (avatar × funnel), channel roles, timing/sync rules | **Primary source for email themes and sequence content.** Welcome flow uses grand TOFU message. Nurture sequences use small messages per avatar tag. Sync rules define when email fires relative to ads/social. |
| `brand/*-brand-identity.md` | Tone spectrum, personality traits, "sounds like" / "doesn't sound like" examples | **Email voice is pre-defined.** Match tone spectrum. Subject lines and body copy follow the brand personality. |
| `brand/brand-package/` | Style guide, brand rules | Overrides brand identity on conflicts. Check for email template design rules. |
| `research/test-group-panel.md` + `research/avatars/*.md` | Avatar names, email behaviour, buyer types, proxy researchers | **Segment-specific content.** Welcome Email 1 = CEO origin story. Email 2 = directory self-selection (tag-based routing into avatar-specific flows). Address proxy researchers (e.g., daughter researching for father). |
| `research/pillar-b-direct-competitors.md` | Competitor email presence (or lack thereof) | Exploit gaps — if no competitor does email well, first-mover advantage. |
| `research/pillar-g-local-media-community.md` | Community events, local content | Email content ideas — event invitations, seasonal tips, local fishing reports. |

**If no client context exists**, gather info from the user as normal.

**Precedence:** Director plan messages > brand identity tone > user instructions > skill defaults.

---

## Language & Quality Standards

**CRITICAL**: Respond in the same language the user is using. If Vietnamese, respond in Vietnamese. If Spanish, respond in Spanish.

**Standards**: Token efficiency, sacrifice grammar for concision, list unresolved questions at end.

---

## When to Use This Skill

Apply email expertise when:
- Creating email sequences and automations
- Improving deliverability and inbox placement
- Optimizing open rates and click rates
- Designing lifecycle email workflows
- Segmenting audiences for personalization
- A/B testing email elements

## Core Concepts

### Email Types & Timing

| Type | Purpose | Timing | Frequency |
|------|---------|--------|-----------|
| Welcome | Onboard new subscribers | Immediate (<5 min) | Once |
| Nurture | Build trust over time | Drip sequence | 1-2x/week |
| Promotional | Drive sales/signups | Campaign-based | 1-4x/month |
| Transactional | Confirm actions | Triggered | As needed |
| Re-engagement | Win back inactive | 30-90 days inactive | Once per cycle |

### Email Performance Benchmarks

| Metric | Acceptable | Good | Excellent |
|--------|------------|------|-----------|
| Open Rate | 15-20% | 20-25% | 25%+ |
| Click Rate | 1-2% | 2-5% | 5%+ |
| Click-to-Open | 10-15% | 15-20% | 20%+ |
| Unsubscribe | <1% | <0.5% | <0.2% |
| Bounce Rate | <5% | <2% | <0.5% |
| Spam Complaint | <0.1% | <0.05% | <0.01% |

### Email Anatomy

```
From: [Name] from [Brand] <email@domain.com>
Subject: [Hook + Benefit] (50 chars optimal)
Preview: [Extends subject curiosity] (90-100 chars)

[Personalized greeting]
[Hook - address pain/desire in first line]
[Value delivery - main content]
[Social proof - testimonial/stat - optional]
[Single CTA button - clear action]
[P.S. - additional hook or urgency]

[Signature with human touch]
```

### Subject Line Formulas

| Formula | Example | Best For |
|---------|---------|----------|
| Question | "Still struggling with [pain]?" | Engagement |
| How-to | "How to [achieve outcome] in [time]" | Education |
| Curiosity | "[X] thing [audience] forget about [topic]" | Opens |
| Social Proof | "How [customer] got [result]" | Conversion |
| Urgency | "[X] hours left: [offer]" | Promotions |
| Personal | "{{first_name}}, quick question" | Response |

### Sequence Framework

**Welcome Sequence (7 days, 5 emails)**:
1. Day 0: Welcome + deliver lead magnet
2. Day 1: Quick win / immediate value
3. Day 3: Brand story / why we exist
4. Day 5: Social proof / case study
5. Day 7: Engagement check / preferences

**Nurture Sequence (6 weeks)**:
1. Week 1-2: Problem awareness
2. Week 3-4: Solution education
3. Week 5-6: Product introduction + offer

### Segmentation Strategy

| Segment Type | Criteria | Use For |
|--------------|----------|---------|
| Engagement | Open/click behavior | Re-engagement targeting |
| Interest | Content consumed | Topic personalization |
| Lifecycle | Lead stage | Funnel-appropriate content |
| Demographic | Role, company size | Message customization |
| Behavioral | Website actions | Trigger-based emails |

## Best Practices

### Deliverability Excellence
1. **Warm Up New Domains**: Gradual volume increase
2. **Authentication**: SPF, DKIM, DMARC properly configured
3. **List Hygiene**: Remove bounces and inactive regularly
4. **Engagement Signals**: Encourage replies, adds to contacts

### Copy Excellence
1. **Mobile First**: 60%+ read on mobile
2. **Scannable**: Short paragraphs, bullets, bold
3. **One CTA**: Don't compete with yourself
4. **Personal Tone**: Write to one person, not a list

### Testing Excellence
1. **Subject Lines**: Always A/B test
2. **Send Times**: Find optimal windows per segment
3. **Content Length**: Test short vs. long
4. **CTA Buttons**: Text, color, placement

## Agent Integration

| Agent | How They Use This Skill |
|-------|------------------------|
| `email-wizard` | Sequence design, automation setup |
| `copywriter` | Email copy creation |
| `lead-qualifier` | Segmentation criteria, triggers |
| `continuity-specialist` | Re-engagement strategies |

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | Do This Instead |
|--------------|----------------|-----------------|
| Buying email lists | Destroys deliverability | Build organic list |
| No segmentation | Irrelevant content = unsubscribes | Segment by behavior |
| Too many CTAs | Confuses reader, dilutes clicks | One primary CTA |
| No unsubscribe | Illegal + spam complaints | Clear, easy unsubscribe |
| Batch and blast | No personalization | Behavior-triggered emails |

## Workflow Integration

- `crm-workflow.md` - Lead lifecycle stages, MQL/SQL definitions
- `sales-workflow.md` - Lead scoring thresholds for email triggers

## Related Commands

- `/sequence/welcome` - 7-day welcome sequence
- `/sequence/nurture` - 6-week lead nurture
- `/sequence/re-engage` - 21-day win-back
- `/content/email` - Email copy creation

## References

- `references/sequence-design.md` - Email sequence blueprints
- `references/deliverability.md` - Getting to inbox
- `references/segmentation.md` - Audience segmentation
- `references/automation.md` - Automation workflows
- `references/lead-nurturing-workflows.md` - Lead nurturing sequences
