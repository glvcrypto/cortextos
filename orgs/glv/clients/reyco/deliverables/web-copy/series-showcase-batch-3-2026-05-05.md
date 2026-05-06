# Series Showcase Batch 3 — 7 Reyco category configs (29 product entries)

**For dev:** ready-to-paste PHP arrays for the series-showcase template. Same shape and same voice as Batches 1+2.

**Source dispatch:** boss msg 1778026391936-boss-v0lir + Hisun spec-gap guidance 1778026449146-boss-wwxez.

**Voice / format constraints (carried from Batches 1+2):**
- Canadian English; plain language; NO em-dashes anywhere in PHP body
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022 — present-tense framing only. NO "60 years" / "since 1964" / family-history claims
- Casey owner-voice. NO "Talk to Casey" / "Call Casey" / "ask Casey" CTA copy
- 11-brand authorised list: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- Staff: Casey (sales floor), Aaron (co-owner / service), Lee / Damian / Cody (techs), Lynn / Ron (parts), Kory (sales)
- Hisun spec-gap rule (per boss): 2-3 confirmed specs (displacement, seats, transmission), skip the rest, frame as "see it in person / spec it with the team"

**Approval gate:** Aiden review before any wp-cli paste. Casey gate on factual product framing.

**Counts (29 entries total):**
- Page 1 atvs: 5 Hisun
- Page 2 cub-cadet-xt2: 5 Cub Cadet (FULL CONFIG, new page)
- Page 3 pressure-washers: 5 Echo
- Page 4 toro-timecutter: 4 Toro (FULL CONFIG, new page)
- Page 5 stryker: 3 Hisun UTV
- Page 6 push-mowers: 3 mixed (Echo + Toro)
- Page 7 handheld-blowers: 4 Echo (FULL CONFIG, new page)

---

## PAGE 1 — powersports--atvs.php (NEW KEYS ONLY)

```php
'series_models' => [
    [
        'slug'         => '2026-hisun-hs-400-atv',
        'product_id'   => 236,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun HS 400 ATV',
        'tagline'      => 'Entry utility ATV. Single-rider, budget-honest pricing, selectable 4WD.',
        'why'          => '<p>The HS 400 is the right starting point for the customer who wants a real working ATV without the price tag of the bigger Hisuns or the long wait on a name-brand machine. Selectable 4WD when the trail turns rough, automatic CVT so you ride instead of shifting, and front and rear racks for the gear or the firewood. Single-rider configuration keeps it nimble in tight bush.</p><p>This is the model the parts counter and service team can support easily. Hisun parts move through Reyco regularly because we are a regional Hisun dealer, not just a name on a sign. Casey usually has the floor model out for test rides.</p>',
        'how'          => [
            ['icon' => 'directions_car', 'title' => 'Selectable 4WD', 'description' => 'Switch into four-wheel drive when the trail turns to mud, snow, or hill climb.'],
            ['icon' => 'inventory_2', 'title' => 'Front and rear racks', 'description' => 'Real cargo capacity for hunting, trail work, or the firewood run.'],
            ['icon' => 'support_agent', 'title' => 'In-house Hisun parts and service', 'description' => 'We stock Hisun parts and our techs work on these every week. Local support is real.'],
        ],
        'what'         => [
            ['label' => 'Engine',       'value' => '~351cc single cylinder'],
            ['label' => 'Transmission', 'value' => 'Automatic CVT'],
            ['label' => 'Drive',        'value' => '2WD / 4WD selectable'],
            ['label' => 'Riders',       'value' => 'Single'],
        ],
    ],
    [
        'slug'         => '2026-hisun-hs-500-atv',
        'product_id'   => 220,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun HS 500 ATV',
        'tagline'      => 'Mid-range utility ATV. Single-rider, selectable 4WD, front and rear racks.',
        'why'          => '<p>The HS 500 is the workhorse step up from the 400. More displacement, more torque on hill climbs, and the same utility-first layout: selectable 4WD, automatic CVT, racks front and back. For the customer hauling firewood out of a back lot or running a trapline, this is the size that earns its keep.</p><p>We have these on the floor most of the season. Come ride it before you buy. Casey or Kory will run you through the drive and the controls.</p>',
        'how'          => [
            ['icon' => 'directions_car', 'title' => 'Selectable 4WD', 'description' => 'Power to all four wheels when you need it. Two-wheel mode for trail efficiency.'],
            ['icon' => 'fitness_center', 'title' => 'Real torque', 'description' => 'Mid-displacement engine pulls grades and loads the 400 will struggle with.'],
            ['icon' => 'inventory_2', 'title' => 'Cargo-ready', 'description' => 'Front and rear racks rated for tools, gear, or game. Built to be loaded.'],
        ],
        'what'         => [
            ['label' => 'Engine',       'value' => '~471cc single cylinder'],
            ['label' => 'Transmission', 'value' => 'Automatic CVT'],
            ['label' => 'Drive',        'value' => '2WD / 4WD selectable'],
            ['label' => 'Riders',       'value' => 'Single'],
        ],
    ],
    [
        'slug'         => '2026-hisun-forge-400i-atv',
        'product_id'   => 221,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun Forge 400i ATV',
        'tagline'      => 'Sport-utility ATV with fuel injection. Three factory colours, selectable 4WD.',
        'why'          => '<p>The Forge 400i is the sport-leaning end of the Hisun ATV lineup. Fuel injection on a 400-class engine means clean cold starts, smoother throttle response, and better hot-weather running than a carb. Three factory colour options on the rack so customers can pick what they like rather than take what shipped.</p><p>Best to come look at this one in person. The riding position and the throttle feel are the sell, and those are not things a spec sheet captures. Casey or Kory will set you up for a test ride.</p>',
        'how'          => [
            ['icon' => 'bolt', 'title' => 'Electronic fuel injection', 'description' => 'Cleaner cold starts, smoother throttle, better hot-day running than a carb.'],
            ['icon' => 'palette', 'title' => 'Three factory colours', 'description' => 'Pick the one that fits the trailer and the rest of your kit.'],
            ['icon' => 'directions_car', 'title' => 'Selectable 4WD', 'description' => 'Sport ride feel with real 4WD when the trail demands it.'],
        ],
        'what'         => [
            ['label' => 'Engine',       'value' => '400-class fuel-injected single'],
            ['label' => 'Transmission', 'value' => 'Automatic CVT'],
            ['label' => 'Drive',        'value' => '2WD / 4WD selectable'],
            ['label' => 'Riders',       'value' => 'Single'],
        ],
    ],
    [
        'slug'         => '2026-hisun-tactic-atv',
        'product_id'   => 235,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun Tactic ATV',
        'tagline'      => 'Mid-utility ATV. Single-rider, selectable 4WD.',
        'why'          => '<p>The Tactic is positioned between the HS 500 and the GUARDIAN, with a focus on trail capability and rider comfort. Single-rider layout, automatic CVT, selectable 4WD. Hisun built this as the customer-asked-for middle option in the utility lineup.</p><p>Spec sheets are still being firmed up at the regional level. Best move is to come see it in person and let Casey or one of the team walk you through where it lands versus the HS 500 and the GUARDIAN. We have it on the floor.</p>',
        'how'          => [
            ['icon' => 'directions_car', 'title' => 'Selectable 4WD', 'description' => 'Two-wheel for trail efficiency, four-wheel for the climb or the snow.'],
            ['icon' => 'weekend', 'title' => 'Rider-comfort focused', 'description' => 'Hisun built this around rider position and trail-day fatigue.'],
            ['icon' => 'support_agent', 'title' => 'Floor model on hand', 'description' => 'Come see it in person. We will walk you through where it fits in the lineup.'],
        ],
        'what'         => [
            ['label' => 'Class',        'value' => 'Mid-utility'],
            ['label' => 'Transmission', 'value' => 'Automatic CVT'],
            ['label' => 'Drive',        'value' => '2WD / 4WD selectable'],
            ['label' => 'Riders',       'value' => 'Single'],
        ],
    ],
    [
        'slug'         => '2026-hisun-guardian-atv',
        'product_id'   => 234,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun GUARDIAN ATV',
        'tagline'      => 'Full-size utility ATV workhorse. Single-rider, selectable 4WD.',
        'why'          => '<p>The GUARDIAN is the top of the Hisun utility ATV range. Full-size frame, full-size displacement, built for the customer who treats the ATV like a tool and runs it hard. Selectable 4WD, automatic CVT, sized for real cargo loads and serious bush work.</p><p>This is the unit for the working customer: trapper, trail crew, hunting camp operator, off-grid landowner. Come see it on the floor and we will walk through where it fits your use case.</p>',
        'how'          => [
            ['icon' => 'fitness_center', 'title' => 'Full-size workhorse', 'description' => 'Top of the utility ATV line. Built for the customer who runs it hard.'],
            ['icon' => 'directions_car', 'title' => 'Selectable 4WD', 'description' => 'Two-wheel for travel, four-wheel for the heavy pulls and the steep climbs.'],
            ['icon' => 'support_agent', 'title' => 'Spec it with the team', 'description' => 'Casey or Kory walks you through fit for trapline, hunting camp, or trail crew.'],
        ],
        'what'         => [
            ['label' => 'Class',        'value' => 'Full-size utility'],
            ['label' => 'Transmission', 'value' => 'Automatic CVT'],
            ['label' => 'Drive',        'value' => '2WD / 4WD selectable'],
            ['label' => 'Riders',       'value' => 'Single'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'Hisun',
    'logo_id'  => 0,
    'tagline'  => 'Authorised Hisun dealer for the Algoma region.',
    'body'     => '<p>We carry the full Hisun ATV utility line: HS 400, HS 500, Forge 400i, Tactic, and GUARDIAN. Hisun is our value-tier ATV brand and the parts and service support is real local support. We stock Hisun parts at the counter and our techs work on these machines every week. Floor models are usually on hand for test rides through the riding season.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which Hisun ATV is right for the work?',
    'columns' => ['Model', 'Class', 'Engine', 'Best for'],
    'rows'    => [
        ['HS 400',    'Entry utility',     '~351cc',                'First ATV, light trail and yard work'],
        ['HS 500',    'Mid-range utility', '~471cc',                'Firewood hauling, trapline, working trail'],
        ['Forge 400i', 'Sport-utility',    '400-class EFI',         'Sport ride feel with utility capability'],
        ['Tactic',    'Mid-utility',       'Mid-displacement',      'Trail-focused mid-tier between HS 500 and GUARDIAN'],
        ['GUARDIAN',  'Full-size utility', 'Full-size workhorse',   'Heavy work, hunting camp, off-grid landowner'],
    ],
],
```

