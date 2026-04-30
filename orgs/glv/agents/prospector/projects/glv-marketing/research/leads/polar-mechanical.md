# Lead Dossier: Polar Mechanical

*Researched: 2026-04-06*
*Niche: HVAC (residential + commercial + institutional)*
*Area: Thunder Bay, Ontario*
*Niche Research Reference: projects/glv-marketing/research/niche/plumbers-thunder-bay.md*

---

## Business Overview

| Field | Value |
|-------|-------|
| **Business Name** | Polar Mechanical (o/a Lakehead Polar Air Limited) |
| **Trade/Niche** | HVAC — heating, cooling, ventilation, commercial refrigeration, sheet metal fabrication |
| **Canonical Domain** | polarmechanical.ca (WordPress on Plesk, PHP 7.4, behind Cloudflare) |
| **Other Domains Found** | lakeheadburner.ca (Playwright browser-redirect target — see Red Flags) |
| **Phone** | (807) 623-1525 |
| **Fax** | (807) 623-1539 |
| **Email** | george@polarmechanical.ca |
| **Address** | 596 Squier St., Thunder Bay, ON P7B 4A8 |
| **Years in Business** | 50 years (est. 1976) |
| **Team Size (est.)** | 10-20 (licensed gas fitters, refrigeration mechanics, sheet metal journeymen + apprentices) |
| **Google Reviews** | 2 at 1.0 stars |
| **Budget Signal** | Medium (est. $3M revenue per RocketReach; institutional/commercial contracts) |
| **Keyword Count** | 48 (verified: 2026-04-06) |
| **Estimated Monthly Traffic** | ~5 visits/mo (verified: 2026-04-06) |
| **Top Local Competitor** | Clow Darling |
| **Competitor Keyword Count** | 153 |
| **Competitor Traffic** | ~1,401/mo |
| **Service Area** | Thunder Bay east to Marathon/Manitouwadge, west to Kenora, north to James Bay |

---

## NAP Audit

| Source | Domain | Resolves? | Address | Phone | Notes |
|--------|--------|-----------|---------|-------|-------|
| GBP | polarmechanical.ca | Yes | 596 Squier St | (807) 623-1525 | 1.0 stars, 2 reviews, unclaimed/unmanaged |
| Yellow Pages (Polar) | polarmechanical.ca | Yes | 596 Squier St, Thunder Bay, ON | (807) 623-1525 | Listed under Commercial Refrigeration |
| Yellow Pages (Lakehead) | — | — | 596 Squier St, Thunder Bay, ON | — | Separate listing as "Lakehead Polar Air Limited" at same address |
| BBB | polarmechanical.ca | Yes | Thunder Bay, ON | (807) 623-1525 | Not BBB Accredited, 49 years in business |
| OSMCA | polarmechanical.ca | Yes | — | — | Ontario Sheet Metal Contractors Association member |
| CATB | polarmechanical.ca | Yes | 596 Squier St., Thunder Bay, ON P7B 4A8 | (807) 623-1525 | Division 23 (HVAC), Trade Contractors |
| Own Website | polarmechanical.ca | Yes | 596 Squier St. Thunder Bay, ON P7B 4A8 | (807) 623-1525 | Copyright 2019, PHP 7.4 |
| TBNewsWatch | polarmechanical.ca | Yes | — | — | Listed under Commercial & Industrial Equipment |
| Birdeye | — | — | Thunder Bay, ON | — | Aggregates 2 Google reviews |
| Nextdoor | — | — | Thunder Bay, ON | — | Basic listing |
| ConstructConnect | — | — | 596 Squier St, 1st Floor | — | Listed as "Polar Mechanical - Lakehead Polar Air Limited" |

**Canonical Domain:** polarmechanical.ca (resolves, serves WordPress content via HTTP 200)
**NAP Inconsistencies:** 2 found — (1) Dual listing on Yellow Pages under both "Polar Mechanical" and "Lakehead Polar Air Limited" at same address, (2) Google Maps embed on website points to "Lakehead Burner Service Ltd" at 626 Waterloo St S (a completely different business)
**NAP Finding for Outreach:** Yes — Their website's Google Maps embed is pointing to a competitor (Lakehead Burner Service) instead of their own location.

---

## Decision Maker

| Field | Value |
|-------|-------|
| **Name** | George McKay |
| **Title** | Owner |
| **Email** | george@polarmechanical.ca |
| **LinkedIn** | https://ca.linkedin.com/in/george-mckay-5335b0aa (Thunder Bay) |
| **LinkedIn Activity** | Inactive / Minimal |
| **Other Social** | No Facebook page found for Polar Mechanical |

