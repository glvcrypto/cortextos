# Daily Scan + GBP Follow-up — 2026-05-17

Prepared by scout for AM brief. Two deliverables combined.

---

## Part 1: Daily Ecosystem Scan

**Coverage:** Anthropic / Claude / Claude Code / agentic AI / local SEO / marketing automation / Remotion
**Period:** Since May 14-16 2026

---

- **[Anthropic] Claude Opus 4.7 released** — Ships at same price as Opus 4.6 ($5/$25 per M tokens in/out), positioned specifically for complex long-running software engineering tasks with built-in output self-verification. GLV: cortextOS heavy dev tasks can use a more reliable model at no cost increase.

- **[Anthropic] Agent SDK billing split — effective June 15** — Claude Code, the Agent SDK, GitHub Actions, and `claude-p` usage are being carved out of the main subscription pool into a separate "Agent SDK Credit" bucket. GLV: scout, analyst, and all cortextOS agents will draw from a new credit pool starting June 15 — worth reviewing usage before then to avoid bill surprises.

- **[Anthropic] "Dreaming" launched for Managed Agents** — Anthropic's hosted agents now run an overnight scheduled process that reviews past sessions, extracts patterns, and writes plain-text playbooks future sessions reference. Harvey reported 6x task completion rate improvement. GLV: cortextOS's memory layer is already doing the manual version of this. Validates the architecture and signals where Anthropic's hosted product is heading.

- **[Claude Code] Plugin dependency enforcement + cost estimates** — `claude plugin disable` now refuses if another plugin depends on the target and shows the full dependency chain. The marketplace browse pane now shows per-turn and per-invocation token cost estimates before enabling a plugin. GLV: better right-sizing of cortextOS tool selections without waiting for billing surprises.

- **[Claude Code] Agent view + background session improvements** — Claude Code ships a persistent agent view (`claude agents` or left-arrow) for monitoring multiple background sessions at a glance. Background sessions preserve model and effort level set before going idle. GLV: directly useful for supervising multi-agent cortextOS orchestration from a single terminal.

- **[Local SEO / GBP] Engagement signals now outweigh brand size in local ranking** — Google's 2026 algorithm weights interaction signals (photo views, Q&A clicks, review reads, direction requests) more heavily than brand prominence. Profiles inactive for 30+ days are seeing measurable GBP impression drops. GLV: the agent-driven GBP post + photo cadence is now a direct ranking factor — makes this workflow more defensible as a retainer line item.

- **[Local SEO / GBP] Gemini reads business descriptions to answer queries** — Google runs GBP business descriptions through Gemini to answer user queries in AI Overviews. Descriptions need to be written as answers to the top 5 customer questions rather than keyword-stuffed copy. GLV: GBP copy audits should be standard in the local SEO retainer — old keyword-density approach is being actively superseded.

- **[Marketing automation] Gartner: AI automation of marketing work to double by 2028** — Survey (May 11): marketing leaders expect AI-driven automation to jump from 16% to 36% of marketing work by 2028, with widening gap between agencies testing vs. deploying. GLV: clean third-party stat to anchor client conversations — "AI-first agency" is early-majority positioning, not experimental.

- **[Agentic AI] Notion External Agent API + Workers launched (May 13)** — External agents can now read and write Notion databases and trigger multi-step workflows. Custom code deployable as Workers inside Notion. GLV: opens a path for cortextOS agents to write task/project updates directly into client Notion workspaces without manual export.

- **[Remotion] `<HtmlInCanvas>` component added (v4.0.455, May 1)** — Enables HTML content rendered directly inside canvas-based compositions, plus HTML-in-canvas transitions. Patch releases through May 15 address audio strict-mode bugs and compositor process cleanup. GLV: richer text and DOM-based overlays in programmatic video without leaving the React/canvas pipeline — useful for dynamic client report videos or social content.

---

## Part 2: GBP Post Best Practices — GLV Deep Dive

### Existing Coverage Check

