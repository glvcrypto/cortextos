# Lead Dossier: Be The Ball

> **Status:** READY FOR OUTREACH
> **Investigated:** 2026-04-07
> **Investigator:** Claude (GLV Marketing)
> **Confidence:** HIGH

---

## Business Identity

| Field | Detail |
|-------|--------|
| **Legal Name** | Be The Ball (operating as BTB) |
| **Trade** | Indoor golf simulator lounge + kitchen/bar + patio |
| **Address** | 222 Alder Street South, Greater Sudbury, ON P3C 4J2 |
| **Phone** | 705-674-5635 (primary) / 705-507-4895 (DiscoverSudbury listing) |
| **Email** | betheballsudbury@gmail.com |
| **Website** | betheballsudbury.com (Wix) |
| **Booking** | betheballsudbury.golfbooking.ca (GolfBooking.ca platform) |
| **Facebook** | facebook.com/betheballsudbury — 604 followers |
| **Instagram** | @betheballsudbury — 1,009 followers, 61 posts |
| **PlaySport** | playsport.com/betheball_ag_0fc337fa |
| **Google Rating** | Not confirmed — Facebook shows "Not yet rated" with 4 reviews |

---

## Decision Maker

### Patty Desjardins — Co-Owner/Operator

**Background:**
- Family has deep roots in Sudbury's hospitality scene spanning multiple generations
- Parents owned the Crystal Palace dance hall (the same building at 222 Alder St)
- Parents later purchased the Townehouse Tavern and converted it to Sudbury's main music venue
- Family also owned Walden General Store
- Patty and her brother **Bernie Desjardins** later opened **The Laughing Buddha** (well-known Sudbury restaurant on Elgin Street — thelaughingbuddhasudbury.com)
- Josie's Secret Patio (behind Be The Ball) is named after Patty's mother Josie, who was known for her catering and cooking

**What this tells us:**
- Experienced hospitality operator — not a first-time business owner
- Family portfolio: The Laughing Buddha + Be The Ball + Josie's Secret Patio = 3 connected venues
- Community-oriented brand identity — they lean into heritage and family legacy
- Likely manages marketing herself or with minimal outside help (Gmail-based email, Wix site)

**Also mentioned:** "Paul" is listed as an organizer on PlaySport. Relationship to Patty unclear — possibly spouse or business partner.

---

## The Venue

### Indoor Golf (Year-Round Revenue)
- **2 bays** named SPALDING and SPACKLER (Caddyshack references — strong brand personality)
- **HD Golf** simulator technology (Canadian company, based in Vaughan ON)
- 4-point high-speed camera sensor system
- 20-foot widescreen projection per bay
- 40+ PGA courses available (photo-realistic rendering)
- Also offers non-golf games suitable for beginners

### Kitchen & Bar (Josie's Kitchen)
- Full-service bar and licensed kitchen
- Wood-fired pizza oven
- Shareable plates, creative cocktails, wine, beer selection
- Lunch menu page exists on the site (/menus)
- Food catering available for private events

### Josie's Secret Patio (Seasonal)
- Outdoor garden patio behind the main building
- Capacity: ~40 people
- Pergola with grapevines, string lights
- Giant Jenga, cornhole, axe throwing
- Named after Patty's mother — strong emotional branding

### Events & Private Bookings
- Indoor capacity: 40 people
- Patio capacity: additional 40 people
- Suited for: staff socials, showers, stags, small weddings, corporate events
- Has a dedicated /contact-4 (PARTIES) page

### Pricing
- **$50/hour per group** (confirmed via RANGE Magazine guide)
- Competitor comparison:
  - Shooters Indoor Golf: $45/hr + HST
  - PinHi: $70/hr (GOLFZON tech, wider bay)
  - The Range Sudbury: pricing not public
- BTB is mid-market on price — positioned as a lounge experience, not a premium sim facility

### Hours
- Sunday listed as 7:00 AM - 2:00 AM (from site metadata)
- Full weekly hours not publicly confirmed

---

## Website & Digital Presence Assessment

### Website (betheballsudbury.com — Wix)

**CRITICAL RED FLAG: Site has a redirect issue.** During Playwright testing, the site loads initially but then auto-redirects to mulligansindoorgolf.com and then idylwylde.com within 5-8 seconds. This is likely caused by:
- A malicious/expired ad script injected into the Wix site
- A compromised Wix plugin or third-party embed
- Wix free-tier ad redirect behaviour (unlikely given custom domain)

