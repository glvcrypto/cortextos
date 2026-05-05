# Soo Sackers — Pre-Fix GSC Baseline
**Prepared:** 2026-05-05 by seo agent
**Purpose:** Delta-tracking anchor before PR #5 (hash-anchor breadcrumb fix) + PR #6 (Teams breadcrumb + SchedulePage schema) merge. When PRs deploy, re-run `gsc-verify-protocol-post-breadcrumb-fix-2026-04-30.md` and measure improvement against this file.
**Trigger:** Option B — capture pre-fix state for clean attribution. Boss confirmed 2026-05-05.

---

## PR Status at Baseline Date

| PR | Title | Status | Age |
|----|-------|--------|-----|
| #5 | Hash-anchor breadcrumb fix | OPEN | 5 days |
| #6 | Teams breadcrumb + SchedulePage schema | OPEN | 4 days |

Both gated on Aiden approval queue (bundled with Reyco-Wed-launch items). Boss to bundle in next Telegram.

---

## GSC State — Pre-Fix (as of 2026-04-05 audit)

| Metric | Value |
|--------|-------|
| GSC property | `sc-domain:soosackers.com` |
| Pages indexed | 1 of 7 |
| Total clicks | 0 |
| Total impressions | 0 |
| Active GSC error | **Breadcrumb — Items without a URL or label** (recurring rich result error) |
| Rich result error type | BreadcrumbList items missing `item` (URL) and/or `name` (label) fields |
| Error scope | Sitelinks breadcrumb display in SERPs — suppressed |

---

## Structured Data State — Pre-Fix (curl verified 2026-05-05)

> Note: WSL source IP is intermittently filtered by Cloudflare edge (known pattern — `reference_siteground_waf_visual_capture.md`). Data below reflects prerendered HTML when served; JavaScript-only hydration state not captured via curl.

### Homepage (`/`)
| Schema | Present | Notes |
|--------|---------|-------|
| WebSite | ✅ | `@type: WebSite`, publisher `SportsOrganization`, name/url/description correct |
| BreadcrumbList | ❌ ABSENT | No BreadcrumbList block in prerendered HTML |
| SportsEvent / SchedulePage | ❌ ABSENT | Not implemented yet |
| Meta title | ABSENT in prerendered HTML | Served via React hydration (client-side only) |
| Meta description | ABSENT in prerendered HTML | Client-side only |
| Canonical | ABSENT in prerendered HTML | Client-side only |

### Inner Pages (`/roster`, `/schedule`, `/teams`)
| Page | JSON-LD Blocks | BreadcrumbList |
|------|---------------|----------------|
| /roster | 1 (WebSite only) | ❌ ABSENT |
| /schedule | 0 | ❌ ABSENT |
| /teams | 0 | ❌ ABSENT |

**Summary:** BreadcrumbList is completely absent from all prerendered HTML. The GSC recurring error predates any BreadcrumbList block being emitted — Google may have detected a client-rendered breadcrumb that lacks proper fields, or a stale cached snapshot from a prior implementation.

---

## Root Cause (from PR context)

- Site is a React SPA (Lovable) on SiteGround GrowBig
- LovableHTML prerendering confirmed working (deployed 2026-02-26, homepage indexed)
- PR #5 target: fix hash-anchor-broken breadcrumb JSON-LD that emits `item` fields as `#anchor` fragments (invalid — must be full URLs)
- PR #6 target: add BreadcrumbList to `/teams` + add `SchedulePage` schema to `/schedule`
- Post-fix expectation: all inner pages emit valid BreadcrumbList with full URL `item` fields + non-empty `name` fields → GSC error clears within 1–2 crawl cycles

---

## Post-Fix Verification Gate

When PR #5+#6 deploy:
1. Run `gsc-verify-protocol-post-breadcrumb-fix-2026-04-30.md` — curl + Rich Results Test against homepage + /roster + /schedule
2. Expected delta: BreadcrumbList PRESENT on all tested pages, zero "Items without URL or label" errors
3. GSC timeline: errors typically clear 7–14 days after prerenderer serves valid markup to Googlebot
4. Indexing target: 7/7 pages indexed within 30 days of fix deploy (currently 1/7)

---

## Watch List — Metrics to Lift

| Metric | Pre-Fix | Target (30d post-fix) |
|--------|---------|----------------------|
| Pages indexed | 1/7 | 7/7 |
| GSC breadcrumb error | Active | Resolved |
| Clicks | 0 | >0 |
| Impressions | 0 | >0 |
| Rich result (breadcrumb) in SERP | None | Active on inner pages |

---

*Baseline locked. Re-run post-fix verification when PR #5+#6 merge. No GSC CSV needed for this file — GSC data to be pulled post-fix once impressions accumulate.*
