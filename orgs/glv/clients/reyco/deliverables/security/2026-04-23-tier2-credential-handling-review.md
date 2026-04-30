# Reyco Tier-2 Credential Handling Review — 2 Credentials Bundled

**Auditor:** pentester
**Dispatched:** 2026-04-23 by boss (msg 1776984504957-boss-w6vcx, 1776984848792-boss-a2yvg, 1776984971116-boss-m50iv)
**Scope:** Delivery channel analysis + hardening + falsification for the two credentials dev needs for Reyco pre-launch QC
**Format:** §1 failure modes per channel · §2 rank · §3 hardening · §4 falsification · bundling verdict · unified rotation plan

---

## Credentials in scope

| # | Credential | Consumer | Use case | Scope class |
|---|------------|----------|----------|-------------|
| 1 | **DB snapshot** (mysqldump output + wp-config template) — wp-config direct-to-prod DB creds is fallback only | dev (local WP render) | Visual QC against prod data without touching prod | Full DB read (entire `reyco_db`) |
| 2 | **CI_BOT_WP_APP_PASSWORD** (WP Application Password, per-user, for `ci-bot` account) | designer agent (agent-browser session vault) | Chrome headless authenticates past SiteGround coming-soon gate to render live pages | WP REST API as `ci-bot` role (stated non-admin) |

These are **different scope classes** and must be reasoned about separately. Bundling verdict below.

---

## Credential 1 — DB snapshot (mysqldump) · default

Already reviewed in the 2026-04-23 §1-§4 pass. Carryover summary:

- **Default channel:** mysqldump-snapshot workflow. Snapshot is a point-in-time artifact, not a live credential against prod. After QC: `rm snapshot.sql`. No credential to rotate.
- **Fallback channel:** if dev needs wp-config direct-to-prod DB creds (e.g. snapshot size prohibitive or schema drift during QC window), deliver via **SCP** (Channel 3) from user's workstation to dev box. AES-256 zip + SiteGround File Manager (Channel 1) is acceptable secondary. Bitwarden+Telegram (Channel 2) **REJECTED** for this class — DB creds compromise = total DB access, revocation requires SG admin round-trip.
- **Hardening for fallback:**
  - Dedicated MySQL user: `GRANT SELECT ON reyco_db.* TO 'qc_readonly'@'dev_ip'` — **enforceable control**, not convention.
  - No writes possible at MySQL layer regardless of WP plugin state.
  - Rotation: revoke `qc_readonly` grant on QC sign-off.
- **§4 falsification flag (carried):** "read-only" via WP-plugin disable = convention, not control. `GRANT SELECT` is the enforceable form. This flag is now a standing GUARDRAILS.md rule (see Red Flag Table row added 2026-04-23).

---

## Credential 2 — CI_BOT_WP_APP_PASSWORD · new this pass

### §1 — Failure modes per channel

**Channel 1 (SG File Manager → AES-256 zip → short-lived link → designer bot DM)**
- Hops (trust boundaries): User → SG admin panel → SG file system → public download link → Telegram DM → designer agent
- 5 boundaries.
- Failure modes:
  - (a) Zip algo weak if ZipCrypto used — **only AES-256 acceptable**, must verify zip tool output.
  - (b) SG File Manager requires SG admin session — that credential is higher-privilege than the one being delivered. Asymmetry: using a bigger key to ship a smaller one.
  - (c) Public download link leaks via browser history / email archive / URL referrer.
  - (d) Telegram DM adds hop #5 even though the zip is encrypted — link itself is not the password but is link-to-payload.
- **Latency:** requires user to open SG panel. 5-10 min overhead.
- **Revocation of delivery artifact:** user must delete the hosted zip manually.

