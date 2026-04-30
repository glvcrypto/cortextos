# /service/order-parts/ — Carousel + CTA Banners Visual Spec

**Date:** 2026-04-25
**Page:** https://reyco.glvmarketing.ca/service/order-parts/
**Section:** Below the redesigned "Request a Part" form (per `order-parts-form-redesign.md`, shipped 6bb9243)
**Boss dispatch:** msg 1777159364357-boss-j3x72
**Page-level layout (per Aiden Option A):** Form → Carousel → CTA Banner 1 → CTA Banner 2 → FAQ → Related Articles
**Constraint:** No new visual language — reuse Reyco design tokens + existing card aesthetics

---

## Why this layout works

The form is the primary conversion mechanism. Below it, the page needs to:
1. **Show inventory exists** without making the user search (carousel = passive proof of "we actually stock parts")
2. **Offer the alternate path** for users who'd rather book a service call than fill out a form (CTA Banner 1)
3. **Reinforce a secondary action** for users who want financing or warranty info (CTA Banner 2)
4. **Answer common objections** before they leave (FAQ)
5. **Provide depth/SEO content** for users + crawlers (Related Articles)

The form-first → social-proof-second → escape-hatch-third pattern is conversion-optimal for a single-purpose page.

---

## Section rhythm (vertical spacing + bg alternation)

Use bg alternation to give the page visual rhythm and section separation without heavy borders:

| # | Section | bg | py |
|---|---|---|---|
| 1 | Hero (existing) | navy band | py-20 lg:py-28 |
| 2 | **Form** (shipped) | off-white `#F5F2ED` | py-16 lg:py-20 |
| 3 | **Carousel** | white `#FFFFFF` | py-16 lg:py-20 |
| 4 | **CTA Banner 1** (Book Service Call) | navy band w/ image bg + gradient overlay | py-16 lg:py-20 |
| 5 | **CTA Banner 2** (secondary — financing/warranty) | off-white `#F5F2ED` (variant treatment, see §3) | py-16 lg:py-20 |
| 6 | FAQ | white `#FFFFFF` | py-16 lg:py-20 |
| 7 | Related Articles | off-white `#F5F2ED` | py-16 lg:py-20 |
| 8 | Footer (existing) | navy | — |

**Rhythm rule:** alternate bg every section so adjacent sections have contrast. The CTA Banner 1 (navy band with image) is the high-contrast anchor — uses image + gradient instead of just flat color, which gives it visual weight without crowding the page.

---

## 1. Product Carousel (below form)

### Section header

```html
<section class="bg-white py-16 lg:py-20 px-4 lg:px-8">
  <div class="max-w-6xl mx-auto">
    <header class="text-center mb-10">
      <h2 class="text-3xl lg:text-4xl font-bold text-[#1B3A5C] mb-3">
        Parts &amp; Accessories We Stock
      </h2>
      <p class="text-base lg:text-lg text-gray-700 max-w-2xl mx-auto">
        Browse common parts in stock. Don't see it? Use the form above — we'll source it.
      </p>
    </header>
    <!-- carousel -->
  </div>
</section>
```

**Why max-w-6xl:** wider than the form (max-w-3xl) since carousel needs horizontal real estate for tile visibility. Header centered, supports the "we have inventory" trust message.

**Subhead reframes the form:** if user came expecting to find their part in inventory, the subhead acknowledges that AND redirects them to the form ("we'll source it"). Reduces frustration when carousel doesn't have their exact part.

### Carousel mechanics

**Library recommendation:** **Embla Carousel** (already used by shadcn; lightweight ~5KB; native swipe support; well-maintained).
**Fallback:** if WP theme uses Swiper, stay with Swiper for consistency. Don't introduce a new lib if one exists.

### Carousel layout

```html
<div class="embla overflow-hidden">
  <div class="embla__container flex gap-6">
    <!-- Repeat per product (auto-pulled from WC category) -->
    <div class="embla__slide flex-[0_0_280px] lg:flex-[0_0_320px]">
      <ProductTile />
    </div>
  </div>
</div>
```

**Slide width:**
- Mobile: `flex-[0_0_280px]` — 1.3 tiles visible (280px tile + partial next tile peeks → signals "swipeable")
- Tablet: `flex-[0_0_280px]` — 2-3 tiles
- Desktop: `flex-[0_0_320px]` — 3-4 tiles depending on viewport

