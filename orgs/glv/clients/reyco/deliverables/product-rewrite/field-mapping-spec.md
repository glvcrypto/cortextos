# Field-Mapping Spec — Reyco Pre-Launch Product Rewrite Import

**For:** dev — admin-trigger PHP PR (Option A), matches PR #98/#100/#101 pattern
**Source CSV:** `/home/aiden/cortextos/orgs/glv/clients/reyco/deliverables/product-rewrite/master-ship.csv`
**Rows:** 249 | **Columns:** 61 | **All IDs populated, 0 blanks, 0 dupes**

---

## Hard rails

1. **UPDATE-ONLY** — never create new products. If a row's `ID` does not resolve to an existing `wc_get_product($id)`, **skip the row** and append `$id` to a `skipped-ids.csv` sidecar in the same dir.
2. **Pre-validate before loop** — first pass: collect all 249 IDs, run `get_posts(['post_type'=>'product','post__in'=>$ids,'fields'=>'ids','posts_per_page'=>-1])` once. Any ID not in the result → write to `skipped-ids.csv` and exclude from the update loop.
3. **Idempotent option-flag** — wrap with `if (get_option('reyco_product_rewrite_import_v1_done')) return;` then `update_option('reyco_product_rewrite_import_v1_done', current_time('mysql'))` at end. Same flush/option discipline as PR #98/#100/#101.
4. **Admin trigger** — `add_management_page()` under Tools menu, capability `manage_options`, nonce-protected, single button click runs the loop. No cron, no auto-fire.
5. **NEVER touch Lightspeed-owned fields** — see "DO NOT WRITE" list below. Lightspeed sync owns those; a write here would create a sync-collision.

---

## Field categories

### A) WRITE — rewrite-derived (the new copy from this batch)

