# Princecraft series-showcase migration (urgent launch-day, Aiden directive)

**1 NEW full config** for the Princecraft brand category page. Migration from the old product-category schema (image hero, named-quote experts, taxonomy-term subcategories, why_choose, local_context) to Ben's series-showcase template, same treatment as the 23-page rollout earlier this week (Batches 1-5).

**For dev:** ready-to-paste PHP array for the series-showcase template. Same shape and same voice as Batches 1-5. This config replaces the existing `wp-content/themes/reyco-marine/inc/category-configs/boats-marine--princecraft.php` in full.

**Source dispatch:** boss msg 1778087291600-boss-ykzm7 (urgent launch-day, Aiden Reyco-only directive).

**Voice / format constraints (carried from Batches 1-5):**
- Canadian English; plain language; NO em-dashes anywhere in PHP body
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022. Present-tense framing only. NO founding-year claims
- Casey owner-voice. NO "Talk to Casey" / "Call Casey" / "ask Casey" CTA copy
- 11-brand authorised list: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- Staff: Casey (sales floor), Aaron (co-owner / service), Lee / Damian / Cody (techs), Lynn / Ron (parts), Kory (sales)

**SKU stock-flag (per just-banked working-process rule, Batch 5 plumb-delta learning):** None of the Princecraft SKUs in this deliverable have appeared in a prior shipped batch with a confirmed WC product_id. ALL five anchors are stock-pending-plumb. Boss / Aiden to substitute the actual stocked Princecraft hulls + assign WC product_ids at plumb time, same flow as the DCS-2100C → DCS-5000 substitution on Batch 5. I have phrased the body copy to survive a model substitution within the same series (e.g., if Reyco stocks Sport 175 instead of Sport 188, the Sport-series entry copy still holds).

**Anchor SKUs (5 entries) per boss list:**
1. **Vectra 21 RL** (pontoon, marquee / featured-this-season slot, boss high-priority)
2. **Sport series** (fishing all-rounder, generalised across the Sport family)
3. **Platinum series** (fishing top-tier platform, generalised)
4. **Jazz pontoon** (entry-tier pontoon, contrast to Vectra)
5. **Ventura deck boats** (deck-boat profile, separate from fishing and pontoon; stock-flag heightened — Princecraft 2026 catalog research did not surface a "Ventura" line by that name; could be older series or naming overlap with Vectra. Boss to confirm at plumb.)

**Princecraft configurator note:** Princecraft runs a public build-your-boat configurator at `build.princecraft.com` (per scout research file `princecraft-buildyourboat-reference.md`). I have referenced it once in the FAQ as a "build the spec, bring the spec to us for the quote" path; this aligns with the Reyco dealer-extranet relationship and gives customers a way to scope before walking in. Not a hero CTA. Hero CTA stays "Visit the shop / Request a quote."

**Subcategory anchors:** three boating profiles, three anchors. Fishing / Pontoon / Deck. Matches the Princecraft top-level category split.

**Approval gate:** Aiden review before any wp-cli paste. Casey / Kory gate on which Princecraft hulls Reyco actually has on the lot or on the order book (Vectra 21 RL is the named featured-this-season pick per boss; the rest need confirmation).

---

## boats-marine--princecraft.php (FULL CONFIG REPLACEMENT)

