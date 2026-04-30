# Prospecting A1 Spec
*Authored: 2026-04-20*
*Status: DRAFT — awaiting user review before implementation*
*Purpose: Define what "A1 autonomous send/book" means for the GLV prospecting pipeline, identify gaps, and specify the behavior changes required.*

---

## What A1 Means

**A0 (current):** Pipeline is autonomous end-to-end through draft. Every email requires per-email approval at the review gate. Sending is manual (Aiden sends from Gmail). Booking detection is manual. No dedup. No cooldown enforcement. No phone funnel events.

**A1 (target):** Pipeline remains autonomous. Approval gate stays for cold outreach (locked by DELIVERABLE rule + CASL). Sending happens programmatically on approval within the send window. Booking events are auto-detected from Google Calendar. Dedup and cooldown are enforced automatically. Phone funnel is tracked. The agent is fully instrumented — every lead action generates a dashboard event.

**What does NOT change at A1:**
- ~~Per-email approval gate for cold outreach~~ **REMOVED 2026-04-20 by user directive**: Scout's qualified shortlist = send list. No per-lead SEND/EDIT/SKIP gate. User directive: "Lead picking is stupid, I want to outreach everyone who seems good."
- CASL: one-time intro only, no follow-up sequences, ever
- SSM = in-person briefing pack, no email
- Hard cap: 100 emails sent per UTC day
- Send window: 9am–6pm Mon–Fri America/Toronto
- v4 claim-verification per email at send time (if a prospect fails, skip that prospect — not the batch)

**What "autonomous sending" means under updated model:**
Scout qualifies leads → agent batches entire shortlist → agent sends autonomously via n8n within send window. Ben copy review on writing approach is a one-time gate (not per-email). Once Ben approves approach + n8n is live, the pipeline runs without per-email gates. The 100/day hard cap and send window enforcement remain unchanged.

---

## Prerequisite: Infrastructure Gaps (must close before A1)

### Gap 1 — Send Infrastructure (blocking)

**Current state:** Gmail MCP supports `create_draft` only. Aiden sends manually from Gmail.

**Required:** Programmatic send on approval. Two paths:

| Path | How | Status | Risk |
|------|-----|--------|------|
| n8n Gmail send workflow | n8n webhook → Gmail send node → returns message_id | Tomorrow action item (Aiden to confirm n8n Gmail connection) | Medium — n8n not yet confirmed connected |
| Gmail API token directly | Agent calls Gmail API send endpoint with OAuth token | Requires Aiden to generate and store a token | Low complexity, same send API |

**Recommendation:** n8n path. It also enables the send window scheduler (Schedule Trigger node only fires 9am–6pm Mon–Fri ET) and gives us message_id back for the email_sent event.

**n8n workflow spec:**
1. Webhook node receives: `{to, subject, body_html, metadata: {prospect_id, batch_id, hook_variant, ...}}`
2. Schedule Trigger: only fire during 9am–6pm Mon–Fri America/Toronto. Outside window: hold in queue.
3. Gmail send node: sends with `info@glvmarketing.ca`, returns `message_id`
4. Response: `{status: "sent", message_id: "...", sent_at: "ISO-8601"}`
5. Agent logs `email_sent` event with message_id and sent_at

**Blocking verdict:** A1 cannot ship without this. Gmail draft-only is A0.

**Deliverability risk (flag before implementation):**
Programmatic sends via Gmail API can burn sender reputation if not handled carefully. Before going live:
- Confirm `info@glvmarketing.ca` has SPF, DKIM, and DMARC records in place (check with Aiden)
- Do not send more than 20–30 emails per day in the first 2 weeks (warm-up period, even if the 100/day cap permits more)
- n8n workflow must stagger sends — minimum 5 minutes between emails to different recipients in the same batch
- Monitor Gmail postmaster tools for reputation score after first 10 sends
- If any send triggers a bounce rate >5%, pause and diagnose before continuing
Gmail API scope required: `gmail.send` (narrower than full `gmail.modify` — prefer the least-privilege scope).

---

### Gap 2 — Schema v1.1 (resolved, needs skill update)

