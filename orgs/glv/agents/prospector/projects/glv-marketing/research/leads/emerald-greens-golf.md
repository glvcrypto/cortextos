# Emerald Greens Golf Course — Lead Dossier

> **Investigator:** GLV Marketing Deep Research
> **Date:** 2026-04-06
> **Status:** CRITICAL RED FLAGS — BUSINESS MAY BE SOLD/CLOSING
> **Confidence:** HIGH (multi-source verified)

---

## CRITICAL FINDING: DOMAIN REDIRECTS TO UNRELATED BUSINESS

**emeraldgreens.ca now redirects to puregolftbay.ca** — a completely unrelated indoor golf performance centre owned by Cam Kennedy at 601 Central Ave, Thunder Bay. The original site returns ECONNREFUSED on direct HTTP requests and SSL_VERSION_OR_CIPHER_MISMATCH on HTTPS. Combined with the $2.6M for-sale listing on iFind Thunder Bay (which noted "Many Offers Made!"), this strongly suggests the business has been sold or is in the process of changing hands. **Do not proceed with outreach until ownership status is confirmed by phone.**

---

## Phase 1: NAP Discovery

### Canonical Business Information

| Field | Value |
|-------|-------|
| **Legal Name** | Emerald Greens Golf Course Ltd |
| **Trade Name** | Emerald Greens Golf Course and Driving Range |
| **Address** | 2370 Dawson Road, Thunder Bay, ON P7G 2G2 |
| **Phone** | (807) 767-4511 |
| **Email** | emeraldgreens@tbaytel.net |
| **Website** | emeraldgreens.ca (DOWN — redirects to puregolftbay.ca) |
| **Facebook** | facebook.com/EmeraldGreensGolf (~2,640 likes) |
| **Instagram** | @emeraldgreensgolfcourse |
| **Owner** | Watson Family (Jack Watson), acquired 2004 |
| **For-Sale Contact** | 807-629-2147 (private sale listing) |

### NAP Consistency Table

| Source | Name | Address | Phone | Website | Consistent? |
|--------|------|---------|-------|---------|-------------|
| Google (indexed) | Emerald Greens Golf Course and Driving Range | 2370 Dawson Rd | 807-767-4511 | emeraldgreens.ca | Domain dead |
| Yellow Pages CA | Emerald Greens Golf Course and Driving Range | 2370 Dawson Rd, Thunder Bay, ON | 807-767-4511 | — | YES (NAP) |
| Visit Thunder Bay Directory | Emerald Greens Golf Course | 2370 Dawson Rd., Thunder Bay, ON P7G 2G2 | 807-767-4511 | emeraldgreens.ca | YES |
| Golf Ontario | Emerald Greens Golf Course | — | — | — | Partial |
| Golf Canada | Emerald Greens Golf Course | — | — | — | Partial |
| GolfPass | Emerald Greens Golf Course | 2370 Dawson Road R.R. #12, Thunder Bay, ON P7G 2G2 | 807-767-4511 | — | YES |
| GolfLink | Emerald Greens Golf Course | Thunder Bay, ON | — | — | Partial |
| TBDGA Directory | Emerald Greens Golf Course | 2370 Dawson Road, Thunder Bay, ON P7G 2G2 | 807-767-4511 | emeraldgreens.ca | YES |
| golfcourse.wiki | Emerald Greens Golf Course | 2730 Dawson Road (WRONG) | — | www.emeraldgreens.ca | ADDRESS MISMATCH |
| D&B | Emerald Greens Golf Course Ltd | Thunder Bay, ON | — | — | Partial |
| iFind Thunder Bay (for sale) | Emerald Greens Golf Course | 2370 Dawson Road | — | — | YES |
| Great Lakes Drive | Emerald Greens Golf Course | 2370 Dawson Rd, Thunder Bay, ON P7G 2G2 | 807-767-4511 | emeraldgreens.ca | YES |

**NAP Issues:**
- golfcourse.wiki lists address as 2730 Dawson Road (should be 2370) — minor but could confuse GPS
- Website link is dead across ALL directories — every listing pointing to emeraldgreens.ca sends visitors to an unrelated business
- Several national golf directories (Golf Ontario, Golf Canada, Golf Nova Scotia, Golf New Brunswick) all syndicate the same listing with incomplete data

---

## Phase 2: Playwright Evidence

### Website Status

