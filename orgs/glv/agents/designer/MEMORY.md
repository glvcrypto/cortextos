# Long-Term Memory

## Role Definition
Visual QA gate for the GLV Marketing fleet. I observe, judge, report. Dev implements fixes. User signs off on all visual calls until I graduate to escalate-only (after 3 consecutive uncorrected reviews).

## Client Repo Roster (as of 2026-04-23)
All repos under GitHub org `glvcrypto`:

| Client | Repo | Production site | Notes |
|---|---|---|---|
| Reyco Marine | `glvcrypto/reyco-marine` (private) | reyco.glvmarketing.ca (staging) → reycomarine.com (future) | Coming-soon WP, basic-auth in .env. Launch Apr 26 = top priority |
| GLV Marketing | `glvcrypto/glvmarketing` | glvmarketing.ca + glv.marketing (dashboard) | |
| Fusion Financial | `glvcrypto/fusionfinancial` | fusionfinancialssm.com | |
| Titan Tiny Homes | `glvcrypto/titantinyhomes` | titantinyhomes.ca | |
| Soo Sackers | `glvcrypto/soosackers` | soosackers.com | Test sandbox |

**Excluded:** STR8 Bets (not a GLV client project).

## Per-Repo Gating Architecture
How I see PR branches to screenshot (log each repo's pattern as it's resolved):

- **Reyco (pre-launch):** Pattern (b) — branch preview / staging URL. reyco.glvmarketing.ca IS the staging env until launch.
- **GLV Marketing:** TBD — resolve with dev on first PR
- **Fusion:** TBD
- **Titan:** TBD
- **Soo Sackers:** TBD

Patterns available:
- (a) local clone + serve PR branch locally → screenshot
- (b) branch-specific preview URL (tunnel/staging) → hit that URL
- (c) post-merge QC with fast-revert if broken (reactive, client-site-risky)

## PR Notification Plan
- **Primary:** dev agent pings me via agent-to-agent on every PR-open + branch-push. Format: "PR [url] opened, visual QC needed on [affected pages]"
- **Secondary:** user Telegram visual complaint
- **Fallback (deferred):** 10-min GH API poll — activate only if dev push-signal proves unreliable

## Blockers (as of 2026-04-23)
- GitHub API polling will need a PAT with repo scope in .env. Not needed yet (dev-push is primary).
- gh CLI is installed as user `glvcrypto` but WSL has no libsecret daemon — OAuth keyring unusable. PAT workaround planned.
- ~~Chromium system libs~~ — RESOLVED via Windows Chrome interop (see below). Never needed sudo.

## Browser Tool Decision (2026-04-23)
**Standard: Windows Chrome via WSL interop** (the pattern dev has been using).

Path: `/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`

Headless screenshot example (validated, works without any Linux lib install):
```bash
WIN_OUT='C:\Users\joshu\AppData\Local\Temp\shot.png'
WSL_OUT='/mnt/c/Users/joshu/AppData/Local/Temp/shot.png'
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless --disable-gpu \
  --screenshot="$WIN_OUT" \
  --window-size=1440,900 \
  https://example.com
# Read result from $WSL_OUT in WSL
```

**For interactive flows (click, fill, snapshot):** launch Windows Chrome with `--remote-debugging-port=9222` and connect agent-browser via `agent-browser connect http://localhost:9222`. agent-browser v0.26.0 stays the fleet tool for automation logic; the runtime browser is Windows Chrome.

**Tool split convention (set by dev 2026-04-23):**
- Raw `chrome.exe --headless --screenshot` for ONE-SHOT public-page screenshots (no auth)
- `agent-browser` with sessions for ANYTHING requiring auth (credentials live in vault, never CLI args / shell history / process list)
- NEVER embed credentials in URLs (basic-auth URL shortcut) — vault path only

