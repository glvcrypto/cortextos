# Reyco Marine — Product-Page SEO Audit
**Prepared:** 2026-04-23 by seo agent  
**Scope:** All 250 WooCommerce product pages  
**Source data:** product-image-audit-2026-04-23.csv + reyco-master-tag-mapping-250.csv  
**Note:** Site is pre-migration (reycomarine.com not yet accessible). This is a specification-level audit — fix queue for dev to implement during/after WP migration. A live-crawl validation audit should follow within 2 weeks of go-live.

---

## Executive Summary

| Severity | Issues Found | Products Affected |
|----------|-------------|-------------------|
| P1 — Critical | 4 issues | 250 / 250 |
| P2 — High | 3 issues | 202 / 250 |
| P3 — Medium | 3 issues | ~200 est. |
| P4 — Low | 2 issues | 14 / 250 |

**Bottom line:** Every single product page has at least one P1 issue. The site cannot rank competitively for product keywords until the P1 and P2 queue is cleared. Echo (68 products) is closest to ready — images exist and are square. Mercury (50 products), Toro (23), R&J Machine (15), Cub Cadet (10) have zero images and raw model-code titles — these pages are essentially invisible to Google right now.

---

## P1 — Critical (blocks rich results and ranking)

### P1-A: Raw model-code product titles — 236 of 250 products

**What's wrong:** WooCommerce inherits product names from Lightspeed import. Current names are internal OEM codes: `2021 Mercury ME 2.5MH 4S TMC`, `2022 Easy Hauler AL-PTDB2026-TRI`. These become the `<title>` tag and H1 heading on every product page. Google can't match these to how customers search.

**Why it matters:** Title tag is the single highest-weight on-page ranking signal. A title that reads `2022 MERCURY ME 30 ELPT EFI 4S` will not rank for `Mercury 30HP outboard Sault Ste Marie`.

**Fix:** Override product titles using Yoast/RankMath SEO title field for each product. Consumer-friendly names are already built in `reyco-master-tag-mapping-250.csv` column `tag_product_name`. Pattern:

```
{tag_product_name} | {tag_brand} | Reyco Marine
```

Example:
- Raw: `2021 Mercury ME 2.5MH 4S TMC`
- SEO title: `2.5 HP Outboard | Mercury | Reyco Marine`

**Affected brands (products with model-code names):**
| Brand | Raw-name products |
|-------|------------------|
| Mercury | 50 |
| Toro | 23 |
| Hisun | 19 |
| Cannon | 16 |
| R&J Machine | 15 |
| Cub Cadet | 10 |
| Easy Hauler | 4 (+ 10 Trailer) |
| Princecraft | 4 |
| Echo | ~68 (Echo names are cleaner but still benefit from title template) |
| Humminbird | 13 |
| Minn Kota | 17 |

**Dev effort:** Bulk import via WP All Import or WooCommerce CSV import using `tag_product_name` column as SEO title field. Do not manually update 236 products.

---

### P1-B: Missing product images — 125 of 250 products (50%)

**What's wrong:** Half the product catalogue has no image in WooCommerce.

**Why it matters:**
1. Google Product schema requires an `image` field to be eligible for rich results (product carousels in Google Shopping / image search).
2. Pages without images have significantly lower CTR from organic results.
3. WooCommerce carousel shortcodes render a placeholder thumbnail — looks broken.

**Affected brands (0% image coverage):**
| Brand | Products | Source |
|-------|----------|--------|
| Mercury | 50 | OEM CDN blocks hotlinks — download from mercurymarine.com + re-upload to WP media |
| Toro | 23 | Request from Toro dealer portal or toro.com |
| R&J Machine | 15 | Request from R&J Machine directly |
| Cub Cadet | 10 | Request from Cub Cadet dealer portal |
| Trailer | 10 | Casey to confirm brand, then source from manufacturer |
| Easy Hauler | 4 | Source from easyhauler.ca |
| Princecraft | 4 | Available at princecraft.com — download + re-upload |

**Partial coverage (need fill-in):**
| Brand | Missing images | Total |
|-------|---------------|-------|
| Cannon | 5 | 16 |
| Humminbird | 3 | 13 |
| Minn Kota | 1 | 17 |

**Fix:** Image sourcing dispatched separately in image audit workflow. For SEO purposes, images must be loaded before go-live on reycomarine.com.

---

### P1-C: Missing meta descriptions — all 250 products

**What's wrong:** WooCommerce generates no meta descriptions by default. Without a Yoast/RankMath meta description, Google auto-excerpts whatever text it finds on the page — often a random spec line or navigation element.

**Why it matters:** Meta descriptions control the snippet text in search results. A compelling snippet increases CTR even when you're not in position 1. A random auto-excerpt destroys CTR.

**Fix:** For each product page, write a meta description using this pattern (150–160 characters):

