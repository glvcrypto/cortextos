# Reyco Footer — Layout Cleanup Spec (v2)

**Date:** 2026-04-25 (v2 revision same day)
**Scope:** Site-wide footer (template-level — applies to ALL Reyco pages)
**Boss dispatch:** msg 1777161906323-boss-z8327 (v1) + 1777162804608-boss-re6md (v2 respec)
**Aiden's complaint (v1):** "logo spacing is way off. it makes the map way too low whilst the menus are hanging high up. way too much unused space, needs to be tighter."

**Aiden's verdict on v1 (deployed commit 27bca7f):** "i dont know if this looks much better than what we had before, the map could be under the brands and newsletter places and that gets rid of that entire section there. The built by GLV Marketing needs to be a little bit bigger. Make the copy 'powered by' and then make it clickable to the GLV Marketing website as well."

---

## v2 deltas (read this first)

| Change | v1 | v2 |
|---|---|---|
| Map placement | Full-width strip below 4-col grid | Inside grid: spans cols 2-4 in row 2, under Quick Links / Brands / Newsletter |
| Layout method | 4-col `grid` + sibling map div | `grid-template-areas` — Reyco col rowspan 2 (left), link/form cols + map fill right area |
| Equal-height mechanism | Map extracted from left col (v1 fix) | Left col = right-row-1 + right-row-2 by construction (v2 fix) |
| GLV credit logo size | `h-5` (20px) | `h-7` (28px) |
| GLV credit copy | "Built by GLV Marketing" | "Powered by [GLV logo]" |
| GLV credit link | Logo wrapped in `<a>`; "Built by" was plain text | Whole "Powered by [logo]" inline group wrapped in single `<a>` |

Sections updated: Solution (top), New Footer Structure, Section 1 (4-col grid → grid-areas), Section 2 (map strip → integrated map cell), Section 3 (credit bar markup). Sections preserved: design tokens, mobile, accessibility (still passes), what-not-changing, dev confirmation.

**Color correction (2026-04-25, boss msg 1777162241090):** Footer base is BROWN, not navy. Aiden's quote: "its not a navy footer, its brown." All bg references in this spec use a generic `[brown]` placeholder — **dev pulls the actual hex from the existing footer.php / theme CSS** rather than hardcoding. Orange `#FEA94F` and off-white `#F5F2ED` tokens still apply.

**Hex confirmed (2026-04-25, dev commit 0c29f50):** Footer brown is `#1c1c19` (very dark warm — near-charcoal with subtle warm tint). Contrast against this hex is excellent: orange headings ≈ **9.0:1 (AAA)**, off-white body ≈ **16.3:1 (AAA)**, white/70 credit text ≈ **11.4:1 (AAA)**. No mitigation needed — all foregrounds pass AAA for normal text. Spec markup still shows `bg-[brown]` placeholder for readability; dev shipped real hex in branch `feat/footer-cleanup`.

---

## Diagnosis (v2)

**v1 deployed state (commit 27bca7f, screenshot at `footer-v1-deployed-screenshot.jpg`):** 4-col grid (Reyco | Quick Links | Brands | Newsletter) above a full-width map strip above a credit bar. Visual measurements from screenshot:
- Reyco col (left): ~280-300px tall (logo + tagline + 3 contact items, ends at hours line)
- Right 3 cols: ~200px tall each (link/form lists)
- Whitespace gap below right cols: ~80px of dead air before the map starts
- Map strip: ~190-200px tall, full-width
- Credit bar: GLV credit tiny in bottom-right corner

Result: v1 fixed left-col-too-tall by extracting the map, but introduced TWO new asymmetries: (1) right cols now too short relative to left col, (2) map reads as its own orphaned section rather than part of the contact area. Aiden's verdict — "doesn't look much better" — is correct.

**v2 root cause:** v1 treated the map as a section to relocate. The right answer is to treat it as a column-grid CELL — placed in row 2 spanning the right-side columns, equal-height with the left col by grid construction. This eliminates both new asymmetries AND removes the full-width strip Aiden wanted gone.

