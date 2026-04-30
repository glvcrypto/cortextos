---
name: wireframing-wp-themes
description: Ben Pelta's WordPress theme architecture and design conventions, extracted from the Reyco Marine theme build. Use when scaffolding any new WP theme for GLV clients. Covers structure, design tokens, component patterns, CPTs, SEO, and performance.
source: Extracted from /orgs/glv/clients/reyco/ theme — April 2026
---

# Ben Pelta's WordPress Theme Framework

> Canonical reference extracted from the Reyco Marine custom theme — the most complete GLV WP build to date. Apply these conventions when scaffolding any new client WP theme.

---

## 1. Theme Architecture

### Directory Structure

```
wp-content/themes/<client-slug>/
  functions.php            # All hooks, CPT/tax registration, schema, enqueue, helpers
  style.css                # Output from Tailwind CLI (do NOT hand-edit)
  header.php               # Sticky nav — mega-menu (desktop) + accordion (mobile)
  footer.php               # 4-column grid + newsletter + floating utility widget
  index.php                # Fallback template
  front-page.php           # Homepage — all sections inline (can be large)
  single.php               # Blog post template
  single-product.php       # Product detail template
  archive.php              # Category/archive listing
  page.php                 # Generic fallback page template
  search.php               # Search results
  404.php                  # 404 error page
  page-templates/          # Specialized page templates (15+ for Reyco)
  template-parts/          # Reusable component partials (24+ for Reyco)
  inc/                     # PHP utility modules (menu data, CPT seeding, handlers, sync)
  assets/
    css/
      tailwind.css         # Tailwind source (input file)
    js/
      main.js              # Global JS (nav, tabs, carousels, utility widgets)
      [feature].js         # Feature-specific JS (financing-calculator.js, etc.)
    images/                # Static theme assets (logo, fallbacks, category silhouettes)
  tailwind.config.js       # Design tokens (colors, fonts, spacing, breakpoints)
  package.json             # Build scripts
  postcss.config.js        # Tailwind/PostCSS config
```

### Key Architecture Rules

- **functions.php is the hub** — All CPT/taxonomy registration, enqueue, schema output, meta boxes, AJAX handlers, and helper functions live here. No scattered includes for critical logic.
- **template-parts/ for components** — Any section used in 2+ templates becomes a partial. Include with `get_template_part('template-parts/hero')`.
- **inc/ for feature modules** — Standalone PHP files for complex features (Lightspeed sync, financing handler, seed scripts, menu data). Include via `require_once get_template_directory() . '/inc/menu-data.php'`.
- **page-templates/ for specialized pages** — Each client vertical gets a dedicated template (e.g., `page-templates/service.php`). Templates are registered via `/* Template Name: Service Page */` comment.
- **No page builders** — Pure PHP + Tailwind. All layouts are custom semantic HTML. No Elementor, Divi, or Gutenberg blocks in custom themes.

---

## 2. Design System Conventions

### Color Tokens (Tailwind v4)