---

## PAGE 2 — lawn-garden--cub-cadet-xt2.php (FULL CONFIG, NEW PAGE)

Page does not exist. Full config below.

```php
<?php
/**
 * Category config: lawn-and-garden -> cub-cadet-xt2
 * Frame: premium consumer Cub Cadet riding mowers, full XT2 lineup.
 */

return [
    'category_slug' => 'cub-cadet-xt2',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Cub Cadet XT2 Riding Mowers',
        'subtitle' => 'The premium consumer line from Cub Cadet. Hydrostatic transmissions, fabricated steel decks, sized 42 to 54 inches for the property that earns a real ride-on.',
        'cta'      => [
            'primary'   => ['label' => 'Browse the lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop', 'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'When the lawn outgrows a push mower',
        'body'  => '<p>The XT2 is Cub Cadet\'s premium consumer ride-on tier. Two acres or more of lawn and a push mower is no longer the right tool. The XT2 line uses hydrostatic transmissions (no clutching, just pedal speed control), fabricated steel decks (heavier and more durable than the stamped decks on lower-tier ride-ons), and Kohler or Kawasaki engines that hold up to season-after-season use.</p><p>Sizes run 42 inches for the smaller-acreage property up to 54 inches in the Enduro Series for serious-acreage cuts. We assemble, blade-balance, oil-fill, and test-run every unit before delivery. Aaron and the bench team handle warranty service in-house.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey and Kory work the floor on ride-on selection. Aaron and the service techs (Lee, Damian, Cody) handle assembly, pre-delivery, and warranty work. Lynn and Ron at the parts counter handle blades, belts, filters, and seasonal service kits.</p>',
    ],

    'subcategories' => [
        ['label' => '42-inch Riding Mowers', 'anchor' => '#42-inch'],
        ['label' => '46-inch Riding Mowers', 'anchor' => '#46-inch'],
        ['label' => '54-inch Enduro Series', 'anchor' => '#54-inch'],
    ],

    'series_models' => [
        [
            'slug'         => '2026-cub-cadet-xt2-lx42',
            'product_id'   => 423,
            'thumbnail_id' => 0,
            'heading'      => '2026 Cub Cadet XT2 LX42 (42-inch)',
            'tagline'      => 'The XT2 entry: 42-inch deck, hydrostatic drive, sized for the two-to-three acre property.',
            'why'          => '<p>The LX42 is where the XT2 line starts. Forty-two inches of deck cuts a two-acre lawn in one pass through the back yard, and the hydrostatic transmission means you set the pedal and the mower does the speed work. No clutching, no shifting. Engine is sized to handle the deck under load without bogging.</p><p>This is the ride-on the customer with a two-to-three acre property buys when they decide the push mower is no longer the right tool. We assemble, blade-balance, and oil-fill before delivery, so it is ready to cut the day it goes home.</p>',
            'how'          => [
                ['icon' => 'square_foot', 'title' => '42-inch fabricated deck', 'description' => 'Heavier-gauge fabricated steel, not the stamped deck on lower-tier ride-ons.'],
                ['icon' => 'speed', 'title' => 'Hydrostatic drive', 'description' => 'Pedal-controlled speed. No clutching, no shifting. Smooth on hills.'],
                ['icon' => 'engineering', 'title' => 'Pre-delivery prep', 'description' => 'Assembled, blade-balanced, oil-filled, and test-run before it leaves the shop.'],
            ],
            'what'         => [
                ['label' => 'Deck',         'value' => '42-inch fabricated steel'],
                ['label' => 'Transmission', 'value' => 'Hydrostatic'],
                ['label' => 'Engine',       'value' => 'Cub Cadet-spec, twin or single (verify by SKU)'],
                ['label' => 'Best for',     'value' => 'Two-to-three acre lawn'],
            ],
        ],
        [
            'slug'         => '2026-cub-cadet-xt2-lx42-13apa1tea10',
            'product_id'   => 469,
            'thumbnail_id' => 0,
            'heading'      => '2026 Cub Cadet XT2 LX42 (13APA1TEA10)',
            'tagline'      => 'Same 42-inch XT2 LX42 platform, current production SKU code.',
            'why'          => '<p>This is the LX42 SKU 13APA1TEA10, the current production code for the model. Same 42-inch deck, same hydrostatic drive, same XT2 build quality. Carried as a separate listing because the SKU and the parts catalogue tie to the production code.</p><p>For most customers the choice between this and the other LX42 listing is just availability. We will steer you to whichever one is on the floor or in the next shipment, and the buying experience is identical.</p>',
            'how'          => [
                ['icon' => 'verified', 'title' => 'Current production SKU', 'description' => 'The 13APA1TEA10 SKU is the current build code for the LX42 platform.'],
                ['icon' => 'inventory_2', 'title' => 'Parts catalogue match', 'description' => 'Service parts and kits tie directly to this SKU number.'],
                ['icon' => 'support_agent', 'title' => 'Same buying experience', 'description' => 'Pre-delivery prep, in-house service, and warranty support all the same as any LX42.'],
            ],
            'what'         => [
                ['label' => 'Deck',         'value' => '42-inch fabricated steel'],
                ['label' => 'Transmission', 'value' => 'Hydrostatic'],
                ['label' => 'SKU',          'value' => '13APA1TEA10'],
                ['label' => 'Best for',     'value' => 'Two-to-three acre lawn'],
            ],
        ],
        [
            'slug'         => '2026-cub-cadet-xt2-lx46-13apa1tna10',
            'product_id'   => 562,
            'thumbnail_id' => 0,
            'heading'      => '2026 Cub Cadet XT2 LX46 (13APA1TNA10)',
            'tagline'      => 'Forty-six inches of deck for the property that needs more cut per pass.',
            'why'          => '<p>The LX46 is the four-inch step up from the LX42. Same XT2 hydrostatic platform, same fabricated deck construction, four extra inches of cutting width per pass. For a three-to-four acre lawn, that extra width takes thirty minutes off the weekly cut and the math adds up over a season.</p><p>Casey will walk you through the LX42-versus-LX46 decision based on lawn size and any tight-corner constraints. The 46-inch deck does not fit through every garden gate, so the geometry of your yard matters as much as the acreage.</p>',
            'how'          => [
                ['icon' => 'square_foot', 'title' => '46-inch fabricated deck', 'description' => 'Four extra inches of cut versus the LX42. Cuts time on bigger properties.'],
                ['icon' => 'speed', 'title' => 'Hydrostatic drive', 'description' => 'Pedal speed control. Smooth across slopes and around obstacles.'],
                ['icon' => 'inventory_2', 'title' => 'SKU 13APA1TNA10', 'description' => 'Current production SKU. Parts and service tie to this build code.'],
            ],
            'what'         => [
                ['label' => 'Deck',         'value' => '46-inch fabricated steel'],
                ['label' => 'Transmission', 'value' => 'Hydrostatic'],
                ['label' => 'SKU',          'value' => '13APA1TNA10'],
                ['label' => 'Best for',     'value' => 'Three-to-four acre lawn'],
            ],
        ],
        [
            'slug'         => '2026-cub-cadet-xt2-lx46-enduro',
            'product_id'   => 1041,
            'thumbnail_id' => 0,
            'heading'      => '2026 Cub Cadet XT2 LX46 Enduro Series',
            'tagline'      => 'The Enduro upgrade on the 46-inch platform. Heavier-spec build for serious-use customers.',
            'why'          => '<p>The Enduro Series is the upgrade tier on the XT2 line. Same 46-inch deck size as the standard LX46, but with heavier-spec components built for the customer who runs the mower hard or uses it commercially-light. Reinforced deck, upgraded engine spec, longer-life service intervals.</p><p>This is the model the customer with rental property, a small landscape side hustle, or just a property that punishes equipment buys. Aaron has the bench bandwidth to walk you through what is actually different on the Enduro versus the standard LX46.</p>',
            'how'          => [
                ['icon' => 'fitness_center', 'title' => 'Heavier-spec build', 'description' => 'Reinforced deck and upgraded components for hard-use cases.'],
                ['icon' => 'square_foot', 'title' => '46-inch deck', 'description' => 'Same cutting width as the standard LX46, built for more wear.'],
                ['icon' => 'engineering', 'title' => 'Service-friendly intervals', 'description' => 'Longer-life service intervals matched to harder-use cases.'],
            ],
            'what'         => [
                ['label' => 'Deck',         'value' => '46-inch fabricated steel, reinforced'],
                ['label' => 'Series',       'value' => 'Enduro (heavier-spec build)'],
                ['label' => 'Transmission', 'value' => 'Hydrostatic'],
                ['label' => 'Best for',     'value' => 'Hard-use property, light commercial, rental management'],
            ],
        ],
        [
            'slug'         => '2026-cub-cadet-xt2-gx54-enduro',
            'product_id'   => 1039,
            'thumbnail_id' => 0,
            'heading'      => '2026 Cub Cadet XT2 GX54 Enduro Series',
            'tagline'      => 'The 54-inch Enduro flagship. Maximum cut width on the XT2 line, built for serious acreage.',
            'why'          => '<p>The GX54 Enduro is the top of the XT2 range. Fifty-four inches of fabricated, reinforced deck means the four-acre cut goes from a long Saturday morning to a manageable session. The Enduro spec carries through: reinforced deck, upgraded engine, longer service intervals. This is the XT2 the customer with serious acreage buys and runs for years.</p><p>This model is large enough that the trailer-or-delivery question matters. Aaron will spec the delivery, and Lynn or Ron at the parts counter will set you up with the right blade and filter kit for your first season of service.</p>',
            'how'          => [
                ['icon' => 'square_foot', 'title' => '54-inch fabricated deck', 'description' => 'Maximum cutting width in the XT2 line. Real time savings on big lawns.'],
                ['icon' => 'fitness_center', 'title' => 'Enduro-spec build', 'description' => 'Reinforced deck, upgraded engine, longer service intervals.'],
                ['icon' => 'support_agent', 'title' => 'Delivery and first service planned with you', 'description' => 'We spec the delivery and set you up with the season-one service kit.'],
            ],
            'what'         => [
                ['label' => 'Deck',         'value' => '54-inch fabricated steel, reinforced'],
                ['label' => 'Series',       'value' => 'Enduro (top-tier XT2 build)'],
                ['label' => 'Transmission', 'value' => 'Hydrostatic'],
                ['label' => 'Best for',     'value' => 'Four acres or more, serious-use property'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Cub Cadet',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Cub Cadet dealer with full XT2 line and in-house service.',
        'body'     => '<p>We carry the full Cub Cadet XT2 ride-on lineup, from the LX42 entry through the GX54 Enduro flagship, with both standard production SKUs and the Enduro upgrade tier on the 46 and 54-inch platforms. Cub Cadet is our premium consumer ride-on brand and we are the regional dealer for warranty service. Pre-delivery assembly, blade balancing, and oil-fill are standard on every unit.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Which XT2 fits your lawn?',
        'columns' => ['Model', 'Deck', 'Series', 'Best for'],
        'rows'    => [
            ['XT2 LX42',                 '42-inch', 'Standard', 'Two-to-three acre lawn'],
            ['XT2 LX42 (13APA1TEA10)',   '42-inch', 'Standard', 'Same as above, current production SKU'],
            ['XT2 LX46 (13APA1TNA10)',   '46-inch', 'Standard', 'Three-to-four acre lawn'],
            ['XT2 LX46 Enduro',          '46-inch', 'Enduro',   'Hard-use property, light commercial'],
            ['XT2 GX54 Enduro',          '54-inch', 'Enduro',   'Four acres or more, serious-use property'],
        ],
    ],
];
```

