# Reyco Marine — Carousel & Template Taxonomy Inventory
**Date:** 2026-04-27  
**Author:** Dev Agent  
**Purpose:** Authoritative list of all `product_category` terms the active templates query. Aiden populates against this list. Every missing term = empty carousel.

---

## How the system works (30-second read)

Products are assigned to `product_category` taxonomy terms. Carousels query by exact slug via `WP_Query > tax_query`. A product can (and should) hold multiple category terms — it will appear in every carousel that references one of its assigned terms. The hierarchy below is organizational; it does NOT affect query behaviour. Carousels match on slug, nothing else.

---

## 1. Categories Needed

**Hierarchy notation:** `parent-page > child-page > carousel-slug`  
Each entry shows: **slug** | page/section that drives it | source file

---

### BOATS & MARINE

Parent page: `/boats-and-marine/`  
Config: `inc/category-configs/boats-marine.php`

**L2 — carousel tabs on `/boats-and-marine/` parent page**

| Slug | Heading | Source |
|---|---|---|
| `fishing-boats` | Fishing Boats | boats-marine.php + front-page.php |
| `pontoons` | Pontoons | boats-marine.php + front-page.php |
| `deck-boats` | Deck Boats | boats-marine.php + front-page.php |
| `boat-motors` | Boat Motors | boats-marine.php |
| `electronics` | Electronics & Accessories | boats-marine.php |
| `outboard-motors` | Outboard Motors | front-page.php (homepage Marine tab — uses this slug, not `boat-motors`) |
| `trolling-motors` | Trolling Motors | front-page.php + motors.php |
| `fish-finders` | Fish Finders | front-page.php + electronics.php |
| `mercury` | Mercury | motors.php |

> **Slug divergence note:** The parent page config uses `boat-motors`; the homepage tab uses `outboard-motors`. Both must exist with products assigned to both for all carousels to populate.

**L3 — Fishing Boats** (`/boats-and-marine/fishing-boats/`)  
Config: `boats-marine--fishing-boats.php`

| Slug | Description |
|---|---|
| `sport-fishing-boats` | Sport Fishing Boats carousel |
| `platinum-fishing-boats` | Platinum Fishing Boats carousel |
| `multi-species-boats` | Multi-Species Boats carousel |

**L3 — Pontoons** (`/boats-and-marine/pontoons/`)  
Config: `boats-marine--pontoons.php`

| Slug | Description |
|---|---|
| `pontoon-jazz` | Pontoon Jazz (Princecraft Jazz series) |
| `pontoon-vectra` | Pontoon Vectra |
| `pontoon-vogue` | Pontoon Vogue |

**L3 — Deck Boats** (`/boats-and-marine/deck-boats/`)  
Config: `boats-marine--deck-boats.php`

| Slug | Description |
|---|---|
| `ventura-deck-boats` | Princecraft Ventura deck boats |
| `sport-deck-boats` | Sport Deck Boats |

**L3 — Outboard Motors** (`/boats-and-marine/outboard-motors/`)  
Config: `boats-marine--outboard-motors.php`

| Slug | Description |
|---|---|
| `fourstroke-outboards` | Four-Stroke Outboards carousel |
| `verado-outboards` | Verado Outboards carousel |
| `portable-outboards` | Portable Outboards carousel |

**L3 — Mercury Brand Page** (`/boats-and-marine/mercury/`)  
Config: `boats-marine--mercury.php`

| Slug | Description |
|---|---|
| `mercury-fourstroke` | Mercury FourStroke carousel |
| `mercury-verado` | Mercury Verado carousel |
| `mercury-proxs` | Mercury Pro XS carousel |
| `mercury-portable` | Mercury Portable carousel |

> `fourstroke-outboards` vs `mercury-fourstroke`: These are two different pages/carousels. A Mercury FourStroke product should be assigned BOTH slugs so it appears in both.

**L3 — Trolling Motors** (`/boats-and-marine/trolling-motors/` or `/minnkota/`)  
Config: `boats-marine--trolling-motors.php`

| Slug | Description |
|---|---|
| `minnkota-terrova` | Minn Kota Terrova |
| `minnkota-ulterra` | Minn Kota Ulterra |
| `minnkota-endura` | Minn Kota Endura |

**L3 — Fish Finders** (`/boats-and-marine/fish-finders/`)  
Config: `boats-marine--fish-finders.php`

