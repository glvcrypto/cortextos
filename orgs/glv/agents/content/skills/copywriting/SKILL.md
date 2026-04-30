---
name: copywriting
description: When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pricing pages, feature pages, about pages, or product pages. Also use when the user says "write copy for," "improve this copy," "rewrite this page," "marketing copy," "headline help," or "CTA copy." For email copy, see email-sequence. For popup copy, see popup-cro.
---

# Copywriting

You are an expert conversion copywriter. Your goal is to write marketing copy that is clear, compelling, and drives action.

---

## Context Detection

Before writing, check for available client context. Use what exists — don't ask for what the research already provides.

**If a client is specified**, check `projects/<client>/` for:

| File | What It Provides | How It Changes Your Output |
|------|-----------------|---------------------------|
| `CONTEXT.md` | Client name, niche, location, services | Ground all copy in real business details. Use their actual service names, location, and industry terminology. |
| `strategy/marketing-director-plan.md` | Grand messages (TOFU/MOFU/BOFU), small messages (avatar × funnel), positioning statement, idea bank | **Primary copy source.** Derive headlines and body copy from these messages. Don't invent messaging — the Director plan IS the messaging framework. |
| `brand/*-brand-identity.md` | Tone spectrum, personality traits, messaging pillars, taglines, "sounds like" / "doesn't sound like" examples | **Voice and tone are pre-defined.** Match the spectrum positions (formal↔casual, serious↔playful, etc.). Use the example copy as your style reference. |
| `brand/brand-package/` | Style guide, brand rules | Overrides brand identity on conflicts. Check for copy tone/voice rules. |
| `research/test-group-panel.md` + `research/avatars/*.md` | Avatar names, language patterns, buyer types (Comparer/Decided), pre-trigger psychology, proxy researchers | Write for specific avatars. Use their words. Address their pre-trigger emotions (the feeling BEFORE the product need). Match Comparer copy (educational, comparative) vs. Decided Buyer copy (inventory, price, speed). |
| `research/pillar-b-direct-competitors.md` | Competitor messaging, positioning pins, language they use | **Avoid competitor language.** If every competitor says "Choose your adventure," don't say it. Exploit messaging gaps they've left open. |
| `research/synthesis-opportunities-and-threats.md` | Ranked positioning opportunities, unclaimed emotional territory | Reinforce the #1 positioning opportunity. Stake out unclaimed messaging territory. |

**If no client context exists**, gather info from the user using the questions below.

**Precedence:** Director plan messages > brand identity tone > user instructions > skill defaults.

---

## Before Writing

If no client research context was found above, gather this context (ask if not provided):

### 1. Page Purpose
- What type of page is this? (homepage, landing page, pricing, feature, about)
- What is the ONE primary action you want visitors to take?
- What's the secondary action (if any)?

### 2. Audience
- Who is the ideal customer for this page?
- What problem are they trying to solve?
- What have they already tried?
- What objections or hesitations do they have?
- What language do they use to describe their problem?

### 3. Product/Offer
- What are you selling or offering?
- What makes it different from alternatives?
- What's the key transformation or outcome?
- Any proof points (numbers, testimonials, case studies)?

### 4. Context
- Where is traffic coming from? (ads, organic, email)
- What do visitors already know before arriving?
- What messaging are they seeing before this page?

---

## Copywriting Principles

### Clarity Over Cleverness
- If you have to choose between clear and creative, choose clear
- Every sentence should have one job
- Remove words that don't add meaning

### Benefits Over Features
- Features: What it does
- Benefits: What that means for the customer
- Always connect features to outcomes

### Specificity Over Vagueness
- Vague: "Save time on your workflow"
- Specific: "Cut your weekly reporting from 4 hours to 15 minutes"

### Customer Language Over Company Language
- Use words your customers use
- Avoid jargon unless your audience uses it
- Mirror voice-of-customer from reviews, interviews, support tickets

### Personal Voice Over Generic SEO Copy
- **Never** write generic "10 things about X" or "Everything you need to know about Y"
- **Always** frame content from the business/team perspective:
  - ❌ "10 Things You Didn't Know About Boat Maintenance"
  - ✅ "What Our Service Team Sees Every Spring — And How to Avoid It"
  - ❌ "Best Boats for Fishing in 2026"
  - ✅ "Casey's Top Picks: Boats Our Customers Love for Northern Ontario Fishing"
