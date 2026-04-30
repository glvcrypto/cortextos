# Reply Rate by Hook × Structure — Surface

## What This Cycle Measures

Rolling 14-day reply_received / email_sent rate, grouped by hook_variant × structure_variant cell.

## Current Default Cell

- hook_variant: H2-curiosity (specific observation → opportunity angle)
- structure_variant: S1-validate-opportunity-diagnostic

## Active Cells (as emails are dispatched)

| hook_variant | structure_variant | emails_sent | replies | reply_rate |
|---|---|---|---|---|
| H2-curiosity-search-gap | S1-validate-opportunity-diagnostic | 1 | 0 | 0.0 |
| H5-opportunity-NAP | S1-validate-opportunity-diagnostic | 1 | 0 | 0.0 |
| H1-pride | S1-validate-opportunity-diagnostic | 0 | 0 | — |

_Last measured: 2026-04-23T22:25Z. n=2 total. Well below n=10 threshold — no decisions. Send gate RED — Priest hook error caught mid-review, full 19-draft live audit pending before any send._

## Hypothesis Under Test

H2-curiosity + S1 will outperform H1-pride + S1 as the baseline cell because a concrete specific observation (what we found about YOUR business) is more personal and surprising than a pride/legacy frame for a cold intro. Pride frames work better for warm follow-up; curiosity frames lower the guard on first contact.

## Notes

- Minimum n=10 per cell before statistical readout (expected ~day 17-21 at current dispatch velocity)
- Do not declare a cell winner or loser before n=10
- Noise is expected until threshold

## Dispatch Readiness (as of 2026-04-21 20:40Z)

Batch 1 is now live in #internal-email (C0AUBAL58RK) awaiting feedback/ship signal.
Send gate remains RED until user says "ship" per batch. n8n readiness is independent.
When first batch ships:
- H1-pride cell: 11 leads ready — will hit n=10 threshold cleanly
- H2-curiosity cell (all sub-variants): 8 leads ready — ~2 short of n=10
- Action: stage 2+ additional H2-curiosity leads in next research batch
- Structure variant is constant (all S1) — only hook_variant is the independent variable

## Batch 1 Dispatch Context (2026-04-21)

5 leads in #internal-email iteration (batch 1 of the per-batch approval loop):
- Priest Plumbing NB PLB: H1-pride x S1
- J.G. Fitzgerald NB Roofing: H1-pride x S1
- Northern Climate SDY HVAC: H2-curiosity-search-gap x S1
- D. Peppard TB HVAC: H4-validation x S1
- Adept Plumbing TB PLB: H5-opportunity-NAP x S1

When batch 1 ships, H1 gets n+=2, H2 gets n+=1, H4 gets n+=1, H5 gets n+=1.
H1-pride will reach n=10 after batches 2-3. H2-curiosity needs 2+ more leads in future batches.
