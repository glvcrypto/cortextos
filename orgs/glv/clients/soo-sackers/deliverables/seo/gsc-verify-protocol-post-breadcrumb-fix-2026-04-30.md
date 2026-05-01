# Soo Sackers — Post-Deploy GSC Verification Protocol
**Prepared:** 2026-04-30 by seo agent  
**Trigger:** Dev's breadcrumb schema fix merges and deploys to soosackers.com  
**GSC property:** `sc-domain:soosackers.com`  
**Purpose:** Step-by-step verification that the breadcrumb fix resolves the recurring GSC rich result error and that no regressions were introduced.

---

## Context

- soosackers.com is a React SPA (Lovable) on SiteGround GrowBig
- Recurring GSC alert: **Breadcrumb — Items without a URL or label** (affects Sitelinks breadcrumb display in SERPs)
- As of Apr 5 audit: 1/7 pages indexed, 0 clicks, 0 impressions
- The breadcrumb JSON-LD block is in the React component — the fix changes the structured data emitted at render time (SSR via LovableHTML prerendering)
- Test history shows LovableHTML prerendering is confirmed working (deployed 2026-02-26, homepage indexed)

---

## Verification Protocol — Execute in Order

### Step 1 — Confirm Deploy Is Live (< 5 min after PR merges)

```bash
curl -sI https://soosackers.com | grep -E "^(HTTP|cf-ray|x-cache|age)"
```

- Confirm: `HTTP/2 200` (not 503, not 301)
- Note the `cf-ray` to confirm you're hitting the live edge, not a cached pre-fix version
- If SiteGround's dynamic cache is serving stale HTML: request a cache purge in the SiteGround Site Tools > Speed > Caching panel before any GSC tests

To confirm the new breadcrumb JSON-LD is actually in the page:

```bash
curl -s https://soosackers.com | grep -o '"@type":"BreadcrumbList"[^<]*' | head -5
```

Expected: a `BreadcrumbList` block with `itemListElement` entries each containing both `"item"` (URL) and `"name"` (label). If the output is empty — prerendering hasn't kicked in yet, wait 2–3 minutes and retry.

---

### Step 2 — Rich Results Test (Primary Validation)

**Tool:** https://search.google.com/test/rich-results  
**Action:** Test these 3 URLs in order:

| URL | Why |
|-----|-----|
| `https://soosackers.com/` | Homepage — most crawled |
| `https://soosackers.com/roster` | Inner page most likely to have breadcrumb chain |
| `https://soosackers.com/schedule` | Second inner page |

**Pass criteria for each URL:**
- `BreadcrumbList` appears in the detected structured data list
- **Zero** "Items without a URL or label" errors
- **Zero** "Missing field 'item'" warnings
- Rich result preview shows the breadcrumb trail under the URL in the preview pane

**If errors persist:** The JSON-LD fix did not deploy correctly or the prerenderer is still serving the old snapshot. Do NOT submit to GSC until this passes — submitting a broken page wastes quota and extends the error window.

---

### Step 3 — GSC URL Inspection (Confirm Google Sees the Fix)

**Tool:** Google Search Console → URL Inspection  
**Property:** `sc-domain:soosackers.com`

Test these URLs in order:

1. `https://soosackers.com/`
2. `https://soosackers.com/roster`
3. `https://soosackers.com/schedule`
4. `https://soosackers.com/stats`
5. `https://soosackers.com/photos`
6. `https://soosackers.com/sponsors`

For each:
- Click **"Test Live URL"** (not the cached version — live test re-crawls now)
- Under **Enhancements → Breadcrumbs**: confirm "Valid" (not "Error" or "Warning")
- If the page was previously indexed and showing an error: the "Test Live URL" result is what confirms the fix. GSC takes 1–14 days to re-process and clear the error from the coverage report — this is normal.

**For any page showing "URL is not on Google":**  
Click **"Request Indexing"** — submitting now (post-fix) is appropriate since the schema is now valid. This is a higher-priority submit than the stale pre-fix snapshot Google may have cached.

**Pages to prioritize for Request Indexing (all 6 unindexed pages):**
```
https://soosackers.com/roster
https://soosackers.com/schedule
https://soosackers.com/stats
https://soosackers.com/photos
https://soosackers.com/sponsors
https://soosackers.com/about  (if this page exists)
```

