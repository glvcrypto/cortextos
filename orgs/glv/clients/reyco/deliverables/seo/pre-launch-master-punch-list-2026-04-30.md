# Reyco Marine — Pre-Launch SEO Master Punch List
**Prepared:** 2026-04-30 by seo agent  
**For:** Dev handoff — domain cutover sprint  
**Sources:** R2–R18 audits, systemic dev ticket rollup, pre-launch polish pass, schema templates  
**Format:** P0 = must fix before domain goes live | P1 = first week post-launch | P2 = May retainer sprint

---

## P0 — Fix Before Domain Cutover

These block a clean launch. All can be actioned on staging now.

### Schema

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P0-S1 | Wire LocalBusiness schema to homepage | schema/schema-markup-templates.md | Complete — logo URL + storefront image URL as reasonable-default paths; validate at schema.org/validator post-deploy |
| P0-S2 | Wire 5 service page schemas (Small Engine, Marine, Winterization, Spring Commissioning, ATV/UTV FAQPage) | schema/schema-markup-templates.md | All JSON-LD complete, zero pending items — single dev PR |

### Copy

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P0-C1 | Rewrite Meet the Team meta title: `Meet the Reyco Marine Team \| Sault Ste. Marie` (46 chars) | pre-launch-seo-polish-pass-2026-04-29.md | Currently shows homepage generic meta — launches broken |
| P0-C2 | Rewrite Meet the Team meta desc: `Meet the crew at Reyco Marine & Small Engine in Sault Ste. Marie. Casey, Aaron, Lee, Damian and the rest of the team — same faces, year after year.` (147 chars) | pre-launch-seo-polish-pass-2026-04-29.md | Same issue — currently wrong description |
| P0-C3 | Update homepage meta description (178 chars → 148 chars): `Authorised Mercury, Cub Cadet, Toro and Princecraft dealer in Sault Ste. Marie. Sales, service and parts — all under one roof. Call 705-253-7828.` | priority-meta-drafts-2026-04-30.md | Current meta will be truncated in SERPs |

### Content

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P0-B1 | Delete 4 duplicate `-2` blog posts in WP Admin | r18-blog-full-audit-2026-04-30.md | Same content at two URLs = Google de-duplication. Delete these 4 slugs: `twenty-years...-2`, `how-to-store-your-mower...-2`, `we-sponsored-the-pike-derby...-2`, `we-are-bringing-the-whole-fleet...-2` |

### Dev Fix

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P0-D1 | Fill empty alt="" on ATV/UTV Repair hero images (6 empty alt tags) | pre-launch-seo-polish-pass-2026-04-29.md | Accessibility + image indexing — highest alt-empty count per-page on the site |
| P0-D2 | Fix H1 template on category/hub pages — 71 pages render blank H1 | systemic-dev-tickets-2026-04-30.md | Path A: fix template to render `get_queried_object()->name`. Path B: populate WC category names in WP Admin. Verify Boats, Lawn, Snow, Powersports, Docks hubs first |
| P0-D3 | Confirm meta description mechanism — how are the 23 custom metas currently being set? | systemic-dev-tickets-2026-04-30.md | Service pages + 10 hubs have custom metas without a plugin. Identify the mechanism, then apply to 80 remaining pages. OR install RankMath |

### SEO Plugin

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P0-SEO1 | Confirm RankMath (or Yoast) install status — if NOT installed, install now | pre-launch-seo-polish-pass-2026-04-29.md | Without SEO plugin, Task #12 product metas (250 WC products) cannot be surfaced to Google. CRITICAL for product page SEO |

---

## P1 — First Week Post-Launch

### Schema (E-E-A-T)

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-S3 | Wire Casey Davieaux Person schema to About page | schema/schema-markup-templates.md, may-retainer-week1-staging-2026-04-30.md | Casey Person block is ready — `author/casey.md` full name confirmed. Wire to /about/ |
| P1-S4 | Stub remaining 6 Person schema blocks on About page (Aaron, Lee, Damian, Lynn, Ron, Kory) | may-retainer-week1-staging-2026-04-30.md | Stubs with [PENDING last name] — fill once Charlene batch lands |