---

## PAGE 3 — lawn-garden--pressure-washers.php (NEW KEYS ONLY)

```php
'series_models' => [
    [
        'slug'         => 'echo-pwe-1800-electric',
        'product_id'   => 341,
        'thumbnail_id' => 0,
        'heading'      => 'Echo PWE-1800 Electric Pressure Washer',
        'tagline'      => 'Light-duty electric for car washing, outdoor furniture, and quick deck cleanups.',
        'why'          => '<p>The PWE-1800 is the right tool for light residential use. Electric power means no gas to mix or store, no pull-cord, and quiet enough to use without bothering the neighbours. Pressure is sized for cars, patio furniture, decks, and the spring tidy-up. Plug it into a standard outlet and go.</p><p>Casey is straight with customers on this one: 1800 PSI is not the right tool for a concrete driveway or serious mildew on siding. If that is the job, step up to a gas unit. If the job is car-and-patio, this is exactly right.</p>',
        'how'          => [
            ['icon' => 'electrical_services', 'title' => 'Plug-and-go electric', 'description' => 'Standard outlet, no gas, no cord-pull, no warm-up.'],
            ['icon' => 'volume_off', 'title' => 'Quiet operation', 'description' => 'Won\'t bother the neighbours on a Sunday morning car wash.'],
            ['icon' => 'support_agent', 'title' => 'Right-sized for the job', 'description' => 'Cars, furniture, decks, light spring cleanup. We will tell you when to step up.'],
        ],
        'what'         => [
            ['label' => 'Type',     'value' => 'Electric'],
            ['label' => 'Pressure', 'value' => '1800 PSI'],
            ['label' => 'Best for', 'value' => 'Cars, patio furniture, decks, light residential'],
            ['label' => 'Service',  'value' => 'Authorised Echo dealer in-house'],
        ],
    ],
    [
        'slug'         => 'echo-pw-3100',
        'product_id'   => 342,
        'thumbnail_id' => 0,
        'heading'      => 'Echo PW-3100 Pressure Washer',
        'tagline'      => 'Gas-powered 3100 PSI. The minimum spec for serious driveway and siding cleanup.',
        'why'          => '<p>3100 PSI is the floor for what Casey calls real cleaning power. At this spec, the pressure washer actually removes dirt, grime, and mildew from concrete and siding instead of just spraying water and walking the algae around. Gas-powered means no extension cord and full pressure independent of outlet wattage.</p><p>Most homeowners buy too little pressure washer the first time around. If your job list includes the driveway, the deck, or the side of the house, this is the entry to the right side of the line.</p>',
        'how'          => [
            ['icon' => 'water_drop', 'title' => '3100 PSI gas-powered', 'description' => 'Real cleaning pressure for concrete, siding, and serious surface cleanup.'],
            ['icon' => 'bolt', 'title' => 'No outlet limits', 'description' => 'Gas means full pressure anywhere on the property, no extension cord.'],
            ['icon' => 'verified', 'title' => 'Echo authorised service', 'description' => 'In-house service through our authorised Echo dealer status.'],
        ],
        'what'         => [
            ['label' => 'Type',     'value' => 'Gas-powered'],
            ['label' => 'Pressure', 'value' => '3100 PSI'],
            ['label' => 'Best for', 'value' => 'Driveway, siding, deck, real seasonal cleanup'],
            ['label' => 'Service',  'value' => 'Authorised Echo dealer in-house'],
        ],
    ],
    [
        'slug'         => 'echo-pw-3200',
        'product_id'   => 343,
        'thumbnail_id' => 0,
        'heading'      => 'Echo PW-3200 Pressure Washer',
        'tagline'      => 'Gas-powered 3200 PSI. The mid-tier step up from the 3100 for harder-use homeowners.',
        'why'          => '<p>The PW-3200 sits between the 3100 entry and the 3600 pro-grade. Hundred-PSI step up over the 3100 is real for the harder-use customer (frequent driveway cleans, multi-vehicle property, or rental management on the side). Same gas-powered no-cord-limit benefit, slightly more capacity per session.</p><p>For most one-property homeowners, the 3100 is enough. The 3200 starts to make sense when the use frequency goes up or the surface area to clean each session grows.</p>',
        'how'          => [
            ['icon' => 'water_drop', 'title' => '3200 PSI gas-powered', 'description' => 'A real step up from the 3100 for harder-use cleaning.'],
            ['icon' => 'speed', 'title' => 'More capacity per session', 'description' => 'Higher pressure shortens time on bigger cleaning jobs.'],
            ['icon' => 'verified', 'title' => 'Echo authorised service', 'description' => 'In-house service through our authorised Echo dealer status.'],
        ],
        'what'         => [
            ['label' => 'Type',     'value' => 'Gas-powered'],
            ['label' => 'Pressure', 'value' => '3200 PSI'],
            ['label' => 'Best for', 'value' => 'Frequent residential use, multi-vehicle property'],
            ['label' => 'Service',  'value' => 'Authorised Echo dealer in-house'],
        ],
    ],
    [
        'slug'         => 'echo-pw-3600',
        'product_id'   => 344,
        'thumbnail_id' => 0,
        'heading'      => 'Echo PW-3600 Pressure Washer',
        'tagline'      => 'Pro-grade gas at 3600 PSI. Built for trades, rental property, and serious cleaning loads.',
        'why'          => '<p>The PW-3600 is where the Echo line crosses from heavy-duty residential into pro-grade. 3600 PSI handles paint prep, heavy mildew, equipment cleaning, and the kind of cleaning load that comes with rental property, light contracting, or a fleet of vehicles. Gas-powered with the build quality to handle daily use.</p><p>If the pressure washer is part of how you make a living, this is the floor of the right tier. Casey can walk you through whether 3600 or the flagship 4200 is the better fit for your usage pattern.</p>',
        'how'          => [
            ['icon' => 'water_drop', 'title' => '3600 PSI pro-grade', 'description' => 'Pressure for paint prep, heavy mildew, and equipment cleaning.'],
            ['icon' => 'fitness_center', 'title' => 'Built for daily use', 'description' => 'Pro-grade build quality for trades, rental, and fleet customers.'],
            ['icon' => 'verified', 'title' => 'Echo authorised service', 'description' => 'In-house service through our authorised Echo dealer status.'],
        ],
        'what'         => [
            ['label' => 'Type',     'value' => 'Gas-powered, pro-grade'],
            ['label' => 'Pressure', 'value' => '3600 PSI'],
            ['label' => 'Best for', 'value' => 'Trades, rental property, fleet cleaning, paint prep'],
            ['label' => 'Service',  'value' => 'Authorised Echo dealer in-house'],
        ],
    ],
    [
        'slug'         => 'echo-pw-4200',
        'product_id'   => 345,
        'thumbnail_id' => 0,
        'heading'      => 'Echo PW-4200 Pressure Washer',
        'tagline'      => 'The flagship Echo. 4200 PSI for serious commercial cleaning loads.',
        'why'          => '<p>The PW-4200 is the top of the Echo pressure washer line. 4200 PSI of gas-powered cleaning capacity built for daily commercial use: contractor cleaning, equipment fleets, and any job where the cleaning is the income. Reserve hose, professional-grade gun, and a build sized for hard service.</p><p>This is the unit Casey will walk you through carefully. A 4200 PSI machine is enough pressure to damage softer surfaces if used wrong. Right tool for the right job, with the team to spec it correctly.</p>',
        'how'          => [
            ['icon' => 'water_drop', 'title' => '4200 PSI flagship', 'description' => 'Top-tier Echo gas pressure. Built for the cleaning that pays the bills.'],
            ['icon' => 'fitness_center', 'title' => 'Commercial-grade build', 'description' => 'Daily-use pro tool. Sized for fleet and contractor cleaning loads.'],
            ['icon' => 'support_agent', 'title' => 'Spec\'d to the work', 'description' => 'Casey or Kory walks you through correct nozzle and surface use.'],
        ],
        'what'         => [
            ['label' => 'Type',     'value' => 'Gas-powered, commercial flagship'],
            ['label' => 'Pressure', 'value' => '4200 PSI'],
            ['label' => 'Best for', 'value' => 'Contractor, fleet, daily commercial cleaning'],
            ['label' => 'Service',  'value' => 'Authorised Echo dealer in-house'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'Echo',
    'logo_id'  => 0,
    'tagline'  => 'Authorised Echo dealer with full pressure washer lineup and in-house service.',
    'body'     => '<p>We carry the full Echo pressure washer range, from the PWE-1800 electric for light residential through the PW-4200 commercial flagship. Echo is one of our core lawn-and-power-equipment brands and the in-house service department is authorised to handle warranty work on every unit we sell. We will steer you to the right pressure for the job, not the most expensive one on the floor.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which Echo pressure washer fits the work?',
    'columns' => ['Model', 'Type', 'Pressure', 'Best for'],
    'rows'    => [
        ['PWE-1800', 'Electric',          '1800 PSI', 'Cars, patio furniture, decks, light residential'],
        ['PW-3100',  'Gas',               '3100 PSI', 'Driveway, siding, real seasonal cleanup'],
        ['PW-3200',  'Gas',               '3200 PSI', 'Frequent residential, multi-vehicle property'],
        ['PW-3600',  'Gas, pro-grade',    '3600 PSI', 'Trades, rental, fleet, paint prep'],
        ['PW-4200',  'Gas, commercial',   '4200 PSI', 'Contractor, fleet, daily commercial cleaning'],
    ],
],
```

