# Cannon Downriggers FULL CONFIG — boats-marine--downriggers.php (NEW page-1404 stand-up)

**Scope:** Full series-showcase config for `boats-marine--downriggers.php`. Page id 1404 currently has NO config and product-category.php falls back to default-empty render ("totally broken, just CTA banners across the entire thing" per Aiden via boss msg 1778100130973).

**Source dispatch:** boss msg 1778100130973-boss-omotm. 16 series_models entries to author from boss-supplied real WC product_id enumeration (260-275, all confirmed in Reyco's WC catalogue).

**Source pattern adapted from:** `brand-page-cannon.md` (Format A Mercury-mirror) for hero/intro/experts/local-context/FAQ. Adapted to series-showcase shape (same as Minn Kota expansion 39becd0 + Princecraft + Batches 1-5).

**Voice / format constraints (carried + new):**
- Canadian English; plain language; NO em-dashes (Unicode + 3 HTML entity variants)
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022. Present-tense framing only.
- Casey owner-voice. NO "Talk to Casey" CTAs. NO inline Casey or Lee quotes (Casey-gate carried; reference them as people who work the floor, no direct quotes).
- Staff (post-2026-05-06 update, NO KORY): Casey (sales floor), Aaron (Co-Owner / Service Manager), Lee (marine bench, runs the rigging), Damian / Cody (techs), Lynn / Ron (parts)
- 11-brand authorised list intact. Cannon and Humminbird both inside.
- **Spec-cell length rule (banked PR #211):** `what` array spec values stay ~3-5 words max. Verbose flags (TS-vs-non-TS, electric-vs-manual lane choice, weight-rating warnings) belong in tagline + body, NEVER in spec cell.

**SKU posture:** all 16 product_ids supplied by boss in dispatch (WC catalogue ground truth). Zero `id => 0` placeholders. NOT stock-flagged.

**Cluster structure (6 buyer-journey groups, in series-showcase order):**
1. **Optimum flagship electric** (2 entries) — 260 Optimum TS, 261 Optimum
2. **Magnum workhorse electric** (3 entries) — 262 Magnum 10 TS, 263 Magnum 10, 264 Magnum 5
3. **Uni-Troll manual precision** (3 entries) — 265 Uni-Troll 10 TS, 266 Uni-Troll 10, 267 Uni-Troll 5
4. **Smaller-boat lane** (3 entries) — 268 Easi-Troll, 269 Lake-Troll, 270 Mini-Troll
5. **Cannonball weights** (4 entries) — 271 (4 lb), 272 (6 lb), 273 (8 lb), 274 (10 lb)
6. **Accessory** (1 entry) — 275 Uni-Stacker Release

**TS distinction note:** TS = "Tournament Series" with depth/speed sync to Humminbird / Lowrance fish-finder networks via Cannon's integration handshake. Non-TS units lack the sync but otherwise share the motor/spool/cable architecture. Distinction lead-flagged in tagline of every TS entry.

**Approval gate:** Aiden review before plumb. Boss to plumb on commit.

---

## boats-marine--downriggers.php (FULL CONFIG, NEW)

```php
<?php
/**
 * Category config: boats-and-marine -> downriggers
 * Frame: Cannon downriggers brand-anchored category page (Reyco is authorised Cannon dealer).
 * Series_models cover 11 downrigger SKUs + 4 Cannonball weight SKUs + 1 Uni-Stacker accessory = 16 entries.
 * Cluster order: Optimum flagship -> Magnum workhorse -> Uni-Troll manual -> smaller-boat -> weights -> accessory.
 * Page-id 1404 stand-up: prior config missing, default-empty render. This config replaces nothing; it stands the page up.
 */

return [
    'category_slug' => 'downriggers',
    'parent_slug'   => 'boats-and-marine',

    'hero' => [
        'title'    => 'Cannon Downriggers',
        'subtitle' => 'Authorised Cannon dealer in Sault Ste Marie. Electric and manual downriggers, weights, and trolling accessories. Rigged and installed in-house at the marine bench, sized to your hull and your trolling target.',
        'cta'      => [
            'primary'   => ['label' => 'See the Cannon lineup', 'anchor' => '#products'],
            'secondary' => ['label' => 'Visit the shop',         'href' => '/contact/'],
        ],
    ],

    'intro' => [
        'title' => 'Why Cannon for Lake Superior trolling',
        'body'  => '<p>Lake Superior salmon and lake trout do not come up to meet you. Coho holding at sixty feet over the offshore structure off Gros Cap, lake trout suspended at eighty to a hundred and twenty feet over deep water off Goulais Bay, chinook running deep on a thermocline that shifts week-to-week through July and August. Getting a bait to the right depth at the right speed is the entire game. Serious Great Lakes trollers run downriggers, and the brand most charter captains and serious recreational trollers reach for first is Cannon. They have been building downriggers in the United States since 1968.</p><p>The lineup splits four ways. Optimum is the flagship electric tier with integrated GPS and depth-and-speed sync to your fish finder. Magnum is the workhorse electric tier where most of our customers actually fish day-to-day. Uni-Troll is the manual line for trollers who want Cannon precision without the electric overhead. Easi-Troll, Lake-Troll, and Mini-Troll fill the smaller-boat and back-up rig lanes. Cannonball weights from 4 lb up to 10 lb cover Lake Superior coho through deep-running chinook, and Uni-Stacker accessories let you run a multi-bait spread on the same cable. We rig and install every Cannon downrigger we sell, in-house, sized to how you actually fish.</p>',
    ],

    'experts' => [
        'title' => 'Who you talk to here',
        'body'  => '<p>Casey works the floor on the model-and-loadout match: which Cannon tier fits the boat, how many riggers the hull layout supports, what weight loadout matches your target species. Lee runs the marine bench and handles the rigging itself: gunwale or transom mount, breaker and wiring for electric units, fish-finder integration handshake on the TS lines, rod-holder geometry that keeps your spread from tangling on a turn. Damian and Cody back Lee up on bigger jobs. Lynn and Ron at the parts counter stock Cannonball weights, replacement cables, and Uni-Stacker hardware year-round.</p>',
    ],

    'subcategories' => [
        ['label' => 'Optimum (Flagship Electric)',  'anchor' => '#optimum'],
        ['label' => 'Magnum (Workhorse Electric)',  'anchor' => '#magnum'],
        ['label' => 'Uni-Troll (Manual)',           'anchor' => '#uni-troll'],
        ['label' => 'Smaller-Boat Lane',            'anchor' => '#smaller-boat'],
        ['label' => 'Weights',                      'anchor' => '#weights'],
        ['label' => 'Accessories',                  'anchor' => '#accessories'],
    ],

    'series_models' => [

        // CLUSTER 1: OPTIMUM FLAGSHIP ELECTRIC (2 entries)

        [
            'slug'         => 'cannon-optimum-ts-downrigger',
            'product_id'   => 260,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Optimum TS Downrigger',
            'tagline'      => 'TS = Tournament Series. Flagship electric Cannon with integrated GPS and depth-and-speed sync to your Humminbird or Lowrance fish finder.',
            'why'          => '<p>The Optimum TS is the top of the Cannon lineup. Variable-speed retrieval, integrated GPS positioning, and the smartest auto-deploy logic on the market. The TS designation means depth-and-speed sync to your fish-finder network: drop the bait to a marked depth on the finder, the rigger drops to that depth automatically; speed compensation against current keeps the bait in the strike zone when the boat slows or speeds up in chop. Auto-stop at a programmed depth, positive ion control on the cable, the full Cannon feature set.</p><p>This is the rigger we put on the tournament-rigged Princecraft and on the boats of customers who fish Lake Superior salmon several times a week. The price step over the Magnum 10 TS is real but the integration pays back the first time you set a four-rod spread without thinking about it. Lee handles the install: gunwale mount, breaker and wiring, the Humminbird or Lowrance handshake, rod-holder geometry sized to your hull.</p>',
            'how'          => [
                ['icon' => 'gps_fixed',          'title' => 'Integrated GPS',             'description' => 'GPS positioning built in. Mark a depth, mark a structure, the rigger holds the program.'],
                ['icon' => 'cable',              'title' => 'Fish-finder sync (TS)',      'description' => 'Humminbird and Lowrance handshake. Depth-and-speed sync, auto-deploy, speed compensation in current.'],
                ['icon' => 'engineering',        'title' => 'In-house rigging',           'description' => 'Lee handles gunwale mount, breaker, wiring, finder pairing, rod-holder geometry.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Electric, flagship'],
                ['label' => 'Sync',        'value' => 'TS (Humminbird, Lowrance)'],
                ['label' => 'GPS',         'value' => 'Integrated'],
                ['label' => 'Best for',    'value' => 'Tournament, serious trollers'],
            ],
        ],

        [
            'slug'         => 'cannon-optimum-downrigger',
            'product_id'   => 261,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Optimum Downrigger',
            'tagline'      => 'Same Optimum flagship platform without the TS sync. Variable-speed retrieval, integrated GPS, programmable auto-deploy.',
            'why'          => '<p>The Optimum (non-TS) is the same flagship platform as the Optimum TS without the fish-finder sync handshake. You still get variable-speed retrieval, integrated GPS positioning, programmable auto-deploy at a marked depth, and the same motor and spool architecture. What you give up: depth-and-speed sync from your finder. What you save: the price step.</p><p>Right call for the customer who wants the Optimum build quality and feature set but does not run an integrated finder network, or who runs a finder brand outside the Humminbird / Lowrance pair. Same in-house install pattern as the TS unit. Same warranty support.</p>',
            'how'          => [
                ['icon' => 'bolt',               'title' => 'Variable-speed electric',    'description' => 'Adjustable retrieval speed, programmable depth, auto-stop. Same motor as the TS unit.'],
                ['icon' => 'gps_fixed',          'title' => 'Integrated GPS',             'description' => 'GPS positioning built in. Mark and hold a depth or structure program.'],
                ['icon' => 'savings',            'title' => 'Price step under TS',        'description' => 'Same Optimum platform without the fish-finder sync. Saves the integration premium.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Electric, flagship'],
                ['label' => 'Sync',        'value' => 'No (standalone)'],
                ['label' => 'GPS',         'value' => 'Integrated'],
                ['label' => 'Best for',    'value' => 'Optimum buyers without TS need'],
            ],
        ],

        // CLUSTER 2: MAGNUM WORKHORSE ELECTRIC (3 entries)

        [
            'slug'         => 'cannon-magnum-10-ts-downrigger',
            'product_id'   => 262,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Magnum 10 TS Downrigger',
            'tagline'      => 'TS = Tournament Series. Workhorse electric Cannon with depth-and-speed sync to Humminbird or Lowrance. Faster retrieval than the standard Magnum.',
            'why'          => '<p>The Magnum 10 TS is the workhorse electric rigger with the TS feature set. Cannon`s standard motor in the 10-pound-class spool, faster retrieval than the Magnum 10, and the depth-and-speed sync handshake to Humminbird and Lowrance fish-finder networks. The Magnum line is what most of our customers actually fish day-to-day: dependable motor, simpler interface than the Optimum, the right balance of feature and price for serious recreational trollers.</p><p>The TS variant adds the integration that turns a manual depth-set workflow into a marked-depth auto-deploy. Mark a fish on the finder at sixty feet, the rigger drops the bait to sixty feet automatically. Speed sync keeps the bait in the strike zone when wind or current shifts your trolling speed. Same in-house install as the Optimum line.</p>',
            'how'          => [
                ['icon' => 'bolt',               'title' => 'Workhorse motor',            'description' => 'Standard Cannon electric motor sized for the 10-pound-class spool. Day-in day-out reliable.'],
                ['icon' => 'cable',              'title' => 'Fish-finder sync (TS)',      'description' => 'Humminbird and Lowrance handshake. Marked-depth auto-deploy and speed compensation.'],
                ['icon' => 'speed',              'title' => 'Faster retrieval',           'description' => 'Faster spool speed than the standard Magnum 10. Less wait between sets.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Electric, workhorse'],
                ['label' => 'Sync',        'value' => 'TS (Humminbird, Lowrance)'],
                ['label' => 'Spool class', 'value' => '10 lb-class'],
                ['label' => 'Best for',    'value' => 'Serious recreational trollers'],
            ],
        ],

        [
            'slug'         => 'cannon-magnum-10-downrigger',
            'product_id'   => 263,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Magnum 10 Downrigger',
            'tagline'      => 'Same Magnum workhorse electric without the TS sync. The most-rigged Cannon in our shop on the recreational-trolling side.',
            'why'          => '<p>The Magnum 10 (non-TS) is the most-rigged Cannon downrigger we sell on the recreational-trolling side. Standard Cannon electric motor, 10-pound-class spool, programmable depth and auto-stop. No fish-finder sync (that is the TS variant), but the standalone interface is straightforward and the price sits below the TS unit.</p><p>This is the rigger for the customer who fishes Lake Superior salmon and lake trout regularly without needing the integrated-finder workflow. Pair two Magnum 10 units off the gunwales for a clean four-rod spread (using a Uni-Stacker on each cable), or run a single off the transom on a smaller boat. Lee handles the install either way.</p>',
            'how'          => [
                ['icon' => 'bolt',               'title' => 'Workhorse motor',            'description' => 'Standard Cannon electric motor in the 10-pound-class spool. Day-in day-out reliable.'],
                ['icon' => 'tune',               'title' => 'Standalone interface',       'description' => 'Programmable depth, auto-stop. No fish-finder sync, no learning curve.'],
                ['icon' => 'savings',            'title' => 'Price under TS',             'description' => 'Same Magnum 10 platform without the integration premium.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Electric, workhorse'],
                ['label' => 'Sync',        'value' => 'No (standalone)'],
                ['label' => 'Spool class', 'value' => '10 lb-class'],
                ['label' => 'Best for',    'value' => 'Most recreational trollers'],
            ],
        ],

        [
            'slug'         => 'cannon-magnum-5-downrigger',
            'product_id'   => 264,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Magnum 5 Downrigger',
            'tagline'      => 'Smaller-class Magnum electric. Same motor architecture, 5-pound-class spool, sized for smaller boats and lighter weight loadouts.',
            'why'          => '<p>The Magnum 5 is the smaller-class Magnum. Same Cannon electric motor architecture as the Magnum 10, paired with a 5-pound-class spool sized for lighter weight loadouts. Right unit for smaller boats where the 10-class spool is too much rigger, for inland-lake trolling where you are running 4 to 6 lb weights on shallower depths, or for the customer who wants a Magnum-class motor without the larger footprint.</p><p>Same standalone interface (no TS sync at this spool class), same in-house install pattern, same warranty support. Lee will help you decide between this and the Uni-Troll 5 if you are weighing electric versus manual on a smaller boat.</p>',
            'how'          => [
                ['icon' => 'bolt',               'title' => 'Magnum motor, smaller spool', 'description' => 'Same Cannon electric architecture sized down for the 5-pound-class spool.'],
                ['icon' => 'directions_boat',    'title' => 'Smaller-boat fit',           'description' => 'Right size for inland-lake trolling and boats where the 10-class is overkill.'],
                ['icon' => 'engineering',        'title' => 'Same install discipline',    'description' => 'Lee handles the gunwale or transom mount and the wiring. Same standard as the 10-class.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Electric, smaller-class'],
                ['label' => 'Sync',        'value' => 'No (standalone)'],
                ['label' => 'Spool class', 'value' => '5 lb-class'],
                ['label' => 'Best for',    'value' => 'Smaller boats, inland lakes'],
            ],
        ],

        // CLUSTER 3: UNI-TROLL MANUAL PRECISION (3 entries)

        [
            'slug'         => 'cannon-uni-troll-10-ts-downrigger',
            'product_id'   => 265,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Uni-Troll 10 TS Downrigger',
            'tagline'      => 'TS = Tournament Series. Manual Cannon with depth counter and the integration prep for fish-finder pairing. Tournament-spec manual.',
            'why'          => '<p>The Uni-Troll 10 TS is the manual Cannon for the customer who wants Cannon precision without the electric motor overhead. Hand-crank retrieval on the 10-pound-class spool, mechanical depth counter, the smoothest manual clutch in the Cannon lineup. The TS designation here means the unit is prepped for the integration accessory pack: when the fish-finder integration matters but the boat does not warrant the electric step.</p><p>Right call for serious recreational trollers on smaller boats, for trollers who prefer the mechanical-feel workflow, or for the back-up rigger on a boat that runs a Magnum off the other gunwale. Same in-house install: Lee mounts the bracket, the rigging is otherwise straightforward (no breaker, no wiring run, no battery draw).</p>',
            'how'          => [
                ['icon' => 'handyman',           'title' => 'Manual hand-crank',          'description' => 'No motor, no battery draw. Mechanical clutch, smoothest manual feel in the Cannon lineup.'],
                ['icon' => 'straighten',         'title' => 'Mechanical depth counter',   'description' => 'Counter-on-the-spool depth read. No electronics, no calibration drift.'],
                ['icon' => 'cable',              'title' => 'Integration-prepped',        'description' => 'TS designation prepares the unit for the fish-finder pairing accessory pack.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Manual, hand-crank'],
                ['label' => 'TS spec',     'value' => 'Yes (integration-prep)'],
                ['label' => 'Spool class', 'value' => '10 lb-class'],
                ['label' => 'Best for',    'value' => 'Manual trollers wanting TS prep'],
            ],
        ],

        [
            'slug'         => 'cannon-uni-troll-10-downrigger',
            'product_id'   => 266,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Uni-Troll 10 Downrigger',
            'tagline'      => 'Same Uni-Troll manual workhorse without the TS integration prep. The standard manual Cannon.',
            'why'          => '<p>The Uni-Troll 10 is the standard manual Cannon. Hand-crank retrieval on the 10-pound-class spool, mechanical depth counter, smooth clutch. Same architecture as the Uni-Troll 10 TS without the integration-prep accessory pack hooks.</p><p>This is the most-rigged manual Cannon in our shop. Right call for the troller who wants manual precision and does not need the integration prep, or for the back-up rigger on a multi-rigger setup. Lee mounts the bracket and confirms the gunwale geometry; otherwise straightforward install.</p>',
            'how'          => [
                ['icon' => 'handyman',           'title' => 'Manual hand-crank',          'description' => 'No motor, no battery draw. The standard manual Cannon platform.'],
                ['icon' => 'straighten',         'title' => 'Mechanical depth counter',   'description' => 'Counter-on-the-spool. Read depth at a glance without electronics.'],
                ['icon' => 'savings',            'title' => 'Price under TS',             'description' => 'Same Uni-Troll 10 platform without the integration-prep premium.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Manual, hand-crank'],
                ['label' => 'TS spec',     'value' => 'No (standard)'],
                ['label' => 'Spool class', 'value' => '10 lb-class'],
                ['label' => 'Best for',    'value' => 'Standard manual trollers'],
            ],
        ],

        [
            'slug'         => 'cannon-uni-troll-5-downrigger',
            'product_id'   => 267,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Uni-Troll 5 Downrigger',
            'tagline'      => 'Smaller-class Uni-Troll manual. 5-pound-class spool, sized for smaller boats and lighter weight loadouts.',
            'why'          => '<p>The Uni-Troll 5 is the smaller-class Uni-Troll. Hand-crank retrieval on the 5-pound-class spool, same mechanical depth counter and clutch architecture as the Uni-Troll 10, sized down for smaller boats and lighter weight loadouts. Right unit for inland-lake trolling, for back-up applications, or for a smaller boat where the 10-class is too much rigger.</p><p>Same install pattern: Lee mounts the bracket, no wiring or breaker work needed (manual unit). The Uni-Troll 5 versus Magnum 5 decision usually comes down to whether you want electric retrieval (Magnum) or are happy hand-cranking on a smaller spool (Uni-Troll). We talk through it on the floor.</p>',
            'how'          => [
                ['icon' => 'handyman',           'title' => 'Manual hand-crank',          'description' => 'No motor, no battery draw. Smaller-class spool sized for lighter loadouts.'],
                ['icon' => 'directions_boat',    'title' => 'Smaller-boat fit',           'description' => 'Right size for inland-lake trolling and back-up rigger applications.'],
                ['icon' => 'precision_manufacturing','title' => 'Cannon mechanical feel', 'description' => 'Same clutch and depth-counter precision as the 10-class Uni-Troll, smaller package.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Manual, hand-crank'],
                ['label' => 'TS spec',     'value' => 'No (standard)'],
                ['label' => 'Spool class', 'value' => '5 lb-class'],
                ['label' => 'Best for',    'value' => 'Smaller boats, inland lakes'],
            ],
        ],

        // CLUSTER 4: SMALLER-BOAT LANE (3 entries)

        [
            'slug'         => 'cannon-easi-troll-downrigger',
            'product_id'   => 268,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Easi-Troll Downrigger',
            'tagline'      => 'Entry-tier manual Cannon. Hand-crank, basic depth read, sized and priced for the customer trying downrigger trolling for the first time.',
            'why'          => '<p>The Easi-Troll is the entry-tier Cannon manual. Hand-crank retrieval, basic depth-counter read, simpler clutch than the Uni-Troll line. Right call for the customer who wants to try downrigger trolling without committing to the Uni-Troll price step, for a smaller boat where simple is better, or as a back-up rigger paired with an electric on the other side.</p><p>Same Cannon build quality at a lower price tier. Lee mounts the bracket and confirms gunwale geometry; otherwise straightforward. Easy to upgrade to a Uni-Troll later if your trolling pattern grows.</p>',
            'how'          => [
                ['icon' => 'handyman',           'title' => 'Hand-crank manual',          'description' => 'Simplest Cannon manual workflow. Hand-crank, basic clutch, basic depth counter.'],
                ['icon' => 'savings',            'title' => 'Entry-tier price',           'description' => 'Lowest-price Cannon. Right entry into the brand without committing to Uni-Troll.'],
                ['icon' => 'engineering',        'title' => 'Cannon build quality',       'description' => 'Built to the same standard as the rest of the lineup, simpler feature set.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Manual, entry-tier'],
                ['label' => 'Depth read',  'value' => 'Basic counter'],
                ['label' => 'Spool class', 'value' => 'Entry-class'],
                ['label' => 'Best for',    'value' => 'First-time trollers, back-up rigs'],
            ],
        ],

        [
            'slug'         => 'cannon-lake-troll-downrigger',
            'product_id'   => 269,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Lake-Troll Downrigger',
            'tagline'      => 'Inland-lake Cannon manual. Sized for smaller boats targeting lake trout and walleye on inland water.',
            'why'          => '<p>The Lake-Troll is the inland-lake-targeted Cannon. Hand-crank manual, scaled spool for the kind of trolling done on inland Algoma lakes (lake trout in 30 to 80 feet, walleye trolled deep in late summer, stocked salmon on smaller stocked lakes). Right tool for the boat that does not see Lake Superior depths and does not need the heavier-class Cannon spools.</p><p>Same Cannon mechanical feel as the rest of the manual lineup, sized to inland use. Lee handles the bracket mount on a smaller boat without difficulty.</p>',
            'how'          => [
                ['icon' => 'water',              'title' => 'Inland-lake spec',           'description' => 'Sized for inland Algoma lakes. Lake trout at 30 to 80 ft, walleye, stocked salmon.'],
                ['icon' => 'handyman',           'title' => 'Hand-crank manual',          'description' => 'Simple workflow on a smaller boat. No motor, no wiring, no battery draw.'],
                ['icon' => 'directions_boat',    'title' => 'Smaller-boat ready',         'description' => 'Mounts cleanly on a 14 to 16 ft inland fishing boat. Lee handles the bracket geometry.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Manual, inland-lake'],
                ['label' => 'Spool class', 'value' => 'Inland-class'],
                ['label' => 'Mount',       'value' => 'Gunwale or transom'],
                ['label' => 'Best for',    'value' => 'Inland Algoma lake trolling'],
            ],
        ],

        [
            'slug'         => 'cannon-mini-troll-downrigger',
            'product_id'   => 270,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Mini-Troll Downrigger',
            'tagline'      => 'Smallest Cannon. Compact manual rigger for tiny boats, canoes with mounting plates, and ultra-light back-up applications.',
            'why'          => '<p>The Mini-Troll is the smallest Cannon downrigger. Compact body, hand-crank manual, smallest spool in the lineup. Right tool for tiny boats (12 to 14 ft tinnies on back lakes), for canoes or pedal-drive kayaks with a Cannon mounting plate, or for ultra-light back-up applications on a bigger boat that runs a Magnum off the main gunwale.</p><p>Lowest weight, smallest footprint, simplest feature set. Cannon build quality at the smallest scale. We mount and confirm geometry on whatever boat you bring in.</p>',
            'how'          => [
                ['icon' => 'compress',           'title' => 'Smallest footprint',         'description' => 'Compact body, smallest spool. Mounts where bigger riggers will not fit.'],
                ['icon' => 'kayaking',           'title' => 'Tinny / canoe friendly',     'description' => 'Right scale for 12 to 14 ft boats and canoes with a Cannon mounting plate.'],
                ['icon' => 'handyman',           'title' => 'Hand-crank manual',          'description' => 'No motor, no wiring. Lightest Cannon in the lineup.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Manual, compact'],
                ['label' => 'Spool class', 'value' => 'Smallest-class'],
                ['label' => 'Mount',       'value' => 'Compact bracket'],
                ['label' => 'Best for',    'value' => 'Tinnies, canoes, back-up rigs'],
            ],
        ],

        // CLUSTER 5: CANNONBALL WEIGHTS (4 entries)

        [
            'slug'         => 'cannon-cannonball-weight-4-lb',
            'product_id'   => 271,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Cannonball Weight (4 lb)',
            'tagline'      => 'Lightest Cannonball. Right for shallow trolling, smaller boats, and anglers easier on their backs.',
            'why'          => '<p>The 4 lb Cannonball is the lightest weight in the Cannon lineup. Right call for shallow trolling on inland lakes, for trolling at faster speeds where the bait needs to ride higher in the water column, for smaller boats and smaller-class riggers, and for anglers who want to be easy on their backs at the launch.</p><p>Cannonballs are dropped lead castings shaped to track straight behind the cable without spinning or oscillating. The 4 lb is the entry weight in the family. Stocked year-round at the parts counter alongside the rest of the size ladder.</p>',
            'how'          => [
                ['icon' => 'water',              'title' => 'Shallow-troll weight',       'description' => 'Right for shallow inland trolling and faster troll speeds where the bait rides higher.'],
                ['icon' => 'savings',            'title' => 'Lightest in the family',     'description' => 'Easiest on the back at the launch. Right for smaller boats and lighter riggers.'],
                ['icon' => 'inventory',          'title' => 'In stock year-round',        'description' => 'Lynn and Ron carry all four Cannonball sizes at the parts counter year-round.'],
            ],
            'what'         => [
                ['label' => 'Weight',      'value' => '4 lb'],
                ['label' => 'Shape',       'value' => 'Cannonball (drop)'],
                ['label' => 'Tracks',      'value' => 'Straight, no spin'],
                ['label' => 'Best for',    'value' => 'Shallow trolling, smaller boats'],
            ],
        ],

        [
            'slug'         => 'cannon-cannonball-weight-6-lb',
            'product_id'   => 272,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Cannonball Weight (6 lb)',
            'tagline'      => 'Mid-weight Cannonball. Mainstream choice for inland-lake trolling and shallower Lake Superior runs.',
            'why'          => '<p>The 6 lb Cannonball is the mid-weight in the family. Right call for inland-lake trolling at moderate depth, for shallower Lake Superior runs (40 to 60 ft on coho or summer lake trout in calmer water), and for the angler who wants more bite in the water than the 4 lb without stepping all the way up to the 8 lb workhorse.</p><p>Same drop-cast shape, tracks straight behind the cable. Stocked alongside the rest of the size ladder at the parts counter.</p>',
            'how'          => [
                ['icon' => 'water',              'title' => 'Mid-depth weight',           'description' => 'Right for inland-lake trolling and shallower Lake Superior runs in calmer water.'],
                ['icon' => 'tune',               'title' => 'Step up from 4 lb',          'description' => 'More bite in the water without going to the 8 lb workhorse weight class.'],
                ['icon' => 'inventory',          'title' => 'In stock year-round',        'description' => 'Carried alongside the 4 / 8 / 10 lb Cannonballs at the parts counter.'],
            ],
            'what'         => [
                ['label' => 'Weight',      'value' => '6 lb'],
                ['label' => 'Shape',       'value' => 'Cannonball (drop)'],
                ['label' => 'Tracks',      'value' => 'Straight, no spin'],
                ['label' => 'Best for',    'value' => 'Mid-depth inland and Superior'],
            ],
        ],

        [
            'slug'         => 'cannon-cannonball-weight-8-lb',
            'product_id'   => 273,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Cannonball Weight (8 lb)',
            'tagline'      => 'Workhorse Cannonball. Standard weight for most Lake Superior coho and summer lake-trout trolling.',
            'why'          => '<p>The 8 lb Cannonball is the workhorse weight for Lake Superior trolling. Right call for coho and lake trout in 40 to 100 ft of water, for the kind of mid-summer thermocline-running that defines our local fishing, and for any troller who wants the bait pinned to the depth program in light to moderate chop.</p><p>This is the weight most of our customers buy and the one Lynn and Ron move the most of at the parts counter. Stocked deep year-round.</p>',
            'how'          => [
                ['icon' => 'water',              'title' => 'Lake Superior workhorse',    'description' => 'Standard weight for coho and lake trout in 40 to 100 ft. The size most customers buy.'],
                ['icon' => 'shield',             'title' => 'Holds the depth program',    'description' => 'Pins the bait to the marked depth in light to moderate chop. The Cannon-program weight.'],
                ['icon' => 'inventory',          'title' => 'Stocked deep',               'description' => 'Most-moved Cannonball size at the parts counter. Always in stock.'],
            ],
            'what'         => [
                ['label' => 'Weight',      'value' => '8 lb'],
                ['label' => 'Shape',       'value' => 'Cannonball (drop)'],
                ['label' => 'Tracks',      'value' => 'Straight, no spin'],
                ['label' => 'Best for',    'value' => 'Lake Superior coho, lake trout'],
            ],
        ],

        [
            'slug'         => 'cannon-cannonball-weight-10-lb',
            'product_id'   => 274,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Cannonball Weight (10 lb)',
            'tagline'      => 'Heaviest Cannonball. Built for deep chinook running, heavy thermoclines, and trolling fast against current.',
            'why'          => '<p>The 10 lb Cannonball is the heaviest weight in the family. Right call for deep-running chinook on a heavy thermocline, for trolling fast against current where the lighter weights ride too high, and for any rigger setup that needs the extra bite in the water to hold a clean depth program in real chop.</p><p>This is the weight the serious Lake Superior chinook anglers run. Stocked at the parts counter alongside the rest of the size ladder.</p>',
            'how'          => [
                ['icon' => 'water',              'title' => 'Deep-troll weight',          'description' => 'For deep chinook, heavy thermoclines, and trolling fast against current.'],
                ['icon' => 'bolt',               'title' => 'Heaviest in the family',     'description' => 'Most bite in the water. Holds the depth program in serious chop.'],
                ['icon' => 'inventory',          'title' => 'In stock year-round',        'description' => 'Carried alongside the 4 / 6 / 8 lb Cannonballs at the parts counter.'],
            ],
            'what'         => [
                ['label' => 'Weight',      'value' => '10 lb'],
                ['label' => 'Shape',       'value' => 'Cannonball (drop)'],
                ['label' => 'Tracks',      'value' => 'Straight, no spin'],
                ['label' => 'Best for',    'value' => 'Deep chinook, fast troll'],
            ],
        ],

        // CLUSTER 6: ACCESSORY (1 entry)

        [
            'slug'         => 'cannon-uni-stacker-release',
            'product_id'   => 275,
            'thumbnail_id' => 0,
            'heading'      => 'Cannon Uni-Stacker Downrigger Release',
            'tagline'      => 'Stack a second bait on the same downrigger cable above the main release. Doubles your spread per rigger.',
            'why'          => '<p>The Uni-Stacker is the Cannon accessory release that lets you run a second bait on the same downrigger cable, above the main bottom release. The math: two Cannon Magnum 10 units off the gunwales with a Uni-Stacker on each cable gives you a clean four-rod spread without needing four downriggers. This is the standard recreational tournament setup on Lake Superior, and the right way to multiply your bait coverage without doubling your rigger count.</p><p>Mechanically simple, mounts to the cable above the main bottom release, takes any Cannon-compatible release clip. Lee includes the Uni-Stacker geometry in the rod-holder layout when we plan a multi-rigger spread.</p>',
            'how'          => [
                ['icon' => 'add_road',           'title' => 'Second bait per cable',      'description' => 'Stack a release above the main bottom clip. Doubles spread per rigger.'],
                ['icon' => 'group',              'title' => 'Two riggers, four rods',     'description' => 'Standard recreational tournament setup on Lake Superior. Two Magnums, two Uni-Stackers.'],
                ['icon' => 'engineering',        'title' => 'Planned in the layout',      'description' => 'Lee accounts for Uni-Stacker geometry when planning the rod-holder spread.'],
            ],
            'what'         => [
                ['label' => 'Type',        'value' => 'Stacker accessory'],
                ['label' => 'Mount',       'value' => 'On the cable'],
                ['label' => 'Compatible', 'value' => 'Cannon release clips'],
                ['label' => 'Best for',    'value' => 'Multi-rigger four-rod spreads'],
            ],
        ],
    ],

    'brand_band' => [
        'enabled'  => true,
        'brand'    => 'Cannon',
        'logo_id'  => 0,
        'tagline'  => 'Authorised Cannon dealer. Full Optimum, Magnum, Uni-Troll, smaller-boat lineup, plus Cannonball weights and Uni-Stacker accessories.',
        'body'     => '<p>Cannon has been building downriggers in the United States since 1968. Reyco is an authorised Cannon dealer in Sault Ste Marie, which means factory-direct pricing on the full lineup (Optimum TS, Optimum, Magnum 10 TS, Magnum 10, Magnum 5, Uni-Troll 10 TS, Uni-Troll 10, Uni-Troll 5, Easi-Troll, Lake-Troll, Mini-Troll), Cannonball weights in 4 / 6 / 8 / 10 lb, Uni-Stacker accessories, replacement cables and rod holders, and full manufacturer warranty handled in-house. We work with the full Cannon catalogue: if you need a specific dual-rigger setup or a particular weight loadout for chinook depths, we source direct with typical 1 to 3 week lead times.</p>',
    ],

    'comparison_table' => [
        'enabled' => true,
        'title'   => 'Pick the right Cannon for your boat and trolling target',
        'columns' => ['Model',          'Type',         'Spool class',     'Best for'],
        'rows'    => [
            ['Optimum TS',              'Electric flagship',     '10 lb-class',    'Tournament, GPS + finder sync'],
            ['Optimum',                 'Electric flagship',     '10 lb-class',    'Optimum buyers without TS need'],
            ['Magnum 10 TS',            'Electric workhorse',    '10 lb-class',    'Serious recreational trollers, finder sync'],
            ['Magnum 10',               'Electric workhorse',    '10 lb-class',    'Most-rigged recreational Cannon'],
            ['Magnum 5',                'Electric smaller-class','5 lb-class',     'Smaller boats, inland lakes'],
            ['Uni-Troll 10 TS',         'Manual',                '10 lb-class',    'Manual trollers wanting TS prep'],
            ['Uni-Troll 10',            'Manual',                '10 lb-class',    'Standard manual workhorse'],
            ['Uni-Troll 5',             'Manual smaller-class',  '5 lb-class',     'Smaller boats, manual feel'],
            ['Easi-Troll',              'Manual entry-tier',     'Entry-class',    'First-time trollers, back-up rigs'],
            ['Lake-Troll',              'Manual inland-lake',    'Inland-class',   'Inland Algoma lake trolling'],
            ['Mini-Troll',              'Manual compact',        'Smallest',       'Tinnies, canoes, back-up rigs'],
            ['Cannonball Weights',      'Accessory',             '4 / 6 / 8 / 10 lb', 'Sized to depth and target species'],
            ['Uni-Stacker',             'Stacker accessory',     'On cable',       'Multi-rigger four-rod spreads'],
        ],
    ],

    'faq' => [
        [
            'q' => 'Electric or manual downrigger, which is right for me?',
            'a' => 'If you fish multiple times a week, target deep species like chinook or summer lake trout regularly, or run more than two rods, electric is worth the investment. The Magnum 10 line covers most recreational trolling needs and the Optimum TS adds the fish-finder integration serious trollers want. Manual Uni-Troll units are the right call for occasional trollers, smaller boats, or anyone who prefers the simplicity. Bring us your trolling pattern and we will spec the right unit.',
        ],
        [
            'q' => 'How many downriggers do I need on my boat?',
            'a' => 'Two is the standard recreational setup: one off each gunwale, allowing a clean four-rod spread when you stack with a Cannon Uni-Stacker accessory. Single-rigger setups work for smaller boats or trollers focused on one species. Tournament-serious anglers sometimes run four. We will plan the rod-holder geometry based on your hull and how you fish.',
        ],
        [
            'q' => 'What weight should I run on Lake Superior?',
            'a' => 'For most Lake Superior trolling (coho and lake trout in 40 to 100 ft) the 8 lb Cannonball is the workhorse. For deep-running chinook on a heavy thermocline or for trolling fast against current, step up to 10 lb. The 4 and 6 lb weights are right for shallower trolling, smaller boats, or anglers who prefer to be easier on their backs. We stock all four sizes year-round.',
        ],
        [
            'q' => 'Will my Cannon Optimum or Magnum TS integrate with my fish finder?',
            'a' => 'Yes. The Optimum TS and Magnum TS units sync depth and speed with both Humminbird and Lowrance networks. We pair the downrigger to your finder during install and walk you through the menus before the boat leaves the shop. The integration covers Cannon\'s smartest features: auto-deploy at a marked depth, speed compensation against current, and integrated trolling-pattern control.',
        ],
        [
            'q' => 'Do you service Cannon downriggers I bought somewhere else?',
            'a' => 'Yes. As an authorised Cannon dealer, we service all Cannon downriggers regardless of where they were purchased. Bring it in or describe the issue and Lee will work through it on the marine bench. Common service items (cable replacement, motor service on electric units, clutch adjustment on manual Uni-Trolls) are all handled in-house.',
        ],
        [
            'q' => 'Do you carry Cannon weights and accessories in stock?',
            'a' => 'We keep Cannonball weights in 4, 6, 8, and 10 lb in stock year-round, along with common replacement cables, rod holders, and Uni-Stacker hardware for multi-bait spreads. For full downrigger units or specialty parts, we source direct from Cannon with typical 1 to 3 week lead times.',
        ],
    ],

    'cta' => [
        'enabled'   => true,
        'title'     => 'Ready to spec a Cannon for your boat?',
        'body'      => '<p>Drop in to see what is on the floor or call the shop and we will work through the model-and-loadout match before you commit. Lee handles the install once the rigger is in.</p>',
        'primary'   => ['label' => 'Visit the shop',                'href' => '/contact/'],
        'secondary' => ['label' => 'Pair with Princecraft hulls',    'href' => '/boats-and-marine/princecraft/'],
    ],
];
```

---

## QC checklist (pre-plumb)

**SKU verification:**
- [x] All 16 entries use real WC product_id values supplied by boss in dispatch (260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275). NO `id => 0` placeholders.
- [x] 11 downrigger entries + 4 Cannonball weight entries (one per SKU, not bundled) + 1 Uni-Stacker accessory = 16 total.

**Voice / format:**
- [x] No em-dashes (Unicode + 3 HTML entity variants) in PHP fence. Verified pre-commit.
- [x] No banned AI tells (delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y")
- [x] Canadian English (authorised, manoeuvre)
- [x] Reyco founded 2022 — present-tense framing only, no founding-year claims
- [x] No "Talk to Casey" CTAs
- [x] No inline Casey or Lee quotes (Casey-gate carried; both referenced in body as people who work the floor / bench)
- [x] Staff names match roster: Casey (sales floor), Aaron (Co-Owner / Service Manager), Lee (marine bench), Damian / Cody (techs), Lynn / Ron (parts). NO KORY anywhere.
- [x] 11-brand authorised list intact (Cannon + Humminbird sister-brand reference within bounds)
- [x] Cannon US-since-1968 heritage claim retained (factual, brand-history, not Reyco-history)

**Spec-cell length rule (banked PR #211):**
- [x] All `what` array spec values stay ~3-5 words max. Longest values: 'TS (Humminbird, Lowrance)' (3 words), 'Tournament, serious trollers' (3 words), 'Standalone interface' (2 words). Verbose flags (TS-vs-non-TS, electric-vs-manual lane choice, weight-rating warnings) lead-flagged in tagline + body, NEVER in spec cell.
- [x] Pattern: condition / lane / type / category indicators in spec cells. Reasoning and warnings in tagline / why / how.

**Cross-link integrity:**
- [x] Hero secondary CTA → `/contact/`
- [x] CTA secondary → `/boats-and-marine/princecraft/` (hull pairing for Cannon-on-Princecraft setups)
- [x] Subcategories anchors in-page (#optimum, #magnum, #uni-troll, #smaller-boat, #weights, #accessories)
- [ ] Humminbird and Lowrance sister-brand references in body prose (Optimum TS, Magnum 10 TS, Uni-Troll 10 TS entries) — currently inline references, not hyperlinks. Could become hyperlinks when Humminbird brand-page series-showcase migration runs. Flagged for follow-up content polish.
- [ ] Service-page references in intro / experts: could link to `/service/marine/` and `/service/winterization/` if those pages exist with current content. Flagged for plumb-side decision.

**Dev-side flags:**
- [ ] Page-template binding: `_wp_page_template = page-templates/series-showcase.php` on page id 1404 (per banked memory `project_reyco_wp_template_migration_pattern.md`). WP-CLI patch needed since setup-pages.php only fires on creation.
- [ ] `_catalogue_config` post-meta: confirm whether page 1404 has a post-meta override or uses file-based config exclusively.
- [ ] Material Symbols icon verification: most icons used (`bolt`, `gps_fixed`, `cable`, `engineering`, `tune`, `savings`, `speed`, `directions_boat`, `handyman`, `straighten`, `precision_manufacturing`, `water`, `shield`, `inventory`, `compress`, `kayaking`, `add_road`, `group`) are known-good from prior deliverables. The `add_road` icon is less common; if it does not render on the Uni-Stacker entry, fallback to `playlist_add` or `library_add`.
- [ ] Brand-band logo + per-entry thumbnail_id all 0 placeholders (WC product images may pull through automatically depending on theme behaviour, otherwise needs manual thumbnail_id set at plumb).

**Adapted source elements (from `brand-page-cannon.md`):**
- Hero subtitle: condensed, em-dash removed, tricolon removed
- Intro body: 3-paragraph source compressed to 2-paragraph series-showcase fit, em-dashes removed, internal links removed (will add at plumb if `/service/marine/`, `/service/winterization/` exist)
- Casey-and-Lee Cannon expert quote: NOT used (Casey-gate active, no inline quotes)
- Single-subcategory carousel from Format A: replaced with 6-anchor subcategories band per series-showcase pattern
- Why-choose 4 reasons: rolled into intro body + experts body where natural; full content in source if a follow-up content-polish pass reintroduces a "why choose" block
- Local-context 2-paragraph: rolled into intro body Lake Superior framing
- 6 FAQ entries: carried forward with em-dashes removed and minor tightening; same Q&A coverage as source

---

## Post-plumb / Aiden-side notes

1. **Page id 1404 stand-up:** before this config exists, `/boats-and-marine/downriggers/` falls back to default-empty. After plumb, page renders the 16-entry Cannon lineup with cluster anchors. Aiden's "totally broken" symptom resolves on plumb.

2. **Subcategories band has 6 anchors:** denser than Minn Kota expansion's recommended 5. Optimum and Magnum could collapse into a single "Electric" anchor if the band overflows on mobile. Easi/Lake/Mini-Troll could collapse into "Smaller-Boat Manual" if cluster 4 reads thin in render. Recommend keeping the 6 as drafted; revisit if mobile render shows overflow.

3. **TS vs non-TS spec-cell pattern:** every TS unit has `'Sync' => 'TS (Humminbird, Lowrance)'` and every non-TS unit has `'Sync' => 'No (standalone)'`. Customers scanning the spec strip can pick out the TS variant at a glance without reading body copy. This is the spec-cell rule applied correctly: short flag, distinction obvious.

4. **Cannonball-weight cluster:** 4 entries (one per SKU) preserves the variant-shopping UX (customer wants to see the 8 lb in stock alongside the 10 lb), but if boss prefers a single bundled "Cannonball Weight Family" entry with size selector, cluster 5 can be collapsed to 1 entry at plumb. NOT done in author-side draft; flagged for boss decision.

5. **Riptide / Minn Kota cross-link opportunity:** since Cannon downriggers pair with Minn Kota trolling motors on most fishing-boat setups, the CTA secondary could optionally point to `/boats-and-marine/minn-kota/` instead of (or alongside) Princecraft. NOT changed in this draft; flagged for follow-up.

6. **Kory grep on this deliverable:** ZERO references in PHP fence. Markdown commentary mentions of "Kory" exist in the rules section and QC checklist (about Kory ABSENCE), none render to user-facing surfaces.

7. **Em-dash audit:** ZERO em-dashes in PHP fence (verified pre-commit).

End of deliverable.
