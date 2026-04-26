# Content Agent Long-Term Memory

## @glvbuilds Social Calendar

### Format conventions locked

**Carousel (LinkedIn + 7-slide IG)**
- Slide 1: Hook — specific, first-person, actionable claim
- Slides 2–7: One step/insight per slide, numbered
- LinkedIn caption: full narrative (300–600 words), includes slide summary
- IG caption: punchy (100–150 words), same CTA
- CTA: "Comment [KEYWORD]" if automation available, open comment if not

**Reel (~30–35s)**
- Hook: what you're doing (first-person, specific)
- Body: 3–4 steps, each 1 sentence on screen
- Ending: clear payoff + CTA
- Production note: blur/mask any real client data shown on screen

**LinkedIn text post + IG static**
- LinkedIn: 3–5 short paragraphs. Start with bold insight. End with 3–4 bullet fix or framework. CTA.
- IG static: key stat or claim as graphic. Short caption (80–120 words).

### Weekly posting cadence

~5 posts per week. Skip Sat/Sun unless holiday hook (e.g. Canada Day Jul 1). Post Mon–Fri. Mix:
- 2× carousel (Mon or Tue + Thu or Fri)
- 2× reel (Wed + one other)
- 1× LinkedIn text + IG static

### Topic clusters covered (as of session 18)

| Cluster | Examples |
|---------|---------|
| Keyword research | gap check (Jul 3), free tools (Jun 25), competitor keywords (Jul 9) |
| GBP optimization | call tracking (Jun 18), rating vs website (Jul 6), GBP checklist (Jul 8), GBP photo category (Jul 13), GBP post strategy (Jul 16) |
| Citation/NAP | NAP consistency (Jun 26) |
| Review generation | system (Jul 7), Google rating (Jul 6) |
| Client reporting | 3-sentence check-in (Jun 19), GSC monthly reports (Jul 20) |
| Agency/pricing | solo agency pricing (Jun 17) |
| Client vetting | 5 questions (Jun 30) |
| AI tools | tools I actually use (Jul 2) |
| Local content types | 5 types that get shared (Jun 21) |
| First 30 days | quick wins (Jun 29) |
| Pre-pitch audit | 10-minute audit (Jun 24) |
| Citation audit | 2-minute check (Jun 20) |
| Local landing pages | one page per service+city (Jul 15) |
| Rank checking | incognito + map pack vs organic (Jul 17) |
| Schema markup | LocalBusiness @type + Rich Results Test (Jul 21) |
| Ranking for own name | diagnostic + one-page-per-service fix (Jul 10) |
| Local SEO audit | 7-check pre-call audit (Jul 14) |

### CTA keyword map

| Post | CTA keyword | Automation? |
|------|-------------|-------------|
| May 9 | SPEED | ⚠️ Aiden to confirm |
| May 11 | LOCAL | ⚠️ Aiden to confirm |
| Jun 17 | PRICING | manual DM only |
| Jun 18 | CALLS | manual |
| Jun 21 | open comment | n/a |
| Jun 24 | AUDIT | manual |
| Jun 25 | KEYWORDS | manual |
| Jun 26 | NAP | manual |
| Jun 29 | QUICKWIN | manual |
| Jun 30 | CLIENT | manual |
| Jul 2 | TOOLS | manual |
| Jul 3 | GAP | manual |
| Jul 6 | REVIEWS | manual |
| Jul 7 | REVIEWS | manual |
| Jul 8 | GBP | manual |
| Jul 9 | COMPETE | manual |
| Jul 13 | PHOTO | manual |
| Jul 14 | AUDIT | manual |
| Jul 16 | POSTS | manual |
| Jul 17 | RANK | manual |
| Jul 20 | GSC | manual |
| Jul 21 | SCHEMA | manual |

## Reyco Marine Content

### v2 Service Pages (complete as of 2026-04-25)

All 11 pages shipped to `orgs/glv/clients/reyco/deliverables/copy/service-pages/v2/`. Pattern:
- Hero + intro + 4-section body with section-aware CTAs
- Tabs: Pricing ("Call for current pricing"), Brands, Booking
- 6-FAQ block + FAQPage schema
- E-E-A-T author (Damian: small engine/lawn/snow/tune-ups, Lee: marine/ATV/winter/spring, Lynn: parts/warranty)
- Marine triangle hub closed (Marine ↔ Winterization ↔ Spring Commissioning)
- Engine Repair: 4-layer anti-automotive defence
- Canadian -ise throughout (exception: winterize/winterization brand-canonical)

### Reyco Blog (pending)

15 Toro meta title regenerations blocked on Casey's data reply (Toro/Mercury/EZ-GO/Easy Hauler/Troy-Bilt product specifics).

### Reyco Deliverables Index

| File | Type | Status |
|------|------|--------|
| `copy/service-pages/v2/*.md` | v2 copy | Complete |
| `copy/about-page-v1.md` | About page | Shipped |
| `copy/meet-the-team.md` | Team page | Shipped |
| `copy/author-bios/*.md` | 7 author bios | Shipped |
| `copy/order-parts-carousel-ctas.md` | Parts page carousel/CTA | Shipped |
| `design/order-parts-form-redesign.md` | Form redesign spec | Shipped |
| `seo/order-parts-carousel-schema-direction.md` | Schema direction | Shipped |
| `copy/related-services-cta-tile.md` | 6th tile copy | Shipped |
| `audits/404-sweep-2026-04-25.md` | 404 audit | Shipped — 6 301s needed |
| `qc/footer-v2-*.png` | Footer QC captures | Shipped (PR #73 merged) |

## Cloud Session Protocol

When running in cloud (no local daemon):
- Skip all `cortextos bus` commands — log each as "skipped, daemon required"
- Use Slack MCP (channel C0AQWLHQJJC = #internal-reyco) for comms
- Memory + draft commits can go direct to main; no PR needed for content files
- Check #internal-reyco for Casey replies and Aiden confirmations at start of each session

## People Context

- **Aiden Glave** (`@U0APRAY5FPY`) — GLV owner. Approves all public content decisions. Reviews flagged items before scheduling.
- **Casey** — Reyco Marine owner. Supplies product data for Toro/Mercury/EZ-GO/Easy Hauler/Troy-Bilt. Hasn't replied as of session 18.
- **Damian** — Small engine/lawn/snow tech. Named in v2 pages.
- **Lee** — Marine/ATV tech. Named in v2 pages.
- **Lynn** — Parts manager. Named in warranty/parts pages.
- **Charlene** — Bio updates coming (Monday batch, not yet received).