### Copy

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-C4 | Update About page meta title: `About Reyco Marine & Small Engine \| Sault Ste. Marie` (53 chars) | pre-launch-seo-polish-pass-2026-04-29.md | Remove "Family-Run" vanity tag — Google rewrite risk |
| P1-C5 | Trim ATV/UTV Repair meta desc to <158 chars | pre-launch-seo-polish-pass-2026-04-29.md | Currently ~180 chars — over limit, truncated |
| P1-C6 | Fix About page H2: "Get in Touch" → "Visit Us in Sault Ste. Marie" | pre-launch-seo-polish-pass-2026-04-29.md | Geo query intent |
| P1-C7 | Confirm "Certified" claim in Small Engine Repair meta desc | pre-launch-seo-polish-pass-2026-04-29.md | If no formal certification, soften to "Professional" or "Authorised" |

### Meta Descriptions (80 pages without custom metas)

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-M1 | Input priority meta descriptions for hub pages (Lawn/Garden, Powersports, Docks/Lifts, Inventory, Blog) | priority-meta-drafts-2026-04-30.md | Ready-to-input — all ≤155 chars |
| P1-M2 | Input priority meta descriptions for Marine brand pages (Princecraft, Mercury, Fishing Boats, Deck Boats, Outboard Motors, Trolling Motors, Humminbird, Fish Finders) | priority-meta-drafts-2026-04-30.md | Ready-to-input — all ≤155 chars |
| P1-M3 | Input priority meta descriptions for key brand pages (Cub Cadet, Toro, Riding Mowers, Push Mowers, Zero-Turn, Hisun, ATVs, Cub Cadet Snow, Toro Snow) | priority-meta-drafts-2026-04-30.md | Ready-to-input — all ≤155 chars |

### Link Gaps

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-L1 | Fleet bio-link pass — add `/about/meet-the-team/` link on every "Lee" and "Damian" mention across 10 service pages (L2,L3,L5,L6,L8,L10,L11,L13,L15,L16) | pre-launch-seo-polish-pass-2026-04-29.md | Single PR once Meet the Team page is live. Note: Warranty page (R12) already has service-page links — ADD bio link alongside, don't replace |
| P1-L2 | Add Boat Winterization → Marine Service link (completes the hub triangle: Marine ↔ Winterization ↔ Spring Commissioning) | pre-launch-seo-polish-pass-2026-04-29.md | L4 — add "For year-round marine service, see our [marine service](/service/marine/) page" |
| P1-L3 | Add "parts room" / "OEM parts in stock" → /service/order-parts/ link on Small Engine Repair | pre-launch-seo-polish-pass-2026-04-29.md | L7 — mentioned twice without linking |
| P1-L4 | Add /service/engine-repair/ link on Order Parts page | pre-launch-seo-polish-pass-2026-04-29.md | L14 — only service page not linked from parts page |

### Dev Fix

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-D4 | Investigate + resolve 19 pages with empty product carousels (EMPTY_STATE_FIRES) | systemic-dev-tickets-2026-04-30.md | Troy-Bilt (50 fires), E-Z-GO (50), Cordless Blowers (32), + 16 others with 7 fires each — product catalog not seeded |
| P1-D5 | Site-wide alt text audit — fill `alt=""` on images (73/103 pages affected) | systemic-dev-tickets-2026-04-30.md | Priority: pages with >1 empty alt (blog posts, About, Homepage). Format: `"[Brand/subject] — Reyco Marine, Sault Ste. Marie"` |

### Homepage

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-H1 | Update homepage meta title: `Reyco Marine & Small Engine \| Sault Ste. Marie` (46 chars) | homepage-seo-brief-2026-04-30.md | Current is 107 chars — severely truncated in SERPs |
| P1-H2 | Confirm homepage H1 decision: current "You worked for this. Your weekends should show it." has zero keyword signal | homepage-seo-brief-2026-04-30.md | Recommended: "Boat, Mower and Small Engine Dealer in Sault Ste. Marie" — but this is a design/copy decision needing Aiden approval |

### STIHL

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P1-STIHL | Resolve STIHL brand page (/lawn-and-garden/stihl/) — confirm authorization or noindex | systemic-dev-tickets-2026-04-30.md | STIHL not on verified authorized dealer list. Do NOT publish authorized dealer meta without confirmation. Either: (a) Casey confirms Reyco carries STIHL → add to brand list + write meta, OR (b) noindex the page |

---

## P2 — May Retainer Sprint

### Schema (E-E-A-T)

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P2-S5 | Fill Person schema stubs for Aaron, Lee, Damian, Lynn, Ron, Kory (last names + bios + social) | may-retainer-week1-staging-2026-04-30.md | Gated on Charlene Monday batch. 30 min SEO post-receipt |
| P2-S6 | Add author schema to all 36 blog posts connecting to Casey's Person schema ID | r18-blog-full-audit-2026-04-30.md | Gated on Casey Person schema being live at reycomarine.com/author/casey/ |

