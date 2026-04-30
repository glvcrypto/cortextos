# Reyco Marine — Carousel Routing Verification Report
**Prepared:** 2026-04-23 by seo agent  
**Source:** reyco-master-tag-mapping-250.csv (250 rows, 0 unmatched)  
**Purpose:** Confirm per-carousel expected product counts and flag any routing gaps before dev implements tag-based WooCommerce carousels.

---

## Summary

| Metric | Count |
|--------|-------|
| Total WC products mapped | 250 |
| Main category carousels | 3 |
| Subcategory carousels | 32 |
| Products with BEST JUDGMENT flags | 36 |
| Products pending Casey confirmation | 16 |
| Unmatched products | 0 |

---

## Top-Level Carousel Counts

These three carousels would contain ALL products by main category. Useful for homepage "Shop by Category" sections.

| Carousel (tag_main_category) | Expected Products |
|------------------------------|-------------------|
| Marine | 129 |
| Power Equipment | 101 |
| Powersports | 20 |
| **Total** | **250** |

---

## Marine — Subcategory Carousels

| Subcategory Carousel | Expected Products | Notes |
|----------------------|-------------------|-------|
| Outboards | 50 | Mercury only; largest single subcategory |
| Boat Trailers | 14 | 10 confirmed Easy Hauler + 4 brand-unconfirmed Trailers (Casey pending) |
| Downriggers | 11 | Cannon brand |
| Fish Finders & Chartplotters | 6 | Humminbird |
| Marine Electronics | 6 | Humminbird |
| Downrigger Accessories | 5 | Cannon |
| Marine Electronics Accessories | 4 | Humminbird |
| Dock Systems | 4 | R&J Machine |
| Trolling Motors | 9 | Minn Kota (incl. 1 catalogue-SKU manual tag) |
| Boat Lifts | 8 | R&J Machine |
| Fishing Boats | 2 | Princecraft |
| Pontoons | 2 | Princecraft |
| Kayak Motors | 2 | Minn Kota |
| Live Sonar | 2 | Humminbird |
| Ice Fishing Electronics | 1 | Humminbird |
| Swim Platforms | 1 | R&J Machine |
| Dock & Lift Equipment | 1 | R&J Machine |
| PWC Equipment | 1 | Wave Armor |
| **Marine Total** | **129** | |

---

## Power Equipment — Subcategory Carousels

| Subcategory Carousel | Expected Products | Notes |
|----------------------|-------------------|-------|
| Zero Turn Mowers | 26 | Cub Cadet + Toro mix |
| Chainsaws | 20 | Echo only |
| Blowers & Vacuums | 13 | Echo only |
| String Trimmers | 11 | Echo only |
| Hedge Trimmers | 11 | Echo only |
| Pressure Washers | 5 | Echo only |
| Riding Lawn Mowers | 5 | Cub Cadet only |
| Multi-Tool Systems | 4 | Echo only |
| Push Mowers | 2 | Toro + Echo |
| Walk-Behind Mowers | 2 | Toro |
| Edgers | 1 | Echo |
| Cut-Off Saws | 1 | Echo |
| **Power Equipment Total** | **101** | |

---

## Powersports — Subcategory Carousels

| Subcategory Carousel | Expected Products | Notes |
|----------------------|-------------------|-------|
| UTVs | 14 | Hisun only |
| ATVs | 5 | Hisun only |
| Golf Carts | 1 | Hisun only |
| **Powersports Total** | **20** | |

---

## Routing Logic for Dev

The 4-tag scheme routes carousels as follows:

```
tag_main_category  →  top-level carousel (Marine / Power Equipment / Powersports)
tag_subcategory    →  second-level carousel (e.g., Outboards, Chainsaws, UTVs)
tag_brand          →  brand-filtered carousel (e.g., Mercury, Echo, Hisun)
tag_product_name   →  individual product card title
```

**WooCommerce implementation:** Each carousel queries `product_tag` with the relevant tag slug. Suggested slugs follow the pattern:
- `cat-marine`, `cat-power-equipment`, `cat-powersports`
- `sub-outboards`, `sub-chainsaws`, `sub-utv`, etc.
- `brand-mercury`, `brand-echo`, `brand-hisun`, etc.

Coordinate with dev on exact slug formatting (hyphen vs. underscore) to match WooCommerce's auto-generated tag slugs.

---

## Flags Requiring Casey Confirmation (16 products)

These 16 products have BEST JUDGMENT tags applied and are currently in `casey-pending-batch.csv`. Their carousel routing will shift once Casey confirms:

| Issue | Products Affected | Current Tag (Best Judgment) |
|-------|-------------------|-----------------------------|
| Trailer brand unconfirmed | 10 Trailer rows | Easy Hauler / Boat Trailers |
| LPG outboard consumer label | 2 Mercury rows | 5 HP Outboard (LPG) / 5 HP Sailboat Outboard (LPG) |
| SLX50 Cub Cadet confirm | 1 row | XT2 SLX50 / Riding Lawn Mowers |
| New Toro/Cub Cadet models not in LS data | 3 rows | Best-guess model names (Toro Recycler 22217, etc.) |

---

## New Brands — Routing Confirmation Needed (15 products)

R&J Machine and Wave Armor were not in the original brief. Subcategory routing applied with best judgment. Dev should confirm these tag slugs resolve correctly to the intended carousels:

| Brand | Products | Subcategories Used |
|-------|----------|--------------------|
| R&J Machine | 13 | Boat Lifts (8), Dock Systems (4), Swim Platforms (1) |
| Wave Armor | 2 | PWC Equipment (1), Dock & Lift Equipment (1) |

R&J Machine "Dock & Lift Equipment" (1 row: RJ-FLOATING-TRUSS-DO) was tagged as such to distinguish a truss dock from pure dock system products. Dev may want to consolidate to "Dock Systems" if a separate carousel isn't warranted.

---

## Source Files

| File | Path | Rows |
|------|------|------|
| Master tag mapping (all 250) | `orgs/glv/clients/reyco-marine/assets/product-images/reyco-master-tag-mapping-250.csv` | 250 |
| Apply-now (189, no pending rows) | `orgs/glv/clients/reyco-marine/assets/product-images/reyco-product-tag-mapping-v3-apply-now.csv` | 189 |
| Casey pending batch | `orgs/glv/clients/reyco-marine/assets/product-images/casey-pending-batch.csv` | 16 |

---

*Pending user + dev approval before implementation. Not applied to live site.*
