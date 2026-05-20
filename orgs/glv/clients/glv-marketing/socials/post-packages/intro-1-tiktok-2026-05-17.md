# Post-Ready Package — intro-1 TikTok caption

**Date:** 2026-05-17
**Carousel ID:** intro-1-who-is-glv-2026-05-17-v3
**Channel:** TikTok @glv.marketing
**Format:** TikTok photo carousel (slide images, NOT a reel/video)
**Renders:** `orgs/glv/clients/glv-marketing/socials/remotion/renders/intro-1-who-is-glv-2026-05-16-v3/slide-{01..08}.png` (8 slides, 1080×1080)
**Banked rules applied (7):** No BNS / no Ben Pelta / no agentic-AI-as-work / no career-pivot / no em-dashes / no AI tells / Canadian English

---

## TikTok Caption

```
Most local marketing resets the moment you stop paying. GLV is built differently. Quick intro to who we are, what we do, and why we exist. Northern Ontario marketing agency that builds systems that compound.

#localseo #northernontario #saultstemarie #smallbusiness #marketingtips #digitalmarketing #canadianbusiness
```

**Char count:** ~325 (well under 2,200 TikTok limit, conventional sweet spot)
**Hashtag count:** 7 (within 5-7 per Aiden directive)
**Hook first 100 chars:** "Most local marketing resets the moment you stop paying. GLV is built differently. Quick intro to" → keyword-led for TikTok SEO

---

## Audio Brief

**Aiden manual selection required** — TikTok audio is selected from the in-app library and cannot be set via Blotato API.

**Constraints (banked):**
- Viral trending instrumental OR chill lofi beat
- NO LYRICS (banked rule)
- Tonal match: aspirational + grounded (this is a "founder intro" post)

**Suggested searches in TikTok composer:**
- "lofi cafe" / "lofi study"
- "instrumental hip hop"
- "chill aesthetic"
- "minimal corporate"

Verify track has NO LYRICS before locking. Save selected track ID to manifest for future re-use across the launch sequence.

---

## Geotag

**Sault Ste. Marie, Ontario** — TikTok supports per-post location. Set in TikTok composer after Blotato upload, or via Blotato API location field if supported.

---

## Posting Workflow

**Format spec:** TikTok photo carousel supports up to 35 images per post. We use 8 (same as IG carousel).

**Time slot:** Day 1 (Tue May 19) at 2:00 PM EDT = 18:00 UTC (per boss-revised cadence: IG 9am, FB 11:30am, Threads 12:30pm, TikTok 2pm).

**Blotato platform:** `tiktok`. Account ID: `BLOTATO_TIKTOK_ACCOUNT_ID` from secrets.env.

**TikTok-specific required fields (per Blotato docs):**
- Privacy setting (public/friends/private) — recommend **public**
- Comment control (allow/disable) — recommend **allow**
- Duet control — recommend **allow** (helps with reach)
- Stitch control — recommend **allow**
- Content classification flag — recommend **not promoted content** (organic brand intro)

---

## QC Pre-Ship Grep Gates

```bash
FILE="orgs/glv/clients/glv-marketing/socials/post-packages/intro-1-tiktok-2026-05-17.md"
grep -c "—" "$FILE"     # MUST be 0 — em-dash check
grep -ciE "leverage|elevate|transform|unlock|tapestry|landscape|journey" "$FILE"  # MUST be 0 — AI-tell check
```

Run before scheduling. STOP and flag if either returns non-zero.

---

## Updated
2026-05-17T23:35:00Z (social agent)