```
Buy the {consumer_product_name} from {brand} at Reyco Marine — {brief 1-line spec or value prop}. Serving Sault Ste. Marie & Northern Ontario.
```

Examples:
- `Buy the 30 HP EFI Outboard from Mercury at Reyco Marine — reliable 4-stroke with EFI for Northern Ontario boaters. Serving Sault Ste. Marie & Northern Ontario.`
- `Buy the Recycler Walk-Behind Mower from Toro at Reyco Marine — self-propelled, Briggs & Stratton engine. Sault Ste. Marie's Toro dealer.`

**Dev effort:** Bulk import via WooCommerce CSV or WP All Import using generated descriptions. SEO agent can generate meta descriptions for all 250 products as a follow-on task once product titles are confirmed.

---

### P1-D: Incomplete Product schema — all 250 products

**What's wrong:** WooCommerce auto-generates a basic `Product` schema, but it is missing:
- `brand` — not included by default
- `sku` in canonical format — WC uses internal ID, not the canonical SKU
- `seller` with geo-linked LocalBusiness `@id`
- `image` — missing for the 125 no-image products (schema will be invalid for rich results)

**Why it matters:** Google's rich results eligibility for product pages requires a valid Product schema with `name`, `image`, `offers`, and ideally `brand`. Incomplete schema = no product carousels in search.

**Fix:** Implement the Product schema template from `schema-markup-templates.md` (section 6) via the `woocommerce_structured_data_product` filter or via Yoast/RankMath product schema fields. The `canonical_sku` and `tag_brand` columns in `reyco-master-tag-mapping-250.csv` provide the correct values for each product.

---

## P2 — High (hurts CTR and ranking signals)

### P2-A: Missing image alt text — 125 products with images have no confirmed alt text

**What's wrong:** WooCommerce does not auto-populate image alt text from product names. Images uploaded without manual alt text are blank — Google treats them as decorative.

**Why it matters:** Image alt text is a direct ranking signal for Google Image Search and contributes to page relevance signals. For product pages, a blank alt text is a wasted keyword opportunity.

**Fix:** For every product image, set alt text to:
```
{consumer_product_name} — {brand} — Reyco Marine
```
Example: `30 HP EFI Outboard — Mercury — Reyco Marine`

This can be set in bulk via the WP media library or via WooCommerce CSV import (featured image alt field).

**Affected:** All 125 products that currently have images. The 48 products in `action_needed=none` (Echo) should be done first as they are image-ready.

---

### P2-B: Non-square product images — 77 products need re-crop

**What's wrong:** 63 products have images with >20% aspect ratio deviation from 1:1 (need re-crop). 14 have 5–20% deviation (designer QC edge cases).

**Why it matters:**
1. WooCommerce carousels display square thumbnails — non-square images render with letterboxing or cropping artifacts.
2. Google Product images are displayed as squares in Shopping and rich results — non-square images may be cropped poorly or deprioritized.

**Fix:** Re-crop to 1:1 (800×800px minimum recommended). See image audit file for the specific 63 SKUs requiring re-crop.

---

### P2-C: URL slug quality — unknown, needs dev check

**What's wrong:** WooCommerce generates product URL slugs from the product title at time of import. If Lightspeed raw names were the source, slugs may be:
- `/product/2022-mercury-me-30-elpt-efi-4s/` (model code — poor)
- `/product/mercury-30-hp-efi-outboard/` (consumer name — good)

**Why it matters:** URL slugs are a minor but real ranking signal, and messy slugs make internal linking and breadcrumbs harder to manage.

**Fix:** Dev to audit slug patterns after WP migration. If slugs are model-code-based, regenerate from `tag_product_name` using WooCommerce's "Regenerate slugs" functionality. Redirect old slugs to new (301) if products were already indexed.

---

## P3 — Medium (optimization opportunity, not blocking)

### P3-A: Thin or absent product descriptions — estimated ~180+ products

**What's wrong:** Lightspeed-imported products likely have no long-form product description — just a product name and possibly a short description field. Products without descriptions are thin-content pages.

**Why it matters:** Google increasingly penalizes thin product pages, especially in competitive niches. A page that only has a product title, a price, and an add-to-cart button will rank poorly against competitors who have spec tables, feature bullets, and context paragraphs.

**Fix priority order:**
1. Service-linked products first: outboards (Marine > Outboards — 50 products), snowblowers/lawn mowers (cross-sell to service pages)
2. High-margin brands: Princecraft boats (4 products), Hisun UTVs (14)
3. Highest search volume subcategories: Zero Turn Mowers (26), Chainsaws (20)

Minimum acceptable description per product:
- 3–5 bullet features (from OEM spec sheet)
- 1 sentence geo-anchoring to Reyco Marine / Sault Ste. Marie
- Link to relevant service page where applicable (e.g., outboards → /service-and-repair/boat-service/)

---

### P3-B: Internal linking gaps — service cross-links missing

