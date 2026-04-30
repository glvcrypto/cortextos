---
title: Onboarding + autoresearch wrapper — spec v0
author: analyst
date: 2026-04-24
status: DRAFT for boss review (Task A, overnight proposal #3, user green-lit 23:52 EDT Apr 23; design sketch locked with boss earlier this cycle 00:43 UTC)
related_task: task_1776993688380_435
scope: design only, no code — boss overnight guardrail
---

# Onboarding + autoresearch wrapper — spec v0

## 1. One-line summary

Insert a domain-research step between default onboarding flow and the `.onboarded` flag write, so new agents self-check their just-configured identity against their domain surface and surface gaps to the user before declaring complete. Optional post-onboard drift cycle keeps the check recurring as the domain evolves.

## 2. Problem

Current onboarding (`.claude/skills/onboarding/SKILL.md`):
```
Step 1: Check .onboarded flag
Step 2: Read ONBOARDING.md
Step 3: Run bootstrap writes (IDENTITY, SOUL, GOALS, USER, GUARDRAILS, .env, config.json)
Step 4: touch .onboarded
Step 5: Remove the skill
```

Agent is declared "functional" the moment the bootstrap files exist, with zero validation that:
- The goals in GOALS.md are achievable given what the agent can actually see in knowledge.md / fleet state
- The autonomy rules in SOUL.md contradict (or don't) org-wide GUARDRAILS
- Listed skills actually exist
- Credentials referenced in GOALS have a provisioned path
- The agent's assigned domain (client, channel, stack) has a current state the agent understands

Observable consequence: agents onboard, then burn first 1-2 cycles discovering gaps that could have been caught at onboarding. Designer agent (spawned 2h09m ago this session) is currently blocked on 5 user answers — all of which a domain-research pass could have surfaced in one batched ask at onboarding time.

## 3. Proposed wrapper — one new step, gated completion

Insert **Step 3.5: Domain Research + Gap Surface** between Step 3 and Step 4. `.onboarded` flag CANNOT be written until Step 3.5 returns "no blocking gaps." Non-blocking gaps are logged as known-unknowns to MEMORY.md; agent proceeds.

### Step 3.5 sub-flow (five loops)

```
a. LOAD domain surface
   - Per-agent config at .claude/skills/onboarding/domain-surfaces/<agent-type>.md
   - Defines which files, dirs, commands, and external URLs to ingest for this agent role

b. RUN contradiction pass
   - Diff just-written IDENTITY/SOUL/GOALS/USER/GUARDRAILS vs domain surface
   - Score each contradiction 1-10 severity
   - Sample checks (from YAML rules):
     - "credential reference in GOALS without matching knowledge.md entry = 8"
     - "skill listed in SOUL not installed in .claude/skills = 9"
     - "goal references client not in enabled-agents.json roster = 7"

c. GENERATE gap questions
   - Batch top-5 highest-severity gaps into structured questions:
     {
       gap: "GOALS references Soo Sackers but knowledge.md has no Soo Sackers entry",
       evidence: "GOALS.md line 7 mentions 'Soo Sackers GSC audit'; grep knowledge.md shows zero matches",
       proposed_default: "Treat as sub-client of Reyco for initial scope; flag for knowledge.md update",
       severity: 8,
       blocking: true
     }

d. SURFACE to user
   - Batch all blocking gaps (severity >= 7) into ONE Telegram message
   - Wait up to 4 hours for user reply
   - On reply: update relevant bootstrap file with user answer; re-run b-c to see if more gaps open
   - On timeout: apply proposed_default, log as assumption to MEMORY.md, notify user "proceeded with defaults on X items; review anytime"

e. LOOP b-d until zero blocking gaps remain
   - Non-blocking gaps (severity < 7) → MEMORY.md as "known unknowns"
   - Then proceed to Step 4 (.onboarded flag)
```

### Where it hooks

- **Shared SKILL.md:** `templates/agent/.claude/skills/onboarding/SKILL.md` — insert Step 3.5 between current Step 3 and Step 4
- **New helper script:** `src/bus/onboarding-research.ts` — runs contradiction scan, generates gap questions, manages the surface-and-wait loop (keeps SKILL.md prose light, reusable across agents)
- **Per-agent config:** `.claude/skills/onboarding/domain-surfaces/<agent-type>.md` with YAML frontmatter (see §4)

## 4. Domain-surface config pattern

Per-agent customization lives in its own file so it's editable by agent owners without touching the shared SKILL.md. Example:

```yaml
---
name: dev
ingest:
  files:
    - README.md
    - package.json
    - CLAUDE.md
    - .github/workflows/*.yml
  dirs:
    - src/
    - tests/
  commands:
    - "git log --oneline -20"
    - "cortextos bus list-agents"
    - "gh pr list --limit 10"
  external:
    - "github PRs last 7d on active client repos"
severity_rules:
  - "goal references client repo not accessible via gh = 9"
  - "skill listed in SOUL not installed in .claude/skills = 9"
  - "credential referenced in GOALS without entry in knowledge.md = 8"
  - "package in package.json marked deprecated per npm audit = 7"
  - "README.md mentions a file not in repo = 5"
---
```

Each agent template ships a default domain-surfaces config for its role. Agent owner can edit post-onboarding without re-running the wrapper.

## 5. Design decisions — all locked with boss this cycle

| # | Decision | Lock |
|---|---|---|
| 1 | Blocking severity threshold | **≥ 7 / 10 only** (avoids onboarding paralysis; non-blocking logged to MEMORY.md) |
| 2 | Gap-question batch cap | **5 hard cap** initially; overflow logged as known-unknowns; revisit if real agents routinely overflow |
| 3 | User-response timeout | **4 hours → proposed_default auto-applied + user notified** ("proceeded with defaults on X items; review anytime") |
| 4 | Existing-agent backfill | **New agents only**; existing agents opt in via `/domain-research` command |

Boss's addition (adopted): domain-surface config lives at `.claude/skills/onboarding/domain-surfaces/<agent-type>.md` with YAML frontmatter — cleaner than per-ONBOARDING.md blocks, editable independently.

## 6. Per-agent domain surface examples

| Agent | Files/dirs | Commands | External |
|---|---|---|---|
| dev | repo tree, package.json, recent PRs, client site list | `git log`, `cortextos bus list-agents`, `gh pr list` | github PRs last 7d |
| content | brand voice docs, `#internal-<client>` Slack recent msgs, content calendar | `cortextos bus list-tasks --tag content` | Slack recent |
| analyst (self) | fleet heartbeat snapshot, all agents' latest experiments, theta-wave history | `cortextos bus read-all-heartbeats`, `cortextos bus list-experiments --json` | n/a |
| prospector | TAM definition, current send gate state, copy approval history | `cortextos bus list-experiments --agent prospector` | n/a |
| seo | client GSC access list, schema templates, audit queue | `cortextos bus list-tasks --tag seo` | GSC cached state |
| **Generic template** | MEMORY.md, org knowledge.md, GOALS.md | `cortextos bus list-agents` | n/a |

## 7. Optional: recurring domain-drift cycle (phase 2)

After wrapper proves value on ≥3 new agents, add an optional weekly drift cron that re-runs Step 3.5 against current state:
- Metric: `domain_gaps_found_per_cycle`
- Direction: lower is better
- Surface: agent's bootstrap files (IDENTITY/SOUL/GOALS/USER/GUARDRAILS)
- Window: 7 days
- Hypothesis loop: if a new gap recurs 3× in 3 consecutive cycles → propose bootstrap amendment to agent owner

Defer build of this phase until:
- Wrapper v0 has run on ≥3 new agents
- Post-Reyco launch (Apr 27+) stabilisation window observed for ≥1 week

## 8. Wrapper self-metric (keep-discard loop on the wrapper itself)

Wrapper watches itself. After ≥3 new-agent onboardings:
- **Metric:** `questions_asked / real_gaps_found` ratio (measured post-first-week of new agent ops)
- **KEEP** if ratio is near 1 (each question surfaced a genuine gap)
- **DISCARD** (reassess severity_rules) if ratio >> 1 (wrapper is noisy) OR << 1 (wrapper is missing gaps — false negatives caught in agent's first cycles)
- Theta-wave cycle N+3 post-rollout does the keep-discard call

## 9. Implementation plan

| Phase | Work | Est |
|---|---|---|
| 1 | Edit shared SKILL.md — insert Step 3.5 prose | 30 min |
| 2 | Build `src/bus/onboarding-research.ts` helper (contradiction scan, gap-question generator, surface-and-wait loop) | 2 hr |
| 3 | Write domain-surfaces/ default templates for each current agent role | 1 hr |
| 4 | Test on next new agent spawn (canary) | 30 min |
| **Total** | | **~4 hr** |

Start condition: post-Reyco launch (Apr 26 + 1 week observation window) → target Apr 27+ if Reyco clean, slide otherwise.
Task task_1776993688380_435 tracks; currently in_progress as of this spec, will flip back to pending after spec lands with boss until Reyco clear.

## 10. Rollout

1. Boss + user review this spec, amend if needed, green-light
2. Analyst builds (4h, single session)
3. Canary on next fresh agent spawn (whoever that is — could be a second pentester, a second dev, a new client-facing specialist)
4. Observe first-week metrics (questions_asked / real_gaps_found)
5. If ratio healthy, apply to all new spawns going forward
6. Existing agents continue on legacy onboarding unless they invoke `/domain-research` explicitly

## 11. Not-in-scope for v0 (follow-ups)

- **Recurring drift cycle** (phase 2 — see §7)
- **Auto-PR for bootstrap amendments** when a gap is confirmed 3× — manual user review still required in v0
- **Cross-agent contradiction detection** (e.g. two agents claim the same client channel) — single-agent scope only in v0
- **Dashboard surface for pending onboarding gaps** — logs to MEMORY.md + Telegram is enough for v0

## 12. Risks

| Risk | Mitigation |
|---|---|
| Severity rules are subjective, first-pass calibration will be off | Start with 5-rule minimum per agent, expand based on real gaps found |
| User gets swamped if multiple agents onboard in the same window | 4-hour timeout + proposed_default ensures no agent blocks indefinitely |
| Wrapper runs on half-complete onboarding (crash mid-Step-3) | Wrapper's Step 3.5a load-surface step includes an idempotence check — re-runnable from any state |
| Domain surface config drifts out of date as codebase evolves | Phase-2 drift cycle catches this; interim: agent owner edits surfaces config when they notice |

## 13. Open questions — all locked with boss

Four opens from design sketch all locked with boss's matching leans. No un-resolved opens as of spec v0 draft. If boss/user flag new ones on review, spec goes to v0.1.

---

**End of spec. Task A (task_1776993688380_435) spec deliverable complete; task stays in_progress until boss review, then back to pending until post-Reyco.**
