# Powersports Series Pages — 6 NEW configs (Aiden path-A backlog 2/3, launch-day re-do)

**6 NEW full configs** for the Powersports series-line pages. These replace the wrong-product_id / blank-template configs Aiden flagged on the megamenu. Same series-showcase template treatment as the powersports class pages (commits cfd9f8b + 40742d0) and the LG batch (commit eab81dd).

**For dev:** ready-to-paste PHP arrays for the series-showcase template. 6 NEW files at:
- `wp-content/themes/reyco-marine/inc/category-configs/powersports--strike.php`
- `wp-content/themes/reyco-marine/inc/category-configs/powersports--sector.php`
- `wp-content/themes/reyco-marine/inc/category-configs/powersports--mp9.php`
- `wp-content/themes/reyco-marine/inc/category-configs/powersports--stryker.php`
- `wp-content/themes/reyco-marine/inc/category-configs/powersports--atvs.php`
- `wp-content/themes/reyco-marine/inc/category-configs/powersports--hs-series.php`

**Source dispatch:** boss msg 1778091122771-boss-jw166 (Aiden path-A 11-page launch-day backlog). Plan-ACK in 1778091437553. Clarifications in 1778091499545 (full configs, no skips). LG batch ACK + go-ahead in 1778092665768.

**Voice / format constraints (carried forward):**
- Canadian English; plain language; NO em-dashes anywhere in PHP body. Both Unicode (U+2014) AND HTML entities (`&mdash;` / `&#8212;` / `&#x2014;`) checked.
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022. Present-tense framing only. NO founding-year claims.
- Casey owner-voice. NO "Talk to Casey" / "Call Casey" / "ask Casey" CTA copy. Casey alone OK in body copy. NO inline Casey quotes (Casey-gate active).
- **NO KORY ANYWHERE.** Kory departed Reyco 2026-05-06; must not appear in any new copy.
- 11-brand authorised list: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- Staff: Casey (sales floor), Aaron (co-owner / service manager — owns powersports-service), Lee / Damian / Cody (techs), Lynn / Ron (parts).

**SKU verification status (per banked working-process rule):**
All 14 unique product_ids in this deliverable are **boss-VERIFIED** via WP-CLI live inventory query (sourced from boss msg 1778090772491 + 1778091122771). Specs assertable in body copy at the tier level; detailed engineering numbers (HP, displacement, exact wheelbase, dry weight) deferred to content-polish since they are not in the dispatch.

| Series | SKU | product_id | Source |
|--------|-----|-----------|--------|
| Strike | Strike 250R | 214 | Boss-verified (msg 1778090772491) |
| Strike | Strike 550R | 215 | Boss-verified (msg 1778090772491) |
| Sector | Sector 250 | 237 | Boss-verified |
| Sector | Sector 550 EPS | 216 | Boss-verified |
| Sector | Sector 750 EPS | 238 | Boss-verified |
| Sector | Sector 750 Crew | 217 | Boss-verified |
| MP9 | MP9 550R | 219 | Boss-verified |
| MP9 | MP9 750R | 241 | Boss-verified |
| MP9 | MP9T400 | 242 | Boss-verified (cross-listed crew + atvs) |
| Stryker | Stryker 550X | 239 | Boss-verified (msg 1778091122771) |
| Stryker | Stryker 750X | 218 | Boss-verified (msg 1778091122771) |
| Stryker | Stryker 750 Crew | 240 | Boss-verified |
| ATVs / HS | HS 400 | 236 | Boss-verified |
| ATVs / HS | HS 500 | 220 | Boss-verified (msg 1778091122771) |
| ATVs | Forge 400i | 221 | Boss-verified (msg 1778091122771) |
| ATVs | Tactic | 235 | Boss-verified (msg 1778091122771) |
| ATVs | GUARDIAN | 234 | Boss-verified (msg 1778091122771) |

**Cross-listing strategy:** Some product_ids appear on more than one page (a vehicle can belong to both a series page AND its functional-class page). Confirmed cross-lists in this deliverable + prior:
- Strike 250R (214): /strike/ (this deliverable) + /sport/ (cfd9f8b) + /youth/ (cfd9f8b)
- Strike 550R (215): /strike/ + /sport/
- Sector 250 (237): /sector/ + /youth/
- Sector 550 EPS (216), Sector 750 EPS (238): /sector/ + /utility/
- Sector 750 Crew (217): /sector/ + /crew/
- MP9 550R (219), MP9 750R (241): /mp9/ + /utility/
- MP9T400 (242): /mp9/ + /crew/ + /atvs/
- Stryker 750 Crew (240): /stryker/ + /crew/
- HS 400 (236): /atvs/ + /hs-series/ + /youth/
- HS 500 (220): /atvs/ + /hs-series/

**Subcategories band shape:** all 6 pages use the static label strip pattern (`['label' => 'X']` only, no anchor/href) — boss msg 1778091499545 plumb-clean preference.

**Out of scope (per boss):** WC `product_category` taxonomy assignment fix is boss / dev plumb-side.

**Approval gate:** Aiden review before any wp-cli paste.

---

## PAGE 1 — powersports--strike.php (NEW PAGE, Strike series)