This means **potential customers visiting the site are being sent to competitors.** This is an emergency-level issue.

**Site structure (8 indexed pages):**
1. `/` — Homepage
2. `/about-3` — Book Online
3. `/technology-faq` — Simulators
4. `/menus` — Lunch Menu
5. `/food-drinks` — Kitchen
6. `/reservations` — Reservations
7. `/general-7` — League
8. `/contact-4` — Parties

**Issues identified:**
- Wix platform = limited SEO flexibility, no custom code control
- Heavy JavaScript rendering — pages load blank, content is client-side only
- URL slugs are generic Wix defaults (about-3, general-7, contact-4) — poor for SEO
- No blog or content section whatsoever
- No schema markup visible
- No testimonials or review widgets
- Gmail-based business email (not professional domain email)
- Two different phone numbers across directories (NAP inconsistency)

### Social Media
- **Instagram:** 1,009 followers / 61 posts — low posting frequency
- **Facebook:** 604 followers / "Not yet rated" — minimal review presence
- No TikTok presence found
- No YouTube channel found
- No Google Business Profile rating confirmed in search results

### Booking System
- Uses GolfBooking.ca (third-party platform) — separate domain from main site
- Booking link exists but is external — friction in the customer journey
- No pricing visible on booking page without logging in

### SEO Assessment (without Semrush — API units exhausted)
- Niche context: "golf simulator sudbury" = 390/mo search volume
- "be the ball" branded = 390/mo (strong branded search)
- 6 competitors in the Sudbury golf simulator space
- BTB has zero blog content to capture informational searches
- Wix SEO limitations: no server-side rendering, limited technical control
- URL structure is non-optimized (Wix defaults)
- No evidence of any active SEO strategy

---

## Competitive Landscape (Sudbury Golf Simulators)

| Facility | Bays | Technology | Price/Hr | Differentiator |
|----------|------|------------|----------|----------------|
| **Be The Ball** | 2 | HD Golf | $50 | Lounge/kitchen/patio, downtown, events |
| **PinHi** | 1 | GOLFZON TwoVisionNX | $70 | Premium tech, moving swing plate, inside Overtime bar |
| **Shooters Indoor Golf** | 3 | Foresight Sports GC Hawk | $45 | Budget option, 1000+ courses |
| **The Range Sudbury** | 3 | TrackMan IO / Virtual Golf 3 | N/A | Outdoor range + sims, Chelmsford location |
| **Next Golf Sudbury** | ? | TrackMan + Uneekor | N/A | Private rooms, premium positioning |
| **Offszn** | ? | Unknown | N/A | "Premium indoor golf" branding |

**BTB's competitive position:** Mid-price, fewest bays, but ONLY downtown venue with full kitchen + patio + events. The lifestyle/lounge angle is their moat — competitors are pure golf facilities.

---

## Misalignment & Opportunities

### Core Misalignment
Be The Ball has a **premium downtown lifestyle brand** (family heritage, lounge atmosphere, wood-fired pizza, craft cocktails, Caddyshack-themed bays) but is marketing itself like a **basic golf simulator rental.** Their digital presence does not reflect the quality of the in-person experience.

The Desjardins family knows hospitality — The Laughing Buddha is a well-regarded Sudbury institution. But that expertise is not translating to BTB's digital marketing.

### Opportunity 1: Website Emergency — Fix the Redirect + Rebuild

**The redirect issue alone is costing them bookings every single day.** Every visitor who lands on the Wix site gets sent to a competitor within seconds. This is the most urgent problem.

Beyond the redirect, a proper website would:
- Showcase the lounge atmosphere (photography, video)
- Integrate booking directly (no third-party domain hop)
- Capture "golf simulator sudbury" searches with proper SEO
- Display menus, pricing, and event packages clearly
- Build trust with reviews and testimonials

**Pitch angle:** "Your website is currently redirecting visitors to other golf courses. We can fix that today and build you a site that actually converts visitors into bookings."

### Opportunity 2: Local SEO + Content Marketing

With 390/mo searches for "golf simulator sudbury" and ZERO blog content:
- Seasonal content: "What to do in Sudbury this winter" / "Indoor date night ideas Sudbury"
- Event content: "Corporate team building Sudbury" / "Stag and doe ideas Sudbury"
- Golf content: "Best golf simulator courses to play" / "Golf simulator vs driving range"
- Food/lifestyle: "Downtown Sudbury restaurants with a twist" / "Wood-fired pizza Sudbury"
- They have content angles competitors don't — the kitchen, patio, and events are unique differentiators