The cross-channel best practices doc (`orgs/glv/social/glvbuilds/research/cross-channel-best-practices-2026-05-16.md`, lines 371-433) already covers:
- GBP posts have zero direct ranking impact (Sterling Sky confirmed)
- Post types: Update/Offer/Event with expiry behaviour
- Format specs: character limits, image sizes, CTA buttons
- Cadence: 1-3x/week with practical weekly schedule
- Hook patterns: transactional mode framing, what works/doesn't
- GBP-unique edges: Q&A seeding, review responses, photo cadence, social connection warning

**What was missing:** GLV-specific 7-day cadence, competitor agency examples, and updated 2026 format specs (720x720 is outdated — see below).

---

### Competitor Agency GBP Post Examples

Direct GBP post feeds aren't publicly crawlable, but documented agency examples from 2025-2026 practitioner guides show clear patterns:

**Example 1 — MapRanks-style: The metric-led client win**
> "We helped a local plumber triple their inbound calls in 60 days — using nothing but their Google Business Profile. Here's exactly what we changed."

Why it works: Concrete metric, familiar trade type (readers picture themselves), curiosity without withholding the topic. Agency-as-practitioner, not agency-as-salesperson. Post type: Update. CTA: Learn More.

**Example 2 — Synup-style: The myth-bust**
> "Myth: Posting on social media every day grows your business. Truth: One well-targeted Google post outperforms 30 Instagram stories for local search. Here's why."

Why it works: Challenges an existing belief (sunk cost), creates cognitive tension, sells GBP management implicitly. Post type: Update. CTA: Learn More.

**Example 3 — The Digital Crew (Ontario): Page-rank result reveal**
> "Our client's website went from page 4 to page 1 in 6 weeks. No paid ads. No tricks. Here's the 3-step process we used."

Why it works: "No paid ads" removes the main objection. Numbered promise signals brevity. "Learn More" captures intent-ready traffic. Post type: Update. CTA: Learn More → case study.

**Example 4 — Event-driven: Free local workshop**
> "Free Workshop: How Sault Ste. Marie businesses can show up first on Google Maps — without spending a dollar on ads. Spots limited."

Why it works: Event posts have a built-in urgency engine (end date). "Free" + city name are highest-performing qualifiers for small-market agencies. Registrations = warm leads at zero ad spend. Post type: Event. CTA: Sign Up.

**Example 5 — Objection-handler: The honest answer**
> "A business owner asked us: 'Can't I just handle my own Google profile?' Honest answer: yes. But here's what most miss — and what it's costing them in calls every month."

Why it works: Validates autonomy (no condescension), opens a genuine gap, triggers no sales resistance. High-trust post type that performs well for agencies. Post type: Update. CTA: Learn More.

**Cross-example patterns for GLV to internalize:**
- Lead with a number or named result, never a service description
- Reference a real trade or business type the reader can map to themselves
- Educational posts outperform promotional posts for agencies
- Event posts (webinars, workshops) are underused and beat generic "contact us" offers
- Emojis in the first line increase clicks ~2x (BrightLocal 2025 data)

---

### GLV 7-Day Starter Cadence — @glv.marketing GBP

**Audience:** Local business owners in SSM and surrounding area — trades, retail, professional services.
**Voice:** Confident practitioner. No jargon. Demonstrably local.

| Day | Type | Topic | CTA |
|-----|------|-------|-----|
| Mon Wk1 | Update | Client win — call volume | Learn More |
| Tue Wk1 | Offer | Free GBP Audit (May) | Sign Up |
| Wed Wk1 | Update | Educational tip — category fix | Learn More |
| Fri Wk1 | Event | Free webinar June 5 | Sign Up |
| Sat Wk1 | Update | Behind-the-scenes / team | Learn More |
| Mon Wk2 | Update | Client review showcase | Learn More |
| Wed Wk2 | Offer | Referral program | Get Offer |

---

**Day 1 — Monday: Update — Client Win**

First 150 chars:
> "A local SSM business went from invisible on Google to getting 40+ calls a month — without running a single ad. Here's what changed."

