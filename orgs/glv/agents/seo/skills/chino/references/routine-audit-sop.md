# Weekly SEO Audit SOP

> Extracted from Episode 7 of the SEO training course, with supporting context from Episodes 1-6.
> This is the operational checklist for the /chino weekly audit skill.

---

## Tools Required

| Tool | Purpose |
|------|---------|
| **Semrush** (or Ahrefs) | Site audit / automated weekly crawl — error detection, health score |
| **Google Search Console** | Pages tab, sitemaps, index coverage, validation requests, annotations |
| **GA4** | Traffic trends, AI referral tracking (source/medium), conversion monitoring |
| **Screaming Frog Log File Analyser** | Crawl budget analysis, bot attack detection, AI bot crawl monitoring |
| **Hosting dashboard** | Capacity monitoring, bot blocking, plugin compromise alerts, billing status |

---

## Weekly Checklist

### 1. Run Semrush Site Audit (or Check Latest Auto-Crawl)

- Set Semrush/Ahrefs to auto-crawl **once per week** (e.g., every Wednesday)
- Review the latest audit report
- Compare to previous weeks — is the health score improving or declining?
- If a manual crawl is needed (e.g., post-migration), trigger one
- Note: Some issues flagged in Semrush/Ahrefs may not appear in GSC, and vice versa — always check both

### 2. Review GSC Pages Tab — Check Each Status Bucket

Open Google Search Console > Pages and review each status:

| Status | Action |
|--------|--------|
| **Indexed** | Verify count matches expectations |
| **Blocked by robots.txt** | Confirm these should actually be blocked (e.g., add-to-cart URLs = correct; product pages = incorrect) |
| **Crawled, currently not indexed** | Flag any pages here for 3+ months for content refresh |
| **Discovered, currently not indexed** | Flag any pages here for 3+ months for pruning |
| **Page with redirect** | Verify redirects are intentional and correct |
| **Not found (404)** | Fix or redirect — see Step 4 |
| **Server error (5xx)** | Investigate immediately — likely a Level 2 (hosting) issue |
| **Blocked by noindex** | Verify these should be noindexed |

### 3. Review GSC Sitemaps — All Products/Pages/Posts Indexed?

For each submitted sitemap (products, pages, posts):
- How many URLs are in the sitemap?
- How many are indexed?
- Calculate **indexed percentage**
- **Benchmark:** 76%+ indexed = reasonable health
- If indexed percentage drops significantly week-over-week, investigate immediately

### 4. Check for New 404s, Soft 404s, Server Errors

**Hard 404s:**
- Check Semrush/Ahrefs audit for new 4xx errors
- Check GSC for "Not found (404)" pages
- Determine: should the page exist? If yes, fix. If no, ensure no internal links point to it.

**Soft 404s:**
- Active pages that Google has stopped rewarding
- Common causes: duplicate content, thin content, out-of-stock products
- Check GSC for soft 404 reports

**Server errors (5xx):**
- 500 errors indicate hosting-level problems (Level 2)
- Check hosting dashboard for root cause
- 500 errors can cascade: if top-level pages return 500, the crawler cannot reach deeper pages, causing orphan page reports

### 5. Log All Issues in Issue Tracker (FIX-NNNN Format)

Record every issue found in the tracking spreadsheet:
- Use sequential numbering: FIX-0001, FIX-0002, FIX-0003, ...
- Never reuse a Fix ID
- When the sheet tab becomes overcrowded, create a new tab and continue the sequence
- Include enough detail that a future SEO can understand what happened

### 6. Prioritise: Red Errors First, Then Yellow Warnings

| Priority | Colour | Action |
|----------|--------|--------|
| **Critical** | Red | Fix immediately — these are blocking errors (500s, 404s on important pages, security issues) |
| **Warning** | Yellow | Fix after reds — these are degrading performance (missing alt text, redirect chains, etc.) |
| **Informational** | Blue | Fix if time allows — some are not necessary to address |

Read the explanation Semrush/Ahrefs provides for each error. Cross-reference with the 6-level framework to understand which level the issue belongs to.

### 7. Visual Spot-Check: Homepage, Key Landing Pages, Checkout

Perform a manual visual review — some issues are invisible to crawlers:

| Page Type | What to Check |
|-----------|---------------|
| **Homepage** | All sections loading, no missing elements, correct branding |
| **Key money/landing pages** | Content displays correctly, CTAs functional, forms working |
| **Product page template** | Product info, images, pricing, add-to-cart all functioning |
| **Shop / category pages** | Products displaying, pagination working, filters functional |
| **Checkout process** | Manually attempt a purchase end-to-end |
| **Blog posts** | Author displayed, images loading, internal links working |

**Rotation strategy:** Check one page type per day rather than everything at once.

**Watch for:** Broken carousels or sliders after plugin updates, missing elements after theme updates, removed plugins affecting page layout.

### 8. Check Hosting Dashboard for Anomalies

| Check | What to Look For |
|-------|-----------------|
| **Bot attacks** | Unusual IP activity, high request volumes from single IPs |
| **Capacity** | Peak hour graphs — is the site overloaded during busy times? |
| **Plugin alerts** | Compromised or outdated plugin warnings |
| **Billing** | Payment status current — a failed payment can take the site offline |
| **Rate limiting** | Are bot rate limits properly configured (e.g., max 200 requests/minute per IP)? |

### 9. Update chino-state.json with Results

After completing the audit, update the state file with:
- Audit date
- Health score (from Semrush/Ahrefs)
- Number of errors by severity (red/yellow/blue)
- Indexed page counts per sitemap
- New issues logged (Fix IDs)
- Issues resolved since last audit

---

## Issue Tracker Format

| Fix ID | Date Found | Level | Category | Description | Status | Date Fixed |
|--------|-----------|-------|----------|-------------|--------|-----------|
| FIX-0001 | YYYY-MM-DD | L4 | 404 | Broken product page /product/xyz — returning hard 404 | done | YYYY-MM-DD |
| FIX-0002 | YYYY-MM-DD | L2 | 500 | Server returning 500 errors on /wp-json endpoint | done | YYYY-MM-DD |
| FIX-0003 | YYYY-MM-DD | L5 | Index | 19 product pages in "crawled, not indexed" for 2+ months | pending | — |
| FIX-0004 | YYYY-MM-DD | L3 | Speed | Theme bloat causing 4s+ load time on mobile | pending | — |
| FIX-0005 | YYYY-MM-DD | L4 | Soft 404 | 3 out-of-stock products flagged as soft 404 | done | YYYY-MM-DD |
| FIX-0006 | YYYY-MM-DD | L6 | On-Page | Missing H1 on /services page | done | YYYY-MM-DD |
| FIX-0007 | YYYY-MM-DD | L1 | Links | GBP listing has wrong phone number | pending | — |

### Level Reference for Categorisation

| Level | Scope | Example Issues |
|-------|-------|---------------|
| L1 | External / Links | Broken backlinks, incorrect GBP info, missing citations |
| L2 | Domain / Hosting | 500 errors, hosting capacity, SSL issues, DDoS attacks |
| L3 | Navigation / Architecture | Click depth issues, broken navigation, speed/theme bloat, sitemap errors |
| L4 | Crawlable vs Not Crawlable | 404s, soft 404s, robots.txt misconfig, canonical issues, mobile crawl gap |
| L5 | Indexed URLs | Pages not indexed, content bloat, cannibalization, index status degradation |
| L6 | On-Page | Missing title tags, H1 issues, schema errors, keyword optimisation gaps |

---

## Content Health Check (Monthly)

Perform this deeper analysis once per month in addition to the weekly checklist.

### Indexation Ratio by Sitemap

For each sitemap, calculate:

```
Indexed Percentage = (Indexed URLs / Total URLs in Sitemap) x 100
```

**Benchmarks:**
- **76%+ indexed** = Reasonable health — optimise the remainder
- **60-75% indexed** = Concerning — prioritise fixing index issues
- **Below 60%** = Serious content/technical problem — investigate immediately

### Flag Stale Not-Indexed Pages