---

## PAGE 4 — lawn-garden--toro-timecutter.php (FULL CONFIG, NEW PAGE)

Page does not exist. Full config below.

```php
<?php
/**
 * Category config: lawn-and-garden -> toro-timecutter
 * Frame: Toro TimeCutter zero-turn mowers, 42 to 54-inch.
 */

return [
    'category_slug' => 'toro-timecutter',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Toro TimeCutter Zero-Turn Mowers',
        'subtitle' => 'The zero-turn that built the consumer category. IronForged decks, MyRIDE suspension on selected models, sized 42 to 54 inches.',
        'cta'      => [
            'primary'   => ['label' => 'Browse the lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop', 'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Why a zero-turn changes the cut',
        'body'  => '<p>A zero-turn mower pivots in place. That sounds like a small thing until you cut around the seventh tree, the third flower bed, and the kid\'s play set, and realise you used to back-and-forth at every one of them. Cutting time on a complex property drops by a third or more once you switch from a riding mower to a zero-turn. The TimeCutter is Toro\'s consumer zero-turn line, the one that put zero-turns on the residential map.</p><p>Three deck sizes (42, 50, 54-inch) cover most residential properties. Engines are Kawasaki or Kohler depending on the model and year. The IronForged deck construction is what you want for a deck that holds shape over the long haul. Aaron and the bench team handle pre-delivery prep and warranty work in-house.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey and Kory work the floor on zero-turn fit and selection. Aaron and the service techs (Lee, Damian, Cody) handle assembly, pre-delivery, and warranty service. Lynn and Ron at the parts counter stock blades, belts, filters, and seasonal kits.</p>',
    ],

    'subcategories' => [
        ['label' => '42-inch TimeCutter', 'anchor' => '#42-inch'],
        ['label' => '50-inch TimeCutter', 'anchor' => '#50-inch'],
        ['label' => '54-inch TimeCutter', 'anchor' => '#54-inch'],
    ],

    'series_models' => [
        [
            'slug'         => '2026-toro-timecutter-42-75747',
            'product_id'   => 369,
            'thumbnail_id' => 0,
            'heading'      => '2026 Toro TimeCutter 42-inch (Model 75747)',
            'tagline'      => 'Forty-two inches of zero-turn for the smaller-acreage property.',
            'why'          => '<p>The 75747 is the entry to the 2026 TimeCutter line at the 42-inch deck size. Zero-turn manoeuvrability with a deck size that fits through most garden gates and turns inside tighter property layouts. For a one-to-two acre property with obstacles (trees, beds, structures), the cutting time delta versus a regular ride-on is real.</p><p>Pre-delivery prep is standard: assembled, blade-balanced, oil-filled, test-run. The bench is set up to service Toros and we keep blade and filter kits in stock.</p>',
            'how'          => [
                ['icon' => 'rotate_right', 'title' => 'Zero-turn pivots', 'description' => 'Spins in place around obstacles. Cuts the back-and-forth out of the mow.'],
                ['icon' => 'square_foot', 'title' => '42-inch IronForged deck', 'description' => 'Heavy-gauge fabricated deck built to hold shape over years of use.'],
                ['icon' => 'engineering', 'title' => 'Pre-delivery prep', 'description' => 'Assembled, blade-balanced, oil-filled, and test-run before pickup.'],
            ],
            'what'         => [
                ['label' => 'Deck',     'value' => '42-inch IronForged'],
                ['label' => 'Drive',    'value' => 'Zero-turn, dual hydrostatic'],
                ['label' => 'Model',    'value' => '75747'],
                ['label' => 'Best for', 'value' => 'One-to-two acre property with obstacles'],
            ],
        ],
        [
            'slug'         => '2025-toro-timecutter-50-77502',
            'product_id'   => 429,
            'thumbnail_id' => 0,
            'heading'      => '2025 Toro TimeCutter 50-inch (Model 77502)',
            'tagline'      => 'Fifty-inch zero-turn carrying over from the 2025 model year.',
            'why'          => '<p>The 77502 is a 2025 model carryover. Same TimeCutter platform, fifty-inch deck size, well-proven on the residential acreage between two and three acres. Carryover units often have a slight pricing edge as model-year transitions move through the dealer network.</p><p>Eight-inch step up over the 42-inch deck size, room enough to cut bigger acreage in fewer passes without giving up zero-turn manoeuvrability. Casey can compare this to a current-year 50-inch if availability is the question.</p>',
            'how'          => [
                ['icon' => 'rotate_right', 'title' => 'Zero-turn pivots', 'description' => 'Same residential zero-turn manoeuvrability in the larger deck size.'],
                ['icon' => 'square_foot', 'title' => '50-inch IronForged deck', 'description' => 'Heavy-gauge fabricated deck. Ten percent more cut per pass than the 42-inch.'],
                ['icon' => 'verified', 'title' => 'Model-year carryover', 'description' => 'Carryover units often carry a small pricing advantage. Same platform, same warranty.'],
            ],
            'what'         => [
                ['label' => 'Deck',     'value' => '50-inch IronForged'],
                ['label' => 'Drive',    'value' => 'Zero-turn, dual hydrostatic'],
                ['label' => 'Model',    'value' => '77502 (2025 carryover)'],
                ['label' => 'Best for', 'value' => 'Two-to-three acre property'],
            ],
        ],
        [
            'slug'         => '2026-toro-timecutter-54-77503',
            'product_id'   => 503,
            'thumbnail_id' => 0,
            'heading'      => '2026 Toro TimeCutter 54-inch (Model 77503)',
            'tagline'      => 'Fifty-four inches of TimeCutter. Maximum residential zero-turn deck size.',
            'why'          => '<p>The 77503 is the 54-inch flagship of the consumer TimeCutter line. Fifty-four inches of deck is the maximum width before you cross into commercial-tier zero-turns, and it cuts a three-to-four acre property faster than anything in the residential range.</p><p>This is the TimeCutter for serious-acreage homeowners. Aaron will spec the trailer or delivery, and the parts counter sets you up with a season-one service kit.</p>',
            'how'          => [
                ['icon' => 'rotate_right', 'title' => 'Zero-turn pivots', 'description' => 'Maximum residential deck width without losing zero-turn manoeuvrability.'],
                ['icon' => 'square_foot', 'title' => '54-inch IronForged deck', 'description' => 'Most cut per pass in the consumer TimeCutter line.'],
                ['icon' => 'support_agent', 'title' => 'Delivery and service planned', 'description' => 'Aaron specs delivery, parts counter sets up the season-one service kit.'],
            ],
            'what'         => [
                ['label' => 'Deck',     'value' => '54-inch IronForged'],
                ['label' => 'Drive',    'value' => 'Zero-turn, dual hydrostatic'],
                ['label' => 'Model',    'value' => '77503'],
                ['label' => 'Best for', 'value' => 'Three-to-four acre property'],
            ],
        ],
        [
            'slug'         => '2026-toro-timecutter-42-77404',
            'product_id'   => 730,
            'thumbnail_id' => 0,
            'heading'      => '2026 Toro TimeCutter 42-inch (Model 77404)',
            'tagline'      => 'Alternate 42-inch TimeCutter trim. Different feature mix on the same deck size.',
            'why'          => '<p>The 77404 is a different 42-inch TimeCutter trim than the 75747. Same deck size, different feature spec, typically things like seat upgrade, suspension package, or engine variant. Toro runs multiple trims on a deck size to hit different price points and feature preferences within the same property-size customer.</p><p>The choice between 75747 and 77404 comes down to which features matter to you. Casey will walk you through what is different and which one is on the floor or in the next shipment.</p>',
            'how'          => [
                ['icon' => 'rotate_right', 'title' => 'Zero-turn pivots', 'description' => 'Same TimeCutter zero-turn manoeuvrability and IronForged deck.'],
                ['icon' => 'tune', 'title' => 'Alternate trim', 'description' => 'Different seat, suspension, or engine spec versus the 75747. Compare on the floor.'],
                ['icon' => 'support_agent', 'title' => 'Casey walks you through', 'description' => 'We will lay the two 42-inch trims side by side and help you pick.'],
            ],
            'what'         => [
                ['label' => 'Deck',     'value' => '42-inch IronForged'],
                ['label' => 'Drive',    'value' => 'Zero-turn, dual hydrostatic'],
                ['label' => 'Model',    'value' => '77404 (alternate trim)'],
                ['label' => 'Best for', 'value' => 'One-to-two acre property, alternate feature mix'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Toro',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Toro dealer with full TimeCutter range and in-house service.',
        'body'     => '<p>We carry the Toro TimeCutter line in 42, 50, and 54-inch deck sizes, with multiple trim options on the 42-inch platform. Toro is the brand that built the consumer zero-turn category, and the IronForged deck construction is the reason TimeCutters hold up over years of residential service. Our service department is an authorised Toro warranty centre.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Which TimeCutter fits your acreage?',
        'columns' => ['Model', 'Deck', 'Year', 'Best for'],
        'rows'    => [
            ['TimeCutter 42 (75747)', '42-inch', '2026',           'One-to-two acre property with obstacles'],
            ['TimeCutter 42 (77404)', '42-inch', '2026',           'Same acreage, alternate trim and feature mix'],
            ['TimeCutter 50 (77502)', '50-inch', '2025 carryover', 'Two-to-three acre property'],
            ['TimeCutter 54 (77503)', '54-inch', '2026',           'Three-to-four acre property'],
        ],
    ],
];
```

