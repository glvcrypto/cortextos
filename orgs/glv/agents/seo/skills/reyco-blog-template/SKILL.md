---
name: reyco-blog-template
description: Reference for Reyco Marine WordPress blog post structure. Use when drafting any blog content for reyco.ca — outlines required sections, content format, and how the PHP template auto-populates CTAs and sidebars.
---

# Reyco Marine Blog Post Template

**Template file:** `wp-content/themes/reyco-marine/single.php`  
**Category config:** `wp-content/themes/reyco-marine/inc/blog-category-content.php`

---

## What the Template Auto-Generates

You do NOT need to write these — the PHP template handles them from post metadata:

- **Article header** — title, category badge, author, reading time (from `reyco_reading_time()`)
- **Featured image** — auto-displayed as full-width header + article hero
- **TL;DR box** — pulled from `template-parts/tldr-summary` (set via post meta or ACF field)
- **"Who This Article Is For"** — auto-populated by category (see category map below)
- **Table of Contents** — sidebar, auto-generated from H2s via JS
- **Author bio sidebar** — pulled from WP user profile (bio, credentials, years_experience, expert_photo)
- **Inline CTAs** — injected between H2 sections in rotation: `expert_quote → service → product_carousel → financing → newsletter → trade_in`
- **Related articles** — auto-queried by category
- **Related products** — `reyco_query_related_products()` — set via post meta
- **Prev/Next navigation** — auto
- **Footer CTAs** — service booking, financing

---

## What You Write (Post Content)

Write clean WordPress block content with:

### Required Structure
```
[Intro paragraph — no H2, 2-3 sentences, hooks the reader]

## H2 Section 1
[Body paragraphs, lists, tips]

## H2 Section 2
[Body, inline CTAs will auto-inject between H2s]

## H2 Section 3
...

## Conclusion / Next Steps
[End with a specific action or recommendation. The template adds CTAs after this.]
```

### Required Post Metadata
- **Title** — keyword-forward, conversational (not clickbait)
- **Slug** — lowercase, hyphenated, keyword match
- **Featured image** — required (used in header + related article cards)
- **Category** — must match one of the approved categories (see below)
- **Author** — assign to a named Reyco staff member (E-E-A-T signal)
- **Excerpt / meta description** — under 155 characters, used in SERPs

### Optional Post Metadata
- **TL;DR** — 2-4 bullet points for the summary box (highly recommended for SEO)
- **Related products** — post IDs to surface in product carousel and bottom grid
- **Related services** — service slugs to surface in inline and bottom service cards

---

## Approved Categories (maps to auto-content in blog-category-content.php)

| Category Slug | Expert | Audience Auto-Text |
|---------------|--------|-------------------|
| boating-tips | Casey Davieaux — Owner & Marine Specialist | First-time boat buyers, experienced boaters, brand comparers |
| boats-and-marine | Casey Davieaux | Boat shoppers, inventory browsers |
| lawn-and-garden | [OPE specialist] | Homeowners, DIYers, brand comparers |
| snow-equipment | [OPE specialist] | Northern Ontario homeowners, snowblower buyers |
| service-and-repair | [Service tech] | Equipment owners, DIYers, repair vs. replace deciders |

---

## Content Tone (from modern-seo-philosophy.md)

- Always written from named Reyco staff perspective — "Our team at Reyco..." or "Casey explains..."
- No generic "10 things about X" framing
- Give enough detail that readers COULD do it themselves — but most will want Reyco's help
- Positive framing only: curiosity, aspiration, pride, upside FOMO — no fear, no shame
- Northern Ontario context wherever possible (local lakes, seasonal timing, regional brands)

---

## Casey Davieaux Expert Quote (hardcoded in template)

> "We built this business on one idea: if we take care of people honestly, they will keep coming back. That is not a marketing line. That is how we run the shop every single day."
> — Casey Davieaux, Owner, Reyco Marine & Small Engine Ltd.

This appears as the first inline CTA after H2 section 1. You don't need to include it in the post body.

---

## Word Count Guidelines

| Post Type | Target Length |
|-----------|--------------|
| TOFU (awareness) | 1,200–1,800 words |
| MOFU (consideration) | 1,500–2,500 words |
| BOFU (conversion) | 800–1,200 words |
| Service/product page | 600–1,000 words |

---

## Content Funnel Reference

Full 62-funnel plan: `life-os/projects/reyco-marine/seo/content-plans/2026-03-28-content-funnel-plan.md`
