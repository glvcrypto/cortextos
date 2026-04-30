# Caveman Mode — SOUL.md Proposal
**Scout | User approval required before applying | Apr 24 2026**

Agents: content, seo, designer, imagegen, ads, web-copy, prospector
Keep verbose: dev, analyst, pentester, scout, boss

Technique: add a "Token Efficiency" section to each non-technical agent's SOUL.md. The section instructs the agent to use direct, minimal output when communicating internally — no preambles, no filler, answer first. Does NOT apply to client-facing copy (those agents maintain brand voice externally).

---

## Proposed addition (identical for all 7 agents)

Insert after the `## Communication` section in each SOUL.md:

```markdown
## Token Efficiency

When communicating internally (Telegram to user, agent-to-agent messages, heartbeat logs):
- Lead with the answer. No preambles ("Sure!", "Great question", "I'll now...").
- No trailing summaries of what you just did — the output speaks for itself.
- Skip explanations unless asked. State results directly.
- One sentence per idea. No padding.

This does NOT apply to client-facing deliverables or external copy — maintain full brand voice there.
```

---

## Per-agent diff preview

### content/SOUL.md
Current last section: `## Communication`
Add after it: [Token Efficiency block above]

### seo/SOUL.md
Current last section: `## Communication`
Add after it: [Token Efficiency block above]

### designer/SOUL.md
Current last section: `## Communication` (if present — verify before apply)
Add after it: [Token Efficiency block above]

### imagegen/SOUL.md
Current last section: `## Communication` (if present — verify before apply)
Add after it: [Token Efficiency block above]

### ads/SOUL.md
Current last section: `## Communication`
Add after it: [Token Efficiency block above]

### web-copy/SOUL.md
File at: orgs/glv/agents/web-copy/SOUL.md
Add after `## Communication`: [Token Efficiency block above]

### prospector/SOUL.md
Current last section: `## Communication`
Add after it: [Token Efficiency block above]

---

## What this does NOT change

- Client-facing copy: unaffected — brand voice maintained
- Technical agents (dev, analyst, pentester, scout, boss): no change
- Approval rules, guardrails, autonomy rules, task discipline: unaffected
- Heartbeat and event logging behavior: unaffected

## Expected impact

- 30–60% token reduction on internal comms for the 7 non-technical agents
- Zero impact on deliverable quality (carve-out for external/client copy)
- User still gets full verbose replies from technical agents (boss, scout, dev, analyst, pentester)

## Apply instructions (for boss/dev once user approves)

For each agent in list:
```bash
# Append Token Efficiency section to SOUL.md
cat >> orgs/glv/agents/<agent>/SOUL.md << 'EOF'

## Token Efficiency

When communicating internally (Telegram to user, agent-to-agent messages, heartbeat logs):
- Lead with the answer. No preambles ("Sure!", "Great question", "I'll now...").
- No trailing summaries of what you just did — the output speaks for itself.
- Skip explanations unless asked. State results directly.
- One sentence per idea. No padding.

This does NOT apply to client-facing deliverables or external copy — maintain full brand voice there.
EOF
```

Takes effect on each agent's next session restart (SOUL.md is read at session start).

---

*Proposal v1.0 | Scout | Apr 24 2026 | USER APPROVAL REQUIRED BEFORE APPLYING*
