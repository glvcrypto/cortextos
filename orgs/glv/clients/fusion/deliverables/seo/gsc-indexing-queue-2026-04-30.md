# Fusion Financial — GSC Indexing Queue
**Prepared:** 2026-04-30 by seo agent  
**Freshness verified:** All 15 URLs live-checked today  
**Source:** life-os/tasks/clients/fusion-gsc-indexing-batch.md (created 2026-03-09, 52 days overdue)  
**Submission:** Aiden submits in GSC — Search Console → URL Inspection → Request Indexing  
**GSC quota:** ~10–12 requests per day. Split across 2 days as marked.  

---

## 🔴 GATE: Fix Blog Post Titles Before Submitting

**Do not submit blog post URLs until post-specific meta titles are set.** Submitting pages with generic titles wastes GSC quota — Google will crawl them, see near-identical metadata across posts, and de-prioritise them in SERPs even after indexing.

**Fix (one config change):** Install RankMath on Fusion Financial. Set blog post title format to `%title% | Fusion Financial`. All affected posts resolve instantly with no per-post edits.

Once titles are fixed, submit all 15 URLs. This is the same fix as Reyco's 80-page generic meta issue — could batch both into one dev config sprint.

---

**4 blog posts currently returning a site-wide generic title and H1** instead of post-specific metadata:

| URL | Title returned | Expected |
|-----|---------------|---------|
| `/blog/how-to-file-hst-online-ontario` | "Bookkeeping & Tax in Sault Ste. Marie, ON \| Fusion Financial" | "How to File HST Online in Ontario" (or similar) |
| `/blog/bookkeeping-services-sault-ste-marie` | "Bookkeeping & Tax in Sault Ste. Marie, ON \| Fusion Financial" | Post-specific title |
| `/blog/tax-preparation-checklist-sault-ste-marie` | "Bookkeeping & Tax in Sault Ste. Marie, ON \| Fusion Financial" | Post-specific title |
| `/blog/small-business-bookkeeping-what-to-expect` | "Bookkeeping & Tax in Sault Ste. Marie, ON \| Fusion Financial" | Post-specific title |

**Impact:** Google may treat these as near-duplicate content and suppress them in SERPs even after indexing. **Recommended:** Fix blog post meta titles (install RankMath or set per-post titles) BEFORE requesting indexing — otherwise you're indexing pages Google will de-prioritize on sight.

**Aiden decision:** Submit now anyway (Google will eventually re-crawl once titles are fixed) OR fix titles first (better for long-term indexing quality). The `/blog/how-to-file-hst-online-ontario` URL targets "hst netfile" at 18,100/mo — worth fixing that one title before submitting.

---

## ⚠️ www Redirect Note (URLs 14–15)

URLs 14 and 15 are `www.fusionfinancialssm.com` variants. Submit these **only if:**
- www is a separately verified property in GSC, OR
- The www → non-www redirect is NOT in place (i.e., both variants serve content)

If a www → non-www 301 redirect is already live, submitting the www URLs is redundant — GSC will follow the redirect to the canonical non-www URL. Verify in browser before submitting.

---

## Day 1 — Submit These First (10 URLs)

Copy each URL into GSC → URL Inspection → Request Indexing.

| Priority | URL | Target keyword | Why submit now |
|----------|-----|----------------|----------------|
| 1 | `https://fusionfinancialssm.com/services/bookkeeping` | bookkeeping sault ste marie (KD 0) | Primary commercial page, zero competition, unique title ✅ |
| 2 | `https://fusionfinancialssm.com/blog/how-to-file-hst-online-ontario` | hst netfile (18,100/mo) | Highest search volume in batch — ⚠️ fix title first ideally |
| 3 | `https://fusionfinancialssm.com/services/hst-gst-filing` | hst filing ontario (KD 0) | Service page, unique title ✅ |
| 4 | `https://fusionfinancialssm.com/blog/bookkeeping-services-sault-ste-marie` | local bookkeeper query | ⚠️ generic title — flag |
| 5 | `https://fusionfinancialssm.com/services` | financial services sault ste marie | Hub page with impressions already, unique title ✅ |
| 6 | `https://fusionfinancialssm.com/blog/tax-preparation-checklist-sault-ste-marie` | tax prep checklist (pos 22) | Already ranking — push to top 10, ⚠️ generic title |
| 7 | `https://fusionfinancialssm.com/services/year-end-preparation` | year end bookkeeping | Service page, unique title ✅ |
| 8 | `https://fusionfinancialssm.com/services/payroll` | payroll sault ste marie | Service page, unique title ✅ |
| 9 | `https://fusionfinancialssm.com/services/financial-reporting` | financial reporting | Service page, unique title ✅ |
| 10 | `https://fusionfinancialssm.com/blog/small-business-bookkeeping-what-to-expect` | small biz bookkeeping | ⚠️ generic title — flag |