---

## Solution v2 — grid-template-areas with left-col rowspan

**Layout:** CSS grid with explicit areas. Left col (Reyco) spans both rows. Right side is row 1 (Quick Links / Brands / Newsletter, three short cells) + row 2 (Map, spans cols 2-4).

**Why this beats the 3 options floated by boss:**

| Option | Read |
|---|---|
| A) 4-col [Reyco | QL | Brands | Map] — map = col 4 narrow | Forces map narrow + breaks Newsletter placement; map too small to read |
| B) 3-col [Reyco | QL | Brands], Newsletter+Map stacked in col 3 | Newsletter+Map stack works but cramps Newsletter; loses Quick Links/Brands/Newsletter rhythm |
| C) Hybrid — collapse 3 right cols to 2 + map below | User didn't ask for fewer cols; loses content |
| **v2 (selected) — grid-areas with map spanning row 2 cols 2-4** | Preserves all 4 col contents + map gets enough width to read + height balances by construction |

### Why grid-template-areas vs. flexbox or `grid-template-columns + col-span`

- `grid-template-areas` makes the row-span / col-span intent explicit and self-documenting in CSS
- Trivially restructure for mobile via media-query area redefinition (no DOM reorder)
- Works in all evergreen browsers (well-supported since 2017+)

### What carries forward from v1