```php
<?php
/**
 * Category config: powersports -> strike
 * Frame: Hisun Strike sport-side-by-side series.
 * 2 anchors: Strike 250R (id 214) + Strike 550R (id 215). Both cross-listed with /sport/.
 */

return [
    'category_slug' => 'strike',
    'parent_slug'   => 'powersports',

    'hero' => [
        'title'    => 'Hisun Strike Series',
        'subtitle' => 'Sport side-by-sides. Two-seat layout, real safety architecture, sport-tuned suspension. Strike 250R and Strike 550R. Authorised Hisun dealer.',
        'cta'      => [
            'primary'   => ['label' => 'See the Strike lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',         'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'The Strike series: sport UTVs from Hisun',
        'body'  => '<p>The Hisun Strike series is the sport-side-by-side line we lead with on the powersports floor. Two-seat layout, real roll cage and harness mounts, and the kind of sport-tuned suspension and turn-in feel that separates a true sport UTV from a utility unit dressed up to look sporty. Two trims: the Strike 250R is the entry-tier (right unit for younger riders, smaller-frame adults, or the customer stepping up from an ATV) and the Strike 550R is the mid-tier (more power, taller stance, longer travel, the unit most adult sport buyers go home with).</p><p>Both trims are sport-class first. Cargo bed is small or absent (these are not work units), suspension travel is tuned for trail running, and the ride feel is built for trail riding and weekend recreation. If you need utility capability, the Sector or MP9 lines on the other side of the floor are the answer. Strike is the play machine.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the Strike-vs-Sector-vs-MP9 question (the right Hisun depends on whether you are riding for fun, working for property maintenance, or some mix of both). Aaron owns the powersports-service side and the techs (Lee, Damian, Cody) handle trail-prep, break-in, and warranty. Lynn and Ron at the parts counter stock Hisun consumables (filters, plugs, oil, tires, common wear parts) for the Strike line.</p>',
    ],

    'subcategories' => [
        ['label' => 'Strike'],
        ['label' => 'Sector'],
        ['label' => 'MP9'],
        ['label' => 'Stryker'],
        ['label' => 'ATVs'],
        ['label' => 'HS Series'],
    ],

    'series_models' => [
        [
            'slug'         => 'hisun-strike-250r-series',
            'product_id'   => 214,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Strike 250R Sport Side-by-Side',
            'tagline'      => 'Entry-tier sport UTV. Right unit for stepping up from an ATV or for a smaller-frame adult rider.',
            'why'          => '<p>The Strike 250R is the entry into the Hisun sport line. Two-seat side-by-side, sport-tuned suspension, and the size and power that suits a younger rider stepping up from a kids-spec ATV or a smaller-frame adult who wants the sport-UTV experience without the cost or footprint of the bigger Strike 550R. Real roll cage, real harness mounts, the same in-house Reyco trail-prep we do on every powersports unit before it leaves the floor.</p><p>Sized for trail riding on the back-country roads and the local cottage trail networks. Not the right unit for serious dune work or a heavy-load weekend with two adult riders gear-loaded; that is a Strike 550R conversation. Right size for the use case it was built for.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'Sport-tuned',          'description' => 'Sport-side-by-side suspension and turn-in feel. Not a utility unit dressed up to look sporty.'],
                ['icon' => 'shield',         'title' => 'Real safety cage',     'description' => 'Roll cage, harness mounts, the safety architecture for trail riding.'],
                ['icon' => 'engineering',    'title' => 'In-house trail-prep',  'description' => 'Aaron and the techs do break-in, fluid checks and warranty.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Strike (entry sport)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Younger riders, smaller-frame adults, trail recreation'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-strike-550r-series',
            'product_id'   => 215,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Strike 550R Sport Side-by-Side',
            'tagline'      => 'Mid-tier sport UTV. The unit most of our adult sport-buyers actually take home.',
            'why'          => '<p>The Strike 550R is the mid-tier sport in the Hisun lineup and the unit most of our adult sport buyers go home with. More power, taller stance, longer travel suspension than the 250R, and the kind of presence on the trail that separates the sport class from the utility lineup. Two-seat layout, real harness mounts, full roll cage, the safety architecture that makes a sport UTV a sport UTV.</p><p>Right unit for the customer doing real trail riding, weekend cottage runs with another adult rider, and the occasional dune or open-area session. Not a work unit; if you need to haul gear, run a plow or a winch on a regular basis, the Sector utility line is the answer. The Strike 550R is the play-side machine.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'More power, more travel','description' => 'Mid-tier sport feel. Longer suspension travel for real trail work.'],
                ['icon' => 'group',          'title' => 'Two-up sport',           'description' => 'Two-seat layout for adult riders. Real harness mounts.'],
                ['icon' => 'engineering',    'title' => 'Trail-prepped in-house', 'description' => 'Same in-house break-in and warranty as the rest of the Hisun lineup.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Strike (mid sport)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Adult sport riders, weekend trails, cottage recreation'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Hisun',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Hisun dealer. Strike sport line, plus full Sector utility, MP9 hauler, Stryker crew-cab, ATV and HS-series lineup.',
        'body'     => '<p>Hisun is the powersports brand we lead with at the shop. Authorised dealer status means factory-direct pricing, genuine parts at our parts counter, and full manufacturer warranty handled in-house. The Strike series sits in the sport-class lane; the rest of the Hisun lineup covers utility, crew-cab and single-rider ATVs.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right Strike for the rider',
        'columns' => ['Model',           'Tier',                  'Seats', 'Best for'],
        'rows'    => [
            ['Strike 250R',              'Entry sport',            '2',     'Younger riders, smaller-frame adults, trail recreation'],
            ['Strike 550R',              'Mid sport',              '2',     'Adult sport riders, weekend trails, cottage runs'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Strike 250R or Strike 550R?',
            'a' => 'The 250R is the entry into the Strike line: smaller engine, smaller footprint, right size for younger riders or smaller-frame adults. The 550R is the mid-tier: more power, longer travel, the unit most adult sport buyers actually take home. We talk through rider size and use case on the floor.',
        ],
        [
            'q' => 'Is the Strike a work unit?',
            'a' => 'No. The Strike series is sport-class. Suspension, ride feel and ground clearance are tuned for trail riding and recreation. Cargo capacity is minimal. If you need utility (cargo bed, hitch, plow-ready) the Sector or MP9 lines are the answer.',
        ],
        [
            'q' => 'Do you do trail-prep and warranty?',
            'a' => 'Yes. Aaron and the techs do the trail-prep on every Strike before it leaves the floor: fluid check, fastener torque, pre-delivery inspection, break-in instructions. Warranty is in-house too.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at a Strike on the floor?',
        'body'      => '<p>Drop in and walk the Strike lineup, or give us a call and we can talk through the 250R-vs-550R fit and the sport-vs-utility question.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the Sport class page', 'href' => '/powersports/sport/'],
    ],
];
```

---

## PAGE 2 — powersports--sector.php (NEW PAGE, Sector series)