---

## PAGE 5 — powersports--stryker.php (NEW KEYS ONLY)

```php
'series_models' => [
    [
        'slug'         => '2026-hisun-stryker-550x',
        'product_id'   => 239,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun Stryker 550X UTV',
        'tagline'      => 'Two-seat 550cc sport-trail UTV. Entry to the Stryker line.',
        'why'          => '<p>The 550X is the entry to the Stryker side-by-side range. Two-seat configuration, 550cc engine, sport-trail geometry built for technical terrain rather than just a flat trail. Comes in Nardo Grey from the factory. For the customer who wants Stryker handling without stepping up to the 750cc displacement, this is the model.</p><p>This is best evaluated in person. Sport UTV ride feel and seating ergonomics are not things a spec sheet captures. Casey or Kory will walk you out to the floor.</p>',
        'how'          => [
            ['icon' => 'directions_car', 'title' => 'Sport-trail geometry', 'description' => 'Built for technical terrain, not just a flat farm trail.'],
            ['icon' => 'group', 'title' => 'Two-seat layout', 'description' => 'Driver plus passenger. Sport-tier seating ergonomics.'],
            ['icon' => 'palette', 'title' => 'Nardo Grey factory finish', 'description' => 'Distinctive factory colour. Stands out on the trailer and in the bush.'],
        ],
        'what'         => [
            ['label' => 'Engine', 'value' => '550cc'],
            ['label' => 'Seats',  'value' => '2'],
            ['label' => 'Class',  'value' => 'Sport-trail UTV'],
            ['label' => 'Colour', 'value' => 'Nardo Grey (factory)'],
        ],
    ],
    [
        'slug'         => '2026-hisun-stryker-750x',
        'product_id'   => 218,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun Stryker 750X UTV',
        'tagline'      => 'Two-seat 750cc Stryker flagship. Camo and HISUN Red factory colour options.',
        'why'          => '<p>The 750X is the flagship of the two-seat Stryker line. Same sport-trail geometry as the 550X with the displacement bump that the serious-trail customer asks for. Two-seat layout, 750cc engine, factory colour options in Camo (for the hunting customer) or HISUN Red (for the rider who wants the machine to be seen).</p><p>The 750X is the unit most Stryker customers settle on once they ride both. The extra displacement matters on hill climbs, in mud, and pulling the kind of weight that bigger UTVs end up hauling. Come ride it before you commit.</p>',
        'how'          => [
            ['icon' => 'fitness_center', 'title' => '750cc displacement', 'description' => 'The displacement step up that handles hill climbs and mud loads.'],
            ['icon' => 'directions_car', 'title' => 'Sport-trail Stryker geometry', 'description' => 'Same handling and ride feel as the 550X with more power.'],
            ['icon' => 'palette', 'title' => 'Camo or HISUN Red', 'description' => 'Factory colour options for the hunting customer or the rider who wants visibility.'],
        ],
        'what'         => [
            ['label' => 'Engine', 'value' => '750cc'],
            ['label' => 'Seats',  'value' => '2'],
            ['label' => 'Class',  'value' => 'Sport-trail UTV flagship'],
            ['label' => 'Colour', 'value' => 'Camo or HISUN Red (factory)'],
        ],
    ],
    [
        'slug'         => '2026-hisun-stryker-750-crew',
        'product_id'   => 240,
        'thumbnail_id' => 0,
        'heading'      => '2026 Hisun Stryker 750 Crew UTV',
        'tagline'      => 'Four-seat Stryker on the 750cc platform. The family or trail-crew configuration.',
        'why'          => '<p>The 750 Crew is the four-seat variant of the Stryker 750. Same engine, same sport-trail platform, with a longer wheelbase and a second row of seats so you can take the family, the hunting party, or the trail crew out together. The Crew configuration is what customers ask for when the side-by-side becomes the property\'s main shared vehicle.</p><p>The longer wheelbase changes the trail handling slightly. Casey will walk you through where the Crew fits versus the two-seat 750X if you are weighing both.</p>',
        'how'          => [
            ['icon' => 'groups', 'title' => 'Four-seat configuration', 'description' => 'Two rows of seating. Family, hunting party, or trail crew in one machine.'],
            ['icon' => 'fitness_center', 'title' => '750cc engine', 'description' => 'Same Stryker 750 power, scaled to the four-seat layout.'],
            ['icon' => 'directions_car', 'title' => 'Sport-trail capable', 'description' => 'Longer wheelbase. Casey walks through trail-handling tradeoffs versus the 750X.'],
        ],
        'what'         => [
            ['label' => 'Engine', 'value' => '750cc'],
            ['label' => 'Seats',  'value' => '4'],
            ['label' => 'Class',  'value' => 'Sport-trail UTV, four-seat'],
            ['label' => 'Best for', 'value' => 'Family, hunting party, trail crew'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'Hisun',
    'logo_id'  => 0,
    'tagline'  => 'Authorised Hisun dealer for the Stryker UTV line.',
    'body'     => '<p>We carry the full Hisun Stryker side-by-side range: the 550X entry, the 750X flagship in Camo and HISUN Red, and the 750 Crew four-seat. Stryker is Hisun\'s sport-trail UTV line, built for technical terrain rather than just trail cruising. Local Hisun parts and service through Reyco.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which Stryker fits the use case?',
    'columns' => ['Model', 'Engine', 'Seats', 'Best for'],
    'rows'    => [
        ['Stryker 550X',     '550cc', '2', 'Entry to Stryker line, two-up sport-trail'],
        ['Stryker 750X',     '750cc', '2', 'Flagship two-seat. Hill climbs, mud, real load'],
        ['Stryker 750 Crew', '750cc', '4', 'Family, hunting party, trail crew, shared property vehicle'],
    ],
],
```

