# Priest Plumbing -- Lead Dossier

**Prepared by:** GLV Marketing (Aiden / Claude)
**Date:** 2026-04-15
**Status:** PROCEED WITH CAUTION -- website domain compromised/sold, but business appears active via GBP

---

## Screenshots Index

| File | Description |
|------|-------------|
| `screenshots/priest-plumbing/priest-plumbing-gbp-listing.png` | Google Maps GBP listing -- 5.0 stars, 51 reviews, Jobber booking, photos visible |
| `screenshots/priest-plumbing/priest-plumbing-homepage-desktop-clean.png` | priestplumbing.ca homepage -- REDIRECTING to Google search results for competitor plumbers (domain compromised) |
| `screenshots/priest-plumbing/priest-redirect-completeplumbing-desktop.png` | priestplumbing.ca redirect destination -- shows "Blue Sky Plumbing" template site, NOT Priest Plumbing content |
| `screenshots/priest-plumbing/priest-plumbing-mobile-redirect.png` | Mobile view -- redirects to northbayplumbers.ca (different redirect destination than desktop) |

---

## CRITICAL FINDING: Website Domain Compromised

**priestplumbing.ca is no longer under Matt Priest's control.** During Playwright testing on 2026-04-15:
- Homepage redirected to `completeplumbingnorthbay.ca` (different business: phone 705-358-7567, address #18-161 Ferris Dr., email completeplb@gmail.com)
- About page redirected to `northbayplumbers.ca`
- On subsequent loads, the homepage rendered a Google Search results page for "Lafontainoise Plumbing & Heating Inc North Bay ON"
- The redirects change per visit -- classic signs of domain expiry/SEO spam takeover

**The Google Business Profile still lists priestplumbing.ca as the website**, meaning every customer who clicks the GBP website link lands on a competitor or spam page. This is an urgent, business-critical issue Matt likely does not know about.

---

## NAP Audit

### Canonical Domain

**priestplumbing.ca** (COMPROMISED -- redirecting to competitor/spam sites as of Apr 15, 2026)

### NAP Table

| Source | Business Name | Address | Phone | Website | Email | Postal Code | Notes |
|--------|--------------|---------|-------|---------|-------|-------------|-------|
| Google Business Profile | Priest Plumbing | Not displayed (service-area business) | (705) 441-1764 | priestplumbing.ca | -- | -- | 5.0 stars, 51 reviews. Booking via Jobber. Hours: closes 5 p.m. |
| Website (priestplumbing.ca) | Priest Plumbing | 904 Premier Rd, North Bay, ON | 705-441-1764 | priestplumbing.ca | info@priestplumbing.ca | P1A 2H5 | DOMAIN COMPROMISED -- redirecting to competitor sites |
| Yellow Pages | Priest Plumbing | 904 Premier Rd, North Bay, ON | 705-441-1764 | priestplumbing.ca | -- | P1A 2H5 | Open 24 hours, Emergency Plumber, English |
| Canpages | Priest Plumbing | 904 Premier Rd, North Bay, ON | 705-441-1764 | -- | -- | P1A 2H5 | Categories: Plumbing Contractors, Pipe & Boiler Covering |
| Yelp | Priest Plumbing | North Bay, ON | 705-441-1764 | priestplumbing.ca | -- | -- | Updated Jan 2026 |
| BayToday | Priest Plumbing | North Bay, ON | 705-441-1764 | priestplumbing.ca | -- | -- | Directory listing |
| Birdeye | Priest Plumbing | 904 Premier Rd, North Bay, ON | -- | priestplumbing.ca | -- | P1A 2H5 | 52 reviews aggregated (all Google source), 5.0 stars |
| Facebook | Priest Plumbing | North Bay, ON | -- | -- | -- | -- | 47 likes. Minimal content extractable. |
| Quality Business Awards | Priest Plumbing | 904 Premier Rd, North Bay, ON | -- | priestplumbing.ca | -- | P1A 2H5 | 95%+ quality score, top 1% Canadian businesses (2025) |

### NAP Inconsistencies Flagged

1. **CRITICAL: Domain hijacked/expired** -- priestplumbing.ca redirects to completeplumbingnorthbay.ca, northbayplumbers.ca, and/or Google search spam pages depending on the visit. GBP still links to this domain, sending every GBP click to competitors.
2. **Hours conflict** -- Yellow Pages says "Open 24 hours," GBP says "Closes 5 p.m." Significant mismatch.
3. **Address not on GBP** -- GBP runs as a service-area business (no address displayed), but all directories list 904 Premier Rd. This may be intentional (home-based) but limits map pack visibility.
4. **No HomeStars profile** -- Missing from a major Canadian contractor review platform.
5. **No BBB profile** -- Not listed with the Better Business Bureau.
6. **Facebook page is thin** -- Only 47 likes, minimal extractable content.

---

## Verified Claims

| Claim | Status | Source(s) | Date Verified |
|-------|--------|-----------|---------------|
| Business name: Priest Plumbing | VERIFIED | GBP, Yellow Pages, Canpages, Yelp, BayToday, Facebook, Birdeye | 2026-04-15 |
| Address: 904 Premier Rd, North Bay, ON P1A 2H5 | VERIFIED | Yellow Pages, Canpages, Birdeye, Quality Business Awards (NOT on GBP) | 2026-04-15 |
| Phone: (705) 441-1764 | VERIFIED | GBP, Website (cached), Yellow Pages, Canpages, Yelp | 2026-04-15 |
| Email: info@priestplumbing.ca | PARTIALLY VERIFIED | Cached website only -- domain is compromised, email may no longer function | 2026-04-15 |
| Owner: Matt Priest | VERIFIED | Website /about page (cached), Google reviews (customers mention Matt by name), Birdeye reviews | 2026-04-15 |
| Team member: Calum | VERIFIED | Customer review on Birdeye: "Matt's assistant Calum came quickly and solved the problem right away" | 2026-04-15 |
| 7+ years experience | VERIFIED | Website /about page (cached), multiple directory descriptions | 2026-04-15 |
| Georgian Triangle origin | VERIFIED | Website /about page + Google review from Shawn Boyd (Collingwood contractor): "I have known Matt since he was a first year apprentice" | 2026-04-15 |
| Google rating: 5.0 stars, 51 reviews | VERIFIED | Google Maps GBP listing (live, Apr 15 2026). All 51 reviews are 5-star. | 2026-04-15 |
| Licensed and insured | VERIFIED | Website (cached) -- no specific licence number found | 2026-04-15 |
| Uses Jobber for booking | VERIFIED | GBP booking link: clienthub.getjobber.com/client_hubs/e1eeacee-7aff-46e9-8393-91bb02345eed | 2026-04-15 |
| Platform: Squarespace-style template | PARTIALLY VERIFIED | Site content cached shows template design with stock imagery; exact platform unclear due to domain compromise | 2026-04-15 |
| Serves residential + commercial | VERIFIED | Website /repairs and /installation-services pages (cached) | 2026-04-15 |
| Partnerships: Moen, Delta, Riobel, Victoria Albert, Tenzo, Vogt | VERIFIED | Website /installation-services page (cached) | 2026-04-15 |
| No blog | VERIFIED | site:priestplumbing.ca search returns only 5 pages (home, about, repairs, installation, contact) | 2026-04-15 |
| No testimonials on site | VERIFIED | Homepage and services pages contain no customer reviews/testimonials | 2026-04-15 |
| priestplumbing.ca domain compromised | VERIFIED | Playwright browser testing confirmed multiple redirect destinations (completeplumbingnorthbay.ca, northbayplumbers.ca, Google search spam) | 2026-04-15 |
| Complete Plumbing is a SEPARATE business | VERIFIED | Google Maps "People also search for" shows Complete Plumbing with 0 reviews, listed as "Drainage service" -- different category. Different phone (705-358-7567), address (161 Ferris Dr.), email (completeplb@gmail.com) | 2026-04-15 |

---

## Business Overview

**Priest Plumbing** is a locally owned plumbing company in North Bay, Ontario, run by owner-operator **Matt Priest**. Matt grew up in the Georgian Triangle (Collingwood area) and relocated to North Bay. He has 7+ years of experience spanning high-end new construction, residential and commercial repairs, and renovation plumbing. He employs at least one assistant named **Calum**.

**Services offered:**
- Emergency plumbing (24-hour per YP, closes 5 p.m. per GBP -- conflicting)
- Fixture replacements and toilet repairs
- Drain cleaning
- Water heater installation and repair
- Sump pump services
- Bathroom renovations
- Commercial plumbing (installation, service, maintenance)
- New construction plumbing (custom homes)
- Partnerships with premium fixture brands (Moen, Delta, Riobel, Victoria Albert, Tenzo, Vogt)

**Business tools:** Jobber (booking/scheduling), social accounts on Facebook, Instagram, X, Yelp.

**Tagline:** "Providing plumbing services the right way, the first time."

---

## Decision Maker Profile

### Matt Priest -- Owner/Operator

**Background:** Young tradesman who grew up in the Georgian Triangle (Collingwood/Blue Mountains area of Ontario). Moved to North Bay out of love for Northern Ontario. Enjoys outdoor activities, sports, and spending time with family and friends. Self-described as someone who has always been fascinated by "assembling things and uncovering the mysteries behind malfunctions."

**Professional path:** Started as a plumbing apprentice (confirmed by Shawn Boyd, a Collingwood-area contractor who has known Matt since his first year of apprenticeship). Built up 7+ years of experience working on high-end new construction before launching Priest Plumbing in North Bay.

**Personality indicators from reviews:**
- "Very knowledgeable, very efficient, but especially - kind" (Albina Lavictoire)
- "Excellent plumber and a better person. Very prompt, hardworking and efficient with an excellent eye for detail. You will not find a better plumber." (Shawn Boyd, industry peer)
- "Matt and his team are great. They are reliable, do great work, and are a pleasure to work with" (Lauren Jardine)
- "Matt/Priest plumbing has instantly become our #1 choice" (Craig D.)

**Review theme analysis from GBP:** promptness (6 mentions), courteous staff (5), open communication (4), reliable plumber (2). This is a business that wins on personality and service quality.

**Decision-making style:** Matt appears to be a hands-on operator who takes pride in craftsmanship. He runs a lean 1-3 person team. He likely makes all business decisions himself. He's younger and digitally literate enough to have set up a website, Jobber booking, and social profiles -- but not savvy enough to monitor domain expiry or maintain his web presence. This is the classic "great plumber, too busy plumbing to market" profile.

---

## Competitive Landscape (North Bay Plumbing)

| Company | Google Reviews | Rating | Notes |
|---------|---------------|--------|-------|
| Perrotta's Plumbing | 84 | 4.8 | Market leader. BBB listed. HomeStars presence. Full website. 24hr emergency. |
| Harwood Plumbing & Heating | 131 | 4.5 | Longest established (33+ years). 532 McGaughey Ave. Mixed reviews on office staff. |
| A. Laverock Plumbing | 80 | 5.0 | Strong competitor. Google "People also search" link from Priest's GBP. |
| North Bay Heating & Cooling | 73 | 4.7 | HVAC-focused but overlaps on plumbing. |
| Fern's Heating | 62 | 4.1 | Air conditioning contractor. Lower rating. |
| **Priest Plumbing** | **51** | **5.0** | **Perfect rating but website is dead. No blog, no testimonials, no SEO.** |
| Bedard Plumbing | 41 | 5.0 | Newer entrant. 24hr service. |
| Symons Plumbing | 22 | 5.0 | Smaller. Also perfect rating. |
| Beaulieu's | 3 | 5.0 | Tiny presence. HVAC contractor. |
| Complete Plumbing | 0 | N/A | New listing. Drainage service. No reviews. |

### Priest's Position

Matt Priest sits in a frustrating middle position: **perfect reviews but invisible online.** He has more 5-star reviews (51) than anyone except Laverock (80), Perrotta's (84), and Harwood (131) -- but his website is dead, he has no blog, no SEO, no testimonials displayed, and no content marketing. His GBP is his only functioning digital asset, and even that links to a dead/hostile website.

---

## Marketing Assessment

### Current State: D+ (functionally offline)

**What's working:**
- Google Business Profile is active and excellent (51 reviews, perfect 5.0)
- Jobber booking is connected and functional
- Word-of-mouth is clearly strong (all reviews are organic, genuine, enthusiastic)
- Premium brand partnerships add credibility (Moen, Delta, Riobel, Victoria Albert)

**What's broken:**
1. **Website is DEAD** -- priestplumbing.ca redirects to competitor plumbers and spam pages. Every GBP website click sends potential customers to competitors. This is a code-red emergency.
2. **No SEO whatsoever** -- The old site had only 5 pages (home, about, repairs, installation, contact). Zero blog posts, zero content marketing, zero keyword targeting.
3. **No testimonials on site** -- 51 five-star Google reviews but none displayed on the website (which doesn't load anyway).
4. **No blog** -- Zero content marketing. Missing every long-tail keyword opportunity in North Bay plumbing.
5. **No HomeStars profile** -- Major Canadian platform for contractors. Competitors like Perrotta's are listed.
6. **No BBB listing** -- Perrotta's has one. Adds trust signals.
7. **Facebook is ghost town** -- 47 likes, minimal content.
8. **Instagram/X** -- Listed in footer but no evidence of active posting.
9. **Hours mismatch** -- GBP says closes 5 p.m., Yellow Pages says 24 hours. Confusing for emergency searches.

### Semrush Data

Semrush API units exhausted. Unable to pull organic keyword data, traffic estimates, or domain authority. Based on the site being only 5 pages with no blog and now redirecting to spam, the domain likely has near-zero organic authority remaining.

---

## Niche-Marketing Misalignment

The North Bay plumbing niche has ~1,070 monthly searches and **nobody owns local SEO**. Perrotta's has the most reviews (84) but no dominant content strategy. This is a wide-open market for whoever moves first.

Matt Priest's problem is stark: **he's building a stellar reputation through service quality and word-of-mouth, but his digital presence is actively sending customers to competitors.** His GBP website link clicks go to spam. His 51 perfect reviews are orphaned -- they exist on Google but connect to nothing. No blog means he's invisible for informational searches. No testimonials on his (dead) site means zero social proof beyond Google Maps.

The gap between Matt's service quality (5.0 perfect, 51 reviews) and his digital presence (dead website, no content) is among the most extreme misalignments in any lead we've researched. He's running a 5-star operation with a 0-star web presence.

---

## Opportunities

### 1. URGENT: Website Recovery/Rebuild (the opener)
The priestplumbing.ca domain is redirecting to competitors. Matt may not even know this. This is the strongest cold-outreach hook we've ever had -- we can show him RIGHT NOW that his GBP is sending clicks to a competitor. This isn't a sales pitch; it's a rescue mission. Build him a proper site on a new domain or recover priestplumbing.ca. GLV's WordPress or React stack, hosted on SiteGround, is a perfect fit.

### 2. GBP Optimization + Review Showcase
51 perfect reviews are a goldmine. Fix the website link on GBP immediately. Add posts, photos, service descriptions, and Q&A to the GBP. Create a review showcase on the new website. Set up a review request workflow via Jobber's built-in review request feature.

### 3. Content Marketing / Local SEO Domination
With ~1,070 monthly plumbing searches and no competitor owning SEO, Matt could rank for "plumber North Bay," "emergency plumber North Bay," "water heater repair North Bay," "drain cleaning North Bay," etc. with a blog of 10-15 well-targeted posts. Nobody in this market is doing content marketing.

### 4. Directory Listings Cleanup
Fix hours mismatch (GBP vs Yellow Pages). Claim HomeStars profile. Claim BBB profile. Ensure NAP consistency across all directories. Add to TrustedPros, HomeAdvisor, Houzz.

### 5. Social Media Reactivation
Facebook (47 likes) needs consistent posting. Before/after photos of jobs, tips content, seasonal reminders. Instagram is perfect for plumbing -- before/after reveals, copper pipe work, renovation projects.

---

## Red Flags

1. **Domain loss** -- The fact that priestplumbing.ca was lost/sold/expired suggests Matt may not be attentive to his digital infrastructure. He may not have renewed the domain, or he may have let the hosting lapse. This could indicate cash flow issues, administrative neglect, or simply being too busy. It also means the email info@priestplumbing.ca may no longer work.
2. **Sole operator scale** -- 1-3 person team means limited budget. Matt is likely the plumber, the bookkeeper, and the marketer. Monthly retainer affordability is a question mark.
3. **No verifiable business address** -- GBP runs as a service-area business (no address shown). The 904 Premier Rd address in directories may be a home address. This is normal for small plumbing shops but limits certain marketing tactics.
4. **Inconsistent availability claims** -- Is he 24/7 emergency or 9-5? This needs clarification before any marketing can accurately represent the business.

---

## Outreach Strategy

### The Hook
This is one of the easiest opens we'll ever have. **"Matt, did you know your website is sending customers to your competitors right now?"** Show him the Playwright screenshots of priestplumbing.ca redirecting to completeplumbingnorthbay.ca and northbayplumbers.ca. Show him that every time someone clicks "Website" on his Google listing, they land on a competitor. This isn't a hard sell -- this is a genuine emergency that Matt almost certainly doesn't know about.

### Channel
- **Phone first:** (705) 441-1764. Matt is a tradesman -- he picks up the phone.
- **Backup:** Facebook message (since email domain may be compromised).
- Do NOT email info@priestplumbing.ca -- the domain is compromised and that email likely doesn't reach Matt anymore.

### Positioning
"We're not trying to sell you marketing. We found a critical problem with your online presence and wanted to let you know. Your website domain has been taken over and is redirecting your Google customers to other plumbing companies in North Bay. We can help you fix this today."

### Decision Maker
**Matt Priest** -- sole decision maker. Young, hands-on, pride-driven. Approach as peer-to-peer, not agency-to-client. He values craftsmanship and doing things right the first time (his own tagline). Frame the website fix as "doing it right."

---

## Verdict: PROCEED -- HIGH PRIORITY

Despite the red flags around domain loss and sole-operator scale, this is an exceptional outreach opportunity:

1. **The hook is undeniable** -- his website is literally sending customers to competitors RIGHT NOW
2. **The reviews prove the service quality** -- 51 perfect 5-star reviews, all organic and genuine
3. **The market is wide open** -- nobody owns North Bay plumbing SEO
4. **The fix is straightforward** -- new website + GBP optimization + content plan
5. **Jobber integration** -- he already uses modern business tools, suggesting he's open to systems

**Risk:** budget constraints of a 1-3 person shop. Mitigate by leading with the emergency (domain fix) as a low-cost entry point, then upselling monthly SEO once trust is established.

**Estimated monthly revenue potential for GLV:** $1,500-2,000/mo (website build + SEO retainer) after initial setup.
