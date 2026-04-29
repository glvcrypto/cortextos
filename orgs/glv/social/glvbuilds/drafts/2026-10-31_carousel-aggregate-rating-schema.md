# @glvbuilds — Carousel

**Date:** 2026-10-31
**Platform(s):** LinkedIn, Instagram
**Content type:** Carousel (LinkedIn long-form + 7-slide IG)
**CTA:** Comment STARS — I'll DM you the AggregateRating schema template (manual DM)

---

## Slide 1 — Hook

"Those yellow star ratings that sometimes appear under a business name in Google's organic search results — they're not automatic, they're not from GBP, and you have to add code to your website to earn them."

---

## Slide 2

**What you're actually seeing**

The stars in organic results come from AggregateRating schema markup — structured data added to your website's HTML that tells Google: "this page has a 4.8-star rating based on 126 reviews."

This is separate from your GBP star rating (which appears in the local pack and Maps).

AggregateRating schema in organic results shows up under your blue title link — it can display your rating and review count directly on the search results page, before anyone clicks.

---

## Slide 3

**The rules Google actually enforces**

Google is strict about AggregateRating schema. If you misuse it, you risk a manual penalty.

What's allowed:
- Ratings collected directly on your website (first-party reviews)
- Ratings from a third-party review platform that you have a legitimate relationship with

What's NOT allowed:
- Self-written or self-assigned ratings ("we give ourselves 5 stars")
- Averaging your GBP and Facebook reviews into a single schema number without a source you actually own
- Fabricated or boosted counts

Google verifies these. A fabricated AggregateRating = manual action risk.

---

## Slide 4

**The three required fields**

Minimum valid AggregateRating schema needs three properties:

1. `ratingValue` — the average rating (e.g. 4.8)
2. `ratingCount` or `reviewCount` — number of ratings/reviews
3. `bestRating` — the maximum possible score (usually 5)

These sit inside your existing LocalBusiness schema (covered in Jul 21 — SCHEMA) as a nested object.

Example structure:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "126",
  "bestRating": "5"
}
```

---

## Slide 5

**Where to source the numbers legitimately**

If you have a review widget or plugin on your website (from Google, Trustpilot, Birdeye, etc.) that pulls live review data — that's a legitimate source.

If you have a native review section on your site where customers leave reviews directly — that's also legitimate.

If you're manually calculating an average from GBP reviews and hardcoding the number — that's a grey area. Google's documentation says the schema should reflect reviews available on the page. If the reviews themselves aren't visible on the page, the schema is likely to be filtered.

Safest approach: add a review widget to your service page, let it pull live data, and add the schema to match.

---

## Slide 6

**How to check if it's eligible to display**

Google doesn't guarantee AggregateRating schema will display as rich results — it evaluates eligibility on a per-page and per-query basis.

Check your implementation with Google's Rich Results Test (search.google.com/test/rich-results — SCHEMA post, Jul 21, covers this tool).

If the schema is valid, the tool shows it as detected. Whether it displays in live results depends on Google's internal scoring — valid schema is a necessary but not sufficient condition.

Also check: stars are more likely to appear on product and review-type pages. Service landing pages can qualify but at lower rates than e-commerce pages.

---

## Slide 7 — CTA

"If your LocalBusiness schema is already implemented (Jul 21), adding AggregateRating is a 10-minute addition — provided you have a legitimate review source to pull from.

Comment STARS and I'll send you the AggregateRating schema template nested inside a LocalBusiness block, plus the review source checklist."

---

## Production notes

- No screen recording needed — code snippet overlays work well for Slides 4/5
- Slide 1: show a Google SERP with star rating visible in an organic result — use a generic illustrative example, not a real client
- Slide 3: red/green checklist format for allowed vs. not allowed
- Slide 6: annotated Rich Results Test screenshot (generic, no client data)

---

## LinkedIn caption

When star ratings appear beneath a business name in Google's organic search results, they're not coming from Google Business Profile. They're coming from structured data added directly to the website.

AggregateRating schema tells Google's crawler: "this page represents a business or service with a specific average rating based on a specific number of reviews." When Google trusts that data and chooses to surface it, it appears as rich result stars in the blue organic links — before a visitor has clicked anything.

**This is separate from your local pack stars.** GBP stars come from Google reviews. AggregateRating stars come from your website's schema, sourced from reviews Google can verify.

**What Google requires before it will display these:**

A legitimate review source. Google is explicit: AggregateRating schema must reflect actual reviews. Self-assigned ratings, averaged GBP numbers without a verifiable source on the page, or fabricated counts will get your schema filtered — or worse, trigger a manual action.

The safest implementation: a review widget on your service page that pulls live review data, plus schema values that match what the widget is displaying. If the reviews are visible on the page, the schema is defensible.

**The three fields you need:**

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "126",
  "bestRating": "5"
}
```

Nest this inside your existing LocalBusiness schema block (LocalBusiness schema — Jul 21, SCHEMA).

**Checking eligibility:**

Rich Results Test at search.google.com/test/rich-results — valid schema shows as detected. Whether it appears in live results is Google's call based on page authority and query context. Service pages qualify, though at lower rates than product or review-specific pages.

If your LocalBusiness schema is already in place, this is a 10-minute addition — once you have the review source sorted.

Comment STARS and I'll send you the template.

---

## IG caption

Star ratings in Google's organic results don't come from GBP. They come from code on your website called AggregateRating schema.

Here's how it works:

What it is:
→ Structured data telling Google your average rating + review count
→ Separate from your GBP stars (local pack)
→ Displays under your blue organic link in search results

What Google requires:
→ Reviews must be real and verifiable — no self-assigned ratings
→ Review data should be visible on the page itself (widget or native reviews)
→ Fabricated counts = manual action risk

The three required fields:
→ ratingValue (e.g. 4.8)
→ reviewCount (e.g. 126)
→ bestRating (usually 5)

Nested inside your existing LocalBusiness schema.

If your LocalBusiness schema is already live (SCHEMA), this takes 10 minutes once you have a legitimate review source.

Comment STARS for the template.

#LocalSEO #SchemaMarkup #StructuredData #RichResults #GoogleSEO
