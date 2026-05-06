# Minn Kota Expansion — 13 SKUs ADD to boats-marine--minn-kota.php

**Scope:** ADD 13 series_models entries to existing `boats-marine--minn-kota.php` config. NOT a full config replacement. The existing 4 entries (Terrova 80 lb id 207, Ultrex 80 lb 45-inch id 244, Ultrex QUEST 90/115 lb id 246, MK 460 PCL Charger id 257) stay as they are.

**Source dispatch:** boss msg 1778096291909-boss-hnuum (Aiden directive: "Yes I want the FULL coverage here, we can revert to the old template if needed"). Path chosen: preserve series-showcase template, full WC coverage via expansion. No template revert.

**Voice / format constraints (carried from original Minn Kota deliverable + Batches 1-5 + Princecraft):**
- Canadian English; plain language; NO em-dashes (Unicode + 3 HTML entity variants)
- Banned AI tells: delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y"
- Reyco founded 2022. Present-tense framing only.
- Casey owner-voice. NO "Talk to Casey" CTAs. NO inline Casey or Lee quotes (Casey-gate carried).
- Staff (post-2026-05-06 update, NO KORY): Casey (sales floor), Aaron (Co-Owner / Service Manager), Lee (marine bench, runs the rigging), Damian / Cody (techs), Lynn / Ron (parts)
- 11-brand authorised list intact

**SKU verification posture:** all 13 product_ids supplied directly by boss in dispatch (WC catalogue ground truth). NOT stock-flagged — every entry uses the real WC product_id, no `id => 0` placeholders.

**Cluster structure (5 buyer-journey groups):**
1. **Bow-mount freshwater addition** (1 entry) — Ultrex 80 lb 52-inch shaft variant (longer-shaft for deeper-V hulls or pontoons)
2. **Riptide saltwater bow-mounts** (4 entries) — Riptide Terrova QUEST 72/87/100-inch + Riptide Terrova 112 lb 87-inch
3. **Riptide refurb** (1 entry) — refurbished Riptide Terrova 80 lb 60-inch
4. **Kayak class** (2 entries) — Kayak Terrova 55 lb (freshwater) + Riptide Kayak Terrova 55 lb (saltwater)
5. **Battery chargers** (3 entries) — MK 230 PCL 2-bank, MK 330 PC 3-bank, MK 345 PCL 3-bank
6. **Accessories** (2 entries) — Remote Power Switch MKR-30, Battery Charger Extension Cable MK-EC-15

**Riptide framing note:** original Minn Kota config FAQ #6 says "Riptide not the right fit for Northern Ontario freshwater customers." That FAQ now contradicts the expanded lineup. Plumb-side decision flagged: either rewrite FAQ #6 to frame Riptide as the trailering-to-saltwater / Great Lakes long-range option, or remove FAQ #6 entirely. NOT modified in this ADD deliverable; flagged for boss / Aiden plumb pass.

**Approval gate:** Aiden review before plumb. Boss-side decision on FAQ #6 contradiction.

---

## ADD-TO: `wp-content/themes/reyco-marine/inc/category-configs/boats-marine--minn-kota.php`

Insert the 13 entries below into the existing `series_models` array. Suggested order: append after the 4 existing entries, grouped by cluster (Cluster 1 → 2 → 3 → 4 → 5 → 6). Subcategories band currently has 3 anchors (Bow-Mount / Transom-Mount / Chargers + Accessories). Plumb-side decision flagged on whether to add Riptide and Kayak labels to the band (see plumb notes below).

