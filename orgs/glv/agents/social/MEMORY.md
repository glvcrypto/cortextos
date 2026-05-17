# Long-Term Memory — social agent

> Anchors that persist across sessions. Read at every session start.

## Role anchors
- Own GLV Marketing brand content + distribution across 8 channels (IG / LinkedIn page + Aiden personal / TikTok / FB page + Aiden personal / YouTube Shorts / Threads / X / GBP).
- 5 core responsibilities: research → analytics → create-and-coordinate → post via Blotato → weekly reports to boss.
- Cadence target: 1 post/day. Weekly mix = 3 carousels + 2 reels + 1 GBP + 1 flex.
- Posting layer: Blotato (`BLOTATO_API_KEY` in `orgs/glv/secrets.env`). Skill: `community/skills/blotato-posting/SKILL.md`.
- Reel pipeline (dev-owned): video-in via Telegram (`reel:` / `#reel`) → whisper.cpp → Claude headline → Remotion compose → Blotato post.

## Brand rules (always, no exceptions)
- NO em-dashes (use periods or commas).
- NO AI tells: avoid leverage / elevate / transform / unlock, tricolons, hedging openers, abstract nouns (tapestry, landscape, journey).
- Canadian English.
- @glv.marketing branding. NEVER use @glvbuilds (discontinued handle).
- Plain English, conversational tone.
- Aiden approval required for ALL client-facing / external posts. Approvals route through boss.

## Design principles (banked from IG research 2026-05-16)
1. Headline-to-body type ratio 3-4x (biggest visual lift per unit of design effort).
2. One background tone + one accent color used max twice per carousel (hook slide + final CTA only). No gradients ever.
3. One idea per slide. Always. Two ideas = a paragraph = no save.
4. Slide counter ("3 / 10") + generous padding (10%+ on all sides).
5. Informational imagery over decorative (UI screenshots, real before/after, founder photo). Never stock photos or Canva icon packs.

## Niche-gap insight (load-bearing)
Local business / GBP carousels are genuinely unclaimed on IG. Joy Hawkins, Darren Shaw, Sterling Sky, Whitespark all live on Twitter/LinkedIn. A GLV account running consistent readable save-worthy GBP carousels has near-zero direct competition on IG in this exact format.

## Coordination map
- **boss** — orchestrator, routes Aiden approvals, my reporting line
- **content** — copy drafts (slide text, captions, reel scripts). Inbox handoff.
- **designer** — visual review + style consistency
- **dev** — Remotion renders, reel pipeline infra
- **scout** — ecosystem + cross-channel research feeds
- **analyst (Jerry)** — performance reviews, theta-wave cycle retrospectives

## Existing assets (audit before Phase 1 posting)
- IG research: `orgs/glv/social/glvbuilds/research/ig-carousel-style-research-2026-05-16.md`
- 4 foundational carousel drafts (2026-05-15, awaiting QC + scheduling): `orgs/glv/social/glvbuilds/drafts/2026-05-15_carousel-*.md`
  - first-client-story (open engagement CTA)
  - gbp-pre-audit-6-checks (⚠️ CHECKLIST CTA — automation flag pending Aiden)
  - gbp-primary-category (open engagement CTA)
  - rank-1-mindset (open engagement CTA)
- 7 rendered slides ready: `orgs/glv/clients/glv-marketing/deliverables/socials/renders/gbp-pre-audit-2026-05-15/`
- Forward content calendar drafted through 2027-06: `orgs/glv/social/glvbuilds/drafts/` (carousel + reel + linkedin + weekly calendar files)

## Posting cadence (banked from blotato-posting skill)

| Day | Time (ET) | Format |
|-----|-----------|--------|
| Tue/Thu | 9–10 AM | Educational carousel |
| Wed | 6–8 PM | CTA / offer carousel |
| Fri | 11 AM | Behind-the-scenes / case study |

Avoid Mondays (low engagement) + weekends unless promoted.

## Out-of-scope (explicit)
- Client GBP posting (Reyco/Titan/Fusion) — separate workstream
- Paid ads — ads agent owns
- Website SEO content — web-copy + seo own
- Press release distribution — content owns
- Reels filming — Aiden films, dev pipeline auto-processes

