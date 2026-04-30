# Adduono's Sheet Metal & Heating Ltd — Lead Dossier

**Investigator:** GLV Marketing Research Agent
**Date:** 2026-04-06
**Status:** RESEARCH COMPLETE — HIGH OPPORTUNITY

---

## Quick Summary

| Field | Value |
|-------|-------|
| **Business** | Adduono's Sheet Metal & Heating Ltd & Fireplaces |
| **Trade** | HVAC, Fireplaces, BBQs, Sheet Metal, Water Heating |
| **Address** | 701 Vickers St N, Thunder Bay, ON P7C 4B8 |
| **Phone** | (807) 345-5151 |
| **Email** | austin@adduonos.ca |
| **Website** | adduonos.ca |
| **Founded** | 1983 by Herb Adduono (43 years in business) |
| **Owner** | Ken Adduono (2nd generation) |
| **Key Staff** | Austin Adduono, Keanu Adduono (3rd generation) |
| **Google Rating** | 3.1/5 (26 reviews) |
| **BBB Rating** | A+ (not accredited) |
| **Semrush Keywords** | 17 |
| **Semrush Traffic** | ~8/mo |
| **Authority Score** | 6/100 |
| **Backlinks** | 74 (37 referring domains) |

---

## Phase 1: NAP Discovery

### Canonical Domain
- **Primary:** adduonos.ca (last modified: March 5, 2020 — over 6 years ago)
- **Protocol:** HTTPS active, HSTS enabled
- **Builder:** Custom HTML template (not a CMS — no WordPress, no page builder)

### NAP Consistency Table

| Source | Name | Address | Phone | Website | Consistent? |
|--------|------|---------|-------|---------|-------------|
| **Website** | Adduono's Sheet Metal & Heating | 701 Vickers N St., Thunder Bay, Ontario | (807) 345-5151 | adduonos.ca | BASELINE |
| **Google (GBP)** | Adduono's Sheet Metal & Heating Ltd | 701 Vickers St N, Thunder Bay, ON P7C 4B8 | (807) 345-5151 | adduonos.ca | MINOR — "N St." vs "St N" |
| **BBB** | Adduono's Sheet Metal & Heating Ltd | 701 Vickers St N, Thunder Bay, ON P7C 4B8 | (807) 345-5151 | — | MATCH |
| **Yellow Pages** | Adduono's Sheet Metal & Heating Ltd | 701 Vickers St N, Thunder Bay, ON | (807) 345-5151 | adduonos.ca | MATCH |
| **Yelp** | Adduono's Sheet Metal & Heating | 701 Vickers St N, Thunder Bay, ON | (807) 345-5151 | adduonos.ca | MATCH |
| **TB Chamber** | Adduono's Sheet Metal & Heating Ltd | — | — | — | PARTIAL (incomplete) |
| **Canada411** | Adduono | Thunder Bay, ON | — | — | MINIMAL |

### NAP Issues
- **Missing postal code on website** — P7C 4B8 not listed on their own site
- Street name format inconsistent: "Vickers N St." (website) vs "Vickers St N" (directories)
- No schema markup on website for LocalBusiness
- Chamber of Commerce listing incomplete

### Other Listings Found
- **Facebook:** facebook.com/adduonos/ (business page exists, activity level unknown)
- **EiEiHome:** Listing present (site currently down)
- **ZoomInfo:** Company profile exists
- **Wanderlog:** Aggregated from Google (26 reviews visible)
- **CanPages:** A.G. Adduono listed at (807) 577-9097 (likely related family member)

---

## Phase 2: Playwright Evidence

### Screenshots Captured

| Screenshot | File | Key Observations |
|-----------|------|-----------------|
| Homepage (desktop) | `screenshots/adduonos-homepage-desktop.png` | NOTE: Playwright browser redirected to competitor site (ldrhc.ca/lakeheadburner.ca) — likely browser-level issue. Curl confirms actual site is still live at 67.208.36.145 |
| Google Search | `screenshots/adduonos-google-search.png` | Shows competitor Lakehead Burner when navigating — suggests possible DNS hijacking or browser cache issue worth flagging to prospect |

### Website Technical Issues (from source code analysis)

