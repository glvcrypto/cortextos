# Reyco Marine — May Retainer Readiness Brief
**Prepared:** 2026-04-30 by seo agent  
**Purpose:** Three readiness streams for May 1 retainer kickoff — Person schema, GSC integration, NAP audit  
**Status:** Pre-domain-cutover (reycomarine.com transfer still pending as of 2026-04-30)

---

## Stream 1 — Person Schema Readiness Map

### What's Ship-Ready Now

**Casey Davieaux — READY TO WIRE**

Full JSON-LD block staged in `may-retainer-week1-staging-2026-04-30.md`. No pending items.

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

**Wire to:** `/about/` page → `<script type="application/ld+json">` in page `<head>`  
**Gate:** Domain live (reycomarine.com must be the URL, not staging)  
**What strengthens it post-Charlene:** years in business, specific product expertise, LinkedIn/Facebook URL

---

### What Needs Casey / Charlene Input

| Team member | Role | Last name | Bio (1–2 sentences) | sameAs (LinkedIn/FB) | Mercury cert | Status |
|-------------|------|-----------|--------------------|-----------------------|--------------|--------|
| Aaron | Co-Owner / Service Manager | ❌ | ❌ | ❌ | — | Blocked — Charlene batch |
| Lee | Service Tech (Marine + Off-Road) | ❌ | ❌ | ❌ | ❓ Confirm | Blocked — Charlene batch |
| Damian | Service Tech (Small Engine + OPE) | ❌ | ❌ | ❌ | — | Blocked — Charlene batch |
| Lynn | Parts Manager | ❌ | ❌ | ❌ | — | Blocked — Charlene batch |
| Ron | Parts Specialist | ❌ | ❌ | ❌ | — | Blocked — Charlene batch |
| Kory | Sales | ❌ | ❌ | ❌ | — | Blocked — Charlene batch |

**Lee's Mercury certification** is the highest-value E-E-A-T signal in the batch — if Lee is Mercury Certified Marine Technician, that goes in his Person schema `hasCredential` field and in his bio blurb on the About page. Flag Casey directly: "Is Lee Mercury-certified? If so, what's the certification name?"

**Charlene batch ETA:** Unknown — flagged in previous sessions. Still pending.

### Person Schema Implementation Plan

Once Charlene batch lands:
1. Fill all 6 stubs (30 min SEO agent work)
2. Single dev PR adds all 7 Person schema blocks to About page template
3. Validate at schema.org/validator
4. Update blog post Article schema to link to Casey's `@id` (P2-BL2 in punch list)

**Pre-wire (can happen now on staging):** Casey block only. Wire on staging, validate, leave commented until domain is live.

---

## Stream 2 — GSC Integration Plan (Post-Domain Cutover)

### Day 0 Actions (domain goes live)

| Action | Owner | Urgency |
|--------|-------|---------|
| Verify reycomarine.com in GSC (HTML meta tag method preferred) | Aiden | Same day as cutover |
| Submit sitemap: `reycomarine.com/sitemap.xml` (confirm WP generates one — RankMath auto-generates if installed) | Aiden | Day 0 |
| GSC baseline export — Search Console → Performance → Export full data | Aiden | **Day 0 anchor** — this is the Q3 SEO lift measurement baseline. Every day delayed makes the delta harder to attribute. |
| Set preferred domain (no-www) in GSC Legacy Settings if not auto-detected | Aiden | Day 1 |

### Week 1 GSC Tasks

| Task | What to check | Target |
|------|--------------|--------|
| Coverage report | How many pages indexed within 7 days of launch | >50% of 98 WP pages indexed in week 1 |
| Crawl errors | Any 404s, server errors flagged | Zero on service pages + homepage |
| Core pages indexed | Homepage, About, all 13 service pages | Confirm indexed in URL Inspection tool |
| Sitemap submission | Confirm sitemap returns 200 and lists all pages | sitemap.xml accessible |

### Data Flow Architecture (Post-Launch)

```
reycomarine.com domain live
    ↓
GSC property verified (Aiden)
    ↓
Sitemap submitted → Google crawls + indexes
    ↓
Performance data accumulates (impressions, clicks, CTR, position)
    ↓
GSC baseline export (Day 0 anchor) ← CRITICAL — set before any other actions show up in data
    ↓
Week 4: First retainer performance check
Week 12 (end of Q3): SEO lift measurement vs Day 0 baseline
```

### Pre-Launch GSC Prep (Staging)