## Channel priority tiers (banked from scout research 2026-05-16)
- **Tier 1 (heavy invest):** LinkedIn (Aiden personal — 62% reach vs 5% page) + YouTube Shorts (12–24mo search longevity)
- **Tier 2 (consistent):** Instagram (carousel re-serve to partial swipers) + TikTok (40%+ search-first users, Canadian niche gap)
- **Tier 3 (maintain):** Facebook (Reels tab + Groups only — 1.37% page reach is structural) + Threads (IG audience portability)
- **Tier 4 (minimal):** X / Twitter (<100 impressions without Premium) + GBP (always-on transactional)

## Per-channel rules (banked)
- **LinkedIn:** PDF carousel = highest ROI format (6.60% engagement). Never start caption with "I" (penalized). Body external links = 26.5% reach penalty — links go in first comment. Post Tue–Thu 8–12 EDT. Reply to comments within 30min for +64% comments.
- **Instagram:** 1080×1350 (4:5), 7 slides, hook on slide 1 doubles as re-serve trigger for partial swipers (algorithm re-surfaces). 3–5 hashtags at end. First 125 chars = preview hook.
- **TikTok:** 9:16 mandatory, 30–60s sweet spot. First 3 seconds non-negotiable (<3s swipe = view jail). TikTok SEO load-bearing: caption opening clause > on-screen text > audio > hashtags. Stitch > Duet for thought-leadership corrections (35% higher engagement).
- **YouTube Shorts:** Title written as search query (NOT "Tip #1" — write "How to set up GBP in 2025"). 45–60s optimal. Search-indexed for 12–24mo — long-tail lead gen asset.
- **Facebook:** NEVER auto-cross-post from IG (72% reach loss per Agorapulse). Native upload always. Page reach is structural at 1.37% — invest in Groups + Reels-tab.
- **Threads:** 500 char max. Replies-to-replies matter. End in question. IG audience pre-seeds Threads launch.
- **X:** Without Premium, <100 impressions median, link posts 0% engagement. Skip-or-commit decision required.
- **GBP:** NO ranking impact (Sterling Sky 9-wk study). Transactional tone only — opposite of social scroll. 150-char visible hook. Non-stock images = 5.6x more clicks. Seed Q&A proactively. DO NOT connect IG/FB to GBP.

## Cross-post penalties (NEVER violate)
- TikTok watermark on IG / YT (Mosseri-confirmed downrank)
- IG watermark on TikTok
- LinkedIn body external link (26.5% reach loss, 900K post study)
- IG → FB auto cross-post (72% reach loss)
- Meta repeated reposts / minimal-edit content (account-level penalty 2026)
- Connect IG/FB to GBP (replaces native Update posts)

## Strategy doc pointer
- 8-channel posting strategy: `orgs/glv/social/glvbuilds/strategy/8-channel-posting-strategy-2026-05-16.md`
- Includes foundational 5-carousel posting order, per-channel adaptation playbook, hook libraries, 3-week launch cadence, 9 blocking decisions list

## Posture
Balanced now. Ramp to fully autonomous after: foundational 5 carousels shipped + first 7d analytics baseline + Aiden signoff.

## Telegram formatting (Aiden's chat)
- Plain Markdown (not MarkdownV2). Do NOT escape `!`, `.`, `(`, `)`, `-`.
- Avoid `*bold*` — renders as literal asterisks. Use natural prose + emoji.
- Emoji encouraged.

## Cron expressions are LOCAL TIME, not UTC (banked 2026-05-17)
- The cortextOS daemon scheduler interprets cron expressions in org local timezone (America/Toronto for glv).
- `0 8 * * *` fires at 08:00 EDT (= 12:00 UTC), NOT 08:00 UTC.
- Interval-based schedules (`4h`, `6h`) are unaffected — no timezone semantics.
- Banked after I shipped 3 broken cron schedules during onboarding (night-wrap, daily-analytics, weekly-report all 4hr off because I assumed UTC). Caught when night-wrap fired at 02:00 EDT instead of 22:00 EDT. Fixed in-cycle.
- **Always set cron times in target local time** (e.g., 22:00 EDT = `0 22 * * *`, NOT `0 2 * * *`).
