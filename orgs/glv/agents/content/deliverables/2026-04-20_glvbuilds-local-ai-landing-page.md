# Local AI Lead-Funnel Landing Page — Draft

> ARCHIVED 2026-04-20 — scope correction. @glvbuilds is IG/social brand only. Repurpose if GLV service page ever built on glvmarketing.ca.

**Deliverable type:** Copy draft + structural outline + component map + dev flags
**Task:** task_1776660907691_918
**Status:** DRAFT — morning brief review only. Do not push to any site.
**Target page URL (proposed):** `/services/private-ai` or `/local-ai` on glvmarketing.ca
**Audience:** Canadian regulated-industry business owners — law firms, medical/dental practices, financial advisors, accountants
**Goal:** Book a discovery call (single CTA, no friction)
**Voice:** @glvbuilds positioning — authentic early-stage. "I'm building this and it's working." No false claims, no agency-scale language.
**Tone rules:** Curiosity + aspiration + pride + upside FOMO. No fear/scare/threat framing.

---

## Part A: Copy

---

### Hero Section

**Headline:**
Your clients' data stays in Canada.

**Subheadline:**
GLV builds private AI setups for Canadian law firms, clinics, and financial advisors — running on Canadian servers or your own hardware. Your files never touch an American server.

**Hero CTA button:**
Book a free 30-minute call

**Supporting line (below CTA):**
No commitment. Just a straight conversation about what's possible for your firm.

---

### Problem Section

**Section label (small caps, zinc-500):** THE COMPLIANCE GAP

**Heading:**
Most AI tools your team is already using send client data south of the border.

**Body:**
When your staff pastes a client file into ChatGPT, or uses an AI writing tool to draft a letter, that data travels to an American server. The company running that server operates under American law — including the CLOUD Act, which lets US authorities access data stored by American companies anywhere in the world.

For most businesses, this is a footnote. For regulated professionals in Canada, it is a compliance question that nobody is asking yet — but regulators are starting to.

PIPEDA governs how Canadian businesses handle personal information. Ontario's PHIPA governs health data. Quebec's Law 25 is already stricter than GDPR on consent and data location. These laws do not prohibit AI tools. They do require that you know where your clients' data goes and that you are accountable for it.

The firms that figure this out now will be ahead of the curve when regulators catch up. The ones that ignore it will be scrambling.

**Pull quote (optional callout):**
"PIPEDA does not prohibit sending data across borders. But it does hold the Canadian company responsible for what happens to it."

---

### Solution Section

**Section label:** WHAT GLV BUILDS

**Heading:**
Private AI that runs on your terms, in your country.

**Three-column feature cards:**

**Card 1**
Icon: Shield (lucide-react)
Title: Canadian Data Residency
Body: Your AI runs on Canadian-hosted servers (AWS ca-central-1, Azure Canada, or on-premise). Client data never crosses the border.

**Card 2**
Icon: Lock
Title: PIPEDA and PHIPA Alignment
Body: Setup designed with Canadian privacy law in mind. We document the data flow so you can answer a regulator's question clearly.

**Card 3**
Icon: Cpu
Title: Built for Your Workflow
Body: We configure the tools your team will actually use — document drafting, client intake, research summaries — not a generic demo.

**Section body (below cards):**
This is not a software product. GLV builds a custom setup for your firm, tests it with your team, and hands you something that works. No subscriptions to another American SaaS platform. No ongoing dependency on us unless you want it.

I am learning this in real time — following the LLM Academy programme and documenting the build. The firms I am working with now are getting the most hands-on attention I will ever give. That is the honest version of where this is at.

---

### Social Proof Section

**Section label:** EARLY RESULTS

**[PLACEHOLDER — user to confirm client and consent before this section goes live]**

Option A (if Reyco consents — different industry, but proof of delivery):
"GLV built out our digital presence from scratch. We went from zero online visibility to consistent organic search results within the first month."
— Casey Davieaux, Reyco Marine

Option B (anonymous):
"A Northern Ontario professional services firm is currently piloting a private document AI with GLV. Setup completed in under 3 weeks. No data left Canada."

Option C (honest early-stage framing):
We are currently working with our first regulated-industry clients on private AI implementations. If you want to be in the first cohort, now is the time — setups at this stage get more direct attention and a lower introductory rate.

**Note to user:** Option C is the safest and most aligned with @glvbuilds positioning (authentic early-stage). Recommend Option C unless you have a client willing to go on record.

---

### About Section (short)

**Heading:**
Who builds this

**Body:**
My name is Aiden Glave. I run GLV Marketing in Sault Ste. Marie, Ontario. I use Claude Code to build the systems I sell — which means I understand them at a level most marketing agencies do not.

Private AI for regulated industries is the part of this work I find most interesting. Canadian businesses deserve AI tools that work within Canadian law, not around it. That is what I am building.

---

### CTA Section (page bottom)

**Heading:**
If this is relevant to your firm, let's talk.

**Body:**
A 30-minute call is enough to figure out whether private AI makes sense for your situation. No pitch, no deck. Just a conversation.

**CTA button (primary):** Book a 30-minute call
**Secondary link:** Or email us at info@glvmarketing.ca

**Supporting line:**
GLV Marketing — Sault Ste. Marie, Ontario — 705-975-0579

---

## Part B: Structural Outline Mapped to Mission Control Patterns

The Mission Control repo (glv-mission-control) is an internal React dashboard — it does not contain public-facing landing page scaffolding. The patterns below are adapted from what exists in the repo for implementation reference.