```php
<?php
/**
 * ADD-INSTRUCTION (not a full config replacement).
 *
 * The existing boats-marine--minn-kota.php config keeps its hero, intro, experts,
 * subcategories band, brand_band, comparison_table, faq, cta as they are.
 *
 * Insert the 13 entries below into the existing 'series_models' => [ ... ] array,
 * after the 4 existing entries (Terrova 80 lb id 207, Ultrex 80 lb 45-inch id 244,
 * Ultrex QUEST 90/115 lb id 246, MK 460 PCL Charger id 257).
 *
 * All 13 entries use real WC product_id values supplied by boss in dispatch
 * msg 1778096291909-boss-hnuum. No id => 0 placeholders.
 *
 * Cluster order (insertion sequence):
 *   1. Bow-mount freshwater addition (1 entry):        245
 *   2. Riptide saltwater bow-mounts (4 entries):       247, 248, 249, 250
 *   3. Riptide refurb (1 entry):                       251
 *   4. Kayak class (2 entries):                        252, 253
 *   5. Battery chargers (3 entries):                   254, 255, 256
 *   6. Accessories (2 entries):                        258, 259
 */

// CLUSTER 1: BOW-MOUNT FRESHWATER ADDITION
// ================================================

[
    'slug'         => 'minn-kota-ultrex-80-lb-52-inch-shaft',
    'product_id'   => 245,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Ultrex 80 lb (52-inch Shaft)',
    'tagline'      => 'Same Ultrex 80 lb tournament-class bow-mount, longer 52-inch shaft for deeper-V hulls and pontoons.',
    'why'          => '<p>The Ultrex 80 lb in the 52-inch shaft length is the deeper-shaft variant of the 45-inch Ultrex on the page above. Same cable-steer foot-pedal feel with Power Steering assist, same 80 lb of thrust on a 24V two-battery setup, same i-Pilot Link wireless control for GPS anchoring and trolling-pattern automation. The longer shaft is the answer for boats where the 45-inch will not keep the prop fully submerged in chop.</p><p>Where the 52-inch fits: deeper-V Princecraft hulls, larger pontoons, and any boat where the bow rides high enough that a shorter shaft cavitates when you push into a wave. Lee will measure your bow-deck-to-waterline at full load and confirm whether 45 or 52 is the right call. Same in-house rigging as the rest of the bow-mount lineup: bow plate, breaker and battery wiring, charger install, fish-finder pairing.</p>',
    'how'          => [
        ['icon' => 'straighten',         'title' => 'Longer 52-inch shaft',       'description' => 'Keeps the prop submerged on deeper-V hulls and higher-bow boats where 45 inches comes up short.'],
        ['icon' => 'tune',               'title' => 'Power-steering cable-steer', 'description' => 'Foot-pedal directness with assisted-steering effort. Same tournament feel as the 45-inch unit.'],
        ['icon' => 'engineering',        'title' => 'Lee measures, then rigs',    'description' => 'Bow-deck-to-waterline measure at the shop confirms 45 versus 52. We rig in-house either way.'],
    ],
    'what'         => [
        ['label' => 'Thrust',      'value' => '80 lb'],
        ['label' => 'Shaft',       'value' => '52 inches'],
        ['label' => 'Voltage',     'value' => '24V (two-battery setup)'],
        ['label' => 'Best for',    'value' => 'Deeper-V hulls, larger pontoons, higher-bow boats'],
    ],
],

// CLUSTER 2: RIPTIDE SALTWATER BOW-MOUNTS
// ================================================

[
    'slug'         => 'minn-kota-riptide-terrova-quest-90-115-lb-72-inch',
    'product_id'   => 247,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Riptide Terrova QUEST 90/115 lb (72-inch Shaft)',
    'tagline'      => 'Tournament-class bow-mount, salt-rated. Sealed magnesium lower unit, anti-corrosion build, 72-inch shaft.',
    'why'          => '<p>The Riptide line is Minn Kota`s saltwater build. Same Terrova QUEST architecture as the freshwater Ultrex QUEST on the page above (cable-steer with power-steering assist, Spot-Lock GPS anchoring, i-Pilot Link wireless), but with a sealed magnesium lower unit, salt-rated wiring harness, and anti-corrosion coatings on every metal surface that touches water. The 72-inch shaft is the entry length in the Riptide Terrova QUEST family.</p><p>Where this fits at Reyco: customers who trailer their boat to coastal water (Atlantic Canada, Gulf of Mexico winter trips), customers who fish the Great Lakes hard enough that brackish-influenced river mouths and long-distance Lake Superior runs justify the salt-rated build, and any owner who wants the longer-life metal protection regardless of water type. Same i-Pilot Link integration, same Humminbird sister-brand handshake, same Lee-rigged install at the shop.</p>',
    'how'          => [
        ['icon' => 'water',              'title' => 'Salt-rated build',           'description' => 'Sealed magnesium lower unit and anti-corrosion coatings on every wet metal surface. Built for the trailer-to-coast use case.'],
        ['icon' => 'gps_fixed',          'title' => 'Same i-Pilot Spot-Lock',     'description' => 'GPS anchoring, trolling-pattern automation, fish-finder pairing. Tournament brain, salt-rated chassis.'],
        ['icon' => 'engineering',        'title' => 'In-house rigging',           'description' => 'Lee handles bow plate, salt-rated wiring run, charger install, and Humminbird pairing in-shop.'],
    ],
    'what'         => [
        ['label' => 'Thrust',      'value' => '90/115 lb (selectable)'],
        ['label' => 'Shaft',       'value' => '72 inches'],
        ['label' => 'Voltage',     'value' => '36V (three-battery setup)'],
        ['label' => 'Build',       'value' => 'Salt-rated, sealed magnesium lower unit'],
    ],
],

