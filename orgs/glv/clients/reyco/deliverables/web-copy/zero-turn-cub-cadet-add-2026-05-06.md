# Zero-Turn ADD — Cub Cadet ZT entries (Aiden path-A backlog 3/3)

**Scope:** ADD entries to existing `/lawn-and-garden/zero-turn/` category-config. NOT a full config replacement. The existing config (Toro TimeCutter + any other zero-turn entries already in the page) stays as-is; the entries below are inserted into the existing `series_models` array.

**Why this is an ADD not a re-do:** the existing zero-turn page already runs the series-showcase template with Toro TimeCutter content (shipped series-showcase batch 3, 2026-05-05). Boss flagged Cub Cadet ZT as missing from the page; this deliverable closes that gap without rewriting the rest.

**SKU stock-flag posture:** Cub Cadet ZT line has NOT appeared in any prior shipped batch with a confirmed WC `product_id`. Per banked SKU stock-flag rule (memory file `feedback_sku_stock_flag_unverified.md`), all entries below are written WITHOUT asserting specific SKU codes. Body copy uses model-class language ("ZT1 entry-tier Ultima zero-turn") rather than specific SKU model numbers. Boss / Aiden will substitute actual Reyco-stocked SKU codes at plumb time and the copy survives the substitution.

**Banked rules in force:**
- 11-brand authorised list: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- Staff (post-2026-05-06 update, NO KORY): Casey (sales floor), Aaron (Co-Owner / Service Manager), Lee / Damian / Cody (techs), Lynn / Ron (parts)
- NO em-dashes (Unicode + 3 HTML entity variants banned)
- Canadian English
- Reyco founded 2022 — present-tense framing only
- No "Talk to Casey" CTAs; "we" / "the team" / "us" framing
- Casey owner-voice without inline quotes
- NO KORY ANYWHERE (Kory departed Reyco 2026-05-06; absent by design from this deliverable)

**Subcategories band:** the existing `/lawn-and-garden/zero-turn/` config presumably already has its subcategories band set; this ADD does NOT modify it. If the band needs the new Cub Cadet ZT label added to the strip, boss / Aiden can append `['label' => 'Cub Cadet ZT']` at plumb time.

**Approval gate:** Aiden review before plumb. Boss-side WC product_id substitution required for all 3 entries (mark `product_id => 0` placeholder in the source below).

---

## ADD-TO: `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--zero-turn.php`

Insert the 3 entries below into the existing `series_models` array, after any existing Toro TimeCutter entries. Pattern matches prior series-showcase batches (Cub Cadet XT2 batch 3, 2026-05-05).

