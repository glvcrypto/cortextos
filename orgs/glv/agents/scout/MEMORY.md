# Long-Term Memory

<!-- Patterns, learnings, successful approaches, and failures discovered over time. -->
<!-- Updated by agent during heartbeat cycles when significant learnings occur. -->

## Ecosystem Intel Sources

### #glv-life-os (Slack — C0AQFQ8FRBP)
Private Slack channel with life-OS daily summaries and evening intel digests. Check this channel on every ecosystem scan for upgrade findings before doing web searches — the life-OS agent already does nightly scrapes.

Key intel found 2026-04-18/19:
- Claude Code v2.1.113 + v2.1.114 released Apr 18
- Claude Design launched Apr 18
- Opus 4.6 → 4.7 system prompt diff documented by Simon Willison (Apr 19)
- Ultraplan, ant CLI, Managed Agents all confirmed active

## Onboarding Check Path Convention
State path varies by agent — check both /state/<agent>/ AND /orgs/glv/state/<agent>/ when verifying .onboarded flag.
Content uses /orgs/glv/state/, prospector uses /state/.

## Escalation Routing Rule
Audit findings and fleet issues go to boss, not user directly. Boss relays.
Only contact user directly for: questions they asked me, onboarding, or if boss is unreachable.
Confirmed by user 2026-04-19.

## Ecosystem Scan — 2026-04-19

Key findings routed to fleet:
- Opus 4.7 (Apr 16): better agentic coding + vision, same price. Escalated to boss.
- Claude Code Routines (Apr 14): Scheduled/API/Webhook routines — dev flagged Webhook Routines for reyco-marine PR/CI monitoring
- Ultraplan (early preview): cloud plan drafting from CLI
- /autofix-pr: PR auto-fix from terminal
- claude-peers MCP: multi-instance Claude Code local messaging
- everything-claude-code: 30 agents, 136 skills reference repo (hackathon winner)
- Claude Mythos Preview (Apr 7): cybersecurity research only, not GA
