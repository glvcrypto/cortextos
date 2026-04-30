# On-Page SEO Pass — Small Engine Repair
**Draft reviewed:** `deliverables/copy/service-pages/small-engine-repair.md`  
**Reviewed:** 2026-04-25 by seo agent  
**Status:** CLEARED — all 7 must-do changes applied in v3. Ready for Aiden voice check → dev integration.

---

## Overall Assessment

Strong draft. Voice is right, local signals present, internal links planned. Needs 4 minor structural additions and 3 factual flags for Casey before publish.

---

## Title Tag + Meta Description (MISSING FROM DRAFT — add to page template)

**Title tag:**
```
Small Engine Repair Sault Ste. Marie | Reyco Marine
```
(51 chars — within 60-char display limit)

**Meta description:**
```
Certified small engine repair in Sault Ste. Marie. Lawn mowers, snowblowers, chainsaws — authorized Cub Cadet, Toro & Echo service. Call 705-253-7828.
```
(151 chars — within 158-char display limit)

---

## H-Structure Review

| Current H2 | Issue | Recommended Change |
|------------|-------|-------------------|
| "What we fix" | Weak keyword signal | → "Small Engine Repair Services" |
| "How service actually works" | ✅ Good — keep | No change |
| "When to bring it in" | Minor improvement available | → "Signs Your Small Engine Needs Repair" (captures long-tail query) |
| "Why Reyco" | Weak keyword signal | → "Authorized Small Engine Service in Sault Ste. Marie" |
| "What it costs" | ✅ Good — keep | No change |
| "Book your repair" | Minor | → "Book Your Small Engine Repair" |

Keyword signal in H2s matters — Google uses heading structure to understand page topical relevance. The 3 H2 changes above are the highest-value edits.

---

## Keyword Integration

| Keyword | Status | Action |
|---------|--------|--------|
| small engine repair (primary) | ✅ Present throughout | None |
| Sault Ste. Marie | ✅ H1, body, address | None |
| small engine repair near me | ✅ Implied by geo signals — no direct use needed | None |
| small engine mechanic | ✗ Not in draft (0 mentions) | Add one natural use: "Our small engine mechanics" in the How Service Works section opener |
| small engine won't start after winter | ✅ Covered organically in "When to bring it in" | None |
| authorized / authorised | ⚠ British spelling used throughout | Use "authorized" (Canadian web standard — matches schema + GMB) |

---

## Internal Links (already planned in draft — confirm placement)

| Link | Anchor Text | Place in body |
|------|-------------|---------------|
| /tune-ups/ | "spring tune-up" | Already natural in "What it costs" section — link it |
| /lawn-equipment-service/ | "lawn mowers" | In "What we fix" list item |
| /snow-equipment-service/ | "snowblowers" | In "What we fix" list item |
| /warranty-claims/ | "warranty claims" | Already linked ✅ |
| /service-and-repair/ | "service and repair" | In "Why Reyco" or footer breadcrumb |

---

## FAQ Block — Add at Bottom (recommended)

Add a short FAQ section before the final CTA. Captures long-tail queries + enables FAQPage schema.

**Suggested H2:** "Small Engine Repair — Common Questions"

**3 questions to include:**
1. "How long does small engine repair take?"  
   Suggested answer: "Most repairs take 3–5 business days. Simple jobs like spark plug replacement or carburetor cleaning can be same-day if we're not backed up. We'll give you a realistic estimate at drop-off."

2. "How much does small engine repair cost?"  
   Suggested answer: "A typical spring tune-up runs 1–2 hours of bench time plus parts. Carburetor work is 1–3 hours plus parts. Major engine repairs are quoted after diagnostic — we'll call you with a price before any work starts."

3. "Do you service brands you don't sell?"  
   Suggested answer: "Yes. We're authorized for Cub Cadet, Toro, and Echo, but we work on most brands. If it's a small gas engine, bring it in. We'll diagnose it and tell you straight whether it makes sense to repair."

**Add FAQPage schema block** to page head for this page (in addition to the Service schema from schema-markup-templates.md section 2):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does small engine repair take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most repairs take 3–5 business days. Simple jobs like spark plug replacement or carburetor cleaning can be same-day if we're not backed up."
      }
    },
    {
      "@type": "Question",
      "name": "How much does small engine repair cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A typical spring tune-up runs 1–2 hours of bench time plus parts. Carburetor work is 1–3 hours plus parts. Major engine repairs are quoted after diagnostic — we'll call you with a price before any work starts."
      }
    },
    {
      "@type": "Question",
      "name": "Do you service brands you don't sell?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We're authorized for Cub Cadet, Toro, and Echo, but we work on most brands. If it's a small gas engine, bring it in and we'll tell you straight whether it makes sense to repair."
      }
    }
  ]
}
```

---

## Factual Flags — RESOLVED (per Aiden directive 2026-04-25)

| Claim | Resolution |
|-------|-----------|
| "more than 60 years" | ✅ Keep as written — defensible directional language |
| "27,000 sq ft" | ✅ Dropped entirely — replaced with "full-service facility on White Oak Drive" in v3 |
| Superior Marine acquisition | ✅ Dropped from service pages — belongs in About/Story copy only |

No Casey facts blocking publish. Page is clear to ship after Aiden voice check.

---

## Schema Implementation Note for Dev

This page gets TWO `<script type="application/ld+json">` blocks in `<head>`:
1. **Service schema** — from `schema-markup-templates.md` section 2
2. **FAQPage schema** — the block above

---

## Summary of Changes for Web-Copy

**All must-do changes applied in v3 (2026-04-25):**
1. ✅ Title tag + meta description added to page metadata block
2. ✅ 3 H2s renamed (Small Engine Repair Services / Signs Your Small Engine Needs Repair / Authorised Small Engine Service in Sault Ste. Marie)
3. ✅ "small engine mechanics" in How Service Works opener (line 2)
4. ✅ Canadian English -ise forms throughout (standing rule — do not alter)
5. ✅ "more than 60 years" kept (defensible)
6. ✅ FAQ block present before final CTA
7. ✅ Internal links wired: /tune-ups/, /lawn-equipment-service/, /snow-equipment-service/, /warranty-claims/

**Casey facts:** all dropped per Aiden directive — no blocking items remain.

**Keep exactly as written:**
- Voice and tone throughout — excellent
- All service descriptions — accurate and specific
- "Estimate first, then approval" workflow — strong trust signal
- Damian named — gives real E-E-A-T weight, keep it
- Pricing section — honest and specific, very good