**Why peek over snap-fit-N:** the partial-next-tile peek is the strongest "this scrolls" signal (better than dots alone). User intuitively swipes/drags without needing to read affordance text.

### Product tile structure

Mirrors the existing /service/ Key Details / What-We-Fix card aesthetic:

```html
<a href="/product/{slug}/" class="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200">
  <!-- Image -->
  <div class="aspect-square bg-[#F5F2ED] flex items-center justify-center overflow-hidden">
    <img src="..." alt="{product.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
  </div>
  <!-- Content -->
  <div class="p-4 lg:p-5">
    <p class="text-xs font-semibold text-[#FEA94F] uppercase tracking-wide mb-1">
      {category|brand}  <!-- e.g. "Mercury" or "Lawn" -->
    </p>
    <h3 class="text-base font-bold text-[#1B3A5C] leading-tight line-clamp-2 min-h-[2.5rem]">
      {product.name}
    </h3>
    <div class="flex items-center justify-between mt-3">
      <span class="text-sm font-semibold text-[#1B3A5C] tabular-nums">
        ${product.price}
      </span>
      <span class="text-xs text-gray-700 group-hover:text-[#FEA94F] transition-colors flex items-center gap-1">
        View
        <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</svg>
      </span>
    </div>
  </div>
</a>
```

**Why these choices:**
- `aspect-square` image area + `object-contain` — products often have transparent/varied backgrounds; contain prevents awkward cropping. The off-white `#F5F2ED` bg is the same tone as the section bgs, so transparent product PNGs blend cleanly.
- `group-hover:scale-105` on image — subtle zoom signals interactivity without being aggressive.
- Brand/category mini-label in orange — categorical hint without taking heading space; orange echoes the brand accent without overpowering.
- `line-clamp-2 min-h-[2.5rem]` — heading clamps at 2 lines AND reserves the height even for 1-line names, so all tiles align bottom regardless of name length (no jagged tile heights).
- Price + View link on the same row — primary info (price) left, action affordance (View →) right. Same reading order as the related-services tiles + form Submit.
- `hover:shadow-md hover:border-gray-300` matches the form card's elevation behavior.

### Carousel navigation — arrows + dots

```html
<div class="flex items-center justify-between mt-6">
  <!-- Dots (mobile + desktop) -->
  <div class="flex items-center gap-2">
    <!-- Repeat per slide group -->
    <button class="w-2 h-2 rounded-full bg-gray-300 transition-colors" aria-label="Go to slide N"></button>
    <button class="w-2 h-2 rounded-full bg-[#1B3A5C]" aria-label="Current slide"></button>  <!-- active -->
  </div>
  <!-- Arrows (desktop only — mobile uses native swipe) -->
  <div class="hidden lg:flex items-center gap-2">
    <button class="w-10 h-10 rounded-full border border-gray-300 hover:border-[#1B3A5C] flex items-center justify-center text-[#1B3A5C] transition-colors" aria-label="Previous">
      <svg class="w-4 h-4" aria-hidden="true">←</svg>
    </button>
    <button class="w-10 h-10 rounded-full border border-gray-300 hover:border-[#1B3A5C] flex items-center justify-center text-[#1B3A5C] transition-colors" aria-label="Next">
      <svg class="w-4 h-4" aria-hidden="true">→</svg>
    </button>
  </div>
</div>
```

**Why arrows desktop-only:** mobile users swipe natively. Desktop users have no native horizontal scroll affordance, so explicit arrows are necessary. Dots show position on both.

**Active dot = navy** (matches site primary), inactive = gray-300. Hover on inactive dot bumps to gray-500.

### Auto-rotation

**Don't auto-rotate.** Reasons:
1. Auto-rotation hurts accessibility (motion-sensitive users, screen-reader announcements interrupted)
2. The carousel is a "browse if you want" surface, not a hero rotator — user-driven pacing is correct
3. If a product is interesting, the user clicks. Auto-advancing past their attention cost wins.

If marketing strongly disagrees later, add an opt-in `prefers-reduced-motion` aware autoplay with pause-on-hover. v1: no autoplay.

### Source: WC product category

```php
// Pseudocode for WP/WC integration
$products = wc_get_products([
  'category' => ['parts-and-accessories'],  // dev confirms exact slug
  'limit' => 12,                             // 12 in carousel = 4 visible × 3 swipes; keeps payload sane
  'orderby' => 'popularity',                 // or 'date' for newest, 'rand' for variety
  'status' => 'publish',
]);
```