[
    'slug'         => 'minn-kota-riptide-terrova-quest-90-115-lb-87-inch',
    'product_id'   => 248,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Riptide Terrova QUEST 90/115 lb (87-inch Shaft)',
    'tagline'      => 'Same salt-rated tournament bow-mount, longer 87-inch shaft for larger offshore-class hulls.',
    'why'          => '<p>The 87-inch shaft is the mid-length in the Riptide Terrova QUEST family. Same sealed magnesium lower unit, same anti-corrosion build, same i-Pilot Link wireless and Spot-Lock GPS as the 72-inch unit. The longer shaft is the answer for offshore-class hulls where the bow rides too high for a 72-inch to keep the prop submerged in real chop.</p><p>Customers stepping into this length tend to be running larger trailerable boats for coastal trips or doing serious Lake Superior offshore work. We measure the bow-deck-to-waterline at the shop and confirm whether 72 or 87 is the right call. Get the shaft length wrong and the prop cavitates in chop, which kills the motor`s ability to hold position when you need it most.</p>',
    'how'          => [
        ['icon' => 'straighten',         'title' => 'Longer 87-inch shaft',       'description' => 'Keeps the prop submerged on offshore-class hulls and high-bow trailerable boats.'],
        ['icon' => 'water',              'title' => 'Same Riptide salt build',    'description' => 'Sealed magnesium lower unit and anti-corrosion coatings. Same chassis as the 72-inch unit, longer reach.'],
        ['icon' => 'compare_arrows',     'title' => 'Lee sizes the shaft',        'description' => 'Bow-deck-to-waterline at full load. Wrong shaft cavitates in chop, which is why we measure first.'],
    ],
    'what'         => [
        ['label' => 'Thrust',      'value' => '90/115 lb (selectable)'],
        ['label' => 'Shaft',       'value' => '87 inches'],
        ['label' => 'Voltage',     'value' => '36V (three-battery setup)'],
        ['label' => 'Best for',    'value' => 'Offshore-class trailerable hulls, high-bow boats'],
    ],
],

[
    'slug'         => 'minn-kota-riptide-terrova-quest-90-115-lb-100-inch',
    'product_id'   => 249,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Riptide Terrova QUEST 90/115 lb (100-inch Shaft)',
    'tagline'      => 'The longest shaft in the Riptide Terrova QUEST family. Built for offshore center-consoles and pontoon-class freeboard.',
    'why'          => '<p>The 100-inch shaft is the top of the Riptide Terrova QUEST shaft ladder. This is the right length for offshore center-console hulls with serious bow freeboard, big pontoons that ride high above the waterline, and any boat where 87 inches still comes up short in real ocean chop or a Great Lakes blow. Same Riptide salt-rated chassis, same i-Pilot Link, same Spot-Lock GPS.</p><p>Customers who land on a 100-inch shaft are running boats in the 24+ foot offshore class or pontoons sized for serious passenger loads. The math is the same: measure bow-deck-to-waterline at full load, add the cushion for chop, pick the shaft that keeps the prop submerged in the worst water you actually fish. Lee handles the install once the shaft length is confirmed.</p>',
    'how'          => [
        ['icon' => 'straighten',         'title' => 'Longest 100-inch shaft',     'description' => 'For offshore center-consoles, big pontoons, and any boat where the bow rides high enough that 87 inches cavitates.'],
        ['icon' => 'water',              'title' => 'Same Riptide salt chassis',  'description' => 'Sealed magnesium lower unit, anti-corrosion coatings. Length added, build identical to 72 / 87 units.'],
        ['icon' => 'verified',           'title' => 'Tournament-tier brain',      'description' => 'i-Pilot Link wireless, Spot-Lock GPS anchoring, Humminbird sister-brand network handshake.'],
    ],
    'what'         => [
        ['label' => 'Thrust',      'value' => '90/115 lb (selectable)'],
        ['label' => 'Shaft',       'value' => '100 inches'],
        ['label' => 'Voltage',     'value' => '36V (three-battery setup)'],
        ['label' => 'Best for',    'value' => 'Offshore center-consoles 24+ ft, large pontoons, high-freeboard hulls'],
    ],
],

[
    'slug'         => 'minn-kota-riptide-terrova-112-lb-87-inch',
    'product_id'   => 250,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Riptide Terrova 112 lb (87-inch Shaft)',
    'tagline'      => 'Maximum-thrust salt-rated bow-mount. 112 lb of pull on a 36V setup, 87-inch shaft for offshore-class hulls.',
    'why'          => '<p>The 112 lb Riptide Terrova is the max-thrust unit in the Riptide bow-mount lineup. 112 pounds of pull on a 36V three-battery setup, 87-inch shaft, salt-rated build with sealed magnesium lower unit. This is the trolling motor for the bigger offshore boat or the heavy-loaded pontoon where the 90/115 selectable units feel underpowered against current and wind.</p><p>i-Pilot Link is included for GPS Spot-Lock anchoring and trolling-pattern work. The thrust ceiling matters most when you are fighting current at a structure or holding position in a stiff wind: the 112 lb gives you the headroom that the 90/115 lb units run out of on a heavy hull. Lee will work through the thrust math with you (rough rule: 2 lb of thrust per 100 lb of fully-loaded boat) before ordering.</p>',
    'how'          => [
        ['icon' => 'bolt',               'title' => 'Max-thrust salt-rated',      'description' => '112 lb of pull on a 36V setup. Headroom for current, wind, and heavy-loaded hulls.'],
        ['icon' => 'water',              'title' => 'Riptide salt build',         'description' => 'Sealed magnesium lower unit, anti-corrosion coatings. Trailer-to-coast and Great Lakes offshore.'],
        ['icon' => 'gps_fixed',          'title' => 'Same i-Pilot Spot-Lock',     'description' => 'GPS anchoring and trolling-pattern automation. Same brain as the 90/115 lb Riptide units.'],
    ],
    'what'         => [
        ['label' => 'Thrust',      'value' => '112 lb'],
        ['label' => 'Shaft',       'value' => '87 inches'],
        ['label' => 'Voltage',     'value' => '36V (three-battery setup)'],
        ['label' => 'Best for',    'value' => 'Offshore boats 24+ ft, heavy-loaded pontoons, high-current structure fishing'],
    ],
],

