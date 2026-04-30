# Order OEM Parts in Sault Ste. Marie

**URL:** /service/order-parts/
**Page type:** CAPTURE FORM (NOT standard service page) — per Aiden directive 1777148739629. Customer submits form fields; parts team replies with stock + price + lead time.
**Author (E-E-A-T association):** Lynn (/author/lynn/) — parts manager
**Primary keyword:** marine parts sault ste marie (100–200/mo, P5), mercury outboard parts sault ste marie (50–100/mo, P5), toro parts ssm, cub cadet parts ssm, echo parts ssm
**Secondary:** mercury outboard parts online canada (100–200/mo), Hisun parts canada, snowblower parts northern ontario
**Long-tail:** where to buy mercury outboard parts ontario (100–200/mo), how to find my equipment model number for parts (100–200/mo), OEM vs aftermarket snowblower parts (100–200/mo)
**Status:** DRAFT v2 (form-page fork) — copy for the form-page UI dev is wiring. v1 stays at /service-pages/order-parts.md as the long-form transactional page (now superseded by this form-page approach).

---

## Page metadata (for dev to wire into template)

**Title tag (50 chars):** Order OEM Parts Sault Ste. Marie | Reyco Marine

**Meta description (150 chars):** Send us your equipment make, model and part request. Live OEM inventory in Sault Ste. Marie. Parts team replies within 1 business day.

**Schema:** Service schema + (no FAQPage on form pages — minimal page chrome around the form).

---

## 1. Hero

**H1:** Get the Right Part — Fast

**Subhead:** Send us your equipment make, model and what you need. Lynn and Ron at the parts counter check stock against our live OEM inventory and reply within one business day. Authorised dealer for Mercury, Princecraft, Cub Cadet, Toro, Echo, Hisun, Minn Kota, Bercomac and Humminbird — all OEM, no aftermarket guesswork.

**Primary CTA (hero):** Fill out the form below
**Secondary CTA (hero):** Call **705-253-7828** if you'd rather talk it through

**Hero image direction:** parts counter / OEM parts on shelves / Lynn or Ron at the counter (once Jak photos land).

---

## 2. Intro Paragraph (why a form, not phone-only)

The fastest way to get a parts answer is to give the parts team everything they need on the first touch. A part number, a photo, a model — three pieces of context that turn into a "here's what's in stock and here's the price" reply within one business day. By phone, that same conversation tends to bounce back and forth across two or three calls while you read numbers off a faded tag.

That's why we built this form. Drop in what you've got — even if you're not sure of the model — and Lynn or Ron will pull the right part from our live Lightspeed inventory. If we have it, you can pick it up the same day. If we have to order it in, we'll quote a real lead time before you commit.

---

## 3. The Parts Request Form

