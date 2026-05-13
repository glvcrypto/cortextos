# Theta-Wave Cycle-19 Phase 7 Actuation-Integrity Test Spec Draft

**Cycle fired:** 2026-05-13 05:56Z (24h cadence)
**Phase 6 closed:** 06:02Z May 13 (3-round async w/ boss)
**Bundle locked for AM brief:** 12:03Z May 13
**Author:** Jerry (analyst)

---

## Locked Spine

**FLEET-LEVEL RECONCILIATION GAP.** Consumer-side check assumes a producer-side write that didn't happen, happened wrong, or was killed-by-intent. Graduates to parent-class status with n=4 sub-vectors.

### Sub-Vectors (n=4)

| Vector | Producer Behavior | Consumer Phantom | Source-Type |
|--------|-------------------|------------------|-------------|
| A. Cron-fire gap | Daemon fires cron but doesn't auto-stamp; convention-enforced prompt-side stamping inconsistent | check-approvals reads stale fire-stamp, alerts on phantom-gap | Single-source missing-data |
| B. Cycle config persist | manage-cycle create executes cron-add but cycle definition write to experiments/config.json drops (linter/merge/race) | other agents read experiments/config.json, treat as authoritative, downstream cycle dispatch fails silently | Single-source missing-data |
| C. Cloud-session heartbeat skip | Cloud-session agents (dev, content) skip update-heartbeat by design (can't write local daemon) | read-all-heartbeats applies uniform 5h STALE threshold, fires false-positive STALE | Single-source missing-data |
| D. Kill-state dual-source | User-direction kill executes config.json edit + daemon CronDelete + agent banks kill-intent locally | Later config.json revert (linter/auto-format/merge) restores killed entry; consumer reads config as authoritative without cross-referencing banked kill-intent | Dual-source which-source-wins |

---

## Phase 7 Detector Design (Two Deliverables)

### Detector 1: Write-then-Read Roundtrip on `manage-cycle create`

**Targets vector B (cycle config persist gap)**

**Mechanism:** After `cortextos bus manage-cycle create <agent> --cycle <name> ...` executes the underlying write to `<agent>/experiments/config.json`, the tool immediately reads back the file and verifies the new entry persists. If verification fails, the tool emits an error with the partial-write state and refuses to return success.

**Implementation surface:**
- `src/bus/manage-cycle.ts` (or equivalent): append post-write read+parse+grep step
- Failure mode: throw a structured error with: which file expected to contain entry, what was read, and what was missing
- Success mode: existing behavior unchanged

**Acceptance criteria:**
- Cycle-18 Phase 7 dispatch failures (seo post_publish_to_index_velocity + pentester audit_items_shipped reverts) would have caught the missing entry at write-time, not 14h later at next theta-wave fire
- No new false positives on cycles that DO persist correctly
- Roundtrip latency adds ≤50ms to manage-cycle create (acceptable)

**Single-source class.** Verifies the write happened. Doesn't address dual-source classification (D handled by Detector 2's logic extension below).

---

### Detector 2: Cloud-Session Class-Flag in `read-all-heartbeats`

**Targets vector C (cloud-session heartbeat skip)**

**Mechanism:** Agent config exposes `heartbeat_mode: "local"` (default) or `heartbeat_mode: "cloud_session"`. When `read-all-heartbeats` scans the fleet, cloud-session agents are suppressed from the STALE threshold check; their liveness is reported as "cloud-session, check owning Slack channel" instead of "STALE".

**Implementation surface:**
- Each agent's `config.json` adds top-level `heartbeat_mode` field (defaults to `local`)
- `src/bus/read-all-heartbeats.ts` (or shell wrapper): branch on heartbeat_mode before applying STALE threshold
- dev, content, and any future cloud-session agents flip to `cloud_session`

**Acceptance criteria:**
- dev (perma-STALE-since-2026-05-10) drops the STALE label, reads as "cloud-session, check Slack #internal-dev"
- content drops the false-positive STALE label
- Local-mode agents (boss, analyst, seo, etc.) unchanged
- read-all-heartbeats stays a one-line-per-agent compact format

**Single-source class.** Eliminates the phantom-event at source by routing to the correct liveness check.

---

### Carrying D (kill-state dual-source): Extension Path Not New Detector

D is dual-source which-source-wins: config IS canonical under normal conditions; only post-explicit-kill does banked-intent become authoritative.

**Phase 7 stance:** Do NOT add a Detector 3 in cycle-19. D's mitigation is the already-banked rule `feedback_kill_intent_vs_revert_state.md` (agents bank kill-intent locally + cross-reference at config-read). Detector design for D would require shared kill-intent state across the fleet (centralized ledger), which is cycle-20+ scope.

**Cycle-19 closes D as:** banked-rule mitigation sufficient at n=1 (cycle-18 seo cron kill worked example). If D fires a second instance in cycle-19/20, escalate to shared-ledger detector design.

---

## Score Conditions

- **8/10 KEEP (baseline match):** umbrella locked + n=4 close + Phase 5 external research lands + Phase 6 substantive (already met by P6 close at 06:02Z)
- **9/10 CEILING BREAK:** above + Detector 1 + Detector 2 specs land in code (dev dispatch) + at least one detector verified working on real fleet state

---

## Three AM-Brief Asks for Aiden (12:03Z bundle)

1. **Cycle-19 hypothesis adjudication.** Greenlight the umbrella + n=4 graduation framing? Pushback on any sub-vector classification?

2. **Phase 7 detector spec greenlight.** Both detectors feasible cycle-19 window? Dispatch to dev for implementation, or hold for further sift?

3. **Pentester halt-adjudication or narrow cross-umbrella commission.** Pentester proposed parallel temporal-discipline-ledger-candidate that overlaps mine. Either (a) adjudicate halt-holding day-5 so pentester engages fully, OR (b) narrow-scope commission for the cross-umbrella analytical check (read-only, ~30min scope). Falls back to working-classification + cycle-20 discrepancy review if neither.

---

## Phase 6 Worked Examples (banked this cycle)

### Worked Example #1: Self-banked-rule miss (analyst-side)
- R1 boss pushback: analyst flagged content STALE at 5h40m, missing feedback_cloud_session_liveness.md class-check
- Banked: cycle-18 P3 recursion-catch pattern firing again at cycle-19 P6 R1. Rule's first application target was the bank itself.

### Worked Example #2: Banked-rule cross-application caller-side (analyst-side)
- R3 analyst pushback: boss recommended pentester dispatch overnight, missing feedback_peer_agent_posture_changes_need_user_consent.md
- Banked: peer-as-quality-control fired CALLER-side this time (cycle-18 was RECEIVER-side imagegen refusing analyst dispatch)

### Sub-Pattern Candidate (n=1, sift criterion for graduation)
- **SYMMETRIC-BIDIRECTIONAL-PUSHBACK.** Both authors of banked rules, both reading from each other's banks in real-time, both catching each other's misses within same Phase 6 window (~30min span).
- Distinct from ASYMMETRIC pattern (cycle-18 caller-banked-receiver-applied, one direction)
- Hold as worked example unless cycle-20+ Phase 6 lands n=2 symmetric instance → graduate

---

## Overnight Status (06:47Z lock)

- Phase 6 closed
- Phase 7 spec draft (this file)
- AM brief 12:03Z surface ready
- No pentester dispatch overnight (banked rule honored)
- Next analyst heartbeat: 08:47Z
- Sleep window holding (02:00-12:00 UTC nighttime EDT)