```php
<?php
/**
 * Category config: powersports -> sector
 * Frame: Hisun Sector utility-side-by-side series, including crew-cab variant.
 * 4 anchors: Sector 250 (id 237) + Sector 550 EPS (id 216) + Sector 750 EPS (id 238) + Sector 750 Crew (id 217).
 */

return [
    'category_slug' => 'sector',
    'parent_slug'   => 'powersports',

    'hero' => [
        'title'    => 'Hisun Sector Series',
        'subtitle' => 'Utility side-by-sides. Cargo bed, hitch, plow-ready, EPS power steering. From Sector 250 smaller-class to Sector 750 Crew. Authorised Hisun dealer.',
        'cta'      => [
            'primary'   => ['label' => 'See the Sector lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',         'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'The Sector series: utility UTVs from Hisun',
        'body'  => '<p>The Hisun Sector series is the mainstream utility-side-by-side line. Cargo bed, hitch receiver, plow-ready front mounts, and on the EPS-trim units, electric power steering for low-speed work (a real difference when you are plowing or maneuvering with a load). Four trims on the floor: the Sector 250 is the smaller-class entry, the Sector 550 EPS is the mid-tier mainstream pick, the Sector 750 EPS is the larger heavier-duty unit, and the Sector 750 Crew is the four-seat crew-cab variant for family or work-crew use.</p><p>Sector is the workhorse line. Property maintenance, plow runs, hauling firewood, towing trailers around the lot: this is the Hisun unit family built for it. If you want a sportier ride feel with utility capability, the MP9 R-spec line splits the difference. Pure sport is the Strike line.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the use-case match (Sector vs MP9, 550 vs 750, EPS vs non-EPS, two-seat vs crew). Aaron owns the powersports-service side and the techs handle plow-prep, hitch fitment, accessory install and warranty. Lynn and Ron at the parts counter stock Hisun consumables and the common Sector accessory parts (plow blades, winches, replacement tires).</p>',
    ],

    'subcategories' => [
        ['label' => 'Strike'],
        ['label' => 'Sector'],
        ['label' => 'MP9'],
        ['label' => 'Stryker'],
        ['label' => 'ATVs'],
        ['label' => 'HS Series'],
    ],

    'series_models' => [
        [
            'slug'         => 'hisun-sector-250-series',
            'product_id'   => 237,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Sector 250 Utility Side-by-Side',
            'tagline'      => 'Smaller-class utility UTV. Property work scaled to a smaller rider or smaller footprint.',
            'why'          => '<p>The Sector 250 is the smaller-class utility unit in the Sector series. Cargo bed, hitch capability, real two-seat layout, scaled to a smaller engine and smaller footprint than the 550 / 750 Sectors. Right unit for a smaller-frame rider doing real property work, a cottage with limited storage or trailer space, or a beginner rider building up to a bigger utility platform later.</p><p>Genuine utility capability at a smaller class, not a toy. Cargo bed will haul firewood, the hitch will tow a small trailer, and the scaled engine handles property maintenance for the kind of cottage lot or small property where a 750 is overkill.</p>',
            'how'          => [
                ['icon' => 'agriculture',    'title' => 'Real utility, smaller', 'description' => 'Cargo bed, hitch, real work capability at a smaller class.'],
                ['icon' => 'savings',        'title' => 'Accessible utility',    'description' => 'Lower entry into the Hisun utility line.'],
                ['icon' => 'engineering',    'title' => 'In-house support',      'description' => 'Aaron and the techs do prep and warranty.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Sector (smaller-class)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Smaller property, smaller rider, beginner utility'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-sector-550-eps-series',
            'product_id'   => 216,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Sector 550 EPS Utility Side-by-Side',
            'tagline'      => 'Mid-tier utility UTV with electric power steering. Right unit for property work and lighter hauling.',
            'why'          => '<p>The Sector 550 EPS is the mainstream Hisun utility unit. Mid-tier engine, electric power steering for low-speed work, a real cargo bed, and hitch and plow front mounts factory-ready. Right unit for property maintenance, cottage trail running with gear in the back, lighter winter plow work, and the kind of weekend errand-running where you need the bed.</p><p>EPS is the headline feature. Without it, low-speed steering with a plow or a load is a workout. With it, you can plow a driveway one-handed if you needed to. The 550-tier engine is the right power for most property-maintenance use; if you are running heavier loads or longer plow runs, step up to the Sector 750 EPS.</p>',
            'how'          => [
                ['icon' => 'agriculture',    'title' => 'Property work-ready',  'description' => 'Cargo bed, hitch receiver, plow-front mounts. Built for utility work.'],
                ['icon' => 'tune',           'title' => 'Electric power steering','description' => 'EPS for low-speed work. Real difference under load and with a plow.'],
                ['icon' => 'engineering',    'title' => 'Plow-prep in-house',   'description' => 'Aaron and the techs do plow fitment and break-in on every utility we sell.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Sector (mid, EPS)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Property maintenance, lighter plow work, cottage hauling'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-sector-750-eps-series',
            'product_id'   => 238,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Sector 750 EPS Utility Side-by-Side',
            'tagline'      => 'Larger Sector with EPS. Right unit for heavier loads and longer plow runs.',
            'why'          => '<p>The Sector 750 EPS is the larger Sector. Same EPS power-steering, same hitch and plow-mount-ready architecture, more engine for heavier loads and longer running times. Right unit for the customer plowing a real driveway (not a city pad), hauling a half-cord of firewood at a time, or working a property with longer trail runs that ask more from the powertrain.</p><p>The other reason customers step from the 550 to the 750: longer high-RPM running. If your work session is two hours not twenty minutes, the bigger engine runs cooler under load and lasts longer between rebuilds. EPS is the same on both; the engine is the upgrade.</p>',
            'how'          => [
                ['icon' => 'agriculture',    'title' => 'Heavier-duty utility',  'description' => 'Real driveway plow, half-cord hauls, longer property runs.'],
                ['icon' => 'tune',           'title' => 'Same EPS architecture', 'description' => 'Electric power steering. Low-speed work without the workout.'],
                ['icon' => 'engineering',    'title' => 'Sustained-load tune',   'description' => 'Engine runs cooler under sustained work. Longer service intervals.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Sector (larger, EPS)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Real plow runs, heavier hauling, longer work sessions'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-sector-750-crew-series',
            'product_id'   => 217,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Sector 750 Crew Utility Side-by-Side',
            'tagline'      => 'Four-seat utility crew-cab. The Sector for the work crew or family utility runs.',
            'why'          => '<p>The Sector 750 Crew is the utility-leaning crew-cab. Same Sector 750 utility architecture (cargo bed, hitch, plow-ready, EPS) stretched to a four-seat layout. Right unit for a work crew (you plus three of the team), property work where you need to bring more hands, or a family that does light utility runs together (firewood, gear, the kids in the back two seats).</p><p>The cargo bed is shorter than the two-seat Sector 750 (the rear seats take some bed length), but it is still a real cargo bed. Plow-ready front, hitch receiver rear, EPS for low-speed work. Same in-house plow-prep and warranty.</p>',
            'how'          => [
                ['icon' => 'group',          'title' => 'Four-seat crew',        'description' => 'Two front, two rear, real harness mounts. Family or work crew.'],
                ['icon' => 'agriculture',    'title' => 'Utility-class capability','description' => 'Cargo bed, hitch, plow-ready. Same Sector architecture stretched.'],
                ['icon' => 'engineering',    'title' => 'In-house plow-prep',    'description' => 'Aaron and the techs do plow fitment, accessory install, warranty.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Sector (crew)'],
                ['label' => 'Seats',       'value' => '4'],
                ['label' => 'Best for',    'value' => 'Work crews, family utility runs, four-person property work'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Hisun',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Hisun dealer. Sector utility line across smaller-class, mid-tier EPS, larger EPS, and crew-cab.',
        'body'     => '<p>Hisun is the powersports brand we lead with. Sector is the workhorse line in the Hisun lineup; we stock the common accessories (plow blades, winches, replacement tires) at the parts counter and do the install on every Sector we sell.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right Sector for the work',
        'columns' => ['Model',          'Tier',          'Seats', 'Best for'],
        'rows'    => [
            ['Sector 250',              'Smaller-class', '2',     'Smaller property, smaller rider, accessible utility'],
            ['Sector 550 EPS',          'Mid (EPS)',     '2',     'Property maintenance, lighter plow, cottage hauling'],
            ['Sector 750 EPS',          'Large (EPS)',   '2',     'Real plow runs, heavier loads, longer sessions'],
            ['Sector 750 Crew',         'Crew-cab',      '4',     'Work crews, family utility, four-person property work'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Which Sector is right for my property?',
            'a' => 'Two questions usually answer it: how much do you actually plow / haul, and do you have four people who ride together? The 550 EPS is the right pick for most homeowner property work. The 750 EPS is for heavier loads or longer sessions. The 250 is for a smaller-frame rider or a tighter-storage situation. The 750 Crew is for four-person crew or family use.',
        ],
        [
            'q' => 'Do all Sectors have power steering?',
            'a' => 'The EPS-trim Sectors (550 EPS, 750 EPS, 750 Crew) come with factory electric power steering. The Sector 250 trim depends on the unit; we will confirm EPS status on the unit you are looking at on the floor.',
        ],
        [
            'q' => 'Can you set up a plow on a Sector?',
            'a' => 'Yes. All Sector units have plow-ready front mounts. Aaron and the techs handle plow blade fitment, electrical, and the plow-side accessory wiring at the shop. We stock common plow blades and winches at the parts counter.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to spec a Sector for your property?',
        'body'      => '<p>Drop in and look at the Sector lineup, or give us a call and we can work through the trim match for the kind of property work you are doing.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the Utility class page', 'href' => '/powersports/utility/'],
    ],
];
```

---

## PAGE 3 — powersports--mp9.php (NEW PAGE, MP9 series)

