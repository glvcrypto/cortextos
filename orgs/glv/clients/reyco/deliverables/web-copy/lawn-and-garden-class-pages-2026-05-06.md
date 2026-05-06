# Lawn & Garden Class Pages — 6 NEW configs (Aiden path-A backlog, launch-day)

**6 NEW full configs** for the Lawn & Garden section, replacing OLD-schema category pages. All six are new series-showcase template treatments. Same shape and voice as the Princecraft + Minn Kota brand-page migrations (commits b2d7ff0 + 0764a66), Powersports class-pages (commit 40742d0), and Batches 1-5.

**For dev:** ready-to-paste PHP arrays for the series-showcase template. 6 NEW files at:
- `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--trimmers.php`
- `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--chainsaws.php`
- `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--hedge-trimmers.php`
- `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--edgers.php`
- `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--pro-attachment-series.php`
- `wp-content/themes/reyco-marine/inc/category-configs/lawn-and-garden--cordless-56v.php`

**Source dispatch:** boss msg 1778091122771-boss-jw166 (Aiden path-A backlog, 11-page launch-day). Plan-ACK in 1778091437553. Clarifications in 1778091499545.

**Voice / format constraints (carried forward):**
- Canadian English; plain language; NO em-dashes anywhere in PHP body. Both Unicode (U+2014) AND HTML entities (`&mdash;` / `&#8212;` / `&#x2014;`) checked.
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022. Present-tense framing only. NO founding-year claims, no Reyco-tenure claims.
- Casey owner-voice. NO "Talk to Casey" / "Call Casey" / "ask Casey" CTA copy. Casey alone OK in body copy. NO inline Casey quotes (Casey-gate active).
- **NO KORY ANYWHERE.** Kory departed Reyco 2026-05-06; must not appear in any new copy across any deliverable.
- 11-brand authorised list: Mercury, Princecraft, Minn Kota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Hisun, E-Z-GO, R&J Machine
- Staff: Casey (sales floor / owner-voice), Aaron (co-owner / service manager), Lee (big-engine / marine tech), Damian (small-engine / handheld tech), Cody (general service tech), Lynn / Ron (parts). Damian + Cody handle handheld OPE service (the lawn-and-garden analogue of marine-side commissioning).

**SKU verification status (per banked working-process rule):**
- Echo eForce 56V SKUs **boss-VERIFIED** via Batch 5 plumb: DLM-2100 (id 353), DLM-2100SP (id 354), DSRM-2100 (id 359), DCS-5000 (id 233), DCS-2500T (id 351), DPB-2500 (id 357). These can be asserted directly in body copy across the LG class pages.
- All gas Echo SKUs (SRM, CS, HC, PE, PAS) and any other-line cordless eForce SKUs (DHC, DPE, DPPF) are **stock-pending-plumb-verification** — not yet seen in a prior shipped batch with confirmed product_id. Body copy phrased to survive model substitution within same series.
- Where I name a specific gas SKU as a "see / talk to us about" reference, that is bounded language (lower-stakes than asserting it as a featured anchor) per banked rule.

**Subcategories band shape (per boss msg 1778091499545 plumb-clean preference):**
- All 6 pages use the static label strip pattern: `[['label' => 'X'], ['label' => 'Y'], ...]` with no `anchor` and no `href`. Avoids template cross-page-href edge case at plumb.

**Out of scope (per boss):** WC `product_category` taxonomy assignment fix that makes products appear on these archive pages is boss / dev plumb-side via WP-CLI. The series-showcase template renders the configured `series_models` regardless of WC archive content.

**Approval gate:** Aiden review before any wp-cli paste.

---

## PAGE 1 — lawn-and-garden--trimmers.php (NEW PAGE, all-trimmers parent aggregate)

```php
<?php
/**
 * Category config: lawn-and-garden -> trimmers
 * Frame: All-trimmers parent aggregate. Echo gas + Echo eForce 56V cordless.
 * 3 anchors: DSRM-2100 (eForce, boss-verified id 359) + Echo gas trimmer family (stock-flagged) + brush-cutter pivot (stock-flagged).
 */

return [
    'category_slug' => 'trimmers',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'String Trimmers',
        'subtitle' => 'Echo gas and Echo eForce 56V cordless string trimmers. Authorised Echo dealer. Damian and Cody handle warranty and service in-house.',
        'cta'      => [
            'primary'   => ['label' => 'See the trimmer lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',         'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Trimmers for the property, the cottage and the work crew',
        'body'  => '<p>String trimmers are the most-used handheld tool on most properties. Edge work along the driveway, around the foundation, under the deck, around the dock, the spots a mower will never reach. Echo is the brand we lead with on handheld OPE. Authorised dealer status means factory-direct pricing, genuine parts at the parts counter with Lynn and Ron, and full manufacturer warranty handled in-house by Damian and Cody on the small-engine bench.</p><p>Two paths: gas (the Echo SRM line) is the right tool for heavier weed-and-brush work, longer running times, and the customer who wants the proven Echo two-stroke architecture that has been running in Northern Ontario yards for decades. Cordless (the Echo eForce 56V DSRM-2100) is the right tool for residential yard work, quieter starts, no fuel mixing, and the customer who is building into the eForce platform across multiple tools. Same Echo brand, same in-house service either way.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the gas-versus-cordless conversation (it usually comes down to property size and how often you trim). Damian and Cody handle the small-engine service work in-house: pre-delivery prep, fuel system tune, line-head replacement, warranty. Lynn and Ron at the parts counter stock Echo trimmer line, replacement heads, two-stroke oil, and the eForce 56V batteries and chargers.</p>',
    ],

    'subcategories' => [
        ['label' => 'Trimmers'],
        ['label' => 'Chainsaws'],
        ['label' => 'Hedge Trimmers'],
        ['label' => 'Edgers'],
        ['label' => 'Pro Attachment Series'],
        ['label' => 'Cordless 56V'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-dsrm-2100-cordless-trimmer',
            'product_id'   => 359,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DSRM-2100 56V Cordless String Trimmer',
            'tagline'      => 'Brushless 56V eForce trimmer. Gas-grade torque, no gas.',
            'why'          => '<p>The DSRM-2100 is the eForce trimmer in the Echo cordless line. Brushless motor, 56V battery, and a cutting head sized to handle yard-grade trimming and shoulder-of-the-driveway weed work. Most cordless trimmers slow down in heavier grass; the brushless motor and 56V battery on the Echo do not. Speed-Feed 400 head means line reload is a quick spin-and-go, not a tear-the-spool-apart job.</p><p>The other thing that matters: the 56V battery is the same one in the Echo cordless mower, chainsaw, blower and the rest of the eForce line. If you already have any of those, the trimmer is the next click in the same ecosystem. One battery, multiple tools.</p>',
            'how'          => [
                ['icon' => 'bolt',                   'title' => 'Brushless 56V power',  'description' => 'Holds torque under load in a way most cordless trimmers do not.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce battery share', 'description' => 'Same 56V battery as the Echo cordless mower, chainsaw, blower and more.'],
                ['icon' => 'engineering',            'title' => 'In-house service',      'description' => 'Damian and Cody do the small-engine bench work and warranty.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Cordless string trimmer (56V eForce)'],
                ['label' => 'Best for',    'value' => 'Residential yard work, quieter starts, no fuel mixing'],
                ['label' => 'Ecosystem',   'value' => 'Echo eForce 56V (battery shared with mower, chainsaw, blower)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-srm-gas-string-trimmer-line',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo SRM Gas String Trimmer Line',
            'tagline'      => 'Two-stroke gas trimmers for heavier weed-and-brush work and longer run times.',
            'why'          => '<p>The Echo SRM gas line is the right tool for the customer who needs longer run times, more cutting torque, or who is working a property where a cordless battery would not cover the session. Two-stroke architecture, genuine Echo parts ecosystem, and the proven trimmer line that has been the standard on Northern Ontario service yards for years. We carry multiple SRM tiers on the floor; the right model depends on property size, trim load, and whether you want a curved-shaft or straight-shaft.</p><p>Stock pending plumb verification on the specific SRM trims we have at the moment. Damian and Cody do the pre-delivery tune, fuel system check and warranty in-house. Same authorised Echo dealer support as the cordless line.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'Two-stroke gas torque', 'description' => 'Higher cutting load, longer run times than cordless.'],
                ['icon' => 'verified',       'title' => 'Proven SRM line',       'description' => 'Echo two-stroke architecture, decades of field service.'],
                ['icon' => 'engineering',    'title' => 'Pre-delivery tune',     'description' => 'Damian and Cody do the carb and fuel system on every gas trimmer.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Gas string trimmer (Echo SRM line)'],
                ['label' => 'Best for',    'value' => 'Heavier weed work, larger properties, longer run sessions'],
                ['label' => 'Ecosystem',   'value' => 'Two-stroke gas (50:1 mix, Echo Power Blend XTended Life recommended)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-srm-brush-cutter-trim',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo Brush-Cutter Conversion',
            'tagline'      => 'Heavier-clearing trim head. For brush, saplings and bush-line cutting, not yard grass.',
            'why'          => '<p>Many of the Echo SRM gas trimmers accept a brush-cutter head conversion. Right tool for the customer who is clearing bush-line, cutting through small saplings, or doing heavier-than-grass clearing on cottage lots and trail edges. Steel cutter blade in place of nylon line, and a corresponding bump in cutting capacity.</p><p>Stock pending plumb verification on which SRM trims we have brush-cutter conversions for at the moment. Talk to us on the floor about the specific clearing job; we can spec the right SRM model and the right cutter head together.</p>',
            'how'          => [
                ['icon' => 'forest',         'title' => 'Brush and sapling',     'description' => 'Steel cutter for clearing beyond yard-grade weeding.'],
                ['icon' => 'tune',           'title' => 'SRM-conversion ready',  'description' => 'Many Echo SRM gas trimmers accept the brush-cutter head.'],
                ['icon' => 'engineering',    'title' => 'Spec on the floor',     'description' => 'We match SRM model + cutter head to the clearing job.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Brush-cutter conversion (Echo SRM-base)'],
                ['label' => 'Best for',    'value' => 'Cottage trail clearing, bush-line, saplings, heavier weed'],
                ['label' => 'Ecosystem',   'value' => 'Two-stroke gas (Echo SRM-base)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Echo dealer. Full handheld OPE line: trimmers, chainsaws, hedge-trimmers, edgers, blowers and the eForce 56V cordless platform.',
        'body'     => '<p>Echo is the handheld OPE brand we lead with at the shop. Authorised dealer status, genuine parts at the parts counter with Lynn and Ron, and full manufacturer warranty handled in-house by Damian and Cody on the small-engine bench.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right trimmer for the property',
        'columns' => ['Model line', 'Class',          'Best for',                                       'Ecosystem'],
        'rows'    => [
            ['DSRM-2100',           'Cordless 56V',   'Residential yards, quieter starts, no fuel',     'Echo eForce battery share'],
            ['Echo SRM (gas)',      'Two-stroke gas', 'Heavier weed, larger properties, longer runs',   'Two-stroke 50:1 gas'],
            ['SRM brush-cutter',    'Gas + steel head','Bush-line, saplings, cottage trail clearing',   'Two-stroke 50:1 gas'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Is the cordless DSRM-2100 strong enough for my yard?',
            'a' => 'For most residential yards, yes. The brushless 56V motor holds torque under load in a way most cordless trimmers do not. If you are doing serious bush-line clearing, heavier weed, or all-day commercial-grade work, gas (Echo SRM line) is still the right tool.',
        ],
        [
            'q' => 'Do I have to mix gas for the SRM trimmers?',
            'a' => 'Yes. The Echo SRM gas line is two-stroke, so it runs on a 50:1 gas-and-oil mix. We recommend Echo Power Blend XTended Life premixed if you do not want to mix yourself; Lynn and Ron stock it at the parts counter.',
        ],
        [
            'q' => 'Can the cordless battery work with my other Echo cordless tools?',
            'a' => 'Yes. The eForce 56V battery is the same across the Echo cordless line: trimmer, chainsaw, blower, mower and more. One battery investment unlocks the whole platform.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at trimmers on the floor?',
        'body'      => '<p>Drop in and walk the Echo trimmer lineup, or give us a call and we can talk through the gas-versus-cordless and the property-size question.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the cordless 56V system', 'href' => '/lawn-and-garden/cordless-56v/'],
    ],
];
```