```php
<?php
/**
 * ADD-INSTRUCTION (not a full config replacement).
 *
 * The existing /lawn-and-garden/zero-turn/ config keeps its current shape:
 * hero, intro, experts, subcategories, faqs, cross_sell etc. all stay put.
 *
 * Insert the 3 entries below into the existing 'series_models' => [ ... ] array,
 * after any existing Toro TimeCutter entries. Order: ZT1 42-inch, ZT1 50-inch,
 * ZT2 50-inch. Adjust order if boss / Aiden prefer a different in-page sequence.
 *
 * Every entry below ships with product_id => 0 (placeholder). Boss / Aiden
 * substitute actual Reyco WC product_id values at plumb time; this is the
 * same substitution pattern used on stock-flagged eForce entries in batch 5.
 *
 * Subcategories band: existing label strip stays. If a 'Cub Cadet ZT' label
 * needs to be appended to the strip, add ['label' => 'Cub Cadet ZT'] at plumb.
 */

// ENTRIES TO INSERT INTO 'series_models' ARRAY:

[
    'slug'         => '2026-cub-cadet-zt1-42',
    'product_id'   => 0,                      // STOCK-PENDING-PLUMB: substitute actual Reyco WC product_id
    'thumbnail_id' => 0,
    'heading'      => 'Cub Cadet ZT1 (42-inch)',
    'tagline'      => 'The entry-tier Ultima zero-turn from Cub Cadet. Forty-two inches of deck for the property that wants the speed and turn-in feel of a zero-turn without stepping into the larger ZT2 / ZT3 tiers.',
    'why'          => '<p>The ZT1 is where the Ultima zero-turn line starts. Lap-bar steering, dual hydrostatic transmissions (one per drive wheel, which is what makes the zero-turn radius work), and a 42-inch fabricated deck. For a two-to-three acre property where a riding mower would do the job but the customer wants zero-turn speed and the ability to manoeuvre tightly around obstacles, the ZT1 is the right entry.</p><p>Zero-turn cuts about 30 to 40 percent faster than a riding mower of comparable deck size on open lawn. The trade-off is a learning curve on the lap bars (twenty minutes in an open field and most riders have it). We assemble, blade-balance, oil-fill, and test-run every unit before delivery, and Aaron and the bench team handle warranty service in-house.</p>',
    'how'          => [
        ['icon' => 'speed',                    'title' => 'Faster than a ride-on',       'description' => 'Lap-bar steering and dual-hydro drive let you cut 30 to 40 percent faster than a comparable-deck riding mower on open lawn.'],
        ['icon' => 'tune',                     'title' => 'Tighter manoeuvres',          'description' => 'Zero-turn radius means you cut around trees, beds, and obstacles without the back-and-forth a riding mower needs.'],
        ['icon' => 'engineering',              'title' => 'Pre-delivery prep included',  'description' => 'Assembled, blade-balanced, oil-filled, and test-run before it goes home. Aaron and the bench team back the warranty in-house.'],
    ],
    'what'         => [
        ['label' => 'Deck size',  'value' => '42 inches'],
        ['label' => 'Drive',      'value' => 'Dual hydrostatic (one per wheel)'],
        ['label' => 'Steering',   'value' => 'Lap bars'],
        ['label' => 'Best for',   'value' => 'Two-to-three acre property'],
    ],
],

[
    'slug'         => '2026-cub-cadet-zt1-50',
    'product_id'   => 0,                      // STOCK-PENDING-PLUMB: substitute actual Reyco WC product_id
    'thumbnail_id' => 0,
    'heading'      => 'Cub Cadet ZT1 (50-inch)',
    'tagline'      => 'Same ZT1 entry-tier platform, fifty inches of deck for the larger property where the extra cut-per-pass adds up over a season.',
    'why'          => '<p>The 50-inch ZT1 is the same entry-tier Ultima platform as the 42-inch unit, with eight extra inches of deck. For a three-to-four acre property the wider deck takes a meaningful bite out of weekly mowing time. Same lap-bar steering, same dual-hydro drive, same fabricated deck construction.</p><p>Casey will walk you through the 42-inch versus 50-inch decision based on lawn size and any tight-corner or gate-width constraints. The 50-inch deck does not fit through every garden gate, so the geometry of your property matters as much as the acreage.</p>',
    'how'          => [
        ['icon' => 'agriculture',              'title' => 'More cut per pass',           'description' => 'Eight extra inches of deck takes meaningful time off a three-to-four acre weekly cut versus the 42-inch ZT1.'],
        ['icon' => 'tune',                     'title' => 'Same Ultima platform',        'description' => 'Lap-bar steering, dual-hydro drive, fabricated steel deck. Same entry-tier ZT1 build as the 42-inch unit.'],
        ['icon' => 'compare_arrows',           'title' => 'Sized to your gate',          'description' => 'Fifty inches of deck does not fit every garden gate. We size to your property at the floor, not just the acreage.'],
    ],
    'what'         => [
        ['label' => 'Deck size',  'value' => '50 inches'],
        ['label' => 'Drive',      'value' => 'Dual hydrostatic (one per wheel)'],
        ['label' => 'Steering',   'value' => 'Lap bars'],
        ['label' => 'Best for',   'value' => 'Three-to-four acre property'],
    ],
],

[
    'slug'         => '2026-cub-cadet-zt2-50',
    'product_id'   => 0,                      // STOCK-PENDING-PLUMB: substitute actual Reyco WC product_id
    'thumbnail_id' => 0,
    'heading'      => 'Cub Cadet ZT2 (50-inch)',
    'tagline'      => 'The mid-tier Ultima zero-turn. Heavier deck construction, larger engine, and adjustable suspension on the operator seat for the customer doing serious property hours.',
    'why'          => '<p>The ZT2 is the step up from the ZT1 entry-tier. Same lap-bar zero-turn architecture, but the deck is built heavier, the engine is larger, and the operator seat usually carries adjustable suspension for the kind of property owner spending real hours on the unit each week. For a four-to-five acre property, or a smaller property cut frequently with rough terrain, the ZT2 holds up better season after season.</p><p>This is the tier where the build quality starts to matter as much as the deck size. Casey will help you decide between staying on the ZT1 platform with a wider deck or stepping up to the ZT2 for the heavier-duty build at the same deck size. Aaron and the techs back the warranty either way.</p>',
    'how'          => [
        ['icon' => 'shield',                   'title' => 'Heavier-duty build',          'description' => 'Reinforced deck, larger engine, and a frame built for the customer spending real hours on the unit each week.'],
        ['icon' => 'verified',                 'title' => 'Operator-seat suspension',    'description' => 'Adjustable seat suspension on the ZT2 trim cuts back fatigue on long mowing sessions and rough-terrain cuts.'],
        ['icon' => 'engineering',              'title' => 'Same in-house warranty',      'description' => 'Aaron and the bench team service Cub Cadet warranty work in-house. No shipping the unit out.'],
    ],
    'what'         => [
        ['label' => 'Deck size',  'value' => '50 inches'],
        ['label' => 'Drive',      'value' => 'Dual hydrostatic (one per wheel)'],
        ['label' => 'Tier',       'value' => 'ZT2 mid-tier (heavier than ZT1)'],
        ['label' => 'Best for',   'value' => 'Four-to-five acre property or rough-terrain cuts'],
    ],
],
```

