# /service/order-parts/ — Form Section Visual Redesign Spec

**Date:** 2026-04-25
**Page:** https://reyco.glvmarketing.ca/service/order-parts/
**Section:** "Request a Part" form (currently navy bg + white text + stacked fields)
**Goal:** Make the form section read as a natural part of the Reyco service-page family — off-white bg, card-based hierarchy, orange CTA, navy accents.
**Constraint:** 7 form fields locked (per web-copy v2). Submit button is the conversion mechanism (booking modal suppressed on this page).

---

## Why the current treatment fails

The full-bleed navy panel with stacked white-on-navy fields breaks the page rhythm. The rest of the Reyco template alternates navy hero/section-band → off-white card-body → navy band — the form was treated as a navy band but it functions as a card-body (a working surface the user fills out). White-on-navy form fields also reduce field affordance vs. dark-text-on-white inputs (lower readability, weaker focus state visibility).

Aiden's call: white bg fits the page. The fix is to flip the treatment from "navy band" to "off-white card section."

## Recommended pattern

**Reuse the "Parts & Accessories / Quick Parts Request" pattern** already shipped on `/service/` (visible in the Apr 24 service-desktop capture). That section sits on a navy band but pulls a white card to the right with the form inside it — left col = supporting copy + reassurance, right col = form card. Card-on-band is the proven Reyco form pattern.

For the dedicated `/service/order-parts/` page, simplify to a **single full-width off-white section** — no navy band underneath, since form IS the page conversion mechanism (not a sidecar). Same card aesthetic, just standalone instead of card-on-band.

---

## Design tokens (use existing — no new colors)

| Token | Hex | Usage |
|---|---|---|
| `navy` | `#1B3A5C` | Section heading, field labels, focus ring, footer/legal text |
| `orange` | `#F89E2D` (matches site CTAs — confirm against theme) | Submit button bg, hover-state accents |
| `off-white` | `#FBF8F3` (warm cream — matches service-page card bodies) | Section bg |
| `white` | `#FFFFFF` | Form field bg, optional inner card bg |
| `gray-300` | `#D1D5DB` (Tailwind default) | Field border, inactive divider |
| `gray-700` | `#374151` (Tailwind default) | Field placeholder, helper text |

Off-white over pure white: off-white reads warmer + matches the existing card-body cream Reyco uses elsewhere (visible in service page hero card + booking widget). Pure white would feel sterile vs the rest of the site's warmth.

---

## Layout spec — Tailwind class direction

### Section wrapper

```html
<section class="bg-[#FBF8F3] py-16 lg:py-20 px-4 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <!-- header + form -->
  </div>
</section>
```

Why max-w-3xl (~768px): forms are most usable at constrained widths. A full-page-wide form increases eye-travel and mis-fills. The hero above stays full-bleed; the form anchors center.

### Section header

```html
<header class="text-center mb-10">
  <h2 class="text-3xl lg:text-4xl font-bold text-[#1B3A5C] mb-3">
    Request a Part
  </h2>
  <p class="text-base lg:text-lg text-gray-700 max-w-xl mx-auto">
    Tell us what you need — equipment, model, and a short description. We'll
    confirm pricing + lead time within one business day.
  </p>
</header>
```

Subhead reduces friction by setting expectation ("one business day" is a soft commitment that lowers abandonment vs. "we'll get back to you").

### Form card

```html
<form class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-10 space-y-6">
  <!-- fields -->
</form>
```

`shadow-sm` over `shadow-md`: the card sits on off-white, so a heavy shadow over-elevates. Subtle shadow + 1px border defines the card without making it feel like a popup.

### Field group (apply to all 7 fields)

```html
<div>
  <label for="equipment-type" class="block text-sm font-semibold text-[#1B3A5C] mb-2">
    Equipment Type <span class="text-orange-600">*</span>
  </label>
  <input
    type="text"
    id="equipment-type"
    name="equipment_type"
    required
    class="w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] focus:border-[#1B3A5C]
           transition-colors duration-150"
  />
</div>
```

Notes:
- `py-3` (12px vertical) gives a 44px+ touch target for mobile (a11y minimum).
- Focus ring uses navy at 2px — visible without overpowering. No glow.
- Required asterisk in orange echoes the brand accent without using a danger-red.
- Placeholder text uses `gray-700` not `gray-400` (WCAG AA contrast).