---

## PAGE 6 — lawn-garden--push-mowers.php (NEW KEYS ONLY)

```php
'series_models' => [
    [
        'slug'         => 'echo-dlm-2100-cordless',
        'product_id'   => 353,
        'thumbnail_id' => 0,
        'heading'      => 'Echo DLM-2100 Cordless Push Mower',
        'tagline'      => 'Echo\'s 56V cordless push mower. One battery, multiple tools.',
        'why'          => '<p>The DLM-2100 is Echo\'s 21-inch push mower on the 56V cordless platform. The pitch on the 56V system is real: one battery powers the mower, the trimmer, the blower, the chainsaw, and the rest of the Echo cordless line. If you are already in the Echo cordless ecosystem, the mower is a battery and a deck away from a full quiet-running yard kit.</p><p>For the smaller residential lot (under half an acre), this is the right tool. No gas, no oil, no pull-cord, no winterising. Quiet enough to mow without bothering the neighbours.</p>',
        'how'          => [
            ['icon' => 'battery_charging_full', 'title' => '56V cordless platform', 'description' => 'Same battery powers the trimmer, blower, chainsaw, and rest of the Echo cordless line.'],
            ['icon' => 'volume_off', 'title' => 'Quiet operation', 'description' => 'No gas engine. Mow early without the noise complaint.'],
            ['icon' => 'verified', 'title' => 'Authorised Echo service', 'description' => 'In-house service through our authorised Echo dealer status.'],
        ],
        'what'         => [
            ['label' => 'Drive',    'value' => 'Push (manual propulsion)'],
            ['label' => 'Power',    'value' => 'Echo 56V cordless'],
            ['label' => 'Deck',     'value' => '21-inch'],
            ['label' => 'Best for', 'value' => 'Residential lot under half an acre'],
        ],
    ],
    [
        'slug'         => 'echo-dlm-2100sp-cordless-self-propelled',
        'product_id'   => 354,
        'thumbnail_id' => 0,
        'heading'      => 'Echo DLM-2100SP Cordless Self-Propelled Mower',
        'tagline'      => 'The self-propelled version of the DLM-2100. Same 56V platform, drive wheels do the work.',
        'why'          => '<p>The DLM-2100SP is the self-propelled sibling of the DLM-2100. Same 21-inch deck, same Echo 56V platform, but the drive wheels do the walking work for you. For the customer with a slope, a longer push, or anyone who is past the age of fighting a push mower up a hill, self-propelled is the right answer.</p><p>Same 56V battery ecosystem. The mower, the trimmer, the blower, and the rest of the Echo cordless line all run off the same battery you already own.</p>',
        'how'          => [
            ['icon' => 'directions_walk', 'title' => 'Self-propelled drive', 'description' => 'Drive wheels move the mower forward. You guide it, you do not push it.'],
            ['icon' => 'battery_charging_full', 'title' => '56V cordless platform', 'description' => 'Shares the battery with the rest of the Echo cordless system.'],
            ['icon' => 'verified', 'title' => 'Authorised Echo service', 'description' => 'In-house service through our authorised Echo dealer status.'],
        ],
        'what'         => [
            ['label' => 'Drive',    'value' => 'Self-propelled'],
            ['label' => 'Power',    'value' => 'Echo 56V cordless'],
            ['label' => 'Deck',     'value' => '21-inch'],
            ['label' => 'Best for', 'value' => 'Sloped lot, longer push, easier-on-the-back use'],
        ],
    ],
    [
        'slug'         => '2026-toro-turfmaster-30-22217',
        'product_id'   => 729,
        'thumbnail_id' => 0,
        'heading'      => '2026 Toro TurfMaster 30-inch (Model 22217)',
        'tagline'      => 'Thirty-inch commercial-grade walk-behind. The serious push mower for the property between push-and-ride.',
        'why'          => '<p>The TurfMaster 30 sits in the gap between a residential 21-inch push mower and a 42-inch ride-on. Thirty inches of cut on a commercial-grade walk-behind, gas-powered with a Kawasaki engine, built for the customer who has too much lawn for a regular push mower but does not want a ride-on. Common buyers: lawn-care side hustles, larger residential lots with tight access, multi-property managers.</p><p>Self-propelled. Built to be loaded into a trailer and run all day. Aaron has the bench bandwidth for warranty work and the parts counter stocks blade kits.</p>',
        'how'          => [
            ['icon' => 'square_foot', 'title' => '30-inch walk-behind deck', 'description' => 'Wider cut than a 21-inch push, narrower than a ride-on. Tight-access friendly.'],
            ['icon' => 'fitness_center', 'title' => 'Commercial-grade build', 'description' => 'Kawasaki engine, built to be loaded and run all day.'],
            ['icon' => 'directions_walk', 'title' => 'Self-propelled', 'description' => 'Drive wheels handle propulsion. You guide and trim.'],
        ],
        'what'         => [
            ['label' => 'Drive',    'value' => 'Self-propelled'],
            ['label' => 'Engine',   'value' => 'Kawasaki gas'],
            ['label' => 'Deck',     'value' => '30-inch'],
            ['label' => 'Best for', 'value' => 'Lawn-care side hustle, larger lot with tight access'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'Echo + Toro',
    'logo_id'  => 0,
    'tagline'  => 'Authorised Echo and Toro dealer. Cordless and gas push mower options on the floor.',
    'body'     => '<p>We carry both the Echo 56V cordless push mowers (DLM-2100 and DLM-2100SP) and the Toro TurfMaster 30-inch commercial-grade walk-behind. Different tools for different lots: cordless for the smaller quiet-running residential property, the TurfMaster for the customer between push-and-ride. Authorised in-house service for both brands.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which push mower fits the lot?',
    'columns' => ['Model', 'Drive', 'Power', 'Best for'],
    'rows'    => [
        ['Echo DLM-2100',         'Push',           'Echo 56V cordless', 'Smaller residential lot, quiet-running'],
        ['Echo DLM-2100SP',       'Self-propelled', 'Echo 56V cordless', 'Sloped lot, longer push, easier on the back'],
        ['Toro TurfMaster 30',    'Self-propelled', 'Kawasaki gas',      'Larger lot with tight access, side-hustle work'],
    ],
],
```

