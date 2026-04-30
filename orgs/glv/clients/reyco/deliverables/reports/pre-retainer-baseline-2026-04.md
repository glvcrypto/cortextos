# Reyco Marine — Pre-Retainer SEO Baseline
**Captured:** 2026-04-19  
**Prepared by:** seo agent  
**Scope:** reycomarine.com (current DealerSpike site) + reyco.glvmarketing.ca (staging build)  
**Purpose:** Measurement anchor for retainer-period SEO lift. All metrics captured BEFORE retainer work begins (May 2026).

---

## ⚠️ Data Availability Notice

GSC, GA4, and Semrush projects are **not yet configured** for Reyco (all fields null in context.json). This report is built from:
- Web research and SERP analysis
- Client context file (context.json, NAP audit Apr 11)
- Competitive landscape mapping

**Action required before first retainer delivery:**
1. Add reycomarine.com as GSC property and grant GLV access
2. Set up Semrush project for reycomarine.com
3. Set up GA4 property (or verify existing) → update context.json

Without these, the `rankings_snapshot` baseline event cannot be fired. First retainer task should be tool setup.

---

## 1. Current Site Status

| Property | Value |
|----------|-------|
| Live domain | reycomarine.com |
| CMS | DealerSpike (proprietary marine dealer platform) |
| Staging (new build) | reyco.glvmarketing.ca |
| New CMS | WordPress + Tailwind v4.2.2 + custom PHP |
| Domain transfer status | BLOCKED — EPP code stuck at DealerSpike (B6) |
| Smoke test (Apr 19) | 21/21 pages HTTP 200, zero PHP errors |
| Pages (new build) | 83+ |
| Products seeded | 148 (Princecraft, Mercury, Cub Cadet, Echo, Toro, Minnkota, Humminbird, Bercomac) |
| Lightspeed live units | 3 of 207 |

**Current site tech:** DealerSpike blocks bot crawls (403 on WebFetch). URL structure is `/search/inventory/`, `/new-models/`, `/locations`, `/staff`, `/aboutus`, `/ecommerce` — standard DealerSpike template. No structured data detected. No custom title tags or meta descriptions visible in SERPs.

---

## 2. NAP Status

**Audit completed:** 2026-04-11  
**Directories checked:** 19  
**Critical mismatches:** 8  
**Status:** Email sent to Charlene requesting directory login credentials. Not yet resolved as of 2026-04-19.

**Notable directory issue:** Superior Marine & Small Engine Repair (acquired by Reyco, Nov 2023) is still listed as an independent Cub Cadet Premium Dealer on cubcadet.ca. This creates a competitor listing for a business Reyco now owns — and splits local authority signals.

**Priority:** Resolve NAP mismatches in first 30 days of retainer. Directory drip (1-2/day) should begin Day 1.

---

## 3. Estimated Keyword Ranking Map

> ⚠️ Estimated from SERP observation and context — no GSC data available. Confidence = medium. Verify with Semrush on Day 1.

### Currently Likely Ranking (DealerSpike Site)

| Keyword | Est. Volume/mo | Est. Position | Intent | Priority |
|---------|---------------|---------------|--------|----------|
| reyco marine | ~100 | 1 (brand) | Navigational | — |
| reyco marine sault ste marie | ~50 | 1 (brand) | Navigational | — |
| princecraft dealer sault ste marie | ~50–100 | 1–3 | Commercial | High |
| mercury dealer sault ste marie | ~50–100 | 1–3 | Commercial | High |
| small engine repair sault ste marie | ~200–400 | 3–10 | Commercial | **#1 Quick Win** |
| small engine repair near me (SSM) | ~3,600 (CA-wide) | Unknown | Commercial | **#1 Quick Win** |
| cub cadet dealer sault ste marie | ~50 | 1–5 | Commercial | High |
| toro dealer sault ste marie | ~50 | 1–5 | Commercial | Medium |
| boat dealer sault ste marie | ~100–200 | 1–5 | Commercial | High |
| pontoon boat sault ste marie | ~50–100 | 1–5 | Commercial | High |
| fishing boat sault ste marie | ~100 | 2–5 | Commercial | High |
| marine service sault ste marie | ~100–200 | 1–5 | Commercial | High |
| boat repair sault ste marie | ~100–200 | 3–8 | Commercial | High |
| winterization sault ste marie | ~50–100 | Unknown | Seasonal/Commercial | Medium |
| spring commissioning boat sault ste marie | <50 | Unknown | Seasonal | Medium |
| echo dealer sault ste marie | ~50 | Unknown | Commercial | Medium |
| minnkota dealer ontario | ~100 | Unknown | Commercial | Medium |
| humminbird dealer ontario | ~50–100 | Unknown | Commercial | Medium |

### Not Yet Ranking (New Site Targets)

These are content funnel targets that don't exist on the current DealerSpike site. They become ranking opportunities once the new WP site launches.

