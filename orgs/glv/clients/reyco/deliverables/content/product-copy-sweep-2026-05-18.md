# Reyco Product Page Copy Sweep: Full Site Audit

**Date:** 2026-05-18
**Source dispatch:** boss msg 1779148907951-boss-xuyow (Aiden directive 2026-05-19 00:08 UTC, expansion of category-copy-sweep dispatch).
**Live site swept:** `https://reycomarine.com/` (production).
**Scope:** all product pages on site (full sitemap crawl).

---

## Headline

**250 products scanned. 10 flagged. ~96% clean baseline.**

Of the 10 flagged:
- **2 are scan false-positives** (engine displacement codes mis-matched as count claims).
- **8 are the same single recurring claim** about a third-party manufacturer (R&J Machine), repeating across all 8 R&J dock/lift product pages. Needs one verification, not eight fixes.

**Zero P1 issues found.** No em-dashes, no AI-tells, no banned phrases, no unverified staff names in service-bay context, no non-Canadian spellings across any of the 250 product pages.

The bulk-pasted WooCommerce product copy is in good shape.

---

## Scan methodology

Pulled all product URLs from `https://reycomarine.com/product-sitemap1.xml` (200 products) + `product-sitemap2.xml` (50 products) for a total of 250 product pages. Fetched all in parallel via `xargs -P 12 curl`, scanned each for:

**P1 (factual / banned)**
- Em-dash characters (U+2014)
- AI-tell phrases (vague-verb cliches, formulaic transitions, hedging openers)
- Negation-tricolon (`No X. No Y. [point].`) overuse

**P2 (voice / claim integrity)**
- Hardcoded count claims (`N models`, `N boats`, `N engines`, etc.) outside spec-block context
- Experience-year claims (`over N years`, `N+ years`, `after N years`) other than the verified `more than 60 years` Reyco phrase
- Hardcoded ratings, prices, percentages outside spec context

**P3 (polish / coordination)**
- Staff names not in the verified Reyco roster (Lee, Damian, Cody, Lynn, Ron, Aaron, Casey, Jak, Sarah)
- Non-Canadian English spellings (`-ize`, `-ization`, `-or`, `-er` variants where `-our`, `-re` apply), with brand-canonical exception for `winterize/winterization`

Verified Reyco staff roster pulled directly from `/about/meet-the-team/` page, not from prior dispatch (boss spec listed 6, live team page lists 7 active + 1 customer testimonial; Kory in boss spec but absent from team page).

---

## Flagged products (10)

### Group A: scan false-positives (2 products)

These caught the count-claim regex because they include engine displacement / model series numbers. The numbers are spec values, not claims about product inventory.

#### 1. `/product/hisun-sector-250-compact-utility-utv/`
- **Issue:** `the 250 series engine`
- **Severity:** P2 (downgrade to noise)
- **Verdict:** False positive. "250" is the Hisun Sector 250 model designation. No fix needed.

#### 2. `/product/hisun-strike-550r-adult-sport-utv/`
- **Issue:** `the 550 series engine`
- **Severity:** P2 (downgrade to noise)
- **Verdict:** False positive. "550" is the Hisun Strike 550R engine displacement (cc). No fix needed.

### Group B: R&J Machine 50-year claim (8 products)

Same exact line repeating across the R&J Machine dock and lift product pages. Two phrasings used:

- 4 lift pages: `R&J Machine has been building lifts for Ontario lakefronts for 50 years. They know what the freeze-thaw cycle does...`
- 4 dock pages: `Bottom type, water depth, exposure all factor in. After 50 years building docks for Ontario lakefronts...`

#### Pages affected
1. `/product/rj-cantilever-boat-lift/`
2. `/product/rj-floating-truss-dock/`
3. `/product/rj-hydraulic-boat-lift/`
4. `/product/rj-hydro-extreme-boat-lift/`
5. `/product/rj-lift-up-step-dock/`
6. `/product/rj-lux-floating-dock-system/`
7. `/product/rj-truss-pipe-dock-aluminum/`
8. `/product/rj-wavex-modular-dock-system/`

- **Issue:** "50 years" is a third-party manufacturer claim about R&J Machine, not a Reyco self-claim. The Reyco-canonical phrase (`more than 60 years`) applies to Reyco's own years in business, not suppliers.
- **Severity:** P2 (claim integrity).
- **Action needed:** one verification, not eight fixes. Confirm R&J Machine's actual years in business. Public records suggest R&J was founded in the early 1970s, which would put 50 years in the right ballpark for 2026, but this needs source-of-truth confirmation before being asserted on a live page.

**If 50 years verifies:** no change needed. Claim stands.

**If 50 years does not verify:** soft-claim replacement preserves the trust-builder without the number. Drop-in copy below.

#### Soft-claim replacement (if "50 years" fails verification)

For the 4 lift pages:
- **Current:** `R&J Machine has been building lifts for Ontario lakefronts for 50 years. They know what the freeze-thaw cycle does...`
- **Replacement:** `R&J Machine has been building lifts for Ontario lakefronts for decades. They know what the freeze-thaw cycle does...`

For the 4 dock pages:
- **Current:** `Bottom type, water depth, exposure all factor in. After 50 years building docks for Ontario lakefronts...`
- **Replacement:** `Bottom type, water depth, exposure all factor in. After decades of building docks for Ontario lakefronts...`

