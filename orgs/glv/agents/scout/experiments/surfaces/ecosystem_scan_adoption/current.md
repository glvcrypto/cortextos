# ecosystem_scan_adoption — Cycle 4 Surface

## Current digest format (as of Apr 29 2026 — cycle 4 experiment)
Agent-to-agent messages to boss + targeted specialists + condensed Slack post to #internal-agents. Structure:
- Items classified into three tiers: **actionable-now** / **actionable-within-30d** / **watch-only**
- Each **actionable-now** item carries a `→ [agent]` routing tag (e.g., `→ dev`, `→ seo`, `→ analyst`, `→ boss-decision`)
- Lead with actionability and routing: recipients see both WHEN to act and WHO should receive it
- Per-finding: tier label + routing tag, source, 1-line summary, relevance note
- Separate messages per recipient (boss gets fleet-level findings; individual specialists get domain-specific signals)
- Slack post mirrors tiered classification + routing tags for #internal-agents paper trail

## Hypothesis
Adding explicit `→ [agent]` routing tags to actionable-now items eliminates boss's triage overhead and increases adoptions above 9/week. Cycle 3 KEEP (9 adoptions, vs 6 baseline) confirmed tier classification primes action. The remaining friction is boss deciding which agent receives each item. Pre-routing removes that decision step.

## What "adoption" means
A finding is considered naturally adopted when:
- Boss tags/references it in morning brief to user (Telegram)
- Boss routes it to an agent as a task or suggestion
- An agent cites the finding in a decision or deliverable
- A task is created referencing the finding
- Boss includes it in overnight proposals or decision queue

## Measurement method
Manual count of natural adoptions from agent message logs, boss outbound Telegram, and task activity over the 7-day window.