// CLUSTER 3: RIPTIDE REFURB
// ================================================

[
    'slug'         => 'minn-kota-riptide-terrova-80-lb-60-inch-refurb',
    'product_id'   => 251,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Riptide Terrova 80 lb (60-inch Shaft, Refurbished)',
    'tagline'      => 'REFURBISHED unit (not new). Factory-reconditioned Riptide Terrova at below-new pricing, manufacturer-warrantied. Same salt-rated build as the new units.',
    'why'          => '<p>This unit is factory-refurbished. It came back to Minn Kota, was inspected and reconditioned at the factory, and ships with a manufacturer warranty (shorter than the new-unit warranty, typically one year, confirm at purchase). Specs are 80 lb thrust, 60-inch shaft, salt-rated build with sealed magnesium lower unit. Pricing sits below the equivalent new unit, which makes it a smart entry into the Riptide line for the customer who wants salt-rated build without the new-unit price step.</p><p>Same i-Pilot Link compatibility, same Spot-Lock GPS, same Humminbird sister-brand handshake as the new Riptide units. We rig and install refurb units to the same standard as new ones: bow plate, salt-rated wiring run, charger install. The 60-inch shaft fits the mid-size boat or a smaller offshore hull where the 87 / 100-inch shafts are overkill. Buyer should know up front: this is the refurbished SKU, not the new SKU at the same thrust spec.</p>',
    'how'          => [
        ['icon' => 'verified',           'title' => 'Factory-refurbished',        'description' => 'Inspected and reconditioned at Minn Kota. Manufacturer warranty included.'],
        ['icon' => 'savings',            'title' => 'Below new-unit pricing',     'description' => 'Smart entry into the Riptide salt-rated line at a price step under the equivalent new unit.'],
        ['icon' => 'engineering',        'title' => 'Same in-house install',      'description' => 'Lee rigs refurb units to the same standard as new. Bow plate, wiring, charger, fish-finder pairing.'],
    ],
    'what'         => [
        ['label' => 'Condition',   'value' => 'REFURBISHED (factory-reconditioned, manufacturer-warrantied, NOT new)'],
        ['label' => 'Thrust',      'value' => '80 lb'],
        ['label' => 'Shaft',       'value' => '60 inches'],
        ['label' => 'Voltage',     'value' => '24V (two-battery setup)'],
        ['label' => 'Build',       'value' => 'Salt-rated, sealed magnesium lower unit'],
    ],
],

// CLUSTER 4: KAYAK CLASS
// ================================================

[
    'slug'         => 'minn-kota-kayak-terrova-55-lb-freshwater',
    'product_id'   => 252,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Kayak Terrova 55 lb (Freshwater)',
    'tagline'      => 'FRESHWATER kayak motor (NOT salt-rated). Bow-mount Terrova architecture scaled to the kayak class, 55 lb thrust on a 12V single-battery setup.',
    'why'          => '<p>The Kayak Terrova is exactly what it sounds like: the Terrova bow-mount architecture, scaled for the kayak class. 55 lb of thrust on a 12V single-battery setup, freshwater build, same Spot-Lock GPS anchoring brain as the full-size Terrova. Right unit for the serious kayak angler who wants hands-free position-holding while working a structure or a weed line, without trying to retrofit a full-size trolling motor onto a hull that cannot carry it.</p><p>i-Pilot wireless control is included so you can manage the motor from the cockpit. Mounting depends on the kayak (Hobie, Old Town, and most pedal-drive kayaks have factory or aftermarket Minn Kota mount kits available). Lynn and Ron at the parts counter can help spec the right mount kit for your kayak. We install at the shop if you bring the kayak in.</p>',
    'how'          => [
        ['icon' => 'kayaking',           'title' => 'Kayak-scaled platform',      'description' => 'Same Terrova architecture, sized for the kayak class. 55 lb thrust on a single 12V battery.'],
        ['icon' => 'gps_fixed',          'title' => 'Spot-Lock from the cockpit', 'description' => 'i-Pilot wireless lets you GPS-anchor on a structure without putting the paddle down.'],
        ['icon' => 'precision_manufacturing','title' => 'Mount-kit fitment',      'description' => 'Lynn and Ron spec the right mount kit for your kayak. We install at the shop.'],
    ],
    'what'         => [
        ['label' => 'Water type',  'value' => 'FRESHWATER ONLY (not salt-rated)'],
        ['label' => 'Thrust',      'value' => '55 lb'],
        ['label' => 'Voltage',     'value' => '12V (single battery)'],
        ['label' => 'Best for',    'value' => 'Serious kayak anglers fishing freshwater (lakes, rivers, inland)'],
    ],
],

