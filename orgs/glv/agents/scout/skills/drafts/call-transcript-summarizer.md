---
name: call-transcript-summarizer
description: DRAFT — Design spec for auto-summarizing call transcripts into structured task lists and routing to the triage file. SCOUT/ANALYST skill. Not yet built.
status: draft
authored_by: scout
date: 2026-04-20
---

# Call Transcript Summarizer — Skill Design

## Purpose

Given a raw call transcript (text file or inline), produce:
1. A structured triage table matching the `transcript-triage-YYYY-MM-DD.md` format used by boss
2. Optional: auto-create `cortextos bus create-task` entries for high-confidence P0/P1 items
3. A short plain-language summary for the morning brief or Telegram digest

## When to Use

- After any client call (Reyco, Fusion, BNS, new leads)
- After Aiden/Ben strategy calls where action items are scattered in conversation
- Batch-processing accumulated transcripts from Ben's morning brief comms

## Input Sources

| Source | Path / Command | Notes |
|--------|---------------|-------|
| Ben transcripts | `life-os/projects/glv-marketing/comms/` | Morning brief digests |
| Telegram saved messages | Manual paste or file path | User copies call notes |
| Recorded call transcript | File path argument | .txt, .md, or .docx |
| Inline text | Piped via stdin | For quick one-offs |

## Output Format

### 1. Triage Table (primary output)

Matches boss's canonical format from `orgs/glv/agents/boss/state/transcript-triage-YYYY-MM-DD.md`:

```markdown
# Transcript Task Triage — [Client/Topic] [Date]

## Legend
- ✅ DONE — no action
- 🟡 PARTIAL — verify or finish
- 🔴 TODO — dispatch or hold
- 🔵 USER — user-only action (Aiden)
- 🟣 BEN — Ben-owned
- ⚫ N/A — out of scope or deferred
- 🧱 BLOCKED — waiting on external party

## [SECTION NAME] ([item range])
| # | Item | Status | Route |
|---|------|--------|-------|
| 1 | [extracted action item] | [inferred status] | [inferred agent/person] |
...

## Dispatch Plan
### [AGENT]:
- P0: [items]
- P1: [items]
### USER ACTIONS:
- [items that require Aiden]
### HOLD / DEFER:
- [items]
```

### 2. Brief Summary (secondary output — for morning brief / Telegram)

```
📋 [Client] call — [N] items extracted
- [N] TODO / [N] BLOCKED / [N] USER action
- Top P0: [1-2 most critical items]
- Sent to: [agents dispatched]
```

### 3. Optional: Bus task creation

For items with clear owner + priority, auto-create tasks:
```bash
cortextos bus create-task "[item description]" --desc "[context from transcript]"
```
Only fire if confidence is high — prefer draft mode (write to triage file, let boss dispatch).

---

## Extraction Logic (prompt engineering)

### System prompt design

The model should extract against these categories:

```
For each item in the transcript, classify:
- TYPE: action_item | decision | blocker | follow_up | question | info_only
- OWNER: user (Aiden) | ben | dev | seo | content | prospector | ads | scout | analyst | boss | external_[name]
- PRIORITY: P0 (go-live blocker) | P1 (active sprint) | P2 (post-launch) | P3 (nice-to-have) | HOLD
- STATUS: todo | partial | blocked_on:[dependency] | done | n/a
- BLOCKER: [what's blocking, if any]
- NOTES: [relevant context from transcript]

Output as JSON array, then render as triage table.
```

### Routing heuristics (built into prompt)

| Keyword pattern | Route to |
|----------------|---------|
| "website", "WordPress", "SiteGround", "plugin", "form" | dev |
| "SEO", "keywords", "GBP", "listing", "blog post" | seo |
| "email", "outreach", "lead", "prospect", "cold" | prospector |
| "Facebook", "Instagram", "ads", "campaign", "Meta" | ads |
| "content", "copy", "post", "caption" | content |
| "I'll", "Aiden will", "you should", "can you" (to Aiden) | user |
| "Ben will", "Ben is" | ben |
| "waiting on [person]", "need [person] to" | blocked |
| "not sure", "unclear", "need to check" | boss review |

---

## Implementation Path

### Phase 1 (MVP — skill file only, human in loop)
- Skill reads transcript file → pipes to claude with extraction prompt
- Outputs triage markdown to stdout
- Human (boss or user) reviews and saves to `boss/state/transcript-triage-YYYY-MM-DD.md`
- No auto-dispatch

**Estimated effort:** 2-3h (analyst or scout can build)

### Phase 2 (semi-automated)
- Outputs triage file directly to boss state
- Sends boss a message with summary + asks for dispatch approval
- Boss reviews and runs dispatch

### Phase 3 (full automation)
- Cron or trigger on new file in comms/ directory
- Auto-creates P0 tasks via `cortextos bus create-task`
- Sends morning brief entry automatically
- Boss spot-checks

---

## Dependencies

| Dependency | Status | Notes |
|-----------|--------|-------|
| Claude API access | ✅ available | Long-context model for transcripts |
| Transcript file format | ✅ confirmed | Markdown (.md), pre-processed Otter/Fireflies output. Path: `/mnt/c/Users/joshu/Desktop/Agentic Workspace/life-os/projects/glv-marketing/comms/` (e.g. ben-mar-18.md) |
| Routing table confirmation | ✅ derived from triage-2026-04-19.md | Matches existing dispatch plan |
| Boss approval for Phase 2+ | 🔴 needed | Phase 1 is safe to build now |

---

## Risk / Anti-Patterns

- **Do not auto-dispatch without boss review** — routing errors create noise for specialists
- **Do not create tasks for info_only items** — only action_items and follow_ups become tasks
- **Confidence threshold for auto-create:** only if owner + priority are both unambiguous
- **Never summarize client-sensitive info to public channels** — triage files stay in `boss/state/`

---

## Suggested Next Step

1. Boss approves Phase 1 scope
2. Analyst or scout builds the `cortextos bus summarize-transcript` wrapper script + extraction prompt
3. Test on the existing `transcript-triage-2026-04-19.md` source material (retroactive validation)
4. Ship to `skills/call-transcript-summarizer/SKILL.md` once validated

---

## Related Skills
- `skills/ecosystem-sources/SKILL.md` — event meta schemas (use `action/domain_scan` for logging)
- `orgs/glv/agents/boss/state/transcript-triage-2026-04-19.md` — canonical output format reference