**Standard screenshot temp dir:** `C:\Users\joshu\AppData\Local\Temp\glv-screenshots\` (Windows path) / `/mnt/c/Users/joshu/AppData/Local/Temp/glv-screenshots/` (WSL read path). Directory exists. --screenshot must use the Windows path since Chrome.exe runs in Windows context and cannot write to /tmp/.

**Reyco coming-soon auth (confirmed by dev 2026-04-23):**
- SiteGround 403s static assets in coming-soon mode (CSS/JS blocked)
- PHP-processed WP page requests pass via WP Application Password auth
- Creds = `CI_BOT_WP_APP_PASSWORD` (app-password for ci-bot user)
- CI pipeline already uses `--user "ci-bot:<app-pass>"` with curl for page checks
- For my headless browser usage: load into agent-browser session vault, NOT URL/env/CLI

**Playwright chromium:** abandoned on this box. The ms-playwright/chromium binary needs Linux libs (libnss3 libnspr4 libasound2 libnssutil3 libsmime3) that aren't installed, and forcing sudo apt for them is unnecessary overhead when Windows Chrome works via interop.

**Why the mistake happened:** I went straight to Playwright's bundled Chromium without checking how the fleet actually takes screenshots on this box. Dev's workflow = Windows Chrome interop = zero install burden. Mental note: ALWAYS check existing patterns in agent-browser / fleet tooling before reaching for a Node.js library install.

## Client Credential Handling (fleet protocol, 2026-04-23)
- Prod DB access = Tier-2 live-data touch
- ALL prod-DB credential asks route through boss → user (NOT dev/designer direct)
- Pentester vets credential-handling path before any prod DB connection (even read-only)
- Dev drafts requirements note to boss (not user): exactly which file, access level, delivery channel, blast radius
- Workflow sequence: dev-requirements → boss-package → pentester-review → user-deliver → designer-receive

## Reyco Local-Serve Architecture (confirmed 2026-04-23)
- Repo = theme-only (tracks `wp-content/themes/reyco-marine/*`, `.github/workflows/`, `crm/`, `docs/`)
- No wp-config.php committed, no .env with DB creds in repo
- Workflow for visual QC: read-only prod DB via out-of-band wp-config from user
- Steps: clone → checkout PR branch → scaffold minimal WP install (WP-CLI or Local) → drop theme into wp-content/themes → wp-config from user → disable any caching/sync plugins → render only, never write
- Risk control: template changes only in PRs we review, no schema migrations touched — read-only queries during render are low-risk

## Autonomy Ladder
- **Now (trust-earning):** every visual call runs past user on Telegram before merge decision
- **Graduation (after 3 consecutive uncorrected reviews):** escalate only ambiguous/risky calls
- **Reset:** user correction at any level resets the counter

## Standing Rules (fleet-wide)
- Never defend a visual from CSS code alone — always screenshot the rendered state first
- Reyco branch rule: all client work via branch+PR, never direct-to-main (ever, including one-liners)
- Send visual assets via Telegram attachment, never paths
- Client screenshots are confidential by default — user Telegram only, never public Slack
- No agent self-approval of user-gated infra actions

## Falsifiable Observation Pre-Flight (boss-set 2026-04-23)
When flagging a site-state observation (e.g., "coming-soon is off"), SEPARATE observation from interpretation. Framing rule: say "I observed X; possible causes are A/B/C; I did not check Y/Z before flagging."

Before asserting a cause/mechanism from a single screenshot, run at least these 4 probes:
1. `curl -v <url>` → inspect response headers (redirects, Cache-Control, any X-* markers, status chain)
2. Cookie state — did the client pick up a bypass cookie? `curl --cookie-jar /tmp/c.txt` + inspect
3. Platform-specific gate probe (WP: `/wp-json/`; Rails: CSRF token page; Next: /api/health) — compare to main path's gate behavior
4. Reproduce from a different vector: user's normal browser / `curl` with clean session / different user-agent

If you can't run these, flag the observation as "UNVERIFIED — needs dev/pentester probe" rather than asserting cause. Anti-pattern: "Either coming-soon was lifted or it's not enforcing on headless" = two asserted mechanisms from CSS-render evidence alone. Correct framing: "Staging is rendering fully styled; that's inconsistent with dev's described coming-soon behavior. Plausible causes include (a) coming-soon lifted, (b) content-swap coming-soon where the swap matches real content, (c) headless request bypassing a gate. I did not run curl headers / cookie inspect / REST probe. Flagging for dev verification."

Applies to ALL visual flags — coming-soon, broken renders, branding drift, regressions. The "what I didn't check" list is the deliverable's falsifiable-observation template.

## Image QC Rubric v1 (for imagegen pilot QC, 2026-04-23)
When reviewing generated product images, score each on 6 axes with pass/flag/fail + one-line rationale:

1. **Product match** — Is this visibly the correct product (boat model / SKU / brand variant)? Compare to reference image if available.
2. **Brand consistency** — Does the rendered product match the brand's established visual identity (colors, trim, logos where visible)? Catch wrong-color paint, misrendered brand decals, logo substitution.
3. **Production-quality / AI-artifact check** — Scan for the usual AI tells: extra limbs, distorted text, warped geometry (non-parallel hulls, impossible reflections), nonsense brand logos, melted metal, inconsistent lighting direction, merged objects.
4. **Context / background appropriateness** — Is background suitable for e-commerce product display (clean, non-distracting, no competing products, no copyrighted third-party content)? Or at minimum appropriate for Reyco's catalogue aesthetic.
5. **Color accuracy** — Does color reproduction match reference (if provided) or brand spec? Flag oversaturation, color cast, blown highlights that lose product detail.
6. **Text / logo legibility** — Any rendered text (brand names, model numbers, spec plates) must be either correctly rendered OR cleanly absent. No garbled fake-text.

Output format per image: `<image-id>: axis1 pass | axis2 flag (rationale) | axis3 pass | ...` then overall `VERDICT: ship / revise / regenerate`.

Ship = all 6 pass. Revise = 1-2 flags, fixable without regen (e.g., crop, color-correct). Regenerate = any fail or 3+ flags.

## WSL2 ephemeral-secrets pattern (pentester-confirmed 2026-04-23)
When scoping a credential to a single process without vault storage:

- **Primary**: stays in Chrome/process memory only (`agent-browser set credentials <user> <pass>`, or env var inline on one invocation, or `read -rs` prompt). No file ever written.
- **Fallback (if file needed)**: write to `/dev/shm/` (tmpfs, 8GB RAM-backed on this box), unlink with plain `rm -f`. Tmpfs has no persistent storage to scrub — unmount wipes by definition.

DO NOT use `/tmp + shred -u` on this box. `/tmp` sits on `/dev/sdd` ext4 inside a WSL2 VHD, and `shred` on ext4-in-VHD does NOT reliably overwrite the underlying NTFS storage blocks — the guarantee it's meant to provide doesn't hold on this platform.

General rule: ephemeral secrets → `/dev/shm`, never `/tmp`, on WSL2.

## Credential handling protocol (F5, pentester-approved 2026-04-23)
Full protocol doc at `SKILLS/credential-handling-protocol.md` (v1.1). Summary of the reusable patterns:
- **Pre-signal with nonce**: before any multi-bot-chat credential delivery, emit a READY-TO-RECEIVE message with an 8-char hex nonce. User replies `RECEIVED <nonce>` as proof they're in the right bot chat. Prevents fat-finger paste into wrong bot (all GLV bots share user chat_id 1582763943).
- **Nonce length = 8 hex**: don't bump to 16; longer nonce = more user misreads = more protocol re-runs = worse posture.
- **Rollback is assume-compromised**: parallel revoke Bitwarden Send + underlying credential, rotate via user (not pentester — pentester has no admin access), fresh protocol.
- **Post-confirm cleanup message**: after credential successfully received, send 🧹 message inviting user to delete Telegram conversation history client-side (bot-side deletion is out of scope — bots lack the permission).
- **Teardown is atomic**: DB drop + filesystem wipe + credential wipe + session wipe + audit log + inline leak verification (exits 2 on any residue) — all in ONE script, `set -uo pipefail` (NOT `-e`, want every step to run).

## File-Size-Identity Heuristic (QA smoke signal, 2026-04-24)
When side-by-side visual diffing is unavailable (no GUI, headless pipeline, batch captures), byte-level PNG size delta is a falsifiable smoke signal for same-template render detection:

- `<1KB` delta on multi-MB PNG captures (e.g., 4 captures all within 1KB on 6.7MB files) = near-pixel-identical render; strong evidence the pages share a template/output path.
- Validated on Reyco post-merge QA sweep 2026-04-24: 4 category pages (/boats-and-marine/, /powersports/, /lawn-and-garden/, /docks-and-lifts/) captured with file sizes 6684321, 6684146, 6684874, 6684127. Flagged as "CONFIRMED regression — same products on every page". Dev root-caused to product-category.php taxonomy term lookup failure (PR #72).
- Use when: batch captures arrive, can't view all side-by-side, need fast triage.
- Don't over-trust: different subject + same lossless encoding can coincidentally land close; a <1KB delta across a single PAIR could be random. Requires a CLUSTER of near-identical sizes across a group to function as a signal.

## Key Collaborators
- **boss** — orchestrator. My escalation path for blockers, roster questions, dev coordination gaps
- **dev** — primary counterpart. I'll message him constantly during active visual work. He sends PRs, I QC them, he implements my proposed fixes, I re-QC
- **imagegen** — will hand me product-photo output for post-gen QC on Reyco product pages (Mercury + Toro + gap-brands)
- **user (Aiden)** — sole approver of merges, design lead, final say on any visual call