---

## PAGE 2 — lawn-and-garden--chainsaws.php (NEW PAGE, all-chainsaws parent aggregate)

```php
<?php
/**
 * Category config: lawn-and-garden -> chainsaws
 * Frame: All-chainsaws parent aggregate. Echo gas + Echo eForce 56V cordless.
 * 3 anchors: DCS-5000 (eForce rear-handle, boss-verified id 233) + DCS-2500T (eForce top-handle, boss-verified id 351) + Echo gas chainsaw line (stock-flagged).
 */

return [
    'category_slug' => 'chainsaws',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Chainsaws',
        'subtitle' => 'Echo gas and Echo eForce 56V cordless chainsaws. Authorised Echo dealer. In-house chain sharpening, bar service and warranty.',
        'cta'      => [
            'primary'   => ['label' => 'See the chainsaw lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',          'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Chainsaws for storm cleanup, firewood and trail work',
        'body'  => '<p>Chainsaws are the tool people remember they need the day after a storm. Limbing, bucking firewood at the cottage, clearing trail, the kind of one-or-two-tank session most homeowners run a few times a year. Echo is the chainsaw brand we lead with: authorised dealer, genuine parts and chains at the counter with Lynn and Ron, and full in-house service from Damian and Cody on the small-engine bench (chain sharpening, bar replacement, fuel system, warranty).</p><p>The Echo lineup splits two ways. Gas (the CS line) is the right tool for serious cutting volume, felling work, and the customer who does enough cutting to want the proven two-stroke saw with the Echo parts ecosystem behind it. Cordless (the eForce 56V DCS-5000 rear-handle and DCS-2500T top-handle) is the right tool for storm cleanup, smaller-property firewood, and the customer who is building into the eForce platform.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the gas-versus-cordless conversation and the bar-length question (15 inches handles most homeowner work; 16 to 18 inches is the storm-and-firewood sweet spot; 20-plus inches is felling territory). Damian and Cody do chain sharpening on the bench, bar service, fuel system tune and warranty. Lynn and Ron stock Echo chains, bars, two-stroke oil, and the eForce 56V batteries and chargers.</p>',
    ],

    'subcategories' => [
        ['label' => 'Trimmers'],
        ['label' => 'Chainsaws'],
        ['label' => 'Hedge Trimmers'],
        ['label' => 'Edgers'],
        ['label' => 'Pro Attachment Series'],
        ['label' => 'Cordless 56V'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-dcs-5000-cordless-chainsaw',
            'product_id'   => 233,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DCS-5000 56V Cordless Chainsaw (18in Rear-Handle)',
            'tagline'      => 'Eighteen-inch cordless rear-handle saw. Brushless 56V eForce, real cutting torque.',
            'why'          => '<p>The DCS-5000 is the rear-handle cordless chainsaw in the Echo eForce line. Eighteen-inch bar with full-comp chain, brushless motor, automatic chain oiler, tool-free chain tensioner. Right size for storm cleanup, firewood bucking, limbing, and most homeowner cutting. The brushless motor holds chain speed under load, which is the part that separates a real cordless saw from a hardware-store cordless saw.</p><p>Battery: 5Ah pack on a homeowner cutting job runs in the range of a normal weekend session depending on wood density and how aggressive the chain is set up. Most customers buy the saw with a 5Ah pack and a backup if they are heading to the cottage. Lynn keeps both pack sizes and replacement chains on the parts counter. Felling and full-day pro cutting is still gas-saw territory; for that we have the Echo CS line on the floor.</p>',
            'how'          => [
                ['icon' => 'bolt',                   'title' => 'Brushless 56V power',  'description' => 'Holds chain speed under load. Real cutting torque, not hardware-store cordless.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce battery share', 'description' => 'Same 56V battery as the Echo cordless trimmer, mower, blower and more.'],
                ['icon' => 'engineering',            'title' => 'In-house chain service','description' => 'Damian and Cody do sharpening and bar work on the bench.'],
            ],
            'what'         => [
                ['label' => 'Bar length',  'value' => '18 inches (full-comp chain)'],
                ['label' => 'Class',       'value' => 'Cordless rear-handle (56V eForce)'],
                ['label' => 'Best for',    'value' => 'Storm cleanup, firewood, limbing, homeowner cutting'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-dcs-2500t-cordless-chainsaw',
            'product_id'   => 351,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DCS-2500T 56V Cordless Chainsaw (16in Top-Handle)',
            'tagline'      => 'Sixteen-inch top-handle cordless. One-handed limbing and tree work, eForce battery.',
            'why'          => '<p>The DCS-2500T is the top-handle variant in the Echo eForce cordless chainsaw line. Sixteen-inch bar, brushless motor, top-handle grip for one-handed work in trees, on ladders, and in tight limbing situations. Top-handle saws are technically a pro-arborist class of tool; for the homeowner doing serious tree work or a property owner clearing storm-damaged limbs from height, this is the right form factor.</p><p>Top-handle work is more skill-dependent than rear-handle. If you are not used to one-handed saw work, talk to us on the floor about whether the rear-handle DCS-5000 is the better fit for your job. Same eForce 56V battery as the rest of the line; same in-house chain sharpening and bar service.</p>',
            'how'          => [
                ['icon' => 'precision_manufacturing','title' => 'Top-handle form factor','description' => 'One-handed grip for tree work and tight limbing.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce 56V',           'description' => 'Same battery as the rest of the Echo cordless line.'],
                ['icon' => 'shield',                 'title' => 'Pro-class tool',       'description' => 'Top-handle is a more skilled saw class. Talk to us about fit.'],
            ],
            'what'         => [
                ['label' => 'Bar length',  'value' => '16 inches'],
                ['label' => 'Class',       'value' => 'Cordless top-handle (56V eForce)'],
                ['label' => 'Best for',    'value' => 'Tree work, limbing from height, tight one-handed cuts'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-cs-gas-chainsaw-line',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo CS Gas Chainsaw Line',
            'tagline'      => 'Two-stroke gas chainsaws for serious cutting volume and felling.',
            'why'          => '<p>The Echo CS gas line is the right tool for the customer who is doing real cutting volume: felling trees, all-day firewood sessions, commercial cutting, and the kind of work where a cordless battery would not cover the day. Two-stroke architecture, the proven Echo CS line, multiple bar-length options on the floor depending on the job. We carry rear-handle CS units across consumer and pro tiers.</p><p>Stock pending plumb verification on the specific CS trims and bar lengths we have at the moment. Damian and Cody do the carb tune, fuel system service and chain work in-house on every gas saw. Same authorised Echo dealer support as the cordless line.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'Two-stroke gas',        'description' => 'Higher cutting load, longer run times, full-day work.'],
                ['icon' => 'verified',       'title' => 'Proven CS line',        'description' => 'Echo gas chainsaw architecture, decades of field service.'],
                ['icon' => 'engineering',    'title' => 'In-house service',       'description' => 'Carb, fuel system, chain sharpening on the bench.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Gas chainsaw (Echo CS line)'],
                ['label' => 'Best for',    'value' => 'Felling, all-day cutting, firewood volume, commercial work'],
                ['label' => 'Ecosystem',   'value' => 'Two-stroke gas (50:1 mix)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Echo dealer. Full chainsaw line: gas CS, eForce 56V cordless, top-handle and rear-handle.',
        'body'     => '<p>Echo is the chainsaw brand we lead with. Authorised dealer status means factory-direct pricing on saws, chains and bars; genuine parts at the counter; full in-house service. We sharpen chains on the bench (Damian and Cody) and stock common consumables for both gas and cordless lines.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right chainsaw for the cutting job',
        'columns' => ['Model',          'Bar',         'Class',                'Best for'],
        'rows'    => [
            ['DCS-5000',                '18 in',       'Cordless rear-handle', 'Storm cleanup, firewood, homeowner cutting'],
            ['DCS-2500T',               '16 in',       'Cordless top-handle',  'Tree work, limbing from height'],
            ['Echo CS (gas)',           'Multiple',    'Two-stroke gas',       'Felling, all-day work, commercial volume'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Cordless or gas for storm cleanup?',
            'a' => 'For most homeowners, the cordless DCS-5000 will get you through a storm cleanup session. No fuel mixing, push-button start every time, real cutting torque. If you are clearing serious volume (multiple downed trees, all-day work) gas (Echo CS line) is the right tool. We can talk through the trade-offs on the floor.',
        ],
        [
            'q' => 'Do you sharpen chains?',
            'a' => 'Yes. Damian and Cody sharpen chains on the bench. Bring it in dull and we can usually turn it around same-day depending on the queue. We also stock Echo chains and bars at the counter if a replacement is the right call.',
        ],
        [
            'q' => 'Top-handle or rear-handle?',
            'a' => 'Rear-handle (DCS-5000, Echo CS line) is the standard chainsaw form for ground cutting. Top-handle (DCS-2500T) is a one-handed grip for tree work and limbing from height. Top-handle saws are a more skilled tool class; if you are not doing tree work specifically, the rear-handle is the right call.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at chainsaws on the floor?',
        'body'      => '<p>Drop in and walk the Echo chainsaw lineup. We can spec the right bar length and the right gas-versus-cordless call for the cutting work you are doing.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the cordless 56V system', 'href' => '/lawn-and-garden/cordless-56v/'],
    ],
];
```

