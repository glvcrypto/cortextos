# R&J Machine intake — Casey dealer-photo ask (2026-04-23)

**SKU count:** 15
**Ask type:** `send_new_photo`
**Deliverable from Casey:** new product photo(s) per SKU — no existing image on WC.

## Filename convention

```
{sku}-{descriptor}-{1|2|3}.{ext}

  sku:        full SKU as listed below (case-sensitive, hyphens preserved)
  descriptor: 3-4 word kebab-case slug describing the shot (e.g. 'front-34-white-bg', 'side-profile', 'engine-detail')
  1|2|3:      1 = primary hero, 2 = first alt, 3 = second alt (only if supplied by Casey)
  ext:        jpg | png | webp (original format preserved; no conversion at intake)
```

## Alt-text pattern (content-owned)

`"R&J Machine [dock_type] dock [length] — Reyco Marine Sault Ste. Marie Northern Ontario"  (lifts: "R&J Machine [capacity] lb boat lift — Reyco Marine dock and lift dealer Sault Ste. Marie")`

Full templates with fallbacks: `orgs/glv/clients/reyco/images/intake/alt-text-templates.md`

## Expected SKUs

| # | SKU | Product name | Notes |
|---|---|---|---|
| 1 | RJ-BOAT-LIFT-ROOF-SY | R&amp;J Boat Lift Roof System | no_image |
| 2 | RJ-CANTILEVER-BOAT-L | R&amp;J Cantilever Boat Lift | no_image |
| 3 | RJ-FLOATING-TRUSS-DO | R&amp;J Floating Truss Dock | no_image |
| 4 | RJ-HIDDEN-BEAM-WET-S | R&amp;J Hidden-Beam Wet-Slip Lift | no_image |
| 5 | RJ-HYDRAULIC-BOAT-LI | R&amp;J Hydraulic Boat Lift | no_image |
| 6 | RJ-HYDRAULIC-PWC-LIF | R&amp;J Hydraulic PWC Lift | no_image |
| 7 | RJ-HYDRO-EXTREME-BOA | R&amp;J Hydro Extreme Boat Lift | no_image |
| 8 | RJ-LIFT-UP-STEP-DOCK | R&amp;J Lift-Up Step Dock | no_image |
| 9 | RJ-LUX-FLOATING-DOCK | R&amp;J LUX Floating Dock System | no_image |
| 10 | RJ-MARINE-RAILWAY-SY | R&amp;J Marine Railway System | no_image |
| 11 | RJ-TRUSS-PIPE-DOCK-A | R&amp;J Truss Pipe Dock — Aluminum | no_image |
| 12 | RJ-VERTICAL-PONTOON- | R&amp;J Vertical Pontoon Boat Lift | no_image |
| 13 | RJ-WAVEX-MODULAR-DOC | R&amp;J WaveX Modular Dock System | no_image |
| 14 | WAVE-ARMOR-OTTER-SWI | Wave Armor Otter Swim Raft 8&#8217;x10&#8242; | no_image |
| 15 | WAVE-ARMOUR-PWC-WAVE | Wave Armour PWC Wave Port | no_image |

## Intake status

All SKUs pending Casey reply (dispatched 2026-04-23). Expected return: Friday 2026-04-25.

When files land: drop them in this folder using the filename convention above, then check the matching SKU in `../intake-checklist.md`.
