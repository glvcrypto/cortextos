# Reyco Marine — GSC Fix Guide via WP REST API

Use `sg-waf-rest-broker.mjs` (Playwright + app-password auth, bypasses SG WAF) to execute
these fixes from Aiden's local machine. No SSH or WP-CLI required.

**Prerequisites:**
- `cd ~/cortextos && node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs` runs without error
- `.glv-wp-app-password` file present at `/home/aiden/cortextos/orgs/glv/clients/reyco/`

---

## Task #23 — Fix noindex (blog_public = 0)

**Symptom:** GSC reporting "Excluded by 'noindex' tag" site-wide — WordPress "Discourage search engines" is enabled.

**Check current state:**
```bash
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/wp/v2/settings
# Look for: "blog_public": 0  (bad) or 1 (already fixed)
```

**Fix (if blog_public is 0):**
```bash
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/wp/v2/settings \
  --method POST \
  --data '{"blog_public": 1}'
# Expect: 200 response with "blog_public": 1 in returned settings
```

**Verify:** Wait ~5 min, then check `https://reycomarine.com/robots.txt` — should no longer contain `Disallow: /`.

---

## Task #24 — Fix 404s

**Symptom:** GSC reporting "Not found (404)" — specific page URLs are returning 404.

**Step 1 — Get the specific URLs from GSC:**
GSC Console → Index → Pages → filter "Not found (404)" → export the URL list.

**Step 2 — Check if Redirection plugin is active:**
```bash
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/redirection/v1/redirect?per_page=5
# 200 = plugin installed; 404 = not installed (use SSH/.htaccess path instead)
```

**Step 3a — Create redirect via Redirection plugin REST API (if installed):**
```bash
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/redirection/v1/redirect \
  --method POST \
  --data '{"url": "/old-page-path/", "action_data": {"url": "/new-page-path/"}, "action_type": "url", "match_type": "url", "status_code": 301}'
```
Repeat for each 404 URL from GSC. Replace `/old-page-path/` and `/new-page-path/` with actual URLs.

**Step 3b — If Redirection not installed:** SSH required to edit `.htaccess` or install plugin.

---

## Task #26 — Fix canonical conflicts

**Symptom:** GSC reporting "Alternate page with proper canonical tag" — pages have conflicting canonicals.

**Step 1 — Inspect current canonical for a specific page:**
```bash
# Check what canonical Yoast is outputting for a specific page URL
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs \
  '/wp-json/yoast/v1/get_head?url=https://reycomarine.com/page-to-check/'
# Look for: "canonical" field in response
```

**Step 2 — List pages Yoast has set as noindex or with canonical overrides:**
```bash
# Get all pages with Yoast SEO meta (requires page IDs — list pages first)
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs '/wp-json/wp/v2/pages?per_page=50&_fields=id,slug,link,yoast_head_json'
```
Look for pages where `yoast_head_json.canonical` ≠ the page's own URL.

**Step 3 — Fix via Yoast REST API (per page):**
```bash
# Replace <page_id> with the WordPress page ID, set canonical to the correct URL
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/wp/v2/pages/<page_id> \
  --method POST \
  --data '{"yoast_head_json": {"canonical": "https://reycomarine.com/correct-canonical/"}}'
# Note: Yoast REST write path may differ — verify with GET first
```

> **Note:** Yoast SEO's REST write API varies by version. If POST to `/wp-json/wp/v2/pages/<id>` with yoast fields doesn't work, WP-CLI is the fallback: `wp yoast meta set <id> page _yoast_wpseo_canonical <url>`

---

## Task #28 — Disavow file (DONE)

Google email confirmed May 12: file contains 0 URLs + 120 domains. Accepted. **Close this task.**

---

## Quick-reference: Inspect any WP REST API endpoint

```bash
# List all registered REST routes
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/

# Get all Yoast SEO options
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs /wp-json/yoast/v1/configuration

# List recent posts (check index state)
node orgs/glv/clients/reyco/tools/sg-waf-rest-broker.mjs '/wp-json/wp/v2/posts?per_page=5&status=any'
```