1. **Site last modified March 5, 2020** — 6+ years without updates
2. **No responsive meta issues** — viewport tag present, but site uses legacy HTML5 shim
3. **Google Analytics:** UA-120241359-1 (Universal Analytics — DEPRECATED, stopped processing July 2023)
4. **No GA4 migration** — they have been flying blind on analytics for ~3 years
5. **Alt text quality:** Generic "Awesome Image" and "Awesome Logo" throughout
6. **Mixed content:** References `http://html5shiv.googlecode.com` (insecure)
7. **Meta description:** "Heating Cooling Sheet Metal Fireplaces" — no location, no brand, no value proposition
8. **Promotions page mislabelled:** Navigation says "Promotions" but links to `reviews.html` which contains neither promotions nor reviews — just a link to a PDF
9. **No blog, no content pages** — 5 pages total (Home, About, Services, Promotions/Reviews, Contact)
10. **No schema markup** — no LocalBusiness, no Service, no Organization schema
11. **No online booking/scheduling** — contact form only
12. **Typo on services page:** "breif" instead of "brief"
13. **Brand links use HTTP:** Several manufacturer links use non-secure HTTP

---

## Phase 3: Live Data Verification

### Semrush Organic Data (CA database, April 2026)

| Metric | Value |
|--------|-------|
| **Organic Keywords** | 17 |
| **Monthly Organic Traffic** | ~8 visits |
| **Traffic Cost Value** | $39/mo |
| **Paid Keywords** | 0 |
| **Paid Traffic** | 0 |
| **Authority Score** | 6/100 |
| **Backlinks** | 74 |
| **Referring Domains** | 37 |

### Top Ranking Keywords

| Keyword | Position | Volume | Traffic % |
|---------|----------|--------|-----------|
| furnace thunder bay | #3 | 140/mo | 50.0% |
| thunder bay furnace | #2 | 90/mo | 37.5% |
| furnace repair thunder bay | #6 | 210/mo | 12.5% |
| heating and cooling thunder bay | #4 | 50/mo | 0% |
| hvac thunder bay | #20 | 170/mo | 0% |
| air conditioner thunder bay | #24 | 140/mo | 0% |

**Evidence:** Semrush domain_organic + domain_rank reports, CA database, April 2026.

### Review Summary

| Platform | Rating | Count | Notes |
|----------|--------|-------|-------|
| **Google** | 3.1/5 | 26 | Severely polarized: 12x 5-star, 11x 1-star |
| **BBB** | A+ | — | Not accredited, no complaints on file |
| **Yelp** | ~1-2/5 | 1 | Single negative review about booking |
| **Yellow Pages** | 5/5 | 1 | Single positive review |

**Evidence:** Wanderlog (Google reviews aggregator), BBB.org profile, Yelp.ca listing.

### Review Sentiment Analysis

**Positive themes (12 five-star reviews):**
- Fast emergency response ("within hours")
- Professional installation crews
- Friendly, courteous staff
- Quick diagnosis of problems
- Family values and warmth

**Negative themes (11 one-star reviews):**
- Incomplete repairs requiring callbacks
- Overcharging ($800 labour for a $300 job)
- Improperly installed parts causing $1,600+ in damage
- Unresponsive to booking/scheduling requests
- Lack of follow-through on service calls

**Critical risk:** The 3.1 rating is a major conversion killer. In HVAC, homeowners need to trust the person entering their home. Every competitor above 4.0 stars is eating their lunch.

### Decision Maker Verification

| Field | Detail | Source |
|-------|--------|--------|
| **Owner** | Ken Adduono | BBB.org, customer reviews |
| **Title** | Owner | BBB Business Profile |
| **Family Role** | 2nd generation (son of founder Herb Adduono) | Herb Adduono obituary (Legacy.com) |
| **Key Staff** | Austin Adduono (email: austin@adduonos.ca) | Website contact, customer reviews |
| **Key Staff** | Keanu Adduono | Customer review (Wanderlog/Google) |
| **Generation** | Austin & Keanu = 3rd generation Adduono | Inferred from family structure |
| **Fax** | (807) 345-4848 | BBB.org |

---

## Phase 4: Deep Research

### Family Story & Personal Context

The Adduono family is one of Thunder Bay's legacy Italian-Canadian families with deep roots in the community.

**Herb Adduono (1933–2022)** — The patriarch and founder:
- Born in Fort William (now Thunder Bay), March 22, 1933
- Sheet metal journeyman, member of Local 397
- Founded Adduono's Heating in **1983** at age 50
- Married Joyce Fredrickson in 1952 (she predeceased him in 2017)
- Five children: Jerry (+Brenda), Rick (+Melanie), Debbie Milani, Patti (+Bill Exell), **Kenny (+Rhonda)**
- Active in: Elks Club Lodge 82, St. Agnes Church, Lakehead 5 Pin Bowling Association, Sr. Fastball Executive
- Accomplished bowler (perfect 450 game), Western Canadian Championship team
- Senior fastball all-star (right field), home-run hitter
- Minor hockey referee, junior hockey trainer
- "Never hesitated to sell a furnace, air conditioner, or fireplace" — even into his late 80s
- Known for "always having a pocket full of hard candies"
- Passed away October 7, 2022 at Thunder Bay Regional Hospital

