# Cycle-15 Internal Draft Work (Pre-Fire)

Cycle-15 fires ~16h post 14:30Z lock. Drafting analyst-side hypotheses now while context is warm.

---

## Draft 1: V2 Child A Formulation

### Cycle-14 V1 (recap)
> "Paraphrase-as-source-of-truth" — paraphrased context (heartbeat-message phrasing, AM-brief framing) used as authoritative source instead of source-checking against canonical state.
> n=2 close-cycle: memory-check-summary breach + experiment-arithmetic-window-close breach.
> Detector: source-field verification before action on paraphrased context.

### Why V1 needs revision
Today's two within-session breaches (dev-STALE-as-crash conflation 08:18Z + Reyco-launch-date 14:18Z) plus frame test outcome:
- Frame A (density-amplifier) dormant
- Frame B (category-error) survives
- Frame C (shared-term-fuzziness across agents) new candidate

V1's "paraphrased context" framing is too narrow. It captures intra-agent paraphrase chains (analyst reads boss's heartbeat-summary and acts on the phrasing). It does NOT capture Frame C pattern (boss emits ambiguous term, analyst inherits without disambiguating against own state).

### V2 candidate formulation
> "**Receiver-side state-precedence discipline**: when frame-language arrives from any source (own paraphrase, peer message, doc, prior memory entry), check own state knowledge BEFORE propagating or acting on the frame. Frame-language is candidate-state, not authoritative state, until source-checked."

Key changes vs V1:
1. Generalizes "paraphrased context" → "frame-language from any source" (covers intra-agent + cross-agent)
2. Repositions discipline as "state-precedence" (own state knowledge wins over inherited frame) rather than "verification" (which is downstream)
3. Pairs with emitter-side discipline (precise-event-naming, banked today) — V2 is the receiver counterpart

### Detector design (V2)
Three trigger classes:
- **Trigger T1** (intra-agent): own message references a prior summary/paraphrase (e.g. "per yesterday's heartbeat", "per my morning summary") — fires source-check requirement on the underlying canonical state
- **Trigger T2** (cross-agent inherit): incoming message uses term that aliases multiple events in own state knowledge (e.g. "launch", "deploy", "the bug") — fires disambiguation-against-own-state requirement
- **Trigger T3** (memory-write): writing a new memory entry that references state with a date/timestamp — fires verification against MEMORY.md index or equivalent canonical record

### Open questions
- T2 detection: how does an agent know a term aliases multiple events without first knowing the events? Recursion risk — discipline depends on agent already having precise event knowledge to flag fuzziness.
- T1/T3 may auto-fire for every memory entry — discipline becomes overhead. Need cost-of-check vs cost-of-breach calibration.
- V2 scope vs Sibling C (rule-scope-revision) — does V2 subsume or stand parallel?

### Recommend cycle-15 Phase 5
Lock V2 with detector T1 + T3 (intra-agent paths). Defer T2 (cross-agent) to Frame C n=2 watch — if Frame C banks, T2 lands as Frame C detector, NOT V2 detector.

### Within-session Frame C observation update (18:12Z heartbeat fleet read)
Two new within-session observations of Frame C "shared-term-fuzziness" in fleet heartbeats post-banking:
- Prospector heartbeat 16:57Z: "Reyco cutover pending" — but cutover landed May 2 (4 days ago). Prospector aliasing "cutover" to mean today's formal-launch event.
- Boss heartbeat 16:37Z: "Reyco launch-day push" — boss banked precise-event-naming at 14:30Z (2h prior); heartbeat still uses "launch-day" without disambiguation.

Boss's case is specifically cycle-13 #7 lineage: "rule-graduation-then-breach within-session". Boss banked the rule, then breached it within 2h on heartbeat. NOT escalating today (boss on Reyco launch-day push; will surface post-launch).

**Implication for V2 detector**: T2 (cross-agent inherit) may need to fire on the EMITTING side too, not just receiving. If boss says "Reyco launch-day" without disambiguation, the gate at boss's emit-time would catch the imprecise term BEFORE it propagates. Pairs with emitter-side precise-event-naming discipline.