---

## PAGE 3 — lawn-and-garden--hedge-trimmers.php (NEW PAGE, hedge-trimmers class)

```php
<?php
/**
 * Category config: lawn-and-garden -> hedge-trimmers
 * Frame: All-hedge-trimmers parent. Echo gas + Echo eForce 56V cordless.
 * 2 anchors: Echo gas hedge-trimmer line (stock-flagged) + Echo eForce 56V cordless hedge-trimmer line (stock-flagged; DHC-2100 not in prior shipped batch).
 */

return [
    'category_slug' => 'hedge-trimmers',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Hedge Trimmers',
        'subtitle' => 'Echo gas and Echo eForce 56V cordless hedge trimmers. Authorised Echo dealer with full in-house service.',
        'cta'      => [
            'primary'   => ['label' => 'See the hedge-trimmer lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',                'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Hedge trimmers for property edging and shrub work',
        'body'  => '<p>Hedge trimmers are the right tool for shaping shrubs, trimming hedge rows, and the kind of detail edging that a string trimmer cannot do cleanly. Echo is the brand we lead with on handheld hedge trimmers. Authorised dealer, genuine parts and replacement blades at the counter, and full in-house service from Damian and Cody on the small-engine bench.</p><p>Two paths: gas (the Echo HC line) is the right tool for longer hedges, denser shrub work, and properties where the running session would outlast a battery. Cordless (the Echo eForce 56V cordless hedge trimmer) is the right tool for residential yards, quieter starts, no fuel mixing, and the customer who is building into the eForce platform alongside the trimmer, chainsaw, blower and mower. Same Echo brand and same in-house service either way.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the gas-versus-cordless and the blade-length question (single-sided vs double-sided, 20-inch vs 24-inch blade). Damian and Cody handle blade sharpening, fuel system service, and warranty in-house on the small-engine bench. Lynn and Ron stock Echo replacement blades, two-stroke oil, and the eForce 56V batteries and chargers.</p>',
    ],

    'subcategories' => [
        ['label' => 'Trimmers'],
        ['label' => 'Chainsaws'],
        ['label' => 'Hedge Trimmers'],
        ['label' => 'Edgers'],
        ['label' => 'Pro Attachment Series'],
        ['label' => 'Cordless 56V'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-eforce-cordless-hedge-trimmer',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo eForce 56V Cordless Hedge Trimmer',
            'tagline'      => 'Brushless 56V cordless hedge trimmer. Same battery as the rest of the eForce line.',
            'why'          => '<p>The Echo eForce cordless hedge trimmer runs on the same 56V battery as the Echo cordless trimmer, chainsaw, blower and mower. Brushless motor, dual-action blades, and the kind of cutting capacity that handles residential hedge and shrub work cleanly. Right tool for the customer who is building into the eForce platform across multiple Echo cordless tools, or who wants to skip the gas-mixing and pull-cord step for hedge work.</p><p>Stock pending plumb verification on the exact eForce hedge-trimmer trim we have at the moment. Talk to us on the floor about blade-length and one-sided versus dual-action options. Same eForce battery share as the rest of the line.</p>',
            'how'          => [
                ['icon' => 'bolt',                   'title' => 'Brushless 56V power',  'description' => 'Holds cutting speed under load on dense hedge work.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce battery share', 'description' => 'Same 56V battery as the Echo cordless trimmer, chainsaw, blower, mower.'],
                ['icon' => 'engineering',            'title' => 'In-house service',      'description' => 'Damian and Cody do blade work and warranty on the bench.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Cordless hedge trimmer (56V eForce)'],
                ['label' => 'Best for',    'value' => 'Residential hedges, shrub shaping, eForce platform builders'],
                ['label' => 'Ecosystem',   'value' => 'Echo eForce 56V (battery shared with mower, trimmer, chainsaw, blower)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-hc-gas-hedge-trimmer-line',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo HC Gas Hedge Trimmer Line',
            'tagline'      => 'Two-stroke gas hedge trimmers for longer running times and denser shrub work.',
            'why'          => '<p>The Echo HC gas line is the right tool for the customer who has longer hedges, denser shrub material, or a property where the running session would outlast a cordless battery. Two-stroke architecture, the proven Echo HC line, dual-action blades for clean cutting on hedge growth. We carry HC trims across single-sided (one-side blade) and double-sided (dual-action blade) configurations.</p><p>Stock pending plumb verification on the specific HC trims we have at the moment. Damian and Cody do the carb and fuel system tune in-house on every gas hedge trimmer. Same authorised Echo dealer support as the cordless line.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'Two-stroke gas',        'description' => 'Longer run times for longer hedge sessions.'],
                ['icon' => 'verified',       'title' => 'Proven HC line',        'description' => 'Echo gas hedge-trimmer architecture, field-proven.'],
                ['icon' => 'engineering',    'title' => 'In-house tune',          'description' => 'Damian and Cody do the small-engine bench work.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Gas hedge trimmer (Echo HC line)'],
                ['label' => 'Best for',    'value' => 'Longer hedges, denser shrub, properties with extended sessions'],
                ['label' => 'Ecosystem',   'value' => 'Two-stroke gas (50:1 mix)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Echo dealer. Hedge trimmer line: gas HC, eForce 56V cordless, single-sided and dual-action blade configurations.',
        'body'     => '<p>Echo is the hedge-trimmer brand we lead with. Authorised dealer, genuine blades and parts at the counter with Lynn and Ron, and in-house service from Damian and Cody on the small-engine bench.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right hedge trimmer for the property',
        'columns' => ['Model line',                    'Class',          'Best for'],
        'rows'    => [
            ['Echo eForce 56V hedge trimmer',           'Cordless 56V',   'Residential hedges, eForce battery share'],
            ['Echo HC (gas)',                           'Two-stroke gas', 'Longer hedges, denser shrub, longer sessions'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Cordless or gas for hedge work?',
            'a' => 'For most residential hedges, the eForce cordless will get the job done quietly and without fuel mixing. For longer hedges, denser shrub, or commercial-grade work where the session runs past battery range, gas (Echo HC line) is the right tool. Talk to us on the floor about your specific hedges.',
        ],
        [
            'q' => 'Single-sided or dual-action blade?',
            'a' => 'Dual-action blades cut on both sides of each blade tooth, which gives a cleaner cut on most hedges. Single-sided blades are simpler and lighter, right for some lighter-duty work. Most of our floor stock is dual-action; we can spec single-sided if you have a specific use case.',
        ],
        [
            'q' => 'Do you sharpen blades?',
            'a' => 'Yes. Damian and Cody handle blade sharpening on the bench. We also stock Echo replacement blades at the counter if the blade is past sharpening.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at hedge trimmers on the floor?',
        'body'      => '<p>Drop in and walk the Echo hedge-trimmer lineup, or give us a call and we can spec the right trim for your hedge work.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See the cordless 56V system', 'href' => '/lawn-and-garden/cordless-56v/'],
    ],
];
```