[
    'slug'         => 'minn-kota-riptide-kayak-terrova-55-lb-saltwater',
    'product_id'   => 253,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Riptide Kayak Terrova 55 lb (Saltwater)',
    'tagline'      => 'SALTWATER kayak motor (Riptide salt-rated build). Same kayak-scaled Terrova as the freshwater unit, with sealed magnesium lower unit for trailer-to-coast use.',
    'why'          => '<p>The Riptide variant of the Kayak Terrova. Same 55 lb thrust on a 12V single-battery setup, same kayak-scaled platform, same Spot-Lock GPS brain, with the Riptide salt-rated build added. Sealed magnesium lower unit, anti-corrosion wiring harness, the same long-life metal protection as the full-size Riptide bow-mounts.</p><p>This is the right unit for kayak anglers who trailer to coastal water (Atlantic salt fishing, Gulf winter trips) and for anyone in the brackish-influenced river-mouth class who wants the longer-life Riptide build regardless of water type. We spec the mount kit to your kayak and install at the shop. Same warranty support as the full-size Riptide line.</p>',
    'how'          => [
        ['icon' => 'water',              'title' => 'Salt-rated kayak motor',     'description' => 'Sealed magnesium lower unit and anti-corrosion build. Same protection as the full-size Riptide line.'],
        ['icon' => 'kayaking',           'title' => 'Same kayak platform',        'description' => '55 lb thrust on a 12V single-battery setup. Hands-free Spot-Lock from the cockpit.'],
        ['icon' => 'precision_manufacturing','title' => 'Mount-kit fitment',      'description' => 'Lynn and Ron spec the right mount kit for your kayak. We install at the shop.'],
    ],
    'what'         => [
        ['label' => 'Water type',  'value' => 'SALTWATER (Riptide salt-rated, also fine in freshwater)'],
        ['label' => 'Thrust',      'value' => '55 lb'],
        ['label' => 'Voltage',     'value' => '12V (single battery)'],
        ['label' => 'Best for',    'value' => 'Trailer-to-coast kayak anglers, brackish river-mouth use'],
    ],
],

// CLUSTER 5: BATTERY CHARGERS
// ================================================

[
    'slug'         => 'minn-kota-mk-230-pcl-2-bank-15-amp',
    'product_id'   => 254,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota MK 230 PCL Charger (2-Bank x 15 Amp)',
    'tagline'      => 'Two-bank Precision charger, 15 amps per bank. The right charger for the 12V trolling-motor + cranking-battery setup.',
    'why'          => '<p>The MK 230 PCL is the two-bank Precision charger sized for the 12V trolling-motor setup (Endura, Kayak Terrova). 15 amps per bank means a real two-battery bank charges fast: trolling-motor battery on one circuit, cranking battery on the other, automatic charge profile per battery type, walk away. PCL means Precision Charger Lithium-compatible: AGM, lead-acid, AND lithium battery profiles, automatically detected.</p><p>Permanent on-board install. Hard-wire to the battery bank, mount the unit, plug into shore power at the dock or in the garage. Status LED on the front of the unit so you can read the charge state without taking the cover off. We install when we rig the trolling motor.</p>',
    'how'          => [
        ['icon' => 'battery_charging_full','title' => '2-bank x 15 amp',           'description' => 'Two banks, 15 amps each. Sized for the 12V trolling-motor + cranking-battery setup.'],
        ['icon' => 'battery_full',       'title' => 'PCL lithium-ready',          'description' => 'AGM, lead-acid, AND lithium profiles. Auto-detect, no profile-switch fiddling.'],
        ['icon' => 'engineering',        'title' => 'On-board hard-wired',        'description' => 'Permanent install, plug into shore power, status LED on the unit. We install when we rig the motor.'],
    ],
    'what'         => [
        ['label' => 'Banks',       'value' => '2'],
        ['label' => 'Amps / bank', 'value' => '15'],
        ['label' => 'Profiles',    'value' => 'AGM, lead-acid, lithium (auto-detect)'],
        ['label' => 'Best for',    'value' => '12V trolling-motor setups (Endura, Kayak Terrova)'],
    ],
],

