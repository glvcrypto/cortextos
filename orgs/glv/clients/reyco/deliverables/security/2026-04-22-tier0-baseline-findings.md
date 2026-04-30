# Reyco Marine — Tier 0 Pre-Launch Security Findings

**Auditor:** pentester (GLV security agent)
**Audit tier:** Tier 0 (static repo read, no live traffic)
**Repo:** `glvcrypto/reyco-marine` @ local clone `c:/Users/joshu/Desktop/Agentic Workspace/reyco-marine/` (branch `master`)
**Audit window:** 2026-04-22
**Launch target:** 2026-04-26 (T-4 days)
**Status:** DRAFT — pending boss review before routing to `#internal-reyco`

---

## Executive summary

8 findings in the Reyco WordPress theme repo. **Two CRITICAL secrets require rotation before launch** regardless of any other remediation work. Two HIGH findings center on financial-application data handling and raise PIPEDA exposure. The remaining Medium/Low items are hardening recommendations that can be scheduled post-launch.

The team is clearly security-conscious in the application-layer code: nonce checks, input sanitization, timing-safe token comparison, user-enumeration defenses. The vulnerabilities concentrate in two places: (1) how secrets are stored (source code + local .git config) and (2) how financial PII is persisted and transmitted.

| Sev | Count | Blocker for launch? |
|-----|-------|---------------------|
| Critical | 2 | **Yes — rotate credentials** |
| High | 2 | Yes for #3 (PIPEDA) — flag before launch |
| Medium | 2 | No — post-launch sprint |
| Low | 2 | No — backlog |

---

## CRITICAL

### F-1. Hardcoded Lightspeed DMS API credentials in theme source

**File:** `wp-content/themes/reyco-marine/inc/lightspeed-sync.php:25-26`
**Commits:** `1c3662a`, `08518f9` (both on `master`)
**Credential:** Lightspeed CMF `800769` / API key `514397A3-9491-4B0B-B28E-F6C501391CDA`

**Expert**
The theme ships with default Lightspeed Data Services API credentials inlined as PHP string literals. They are read by `get_option()` → `add_option()` on `after_switch_theme` + `init`, so on first activation they are copied into `wp_options`. The comment on line 16 says "stored in wp_options so credentials stay out of code" — but the default values on lines 25-26 *are* the code. Anyone with read access to the repo (including any future GLV team member, contractor, or GitHub compromise) has them. The key grants full read access to Reyco's dealer inventory + pricing via the Lightspeed DMS API (`https://int.lightspeeddataservices.com/lsapi/Unit/800769`).

The GitHub repo `glvcrypto/reyco-marine` appears to be private (unauthenticated HTTPS GET returns 404), which limits blast radius — but history contamination means rotating the `wp_options` value alone is not sufficient. The key must be rotated at Lightspeed AND scrubbed (or accepted-and-documented) in git history.

**Teacher (for Aiden)**
"Hardcoded credentials" is one of the most reported classes of security bugs — so reported, it has its own CWE entry and consistently appears on the OWASP Top 10 under "Security Misconfiguration." The pattern *looks* fine at write-time ("I'll just put a default here so the plugin boots") but it survives in `git log` forever. Even a private repo leaks if a laptop is stolen, a contractor's GitHub account is compromised, or the repo visibility is accidentally flipped. The standard fix for WordPress is to read from `wp-config.php` (outside the web root's `index.php`-served tree if possible) via `define('REYCO_LS_PASSWORD', '...')` and `if (defined('REYCO_LS_PASSWORD')) $password = REYCO_LS_PASSWORD;`.

**Refs**
- CWE-798: https://cwe.mitre.org/data/definitions/798.html
- CWE-540: https://cwe.mitre.org/data/definitions/540.html
- OWASP A05:2021 Security Misconfiguration: https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

**Recommendation**
1. Contact Lightspeed support, request API key rotation.
2. Edit `lightspeed-sync.php:25-26` — replace the literal values with empty strings (forcing admins to set them via the WP admin UI).
3. Short-term: accept git-history contamination since the repo is private.
4. Long-term: move credential storage to `wp-config.php` via `define()`.

