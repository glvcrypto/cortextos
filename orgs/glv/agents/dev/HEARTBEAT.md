# Dev Agent Heartbeat — Cloud Session Edition

Runs on heartbeat cron (every 4h). Execute every step. Skipped steps must be logged in daily memory so the local agent picks them up.

## Step 1: Update heartbeat status
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus update-heartbeat "<summary>"
# cortextos bus update-cron-fire heartbeat --interval 4h
```
**Cloud**: Log as skipped. Note current work summary in daily memory instead.

## Step 2: Check inbox
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus check-inbox
```
**Cloud**: Log as skipped.

## Step 3: Check task queue
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus list-tasks --agent dev --status pending
```
**Cloud**: Read GOALS.md to identify highest-priority task. Proceed to Step 7.

## Step 4: Log heartbeat event
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus log-event heartbeat agent_heartbeat info --meta '{"agent":"dev"}'
```
**Cloud**: Log as skipped.

## Step 5: Write daily memory

```bash
TODAY=$(date -u +%Y-%m-%d)
MEMORY_DIR="orgs/glv/agents/dev/memory"
mkdir -p "$MEMORY_DIR"
cat >> "$MEMORY_DIR/$TODAY.md" << MEMORY

## Heartbeat Update - $(date -u +%H:%M UTC)
- WORKING ON: <task_id or description>
- Status: <healthy/working/blocked>
- PRs: <any PR updates>
- Next action: <what happens next>
MEMORY
```

## Step 6: Check Slack #internal-dev for pending items

Use Slack MCP: `mcp__Slack__slack_read_channel` with channel_id `C0APQ0TFS93`.
Look for unresolved items, blockers, or messages needing a reply.

## Step 7: Work — from GOALS.md, pick highest-priority task

Priority order:
1. PR review asks / open reviewer questions
2. Bug-fix PRs with merge-blocking items
3. Active client workstreams (Reyco)
4. Infrastructure / tooling improvements

For GitHub work: use `git` + Bash. PRs via `mcp__github__*`.

## Step 8: Write updated memory + commit

Append to `orgs/glv/agents/dev/memory/$(date -u +%Y-%m-%d).md`.

Memory-only changes → commit + push directly to main.
Code changes → branch + PR.

## Step 9: Post status to #internal-dev

Use `mcp__Slack__slack_send_message`. Include:
- What was worked on
- What shipped (PR numbers, commits)
- Current blockers

## Step 10: Long-term memory update (if applicable)

If you learned something new this cycle, append to `orgs/glv/agents/dev/MEMORY.md`.

## Step 11: KB ingest
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus kb-ingest ./orgs/glv/agents/dev/MEMORY.md ...
```
**Cloud**: Log as skipped.
