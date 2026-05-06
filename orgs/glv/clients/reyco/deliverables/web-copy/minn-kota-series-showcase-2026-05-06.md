# Minn Kota series-showcase migration (urgent launch-day, Aiden directive)

**1 NEW full config** for the Minn Kota brand category page. Migration from the old product-category schema (`brand-page-minn-kota.md` Format A Mercury-mirror) to Ben's series-showcase template, same treatment as the Princecraft brand page shipped earlier today and the 23-page rollout earlier this week (Batches 1-5).

**For dev:** ready-to-paste PHP array for the series-showcase template. Same shape and same voice as Batches 1-5 + Princecraft. This config replaces the existing `wp-content/themes/reyco-marine/inc/category-configs/boats-marine--minn-kota.php` in full.

**Source dispatch:** boss msg 1778090001044-boss-tgd8w (urgent launch-day, Aiden Reyco-only directive). Plan-ACK and stock-flag-every-SKU reinforcement in 1778090043782-boss-zw8lb (boss flagged PR #192 today fixed em-dash entity gap on theme PHP, so the entity audit on this deliverable is real, not paranoid).

**Voice / format constraints (carried from Batches 1-5 + Princecraft):**
- Canadian English; plain language; NO em-dashes anywhere in PHP body. Both Unicode (U+2014) AND HTML entities (`&mdash;` / `&#8212;` / `&#x2014;`) checked.
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022. Present-tense framing only. NO founding-year claims, no Reyco-tenure claims.
- Casey owner-voice. NO "Talk to Casey" / "Call Casey" / "ask Casey" CTA copy. NO inline Casey quotes (gated until Casey-reply lands on standing thread).
- 11-brand authorised list: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- Staff: Casey (sales floor), Aaron (co-owner / service), Lee / Damian / Cody (techs), Lynn / Ron (parts), Kory (sales). Lee specifically runs the marine bench (per old Format A deliverable, ground truth confirmed by user history).

**SKU stock-flag (per just-banked working-process rule, Batch 5 + Princecraft pattern):**
- **VERIFIED** (per boss dispatch): Minn Kota Terrova 80 lb Trolling Motor, WC product_id 207, 2026 model. Specs assertable in body copy.
- **STOCK-FLAGGED** (all other anchors): Ulterra, Ultrex QUEST CHIRP, Endura, Precision On-Board Charger family. Boss to substitute / drop / assign WC IDs at plumb via WP-CLI live inventory query.

**Anchor SKUs (5 entries):**
1. **Terrova 80 lb Bow-Mount Trolling Motor** (id 207 verified, marquee — only entry with assertable specs)
2. **Ulterra Auto-Stow Bow-Mount Trolling Motor** (premium tier, auto-deploy + auto-stow)
3. **Ultrex QUEST Bow-Mount with Built-In Sonar** (tournament-tier, integrated CHIRP)
4. **Endura Transom-Mount Trolling Motor** (entry tier, transom-mount lane)
5. **Precision On-Board Chargers** (accessory ecosystem, 2/3/4-bank charger family)

**Subcategory anchors:** three lanes covering the Minn Kota lineup as Reyco actually sells it. Bow-mount / Transom-mount / Chargers + Accessories. Riptide saltwater line is NOT included (wrong market for Northern Ontario freshwater customer base).

**Cross-link integrity:**
- Princecraft (hull pairing) → `/boats-and-marine/princecraft/` (just shipped, sibling brand page)
- Humminbird (i-Pilot Link / sister brand integration) → `/boats-and-marine/humminbird/` (will need a sibling brand-page migration on the same pattern; for now link points to whatever the current page is)
- Service department reference → `/service/marine/` (winterisation, install, warranty)

**Approval gate:** Aiden review before any wp-cli paste. Boss WP-CLI live-inventory verification on the 4 stock-flagged anchors.

---

## boats-marine--minn-kota.php (FULL CONFIG REPLACEMENT)

```php
<?php
/**
 * Category config: boats-and-marine -> minn-kota
 * Frame: Minn Kota brand page. Trolling motors and on-board chargers, three lanes.
 * Marquee: Terrova 80 lb (WC product_id 207, verified-stocked 2026 model).
 * Series_models cover the bow-mount tier ladder + transom-mount lane + the charger ecosystem.
 * Cross-link: Princecraft hull pairing + Humminbird sister-brand sonar integration.
 */

return [
    'category_slug' => 'minn-kota',
    'parent_slug'   => 'boats-and-marine',

    'hero' => [
        'title'    => 'Minn Kota Trolling Motors',
        'subtitle' => 'Bow-mount and transom-mount trolling motors, sonar-integrated bow-mounts, and on-board chargers. Authorised Minn Kota dealer with full in-house rigging, install and warranty.',
        'cta'      => [
            'primary'   => ['label' => 'See the Minn Kota lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',           'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Why Minn Kota for Northern Ontario fishing',
        'body'  => '<p>Trolling motors are the difference between a fish on the line and a quiet drift. Walleye on the St. Marys River, smallmouth in the back-bay weed beds, lake trout off the Goulais Bay structure: none of them tolerate noise. Minn Kota is the platform that runs quiet, holds position, and lasts season after season on the kind of water we have here. Cold spring runs, mineral-rich weed beds, ten-hour Lake Superior days. The motors are sealed for it, the wiring is protected for it, and the warranty support is a real conversation, not a phone tree.</p><p>The lineup splits three ways. Bow-mount trolling motors (Terrova, Ulterra, Ultrex QUEST) for the boats where you need precise control from the deck. Transom-mount (Endura) for smaller boats, kayaks and back-up applications. On-board chargers (Precision family, 2 / 3 / 4-bank) to keep the trolling-motor batteries healthy season over season. We rig and install every Minn Kota we sell, in-house at the shop. Warranty work goes through our service department. You do not have to ship anything anywhere.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey and Kory work the floor on the hull-and-motor match (the right Minn Kota for your boat depends as much on the boat as on the angler). Lee runs the marine bench and handles the rigging: bow plate mounting, breaker and battery wiring, on-board charger install, i-Pilot Link pairing with your fish finder. Damian and Cody back Lee up on bigger jobs. Lynn and Ron at the parts counter stock common Minn Kota parts (props, foot-pedal cables, breaker assemblies) and the Precision charger lineup.</p>',
    ],

    'subcategories' => [
        ['label' => 'Bow-Mount Trolling Motors',     'anchor' => '#bow-mount'],
        ['label' => 'Transom-Mount Trolling Motors', 'anchor' => '#transom'],
        ['label' => 'Chargers & Accessories',        'anchor' => '#chargers'],
    ],

    'series_models' => [
        [
            'slug'         => 'minn-kota-terrova-80-lb-trolling-motor',
            'product_id'   => 207,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Terrova 80 lb Bow-Mount Trolling Motor',
            'tagline'      => 'The workhorse bow-mount. 80 lb thrust, 24V, the most-rigged trolling motor on the boats we sell.',
            'why'          => '<p>The Terrova 80 lb is the trolling motor we put on most of the fishing boats we sell. It is sized right for a 17 to 19 foot fishing hull (Princecraft Sport family, similar mid-size aluminum), it runs on a 24V two-battery setup, and it covers the use cases most of our customers actually fish: walleye trolling on the river, smallmouth working a weed line, lake trout off offshore structure. Available with i-Pilot wireless control for hands-free Spot-Lock GPS anchoring and trolling-pattern automation, or as a cable-steer foot-pedal version if you prefer the direct-control feel.</p><p>What makes the Terrova line the workhorse is the build. Sealed lower unit, cold-water rated, the quietest motor profile in the bow-mount market. The 24V battery setup gives a full fishing day of run time on a properly-sized AGM or lithium pair, and the Precision on-board charger keeps the bank topped between trips. Lee rigs the bow plate, runs the breaker and battery wiring, mounts the charger, and pairs the i-Pilot with your fish finder before the boat leaves the shop.</p>',
            'how'          => [
                ['icon' => 'volume_off',     'title' => 'Quietest in class',         'description' => 'Sealed lower unit, brushless-style quiet operation. The fish do not hear you coming.'],
                ['icon' => 'gps_fixed',      'title' => 'i-Pilot Spot-Lock',         'description' => 'Wireless GPS anchoring. Drop a virtual anchor on a structure, the motor holds you on it.'],
                ['icon' => 'engineering',    'title' => 'In-house rigging',          'description' => 'Lee on the marine bench handles bow plate, wiring, charger and i-Pilot pairing.'],
            ],
            'what'         => [
                ['label' => 'Thrust',      'value' => '80 lb'],
                ['label' => 'Voltage',     'value' => '24V (two-battery setup)'],
                ['label' => 'Mount',       'value' => 'Bow-mount'],
                ['label' => 'Best for',    'value' => '17-19 ft fishing boats, full-day fishing, GPS-assisted anchoring'],
            ],
        ],
        [
            'slug'         => 'minn-kota-ulterra-auto-stow-trolling-motor',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Ulterra Auto-Stow Bow-Mount Trolling Motor',
            'tagline'      => 'Power-deploy and power-stow at the touch of a button. Right tool for the solo angler and the long-day crew.',
            'why'          => '<p>The Ulterra is the upgrade the customer asks for after a few seasons of leaning over the bow to muscle the motor down at the launch and back up at the dock. Push a button, the motor deploys. Push a button, it stows. Same i-Pilot wireless control and Spot-Lock GPS anchoring as the Terrova, with the auto-deploy / auto-stow gearbox added. Right call for older anglers, for one-person fishing crews, and for the customer who runs the motor all day and is tired of the shoulder workout.</p><p>Same sealed lower unit, same quiet motor profile, same 24V or 36V options depending on thrust spec. The price step over the Terrova is real but the convenience pays back the first time you launch single-handed in chop. We rig, install and pair the same way as the Terrova: bow plate, wiring, charger, fish finder pairing, all in-house.</p>',
            'how'          => [
                ['icon' => 'autorenew',      'title' => 'Power-deploy and power-stow', 'description' => 'Button-press deployment at the launch, button-press stow at the dock. No leaning, no lifting.'],
                ['icon' => 'gps_fixed',      'title' => 'Same i-Pilot Spot-Lock',     'description' => 'GPS anchoring, trolling-pattern automation, fish-finder pairing. Same brain as the Terrova.'],
                ['icon' => 'accessibility',  'title' => 'Solo-angler friendly',       'description' => 'Removes the bow-deck workout. Long-day crew and older anglers feel the difference.'],
            ],
            'what'         => [
                ['label' => 'Thrust',      'value' => '80-112 lb (per spec)'],
                ['label' => 'Voltage',     'value' => '24V or 36V (per thrust)'],
                ['label' => 'Mount',       'value' => 'Bow-mount, auto-deploy / auto-stow'],
                ['label' => 'Best for',    'value' => 'Solo crews, long fishing days, accessibility-conscious setups'],
            ],
        ],
        [
            'slug'         => 'minn-kota-ultrex-quest-chirp-trolling-motor',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Ultrex QUEST Bow-Mount with Built-In CHIRP Sonar',
            'tagline'      => 'Tournament-tier bow-mount. Dual Spectrum CHIRP sonar built into the motor itself.',
            'why'          => '<p>The Ultrex QUEST is the tournament-tier bow-mount. The headline feature is the built-in Dual Spectrum CHIRP sonar, factory-integrated into the motor head. No separate transducer to mount on the trolling motor shaft; the sonar is part of the motor. For anglers running integrated networks (Humminbird, Lowrance) and chasing structure-on-structure precision, the Ultrex QUEST is the right call.</p><p>Steering is cable-steer with Power Steering assist (a hybrid of the foot-pedal directness most tournament anglers prefer with the lighter-effort feel of an assisted system). i-Pilot Link is supported for the GPS anchoring and trolling-pattern features, and the integration with Humminbird CHIRP sonar units is the tightest in the market (Minn Kota and Humminbird are sister brands; the network handshake is built in).</p>',
            'how'          => [
                ['icon' => 'sonar',          'title' => 'Built-in CHIRP sonar',       'description' => 'Dual Spectrum CHIRP transducer factory-integrated into the motor head.'],
                ['icon' => 'tune',           'title' => 'Power-steering cable-steer', 'description' => 'Foot-pedal directness with assisted-steering effort. Tournament-tier feel.'],
                ['icon' => 'cable',          'title' => 'Humminbird network tight',   'description' => 'Sister-brand integration. The handshake is built in, not bolted on.'],
            ],
            'what'         => [
                ['label' => 'Thrust',      'value' => '80-112 lb (per spec)'],
                ['label' => 'Voltage',     'value' => '24V or 36V (per thrust)'],
                ['label' => 'Sonar',       'value' => 'Dual Spectrum CHIRP, built-in'],
                ['label' => 'Best for',    'value' => 'Tournament anglers, integrated-sonar networks, structure fishing'],
            ],
        ],
        [
            'slug'         => 'minn-kota-endura-transom-mount-trolling-motor',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Endura Transom-Mount Trolling Motor',
            'tagline'      => 'Transom-mount. Right tool for smaller boats, canoes, kayaks and back-up applications.',
            'why'          => '<p>The Endura is the transom-mount. Hand-control tiller steering, freshwater-rated, sized for smaller boats where a bow-mount does not fit or is not needed. 30 to 55 lb thrust depending on the model, 12V single-battery setup, the most affordable way into a Minn Kota motor. Right call for a 12 to 14 foot tinny on a back lake, a canoe with a square transom, a kayak with a Minn Kota mounting plate, or a get-home back-up on a larger rig.</p><p>What you give up versus the bow-mounts: GPS anchoring, foot-pedal control, sonar integration. What you get: a quiet, reliable, low-cost motor that does the job for years on the right boat. Lee handles the install (transom mounting plate, breaker and battery wiring) at the shop. Same warranty support as the bow-mount lineup.</p>',
            'how'          => [
                ['icon' => 'directions_boat','title' => 'Smaller-boat lane',          'description' => 'Tinnies, canoes, kayaks, dinghies. Where a bow-mount is overkill or does not fit.'],
                ['icon' => 'handyman',       'title' => 'Hand-control tiller',        'description' => 'Direct tiller steering. No foot pedal, no wireless, no integration to learn.'],
                ['icon' => 'savings',        'title' => 'Lowest entry price',         'description' => 'Most affordable way into a Minn Kota motor. Genuine warranty, genuine parts.'],
            ],
            'what'         => [
                ['label' => 'Thrust',      'value' => '30-55 lb (per model)'],
                ['label' => 'Voltage',     'value' => '12V (single battery)'],
                ['label' => 'Mount',       'value' => 'Transom-mount, hand-control tiller'],
                ['label' => 'Best for',    'value' => 'Tinnies, canoes, kayaks, back-up motor on bigger rigs'],
            ],
        ],
        [
            'slug'         => 'minn-kota-precision-onboard-chargers',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Precision On-Board Chargers',
            'tagline'      => 'Battery health is half the trolling-motor story. Precision chargers, 2 / 3 / 4-bank, AGM and lithium compatible.',
            'why'          => '<p>The chargers are not the glamorous part of the trolling-motor setup, but they are the part that decides whether your batteries last two seasons or eight. The Precision family is Minn Kota`s on-board charger line. Permanently mounted in the boat, hard-wired to the battery bank, automatic charge profile (AGM or lithium per spec), and a status LED you can read at a glance after every trip.</p><p>Sizing is straightforward. 12V single-battery setup (Endura) gets a 2-bank charger to cover the trolling-motor battery and the cranking battery. 24V (Terrova / Ulterra base) gets a 3-bank to cover the trolling-motor pair and the cranking battery. 36V (Ulterra / Ultrex QUEST top end) gets a 4-bank to cover the trolling-motor triple and the cranking battery. Lynn and Ron at the parts counter stock the common bank sizes; we install when we rig the motor.</p>',
            'how'          => [
                ['icon' => 'battery_charging_full','title' => 'On-board, hard-wired',  'description' => 'Permanent install. Plug into shore power at the dock or in the garage, walk away.'],
                ['icon' => 'battery_full',     'title' => 'AGM and lithium profiles', 'description' => 'Automatic charge profile per battery type. No frying lithium with an AGM-only charger.'],
                ['icon' => 'inventory',        'title' => 'Bank-size match',          'description' => '2 / 3 / 4-bank options. Sized to your trolling-motor voltage plus cranking battery.'],
            ],
            'what'         => [
                ['label' => 'Banks',       'value' => '2, 3 or 4 (sized to system)'],
                ['label' => 'Compatibility','value' => 'AGM and lithium battery profiles'],
                ['label' => 'Install',     'value' => 'On-board, hard-wired, in-house at Reyco'],
                ['label' => 'Best for',    'value' => 'Every Minn Kota owner who fishes more than once a week'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Minn Kota',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Minn Kota dealer. Full bow-mount and transom-mount lineup, plus Precision chargers and parts.',
        'body'     => '<p>Minn Kota is the trolling-motor platform on most of the fishing boats we sell. Authorised dealer status means factory-direct pricing on the full lineup (Terrova, Ulterra, Ultrex QUEST, Endura, Precision chargers), genuine parts, and full manufacturer warranty handled in-house at the shop. We work with the full Minn Kota catalogue: if you want a specific Ultrex QUEST CHIRP variant or a thrust / shaft combination not on the floor, we can source it direct from Minn Kota with typical 1 to 3 week lead times.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right Minn Kota for the boat and the way you fish',
        'columns' => ['Model',          'Mount',         'Thrust / Voltage',     'Best for'],
        'rows'    => [
            ['Terrova 80 lb',           'Bow-mount',     '80 lb / 24V',           '17-19 ft fishing boats, GPS anchoring, full-day fishing'],
            ['Ulterra',                 'Bow-mount',     '80-112 lb / 24-36V',    'Solo crews, long days, auto-deploy convenience'],
            ['Ultrex QUEST CHIRP',      'Bow-mount',     '80-112 lb / 24-36V',    'Tournament, integrated sonar, structure fishing'],
            ['Endura',                  'Transom-mount', '30-55 lb / 12V',        'Tinnies, canoes, kayaks, back-up motor'],
            ['Precision Chargers',      'Accessory',     '2 / 3 / 4-bank',        'Every Minn Kota owner, season-over-season battery health'],
        ],
    ],

    'faq' => [
        [
            'q' => 'What thrust trolling motor do I need for my boat?',
            'a' => 'Rough rule: 2 lb of thrust per 100 lb of fully-loaded boat (motor, fuel, gear, passengers). For a 17 to 19 ft fishing boat, that lands at 55 to 80 lb (the Terrova 80 lb is the most-common spec on the boats we sell). Larger pontoons or heavily-rigged tournament boats run 80 to 112 lb on an Ulterra or Ultrex QUEST. Bring us the boat or the spec and we will size it correctly the first time.',
        ],
        [
            'q' => 'What shaft length should I order?',
            'a' => 'Measure from the top of the bow deck (where the motor mounts) to the waterline at full load, then add about 20 inches to keep the prop fully submerged in chop. Most 16 to 18 ft fishing hulls land at a 45 to 52 inch shaft. Larger boats and pontoons usually need 60 to 87 inches. We measure and recommend if you bring the boat to the shop.',
        ],
        [
            'q' => 'Do I need an on-board charger?',
            'a' => 'If you fish more than once a week or want to extend battery life, yes. A Minn Kota Precision charger sized to your voltage (2 / 3 / 4-bank) keeps the batteries topped without overcharging, and pays for itself in battery longevity within two seasons. We install the charger when we rig the motor.',
        ],
        [
            'q' => 'Can you service a Minn Kota I bought somewhere else?',
            'a' => 'Yes. As an authorised Minn Kota dealer, we service all Minn Kota motors regardless of where they were purchased. Bring it in or describe the issue and Lee will work through it on the marine bench.',
        ],
        [
            'q' => 'Will my Minn Kota work with my fish finder?',
            'a' => 'Most modern Minn Kota motors integrate with Humminbird and Lowrance fish-finder networks via i-Pilot Link. The Humminbird integration is particularly tight (Minn Kota and Humminbird are sister brands and the network handshake is built in). We pair the motor with your finder during install.',
        ],
        [
            'q' => 'What about saltwater? Do you carry Riptide?',
            'a' => 'Riptide is the Minn Kota saltwater line. We are a Northern Ontario freshwater dealer, so the Riptide is not the right fit for the kind of fishing our customers do. If you are trailering to saltwater for a one-off, we can talk through whether a Riptide spec makes sense as a special-order, but most of our customers are best served by the freshwater Terrova / Ulterra / Ultrex / Endura lineup.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to spec a Minn Kota for your boat?',
        'body'      => '<p>Drop in and look at the Minn Kotas on the floor, or give us a call and Casey or Kory will work through the hull-and-thrust match. Lee handles the install once the motor is in.</p>',
        'primary'   => ['label' => 'Visit the shop',                'href' => '/contact/'],
        'secondary' => ['label' => 'Pair with Princecraft hulls',    'href' => '/boats-and-marine/princecraft/'],
    ],
];
```

---

## QC checklist (web-copy author side)

**Stock-flag (per banked working-process rule, plumb-side WP-CLI verification):**
- [x] **Terrova 80 lb** — VERIFIED (id 207, 2026 Minn Kota Terrova 80 lb Trolling Motor per boss dispatch). Specs assertable in body copy.
- [ ] **Ulterra** — stock-pending-plumb. Confirm specific Ulterra hull (thrust + voltage spec) at plumb. Body copy phrased to survive a thrust-spec substitution within the Ulterra family.
- [ ] **Ultrex QUEST CHIRP** — stock-pending-plumb. Confirm whether Reyco stocks the Ultrex QUEST or sources only on order. If on-order-only, the entry copy still works (frames as "we can source from Minn Kota").
- [ ] **Endura** — stock-pending-plumb. Confirm specific Endura model (thrust spec, freshwater variant) at plumb. Body copy phrased to survive thrust-spec substitution.
- [ ] **Precision On-Board Chargers** — stock-pending-plumb. Lynn / Ron at the parts counter to confirm which bank sizes (2/3/4) are stocked on the floor versus on-order.
- [ ] All five entries have appropriate `product_id` (207 verified for Terrova, 0 placeholders for the rest) and `thumbnail_id => 0` placeholders. Boss to assign real WC IDs at plumb.

**Voice / format (matches Batches 1-5 + Princecraft standard):**
- [x] Canadian English (authorised, neighbour, etc.)
- [x] No em-dashes anywhere in PHP body. Both Unicode (U+2014) AND HTML entities (`&mdash;` / `&#8212;` / `&#x2014;`) checked. Per boss msg 1778090043782, PR #192 today fixed entity gap on theme PHP, so the entity audit is real.
- [x] No banned AI tells (delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y")
- [x] No "Talk to Casey" / "Call Casey" / "ask Casey" CTAs
- [x] No inline Casey or Lee quotes (Casey-gate active until standing reply lands)
- [x] No founding-year claims for Reyco; present-tense framing only
- [x] No "sixty years" Minn Kota heritage claim from old Format A deliverable (Minn Kota actually founded 1934, 90+ years; "sixty" was wrong; dropped)
- [x] Staff names match roster (Casey, Aaron, Lee, Damian, Cody, Lynn, Ron, Kory)
- [x] Lee specifically named on the marine bench (per old Format A deliverable + ground truth)
- [x] Minn Kota and Humminbird both inside the 11-brand authorised list
- [x] Princecraft cross-link references the brand page just shipped this morning

**Cross-link integrity:**
- [x] Hero secondary CTA → `/contact/`
- [x] CTA secondary → `/boats-and-marine/princecraft/` (just-shipped sibling brand page; cross-links the trolling-motor / hull pairing)
- [x] Subcategories anchor in-page (`#bow-mount`, `#transom`, `#chargers`)
- [ ] Humminbird sister-brand reference in Ultrex QUEST entry: links into running prose, not a hyperlink (Humminbird brand page may need its own series-showcase migration on the same pattern as Princecraft and this one). Flag for follow-up batch.

**Dev-side flags:**
- [ ] Page-template binding: `_wp_page_template = page-templates/series-showcase.php` on the Minn Kota brand page (per banked memory `project_reyco_wp_template_migration_pattern.md`). WP-CLI patch needed since setup-pages.php only fires on creation.
- [ ] Material Symbols icon name verification: `volume_off`, `gps_fixed`, `engineering`, `autorenew`, `accessibility`, `sonar`, `tune`, `cable`, `directions_boat`, `handyman`, `savings`, `battery_charging_full`, `battery_full`, `inventory`. The `sonar` icon is less common; if it does not render, fall back to `radar` or `track_changes`.
- [ ] `_catalogue_config` post-meta: confirm whether the Minn Kota brand page uses file-based config or has a post-meta override. Same gotcha as Princecraft.
- [ ] Brand-band logo + per-entry thumbnails all 0 placeholders (Terrova thumbnail_id is also 0 even though product_id is 207; the WC product image may pull through automatically depending on theme behaviour, otherwise needs manual thumbnail_id set at plumb).
- [ ] Old config has subcategories as taxonomy-term blocks (`taxonomy_term: terrova`, etc.). New config uses subcategory anchors (`label` + `anchor`). Confirm the series-showcase template renders the anchor-based subcategory band correctly (Princecraft + Batches 1-5 use the same pattern, should work).

**Old-config elements consciously dropped from the new config:**
- `image` / `badge` / `position` keys from old hero shape
- Two-expert array with named quotes (Casey + Lee quotes) — Casey-gate active, no inline owner-voice quotes
- Three taxonomy-term subcategory carousels with descriptions — replaced by anchor-based subcategory band + series_models with full why/how/what
- `why_choose` block (rolled into `intro` body where natural, plus `brand_band` body for the dealer credentials)
- `local_context` block (rolled into `intro` body Northern Ontario framing)
- `sixty years` Minn Kota heritage claim (factually wrong; dropped)

---

## Rollout summary table (updated through Minn Kota)

| Batch | Date | Pages | Entries | Commit | Status |
|-------|------|-------|---------|--------|--------|
| 1 | 2026-05-XX | 4 | ~17 | 6b235a9 | Shipped + plumbed |
| 2 | 2026-05-XX | 4 | ~17 | aed97e2 | Shipped + plumbed |
| 3 | 2026-05-XX | 4 | ~17 | 01d3c4d | Shipped + plumbed |
| 4 | 2026-05-05 | 4 | ~17 | 23ac57e | Shipped + plumbed |
| 5 | 2026-05-06 | 5 | ~9 (8 dev / 9 author) | 1c0c7bf + a7b91fa | Shipped + plumbed (DCS-5000 sub) |
| Princecraft | 2026-05-06 | 1 (replacement) | 5 | b2d7ff0 | Shipped, plumb pending |
| Minn Kota (this) | 2026-05-06 | 1 (replacement) | 5 (1 verified, 4 stock-flagged) | TBD | Author-side ready, plumb pending |

Cumulative through this deliverable: 23 pages of new / replaced category configs, ~75 series-models entries on the author side. 2nd brand-page migration. The pattern is holding (Princecraft and Minn Kota use identical config shape), which means the 9 remaining brand pages on the 11-brand authorised list (Mercury, Toro, Echo, Cub Cadet, E-Z-GO, Hisun, Humminbird, Cannon, R&J Machine) can run on the same migration template post-launch.

---

## Working notes (post-launch follow-ups)

1. **Brand-page migration follow-up:** with Princecraft and Minn Kota both holding the pattern, the remaining 9 brand pages (Mercury, Toro, Echo, Cub Cadet, E-Z-GO, Hisun, Humminbird, Cannon, R&J Machine) become a 9-page brand-page batch when Aiden picks it up post-launch. Mercury and Humminbird are the two highest-priority next picks (Mercury pairs with every Princecraft hull; Humminbird pairs with every Minn Kota i-Pilot Link integration).
2. **Humminbird brand-page Q&A from boss queue:** standing item from earlier in the day was "Humminbird brand-page Q&A." This deliverable cross-links to Humminbird in the Ultrex QUEST entry but does not link out (Humminbird brand page is in unknown state). When the Humminbird migration runs, the link in the Ultrex QUEST entry can become a hyperlink in a follow-up content polish.
3. **Casey / Lee quote refresh:** consistent with Princecraft + Batches 1-5 standing, this deliverable carries no inline owner-voice quotes. The old Format A deliverable had Casey + Lee quotes that were quite strong (Casey: hull-and-use match question; Lee: wiring discipline). When Casey-gate clears, a content polish pass can drop those quotes back into the Terrova marquee + Ulterra entry.
4. **Riptide line decision:** old Format A deliverable mentioned Riptide saltwater. New deliverable explicitly excludes it from the lineup but addresses it in FAQ as a special-order conversation. If Reyco actively wants to expand into Great Lakes saltwater-trailering use case, the Riptide line can be added as a 6th anchor on a follow-up content batch.
5. **SKU stock-verification at plumb:** the working-process rule banked from the Batch 5 DCS-2100C / DCS-5000 incident applies fully here. 4 stock-flagged anchors, 1 verified anchor (Terrova 80 lb, id 207). Boss WP-CLI live-inventory query will resolve the 4 stock-flagged.
6. **Old `brand-page-minn-kota.md` archive:** the old Format A deliverable is at `orgs/glv/clients/reyco/deliverables/web-copy/brand-page-minn-kota.md`. Should remain in the deliverables folder as historical reference (do not delete) since it has the strong Casey + Lee quote material for the future polish pass.

End of deliverable.