Schema v1.1 is locked (confirmed with analyst 2026-04-20). The prospecting skill SKILL.md and the copywriter agent prompt still reference old field names (`niche`, `area`, `stage` missing). The config block also needs updating.

**Required:** Update SKILL.md to emit v1.1 events on every outreach action. Copywriter agent prompt must include metadata instructions. See appendix for full v1.1 field list.

---

### Gap 3 — Phone Funnel Events (resolved at schema level, not in skill)

Phone funnel schema is locked (2026-04-20). The prospecting skill has no phone event logging. Three North Bay HVAC leads and all SSM leads are phone/in-person — zero events logged for those contacts.

**Required:** Add phone event logging instructions to the prospecting skill for phone-first leads. Investigator agents must tag leads as `channel: "phone"` or `channel: "in_person"` in the dossier copywriter brief. Copywriter must emit `call_attempted` metadata instead of Gmail draft instructions for phone-first leads.

---

### Gap 4 — Approval-to-Send Instrumentation (resolved at proxy level)

Current proxy: `email_approved` timestamp stands in for time-to-first-send until n8n is live. Once n8n ships, `email_sent` carries the real message_id and sent_at.

**Required:** When n8n is live, prospecting skill must call the n8n webhook immediately on Aiden's SEND command, then log `email_sent` with the returned message_id and sent_at. The proxy convention is retired.

---

## A1 Behavior Spec

### 1. Review Gate Behavior (updated)

**Current:** Present leads one at a time, wait for SEND/EDIT/SKIP, create Gmail draft on SEND.

**A1:** Same gate, but on SEND the agent calls the n8n webhook directly instead of creating a Gmail draft. Response options stay identical from Aiden's perspective — the only difference is "send" now means "actually sent" not "drafted."

Send window enforcement at the gate:
- If current time is within 9am–6pm Mon–Fri ET → send immediately, log `email_sent`
- If outside window → log `email_approved`, queue the send, confirm to Aiden: "Approved. Queued for [next open slot, e.g., Mon 9:00am ET]." Log `email_sent` when the n8n scheduler fires.

**"Send all" command:** Approves all remaining leads in the batch. Sends during window; queues the rest. Aiden gets one confirmation message with the send schedule.

---

### 2. Dedup Registry

**Current:** None. The agent has no memory of which prospects have been contacted.

**A1 requirement:** A prospect registry at `projects/glv-marketing/outreach/prospect-registry.json`. Structure:

```json
{
  "prospect_id": {
    "business_name": "...",
    "email": "...",
    "last_contact_at": "ISO-8601",
    "channel": "email | phone | in_person",
    "batch_id": "...",
    "status": "drafted | approved | sent | replied | meeting_booked | skipped | do_not_contact"
  }
}
```

**Dedup rules:**
- Before adding any lead to a batch: check registry. If `status: "sent"` or `"replied"` or `"meeting_booked"` → exclude automatically, flag to Aiden in the scout report.
- CASL cooldown: once contacted, a prospect cannot receive another cold email. Ever. `status: "sent"` is a permanent lock unless `status` is updated to `"replied"` or `"meeting_booked"` (which opens the door for a reply — not a new cold email).
- `do_not_contact`: Aiden can set this manually. Agent never contacts this prospect again.

**Integration point:** Scout agent checks the registry before adding a lead to the shortlist. Investigator agents skip registry-locked leads. Copywriter agent skips any lead the orchestrator flags as locked.

---

### 3. Cooldown Windows

**Current:** None.

**A1 requirement:** Two types of cooldown.

**Per-lead cooldown (CASL):** Once `email_sent` is logged, the prospect is locked in the registry. No re-contact via cold outreach. This is not a cooldown window — it is a permanent gate. CASL does not allow a second cold intro.

**Per-batch stagger:** Within a single batch, emails should not all fire at the same second. Stagger sends by 5–15 minutes between emails in the same batch. This reduces spam-filter risk from a burst of identical-sender emails. The n8n workflow handles stagger natively (one send per webhook call, called sequentially with delay).

**Per-city daily cap:** If more than 10 emails are approved for the same city in one day, surface a warning: "X emails queued for [city] today — this is above typical volume. Confirm?" (Not a hard block — just a flag.)

