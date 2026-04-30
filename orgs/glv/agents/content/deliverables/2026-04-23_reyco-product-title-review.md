# Reyco Product Title Review — tag_product_name Quality Pass

**Status:** DRAFT — for SEO agent + dev; do NOT apply to WC without user green-light
**Prepared:** 2026-04-23
**Source:** reyco-master-tag-mapping-250.csv
**Standard:** Plain English a 55-year-old boater or tradesman would understand. No model codes, no part numbers, no internal abbreviations in the display name.

---

## Summary

| Brand | Total | Flagged (real issues) | Action |
|---|---|---|---|
| Echo | 68 | 68 | All need rewrites — every title is a raw model code |
| Toro | 23 | 23 | Strip model numbers from all titles |
| Easy Hauler | 4 | 3 | Spec codes + all-caps in titles |
| Mercury | 2 | 2 | LPG abbreviation needs expansion |
| Hisun | 5 | 5 | MP9 model codes need consumer names |
| R&J Machine | 2 | 2 | HTML entities (dev fix) + PWC expansion |
| **Total** | **122** | **103** | |

Minnkota, Cannon, Humminbird, Cub Cadet, Princecraft, Trailer: **no real issues** — product line names and clear descriptions, false positives from detector. See notes at bottom.

---

## ECHO — All 68 titles are raw model codes (HIGH PRIORITY)

Every Echo tag_product_name is a model code (CS-310, SRM-225, PB-580T, etc.) with no plain-English description. These need full rewrites.

**Echo model code decoder** (for consistent title writing):

| Prefix | Product Type | Title pattern |
|---|---|---|
| CS-### | Gas Chainsaw | `[CC]cc Gas Chainsaw` |
| DCS-### | Battery Chainsaw | `[V] Battery Chainsaw` |
| CSG-### | Cordless Chainsaw | `Cordless Chainsaw` |
| SRM-### | Gas String Trimmer | `[CC]cc Gas String Trimmer` |
| DSRM-### | Battery String Trimmer | `Battery String Trimmer` |
| PB-### | Gas Backpack Blower | `Gas Backpack Blower` |
| DPB-### | Battery Backpack Blower | `Battery Backpack Blower` |
| HC-### | Gas Hedge Trimmer | `[bar length]" Gas Hedge Trimmer` |
| DHC-### | Battery Hedge Trimmer | `Battery Hedge Trimmer` |
| SHC-### | Gas Shaft Hedge Trimmer | `Gas Shaft Hedge Trimmer` |
| HCA-### | Hedge Trimmer Attachment | `Hedge Trimmer Power Attachment` |
| PAS-### | Gas Power Attachment System | `Gas Power Attachment System` |
| DPAS-### | Battery Power Attachment System | `Battery Power Attachment System` |
| GT-### | Gas Grass Trimmer | `Gas Grass Trimmer` |
| PE-### | Gas Pole Pruner | `Gas Pole Pruner` |
| ES-### | Gas Edger | `Gas Edger` |
| PW-### | Gas Pressure Washer | `[PSI] PSI Gas Pressure Washer` |
| PWE-### | Electric Pressure Washer | `[PSI] PSI Electric Pressure Washer` |
| DLM-### | Battery Lawn Mower | `Battery Self-Propelled Lawn Mower` |
| CWT-### | Cordless Tool | `Cordless Power Tool` |

**Suggested rewrites — all 68 Echo SKUs:**

