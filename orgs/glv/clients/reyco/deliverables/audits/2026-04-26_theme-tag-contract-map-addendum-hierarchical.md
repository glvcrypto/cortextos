# Phase A Addendum: Hierarchical URL Handling + Cub Cadet Bug Investigation
**Date:** 2026-04-26  
**Trigger:** Aiden reported `/boats-and-marine/pontoons/` showing Cub Cadet motors instead of pontoons  
**Status:** COMPLETE — bug mechanism identified, two candidate root causes, fix specified

---

## URL Structure Clarification

The original Phase A audit incorrectly treated `/reyco-category/[slug]/` as the canonical URL. This was wrong.

**Actual structure:**
- `/boats-and-marine/pontoons/` — these are **WordPress Pages** in a parent/child hierarchy
- `/reyco-category/[slug]/` — these are **WC product_category taxonomy archive URLs** (the rewrite slug for the `product_category` taxonomy)
- Both may resolve to content, but the user-facing URLs are the hierarchical page paths

**Template resolution:**  
`/boats-and-marine/pontoons/` uses the `Product Category` page template (`page-templates/product-category.php`, `Template Name: Product Category`). The page must be assigned this template in WP admin.

**Config file lookup:**  
The template builds a `$config_key` from parent + child slugs:
```php
$config_map = ['boats-and-marine' => 'boats-marine', ...];
$config_key = $parent_key.'--'.$slug;  // → 'boats-marine--pontoons'
$config_file = get_template_directory().'/inc/category-configs/boats-marine--pontoons.php';
```

The config file `inc/category-configs/boats-marine--pontoons.php` **exists** and defines subcategories: Jazz Series, Vectra Series, Vogue Series — each with `taxonomy_term` values `pontoon-jazz`, `pontoon-vectra`, `pontoon-vogue`.

---

## Bug Mechanism: Hero Tab Fallback (product-category.php:350)

**The display mechanism for the broken behavior:**

```php
// Lines 346–353 — hero tab switcher, product-category.php
if ($ut['type'] === 'custom' && $ut['tax_term']) {
    $tab_q = new WP_Query( reyco_brand_scoped_query_args(
        ['posts_per_page' => 8],
        ['taxonomy' => $ut['tax_name'], 'field' => 'slug', 'terms' => $ut['tax_term']],
        $reyco_current_brand_slug,
        $reyco_current_category_slug
    ));
    if (!$tab_q->have_posts()) { $tab_q = $all_products_q; }  // ← BUG LINE
} else {
    $tab_q = $all_products_q;
}
```