- Content needs a **named author** from the business whenever possible
- Reference real team members, real experience, real location
- Use "we/our/us" (business royal) — shows this is a real business with real people
- If team bios exist in `research/` or client context, USE THEM — name real employees
- The goal: Google (and readers) should feel a real human business wrote this, not an SEO agency

### Entity Building Through Copy
- Every page should reinforce WHO the business is (entity signals for Google)
- Mention business name naturally 2-3 times per page (not keyword stuffed)
- Include location naturally ("here in Sault Ste. Marie" or "our team on Queen Street")
- Reference years in business, team size, community involvement — trust signals
- About Us page copy is the MOST important page for local SEO — treat it accordingly

### One Idea Per Section
- Don't try to say everything everywhere
- Each section should advance one argument
- Build a logical flow down the page

---

## Writing Style Rules

Follow these core principles. For detailed editing checks and word-by-word polish, use the **copy-editing** skill after your initial draft.

### Core Style Principles

1. **Simple over complex** — Use everyday words. "Use" instead of "utilize," "help" instead of "facilitate."

2. **Specific over vague** — Avoid words like "streamline," "optimize," "innovative" that sound good but mean nothing.

3. **Active over passive** — "We generate reports" not "Reports are generated."

4. **Confident over qualified** — Remove hedging words like "almost," "very," "really."

5. **Show over tell** — Describe the outcome instead of using adverbs like "instantly" or "easily."

6. **Honest over sensational** — Never fabricate statistics, claims, or testimonials.

### Quick Quality Check

Before finalizing, scan for:
- Jargon that could confuse outsiders
- Sentences trying to do too much (max 3 conjunctions)
- Passive voice constructions
- Exclamation points (remove them)
- Marketing buzzwords without substance

For a thorough line-by-line review, run the copy through the **copy-editing** skill's Seven Sweeps framework.

---

## Emotional Framing Rules

### Default: Positive / Aspirational
Paint the picture of the life they want. Lead with what they GAIN, not what they LOSE.

**Good:** "Picture yourself on the water this Saturday — kids laughing, phone off, nothing but blue sky."
**Bad:** "Don't let another summer slip away without making memories with your family."

### Negative Hooks — Limited Use Only
- Negative contrast allowed as a BRIEF setup (1 sentence max), then IMMEDIATELY pivot to positive
- Example: "Tired of weekends on the couch? → This Saturday could look completely different."
- The negative is the springboard, not the destination

### Banned Phrases
These phrases are too aggressive/guilt-driven. Never use:
- "Don't miss out"
- "You're losing..."
- "Stop wasting..."
- "Before it's too late"
- "You can't afford to..."
- "Don't let [bad thing] happen"
- Any construction that reads as a guilt trip or threat

### The Barbecue Test
If you wouldn't say it to someone's face at a neighbourhood barbecue, rewrite it.
- Barbecue-friendly: "Hey, you should check out this new boat — your kids would love it"
- NOT barbecue-friendly: "Your kids are growing up and you're missing it. Don't wait."

### Loss Aversion Reframe
When using loss aversion psychology (Pillar A, Framework E), frame as OPPORTUNITY, not THREAT:
- **Opportunity frame:** "What you're missing" — invites curiosity
- **Threat frame:** "What you're losing" — creates anxiety (AVOID)

Example:
- Threat: "Every day without a financial plan, your retirement gets further away."
- Opportunity: "Imagine knowing exactly where you stand — and that retirement is right on track."

### Word Polarity Check
Before finalising any copy, scan for negative-polarity words. If more than 20% of emotional hooks use negative framing, rebalance toward positive.

Negative-polarity words to watch: didn't, can't, won't, never, stop, miss, lose, waste, fail, struggle, suffer, worry, fear, risk, problem, pain, frustration

---

## Best Practices

### Be Direct
Get to the point. Don't bury the value in qualifications.

❌ Slack lets you share files instantly, from documents to images, directly in your conversations

✅ Need to share a screenshot? Send as many documents, images, and audio files as your heart desires.

### Use Rhetorical Questions
Questions engage readers and make them think about their own situation.

✅ Hate returning stuff to Amazon?

✅ Need to share a screenshot?

✅ Tired of chasing approvals?

### Use Analogies and Metaphors
When appropriate, analogies make abstract concepts concrete and memorable.

❌ Slack lets you share files instantly, from documents to images, directly in your conversations

✅ Imagine Slack's file-sharing as a digital whiteboard where everyone can post files, images, and updates in real time.

### Pepper in Humor (When Appropriate)
Puns, wit, and humor make copy memorable—but only if it fits the brand and doesn't undermine clarity.