```php
<?php
/**
 * Category config: powersports -> mp9
 * Frame: Hisun MP9 hauler-line series, R-spec sport-utility tune.
 * 3 anchors: MP9 550R (id 219) + MP9 750R (id 241) + MP9T400 (id 242, smaller-class crew variant).
 */

return [
    'category_slug' => 'mp9',
    'parent_slug'   => 'powersports',

    'hero' => [
        'title'    => 'Hisun MP9 Series',
        'subtitle' => 'Utility-class side-by-sides with R-spec sport tuning. The hauler line for customers who want utility capability without giving up trail feel.',
        'cta'      => [
            'primary'   => ['label' => 'See the MP9 lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',     'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'The MP9 series: utility with sportier sit and feel',
        'body'  => '<p>The Hisun MP9 series is the hauler-leaning line in the powersports lineup. Same utility-class architecture as the Sector (cargo bed, hitch, plow-ready), but tuned with a sportier sit and feel for the customer who wants a utility unit that does not feel like a tractor on the trail. The R designation is the sportier-tuned variant; both the 550R and 750R are R-spec.</p><p>Three trims at the shop: MP9 550R is the mid-tier hauler (utility power with sport feel), MP9 750R is the heavier-duty hauler (more engine for sustained work, same R-spec sport tune), and MP9T400 is the smaller-class crew variant (four-seat crew-cab in a tighter footprint than the 750-class Sector Crew or Stryker Crew). Right family for the customer who is split between sport and utility, or who wants the family-crew option without the bigger crew-cab footprint.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the MP9-vs-Sector question (it usually comes down to how often you actually ride trails vs how often you do property work). Aaron owns the powersports-service side and the techs handle plow-prep, hitch fitment, accessory install and warranty. Lynn and Ron at the parts counter stock Hisun consumables and the common MP9 wear parts.</p>',
    ],

    'subcategories' => [
        ['label' => 'Strike'],
        ['label' => 'Sector'],
        ['label' => 'MP9'],
        ['label' => 'Stryker'],
        ['label' => 'ATVs'],
        ['label' => 'HS Series'],
    ],

    'series_models' => [
        [
            'slug'         => 'hisun-mp9-550r-series',
            'product_id'   => 219,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun MP9 550R Utility Side-by-Side',
            'tagline'      => 'MP9 mid-tier hauler. Utility power with a sportier sit and feel.',
            'why'          => '<p>The MP9 550R is the hauler-line entry. Same utility-class capability as the Sector 550 EPS (cargo bed, hitch, plow-ready), tuned with a sportier sit and feel for the customer who wants a utility unit that does not feel like a tractor on the trail. The R designation is the sportier-tuned variant in the MP9 line.</p><p>Right unit for the customer split between sport and utility. You are doing real work most of the time but you are also riding trails on the weekend, and you do not want to give up the spirited feel of a sport UTV when you are not working. The 550R splits the difference better than a Sector or a Strike does on its own.</p>',
            'how'          => [
                ['icon' => 'agriculture',    'title' => 'Utility-class capability','description' => 'Cargo bed, hitch, plow-mount, towing. Same work-ready architecture as Sector.'],
                ['icon' => 'speed',          'title' => 'Sportier-tuned',         'description' => 'R-spec sit and feel. Trail-friendly when the work is done.'],
                ['icon' => 'engineering',    'title' => 'Same in-house support',  'description' => 'Aaron and the techs handle prep, fitment and warranty.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'MP9 (mid, R-spec)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Work-and-trail customers, sportier utility feel'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-mp9-750r-series',
            'product_id'   => 241,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun MP9 750R Utility Side-by-Side',
            'tagline'      => 'Bigger MP9 with R-spec sport tuning. Heavier-duty work with sportier feel.',
            'why'          => '<p>The MP9 750R is the bigger MP9. More engine for heavier work, same R-spec sportier tuning. Right unit for the customer who needs Sector 750 utility capability but wants the MP9 feel on the trail. Heavier loads, longer running times, and a sit-and-feel that does not give up the trail recreation side.</p><p>The most-versatile single utility pick in the Hisun lineup if you cannot decide between Sector and MP9 and you actually do both. We talk through the use-case split on the floor; the answer is usually clearer than people expect once you walk through how often you actually plow versus how often you ride.</p>',
            'how'          => [
                ['icon' => 'agriculture',    'title' => 'Larger MP9 utility',    'description' => 'Bigger engine, longer running times, heavier work tolerance.'],
                ['icon' => 'speed',          'title' => 'R-spec sport tune',      'description' => 'Same sportier sit and feel as the 550R. Trail-friendly.'],
                ['icon' => 'engineering',    'title' => 'In-house service',      'description' => 'Same trail-prep, plow-fitment and warranty in-house.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'MP9 (large, R-spec)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Heavier work, longer running, sportier feel'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-mp9t400-series',
            'product_id'   => 242,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun MP9T400 Smaller-Class Crew Side-by-Side',
            'tagline'      => 'Smaller-class crew. The MP9 four-seater for tighter footprint or accessible crew-cab pricing.',
            'why'          => '<p>The MP9T400 is the smaller-class crew-cab variant in the MP9 family. Four-seat layout in a tighter footprint than the 750-class Sector Crew or Stryker Crew. Right unit for the customer who wants four-seat capability without the full size and cost of the bigger crew-cabs, or for the property where storage and trailer space are at a premium.</p><p>Smaller engine, smaller unit, lighter on the trail. Not the right unit for heavy hauling or long sustained-load work, but a real four-seater for family or crew use at a more accessible price and footprint. Cross-listed on the Crew class page and the ATV class page (the smaller MP9 chassis fits in both conversations depending on how you frame the use case).</p>',
            'how'          => [
                ['icon' => 'group',          'title' => 'Four-seat in tighter pkg','description' => 'Real crew-cab in a smaller, lighter footprint than 750-class crew.'],
                ['icon' => 'savings',        'title' => 'Accessible crew price',  'description' => 'Lower entry into the MP9 crew-cab class.'],
                ['icon' => 'engineering',    'title' => 'Same in-house support',  'description' => 'Aaron and the techs handle prep and warranty.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'MP9 (smaller-class crew)'],
                ['label' => 'Seats',       'value' => '4'],
                ['label' => 'Best for',    'value' => 'Tighter storage, accessible crew option, lighter use'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Hisun',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Hisun dealer. MP9 hauler line: 550R, 750R, and the MP9T400 smaller-class crew.',
        'body'     => '<p>Hisun is the powersports brand we lead with. The MP9 series is the R-spec hauler line in the Hisun lineup; same utility architecture as the Sector with sportier ride feel. Full in-house service from Aaron and the techs.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right MP9 for the use case',
        'columns' => ['Model',          'Tier',                'Seats', 'Best for'],
        'rows'    => [
            ['MP9 550R',                'Mid hauler (R-spec)',  '2',     'Work-and-trail customers, sportier utility feel'],
            ['MP9 750R',                'Larger hauler (R-spec)','2',    'Heavier work, longer running, sportier feel'],
            ['MP9T400',                 'Smaller-class crew',   '4',     'Tighter storage, accessible crew option, lighter use'],
        ],
    ],

    'faq' => [
        [
            'q' => 'MP9 or Sector?',
            'a' => 'Sector is the mainstream utility line (workhorse tune, EPS power steering). MP9 is the same utility capability with a sportier sit and feel. If you mostly do work and the sit feel is not a big deal, Sector. If you want a utility unit that feels lively on the trail when you are not working, MP9 R-spec.',
        ],
        [
            'q' => 'What is the MP9T400 versus the bigger MP9 crew?',
            'a' => 'There is no "bigger MP9 crew" trim in the lineup right now. MP9T400 is the crew variant in the MP9 line. Smaller-class crew, four-seat layout, tighter footprint than the 750-class Sector Crew or Stryker Crew. Right pick for accessible crew pricing or tighter storage.',
        ],
        [
            'q' => 'Do all MP9s have EPS?',
            'a' => 'The R-spec trims depend on the trim. We will confirm EPS status on the unit you are looking at on the floor. The Sector 550 EPS / 750 EPS / 750 Crew EPS-trims have factory electric power steering as standard.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at an MP9 on the floor?',
        'body'      => '<p>Drop in and walk the MP9 lineup, or give us a call and we can work through the work-vs-trail use-case fit.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'Compare with Sector',      'href' => '/powersports/sector/'],
    ],
];
```

---

## PAGE 4 — powersports--stryker.php (NEW PAGE, Stryker series)