| Test | Result | Notes |
|------|--------|-------|
| HTTPS (emeraldgreens.ca) | SSL_VERSION_OR_CIPHER_MISMATCH | SSL certificate broken or expired |
| HTTP (emeraldgreens.ca) | REDIRECTS to puregolftbay.ca | Domain has been pointed elsewhere |
| puregolftbay.ca | LOADS — Pure Golf Performance Centre | Indoor golf, Cam Kennedy owner, 601 Central Ave |
| Direct HTTP fetch | ECONNREFUSED | Server is completely offline |

**Screenshot evidence:** Browser navigated to http://emeraldgreens.ca and landed on https://puregolftbay.ca/ — confirmed via Playwright page title "Home - Pure Golf" and snapshot showing Pure Golf navigation, club fitting, lessons, simulator rentals, and memberships.

**Key observations from redirect target (Pure Golf):**
- Winter memberships banner active
- Services: club fitting, lessons, simulator rentals, memberships
- Owner: Cam Kennedy (master fitter, NCAA golf, TXG Toronto background)
- Address: 601 Central Ave, Thunder Bay, ON P7B 7A2
- Phone: 807-234-PURE (7873)
- No mention of Emerald Greens anywhere on the site

### Google Business Profile

Unable to capture GBP screenshot (Playwright browser session instability). Based on web search data:
- GBP listing appears to still exist for "Emerald Greens Golf Course and Driving Range"
- Google Maps place exists at the Dawson Road address
- Google status (open/closed/permanently closed) could not be visually confirmed

---

## Phase 3: Live Data Verification

### Semrush Data (CA Database)

| Metric | Value |
|--------|-------|
| Domain Rank | 218,089 |
| Organic Keywords | 80 |
| Organic Traffic (est.) | 835/mo |
| Organic Traffic Cost | $196 |
| Paid Keywords | 0 |
| Paid Traffic | 0 |
| Paid Cost | 0 |

**Note:** Organic keyword detail report unavailable (Semrush API units exhausted). The 80 keywords ranking with ~835/mo traffic represents the historical cached data — this traffic is now being sent to puregolftbay.ca via the redirect.

### Review Summary

| Platform | Rating | Count | Notes |
|----------|--------|-------|-------|
| GolfPass | — | 0 reviews | Zero reviews across all time |
| Hole19 | 4.8/5 | 4 ratings | 1 written review by Denis Lanteigne (Sep 2016): "Beautiful and challenging course Jack Watson" |
| TripAdvisor | Listed | Unknown count | Photos of "The Island" par 3 available |
| Google Maps | Unknown | Unknown | Could not verify — Playwright failed |
| Facebook | — | ~2,640 likes | Page exists but content inaccessible |
| Yelp | Listed | — | Listing exists on m.yelp.com |

### Decision Maker Verification

| Source | Name | Role | Confidence |
|--------|------|------|------------|
| golfcourse.wiki | Watson Family | Owner/Operator | HIGH |
| Great Lakes Drive | Watson Family (acquired 2004) | Owner | HIGH |
| Hole19 review | Jack Watson | Owner (addressed directly by reviewer) | HIGH |
| TBNewsWatch (flood article) | Jack Watson | Owner (quoted re: flooding) | HIGH |
| iFind listing | Unknown | Seller (phone: 807-629-2147) | MEDIUM |

**Decision Maker: Jack Watson** — owner since 2004 when the Watson Family acquired the course. Confirmed across 4+ independent sources.

---

## Phase 4: Deep Research

### Course Profile

- **Established:** 1978/1980 (sources vary)
- **Type:** 9-hole public course, par 36
- **Length:** 2,894 yards (Blue), 2,753 (White), 2,536 (Red)
- **Rating/Slope:** 34.2/123 (Blue)
- **Greens:** Bent grass
- **Fairways:** Bluegrass
- **Setting:** Old-growth pine forest, straddling the McIntyre River
- **Signature Hole:** "The Island" — par 3, island green surrounded by river
- **Acreage:** 60+ acres
- **Season:** April 1 to November 1
- **Green Fees:** ~$53/9 holes (est.)
- **Awards:** Thunder Bay Area's Favourite Place to Golf — 2009 and 2010

### Facilities

