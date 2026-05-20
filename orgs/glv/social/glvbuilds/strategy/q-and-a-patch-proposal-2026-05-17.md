# Patch Proposal — Q&A Section in 8-Channel Posting Strategy Doc

**Date:** 2026-05-17 (~09:50 EDT)
**Owner:** social agent
**Status:** PROPOSAL — awaiting boss green-light for in-place edit to strategy doc
**Target file:** `orgs/glv/social/glvbuilds/strategy/8-channel-posting-strategy-2026-05-16.md`
**Reason for patch:** Google deprecated public Q&A on Maps in fall 2025 and replaced it with "Ask A Question" (AAQ). The recommendation to "seed Q&A proactively" is now invalid.
**Source:** [Whitespark — With Google Q&A Gone, You Need a Maps Ask A Question Strategy](https://whitespark.ca/blog/with-google-qa-gone-you-need-a-maps-ask-a-question-strategy/) (Miriam Ellis, Jan 26 2026)

---

## What to REMOVE from strategy doc

In the **GBP (Tier 4 — always-on transactional)** section, the current line reads:

> **GBP completeness pass (one-shot, blocking before first GBP post):** confirm address shows publicly, upload 8–12 non-stock photos, fill business description, set attributes, **seed 5–8 Q&As proactively**.

And further down in the same section:

> **Per scout research:** do NOT connect Instagram or Facebook to GBP — the connected social feed replaces native Update posts in the profile view. Connect LinkedIn or YouTube only, or nothing.

The "seed 5–8 Q&As proactively" instruction is the broken part. The connection-to-social-feed warning remains valid.

---

## What to REPLACE it with

Replace the GBP completeness-pass bullet with:

> **GBP completeness pass (one-shot, blocking before first GBP post):** confirm address shows publicly, upload 8–12 non-stock photos, fill business description, set attributes, **seed comprehensive FAQ answers across all the sources Google's AI scrapes for the new "Ask A Question" feature.**

Then ADD this new sub-section beneath the existing GBP bullets:

> ### Important: Google Q&A → "Ask A Question" (AAQ) shift (banked Jan 26 2026)
>
> Google deprecated the public Q&A board on Maps in fall 2025. The replacement is **"Ask A Question" (AAQ)**, which works differently:
>
> - AAQ comes **pre-populated** with questions Google thinks searchers will ask, plus accepts custom questions
> - Google's AI now **generates answers by scraping multiple sources**: uploaded menus, reviews, the business website, social media, and GBP attributes/categories
> - Business owners **can no longer directly answer questions** through GBP the way they could in the old Q&A board
> - **Any scrapable source becomes a de facto representative of the business** — including third-party review platforms, social media, and competitor-uploaded content. This introduces AI-misinformation risk if those sources are inaccurate or out of date.
>
> **New strategy: feed the sources Google's AI is scraping.**
>
> The Whitespark checklist (Jan 2026):
> 1. Maintain accurate GBP basics (name, address, phone, hours, website)
> 2. Upload comprehensive images and videos of products, services, premises
> 3. Encourage detailed reviews with photos and videos (review depth matters more than count)
> 4. Upload and maintain menus / service lists for accuracy
> 5. Maximize GBP attributes and categories
> 6. Link social media profiles via the NMX dashboard
> 7. **Identify customer FAQs and answer them prominently on the website** — both on a formal FAQ page AND throughout the site's content (service pages, blog posts, headers as questions)
>
> For GLV's foundational launch, this means: the GBP completeness pass adds an FAQ-content audit on glvmarketing.ca to the pre-launch task list. The website is now part of the GBP optimization surface, not just the GBP itself.
>
> **Cross-link:** The FAQ-on-website tactic aligns with the GEO best practices banked in trend-scan #2 (06:02 EDT 2026-05-17) — question-based H3 headers + answer-first content also drives ChatGPT / Perplexity / AI Overview citations. One content effort, two payoffs.

---

## Why this matters beyond the strategy doc

The Q&A → AAQ shift sharpens the existing GLV positioning in two ways:

1. **"AI is reading your business's reviews / website / social before customers do"** — this is a stronger sales angle than "claim your GBP and answer some questions." Strong content-marketing thesis for both organic carousels and outreach copy.

2. **Web copy + structured FAQ content is now load-bearing for GBP** — this creates an implicit handoff with the **web-copy** agent. If GLV publishes a FAQ page on glvmarketing.ca with question-based H3s, that page now powers BOTH (a) the AAQ answers Google generates on GLV's own GBP, AND (b) GLV's own visibility in ChatGPT/Perplexity AI-search responses. Worth flagging to web-copy after the patch lands.

---

## Diff summary

| Field | Before | After |
|-------|--------|-------|
| GBP pre-flight checklist item | "Seed 5–8 Q&As proactively" | "Seed FAQ answers across the sources Google's AI scrapes for AAQ" |
| New sub-section | (none) | "Google Q&A → AAQ shift" — 7-step Whitespark checklist + cross-link to GEO best practices |
| Cross-agent flag | (none) | New: web-copy now owns FAQ page on glvmarketing.ca for AAQ feed |
| Existing rules preserved | (yes) | "Do NOT connect IG/FB to GBP" rule untouched |

---

## Recommended workflow for boss

1. Review this patch proposal
2. If approved: I do the in-place edit on `8-channel-posting-strategy-2026-05-16.md` and KB re-ingest
3. After patch is in place, I send a one-line agent-message to web-copy flagging the new FAQ-page implication for glvmarketing.ca
4. Aiden's response on the broader 12-decision list is unaffected by this patch — Q&A change is factual correction, not strategy change

ETA from approval to patch-applied + KB-reingested: under 5 minutes.

---

## Updated
2026-05-17T13:50:00Z (social agent)
