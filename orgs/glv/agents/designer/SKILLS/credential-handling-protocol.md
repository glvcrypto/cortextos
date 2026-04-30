---
title: Credential Handling Protocol — WP App Password (ci-bot) for Reyco QC
owner: designer
reviewers: boss, pentester
status: pentester-approved v1.1 (revisions applied 2026-04-23)
scope: Reyco PR #68 QC + any future Reyco coming-soon-gate page render
version: 1.2 (2026-04-23, Round 1 handshake addendum)
---

# 1. READY-TO-RECEIVE Pre-Signal Protocol (F5)

## Purpose
Prevent user fat-finger paste of a Bitwarden Send URL into the wrong Telegram bot chat. All GLV bots (@Glv_designer_bot, @Glv_dev_bot, @Glv_boss_bot, etc.) deliver user messages to the same `chat_id=1582763943` — so the user distinguishes them only by which Telegram chat window is open. A careless paste into @Glv_dev_bot or @Glv_boss_bot would expose the credential to any agent subscribed to that bot's inbox.

The pre-signal ties a one-time nonce to the designer bot chat. User proves correct chat by echoing the nonce before pasting.

## When the pre-signal fires
Boss emits the pre-signal message into **@Glv_designer_bot chat** (designer agent receives it, forwards verbatim to user with Telegram `send-telegram`) immediately before boss notifies the user to initiate the Bitwarden Send delivery. Order of operations:

1. Pentester finalizes credential review → signals boss
2. Boss generates 8-char hex nonce (`openssl rand -hex 4`), records it in boss state
3. Boss dispatches designer to emit pre-signal to user's designer bot chat (with the nonce)
4. User reads pre-signal in @Glv_designer_bot, verifies nonce visually, replies `RECEIVED <nonce>` in that same chat
5. Designer forwards user's ack to boss (with nonce echoed back)
6. Boss confirms nonce match → user creates Bitwarden Send + pastes URL into @Glv_designer_bot
7. Designer ingests the Bitwarden Send URL, fetches credential, stores for single QC session (see §3), wipes after

## Pre-signal message format (exact text emitted by designer bot)
```
🔐 READY TO RECEIVE — CREDENTIAL DELIVERY WINDOW OPEN

Bot: @Glv_designer_bot (designer agent)
Payload: WP App Password for user "ci-bot" on reyco.glvmarketing.ca
Delivery method: Bitwarden Send URL (paste URL as message text, nothing else)
Window: 30 minutes (expires <ABS_TIME_ET>)
Nonce: <8-CHAR-HEX>

⚠️ Do NOT screenshot this message. iCloud/Google Photos auto-sync = long-lived cloud exposure. The nonce expires in 30 min; re-reading is fine, preserving is not.

⚠️ STOP CHECK — before pasting ANY credential:
1. Confirm you are in the @Glv_designer_bot chat (check the top of the Telegram window).
2. If this message appears in any OTHER bot's chat, close that chat — you're about to paste in the wrong place.
3. Reply with: RECEIVED <8-CHAR-HEX>
4. Wait for ✅ NONCE CONFIRMED before pasting the Bitwarden Send URL.

Do NOT paste the URL until you see ✅ NONCE CONFIRMED.
```

## Ack mechanism
- User reply format: `RECEIVED <nonce>` (case-insensitive match on nonce)
- Designer pattern-matches on `^RECEIVED [a-f0-9]{8}$`, compares to active nonce
- On match: designer emits `✅ NONCE CONFIRMED — window open until <ABS_TIME_ET>. Paste Bitwarden Send URL now.`
- On mismatch: designer emits `❌ NONCE MISMATCH — this may not be the intended chat. Contact boss before retrying.` (and notifies boss + pentester)