- Tighter padding (pt-12 lg:pt-14 pb-8) — Aiden's "needs to be tighter" still applies
- Orange section headings on brown bg (visual anchoring)
- Cap on map height (200-240px) so the row-2 cell stays proportional
- All design tokens (#1c1c19 brown, #FEA94F orange, #F5F2ED off-white)

---

## New footer structure (v2)

```
┌─ FOOTER (brown bg #1c1c19) ─────────────────────────────────────────┐
│                                                                      │
│  ┌─ GRID (template-areas) ─────────────────────────────────────────┐ │
│  │                                                                 │ │
│  │  ┌─────────────┐ ┌─────────────┬─────────────┬───────────────┐  │ │
│  │  │ Reyco       │ │ Quick Links │ Brands      │ Newsletter    │  │ │
│  │  │  logo       │ │             │             │               │  │ │
│  │  │  tagline    │ │  link       │  link       │  subhead      │  │ │
│  │  │  address    │ │  link       │  link       │  email input  │  │ │
│  │  │  phone      │ │  link       │  link       │  subscribe    │  │ │
│  │  │  hours      │ │  link       │  link       │               │  │ │
│  │  │             │ ├─────────────┴─────────────┴───────────────┤  │ │
│  │  │ (rowspan 2) │ │                                           │  │ │
│  │  │             │ │   [ Google Maps embed — spans cols 2-4 ]  │  │ │
│  │  │             │ │                                           │  │ │
│  │  └─────────────┘ └───────────────────────────────────────────┘  │ │
│  │                                                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─ CREDIT BAR ───────────────────────────────────────────────────┐  │
│  │  © 2026 Reyco · Privacy · Terms          Powered by [GLV logo] │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

Heights balance by grid construction: Reyco col stretches to match (right-row-1 height + right-row-2 map height). No min-height hacks, no extracted strips.

---

## Design tokens (reuse — no new colors)

| Token | Hex | Usage |
|---|---|---|
| `brown` (footer bg) | **dev pulls from existing footer.php / theme CSS** | Footer bg — Aiden corrected: "its not a navy footer, its brown." Spec uses `bg-[brown]` placeholder; dev replaces with real hex (likely a warm saddle/dark-chocolate range). |
| `orange` | `#FEA94F` | Headings, hover-state link color, brand accents |
| `off-white` | `#F5F2ED` | Body text — warm cream pairs naturally with brown bg |
| `white/70` | `rgba(255,255,255,0.7)` | Muted text (copyright, secondary lines) |
| `white/20` | `rgba(255,255,255,0.2)` | Section dividers (subtle horizontal rules between strips) |

**Note for dev:** Use the brown as a Tailwind arbitrary value `bg-[#XXXXXX]` (matching pattern used elsewhere in Reyco theme), or wire as a theme-level CSS variable / Tailwind config token if one already exists for the footer bg. Keep consistent with current footer markup.

---

## 1. Grid-template-areas markup (v2 — replaces v1 4-col grid + map strip)

```html
<footer class="bg-[#1c1c19] text-[#F5F2ED]">
  <!-- GRID with template-areas: left col rowspan 2, right area = row 1 (3 cells) + row 2 (map spans 2-4) -->
  <div class="max-w-7xl mx-auto px-4 lg:px-8 pt-12 lg:pt-14 pb-8">
    <div
      class="
        grid gap-8 lg:gap-10
        grid-cols-1
        lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]
        lg:grid-rows-[auto_auto]
        lg:[grid-template-areas:'reyco_quicklinks_brands_newsletter''reyco_map_map_map']
      "
    >

      <!-- Reyco col (rowspan 2) -->
      <div class="lg:[grid-area:reyco] space-y-3">
        <a href="/" class="inline-block">
          <img src="/wp-content/themes/reyco/images/reyco-logo-white.svg" alt="Reyco Marine" class="h-10 w-auto" />
        </a>
        <p class="text-sm text-[#F5F2ED]/90 leading-relaxed">
          {{ tagline — current copy: "Sault Ste Marie's marine-first dealer. Boats, outdoor power equipment, and honest service year-round." }}
        </p>
        <ul class="space-y-1.5 text-sm pt-1">
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 shrink-0 text-[#FEA94F]" aria-hidden="true"><!-- IconMapPin --></svg>
            <span>11 White Oak Dr E<br />Sault Ste. Marie, ON</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0 text-[#FEA94F]" aria-hidden="true"><!-- IconPhone --></svg>
            <a href="tel:+17052537828" class="hover:text-[#FEA94F] transition-colors">(705) 253-7828</a>
          </li>
          <li class="flex items-start gap-2">
            <svg class="w-4 h-4 mt-0.5 shrink-0 text-[#FEA94F]" aria-hidden="true"><!-- IconClock --></svg>
            <span>Mon–Fri 8-5 · Sat 9-1</span>
          </li>
        </ul>
      </div>

      <!-- Quick Links (row 1, col 2) -->
      <div class="lg:[grid-area:quicklinks]">
        <h3 class="text-sm font-bold text-[#FEA94F] uppercase tracking-widest mb-4">Quick Links</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/boats-marine/" class="hover:text-[#FEA94F] transition-colors">Boats &amp; Marine</a></li>
          <li><a href="/lawn-garden/" class="hover:text-[#FEA94F] transition-colors">Lawn &amp; Garden</a></li>
          <li><a href="/snow-equipment/" class="hover:text-[#FEA94F] transition-colors">Snow Equipment</a></li>
          <li><a href="/service-parts/" class="hover:text-[#FEA94F] transition-colors">Service &amp; Parts</a></li>
          <li><a href="/financing/" class="hover:text-[#FEA94F] transition-colors">Financing</a></li>
          <li><a href="/contact/" class="hover:text-[#FEA94F] transition-colors">Contact Us</a></li>
          <li><a href="/blog/" class="hover:text-[#FEA94F] transition-colors">Blog</a></li>
        </ul>
      </div>

      <!-- Brands (row 1, col 3) -->
      <div class="lg:[grid-area:brands]">
        <h3 class="text-sm font-bold text-[#FEA94F] uppercase tracking-widest mb-4">Brands</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/brand/princecraft/" class="hover:text-[#FEA94F] transition-colors">Princecraft</a></li>
          <li><a href="/brand/mercury/" class="hover:text-[#FEA94F] transition-colors">Mercury Marine</a></li>
          <li><a href="/brand/cub-cadet/" class="hover:text-[#FEA94F] transition-colors">Cub Cadet</a></li>
          <li><a href="/brand/toro/" class="hover:text-[#FEA94F] transition-colors">Toro</a></li>
          <li><a href="/brand/humminbird/" class="hover:text-[#FEA94F] transition-colors">Humminbird</a></li>
        </ul>
      </div>

      <!-- Newsletter (row 1, col 4) -->
      <div class="lg:[grid-area:newsletter]">
        <h3 class="text-sm font-bold text-[#FEA94F] uppercase tracking-widest mb-4">Newsletter</h3>
        <p class="text-sm text-[#F5F2ED]/90 mb-3">
          Seasonal deals and maintenance tips. No spam.
        </p>
        <form class="space-y-2">
          <input
            type="email"
            placeholder="Your email"
            class="w-full px-3 py-2 text-sm text-neutral-900 bg-white border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FEA94F]"
          />
          <button
            type="submit"
            class="w-full px-3 py-2 text-sm font-semibold text-white bg-[#FEA94F] hover:bg-[#E89640] rounded-md transition-colors inline-flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" aria-hidden="true"><!-- IconSend --></svg>
            Subscribe
          </button>
        </form>
      </div>

      <!-- Map (row 2, spans cols 2-4) -->
      <div class="lg:[grid-area:map] rounded-lg overflow-hidden border border-white/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!...{Reyco location embed URL — copy from current footer.php}"
          class="w-full h-[200px] lg:h-full lg:min-h-[220px] border-0 block"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          title="Reyco Marine location map"
        ></iframe>
      </div>

    </div>
  </div>

  <!-- ... credit bar below — see Section 3 ... -->
</footer>
```

**Layout mechanics:**
- `lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]` — Reyco + Newsletter cols slightly wider (1.2fr) since they have more content (logo+address vs short link lists; form inputs vs link items). Quick Links + Brands at 1fr.
- `lg:[grid-template-areas:...]` — explicit named cells. Reyco spans both rows ("reyco" appears in both row strings); map spans cols 2-4 in row 2 ("map_map_map").
- Mobile: `grid-cols-1` collapses everything to a single stack; areas reset to default flow because `lg:` prefix is breakpoint-gated (mobile = no template-areas, just stack).
- `lg:h-full lg:min-h-[220px]` on the map iframe — fills the row 2 height (which auto-sizes), with 220px floor so it doesn't collapse if right-row-1 is unusually tall.
- `gap-8 lg:gap-10` — same gap between rows AND columns; map's top edge sits a clean 40px below the link/form lists.

**Spacing rationale (carries from v1):**
- `pt-12 lg:pt-14 pb-8` — tighter than original py-16+; pulls content against credit bar
- `space-y-3` in Reyco col, `space-y-2` in link lists, `mb-4` on headings — all preserved from v1

**Why orange headings:**
- Orange-on-#1c1c19 = ~9:1 (AAA, well above threshold)
- Echoes brand accent across site
- Anchors each column visually
- Warm-on-warm pairing suits Reyco's leather/marine palette

---

## 3. Bottom credit bar (v2 — Powered by + larger clickable logo)

```html
<!-- CREDIT BAR -->
<div class="border-t border-white/10">
  <div class="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">

    <!-- Left: copyright + privacy + terms -->
    <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
      <p>© 2026 Reyco Marine &amp; Small Engine Ltd. All rights reserved.</p>
      <a href="/privacy-policy/" class="hover:text-[#FEA94F] transition-colors">Privacy Policy</a>
      <a href="/terms-of-service/" class="hover:text-[#FEA94F] transition-colors">Terms of Service</a>
    </div>

    <!-- Right: Powered by GLV — whole group is one anchor -->
    <a
      href="https://glvmarketing.ca"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 hover:opacity-80 transition-opacity group"
      aria-label="Powered by GLV Marketing — visit glvmarketing.ca"
    >
      <span class="text-sm">Powered by</span>
      <!-- GLV LOGO SLOT — PNG checked first (current asset), SVG checked second (future preferred), text fallback last -->
      <?php if (file_exists(get_template_directory() . '/images/glv-marketing-footer-logo-white.png')) : ?>
        <img src="<?= get_template_directory_uri() ?>/images/glv-marketing-footer-logo-white.png" alt="GLV Marketing" class="h-7 w-auto" />
      <?php elseif (file_exists(get_template_directory() . '/images/glv-marketing-footer-logo-white.svg')) : ?>
        <img src="<?= get_template_directory_uri() ?>/images/glv-marketing-footer-logo-white.svg" alt="GLV Marketing" class="h-7 w-auto" />
      <?php else : ?>
        <span class="font-bold text-[#FEA94F] text-base">GLV Marketing</span>
      <?php endif; ?>
    </a>

  </div>
</div>
```

**v2 changes vs. v1:**

| Element | v1 | v2 | Why |
|---|---|---|---|
| Logo size | `h-5` (20px) | `h-7` (28px) | Aiden: "needs to be a little bit bigger" — h-7 is a 40% bump that reads from across the page without dominating |
| Copy | "Built by" | "Powered by" | Aiden's exact wording change |
| Link wrap | Logo only | Whole "Powered by [logo]" group | Aiden: "make it clickable to the GLV Marketing website as well" — single `<a>` covers text + logo |
| "Powered by" text size | n/a (was outside `<a>`) | `text-sm` (vs surrounding `text-xs`) | Slightly larger than copyright text so the credit reads as deliberate, not vestigial |
| Privacy/Terms | not specced | preserved (already in deployed footer per screenshot) | Don't strip existing functional links |
| Border | `border-white/20` | `border-white/10` | Lighter divider; less visible separator on the dark bg now that credit reads as more substantive |
| Padding | `py-5` | `py-4` | Tightens further; v2 credit bar is taller (h-7 logo) so reduces outer padding to balance overall height |

**aria-label on the wrapping anchor:** "Powered by GLV Marketing — visit glvmarketing.ca" gives screen readers a complete action description (the inline text + image alt would be redundant; aria-label takes precedence).

**Hover behavior:** `hover:opacity-80` applies to the whole anchor (text + image dim together). `transition-opacity` smooths it. `group` is on the anchor for future hover-state extensions if needed (e.g. underline the "Powered by" text on hover).

### GLV logo asset (preserved from v1 — already deployed)

- **Staged file:** `orgs/glv/clients/reyco/deliverables/assets/glv-marketing-footer-logo-white.png` (boss-processed via ImageMagick from Aiden's grey-on-white JPEG → white-on-transparent PNG)
- **Deploy target:** `/wp-content/themes/reyco/images/glv-marketing-footer-logo-white.png`
- **Status:** committed in branch `feat/footer-cleanup` per dev (commit 0c29f50, deployed in 27bca7f). Reused in v2 — no new asset needed.
- **Future SVG swap:** drop SVG at same path with `.svg` extension; PHP conditional in markup above prefers SVG when both exist.
- **JPEG remains unsupported** — no alpha channel = white rectangle on dark bg.

---

## 4. Mobile (≤1024px — `lg:` breakpoint)

### Grid-template-areas collapse

The `lg:` prefix on `grid-cols-[...]`, `grid-rows-[...]`, and `[grid-template-areas:...]` means **mobile + tablet skip the template-areas entirely** and fall through to the base `grid-cols-1` (single-column stack). Stack order = source order:
1. Reyco col (logo + tagline + address)
2. Quick Links
3. Brands
4. Newsletter
5. Map (last in source — anchors the bottom of the footer)

This stack order is intentional: the map naturally lands at the bottom on mobile, where it's the visual close to the footer block before the credit bar.

**Mobile-specific tightening:**
- `pt-10 pb-6` mobile override (vs `pt-12 lg:pt-14 pb-8` desktop) — recommended for tighter mobile feel
- Map iframe: `h-[200px]` on mobile (overridden to `h-full lg:min-h-[220px]` at lg breakpoint) — proof-of-place worth the screen real estate

### Credit bar on mobile

`flex-col sm:flex-row` — stacks vertically on mobile:
- Row 1: copyright + Privacy + Terms (wrapping flex with gap, center-aligned)
- Row 2: "Powered by [GLV logo]" centered

`items-center` keeps both rows visually balanced. Logo h-7 stays the same on mobile (28px is fine — readable but not dominant).

---

## 5. Accessibility

- All anchors have descriptive text or alt
- Iframe has `title="Reyco Marine location map"`

### Color contrast — verify against actual brown hex once dev pulls it

The brown bg hex hasn't been confirmed in this spec (dev will pull from the live theme). Below are expected contrast bands across a typical Reyco-warm brown range — dev or designer (me) verifies once the actual hex is in hand.

| Foreground | vs `#3E2723` (dark choc) | vs `#5D3A1E` (saddle) | vs `#6B4423` (warm) | vs `#8B5A2B` (light brown) |
|---|---|---|---|---|
| `#F5F2ED` off-white body | ~14.0:1 (AAA) | ~10.5:1 (AAA) | ~7.5:1 (AAA) | ~5.0:1 (AAA large / AA normal) |
| `#FEA94F` orange heading | ~6.5:1 (AAA large / AA normal) | ~5.0:1 (AA all) | ~3.7:1 (AA large only) | ~2.5:1 (FAIL) |
| White/70 credit bar | ~10.0:1 (AAA) | ~7.5:1 (AAA) | ~5.5:1 (AA) | ~3.7:1 (AA large) |

**Likely outcome:** Reyco's footer brown sits in the dark-saddle to mid-brown range (visual estimate from Aiden's correction tone — "warm brown" not "tan"). Orange-on-brown should pass AA for headings (large text); body off-white should pass AAA comfortably.

**Risk to flag:** if the actual brown turns out to be on the lighter side (e.g. `#8B5A2B+`), orange headings may dip below AA. **Mitigation if that happens:** bump heading color to off-white `#F5F2ED` (passes AAA on any reasonable brown) and keep orange only as link-hover accent. I'll re-verify once dev confirms the hex.

- Focus rings on email input + Subscribe button (orange ring) — verify against actual brown via QC pass
- Hover states on all links (orange transition) — same

---

## 6. What I am NOT changing

- Newsletter form behavior / submission target (assume existing handler)
- Brand list contents (using known authorized dealer set; web-copy can prune/add)
- Quick Links target URLs (assume existing routes)
- Tagline / hours / address content (web-copy ships final wording)
- The fact that we have a footer at all (vs e.g. minimizing to a single-line bar)

---

## 7. What dev needs to confirm

1. **Footer brown bg hex:** pull from existing `footer.php` / theme stylesheet. Replace all `bg-[brown]` placeholders in this spec with the real value. Post the hex back so I can finalize contrast verification.
2. **Reyco logo file:** is `reyco-logo-white.svg` (or equivalent) present in theme images? If not, current footer logo path is the source of truth — keep that file.
3. **Tagline / hours / address:** copy these from current footer markup; web-copy iterates if needed.
4. **Quick Links + Brands lists:** verify against current footer (I've used common-sense defaults; final list should match site IA).
5. **Newsletter form action:** existing handler URL + any required hidden fields (e.g. CSRF token, list ID for Mailchimp/etc.).
6. **Map embed src:** copy current iframe src from existing footer — same Reyco location embed.
7. **GLV logo file (READY):** copy `orgs/glv/clients/reyco/deliverables/assets/glv-marketing-footer-logo-white.png` (boss-processed, white-on-transparent, verified on brown bg) into the theme at `/wp-content/themes/reyco/images/glv-marketing-footer-logo-white.png`. PHP conditional in spec already handles this path. **Do NOT accept JPEG** if a future swap is attempted — JPEG has no transparency and will render as a white rectangle on the brown footer.

---

## 8. Coordination

- **Web-copy:** owns tagline, newsletter subhead, hours line wording. None block deploy (placeholders ship with reasonable defaults).
- **Dev:** template-level change to `footer.php` (or equivalent). Single deploy ships fleet-wide.
- **Aiden:** GLV logo asset (transparent PNG) ALREADY processed by boss + staged at `orgs/glv/clients/reyco/deliverables/assets/glv-marketing-footer-logo-white.png`. No further action unless he ships an SVG version later (template will auto-prefer SVG via the conditional ordering).
- **Designer (me):** QC pass via dev capture or non-headless CDP after deploy. Verify: (a) 4 columns equal-height, (b) map strip reads as deliberate not orphaned, (c) tighter overall rhythm matches Aiden's "needs to be tighter" ask, (d) GLV logo renders crisp on brown (no white halo, no JPEG-like edge), (e) orange-on-brown contrast verified against actual hex.

---

## 9. Implementation order (v2)

Building on already-shipped v1 (commit 27bca7f). Most v1 markup carries forward; only the grid wrapper + credit bar need restructuring.

1. **Restructure grid wrapper** — replace v1's `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` with v2's `grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:grid-rows-[auto_auto] lg:[grid-template-areas:'reyco_quicklinks_brands_newsletter''reyco_map_map_map']` (5 min)
2. **Add `lg:[grid-area:NAME]` classes to each col + map div** (5 min)
3. **Move map iframe** from v1 full-width strip → into the grid as the 5th cell (`lg:[grid-area:map]`); update iframe height classes to `h-[200px] lg:h-full lg:min-h-[220px]` (5 min)
4. **Delete v1's separate map strip wrapper** (2 min)
5. **Update credit bar:**
   - Wrap "Powered by [logo]" in single `<a>` (vs v1's logo-only anchor)
   - Bump logo `h-5` → `h-7`
   - Change "Built by" → "Powered by"
   - Keep Privacy Policy + Terms of Service links (already in deployed footer)
   - Add `aria-label` to the new outer anchor
   (8 min)
6. **Mobile sanity check** at 390px — confirm grid-areas don't leak via `lg:` breakpoint, stack order is Reyco → links → newsletter → map (3 min)
7. **Designer QC pass** — verify (a) no whitespace gap below right cols, (b) map fills row 2 to match left col height, (c) credit bar reads as deliberate not vestigial, (d) Powered by anchor is clickable on full text+logo group (5 min)

**Total dev time: ~30 min.** No new assets, no new branch — apply on `feat/footer-cleanup` (or `feat/footer-v2`, dev's call).

---

## 10. Summary of fixes vs. complaint (v2)

| Aiden's complaint (v1 verdict) | v2 fix |
|---|---|
| "doesn't look much better than what we had before" | Categorical layout change (grid-areas, not just relayout) — left col + right area equal-height by construction, no whitespace gaps, no orphaned strips |
| "the map could be under the brands and newsletter places" | Map moved INTO grid, row 2, spans cols 2-4 (under Quick Links / Brands / Newsletter) |
| "gets rid of that entire section there" | Full-width map strip eliminated; it's now a grid cell, no separate section |
| "Built by GLV Marketing needs to be a little bit bigger" | Logo `h-5` → `h-7` (40% bump); "Powered by" text bumped to `text-sm` from credit bar's base `text-xs` |
| "Make the copy 'powered by'" | Copy changed: "Built by" → "Powered by" |
| "make it clickable to the GLV Marketing website as well" | Whole "Powered by [logo]" group wraps in single `<a>` (vs v1's logo-only); aria-label gives screen readers full action description |

### v1 fixes that carry forward into v2

| v1 win | v2 status |
|---|---|
| Tighter padding (pt-12 lg:pt-14 pb-8) | ✓ Preserved |
| Orange section headings on brown bg | ✓ Preserved |
| Map height cap (200-240px) | ✓ Preserved (now 220px min, full-height in grid row) |
| GLV logo PHP conditional + staged transparent PNG | ✓ Preserved (PNG asset reused, conditional unchanged) |
| Address/phone/hours block tightened (`space-y-3`) | ✓ Preserved |
| Privacy Policy + Terms of Service links in credit bar | ✓ Preserved (caught from screenshot — was already in deployed footer) |