**Channel 2 (Bitwarden Send or One-Time Secret → designer bot DM direct)**
- Hops: User → Bitwarden Send (encrypted at-rest, zero-knowledge, one-time view) → Telegram DM (link only) → designer agent opens link → agent-browser session vault
- 4 boundaries.
- Failure modes:
  - (a) Bitwarden/OTS link forwarded before designer views — **mitigated by one-time-view + pre-signal protocol** (see §3).
  - (b) Telegram is **not E2E encrypted** for regular bot DMs — regular Telegram chats use server-side encryption only. However, the link is the payload, not the password. Bitwarden's zero-knowledge architecture means Telegram server compromise alone ≠ credential compromise (attacker would also need to race designer to open the link).
  - (c) **Wrong-bot paste surface** (boss-flagged, 2026-04-23): user's single Telegram inbox shows all GLV bots (designer / dev / pentester / boss / imagegen) with same CHAT_ID 1582763943. User fat-fingers bot target → link arrives at wrong agent. First-opener wins on one-time-view links. Mitigation: designer pre-signal + bot-specific ready-check.
  - (d) Link TTL expiry before designer retrieves → link dead, re-issue required. Annoyance, not failure.
- **Latency:** <60s from user action to designer consumption.
- **Revocation of delivery artifact:** automatic on first view or TTL expiry.

**Channel 3 (SCP from user workstation to designer box)**
- Not applicable to designer agent: agent lives on the same WSL box, no separate host to SCP to. Redundant for this credential class.

### §2 — Rank (for Credential 2 only)

1. **Channel 2 (Bitwarden Send → designer bot DM)** — DEFAULT. Fewest hops, zero-knowledge at rest, one-time-view, automatic artifact expiry, low blast radius matches low-privilege class.
2. **Channel 1 (SG File Manager AES-256 zip)** — FALLBACK. Use if Bitwarden Send unavailable.
3. No other channel.

### Revised Channel 2 verdict vs prior REJECT

Boss correctly asked whether narrower scope rescores the REJECT. **Yes — but conditionally.** Reasoning:

| Property | DB creds (REJECT basis) | WP App Password |
|----------|------------------------|-----------------|
| Blast radius on leak | Full `reyco_db` read (PII, orders, customers) | REST-API as `ci-bot` — **see §4 flag** |
| Revocation speed | SG admin round-trip (10+ min) | WP admin → Users → Application Passwords → revoke (<30s) |
| Revocation cost | New credential needed across all consumers | Zero — `ci-bot` gets new app password next run |
| Rotation automation | Manual, cross-consumer sync required | Per-user, single-consumer, native WP UI |
| Wrong-bot paste recoverability | Catastrophic (exfiltrated DB is permanent) | Revoke before attacker uses it — audit log shows misuse |

Channel 2 is **ACCEPTABLE for WP App Password class** given (a) one-time-view artifact, (b) <30s revocation, (c) low blast radius — **conditional on §3 hardening**. This does NOT reopen Channel 2 for DB creds; that rejection stands.

### §3 — Hardening (Credential 2)

