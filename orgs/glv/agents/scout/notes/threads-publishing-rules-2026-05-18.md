<!-- skip-content-check -->
# Threads Publishing Rules for GLV

**Research date:** 2026-05-18
**Trigger:** Tonight's intro-1 carousel failed on Blotato. Blotato error: "Threads only supports a single image or a video."
**Status:** Permanent rule, ready to bank as feedback memory + load for content/social agents on every Threads post.

---

## TL;DR (the rule, banked)

When publishing to Threads:

1. **Caption is different from IG/FB/LinkedIn.** Never reuse the IG caption verbatim. Shorter, more conversational, hook-led, no hashtag block.
2. **Caption length by post type** (different-and-shorter-per-post-type):
   - Intro / agency overview: 80-150 chars
   - GBP / local-SEO tip: 100-180 chars
   - Case study / client win: 150-240 chars
   - Behind-the-scenes / culture: 60-140 chars
   - Hard cap: 500 chars (Threads platform max); soft cap: under 200 for best engagement
3. **One topic tag per post** (Threads policy enforcement, not optional). No hash symbol. Multi-word allowed. Source: Threads @threads canonical post.
4. **Visual format**: single 1080x1350 (4:5) image OR vertical video under 60s. If a carousel exists for the post elsewhere, do not push the carousel to Threads via Blotato (Blotato pathway is single-image-or-video only). Either (a) extract one hero slide and post that, or (b) native-API the full 2-10 image carousel.
5. **Hook = first 1-2 lines.** First-person + counter-intuitive or specific-outcome opener. Question hooks work. Generic openers ("Excited to share...") do not.
6. **No hashtag block at end.** Threads is conversation-first, not discovery-first. The topic tag goes inline or at end as the single tag.

---

## Why each rule exists

### Rule 1: Caption is different from IG

**Why:** Threads is conversation-first, not broadcast-first. The algorithm rewards replies more than reach. (Source: outfy.com Threads marketing strategy 2026; sociavault.com data-driven Threads strategy.) A polished IG caption with hashtag block reads as broadcast and underperforms. Duolingo's documented Threads strategy: "Repackages viral Instagram Reels into Threads-friendly snippets (adjust the caption to be shorter and more conversational)" (Source: posteverywhere.ai how-to-go-viral-on-threads).

**How to apply:**
- Start from the IG hook, then strip everything that reads like marketing copy.
- Cut emoji density by ~50% (Threads is more text-forward than IG).
- Rewrite the CTA: IG = "Comment WORD for the guide". Threads = "Reply if you want the GBP checklist" or just leave the conversation open.
- If the IG caption has 6+ hashtags at end, kill that block entirely on Threads.

### Rule 2: Caption length by post type

**Why:** Threads has a 500-char limit (Source: typecount.com, gtrsocials.com), but posts between 200-300 chars perform better, with bite-sized under 200 chars being optimal for engagement (Source: outfy.com 2026 Threads marketing strategy). The "different-and-shorter-per-post-type" pattern reflects Aiden's directive that intro posts, GBP tips, case studies, and behind-scenes content each have different optimal lengths because they carry different information density.

**How to apply (per post type):**

| Post type | Length range | Structure |
|---|---|---|
| Intro / agency overview | 80-150 chars | Hook line + one sentence about what GLV does. No spec list, no service menu. |
| GBP / local-SEO tip | 100-180 chars | Data-point or contrarian hook + one concrete fact or fix. Leave room for them to ask. |
| Case study / client win | 150-240 chars | Result reveal + one-line context + invitation to ask how. |
| Behind-the-scenes / culture | 60-140 chars | Conversational, often question-led. Keep it short. |

If the IG version is 800 chars, the Threads version is the first 1-2 sentences plus a different ending. Not a truncation. A rewrite.

### Rule 3: One topic tag per post

**Why:** Threads enforces this at the platform level. Verbatim from Meta's own @threads account: "You can only tag one topic per post, so select a topic that best represents what you're saying. Why just one? This makes it easier for others who care about that topic to find and read your post." (Source: threads.com/@threads/post/C0j6y3VrD2o). Searchengineland and Social Media Today both confirmed the single-tag cap is anti-spam by design (Source: searchengineland.com Threads hashtags topic tags; socialmediatoday.com Threads rolls out topic tags).

**How to apply:**
- Topic tags do not use the `#` symbol on Threads.
- The tag can be multi-word: "Local SEO" or "Small Business Marketing" both work.
- Pick the most-specific topic that fits the post's actual content. For GLV: "Local SEO", "Google Business Profile", "Small Business Marketing", "Sault Ste Marie" (city-specific posts).
- Do not also paste an IG-style 8-hashtag block. It will look like noise and dilute reach.

### Rule 4: Visual format constraints

