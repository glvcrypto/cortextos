# Reyco Marine — SEO Launch Checklist (40-Point Baseline)
**Prepared:** 2026-05-07 by seo agent
**Domain:** reycomarine.com
**Status at checklist date:** Domain live, Rank Math active, GSC/GA4 NOT wired

---

## Legend
- ✅ DONE — verified or confirmed
- ⚠️ PARTIAL — present but needs work
- ❌ MISSING — needs action
- 🔲 PENDING — awaiting Aiden action

---

## Section 1: Technical Foundation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Domain live and resolving | ✅ | reycomarine.com → cutover ~21:00Z May 6 |
| 2 | HTTPS / SSL cert | ✅ | Cloudflare + SiteGround SSL |
| 3 | www redirect to non-www (or vice versa) | ⚠️ | Verify consistent — Cloudflare handles |
| 4 | robots.txt present | ✅ | Present but AI bot stanzas missing |
| 5 | XML sitemaps live | ✅ | Rank Math generating; verify /sitemap_index.xml |
| 6 | Sitemap submitted to GSC | ❌ | GSC not yet verified |
| 7 | No noindex on live pages | ⚠️ | Verify — staging domain noindex rule may persist |
| 8 | Canonical tags on all pages | ⚠️ | Rank Math sets canonicals; verify post-cutover pointing to reycomarine.com (not reyco.glvmarketing.ca) |
| 9 | GSC property verified | ❌ | DNS TXT method — Aiden action required |
| 10 | GA4 installed | ❌ | Free property under Aiden's Google account — via Rank Math Analytics module |

---

## Section 2: On-Page SEO

| # | Item | Status | Notes |
|---|------|--------|-------|
| 11 | Homepage title tag optimized | ⚠️ | Verify Rank Math title includes "Sault Ste. Marie" + primary service |
| 12 | Homepage meta description set | ⚠️ | Check Rank Math — 79% of pages still on fallback (R19 audit) |
| 13 | H1 present on homepage | ✅ | Confirmed from prior audit |
| 14 | H1 present on inner pages | ⚠️ | WC categories had blank H1 (JS-populated) — flagged in R19 |
| 15 | Meta descriptions on service pages | ⚠️ | 196 metas written (A1 batch). Verify Rank Math serving them |
| 16 | Alt text on product images | ⚠️ | 160 alt texts written (A2 batch). Ongoing gap on new products |
| 17 | Internal linking structure | ⚠️ | No formal silo linking yet — content plan will wire this |
| 18 | Breadcrumbs on inner pages | ⚠️ | BreadcrumbList schema pending dev PRs #5+#6 |
| 19 | URL structure clean (no staging artifacts) | ⚠️ | Verify no reyco.glvmarketing.ca references in content |
| 20 | 404 page returns 404 status code | ✅ | WordPress default |

---

## Section 3: Schema Markup

| # | Item | Status | Notes |
|---|------|--------|-------|
| 21 | LocalBusiness schema on homepage | ⚠️ | Filed via dev (PR #13 equivalent). Verify live |
| 22 | Organization schema | ⚠️ | Bundled with LocalBusiness — verify publisher fields |
| 23 | Product schema on product pages | ⚠️ | WC native — verify price/availability fields |
| 24 | BreadcrumbList on inner pages | ❌ | Dev PRs #5+#6 OPEN — not yet merged |
| 25 | SiteLinks searchbox | ❌ | Not yet implemented |
| 26 | Person schema (staff) | ❌ | Staged — Casey/Charlene bio silence blocking full deploy |
| 27 | FAQ schema on service pages | ❌ | Not yet implemented — content plan Q2 item |
| 28 | Review/Rating schema | ❌ | Planned — gated on GBP review volume |

---

## Section 4: Local SEO

| # | Item | Status | Notes |
|---|------|--------|-------|
| 29 | GBP claimed and verified | ✅ | Aiden has Manager access |
| 30 | GBP name matches domain brand | ⚠️ | Verify: "Reyco Marine & Small Engine" consistent |
| 31 | GBP primary category set | ⚠️ | Verify: "Marine Supply Store" or "Boat Dealer" — see GBP playbook |
| 32 | GBP secondary categories set | ❌ | Small Engine Repair, Outboard Motor Store, ATV Dealer — see GBP playbook |
| 33 | GBP phone/hours/address accurate | ⚠️ | Verify match with site footer (NAP consistency) |
| 34 | GBP website link pointing to reycomarine.com | ❌ | Update post-cutover — may still point to staging |
| 35 | NAP consistent across site | ⚠️ | Footer NAP audit needed — see SSM_local_strategy.md |
| 36 | Top citation sites claimed | ❌ | 14-day drip campaign queued — see directory-drip-14day.md |

---

## Section 5: Content + AI Signals

| # | Item | Status | Notes |
|---|------|--------|-------|
| 37 | llms.txt at root | ❌ | MISSING — dev PR queued overnight |
| 38 | robots.txt AI bot stanzas | ❌ | MISSING — dev PR queued overnight |
| 39 | About page with staff bios | ⚠️ | Page exists; bio depth thin — person schema pending |
| 40 | Blog / content hub active | ⚠️ | WordPress blog exists; content plan kicks off Week 1 |

---

## Priority Action Queue (Aiden AM)

### Immediate (today)
1. **GSC verify** — add DNS TXT record (see GA4_GSC_wiring_plan.md for exact value)
2. **GA4 install** — Rank Math Analytics module (see GA4_GSC_wiring_plan.md)
3. **GBP website link** — update to reycomarine.com in GBP dashboard
4. **Approve** robots.txt + llms.txt dev PRs (drafted overnight, boss to merge)

### This week
5. Merge Soo Sackers PRs #5+#6 (breadcrumb fix — separate client, unblocks schema error)
6. GBP categories + services setup (see GBP_setup_playbook.md)
7. Submit sitemap in GSC after verification

### Within 30 days
8. Person schema deploy (Casey/Charlene bio data)
9. BreadcrumbList deploy (dev PRs #5+#6 merge — Reyco version)
10. First content publish (Week 1 content plan)

---

*40/40 items audited. 10 DONE, 15 PARTIAL, 15 MISSING/PENDING. Critical path: GSC verify + GBP update + dev PRs.*
