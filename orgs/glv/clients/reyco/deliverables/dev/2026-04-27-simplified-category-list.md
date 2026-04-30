# Reyco Marine — Clean Product Category Slug Reference
**Post PR #100 · 2026-04-27**

**Total required: 136 clean `product_category` terms** (PR #100 makes 34 composite slugs obsolete — see Appendix).
"~95" in earlier estimates referred only to the brand-page configs; full site needs all 136.

---

## 1. Boats & Marine

### 1a. Top-level (L2) — parent: none
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `fishing-boats` | Fishing Boats | `/boats-and-marine/` top carousel, homepage Marine tab |
| `pontoons` | Pontoons | `/boats-and-marine/` top carousel, homepage Marine tab |
| `deck-boats` | Deck Boats | `/boats-and-marine/` top carousel |
| `boat-motors` | Boat Motors | `/boats-and-marine/` top carousel, `/boats-and-marine/outboard-motors/` |
| `trolling-motors` | Trolling Motors | `/boats-and-marine/` top carousel, `/boats-and-marine/trolling-motors/` L2 |
| `electronics` | Electronics & Accessories | `/boats-and-marine/` top carousel, `/boats-and-marine/electronics/` |
| `fish-finders` | Fish Finders | `/boats-and-marine/electronics/` carousel |

### 1b. Fishing Boats (L3) — parent: `fishing-boats`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `sport-fishing-boats` | Sport Series | `/boats-and-marine/fishing-boats/`, `/boats-and-marine/princecraft/` | Princecraft only |
| `platinum-fishing-boats` | Platinum SE Series | `/boats-and-marine/fishing-boats/`, `/boats-and-marine/princecraft/` | Princecraft only |
| `multi-species-boats` | Multi-Species Boats | `/boats-and-marine/fishing-boats/` | — |

### 1c. Pontoons (L3) — parent: `pontoons`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `pontoon-jazz` | Jazz Series | `/boats-and-marine/pontoons/` | Princecraft only |
| `pontoon-vectra` | Vectra Series | `/boats-and-marine/pontoons/` | Princecraft only |
| `pontoon-vogue` | Vogue Series | `/boats-and-marine/pontoons/` | Princecraft only |

### 1d. Deck Boats (L3) — parent: `deck-boats`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `ventura-deck-boats` | Ventura Series | `/boats-and-marine/deck-boats/`, `/boats-and-marine/princecraft/` | Princecraft only |
| `sport-deck-boats` | Sport Deck Models | `/boats-and-marine/deck-boats/` | — |

### 1e. Boat Motors (L3) — parent: `boat-motors`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `mercury` | Mercury Outboards (all) | `/boats-and-marine/motors/` overview | Mercury only |
| `fourstroke-outboards` | FourStroke Series (25–150 HP) | `/boats-and-marine/mercury/`, `/boats-and-marine/outboard-motors/` | **Mercury brand page** |
| `verado-outboards` | Verado Series (200–300 HP) | `/boats-and-marine/mercury/`, `/boats-and-marine/outboard-motors/` | **Mercury brand page** |
| `proxs-outboards` | Pro XS Series | `/boats-and-marine/mercury/`, `/boats-and-marine/outboard-motors/` | **Mercury brand page** |
| `portable-outboards` | Portable Series (2.5–20 HP) | `/boats-and-marine/mercury/`, `/boats-and-marine/outboard-motors/` | **Mercury brand page** |
| `repowers` | Motor Repowers | `/boats-and-marine/motors/` | — |

### 1f. Trolling Motors (L3) — parent: `trolling-motors`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `terrova` | Terrova with i-Pilot | `/boats-and-marine/trolling-motors/` | Minn Kota only |
| `ulterra` | Ulterra with i-Pilot Link | `/boats-and-marine/trolling-motors/` | Minn Kota only |
| `endura` | Endura & Riptide Series | `/boats-and-marine/trolling-motors/` | Minn Kota only |

### 1g. Fish Finders (L3) — parent: `fish-finders`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `entry-fish-finders` | Entry-Level (HELIX 5–7) | `/boats-and-marine/fish-finders/` | — |
| `mid-range-fish-finders` | Mid-Range (HELIX 9–10) | `/boats-and-marine/fish-finders/` | — |
| `premium-fish-finders` | Premium (HELIX 12–15, SOLIX) | `/boats-and-marine/fish-finders/` | — |
| `mega-live-sonar` | MEGA Live Forward-Facing Sonar | `/boats-and-marine/fish-finders/` | — |
| `helix-series` | HELIX Series | `/boats-and-marine/humminbird/` | Humminbird only |
| `apex-series` | APEX Series | `/boats-and-marine/humminbird/` | Humminbird only |
| `mega-live-2` | MEGA Live 2 | `/boats-and-marine/humminbird/` | Humminbird only |
| `ice-electronics` | ICE Electronics | `/boats-and-marine/humminbird/` | Humminbird only |

### 1h. Electronics standalone — parent: `electronics`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `mega-live` | MEGA Live Imaging | `/boats-and-marine/electronics/` |
| `gps-chartplotters` | GPS & Chartplotters | `/boats-and-marine/electronics/` |

---

## 2. Lawn & Garden

### 2a. Top-level (L2) — parent: none
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `riding-mowers` | Riding Mowers | `/lawn-and-garden/` carousel, homepage Lawn tab, brand pages ×3 |
| `zero-turn` | Zero-Turn Mowers | `/lawn-and-garden/` carousel, homepage Lawn tab, brand pages ×3 |
| `push-mowers` | Push Mowers | `/lawn-and-garden/` carousel, homepage Lawn tab, brand pages ×3 |
| `trimmers-chainsaws` | Trimmers & Chainsaws | `/lawn-and-garden/` carousel overview |
| `chainsaws` | Chainsaws | `/lawn-and-garden/chainsaws/` L2 |
| `trimmers` | Trimmers | `/lawn-and-garden/trimmers/` L2 |

### 2b. Riding Mowers (L3) — parent: `riding-mowers`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `cub-cadet-xt1` | Cub Cadet XT1 Series | `/lawn-and-garden/riding-mowers/` category page | Cub Cadet only |
| `cub-cadet-xt2` | Cub Cadet XT2 Series | `/lawn-and-garden/riding-mowers/` category page | Cub Cadet only |
| `toro-riding-mowers` | Toro Riding Mowers | `/lawn-and-garden/riding-mowers/` category page | Toro only |
| `riding-mower-accessories` | Riding Mower Accessories | `/lawn-and-garden/riding-mowers/` | — |

> **SHARED slug:** `riding-mowers` is queried by **3 brand pages**: `/lawn-and-garden/cub-cadet/`, `/lawn-and-garden/toro/`, `/lawn-and-garden/troy-bilt/` — each gets automatic brand filter; only that brand's riding mowers show.

### 2c. Zero-Turn (L3) — parent: `zero-turn`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `cub-cadet-ultima` | Cub Cadet Ultima Series | `/lawn-and-garden/zero-turn/` category page | Cub Cadet only |
| `toro-timecutter` | Toro TimeCutter | `/lawn-and-garden/zero-turn/` category page | Toro only |
| `toro-titan` | Toro Titan | `/lawn-and-garden/zero-turn/` category page | Toro only |
| `commercial-zero-turn` | Commercial Zero-Turn | `/lawn-and-garden/zero-turn/` | — |

> **SHARED slug:** `zero-turn` queried by **3 brand pages**: cub-cadet, toro, troy-bilt — brand filter applies automatically.

### 2d. Push Mowers (L3) — parent: `push-mowers`
| Slug | Display Name | Surfaces On | Shared? |
|------|-------------|-------------|---------|
| `toro-recycler` | Toro Recycler | `/lawn-and-garden/push-mowers/` category page | Toro only |
| `toro-super-recycler` | Toro Super Recycler | `/lawn-and-garden/push-mowers/` category page | Toro only |
| `cub-cadet-push-mowers` | Cub Cadet Push Mowers | `/lawn-and-garden/push-mowers/` category page | Cub Cadet only |
| `manual-push-mowers` | Manual / Non-Propelled | `/lawn-and-garden/push-mowers/` | — |

> **SHARED slug:** `push-mowers` queried by **3 brand pages**: cub-cadet, toro, troy-bilt.
> ⚠️ `cub-cadet-push-mowers` is **KEPT** — still used by the push-mowers category page as a sub-section.

### 2e. Trimmers (L3) — parent: `trimmers`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `stihl-trimmers` | Echo String Trimmers | `/lawn-and-garden/trimmers/` |
| `cub-cadet-toro-trimmers` | Cub Cadet & Toro Trimmers | `/lawn-and-garden/trimmers/` |
| `brushcutters` | Brushcutters | `/lawn-and-garden/trimmers/` |
| `trimmer-pas` | PAS PowerHead System | `/lawn-and-garden/trimmers/` |
| `trimmer-accessories` | Trimmer Accessories | `/lawn-and-garden/trimmers/` |

### 2f. Chainsaws (L3) — parent: `chainsaws`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `homeowner-chainsaws` | Homeowner Chainsaws | `/lawn-and-garden/chainsaws/` |
| `farm-ranch-chainsaws` | Farm & Ranch Chainsaws | `/lawn-and-garden/chainsaws/` |
| `professional-chainsaws` | Professional Chainsaws | `/lawn-and-garden/chainsaws/` |
| `chainsaw-accessories` | Chainsaw Accessories | `/lawn-and-garden/chainsaws/` |
| `cut-off-saws` | Cut-Off Saws | `/lawn-and-garden/chainsaws/` |

### 2g. Other Lawn & Garden
| Slug | Display Name | Parent | Surfaces On | Shared? |
|------|-------------|--------|-------------|---------|
| `accessories` | Accessories & Attachments | none | `/lawn-and-garden/cub-cadet/` | Cub Cadet brand page |
| `tillers` | Tillers & Cultivators | none | `/lawn-and-garden/troy-bilt/` | Troy-Bilt brand page |
| `commercial` | Commercial Equipment | none | `/lawn-and-garden/toro/` | Toro brand page |
| `blowers` | Blowers | none | `/lawn-and-garden/blowers/` | — |
| `hedge-trimmers` | Hedge Trimmers | none | `/lawn-and-garden/hedge-trimmers/` | — |
| `power-pruners` | Power Pruners | none | `/lawn-and-garden/power-pruners/` | — |
| `pressure-washers` | Pressure Washers | none | `/lawn-and-garden/pressure-washers/` | — |
| `cordless-56v` | Cordless 56V Line | none | `/lawn-and-garden/cordless-56v/` | — |
| `pro-attachment-series` | Pro Attachment Series | none | `/lawn-and-garden/pro-attachment-series/` | — |

---

## 3. Snow Equipment

### 3a. Top-level (L2) — parent: none
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `two-stage` | Two-Stage Snowblowers | `/snow-equipment/` carousel, homepage Snow tab, brand pages ×2 |
| `three-stage` | Three-Stage Snowblowers | `/snow-equipment/` carousel, homepage Snow tab, **Cub Cadet brand page** |
| `single-stage` | Single-Stage Snowblowers | `/snow-equipment/` carousel, homepage Snow tab |

> **SHARED slugs:** `two-stage` queried by **cub-cadet** and **toro** brand pages.

### 3b. Two-Stage (L3) — parent: `two-stage`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `24-inch-snowblowers` | 24-Inch Two-Stage | `/snow-equipment/two-stage/` |
| `26-inch-snowblowers` | 26-Inch Two-Stage | `/snow-equipment/two-stage/` |
| `28-inch-snowblowers` | 28-Inch Two-Stage | `/snow-equipment/two-stage/` |
| `two-stage-accessories` | Two-Stage Accessories | `/snow-equipment/two-stage/` |
| `track-drive` | Track-Drive Snowblowers | `/snow-equipment/two-stage/`, `/snow-equipment/cub-cadet/` brand page |
| `power-max` | Toro Power Max | `/snow-equipment/toro/` brand page | Toro only |
| `power-max-hd` | Toro Power Max HD | `/snow-equipment/toro/` brand page | Toro only |
| `snow-accessories` | Snow Accessories | `/snow-equipment/cub-cadet/` + `/snow-equipment/toro/` brand pages | **SHARED: cub-cadet + toro** |

### 3c. Three-Stage (L3) — parent: `three-stage`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `cub-cadet-3x-26` | Cub Cadet 3X 26" | `/snow-equipment/three-stage/` category page |
| `cub-cadet-3x-28` | Cub Cadet 3X 28" | `/snow-equipment/three-stage/` category page |
| `cub-cadet-3x-30` | Cub Cadet 3X 30" | `/snow-equipment/three-stage/` category page |
| `cub-cadet-3x-track` | Cub Cadet 3X Track Drive | `/snow-equipment/three-stage/` category page |

> `cub-cadet-3x-*` slugs are **NOT composite brand+category** — they are model family identifiers. Keep them.

### 3d. Single-Stage (L3) — parent: `single-stage`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `toro-power-clear` | Toro Power Clear | `/snow-equipment/single-stage/` category page |
| `electric-snowblowers` | Electric Snowblowers | `/snow-equipment/single-stage/` |
| `single-stage-accessories` | Single-Stage Accessories | `/snow-equipment/single-stage/` |
| `power-clear` | Toro Power Clear (brand page) | `/snow-equipment/toro/` brand page | Toro only |

> ⚠️ `toro-power-clear` is **KEPT** — still used by the single-stage category page. `power-clear` is the Toro brand page version. Both required.

### 3e. Snow Plows — parent: none
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `atv-plows` | ATV Snow Plows | `/snow-equipment/snow-plows/` |
| `utv-plows` | UTV Snow Plows | `/snow-equipment/snow-plows/` |
| `bercomac` | Bercomac Snow Equipment | `/snow-equipment/snow-plows/` |
| `plow-accessories` | Plow Accessories | `/snow-equipment/snow-plows/` |

---

## 4. Powersports

### 4a. Top-level (L2) — parent: none
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `sport-utvs` | Sport UTVs | `/powersports/` carousel |
| `utility-utvs` | Utility UTVs | `/powersports/` carousel |
| `crew-utvs` | Crew & 4-Seat UTVs | `/powersports/` carousel |
| `youth-utvs` | Youth UTVs | `/powersports/` carousel |
| `atvs` | ATVs | `/powersports/` carousel, `/powersports/atvs/` |
| `electric-powersports` | Electric UTVs & Golf Carts | `/powersports/` carousel |
| `cub-cadet-utv` | Cub Cadet UTVs | `/powersports/hisun/` cross-link section |

### 4b. ATVs (L3) — parent: `atvs`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `forge-400i` | Forge 400i | `/powersports/atvs/` |
| `guardian` | Guardian | `/powersports/atvs/` |
| `tactic` | Tactic | `/powersports/atvs/` |
| `hs-series` | HS Series | `/powersports/atvs/`, `/powersports/hisun/` |
| `ace-nv` | ACE NV (Electric) | `/powersports/electric/` |

### 4c. Hisun Brand Page (L3 — mixed parent)
| Slug | Display Name | Parent | Surfaces On |
|------|-------------|--------|-------------|
| `strike-series` | Strike Series | `sport-utvs` | `/powersports/hisun/` brand overview |
| `stryker-series` | Stryker Series | `sport-utvs` | `/powersports/hisun/` brand overview |
| `sector-series` | Sector Series | `utility-utvs` | `/powersports/hisun/` brand overview |
| `mp9-series` | MP9 Series | `utility-utvs` | `/powersports/hisun/` brand overview |
| `electric-powersports` | Electric UTVs | — | `/powersports/hisun/` + `/powersports/electric/` |

### 4d. Strike (L3) — parent: `strike-series`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `strike-250r` | Strike 250R | `/powersports/strike/` |
| `strike-550r` | Strike 550R | `/powersports/strike/` |

### 4e. Stryker (L3) — parent: `stryker-series`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `stryker-550` | Stryker 550 | `/powersports/stryker/` |
| `stryker-750` | Stryker 750 | `/powersports/stryker/` |
| `stryker-750-crew` | Stryker 750 Crew | `/powersports/stryker/` |

### 4f. Sector (L3) — parent: `sector-series`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `sector-250` | Sector 250 | `/powersports/sector/` |
| `sector-550-eps` | Sector 550 EPS | `/powersports/sector/` |
| `sector-750-eps` | Sector 750 EPS | `/powersports/sector/` |
| `sector-750-crew` | Sector 750 Crew | `/powersports/sector/` |
| `sector-e1` | Sector E1 (Electric) | `/powersports/electric/` |

### 4g. MP9 (L3) — parent: `mp9-series`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `mp9-550r` | MP9 550R | `/powersports/mp9/` |
| `mp9-750r` | MP9 750R | `/powersports/mp9/` |
| `mp9-t400` | MP9 T400 | `/powersports/mp9/` |

### 4h. HS Series (L3) — parent: `hs-series`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `hs-400` | HS 400 | `/powersports/hs-series/` |
| `hs-500` | HS 500 | `/powersports/hs-series/` |

### 4i. E-Z-GO Golf Carts (L3) — parent: `electric-powersports`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `ezgo-rxv` | E-Z-GO RXV | `/powersports/easy-go/` brand page |
| `ezgo-txt` | E-Z-GO TXT | `/powersports/easy-go/` brand page |
| `ezgo-valor` | E-Z-GO Valor | `/powersports/easy-go/` brand page |
| `ezgo-express` | E-Z-GO Express | `/powersports/easy-go/` brand page |

### 4j. Cub Cadet UTV (L3) — parent: `cub-cadet-utv`
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `challenger-750-mx` | Challenger 750 MX | `/powersports/cub-cadet-utv/` brand page |

---

## 5. Docks & Lifts

### Parent: none
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `docks` | Docks | `/docks-and-lifts/` carousel |
| `boat-lifts` | Boat Lifts | `/docks-and-lifts/` carousel, `/docks-and-lifts/boat-lifts/` |
| `pwc-lifts` | PWC & Sea-Doo Lifts | `/docks-and-lifts/` carousel, `/docks-and-lifts/pwc-lifts/` |
| `marine-railways` | Marine Railways | `/docks-and-lifts/marine-railways/` |
| `hardware-accessories` | Dock Hardware & Accessories | `/docks-and-lifts/hardware-accessories/` |
| `wave-armor` | Wave Armor | `/docks-and-lifts/wave-armor/` |

### R&J Machine sub-sections (parent: respective above)
| Slug | Display Name | Surfaces On |
|------|-------------|-------------|
| `atv-plows` | ATV Plows | `/snow-equipment/snow-plows/` + R&J Machine section |
| `utv-plows` | UTV Plows | `/snow-equipment/snow-plows/` + R&J Machine section |

---

## 6. Motors (Standalone)

| Slug | Display Name | Parent | Surfaces On |
|------|-------------|--------|-------------|
| `mercury` | Mercury Outboards | `boat-motors` | `/boats-and-marine/motors/` overview carousel |
| `trolling-motors` | Trolling Motors | `boat-motors` | `/boats-and-marine/motors/` overview carousel |
| `repowers` | Motor Repowers | `boat-motors` | `/boats-and-marine/motors/` |

---

## Appendix A — DELETE These 34 Composite Slugs

PR #100 removes all code references to these. If Aiden created them in WP admin, delete them now. They will no longer be queried by any template.

### W1 (front-page.php slug sync)
| Delete | Replaced By |
|--------|------------|
| `outboard-motors` | `boat-motors` |
| `zero-turn-mowers` | `zero-turn` |
| `two-stage-snowblowers` | `two-stage` |
| `three-stage-snowblowers` | `three-stage` |
| `single-stage-snowblowers` | `single-stage` |

### W2 — Mercury brand page
| Delete | Replaced By |
|--------|------------|
| `mercury-fourstroke` | `fourstroke-outboards` |
| `mercury-verado` | `verado-outboards` |
| `mercury-proxs` | `proxs-outboards` |
| `mercury-portable` | `portable-outboards` |

### W2 — Princecraft brand page
| Delete | Replaced By |
|--------|------------|
| `princecraft-sport` | `sport-fishing-boats` |
| `princecraft-platinum` | `platinum-fishing-boats` |
| `princecraft-pontoons` | `pontoons` |
| `princecraft-ventura` | `ventura-deck-boats` |

### W2 — Minn Kota (trolling-motors page)
| Delete | Replaced By |
|--------|------------|
| `minnkota-terrova` | `terrova` |
| `minnkota-ulterra` | `ulterra` |
| `minnkota-endura` | `endura` |

### W2 — Cub Cadet lawn brand page
| Delete | Replaced By |
|--------|------------|
| `cub-cadet-riding-mowers` | `riding-mowers` |
| `cub-cadet-zero-turn` | `zero-turn` |
| `cub-cadet-accessories` | `accessories` |
| ~~`cub-cadet-push-mowers`~~ | ⚠️ **KEEP** — still used by push-mowers category page |

### W2 — Toro lawn brand page
| Delete | Replaced By |
|--------|------------|
| `toro-zero-turn` | `zero-turn` |
| `toro-push-mowers` | `push-mowers` |
| `toro-commercial` | `commercial` |
| ~~`toro-riding-mowers`~~ | ⚠️ **KEEP** — still used by riding-mowers category page |
| ~~`toro-power-clear`~~ (snow) | ⚠️ **KEEP** — still used by single-stage category page |

### W2 — Troy-Bilt brand page
| Delete | Replaced By |
|--------|------------|
| `troy-bilt-riding-mowers` | `riding-mowers` |
| `troy-bilt-zero-turn` | `zero-turn` |
| `troy-bilt-push-mowers` | `push-mowers` |
| `troy-bilt-tillers` | `tillers` |

### W2 — Cub Cadet snow brand page
| Delete | Replaced By |
|--------|------------|
| `cub-cadet-two-stage` | `two-stage` |
| `cub-cadet-three-stage` | `three-stage` |
| `cub-cadet-track-drive` | `track-drive` |
| `cub-cadet-snow-accessories` | `snow-accessories` |

### W2 — Toro snow brand page
| Delete | Replaced By |
|--------|------------|
| `toro-power-max` | `power-max` |
| `toro-power-max-hd` | `power-max-hd` |
| `toro-snow-accessories` | `snow-accessories` |

### W2 — Cub Cadet UTV
| Delete | Replaced By |
|--------|------------|
| `cub-cadet-challenger-750-mx` | `challenger-750-mx` |

---

*Generated by dev agent · 2026-04-27 · Source: all `inc/category-configs/*.php` post PR #100*