---

### 4. Booking Detection

**Current:** Manual. Aiden tells the agent when a meeting is booked.

**A1 requirement:** Auto-detect new meetings booked via the GLV booking link (`https://calendar.app.google/5hcxx2tWmVkNvS1c6`).

**How:**
- Google Calendar MCP is available (`mcp__claude_ai_Google_Calendar__list_events`)
- On each heartbeat cycle: query Google Calendar for new events since last heartbeat
- Filter for events created via the booking link (detectable by: event title contains business name from registry, or attendee email matches a prospect in the registry)
- On match: log `meeting_booked` event with `channel`, `prospect_id`, `batch_id`, `booked_at`, `meeting_at`
- Update prospect registry: `status: "meeting_booked"`
- Notify Aiden via Telegram: "New meeting booked — [Business Name], [time]. Prospecting event logged."

**Gap:** Calendar matching is fuzzy — the booking link does not embed a prospect_id. Matching by attendee email (if the prospect used their business email to book) is reliable. Matching by event title is less reliable. Spec will need a fallback: if no registry match is found, surface to Aiden for manual tagging.

**Manual fallback (until automated matching is reliable):** Aiden says "meeting booked — [prospect_id]" and agent logs it. This is the current A0 behavior and stays available at A1.

---

### 5. Pipeline Automation (Night Mode)

**Current:** Pipeline triggers when Aiden requests it.

**A1 behavior:** In Night Mode (outside 08:00–23:00 ET), the agent autonomously:
1. Checks if the pipeline queue is empty (no active batch in progress)
2. If empty AND there are unfilled niche/area slots from the priority list: auto-start niche research + scout for the next niche/area
3. Produces dossiers and draft outreach ready for morning review
4. Does NOT present review gate questions at night — queues them for Day Mode
5. Sends a morning brief to Aiden at 08:00 ET: "Overnight: researched [X] leads in [niche/area]. [N] emails ready for review."

**Priority list for autonomous pipeline runs:** Defined in `projects/glv-marketing/outreach/pipeline-queue.json`. Example:

```json
{
  "queue": [
    {"niche": "plumbing", "area": "north-bay", "status": "pending"},
    {"niche": "hvac", "area": "sudbury", "status": "pending"},
    {"niche": "roofing", "area": "north-bay", "status": "pending"}
  ]
}
```

Aiden populates the queue. Agent works through it autonomously overnight.

---

### 6. Scout Gate Change (A1 option)

**Current:** Scout presents results and waits for Aiden to select leads.

**A1 option:** Auto-select using ICP scoring criteria and proceed to investigation without Aiden's checkpoint. Present results at the review gate (copy stage) instead of the scout stage.

**Hard constraint:** This requires Aiden to explicitly greenlight the checkpoint removal. The scout gate exists because Aiden has business context the agent does not (existing relationship, recent competitor change, local intel). Removing it is a judgment call Aiden must make explicitly.

**Recommendation:** Keep scout gate by default. Make it lighter: agent auto-selects top 5 by ICP score and says "Auto-selected these 5 — investigating now. Reply 'hold' within 30 minutes to pause." This is a soft gate, not a hard one. If Aiden doesn't respond, investigation proceeds.

---

## Approval Gate Architecture (A0 → A1 comparison)

| Gate | A0 | A1 |
|------|----|----|
| Scout lead selection | Hard gate — wait for Aiden | No gate — scout shortlist = send list (user directive 2026-04-20) |
| Investigation start | Automatic after gate | Automatic (unchanged) |
| Copy approach review | Per-email hard gate | One-time gate: Ben copy approval on writing approach (not per-email) |
| Send on approval | Creates Gmail draft | Calls n8n webhook, sends directly after Ben approves approach |
| Send window | No enforcement | Auto-queues outside 9am–6pm ET |
| Booking detection | Manual (Aiden reports) | Auto via Google Calendar + registry match |
| Dedup | None | Registry-enforced, permanent CASL lock |
| Phone outreach | No events | call_attempted + call_outcome logged |

---

## What Stays Locked (Non-Negotiable at A1)

