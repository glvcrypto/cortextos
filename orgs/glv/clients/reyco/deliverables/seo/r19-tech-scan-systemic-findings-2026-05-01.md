# Reyco Marine — R19+ Batch Audit: Systemic Findings & Dev Tickets
**Prepared:** 2026-05-01 by seo agent  
**Source:** 103-page tech-scan HTML dump audit (tools/tech-scan-audit.py)  
**Full data:** tech-scan-audit-20260501-0037.csv + summary MD  
**Scope:** WC category pages, blog posts, landing pages, core WP pages (excludes WC products — pending PR #124)

---

## Four Systemic Findings

| Finding | Pages affected | Severity | Dev ticket? |
|---------|---------------|----------|-------------|
| Generic meta description (site-wide fallback) | 81/103 (79%) | P1 | YES |
| Empty H1 text (WC categories — server-side blank, JS-populated) | 71/103 (69%) | P2 | YES |
| Partial alt text (images missing alt attributes) | 73/103 (71%) | P2 | YES — bulk fix |
| Staging-domain canonical (reyco.glvmarketing.ca) | 102/103 (99%) | P2 | YES — post-launch |

---

## Ticket 1 — Generic Meta Description (P1 · 81 pages · Fix before GSC submission)

### What's happening
81 pages are serving the site-wide fallback meta description:
> "Reyco Marine & Small Engine Ltd. — boats, motors, lawn and snow equipment sales and service in Sault Ste. Marie, Ontario."

This string was first identified on 80/98 WP pages in the Apr 26 audit. It's now confirmed across 81/103 pages in this batch — the same fallback hitting WC categories, blog posts, landing pages, and some WP pages.

### Root cause
RankMath's default meta description fallback is firing for every page where no custom description has been entered in the page/post editor. RankMath's "Snippet Variables" feature can auto-generate category descriptions from WooCommerce's built-in category description field, or from the post excerpt for blog posts — but neither is wired up.

### Fix options

**Option A (recommended) — RankMath category/archive meta templates**  
RankMath → Titles & Meta → Products → Product Category:  
Set `Meta Description` template to:  
```
%wc_category_description%
```
This auto-serves the WC category description field if populated. It removes the fallback for categories where a description is written.

Prerequisite: WC category descriptions must be populated (see Ticket 1b below).

**Option B — Bulk meta via RankMath import**  
Export RankMath meta table → add custom descriptions → reimport. Higher effort but covers all edge cases.

**Option C (interim) — Any custom description beats fallback**  
Even a templated "Shop [category name] at Reyco Marine in Sault Ste. Marie, Ontario." per category beats the generic fallback. The SEO agent can generate these descriptions for all 177 WC categories as a batch (similar to Task #29 blog post metas).

### Priority pages (most indexation value)
In rough priority by search volume potential:
1. `/boats-and-marine/` — top-level marine category
2. `/boats-and-marine/fishing-boats/` — high-intent transactional
3. `/boats-and-marine/outboard-motors/` — Mercury/Princecraft brand search
4. `/lawn-and-garden/` — top-level OPE category
5. `/snow-equipment/` — seasonal high-intent
6. `/docks-and-lifts/` — lower competition, high local intent

### Impact if unfixed
Google may suppress category pages from SERPs or show the raw fallback string as the snippet, which reduces CTR. For local-intent searches like "fishing boats Sault Ste. Marie", a generic meta loses to a competitor with a specific, relevant snippet.

---

## Ticket 1b — WC Category Descriptions (prerequisite for Ticket 1 Option A)

Most WC product categories have no description text set. To use `%wc_category_description%` as the RankMath template, descriptions must exist.

**SEO agent action (can do immediately):** Draft category descriptions for the 177 WC categories — 1–2 sentences each, keyword-specific, local. This is the same workflow as the blog post meta batch (Task #29).

**Dev action:** No dev work needed for the descriptions themselves — they're editable in WP admin → Products → Categories. Either SEO agent writes them directly via WC REST API (write-scoped key needed), or dev bulk-imports via WP CSV importer.

---

## Ticket 2 — Empty H1 Text on WC Category Pages (P2 · 71 pages)

### What's happening
71 pages have an H1 tag present in server-rendered HTML (`H1_COUNT: 1`) but the tag is empty (`<h1></h1>`). The text is populated at runtime via JavaScript.

### Which pages
Primarily WooCommerce product category archive pages (e.g. `/boats-and-marine/fishing-boats/`, `/lawn-and-garden/riding-mowers/`). Blog posts and core WP pages have properly populated H1s server-side.

### Why it matters
Google crawls in two phases: a fast pass that reads server-rendered HTML, and a slower JavaScript render queue. If the H1 is blank in the initial server-side HTML, Google's first-pass crawl sees no H1. Category pages get their initial ranking signal assigned based on the fast pass. A blank H1 weakens the keyword signal for the category page.

### Root cause
WooCommerce's `woocommerce_page_title()` function outputs the H1 server-side by default. The blank H1 suggests the theme is overriding this with a JavaScript-rendered title (e.g. a React or Alpine.js component that fills the H1 after DOM load).

### Fix
Confirm where the H1 is being rendered: inspect the PHP template for `archive-product.php` or the page builder template. If the H1 is wrapped in a JS component, either:
1. Output the static WC category title in the PHP template directly (server-side `<?php echo woocommerce_page_title(); ?>`)
2. Or ensure the JS hydration fires quickly enough to be captured in Google's render pass

**Dev ticket:** "Audit H1 template in WC category archive pages — ensure title renders server-side in PHP, not JS-only."

---

## Ticket 3 — Partial Alt Text (P2 · 73 pages · Bulk fix)

### What's happening
73/103 pages have images with missing alt attributes. Pattern in P2 pages:
- Service pages: 6/9 images missing alt (consistent across all 9 service pages — suggests the slider/gallery component has no alt wiring)
- Blog posts: 3/9 images missing alt  
- Top-level category pages: 1/12 images missing alt (likely the hero image)

### Fix
Service pages: the repeating `6/9` pattern across all service pages (Marine, Small Engine, Lawn Equipment, Snow Equipment, Spring Commissioning, Tune-Ups, Warranty, ATV/UTV, Winterization) means this is a systemic template issue, not per-page content. One template fix covers all 9 service pages.

Blog posts: individual post images need alt text added in the WP media library per image.

**Dev ticket:** "Service page template — add alt attributes to service gallery/slider images (covers all 9 service pages in one template fix)."

---

## Ticket 4 — Staging-Domain Canonical (P2 · 102 pages · Post-launch)

### What's happening
102/103 pages have canonical tags pointing to `reyco.glvmarketing.ca` instead of `reycomarine.com`.

### Fix timing
**Do NOT fix until domain cutover day.** Changing canonicals on staging would tell Google the staging URLs are the canonical ones — which is fine for now. The fix is:
1. When `reycomarine.com` goes live and DNS propagates
2. Update `siteurl` and `home` in WP Settings to `https://reycomarine.com`
3. RankMath picks up the new domain for all canonical tags automatically
4. Submit sitemap to GSC immediately after

This is a Day 0 action on domain cutover — part of the GSC integration plan already documented in `may-retainer-readiness-2026-04-30.md`.

---

## Additional Findings (Non-systemic)

| Page | Finding | Priority |
|------|---------|----------|
| Homepage (`/`) | Title 107 chars — too long for SERPs (>60). Current: "Reyco Marine & Small Engine Ltd. – Boats, Outdoor Power Equipment, Marine Sales and Service". Trim to ≤60. | P2 |
| `/service/order-parts/` | Meta desc 219 chars — significantly over the 155-char limit. Will truncate in SERPs. | P2 |
| `/service/` | Meta desc 159 chars — just over limit. | P2 |
| `/choosing-mercury-outboard-northern-ontario/` | Title 96 chars — too long. Blog post title needs a shorter SEO title set in RankMath. | P2 |
| `/princecraft-fishing-boats-northern-ontario/` | Title 115 chars — same issue. | P2 |

---

## Priority Order for Dev Sprint

| Ticket | Effort | Impact | When |
|--------|--------|--------|------|
| T2: Service page alt template fix | 30 min | Fixes 9 service pages at once | Now (pre-launch) |
| T1: RankMath category meta template | 15 min config + SEO batch | Fixes 81 pages P1 | Now (pre-launch) |
| T2b: WC category H1 server-side render | 1–2h | Fixes 71 WC category pages | Now (pre-launch) |
| T1b: SEO agent writes 177 WC category descriptions | SEO bandwidth | Enables T1 Option A | SEO agent can start now |
| T3: Blog post alt text | Manual per-post | Covers ~3 blog posts with issues | Week 1 retainer |
| T4: Staging canonical → reycomarine.com | 5 min | Auto-fixed by domain update | Domain cutover day |

---

## What's NOT a systemic issue (reassuring)
- **PHP errors: 0** — no server-side errors on any of the 103 pages
- **Missing H1 (completely absent): 0** — all pages have an H1 tag (even if text is empty)
- **Missing canonical: 0** — all pages have a canonical tag
- **Missing schema: 0** — all pages have at least 1 schema block
- **Missing meta description: 0** — all pages have a meta desc tag (just the fallback one)
- **Generic titles: 0** — all page titles have a meaningful page-specific prefix

---

*No external actions taken. Internal analysis and dev ticket candidates.*  
*Prepared 2026-05-01. Source data: tech-scan-audit-20260501-0037.csv (103 pages).*  
*Next: SEO agent to draft 177 WC category descriptions as Ticket 1b batch (ready to start).*
