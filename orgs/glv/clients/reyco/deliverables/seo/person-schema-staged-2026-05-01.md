# Reyco Marine — Person Schema: Ready-to-Deploy Staged File
**Prepared:** 2026-05-01 by seo agent  
**Status:** Casey block COMPLETE. Six stubs have [PLACEHOLDER] fields — fill from Charlene batch (~30 min SEO work once data arrives).  
**Deploy gate:** DO NOT push to production. Requires domain cutover to reycomarine.com first.  
**Implementation:** Add all 7 `<script type="application/ld+json">` blocks to `/about/` page `<head>`.

---

## How to Finalize (when Charlene batch arrives)

1. Find all `[PLACEHOLDER]` markers in this file  
2. Fill each with data from Charlene's batch: last name, bio sentence, LinkedIn/FB URL (if provided), Lee's Mercury cert  
3. Validate every block at https://validator.schema.org/  
4. Hand to dev as a single PR: "Add Person schema to About page" — all 7 blocks, one commit

**Lee note:** If Lee is Mercury Certified Marine Technician, add to his block:
```json
"hasCredential": {
  "@type": "EducationalOccupationalCredential",
  "name": "Mercury Marine Certified Technician",
  "credentialCategory": "certification"
}
```
This is the highest-value E-E-A-T signal in the batch. Confirm with Casey: "Is Lee Mercury-certified? What's the official certification name?"

---

## Block 1 — Casey Davieaux (COMPLETE — wire on domain live)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-casey",
  "name": "Casey Davieaux",
  "jobTitle": "Owner",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/author/casey/",
  "description": "Casey Davieaux is the owner of Reyco Marine & Small Engine in Sault Ste. Marie, Ontario. He leads the sales floor and helps customers find the right boat, mower, or snowblower for their needs."
}
</script>
```

**Strengthening post-Charlene:** Add `"sameAs": ["[LinkedIn URL]", "[Facebook URL]"]` and years in business once confirmed.

---

## Block 2 — Aaron [LAST_NAME] (stub — needs Charlene batch)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-aaron",
  "name": "Aaron [LAST_NAME]",
  "jobTitle": "Co-Owner, Service Manager",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "description": "[BIO — 1-2 sentences. Suggested: 'Aaron [LAST_NAME] is co-owner and service manager at Reyco Marine & Small Engine in Sault Ste. Marie, Ontario. He oversees the service department and coordinates repairs for marine, small engine, and outdoor power equipment.']"
}
</script>
```

**Placeholders to fill:** `[LAST_NAME]`, `[BIO]`  
**Optional:** `"sameAs": ["[LinkedIn or Facebook URL]"]`

---

## Block 3 — Lee [LAST_NAME] (stub — needs Charlene batch + Mercury cert confirm)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-lee",
  "name": "Lee [LAST_NAME]",
  "jobTitle": "Marine & Off-Road Service Technician",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "description": "[BIO — 1-2 sentences. Suggested: 'Lee [LAST_NAME] is a marine and off-road service technician at Reyco Marine in Sault Ste. Marie. He specializes in boat engines, outboard motors, and ATV/UTV repairs.']"
}
</script>
```

**Placeholders to fill:** `[LAST_NAME]`, `[BIO]`  
**If Mercury certified — add this field:**
```json
"hasCredential": {
  "@type": "EducationalOccupationalCredential",
  "name": "Mercury Marine Certified Technician",
  "credentialCategory": "certification"
}
```
**This credential is the highest-value E-E-A-T signal in the entire batch. Prioritize confirming Lee's certification status with Casey.**

---

## Block 4 — Damian [LAST_NAME] (stub — needs Charlene batch)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-damian",
  "name": "Damian [LAST_NAME]",
  "jobTitle": "Small Engine & OPE Service Technician",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "description": "[BIO — 1-2 sentences. Suggested: 'Damian [LAST_NAME] is a small engine and outdoor power equipment technician at Reyco Marine in Sault Ste. Marie. He services lawn mowers, snowblowers, chainsaws, and all Echo and Toro equipment.']"
}
</script>
```