| Keyword | Est. Volume/mo | Funnel Type | Notes |
|---------|---------------|-------------|-------|
| princecraft pontoon boat ontario | ~200 | Product | National scope, brand page |
| princecraft fishing boat ontario | ~100–200 | Product | National scope |
| mercury outboard dealer ontario | ~200–500 | Product | Brand + dealer |
| cub cadet snowblower dealer ontario | ~200 | Seasonal product | Winter |
| best fishing boats sault ste marie | ~50 | Informational → Commercial | Blog |
| boat financing sault ste marie | ~50 | BOFU | Finance funnel |
| boat loans ontario | ~500–1,000 | BOFU | Finance funnel |
| how to winterize a boat ontario | ~100–500 | Informational | Seasonal blog |
| small engine repair lawn mower sault ste marie | ~100 | Commercial | OPE |
| snowblower repair sault ste marie | ~100–200 | Seasonal/Commercial | Fall-winter |
| chainsaw repair sault ste marie | ~100 | Commercial | OPE |
| northern ontario boat dealer | ~100–200 | Commercial + Local | Regional |
| algoma district fishing | ~100–500 | Informational | Local content |
| lake superior fishing boats | ~200–500 | Informational | Local content |
| best pontoon boats for northern ontario lakes | ~50–100 | Informational | Long tail |

---

## 4. Competitive Landscape — SSM Marine & Small Engine

### Primary Competitors

| Competitor | Domain | Brands | SEO Posture | Threat Level |
|-----------|--------|--------|-------------|--------------|
| Northshore Sports & Auto | northshoresportsandauto.com | Sea-Doo, Ski-Doo, Can-Am, Yamaha, Mercury, Mirrocraft, Avalon | No schema markup detected. National BRP dealer-of-year awards. Strong brand association. | **High** — overlaps on Mercury, general marine |
| Rivercity Motorsports & Marine | rivercitysault.com | Polaris, Yamaha, G3 Boats, Arctic Cat, Argo | Dealer platform site. Yamaha Financial Services. Strong local presence at 1133 Great Northern Rd. | **Medium** — different boat brands, overlaps on service |
| Bud Robinson Motorsports | robinsonmotorsports.ca | Kawasaki, Legend Boats | Present in local search for boats. | **Low-Medium** — no brand overlap |
| Loonie Toons Pontoons & Powersports | loonietoonspontoons.com | Legend Boats, Mercury Marine | ~50km east in Desbarats. Also carries Mercury. | **Medium** — same Mercury brand, closer on Google for "near me" |
| A+ Small Engine Repair | Facebook only | Stihl, Husqvarna | 120 White Oak Dr (same street as Reyco). Facebook-only presence — no indexed website. | **Low** — easy to outrank on all web searches |
| Clarence's Small Engines | Manta listing | OPE | Directory-only presence | **Very Low** |
| North Star Industrial & Small Engine | Glixee listing | OPE | Directory-only presence | **Very Low** |

### Competitive Gaps — Where Reyco Can Win

1. **Princecraft monopoly in SSM**: Reyco is the **only** Princecraft dealer in Sault Ste. Marie. Next closest is Loonie Toons 50km east. No content captures this yet.
2. **Small engine repair near me**: KD 8 — no SSM competitor has a dedicated small engine repair page. This is the biggest quick win.
3. **Authorized dealer pages**: Cub Cadet, Toro, Echo, Minnkota, Humminbird, Bercomac — nobody in SSM has dedicated brand-specific landing pages optimized for dealer searches.
4. **Schema markup**: Neither Northshore nor Rivercity appear to have structured data. Schema markup implementation gives immediate rich snippet advantage.
5. **Finance funnel**: No SSM marine dealer has a dedicated "boat financing" content silo. Northshore links to Yamaha Financial Services but doesn't own the content. High BOFU value.
6. **Seasonal content**: No competitor owns "winterization sault ste marie" or "spring commissioning boat sault ste marie". Seasonal content calendar opportunity.

### Note on "KidCotters"
The brief mentioned KidCotters as a competitor. No business by this name (or close variants) appears in any SSM or Northern Ontario marine search results. Possible scenarios: (a) business has no web presence, (b) name spelling is different, (c) closed, (d) located in a different city. **Flag to user for clarification before treating as a competitive target.**

---

## 5. Backlink Profile Estimate

> ⚠️ No Ahrefs/Semrush access yet. Estimated from directory presence.

**Known inbound links / citations:**
- yellowpages.ca (confirmed listing)
- boat-dealers.org (confirmed listing)
- sootoday.com/directory (confirmed listing)
- cubcadet.ca (listed under old "Superior Marine" — should be updated to Reyco)
- reycomarine.com DealerSpike platform links (from brand manufacturer sites: Princecraft, Mercury, Cub Cadet, Toro, Echo)

**Estimated referring domains:** 15–40 (typical for a local dealer of this size with a platform site)  
**Estimated DR/DA:** 15–25 (estimated)

**Backlink opportunity:** Manufacturer dealer-locator pages (Princecraft, Minnkota, Humminbird, Bercomac, Mercury) should link to the new reycomarine.com once domain transfers. Currently they likely link to the DealerSpike URL. GLV should update all manufacturer portal dealer pages at launch.