---

## PAGE 4 — lawn-and-garden--edgers.php (NEW PAGE, edgers class)

```php
<?php
/**
 * Category config: lawn-and-garden -> edgers
 * Frame: All-edgers parent. Echo gas + Echo eForce 56V cordless.
 * 2 anchors: Echo gas edger line (stock-flagged) + Echo eForce 56V cordless edger (stock-flagged; DPE-2100 not in prior shipped batch).
 */

return [
    'category_slug' => 'edgers',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Lawn Edgers',
        'subtitle' => 'Echo gas and Echo eForce 56V cordless lawn edgers. Crisp lines along driveways, walkways and bed edges.',
        'cta'      => [
            'primary'   => ['label' => 'See the edger lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',       'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Edgers for crisp property lines',
        'body'  => '<p>Lawn edgers are the right tool for the kind of clean line a string trimmer cannot give you. Driveway edges, walkway edges, around flower beds, along the foundation, the kind of detail work that takes a property from "trimmed" to "finished." Echo is the brand we lead with on dedicated edgers. Authorised dealer, genuine edger blades at the parts counter, and full in-house service.</p><p>Two paths: gas (the Echo PE line) is the right tool for serious property work, longer running times, and the customer who wants a dedicated gas edger built specifically for blade work. Cordless (the Echo eForce 56V cordless edger) is the right tool for residential yards, quieter starts, no fuel mixing, and the customer who is building into the eForce platform.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on whether you actually need a dedicated edger or whether the Pro Attachment Series (PAS) edger attachment on a powerhead you already own is the better economic call. Damian and Cody handle blade replacement, fuel system service, and warranty on the small-engine bench. Lynn and Ron stock Echo edger blades and the eForce 56V batteries and chargers.</p>',
    ],

    'subcategories' => [
        ['label' => 'Trimmers'],
        ['label' => 'Chainsaws'],
        ['label' => 'Hedge Trimmers'],
        ['label' => 'Edgers'],
        ['label' => 'Pro Attachment Series'],
        ['label' => 'Cordless 56V'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-eforce-cordless-edger',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo eForce 56V Cordless Lawn Edger',
            'tagline'      => 'Brushless 56V cordless edger. Same battery as the rest of the eForce line.',
            'why'          => '<p>The Echo eForce cordless edger runs on the same 56V battery as the Echo cordless trimmer, chainsaw, blower, hedge trimmer and mower. Brushless motor, dedicated edger blade, depth control, and the kind of cutting capacity that handles residential edge work cleanly. Right tool for the customer who is building into the eForce platform or who wants to skip fuel mixing for edge work.</p><p>Stock pending plumb verification on the exact eForce edger trim we have at the moment. Talk to us on the floor about depth-control specifics and the right wheel-versus-curb-guide config for your property edges. Same eForce battery share as the rest of the line.</p>',
            'how'          => [
                ['icon' => 'bolt',                   'title' => 'Brushless 56V power',  'description' => 'Holds cutting speed under load on hard-packed edge soil.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce battery share', 'description' => 'Same 56V battery as the rest of the Echo cordless line.'],
                ['icon' => 'engineering',            'title' => 'In-house service',      'description' => 'Damian and Cody do blade and warranty work in-house.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Cordless lawn edger (56V eForce)'],
                ['label' => 'Best for',    'value' => 'Residential edges, eForce platform builders, no-fuel work'],
                ['label' => 'Ecosystem',   'value' => 'Echo eForce 56V (battery shared)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-pe-gas-edger-line',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PE Gas Lawn Edger Line',
            'tagline'      => 'Two-stroke gas edger built specifically for blade work and serious edging.',
            'why'          => '<p>The Echo PE line is the dedicated gas edger. Built for blade work specifically (not a string-trimmer-with-an-edger-attachment), with the depth control and wheel geometry that gives you clean lines on long edge runs. Right tool for the customer doing serious property work, commercial edging, or edges where a cordless battery would not cover the session.</p><p>Stock pending plumb verification on the specific PE trims we have at the moment. Damian and Cody do the small-engine service in-house. Same authorised Echo dealer support as the cordless line.</p>',
            'how'          => [
                ['icon' => 'speed',          'title' => 'Two-stroke gas',        'description' => 'Longer running for serious edge work.'],
                ['icon' => 'verified',       'title' => 'Dedicated edger',       'description' => 'Built for blade work, not a trimmer attachment.'],
                ['icon' => 'engineering',    'title' => 'In-house tune',          'description' => 'Damian and Cody do the carb and fuel system service.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Gas lawn edger (Echo PE line)'],
                ['label' => 'Best for',    'value' => 'Serious property edging, longer sessions, commercial work'],
                ['label' => 'Ecosystem',   'value' => 'Two-stroke gas (50:1 mix)'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Echo dealer. Edger line: gas PE, eForce 56V cordless, plus PAS attachment edger as the modular alternative.',
        'body'     => '<p>Echo is the edger brand we lead with. Dedicated gas (PE line) and cordless (eForce 56V) options, plus the Pro Attachment Series edger if you are running a PAS powerhead and want to add edging to the toolset. We can talk through the dedicated-vs-attachment decision on the floor.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right edger for the property',
        'columns' => ['Model line',                    'Class',          'Best for'],
        'rows'    => [
            ['Echo eForce 56V edger',                   'Cordless 56V',   'Residential edges, eForce battery share'],
            ['Echo PE (gas)',                           'Two-stroke gas', 'Serious edging, longer sessions, commercial work'],
            ['PAS edger attachment',                    'Modular',        'Customers running a PAS powerhead already'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Dedicated edger or PAS attachment?',
            'a' => 'If you already own a Pro Attachment Series (PAS) powerhead, the PAS edger attachment is the cheaper way to add edging to your toolset. If you are buying your first edger and you are not in the PAS ecosystem, a dedicated edger (gas PE or cordless eForce) is usually the right call because the depth control and wheel geometry are purpose-built. We can walk through it on the floor.',
        ],
        [
            'q' => 'Cordless or gas for residential edges?',
            'a' => 'For most residential properties, the eForce cordless edger will get a session done. Quiet, no fuel mixing, push-button start. For larger properties or commercial edging where the session runs longer, gas (Echo PE) is the right tool.',
        ],
        [
            'q' => 'Do you stock replacement edger blades?',
            'a' => 'Yes. Lynn and Ron stock Echo edger blades at the parts counter for both the gas PE line and the eForce cordless. Bring the old blade in if you are not sure of the part number.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to look at edgers on the floor?',
        'body'      => '<p>Drop in and walk the Echo edger lineup. We can spec the right gas-versus-cordless and the dedicated-vs-attachment call for your property.</p>',
        'primary'   => ['label' => 'Visit the shop',          'href' => '/contact/'],
        'secondary' => ['label' => 'See Pro Attachment Series', 'href' => '/lawn-and-garden/pro-attachment-series/'],
    ],
];
```