**Placeholders to fill:** `[LAST_NAME]`, `[BIO]`

---

## Block 5 — Lynn [LAST_NAME] (stub — needs Charlene batch)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-lynn",
  "name": "Lynn [LAST_NAME]",
  "jobTitle": "Parts Manager",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "description": "[BIO — 1-2 sentences. Suggested: 'Lynn [LAST_NAME] is the parts manager at Reyco Marine & Small Engine in Sault Ste. Marie. She manages OEM parts inventory for Mercury, Princecraft, Cub Cadet, Echo, and Toro equipment.']"
}
</script>
```

**Placeholders to fill:** `[LAST_NAME]`, `[BIO]`  
**Pronoun note:** Using "She" — confirm with Casey if incorrect.

---

## Block 6 — Ron [LAST_NAME] (stub — needs Charlene batch)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-ron",
  "name": "Ron [LAST_NAME]",
  "jobTitle": "Parts Specialist",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "description": "[BIO — 1-2 sentences. Suggested: 'Ron [LAST_NAME] is a parts specialist at Reyco Marine in Sault Ste. Marie. He helps customers source OEM and aftermarket parts for marine engines, outdoor power equipment, and powersports vehicles.']"
}
</script>
```

**Placeholders to fill:** `[LAST_NAME]`, `[BIO]`

---

## Block 7 — Kory [LAST_NAME] (stub — needs Charlene batch)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://reycomarine.com/#person-kory",
  "name": "Kory [LAST_NAME]",
  "jobTitle": "Sales",
  "worksFor": {
    "@type": "LocalBusiness",
    "@id": "https://reycomarine.com/#business"
  },
  "url": "https://reycomarine.com/about/",
  "description": "[BIO — 1-2 sentences. Suggested: 'Kory [LAST_NAME] is a sales associate at Reyco Marine in Sault Ste. Marie. He helps customers choose boats, outboard motors, lawn equipment, and powersports vehicles.']"
}
</script>
```

**Placeholders to fill:** `[LAST_NAME]`, `[BIO]`

---

## Dev Implementation Note

All 7 blocks go in `/about/` page `<head>`, inside a single commit. Template pseudocode:

```php
// In about-page.php or page-about.php template <head> section:
<?php
$person_schemas = [
    'casey'  => [ /* block 1 JSON */ ],
    'aaron'  => [ /* block 2 JSON */ ],
    'lee'    => [ /* block 3 JSON */ ],
    'damian' => [ /* block 4 JSON */ ],
    'lynn'   => [ /* block 5 JSON */ ],
    'ron'    => [ /* block 6 JSON */ ],
    'kory'   => [ /* block 7 JSON */ ],
];
foreach ($person_schemas as $schema) {
    echo '<script type="application/ld+json">' . json_encode($schema) . '</script>';
}
?>
```

Or inline each `<script>` tag directly in the template — either approach is valid.

**Validation:** Run each block through https://validator.schema.org/ after implementing. Confirm:
- No red errors
- `Person` entity is detected
- `worksFor` links to the `LocalBusiness` `@id` (confirms entity relationship)

---

## Status Summary

| Block | Status | Gate |
|-------|--------|------|
| Casey Davieaux | ✅ COMPLETE | Domain live |
| Aaron [LAST_NAME] | 🟡 Stub ready | Charlene batch (last name + bio) |
| Lee [LAST_NAME] | 🟡 Stub ready | Charlene batch + Casey Mercury cert confirm |
| Damian [LAST_NAME] | 🟡 Stub ready | Charlene batch (last name + bio) |
| Lynn [LAST_NAME] | 🟡 Stub ready | Charlene batch (last name + bio) |
| Ron [LAST_NAME] | 🟡 Stub ready | Charlene batch (last name + bio) |
| Kory [LAST_NAME] | 🟡 Stub ready | Charlene batch (last name + bio) |

**Time to complete once Charlene batch arrives:** ~30 minutes (SEO agent fills 6 placeholders → validates → hands to dev)

---

*No external actions taken. Staged files only.*  
*Prepared 2026-05-01. DO NOT deploy until reycomarine.com domain is live.*
