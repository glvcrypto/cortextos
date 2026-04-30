# Meet the Team

**URL:** /about/meet-the-team/
**Status:** DRAFT v1 — staff-page hub with 7 cards linking to WP author archives. Boss dispatch 1777139677517 (Aiden picked Option A: WP native author archives at /author/<username>/).

---

## Page metadata (for dev to wire into template)

**Title tag (52 chars):** Meet the Team | Reyco Marine | Sault Ste. Marie

**Meta description (149 chars):** Meet the team behind Reyco Marine in Sault Ste. Marie — sales, parts and service specialists working under one roof on White Oak Drive.

**Schema:** AboutPage schema (per `deliverables/seo/schema/schema-markup-templates.md`).

---

## Hero

**H1:** Meet the Team

**Subhead:** The same faces, year after year. Sales, parts and service all run by people who've been doing this long enough to know your gear by name.

---

## Intro

Reyco runs lean — a small, steady crew that handles sales, parts and service from a single facility on White Oak Drive. There's no head office, no call centre, no rotating staff. The person who sold you the boat is on the same floor as the tech who'll service it next spring and the parts manager who'll pull your impeller in February.

That continuity is the whole point. When you call about your snowblower in October, Damian remembers it. When you ask Lee whether your outboard is due for a water pump, he knows the answer because he's seen the unit before. And when Lynn books in your parts order, she knows what brand of OEM is on the shelf without checking a screen.

We've been a part of Sault Ste. Marie's marine, outdoor power and small engine scene for more than 60 years. The team below is who you'll meet when you walk through the door, call the parts counter, or drop a unit on the bench.

## The Team

(Dev: render as a 7-card grid. Each card = name + role + 1-line role-vibe + "Read more" link to /author/<username>/. Order is owner → co-owner → parts → sales → service to match how customers move through the shop.)

**Casey Davieaux** — Owner / Sales
The face of the sales floor. Walks customers from first conversation through final delivery.
[Read more](/author/casey/)

**Aaron** — Co-Owner / Sales
Co-owner working the floor. Sizes packages to how the gear is actually going to get used.
[Read more](/author/aaron/)

**Lynn** — Parts Manager
Runs the parts room. Keeps OEM inventory moving across all nine brands we carry.
[Read more](/author/lynn/)

**Ron** — Parts Specialist
On the parts counter day to day. Phone, walk-in and special-order parts all run through Ron.
[Read more](/author/ron/)

**Kory** — Sales
On the sales floor with Casey and Aaron. Walks through options without the upsell.
[Read more](/author/kory/)

**Lee** — Service Tech (Marine + Off-Road)
Runs the marine and big-engine bench. Outboards, sterndrives, ATVs and side-by-sides.
[Read more](/author/lee/)

**Damian** — Service Tech (Small Engine + OPE)
Runs the small engine bench. Lawn mowers, snowblowers, chainsaws and trimmers.
[Read more](/author/damian/)

## How the Team Fits Together

Sales, parts and service work the same workflow every season:

1. **Sales** (Casey, Aaron, Kory) sets you up with the right unit for the job — boat, mower, snowblower, ATV, or whichever piece of equipment fits.
2. **Service** (Lee on marine and off-road, Damian on small engine) handles the annual [tune-ups](/service/tune-ups/), [winterization](/service/winterization/), [spring commissioning](/service/spring-commissioning/) and any [repair](/service/marine/) work that comes through.
3. **Parts** (Lynn, Ron) keeps the OEM inventory stocked for both the service bench and walk-in customers — see the [parts page](/service/order-parts/) for what's in stock day to day.

Three desks, one floor, one workflow. That's the whole shop.

## Visit the Team

Stop by **11 White Oak Drive East, Sault Ste. Marie**, call **705-253-7828**, or email **parts@reycomarine.com**. We're open Monday to Friday 8 AM to 5 PM, Saturday 9 AM to 1 PM. Sunday closed.

---

## Notes for review

**Grid layout direction for dev:** 7 cards in a responsive grid (3-up on desktop, 2-up on tablet, 1-up on mobile is the natural fall). Each card = headshot placeholder (per Aiden: generic placeholder image is fine until Jak photos batch lands) + name + role + 1-line role-vibe + "Read more" link to /author/<username>/. Order: owner → co-owner → parts manager → parts specialist → sales → service tech (marine) → service tech (small engine) — mirrors customer walk-through flow.
**Author archive URLs:** /author/casey/, /author/aaron/, /author/lynn/, /author/ron/, /author/kory/, /author/lee/, /author/damian/. WP native author archive pattern (Option A per Aiden). Each archive will load the long-form bio (separate files in /copy/author-bios/) as the archive page body.
**Copy rules observed:** general only — no specific years of experience, no specific certifications, no specific personal details. Charlene's Monday batch slots in as drop-in updates.
**Defensible-language pattern applied:** "more than 60 years", "full-service facility on White Oak Drive". No sq ft, no founding year.
**Voice locks observed:** Canadian English throughout. NO -ize cluster.
**Cross-links wired:** /service/tune-ups/, /service/winterization/, /service/spring-commissioning/, /service/marine/, /service/order-parts/. Page positions as the bridge between /about/ (informational) and the service-page commercial cluster.
**Brand-authority framing:** intro leans into "continuity = expertise" angle (same faces, knows your gear by name) — defensible without specific tenure claims.
