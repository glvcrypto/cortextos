# Sample Batch — 10 Products Across 3 Brands
# For Boss/User Review Before Bulk WP Import

Phase 1 image scraping complete for Hisun, Minn Kota, and Humminbird/Cannon.
These are the first 10 products proposed for WP import. Review image quality before bulk proceed.

---

## Brand 1: Hisun (4 products)

| # | SKU | Product | Image URL | Source |
|---|-----|---------|-----------|--------|
| 1 | HS-STRK250R-26 | Strike 250R — Youth Sport UTV | https://www.hisunmotors.com/images/uploads/20231211/800_stike250blue-110557.png | hisunmotors.com |
| 2 | HS-SEC550EPS-26 | Sector 550 EPS — Utility UTV | https://www.hisunmotors.com/images/uploads/20231207/800_sector550red-102158.png | hisunmotors.com |
| 3 | HS-STRY750X-26 | Stryker 750X — Sport-Trail UTV | https://www.hisunmotors.com/images/uploads/20250506/800_stryker-red-750x-front-angle-w-vents-102322.png | hisunmotors.com |
| 4 | HS-ACENV-26 | ACE NV — Electric Golf Cart | https://www.hisunmotors.com/images/uploads/20231211/800_aceblue-112942.png | hisunmotors.com |

Notes: All Hisun images are 800px PNG, transparent-friendly backgrounds. Color shown = default hero color on manufacturer site (typically red or blue). Not editable — manufacturer photos.

---

## Brand 2: Minn Kota (3 products)

| # | SKU | Product | Image URL | Source |
|---|-----|---------|-----------|--------|
| 5 | MK-TER80-26 | Terrova 80 (Trolling Motor) | https://johnsonoutdoors.widen.net/content/k3fqzoosr0/webp/MK_Terrova_QUEST_HeroAlt.webp?w=640 | minnkota.johnsonoutdoors.com |
| 6 | MK-ULT80-45-26 | Ultrex 80 lb / 45" | https://johnsonoutdoors.widen.net/content/panck07gjo/webp/MK_Ultrex_QUEST_HeroAlt.webp?w=640 | minnkota.johnsonoutdoors.com |
| 7 | MK-RTQUEST9115-72-26 | Riptide Terrova QUEST 90/115 | https://johnsonoutdoors.widen.net/content/esb89bkugo/webp/MK_RiptideTerrova_QUEST_HeroAlt.webp?w=640 | minnkota.johnsonoutdoors.com |

Notes: Minn Kota images served via johnsonoutdoors.widen.net CDN as WebP. 640px wide. Clean white-ish studio backgrounds. Motor variants (shaft length, thrust) share a hero image per model family — industry standard for accessory products.

---

## Brand 3: Humminbird/Cannon (3 products)

| # | SKU | Product | Image URL | Source |
|---|-----|---------|-----------|--------|
| 8 | HB-HLX7CH-26 | HELIX 7 CHIRP GPS G4N | https://johnsonoutdoors.widen.net/content/key3ri2qru/webp/HB_411630-1_HELIX_7_CHIRP_GPS_G4N_alt1.webp?w=640 | humminbird.johnsonoutdoors.com |
| 9 | HB-APEX13-26 | APEX 13 MEGA SI+ Chartplotter | https://johnsonoutdoors.widen.net/content/uhblzlafdp/webp/HB_411470-1VX_APEX_VX_13_alt1.webp?w=640 | humminbird.johnsonoutdoors.com |
| 10 | CAN-MAG10TS-26 | Cannon Magnum 10 TS Downrigger | https://johnsonoutdoors.widen.net/content/4ailedo0xx/webp/CN_1902310_Magnum10TS_3qLowRight.webp?w=640 | cannon.johnsonoutdoors.com |

Notes: All Johnson Outdoors brands (Humminbird, Cannon, Minn Kota) use the same Widen DAM CDN. WebP format, 640px. Clean neutral backgrounds.

---

## Phase 1 Summary

| Status | Count | Notes |
|--------|-------|-------|
| ready (image URL found) | ~40 | Hisun complete (17/20), Minn Kota motors (10/16), Humminbird main units (7/13), Cannon flagship (3) |
| flag-dealer-portal | ~35 | Accessories, cables, Cannon manual downriggers, Minn Kota chargers, Hisun HS/Forge models not in public sitemap |
| flag-js-render | 68 | All Echo products — echo-usa.com renders via JavaScript; WebFetch returns 404 on all product page patterns |
| skip (accessory, no photo) | ~9 | Downrigger weights, cables — no meaningful product photo exists |

## Echo Blocker

Echo USA's site (echo-usa.com) is fully JS-rendered — no product images accessible via standard HTTP fetch. Options:
1. Dev agent runs headless Puppeteer/Playwright scraper against echo-usa.com product pages
2. Contact Echo Canada dealer portal for product image pack (recommended — they often have a dealer media kit)
3. echo-can.ca was unreachable (ECONNREFUSED) — may be down temporarily

Recommendation: Route Echo to dev agent for headless scrape. This unblocks 68 products in one pass.

## Full CSV

Path: `clients/reyco-marine/assets/product-images/phase1-image-map.csv`
All 160 seeded products mapped with status.

## Next Steps (Pending Sample Approval)

1. User/boss approves sample images
2. Dev agent runs WP CLI import for approved images (set as featured images on correct products)
3. Dev agent or Puppeteer scrape handles Echo 68 products
4. Follow-up CSV for missing products sent to Casey/dealer portal for their image packs
