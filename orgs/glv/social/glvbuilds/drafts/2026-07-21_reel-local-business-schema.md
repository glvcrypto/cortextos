# Jul 21, 2026 — @glvbuilds

**Platform:** Reel (~35s)
**Content type:** Tutorial
**CTA:** Comment SCHEMA (manual DM)
**Flags:** Production note: show a fictional business schema in the code snippet, not a real client. Keep the JSON-LD visible and legible on screen.

---

## Script / Shot List

**[Hook — on screen text + voiceover, 0–6s]**
"The 5-minute schema fix that helps Google understand what your local business does."

**[Step 1 — screen recording or graphic, 6–14s]**
Show a clean JSON-LD block for a fictional local business (e.g. "Maple Leaf Plumbing, 123 Main St, Sudbury, ON"). Highlight the key fields: @type, name, address, telephone, url.
Voiceover: "This is LocalBusiness schema. It goes in your page's head tag. It tells Google your business type, address, and phone in a format it can read directly."

**[Step 2 — graphic, 14–22s]**
Show the key @type options: LocalBusiness, Plumber, AutoRepair, HomeAndConstructionBusiness. Highlight that picking the specific type beats using generic LocalBusiness.
Voiceover: "The @type matters. 'Plumber' ranks better than 'LocalBusiness' for plumbing searches — use the specific type for your trade."

**[Step 3 — graphic or screen, 22–30s]**
Show Google's Rich Results Test URL field being pasted.
Voiceover: "Paste your URL into Google's Rich Results Test. It tells you if the schema is valid and if Google can see it."

**[Ending — on screen text, 30–35s]**
"Five minutes. Helps Google understand your business faster."
CTA: "Comment SCHEMA for the snippet I use."

---

## Production Notes

- Use a fictional business for the JSON-LD on screen — do NOT use a real client's address or phone
- Suggested fictional business: "Maple Leaf Plumbing, 123 Main St, Sudbury ON P3A 1A1, +17051234567"
- JSON-LD snippet to display:

```json
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Maple Leaf Plumbing",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Sudbury",
    "addressRegion": "ON",
    "postalCode": "P3A 1A1",
    "addressCountry": "CA"
  },
  "telephone": "+17051234567",
  "url": "https://www.mapleleafplumbing.ca"
}
```

- Keep the code visible for at least 4 seconds
- Rich Results Test URL: search.google.com/test/rich-results (do not include in video — mention verbally or show briefly)
- 35 seconds total