| Slug | Description |
|---|---|
| `entry-fish-finders` | Entry-level fish finders |
| `mid-range-fish-finders` | Mid-range fish finders |
| `premium-fish-finders` | Premium fish finders |
| `mega-live-sonar` | Mega Live Sonar (Humminbird) |

**L3 — Humminbird Brand Page** (`/boats-and-marine/humminbird/`)  
Config: `boats-marine--humminbird.php`

| Slug | Description |
|---|---|
| `helix-series` | HELIX Series |
| `apex-series` | APEX Series |
| `mega-live-2` | MEGA Live 2.0 |
| `ice-electronics` | Ice Electronics |

**L3 — Princecraft Brand Page** (`/boats-and-marine/princecraft/`)  
Config: `boats-marine--princecraft.php`

| Slug | Description |
|---|---|
| `princecraft-sport` | Princecraft Sport series |
| `princecraft-platinum` | Princecraft Platinum series |
| `princecraft-pontoons` | Princecraft Pontoons |
| `princecraft-ventura` | Princecraft Ventura |

**Electronics standalone page** (`/electronics/`)  
Config: `electronics.php`

| Slug | Description |
|---|---|
| `mega-live` | Mega Live (standalone electronics page carousel) |
| `gps-chartplotters` | GPS / Chartplotters |

**Motors standalone page** (`/motors/`)  
Config: `motors.php`

| Slug | Description |
|---|---|
| `repowers` | Repowers / engine replacements |

---

### LAWN & GARDEN

Parent page: `/lawn-and-garden/`  
Config: `inc/category-configs/lawn-garden.php`

**L2 — carousel tabs on `/lawn-and-garden/` parent page + homepage**

| Slug | Heading | Source |
|---|---|---|
| `riding-mowers` | Riding Mowers | lawn-garden.php + front-page.php |
| `zero-turn` | Zero-Turn Mowers | lawn-garden.php |
| `zero-turn-mowers` | Zero-Turn (homepage tab slug) | front-page.php — **different slug from `zero-turn`; both must exist** |
| `push-mowers` | Push Mowers | lawn-garden.php + front-page.php |
| `trimmers-chainsaws` | Trimmers & Chainsaws | lawn-garden.php |
| `chainsaws` | Chainsaws | front-page.php + echo page |
| `trimmers` | Trimmers | front-page.php + echo page |

**L3 — Riding Mowers** (`/lawn-and-garden/riding-mowers/`)  
Config: `lawn-garden--riding-mowers.php`

| Slug | Description |
|---|---|
| `cub-cadet-xt1` | Cub Cadet XT1 series |
| `cub-cadet-xt2` | Cub Cadet XT2 series |
| `toro-riding-mowers` | Toro Riding Mowers |
| `riding-mower-accessories` | Riding Mower Accessories |

**L3 — Zero-Turn** (`/lawn-and-garden/zero-turn/`)  
Config: `lawn-garden--zero-turn.php`

| Slug | Description |
|---|---|
| `cub-cadet-ultima` | Cub Cadet Ultima ZT |
| `toro-timecutter` | Toro TimeCutter |
| `toro-titan` | Toro Titan |
| `commercial-zero-turn` | Commercial Zero-Turn |

**L3 — Push Mowers** (`/lawn-and-garden/push-mowers/`)  
Config: `lawn-garden--push-mowers.php`

| Slug | Description |
|---|---|
| `toro-recycler` | Toro Recycler |
| `toro-super-recycler` | Toro Super Recycler |
| `cub-cadet-push-mowers` | Cub Cadet Push Mowers |
| `manual-push-mowers` | Manual Push Mowers |

**L3 — Chainsaws** (`/lawn-and-garden/chainsaws/`)  
Config: `lawn-garden--chainsaws.php`

| Slug | Description |
|---|---|
| `homeowner-chainsaws` | Homeowner Chainsaws |
| `farm-ranch-chainsaws` | Farm & Ranch Chainsaws |
| `professional-chainsaws` | Professional Chainsaws |
| `chainsaw-accessories` | Chainsaw Accessories |

**L3 — Trimmers** (`/lawn-and-garden/trimmers/`)  
Config: `lawn-garden--trimmers.php`