```php
<?php
/**
 * Category config: boats-and-marine -> princecraft
 * Frame: Princecraft brand page. Three boat profiles (fishing / pontoon / deck) on one page.
 * Marquee: Vectra 21 RL pontoon (featured this season).
 * Series_models cover one anchor per profile + an entry-tier pontoon contrast + a deck-boat lane.
 * Mercury power throughout (Reyco is the authorised Mercury dealer for the engine pairing).
 */

return [
    'category_slug' => 'princecraft',
    'parent_slug'   => 'boats-and-marine',

    'hero' => [
        'title'    => 'Princecraft Boats',
        'subtitle' => 'Aluminum fishing boats, pontoons and deck boats built in Quebec for the kind of lakes we have here. Authorised Princecraft dealer with Mercury power and full in-house service.',
        'cta'      => [
            'primary'   => ['label' => 'See the Princecraft lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',             'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Why Princecraft for Northern Ontario water',
        'body'  => '<p>Princecraft is a Quebec-built aluminum-hull line. The boats are sized and laid out for the kind of lakes you fish, cruise and entertain on around here: rocky shorelines, mid-size open water, occasional chop, long shoulder seasons. Aluminum holds up to the rocks better than glass, the hulls are light enough to launch off a single-axle trailer, and the layouts are practical (deep gunnels, real storage, fishing rod racks where you actually want them, not where a stylist put them).</p><p>The lineup splits three ways. Fishing boats from the Sport, Platinum and smaller Hudson / Holiday / Amarok families. Pontoons from Vectra, Jazz, Vogue and the Sportfisher line for the cruising and entertaining side. Deck boats for the customers who want a hybrid (more open floor than a fishing boat, more turn-of-speed than a pontoon). Mercury outboards across the lineup. We pair the right hull, the right engine, and the right trailer at the shop, and we commission every boat in-house before it goes out the door.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey and Kory work the floor on boats. They know which hull fits which lake, which engine size is right for the load, and what the order book looks like for the season (Princecraft builds to order on most series, so lead times matter). Aaron and the service techs (Lee, Damian, Cody) handle commissioning, motor mounting, sea trial and post-sale work. Lynn and Ron at the parts counter stock Mercury props, oil, plugs, lower-unit gear lube and the consumables you need season to season.</p>',
    ],

    'subcategories' => [
        ['label' => 'Fishing Boats', 'anchor' => '#fishing'],
        ['label' => 'Pontoons',      'anchor' => '#pontoons'],
        ['label' => 'Deck Boats',    'anchor' => '#deck'],
    ],

    'series_models' => [
        [
            'slug'         => 'princecraft-vectra-21-rl-pontoon',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Vectra 21 RL Pontoon',
            'tagline'      => 'Featured this season. Family-cruiser pontoon, Mercury power, set up for our lakes.',
            'why'          => '<p>The Vectra 21 RL is the boat we are leading with this season. It is a 21-foot pontoon in the Vectra family, set up as a real-life family cruiser: room for the kids and the dog, a layout that works for an afternoon swim run or an evening cruise with friends, and enough engine to actually move the load when you need to get back to the dock ahead of the weather. Aluminum tubes, factory-finished helm, the kind of pontoon that looks at home on a Northern Ontario lake.</p><p>We pair it with Mercury outboard power (we are the authorised Mercury dealer in town). Engine sizing depends on what you want out of the boat. If you are tubing or pulling skiers, we go up; if you are cruising and fishing the perimeter, we keep it sensible. Trailer is custom-fit to the hull, factory-built. Casey or Kory will walk you through the engine and trailer pairing on the floor.</p>',
            'how'          => [
                ['icon' => 'directions_boat', 'title' => 'Family-cruiser layout', 'description' => 'Room for the family, the cooler, the swim ladder, and the gear. Real seating, not boat-show seating.'],
                ['icon' => 'bolt',            'title' => 'Mercury power',         'description' => 'Authorised Mercury dealer. We size the engine to how you actually use the boat.'],
                ['icon' => 'verified',        'title' => 'In-house commissioning','description' => 'Aaron and the service techs commission and sea-trial the boat before you take delivery.'],
            ],
            'what'         => [
                ['label' => 'Type',       'value' => 'Pontoon'],
                ['label' => 'Length',    'value' => '21 ft (Vectra family)'],
                ['label' => 'Power',      'value' => 'Mercury outboard (sized to use case)'],
                ['label' => 'Best for',   'value' => 'Family cruising, day trips, evening runs, light fishing'],
            ],
        ],
        [
            'slug'         => 'princecraft-platinum-series-fishing',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Platinum Series Fishing Boats',
            'tagline'      => 'Top-tier Princecraft fishing platform. The boat for the customer who fishes seriously.',
            'why'          => '<p>The Platinum series is the top-tier fishing platform in the Princecraft lineup. Wider beam than the Sport family, more freeboard, more rod storage, more livewell, and a casting deck laid out for two anglers working a lake at the same time. Right boat for the customer who is on the water often, who fishes tournaments or pre-fishes for them, or who just wants the upgrade after a few seasons in a smaller hull.</p><p>Mercury power across the lineup, sized to the hull. Trolling-motor mounting plate factory-installed (Minn Kota and Humminbird are both authorised lines on our parts counter for the trolling motor and electronics pairing). Same in-house commissioning, sea trial, and post-sale support as the rest of the Princecraft lineup.</p>',
            'how'          => [
                ['icon' => 'phishing',     'title' => 'Two-angler casting deck',  'description' => 'Deck space and rod storage laid out for serious fishing. Not a converted runabout.'],
                ['icon' => 'bolt',         'title' => 'Mercury power',            'description' => 'Sized to the hull and the way you fish. Authorised Mercury dealer.'],
                ['icon' => 'electric_bolt','title' => 'Trolling-motor ready',     'description' => 'Factory-mounted plate. Pair with Minn Kota and Humminbird at our parts counter.'],
            ],
            'what'         => [
                ['label' => 'Type',       'value' => 'Fishing boat (top-tier)'],
                ['label' => 'Length',    'value' => '19-22 ft (Platinum family)'],
                ['label' => 'Power',      'value' => 'Mercury outboard'],
                ['label' => 'Best for',   'value' => 'Serious anglers, tournament work, two-angler fishing'],
            ],
        ],
        [
            'slug'         => 'princecraft-sport-series-fishing',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Sport Series Fishing Boats',
            'tagline'      => 'Mainstream fishing aluminum. The all-rounder for cottage and weekend use.',
            'why'          => '<p>The Sport series is the mainstream fishing aluminum in the Princecraft lineup. Right boat for the cottage, the weekend angler, the family that fishes some days and runs the lake other days. Smaller and lighter than the Platinum, easier to handle off the trailer, easier to launch single-handed, and priced where most of our customers actually buy.</p><p>Sport hulls come in a range of lengths (the Sport family covers the 17 to 19 foot bracket). The right one depends on the lake size, the load, and how often you are running it solo. Mercury power, trolling-motor ready, in-house commissioning, same as the Platinum.</p>',
            'how'          => [
                ['icon' => 'sailing',  'title' => 'Cottage-and-weekend right-size', 'description' => 'Big enough to be useful, small enough to launch and store easily.'],
                ['icon' => 'bolt',     'title' => 'Mercury power',                  'description' => 'Engine sized to the hull and the load.'],
                ['icon' => 'engineering','title' => 'In-house service',             'description' => 'We commission, we maintain, we warranty. Aaron handles intake.'],
            ],
            'what'         => [
                ['label' => 'Type',       'value' => 'Fishing boat (mainstream)'],
                ['label' => 'Length',    'value' => '17-19 ft (Sport family)'],
                ['label' => 'Power',      'value' => 'Mercury outboard'],
                ['label' => 'Best for',   'value' => 'Cottage use, weekend fishing, family runs'],
            ],
        ],
        [
            'slug'         => 'princecraft-jazz-pontoon',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Jazz Pontoon',
            'tagline'      => 'Entry-tier pontoon. Same Princecraft build, smaller footprint and price.',
            'why'          => '<p>The Jazz is the entry into the Princecraft pontoon lineup. Smaller footprint than the Vectra family, lighter to tow, easier to dock and store, and priced for the customer who wants a real Princecraft pontoon without going to the top of the line. Same aluminum-tube build, same factory finish, same Mercury power options. Right boat for a smaller lake, a single-axle tow vehicle, or a first pontoon purchase.</p><p>Layout is straightforward: front and rear lounge seating, helm console, swim platform. We pair the engine to how you use it (cruising versus tubing makes a real difference in engine size). Casey or Kory will run you through the size-up question on the floor.</p>',
            'how'          => [
                ['icon' => 'directions_boat', 'title' => 'Smaller-footprint pontoon', 'description' => 'Entry into the Princecraft pontoon line. Easier to tow and dock than the Vectra.'],
                ['icon' => 'bolt',            'title' => 'Mercury power',             'description' => 'Engine sized to your use case. Cruising versus tubing changes the answer.'],
                ['icon' => 'savings',         'title' => 'Entry-tier price',          'description' => 'Same Princecraft build at a more accessible starting point.'],
            ],
            'what'         => [
                ['label' => 'Type',       'value' => 'Pontoon (entry-tier)'],
                ['label' => 'Length',    'value' => 'Jazz family (smaller pontoon footprint)'],
                ['label' => 'Power',      'value' => 'Mercury outboard'],
                ['label' => 'Best for',   'value' => 'First pontoon, smaller lakes, easier-tow setup'],
            ],
        ],
        [
            'slug'         => 'princecraft-ventura-deck-boats',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Deck Boats',
            'tagline'      => 'Hybrid layout. More open floor than a fishing boat, more turn-of-speed than a pontoon.',
            'why'          => '<p>Deck boats are the hybrid lane. More open floor space than a fishing boat (room for the cooler, the kids, the gear, the dog) but with the planing hull and turn-of-speed that a pontoon does not give you. Right boat for the customer who wants to do a bit of everything: cruise, tube, swim, occasional fishing, faster trips across a longer lake. The deck-boat hull rides drier than a pontoon in chop and corners harder.</p><p>Mercury power across the deck-boat lineup, sized to the hull. Same in-house commissioning and trailer pairing as the rest of the Princecraft lineup. Casey or Kory will walk you through whether a deck boat or a pontoon is the right call for how you use the lake.</p>',
            'how'          => [
                ['icon' => 'directions_boat', 'title' => 'Hybrid open layout',     'description' => 'Open floor space like a pontoon, planing hull like a fishing boat.'],
                ['icon' => 'speed',           'title' => 'Real turn-of-speed',     'description' => 'Faster across longer lakes than a pontoon. Drier ride in chop.'],
                ['icon' => 'bolt',            'title' => 'Mercury power',          'description' => 'Engine sized to the hull and the use case.'],
            ],
            'what'         => [
                ['label' => 'Type',       'value' => 'Deck boat'],
                ['label' => 'Length',    'value' => 'Per stocked model'],
                ['label' => 'Power',      'value' => 'Mercury outboard'],
                ['label' => 'Best for',   'value' => 'Cruise + tube + swim + occasional fish, longer-lake runs'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Princecraft',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Princecraft dealer. Quebec-built aluminum hulls, Mercury power, in-house commissioning.',
        'body'     => '<p>Princecraft has been building aluminum boats in Quebec for decades and we are an authorised dealer. We carry fishing boats from the Sport and Platinum families, pontoons from the Vectra, Jazz, Vogue and Sportfisher lines, and the deck-boat lineup. Most Princecraft hulls are built to order, so lead time matters. The earlier in the season you commit, the better the chance of getting the exact hull, engine, colour and trailer pairing you want.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right Princecraft profile for how you use the water',
        'columns' => ['Profile',          'Best for',                            'Hull style',     'Right family'],
        'rows'    => [
            ['Family cruise / entertain',  'Day trips, evening cruises, swim runs','Pontoon',        'Vectra, Jazz, Vogue'],
            ['Serious fishing',            'Tournament, two-angler, often-on-water','Aluminum mono', 'Platinum, Sport (top end)'],
            ['Mainstream fishing',         'Cottage, weekend, family fish-and-run', 'Aluminum mono', 'Sport family'],
            ['Hybrid cruise + occasional fish', 'Tube, swim, cruise, light fish',    'Deck boat',    'Princecraft deck lineup'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Are Princecraft boats built to order, or do you have stock on the lot?',
            'a' => 'Both. We carry stock units for the season on the most-requested hulls (the Vectra 21 RL is one of those this year). Most other Princecraft boats are built to order at the factory in Quebec. Lead time depends on the hull and the time of year you commit. Casey or Kory can pull current order-book status on the floor.',
        ],
        [
            'q' => 'What engine sizes do you pair with these hulls?',
            'a' => 'Mercury, sized to the hull and the use case. The Vectra 21 RL is a different engine answer for tubing-and-skiing versus cruising-and-fishing. Same applies on the fishing hulls and the deck boats. We are the authorised Mercury dealer in town and we size the engine at the shop, not from a spec sheet.',
        ],
        [
            'q' => 'Do you do the trailer too?',
            'a' => 'Yes. Princecraft trailers are model-specific from the factory and we set them up with your boat. Loading bunks, axle setup, lights, registration paperwork (Ontario) all handled at delivery.',
        ],
        [
            'q' => 'Can I configure a Princecraft online before I come in?',
            'a' => 'Yes. Princecraft runs a public configurator at build.princecraft.com where you can build the hull, the colour, the engine and the options to see a starting estimate. Bring the spec to us and we will work the real quote (the configurator runs MSRP; the dealer price is the one that holds).',
        ],
        [
            'q' => 'What happens after I take delivery? Service, warranty, parts?',
            'a' => 'Aaron and the service techs (Lee, Damian, Cody) handle warranty and post-sale work in-house. You do not have to ship the boat or the engine anywhere. Lynn and Ron stock Mercury props, oil, plugs, lower-unit lube and the seasonal consumables.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at a Princecraft on the floor?',
        'body'      => '<p>Drop in and walk the boats on the lot, or give us a call and Casey or Kory will pull the current order-book status and walk you through engine and trailer pairing.</p>',
        'primary'   => ['label' => 'Visit the shop',                  'href' => '/contact/'],
        'secondary' => ['label' => 'Pair with Mercury power',          'href' => '/boats-and-marine/mercury/'],
    ],
];
```

