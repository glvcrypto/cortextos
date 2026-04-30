# Task #12 — Follow-Up Batch Documentation
**Date:** 2026-04-29  
**Status:** 229/250 titles live — 21 remaining (see below)  
**Script:** `/tmp/task12_followup.py` (ready-to-fire — see Section 3)

---

## Section 1 — What's Live

**229/250 `_reyco_meta_title` values written, 0 errors.**

- First batch (2026-04-29 ~14:40 UTC): 200 products
- Follow-up batch (2026-04-29 ~15:20 UTC): 29 products (Mercury HP-anchored pass + Wave Armor + Minn Kota + manual edge cases)
- All 229 verified via WC REST GET — meta_data reads back exactly as expected

Brands covered: Mercury (24), Easy Hauler (7 of 14), Toro (23), Cub Cadet (11), Princecraft (3 of 4), Cannon (16), Echo (68), Humminbird (13), Hisun (19), Minn Kota (17 of 17 unique products), Wave Armor (2)

---

## Section 2 — Final 21 Unmatched + Resolution Path

### Group A: R&J Machine (13) — NOT in WC
**Resolution:** Casey 7-bucket post-launch. R&J Machine is on the authorized brand list (project_reyco_wp_product_seeding). Once products are imported to WC, SEO titles are ready to write — same script, one run.

| SKU | Product | SEO Title |
|-----|---------|-----------|
| RJ-BOAT-LIFT-ROOF-SY | R&J Boat Lift Roof System | R&J Boat Lift Roof System \| R&J Machine \| Reyco Marine |
| RJ-CANTILEVER-BOAT-L | R&J Cantilever Boat Lift | R&J Cantilever Boat Lift \| R&J Machine \| Reyco Marine |
| RJ-FLOATING-TRUSS-DO | R&J Floating Truss Dock | R&J Floating Truss Dock \| R&J Machine \| Reyco Marine |
| RJ-HIDDEN-BEAM-WET-S | R&J Hidden-Beam Wet-Slip Lift | R&J Hidden-Beam Wet-Slip Lift \| R&J Machine \| Reyco Marine |
| RJ-HYDRAULIC-BOAT-LI | R&J Hydraulic Boat Lift | R&J Hydraulic Boat Lift \| R&J Machine \| Reyco Marine |
| RJ-HYDRAULIC-PWC-LIF | R&J Hydraulic Personal Watercraft Lift | R&J Hydraulic Personal Watercraft Lift \| R&J Machine \| Reyco Marine |
| RJ-HYDRO-EXTREME-BOA | R&J Hydro Extreme Boat Lift | R&J Hydro Extreme Boat Lift \| R&J Machine \| Reyco Marine |
| RJ-LIFT-UP-STEP-DOCK | R&J Lift-Up Step Dock | R&J Lift-Up Step Dock \| R&J Machine \| Reyco Marine |
| RJ-LUX-FLOATING-DOCK | R&J LUX Floating Dock System | R&J LUX Floating Dock System \| R&J Machine \| Reyco Marine |
| RJ-MARINE-RAILWAY-SY | R&J Marine Railway System | R&J Marine Railway System \| R&J Machine \| Reyco Marine |
| RJ-TRUSS-PIPE-DOCK-A | R&J Truss Pipe Dock — Aluminum | R&J Truss Pipe Dock — Aluminum \| R&J Machine \| Reyco Marine |
| RJ-VERTICAL-PONTOON- | R&J Vertical Pontoon Boat Lift | R&J Vertical Pontoon Boat Lift \| R&J Machine \| Reyco Marine |
| RJ-WAVEX-MODULAR-DOC | R&J WaveX Modular Dock System | R&J WaveX Modular Dock System \| R&J Machine \| Reyco Marine |

### Group B: Trailer X (6) — Content Refresh Needed
**Resolution:** SEO title refresh required BEFORE write. All 6 products in the metas CSV have the identical title "Boat Trailer | Easy Hauler | Reyco Marine" — writing this to 6 distinct WC products would create duplicate title tags (Google penalty risk). Each Trailer X variant needs a unique title matching the WC product name.