| CSV column | WC API call | Notes |
|---|---|---|
| `Name` | `$product->set_name($val)` | Always populated, ≤200 chars |
| `Short description` | `$product->set_short_description($val)` | Always populated, ~30 words |
| `Description` | `$product->set_description($val)` | Always populated, 300-415 words, contains `<p>` HTML |
| `Brands` | term assignment to `product_brand` taxonomy (slug match by name) | Single brand string, e.g. `"Mercury"`, `"Cub Cadet"`, `"R&J Machine"` |
| `Reyco Category Slug` | term assignment to `product_category` taxonomy by slug (custom theme taxonomy registered in `functions.php:231`, distinct from WC built-in `product_cat`; matches PR #98/#100/#101 pattern) | 43 unique slugs (e.g. `outboard-motors`, `chainsaws`, `riding-mowers`); see slug list at bottom. **CONFIRM:** these slugs match the existing `product_category` term slugs on the live site. If a slug doesn't resolve to an existing term, **skip the assignment + log to `unmapped-slugs.csv`** — do NOT auto-create the term. |

### B) WRITE — meta keys (rewrite-derived)

| CSV column | Meta key | `update_post_meta` value |
|---|---|---|
| `Meta: _product_specs` | `_product_specs` | Newline-separated `Key\|Value` string. Sanitised to Make/Model/Year/Type/Class only (VIN stripped per Aiden ruling). |
| `Meta: _product_expert_id` | `_product_expert_id` | Integer 2 (Casey), 4 (Aaron), or 8 (Kory) |
| `Meta: _product_expert_review` | `_product_expert_review` | First-person copy, 5-8 sentences, plain text |
| `Meta: _product_year` | `_product_year` | 4-digit year (2023-2026) |
| `Meta: _product_condition` | `_product_condition` | Always `"new"` for this batch |
| `Meta: _product_stock_status` | `_product_stock_status` | `on_order` (228 rows) or other; CSV value is authoritative |
| `Meta: _product_sku` | `_product_sku` | Mirrors top-level `SKU` column when present (148/249) |

### C) WRITE — taxonomy-only ops (already covered above, but explicit)

- `Brands` → `wp_set_object_terms($post_id, $brand_slug, 'product_brand', false)` (replace, not append)
- `Reyco Category Slug` → `wp_set_object_terms($post_id, $cat_term_id, 'product_category', false)` (custom theme taxonomy, NOT WC `product_cat`; replace, not append; skip if term not found)

### D) DO NOT WRITE — Lightspeed-sync-owned (READ-ONLY here)

These columns are present in the CSV (sourced from the original WP export) but **must NOT be re-written by this importer** — Lightspeed's sync process owns them and a write here would either revert on next sync or create a sync-flag mismatch:

- `Meta: _lightspeed_unit_id`
- `Meta: _lightspeed_vin`
- `Meta: _lightspeed_web_title`
- `Meta: _lightspeed_color`
- `Meta: _lightspeed_class`
- `Meta: _lightspeed_unit_type`
- `Meta: _lightspeed_raw_json`
- `Meta: _lightspeed_last_sync`
- `Meta: _lightspeed_unmapped_type`
- `Meta: _product_price`
- `Meta: _product_msrp`
- `Meta: _product_monthly_payment`

### E) DO NOT WRITE — keep existing WP value (this importer is copy-only, not catalog-restructure)

- `Type` — keep WP-side value
- `SKU` (top-level) — keep WP-side value (it's just a denorm of `Meta: _product_sku`; that one is in scope but already authoritative)
- `Published`, `Visibility in catalog`, `Tax status`, `Tax class`, `In stock?`, `Stock`, `Backorders allowed?`, `Sold individually?`, `Position`, `Is featured?`, `Allow customer reviews?` — keep WP-side
- `Categories` (legacy column, only 7/249 populated and superseded by `Reyco Category Slug`) — ignore
- `Images` — keep WP-side (image set is owned by content/audit pipeline, not this rewrite)
- `Weight`, `Length`, `Width`, `Height`, `Sale price`, `Regular price`, `Date sale price starts/ends` — all empty in CSV anyway, no-op
- `Tags`, `Shipping class`, `Parent`, `Grouped products`, `Upsells`, `Cross-sells`, `External URL`, `Button text`, `Download limit`, `Download expiry days`, `Purchase note`, `GTIN, UPC, EAN, or ISBN` — empty in CSV, no-op

---

## Sidecars to produce

In the same dir as `master-ship.csv`, the importer should write:

1. **`skipped-ids.csv`** — IDs in master-ship.csv that didn't resolve to a live WP product (header: `ID, name, reason`)
2. **`unmapped-slugs.csv`** — `Reyco Category Slug` values that didn't resolve to an existing `product_cat` term (header: `slug, count, sample_product_ids`)
3. **`import-log-<timestamp>.csv`** — per-row outcome (header: `ID, status[updated|skipped|errored], message`)

---

## Sequence

```php
// pseudo-flow:
add_management_page(
  'Reyco Product Rewrite Import (v1)',
  'Reyco Product Rewrite',
  'manage_options',
  'reyco-product-rewrite-import-v1',
  'reyco_render_import_admin_page'
);

function reyco_run_import_v1() {
  if (!current_user_can('manage_options')) wp_die('forbidden');
  check_admin_referer('reyco_product_rewrite_import_v1');
  if (get_option('reyco_product_rewrite_import_v1_done')) {
    echo 'Already run at: ' . get_option('reyco_product_rewrite_import_v1_done');
    return;
  }

  $csv = '/path/to/master-ship.csv';  // dev decides upload mechanism
  $rows = parse_csv($csv);  // 249 rows

  // Phase 1: pre-validate
  $ids = array_column($rows, 'ID');
  $live_ids = get_posts([
    'post_type' => 'product',
    'post__in' => $ids,
    'fields' => 'ids',
    'posts_per_page' => -1,
  ]);
  $missing = array_diff($ids, $live_ids);
  write_skipped_sidecar($missing);

  // Phase 2: per-row update loop (only IDs in $live_ids)
  foreach ($rows as $row) {
    if (!in_array($row['ID'], $live_ids)) continue;
    $product = wc_get_product($row['ID']);
    if (!$product) { log_skip($row); continue; }

    // A: WRITE rewrite-derived
    $product->set_name($row['Name']);
    $product->set_short_description($row['Short description']);
    $product->set_description($row['Description']);
    $product->save();

    // B: WRITE meta
    update_post_meta($row['ID'], '_product_specs', $row['Meta: _product_specs']);
    update_post_meta($row['ID'], '_product_expert_id', (int)$row['Meta: _product_expert_id']);
    update_post_meta($row['ID'], '_product_expert_review', $row['Meta: _product_expert_review']);
    update_post_meta($row['ID'], '_product_year', $row['Meta: _product_year']);
    update_post_meta($row['ID'], '_product_condition', $row['Meta: _product_condition']);
    update_post_meta($row['ID'], '_product_stock_status', $row['Meta: _product_stock_status']);
    if (!empty($row['Meta: _product_sku'])) {
      update_post_meta($row['ID'], '_product_sku', $row['Meta: _product_sku']);
    }

    // C: taxonomy
    if (!empty($row['Brands'])) {
      wp_set_object_terms($row['ID'], $row['Brands'], 'product_brand', false);
    }
    if (!empty($row['Reyco Category Slug'])) {
      $term = get_term_by('slug', $row['Reyco Category Slug'], 'product_category');
      if ($term && !is_wp_error($term)) {
        wp_set_object_terms($row['ID'], (int)$term->term_id, 'product_category', false);
      } else {
        log_unmapped_slug($row);
      }
    }
    log_updated($row);
  }

  update_option('reyco_product_rewrite_import_v1_done', current_time('mysql'));
}
```

---

## Reyco Category Slug — full list (43 unique, 249-row coverage)

| Slug | Row count |
|---|---|
| outboard-motors | 50 |
| chainsaws | 17 |
| zero-turn-mowers | 16 |
| riding-mowers | 16 |
| utvs | 13 |
| trolling-motors | 11 |
| downriggers | 11 |
| trailers | 11 |
| hedge-trimmers | 10 |
| string-trimmers | 8 |
| fish-finders | 6 |
| backpack-blowers | 6 |
| pontoons | 5 |
| docks | 5 |
| boat-lifts | 5 |
| (+ 28 more — full distribution available on request) | |

Dev should run `wp term list product_category --format=csv --field=slug` (custom theme taxonomy) and confirm all 43 exist before import. Any missing → `unmapped-slugs.csv` sidecar at runtime; do NOT auto-create.

---

## Sidecars to import alongside

- `manual-check.csv` (2 rows, IDs 513 + 561) — **DO NOT IMPORT.** Aiden post-gym ruling on legit-stock-with-flag-distinction OR merge-to-1.
- `wp-deletion.csv` (3 IDs: 489, 537, 558) — **DO NOT IMPORT.** Aiden server-side WP delete after the 249-row import succeeds.