| Slug | Description |
|---|---|
| `stihl-trimmers` | STIHL Trimmers (note: Phase A.5 removed STIHL from authorized dealer copy; this term still exists in config) |
| `cub-cadet-toro-trimmers` | Cub Cadet / Toro Trimmers |
| `brushcutters` | Brushcutters |
| `trimmer-pas` | Trimmer PAS |
| `trimmer-accessories` | Trimmer Accessories |

**L3 — Cub Cadet Brand Page** (`/lawn-and-garden/cub-cadet/`)  
Config: `lawn-garden--cub-cadet.php`

| Slug | Description |
|---|---|
| `cub-cadet-riding-mowers` | Cub Cadet Riding Mowers carousel |
| `cub-cadet-zero-turn` | Cub Cadet Zero-Turn carousel |
| `cub-cadet-push-mowers` | Cub Cadet Push Mowers (shared with push-mowers page) |
| `cub-cadet-accessories` | Cub Cadet Accessories |

**L3 — Toro Brand Page** (`/lawn-and-garden/toro/`)  
Config: `lawn-garden--toro.php`

| Slug | Description |
|---|---|
| `toro-zero-turn` | Toro Zero-Turn |
| `toro-push-mowers` | Toro Push Mowers |
| `toro-commercial` | Toro Commercial |

*(toro-riding-mowers is shared with riding-mowers page)*

**L3 — Echo Brand Page** (`/lawn-and-garden/echo/`)  
Config: `lawn-garden--echo.php`

| Slug | Description |
|---|---|
| `blowers` | Blowers |
| `hedge-trimmers` | Hedge Trimmers |
| `pressure-washers` | Pressure Washers |
| `power-pruners` | Power Pruners |
| `cordless-56v` | Cordless 56V system |
| `pro-attachment-series` | Pro Attachment Series (PAS) |
| `cut-off-saws` | Cut-Off Saws |

*(chainsaws and trimmers shared with other pages)*

**L3 — Blowers** (`/lawn-and-garden/blowers/` — sub-page)  
Config: `lawn-garden--blowers.php`

| Slug | Description |
|---|---|
| `handheld-blowers` | Handheld Blowers |
| `mid-backpack-blowers` | Mid-Tier Backpack Blowers |
| `pro-backpack-blowers` | Pro Backpack Blowers |
| `low-noise-blowers` | Low-Noise Blowers |
| `cordless-blowers` | Cordless Blowers (shared with Cordless 56V page) |

**L3 — Hedge Trimmers**  
Config: `lawn-garden--hedge-trimmers.php`

| Slug | Description |
|---|---|
| `standard-hedge-trimmers` | Standard Hedge Trimmers |
| `extended-reach-hedge-trimmers` | Extended-Reach Hedge Trimmers |
| `articulating-hedge-trimmers` | Articulating Hedge Trimmers |
| `cordless-hedge-trimmers` | Cordless Hedge Trimmers (shared with Cordless 56V) |

**L3 — Pressure Washers**  
Config: `lawn-garden--pressure-washers.php`

| Slug | Description |
|---|---|
| `electric-pressure-washers` | Electric Pressure Washers |
| `mid-gas-pressure-washers` | Mid-Tier Gas Pressure Washers |
| `higher-gas-pressure-washers` | Higher-Tier Gas Pressure Washers |
| `pro-pressure-washers` | Pro-Grade Pressure Washers |

**L3 — Power Pruners**  
Config: `lawn-garden--power-pruners.php`

| Slug | Description |
|---|---|
| `pas-pruner-attachment` | PAS Pruner Attachment |

**L3 — Edgers**  
Config: `lawn-garden--edgers.php`

| Slug | Description |
|---|---|
| `walk-behind-edgers` | Walk-Behind Edgers |
| `pas-edger-attachment` | PAS Edger Attachment |

**L3 — Cordless 56V Platform** (`/lawn-and-garden/cordless-56v/`)  
Config: `lawn-garden--cordless-56v.php`

| Slug | Description |
|---|---|
| `cordless-chainsaws` | Cordless Chainsaws |
| `cordless-trimmers` | Cordless Trimmers |
| `cordless-mowers` | Cordless Mowers |
| `cordless-pas` | Cordless PAS (Power Attachment Series) |
| `56v-batteries` | 56V Batteries & Chargers |

*(cordless-blowers and cordless-hedge-trimmers shared with blowers/hedge-trimmer pages)*