Define semantic names — never use raw hex values in templates. Add to `tailwind.config.js`:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Reyco token set — replace with client-specific names/values
        'lake-blue':    '#1B3A5C',  // Primary — header, hero, dark sections
        'warm-white':   '#F5F2ED',  // Cream — text on dark
        'workshop':     '#2D2D2D',  // Footer background
        'sunset-amber': '#D4862F',  // CTA buttons, accents, icons on dark
        'steel-grey':   '#8A9199',  // Secondary text
        'ice-white':    '#E8EDF2',  // Alt section backgrounds
      },
      maxWidth: {
        'site': '1200px',           // Content max-width
      },
      borderRadius: {
        'btn':  '4px',              // Buttons — minimal/sharp
        'card': '8px',              // Cards
        'hero': '12px',             // Hero sections
      },
    },
  },
}
```

**Color naming convention:** Name after locale/vibe of the client's world (lake-blue for marine, trail-green for outdoor, etc.) — not generic `primary/secondary`. Makes the codebase readable by non-devs.

### Typography Scale

```javascript
fontFamily: {
  heading: ['Inter', 'sans-serif'],         // Labels, nav, subheads (600 weight)
  body:    ['Source Sans 3', 'sans-serif'], // Body copy (400/500/600)
  display: ['Oswald', 'sans-serif'],        // H1, hero text (heavy display)
}
```

**Hierarchy in templates:**
- `font-display text-4xl md:text-5xl lg:text-6xl` — H1, hero headline
- `font-heading text-2xl md:text-3xl` — H2, section headings
- `font-heading text-lg md:text-xl` — H3, card titles
- `font-body text-base` — Body copy
- `font-heading text-xs uppercase tracking-wider` — Labels, nav items, column headers

### Spacing Rhythm

Consistent vertical rhythm across all sections:

| Context | Classes |
|---------|---------|
| Section padding (vertical) | `py-12 md:py-16` |
| Section padding (horizontal) | `px-6 md:px-12` |
| Content max-width container | `max-w-7xl mx-auto` (or `max-w-site`) |
| Grid gap (cards) | `gap-6 md:gap-8` |
| Stack gap (within card) | `gap-3` or `gap-4` |
| Icon + text inline gap | `gap-1.5` or `gap-2` |

### Breakpoints

Standard Tailwind: `sm` (640), `md` (768), `lg` (1024), `xl` (1280). Use `lg:` as the desktop flip point for nav and major layout changes.

---

## 3. Component Patterns

### Header / Sticky Nav

```php
<!-- header.php skeleton -->
<header class="fixed top-0 left-0 right-0 z-50 bg-[#1B3A5C] shadow-lg" style="height:88px">
  <div class="max-w-site mx-auto px-6 flex items-center justify-between h-full">

    <!-- Logo -->
    <a href="<?= home_url('/') ?>">
      <img src="..." alt="..." class="h-32 md:h-36 lg:h-44 -my-8">
    </a>

    <!-- Desktop mega-menu (hidden on mobile) -->
    <nav class="hidden lg:flex items-center h-full gap-8">
      <?php foreach (reyco_get_mega_menu() as $item): ?>
        <div class="relative h-full flex items-center group">
          <a href="<?= $item['url'] ?>"
             class="text-white/80 hover:text-white text-[11px] xl:text-xs uppercase tracking-wider font-medium h-full flex items-center">
            <?= $item['label'] ?>
          </a>
          <?php if (!empty($item['columns'])): ?>
            <div class="absolute top-full left-0 bg-white shadow-xl rounded-b-lg
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 min-w-[240px]">
              <!-- dropdown columns -->
            </div>
          <?php endif ?>
        </div>
      <?php endforeach ?>
    </nav>

    <!-- Right: phone + CTA + mobile toggle -->
    <div class="flex items-center gap-4">
      <a href="tel:..." class="hidden xl:flex items-center gap-2 text-white font-medium text-sm hover:text-[#FEA94F]">
        <span class="material-symbols-outlined text-base">phone</span>
        <?= get_option('reyco_phone') ?>
      </a>
      <a href="/contact/" class="bg-secondary-container text-on-secondary-fixed px-5 py-2 rounded-lg text-sm font-semibold">
        Contact Us
      </a>
      <button id="mobile-menu-toggle" class="lg:hidden text-white">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </div>

  <!-- Mobile menu (fixed overlay below header) -->
  <div id="mobile-menu" class="lg:hidden hidden fixed top-[88px] left-0 right-0 bottom-0 bg-[#1B3A5C] z-40 overflow-y-auto max-h-[80vh]">
    <!-- Accordion items -->
  </div>
</header>
<div style="height:88px"></div><!-- spacer for fixed header -->
```

**Nav rules:**
- All dropdown items are `<a>` links — never `<button>` — for crawlability
- Phone number visible at xl breakpoint minimum; always tap-to-call on mobile
- Mobile menu is a full-overlay accordion, not a slide-in drawer

---

### Product Card (`template-parts/product-card.php`)

```php
<article class="bg-surface-container-lowest rounded-2xl shadow-lg hover:shadow-xl
                transition-all overflow-hidden group">

  <!-- Image: 4:3 aspect, hover zoom -->
  <div class="aspect-[4/3] overflow-hidden relative">
    <?php if ($image_url): ?>
      <img src="<?= $image_url ?>" alt="<?= $title ?>"
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
           loading="lazy">
    <?php else: ?>
      <div class="w-full h-full bg-surface-container flex items-center justify-center">
        <!-- placeholder SVG -->
      </div>
    <?php endif ?>
    <!-- Condition badge: top-left overlay -->
    <?php if ($condition === 'used'): ?>
      <span class="absolute top-3 left-3 bg-workshop/80 text-white text-xs font-semibold px-2 py-1 rounded">
        Pre-Owned
      </span>
    <?php endif ?>
  </div>

  <!-- Content -->
  <div class="p-5 flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant"><?= $brand ?></span>
    </div>
    <h3 class="font-heading font-semibold text-on-surface leading-snug"><?= $title ?></h3>
    <p class="text-sm text-on-surface-variant line-clamp-2"><?= $excerpt ?></p>

    <!-- Price footer -->
    <div class="flex items-end justify-between mt-auto pt-3 border-t border-outline-variant/30">
      <div>
        <p class="text-lg font-bold text-on-surface"><?= reyco_format_price($price) ?></p>
        <?php if ($monthly): ?>
          <p class="text-xs text-on-surface-variant">From <?= reyco_format_price($monthly) ?>/mo</p>
        <?php endif ?>
      </div>
      <a href="<?= $url ?>" class="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary">
        View <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </a>
    </div>
  </div>
