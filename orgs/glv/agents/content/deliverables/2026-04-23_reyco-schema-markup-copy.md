# Reyco Schema Markup Copy

**Status:** DRAFT — for dev injection; do NOT publish without user green-light
**Client:** Reyco Marine (reycomarine.com)
**Prepared:** 2026-04-23
**Scope:** LocalBusiness schema (site-wide), Article schema (blog posts), FAQ schema (blog posts with Q&A sections)
**Notes:** All schema copy is factual and matches verified contact details. Dev to inject via Yoast/Rank Math schema tab or custom JSON-LD block. All values verified against prior Reyco content deliverables. Do NOT publish without user green-light.

---

## 1. LocalBusiness Schema (site-wide — inject once in theme or homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "BoatDealer",
  "name": "Reyco Marine",
  "url": "https://reycomarine.com",
  "telephone": "+17052537828",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11 White Oak Drive East",
    "addressLocality": "Sault Ste. Marie",
    "addressRegion": "ON",
    "postalCode": "P6B 4J7",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 46.5158,
    "longitude": -84.3130
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "09:00",
      "closes": "13:00"
    }
  ],
  "description": "Reyco Marine is an authorized dealer for Princecraft, Mercury, EZ-GO, Hisun, Troy-Bilt, and more. Sales and service in Sault Ste. Marie, Ontario.",
  "areaServed": [
    "Sault Ste. Marie",
    "Algoma District",
    "Blind River",
    "Elliot Lake",
    "Wawa",
    "Bruce Mines"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Boats, Motors, Outdoor Power Equipment, UTVs, Golf Carts, Docks, Lifts"
  }
}
```

**Dev note:** `BoatDealer` is a valid Schema.org subtype of `LocalBusiness`. If your theme/plugin defaults to `LocalBusiness`, that is also acceptable — `BoatDealer` is more specific and preferred. Geo coordinates are approximate (city centroid) — replace with exact coordinates from Google Maps if available.

---

## 2. Article Schema (apply to all 7 blog posts)

Template — replace bracketed values per post:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[POST TITLE]",
  "description": "[META DESCRIPTION — same as SEO meta]",
  "author": {
    "@type": "Person",
    "name": "Casey Davieaux",
    "jobTitle": "Owner, Reyco Marine",
    "worksFor": {
      "@type": "Organization",
      "name": "Reyco Marine"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "Reyco Marine",
    "url": "https://reycomarine.com"
  },
  "datePublished": "[PUBLISH DATE — ISO 8601, e.g. 2026-04-26]",
  "dateModified": "[LAST MODIFIED DATE]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://reycomarine.com[POST SLUG]"
  }
}
```

**Per-post values:**

| Post | Headline | Slug | Meta Description |
|---|---|---|---|
| Princecraft fishing boats | Princecraft Fishing Boats for Northern Ontario: What Makes Them the Right Choice | /blog/princecraft-fishing-boats-northern-ontario | Princecraft fishing boats at Reyco Marine — authorized Princecraft dealer in Sault Ste. Marie. Aluminium boats built for Northern Ontario water. |
| Mercury outboards | How to Choose the Right Mercury Outboard for Northern Ontario | /blog/choosing-mercury-outboard-northern-ontario | Mercury outboard motors at Reyco Marine — how to choose the right horsepower, shaft length, and model for Northern Ontario boats and water conditions. |
| Docks and lifts | How to Choose the Right Dock and Lift for Your Northern Ontario Waterfront | /blog/choosing-dock-lift-northern-ontario-rj-machine | R&J Machine docks and lifts at Reyco Marine — how to choose the right dock and lift for your Northern Ontario waterfront. |
| Easy Hauler trailers | Easy Hauler Boat Trailers: What Northern Ontario Anglers Need to Know | /blog/easy-hauler-boat-trailers-northern-ontario | Easy Hauler boat trailers at Reyco Marine — galvanized aluminium trailers for Northern Ontario anglers. How to choose the right trailer for your boat. |
| EZ-GO golf carts | EZ-GO Golf Carts and UTVs for Northern Ontario Properties | /blog/ez-go-golf-carts-northern-ontario | EZ-GO golf carts and utility vehicles at Reyco Marine in Sault Ste. Marie — built for Northern Ontario cottage and rural properties. |
| Troy-Bilt power equipment | Troy-Bilt Outdoor Power Equipment for Northern Ontario | /blog/troy-bilt-outdoor-power-equipment-northern-ontario | Troy-Bilt outdoor power equipment at Reyco Marine — snow blowers, lawn tractors, and small engines for Northern Ontario properties. |
| Hisun UTVs | Hisun UTVs for Northern Ontario: What You Need to Know | /blog/hisun-utv-northern-ontario | Hisun UTVs at Reyco Marine in Sault Ste. Marie — side-by-sides and utility vehicles built for Northern Ontario trails and properties. |

---

## 3. FAQ Schema (apply to posts with Q&A content)

The Princecraft and Mercury posts have natural Q&A structure. FAQ schema is the highest-value structured data for AI Overviews and featured snippets.