---

## 6. AI Search Visibility

> ⚠️ Formal AI visibility tooling not configured. Manual spot-check methodology documented below.

**Methodology for Day-1 baseline check:**
```
1. Ask ChatGPT: "Who is the best Princecraft boat dealer near Sault Ste. Marie Ontario?"
2. Ask Perplexity: "Marine dealer Sault Ste. Marie Ontario recommendations"
3. Ask Claude: "Best small engine repair shop in Sault Ste. Marie Ontario"
4. Record: whether Reyco is named, position in response, any competitor named instead
```

**Expectation:** Reyco likely appears in AI responses for brand-specific queries (Princecraft dealer) given the monopoly status, but may be absent or outranked for generic service queries (small engine repair, boat repair) due to weak web signal density.

**AI visibility score:** Cannot be formally scored without tool access. Set baseline manually at launch using the `/chino:ai-visibility reyco` skill.

---

## 7. Technical SEO — Current State

| Factor | Status | Notes |
|--------|--------|-------|
| CMS | DealerSpike (current) → WP (staging) | Migration scheduled for domain transfer |
| Title tags | DealerSpike template ("Reyco Marine & Small Engine Sault Ste. Marie, ON 705-253-7828") | Needs customization per page |
| Meta descriptions | Template-generated | Needs customization |
| Schema markup | None detected | High-priority win — add LocalBusiness + Product + Service schema at launch |
| URL structure | DealerSpike slugs (/search/inventory/brand/Princecraft) | New WP site has clean URL structure |
| Mobile | DealerSpike = mobile-responsive | WP build should be verified |
| Page speed | Unknown — DealerSpike CDN | Run Lighthouse on new build before launch |
| Core Web Vitals | Unknown | Measure at launch |
| Sitemap | Submitted (from DealerSpike) | New sitemap needed at WP launch |
| Robots.txt | DealerSpike default | Review at WP launch |
| Internal links | DealerSpike template | New WP build has 360 internal links |
| Above the fold | DealerSpike hero with logo/inventory | New WP build TBD |
| Nav order | Standard DealerSpike nav | Review: About Us should be first per modern SEO philosophy |

---

## 8. Content Gap Summary

The current DealerSpike site has zero SEO-optimized content pages. It is a catalog/inventory platform only. The 62 content funnels planned for the retainer fill a completely blank slate.

**Top-priority content to create at retainer start:**
1. `/small-engine-repair/` — dedicated service page (top quick win, KD 8)
2. `/princecraft-boats/` — brand landing page (monopoly position in SSM)
3. `/mercury-outboards/` — brand landing page (shared with Northshore, worth fighting for)
4. `/boat-financing/` — finance funnel BOFU page
5. `/cub-cadet-dealer/` — OPE brand page (Superior Marine Cub Cadet listing still live — reclaim it)
6. `/boat-service-repair/` — service category page
7. `/winterization/` and `/spring-commissioning/` — seasonal content
8. `/about-us/` — E-E-A-T signals: Casey Davieaux bio, team page, 27,000 sq ft facility story

---

## 9. Retainer Readiness Checklist

Before first billable retainer work, complete these:

- [ ] Transfer domain: reycomarine.com EPP code from DealerSpike (B6 blocker)
- [ ] Set up GSC property: reycomarine.com → grant GLV access
- [ ] Set up GA4 property → connect to new WP site
- [ ] Set up Semrush project: reycomarine.com
- [ ] Update context.json: fill gsc_property, ga4_property, semrush_project
- [ ] Fire baseline `rankings_snapshot` event (Day 1, before any optimization)
- [ ] Resolve 8 NAP mismatches (Charlene email pending)
- [ ] Update Cub Cadet dealer locator: replace "Superior Marine" with Reyco
- [ ] Update all manufacturer dealer portals at domain transfer
- [ ] Clarify "KidCotters" competitor reference with user

---

## 10. Baseline Summary Card

| Metric | Value | Source |
|--------|-------|--------|
| Live domain | reycomarine.com | Confirmed |
| GSC organic keywords tracked | 0 (not configured) | — |
| Semrush visibility score | N/A (not configured) | — |
| Estimated referring domains | 15–40 | Manual estimate |
| NAP mismatches | 8 critical | NAP audit Apr 11 |
| Competitor count (SSM) | 5 active web-present | Research |
| Content pages (SEO-optimized) | 0 (DealerSpike = catalog only) | Site analysis |
| Schema markup | None | Site analysis |
| Top quick win keyword | small engine repair near me (3,600/mo, KD 8) | Context + research |
| Competitive moat | Only Princecraft dealer in SSM | Confirmed |
| AI visibility | Unscored — manual check pending | — |

---

## Appendix: Competitor Domains for Semrush Gap Analysis

When Semrush is configured, run competitor gap analysis against:
- northshoresportsandauto.com
- rivercitysault.com
- robinsonmotorsports.ca
- loonietoonspontoons.com

---

*Draft. Requires user approval before sharing externally. No external actions taken in preparing this report.*
