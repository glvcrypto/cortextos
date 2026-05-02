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

---

## Scan Log — Cycle 4 Data Points

### 2026-05-02 scan (day 4 of 7d window)
Routing tags used: `[scout→boss]`, `[scout→dev]`, `[scout→pentester]`

**Findings sent:**
- `[scout→boss]` — Claude Opus 4.7 upgrade decision + Claude Managed Agents context (actionable-now: boss-decision)
- `[scout→dev]` — /ultrareview command + everything-claude-code repo (actionable-within-30d)
- `[scout→pentester]` — pentest-ai-agents (DUPLICATE — already triaged 2026-05-01; dedup gap; not a valid experiment send)

**Boss routing behavior observed:**
- Boss received [scout→boss] message, immediately produced per-agent evaluation framing (analyst + dev = lean-upgrade, others stay on 4.6) and queued for Aiden AM brief. Routing tag removed boss's triage step — boss went directly to evaluation framing rather than "who should I route this to?" deliberation. Consistent with hypothesis.
- Claude Managed Agents: boss confirmed "tracking only" and independently banked cortextOS-architecture-ahead positioning note. No triage overhead observed.

**Noise:**
- pentest-ai-agents send was a duplicate — should not count toward adoption measurement. Dedup gap fixed with triaged-signals.json.

**Adoption candidates (pending 7d window close 2026-05-06T14:41Z):**
- Opus 4.7 queued in AM brief (strong adoption signal pending Aiden decision)
- /ultrareview routed to dev (adoption TBD)
