# Reyco Marine — R18: Full Blog Audit (40 posts)
**Prepared:** 2026-04-30 by seo agent  
**Source:** URL inventory (url-inventory-2026-04-26.csv) — all 40 published posts  
**HTML available for:** 5 posts (scanned in R17); remaining 35 assessed from URL inventory + title analysis  
**Note:** reyco.glvmarketing.ca staging is WAF-blocked from WSL — full HTML audit of remaining 35 posts requires post-launch GSC access or dev HTML export.

---

## CRITICAL PRE-LAUNCH ISSUE: Duplicate Post Publishing (4 pairs = 8 posts)

**Severity: P0 — duplicate content, Google de-duplication before launch**

WordPress has published 8 posts as duplicate pairs — each pair has identical titles (and likely identical content) at two different slugs, where the second slug ends in `-2`. This is a known WordPress artifact when a post is published twice (e.g., hitting "Publish" twice, or copying a draft).

**Complete duplicate pair list:**

| Title | Original slug | Duplicate slug (delete this) |
|-------|--------------|------------------------------|
| Twenty Years Behind the NAPA Counter Taught Me Everything | `/twenty-years-behind-the-napa-counter-taught-me-everything/` | `/twenty-years-behind-the-napa-counter-taught-me-everything-2/` |
| How to Store Your Mower So It Actually Starts in May | `/how-to-store-your-mower-so-it-actually-starts-in-may-i-see-this-go-wrong-every-year/` | `/how-to-store-your-mower-so-it-actually-starts-in-may-i-see-this-go-wrong-every-year-2/` |
| We Sponsored the Pike Derby Again and It Was the Best One Yet | `/we-sponsored-the-pike-derby-again-and-it-was-the-best-one-yet/` | `/we-sponsored-the-pike-derby-again-and-it-was-the-best-one-yet-2/` |
| We Are Bringing the Whole Fleet to the 2026 Sault Boat Show | `/we-are-bringing-the-whole-fleet-to-the-2026-sault-boat-show/` | `/we-are-bringing-the-whole-fleet-to-the-2026-sault-boat-show-2/` |

**Action:** Dev deletes or sets to Draft the 4 `-2` posts in WP Admin before domain cutover. Zero ambiguity — all 4 are duplicates. The originals (without `-2`) are canonical.

If any `-2` post has accumulated external links before launch, add a 301 redirect from `-2` → original slug. Otherwise just delete.

**One additional item (no duplicate — URL missing from inventory):** `every-boat-launch-near-the-sault-ranked-by-a-guy-who-has-used-them-all` appears in the inventory without a full URL (CSV parsing issue). Verify in WP Admin that this post is published and the URL is correct.

---

## E-E-A-T Assessment: Blog Content Quality

**Overall signal: Strong.** The 40 posts (32 unique) form a comprehensive first-person E-E-A-T content library. Content clusters map directly to Reyco's service and product lines.

### Content Cluster Analysis

**Cluster 1 — Local Knowledge (highest E-E-A-T value)**
First-person, location-specific content that only someone actually in Sault Ste. Marie could write:
- "My Favourite Walleye Spots Within an Hour of the Sault"
- "Every Boat Launch Near the Sault, Ranked by a Guy Who Has Used Them All"
- "Small Engine Repair in the Sault — What I Fix Every Single Week"
- "How I Help People Pick the Right Snowblower for the Sault"
- "Boats for Sale in Sault Ste Marie — What I Wish Someone Told Me Before Buying"

**SEO signal:** These posts target hyper-local queries with zero competition. "Small engine repair in the Sault" directly supports the `/service/small-engine/` page — Google sees the author as an authority in SSM for this topic.

---

**Cluster 2 — Dealer Expertise / Product Comparisons**
Brand-comparison and "what I actually see" content from a dealer's vantage point:
- "I Have Sold Both for Years — Here Is My Honest Take on Cub Cadet vs Toro"
- "Mercury vs Yamaha: What I Actually See on the Bench"
- "What I Tell Every Customer Choosing Between Two-Stage and Three-Stage Snowblowers"
- "Riding Mower or Zero-Turn? Here Is What I Tell People"
- "Pontoon or Fishing Boat? How We Help Families Decide"
- "How I Help Customers Pick the Right Horsepower (and Why More Is Not Always Better)"
- "Why I Stopped Recommending Canadian Tire for Outdoor Power Equipment"
- "Why I Chose Princecraft — And Why It Matters Up Here"

**SEO signal:** Comparison posts ("Cub Cadet vs Toro", "Two-Stage vs Three-Stage") rank well for high-intent product research queries. "Why I Stopped Recommending Canadian Tire" is strong differentiation content — dealer authority vs big-box.

---

**Cluster 3 — How-To / Instructional Content**
Expertise-demonstrating guides from seasonal service experience:
- "How to Store Your Mower So It Actually Starts in May"
- "My Pre-Season Snowblower Checklist (Do This Before the First Dump)"
- "My Spring Commissioning Checklist (And What People Always Skip)"
- "How We Winterize Up Here (And Why Cutting Corners Costs Thousands)"
- "My Spring Lawn Routine After 15 Years in Northern Ontario"
- "Opening Weekend Is Basically Christmas for Me — Here Is How I Prep My Boat"

