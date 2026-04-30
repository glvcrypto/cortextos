---
name: brand-voice
description: Personal communication style guide. Ensures all agent-drafted content sounds like Aiden, not a robot. Use when drafting external communications or reviewing drafts.
---

# Brand Voice Skill

> Your personal communication style guide. Ensures all agent-drafted content sounds like you, not a robot. When working on client content, also validates against the client's brand identity.

## Trigger

- Drafting any external communication (email, message, post)
- Before sending any response on your behalf
- Manual: "check my voice" or "review this draft"

---

## Context Detection

This skill has TWO voice modes:

### Mode 1: Aiden's Personal Voice (default)
Used for: GLV Marketing communications, prospecting outreach, personal messages, internal docs.
Source: The style rules in this file.

### Mode 2: Client Brand Voice
Used for: Any content written ON BEHALF of a client (website copy, social posts, ad copy, email campaigns).

**If a client is specified**, check `projects/<client>/` for:

| File | What It Provides | How It Changes Your Output |
|------|-----------------|---------------------------|
| `brand/*-brand-identity.md` | Tone spectrum, personality traits, "sounds like" / "doesn't sound like" examples, messaging pillars | **THE source of truth for client voice.** Validate all copy against the tone spectrum positions. Check against "sounds like" examples. Flag anything that matches "doesn't sound like" patterns. |
| `strategy/marketing-director-plan.md` | Grand/small messages, positioning statement | **Messaging framework to validate against.** Copy should reinforce (not contradict) the positioning and message hierarchy. |

**When both modes apply** (e.g., Aiden writing a client email): Aiden's voice is the sender, but the content respects the client's brand positioning. Professional warmth (Aiden's style) + client messaging framework (Director plan).

**Precedence:** Client brand identity > Director plan messaging > Aiden's personal voice rules > general tone defaults.

---

## Your Communication Styles

### Personal Communications

**Style:** Friendly but complete sentences

Use for: Friends, family, casual texts, personal social media

```yaml
tone: Friendly but complete sentences
greeting: "Hey [name]"
signoff: "Cheers, Aiden"
formality: casual
```

### Professional Communications

**Style:** Professional but approachable

Use for: Work emails, business contacts, professional networking

```yaml
tone: Professional but approachable
greeting: "Hey [name]"
signoff: "Cheers, Aiden"
formality: professional
```

---

## Formality Levels

| Level | When to Use | Characteristics |
|-------|-------------|-----------------|
| **Casual** | Friends, family, close colleagues | Short, informal, greeting: Hey [name] |
| **Conversational** | Colleagues, acquaintances | Friendly but clear, brief |
| **Professional** | New contacts, clients | Clear, concise, professional |
| **Formal** | Legal, investors, VIPs | Full sentences, proper structure |

---

## Personality Markers

```yaml
greeting_style: "Hey [name]"
signoff_style: "Cheers, Aiden"
signature: "Aiden"

# Context-adjusted:
casual_greeting: "Hey [name]"
professional_greeting: "Hi [Name],"
formal_greeting: "Hello [Name],"

casual_signoff: "Cheers, Aiden"
professional_signoff: "Best,"
formal_signoff: "Best regards,"
```

---

## Do's and Don'ts

### Always Do

- Get to the point quickly
- Keep it short
- Match the energy of who you're responding to
- Be direct about asks
- Use simple language

### Never Do

- Use em-dashes in copy (use commas, periods, or parentheses instead)
- Give surface-level advice or generic responses
- Use AI cliches ("I hope this helps", "Great question!", "I'd be happy to")
- Sound robotic or overly formal when casual is appropriate
- Use filler phrases that add no value

### Word Choices

```yaml
never_use:
  - "synergy"
  - "leverage"
  - "circle back"
  - "per my last email"
  - "I'd be happy to"
  - "Great question!"
  - "I hope this helps"
  - "delve"
  - "tapestry"
  - "landscape"
```

---

## Templates by Context

### Personal Message

```
Hey [name],

[Direct point]

Cheers, Aiden
```

### Professional Email

```
Hi [Name],

[One sentence context if needed]

[Main point]

[Clear ask or next step]

Cheers,
Aiden
```

### Quick Message (iMessage, text)

- Keep it short
- Skip greetings for ongoing conversations
- Respond in kind to their style

---

## Validation Checklist

Before sending ANY communication, verify:

- [ ] Does this sound like Aiden? (Not robotic)
- [ ] Is the formality level right for this person?
- [ ] Is it short enough? (Can anything be cut?)
- [ ] No banned words/phrases?
- [ ] No em-dashes?
- [ ] Would Aiden be comfortable if this were public?

---

## Configuration Summary

```yaml
user_name: "Aiden"

voice_profile:
  personal_style: "Friendly but complete sentences"
  professional_style: "Professional but approachable"
  greeting: "Hey [name]"
  signoff: "Cheers, Aiden"

channel_defaults:
  email:
    formality: professional
    max_length: 150 words
  message:
    formality: casual
    max_length: 500 chars
```

---

*Your voice is your brand. Every message either builds or erodes trust. This skill ensures consistency.*