### Princecraft Blog — FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why choose an aluminium fishing boat for Northern Ontario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aluminium boats are lighter than fibreglass, easier to trailer and launch at single-lane Algoma ramps, and more durable through freeze-thaw cycles. A stone strike on an aluminium hull is typically weldable. Marine-grade aluminium alloy does not rust — it forms a protective oxide layer with routine maintenance."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best fishing boat for the Sault Ste. Marie area?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Princecraft Sport 172 is a 17-foot 2-inch deep-V aluminium hull rated to 115 horsepower with a 79-inch beam. Its deep-V geometry handles the chop on the St. Marys River and Lake Superior conditions better than flat-bottomed fishing boats. Reyco Marine is the only authorized Princecraft dealer in the Sault Ste. Marie area."
      }
    },
    {
      "@type": "Question",
      "name": "Does buying from an authorized Princecraft dealer matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Princecraft's limited lifetime hull warranty requires purchase from an authorized dealer. A boat purchased privately or from a non-authorized retailer does not carry this warranty to the new owner. Reyco Marine is the only authorized Princecraft dealer in the Sault Ste. Marie area."
      }
    },
    {
      "@type": "Question",
      "name": "When should I book spring commissioning for my Princecraft?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Before the end of March. The spring service window in Sault Ste. Marie is short — the entire regional boating community books at once. A boat that comes in for commissioning in April is on the water before opening weekend. A boat that calls in mid-May may not be."
      }
    }
  ]
}
```

### Mercury Outboards Blog — FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What horsepower outboard do I need for a 17-foot aluminium fishing boat in Northern Ontario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For a 16-to-18-foot aluminium fishing boat, the 90–115 hp range covers most hulls. The Mercury 115 FourStroke is the most common motor Reyco Marine fits to aluminium fishing boats in this size class. Always match to your hull's maximum horsepower rating stamped on the manufacturer's plate."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a 20-inch and 25-inch outboard shaft?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Outboard shaft length must match your transom height. A 20-inch shaft fits standard-height transoms, common on older aluminium fishing boats. A 25-inch shaft fits tall transoms, common on newer aluminium and fibreglass designs. Installing the wrong shaft length causes air ingestion or excess drag. Measure your existing shaft or confirm the match at point of sale."
      }
    },
    {
      "@type": "Question",
      "name": "Does buying a Mercury outboard from an authorized dealer matter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Mercury's 3-plus-3 FourStroke warranty — three years factory plus three years extended — requires purchase from an authorized dealer and proper registration at point of sale. A motor purchased privately or through a non-authorized channel does not carry this warranty regardless of what the original buyer paid."
      }
    },
    {
      "@type": "Question",
      "name": "Why do four-stroke outboards suit Northern Ontario conditions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Four-stroke outboards run on straight gasoline — no pre-mix or oil tank. Electronic fuel injection provides reliable cold starts at near-freezing May temperatures. Fuel management systems reduce consumption on long runs to Spanish River country, Batchawana Bay, and Lake Superior access points. Four-stroke motors also run significantly quieter than two-stroke equivalents."
      }
    }
  ]
}
```

### Docks and Lifts Blog — FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What dock works best for a Northern Ontario waterfront property?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "R&J Machine Truss Pipe Docks are the most common choice for Northern Ontario seasonal use — they go in May and come out in October. For properties on the Great Lakes system where water levels shift year to year, R&J floating dock systems adjust to level changes. The right choice depends on your water depth, shoreline exposure, and whether you have current."
      }
    },
    {
      "@type": "Question",
      "name": "What lift capacity do I need for my boat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Factor in the weight of the boat, fuel, gear, and engine — not just the dry hull weight. Lift capacity should clear your realistic loaded weight by a meaningful margin. R&J Machine cantilever lifts are available in 1,500, 2,000, 3,000, 4,000, 5,000, and 6,000 lb ratings. Contact Reyco Marine for the right match for your watercraft."
      }
    },
    {
      "@type": "Question",
      "name": "When should I take my dock out for the season in Northern Ontario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By October at the latest on ice-prone lakes and river properties. Leaving dock sections in the water past freeze-up is how equipment gets damaged or lost. R&J Machine systems are designed for annual install and removal — a small crew can do it in a few hours once they know the system."
      }
    }
  ]
}
```

---

## Dev Implementation Notes

- **Yoast SEO:** Use the Schema tab on each post to add FAQ blocks. Article schema is auto-generated by Yoast from post metadata — confirm author field maps to Casey Davieaux.
- **Rank Math:** Use the Schema Generator module. FAQ schema blocks can be added from the Schema tab in the post editor.
- **Manual JSON-LD:** If plugin doesn't support all types, inject via a Custom HTML block at the bottom of the post or via `wp_head` action in functions.php.
- **LocalBusiness:** Inject once site-wide — not per post. Homepage or theme header is the right location.
- **FAQ schema note:** Only apply FAQPage schema to posts where the FAQ content is genuinely present in the body copy. Do not add FAQ schema to posts that don't have Q&A structure — Google may penalize misuse.
- **datePublished:** Set to actual WP publish date. Do not pre-date.
