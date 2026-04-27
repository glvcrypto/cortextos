# @glvbuilds — LinkedIn + 7-Slide IG Carousel | 2026-08-13

**Platform:** LinkedIn (native carousel PDF) + Instagram carousel
**Content type:** System/framework carousel — 7 slides
**CTA:** Comment FAQ
⚠️ *CTA is manual DM — no automation set up. Aiden to confirm or set up automation before scheduling.*
⚠️ *Aiden: verify Yoast/RankMath auto-generate claim for breadcrumb schema — confirm this matches your current toolstack and plugin setup before scheduling.*

---

## Slide 1 — Hook

**Headline:**
> "Most local SEO guides stop at LocalBusiness schema.
> Two more schema types are doing real work for local service pages.
> Most agencies never implement them."

*Visual: Split screen — Google search result with FAQ rich result expanded vs. plain result*

---

## Slide 2 — Why Schema Beyond LocalBusiness?

**Headline:** LocalBusiness tells Google what you are. These two tell Google what's on the page.

**Body:**
LocalBusiness schema establishes your entity — name, address, phone, hours.
That matters. But it doesn't affect how your individual service pages appear in search results.
FAQ schema and breadcrumb schema affect the search result itself — what Google shows searchers before they click.
More real estate in the result. More context. Higher click-through rate.

*Visual: Google SERP showing a result with FAQ accordion expanded vs. a plain blue link*

---

## Slide 3 — FAQ Schema: What It Does

**Headline:** FAQ schema can expand your search result with Q&A pairs. Directly in the SERP.

**Body:**
When Google trusts your FAQ schema, it can display 2–4 question/answer pairs directly below your organic result.
Your result takes up more vertical space in the SERP.
Searchers can read answers before clicking — which filters for more qualified clicks.
For local service pages, the right FAQ questions pre-answer the most common objections: "How long does it take?" "Do you come to me?" "What brands do you service?"

*Visual: Google SERP with a FAQ rich result expanded — fictional business*

---

## Slide 4 — How to Add FAQ Schema to a Service Page

**Headline:** 3–5 Q&A pairs per service page. Match what searchers actually ask.

**Body:**
**Where to find the right questions:**
→ Your GBP Q&A section — these are real questions customers asked
→ Google autocomplete and People Also Ask for your service + city term
→ The FAQ section already on your page (if you have one — add one if you don't)

**Implementation:**
Add a `FAQPage` JSON-LD block to the page `<head>`. Use the exact Q&A text from the page — Google validates that schema matches visible content.
Yoast and RankMath both have native FAQ block support that auto-generates the schema from an FAQ section you add in the editor.

*Visual: JSON-LD FAQ schema block (fictional service page)*

---

## Slide 5 — Breadcrumb Schema: What It Does

**Headline:** Breadcrumb schema shows Google your site hierarchy — and can replace the URL in your search result.

**Body:**
By default, Google shows your full URL under a search result: `yoursite.com/service/marine-service/`
With breadcrumb schema, Google can show a readable path instead: `Home > Services > Marine Service`
That's clearer for searchers. It also signals to Google that your site has a logical structure — service pages sit under a services hub, city pages sit under a location section.
Breadcrumb schema is low-effort and is one of the few schema types that directly affects what searchers see before clicking.

*Visual: SERP result showing breadcrumb path vs. raw URL*

---

## Slide 6 — How to Add Breadcrumb Schema

**Headline:** Most SEO plugins generate breadcrumb schema automatically — if the breadcrumb element is on the page.

**Body:**
Yoast SEO and RankMath both generate `BreadcrumbList` JSON-LD automatically when a breadcrumb navigation element is present on the page.
**Check your setup:**
1. Is there a breadcrumb nav element visible on your service pages?
2. Validate with Google's Rich Results Test — paste the URL and look for `BreadcrumbList` in the detected structured data.
3. If it's missing: add a breadcrumb nav block (most WordPress themes support this natively or via your SEO plugin's breadcrumb shortcode/block).

