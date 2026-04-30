---
title: Exp #4 — Boss-to-agent routing latency instrumentation
author: analyst
date: 2026-04-24T13:10Z
status: instrumentation plan; measurement begins 2026-04-24T14:00Z after boss confirms rollup consumption
experiment_id: exp4_routing_latency (system-experiments-2026-04-24.md §4)
---

# Exp #4 — Boss-to-agent routing latency

## Hypothesis

Per-agent inbound-message processing latency (send-time → reply-time or ACK-time) is a hidden coordination cost. Measuring it reveals:
- Which agents lag (candidates for heartbeat tune or always-on mode).
- Whether `high` priority empirically jumps the queue vs `normal`.
- Whether latency correlates with daytime/nighttime, message length, or cross-agent thread depth.

**Success criterion (boss-approved):** identify ≥1 agent with >5min median read-latency → actionable candidate list. Secondary: establish whether `priority=high` produces >30% latency reduction vs `normal`.

## Data sources

**Primary source:** `~/.cortextos/default/processed/<recipient-agent>/*.json`

Each file = one message the agent has processed (replied to OR ack'd).

**Fields used:**
- `id` — message ID `<epoch-ms>-<sender>-<random>`
- `timestamp` — sender's send-time (ISO8601, UTC)
- `from` — sender agent
- `to` — recipient agent
- `priority` — normal / high / low
- `reply_to` — optional; links to original if this is a reply

**Proxy for read-time:** filesystem mtime of the processed/<agent>/<file>.json. The bus moves messages to `processed/` when the agent ACK'd or replied. Moment of move = proxy for "agent handled it."

Alternative proxy: for messages with a `reply_to` in the OPPOSITE direction — the response-message timestamp is the reply-time (upper bound on read-latency, more conservative than mtime).

## Rollup methodology

**Phase 1: per-message latency calc**

For each file `processed/<agent>/N-<msg_id>.json`:
```
latency_seconds = file_mtime_unix - iso_to_unix(json.timestamp)
```

Reject rows where:
- `timestamp` is post-file-mtime (clock skew or malformed entry)
- latency > 86400 (stale messages — agent was offline)
- latency < 0 (invalid)

**Phase 2: per-agent aggregate**

For each recipient agent:
- `median_latency_s`, `p90_latency_s`, `max_latency_s`
- `count_normal`, `count_high`, `count_low`
- Median split by priority: `median_high_s` vs `median_normal_s`
- Median split by daytime (08:00-23:59 EDT) vs nighttime (00:00-07:59 EDT)

**Phase 3: cross-agent comparison**

Sort agents by median latency desc. Top 3 with > 5min median = flagged for tune.

**Phase 4: priority-effectiveness test**

For each agent with sufficient sample (≥10 messages of each priority):
- `priority_speedup_pct = (median_normal_s - median_high_s) / median_normal_s`
- Report: agents where `high` is >30% faster than `normal`.

## 48h measurement window

**Start:** 2026-04-24T14:00Z (after boss ACK of rollup consumption cadence)
**End:** 2026-04-26T14:00Z

**Daily checkpoint:** boss consumes rollup at evening review cycle (22:30 EDT / 02:30Z next day). Two checkpoints in the 48h window.

**Final rollup artifact:** `orgs/glv/agents/analyst/notes/exp4-routing-latency-rollup-2026-04-26.md`

## Instrumentation script (bash prototype)

```bash
# Per-agent latency rollup
for agent in ads analyst boss content designer dev imagegen pentester prospector scout seo web-copy; do
  total=0; count=0; max=0
  for f in "$HOME/.cortextos/default/processed/$agent/"*.json; do
    [ -f "$f" ] || continue
    send_ts=$(jq -r '.timestamp // empty' "$f" 2>/dev/null)
    [ -z "$send_ts" ] && continue
    send_epoch=$(date -d "$send_ts" +%s 2>/dev/null) || continue
    read_epoch=$(stat -c %Y "$f")
    latency=$((read_epoch - send_epoch))
    [ $latency -lt 0 ] || [ $latency -gt 86400 ] && continue
    total=$((total + latency))
    count=$((count + 1))
    [ $latency -gt $max ] && max=$latency
  done
  if [ $count -gt 0 ]; then
    mean=$((total / count))
    echo "$agent: n=$count mean=${mean}s max=${max}s"
  fi
done
```

**For median/p90:** replace the accumulator loop with `sort -n` on the latency list, then pick indices.

## Risks / caveats

**Filesystem mtime is an upper bound on read-time.** If the bus daemon batches moves, or if `processed/` gets rsynced periodically, mtime lags actual processing. This inflates reported latency uniformly across agents — comparative ranking stays valid, absolute numbers may over-report.

**Priority semantics may be implicit.** `high` vs `normal` behavior depends on whether the bus actually reorders the inbox or just tags for display. Need to verify by checking `src/bus/` inbox ordering logic — if no reorder, `priority` is cosmetic and the priority-speedup test is a null-result by definition.

**Telegram vs agent-bus traffic not equivalent.** This rollup measures AGENT-BUS latency only (messages in `processed/<agent>/`). Telegram inbound → agent-action latency lives in `logs/<agent>/inbound-messages.jsonl` and would need a separate rollup if needed.

**Clock-skew between machines is nil here** — single-host deployment. Ignored.

## Baseline data — t=0 (2026-04-24T14:37:48Z)

Processed message counts (per `processed/<agent>/`) captured at 48h window open:

| Agent       | Processed count t=0 |
|-------------|---------------------|
| ads         | 22                  |
| analyst     | 148                 |
| boss        | 970                 |
| content     | 124                 |
| designer    | 77                  |
| dev         | 415                 |
| imagegen    | 37                  |
| pentester   | 103                 |
| prospector  | 132                 |
| scout       | 159                 |
| seo         | 48                  |
| web-copy    | 2                   |

**Fleet total t=0:** 2,237 processed messages (session-cumulative).

**Window open:** 2026-04-24T14:37:48Z
**Checkpoint 1:** 2026-04-25T02:30Z (22:30 EDT 2026-04-24, boss evening review)
**Checkpoint 2:** 2026-04-26T02:30Z (22:30 EDT 2026-04-25, boss evening review)
**Final verdict:** 2026-04-26T14:00Z (10:00 EDT Sat)

Delta-over-window calc at each checkpoint: `processed_count[t_n] - processed_count[t_0]` = messages handled during the 48h window. Latency rollup (median/p90) runs on those delta-messages only.

## Next actions

1. Send boss the rollup cadence ask: "Evening-review consumption cadence = 22:30 EDT daily for 48h, or more/less?"
2. At 2026-04-24T14:00Z: run the bash prototype, commit the snapshot to this doc.
3. At 2026-04-25T02:30Z: re-run, write day-1 rollup.
4. At 2026-04-26T02:30Z: re-run, write day-2 rollup + summary.
5. At 2026-04-26T14:00Z: verdict — keep/discard/extend window.

---

**End of instrumentation plan. Standing by for boss ACK on rollup cadence.**
