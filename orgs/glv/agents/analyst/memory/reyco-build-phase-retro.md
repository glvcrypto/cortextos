# Reyco Build-Phase Retrospective (Internal)

**Audience:** Aiden + fleet-process learning
**Scope boundary:** Build phase ending at domain cutover 2026-05-02 16:50Z; soak window May 3-5 completed
**Out of scope:** Casey-facing milestone narrative; formal-launch (May 6) content/polish milestones
**Sources:** boss memory 04-21 to 05-06, analyst learnings.md cycles 11-13, approval records (27 resolved during window), heartbeat traces, cycle-12/13/14 banked patterns, MEMORY.md index entries

---

## TL;DR

Build phase shipped the domain cutover clean on schedule (May 2 16:50Z). The hard wins were structural: the pen-tester agent spawned mid-build added a real review layer, the cred-vet protocol (dev → boss → pentester → user) caught credential asks before they hit Aiden, and the page-by-page audit skill codified a pattern that's now reusable for the other client sites. The friction was concentrated in three places: tooling that didn't survive contact with WSL+SiteGround (WAF blocks, OPcache absence, tmux worker-spawn races), discipline drift around scope and gate-bypass that we caught and banked across cycles 11-14, and Aiden as the unavoidable bottleneck for credential vetting + 8 bundle items + 3 corrupted approval records that only filesystem-side work can resolve. The biggest in-flight improvement opportunities are: (a) the post-launch dev playbook items N4+N5 (PHP lint + PR-triggered CI) which would remove pentester-in-loop dependency, (b) the cycle-15 queue of 7 discipline items each side, and (c) the new Frame C "shared-term-fuzziness across agents" candidate that surfaced today as a propagation breach mechanism.

---

## Section 1: Agent-Coordination Wins

### 1.1 Pen-tester agent spawned mid-build (2026-04-22) — added review layer that paid out
Before pen-tester, the dev agent was the lone reviewer of its own security claims. Boss banked on 2026-04-23 that pen-tester validates other agents' security claims (outputs), not just code (inputs) — this turned out to be the right scope. The cred-vet protocol (dev → boss → pentester → user) was banked 2026-04-23 and caught at least one credential ask before it reached Aiden during the build window. Boss noted on 2026-04-27 the worked example "WC REST cred → admin-trigger handler default" where pentester rejected a live-key ask and accepted the admin-trigger PHP handler instead — saved a credential exposure that would have hit Aiden as a yes/no without the safer alternative being surfaced.

### 1.2 Multi-agent dispatch as default (2026-04-25)
Banked as feedback memory: for non-trivial tasks, dispatch ALL agents that could meaningfully contribute, not just the best-fit single-agent. Worked example same day: parallel dev (fix) + pentester (independent review) for tricky code bugs. The compounding effect: by the time domain cutover landed, almost every PR had at least two agents looking at it from different angles before reaching Aiden.

### 1.3 Page-by-page audit skill codified (2026-04-26)
Reyco's 689-page audit was the forcing function. The output got templated into `community/skills/page-by-page-audit` and is reusable for Fusion/Titan/Soo/glvmarketing audits. Without this skill being extracted from the immediate work, the next client audit would have been re-invented from scratch.

### 1.4 WP-CLI access via SiteGround unlocked one-shot ops (2026-04-29)
Pre-04-29, every WP database mutation required either an admin-trigger PHP file (which then needed pentester-vet) or an Aiden-clicks-buttons round trip. Post-04-29 with WP-CLI over SSH on SG, dev could run one-shot ops directly through boss-relayed SSH. Eliminated a category of pentester-in-loop credential-vet asks for routine WP mutations.

### 1.5 Pentester pre-commit hypothesis discipline (banked 2026-04-22)
Before any Tier 1+ sweep, pentester posts N falsifiable predictions, executes, then reports findings-vs-predictions delta to internal channel within 30min. This gate caught the SiteGround WAF blocking WSL+dev CDP at the source IP layer (2026-04-27) BEFORE the team built tooling on the assumption that WSL-side visual capture would work. Without the pre-commit prediction discipline, that would have been a silent failure mode discovered late.

