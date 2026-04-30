# Reyco Marine — Schema Markup Templates
**Prepared:** 2026-04-23 by seo agent
**Status:** Ready for dev — geo coords resolved, paymentAccepted removed. Pending dev implementation approval.
**Implementation target:** Post-WP migration (reycomarine.com live)
**Priority:** Month 1 retainer deliverable #1

---

## Implementation Notes for Dev

- Add each JSON-LD block inside a `<script type="application/ld+json">` tag in the `<head>` of the relevant page template.
- Each page gets its own schema block — do not combine unrelated types on the same page.
- The LocalBusiness block goes on **every page** (via `header.php` or a global `wp_head` hook). All other blocks are page-specific additions.
- Replace `[PENDING]` placeholders once the live domain is confirmed and Casey confirms any missing details.
- After implementing, validate at: https://validator.schema.org and https://search.google.com/test/rich-results

---

## 1. LocalBusiness — Global (every page)

**File:** `header.php` or `functions.php` via `wp_head`
**Purpose:** Tells Google exactly who Reyco is, where they are, what hours they keep, and what services they offer. Foundation for Local Pack rankings.

```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutoRepair"],
  "@id": "https://reycomarine.com/#business",
  "name": "Reyco Marine & Small Engine Ltd.",
  "alternateName": "Reyco Marine",
  "url": "https://reycomarine.com",
  "logo": "https://reycomarine.com/wp-content/themes/reyco/assets/images/logo.png",
  "image": "https://reycomarine.com/wp-content/themes/reyco/assets/images/storefront.jpg",
  "description": "Authorized dealer for Princecraft boats, Mercury outboards, Minn Kota, Toro, Cub Cadet, Echo, Humminbird, and Bercomac. Certified marine technicians. Small engine repair. Serving Sault Ste. Marie and Northern Ontario for over 60 years.",
  "telephone": "+17052537828",
  "email": "parts@reycomarine.com",
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
    "latitude": 46.5375641,
    "longitude": -84.3351689
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "13:00"
    }
  ],
  "priceRange": "$$",
  "currenciesAccepted": "CAD",
  "areaServed": [
    {
      "@type": "City",
      "name": "Sault Ste. Marie",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Algoma District",
      "addressRegion": "ON",
      "addressCountry": "CA"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Reyco Marine Products & Services",
    "itemListElement": [
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Small Engine Repair"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Marine Service & Repair"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Boat Winterization"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Spring Commissioning"}}
    ]
  },
  "sameAs": [
    "https://www.facebook.com/reycomarine/",
    "https://www.instagram.com/reycomarineandsmallengine/"
  ]
}
```

---

## 2. Service Schema — Small Engine Repair Page

