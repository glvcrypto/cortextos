---
name: human-comms
description: Master protocol for all outbound human communication. Drafts messages for Aiden's review, routes to correct channel, manages approval. Use when needing to reach out to someone or respond to messages.
---

# Human Communications Skill

> Master protocol for all outbound human communication. Drafts messages for Aiden's review, routes to correct channel, manages approval.

## Trigger

- Any need to communicate externally
- Task requires contacting someone
- Follow-up reminder triggered
- Manual: "reach out to [person]" or "contact [person] about [topic]"

---

## Default Behaviour: Draft and Show

**All communications are drafted first, then shown to Aiden for approval.** Never send without explicit sign-off.

### Draft Review Format

```
Draft for [RECIPIENT] via [CHANNEL]:

---
[DRAFT_CONTENT]
---

Context: [WHY_THIS_MESSAGE]

Commands:
- "send" - send as-is
- "edit: [your changes]" - modify
- "skip" - cancel
```

---

## When to Draft vs When to Ask First

### Quick Reference

| Scenario | Action |
|----------|--------|
| Reply to friend's text | Draft |
| Cold outreach to prospect | Ask first |
| Thank you note | Draft |
| Negotiating terms | Ask first |
| Scheduling meeting | Draft |
| Delivering bad news | Ask first |
| Routine follow-up | Draft |
| First contact with VIP | Ask first |
| Confirming details | Draft |
| Anything uncertain | Ask first |

### Decision Tree

```
COMMUNICATION NEED identified

-> Is this a REPLY to existing thread?
   -> YES: Draft response (context exists)

-> Is recipient in known contacts?
   -> YES: Draft allowed

-> Is this ROUTINE communication?
   (scheduling, confirming, thanking)
   -> YES: Draft allowed

-> Does this involve:
   - Commitment or promise?
   - Sensitive topic?
   - New relationship/first contact?
   - Negotiation?
   -> YES: ASK before drafting

-> Uncertain?
   -> ASK: "I think I should [action]. Should I draft something?"
```

---

## Channel Routing

### Available Channels

1. **Email** (info@glvmarketing.ca) - Professional, formal, detailed
2. **Telegram** (@glvclaude_bot) - Quick notifications, task updates, heartbeat pushes
3. **Discord** (GLVClaude bot) - GLV-specific quick tasks

### Channel Selection

| Message Type | Primary Channel |
|--------------|-----------------|
| Client communication | Email |
| Professional outreach | Email |
| Quick internal update | Telegram/Discord |
| Detailed discussion | Email |
| Time-sensitive alert | Telegram |

### Contact Preferences

```yaml
contacts:
  "Joseph & Kathryn (Titan)":
    preferred: email
    context: client, website rebuild
  "JB & Tony (Fusion)":
    preferred: email
    context: client, website + ads
  "Adri":
    preferred: text
    context: personal, girlfriend
  "Tracy":
    preferred: text
    context: personal, mom
  "Phil":
    preferred: text
    context: personal, dad
  "Kurtis":
    preferred: text
    context: personal, brother
  "Ben & Jroth (BNS)":
    preferred: signal
    context: work, BNS bosses
    note: "Signal has no automation - flag for manual send"
  "D/Mali (BNS)":
    preferred: signal
    context: work, BNS inventory
    note: "Signal has no automation - flag for manual send"
```

---

## Brand Voice Integration

All drafted communications MUST pass through the brand-voice skill:

```yaml
brand_voice:
  skill_path: ".claude/skills/brand-voice"
  always_validate: true

validation_checklist:
  - Sounds like Aiden (not robotic)
  - Correct formality level for recipient
  - No em-dashes
  - No AI cliches
  - No banned phrases
  - Short enough (can anything be cut?)
```

---

## Autonomy Boundaries

```yaml
autonomous:
  - Draft for review
  - Suggest channels
  - Apply brand voice
  - Prepare follow-up reminders

needs_approval:
  - Send any communication
  - Contact new person

never_without_asking:
  - Send to group/list
  - Make commitments
  - Communicate sensitive topics
  - Anything involving BNS (flag for manual)
```

---

## Configuration

```yaml
user_name: Aiden

defaults:
  drafting_mode: draft_and_show
  new_contact_approval: ask_first
  routine_reply_approval: draft_review
  all_sends: require_approval

channels:
  available:
    - email (info@glvmarketing.ca)
    - telegram (@glvclaude_bot, Bot API)
    - discord (webhook, one-way)

  unavailable:
    - signal (no API, flag for manual)
    - imessage (no integration)

  default_by_type:
    client: email
    personal: text (flag for manual)
    glv_internal: discord
```

---

*Communication is trust made visible. Every message represents Aiden. Handle with appropriate care and always show drafts before sending.*