GSC quota: ~10 URL Inspection/day. All 6 fit in a single session.

---

### Step 4 — Schema.org Validator (Belt-and-Suspenders)

**Tool:** https://validator.schema.org/

Paste `https://soosackers.com/` and run the validation.

Pass criteria:
- `BreadcrumbList` present
- No red errors (warnings OK)
- Each `ListItem` in `itemListElement` has both `item` (URL) and `name` (string)

This is belt-and-suspenders after the Rich Results Test. If Rich Results passed, this should too. Log any discrepancy.

---

### Step 5 — CSP Header Check (Don't Introduce Regressions)

The breadcrumb fix PR may touch the same header/meta configuration that houses the Content Security Policy (CSP). The existing CSP is already blocking GA4 + Shopify API calls — don't make it worse.

```bash
curl -sI https://soosackers.com | grep -i "content-security-policy"
```

Verify:
- `connect-src` still includes `https://www.google-analytics.com` and `https://analytics.google.com` — if those were already missing, note it but don't block on it (pre-existing issue)
- No new `default-src 'none'` or overly-restrictive directives that would block the structured data script tag from loading

If the CSP got tightened by the PR, flag to dev immediately.

---

### Step 6 — Check GSC Enhancements Report (3–5 Days Post-Deploy)

Come back 3–5 days after deploy to verify GSC has processed the fix:

**Navigation:** GSC → Enhancements → Breadcrumbs

Look for:
- Error count dropping (or hitting zero)
- "Valid" count increasing as Google re-crawls pages
- The specific error "Items without a URL or label" moving to a resolved state

If errors persist after 14 days: escalate. Either Google hasn't re-crawled (trigger a sitemap resubmission: `https://soosackers.com/sitemap.xml`), or the fix didn't fully propagate.

---

### Step 7 — Indexation Progress Check (2 Weeks Post-Deploy)

Two weeks after the Request Indexing calls, check overall indexation status:

**GSC → Pages (Coverage):**
- Target: 5–7/7 pages indexed (up from 1/7 as of Apr 5)
- Watch for: any new "Excluded" items with reason "Crawled - currently not indexed" — this is common on new sites with low authority and is not the fault of the breadcrumb fix

**GSC → Search results (Performance):**
- Any impressions yet? (Zero expected at week 2 given Authority Score 2, but any breadcrumb-triggered sitelink impressions would appear here)

---

## Pass / Fail Summary

| Check | Tool | Pass Condition | Blocking? |
|-------|------|----------------|-----------|
| Deploy is live, new JSON-LD in page | curl | BreadcrumbList in HTML | Yes — don't test GSC until live |
| Rich Results Test — 3 URLs | search.google.com/test/rich-results | 0 errors on all 3 | Yes — don't Request Indexing until passes |
| URL Inspection — Live test | GSC | "Valid" Breadcrumbs on inner pages | No — can Request Indexing even if cached version shows error |
| Schema.org validator | validator.schema.org | 0 red errors | No — belt-and-suspenders |
| CSP regression | curl | GA4 + analytics domains still in connect-src | No — pre-existing issue, just don't worsen |
| GSC Enhancements report | GSC | Error count ↓ within 14 days | No — async, monitor only |

---

## What This Does NOT Fix

This verification protocol is scoped to the **breadcrumb schema fix** only. Separate pre-existing issues not resolved by this PR:

- **CSP blocking GA4 + Shopify API calls** — separate PR needed; dev ticket queued
- **Authority Score 2 / 0 dofollow backlinks** — content + link-building effort; not a schema issue
- **Indexation gap (6/7 pages not indexed)** — Request Indexing after Step 3 addresses this partially; full indexation depends on Googlebot crawl timing + domain authority

---

## Trigger Conditions

Execute this protocol when:
1. Dev's breadcrumb fix PR merges to main
2. Deployment to soosackers.com completes (SiteGround auto-deploy or manual)
3. Approximately 5 minutes after deploy (to allow SiteGround + Cloudflare cache propagation)

**Who runs this:** Aiden (GSC access required). The curl + Rich Results Test steps can be run by the SEO agent via WebFetch if the tools are available.

---

*No external actions taken. Protocol document only.*  
*Prepared 2026-04-30. Execute on breadcrumb PR deploy.*
