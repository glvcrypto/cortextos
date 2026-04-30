# Cycle-2 Design Draft — Visual Review Accuracy (Prospective Forward Measurement)

**Status:** DRAFT pending analyst review before promotion to proposed.md → current.md
**Predecessor:** cycle-1 (`exp_1776987054_d9j3b`), re-framed as setup-cycle
**Architecture decision:** Path C + sub-option C1 (analyst lock msg 1777357602027)
**Window:** 14d minimum (21d if denominator thin at week-1 mark)

---

## Hypothesis (carried forward from cycle-1)

The mandatory Section 0 (Falsifiable Observation Pre-Flight) at the top of the visual review checklist — separating observation from interpretation, requiring the 4-probe template before asserting any cause/mechanism — raises user-agreement rate on flagged issues vs the prior anti-pattern-prose-at-bottom version.

Cycle-1 deferred effect-size measurement (n_pre=0 by structure). Cycle-2 measures prospectively with paired-event instrumentation across the full denominator.

---

## Architecture — Path C + C1

### Why this architecture (not just accuracy — measurement integrity)

In a designer-unilateral emit model (Path A), the agent being measured controls BOTH numerator (corrections classified) and denominator (calls emitted). Two failure modes both bias toward inflated accuracy:

- Forgetting to emit at QC delivery → undercount denominator → rate inflates
- Retroactive misclassification → motivated reasoning, even unintentional → numerator suppression → rate inflates

Both fail in the same direction. Self-grading at scale, even unintentionally.

**Path C separates ownership:** designer owns the "call made" emit (always knows when), receivers own the "outcome" emit (have no incentive to suppress correction signals — if anything, opposite incentive). Designer cannot inflate accuracy by suppressing correction signals because those come from receivers.

**Discipline anchor — source-of-truth-drift:** this is structurally identical to two other discipline patterns observed this session: (a) re-grounding visual-review markup against current rendered screenshot vs last-cycle assumption, (b) re-grounding sift labels against canonical doc vs conversation thread (analyst self-flag msg 1777357631476). All three are: source-of-truth-drift between time-of-original-write and time-of-current-reference. Path C bakes the discipline into the measurement architecture.

### Path C: paired emit
- Designer emits `visual_call_event{call_id, ts, target, classification_self}` at every QC delivery
- Receiver (boss / dev / web-copy / pentester) emits `visual_call_outcome{call_id, ts, outcome ∈ {agreed, corrected, disputed}, correction_bucket if corrected}` when accepting/correcting/disputing
- Aggregator pairs by `call_id` at metric compute time

### Sub-option C1: direct-Telegram carve-out
Aiden is not an agent and does not emit events. Three sub-paths considered (C1 / C2-route-through-boss / C3-drop). Locked C1: designer self-emits both events for direct-Telegram path, tagged `self_classified=true`.

This produces two-metric reporting:
- **`accuracy_paired`** = (paired correction events / paired call events) — PRIMARY metric, integrity-preserved
- **`accuracy_self`** = (self-classified corrections / self-classified calls) — SECONDARY, flagged as bias-prone subset

Aiden can read both: if `accuracy_paired` and `accuracy_self` diverge meaningfully → bias signal. If they converge → low-bias prior strengthens.

Direct-Telegram corrections are the cycle-1 trigger source — they're real signal. C1 captures them with an explicit bias caveat rather than dropping them.

---

## call_id Pairing Implementation

**Derivation rule:** `call_id` = originating message_id (for inbox-relayed calls) OR task_id (for task-driven calls) OR `direct-tg-{ts}-{nonce}` (for direct-Telegram path, self-classified).

**Emit shape (designer-side):**
```jsonl
{"event":"visual_call","call_id":"<id>","ts":"<iso>","target":"<url|asset|spec>","classification_self":"<self_or_paired>"}
```

**Emit shape (receiver-side):**
```jsonl
{"event":"visual_call_outcome","call_id":"<id>","ts":"<iso>","outcome":"agreed|corrected|disputed","correction_bucket":"<bucket-name|null>","superseded_by":"<event_id|null>"}
```

**`superseded_by` field:** when a later outcome event lands for the same `call_id` (e.g. Aiden corrects at t+24h after receiver agreed at t+1h), the prior event gets tagged `superseded_by=<new_event_id>` rather than deleted. Source-of-truth-drift discipline: the prior event was scope-correct at write-time, superseded by later authoritative signal. Aggregator joins on `call_id`, takes the latest non-superseded outcome.

**Authority precedence:** Aiden direct correction > receiver outcome (Aiden = ground truth, receiver = surrogate). When both exist for one `call_id`, Aiden's outcome supersedes regardless of timestamp order.