```php
<?php
/**
 * Category config: powersports -> stryker
 * Frame: Hisun Stryker sport-utility crew series.
 * 3 anchors: Stryker 550X (id 239) + Stryker 750X (id 218) + Stryker 750 Crew (id 240).
 */

return [
    'category_slug' => 'stryker',
    'parent_slug'   => 'powersports',

    'hero' => [
        'title'    => 'Hisun Stryker Series',
        'subtitle' => 'Sport-utility side-by-sides. Longer travel, sportier turn-in, real utility capability. From two-seat 550X to four-seat 750 Crew.',
        'cta'      => [
            'primary'   => ['label' => 'See the Stryker lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',          'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'The Stryker series: sport-utility from Hisun',
        'body'  => '<p>The Hisun Stryker series is the sport-utility-leaning line in the powersports lineup. Longer travel suspension, sportier turn-in than the Sector workhorse, but with real utility capability still on the table (cargo bed, hitch, plow-mount-capable depending on trim). Right family for the customer who rides trails on the weekend and does property work some of the time, but where the trail recreation is the bigger half of the use case.</p><p>Three trims at the shop: Stryker 550X is the entry-tier sport-utility, Stryker 750X is the mid-tier with more engine for heavier-duty mixed use, and Stryker 750 Crew is the four-seat sport-utility crew-cab for family trail riding or weekend recreation crew. The X designation is the sport-utility tune; both 550X and 750X share the family DNA.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the Stryker-vs-Sector-vs-MP9 question (sport-utility lane vs workhorse-utility lane vs sportier-utility lane). Aaron owns the powersports-service side and the techs handle trail-prep, accessory install and warranty. Lynn and Ron at the parts counter stock Hisun consumables and the common Stryker accessory parts.</p>',
    ],

    'subcategories' => [
        ['label' => 'Strike'],
        ['label' => 'Sector'],
        ['label' => 'MP9'],
        ['label' => 'Stryker'],
        ['label' => 'ATVs'],
        ['label' => 'HS Series'],
    ],

    'series_models' => [
        [
            'slug'         => 'hisun-stryker-550x-series',
            'product_id'   => 239,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Stryker 550X Sport-Utility Side-by-Side',
            'tagline'      => 'Entry-tier sport-utility. Two-seat layout with longer travel and sportier feel than the Sector workhorse.',
            'why'          => '<p>The Stryker 550X is the entry-tier sport-utility in the Stryker series. Two-seat layout, longer travel suspension and sportier turn-in than the Sector EPS line, but with real utility capability still on the table. Right unit for the customer who is splitting time between trail recreation and lighter property work, where the trail side is the more important half of the use case.</p><p>Cargo bed, hitch capability, plow-mount-capable depending on trim. Not the workhorse the Sector is, and not the pure sport unit the Strike is, but a genuine sport-utility middle ground. The 550X is the right entry into the Stryker family for most customers who want the sport-utility lane without the bigger 750X engine.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'Sport-utility tune',     'description' => 'Longer travel, sportier turn-in. Trail recreation friendly.'],
                ['icon' => 'agriculture',    'title' => 'Utility on the table',   'description' => 'Cargo bed, hitch, real utility capability.'],
                ['icon' => 'engineering',    'title' => 'In-house support',       'description' => 'Same trail-prep, accessory install and warranty in-house.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Stryker (entry sport-utility)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Sport-utility customers, trail recreation-first, light property work'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-stryker-750x-series',
            'product_id'   => 218,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Stryker 750X Sport-Utility Side-by-Side',
            'tagline'      => 'Mid-tier sport-utility. More engine for heavier-duty mixed use. Same X-spec sport-utility tune.',
            'why'          => '<p>The Stryker 750X is the mid-tier sport-utility in the series. More engine than the 550X for heavier-duty mixed use (heavier loads when the work side comes up, longer high-RPM running on trail, more headroom under load). Same X-spec sport-utility tune (longer travel, sportier turn-in than the Sector). Right unit for the customer who wants the sport-utility lane with the engine to handle real property work when needed.</p><p>The 550X-vs-750X decision is mostly about how heavy your work side is. If you are running real plow sessions or hauling significant loads in addition to the trail recreation, the 750X earns the upgrade. If your work side is lighter and the trail side dominates, the 550X is the right pick.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'More engine',           'description' => 'Mid-tier sport-utility power. Heavier-duty mixed use ready.'],
                ['icon' => 'agriculture',    'title' => 'Utility-capable',       'description' => 'Same X-spec sport-utility tune as the 550X with more headroom under load.'],
                ['icon' => 'engineering',    'title' => 'In-house service',       'description' => 'Aaron and the techs handle the powersports-service side.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Stryker (mid sport-utility)'],
                ['label' => 'Seats',       'value' => '2'],
                ['label' => 'Best for',    'value' => 'Heavier mixed work-and-trail use, larger property + recreation'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-stryker-750-crew-series',
            'product_id'   => 240,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Stryker 750 Crew Sport-Utility Side-by-Side',
            'tagline'      => 'Sport-utility four-seater. Family trail riding without giving up the sport feel.',
            'why'          => '<p>The Stryker 750 Crew is the sport-utility crew-cab. Four-seat layout for the family or the riding crew, but tuned closer to the sport side than the Sector Crew. Longer travel, sportier turn-in, the kind of feel that makes trail riding with the family actually fun for the driver, not just a slower version of a utility ride.</p><p>It still has utility capability (cargo bed, hitch, plow-mount-capable depending on trim), but the tune is the sport-utility middle ground. Right unit for the family that rides trails on the weekend and uses the unit for property work some of the time, where the trail recreation is the bigger half of the use case.</p>',
            'how'          => [
                ['icon' => 'group',          'title' => 'Four-seat sport-utility','description' => 'Family-capable, sportier feel than the Sector Crew.'],
                ['icon' => 'speed',          'title' => 'Sport-utility tune',     'description' => 'Longer travel, sportier turn-in. Trail recreation friendly.'],
                ['icon' => 'engineering',    'title' => 'In-house support',       'description' => 'Same prep, warranty and parts ecosystem.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'Stryker (crew sport-utility)'],
                ['label' => 'Seats',       'value' => '4'],
                ['label' => 'Best for',    'value' => 'Family trail riding, weekend recreation crew, light utility'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Hisun',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Hisun dealer. Stryker sport-utility line: 550X two-seat, 750X two-seat, and 750 Crew four-seat.',
        'body'     => '<p>Hisun is the powersports brand we lead with. Stryker is the sport-utility lane in the lineup; longer travel, sportier turn-in, with real utility on the table. Full in-house service from Aaron and the techs.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right Stryker for the rider',
        'columns' => ['Model',           'Tier',                       'Seats', 'Best for'],
        'rows'    => [
            ['Stryker 550X',             'Entry sport-utility',         '2',     'Sport-utility customers, trail-recreation-first'],
            ['Stryker 750X',             'Mid sport-utility',           '2',     'Heavier mixed use, larger property + recreation'],
            ['Stryker 750 Crew',         'Crew sport-utility',          '4',     'Family trail riding, weekend recreation crew'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Stryker or Sector?',
            'a' => 'Sector is the workhorse-utility line (cargo-bed-first, EPS for low-speed work, mostly work-tuned). Stryker is sport-utility (longer travel, sportier turn-in, with utility capability still on the table). If your use is mostly work, Sector. If your use is trail-recreation with property work on the side, Stryker.',
        ],
        [
            'q' => 'Stryker 550X or 750X?',
            'a' => 'Mostly an engine-and-load decision. The 550X is the entry-tier and right for lighter mixed use. The 750X has more engine for heavier work and longer high-RPM running. If you are running real plow sessions or significant hauling alongside the trail recreation, the 750X earns the upgrade.',
        ],
        [
            'q' => 'Is the Stryker 750 Crew family-friendly?',
            'a' => 'Yes, that is its main use case. Four-seat layout with real harness mounts, sport-utility tune so trail riding stays fun for the driver, and utility capability on the table for the cottage / property work side. Right unit for the family that rides trails together on the weekend.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at a Stryker on the floor?',
        'body'      => '<p>Drop in and walk the Stryker lineup, or give us a call and we can work through the sport-utility-vs-pure-utility question.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'Compare with Sector',      'href' => '/powersports/sector/'],
    ],
];
```

---

## PAGE 5 — powersports--atvs.php (NEW PAGE, ATV class — single-rider four-wheel)