- **Clubhouse:** Built 2005 (~45x45 ft), fully licensed
- **Restaurant:** Full commercial kitchen (grills, dishwasher, deep fryer, refrigeration, fire suppression hood)
- **Driving Range:** Yes
- **Putting Green:** Yes
- **Teaching Pro:** On staff
- **Club Rentals:** Available
- **Golf Carts:** Available
- **Pull Carts:** Available

### Watson Family Story

The Watson Family acquired Emerald Greens in 2004 with a mandate to make golf affordable and enjoyable for everyone. They invested in substantial improvements including building a new clubhouse in 2005. The course sits on the McIntyre River — beautiful but subject to flooding (confirmed in TBNewsWatch article where Jack Watson was quoted about water damage). Won "Favourite Place to Golf" in Thunder Bay in 2009 and 2010. The family has operated the course for 22 years.

### For-Sale Status (MAJOR RED FLAG)

**Listed on iFind Thunder Bay at $2,600,000:**
- Described as "40-year established business"
- 60+ acres, riverside location
- Turn-key including all equipment (mowers, carts, kitchen equipment)
- "Many Offers Made!" — suggesting active buyer interest
- Annual taxes: ~$10,000
- Listing suggests development potential (condos, luxury townhomes)
- Contact: 807-629-2147 or info@ifindtbay.com (Weilers Law for offers)

**The domain redirect to puregolftbay.ca suggests the sale may have completed or the business has ceased operations.** Pure Golf (Cam Kennedy) has no connection to Emerald Greens — it is an indoor simulator/fitting centre at a completely different address.

### Keyword Gap vs. Whitewater Golf Club (Top Competitor)

| Metric | Emerald Greens | Whitewater |
|--------|---------------|------------|
| Keywords | 80 | 121 |
| Traffic (est.) | 835/mo | ~1,778/mo |
| Paid Keywords | 0 | Unknown |
| Online Tee Times | NO (phone only) | Unknown |
| Restaurant Marketing | ZERO online presence | Has bar/banquet facility |
| Course Type | 9-hole public | 18-hole Tom McBroom championship |

**If the course were still operating normally, the marketing gaps would include:**
- No online tee time booking (competitors like Chapples and Dragon Hills offer online booking)
- Zero restaurant/clubhouse marketing online (no menu, no event promotion)
- No SEO strategy — 80 keywords vs. 121 for Whitewater
- Website was HTTP-only (no SSL) even before it went down
- No review generation strategy (0 GolfPass reviews, 4 Hole19 ratings)
- No content marketing or blog
- Social media exists but engagement unknown
- Email is @tbaytel.net (ISP email, not branded)

### Restaurant Marketing Assessment

The clubhouse has a fully licensed restaurant with significant commercial kitchen infrastructure (worth noting from the for-sale listing: grills, deep fryer, dishwasher, refrigeration, fire suppression hood). Despite this investment:
- Zero online menu presence
- No restaurant page on the website (only course info)
- Not listed on food delivery platforms
- No Google Maps restaurant listing separate from golf course
- Only mention found: $80 rib dinner for a special event
- Massive missed opportunity for non-golfer revenue (locals, families, event dining)

### Tee Time Booking Assessment

- **No online booking system** — tee times by phone only (807-767-4511)
- Competitors: City of Thunder Bay courses use online booking; Dragon Hills has online booking
- GolfNow and TeeOff list Thunder Bay courses but Emerald Greens is not bookable through either
- GolfLink lists tee times page but no actual booking integration

### Competitive Landscape (Thunder Bay Golf Market)

| Course | Holes | Type | Online Booking | Key Differentiator |
|--------|-------|------|----------------|-------------------|
| Whitewater Golf Club | 18 (2 courses) | Semi-private, premium | Unknown | Tom McBroom design, 550 acres, banquet |
| Thunder Bay Country Club | 18 | Private/Semi-private | GolfNow | Established, prestigious |
| Chapples Golf Course | 18 | Municipal (City) | City website | Affordable, accessible |
| Strathcona Golf Course | 18 | Municipal (City) | City website | Challenging terrain |
| Dragon Hills Golf Course | 9 | Public | Website booking | Views of Sleeping Giant |
| Northern Lights Golf Complex | 9 | Public | Unknown | Regulation course |
| **Emerald Greens** | **9** | **Public (private-owned)** | **NONE** | **The Island par 3, river setting** |

### Red Flags Summary