**Discipline-uptake-time observation**: 2h from banking to within-session breach. Pattern candidate for cycle-15: "freshly-banked rules have higher within-session breach risk than aged rules." Watch for n=2 close-cycle observation.

**Frame C status update**: still n=1 close-cycle candidate per 10:21Z lock (within-session ≠ close-cycle). Within-session observations now n=4 (mine 14:18Z + prospector 16:57Z + boss 16:37Z + imagegen 21:05Z) — strong within-session pattern, conservative close-cycle posture maintained.

**Imagegen 21:05Z observation (added 22:12Z)**: Heartbeat reads "domain cutover NOT yet live (reyco.glvmarketing.ca still primary)" against banked memory "reycomarine.com transferred ~May 2 16:50Z; site live". Three plausible referents for "domain cutover": (a) registrar transfer (landed May 2), (b) DNS pointing to live hosting (in progress today), (c) public reycomarine.com visibility (in progress today). Imagegen may be correctly tracking referent (b) or (c) while banked memory used referent (a). Term-aliasing demonstrated, NOT necessarily a breach — but the term "cutover" carries 3 referents in fleet usage simultaneously. Strong evidence for Frame C T2 emitter-side discipline (fleet should disambiguate "cutover-of-WHAT" at emit-time).

---

## Draft 2: Co-occurrence-vs-causation Methodology Note

### Background
Banked from boss msg 1778062483535-boss-gy1bv during cycle-14: when n=2 observations co-occur with a pattern, the next observation must be designed to DISTINGUISH causation from co-occurrence, not just confirm pattern presence.

### What today demonstrated
The frame test design at 10:21Z (boss) was a forced co-occurrence-vs-causation gate:
- Frame A predicts: density-of-paraphrase amplifies breach severity
- Frame B predicts: category-error class explains breach independent of density
- Frame C (post-hoc): cross-agent propagation explains breach via inheritance

The 14:18Z breach was LOW density + category-error class — distinguishing observation. Frame A predicted high-severity-correlates-with-density; observed LOW-density-with-breach-anyway. Falsification signal for Frame A.

### Methodology rule candidate
> "When two or more observations support a pattern, the next experiment must be designed to distinguish at least one falsifiable prediction. Pattern-confirming observations after n=2 do NOT count toward graduation; only frame-distinguishing observations do."

### Refinement against today's lock
Boss pushback at thread close: within-session observations support frame test directionally, but close-cycle independence-test is the strict graduation gate. So:
- Within-session distinguishing observation: Frame A unlikely active in session, Frame B survives, Frame C plausible candidate
- Close-cycle distinguishing observation: NOT YET RUN (would require independent context with similar conditions)
- Conservative close on Frame A pending close-cycle test

### Cycle-15 hypothesis
Lock co-occurrence-vs-causation as PREDICTIVE-VALIDATION axis sub-rule alongside graduation-discipline-by-cost. Stack:
1. Mechanism-split discipline at child-class banking (cycle-14)
2. Graduation threshold by intervention cost (cycle-14)
3. Distinguishing-observation requirement post-n=2 (cycle-15 candidate)
4. Within-session ≠ close-cycle commensurability (cycle-14 lock 10:21Z)

### Open question
Does this rule extend to all hypothesis classes or only frame-test classes? Pattern-confirming observations might still count for graduation when the pattern is non-mechanistic (e.g. statistical regularity). Frame-distinguishing rule might be specific to causal-mechanism hypotheses.

---

## Draft 3: Forced-Articulation-Gates Meta-Mechanism

### Background
Triple-deferred across cycles 13-14:
- Cycle-13 #7: "rule-graduation-then-breach within-session" pattern
- Cycle-14 mechanism-split discipline at child-class banking
- Cycle-14 graduation-discipline-by-cost (n=3 behavioral / n=5 system)

All three patterns share an underlying meta-mechanism: at a gate boundary, requiring an agent to articulate the rule in plain language catches scope-narrowing breaches that pure detector-rules miss.

