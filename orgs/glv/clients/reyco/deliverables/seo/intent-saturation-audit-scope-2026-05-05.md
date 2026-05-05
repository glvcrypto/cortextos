# Reyco Marine — Intent-Saturation Audit Scope
**Prepared:** 2026-05-05 by seo agent
**Trigger:** March 2026 Google Core Update — E-E-A-T weighted heavier + intent-led quality scoring
**Context:** Pages that rank but don't fully answer the searcher's next question are the new at-risk tier. Audit to run POST A1+A2 batch writes (so we audit the fresh-batch state, not the pre-meta state).
**Scope:** 11 service pages + category pages (product pages out of scope — addressed by A1/A2 batch)

---

## Framework: "Next 3 Questions" Test

For each page, a searcher who lands via the primary keyword has 3 follow-up questions before they decide to call/book. If the page doesn't answer all 3, it fails the intent-saturation test.

---

## Service Pages — Intent-Saturation Assessment

### 1. Small Engine Repair (`/service/small-engine/`)
**Primary query:** `small engine repair sault ste marie` / `small engine repair near me`
**Primary intent satisfied:** ✅ What they fix, who does it, general process
**Next 3 questions:**
1. Do you fix my specific brand/equipment? (chainsaw, mower, snowblower, ATV) → ❌ Not explicit by brand
2. How long will it take? → ❌ No turnaround signal on page
3. Do I need to call ahead or can I drop it off? → ❌ No availability/intake signal
**Saturation gap:** Medium-high. Searcher has purchase intent but can't confirm fit without calling.
**Fix:** Add brand-specific repair list (Echo, Toro, Cub Cadet, Hisun — authorized brands) + "typical turnaround 1–2 weeks" line + "drop-in or call ahead" signal in CTA section.

---

### 2. Marine Service (`/service/marine/`)
**Primary query:** `boat repair sault ste marie` / `outboard motor repair sault ste marie`
**Primary intent satisfied:** ✅ Mercury-authorized, what they service, Lee's expertise
**Next 3 questions:**
1. Do you work on my engine brand/size? → ✅ Mercury authorized (explicit), but other brands unclear
2. Do I leave my boat or just the engine? → ❌ No dock/trailer intake signal
3. Can I book ahead for spring/fall rush? → ❌ No seasonal availability signal
**Saturation gap:** Low-medium. Page is strong; adding intake logistics + seasonal note captures the "ready to book" searcher.
**Fix:** Add "Drop off your engine or bring in your boat on a trailer — we have a dedicated service bay" line. Add seasonal note: "Book spring commissioning early — May slots fill fast."

---

### 3. Boat Winterization (`/service/winterization/`)
**Primary query:** `boat winterization sault ste marie` / `how to winterize outboard motor`
**Primary intent satisfied:** ✅ What's included, Lee expertise, authorized service
**Next 3 questions:**
1. When should I book? (seasonal urgency) → ❌ No seasonal timing signal
2. How much does winterization cost? → ❌ No pricing signal
3. Do you pick up or do I bring it in? → ❌ No intake logistics
**Saturation gap:** High. Winterization is a seasonal decision — the searcher is ready to book but needs timing + cost signals to convert.
**Fix:** Add "Book before October — slots fill fast" urgency line + "pricing varies by engine size, call for a quote" signal + trailer intake note.

---

### 4. Spring Commissioning (`/service/spring-commissioning/`)
**Primary query:** `spring boat commissioning sault ste marie` / `spring tune up service sault ste marie`
**Primary intent satisfied:** ✅ What's included, Lee expertise, authorized
**Next 3 questions:**
1. When should I book? → ❌ No seasonal timing signal
2. What if my engine has a problem found during commissioning? → ❌ No "we handle repairs too" signal
3. Can I bundle with winterization? → ❌ No annual service package signal
**Saturation gap:** Medium. Same seasonal-urgency gap as Winterization.
**Fix:** Add "Book by April — spring slots book up in March/April" signal + "If we find issues during commissioning, we handle repairs same visit" line.

