# Test-Group Skill Fine-Tune — Change Summary

**Author:** Jerry (analyst)
**Date:** 2026-04-20
**Task:** task_1776659989223_279
**Trigger:** Boss overnight-dispatch — triage addendum from user (medium priority)
**Deliverable:** Rewritten `.claude/skills/test-group/SKILL.md` + this summary + dry-run walkthrough + follow-on flag.

---

## 1. ~200-Word Summary of What Changed and Why

The user flagged three failure modes in the synthetic focus group: generic panels, polished focus-group-bot speech, and mushy synthesis. Rewrite targets each surgically.

**A — Panel Quality.** Added five Mandatory Pole Pairs (age, gender, life stage, niche knowledge, marketing awareness) — non-optional, every panel must populate all five or rebuild. Added a Distinctness Audit: before the debate runs, compare all 45 avatar pairs across 6 vectors; any pair matching on 4+ is rewritten. Flipped generation order to Profile-First (life context → category relationship → mindset → tics), which stops Claude from defaulting to archetype-shaped people. Added a mandatory Wildcard slot (one avatar outside the core buyer profile).

**B — Response Realism.** Replaced the defensive Tim Hortons rulebook with an offensive Realism Quota: per session, the Director must produce ≥3 brand-name drops, ≥2 contradictions, ≥1 off-topic drift, ≥1 interruption, ≥1 agree-then-reverse, ≥1 boredom signal. Added length-variance quota (every round needs responses ≤6 words AND responses ≥3 sentences) to kill uniform polish. Locked 1-2 verbal tics per avatar that persist across sessions. Banned focus-group-bot filler ("great question", "pros and cons"). Director enforces and reruns targeted turns if quotas miss.

**C — Synthesis.** Replaced consensus labels with a Decision rubric (SHIP / REVISE-THEN-SHIP / KILL) derived mechanically from a 4-axis 0-3 rubric (Clarity, Relevance, Credibility, Action-pull) with fixed anchor descriptions. Added mandatory Minority Report section (dissent survives aggregation, with override clause). Made the Change-List directive not suggestive (before→after, anchored to panel quotes).

**Stretch — Experiment Wiring.** Every SHIP/REVISE decision now auto-registers via `cortextos bus experiment create` with a KPI prediction block (direction, magnitude, confidence, failure case). Post-ship, analyst evaluates and logs a `panel_calibration` event. Over time, rolling calibration accuracy per client gives the panel an earned trust level — the loop that makes synthetic testing worth believing.

---

## 2. Dry-Run — Reyco Power-Boat Retiree Segment (Placeholder Walkthrough)

**Note:** Reyco has no avatar files yet at `orgs/glv/clients/reyco/research/avatars/` — this is a gap surfaced by this task and a blocker for a live run. Walkthrough below uses a sketch panel to show what the new flow produces vs the old one.

### Old flow output (baseline — what the pre-rewrite skill produces)

10 retirees, all in their late 60s, all mid-skeptic mindset, all describing the ad as "tugs at the heartstrings" or "captures the lifestyle nicely". Consensus label: MAJORITY (7/10 positive). Recommendation: "feels strong, consider slight tone revision". No dissent surfaced. No brand names dropped. No contradictions. Response length uniform at 2 sentences.

This is reskinned templates. Useless.

### New flow output (after rewrite)

**Panel build:**
- **Pole audit:** age span 58-76 (PASS); gender 5M/5F (PASS); life stage 2 newly-retired / 8 veterans initially — FAIL, rebuild to 4 newly-retired / 6 veterans; niche knowledge 2 experts / 5 intermediate / 3 newcomers (PASS); marketing awareness 3 high / 4 medium / 3 low (PASS).
- **Distinctness audit:** pairs 3 & 7 match on 5-of-6 vectors (both male, 60s, newly-retired, skeptic, intermediate). Rewrite pair 7 as a former shop teacher from Parry Sound with a recent hip replacement — now only 2-of-6 match. Audit passes on second run.
- **Wildcard slot:** Brenda, 61, partner-pushed, never owned a boat, currently sceptical of the whole category.
- **Verbal tics (locked):** Gary "I tell you what —"; Ruth always asks a question before answering; Dennis always cites a specific year ("back in '09"); Brenda minimises ("it's fine, I guess").

**Round 1 (length variance enforced):**
- Gary, 64, Georgian Bay, retired HVAC installer: "I tell you what — that boat in the photo is a Princecraft Xpedition, I know because my buddy Ron has one at his camp. Three sentences."
- Brenda, 61 (wildcard): "Not for me."
- Margaret, 72, Peterborough: "Reminds me of my late husband's boat. We sold it in '19 after he passed. I'm not the buyer but my son-in-law might be."
- [... others with varied length, tics surfacing, life-rooted reactions ...]