**L3 — Cordless sub-model pages** (Echo 56V model-level carousels)

| Slug | Description | Config |
|---|---|---|
| `dpb-2500` | DPB-2500 blower model | lawn-garden--cordless-blowers.php |
| `dpb-2500-le` | DPB-2500 LE (Pink Limited Edition) | lawn-garden--cordless-blowers.php |
| `dlm-2100` | DLM-2100 mower model | lawn-garden--cordless-mowers.php |
| `dlm-2100sp` | DLM-2100SP (self-propelled) | lawn-garden--cordless-mowers.php |
| `dcs-5000` | DCS-5000 chainsaw model | lawn-garden--cordless-chainsaws.php |
| `dcs-2500t` | DCS-2500T (top-handle) | lawn-garden--cordless-chainsaws.php |
| `dsrm-2100` | DSRM-2100 trimmer model | lawn-garden--cordless-trimmers.php |
| `dsrm-2600` | DSRM-2600 trimmer | lawn-garden--cordless-trimmers.php |
| `dsrm-2600u` | DSRM-2600U (U-handle) | lawn-garden--cordless-trimmers.php |

**L3 — Troy-Bilt Brand Page** (`/lawn-and-garden/troy-bilt/`)  
Config: `lawn-garden--troy-bilt.php`

> Note: Phase A.5 removed unauthorized dealer copy for Troy-Bilt. Config file still exists. Include these terms if Troy-Bilt products are being seeded; omit if Troy-Bilt is being removed from the catalog.

| Slug | Description |
|---|---|
| `troy-bilt-riding-mowers` | Troy-Bilt Riding Mowers |
| `troy-bilt-zero-turn` | Troy-Bilt Zero-Turn |
| `troy-bilt-push-mowers` | Troy-Bilt Push Mowers |
| `troy-bilt-tillers` | Troy-Bilt Tillers |

---

### SNOW EQUIPMENT

Parent page: `/snow-equipment/`  
Config: `inc/category-configs/snow-equipment.php`

**L2 — carousel tabs on parent page + homepage**

| Slug | Heading | Source |
|---|---|---|
| `two-stage` | Two-Stage Snowblowers | snow-equipment.php |
| `two-stage-snowblowers` | Two-Stage (homepage tab) | front-page.php — **different slug; both must exist** |
| `three-stage` | Three-Stage Snowblowers | snow-equipment.php |
| `three-stage-snowblowers` | Three-Stage (homepage tab) | front-page.php — **different slug; both must exist** |
| `single-stage` | Single-Stage Snowblowers | snow-equipment.php |
| `single-stage-snowblowers` | Single-Stage (homepage tab) | front-page.php — **different slug; both must exist** |
| `snow-plows` | Snow Plows | front-page.php |

**L3 — Two-Stage** (`/snow-equipment/two-stage/`)  
Config: `snow-equipment--two-stage.php`

| Slug | Description |
|---|---|
| `24-inch-snowblowers` | 24-inch Two-Stage models |
| `26-inch-snowblowers` | 26-inch Two-Stage models |
| `28-inch-snowblowers` | 28-inch Two-Stage models |
| `two-stage-accessories` | Two-Stage Accessories |

**L3 — Three-Stage** (`/snow-equipment/three-stage/`)  
Config: `snow-equipment--three-stage.php`

| Slug | Description |
|---|---|
| `cub-cadet-3x-26` | Cub Cadet 3X 26" |
| `cub-cadet-3x-28` | Cub Cadet 3X 28" |
| `cub-cadet-3x-30` | Cub Cadet 3X 30" |
| `cub-cadet-3x-track` | Cub Cadet 3X Track Drive |

**L3 — Single-Stage** (`/snow-equipment/single-stage/`)  
Config: `snow-equipment--single-stage.php`

| Slug | Description |
|---|---|
| `toro-power-clear` | Toro Power Clear (single-stage) |
| `electric-snowblowers` | Electric Snowblowers |
| `single-stage-accessories` | Single-Stage Accessories |

**L3 — Snow Plows** (`/snow-equipment/snow-plows/`)  
Config: `snow-equipment--snow-plows.php`

| Slug | Description |
|---|---|
| `atv-plows` | ATV Plows |
| `utv-plows` | UTV Plows |
| `bercomac` | Bercomac (snow plow brand) |
| `plow-accessories` | Plow Accessories |

