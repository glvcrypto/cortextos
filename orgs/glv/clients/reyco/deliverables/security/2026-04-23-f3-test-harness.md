# F3 Test Harness — WP App Password Revocation Round-Trip

**Purpose:** empirical validation of F4 falsification claim ("WP Application Password is revocable instantly"). Round 1 dry-run artifact, locked pre-Round-2 consumption.

**Auditor:** pentester
**Drafted:** 2026-04-23 pre-Round-1 (cold-state, per rehearsal-posture pattern)
**Consumers:** pentester (executes), boss (relays cue to user via Round 1 Telegram), designer (standby, no action unless login-state hypothesis escalates)

---

## Prereqs (ALL must clear before harness fires)

1. `sudo apt-get install -y libnspr4` completed on WSL2 host (user action, blocks F3 until done)
2. Dev's CDP validation reports: agent-browser `eval --stdin` primitive works + fetch-with-headers returns full response metadata
3. Round 1 /dev/shm handoff completed per designer protocol §4 — throwaway app password at `/dev/shm/reyco-throwaway-pw` (0600, pentester-readable, tmpfs-only)
4. agent-browser session loaded on reyco.glvmarketing.ca homepage → CF JSD challenge cleared → session cookie jar populated

---

## Step 1 — Pre-revoke test

```bash
# Source throwaway from /dev/shm tmpfs (RAM only, no disk, no env leak path)
B64=$(printf 'ci-bot:%s' "$(</dev/shm/reyco-throwaway-pw)" | base64 -w0)

cat <<EOF | agent-browser eval --stdin > /dev/shm/f3-pre-revoke.json
fetch('/wp-json/wp/v2/users/me', {
  headers: {Authorization: 'Basic ${B64}'},
  credentials: 'same-origin'
}).then(async r => ({
  status: r.status,
  content_type: r.headers.get('content-type'),
  cf_ray: r.headers.get('cf-ray'),
  cf_cache: r.headers.get('cf-cache-status'),
  www_auth: r.headers.get('www-authenticate'),
  body_head: (await r.text()).slice(0, 300),
  ts: new Date().toISOString()
}))
EOF

unset B64
```

### Expected pre-revoke signature

| Field | Value | Signal |
|-------|-------|--------|
| status | 200 | PASS |
| content_type | application/json; charset=UTF-8 | PASS |
| cf_ray | present | request hit CF edge (normal) |
| body_head | `{"id":<n>,"username":"ci-bot",...}` | PASS — auth accepted |
| ts | (captured) | evidence timestamp |

### Pre-revoke failure modes

| Status | content_type | body_head | Diagnosis | Action |
|--------|--------------|-----------|-----------|--------|
| 200 | application/json | ci-bot user JSON | PASS | proceed to Step 2 |
| 202 | text/html | `<html>` / CF challenge markup | CF JSD re-challenge | re-visit homepage in same session + retry Step 1 |
| 401 | application/json | rest_not_logged_in | Throwaway never worked — delivery channel failed | HARD HALT. Revoke throwaway preemptively, abort Round 1, diagnose Bitwarden Send / user entry error |
| 403 | application/json | rest_forbidden | App-pass disabled at WP plugin layer | Check WP settings: Application Passwords feature enabled? ESCALATE to dev |
| 429 | any | any | Rate-limit hit | Back off 60s, retry; if persistent escalate |
| 5xx | any | any | Origin issue | ESCALATE to dev |
| missing cf_ray | — | — | Request didn't reach CF edge | Network anomaly, investigate before re-running |

---

## Step 2 — User revocation cue (via boss Round 1 Telegram)

Pentester posts to bus (agent-to-agent, boss-addressed) after Step 1 PASS:

```
F3 Step 1 CONFIRMED — pre-revoke 200 captured. Evidence at /dev/shm/f3-pre-revoke.json.
CUE BOSS: relay to user — "REVOKE NOW: WP Admin → Users → ci-bot → Application Passwords → delete the throwaway entry. Confirm deletion, then reply REVOKED."
```

User revokes out-of-band. Boss relays user's REVOKED confirmation back to pentester.

**Timing gate:** user MUST wait for cue. Revoking before pre-revoke 200 captured destroys the baseline and forces Round 1 restart with a new throwaway. Cue explicitly includes "wait for signal."

---

## Step 3 — Post-revoke test (same command as Step 1)

```bash
B64=$(printf 'ci-bot:%s' "$(</dev/shm/reyco-throwaway-pw)" | base64 -w0)

cat <<EOF | agent-browser eval --stdin > /dev/shm/f3-post-revoke.json
fetch('/wp-json/wp/v2/users/me', {
  headers: {Authorization: 'Basic ${B64}'},
  credentials: 'same-origin'
}).then(async r => ({
  status: r.status,
  content_type: r.headers.get('content-type'),
  cf_ray: r.headers.get('cf-ray'),
  cf_cache: r.headers.get('cf-cache-status'),
  www_auth: r.headers.get('www-authenticate'),
  body_head: (await r.text()).slice(0, 300),
  ts: new Date().toISOString()
}))
EOF

unset B64
```

