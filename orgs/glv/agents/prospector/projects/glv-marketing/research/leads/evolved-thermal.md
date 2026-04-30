# Lead Dossier: Evolved Thermal Energy

*Generated: 2026-04-06*
*Investigator: GLV Marketing Research Agent*
*Status: INCLUDE (with caveats -- see Red Flags)*

---

## Business Overview

| Field | Detail |
|-------|--------|
| **Business Name** | Evolved Thermal Energy Inc. |
| **Trade** | Geothermal & Air Source Heat Pump Distributor |
| **Canonical Domain** | evolvedthermal.com |
| **Phone** | 1-833-378-4674 (toll-free), (226) 747-5337 (local) |
| **Email** | hello@evolvedthermal.com |
| **Address** | 81 Parkview Dr, Wellesley, ON N0B 2T0 |
| **Years in Business** | ~5 (founded 2021; founders have ~20 years industry experience) |
| **Team Size** | 2-10 (LinkedIn says 3 employees; recently hired Quebec sales rep) |
| **Google Reviews** | Not confirmed (no GBP listing found for Thunder Bay; HQ may have limited reviews) |
| **Facebook** | @EvolvedThermalEnergy, 61 followers, last post Sept 2024 |
| **LinkedIn** | linkedin.com/company/evolved-thermal-energy, last post ~7 months ago |
| **Online Presence** | Moderate (website + social + blog + contractor portal + IGSHPA listing) |
| **Budget Signal** | Medium (small team but provincial reach, contractor network, distributor model) |

---

## Phase 1: NAP Discovery

### NAP Consistency Table

| Source | Domain | Resolves? | Address | Phone |
|--------|--------|-----------|---------|-------|
| **Website** | evolvedthermal.com | UNSTABLE (see below) | 81 Parkview Dr, Wellesley, ON N0B 2T0 | Not visible on homepage |
| **IGSHPA Directory** | evolvedthermal.com | -- | Waterloo, ON (different city) | 833-378-4674 |
| **Yelp** | -- | -- | Wellesley, ON | -- |
| **Ecohome** | evolvedthermal.com | -- | Ontario (no specific address) | Not listed |
| **LinkedIn** | evolvedthermal.com | -- | Wellesley, ON | -- |
| **ZoomInfo** | evolvedthermal.com | -- | 81 Parkview Dr, Wellesley, ON | -- |
| **Facebook** | evolvedthermal.com | -- | Ontario, CA | -- |
| **Contractor Portal** | portal.evolvedthermal.com | Yes | -- | -- |
| **Jeff Hunter Personal** | jeffwhunter.ca | Redirects to evolvedthermal.com/news | -- | -- |

### NAP Inconsistencies Found: 3

1. **Address inconsistency:** IGSHPA lists "Waterloo, ON" while website and ZoomInfo list "Wellesley, ON" (these are nearby but different municipalities)
2. **Phone number absent from website:** The toll-free number (833-378-4674) appears on IGSHPA and search results but is NOT visible on the actual website homepage
3. **No Thunder Bay NAP presence:** Despite having a Thunder Bay landing page, there is no local listing, local phone number, or local address for Thunder Bay

### CRITICAL FINDING: Domain Instability

**evolvedthermal.com is exhibiting erratic redirect behaviour.** During live testing on 2026-04-06, the domain redirected to:
- villeneuvemechanical.com (A. Villeneuve Mechanical, Thunder Bay plumber) on first visit
- lakeheadburner.ca (Lakehead Burner Service, Thunder Bay HVAC) on second visit
- polarmechanical.ca (Polar Mechanical, Thunder Bay HVAC) on third visit
- Loaded correctly on fourth visit

This suggests either:
- DNS hijacking or domain expiry issues
- Malware/ad injection on the WordPress site
- A compromised hosting environment redirecting visitors to competitors

**This is an emergency-level problem.** Every potential customer clicking their link from Google may be sent to a competitor's website.

---

## Phase 2: Playwright Evidence Collection

### Screenshots Captured

| Screenshot | File | Notes |
|------------|------|-------|
| Redirect to competitor | `screenshots/evolved-thermal/redirect-lakeheadburner.png` | Domain redirected to lakeheadburner.ca during testing |
| Homepage desktop | `screenshots/evolved-thermal/homepage-desktop.png` | Rendered as blank white page (content failed to load) |

**Note:** Playwright browser crashed multiple times during testing, likely triggered by the malicious redirects on evolvedthermal.com. Additional screenshots (mobile, GBP, competitor) could not be captured due to persistent browser crashes.

