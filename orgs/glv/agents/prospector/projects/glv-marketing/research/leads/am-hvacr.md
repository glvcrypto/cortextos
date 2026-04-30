# A.M HVAC/R -- Lead Dossier

**Investigator:** GLV Marketing Research Agent
**Date:** 2026-04-06
**Status:** OUTREACH READY
**Confidence:** MEDIUM (decision maker unconfirmed)

---

## Quick Profile

| Field | Value |
|-------|-------|
| Business Name | A.M HVAC/R |
| Trade | HVAC, refrigeration, heating, cooling |
| Owner / Decision Maker | **Unknown** -- initials "A.M." suggest first/last name; no public record found |
| Address | Not publicly listed (Thunder Bay, ON service area) |
| Phone | (807) 621-0095 |
| Email | amhvacr1@gmail.com |
| Website | amhvacr.ca (Jobber-powered landing page) |
| Instagram | @amhvacr |
| Facebook | Not found |
| Google Rating | Not confirmed (GBP listing not found in search) |
| Hours | Not specified publicly |
| TSSA Registration | Not confirmed in TSSA directory search |
| Client Portal | Jobber ClientHub (active) |

---

## Phase 1: NAP Discovery

### Canonical Domain

- **Primary:** amhvacr.ca
- **Platform:** Jobber-hosted landing page (NOT a custom website)
- **Single page only:** No subpages, no blog, no service pages, no about page
- **SSL:** Valid (Cloudflare)
- **Client Hub:** https://clienthub.getjobber.com/client_hubs/871803cb-651e-4715-aa7f-1aaf486d1c31/login/new

### NAP Consistency Table

| Source | Name | Address | Phone | Website | Consistent? |
|--------|------|---------|-------|---------|-------------|
| Website | A.M HVAC/R | Not listed | (807) 621-0095 | amhvacr.ca | PARTIAL -- no address |
| Google Search | A.M HVAC/R | Not found | Not found | amhvacr.ca | NOT VERIFIED |
| Yellow Pages | Not found | -- | -- | -- | NOT LISTED |
| ThreeBestRated | Not listed | -- | -- | -- | NOT LISTED |
| Yelp | Not found | -- | -- | -- | NOT LISTED |
| TrustedPros | Not found | -- | -- | -- | NOT LISTED |
| BBB Canada | Not found | -- | -- | -- | NOT LISTED |
| Facebook | Not found | -- | -- | -- | NOT LISTED |
| Thunder Bay Chamber | Not found | -- | -- | -- | NOT LISTED |

### NAP Issues Identified

1. **Zero directory presence** -- not listed on ANY major directory (Yellow Pages, Yelp, BBB, TrustedPros, ThreeBestRated, Facebook)
2. **No physical address published anywhere** -- critical for local SEO and customer trust
3. **Gmail email** (amhvacr1@gmail.com) -- not a professional domain email
4. **No Google Business Profile confirmed** -- invisible on Google Maps
5. **No TSSA registration found** -- may be registered under a different business name

---

## Phase 2: Playwright Evidence

### Screenshots Captured

| Screenshot | Path | Notes |
|------------|------|-------|
| Desktop Homepage | `screenshots/am-hvacr-homepage-desktop.png` | Jobber template page -- minimal branding |
| Redirect Behaviour | `screenshots/am-hvacr-redirect.png` | Browser redirected to competitor sites during testing |
| Redirect to Keenan | `screenshots/am-hvacr-redirect-keenan.png` | Second redirect captured -- may indicate ad injection or Jobber behaviour |

### Website Observations

**Evidence Block:**
```
Source: WebFetch + curl analysis
Date: 2026-04-06
Method: HTML inspection, WebFetch content extraction, curl -sI

Key findings:
- Platform: Jobber-hosted landing page (NOT a custom website)
- Title: "A.M HVAC/R: HVAC Services in Thunder Bay"
- Meta Description: "Leading HVAC company providing quality work and efficient equipment for residential and commercial properties. Specializing in HVAC services in Thunder Bay."
- H1: "Your trusted HVAC/R partner in Thunder Bay"
- No custom domain email -- uses amhvacr1@gmail.com
- "Powered by Jobber" in footer
- Client login available (suggests active customer base using Jobber CRM)
- Instagram link: @amhvacr (only social platform linked)
- curl returns HTTP 200 (site itself is live, not redirecting)
- Playwright browser experienced redirect issues -- likely Jobber JS or ad injection from browser state
```