---

### 5. Tune-Ups (`/service/tune-ups/`)
**Primary query:** `outboard tune up sault ste marie` / `small engine tune up near me`
**Primary intent satisfied:** ✅ What's tuned, by whom (Lee/Damian), authorized
**Next 3 questions:**
1. Do I need a tune-up or a full repair? → ❌ No triage signal
2. How long does a tune-up take? → ❌ No turnaround signal
3. What does a tune-up cost? → ❌ No pricing signal
**Saturation gap:** Medium. "Should I get a tune-up or is something actually broken?" is a very common searcher question for this intent.
**Fix:** Add "Not sure if it's a tune-up or a repair? Drop it off and we'll diagnose for free before quoting" triage signal. Add "most tune-ups done same day or next day" turnaround line.

---

### 6. Lawn Equipment Service (`/service/lawn-equipment/`)
**Primary query:** `lawn mower repair sault ste marie` / `lawn mower service near me`
**Primary intent satisfied:** ✅ What they service, Damian expertise, authorized brands
**Next 3 questions:**
1. Do you fix my specific mower brand? → ✅ Toro/Cub Cadet authorized (partial). Husqvarna/John Deere? → ❌
2. Can I drop off during the day without an appointment? → ❌ No intake logistics
3. How long until I get it back? → ❌ No turnaround signal
**Saturation gap:** Medium. Brand coverage question is the biggest friction point.
**Fix:** Add "We service most major brands including Toro, Cub Cadet, Echo — not sure if we work on yours? Call or drop in." line. Add turnaround signal: "Most lawn equipment repaired within 5–7 business days."

---

### 7. Snow Equipment Service (`/service/snow-equipment/`)
**Primary query:** `snowblower repair sault ste marie` / `snowblower service near me`
**Primary intent satisfied:** ✅ What they service, Damian expertise, authorized brands
**Next 3 questions:**
1. Is pre-season service available? (before first snow) → ❌ No seasonal timing signal
2. What if it breaks mid-season — how fast can you turn it around? → ❌ No emergency/rush signal
3. Do you service gas AND electric? → ❌ No fuel-type clarification
**Saturation gap:** Medium-high. Snowblower repair has strong seasonal urgency — the mid-winter breakdown is a high-stress search.
**Fix:** Add "Mid-winter breakdown? We prioritize snowblower repairs in season — call for current wait times" urgency line. Add fall pre-season service hook: "Get your snowblower serviced before first snowfall — August/September slots available."

---

### 8. Warranty Claims (`/service/warranty/`)
**Primary query:** `warranty repair sault ste marie` / `mercury outboard warranty ontario`
**Primary intent satisfied:** ✅ Authorized dealer status, brands covered, process
**Next 3 questions:**
1. Is my warranty still valid? → ❌ No "bring in your paperwork and we'll check" signal
2. How long does a warranty claim take vs. regular repair? → ❌ No timeline signal
3. Do I need to have bought from you for warranty service? → ❌ No "any authorized unit" signal
**Saturation gap:** Low-medium. Warranty searchers have high intent but specific anxiety about eligibility.
**Fix:** Add "Warranty service is available on any Mercury/Toro/Cub Cadet/Echo unit — not just units purchased from us" eligibility line. Add "Bring your purchase receipt and we'll handle the claim paperwork" process signal.

---

### 9. ATV/UTV Repair (`/service/atv-utv-repair/`)
**Primary query:** `ATV repair sault ste marie` / `UTV repair sault ste marie`
**Primary intent satisfied:** ⚠️ Partial — brand coverage thin, Hisun-focused
**Next 3 questions:**
1. Do you fix my brand? (Can-Am, Polaris, Yamaha vs. Hisun) → ❌ Only Hisun authorized — unclear for others
2. Off-season storage + repair combo? → ❌ Not mentioned
3. Trail season urgency — how fast can you turn it around? → ❌ No turnaround signal
**Saturation gap:** High. Hisun authorization is a niche signal; searchers with Can-Am/Polaris bounce immediately without a clear answer.
**Fix:** Add "We service most ATV/UTV brands for general mechanical repairs; authorized Hisun dealer for warranty work" clarification. This reduces bounce from non-Hisun owners.

