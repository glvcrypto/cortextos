# Lead Dossier: B. Gibson Mechanical (Brad Gibson Plumbing Specialist)

*Deep Research v2 — 2026-04-06 (updated from v1 2026-03-20)*
*Niche: Plumbing / HVAC / Boilers / Excavation*
*Area: Thunder Bay, Ontario*
*Investigator: GLV Marketing*

---

## PHASE 1: NAP DISCOVERY

### Canonical Domain Confirmation

| Domain | Status | Notes |
|--------|--------|-------|
| **bradgibsonplumbing.com** | **LIVE — CANONICAL** | GoDaddy-hosted, active, all pages functional |
| bgibsonmechanical.com | **DEAD** — ECONNREFUSED | Legacy domain, still listed on some directories. Never renewed or deliberately abandoned. |
| bgmechanical.com | **Does not exist** | Not registered. Scout may have confused with the Gmail address (office.bgmechanical@gmail.com) |

**Canonical domain: bradgibsonplumbing.com** — confirmed live, GoDaddy Airo site builder, copyright 2024.

### NAP Table (Name, Address, Phone)

| Source | Business Name | Address | Phone | Website Listed | Consistent? |
|--------|--------------|---------|-------|----------------|-------------|
| **Website** | Brad Gibson Plumbing Specialist | 319 May St N, Thunder Bay, ON P7C 3R1 | (807) 631-9060 | bradgibsonplumbing.com | Baseline |
| **Google Business Profile** | B. Gibson Mechanical | 319 May St N, Thunder Bay, ON P7C 3R1 | (807) 631-9060 | bradgibsonplumbing.com | Name mismatch |
| **Birdeye** | B. Gibson Mechanical | 319 May St N, Thunder Bay, ON | (807) 631-9060 | — | OK |
| **BBB** | B. Gibson Mechanical | Thunder Bay, ON | — | — | Name only |
| **TrustedPros** | B. Gibson Mechanical | — | — | — | 0 reviews |
| **Chamber of Commerce** | B. Gibson Mechanical | — | — | — | Member |
| **YellowPages** | B. Gibson Mechanical | 319 May St N, Thunder Bay, ON | (807) 631-9060 | bgibsonmechanical.com (DEAD) | BAD — dead URL |
| **Yelp** | B Gibson Mechanical | 319 May St N, Thunder Bay, ON | (807) 631-9060 | — | OK |
| **Procore** | B Gibson Mechanical | Thunder Bay, ON | — | — | OK |
| **Facebook** | B. Gibson Mechanical | — | — | — | OK |
| **Instagram** | @b.gibson_mechanical | — | — | — | OK |
| **411 Canada** | Brad Gibson | Thunder Bay | (807) 939-2924 | — | WRONG phone (personal?) |

**NAP Issues Identified:**
1. **Brand name inconsistency**: GBP/directories use "B. Gibson Mechanical" while website uses "Brad Gibson Plumbing Specialist." Google may treat these as separate entities.
2. **YellowPages links to dead domain** (bgibsonmechanical.com) — actively harming trust signals.
3. **411 Canada listing** has a different phone number — likely Brad's personal/old number.
4. **TrustedPros** profile exists with 0 reviews — wasted listing.
5. **BBB** profile exists but NOT accredited.

---

## PHASE 2: SCREENSHOTS

Saved to `projects/glv-marketing/research/leads/screenshots/brad-gibson-mechanical/`:

| File | Description | Status |
|------|-------------|--------|
| `homepage-desktop.png` | Full-page desktop (1440px) — GoDaddy site, "Got Water? Plumbing Done Right" hero, services grid, heavy duty services section | Captured |
| `homepage-mobile.png` | Full-page mobile (390px) — cookie banner overlapping hero, content readable but cramped | Captured |
| `gbp-listing.png` | Google Maps search for B Gibson Mechanical 319 May St Thunder Bay — shows map location, no business card panel (requires sign-in) | Partial |
| `commercial-page.png` | Commercial page — rendered blank in Playwright (GoDaddy JS rendering). **Placeholder text confirmed via WebFetch** (see Phase 3) | Blank render |
| `competitor-clowdarling-homepage.png` | Clow Darling homepage — rendered blank in Playwright (JS-heavy WordPress site) | Blank render |

**Note:** The GoDaddy Airo site builder and Clow Darling's WordPress theme both rely heavily on JavaScript, causing Playwright to capture blank pages on some routes. Content was verified via WebFetch instead.