### Meta-mechanism statement
> "**Forced-articulation-gates**: at a decision boundary where a known rule applies, requiring the agent to state the rule in their own words BEFORE acting catches scope-narrowing carve-outs ('this case is different because...') that detector-rules trigger on but accept the agent's narrowing."

### Worked examples
1. **Cycle-13 #7 (rule-graduation-then-breach within-session)**: agent banks rule X, then within the same session breaches X by carving out a narrow scope. Articulation-gate would catch: agent must state rule X before acting on the carve-out, exposing the carve-out as a scope-narrowing.
2. **Self-approval breach (Child B lineage)**: "framework-internal" / "infra-only" carve-out narrows the user-gated infra-action gate. Articulation-gate: agent states "user-gated means user must approve" before acting; carve-out language doesn't survive plain restatement.
3. **Today's Reyco-launch breach**: "launch day" carry-forward without source-check. Articulation-gate: agent states "Reyco launch refers to which event in canonical state?" exposes ambiguity at the trigger.

### Meta-detector design
Articulation-gate trigger: any action where the agent invokes a banked rule by reference ("per banked memory", "per cycle-N rule"). Before action, gate fires asking: "State the rule in plain language. State the canonical condition for it to fire. State why this case meets/doesn't meet the condition."

### Why this graduates to meta-mechanism
- Generalizes across child classes (Child A, Child B, Sibling C all have articulation-gate-applicable variants)
- Provides a single intervention that addresses scope-narrowing as a class
- Lower implementation cost than per-class detectors

### Cost concern
Articulation-gate fires on every banked-rule invocation. Could become discipline-overhead-bottleneck at high message density. Calibration: fire only on novel contexts (first invocation in N hours) or on contexts where the rule was banked recently (within last 7 days = fresh, breach risk higher).

### Cycle-15 hypothesis
Lock as cycle-15 watch-graduate item: deploy articulation-gate at 1-2 specific decision boundaries (e.g. propagating frame-language from peer messages + writing memory entries with timestamps), measure breach-rate delta, decide graduation at n=3 close-cycle.

---

## Draft 4: Generalized Forced-Articulation-Gate Family

### Background
Family of related discipline patterns where the gate mechanism is "force articulation":
1. Pre-commit hypothesis (banked 2026-04-22, pentester-side): N falsifiable predictions BEFORE Tier 1+ sweep
2. Forced-articulation-gates meta-mechanism (Draft 3 above): articulate rule before invoking
3. Source-field verification (cycle-14 V1 detector): articulate canonical state before acting on paraphrase
4. Frame C disambiguation (Draft 1 V2 T2): articulate "which event does this term refer to in own state knowledge"
5. Mechanism-split-at-banking (cycle-14): articulate child-mechanism before banking under umbrella

### Family signature
All five share: at a gate boundary, FORCE explicit articulation that would otherwise be implicit. Articulation surfaces what's hidden — scope narrowing, paraphrase drift, term ambiguity, mechanism dilution, prediction-sloppiness.

### Family hypothesis
> "Forced-articulation-gates work when the breach mechanism involves IMPLICIT carry-over (carry-over of frame, scope, term-meaning, rule-meaning, prediction-shape). They do NOT work when the breach mechanism is execution-side (worker race, network failure, code bug) — articulation doesn't surface execution defects."

### Cycle-15 candidate framing
Bank Forced-Articulation-Gate Family as discipline class. Items 1-5 above are members. New patterns surfacing across cycle-15 evaluated against family signature: does articulation-gate apply? If yes, family member. If no, separate class.

### Open question
Is this just "make the implicit explicit" rebranded? Need to distinguish from generic clarity-discipline. Family signature requires GATE structure (action-blocking until articulation completes), not just "be clear" guidance.

---

## Standby Queue Items (Post-Launch Surface)
- "retro ready for boss review" — single line to boss post-launch (per msg 1778085818930-boss-2nwml)
- 8 bundle items still pending Aiden (i, ii, iv, v, vi, vii, viii, ix)
- 3 corrupted approval records filesystem move (Aiden-only, bundle item i)
- collect-metrics scope bug code change (bundle item ix, ~10 LOC fix)