</article>
```

**Card rules:**
- Always show price — never "call for price"
- Monthly payment estimate below price if available
- Image aspect ratio: 4:3 (enforced via `aspect-[4/3]`)
- Condition badge overlay (Pre-Owned / Year New) top-left
- Hover: image scale-105, shadow-xl — card doesn't move, image zooms within container

---

### Hero Section (`template-parts/hero.php`)

```php
<section class="relative w-full overflow-hidden min-h-[480px] md:min-h-[560px] flex items-center">
  <!-- Background image with overlay -->
  <div class="absolute inset-0">
    <img src="<?= $bg_image ?>" alt="" class="w-full h-full object-cover" loading="eager">
    <div class="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-site mx-auto px-6 md:px-12 py-16">
    <h1 class="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
      <?= $heading ?>
    </h1>
    <p class="font-heading text-lg md:text-xl text-ice-white max-w-xl mb-8">
      <?= $subheading ?>
    </p>
    <div class="flex flex-wrap gap-4">
      <a href="<?= $cta_primary_url ?>"
         class="bg-sunset-amber text-white px-8 py-3 rounded-btn font-semibold hover:bg-amber-700 transition-colors">
        <?= $cta_primary_label ?>
      </a>
      <a href="<?= $cta_secondary_url ?>"
         class="border-2 border-white text-white px-8 py-3 rounded-btn font-semibold hover:bg-white/10 transition-colors">
        <?= $cta_secondary_label ?>
      </a>
    </div>
  </div>
</section>
```

**Hero rules:**
- Static image with gradient overlay — NEVER a slider or carousel
- Text left-aligned on gradient side, image bleeds right
- `loading="eager"` on hero image (above the fold — don't lazy-load)
- Dual CTAs: primary (filled amber), secondary (ghost white)

---

### CTA Separator Blocks

Inserted every 3–4 sections to maintain conversion cadence. 10 variants — pick by context:

| Variant | When to use |
|---------|-------------|
| `cta-financing.php` | After product listings |
| `cta-service-booking.php` | After service descriptions |
| `cta-lead-magnet.php` | Mid-blog or after buyer guides |
| `cta-trade-in.php` | On product pages, inventory listing |
| `cta-brand-partner.php` | On brand landing pages |
| `cta-newsletter.php` | Bottom of blog listing |
| `cta-promo.php` | Seasonal / sale |
| `cta-lifestyle.php` | After emotional/aspirational content |
| `cta-price-alert.php` | Out-of-stock products |
| `cta-product-spotlight.php` | Featured item callout |

**CTA section pattern:**
```php
<section class="bg-[#1B3A5C] py-12 md:py-16">
  <div class="max-w-site mx-auto px-6 md:px-12 text-center">
    <h2 class="font-display text-3xl md:text-4xl text-white mb-4"><?= $headline ?></h2>
    <p class="font-body text-ice-white/80 max-w-2xl mx-auto mb-8"><?= $body ?></p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="..." class="bg-sunset-amber text-white px-8 py-3 rounded-btn font-semibold hover:bg-amber-700">
        <?= $cta_label ?>
      </a>
    </div>
  </div>
