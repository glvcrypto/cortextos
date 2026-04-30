# Reyco Tier 1 Live Sweep — Scope Proposal

**Target:** `reyco.glvmarketing.ca` **staging only** (per boss 2026-04-22). Post-launch prod sweep = **separate scope approval**, do NOT auto-extend.
**Auditor:** pentester
**Drafted:** 2026-04-22 · **Boss-approved 2026-04-22** (msg 1776887493795-boss-zphlz) with 3 clarifications baked in below.
**Prerequisites (gate checklist):**
1. [x] Boss approves this scope — **DONE**
2. [ ] Dev posts "seeders complete on staging" in `#internal-reyco` — pending
3. [ ] User-reachable window: **pre-11:00 EDT OR post-15:00 EDT** (NOT during 08:45 doctor or 11:00-15:00 volunteering) — applies through 2026-05-01
4. [ ] Pre-commit §7 hypothesis to `#internal-reyco` BEFORE firing (scientific rigor — separates Tier 1 from "just scanning")

---

## 1. Invariant — Passive-only, idempotent, GET-only

- No write requests (POST / PUT / PATCH / DELETE / XML-RPC multicall).
- No authentication attempts — not even with known bad creds.
- No brute-force, dictionary, or fuzz input.
- No payload that would trigger WAF signatures (no `' OR 1=1`, no `<script>`, no `../`).
- Every request is the same shape a normal unauthenticated visitor would make, using a browser-like User-Agent.
- If any probe returns a 5xx, **stop the entire sweep** and surface to boss before continuing — a 5xx could mean we triggered an unstable state.

Invariant reaffirms `.claude/skills/audit/SKILL.md` Tier 1 definition.

---

## 2. Endpoint list (exact paths, single GET per path)

| # | Path | What we learn | Risk |
|---|------|---------------|------|
| 1 | `/` | HTML parse for plugin / theme / script URLs | none — same as any visitor |
| 2 | `/robots.txt` | Disclosed paths | none |
| 3 | `/sitemap.xml` + `/sitemap_index.xml` | Structure, page count | none |
| 4 | `/xmlrpc.php` | HTTP status — 200 / 403 / 404 / 405 — reveals whether endpoint is blocked at WAF/nginx | none — GET returns static body |
| 5 | `/wp-json/` | Core REST discovery doc | none — public by default |
| 6 | `/wp-json/wp/v2/users` | User enumeration via public REST (CVE-2017-5487 class) — check if list is restricted or open | none — same request any crawler makes |
| 7 | `/?author=1` then `/?author=2` | Author-archive redirect behavior — if redirects to `/author/<slug>/`, leaks admin username | none |
| 8 | `/wp-login.php` | Status + HTML for login-lockdown plugin fingerprint | none — just loads the form |
| 9 | `/wp-admin/` | Redirect behavior — check for unusual whitelist | none |
| 10 | `/readme.html` | WP version disclosure (should 404 on hardened installs) | none |
| 11 | `/wp-content/plugins/` | Directory listing test (should 403) | none |
| 12 | `/wp-content/uploads/` | Directory listing test (should 403) | none |
| 13 | `/wp-json/wc/v3/products` | Unauthenticated WC REST — should return 401 | none |
| 14 | `/wp-json/wc/store/v1/products` | Public storefront REST (added in WC 7.0+) — check scope | none |

**Total requests: 14** single-shot GETs across ~2-3 minutes with 10-second spacing between requests. No concurrency.

## 3. What we do NOT do in Tier 1

- No login attempts (valid or invalid).
- No REST POST / DELETE.
- No XML-RPC `system.multicall` amplification probe.
- No plugin CVE verification (Tier 2, requires version fingerprint → vulnerable-path request).
- No `wp-login.php` rate-limit confirmation (Tier 2 — requires failed-cred submissions).
- No TLS / cert deep probe (that is a separate `testssl.sh` pass, proposed as its own doc).

## 4. Output artifacts

- `deliverables/security/tier1-sweep-<date>.log` — raw curl output (HTTP status + response-headers only; body truncated to first 500 chars unless JSON discovery doc).
- `deliverables/security/tier1-findings-<date>.md` — finding entries in expert+teacher format per SKILL.md Section 3.
- Event: `cortextos bus log-event milestone tier1_sweep_complete info`

## 5. Stop / rollback conditions

- Any 5xx on any probe → stop, surface to boss.
- Any unexpected 200 on `/wp-admin/` without redirect → stop, surface (possible misconfiguration).
- User sends "STOP" via Telegram at any point → abort immediately, log partial results.
- Any WAF-block response (e.g. Cloudflare 1020) → stop, report path + time so user can clear rules if needed.

No rollback needed (all requests are GET / read-only). Worst case if sweep misfires: Reyco host logs show 14 extra GETs from our egress IP. Not destructive.

## 6. Execution plan

```
# Pseudocode — actual run uses curl -sI -A "GLV-pentester/1.0" with per-request logging
for endpoint in endpoints:
    response = curl -sI $target$endpoint --max-time 15
    log(endpoint, status_code, server_header, relevant_body_snippet)
    sleep 10
    if 5xx or WAF_block:
        break
report_findings()
```

Execution window: ~4 minutes (14 reqs × 10s spacing + initial + final).

## 7. Expected findings (hypothesis — will verify)

Based on Tier 0 repo read:
- `/xmlrpc.php` — likely reachable (no WAF/nginx block visible in theme code). Medium finding if 200 + accepting POSTs.
- `/wp-json/wp/v2/users` — possibly returns the Reyco team author list (Casey, Tyler, Aaron) publicly per `functions.php:reyco_seed_team_authors()`. Medium finding — username disclosure.
- `/?author=1` — same user-enum vector. Medium-to-High if admin username is disclosed.
- `/readme.html` — possibly 200 with WP version string. Low finding.
- `/wp-content/plugins/` directory listing — depends on SiteGround's default Apache/nginx config.

None of these are new classes of finding; they are all confirmations or refutations of what the Tier 0 pass suggests is likely.

---

## Approval required before firing

- [ ] Boss signs off on this scope
- [ ] Dev has posted seeder-complete in `#internal-reyco`
- [ ] User is reachable via Telegram during the 4-minute window (not during doctor appt / volunteering)

Boss approval line: "Tier 1 scope APPROVED — proceed" in reply to this doc's send-message.