---

## PAGE 5 — lawn-and-garden--pro-attachment-series.php (NEW PAGE, PAS modular system)

```php
<?php
/**
 * Category config: lawn-and-garden -> pro-attachment-series
 * Frame: Echo Pro Attachment Series (PAS) modular powerhead system.
 * 3 anchors: PAS powerhead line (stock-flagged) + PAS attachment family overview (stock-flagged) + ecosystem-pick FAQ-anchor.
 */

return [
    'category_slug' => 'pro-attachment-series',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Echo Pro Attachment Series (PAS)',
        'subtitle' => 'One Echo powerhead. Multiple attachments. Trimmer, edger, brush cutter, hedge trimmer, sweeper, blower and pole-pruner on the same engine.',
        'cta'      => [
            'primary'   => ['label' => 'See the PAS system', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',     'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'One powerhead, multiple tools',
        'body'  => '<p>The Echo Pro Attachment Series (PAS) is the modular handheld OPE system. You buy one Echo PAS powerhead (the gas engine, the controls, the throttle), and then you buy attachments that snap into the front: a trimmer head, an edger head, a hedge-trimmer head, a brush-cutter head, a sweeper, a blower, even a pole-pruner. Each attachment is purpose-built; the powerhead is shared across all of them.</p><p>The economic case is straightforward: one engine to maintain, one carb to tune, one fuel mix to keep, but multiple tools at your disposal. The right call for the customer who needs more than one handheld OPE tool but does not want to own and maintain four separate engines. Trade-off is that you can only run one attachment at a time and you do have to swap them out, so if you are doing back-to-back trimming and hedge work in a tight session, two dedicated tools may be faster.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the PAS-versus-dedicated-tools economic question (it usually comes down to how many handheld tools you actually need and whether you mind the swap). Damian and Cody handle PAS powerhead service: fuel system, carb, attachment-coupling adjustment, warranty. Lynn and Ron stock the PAS attachment line at the parts counter and can order specific attachments on quick turnaround.</p>',
    ],

    'subcategories' => [
        ['label' => 'Trimmers'],
        ['label' => 'Chainsaws'],
        ['label' => 'Hedge Trimmers'],
        ['label' => 'Edgers'],
        ['label' => 'Pro Attachment Series'],
        ['label' => 'Cordless 56V'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-pas-powerhead-line',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PAS Powerhead Line',
            'tagline'      => 'The gas engine that runs the entire PAS attachment family. One powerhead, multiple tools.',
            'why'          => '<p>The Echo PAS powerhead is the engine end of the modular system. Two-stroke architecture, sized to run the attachments confidently, with a quick-coupling system on the front of the shaft that accepts the full PAS attachment line. We carry PAS powerheads in multiple displacement tiers; the right one depends on which attachments you plan to run (heavier-duty attachments like the brush cutter or pole-pruner ask more from the engine than the trimmer or edger).</p><p>Stock pending plumb verification on the specific PAS powerhead trims we have at the moment. Talk to us on the floor about which attachments you plan to run and we can spec the right powerhead displacement to match.</p>',
            'how'          => [
                ['icon' => 'bolt',           'title' => 'Single engine, multi-tool','description' => 'One two-stroke powerhead runs the full PAS attachment family.'],
                ['icon' => 'verified',       'title' => 'Quick-coupling shaft',    'description' => 'Snap-in attachment system. Swap tools in under a minute.'],
                ['icon' => 'engineering',    'title' => 'In-house service',         'description' => 'Damian and Cody handle powerhead carb and fuel system on the bench.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'Modular powerhead (Echo PAS)'],
                ['label' => 'Best for',    'value' => 'Customers running multiple handheld tools, multi-tool economy'],
                ['label' => 'Ecosystem',   'value' => 'Two-stroke gas (50:1 mix), Echo PAS attachment family'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-pas-attachment-family',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'Echo PAS Attachment Family',
            'tagline'      => 'Trimmer, edger, brush cutter, hedge trimmer, sweeper, blower, pole-pruner. All on one PAS powerhead.',
            'why'          => '<p>The PAS attachment family covers the full handheld OPE range from a single powerhead. Trimmer attachment for grass, edger for clean lines, brush cutter for heavier clearing, hedge trimmer for shrubs (including articulating-head versions for high reach), sweeper for sidewalks and driveways, blower for cleanup, and the pole-pruner for limbing without a ladder. Each attachment is purpose-built; the engineering is in the attachment, not just an adapter on a generic shaft.</p><p>Stock pending plumb verification on the specific attachment trims we have at the moment. Most attachments can be ordered on quick turnaround if we do not have what you need on the floor; talk to Lynn or Ron at the parts counter.</p>',
            'how'          => [
                ['icon' => 'category',       'title' => 'Full tool family',     'description' => 'Trimmer, edger, brush, hedge, sweeper, blower, pole-pruner.'],
                ['icon' => 'precision_manufacturing','title' => 'Purpose-built heads','description' => 'Each attachment is engineered for the job, not a generic adapter.'],
                ['icon' => 'inventory_2',    'title' => 'Quick-order',           'description' => 'Lynn and Ron can order any attachment we do not stock floor-side.'],
            ],
            'what'         => [
                ['label' => 'Class',       'value' => 'PAS attachment family (Echo)'],
                ['label' => 'Best for',    'value' => 'Multi-tool homeowners, property managers, modular ecosystem fans'],
                ['label' => 'Ecosystem',   'value' => 'Echo PAS modular system'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-pas-vs-dedicated-decision',
            'product_id'   => 0,
            'thumbnail_id' => 0,
            'heading'      => 'PAS Modular or Dedicated Tools? Talking Through the Pick',
            'tagline'      => 'When PAS makes economic sense, when dedicated tools win, and how we walk through it on the floor.',
            'why'          => '<p>The PAS-versus-dedicated decision is one of the most common conversations we have on the OPE floor. The short version: PAS wins when you need three or more handheld tools and you do not mind swapping attachments, because you maintain one engine instead of three. Dedicated tools win when you need to use two tools back-to-back in the same session (no swap downtime), or when one of the dedicated tools is an eForce cordless and you would rather skip the fuel-mixing step.</p><p>Most homeowners with a single property and a small handful of OPE tasks find the PAS economy worth it. Larger properties, commercial users, or eForce-platform builders often go dedicated. There is no wrong answer; the right call depends on your specific tool set and how you work. Walk in and we can talk through it in fifteen minutes.</p>',
            'how'          => [
                ['icon' => 'savings',        'title' => 'PAS economy',           'description' => 'One engine, multiple tools. Lower total cost on three-plus tools.'],
                ['icon' => 'fast_forward',   'title' => 'Dedicated speed',       'description' => 'No swap downtime. Right call for back-to-back session work.'],
                ['icon' => 'forum',          'title' => 'Floor consultation',    'description' => 'We talk through your toolset and your sessions to spec the pick.'],
            ],
            'what'         => [
                ['label' => 'Decision factor', 'value' => 'How many tools you need + how often you swap'],
                ['label' => 'PAS wins when',   'value' => 'Three-plus tools, occasional use, multi-tool maintenance economy'],
                ['label' => 'Dedicated wins',  'value' => 'Back-to-back sessions, one cordless tool, single-purpose work'],
                ['label' => 'Brand',           'value' => 'Echo (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Echo dealer. Full PAS modular system: powerheads + attachment family + in-house service.',
        'body'     => '<p>The Echo Pro Attachment Series is the modular OPE system that lets one powerhead run multiple tools. We stock PAS powerheads and core attachments on the floor; Lynn and Ron can quick-order any attachment we do not have on hand.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'PAS modular vs dedicated tools at a glance',
        'columns' => ['Approach',                  'Strength',                            'Trade-off'],
        'rows'    => [
            ['PAS modular (one powerhead)',         'Lowest total cost on three-plus tools','Cannot run two tools at once; requires attachment swap'],
            ['Dedicated tools (one per job)',       'No swap; back-to-back session ready', 'Higher total cost; multiple engines to maintain'],
            ['Hybrid (PAS + 1 dedicated)',          'Common pick; PAS for occasional, dedicated for daily','Two ecosystems to keep parts for'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Does the PAS work with the Echo eForce 56V battery?',
            'a' => 'No. The PAS powerhead is gas (two-stroke). The eForce 56V cordless line is its own ecosystem (battery powered, dedicated tools, no PAS shaft compatibility). If you want the cordless ecosystem, you build into eForce dedicated tools rather than PAS attachments.',
        ],
        [
            'q' => 'Can I add attachments later as I need them?',
            'a' => 'Yes. The whole point of the PAS system is that you can buy the powerhead now and add attachments over time as your property work expands. Lynn and Ron can order any PAS attachment on quick turnaround.',
        ],
        [
            'q' => 'How long does an attachment swap take?',
            'a' => 'Less than a minute once you are practiced. The PAS coupling is a quick-clamp system on the front of the shaft. First couple of swaps feel slow; after a few times it is automatic.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to talk PAS on the floor?',
        'body'      => '<p>Drop in and we can walk you through the PAS powerhead options, the attachment family, and the modular-vs-dedicated economic call for your specific toolset.</p>',
        'primary'   => ['label' => 'Visit the shop',           'href' => '/contact/'],
        'secondary' => ['label' => 'See the cordless 56V system', 'href' => '/lawn-and-garden/cordless-56v/'],
    ],
];
```