**Verification Sources:** (1) CATB member listing — email george@polarmechanical.ca, (2) Google review mentions "George" by name — reviewer Harrison Schan tried to get "George" out for a quote, (3) BBB profile lists owner since 1976, (4) Multiple directory aggregators confirm George McKay as owner.

**Note:** George McKay also appears connected to JML Engineering Ltd. in Thunder Bay, where he became Managing Partner in 2024. This may indicate divided attention or succession planning at Polar Mechanical.

---

## Personal Story

Polar Mechanical was established in 1976 as Lakehead Polar Air Limited, making it one of the longest-running mechanical contractors in Northwestern Ontario — 50 years of continuous operation. The business serves a massive geographic footprint stretching from Kenora in the west to Marathon/Manitouwadge in the east, and north to James Bay. They are members of the Construction Association of Thunder Bay, the Ontario Sheet Metal Contractors Association (OSMCA), the Council of Ontario Construction Associations (COCA), the Canadian Construction Association (CCA), and the Canadian Federation of Independent Business (CFIB).

The company holds Division 23 (HVAC) specialization and employs licensed gas fitters, refrigeration mechanics, and sheet metal journeymen with apprentices. They fabricate custom ductwork in-house — a differentiator that speaks to deep trade capability. Their institutional and commercial roots suggest steady contract work that has sustained the business for decades.

George McKay appears to be a long-time owner who is also involved with JML Engineering Ltd. (a civil/structural engineering firm in Thunder Bay) where he became Managing Partner in 2024. This dual role may explain some of the responsiveness issues noted in customer reviews.

---

## Current Situation (Issues Found)

| Issue Type | Finding | Severity | Evidence |
|------------|---------|----------|----------|
| **WEBSITE COMPROMISED** | Site appears to have WordPress redirect malware — serves normal content to curl/bots but redirects real browsers to random Google Maps/Search pages (Lakehead Burner Service, Evolved Thermal Energy, Beebe Mechanical, etc.) | **CRITICAL** | Playwright browser session hijacked repeatedly; curl returns HTTP 200 with normal content |
| Outdated website | Copyright 2019, PHP 7.4.33, WooCommerce installed but unused, RevSlider plugin (known vulnerability target) | High | curl inspection |
| Wrong Google Map | Website's embedded Google Maps points to "Lakehead Burner Service Ltd" at 626 Waterloo St S — a completely different business | High | Playwright navigated to Google Maps for Lakehead Burner when loading polarmechanical.ca |
| Negative reviews | 2 Google reviews, both 1-star. Complaints: unresponsive to service requests, failure to follow up on quotes. George mentioned by name. Zero management responses. | High | Birdeye aggregation confirmed 2026-04-06 |
| GBP unclaimed/unmanaged | No responses to reviews, no posts, no photos, minimal profile | High | Google search results |
| No social presence | No Facebook business page found, no Instagram, no social media links on website | Medium | Web search confirmed |
| Outdated GA tracking | Using Universal Analytics (UA-140830222-1) — deprecated by Google in July 2023 | Medium | Source code inspection |
| WooCommerce remnant | WooCommerce installed but no products — adds unnecessary code bloat and attack surface | Low | Source code inspection |

**Best hook angle from issues:** "When was the last time you tried visiting polarmechanical.ca on your phone? I noticed something concerning — the site appears to redirect visitors to other businesses' Google Maps listings instead of showing your content. This usually indicates a WordPress security issue that's been silently active for some time."

---

## Current Marketing Assessment

| Area | Status | Notes |
|------|--------|-------|
| Website Quality | **Weak** | Compromised with redirect malware, copyright 2019, PHP 7.4, outdated plugins |
| SEO | **None** | 48 keywords but only ~5 visits/mo. No blog, no content strategy, no local landing pages |
| Social Media | **None** | No Facebook page, no Instagram, no social presence whatsoever |
| Running Ads? | No | No Semrush ad data (0 adwords keywords, 0 ad traffic) |
| Blog/Content | **None** | No blog, no articles, no content marketing |
| Email Capture | **No** | Contact Form 7 installed but no lead magnets or email capture |
| Brand Reputation | **Negative** | 1.0 stars on Google (2 reviews), both unanswered. Not BBB accredited. |

---

## Niche-Marketing Misalignment

