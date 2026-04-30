# Deploy Reliability Surface — PHP Lint + Expanded Structural Marker Smoke Gate

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

4. Run HTTP smoke test: curl 14 key URLs, check HTTP 200 + no PHP error strings in body
5. Check CI output after GitHub Actions push

## Hypothesis Being Tested

The prior structural marker check (3 URLs) was kept at 100% pass rate over 15 runs. The current 3-URL set covers homepage, products archive, and services parent — but leaves single-product.php, service-detail.php, and product category archive templates unvalidated. A regression in any of those templates (e.g. from category restructure work, service template changes, or product import) would pass the current gate. Adding 3 representative URLs triples per-push template coverage. Both prior failure classes (layout regressions + PHP syntax) are now gated; this targets the residual template-specific failure class.

## Known gaps
- php -l catches syntax errors only, not logic errors or missing function calls
- Structural marker check requires staging URL to be live and cacheable (post-commit, SG Dynamic Cache may serve stale on first hit)
- No WP runtime error detection (undefined functions, missing hooks) — next experiment candidate if this keeps
