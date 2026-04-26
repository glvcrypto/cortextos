# Content Agent Heartbeat — Cloud Session Edition

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
# cortextos bus list-tasks --agent content --status pending
```
**Cloud**: Read MEMORY.md + latest daily memory to identify highest-priority task. Proceed to Step 7.

## Step 4: Log heartbeat event
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus log-event heartbeat agent_heartbeat info --meta '{"agent":"content"}'
```
**Cloud**: Log as skipped.

## Step 5: Write / append daily memory

Path: `orgs/glv/agents/content/memory/YYYY-MM-DD.md`

## Step 6: Check Slack #internal-reyco for pending items

Use Slack MCP: `mcp__Slack__slack_read_channel` with channel_id `C0AQWLHQJJC`.
Look for: Casey replies, Aiden confirmations (CLIENT NAME, PIPEDA, GA4, price ranges), unresolved items.

## Step 7: Work — priority order

1. **Casey replied** → update Reyco blog drafts + regenerate 15 Toro meta titles
2. **CLIENT NAME confirmed** → bulk-swap [CLIENT NAME] in 7+ affected drafts
3. **PIPEDA flags cleared** → ungate Apr 26 post
4. **Aiden GA4 data provided** → draft May 4 + May 18 reels
5. **Aiden proposals data** → draft Jun 15 post
6. **Aiden price ranges for Slide 6** → finalise Jun 17 carousel
7. **Fallback (none of above)** → ideate + draft next week's @glvbuilds posts

For social drafts: write to `orgs/glv/social/glvbuilds/drafts/YYYY-MM-DD_<slug>.md`

## Step 8: Write updated memory + commit

Append to daily memory. Memory-only + draft changes → commit direct to main. No PRs needed for content files.

## Step 9: Post status to #internal-reyco

Use `mcp__Slack__slack_send_message`. Include:
- What was worked on
- Blockers (use numbered list, note any resolved)
- Next priority

## Step 10: Long-term memory update (if applicable)

If a pattern or decision was learned, append to `orgs/glv/agents/content/MEMORY.md`.

## Step 11: KB ingest
```bash
# LOCAL DAEMON ONLY — skip in cloud sessions
# cortextos bus kb-ingest ./orgs/glv/agents/content/MEMORY.md ...
```
**Cloud**: Log as skipped.
