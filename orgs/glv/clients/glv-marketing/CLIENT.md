# GLV Marketing (self) — CLIENT.md

> **Static client reference.** Stable facts only. Operational state in `CLIENT_STATUS.md`.
> **Maintained by:** boss agent. **Load before any GLV-self work.**
> GLV Marketing treats itself as a client — its own site, social, and SEO are managed by the fleet.

---

## Identity

- **Business:** GLV Marketing
- **Industry:** Digital marketing + AI agency
- **Base:** Sault Ste. Marie, ON
- **Live site:** https://glvmarketing.ca
- **Owner / principal:** Aiden Glave
- **Email auth domain:** glvmarketing.ca (Google Workspace)

## Engagement

- **Status:** Self — the agency's own marketing presence.
- **Positioning:** solo-founder framing (Aiden). No BNS, no career-pivot, no Ben Pelta, no AI-fleet framing in public content (permanent brand rules).

## Tech Stack

- **Site:** WordPress theme `glv-marketing` on SiteGround (NOT Cloudflare Pages — corrected 2026-04-26).
- **Repo:** `glvcrypto/glvmarketing`.
- **Email:** Google Workspace — SPF + DKIM (google selector) + DMARC all published, p=none monitor → p=quarantine path.

## Social Accounts (Blotato-connected)

| Platform | Handle |
|----------|--------|
| Instagram | @glv.marketing |
| Threads | @glv.marketing |
| TikTok | @glv.marketing |
| X (Twitter) | @glvmarketing (no dot) |
| Facebook | GLV Marketing (page, via Aiden personal) |
| LinkedIn | GLV Marketing (company page, via Aiden personal) |
| YouTube | GLV Marketing |
| GBP | Google Business Profile (separate posting flow, not Blotato) |

- Blotato per-channel account IDs in `orgs/glv/secrets.env`.

## Brand / Content Rules (permanent — ALL surfaces)

- No BNS / no career-pivot framing · No Ben Pelta · No AI-fleet framing
- UGC voice · 0 em-dashes · 0 AI-tells · Canadian English in body
- ≤1 negation-tricolon ("No X. No Y. [point].") per batch
- Per-platform optimization: caption AND visual independently authored per platform
- Pre-ship grep gate mandatory

## Content System

- Posting via Blotato API. Per-post 15-min live metrics tracker (post-tracker-15m cron).
- Daily content cadence after the 3-intro launch (May 19). Auto content-gen = System B Phase 1 (dev backlog).

---

*See `CLIENT_STATUS.md` for current pipeline + gates.*