### Site Structure

- **Single landing page** -- no subpages whatsoever
- **Sections:** Hero, Specialties (4 items), Services (12 listed), About, FAQ, Contact form
- **Services listed:** Installation, Repair, Maintenance, Refrigeration, Thermostat Replacement, Air Quality Testing, Emergency Services, Heat Pump Installation, Furnace Repair, AC Tune-Up, HVAC Inspections, Ventilation System Design
- **No testimonials on site**
- **No portfolio / project photos**
- **No team / about page with names or faces**
- **No schema markup** (Jobber templates do not include LocalBusiness schema)
- **No blog** -- zero content marketing
- **Contact form:** Jobber-powered estimate request form (functional)

### Mobile Assessment

- Jobber templates are responsive by default -- mobile likely functional
- No custom mobile optimization or testing possible due to Playwright instability
- Single-page format means mobile users see all content by scrolling

---

## Phase 3: Live Data Verification

### Semrush Data (Canada Database)

**Evidence Block:**
```
Source: Semrush API (ca database)
Date: 2026-04-06
Report: domain_organic

AM HVAC/R Organic Keywords (14 total):
Keyword                              | Position | Volume | Traffic%
-------------------------------------|----------|--------|--------
hvac thunder bay                     | 11       | 170    | 0.00%
ac repair thunder bay                | 14       | 90     | 0.00%
heating and cooling thunder bay      | 17       | 50     | 0.00%
r hvac                               | 12       | 50     | 0.00%
air conditioner thunder bay          | 39, 48   | 140    | 0.00%
air conditioner repair thunder bay   | 48, 54   | 170    | 0.00%
hvac/r                               | 39       | 70     | 0.00%
hvacr                                | 59, 79   | 260    | 0.00%
hvac r                               | 74       | 260    | 0.00%
hvac and                             | 51       | 2400   | 0.00%
air conditioning thunder bay         | 57       | 260    | 0.00%

Estimated monthly organic traffic: ~0
Estimated traffic cost: $0
```

### Competitor Comparison (Clow Darling -- #1 local)

**Evidence Block:**
```
Source: Semrush API (ca database)
Date: 2026-04-06
Report: domain_organic (clowdarling.com, top 20)

Clow Darling Key Rankings:
- "clow darling" -> #1 (720/mo)
- "plumbing thunder bay ontario" -> #2 (720/mo)
- "hvac thunder bay" -> #1 (170/mo)
- "air conditioning thunder bay" -> #2 (260/mo)
- "ac repair thunder bay" -> #2 (90/mo)
- "furnace thunder bay" -> #6 (140/mo)
- Total organic keywords: 153
- Estimated traffic: ~1,401/mo
- Established: 1937, ~26-91 employees, ~$6.2M revenue
- Google reviews: 71
```

### Keyword Gap Analysis

| Keyword | Monthly Volume | AM HVAC/R Position | Clow Darling Position | Gap |
|---------|---------------|-------------------|----------------------|-----|
| hvac thunder bay | 170 | #11 | #1 | -10 |
| furnace repair thunder bay | 210 | Not ranking | Ranking | MISSING |
| air conditioning thunder bay | 260 | #57 | #2 | -55 |
| ac repair thunder bay | 90 | #14 | #2 | -12 |
| heating and cooling thunder bay | 50 | #17 | Ranking | Close |
| furnace installation thunder bay | 70 | Not ranking | Ranking | MISSING |
| air conditioner repair thunder bay | 170 | #48 | Ranking | -46+ |
| emergency furnace repair thunder bay | 50 | Not ranking | Not ranking | OPPORTUNITY |
| heat pump thunder bay | 10 | Not ranking | Not ranking | UNCLAIMED |

### Total Addressable Local Search Volume

```
hvac thunder bay:                      170/mo
furnace repair thunder bay:            210/mo
air conditioning thunder bay:          260/mo
air conditioner repair thunder bay:    170/mo
ac repair thunder bay:                  90/mo
furnace installation thunder bay:       70/mo
emergency furnace repair thunder bay:   50/mo
heating and cooling thunder bay:        50/mo
heating thunder bay:                    20/mo
heat pump thunder bay:                  10/mo
---
TOTAL addressable:                   ~1,100/mo
AM HVAC/R currently capturing:         ~0/mo
```

### Reviews & Social Proof