### 1.6 Reyco repo default-branch discipline (2026-04-29)
Banked: glvcrypto/reyco-marine uses `master`, cortextos uses `main`. After this was locked, no PR landed against the wrong base branch for the rest of the build phase.

### 1.7 Cycle-11 ceiling break at 8/10 (phantom-endpoint pattern catalog)
The phantom-endpoint pattern catalog (6 vectors: filesystem|code|docs|PR|API-contract|implicit-state) graduated cycle-11 at 8/10. Worked examples landed during the build phase: SEO duplicate-title penalty discovery (Phantom #4 vector) caught at hold-gate before any duplicate titles shipped. The catalog turned what would have been late-cycle "we found a thing, why didn't we catch it" debriefs into hold-gate trips before write.

### 1.8 Async-density confirmed n=3 (cycle-13/14 evidence)
Boss cycle-14 Phase 6 exchange demonstrated single-message multi-pushback bandwidth at n=3 (cycle-13 added n=2, cycle-14 added n=3). Process win: dense async exchanges close threads in 1-2 turns instead of 4-5, freeing both agents for parallel work.

### 1.9 Approval throughput during window
27 resolved approvals during the build window (approval_1776637239 → approval_1777961234 timestamp range = 2026-04-19 → 2026-05-04). The fact that this number is "resolved" not "stale" means Aiden was responsive at the approval boundary across the build window. Bottleneck pattern (Section 4) is about the items that don't enter the approval queue at all, not about queue throughput.

---

## Section 2: Agent-Coordination Friction

### 2.1 Worker-spawn tmux race (2026-04-28)
3+ workers spawned within ~3 seconds caused `execvp Permission Denied`. Recovery: respawn sequentially with 5-15s sleep, terminate → sleep → respawn for half-state. Banked as feedback memory same day. Friction class: parallelism limit not surfaced until production load. Mitigation now in place; underlying race not fixed (post-launch fix queued).

### 2.2 Worker inbox-polling silent stall (2026-04-29)
spawn-worker workers don't auto-poll inbox; they stall silently. Recovery via `cortextos inject-worker`. Friction class: failure-mode-without-signal — caller can't tell from outside whether the worker is processing or hung. Post-launch fix queued.

### 2.3 SiteGround WAF blocked WSL+dev CDP (2026-04-27)
Source-IP captcha-wall at the Cloudflare edge made WSL-side visual capture infeasible. Pivoted to Aiden-side captures for visual verification. Friction class: assumption-baked-into-tooling that didn't survive infrastructure contact. The pre-commit hypothesis discipline (Win 1.5) caught this BEFORE significant tooling investment, but the team still has to route visual verifications through Aiden — bottleneck contributor.

### 2.4 SiteGround OPcache not running — flush attempts no-ops (built into reference memory)
opcache_enabled=no on the SiteGround tier reyco.glvmarketing.ca runs on. All opcache_reset calls were silently no-ops; only SG Dynamic Cache (HTML) needed purging. Friction class: standard-WP-deploy-assumption-fails-on-managed-host. Banked. Wasted maybe ~30 min total of debug cycles before reference memory was written.

### 2.5 Manage-cycle CWD bug (2026-04-27)
`manage-cycle <action> <agent>` resolves agentDir from CWD not from the arg; cross-agent calls silently modify caller's own config. Caught when an analyst-side change to a different agent's cycle silently re-wrote analyst's own cycle. Friction class: surface-arg-overridden-by-implicit-state. Workaround documented (must run from target agent's CWD); underlying bug not fixed.

### 2.6 ScheduleWakeup duplicate-fire under fixed-interval /loop (2026-04-27)
Fixed-interval /loop crons self-refire; ScheduleWakeup at heartbeat end created duplicate fire. Discipline now: ScheduleWakeup ONLY for dynamic /loop (no parsed interval). Friction class: tool-overlap-not-detected-by-either-tool — neither cron nor ScheduleWakeup knew about the other.

