# Related Services Section — 6th Tile (Orange CTA) Spec

**Date:** 2026-04-25
**Scope:** TEMPLATE-LEVEL fix — applies to ALL Reyco service pages with the Related Services section
**Current state:** 3-col grid with 5 tiles (Tune-Ups, Marine Service, Lawn Equipment, Snow Equipment, Warranty Claims) — 1 awkward empty slot bottom-right
**Decision:** Option A — fill 6th slot with an **orange CTA tile** (per boss lean + my agreement)
**Boss dispatch:** msg 1777159899471-boss-qkykn

---

## Why orange CTA tile (not asymmetric layout)

Three reasons:

1. **6 always ≥ 5.** A static 6-tile grid handles the count without grid-asymmetry edge cases. Asymmetric layouts (centered 5-strip, merged-wide tile, auto-fit) introduce per-page logic, multiple breakpoints, and inconsistency across service pages. Orange CTA is one consistent template change.

2. **Orange-vs-navy contrast IS the affordance.** The other 5 tiles are navy-icon-on-white "another service you might need." The orange tile is "primary action — talk to us." Color difference signals action-class difference; the user doesn't have to read it to know it's different.

3. **Conversion escape hatch on every service page.** A guaranteed CTA below the related-services section means no service page leaves the user without a way to act. This is a free conversion lift even when the section's primary purpose (cross-sell to other services) doesn't fire.

---

## Design tokens (reuse — no new colors)

| Token | Hex | Usage |
|---|---|---|
| `orange` | `#FEA94F` | Tile bg (matches confirmed Reyco theme orange — same as form-redesign Submit button) |
| `orange-hover` | `#E89640` | Tile hover bg (slightly darker; if no theme token exists, use `#FEA94F` + opacity 90%) |
| `white` | `#FFFFFF` | Tile text + icon |
| `white/90` | `rgba(255,255,255,0.9)` | Subhead/description text on orange tile |
| `navy` | `#1B3A5C` | NOT used in this tile — reserved for the other 5 |
| `off-white` | `#F5F2ED` | Section bg (unchanged — matches existing template) |

---

## Tile structure — match the existing 5-tile shell

The orange tile MUST share the same:
- Border radius (rounded-xl per existing template)
- Padding (p-6 lg:p-8)
- Aspect / min-height
- Hover lift effect
- Icon-left → heading → arrow-right reading pattern

ONLY differences from the navy-icon tiles:
- bg color: orange (vs white)
- Text color: white (vs navy)
- Icon: white (vs navy)
- No subhead body copy (CTA is shorter than service descriptions)

### Tailwind sketch

```html
<a
  href="/contact/"
  class="group flex items-center justify-between gap-4 bg-[#FEA94F] hover:bg-[#E89640] rounded-xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-200"
>
  <div class="flex items-center gap-4 min-w-0">
    <div class="shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-white/20 flex items-center justify-center">
      <!-- IconPhone or IconMessageCircle, white, size 24-28 -->
      <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" ...></svg>
    </div>
    <div class="min-w-0">
      <h3 class="text-lg lg:text-xl font-bold text-white leading-tight">
        Contact Us
      </h3>
      <p class="text-sm text-white/90 mt-0.5 hidden lg:block">
        Talk to a tech today
      </p>
    </div>
  </div>
  <svg class="shrink-0 w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" ...><!-- IconArrowRight --></svg>
</a>
```

**Notes:**
- `group` + `group-hover:translate-x-1` on the arrow gives a subtle "press into action" micro-interaction matching the other tiles' hover behavior.
- Icon container `bg-white/20` gives the icon a soft circular backdrop that reads as deliberate (vs floating icon) and improves contrast against the orange tile bg.
- Subhead `hidden lg:block` keeps the mobile tile compact (heading-only) while desktop gets the supporting line.
- `shadow-sm hover:shadow-md` matches the other 5 tiles' elevation behavior.

