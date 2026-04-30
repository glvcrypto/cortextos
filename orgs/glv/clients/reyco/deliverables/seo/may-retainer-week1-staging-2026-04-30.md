# Reyco Marine — May Retainer Week 1 Staging
**Prepared:** 2026-04-30 (overnight prep by seo agent)  
**For:** AM goals cascade review — not dispatched yet  
**Scope:** Schema finalization + Person schema readiness + week-1 task queue draft

---

## 1. LocalBusiness Schema — Finalization Status

**Assessment: SHIP-READY except two dev-side image paths.**

| Field | Status | Gate Owner | Notes |
|-------|--------|-----------|-------|
| name, alternateName, url | ✅ Complete | — | Confirmed |
| telephone, email | ✅ Complete | — | 705-253-7828, parts@reycomarine.com |
| address (full + postal) | ✅ Complete | — | 11 White Oak Drive East, P6B 4J7 |
| geo coordinates | ✅ Complete | — | lat: 46.5375641, lng: -84.3351689 |
| openingHoursSpecification | ✅ Complete | — | Mon–Fri 08:00–17:00, Sat 09:00–13:00 |
| priceRange, currenciesAccepted | ✅ Complete | — | $$, CAD |
| areaServed | ✅ Complete | — | Sault Ste. Marie + Algoma District |
| hasOfferCatalog (4 services) | ✅ Complete | — | Small Engine, Marine, Winterization, Spring Commissioning |
| sameAs (Facebook + Instagram) | ✅ Complete | — | URLs confirmed in schema template |
| logo URL | ⏳ Dev-path | Dev | `[PENDING]` — dev confirms path after WP migration (standard: `/wp-content/themes/reyco/assets/images/logo.png`) |
| storefront image URL | ⏳ Dev-path | Dev | `[PENDING]` — dev confirms path after WP migration (standard: `/wp-content/themes/reyco/assets/images/storefront.jpg`) |

**Action for week 1:** Dev can implement LocalBusiness schema now with logo/storefront URLs as reasonable-default paths. Validate via schema.org/validator post-deploy. Zero content blockers remaining.

---

## 2. Service Schemas — Finalization Status

All 5 service page schemas are complete JSON-LD blocks. Zero [PENDING] items.

| Schema | Page | Status | Notes |
|--------|------|--------|-------|
| Service — Small Engine Repair | /service/small-engine/ | ✅ Ready | KD 8, 3,600/mo — priority dispatch |
| Service — Marine Service | /service/marine/ | ✅ Ready | Mercury-certified signal |
| Service — Boat Winterization | /service/winterization/ | ✅ Ready | Seasonal — target live by Sep 1 |
| Service — Spring Commissioning | /service/spring-commissioning/ | ✅ Ready | Seasonal — live ASAP (spring window) |
| FAQPage — ATV/UTV Repair | /service/atv-utv-repair/ | ✅ Ready | 20-30% CTR lift signal per scout |

**Action for week 1:** Single dev PR implements all 5 service schemas. Spring Commissioning and Marine are highest urgency (active season). Validate each block at schema.org/validator.

---

## 3. Person Schema — Readiness Map

Person blocks require: full name, jobTitle, worksFor, url, sameAs (optional), description.

All 7 bios are v1-generic ("Charlene Monday batch slots in specifics"). First names + roles confirmed via staff roster.

| Team Member | Full Name Known | Role Confirmed | Bio Quality | sameAs | Draft-now? |
|-------------|----------------|---------------|-------------|--------|-----------|
| Casey | Casey Davieaux ✅ | Owner / Sales ✅ | Generic v1 — no certs/experience specifics | Unknown | ✅ Can draft minimal block |
| Aaron | First name only | Co-Owner / Sales ✅ | Generic v1 | Unknown | ⏳ Need last name |
| Lee | First name only | Service Tech (Marine + Off-Road) ✅ | Generic v1 — no cert specifics | Unknown | ⏳ Need last name |
| Damian | First name only | Service Tech (Small Engine + OPE) ✅ | Generic v1 | Unknown | ⏳ Need last name |
| Lynn | First name only | Parts Manager ✅ | Generic v1 | Unknown | ⏳ Need last name |
| Ron | First name only | Parts Specialist ✅ | Generic v1 | Unknown | ⏳ Need last name |
| Kory | First name only | Sales ✅ | Generic v1 | Unknown | ⏳ Need last name |