### 2.7 dev STALE 96h (4 days as of this writing)
dev session never auto-resumed from a hard-restart that landed during the build phase. Currently still stale — Aiden bundle item iv pending. Friction class: agent-recovery-without-Aiden-not-implemented. The system has `cortextos bus self-restart` (banked: must NOT be auto-triggered, queue to morning brief), so the design intent is human-gated. But there's no escalation for a stale agent that's gated on Aiden's restart action — it just sits stale.

### 2.8 Telegram backslash-stripping in code paths (2026-04-29)
PowerShell paths in Telegram messages — backslashes get stripped in rendering, breaks command on Aiden's end. Discipline: use forward slashes (`$HOME/.ssh/...`). Friction class: cross-platform-rendering-quirk. Caught after at least one bad command landed in Aiden's chat.

### 2.9 WP rewrite-flush discipline (2026-04-27)
GHA deploys don't flush WP rewrite rules. Taxonomy/permalink PRs need init-hook flush + unique option-flag pattern. Without this, post-merge taxonomy URLs 404 silently until someone visits the WP admin permalinks page. Banked as reference. Friction class: framework-deploy-doesn't-cover-framework-state — cortextOS deployed code, but WP runtime state needed an additional touch.

### 2.10 Telegram code-block formatting drift
send-telegram.sh uses regular Markdown (not MarkdownV2). Multiple instances during build phase of escaped backslash characters that broke parsing. Banked as user-side preference: don't escape `!`, `.`, `(`, `)`, `-`. Friction class: markdown-flavor-confusion that re-surfaces every few weeks unless someone's actively watching for it.

### 2.11 Doc labels canonical over conversation labels (2026-04-28)
When boss/analyst routed supplemental evidence to filed candidates, candidate labels in conversation drifted from doc labels. Discipline: cross-reference candidate label against doc not message; flag label mismatch real-time. Friction class: conversation-state-vs-canonical-state divergence under message-pace.

---

## Section 3: Cron / Scheduler Observability Gaps

### 3.1 Nightly metrics tool scope bug — singleton sample reported as fleet (discovered today, 2026-05-06)
`collect-metrics` reads `<ctxRoot>/config/enabled-agents.json` which contains only `{"dev": {...}}`. The same tool walks `orgs/*/tasks` and `orgs/*/approvals` correctly (mirroring per-org), but does NOT walk `orgs/*/agents` for agent discovery. Result: latest.json reports `system.agents_total=1` and `agents_healthy=0` while real fleet is 13 agents with 12 fresh. Phantom-endpoint Catalog vector match: "tool-output-implies-fleet-but-returns-singleton-sample". Fix lineage L1: extend agent-discovery to mirror lines 99-109 pattern (~10 lines). Fix L2: replace hardcoded 5h staleness threshold (line 159) with config-derived. Fix L3 (deferred): unify enabled-agents.json single source-of-truth. Bundle item ix to Aiden.

### 3.2 Approval staleness ≠ approval pending count
`collect-metrics` reports `approvals_pending=0`. True for the queue, but masks 3 corrupted approval records sitting in `resolved/` that need filesystem move. Surface mismatch between dashboard signal and underlying ground truth. Bundle item i to Aiden (only Aiden can do the filesystem move).

### 3.3 Heartbeat tick = 0 events possible
Without explicit `log-event` calls, a heartbeat runs with no observable trace beyond the heartbeat update itself. HEARTBEAT.md mandates ≥2 events per cycle, but enforcement is by-discipline-not-by-design. Fleet members occasionally hit zero-event heartbeats. Pattern surfaced in cycle-13 review.

### 3.4 evaluate-experiment timestamp arithmetic — daemon-side gate proposed (cycle-14 lock #2)
Heartbeat-message phrases ("closed at X") were used as authoritative timestamps for experiment open+duration arithmetic, leading to silent close-cycle inversions. Cycle-14 locked: daemon-side check rejecting mutations where computed-close > current-time + tolerance. Data-integrity-failure cost class — daemon intervention cost justified per cycle-14 sub-rule. Fix not yet shipped; cycle-14 lock item awaiting implementation pass.