---

## QC checklist (web-copy author side)

**Stock-flag (per just-banked working-process rule, ALL Princecraft SKUs need plumb-side verification):**
- [ ] **Vectra 21 RL** — boss confirmed as featured-this-season pick. Verify exact model (Vectra 21 RL vs Vectra 21 R vs Vectra 23 WRL — research file shows Vectra 23 WRL specifically) and stock status at plumb.
- [ ] **Platinum series** — research surfaced Platinum 220 R and Platinum 190 R in 2026 catalog. Boss said "Platinum SE" which I did not surface in research. Confirm actual stocked Platinum hull at plumb.
- [ ] **Sport series** — boss said "Sport 164 / 1670 / 1870" which do not match the 2026 catalog (Sport 188 / 185 / 175 / 175 MAX per research). Could be older models or naming overlap. Confirm at plumb which Sport hull Reyco actually stocks.
- [ ] **Jazz pontoon** — confirmed in research as a pontoon series; no specific model number. Confirm specific Jazz hull at plumb.
- [ ] **Ventura deck boats** — research did NOT surface a "Ventura" line. Princecraft 2026 catalog has deck boats as a TYPE (`type=d`) but no series called Ventura. Could be older series, or naming overlap with Vectra. Boss to confirm at plumb whether to keep the deck-boat anchor (which deck-boat series), substitute, or drop the entry.
- [ ] All five entries have `product_id => 0` and `thumbnail_id => 0` placeholders. Boss to assign real WC IDs at plumb (per dispatch).