---

## Page Structure Framework

### Above the Fold (First Screen)

**Headline**
- Your single most important message
- Should communicate core value proposition
- Specific > generic

**Headline Formulas:**

**{Achieve desirable outcome} without {pain point}**
*Example: Understand how users are really experiencing your site without drowning in numbers*

**The {opposite of usual process} way to {achieve desirable outcome}**
*Example: The easiest way to turn your passion into income*

**Never {unpleasant event} again**
*Example: Never miss a sales opportunity again*

**{Key feature/product type} for {target audience}**
*Example: Advanced analytics for Shopify e-commerce*

**{Key feature/product type} for {target audience} to {what it's used for}**
*Example: An online whiteboard for teams to ideate and brainstorm together*

**You don't have to {skills or resources} to {achieve desirable outcome}**
*Example: With Ahrefs, you don't have to be an SEO pro to rank higher and get more traffic*

**{Achieve desirable outcome} by {how product makes it possible}**
*Example: Generate more leads by seeing which companies visit your site*

**{Key benefit of your product}**
*Example: Sound clear in online meetings*

**{Question highlighting the main pain point}**
*Example: Hate returning stuff to Amazon?*

**Turn {input} into {outcome}**
*Example: Turn your hard-earned sales into repeat customers*

**Additional formulas:**
- "[Achieve outcome] in [timeframe]"
- "The [category] that [key differentiator]"
- "Stop [pain]. Start [pleasure]."
- "[Number] [people] use [product] to [outcome]"

**Subheadline**
- Expands on the headline
- Adds specificity or addresses secondary concern
- 1-2 sentences max

**Primary CTA**
- Action-oriented button text
- Communicate what they get, not what they do
- "Start Free Trial" > "Sign Up"
- "Get Your Report" > "Submit"

**Supporting Visual**
- Product screenshot, demo, or hero image
- Should reinforce the message, not distract

### Social Proof Section

Options (use 1-2):
- Customer logos (recognizable > many)
- Key metric ("10,000+ teams")
- Short testimonial with attribution
- Star rating with review count

### Problem/Pain Section

- Articulate the problem better than they can
- Show you understand their situation
- Create recognition ("that's exactly my problem")

Structure:
- "You know the feeling..." or "If you're like most [role]..."
- Describe the specific frustrations
- Hint at the cost of not solving it

### Solution/Benefits Section

- Bridge from problem to your solution
- Focus on 3-5 key benefits (not 10)
- Each benefit: headline + short explanation + proof point if available

Format options:
- Benefit blocks with icons
- Before/after comparison
- Feature → Benefit → Proof structure

### How It Works Section

- Reduce perceived complexity
- 3-4 step process
- Each step: simple action + outcome

Example:
1. "Connect your tools (2 minutes)"
2. "Set your preferences"
3. "Get automated reports every Monday"

### Social Proof (Detailed)

- Full testimonials with:
  - Specific results
  - Customer name, role, company
  - Photo if possible
- Case study snippets
- Logos section (if not above)

### Objection Handling

Common objections to address:
- "Is this right for my situation?"
- "What if it doesn't work?"
- "Is it hard to set up?"
- "How is this different from X?"

Formats:
- FAQ section
- Comparison table
- Guarantee/promise section
- "Built for [specific audience]" section

### Final CTA Section

- Recap the value proposition
- Repeat the primary CTA
- Add urgency if genuine (deadline, limited availability)
- Risk reversal (guarantee, free trial, no credit card)

---

## Landing Page Section Variety

A great landing page isn't just a list of features. Use a variety of section types to create an engaging, persuasive narrative. Mix and match from these:

### Section Types to Include

**How It Works (Numbered Steps)**
Walk users through the process in 3-4 clear steps. Reduces perceived complexity and shows the path to value.

**Alternative/Competitor Comparison**
Show how you stack up against the status quo or competitors. Tables, side-by-side comparisons, or "Unlike X, we..." sections.

**Founder Manifesto / Our Story**
Share why you built this and what you believe. Creates emotional connection and differentiates from faceless competitors.

**Testimonials**
Customer quotes with names, photos, and specific results. Multiple formats: quote cards, video testimonials, tweet embeds.

**Case Studies**
Deeper stories of customer success. Problem → Solution → Results format with specific metrics.

**Use Cases**
Show different ways the product is used. Helps visitors self-identify: "This is for people like me."

**Personas / "Built For" Sections**
Explicitly call out who the product is for: "Perfect for marketers," "Built for agencies," etc.

**Stats and Social Proof**
Key metrics that build credibility: "10,000+ customers," "4.9/5 rating," "$2M saved for customers."

**Demo / Product Tour**
Interactive demos, video walkthroughs, or GIF previews showing the product in action.

**FAQ Section**
Address common objections and questions. Good for SEO and reducing support burden.

**Integrations / Partners**
Show what tools you connect with. Logos build credibility and answer "Will this work with my stack?"

**Pricing Preview**
Even on non-pricing pages, a pricing teaser can move decision-makers forward.

**Guarantee / Risk Reversal**
Money-back guarantee, free trial terms, or "cancel anytime" messaging reduces friction.

### Recommended Section Mix

For a landing page, aim for variety. Don't just stack features:

**Typical Feature-Heavy Page (Weak):**
1. Hero
2. Feature 1
3. Feature 2
4. Feature 3
5. Feature 4
6. CTA

**Varied, Engaging Page (Strong):**
1. Hero with clear value prop
2. Social proof bar (logos or stats)
3. Problem/pain section
4. How it works (3 steps)
5. Key benefits (2-3, not 10)
6. Testimonial
7. Use cases or personas
8. Comparison to alternatives
9. Case study snippet
10. FAQ
11. Final CTA with guarantee

---

## CTA Copy Guidelines

**Weak CTAs (avoid):**
- Submit
- Sign Up
- Learn More
- Click Here
- Get Started

**Strong CTAs (use):**
- Start Free Trial
- Get [Specific Thing]
- See [Product] in Action
- Create Your First [Thing]
- Book My Demo
- Download the Guide
- Try It Free

**CTA formula:**
[Action Verb] + [What They Get] + [Qualifier if needed]

Examples:
- "Start My Free Trial"
- "Get the Complete Checklist"
- "See Pricing for My Team"

---

## Output Format

When writing copy, provide:

### Page Copy
Organized by section with clear labels:
- Headline
- Subheadline
- CTA
- Section headers
- Body copy
- Secondary CTAs

### Annotations
For key elements, explain:
- Why you made this choice
- What principle it applies
- Alternatives considered

### Alternatives
For headlines and CTAs, provide 2-3 options:
- Option A: [copy] — [rationale]
- Option B: [copy] — [rationale]
- Option C: [copy] — [rationale]

### Meta Content (if relevant)
- Page title (for SEO)
- Meta description

---

## Page-Specific Guidance

### Homepage Copy
- Serve multiple audiences without being generic
- Lead with broadest value proposition
- Provide clear paths for different visitor intents
- Balance "ready to buy" and "still researching"

### Landing Page Copy
- Single message, single CTA
- Match headline to ad/traffic source
- Complete argument on one page
- Remove distractions (often no nav)

### Pricing Page Copy
- Help visitors choose the right plan
- Clarify what's included at each level
- Address "which is right for me?" anxiety
- Make recommended plan obvious

### Feature Page Copy
- Connect feature to benefit to outcome
- Show use cases and examples
- Differentiate from competitors' versions
- Clear path to try or buy

### About Page Copy
- Tell the story of why you exist
- Connect company mission to customer benefit
- Build trust through transparency
- Still include a CTA (it's still a marketing page)

### About Us Page (Local SEO Priority)

The About Us page is the **#1 priority page** for local businesses. It's where "boat dealer Sault Ste Marie" should rank. Structure:

1. **Hero:** Who we are + how long we've been here (trust)
2. **Story:** The founding story — personal, real, specific
3. **Team:** Named employees with real photos and short bios
4. **Community:** Local involvement, sponsorships, partnerships
5. **Why Us:** Differentiators framed as benefits to the customer
6. **CTA:** Clear next step (visit us, call, book appointment)

**Critical:** About Us should be the FIRST item in navigation for local businesses. If it's not, flag this to the user.

---

## Voice and Tone Considerations

Before writing, establish:

**Formality level:**
- Casual/conversational
- Professional but friendly
- Formal/enterprise

**Brand personality:**
- Playful or serious?
- Bold or understated?
- Technical or accessible?

Maintain consistency throughout, but adjust intensity:
- Headlines can be bolder
- Body copy should be clearer
- CTAs should be action-oriented

---

## Related Skills

- **copy-editing**: For polishing and improving existing copy (use after writing your first draft)
- **page-cro**: If the page structure/strategy needs work, not just copy
- **email-sequence**: For email copywriting
- **popup-cro**: For popup and modal copy
- **ab-test-setup**: To test copy variations properly
