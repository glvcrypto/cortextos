---
name: outreach-variants
description: Hook and structure variant library for GLV cold outreach emails. Built from Hormozi/Voss/Enns frameworks. Positive emotional levers only — no fear, no negativity. Reference when drafting or experimenting with outreach copy.
---

# Outreach Variant Library

> Built from: Alex Hormozi (value equation, earned trust), Chris Voss (tactical empathy, labeling), Blair Enns (specialist positioning, diagnostic framing).
> Rule: Positive emotional levers only. No fear. No shame. No scare stats.

## Structure Availability

| Structure | Status | Reason |
|-----------|--------|--------|
| S1 | READY | No case study dependency |
| S2 | GATED | Requires real case study — pending boss clearance |
| S3 | GATED | Requires real case study — pending boss clearance |
| S4 | READY | No case study dependency |
| S5 | READY | No case study dependency |

S2 and S3 reference "[similar operator]" case studies. Only use once boss has cleared specific case material. Do not substitute fictional operators.

---

## Emotional Levers (Allowed)

| Lever | Description | Use When |
|-------|-------------|----------|
| Curiosity | "I noticed something..." | You have a specific finding from their dossier |
| Aspiration | "Operators who solve this..." | They're clearly trying to grow but hitting a ceiling |
| Pride | "Reputation you've built..." | Long-standing business, strong reviews, local standing |
| Validation | "You're not alone in..." | Industry-wide constraint, not their failure |
| Opportunity | "This is the moment to..." | Seasonal window, market gap, competitor weakness |

## Banned (Never Use)

- Fear of decline, threats, "if you don't act..."
- Shame: "your site is terrible", "you're losing clients"
- Scare stats: "X% of businesses fail without marketing"
- Manufactured urgency: "limited time", "others are moving fast"
- Starting with "Your problem is..."

---

## Anti-AI Rules (NON-NEGOTIABLE)

### The Tim Hortons Test
Read every sentence out loud. Would Aiden actually say this if he bumped into the owner in a parking lot? If it sounds written, not spoken, cut it or rewrite it. This is the single most important filter.

### Target Length
**100-150 words.** Not 250. Shorter forces one clear point. AI patterns hide in length.

### Banned AI Phrases (auto-fail — rewrite every one)

| Phrase | Replace With |
|--------|-------------|
| "What I've found working with..." | Just state the observation directly |
| "Here's the opportunity I wanted to flag..." | Just flag it |
| "That kind of recognition tells me..." | Cut entirely |
| "Imagine if every one of those people..." | Too polished, cut |
| "I work specifically with trades businesses at the point where..." | Shorten and direct |
| "Instead of a proposal/pitch..." | Never say this — just don't pitch |
| "Can I ask you three quick questions..." | Say "Can I ask you one thing?" or just ask the question |
| "Fifteen minutes and I can tell you exactly..." | Too salesy |
| "What does the next version of this look like..." | Cut |
| Any sentence over 15 words | Break it in two or cut it |
| Two consecutive sentences starting with "I" | Rewrite one |
| Rhetorical questions stacked together | Max one per email |

### Em-Dash Check (hard block)
Before saving any draft, run: `grep -c " -- \| — " draft.md`
If count > 0, the draft fails. Rewrite with commas or periods.

### No Jargon Rule (hard block)
Tradesmen don't know marketing terms. Never use industry jargon in outreach copy.

| Banned Term | Replace With |
|-------------|-------------|
| "Local 3-Pack" | "first results on Google" or "top of Google Maps" |
| "NAP" | "your business info" or "your address and phone" |
| "Local SEO" | "showing up on Google" |
| "Google Business Profile" / "GBP" | "your Google listing" |
| "organic traffic" | "people finding you on Google" |
| "domain authority" | cut entirely |
| "keyword ranking" | "showing up when someone searches for X" |
| "on-page SEO" | cut entirely |
| "backlinks" | cut entirely |
| "SERP" | cut entirely |

Test: Would a 55-year-old plumber know this word without Googling it? If no, rewrite.

### Voice Calibration
The email should sound like Aiden wrote it in 10 minutes, not like someone spent an hour crafting it. Aiden is direct. He gets to the point. He doesn't explain his framework. He says what he noticed and why he's reaching out. That's it.

---

## Hook Variants

### H1: Pride-Hook (Local Hero)

**Best for:** Long-standing businesses, strong local reputation, family businesses

**Template:**
`I noticed [specific business detail: tenure, reputation, service area]. Not many outfits in [region] manage [specific thing they do well] the way you do. I've been researching operators like you because...`

**Example:**
"I noticed Johnson Plumbing has been the go-to in Sault Ste. Marie for emergency callouts since 2008. Not many shops handle both residential and commercial the way you do."

**What it triggers:** Pride, identity validation. They feel recognized, not sold to.

---

### H2: Curiosity-Hook (Specific Observation)

**Best for:** When dossier has a clear, specific finding about their setup

**Template:**
`I was looking at how [region] [trade] handle [specific challenge], and I noticed something about how you're set up. Curious whether you've thought about [specific angle].`

**Example:**
"I was researching how rural HVAC shops in Northern Ontario manage seasonal demand swings, and I noticed something interesting about the way you're staffed year-round."

**What it triggers:** Curiosity, reciprocal engagement. They want to know what you noticed.

---

### H3: Aspiration-Hook (Growth Without Burnout)

**Best for:** Businesses with visible growth signals but operational constraints

**Template:**
`Most [trade] operators in [region] are stuck doing what works, not what's possible. I work with [trade] who want to [growth goal] without [specific cost: burnout, price cutting, losing quality]. Wondering if that's on your radar.`