(Dev: render as the capture form per Aiden's spec. Field labels + helper text below; placeholder text shown in italics where useful.)

**Your Information**

- **Name** *(required)*
  Helper: First and last is fine.

- **Email** *(required)*
  Helper: We'll reply here with stock + price + lead time.

- **Phone** *(required)*
  Helper: For faster follow-up if we need a clarification.

**About Your Equipment**

- **Brand** *(required, dropdown)*
  Options: Mercury / Princecraft / Minn Kota / Humminbird / Cub Cadet / Toro / Echo / Bercomac / Hisun / Other
  Helper: We're an authorised dealer for the brands above. For "Other" we can usually still source OEM — flag the brand in Notes.

- **Model** *(required)*
  Helper: e.g. "Mercury 60 EFI 4-Stroke" or "Cub Cadet XT1 LT42"

- **Year** *(optional)*
  Helper: If you know it. Skip if not.

- **Serial number / model number** *(optional)*
  Helper: Usually on a metal tag — see "How to find your model number" below if you can't spot it.

**The Part You Need**

- **Part description** *(required, textarea)*
  Helper: Plain English is fine. "Drive belt for the auger," "spark plug for a 25 hp Mercury," "left-side scraper bar." A photo helps if you have one.

- **Quantity** *(required, default 1)*
  Helper: How many you need.

- **Photo upload** *(optional, multiple files)*
  Helper: Photo of the broken part, the equipment tag, or where the part lives on the unit. Phone photos are fine.

**Pickup or Ship**

- **Preference** *(required, radio)*
  Options: Pickup at 11 White Oak Drive East / Ship to me
  Helper: Pickup is faster if you're in the Sault. Shipping is by Canada Post or Purolator depending on size.

- **Shipping address** *(conditional — shown only if "Ship to me" selected)*

- **Notes** *(optional, textarea)*
  Helper: Anything else we should know — urgent timing, brand we don't list, multi-part order, etc.

**Submit button label:** Send to Parts Team

---

## 4. Success Message (after submit)

**H2 / banner copy:**

Thanks **{{customer_first_name}}** — your request is in.

The parts team (Lynn or Ron) will reply to **{{customer_email}}** within one business day with stock status, price and lead time. If we need a quick clarification, we'll call **{{customer_phone}}** first.

If your request is urgent, call **705-253-7828** and mention you just submitted a form — we'll pull it up.

---

## 5. How to Find Your Model Number

You can't order the right part without the right model and serial number. Here's where to look on common equipment:

- **Outboard motor.** Mercury serial tag is on the transom bracket (the silver plate where the engine clamps to the boat). Look for "MOD" and "SER" lines.
- **Lawn mower (push or self-propelled).** Tag is usually on the deck near the rear, or under the seat on a riding mower. Cub Cadet and Toro both use a 11-character model number.
- **Riding mower or zero-turn.** Tag is under the seat or on the steering tower.
- **Snowblower.** Tag is on the back of the auger housing, or behind the engine.
- **Chainsaw or trimmer.** Tag is on the engine housing, often near the recoil starter.
- **ATV or side-by-side.** VIN is on the frame near the steering or under the seat. Hisun also lists a model number on the engine block.
- **Trolling motor (Minn Kota).** Tag is on the motor housing at the top of the shaft.

If you can't find the tag, snap a photo of the equipment and attach it to the form. We can usually identify the model from the photo and pull the serial later.

---

## 6. Trust One-Liner (form-page footer / sidebar copy)

**Authorised OEM parts dealer in Sault Ste. Marie for more than 60 years.** Mercury, Princecraft, Cub Cadet, Toro, Echo, Hisun, Minn Kota, Bercomac, Humminbird — all OEM, no aftermarket guesswork. Lynn manages the parts room; Ron works the counter; live Lightspeed inventory checked in real time.

For service work alongside the part, see [tune-ups](/service/tune-ups/), [marine](/service/marine/), [lawn equipment](/service/lawn-equipment/), [snow equipment](/service/snow-equipment/), [small engine](/service/small-engine/), [ATV/UTV](/service/atv-utv-repair/) or [warranty claims](/service/warranty/).

---

## Notes for review

**Form-page fork rationale:** Per Aiden directive (boss msg 1777148739629), Order Parts is a CAPTURE FORM, not a standard service page. The form turns the v1 phone/email-driven flow into structured field intake — full context arrives on the first touch, parts team replies with one comprehensive answer instead of bouncing two-three calls.

**Lightspeed live inventory differentiator:** preserved from v1 as the central trust signal — lands in subhead, intro paragraph, and trust footer. This is the moat for this page.

**Author E-E-A-T:** Lynn (/author/lynn/) — parts manager. Ron is referenced in support copy but Lynn is the named expert authority for the page.

**Field labels rationale:**
- Plain English throughout (Ben's 55-yr-old plumber test).
- Required vs optional clearly marked.
- Helpers explain WHY we're asking (e.g., serial number → "we can pull parts faster") rather than just WHAT to enter.
- "Brand" dropdown includes all 9 authorised brands + "Other" so we don't lose customers with a Polaris or Husqvarna unit.
- Photo upload framed as the "if you can't find the tag" workaround — we lifted Mercury/Cub Cadet/Toro/etc model-number locations from v1 directly.
- Pickup vs ship preference is conditional — only collect shipping address when needed.

**Success message:** uses Mustache-style placeholders ({{customer_first_name}}, {{customer_email}}, {{customer_phone}}) per common form-handler convention. Dev to wire to whichever templating the form library uses.

**No FAQPage schema on this page** — form pages don't need it; the FAQ block is moved to /service/warranty/ and individual service pages where the conversion intent is service-related, not parts-acquisition.

**Defensible-language pattern carried:** "more than 60 years", "authorised OEM parts dealer", "live Lightspeed inventory checked in real time" (verifiable). No founding year, no sq ft.

**Voice locks observed:** Canadian English (authorised, organised). NO -ize cluster. Plain English on form labels (no jargon).

**v1 → v2 file delta:** v1 (long-form transactional page) stays at /service-pages/order-parts.md for reference; v2 (form-page) at /service-pages/v2/order-parts.md is the new canonical. Dev integrates v2 as the live page.

**Booking pop-up:** does NOT apply on this page — the form IS the conversion mechanism. Confirm with dev that pop-up is suppressed on /service/order-parts/ to avoid two competing capture surfaces.