**Line 350 is the active bug trigger.** When the Jazz/Vectra/Vogue tab query returns 0 products (because terms `pontoon-jazz`, `pontoon-vectra`, `pontoon-vogue` don't exist in the DB), the fallback unconditionally replaces the tab query with `$all_products_q`.

Note: the subcategory sections (lines 406–487) have an explicit anti-fallback comment on line 412: _"No fallback to 'all products' — empty sections show empty state instead of cross-brand leakage."_ The hero tab switcher does NOT have this guard — an oversight.

---

## Two Candidate Root Causes

Both explain why `$all_products_q` returns wrong products when the hero tabs fall back to it.

### Root Cause A: `$all_products_q` has no taxonomy scope (no filter = all products)

**Trigger chain:**
1. `get_term_by('slug', 'pontoons', 'product_category')` returns false — term does not exist
2. `$reyco_current_category_slug = null`
3. Fallback at lines 277–287 fires: builds `['pontoon-jazz', 'pontoon-vectra', 'pontoon-vogue']`
4. `$reyco_current_category_slug = ['pontoon-jazz', 'pontoon-vectra', 'pontoon-vogue']`
5. `$all_products_q = WP_Query(tax_query: product_category slug IN ['pontoon-jazz','pontoon-vectra','pontoon-vogue'])`
6. WordPress resolves unknown slugs → empty term ID set → `AND 0 = 1` → 0 products
7. `$tab_q = $all_products_q` → still 0 products → empty tabs (NOT Cub Cadet)

**Assessment: Root Cause A alone does NOT explain Cub Cadet appearing.** If all terms are non-existent, WordPress returns empty results, not all products. Root Cause A only explains empty tabs.

**Exception path that would make A produce all products:** If the WordPress version or hosting PHP config handles the `AND 0=1` differently (edge case). Unlikely on standard WP/PHP.

---

### Root Cause B: `$all_products_q` scoped to 'pontoons' but wrong products tagged with it (MOST LIKELY)

**Trigger chain:**
1. `product_category` term `Pontoons` (slug: `pontoons`) **exists** — created when Princecraft seeder ran
2. `get_term_by('slug', 'pontoons', 'product_category')` returns the term
3. `$reyco_current_category_slug = 'pontoons'`
4. `$all_products_q = WP_Query(tax_query: product_category slug = 'pontoons')`
5. Returns all products assigned `product_category = 'pontoons'` — including Cub Cadet products that were **incorrectly** tagged
6. Jazz/Vectra/Vogue tabs fail (term 'pontoon-jazz' etc. don't exist) → fallback to `$all_products_q` → Cub Cadet shows

**Why would Cub Cadet products have product_category = 'pontoons'?**

The seed-products-cub-cadet.php file correctly assigns `'Residential Lawn Mowers'`, `'Commercial Lawn Mowers'`, etc. (NOT Pontoons). However:

1. **v3 tag seeder conflict:** `seed-product-tags-v3.php` calls `wp_set_object_terms($product_id, $tags[1], 'product_category', false)` with `false` = REPLACE existing terms. If the v3 seeder ran WITH wrong entries (or SKU lookup matched wrong products), it could have overwritten Cub Cadet product_category to 'Pontoons'.

2. **SKU lookup collision:** The v3 seeder looks up products by SKU via:
   ```php
   SELECT post_id FROM wp_postmeta WHERE meta_key = '_product_sku' AND meta_value = %s
   ```
   If any Cub Cadet product's `_product_sku` matches a SKU in the seeder map that has `tags[1]='Pontoons'` (e.g., a LS-suffix/no-suffix collision), that product would be incorrectly reassigned.

3. **Import/sync side-effect:** A Lightspeed sync job could have pulled categories from LS and mapped them incorrectly.

---

## Diagnostic Verification

Aiden to run via WP-CLI or SiteGround phpMyAdmin:

```bash
# 1. Does 'pontoons' term exist? How many products assigned?
wp term list product_category --fields=slug,name,count --format=table | grep -i pontoon

# 2. What product_category terms do Cub Cadet products actually have?
wp post list --post_type=product --meta_key=_product_brand_name --meta_value="Cub Cadet" \
  --fields=ID,post_title --no-pager | head -5
# Then for a Cub Cadet product ID:
wp post term list <POST_ID> product_category

# 3. Confirm v3 seeder ran:
wp option get reyco_tag_apply_v3

# 4. Check what product_category terms exist:
wp term list product_category --fields=slug,count --format=table
```

**Decision tree:**
- If `pontoons` term has count > expected Princecraft count → Root Cause B confirmed (extra products tagged)
- If `pontoons` term has 0 count → v3 seeder never ran or ran with no matches; Root Cause B via Princecraft seeder
- If `pontoons` term doesn't exist → Root Cause A variant; all tabs return empty (not Cub Cadet - need further investigation)
- If Cub Cadet product shows `product_category = pontoons` → Root Cause B confirmed

---

## Fixes

### Fix 1: Remove hero tab fallback (prevents cross-category leakage) — REQUIRED

**File:** `page-templates/product-category.php`, line 350

```php
// REMOVE this line:
if (!$tab_q->have_posts()) { $tab_q = $all_products_q; }
```

Replace with an explicit empty-state message in the hero tab (same pattern as subcategory sections use at lines 466–472). After this fix, Jazz/Vectra/Vogue tabs that have no products show the empty state instead of wrong products.

---

### Fix 2: Align taxonomy terms — REQUIRED

The config defines `taxonomy_term` values `pontoon-jazz`, `pontoon-vectra`, `pontoon-vogue`. These terms must exist in `product_category` AND products must be assigned to them for the tabs to show anything.

**Current seeder writes:** All Princecraft pontoons → `product_category = 'Pontoons'` (slug: `pontoons`). None get sub-series terms.

**Correct this by:**
- Updating `seed-products-princecraft.php` to assign subcategory terms (`pontoon-jazz`, `pontoon-vectra`, `pontoon-vogue`) per product based on the series
- OR updating the config to use `'pontoons'` as the single taxonomy_term for all three subcategory sections (showing all pontoons in each)
- OR adding a new seeder pass that writes sub-series taxonomy assignments for Princecraft models

The v3 tag seeder would be the right place to add this: products matching Jazz/Vectra/Vogue SKUs get `product_category = 'pontoon-jazz'` etc. instead of just `'Pontoons'`.

---

### Fix 3: Correct Cub Cadet taxonomy assignment (if Root Cause B confirmed)

If DB query shows Cub Cadet products tagged with `product_category = 'pontoons'`, run a corrective pass:

```php
// Correct Cub Cadet products to their proper categories
$cub_cadet_corrections = [
    'CC-30H' => 'Residential Lawn Mowers',
    'CC-XT1' => 'Residential Lawn Mowers',
    // ... etc.
];
foreach ($cub_cadet_corrections as $sku => $category) {
    $product_id = /* lookup by SKU */;
    wp_set_object_terms($product_id, $category, 'product_category', false);
}
```

---

## Impact Summary

| Surface | Expected behavior | Actual behavior | Root cause |
|---------|-------------------|-----------------|------------|
| `/boats-and-marine/pontoons/` Jazz tab | Princecraft Jazz series only | Wrong products (Cub Cadet or all pontoons) | Line 350 fallback → wrong $all_products_q |
| `/boats-and-marine/pontoons/` Vectra tab | Princecraft Vectra series only | Same wrong products | Same mechanism |
| `/boats-and-marine/pontoons/` Vogue tab | Princecraft Vogue series only | Same wrong products | Same mechanism |
| Subcategory sections (lower on page) | Empty or correct products | Likely empty (correct behavior) | Lines 466-472 empty state fires correctly |
| Standard sections (By Price, etc.) | Princecraft pontoons | May show wrong products | $std_products uses same $reyco_current_category_slug |

---

## Pre-launch Checklist Items

1. Remove line 350 fallback (Fix 1) — branch + PR, no direct to master
2. Confirm seeder status via `wp option get reyco_tag_apply_v3`
3. If Root Cause B confirmed: correct Cub Cadet term assignments via corrective seeder
4. Align taxonomy_term values in category configs with actual product_category terms that products are assigned to
5. Verify fix on staging: `/boats-and-marine/pontoons/` should show only Princecraft pontoons, subcategory tabs should either show correct products or empty state message
