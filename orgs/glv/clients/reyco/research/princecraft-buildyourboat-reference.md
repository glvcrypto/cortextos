# Princecraft Build-Your-Boat Configurator — Scope Reference

**Purpose:** Scope intel for dev to reference post-custom-fields migration. Reyco (user) wants to match Princecraft's boat configurator experience. Do NOT build from this doc — read-only reference.

**Researched:** 2026-04-20 by scout  
**Source:** https://build.princecraft.com  
**Reyco relationship:** Authorized Princecraft dealer — can embed or link to this tool, or build a matching experience.

---

## Overview

Princecraft runs a standalone JavaScript SPA configurator at `build.princecraft.com`. State is entirely URL-driven via query parameters. No login required. Region-gated to US and Canada.

---

## Step Flow

### Fishing Boats (8 steps)
```
Type → Series → Model → Appearance → Engine → Options → Trailer → Final Estimate
```

### Pontoon Boats (9 steps)
```
Type → Series → Model → Appearance → Configuration → Engine → Options → Trailer → Final Estimate
```

### Deck Boats
Same flow as fishing (8 steps) — deck boats share the fishing flow minus the Configuration step.

---

## Step-by-Step Detail

### Step 1: Type
User selects one of three boat categories:
- **Fishing Boats** — `type=b`
- **Pontoon Boats** — `type=p`
- **Deck Boats** — `type=d`

UI: Three large selectable cards/buttons. Clean category-first entry point.

---

### Step 2: Series
User selects series within chosen category.

**Fishing series (2026):**
Platinum, Sport, Xpedition®, Hudson®, Holiday®, Amarok, Resorter®, Utilities, Jon Boats

**Pontoon series (2026):**
Vogue®, Quorum®, Sportfisher LX, Sportfisher, Vectra®, Jazz, Brio Electric

UI: Series cards with name. No pricing shown at this step. Featured model highlighted (e.g., "Platinum 190 2026" as new flagship).

---

### Step 3: Model
User selects specific model within chosen series.

**Full 2026 Fishing Catalog:**

| Series | Models |
|--------|--------|
| Platinum | 220 R, 190 R |
| Sport | 188, 185, 175, 175 MAX |
| Xpedition® | 200 |
| Hudson® | 190 WS, 190 BT, 170 WS, 166 WS |
| Holiday® | 162 WS MAX, 162 SC MAX |
| Amarok | 166 WS, 166 SC, 166 BT |
| Resorter® | 160 SC, 160 BT |
| Utilities | Yukon® 140 BT/14 L WT/14 WT, Starfish® 16 L WT/16 WT, Springbok® 16 L WT/16 WT, Fisherman 14, Ungava® 12, Scamper® 14, Seasprite® 12 |
| Jon Boats | PR 1436 L, 1240, 1040, 1032 |

Example model data shown at this step: Sport 175 = 17.05 ft length, 6-person capacity.

---

### Step 4: Appearance
User selects color/finish option.

- UI: Color swatches with "X choice(s) available" label
- Specific color names are JS-rendered — not exposed in static HTML
- Navigation shows Back/Continue buttons

---

### Step 5 (Pontoon only): Configuration
Pontoon-specific structural variant selection:
- **Standard** — 2 floats; standard on all pontoon models except Vectra 23® WRL and Vogue® series
- Additional configurations available per model (e.g., triple-tube, WRL variants)

Fishing/Deck boats skip this step.

---

### Step 6: Engine
User selects outboard engine.