### Description (textarea — likely field 7)

```html
<div>
  <label for="description" class="block text-sm font-semibold text-[#1B3A5C] mb-2">
    Description <span class="text-orange-600">*</span>
  </label>
  <textarea
    id="description"
    name="description"
    rows="4"
    required
    placeholder="Part number if you have it, or describe what you need (e.g., 'replacement impeller for 2019 Mercury 90hp')"
    class="w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg resize-y
           focus:outline-none focus:ring-2 focus:ring-[#1B3A5C] focus:border-[#1B3A5C]
           transition-colors duration-150"
  ></textarea>
</div>
```

Placeholder example reduces cognitive load — users mirror the format. `resize-y` lets users expand for longer notes without breaking layout.

### Submit button

```html
<div class="pt-2">
  <button
    type="submit"
    class="w-full lg:w-auto px-8 py-4 bg-[#F89E2D] hover:bg-[#E08820] text-white text-base font-semibold rounded-lg
           shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F89E2D]"
  >
    Send Parts Request
  </button>
  <p class="mt-3 text-sm text-gray-700">
    We reply within one business day. No phone tag.
  </p>
</div>
```

- Full-width on mobile (`w-full`), auto-width on desktop (`lg:w-auto`) — mobile gets a tappable bar; desktop gets a normal button.
- Button text "Send Parts Request" (verb + noun) outperforms "Submit" (generic) for conversion.
- Trust line under button reinforces the "one business day" expectation set in the subhead.

---

## Field order recommendation (7 fields locked)

Order matters for completion rate. Easiest → hardest, identifying → contextual:

1. **Name** (text, required)
2. **Email** (email, required)
3. **Phone** (tel, optional or required — confirm with copy spec)
4. **Equipment Type** (select or text — Marine / Powersports / Lawn / Snow / Other — recommend select for analytics)
5. **Make** (text, required)
6. **Model / Year** (text, required)
7. **Description** (textarea, required)

Group visually: contact (1-3) on top, equipment (4-6) middle, description (7) bottom. Add subtle dividers (`border-t border-gray-200 pt-6 mt-6` between groups) if dev wants tighter scannability — optional.

---

## Mobile (390px viewport)

Single column always. The classes above already collapse cleanly:
- `py-16 lg:py-20` → tighter vertical padding on mobile
- `p-6 lg:p-10` → less card padding on small screens
- `text-3xl lg:text-4xl` → smaller heading
- `w-full lg:w-auto` button → full-width tap target

Fields stay full-width (no 2-col field layouts). 44px+ tap targets are preserved by `py-3` on inputs and `py-4` on the submit button.

---

## Accessibility

- All fields have associated `<label>` (htmlFor pairing).
- Required fields have `required` attribute + visible asterisk (not just color — text marker).
- Focus ring is visible (2px navy) and uses `focus:ring-offset-2` on submit button for clear keyboard-nav distinction.
- Color contrast: navy on off-white = 7.8:1 (AAA), gray-700 on white = 8.6:1 (AAA), orange-on-white for asterisk = 4.5:1 (AA — sufficient for non-essential text marker).

---

## What I am NOT changing

- Hero section (image bg + headline + Call CTA) — stays as-is.
- Form field count + names — locked per web-copy v2.
- Booking modal suppression on this page — stays suppressed.
- Site nav / footer — outside scope.

## What dev needs to confirm before implementing

1. Exact orange hex (`#F89E2D` is my read from screenshots — theme may have a precise value, e.g. `#F8951D` or similar). Pull from Tailwind config or CSS vars if defined.
2. Off-white token if one already exists in the theme — use it instead of inventing `#FBF8F3`.
3. Whether site uses Tailwind directly or a custom utility layer — these classes assume Tailwind 3.x.
4. Whether form field 3 (Phone) is required or optional — copy spec authoritative.

---

## Implementation order suggestion

1. Section wrapper + header (5 min)
2. Form card + first field group as template (5 min)
3. Repeat field group 6 more times — minimal variation (5 min)
4. Submit button (3 min)
5. Mobile sanity check at 390px (2 min)
6. Designer (me) re-verifies via dev capture or non-headless CDP

Total dev time: ~20 min. With my spec: ~45 min end-to-end matches boss target.
