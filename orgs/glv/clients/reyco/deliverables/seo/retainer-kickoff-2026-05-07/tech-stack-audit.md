# Reyco Marine — Tech Stack SEO Audit
**Prepared:** 2026-05-07 by seo agent
**Domain:** reycomarine.com (post-cutover ~21:00Z May 6)
**Source:** R19 systemic findings, pre-launch audits, site configuration

---

## 1. Platform Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| CMS | WordPress (WooCommerce) | WP version unknown post-cutover — verify in WP admin → Dashboard → Updates |
| Theme | Divi (custom child) | Backend-only policy — no design changes without Aiden approval |
| Hosting | SiteGround GrowBig | GrowBig plan; OPcache confirmed NOT running on this tier |
| CDN/WAF | Cloudflare (free/Pro) | Handles www→non-www redirect, SSL termination |
| SSL | Cloudflare + SiteGround double SSL | HTTPS confirmed post-cutover |
| SEO Plugin | Rank Math (free tier) | Installed, sitemaps live, analytics module not yet wired |
| eCommerce | WooCommerce | HPOS not yet verified — WC 10.7 introduces HPOS as default; confirm before upgrading |

---

## 2. Rank Math Configuration Audit

### What's Working
- Sitemaps: Rank Math generating XML sitemaps. Verify at `reycomarine.com/sitemap_index.xml`
- Robots.txt: Present (basic WP defaults). Needs refresh — see Section 4.
- LocalBusiness schema: Filed via dev PR (status: pending Aiden merge)
- Product schema: WooCommerce native — price/availability fields need verification

### Gaps to Fix

| Setting | Current State | Target State | How to Fix |
|---------|--------------|--------------|-----------|
| Meta description template (categories) | Site-wide fallback string | `%wc_category_description%` | Rank Math → Titles & Meta → Products → Product Category → Meta Description |
| Meta description template (products) | Fallback for 81/103 audited pages | Custom or auto from excerpt | Same path, Products tab |
| Analytics module | NOT connected | Connected to GA4 | Rank Math → General Settings → Analytics → Connect Google Account |
| Sitemap submission | Not submitted | Submitted to GSC | After GSC verify: GSC → Sitemaps → Add sitemap |
| Schema → Article | Verify author byline | Author = staff member, not "Reyco Marine" user | Rank Math → Titles & Meta → Posts |
| noindex on dev site | reyco.glvmarketing.ca still noindexed | Confirm staging domain removed from crawl | No action needed — staging noindex is correct, just verify reycomarine.com is indexable |

### Rank Math Free Tier Limits
Rank Math free does NOT include:
- Content AI (suggestions)
- Advanced schema builder
- Role manager
- WooCommerce advanced SEO

Working around free tier: all schema built via custom JSON-LD in dev PRs, not Rank Math schema builder.

---

## 3. Schema Markup Inventory

