# Phase A.3: Meta Description Architecture
**Date:** 2026-04-26  
**Scope:** `functions.php` — `reyco_get_meta_description()` audit, 9 missing page drafts, post meta hook  
**Status:** READY FOR REVIEW

---

## Current State

`reyco_get_meta_description()` (functions.php:1086) covers:

| Priority | Condition | Source |
|----------|-----------|--------|
| 1 | Front page | Hardcoded string in `$page_descriptions['home']` |
| 2 | Single blog post | `get_the_excerpt()` trimmed to 155 chars |
| 3 | Single product | `get_the_excerpt()`, fallback to title + brand + "at Reyco Marine" |
| 4 | Category archive | Dynamic: "{cat name} — expert articles..." |
| 5 | Page (is_page()) | Slug lookup in `$page_descriptions[]`, fallback to service-config subtitle |
| 6 | Default fallback | Generic "boats, motors, lawn and snow equipment..." |

**Missing: No post meta lookup.** There is currently no way to set a custom meta description per page via WP admin. Any page not in the `$page_descriptions[]` array gets the generic fallback.

---

## Gap: 9 Missing Page Descriptions

These pages currently fall through to the generic fallback (verified by slug — not in `$page_descriptions[]` array):

| Slug | URL | Current fallback | Proposed draft |
|------|-----|-----------------|----------------|
| `lawn-and-garden` | `/lawn-and-garden/` | Generic | Cub Cadet, Toro, Troy-Bilt, and Echo outdoor power equipment at Reyco Marine. Riding mowers, zero-turn, walk-behinds, and small engine repair in Sault Ste. Marie. |
| `snow-equipment` | `/snow-equipment/` | Generic | Snowblowers, snow ploughs, and winter equipment at Reyco Marine in Sault Ste. Marie. Cub Cadet, Toro, and Echo snowblowers serviced right here. |
| `powersports` | `/powersports/` | Generic | Hisun side-by-sides, ATVs, and E-Z-GO golf carts at Reyco Marine. Your Sault Ste. Marie powersports dealer — test drives, financing, and local service. |
| `docks-and-lifts` | `/docks-and-lifts/` | Generic | R&J Machine aluminium docks, hydraulic boat lifts, and marine railways for Northern Ontario waterfront properties. Sales and installation from Reyco Marine. |
| `inventory` | `/inventory/` | Generic | Browse the full Reyco Marine inventory — boats, motors, outdoor power equipment, and powersports. Filter by brand, category, and price. In-stock at Sault Ste. Marie. |
| `about` | `/about/` | Exists (weak) | See proposed improvement below |
| `service` | `/service/` | Exists | — |
| `marine` | `/service/marine/` | Service-config subtitle | Verify subtitle is set in service config |
| `small-engine` | `/service/small-engine/` | Service-config subtitle | Verify subtitle is set in service config |

**Note on `/about/` weakness:** Current: *"Meet the team at Reyco Marine. Family-owned marine dealer... since decades."* — "since decades" is an error. Proposed replacement: *"Family-owned marine and outdoor power equipment dealer in Sault Ste. Marie since 1973. Meet the team behind Reyco Marine and why Northern Ontario trusts us with their equipment."*

---

## Recommended Code Change: Post Meta Lookup

Add `_reyco_meta_description` post meta as the highest-priority source for page descriptions. This allows Casey or Aiden to override the fallback from WP admin (via a meta box or custom fields screen) without touching PHP.

**Change to `reyco_get_meta_description()` at line 1129:**

```php
// BEFORE (current):
} elseif (is_page()) {
    $slug = get_post_field('post_name', get_the_ID());
    if (isset($page_descriptions[$slug])) {
        $description = $page_descriptions[$slug];
    } else {
        // service config lookup...
    }
}

// AFTER (proposed — Phase A.3):
} elseif (is_page()) {
    $page_id = get_the_ID();
    
    // Post meta override — set via WP admin > Custom Fields > _reyco_meta_description
    $custom_desc = get_post_meta( $page_id, '_reyco_meta_description', true );
    if ( ! empty( $custom_desc ) ) {
        $description = $custom_desc;
    } else {
        $slug = get_post_field( 'post_name', $page_id );
        if ( isset( $page_descriptions[ $slug ] ) ) {
            $description = $page_descriptions[ $slug ];
        } else {
            // service config lookup...
        }
    }
}
```