---

## PAGE 6 — lawn-and-garden--cordless-56v.php (NEW PAGE, eForce cross-category aggregate)

```php
<?php
/**
 * Category config: lawn-and-garden -> cordless-56v
 * Frame: Echo eForce 56V CROSS-CATEGORY AGGREGATE. The platform-wide pitch (one battery, multiple tools across categories).
 * Distinct from /echo-56v-system/; this is the cross-category list; that is the system / brand-platform page.
 * 6 anchors: trimmer (DSRM-2100, id 359 confirmed) + chainsaw rear-handle (DCS-5000, id 233) + chainsaw top-handle (DCS-2500T, id 351) + mower push (DLM-2100, id 353) + mower self-propel (DLM-2100SP, id 354) + blower (DPB-2500, id 357).
 */

return [
    'category_slug' => 'cordless-56v',
    'parent_slug'   => 'lawn-and-garden',

    'hero' => [
        'title'    => 'Echo eForce 56V Cordless Tools',
        'subtitle' => 'One battery. Multiple tools. The full Echo eForce 56V cordless lineup across trimmer, chainsaw, blower, mower, hedge trimmer and edger.',
        'cta'      => [
            'primary'   => ['label' => 'See the eForce 56V tools', 'anchor' => '#products'],
            'secondary' => ['label' => 'See the eForce platform',  'href' => '/lawn-and-garden/echo-56v-system/'],
        ],
    ],

    'intro' => [
        'title' => 'All the 56V tools across categories',
        'body'  => '<p>This is the cross-category view of the Echo eForce 56V cordless line. Instead of looking at one tool at a time (the trimmer page, the chainsaw page, the mower page) this page shows you all the eForce tools in one place. The single shared 56V battery is the headline; everything that runs on it sits below. If you are building into the cordless platform across multiple tools, this is the page that helps you see the full picture before you commit to the first battery purchase.</p><p>The economic case is straightforward: the 56V battery and the rapid charger are the expensive parts of any cordless tool. Buy them once, then add the tool ends (the trimmer, the chainsaw, the blower, the mower, the hedge trimmer, the edger) as you need them. The brushless motors on the eForce line hold torque under load in a way most cordless tools do not, which is the part that makes this a real cordless platform rather than a hardware-store toy line.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on platform-build planning (which tool to buy first, when the battery investment pays back, when gas is still the right call for parts of your toolset). Damian and Cody handle eForce service: battery checks, motor work, warranty. Lynn and Ron at the parts counter stock the 56V battery sizes (2.5Ah, 5Ah and others), the rapid charger, and the eForce-specific consumables (mower blades, trimmer line, chainsaw bars and chains).</p>',
    ],

    'subcategories' => [
        ['label' => 'Trimmers'],
        ['label' => 'Chainsaws'],
        ['label' => 'Hedge Trimmers'],
        ['label' => 'Edgers'],
        ['label' => 'Pro Attachment Series'],
        ['label' => 'Cordless 56V'],
    ],

    'series_models' => [
        [
            'slug'         => 'echo-dsrm-2100-cordless-trimmer-aggregate',
            'product_id'   => 359,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DSRM-2100 56V Cordless String Trimmer',
            'tagline'      => 'The eForce trimmer. Brushless 56V, gas-grade torque.',
            'why'          => '<p>The DSRM-2100 is the eForce trimmer in the Echo cordless line. Brushless motor, 56V battery, Speed-Feed 400 head. Right tool for residential yard trimming and the customer building into the eForce platform. Same battery as every other tool on this page.</p>',
            'how'          => [
                ['icon' => 'bolt',                   'title' => 'Brushless 56V',     'description' => 'Holds torque under load on heavier yard grass.'],
                ['icon' => 'battery_charging_full',  'title' => 'Shared battery',    'description' => 'Same 56V battery as the chainsaw, mower, blower and more.'],
                ['icon' => 'engineering',            'title' => 'In-house service',   'description' => 'Damian and Cody do warranty and service in-house.'],
            ],
            'what'         => [
                ['label' => 'Tool',        'value' => 'String trimmer'],
                ['label' => 'Best for',    'value' => 'Residential yard trimming, eForce platform first tool'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-dcs-5000-cordless-chainsaw-aggregate',
            'product_id'   => 233,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DCS-5000 56V Cordless Chainsaw (18in Rear-Handle)',
            'tagline'      => 'Eighteen-inch rear-handle eForce chainsaw. Storm-cleanup-ready cordless cutting.',
            'why'          => '<p>The DCS-5000 is the rear-handle cordless chainsaw in the eForce line. 18-inch bar, brushless motor, automatic chain oiler, full-comp chain. Right tool for storm cleanup, firewood bucking and homeowner cutting.</p>',
            'how'          => [
                ['icon' => 'bolt',                   'title' => 'Brushless 56V',     'description' => 'Holds chain speed under load. Real cordless cutting torque.'],
                ['icon' => 'precision_manufacturing','title' => '18-inch bar',       'description' => 'Right size for most homeowner cutting work.'],
                ['icon' => 'engineering',            'title' => 'Bench chain service','description' => 'Damian and Cody sharpen chains on the bench in-house.'],
            ],
            'what'         => [
                ['label' => 'Tool',        'value' => 'Chainsaw (rear-handle, 18in)'],
                ['label' => 'Best for',    'value' => 'Storm cleanup, firewood, homeowner cutting'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-dcs-2500t-cordless-chainsaw-aggregate',
            'product_id'   => 351,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DCS-2500T 56V Cordless Chainsaw (16in Top-Handle)',
            'tagline'      => 'Sixteen-inch top-handle eForce chainsaw. One-handed limbing and tree work.',
            'why'          => '<p>The DCS-2500T is the top-handle variant in the eForce chainsaw line. 16-inch bar, brushless motor, top-handle grip for one-handed work in trees and tight limbing.</p>',
            'how'          => [
                ['icon' => 'precision_manufacturing','title' => 'Top-handle form',  'description' => 'One-handed grip for tree work and limbing from height.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce 56V',       'description' => 'Same battery as the rest of the cordless line.'],
                ['icon' => 'shield',                 'title' => 'Pro-class tool',   'description' => 'Top-handle saws are skill-dependent. Talk to us about fit.'],
            ],
            'what'         => [
                ['label' => 'Tool',        'value' => 'Chainsaw (top-handle, 16in)'],
                ['label' => 'Best for',    'value' => 'Tree work, limbing from height'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-dlm-2100-cordless-mower-aggregate',
            'product_id'   => 353,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DLM-2100 56V Cordless Push Mower',
            'tagline'      => 'Push mower on the eForce battery. Quiet, light, no fuel.',
            'why'          => '<p>The DLM-2100 is the entry-point cordless mower in the eForce line. 21-inch deck, brushless motor, push (no self-propel). Right tool for a flat quarter-acre lot.</p>',
            'how'          => [
                ['icon' => 'agriculture',            'title' => '21-inch deck',     'description' => 'Right deck for residential and small-cottage lots.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce 56V',       'description' => 'Same battery as the trimmer, chainsaw, blower.'],
                ['icon' => 'volume_off',             'title' => 'Quiet runtime',     'description' => 'Brushless motor; quieter than gas. Mow at seven AM without complaint.'],
            ],
            'what'         => [
                ['label' => 'Tool',        'value' => 'Mower (push, 21in deck)'],
                ['label' => 'Best for',    'value' => 'Flat quarter-acre lots, small cottage lots'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-dlm-2100sp-cordless-mower-aggregate',
            'product_id'   => 354,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DLM-2100SP 56V Cordless Self-Propelled Mower',
            'tagline'      => 'Self-propelled cordless mower. Same eForce battery, the deck pulls itself.',
            'why'          => '<p>The DLM-2100SP is the self-propelled variant. Same 21-inch deck, same brushless motor and same 56V battery as the push DLM-2100, with rear-wheel self-propel drive. Right step up if your yard has any kind of slope.</p>',
            'how'          => [
                ['icon' => 'directions_run',         'title' => 'Self-propel',       'description' => 'Bail-handle drive. Disengages clean for tight corners.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce 56V',        'description' => 'Same battery as the push mower and the rest of the line.'],
                ['icon' => 'engineering',            'title' => 'Bench service',     'description' => 'Damian and Cody do warranty and seasonal service.'],
            ],
            'what'         => [
                ['label' => 'Tool',        'value' => 'Mower (self-propelled, 21in deck)'],
                ['label' => 'Best for',    'value' => 'Sloped yards, larger lots, longer mow sessions'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
        [
            'slug'         => 'echo-dpb-2500-cordless-blower-aggregate',
            'product_id'   => 357,
            'thumbnail_id' => 0,
            'heading'      => 'Echo DPB-2500 56V Cordless Blower',
            'tagline'      => 'Brushless 56V cordless blower. Real moving air, no gas.',
            'why'          => '<p>The DPB-2500 is the cordless blower in the eForce line. Brushless motor, real moving air for leaf and debris cleanup, and the same 56V battery as the rest of the platform. Right tool for residential cleanup, driveway and walkway clearing, and the customer building into the eForce ecosystem.</p>',
            'how'          => [
                ['icon' => 'air',                    'title' => 'Real moving air',   'description' => 'Brushless 56V air output for residential cleanup work.'],
                ['icon' => 'battery_charging_full',  'title' => 'eForce 56V',        'description' => 'Same battery as the trimmer, chainsaw, mower.'],
                ['icon' => 'volume_off',             'title' => 'Quieter than gas',  'description' => 'Cordless blower noise is far below gas-blower noise.'],
            ],
            'what'         => [
                ['label' => 'Tool',        'value' => 'Blower (handheld cordless)'],
                ['label' => 'Best for',    'value' => 'Residential cleanup, driveway and walkway clearing'],
                ['label' => 'Brand',       'value' => 'Echo (authorised dealer)'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Echo eForce 56V',
        'logo_id'  => 0,
        'tagline'  => 'One battery. Multiple tools. Authorised Echo dealer with full in-house eForce service.',
        'body'     => '<p>The Echo eForce 56V platform is the cordless OPE ecosystem we lead with at the shop. The same battery and rapid charger run the trimmer, chainsaw, blower, mower, hedge trimmer, edger and pole-saw. Buy the battery once; add the tool ends as you need them. Damian and Cody handle service in-house, Lynn and Ron stock batteries and consumables at the parts counter.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'The eForce 56V tool family at a glance',
        'columns' => ['Tool',                       'Model',           'Best for'],
        'rows'    => [
            ['String trimmer',                       'DSRM-2100',       'Residential trimming, eForce first tool'],
            ['Chainsaw (rear-handle, 18in)',         'DCS-5000',        'Storm cleanup, firewood, homeowner cutting'],
            ['Chainsaw (top-handle, 16in)',          'DCS-2500T',       'Tree work, limbing from height'],
            ['Mower (push, 21in)',                   'DLM-2100',        'Flat quarter-acre lots'],
            ['Mower (self-propelled, 21in)',         'DLM-2100SP',      'Sloped yards, larger lots'],
            ['Blower',                               'DPB-2500',        'Residential cleanup, driveway clearing'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Does the same battery really run all of these tools?',
            'a' => 'Yes. That is the entire point of the Echo eForce 56V platform. Buy one 56V battery and one rapid charger; the same pack snaps into the trimmer, the chainsaw, the blower, the mower and the rest of the eForce line. Multiple-battery investment is what most heavy-use customers settle on (one in the tool, one on the charger, one as backup), but the platform works on a single battery if you only run one tool at a time.',
        ],
        [
            'q' => 'What battery size do I need?',
            'a' => 'The 5Ah pack is the right size for most sessions on most tools. The 2.5Ah is the lighter top-up battery (good for short trim sessions or as a charger backup). Higher-capacity packs are available for the mower if you are running longer mow sessions. We can spec the right pack mix for your tool set on the floor.',
        ],
        [
            'q' => 'How is this different from the Echo 56V System page?',
            'a' => 'This page is the cross-category tool list (trimmer, chainsaw, blower, mower in one view). The Echo 56V System page is the platform-level pitch (the battery, the charger, the ecosystem story, the buy-once-add-tools model). Two ways into the same platform; the System page if you are deciding whether eForce is right for you, this page if you already know it is and you want to see the full tool family.',
        ],
        [
            'q' => 'When is gas still the right call?',
            'a' => 'Felling work and all-day commercial cutting on the chainsaw side. Heavier brush clearing on the trimmer side. Larger properties where the mow session would outlast a battery. Hedge work on dense commercial-grade hedges. The eForce platform handles residential and most cottage-property work; for the heavier or longer use cases, gas is still the right tool. We carry both lines and we can talk through the split.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to build into the eForce platform?',
        'body'      => '<p>Drop in and walk the eForce lineup. We can spec the first tool, the right battery pack mix, and the order to add the rest of the tools as your property work expands.</p>',
        'primary'   => ['label' => 'Visit the shop',         'href' => '/contact/'],
        'secondary' => ['label' => 'See the platform page',   'href' => '/lawn-and-garden/echo-56v-system/'],
    ],
];
```