**What's wrong:** Product pages for outboards, snowblowers, lawn mowers, and other serviced equipment should link to the corresponding service pages. Currently no such links exist (service pages are not yet built).

**Why it matters:** Internal links pass authority between pages and help Google understand site topical relevance. A Mercury outboard product page that links to the Marine Service page signals that Reyco is an authoritative source for both sales AND service — not just a storefront.

**Fix (once service pages are live):**
| Product subcategory | Link to service page |
|--------------------|---------------------|
| Outboards | `/service-and-repair/boat-service/` |
| Trolling Motors | `/service-and-repair/boat-service/` |
| Walk-Behind / Zero Turn Mowers | `/service-and-repair/small-engine-repair/` |
| Chainsaws / Trimmers / Blowers | `/service-and-repair/small-engine-repair/` |
| Boats (Princecraft) | `/service-and-repair/boat-winterization/` + `/service-and-repair/spring-commissioning/` |

---

### P3-C: Breadcrumb navigation — not confirmed present

**What's wrong:** WooCommerce includes breadcrumb functionality but it requires theme support. Without the tag taxonomy applied (just being done now), breadcrumbs have no category hierarchy to traverse.

**Why it matters:** Breadcrumbs appear in Google SERPs as path elements below the URL. They also add BreadcrumbList schema, which improves rich result eligibility.

**Fix:** Once the 4-tag taxonomy is applied via the tag-mapping CSV:
1. Confirm the WP theme outputs breadcrumbs on product pages
2. If not, install a breadcrumb plugin (Yoast Breadcrumbs or WP Breadcrumb Trail) 
3. Breadcrumb schema is auto-generated by Yoast/RankMath if breadcrumbs are active

---

## P4 — Low (polish)

### P4-A: 14 designer QC edge cases (5–20% aspect ratio deviation)

These 14 images are not broken but are sub-optimal. Schedule a designer QC pass after P1/P2 work is complete. SKUs listed in the image audit file under `action_needed=designer_qc_edge_case`.

---

### P4-B: Canonical tag audit (post-go-live)

WooCommerce adds canonical tags automatically, but products accessible via multiple URLs (e.g., shop/product-name/ AND product-category/sub/product-name/) can produce duplicate content signals. Audit canonical tags after go-live by checking 5–10 products in GSC > URL Inspection to confirm canonical URLs are self-referencing and consistent.

---

## Fix Queue — Priority Order for Dev

| Priority | Fix | Products | Effort | Who |
|----------|-----|----------|--------|-----|
| P1-A | Bulk import consumer-friendly SEO titles from tag mapping CSV | 236 | 2h (bulk import) | Dev |
| P1-B | Source and upload missing product images | 125 | Ongoing (image sourcing task) | Dev + Casey |
| P1-C | Bulk import meta descriptions | 250 | 4h (SEO agent generates, dev imports) | SEO + Dev |
| P1-D | Implement Product schema template | 250 | 2h (WC filter or Yoast) | Dev |
| P2-A | Set image alt text on all existing product images | 125 | 2h (bulk via CSV) | Dev |
| P2-B | Re-crop 63 non-square product images | 63 | 3–4h | Dev / Designer |
| P2-C | Audit and fix URL slugs | 250 | 1h audit + vary | Dev |
| P3-A | Write product descriptions (priority brands first) | ~180 | Ongoing | SEO agent |
| P3-B | Add service page cross-links to product pages | ~110 | 1h (once service pages live) | Dev |
| P3-C | Confirm breadcrumb navigation active | all | 30 min | Dev |
| P4-A | Designer QC on 14 edge-case images | 14 | 1h | Designer |
| P4-B | Canonical tag spot-check | 10–20 | 30 min (post go-live) | SEO agent |

---

## Image-Ready Products (Echo — 48 products, action=none)

These 48 Echo products are the only ones fully image-ready right now. Dev can apply P2-A (alt text) immediately on these. Once P1-A (title override) and P1-C (meta description) are done for Echo, those 48 pages are production-ready.

---

## Source Files Referenced

| File | Path |
|------|------|
| Master tag mapping (250 rows) | `orgs/glv/clients/reyco-marine/assets/product-images/reyco-master-tag-mapping-250.csv` |
| Image audit (250 rows) | `orgs/glv/clients/reyco/audit/product-image-audit-2026-04-23.csv` |
| Schema templates | `orgs/glv/clients/reyco/deliverables/seo/schema/schema-markup-templates.md` |
| Apply-now tag mapping (189 rows) | `orgs/glv/clients/reyco-marine/assets/product-images/reyco-product-tag-mapping-v3-apply-now.csv` |

---

## Next Steps (SEO Agent)

1. Generate meta descriptions for all 250 products (can be done now from tag mapping data — no site access needed)
2. Post this audit to #internal-reyco for dev + user review
3. Live-crawl validation audit 2 weeks after reycomarine.com go-live

---

*Pre-migration specification audit. Live-crawl validation required post-launch. Not applied to live site.*