### Expected post-revoke signature

| Field | Value | Signal |
|-------|-------|--------|
| status | 401 | PASS — revocation confirmed |
| content_type | application/json | PASS |
| www_auth | Basic realm=... | PASS — WP auth layer responded |
| body_head | `{"code":"rest_not_logged_in",...}` OR `rest_authentication_error` | PASS |
| ts | (captured) | evidence timestamp |

### Post-revoke failure modes

| Status | body_head | Diagnosis | Action |
|--------|-----------|-----------|--------|
| 401 | rest_not_logged_in / rest_authentication_error | PASS — F4 validated | proceed to Step 4 |
| 200 | ci-bot user JSON | **REVOCATION FAILED — CRITICAL** | HARD HALT. Round 2 blocked indefinitely until WP app-password revocation semantics understood. Escalate to boss + user within 5 min. Possible causes: WP plugin intercepting revoke, cache layer serving stale auth, or WP bug. |
| 202 CAPTCHA | `<html>` | Re-challenge | Retry after homepage re-visit |
| Other non-401 | any | Anomaly | Escalate to dev |

---

## Step 4 — Evidence archival + cleanup

```bash
# Archive evidence to durable deliverables path (Reyco repo)
mkdir -p /home/aiden/cortextos/orgs/glv/clients/reyco/deliverables/security/f3-evidence/
cp /dev/shm/f3-pre-revoke.json  /home/aiden/cortextos/orgs/glv/clients/reyco/deliverables/security/f3-evidence/2026-04-23-pre-revoke.json
cp /dev/shm/f3-post-revoke.json /home/aiden/cortextos/orgs/glv/clients/reyco/deliverables/security/f3-evidence/2026-04-23-post-revoke.json

# Wipe tmpfs artifacts (throwaway pw already dead post-revoke, but hygiene)
shred -u /dev/shm/reyco-throwaway-pw 2>/dev/null || rm -f /dev/shm/reyco-throwaway-pw
rm -f /dev/shm/f3-pre-revoke.json /dev/shm/f3-post-revoke.json

# Scrub shell history of the B64 assignment (even though pw is dead)
history -d $(history | tail -n 30 | grep -E 'B64=' | tail -1 | awk '{print $1}') 2>/dev/null || true
history -c && history -w  # nuclear option if selective scrub fails
```

Evidence artifacts contain: status, content-type, CF headers, body-head (200 chars, no PII since `/users/me` response for ci-bot has no email/personal data — confirm this assumption via F1/F2 cap dump output first; if email present, redact before archival).

---

## F3 sign-off message to boss

Template after Step 3 passes:

```
F3 VALIDATION COMPLETE
- Pre-revoke: 200, application/json, ci-bot user JSON body (evidence: f3-evidence/2026-04-23-pre-revoke.json)
- Post-revoke: 401, rest_not_logged_in (evidence: f3-evidence/2026-04-23-post-revoke.json)
- Revocation round-trip: confirmed instantaneous at WP auth layer
- F4 falsification claim: CONFIRMED ENFORCEABLE
- Round 2 GO from pentester side
```

---

## Fallback: option (e) user-runs-curl (if agent-browser path fails)

Only fires if dev's CDP validation reports fetch-with-headers doesn't work in agent-browser.

User runs from home IP (not CAPTCHA-locked, presumably):

```bash
# Pre-revoke
curl -s -o /tmp/f3-pre.json -w "%{http_code}" \
  -u "ci-bot:<THROWAWAY-PW-PASTE-HERE>" \
  https://reycomarine.com/wp-json/wp/v2/users/me
# Expect: 200

# User revokes in WP Admin, confirms, then:

# Post-revoke (same command)
curl -s -o /tmp/f3-post.json -w "%{http_code}" \
  -u "ci-bot:<THROWAWAY-PW-PASTE-HERE>" \
  https://reycomarine.com/wp-json/wp/v2/users/me
# Expect: 401

# User reports BOTH status codes (not bodies) to boss via Telegram screenshot.
# User then: rm -f /tmp/f3-pre.json /tmp/f3-post.json; history -c
```

**Security notes on fallback:**
- User's shell history holds the throwaway pw briefly. Acceptable since pw dies post-revoke.
- `/tmp/f3-*.json` response bodies may contain ci-bot user metadata. User wipes immediately.
- User only reports STATUS CODES, not bodies — minimizes what crosses Telegram.
- Pentester loses direct evidence artifact; trust user-reported codes + accept reduced chain-of-custody. Acceptable downgrade since fallback only fires if primary path is dead.

---

## Changelog

- v1.0 (2026-04-23, pre-Round-1 cold-state draft): initial harness with full failure-mode tables + fallback branch