### 3.5 ScheduleWakeup / fixed-interval /loop double-fire
Fixed-interval /loop crons self-refire AND end-of-turn ScheduleWakeup created duplicate fire — observable as 2x heartbeat density on dashboard during overlap window. Banked discipline (2026-04-27): ScheduleWakeup ONLY for dynamic /loop. No system-side detection; relies on agent-side discipline.

### 3.6 dev STALE 96h+ with no escalation
The hard-restart auto-recovery doesn't trigger. dev has been stale since 2026-05-02T15:22:58Z (current writing 2026-05-06 ~16:40Z = 96h). HEARTBEAT.md says "if heartbeat older than 5 hours, send a message"; "if >8 hours, notify orchestrator". Neither escalation has triggered automatic Aiden-surface. Analyst banked it as bundle item iv at the routine review level. Observability gap: stale agent that's gated on Aiden's restart action sits indefinitely without escalation pressure.

### 3.7 Cron-fire tracker drift
`update-cron-fire <cron-name> --interval 2h` is mandatory per HEARTBEAT.md but enforcement is agent-discipline. If the agent forgets to call it, the dashboard shows the cron as overdue while it's actually firing. Once observed in build window; not banked at memory level since pattern was self-corrected at next heartbeat.

### 3.8 Approval queue stale-detection by index, not record (Aiden bundle item i lineage)
3 approval records sit in `resolved/` with timestamps that should have been moved/archived. The aggregate counter reads them as "resolved" and reports zero pending — but the underlying records are in a half-state. Lineage to Aiden bundle item i: only filesystem-side move resolves. System-side: detector for "resolved older than N days, archive" doesn't exist.

---

## Section 4: Aiden-as-Bottleneck Inventory

### 4.1 8 bundle items waiting since cycle-13
Items i, ii, iv, v, vi, vii, viii, ix routed through analyst → Aiden over cycles 13 and 14:
- i: 3 corrupted approval records — filesystem move
- ii: daemon-side timestamp-arithmetic check on evaluate-experiment — code change
- iv: dev hard-restart 96h stale — only Aiden can `cortextos start dev` or hard-restart
- v: sift batch ~50h past — analyst-side execution gated on Aiden review of cycle-14 lock items
- vi: RTK pilot externally gated — Aiden-side spawn
- vii: cycle-13 7/10 KEEP closure formalization — Aiden review
- viii: cycle-14 lock items — Aiden review
- ix: collect-metrics scope bug — code change to `src/bus/metrics.ts`

Cumulative wait time across all 8 items, weighted by priority, is the load-bearing bottleneck signal — not any individual item.

### 4.2 3 corrupted approval records — only Aiden can resolve
Filesystem-state — can't be fixed by any agent. Sits stale until Aiden touches it.

### 4.3 Aiden-window-opening pattern (12-3pm UTC weekdays)
Multiple agents (prospector, ads, content) noted "Wed May 6 Aiden window opening" in heartbeats. Implies fleet-wide assumption that Aiden-gated work clusters into a 3-hour window per day. If Aiden's window is missed, the wait is 24h. Bottleneck width (3h/day) ≈ 12% of available time — leaves 88% of fleet hours blocked on something Aiden-only.

### 4.4 Credential-vet asks default-route through Aiden
Per banked protocol (2026-04-23): ANY credential ask goes dev → boss → pentester → user. Pentester pre-vets, but the user (Aiden) is the final approver. Build phase saw at least N credential asks reach Aiden's chat (exact count would require counting messages — boss memory has the routing receipts). The cred-vet protocol REDUCED the count vs un-routed asks, but Aiden is still the final approver on every credential.

### 4.5 Visual verification routes through Aiden (post-04-27 WAF block)
After the SiteGround WAF blocked WSL-side visual capture, every visual verification became Aiden-side ("send screenshot back via Telegram"). Compounds the 4.3 window pattern — visual checks have to wait for Aiden online + at-laptop.

### 4.6 RTK pilot externally gated
task_1777138843030_172 (RTK pilot Path A) is the longest-running in-progress task in analyst's queue. Gated on Aiden-side spawn (per memory). No analyst-side action moves it.

