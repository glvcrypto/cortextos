# Deploy Reliability Surface — PHP Lint + Expanded Structural Marker Smoke Gate + WP Runtime Error Body Scan

## Current Approach

Before pushing any code:
1. Review diff manually
2. **Run PHP lint gate on all changed .php files:**
   ```bash
   git diff --name-only HEAD | grep '\.php$' | xargs -I{} php -l {} 2>&1
   # Block push if any file returns non-zero exit
   ```
3. **Run structural marker smoke test — 6 URLs covering all major template types:**
   ```bash
   # For any push touching .php template files or .css files, run against staging/preview URL:
   SMOKE_URLS=(
     "https://reyco.glvmarketing.ca/"
     "https://reyco.glvmarketing.ca/products/"
     "https://reyco.glvmarketing.ca/services/"
     "https://reyco.glvmarketing.ca/?p=368"
     "https://reyco.glvmarketing.ca/service/marine/"
     "https://reyco.glvmarketing.ca/product-category/outboard-motors/"
   )
   REQUIRED_MARKERS=(".site-header" ".site-footer" "main.site-main" "nav.site-nav")
   for url in "${SMOKE_URLS[@]}"; do
     html=$(curl -s "$url")
     for marker in "${REQUIRED_MARKERS[@]}"; do
       if ! echo "$html" | grep -q "$marker"; then
         echo "FAIL: $marker missing from $url" && exit 1
       fi
     done
   done
   echo "Structural marker check: PASS"
   ```
   New URLs added (vs prior experiment):
   - `/?p=368` — representative single product page (single-product.php template)
   - `/service/marine/` — service detail page (service-detail.php template)
   - `/product-category/outboard-motors/` — category archive (archive-product.php template)

4. **Run WP runtime error body scan — same 6 URLs, scan response bodies for error strings:**
   ```bash
   WP_ERROR_PATTERNS=("Fatal error" "Parse error" "There has been a critical error" "Call to undefined" "Call to a member function" "class not found" "wp-die")
   for url in "${SMOKE_URLS[@]}"; do
     html=$(curl -s "$url")
     for pattern in "${WP_ERROR_PATTERNS[@]}"; do
       if echo "$html" | grep -qi "$pattern"; then
         echo "FAIL: WP runtime error '$pattern' found in $url" && exit 1
       fi
     done
   done
   echo "WP runtime error scan: PASS"
   ```
   Catches: PHP fatals/notices that WP renders into styled error pages (which PASS the structural marker check but signal a broken deploy). Historical class: the 2026-04-22 seeding failures, undefined method calls, WP hook issues — all runtime, not syntax.

5. Run HTTP smoke test: curl 14 key URLs, check HTTP 200 + no PHP error strings in body
6. Check CI output after GitHub Actions push

## Hypothesis Being Tested

Three consecutive gate-layer keeps: php -l (syntax), structural markers (layout), expanded URLs (template breadth). The remaining unaddressed failure class is WP runtime errors. WP renders fatal/undefined-function errors into styled pages that include site-header, site-footer, main.site-main, nav.site-nav — so these PASS the structural marker check while signaling a broken site. A body error-string scan on the same 6 URLs after the marker check targets this exact gap. Historical basis: 7 failures on 2026-04-22 were all runtime class (seeding, undefined method calls, missing hooks) — php -l did not and cannot catch these.

## Known gaps
- php -l catches syntax errors only, not logic errors or missing function calls
- Structural marker + error scan requires live staging URL (SG Dynamic Cache may serve stale HTML on first hit post-commit)
- Error string patterns are English-only; WP fatal templates in other locales would not match (not applicable for Reyco Marine — en-CA)
