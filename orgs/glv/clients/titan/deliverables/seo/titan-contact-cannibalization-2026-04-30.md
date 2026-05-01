# Titan Tiny Homes — Contact Page Cannibalization Fix
**Prepared:** 2026-04-30 by seo agent  
**Source:** Life-os Titan SEO audit #9 (2026-04-05) + issue tracker FIX-0004 + FIX-0006  
**Client status:** Deprioritised — Joseph hasn't paid. This is a queued fix for when retainer is confirmed.  
**Note:** titantinyhomes.ca returns 403 on automated fetch (SiteGround WAF), so analysis is based on GSC data from life-os audits.

---

## The Problem

`/contact` is ranking at **position 8 for "titan tiny homes"** — a branded query that should land on the homepage. This is keyword cannibalization: two pages competing for the same query, splitting click-through and confusing Google about which is the canonical brand result.

### GSC Evidence (Apr 5 audit — most recent available)

| Page | Query | Impressions | Position | Clicks |
|------|-------|-------------|----------|--------|
| / (homepage) | titan tiny homes | 16 | 8.4 | 7 |
| /contact | titan tiny homes | 4 | 8.0 | 0 |

The contact page ranks at position 8.0 — *slightly above the homepage* (8.4) for the primary branded query. Every impression on /contact is a missed click on the homepage.

### Trend

| Audit | /contact impressions for "titan tiny homes" | Status |
|-------|---------------------------------------------|--------|
| ~Mar 22 | 17 | Peak |
| Apr 5 | 4 | -76% |

**The cannibalization is reducing organically.** Google is beginning to prefer the homepage. But /contact still ranks at position 8 — the fix would close this permanently rather than waiting for Google to self-correct.

---

## Root Cause

Two contributing factors:

**1. No explicit canonical tags (FIX-0004)**  
No pages have `<link rel="canonical">` tags. Without self-referencing canonicals, Google infers canonical status from content similarity and PageRank. The contact page title likely contains the brand name, creating a duplicate brand signal.

**2. Contact page title includes brand name (FIX-0006)**  
The contact page title is likely `"Titan Tiny Homes | Contact Us"` or similar — leading with the brand name. This makes the page appear relevant for branded queries. Google sees two pages with "Titan Tiny Homes" in their title tags competing for the same query.

**Note:** The contact page is also linked from every page's header navigation — giving it strong internal link equity. This is appropriate for a conversion page but amplifies the brand query competition if the title isn't scoped correctly.

---

## Fix Recommendation

**The goal:** Let the homepage own branded queries ("titan tiny homes", "titan homes"). Let /contact own transactional queries ("contact titan tiny homes", "titan tiny homes phone number", "get a quote titan"). Don't sacrifice /contact's conversion function.

### Fix 1 — De-brand the Contact Page Title (Highest Impact, Lowest Risk)

**Current title (inferred):** `Titan Tiny Homes | Contact Us` or `Contact | Titan Tiny Homes`  
**Recommended title:** `Get a Free Quote — Titan Tiny Homes` or `Contact Us | Tiny Home Builder, Ontario`

**Why this works:** Moving the brand name to a secondary position or replacing it with transactional intent language ("Get a Free Quote") tells Google this page is for conversion actions, not brand discovery. The homepage becomes the unambiguous brand signal.

**Implementation (React SPA):** In the `/contact` page component, update the `<title>` tag (via React Helmet or equivalent):
```jsx
<Helmet>
  <title>Get a Free Quote — Titan Tiny Homes</title>
  <meta name="description" content="Contact Titan Tiny Homes for a free quote on your tiny home build. Joey and Kathryn are based in Ontario — reach out to discuss your build timeline and budget." />
</Helmet>
```

**Risk:** Zero. The contact page still ranks for transactional queries. The homepage gets branded queries back.

---

### Fix 2 — Add Self-Referencing Canonical Tags (Cleans Up FIX-0004)

Add `<link rel="canonical" href="https://titantinyhomes.ca/contact">` to the /contact page. Do this for ALL pages (homepage, /about, /models, /services, /process, /contact, /quote).

**Why this matters:** Currently, Google is guessing which URL is canonical because no explicit signal exists. The `/models/` vs `/models` trailing-slash ambiguity (seen in Apr 5 data — both appeared in search with the same query) is a direct symptom of missing canonicals.

**Implementation:**
```jsx
// In /contact page component
<Helmet>
  <link rel="canonical" href="https://titantinyhomes.ca/contact" />
</Helmet>

// In homepage component  
<Helmet>
  <link rel="canonical" href="https://titantinyhomes.ca/" />
</Helmet>
```

Apply to all pages. One PR, ~10 min dev work.

**Do NOT** point /contact canonical to the homepage (`https://titantinyhomes.ca/`). That would tell Google the contact page and homepage are the same content — Google would de-index /contact entirely, killing the conversion path for people searching "titan tiny homes contact".

---

### Fix 3 — (Optional, More Aggressive) Add Noindex to /contact

Only if Fix 1 doesn't resolve within 4–6 weeks of GSC data.

Adding `<meta name="robots" content="noindex">` removes /contact from the index entirely. It would still be accessible directly but wouldn't appear in SERPs for any query.

**Risk:** Users who specifically search "titan tiny homes contact" would not find the contact page via Google. For a tiny home builder where most conversions are through the homepage or referrals, this risk is low — but Fix 1 should be tried first.

---

## Priority Order

| Fix | Effort | Risk | Impact | Priority |
|-----|--------|------|--------|----------|
| Fix 1: De-brand contact title | 5 min | Zero | High — directly competes for branded query | **Do first** |
| Fix 2: Self-referencing canonicals (all pages) | 20 min | Zero | High — resolves FIX-0004, eliminates trailing slash duplication | **Bundle with Fix 1** |
| Fix 3: Noindex /contact | 2 min | Low | Nuclear option — removes all query risk | **Only if Fixes 1+2 insufficient** |

**Recommended dev action:** Single PR implementing Fix 1 + Fix 2 together. Bundle the canonical tag PR for all pages with the contact page title change — same file area, same deploy.

---

## What to Verify Post-Fix

After deploying Fix 1 + Fix 2, check GSC in 2–3 weeks:
1. `/contact` should drop out of "titan tiny homes" branded impressions
2. Homepage branded impressions should increase (Google consolidates the signal)
3. `/contact` should still rank for transactional queries ("contact titan tiny homes" etc.)
4. Trailing slash duplicate `/models/` vs `/models` should resolve

---

## Related Issues from Life-Os Issue Tracker

This fix bundles resolution for:
- **FIX-0004** (Canonical — no explicit canonical tags)
- **FIX-0006** (Content — /contact title needs CTR optimisation)
- **FIX-0008** (Canonical — duplicate www/non-www sitemap → remove www variant)

---

*No external actions taken. Internal deliverable — queued for when Titan retainer is confirmed.*  
*Analysis based on GSC data from life-os audits (most recent: 2026-04-05). Live page fetch blocked (403).*  
*Prepared 2026-04-30.*
