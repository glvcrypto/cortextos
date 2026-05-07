# Reyco Marine — GA4 + GSC Wiring Plan
**Prepared:** 2026-05-07 by seo agent
**Owner:** Aiden (both actions require Google account access)
**Priority:** Critical path — no traffic data flows until both are live

---

## Overview

Two independent actions required:
1. **GSC verify** — proves reycomarine.com ownership to Google Search Console
2. **GA4 install** — sends visitor data to Google Analytics 4

Both should be completed the same day. GA4 measurement ID needs to go into Rank Math Analytics module before any traffic analysis is possible.

---

## Part 1: Google Search Console — Verify Domain

### Property Type
**sc-domain:reycomarine.com** (domain property — covers www and non-www, all subdomains)

Do NOT use the URL prefix property (https://reycomarine.com) — the domain property is more complete.

### Verification Method: DNS TXT Record

This is the recommended method for Cloudflare-managed domains.

**Step-by-step:**

1. Go to Google Search Console: https://search.google.com/search-console
2. Click "Add property"
3. Select "Domain" (not URL prefix)
4. Enter: `reycomarine.com`
5. Google will display a TXT record to add. It looks like:
   ```
   google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   Copy this exact string.

6. Go to Cloudflare dashboard → DNS → Records
   - Click "Add record"
   - Type: `TXT`
   - Name: `@` (root domain)
   - Content: paste the google-site-verification string
   - TTL: Auto
   - Click Save

7. Back in GSC → Click "Verify"
   - DNS changes propagate in 5–60 minutes (Cloudflare is usually fast — often under 5 minutes)
   - If verification fails, wait 15 minutes and try again

**Expected outcome:** GSC shows "Ownership verified" for sc-domain:reycomarine.com

---

### After Verification — Immediate Actions

Once GSC is verified, complete these in order:

**1. Submit sitemap:**
- GSC → Sitemaps (left menu)
- Add sitemap URL: `https://reycomarine.com/sitemap_index.xml`
- Click Submit
- Verify sitemap shows "Success" within a few minutes

**2. Check Coverage report:**
- GSC → Pages → All submitted pages
- Look for immediate indexation errors (noindex, server errors, canonical issues)
- Expected: some errors initially — these are the crawl issues from R19 audit that are being fixed

**3. Check Core Web Vitals:**
- GSC → Experience → Core Web Vitals
- Will show "Not enough data" for 30 days — normal for new domain
- Flag this date; check back in 30 days

---

## Part 2: Google Analytics 4 — Install via Rank Math

### GA4 Property Setup (if not already created)

If Aiden doesn't already have a GA4 property for reycomarine.com:

1. Go to Google Analytics: https://analytics.google.com
2. Click "Admin" (gear icon)
3. Create Account → Account name: "Reyco Marine" (or use existing GLV account)
4. Create Property:
   - Property name: reycomarine.com
   - Reporting time zone: Eastern Time (Canada)
   - Currency: CAD
5. Data stream → Add stream → Web
   - Website URL: https://reycomarine.com
   - Stream name: reycomarine.com main
6. Click "Create stream"
7. **Copy the Measurement ID** — format: `G-XXXXXXXXXX`

**Important:** Under Account/Property settings, verify:
- Data retention: Set to 14 months (default is 2 months — extend now)
- GA4 → Admin → Data Settings → Data Retention → 14 months → Save

---

### GA4 Install via Rank Math Analytics Module

**No GTM, no theme edits — using Rank Math's Analytics module.**

1. In WP admin → Rank Math → General Settings → Analytics
2. Click "Connect with Google"
3. Sign in with Aiden's Google account (same account as the GA4 property)
4. Authorize Rank Math to access Google Analytics + Search Console
5. Select the GSC property: `sc-domain:reycomarine.com`
6. Select the GA4 property: `reycomarine.com` (the G-XXXXXXXXXX stream)
7. Click Save

**What Rank Math Analytics shows after connection:**
- Keywords from GSC (impressions, clicks, positions)
- Page-level analytics from GA4
- Combined SEO + traffic view per post/page

**Verify installation:**
- Navigate to `https://reycomarine.com` in a browser
- Open browser DevTools → Network tab
- Look for a request to `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`
- If present: GA4 is firing correctly

**Alternative verification:**
- GA4 → Reports → Realtime → should show 1 active user within a few minutes of visiting

---

## Part 3: Connect GSC to GA4 (Google's cross-linking)

Link GSC to GA4 property so organic data appears in GA4's Acquisition reports:

1. GA4 → Admin → Property Settings → Linked Products → Search Console
2. Click "Link"
3. Select the verified GSC property: sc-domain:reycomarine.com
4. Confirm

**Benefit:** GA4 → Acquisition → Traffic Acquisition will show organic search with keyword-level breakdowns (limited to non-(not provided) terms).

---

## Part 4: Goal / Conversion Setup (GA4)

Set up at minimum 2 conversions before launch to capture early data:

| Conversion | Type | How to Set Up |
|-----------|------|--------------|
| Contact form submit | Event | GA4 → Admin → Conversions → New conversion event → "contact_form_submit" or capture via Rank Math if Gravity Forms is active |
| Phone click | Event | GA4 → Admin → Conversions → New conversion event → "click" (filter to phone number link) |

**For Rank Math free tier:** Rank Math can push some events automatically. Verify what events fire by checking GA4 → Events in real-time.

---

## Expected Timeline

| Action | Who | When | Status |
|--------|-----|------|--------|
| GSC DNS TXT record add | Aiden | AM May 7 | ❌ Pending |
| GSC verify | Aiden | AM May 7 | ❌ Pending |
| Sitemap submission | Aiden | After verify | ❌ Pending |
| GA4 property create | Aiden | AM May 7 | ❌ Pending |
| Rank Math Analytics connect | Aiden | After GA4 property | ❌ Pending |
| GSC → GA4 link | Aiden | After both live | ❌ Pending |
| CONTEXT.md update (ga4_property_id, gsc_verified) | SEO agent | After Aiden confirms | ❌ Pending |

---

## After Completion — Update CONTEXT.md

Once both are wired, Aiden should send SEO agent the GA4 Measurement ID and confirm GSC is verified. SEO agent will update `retainer-kickoff-2026-05-07/CONTEXT.md`:

```yaml
gsc_verified: true
ga4_property_id: G-XXXXXXXXXX  # replace with actual
```

---

## Troubleshooting

**GSC verify fails:**
- Wait 60 minutes — DNS TTL can delay propagation even on Cloudflare
- Double-check TXT record copied correctly (no extra spaces)
- Try re-verifying from GSC

**Rank Math Analytics fails to connect:**
- Ensure same Google account owns both the GA4 property and has verified GSC
- Clear Rank Math's auth cache: Rank Math → General Settings → Analytics → Disconnect → reconnect
- Check WP error log if PHP error

**GA4 shows no data after 24 hours:**
- Verify Measurement ID in Rank Math matches GA4 property
- Check browser DevTools for the GA4 tag firing
- Confirm site is not behind a login wall or cache that blocks GA4 script

---

*Wiring plan for Aiden to execute. No dev involvement required — all actions are in WP admin + Cloudflare + Google dashboards.*