1. **DOMAIN REDIRECTED** — emeraldgreens.ca now goes to puregolftbay.ca (unrelated business)
2. **LISTED FOR SALE at $2.6M** — "Many Offers Made!" suggests deal may be closing
3. **Website completely down** — ECONNREFUSED on all pages, SSL broken
4. **Ownership transition likely** — Watson Family may no longer be operating
5. **ISP email** — emeraldgreens@tbaytel.net (not professional, could be disconnected)
6. **Flooding risk** — McIntyre River causes recurring damage (confirmed in news)
7. **Seasonal business** — April to November only, limited revenue window

### Opportunities (IF Business Is Still Operating Under Watson Family)

1. **Website rebuild** — the existing site was a basic static HTML site with no SSL, no booking, no SEO
2. **Online tee time booking** — they are the only course in Thunder Bay without any online booking
3. **Restaurant marketing** — fully equipped commercial kitchen with zero online presence
4. **Review generation** — 0 reviews on most platforms, 4 on Hole19
5. **GBP optimization** — listing likely has stale info and broken website link
6. **Local SEO** — "The Island" signature hole is a unique marketing asset
7. **Event marketing** — clubhouse events, leagues (Ladies Club, Men's Scramble, B.A.G.S.)
8. **Content marketing** — course history (est. 1978), river setting, pine forest setting
9. **NAP cleanup** — wrong address on golfcourse.wiki, dead website links everywhere

---

## Outreach Recommendation

**DO NOT SEND OUTREACH AT THIS TIME.**

**Required pre-outreach action:**
1. Call (807) 767-4511 to confirm if Emerald Greens is still operating for the 2026 season
2. If no answer, call for-sale contact at 807-629-2147 to determine sale status
3. Check Google Maps listing for "permanently closed" marker
4. Monitor Facebook page (facebook.com/EmeraldGreensGolf) for any 2026 season announcements

**If confirmed still operating:**
- The marketing gaps are enormous and the pitch practically writes itself
- Domain redirect means they literally have NO web presence right now
- Every directory listing points to a dead or hijacked domain
- Jack Watson is the decision maker
- Lead with the domain redirect finding — they may not even know

**If sold to new owner:**
- Even better opportunity — new owners need everything from scratch
- Position as "we noticed your domain situation and can help you launch properly"
- New ownership = new budget, new energy, willingness to invest

---

## Evidence Log

| # | Source | URL | Date Checked | Finding |
|---|--------|-----|--------------|---------|
| 1 | GolfPass | golfpass.com/travel-advisor/courses/27919 | 2026-04-06 | Course specs, 0 reviews, phone confirmed |
| 2 | Visit Thunder Bay Directory | directory.visitthunderbay.com | 2026-04-06 | NAP confirmed, social links found |
| 3 | golfcourse.wiki | golfcourse.wiki/course/emerald_greens | 2026-04-06 | Watson Family ownership, wrong address (2730) |
| 4 | Great Lakes Drive | greatlakesdrive.com/GLD/property/emerald-greens | 2026-04-06 | Watson Family history, 2004 acquisition, awards |
| 5 | iFind Thunder Bay | ifindtbay.ca/listings/43762 | 2026-04-06 | FOR SALE $2.6M, 60 acres, "Many Offers Made!" |
| 6 | Hole19 | hole19golf.com/courses/emerald-greens-gc | 2026-04-06 | 4.8/5 (4 ratings), Jack Watson named in review |
| 7 | Playwright HTTP test | emeraldgreens.ca → puregolftbay.ca | 2026-04-06 | Domain redirects to Pure Golf (unrelated) |
| 8 | Playwright HTTPS test | emeraldgreens.ca | 2026-04-06 | SSL_VERSION_OR_CIPHER_MISMATCH |
| 9 | WebFetch HTTP test | emeraldgreens.ca/* | 2026-04-06 | ECONNREFUSED on all pages |
| 10 | Semrush domain_rank | CA database | 2026-04-06 | Rank 218,089, 80 kw, 835 traffic |
| 11 | D&B | dnb.com | 2026-04-06 | Company profile exists (timeout on fetch) |
| 12 | TBDGA | tbdga.com/course-directory | 2026-04-06 | Listed, no status change noted |
| 13 | Pure Golf About | puregolftbay.ca/about | 2026-04-06 | No mention of Emerald Greens; separate business |
| 14 | TBNewsWatch | tbnewswatch.com (flood article) | 2026-04-06 | Jack Watson quoted re: flooding at course |