| Schema Type | URL Scope | Status | Delivery Method | Notes |
|-------------|-----------|--------|-----------------|-------|
| LocalBusiness | Homepage (/) | ⚠️ Pending merge | Dev PR (equivalant to PR #13) | businessType, name, address, phone, hours, areaServed fields |
| Organization | Homepage (/) | ⚠️ Pending merge | Bundled with LocalBusiness | publisher field for article schema |
| WebSite | Homepage (/) | ✅ WP default | WordPress/Rank Math | Includes SearchAction for SiteLinks searchbox |
| Product | /products/* | ⚠️ Partial | WooCommerce native | price, availability confirm needed — no aggregate review |
| BreadcrumbList | All inner pages | ❌ Dev PRs #5+#6 | Dev (Soo Sackers pattern) | Same error class as Soo Sackers — items without URL/name |
| Person | Staff pages | ❌ Pending bio data | Dev | Casey/Charlene 8+ day silence; generic placeholders authorized |
| FAQPage | Service pages | ❌ Q2 content plan | Content + Dev | Each service page to get 3–5 FAQs post-Week-4 |
| Review/Rating | Product pages | ❌ Q3 gated | WooCommerce native | Enable after GBP review volume builds |

**Priority schema fixes for Phase 1 (days 1–30):**
1. Merge LocalBusiness dev PR → homepage (immediate)
2. BreadcrumbList via dev PR — after Soo Sackers #5+#6 merge (pattern proven)
3. Person schema once bio data received

---

## 4. robots.txt Assessment

**Current state:** Basic WordPress-generated robots.txt at `reycomarine.com/robots.txt`

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://reycomarine.com/sitemap_index.xml
```

**Missing:** AI bot stanzas. All major AI crawlers currently have unrestricted access.

**AI bots to disallow (dev PR queued):**
- GPTBot (OpenAI)
- Claude-Web / anthropic-ai (Anthropic)
- CCBot (Common Crawl)
- Google-Extended (Gemini training)
- Amazonbot
- PerplexityBot
- Bytespider (TikTok)

**Status:** Dev PR drafted overnight — pending Aiden merge.

---

## 5. llms.txt Gap

`reycomarine.com/llms.txt` — ABSENT

This file guides AI crawlers on what the site covers and what's indexable for AI-assisted search. With the rise of AI-generated search results, an accurate llms.txt improves Reyco's chance of being cited in AI answer engines.

**Status:** Dev PR drafted overnight — pending Aiden merge. See `../dev-prs/llms-txt-draft.md`.

---

## 6. Page Speed Snapshot

**Data source:** Core Web Vitals not yet available for reycomarine.com (site just cut over; CrUX data requires 30 days of traffic). Baseline from SiteGround GrowBig performance characteristics:

| Metric | Estimated Baseline | Risk Factors |
|--------|-------------------|--------------|
| LCP | 2.5–4.0s | Divi builder, unoptimized product images |
| FID/INP | 150–300ms | Divi JS, WooCommerce scripts |
| CLS | Unknown | Divi dynamic layouts risk layout shift |
| Mobile speed | Unknown | Cloudflare caching helps; Divi mobile render varies |

**SiteGround-specific considerations:**
- OPcache confirmed NOT running on this hosting plan (from R19 audit) — PHP pages served uncached at PHP layer
- SiteGround Dynamic Cache (HTML cache) IS active — first-render of cached pages fast; uncached product pages slower
- SG Optimizer plugin likely installed — verify LiteSpeed/caching config in WP admin

**Action (Month 2):** Pull CrUX data from GSC → Core Web Vitals report 30 days post-launch. SiteGround GrowBig typically scores 60–75 on PageSpeed Insights for WooCommerce builds — address if below 60 on mobile.

---

## 7. Crawl Health Flags

| Flag | Severity | Status |
|------|----------|--------|
| Canonical tags pointing to staging domain (reyco.glvmarketing.ca) | P2 | ⚠️ Post-cutover purge needed — Cloudflare/SG cache clear |
| noindex leak from staging theme setting | P2 | ⚠️ Verify reycomarine.com → Rank Math → Titles & Meta → noindex not set globally |
| www/non-www redirect consistency | P2 | ⚠️ Cloudflare handles — verify no split between www/non-www indexation |
| 404 handling | P3 | ✅ WordPress default 404 page returns 404 status |
| XML sitemap health | P2 | ⚠️ Confirm no staging URLs in sitemap after cutover |
| Internal links pointing to staging URLs | P2 | ⚠️ Run search-replace on DB — `reyco.glvmarketing.ca` → `reycomarine.com` (dev action) |

**Critical:** The staging→production URL migration is the #1 technical SEO risk right now. If internal links, canonicals, or sitemap entries still reference `reyco.glvmarketing.ca`, Google will index the wrong domain. Run WP-CLI search-replace as soon as DNS is fully propagated.

```bash
# WP-CLI search-replace (run on server via SiteGround SSH)
wp search-replace 'reyco.glvmarketing.ca' 'reycomarine.com' --all-tables --dry-run
# Remove --dry-run when confirmed clean
```

---

## 8. Recommended Tech Actions — Phased

### Phase 1 (Days 1–14): Foundation Fixes
- [ ] Aiden: GSC DNS TXT verify → submit sitemap
- [ ] Aiden: GA4 install via Rank Math Analytics module
- [ ] Dev: Merge LocalBusiness schema PR
- [ ] Dev: Merge robots.txt + llms.txt PRs
- [ ] Dev: Run staging→production URL search-replace
- [ ] Dev: Verify no noindex set on reycomarine.com
- [ ] Aiden: Verify canonical tags point to reycomarine.com (not staging)

### Phase 2 (Days 15–30): On-Page SEO
- [ ] Dev: BreadcrumbList schema (after Soo Sackers PR #5+#6 pattern proven)
- [ ] SEO: Category meta descriptions — write 30 priority categories
- [ ] SEO: Fix H1 template for WC category pages (empty H1 bug from R19)
- [ ] Rank Math: Set category meta description template to `%wc_category_description%`

### Phase 3 (Days 31–90): Schema + Content
- [ ] Person schema (Casey/Charlene bio data)
- [ ] FAQPage schema on service pages (content plan Week 4+)
- [ ] Monitor Core Web Vitals in GSC — address if mobile CWV fails

---

*Tech audit based on R19 systemic findings (2026-05-01), site config at cutover, and SiteGround hosting characteristics.*