[
    'slug'         => 'minn-kota-mk-330-pc-3-bank-10-amp',
    'product_id'   => 255,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota MK 330 PC Charger (3-Bank x 10 Amp)',
    'tagline'      => 'Three-bank Precision charger, 10 amps per bank. Sized for the 24V trolling-motor + cranking-battery setup.',
    'why'          => '<p>The MK 330 PC is the three-bank Precision charger sized for the 24V trolling-motor setup (Terrova 80 lb, Ulterra base, Riptide refurb). 10 amps per bank is the standard charge rate for a three-battery bank: two trolling-motor batteries plus the cranking battery, automatic charge profile per battery, walk away. The PC designation (Precision Charger, not the PCL Lithium variant) means AGM and lead-acid profiles, no lithium support, sized right for the customer running standard AGM or wet-cell batteries on a 24V Minn Kota.</p><p>Same on-board hard-wired install pattern as the rest of the Precision family. Mount in the boat, hard-wire to the bank, shore-power input. Lee installs when we rig the trolling motor.</p>',
    'how'          => [
        ['icon' => 'battery_charging_full','title' => '3-bank x 10 amp',           'description' => 'Three banks, 10 amps each. Two trolling-motor batteries plus cranking battery.'],
        ['icon' => 'battery_full',       'title' => 'AGM and lead-acid',          'description' => 'PC designation: AGM and lead-acid profiles. Step up to PCL family for lithium support.'],
        ['icon' => 'inventory',          'title' => 'Sized for 24V setups',       'description' => 'Right charger for Terrova 80 lb, Ulterra base, and the rest of the 24V Minn Kota family.'],
    ],
    'what'         => [
        ['label' => 'Banks',       'value' => '3'],
        ['label' => 'Amps / bank', 'value' => '10'],
        ['label' => 'Profiles',    'value' => 'AGM, lead-acid'],
        ['label' => 'Best for',    'value' => '24V trolling-motor setups (Terrova 80 lb, Ulterra base, Riptide refurb)'],
    ],
],

[
    'slug'         => 'minn-kota-mk-345-pcl-3-bank-15-amp',
    'product_id'   => 256,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota MK 345 PCL Charger (3-Bank x 15 Amp)',
    'tagline'      => 'Three-bank Precision charger, 15 amps per bank, lithium-ready. The faster-charging 24V option.',
    'why'          => '<p>The MK 345 PCL is the higher-amp three-bank charger. Same three-bank layout as the MK 330 PC (two trolling-motor batteries plus cranking battery on a 24V Minn Kota), but 15 amps per bank instead of 10, and PCL means lithium-compatible profiles in addition to AGM and lead-acid. Faster charge times matter most for the customer who runs back-to-back fishing days and cannot afford an overnight charge cycle, or for the customer running lithium batteries (where the higher amp ceiling actually gets used).</p><p>Same on-board permanent install. The PCL versus PC decision is two questions: do you need lithium support, and do you want faster charge cycles? If yes to either, MK 345 PCL is the call. If AGM and overnight charging is your normal pattern, the MK 330 PC saves money and does the same job.</p>',
    'how'          => [
        ['icon' => 'battery_charging_full','title' => '3-bank x 15 amp',           'description' => 'Higher amp ceiling than the MK 330. Faster charge cycles for back-to-back fishing days.'],
        ['icon' => 'battery_full',       'title' => 'PCL lithium-ready',          'description' => 'AGM, lead-acid, AND lithium profiles. Auto-detect, no profile-switch fiddling.'],
        ['icon' => 'compare_arrows',     'title' => 'PC versus PCL decision',     'description' => 'Need lithium or fast-charge? PCL. AGM with overnight charging? MK 330 PC saves money.'],
    ],
    'what'         => [
        ['label' => 'Banks',       'value' => '3'],
        ['label' => 'Amps / bank', 'value' => '15'],
        ['label' => 'Profiles',    'value' => 'AGM, lead-acid, lithium (auto-detect)'],
        ['label' => 'Best for',    'value' => '24V setups with lithium batteries or back-to-back fishing days'],
    ],
],

// CLUSTER 6: ACCESSORIES
// ================================================