**What Charlene Monday batch unlocks:**
- Full last names for all 6 staff (Aaron, Lee, Damian, Lynn, Ron, Kory)
- 1–2 sentence bios with experience + certifications
- LinkedIn / Facebook profile URLs (where available)
- Mercury certification details for Lee (marine E-E-A-T anchor)

**Action for week 1:**
1. Draft Casey Davieaux Person block now — can be wired in without waiting (full name confirmed, Owner role clear from copy)
2. Stub remaining 6 Person blocks as `[PENDING last name + bio]` — ready to fill on Charlene batch receipt
3. Person schemas go on About page only (not globally) — single dev pass once Charlene batch lands

### Casey Davieaux — Draft Person Block (ready now)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Casey Davieaux",
  "jobTitle": "Owner",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/author/casey/",
  "description": "Casey Davieaux is the owner of Reyco Marine & Small Engine in Sault Ste. Marie, Ontario. He leads the sales floor and helps customers find the right boat, mower, or snowblower for their needs."
}
```

*Note: `sameAs` omitted until social/LinkedIn confirmed. `description` derived from bio v1 copy — will strengthen with Charlene batch specifics (years at Reyco, etc.).*

---

## 4. Week-1 Task Queue Draft (for AM goals cascade)

Ordered by SEO impact × readiness (no external gates):

| Priority | Task | Gate | Est. effort |
|----------|------|------|-------------|
| P0 | Dev: implement LocalBusiness + 5 service schemas | Domain live | 1 dev PR |
| P0 | Dev: C1+C2 — Meet the Team meta title + description (ready-ship copy banked) | Domain live | 5-min dev dispatch |
| P1 | Homepage SEO brief — keyword cluster → copy brief | Copy draft needed (no existing draft) | 1–2 days seo |
| P1 | Casey Person schema block — wire to About page | Domain live | Dev + seo (Casey block drafted above) |
| P1 | Charlene batch → fill Person schema stubs for all 6 remaining staff | Charlene Monday batch | 30 min seo post-receipt |
| P2 | Fleet bio-link pass (L2,L3,L5,L6,L8,L10,L11,L13,L15,L16) | Meet the Team page live | 1 dev PR |
| P2 | Task #12 remaining 21 metas — fire follow-up batch | Casey WC import (R&J) + dev SKU sync (Trailer X) | 1 script run (script ready) |
| P2 | Mercury 90HP manual confirm (Group C) | Verify WC ID=383 | 5 min seo |
| P2 | Princecraft Sportfisher 21 variant disambiguation (Group D) | Casey confirm 2S vs 2RS | 10 min seo |
| P3 | Image directives batch (I1–I12) | Casey photo batch | Pending Casey |
| P3 | WC REST API credential rotation | Post-launch | 5 min WP Admin |
| P3 | GSC baseline export | Aiden action (pre-May-1 deadline passed — flag) | Aiden |
| Blocked | Task #7 Soo Sackers GSC canonical audit | URL list from Aiden | — |
| Blocked | Task #8 Casey tag decisions → v4 mapping | Casey 16 decisions | — |

---

## 5. Carry-Forward Blockers (Aiden morning review)

These need Aiden or Casey action before seo agent can close them:

| Item | Who | Status |
|------|-----|--------|
| GSC baseline export (Day-0 anchor) | Aiden | Was pre-May-1 deadline — if missed, export ASAP; Day-1 is still useful |
| Charlene staff bios batch | Casey → Charlene | Unlocks Person schema for 6 staff |
| Casey 16 tag decisions | Casey | Unblocks Task #8 + Trailer X title disambiguation |
| WC SKU field population (Lightspeed sync) | Dev | Unblocks Group A (R&J, 13 products) + Group B (Trailer X, 6 products) |
| Meet the Team page live | Dev | Unblocks fleet bio-link pass (10 pages, 1 PR) |
| Princecraft 2S vs 2RS confirmation | Casey | Unblocks Group D (1 product) |

---

*Ready for AM goals cascade. No external comms sent, no client-touching changes made — nighttime guardrail observed.*
