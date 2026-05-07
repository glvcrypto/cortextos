# Reyco Marine — SSM Local SEO Strategy
**Prepared:** 2026-05-07 by seo agent
**Geo target (Phase 1):** Sault Ste. Marie, ON
**Phase 2 expansion:** Northern Ontario (post-90 days, based on GSC data)

---

## Market Context

Sault Ste. Marie has ~75,000 population — small enough that every Google query for "boat dealer sault ste marie" or "small engine repair sault ste marie" represents a potential Reyco customer. There is no noise. Every impression is a warm lead.

**The SSM local SEO opportunity in one sentence:** KD=0 on all local terms means Reyco can rank #1 for every relevant local query within 90 days just by publishing pages that exist.

This is unusually favorable. In most markets, local SEO is about out-competing established players. In SSM for marine/service, there are no established players with optimized content. Reyco is starting from zero — but so is everyone else.

---

## Three-Pack (Local Pack) Strategy

The Google local 3-pack appears above organic results for most "near me" and service intent queries. Ranking in the 3-pack requires:

1. **Proximity** — Google maps user location to business distance (cannot control)
2. **Relevance** — GBP category match + website content alignment
3. **Prominence** — Review count, review recency, citation consistency, online mentions

Reyco controls #2 and #3 entirely.

### 3-Pack Priority Queries

| Query | Why It Matters | What's Needed |
|-------|---------------|---------------|
| small engine repair sault ste marie | 40 verified searches/mo — already live | GBP secondary category "Small Engine Repair Service" |
| boat dealer sault ste marie | Primary business type | GBP primary category "Boat Dealer" |
| marine dealer sault ste marie | Competitor anchor term | GBP + /boats-and-marine/ page content |
| lawn mower repair sault ste marie | 20 verified searches/mo | GBP secondary category "Lawn Mower Repair Service" |
| snowblower repair sault ste marie | 30 verified searches/mo | GBP + page content (build Month 2) |
| outboard motor dealer sault ste marie | Mercury dealer intent | GBP secondary + /outboard-motors/ page |
| ATV dealer sault ste marie | EZGO/Hisun overlap | GBP secondary + ATV page |

**3-pack win condition per query:** Correct GBP category + page on website targeting local term + 5+ reviews while competitors have 0–5.

---

## NAP Audit — Consistency Plan

NAP (Name, Address, Phone) must be identical across:
- reycomarine.com footer
- GBP
- All directories in the 14-day drip

**Canonical NAP format:**
```
Name: Reyco Marine & Small Engine
Address: [verify from GBP — use GBP as master]
Phone: [verify from GBP]
Website: https://reycomarine.com
```

**Known risk:** The website was recently migrated from reyco.glvmarketing.ca. Any historical mentions, backlinks, or citations pointing to the old domain need to be identified and updated.

**NAP audit steps:**
1. Check reycomarine.com footer — does it show the canonical NAP?
2. Search Google for `"reyco marine"` — review all results for inconsistent mentions
3. Search Google for `"reyco.glvmarketing.ca"` — identify any cached pages or backlinks to update
4. Check existing Yelp, YP.ca, Facebook pages if they exist — update with new domain

---

## Review Velocity Plan

**Target:** 10 reviews within 30 days, 30 reviews within 90 days.

### In-Store Review Trigger

**QR Code Card (print and place at counter + parts desk):**
```
How did we do?
Leave us a review on Google — it takes 30 seconds
and helps other locals find us.

[QR code → GBP review link]
```

Ask Aiden or Aaron to print 10–20 cards. Place at: service counter, parts desk, cashier area, on receipt staple.

### Post-Service Text/Email

If Reyco collects customer phone numbers or emails at service intake:
- Send text/email within 24 hours of service completion:
  > "Thanks for choosing Reyco Marine! If you're happy with your service, a quick Google review means a lot: [GBP review link]"

**Note:** Do NOT offer incentives for reviews — GBP policy violation. Just ask.

### Verbal Ask

Aaron / Casey / Lynn: at the moment payment is taken, a simple "If you were happy with the service today, we'd really appreciate a Google review — it really helps us" converts at 10–20%.

### Review Response Template

Every review should get a response from Aiden/Aaron within 24 hours:

**Positive:**
> "Thanks, [Name]! We're glad the [service type] worked out. Hope to see you next season — Casey and the team appreciate it!"

**Negative:**
> "We're sorry to hear about your experience, [Name]. Please give us a call at [phone] so we can make it right. We stand behind our work."

Never argue or get defensive on a negative review — it makes things worse in SERPs.

