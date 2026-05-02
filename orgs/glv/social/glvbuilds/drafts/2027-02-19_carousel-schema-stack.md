# 2027-02-19 | LinkedIn + Instagram | Carousel (7 slides) | CTA: STACK

**Date:** February 19, 2027
**Platform:** LinkedIn + Instagram
**Content type:** Carousel — 7 slides
**CTA:** Comment STACK (manual DM — new keyword, no automation confirmed)
**Topic:** The full schema markup stack for local service businesses — 4 layers
**MEMORY cluster:** Schema markup (advanced synthesis — distinct from Jul 21 LocalBusiness, Aug 13 FAQ, Oct 31 AggregateRating)

---

## Slides

**Slide 1 — Hook**
> "Every local service business website needs at least four schema types. Most have one — and it's set up wrong."

---

**Slide 2 — Layer 1**
**LocalBusiness schema — the anchor.**
Business name, address, phone, URL, opening hours, geo-coordinates.
Lives in JSON-LD in your `<head>` on every page.
If you have Yoast or RankMath — check the output in Rich Results Test.
Don't assume the plugin is doing it correctly.

---

**Slide 3 — Layer 2**
**FAQPage schema — one per service page.**
Every service page should have a FAQ section.
Wrap each question-answer pair in a Question + Answer block.
Four to six Q&A pairs minimum.
Google can surface these as expandable results in the SERP.

---

**Slide 4 — Layer 3**
**AggregateRating schema — yellow stars in organic results.**
Distinct from your GBP stars in the map pack.
Three required fields: ratingValue, reviewCount, bestRating.
Critical rule: only add this if real reviews are visible on the page.
No visible review widget = don't add this. Policy violation risk.

---

**Slide 5 — Layer 4**
**BreadcrumbList schema — page hierarchy.**
Tells Google: Home → Services → [Service] → [City].
A separate block (not nested inside LocalBusiness).
Add to every service page and location page.
Low effort. Underused on most local service websites.

---

**Slide 6 — How to nest them**
All four types in one `<script type="application/ld+json">` block.
LocalBusiness is the parent — FAQPage and AggregateRating nest inside it.
BreadcrumbList is a separate block on the same page.
Validate every page in Rich Results Test before publishing.

---

**Slide 7 — Priority order**
**Start here if you're building from scratch:**
1. LocalBusiness — if nothing else, this one
2. FAQPage — service pages first
3. BreadcrumbList — easy win once site structure is clean
4. AggregateRating — only when a live review widget is on the page

Comment **STACK** for the full JSON-LD template.

---

## LinkedIn Caption

Most local businesses have LocalBusiness schema from a WordPress plugin. That's one of four layers.

Here's the full schema stack.

**Layer 1 — LocalBusiness.** The anchor block. Business name, address, phone, URL, hours, geo-coordinates. JSON-LD in your `<head>`. If you're running Yoast or RankMath, don't assume it's outputting correctly — validate it in Rich Results Test. I check this on every new client audit and find errors in roughly a third of accounts.

**Layer 2 — FAQPage.** Every service page should have a FAQ section with at least four to six questions. Wrap each question-answer pair in schema markup. Google can expand these as interactive results in the SERP — that's extra real estate on the page for the same content you already wrote.

**Layer 3 — AggregateRating.** Yellow stars that appear in organic results (separate from your GBP star rating in the map pack). Requires three fields: ratingValue, reviewCount, bestRating. This one has a strict rule: only add it if real reviews are visible on the page — a widget pulling live data or first-party reviews displayed in HTML. Self-assigning a rating or adding this without visible reviews is a Google policy violation.

**Layer 4 — BreadcrumbList.** Tells Google the page hierarchy: Home → Services → [Service] → [City]. Kept as a separate JSON-LD block. Add to every service and location page. Straightforward to implement; consistently underused.

All four in one `<script type="application/ld+json">` section per page. LocalBusiness, FAQPage, and AggregateRating in one parent block. BreadcrumbList as a separate block. Validate in Rich Results Test before going live.

Priority if starting from scratch: LocalBusiness → FAQPage → BreadcrumbList → AggregateRating.

Comment **STACK** and I'll send the full JSON-LD template.

---

## IG Caption

4 schema types every local service business website should have:

1 — **LocalBusiness**: anchor block — name, address, phone, hours, coordinates
2 — **FAQPage**: one per service page, 4–6 Q+A pairs (Google can expand these in the SERP)
3 — **AggregateRating**: organic yellow stars — only add if real reviews are visible on the page
4 — **BreadcrumbList**: page hierarchy — Home → Services → [Service] → [City]

All four in one JSON-LD block. Validate in Rich Results Test.

Comment **STACK** for the full template. ↓
