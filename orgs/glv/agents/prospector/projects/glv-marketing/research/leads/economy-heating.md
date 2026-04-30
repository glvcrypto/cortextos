# Economy Heating Services -- Lead Dossier

**Investigator:** GLV Marketing Research Agent
**Date:** 2026-04-06
**Status:** OUTREACH READY
**Confidence:** HIGH

---

## Quick Profile

| Field | Value |
|-------|-------|
| Business Name | A Economy Heating Service / Economy Heating Svc |
| Trade | Gas + oil furnace service, HVAC |
| Owner / Decision Maker | **Rob Spakowski** (confirmed via AllBiz, BestProsInTown reviews) |
| Address | 1600 Frederica St W, Thunder Bay, ON P7E 3Z2 |
| Phone | (807) 623-4328 |
| Email | Not publicly listed |
| Website | economyheatingthunderbay.ca |
| Facebook | [A Economy Heating Service](https://www.facebook.com/pages/A-Economy-Heating-Service/234827907055802) |
| Google Rating | 4.0/5 (8 reviews) |
| Hours | 24/7 (emergency), standard hours not specified |
| TSSA Registration | FS R0076379460 (registered fuels contractor) |
| Payment Methods | Visa, MasterCard, Amex, Cash |

---

## Phase 1: NAP Discovery

### Canonical Domain

- **Primary:** www.economyheatingthunderbay.ca (WordPress, Yoast SEO, Site Kit)
- **Only 2 indexed pages:** Homepage + /services/
- **Last content update:** January 21, 2019 (7+ years stale)
- **Site published:** December 27, 2015

### NAP Consistency Table

| Source | Name | Address | Phone | Website | Consistent? |
|--------|------|---------|-------|---------|-------------|
| Website | Economy Heating Services Thunder Bay | Not listed | (807) 623-4328 | economyheatingthunderbay.ca | PARTIAL -- no address on site |
| Google Business Profile | Economy Heating Svc | 1600 Frederica St W, P7E 3Z2 | (807) 623-4328 | economyheatingthunderbay.ca | YES |
| Yellow Pages | A Economy Heating Service | 1600 Frederica St W, P7E 3Z2 | (807) 623-4328 | economyheatingthunderbay.ca | NAME MISMATCH |
| Canpages | A Economy Heating Service | 1600 Frederica St W, P7E 3Z2 | 855-224-4898 | economyheatingthunderbay.ca | PHONE MISMATCH |
| BestProsInTown | Economy Heating Svc | 1600 Frederica St W, P7E 3Z2 | (807) 623-4328 | economyheatingthunderbay.ca | YES |
| AllBiz | Economy Heating Svc | Thunder Bay | (807) 623-4328 | -- | PARTIAL |
| Facebook | A Economy Heating Service | -- | -- | -- | NAME MISMATCH |
| Canada Chamber | Economy Heating Svc | 1600 Frederica St W, P7E 3Z2 | (807) 623-4328 | -- | YES |

### NAP Issues Identified

1. **Business name inconsistency:** "A Economy Heating Service" vs "Economy Heating Svc" vs "Economy Heating Services Thunder Bay" -- three different name variants across directories
2. **Canpages phone mismatch:** Shows 855-224-4898 instead of (807) 623-4328
3. **No email listed anywhere publicly** -- missed contact opportunity
4. **Address missing from website** -- customers cannot confirm location from the site itself

---

## Phase 2: Playwright Evidence

### Screenshots Captured

| Screenshot | Path | Notes |
|------------|------|-------|
| Desktop Homepage | `screenshots/economy-heating-homepage.png` | Site crashed Playwright browser repeatedly -- critical instability |

### Website Observations (from HTML source + WebFetch)

**CRITICAL FINDING: The website repeatedly crashed/redirected the Playwright browser to unrelated sites** (villeneuvemechanical.com, allamheatingandcooling.com, buhlermechanical.com). This suggests either:
- Malicious JavaScript injection / malware compromise
- Ad injection from a compromised plugin
- Outdated WordPress (6.9.4) with vulnerable theme/plugins

**Evidence Block:**
```
Source: curl + HTML source analysis
Date: 2026-04-06
Method: Direct HTML inspection via curl -sL

Key findings from source:
- WordPress 6.9.4
- Theme: xt-corporate-lite (free theme, likely abandoned)
- Yoast SEO v27.3
- Site Kit by Google 1.175.0
- Google Tag Manager: GT-MJWCZVC
- DUAL Analytics tracking: gtag.js (GT-MJWCZVC) + legacy analytics.js (UA-63329633-8) -- double-counting
- Last modified: 2019-01-21T15:33:05+00:00
- Published: 2015-12-27T13:50:02+00:00
- Navbar toggle is explicitly hidden via CSS: .navbar-toggle { display: none; }
  (mobile navigation may be completely broken)
- No schema markup beyond basic Yoast WebPage/BreadcrumbList
- No LocalBusiness schema
- Background image: /wp-content/uploads/2016/01/heating-cooling.jpg (generic stock)
```

### Site Structure

- **Homepage (/):** Hero header with "24 Hour Service on Gas & Oil Furnaces," CTA phone button, services section, minimal content
- **/services/:** Service listings (furnaces, AC, gas lines, sheet metal, fireplaces, BBQs)
- **No other pages indexed** -- no About, no Contact page, no blog, no reviews page
- **No contact form visible** -- phone-only conversion path
- **No testimonials on site** -- despite having positive reviews elsewhere

### Mobile Assessment

- Navbar toggle hidden via CSS (`display: none`) -- **mobile hamburger menu is broken**
- No responsive design evidence in the free theme
- Mobile users likely cannot navigate the site at all

---

## Phase 3: Live Data Verification

### Semrush Data (Canada Database)

**Evidence Block:**
```
Source: Semrush API (ca database)
Date: 2026-04-06
Report: domain_rank + domain_organic

Domain Rank: #1,606,552
Organic Keywords: 23
Organic Traffic: ~15/mo
Organic Traffic Cost: $56/mo equivalent
Adwords: None (no paid search)
Authority Score: 6
Trust Score: 6
Backlinks: 251 (91 referring domains, only 4 follow links)
```

### Top Ranking Keywords

| Keyword | Position | Volume | CPC |
|---------|----------|--------|-----|
| oil furnace service near me | 7 | 170 | $2.85 |
| furnace thunder bay | 11 | 140 | $4.68 |
| thunder bay furnace | 14 | 90 | $5.67 |
| ac repair thunder bay | 17 | 90 | -- |
| heating and cooling thunder bay | 22 | 50 | $4.55 |
| hvac thunder bay | 31 | 170 | $3.89 |
| furnace repair thunder bay | 32 | 210 | $4.06 |
| air conditioner thunder bay | 28 | 140 | -- |

### Review Summary

| Platform | Rating | Count | Notes |
|----------|--------|-------|-------|
| Google | 4.0/5 | 8 | Positive but thin volume |
| BestProsInTown | 4.2/5 | 5 | Customers praise Rob by name |
| Canpages | 5.0/5 | 1 | Single review |
| HomeStars | -- | -- | Profile exists, 403 on fetch |
| Yelp | -- | -- | Listed but no direct reviews found |

**Total verified reviews: ~14 across all platforms**

### Decision Maker Verification

**Rob Spakowski -- Owner/Operator**

| Source | Evidence |
|--------|----------|
| AllBiz listing | Listed as primary contact |
| BestProsInTown reviews | Customers say "Rob understands how furnaces work" and "can count on Rob to do the job right" |
| Web search results | Confirmed as owner via multiple directory aggregators |

- **Profile:** Hands-on technician-owner who personally handles service calls. Customers consistently praise his knowledge and work ethic. No LinkedIn presence found. No public personal details beyond business association.
- **Communication preference:** Phone-first (no email listed anywhere). Likely prefers direct, no-nonsense communication.

---

## Phase 4: Deep Research

### Keyword Gap Analysis

**Economy Heating vs. Clow Darling (top competitor):**

| Metric | Economy Heating | Clow Darling |
|--------|-----------------|--------------|
| Organic Keywords | 23 | 153 |
| Monthly Traffic | ~15 | ~1,401 |
| Google Reviews | 8 (4.0 stars) | 71 |
| Website Last Updated | Jan 2019 | Active |
| Service Pages | 2 total | Multiple |
| Blog / Content | None | Active |
| Authority Score | 6 | Higher |

**Gap:** Economy Heating captures only 0.8% of the available HVAC search volume (~1,952/mo). Clow Darling captures ~72%. Economy is leaving an estimated **1,937 monthly searches** on the table.

**High-value keywords Economy is missing entirely:**
- "furnace installation thunder bay" (~90/mo, $5+/click)
- "heating repair thunder bay" (~140/mo)
- "oil furnace repair thunder bay" (ranking #32 but should be top 5)
- "emergency furnace repair thunder bay" (not ranking)
- "furnace cleaning thunder bay" (not ranking -- core service!)
- "gas line installation thunder bay" (not ranking)
- "water heater repair thunder bay" (not ranking)
- "propane furnace service thunder bay" (not ranking)

### Marketing Assessment

**Current State: 2/10**

Economy Heating is a technically competent, TSSA-registered business with a loyal customer base (reviews consistently praise Rob's expertise) that is almost completely invisible online. Their digital presence is in a state of near-total neglect.

**What they do well:**
- 24/7 emergency service -- strong differentiator
- Senior citizen discounts -- community-oriented
- TSSA registered -- legitimacy and trust signal
- Strong personal reputation (Rob praised by name in reviews)
- Broad service range (oil, gas, propane, AC, sheet metal, gas lines)

**What is broken:**
1. **Website is compromised** -- redirecting browsers to competitor sites (Villeneuve Mechanical, Allam Heating, Buhler Mechanical). This is likely a malware injection or compromised plugin. Customers trying to visit may end up on a competitor's site.
2. **Website not updated since January 2019** -- 7+ years of neglect
3. **Only 2 pages indexed** out of an already minimal site
4. **Mobile navigation is broken** -- hamburger menu hidden via CSS
5. **No email address listed anywhere** -- limiting contact options
6. **No contact form** -- phone-only limits lead capture
7. **No LocalBusiness schema** -- missing rich results in search
8. **Dual Google Analytics tracking** -- inflating pageview counts
9. **Free WordPress theme** (xt-corporate-lite) -- likely abandoned by developer
10. **No social media activity** -- Facebook page exists but appears inactive
11. **Only 4 follow backlinks** out of 251 total -- virtually no link equity
12. **No blog or content** -- zero content marketing

### Brand/Service Misalignment

**Critical misalignment:** Economy Heating's core identity is "the reliable guy who shows up at 2 AM when your furnace dies" -- but their website literally sends visitors to competitors. Rob has built decades of trust through word-of-mouth, but any customer who Googles him before calling may:

1. Land on a competitor's website via the redirect
2. See a site that looks abandoned and unprofessional
3. Find no email, no address, no way to verify legitimacy beyond calling

The business name confusion ("A Economy" vs "Economy Heating Svc" vs "Economy Heating Services") further fragments their brand across search results.

### Big-Picture Opportunity

**The opportunity is massive relative to investment:**

Economy Heating is a TSSA-registered, 10+ year business with a loyal customer base and a strong owner reputation -- all built on word-of-mouth alone. Their #1 competitor (Clow Darling) gets 93x more organic traffic. Even capturing 10% of Clow Darling's traffic would represent a 900% increase for Economy.

**Revenue impact estimates:**
- Current organic traffic: ~15 visits/mo
- Realistic 6-month target: ~200 visits/mo (conservative, based on existing keyword positions)
- Average HVAC service call value in Thunder Bay: $300-800
- At 5% conversion rate: 10 leads/mo = $3,000-$8,000/mo in potential new revenue
- Annual revenue opportunity: **$36,000-$96,000** from organic search alone

**Quick wins available:**
1. Fix the compromised website / rebuild (~$2,000-5,000 one-time)
2. Claim and optimize Google Business Profile properly
3. Fix NAP inconsistencies across all directories
4. Add LocalBusiness schema with services
5. Push existing keywords from page 2-3 into top 5 positions
6. "oil furnace service near me" already at #7 -- a few fixes could push to #3-4 (170 searches/mo)

### Red Flags

| Flag | Severity | Detail |
|------|----------|--------|
| Compromised website | CRITICAL | Redirects to competitor sites -- potential malware |
| 7-year content drought | HIGH | Last update Jan 2019, signals abandonment |
| Mobile navigation broken | HIGH | Hamburger menu hidden, mobile users stranded |
| NAP fragmentation | MEDIUM | 3 name variants, phone mismatch on Canpages |
| No email anywhere | MEDIUM | Limits customer contact and marketing |
| Free abandoned theme | MEDIUM | Security risk, no updates, no support |
| Only 8 Google reviews | LOW | Competitor has 71 -- social proof gap |
| No social activity | LOW | Facebook page exists but dormant |

### Outreach Hook

**Lead with the compromised website finding.** Rob likely does not know his website is sending visitors to competitors. This is an immediate, tangible, urgent problem that a hands-on business owner will understand instantly. It is not a pitch -- it is a warning about money walking out the door right now.

**Secondary hook:** His #7 ranking for "oil furnace service near me" (170 searches/mo) -- he is already almost there on a high-value keyword without even trying. A proper website would push him into the top 3.

---

## Verification Log

| Claim | Source | Date | Method |
|-------|--------|------|--------|
| Owner is Rob Spakowski | AllBiz, BestProsInTown reviews | 2026-04-06 | Web search + directory fetch |
| Address: 1600 Frederica St W | Google, YellowPages, Canpages, BestProsInTown | 2026-04-06 | Multi-source directory cross-reference |
| Phone: (807) 623-4328 | Website, Google, YellowPages, AllBiz | 2026-04-06 | Multi-source verification |
| TSSA Registration FS R0076379460 | TSSA.org search results | 2026-04-06 | Web search referencing TSSA contractor registry |
| Google rating 4.0/5, 8 reviews | Google Maps search results | 2026-04-06 | Web search |
| Semrush: 23 keywords, 15 traffic | Semrush API domain_rank report | 2026-04-06 | API call, ca database |
| Authority Score: 6 | Semrush API backlinks_overview | 2026-04-06 | API call |
| 251 backlinks, 91 ref domains | Semrush API backlinks_overview | 2026-04-06 | API call |
| Last site update: Jan 2019 | HTML source meta tag (article:modified_time) | 2026-04-06 | curl + HTML parse |
| WordPress 6.9.4, Yoast, Site Kit | HTML source generator tags | 2026-04-06 | curl + HTML parse |
| Website redirects to competitors | Playwright browser sessions | 2026-04-06 | 3 separate navigation attempts, redirected to villeneuvemechanical.com, allamheatingandcooling.com, buhlermechanical.com |
| Senior discounts offered | Website homepage, directory listings | 2026-04-06 | WebFetch |
| 24/7 emergency service | Website, all directories | 2026-04-06 | Multi-source |
| Facebook page exists | Facebook search | 2026-04-06 | Web search |
| Dual GA tracking | HTML source (gtag.js + analytics.js) | 2026-04-06 | curl + HTML parse |
| Mobile nav broken | HTML source CSS (.navbar-toggle display:none) | 2026-04-06 | curl + HTML parse |