---

## Content Localization Framework

Every service page and blog post should pass the "SSM Local Test":

1. Does it mention Sault Ste. Marie by name (not just "we're local")?
2. Does it reference something specific to Northern Ontario? (Lake Superior, SSM winters, Algoma region, etc.)
3. Does it make a locally-exclusive claim where one exists? (Northern Ontario's only Princecraft dealer, etc.)

**Examples of localization done right:**
- "Snowblower repair for Sault Ste. Marie winters — we know what SSM machines go through"
- "Serving boaters on Lake Superior, the St. Marys River, and throughout Algoma District"
- "SSM's authorized Toro and Cub Cadet service center"

**Examples of localization done wrong:**
- "We're a local business serving the area" (generic — could be anywhere)
- Just mentioning SSM in the meta description but not in the body copy

---

## Local Link Building (Phase 1)

Links from locally-relevant sites signal geographic authority to Google.

**Priority local link targets (Month 1–2):**

| Source | Type | How to Get It |
|--------|------|--------------|
| Sault Ste. Marie Chamber of Commerce | Citation + link | Membership listing |
| Algoma Economic Development | Citation + link | Business directory |
| Sault Star (local paper) | Mentions/coverage | PR pitch: "Northern Ontario's exclusive Princecraft dealer opens new season" |
| DiscoverSaultSteMarie.ca | Tourism directory | Contact Destination Northern Ontario |
| OFAH (Ontario Federation of Anglers & Hunters) | Industry link | Dealer listing |
| Princecraft.com | Manufacturer link | Already an authorized dealer — verify listing exists |
| Mercury Marine Canada | Manufacturer link | Authorized dealer listing |

**Low-hanging fruit:** Manufacturer dealer locators (Princecraft, Mercury, Toro, Cub Cadet, Echo) are inbound links from high-authority domains. Verifying Reyco is listed on each is a link-building action.

---

## Schema for Local Signal

LocalBusiness schema (pending dev PR merge) should include:

```json
{
  "@type": "LocalBusiness",
  "name": "Reyco Marine & Small Engine",
  "areaServed": [
    {
      "@type": "City",
      "name": "Sault Ste. Marie",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Northern Ontario"
    }
  ],
  "hasMap": "https://maps.google.com/?cid=[GBP CID]"
}
```

**areaServed is the key local signal:** It explicitly tells Google which geographic area Reyco serves, reinforcing the local 3-pack eligibility for SSM queries.

---

## Phase 2 Expansion — Northern Ontario (Post-90 Days)

After reycomarine.com has 90 days of GSC data:

1. Pull impressions data for Northern Ontario queries (Sudbury, Timmins, North Bay angles)
2. Assess whether to build "Northern Ontario" landing pages or expand areaServed schema
3. Princecraft exclusivity claim extends to Northern Ontario — "Northern Ontario's only Princecraft dealer" is a content anchor for expansion
4. Focus on dealer intent terms for Northern Ontario cities where there's no local Princecraft presence

**Decision gate:** Do not expand geo targeting until SSM terms are ranking and GSC shows impressions. Data over assumptions.

---

## 90-Day Local SEO Scorecard

| Metric | Current | 30-Day Target | 90-Day Target |
|--------|---------|--------------|--------------|
| GBP reviews | (verify) | 10+ | 30+ |
| GBP average rating | (verify) | 4.5+ | 4.7+ |
| Local 3-pack appearances | 0 | 3+ queries | 8+ queries |
| Pages indexed | (verify GSC) | 50+ | 100+ |
| SSM local keyword rankings | 0 (no GSC data) | 5+ page-1 | 15+ page-1 |
| Citation consistency score | 0 directories done | 14 Tier 1 done | Tier 1+2+3 done |
| Organic sessions (SSM) | 0 | 50+/mo | 200+/mo |

**Monthly review:** Pull these metrics from GSC + GBP Insights at start of each month. Report to Aiden with delta vs. prior month.

---

## SSM Local Search Intelligence — Ongoing

Once GSC is live, set up monthly keyword review:

1. GSC → Performance → Search results → Filter by "Queries containing Sault Ste. Marie"
2. Sort by Impressions (descending)
3. Flag: Any query with impressions but position >10 = content gap to fix
4. Flag: Any query with high CTR but low impressions = title/meta optimization opportunity

This intelligence loop is what converts SEO work from guesswork to evidence-based iteration.

---

*SSM local strategy covers 3-pack positioning, NAP consistency, review velocity, and content localization. Phase 2 Northern Ontario expansion gated on 90-day GSC data.*