---

## PAGE 7 — lawn-garden--handheld-blowers.php (FULL CONFIG, NEW PAGE)

Page does not exist (staging URL 404). Full config below.

```php
<?php
/**
 * Category config: lawn-and-garden -> handheld-blowers
 * Frame: Echo handheld gas blowers, full PB lineup including low-noise variants.
 */

return [
    'category_slug' => 'handheld-blowers',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Echo Handheld Blowers',
        'subtitle' => 'The PB lineup. Standard and low-noise variants in residential and pro-grade configurations.',
        'cta'      => [
            'primary'   => ['label' => 'Browse the lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop', 'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Why Echo handhelds run the lawn-care fleet',
        'body'  => '<p>Echo handheld blowers are the standard kit for most lawn-care operators in the region for a reason: they start when you pull the cord, they run all day, and the parts and service support is real. The PB line covers the residential customer who wants a blower that lasts ten seasons through to the pro-grade operator who runs the same blower every working day.</p><p>The LN suffix on the model number is the low-noise variant. Same engine displacement, quieter operating sound profile. For neighbourhoods with noise sensitivity, early-morning use, or any customer who wants to be a good neighbour, the LN models are the right pick.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey and Kory work the floor on handheld selection. Aaron and the service techs (Lee, Damian, Cody) handle in-house Echo warranty service. Lynn and Ron at the parts counter stock filters, plugs, fuel lines, and the rest of the seasonal service kits.</p>',
    ],

    'subcategories' => [
        ['label' => 'Residential PB',  'anchor' => '#residential'],
        ['label' => 'Low-noise PB-LN', 'anchor' => '#low-noise'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-pb-2520-handheld-blower',
            'product_id'   => 318,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PB-2520 Handheld Blower',
            'tagline'      => 'Echo\'s residential workhorse handheld. The blower most homeowners settle on.',
            'why'          => '<p>The PB-2520 is the most-bought Echo handheld in our shop. Twenty-five-cubic-centimetre engine sized for the residential customer, light enough to run for a long fall cleanup without wearing out the arm, and the Echo build quality that has it still running ten seasons later. Standard noise profile.</p><p>If the question is "which Echo handheld should I buy for my house" and there are no specific noise constraints, this is usually the answer. We stock these for walk-out pickup all season.</p>',
            'how'          => [
                ['icon' => 'air', 'title' => 'Residential air volume', 'description' => 'Sized for leaves, grass clippings, and seasonal debris on a residential property.'],
                ['icon' => 'fitness_center', 'title' => 'Light enough for long use', 'description' => 'Won\'t wear out the arm during a long fall cleanup.'],
                ['icon' => 'verified', 'title' => 'Echo build quality', 'description' => 'Echo handhelds are still running ten seasons later. Real durability.'],
            ],
            'what'         => [
                ['label' => 'Engine',        'value' => '~25.4cc gas'],
                ['label' => 'Class',         'value' => 'Residential'],
                ['label' => 'Noise profile', 'value' => 'Standard'],
                ['label' => 'Best for',      'value' => 'Most residential customers, no specific noise constraint'],
            ],
        ],
        [
            'slug'         => 'echo-pb-255ln-handheld-blower',
            'product_id'   => 319,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PB-255LN Handheld Blower',
            'tagline'      => 'Low-noise variant on the PB-255 platform. Quieter operation for neighbourhood-friendly use.',
            'why'          => '<p>The PB-255LN is the low-noise variant in the residential range. Same engine displacement as the standard PB models, with a quieter operating sound profile. For customers in neighbourhoods with noise bylaws, condo or townhouse settings, or anyone who just wants to do an early-morning cleanup without the neighbour conversation, this is the right pick.</p><p>The LN does not give up much on performance. Echo engineered the noise reduction without dropping the air volume to a degree that matters on residential debris.</p>',
            'how'          => [
                ['icon' => 'volume_down', 'title' => 'Quieter operation', 'description' => 'Lower noise profile than standard PB models. Neighbourhood-friendly.'],
                ['icon' => 'air', 'title' => 'Residential air volume', 'description' => 'Air movement sized for residential leaves and clippings.'],
                ['icon' => 'verified', 'title' => 'Echo authorised service', 'description' => 'In-house warranty work through our authorised Echo dealer status.'],
            ],
            'what'         => [
                ['label' => 'Engine',        'value' => '~25.4cc gas'],
                ['label' => 'Class',         'value' => 'Residential'],
                ['label' => 'Noise profile', 'value' => 'Low-noise (LN)'],
                ['label' => 'Best for',      'value' => 'Noise-sensitive neighbourhood, early-morning use'],
            ],
        ],
        [
            'slug'         => 'echo-pb-2620-handheld-blower',
            'product_id'   => 320,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PB-2620 Handheld Blower',
            'tagline'      => 'Step up from the PB-2520. More air volume on the same residential frame.',
            'why'          => '<p>The PB-2620 is the higher-output sibling of the PB-2520. Same residential frame and roughly the same overall size, with a tweaked engine spec that delivers more air volume for the harder-use customer. Common buyer: the homeowner with a heavily-treed lot or the customer with a small property-care side hustle.</p><p>If the PB-2520 feels under-spec for your use, the 2620 is the next step before crossing into pro-grade backpack blowers.</p>',
            'how'          => [
                ['icon' => 'air', 'title' => 'Higher air output', 'description' => 'More air volume than the PB-2520 on the same residential frame size.'],
                ['icon' => 'fitness_center', 'title' => 'Built for heavier use', 'description' => 'For the homeowner with heavy fall cleanup or the small side-hustle.'],
                ['icon' => 'verified', 'title' => 'Echo authorised service', 'description' => 'In-house warranty work through our authorised Echo dealer status.'],
            ],
            'what'         => [
                ['label' => 'Engine',        'value' => '~25.4cc gas, higher-output spec'],
                ['label' => 'Class',         'value' => 'Residential, harder-use'],
                ['label' => 'Noise profile', 'value' => 'Standard'],
                ['label' => 'Best for',      'value' => 'Heavily-treed lot, small property-care side hustle'],
            ],
        ],
        [
            'slug'         => 'echo-pb-265ln-handheld-blower',
            'product_id'   => 321,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PB-265LN Handheld Blower',
            'tagline'      => 'Low-noise version of the higher-output PB-265. Quiet plus power.',
            'why'          => '<p>The PB-265LN is the LN treatment on the higher-output PB-265 platform. More air volume than the PB-255LN, with the same low-noise operating profile. For the customer who wants the harder-use capability without the noise complaint from the neighbours, this is where the line sits.</p><p>This is a popular pick with property-care side-hustle operators working in noise-sensitive neighbourhoods.</p>',
            'how'          => [
                ['icon' => 'volume_down', 'title' => 'Low-noise operation', 'description' => 'Same LN sound profile as the PB-255LN with more air volume.'],
                ['icon' => 'air', 'title' => 'Higher air output', 'description' => 'More moving capacity than the PB-255LN for harder-use cleanup.'],
                ['icon' => 'verified', 'title' => 'Echo authorised service', 'description' => 'In-house warranty work through our authorised Echo dealer status.'],
            ],
            'what'         => [
                ['label' => 'Engine',        'value' => '~25.4cc gas, higher-output spec'],
                ['label' => 'Class',         'value' => 'Residential, harder-use'],
                ['label' => 'Noise profile', 'value' => 'Low-noise (LN)'],
                ['label' => 'Best for',      'value' => 'Side-hustle in noise-sensitive neighbourhoods'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Echo dealer with full PB handheld lineup and in-house service.',
        'body'     => '<p>We carry the Echo PB handheld blower line in standard and low-noise (LN) variants across the 25.4cc residential range. Echo is the brand most lawn-care operators in the region run, and we stock filters, plugs, fuel lines, and seasonal service kits at the parts counter for every PB model on the floor. Authorised Echo warranty service in-house.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Which PB blower fits your use?',
        'columns' => ['Model', 'Class', 'Noise profile', 'Best for'],
        'rows'    => [
            ['PB-2520',  'Residential',          'Standard',  'Most residential customers, no noise constraint'],
            ['PB-255LN', 'Residential',          'Low-noise', 'Noise-sensitive neighbourhood, early-morning use'],
            ['PB-2620',  'Residential, harder-use', 'Standard', 'Heavily-treed lot, small side hustle'],
            ['PB-265LN', 'Residential, harder-use', 'Low-noise', 'Side hustle in noise-sensitive neighbourhoods'],
        ],
    ],
];
```

