# Reyco Marine — R15: Category Page Batch Audit (20 pages)
**Prepared:** 2026-04-30 by seo agent  
**Source data:** tech-scans/ (20 pages, scraped from reyco.glvmarketing.ca staging)  
**Protocol:** 8-point checklist — meta title, meta description, H1, heading hierarchy, schema, internal linking, image alt, canonical  
**Scope:** All 20 pages in tech-scans/ not covered in R2–R14 (pre-launch service page audit sprint)

---

## Systemic Issues (affect 15–19 of 20 pages)

These are template/plugin-level problems — not fixable page-by-page. One dev fix resolves them at scale.

### SYS-1 — Generic fallback meta description on 19/20 pages

**Affected:** All category pages except `/service/atv-utv-repair/`  
**Current value (every page):**
> "Reyco Marine & Small Engine Ltd. — boats, motors, lawn and snow equipment sales and service in Sault Ste. Marie, Ontario."

**Why this is a problem:**
- Google sees near-identical meta content across 19 pages → SERP de-duplication risk
- Generic description doesn't match page intent → lower CTR
- Carries zero keyword signal for category-specific queries ("cannon downriggers sault ste marie", "echo chainsaw dealer", "e-z-go golf carts sault ste marie")

**Root cause:** No SEO plugin installed — RankMath/Yoast not detected on staging. Without a plugin, WP/WC serves the site-wide tagline as fallback meta for all pages.

**Fix:** Install RankMath (already flagged P0 in pre-launch polish pass). Once active, write page-specific metas for priority category pages — drafts below.

---

### SYS-2 — Blank H1 on 16/20 pages

**Affected pages (H1_TEXT empty in tech-scan):**
- Meet the Team, Cannon Downriggers, Minn Kota, Pontoons, Gas Blowers, Echo 56V Cordless, Cordless Chainsaws, Cordless Mowers, Cordless Trimmers, Echo, Edgers, Hedge Trimmers, Power Pruners, Pressure Washers, Pro Attachment Series (PAS), ATV/UTV Repair

**Pages with H1 present:**
- Cordless Blowers ("Cordless Blowers"), Troy-Bilt ("Troy-Bilt Outdoor Power Equipment"), E-Z-GO Golf Carts ("E-Z-GO Golf Carts"), Apply for Financing ("Apply for Financing")

**Why this is a problem:**
- Google treats H1 as the strongest on-page keyword signal
- Missing H1 forces Google to use the `<title>` tag as the primary text signal — doubles pressure on the title
- Blank H1 = Google may rewrite the SERP snippet with arbitrary page text

**Root cause:** WC category template uses a theme-specific H1 render. The pages with H1 present appear to use a content-block approach (Cordless Blowers, Troy-Bilt, E-Z-GO have explicit `wc-product-category-description` or page builder H1 blocks). Pages without H1 have no page-builder content block — the theme generates `<h1></h1>` with the category name from WC but the JS that populates it is failing, OR the category name is empty in WC admin.

**Fix (two-part):**
1. **Dev:** Check WC taxonomy term "name" field for each blank-H1 category in WP Admin → Products → Categories. If the WC category name is set, the theme template bug is injecting empty H1. Fix the template to use `get_queried_object()->name`.
2. **SEO:** Confirm the category name for each page matches the intended H1 text (see drafts below).

---

### SYS-3 — ALT_EMPTY on images (15/20 pages)

**Affected:** All lawn/garden pages + Pontoons, E-Z-GO, ATV/UTV Repair (6 empty!)

**Distribution:**
| ALT_EMPTY count | Pages |
|-----------------|-------|
| 6 | ATV/UTV Repair |
| 1 | Pontoons, Cordless Blowers, 56V, Cordless Chainsaws, Cordless Mowers, Cordless Trimmers, Echo, Edgers, Hedge Trimmers, Power Pruners, Pressure Washers, Pro Attachment Series, Troy-Bilt, E-Z-GO |
| 0 | Meet the Team, Cannon Downriggers, Minn Kota, Gas Blowers, Apply for Financing |

**Fix:** Dev — add descriptive alt text to all `alt=""` images. SEO recommends format: `"[Brand] [product type] — Reyco Marine, Sault Ste. Marie"` (see per-page drafts below where highest priority).

---

### SYS-4 — EMPTY_STATE_FIRES (product carousel not loading — 3 pages)

| Page | Empty state fires |
|------|------------------|
| Cordless Blowers | 32 |
| Troy-Bilt | 50 |
| E-Z-GO Golf Carts | 50 |