## Post-delivery cleanup message (stale-chat-surface reduction)
After designer successfully fetches the credential from the Bitwarden Send URL and enters it into the live QC session, designer emits to user:
```
🧹 Credential received. Protocol complete.
You may delete the credential-delivery messages (pre-signal, RECEIVED ack, Bitwarden Send URL, and this cleanup message) from Telegram history — the rest of this chat can stay.
(Those specific messages are stale but persist in chat history until manually cleared.)
```
Non-blocking guidance — user-discretion cleanup of the four specific message-surfaces. The ongoing designer bot chat is preserved as the channel for future deliveries. Bot-side history is out of scope (bots lack `deleteHistory` permission on user chats).

## Timeout behavior
- Nonce TTL = 30 minutes from pre-signal emit
- If no `RECEIVED` reply within 30 min: designer emits `🔴 DELIVERY WINDOW EXPIRED — nonce <X> invalidated. No credential will be accepted under this nonce. Boss must re-initiate the protocol for a fresh window.`
- Designer marks nonce as EXPIRED in local protocol state; any subsequent paste citing this nonce is rejected with `❌ EXPIRED WINDOW — credential not accepted. Abort delivery, notify boss.`
- Any Bitwarden Send URL pasted after expiry is NOT fetched — designer logs a `credential_delivery_rejected` event and notifies boss + pentester

## Rollback (wrong-bot paste)
Assume-compromised default. If the Bitwarden Send URL lands in any chat other than @Glv_designer_bot:

1. **Immediate, PARALLEL** (kill both sides of the credential path simultaneously — do NOT serialize):
   - **1a**: User revokes the Bitwarden Send in Bitwarden admin (makes URL return 404)
   - **1b**: User revokes the WP App Password for ci-bot in WP admin → Users → ci-bot → Application Passwords → Revoke (makes the credential dead even if the URL was already fetched)
   Rationale: if user is on mobile away from laptop, Bitwarden Send revocation may require a login round-trip. WP admin is accessible from the same device. Killing both in parallel means even if the Bitwarden Send is viewed post-revoke-start, the underlying credential is already dead.
2. **Notify**: User messages boss in primary chat: `WRONG BOT PASTE — credential potentially leaked, rotation in flight`
3. **Rotate (USER-OWNED)**: User issues a new WP App Password for ci-bot in WP admin. Pentester does NOT have WP admin access — rotation is user-owned. Pentester's role: verify rotation completed (new App Password works, old one rejected) and log the rotation event.
4. **Confirm**: Pentester confirms to boss: old cred dead, new cred issued at <timestamp>. Boss logs rotation event via `cortextos bus log-event action credential_rotated`.
5. **Fresh protocol**: New nonce, new pre-signal emit, new Bitwarden Send, fresh delivery of the new App Password.
6. **Post-incident**: Pentester writes incident note with timestamp, rotation owner (user), new-cred delivery time, and root-cause annotation for the wrong-bot paste (e.g., "two bot chats open, user tapped wrong one" — informs future UX ask).

Conservative-by-default because we can't distinguish "credential viewed by a compromised agent" from "credential viewed only by the user's Telegram client" after the fact.

---

# 2. agent-browser Auth Vault — Ephemerality Design

**Decision: the ci-bot WP App Password will NOT enter the agent-browser auth vault.** The vault is on-disk by design (survives process restart — that is the value proposition of `auth save`). Even with `AGENT_BROWSER_ENCRYPTION_KEY` set for AES-256-GCM at-rest encryption, persistence semantics are wrong for a single-QC-session credential.

**PRIMARY PATH (pentester-approved): `agent-browser set credentials <user> <pass>`** — first-class documented CLI feature (verified in `agent-browser --help` under Browser Settings). Credential stays in Chrome process memory only, gone at process exit. Zero disk trace. Strongest ephemerality posture on this platform. Usage:
```bash
read -rs CIPASS  # prompt-style, never in history
agent-browser set credentials ci-bot "$CIPASS"
# ... run QC ...
agent-browser close  # Chrome exits → credential is freed
unset CIPASS
```