### 4.7 dev hard-restart needs Aiden
Per banked feedback "no autonomous self-restart": user rejects any agent (boss, analyst, etc.) self-initiating `cortextos bus self-restart`. Stale dev sits until Aiden surfaces from morning brief or directly. No fleet-internal recovery path.

### 4.8 Slack mirror discipline costs Aiden read-time
Banked 2026-04-21: every agent posts deliverables/status to its owning internal Slack channel. Aiden reads both Telegram (real-time) AND Slack (paper trail). Visibility win, but reading-load increase. Boss owns Slack comms (banked 2026-04-22) which routed through one agent — but Aiden still reads.

### 4.9 No async-batching of Aiden-asks
Each Aiden-gated item surfaces independently. There is no daily digest that batches "here are the 8 bundle items + 3 corrupted approvals + dev stale + visual verify queue, in priority order, decide as a batch." Surface-as-a-batch is a missing fleet-process item — flagged as Section 5 improvement candidate.

---

## Section 5: In-Flight Process Improvements

### 5.1 Reyco post-launch dev playbook N4 + N5 (queued post-Apr-30 sprint)
- N4: add PHP lint to `deploy.yml`
- N5: add PR-triggered CI

Both would remove pentester-in-loop dependency for a class of asks (lint failures + CI gate-checks no longer require pentester read-through). Cost-benefit: ~30 min implementation each, recurring win for every PHP PR going forward. Recommend prioritizing N4 first (lower risk, immediate value).

### 5.2 Cycle-15 inbox queue (7 items each side, symmetric)
1. V2 Child A formulation
2. Co-occurrence-vs-causation methodology note
3. Frame A conservative-close (dormant)
4. Generalized forced-articulation-gate family
5. Forced-articulation-gates meta-mechanism flag
6. Frame C "shared-term-fuzziness across agents" candidate (n=1, surfaced today 2026-05-06)
7. Precise-event-naming discipline (paired emitter/receiver — banked symmetric both sides today)

The 7 items represent a multi-cycle backlog of discipline candidates. Cycle-15 fire ~16h from now (estimated based on theta-wave cadence).

### 5.3 Frame C "shared-term-fuzziness across agents" — propagation pathway candidate
NEW candidate at n=1 surfaced today 2026-05-06 14:30Z. Mechanism: emitter ambiguous-term emission ("Reyco launch day" without disambiguation) + receiver failure-to-disambiguate-against-own-state-knowledge = compound breach. Distinct from solo category-error (intra-agent) and density-amplifier (intra-message). Detector design TBD — cross-agent fuzz harder to instrument. Watch n=2 for banking decision.

### 5.4 Pentester-in-loop reduction targets
Build phase had pentester reviewing every credential ask + many code changes. As N4 + N5 land + WP-CLI paths replace admin-trigger PHP, the pentester load reduces toward "review the reviewers" (cross-agent QC) rather than per-PR review. Goal-state: pentester gate fires on novel patterns or trust-position changes, not on routine ops.

### 5.5 Page-by-page audit skill — operationalize for Fusion/Titan/Soo
Skill exists in `community/skills/page-by-page-audit`. None of the React/Vite/Supabase sites (Fusion, Titan, Soo, glvmarketing) have run an equivalent audit yet. Fleet-process improvement: schedule first audit for one of those sites within 30 days post-Reyco-launch to validate skill portability across stacks (WP→React).

### 5.6 Async-density confirmed n=3 — push to n=5 close-cycle
Cycle-14 Phase 6 hit n=3 single-message multi-pushback bandwidth. Sustained discipline target: n=5 close-cycle observation = system-side intervention threshold (per cycle-14 graduation rule). If the next 2 dense exchanges sustain n=3+ with both sides closing in 1-2 turns, async-density graduates from "observed pattern" to "system-design assumption" — informs how cycle-15+ exchanges are structured.

### 5.7 Daily Aiden-batch digest (proposal — NOT banked)
Surface improvement: instead of 8 bundle items + 3 approvals + dev stale + visual queue arriving as N independent surfaces, package as one daily digest at Aiden's known window-open time. Tradeoff: reduces interrupt cost on Aiden but adds latency for items that surfaced post-digest. Recommend: prototype with this retro itself as the seed digest.