| Metas SKU | WC Product (candidate) | WC ID | Needed Title (example) |
|-----------|------------------------|-------|------------------------|
| 2024-TRAILER-X | 2024 Trailer X — Ice-Fishing Utility Trailer | 425 | Ice-Fishing Utility Trailer \| Easy Hauler \| Reyco Marine |
| 2024-TRAILER-X-2 | (second 2024 Trailer X variant) | TBD | [unique per WC product name] |
| 2025-TRAILER-X | 2025 Trailer X — Sled-Hauling Utility Trailer | 453 | Sled-Hauling Utility Trailer \| Easy Hauler \| Reyco Marine |
| 2025-TRAILER-X-2 | 2025 Trailer X — Hunt-Camp Utility Trailer | 414 | Hunt-Camp Utility Trailer \| Easy Hauler \| Reyco Marine |
| 2025-TRAILER-X-3 | (third 2025 Trailer X variant) | TBD | [unique per WC product name] |
| 2025-TRAILER-X-4 | (fourth 2025 Trailer X variant) | TBD | [unique per WC product name] |

**Blocker (discovered 2026-04-29):** The 6 Trailer X SKUs (2024-TRAILER-X through 2025-TRAILER-X-4) cannot be reliably mapped to specific WC products without WC SKU field population. WC has only 3 "2025 Trailer X" products but 4 unmatched 2025 SKUs — sequential SKU numbering doesn't indicate which model each corresponds to. **Title refresh requires dev to populate WC sku fields from Lightspeed first, then mapping is unambiguous and titles derive mechanically from WC names (e.g. "2025 Trailer X — Hunt-Camp Utility Trailer" → "Hunt-Camp Utility Trailer | Easy Hauler | Reyco Marine").** Same parent prereq as Group A (WC SKU population).

### Group C: Mercury non-standard name (1) — WC name mismatch
**Resolution:** WC product ID=383 may contain "2023 Mercury 90 HP" — confirm and manual-map.

| SKU | Tag name | WC Candidate | Notes |
|-----|----------|--------------|-------|
| 26-MERCURY-ME-90ELPT | 90 HP Outboard | Check ID=383 "2023 Mercury 90 HP FourStroke" | Year prefix "26-" vs SKU suggests data entry error — verify |

### Group D: Princecraft Sportfisher 21 (1) — variant disambiguation
**Resolution:** Two WC products share the same model (2S vs 2RS). The approved SEO title is generic ("Sportfisher 21 | Princecraft | Reyco Marine") and would be a duplicate if written to both. **Needs unique titles per variant** OR both written with the same generic title if variants are close enough to be non-penalizable.

| SKU | WC ID | WC Name |
|-----|-------|---------|
| 2023-PRINCECRAFT-SPO | 1034 | 2023 Princecraft Sportfisher 21-ft 2S Fishing Edition Pontoon |
| 2023-PRINCECRAFT-SPO | 384 | 2023 Princecraft Sportfisher 21-ft 2RS Pontoon |

---

## Section 3 — Ready-to-Fire Script

Once R&J Machine products are imported (Group A) or Trailer X titles are refreshed (Group B), run:

```bash
python3 /home/aiden/cortextos/orgs/glv/agents/seo/scripts/task12-followup.py
```

The script:
1. Reads `/tmp/wc_sku_to_id_final.json` (current ID map, 229 entries)
2. Reads `metas-2026-04-23-approved.csv` (250 approved titles)
3. For each SKU in the map that hasn't been written yet: fires PUT /products/{id}
4. Spot-checks 3 random results
5. Reports success/errors

**To add new SKU-ID mappings** (e.g. after R&J import): edit `/tmp/wc_sku_to_id_final.json` and add `"<wc_sku>": <wc_id>` entries. The script picks them up automatically.

---

## Section 4 — Launch Coverage Summary

| Category | Products | Status |
|----------|----------|--------|
| Titles live (229) | All Echo, all Cannon, all Humminbird, all Hisun, all Minn Kota, most Mercury/Toro/Cub Cadet/Easy Hauler/Princecraft | Live — pending cache purge round 2 |
| Group A: R&J Machine (13) | Docks, lifts, marine railways | Post-launch: Casey WC import + 1 script run |
| Group B: Trailer X (6) | Boat trailers | Post-launch: title refresh + 1 script run |
| Group C: Mercury 90HP (1) | 1 Mercury outboard | Post-launch: manual ID confirm + 1 write |
| Group D: Princecraft variant (1) | Sportfisher 21 | Post-launch: confirm 2S vs 2RS + unique titles |
| **Total** | **250** | **91.6% live at launch** |