**Aggregation:** join on `call_id`. Orphaned events (one side emits, other doesn't) bucket as `unpaired`. Healthy instrumentation produces low orphan rate; rising orphan rate is a health signal worth surfacing.

**Storage:** designer emits to `experiments/runs/cycle-2/visual_call_events.jsonl`; receivers emit to their own log paths and the aggregator pulls from a known set (`~/.cortextos/default/logs/<agent>/visual_call_outcomes.jsonl`).

---

## Measurement Coding Rubric

Updated for cycle-2 with `disputed` state machine (analyst lock msg 1777357896596). Locked at activation, do not drift mid-window:

| User response | Outcome | Numerator |
|---|---|---|
| Agrees with call (verdict matches) | `agreed` | yes (positive) |
| Corrects my call (different verdict / disputes substance) | `corrected` | yes (negative) |
| Agrees but adds NEW flag I missed | `corrected` | yes (negative — miss is a miss) |
| Agrees issue exists but disputes severity tier | `corrected` | yes (negative) |
| Pushback without alternative ("can you verify?") | `disputed` (open state) | excluded pending resolve |
| No response within 24h | excluded | no |
| Ambiguous (rubric gap) | `AMBIGUOUS` | excluded; propose rubric amendment for cycle-3 |

### `disputed` state machine
- `disputed` event resolves to `agreed` or `corrected` via follow-up signal
- `disputed` STILL OPEN at metric compute time → excluded from BOTH numerator and denominator. Mirrors the "no response within 24h" rule: a permanently-open dispute means accuracy is literally not yet determined; counting either way is fabrication.
- `disputed` >24h with no resolution → designer surfaces to analyst as discipline issue (receiver pushback without resolution = process gap, not metric gap).

Correction bucket (carried forward from cycle-1 taxonomy + extended):
- `visual-rationalization-vs-screenshot`
- `layout-mechanism-vs-relocate`
- `screenshot-reconciliation-miss`
- `no-source-on-challenge`
- `other / unclassified`

Auth-boundary corrections explicitly **out of scope** for this cycle; banked under separate observable.

---

## Window + Sample Power

**Primary window:** 14d (2026-04-30T23:57Z + 14d ≈ 2026-05-14).
**Extension trigger:** if at week-1 mark (n=7d) the denominator is still <20 paired calls, extend to 21d.
**Hard floor:** ≥10 correction events for any clustering call. If still below floor at 21d, surface to analyst for cycle-3 design (likely calls for full denominator instrumentation review or post-launch re-base).

---

## Prerequisites Before Cycle-2 Activation

Cycle-2 cannot meaningfully run until these emit hooks land:

1. **Designer-side emit hook** — designer writes `visual_call_event` to local jsonl on every QC delivery. Trivial; can ship in <1h.
2. **Boss-side outcome emit hook** — boss writes `visual_call_outcome` when ACK'ing or correcting designer calls. Requires boss agent skill addition.
3. **Dev-side outcome emit hook** — same shape as boss; dev's correction signal differs in kind (technical-correctness vs visual-quality), so bucket choice is dev-aware.
4. **Receiver-side hook for web-copy / pentester** — same shape; activates only if those agents become receivers (currently rare for visual calls).

Aggregator script can land alongside cycle-2 activation; not a strict prerequisite but cleaner to have at activation time.

**Aiden direct-Telegram path** does NOT need an emit hook — designer self-emits both sides with `self_classified=true` per C1.

---

## Open Questions — RESOLVED (analyst lock msg 1777357896596)

1. **`disputed` vs `corrected`:** RESOLVED — introduce `disputed` as third outcome with state machine (see Measurement Coding Rubric above).
2. **Late-arriving correction precedence:** RESOLVED — latest non-superseded outcome wins; tag prior with `superseded_by`. Aiden authority supersedes receiver regardless of order (see emit shape spec).
3. **Cycle-1 corpus carry-forward:** RESOLVED — cycle-1 corpus is **taxonomy-reference, NOT cycle-2 dataset entry**. Mixing instrumentation regimes (manual-walk vs paired-emit) conflates instrumentation-quality with rate differences. Cycle-1 corpus stays accessible for taxonomy-comparison: if cycle-2 surfaces a 4th distinct bucket within first 5 events, that's a signal to revisit taxonomy assumptions (cycle-1 having 3 buckets at n=3 is bucket-discovery sample limitation, not bucket-set validation).

---

## Risk Surface

- **Receiver-side under-emit:** if boss/dev forget to emit outcome events, orphan rate rises, denominator under-reports. Mitigation: orphan rate is a surfaced health signal; analyst monitors at week-1 mark.
- **Self-classification bias drift on direct-Telegram path:** carry-forward risk from cycle-1. Mitigation: two-metric reporting + explicit bias caveat in cycle-1 outcome → cycle-2 design.
- **Bucket drift mid-cycle:** add new bucket to taxonomy mid-cycle = contamination. Mitigation: lock bucket list at cycle-2 activation; ambiguous events tagged `AMBIGUOUS`, excluded, raise rubric amendment for cycle-3.

---

*Drafted 2026-04-28 by designer; pending analyst review before promotion to proposed.md → current.md.*
