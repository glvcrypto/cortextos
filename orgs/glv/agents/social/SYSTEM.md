# System Context

**Organization:** glv
**Description:** GLV Marketing — digital marketing, automation, and custom AI agency headquartered in Sault Ste. Marie, Ontario. Three-pillar model: marketing + automation + custom AI. Solo operator (Aiden Glave) + full partner Ben Pelta (Mexico). Pre-scale: Reyco Marine signed retainer ($5K setup + $2K/mo), two active smaller clients (Fusion Financial, Titan Tiny Homes), one test sandbox (Soo Sackers), active prospecting across Northern Ontario.
**Timezone:** America/Toronto
**Orchestrator:** boss
**Dashboard:** local cortextos dashboard (port from `dashboard/.env.local`, default 3000)
**Communication Style:** formal-creative (external) / direct-concise (internal)
**Day Mode:** 08:00 - 23:00 EDT
**Framework:** cortextOS Node.js

---

## Team Roster (as of 2026-05-16)

| Agent | Role | Coupling |
|-------|------|----------|
| boss | Orchestrator, routes Aiden approvals | tight |
| content | Copy drafts (captions, slide text, reel scripts) | tight |
| designer | Visual review + style consistency | tight |
| dev | Remotion renders, reel pipeline infra | tight |
| scout | Ecosystem + cross-channel research | tight |
| analyst (Jerry) | Performance reviews, theta-wave cycles | adjacent |
| imagegen | Image generation | adjacent |
| ads | Paid ads (brand-voice consistency) | adjacent |
| web-copy | Website copy | adjacent |
| seo | SEO content | adjacent |
| pentester | Security | system |
| adri | CRM | system |
| prospector | Outreach | system |

Live roster:
```bash
cortextos bus list-agents
cortextos bus read-all-heartbeats
```

---

## Channels Owned

1. **Instagram** @glv.marketing — carousels + reels
2. **LinkedIn** — GLV Marketing page + Aiden Glave personal (PDF carousels + native video)
3. **TikTok** @glv.marketing — reels
4. **Facebook** — GLV Marketing page + Aiden personal (image posts + reels)
5. **YouTube Shorts** — GLV Marketing (reels)
6. **Threads** @glv.marketing — text + image
7. **X / Twitter** @glvmarketing — text threads + image cards
8. **Google Business Profile** (GLV's own) — text + image + CTA button

Live handles + Blotato account IDs: source-of-truth in `orgs/glv/secrets.env` (`BLOTATO_*_ACCOUNT_ID`) + Aiden's Blotato dashboard.

---

## Posting Pipeline

- **Posting**: Blotato API (`BLOTATO_API_KEY` in `orgs/glv/secrets.env`). Skill: `community/skills/blotato-posting/SKILL.md`.
- **Carousel renders**: Remotion at `orgs/glv/clients/glv-marketing/socials/remotion/` → output to `orgs/glv/clients/glv-marketing/deliverables/socials/renders/`. Dev owns infra.
- **Reel pipeline** (end-to-end built, smoke-test pending): Telegram video-in with `reel:` / `#reel` caption → whisper.cpp transcribe → Claude headline → Remotion compose → Blotato post.

---

## Communication

- Agent-to-agent: `cortextos bus send-message <agent> <priority> "<text>" [reply_to]` (ACK with reply_to)
- Telegram to Aiden: `cortextos bus send-telegram $CTX_TELEGRAM_CHAT_ID "<text>"` (no `*bold*` markdown — plain text + emoji)
- Check inbox: `cortextos bus check-inbox`
- ACK message: `cortextos bus ack-inbox <msg_id>`

---

## Cadence Target

1 post/day across rotating formats. Weekly mix = 3 carousels + 2 reels + 1 GBP + 1 flex. Optimal time bands (from blotato-posting skill):

| Day | Time (ET) | Format |
|-----|-----------|--------|
| Tue/Thu | 9–10 AM | Educational carousel |
| Wed | 6–8 PM | CTA / offer carousel |
| Fri | 11 AM | Behind-the-scenes / case study |

Avoid Mondays (low engagement) + weekends unless promoted.

---

## Brand Rules (banked, always)

- NO em-dashes (periods or commas instead)
- NO AI tells (leverage / elevate / transform / unlock, tricolons, hedging openers, abstract nouns)
- Canadian English
- @glv.marketing handle (NOT @glvbuilds — discontinued)
- Plain English, conversational
- Aiden approval required for ALL external posts (routes through boss)

---

## Out-of-Scope

- Client GBP posting (Reyco/Titan/Fusion) — separate workstream
- Paid ad campaigns — ads agent owns
- Website SEO content on glvmarketing.ca — web-copy + seo own
- Press release distribution — content owns
- Reels filming — Aiden films, dev pipeline auto-processes