**URL:** `reycomarine.com/service/small-engine/`
**Why first:** KD 8, 3,600/mo CA-wide. Fastest path to organic traffic.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Small Engine Repair",
  "name": "Small Engine Repair — Sault Ste. Marie",
  "description": "Certified small engine repair for lawn mowers, snowblowers, chainsaws, trimmers, and outdoor power equipment. Factory-trained technicians. Serving Sault Ste. Marie and Northern Ontario.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/small-engine/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"},
    {"@type": "Brand", "name": "Echo"},
    {"@type": "Brand", "name": "Mercury"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 3. Service Schema — Marine Service & Repair Page

**URL:** `reycomarine.com/service/marine/`

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Marine Service and Repair",
  "name": "Marine Service & Repair — Sault Ste. Marie",
  "description": "Certified marine technicians servicing outboard motors, inboard/outboard engines, and boat systems. Mercury-certified. Full-season service and repair for Northern Ontario boaters.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/marine/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Mercury"},
    {"@type": "Brand", "name": "Minn Kota"},
    {"@type": "Brand", "name": "Princecraft"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 4. Service Schema — Boat Winterization Page

**URL:** `reycomarine.com/service/winterization/`
**Publish timing:** Go live by September 1 — seasonal urgency window Sept–Oct.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Boat Winterization",
  "name": "Boat Winterization — Sault Ste. Marie",
  "description": "Professional boat winterization by certified marine technicians. Engine fogging, fuel stabilization, flushing, storage prep. Protect your investment through the Northern Ontario winter.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/winterization/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 5. Service Schema — Spring Commissioning Page

**URL:** `reycomarine.com/service/spring-commissioning/`
**Publish timing:** Go live by March 1 — seasonal urgency window Mar–Apr.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Boat Spring Commissioning",
  "name": "Spring Boat Commissioning — Sault Ste. Marie",
  "description": "Get your boat ready for the Northern Ontario season. Full spring commissioning: engine inspection, fluid top-up, battery check, hull and safety equipment inspection. Book early — appointments fill fast.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/spring-commissioning/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 6. Product Schema — Template (for WooCommerce product pages)

**Apply to:** All WooCommerce product pages via `single-product.php`
**Note:** WooCommerce generates basic Product schema automatically. This template replaces/enhances it. Coordinate with dev on whether to override via `woocommerce_structured_data_product` filter or via Yoast/RankMath.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[PRODUCT_TITLE]",
  "description": "[PRODUCT_SHORT_DESCRIPTION]",
  "image": "[PRODUCT_IMAGE_URL]",
  "brand": {
    "@type": "Brand",
    "name": "[tag_brand — e.g. Mercury, Toro, Princecraft]"
  },
  "sku": "[canonical_sku — e.g. MERC-25HP-ME25MH4STM-LS]",
  "offers": {
    "@type": "Offer",
    "url": "[PRODUCT_URL]",
    "priceCurrency": "CAD",
    "price": "[PRODUCT_PRICE]",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Reyco Marine & Small Engine Ltd."
    }
  }
}
```

---

## Pending Placeholders (need before dev implements)

| Placeholder | Where | Status | How to get |
|-------------|-------|--------|-----------|
| `[PENDING logo URL]` | LocalBusiness | Pending | Dev confirms path after WP migration |
| `[PENDING storefront image URL]` | LocalBusiness | Pending | Dev confirms path after WP migration |
| ~~geo lat/lng~~ | LocalBusiness | ✓ Resolved | lat: 46.5375641, lng: -84.3351689 (Nominatim/OSM) |
| ~~paymentAccepted~~ | LocalBusiness | ✓ Removed | Removed per user direction |

---

## 7. AboutPage + Person Schema — About Us Page

**File:** `page-about.php` or equivalent About Us page template  
**URL:** `reycomarine.com/about/`  
**Blocked on:** Casey Fri EOD — needs author bios, staff names/roles, and social profile links  
**Purpose:** Tells Google who runs the business. Anchors E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals to real humans. Supports blog post authorship once content program launches.

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://reycomarine.com/about/",
  "name": "About Reyco Marine & Small Engine Ltd.",
  "description": "Reyco Marine & Small Engine Ltd. has served Sault Ste. Marie and Northern Ontario for over 60 years. Authorized dealer for Princecraft, Mercury, Minn Kota, Toro, Cub Cadet, Echo, Humminbird, and Bercomac.",
  "mainEntity": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  }
}
```

**Add alongside it — one `Person` block per key staff member:**

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[PENDING — Casey to provide: full name]",
  "jobTitle": "[PENDING — e.g. Owner, Service Manager, Parts Manager]",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "sameAs": [
    "[PENDING — LinkedIn profile URL if available]",
    "[PENDING — Facebook profile URL if available]"
  ],
  "description": "[PENDING — 1–2 sentence bio from Casey: years of experience, certifications, specialty]"
}
```

**Implementation notes:**
- One `Person` block per staff member being featured on the About page
- If Reyco has a lead technician with Mercury certification, include that person — certification signals expertise for marine service queries
- `sameAs` LinkedIn/Facebook links are optional but strengthen E-E-A-T — include if Casey can provide them
- These blocks go on the About page only, not globally

**Casey Fri EOD ask (already in consolidated draft):**
- Full names + job titles of staff to feature on About page
- 1–2 sentence bio per person (or key details: years at Reyco, certifications, specialty)
- LinkedIn or Facebook profile links if staff are comfortable sharing

---

## Dev Coordination Notes

- **WooCommerce Product schema:** Check if RankMath or Yoast is active on the WP install first. If so, use their product schema fields rather than custom JSON-LD to avoid duplication.
- **LocalBusiness @id:** The `https://reycomarine.com/#business` ID anchors all page schemas to the same entity — keep consistent everywhere.
- **Validate before pushing:** Use https://validator.schema.org — paste each JSON-LD block and confirm 0 errors.
- **GSC rich results report:** After implementation, monitor Search Console → Enhancements → any new feature types appearing within 4–8 weeks.

