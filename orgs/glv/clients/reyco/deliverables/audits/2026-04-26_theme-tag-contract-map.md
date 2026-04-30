# Phase A: Theme Tag-Contract Map
**Date:** 2026-04-26  
**Scope:** Read-only grep of reyco-marine theme — all taxonomy consumers + seeder write targets  
**Status:** COMPLETE

---

## CRITICAL FINDING: reyco-category is NOT a separate taxonomy

Boss raised the hypothesis that `/reyco-category/[slug]/` URLs indicate a custom taxonomy distinct from what the seeder writes. **This is false.** `reyco-category` is the URL **rewrite slug** for the `product_category` taxonomy — not a taxonomy name:

```php
// functions.php:237
register_taxonomy('product_category', 'product', [
    'rewrite' => ['slug' => $wc_active ? 'reyco-category' : 'product-category', 'with_front' => false],
    ...
]);
```

When WooCommerce is active, `product_category` term archives resolve to `/reyco-category/[term-slug]/`. The taxonomy key is still `product_category`. **No taxonomy-level mismatch.**

---

## Seeder Write Targets (v3)

**File:** `inc/seed-product-tags-v3.php`

Tag array structure per SKU: `[main_category, subcategory, brand, product_name]`

```
tags[0] = main category   → written to product_tag
tags[1] = subcategory     → written to product_category  ← drives archive pages
tags[2] = brand           → written to product_brand     ← drives brand pages
tags[3] = product name    → written to product_tag (included in the full tags[] set)
```

**Write calls:**
```php
wp_set_object_terms($product_id, $tags,    'product_tag',      false);  // all 4 strings
wp_set_object_terms($product_id, $tags[2], 'product_brand',    false);  // brand name
wp_set_object_terms($product_id, $tags[1], 'product_category', false);  // subcategory name
```

WordPress auto-slugifies on create: `"Outboard Motors"` → term slug `outboard-motors`, `"Fishing Boats"` → `fishing-boats`, `"Mercury"` → `mercury`, etc.

**Seeder run-once guard:** checks `get_option('reyco_tag_apply_v3', 'run')`. If option = `'done'`, no-op. Results written to `wp option get reyco_tag_apply_v3_results` (JSON) and `wp-content/uploads/reyco-tag-results.csv`.

---

## Taxonomy Read Consumers (theme)

### 1. single-product.php — Product hero + related carousel

| Line | Query | Taxonomy | Field | Purpose |
|------|-------|----------|-------|---------|
| 21 | `get_the_terms(ID, 'product_brand')` | product_brand | — | Hero brand badge, brand name display |
| 22 | `get_the_terms(ID, 'product_category')` | product_category | — | Hero breadcrumb, category label + link |
| 33 | `wp_get_post_terms(ID, 'product_category', ['fields'=>'ids'])` | product_category | ids | Compare product query |
| 241 | `WP_Query tax_query product_category terms=$related_terms` | product_category | ids | Related products carousel (8 items) |

**Contract:** Product must have `product_category` assigned for breadcrumb, compare widget, and related carousel to render. Product must have `product_brand` assigned for brand badge.

---

### 2. front-page.php — Homepage subcategory carousels

| Line | Query | Taxonomy | Field | Source of slug |
|------|-------|----------|-------|----------------|
| 234 | `WP_Query tax_query product_category field=slug terms=[$sub['slug']]` | product_category | slug | `$mc['subs'][n]['slug']` from menu config |

The homepage iterates the mega-menu data structure (from `inc/menu-data.php`) and for each submenu entry with a `slug` field, queries `product_category` by that slug for an 8-product carousel.

**Contract:** Product must have `product_category` term whose slug exactly matches the subcategory menu slug (e.g. `fishing-boats`, `pontoons`, `outboard-motors`).

---

### 3. page-templates/product-category.php — All category/brand archive pages

This template handles every page under `/boats-and-marine/`, `/powersports/`, etc.

**Slug resolution (lines 261–286):**
```php
// Page slug checked against product_brand first:
$brand_term_lookup = get_term_by('slug', $slug, 'product_brand');
// Then checked against product_category:
$cat_term_lookup   = get_term_by('slug', $slug, 'product_category');
```

**Query builder: `reyco_brand_scoped_query_args()` (lines 178–190):**
```php
function reyco_brand_scoped_query_args($base_args, $extra_tax, $brand_slug, $category_slug) {
    $tax_query = [];
    if ($category_slug) $tax_query[] = ['taxonomy'=>'product_category','field'=>'slug','terms'=>$category_slug];
    if ($brand_slug)    $tax_query[] = ['taxonomy'=>'product_brand',   'field'=>'slug','terms'=>$brand_slug];
    if (count($tax_query) > 1) $tax_query['relation'] = 'AND';
    ...
}
```

**AND relation trigger:** When a page slug matches BOTH a `product_brand` term AND a `product_category` term (or when a URL like `/boats-and-marine/mercury/outboard-motors/` provides both), the query uses `relation: AND`. Products must have **both** terms assigned to appear.

**Fallback (lines 277–286):** If page slug has no exact `product_category` term match, falls back to collecting `taxonomy_term` values from subcategory config array as a multi-slug OR query.

**Contract:** Products must have `product_brand` slug AND/OR `product_category` slug matching the page slug for all items under this template.

---

### 4. page-templates/brand-catalogue.php — Brand dealer catalogue pages

