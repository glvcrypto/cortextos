# Related Services — 6th Tile Copy (Contact Us)

**URL (target):** Template-level — appears in the Related Services section across most service pages.
**Tile slot:** 6th of 6 (empty slot, designer adding orange treatment to distinguish from the 5 service tiles).
**Coordination:** designer (visual) + dev (integration).
**Status:** DRAFT v1.

---

## Tile Copy

**Heading (primary):** Talk to a Tech

**Subhead (1 line, if design accommodates):** Not sure which service fits? Tell us what's on your equipment and we'll route you to the right bench.

**CTA destination:** `/contact`

---

## Why this heading (and not "Contact Us")

- **"Contact Us"** is the generic floor — it works but pulls less. Every site has it.
- **"Talk to a Tech"** matches the named-tech consistency the v2 service pages already establish (Damian on small engine/lawn/snow, Lee on marine/ATV). The reader who landed on a service page is already primed to think in terms of "the tech who'll handle my unit," not "a contact form."
- **"Need help finding a service?"** was considered — accurate but reads as a navigation aid, not a conversion. The 6th tile sits visually equal to the 5 service tiles, so it should feel like an *option* (talk to a person), not a *help text*.
- **"Talk to the Team"** rejected — softer than "Talk to a Tech," loses the named-bench framing.

## Why /contact (and not a tel: link)

- A full tile-sized CTA going to a `tel:` link forces a phone call as the only path. Some readers prefer to type out what's wrong (especially with a part number or symptom they want to spell correctly). `/contact` keeps the phone option visible on the contact page itself while giving the form path too.
- Dev can layer a secondary `tel:` link below or alongside if the design wants a dual-path tile, but the primary should stay form-page.

## Voice locks observed

- Plain trades-friendly tone — "talk to a tech," "what's on your equipment," "the right bench"
- Named-bench framing carried from v2 service pages (Damian/Lee bench split)
- No jargon (no "consultation," "inquiry," "service request" — just "talk")
- Canadian English (no -ize cluster on this tile)

## Designer fit notes

- 6th tile sits in the same grid as the 5 service tiles. Orange treatment distinguishes it as the "person, not a service" option.
- Heading should sit at the same weight/size as the service tile headings for visual rhythm.
- If subhead is shown: keep it tight (one line, no wrap on desktop). If the tile is small (e.g. mobile 2-up), drop the subhead and let the heading + orange treatment carry the invitation.
- Optional icon suggestion for designer: phone-and-speech-bubble combo, or wrench-and-speech-bubble (matches "tech," not "support agent").
