# Deploy Reliability Surface — PHP Lint + Expanded Structural Marker Smoke Gate + WP Runtime Error Body Scan + PHP 8.x Compatibility Gate + PHPCompatibility PHPCS (pending)

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

4.5. **Run PHP 8.x compatibility grep gate — scan all changed .php files for removed/deprecated patterns:**
   ```bash
   CHANGED_PHP=$(git diff --name-only HEAD | grep '\.php$')
   if [ -n "$CHANGED_PHP" ]; then
     PHP8_PATTERNS=("each(" "create_function(" "(real)" 'ereg(' 'eregi(' 'split(')
     for file in $CHANGED_PHP; do
       for pattern in "${PHP8_PATTERNS[@]}"; do
         if grep -q "$pattern" "$file"; then
           echo "FAIL: PHP 8.x-incompatible pattern '$pattern' found in $file" && exit 1
         fi
       done
       # Check for old-style constructors (function ClassName with no visibility modifier)
       if grep -Pq '^\s*function\s+[A-Z][A-Za-z0-9_]+\s*\(' "$file"; then
         echo "WARN: possible old-style constructor in $file — verify PHP 8.x compatibility"
       fi
     done
     echo "PHP 8.x compatibility gate: PASS"
   fi
   ```
   Catches: PHP 7.4-removed/deprecated patterns that `php -l` does not flag. Critical context: SiteGround drops PHP 7.4 support on May 20, 2026 — patterns introduced during the migration window will hard-fail post-upgrade.

5. Run HTTP smoke test: curl 14 key URLs, check HTTP 200 + no PHP error strings in body
6. Check CI output after GitHub Actions push

## Hypothesis Being Tested

Three consecutive gate-layer keeps: php -l (syntax), structural markers (layout), expanded URLs (template breadth). The remaining unaddressed failure class is WP runtime errors. WP renders fatal/undefined-function errors into styled pages that include site-header, site-footer, main.site-main, nav.site-nav — so these PASS the structural marker check while signaling a broken site. A body error-string scan on the same 6 URLs after the marker check targets this exact gap. Historical basis: 7 failures on 2026-04-22 were all runtime class (seeding, undefined method calls, missing hooks) — php -l did not and cannot catch these.

## Hypothesis Tested (exp_1777768046_php8g) — KEEP

Four consecutive gate-layer keeps: php -l (syntax), structural markers (layout), expanded URLs (template breadth), WP runtime scan (runtime errors). The unaddressed class entering May 2026 is PHP version incompatibility: patterns legal in PHP 7.4 that are removed/deprecated in PHP 8.x and will hard-fail after SiteGround's PHP upgrade on May 20, 2026. A grep-based scan on changed files before push gates this specific class without requiring phpcs or a full linter install. Surgical, consistent with prior pattern.

**Result:** KEEP — zero PHP deploys in 48h window; gate correctly defined; master branch clean; fifth consecutive keep.

## Hypothesis Being Tested (exp_1777925922_phpc)

Five consecutive gate-layer keeps covering syntax, layout, template breadth, WP runtime errors, and PHP 7.4-removed patterns. The remaining unaddressed failure class is behavioral PHP 8.x changes that are legal in PHP 7.4 but break at runtime under PHP 8.x and are NOT catchable by grep: strict null coercion (null passed to non-nullable params now throws TypeError in PHP 8.0+), dynamic property deprecation (PHP 8.2+), `match` keyword conflicts in variable/function names, and `str_contains`/`str_starts_with` availability (requires PHP 8.0+, not available in 7.4). PHPCompatibility PHPCS standard (`phpcs --standard=PHPCompatibility --runtime-set testVersion 8.1`) performs static analysis for all these patterns and produces per-line ERROR/WARNING output. Gate: block push on ERROR, allow WARNING. Critical context: SiteGround drops PHP 7.4 on May 20, 2026 (16 days). This is the final gate layer before the upgrade window closes.

**Implementation required (local agent, before May 10):**
```bash
composer global require squizlabs/php_codesniffer
composer global require phpcompatibility/php-compatibility
phpcs --config-set installed_paths ~/.composer/vendor/phpcompatibility/php-compatibility/PHPCompatibility
```

**Gate to add as step 4.75 (once phpcs installed):**
```bash
4.75. Run PHPCompatibility PHPCS scan on all changed .php files:
CHANGED_PHP=$(git diff --name-only HEAD | grep '\.php$')
if [ -n "$CHANGED_PHP" ]; then
  phpcs --standard=PHPCompatibility --runtime-set testVersion 8.1 $CHANGED_PHP
  # Block push if exit status non-zero (ERROR level findings)
  if [ $? -ne 0 ]; then
    echo "FAIL: PHPCompatibility PHPCS found PHP 8.x incompatibilities — fix before push"
    exit 1
  fi
  echo "PHPCompatibility gate: PASS"
fi
```

## Known gaps
- php -l catches syntax errors only, not logic errors or missing function calls
- Structural marker + error scan requires live staging URL (SG Dynamic Cache may serve stale HTML on first hit post-commit)
- Error string patterns are English-only; WP fatal templates in other locales would not match (not applicable for Reyco Marine — en-CA)
- PHP 8.x grep gate covers removed/deprecated function calls but not behavioural changes (e.g. strict type coercion, `match` vs `switch` differences, `str_contains` availability)
- PHPCompatibility PHPCS gate (exp_1777925922_phpc) addresses the behavioural-change gap but is PENDING LOCAL IMPLEMENTATION (requires phpcs + PHPCompatibility composer install before May 10)
