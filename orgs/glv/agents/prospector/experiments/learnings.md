# Experiment Learnings

## exp_1776637239_chjam (discard)
- **Metric:** outreach_conversion
- **Hypothesis:** First experiment — establish baseline. Hypothesis: the current hook-why-what structure from life-OS v4 underperforms because hooks are too observational and not specific enough to the pain the owner actually feels right now. Test: rewrite the hook to lead with a concrete consequence (lost customers/revenue in plain language) rather than a neutral observation. Keep structure identical — only change the hook framing.
- **Result:** 0 (baseline: 0)
- **Learning:** WITHDRAWN — hypothesis contained loss framing ('lost customers/revenue') which violates the positive-only emotional copy rule. Resubmitting with upside framing.
## exp_1776637621_ul3os (discard)
- **Metric:** outreach_conversion
- **Hypothesis:** Baseline experiment — upside framing. Hypothesis: the current life-OS v4 hook (neutral observation) underperforms because it states what we found without connecting to what the owner could gain. Test: rewrite the hook to lead with the specific local opportunity they are positioned to capture (e.g. customers actively searching for their service in their city right now), framed as aspiration or curiosity, not loss. Keep hook-why-what structure identical — only change the hook from neutral observation to opportunity/aspiration frame.
- **Result:** 0 (baseline: 0)
- **Learning:** Null result — send gate was RED throughout entire 72h window. Zero emails sent during experiment period. Not a copy failure — this was a volume gating issue. Cannot assess upside-framed hook vs neutral baseline with zero sends. v5 passive-discovery direction was locked before this window opened and is confirmed by Aiden/boss directive. Upside framing (H2-curiosity, H3-aspiration) is already embedded in v5 voice — this experiment cannot be separately evaluated.
## exp_1776897022_o92w4 (discard)
- **Metric:** outreach_conversion
- **Hypothesis:** v5 passive-discovery is the locked copy direction. Hypothesis: now that direction gate is GREEN and v5 framing is confirmed (passive discovery: we were mapping X market in Y, you came up), this experiment establishes v5 as the surface baseline for the first real measurement cycle. The previous two experiments were null results due to volume gating (send gate RED). This cycle will measure actual outreach_conversion once batch 1 ships and emails flow. Expected first data point: within 72h of batch 1 ship signal.
- **Result:** 0 (baseline: 0)
- **Learning:** Window open (~48h of 72h elapsed). Send gate still RED — v6 batch 1 not shipped yet. Zero emails sent = zero conversions. Cannot assess copy performance without volume. Not evaluating early — noting status only. Expected first data point after batch 1 ships Apr 25.
## exp_1777000261_8ca1c (discard)
- **Metric:** outreach_conversion
- **Hypothesis:** v6 verify-claims copy is now staged and ready to ship (batch 1, ~14 emails). Hypothesis: emails with live-verified hooks (Ben's 9-step + verify-claims gate) will achieve >0 conversion within 72h of batch 1 ship date (Apr 25). Three prior experiments were null due to send gate RED. This is the first cycle where actual emails will be dispatched.
- **Result:** 0 (baseline: 0)
- **Learning:** Window closed 2026-04-27T03:45Z. Result: 0 conversions. CAUSE: send gate RED entire 72h window (Apr 24-27). Zero emails sent across batch 1 (held in #internal-sales thread for Aiden iteration; Reyco launch consumed his attention Apr 25-26). 4th consecutive cycle null for this reason. Surface (v6 copy) is unchanged and unsendable until copy approved by Aiden. Cannot infer copy effect from a metric where the denominator is gated to zero. Discarding from learnings table.
## exp_1776674200_om4zb (discard)
- **Metric:** reply_rate_by_hook_structure
- **Hypothesis:** Baseline cell: H2-curiosity x S1-validate-opportunity-diagnostic. Hypothesis: H2-curiosity (specific concrete observation) paired with S1 (validate-opportunity-diagnostic structure) will outperform H1-pride x S1 as the baseline cell because concrete specific findings lower guard on first cold contact more effectively than pride/legacy frames. No copy changes in this experiment — establishing the measurement framework and tracking the default dispatch configuration. n=0 across all cells at experiment start. Window: 14d. First statistical readout expected day 17-21.
- **Result:** 0 (baseline: 0)
- **Learning:** Day 25 (past stated readout day 17-21). Same gate-blocked pattern as sibling exp_1777000261_8ca1c: denominator stuck at zero because send-gate has been RED entire window (no v6/v6.3/cycle-19 emails dispatched). reply_received/email_sent is uncomputable when email_sent=0 across all hook×structure cells. Cannot infer hook/structure cell effect from a denominator gated to zero. Per banked autoresearch_kill_vs_park (gate-blocked surface → KILL not park) and evaluate_proposed_within_24h sibling-discipline (stale past window = honesty-debt). Discarding; cycle reply_rate_by_hook_structure remains enabled:false in config.json pending send-gate GREEN flip after Reyco cutover.