---

### F-2. Financial application PII stored plaintext in `wp_options`

**File:** `wp-content/themes/reyco-marine/inc/financing-apply-handler.php:139-150`
**Row:** `wp_options.option_value` where `option_name = 'reyco_financing_applications'`

**Expert**
The `reyco_financing_apply_handler()` function captures a 30-field financing application — first/last name, DOB, email, mobile, street address, city, province, postal code, housing status, time at address, employment status, employer, job title, annual income, monthly payment goal, trade-in details, bankruptcy/consumer-proposal history, co-applicant data, consent timestamp — and appends the full record (plus IP + user agent) to a PHP-serialized array stored in `wp_options`. There is no encryption at rest, no field-level tokenization, no retention policy, and no access audit. Any WP admin, any backup tool, any `wp_options` dump via WP-CLI / phpMyAdmin / Site Health reads the entire history of financing applicants in plaintext.

Even in a reputable host (SiteGround), DB dumps hit backup rotations, support-ticket file-shares, and occasionally developer laptops. A financing application is among the highest-sensitivity data sets Reyco will ever collect — annual income, SIN-adjacent identifiers, and consumer-credit flags.

**Teacher (for Aiden)**
PIPEDA Principle 7 ("Safeguards") requires that personal information be "protected by security safeguards appropriate to the sensitivity of the information." Plaintext storage of financial identifiers in a WordPress `options` table is nowhere near that bar. The practical bar for financial PII in Canada is: encrypt at rest, scope access via role-based controls, log reads, retain only as long as necessary for the business purpose. The code as-written does none of that. In a PIPEDA complaint, the OPC would look at (1) was the storage necessary? (the handler already emails the data — storage is redundant) and (2) was it safeguarded? The answer to (1) is "no" and the answer to (2) is "no."

**Refs**
- CWE-312: https://cwe.mitre.org/data/definitions/312.html
- OWASP A02:2021 Cryptographic Failures: https://owasp.org/Top10/A02_2021-Cryptographic_Failures/
- PIPEDA Principle 7 (s4.7 Schedule 1): https://laws-lois.justice.gc.ca/eng/acts/P-8.6/FullText.html

**Recommendation**
1. Immediate: remove lines 139-150 from `financing-apply-handler.php`. Rely on email delivery only (see F-3 for fixes there).
2. Audit existing `wp_options.reyco_financing_applications` — delete any rows captured during development / seeding.
3. Long-term: migrate to Supabase with row-level security (pattern already established in `crm-integration-plan.md` → `portal_leads`). Encrypt sensitive columns at the column level, retention policy 90 days.

---

## HIGH

### F-3. Financial application emailed to personal Gmail + CC'd to third-party NAPA Canada

**File:** `wp-content/themes/reyco-marine/inc/financing-apply-handler.php:129,133`

**Expert**
The handler sends the full financial application to `parts.reycomarine@gmail.com` (personal Gmail, not on a Reyco-owned mail domain with managed MX/DMARC/retention) with a hard-coded `'Cc: ccouture@napacanada.com'`. No TLS enforcement on outbound `wp_mail()`, no DKIM on the Gmail path, no data-sharing notice in the form about NAPA Canada receiving the data.

Two concrete problems:
1. **Gmail as primary recipient:** Reyco does not control the mailbox lifecycle. If the employee leaves, email history walks out the door. Gmail has default 30-day trash retention but full account content is retained indefinitely until deleted. This is not a defensible "reasonable safeguard" under PIPEDA.
2. **Undisclosed third-party disclosure:** The form UI shown on the `financing-apply.php` page template mentions "Santander, DealerTrack, and several other Canadian lenders" in hero copy but does not disclose NAPA Canada specifically, and does not obtain explicit consent to share with them. PIPEDA Principle 3 requires knowledge-and-consent; Principle 5 requires limiting use to what consent covered.