1. **Per-email approval for cold outreach.** DELIVERABLE rule is explicit. "Send all" is a valid shortcut but still requires Aiden to type "send all" — it is not auto-triggered.

2. **CASL: no follow-up sequences.** Ever. Not at A1, not at A2. The registry enforces this permanently.

3. **SSM = in-person only.** No email channel to SSM businesses. The briefing pack format stays.

4. **100 emails/day hard cap.** n8n workflow enforces this at the send node. Refuses to send if daily count >= 100.

5. **Send window: 9am–6pm Mon–Fri ET.** n8n Schedule Trigger enforces. Agent confirms queue timing to Aiden when emails are scheduled outside window.

---

## Gap List (Summary)

| # | Gap | Severity | Blocks A1? | Resolution |
|---|-----|----------|-----------|------------|
| G1 | Gmail send infrastructure (n8n or API token) | Critical | Yes | Build n8n workflow after Aiden confirms Gmail connection |
| G2 | Schema v1.1 not in prospecting SKILL.md | Medium | No (events logged correctly now, skill doc is stale) | Update SKILL.md + copywriter prompt |
| G3 | Phone funnel not in prospecting skill | Medium | No (schema locked, skill not updated) | Add phone channel handling to skill |
| G4 | Prospect dedup registry does not exist | Medium | No (functional but risky without it) | Create `prospect-registry.json` + scout integration |
| G5 | Cooldown logic not implemented | Low | No | Implement alongside dedup registry |
| G6 | Booking detection not automated | Low | No (manual fallback works) | Google Calendar polling on heartbeat |
| G7 | Scout gate is hard (requires response) | Low | No | Add soft-gate 30-min hold window option |
| G8 | pipeline-queue.json does not exist | Low | No | Create + populate with Aiden's input |

---

## Implementation Order (when Aiden approves)

1. **G1 — n8n send workflow** (tomorrow, contingent on Aiden confirming n8n Gmail)
2. **G4 + G5 — Prospect registry + dedup/cooldown** (can start now, no external dependency)
3. **G2 + G3 — SKILL.md update** (one editing session, no external dependency)
4. **G6 — Booking detection** (one heartbeat polling loop, Google Calendar MCP available)
5. **G7 + G8 — Scout gate softening + pipeline queue** (after all above, discuss with Aiden)

---

## Appendix: Schema v1.1 Field Reference

**Email events** (email_drafted, email_approved, email_sent, reply_received, email_bounced):
```json
{
  "channel": "email",
  "stage": "draft | approved | sent | replied | bounced",
  "industry": "hvac | plumbing | electrical | ...",
  "city": "north-bay | sudbury | thunder-bay | ...",
  "batch_id": "NB-HVAC-2026-04-20-001",
  "prospect_id": "daves-heating-nb",
  "sequence_step": 1,
  "hook_family": "H1-pride | H2-curiosity | H3-aspiration | H4-validation | H5-opportunity",
  "hook_variant": "H2-curiosity-search-gap",
  "structure_variant": "S1-validate-opportunity-diagnostic",
  "decision_maker": "Dave Boissonneault",
  "email": "admin@davesheatingandcooling.ca",
  "gmail_draft_id": "r-...",
  "approved_by": "aiden",
  "approved_at": "ISO-8601 or null",
  "approved_source": "gmail_inline | verbal_telegram | verbal_backfill"
}
```

**Phone events** (call_attempted):
```json
{
  "channel": "phone",
  "industry": "hvac",
  "city": "north-bay",
  "batch_id": "...",
  "prospect_id": "...",
  "decision_maker": "...",
  "phone_number": "705-xxx-xxxx",
  "call_number": 1
}
```

**Phone events** (call_outcome):
```json
{
  "prospect_id": "...",
  "outcome": "connected_conversation | voicemail_left | no_answer | gatekept | wrong_number | callback_scheduled | do_not_call | number_disconnected",
  "duration_sec": null,
  "notes": null,
  "transcript_snippet": null
}
```

**Meeting events** (meeting_booked):
```json
{
  "channel": "email | phone | in_person",
  "prospect_id": "...",
  "batch_id": "...",
  "booked_at": "ISO-8601",
  "meeting_at": "ISO-8601"
}
```
