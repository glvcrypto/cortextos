# Reyco Marine — CLIENT.md

> **Static client reference.** Stable facts only. High-churn operational state lives in `CLIENT_STATUS.md` (same directory).
> **Maintained by:** boss agent — update when a material fact changes (new brand, staff change, tech migration, etc.).
> **Load this file before any Reyco work.**

---

## Identity

- **Business:** Reyco Marine & Small Engine Ltd
- **Industry:** Marine + power equipment dealer (boats, small engine, lawn/snow, ATV/UTV, parts + warranty)
- **Location:** 11 White Oak Drive, Sault Ste. Marie, ON P6B 4J7
- **Phone:** (705) 253-7828
- **Founded:** 2022
- **Live site:** https://reycomarine.com
- **Canonical email:** info@reycomarine.com

## Engagement

- **Retainer:** $2,000/mo SEO. Started 2026-05-06 (site cutover day). No separate dev fee — dev work is included.
- **Scope:** SEO retainer + WordPress/WooCommerce site build & maintenance + product listings + social content + press.
- **Primary GLV channel:** #internal-reyco (Slack C0AQWLHQJJC) — all deliverables land here.
- **Client-shared channel:** #c-reyco-marine (Slack C0APQEXEL4V).

## Key Contacts

- **Casey Davieaux** — Owner. Slack U0ARE306H0T. Handles Lightspeed DMS inventory / WebUnit flags.
- **Aaron Barbarie** — Co-owner / Service Manager. Manages the service side day to day.
- **Charlene Couture (ccouture)** — client contact. Slack U0APHHWP1RV. Routes to Casey + Aaron.
- **Jak Cameron** — passed dealer-portal logins / DealerTrack financing link.

## Staff Roster (who may appear on-site / in content)

| Name | Role | On-site OK |
|------|------|-----------|
| Casey Davieaux | Owner | yes |
| Aaron Barbarie | Co-Owner / Service Manager | yes |
| Lynn | Parts Manager | yes |
| Ron | Parts | yes |
| Lee | Technician | yes |
| Damian | Technician | yes |
| Cody | Technician | yes |
| **Kory** | **DEPARTED** | **NO — must never appear on site or in content** |

## Authorized Brands (11)

Echo · Princecraft · R&J · Toro · Mercury · EZGO · Cub Cadet · Minn Kota · Cannon · Humminbird · Hisun

- **Easy Hauler + generic Trailer** — stock-only, NOT positioned as authorized-dealer brands.
- STIHL is **not** a Reyco brand (competitor reference only).

## Tech Stack

- **CMS:** WordPress + WooCommerce
- **Theme:** custom `reyco-marine` theme
- **Hosting:** SiteGround, fronted by Cloudflare
- **Inventory:** Lightspeed DMS → WooCommerce sync (WebUnit flag gates which products sync)
- **SEO plugin:** Rank Math
- **Repo:** `glvcrypto/reyco-marine` — **default branch `master`** (not main). All gh/git ops use `--base master`.
- **Staging:** reyco.glvmarketing.ca — **intentionally closed** as of 2026-05-19. PR retests use production or local.
- **Local test env:** `C:\Users\joshu\Local Sites\reyco-marine\app\public` → reyco-marine.local (apache port 10005). `pr-test-local.bat` helper exists.

## Brand / Content Rules (Reyco-specific)

- **Voice:** UGC sales-floor narrative — emulate the Vectra pontoon listing style. First-person, knowledgeable, warm.
- **Defensible heritage claim:** "more than 60 years on White Oak Drive" pattern is verified-safe (per existing meet-the-team copy). Do not invent other tenure claims.
- **Expert reviews / product copy:** name only verified staff (Casey/Aaron sales, Lynn parts, Lee/Damian/Cody service). Never Kory.
- **Standard GLV content rules apply:** 0 em-dashes, 0 AI-tells, Canadian English in body, US spelling for brand proper nouns + US-dominant category terms only.

## Site Architecture Gotchas

- **Page templating:** WP page rendering is determined by `_wp_page_template` post_meta, NOT theme filename. Repo has dead/legacy templates. Probe live before claiming a template serves a page.
- **Brand archives** (`/boats-and-marine/<brand>/`) use the **series-showcase engine** + `product_brand` taxonomy auto-supplement (PR #244, #246).
- **Taxonomy:** products use `product_category` + `product_brand`. Custom rewrite slug `/reyco-category/` — "Reyco categories", not default WC categories.
- **Product specs / expert review** save via `sanitize_textarea_field` (PR #247 — `sanitize_text_field` stripped newlines). Specs format: `Label|Value`, one per line, in the `_product_specs` meta textarea.
- **Hardening standard:** error tracking, rate limiting, uptime monitor, security hardening, rollback runbook — default in every build, never up-charged.

## Working Conventions

- **Local-test theme PRs before merge** — `gh pr checkout` → copy to Local Sites → verify on reyco-marine.local → then merge to master.
- **Reyco PR retests:** production (reycomarine.com) or local — staging is closed.
- Competitor research: 3 real SSM-area locals — Northshore Sports + Auto, Rivercity Motorsports + Marine, Loonie Toons Pontoons. Reyco's moat = small engine + Cub Cadet/Toro authorized dealer (no competitor carries those).

---

*See `CLIENT_STATUS.md` for current engagement week, deliverable pipeline, open gates, last touch.*
