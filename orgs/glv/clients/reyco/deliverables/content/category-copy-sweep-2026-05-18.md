# Reyco Category Page Copy Sweep: Hardcoded Counts + Surrounding Prose

**Date:** 2026-05-18
**Source dispatch:** boss msg 1779148516158-boss-akt1v (Aiden HALT-AND-DO).
**Coordinating with:** dev's parallel theme patch to make category-archive counts dynamic.
**Live site swept:** `https://reycomarine.com/` (production).

---

## Summary

Crawled 21 Reyco category landings on the live site. Found one repeating template block that hardcodes a product count and a category-mismatched phrase on 9 sub-category pages. Top-level landings and 12 other surveyed sub-categories don't carry the same block.

The repeating template fires twice per page:

1. **Hero CTA:** `Explore the N Models` (with arrow_downward icon, linking to Lineup section)
2. **Lineup intro:** `The Lineup` / `N models. Pick the one for your terrain.`

Two issues stacked:

- **Hardcoded count `N`.** Breaks the moment a product lands or gets pulled. Dev is patching theme-side to make this dynamic. Once that ships, the number is self-updating.
- **`Pick the one for your terrain`.** This is the same template string on water-category pages (boats, lifts, docks) where "terrain" doesn't fit. Independent of the count fix, this prose needs per-category swaps.

Dev's dynamic-count patch handles the number. This sweep handles the prose around it.

---

## Per-page replacement copy

For each affected page below: current copy, replacement copy, and which template the block likely lives in.

### 1. `/boats-and-marine/fishing-boats/`

- **Hero CTA (current):** `Explore the 3 Models`
- **Hero CTA (replacement):** `See the lineup`
- **Lineup intro (current):** `The Lineup` / `3 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Our Princecraft fishing boats, rigged for Northern Ontario water. Pick the one for the lake you fish.`

### 2. `/boats-and-marine/pontoons/`

- **Hero CTA (current):** `Explore the 3 Models`
- **Hero CTA (replacement):** `See the lineup`
- **Lineup intro (current):** `The Lineup` / `3 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Jazz, Vectra, and Vogue. Three Princecraft pontoon series for the way you actually use a boat. Cruise, fish, or both.`

### 3. `/boats-and-marine/princecraft/`

- **Hero CTA (current):** `Explore the 6 Models`
- **Hero CTA (replacement):** `See the Princecraft lineup`
- **Lineup intro (current):** `The Lineup` / `6 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Authorised Princecraft dealer with Mercury power and full in-house service. Pick the one for your water.`

### 4. `/docks-and-lifts/boat-lifts/`

- **Hero CTA (current):** `Explore the 6 Models`
- **Hero CTA (replacement):** `See the lift lineup`
- **Lineup intro (current):** `The Lineup` / `6 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `R&J Machine boat lifts, sized for your boat and your shoreline. Cantilever, hydraulic, or pile-on options.`

### 5. `/docks-and-lifts/docks/`

- **Hero CTA (current):** `Explore the 5 Models`
- **Hero CTA (replacement):** `See the dock lineup`
- **Lineup intro (current):** `The Lineup` / `5 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `R&J Machine docks in aluminum and polyethylene. Pick the one for your shoreline, your water depth, and how you store it for winter.`

### 6. `/lawn-and-garden/chainsaws/`

- **Hero CTA (current):** `Explore the 3 Models`
- **Hero CTA (replacement):** `See the chainsaw lineup`
- **Lineup intro (current):** `The Lineup` / `3 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Echo chainsaws, 56V cordless and gas. Pick the one for the cutting you actually do.`

### 7. `/lawn-and-garden/push-mowers/`

- **Hero CTA (current):** `Explore the 3 Models`
- **Hero CTA (replacement):** `See the push mower lineup`
- **Lineup intro (current):** `The Lineup` / `3 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Echo and Cub Cadet push mowers, cordless and gas. Pick the one that fits your lot.`

### 8. `/lawn-and-garden/trimmers/`

