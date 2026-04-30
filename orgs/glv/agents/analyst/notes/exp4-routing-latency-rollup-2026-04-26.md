---
title: Exp #4 — Cross-agent routing latency — final rollup
author: analyst (Jerry)
date: 2026-04-26T14:40Z (FIRM-UP — window closed 14:00Z)
status: FINAL — measurement window 2026-04-24T14:37:48Z → 2026-04-26T14:00:00Z (closed)
experiment_id: exp_1777036113_rxvgg
verdict: DISCARD-AS-POSED — primary hypothesis fails; two structural insights retained for AM brief
---

# Exp #4 — Cross-agent routing latency — final rollup

## TL;DR

- **Primary criterion FAILED.** Hypothesis: "≥1 agent with >5min (300s) median read-latency." Result: all 12 agents have median round-trip latency <100s. Highest median: imagegen 85s (n=4). No fleet candidate qualifies for heartbeat tune via this metric.
- **Secondary criterion FAILED.** Hypothesis: "priority=high produces >30% latency reduction vs normal." Result: 6/7 agents with sufficient sample show high == normal or high SLOWER than normal. Only designer shows +32.6% speedup (n_h=7, below confidence threshold).
- **Methodological correction made mid-experiment.** Original mtime/ctime-on-processed-file proxy was invalid (rename preserves mtime; ctime delta ~1s due to bus's sequential write→rename pattern in `src/bus/message.ts:188`). Switched to reply-link round-trip latency: for each reply-with-reply_to in the window, latency = reply_send_ts - original_send_ts (extracted from msg_id epoch prefix). This is an upper bound on recipient's read+process+reply time.
- **Bonus structural finding.** Source code (`src/bus/message.ts:110-113`) confirms priority IS filename-sorted (`PRIORITY_MAP: urgent=0/high=1/normal=2/low=3` prefix). Sort applies during batch readInbox. In steady-state single-message arrivals to near-empty inboxes, sort has zero observable effect — explains the empirical null. Priority is structurally correct, operationally inert.

## Verdict: DISCARD as posed

The fleet is faster than the experiment predicted. There is no actionable "tune this agent's heartbeat" candidate because no agent breaches the 5min median threshold. This is a positive systems result, but the experiment as designed cannot extract action from it.

**Re-frame for follow-on:** if the goal is "find heartbeat-tune candidates," the threshold should be p90 or p99 (the tail), not median. p90 data (below) shows 7 agents in the 200-1700s range — those tails are the actual coordination cost. New hypothesis would be: "agents with p90 > 5min carry more coordination cost than their median suggests; tune candidates are ranked by p90 not median."

## Final rollup data (snapshot 2026-04-26T10:50Z)

### Per-agent reply-link round-trip latency

| Agent       | n   | median | p90    | max     | Notes |
|-------------|-----|--------|--------|---------|-------|
| ads         | 7   | 29s    | 339s   | 339s    | small sample |
| analyst     | 37  | 34s    | 240s   | 280s    | self |
| boss        | 236 | 28s    | 370s   | 8909s   | high volume; 8909s outlier = 2.5h (likely overnight backlog) |
| content     | 6   | 20s    | 323s   | 323s    | small sample |
| designer    | 34  | 42s    | 310s   | 1265s   | only agent with priority speedup |
| dev         | 173 | 39s    | 209s   | 1215s   | high volume |
| imagegen    | 4   | 85s    | 1649s  | 1649s   | tiny sample; idle agent |
| pentester   | 30  | 38s    | 487s   | 5031s   | 5031s outlier = 1.4h |
| prospector  | 5   | 23s    | 47s    | 47s     | tiny sample; gated agent |
| scout       | 5   | 17s    | 52s    | 52s     | tiny sample; 7d cycle agent |
| seo         | 26  | 28s    | 295s   | 450s    | medium volume |
| web-copy    | 52  | 41s    | 164s   | 291s    | medium volume |

**Fleet medians:** range 17s (scout) → 85s (imagegen). All under 5min threshold.
**Fleet p90:** boss 370s, ads 339s, content 323s, designer 310s, seo 295s — five agents with p90 in 5-6min range.
**Fleet max:** boss 8909s outlier (one stuck message), pentester 5031s, designer 1265s, dev 1215s.

### Priority effect (sufficient sample only)

| Agent     | n_normal | n_high | med_normal | med_high | speedup |
|-----------|----------|--------|------------|----------|---------|
| boss      | 225      | 7      | 28s        | 28s      | 0%      |
| dev       | 103      | 65     | 22s        | 59s      | -168.1% |
| analyst   | 31       | 6      | 30s        | 36s      | -20.0%  |
| designer  | 27       | 7      | 46s        | 31s      | +32.6%  |
| pentester | 26       | 4      | 37s        | 58s      | n/a (n<5) |
| seo       | 20       | 6      | 21s        | 31s      | -47.6%  |
| web-copy  | 44       | 8      | 39s        | 51s      | -30.7%  |

**Interpretation:** The negative speedups for dev (-168%) and seo (-47%) reflect SELECTION BIAS in priority usage, not bus malfunction. `high` priority is reserved for substantive asks that require LLM-driven analysis (longer to compose a reply); `normal` priority is used for quick coordination pings (shorter reply latency). The bus IS sorting correctly per filename prefix, but in single-message-arrival steady state the queue position never matters.

### Sample-size caveats

- **Reply-link sample excludes ack-without-reply messages** (notifications, broadcasts). Captures ~one-third to half of total processed traffic depending on agent.
- **Outliers retained** (8909s, 5031s, 1649s, 1265s, 1215s) — these reflect real overnight backlog scenarios and are part of the load profile, not bugs to filter.
- **Standby agents** (imagegen n=4, prospector n=5, scout n=5, content n=6, ads n=7) have insufficient sample for confident median; reported anyway with sample-size flag.

## Methodological learning (the most valuable output)

The Exp #4 spec proposed mtime-on-processed as the primary proxy. This was structurally invalid:

1. The bus's ack flow uses `renameSync` (`src/bus/message.ts:188`).
2. `renameSync` on Linux preserves mtime and updates ctime to the rename time.
3. Empirically: mtime == send timestamp (verified on samples; mtime epoch matches `.timestamp` ISO field exactly).
4. ctime - mtime = ~1s median across 100 boss processed/ samples, max 8s. This is the time between message write to inbox/ and the read+ack rename. NOT the time the agent's LLM spent reading.

The bus moves messages from inbox/ → inflight/ → processed/ via lock-protected batch operations. The inflight→processed move happens on the LLM's `ack-inbox` call, BUT the inbox→inflight move (which determines mtime) happens on every checkInbox poll. So the file's effective mtime is the moment the daemon picked it up, which can be near-instantaneous after send.

**Correct proxy: reply-link round-trip latency.** For messages with a reply (where receiver sent a follow-up with `reply_to: <orig_id>`), recipient_latency_upper_bound = reply.timestamp - parse_epoch_from(orig.id). This is what produced the data above.

**This learning generalizes.** Any future agent-bus instrumentation that uses filesystem mtime as a "when did the agent see this" signal will be wrong by the same mechanism. The reliable signals are:
- The msg_id's embedded epoch (when the sender wrote)
- The reply's .timestamp field (when the recipient responded)
- Daemon-emitted events in `analytics/events/<agent>/*.jsonl` if instrumentation is added there

## Provenance check (boss pushback validated and extended)

Boss flagged the 8909s outlier as potentially fleet-state-correlated rather than agent-perf. Verified:

- **Boss heartbeat gap Apr 25 16:42Z → 20:42Z** (4h with NO heartbeat events; slack-digest cron continued firing on schedule). Confirmed via `~/.cortextos/default/orgs/glv/analytics/events/boss/2026-04-25.jsonl` heartbeat-category filter.
- **All 38+ boss outliers >300s fall inside or immediately adjacent to that window.** Top three: 8909s (17:54Z→20:23Z spans the full gap), 8065s (17:45Z→19:59Z), 6246s (17:45Z→19:29Z).
- **Cluster correlates with Reyco service-page sprint dispatch.** Boss action events at 16:07Z show three task_dispatched events to dev/web-copy/seo. Sprint coordination saturated boss's LLM turn budget.
- **Extension to other candidates:** ran same provenance check on designer/seo/ads/pentester. 100% of their >300s outliers ALSO cluster in Apr 25 16:00Z → Apr 26 01:00Z. Pentester 5031s outlier corresponds to boss's own event-log entry "pentester dead session 5h stale heartbeat 3 pings unanswered" at 20:29Z.

### Clean P90 (excluding the 9h saturation cluster)

| Agent     | n_clean | excl | clean median | clean p90 | clean max | Note |
|-----------|---------|------|--------------|-----------|-----------|------|
| boss      | 28      | 209  | 21s          | 57s       | 62s       | 100% cluster contribution; structurally fast |
| pentester | 9       | 21   | 25s          | 68s       | 68s       | 100% cluster contribution; structurally fast |
| designer  | 12      | 22   | 27s          | 236s      | 462s      | Residual tail; modest candidate |
| dev       | 24      | 149  | 14s          | 389s      | 622s      | Real structural tail |
| analyst   | 16      | 21   | 45s          | 144s      | 253s      | Modest |

Sample sizes after exclusion are small because MOST agent-bus traffic happened during the cluster window. **That itself is a finding:** coordination-burst regimes generate most latency volume, not steady state. Standby agents (ads/content/web-copy) had insufficient post-exclusion sample to report.

**Fleet-architecture implication (banking note):** any future agent-bus latency experiment MUST partition samples by fleet-state regime (steady-state vs coordination-burst) before reporting per-agent statistics. Without partitioning, candidate lists will be contaminated by ambient load events. Sample partitioning is mandatory, not optional, for this measurement class.

## Action items from this experiment

1. **Update Exp #4 surface doc** with the methodology correction (DONE — this rollup supersedes section "Risks / caveats" of `exp4-routing-latency-instrumentation-2026-04-24.md`).
2. **Bank reply-link methodology in analyst's MEMORY.md** as the canonical agent-bus latency measurement technique.
3. **Propose follow-on Exp #4b** (revised after provenance check). Two distinct latency regimes, two distinct tune surfaces:
   - **(a) Steady-state tune candidates** (clean p90 > 200s, non-trivial sample): **dev p90=389s, designer p90=236s.** Real but modest. Heartbeat-tune-class fix.
   - **(b) High-coordination saturation candidates**: **boss + pentester.** NOT heartbeat-tune candidates. Different fix surface — parallel-dispatch reduction OR LLM-side concurrency for boss during sprint windows; pentester dead-session pattern is cycle-3 framework gap territory (root cause investigation needed).
   - Original framing ("boss/ads/content/designer/seo all candidates") was contaminated by the fleet-saturation cluster — DO NOT lift the uncorrected list to AM brief.
4. **Document priority semantic** in CLAUDE.md or a comms reference: "priority=high reorders inbox during batch recovery only; in steady-state single-arrival, priority is cosmetic. Use high for organizational signal, not for expected delivery speed-up."
5. **Bank meta-learning categories for theta wave cycle 6 phase 7 — TWO distinct categories (boss refinement):**
   - **"Score discipline"** = honest about what the data says post-hoc. Cycle 5 instance: holding 6/10 even after the scout debit collapsed. Adjusts numbers reactively.
   - **"Measurement discipline"** = catch contaminated/invalid data BEFORE drawing conclusions from it. Cycle 6 has THREE instances in this single experiment:
     - 10:00Z: renameSync → reply-link methodology pivot (mid-experiment).
     - 11:00Z: boss-outlier cluster contamination caught in provenance check.
     - 14:30Z: pentester 44343s outlier verified as deferred-reply, NOT dead-session (event-log probe found heartbeats firing on schedule + active outbound messaging through the supposed gap).
   - The two categories share a discipline thread but differ in attack surface. Score discipline adjusts numbers reactively; measurement discipline interrogates framing proactively. The latter is rarer because it requires actively distrusting your own instrument while running it.
6. **File #4c experiment for next theta wave proposal:** "Agent-activation-class taxonomy — do all agents need the same heartbeat contract?" Hypothesis: agents with event-driven activation patterns (ads/imagegen) should have different SLA contracts than steady-state agents (analyst/dev/seo). Within regime (c), preliminary sub-split: ads/imagegen are "wake-on-demand" frame (event-driven by nature); content/seo/web-copy are "steady-work-but-coordination-burst-comms" frame (different middle ground). NOT for AM brief today — surfaces in next theta wave cycle.

## 14:00Z firm-up (window-close re-run)

Re-ran with cluster exclusion built in. Verdict CONFIRMED.

### Firm-up table (sample partitioned)

| Agent       | All-window n | Raw median | Raw p90 | Raw max | Steady n | Clean median | Clean p90 | Clean max |
|-------------|--------------|------------|---------|---------|----------|--------------|-----------|-----------|
| ads         | 7            | 29s        | 339s    | 339s    | 0        | -            | -         | -         |
| analyst     | 39           | 34s        | 253s    | 323s    | 18       | 45s          | 253s      | 323s      |
| boss        | 241          | 29s        | 361s    | 8909s   | 32       | 23s          | 57s       | 84s       |
| content     | 6            | 20s        | 323s    | 323s    | 0        | -            | -         | -         |
| designer    | 34           | 42s        | 310s    | 1265s   | 12       | 27s          | 236s      | 462s      |
| dev         | 176          | 34s        | 209s    | 1215s   | 27       | 13s          | 389s      | 622s      |
| imagegen    | 4            | 85s        | 1649s   | 1649s   | 0        | -            | -         | -         |
| pentester   | 36           | 37s        | 652s    | 44343s  | 14       | 25s          | 68s       | 113s      |
| prospector  | 5            | 23s        | 47s     | 47s     | 4        | 9s           | 47s       | 47s       |
| scout       | 10           | 14s        | 23s     | 52s     | 7        | 14s          | 23s       | 23s       |
| seo         | 26           | 28s        | 295s    | 450s    | 0        | -            | -         | -         |
| web-copy    | 52           | 41s        | 164s    | 291s    | 0        | -            | -         | -         |

### Firm-up findings vs draft

1. **Verdict unchanged.** No agent's all-window median breaches 5min. Highest median: imagegen 85s (n=4 — too small to act on).
2. **Boss raw p90 366s → clean p90 57s.** All boss tail is saturation-event. Confirmed exclude from steady-state heartbeat-tune candidate set.
3. **Pentester max grew 5031s → 44343s (12.3h) — but verification dropped it from saturation-cluster set.** Boss pushback flagged the conclusion before AM brief lift. Pentester event log Apr 26 confirms heartbeats fired at 00:26/04:26/08:26/12:26Z (perfect 4h cadence) AND substantive outbound messaging at 05:50Z (credential vet) and 12:48-12:51Z (cluster). Pentester was demonstrably alive throughout the supposed 12.3h gap. The 44343s reflects a SPECIFIC deferred reply (pushed behind higher-urgency work like credential vet + weekly scan prep), processed when the queue cleared at 12:50Z. Measurement artifact, not session-blindness gap. **Dropping pentester from cycle-3 framework gap probe** AND from coordination-saturation candidate (b); only boss remains in (b).
4. **Five agents (ads/content/imagegen/seo/web-copy) have ZERO steady-state samples.** Their entire reply-link traffic in the 47h window happened during the cluster — they are "only-active-during-coordination-burst" agents. Cannot derive steady-state latency for them from this experiment.
5. **THREE-regime split (revised after pentester pushback verification):**
   - **(a) Steady-state heartbeat-tune candidates** from clean p90: dev p90=389s n=27, designer p90=236s n=12. Real, modest. Heartbeat-tune-class fix.
   - **(b) Coordination-saturation surface:** boss only. Heartbeat-gap 16:42→20:42Z Apr 25 confirmed via event log. Different fix class — parallel-dispatch reduction or LLM concurrency during sprint windows.
   - **(c) Bursty-only-during-coordination-windows:** ads/content/imagegen/seo/web-copy. Zero steady-state reply-link samples in the 47h window — they are activated only during coordination bursts. NOT heartbeat-tune-frame candidates. Different fix surface TBD: cycle-attendance question (do they need cycle participation in non-burst windows?), or burst-volume question (are they sized for the bursts they DO participate in?), or "evergreen-monitoring-not-needed" (on-demand activation pattern is correct, no tune required).

## Decision logged

- **Experiment:** exp_1777036113_rxvgg
- **Decision:** discard
- **Result value:** 85 (highest fleet median in seconds; primary criterion was >300s)
- **Score:** 0 (no actionable heartbeat-tune candidate emerged via the original framing)
- **Net win banked:** measurement methodology (reply-link round-trip + steady-state cluster partition) + meta-learning category for cycle 6 phase 7 (instrumentation-self-invalidation-detected; 2 instances in this experiment)

## Files referenced

- `/home/aiden/cortextos/orgs/glv/agents/analyst/notes/exp4-routing-latency-instrumentation-2026-04-24.md` (original spec; section "Risks / caveats" superseded by this rollup)
- `/home/aiden/cortextos/src/bus/message.ts:88-160, 167-195` (sendMessage, checkInbox, ackInbox source)
- `/home/aiden/cortextos/src/types/index.ts:6-11` (PRIORITY_MAP)
- `~/.cortextos/default/processed/<agent>/*.json` (raw data)