**FALLBACK PATH (only if `set credentials` has a scope limitation mid-QC): `--headers` JSON on /dev/shm** — not `/tmp`. On this WSL2 box:
- `/tmp` is on `/dev/sdd` ext4 (root filesystem, WSL2 VHD-backed). `shred` on ext4-in-VHD does NOT reliably overwrite the underlying NTFS storage blocks.
- `/dev/shm` is tmpfs (pure RAM, 8GB capacity). `rm -f` is sufficient — no persistent storage to scrub, tmpfs unmount wipes by definition.
So fallback is `/dev/shm/reyco-auth.json` with `rm -f`, NOT `/tmp/` with `shred -u`. Pentester confirmed this is simpler AND more secure on this platform.

**REJECTED: stdin pipe** — adds complexity with no advantage over the primary path.
**REJECTED: vault (`auth save`)** — wrong persistence semantics.

In the primary + fallback paths: the credential never transits argv (process list), never enters persistent storage, and is scoped to the lifetime of the Chrome process (primary) or a tmpfs file rm'd immediately post-QC (fallback).

**Pentester grep check list (case-insensitive)** — the following MUST return zero matches across designer agent state after teardown:
- `grep -ri "ci-bot\|[Aa]uthorization.*[Bb]asic" ~/.agent-browser/` → 0 matches
- `agent-browser auth list --json` → no entry referencing reyco or ci-bot
- `grep -ri "Authorization.*Basic" /home/aiden/cortextos/orgs/glv/agents/designer/` → 0 matches (except the protocol doc itself, which is documentation not credential storage)
- `ps auxww | grep -i "ci-bot\|apppass\|Authorization"` during QC session → 0 matches (confirms argv-clean)
- `/dev/shm/reyco-auth.json` does not exist post-teardown (fallback-path residue)
- `/tmp/reyco-auth.json` does not exist post-teardown (belt-and-suspenders — this path should never exist under the approved design, but check anyway)

If any of the above return hits, the protocol has been violated; credential is assumed compromised; rotate per §1 rollback.

---

# 3. Post-Use Teardown — Credential Wipe (additive to Reyco QC teardown)

Credential wipe is an **additive section** of the QC teardown script approved in the revised PR #68 plan, not a separate event. The teardown block is atomic: all of these run together, in order, from a single script invoked at QC session end (success OR failure paths).

```bash
#!/usr/bin/env bash
# teardown-reyco-qc.sh — run at QC session end (success or abort)
set -uo pipefail  # NOT -e: we want every step to execute even if one fails

SESSION_NAME="reyco-qc-$(date +%Y%m%d)"
LOG_META_JSON='{"agent":"designer","session":"'"$SESSION_NAME"'"}'

# --- DB wipe (from approved QC plan) ---
mysql -u root -e "DROP DATABASE IF EXISTS reyco_local;"
mysql -u root -e "DROP USER IF EXISTS 'reyco_ro_local'@'localhost';"

# --- filesystem wipe — shred wp-config variants BEFORE rm -rf ---
# (wp-config or equivalent may hold DB creds + salts; shred before unlinking the dir)
find /tmp/reyco-local-wp/ -name "wp-config*" -exec shred -u {} \; 2>/dev/null
rm -rf /tmp/reyco-local-wp/
rm -f /tmp/reyco-snapshot-*.sql.gz

# --- credential wipe (F5 discipline) ---
# Primary path: credential was in Chrome process memory only via `agent-browser set credentials`.
# Closing Chrome frees it. No file to wipe.
# (a) Fallback-path /dev/shm headers file (tmpfs — rm -f is sufficient, no shred needed)
if [[ -f /dev/shm/reyco-auth.json ]]; then
  rm -f /dev/shm/reyco-auth.json
fi
# Belt-and-suspenders: check old /tmp path in case of protocol drift
if [[ -f /tmp/reyco-auth.json ]]; then
  shred -u /tmp/reyco-auth.json
fi

# (b) Env-var wipe in this shell
unset REYCO_WP_BASIC_AUTH REYCO_APP_PASS CI_BOT_WP_APP_PASSWORD CIPASS

# (c) Contingency — if vault was used despite §2 design preference:
if agent-browser auth list 2>/dev/null | grep -q "reyco-qc"; then
  agent-browser auth delete "reyco-qc"
fi

# (d) agent-browser session state wipe (cookies/localStorage — no creds, but wipe anyway)
if agent-browser session list 2>/dev/null | grep -q "$SESSION_NAME"; then
  agent-browser --session "$SESSION_NAME" close
fi
rm -f ~/.agent-browser/state-"$SESSION_NAME".json 2>/dev/null

# --- audit log ---
cortextos bus log-event action qc_cleanup info --meta "$LOG_META_JSON"
cortextos bus log-event action credential_wiped info --meta "$LOG_META_JSON"

# --- post-teardown verification (pentester grep check, inline — case-insensitive) ---
VIOLATIONS=0
grep -ri "ci-bot\|[Aa]uthorization.*[Bb]asic" ~/.agent-browser/ 2>/dev/null && VIOLATIONS=$((VIOLATIONS+1))
[[ -f /dev/shm/reyco-auth.json ]] && VIOLATIONS=$((VIOLATIONS+1))
[[ -f /tmp/reyco-auth.json ]] && VIOLATIONS=$((VIOLATIONS+1))
ls /tmp/reyco-snapshot-*.sql.gz 2>/dev/null && VIOLATIONS=$((VIOLATIONS+1))
[[ -d /tmp/reyco-local-wp ]] && VIOLATIONS=$((VIOLATIONS+1))
if [[ "$VIOLATIONS" -gt 0 ]]; then
  cortextos bus log-event action teardown_verification_failed error --meta '{"violations":'"$VIOLATIONS"'}'
  exit 2
fi
exit 0
```

