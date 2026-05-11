---
name: fleet-experiments-rollup
description: "Aggregate experiment state across all GLV agents into a single rollup table. Shows per-agent keep rate, currently running experiments, stale experiment flags, and fleet-wide throughput stats. Used by analyst at theta-wave cycle close and on-demand."
triggers: ["fleet experiments rollup", "experiment rollup", "fleet experiment summary", "list all experiments", "experiments across agents", "fleet keep rate", "experiment throughput", "cycle-17 H1"]
external_calls: []
---

# Fleet Experiments Rollup

Produce a single-screen aggregate of experiment state across all GLV agents.

---

## When to Run

- Analyst theta-wave cycle open/close (fleet-wide H-item assessment)
- On-demand when Aiden or boss asks for experiment throughput
- After any cycle lock to capture post-lock state

---

## Step 1: Gather Data

### Option A — Local daemon (preferred)

```bash
AGENTS="ads analyst boss content designer dev imagegen pentester prospector scout seo web-copy"
for agent in $AGENTS; do
  echo "=== $agent ==="
  cortextos bus list-experiments --agent $agent
done
```

### Option B — Filesystem (cloud session, no daemon)

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
AGENTS_DIR="$REPO_ROOT/orgs/glv/agents"
python3 << 'PYEOF'
import json, os, glob, sys
from datetime import datetime, timezone

agents_dir = os.environ.get("AGENTS_DIR", "orgs/glv/agents")
agents = sorted([d for d in os.listdir(agents_dir)
                 if os.path.isdir(f"{agents_dir}/{d}") and not d.startswith("test-")])

rows = []
for agent in agents:
    hist_dir = f"{agents_dir}/{agent}/experiments/history"
    active_file = f"{agents_dir}/{agent}/experiments/active.json"
    config_file = f"{agents_dir}/{agent}/experiments/config.json"

    if not os.path.isdir(hist_dir) and not os.path.exists(active_file):
        continue

    history = []
    if os.path.isdir(hist_dir):
        for f in sorted(glob.glob(f"{hist_dir}/*.json")):
            with open(f) as fh:
                try: history.append(json.load(fh))
                except: pass

    active = {}
    if os.path.exists(active_file):
        with open(active_file) as fh:
            try: active = json.load(fh)
            except: pass

    config = {}
    if os.path.exists(config_file):
        with open(config_file) as fh:
            try: config = json.load(fh)
            except: pass

    decisions = [e.get("decision") for e in history if e.get("decision")]
    keep_count  = sum(1 for d in decisions if d in ("keep","implement"))
    discard_count = decisions.count("discard")
    total_decided = keep_count + discard_count

    # Stale check: running experiment whose window has likely expired
    stale = False
    if active and active.get("status") == "running":
        started = active.get("started_at","")
        window  = active.get("window","48h")
        if started:
            # parse window hours
            hours = int(window.replace("h","").replace("w","").strip()) if "h" in window else (
                    int(window.replace("w","").strip()) * 168 if "w" in window else 48)
            try:
                start_dt = datetime.fromisoformat(started.replace("Z","+00:00"))
                elapsed  = (datetime.now(timezone.utc) - start_dt).total_seconds() / 3600
                stale    = elapsed > hours * 1.5  # flag at 150% of window
            except: pass

    rows.append({
        "agent": agent,
        "total": len(history),
        "keeps": keep_count,
        "discards": discard_count,
        "total_decided": total_decided,
        "keep_rate": f"{keep_count}/{total_decided}" if total_decided else "—",
        "running": bool(active and active.get("status") == "running"),
        "active_metric": active.get("metric","") if active else "",
        "active_id": active.get("id","") if active else "",
        "active_window": active.get("window","") if active else "",
        "stale": stale,
        "last_decision": history[-1].get("decision","") if history else "",
        "last_metric": history[-1].get("metric","") if history else "",
        "cycle_name": (config.get("cycles") or [{}])[0].get("name","") if config.get("cycles") else "",
    })

