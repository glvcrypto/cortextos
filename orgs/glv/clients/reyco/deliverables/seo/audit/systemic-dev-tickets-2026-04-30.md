# Reyco Marine — Systemic SEO Issues: Dev Ticket Rollup
**Prepared:** 2026-04-30 by seo agent  
**Source data:** 103 pages tech-scanned (all available HTML from reyco.glvmarketing.ca staging)  
**Purpose:** Collapse per-page findings into 4 dev-fix tickets — each ticket resolves the issue site-wide rather than page-by-page.

---

## Coverage

| Scope | Count |
|-------|-------|
| Total pages tech-scanned | 103 |
| WP pages | 98 |
| Products (WC) | 374 (audited for metas in Task #12; not re-scanned here) |
| Product categories (WC) | 177 (taxonomy — covered in archive memo Task #16) |
| Blog posts | 5 (all 5 in tech-scans) |

---

## DEV TICKET 1 — Fill generic meta descriptions on 80 category/hub pages
**Scope: 80/103 pages — category, subcategory, and some hub pages**  
**Severity: P0 — launch blocker for category page SEO**

**⚠️ Correction from initial draft:** Initial analysis reported 103/103 pages with generic meta. On closer inspection, 23 pages already have custom meta descriptions — all 13 service pages, 5 blog posts, homepage, about, contact, financing, service hub, boats hub, snow equipment hub. Those 23 pages have metas set via whatever existing mechanism dev is using (theme meta box or template-level override).

**Finding:** 80 pages still render the generic fallback:
> "Reyco Marine & Small Engine Ltd. — boats, motors, lawn and snow equipment sales and service in Sault Ste. Marie, Ontario."

Affected: all category pages, subcategory pages, brand hub pages (Princecraft, Mercury, Cub Cadet, etc.), powersports/ATV series pages, snow equipment subcategories, lawn and garden subcategories, docks and lifts pages.

**Root cause investigation needed:** Since 23 pages already have custom metas WITHOUT a plugin, dev should confirm how those metas are set (theme custom fields? WP SEO meta box? static template override?). The same mechanism can be used to fill the remaining 80 rather than installing a new plugin.

**Why this matters:**
- 80 near-identical meta descriptions → Google SERP de-duplication risk across category pages
- No keyword signal for category-specific queries on any of the affected pages
- Task #12 (250 WC product metas) — if product metas are set via WC custom fields, they may already be working; dev should confirm whether product metas are live

**Fix:**
- **Option A (preferred):** Use whatever mechanism is already setting metas on the 23 pages to write custom metas for the 80 remaining. SEO agent has draft metas for P1-P2 priority pages (R15 batch audit + r17-blog-post-audit).
- **Option B:** Install RankMath (free tier) — centralises all meta management but requires migrating the 23 existing custom metas into RankMath to avoid conflicts.

**Pre-launch minimum:** Homepage, About, Contact, key section hubs (Boats, Lawn, Snow, Powersports). Category and brand pages can follow in May retainer sprint.

**Effort:** 1–2 hours dev to confirm mechanism + fill P0 pages  
**PR:** N/A (meta content is data/config, not code) — OR `feat: install-rankmath` if Option B chosen

---

## DEV TICKET 2 — Fix H1 template render on category/taxonomy pages
**Scope: 71/103 pages — site-wide template bug**  
**Severity: P0 — affects all section hubs and most category pages**

**Finding:** 71 of 103 scanned pages render a blank H1 (`<h1></h1>` present in DOM but empty, or H1 absent entirely). Service pages (R2–R14) and a handful of manually-built pages have correct H1s. The pattern breaks down by template type:

| Template type | H1 present | H1 blank |
|---------------|-----------|---------|
| Service pages (custom page template) | 13/13 | 0 |
| Homepage (custom) | 1/1 | 0 |
| About, Contact, Service hub (custom) | 3/3 | 0 |
| WC product pages | Not scanned | — |
| WC category pages / taxonomy | ~5/50 | ~45/50 |
| Custom hub pages (boats, lawn, snow, etc.) | 0/8 | 8/8 |
| Blog posts | 5/5 | 0 |
| Subcategory/brand pages | ~6/36 | ~30/36 |

**Root cause (likely):** The WC category page template and custom hub page template call `the_title()` or `get_queried_object()->name` inside an `<h1>` tag, but either:
(a) The WC category "name" field is empty for many categories in WP Admin → Products → Categories, OR  
(b) The template fires the H1 from a page-builder block that is absent on most pages — the handful with H1 (Cordless Blowers, Troy-Bilt, E-Z-GO, Apply for Financing) have manually-added page builder content.

**How to diagnose:** In WP Admin, open Products → Categories → any blank-H1 category (e.g. "Cannon Downriggers"). Check if the category "Name" field is populated. If populated but H1 is still blank, the template has a render bug. If the Name field is empty, add the name.

**Fix (two-path):**
- Path A (if WC category names are populated): Fix the template to reliably render `get_queried_object()->name` as H1 for all taxonomy/category archives.
- Path B (if WC category names are missing): Bulk-populate WC category names in WP Admin + fix template as above.

**H1 target text for priority pages:** See R15 batch audit for the H1 target text for each blank-H1 category page.

**Effort:** 2–4 hours dev (template fix + bulk-verify)  
**PR:** Single — `fix: category-page-h1-template-render`

---

## DEV TICKET 3 — Fill alt text on images site-wide
**Scope: 73/103 pages — widespread**  
**Severity: P1 — accessibility + image indexing**

**Finding:** 73 of 103 scanned pages have at least one `<img alt="">` (empty alt string). Most pages have 1 empty alt image; ATV/UTV Repair has 6; several blog posts have 3.

**Distribution:**
| Empty alt count | Pages |
|-----------------|-------|
| 6 | /service/atv-utv-repair/ |
| 3 | 3 blog posts (twenty-years-napa ×2, why-i-bet-everything) |
| 2 | Homepage, /about/ |
| 1 | 67 other pages |
| 0 | 30 pages |

**Root cause:** Images uploaded without alt text in the WordPress media library, or template rendering `alt=""` for decorative images that should have descriptive text instead.

**Fix strategy:**
1. WP Admin → Media → bulk audit for alt text. Any image with empty alt serving a functional (non-decorative) role needs descriptive alt text.
2. For decorative images (spacers, backgrounds), `alt=""` is correct — exclude from fix scope.
3. SEO-priority format: `"[Brand/subject] [context] — Reyco Marine, Sault Ste. Marie, ON"`

**ATV/UTV Repair (6 empty alt — P0):** Already flagged in pre-launch polish pass (D1). Hero images on this page have `alt=""` — fix in the same dev pass that wires Service + FAQPage schema (S2/S3).

**Effort:** 2–4 hours (bulk media library pass + template fix for hero images)  
**PR:** Single — `fix: image-alt-text-audit` (can be batched with H1 fix into one PR)

---

## DEV TICKET 4 — Investigate and resolve empty product carousel pages
**Scope: 19/103 pages — product catalog population gap**  
**Severity: P1 — Google crawls empty content**

**Finding:** 19 pages fire product carousel "empty state" messages — WC renders product card slots but the query returns zero products. Google crawls these pages and sees empty wrappers with no product content.

| Empty state fires | Pages |
|------------------|-------|
| 50 | E-Z-GO Golf Carts (/powersports/easy-go/), Troy-Bilt (/lawn-and-garden/troy-bilt/) |
| 32 | Cordless Blowers (/lawn-and-garden/cordless-blowers/) |
| 7 | Boats and Marine hub, Deck Boats, Lawn and Garden hub, Belts, Blades, Cordless Blowers, Filters, STIHL, Trimmers, Zero-Turn Mowers; Cub Cadet UTV; HS Series; Snow Equipment hub, Single-Stage, Snow Plows, Three-Stage, Two-Stage |

**Root cause:** Product data not seeded in WC for these categories. Either:
- Products exist in WC but category mapping is missing (product not assigned to the right WC category)
- Products not yet imported for these lines (Troy-Bilt, Cordless lines, some powersports, some snow equipment)

**Fix:** Dev + Casey — identify which product lines are missing from WC and either: (a) assign existing products to the correct categories, or (b) import missing product data. This is a content/data task as much as a dev task.

**Note on STIHL:** STIHL appears in the lawn-and-garden category but Reyco's authorized brand list (verified by Aiden 2026-04-28) does NOT include STIHL. A STIHL page with no products and no authorization signal should be reviewed — either remove the page or confirm Reyco carries STIHL (if so, add to authorized brand list).

**Effort:** Varies — product catalog seeding is ongoing work  
**PR:** N/A — catalog seeding is a WP Admin/WC import task, not a code change

---

## Additional Page-Specific Findings (not systemic — require individual attention)

### Homepage (`/`) — Title too long
**Issue:** Meta title is 107 characters — Google truncates at ~60 chars.
- **Current:** "Reyco Marine & Small Engine Ltd. – Boats, Outdoor Power Equipment & Small Engine Repair in Sault Ste. Marie"
- **Recommended (from homepage-seo-brief-2026-04-30.md):** "Reyco Marine & Small Engine | Sault Ste. Marie" (46 chars)
- **Impact:** Google is likely already rewriting this title in SERPs. Fix gives control back.

### Homepage (`/`) — H1 is a brand tagline, not a keyword
**Issue:** H1: "You worked for this. Your weekends should show it." — zero keyword signal, zero geo signal.
- **Recommended:** "Boat, Mower and Small Engine Dealer in Sault Ste. Marie" (from homepage brief)
- **Note:** This is a design/copy decision — confirm with Aiden before changing. The tagline may be intentional for brand positioning; the H1 SEO value is being sacrificed for it.

### Duplicate blog post title
**Issue:** Two posts share the identical title AND similar slug:
- `/twenty-years-behind-the-napa-counter-taught-me-everything/`
- `/twenty-years-behind-the-napa-counter-taught-me-everything-2/` (same title)
- **Impact:** Google de-duplication — one of these will be suppressed or treated as duplicate content. Add a canonical on the `-2` version pointing to the original, OR differentiate the titles.
- **Recommended action:** Check if `-2` is a draft/staging artifact that shouldn't be published. If so, delete or noindex it.

### Blog posts — generic meta description
**Issue:** Even blog posts with excellent, specific H1s (e.g. "How to Choose the Right Mercury Outboard for Northern Ontario") have the generic fallback meta description. Once RankMath is installed (Ticket 1), blog post metas need to be set individually.
- **Priority:** After service pages and category pages — blog posts are E-E-A-T signals but lower conversion priority.

### STIHL brand page with no products
**Issue:** `/lawn-and-garden/stihl/` has a page and category but fires 7 empty states.
- **STIHL is NOT on the confirmed authorized dealer list** (Aiden-verified: Echo, Princecraft, R&J Machine, Toro, Mercury, EZGO, Cub Cadet, Minn Kota, Cannon, Humminbird, Hisun).
- **Recommended action:** Either (a) confirm with Casey that Reyco carries STIHL and add to the brand list, or (b) delete this page or add a `noindex` until confirmed.

---

## Audit Status: 103 / 689 pages covered

| Batch | Pages | Output |
|-------|-------|--------|
| R2–R14 (service + hub pages) | 13 | pre-launch-seo-polish-pass-2026-04-29.md |
| R15 (category pages, tech-scan set 1) | 20 | r15-category-page-batch-audit-2026-04-30.md |
| R16 (hub + blog + all remaining tech-scans) | 70 | systemic-dev-tickets-2026-04-30.md (this file) |
| **Total** | **103** | — |
| Remaining: WC products (374) + WC product_category (177) + ~209 WP pages not yet in tech-scans | 586 | — |

**Next batch recommendation:** WC product category pages (177 rows) — these are the taxonomy archive pages for every product subcategory. They will have the same systemic issues as the category pages but need to be confirmed at scale. A single scan-all + aggregate pass would extend coverage significantly.

---

*No external actions taken. Internal audit only.*  
*Prepared 2026-04-30.*
