# Morning Brief — Wed 2026-05-20

**Generated:** 12:00 UTC (8am EDT)

---

## TIME-SENSITIVE — TODAY

| Time (EDT) | Time (UTC) | Item |
|---|---|---|
| 1:00 PM | 17:00 | May 20 social post ("Google reviews system") scheduled — **needs your QC before this slot** |

The May 20 batch is genuinely draft-complete (caption + visual, all 5 platforms). If you QC before ~12:30pm EDT it makes the 1pm slot; otherwise I reschedule.

---

## OVERNIGHT WORK (big night)

| Workstream | Status |
|---|---|
| Dashboard /social rebuild — PR #119 (7 UI panels) | MERGED + deployed |
| Dashboard /social PR #120 (channel scrapers, Phase 2 per-post scrapers, Blotato writeback) | MERGED + deployed |
| /social now has 9 live panels: Channel Snapshot, Per-Account Analytics, Queued Posts, Live Posts (cards), Content Pipeline, Content Calendar, Task at Hand, Reel Pipeline, Weekly Rollup | ✓ |
| Live metrics: post-tracker-15m + channel-stats-15m + blotato-writeback-15m crons registered | ✓ live |
| CLIENT.md layer — 10 files (CLIENT.md + CLIENT_STATUS.md × 5 clients) | ✓ built |
| Client Context Protocol baked into knowledge.md (every agent loads client files before client work) | ✓ |
| May 20 content — 5 per-platform drafts + 4 carousel renders (IG/FB/LinkedIn/Threads) + X thread | ✓ caption + visual complete |
| PR #117 + #118 (live IG metrics tracker + extraction fix) | MERGED yesterday |

**Honest caveat:** FB + LinkedIn channel/post scrapers are auth-walled — those dashboard cards show "auth required" placeholder, not fake numbers. Wiring a logged-in scraper session is a small follow-up.

## SYSTEM HEALTH

All 14 agents healthy. Cloud-session agents (ads/designer/imagegen/web-copy) show STALE flags — venue duality, not real staleness. No escalations.

---

## OPEN FOR YOUR ACTION

1. **May 20 content QC** — 5 platform drafts, "Google reviews system" 4-step value post. Caption + visual done. QC → I schedule. (1pm EDT slot.)
2. **[HUMAN] task — GSC duplicate-canonical fix** — glvmarketing.ca + soosackers.com. Dev did all it could without WP admin; 4-step action list in task_1779252041696. Needs: WP admin + GSC report + Rank Math + Cloudflare "Always Use HTTPS" on soosackers apex. SEO hygiene, not urgent.
3. **3 analyst theta-wave approvals queued** — cycle-23/24/25 system_effectiveness experiments. Routine governance — batch approve/reject when convenient.
4. **Dupe-dir consolidation decision** — clients/reyco + clients/reyco-marine, clients/glv + clients/glv-marketing. Deferred from overnight (6 path-refs, needs careful audit). Want me to do it as a daytime task?
5. **Per-client manager agents** — you chose CLIENT.md layer over manager agents (done). The "promote a client to a full manager agent when complex enough" path stays open — Reyco the likely first candidate. No action needed, just flagging.
6. **Reyco PRs #240/#242/#243** — open ~148h, need WP admin + merge. Carry-forward.

## SCOUT OVERNIGHT PROPOSAL

Restart-type reminder fix — add `restart_type` field to the SESSION CONTINUATION harness reminder so `--continue` restarts don't trigger spurious "back online" pings (5 observed in one night). Solid, low-effort. In #overnight-proposals for your approve/modify/reject.

---

## TODAY'S QUEUE PROPOSAL

1. AM: you QC the May 20 content → I schedule for 1pm EDT
2. Daily content cadence — content agent drafts May 21 once May 20 ships (the "auto job" until System B Phase 1 is built)
3. Backgrounded: dashboard FB/LinkedIn auth-scraper follow-up; dir consolidation if you greenlight
4. Carry-forward: Reyco PRs, GSC [HUMAN] task, Titan ad-campaign + WP-migration scoping

## ONE-LINE STATUS

Heavy overnight — full /social dashboard rebuilt (9 panels, live data), CLIENT.md layer shipped for all 5 clients, May 20 content draft-complete with visuals. Everything waiting on you is QC + routine approvals, nothing on fire.