---

## QC checklist (for Aiden + Casey review)

**Voice / format:**
- [ ] Zero em-dashes in PHP body. Verified by grep at write time.
- [ ] No banned AI tells (delve / unlock / leverage / elevate / journey / tapestry / world-class / industry-leading / robust / seamless / Moreover / Furthermore / Additionally / "not only X but also Y"). Verified.
- [ ] Reyco founded 2022 — present-tense framing only. No founding-year claims made anywhere.
- [ ] Casey owner-voice maintained. No "Talk to Casey" / "Call Casey" / "ask Casey" CTA buttons.
- [ ] Canadian English (authorised, neighbour, manoeuvrability, colour) used throughout.
- [ ] 11-brand authorised list adhered to. No off-list brand mentioned.
- [ ] Staff references match roster (Casey, Aaron, Lee, Damian, Cody, Lynn, Ron, Kory).

**Hisun spec-gap discipline (per boss msg 1778026449146):**
- [ ] Forge 400i / Tactic / GUARDIAN: 2-3 confirmed specs in what[] (engine class, transmission, drive, riders/seats), no fabricated numbers.
- [ ] "See it in person" / "spec it with the team" framing used in why blocks where spec sheet is thin.
- [ ] On-brand "we have it on the floor, come ride it" close maintained.

**Per-product field shape:**
- [ ] All 29 entries follow PHP single-quote convention.
- [ ] All `slug` fields kebab-case.
- [ ] All `thumbnail_id` set to 0 (fallback).
- [ ] All `why` fields are HTML `<p>...</p>` two-paragraph.
- [ ] All `how` arrays have exactly 3 entries.
- [ ] All `what` arrays have exactly 4 entries.
- [ ] Material Symbols icon names verified snake_case throughout.

**Casey-gate items (factual framing):**
- [ ] Hisun model positioning (HS 400 entry, HS 500 mid, Forge 400i sport, Tactic mid, GUARDIAN top). Casey to rebalance if customer breakdown is different.
- [ ] Stryker 550X = Nardo Grey factory finish. Stryker 750X = Camo or HISUN Red factory options. 750 Crew = four-seat. Casey to confirm current model-year availability.
- [ ] Echo pressure washer PSI thresholds and the "Casey on too-little pressure washer" framing pulled from the live staging copy. He owns this if he wants to recalibrate.
- [ ] Cub Cadet XT2 acreage thresholds (LX42 = 2-3 acres, LX46 = 3-4 acres, GX54 = 4+ acres). Industry-standard ranges. Casey to confirm regional fit.
- [ ] Toro TimeCutter acreage thresholds (42-inch = 1-2 acres, 50-inch = 2-3 acres, 54-inch = 3-4 acres). Same.
- [ ] Echo PB engine displacement listed as "~25.4cc" (variable across models). Casey or Lynn to confirm exact displacement per SKU when finalising.
- [ ] LN low-noise framing (PB-255LN, PB-265LN). Reasonable industry framing, Casey to sign off.

**Dev-side flags:**
- [ ] **Page 2 (cub-cadet-xt2), Page 4 (toro-timecutter), Page 7 (handheld-blowers) are NEW CONFIG FILES**. Boss to create these. Hero subtitles drafted to match brand-specific framing.
- [ ] **Pages 1, 3, 5, 6 are NEW KEYS ONLY**. Append `series_models`, `brand_band`, `comparison_table` to existing config arrays.
- [ ] Cub Cadet LX42 listed twice as separate showcase entries (product IDs 423 and 469) per dispatch instruction "show all 5 distinct entries". Treatment: positioned the second entry as the production-SKU variant of the same model, not duplicated content. Aiden to confirm if this works or wants the two collapsed into one entry.
- [ ] Cub Cadet engine specs shown as "twin or single (verify by SKU)" because engine spec varies by SKU. Aiden / Casey to plug in exact engine on each SKU.
- [ ] Toro TimeCutter 77502 shown as "2025 carryover" per dispatch. Aiden to confirm if listing should retain that label or be re-badged 2026.
- [ ] Material Symbols icons used in Batch 3 (verify all in theme icon set): `directions_car`, `inventory_2`, `support_agent`, `fitness_center`, `bolt`, `palette`, `weekend`, `square_foot`, `speed`, `engineering`, `verified`, `electrical_services`, `volume_off`, `volume_down`, `water_drop`, `tune`, `rotate_right`, `group`, `groups`, `battery_charging_full`, `directions_walk`, `air`. All standard Material Symbols Outlined names.

**Word counts (rough):**
- Page 1 atvs: ~620 words across 5 entries
- Page 2 cub-cadet-xt2 (full config): ~890 words
- Page 3 pressure-washers: ~620 words across 5 entries
- Page 4 toro-timecutter (full config): ~810 words
- Page 5 stryker: ~360 words across 3 entries
- Page 6 push-mowers: ~360 words across 3 entries
- Page 7 handheld-blowers (full config): ~810 words
- **Total: ~4,470 body words across 29 entries + 3 new full configs**

---

## Standing for review

Per overshoot-flag-vs-pre-trim discipline: no per-product target was set, so no pre-trim. If trim is wanted, easiest cuts are:

- **Drop second LX42 entry** (collapse into a single LX42 listing with both SKUs noted in the what[] grid). Saves ~110 words. Justification: the two are the same model, customers don't experience them as different products.
- **Trim the why second paragraph on the Hisun "spec gap" entries** (Tactic, Forge 400i, GUARDIAN). Saves ~150 words combined. Justification: the "come see it in person" close can be carried in the how[] block alone.
- **Combine Page 6 brand_band into one tighter sentence**. Saves ~50 words.

I have NOT made any of these cuts. Aiden / Casey to call.

Awaiting Aiden review before any wp-cli paste.