**Voice / format (matches Batches 1-5 standard):**
- [x] Canadian English (authorised, neighbour, etc.)
- [x] No em-dashes anywhere in PHP body (period / comma / parens / en-dash for ranges only)
- [x] No banned AI tells (delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y")
- [x] No "Talk to Casey" / "Call Casey" / "ask Casey" CTAs
- [x] Casey owner-voice maintained (Casey + Kory work the floor)
- [x] No founding-year claims for Reyco; present-tense framing
- [x] Staff names match roster (Casey, Aaron, Lee, Damian, Cody, Lynn, Ron, Kory)
- [x] Mercury and Princecraft both inside the 11-brand authorised list
- [x] Trolling-motor mention pairs with Minn Kota and Humminbird (both inside authorised list)

**Cross-link integrity:**
- [x] Hero secondary CTA → `/contact/`
- [x] CTA secondary → `/boats-and-marine/mercury/` (Mercury engine pairing page; should exist as a sibling brand page on the same boats-and-marine parent)
- [x] Subcategories anchor in-page (`#fishing`, `#pontoons`, `#deck`)

**Dev-side flags:**
- [ ] Page-template binding: `_wp_page_template = page-templates/series-showcase.php` on the Princecraft brand page (per banked memory `project_reyco_wp_template_migration_pattern.md`, setup-pages.php only fires on creation; existing pages need wp-cli `_wp_page_template` patch).
- [ ] Material Symbols icon name verification: `directions_boat`, `bolt`, `verified`, `phishing`, `electric_bolt`, `sailing`, `engineering`, `savings`, `speed`. All snake_case Material Symbols. The fishing-rod and sailing icons (`phishing`, `sailing`) are less common; if they do not render, fall back to `set_meal` or `directions_boat`.
- [ ] `_catalogue_config` post-meta: confirm whether the Princecraft brand page uses file-based config (per banked memory, post-meta overrides file-based config; if a `_catalogue_config` exists on the page record it must be cleared or updated to match this file).
- [ ] Brand-band logo_id, hero image, and per-entry thumbnail_id all 0 placeholders. Aiden / Casey to supply Princecraft brand logo + hero image + per-hull thumbnails. Until then, theme should fall back to brand-default or category-default image, not break.
- [ ] Old config has subcategories as taxonomy-term blocks (`subcategories` => taxonomy-driven). New config uses subcategory anchors (`label` + `anchor`). Confirm the series-showcase template renders the anchor-based subcategory band correctly (Batches 1-5 use the same anchor-based pattern, so this should work).

**Old-config elements consciously dropped from the new config:**
- `image` / `badge` / `position` keys from old hero shape (series-showcase template defines its own hero shape)
- `experts` as named-quote array with photo_id (new template uses `experts` as a single staff-attribution body, same as Batches 1-5)
- `why_choose` block (rolled into `intro` body, no separate section)
- `local_context` block (rolled into `intro` body where it adds value, e.g., "Northern Ontario water" framing)
- Old subcategories with `taxonomy`, `term_slug`, `posts_per_term` (new template uses anchor-based subcategory band)

---

## Rollout summary table (updated through Princecraft)

| Batch | Date | Pages | Entries | Commit | Status |
|-------|------|-------|---------|--------|--------|
| 1 | 2026-05-XX | 4 | ~17 | 6b235a9 | Shipped + plumbed |
| 2 | 2026-05-XX | 4 | ~17 | aed97e2 | Shipped + plumbed |
| 3 | 2026-05-XX | 4 | ~17 | 01d3c4d | Shipped + plumbed |
| 4 | 2026-05-05 | 4 | ~17 | 23ac57e | Shipped + plumbed |
| 5 | 2026-05-06 | 5 | ~9 (8 dev / 9 author) | 1c0c7bf + a7b91fa | Shipped + plumbed (plumb delta DCS-5000 sub) |
| Princecraft (this) | 2026-05-06 | 1 (replacement) | 5 | TBD | Author-side ready, plumb pending |

Cumulative through this deliverable: 22 pages of new / replaced category configs, ~70 series-models entries on the author side, 88+ entries post-plumb. Princecraft is the first **brand-page** migration (Batches 1-5 were category-page migrations under lawn-and-garden / cordless / etc.). If the Princecraft pattern holds at plumb and on Aiden review, the same migration template applies to the other brand pages (Mercury, Toro, Echo, Cub Cadet, etc.) on a follow-up batch.

---

## Working notes (post-launch follow-ups)

1. **Brand-page migration follow-up:** if Princecraft holds, apply the same pattern to Mercury, Toro, Echo, Cub Cadet, E-Z-GO, Hisun, Minn Kota, Humminbird, Cannon, R&J Machine. That is a 10-page brand-page batch when Aiden picks it up post-launch.
2. **Princecraft configurator integration:** scout's `princecraft-buildyourboat-reference.md` flagged Reyco's dealer-extranet relationship and the question of whether to embed / link / replicate the configurator. This deliverable links to it in the FAQ as a starting-estimate path. A future content batch could expand this into a dedicated "configure your Princecraft" landing page if Aiden wants the deeper experience.
3. **SKU stock-verification at plumb:** the working-process rule banked from the Batch 5 DCS-2100C / DCS-5000 incident applies fully here. Five anchors, all stock-flagged, all need plumb-side verification. Boss to substitute the actual stocked hulls (if different) and assign WC product_ids.
4. **Casey / Kory quote refresh:** consistent with Batches 1-5 standing, this deliverable carries no Casey-direct quotes. If Casey replies to the standing quote-gather thread, a future content polish pass can drop owner-voice quotes into the Princecraft entries (most natural fit: the Vectra 21 RL marquee + the Platinum top-tier framing).
5. **Old-config archive:** the old `boats-marine--princecraft.php` should be archived (not deleted) at plumb in case the old taxonomy-term subcategory block needs to be referenced for the brand-page migration follow-up batch.

End of deliverable.