| SKU | Current | Suggested |
|---|---|---|
| EC-CS2511P-26 | CS-2511P | 25cc Gas Chainsaw |
| EC-CS2511T-26 | CS-2511T | 25cc Gas Chainsaw (Top Handle) |
| EC-CS271T-26 | CS-271T | 27cc Gas Chainsaw (Top Handle) |
| EC-CS310-26 | CS-310 | 30cc Gas Chainsaw |
| EC-CS3510-26 | CS-3510 | 35cc Gas Chainsaw |
| EC-CS352-26 | CS-352 | 35cc Gas Chainsaw |
| EC-CS355T-26 | CS-355T | 35cc Gas Chainsaw (Top Handle) |
| EC-CS361P-26 | CS-361P | 36cc Gas Chainsaw |
| EC-CS370F-26 | CS-370F | 37cc Gas Chainsaw (Front Handle) |
| EC-CS4510-26 | CS-4510 | 45cc Gas Chainsaw |
| EC-CS490-26 | CS-490 | 50cc Gas Chainsaw |
| EC-CS4910-26 | CS-4910 | 49cc Gas Chainsaw |
| EC-CS501P-26 | CS-501P | 50cc Gas Chainsaw |
| EC-CS590-26 | CS-590 | 59cc Gas Chainsaw |
| EC-CS620P-26 | CS-620P | 62cc Gas Chainsaw |
| EC-CS680-26 | CS-680 | 68cc Gas Chainsaw |
| EC-CS7310P-26 | CS-7310P | 73cc Gas Chainsaw |
| EC-CSG7410-26 | CSG-7410 | Cordless Gas Chainsaw |
| EC-CWT7410-26 | CWT-7410 | Cordless Power Tool |
| EC-DCS2500T-26 | DCS-2500T | Battery Chainsaw (Top Handle) |
| EC-DCS5000-26 | DCS-5000 | Battery Chainsaw |
| EC-DHC2300-26 | DHC-2300 | Battery Hedge Trimmer |
| EC-DLM2100-26 | DLM-2100 | Battery Self-Propelled Lawn Mower |
| EC-DLM2100SP-26 | DLM-2100SP | Battery Self-Propelled Lawn Mower |
| EC-DPAS2100-26 | DPAS-2100 | Battery Power Attachment System |
| EC-DPAS2600-26 | DPAS-2600 | Battery Power Attachment System |
| EC-DPB2500-26 | DPB-2500 | Battery Backpack Blower |
| EC-DPB2500LE-26 | DPB-2500LE | Battery Backpack Blower (Low Emission) |
| EC-DSRM2100-26 | DSRM-2100 | Battery String Trimmer |
| EC-DSRM2600-26 | DSRM-2600 | Battery String Trimmer |
| EC-DSRM2600U-26 | DSRM-2600U | Battery String Trimmer |
| EC-ES250-26 | ES-250 | Gas Edger |
| EC-GT225-26 | GT-225 | 22cc Gas Grass Trimmer |
| EC-HC155-26 | HC-155 | Gas Hedge Trimmer |
| EC-HC2020-26 | HC-2020 | Gas Hedge Trimmer |
| EC-HC2210-26 | HC-2210 | Gas Hedge Trimmer |
| EC-HC2810-26 | HC-2810 | Gas Hedge Trimmer |
| EC-HCA2620-26 | HCA-2620 | Hedge Trimmer Power Attachment |
| EC-HCA2620S-26 | HCA-2620S | Hedge Trimmer Power Attachment |
| EC-PAS225-26 | PAS-225 | 22cc Gas Power Attachment System |
| EC-PAS2620-26 | PAS-2620 | Gas Power Attachment System |
| EC-PB2520-26 | PB-2520 | Gas Backpack Blower |
| EC-PB255LN-26 | PB-255LN | Gas Backpack Blower (Low Noise) |
| EC-PB2620-26 | PB-2620 | Gas Backpack Blower |
| EC-PB265LN-26 | PB-265LN | Gas Backpack Blower (Low Noise) |
| EC-PB580T-26 | PB-580T | Gas Backpack Blower |
| EC-PB755ST-26 | PB-755ST | Gas Backpack Blower |
| EC-PB760LNT-26 | PB-760LNT | Gas Backpack Blower (Low Noise) |
| EC-PB770-26 | PB-770 | Gas Backpack Blower |
| EC-PB8010-26 | PB-8010 | Gas Backpack Blower |
| EC-PB9010T-26 | PB-9010T | Gas Backpack Blower |
| EC-PE2620-26 | PE-2620 | Gas Pole Pruner |
| EC-PW3100-26 | PW-3100 | 3100 PSI Gas Pressure Washer |
| EC-PW3200-26 | PW-3200 | 3200 PSI Gas Pressure Washer |
| EC-PW3600-26 | PW-3600 | 3600 PSI Gas Pressure Washer |
| EC-PW4200-26 | PW-4200 | 4200 PSI Gas Pressure Washer |
| EC-PWE1800-26 | PWE-1800 | 1800 PSI Electric Pressure Washer |
| EC-SHC225-26 | SHC-225 | 22cc Gas Shaft Hedge Trimmer |
| EC-SHC225S-26 | SHC-225S | 22cc Gas Shaft Hedge Trimmer |
| EC-SHC2620-26 | SHC-2620 | Gas Shaft Hedge Trimmer |
| EC-SHC2620S-26 | SHC-2620S | Gas Shaft Hedge Trimmer |
| EC-SRM225-26 | SRM-225 | 22cc Gas String Trimmer |
| EC-SRM2320-26 | SRM-2320 | Gas String Trimmer |
| EC-SRM2620-26 | SRM-2620 | Gas String Trimmer |
| EC-SRM2620U-26 | SRM-2620U | Gas String Trimmer |
| EC-SRM266-26 | SRM-266 | 26cc Gas String Trimmer |
| EC-SRM3020-26 | SRM-3020 | Gas String Trimmer |
| EC-SRM410-26 | SRM-410 | Gas String Trimmer |