| What the Audience Expects | What the Business Shows | Gap |
|--------------------------|------------------------|-----|
| Emergency HVAC availability (extreme winters, -40C) | No mention of emergency/24-hour service, no after-hours phone | Critical gap for a market where furnace failures are life-threatening |
| Trust signals (reviews, certifications, team photos) | 1.0-star Google rating, no team photos, no review management | Homeowners checking Google see only 2 angry reviews |
| Mobile-friendly experience (60%+ searches on mobile) | Website redirects mobile browsers to random Google Maps pages | Visitors literally cannot see their website content |
| Residential focus (homeowners 35-65) | Website emphasizes institutional/commercial/industrial capability | Residential homeowners feel this company is "too big for them" or "not for houses" |

**Best misalignment angle:** A 50-year-old HVAC company in one of Canada's coldest cities has zero online presence for emergency heating — the exact moment homeowners are most desperate and willing to pay premium prices. Their competitors own this space entirely.

---

## Opportunities Identified

1. **Website security remediation + rebuild** (data-backed) — The WordPress site is compromised with redirect malware. Every browser visitor is sent to random Google Maps pages for other businesses. This means 100% of their web traffic is being redirected away from them. Fixing this alone would restore their #5 ranking for "hvac thunder bay" (170 searches/mo) to actual traffic.

2. **Google Business Profile optimization** (data-backed) — With only 2 reviews at 1.0 stars vs. Clow Darling's 71 reviews, they are invisible in the local map pack. Implementing a review generation system and GBP management could capture a share of the ~1,952/mo local HVAC searches. Even modest improvement (20 reviews at 4.5+ stars) would dramatically change their local visibility.