---

### 10. Engine Repair (`/service/engine-repair/`)
**Primary query:** `engine repair sault ste marie` / `outboard engine repair sault ste marie`
**Primary intent satisfied:** ✅ What types of engines, Lee/Damian expertise
**Next 3 questions:**
1. How serious is my engine problem — is it worth fixing or replace? → ❌ No triage signal
2. Do you do diagnostics before quoting? → ❌ No diagnostic process signal
3. What are ballpark repair costs? → ❌ No pricing anchor
**Saturation gap:** Medium. Engine repair is a high-anxiety search — the cost/worth triage question is the #1 conversion blocker.
**Fix:** Add "Not sure if repair is worth it? We'll diagnose and give you an honest quote before touching it — no surprise bills" signal.

---

### 11. Order Parts (`/service/order-parts/`)
**Primary query:** `marine parts sault ste marie` / `mercury outboard parts sault ste marie`
**Primary intent satisfied:** ✅ Parts ordering, OEM stock, brands
**Next 3 questions:**
1. How long to get a part if not in stock? → ❌ No lead time signal
2. Can I order online or phone only? → ❌ No channel clarity
3. Do you have common parts in stock or everything is order-only? → ⚠️ Partially answered ("OEM parts in stock") but vague
**Saturation gap:** Low. Page is already strong; minor improvements only.
**Fix:** Add "Most common Mercury, Toro, Echo, and Cub Cadet parts in stock — special orders typically 3–5 business days."

---

## Category Pages — Intent-Saturation Assessment

### Princecraft / Boats Category
**Primary query:** `princecraft boats canada` / `princecraft dealer sault ste marie`
**Next 3 questions not answered:**
1. Which Princecraft models do you have in stock right now? → ❌ (inventory changes, hard to guarantee)
2. Can I test drive / see the boat on water? → ❌ No demo offer signal
3. What financing is available? → ❌ No financing link on category page
**Fix:** Add financing signal + "book a viewing" CTA + "we're Northern Ontario's only Princecraft dealer" monopoly signal.

### Mercury Outboards Category
**Next 3 questions not answered:**
1. What HP range do you stock? → ❌
2. Installation included with purchase? → ❌
3. Factory warranty — how does it work? → ❌
**Fix:** Add HP range note + "installation available" signal + warranty mention.

---

## Priority Matrix

| Page | Gap Level | Fix Complexity | Priority |
|------|-----------|---------------|----------|
| Boat Winterization | High | Low (2-3 sentences) | P1 |
| Snowblower Service | Medium-high | Low (2 sentences) | P1 |
| ATV/UTV Repair | High | Low (1 sentence clarification) | P1 |
| Small Engine Repair | Medium-high | Low (brand list + turnaround) | P2 |
| Engine Repair | Medium | Low (triage sentence) | P2 |
| Spring Commissioning | Medium | Low (booking urgency) | P2 |
| Tune-Ups | Medium | Low (triage + turnaround) | P2 |
| Marine Service | Low-medium | Low (intake logistics) | P3 |
| Lawn Equipment Service | Medium | Low (brand note + turnaround) | P3 |
| Warranty Claims | Low-medium | Low (eligibility + process) | P3 |
| Order Parts | Low | Low (lead time) | P4 |

---

## Recommended Approach

All P1+P2 fixes are 1-3 sentence additions to existing copy. No structural changes, no dev ticket needed — pure WP admin copy edits. Total estimated copy additions: ~400 words across 9 pages.

**Deliverable:** `intent-saturation-copy-patches-reyco-2026-05-05.md` — ready-to-paste copy additions per page, formatted for WP editor.

**Gate:** None. Can execute this week, independent of A1/A2 batch, Person schema, or any other gate.

---

*Audit scope complete. Pending: copy patch generation (post-A1/A2 batch confirmation).*