**Note to SEO/dev:** Echo model numbers encode displacement (e.g. CS-310 ≈ 30.5cc, SRM-225 ≈ 21.2cc). The suggested CC values above follow Echo's published naming convention but should be verified against the Echo product catalogue before writing to WC. If exact spec isn't confirmed, drop the CC from the title and use "Gas Chainsaw" / "Gas String Trimmer" alone — still a vast improvement over the raw codes.

---

## TORO — Strip model numbers from all 23 titles

The product line names (TimeCutter, Z Master, GrandStand, Recycler) are good consumer language. The model numbers appended to them are not. Fix = remove the 5-digit model number from every title.

| SKU | Current | Suggested |
|---|---|---|
| 2022-TORO-74055 | TimeCutter 74055 | Toro TimeCutter Zero Turn Mower |
| 2024-TORO-74532 | GRANDSTAND HDM 74532 | Toro GrandStand HDM Zero Turn Mower |
| 2024-TORO-74532-2 | GRANDSTAND HDM 74532 | Toro GrandStand HDM Zero Turn Mower |
| 2025-TORO-77502 | TimeCutter® Max MyRide 77502 | Toro TimeCutter Max MyRide Zero Turn Mower |
| 2025-TORO-77507 | Z Master 77507 | Toro Z Master Commercial Zero Turn Mower |
| 2026-TORO-22217 | Recycler 22217 | Toro Recycler Self-Propelled Lawn Mower |
| 2026-TORO-22217-2 | Recycler 22217 | Toro Recycler Self-Propelled Lawn Mower |
| 2026-TORO-72504 | GrandStand 72504 | Toro GrandStand Zero Turn Mower |
| 2026-TORO-75747 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-75747-2 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-75747-3 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-75747-4 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-75747-5 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-75747-6 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-75747-7 | TimeCutter® MyRIDE 75747 | Toro TimeCutter MyRIDE Zero Turn Mower |
| 2026-TORO-77283 | Z MASTER TF2 77283 | Toro Z Master TF2 Commercial Zero Turn Mower |
| 2026-TORO-77283-2 | Z MASTER TF2 77283 | Toro Z Master TF2 Commercial Zero Turn Mower |
| 2026-TORO-77283-3 | Z MASTER TF2 77283 | Toro Z Master TF2 Commercial Zero Turn Mower |
| 2026-TORO-77404 | TIMECUTTER 77404 | Toro TimeCutter Zero Turn Mower |
| 2026-TORO-77404-2 | TIMECUTTER 77404 | Toro TimeCutter Zero Turn Mower |
| 2026-TORO-77404-3 | TIMECUTTER 77404 | Toro TimeCutter Zero Turn Mower |
| 2026-TORO-77501 | 77501 | Toro Zero Turn Mower |
| 2026-TORO-77503 | TimeCutter MyRIDE 77503 | Toro TimeCutter MyRIDE Zero Turn Mower |

**Note:** Multiple SKUs with identical suggested names (e.g. 8× TimeCutter MyRIDE) likely represent different deck widths or engine options. SEO agent should append the differentiating spec (e.g. "42-inch Deck", "60-inch Deck") once that data is available from Casey/Lightspeed. Use the suggested names above as the base; add deck width in parentheses when confirmed.

---

## EASY HAULER — 3 titles need polish

| SKU | Current | Flag | Suggested |
|---|---|---|---|
| 2022-EASY-HAULER-AL- | DRIVE ON BUNK TRI TRAILER 20' 2600# | All-caps + spec code (#) | 20-Foot Drive-On Bunk Boat Trailer — 2,600 lb Capacity |
| 2024-EASY-HAULER-AL- | 1000 lb Bunk Trailer | OK — clear enough | No change needed |
| 2025-EASY-HAULER-125 | 1250 lb Bunk Trailer | OK — clear enough | No change needed |
| 2026-EASY-HAULER-AL- | DRIVE ON BUNK BLACK | All-caps, vague | Drive-On Bunk Boat Trailer — Black Frame |

