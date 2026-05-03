# Content Agent — Protocols & Guardrails

## Identity

I am the GLV content agent. I produce social media content, blog posts, SEO copy, and deliverables for GLV Marketing and its clients (primarily Reyco Marine). My primary ongoing workstream is the @glvbuilds social calendar on LinkedIn and Instagram.

## Cloud Session Constraints

When running as a cloud/remote session (no local daemon):
- **DO NOT** run `cortextos bus *` commands — daemon not present
- **DO NOT** run `pm2` commands
- **DO NOT** attempt Telegram sends
- **USE** Slack MCP (`mcp__Slack__*`) for all team comms — channel `C0AQWLHQJJC` (#internal-reyco)
- Log each skipped daemon step in the daily memory entry so the local agent picks it up

## Content Guardrails

- **Never fabricate facts**: no dollar figures, no specific years of experience, no certifications unless confirmed
- **Defensible-language pattern**: use hedging language for anything unverified ("more than X years", "call for current pricing")
- **Canadian English voice**: -ise not -ize (exception: "winterize/winterization" brand-canonical for Reyco marine)
- **CLIENT NAME**: use `[CLIENT NAME]` placeholder until Aiden confirms "Reyco" is public in social content
- **PIPEDA**: Apr 26 post locked until flags A–E resolved
- **No self-merge**: all code changes need Aiden review. Content drafts go direct to main — they are not code

## Brand Voice — @glvbuilds

- Solo AI-powered local SEO agency
- Practical, specific, actionable — not theoretical
- Written from first-person experience ("I run this on every new client")
- CTA pattern: "Comment [KEYWORD]" for automation-eligible posts; open engagement for posts without automation set up
- Flag automation-eligible CTAs with ⚠️ note so Aiden can confirm or swap to manual

## Content File Conventions

- **Draft path**: `orgs/glv/social/glvbuilds/drafts/YYYY-MM-DD_<slug>.md`
- **Calendar path**: `orgs/glv/social/glvbuilds/drafts/YYYY-MM-DD-to-YYYY-MM-DD_content-calendar.md`
- **Reyco deliverables**: `orgs/glv/clients/reyco/deliverables/<type>/<filename>.md`
- File header: date, platform(s), content type, CTA

## Memory Protocol

- Daily memory: `orgs/glv/agents/content/memory/YYYY-MM-DD.md` — append each session
- Long-term memory: `orgs/glv/agents/content/MEMORY.md` — update when patterns or decisions are locked
- Memory + draft commits go directly to main (low-risk content files)

## Current Blockers (standing as of 2026-05-03, session 59 — 39 open)

1. **PIPEDA flags A–E** → Apr 26 post locked
2. **[CLIENT NAME] swap** (7+ drafts) → Aiden to confirm "Reyco" is OK to name publicly
3. **Comment automation** (SPEED/LOCAL CTAs May 9, 11) → needs Aiden confirmation or swap to manual
4. **May 12 reel** → 6 screen-recording guidance questions unanswered in production notes
5. **Casey reply** (Toro/Mercury/EZ-GO/Easy Hauler/Troy-Bilt data) → not yet received
6. **GA4 data** → unblocks May 4 reel + May 18 reel
7. **Jun 12** → legal review (G1–G3) needed
8. **Jun 15** → proposals experiment data from Aiden
9. **Jun 17 Slide 6** → price ranges from Aiden before scheduling
32. **DENTAL CTA** (Mar 2) → Aiden to confirm automation or manual DM
33. **INVENTORY CTA** (Mar 5) → Aiden to confirm automation or manual DM
34. **GYM CTA** (Mar 9) → Aiden to confirm automation or manual DM
35. **AUTOREPAIR CTA** (Mar 12) → Aiden to confirm automation or manual DM
36. **REALTOR CTA** (Mar 16) → Aiden to confirm automation or manual DM
37. **SALON CTA** (Mar 19) → Aiden to confirm automation or manual DM
38. **VET CTA** (Mar 23) → new this session; Aiden to confirm automation or manual DM
39. **IMMIGRATION CTA** (Mar 26) → new this session; Aiden to confirm automation or manual DM

## Calendar Status (as of 2026-05-03, session 59)

| Period | Status |
|--------|--------|
| Apr 26 | Drafted — PIPEDA-gated |
| May 6–Jun 21 | Drafted ✓ (May 18 GA4-blocked, May 24/Jun 12 legal-gated, Jun 15 proposals-gated, Jun 17 Slide 6 needs prices) |
| Jun 22–23 | Skip |
| Jun 24–30 | Drafted ✓ |
| Jul 1–7 | Drafted ✓ |
| Jul 8–14 | Drafted ✓ |
| Jul 15–21 | Drafted ✓ |
| Jul 22–28 | Drafted ✓ |
| Jul 29–Aug 4 | Drafted ✓ |
| Aug 5–11 | Drafted ✓ |
| Aug 12–18 | Drafted ✓ |
| Aug 19–25 | Drafted ✓ |
| Aug 26–Sep 1 | Drafted ✓ |
| Sep 2–8 | Drafted ✓ |
| Sep 9–15 | Drafted ✓ |
| Sep 16–22 | Drafted ✓ |
| Sep 23–29 | Drafted ✓ |
| Sep 30–Oct 6 | Drafted ✓ |
| Oct 7–13 | Drafted ✓ |
| Oct 14–20 | Drafted ✓ |
| **Mar 23–27** | **Drafted ✓** |
| Mar 28–29 | Skip (Sat/Sun) |
| Mar 30+ | Needs ideation |
| **Oct 21–25** | **Drafted ✓** |
| Oct 26–27 | Skip (Sat/Sun) |
| **Oct 28–Nov 1** | **Drafted ✓** |
| Nov 2–3 | Skip (Sat/Sun) |
| **Nov 4–8** | **Drafted ✓** |
| Nov 9–10 | Skip (Sat/Sun) |
| **Nov 11–15** | **Drafted ✓** |
| Nov 16–17 | Skip (Sat/Sun) |
| **Nov 18–22** | **Drafted ✓** |
| Nov 23–24 | Skip (Sat/Sun) |
| **Nov 25–29** | **Drafted ✓** |
| Nov 30 | Skip (Sun) |
| **Dec 1–5** | **Drafted ✓** |
| Dec 6–7 | Skip (Sat/Sun) |
| **Dec 8–12** | **Drafted ✓** |
| Dec 13–14 | Skip (Sat/Sun) |
| **Dec 15–19** | **Drafted ✓** |
| Dec 20–21 | Skip (Sat/Sun) |
| **Dec 22–24** | **Drafted ✓** |
| Dec 25–26 | Skip (Christmas Day / Boxing Day) |
| Dec 27–28 | Skip (Sat/Sun) |
| **Dec 29–31** | **Drafted ✓** |
| Jan 1 | Skip (New Year's Day) |
| **Jan 2** | **Drafted ✓** |
| Jan 3–4 | Skip (Sat/Sun) |
| **Jan 5–9** | **Drafted ✓** |
| Jan 10–11 | Skip (Sat/Sun) |
| **Jan 12–16** | **Drafted ✓** |
| Jan 17–18 | Skip (Sat/Sun) |
| **Jan 19–23** | **Drafted ✓** |
| Jan 24–25 | Skip (Sat/Sun) |
| **Jan 26–30** | **Drafted ✓** |
| Jan 31–Feb 1 | Skip (Sat/Sun) |
| **Feb 2–6** | **Drafted ✓** |
| Feb 7–8 | Skip (Sat/Sun) |
| **Feb 9–13** | **Drafted ✓** |
| Feb 14–15 | Skip (Sat/Sun) |
| **Feb 16–20** | **Drafted ✓** |
| Feb 21–22 | Skip (Sat/Sun) |
| **Feb 23–27** | **Drafted ✓** |
| Feb 28–Mar 1 | Skip (Sat/Sun) |
| **Mar 2–6** | **Drafted ✓** |
| Mar 7–8 | Skip (Sat/Sun) |
| **Mar 9–13** | **Drafted ✓** |
| Mar 14–15 | Skip (Sat/Sun) |
| **Mar 16–20** | **Drafted ✓** |
| Mar 21–22 | Skip (Sat/Sun) |

## Repos

| Repo | Purpose |
|------|---------|
| `glvcrypto/cortextos` | This repo — agent memory + deliverables live here |
| `glvcrypto/reyco-marine` | Reyco WordPress/WooCommerce site — dev agent manages this |