Body: Before-state (buried, word-of-mouth only) → intervention (GBP optimization + weekly posting + review strategy) → after-state (calls, map pack). Keep client type general if unnamed. Close: "Wondering what your Google profile is missing? Book a free 15-minute audit."

Image: Before/after mockup of a Google Maps search result, or anonymized GBP Insights screenshot showing call volume growth. Non-stock only.

---

**Day 2 — Tuesday: Offer — Free GBP Audit**

First 150 chars:
> "Free GBP Audit — May only. We'll tell you exactly why your business isn't showing up on Google Maps and what to fix first. No strings."

Body: What the audit covers (completeness score, category, photos, post history, review velocity). State the value ("This is what we charge clients $150 for — free this month"). Urgency: "We cap these at 5 per week."

Image: Clean branded graphic — "FREE GBP AUDIT" in large text, GLV logo, Google Maps pin. 1200x900px.
Offer expiry: May 31, 2026. This gives the post a yellow "Offer" tag in the panel for the rest of the month.

---

**Day 3 — Wednesday: Update — Educational Tip**

First 150 chars:
> "The #1 reason local businesses don't show up on Google Maps: their category is wrong. Here's how to check yours in 30 seconds."

Body: GBP dashboard → Edit Profile → Business Category. Primary vs. secondary categories. One concrete example (plumber listed as "Contractor" loses half their map pack opportunities). Close: "Not sure yours is set right? Drop us a message."

Image: Annotated screenshot of the GBP category field (mockup), or a simple "Wrong category = invisible on Maps" graphic.

---

**Day 4 — Friday: Event — Free Webinar**

First 150 chars:
> "Free Webinar: How SSM businesses can rank on Google Maps without paid ads. June 5th, noon. 45 minutes. Real tactics, no fluff."

Body: Date, time, format (Zoom), what attendees leave with (GBP audit checklist, 3 quick wins). Emphasize SSM-area focus. Registration link in CTA.
Event dates: June 5, 2026 12:00 PM ET → 1:00 PM ET. Post stays live and prominent until the event fires.

Image: Branded event graphic — "Free Local SEO Webinar" + date/time/GLV logo. 1200x900px.

---

**Day 5 — Saturday: Update — Behind the Scenes**

First 150 chars:
> "Behind the scenes: what a typical week at GLV actually looks like — audits, posts, reports, and yes, a lot of coffee."

Body: Short and warm. Describe one real thing from this week (3 GBP audits run, updated service pages for a local retailer, 8 posts scheduled across client profiles). Point: we actively do this every day for clients.

Image: Genuine team photo — working, whiteboarding, or local coffee meeting. Authentic over polished. If no team photo yet: flat-lay of working materials with an SSM window background.

---

**Day 6 — Monday Wk2: Update — Review Showcase**

First 150 chars:
> "'We went from 2 Google calls a month to 20+. Worth every dollar.' — Here's what changed for one of our local clients."

Body: Pull or paraphrase a 5-star review (with permission). Add 1-2 sentences of context: what they do, what problem they brought, what result they saw. Let the quote carry the weight.

Image: Branded quote card — client quote in large type, subtle GLV branding, warm background. Google star rating UI as a design element.

---

**Day 7 — Wednesday Wk2: Offer — Referral Program**

First 150 chars:
> "Know a local business that's invisible on Google? Refer them to GLV this month and you both get something. Here's the deal."

Body: Referring party gets [X]; new client gets a free GBP audit + first month reduced. Keep terms simple and scannable.

Image: "Refer a Local Business" graphic — two-sided benefit spelled out clearly, GLV branding.
CTA: Get Offer → referral intake form.

---

### Updated Format Specs — 2026 Current

Sources: BrightLocal (April 2026), Whitespark GBP Guide, Digital Applied 2026 Feature Guide, BusinessRanker (Nov 2025 – Mar 2026), RecurPost image specs.

**Character limits**

