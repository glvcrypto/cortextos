# Series Showcase Batch 2 — 4 Reyco category configs (23 product entries)

**For dev:** ready-to-paste PHP arrays for the series-showcase template (PR #175 / merged in Batch 1 plumb PR #178). Same shape and same voice as Batch 1.

**Source dispatch:** boss msg 1778025246085-boss-iioa6 + config-state map 1778025302735-boss-okzsl.

**Voice / format constraints (carried from Batch 1):**
- Canadian English (authorised, organised, specialise, colour, centre)
- Plain language for a 55-year-old plumber
- NO em-dashes anywhere (use period, comma, parens, en-dash for ranges only)
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022 — present-tense framing only. NO "60 years", "since 1964", family-history claims
- Casey owner-voice (we / our customers / first-person plural)
- NO "Talk to Casey" / "Call Casey" / "ask Casey" CTA copy
- Authorised brands: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- R&J Machine = Reyco's dock + lift partner (Lakefield, Ontario)
- Staff: Casey (sales floor), Aaron (co-owner / service), Lee / Damian / Cody (techs), Lynn / Ron (parts), Kory (sales)
- Geography: Sault Ste Marie + surrounding Northern Ontario lakes (Lake Superior, North Channel, Lake Huron, inland Algoma)

**Approval gate:** Aiden review before any wp-cli paste. Casey gate on R&J product framing (he sells these every day).

**Field shape (per boss spec, mirrors mp9.php):**

```php
[
    'slug'         => 'kebab-case-slug',
    'product_id'   => 0,
    'thumbnail_id' => 0,
    'heading'      => 'Display Heading',
    'tagline'      => 'one-line tagline',
    'why'          => '<p>Two-paragraph why section in HTML.</p>',
    'how'          => [
        ['icon' => 'material_symbol', 'title' => 'Title', 'description' => 'Description.'],
        ['icon' => 'material_symbol', 'title' => 'Title', 'description' => 'Description.'],
        ['icon' => 'material_symbol', 'title' => 'Title', 'description' => 'Description.'],
    ],
    'what'         => [
        ['label' => 'Label', 'value' => 'Value'],
        ['label' => 'Label', 'value' => 'Value'],
        ['label' => 'Label', 'value' => 'Value'],
        ['label' => 'Label', 'value' => 'Value'],
    ],
],
```

**Counts (23 entries total):**
- Page 1 fish-finders: 6 entries (Humminbird APEX 13 / 16 / 19, control-head-with-transducer + control-head-only paired upgrade choices). Excludes 282-285 MEGA Live 2 family (already showcased in Batch 1 /mega-live-2/ per dispatch instruction).
- Page 2 marine-electronics: 6 entries (Minn Kota MK-230/330/345/460 chargers + MKR-30 remote + MK-EC-15 cable). FULL config (page is missing per boss).
- Page 3 docks: 5 entries (R&J Truss Pipe / Floating Truss / LUX / WaveX / Lift-Up Step). Excludes Wave Armour Otter Swim Raft #303 per dispatch (not a dock).
- Page 4 boat-lifts: 6 entries (R&J Cantilever / Hydraulic / Vertical Pontoon / Hydro Extreme / Hidden-Beam / Marine Railway). Excludes R&J Roof System #299 per dispatch (canopy accessory, not a lift).

---

## PAGE 1 — boats-marine--fish-finders.php (NEW KEYS ONLY)

Existing config has hero / intro / experts / subcategories. Append the keys below.

```php
'series_models' => [
    [
        'slug'         => 'humminbird-apex-13-mega-si-plus',
        'product_id'   => 276,
        'thumbnail_id' => 0,
        'heading'      => 'Humminbird APEX 13 MEGA SI+',
        'tagline'      => 'A 13-inch flagship-tier chartplotter for the boat that lives on the water.',
        'why'          => '<p>The APEX 13 is the entry into the flagship line. Thirteen inches of high-resolution display gives you a view of MEGA Side Imaging plus your chart at the same time without crowding either one. For most centre-console and large bass-rig setups, this is the size that fits the dash and still earns its keep when you are running a Northern Ontario shoal at speed.</p><p>This is the head unit you buy when you want the same picture quality as the 16 or 19 but the dash space is the limit. Casey runs APEX customers through the boat layout before pricing it, because the right screen is the one that mounts cleanly and reads at a glance. Comes wired with a transducer so it is ready to fish out of the box.</p>',
        'how'          => [
            ['icon' => 'visibility', 'title' => 'MEGA Side Imaging+', 'description' => 'Side view of the bottom out to several hundred feet, at twice the clarity of older Side Imaging units.'],
            ['icon' => 'monitor', 'title' => '13-inch HD display', 'description' => 'High-resolution screen that splits clean four ways without losing detail. Reads in direct sun.'],
            ['icon' => 'cable', 'title' => 'Networkable across the boat', 'description' => 'Pair with a bow unit, share waypoints, run Cannon downriggers from the dash.'],
        ],
        'what'         => [
            ['label' => 'Screen', 'value' => '13 inch HD'],
            ['label' => 'Sonar', 'value' => 'MEGA Side Imaging+, MEGA Down Imaging+, CHIRP'],
            ['label' => 'GPS', 'value' => 'Internal, Humminbird Basemap pre-loaded'],
            ['label' => 'Includes', 'value' => 'Transducer (ready to install)'],
        ],
    ],
    [
        'slug'         => 'humminbird-apex-13-mega-si-plus-cho',
        'product_id'   => 277,
        'thumbnail_id' => 0,
        'heading'      => 'Humminbird APEX 13 MEGA SI+ (Control Head Only)',
        'tagline'      => 'The APEX 13 head unit on its own, for boats that already have a transducer worth keeping.',
        'why'          => '<p>The Control Head Only version is for the customer upgrading from an older Humminbird Helix or Solix and keeping the existing transducer. Same screen, same sonar processing, same chart engine as the bundled APEX 13. You skip the cost of a second transducer if the one on the boat is still doing its job.</p><p>Important note from the parts counter: not every transducer talks to APEX. Lynn and Ron will check the part number on your existing transducer before we order this one in. If it is not compatible, the bundled version costs the same once you add a transducer separately, so we walk you through the math before you commit.</p>',
        'how'          => [
            ['icon' => 'sync_alt', 'title' => 'Reuse your transducer', 'description' => 'Save the cost of a new transducer if your current one is APEX-compatible.'],
            ['icon' => 'inventory_2', 'title' => 'Same head unit', 'description' => 'Identical screen, sonar processing, and chart engine to the bundled APEX 13.'],
            ['icon' => 'fact_check', 'title' => 'Compatibility checked first', 'description' => 'Lynn or Ron at the parts counter confirms your transducer talks to APEX before the order goes in.'],
        ],
        'what'         => [
            ['label' => 'Screen', 'value' => '13 inch HD'],
            ['label' => 'Sonar engine', 'value' => 'MEGA Side Imaging+, MEGA Down Imaging+, CHIRP'],
            ['label' => 'GPS', 'value' => 'Internal, Humminbird Basemap pre-loaded'],
            ['label' => 'Includes', 'value' => 'Head unit only (bring your own transducer)'],
        ],
    ],
    [
        'slug'         => 'humminbird-apex-16-mega-si-plus',
        'product_id'   => 278,
        'thumbnail_id' => 0,
        'heading'      => 'Humminbird APEX 16 MEGA SI+',
        'tagline'      => 'A 16-inch flagship for the boat that runs hard and the eyes that need to read it at a glance.',
        'why'          => '<p>The APEX 16 is the size most serious anglers and big-boat owners settle on. Sixteen inches gives you room to run a four-pane split with chart, side imaging, down imaging, and a 2D sonar return all at once, and every pane stays readable. For walleye guys jigging structure on Lake Superior or muskie hunters working the North Channel, this is the screen that earns its dash space.</p><p>The other case for the 16 over the 13: distance. If your helm is more than an arm reach from the seat, the bigger screen reads at a glance instead of forcing you to lean in. Aaron and the service crew will walk you through the dash cutout, the wiring run, and where the fuse panel ties in before the install is scheduled.</p>',
        'how'          => [
            ['icon' => 'visibility', 'title' => 'MEGA Side Imaging+', 'description' => 'Hi-res side view of bottom structure, brush, and bait pods at twice the clarity of older units.'],
            ['icon' => 'monitor', 'title' => '16-inch HD display', 'description' => 'Four-pane split stays readable at glance distance. Designed for direct sun and bouncing water.'],
            ['icon' => 'hub', 'title' => 'Full network ready', 'description' => 'Talks to bow units, downriggers, and other APEX heads on the boat over the Humminbird network.'],
        ],
        'what'         => [
            ['label' => 'Screen', 'value' => '16 inch HD'],
            ['label' => 'Sonar', 'value' => 'MEGA Side Imaging+, MEGA Down Imaging+, CHIRP'],
            ['label' => 'GPS', 'value' => 'Internal, Humminbird Basemap pre-loaded'],
            ['label' => 'Includes', 'value' => 'Transducer (ready to install)'],
        ],
    ],
    [
        'slug'         => 'humminbird-apex-16-mega-si-plus-cho',
        'product_id'   => 279,
        'thumbnail_id' => 0,
        'heading'      => 'Humminbird APEX 16 MEGA SI+ (Control Head Only)',
        'tagline'      => 'The 16-inch APEX head, ready to wire into the transducer you already trust.',
        'why'          => '<p>Same play as the 13 CHO. You are upgrading the screen, not the transducer. If your APEX-compatible transducer is in good shape, the Control Head Only version puts a 16-inch flagship display at the helm without the duplicate hardware cost.</p><p>The trade is one phone call to the parts counter to verify compatibility. We do not want you to buy this and find out the transducer plug does not match. Lynn or Ron checks the part number, confirms the cable, and orders the right unit in.</p>',
        'how'          => [
            ['icon' => 'sync_alt', 'title' => 'Keep your transducer', 'description' => 'Skip the duplicate cost when your current APEX-compatible transducer is still going strong.'],
            ['icon' => 'monitor', 'title' => '16-inch HD upgrade', 'description' => 'Same flagship sonar engine and chart suite as the bundled APEX 16, in head-only form.'],
            ['icon' => 'fact_check', 'title' => 'Parts counter verifies first', 'description' => 'Compatibility confirmed before the order ships. No surprises at install.'],
        ],
        'what'         => [
            ['label' => 'Screen', 'value' => '16 inch HD'],
            ['label' => 'Sonar engine', 'value' => 'MEGA Side Imaging+, MEGA Down Imaging+, CHIRP'],
            ['label' => 'GPS', 'value' => 'Internal, Humminbird Basemap pre-loaded'],
            ['label' => 'Includes', 'value' => 'Head unit only (bring your own transducer)'],
        ],
    ],
    [
        'slug'         => 'humminbird-apex-19-mega-si-plus',
        'product_id'   => 280,
        'thumbnail_id' => 0,
        'heading'      => 'Humminbird APEX 19 MEGA SI+',
        'tagline'      => 'The 19-inch flagship for offshore boats, charter rigs, and the dash that has the room.',
        'why'          => '<p>Nineteen inches is where APEX moves from "big screen" to "dashboard". This is the unit you put on a 23 to 30-foot offshore boat or a charter rig where the captain runs four panes hard the entire trip. Side imaging at this scale picks out structure detail you would miss on a smaller screen, and the chart panel reads like a paper map.</p><p>This is also the size most networked-boat owners settle on at the helm, with smaller APEX heads on the bow or the live well. If you are wiring a system from scratch, Aaron sits down with the layout and we spec the run together. APEX networks tie everything to one waypoint library and one chart card.</p>',
        'how'          => [
            ['icon' => 'visibility', 'title' => 'MEGA Side Imaging+', 'description' => 'Wide-format side view that picks out structure detail finer than a smaller screen can resolve.'],
            ['icon' => 'monitor', 'title' => '19-inch HD display', 'description' => 'Four-pane multitasking at full readability. Built for offshore helm distance.'],
            ['icon' => 'hub', 'title' => 'Anchor of a networked boat', 'description' => 'Pairs with bow APEX units, Cannon downriggers, and Minn Kota i-Pilot for one-system control.'],
        ],
        'what'         => [
            ['label' => 'Screen', 'value' => '19 inch HD'],
            ['label' => 'Sonar', 'value' => 'MEGA Side Imaging+, MEGA Down Imaging+, CHIRP'],
            ['label' => 'GPS', 'value' => 'Internal, Humminbird Basemap pre-loaded'],
            ['label' => 'Includes', 'value' => 'Transducer (ready to install)'],
        ],
    ],
    [
        'slug'         => 'humminbird-apex-19-mega-si-plus-cho',
        'product_id'   => 281,
        'thumbnail_id' => 0,
        'heading'      => 'Humminbird APEX 19 MEGA SI+ (Control Head Only)',
        'tagline'      => 'The 19-inch APEX head on its own, for the rig already wired for upgrade.',
        'why'          => '<p>The same upgrade story at the largest screen size. If the boat is already running a compatible APEX transducer (or a Solix transducer that crosses over with the right cable), the Control Head Only version puts the 19-inch flagship in the dash without paying twice for hardware that is already there.</p><p>Compatibility check first, every time. The parts counter confirms transducer, cable, and network configuration before the order goes in. Wiring on a 19-inch helm install also takes some planning, so the service team likes to look at the boat before final order.</p>',
        'how'          => [
            ['icon' => 'sync_alt', 'title' => 'Keep your transducer', 'description' => 'Reuse the APEX or compatible Solix transducer already on the boat.'],
            ['icon' => 'monitor', 'title' => '19-inch flagship head', 'description' => 'Identical sonar engine, chart suite, and network capability as the bundled APEX 19.'],
            ['icon' => 'engineering', 'title' => 'Service team scopes the install', 'description' => 'Aaron or one of the techs walks the boat before the final order on a 19-inch helm setup.'],
        ],
        'what'         => [
            ['label' => 'Screen', 'value' => '19 inch HD'],
            ['label' => 'Sonar engine', 'value' => 'MEGA Side Imaging+, MEGA Down Imaging+, CHIRP'],
            ['label' => 'GPS', 'value' => 'Internal, Humminbird Basemap pre-loaded'],
            ['label' => 'Includes', 'value' => 'Head unit only (bring your own transducer)'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'Humminbird',
    'logo_id'  => 0,
    'tagline'  => 'Authorised Humminbird APEX dealer.',
    'body'     => '<p>We carry the full APEX flagship line in 13, 16, and 19-inch sizes, both bundled with transducer and Control Head Only. APEX is the top tier of the Humminbird range, designed for serious anglers and offshore captains who want the largest screens, the cleanest MEGA Side Imaging picture, and a network that ties the whole boat together. We also stock and service the full Humminbird MEGA Live 2 family, the XPLORE shuttle line, and ICE conversion accessories on the side category.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which APEX size is right for your dash?',
    'columns' => ['Model', 'Screen', 'Best for', 'Includes transducer'],
    'rows'    => [
        ['APEX 13 MEGA SI+',         '13 inch', 'Centre console, mid-size bass rig, family open-bow',          'Yes'],
        ['APEX 13 MEGA SI+ CHO',     '13 inch', 'Upgrade from Helix or Solix, transducer already on boat',     'No'],
        ['APEX 16 MEGA SI+',         '16 inch', 'Serious tournament rig, big-boat helm, four-pane split daily', 'Yes'],
        ['APEX 16 MEGA SI+ CHO',     '16 inch', 'Mid-tier upgrade, keeping a compatible transducer',           'No'],
        ['APEX 19 MEGA SI+',         '19 inch', 'Offshore boat, charter rig, networked-boat anchor head',      'Yes'],
        ['APEX 19 MEGA SI+ CHO',     '19 inch', 'Top-tier upgrade with compatible transducer in place',         'No'],
    ],
],
```

---

## PAGE 2 — boats-marine--marine-electronics.php (FULL CONFIG, NEW PAGE)

Boss flagged this config does not exist. Full config below with hero / intro / experts / subcategories / new keys. Hero subtitle frames the page as "Power, Charging, and Wiring" so customers landing from the URL understand the products are battery management gear, not sonar or finders.

```php
<?php
/**
 * Category config: boats-and-marine -> marine-electronics
 * Frame: power management, on-board charging, and wiring for marine electrical systems.
 */

return [
    'category_slug' => 'marine-electronics',
    'parent_slug'   => 'boats-and-marine',

    'hero' => [
        'title'    => 'Marine Electronics: Power, Charging, and Wiring',
        'subtitle' => 'Battery chargers, remote power switches, and extension cables for the boat that is wired to fish all day. Built for shore power and shore weather.',
        'cta'      => [
            'primary'   => ['label' => 'Browse the lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop', 'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Why your boat needs the right charger, not just any charger',
        'body'  => '<p>The trolling motor, the live wells, the depth finder, and the stereo all run on the same battery bank you charge between trips. The wrong charger guesses at the bank state and either undercharges (so the trolling motor dies on Saturday morning) or overcharges (so the bank life drops by half). The Minn Kota Precision line we stock is digital and bank-aware, which means it reads each battery and charges it on its own profile. That is the difference between a battery that lasts five seasons and a battery that lasts two.</p><p>Wiring matters too. We carry the genuine Minn Kota extension cables in bulk, the MKR-30 remote power switch for clean handlebar-mount on/off control, and we order any related Minn Kota accessory through the parts counter. Casey or Kory can walk you through the right combination based on the trolling motor and battery setup you already run.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>The parts counter (Lynn and Ron) handles charger fitment, cable lengths, and terminal compatibility. Aaron and the service techs (Lee, Damian, Cody) handle the install when you want the charger wired in by the bench. Casey and Kory work the floor if you are deciding which model fits your boat.</p>',
    ],

    'subcategories' => [
        ['label' => 'On-Board Battery Chargers', 'anchor' => '#chargers'],
        ['label' => 'Remote Power Switches',     'anchor' => '#switches'],
        ['label' => 'Extension Cables',          'anchor' => '#cables'],
    ],

    'series_models' => [
        [
            'slug'         => 'minn-kota-mk-230-pcl',
            'product_id'   => 254,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota MK 230 PCL',
            'tagline'      => 'Two-bank, 15-amp-per-bank Precision charger for the smaller bass rig or runabout.',
            'why'          => '<p>The MK 230 PCL is the right charger for the boat with two batteries, typically a starting battery and a single trolling motor battery. Fifteen amps per bank means a full charge overnight, even on a deep-cycle that has been pushed hard. The Precision line is digital and bank-aware, so each battery gets read and charged on its own profile rather than the old "guess and hope" approach.</p><p>Built for marine install: fully sealed, vibration-tested, and rated to live in the engine compartment or under the gunwale. We stock these for walk-out pickup and Aaron has the bench bandwidth to wire it in if you want it done at the shop.</p>',
            'how'          => [
                ['icon' => 'battery_charging_full', 'title' => 'Two banks, 15 amps each', 'description' => 'Full charge overnight on most marine deep-cycle batteries. No bank starves.'],
                ['icon' => 'sensors', 'title' => 'Digital and bank-aware', 'description' => 'Reads each battery and runs the right multi-stage charge profile for it.'],
                ['icon' => 'shield', 'title' => 'Built for marine install', 'description' => 'Sealed, vibration-tested, rated for the engine bay or under-gunwale mount.'],
            ],
            'what'         => [
                ['label' => 'Banks',     'value' => '2'],
                ['label' => 'Amperage',  'value' => '15 amps per bank (30 amps total)'],
                ['label' => 'AC input',  'value' => '120V'],
                ['label' => 'Best for',  'value' => 'Bass rig, runabout, two-battery setup'],
            ],
        ],
        [
            'slug'         => 'minn-kota-mk-330-pc',
            'product_id'   => 255,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota MK 330 PC',
            'tagline'      => 'Three-bank, 10-amp-per-bank Precision charger for the mid-size rig with a deeper bank count.',
            'why'          => '<p>The MK 330 PC adds a third bank for boats running a starting battery and two trolling motor batteries (a 24-volt setup) or a starter plus a house and a trolling battery. Ten amps per bank handles overnight charging on most marine deep-cycle batteries without the higher 15-amp current that the heavier-duty PCL units push.</p><p>This is the workhorse charger for the customer who wants reliable bank-aware charging without paying for amperage they do not need. Lynn and Ron will check your battery sizes and current draw before recommending this over the 345 PCL.</p>',
            'how'          => [
                ['icon' => 'battery_charging_full', 'title' => 'Three banks, 10 amps each', 'description' => 'Right-sized for 24-volt trolling setups or starter-plus-house-plus-trolling configurations.'],
                ['icon' => 'sensors', 'title' => 'Bank-independent charging', 'description' => 'Each bank reads its own battery state and charges on its own profile.'],
                ['icon' => 'verified', 'title' => 'The reliable middle option', 'description' => 'Mid-amperage charging for boats that do not need PCL-grade current.'],
            ],
            'what'         => [
                ['label' => 'Banks',     'value' => '3'],
                ['label' => 'Amperage',  'value' => '10 amps per bank (30 amps total)'],
                ['label' => 'AC input',  'value' => '120V'],
                ['label' => 'Best for',  'value' => '24V trolling rig, mid-size fishing boat'],
            ],
        ],
        [
            'slug'         => 'minn-kota-mk-345-pcl',
            'product_id'   => 256,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota MK 345 PCL',
            'tagline'      => 'Three-bank, 15-amp-per-bank Precision charger for the rig that asks more of its batteries.',
            'why'          => '<p>The MK 345 PCL is the higher-output sibling of the MK 330. Same three banks, same digital bank-aware charging, but each bank pushes 15 amps instead of 10. The extra current cuts overnight charge time on larger deep-cycle batteries and recovers a hard-used bank faster between trips. For tournament walleye and bass guys running long days on the trolling motor, that overnight recovery matters.</p><p>The PCL line is the current-generation Precision charger, with refined charging algorithms and a tighter end-of-charge cutoff than the older PC line. Pairs cleanly with the MK-EC-15 extension cable if your batteries are mounted away from the install location.</p>',
            'how'          => [
                ['icon' => 'bolt', 'title' => 'Three banks, 15 amps each', 'description' => 'Faster overnight recovery than the 330 on the same battery sizes.'],
                ['icon' => 'sensors', 'title' => 'PCL-generation algorithm', 'description' => 'Refined multi-stage charging with tighter end-of-charge control than the older PC units.'],
                ['icon' => 'cable', 'title' => 'Plays nice with extensions', 'description' => 'Pairs with the genuine MK-EC-15 extension cable when batteries are mounted away from the install spot.'],
            ],
            'what'         => [
                ['label' => 'Banks',     'value' => '3'],
                ['label' => 'Amperage',  'value' => '15 amps per bank (45 amps total)'],
                ['label' => 'AC input',  'value' => '120V'],
                ['label' => 'Best for',  'value' => 'Tournament rig, larger bank, faster recovery'],
            ],
        ],
        [
            'slug'         => 'minn-kota-mk-460-pcl',
            'product_id'   => 257,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota MK 460 PCL',
            'tagline'      => 'Four-bank, 15-amp-per-bank flagship charger for the heavy fishing rig or pontoon.',
            'why'          => '<p>The MK 460 PCL is the charger for the boat with four batteries on board. Typical setups: a starter, two trolling motor batteries (24 or 36-volt), and a house battery for the live wells, lights, and electronics. Four banks of 15 amps each gives every battery its own charging channel, so the trolling banks are not held back waiting for the house bank to top up.</p><p>This is the unit Casey points big-boat owners and pontoon customers toward when the electrical load is real. The PCL algorithm is designed for the kind of multi-bank, varying-state-of-charge configuration that breaks lesser chargers. Aaron will install it at the shop if you want a clean wiring run.</p>',
            'how'          => [
                ['icon' => 'bolt', 'title' => 'Four banks, 15 amps each', 'description' => 'Sixty amps total. Every battery on its own dedicated charging channel.'],
                ['icon' => 'inventory_2', 'title' => 'Built for full-system rigs', 'description' => 'The right charger for 36V trolling plus starter plus house bank configurations.'],
                ['icon' => 'engineering', 'title' => 'Shop install available', 'description' => 'Aaron and the service crew can wire and mount the MK 460 cleanly at the bench.'],
            ],
            'what'         => [
                ['label' => 'Banks',     'value' => '4'],
                ['label' => 'Amperage',  'value' => '15 amps per bank (60 amps total)'],
                ['label' => 'AC input',  'value' => '120V'],
                ['label' => 'Best for',  'value' => '36V trolling rigs, pontoons, big fishing boats'],
            ],
        ],
        [
            'slug'         => 'minn-kota-remote-power-switch-mkr-30',
            'product_id'   => 258,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Remote Power Switch MKR-30',
            'tagline'      => 'Handlebar-mount on/off switch for clean trolling motor power control.',
            'why'          => '<p>The MKR-30 is a small but worth-it accessory. It puts a power-on/power-off switch within thumb reach on the trolling motor handle, so you can kill the system without reaching back to the battery box or pulling the breaker. For cold mornings, heavy gloves, or when you just want to shut the motor down between spots, it is the difference between a clean exit and fumbling at the stern.</p><p>Genuine Minn Kota part. Wires inline with the trolling motor positive lead and adds about thirty seconds to the daily routine. We stock these for walk-out pickup.</p>',
            'how'          => [
                ['icon' => 'power_settings_new', 'title' => 'Thumb-reach power control', 'description' => 'Mounted on the trolling motor handlebar. Kill power without leaving the bow.'],
                ['icon' => 'verified', 'title' => 'Genuine Minn Kota part', 'description' => 'Designed and warrantied by the trolling motor manufacturer.'],
                ['icon' => 'handyman', 'title' => 'Wires inline in minutes', 'description' => 'Spliced into the positive lead from the battery to the motor. Quick install.'],
            ],
            'what'         => [
                ['label' => 'Mount',      'value' => 'Trolling motor handlebar'],
                ['label' => 'Wiring',     'value' => 'Inline on positive battery lead'],
                ['label' => 'Compatible', 'value' => 'All Minn Kota trolling motors'],
                ['label' => 'In stock',   'value' => 'Walk-out pickup'],
            ],
        ],
        [
            'slug'         => 'minn-kota-mk-ec-15-extension-cable-bulk',
            'product_id'   => 259,
            'thumbnail_id' => 0,
            'heading'      => 'Minn Kota Battery Charger Extension Cable MK-EC-15 (Bulk)',
            'tagline'      => 'Fifteen-foot extension cable for the install where the charger and the batteries are not next to each other.',
            'why'          => '<p>The MK-EC-15 is a fifteen-foot heavy-gauge extension that lets you mount the charger somewhere convenient and run the leads back to the battery bank. Common scenarios: charger mounted in the console or under the gunwale, batteries down in the bilge or in a bow box. The bulk packaging is what trade and dealer-install customers want, no retail clamshell.</p><p>Genuine Minn Kota cable means the gauge is right for the current the PCL chargers push. Aftermarket extensions often undersize the conductor and cause voltage drop that the digital charger reads as a low battery. Stick with genuine when you are using a Precision charger.</p>',
            'how'          => [
                ['icon' => 'straighten', 'title' => '15 feet of reach', 'description' => 'Mount the charger anywhere on the boat, run leads back to the batteries.'],
                ['icon' => 'verified', 'title' => 'Genuine Minn Kota gauge', 'description' => 'Sized correctly for PCL charger current. Aftermarket cables can undersize the conductor.'],
                ['icon' => 'inventory_2', 'title' => 'Bulk packaging', 'description' => 'Trade and dealer-install format. No retail clamshell.'],
            ],
            'what'         => [
                ['label' => 'Length',    'value' => '15 feet'],
                ['label' => 'Use with',  'value' => 'Minn Kota Precision (PCL and PC) chargers'],
                ['label' => 'Format',    'value' => 'Bulk'],
                ['label' => 'Genuine',   'value' => 'Yes (Minn Kota OEM)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Minn Kota',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Minn Kota dealer for trolling motors, on-board chargers, and accessories.',
        'body'     => '<p>We carry the full Minn Kota Precision On-Board Charger lineup (the PCL and PC family) plus the MKR-30 Remote Power Switch and genuine MK-EC extension cables in bulk. Genuine Minn Kota means the warranty stays valid and the charging current is sized for the cable. We are the regional Minn Kota dealer for Sault Ste Marie, the North Channel, and the inland Algoma lakes.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Which Minn Kota charger fits your bank?',
        'columns' => ['Model', 'Banks', 'Amps per bank', 'Total amps', 'Best for'],
        'rows'    => [
            ['MK 230 PCL', '2', '15A', '30A', 'Bass rig, runabout, two-battery setup'],
            ['MK 330 PC',  '3', '10A', '30A', '24V trolling rig, mid-size boat'],
            ['MK 345 PCL', '3', '15A', '45A', 'Tournament rig, faster recovery'],
            ['MK 460 PCL', '4', '15A', '60A', '36V trolling, pontoon, full electrical loadout'],
        ],
    ],
];
```

---

## PAGE 3 — docks-and-lifts--docks.php (NEW KEYS ONLY)

Existing config has hero / intro / experts / subcategories / why_choose. Append the keys below. Wave Armour Otter Swim Raft 8x10 (#303) excluded per dispatch (not a dock, stays on the WC category but skipped here).

```php
'series_models' => [
    [
        'slug'         => 'rj-truss-pipe-dock-aluminum',
        'product_id'   => 289,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Truss Pipe Dock (Aluminum)',
        'tagline'      => 'The classic permanent-style aluminum pipe dock for solid-bottom Northern Ontario lakefronts.',
        'why'          => '<p>The Truss Pipe Dock is the workhorse of the R&J lineup. Aluminum frame on adjustable pipe legs, set into the lake bed, with a truss span between sections that makes the whole assembly walk like a sidewalk instead of a wobbly raft. For shoreline customers with a firm, gradual bottom (Algoma inland lakes, much of the North Channel), this is the dock the family puts in once and uses for the next twenty seasons.</p><p>Built and quoted through R&J Machine in Lakefield, Ontario. Reyco coordinates the site visit, the spec, the order, and the install timing. R&J cuts to your shoreline measurements, and we handle the on-water side.</p>',
        'how'          => [
            ['icon' => 'water', 'title' => 'Built for solid bottoms', 'description' => 'Pipe legs adjust to the lake bed. Best fit for firm, gradual shorelines.'],
            ['icon' => 'verified', 'title' => 'Aluminum frame', 'description' => 'Marine-grade aluminum that does not rust, salt or freshwater.'],
            ['icon' => 'engineering', 'title' => 'Spec and install through Reyco', 'description' => 'We handle the site visit, R&J cuts to your measurements, install scheduled together.'],
        ],
        'what'         => [
            ['label' => 'Material',    'value' => 'Marine-grade aluminum'],
            ['label' => 'Style',       'value' => 'Permanent pipe dock with truss span'],
            ['label' => 'Best fit',    'value' => 'Firm, gradual lake bed'],
            ['label' => 'Built by',    'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-floating-truss-dock',
        'product_id'   => 290,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Floating Truss Dock',
        'tagline'      => 'Floating dock with R&J truss-frame stability for variable depth or soft-bottom shoreline.',
        'why'          => '<p>If your shoreline drops fast, the bottom is mucky, or the water level swings five feet between spring and fall, a floating dock is the right call. The R&J Floating Truss adds the brand signature: a truss-framed deck that walks solid even when it is riding chop, instead of the wobble you get from cheaper floating sections.</p><p>The float modules are sized for Northern Ontario freeze-thaw cycles. Reyco arranges the install and the seasonal pull, if you want it pulled before ice-in.</p>',
        'how'          => [
            ['icon' => 'sailing', 'title' => 'Handles depth swings', 'description' => 'Rises and falls with water level. Right answer for spring-to-fall variation.'],
            ['icon' => 'verified', 'title' => 'Truss-framed walk', 'description' => 'Walks solid under foot even when chop is running. Not the wobble of a basic float.'],
            ['icon' => 'support_agent', 'title' => 'Seasonal pull available', 'description' => 'Reyco can arrange in-and-out service before freeze-up.'],
        ],
        'what'         => [
            ['label' => 'Material',    'value' => 'Aluminum frame, marine float modules'],
            ['label' => 'Style',       'value' => 'Floating, truss-framed'],
            ['label' => 'Best fit',    'value' => 'Soft bottom, deep drop, variable depth'],
            ['label' => 'Built by',    'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-lux-floating-dock-system',
        'product_id'   => 291,
        'thumbnail_id' => 0,
        'heading'      => 'R&J LUX Floating Dock System',
        'tagline'      => 'The premium floating system from R&J. Heavy-gauge frame, larger floats, room for a U-shape or T-shape layout.',
        'why'          => '<p>The LUX is the upgrade from the standard floating truss. Heavier-gauge aluminum frame, larger float modules, and the engineered capacity for a full waterfront layout: U-shapes around a boat slip, T-shapes for swimming and sun, multi-bay configurations for two-boat shorelines. This is the dock the cottage build is matched to, not slotted in around.</p><p>Configurations are quoted to the shoreline. The site visit is where we figure out the right layout. R&J fabricates to spec, and Reyco coordinates the install.</p>',
        'how'          => [
            ['icon' => 'square_foot', 'title' => 'Custom layout', 'description' => 'U-shape, T-shape, or multi-bay, engineered to your waterfront.'],
            ['icon' => 'fitness_center', 'title' => 'Heavy-gauge frame', 'description' => 'Built for higher load capacity than the standard floating truss.'],
            ['icon' => 'pool', 'title' => 'Swim and boat in one footprint', 'description' => 'Big enough to host a slip plus a sunning area without crowding either one.'],
        ],
        'what'         => [
            ['label' => 'Material',    'value' => 'Heavy-gauge aluminum, premium float modules'],
            ['label' => 'Style',       'value' => 'Premium floating system, configurable layout'],
            ['label' => 'Best fit',    'value' => 'Waterfront builds, multi-use shoreline, larger family'],
            ['label' => 'Built by',    'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-wavex-modular-dock-system',
        'product_id'   => 292,
        'thumbnail_id' => 0,
        'heading'      => 'R&J WaveX Modular Dock System',
        'tagline'      => 'Modular floating sections engineered for chop, exposed shorelines, and big-water installations.',
        'why'          => '<p>WaveX is the answer for shorelines that take a beating. Big lake exposure, fetch-driven chop, boat wakes from a busy channel: the standard floating dock takes a hammering and the connections work loose by mid-season. The WaveX modular system uses oversized floats and reinforced module-to-module connections that hold their shape under wave load.</p><p>If you are on the open North Channel, on Lake Superior shoreline, or anywhere a steady south-west wind builds chop across the bay, this is the system Casey points you at first.</p>',
        'how'          => [
            ['icon' => 'waves', 'title' => 'Engineered for chop', 'description' => 'Oversized floats and reinforced connections that hold up under wave load.'],
            ['icon' => 'extension', 'title' => 'Modular layout', 'description' => 'Add or reconfigure sections as your shoreline use changes.'],
            ['icon' => 'verified', 'title' => 'Built for big water', 'description' => 'The R&J answer for exposed shorelines on Lake Superior and the open North Channel.'],
        ],
        'what'         => [
            ['label' => 'Material',    'value' => 'Aluminum frame, oversized marine floats'],
            ['label' => 'Style',       'value' => 'Modular floating, wave-rated'],
            ['label' => 'Best fit',    'value' => 'Exposed shoreline, big water, chop-prone bays'],
            ['label' => 'Built by',    'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-lift-up-step-dock',
        'product_id'   => 293,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Lift-Up Step Dock',
        'tagline'      => 'Tip-up shore section that lifts clear of the ice line. The freeze-protection answer for permanent docks.',
        'why'          => '<p>The Lift-Up Step Dock is a shore-end section designed to flip up and out of the ice zone before freeze-up. For permanent dock owners on lakes with serious ice movement (most of the Algoma region), this is what saves the dock from getting torn off the shore by spring break-up. You crank the section up in the fall, drop it back down in the spring, and the rest of the dock survives the winter.</p><p>Mates with the R&J Truss Pipe and Floating Truss systems. Casey or one of the techs walks you through the spring-and-fall routine on first install.</p>',
        'how'          => [
            ['icon' => 'severe_cold', 'title' => 'Lifts clear of the ice line', 'description' => 'Flips up before freeze-up so spring ice movement does not tear the dock off shore.'],
            ['icon' => 'sync', 'title' => 'Spring up, fall down', 'description' => 'Crank-operated tip-up. Quick seasonal routine you handle yourself.'],
            ['icon' => 'extension', 'title' => 'Mates with R&J systems', 'description' => 'Pairs with the Truss Pipe Dock and Floating Truss layouts.'],
        ],
        'what'         => [
            ['label' => 'Material',    'value' => 'Aluminum frame'],
            ['label' => 'Style',       'value' => 'Tip-up shore section'],
            ['label' => 'Best fit',    'value' => 'Lakes with serious ice movement, permanent dock owners'],
            ['label' => 'Built by',    'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'R&J Machine',
    'logo_id'  => 0,
    'tagline'  => 'Reyco is the regional R&J Machine partner for docks and boat lifts.',
    'body'     => '<p>R&J Machine fabricates marine-grade aluminum docks and lifts in Lakefield, Ontario, and we are the Sault Ste Marie regional partner for the line. Every R&J system is quoted to your shoreline measurements, fabricated to spec, and installed through Reyco. Site visit, ordering, install timing, and seasonal pull all run through us. Made in Canada, sized for Canadian Shield lakes.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which R&J dock fits your shoreline?',
    'columns' => ['Model', 'Style', 'Best for'],
    'rows'    => [
        ['Truss Pipe Dock (Aluminum)', 'Permanent pipe dock',         'Firm, gradual lake bed'],
        ['Floating Truss Dock',        'Floating, truss-framed',      'Soft bottom, deep drop, depth swings'],
        ['LUX Floating Dock System',   'Premium floating, configurable', 'Custom waterfront layout, multi-use'],
        ['WaveX Modular Dock System',  'Modular floating, wave-rated', 'Exposed shoreline, big-water chop'],
        ['Lift-Up Step Dock',          'Tip-up shore section',        'Ice-prone lakes, freeze-protection'],
    ],
],
```

---

## PAGE 4 — docks-and-lifts--boat-lifts.php (NEW KEYS ONLY)

Existing config has hero / intro / experts / subcategories / why_choose. Append the keys below. R&J Roof System (#299) excluded per dispatch (canopy accessory, stays on the WC category but skipped here).

```php
'series_models' => [
    [
        'slug'         => 'rj-cantilever-boat-lift',
        'product_id'   => 294,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Cantilever Boat Lift',
        'tagline'      => 'The classic hand-crank cantilever lift for runabouts and small fishing boats.',
        'why'          => '<p>The cantilever is the entry point to the R&J lift line and the right answer for most small-boat shorelines. Hand-crank operation, lever-action geometry that does the heavy work for you, and a simple frame design built to handle Northern Ontario winters. Best for boats up to roughly nineteen feet (check the rated capacity for your specific hull).</p><p>Made in Lakefield, Ontario by R&J Machine. Reyco does the site visit, the spec, the order, and the install.</p>',
        'how'          => [
            ['icon' => 'fitness_center', 'title' => 'Lever-action geometry', 'description' => 'Cantilever design does the lifting work. Hand crank is the input.'],
            ['icon' => 'verified', 'title' => 'Proven design', 'description' => 'The R&J cantilever is a tested fit for Algoma shorelines. Holds up to Northern Ontario winters.'],
            ['icon' => 'support_agent', 'title' => 'Reyco handles install', 'description' => 'Site visit, spec, order, installation, all coordinated through us.'],
        ],
        'what'         => [
            ['label' => 'Operation',  'value' => 'Hand crank'],
            ['label' => 'Capacity',   'value' => 'Quoted to your boat (typical fit: up to ~19 ft runabout)'],
            ['label' => 'Material',   'value' => 'Marine-grade aluminum'],
            ['label' => 'Built by',   'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-hydraulic-boat-lift',
        'product_id'   => 295,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Hydraulic Boat Lift',
        'tagline'      => 'Push-button hydraulic lift for the larger boat or the customer who is done hand-cranking.',
        'why'          => '<p>The hydraulic lift moves you from hand-crank to push-button. Hydraulic ram does the lifting, electric pump runs the hydraulics, and the boat goes up and down with a switch. For pontoons, larger fishing rigs, or any customer who has decided the hand crank is no longer the right answer, this is the upgrade.</p><p>Power is supplied through a shore-side run that the install includes. R&J specs the hydraulic capacity to your boat weight.</p>',
        'how'          => [
            ['icon' => 'electrical_services', 'title' => 'Push-button operation', 'description' => 'Hydraulic ram lifts the boat. You hit a switch.'],
            ['icon' => 'fitness_center', 'title' => 'Sized to your boat', 'description' => 'Hydraulic capacity is spec\'d to your boat weight.'],
            ['icon' => 'engineering', 'title' => 'Power run included', 'description' => 'Shore-side electrical run is part of the install spec.'],
        ],
        'what'         => [
            ['label' => 'Operation',  'value' => 'Push-button hydraulic'],
            ['label' => 'Capacity',   'value' => 'Quoted to your boat (pontoons, larger fishing rigs)'],
            ['label' => 'Material',   'value' => 'Marine-grade aluminum, hydraulic ram'],
            ['label' => 'Built by',   'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-vertical-pontoon-boat-lift',
        'product_id'   => 296,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Vertical Pontoon Boat Lift',
        'tagline'      => 'Vertical-action lift designed specifically for pontoons and lakes with significant water-level swings.',
        'why'          => '<p>Pontoons sit different on a lift than a v-hull, and the vertical lift is built for that. The lifting frame rises straight up rather than rotating, which keeps the pontoon tubes parallel to the water through the full lift motion. For lakes where the water level swings several feet between seasons, the vertical geometry also keeps the boat centred over the lift platform regardless of where the water sits.</p><p>This is the right lift for pontoon owners on inland Algoma lakes with serious spring-to-fall depth variation.</p>',
        'how'          => [
            ['icon' => 'open_in_full', 'title' => 'True vertical lift', 'description' => 'Frame rises straight up. Keeps pontoon tubes parallel through the full motion.'],
            ['icon' => 'water', 'title' => 'Handles depth swings', 'description' => 'Boat stays centred on the lift even when water level moves several feet.'],
            ['icon' => 'verified', 'title' => 'Pontoon-specific geometry', 'description' => 'Designed for pontoons, not adapted from a v-hull lift.'],
        ],
        'what'         => [
            ['label' => 'Operation',  'value' => 'Vertical lift, hydraulic or hand crank'],
            ['label' => 'Capacity',   'value' => 'Quoted to your pontoon'],
            ['label' => 'Material',   'value' => 'Marine-grade aluminum'],
            ['label' => 'Built by',   'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-hydro-extreme-boat-lift',
        'product_id'   => 297,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Hydro Extreme Boat Lift',
        'tagline'      => 'Heavy-duty hydraulic lift for the bigger cruiser, the heavier pontoon, or the boat that asks more of its lift.',
        'why'          => '<p>Hydro Extreme is the upgrade from the standard hydraulic. Higher rated capacity, heavier-gauge frame, sized for the cruiser or the loaded pontoon that the standard lift is not built to handle. Same push-button operation as the standard hydraulic, just engineered for serious weight.</p><p>If you are buying a boat and the lift is part of the spec, R&J quotes the lift to the boat at the same time. That way the lift is sized right from day one rather than retrofit later.</p>',
        'how'          => [
            ['icon' => 'fitness_center', 'title' => 'Higher capacity', 'description' => 'Heavier-gauge frame and upsized hydraulic ram for cruisers and loaded pontoons.'],
            ['icon' => 'electrical_services', 'title' => 'Push-button hydraulic', 'description' => 'Same operating ease as the standard hydraulic, scaled for serious weight.'],
            ['icon' => 'support_agent', 'title' => 'Spec\'d alongside the boat', 'description' => 'Buying a boat? R&J quotes the lift to the boat at the same time, sized right from day one.'],
        ],
        'what'         => [
            ['label' => 'Operation',  'value' => 'Push-button hydraulic, heavy-duty'],
            ['label' => 'Capacity',   'value' => 'Quoted to your boat (cruisers, loaded pontoons)'],
            ['label' => 'Material',   'value' => 'Heavy-gauge aluminum, upsized hydraulic ram'],
            ['label' => 'Built by',   'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-hidden-beam-wet-slip-lift',
        'product_id'   => 298,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Hidden-Beam Wet-Slip Lift',
        'tagline'      => 'In-boathouse lift with concealed structural beams. The clean install for an enclosed slip.',
        'why'          => '<p>The Hidden-Beam is for the customer with a boathouse or covered wet-slip who wants the lift integrated into the structure rather than mounted around it. The structural beams sit hidden in the slip, the lift platform raises the boat clear of the water, and the visual line of the boathouse stays clean.</p><p>This is a custom install. Site visit measures the slip, the boathouse framing, and the boat. R&J spec\'s the beam runs and Reyco coordinates the install with the boathouse contractor if there is one.</p>',
        'how'          => [
            ['icon' => 'home', 'title' => 'Integrated into the boathouse', 'description' => 'Structural beams hidden in the slip. Visual line of the boathouse stays clean.'],
            ['icon' => 'square_foot', 'title' => 'Custom-spec\'d', 'description' => 'Slip measurements, boathouse framing, and boat all factored into the build.'],
            ['icon' => 'engineering', 'title' => 'Coordinated install', 'description' => 'Reyco handles the install in tandem with your boathouse contractor when needed.'],
        ],
        'what'         => [
            ['label' => 'Operation',  'value' => 'Hydraulic'],
            ['label' => 'Application', 'value' => 'Boathouse / enclosed wet-slip'],
            ['label' => 'Material',   'value' => 'Marine-grade aluminum, hidden structural beams'],
            ['label' => 'Built by',   'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
    [
        'slug'         => 'rj-marine-railway-system',
        'product_id'   => 302,
        'thumbnail_id' => 0,
        'heading'      => 'R&J Marine Railway System',
        'tagline'      => 'Inclined-track haul-out system for shorelines where a conventional lift is not the right answer.',
        'why'          => '<p>The marine railway is a different category of haul-out. Instead of lifting the boat vertically out of the water, the boat sits on a wheeled cradle that runs up an inclined track from the lake to the shore. For shorelines that drop too quickly for a conventional lift, for boathouses set back from the water, or for owners who want the boat fully on shore in winter, the railway is the right tool.</p><p>This is a site-specific build. R&J quotes to the slope of your shoreline, the haul distance, and the boat weight. Casey or Aaron will walk the shoreline before R&J commits to the spec.</p>',
        'how'          => [
            ['icon' => 'directions_railway', 'title' => 'Inclined-track haul-out', 'description' => 'Wheeled cradle runs from lake to shore on a fixed track.'],
            ['icon' => 'square_foot', 'title' => 'Site-specific build', 'description' => 'Quoted to shoreline slope, haul distance, and boat weight.'],
            ['icon' => 'home', 'title' => 'Boat fully on shore', 'description' => 'Pulls the boat clear of the water for off-season storage.'],
        ],
        'what'         => [
            ['label' => 'Operation',  'value' => 'Winch-driven cradle on inclined track'],
            ['label' => 'Application', 'value' => 'Steep shoreline, set-back boathouse, full winter haul-out'],
            ['label' => 'Material',   'value' => 'Marine-grade aluminum, galvanized track'],
            ['label' => 'Built by',   'value' => 'R&J Machine, Lakefield ON'],
        ],
    ],
],

'brand_band' => [
    'enabled'  => true,
    'brand'    => 'R&J Machine',
    'logo_id'  => 0,
    'tagline'  => 'Reyco is the regional R&J Machine partner for docks and boat lifts.',
    'body'     => '<p>R&J Machine fabricates marine-grade aluminum lifts in Lakefield, Ontario. We are the Sault Ste Marie regional partner for the full lift line: cantilever, hydraulic, vertical pontoon, hydro extreme, hidden-beam wet-slip, and marine railway. Every R&J lift is quoted to your boat and your shoreline. Site visit, spec, order, install, and any seasonal service all run through us. Made in Canada, sized for Canadian Shield shorelines.</p>',
],

'comparison_table' => [
    'enabled' => true,
    'title'   => 'Which R&J lift is right for your shoreline?',
    'columns' => ['Model', 'Operation', 'Best for'],
    'rows'    => [
        ['Cantilever Boat Lift',     'Hand crank, lever action',         'Runabouts and small fishing boats up to ~19 ft'],
        ['Hydraulic Boat Lift',      'Push-button hydraulic',            'Pontoons, larger fishing rigs'],
        ['Vertical Pontoon Lift',    'Vertical lift, hydraulic or crank', 'Pontoons on lakes with depth swings'],
        ['Hydro Extreme Boat Lift',  'Push-button heavy-duty hydraulic', 'Cruisers, loaded pontoons'],
        ['Hidden-Beam Wet-Slip',     'Hydraulic, in-boathouse',          'Boathouse / enclosed wet-slip integration'],
        ['Marine Railway System',    'Winch-driven cradle on track',     'Steep shoreline, full winter haul-out'],
    ],
],
```

---

## QC checklist (for Aiden + Casey review)

**Voice / format:**
- [ ] Zero em-dashes anywhere in body copy. Verified by author. Note: en-dash retained only in "spring-to-fall" / "two-and-three" type ranges.
- [ ] No banned AI tells (delve / unlock / leverage / elevate / journey / tapestry / world-class / industry-leading / robust / seamless / Moreover / Furthermore / Additionally / "not only X but also Y"). Verified.
- [ ] Reyco founded 2022 — present-tense framing only. No "60 years", no "since 1964", no family-history. Verified (no founding-year claims made anywhere).
- [ ] Casey owner-voice ("we", "our", first-person plural) maintained throughout. No "Talk to Casey" / "Call Casey" / "ask Casey" buttons.
- [ ] Canadian English (authorised, marine-grade, etc.). Material is mostly product-spec, so spelling-divergence surface is small.
- [ ] R&J Machine framed correctly as Reyco's dock + lift partner (Lakefield, Ontario), not as Reyco's own product line.
- [ ] Brand list adhered to (Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine). No off-list brand mentioned.
- [ ] Staff references match roster (Casey, Aaron, Lee, Damian, Cody, Lynn, Ron, Kory). Cody included in P2 service line.

**Per-product field shape:**
- [ ] All 23 entries follow PHP single-quote convention per boss spec.
- [ ] All `slug` fields kebab-case, derived from product display name.
- [ ] All `thumbnail_id` set to 0 (fallback to product feature image, dev to confirm template behaviour).
- [ ] All `why` fields are HTML `<p>...</p>` with two paragraphs.
- [ ] All `how` arrays have exactly 3 entries (icon + title + description).
- [ ] All `what` arrays have exactly 4 entries (label + value).
- [ ] All Material Symbols icon names verified snake_case (battery_charging_full, electrical_services, sync_alt, square_foot, severe_cold, etc.).

**Casey-gate items (he sells these every day, his call on factual framing):**
- [ ] APEX 13/16/19 size positioning ("13 = entry to flagship", "16 = serious tournament rig", "19 = offshore / charter / networked-boat anchor"). Casey can rebalance if his real-customer breakdown is different.
- [ ] Control Head Only positioning ("for the customer upgrading from Helix or Solix"). Casey to confirm Helix-to-APEX transducer crossover is real on his existing customer base.
- [ ] Minn Kota PCL vs PC framing ("PCL is current generation, refined algorithm, tighter end-of-charge cutoff vs older PC"). Verify against Minn Kota documentation if Casey wants the marketing line tightened.
- [ ] R&J product capacities (e.g. cantilever lift "up to ~19 ft runabout"). All capacities written as "quoted to your boat" rather than fixed numbers, so Casey-safe by default. If he wants specific capacity ranges shown, he can plug them in.
- [ ] R&J Hidden-Beam install description (boathouse coordination with contractor). Casey to confirm typical install pattern.
- [ ] Marine Railway System product entry — Casey to confirm Reyco currently sells / installs these or whether it is special-order only.

**Dev-side flags:**
- [ ] **Page 2 marine-electronics is a NEW config file**. Boss to create `boats-marine--marine-electronics.php` from the full config block above. Hero subtitle frames the page as "Power, Charging, and Wiring" so the URL `/marine-electronics/` does not confuse customers expecting sonar.
- [ ] **Pages 1, 3, 4 are NEW KEYS ONLY**. Append `series_models`, `brand_band`, and `comparison_table` to the existing config arrays. Do not overwrite hero / intro / experts / subcategories / why_choose.
- [ ] **Excluded products** (per dispatch): MEGA Live 2 family (282-285) excluded from fish-finders page (already on /mega-live-2/); Wave Armour Otter Swim Raft (303) excluded from docks page (not a dock); R&J Roof System (299) excluded from boat-lifts page (canopy accessory, not a lift). All three remain in their WC categories, just not in the showcase.
- [ ] **Product 285** appears on both `/mega-live-2/` (Batch 1) and `/marine-electronics-accessories/` (Batch 1) by design. Not duplicated in Batch 2.
- [ ] Material Symbols icons need to be in the theme icon set. New ones used in Batch 2: `sync_alt`, `monitor`, `hub`, `fact_check`, `battery_charging_full`, `power_settings_new`, `severe_cold`, `sailing`, `square_foot`, `fitness_center`, `pool`, `extension`, `waves`, `home`, `directions_railway`, `open_in_full`, `electrical_services`. All standard Material Symbols Outlined names.

**Word counts (rough):**
- Page 1 fish-finders series_models: ~720 words across 6 entries (avg ~120 ea)
- Page 2 marine-electronics full config: ~870 words (hero + intro + experts + 6 products + brand_band + comparison_table)
- Page 3 docks series_models: ~570 words across 5 entries (avg ~115 ea)
- Page 4 boat-lifts series_models: ~640 words across 6 entries (avg ~107 ea)
- **Total: ~2,800 body words across the 23 product entries + new full P2 config**

---

## Standing for review

Per the overshoot-flag-vs-pre-trim discipline (memory `feedback_overshoot_flag_vs_pretrim`): no per-product target was set in dispatch, so no pre-trim. If Aiden or Casey want any product entry trimmed (e.g. drop the second paragraph in the Why block), the easiest single cuts are:

- **Drop second paragraph of Why on Control Head Only entries** (3 of them). Saves ~150 words. Justification: the install/compatibility note is reinforcement of the first paragraph.
- **Drop the Marine Railway System entry** if Reyco does not actually sell / install these regularly. Saves ~110 words. Drops Page 4 from 6 entries to 5.
- **Trim brand_band body to one sentence on Pages 3 + 4** (R&J descriptions are nearly identical). Saves ~80 words.

I have NOT made any of these cuts. Aiden / Casey to call.

Awaiting Aiden review before any wp-cli paste.
