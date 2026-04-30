# Reyco Product Display Audit — 2026-04-23

**Purpose:** Verify that every product carousel/grid on reyco.glvmarketing.ca will render correctly after the 3-taxonomy seeder pass (PR #55). Identify gaps requiring follow-up config.

> **Seeder context (PR #55):** After merge + execution sequence, every WC product in the tag map gets:
> - `product_tag`: 4 labels (main category, subcategory, brand, product name)
> - `product_brand`: brand name → auto-slugified (Mercury → mercury, Cub Cadet → cub-cadet, etc.)
> - `product_category`: subcategory name → auto-slugified (Fishing Boats → fishing-boats, Outboards → outboards, etc.)

---

## 1. Homepage — `front-page.php`

Product sections use `product_category` taxonomy, filtered by hardcoded slugs in `$product_sections` array.

### Boats & Marine tab (6 carousels)

| Section | Slug expected | Seeder tag[1] → actual slug | Populates? |
|---------|--------------|----------------------------|------------|
| Fishing Boats | `fishing-boats` | 'Fishing Boats' → `fishing-boats` | ✅ YES |
| Pontoons | `pontoons` | 'Pontoons' → `pontoons` | ✅ YES |
| Deck Boats | `deck-boats` | 'Deck Boats' → `deck-boats` | ✅ YES |
| Outboard Motors | `outboard-motors` | 'Outboards' → `outboards` | ❌ NO — slug mismatch |
| Trolling Motors | `trolling-motors` | 'Trolling Motors' → `trolling-motors` | ✅ YES |
| Fish Finders | `fish-finders` | 'Fish Finders & Chartplotters' → `fish-finders-chartplotters` | ❌ NO — slug mismatch |

**Fix for mismatches:** Change seeder tag[1] values:
- Mercury outboard rows: `'Outboards'` → `'Outboard Motors'`
- Humminbird rows: `'Fish Finders & Chartplotters'` → `'Fish Finders'`
- Minn Kota rows stay as 'Trolling Motors' ✓

### Lawn & Garden tab (5 carousels)

| Section | Slug expected | Seeder tag[1] → actual slug | Populates? |
|---------|--------------|----------------------------|------------|
| Riding Mowers | `riding-mowers` | 'Riding Lawn Mowers' → `riding-lawn-mowers` | ❌ NO — slug mismatch |
| Zero-Turn | `zero-turn-mowers` | 'Zero Turn Mowers' → `zero-turn-mowers` | ✅ YES |
| Push Mowers | `push-mowers` | 'Push Mowers' → `push-mowers` | ✅ YES |
| Chainsaws | `chainsaws` | 'Chainsaws' → `chainsaws` | ✅ YES |
| Trimmers | `trimmers` | 'Trimmers' → `trimmers` | ✅ YES |

**Fix for mismatch:** Change Cub Cadet + Toro riding mower rows: `'Riding Lawn Mowers'` → `'Riding Mowers'`

### Snow Equipment tab (4 carousels)

| Section | Slug expected | Seeder entries | Populates? |
|---------|--------------|----------------|------------|
| Two-Stage Snowblowers | `two-stage-snowblowers` | No snow products in seeder | ❌ NO — no products |
| Three-Stage Snowblowers | `three-stage-snowblowers` | No snow products in seeder | ❌ NO — no products |
| Single-Stage Snowblowers | `single-stage-snowblowers` | No snow products in seeder | ❌ NO — no products |
| Snow Plows | `snow-plows` | No snow products in seeder | ❌ NO — no products |

**Root cause:** Bercomac/snow equipment SKUs not in tag seeder v3 and not in LS catalogue. These are a separate seeder pass needed post-launch.

---

## 2. Brand Landing Pages — `/boats-and-marine/<brand>/`, `/lawn-and-garden/<brand>/`, etc.

**Template:** `page-templates/product-category.php`
**Query:** `product_brand` taxonomy, slug = page slug

| Brand page URL | product_brand slug needed | Seeder tag[2] → slug | Populates? |
|----------------|--------------------------|----------------------|------------|
| /boats-and-marine/mercury/ | `mercury` | 'Mercury' → `mercury` | ✅ YES |
| /boats-and-marine/princecraft/ | `princecraft` | 'Princecraft' → `princecraft` | ✅ YES |
| /boats-and-marine/humminbird/ | `humminbird` | 'Humminbird' → `humminbird` | ✅ YES |
| /boats-and-marine/minnkota/ | `minnkota` | 'Minn Kota' → `minn-kota` | ⚠️ PARTIAL — page slug is `minnkota`, term slug would be `minn-kota` |
| /lawn-and-garden/echo/ | `echo` | 'Echo' → `echo` | ✅ YES |
| /lawn-and-garden/cub-cadet/ | `cub-cadet` | 'Cub Cadet' → `cub-cadet` | ✅ YES |
| /lawn-and-garden/toro/ | `toro` | 'Toro' → `toro` | ✅ YES |
| /powersports/hisun/ | `hisun` | 'Hisun' → `hisun` | ✅ YES |
| /powersports/cub-cadet-utv/ | `cub-cadet-utv` | 'Cub Cadet' → `cub-cadet` | ⚠️ PARTIAL — slug mismatch (page slug is `cub-cadet-utv`) |

**Fix for Minnkota:** Change seeder Minn Kota rows: `'Minn Kota'` → `'Minnkota'`
**Fix for Cub Cadet UTV:** Change powersports Hisun-built Cub Cadet row (CC-CHALL750MX-26): brand `'Cub Cadet'` → `'Cub Cadet UTV'`

---

## 3. Blog Posts — Related Products Block

**Template:** `single.php` / `archive.php`
**Query:** `reyco_query_related_products()` → `product_category` taxonomy, slugs from `_related_product_cats` term meta on blog categories

Blog category → product_category slug mappings (seeded in `reyco_seed_category_mappings()`):

| Blog Category | product_category slugs used | Seeder populates? |
|---------------|-----------------------------|-------------------|
| Boating Tips | fishing-boats, pontoons, deck-boats, **outboard-motors**, trolling-motors, **fish-finders** | ⚠️ PARTIAL (2 mismatches) |
| Equipment Reviews | fishing-boats, pontoons, deck-boats, **outboard-motors**, **riding-mowers**, zero-turn-mowers, chainsaws, two-stage-snowblowers, **fish-finders** | ⚠️ PARTIAL (3 mismatches + no snow) |
| Maintenance Guides | **outboard-motors**, **riding-mowers**, zero-turn-mowers, chainsaws, two-stage-snowblowers | ⚠️ PARTIAL (2 mismatches + no snow) |
| Buying Guides | fishing-boats, pontoons, deck-boats, **outboard-motors**, **riding-mowers**, zero-turn-mowers, chainsaws, two-stage-snowblowers | ⚠️ PARTIAL (2 mismatches + no snow) |
| Financing Tips | fishing-boats, pontoons, deck-boats, **outboard-motors**, **riding-mowers**, zero-turn-mowers | ⚠️ PARTIAL (2 mismatches) |
| Local Guides | fishing-boats, pontoons, **fish-finders**, trolling-motors | ⚠️ PARTIAL (1 mismatch) |
| Lawn & Garden | **riding-mowers**, zero-turn-mowers, chainsaws | ⚠️ PARTIAL (1 mismatch) |
| Casey's Corner | fishing-boats, pontoons, **outboard-motors** | ⚠️ PARTIAL (1 mismatch) |
| Local Events | (none) | ✅ N/A |

**All blog category related-product gaps stem from the same 3 slug mismatches** as homepage.

---

## 4. Single Product Page — Compare / Related Section

**Template:** `single-product.php`
**Query:** `product_category` taxonomy, `$related_terms` = current product's category IDs

→ Shows 1 product in the same `product_category`. Populates as soon as any 2 products share a `product_category` term. ✅ Will populate after seeder runs (for matching-slug categories).

---

## 5. Global Footer / Sidebar

No product widgets found in footer.php, sidebar.php, or functions.php. ✅ N/A — no product widgets in global footer/sidebar.

---

## Summary of Required Follow-Up Config

All gaps resolve to **3 slug mismatches** in the tag seeder that need a targeted fix. Recommend adding to a follow-up PR (or amending PR #55 before merge):

| Change | Location | Rows affected |
|--------|----------|---------------|
| `'Outboards'` → `'Outboard Motors'` | seed-product-tags-v3.php | ~38 Mercury outboard rows |
| `'Fish Finders & Chartplotters'` → `'Fish Finders'` | seed-product-tags-v3.php | ~8 Humminbird rows |
| `'Riding Lawn Mowers'` → `'Riding Mowers'` | seed-product-tags-v3.php | ~20 Cub Cadet + Toro riding mower rows |
| `'Minn Kota'` → `'Minnkota'` | seed-product-tags-v3.php | ~15 Minn Kota rows |
| `'Cub Cadet'` → `'Cub Cadet UTV'` for CC-CHALL750MX-26 | seed-product-tags-v3.php | 1 row |

**Snow equipment** (Bercomac) is a separate deliverable — no products exist in WC or LS catalogue for that brand yet. Post-launch task.

**Across-the-board status after PR #55 merges + execution sequence:**
- Brand pages: ✅ ALL brands show correct products
- Homepage marine carousels: 4/6 correct (outboard-motors + fish-finders need slug fix)
- Homepage lawn carousels: 4/5 correct (riding-mowers needs slug fix)
- Homepage snow carousels: 0/4 (no products exist yet)
- Blog related products: 5-7/9 categories partially correct (same 3 slug issues)
- Single product compare: ✅ after seeder runs