This change is additive and non-breaking: existing pages with no `_reyco_meta_description` meta continue to use the slug array exactly as before.

---

## Updated `$page_descriptions[]` Array

```php
$page_descriptions = [
    'home'             => 'Reyco Marine & Small Engine Ltd. — Princecraft boats, Mercury motors, Cub Cadet, Toro, and Echo equipment. Sales, service, and repair in Sault Ste. Marie, Ontario.',
    'about'            => 'Family-owned marine and outdoor power equipment dealer in Sault Ste. Marie. Meet the team behind Reyco Marine and why Northern Ontario trusts us with their boats and equipment.',
    'contact'          => 'Contact Reyco Marine at (705) 253-7828 or visit us at 11 White Oak Drive East, Sault Ste. Marie. Monday–Friday 8AM–5PM, Saturday 9AM–1PM.',
    'service'          => 'Full-service marine and small engine repair in Sault Ste. Marie. Winterisation, spring commissioning, tune-ups, and warranty work. Factory-trained technicians.',
    'financing'        => 'Flexible financing options for boats, motors, and outdoor power equipment at Reyco Marine. Easy application, competitive rates.',
    'blog'             => 'Boating tips, buying guides, equipment reviews, and expert advice from the Reyco Marine team in Sault Ste. Marie.',
    'boats-and-marine' => 'Shop Princecraft boats, Mercury outboard motors, and marine electronics at Reyco Marine. Sault Ste. Marie\'s marine-first dealer.',
    'lawn-and-garden'  => 'Cub Cadet, Toro, Troy-Bilt, and Echo outdoor power equipment at Reyco Marine. Riding mowers, zero-turn, walk-behinds, tillers, and small engine repair in Sault Ste. Marie.',
    'snow-equipment'   => 'Snowblowers, snow ploughs, and winter outdoor equipment at Reyco Marine in Sault Ste. Marie. Cub Cadet, Toro, and Echo — sold, assembled, and serviced here.',
    'powersports'      => 'Hisun side-by-sides, ATVs, and E-Z-GO golf carts at Reyco Marine. Powersports dealer for Sault Ste. Marie and the Algoma District — test drives, financing, and local service.',
    'docks-and-lifts'  => 'R&J Machine aluminium docks, hydraulic boat lifts, and marine railways for Northern Ontario waterfront properties. Sales and installation from Reyco Marine in Sault Ste. Marie.',
    'inventory'        => 'Browse the full Reyco Marine inventory — Princecraft boats, Mercury motors, outdoor power equipment, and powersports. Filter by brand, category, and price. In stock in Sault Ste. Marie.',
];
```

**Changes from current:**
- `about` — fixes "since decades" error, adds year context
- `service` — fixes "winterization" → "winterisation" (Canadian English)
- 5 new entries: `lawn-and-garden`, `snow-equipment`, `powersports`, `docks-and-lifts`, `inventory`

---

## Approved Meta Sources (per-product)

The `metas-2026-04-23-approved.csv` at `/orgs/glv/clients/reyco/deliverables/seo/metas-2026-04-23-approved.csv` contains per-SKU approved `meta_description` and `seo_title` fields for 177 products.

These should be written to `_reyco_meta_description` post meta on each product post via a seeder script. The existing `reyco_get_meta_description()` function already handles `is_singular('product')` via `get_the_excerpt()` — adding the post meta check there too would allow precise per-product overrides from the approved CSV.

**Recommended product meta seeder:** build `inc/seed-product-meta-descriptions.php` to loop `metas-2026-04-23-approved.csv` entries, find each product by SKU (`_product_sku` meta), and call `update_post_meta($id, '_reyco_meta_description', $meta_description)`. Scope: post-launch enhancement (not blocking).

---

## PR Scope (A.3)

1. **functions.php** — add `_reyco_meta_description` post meta lookup in `is_page()` branch
2. **functions.php** — update `$page_descriptions[]` with 5 new entries + `about` fix + `service` Canadian English fix
3. **No seeder script** in this PR — approved-CSV meta seeder is post-launch scope

**Lines to change:** 1086–1153 (the `reyco_get_meta_description()` function body)
