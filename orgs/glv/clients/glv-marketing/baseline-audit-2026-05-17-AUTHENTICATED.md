# Authenticated Baseline Audit — GLV Marketing Socials

**Date:** 2026-05-17
**Captured by:** boss agent (delegated to general-purpose subagent)
**Method:** agent-browser CLI, persistent `glv-socials` session (Aiden-authenticated)
**Replaces:** `baseline-audit-2026-05-16.md` (public-view audit, now superseded)

---

## Top-line summary

Authenticated pass confirms the fleet is **dramatically more dormant than public-view suggested**: GBP shows just 7 customer interactions over 6 months (Dec 2025–May 2026, ALL website clicks, 0 calls/directions/chats/bookings) — but the profile completeness is "Complete Info" with 7 photos, 3 reviews at 5.0 average, and 231 profile views over the period. **Facebook surfaced 3 substantive posts** (60+ days old per Meta Business Suite "no posts in the last 60 days") covering AI search visibility, small-biz website gaps, and Google reviews-as-ranking — none of these existed in the public-view audit. **YouTube is fully zero** (no description, no email, no banner, 0 subs, 0 views, monetization eligibility 0/1000 subs and 0/4000 watch hours). **X analytics is gated behind Premium**, Threads insights gated at 100 followers, **LinkedIn admin is the one platform where authenticated access failed** (the GLV-email Google account does not have a personal LinkedIn account; Aiden's personal LI is not in this browser session).

**The good news:** posting will move every number on the dashboard — every channel except FB is effectively at floor. **The constraint:** LinkedIn admin per-post engagement remains unverifiable from this machine. **Biggest surprise:** Facebook quietly has 3 published posts that no one has touched in 60+ days. The "blank slate" framing from yesterday's public audit was wrong on FB.

---

## Per-channel

### 1. Instagram — @glv.marketing
- **Followers:** 3
- **Following:** 0
- **Posts:** 0
- **Bio (category line):** "Marketing Agency" (default category — no written bio text)
- **Link in bio:** 2 destinations
  - "Our Website 💻" → `glvmarketing.ca` (with UTM: `utm_source=ig&utm_medium=social&utm_content=link_in_bio`)
  - "GLV Marketing Facebook Page" → `facebook.com/1032144439974830`
- **Cross-link:** Threads `glv.marketing` linked in profile
- **Profile completeness:** profile pic ✅, link-in-bio (2 destinations) ✅, no highlight stories, no posts, no contact button visible
- **Insights:** Professional Dashboard available but Insights panel returned only the empty Ad Manager view (no post-level insights possible with 0 posts)
- **State:** Brand new. Bio is literally empty (the "Marketing Agency" string is the IG-business-account category, not a written bio).

### 2. Facebook — GLV Marketing (page, ID 61587408814601)
- **Page URL:** `facebook.com/profile.php?id=61587408814601`
- **Followers:** 9 ← **NEW data, was login-gated yesterday**
- **Following:** 1
- **Reviews:** 0 (Not yet rated)
- **Address:** Sault Sainte Marie, ON, Canada, P6A 6R4 (full address visible to admin)
- **Service areas:** 7 cities — Ontario CA · Wawa, ON · Thunder Bay, ON · Greater Sudbury, ON · Elliot Lake, ON · Sault Sainte Marie, ON · Blind River, ON
- **WhatsApp:** ✅ linked
- **Hours:** Closing Soon (currently open at audit time)
- **Bio:** Full — "GLV Marketing helps small and mid-sized businesses across Northern Ontario get found online and turn that visibility into real customers. We specialize in local SEO, Google and Meta advertising, website development, AI workflow automation, and GEO."
- **Visible past posts (3 substantive, all 60+ days old per Meta Business Suite "No posts or reels created in the last 60 days"):**
  1. "Want to see how your business shows up when someone asks AI for a recommendation?…" (with GLV-branded graphic) — **GEO visibility offer**
  2. "Most local businesses have a website. Very few have a website that is actually working for them.…" — **website audit framing**
  3. "Google recently confirmed that reviews are one of the top ranking factors for local search results.…" — **GBP/reviews education**
- **Page events also visible:** cover photo update, profile picture update
- **Meta Business Suite Insights (Apr 19–May 16, 28-day window):**
  - Views: **0** (100% drop, nothing to chart)
  - Unfollows: 0
  - Net follows: 0
  - Last week (May 10–16): **1 Facebook reach total**, 0 Instagram reach, 0 messages, 0 new contacts
- **Per-post engagement counts:** not visible on individual posts (no Like/Comment counts surfaced in admin view either — page is too dormant to surface engagement signals)
- **Profile completeness:** HIGH — bio, address, hours, service areas, WhatsApp, page-friends list, photos all populated
- **State:** Dormant with 3 posts of real history. Meta Business Suite explicitly flagged "0 posts in 60 days." Public audit yesterday missed all 3 posts because slug URLs were login-walled.

### 3. LinkedIn — GLV Marketing company page
- **Page URL:** `linkedin.com/company/glv-marketing/`
- **Followers:** 5 (unchanged from May 16)
- **Employees:** 1
- **Industry:** Marketing Services
- **Headquarters:** Sault Ste Marie, Ontario
- **Tagline:** "AI-powered digital marketing for Northern Ontario businesses. SEO, GEO, paid ads, and websites that drive real results."
- **About:** Full 280-word About section confirmed (same content as May 16 audit)
- **Posts (from yesterday's public read):** 5 posts visible, all ~2 months old (~March 2026), 1 public Like on the "GEO Visibility Check" post, others 0 visible engagement
- **AUTHENTICATED ACCESS — BLOCKED:** the `glv-socials` session has Google sign-in cookies for `info@glvmarketing.ca`, but **that Google account does not have a personal LinkedIn account associated with it** (LI's "Continue with Google" returned the "Join LinkedIn / Sorry, something went wrong" registration page). Aiden's personal LI is the company-page admin — that login is NOT in this browser session.
- **Per-post analytics (impressions, reactions, comments per post):** STILL GATED — cannot verify from this machine without Aiden's personal LI cookies
- **Profile completeness:** HIGH — same as yesterday (logo, banner, About, specialties, contact, website all set)
- **State:** Dormant with the most posting history of any channel (5 posts). Still the warmest channel by content depth.

### 4. YouTube — GLV Marketing (channel ID UC1VOIaUg0WXPpNDJBuzLOCQ)
- **Channel name:** GLV Marketing
- **Handle:** @GLVMarketing
- **URL:** `youtube.com/channel/UC1VOIaUg0WXPpNDJBuzLOCQ` (also accessible via `youtube.com/@GLVMarketing`)
- **Subscribers:** **0** (confirmed in Studio, not just hidden)
- **Total views (last 28 days):** 0
- **Total watch hours (last 28 days):** 0.0
- **Total videos:** 0 ("This channel doesn't have any content")
- **Last upload:** never
- **Channel description:** **EMPTY** (textarea visible in Customization > Profile, value blank)
- **Channel banner:** not uploaded
- **Channel email (Contact info):** **EMPTY**
- **Profile picture:** ✅ present
- **Monetization eligibility:** 0/1,000 subscribers, 0/4,000 watch hours, 0/10M shorts views. Not eligible.
- **Community tab:** not active (no posts; community features unlock at 500 subs)
- **State:** Born May 16, 2026 (per yesterday's audit). Empty everywhere — description, banner, email, content. The barest channel on the fleet.

### 5. Google Business Profile — GLV Marketing
- **Profile strength:** Complete Info ✅
- **Rating:** **5.0 from 3 Google reviews** ← **NEW: review count confirmed (was login-gated yesterday)**
- **Category:** Marketing agency
- **Phone:** (705) 975-0579
- **Website:** glvmarketing.ca
- **Hours:** Open · Closes 6 p.m. (verified open at audit time)
- **Service area (not address-based — confirmed service-area business):** Wawa, ON P0S + Thessalon, ON + "4 other areas" (7 total service areas)
- **Profile description (from owner):** "GLV Marketing is a digital marketing agency in Sault Ste. Marie, Ontario, helping small and mid-sized businesses across Northern Ontario get found online and grow through modern, data-driven marketing strategies. Our services include local SEO,..." (truncated in display; full text in profile)
- **Linked profiles:** Facebook + Instagram both linked from GBP
- **Photos:** 7 total uploaded — cover + logo + 5 content photos. Last photos added **80 days ago** (Google flagged: "Get noticed by more customers — You last added photos 80 days ago.")
- **GBP Posts:** **0** ("No posts yet. Start your first post today.")
- **Q&A activity:** none visible (no Questions section in profile panel)
- **Products / Services:** Edit buttons visible — populated state not inspected (would require modal click)
- **Bookings:** "Set up booking" prompt visible — not configured
- **Performance Insights (Dec 2025 – May 2026, 6-month window):**
  - **Total interactions: 7** (all 7 = website clicks, 0 calls, 0 chat, 0 bookings, 0 directions)
  - Monthly breakdown:
    - Dec 2025: 0
    - Jan 2026: 0
    - Feb 2026: 1
    - **Mar 2026: 5** ← peak month
    - Apr 2026: 1
    - May 2026: 0 (so far)
  - **Profile views: 231 people** over 6 months
    - 76 (33%) — Google Search on desktop
    - 69 (30%) — Google Search on mobile
    - 46 (20%) — Google Maps on desktop
    - 40 (17%) — Google Maps on mobile
  - **Searches that showed profile: <50** (under 50 reporting threshold)
    - Breakdown: "glv marketing" — <15 searches (branded), no other surfaced search terms above threshold
- **April performance report:** ready (CTA visible but not opened)
- **Pending CTAs Google is showing the owner:** Claim $600 Ads credit · Add address autocomplete · Get noticed by more customers (add photos) · Get your first reviews · Set up booking · Add update · Create an offer
- **Manages 4 businesses in this account:** Fusion Financial (verified), GLV Marketing (verified), Reyco Marine (verified), 1 unverified — 75% verified
- **State:** Quietly working. 5/5 stars from 3 reviews, 231 profile views, but **6 months of mostly-zero interactions and 0 GBP Posts** mean the profile is generating awareness without conversion paths. **March 2026 had 5 interactions — single highest month** — worth understanding what happened then.

### 6. X — @glvmarketing (no dot)
- **Display name:** GLV Marketing
- **Handle:** @glvmarketing
- **Posts:** 0
- **Following:** 18
- **Followers:** 0
- **Joined:** May 2026
- **Bio:** EMPTY (no description visible on profile)
- **Verification:** not verified ("You aren't verified yet")
- **X Analytics:** **GATED behind X Premium** — `x.com/i/account_analytics` returns "Advanced analytics with X Premium — Upgrade to continue"
- **Onboarding tasks shown:** Follow 3 Topics (3 left), Follow 5 accounts (DONE), Complete your profile (DONE), Turn on notifications
- **Profile completeness:** profile pic ✅, name set, bio empty, no website link in bio
- **State:** Brand new. Has 18 follows (signal-consumption mode) but 0 posts. Bio is empty.

### 7. Threads — @glv.marketing
- **Display name:** GLV
- **Handle:** glv.marketing
- **Followers:** 0
- **Following:** not displayed (no follow count visible — Threads collapses this for low-count profiles)
- **Posts (Threads):** 0 — tab is empty
- **Replies / Media / Reposts:** 0 / 0 / 0
- **Bio:** EMPTY (Threads onboarding shows "Add bio — 4 left" task — confirms empty)
- **Linked accounts:** Instagram ✅ (cross-link visible on profile)
- **Threads Insights:** **GATED at 100 followers** — `threads.com/insights` shows: "Insights await. Check back in once you've reached 100 followers to see your insights."
- **Profile completeness:** profile picture ✅ (despite Threads' onboarding task saying "Add profile photo" — that task likely refers to a high-res version)
- **Onboarding tasks (4 left):** Add bio · Create thread · Follow 10 profiles · Add profile photo
- **State:** Brand new. Mirrors IG handle exactly. Easiest first-touch — cross-post IG carousel text natively via Threads.

---

## Distribution decision matrix (for intro carousels)

The question: which channels have intro / founder-story / who-we-are content already published, and which need intro posts?

| Channel | Already has intros? | Existing content | Verdict |
|---------|---------------------|------------------|---------|
| **Instagram** | ❌ No | 0 posts | **POST intro-1 / 2 / 3** — full intro carousel series, primary visual surface |
| **Facebook** | ⚠️ Partial — but not intro-shaped | 3 posts: GEO offer, website-audit framing, reviews-ranking education (all 60+ days old). NO founder story, NO who-we-are. | **POST intro-1 / 2 / 3** — existing posts are tactical/educational, not introductory. Intro carousels fill a real gap. Mirror IG. |
| **LinkedIn** | ⚠️ Partial — case-study driven, no founder story | 5 posts (all ~2 months old): Titan case study (×2), small-biz audit framing, GEO Visibility Check offer, GEO explainer. NO founder story, NO who-we-are. | **POST intro-1 / 2 / 3 (PDF format)** — existing posts establish brand voice but never introduce the agency itself. LinkedIn carousel-as-PDF is the format. |
| **YouTube** | ❌ No | 0 videos, no description, no banner | **DEFER intro carousels** — wrong format for YT. Channel needs: description + banner + first Short (different content event from carousels). |
| **GBP** | ❌ No | 0 GBP Posts | **POST intro-1 ONLY as GBP Post** (single-image format, 1500 char limit) — GBP doesn't render carousels. Use the same first-impression copy from intro-1. |
| **X** | ❌ No | 0 posts, empty bio | **POST intro-1 / 2 / 3 as thread series** — convert carousel slides to thread tweets. Add bio first. |
| **Threads** | ❌ No | 0 threads, empty bio | **POST intro-1 / 2 / 3** — mirror IG carousel text natively. Add bio first. |

**Recommended content event ("Intro Launch"):**
- IG, Threads, FB, LinkedIn all get the **3-carousel intro series** (same content, platform-native format adjustments — IG/Threads as image carousel, LI as PDF, FB as image post)
- X gets the **3-tweet intro thread** (one thread per carousel)
- GBP gets **one GBP Post** using the intro-1 copy (anchor first-impression)
- YouTube DEFERS — first YT content event is a Short, not the intro carousels. Description + banner + email need to land first.

**Pre-flight bio + link tasks that must land BEFORE intro carousels post:**
- IG: write real bio (currently just the "Marketing Agency" category label)
- X: write bio + add website link
- Threads: write bio (cross-platform mirror)
- YouTube: write channel description + upload banner + set contact email

---

## What changed vs the May 16 public-view audit

| Channel | Yesterday | Today (authenticated) | Delta |
|---------|-----------|-----------------------|-------|
| FB followers | unknown (login-gated) | **9** | NEW data |
| FB posts | unknown (login-gated) | **3 substantive posts visible** | NEW — public audit said zero |
| FB last post | unknown | "no posts in last 60 days" per Meta BSuite | Confirmed dormant since ~Mar 2026 |
| GBP reviews | "5.0 rating, count unknown" | **5.0 from 3 reviews** | Count confirmed |
| GBP photos | "Add a photo prompt visible — sparse" | **7 photos uploaded (cover + logo + 5)**, last added 80 days ago | More than the prompt suggested |
| GBP posts | unknown | **0 GBP Posts** | Confirmed zero |
| GBP performance | unknown | **231 profile views, 7 website clicks, 0 calls/directions/bookings/chats** | Full 6-month picture |
| GBP service area | "not exposed in public-limited view" | **7 service areas confirmed** (Wawa, Thessalon, +4 others — service-area business not address-based) | Confirms why no street address was visible publicly |
| IG link-in-bio | "not visible without scrolling" | **2 destinations: glvmarketing.ca + FB page** | Confirmed |
| YouTube description | "likely empty" | **CONFIRMED EMPTY** | + also: email empty, banner not uploaded |
| LinkedIn engagement per post | "not visible" | **STILL not visible** (LI admin auth blocked — Google account is wrong account) | No change |
| X analytics | "always require login" | **Gated behind X Premium upgrade** | Specific blocker identified |
| Threads insights | "Threads has limited analytics" | **Gated at 100 followers** | Specific threshold identified |

---

## What I still couldn't pull (gated even with authentication)

1. **LinkedIn per-post analytics** (impressions, reactions, comments per post) — Aiden's personal LinkedIn cookies are not in the `glv-socials` browser session. The `info@glvmarketing.ca` Google account does not have an LI account. To unblock: either sign Aiden's personal LI into this browser session, or use the LinkedIn-via-Aiden personal flow on the host machine.
2. **X Analytics dashboard** — gated behind X Premium upgrade. Not worth $$ for 0-post account. Re-evaluate after first 30 posts.
3. **Threads Insights** — gated at 100 followers. Auto-unlocks at threshold.
4. **YouTube Studio Analytics deep view** — Studio loaded fine, but with 0 content there's nothing to analyze beyond the "0/0/0" summary already captured.
5. **GBP "Searches breakdown" detail beyond top term** — UI shows only "glv marketing < 15" as the only term above reporting threshold; other terms (if any) suppressed.

---

## Other notable findings (surfaced incidentally during the audit)

1. **`@glv_marketing` (UNDERSCORE, not dot) exists on Instagram and is NOT ours** — surfaced in Google SERP during GBP profile view. Posted a "vision boards" image on May 13, 2026 (4 days before audit). This is a **third-party impersonation risk / handle squat** — flag to brand team. Our handle is `@glv.marketing` (dot).
2. **External listings of GLV Marketing in SERP:**
   - Yelp listing — `yelp.ca` (not on roster, not managed)
   - YellowPages.ca listing — `yellowpages.ca` (not on roster, not managed)
   - Both are auto-aggregated, not owner-claimed. Decision needed: claim/correct or ignore.
3. **Aiden's personal LinkedIn shows 50+ followers and 49 connections** as the CEO listing — that's the only LinkedIn engagement vector with any reach right now. Cross-post company content to personal LI to amplify.
4. **FB SERP card shows "30+ followers, 6 talking about this"** — but the admin view shows 9 followers / 1 following. The "30+ followers" SERP figure may include people-talking + page-followers + ad-impression-based engagement. Trust the admin number (9).
5. **GLV manages 4 GBP listings** (3 verified, 1 unverified) — Fusion Financial, GLV Marketing, Reyco Marine, +1 unverified. Worth confirming which is unverified.
6. **GBP April performance report exists but was not opened** — Google emails monthly. Worth pulling history via the report dialog.
7. **WhatsApp is linked on the FB page** — could route customer chat through it. Not visible as an action button on FB page yet.

---

## Files touched
- This file: `orgs/glv/clients/glv-marketing/baseline-audit-2026-05-17-AUTHENTICATED.md` (NEW)
- Superseded: `orgs/glv/clients/glv-marketing/baseline-audit-2026-05-16.md` (PUBLIC-VIEW, now historical)
- Source roster: `orgs/glv/clients/glv-marketing/social-accounts.md` (read, unchanged)

---

## LinkedIn deep-dive (added 2026-05-17 18:11 UTC)

Source: authenticated admin session at https://www.linkedin.com/company/111879122/admin/analytics/  
Captured via agent-browser (glv-socials session). Read-only.

### Visitor analytics

#### Visitor highlights — last 30 days (Apr 16 – May 15, 2026)
- **Page views:** 12 (+1,100% vs prior period)
- **Unique visitors:** 7 (+600%)
- **Custom button clicks:** 0
- Featured visitor highlight: "Someone at University of Dhaka"

#### Visitor highlights — last 365 days (May 16, 2025 – May 15, 2026)
- **Page views:** 20 (Desktop 19, Mobile 1)
- **Unique visitors:** 13
- **Custom button clicks:** 0

#### Page-views breakdown by page type
LinkedIn admin does not surface per-page-section numeric splits on the Visitor view — it only exposes them as filters (All pages / Home / About / Insights / People). With only 20 total page views in 365 days, slicing further is not meaningful right now.

#### Visitor demographics (365-day window, n=20)

**Job function**
| Function | Visitors | % |
|---|---|---|
| Business Development | 16 | 80% |
| Healthcare Services | 1 | 5% |
| Research | 1 | 5% |
| Marketing | 1 | 5% |
| Community and Social Services | 1 | 5% |
| Military and Protective Services | 1 | 5% |
| Purchasing | 1 | 5% |

**Seniority**
| Seniority | Visitors | % |
|---|---|---|
| Owner | 9 | 45% |
| CXO | 6 | 30% |
| Director | 3 | 15% |
| Entry | 1 | 5% |
| Others | 1 | 5% |

**Industry**
| Industry | Visitors | % |
|---|---|---|
| Marketing Services | 7 | 35% |
| IT Services and IT Consulting | 7 | 35% |
| Others | 6 | 30% |

**Location**
| Location | Visitors | % |
|---|---|---|
| Sault Ste. Marie, Canada | 7 | 35% |
| Others | 13 | 65% |

**Company size**
| Size | Visitors | % |
|---|---|---|
| 1001-5000 employees | 3 | 15% |
| 51-200 employees | 2 | 10% |
| 10,001+ employees | 1 | 5% |
| 11-50 employees | 1 | 5% |
| 5001-10,000 employees | 1 | 5% |
| 201-500 employees | 1 | 5% |
| Others | 11 | 55% |

### Update / post analytics

#### Highlights — last 30 days (Apr 16 – May 15, 2026)
- **Impressions:** 1 (+98%, organic only — 0 sponsored)
- **Reactions:** 0
- **Comments:** 0
- **Reposts:** 0

#### Per-post historical (last 12 months — May 17, 2025 to May 17, 2026)
All 6 posts in the table below. All posted by Aiden Glave, audience = All followers, sponsored = 0 on every post.

| # | Date | Type | First 50 chars | Impressions | Clicks | CTR | Reactions | Comments | Reposts | Engagement rate |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3/13/2026 | Article | Digital Marketing & AI Automation in Sault Ste. Marie | 2 | 0 | 0% | 0 | 0 | 0 | 0% |
| 2 | 3/11/2026 | Article | Digital Marketing & AI Automation in Sault Ste. Marie | 88 | 1 | 1.14% | 0 | 0 | 0 | 1.14% |
| 3 | 3/5/2026 | Text | We recently built a website for a family-run tiny home builder (Titan Tiny Homes case study) | 17 | 0 | 0% | 0 | 0 | 0 | 0% |
| 4 | 2/28/2026 | Text | Here is a question most business owners have never thought to ask (GEO Visibility free check offer) | 44 | 0 | 0% | 1 | 0 | 0 | 2.27% |
| 5 | 2/26/2026 | Text | Your customers are changing how they search (GEO explainer) | 42 | 1 | 2.38% | 1 | 0 | 0 | 4.76% |
| 6 | 2/25/2026 | Article | Digital Marketing & AI Automation in Sault Ste. Marie | 58 | 1 | 1.72% | 1 | 0 | 2 | 6.9% |

Notes on update data:
- "Views" and "Follows" columns return `-` (not surfaced for organic posts on a sub-1k-follower page).
- Reactions breakdown by type (Like / Celebrate / Support / etc.) is not visible at this scope; total only.
- Unique impressions not exposed at the per-post grid level — only total impressions.
- Top performer by engagement rate: post #6 (2/25/2026 article, 6.9% engagement, includes 2 reposts).
- Top performer by raw impressions: post #2 (3/11/2026 article, 88 impressions).
- LinkedIn flags every post as "Boost up to 230,000 more impressions" — paid push not currently in use.

### Follower analytics

#### Highlights (as of May 15, 2026)
- **Total followers:** 5
- **New followers (last 30 days):** 1 (organic — 0 sponsored)
- **% change:** 0% (LinkedIn surfaces as 0% because base is so small)

#### Full follower list (5 of 5)
| Name | Title / firm | Followed |
|---|---|---|
| Omar Francisco Arellano Ganem | ML Engineer | LLM / RAG / Computer Vision | Apr 2026 |
| Greg Caruso | IG Wealth Management — insurance/estate | Mar 2026 |
| Adriana Sagrak | Communications, Healthcare, Fundraising | Feb 2026 |
| Tony Barone | President and CEO | Feb 2026 |
| Aiden Glave | CEO at GLV Marketing (excluded from demo report — self) | Feb 2026 |

#### Follower demographics (n=5, includes self)

**Location**
| Location | Followers | % |
|---|---|---|
| Sault Ste. Marie, Canada | 4 | 80% |
| Mexico City Metropolitan Area | 1 | 20% |

**Job function**
| Function | Followers | % |
|---|---|---|
| Marketing | 2 | 40% |
| Business Development | 1 | 20% |
| Finance | 1 | 20% |
| Others | 1 | 20% |

**Company size**
| Size | Followers | % |
|---|---|---|
| 1-10 employees | 2 | 40% |
| 5001-10,000 employees | 1 | 20% |
| Others | 2 | 40% |

**Industry**
| Industry | Followers | % |
|---|---|---|
| IT System Custom Software Development | 1 | 20% |
| Hospitals | 1 | 20% |
| Accounting | 1 | 20% |
| Marketing Services | 1 | 20% |
| Capital Markets | 1 | 20% |

**Seniority**
| Seniority | Followers | % |
|---|---|---|
| Entry | 2 | 40% |
| Senior | 1 | 20% |
| CXO | 1 | 20% |
| Others | 1 | 20% |

### Competitor analytics
**Not available.** Navigating to `/admin/analytics/competitor-comparison/` 302-redirects to `/admin/dashboard/`. LinkedIn requires either a Premium Company Page subscription or a minimum follower threshold to unlock competitor benchmarking. Not unlocked for GLV at 5 followers.

### Search appearances

Reporting window: May 9 – May 15, 2026 (LinkedIn's fixed 7-day search-appearance window).

- **Page searches:** 1
- **Reach trend:** N/A (insufficient volume to render)
- **Top search keywords:** "No keyword matches yet — top keywords will appear once more search terms have been used to find your Page."
- **Top searcher demographics:** "Demographics unavailable — will appear once your Page receives enough views."

### Surprising findings / missing-data callouts

1. **Visitor pool is wildly tilted toward Business Development / Owner / CXO** — 80% BD function and 75% Owner+CXO seniority across 20 visitors in 365 days. That is the buyer persona we want, but it is happening with zero outbound LinkedIn investment. Worth investigating which posts/profile activity is sourcing them.
2. **The featured visitor "Someone at University of Dhaka" is a category-3 noise visitor**, not a buyer signal. Likely outreach scraping or freelance hunting.
3. **Marketing Services + IT Services together = 70% of visitor industry mix** — visitors are predominantly competitors / peers, not end-customer industries (Healthcare/Marine/Finance/Trades that GLV actually serves). This is a brand-awareness-among-peers signal, not a pipeline signal.
4. **35% of visitors are local (Sault Ste. Marie)** — strong for a hyper-local positioning, weak for a national pipeline.
5. **Posts 2 & 6 (article-format Digital Marketing & AI Automation pages) drove the bulk of impressions** — 88 and 58 respectively, vs 2–44 for everything else. Articles outperform text posts on this page at this scale.
6. **Zero comments across all 6 posts in 12 months.** Engagement is impression+click+react only — no community discussion. This is the #1 trailing indicator that the page is broadcasting, not conversing.
7. **Total org reach in 12 months is microscopic:** 251 cumulative impressions across all 6 posts. The page is functionally dormant for organic distribution.
8. **No paid spend, ever** — every post shows "Boost up to 230,000 more impressions" and Sponsored = 0 on every metric. There's a 4–5 order-of-magnitude headroom if paid is ever turned on.
9. **Follower base is friends-and-family + 1 random** — Greg Caruso (insurance), Adriana Sagrak, Tony Barone are all 1st-degree Aiden connections. Omar (Mexico City ML engineer) is the only "cold" follower. Not a real audience yet.
10. **Missing: per-post reaction-type breakdown, unique impressions per post, audience-reached organic-vs-paid per post, page-views by section (overview/about/posts/jobs), search-keyword trend.** All gated behind either Premium Page or higher-volume thresholds. Document this so we don't keep chasing these dimensions on every audit cycle.