```php
<?php
/**
 * Category config: powersports -> atvs
 * Frame: Single-rider four-wheel ATV class. Hisun ATV lineup across HS-series, Forge, Tactic and GUARDIAN.
 * 6 anchors: HS 400 (id 236) + HS 500 (id 220) + Forge 400i (id 221) + Tactic (id 235) + GUARDIAN (id 234) + MP9T400 (id 242, cross-listed crew + atvs).
 */

return [
    'category_slug' => 'atvs',
    'parent_slug'   => 'powersports',

    'hero' => [
        'title'    => 'ATVs (Single-Rider Four-Wheel)',
        'subtitle' => 'Hisun ATV lineup. Single-rider four-wheel quads across HS-series, Forge, Tactic, GUARDIAN. Plus the MP9T400 smaller-class crew variant for customers who want four-seat capability.',
        'cta'      => [
            'primary'   => ['label' => 'See the ATV lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',     'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'ATVs for trail riding, property work and tighter trail capability',
        'body'  => '<p>ATVs are single-rider four-wheel quads. Different from a side-by-side: you sit ON the unit instead of IN it, you steer with handlebars, and you use body input to corner. No roll cage, no harness, helmet absolutely required. The trade-off versus a side-by-side is safety architecture (less of it on an ATV) but the trade-up is tighter trail capability (smaller footprint, more direct ride feel, and access to trails a UTV cannot fit on).</p><p>Hisun is the brand we lead with on ATVs. Authorised dealer status, full lineup across the HS series (HS 400, HS 500), the Forge 400i (utility-leaning ATV), the Tactic and the GUARDIAN. We also list the MP9T400 here as a cross-reference for customers who came in looking for an ATV but might be better served by a smaller-class crew side-by-side instead.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the ATV-vs-side-by-side conversation (different ride feel, different safety architecture, different use cases; we walk through it on the floor). Aaron owns the powersports-service side and the techs handle break-in, suspension setup, accessory install and warranty. Lynn and Ron at the parts counter stock Hisun ATV consumables, helmets, and basic safety gear.</p>',
    ],

    'subcategories' => [
        ['label' => 'Strike'],
        ['label' => 'Sector'],
        ['label' => 'MP9'],
        ['label' => 'Stryker'],
        ['label' => 'ATVs'],
        ['label' => 'HS Series'],
    ],

    'series_models' => [
        [
            'slug'         => 'hisun-hs-400-atv-class',
            'product_id'   => 236,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun HS 400 ATV',
            'tagline'      => 'Mid-class single-rider ATV. The HS-series entry into the Hisun ATV lineup.',
            'why'          => '<p>The HS 400 is the mid-class single-rider ATV in the Hisun lineup. Four-wheel quad with a 400-class engine, sized for trail recreation and lighter property work. Right unit for the experienced ATV rider who wants a real Hisun unit at an accessible class. Helmet absolutely required (no roll cage on any ATV); harness is not applicable to single-rider quads.</p><p>The HS 400 is a 400-class quad which is generally an experienced-rider unit, not a youth-spec ATV. For a younger rider new to four-wheels, the Strike 250R side-by-side is usually a better fit because of the safety architecture (roll cage, harness). We talk through rider experience on the floor.</p>',
            'how'          => [
                ['icon' => 'two_wheeler',    'title' => 'Single-rider ATV',     'description' => 'Four-wheel single-rider quad. Different ride feel than a side-by-side.'],
                ['icon' => 'terrain',        'title' => 'Mid-class capability', 'description' => '400-class engine for trail recreation and lighter property work.'],
                ['icon' => 'shield',         'title' => 'Helmet required',      'description' => 'No roll cage on an ATV. Safety gear is non-negotiable.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'ATV (mid-class single-rider, HS-series)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Experienced ATV riders, trail recreation, lighter property work'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-hs-500-atv-class',
            'product_id'   => 220,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun HS 500 ATV',
            'tagline'      => 'Larger HS-series ATV. Bigger engine for heavier-duty single-rider use.',
            'why'          => '<p>The HS 500 is the larger HS-series ATV. Same single-rider quad architecture as the HS 400 with more engine for heavier-duty use: heavier loads on a rear rack, longer trail running times, more headroom under sustained work. Right unit for the experienced ATV rider who is doing more than recreation on the unit, or who wants more engine for trail confidence.</p><p>Same ATV safety profile as the HS 400 (helmet required, no roll cage, body-input steering). Talk to us on the floor about whether a 400-class is sized right for you or whether the 500-class is the better fit for the kind of riding you do.</p>',
            'how'          => [
                ['icon' => 'two_wheeler',    'title' => 'Larger HS ATV',         'description' => 'More engine for heavier-duty single-rider use.'],
                ['icon' => 'terrain',        'title' => 'Trail confidence',      'description' => 'Larger displacement for sustained running and headroom under load.'],
                ['icon' => 'shield',         'title' => 'Helmet required',       'description' => 'Same ATV safety profile as the rest of the line.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'ATV (larger single-rider, HS-series)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Heavier-duty single-rider use, longer trail running'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-forge-400i-atv-class',
            'product_id'   => 221,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Forge 400i ATV',
            'tagline'      => 'Utility-leaning single-rider ATV. Front and rear racks, work-ready single-rider.',
            'why'          => '<p>The Forge 400i is the utility-leaning ATV in the Hisun lineup. Single-rider quad with front and rear racks rated for real work loads, plus the kind of suspension and powertrain tune that holds up under sustained property use (firewood hauling, fence-line work, the back-country tasks that come up on a working property). Right unit for the customer who wants ATV form factor with utility capability built in.</p><p>The 400i designation is the EFI (electronic fuel injection) variant in the Forge line; cleaner starts, better cold-weather behaviour, lower maintenance on the carb side. Same ATV safety profile (helmet required).</p>',
            'how'          => [
                ['icon' => 'agriculture',    'title' => 'Utility-leaning ATV',  'description' => 'Front and rear racks for real work loads.'],
                ['icon' => 'tune',           'title' => 'EFI fuel system',       'description' => 'Cleaner starts, better cold-weather behaviour than carbureted ATVs.'],
                ['icon' => 'shield',         'title' => 'Helmet required',       'description' => 'Same ATV safety profile as the rest of the line.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'ATV (utility single-rider, Forge line, EFI)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Work-ready ATV use, property maintenance, EFI reliability'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-tactic-atv-class',
            'product_id'   => 235,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun Tactic ATV',
            'tagline'      => 'Single-rider ATV in the Tactic family. Trail-and-property all-rounder.',
            'why'          => '<p>The Tactic is the all-rounder single-rider ATV in the Hisun lineup. Trail-and-property mixed use, the kind of unit that handles weekend recreation as well as it handles light property work during the week. Right unit for the customer who is not sure whether they need a recreational ATV or a utility ATV and wants something that does both reasonably well.</p><p>Talk to us on the floor about whether the Tactic is sized right for your specific mix or whether the Forge 400i (more utility-leaning) or the HS-series (more recreation-leaning) is the better pick.</p>',
            'how'          => [
                ['icon' => 'two_wheeler',    'title' => 'All-rounder ATV',      'description' => 'Trail-and-property mixed use; not specialised for one or the other.'],
                ['icon' => 'terrain',        'title' => 'Mixed-use tune',        'description' => 'Suspension and powertrain handle both recreation and light work.'],
                ['icon' => 'shield',         'title' => 'Helmet required',       'description' => 'Same ATV safety profile as the rest of the line.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'ATV (all-rounder single-rider, Tactic family)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Mixed trail-and-property use, "do-both" ATV customers'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-guardian-atv-class',
            'product_id'   => 234,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun GUARDIAN ATV',
            'tagline'      => 'Single-rider ATV in the GUARDIAN family. Trail-capable Hisun unit.',
            'why'          => '<p>The GUARDIAN is the Hisun single-rider ATV in the GUARDIAN family. Trail-capable, single-rider quad form factor, with the Hisun parts ecosystem and in-house warranty support behind it. Talk to us on the floor about how the GUARDIAN sits relative to the HS-series and the Forge in terms of trim level, engine class and use case fit for your specific situation.</p><p>Same ATV safety profile as the rest of the lineup (helmet required, no roll cage, body-input steering). Authorised Hisun dealer support and full in-house service.</p>',
            'how'          => [
                ['icon' => 'two_wheeler',    'title' => 'Single-rider GUARDIAN','description' => 'Trail-capable Hisun ATV with parts and service support.'],
                ['icon' => 'verified',       'title' => 'Authorised dealer',     'description' => 'Factory-direct pricing, genuine parts, in-house warranty.'],
                ['icon' => 'shield',         'title' => 'Helmet required',       'description' => 'Same ATV safety profile as the rest of the line.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'ATV (single-rider, GUARDIAN family)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Single-rider trail use; talk to us on the floor about trim fit'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-mp9t400-atv-cross',
            'product_id'   => 242,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun MP9T400 (Smaller-Class Crew Side-by-Side)',
            'tagline'      => 'Cross-listed for ATV-shoppers: if you came in looking for an ATV but want four-seat capability, the MP9T400 is the smaller-class crew alternative.',
            'why'          => '<p>The MP9T400 is not an ATV; it is the smaller-class crew-cab variant in the MP9 side-by-side line. It is cross-listed on the ATV class page because customers shopping ATVs sometimes find the safety architecture of a side-by-side (roll cage, harness, four-seat layout) actually fits their use case better than a single-rider quad. If you came in looking at HS 400 / HS 500 ATVs and you have a family or a riding crew, the MP9T400 is worth a look.</p><p>Smaller-class crew chassis, four-seat layout in a tighter footprint than the 750-class Sector Crew or Stryker Crew. Same in-house Hisun service support. Cross-listed on the Crew class page and the MP9 series page as well.</p>',
            'how'          => [
                ['icon' => 'group',          'title' => 'Four-seat side-by-side','description' => 'Crew-cab safety architecture (roll cage, harness mounts) versus ATV.'],
                ['icon' => 'savings',        'title' => 'Accessible crew',       'description' => 'Smaller-class crew price, tighter footprint than 750-class.'],
                ['icon' => 'compare_arrows', 'title' => 'ATV-or-crew talk',      'description' => 'We walk through the ATV-vs-side-by-side decision on the floor.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Smaller-class crew side-by-side (cross-listed for ATV-shoppers)'],
                ['label' => 'Seats',       'value' => '4'],
                ['label' => 'Best for',    'value' => 'ATV-shoppers who want four-seat capability or side-by-side safety architecture'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Hisun',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Hisun dealer. Full ATV lineup: HS-series, Forge utility-leaning, Tactic all-rounder, GUARDIAN. Plus crew-cab cross-list.',
        'body'     => '<p>Hisun is the powersports brand we lead with. The ATV lineup covers single-rider trail recreation, work-ready utility ATVs, and the all-rounder mid-class. Full in-house service from Aaron and the techs; helmets and basic safety gear at the parts counter.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right ATV for the rider',
        'columns' => ['Model',           'Family',                'Lean',         'Best for'],
        'rows'    => [
            ['HS 400',                   'HS-series',              'Mid-class',    'Experienced trail recreation, lighter property'],
            ['HS 500',                   'HS-series',              'Larger HS',    'Heavier-duty single-rider, longer trail running'],
            ['Forge 400i',               'Forge (EFI)',            'Utility',      'Work-ready ATV use, property maintenance'],
            ['Tactic',                   'Tactic family',          'All-rounder',  'Mixed trail-and-property use'],
            ['GUARDIAN',                 'GUARDIAN family',        'Trail-capable','Single-rider trail use; talk on the floor for trim fit'],
            ['MP9T400 (cross-list)',     'Side-by-side (crew)',    'Crew-cab',     'ATV-shoppers wanting four-seat / cage / harness'],
        ],
    ],

    'faq' => [
        [
            'q' => 'ATV or side-by-side?',
            'a' => 'An ATV is a single-rider four-wheel quad. You sit on it, you steer with handlebars, you use body input to corner. A side-by-side has a roll cage, a steering wheel, harness mounts, and you sit in it like a small vehicle. Different ride feel, different safety architecture. ATVs are tighter on trails and more direct; side-by-sides are safer for less-experienced riders and family use. We will walk you through which fits your situation.',
        ],
        [
            'q' => 'Which Hisun ATV is right for me?',
            'a' => 'Three questions usually decide it: how experienced are you on ATVs, what is your mix of recreation versus property work, and what engine class fits your size and use case? HS-series is mainstream recreation and lighter work, Forge 400i is utility-leaning with EFI reliability, Tactic is the all-rounder, GUARDIAN is the trail-capable lane. Talk to us on the floor; fifteen minutes usually narrows it.',
        ],
        [
            'q' => 'Do you stock helmets and safety gear?',
            'a' => 'Yes. Lynn and Ron at the parts counter stock helmets and basic safety gear. Helmet is non-negotiable on any ATV: no roll cage, no harness, body-input steering means a fall is an unprotected fall.',
        ],
        [
            'q' => 'Can I put a younger rider on the HS 400 or HS 500?',
            'a' => 'These are 400-class and 500-class quads, generally experienced-rider units. For a younger rider new to four-wheels, the Strike 250R side-by-side is usually a better fit because of the safety architecture (roll cage, harness, four-seat layout). Talk to us about rider age and experience before committing.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at ATVs on the floor?',
        'body'      => '<p>Drop in and walk the Hisun ATV lineup, or give us a call and we can work through the ATV-vs-side-by-side decision and the trim match for your use case.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the HS Series',        'href' => '/powersports/hs-series/'],
    ],
];
```

