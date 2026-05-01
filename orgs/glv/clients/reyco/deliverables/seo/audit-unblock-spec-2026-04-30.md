# Reyco Marine — Audit Unblock: Dev Sprint Spec
**Prepared:** 2026-04-30 by seo agent  
**Purpose:** Unblock the 586 remaining pages that cannot be audited via WSL (SiteGround WAF blocks WSL source IP).  
**Scope:** 374 WC product pages + 35 blog posts (HTML) + 177 WC product_category archive pages  
**Foundation:** Extends systemic-dev-tickets-2026-04-30.md — same 8-point checklist, new data acquisition path  

---

## Why WSL Is Blocked

The SiteGround WAF rate-limits or blocks curl/wget requests from the WSL IP range. The 103 HTML files already audited were fetched before the WAF tightened. Fresh fetches from WSL return 403 or challenge pages, not valid HTML.

**Known bypass:** GitHub Actions IPs bypass the SiteGround WAF (confirmed during GHA deploy workflow testing). SSH into the SiteGround box also has no WAF (local request).

---

## Two-Tier Approach

### Tier 1 — WC REST API (quick win, no dev sprint needed)

For the 374 WC product pages, partial SEO data is available RIGHT NOW via the existing WC REST credentials (`ck_78ae...` — rotate post-launch per P2-I1 in punch list).

**What the REST API gives:**

| SEO check | REST field | Coverage |
|-----------|-----------|---------|
| Meta title | `name` (product title = H1 = default meta title in most WC themes) | ~100% |
| Meta description | `meta_data` key `rank_math_description` or `_yoast_wpseo_metadesc` | Only if SEO plugin stores to post_meta |
| H1 | `name` (same as title in WC page template) | ~100% |
| Product category | `categories[].name` | ~100% (carousel routing verification) |
| Image alt text | `images[0].alt` | ~100% |
| Short description | `short_description` | ~100% |
| Slug | `slug` | ~100% |

**What it does NOT give:** H2 count, schema blocks, canonical tag, internal link count, empty carousel detection — those need HTML.

