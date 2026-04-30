# HVAC North Bay Cohort Anchor Analysis

**Author:** Jerry (analyst)
**Date:** 2026-04-20
**Task:** task_1776652307032_350
**Trigger:** Boss overnight-dispatch #4 (evening-review default, user no-reply on 23:10 proposal)
**Status:** Draft-only, internal. Not a client deliverable.

---

## 1. Summary

Prospector ran a second batch (NB-HVAC-2026-04-20-001) introducing three new cohort dimensions beyond the plumbing baseline: a channel subtype split (email_ready / phone_first / phone_only), a new hook family (H5-opportunity), and a Gmail-draft integration. 2 of 3 email-ready leads are drafted. Phone funnel has not yet produced events.

## 2. Batch Facts

| Field | NB-PLB-2026-04-20-001 (baseline) | NB-HVAC-2026-04-20-001 |
|---|---|---|
| Industry | plumbing | hvac |
| City/area | north-bay | north-bay |
| Leads investigated | 4 | 6 |
| email_ready | 4 | 3 |
| phone_first | 0 | 2 |
| phone_only | 0 | 1 |
| email_drafted events | 4 (all at 22:34:06Z) | 2 of 3 (03:35:12Z, 03:42:46Z; 3rd pending) |
| Gmail draft IDs | none | present on both drafts |

## 3. Cohort Cells — Email Channel Only

After 2 batches, 6 email drafts total. Hook × structure cells:

| hook_family | hook_variant | S1 | S4 | Total |
|---|---|---|---|---|
| H1-pride | H1-pride | 1 | 0 | 1 |
| H1-pride | H1-pride-family-legacy | 0 | 1 | 1 |
| H2-curiosity | H2-curiosity | 0 | 1 | 1 |
| H2-curiosity | H2-curiosity-search-gap | 1 | 0 | 1 |
| H3-aspiration | H3-aspiration | 1 | 0 | 1 |
| H5-opportunity | H5-opportunity-NAP | 1 | 0 | 1 |
| **Total** | | **4** | **2** | **6** |

At hook_variant × structure granularity: n=1 per cell. No signal.
At hook_family × structure granularity: H1 (2), H2 (2), H3 (1), H5 (1). Still too sparse for any cut.

## 4. Channel Subtype Split (new dimension)

HVAC batch introduced the email_ready / phone_first / phone_only distinction. Phone outreach is a separate funnel — different action verbs, different conversion physics — and must not blend into email reply_rate numbers.

**Inferred phone funnel** (prospector has not yet logged phone events, inferring from first principles):
- `call_attempted` → `call_connected` → `conversation_held` → `meeting_booked` (or `callback_requested`, `no_answer`, `gatekept`)

**Action for prospector:** schema spec needed for phone outreach events. Will propose alongside schema-drift fix (see §5).

**Cohort implication:** HVAC's 3 phone-funnel leads (2 phone_first + 1 phone_only) are off the experimental grid until phone schema lands. Do not count them as failed email conversions.

## 5. Schema Drift (FLAG)

The HVAC batch email_drafted events deviate from the schema locked with prospector on 2026-04-19 (my reply at 22:34:06Z, confirmed by prospector in reply_to 1776637199908).

**Plumbing batch (compliant)** meta keys:
`channel, stage, niche, area, batch_id, prospect_id, hook_variant, structure_variant, sequence_step`

**HVAC batch** meta keys:
`agent, prospect_id, decision_maker, email, hook_variant, hook_family, structure_variant, batch_id, channel, city, industry, gmail_draft_id`

**Removed / renamed** (breaks aggregation):
- `niche` → `industry` (rename, semantic-equivalent — not breaking but inconsistent)
- `area` → `city` (rename — same issue)
- `stage` — **dropped**. Breaks the stage-based funnel view I spec'd.
- `sequence_step` — **dropped**. Breaks multi-touch dedup.

**Added** (net-positive, welcome):
- `hook_family` — per my spec, correct.
- `decision_maker`, `email`, `gmail_draft_id` — useful for linking drafts to outcomes. Keep.
- `agent` at meta level — redundant with top-level `agent` field in the event envelope. Cosmetic noise, not breaking.

**Fix:** prospector should either (a) restore stage + sequence_step + keep original names OR (b) I accept the new names (industry/city) and reinstate stage + sequence_step. Both work; must be consistent. Recommending (b) — `industry` is more precise than `niche`, `city` more precise than `area`. Will propose this to prospector as a schema v1.1.

## 6. Statistical Power Status

Target: 20 sends per (hook_family × structure) cell for a first meaningful readout.
Current: 1-2 sends per cell across 5 cells × 2 structures = ~10 cells to fill.
Projection at 100 emails/day across 4-5 niches: first hook_family × structure readout around day 3-4 of full-volume dispatch if distribution is roughly uniform. Hook_variant granularity will take 3-4× longer (~day 12-16).

No reports should be generated before thresholds clear. Early cohort claims are variance, not signal.

## 7. Approval-Rate Signal

Both email_drafted events for HVAC carry `gmail_draft_id`. That means drafts are in Aiden's Gmail awaiting approval. Approval rate (drafts approved / drafts shown to user) is itself a leading indicator — if Aiden rejects 3 of 3 HVAC drafts, the H5-opportunity hook family is a copy problem, not a hook problem. Will track approval_rate per batch and per hook_family.

Blocker: prospector has not yet logged `email_approved` or `email_sent` events for either the plumbing or HVAC batch. Either the user has not acted, or the approval path is not instrumented. Will query prospector.

## 8. Next Actions

Analyst:
- [x] Draft this anchor document.
- [ ] Message prospector: schema drift fix + phone funnel schema spec.
- [ ] Message prospector: confirm email_approved / email_sent events will fire when user approves Gmail drafts.
- [ ] Watch for email_drafted event for 3rd HVAC email-ready lead.

Prospector:
- [ ] Restore `stage` and `sequence_step` meta on future email_drafted events (or schema v1.1 per §5).
- [ ] Spec phone outreach events (call_attempted / call_connected / conversation_held / meeting_booked).
- [ ] Instrument email_approved / email_sent events tied to Gmail draft state.

Boss:
- [ ] Decide whether to dispatch prospector to continue HVAC batch drafting (3rd email lead pending) or wait on user feedback on first 2.

---

*This is an internal analyst deliverable. Do not send externally.*
