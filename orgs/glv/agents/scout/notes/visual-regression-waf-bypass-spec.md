# Visual Regression CI — Cloudflare WAF Bypass Spec
**Dev | For dev + designer | Apr 27 2026**
**Status: Filed — post-Apr-30 cutover sprint (pending user approval after pentester delta re-audit of v1.2)**

---

## Problem

SiteGround WAF (enforced at Cloudflare layer) blocks all requests from non-SiteGround IP ranges,
including GitHub Actions runners (AWS us-east-1 NAT ranges). This means:

- Playwright/Puppeteer screenshot jobs in GHA fail at the WAF before the page loads
- Headless CDP from WSL also blocked (185.98.x.x WSL NAT)
- Current workaround (`/wp-json/glv/v1/probe` + X-GLV-Secret) returns HTTP status only — no DOM, no screenshots

The result: no automated visual regression CI is possible without a bypass mechanism.

## Design — Option B (primary): Cloudflare WAF Managed Rulesets Skip

Add a Cloudflare WAF custom rule that skips **Managed Rulesets only** (OWASP, CF Specials) when
a trusted secret header is present AND the request originates from a GHA runner IP. Custom rules
(rate-limiting, bot management, IP allowlists) remain active for all traffic including Playwright.

```
Header: X-GLV-Visual-Test: {secret}
CF WAF rule: (header match AND GHA IP match) → Skip Managed Rulesets only
```

This approach:
- Bypasses exactly what blocks Playwright (Managed Rulesets) without weakening custom rule enforcement
- Survives SiteGround server migrations (WAF rule lives in Cloudflare, not SG)
- Theme-agnostic (works for any URL on the domain, not just WP endpoints)
- Secret lives in GitHub Secrets — never in repo

### Cloudflare WAF Rule (one-time setup)

In Cloudflare dashboard → WAF → Custom Rules → Create Rule:
- **Name:** `GHA Visual Test Bypass`
- **Expression (defense-in-depth — BOTH conditions required):**
  ```
  (http.request.headers["x-glv-visual-test"][0] eq "GLV_VISUAL_SECRET_VALUE")
  AND
  (ip.src in $github_actions_ips)
  ```
  Where `$github_actions_ips` is a CF IP List populated from `api.github.com/meta → .actions[]`.
- **Action:** Skip → **Managed Rulesets only** (NOT custom rules — rate-limiting + bot management stay active)
- **Logging:** enabled on all matches

### GHA Playwright Job Config

```yaml
# .github/workflows/visual-regression.yml
- name: Run visual regression
  env:
    GLV_VISUAL_SECRET: ${{ secrets.GLV_VISUAL_SECRET }}
  run: npx playwright test --config=playwright.visual.config.ts
```

```typescript
// playwright.visual.config.ts
export default {
  use: {
    extraHTTPHeaders: {
      'X-GLV-Visual-Test': process.env.GLV_VISUAL_SECRET ?? '',
    },
  },
};
```

All page navigations automatically include the header — no per-test changes needed.

### GitHub Secret

Add `GLV_VISUAL_SECRET` to the reyco-marine GitHub repo secrets. Generate with:
```bash
openssl rand -hex 32
```
**Rotation cadence:** Monthly until alert wiring is confirmed live and producing verified test
signal (see Alert Wiring below) — then transition to quarterly. Default: stay monthly until
operational verification is complete. Rotate immediately on any team member offboarding.

---

## Alert Wiring

Alert wiring is required before the monthly → quarterly rotation gate can open.

**Mechanism: CF Workers + Logpush → Slack**

CF WAF logging (already enabled on the rule) produces structured firewall events. Route these via
Logpush to a Cloudflare Worker that:
1. Filters for matches on the `GHA Visual Test Bypass` rule
2. Checks source IP against the `$github_actions_ips` list
3. Fires a Slack message to `#internal-reyco` on any of three signals:

| Signal | Description | Threshold |
|--------|-------------|-----------|
| Volume | >50 rule-hits/hour from non-GHA IPs | Rate-based |
| First-occurrence | First ever request with `X-GLV-Visual-Test` from a new non-GHA IP | Per-IP |
| Distributed | ≥5 distinct non-GHA IPs with header in a 24h window | Count-based |

Volume is the floor (known attacker script); first-occurrence is the ceiling (single novel IP).
Distributed-test detection catches coordinated probing from multiple exit points.

**Verification gate:** Before monthly → quarterly rotation transition, manually test by sending a
request with the correct header from a non-GHA IP and confirm the first-occurrence alert fires in
`#internal-reyco` within 60 seconds. Document pass/fail in rotation log.