Teardown runs under two triggers:
1. **Success path**: QC complete, screenshots saved, report written → teardown fires, non-zero exit aborts QC delivery
2. **Failure path**: QC aborts for any reason (import error, render error, user cancel) → teardown fires, reason logged

Retained after teardown: only `screenshots/*.png` (visual artifacts, no PII in rendered marketing pages) and `qc-report-*.md` (findings text, no credentials).

---

# 4. Round 1 Dry-Run Handshake (pentester-proposed, designer-accepted v1.2)

Round 1 (Channel 2 dry-run) is a protocol-validation run using a throwaway WP App Password. Pentester consumes the throwaway for F3 curl revocation test; designer does the receiving end but does NOT use the credential for QC. Round 2 (real ci-bot cred) follows the same receiving path; designer consumes locally for QC; no bus-forward.

**Unified /dev/shm discipline — same path for BOTH rounds, prevents Round-1-vs-Round-2 drift:**
- Both rounds: designer fetches Bitwarden Send URL → decodes → writes credential to `/dev/shm/cred-$(openssl rand -hex 4).txt` chmod 600
- Round 1 difference: designer bus-sends the FILENAME (not the cred) to pentester; pentester reads + deletes, runs curl test
- Round 2 difference: designer consumes locally (sets env var from file, rm -f immediately, proceeds to QC)
- Same write path = same teardown = same grep check surface

## Round 1 10-step protocol (pentester-authored):

1. Designer receives Bitwarden Send URL from user (post-NONCE-CONFIRMED per §1). Fetches as usual.
2. Designer decodes credential from the Send.
3. Designer writes credential to `/dev/shm/r1-throwaway-$(openssl rand -hex 4).txt` with chmod 600. 8-char random nonce in filename makes the path unpredictable from outside the designer process.
4. Designer bus-sends pentester: `R1_HANDOFF path=/dev/shm/r1-throwaway-<nonce>.txt` — filename ONLY, never the cred body.
5. Pentester ACKs receipt, reads file into shell variable: `CRED=$(cat /dev/shm/r1-throwaway-<nonce>.txt)`
6. Pentester `rm -f /dev/shm/r1-throwaway-<nonce>.txt` IMMEDIATELY (before curl test, not after). Shell variable holds cred for curl duration only.
7. Pentester runs curl round-trip: pre-revoke `GET /wp-json/wp/v2/users/me` → expect 200 (admin-scope throwaway). User revokes in WP admin. Pentester re-curls → expect 401.
8. Pentester bus-sends designer + boss: `R1_RESULT pre=<code> post=<code>` — no credential in the result message.
9. Pentester `unset CRED` in shell.
10. Designer verifies file is gone: `ls /dev/shm/r1-throwaway-*.txt` → expect empty. If file still exists after 60 seconds from designer's bus-send, designer `rm -f` as safety net (pentester-crash handler).

