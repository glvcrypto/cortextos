# Order Parts — Carousel + CTA Banners Copy

**URL (target page):** /service/order-parts/
**Section position:** Form → **Carousel** → **CTA banner #1** → **CTA banner #2** → FAQ → Related
**Sibling deliverable:** v2 page copy lives at /service-pages/v2/order-parts.md (form + intro + model-number guide + trust footer all already shipped). This file = the new mid-page sections that sit below the form.
**Coordination:** designer (visual fit) + dev (integration).
**Status:** DRAFT v1.

---

## 1. Carousel Section

**Heading (H2):** Parts We Stock

**Subhead (optional, 1 line):** Pulled fresh from our shelves on White Oak Drive. If it's not on the floor, we'll quote a real lead time at the parts counter.

**Carousel direction (note for designer):** Mixed product strip — pull a representative slice across the 9 authorised brands (Mercury, Princecraft, Cub Cadet, Toro, Echo, Hisun, Minn Kota, Bercomac, Humminbird). Aim for visual variety (an outboard plug + a mower belt + a snowblower auger pin + a chainsaw chain + a trolling motor prop) rather than nine of the same category. Each card shows: product image, brand, short name, "View" CTA → product page on Reyco's WP catalogue.

**No Lightspeed live-inventory line in this section** — that anchor already lives in the form-page hero subhead and trust footer. Keeping the carousel subhead light avoids redundancy.

---

## 2. CTA Banner #1 — Book a Service Call

**Heading:** Need the part installed too?

**Body (1-2 sentences):** Drop the equipment with the part and we'll book bench time with Damian (small engine, lawn, snow) or Lee (marine, ATV). One stop, one bill, one tech who knows your unit.

**Button label:** Book a Service Call

**Button link:** Dev to wire to the highest-conversion service entry point — either `/contact` or the equipment-routing block on `/service/engine-repair/` (which routes by category to the right bench page). Recommend `/contact` for simplicity unless dev has a single-form service-booking surface ready.

**Conversion mechanism:** phone/form → service booking. Captures the customer who came for a part but actually needs the install/repair too.

---

## 3. CTA Banner #2 — Visit Our Showroom

**Heading:** Stop in. See it before you buy.

**Body (1-2 sentences):** Boats, mowers, snowblowers, ATVs and side-by-sides on the floor at 11 White Oak Drive East. Same shop, same parts counter — handy if you'd rather hold the part in your hand before you commit.

**Button label:** Get Directions

**Button link:** Google Maps deep link to "Reyco Marine, 11 White Oak Drive East, Sault Ste. Marie." Dev to use the standard maps URL pattern that opens native maps app on mobile.

**Conversion mechanism:** physical visit / in-person browse. Distinct from CTA #1 (phone/form → service) — captures the customer who wants to see equipment before buying, or who'd rather drop in than book.

**Optional sub-line for designer's banner footer (small text, hours):** Mon-Fri 8 AM-5 PM · Sat 9 AM-1 PM · Sunday closed

---

## Notes for review

**Why these two CTAs (and not "Talk to Casey" or "Browse marine inventory"):**
- **CTA #1 (Service Call)** captures the next-step intent for a parts visitor who actually needs the install. Highest natural conversion adjacency to a parts page.
- **CTA #2 (Showroom Visit)** is the strongest mechanism *shift* from #1 — physical instead of phone, browse instead of book. Maximises non-overlap.
- "Talk to Casey" rejected — Casey is the owner; routing parts-page visitors to him is friction for both sides (parts is Lynn/Ron's counter, not the owner's). Save Casey-direct for high-trust commercial / large-purchase decisions.
- "Browse marine inventory" rejected — that's a soft browse action, not a real conversion. The carousel itself already serves that intent.

**Voice locks observed:**
- Canadian English (authorised, organised — no -ize cluster on this page section)
- Plain trades-friendly tone — "drop the equipment with the part," "hold the part in your hand," "stop in" (no jargon, no abstraction)
- Defensible-language pattern carried — "11 White Oak Drive East" geographic anchor, no fabricated specifics, no Lightspeed redundancy (anchor lives in v2 hero subhead + trust footer already)
- Named techs (Damian + Lee) consistent with v2 page authorship + service-page roster

**Cross-page consistency:** Damian/Lee split language matches v2 service pages (Damian = small engine + lawn + snow; Lee = marine + ATV/UTV). Lynn (parts manager) is the v2 author for the form-page itself, so naming her again here would crowd the section — kept implicit ("parts counter") instead.

**Designer fit notes:**
- Carousel = horizontal scroll/swipe on mobile, 4-up or 5-up on desktop.
- CTA banners = full-width or near-full-width below the carousel, stacked vertically (not side-by-side) so each gets full attention. Visual treatment should distinguish them — banner #1 leans "service" (e.g. wrench/tech imagery), banner #2 leans "showroom" (e.g. shop floor/boat imagery).
- Total mid-page section length (carousel + 2 banners) should not push the FAQ block more than ~one screen below the fold on desktop. If it does, consider trimming the carousel to a tighter strip.