**L3 — Cub Cadet Snow Brand Page**  
Config: `snow-equipment--cub-cadet.php`

| Slug | Description |
|---|---|
| `cub-cadet-two-stage` | Cub Cadet Two-Stage models |
| `cub-cadet-track-drive` | Cub Cadet Track Drive |
| `cub-cadet-snow-accessories` | Cub Cadet Snow Accessories |

*(cub-cadet-3x-26/28/30/track shared with three-stage page)*

**L3 — Toro Snow Brand Page**  
Config: `snow-equipment--toro.php`

| Slug | Description |
|---|---|
| `toro-power-max` | Toro Power Max |
| `toro-power-max-hd` | Toro Power Max HD |
| `toro-snow-accessories` | Toro Snow Accessories |

*(toro-power-clear shared with single-stage page)*

---

### POWERSPORTS

Parent page: `/powersports/`  
Config: `inc/category-configs/powersports.php`

**L2 — carousel tabs on `/powersports/` parent page**

| Slug | Heading |
|---|---|
| `sport-utvs` | Sport UTVs |
| `utility-utvs` | Utility UTVs |
| `crew-utvs` | Crew & 4-Seat UTVs |
| `youth-utvs` | Youth UTVs |
| `atvs` | ATVs |
| `electric-powersports` | Electric UTVs & Golf Carts |

**L3 — Hisun Brand Page** (`/powersports/hisun/`)  
Config: `powersports--hisun.php`

| Slug | Description |
|---|---|
| `strike-series` | Hisun Strike series |
| `stryker-series` | Hisun Stryker series |
| `sector-series` | Hisun Sector series |
| `mp9-series` | Hisun MP9 series |
| `hs-series` | Hisun HS series |
| `cub-cadet-utv` | Cub Cadet UTV (shared) |

*(atvs and electric-powersports are shared with parent page)*

**L3 — Strike Series** (`/powersports/hisun/strike/`)  
Config: `powersports--strike.php`

| Slug | Description |
|---|---|
| `strike-250r` | Hisun Strike 250R |
| `strike-550r` | Hisun Strike 550R |

**L3 — Stryker Series**  
Config: `powersports--stryker.php`

| Slug | Description |
|---|---|
| `stryker-550` | Hisun Stryker 550 |
| `stryker-750` | Hisun Stryker 750 |
| `stryker-750-crew` | Hisun Stryker 750 Crew |

**L3 — Sector Series**  
Config: `powersports--sector.php`

| Slug | Description |
|---|---|
| `sector-250` | Hisun Sector 250 |
| `sector-550-eps` | Hisun Sector 550 EPS |
| `sector-750-crew` | Hisun Sector 750 Crew |
| `sector-750-eps` | Hisun Sector 750 EPS |

**L3 — HS Series**  
Config: `powersports--hs-series.php`

| Slug | Description |
|---|---|
| `hs-400` | Hisun HS 400 |
| `hs-500` | Hisun HS 500 |

**L3 — MP9 Series**  
Config: `powersports--mp9.php`

| Slug | Description |
|---|---|
| `mp9-550r` | Hisun MP9 550R |
| `mp9-750r` | Hisun MP9 750R |
| `mp9-t400` | Hisun MP9 T400 |

**L3 — E-Z-GO Brand Page** (`/powersports/ezgo/`)  
Config: `powersports--ezgo.php`

| Slug | Description |
|---|---|
| `ezgo-rxv` | E-Z-GO RXV |
| `ezgo-txt` | E-Z-GO TXT |
| `ezgo-valor` | E-Z-GO Valor |
| `ezgo-express` | E-Z-GO Express |

**L3 — Cub Cadet UTV** (`/powersports/cub-cadet-utv/`)  
Config: `powersports--cub-cadet-utv.php`

| Slug | Description |
|---|---|
| `cub-cadet-challenger-750-mx` | Cub Cadet Challenger 750 MX |

**L3 — Electric Powersports**  
Config: `powersports--electric.php`

| Slug | Description |
|---|---|
| `sector-e1` | Hisun Sector E1 (electric) |
| `ace-nv` | ACE NV (electric) |

---

### DOCKS & LIFTS

Parent page: `/docks-and-lifts/`  
Config: `inc/category-configs/docks-and-lifts.php`