**Teacher (for Aiden)**
A common anti-pattern in small-business WordPress: form submissions sent to a `@gmail.com` alias that "the owner can get at from their phone." That works for a contact-us form. It does not work for a financing application, because the data on that form is regulated. A simple rule of thumb: if the form asks for a date of birth OR income OR credit history, the destination must be a managed mailbox on a domain the business owns, ideally with server-side retention limits and access logs.

NAPA Canada CC'd on every submission might be perfectly legitimate (NAPA runs a dealer lending program, maybe this is the pre-approval pipe) but it must be *disclosed in the form copy* and the user must explicitly consent before hitting Submit. Silent forwarding to a third party is the exact fact pattern PIPEDA Principle 3 was written to address.

**Refs**
- PIPEDA Principle 3 (Consent): https://laws-lois.justice.gc.ca/eng/acts/P-8.6/FullText.html
- PIPEDA Principle 5 (Limiting Use/Disclosure)
- CWE-319 (Cleartext Transmission) — applies if wp_mail relays without STARTTLS: https://cwe.mitre.org/data/definitions/319.html

**Recommendation**
1. Replace `parts.reycomarine@gmail.com` with a Reyco-domain mailbox (e.g. `finance@reycomarine.com`) on a managed host.
2. Confirm with Casey whether the NAPA Canada CC is authorized by a written data-sharing agreement. If yes, add a disclosure line to the form ("Your application will be shared with NAPA Canada and our lending partners for approval"). If no, remove the CC.
3. Configure `wp_mail` to enforce TLS (e.g. via WP Mail SMTP plugin with STARTTLS required).

---

### F-4. GitHub PAT embedded in local git remote URL

**File:** `.git/config` in local clone at `c:/Users/joshu/Desktop/Agentic Workspace/reyco-marine/`
**Token:** `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` (user `glvcrypto`)

**Expert**
The `origin` remote in the local clone stores the GitHub personal access token directly in the URL: `https://glvcrypto:gho_xxx@github.com/glvcrypto/reyco-marine.git`. This is a common side effect of `git clone` with a token in the URL, and it persists in `.git/config` on the dev machine. While `.git/config` is never pushed to GitHub, it is readable by any process running as the user — malware, backup tools, cloud-sync clients (OneDrive/Dropbox), even some IDEs that index repo metadata. It also leaks into stderr/log output on some git operations, and into any tool that runs `git remote -v`.

The token prefix `gho_` indicates a GitHub OAuth token (from `gh auth login` or similar), which typically has broader scope than a personal fine-grained PAT.

**Teacher (for Aiden)**
GitHub has been pushing users away from tokens-in-URL for years. The safer pattern is (a) SSH remotes — `git@github.com:glvcrypto/reyco-marine.git` with an SSH key, or (b) git's credential helper — on Windows, "Git Credential Manager" stores tokens in the Windows Credential Vault instead of plaintext. The `gh` CLI + `gh auth login` flow automatically configures one of these patterns. The moment you see `https://user:token@github.com/...` in a `.git/config`, it's a rotation-required finding.

**Refs**
- CWE-798: https://cwe.mitre.org/data/definitions/798.html
- GitHub docs on token storage: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

**Recommendation**
1. Rotate the PAT in GitHub → Settings → Developer settings → Personal access tokens.
2. Remove it from `.git/config` (change remote to SSH or use credential helper).
3. Pattern this same check across all GLV local clones (cortextos, glv-mission-control, glvmarketing.ca, life-os).

---

## MEDIUM

### F-5. Unsanitized SVG uploads enabled

**File:** `wp-content/themes/reyco-marine/functions.php:141-145`

**Expert**
`reyco_svg_mime_types()` adds `svg` / `image/svg+xml` to the `upload_mimes` filter with no sanitization. SVG is XML that can embed `<script>` tags, `on*` event handlers, and external entity references. An attacker who can authenticate as any user with `upload_files` capability (Editor / Author roles — and with WooCommerce installed, Shop Manager) can upload `<svg><script>alert(document.cookie)</script></svg>` as a product image. When an admin previews the media library or the image is embedded inline, the script executes in an admin session cookie context → account takeover.