| Platform | Rating | Reviews | Notes |
|----------|--------|---------|-------|
| Google (GBP) | Unknown | Unknown | GBP not confirmed in search results |
| Yellow Pages | -- | -- | Not listed |
| Yelp | -- | -- | Not listed |
| Facebook | -- | -- | No page found |
| TrustedPros | -- | -- | Not listed |
| ThreeBestRated | -- | -- | Not listed |
| Instagram | @amhvacr | Unknown | Account exists, data not extractable |

### Decision Maker Research

**Status: UNCONFIRMED**

- "A.M" in business name likely represents owner initials (first name + last name)
- No owner name found on website, directories, LinkedIn, Facebook, or business registries
- No TSSA registration found under "AM HVAC" -- may be registered under the owner's personal name
- Gmail email (amhvacr1@gmail.com) -- "1" suffix suggests the primary email was taken
- Jobber client hub is active, suggesting this is a real operating business with clients
- **Best approach:** Direct phone call to (807) 621-0095 to identify the owner

---

## Phase 4: Deep Research

### Business Assessment

**What They Are:** A.M HVAC/R is a small, likely sole-operator HVAC and refrigeration business in Thunder Bay. They use Jobber for job management and client communication, which indicates some level of business sophistication (scheduling, invoicing, CRM). They offer a broad range of services including refrigeration -- a differentiator from most residential-only competitors.

**What They're Not:** They are NOT a digitally visible business. Their entire online presence is a single Jobber landing page, an Instagram account, and possibly a GBP listing that does not surface in search results. They have zero directory listings, no custom website, no blog, no reviews visible online, and no social proof infrastructure.

### The Misalignment

A.M HVAC/R ranks #11 for "hvac thunder bay" (170/mo) and #14 for "ac repair thunder bay" (90/mo) with nothing more than a Jobber landing page. This means **Google is already acknowledging them as relevant** despite having no real website. This is extraordinarily rare and suggests either:

1. Their GBP (if it exists) is doing heavy lifting
2. The domain name (amhvacr.ca) contains exact-match keywords that boost rankings
3. There is minimal competition for certain HVAC keywords in Thunder Bay

The misalignment is clear: **they have latent organic authority but zero infrastructure to convert it.** Someone searching "hvac thunder bay" might find them at #11, click through, and land on a generic Jobber page with no testimonials, no photos, no team info, no pricing guidance -- and bounce to Clow Darling at #1 with 71 reviews and a full website.

### Market Context

- **Thunder Bay HVAC market:** ~1,952/mo total search volume (per niche context)
- **#1 competitor Clow Darling:** 153 keywords, ~1,401/mo traffic, 71 Google reviews, est. 1937, $6.2M revenue
- **AM HVAC/R:** 14 keywords, ~0/mo traffic, 0 confirmed reviews, unknown years in business
- **Other competitors:** Buhler Mechanical (Lennox dealer), LDR Heating & Cooling (50+ years), Klimit Mechanical, Aire Serv (franchise), D.Peppard Mechanical, Lakehead Burner Service (29+ years), Thermal Mechanical, Allam Heating & Cooling
- **Market saturation:** Moderate -- roughly 10-15 active HVAC providers in Thunder Bay
- **Key demographic:** Homeowners 35-65, median income $77,500, extreme winters (-40C common), heating is life-critical

### Opportunities With Numbers

1. **Custom website replacing Jobber page** -- A proper 5-10 page website with service pages targeting "furnace repair thunder bay" (210/mo), "air conditioning thunder bay" (260/mo), and "furnace installation thunder bay" (70/mo) could capture 50-100 visits/month within 6 months. At a 5% conversion rate, that is 2.5-5 new leads/month.

2. **Google Business Profile optimization** -- If GBP exists but is unoptimized, or doesn't exist, creating/claiming it with proper categories (HVAC Contractor, Furnace Repair Service, Air Conditioning Contractor), photos, and review solicitation could put them in the Map Pack for "hvac thunder bay" and "furnace repair thunder bay." Map Pack captures ~42% of local clicks.

3. **Directory blitz** -- Zero listings on Yellow Pages, Yelp, BBB, TrustedPros, ThreeBestRated, HomeStars, Facebook. Adding 10-15 consistent directory listings would build citation authority and could push their #11 ranking for "hvac thunder bay" into the top 5 within 3-4 months.