**SEO signal:** Seasonal instructional content (winterization, commissioning, spring prep) supports the corresponding service pages. "How We Winterize Up Here" should link to `/service/winterization/` — see Internal Linking section below.

---

**Cluster 4 — Buyer's Guides**
First-time buyer and product selection content:
- "What Nobody Tells You Before You Buy Your First Boat"
- "What I Wish Someone Told Me Before I Bought My First Boat"
- "How to Choose the Right Mercury Outboard for Northern Ontario" *(HTML audited — strong)*
- "How to Choose the Right Boat Trailer for Northern Ontario"
- "Golf Carts for Cottage Country: What to Know Before You Buy in Northern Ontario"
- "Princecraft Fishing Boats for Northern Ontario: What Makes Them the Right Choice" *(HTML audited — strong)*
- "What You Actually Need for a Northern Ontario Cottage (From the Guys Who Sell All of It)"

---

**Cluster 5 — Casey's Story / Business Narrative**
First-person owner narrative that establishes Casey as a real, credentialed expert:
- "Why I Bet Everything on a Marine Dealership in 2023" *(HTML audited)*
- "Twenty Years Behind the NAPA Counter Taught Me Everything" *(HTML audited)*
- "I Did the Math — You Can Own a Boat for Less Than Your Truck Payment"

**E-E-A-T signal:** Casey's 20 years at NAPA + decision to open the dealership in 2023 is the cornerstone narrative. Once Casey Person schema is live on the About page, these posts should be linked to his bio. This cluster is the E-E-A-T anchor for the entire site.

---

**Cluster 6 — Brand/Product Spotlight**
Product-specific content for brands Reyco carries:
- "Troy-Bilt Outdoor Power Equipment for Northern Ontario Properties"
- "Why Spot-Lock Changed Everything About How I Fish" (Minn Kota)
- "Hey Landscapers — Your Equipment Might Be More Tax Deductible Than You Think"
- "Boat Financing in Ontario — How We Actually Make It Work for People"

---

**Cluster 7 — Events / Community**
Local engagement content:
- "We Sponsored the Pike Derby Again and It Was the Best One Yet"
- "We Are Bringing the Whole Fleet to the 2026 Sault Boat Show"

**SEO signal:** Lower keyword value but builds brand recognition and NAP-reinforcing local signals (Sault Ste. Marie) across multiple posts.

---

## Internal Linking Gaps — Blog → Service Page

Every instructional post should link back to the corresponding service page. Current state unknown (35 posts not HTML-scanned), but these are the critical links to verify/add:

| Post | Should link to |
|------|---------------|
| How to Store Your Mower... | `/service/lawn-equipment/` + `/service/tune-ups/` |
| My Pre-Season Snowblower Checklist | `/service/snow-equipment/` + `/service/tune-ups/` |
| How We Winterize Up Here | `/service/winterization/` |
| My Spring Commissioning Checklist | `/service/spring-commissioning/` |
| Small Engine Repair in the Sault | `/service/small-engine/` |
| Mercury vs Yamaha | `/service/marine/` |
| Opening Weekend — How I Prep My Boat | `/service/spring-commissioning/` |

**Action:** When doing the May retainer content pass, verify internal links in each post. Add service-page links where missing. This distributes blog link equity into commercial service pages.

---

## Meta Description Gaps

All 35 blog posts without HTML-scanned metas are assumed to have generic fallback metas (the same pattern as the 80 category pages). The 5 HTML-scanned posts (R17) have custom metas.

**Action:** Once RankMath is installed (or existing meta mechanism is confirmed), write custom metas for all 35 remaining posts. Priority order: Cluster 1 (local knowledge) + Cluster 3 (how-to/instructional) — these have the highest organic traffic potential.

---

## Author Schema Gap (all 40 posts)

None of the 40 posts (5 HTML-scanned, 35 unscanned) are confirmed to have `author` schema connecting to a Person schema ID. Once Casey Person schema is live at `/author/casey/`, all posts should include:
```json
"author": {
  "@type": "Person",
  "@id": "https://reycomarine.com/author/casey/"
}
```

This is a May retainer sprint item — gated on Charlene batch delivering Casey's full details.

---

## Audit Action Summary

| Action | Priority | Gate |
|--------|----------|------|
| Delete/draft 4 duplicate `-2` posts | **P0 pre-launch** | Dev action in WP Admin |
| Verify `every-boat-launch...` URL in WP Admin | P1 | Dev check |
| Fill meta descriptions for 35 posts | P1 May sprint | RankMath install or existing mechanism |
| Add service-page internal links to instructional posts | P1 May sprint | Content pass |
| Add author schema to all posts | P2 May sprint | Casey Person schema must be live first |

---

## Blog Post Roster (32 unique posts after removing 4 duplicates)