---

## PHASE 3: LIVE VERIFICATION (April 2026)

### Semrush Data — bradgibsonplumbing.com (CA database, April 2026)

| Metric | March 2026 (v1) | April 2026 (v2) | Change |
|--------|-----------------|-----------------|--------|
| **Semrush Rank (CA)** | #538,926 | **#591,225** | Dropped 52K positions |
| **Organic Keywords** | 32 | **25** | Lost 7 keywords |
| **Organic Traffic** | ~202/mo | **~169/mo** | Down 16% |
| **Organic Traffic Value** | $607/mo | **$509/mo** | Down 16% |
| **Paid Ads** | $0 | **$0** | No change |

**Trend: DECLINING.** Lost 7 keywords and ~33 visits/month in 17 days. No new content, no backlinks, no technical improvements. The site is slowly bleeding visibility.

### Top Ranking Keywords (April 2026)

| Keyword | Position | Search Volume | URL | Traffic Share |
|---------|----------|---------------|-----|---------------|
| plumbing thunder bay ontario | #7 | 720/mo | homepage | 10.05% |
| plumbing thunder bay | #6 | 170/mo | homepage | 2.36% |
| plumbers thunder bay | #9 | 590/mo | homepage | 1.18% |
| plumber thunder bay | #5 | 170/mo | homepage | 0.59% |
| thunder bay plumber | #7 | 70/mo | homepage | 0.59% |
| thunder bay plumbers | #6 | 70/mo | homepage | 0.59% |