`Decades` is defensible whether the actual figure is 30, 50, or 70.

Alternative (if R&J's founding year is verifiable but not exactly 50): replace `50` with the actual figure or a `since YYYY` phrase.

---

## What the sweep did NOT find

Worth surfacing, since the absence of these issues across 250 pages is itself a useful baseline:

- **Zero em-dashes** in product body copy. The grep gate is holding across the bulk-pasted catalog.
- **Zero AI-tells.** No vague-verb cliches, formulaic transitions, or hedging openers in any product body copy.
- **Zero unverified staff name claims** in service-bay context. None of the product pages assert names outside the verified roster in a `serviced by`, `handles`, `our tech`, `bench`, `warranty`, `rigged` heuristic context.
- **Zero non-Canadian spellings** detected in body copy (with `winterize/winterization` retained as the brand-canonical exception per CLAUDE.md).
- **Zero hardcoded count or rating claims** outside engine-displacement spec context.
- **Zero `over N years` / `N+ years` claims** asserting a Reyco-side experience figure other than the canonical `more than 60 years` phrase.

The bulk-pasted product copy is unusually clean. Either it was pre-scrubbed before paste, or the source content was already UGC-voice baseline.

---

## Pattern observation

Looking across 250 product pages:

1. **The repeating-claim pattern is supplier-scoped, not Reyco-scoped.** The only meaningful flag (R&J 50-year claim) repeats by manufacturer family, not by category template. This means it's bulk-pastable copy that was authored once and reused across the R&J SKU range. One fix, eight rows touched.

2. **The WooCommerce product description field is being used cleanly.** No template-prose leakage (e.g., no `Pick the one for your terrain` from the category template). Product body content and category template content are cleanly separated.

3. **The category-archive template (category-copy-sweep-2026-05-18.md, separate deliverable) is where the hardcoded-count template lives.** The product-page sweep confirms it stays inside the category template and does not bleed into individual product pages.

---

## Bulk-fix recommendation

Given the scope (1 verification + 8 rows touched in the worst case, 0 rows touched if R&J 50-year verifies), the cheapest fix path is:

### Step 1: verify R&J Machine years in business

One source-of-truth check on R&J Machine's founding year. Options:
- Direct: email or call R&J Machine (Casey at Reyco would know, since R&J is a Reyco supplier).
- Indirect: R&J Machine's own website / about page / corporate registration.

### Step 2: fix path conditional on verification result

**If 50 verifies:** no action. Mark this sweep complete.

**If 50 does not verify:** WP-CLI bulk-update across 8 product `post_content` fields. Boss has SSH+WP-CLI access to Reyco via `giowm1155.siteground.biz:18765` (key `~/.ssh/sg-reyco`), which makes this a one-shot bulk operation:

```bash
# Lift pages (4)
wp post update <id> --post_content='<replaced content>' --path=/path/to/wp

# Dock pages (4)
wp post update <id> --post_content='<replaced content>' --path=/path/to/wp
```

Or via `wp search-replace` if the exact string is unique enough to target safely:

```bash
wp search-replace 'building lifts for Ontario lakefronts for 50 years' \
  'building lifts for Ontario lakefronts for decades' \
  --dry-run --path=/path/to/wp

wp search-replace 'After 50 years building docks for Ontario lakefronts' \
  'After decades of building docks for Ontario lakefronts' \
  --dry-run --path=/path/to/wp
```

`--dry-run` first to confirm match count is exactly 4 + 4 = 8 hits before applying live.

**Theme-template patch is not applicable here.** The R&J 50-year claim lives in `post_content`, not in a shared template partial. Theme-side fix would be wrong tool.

**Per-product manual is not needed.** WP-CLI handles 8 rows in one operation.

---

## Banked-rule compliance check (this deliverable)

- Em-dashes: 0 (grep verified at file-save).
- AI-tell phrases (vague-verb cliches, hedging openers, formulaic patterns): 0.
- Negation-tricolon (`No X. No Y. [point].`): 0.
- Canadian English: preserved (`-ise`, `centimetres`); `winterize/winterization` retained as brand-canonical exception for Reyco marine per CLAUDE.md.
- UGC voice: contractions throughout, real second-person where applicable, no agency-speak.
- Future-proof check: no copy proposed here commits to a specific year-count without the verification gate landing first.

---

## Coordination notes

- **Dev:** no theme-side work needed for this sweep. The category-archive template work (separate `category-copy-sweep-2026-05-18.md` deliverable) still stands.
- **Boss/Aiden:** the R&J 50-year verification is the one decision point. Cheapest path is to ask Casey directly.
- **Sales (Casey):** if Casey can confirm R&J Machine's founding year (or current years in business) on the next inbound from R&J, that closes the loop.

---

## Application path

Two routes once R&J's years-in-business verifies:

1. **If 50 confirms:** no action required across any of the 250 pages. Sweep is complete.
2. **If 50 does not confirm:** boss runs the WP-CLI bulk `search-replace` shown above (8 rows touched, one operation, ~30 seconds end-to-end via existing SSH+WP-CLI access).

No further per-product action is needed across the remaining 240 clean pages.