</section>
```

---

### Forms (Contact, Service, Apply)

```php
<form class="space-y-5">
  <div>
    <label class="text-on-surface-variant text-xs font-semibold block mb-1 uppercase tracking-wide">
      Full Name
    </label>
    <input type="text" name="name" required
           class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-sm
                  focus:outline-none focus:ring-1 focus:ring-sunset-amber">
  </div>
  <!-- repeat for each field -->

  <button type="submit"
          class="w-full bg-sunset-amber text-white px-8 py-3 rounded-btn font-semibold hover:bg-amber-700 transition-colors">
    Send Message
  </button>
</form>
```

**Form rules:**
- Labels above inputs always (not placeholder-as-label)
- `text-xs uppercase tracking-wide` on labels
- Focus ring in accent color (`focus:ring-sunset-amber`)
- Minimal fields — only what's needed for the conversion action
- Submit button: full-width on mobile, matches primary CTA style

---

### Section Color Alternation

Create visual rhythm by alternating backgrounds:
```
Section 1: bg-white
Section 2: bg-[#E8EDF2]  (ice-white)
Section 3: bg-white
Section 4: bg-[#1B3A5C]  (lake-blue — CTA separator)
Section 5: bg-white
```

Never use the same background for 3+ consecutive sections.

---

### Footer

4-column grid on desktop, stacks on mobile:
```
Col 1 (2/4 wide): Brand + address + phone + hours + map embed
Col 2:            Quick nav links
Col 3:            Brand links
Col 4:            Newsletter email input
```

Bottom bar: copyright | privacy | terms | "Built by GLV Marketing"

**Floating utility widget** (bottom-right, fixed): Client-specific — financing calculator, book service, click-to-call. Always `z-40`, `bottom-6 right-6`, round button 56px, popup on click.

---

## 4. Tailwind v4 Conventions

**Build:**
```json
// package.json
{
  "scripts": {
    "build:css": "npx @tailwindcss/cli -i ./assets/css/tailwind.css -o ./style.css --minify",
    "watch:css": "npx @tailwindcss/cli -i ./assets/css/tailwind.css -o ./style.css --watch"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

After `build:css`, prepend the WP theme header comment to `style.css` (PHP script or shell command).

**Input file structure (`assets/css/tailwind.css`):**
```css
@import "tailwindcss";
/* Custom component classes if needed */
```

**Usage patterns in PHP templates:**
- Utility classes inline — no custom CSS unless unavoidable
- Responsive: `sm:` `md:` `lg:` `xl:` prefixes on sizing and layout
- Hover: `hover:` on interactive elements — scale, shadow, color transitions
- Transitions: `transition-all duration-200` for subtle interactions, `duration-500` for image zooms
- Group hover: `group` on container, `group-hover:` on child (image zoom in card)

---

## 5. CPT & Taxonomy Patterns (No ACF)

Ben's approach: **native WordPress custom post meta + admin meta boxes** instead of ACF. Simpler dependency chain, full control.

### CPT Registration Pattern

```php
// functions.php
function reyco_register_product_cpt() {
  register_post_type('product', [
    'labels'       => ['name' => 'Products', 'singular_name' => 'Product'],
    'public'       => true,
    'has_archive'  => true,
    'rewrite'      => ['slug' => 'products', 'with_front' => false],
    'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'author', 'custom-fields'],
    'show_in_rest' => true,
  ]);
}
add_action('init', 'reyco_register_product_cpt');
```

### Taxonomy Registration Pattern

```php
register_taxonomy('product_category', 'product', [
  'hierarchical' => true,
  'rewrite'      => ['slug' => 'product-category'],
  'show_in_rest' => true,
]);

register_taxonomy('product_brand', 'product', [
  'hierarchical' => true,
  'rewrite'      => ['slug' => 'brand'],
  'show_in_rest' => true,
]);
```

### Meta Box Pattern

```php
add_action('add_meta_boxes', function() {
  add_meta_box('product_details', 'Product Details', 'reyco_product_meta_box_cb', 'product', 'normal', 'high');
});

function reyco_product_meta_box_cb($post) {
  wp_nonce_field('reyco_product_meta', 'reyco_product_nonce');
  $price = get_post_meta($post->ID, '_product_price', true);
  ?>
  <p>
    <label>Price ($)</label>
    <input type="number" name="product_price" value="<?= esc_attr($price) ?>">
  </p>
  <?php
}

add_action('save_post_product', function($post_id) {
  if (!isset($_POST['reyco_product_nonce']) ||
      !wp_verify_nonce($_POST['reyco_product_nonce'], 'reyco_product_meta')) return;
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

  update_post_meta($post_id, '_product_price', sanitize_text_field($_POST['product_price']));
});
```

### Standard Product Meta Fields

```php
// Meta keys — prefix with _ to hide from public custom fields UI
_product_sku            // string
_product_price          // numeric (string)
_product_monthly_payment// numeric (string)
_product_stock_status   // 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order'
_product_year           // int (YYYY)
_product_condition      // 'new' | 'used' | 'demo'
_product_specs          // JSON string: [{"label":"Length","value":"17 ft"}, ...]
_product_expert_id      // WP user ID
_product_expert_review  // text
```

---

## 6. SEO & OG Template Patterns

All schema and meta output in `wp_head` hook, centralized in `functions.php`:

```php
add_action('wp_head', 'reyco_output_seo_meta', 1);
function reyco_output_seo_meta() {
  global $post;

  // Meta description
  $description = reyco_get_meta_description();

  // OG tags
  $og_image = has_post_thumbnail() ? get_the_post_thumbnail_url($post, 'large')
                                    : get_template_directory_uri() . '/assets/images/logo-client.png';
  ?>
  <meta name="description" content="<?= esc_attr($description) ?>">
  <meta property="og:title"       content="<?= esc_attr(wp_title('|', false, 'right') . get_bloginfo('name')) ?>">
  <meta property="og:description" content="<?= esc_attr($description) ?>">
  <meta property="og:image"       content="<?= esc_url($og_image) ?>">
  <meta property="og:url"         content="<?= esc_url(get_permalink()) ?>">
  <meta property="og:type"        content="<?= is_singular('post') ? 'article' : 'website' ?>">
  <meta property="og:site_name"   content="<?= esc_attr(get_bloginfo('name')) ?>">
  <?php
}
```

### JSON-LD Schema Output

Output as inline `<script type="application/ld+json">` blocks in `wp_head`:

```php
// LocalBusiness — on every page
$schema_local = [
  '@context' => 'https://schema.org',
  '@type'    => 'LocalBusiness',
  'name'     => get_bloginfo('name'),
  'address'  => ['@type' => 'PostalAddress', 'streetAddress' => '11 White Oak Dr E', 'addressLocality' => 'Sault Ste. Marie'],
  'telephone'=> get_option('reyco_phone'),
  'openingHours' => ['Mo-Fr 08:00-17:30', 'Sa 08:00-14:00'],
  'geo'      => ['@type' => 'GeoCoordinates', 'latitude' => 46.5XX, 'longitude' => -84.3XX],
];
echo '<script type="application/ld+json">' . wp_json_encode($schema_local) . '</script>';

// Article — on single posts only
if (is_singular('post')) {
  $schema_article = [
    '@context'  => 'https://schema.org',
    '@type'     => 'Article',
    'headline'  => get_the_title(),
    'datePublished' => get_the_date('c'),
    'author'    => ['@type' => 'Person', 'name' => get_the_author()],
  ];
  echo '<script type="application/ld+json">' . wp_json_encode($schema_article) . '</script>';
}

// Product — on single products only
if (is_singular('product')) {
  $price = get_post_meta(get_the_ID(), '_product_price', true);
  $schema_product = [
    '@context' => 'https://schema.org',
    '@type'    => 'Product',
    'name'     => get_the_title(),
    'brand'    => ['@type' => 'Brand', 'name' => wp_get_post_terms(get_the_ID(), 'product_brand')[0]->name ?? ''],
    'offers'   => ['@type' => 'Offer', 'price' => $price, 'priceCurrency' => 'CAD',
                   'availability' => 'https://schema.org/InStock'],
  ];
  echo '<script type="application/ld+json">' . wp_json_encode($schema_product) . '</script>';
}
```

### Meta Description Logic

```php
function reyco_get_meta_description(): string {
  global $post;
  // Hardcoded per slug for key pages
  $map = [
    'home'              => 'Reyco Marine & Small Engine Ltd. — boats, mowers, snowblowers, and service in Sault Ste. Marie.',
    'about'             => 'Family-owned since ...',
    'contact'           => 'Visit Reyco Marine at 11 White Oak Drive East...',
    // ...
  ];
  $slug = is_front_page() ? 'home' : ($post->post_name ?? '');
  if (isset($map[$slug])) return $map[$slug];
  // Auto-generate for posts/products (25 words, 155 chars)
  if (is_singular()) {
    $excerpt = get_the_excerpt();
    return mb_substr(wp_strip_all_tags($excerpt), 0, 155);
  }
  return $map['home']; // fallback
}
```

---

## 7. Performance Conventions

### Enqueue Pattern

```php
add_action('wp_enqueue_scripts', 'reyco_enqueue_assets');
function reyco_enqueue_assets() {
  // Main CSS (filemtime-busted for cache breaking)
  wp_enqueue_style('reyco-style', get_stylesheet_uri(), [], filemtime(get_stylesheet_directory() . '/style.css'));

  // Main JS (deferred)
  wp_enqueue_script('reyco-main', get_template_directory_uri() . '/assets/js/main.js',
                    [], filemtime(get_template_directory() . '/assets/js/main.js'), true);

  // Feature JS: load conditionally — do NOT enqueue on every page
  if (is_front_page() || is_page_template('page-templates/financing.php') || is_singular('product')) {
    wp_enqueue_script('reyco-calculator', get_template_directory_uri() . '/assets/js/financing-calculator.js',
                      ['reyco-main'], null, true);
  }
  if (is_singular('post')) {
    wp_enqueue_script('reyco-toc', get_template_directory_uri() . '/assets/js/table-of-contents.js',
                      ['reyco-main'], null, true);
  }
  if (is_singular('product')) {
    wp_enqueue_script('reyco-product-tabs', get_template_directory_uri() . '/assets/js/product-tabs.js',
                      ['reyco-main'], null, true);
    wp_enqueue_script('reyco-product-gallery', get_template_directory_uri() . '/assets/js/product-gallery.js',
                      ['reyco-main'], null, true);
  }
}
```

**Enqueue rules:**
- Always use `filemtime()` for versioning — ensures cache-busting on deploy
- All scripts in footer (`true` last arg) — deferred by default
- Conditional loading — never load feature JS on pages that don't need it
- `wp_localize_script()` for passing PHP data (AJAX URL, nonces) to JS

### Image Conventions

```php
// Hero images: loading="eager" (above fold)
<img src="..." loading="eager" decoding="async">

// All other images: loading="lazy"
<img src="..." loading="lazy" decoding="async">

// In PHP, always use wp_get_attachment_image() or explicit width/height when possible
echo wp_get_attachment_image($id, 'large', false, ['loading' => 'lazy', 'class' => 'w-full h-full object-cover']);
```

### Inline Google Map

```php
// Avoid heavy Maps JS embed. Use iframe for static map display:
<iframe
  src="https://www.google.com/maps?q=<?= urlencode($address) ?>&output=embed"
  width="100%" height="150" loading="lazy" referrerpolicy="no-referrer"
  class="rounded-lg border-0 w-full" title="Map">
</iframe>
```

### AJAX Handler Pattern

```php
// Register AJAX handlers in functions.php
add_action('wp_ajax_reyco_notify_me',        'reyco_handle_notify_me');
add_action('wp_ajax_nopriv_reyco_notify_me', 'reyco_handle_notify_me');

function reyco_handle_notify_me() {
  check_ajax_referer('reyco_notify_me_nonce', 'nonce');
  // ... handle form data
  wp_send_json_success(['message' => 'You\'ll be notified.']);
}

// Localize nonce for JS
wp_localize_script('reyco-notify-me', 'ReycoNotify', [
  'ajax_url' => admin_url('admin-ajax.php'),
  'nonce'    => wp_create_nonce('reyco_notify_me_nonce'),
]);
```

---

## 8. Ben's Rules — Do/Don't Reference

### Architecture

| ✅ Do | ❌ Don't |
|-------|---------|
| All CPT/tax/meta in functions.php | Scatter registrations across multiple files |
| template-parts/ for any repeated component | Inline the same HTML in 3+ templates |
| inc/ for feature modules (handlers, sync, seed) | Pile unrelated logic into functions.php |
| page-templates/ for each distinct page layout | Stretch `page.php` to handle everything |
| Pure PHP + Tailwind | Page builders (Elementor, Divi, Gutenberg blocks in custom themes) |
| No ACF — native meta boxes | Add ACF as a dependency |

### Design & Layout

| ✅ Do | ❌ Don't |
|-------|---------|
| Static hero (image + gradient + text + dual CTA) | Hero slider/carousel |
| CTAs above the fold on every page | Make users scroll to find what they want |
| Visual sections mid-page (cards, grids, banners) | Long paragraph text between visual sections |
| SEO/long-form text at the bottom of pages | Break a 5-card grid with a text paragraph mid-flow |
| Alternate section backgrounds (white / ice-white / lake-blue CTA) | Same background for 3+ consecutive sections |
| Price + monthly estimate on every product | "Call for price" |
| Phone in nav at all breakpoints (tap-to-call mobile) | Hide phone on mobile |
| Material Symbols Outlined for all icons | Mix icon libraries |
| 4:3 aspect ratio on product images | Variable/uncontrolled image ratios in grids |
| Hover: image scale-105 inside container (group-hover) | Card bounce/lift on hover |
| Financing CTA every 3–4 sections | No in-page financing mentions |
| Blog section on homepage (3–4 cards) | Homepage with no content section |
| Big visual separator between used and new inventory | Mixed used + new in same grid |

### Typography & Color

| ✅ Do | ❌ Don't |
|-------|---------|
| Semantic color names (lake-blue, sunset-amber) | Raw hex values in templates |
| `font-display` (Oswald) for H1/hero | Display font on body copy or labels |
| `font-heading` (Inter) for labels and nav | Mixed font usage without hierarchy |
| Amber/orange accent for CTAs and icons on dark bg | Same color for CTAs and body text |
| `rounded-btn: 4px` (sharp) for buttons | Fully rounded pill buttons |

### PHP & Tailwind

| ✅ Do | ❌ Don't |
|-------|---------|
| `filemtime()` for stylesheet and script versioning | Hard-coded version strings |
| Conditional script loading (feature JS only where needed) | Enqueue everything on every page |
| `wp_json_encode()` for schema output | `json_encode()` directly |
| `loading="lazy"` on all images below fold | Missing loading attribute |
| `loading="eager"` on hero image | Lazy-load the hero image |
| `wp_create_nonce()` + `check_ajax_referer()` on all AJAX | AJAX handlers without nonce verification |
| `sanitize_text_field()` / `esc_attr()` on all meta saves | Unsanitized POST data into DB |

### Content Strategy (SEO + Conversion)

| ✅ Do | ❌ Don't |
|-------|---------|
| Embed local context (city name, region, "family-owned since") | Generic copy with no local signal |
| Expert author bios with credentials on service/product pages | Anonymous generic copy |
| FAQ schema on homepage (5 Q&As) | No FAQ section |
| Seed team authors and assign to blog categories | All posts under admin |
| Category → related products + services cross-links | Siloed content (no internal linking) |
| "In Stock" badge + "Added N days ago" freshness signal | Stale inventory with no status |
| UTM tracking on product card links (which carousel drove the click) | No traffic source attribution |

---

## 9. Seeding Scripts (When Starting a New Site)

For rapid content launch, include in `inc/`:

| Script | Purpose |
|--------|---------|
| `setup-pages.php` | Creates all pages in one activation run (80+ for full dealer site) |
| `seed-posts.php` | Seeds blog posts across categories with featured images + authors |
| `seed-products.php` | Seeds placeholder products with meta, specs, brand/category |
| `seed-products-catalogue.php` | Seeds brand catalogue (Princecraft, Mercury, etc.) |
| `seed-product-tags.php` | Applies SEO tags to all products (~10–18 per product) |

**Activation hook pattern:**
```php
register_activation_hook(__FILE__, 'reyco_on_theme_switch');
function reyco_on_theme_switch() {
  require_once get_template_directory() . '/inc/setup-pages.php';
  reyco_setup_pages();
  // Do NOT auto-run product seeds — those are one-time CLI/admin triggers
}
```

---

## 10. Reference: Reyco Theme Stats (Ground Truth)

| Metric | Count |
|--------|-------|
| PHP template files | 53 (14 root + 15 page-templates + 24 template-parts) |
| Inc modules | 22 |
| Products seeded | 148 |
| Blog posts seeded | 36+ |
| Pages created | 83+ |
| Internal links | 360+ |
| Tailwind version | v4 |
| ACF | None (native meta) |
| PHP errors on launch | 0 |

**Full theme path:** `/home/aiden/cortextos/orgs/glv/clients/reyco/` → WordPress install → `wp-content/themes/reyco-marine/`

---

*Extracted from the Reyco Marine custom theme build by scout — April 20, 2026. Update this file when Ben ships a new client theme with significant pattern changes.*