- **Bitwarden Send settings:** TTL ≤ 24h, max views = 1, require passphrase ON (passphrase delivered out-of-band — e.g. Signal, or verbal).
- **Pre-signal protocol:** designer posts "READY TO RECEIVE CI_BOT_APP_PASSWORD" to its own Telegram DM (or bus event) BEFORE user initiates delivery. User delivers only after that ready signal is visible. Mitigates wrong-bot paste race.
- **Passphrase out-of-band:** if Bitwarden Send passphrase is used, it goes via a channel distinct from Telegram (e.g. Signal to user's personal phone, or verbal). Two-factor split prevents single-channel compromise.
- **Consumer lock:** only designer agent uses this credential. If any other agent (dev, pentester, imagegen) needs the same capability, **issue a separate WP App Password per agent**. Do not share.
- **Session vault scope:** designer agent-browser session vault MUST be ephemeral (session-scoped, cleared on agent restart). Verify in designer agent code — see §4.
- **Usage logging:** WP audit log (or plugin equivalent) records REST API calls by `ci-bot` during 7-day window. Pentester sweeps the log post-QC to detect misuse.
- **TTL enforcement:** 7-day max. WP App Password auto-revoked on QC sign-off; no manual grace period.
- **No CLI arg / env export / logfile leak:** dev's note already commits to session-vault-only. Pentester verifies by reading designer agent's credential-loading code before issuance.

### §4 — Falsification (Credential 2)

Every claim in dev's requirements note needs a test before issuance. Unverified claims = rejection.

| # | Claim | Falsifiable test | Who runs it |
|---|-------|------------------|-------------|
| F1 | "`ci-bot` user is non-admin / subscriber-class" | Audit WP user list for `ci-bot`. Confirm role == subscriber (or lower). Confirm capabilities: NO `edit_posts`, NO `manage_options`, NO `edit_users`, NO WooCommerce caps. | pentester, BEFORE app password issuance |
| F2 | "Scope is read-only page rendering, no admin actions" | Capability audit (F1) determines this. Role label alone does NOT. **Read-only via role config is stronger than plugin-disable but still not a credential-level scope** — WP App Passwords inherit the user's full capability set. | pentester |
| F3 | "WP App Password is revocable instantly" | Create test app password. Revoke. Attempt REST API call with revoked password → expect 401. | dev, BEFORE production issuance |
| F4 | "Bitwarden Send is zero-knowledge at rest" | Bitwarden has SOC 2 + third-party audits confirming this. Not user-verifiable but industry-trusted. **Accept as given.** |
| F5 | "Designer agent-browser session vault is ephemeral" | Grep designer agent code for credential persistence. Verify vault lives in `/tmp`, ramdisk, or in-memory — NOT in `~/.designer/` or similar. Confirm clear-on-restart. | pentester, BEFORE app password issuance |
| F6 | "Leak = REST-API read access only, no checkout/order/customer access" | Depends entirely on F1/F2. If `ci-bot` has any WC capability, this claim is false. | pentester, follows from F1 |

**§4 verdict:** F1, F2, F5 are **blockers**. App password must NOT be issued until pentester confirms all three. F3, F6 follow from F1/F2. F4 is industry-accepted.

---

## Bundling verdict (boss Q3)

**Credentials must travel in separate envelopes.** Reasoning:

- Credential 1 (DB snapshot or wp-config) and Credential 2 (WP App Password) are **different scope classes**.
- Their ACCEPTABLE channels do not overlap:
  - Credential 1: mysqldump-snapshot local (default) OR SCP/Channel-1 AES-256 zip (fallback)
  - Credential 2: Bitwarden Send → designer bot DM (default) OR Channel 1 AES-256 zip (fallback)
- Bundling into one envelope would force the weaker-hardening class to the stricter channel or vice versa. Either way = wrong-sized key.
- Also: different consumers (dev vs designer) = different trust boundaries on the receiving end.

**Sequencing recommendation:** Credential 2 (App Password) can ship FIRST since designer QC runs independently of dev snapshot workflow. Dev snapshot follows once designer confirms coming-soon bypass is working.

---

## Unified rotation plan (boss Q4)

Single QC-complete signal triggers both rotations:

| Credential | On QC sign-off | Owner of rotation |
|------------|----------------|-------------------|
| Credential 1 — DB snapshot | `rm` the local snapshot. No rotation needed (point-in-time artifact, not a live credential). | dev |
| Credential 1 fallback — wp-config DB password | Revoke `qc_readonly` grant (or rotate DB password via SG admin if full wp-config delivered). | dev → user (SG admin) |
| Credential 2 — CI_BOT_WP_APP_PASSWORD | Revoke via WP admin → Users → `ci-bot` → Application Passwords → delete. | designer signals, user confirms in WP admin |

**Hard TTL caps (regardless of QC timing):**
- Credential 1 fallback: 48h
- Credential 2: 7 days

**QC-complete signal:** designer posts `qc_complete` event to bus + Telegram to user. Pentester verifies WP audit log shows no post-signal activity from `ci-bot`, then confirms closure to boss.

---

## Deliverables from pentester before issuance (pre-flight)

1. F1/F2 capability audit of `ci-bot` user — report WP role + capability dump to boss.
2. F5 designer agent-browser session vault ephemerality check — read designer code, report.
3. F3 revocation round-trip test — coordinate with dev for test app password.
4. Confirm AES-256 zip tool for Channel 1 fallback (if used).
5. Pre-signal protocol ACK from designer agent (READY-TO-RECEIVE pattern understood).

All five must land before user receives the creds-delivery ask. Boss packages with pentester sign-off in the user-facing message.