---

## QC checklist (web-copy author side)

**SKU verification (per banked working-process rule):**
- [x] DSRM-2100 (trimmer, id 359) — boss-VERIFIED via Batch 5 plumb (cordless-trimmers config)
- [x] DCS-5000 (chainsaw rear-handle, id 233) — boss-VERIFIED via Batch 5 plumb (cordless-chainsaws config)
- [x] DCS-2500T (chainsaw top-handle, id 351) — boss-VERIFIED via Batch 5 plumb (cordless-chainsaws config)
- [x] DLM-2100 (mower push, id 353) — boss-VERIFIED via Batch 5 plumb (cordless-mowers config)
- [x] DLM-2100SP (mower self-propelled, id 354) — boss-VERIFIED via Batch 5 plumb (cordless-mowers config)
- [x] DPB-2500 (blower, id 357) — boss-VERIFIED via Batch 5 plumb (cordless-blowers config)
- [ ] verify Echo SRM gas trimmer line stock + WC product_ids at plumb (no specific SKUs asserted; line-level reference only)
- [ ] verify Echo CS gas chainsaw line stock + WC product_ids at plumb (no specific SKUs asserted; line-level reference only)
- [ ] verify Echo eForce 56V cordless hedge trimmer SKU stock + WC product_id at plumb (DHC-2100 not in prior shipped batch; line-level framing only)
- [ ] verify Echo HC gas hedge-trimmer line stock + WC product_ids at plumb (no specific SKUs asserted)
- [ ] verify Echo eForce 56V cordless edger SKU stock + WC product_id at plumb (DPE-2100 not in prior shipped batch; line-level framing only)
- [ ] verify Echo PE gas edger line stock + WC product_ids at plumb (no specific SKUs asserted)
- [ ] verify Echo PAS powerhead trims + attachment family stock at plumb (line-level + family-level framing only; no specific SKUs asserted)