- JS-rendered — specific engine brands, HP ranges, and model names not capturable via static fetch
- Likely shows horsepower range, brand (Mercury is Reyco's authorized brand), model name
- Engine options are model-specific (not all engines available on all hulls)

**Dev note:** This is the highest-complexity step for a replicated configurator — engine compatibility matrix per hull is needed.

---

### Step 7: Options
User selects optional accessories and upgrades.

- JS-rendered — specific items not capturable
- Per Princecraft's product notes, options include: custom trailers, downrigger-mounting supports, reclining captain's chairs, canvas enclosure fasteners (factory-installed on every boat as a dependency), and model-specific accessories
- Each option is purpose-built for specific models — not generic add-ons

**Dev note:** Options are model-specific, not a flat catalog. Need a per-model options matrix.

---

### Step 8: Trailer
User selects trailer package.

- Trailers are custom-built to fit each model (not universal)
- Fasteners for optional canvas enclosures are factory-installed on every boat — canvas is the dependency, not the trailer
- JS-rendered — specific trailer models not capturable

---

### Step 9: Final Estimate
Price summary page.

**Fields shown:**
- Base model MSRP
- Selected options line items
- Engine price
- Trailer price
- Subtotal (MSRP-based)
- Payment calculator with interest rate input

**Legal dependencies (must be included on any replicated tool):**
- "All prices are based on MSRP after currently applicable incentives have been applied and include freight (Quebec only)"
- Prices exclude: options, Green Levy (if applicable), license, fuel fill charge, insurance, dealer PDI, administration fees, taxes
- "The real price will always remain the one submitted by a dealer" — tool is for comparison purposes only
- Dealer price disclaimer must be visible

---

## URL Structure (Query Parameters)

```
https://build.princecraft.com/?
  lang=en          # en or fr
  region=us        # us or region code (bateau-aluminium for Canada)
  annee=2026       # model year
  step=series      # current step: type, series, model, color, config, engine, options, trailer, estimate
  type=b           # b=fishing, p=pontoon, d=deck
  cedule=<id>      # model/schedule ID — assigned after model selection
```

Deep-linking to a step requires `cedule` once a model is selected. Entry point (`?lang=en`) presents the Type selector.

---

## Tech Architecture Notes

- **SPA** — single-page JavaScript app; all state in URL params
- **No account/login** required
- **Region-gated** — US and Canada only; redirects otherwise
- **Not embeddable via iframe** in a standard way (JS-dependent, CORS likely)
- **Not static-fetch friendly** — product data, color swatches, engine/option lists are all JS-rendered; a replicated tool would need Princecraft's data via API or manual ingestion
- **Session persistence** — URL is shareable/bookmarkable; user can resume via URL

---

## Replication Complexity Assessment (for dev)

| Component | Complexity | Notes |
|-----------|-----------|-------|
| Type/Series/Model selection | Low | Static data; 35+ models in catalog |
| Appearance (color) | Medium | Need color swatch images + model-color mapping |
| Configuration (pontoon) | Low | 2-3 options per model max |
| Engine selection | High | Compatibility matrix per hull + Mercury HP/model data |
| Options catalog | High | Per-model options, not flat list; need Princecraft options data |
| Trailer selection | Medium | Per-model trailers; limited SKU count |
| Final Estimate + pricing | Medium | MSRP math + legal disclaimer required |
| Deep-link / URL state | Low | Replicate query-param pattern |

**Minimum viable version for Reyco:** Type → Series → Model → Request a Quote CTA (skip engine/options/trailer). Full configurator requires Princecraft options/pricing data that likely comes via dealer extranet or manual catalog ingestion.

---

## Relevant Context for Reyco

- Reyco is an authorized Princecraft dealer — they may have access to the dealer extranet (`extranetKey` param appears in some configurator URLs)
- Mercury is Reyco's authorized engine brand — engine step aligns
- Reyco's current site has no configurator — this is a greenfield feature post-custom-fields migration
- User (Aiden) confirmed Reyco wants to match this experience — transcript item #13

---

## Source URLs

- Configurator: https://build.princecraft.com/?lang=en
- Fishing series: https://build.princecraft.com/?step=series&type=b&annee=2026&lang=en&region=us
- Pontoon series: https://build.princecraft.com/?step=series&type=p&annee=2026&lang=en&region=us
- Standard config page: https://www.princecraft.com/us/en/Pontoon-Boats/Configurations/Standard-Configuration.aspx
- Technical drawings: https://www.princecraft.com/us/en/Fishing-Boats/Technical-Drawings.aspx
