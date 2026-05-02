# Reyco Marine — R20 WC Product REST Audit: Systemic Findings
**Prepared:** 2026-05-02 by seo agent  
**Source:** WC REST API `/wp-json/wc/v3/products` — no HTML required (WAF bypass)  
**Full data:** /tmp/r20_wc_rest_audit_v2.csv  
**Scope:** 249 published WC products (all brands)  
**Note:** 249 live products (not 374 as estimated in audit-unblock-spec — difference is draft/private products)

---

## Four Systemic Findings

| Finding | Products affected | Severity | Action |
|---------|-----------------|----------|--------|
| Meta descriptions absent (RankMath) | 249/249 (100%) | P1 | SEO agent batch write |
| Image alt text empty (primary image) | 165/229 with images (72%) | P1 | SEO agent batch write |
| Custom SEO title missing (`_reyco_meta_title`) | 53/249 (21%) | P2 | SEO agent batch write |
| Toro products have zero images | 11/11 Toro (100%) | P2 | Casey action |

---

## Finding 1 — Meta Descriptions Absent (P1 · 249/249 · SEO Agent Task)

### What's happening
`rank_math_description` post_meta is absent or empty on every published WC product. Only 1 product has the key at all, and that value is also empty. Google is generating its own snippets for every product page.

### Root cause — Task #12 gap
Task #12 (approved 2026-04-23) wrote `_reyco_meta_title` for 196/249 products from `metas-2026-04-23-approved.csv`. The same CSV contains 250 `meta_description` values that were **never written**. This was a scope gap — the task only targeted the title field, not the description field.

