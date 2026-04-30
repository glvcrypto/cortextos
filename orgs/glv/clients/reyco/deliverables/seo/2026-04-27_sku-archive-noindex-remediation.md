# SKU-Level Archive Noindex — Remediation Options
**Produced:** 2026-04-27 by seo agent  
**Audience:** Aiden (decision) + dev (implementation)  
**Context:** 49 of 177 `/reyco-category/` archives are model-SKU level (e.g. `/reyco-category/cs-2511p/`, `/reyco-category/apex-13/`). These are thin-content pages with near-zero organic search potential — nobody searches for "CS-2511P" or "APEX 16" on Google. Left indexed, they dilute crawl budget and can drag down overall site quality signals.

---

## The Problem

49 SKU-level archives exist because WooCommerce + the reyco-category taxonomy auto-creates an archive URL for every tag/category assigned to a product. Each model SKU got its own category slug during the seeder run — correct for filtering purposes, bad for SEO.

**What Google sees on these pages:** A category archive with 1–3 products, no unique content, no search demand. Thin archive × 49 = a measurable crawl budget drain and potential quality dilution once the site is live on reycomarine.com.

**What nobody searches for:** `CS-2511P chainsaw`, `APEX 13 boat` — these are internal model codes, not how customers search. Search intent is at the subcategory level (`echo chainsaw sault ste marie`, `aluminum fishing boat ontario`).

---

## Three Remediation Options

### Option A — RankMath Noindex (Easiest, Lowest Dev Effort)

Set RankMath to noindex all `reyco-category` archives that match the SKU slug pattern.

**How:**
- RankMath → Titles & Meta → WooCommerce → Taxonomies → reyco-category
- Set `noindex` for archive pages where the term has fewer than N products (e.g. ≤3)
- Or: Casey manually noindexes the 49 SKU-level terms via RankMath's term-level settings

**Trade-offs:**

| Pro | Con |
|-----|-----|
| No structural change to WP taxonomy | Manual Casey task (49 terms) unless dev builds a bulk rule |
| Googlebot stops crawling thin pages | SKU archives still exist in the DB — ongoing maintenance as new SKUs are added |
| Reversible with one toggle | RankMath's "noindex by product count" isn't a built-in — may need a filter hook |

**Verdict:** Right call for launch. Fast, reversible, no structural risk. Casey can do it or dev can write a one-time bulk noindex script.

---

### Option B — Collapse SKU Slugs Upward (Cleanest Long-Term)

Remove the individual SKU-level taxonomy terms and replace them with parent subcategory terms only. Products tagged `cs-2511p` become tagged `chainsaws` instead (already exists as a subcategory archive).

**How:**
- Dev script: for each product tagged with a model-sku term, find its parent subcategory term and ensure the product is tagged with that instead
- Delete the 49 orphaned SKU-level taxonomy terms
- Redirect `/reyco-category/[sku-slug]/` → `/reyco-category/[parent-subcategory]/` (301)

**Trade-offs:**

| Pro | Con |
|-----|-----|
| Permanent fix — no ongoing maintenance | Requires dev work to remap + delete terms + add redirects |
| Crawl budget fully recovered | If seeder v4 re-introduces SKU terms, they come back |
| Cleaner taxonomy for filtering UX | Redirects need to stay in place long-term |

**Verdict:** Best long-term solution, but depends on seeder v4 spec not re-adding SKU terms. Should be coordinated with boss's seeder v4 plan. Not a launch blocker.

---

### Option C — Canonical to Parent Subcategory (Middle Ground)

Add a `rel=canonical` on each SKU archive pointing to its parent subcategory archive. Google consolidates signals to the parent.

**How:**
- RankMath supports custom canonicals on taxonomy archives via term-level settings
- Or dev adds a `wp_head` hook that outputs canonical for `reyco-category` archives matching SKU patterns

**Trade-offs:**

| Pro | Con |
|-----|-----|
| Googlebot consolidates to subcategory (good) | Pages still get crawled — just equity passes upward |
| No structural change | More complex than noindex for similar outcome |
| Graceful degradation if canonical is missed | Canonical isn't a directive — Google can ignore it |

**Verdict:** Weaker than noindex or collapse. Only useful if there's a reason to keep the SKU archives indexable (e.g. internal site search uses them). No obvious reason here.

---

## Recommendation

**Launch:** Option A (RankMath noindex). Casey bulk-noindexes 49 SKU-level terms before domain cutover. Takes 30 minutes with a CSV list of the slugs.

**Post-launch (after seeder v4):** Revisit Option B. Once the seeder is fixed and not re-introducing SKU-level terms, collapse them upward + add redirects. Cleaner taxonomy permanently.

---

## Casey Action Item (if Option A approved)

49 SKU slugs to noindex — full list extracted from `2026-04-26_archive-url-taxonomy-map.csv`:

```
apex-13, apex-16, apex-19,
cs-2511p, cs-2511t, cs-271t, cs-310, cs-3510, cs-352, cs-355t,
cs-361p, cs-370f, cs-4510, cs-490, cs-4910, cs-501p, cs-590,
cs-620p, cs-680, cs-7310p
```
(plus remaining 29 — full list in taxonomy map CSV, filter `pattern_type = model-sku`)

**Steps for Casey:**
1. WP Admin → RankMath → Titles & Meta → WooCommerce → reyco-category
2. For each SKU term: edit the term → RankMath tab → set "No Index"
3. Or ask dev to run: `wp term meta update --taxonomy=reyco-category <term-id> rank_math_robots '["noindex"]'` in bulk

---

*Source data: `deliverables/seo/2026-04-26_archive-url-taxonomy-map.csv` — filter pattern_type = model-sku*  
*Related: boss dispatch 1777241638705 (2026-04-26)*