This is not a hypothetical. `safe-svg` and `svg-sanitizer` exist as WordPress plugins specifically because of this issue. WordPress Core deliberately does not allow SVG by default for this reason.

**Teacher (for Aiden)**
SVG looks like "just an image" but it's actually an executable document. Modern browsers will execute embedded JavaScript in an SVG when the SVG is rendered inline (as in `<img>` it's sandboxed, but as `<object>`, in background-image, or opened directly in a new tab, the scripts run). A good mental model: treat SVG uploads the same as HTML uploads — never accept from untrusted users without sanitization.

**Refs**
- CWE-434: https://cwe.mitre.org/data/definitions/434.html
- CWE-79: https://cwe.mitre.org/data/definitions/79.html
- OWASP A03:2021 Injection: https://owasp.org/Top10/A03_2021-Injection/

**Recommendation**
- Simplest fix: restrict SVG upload to admins only — add `if (!current_user_can('manage_options')) unset($mimes['svg']);` logic.
- Better: install `safe-svg` plugin; it strips `<script>` and `on*` attributes on upload.

---

### F-6. No rate limit / CAPTCHA on anonymous financing form

**File:** `wp-content/themes/reyco-marine/inc/financing-apply-handler.php` (whole file)

**Expert**
The form has a nonce (good — blocks CSRF) and sanitizes inputs, but any visitor can pull a fresh nonce from `financing-apply.php` and submit unlimited applications. There's no reCAPTCHA, no Turnstile, no honeypot, no transient-based per-IP throttle. An attacker can flood `wp_options` + Casey's Gmail inbox with garbage financial applications at line speed. Also relevant once F-2 is fixed: the form becomes a spam-email-amplification vector via `wp_mail`.

**Teacher (for Aiden)**
Nonces and input validation protect against a specific set of attacks (CSRF, injection). They don't protect against *volume* — a legitimate-looking request made 10,000 times. Rate-limiting is a separate defense layer. For anonymous forms, the usual toolkit is (1) reCAPTCHA v3 / Cloudflare Turnstile (passive fraud-score based), (2) server-side transient per IP ("max 3 submissions / hour"), (3) honeypot field (hidden input that bots fill in but humans don't — reject on non-empty).

**Refs**
- CWE-770: https://cwe.mitre.org/data/definitions/770.html
- OWASP A04:2021 Insecure Design: https://owasp.org/Top10/A04_2021-Insecure_Design/

**Recommendation**
- Add Cloudflare Turnstile to the form (free, no cookie consent issues under GDPR/PIPEDA).
- Add a server-side transient: `get_transient("reyco_fin_{$ip}")` — if set, reject; else `set_transient(..., true, HOUR_IN_SECONDS / 3)`.

---

## LOW

### F-7. No rate limit on `/wp-json/reyco/v1/lightspeed-sync` token endpoint

**File:** `wp-content/themes/reyco-marine/inc/lightspeed-remote-trigger.php`

**Expert**
Auth is well-hardened: `hash_equals()` for timing-safe comparison (line 47), `wp_generate_password(32, false, false)` for token generation (32 alphanumeric chars ≈ 128-bit entropy). Brute-forcing the token is computationally infeasible. However, there's no lockout after failed attempts, so an attacker can spray attempts at line speed and generate noise in the logs indefinitely. CWE-307 applies in theory; the token entropy makes this a non-issue in practice.

**Teacher (for Aiden)**
A common pattern in security reviews: the finding is technically valid but the practical impact is low because another control compensates. Noting it anyway is useful because (a) it documents the assumption (the token *must* stay 32 random chars — if someone shortens it to 8, this finding becomes critical) and (b) it nudges defense-in-depth.

**Refs**
- CWE-307: https://cwe.mitre.org/data/definitions/307.html