**REST call pattern (already used in Task #12):**
```bash
BASE="https://reyco.glvmarketing.ca"
CK="ck_78ae..."
CS="cs_..."

# All products — paginate with per_page=100
curl -s "$BASE/wp-json/wc/v3/products?per_page=100&page=1" \
  --user "$CK:$CS" | jq '.[] | {id, slug, name, meta_data, images}'
```

**Action (SEO agent — no dev needed):** Once creds confirmed not rotated yet, run a bulk product REST pull to extract titles, alt text gaps, and meta_data SEO keys for all 374 products. This closes the meta-title and image-alt audit for WC products without any HTML.

**Timeline:** 1–2 hours SEO agent work. Can run now.

---

### Tier 2 — Full HTML Export (dev sprint, unblocks all 586 pages)

For the complete 8-point audit (H2s, schema, canonicals, internal links, empty carousels), dev needs to export HTML for all 586 pages. Two implementation options:

---

#### Option A — GitHub Actions Scrape Workflow (Recommended)

Add a one-shot manual GHA workflow that fetches all URLs and uploads HTML as a build artifact. GHA IPs are not blocked by the SiteGround WAF.

**Dev effort:** ~1 hour (write workflow, run once, share artifact link)

**Workflow spec (`reyco-marine/.github/workflows/html-export.yml`):**

```yaml
name: HTML Audit Export

on:
  workflow_dispatch:
    inputs:
      url_list:
        description: 'Path to URL list CSV in repo (default: seo-audit/urls.csv)'
        default: 'seo-audit/urls.csv'

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Fetch all pages
        run: |
          mkdir -p audit-html
          BASE="https://reyco.glvmarketing.ca"
          while IFS=',' read -r slug url rest; do
            [[ "$slug" == "slug" ]] && continue  # skip header
            [[ -z "$url" ]] && continue
            safe=$(echo "$slug" | tr '/' '_' | tr -d ' ')
            echo "Fetching: $url"
            curl -s -L \
              -A "Mozilla/5.0 (compatible; GLVAudit/1.0)" \
              --max-time 15 \
              "$url" > "audit-html/${safe}.html" || echo "FAILED: $url"
          done < "${{ github.event.inputs.url_list }}"

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: reyco-html-export-${{ github.run_id }}
          path: audit-html/
          retention-days: 7
```

**URL list file to add to repo (`seo-audit/urls.csv`):**

SEO agent will prepare this file — all 586 page URLs from the url-inventory-2026-04-26.csv filtered to the three remaining page types:
- 374 WC product pages (`/product/...`)
- 35 blog posts (slugs from r18-blog-full-audit-2026-04-30.md)
- 177 WC product_category archive pages (`/reyco-category/...`)

**Format:**
```csv
slug,url,page_type
princecraft-14-ts,https://reyco.glvmarketing.ca/product/princecraft-14-ts/,wc_product
twenty-years-napa,https://reyco.glvmarketing.ca/twenty-years-behind-the-napa-counter-taught-me-everything/,blog_post
reyco-category-princecraft,https://reyco.glvmarketing.ca/reyco-category/princecraft/,wc_category
```

**After artifact is downloaded:** Drop into `/tmp/audit-html/` on WSL. The existing `tools/page-tech-audit.sh` runs against each file without modification. Same output format, same analysis pipeline.

---

#### Option B — SSH Server-Side Scrape (Alternative, no GHA changes)

Use the existing SiteGround SSH access to run curl from inside the server (no WAF, local request).

**Dev effort:** ~30 min (SSH in, run script, tar output, share via sftp or git)

**SSH access:** `ssh -p 18765 -i ~/.ssh/sg-reyco [user]@giowm1155.siteground.biz`

**Script to run on the SiteGround box:**
```bash
#!/bin/bash
BASE="reyco.glvmarketing.ca"
mkdir -p ~/audit-pages

while IFS=',' read -r slug url rest; do
  [[ "$slug" == "slug" ]] && continue
  [[ -z "$url" ]] && continue
  safe=$(echo "$slug" | tr '/' '_' | tr -d ' ')
  curl -s -L \
    -H "Host: $BASE" \
    --max-time 15 \
    "$url" > ~/audit-pages/${safe}.html
  echo "Done: $slug"
done < ~/urls.csv

tar czf ~/reyco-audit-html-$(date +%Y%m%d).tar.gz ~/audit-pages/
echo "Archive ready: ~/reyco-audit-html-$(date +%Y%m%d).tar.gz"
```

Share the tar via `scp` to WSL or push to a private S3/R2 bucket. Extract to `/tmp/` and run `page-tech-audit.sh` as before.

**Why Option A is preferred:** GHA workflow is repeatable (can re-run post-launch for the live domain), version-controlled, and doesn't require SSH access sharing or manual file transfer.

---

## Dev Sprint Ticket

**Title:** `feat: gha-html-audit-export-workflow`  
**Effort:** ~1 hour  
**Branch:** `feat/gha-html-audit-export`  

**Acceptance criteria:**
1. Workflow file exists at `.github/workflows/html-export.yml`
2. URL list CSV exists at `seo-audit/urls.csv` (SEO agent prepares this — see below)
3. Manual trigger (`workflow_dispatch`) runs successfully
4. Artifact `reyco-html-export-{run_id}` contains at least 90% of targeted URLs as `.html` files
5. Each HTML file is > 5KB (empty/error responses rejected)

**SEO agent pre-work (before dev sprint):**
- [x] Prepare `seo-audit/urls.csv` — all 586 URLs from url-inventory-2026-04-26.csv
- [ ] Add to repo on a branch for dev to pull

---

## What the Expanded Audit Covers

Once HTML is available, the audit pipeline (same `page-tech-audit.sh` + analysis) will confirm or extend the 4 systemic dev tickets already filed:

| Finding from 103 pages | Expected pattern at 586 pages |
|------------------------|-------------------------------|
| Blank H1 (71/103 = 69%) | WC product pages: likely H1 = product name (OK); categories: same blank-H1 issue |
| Generic meta (80/103 = 78%) | WC products: metas from Task #12 are live; categories: same generic pattern |
| Empty alt (73/103 = 71%) | WC product images: alt from WC media library; likely same gap rate |
| Empty carousels (19/103 = 18%) | WC category archives: same EMPTY_STATE_FIRES pattern confirmed at scale |

The expanded audit will produce:
- R19 — WC product pages systemic scan (374 products)
- R20 — Blog posts full HTML audit (35 remaining posts)
- R21 — WC product_category archive audit (177 pages)
- Updated systemic-dev-tickets with scale-confirmed numbers

---

## Immediate Next Action (SEO agent — no dev needed)

**Prepare `seo-audit/urls.csv`** from the existing url-inventory-2026-04-26.csv:

1. Filter to the 586 unaudited pages (WC products + blog + WC categories)
2. Add `page_type` column
3. Commit to a branch for dev to pull before running the GHA workflow

This is the only pre-work blocking the GHA workflow from being immediately runnable after dev writes it.

---

*No external actions taken. Internal spec — for dev sprint planning.*  
*Prepared 2026-04-30. Extends systemic-dev-tickets-2026-04-30.md.*