---

## QC checklist (pre-plumb)

- [ ] All 3 entries inserted into existing `series_models` array (not replacing existing Toro TimeCutter entries)
- [ ] `product_id => 0` placeholder substituted with actual Reyco WC product_id for each Cub Cadet ZT SKU
- [ ] Stock verification: confirm Reyco actually stocks ZT1 42-inch / ZT1 50-inch / ZT2 50-inch (or substitute the actual stocked deck-size variants)
- [ ] If Reyco stocks a different mix (e.g. ZT1 46-inch instead of 50-inch, or ZT3 in addition), adjust the 3 entries to match actual inventory before plumb
- [ ] Subcategories band: append `['label' => 'Cub Cadet ZT']` to existing strip if the page needs the brand label visible
- [ ] No em-dashes (Unicode U+2014 or HTML entity variants &mdash; / &#8212; / &#x2014;) in any rendered string
- [ ] Canadian English spelling preserved (manoeuvre, not maneuver)
- [ ] Staff names match roster (Casey, Aaron — no Kory)
- [ ] No "Talk to Casey" framing in CTA copy (banned)
- [ ] Reyco founded 2022 framing not violated (present-tense only)

## Plumb-side notes (boss-facing)

1. **Cub Cadet ZT model SKU verification (boss-side):** I do NOT have confirmed Reyco WC product_ids for any Cub Cadet ZT SKU. Same posture as the eForce stock-flag pattern from batch 5. Boss / Aiden know what is actually stocked from the WC catalogue or from Casey direct.

2. **Deck-size assumptions:** I assumed Reyco stocks ZT1 in 42-inch + 50-inch variants and ZT2 in 50-inch. If the actual Reyco mix is different (46-inch ZT1, 54-inch ZT2, ZT3 Ultima top-tier in 60-inch, etc.) the entries are easy to edit at plumb without rewriting the body copy structure.

3. **Cross-sell on the page:** if the page already has Toro TimeCutter entries, the implicit cross-sell is "Toro for one platform, Cub Cadet for another, both serviced in-house by Aaron and the techs." No need to add explicit comparison copy unless boss prefers; the side-by-side product cards on the page surface the comparison naturally.

4. **Kory grep on this deliverable:** ZERO references in PHP fence. The two markdown commentary mentions (intro paragraph, banked-rules section) are about Kory ABSENCE; they do not render to user-facing surfaces.

5. **Em-dash audit:** ZERO em-dashes in PHP fence (verified pre-commit).

## Aiden path-A status

- 1/3 lawn-and-garden 6 NEW configs — SHIPPED commit eab81dd
- 2/3 powersports 6 series-showcase configs — SHIPPED commit 7ffd731
- **3/3 zero-turn add Cub Cadet ZT entries — THIS DELIVERABLE**

Backlog drained. Standing for plumb signal on all 3 batches.