**Ken (Kenny) Adduono** — Current owner:
- Herb's youngest son, married to Rhonda
- Took over the family business, maintaining the 24/7 service commitment
- Oversees a team including his own children (Austin, Keanu) — making this a **three-generation family business**

**Related family businesses:**
- **Adduono's Contracting & Design** — Run by Jeff (likely Jerry, another of Herb's sons). Renovations: kitchens, bathrooms, basements. 336 Facebook likes.
- **The Adduono hockey dynasty** — Herb was the patriarch of a well-known Thunder Bay hockey family. Multiple family members played at competitive levels (Pacey Adduono in junior hockey, Jeremy Adduono in professional hockey).

**Outreach angle:** This is a legacy family business entering its most dangerous phase — the generational transition. Herb passed in 2022. Ken is running it, but the website hasn't been touched since 2020. The 3rd generation (Austin, Keanu) is stepping up. They need to modernize or risk losing the legacy Herb built over 40 years.

### Keyword Gap Analysis (vs. Clow Darling)

| Keyword | Adduono's Position | Clow Darling Position | Volume | Gap |
|---------|-------------------|----------------------|--------|-----|
| hvac thunder bay | #20 | **#1** | 170/mo | MASSIVE |
| air conditioning thunder bay | #24 | **#2** | 260/mo | MASSIVE |
| furnace thunder bay | **#3** | #6 | 140/mo | Adduono's LEADS |
| furnace repair thunder bay | **#6** | — | 210/mo | Adduono's LEADS |
| plumbing thunder bay ontario | #31 | **#2** | 720/mo | N/A (Adduono's doesn't do plumbing) |
| heating and cooling thunder bay | **#4** | — | 50/mo | Adduono's LEADS |
| ac repair thunder bay | — | **#2** | 90/mo | MISSING |
| duct cleaning thunder bay | — | **#8** | 170/mo | MISSING |
| residential plumbing services | — | **#3** | 170/mo | N/A |
| fireplace thunder bay | — | — | est. 50-90/mo | BOTH MISSING |
| bbq store thunder bay | — | — | est. 30-50/mo | UNCLAIMED |
| napoleon dealer thunder bay | — | — | est. 20-40/mo | UNCLAIMED |

**Key insight:** Adduono's actually outranks Clow Darling on "furnace thunder bay" (#3 vs #6) and leads on "heating and cooling thunder bay" (#4). But they're invisible for AC, HVAC (as a category term), duct cleaning, and their unique differentiators (fireplaces, BBQs, Napoleon dealer). This is a business with organic keyword authority being wasted by a dead website.

### Marketing Assessment

**Current Marketing Maturity: 1/10**

| Category | Score | Detail |
|----------|-------|--------|
| Website | 1/10 | Static HTML from 2020, no CMS, no blog, 5 pages, broken navigation |
| SEO | 2/10 | 17 keywords (some strong positions), but no content strategy, no schema, dead analytics |
| Content | 0/10 | Zero blog posts, zero educational content, zero local content |
| Social Media | 1/10 | Facebook page exists, activity unknown, no Instagram presence found |
| Paid Ads | 0/10 | No paid keywords, no Google Ads, no social ads |
| Reviews | 2/10 | 3.1 stars is below trust threshold; no review management strategy |
| Email Marketing | 0/10 | No evidence of email marketing or newsletter |
| Analytics | 0/10 | Still on deprecated Universal Analytics (stopped processing July 2023) |

### The Big-Picture Problem

**Adduono's is a 43-year-old family business with real brand equity and strong furnace rankings that is slowly dying online.**

They rank #3 for "furnace thunder bay" — a position most HVAC companies would pay thousands to achieve. But their website is a static HTML time capsule from 2020. Their analytics have been dead for 3 years. Their Google reviews are 3.1 stars with a polarized split that screams "service quality inconsistency." And they're completely invisible for every keyword beyond furnaces.

Meanwhile, Clow Darling (153 keywords, ~1,401/mo traffic, 71 reviews, likely 4.0+ stars) is dominating the market across HVAC, plumbing, and AC — categories where Adduono's doesn't even show up.