**L2 — carousel tabs on `/docks-and-lifts/` parent page**

| Slug | Heading |
|---|---|
| `docks` | Docks |
| `boat-lifts` | Boat Lifts |
| `pwc-lifts` | PWC & Sea-Doo Lifts |
| `marine-railways` | Marine Railways |
| `hardware-accessories` | Dock Hardware & Accessories |
| `wave-armor` | Wave Armor |

**L3 — Docks** (`/docks-and-lifts/docks/`)  
Config: `docks-and-lifts--docks.php`

| Slug | Description |
|---|---|
| `truss-pipe-docks` | Truss Pipe Docks |
| `floating-truss-docks` | Floating Truss Docks |
| `lux-floating-dock` | LUX Floating Dock |
| `wavex-modular-dock` | WaveX Modular Dock |
| `lift-up-docks` | Lift-Up & Step Docks |
| `wave-armor-docks` | Wave Armor Docks |
| `dock-ramps` | Dock Ramps |
| `decking-options` | Decking Options |

**L3 — Boat Lifts** (`/docks-and-lifts/boat-lifts/`)  
Config: `docks-and-lifts--boat-lifts.php`

| Slug | Description |
|---|---|
| `cantilever-lifts` | Cantilever Boat Lifts |
| `hydraulic-lifts` | Hydraulic Boat Lifts |
| `vertical-pontoon-lifts` | Vertical Pontoon Boat Lifts |
| `hydro-extreme` | Hydro Extreme Boatlift |
| `wet-slip-lifts` | Wet-Slip / Hidden-Beam Lifts |
| `lift-roof-systems` | Lift Roof Systems |
| `lift-accessories` | Lift Accessories |
| `cantilever-winter-attachments` | Cantilever Winter Attachments |

**L3 — PWC Lifts** (`/docks-and-lifts/pwc-lifts/`)  
Config: `docks-and-lifts--pwc-lifts.php`

| Slug | Description |
|---|---|
| `hydraulic-pwc-lifts` | Hydraulic PWC Lifts |
| `wave-armour-ports` | Wave Armour Ports (note: `armour` spelling variant — must match exactly) |

**L3 — Marine Railways** (`/docks-and-lifts/marine-railways/`)  
Config: `docks-and-lifts--marine-railways.php`

| Slug | Description |
|---|---|
| `marine-railway-systems` | Marine Railway Systems |
| `railway-winches` | Railway Winches (Manual & Electric) |
| `roller-ramp-systems` | Roller Ramp Systems |
| `railway-accessories` | Railway Accessories |

**L3 — Hardware & Accessories** (`/docks-and-lifts/hardware-accessories/`)  
Config: `docks-and-lifts--hardware-accessories.php`

| Slug | Description |
|---|---|
| `dock-cleats` | Dock Cleats |
| `dock-ladders` | Dock Ladders, Stairs & Railings |
| `dock-lighting` | Dock Lighting |
| `mooring-protection` | Mooring & Dock Protection |
| `de-icers` | De-Icers & Oscillators |
| `diy-hardware` | DIY Dock Hardware |
| `other-accessories` | Other Accessories |

**L3 — Wave Armor** (`/docks-and-lifts/wave-armor/`)  
Config: `docks-and-lifts--wave-armor.php`

| Slug | Description |
|---|---|
| `wave-docks` | Wave Docks |
| `wave-armor-ports` | Wave Armor Ports (note: `armor` spelling — different from `wave-armour-ports` above; both must exist) |
| `kayak-launches` | Kayak Launches |
| `kayak-racks` | Kayak Racks |
| `otter-swim-rafts` | Otter Swim Rafts |
| `protectr-canopies` | Protectr Canopies |

---

## 2. Tags Needed

**Finding: NO active customer-facing template queries by `product_tag`.**

The only `product_tag` query in the theme is in `page-templates/service-detail.php` for the `/service/order-parts/` Featured Parts widget (line 90):

```php
'taxonomy' => 'product_tag',
'field'    => 'slug',
'terms'    => 'featured-parts',
```

**One tag is needed:**

| Tag Slug | Purpose |
|---|---|
| `featured-parts` | Marks products to show in the "Featured Parts" widget on `/service/order-parts/`. Apply this tag to the specific parts you want featured. |