**Recommendation**
Optional: add transient-based IP lockout after 10 failed token attempts within 5 minutes.

---

### F-8. No failed-auth logging on Lightspeed remote trigger

**File:** `wp-content/themes/reyco-marine/inc/lightspeed-remote-trigger.php:45,48`

**Expert**
When the token check fails, the handler returns `WP_Error` with a 401/403 but doesn't call `error_log()`, doesn't update a `wp_options` counter, doesn't emit a fail2ban-compatible log line. If someone does start probing this endpoint, Reyco has no detection signal.

**Teacher (for Aiden)**
Insufficient logging is one of the "boring" security categories — no one gets excited about it in a pen test, but it's on the OWASP Top 10 (A09:2021) because 100% of post-breach forensics rely on logs. The rule of thumb: log auth failures, privileged actions, and data access. Don't log the token itself (that defeats the point).

**Refs**
- CWE-778: https://cwe.mitre.org/data/definitions/778.html
- OWASP A09:2021 Security Logging and Monitoring Failures: https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/

**Recommendation**
Add `error_log(sprintf('Reyco LS token auth failed: IP=%s', $_SERVER['REMOTE_ADDR']))` in the 401/403 branches.

---

## Positive observations (not findings — reinforce these patterns)

1. **User-enumeration defense in `notify-me.php:89-91`** — returns success for duplicate submissions instead of "already registered", so an attacker cannot enumerate known customer emails. Textbook good practice.
2. **Timing-safe token comparison** in `lightspeed-remote-trigger.php:47` — `hash_equals()` instead of `===` prevents timing-oracle attacks. Consistent with what you'd see in an audited framework.
3. **Nonce + sanitize + email validation stack** in `financing-apply-handler.php` — `wp_verify_nonce`, `sanitize_text_field`, `sanitize_email`, `is_email`, explicit consent checkbox gate. The application-layer code is solid; the issues are in storage/transport.
4. **UTM tracking code** (`utm-tracking.php`) — all inputs run through `sanitize_title` server-side, `esc_attr` on output, JSON parse wrapped in try/catch client-side. Clean.

---

## Scope of this pass

**Covered (Tier 0, static read):**
- Theme inc/: `lightspeed-remote-trigger.php`, `lightspeed-sync.php`, `financing-apply-handler.php`, `notify-me.php`, `utm-tracking.php`, `woocommerce-compat.php`, `functions.php`
- Theme page-template: `financing-apply.php` (hero + form structure)
- Git state: remote URL inspection, history grep for hardcoded secret
- Config: `.gitignore` sanity check

**Deferred to Tier 1 (live env after dev signals seeder completion in `#internal-reyco`):**
- `/wp-json/wp/v2/users` user-enumeration probe (passive GET)
- `/xmlrpc.php` reachability (passive GET for 200/301/403/404 status)
- `/?author=1` redirect to check author-archive user disclosure
- Plugin enumeration via homepage HTML grep (`<link>` / `<script>` refs under `/wp-content/plugins/`)
- `wp-login.php` rate-limit plugin fingerprint (passive detect only)

**Deferred to Tier 2 (explicit user approval required per `.claude/skills/audit/SKILL.md`):**
- Active probing of `wp-login.php` rate-limit response (requires failed-cred submissions)
- WPScan / Patchstack CVE cross-reference once plugin versions are observed

**Not in scope for this pass:**
- Supabase RLS review on `portal_leads` table (pending migration sign-off in `crm-integration-plan.md`)
- Live TLS / header review (Tier 1)
- seed-products-*.php files (product seed data, not security surface)

---

## Next steps

1. **Rotate credentials** (F-1 Lightspeed key, F-4 GitHub PAT) — do this before any remediation PR lands.
2. Boss routes this draft to `#internal-reyco` after review.
3. Fix blockers (F-1, F-2, F-3) before 2026-04-26 launch.
4. Tier 1 live sweep runs after dev signals seeder completion.