| Line | Query | Taxonomy | Field | Purpose |
|------|-------|----------|-------|---------|
| 48–51 | `get_term_by('name'/'slug', $brand_name, 'product_brand')` | product_brand | slug | Resolve brand term from page |
| 59 | `WP_Query tax_query product_brand` | product_brand | slug | All products for brand |
| 73 | `get_the_terms($id, 'product_category')` | product_category | — | Group products by category on page |

**Contract:** Products must have `product_brand` assigned to appear in brand catalogue. `product_category` needed for grouping/sorting within catalogue.

---

### 5. page-templates/inventory.php — Dynamic inventory filter page

Reads `product_category` and `product_brand` from URL query params / AJAX filter selections to build dynamic `WP_Query`. Filter options are populated from all assigned terms on visible products.

**Contract:** Products must have both `product_category` and `product_brand` assigned to be filterable. Products missing either taxonomy appear in unfiltered view only.

---

### 6. template-parts/subcategory-section.php — Subcategory grid blocks

```php
$taxonomy = $args['taxonomy'] ?? 'product_category';
// WP_Query tax_query by $taxonomy + term slug
```

Defaults to `product_category`. Can accept `product_brand` for brand-scoped grids. Used inside product-category.php for subcategory breakdowns (6-item grids per subcategory).

**Contract:** Products need `product_category` term matching the section's term slug.

---

### 7. template-parts/product-card.php — Product card brand badge

```php
$brands = wp_get_post_terms($id, 'product_brand', ['fields' => 'names']);
```

Displays brand name in product card badge. No brand term = no badge rendered.

---

### 8. functions.php — Registered taxonomies + related products helper

**Taxonomy registrations (lines 227–253):**
- `product_category`: custom hierarchical, registered on `product` CPT, rewrite slug `reyco-category` (WC active) / `product-category` (WC inactive)
- `product_brand`: custom hierarchical, registered on `product` CPT, rewrite slug `brand`
- Note: These are **NOT** WooCommerce's built-in `product_cat` — they are theme-registered custom taxonomies on the custom `product` CPT

**`reyco_query_related_products()` (lines 820–843):**
```php
$args['tax_query'] = [['taxonomy' => 'product_category', 'terms' => $term_ids]];
```

Queries by `product_category` ids. Called from `archive.php` for bottom-of-blog related products.

---

## Taxonomy Contract Summary

| Taxonomy | Seeder writes | Template reads by | Required for |
|----------|---------------|-------------------|--------------|
| `product_category` | `tags[1]` (subcategory name → slug) | slug | All archive pages, related carousel, front-page carousels, breadcrumb |
| `product_brand` | `tags[2]` (brand name → slug) | slug | Brand pages, catalogue pages, product card badge |
| `product_tag` | all 4 tags (name strings) | **NOT read by any template** | Nothing in display layer |

**product_tag is write-only from the theme's perspective.** The seeder writes to it, but zero theme templates query by `product_tag`. Tags may serve admin/WooCommerce purposes only.

---

## SEO Finding: 49 SKU-level product_category terms

SEO surfaced 49 of 177 `product_category` archive URLs are model-SKU slugs (e.g. `/reyco-category/cs-2511p/`). These are `product_category` terms created at per-SKU granularity — likely from an earlier seeder pass or Lightspeed sync. 

**Display impact:** No theme template queries by these individual SKU-level `product_category` terms. Their archive pages exist but will return empty or near-empty product grids.

**SEO impact:** Thin-content pages (49 URLs). Not blocking launch. Flag for post-tagging cleanup pass.

---

## Reconcile: Write vs Read

The seeder writes `product_category = tags[1]` using human-readable subcategory names. WordPress creates term slugs automatically. Expected slug mapping:

| Seeder `tags[1]` value | Expected WP term slug | Used in URL |
|------------------------|----------------------|-------------|
| Outboard Motors | outboard-motors | /reyco-category/outboard-motors/ |
| Fishing Boats | fishing-boats | /reyco-category/fishing-boats/ |
| Pontoons | pontoons | /reyco-category/pontoons/ |
| Riding Mowers | riding-mowers | /reyco-category/riding-mowers/ |
| Zero Turn Mowers | zero-turn-mowers | /reyco-category/zero-turn-mowers/ |
| Boat Trailers | boat-trailers | /reyco-category/boat-trailers/ |

These match the slugs used in `menu-data.php` navigation links and page template slug resolution. **Slug-level contract appears intact** — the mismatch would only occur if the seeder did not run (option `reyco_tag_apply_v3` still = `'run'`) or if run failed for specific SKUs.

**Recommended verification:**
```bash
# Check seeder ran:
wp option get reyco_tag_apply_v3
# → should be 'done'; if 'run' → seeder never fired

# Check CSV results:
cat wp-content/uploads/reyco-tag-results.csv | grep -c "tagged"
# → count of successfully tagged products

# Check for unassigned products:
wp post list --post_type=product --fields=ID,post_title --no-pager | head -20
wp term list product_category --fields=slug,count
```

---

## Action Items

| Priority | Issue | Fix |
|----------|-------|-----|
| HIGH | Verify seeder ran: `wp option get reyco_tag_apply_v3` | If not 'done': trigger a page load on staging to fire the init hook |
| HIGH | Products with no `product_category` won't appear on any archive page | Check `reyco-tag-results.csv` for `status=skip` (no_product_match) rows |
| MEDIUM | 49 SKU-level `product_category` terms = thin-content SEO bloat | Post-launch cleanup: delete orphan terms, set 301s to parent category |
| LOW | `product_tag` is written by seeder but never read by theme | Not a bug; tags may serve WC/admin purposes; document and leave |