All other `product_tag` references in the theme are in:
- `inc/purge-stihl.php` — one-time cleanup script, not a live template
- `inc/seed-product-tags.php` / `seed-product-tags-v3.php` — one-time seeder scripts, not live queries
- `inc/woocommerce-compat.php` — fallback taxonomy registration only

**Conclusion:** Tags are optional for all inventory display. The only required tag is `featured-parts` and only products that should appear in the order-parts Featured Parts section need it.

---

## 3. Optional / Recommended Filter-UX Additions

**One clean win:** The `/inventory/` page filter dropdown (`page-templates/inventory.php` line 65) calls `get_terms(['taxonomy' => 'product_category', 'hide_empty' => true])` — this returns ALL non-empty categories in a flat alphabetical list. Once 170+ categories are populated, the dropdown becomes long. A top-level-only filter (limiting to root-level parent terms + one "Subcategory" selector) would improve UX significantly.

**Implementation:** Change `get_terms()` to add `parent => 0` for the Category dropdown, then add a second conditional "Subcategory" dropdown populated via JS based on the selected parent. This is a 1–2 hour code task; flag for post-launch sprint.

---

## 4. Brand Reassignment Sequence

Two `product_brand` taxonomy corrections needed before launch. These are brand taxonomy fixes, not category fixes.

### Cub Cadet UTV (1 product)
**Problem:** 1 product is assigned to a `product_brand` term named "Cub Cadet UTV". The correct brand term is "Cub Cadet".

**Steps (WP Admin):**
1. Go to **Products > All Products** (`/wp-admin/edit.php?post_type=product`)
2. Use the brand filter dropdown at top → select "Cub Cadet UTV" → apply
3. Select the 1 product → **Bulk Actions > Edit** → find brand field → change to "Cub Cadet" → update
4. Go to **Products > Brands** (`/wp-admin/edit-tags.php?taxonomy=product_brand&post_type=product`)
5. Confirm "Cub Cadet UTV" now shows 0 products → delete it

### Minnkota → Minn Kota (17 products)
**Problem:** 17 products assigned to "Minnkota" (no space). Correct brand term is "Minn Kota" (with space).

**Steps (WP Admin):**
1. First, confirm "Minn Kota" term exists in Products > Brands (create it if not)
2. Go to **Products > All Products** → filter by brand "Minnkota" → 17 products appear
3. Select all 17 → **Bulk Actions > Edit** → change brand to "Minn Kota" → update
4. Go to **Products > Brands** → confirm "Minnkota" now shows 0 products → delete it

> The brand-catalogue pages for Minnkota (`/boats-and-marine/minnkota/`) query by `product_brand` slug. If the page slug is "minnkota", the template uses `get_term_by('slug', 'minnkota', 'product_brand')` — which will fail once the term is deleted. Ensure the "Minn Kota" term's slug is set correctly in WP admin, OR ensure the brand catalogue page slug matches the term slug. Recommend: create "Minn Kota" term with slug `minn-kota`, then update the brand catalogue page slug to match (or add a WP redirect from `/minnkota/` to `/minn-kota/`). Flag for dev review before running.

---

## Appendix: Flat slug count

Total unique `product_category` slugs required: **~175**  
Slugs used in multiple carousels (must assign to products for all contexts to work):

| Slug | Used by |
|---|---|
| `toro-riding-mowers` | riding-mowers page + cub-cadet page + toro page |
| `cub-cadet-push-mowers` | push-mowers page + cub-cadet page |
| `toro-power-clear` | single-stage snow page + toro snow page |
| `cordless-blowers` | blowers page + cordless-56v page |
| `cordless-hedge-trimmers` | hedge-trimmers page + cordless-56v page |
| `atvs` | powersports parent + hisun brand page |
| `electric-powersports` | powersports parent + hisun brand page |
| `power-pruners` | echo page + power-pruners sub-page |
| `chainsaws` | front-page + echo page |
| `trimmers` | front-page + echo page |
| `pwc-lifts` | docks parent + r-j-machine brand page |
| `marine-railways` | docks parent + r-j-machine brand page |
| `hardware-accessories` | docks parent + r-j-machine brand page |
| `fish-finders` | front-page + electronics page |
| `trolling-motors` | front-page + motors page |
| `mercury` | motors page + boats-marine (L2) |

Products in these categories must be tagged with all relevant slugs so they surface across every carousel that should show them.