| Post Type | Max | Visible before truncation |
|-----------|-----|--------------------------|
| Update (What's New) | 1,500 | ~150-200 on mobile |
| Event description | 1,500 | Same |
| Offer description | 1,500 | Same |
| Event / Offer title | 58 | Full title shown |

Practical rule: write your entire value prop into the first 75-100 characters.

**Image specs**

| Spec | Value |
|------|-------|
| Recommended size | **1,200 x 900 px (4:3)** |
| Minimum to post | 400 x 300 px |
| Safe zone for text/logo | Central 900x900 px area |
| Formats | JPG or PNG |
| File size | 10 KB min, 5 MB max |
| Multiple images per post | Up to 10 (carousel) |

> **720x720 is outdated.** This spec is no longer recommended — Google shifted to 4:3 as the feed display ratio. 720x720 is accepted as a minimum-quality floor but images will be cropped or upscaled, reducing sharpness. Use 1,200x900.

**Video specs**

| Spec | Value |
|------|-------|
| Max duration | 30 seconds |
| Max file size | 75 MB (safe ceiling) |
| Minimum resolution | 720p |
| Recommended | 1080p 16:9 |
| Autoplay | Muted — don't rely on audio in first 3s |
| API | Google Business Profile API does NOT support video uploads for posts — manual upload only |

**CTA buttons**

| Button | Available on | Best use |
|--------|-------------|----------|
| Learn More | Update, Event | Blog, service pages, case studies |
| Sign Up | Update, Event | Webinars, free audits, intake forms |
| Book | Update, Event | Consultations, appointments |
| Call Now | Update, Event | Direct phone conversion |
| Get Offer | Offer only | Offer landing page |
| Redeem Online | Offer only | Voucher / promo page |
| Order Online | Update, Event | E-commerce |
| Buy | Update, Event | Direct purchase |

**Changes since March 2025 interface update**

| Change | Detail |
|--------|--------|
| Native post scheduling | Now built into GBP dashboard — no third-party tool needed |
| Multi-location publishing | Single post pushes to all profiles simultaneously |
| Q&A section | Replaced by AI-generated answers (owner can review/approve before publish) |
| Business Chat | Replaced by WhatsApp integration |
| Social media pull | Google now surfaces linked FB/IG/X posts on GBP mobile brand searches (Feb 2025) — do NOT link Instagram per prior guidance |
| Publications hub | Posts, events, promotions now in single "Publications" view |
| Post expiry | Posts do NOT expire. Many guides still claim 7-day expiry for What's New — that is wrong and has been wrong since January 2021. |
| Image quality enforcement | New minimum quality standards enforced late 2025 — blurry or heavily filtered images may be rejected |

---

### Quick Ref Cheat Sheet

```
GBP POST SPECS — 2026 CURRENT
─────────────────────────────────────────
Image:      1,200 x 900 px | JPG/PNG | max 5 MB
            Keep text/logo in central 900x900 safe zone
            (720x720 is outdated — do not use)
Video:      ≤30 sec | ≤75 MB | 720p min | 16:9 | muted autoplay
            Video cannot be uploaded via API — manual only
Characters: 1,500 max | write value prop in first 75-100 chars
Carousel:   Up to 10 images or videos per post

POST TYPES
─────────────────────────────────────────
What's New  → Updates, tips, wins, team content (no expiry)
Event       → Webinars, workshops — stays live until end date
Offer       → Promos, audits, referral deals (yellow tag in panel)

CTA BUTTONS
─────────────────────────────────────────
Learn More  → blog, service pages, case studies
Sign Up     → webinars, free audits, intake forms
Book        → consultation bookings
Call Now    → direct phone conversion
Get Offer   → offer-type posts only

CADENCE
─────────────────────────────────────────
Minimum: 1x/week to avoid 30-day inactivity impression drop
Optimal: 2-3x/week (mix all 3 post types)
Native scheduling now available in GBP dashboard
```

---

*Sources: BrightLocal (Apr 2026), Whitespark GBP Guide, Digital Applied 2026, BusinessRanker (Nov 2025–Mar 2026), Synup, The Digital Crew (CA), MapRanks (May 2025), RecurPost 2026, Publer GBP reference, GBP Rank Tracker 2026, Social Champ 2026*
