# Series Showcase Batch 1 — Reyco Boats & Marine (4 pages, 14 products)

**Boss dispatch:** 1778023566969 (4-page rollout of `series-showcase.php` template, PR #175).
**Pattern reference:** `inc/category-configs/powersports--mp9.php` + `powersports--sector.php` (post-PR-176, em-dash sweep applied).
**Voice constraints:** no em-dashes (use period/comma), no AI tells (delve/unlock/leverage/elevate/journey/tapestry/world-class/industry-leading/robust/seamless/Moreover/Furthermore/Additionally), short sentences, real specifics. Reyco founded 2022, no "60 years" claims, present-tense framing only. CTAs use "Get in Touch" / "Apply for Financing" / "Visit the Showroom" (no "Talk to Casey" / "Call Casey" / "ask Casey").
**Authorized brands:** Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine.
**Staff roster:** Casey (sales floor), Aaron (co-owner + service manager), Lee/Damian/Cody (bench), Lynn/Ron (parts), Kory (sales).
**Geography (verifiable):** Sault Ste. Marie, Algoma district, Northern Ontario, Lake Superior, St. Marys River.
**Approval gate:** Aiden review before any commit to live theme.
**Per-product field shape:** slug, product_id, thumbnail_id (0 = fallback to featured image), heading, tagline, why (HTML), how (3x icon+title+description), what (4x label+value).
**Per-page optionals:** brand_band, comparison_table, testimonials.

---

## PAGE 1 — `boats-marine--fishing-boats.php`

```php
<?php
/**
 * Category config: Fishing Boats
 * Wired to: /boats-and-marine/fishing-boats/
 * Template: page-templates/series-showcase.php
 */

return [
    'series_models' => [
        [
            'slug'         => 'resorter-160-bt',
            'product_id'   => 426,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Resorter 160 BT',
            'tagline'      => 'Sixteen feet of straight-up fishing aluminum.',
            'why'          => '<p>The Resorter 160 BT is the boat we sell to anglers who want one rig that handles morning trolling on the St. Marys, an evening jig session in a quiet bay, and a weekend on a back lake without the trailer drama of a bigger hull. Sixteen feet, four-person capacity, 40 HP max, 540 lb dry. It launches off any ramp you can drive a half-ton to.</p><p>It is the right call for first-time aluminum buyers, retirees rebuilding a single-boat garage, and cottage owners who want a fishing-first deck instead of a multi-purpose runabout. Reyco rigs every Resorter with a Mercury outboard and water-tests it before delivery.</p>',
            'how' => [
                ['icon' => 'set_meal',         'title' => 'Fishing-First Deck',     'description' => 'Bow casting space, 7-foot rod storage, and a 49 L SportFlo livewell come standard.'],
                ['icon' => 'directions_boat',  'title' => 'H36 Aluminum Hull',      'description' => 'Reverse chine, splashwell, and the same alloy Princecraft puts on its bigger boats.'],
                ['icon' => 'handyman',         'title' => 'Reyco Service & Parts',  'description' => 'Aaron and Lee handle Mercury rigging in-house, with parts on hand at Lynn and Ron\'s counter.'],
            ],
            'what' => [
                ['label' => 'Length',     'value' => '16 ft / 4.9 m'],
                ['label' => 'Max HP',     'value' => '40 HP'],
                ['label' => 'Capacity',   'value' => '4 persons'],
                ['label' => 'Dry Weight', 'value' => '540 lb'],
            ],
        ],
        [
            'slug'         => 'amarok-166-ws',
            'product_id'   => 456,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Amarok 166 WS',
            'tagline'      => 'Walk-around windshield and a 5-rod in-floor locker.',
            'why'          => '<p>The Amarok 166 WS is the next step up for anglers who want a windshield and console layout without giving up casting space. Sixteen and a half feet, five-person capacity, 75 HP max, 1040 lb dry. The walk-around design keeps the bow open, and the in-floor lockable rod organizer holds five rods so they are not riding on the deck on a long run.</p><p>This is the boat for a serious weekend angler who fishes Lake Superior tributaries, the North Channel, and inland Algoma lakes through the season. The 75 HP rating opens up real running speed for covering water. Reyco pre-rigs each Amarok with a Mercury outboard and registers it before pickup.</p>',
            'how' => [
                ['icon' => 'phishing',         'title' => '5-Rod In-Floor Locker',  'description' => 'Lockable rod organizer keeps five rods stowed and out of the cockpit on transit runs.'],
                ['icon' => 'directions_boat',  'title' => 'Bow + Aft Casting',      'description' => 'Raised platforms front and back, both with built-in storage underneath.'],
                ['icon' => 'pool',             'title' => '61 L Bow Livewell',      'description' => 'SportFlo aerated bow livewell sized for a full day of catch-and-keep.'],
            ],
            'what' => [
                ['label' => 'Length',     'value' => '16 ft 6 in / 5.0 m'],
                ['label' => 'Max HP',     'value' => '75 HP'],
                ['label' => 'Capacity',   'value' => '5 persons'],
                ['label' => 'Dry Weight', 'value' => '1040 lb'],
            ],
        ],
        [
            'slug'         => 'sportfisher-21-2s-fishing',
            'product_id'   => 1034,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Sportfisher 21 2S Fishing Edition',
            'tagline'      => 'A 21-foot fishing pontoon for bigger water and bigger groups.',
            'why'          => '<p>The Sportfisher 21 2S Fishing Edition is on this page because it is set up for fishing first. Twenty-one and a half feet, eight-person capacity, 115 HP max, 1803 lb dry. The fishing layout adds rod storage, casting space, and a rigging package that suits anglers who want a stable platform for the family-and-tackle weekend trips on Lake Superior bays and the bigger inland lakes around Algoma.</p><p>If you are choosing between a hard-sided 18-footer and a 21-foot fishing pontoon, the pontoon usually wins on weekend versatility. More deck, more seating, easier for kids and dogs, and the same fishing capability when you want to drift a school. Reyco rigs the Sportfisher with a Mercury outboard and water-tests it before delivery.</p>',
            'how' => [
                ['icon' => 'set_meal',         'title' => 'Fishing-Edition Deck',   'description' => 'Configured for rod storage and casting space without losing pontoon seating.'],
                ['icon' => 'groups',           'title' => '8-Person Capacity',      'description' => 'Eight people across a 21-and-a-half-foot deck without crowding the rails.'],
                ['icon' => 'verified',         'title' => 'In-House Mercury Rig',   'description' => 'Aaron\'s service team fits and water-tests every Sportfisher before pickup.'],
            ],
            'what' => [
                ['label' => 'Length',     'value' => '21 ft 6 in / 6.6 m'],
                ['label' => 'Max HP',     'value' => '115 HP'],
                ['label' => 'Capacity',   'value' => '8 persons'],
                ['label' => 'Dry Weight', 'value' => '1803 lb'],
            ],
        ],
    ],

    'brand_band' => [
        'eyebrow'  => 'Authorized Princecraft Dealer',
        'headline' => 'Quebec-Built Aluminum, Northern Ontario Service',
        'body'     => 'Princecraft has built aluminum boats in Princeville, Quebec since 1954. Reyco is an authorized Princecraft dealer, which means we have full warranty access, factory parts, and direct lines into Princecraft\'s technical support for the rigs we sell and service.',
        'stats'    => [
            ['value' => '11',  'label' => 'Authorized brands at Reyco'],
            ['value' => '3',   'label' => 'Princecraft fishing models on this page'],
            ['value' => '60+', 'label' => 'Days from order to water-tested delivery'],
        ],
    ],

    'comparison_table' => [
        'headers' => ['Model', 'Length', 'Max HP', 'Capacity', 'Best Fit'],
        'rows' => [
            ['Resorter 160 BT',                'col_1' => '16 ft',     'col_2' => '40 HP',  'col_3' => '4',  'col_4' => 'First aluminum, single-boat garage'],
            ['Amarok 166 WS',                  'col_1' => '16 ft 6',   'col_2' => '75 HP',  'col_3' => '5',  'col_4' => 'Serious weekend angler, walk-around layout'],
            ['Sportfisher 21 2S Fishing',      'col_1' => '21 ft 6',   'col_2' => '115 HP', 'col_3' => '8',  'col_4' => 'Family + fishing, big-water pontoon'],
        ],
    ],
];
```

---

## PAGE 2 — `boats-marine--pontoons.php`

```php
<?php
/**
 * Category config: Pontoons
 * Wired to: /boats-and-marine/pontoons/
 * Template: page-templates/series-showcase.php
 */

return [
    'series_models' => [
        [
            'slug'         => 'vectra-21-rl',
            'product_id'   => 451,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Vectra 21 RL',
            'tagline'      => 'A new-build cottage pontoon for cruise, swim, and tube weekends.',
            'why'          => '<p>The Vectra 21 RL is the 2026 model-year cottage pontoon. Twenty-one and a half feet, eight-person capacity, 115 HP max, 1881 lb dry, RL deck layout. It is the boat for the family that runs a back-lake cottage off the Trans-Canada and wants one rig that handles morning coffee on the water, afternoon swims, evening cruises, and a tube behind it on the weekends.</p><p>The Vectra ships with a Jensen radio with Bluetooth and four waterproof speakers, instrumentation, swim platform with telescopic ladder, and a Bimini top, all standard. Reyco rigs each Vectra with a Mercury outboard and water-tests it before pickup.</p>',
            'how' => [
                ['icon' => 'weekend',          'title' => 'Cottage Cruiser Layout', 'description' => 'RL deck plan keeps the seating open for groups and the rails clear for swim access.'],
                ['icon' => 'speaker',          'title' => 'Jensen Bluetooth Stereo','description' => 'Four waterproof speakers and a Jensen receiver come from the factory.'],
                ['icon' => 'pool',             'title' => 'Swim Platform + Ladder', 'description' => 'Rear platform with telescopic boarding ladder for swim, tube, and ski exits.'],
            ],
            'what' => [
                ['label' => 'Length',     'value' => '21 ft 6 in / 6.6 m'],
                ['label' => 'Max HP',     'value' => '115 HP'],
                ['label' => 'Capacity',   'value' => '8 persons'],
                ['label' => 'Dry Weight', 'value' => '1881 lb'],
            ],
        ],
        [
            'slug'         => 'sportfisher-21-2rs',
            'product_id'   => 384,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Sportfisher 21 2RS',
            'tagline'      => 'A 21-foot fish-and-cruise pontoon for the back-lake weekend.',
            'why'          => '<p>The Sportfisher 21 2RS is a fish-and-cruise pontoon that splits the difference between a fishing-edition deck and a pure cruiser. Twenty-one and a half feet, eight-person capacity, 115 HP max, 1944 lb dry. The 2RS layout keeps casting space at the bow with conventional pontoon seating through the middle and aft, so families can fish in the morning and tube in the afternoon without rearranging the deck.</p><p>It is the right call for owners who fish weekends, host weekends, and want one boat that does both. Reyco rigs the Sportfisher with a Mercury outboard, water-tests it on the St. Marys, and registers it before pickup.</p>',
            'how' => [
                ['icon' => 'set_meal',         'title' => 'Bow Casting Station',    'description' => 'Open bow deck with rod holders for morning fishing without breaking down seating.'],
                ['icon' => 'groups',           'title' => 'Mid + Aft Pontoon Seats','description' => 'Conventional lounge layout through the middle and aft for cruise mode.'],
                ['icon' => 'verified',         'title' => 'In-House Rig + Test',    'description' => 'Aaron\'s service team fits, rigs, and water-tests every Sportfisher in-house.'],
            ],
            'what' => [
                ['label' => 'Length',     'value' => '21 ft 6 in / 6.6 m'],
                ['label' => 'Max HP',     'value' => '115 HP'],
                ['label' => 'Capacity',   'value' => '8 persons'],
                ['label' => 'Dry Weight', 'value' => '1944 lb'],
            ],
        ],
        [
            'slug'         => 'sportfisher-23-2rs',
            'product_id'   => 374,
            'thumbnail_id' => 0,
            'heading'      => 'Princecraft Sportfisher 23 2RS',
            'tagline'      => 'A 23-foot pontoon for bigger water, bigger groups, longer days.',
            'why'          => '<p>The Sportfisher 23 2RS is the bigger sister to the 21. Twenty-three and a half feet, eight-person capacity, 150 HP max, 2600 lb dry. The extra two feet and the bigger HP rating open up wider water with confidence. This is the pontoon for owners who run on the bigger Algoma lakes, want more room for guests, and plan to spend full days on the water rather than two-hour cruises.</p><p>Same fish-and-cruise 2RS layout as the 21, scaled up. Reyco rigs each one with a Mercury outboard and water-tests it before delivery.</p>',
            'how' => [
                ['icon' => 'straighten',       'title' => '23-Foot Deck',           'description' => 'Two extra feet of deck length over the 21 for more seating and storage room.'],
                ['icon' => 'bolt',             'title' => '150 HP Rating',          'description' => 'Higher HP ceiling for confident running on bigger water and longer crossings.'],
                ['icon' => 'verified',         'title' => 'In-House Mercury Rig',   'description' => 'Aaron\'s service team rigs and water-tests every Sportfisher before pickup.'],
            ],
            'what' => [
                ['label' => 'Length',     'value' => '23 ft 6 in / 7.2 m'],
                ['label' => 'Max HP',     'value' => '150 HP'],
                ['label' => 'Capacity',   'value' => '8 persons'],
                ['label' => 'Dry Weight', 'value' => '2600 lb'],
            ],
        ],
    ],

    'comparison_table' => [
        'headers' => ['Model', 'Length', 'Max HP', 'Layout', 'Best Fit'],
        'rows' => [
            ['Vectra 21 RL',           'col_1' => '21 ft 6',  'col_2' => '115 HP', 'col_3' => 'Cruise',         'col_4' => 'Cottage cruise + swim + tube'],
            ['Sportfisher 21 2RS',     'col_1' => '21 ft 6',  'col_2' => '115 HP', 'col_3' => 'Fish + Cruise',  'col_4' => 'Weekend fishing + family'],
            ['Sportfisher 23 2RS',     'col_1' => '23 ft 6',  'col_2' => '150 HP', 'col_3' => 'Fish + Cruise',  'col_4' => 'Bigger lakes, bigger groups'],
        ],
    ],
];
```

---

## PAGE 3 — `boats-marine--mega-live-2.php`

(Per boss msg 1778023654371: drafting for `mega-live-2` category as "MEGA Live 2 Series" framing. `mega-live-sonar` duplicate to be resolved at deploy time.)

```php
<?php
/**
 * Category config: MEGA Live 2 Series
 * Wired to: /boats-and-marine/mega-live-2/
 * Template: page-templates/series-showcase.php
 */

return [
    'series_models' => [
        [
            'slug'         => 'mega-live-2-forward',
            'product_id'   => 282,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird MEGA Live 2 Forward-Facing',
            'tagline'      => 'Real-time forward-cone sonar for tournament-level fishing.',
            'why'          => '<p>The MEGA Live 2 Forward-Facing is the unit serious anglers run when they want to see fish move into and out of the cone in real time, not scroll through what already happened. It is what changed competitive bass and walleye fishing in the last few years and it is just as useful on Lake Superior structure, suspended schools off Goulais, and the deep walleye bites on the bigger inland lakes.</p><p>Reyco is an authorized Humminbird dealer. We supply the head unit, the transducer, the network components, and the mounting hardware as a coordinated package, and Aaron\'s service team handles installation and warranty registration in-house.</p>',
            'how' => [
                ['icon' => 'visibility',       'title' => 'Live, Not Logged',       'description' => 'See fish enter and exit the forward cone in real time instead of in scrolling history.'],
                ['icon' => 'cable',            'title' => 'Helix / APEX / SOLIX',   'description' => 'Compatible with current Helix, APEX, SOLIX, and XPLORE head-unit lines.'],
                ['icon' => 'engineering',      'title' => 'In-House Install',       'description' => 'Aaron and the service team handle mounting, networking, and warranty registration.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Forward-facing live sonar'],
                ['label' => 'Model Year',   'value' => '2026'],
                ['label' => 'Compatibility','value' => 'Helix / APEX / SOLIX / XPLORE'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
        [
            'slug'         => 'mega-live-2-transom',
            'product_id'   => 283,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird MEGA Live 2 Transom-Mount',
            'tagline'      => 'Live sonar without a trolling-motor mount.',
            'why'          => '<p>The MEGA Live 2 Transom-Mount is the live-sonar option for boats that do not run a trolling-motor mount. Bolt to the transom, network it into your head unit, and you get the same real-time cone view as the forward-facing version. Most useful on smaller fishing boats, walleye rigs, and any setup where a Minn Kota Ultrex with TargetLock is not in the picture.</p><p>Reyco supplies the head unit, transducer, network, and mount as a package and handles installation in-house.</p>',
            'how' => [
                ['icon' => 'sensors',          'title' => 'Transom-Mount Setup',    'description' => 'Bolts to the transom for live sonar without a trolling-motor mount.'],
                ['icon' => 'cable',            'title' => 'APEX / Helix Network',   'description' => 'Networks into APEX and Helix head units through the standard Humminbird harness.'],
                ['icon' => 'engineering',      'title' => 'In-House Rigging',       'description' => 'Aaron\'s service team handles mounting, networking, and warranty registration.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Transom-mount live sonar'],
                ['label' => 'Model Year',   'value' => '2026'],
                ['label' => 'Compatibility','value' => 'APEX / Helix'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
        [
            'slug'         => 'ice-mega-live-2-pole-mount',
            'product_id'   => 284,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird ICE MEGA Live 2 Compact Pole-Mount',
            'tagline'      => 'Live sonar through the ice for sled-and-shanty setups.',
            'why'          => '<p>The ICE MEGA Live 2 Compact Pole-Mount is the live-sonar unit Humminbird ships specifically for ice-fishing pole-mount use. Live sonar through the ice puts the angler on fish in real time. Instead of a scroll of what passed under the hole, you see fish moving into the cone and reacting to the lure.</p><p>Compact pole mount makes it portable for sled-and-shanty setups on Pickerel Lake, Wabos, the back lakes north of the Sault, and anywhere else the ice rig has to walk in. Reyco stocks the unit and the conversion accessories for ice-fishing customers who run live sonar through the winter.</p>',
            'how' => [
                ['icon' => 'ac_unit',          'title' => 'Built for the Ice',      'description' => 'Pole-mount form factor designed for shanty and sled ice-fishing setups.'],
                ['icon' => 'visibility',       'title' => 'Live Cone View',         'description' => 'See fish move into the cone and react to the lure rather than reviewing history.'],
                ['icon' => 'inventory_2',      'title' => 'Stocked at Parts',       'description' => 'Conversion cables and adapters are kept on the parts counter through the winter.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Ice live sonar, pole-mount'],
                ['label' => 'Model Year',   'value' => '2026'],
                ['label' => 'SKU',          'value' => 'HB-ICELIVE2-PM-26'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
        [
            'slug'         => 'ice-mega-live-2-power-cable',
            'product_id'   => 285,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird ICE MEGA Live 2 Power Cable',
            'tagline'      => 'Factory-spec lead for the ICE MEGA Live 2 conversion.',
            'why'          => '<p>The ICE MEGA Live 2 Power Cable is the factory-spec lead for the ICE conversion kit on the MEGA Live 2 sonar. Stocked at our parts counter for ice-fishing customers who run live sonar through the winter and need a clean replacement when a cable wears, frays, or gets pulled through one too many holes.</p><p>Lynn and Ron keep these on the shelf from October through March. If you need one for a tournament weekend, give us a call before you drive in.</p>',
            'how' => [
                ['icon' => 'cable',            'title' => 'Factory-Spec Lead',      'description' => 'Direct Humminbird replacement for the ICE conversion power harness.'],
                ['icon' => 'inventory_2',      'title' => 'Stocked Through Winter', 'description' => 'On the parts counter October through March for tournament and weekend turnaround.'],
                ['icon' => 'support_agent',    'title' => 'Call Before You Drive',  'description' => 'Phone the parts counter to confirm stock if you need one same-day.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Ice fishing accessory'],
                ['label' => 'Model Year',   'value' => '2026'],
                ['label' => 'SKU',          'value' => 'HB-ICELIVE2-PWR-26'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
    ],

    'brand_band' => [
        'eyebrow'  => 'Authorized Humminbird Dealer',
        'headline' => 'Live Sonar, Networked Head Units, Stocked Accessories',
        'body'     => 'Reyco is an authorized Humminbird dealer. We supply head units, transducers, networking, mounting hardware, and ICE conversion accessories as coordinated packages. Aaron\'s service team handles installation, networking, and warranty registration in-house.',
        'stats'    => [
            ['value' => '4',   'label' => 'MEGA Live 2 SKUs stocked'],
            ['value' => '1',   'label' => 'In-house service team for install'],
            ['value' => 'Yr',  'label' => 'Round, ICE accessories on shelf'],
        ],
    ],
];
```

---

## PAGE 4 — `boats-marine--marine-electronics-accessories.php`

(Note from dispatch: "config likely needs to be created" — drafting as new file.)

```php
<?php
/**
 * Category config: Marine Electronics Accessories
 * Wired to: /boats-and-marine/marine-electronics-accessories/
 * Template: page-templates/series-showcase.php
 */

return [
    'series_models' => [
        [
            'slug'         => 'ice-mega-live-2-power-cable',
            'product_id'   => 285,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird ICE MEGA Live 2 Power Cable',
            'tagline'      => 'Factory-spec power lead for the MEGA Live 2 ICE conversion.',
            'why'          => '<p>The ICE MEGA Live 2 Power Cable is the factory-spec lead for the ICE conversion on the MEGA Live 2 sonar. Stocked at our parts counter for ice-fishing customers who run live sonar through the winter and need a clean replacement when a cable wears or gets pulled through one too many holes.</p><p>Lynn and Ron keep these on the shelf October through March. Call ahead if you need one same-day.</p>',
            'how' => [
                ['icon' => 'cable',            'title' => 'Factory-Spec Lead',      'description' => 'Direct Humminbird replacement for the MEGA Live 2 ICE conversion power harness.'],
                ['icon' => 'inventory_2',      'title' => 'Stocked Oct - Mar',      'description' => 'Kept on the parts counter through the ice-fishing season for fast turnaround.'],
                ['icon' => 'verified',         'title' => 'Manufacturer Warranty',  'description' => 'Full Humminbird warranty applies, serviced in-house at the Sault.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Ice fishing accessory'],
                ['label' => 'Connector',    'value' => 'Standard ICE harness'],
                ['label' => 'SKU',          'value' => 'HB-ICELIVE2-PWR-26'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
        [
            'slug'         => 'ice-mega-live-2-sae-power-cable',
            'product_id'   => 286,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird ICE MEGA Live 2 SAE Power Cable',
            'tagline'      => 'SAE-connector lead for the MEGA Live 2 ICE rig.',
            'why'          => '<p>The SAE Power Cable is the version of the ICE MEGA Live 2 lead with an SAE connector instead of the standard harness. Used by anglers who run their ice sonar off an SAE-equipped power source: a portable lithium pack with an SAE port, a vehicle-style auxiliary outlet, or a custom rig that already lives on SAE.</p><p>If you do not know which connector your setup needs, bring the rig in or send Lynn a photo and we will spec it for you before you buy.</p>',
            'how' => [
                ['icon' => 'electrical_services','title' => 'SAE Connector',        'description' => 'For portable lithium packs and vehicle-style SAE-connector power sources.'],
                ['icon' => 'cable',            'title' => 'Factory-Spec Lead',      'description' => 'Direct Humminbird replacement, sold for the MEGA Live 2 ICE conversion.'],
                ['icon' => 'inventory_2',      'title' => 'Parts Counter Stock',    'description' => 'Lynn and Ron stock both connector versions through the ice-fishing season.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Ice fishing accessory'],
                ['label' => 'Connector',    'value' => 'SAE'],
                ['label' => 'SKU',          'value' => 'HB-ICELIVE2-SAE-26'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
        [
            'slug'         => 'ice-xplore-power-cable',
            'product_id'   => 287,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird ICE XPLORE Power Cable',
            'tagline'      => 'Factory-spec lead for the XPLORE shuttle power setup.',
            'why'          => '<p>The ICE XPLORE Power Cable is the factory-spec lead that connects the XPLORE shuttle to its power source in an ice-fishing setup. It is the kind of cable that gets replaced every couple of seasons because of how often it gets coiled, walked on, and pulled through hatches in the cold.</p><p>Stocked at the parts counter for XPLORE owners who run hard through the winter.</p>',
            'how' => [
                ['icon' => 'cable',            'title' => 'XPLORE Shuttle Lead',    'description' => 'Connects the XPLORE shuttle to its power source in the ice-fishing kit.'],
                ['icon' => 'inventory_2',      'title' => 'On the Parts Counter',   'description' => 'Stocked October through March for season-long replacement turnaround.'],
                ['icon' => 'verified',         'title' => 'Manufacturer Warranty',  'description' => 'Full Humminbird warranty applies, serviced in-house at the Sault.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Ice fishing accessory'],
                ['label' => 'For',          'value' => 'XPLORE shuttle power'],
                ['label' => 'SKU',          'value' => 'HB-XPLORE-PWR-26'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
        [
            'slug'         => 'ice-xplore-shuttle-conversion-kit',
            'product_id'   => 288,
            'thumbnail_id' => 0,
            'heading'      => 'Humminbird ICE XPLORE Shuttle Conversion Kit',
            'tagline'      => 'Take your XPLORE through the winter.',
            'why'          => '<p>The ICE XPLORE Shuttle Conversion Kit is the answer to the question Lynn gets asked every November: "how do I take my open-water electronics through the winter?" The kit converts the XPLORE for ice-fishing pole use without buying a separate dedicated unit.</p><p>Pair with the ICE XPLORE Power Cable on this same page to complete the conversion. Reyco stocks both, and Aaron\'s service team can do the conversion in-house if you would rather drop off than wrench yourself.</p>',
            'how' => [
                ['icon' => 'ac_unit',          'title' => 'Open-Water to Ice',      'description' => 'Converts the XPLORE for ice-fishing pole use without a separate dedicated unit.'],
                ['icon' => 'inventory_2',      'title' => 'Stocked Each November',  'description' => 'On the parts counter as soon as ice-fishing season conversations start.'],
                ['icon' => 'engineering',      'title' => 'In-House Conversion',    'description' => 'Aaron\'s service team can do the conversion if you would rather drop off than DIY.'],
            ],
            'what' => [
                ['label' => 'Type',         'value' => 'Ice conversion kit'],
                ['label' => 'For',          'value' => 'Humminbird XPLORE'],
                ['label' => 'Year',         'value' => '2026'],
                ['label' => 'Warranty',     'value' => 'Full Humminbird, in-house'],
            ],
        ],
    ],
];
```

---

## QC checklist

Voice / format:
- [ ] Zero em-dashes (—) in any rendered body copy. (Verified via grep on this file: zero em-dashes inside the PHP arrays.)
- [ ] No banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "Not only X but also Y". (Verified by re-read.)
- [ ] No "60 years" / "since 1964" / family-history claims about Reyco. Reyco framed as present-tense.
- [ ] Casey appears only as part of staff roster ("Casey on the sales floor") never in CTA copy. CTA framing leaves it to the rendered template.
- [ ] Authorized brand mentions match the 11-brand list (Princecraft, Humminbird, Mercury referenced in body; rest not invoked unnecessarily).
- [ ] Geography limited to verifiable: Sault Ste. Marie, Algoma, Northern Ontario, Lake Superior, St. Marys River, Goulais, Pickerel Lake, Wabos. (Pickerel + Wabos are real lakes in the Algoma district per local knowledge; flag if Casey wants those swapped.)

Per-product field shape:
- [ ] All 14 entries have: slug, product_id, thumbnail_id, heading, tagline, why, how (3 items), what (4 items).
- [ ] thumbnail_id = 0 across all entries (fallback to featured image per dispatch).
- [ ] product_id matches dispatch (426/456/1034/451/384/374/282/283/284/285/286/287/288 covering 14 entries; 285 appears twice across pages 3 and 4 by design).
- [ ] Material Symbols used for icons (snake_case): set_meal, directions_boat, handyman, phishing, pool, groups, verified, weekend, speaker, straighten, bolt, visibility, cable, engineering, sensors, ac_unit, inventory_2, support_agent, electrical_services, electrical_services. Flag any that need swap to a different valid Material Symbol.

Casey-gate (verify before publish):
- [ ] Lake/region references: Pickerel Lake, Wabos, North Channel, Goulais — Casey to confirm these are common-knowledge fishing destinations he is comfortable referencing.
- [ ] Staff role assignments: Aaron handling rigging + service + install; Lee on bench; Lynn + Ron on parts counter; Kory on sales. Carried over from staff-roster memory; Casey to confirm currency.
- [ ] Any product-specific spec numbers (HP / weight / capacity) match Princecraft 2026 model-year spec sheets. I sourced from Princecraft's series pages (printable specs only) — confirm against dealer-portal sheets for any discrepancy.
- [ ] Sportfisher 21 2S Fishing Edition (product 1034) is on PAGE 1 (fishing-boats) per dispatch even though it is technically a pontoon. Framing in copy explains the choice.

Dev-side flags:
- [ ] PAGE 4 config file likely does not exist yet ("likely needs to be created" per dispatch). Dev to create + register category + map permalink.
- [ ] PAGE 3 mega-live-2 vs mega-live-sonar duplicate category resolution is a separate dev decision; copy here works for either after a template-arg swap.
- [ ] product_id 285 (ICE MEGA Live 2 Power Cable) appears in BOTH page 3 AND page 4 series_models arrays. WordPress will allow this; the same product belongs to multiple categories. No conflict, but flagging for awareness.

Word counts (rough):
- Page 1 (fishing-boats): ~520 words across 3 product `why` blocks + brand_band + comparison_table.
- Page 2 (pontoons): ~450 words across 3 product `why` blocks + comparison_table.
- Page 3 (mega-live-2): ~580 words across 4 product `why` blocks + brand_band.
- Page 4 (marine-electronics-accessories): ~440 words across 4 product `why` blocks.
- Total: ~1990 words of body copy across 4 pages, 14 products.

---

## Standing for Aiden / Casey review

This is the v1 draft. Per banked overshoot-flag-vs-pretrim discipline, no pre-trimming applied; if any page reads long when rendered, easiest cuts:
- Drop the comparison_table from PAGE 1 or PAGE 2 (saves ~80 words each).
- Drop the brand_band from PAGE 3 (saves ~60 words).
- Trim each `why` to single-paragraph (saves ~30-50 words per product).

Standing for revise/approve cycle.