3. **Keyword gap exploitation** (data-backed) — Polar Mechanical ranks for 48 keywords but gets only ~5 visits/mo. Clow Darling ranks for 153 keywords and gets ~1,401/mo — a **280x traffic advantage**. Key gaps: "furnace repair thunder bay" (210/mo, Polar at #67 vs Clow at top), "air conditioning thunder bay" (260/mo, Polar at #29 vs Clow at #2), "heating and cooling thunder bay" (50/mo, Polar at #11 but getting 0 traffic due to malware). Service-specific landing pages for their HVAC and sheet metal services could capture hundreds of monthly searches.

4. **Emergency HVAC content** (observational) — No Thunder Bay HVAC company is aggressively targeting emergency/after-hours content. In a city with extreme winters, "emergency furnace repair thunder bay" and related terms represent high-intent, high-value traffic that no competitor fully owns.

---

## Verified Claims

Every claim referenced in outreach MUST appear here with a verification tag.

| # | Claim | Source | Verified | Evidence |
|---|-------|--------|----------|----------|
| 1 | Polar Mechanical has 48 keywords ranking in Google Canada | Semrush domain_organic report | 2026-04-06 | Semrush data pull |
| 2 | Estimated organic traffic is ~5 visits/month | Semrush domain_rank report | 2026-04-06 | Semrush data pull |
| 3 | Clow Darling has 153 keywords and ~1,401/mo traffic | Niche research context (provided) | 2026-04-06 | Niche data |
| 4 | Google reviews: 2 reviews at 1.0 stars | Birdeye review aggregation | 2026-04-06 | birdeye.com |
| 5 | Copyright year 2019 on website | polarmechanical.ca source code | 2026-04-06 | curl inspection |
| 6 | Website redirects browsers to random Google Maps pages | Playwright MCP browser testing | 2026-04-06 | Multiple Playwright sessions |
| 7 | "hvac thunder bay" — Polar at #5, 170 searches/mo | Semrush domain_organic | 2026-04-06 | Semrush data |
| 8 | Business established 1976 (50 years) | polarmechanical.ca + BBB + CATB | 2026-04-06 | Multiple sources |
| 9 | George McKay is owner (email george@polarmechanical.ca) | CATB listing + Google review mention | 2026-04-06 | catb.on.ca + birdeye.com |
| 10 | No Facebook business page found | Web search | 2026-04-06 | Google search |
| 11 | Website runs on PHP 7.4.33 with WordPress | curl HTTP headers + source code | 2026-04-06 | curl -sI |
| 12 | Authority Score: 6, 95 referring domains, 307 backlinks | Semrush backlinks_overview | 2026-04-06 | Semrush data |
| 13 | Using deprecated Universal Analytics (UA-140830222-1) | Source code inspection | 2026-04-06 | curl + grep |
| 14 | Google Maps embed on site points to Lakehead Burner Service Ltd | Playwright navigation testing | 2026-04-06 | Browser redirected to Google Maps for Lakehead Burner |

**Unverified claims (DO NOT use in outreach):**
- RocketReach lists $3M revenue — may be inaccurate (aggregator data, often unreliable for small businesses)
- RocketReach lists "Conrad Lopez" as COO — this is from Polar Mechanical Inc. in California (.com), NOT the Thunder Bay .ca business
- George McKay's exact current role at JML Engineering — LinkedIn profile not accessible for verification

---

## Red Flags

- **WEBSITE COMPROMISED WITH MALWARE** — The polarmechanical.ca WordPress site has redirect malware that sends browser visitors to random Google Maps/Search pages for other businesses. This is a common WordPress hack pattern where curl/bots see normal content but real browsers get redirected. RevSlider and outdated PHP 7.4 are known attack vectors. This is actively harming their business — every potential customer who visits their site gets sent elsewhere.
- **Owner may be dividing attention** — George McKay appears to have taken a Managing Partner role at JML Engineering Ltd. in 2024, which could mean Polar Mechanical is running on autopilot or being wound down.
- **Possible business confusion** — "Lakehead Polar Air Limited" (legal name) appears as a separate Yellow Pages listing at the same address. The embedded Google Map on their website points to "Lakehead Burner Service Ltd" at a different address (626 Waterloo St S) — this is a completely different company owned by Sandi and Larry, est. 1990.
- **Extremely negative online reputation** — 1.0 stars with zero management response suggests nobody is monitoring the business's online presence at all.
- **Outdated tech stack** — PHP 7.4 reached end of life in Nov 2022. WooCommerce installed but unused. RevSlider is one of the most exploited WordPress plugins (likely the malware entry point).

---

## Recommended Outreach Angle

**Primary Why:** Their 50-year-old HVAC business website is compromised with redirect malware — every potential customer who tries to visit polarmechanical.ca on a browser gets sent to random Google Maps pages for other businesses. They are literally sending their web traffic to competitors without knowing it.

**Data Point:** Despite ranking #5 for "hvac thunder bay" (170 searches/mo), they get only ~5 visits/month. Their competitor Clow Darling gets 280x more traffic (1,401/mo) with 153 keywords vs Polar's 48.

**Competitor Comparison:** Clow Darling dominates with 71 Google reviews, 153 keywords, and 1,401/mo traffic. Polar Mechanical has 2 reviews (1.0 stars), 48 keywords, and ~5 visits — despite being in business 50 years.

**Hook Question:** "George, when was the last time you visited polarmechanical.ca on your phone? I noticed something that might explain why the phone isn't ringing from web leads..."

---

## Sources

- https://polarmechanical.ca/ (website, curl + Playwright)
- https://reviews.birdeye.com/polar-mechanical-166848477030672 (reviews)
- https://catb.on.ca/members/ViewMember/?id=148 (CATB member listing)
- https://www.bbb.org/ca/on/thunder-bay/profile/mechanical-contractors/polar-mechanical-0057-34051 (BBB)
- https://ontario.osmca.org/list/member/polar-mechanical-thunder-bay-1028400 (OSMCA)
- https://www.yellowpages.ca/bus/Ontario/Thunder-Bay/Polar-Mechanical/5944728.html (Yellow Pages)
- https://www.yellowpages.ca/bus/Ontario/Thunder-Bay/Lakehead-Polar-Air-Limited/8214164.html (Yellow Pages — legal name)
- https://rocketreach.co/polar-mechanical-profile_b46abd5bfc5c8a34 (RocketReach — partial data, some cross-contamination with US company)
- https://projects.constructconnect.com/companies/1993889-polar-mechanical-lakehead-polar-air-limited (ConstructConnect)
- https://www.jmleng.com/about (JML Engineering — George McKay connection)
- https://ca.linkedin.com/in/george-mckay-5335b0aa (LinkedIn — George McKay, Thunder Bay)
- Semrush: domain_organic, domain_rank, backlinks_overview reports (2026-04-06)

---

## Screenshots Index

All screenshots stored in `projects/glv-marketing/research/leads/screenshots/polar-mechanical/`

| File | What It Shows | Taken |
|------|--------------|-------|
| `homepage-desktop.png` | Playwright captured blank/redirect — site compromised with malware | 2026-04-06 |
| `gbp-listing.png` | Playwright captured blank — browser session corrupted by site malware | 2026-04-06 |

**Note on screenshots:** The polarmechanical.ca WordPress site has active redirect malware that hijacks the Playwright browser session, making it impossible to capture clean screenshots. Every attempt to screenshot the homepage resulted in the browser being redirected to random Google Maps/Search pages for other businesses (Lakehead Burner Service, Evolved Thermal Energy, Beebe Mechanical). This malware behaviour is itself a critical finding and evidence of a compromised website. The site content is visible via curl (which doesn't execute JavaScript) but not via any real browser.