*Visual: Rich Results Test output showing BreadcrumbList detected — fictional site*

---

## Slide 7 — How to Validate Both

**Headline:** Two tools. Five minutes. Validates that both schema types are working.

**Body:**
**Tool 1: Google Rich Results Test** (search.google.com/test/rich-results)
Paste any service page URL. Look for `FAQPage` and `BreadcrumbList` in the detected items.
If either is missing — it's either not implemented or has an error.

**Tool 2: Google Search Console → Enhancements**
Once indexed, Search Console shows any schema errors or warnings under Enhancements → FAQ / Breadcrumbs.
Address any "Detected, not eligible" or "Error" items before expecting rich results.

**CTA:**
Comment **FAQ** and I'll send you the JSON-LD FAQ schema template I use on local service pages.

*Visual: Search Console Enhancements panel showing FAQ + Breadcrumbs sections*

---

## LinkedIn Caption

Most local SEO content covers three schema types: LocalBusiness, Review, and Product.

Two more are consistently missing from local service pages — and both affect what searchers see before they click.

**FAQ schema**

FAQ schema allows Google to display Q&A pairs directly in the search result, below your organic listing. Your result takes up more vertical space. Searchers can read answers before deciding to click — which filters for more qualified traffic.

For local service pages, the right questions pre-answer the objections that would otherwise cost you the call: "How long does the repair take?" "Do you come to me or do I drop off?" "What brands do you authorise?"

To add it: create a `FAQPage` JSON-LD block in the page `<head>`, using Q&A pairs that match visible content on the page. Yoast and RankMath both support native FAQ blocks that generate the schema automatically from content you add in the editor.

Source for questions: your GBP Q&A section (real questions from real customers), Google autocomplete for your service + city term, and People Also Ask results.

**Breadcrumb schema**

Breadcrumb schema replaces the raw URL under your search result with a readable path.

Instead of: `yoursite.com/service/marine-service/`
Google can show: `Home > Services > Marine Service`

It also signals site structure to Google — your service pages sit under a services hub, your city pages sit under a location section. Both Yoast and RankMath generate `BreadcrumbList` schema automatically when a breadcrumb navigation element is present on the page.

**How to validate:**
Run each service page URL through Google's Rich Results Test. Look for `FAQPage` and `BreadcrumbList` in the detected structured data. Check Search Console → Enhancements once pages are indexed.

Both schema types. About 30 minutes per page to implement.

Comment **FAQ** and I'll send you the JSON-LD template I use.

---

## IG Caption

Most local SEO guides stop at LocalBusiness schema.

Two more types affect what searchers see before they click:

**FAQ schema** — expands your result with Q&A pairs in the SERP. More space. More qualified clicks.

**Breadcrumb schema** — replaces the raw URL with a readable path: `Home > Services > Marine Service`

How to add them:
1. FAQ: `FAQPage` JSON-LD block (Yoast/RankMath FAQ blocks auto-generate it)
2. Breadcrumbs: enabled automatically when a breadcrumb nav is on the page (check with Rich Results Test)

Validate both at Google's Rich Results Test.

Comment **FAQ** for the JSON-LD template.

#LocalSEO #SchemaMarkup #StructuredData #SEOTips #LocalMarketing #TechnicalSEO

---

## Production Notes

- All screenshots of search results and tools must use fictional business data — no real client
- Rich Results Test is at search.google.com/test/rich-results (free, no login required)
- Slide 4: if Aiden does not use Yoast or RankMath, replace with the correct plugin reference before scheduling
- Slide 6: breadcrumb auto-generation depends on whether a breadcrumb nav element is actually on the page — verify this is the case in Aiden's standard WordPress setup
- "Detected, not eligible" status in Search Console can occur even with correct schema — FAQ rich results are at Google's discretion, not guaranteed; note this if flagged