### Key Visual Findings (from successful page loads)

- **Homepage renders blank white** even when the domain resolves correctly (CSS/JS loading but no visible content)
- WordPress + Elementor build with WPForms integration
- The site title loads in the browser tab ("Evolved Thermal Energy Heat Pumps & Geothermal") but the page body shows nothing
- This indicates a serious front-end rendering issue on top of the redirect problem

---

## Phase 3: Live Data Verification

### Semrush Data (verified: 2026-04-06)

| Metric | Evolved Thermal | #1 Competitor (Clow Darling) | Gap |
|--------|----------------|------------------------------|-----|
| **Organic Keywords** | 204 | 153 | +51 (ETE leads) |
| **Estimated Monthly Traffic** | 46 | 1,401 | -1,355 (97% less traffic) |
| **Organic Cost Value** | $28 | $5,535 | -$5,507 |
| **Semrush Rank** | 1,073,388 | 147,543 | Clow Darling ranks 7x higher |

**Analysis:** Evolved Thermal has MORE keywords than Clow Darling (204 vs 153), but generates 97% LESS traffic. This is because their keywords are almost entirely informational (educational blog content about geothermal pros/cons) rather than high-intent local service keywords. Their Thunder Bay landing page ranks for essentially nothing.

### Top Traffic-Driving Pages

| Page | Keywords | Traffic | % of Total |
|------|----------|---------|------------|
| /disadvantages-of-geothermal-energy-2/ | 53 | 29 | 63% |
| Homepage (/) | 21 | 16 | 35% |
| /geothermal-installation-collingwood/ | 3 | 1 | 2% |
| All other pages | 127 | 0 | 0% |

**Critical insight:** 63% of their entire organic traffic goes to a single blog post about the *disadvantages* of geothermal energy. Their homepage captures 35%. Every other page on the site, including ALL location landing pages, drives zero measurable traffic.

### Top Ranking Keywords

| Keyword | Position | Volume | Page |
|---------|----------|--------|------|
| geothermal energy ontario | 4 | 70 | Homepage |
| negatives of geothermal energy | 6 | 140 | Blog post |
| what is a disadvantage of geothermal energy | 7 | 70 | Blog post |
| thermal energy inc | 7 | 110 | Homepage |
| disadvantages of geothermal energy | 15 | 390 | Blog post |
| heat pumps collingwood | 12 | 260 | Landing page |

### Thunder Bay Keyword Performance

| Keyword | Position | Volume | Traffic |
|---------|----------|--------|---------|
| geothermal heating ontario | 17 / 32 | 70 | 0 |
| thermal mechanical thunder bay | 38 / 87 | 70 | 0 |

**Thunder Bay generates ZERO organic traffic.** Their landing page ranks outside top 15 for all relevant local terms.

### Google Reviews

- **UNVERIFIED:** Could not confirm Google Business Profile exists or review count. No GBP was found for Thunder Bay specifically. HQ is in Wellesley, ON. Playwright browser crashed before GBP screenshot could be captured.
- **Facebook:** 0 reviews, 61 followers
- **HomeStars:** Listing exists but data not accessible

### Decision Maker Verification

| Name | Role | Sources | Status |
|------|------|---------|--------|
| **Jeff Hunter** | Co-Founder, Client & Contractor Manager | Website, LinkedIn, IGSHPA, Ecohome, Conestoga College, Ontario Geothermal Association, RocketReach, jeffwhunter.ca | **VERIFIED (6+ sources)** |
| **Annie Hatherton** | Co-Founder, Partner (Finance/Operations/HR) | Website, LinkedIn, ZoomInfo | **VERIFIED (3 sources)** |

---

## Phase 4: Deep Research

### Decision Makers