**Why this is a problem:** Product carousels firing 50 empty states = the page is rendering product slots but the WC query is returning zero products. Google crawls the empty HTML — no product content, just empty wrappers. The `<h1>` may be present on these pages precisely because they have manually-added page-builder content (the WC category description block + H1 were added by dev as a workaround for the empty carousel state).

**Fix:** Dev — confirm WC product data is seeded for these categories. Troy-Bilt and Cordless product lines may not have products imported yet. E-Z-GO (golf carts) is a low-priority category (KD higher, niche product).

---

## Per-Page Priority Table

| Page | URL | H1 | Meta | Alt | Empty | Priority | Notes |
|------|-----|----|------|-----|-------|----------|-------|
| Meet the Team | /about/meet-the-team/ | ❌ blank | ❌ generic | ✅ | ✅ | P0 | Already flagged in pre-launch pass (C1/C2 — ready-ship copy banked) |
| ATV/UTV Repair | /service/atv-utv-repair/ | ❌ blank | ✅ custom | ❌ 6 empty | ✅ | P0 | R3 — schema tasks S2/S3, alt fix D1 already flagged |
| E-Z-GO Golf Carts | /powersports/easy-go/ | ✅ | ❌ generic | ❌ 1 | ❌ 50 fires | P1 | Product catalog not seeded — empty carousel; H1 present |
| Troy-Bilt | /lawn-and-garden/troy-bilt/ | ✅ | ❌ generic | ❌ 1 | ❌ 50 fires | P1 | Same empty carousel pattern; brand page without products |
| Cordless Blowers | /lawn-and-garden/cordless/blowers/ | ✅ | ❌ generic | ❌ 1 | ❌ 32 fires | P2 | Cordless subcategory — low organic volume |
| Echo (brand hub) | /lawn-and-garden/echo/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P2 | Echo is a key brand (authorized dealer) — needs H1 + meta |
| Cannon Downriggers | /boats-and-marine/cannon/ | ❌ blank | ❌ generic | ✅ | ✅ | P2 | Branded accessory page; KD=0 local term |
| Minn Kota | /boats-and-marine/minnkota/ | ❌ blank | ❌ generic | ✅ | ✅ | P2 | Same as Cannon — authorized accessory brand |
| Pontoons | /boats-and-marine/pontoons/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P2 | Product category — medium priority |
| Gas Blowers | /lawn-and-garden/blowers/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Subcategory — low volume; Echo brand carries the term |
| Echo 56V Cordless | /lawn-and-garden/cordless/56v/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Subcategory within Echo cordless |
| Cordless Chainsaws | /lawn-and-garden/cordless/chainsaws/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Subcategory — chainsaw queries typically go to repair page |
| Cordless Mowers | /lawn-and-garden/cordless/mowers/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Subcategory |
| Cordless Trimmers | /lawn-and-garden/cordless/trimmers/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Subcategory |
| Edgers | /lawn-and-garden/edgers/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Low-volume category |
| Hedge Trimmers | /lawn-and-garden/hedge-trimmers/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Low-volume category |
| Power Pruners | /lawn-and-garden/power-pruners/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Low-volume category |
| Pressure Washers | /lawn-and-garden/pressure-washers/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Low-volume; confirm Reyco stocks these |
| Pro Attachment Series | /lawn-and-garden/pro-attachment-series/ | ❌ blank | ❌ generic | ❌ 1 | ✅ | P3 | Echo PAS system — niche, authorized dealer signal |
| Apply for Financing | /financing/apply/ | ✅ | ❌ generic | ✅ | ✅ | P2 | Finance page needs a meta — trust/conversion page |

---

## Priority Meta Description Drafts

These pages need custom metas once RankMath is installed. Highest-priority first.

### P1 — E-Z-GO Golf Carts (`/powersports/easy-go/`)
```
E-Z-GO golf carts and electric vehicles at Reyco Marine & Small Engine in Sault Ste. Marie. Authorised E-Z-GO dealer — sales, parts and service. Call 705-253-7828.
```
*(158 chars)*

### P1 — Troy-Bilt (`/lawn-and-garden/troy-bilt/`)
```
Troy-Bilt outdoor power equipment at Reyco Marine & Small Engine, Sault Ste. Marie. Mowers, tillers and snowblowers. Sales and authorised service. Call 705-253-7828.
```
*(165 chars — trim to: "Troy-Bilt mowers, tillers and snowblowers at Reyco Marine in Sault Ste. Marie. Authorised sales and service. Call 705-253-7828." = 128 chars)*