---

---

## 8. Service Schema — Engine Repair Page

**URL:** `reycomarine.com/service/engine-repair/`  
**Note:** Umbrella page — links to specific service pages. Use equipment-specific modifiers in copy to avoid automotive intent bleed. Do NOT rank for bare "engine repair near me."

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Engine Repair",
  "name": "Engine Repair — Sault Ste. Marie",
  "description": "Expert engine repair for outboard motors, small engines, ATVs, UTVs, and power equipment. Factory-trained technicians. Authorized service for Mercury, Toro, Cub Cadet, Echo, and Hisun. Serving Sault Ste. Marie and Northern Ontario.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/engine-repair/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Mercury"},
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"},
    {"@type": "Brand", "name": "Echo"},
    {"@type": "Brand", "name": "Hisun"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 9. Service Schema — Tune Ups Page

**URL:** `reycomarine.com/service/tune-ups/`  
**Note:** Single page covering all equipment types (boss-approved). Use `serviceType` array to signal breadth to Google. Heavy H2 structure per equipment type in page copy.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": ["Small Engine Tune-Up", "Snowblower Tune-Up", "Marine Engine Tune-Up", "Lawn Equipment Tune-Up"],
  "name": "Equipment Tune-Up Services — Sault Ste. Marie",
  "description": "Full-season tune-up services for lawn mowers, snowblowers, outboard motors, and outdoor power equipment. Spring and fall service packages. Factory-trained technicians. Authorized Toro, Cub Cadet, Echo, and Mercury service. Serving Sault Ste. Marie and Northern Ontario.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/tune-ups/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"},
    {"@type": "Brand", "name": "Echo"},
    {"@type": "Brand", "name": "Mercury"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

**Phase 2 note (post-launch):** If seasonal page splits are built (`/tune-ups/spring/`, `/tune-ups/fall/`), each gets its own schema block with a narrower `serviceType` string and seasonal `offers.validFrom`/`offers.validThrough` dates.

---

## 10. Service Schema — Lawn Equipment Service Page

**URL:** `reycomarine.com/service/lawn-equipment/`  
**Publish timing:** Live by March 1 — spring service season.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Lawn Equipment Service and Repair",
  "name": "Lawn Equipment Service — Sault Ste. Marie",
  "description": "Authorized service and repair for Toro and Cub Cadet lawn mowers, riding mowers, and zero-turn mowers. Factory-trained technicians. Warranty-compliant service. Serving Sault Ste. Marie and Northern Ontario.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/lawn-equipment/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 11. Service Schema — Snow Equipment Service Page

**URL:** `reycomarine.com/service/snow-equipment/`  
**Publish timing:** Live by September 1 — pre-season urgency window Sept–Oct.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Snowblower Service and Repair",
  "name": "Snow Equipment Service — Sault Ste. Marie",
  "description": "Authorized snowblower repair and tune-up service for Toro and Cub Cadet. Factory-trained technicians with OEM parts in stock. Pre-season and emergency service. Protecting Northern Ontario driveways for over 60 years.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/snow-equipment/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 12. Service Schema — ATV/UTV Repair Page

**URL:** `reycomarine.com/service/atv-utv-repair/`

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": ["ATV Repair", "UTV Repair", "Side-by-Side Repair"],
  "name": "ATV & UTV Repair — Sault Ste. Marie",
  "description": "Authorized Hisun ATV and UTV repair and service. Factory-trained technicians. OEM parts available. Serving Sault Ste. Marie and Northern Ontario off-road riders.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/atv-utv-repair/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Hisun"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

---

## 13. Service Schema — Order Parts Page

**URL:** `reycomarine.com/service/order-parts/`  
**Note:** Transactional page backed by Lightspeed live inventory. Schema signals this as a service (parts ordering), not a product listing. Individual part product pages (if built) get standard Product schema. WooCommerce may auto-generate Product schema for individual parts — coordinate with dev to avoid duplication.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Parts & Accessories Sales",
  "name": "Order Parts — Reyco Marine Sault Ste. Marie",
  "description": "Order OEM parts and accessories for Mercury outboards, Toro, Cub Cadet, Echo, Hisun, Minn Kota, and more. Authorized dealer — genuine OEM parts, in-stock for Northern Ontario customers. Order online or by phone.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Sault Ste. Marie",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Algoma District",
      "addressRegion": "ON",
      "addressCountry": "CA"
    }
  ],
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/order-parts/",
    "servicePhone": "+17052537828",
    "serviceEmail": "parts@reycomarine.com",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Mercury"},
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"},
    {"@type": "Brand", "name": "Echo"},
    {"@type": "Brand", "name": "Hisun"},
    {"@type": "Brand", "name": "Minn Kota"},
    {"@type": "Brand", "name": "Princecraft"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON",
    "priceCurrency": "CAD"
  }
}
```

---

## 14. Service + FAQPage Schema — Warranty Claims Page

**URL:** `reycomarine.com/service/warranty/`  
**Note:** Two schema blocks for this page — Service (signals warranty repair capability) + FAQPage (captures brand-specific warranty queries). Both go in the `<head>` as separate `<script>` tags.

**Block A — Service schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Warranty Repair Service",
  "name": "Warranty Claims & Warranty Repair — Reyco Marine",
  "description": "Authorized warranty repair for Mercury, Toro, Cub Cadet, Echo, Hisun, Princecraft, and Minn Kota. As an authorized dealer, Reyco handles warranty claims directly with manufacturers — bring in your equipment and we do the rest. Serving Sault Ste. Marie and Northern Ontario.",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "areaServed": {
    "@type": "City",
    "name": "Sault Ste. Marie",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "https://reycomarine.com/service/warranty/",
    "servicePhone": "+17052537828",
    "availableLanguage": "English"
  },
  "brand": [
    {"@type": "Brand", "name": "Mercury"},
    {"@type": "Brand", "name": "Toro"},
    {"@type": "Brand", "name": "Cub Cadet"},
    {"@type": "Brand", "name": "Echo"},
    {"@type": "Brand", "name": "Hisun"},
    {"@type": "Brand", "name": "Princecraft"},
    {"@type": "Brand", "name": "Minn Kota"}
  ],
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "areaServed": "Sault Ste. Marie, ON"
  }
}
```

