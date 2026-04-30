# Proposal Adoption KPI Widget — Spec
**Scout | Experiment #6 | 14-day cycle | Apr 24 2026**

---

## Purpose

Measure whether scout's daily upgrade proposals are shaping real change or being read-and-skipped. Closes the feedback loop so cadence/quality can be tuned empirically rather than by convention.

## Event Schema

### `proposal_made` event
Logged by scout each time a proposal is posted to #overnight-proposals.

```bash
cortextos bus log-event action proposal_made info --meta '{
  "agent": "scout",
  "proposal_id": "<YYYYMMDD-N>",
  "title": "<one-line proposal title>",
  "target_surface": "<what it touches>",
  "channel": "C0ATHEL5VJL",
  "slack_ts": "<message timestamp>"
}'
```

### `proposal_adopted` event
Logged by boss when user explicitly acts on a proposal (approved, modified, or incorporates it into a task/decision).

```bash
cortextos bus log-event action proposal_adopted info --meta '{
  "proposal_id": "<matching proposal_made ID>",
  "outcome": "approved|modified|rejected|superseded",
  "decision_agent": "user|boss",
  "days_to_decision": <N>,
  "notes": "<optional context>"
}'
```

## Proposal ID Convention

Format: `YYYYMMDD-N` where N is the sequence number within that day's batch.
Example: `20260424-1`, `20260424-2`, `20260424-3`

## Measurement Methodology (14-day cycle)

Track per proposal:
- `posted_at` (from `proposal_made`)
- `reviewed_in_am_brief` (boolean — boss notes when it surfaces)
- `outcome` (approved / modified / rejected / superseded / pending)
- `days_to_decision`

Roll up weekly:
- Count posted
- Count user-reviewed in AM brief
- Count adopted (approved + modified) / rejected / superseded / pending
- Adoption rate = (approved + modified) / (total decided)

## Success Criteria

- Adoption + modified rate ≥ 40% (proposals shaping real change)
- Rejected rate < 30% (quality holds)
- If rejected spikes: trade daily cadence for 2-3/week higher-quality

## Dashboard Widget Spec (for dev)

**New card on Activity or Proposals tab:**

| Metric | Display |
|--------|---------|
| Proposals this week | count |
| AM brief reviewed | count / % |
| Adopted | count (green) |
| Modified | count (yellow) |
| Rejected | count (red) |
| Pending | count (grey) |
| 14-day adoption rate | % with trend arrow |

Data source: filter `activity.log` for `proposal_made` + `proposal_adopted` event types, join on `proposal_id`.

**Implementation notes:**
- No new API endpoint needed — existing log-event + activity feed infrastructure
- Join logic: `proposal_adopted.proposal_id` = `proposal_made.proposal_id`
- Pending = `proposal_made` with no matching `proposal_adopted` within 7 days
- Widget lives at agent=scout scope (can be global later if other agents post proposals)

## Scout immediate action

Starting now: log `proposal_made` for all 3 proposals posted Apr 24 (retroactively, using approximate slack timestamps from this session).

## Boss consumption

Boss reads widget data at evening review. If adoption rate <40% after 7 days, flag cadence/quality trade-off in AM brief.

---

*Spec version 1.0 | Scout | Apr 24 2026*
