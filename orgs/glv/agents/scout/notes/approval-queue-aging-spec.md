# Approval Queue Aging Widget — Implementation Spec
**Scout | For dev | User-approved Apr 24 2026**

---

## Problem

Approvals are created and queued but there is no visibility into how long they sit before a user decision. An approval queued 18h ago looks identical to one queued 2 minutes ago in the current UI.

## Proposed Changes

### 1. Add `queued_at` field to approval JSON

In `src/bus/approvals.ts` (or equivalent), when an approval is created:

```typescript
{
  id: approvalId,
  type: approvalType,
  description: description,
  queued_at: new Date().toISOString(),  // ADD THIS
  // ... existing fields
}
```

### 2. Dashboard widget — Approvals card

New card on the dashboard (Approvals tab or Activity sidebar):

**Display:**
```
Pending Approvals
─────────────────────────────
  approval_type        queued    age
  Deploy: Reyco PR     09:14     2h 41m   ← oldest, highlight if >4h
  Image gen: logo      11:23     32m
  Client deliverable   11:47     8m

Avg time-to-decision (last 7d):
  external-comms:      1h 12m
  deployment:          3h 44m
  image-generation:    28m
  client-deliverables: 2h 5m
```

**Highlight rule:** approval older than 2x its expected response time turns yellow; older than 4h turns red.

### 3. API endpoint

`GET /api/approvals/pending`

Response:
```json
{
  "pending": [
    {
      "id": "approval_...",
      "type": "deployment",
      "description": "...",
      "queued_at": "2026-04-24T09:14:00Z",
      "age_minutes": 161
    }
  ],
  "avg_decision_time_by_type": {
    "external-comms": 72,
    "deployment": 224,
    "image-generation": 28,
    "client-deliverables": 125
  }
}
```

`avg_decision_time_by_type` computed from `approval_routed` → `approval_decided` event deltas in activity log.

### 4. Event logging (for avg computation)

Ensure `approval_decided` events include `approval_id` and `queued_at` in meta so delta is computable:

```bash
cortextos bus log-event action approval_decided info --meta '{
  "approval_id": "...",
  "type": "deployment",
  "outcome": "approved|rejected",
  "queued_at": "...",
  "decided_at": "...",
  "latency_minutes": 161
}'
```

---

## Implementation Notes

- `queued_at` addition is backward-compatible (existing approvals without it show "unknown age")
- No schema migration needed if approvals are stored as flat JSON files
- Widget can be read-only first pass; no approval actions from dashboard (keep in Telegram)
- Polling interval: 60s (approvals don't change that fast)

## Files likely to touch

- `src/bus/approvals.ts` — add `queued_at` field
- `dashboard/app/api/approvals/route.ts` — new endpoint
- `dashboard/app/components/ApprovalsCard.tsx` — new widget component
- `dashboard/app/page.tsx` or approvals tab — mount widget

---

*Spec v1.0 | Scout | Apr 24 2026*