[
    'slug'         => 'minn-kota-remote-power-switch-mkr-30',
    'product_id'   => 258,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Remote Power Switch (MKR-30)',
    'tagline'      => 'Battery-bank power switch wired into the helm. Cuts the trolling motor circuit without leaving the seat.',
    'why'          => '<p>The MKR-30 is the helm-mounted remote power switch for the trolling-motor battery bank. Wired into the main positive lead between the battery bank and the trolling motor, the switch lets you cut power to the trolling motor from the helm without going to the bow to disconnect. Useful when storing the boat between trips (battery isolation prevents parasitic drain), useful when transporting on the trailer (motor cannot accidentally power up), and required by some insurance policies for permanently-mounted bow units.</p><p>Lee installs when we rig the trolling motor. Wired right, the switch becomes part of the rigging discipline that decides whether your batteries last two seasons or eight. Wired wrong, it does nothing useful. We do not skip this kind of detail on a Reyco install.</p>',
    'how'          => [
        ['icon' => 'power',              'title' => 'Helm-mounted cut switch',    'description' => 'Wired into the main positive lead. Cuts trolling-motor power from the seat, no bow trip required.'],
        ['icon' => 'shield',             'title' => 'Insurance-friendly',         'description' => 'Some marine policies require a positive disconnect on permanently-mounted trolling motors.'],
        ['icon' => 'engineering',        'title' => 'Lee wires it correctly',     'description' => 'Wiring discipline matters. We install the switch as part of the rigging, not as an afterthought.'],
    ],
    'what'         => [
        ['label' => 'Type',        'value' => 'Remote power switch (helm-mounted)'],
        ['label' => 'Use',         'value' => 'Cuts trolling-motor circuit from helm'],
        ['label' => 'Install',     'value' => 'Wired into main positive lead, in-house at Reyco'],
        ['label' => 'Best for',    'value' => 'Permanent bow-mount trolling-motor installs, insurance-conscious owners'],
    ],
],

[
    'slug'         => 'minn-kota-battery-charger-extension-cable-mk-ec-15',
    'product_id'   => 259,
    'thumbnail_id' => 0,
    'heading'      => 'Minn Kota Battery Charger Extension Cable (MK-EC-15)',
    'tagline'      => 'Fifteen-foot extension cable for Minn Kota Precision on-board chargers. Reaches the shore-power inlet from any console.',
    'why'          => '<p>The MK-EC-15 is the official Minn Kota extension cable for the Precision on-board charger family. Fifteen feet of properly-rated cable, factory-terminated to mate cleanly with the Precision charger plug. Right tool when the on-board charger sits in the bow battery compartment but the shore-power inlet is on the transom, or any boat layout where the charger`s factory pigtail does not reach the inlet.</p><p>Buy the official extension. Off-brand or DIY-spliced cables are the most common cause of charger problems we see on the bench. Voltage drop on under-rated wire, water intrusion at a bad splice, plug compatibility issues. Lynn and Ron at the parts counter stock the MK-EC-15 alongside the chargers themselves.</p>',
    'how'          => [
        ['icon' => 'cable',              'title' => 'Factory-terminated',         'description' => 'Mates cleanly with the Precision charger plug. No splicing, no voltage-drop guesswork.'],
        ['icon' => 'straighten',         'title' => 'Fifteen feet of reach',      'description' => 'Bow battery compartment to transom shore-power inlet on most fishing-boat layouts.'],
        ['icon' => 'inventory',          'title' => 'In-stock at the parts counter','description' => 'Lynn and Ron carry the MK-EC-15 alongside the chargers. Pick one up when you buy the charger.'],
    ],
    'what'         => [
        ['label' => 'Length',      'value' => '15 feet'],
        ['label' => 'Use',         'value' => 'Extension for Precision on-board chargers'],
        ['label' => 'Spec',        'value' => 'Factory-terminated, properly-rated for charger amperage'],
        ['label' => 'Best for',    'value' => 'Bow-charger / transom-inlet boat layouts'],
    ],
],
```

---

## QC checklist (pre-plumb)

**Stock-flag posture (per banked SKU rule):**
- [x] All 13 entries use real WC product_id values (boss-supplied in dispatch). NO `id => 0` placeholders. NOT stock-flagged.
- [x] Body copy specs (thrust, shaft, voltage, bank-amps) match boss-supplied SKU labels. Verify against WC catalogue at plumb if any spec lookup mismatches.

**Voice / format:**
- [x] No em-dashes (Unicode + 3 HTML entity variants) in PHP fence. Verified pre-commit.
- [x] No banned AI tells (delve, unlock, leverage, elevate, journey, tapestry, world-class, industry-leading, robust, seamless, Moreover, Furthermore, Additionally, "not only X but also Y")
- [x] Canadian English (manoeuvre, organisation, etc.)
- [x] Reyco founded 2022 — present-tense framing only, no founding-year claims
- [x] No "Talk to Casey" CTAs
- [x] No inline Casey or Lee quotes (Casey-gate carried)
- [x] Staff names match roster: Casey (sales floor), Aaron (Co-Owner / Service Manager), Lee (marine bench), Damian / Cody (techs), Lynn / Ron (parts). NO KORY anywhere.
- [x] 11-brand authorised list intact (Minn Kota + Humminbird sister-brand reference within bounds)
- [x] All Riptide entries frame the saltwater build factually (sealed magnesium, anti-corrosion) — buyer journey for trailer-to-coast and Great Lakes long-range customers, not marketing puff

**Cross-link integrity:**
- [x] No new cross-links introduced (existing config carries hero, intro, experts, brand_band, comparison_table, FAQ, CTA cross-links).
- [ ] FAQ #6 contradiction with new Riptide entries (see plumb notes below)

## Plumb-side notes (boss / Aiden facing)

1. **FAQ #6 contradiction:** existing config has FAQ "What about saltwater? Do you carry Riptide?" with answer "Riptide is the Minn Kota saltwater line. We are a Northern Ontario freshwater dealer, so the Riptide is not the right fit..." That FAQ now contradicts 6 of the 13 new entries (Riptide Terrova QUEST 72/87/100, Riptide Terrova 112 lb, Riptide refurb, Riptide Kayak). **Recommend** rewriting the FAQ #6 answer to frame Riptide as the trailer-to-coast / Great Lakes long-range / brackish-river-mouth option, with a sentence on the build benefit (sealed magnesium, anti-corrosion) and Lee handling the rigging same as the freshwater units. Drop the "Northern Ontario freshwater dealer" framing on Riptide. NOT modified in this ADD deliverable; flagged for boss / Aiden plumb pass with a one-paragraph rewrite at plumb.

2. **Subcategories band update:** existing band has 3 anchors (`#bow-mount`, `#transom`, `#chargers`). The expansion adds Riptide saltwater entries (could share `#bow-mount` anchor or get a new `#riptide` anchor) and Kayak entries (new `#kayak` anchor recommended). **Recommend** updating the band to: `Bow-Mount Trolling Motors`, `Transom-Mount Trolling Motors`, `Riptide Saltwater`, `Kayak`, `Chargers + Accessories`. Five labels keeps the band readable and lets users jump to the cluster they care about.