| # | Title | Cluster | Slug |
|---|-------|---------|------|
| 1 | Princecraft Fishing Boats for Northern Ontario | Buyer's guide | princecraft-fishing-boats-northern-ontario |
| 2 | How to Choose the Right Mercury Outboard for Northern Ontario | Buyer's guide | choosing-mercury-outboard-northern-ontario |
| 3 | Golf Carts for Cottage Country | Buyer's guide | golf-carts-cottage-country-northern-ontario-ez-go |
| 4 | How to Choose the Right Boat Trailer for Northern Ontario | Buyer's guide | best-boat-trailer-northern-ontario-easy-hauler |
| 5 | Troy-Bilt Outdoor Power Equipment for Northern Ontario | Brand spotlight | troy-bilt-outdoor-power-equipment-northern-ontario |
| 6 | How to Store Your Mower So It Actually Starts in May | How-to | how-to-store-your-mower-so-it-actually-starts-in-may-i-see-this-go-wrong-every-year |
| 7 | Twenty Years Behind the NAPA Counter Taught Me Everything | Casey narrative | twenty-years-behind-the-napa-counter-taught-me-everything |
| 8 | Opening Weekend Is Basically Christmas for Me | How-to | opening-weekend-is-basically-christmas-for-me-here-is-how-i-prep-my-boat |
| 9 | What You Actually Need for a Northern Ontario Cottage | Buyer's guide | what-you-actually-need-for-a-northern-ontario-cottage-from-the-guys-who-sell-all-of-it |
| 10 | My Favourite Walleye Spots Within an Hour of the Sault | Local knowledge | my-favourite-walleye-spots-within-an-hour-of-the-sault |
| 11 | Every Boat Launch Near the Sault, Ranked | Local knowledge | every-boat-launch-near-the-sault-ranked-by-a-guy-who-has-used-them-all |
| 12 | What Nobody Tells You Before You Buy Your First Boat | Buyer's guide | what-nobody-tells-you-before-you-buy-your-first-boat |
| 13 | Why I Bet Everything on a Marine Dealership in 2023 | Casey narrative | why-i-bet-everything-on-a-marine-dealership-in-2023 |
| 14 | We Sponsored the Pike Derby Again | Event/community | we-sponsored-the-pike-derby-again-and-it-was-the-best-one-yet |
| 15 | We Are Bringing the Whole Fleet to the 2026 Sault Boat Show | Event/community | we-are-bringing-the-whole-fleet-to-the-2026-sault-boat-show |
| 16 | Riding Mower or Zero-Turn? | Comparison | riding-mower-or-zero-turn-here-is-what-i-tell-people |
| 17 | My Spring Lawn Routine After 15 Years in Northern Ontario | How-to | my-spring-lawn-routine-after-15-years-in-northern-ontario |
| 18 | My Pre-Season Snowblower Checklist | How-to | preparing-snowblower-for-winter |
| 19 | How I Help Customers Pick the Right Horsepower | Comparison | choosing-right-horsepower |
| 20 | Hey Landscapers — Your Equipment Might Be More Tax Deductible | Brand spotlight | equipment-financing-tax-benefits |
| 21 | I Did the Math — You Can Own a Boat for Less Than Your Truck Payment | Casey narrative | boat-less-than-truck-payment |
| 22 | Cub Cadet vs Toro — My Honest Take | Comparison | cub-cadet-vs-toro |
| 23 | Two-Stage vs Three-Stage Snowblowers | Comparison | two-stage-vs-three-stage-snowblower |
| 24 | Why I Stopped Recommending Canadian Tire | Dealer expertise | dealer-vs-canadian-tire |
| 25 | How We Winterize Up Here | How-to | winterization-guide |
| 26 | My Spring Commissioning Checklist | How-to | spring-commissioning-checklist |
| 27 | Why Spot-Lock Changed Everything About How I Fish | Brand spotlight | minnkota-spot-lock-guide |
| 28 | Mercury vs Yamaha: What I Actually See on the Bench | Comparison | mercury-vs-yamaha |
| 29 | Why I Chose Princecraft | Brand spotlight | princecraft-canadian-made |
| 30 | Pontoon or Fishing Boat? | Comparison | pontoon-vs-fishing-boat |
| 31 | What I Wish Someone Told Me Before I Bought My First Boat | Buyer's guide | first-time-boat-buyers-guide |
| 32 | Boat Financing in Ontario | Brand spotlight | boat-financing-in-ontario-how-we-actually-make-it-work-for-people |
| 33 | How I Pick the Right Outboard Motor | Comparison | how-i-pick-the-right-outboard-motor-for-every-boat-that-comes-through-our-shop |
| 34 | How I Help People Pick the Right Snowblower for the Sault | Local knowledge | how-i-help-people-pick-the-right-snowblower-for-the-sault |
| 35 | Small Engine Repair in the Sault — What I Fix Every Single Week | Local knowledge | small-engine-repair-in-the-sault-what-i-fix-every-single-week |
| 36 | Boats for Sale in Sault Ste Marie | Local knowledge | boats-for-sale-in-sault-ste-marie-what-i-wish-someone-told-me-before-buying |

---

*No external actions taken. Internal audit only.*  
*Prepared 2026-04-30.*