**Final (128 chars):**
```
Troy-Bilt mowers, tillers and snowblowers at Reyco Marine in Sault Ste. Marie. Authorised sales and service. Call 705-253-7828.
```

### P2 — Echo Brand Hub (`/lawn-and-garden/echo/`)
```
Echo outdoor power equipment at Reyco Marine & Small Engine in Sault Ste. Marie. Authorised Echo dealer — chainsaws, blowers, trimmers and more. Call 705-253-7828.
```
*(163 chars — trim: "Echo chainsaws, blowers and trimmers at Reyco Marine in Sault Ste. Marie. Authorised Echo dealer. Sales and service. Call 705-253-7828." = 135 chars)*

**Final (135 chars):**
```
Echo chainsaws, blowers and trimmers at Reyco Marine in Sault Ste. Marie. Authorised Echo dealer. Sales and service. Call 705-253-7828.
```

### P2 — Cannon Downriggers (`/boats-and-marine/cannon/`)
```
Cannon downriggers at Reyco Marine & Small Engine in Sault Ste. Marie. Authorised Cannon dealer. In-store and order available. Call 705-253-7828.
```
*(145 chars)*

### P2 — Minn Kota Trolling Motors (`/boats-and-marine/minnkota/`)
```
Minn Kota trolling motors at Reyco Marine & Small Engine in Sault Ste. Marie. Authorised dealer. In-store and order available. Call 705-253-7828.
```
*(145 chars)*

### P2 — Pontoons (`/boats-and-marine/pontoons/`)
```
Pontoon boats at Reyco Marine & Small Engine in Sault Ste. Marie. New pontoon packages — hull, motor, trailer. We size it to your lake. Call 705-253-7828.
```
*(155 chars)*

### P2 — Apply for Financing (`/financing/apply/`)
```
Apply for financing on a new boat, mower or snowblower at Reyco Marine in Sault Ste. Marie. Fast approval. Call 705-253-7828 to discuss options.
```
*(144 chars)*

---

## H1 Text Drafts (for WC Category Name correction)

For dev to verify/set in WP Admin → Products → Categories:

| Page | WC Category Name / H1 Target |
|------|------------------------------|
| Cannon | Cannon Downriggers |
| Minn Kota | Minn Kota Trolling Motors |
| Pontoons | Pontoon Boats |
| Gas Blowers | Gas Blowers |
| Echo 56V Cordless | Echo 56V Cordless System |
| Cordless Chainsaws | Cordless Chainsaws |
| Cordless Mowers | Cordless Mowers |
| Cordless Trimmers | Cordless Trimmers |
| Echo (brand hub) | Echo Outdoor Power Equipment |
| Edgers | Edgers |
| Hedge Trimmers | Hedge Trimmers |
| Power Pruners | Power Pruners |
| Pressure Washers | Pressure Washers |
| Pro Attachment Series | Echo Pro Attachment Series (PAS) |
| ATV/UTV Repair | ATV & UTV Repair |
| Meet the Team | Meet the Reyco Marine Team (→ already in C1 fix) |

---

## Dev Action Summary

| # | Action | Scope | Priority |
|---|--------|-------|----------|
| DEV-1 | Install RankMath (or Yoast) — **already P0 in pre-launch polish pass** | Site-wide | P0 |
| DEV-2 | Fix blank H1 on category pages — check WC category term names in WP Admin; fix template H1 render if names are set | 16 pages | P0 |
| DEV-3 | Fill ALT_EMPTY on ATV/UTV Repair (6 images) | /service/atv-utv-repair/ | P0 |
| DEV-4 | Investigate EMPTY_STATE_FIRES on E-Z-GO, Troy-Bilt, Cordless Blowers — confirm WC products are seeded | 3 pages | P1 |
| DEV-5 | Fill ALT_EMPTY on 14 lawn/garden + boats pages (1 each) | 14 pages | P2 |

---

## What This Audit Does NOT Cover

- Homepage (`/`) — brief produced separately (homepage-seo-brief-2026-04-30.md); full audit gated on copy draft
- 250 WC product pages — covered in Task #12 batch (meta/title done; carousel/schema pending dev)
- Blog / post pages — none exist (Reyco has no blog at launch)
- Archive/noindex pages — covered in Task #16 (49-page remediation memo)

**Running audit total:** 33 pages audited of 689 (13 service/hub pages R2–R14 + 20 category pages R15)

---

*No external actions taken. Internal audit only — for boss review + dev dispatch post-domain cutover.*  
*Prepared 2026-04-30.*