# Fleet totals
fleet_total    = sum(r["total"] for r in rows)
fleet_keeps    = sum(r["keeps"] for r in rows)
fleet_discards = sum(r["discards"] for r in rows)
fleet_decided  = fleet_keeps + fleet_discards
fleet_running  = sum(1 for r in rows if r["running"])
fleet_stale    = sum(1 for r in rows if r["stale"])

print("## Fleet Experiments Rollup\n")
print(f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}\n")

print("### Per-Agent Summary\n")
print(f"{'Agent':<12} {'Hist':>4} {'Keep%':>8} {'Status':<28} {'Stale':>5}")
print("-" * 65)
for r in rows:
    if r["total"] == 0 and not r["running"]: continue
    pct = f"{round(r['keeps']/r['total_decided']*100)}%" if r["total_decided"] else "—"
    status = f"RUNNING: {r['active_metric'][:22]}" if r["running"] else (f"last: {r['last_decision']} ({r['last_metric'][:16]})" if r["last_decision"] else "no history")
    stale_flag = "⚠️" if r["stale"] else ""
    print(f"{r['agent']:<12} {r['total']:>4} {r['keep_rate']:>5} ({pct:>3}) {status:<28} {stale_flag:>5}")

print()
print("### Fleet Totals\n")
print(f"- Total experiments run: {fleet_total}")
print(f"- Decided: {fleet_decided} | Keeps+Implement: {fleet_keeps} | Discards: {fleet_discards}")
print(f"- Fleet keep rate: {fleet_keeps}/{fleet_decided} = {round(fleet_keeps/fleet_decided*100) if fleet_decided else 0}%")
print(f"- Currently running: {fleet_running}")
if fleet_stale:
    print(f"- ⚠️  Stale (>150% window): {fleet_stale}")

if fleet_running:
    print("\n### Active Experiments\n")
    for r in rows:
        if r["running"]:
            stale_flag = " ⚠️ STALE" if r["stale"] else ""
            print(f"- **{r['agent']}** — `{r['active_id']}` | metric: {r['active_metric']} | window: {r['active_window']}{stale_flag}")
PYEOF
```

---

## Step 2: Format Output

Produce the rollup in this structure:

```
## Fleet Experiments Rollup — <date>

### Per-Agent Summary
| Agent      | Experiments | Keep Rate  | Status                        |
|------------|-------------|------------|-------------------------------|
| analyst    | 13          | 10/13 (77%)| last: keep (override_retro)   |
| content    | 8           | 4/7  (57%) | RUNNING: content-quality      |
| dev        | 7           | 6/6 (100%) | last: implement (deploy_rel.) |
| ...        |             |            |                               |

### Fleet Totals
- Experiments run: N
- Fleet keep rate: X/Y (Z%)
- Currently running: N
- Stale (window expired): N  ← flag if any

### Active Experiments
- **agent** — exp_id | metric | window | started
```

---

## Step 3: Flag Anomalies

After producing the table, check for:

1. **Stale experiments** — running status but window elapsed >150%. Flag with `⚠️` and note agent + experiment ID.
2. **Zero-history agents** — agents with experiment config but 0 history entries. Note as "no experiments run yet."
3. **Low keep rate** (<40%) — agent may need cycle reconfiguration. Surface to analyst.
4. **No active experiments** — if all agents show no running experiment and window hasn't started, note as potential throughput gap.

---

## Step 4: Deliver

Post rollup to `#internal-dev` Slack channel (or send via Telegram if running as local daemon):

```bash
# Local daemon
cortextos bus send-telegram $CTX_TELEGRAM_CHAT_ID "Fleet Experiments Rollup:\n<summary>"

# Cloud session — Slack only
mcp__Slack__slack_send_message channel_id=C0APQ0TFS93 message="<rollup>"
```

If called by analyst at cycle close, include rollup in cycle lock notes.

---

## Output Contract

The skill always produces:
1. A per-agent table (only agents with experiment infrastructure)
2. Fleet totals block
3. Active experiments list (if any running)
4. Anomaly flags (if any)

Minimum viable output: one sentence per agent + fleet total line. Full table preferred.
