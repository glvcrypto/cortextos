# Order Parts Carousel — SEO + Structured Data Direction
**Page:** `reycomarine.com/service/order-parts/`  
**Produced:** 2026-04-25 by seo agent  
**Updated:** 2026-04-26 — URLs corrected per dev URL inventory (products at `/product/[slug]/`, page at `/service/order-parts/`)  
**Audience:** Dev (implementation) + Designer (CTA wiring)

---

## 1. Product Schema Per Carousel Item — Confirmed, With One Rule

**Short answer: yes, Product schema applies per item. But don't add it to the `/service/order-parts/` page — it lives on each product's own page.**

WooCommerce generates Product schema automatically on individual product pages (`/product/[product-slug]/`). If RankMath or Yoast is active on the install (confirm with dev — likely RankMath given the WP setup), those plugins enhance the auto-generated schema with price, availability, and image fields. That's the right place for Product schema.

**What NOT to do:** Do not add a second `Product` schema block for each carousel item inside the `/service/order-parts/` page `<head>`. That creates duplicate structured data for the same product URL and confuses Google's parser.

**What dev needs to confirm:** Is RankMath or Yoast active? If yes, check that `woocommerce_structured_data_product` filter isn't being suppressed on product pages. The schema should be firing automatically — just verify it's rendering by running one product URL through Google's Rich Results Test post-launch.

---

## 2. WC Category Slug for Carousel Auto-Pull — Use a Custom Tag

**Recommendation: create a custom WooCommerce product tag `featured-parts` and use that as the carousel pull source.**

Do not use an existing category (Marine, OPE, etc.) — those are broad and will pull too many products into the carousel indiscriminately. Do not use `tag_main_category` either — same problem.

**Why `featured-parts` is the right call:**

| Option | Problem |
|--------|---------|
| Category: Marine | Pulls boats, motors, accessories — too broad |
| Category: Parts | Doesn't exist yet as a clean WC category without setup work |
| tag_main_category filter | Still too broad — includes non-carousel items |
| `featured-parts` custom tag | Intentionally curated, Casey-manageable, carousel-specific |

**Implementation note for dev:**
- Add `featured-parts` as a WooCommerce product tag in the WP admin
- Casey tags which products should appear in the carousel — full control, no dev needed to update
- Query: `WP_Query` with `tax_query` targeting `product_tag` = `featured-parts`
- Recommended carousel limit: 6–12 products (enough to rotate; not so many it slows the page)
- Order by: `menu_order` (lets Casey manually sequence) or `date` (newest first) — Casey's call

---

## 3. ItemList Schema for the Carousel

Add this as a third `<script type="application/ld+json">` block in `/service/order-parts/` `<head>`, alongside the existing Service schema (section 13 of `schema-markup-templates.md`).

This block signals to Google that the carousel is a curated list of products — eligible for carousel-style rich results in search.

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "OEM Parts — Reyco Marine",
  "description": "Featured OEM parts and accessories available at Reyco Marine in Sault Ste. Marie. Authorized dealer for Mercury, Toro, Cub Cadet, Echo, Hisun, and Minn Kota.",
  "url": "https://reycomarine.com/service/order-parts/",
  "numberOfItems": 8,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://reycomarine.com/product/[product-slug-1]/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "url": "https://reycomarine.com/product/[product-slug-2]/"
    }
  ]
}
```

**Implementation note for dev:**
- `numberOfItems` and `itemListElement` array should be dynamically generated from the `featured-parts` tag query — not hardcoded
- `position` = loop index (1-based)
- `url` = each product's permalink
- If the carousel has 8 items, there should be 8 `ListItem` entries
- Update `numberOfItems` to match the actual count at render time
- **Do not include product name or price in the ItemList** — that data lives in each product's own Product schema. ItemList just needs `position` + `url`.

---

## 4. Schema Block Summary for /service/order-parts/ Page

This page gets **two** `<script type="application/ld+json">` blocks in `<head>`:

| Block | Type | Source |
|-------|------|--------|
| 1 | `Service` | `schema-markup-templates.md` section 13 (already written) |
| 2 | `ItemList` | Dynamic — generated from `featured-parts` tag query (template above) |

Product schema lives on individual product pages — handled by WooCommerce + RankMath/Yoast automatically.

---

## 5. Internal Link Discipline

**Carousel item clicks → product page (not `/service/order-parts/` itself)**

| Element | Links to | Anchor signal |
|---------|----------|---------------|
| Carousel item (image + name) | `/product/[product-slug]/` | Product name (exact match) |
| "View all parts" CTA | `/products/` | "View all OEM parts" |
| Service-page CTAs around carousel | Relevant service page | Descriptive anchor |

**CTA anchor text recommendations:**

| CTA intent | Anchor text | Target |
|-----------|-------------|--------|
| Marine parts → marine service | "Need it installed? Book marine service." | `/service/marine/` |
| Small engine parts → repair | "Having trouble? Book a small engine repair." | `/service/small-engine/` |
| Warranty question | "Check if your part is under warranty." | `/service/warranty/` |
| General service CTA | "We stock what we service." | `/service/` |

**Do not:** use generic anchor text like "click here" or "learn more" on any CTA surrounding the carousel. Every link should describe the destination.

---

## 6. Notes for Dev Coordination

- Confirm RankMath/Yoast active → Product schema on product pages is automatic
- Build `featured-parts` tag in WP admin before wiring carousel query
- ItemList block should be server-rendered (not JS-injected) — Googlebot needs to see it in the initial HTML response
- Run `/service/order-parts/` through Google Rich Results Test once live to verify ItemList is parsed correctly
- If product pages show duplicate schema warnings post-launch, check for `woocommerce_structured_data_product` filter conflicts

---

*Schema templates for /service/order-parts/ Service block: `deliverables/seo/schema/schema-markup-templates.md` section 13*