### 5.8 Pre-commit hypothesis discipline — extend beyond pentester
Banked 2026-04-22 for pentester Tier 1+ sweeps. Worked well. Candidate for extension: any agent kicking off a multi-step investigation posts N falsifiable predictions first. Reduces "we found something but didn't know what we were looking for" debrief class.

### 5.9 Boss/analyst Frame C symmetric banking — emitter/receiver paired discipline
Banked today 2026-05-06: emitter side (boss) precise-event-naming for project lifecycle terms; receiver side (analyst) source-check own state knowledge before propagating frame-language. Pair structure new in cycle-14/15 — first symmetric banking across two agents. Process pattern to extend: when a propagation breach is identified, BOTH ends of the pipe get a banking item, not just whichever end caught it.

### 5.10 Forced-articulation-gates meta-mechanism (cycle-15 inbox item 5)
Triple-deferred: cross-cycle pattern naming surfaced cycle-13 #7, cycle-14 mechanism-split discipline, cycle-14 graduation-discipline-by-cost. Meta-mechanism: requiring an agent to articulate the rule in plain language at a gate boundary catches scope-narrowing breaches that pure detector-rules miss. Worth its own cycle-15 hypothesis.

---

## Section 6: Soak-Window Incidents (May 3-5)

Conditional section — surface if soak-window incidents materially impacted process. Reading boss + analyst memory for May 3-5:

### 6.1 May 3 (post-cutover Day 1) — quiet
No major incidents banked. Fleet absorbed cutover without escalation. Memory traces show standard heartbeat cadence.

### 6.2 May 4 — quiet (no memory file written; daily memory file rolled May 5)
No memory file at `agents/analyst/memory/2026-05-04.md`. Either uneventful day or weekend pause. Boss memory file present for 05-04 — skim shows routine traffic, no crisis surface.

### 6.3 May 5 — Aiden review window opening, prep for May 6 formal-launch milestone
Boss heartbeats noted "evening review sent — awaiting Aiden's overnight approval reply". Daily memory shows fleet-wide standby waiting on Aiden review window. Image V2 sweep + series-showcase batch 2 shipped. No incidents banked.

### 6.4 May 6 — formal-launch milestone day; bundle-item carry-forward + Frame C surface
- Cycle-14/15 Phase 6 thread closed both sides at 14:30Z
- Frame C candidate surfaced (shared-term-fuzziness)
- 8 bundle items still pending Aiden
- Reyco retro task scope-locked + executable now (this document)

**Soak-window verdict:** clean. No production-side incidents impacted process. The Aiden-bottleneck pattern (Section 4) was the dominant friction signal across May 3-5, not any cutover-related fault.

---

## Recommendations (one-pager Aiden read)

**Top 3 immediate (Aiden review):**
1. Resolve 8 bundle items — prioritize iv (dev hard-restart) since 96h stale; then ix (collect-metrics scope bug, 1-day code change); then i (3 corrupted approvals filesystem move, 5-min op)
2. Approve N4 (PHP lint to deploy.yml) for next-PR landing — removes pentester-in-loop for lint-class issues
3. Surface preference: do you want a daily Aiden-batch digest at window-open, or continue independent-surface routing?

**Top 3 fleet-process structural:**
1. Build escalation for stale-agent-gated-on-Aiden (currently dev sits 96h with no escalation pressure)
2. Symmetric-banking pattern (emitter+receiver paired discipline) extends to other propagation classes — make it default when a propagation breach is identified
3. Pre-commit hypothesis discipline (currently pentester-only) extends to any multi-step investigation

**Top 3 cycle-15 hypotheses to watch:**
1. Frame C "shared-term-fuzziness across agents" — n=2 will be banking trigger
2. Forced-articulation-gates meta-mechanism — graduation from cycle-13 #7 lineage
3. Async-density n=3 → n=5 close-cycle observation as system-design assumption

---

**Retro complete.** 6 sections + recommendations. Surfacing to boss next.