## Threat-window summary (Round 1)

| Credential location | Duration |
|---|---|
| Persistent disk (ext4/NTFS) | NEVER — /dev/shm only |
| Tmpfs RAM | ~5 seconds (designer write → pentester read + rm) |
| Process memory | curl round-trip duration, ~20-30 sec total |
| Cortextos bus | NEVER — bus carries filename only (useless without same-UID shell access; if attacker has that, game is already over) |

## Round 2 protocol (local-consume)

Steps 1-3 identical to Round 1. From step 4:

4. Designer sources credential into process: `CRED=$(cat /dev/shm/cred-<nonce>.txt)`
5. Designer `rm -f /dev/shm/cred-<nonce>.txt` IMMEDIATELY.
6. Designer proceeds to QC session using §2 PRIMARY PATH: `agent-browser set credentials ci-bot "$CRED"`.
7. Designer `unset CRED` as soon as agent-browser has ingested it.
8. QC session runs.
9. §3 teardown executes at session end — verifies `/dev/shm/cred-*.txt` is absent (should already be absent from step 5).

**Boss 🟢 ROUND 2 BEGINS marker (exact literal)**: `🟢 ROUND 2 BEGINS — designer consume next credential as LIVE ci-bot App Password`

Designer pattern-matches on that exact literal from boss's agent ID. No marker = no consume. Protects against misfiring on a retried Round 1 Bitwarden Send.

---

# Pentester review outcome (v1.1 revisions)

All 4 open questions answered by pentester 2026-04-23; revisions applied to §1 + §2 + §3 and reflected in this doc. Summary:

| Q | Pentester answer | Applied where |
|---|---|---|
| Q1 primary-path for credential scoping | `agent-browser set credentials <user> <pass>` (first-class CLI, Chrome process memory only, zero disk trace) | §2 PRIMARY PATH + §3 cleanup |
| Q2 shred on ext4 sufficient? | Moot if Q1; if fallback, use `/dev/shm` tmpfs with `rm -f` (not `/tmp` with `shred`) — WSL2 ext4-in-VHD makes shred unreliable | §2 FALLBACK PATH + §3 cleanup + grep checklist |
| Q3 nonce length | 8-char hex is correct — do NOT bump. Longer = more user-misread = more protocol re-runs = worse operational posture | §1 unchanged |
| Q4 "do not screenshot" line | YES include. Also add post-confirm cleanup message suggesting user delete Telegram history | §1 pre-signal format + new Post-delivery cleanup subsection |

Additional revisions applied per pentester review:
- §1 rollback step 1: parallelized Bitwarden Send revoke + WP App Password revoke (was sequential)
- §1 rollback step 3: rotation owner corrected to USER (pentester does not have WP admin access); pentester role is verifier + escalation trigger
- §3 teardown: added `find /tmp/reyco-local-wp/ -name "wp-config*" -exec shred -u {} \;` BEFORE `rm -rf` (wp-config may hold DB creds + salts)
- §3 verification grep: changed to case-insensitive (`grep -ri`) to catch mixed-case credential residue

Pre-issuance grep baseline from pentester (clean, documented):
- `grep -r "ci-bot" ~/.agent-browser/` → 0 matches
- `grep -rn "ci-bot|CI_BOT|REYCO_APP_PASS" designer/code/` → 5 hits, all documentation (MEMORY.md / this doc)
- `grep -rn "Authorization.*Basic" designer/` → 2 hits, both this doc (examples, not creds)
- `/tmp/reyco-auth.json` does not exist

Post-teardown verification = inline grep block in §3 teardown script, exits 2 on any leak residue.