| Section | Component Pattern | Mission Control Reference |
|---------|------------------|--------------------------|
| Page wrapper | `min-h-screen bg-zinc-50` + `max-w-4xl mx-auto px-4 py-12` | Layout.tsx line 28-30 |
| Hero | Full-width section, `bg-white border-b border-zinc-200`, centered text | ClientDashboard.tsx card pattern |
| Headline | `text-4xl font-bold text-zinc-900` | HubPage KPI pattern |
| Subheadline | `text-lg text-zinc-500 mt-3 max-w-2xl` | ClientDashboard p.text-sm.text-zinc-500 |
| Primary CTA button | `bg-[#B22222] text-white rounded-lg px-6 py-3 font-semibold hover:bg-[#991b1b]` | QuickActions.tsx baseStyles + primary variant (red not yet implemented — see FLAG 1) |
| Problem section | `rounded-xl border border-zinc-200 bg-white p-8` | ClientDashboard.tsx card |
| Section label | `text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2` | Not in repo — new pattern |
| Feature cards (3-col) | `grid grid-cols-1 md:grid-cols-3 gap-4` + card pattern | KpiRow.tsx layout |
| Card | `rounded-xl border border-zinc-200 bg-white p-6` | HubPage ClientCards pattern |
| Card icon | lucide-react, `text-[#B22222]` | QuickActions.tsx icon pattern |
| Pull quote | `border-l-4 border-[#B22222] pl-4 text-zinc-600 italic` | Not in repo — new pattern |
| About section | Single card, left-aligned | ClientDashboard "What We're Working On" card |
| Bottom CTA | Full-width `bg-zinc-900 text-white` section | Not in repo — new pattern |
| Secondary link | `text-zinc-400 underline text-sm` | Not in repo |

---

## Part C: Brand Assets and Tokens Referenced

**Colours:**
- Background: `#fafafa` (zinc-50) — from index.css
- Card background: `#ffffff` white
- Card border: `#e4e4e7` (zinc-200)
- Primary text: `#18181b` (zinc-900) — from index.css body
- Body text: `#71717a` (zinc-500)
- Accent / CTA: `#B22222` (GLV Deep Red — from BRAND.md)
- Accent hover: `#991b1b` (red-800 equivalent)
- Dark section: `#18181b` (zinc-900)

**Typography:**
- Font: Inter (loaded via Google Fonts in index.css)
- Heading weight: font-bold (700)
- Body weight: font-normal / font-medium (400/500)

**Logo:** Primary logo (light background) — GLV 2.png / 2-transparent.png (from BRAND.md). Will need to be served from public/assets or glvmarketing.ca CDN.

**Icons:** lucide-react (already in package.json) — Shield, Lock, Cpu for feature cards.

---

## Part D: Dev Flags (Missing Components / Gaps)

**FLAG 1 — No primary red CTA button in repo**
Mission Control buttons use zinc-200 border / zinc-700 text. The GLV Deep Red (#B22222) is not implemented as a button variant anywhere in the codebase. Dev needs to add a `primary-red` button variant before this page can be built from existing components.
Suggested fix: Add to QuickActions or create a shared `<Button variant="primary" />` component.

**FLAG 2 — No public landing page scaffolding**
Mission Control is an internal dashboard with Layout.tsx assuming Sidebar + Header. A public-facing landing page needs a separate layout (no sidebar, no auth guard, no realtime hooks). Dev needs to create a `PublicLayout.tsx` or confirm the page will be built on the glvmarketing.ca repo (separate from Mission Control entirely).
Recommend: Confirm with user whether this page lives on glvmarketing.ca (likely, for SEO) or inside Mission Control as a client-portal-facing page.

**FLAG 3 — No contact/booking form primitive**
No `<Form>`, `<Input>`, or booking embed component exists in the repo. For a "book a call" CTA, dev needs to either: (a) embed a Google Calendar booking link (link already exists: https://calendar.app.google/5hcxx2tWmVkNvS1c6), (b) add a contact form wired to Supabase or a form service, or (c) use a simple mailto: link as interim. Recommend (a) — booking link embed is lowest friction and zero dev overhead.

**FLAG 4 — No section label pattern**
Small-caps section labels (e.g. "THE COMPLIANCE GAP") are not in the repo. Simple CSS — `text-xs font-semibold text-zinc-400 uppercase tracking-widest` — but worth flagging so dev implements consistently.

**FLAG 5 — No dark footer / CTA band**
No full-width dark background section exists in the repo. Bottom CTA will need a new component or a simple `bg-zinc-900 text-white` section wrapper.

**FLAG 6 — SEO metadata**
This page needs a proper `<title>`, meta description, and Open Graph tags. Mission Control does not implement these (internal tool). If page lives on glvmarketing.ca, confirm how SEO metadata is managed (likely via a Helmet or similar — check glvmarketing repo).

---

## Production Notes

- **Booking link:** https://calendar.app.google/5hcxx2tWmVkNvS1c6 — use as primary CTA href until a form is built
- **Canonical path:** Recommend `/services/private-ai` — fits within existing services URL structure
- **Internal links from this page:** Canada pillar blog post (when published), `/services`, `/contact`, `/about`
- **Internal links TO this page:** Homepage services section, Canada pillar blog (Section 8), any AI Security @glvbuilds posts
- **No stats or citations in this copy** — intentional per hallucination-prevention rule. If user wants proof points, they need to come from primary sources.