---

## PAGE 6 — powersports--hs-series.php (NEW PAGE, HS series — Hisun HS-prefix family)

```php
<?php
/**
 * Category config: powersports -> hs-series
 * Frame: Hisun HS-prefix family page. Cross-references the HS-series ATVs (cross-listed with /atvs/).
 * 2 anchors (HS-prefix units we stock): HS 400 (id 236) + HS 500 (id 220).
 */

return [
    'category_slug' => 'hs-series',
    'parent_slug'   => 'powersports',

    'hero' => [
        'title'    => 'Hisun HS Series',
        'subtitle' => 'The Hisun HS-prefix unit family. Single-rider ATVs from the HS-series line. HS 400 mid-class and HS 500 larger.',
        'cta'      => [
            'primary'   => ['label' => 'See the HS Series lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',           'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'The HS series: Hisun ATVs in two engine classes',
        'body'  => '<p>The Hisun HS series is the brand-line of HS-prefix single-rider ATVs in the Hisun powersports lineup. Two HS-prefix units on the floor: HS 400 (mid-class) and HS 500 (larger). Both are single-rider four-wheel quads with the Hisun ATV architecture (helmet required, no roll cage, body-input steering, single-rider seat).</p><p>The HS-series sits in the recreation-and-light-utility lane in the broader Hisun ATV lineup. For utility-leaning work-ready ATVs, the Forge 400i (EFI utility) is the right pick. For all-rounder trail-and-property mixed use, the Tactic is the answer. The HS 400 / HS 500 are the recreation-first HS-prefix units. We talk through the four-vs-five-hundred-class decision on the floor based on rider size and use case.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the HS 400-vs-HS 500 question (mostly an engine-class and rider-experience decision). Aaron owns the powersports-service side and the techs handle break-in, suspension setup, accessory install and warranty. Lynn and Ron at the parts counter stock Hisun ATV consumables and helmets.</p>',
    ],

    'subcategories' => [
        ['label' => 'Strike'],
        ['label' => 'Sector'],
        ['label' => 'MP9'],
        ['label' => 'Stryker'],
        ['label' => 'ATVs'],
        ['label' => 'HS Series'],
    ],

    'series_models' => [
        [
            'slug'         => 'hisun-hs-400-series',
            'product_id'   => 236,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun HS 400 ATV',
            'tagline'      => 'Mid-class single-rider ATV. The HS-series entry into the Hisun ATV lineup.',
            'why'          => '<p>The HS 400 is the mid-class single-rider ATV in the HS series. Four-wheel quad with a 400-class engine, sized for trail recreation and lighter property work. Right unit for the experienced ATV rider who wants a real Hisun unit at an accessible class. Helmet absolutely required.</p><p>The HS 400 is generally an experienced-rider unit, not a youth-spec. For a younger rider new to four-wheels, the Strike 250R side-by-side is usually a better fit because of the safety architecture. We talk through rider experience on the floor.</p>',
            'how'          => [
                ['icon' => 'two_wheeler',    'title' => 'HS-series ATV entry',  'description' => 'Mid-class single-rider quad in the HS line.'],
                ['icon' => 'terrain',        'title' => 'Trail-and-light-work', 'description' => '400-class for recreation and lighter property use.'],
                ['icon' => 'shield',         'title' => 'Helmet required',      'description' => 'No roll cage on an ATV. Safety gear is non-negotiable.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'HS (mid-class single-rider)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Experienced ATV riders, trail recreation, lighter property work'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'hisun-hs-500-series',
            'product_id'   => 220,
            'thumbnail_id' => 0,
            'heading'      => 'Hisun HS 500 ATV',
            'tagline'      => 'Larger HS-series ATV. Bigger engine for heavier-duty single-rider use.',
            'why'          => '<p>The HS 500 is the larger HS-series ATV. Same single-rider quad architecture as the HS 400 with more engine for heavier-duty use: heavier loads on a rear rack, longer trail running times, more headroom under sustained work. Right unit for the experienced ATV rider doing more than recreation, or who wants more engine for trail confidence.</p><p>Same ATV safety profile as the HS 400 (helmet required, no roll cage). Talk to us on the floor about whether 400-class or 500-class fits your size and use case.</p>',
            'how'          => [
                ['icon' => 'two_wheeler',    'title' => 'Larger HS ATV',         'description' => 'More engine for heavier-duty single-rider use.'],
                ['icon' => 'terrain',        'title' => 'Trail confidence',      'description' => 'Larger displacement for sustained running and headroom under load.'],
                ['icon' => 'shield',         'title' => 'Helmet required',       'description' => 'Same ATV safety profile as the HS 400.'],
            ],
            'what'         => [
                ['label' => 'Series',      'value' => 'HS (larger single-rider)'],
                ['label' => 'Seats',       'value' => '1'],
                ['label' => 'Best for',    'value' => 'Heavier-duty single-rider use, longer trail running'],
                ['label' => 'Brand',       'value' => 'Hisun (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Hisun',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Hisun dealer. HS-series ATVs (HS 400, HS 500) plus the broader Hisun ATV lineup (Forge, Tactic, GUARDIAN).',
        'body'     => '<p>The HS series is the recreation-and-light-utility ATV line in the Hisun lineup. For utility-leaning ATVs, see the Forge 400i. For all-rounder mixed use, the Tactic. For the broader ATV picture, the ATVs class page.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'HS Series at a glance',
        'columns' => ['Model',           'Engine class',  'Seats', 'Best for'],
        'rows'    => [
            ['HS 400',                   'Mid (400)',     '1',     'Experienced trail recreation, lighter property work'],
            ['HS 500',                   'Larger (500)',  '1',     'Heavier-duty single-rider, longer trail running'],
        ],
    ],

    'faq' => [
        [
            'q' => 'HS 400 or HS 500?',
            'a' => 'Mostly a rider-size and engine-class decision. The 400 is the mid-class entry into the HS line, right for most experienced trail riders. The 500 is the larger trim with more engine for heavier-duty use or longer trail running. We talk through rider size and use case on the floor.',
        ],
        [
            'q' => 'Why no HS-series side-by-sides on this page?',
            'a' => 'The HS series in the Hisun lineup is currently single-rider ATV-only. Side-by-side units in the Hisun powersports family are in the Strike, Sector, MP9 and Stryker series; see those pages for the side-by-side conversation.',
        ],
        [
            'q' => 'Do you stock helmets for the HS line?',
            'a' => 'Yes. Lynn and Ron stock helmets and basic safety gear at the parts counter. Helmet is non-negotiable on any ATV.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at the HS series on the floor?',
        'body'      => '<p>Drop in and walk the HS lineup, or give us a call and we can work through the 400-vs-500 fit for your size and riding.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the full ATV class',   'href' => '/powersports/atvs/'],
    ],
];
```