---

## Tile placement — 6th (last) position

ALWAYS the last tile in the grid, regardless of how many service tiles precede it. Reading order:

```
[Service 1] [Service 2] [Service 3]
[Service 4] [Service 5] [ORANGE CTA]
```

Why last:
- **Scan order matches conversion intent**: user reads available services first, then sees the action prompt. Putting it first competes with primary nav.
- **Dead-slot fix**: the empty slot was always bottom-right; orange CTA fills exactly that visual void.
- **Mobile preserves intent**: in 1-col stack, CTA stays at the bottom — final action prompt before the user scrolls past the section.

---

## Mobile (≤640px)

Single column stack — same as existing 5 tiles collapse behavior. Orange tile inherits:
- Full-width
- Same p-6 padding
- Subhead description: `hidden lg:block` keeps mobile to heading-only (less visual weight, faster scan)
- Tile remains last in the stack

**Read-test on mobile:** orange tile in a vertical stack of white tiles is HIGHLY visible — works in our favor. No additional mobile-specific styling needed.

---

## Hover/focus states

| State | Treatment |
|---|---|
| Default | bg-[#FEA94F], shadow-sm |
| Hover | bg-[#E89640] (or `bg-[#FEA94F]/90` if no token), shadow-md, arrow translate-x-1, slight tile lift via shadow change |
| Focus (keyboard) | Visible focus ring: `focus:ring-2 focus:ring-[#FEA94F] focus:ring-offset-2 focus:outline-none` |
| Active (pressed) | Default-ish; matches button:active scale (existing global rule) if applied to anchor |

Focus ring uses the orange itself with `ring-offset-2` so the ring sits OUTSIDE the orange tile (not blending into it). On the off-white section bg, this reads cleanly.

---

## Accessibility

- Anchor (`<a>`), not button — this is navigation to /contact/, not a JS action
- Heading is real `<h3>` matching the other 5 tiles' heading hierarchy (don't skip levels)
- Icon has `aria-hidden="true"` (decorative — heading text "Contact Us" carries the meaning)
- Arrow icon has `aria-hidden="true"` (purely visual affordance)
- Color contrast:
  - White (#FFFFFF) on orange (#FEA94F) = ~3.7:1 — passes WCAG AA for **large text** (18pt+ or 14pt+ bold). Heading is `text-lg lg:text-xl font-bold` → passes.
  - White/90 (subhead) on orange = ~3.4:1 — borderline. Subhead is `text-sm` (14pt regular) which technically needs 4.5:1. **Mitigation:** subhead is `hidden lg:block` so only desktop shows it; if AA-strict required, bump to `text-white` (full opacity, 3.7:1, still borderline at 14pt). **Recommended:** keep subhead concise + bold (`font-medium`) so it sits closer to the bold-text contrast bar. OR drop subhead entirely (heading-only matches mobile).

**Recommendation:** drop the subhead entirely (mobile + desktop both heading-only). Reasons: (a) clears the contrast risk, (b) matches the simplicity of the other 5 tiles which lead with heading + icon (descriptions are below the heading in service tiles, but heading carries the action intent here), (c) reduces visual weight so the tile reads as "action button shaped like a tile" not "another card to read."

Updated anchor sketch (no subhead):

```html
<a href="/contact/" class="group flex items-center justify-between gap-4 bg-[#FEA94F] hover:bg-[#E89640] rounded-xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FEA94F] focus:ring-offset-2">
  <div class="flex items-center gap-4 min-w-0">
    <div class="shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-white/20 flex items-center justify-center">
      <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white" aria-hidden="true">...</svg>
    </div>
    <h3 class="text-xl lg:text-2xl font-bold text-white leading-tight">
      Contact Us
    </h3>
  </div>
  <svg class="shrink-0 w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">...</svg>
</a>
```

Heading bumped to `text-xl lg:text-2xl` to match the implied weight of the other tiles' heading + description block (single bigger heading balances the visual weight of icon-left + description on the navy tiles).

---

## Icon recommendation

For "Contact Us" — pick from existing Reyco icon set if a phone/message icon already exists. Defaults if no theme set:
- Lucide: `Phone` or `MessageCircle` or `Send`
- Tabler: `IconPhone` or `IconMessageCircle` or `IconArrowUpRight`

**Recommendation:** `Phone` icon. Reyco's primary CTA across the site is "Call" not "Email" (per existing hero CTAs). Visual continuity with site-wide phone-CTA pattern. If web-copy ships a different verb (e.g. "Get a Quote," "Book Service"), swap icon accordingly:
- "Contact Us" → Phone
- "Get a Quote" → FileText / ClipboardList
- "Book Service" → Calendar / CalendarPlus

---

## Heading copy options for web-copy

Defer final wording to web-copy, but seeding options ranked by action-intent strength:

1. **"Contact Us"** — neutral, safe, matches site nav language
2. **"Talk to a Tech"** — warmer, signals expertise (matches Reyco service-page voice)
3. **"Get a Quote"** — high-intent, conversion-optimized
4. **"Book a Service Call"** — most specific, but only if booking modal isn't suppressed on the page in question

Recommend "Talk to a Tech" or "Contact Us" — both work template-wide regardless of which service page renders the section. Web-copy owns the final call.

---

## Dev confirmation items

1. **Orange theme token:** `#FEA94F` confirmed as the Reyco orange (matched via order-parts form Submit button, dev-resolved 6bb9243). Pull from theme CSS var if defined, else hardcode.
2. **Hover orange:** `#E89640` is my read; if Tailwind config has an orange-darker token, use it. Fallback: `bg-[#FEA94F]/90`.
3. **Tile shell template path:** spec assumes the existing related-services tile is a reusable WP template part / Twig/PHP partial. Add the orange tile as a new variant of that partial OR hardcode in the section template — dev's call based on theme structure.
4. **Number of tiles handling:** if a future service page only renders 3 services (not 5), orange CTA should still be the last tile (so 4 total in row 1, 1 empty in row 2 — wait, that recreates the empty slot). Recommend: orange CTA always renders, and tile-count math handles overflow:
   - 1-2 services + CTA = 3 tiles, single row
   - 3-5 services + CTA = next row gets fewer tiles + CTA last
   - 6+ services + CTA = grid grows, CTA always last
   
   For Reyco's current 5-service template, this gives a clean 6-tile 3-col grid (2 rows). Future-proof: dev can wire CTA as `services.length + 1`-th tile in the grid loop.

5. **Link target:** `/contact/` confirmed as Reyco's contact route? If WP custom post type or different slug (e.g. `/contact-us/`), web-copy or dev confirms.

---

## What I am NOT changing

- The 5 navy-icon service tiles — their style, copy, layout, hover all stay
- Section header / subhead above the grid (if any) — unchanged
- Section background color (off-white) — unchanged
- Grid breakpoints — unchanged (3-col desktop, 1-col mobile via existing template)

---

## Implementation order suggestion

1. Add new tile variant to template partial (5 min)
2. Apply Tailwind classes per spec (3 min)
3. Wire as `services.length + 1`-th render in grid loop (5 min)
4. Mobile sanity check at 390px (2 min)
5. Designer (me) re-verifies via dev capture or non-headless CDP

**Total dev time: ~15 min.** Web-copy iterates final CTA wording in parallel.

---

## Coordination

- **Web-copy:** owns final CTA heading text. My recommendation: "Talk to a Tech" or "Contact Us." Confirm by EOD or default to "Contact Us."
- **Dev:** template change applies to all service pages — single deploy ships fleet-wide. Verify all 5 current service pages render correctly after deploy.
- **Designer (me):** QC pass via dev capture once shipped. Verify orange contrast looks right in actual page context (not just in spec).