If `reyco.glvmarketing.ca` is a verified GSC property:
- Export the staging performance data now as a pre-migration baseline
- This captures any search impressions Google is already recording for staging URLs
- Useful for understanding how much Google has already crawled the pre-launch site

---

## Stream 3 — NAP Audit Prep

### Canonical NAP (verified)

| Field | Value | Source |
|-------|-------|--------|
| Business name | Reyco Marine & Small Engine Ltd. | Schema template + contact page |
| Short name | Reyco Marine | Used in informal contexts |
| Street | 11 White Oak Drive East | Schema template |
| City | Sault Ste. Marie | Schema template |
| Province | ON | Schema template |
| Postal code | P6B 4J7 | Schema template |
| Phone | +1 705-253-7828 | Schema template (formatted: 705-253-7828) |
| Email | parts@reycomarine.com | Schema template |
| Hours | Mon–Fri 08:00–17:00, Sat 09:00–13:00 | Schema template |

**Note on phone format consistency:** The canonical format is `705-253-7828` (with hyphens). Schema uses `+17052537828` (E.164 for machine-readability). Both are correct in their context — but all human-visible text (website, directories, GMB) should be `705-253-7828` for NAP consistency.

### Priority Directories to Audit Post-Launch

These are the highest-impact local citations for a Sault Ste. Marie marine/equipment dealer:

| Directory | NAP match priority | URL pattern |
|-----------|------------------|-------------|
| Google Business Profile | 🔴 Critical | google.com/maps |
| Facebook Business page | 🔴 Critical | facebook.com/reycomarine (confirm handle) |
| Instagram | 🟡 High | instagram.com (confirm handle from sameAs in schema) |
| Yellow Pages Canada | 🟡 High | yellowpages.ca |
| Canada411 | 🟡 High | canada411.ca |
| Yelp Canada | 🟠 Medium | yelp.ca |
| Better Business Bureau | 🟠 Medium | bbb.org |
| Princecraft dealer locator | 🟡 High | princecraft.com |
| Mercury Marine dealer locator | 🟡 High | mercurymarine.com |
| Cub Cadet dealer locator | 🟡 High | cubcadet.ca |
| Toro dealer locator | 🟡 High | toro.com |
| Hisun dealer locator | 🟠 Medium | hisun.ca |
| E-Z-GO dealer locator | 🟠 Medium | ezgo.com |

### NAP Drift Risk Areas

Based on site history (DealerSpike predecessor domain):

1. **Old domain in directory listings** — any citation pointing to the old DealerSpike URL or the staging URL `reyco.glvmarketing.ca` needs updating post-launch to `reycomarine.com`
2. **Phone number format inconsistency** — some directories may have `(705) 253-7828` (with parentheses) vs `705-253-7828`. Both resolve to the same number but inconsistent formatting across 20+ citations is a mild negative citation signal.
3. **Business name variants** — "Reyco Marine" vs "Reyco Marine & Small Engine" vs "Reyco Marine & Small Engine Ltd." — Google tolerates minor variations but the full legal name should be the primary citation in GMB and BBB.
4. **Address format** — "11 White Oak Drive East" vs "11 White Oak Dr. E" — standardise to the schema canonical: `11 White Oak Drive East`

### NAP Audit Execution Plan (Post-Launch, May Sprint)

1. **Google it:** Search `reyco marine sault ste marie` — note the Knowledge Panel NAP (GMB data). Check for inconsistencies with schema canonical.
2. **Moz Local or BrightLocal scan** (if Aiden has access) — automated citation audit finds all directory listings and flags NAP mismatches.
3. **Manual priority sweep** — GMB, Facebook, manufacturer dealer locators (Princecraft, Mercury, Cub Cadet, Toro) — 6 directories, 30 min.
4. **Flag and batch-correct** any mismatches. Most directories have owner portals for self-correction.

---

## Summary — What Unlocks What

| Item | Gate | ETA |
|------|------|-----|
| Casey Person schema → About page | Domain live | Day 1 post-cutover |
| 6 remaining Person stubs | Charlene batch | Unknown — pending |
| GSC Day-0 baseline export | Domain live | Same day as cutover |
| Sitemap submission + GSC verify | Domain live | Day 0 |
| NAP audit execution | Domain live | Week 1 |
| Blog author schema (40 posts) | Casey Person schema live | Week 2+ |

---

*No external actions taken. Internal planning document.*  
*Prepared 2026-04-30.*
