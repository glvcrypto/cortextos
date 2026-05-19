# Deep Implementation Plan — Recurring Systems + Dashboard
**Date:** 2026-05-19 00:18 UTC
**Owner:** boss
**Source:** Aiden directive 2026-05-19 00:15 UTC

---

## Part 1: Tonight Execution Audit (close-out before scaling)

| Workstream | State | Action |
|---|---|---|
| Princecraft listing copy (.txt) | ✅ shipped at orgs/glv/clients/reyco/deliverables/products/princecraft-sport-172-max-2026/listing.txt | none |
| Princecraft 13 images 1080×1080 | ✅ shipped (#01 white-padded per Aiden flag) | none |
| Princecraft product page LIVE | ✅ HTTP 200 at reycomarine.com/product/2021-princecraft-sport-172-max/ (probe returns 301 → likely SiteGround canonical, page resolves) | verify in browser |
| Princecraft archive listing | ❌ NOT on fishing-boats archive | wait for PR #244 merge after local-test |
| PR #244 (dynamic count + auto-supplement) | OPEN, MERGEABLE | dogfood pr-test-local.bat once it ships, then merge |
| pr-test-local.bat helper | IN FLIGHT (dev, ~15-20 min ETA) | wait for ship |
| SEO Reyco v2 (corrected competitors) | ✅ 53KB shipped + Slack-posted + Ben tagged | none |
| SEO Titan v2 (live SEMrush + GSC) | ✅ SHIPPED 20:16 EDT, 15KB, Slack-posted (just confirmed via seo signal) | surface to Aiden |
| Per-platform captions (15 JSONs) | ✅ shipped commit 89c75457, all platform-native | schedule via Blotato when Aiden confirms cadence + deletes old posts |
| Per-platform carousel visuals (6 surfaces × 3 intros) | ✅ palette B + logo on slide-09, all variants rendered | ready to fire |
| Social analytics scrape (dashboard freshness) | ❌ STALE since 06:04 EDT | social agent re-dispatched, completion pending |
| IG bio applied (Aiden side) | ✅ done | dashboard will reflect post-scrape |
| Content per-product copy sweep (Reyco) | IN FLIGHT (content, expanded scope to all product pages) | await deliverable at orgs/glv/clients/reyco/deliverables/content/product-copy-sweep-2026-05-18.md |
| Content category-copy sweep | IN FLIGHT, merged into product sweep above | same |
| Reyco competitor research (3 real locals) | ✅ in v2 deliverable | none |
| Threads publishing rules | ✅ banked rule at scout/notes/threads-publishing-rules-2026-05-18.md | none |
| FB local groups research | ✅ scout/notes/fb-local-groups-2026-05-18.md | none |
| FB Page content strategy | ✅ scout/notes/fb-page-content-strategy-2026-05-18.md | none |
| Princecraft expert review (sales-floor voice) | ✅ baked into listing.txt long description | none |

**Tonight's remaining tactical work:**
1. pr-test-local.bat ships → Aiden tests PR #244 → Aiden merges → deploy fires → Sport 172 Max appears on fishing-boats archive
2. Social scrape completes → dashboard reflects new IG bio + post-post analytics
3. Schedule the 15 social posts via Blotato (need Aiden's cadence + delete-of-existing confirm)
4. Surface SEO Titan v2 ship (just landed)

---

## Part 2: Three Recurring Systems Architecture

### System A — Weekly Keyword + Competitor Research (per client)

**Frequency:** Weekly, Monday 8am EDT
**Owner:** SEO agent (Opus, daemon-cron-triggered)
**Clients in scope:** Reyco, Titan, Fusion, GLV-self
**Slack output:** per-client internal channel, @Ben tagged

**Process per client per week:**
1. Pull current SEMrush organic positions (top 500 by traffic)
2. Pull GSC Search Console: top queries + impressions + CTR last 7 days
3. Diff vs last week's snapshot: position deltas, new keywords gained, lost positions
4. Competitor monitor: top 5 competitors' SERP positions on client's top 20 target keywords (changes flagged)
5. Surface findings:
   - P1 movers (positions 1-3, >5 position change either direction)
   - P2 opportunities (positions 4-20 with low difficulty)
   - P3 competitor wins (where competitor jumped + client didn't)
   - Content gaps from new query patterns
6. Output: orgs/glv/clients/{client}/deliverables/seo/weekly-kw-report-{YYYY-MM-DD}.md
7. Slack post #internal-{client} with executive summary + Ben tag

**Dashboard surface:**
- /dashboard/clients/{client}/seo tab: latest weekly report card + chart of top movers + alert badge if competitor lost position client could grab

**Implementation cost:** ~2-3 days dev. Requires: SEMrush API key access, GSC OAuth per client, SQLite snapshot store for week-over-week diff.

---

### System B — Daily GLV Social Content + Engagement Loop

**Frequency:**
- Content generation: daily 6am EDT
- Posting: per ScheduledPost.scheduled_at via Blotato cron (current setup)
- Reply/comment monitoring: every 2h
- Analytics scrape: 2x daily (8am + 8pm EDT)

**Subsystem 1 — Daily content generation**
- Content agent cron pulls scout's research patterns + applies banked rules → drafts 1-3 new platform-native ScheduledPost JSONs for tomorrow
- Output: orgs/glv/clients/glv-marketing/socials/scheduled/{YYYY-MM-DD}/{platform}-{slug}.json (status=draft)
- Aiden reviews via dashboard Queued Posts panel + approves → status flips to scheduled

**Subsystem 2 — Posting**
- Daemon polls scheduled/ dir every minute for posts with scheduled_at within next 5 min + status=scheduled
- Fires via Blotato API per platform native variant (caption + visual + lead-magnet keyword)
- On publish: writes back publicUrl + status=posted to JSON

**Subsystem 3 — Reply/comment monitoring**
- Every 2h cron: poll each connected platform for new comments + DMs on GLV posts
- IG + FB + Threads via Meta Graph API webhook subscriptions (where available) + headless-browser fallback
- LinkedIn via Marketing API
- X via API v2 (rate-limited; consider browser-scrape)
- For each new comment matching a known keyword trigger (e.g. AUDIT, SERVICES, PROCESS): trigger DM via ManyChat (IG+TikTok) OR headless-browser-fire (other platforms)
- Surface flagged interactions to Aiden Telegram if requires human response

**Subsystem 4 — Analytics scrape**
- 2x daily cron: scrape per-platform analytics (followers, post engagement, demographics where exposed)
- Update orgs/glv/clients/glv-marketing/socials/analytics/{platform}-{YYYY-MM-DD}.json
- Dashboard /social tab reads from this for week/month trends + per-post engagement

**Dashboard surface:**
- /dashboard/social already has Queued Posts, Channel Snapshot, Per-Account Analytics, Best Times
- Add: Reply/Comment Inbox panel (incoming engagement needing response, with one-click reply draft)
- Add: 7-day engagement trend chart per platform
- Add: lead-magnet conversion funnel (keyword comment → DM fired → audit booked)

**Implementation cost:** ~5-7 days dev for full loop. Phased:
- Phase 1 (this week): subsystem 1 + 2 (generation + posting). Manual review still required for DMs.
- Phase 2 (next week): subsystem 4 (analytics scrape upgrade).
- Phase 3 (week 3-4): subsystem 3 (reply/comment + DM engine). Meta Graph webhook setup is the main effort.

---

### System C — "Add a Listing" Client-Aware Skill

**New cortextos skill:** `.claude/skills/add-listing/SKILL.md`
**Invocation:** boss or content agent runs when Aiden flags "new listing for {client}"

**Inputs:**
- Client name (Reyco / Titan / Fusion)
- Product info dump (raw text from Aiden + photos)
- Optional: spec sheet, manufacturer URL

**Process:**
1. **Read client product template config** from orgs/glv/clients/{client}/product-template.md (we create this once per client by digesting existing listings)
2. **Read client taxonomy** from orgs/glv/clients/{client}/taxonomy.md (categories, tags, brands, custom attributes like Class/Type/Year — captures Reyco's Class B = Boat etc.)
3. **Read client copy rules** from orgs/glv/clients/{client}/copy-rules.md (Vectra-style narrative for Reyco, professional minimal for Titan, etc.)
4. **Process photos** to client's required dimensions (Reyco = 1080×1080, Titan = TBD)
5. **Draft listing.txt** following template + rules + placeholders for unverified specs
6. **Run client-specific pre-ship gates** (Reyco: 0 em-dashes / no false claims / "more than 60 years" framing only / Lee=service Lynn=parts etc.)
7. **Output bundle:**
   - listing.txt (copy-paste ready)
   - images/ (processed)
   - claims-audit.md (verified vs placeholder)
   - expert-review.md (sales-floor voice baked-in)

**Per-client digestion (one-time setup):**
- Reyco: pull 3-5 existing live listings via curl + extract template patterns → orgs/glv/clients/reyco/product-template.md
- Titan: same for tiny home listings
- Fusion: same for financial product/service pages

**Dashboard surface:**
- /dashboard/clients/{client}/products: list of recent listings + drafts + Aiden-approval queue + bulk-import workflow

**Implementation cost:** ~1 day for skill spec + per-client template digestion. ~0.5 day per new client.

---

## Part 3: Dashboard Integration Plan

**Decision:** extend existing tabs rather than build a new one. Each system gets a panel within the relevant existing tab.

**/dashboard/clients/[client] tab — add panels:**
- "Latest SEO Report" (System A weekly output)
- "Recent Listings" (System C output queue)
- "Pending Approvals" (drafts awaiting Aiden)

**/dashboard/social tab — extend existing panels:**
- "Reply / Comment Inbox" (System B subsystem 3)
- "7-day Engagement Trend"
- "Lead-Magnet Funnel"
- "Posting Queue health" (cron failures, Blotato API errors)

**Backend data path:**
- All deliverables continue to write to orgs/glv/clients/{client}/deliverables/{type}/
- Dashboard reads via existing CTX_ROOT path (symlinked per [[feedback-dashboard-ctx-root-path-split]] fix from yesterday)
- New per-platform engagement data writes to orgs/glv/clients/glv-marketing/socials/analytics/

---

## Part 4: Build Sequence (priority-ordered)

**Week 1 (this week):**
1. Tonight: close out Princecraft listing + PR #244 merge + schedule social posts + Titan v2 surface
2. Tomorrow-Friday: build System B Phase 1 (content gen daily cron + posting cron). Dev + content + designer parallel.
3. End of week: ship System C skill + Reyco product-template digestion

**Week 2:**
1. System A weekly cron live for all 4 client surfaces (Reyco, Titan, Fusion, GLV-self)
2. System B Phase 2 (analytics scrape upgrade + dashboard widget refresh)
3. Per-client product-template digestion (Titan + Fusion)

**Week 3-4:**
1. System B Phase 3 (reply/comment + DM engine — Meta Graph webhooks, ManyChat IG+TikTok wiring, headless-browser fallback for FB/Threads/X/YouTube)
2. Dashboard new panels live (engagement trend, lead-magnet funnel, posting health)
3. SEO weekly cron stabilization + alert tuning

---

## Part 5: Risks + Mitigations

| Risk | Mitigation |
|---|---|
| SEMrush API rate limit when running 4 weekly client pulls | Stagger cron fires across the week (Reyco Mon, Titan Tue, Fusion Wed, GLV Thu) |
| Meta Graph webhook approval (groups_access_member_info, publish_to_groups) | Build with native Meta dev portal app review process; allow 2-3 weeks lead time; manual workflow fallback |
| Daily content generation produces stale/generic posts | Scout's research patterns + banked rules + per-platform per-batch refresh; Aiden approves before fire (no auto-post until Phase 3) |
| Dashboard /social tab becomes too dense | Collapse panels by default, expand on click; add tab-within-tab for engagement/analytics/posting |
| Add-listing skill produces inaccurate claims | Per-client copy-rules.md banks the false-claim audit list (e.g. Reyco: no service-bay claims without Lee/Casey verification); pre-ship gate enforces |
| Client-specific work crowds out GLV-self growth | Allocate Friday for GLV-self only; Mon-Thu for client work |

---

## Part 6: What's NOT covered tonight (next-session items)

- Building the dashboard widgets themselves (frontend work, separate dev sprint)
- Meta Graph App approval process initiation
- Per-client product-template + taxonomy + copy-rules digestion (3 clients × ~30 min each)
- Cron config writes for System A weekly + System B daily + analytics scrape
- Setting up SEMrush + GSC OAuth integrations per client
- Existing crons audit (boss has 8; agent fleet has more — need a fleet-wide cron sanity check)

---

## Decision Points for Aiden

1. **Tonight social post scheduling:** when to fire the 15 posts? Tonight burst (1hr apart starting now) OR tomorrow batch (9am/11am/3pm EDT) OR different stagger?
2. **Build sequence approval:** Week 1 / Week 2 / Week 3-4 phasing OK, or pull anything forward / push back?
3. **Dashboard new panels:** extend existing tabs OR build new /reports tab? My recommendation is extend (less navigation, panels live closer to context).
4. **System A SEMrush + GSC OAuth setup:** need creds per client. Reyco + Titan confirmed available. Need to verify Fusion + GLV-self.
5. **System C client template digestion:** do Reyco first (most active), then Titan + Fusion? Or all 3 in parallel by separate agents?
6. **PDF report request:** which deliverable do you want as PDF tonight — this implementation plan, Reyco SEO v2, Titan SEO v2, or all 3 combined?