**Realism quotas hit by end of session:**
- Brand drops: 4 (Princecraft, Mercury, Bass Pro, Canadian Tire) — PASS
- Contradictions: Dennis mild-agreed in Round 1 that the ad "feels honest", then hard-disagreed in Round 3 after Gary pointed out the dock in the photo is too clean — PASS
- Off-topic drift: Margaret went on a 2-minute tangent about her daughter's wedding being rescheduled twice due to COVID, Director let it land, redirected — PASS
- Interruption: Gary cut off Brenda in Round 2 — PASS
- Agree-then-reverse: Dennis (see contradictions above) — PASS
- Boredom: Frank, 74, said "yeah, seen this ad already, what's the point" — PASS
- Length variance: every round has a ≤6 word response and a ≥3 sentence response — PASS

**4-axis scoring:**

| Axis | Score | Quote |
|---|---|---|
| Clarity | 3/3 | "You're selling a boat. I got it in two seconds." — Frank |
| Relevance | 2/3 | "Looks like my people but the price isn't on there so I can't tell if it's for me." — Ruth |
| Credibility | 1/3 | "Dock's too clean. Nobody keeps their dock that clean." — Gary |
| Action-pull | 2/3 | "Yeah I'd forward this to my brother-in-law." — Dennis |
| **Total** | **8/12** | |

**Decision: REVISE-THEN-SHIP.**

**Minority Report:**
- Dissenting voice: Brenda, 61, wildcard partner-pushed non-buyer.
- What she said: "Nothing in this ad tells me why I should care. The whole thing is for men who already want a boat."
- Why it matters: this is not fringe — Reyco's secondary buyer influencer is the spouse. If the ad only works on pre-sold men, the category-expansion audience is invisible. Structural read.
- Override recommendation: **YES, override 8/12 SHIP to REVISE-THEN-SHIP** even though score alone would clear SHIP threshold. Justification: Brenda's concern is a coverage gap, not a preference miss.

**Change-List:**
1. Dock shot currently 100% clean cedar → swap in a working-dock shot with tackle box and wet towel visible. Anchor: "Dock's too clean." — Gary.
2. Headline currently "Your Summer Begins Here" → "Summers you'll still be talking about in 2040". Anchor: "Tells me nothing about why I should care." — Brenda.
3. No price band visible → add "Financing from $X/mo" lower-right. Anchor: "Can't tell if it's for me without the price." — Ruth.

**DO NOT CHANGE:**
- Clarity of the product offering (3/3 across the panel).
- The "for people who already know what they want" tone — that still works for the primary segment.

**KPI Prediction (registers as experiment):**
- Metric: CTR on Reyco boat-sales campaign (lifestyle-retiree audience).
- Baseline: [TBD from ads agent — placeholder 0.8%].
- Predicted shift: +15-30% after changes 1-3 applied.
- Confidence: Medium (score 8/12, override applied).
- Failure case: CTR flat or negative by day 7 = miss.

### Why the new flow is better

Three concrete lifts vs baseline:
1. Brenda (the wildcard) surfaced a structural issue (spouse-audience gap) that the 10-retirees-who-all-agreed panel would never produce. The Minority Report forced the override — a SHIP gets downgraded to REVISE because one voice caught something the majority missed.
2. Real specificity (Princecraft Xpedition, Mercury, "back in '09") grounds the debate in someone's life. Gary's "dock's too clean" is a concrete, fixable insight. The baseline flow would have generated "I like the imagery" — unactionable.
3. The change-list is directive ("swap dock shot with working-dock shot"), not advisory ("consider revising imagery"). Any copywriter could execute it tomorrow.

---

## 3. Follow-On Flag (for Morning Brief)

**Blocker surfaced:** Reyco has no avatar files. This task could not run a live dry-run against real personas — only a placeholder walkthrough. This ladders directly to **task #4 (wrap onboard skill with autoresearch cycle)**: the avatar-research pipeline must run as part of client onboarding so test-group, ad-swarm, and copywriting skills always have panels to draw from. Flagged for boss to queue.

---

## 4. Stretch: Experiment Framework Wiring (Detail)

Three new lifecycle steps:

**On SHIP / REVISE decision:**
```bash
cortextos bus experiment create \
  --agent analyst \
  --metric ctr \
  --hypothesis "Panel (n=10, retiree-boat-owners) predicts Reyco ad variant B will lift CTR by 15-30% over 14d vs baseline 0.8%." \
  --surface reyco/summer-campaign/variant-B \
  --direction higher \
  --window 14d \
  --measurement "post-ship CTR vs 14d pre-ship baseline on same placement"
```

**During window (14d):**
- Ads agent logs real CTR daily via existing event schema.
- Analyst monitors at day 7, day 14.

**At window close:**
```bash
cortextos bus experiment evaluate <id> \
  --learning "Panel predicted +15-30% CTR lift. Actual +22%. Hit." \
  --score 1

cortextos bus log-event action panel_calibration info \
  --meta '{"client":"reyco","test_report":"<path>","experiment_id":"<id>","predicted_direction":"higher","predicted_magnitude":"15-30%","actual_direction":"higher","actual_magnitude":"22%","hit":true,"panel_score_total":8}'
```

**Rolling accuracy dashboard:** after N≥10 experiments per client, report panel-calibration rate. If hit-rate <60%, flag the panel as low-confidence and rebuild; if >80%, promote to high-trust. This is the loop that turns test-group from a vibes machine into an earned-trust instrument.

---

*This is an internal analyst deliverable. Not for external distribution.*