**Block B — FAQPage schema (brand-specific warranty questions):**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does my Mercury outboard have a warranty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mercury outboards come with a 3-year limited warranty on new engines. Warranty requires service at an authorized Mercury dealer like Reyco Marine to remain valid."
      }
    },
    {
      "@type": "Question",
      "name": "How do I make a Toro warranty claim in Canada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bring your Toro equipment to Reyco Marine — as an authorized Toro dealer, we handle the warranty claim directly with Toro on your behalf. You don't contact Toro directly."
      }
    },
    {
      "@type": "Question",
      "name": "Does dealer servicing affect my warranty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Most manufacturers require service at an authorized dealer to keep the warranty valid. Reyco Marine is an authorized dealer for Mercury, Toro, Cub Cadet, Echo, Hisun, Princecraft, and Minn Kota — servicing at Reyco protects your warranty."
      }
    },
    {
      "@type": "Question",
      "name": "How long is the Cub Cadet warranty in Canada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cub Cadet residential equipment carries a 3-year limited warranty. Commercial equipment warranties vary by product. Bring your Cub Cadet to Reyco Marine for warranty service."
      }
    },
    {
      "@type": "Question",
      "name": "Can Reyco Marine handle my Hisun ATV warranty claim?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Reyco Marine is Sault Ste. Marie's authorized Hisun dealer and handles Hisun warranty repairs directly. Bring your ATV or UTV in and we process the claim with Hisun on your behalf."
      }
    }
  ]
}
```

**Note for web-copy:** FAQ answers above are placeholders based on general manufacturer warranty terms. Casey should confirm exact warranty durations and terms before these go live — some manufacturers update warranty terms annually. The FAQ structure (brand-per-question) is correct; only the answer text may need updating.

---

*Ready for dev — requires user approval before implementation. No changes made to the live site.*  
*Last updated: 2026-04-25 — added sections 8–14 (7 new service page schemas: Engine Repair, Tune Ups, Lawn Equipment, Snow Equipment, ATV/UTV Repair, Order Parts, Warranty Claims).*