### Approved coverage
`metas-2026-04-23-approved.csv` has approved meta descriptions for 250 SKUs. By slug matching, approximately 133/249 current products map cleanly to approved descriptions. The remaining 116 products (newer imports: newer Mercury/Cub Cadet models added post-Task #12, some Trailer/Other) need descriptions generated.

### Fix — SEO agent (no dev needed)
Write `rank_math_description` via WC REST API `PUT /products/{id}`:
```bash
curl -X PUT "https://reyco.glvmarketing.ca/wp-json/wc/v3/products/{id}" \
  --user "$CK:$CS" \
  -H "Content-Type: application/json" \
  -d '{"meta_data": [{"key": "rank_math_description", "value": "..."}]}'
```

**Batch 1 (133 products):** Match via slug → approved CSV → write approved descriptions.  
**Batch 2 (116 products):** Generate descriptions using product name + brand template pattern.

### By brand
| Brand | Total | Has desc | Action |
|-------|-------|----------|--------|
| Echo | 68 | 0 | Generate or match — 68 approved in CSV |
| Mercury | 51 | 0 | 133 CSV approvals cover ~40; generate rest |
| Cub Cadet | 22 | 0 | Match/generate |
| Hisun | 19 | 0 | Match/generate |
| Other | 18 | 0 | Generate |
| Cannon | 16 | 0 | Match/generate |
| Minn Kota | 17 | 0 | Match/generate |
| Toro | 11 | 0 | Match/generate |
| Humminbird | 13 | 0 | Match/generate |
| Princecraft | 6 | 0 | Match/generate |
| Trailer | 8 | 0 | Generate |

---

## Finding 2 — Image Alt Text Empty (P1 · 165/229 products · SEO Agent Task)

### What's happening
165 out of 229 products that have at least one image have an empty `alt` attribute on their primary image. Google Image Search and accessibility crawlers see blank alt text.

### Exception: Echo cordless tools
63/68 Echo products have proper alt text already set (e.g. `"Echo DSRM-2600U Cordless U-Handle Brushcutter"`). These were either provided by Echo's product data feed or set during import. The 5 missing Echo alts are edge cases.

### All other brands: 0–5% coverage
| Brand | Has images | Primary alt empty | Alt% |
|-------|-----------|-------------------|------|
| Cannon | 11 | 11 | 0% |
| Cub Cadet | 22 | 22 | 0% |
| Echo | 68 | 5 | 92% |
| Hisun | 19 | 18 | 5% |
| Humminbird | 10 | 10 | 0% |
| Mercury | 51 | 51 | 0% |
| Minn Kota | 16 | 16 | 0% |
| Other | 17 | 17 | 0% |
| Princecraft | 6 | 6 | 0% |
| Toro | 0 | — | n/a (no images) |
| Trailer | 8 | 8 | 0% |

### Fix — SEO agent (no dev needed)
Write via WC REST API `PUT /products/{id}` on the images array — update `images[0].alt`:
```bash
curl -X PUT "https://reyco.glvmarketing.ca/wp-json/wc/v3/products/{id}" \
  --user "$CK:$CS" \
  -H "Content-Type: application/json" \
  -d '{"images": [{"id": IMG_ID, "alt": "..."}]}'
```

Alt text formula for products without custom alt:  
`{Product Name} | {Brand} | Reyco Marine`  
Example: `"2026 Mercury 150 HP Outboard | Mercury | Reyco Marine"`

**Total to write:** 165 products (all brands except Echo).  
**Scope:** Primary image only (images[0]). Secondary images are a lower-priority follow-up.

---

## Finding 3 — Custom SEO Title Gap (P2 · 53/249 products · SEO Agent Task)

### What's happening
53 products have no `_reyco_meta_title` custom field. Their effective meta title is the raw product name from WP, which defaults to the Lightspeed short name (e.g. `"XT1 LT50 FAB"` instead of `"XT1 LT50 | Cub Cadet | Reyco Marine"`).

### Affected brands
| Brand | Gap products |
|-------|-------------|
| Mercury | 14 (newer model codes, e.g. `2025-mercury-me-25-elpt-efi-4s`) |
| Cub Cadet | 13 (newer imports — model code slugs like `2024-cub-cadet-17aieac2a10`) |
| Other (misc) | 13 |
| Trailer | 6 |
| Toro | 4 |
| Princecraft | 3 |

### Why these were missed
These products were imported into Lightspeed/WC **after Task #12 ran** (April 23). The task12-followup.py script targeted the 250 SKUs in the approved CSV. New imports don't get titles automatically.

### Fix — SEO agent
Generate titles using the same `{Model Name} | {Brand} | Reyco Marine` template. For branded units: `{Year} {Model} | {Brand} | Reyco Marine`.

**Timeline:** Can batch-write after meta descriptions (Finding 1) — low priority given these have product names as fallback.

---

## Finding 4 — Toro Products: Zero Images (P2 · 11/11 Toro products · Casey action)

### What's happening
All 11 Toro products have no images in WC (`images: []`). Their product pages serve a broken/placeholder image.

### Affected Toro slugs
```
2026-toro-22217, 2026-toro-77503, 2026-toro-77501, 2026-toro-75747,
2026-toro-77220, 2026-toro-77319, 2022-toro-74055, 2026-toro-77404-2,
2022-toro-75634, 2022-toro-75631, 2026-toro-75237
```

### Fix
Casey to upload Toro product images via WP admin or Lightspeed sync. Alternatively, pull from Toro's dealer image library and upload via WC REST API.

---

## Non-Finding: WC Default Category = "Uncategorized"

**Not an issue.** All 249 products show `product_cat: Uncategorized` because the site uses a custom `reyco-category` taxonomy (the `reyco-category/` term archive pages). WC's built-in `product_cat` is intentionally not used for routing or display. This is by design and does not affect SEO or carousel routing.

---

## Action Queue (ordered by SEO impact)

| # | Action | Owner | Effort | Blocking? |
|---|--------|-------|--------|-----------|
| A1 | Write `rank_math_description` for 133 matched products (from approved CSV) | SEO agent | ~2hr | Product SERP CTR |
| A2 | Write primary image alt text for 165 non-Echo products | SEO agent | ~2hr | Image search + accessibility |
| A3 | Generate + write meta descriptions for 116 unmatched products | SEO agent | ~3hr | Product SERP CTR |
| A4 | Generate + write `_reyco_meta_title` for 53 gap products | SEO agent | ~1hr | Low — fallback is product name |
| A5 | Toro images | Casey | — | Toro product pages |

**A1 + A2 are highest priority** — 100% meta description miss and 72% alt text miss are the biggest gaps from this audit.

---

## Comparison vs R19 Tech-Scan Findings

| Metric | R19 (103 HTML pages) | R20 (249 WC products) |
|--------|---------------------|----------------------|
| Generic/missing meta | 79% | 100% (rank_math empty) |
| Empty alt text | 71% | 72% (primary image) |
| H1 blank | 69% | N/A (product name = H1, always populated) |
| Staging canonical | 99% | N/A (checked via HTML only) |

The R19 meta description finding (fallback text) and R20 finding (RankMath field never written) are related but distinct: R19 = generic template fallback on category/blog pages; R20 = absence of `rank_math_description` post_meta on product pages. Both result in Google writing its own snippets.

---

*R20 WC REST audit complete. Next: R21 would cover WC product_category archive pages (177 pages) — pending GHA HTML export (Tier 2, audit-unblock-spec-2026-04-30.md).*  
*Prepared 2026-05-02 — extends systemic-dev-tickets-2026-04-30.md.*