---

## QC checklist (web-copy author side)

**SKU verification — all 14 unique product_ids boss-verified per dispatch:**

Strike series:
- [x] Strike 250R (id 214)
- [x] Strike 550R (id 215)

Sector series:
- [x] Sector 250 (id 237)
- [x] Sector 550 EPS (id 216)
- [x] Sector 750 EPS (id 238)
- [x] Sector 750 Crew (id 217)

MP9 series:
- [x] MP9 550R (id 219)
- [x] MP9 750R (id 241)
- [x] MP9T400 (id 242, cross-listed crew + atvs)

Stryker series:
- [x] Stryker 550X (id 239)
- [x] Stryker 750X (id 218)
- [x] Stryker 750 Crew (id 240)

ATVs / HS:
- [x] HS 400 (id 236, cross-listed atvs + hs-series + youth)
- [x] HS 500 (id 220, cross-listed atvs + hs-series)
- [x] Forge 400i (id 221)
- [x] Tactic (id 235)
- [x] GUARDIAN (id 234)

**Voice / format:**
- [x] Canadian English (authorised, neighbour, etc.)
- [x] No em-dashes anywhere in PHP body. Both Unicode AND HTML entities checked.
- [x] No banned AI tells
- [x] No "Talk to Casey" / "Call Casey" / "ask Casey" CTAs
- [x] No inline Casey quotes (Casey-gate active)
- [x] No Kory references anywhere (banked rule)
- [x] No founding-year claims for Reyco; present-tense framing
- [x] Staff names match roster (Casey, Aaron, Lee, Damian, Cody, Lynn, Ron). No Kory.
- [x] Aaron specifically named on the powersports-service side (parallel to engine-service on Mercury / boats and small-engine bench on LG)
- [x] Hisun in the 11-brand authorised list

**Cross-link integrity:**
- [x] All 6 pages have a 6-tab subcategories band (static label strip pattern; no anchor / href, per banked plumb-clean preference)
- [x] CTA secondary cross-links sized for natural sibling pivots: strike → sport class, sector → utility class, mp9 → sector series, stryker → sector series, atvs → hs-series, hs-series → atvs

**Cross-listing notes for plumb (boss-side dedup or parallel WC product taxonomy):**
- MP9T400 (242): /mp9/, /crew/, /atvs/ (3 pages with the same product_id)
- HS 400 (236): /atvs/, /hs-series/, /youth/ (3 pages)
- HS 500 (220): /atvs/, /hs-series/ (2 pages)
- Strike 250R (214): /strike/, /sport/, /youth/ (3 pages)
- Strike 550R (215): /strike/, /sport/ (2 pages)
- Sector 250 (237): /sector/, /youth/ (2 pages)
- Sector 550 EPS (216), Sector 750 EPS (238): /sector/, /utility/ (2 pages each)
- Sector 750 Crew (217): /sector/, /crew/ (2 pages)
- MP9 550R (219), MP9 750R (241): /mp9/, /utility/ (2 pages each)
- Stryker 750 Crew (240): /stryker/, /crew/ (2 pages)

**Dev-side flags:**
- [ ] Page-template binding: `_wp_page_template = page-templates/series-showcase.php` on all 6 series pages
- [ ] WC `product_category` taxonomy assignment fix: same boss-side WC fix as powersports class pages and LG batch
- [ ] Material Symbols icon name verification: `speed`, `shield`, `engineering`, `group`, `agriculture`, `tune`, `savings`, `terrain`, `two_wheeler`, `verified`, `compare_arrows`. Standard Material Symbols, should render.
- [ ] Brand-band logos and per-entry thumbnails all 0 placeholders. Hisun brand logo + per-unit thumbnails to be supplied at content polish.

---

## Rollout summary table (updated through powersports series batch)

| Batch | Date | Pages | Entries | Commit | Status |
|-------|------|-------|---------|--------|--------|
| 1 | 2026-05-XX | 4 | ~17 | 6b235a9 | Shipped + plumbed |
| 2 | 2026-05-XX | 4 | ~17 | aed97e2 | Shipped + plumbed |
| 3 | 2026-05-XX | 4 | ~17 | 01d3c4d | Shipped + plumbed |
| 4 | 2026-05-05 | 4 | ~17 | 23ac57e | Shipped + plumbed |
| 5 | 2026-05-06 | 5 | ~9 | 1c0c7bf + a7b91fa | Shipped + plumbed |
| Princecraft | 2026-05-06 | 1 | 5 | b2d7ff0 | Shipped, plumb pending |
| Minn Kota | 2026-05-06 | 1 | 5 | 0764a66 | Shipped, plumb pending |
| Mercury + Humminbird | 2026-05-06 | -- | -- | -- | HALTED (Aiden-confirmed acceptable) |
| Powersports class | 2026-05-06 | 4 (NEW) | 12 | cfd9f8b + 40742d0 | Shipped, plumb pending |
| LG class (batch 1/3) | 2026-05-06 | 6 (NEW) | ~16 | eab81dd | Shipped, plumb in progress |
| Powersports series (this, batch 2/3) | 2026-05-06 | 6 (NEW) | ~17 | TBD | Author-side ready, plumb pending |

Cumulative through this deliverable: 39 pages of new / replaced category configs, ~120 unique series-models entries on the author side.

---

## Working notes (post-launch follow-ups)

1. **Cross-listing dedup:** several product_ids are cross-listed across 2-3 pages each. The series-showcase template renders the configured series_models regardless of WC archive content, so visual rendering is fine. If WC product taxonomy assignment needs to be exclusive (one product belongs to one category only), boss-side WC fix would need to pick a primary category for each cross-listed product. Recommend primary-category by series (Strike 250R primary = strike, secondary appearance = sport / youth) since the series page is the brand-narrative anchor.
2. **HS-series scope:** HS-series page is currently 2 anchors (HS 400, HS 500) since boss did not provide HS-prefix UTV product_ids. If HS-line UTVs exist in Reyco's catalogue and are added to WC inventory, content polish can extend the HS-series page.
3. **Tactic and GUARDIAN family pages:** these are anchored on the ATVs class page only. If they grow into family-line series pages of their own, content polish can spin out dedicated series pages.
4. **MP9T400 ATV-cross-list framing:** the MP9T400 entry on /atvs/ explicitly frames itself as "not an ATV — cross-listed for ATV-shoppers." This is a UX-conscious framing decision. If boss / Aiden prefers the MP9T400 NOT appear on /atvs/ at all (cleaner taxonomy), the entry can be removed in a one-liner edit; the rest of the page is 5 ATVs which still reads complete.
5. **Casey / Aaron quote refresh:** consistent with all prior brand-page deliverables today, this carries no inline owner-voice quotes.
6. **Kory-scrub queue:** per boss msg 1778091738917 — prior shipped Reyco copy will be batched into a single grep-and-replace PR. This deliverable is already Kory-clean by author.

End of deliverable.
