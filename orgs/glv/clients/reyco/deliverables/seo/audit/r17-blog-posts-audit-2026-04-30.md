# Reyco Marine — R17: Blog Posts Audit (5 posts)
**Prepared:** 2026-04-30 by seo agent  
**Source data:** tech-scans/ (5 blog post HTML files)  
**Protocol:** 8-point checklist + blog-specific checks (author schema, canonical, duplicate content)

---

## Posts Audited

| Post | URL slug | H1 | Schema | Alt | Issues |
|------|----------|----|--------|-----|--------|
| How to Choose the Right Mercury Outboard for Northern Ontario | /choosing-mercury-outboard-northern-ontario/ | ✅ | 2 blocks | ✅ | Title too long |
| Princecraft Fishing Boats for Northern Ontario | /princecraft-fishing-boats-northern-ontario/ | ✅ | 2 blocks | ✅ | Title too long |
| Twenty Years Behind the NAPA Counter (original) | /twenty-years-behind-the-napa-counter-taught-me-everything/ | ✅ | 2 blocks | ❌ 3 | Duplicate post exists |
| Twenty Years Behind the NAPA Counter (duplicate) | /twenty-years-behind-the-napa-counter-taught-me-everything-2/ | ✅ | 2 blocks | ❌ 3 | **Duplicate — same title, same meta, same H1** |
| Why I Bet Everything on a Marine Dealership in 2023 | /why-i-bet-everything-on-a-marine-dealership-in-2023/ | ✅ | 2 blocks | ❌ 3 | Title too long |

---

## Issue 1 — Duplicate post: "Twenty Years Behind the NAPA Counter"
**Severity: P0 — duplicate content signal**

Two live published URLs share an identical title, H1, meta description, and (based on equal BYTES: 78,038 for both) identical content:
- `/twenty-years-behind-the-napa-counter-taught-me-everything/`
- `/twenty-years-behind-the-napa-counter-taught-me-everything-2/`

Google will treat one of these as canonical and suppress the other. The `-2` slug suggests it's a staging artifact (duplicate created when the post was published twice, or copied during dev).

**Recommended fix:**
1. **Delete the `-2` post** (if it's a pure duplicate with no unique content). This is the cleanest fix — removes the duplicate from the index entirely.
2. **If there's a reason for both to exist:** Add a canonical tag on `-2` pointing to the original: `<link rel="canonical" href="https://reycomarine.com/twenty-years-behind-the-napa-counter-taught-me-everything/">`. Also differentiate the title on `-2` to avoid the duplicate title penalty.

**Action for dev:** Confirm in WP Admin → Posts whether `/twenty-years-behind-the-napa-counter-taught-me-everything-2/` is intentional. If not, delete it or set to draft before launch.

---

## Issue 2 — Blog post titles over 60 characters (all 3 long-form posts)
**Severity: P2 — SERP truncation**

| Post | Title chars | Truncation point at 60 chars |
|------|------------|------------------------------|
| Mercury outboard | 96 | "How to Choose the Right Mercury Outboard for Northern Ont…" |
| Princecraft fishing boats | 115 | "Princecraft Fishing Boats for Northern Ontario: What Makes…" |
| Why I bet everything | 86 | "Why I Bet Everything on a Marine Dealership in 2023 – Reyn…" |

These are narrative/story titles — the long form is intentional and works for the post content. Blog title length is less critical than page title length because Google rewrites long blog titles more generously in "article" snippets. However, Google may truncate them in regular SERPs.

**Recommended approach:** Keep the long narrative titles as-is (they're distinctive and encourage clicks for the audience reading them). Add a shorter `og:title` or RankMath SEO title override if click-through data shows truncation is hurting CTR post-launch.

**No immediate action required** — monitor post-launch CTR in GSC.

---

## Issue 3 — Empty alt text on 3 posts (3 images each)
**Severity: P1 — image indexing + accessibility**

Posts affected:
- `twenty-years-behind-the-napa-counter` (both duplicates): 3 of 9 images have `alt=""`
- `why-i-bet-everything-on-a-marine-dealership-in-2023`: 3 of 9 images have `alt=""`

Blog post images are content images, not decorative — they should have descriptive alt text for image search indexing and accessibility.

**Recommended alt text format for Casey-authored posts:**
- Feature image: `"[Post topic visual] — Reyco Marine, Sault Ste. Marie"` or descriptive of the image
- Inline images: Describe the actual content of the image

**Action:** Dev fills alt text for these 9 images (3 per affected post). Can be batched with the site-wide DEV TICKET 3 (alt text audit).

---

## What's Working Well

**Meta descriptions:** All 5 posts have page-specific meta descriptions — good. The metas are first-person narrative tone matching the posts, with the brand/dealer signal ("Reyco Marine is an authorized Mercury Marine dealer…"). No changes needed.

**H1s:** All 5 posts have H1s — full title rendered correctly. No template issue here.

**Schema:** All 5 posts show 2 schema blocks — LocalBusiness + Article/BlogPosting is the expected pattern for blog posts. Schema is working correctly on posts.

**Internal linking:** All posts show 297–300 internal links — high count is normal for pages with full site navigation. No cross-link gaps flagged.

**Blog posts as E-E-A-T assets:** "Twenty Years Behind the NAPA Counter" and "Why I Bet Everything on a Marine Dealership in 2023" are first-person Casey-authored posts. These are high-value E-E-A-T signals — they establish Casey as a real person with real expertise. Once Person schema is live on the About page (post-Charlene batch), these posts should include `author` schema connecting to Casey's Person schema ID.

---

## Author Schema — Future Work

**Current state:** Blog posts have 2 schema blocks (LocalBusiness + Article). The Article schema likely has no `author` field populated — or uses a generic author.

**Recommended improvement (May retainer sprint):**
Once Casey Person schema is live (`https://reycomarine.com/author/casey/` with full name, jobTitle, worksFor), update blog post Article schema to include:
```json
"author": {
  "@type": "Person",
  "@id": "https://reycomarine.com/author/casey/"
}
```

This connects the blog posts to Casey's E-E-A-T anchor — strengthens the "Experience" and "Expertise" signals that Google weighs for content about marine and outdoor equipment.

**Gate:** Casey Person schema must be live first (waiting on Charlene batch for last name + bio details).

---

## Blog SEO Status Summary

| Check | Status |
|-------|--------|
| Meta descriptions | ✅ All 5 custom |
| H1s | ✅ All 5 present |
| Schema (LocalBusiness + Article) | ✅ Working |
| Duplicate post | ❌ Twenty Years NAPA — 2 identical posts |
| Alt text | ❌ 3 posts have 3 empty alt each |
| Title length | ⚠️ All long-form titles >60 chars — monitor post-launch |
| Author schema (future) | ⏳ Waiting on Casey Person schema |
| Generic meta | ✅ Not affected — posts have custom metas |

---

*No external actions taken. Internal audit only.*  
*Prepared 2026-04-30.*
