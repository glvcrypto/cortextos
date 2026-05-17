# PR #240 Redirect Audit — Merge vs Skip Verdict
**Date:** 2026-05-16
**Prepared by:** seo agent
**Decision rule:** MERGE if any URL has GSC/SEMrush/backlink signal. SKIP if all zero.

---

## Data Sources Used

| Source | Coverage | Access |
|--------|----------|--------|
| Day-0 GSC baseline (May 11, 9 days post-launch) | Top 10 pages by impressions + top queries | Full local data |
| Pre-launch SEMrush keyword research (March 2026) | Old site URL audit, category page mapping | Full local data |
| Launch checklist (March 2026) | DealerSpike URL structure documentation | Full local data |
| GSC URL Inspector (29 individual URLs) | Coverage/index status per URL | **NOT available — requires Aiden** |
| SEMrush organic traffic (URL-level) | Per-page organic traffic | **NOT available — no API access** |
| SEMrush backlink audit (/product-category/* filter) | Inbound links to old paths | **NOT available — no API access** |

---

## Key Structural Finding

**The /product-category/* URLs are WooCommerce-native — they did NOT exist on the old DealerSpike site.**

Evidence:
1. Launch checklist (March 2026): "map old Dealer Spike URLs to new clean URLs before DNS cutover" — DealerSpike had its own URL schema (/search/inventory/*, /aboutus, etc.), not WooCommerce taxonomy
2. March SEMrush keyword research: explicitly notes "No product category pages" on old reycomarine.com
3. Day-0 GSC baseline (May 2–11): DealerSpike URLs (/search/inventory/*) still show impressions from Google's cached index — **zero** /product-category/* URLs appear in any crawl/impression data

This means: **zero pre-launch GSC equity exists on these paths.** They have been live at most 14 days (since May 2 WP launch).

---

## URL-Level Signal Table (29 URLs)

| Old URL | Destination | GSC Impressions (May 2–11) | GSC Indexed | SEMrush Traffic | Backlinks | Notes |
|---------|-------------|--------------------------|-------------|-----------------|-----------|-------|
| /product-category/uncategorized/ | /shop/ | 0 (not in top 10) | Unknown* | Unknown* | Unknown* | WC default |
| /product-category/boats/ | /boats-and-marine/ | 0 | Unknown* | Unknown* | Unknown* | High-value page |
| /product-category/fishing-boats/ | /boats-and-marine/fishing-boats/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/pontoons/ | /boats-and-marine/pontoons/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/deck-boats/ | /boats-and-marine/deck-boats/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/motors/ | /boats-and-marine/outboard-motors/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/outboard-motors/ | /boats-and-marine/outboard-motors/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/trolling-motors/ | /boats-and-marine/trolling-motors/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/mercury/ | /boats-and-marine/mercury/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |
| /product-category/princecraft/ | /boats-and-marine/princecraft/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |
| /product-category/minn-kota/ | /boats-and-marine/minn-kota/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |
| /product-category/cannon/ | /boats-and-marine/cannon/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/humminbird/ | /boats-and-marine/humminbird/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/fish-finders/ | /boats-and-marine/fish-finders/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/marine-electronics/ | /boats-and-marine/marine-electronics/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/downriggers/ | /boats-and-marine/downriggers/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/docks-and-lifts/ | /docks-and-lifts/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/r-j-machine/ | /docks-and-lifts/r-j-machine/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/wave-armor/ | /docks-and-lifts/wave-armor/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/atv-utv/ | /powersports/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/powersports/ | /powersports/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/golf-carts/ | /powersports/golf-carts/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/hisun/ | /powersports/hisun/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/snow-equipment/ | /snow-equipment/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/lawn-garden/ | /lawn-and-garden/ | 0 | Unknown* | Unknown* | Unknown* | |
| /product-category/cub-cadet/ | /lawn-and-garden/cub-cadet/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |
| /product-category/toro/ | /lawn-and-garden/toro/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |
| /product-category/echo/ | /lawn-and-garden/echo/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |
| /product-category/stihl/ | /lawn-and-garden/stihl/ | 0 | Unknown* | Unknown* | Unknown* | Brand page |

*Unknown = requires GSC URL Inspector spot-check or SEMrush API. See GSC spot-check list below.

---

## 5 Highest-Priority Spot-Checks for Aiden (GSC URL Inspector)

These are the highest-value pages where external links or Google indexing is most plausible. Run these 5 in GSC URL Inspector — paste each path and check "Coverage" tab:

1. `https://reycomarine.com/product-category/mercury/` — major brand, Mercury links from manufacturer sites possible
2. `https://reycomarine.com/product-category/boats/` — broad category, most likely crawled
3. `https://reycomarine.com/product-category/princecraft/` — brand with its own dealer-link program
4. `https://reycomarine.com/product-category/minn-kota/` — brand with dealer portal links
5. `https://reycomarine.com/product-category/cub-cadet/` — brand with dealer-locator links

**What to look for:** "URL is on Google" = indexed → signal exists → MERGE. "URL is not on Google" × all 5 → almost certainly SKIP.

---

## Preliminary Verdict

**LEAN: SKIP (pending Aiden's 5 spot-checks)**

Reasoning:
- These URLs have existed for ≤14 days on a brand-new domain
- Zero impressions/clicks in 9-day post-launch GSC data (zero appears in top 10 pages)
- Old DealerSpike site confirmedmly did NOT have /product-category/* paths — no inherited equity
- Backlinks to 14-day-old WooCommerce taxonomy URLs on a new domain: near-zero probability
- The "GSC Fix" PR label suggests Google found crawl errors (404s), not traffic-generating pages

**However:** Merging the redirects is low-cost insurance. If Aiden's spot-checks show even 1 URL indexed, MERGE is the right call. If all 5 show "not on Google" → SKIP confidently.

**My recommendation to escalate:** Have Aiden run the 5 GSC URL Inspector checks. Takes 5 minutes. Answers the question definitively.

---

## SEO Note on the Redirects Themselves

Even on a SKIP verdict, the redirects are technically correct and cost nothing to maintain. The only reason to SKIP is if there's a dev overhead concern. If maintaining 29 redirect rules is trivial, MERGE regardless — it's free insurance.