**Voice / format:**
- [x] Canadian English (authorised, neighbour, etc.)
- [x] No em-dashes anywhere in PHP body. Both Unicode AND HTML entities checked.
- [x] No banned AI tells
- [x] No "Talk to Casey" / "Call Casey" / "ask Casey" CTAs (Casey alone OK in body copy)
- [x] No inline Casey / Aaron quotes (Casey-gate active)
- [x] No Kory references anywhere (banked rule from boss msg 1778091499545 — Kory departed Reyco, must not appear on site)
- [x] No founding-year claims for Reyco; present-tense framing
- [x] Staff names match roster (Casey, Aaron, Lee, Damian, Cody, Lynn, Ron). Damian + Cody on the small-engine bench; same as prior LG copy.
- [x] Echo is in the 11-brand authorised list

**Cross-link integrity:**
- [x] All 6 pages have a 6-tab subcategories band (static label strip per boss msg 1778091499545 plumb-clean preference). No anchors, no hrefs.
- [x] Each page CTA secondary cross-links to the most-natural sibling: trimmers → cordless-56v, chainsaws → cordless-56v, hedge-trimmers → cordless-56v, edgers → pro-attachment-series, pro-attachment-series → cordless-56v, cordless-56v → echo-56v-system.
- [x] cordless-56v page hero CTA secondary links to /echo-56v-system/ (the pre-existing platform/system page from Batch 5).

**Dev-side flags:**
- [ ] Page-template binding: `_wp_page_template = page-templates/series-showcase.php` on all 6 LG class pages (per banked memory `project_reyco_wp_template_migration_pattern.md`). WP-CLI patch needed if pages already exist; if pages need creation, `wp post create` first.
- [ ] WC `product_category` taxonomy assignment fix: same boss-side WC fix as powersports; out of my scope per dispatch.
- [ ] Material Symbols icon name verification: `bolt`, `battery_charging_full`, `engineering`, `speed`, `verified`, `forest`, `tune`, `precision_manufacturing`, `shield`, `category`, `inventory_2`, `savings`, `fast_forward`, `forum`, `agriculture`, `volume_off`, `directions_run`, `air`. All standard Material Symbols; should render. Fall-backs: `nature` for `forest`, `wind_power` for `air`, `nordic_walking` for `directions_run`.
- [ ] Brand-band logos and per-entry thumbnails all 0 placeholders. Echo brand logo + per-tool thumbnails to be supplied at content polish.

**Subcategories band shape note:** all 6 pages use the static label strip pattern (`['label' => 'X']` only, no anchor/href). Per boss msg 1778091499545 plumb-clean preference — avoids template cross-page-href edge case.

---

## Rollout summary table (updated through LG batch)

| Batch | Date | Pages | Entries | Commit | Status |
|-------|------|-------|---------|--------|--------|
| 1 | 2026-05-XX | 4 | ~17 | 6b235a9 | Shipped + plumbed |
| 2 | 2026-05-XX | 4 | ~17 | aed97e2 | Shipped + plumbed |
| 3 | 2026-05-XX | 4 | ~17 | 01d3c4d | Shipped + plumbed |
| 4 | 2026-05-05 | 4 | ~17 | 23ac57e | Shipped + plumbed |
| 5 | 2026-05-06 | 5 | ~9 | 1c0c7bf + a7b91fa | Shipped + plumbed |
| Princecraft | 2026-05-06 | 1 | 5 | b2d7ff0 | Shipped, plumb pending |
| Minn Kota | 2026-05-06 | 1 | 5 | 0764a66 | Shipped, plumb pending |
| Mercury + Humminbird | 2026-05-06 | -- | -- | -- | HALTED (Aiden-confirmed acceptable as-is) |
| Powersports class | 2026-05-06 | 4 (NEW) | 12 | cfd9f8b + 40742d0 | Shipped, plumb pending |
| LG class (this) | 2026-05-06 | 6 (NEW) | ~16 | TBD | Author-side ready, plumb pending |

Cumulative through this deliverable: 33 pages of new / replaced category configs, ~103 unique series-models entries on the author side.

---

## Working notes (post-launch follow-ups)

1. **Subcategories band shape:** static label strip across all 6 LG pages, mirroring the powersports fix-pass (commit 40742d0). Same pattern; same plumb-clean preference.
2. **Echo gas SKU stock-flag sweep:** when Casey / Lynn confirm the actual gas trimmer / chainsaw / hedge / edger / PAS SKUs Reyco currently floors, content polish can add specific SKU anchors with confirmed product_ids (parallel to how Batch 5 cordless got plumbed).
3. **eForce hedge-trimmer + edger SKUs (DHC-2100, DPE-2100):** these were not in any prior shipped batch with confirmed product_id, so they are flagged stock-pending-plumb. If they exist in WC inventory at plumb time, can be added as named anchors at the next refresh.
4. **PAS attachment family detail:** this deliverable frames PAS at the family level rather than the individual-attachment level. If Aiden / Casey wants individual attachment cards (PAS edger, PAS hedge trimmer, PAS pole-pruner each as their own anchor), content polish can expand the PAS page from 3 anchors to 7-8.
5. **Echo 56V System (existing) vs Cordless 56V (this) distinction:** the System page is the platform-level brand pitch; this Cordless 56V page is the cross-category tool aggregate. FAQ Q3 on the Cordless 56V page calls out the distinction explicitly so customers can navigate both.
6. **Casey / Aaron quote refresh:** consistent with all prior brand-page deliverables today, this carries no inline owner-voice quotes. Casey-gate clearance can drop quotes onto specific entries at content polish.
7. **Kory-scrub queue:** per boss msg 1778091738917 — the prior shipped Reyco copy with Kory references will be batched into a single grep-and-replace PR by boss. Web-copy side delivers the file list with this ship message.

End of deliverable.