4. **"Emergency furnace repair thunder bay" (50/mo)** -- Neither AM HVAC/R nor Clow Darling ranks for this. With a dedicated page and GBP post strategy, this is a quick win. Emergency calls are high-intent, high-margin ($300-800 per call).

5. **"Heat pump thunder bay" (10/mo, but rising trend)** -- Heat pump adoption is accelerating due to federal Greener Homes Grant. First-mover advantage is available. Content + GBP posts about heat pump installation could capture this growing segment.

6. **Refrigeration differentiation** -- Most Thunder Bay HVAC companies focus on residential heating/cooling. AM HVAC/R lists refrigeration services. A commercial refrigeration page targeting restaurants, grocery stores, and cold storage facilities would be a unique niche with virtually zero competition.

7. **Review generation** -- Jobber has built-in review request features. If AM HVAC/R has active clients (their Jobber ClientHub suggests they do), they could automate review requests and build from 0 to 20+ Google reviews within 6 months.

### Red Flags

1. **No confirmed decision maker** -- Outreach email/phone may reach a sole operator who is too busy turning wrenches to respond to marketing pitches. Timing of outreach matters (early morning or evening).

2. **Gmail email + Jobber site = potential budget sensitivity** -- This operator may be bootstrapping hard and resistant to monthly marketing spend. Lead with ROI and low-barrier entry (e.g., GBP optimization + directory listings first, website later).

3. **No confirmed GBP** -- If they don't have a Google Business Profile, they are invisible on Google Maps. But it also means they may not understand the value of online presence at all.

4. **TSSA registration not found** -- Could be registered under a different business entity name. Not necessarily a compliance issue, but worth noting. Do not raise this in outreach.

5. **Sole operator risk** -- If this is a one-person operation, they may have capacity constraints that make marketing-driven lead growth a problem (too many leads, can't service them). Frame the pitch around quality leads, not volume.

6. **Jobber dependency** -- Their "website" is a Jobber template. If they cancel Jobber, their web presence disappears entirely. This is a vulnerability that could be framed as a risk in outreach.

### Outreach Angle

**Hook:** "You're ranking #11 for 'hvac thunder bay' -- a keyword worth 170 searches/month -- with nothing but a Jobber page. Imagine where you'd be with a real website."

**Why it works:** This is a verifiable, flattering fact. It shows they're already doing something right (Google notices them), but leaving money on the table. The gap between #11 and top-5 is bridgeable with basic SEO and a proper website.

**Approach:** Phone first (807-621-0095). Sole operators in trades respond better to calls than emails. If no answer, follow up with email to amhvacr1@gmail.com. Keep it short -- trades people delete long emails.

**CASL compliance:** One commercial electronic message permitted without consent for inquiry purposes. Phone call is not regulated by CASL.

---

## Verification Log

| Check | Source | Result | Date |
|-------|--------|--------|------|
| Domain live | curl -sI amhvacr.ca | HTTP 200 OK (Cloudflare) | 2026-04-06 |
| Website content | WebFetch | Jobber landing page, single page, 12 services listed | 2026-04-06 |
| Phone number | Website | (807) 621-0095 | 2026-04-06 |
| Email | Website | amhvacr1@gmail.com | 2026-04-06 |
| Semrush organic | API (ca) | 14 keywords, ~0 traffic, #11 for "hvac thunder bay" | 2026-04-06 |
| Semrush competitor | API (ca) | Clow Darling: 153 keywords, #1 for "hvac thunder bay" | 2026-04-06 |
| Keyword volumes | Semrush phrase_these | Total addressable ~1,100/mo across 10 core terms | 2026-04-06 |
| Yellow Pages | WebFetch | NOT LISTED | 2026-04-06 |
| ThreeBestRated | WebFetch | NOT LISTED | 2026-04-06 |
| Yelp | WebSearch | NOT LISTED | 2026-04-06 |
| BBB Canada | WebSearch | NOT LISTED | 2026-04-06 |
| Facebook | WebSearch | NOT FOUND | 2026-04-06 |
| TrustedPros | WebSearch | NOT LISTED | 2026-04-06 |
| Instagram | WebSearch | @amhvacr exists, data not extractable | 2026-04-06 |
| TSSA directory | WebFetch | NOT FOUND (may be under different name) | 2026-04-06 |
| Decision maker | Multiple searches | UNCONFIRMED | 2026-04-06 |
| Desktop screenshot | Playwright | Captured (with redirect issues noted) | 2026-04-06 |