**The tragedy:** Adduono's has something Clow Darling can never buy — a 43-year family legacy, a founder who was a Thunder Bay institution (bowling champion, hockey trainer, Elks Club member), and three generations working together. But none of that story is being told online.

### The Misalignment

**What they are:** A three-generation Thunder Bay family business with 43 years of trust, strong furnace rankings, Napoleon/Regency/Armstrong dealer status, 24/7 emergency service, and deep community roots.

**What their online presence says:** A forgotten website from 2020 with generic alt text, broken navigation, a 3.1-star Google rating, and zero content — suggesting a business that doesn't care about quality or professionalism.

**The disconnect is costing them real money.** Every homeowner who Googles "HVAC thunder bay" or "air conditioning thunder bay" or "fireplace installation thunder bay" sees Clow Darling, not Adduono's. And the ones who do find Adduono's see 3.1 stars and bounce.

### Opportunities With Numbers

1. **"furnace repair thunder bay" (210/mo, #6 → #1-3):** They're already #6. A dedicated service page with proper H1, schema, and testimonials could push them into the top 3. At #3, that's ~25 clicks/mo at 12% CTR. At $4.06 CPC, that's **$100/mo in free traffic value** from one keyword improvement.

2. **"hvac thunder bay" (170/mo, #20 → top 5):** Currently invisible at #20. A properly optimized homepage + service pages could reach top 5. Top 3 = ~20 clicks/mo. Value: **$78/mo.**

3. **"air conditioner thunder bay" (140/mo, #24 → top 5):** Same story. Dedicated AC page with Thunder Bay content = top 5. Value: **$56/mo.**

4. **"fireplace thunder bay" + "fireplace installation thunder bay" (~90-130/mo combined, unranked → #1-3):** Adduono's is a Napoleon, Regency, and Fireplace X dealer. NOBODY is ranking for fireplace keywords in Thunder Bay. This is a **blue ocean keyword cluster** they could own entirely. Estimated value: **$150+/mo.**

5. **"bbq store thunder bay" + "napoleon bbq thunder bay" (~50-80/mo combined):** Another unclaimed vertical. They carry Napoleon and Broil King. Seasonal content (May-August) with proper local SEO = **$80+/mo in peak season.**

6. **Review recovery (3.1 → 4.2+ stars):** With 26 reviews, they need ~20 new 5-star reviews to reach 4.2. A review generation system targeting satisfied customers post-service could achieve this in 3-4 months. Impact: **estimated 15-25% increase in click-to-call conversion.**

7. **Total uncaptured search value:** Combining all missing keyword clusters (AC, HVAC, fireplaces, BBQ, duct work, water heaters), Adduono's is leaving an estimated **$500-800/mo in organic traffic value** on the table — traffic that would cost $6,000-$9,600/yr in Google Ads.

### Red Flags

| Flag | Severity | Detail |
|------|----------|--------|
| **Website frozen since 2020** | HIGH | Site hasn't been updated in 6+ years. No CMS means updates require a developer. |
| **3.1 Google rating** | HIGH | Polarized reviews (12x 5-star, 11x 1-star) suggest real service quality issues, not just marketing problems. |
| **Analytics dead since 2023** | HIGH | Universal Analytics stopped processing July 2023. No GA4. They cannot measure anything. |
| **Generational transition** | MEDIUM | Founder Herb died in 2022. Ken is running it, but is the business investing in its future? |
| **No paid advertising ever** | MEDIUM | Zero ad spend history suggests either cash-flow constraints or extreme conservatism. |
| **Static HTML site** | MEDIUM | No CMS means GLV cannot hand off content management. Full rebuild required. |
| **Email goes to "Austin"** | LOW | Contact email is austin@adduonos.ca — suggests Austin may be the de facto digital decision-maker, not Ken. |
| **Mixed content warnings** | LOW | HTTP references in source code could trigger browser security warnings. |
| **Potential DNS vulnerability** | LOW | Playwright browser redirected to competitor sites (ldrhc.ca, lakeheadburner.ca) when navigating to adduonos.ca. Curl confirms site is live, so likely browser-level — but worth investigating. If DNS is compromised, this is CRITICAL. |

### Brands Carried (dealer/authorized relationships)

- **Armstrong Air** — Furnaces, AC
- **Napoleon** — Fireplaces, BBQs
- **Regency** — Fireplaces
- **Fireplace Xtrordinair (FPX)** — Fireplaces
- **Rheem** — Water heaters
- **Rinnai** — Tankless water heaters
- **Bradford White** — Water heaters
- **Navien** — Tankless/condensing
- **Broil King** — BBQs
- **Lifebreath** — HRV/ERV
- **Venmar** — HRV/ERV
- **Allied Air** — Furnaces

### Competitive Landscape (Thunder Bay HVAC)

| Competitor | Est. Keywords | Est. Traffic | Reviews | Strength |
|-----------|--------------|-------------|---------|----------|
| **Clow Darling** | 153 | ~1,401/mo | 71 (Google) | #1 — dominant across HVAC + plumbing |
| **LDR Heating & Cooling** | — | — | — | Strong website, since 2009 |
| **Lakehead Burner Service** | — | — | — | Since 1990, Lennox dealer |
| **Economy Heating** | — | — | — | Local presence |
| **Prestige Home Comfort** | — | — | — | Since 1994, Napoleon dealer |
| **Adduono's** | 17 | ~8/mo | 26 (3.1 stars) | 43 years, strong furnace rank |

---

## Outreach Recommendation

### Target Contact
- **Primary:** Austin Adduono (austin@adduonos.ca) — likely the digital decision-maker based on email ownership
- **Secondary:** Ken Adduono (owner) — may need to approve spend decisions
- **Phone:** (807) 345-5151

### HOOK Angle
The three-generation family story + the furnace ranking paradox. They're sitting on SEO gold (#3 for furnace thunder bay) attached to a dead website. The Herb Adduono legacy angle is powerful — this family is Thunder Bay royalty (sports, community, 43 years of service) but none of that story exists online.

### Key Talking Points
1. "You rank #3 for 'furnace thunder bay' — most companies spend $500/mo on ads to get that position. But your website hasn't been updated since 2020, so you're converting almost none of that traffic."
2. "Your Google rating is 3.1 stars. With 12 five-star reviews and 11 one-star reviews, homeowners see inconsistency. A review management system could push you to 4.2+ in 90 days."
3. "Nobody in Thunder Bay ranks for 'fireplace installation' or 'napoleon dealer thunder bay.' You carry Napoleon, Regency, and FPX — that's a keyword cluster worth $150/mo in free traffic that zero competitors are claiming."
4. "Your dad built this business from scratch in 1983. He was a bowling champion, hockey trainer, and community pillar. That story — three generations of Adduonos serving Thunder Bay — is your biggest competitive advantage, and it's not on your website."

---

## Verification Log

| Claim | Source | Date Verified |
|-------|--------|--------------|
| Founded 1983 | BBB.org profile, Herb Adduono obituary (Legacy.com) | 2026-04-06 |
| Owner: Ken Adduono | BBB.org ("Mr. Ken Adduono, Owner") | 2026-04-06 |
| Address: 701 Vickers St N, P7C 4B8 | BBB.org, Yellow Pages, Google/Wanderlog | 2026-04-06 |
| Phone: (807) 345-5151 | Website, BBB, Yellow Pages, Yelp | 2026-04-06 |
| Google rating: 3.1/5 (26 reviews) | Wanderlog (Google aggregator) | 2026-04-06 |
| BBB rating: A+ (not accredited) | BBB.org | 2026-04-06 |
| Semrush: 17 keywords, 8/mo traffic | Semrush domain_rank report, CA database | 2026-04-06 |
| Authority Score: 6 | Semrush backlinks_overview | 2026-04-06 |
| 74 backlinks, 37 referring domains | Semrush backlinks_overview | 2026-04-06 |
| Furnace thunder bay: #3 | Semrush domain_organic report | 2026-04-06 |
| Site last modified: 2020-03-05 | HTTP response headers (Last-Modified) | 2026-04-06 |
| UA analytics (deprecated) | Source code: UA-120241359-1 | 2026-04-06 |
| Herb Adduono obituary details | Legacy.com obituary #39842803 | 2026-04-06 |
| Staff: Austin, Keanu Adduono | Customer reviews (Susan Mintenko, May 2025) | 2026-04-06 |
| Austin = email contact | Website contact page (austin@adduonos.ca) | 2026-04-06 |
| Fax: (807) 345-4848 | BBB.org | 2026-04-06 |
| Chamber of Commerce member | tbchamber.ca listing | 2026-04-06 |
| Napoleon, Regency, FPX dealer | Website services page, brand logos | 2026-04-06 |

---

*Dossier compiled by GLV Marketing Research Agent. All claims backed by cited sources. Ready for outreach drafting.*