3. **Comparison table update:** existing comparison_table covers 5 rows (Terrova 80, Ulterra, Ultrex QUEST CHIRP, Endura, Precision Chargers). With the expansion, the table becomes incomplete. **Recommend** adding Riptide row + Kayak row at minimum. NOT modified in this ADD deliverable; flagged for follow-up content polish if boss wants it for launch.

4. **Material Symbols icon verification:** new icons used in this deliverable that may need fallback verification: `straighten`, `water`, `kayaking`, `power`. If any do not render, fallbacks: `straighten` → `linear_scale`, `water` → `waves`, `kayaking` → `rowing`, `power` → `power_settings_new`. Existing icons (`gps_fixed`, `engineering`, `tune`, `compare_arrows`, `verified`, `bolt`, `savings`, `battery_charging_full`, `battery_full`, `inventory`, `precision_manufacturing`, `shield`, `cable`) all known-good from prior deliverables.

5. **Brand-band tagline currently says:** `Authorised Minn Kota dealer. Full bow-mount and transom-mount lineup, plus Precision chargers and parts.` After expansion this is incomplete (no mention of Riptide saltwater or Kayak class). **Optional polish** at plumb: rewrite to `Authorised Minn Kota dealer. Full freshwater and Riptide saltwater lineup, bow-mount and transom-mount, Kayak class, Precision chargers and accessories.`

6. **Brand-band body currently says** the lineup includes Terrova, Ulterra, Ultrex QUEST, Endura, Precision chargers. Same incompleteness. **Optional polish** at plumb to mention Riptide and Kayak families.

7. **Existing `cta` block secondary CTA:** points to `/boats-and-marine/princecraft/` (hull pairing). With the Riptide / Kayak / Charger expansion, the CTA could optionally cross-link to the kayak class page (if one exists) or the boat-rigging service page. NOT modified.

8. **Kory grep on this deliverable:** ZERO references in PHP fence. Markdown commentary mentions of "Kory" exist in the rules section and QC checklist (about Kory ABSENCE), none render to user-facing surfaces.

## Cluster summary

| Cluster | Entries | Product IDs | Sub-section recommendation |
|---------|---------|-------------|---------------------------|
| Bow-mount freshwater addition | 1 | 245 | Append to existing bow-mount cluster |
| Riptide saltwater bow-mounts | 4 | 247, 248, 249, 250 | NEW `#riptide` anchor recommended |
| Riptide refurb | 1 | 251 | Group with Riptide cluster |
| Kayak class | 2 | 252, 253 | NEW `#kayak` anchor recommended |
| Battery chargers | 3 | 254, 255, 256 | Group under existing `#chargers` |
| Accessories | 2 | 258, 259 | Group under existing `#chargers` (Chargers + Accessories) |
| **TOTAL** | **13** | | |

Combined with existing 4 entries (Terrova 80 lb 207, Ultrex 80 lb 45-inch 244, Ultrex QUEST 90/115 lb 246, MK 460 PCL Charger 257), the boats-marine--minn-kota.php config will hold **17 series_models entries** post-plumb.

End of deliverable.