---

## Day 2 — Submit These Second (3 URLs + 2 conditional)

| Priority | URL | Target keyword | Notes |
|----------|-----|----------------|-------|
| 11 | `https://fusionfinancialssm.com/blog` | fusion financial blog | Blog listing page, unique title ✅ |
| 12 | `https://fusionfinancialssm.com/contact` | fusion financial contact | Good contact details live (705) 254-4001 ✅ |
| 13 | `https://fusionfinancialssm.com/quote` | free bookkeeping quote | Conversion page, unique title ✅ |
| 14 | `https://www.fusionfinancialssm.com/` | — | **Drop if www → non-www 301 is live.** Check: open in browser, see if URL bar changes to non-www. |
| 15 | `https://www.fusionfinancialssm.com/contact` | — | Same — drop if redirect is live. |

---

## Freshness Verification Summary (checked 2026-04-30)

| # | URL | Live | Title status | Action |
|---|-----|------|-------------|--------|
| 1 | /services/bookkeeping | ✅ | Unique ✅ | Submit Day 1 |
| 2 | /blog/how-to-file-hst-online-ontario | ✅ | Generic ⚠️ | Submit Day 1 — fix title ASAP |
| 3 | /services/hst-gst-filing | ✅ | Unique ✅ | Submit Day 1 |
| 4 | /blog/bookkeeping-services-sault-ste-marie | ✅ | Generic ⚠️ | Submit Day 1 |
| 5 | /services | ✅ | Unique ✅ | Submit Day 1 |
| 6 | /blog/tax-preparation-checklist-sault-ste-marie | ✅ | Generic ⚠️ | Submit Day 1 |
| 7 | /services/year-end-preparation | ✅ | Unique ✅ | Submit Day 1 |
| 8 | /services/payroll | ✅ | Unique ✅ | Submit Day 1 |
| 9 | /services/financial-reporting | ✅ | Unique ✅ | Submit Day 1 |
| 10 | /blog/small-business-bookkeeping-what-to-expect | ✅ | Generic ⚠️ | Submit Day 1 |
| 11 | /blog | ✅ | Unique ✅ | Submit Day 2 |
| 12 | /contact | ✅ | Unique ✅ | Submit Day 2 |
| 13 | /quote | ✅ | Unique ✅ | Submit Day 2 |
| 14 | www.fusionfinancialssm.com/ | ✅ | — | Verify www redirect first |
| 15 | www.fusionfinancialssm.com/contact | ✅ | — | Verify www redirect first |

**All 15 pages are live.** No 404s, no broken pages, no stale claims detected.

---

## Bonus Finding — Fusion Blog Post Title Issue

4 of the blog posts have a site-wide generic meta title instead of post-specific titles. This is the same systemic issue as Reyco's 80-page generic meta problem. Likely cause: no SEO plugin installed, and the blog post template doesn't pull the post title for `<title>` tag.

**Quick fix:** Install RankMath (free), set post titles to `%title% | Fusion Financial`. This would fix all affected blog posts in one config change.

**Scope unknown** — need to check how many of the older 21 blog posts have this same issue. Recommend spot-checking 2–3 older posts in browser dev tools (`Ctrl+U` → search for `<title>`) before the Day 1 submission.

---

*No external actions taken. Internal deliverable — for Aiden GSC console session.*  
*Freshness verified 2026-04-30 via live fetch of all 15 URLs.*