---

## Implementation Plan

### Phase 1 — Option A bridge (30 min, Aiden or dev)
1. Fetch current GHA IP ranges from GitHub meta API
2. Add CF WAF IP allowlist rule for reyco.glvmarketing.ca zone
3. Smoke test: GHA curl to fishing-boats page returns 200

### Phase 2 — Option B permanent (1-2h, dev)
1. Generate secret (`openssl rand -hex 32`)
2. Add CF WAF custom rule with dual condition (expression above) — Cloudflare login required
3. Populate `$github_actions_ips` CF IP List from `api.github.com/meta → .actions[]`
4. Add `GLV_VISUAL_SECRET` to GitHub repo secrets
5. Create `playwright.visual.config.ts` with extraHTTPHeaders
6. Write `visual-regression.yml` GHA workflow:
   - Trigger: PR to master
   - Steps: checkout → install deps → run Playwright visual suite
   - Upload screenshots as GHA artifact on failure
7. Define baseline: first passing run screenshots become golden fixtures
8. Remove Option A IP allowlist rule

### Phase 3 — Alert wiring (1-2h, dev)
1. Configure Logpush on the CF zone to stream firewall events
2. Deploy CF Worker (alert filter + Slack notification logic)
3. Manually trigger first-occurrence signal from non-GHA IP — verify Slack alert fires <60s
4. Document verification pass in rotation log → monthly → quarterly gate opens

### Phase 4 — Screenshot storage (optional v2)
- Store baseline fixtures in a separate `visual-fixtures` branch (no LFS required for <1MB PNGs)
- Or upload to R2 bucket and pull in CI (avoids repo bloat for larger screenshot sets)

---

## Cutover Migration Checklist (post-reycomarine.com domain transfer)

When the domain transfers from staging zone to production zone, WAF rules do NOT transfer
automatically. Execute this checklist BEFORE running any CI on the production zone:

- [ ] Migrate `GHA Visual Test Bypass` WAF rule from source (reyco.glvmarketing.ca) to destination (reycomarine.com) zone
- [ ] Re-populate `$github_actions_ips` CF IP List in the destination zone (list is zone-scoped)
- [ ] Send one test request with the bypass header from a GHA runner; verify HTTP 200 (not WAF block)
- [ ] Verify alert wiring (Logpush → Worker → Slack) follows the zone change — re-deploy Worker to destination zone if needed
- [ ] Verify `GLV_VISUAL_SECRET` in GitHub repo secrets still authenticates against the new zone's rule

Mark each item done with date/agent in this checklist before first CI run on production zone.

---

## Files to Create/Modify

- `.github/workflows/visual-regression.yml` — new GHA workflow
- `playwright.visual.config.ts` — new Playwright config with bypass header
- `tests/visual/` — screenshot test files (one per critical page)
- Cloudflare WAF rule + IP List — dashboard config (not in repo)
- Cloudflare Worker — alert filter + Slack notifier (deploy via Wrangler or dashboard)
- GitHub repo secrets — `GLV_VISUAL_SECRET` (not in repo)

## Pages to Cover (v1 scope)

Priority order based on regression risk:
1. `/boats-and-marine/fishing-boats/` — category with tabs (regression surface)
2. `/boats-and-marine/pontoons/` — second category
3. `/boats-and-marine/outboard-motors/` — control (no subcategories)
4. `/product/{sample-slug}/` — single product detail page
5. `/` — homepage

---

## Security Posture (v1.2)

The IP check forces any attacker to route bypass traffic through their own GHA runner. GHA runner
IPs are shared across all GitHub accounts — any GitHub account can spin up a runner on the same
IP ranges. The IP condition does NOT require infrastructure compromise; it requires the attacker
to be willing to route attack traffic through GHA's logged and rate-limited infrastructure (free
tier, publicly attributable to a GitHub account). Combined with a leaked secret, this raises the
attack cost and creates a logged origin — it does not make bypass impossible for a determined
attacker. Effective risk for this use case (read-only public site): low. The alert wiring
(first-occurrence + distributed signals) provides detection even if the IP check is met.

- `X-GLV-Visual-Test` header is NOT forwarded to SiteGround origin (WAF handles it at CF edge)
- PR #75 design ACKs gate Phase 4 (storage) only — Phases 1–3 can proceed without them
- Condition 4 (Authenticated Origin Pull / origin firewall) routes as independent pentester item,
  does not gate this spec

---

*Spec v1.2 | Dev | Apr 27 2026 — revised per pentester audit (4 conditions applied)*