**Why - Blotato pathway:** Blotato's Threads integration accepts single image OR single video per post, not multi-image carousels. This is a Blotato-side API limitation. (Source: tonight's Blotato error message verbatim.) **unverified:** Blotato's public docs may have updated since tonight's failure; if multi-image becomes supported there, this constraint relaxes.

**Why - Threads platform itself:** Threads DOES natively support carousels of 2-10 images per post via its native UI and via the Meta Threads API. Carousels cannot mix images and videos; all items must be IMAGE type (Source: postfa.st api-guides/threads/carousels; posteverywhere.ai post-to-threads-api). So the Blotato single-image limit is a tool-pathway constraint, not a Threads platform constraint.

**How to apply:**
- **Default pathway (Blotato):** For any post that exists as a carousel elsewhere (IG), extract one hero slide and post that single image. Rewrite the caption to carry the context the swipeable carousel was carrying.
- **If carousel reach matters enough:** Bypass Blotato for that post; use the Threads native app or a tool that supports multi-image API (Ayrshare, PostFast both documented as supporting it; Source: ayrshare.com docs Threads; postfa.st api-guides). This is a per-post call, not a default.
- **Image specs:** 1080x1350 (4:5) is highest-performing for visibility (Source: postfa.st Threads post size; tacticsocial.com Threads image sizes 2026). Square (1:1) also displays fully without cropping.
- **Video:** under 60 seconds for best engagement, vertical preferred (9:16) for mobile screen real estate (Source: embedsocial.com new Threads features 2026).

### Rule 5: Hook in first 1-2 lines

**Why:** Threads feed shows the first 1-2 lines before the "more" cut, similar to early Twitter. Generic openers ("Excited to announce", "We're thrilled") burn that visible real estate. Documented hook patterns that work in 2026: counter-intuitive, credibility + access, first-person (+23% engagement vs third-person), specific outcome with mystery, question hooks (Source: posteverywhere.ai how-to-go-viral-on-threads; tweetarchivist.com viral threads 2026 guide; opentweet.io 2026 viral guide).

**How to apply (hook formulas mapped to GLV post types):**

- **Intro posts** (counter-intuitive or first-person): "Most marketing agencies charge by the hour. We don't." OR "I run GLV out of Sault Ste Marie. Here's why most SSM businesses can't find clients online."
- **GBP / local-SEO tips** (data-point or question): "67% of Sault Ste Marie businesses haven't claimed their GBP. Here's the 10-minute fix." OR "Why does your competitor outrank you on Google Maps when their website is worse? It's the GBP."
- **Case studies** (result reveal + mystery): "We took a Sault contractor from invisible to page-one for 'roofing Sault Ste Marie' in 6 weeks. One thing fixed it."
- **Behind-the-scenes** (conversational question): "Anyone else running a marketing agency in a city under 100k? How do you handle slow seasons?"

### Rule 6: No hashtag block at end

**Why:** Threads' algorithm and culture treat hashtag-stuffed posts as spam (Source: 12amagency.com 2026 hashtag guide: "X (Twitter) & Threads: Use 1-2 tags, as these platforms are conversation-heavy and too many hashtags make posts look like spam"). Combined with the one-topic-tag platform cap, multiple hashtags add noise without reach.

**How to apply:**
- Use the one topic tag. That is the hashtag strategy.
- Hashtag blocks that work on IG ("#localseo #smallbiz #SaultSteMarie #ontariobusiness") get cut entirely on Threads.

---

## GLV-niche examples (verified)

These are agency / brand patterns documented in 2026 Threads case studies. None are GLV-direct competitors yet (DIG has zero Threads presence per [[scout-competitor-radar-2026-05-17]]). Use as pattern reference, not as scripts to copy.

1. **Wendy's** — real-time trending-event reactions (Super Bowl example: posted live reactions to commercials, sparked engagement from football + food fans). Pattern: timeliness + brand voice. (Source: marketingagent.blog Complete Threads Marketing Strategy 2026.)

2. **Gymshark** — quirky workout memes + playful polls. Pattern: low-effort, high-personality content that invites reply, not just like. (Source: marketingagent.blog 2026.)

3. **ClickUp** — replies to every comment on product-launch threads. Pattern: the reply IS the strategy. The algorithm rewards conversation depth. (Source: marketingagent.blog 2026.)

4. **Duolingo** — repackages viral IG Reels into Threads-friendly snippets with shorter and more conversational captions. Pattern: same idea, different platform-shape. Confirms Rule 1 is industry-standard. (Source: posteverywhere.ai how-to-go-viral-on-threads.)

5. **unverified:** Specific small-business-marketing-agency Threads accounts with engagement data could not be found in 2026 search results. The pattern data above is from brand accounts in adjacent niches (consumer brands, B2B SaaS). The structural rules transfer; the voice has to be GLV's own.

---

## How content/social agents should apply this on every Threads post

Before publishing any Threads post, check these in order:

1. **Does the caption read like a polished IG caption?** If yes, rewrite shorter and more conversational. (Rule 1)
2. **Is the length appropriate for the post type?** Check the table in Rule 2. If a 240-char intro post, trim. If a 60-char case study, expand.
3. **Is there a single topic tag, no hash symbol, no other hashtags?** If multiple tags or a hashtag block, fix. (Rule 3, Rule 6)
4. **Is the visual a single image or single video?** If a carousel via Blotato, extract a hero slide. If carousel reach matters, route through a multi-image-API tool instead. (Rule 4)
5. **Does the first 1-2 lines hook?** If generic ("Excited to share"), rewrite using a Rule 5 formula.

---

## Caption skeletons per post type (drop-in templates)

**Intro post:**
```
[counter-intuitive or first-person hook, 1 line]

[one sentence on what GLV does for SSM businesses]

[optional: one open-ended question]

[topic tag: Small Business Marketing]
```

**GBP / local-SEO tip:**
```
[data-point or contrarian hook, 1 line]

[one concrete fact or 1-2 sentence fix]

[optional: invite reply for the full checklist]

[topic tag: Local SEO]
```

**Case study:**
```
[result reveal, 1 line]

[one-line context: what client, what timeframe, what the fix was]

[invitation: "Reply if you want to know how" or "DM if you want this for your business"]

[topic tag: matches the service used]
```

**Behind-the-scenes / culture:**
```
[conversational question or short observation]

[optional 1-line context]

[topic tag: Small Business Marketing OR Sault Ste Marie]
```

---

## Sources

- [Threads @threads canonical topic-tag post](https://www.threads.com/@threads/post/C0j6y3VrD2o?hl=en) -- T2 source-of-truth: "You can only tag one topic per post"
- [EmbedSocial - New Threads Features in 2026](https://embedsocial.com/blog/new-threads-features-2026/) -- native format support
- [TacticSocial - Threads Image Sizes 2026](https://tacticsocial.com/social-media-sizes/threads/) -- image specs
- [PostFast - Threads Post Size 1080x1350](https://postfa.st/sizes/threads/posts) -- 4:5 highest-performing
- [PostFast - Schedule Threads Carousels via API](https://postfa.st/api-guides/threads/carousels) -- native carousel 2-10 images via API
- [PostEverywhere - How to Post to Threads via API](https://posteverywhere.ai/blog/post-to-threads-api) -- carousel requirements, no video mixing
- [Ayrshare - Threads API docs](https://www.ayrshare.com/docs/apis/post/social-networks/threads) -- third-party multi-image-API tool exists
- [Outfy - Threads Marketing Strategy 2026](https://www.outfy.com/blog/threads-marketing/) -- 200-300 char engagement sweet spot, under 200 optimal
- [SociaVault - Threads Marketing Strategy Data-Driven](https://sociavault.com/blog/threads-marketing-strategy-data-driven) -- conversation-first algorithm
- [GTR Socials - Character Limits 2026](https://gtrsocials.com/blog/character-limits-on-social-media) -- 500-char Threads platform limit
- [TypeCount - Social Media Character Limits 2026](https://typecount.com/blog/social-media-character-limits) -- platform limit confirmation
- [PostEverywhere - How to Go Viral on Threads in 2026](https://posteverywhere.ai/blog/how-to-go-viral-on-threads) -- hook patterns, Duolingo repackage example
- [Tweet Archivist - Write Viral Twitter Threads 2026](https://www.tweetarchivist.com/how-to-write-viral-twitter-threads) -- first-person +23% engagement
- [12AM Agency - 2026 Hashtag Guide](https://12amagency.com/blog/how-to-use-hashtags-in-social-media-marketing-the-2026-guide/) -- 1-2 tags max on Threads, spam-look risk
- [Search Engine Land - Threads Topic Tags](https://searchengineland.com/threads-hashtags-topic-tags-435595) -- single tag anti-spam rationale
- [Social Media Today - Threads Topic Tags Global](https://www.socialmediatoday.com/news/threads-rolls-out-topic-tags-all-users-globally/701915/) -- platform-cap confirmation
- [Marketing Agent Blog - Complete Threads Marketing Strategy 2026](https://marketingagent.blog/2026/01/11/the-complete-threads-marketing-strategy-for-2026-from-x-alternative-to-metas-conversational-powerhouse/) -- Wendy's, Gymshark, ClickUp case studies

---

## Banked feedback rule (to load by content/social agents)

**Rule name:** `feedback_threads_publishing_rules`

**Summary:** Threads posts use different-and-shorter-per-post-type captions, one topic tag (no hash), single image or video only on Blotato pathway, hook in first 1-2 lines, no IG-style hashtag block. Full how-to-apply in this file.

**Why this matters:** Tonight's intro-1 carousel failed via Blotato because Threads carousel requires native API. Aiden directive: bank a permanent rule so this never blocks again.

**When this rule fires:** Every time a content or social agent prepares a Threads post or repurposes content from IG/FB/LinkedIn to Threads.