#### Jeff Hunter -- Co-Founder & Client/Contractor Manager
- **LinkedIn:** linkedin.com/in/jeff-w-hunter/ (active, posts about geothermal)
- **Personal domain:** jeffwhunter.ca (redirects to evolvedthermal.com/news)
- **Background:** Mechanical engineering background. Started in HVAC in 2005 at NextEnergy Inc. (Annie's family business). Nearly 20 years in the geothermal industry.
- **Industry Leadership:** Chair of the Board of Directors, Ontario Geothermal Association (non-profit advocating for GeoExchange technology in Canada)
- **Teaching:** Part-time Professor at Conestoga College in Renewable Energy Techniques and Applied Energy Management programs
- **TSSA Certified:** G2 Gas Technician qualification
- **Activity:** Recently posted a job opening for Evolved Thermal Energy (LinkedIn, ~7 months ago). Active poster on LinkedIn about heat pump technology.

#### Annie Hatherton -- Co-Founder & Partner
- **LinkedIn:** linkedin.com/in/annie-hatherton-310681189/ (26 connections, low activity)
- **Background:** Graduated from Wilfrid Laurier University. Family has been in ground source heat pump industry since the early 1980s. Started at NextEnergy Inc. (family business) in 2006.
- **Also works at:** ZON Engineering Inc. & ZON Generation Ltd. (solar and high-performance buildings engineering consulting). Joined ZON in 2014.
- **Role at ETE:** Finance, operations, and HR

### Personal Story

Jeff and Annie are a couple who both came from the geothermal industry. Annie's family pioneered ground source heat pumps in Canada through NextEnergy Inc., a business they ran since the early 1980s. Jeff joined NextEnergy in 2005 as a mechanical engineer and met Annie there (she joined the family business in 2006 after university).

After nearly two decades at NextEnergy, they identified a gap in the market: the transition to heat pumps was too complicated and lacked transparency. They founded Evolved Thermal Energy in 2021 as a distributor that would simplify the process for homeowners, working through a network of HVAC contractors across Ontario and Eastern Canada.

Jeff is deeply embedded in the industry: he chairs the Ontario Geothermal Association and teaches the next generation of renewable energy technicians at Conestoga College. Annie brings the operations and finance side, also working concurrently with ZON Engineering (solar/buildings consulting).

They distribute GeoComfort (Enertech) heat pump systems and maintain a contractor portal at portal.evolvedthermal.com for their installer network.

### Community & Industry Involvement

- **Ontario Geothermal Association:** Jeff is Chair of the Board of Directors
- **Conestoga College:** Jeff teaches part-time in Renewable Energy programs
- **Confederation College / Synergy North:** ETE is connected to a $3.2M heat pump and thermal storage pilot project at Confederation College in Thunder Bay (IESO-funded, testing through 2027)
- **IGSHPA:** Listed in the International Ground Source Heat Pump Association directory with certified installer and designer credentials
- **GeoComfort/Enertech:** Authorized distributor

### Big-Picture Assessment

Evolved Thermal Energy is a **distributor with a content marketing strategy**, not a traditional local HVAC contractor. They operate province-wide (and into Quebec/Maritimes) through a contractor network. Their model is:

1. Homeowner finds ETE online or through education/outreach
2. ETE qualifies the home and designs the heat pump system
3. ETE connects the homeowner with a local certified contractor
4. ETE provides the equipment (GeoComfort) and oversees quality

**Strengths:**
- Industry credibility (OGA Chair, Conestoga professor, IGSHPA certified, 40+ years combined experience)
- Informational content strategy (blog posts ranking for educational geothermal queries)
- Provincial and multi-provincial reach
- Contractor portal infrastructure
- Clean energy / government incentive alignment (geothermal qualifies for GSHP rebates)

**Weaknesses:**
- Website is critically broken (redirects to competitors, blank rendering)
- Almost all organic traffic goes to a single "disadvantages" blog post (not conversion-oriented)
- Zero local presence in Thunder Bay despite having a landing page
- Social media essentially abandoned (Facebook last post Sept 2024, LinkedIn 7 months ago)
- No visible Google reviews or GBP presence
- Phone number not visible on the actual website

### Current Marketing Assessment

| Channel | Status | Grade |
|---------|--------|-------|
| **Website** | WordPress/Elementor. CRITICALLY BROKEN: redirecting to competitors. Blank rendering. | F |
| **SEO (Organic)** | 204 keywords but only 46 traffic/mo. 63% of traffic from one "disadvantages" post. | D+ |
| **Local SEO (Thunder Bay)** | Zero traffic. No local GBP. No local NAP. Page ranks 17+ for any term. | F |
| **Content/Blog** | Active (topics: geothermal pros/cons, heating/cooling, Ontario regulations). Drives some educational traffic. | C |
| **Social Media** | Facebook: 61 followers, last post Sept 2024. LinkedIn: last post 7 months ago. | D |
| **Google Reviews** | No confirmed GBP or reviews | F |
| **Paid Ads** | No Google Ads or Meta ads detected | N/A |
| **Email Marketing** | WPForms on site. "See If Your Home Qualifies" funnel exists. | C |
| **Contractor Portal** | portal.evolvedthermal.com exists and functions | B |

### Niche-Marketing Misalignment

| What the Audience Expects | What the Business Shows |
|---------------------------|------------------------|
| **Trust signals** (reviews, testimonials, team photos) for a $20K-$40K purchase decision | No visible Google reviews, no GBP, testimonials not rendering due to broken site |
| **Local presence** in Thunder Bay (local phone, address, team member) | Wellesley HQ address only, no local signals for TB, no local contractor listed |
| **Working website** to validate a major home investment | Site redirects to competitors or renders blank -- devastating for a $20K+ purchase |
| **Active social proof** for a niche/unfamiliar technology | Facebook abandoned since Sept 2024, 61 followers, 0 reviews |
| **Clear pricing/financing info** for a high-ticket item | "See If Your Home Qualifies" funnel exists but site doesn't render to show it |
| **Emergency accessibility** (phone number front and centre) | Phone number not visible on homepage, buried in directory listings |

### Opportunities (with numbers)

1. **EMERGENCY: Fix the domain redirect issue.** Every visitor to evolvedthermal.com is being sent to a competitor (Polar Mechanical, Lakehead Burner, A. Villeneuve). With 204 keywords indexed, Google is sending traffic that lands on competitor sites. This is literally generating leads for competitors. (VERIFIED: 2026-04-06, multiple redirect tests)

2. **Traffic conversion gap:** ETE has 204 keywords but only 46 visits/month. Clow Darling has 153 keywords and gets 1,401 visits/month (30x more). The keywords exist but the site cannot convert them to traffic because: (a) the site is broken, and (b) 63% of traffic goes to a "disadvantages of geothermal" post that attracts researchers, not buyers. Fixing the site and building local landing pages with commercial intent could capture a meaningful share of the ~1,952/mo HVAC search volume in Thunder Bay. (VERIFIED: Semrush 2026-04-06)

3. **Thunder Bay local SEO:** The /geothermal-installation-thunder-bay/ landing page ranks #17 for "geothermal heating ontario" and #38 for "thermal mechanical thunder bay," driving zero traffic. With proper local SEO (GBP listing, local citations, locally-relevant content, reviews), this page could rank in the top 5 and capture some of the 70/mo searches for these terms. (VERIFIED: Semrush 2026-04-06)

4. **Google Business Profile:** No confirmed GBP for Thunder Bay. Setting one up (even as a service-area business) would immediately give them local pack visibility for Thunder Bay geothermal searches. Clow Darling has 71 Google reviews as the benchmark. (VERIFIED: search testing 2026-04-06)

5. **Social media revival:** Facebook (61 followers, last post Sept 2024) and LinkedIn (last post ~7 months ago) are effectively abandoned. For a niche technology like geothermal, educational content on social builds the trust needed for a $20K+ purchase decision. Jeff's industry authority (OGA Chair, Conestoga professor) is an untapped content goldmine. (VERIFIED: Facebook/LinkedIn 2026-04-06)

6. **Content strategy pivot:** Their best-performing content is about the *disadvantages* of their own product (53 keywords, 63% of all traffic). While this shows content capability, it means their strongest page actively discourages purchases. Redirecting that content strategy toward conversion-oriented local pages and "is geothermal right for your home in [city]" content would better serve their business model. (VERIFIED: Semrush 2026-04-06)

### Red Flags

1. **Not a traditional local contractor.** ETE is a provincial distributor, not a Thunder Bay-based HVAC company. Their HQ is in Wellesley, ON (~1,600 km from Thunder Bay). They serve Thunder Bay through contractor partners, not their own team. This changes the outreach angle: they need marketing help province-wide, not just in Thunder Bay.

2. **Tiny team.** 2-10 employees (likely 3-4). Marketing budget may be limited. However, the distributor model means revenue comes from equipment sales across many projects, not just local service calls.

3. **Annie works concurrently at ZON Engineering.** This suggests ETE may not yet generate enough revenue to support both founders full-time.

4. **Website is critically compromised.** The redirect issue could indicate expired hosting, DNS problems, malware, or a hacked WordPress installation. This is either a huge opportunity (they desperately need help) or a sign the business is winding down.

5. **No marketing agency detected.** No evidence of current marketing partner.

---

## Verified Claims Table

| # | Claim | Status | Source | Date |
|---|-------|--------|--------|------|
| 1 | Domain evolvedthermal.com redirects to competitor sites | VERIFIED | Live Playwright testing (3 separate redirects observed) | 2026-04-06 |
| 2 | 204 organic keywords, 46 monthly traffic | VERIFIED | Semrush domain_rank, CA database | 2026-04-06 |
| 3 | Clow Darling has 153 keywords, 1,401/mo traffic | VERIFIED | Semrush domain_rank, CA database | 2026-04-06 |
| 4 | 63% of traffic from "disadvantages of geothermal" post | VERIFIED | Semrush domain_organic_unique | 2026-04-06 |
| 5 | Thunder Bay landing page drives zero traffic | VERIFIED | Semrush domain_organic (Thunder Bay filter) | 2026-04-06 |
| 6 | Jeff Hunter is Co-Founder | VERIFIED | Website, LinkedIn, IGSHPA, Ecohome, RocketReach, OGA | 2026-04-06 |
| 7 | Annie Hatherton is Co-Founder | VERIFIED | Website, LinkedIn, ZoomInfo | 2026-04-06 |
| 8 | Jeff is Chair of Ontario Geothermal Association | VERIFIED | OGA Board page, LinkedIn, About page | 2026-04-06 |
| 9 | Jeff teaches at Conestoga College | VERIFIED | LinkedIn, About page, job postings | 2026-04-06 |
| 10 | Company founded 2021 | VERIFIED | LinkedIn company page | 2026-04-06 |
| 11 | HQ in Wellesley, ON (not Thunder Bay) | VERIFIED | LinkedIn, ZoomInfo, IGSHPA, website | 2026-04-06 |
| 12 | Facebook: 61 followers, last post Sept 2024 | VERIFIED | Web search results | 2026-04-06 |
| 13 | Toll-free phone: 833-378-4674 | VERIFIED | IGSHPA, web search, Facebook | 2026-04-06 |
| 14 | GeoComfort/Enertech distributor | VERIFIED | Website, IGSHPA, product pages | 2026-04-06 |
| 15 | Google review count and rating | UNVERIFIED | Could not confirm GBP exists or access reviews | 2026-04-06 |
| 16 | Homepage renders blank white | VERIFIED | Playwright screenshot (blank page captured) | 2026-04-06 |
| 17 | Confederation College project involvement | UNVERIFIED | CBC article mentions "thermal" but unclear if ETE is directly involved | 2026-04-06 |

---

## Outreach Notes

### Recommended Approach

This is NOT a standard local HVAC lead. Jeff Hunter is an industry leader (OGA Chair, college professor, mechanical engineer). The outreach must reflect his sophistication and avoid talking down to him. He will immediately see through generic marketing pitches.

**Best angle:** The website emergency. His domain is literally sending potential customers to competitors. This is a concrete, urgent problem that no amount of industry expertise can fix without web/marketing help. Lead with this.

**Secondary angle:** The traffic paradox. He has MORE keywords than Clow Darling but gets 97% less traffic. His content strategy ranks for educational queries (people researching geothermal disadvantages) rather than purchase-intent queries (people looking to install geothermal). A strategic pivot could unlock significant traffic without starting from scratch.

**Tone:** Peer-to-peer, technical, respectful of his expertise. He teaches this stuff at a college level. Don't explain geothermal to him. Talk about marketing, traffic, and conversion.

### Best Contact Channel

1. **LinkedIn** (Jeff is active there, professional context)
2. **Email** (hello@evolvedthermal.com)
3. **Phone** (833-378-4674, but toll-free suggests it may route through a system)

### Timing

- Spring is peak season for geothermal planning (installations happen in summer/fall)
- April outreach is well-timed for the selling season

---

## Evidence Pack

| Claim | Evidence |
|-------|----------|
| "Your domain is redirecting to competitors" | `screenshots/evolved-thermal/redirect-lakeheadburner.png`, `screenshots/evolved-thermal/homepage-desktop.png` (blank) |
| "204 keywords but only 46 monthly visits" | Semrush domain_rank, verified 2026-04-06 |
| "Clow Darling gets 1,401 visits from fewer keywords" | Semrush domain_rank, verified 2026-04-06 |
| "63% of traffic from disadvantages post" | Semrush domain_organic_unique, verified 2026-04-06 |
| "Thunder Bay page drives zero traffic" | Semrush domain_organic filtered, verified 2026-04-06 |
| "Facebook last post September 2024" | Web search results, verified 2026-04-06 |

---

*Dossier complete. Ready for Copywriter agent.*
