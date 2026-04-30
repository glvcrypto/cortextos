# Schema URL Audit — Post-Launch
**Produced:** 2026-04-26 by seo agent  
**Updated:** 2026-04-26 — URL structure confirmed by dev (functions.php source)  
**Input:** `orgs/glv/clients/reyco/deliverables/url-inventory-2026-04-26.csv` (dev sweep, pending CI ~8-10 min)  
**Source file audited:** `deliverables/seo/schema/schema-markup-templates.md`

---

## Audit Protocol

For each service page schema block, verify:
1. The `serviceUrl` in schema matches the actual live URL from dev's inventory
2. The `**URL:**` header in schema-markup-templates.md matches the same live URL
3. If mismatch: log as `schema_url_mismatch` with file + line reference

**Ground-truth rule:** live URL → copy file URL → schema URL. Schema is last to be updated; if copy and schema fork on slug naming, the live URL wins.

---

## Known URL Discrepancy Pre-Audit

Copy files (draft URLs using `/service/[slug]/`) vs schema templates (`/service-and-repair/[slug]/`):

**URL structure confirmed by dev 2026-04-26:** `functions.php` uses `home_url('/service/' . $slug . '/')`. Copy file URLs are correct. All schema `/service-and-repair/` paths are wrong.

| Page | Live URL (confirmed) | Wrong Schema URL | Schema Lines to Fix | Status |
|------|---------------------|-----------------|---------------------|--------|
| Small Engine Repair | `/service/small-engine/` | `/service-and-repair/small-engine-repair/` | L101, L123 | CONFIRMED MISMATCH — fix queued |
| Marine / Boat Service | `/service/marine/` | `/service-and-repair/boat-service/` | L145, L166 | CONFIRMED MISMATCH — fix queued |
| Boat Winterization | `/service/winterization/` | `/service-and-repair/boat-winterization/` | L187, L209 | CONFIRMED MISMATCH — fix queued |
| Spring Commissioning | `/service/spring-commissioning/` | `/service-and-repair/spring-commissioning/` | L225, L247 | CONFIRMED MISMATCH — fix queued |
| Engine Repair | `/service/engine-repair/` | `/service-and-repair/engine-repair/` | L373, L395 | CONFIRMED MISMATCH — fix queued |
| Tune-Ups | `/service/tune-ups/` | `/service-and-repair/tune-ups/` | L418, L440 | CONFIRMED MISMATCH — fix queued |
| Lawn Equipment Service | `/service/lawn-equipment/` | `/service-and-repair/lawn-equipment-service/` | L464, L486 | CONFIRMED MISMATCH — fix queued |
| Snow Equipment Service | `/service/snow-equipment/` | `/service-and-repair/snow-equipment-service/` | L506, L528 | CONFIRMED MISMATCH — fix queued |
| ATV/UTV Repair | `/service/atv-utv-repair/` | `/service-and-repair/atv-utv-repair/` | L548, L569 | CONFIRMED MISMATCH — fix queued |
| Order Parts (service page) | `/service/order-parts/` | `/parts/` | L588, L618 | CONFIRMED MISMATCH — fix queued |
| Warranty Claims | `/service/warranty/` | `/warranty-claims/` | L645, L669 | CONFIRMED MISMATCH — fix queued |
| About | `/about/` | `/about/` | L308, L316, L338 | CONFIRMED CORRECT — no change needed |

---

## Product URL Pattern — Confirmed

**Dev confirmed 2026-04-26:** Individual products at `/products/{slug}/`. Product archive at `/products/`. No `/parts/` archive — `/service/order-parts/` is a service page (order form only).

| Element | Was Assumed | Confirmed Correct | File to Fix |
|---------|-------------|-------------------|-------------|
| ItemList `url` (carousel page) | `https://reycomarine.com/parts/` | `https://reycomarine.com/service/order-parts/` | `order-parts-carousel-schema-direction.md` section 3 |
| ListItem `url` per product | `https://reycomarine.com/parts/[slug]/` | `https://reycomarine.com/products/[slug]/` | `order-parts-carousel-schema-direction.md` section 3 |
| Order Parts Service schema serviceUrl | `reycomarine.com/parts/` | `reycomarine.com/service/order-parts/` | `schema-markup-templates.md` L618 |

---

## Post-Launch Action Template

Once `url-inventory-2026-04-26.csv` lands, run this sweep:

For each `PENDING` row above:
1. Look up the page in dev's inventory → get actual `url` + `status_code`
2. If actual URL ≠ schema URL:
   - Log: `MISMATCH — schema references [schema_url] (HTTP [code]) — actual live URL is [live_url] — fix: update schema-markup-templates.md line [N]`
3. If actual URL = schema URL: mark CONFIRMED
4. If HTTP 404: mark BROKEN — escalate to dev

**Output:** completed version of this table, then update `schema-markup-templates.md` in a single PR with all corrections.

---

---

## Fix Plan — Single PR After Inventory Lands

**Files to update:**
1. `schema-markup-templates.md` — 11 serviceUrl + URL header fixes (all `/service-and-repair/` → `/service/`, plus Order Parts `/parts/` → `/service/order-parts/`)
2. `order-parts-carousel-schema-direction.md` — ItemList page URL + all ListItem product URLs (`/products/[slug]/`)

**Trigger:** dev pings when `url-inventory-2026-04-26.csv` is written. Sweep CSV to catch any remaining unknowns, then open single PR.

*Updated 2026-04-26 — URL structure confirmed by dev. Awaiting dev inventory CSV for HTTP status verification before PR.*