| Status | Duration | Action |
|--------|----------|--------|
| Crawled, not indexed | < 3 months | Monitor; minor optimisation may help |
| Crawled, not indexed | 3+ months | **Flag for content refresh** — update, expand, improve internal linking |
| Discovered, not indexed | < 3 months | Monitor; may self-resolve |
| Discovered, not indexed | 3+ months | **Flag for pruning** — content is not valuable enough for Google to crawl |
| Date shows 1970-01-01 | Any | **Limbo** — re-optimise if not yet attempted; otherwise prune (301 redirect or remove) |

### Content Bloat Alert

Calculate the combined percentage of pages in "crawled, not indexed" + "discovered, not indexed":

```
Bloat Percentage = ((Crawled Not Indexed + Discovered Not Indexed) / Total URLs) x 100
```

- **If bloat exceeds 30-40% of total URLs** → **Content bloat alert.** Urgent action required:
  1. Identify the worst offenders (oldest not-indexed pages)
  2. Decide: refresh, merge, or prune each one
  3. For refreshed content, request re-indexing via GSC
  4. For pruned content, 301 redirect to the most relevant live page
  5. Re-check indexation after 30 days

### Index Status Degradation Path

Track pages through the degradation path:

```
Indexed → Crawled, Currently Not Indexed → Discovered, Currently Not Indexed → Limbo (1970-01-01)
```

- The transition from "crawled, not indexed" to "discovered, not indexed" takes approximately **130 days**
- Once in limbo, the page loses all keywords and visibility
- Catching pages at "crawled, not indexed" stage gives you time to intervene

---

## GSC Annotations Protocol

Leave annotations in Google Search Console for any significant event:

| Event Type | Example Annotation |
|------------|-------------------|
| **Migration** | "Migrated from Cloudways to Alexhost" |
| **Google algorithm update** | "Google March 2026 core update rolled out" |
| **Theme change** | "Switched from Flavor theme to Flavor 2.0" |
| **Hosting change** | "Moved server from New York to Toronto" |
| **Plugin update** | "Updated WooCommerce from 8.x to 9.x" |
| **Content prune** | "Pruned 45 blog posts with 301 redirects" |
| **Major fix** | "Fixed 500 errors on /wp-json — FIX-0002" |

**Purpose:** Enables before/after comparison of site performance around each event.

---

## Plugin Update Protocol

1. **Always back up** the site before updating any plugins
2. **Frequency:** Once per week or once per month — maintain a consistent cadence
3. **Consult developer** before major plugin updates (major version changes)
4. **After updating:** Do a visual spot-check of pages that use the updated plugin
5. **If something breaks:** Restore from backup, investigate compatibility, consult developer

---

## Backup Protocol

- Ensure hosting-level backups are configured and running
- Install a backup plugin as a secondary backup method
- **Always back up before:**
  - Plugin updates
  - Theme changes
  - Any migration
  - Any significant configuration change
- Verify backups are restorable (test periodically)

---

## AI Visibility Check (Monthly Add-On)

### AI Bot Crawl Monitoring (Log Files)

Using Screaming Frog Log File Analyser:
1. Filter by AI bot user agents (ChatGPT, Claude, Perplexity)
2. Check which pages AI bots are crawling
3. Note crawl frequency per page
4. Flag any 404 errors returned to AI bots — these are missed opportunities

### AI Referral Tracking (GA4)

In GA4 > Traffic Acquisition > Source / Medium:
1. Look for AI sources: `chatgpt.com`, `perplexity.ai`, `searchwave`, etc.
2. Track sessions from each AI source
3. Drill into which specific pages receive AI referral traffic
4. Compare month-over-month to track AI visibility trends

---

## Weekly Audit Summary Template

After completing the audit, produce a brief summary:

```
## Weekly Audit — [DATE]

**Health Score:** [Semrush/Ahrefs score]
**Errors:** [X red] / [Y yellow] / [Z blue]

### Sitemaps
- Products: [X/Y indexed] ([Z%])
- Pages: [X/Y indexed] ([Z%])
- Posts: [X/Y indexed] ([Z%])

### New Issues Logged
- FIX-NNNN: [brief description]
- FIX-NNNN: [brief description]

### Issues Resolved
- FIX-NNNN: [brief description]

### Visual Check Notes
- [Any anomalies found]

### Hosting Notes
- [Any capacity or security issues]

### Next Actions
- [Prioritised list of what to fix this week]
```