---

## MERCURY — 2 titles need LPG expansion

| SKU | Current | Suggested |
|---|---|---|
| 2021-MERCURY-ME-5-MH | 5 HP Outboard (LPG) | 5 HP Liquid Propane Outboard Motor |
| 2022-MERCURY-ME-5-MX | 5 HP Sailboat Outboard (LPG) | 5 HP Liquid Propane Sailboat Outboard Motor |

---

## HISUN — 5 model codes need consumer names

| SKU | Current | Suggested |
|---|---|---|
| HS-MP9550R-26 | MP9 550R | Hisun MP9 550cc Sport UTV |
| HS-MP9750R-26 | MP9 750R Sport UTV | Hisun MP9 750cc Sport UTV |
| HS-MP9T400-26 | MP9T400 Entry Sport UTV | Hisun MP9 400cc Entry Sport UTV |
| HS-SEC550EPS-26 | Sector 550 EPS | Hisun Sector 550cc Utility UTV with Power Steering |
| HS-SEC750EPS-26 | Sector 750 EPS | Hisun Sector 750cc Utility UTV with Power Steering |

Note: ACE NV and GUARDIAN are Hisun product line names — acceptable as-is. EPS = Electric Power Steering, acceptable in powersport context where buyers know the term, but expanded version above is safer for a general audience.

---

## R&J MACHINE — 2 issues

| SKU | Current | Issue | Suggested |
|---|---|---|---|
| RJ-HYDRAULIC-PWC-LIF | R&amp;J Hydraulic PWC Lift | HTML entity + PWC abbreviation | R&J Hydraulic Personal Watercraft Lift *(dev fix HTML entity)* |
| WAVE-ARMOUR-PWC-WAVE | PWC Wave Port | PWC abbreviation | Personal Watercraft Wave Port |
| WAVE-ARMOR-OTTER-SWI | Otter Swim Raft 8&#8217;x10&#8242; | HTML entities in title | Otter Swim Raft 8'x10' *(dev fix HTML entities)* |
| RJ-LUX-FLOATING-DOCK | R&amp;J LUX Floating Dock System | HTML entity + LUX is a product line name | R&J LUX Floating Dock System *(dev fix HTML entity — LUX name is acceptable)* |

**Dev note:** HTML entities (`&#8217;` = apostrophe, `&#8242;` = prime/foot mark, `&amp;` = &) in product titles will render incorrectly in some SEO plugin fields and meta tags. These should be replaced with plain UTF-8 characters at the database level.

---

## FALSE POSITIVES — No Changes Needed

These brands were flagged by the detector but their titles are acceptable plain English:

- **Minnkota:** Terrova, Riptide, Ultrex, QUEST — established product line names widely used by fishing consumers. Acceptable.
- **Cannon:** Easi-Troll, Lake-Troll, Magnum, Optimum, Uni-Troll — product line names. Acceptable.
- **Humminbird:** APEX, MEGA, XPLORE — product line names used universally in the fish finder market. Acceptable.
- **Cub Cadet:** "ZT2 42 Zero Turn" / "ZT2 54 Zero Turn" — ZT2 is a product family, Zero Turn is plain English. Acceptable.
- **Trailer:** "Boat Trailer" — maximally plain English. Acceptable (though duplicate names across 10 SKUs will be an SEO issue — dev/SEO to differentiate by year or spec).
- **Princecraft:** Sportfisher, Resorter, Amarok, Vectra — proper product names. Acceptable.

---

## Implementation Notes

- **Echo titles:** Verify CC/displacement against Echo product catalogue before applying. Model codes follow a consistent naming convention (number after prefix ≈ engine displacement in cc ÷ 10) but exact specs should be confirmed.
- **Toro titles:** Identical names across multiple SKUs need differentiating specs (deck width, engine brand/size). Flag to Casey/Lightspeed for the differentiating attribute per SKU.
- **HTML entities:** Route to dev as a database-level find-and-replace — not a content issue.
- **SEO title format reminder:** `{consumer_product_name} | {Brand} | Reyco Marine` — the suggested names above slot into that pattern cleanly.