### Copy / H2 Fixes

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P2-C8 | Fix H2 casing on Marine Service ("How marine service works at Reyco" → "How Marine Service Works at Reyco") | pre-launch-seo-polish-pass-2026-04-29.md | Minor |
| P2-C9 | Differentiate Spring Commissioning H2 ("Authorised Marine Service in SSM" → "Authorised Spring Commissioning in SSM") | pre-launch-seo-polish-pass-2026-04-29.md | Minor |
| P2-C10 | Fix H2 keyword casing on Small Engine Repair ("How service actually works" → "How Small Engine Repair Works at Reyco") | pre-launch-seo-polish-pass-2026-04-29.md | Minor |

### Blog Content Pass

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P2-BL1 | Write custom meta descriptions for 35 blog posts not yet covered | r18-blog-full-audit-2026-04-30.md | Priority: Cluster 1 (local knowledge) + Cluster 3 (how-to/instructional) |
| P2-BL2 | Add service-page internal links to instructional blog posts | r18-blog-full-audit-2026-04-30.md | "How We Winterize" → /service/winterization/, "My Spring Commissioning Checklist" → /service/spring-commissioning/, etc. |

### Infrastructure

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P2-I1 | Rotate WC REST API credentials (ck_78ae...) | pre-launch-seo-polish-pass-2026-04-29.md | WP Admin → WooCommerce → Advanced → REST API → Revoke + regenerate |
| P2-I2 | GSC baseline export | — | Aiden action — Day-0 anchor for Q3 SEO lift measurement. If May 1 deadline missed, export ASAP |
| P2-I3 | Verify noindex is applied to 49 model-SKU archive pages (/reyco-category/...) | 2026-04-27_sku-archive-noindex-remediation.md | Task #16 memo — confirm implementation post-launch |

### Task #12 Remaining Products

| # | Action | Source | Notes |
|---|--------|--------|-------|
| P2-T12 | Complete 21 remaining product metas: Group A (13 R&J Machine — Casey WC import), Group B (6 Trailer X — dev SKU sync), Group C (1 Mercury 90HP — verify WC ID=383), Group D (1 Princecraft 2S vs 2RS — Casey confirm) | task12-followup-batch-2026-04-29.md | Script ready (scripts/task12-followup.py); gated on Casey + dev inputs |

---

## What's NOT on This List (intentional)

- **Homepage copy draft** — P1 May retainer deliverable; parked until Aiden reviews homepage brief (homepage-seo-brief-2026-04-30.md)
- **Blog post canonicals for pre-launch** — not needed once `-2` duplicates are deleted
- **WC product page H1/alt audit** — systemic issues (H1, alt) confirmed to apply here too; covered under P0-D2 + P1-D5 site-wide fixes
- **Soo Sackers GSC canonical audit** — blocked on URL list from Aiden (Task #7)
- **Casey tag decisions → v4 mapping** — blocked on 16 Casey decisions (Task #8)

---

## Audit Coverage Summary (as of 2026-04-30)

| Page type | Total | Audited | Notes |
|-----------|-------|---------|-------|
| WP pages (custom) | 98 | 98 | All via R2–R18 + tech-scans |
| Blog posts (unique) | 32 | 5 (HTML) + 32 (title/inventory) | 5 full HTML; 27 title+URL pattern only |
| Blog posts (duplicates) | 8 | 8 | All 4 pairs identified — P0 delete |
| WC product pages | 374 | ~250 | Task #12 meta audit; full 8-point pending |
| WC product categories (/reyco-category/) | 177 | 177 | Task #15-16 classified + noindex remediation |

---

*Prepared 2026-04-30. All items verified against source audit documents. No external actions taken.*  
*Sources: R2–R18 audit series, pre-launch-seo-polish-pass-2026-04-29.md, systemic-dev-tickets-2026-04-30.md, homepage-seo-brief-2026-04-30.md, r15-r18 batch audits, priority-meta-drafts-2026-04-30.md, may-retainer-week1-staging-2026-04-30.md*

---

## Addendum — Blog Post Meta Drafts (added 2026-04-30)

32 blog post meta descriptions are now ready-to-input in:
**`blog-meta-drafts-2026-04-30.md`**

- All 32 metas ≤155 chars, first-person voice, keyword signal
- 4 posts with confirmed custom metas (R17) are excluded — do NOT overwrite
- Input via same mechanism as P1-M1/M2/M3 (RankMath or existing override)
- After input: do internal linking pass on Cluster 1 + Cluster 3 posts (P2-BL2)