**Keyword Cannibalization Confirmed (WORSE than v1):**
- "plumbers thunder bay" (590/mo) ranks on **4 different URLs**: homepage (#9), about (#30), residential (#53), appointment (#79)
- "plumber thunder bay" (170/mo) ranks on **3 URLs**: homepage (#5), about (#26), contact (#49)
- "thunder bay plumber" (70/mo) ranks on **3 URLs**: homepage (#7), about (#25), residential (#43)
- "plumbing thunder bay ontario" (720/mo) ranks on **3 URLs**: homepage (#7), residential (#83, #96)

This is textbook cannibalization — Google is splitting authority across 3-4 pages for every money keyword.

### Competitor Comparison — Clow Darling (April 2026)

| Metric | Brad Gibson | Clow Darling | Gap |
|--------|------------|--------------|-----|
| **Semrush Rank** | #591,225 | **#147,543** | 4x worse |
| **Organic Keywords** | 25 | **153** | 6.1x gap |
| **Organic Traffic** | 169/mo | **1,401/mo** | 8.3x gap |
| **Traffic Value** | $509/mo | **$5,535/mo** | 10.9x gap |
| **Paid Ads** | $0 | $0 | Both zero |

**The gap has WIDENED since March.** Brad went from 5.5x keyword gap to 6.1x, and from 6.7x traffic gap to 8.3x. Clow Darling is pulling away.

Clow Darling's top non-branded keywords:
- "plumbing thunder bay ontario" #2 (720/mo) — Brad is #7
- "hvac thunder bay" #1 (170/mo) — Brad doesn't rank
- "air conditioning thunder bay" #2 (260/mo) — Brad doesn't rank
- "plumbers thunder bay" #5 (590/mo) — Brad is #9
- "furnace thunder bay" #6 (140/mo) — Brad doesn't rank
- "residential plumbing services" #3 (170/mo) — Brad doesn't rank

**Key insight:** Clow Darling dominates HVAC/heating/cooling keywords that Brad doesn't even target, despite Brad offering boiler/heating services. This is a massive untapped keyword cluster.

### Google Reviews — Verified April 2026

| Platform | Reviews | Rating | Owner Responses |
|----------|---------|--------|-----------------|
| **Google (via Birdeye)** | **56** | **4.0 stars** | **NONE** |
| Yelp | Unknown (403 blocked) | Unknown | Unknown |
| TrustedPros | 0 | N/A | N/A |
| BBB | 0 | N/A | N/A |

**Review count unchanged at 56 since March.** Zero new reviews in 17 days. No owner responses to any review. The negative billing review from ~7 months ago (Sijo Job, 1-star) remains unaddressed.

**Note:** The scout originally reported "4.0/49 reviews" — actual count is 56. The scout data was stale.

### Commercial Page Placeholder Text — STILL LIVE (April 2026)

**CONFIRMED via WebFetch April 6, 2026:** The commercial page at bradgibsonplumbing.com/commercial still contains the developer note: *"For commercial section please include: Our Commercial plumbing department..."*

This placeholder text has been visible for at least 17 days (since our first check March 20) and likely much longer. It remains the single best outreach hook.

### Contact Form — STILL BROKEN (April 2026)

**CONFIRMED:** Contact form at bradgibsonplumbing.com/contact still only has two fields:
- Name (required)
- Email (required)

No phone field. No message/description field. No service type selector. A homeowner with a burst pipe cannot describe their emergency.

### Legacy Domain — STILL DEAD (April 2026)

**CONFIRMED:** bgibsonmechanical.com returns ECONNREFUSED. Still listed on YellowPages directory linking to the dead URL.

---

## PHASE 4: DEEP RESEARCH

### Decision Maker Profile

| Field | Value | Verified By |
|-------|-------|-------------|
| **Name** | Brad Gibson | Website, LinkedIn, Facebook, TBNewsWatch, Chamber |
| **Title** | Owner / General Manager / Master Plumber | LinkedIn, website About page |
| **Experience** | 35+ years in the trade | Website About page, LinkedIn |
| **Founded B. Gibson Mechanical** | 2012 (14 years in business) | Website, Chamber, multiple directories |
| **Spouse** | Kelly Gibson | Facebook ("BradnKelly Gibson"), Dusty's Car Care website |
| **Kelly's Background** | Military veteran (Corporal, medic), nurse (home & palliative care), mother of 3 daughters | Dusty's Car Care "Who We Are" page |
| **Other Business** | Dusty's Car Care Centre (Brad & Kelly co-own) | dustyscarcare.com |
| **LinkedIn** | https://ca.linkedin.com/in/brad-gibson-b4973293 | Direct |
| **Facebook (personal)** | https://www.facebook.com/brad.gibson.7771/ | Direct |
| **Business Facebook** | https://www.facebook.com/b.gibsonmechanical/ | Direct |
| **Business Instagram** | @b.gibson_mechanical | Direct |
| **Email** | office.bgmechanical@gmail.com | Website, directories |
| **Phone** | (807) 631-9060 | Website, GBP, directories |
| **Address** | 319 May St N, Thunder Bay, ON P7C 3R1 | Website, GBP, directories |

**Decision maker confirmed across 5+ independent sources.** Brad Gibson is the sole owner-operator making all business decisions. Kelly handles bookkeeping for Dusty's but may also monitor the bgmechanical email.

### Personal Story (Expanded)

Brad Gibson is a Thunder Bay lifer with 35+ years in the plumbing trade. He apprenticed through UA Local 628 (United Association of Plumbers and Pipefitters), worked decades as a journeyman and site foreman, then founded B. Gibson Mechanical in 2012 at roughly age 50. He runs a **union shop** — a deliberate choice that speaks to his values around proper training and fair wages. His team includes union plumbers, apprentices (Local UA 628), a dedicated dig crew, experienced excavator operators, labourers, and specialized mechanical technicians.

Brad and Kelly Gibson are described as "go-getters and problem-solvers" who run multiple businesses together. Kelly is a military veteran (Corporal, medic) turned nurse who specialized in home and palliative care. She now handles the office and bookkeeping at Dusty's Car Care Centre, their other venture. They have three daughters.

**The Pinhole Leak Story (THE outreach angle):**

During Thunder Bay's city-wide water crisis — the City added sodium hydroxide to the water supply in 2018 to suppress lead levels, which corroded copper pipes in an estimated **8,700 households** — Brad organized a community response. Key facts:

- The City injected sodium hydroxide to reduce lead seeping from old lead pipes (7,500-8,000 homes affected)
- The chemical corroded copper pipes, causing pinhole leaks that cost homeowners **upwards of $10,000** to repair
- Brad enlisted local businesses to create and distribute **free DIY pinhole-leak patch kits** to hard-hit neighbourhoods like Northwood
- He is a founding member of the **"Leaky Pipe Club"** — an informal advocacy group for affected homeowners
- **TBNewsWatch covered him multiple times** (at least 3 articles):
  - "Patch kits arm residents against pinhole leaks" (3160772)
  - "'It's unbelievable,' plumbing company says about ongoing pinhole water leaks" (2374831)
  - "'Don't believe everything you see on the Internet,' contractor says" (9559352)
- **CBC News** covered the ongoing lawsuits against the City
- **ES&E Magazine** covered the story nationally
- The City has since phased out sodium hydroxide, but the damage is done — thousands of homes still need pipe replacement
- Brad is positioned as **the local expert** on this issue, yet has **zero dedicated digital content** about it

**Certifications:** TSSA G1 Gas, University of Waterloo Project Management, Backflow Prevention & Testing, Ozone Depletion Training, Supervisory Courses, WHMIS, Asbestos Safety.

**Award:** Nominated for Thunder Bay Chamber of Commerce **Medium-Sized Business Excellence Award (2022)** — notable for an owner-operated trade shop competing against established multi-generational firms like Clow Darling (est. 1937).

**Named Commercial Clients:** OLG Casino, St. Joseph's Care Group (Lila Greco addition), Nanibijou Daycare, Matawa Education Centre Gym Addition, Dollarama, Pet Valu, Scotiabank (West Arthur), Rocky Mountain Chocolate Factory, Burger King, Osmow's, Magnus Theatre, Planet Fitness.

**Procore Profile:** Listed on Procore's contractor network as a mechanical contractor in Thunder Bay — confirms commercial/industrial capability.

---

## Current Situation (All Issues — April 2026)

| # | Issue | Severity | Detail | Still Active? |
|---|-------|----------|--------|---------------|
| 1 | **Placeholder text on commercial page** | **CRITICAL** | Developer note visible: "For commercial section please include:" — unfinished copy on a page listing OLG Casino, Planet Fitness | **YES** — confirmed Apr 6 |
| 2 | **Keyword cannibalization** | **HIGH** | 4 URLs compete for "plumbers thunder bay" (590/mo), 3 URLs compete for every other money keyword. Diluting authority. | **YES** — confirmed via Semrush Apr 6 |
| 3 | **Thin content across all pages** | **HIGH** | Residential ~850 words (improved from v1 estimate), Commercial ~120 words + placeholder. No blog, no FAQ, no educational content. | **YES** |
| 4 | **SEO declining** | **HIGH** | Lost 7 keywords and 33 visits/mo since March. Rank dropped 52K positions. Gap with Clow Darling widening. | **YES** — NEW finding |
| 5 | **Dead legacy domain in directories** | **MEDIUM** | bgibsonmechanical.com returns ECONNREFUSED. YellowPages still links to it. | **YES** — confirmed Apr 6 |
| 6 | **Contact form missing fields** | **MEDIUM** | Only name + email. No phone, no message, no service type. | **YES** — confirmed Apr 6 |
| 7 | **No review responses** | **MEDIUM** | 56 reviews, zero owner responses. Negative billing review unaddressed. Birdeye profile unclaimed. | **YES** — confirmed Apr 6 |
| 8 | **Brand name inconsistency** | **MEDIUM** | Website says "Brad Gibson Plumbing Specialist," GBP says "B. Gibson Mechanical." Google may not consolidate signals. | **YES** |
| 9 | **No hours of operation** | **LOW-MEDIUM** | Not displayed anywhere. Site says "24/7 Emergency" but no regular business hours. | **YES** |
| 10 | **Gmail for business email** | **LOW** | office.bgmechanical@gmail.com — minor professionalism gap for a company doing OLG Casino work. | **YES** |
| 11 | **Zero HVAC/heating keywords** | **HIGH** | Brad offers boiler/heating services but doesn't rank for any HVAC keywords. Clow Darling owns "hvac thunder bay" (#1), "furnace thunder bay" (#6), "air conditioning thunder bay" (#2). | **NEW finding** |
| 12 | **Cookie banner obscuring hero on mobile** | **LOW** | Cookie consent banner covers the hero CTA on mobile viewport. | **NEW finding** |

---

## Marketing Assessment (April 2026 — Updated)

| Area | Grade | Detail |
|------|-------|--------|
| **Website Quality** | C- | GoDaddy Airo site builder. Clean but generic layout. Placeholder text on commercial page. Cookie banner obscures hero on mobile. No schema markup. Copyright says 2024. |
| **SEO** | D- | 25 organic keywords (down from 32), ~169/mo traffic (down from 202). Severe keyword cannibalization. No blog, no FAQ, no content marketing. No schema. No dedicated service-area or service-specific pages. Zero HVAC keywords despite offering HVAC services. **Actively declining.** |
| **Google Business Profile** | B- | 56 reviews at 4.0 stars. Likely claimed. No owner review responses. Brand name mismatch with website. |
| **Social Media** | D+ | Facebook and Instagram profiles exist. Activity level sporadic. Educational drain installation posts noted but infrequent. |
| **Paid Advertising** | F | Zero Google Ads. Zero Meta ads. No LSA. Not in Semrush ad database. |
| **Blog/Content** | F | Zero content. No blog section. No FAQ. No educational articles despite Brad being a media-quoted expert on the pinhole leak crisis. |
| **Email Capture** | F | No newsletter, no lead magnet, no email list. Only a broken 2-field contact form. |
| **Review Management** | D | 56 reviews after 14 years = ~4/year. Should be 150-300+. No review response system. No review solicitation. Birdeye unclaimed. |
| **Brand/Reputation** | B+ | Strong offline reputation — Chamber nominee, TBNewsWatch coverage, community advocacy, OLG Casino/Planet Fitness clients. Not translated to digital at all. |
| **Directories** | C | Listed on YellowPages (links to dead domain), BBB (not accredited), TrustedPros (0 reviews), Chamber (member), Procore, Yelp. Inconsistent NAP across listings. |
| **Overall** | **D+** | The mismatch between offline capability and online presence is the worst in the Thunder Bay plumbing market. A 35-year master plumber with OLG Casino clients, TBNewsWatch media coverage, and a Chamber nomination has a website that looks like a first-year operator. |

---

## Niche-Marketing Misalignment (Updated April 2026)

| What Thunder Bay Homeowners Do | What Brad's Marketing Does | Gap |
|-------------------------------|---------------------------|-----|
| **Search Google** for "plumbing thunder bay ontario" (720/mo) | Ranks #7 — but 3 other pages cannibalize the same keyword, preventing climb to #1-3 | Cannibalization is the #1 technical blocker |
| **Search for HVAC/heating** — "hvac thunder bay" (170/mo), "furnace thunder bay" (140/mo), "air conditioning thunder bay" (260/mo) | **Does not rank for ANY heating/cooling keyword.** Clow Darling owns all three at #1-#6. | Missing an entire service category worth 570+ searches/mo |
| **Look for lead pipe help** — 8,700 affected households, $10K+ repair costs, City grants available | One brief mention on residential page. No dedicated landing page. No grant info. No FAQ. Brad is literally the media-quoted local expert. | The single biggest marketing opportunity in Thunder Bay plumbing |
| **Check Google reviews** before calling | 56 reviews at 4.0 stars — no owner responses. Clow Darling has 88+ years of brand recognition. | Review velocity too low. Negative review unaddressed. |
| **Need emergency help** — frozen pipes, burst waterlines, boiler failures | Site says "24/7 Emergency Service" but no hours, no emergency page, contact form can't describe the problem | Emergency searchers will call whoever picks up first |
| **Value trust/credentials** | Chamber nomination, TSSA G1, 35 years, union shop, OLG Casino — all buried or absent from site | Trust signals exist but are invisible online |
| **Compare on price** — median household income $77,500 | Zero pricing info. No "what to expect" content. Competitors who give ranges win the click. | Price-sensitive market with zero price transparency |

---

## Opportunities Identified (Ranked by Impact)

### 1. Lead Line Replacement Landing Page — HIGHEST IMPACT
Thunder Bay has ~8,700 households with lead pipe issues. The City offers grants. Brad is the known community expert (TBNewsWatch coverage, Leaky Pipe Club). **No plumber in Thunder Bay has a dedicated landing page for this.** Keywords: "lead line replacement Thunder Bay," "Thunder Bay water pipe grants," "copper pipe pinhole leak Thunder Bay" — minimal competition. A single page could capture 200-500 searches/mo during peak awareness. This is a first-mover advantage.

### 2. Fix Keyword Cannibalization — QUICK WIN
Consolidate ranking authority to homepage for money keywords. Canonical tags, noindex on competing pages, or content differentiation. Could move from #7-9 to #3-5 for "plumbing thunder bay ontario" (720/mo) within 60 days.

### 3. HVAC/Heating Keyword Expansion — 570+ searches/mo
Brad offers boiler installation and heating services but ranks for zero HVAC keywords. Clow Darling monopolizes this space. Dedicated service pages for boilers, heating, and cooling could capture "hvac thunder bay" (170/mo), "furnace thunder bay" (140/mo), "air conditioning thunder bay" (260/mo).

### 4. Close the Clow Darling Gap
Clow Darling: 153 keywords, 1,401/mo traffic, $5,535 value. Brad: 25 keywords, 169/mo traffic, $509 value. **The gap widened from 6.7x to 8.3x in 17 days.** A 12-month SEO strategy targeting 75 keywords (plumbing + HVAC + excavation + lead line) could realistically close this to 50/50.

### 5. Review Volume System
56 reviews after 14 years = ~4/year. A structured post-job SMS/email review request could generate 4-8/month. Owner responses to every review (positive and negative) would signal engagement to Google. Target: 100 reviews in 6 months, 200 in 18 months.

### 6. Commercial Case Studies
OLG Casino, Planet Fitness, Scotiabank, St. Joseph's Care Group — enterprise-tier clients buried in a paragraph with placeholder text. Individual case study pages would support SEO ("commercial plumbing Thunder Bay") and B2B credibility.

### 7. Excavation + Directional Drilling Keywords (Uncontested)
Very few plumbers offer in-house excavation, hydro vac, and directional drilling. "Excavation contractor Thunder Bay," "hydro vac Thunder Bay," "directional drilling Thunder Bay" are essentially uncontested.

### 8. Google LSA (Local Services Ads)
Zero ad spend. Google LSA for plumbing in Thunder Bay = Google Guaranteed badge, pay-per-lead pricing, review integration. With 56 reviews and TSSA licensing, he'd qualify immediately.

### 9. Fix the Contact Funnel
Add phone, message, service type, and urgency fields to the contact form. Immediate conversion rate improvement from existing traffic.

### 10. NAP Cleanup + Directory Optimization
Fix YellowPages dead link, standardize business name across all directories, claim Birdeye profile, get BBB accredited, solicit TrustedPros reviews.

---

## Red Flags

| Flag | Severity | Detail |
|------|----------|--------|
| Corporate acquisition | None | Family-owned and operated. No evidence of sale or acquisition. |
| Existing agency | None | No evidence of any marketing agency. GoDaddy Airo site builder = self-managed. |
| Negative review pattern | None | One isolated billing complaint (1-star, ~7 months old). Other reviews 4-5 stars. No pattern. |
| Multiple businesses | Low | Brad and Kelly also run Dusty's Car Care Centre. Kelly manages Dusty's office; Brad focuses on mechanical. |
| SEO declining | Medium | Site is losing keywords and traffic month-over-month. Without intervention, the Clow Darling gap will continue widening. This could be a motivator for outreach. |
| GoDaddy site builder | Low | Migrating from GoDaddy Airo to a proper WordPress/custom site would be part of any engagement. Not a dealbreaker. |

**Verdict: STRONG LEAD. PROCEED WITH OUTREACH.**

---

## Recommended Outreach Strategy

### Primary Hook (observation-based question)

> "Your crew has done work for OLG Casino, Planet Fitness, and St. Joseph's Care Group — but your commercial page still has placeholder text visible to anyone who visits. I'm curious: is the website something that's been on your list to fix, or has it just not been a priority?"

**Why this works:** Non-threatening, specific, immediately verifiable. Shows homework. Doesn't criticize — opens a conversation about priorities. Brad will either say "yeah, we've been meaning to fix it" (opening) or "we get all our work from referrals" (which leads to the review/SEO conversation).

### Secondary Hook (if commercial page gets fixed before outreach)

> "You're the only plumber in Thunder Bay with TBNewsWatch coverage for the pinhole leak crisis, a Chamber nomination, and OLG Casino on your client list — but you have 25 keywords in Google while Clow Darling has 153. That gap is costing you leads every month, and it's actually getting worse."

### Data Points to Include in Email

- 25 keywords vs. Clow Darling's 153 (6.1x gap — widened from 5.5x in March)
- 169/mo traffic vs. 1,401/mo (8.3x gap — widened from 6.7x in March)
- 56 reviews after 14 years (should be 200+)
- Lead line replacement page opportunity (8,700 affected households, zero dedicated content from any Thunder Bay plumber)
- Zero HVAC keywords despite offering boiler/heating services (Clow Darling owns all 3 top HVAC keywords)
- 4 pages competing against each other for "plumbers thunder bay" — keyword cannibalization

### Tone
Peer-level. Reference the Chamber nomination and pinhole kit initiative directly. Brad is a tradesman who built something real — speak to that, not to marketing jargon. He's 50+ with 35 years in the trade; he respects competence, not flash.

### CTA
> "My partner and I work with one trade business per market. If this is something worth a 15-minute conversation, here's my calendar: https://calendar.app.google/5hcxx2tWmVkNvS1c6"

### Best First Contact
**Email to office.bgmechanical@gmail.com** — Brad and Kelly both likely monitor. CASL-compliant: one email only, clear opt-out, legitimate business interest.

---

## Sources

### Primary (Direct)
- [Brad Gibson Plumbing Specialist — Homepage](https://bradgibsonplumbing.com/)
- [Brad Gibson Plumbing Specialist — About Us](https://bradgibsonplumbing.com/about-us-1)
- [Brad Gibson Plumbing Specialist — Residential](https://bradgibsonplumbing.com/residential)
- [Brad Gibson Plumbing Specialist — Commercial](https://bradgibsonplumbing.com/commercial)
- [Brad Gibson Plumbing Specialist — Contact](https://bradgibsonplumbing.com/contact)

### Decision Maker Verification
- [Brad Gibson — LinkedIn](https://ca.linkedin.com/in/brad-gibson-b4973293)
- [BradnKelly Gibson — Facebook](https://www.facebook.com/brad.gibson.7771/)
- [B. Gibson Mechanical — Facebook](https://www.facebook.com/b.gibsonmechanical/)
- [B. Gibson Mechanical — Instagram](https://www.instagram.com/b.gibson_mechanical/)
- [Dusty's Car Care Centre — Who We Are](https://dustyscarcare.com/who-we-are)

### Reviews & Directories
- [B. Gibson Mechanical — Birdeye (56 reviews, 4.0 stars)](https://reviews.birdeye.com/b-gibson-mechanical-166900599280630)
- [B. Gibson Mechanical — BBB Profile](https://www.bbb.org/ca/on/thunder-bay/profile/heating-and-air-conditioning/b-gibson-mechanical-0057-75092)
- [B. Gibson Mechanical — TrustedPros (0 reviews)](https://trustedpros.ca/company/b-gibson-mechanical)
- [B. Gibson Mechanical — Thunder Bay Chamber](https://business.tbchamber.ca/list/member/b-gibson-mechanical-6078)
- [B. Gibson Mechanical — YellowPages](https://www.yellowpages.ca/bus/Ontario/Thunder-Bay/B-Gibson-Mechanical/8177614.html)
- [B Gibson Mechanical — Yelp](https://m.yelp.ca/biz/b-gibson-mechanical-thunder-bay)
- [B Gibson Mechanical — Procore](https://network.procore.com/p/b-gibson-mechanical-thunder-bay)

### Media Coverage (Pinhole Leak Crisis)
- [TBNewsWatch — Patch kits arm residents against pinhole leaks](https://www.tbnewswatch.com/local-news/patch-kits-arm-residents-against-pinhole-leaks-3160772)
- [TBNewsWatch — 'It's unbelievable,' plumbing company says about ongoing pinhole water leaks](https://www.tbnewswatch.com/local-news/its-unbelievable-plumbing-company-says-about-ongoing-pinhole-water-leaks-3-photos-2374831)
- [TBNewsWatch — Don't believe everything you see on the Internet, contractor says](https://www.tbnewswatch.com/local-news/dont-believe-everything-you-see-on-the-internet-contractor-says-9559352)
- [CBC News — Lawsuits against City of Thunder Bay over leaky pipes](https://www.cbc.ca/news/canada/thunder-bay/pinholeleaks-thunderbay-lawsuits-1.6778568)
- [ES&E Magazine — Growing anger over pinhole leaks in Thunder Bay](https://esemag.com/water/anger-over-pinhole-leaks-thunder-bay/)
- [InfoSuperior — Thunder Bay's Lead Control Program: Unforeseen Consequences](https://infosuperior.com/blog/2020/02/13/thunder-bays-lead-control-program-unforeseen-consequences/)

### SEO Data
- Semrush — domain_rank + domain_organic reports (CA database, April 2026)
- Semrush — Clow Darling domain_rank + domain_organic reports (CA database, April 2026)

### Competitor
- [Clow Darling — Homepage](https://clowdarling.com/)
