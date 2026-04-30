# Minnkota intake — Casey dealer-photo ask (2026-04-23)

**SKU count:** 1
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

`"Minnkota [product_line] [thrust]lb trolling motor — Reyco Marine Sault Ste. Marie"`

Full templates with fallbacks: `orgs/glv/clients/reyco/images/intake/alt-text-templates.md`

## Expected SKUs

| # | SKU | Product name | Notes |
|---|---|---|---|
| 1 | MINNKOTA-TERROVA-80- | Minnkota Terrova 80 | no_image |

## Intake status

All SKUs pending Casey reply (dispatched 2026-04-23). Expected return: Friday 2026-04-25.

When files land: drop them in this folder using the filename convention above, then check the matching SKU in `../intake-checklist.md`.