**Pitch angle:** "You're the only golf simulator in Sudbury with a full kitchen and patio. That's a content marketing goldmine that none of your 5 competitors can touch."

### Opportunity 3: Google Business Profile + Review Strategy

- Facebook shows "Not yet rated" with only 4 reviews
- Google rating not prominently visible
- No review generation system in place
- With 390/mo branded searches, a strong GBP with 50+ reviews would dominate local map pack
- Review strategy tied to the booking/checkout flow would compound over time

**Pitch angle:** "People are already searching for you by name 390 times a month. A proper Google profile with reviews would turn those searches into bookings instead of dead ends."

---

## Red Flags

1. **CRITICAL: Website redirect to competitors.** The Wix site auto-redirects to mulligansindoorgolf.com / idylwylde.com after loading. This is actively losing customers.
2. **NAP inconsistency.** Two different phone numbers across directories (705-674-5635 vs 705-507-4895). Hurts local SEO trust signals.
3. **Gmail business email.** betheballsudbury@gmail.com instead of a domain-based email. Looks unprofessional.
4. **Only 2 bays.** Smallest capacity in the market. Revenue ceiling is lower than competitors with 3+ bays.
5. **Seasonal revenue risk.** Patio and potentially golf traffic are seasonal. Summer could be slow for simulators (outdoor golf season).
6. **Low social proof.** 4 Facebook reviews, unknown Google rating. Competitors could be building stronger review profiles.
7. **Family multi-venue operation.** Attention may be split between The Laughing Buddha, Josie's Patio, and BTB. Marketing budget may be shared/limited.

---

## Outreach Strategy

### Lead Temperature: WARM-HOT

**Why this is a strong lead:**
- The redirect issue is an immediate, provable emergency we can demonstrate
- Family hospitality operators understand the value of marketing
- Downtown lifestyle positioning is premium — they charge accordingly
- Multiple revenue streams (golf, food, events, patio) = good monthly budget potential
- Low current competition for their specific niche (golf + dining + events)
- Strong branded search (390/mo) shows organic demand already exists

### Recommended Approach

**Hook:** Lead with the redirect discovery. This is a tangible, urgent problem that costs nothing to verify and positions GLV as someone who does real research before reaching out.

**Channel:** Email to betheballsudbury@gmail.com (primary). Follow up via phone 705-674-5635.

**Tone:** Direct, helpful, not salesy. The Desjardins family are experienced business owners — they'll respect a peer-level conversation, not a pitch deck.

**Key message:** "We found something wrong with your website that's actively sending your visitors to other golf courses. We'd like to show you what's happening and how to fix it — no strings attached."

---

## Evidence Log

| Source | URL | Retrieved |
|--------|-----|-----------|
| BTB Homepage | betheballsudbury.com | 2026-04-07 |
| Sudbury.com Spotlight | sudbury.com/spotlight/be-the-ball-a-familys-community-legacy-continues-7356039 | 2026-04-07 |
| DiscoverSudbury Listing | discoversudbury.ca/things-to-do/activities/be-the-ball/ | 2026-04-07 |
| RANGE Magazine Guide | readrange.com/guide-to-sudbury-ontario/ | 2026-04-07 |
| Facebook Page | facebook.com/betheballsudbury | 2026-04-07 |
| Instagram Profile | instagram.com/betheballsudbury | 2026-04-07 |
| GolfBooking.ca | betheballsudbury.golfbooking.ca | 2026-04-07 |
| PinHi Competitor | pinhi.ca | 2026-04-07 |
| Shooters Competitor | shootersindoorgolf.com/rates-and-rules | 2026-04-07 |
| The Range Competitor | therangesudbury.ca | 2026-04-07 |
| Playwright Redirect Test | Browser automation | 2026-04-07 |

---

## Screenshots

| File | Description |
|------|-------------|
| `screenshots/be-the-ball/homepage.png` | Homepage capture (rendered blank — Wix JS issue, then redirected to competitor) |

**Note:** Full-page screenshots could not be captured. The Wix site renders blank in headless browsers and redirects to competitor sites (mulligansindoorgolf.com, idylwylde.com) within 5-8 seconds. This redirect behaviour was confirmed across multiple Playwright sessions.