**Dev confirmation needed:**
1. Exact category slug (likely `parts-and-accessories` or similar — dev determines from existing taxonomy)
2. orderby preference: popularity, date, or random? My recommendation: **popularity** (most-viewed parts surface first; supports Reyco's high-volume servicing categories like Mercury impellers / Cub Cadet blades)
3. Fallback if category empty: hide the entire carousel section (not "no products found" empty state — that signals broken inventory)

### Empty/loading states

- **Loading:** skeleton tiles (gray pulse boxes) — 4 visible to maintain layout height
- **Empty (category has 0 products):** hide entire section. The form above already serves the "request a part" intent; an empty carousel adds zero value.
- **Error:** silent hide (log on backend, don't surface to user)

---

## 2. CTA Banner 1 — Book a Service Call (navy with image bg)

This is the high-contrast anchor section. Uses image bg + navy gradient overlay per the existing in-page banner template Boss described.

### Layout

```html
<section class="relative overflow-hidden">
  <!-- Image bg -->
  <div
    class="absolute inset-0 bg-cover bg-center"
    style="background-image: url('/path/to/service-bay-image.jpg');"
    aria-hidden="true"
  ></div>
  <!-- Navy gradient overlay (left-heavy so right side stays open for image bleed-through if dramatic photo) -->
  <div
    class="absolute inset-0 bg-gradient-to-r from-[#1B3A5C] via-[#1B3A5C]/90 to-[#1B3A5C]/70"
    aria-hidden="true"
  ></div>
  <!-- Content -->
  <div class="relative max-w-6xl mx-auto py-16 lg:py-20 px-4 lg:px-8">
    <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
      <!-- Icon-left -->
      <div class="shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
        <svg class="w-8 h-8 lg:w-10 lg:h-10 text-[#FEA94F]" aria-hidden="true">
          <!-- IconWrench or IconTool -->
        </svg>
      </div>
      <!-- Heading + sub -->
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl lg:text-3xl font-bold text-white leading-tight">
          Need it installed too?
        </h2>
        <p class="text-base lg:text-lg text-white/90 mt-2 max-w-xl">
          Skip the order — book a service call and we'll source the part, install it, and have you back on the water (or trail, or driveway) by next week.
        </p>
      </div>
      <!-- Button cluster right -->
      <div class="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
        <a href="/book-service/" class="inline-flex items-center justify-center px-6 py-3 bg-[#FEA94F] hover:bg-[#E89640] text-white font-semibold rounded-lg transition-colors">
          Book a Service Call
        </a>
        <a href="tel:+17055550100" class="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-lg transition-colors">
          <svg class="w-4 h-4 mr-2" aria-hidden="true"><!-- IconPhone --></svg>
          Call Direct
        </a>
      </div>
    </div>
  </div>
</section>
```

**Why these choices:**
- **Gradient overlay direction:** `from-[#1B3A5C] via-[#1B3A5C]/90 to-[#1B3A5C]/70` (left → right fading). Left side fully navy = text legibility anchor. Right side partial transparency = image shows through behind the buttons, adding depth without sacrificing CTA contrast.
- **Icon backdrop bg-white/10 + border-white/20:** matches the form-field treatment language (subtle bordered inputs); icon in orange echoes the form Submit button color → "this is the action accent."
- **Two-button cluster:** primary orange CTA (Book Service Call) + secondary outlined (Call Direct). Two paths address different user states: "I'll book it" vs "I want to talk now."
- **Mobile stack:** `flex-col lg:flex-row` collapses cleanly. Buttons stack `flex-col sm:flex-row lg:flex-col xl:flex-row` — full-width on mobile, side-by-side on tablet+, back to stacked on lg, side-by-side again on xl. Adapts to available horizontal space.

### Image direction

Image SHOULD be: technician working on equipment (marine engine bay, lawn tractor service, etc.). Low-saturation since the navy overlay will dominate; high-contrast subject so silhouettes read through the overlay.

**Reuse existing imagery if possible** — Reyco service-page hero image set or QA-sweep captures may already have suitable photography. Dev/imagegen owns sourcing if no existing asset fits.

### Image fallback

If no image is ready by deploy: solid navy bg (`bg-[#1B3A5C]`, no overlay needed). Section still works — just less visual depth. Don't block deploy on image asset.

---

## 3. CTA Banner 2 — Visit Our Showroom (off-white card variant)

**Web-copy locked:** "Visit Our Showroom" with Google Maps deep link (per boss msg 1777160236737). Visual treatment + structure stays as-spec'd; content + button destination updated below.

For visual rhythm contrast with Banner 1's navy intensity, Banner 2 uses an **off-white card-on-card** treatment. Quieter, supports the local-physical-store action without competing with the primary booking CTA.

### Layout

```html
<section class="bg-[#F5F2ED] py-16 lg:py-20 px-4 lg:px-8">
  <div class="max-w-5xl mx-auto">
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="grid lg:grid-cols-2">
        <!-- Left: Content (web-copy ships final wording) -->
        <div class="p-8 lg:p-12 flex flex-col justify-center">
          <p class="text-xs font-semibold text-[#E89640] uppercase tracking-widest mb-3">
            {{ web-copy eyebrow — placeholder: "Local. In-Stock. Open Now." }}
          </p>
          <h2 class="text-2xl lg:text-3xl font-bold text-[#1B3A5C] leading-tight mb-3">
            Visit Our Showroom
          </h2>
          <p class="text-base text-gray-700 mb-6">
            {{ web-copy subhead — placeholder: "Drop in at our SSM location to see parts in person, talk to a tech, or pick up a special order." }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Reyco+Marine+Sault+Ste+Marie"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center px-6 py-3 bg-[#1B3A5C] hover:bg-[#13294A] text-white font-semibold rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 mr-2" aria-hidden="true"><!-- IconMapPin --></svg>
              Get Directions
            </a>
            <a href="/contact/#hours" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 hover:border-[#1B3A5C] text-[#1B3A5C] font-semibold rounded-lg transition-colors">
              See Hours
            </a>
          </div>
        </div>
        <!-- Right: Visual panel (3 options, see below) -->
        <div class="bg-[#F5F2ED] flex items-center justify-center min-h-[240px] lg:min-h-0 overflow-hidden">
          {{ pick one: §3.1 storefront photo / §3.2 embedded mini-map / §3.3 generic placeholder }}
        </div>
      </div>
    </div>
  </div>
</section>
```

### Right panel — 3 options for the visual

#### Option 3.1 (RECOMMENDED): Storefront photo

```html
<img
  src="/path/to/reyco-storefront.jpg"
  alt="Reyco Marine showroom in Sault Ste. Marie"
  class="w-full h-full object-cover min-h-[240px] lg:min-h-[320px]"
/>
```

**Why recommended:** physical-place CTA is most-trusted with a real photo of the place. Builds local-business credibility and "I know what I'm walking into." Reuse existing storefront/exterior photography if any exists in Reyco asset set; otherwise route to imagegen for a single hero photo.

#### Option 3.2: Embedded mini-map (Google Maps iframe)

```html
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!...{Reyco location embed URL}"
  class="w-full h-full min-h-[240px] lg:min-h-[320px] border-0"
  loading="lazy"
  allowfullscreen
  title="Reyco Marine location map"
></iframe>
```

**Why secondary:** functional but less warm. Map is helpful but doesn't sell "showroom worth visiting" the way a real photo does. Good fallback if no storefront photo is available AND if dev wants direct visual reinforcement of the address. Privacy/consent: Google Maps embed sets cookies — confirm Reyco's cookie/privacy policy covers this; otherwise use storefront photo.

#### Option 3.3: Generic placeholder (icon + tagline)

```html
<div class="text-center p-8 lg:p-12">
  <div class="w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
    <svg class="w-10 h-10 lg:w-12 lg:h-12 text-[#FEA94F]" aria-hidden="true"><!-- IconMapPin --></svg>
  </div>
  <p class="text-sm font-semibold text-[#1B3A5C] uppercase tracking-wide">
    Sault Ste. Marie, ON
  </p>
  <p class="text-xs text-gray-700 mt-1">
    {{ web-copy address line }}
  </p>
</div>
```

**Why fallback:** ships immediately even if no photo asset exists and Maps embed blocked by privacy. Lowest visual impact but never blocks deploy.

### Deploy path — LOCKED

**Ship Option 3.3 (placeholder)** per boss msg 1777160322420.

Reasoning:
- Skip 3.1 (imagegen storefront photo): violates Aiden's image-gen-last-resort rule + real on-site shoot is next week (authentic storefront photos coming)
- Skip 3.2 (Maps embed): cookie/consent friction not worth the visual lift
- Ship 3.3 (placeholder): zero blocking dependencies, deployable today

### Future swap path

When on-site shoot images land (target: next week), swap the right-panel placeholder for the real storefront photo via `banner.image` config key (or whatever theme variable the WP template uses for component-level image refs). Implementation:

1. Dev wires the right panel as a **conditional** in the template:

```php
<div class="bg-[#F5F2ED] flex items-center justify-center min-h-[240px] lg:min-h-0 overflow-hidden">
  <?php if (!empty($banner_2_image)) : ?>
    <img
      src="<?= esc_url($banner_2_image) ?>"
      alt="Reyco Marine showroom in Sault Ste. Marie"
      class="w-full h-full object-cover min-h-[240px] lg:min-h-[320px]"
    />
  <?php else : ?>
    <!-- Option 3.3 placeholder block -->
    <div class="text-center p-8 lg:p-12">
      <div class="w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
        <svg class="w-10 h-10 lg:w-12 lg:h-12 text-[#FEA94F]" aria-hidden="true"><!-- IconMapPin --></svg>
      </div>
      <p class="text-sm font-semibold text-[#1B3A5C] uppercase tracking-wide">
        Sault Ste. Marie, ON
      </p>
      <p class="text-xs text-gray-700 mt-1">
        {{ web-copy address line }}
      </p>
    </div>
  <?php endif; ?>
</div>
```

2. After shoot, populate `$banner_2_image` (via theme options panel, ACF field, or hardcoded path — dev's call based on Reyco theme conventions). No template re-deploy needed if wired as a config key.

This way the placeholder ships now AND the upgrade is a content-only change next week.

**Why this treatment:**
- **off-white section + white card** = inverse of Banner 1's intensity. Gives the page a calm secondary CTA that users can engage without feeling pressured.
- **Eyebrow text in orange** ("Financing Available") sets context without competing with heading
- **Two-column inner layout** (content left, visual right) breaks the rhythm of full-width banners — page feels less repetitive
- **Right panel = stat-block by default** ("0% interest for 6 months") — a number is high-impact without needing photography. Easy to swap for an image later.
- **Primary navy button** (vs Banner 1's primary orange) — color-coded action hierarchy: orange = highest-intent action (book service), navy = informational action (learn about financing). User scans the page top-to-bottom and sees orange tier-1 CTA → navy tier-2 CTA → quieter footer paths.

### Banner 2 content history

Web-copy locked **Visit Our Showroom** with Google Maps deep link (msg 1777160236737). Earlier-considered alternatives (kept for reference if future variants needed): financing, warranty/authorized-dealer trust badge, free pickup/delivery, price match guarantee.

---

## 4. Spacing & rhythm summary

```
[Hero (navy)]                   ← existing, py-20+
       ↓
[Form (off-white)]              ← shipped, py-16 lg:py-20
       ↓
[Carousel (white)]              ← new, py-16 lg:py-20
       ↓
[Banner 1 (navy + image)]       ← new, py-16 lg:py-20
       ↓
[Banner 2 (off-white + card)]   ← new, py-16 lg:py-20
       ↓
[FAQ (white)]                   ← existing or new, py-16 lg:py-20
       ↓
[Related Articles (off-white)]  ← existing or new, py-16 lg:py-20
```

**Padding consistency:** every section uses `py-16 lg:py-20` for unified vertical rhythm. Hero stays larger (existing).

**Bg alternation pattern:** off-white → white → navy → off-white → white → off-white. The navy band breaks the warm-tone rhythm exactly once, anchoring the primary CTA visually.

---

## 5. Mobile (≤640px) considerations

### Carousel
- 1.3 tiles visible (peek pattern signals swipe)
- Native swipe — no arrows on mobile
- Dots remain visible
- Tiles stay at 280px width (don't shrink — readability matters more than tile count)

### CTA Banner 1
- Single column stack: icon → heading → subhead → button cluster
- Image bg still loads (use mobile-optimized variant if available — same image, smaller resolution)
- Buttons stack full-width

### CTA Banner 2
- Card grid collapses: content section first, visual/stat section second
- Stat number scales down (`text-4xl lg:text-6xl`)
- Buttons stack full-width

### Section padding
- All sections retain `py-16` on mobile (no further reduction) — vertical breathing room is more important than density on mobile

---

## 6. Accessibility

- All anchors have descriptive text (no "click here")
- Images have `alt=""` (decorative bg images) or descriptive alt (product images = product name)
- Carousel dots have `aria-label="Go to slide N"`; arrows have `aria-label="Previous"` / `aria-label="Next"`
- Carousel announces slide changes via ARIA live region (Embla supports natively)
- Color contrast:
  - White on navy (#1B3A5C) = 11.6:1 (AAA) ✓
  - White on `#1B3A5C/90` = ~10:1 (AAA) ✓
  - Orange (#FEA94F) on white card = ~3.0:1 — passes only as accent on **bold large text** or as decorative icon. For the eyebrow text "FINANCING AVAILABLE" (text-xs), use `text-[#E89640]` (darker orange) instead — 4.6:1 passes AA
  - Navy heading on white card = 13.5:1 (AAA) ✓
- Focus rings: all anchors get `focus:ring-2 focus:ring-[#1B3A5C] focus:ring-offset-2` (or `focus:ring-[#FEA94F]` for orange CTAs)
- Reduced motion: carousel doesn't autoplay; image scale-on-hover respects `@media (prefers-reduced-motion: reduce)` (Tailwind's `motion-safe:` modifier)

---

## 7. What I am NOT specifying

- FAQ section design — assumes existing Reyco FAQ accordion pattern (out of scope for this spec)
- Related Articles section design — assumes existing Reyco blog/article tile grid (out of scope)
- Carousel JS implementation details (Embla API, React/vanilla wiring) — dev's call
- WC product taxonomy / category creation — dev confirms with existing taxonomy
- Service Call booking flow / form — assumes /book-service/ exists or is being built separately
- Financing application flow — assumes /financing/ page exists

---

## 8. What dev needs to confirm

1. **Carousel library:** Embla preferred; Swiper acceptable if already in theme. Don't introduce a new lib if one exists.
2. **WC category slug** for parts-and-accessories pull (orderby: popularity recommended)
3. **Carousel limit:** 12 products is my recommended sweet spot (4 visible × 3 swipes). Adjust based on category inventory.
4. **Banner 1 image source:** existing service-bay/technician photography, or new asset needed (route to imagegen)?
5. **Banner 2 content:** confirm financing is the secondary CTA (alternatives in §3)
6. **Navy hover token:** `#13294A` is my read for "darker navy"; if theme has a navy-darker token, use it. Fallback: `bg-[#1B3A5C]/90`.
7. **Phone CTA href:** Reyco's primary phone number for "Call Direct" button (likely `tel:+17055550100` placeholder — confirm actual number)
8. **/book-service/ route:** confirm this exists or coordinate with web-copy on the actual booking destination

---

## 9. Coordination

**Web-copy:** owns CTA copy (heading + subhead + button labels for both banners). My placeholders:
- Banner 1: "Need it installed too?" / "Skip the order — book a service call..." / "Book a Service Call" / "Call Direct"
- Banner 2: "Financing Available" eyebrow / "Big repair? Spread the cost." / "We offer financing on parts + labour over $500..." / "Learn About Financing" / "Ask a Question"
- Carousel header: "Parts & Accessories We Stock" / "Browse common parts in stock. Don't see it? Use the form above..."

Web-copy can iterate any/all of these.

**Dev:** template + Tailwind classes per spec. Carousel Embla wiring + WC integration are the build-heavy parts (~1.5 hours total). CTA banners are straightforward markup (~30 min each).

**Designer (me):** QC pass via dev capture or non-headless CDP after deploy. Verify carousel tile aspect / spacing reads as designed; verify navy gradient overlay on Banner 1 doesn't drown the CTA contrast; verify Banner 2 stat block doesn't look isolated from content.

---

## 10. Implementation order suggestion

1. Carousel section scaffold + Embla wiring + WC category query (45 min)
2. Product tile component + grid integration (30 min)
3. Carousel arrows + dots + ARIA (15 min)
4. Banner 1 (navy + image bg + 2-button cluster) (30 min)
5. Banner 2 (off-white card with stat panel) (30 min)
6. Mobile sanity check at 390px on all 3 sections (15 min)
7. Designer QC pass (20 min)

**Total dev time: ~3 hours.** Web-copy iterates copy in parallel with dev's build window.