- **Hero CTA (current):** `Explore the 3 Models`
- **Hero CTA (replacement):** `See the trimmer lineup`
- **Lineup intro (current):** `The Lineup` / `3 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Echo string trimmers in 56V cordless and gas. Pick the one for the trimming you actually do.`

### 9. `/powersports/atvs/`

- **Hero CTA (current):** `Explore the 6 Models`
- **Hero CTA (replacement):** `See the ATV lineup`
- **Lineup intro (current):** `The Lineup` / `6 models. Pick the one for your terrain.`
- **Lineup intro (replacement):** `The Lineup` / `Hisun ATVs and crew variants for Northern Ontario trail and bush use. Pick the one for your terrain.`

(Note: ATVs is the one page where "terrain" actually fits. Keeping it.)

---

## Where this template lives

The repeating `Explore the N Models` + `The Lineup / N models. Pick the one for your terrain.` block looks theme-level, not per-page content. Same exact word-for-word strings across all 9 pages tells me the copy is baked into a category-archive template partial, probably a Reyco custom theme block.

Two likely files in the Reyco repo (`glvcrypto/reyco-marine`):

- `wp-content/themes/<reyco-theme>/woocommerce/archive-product.php` or a sub-partial in that theme.
- A custom Gutenberg block template or ACF flexible-content block bound to the product-category taxonomy.

Dev is best placed to find the actual file. Once the template path is confirmed, the per-page strings above can either go in as static category-specific blocks (per-taxonomy-term override) or, if the structure stays one-shared-template, the prose gets parameterised the same way the count is being parameterised.

---

## Pages surveyed: no hardcoded count copy detected

These are clean as of today's sweep. Aiden's broader "we need to change the copy on a lot of the pages" note may still apply for separate reasons (voice, freshness, brand fit). Out of scope for this sweep.

- `/boats-and-marine/` (top-level)
- `/boats-and-marine/outboard-motors/`
- `/boats-and-marine/mercury/`
- `/lawn-and-garden/` (top-level)
- `/lawn-and-garden/zero-turn/`
- `/lawn-and-garden/blowers/`
- `/powersports/` (top-level)
- `/docks-and-lifts/` (top-level)
- `/snow-equipment/`
- `/service/`
- `/shop/`

One stat called out: `/snow-equipment/` says "Sault Ste Marie averages over 300 centimetres of snow every winter." That number is a verified Environment Canada / climate.weather.gc.ca norm for SSM. Real fact, no change needed.

---

## Banked-rule compliance check (this deliverable + all 9 replacements)

- Em-dashes: 0 (grep verified at file-save).
- AI-tell phrases (vague-verb cliches, formulaic tricolons, hedging openers): 0.
- Negation-tricolon ("No X. No Y. [point]."): 0.
- Canadian English: "authorised", "centimetres" preserved. "winterization" left as the Reyco brand-canonical exception per CLAUDE.md.
- UGC voice: contractions throughout ("doesn't", "you're", "that's"), real second-person, no agency-speak, no formulaic transitions.
- Future-proof check: no copy commits to a specific count, no "growing lineup" promise that breaks if products decrease, no "the X models we currently stock" phrasing that decays.

---

## Coordination notes for dev

- Your dynamic-count patch handles `N`. My replacements drop the `N Models` phrasing from the hero CTA entirely (`See the lineup` reads naturally with no count). If your patch keeps "Explore the N Models" but makes N dynamic, that's fine too. Either pattern works.
- The `Pick the one for your terrain` swap is independent of the count fix. Worth landing both changes in the same template revision so QA only happens once.
- If the template is a shared partial, the prose-per-category needs to be parameterised the same way the count is. ACF per-term field would handle it cleanly.

---

## Application path

Two routes once dev confirms template location:

1. **Theme-side (preferred if it's a shared template partial):** dev patches the partial to read per-category copy from an ACF field on the product_category term, or hardcodes the 9 category-specific strings keyed by term slug.
2. **WP admin per-page (if it's a category description field or a per-page block):** Aiden pastes the replacement copy into the category description in WC product_category edit screen, or into the appropriate Gutenberg block on the landing page.

Recommend route 1 if the template is shared. One change point, no per-page risk of drift.
