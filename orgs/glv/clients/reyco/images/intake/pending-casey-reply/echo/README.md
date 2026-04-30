# Echo intake — Casey dealer-photo ask (2026-04-23)

**SKU count:** 3
**Ask type:** `confirm_or_replace`
**Deliverable from Casey:** confirm dealer-source of existing image, OR send replacement if unverified.

## Filename convention

```
{sku}-{descriptor}-{1|2|3}.{ext}

  sku:        full SKU as listed below (case-sensitive, hyphens preserved)
  descriptor: 3-4 word kebab-case slug describing the shot (e.g. 'front-34-white-bg', 'side-profile', 'engine-detail')
  1|2|3:      1 = primary hero, 2 = first alt, 3 = second alt (only if supplied by Casey)
  ext:        jpg | png | webp (original format preserved; no conversion at intake)
```

## Alt-text pattern (content-owned)

`gas: "Echo [cc]cc gas [tool_type] — Reyco Marine outdoor power equipment Sault Ste. Marie"  |  battery: "Echo battery [tool_type] — Reyco Marine outdoor power equipment Sault Ste. Marie"`

Full templates with fallbacks: `orgs/glv/clients/reyco/images/intake/alt-text-templates.md`

## Expected SKUs

| # | SKU | Product name | Notes |
|---|---|---|---|
| 1 | EC-PB760LNT-26 | Echo PB-760LNT Low-Noise Backpack (Tube) | existing image — source unverified; needs dealer confirmation or replacement |
| 2 | EC-SHC225-26 | Echo SHC-225 Shafted Hedge Trimmer | existing image — source unverified; needs dealer confirmation or replacement |
| 3 | EC-SHC225S-26 | Echo SHC-225S Shafted Hedge Trimmer (S) | existing image — source unverified; needs dealer confirmation or replacement |

## Intake status

All SKUs pending Casey reply (dispatched 2026-04-23). Expected return: Friday 2026-04-25.

When files land: drop them in this folder using the filename convention above, then check the matching SKU in `../intake-checklist.md`.
