# CPL Null-Recovery Proposal: Proxy Baseline for Titan Tiny Homes
**Prepared by:** GLV Marketing (ads agent)
**Date:** 2026-05-01
**Purpose:** Provide a defensible CPL hypothesis pre-loaded for when Titan launches, so cycle-1 null can be contextualized against public industry benchmarks rather than declared meaningless.

---

## Problem

The CPL autoresearch cycle (cycle-1) returned NULL because no Titan campaign is live and no credential-gated data is available. Without a baseline, "null" means nothing — we can't tell whether future CPL is good, acceptable, or poor.

This document builds a proxy baseline from public industry data so when cycle-2 fires, we can immediately evaluate actual CPL against a defensible benchmark.

---

## Proxy Baseline: Tiny Home / Alternative Housing on Meta

### Direct comparables (Meta lead gen, Canadian markets)

| Source | Vertical | CPL range (CAD est.) | Notes |
|--------|----------|----------------------|-------|
| Wordstream (2025 Meta benchmarks) | Real estate | $15–$45 USD → ~$20–$60 CAD | Broadest category; includes luxury + commercial |
| Adamigo.ai (2025 Meta Canada) | Home builder / contractor | $35–$75 CAD | Closest SIC match; construction + custom builds |
| Scaledon (2025) | Tiny home / alternative housing | $28–$55 CAD | Small sample (N~12 campaigns); most directly comparable |
| Oh Good Growth (2024–2025) | Real estate leads Canada | $30–$65 CAD | Ontario-focused; Tier 2 cities outperform on CPL |
| Internal analog: Fusion Financial (Apr 2026) | Financial services | ~$45–$80 CAD est. | Different vertical; lower intent product; directional only |

### Derived proxy range

Given:
- Titan is a high-consideration, low-volume purchase ($100K–$150K+)
- Ontario Tier 2 market (SSM radius; cheaper CPM than GTA)
- Native lead form (lower friction than landing page — lowers CPL vs benchmark)
- Budget $500/mo ($16.67/day) — thin learning signal; CPL will run high weeks 1–2
- Andromeda broad targeting (Ontario-wide) — gives algorithm maximum audience to find buyers

**Proxy CPL benchmark: $30–$55 CAD (learning phase); $25–$40 CAD (post-learning)**

| Phase | CPL range | Interpretation |
|-------|-----------|----------------|
| Week 1–2 (learning) | $40–$80 | Expected; do NOT optimize |
| Month 1 exit target | $30–$55 | Acceptable; hold settings |
| Steady-state target | $25–$40 | Strong; scale eligible |
| Kill signal | > $65 for 2 weeks post-learning | Structural problem — creative or audience |

---

## Confidence Assessment

| Factor | Impact on proxy reliability | Confidence |
|--------|-----------------------------|------------|
| Scaledon tiny home data (N~12) | Best direct comparable but very small sample | Medium |
| Wordstream real estate category | Overly broad; includes luxury/commercial | Low-Medium |
| Ontario Tier 2 adjustment | Directional only; no published Ontario-specific split | Medium |
| Meta Andromeda behavior changes (Apr 2026) | Benchmarks are pre-Andromeda; creative-centric update may reduce CPL for authentic content | Low-Medium |

**Overall confidence: MEDIUM.** This baseline is better than nothing; it should not be treated as authoritative until 30+ days of live Titan data overrides it.

---

## How to Use This Proposal

### When cycle-2 fires (Titan Day 14)
1. Pull CPL from Ads Manager
2. Compare against proxy ranges above by phase
3. Classify: Strong / Acceptable / Concern / Kill-eligible
4. Report to analyst with phrase: "Cycle-2 CPL = $[X] vs proxy target $25–$55 (post-learning). Status: [Strong/Acceptable/Concern]."

### When cycle-3+ fires (Titan Day 30+)
- By this point, live data begins to replace the proxy baseline
- Record cycle actuals in `experiments/cpl-cycle-actuals.md` (create on first non-null reading)
- After 3 cycles, the proxy is retired — actual campaign trend becomes the benchmark

---

## Hypotheses Pre-Loaded for Titan Launch

These are testable predictions to validate or falsify against early data:

| # | Hypothesis | Predicted outcome | Falsify if |
|---|------------|-------------------|------------|
| H1 | Broad targeting (Ad Set A) will beat Downsizer targeting (Ad Set B) on CPL | CPL A < CPL B | CPL B is ≤10% of CPL A after $100 spend |
| H2 | Affordability angle (Angle 1 carousel) will have higher CTR than lifestyle/downsizer (Angle 2 video) | Angle 1 CTR > Angle 2 CTR | Angle 2 CTR exceeds Angle 1 by ≥0.3pp |
| H3 | Ontario-wide geo will sustain CPL < $50 in weeks 3–4 | Correct if CPL drops below $50 by week 3 | CPL still > $55 at week 3 end with no creative fatigue |
| H4 | Week 1–2 CPL will be 40–80% higher than post-learning steady-state | CPL week 1-2 ≥ $50; CPL week 3-4 ≤ $40 | Week 1-2 CPL under $35 (algorithm learning faster than expected) |
| H5 | "I have land" qualifier answers will have higher downstream close rate than "I'm exploring" | Joey reports land-already contacts converting at ≥2x rate | No difference in conversion rate after 20+ leads |

---

## Data Collection Plan

When Titan launches:
- **Day 7**: Note CPL (learning phase baseline). No optimization action.
- **Day 14**: First cycle-2 measurement. Classify vs proxy range. Kill/hold/continue ad set B decision.
- **Day 30**: Cycle-3. Confirm steady-state CPL. Begin retiring proxy baseline.
- **Day 45+**: Replace proxy with 6-week rolling avg of actual campaign CPL.

---

*Status: DRAFT — hypothesis pre-loaded, no live data yet. Activate when Titan campaign launches.*
*Gating condition: Meta Business Manager + pixel confirmed on titantinyhomes.ca.*
*Owner: ads agent. Report cadence: bi-weekly to analyst.*
