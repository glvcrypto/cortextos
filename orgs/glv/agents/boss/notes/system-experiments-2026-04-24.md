# System Experiments Batch — 2026-04-24 (for AM brief)

**Context:** User goodnight directive 00:30 EDT — "come up with some more system experiments." Separate from scout's upgrade-proposals stream (scout = what to build; this = what to measure / A-B test).

**Purpose:** Queue 8 falsifiable system experiments for user AM review. Each has a hypothesis, proposed measurement, success criteria, and routing for execution if approved.

---

## Experiment 1 — Approval-surfacing format A/B

**Hypothesis:** Current Telegram approval asks use free-form prose. A structured 4-line format (ASK / WHY / OPTIONS / DEFAULT-IF-SILENT) reduces user decision latency.

**Measurement:** time-to-decide on the next 20 approvals (10 prose vs 10 structured). Logged via `approval_routed` → `approval_decided` event delta.

**Success criteria:** structured format reduces median decide-latency by ≥25%.

**Execution owner:** boss (just reformat outgoing approval asks). 2-week cycle.

**Risk:** structured format may feel robotic — user can override any time.

---

## Experiment 2 — Evening review overnight-task compliance

**Hypothesis:** Overnight task completion rate is ≥80% when user explicitly approves (vs ad-hoc agent self-direction). Tonight = 4/7 done + 3/7 in-flight by 00:17 EDT = baseline ~57% done at 2h mark.

**Measurement:** for next 5 evening-review cycles, track: (tasks approved) vs (tasks shipped by 06:00 EDT) vs (tasks in-flight past 06:00). Correlate with task complexity (LOC / dependencies / cross-agent).

**Success criteria:** evening-approved tasks > 80% ship by 06:00 EDT OR we identify the specific complexity-class that blows through (so future evening reviews can size better).

**Execution owner:** boss (instrument evening review + track in daily memory). 1-week cycle (5 evenings).

---

## Experiment 3 — Phantom-endpoint class-collapse detection automation

**Hypothesis:** Once analyst's gap-detector patch lands, false-positive rate drops to near-zero. We should instrument measurement now so we have before/after data.

**Measurement:** count cron-gap alerts fired per 24h pre-patch (currently 9-11/day per observation) vs post-patch. Both numbers auto-logged via `phantom_endpoint_fp` events.

**Success criteria:** post-patch FP rate <1/day (≥90% reduction). If still high, the patch didn't cover the root class.

**Execution owner:** analyst (already in flight with patch spec). Measurement hook = boss daily memory count.

---

## Experiment 4 — Boss-to-agent routing latency

**Hypothesis:** send-message → ACK or reply latency is a hidden coordination cost. Measuring it lets us know which agents are lagging and whether `high` priority actually accelerates.

**Measurement:** instrument `~/.cortextos/default/logs/<agent>/outbound-messages.jsonl` to expose send-time vs inbox-read-time deltas. Roll up per-agent for the next 48h.

**Success criteria:** identify which agents have >5min median read-latency (candidates for heartbeat tune OR always-on) and whether `high` priority empirically jumps the queue.

**Execution owner:** analyst (instrumentation doc). Boss consumes rollup in evening review.

---

## Experiment 5 — Pentester pre-commit hypothesis compliance

**Hypothesis:** Pentester posting N falsifiable predictions to #internal-<client> before each Tier 1+ sweep (per `feedback_pentester_precommit_hypothesis`) should catch sweep-scope drift and improve audit rigor. We have zero ships under this protocol yet — need baseline.

**Measurement:** track next 5 Tier 1+ sweeps. For each: (a) did pentester post predictions pre-sweep? (b) findings-vs-predictions delta? (c) did any new deviation surface that wouldn't have under free-form sweeps?

**Success criteria:** ≥1 scope-drift catch OR ≥2 findings-vs-predictions deltas that teach us something the ledger doesn't already have.

**Execution owner:** pentester. Boss audits at evening review.

---

## Experiment 6 — Scout proposal quality vs cadence *(merged with scout proposal #3: fleet-wide proposal adoption KPI)*

**Hypothesis:** Forcing daily scout proposals (new memory tonight) will create volume-over-quality risk. Need to measure: are proposals shipping in formats that actually lead to adoption, or are they getting read-and-skipped?

**Measurement:** scout owns the adoption-KPI widget (posted tonight as scout upgrade-proposal #3). Boss consumes widget data in evening review. Track over 14 days: (a) count posted, (b) count user-reviewed in AM brief, (c) count adopted/modified/rejected, (d) count superseded by later proposal.

**Success criteria:** adoption + modified rate ≥40% (proposals shaping real change) AND rejected rate stays under 30% (quality holds). If rejected spikes, user may prefer quality-over-cadence — we'd trade a daily cadence for 2-3/week higher-quality.

**Execution owner:** scout (widget + posting). Boss (consumes in evening review). 14-day cycle.

**Scout cross-ref:** this experiment consumes scout's upgrade-proposal #3 output — not a duplicate, a measurement wrapper around scout's built widget.

---

## Experiment 7 — Cross-agent QC coverage expansion

**Hypothesis:** Pentester QCs other agents' security claims (per `feedback_pentester_cross_agent_qc`). This pattern could extend — analyst could QC dev code quality before PR merge, content could QC SEO meta descriptions, designer could QC prospector email visual layout.

**Measurement:** pilot one cross-QC pair for 1 week (proposal: analyst → dev code QC for next 3 PRs before merge). Compare: (a) PR merge cycle time, (b) post-merge bug count, (c) agent friction notes.

**Success criteria:** cycle time does NOT degrade >20% AND post-merge bugs trend down OR no change OR delta too small to measure — any of these keeps the option live. Friction notes inform scaling.

**Execution owner:** analyst (lead QC) + dev (target). Boss dispatches. 1-week cycle.

---

## Experiment 8 — Morning brief item ordering A/B

**Hypothesis:** Current AM brief orders items by "freshness" (newest first). User's actual priority order may differ (e.g. approvals-needed first, then blockers, then status). Measuring which order user acts on first reveals their true priority.

**Measurement:** next 3 AM briefs use different orderings — (A) approvals-first, (B) blockers-first, (C) freshness. Track order user responds to items in.

**Success criteria:** consistent pattern emerges showing user's actual priority order → lock that order as the default.

**Execution owner:** boss (AM brief format rotation). 3-day cycle.

---

## Dispatch recommendation

**AM brief ask to user:**
- Green-light any subset of 1-8 to start.
- Flag any overlap with scout's upgrade proposals (due 07:00 EDT).
- Set priority: measurement-light experiments (#1, #8) can run passively; measurement-heavy (#4, #6) need explicit buy-in.

**Boss-owned (no dispatch needed):** #1, #2, #8
**Analyst-owned:** #3, #4, #7
**Pentester-owned:** #5
**Scout-owned:** #6

**Total cycle times:** 1 week (most) to 14 days (scout-quality).

**Next batch:** write #9-16 on Fri night evening review. Running cadence of 8/week keeps the experimental surface fresh.