**Example:**
"Most residential contractors in Northern Ontario are stuck doing what works, not what's possible. I work with contractors who want to grow from 3 crews to 5 without burning out their people or cutting rates."

**What it triggers:** Aspiration, recognition of unspoken tension. Positions growth as achievable.

---

### H4: Validation-Hook (You're Not Alone)

**Best for:** Industry-wide constraints, seasonal businesses, rural operators

**Template:**
`I work with a lot of [trade] in [region], and nearly all of them say the same thing: [specific shared frustration]. What I've found is that [similar operators] solved this by...`

**Example:**
"I work with a lot of golf course operators in Northern Ontario, and nearly all of them say the same thing: summer is boom-or-bust and you can't plan crew work year-round."

**What it triggers:** Validation, belonging. They feel understood, not diagnosed.

---

### H5: Opportunity-Hook (Seasonal/Market Window)

**Best for:** When timing is genuinely relevant (spring, pre-season, market gap)

**Template:**
`[Seasonal/market window]. Most [trade] in [region] aren't positioned for this right now, but a few are. Quick thought on whether you'd want to be in that group.`

**Example:**
"Spring is when your phone goes crazy, and most plumbers can't hire fast enough to handle the spike. A few are using this as a positioning play instead of just a scramble."

**What it triggers:** Opportunity FOMO (not fear FOMO). Feels like an invitation, not a warning.

---

## Structure Variants

### S1: Hook > Validation > Opportunity > Diagnostic CTA

**Flow:** Observation -> Validate their situation -> Paint the opportunity -> Ask diagnostic question

```
[H1-H5 hook]

[Validation] It sounds like [their shared situation]. Most [trade] are dealing with [constraint]. You're not seeing something wrong — that's what's normal in your market.

[Opportunity] What I've found is that [similar operators] who [specific action] managed to [outcome: growth, stability, better margins].

[Credibility] Working with [X] operators in [region], I've seen this pattern pretty consistently.

[CTA] Can I ask you three quick questions about how you're thinking about [specific challenge]?
```

**Experimental tag:** `structure_variant: "validate-opportunity-diagnostic"`

---

### S2: Pride-Hook > Specific Insight > Small Offer > Soft CTA

**Flow:** Acknowledge reputation -> Introduce small insight -> Lead with tiny offer (not a call)

```
[H1 pride hook]

[Why you're reaching out] I'm reaching out because [trade] operators who take pride in their work are the ones actually solving this.

[Small offer] I put together a quick one-pager on how [similar operator] organized [specific process]. Took them 30 days to implement and [specific outcome]. Happy to send it over.

[CTA] Does that sound worth a look?
```

**Experimental tag:** `structure_variant: "pride-insight-offer"`

---

### S3: Aspiration > Constraint Reframe > Micro-Commitment

**Flow:** Aspirational opening -> Name the real constraint -> Reframe as opportunity -> Ask micro-commitment (not a meeting)

```
[H3 aspiration hook]

[Real constraint] The thing that gets in the way is usually [specific bottleneck]. That's the honest constraint, not lack of work.

[Reframe] But that same constraint is actually an advantage. Operators who solve it early end up with [better margins / steadier crew / more predictable revenue].

[CTA] I have a 10-minute breakdown of how [similar operator] organized [specific solution]. Worth sharing?
```

**Experimental tag:** `structure_variant: "aspiration-reframe-microcommit"`

---

### S4: Diagnostic > Insight > Positioning > Conversation CTA

**Flow:** Open with genuine question -> Insight from their sector -> Specialist positioning -> Invite conversation (not pitch)

```
[Question hook about their thinking]

[Sector insight] Here's what I've noticed working with [trade] in [region]: most are managing [challenge] the way it's been done for 10 years, not the way it works best now.

[Specialist positioning] I work specifically with [narrow description] because the solutions that work in [region] are different from what works in urban markets.

[CTA] Instead of a pitch, I'd just like to understand your thinking on [specific question]. Worth a quick chat?
```

**Experimental tag:** `structure_variant: "diagnostic-specialist-conversation"`

---

## CTA Rules

Always use low-commitment CTAs. Never "schedule a call" as the opening ask.

**Good:**
- "Can I ask you...?"
- "Worth a look?"
- "Does that sound interesting?"
- "Worth a quick chat?"
- "Happy to send it over."

**Bad:**
- "Book a 30-minute call" (opening ask — too much)
- "Let's set up a meeting"
- "Schedule a demo"

The booking link still goes in the WHAT section — but after they've shown interest, not as the first ask.

---

## Hormozi / Voss / Enns Principles (Quick Reference)

**Hormozi:** Lead with the dream outcome, not the product. Show value before asking for anything. Minimize perceived effort in the CTA.

**Voss:** Label their situation ("It sounds like...") before offering. Tactical empathy disarms defensiveness. Accusation audit: acknowledge their skepticism first ("You probably get emails like this...").

**Enns:** Position as narrow specialist, not generalist vendor. Invite diagnosis, not pitch. "I work specifically with X" signals expertise. Diagnostic CTA is a power move — it shifts who's qualifying whom.

---

## Experiment Tagging Reference

Every email drafted must carry these tags in the event metadata:

| Field | Values |
|-------|--------|
| `hook_variant` | H1-pride, H2-curiosity, H3-aspiration, H4-validation, H5-opportunity |
| `structure_variant` | S1-validate-opportunity-diagnostic, S2-pride-insight-offer, S3-aspiration-reframe-microcommit, S4-diagnostic-specialist-conversation |

After 20+ sends per (hook x structure) cell, analyst will report which combos drive the most booked meetings.
