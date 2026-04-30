# GLV Marketing Blog Configuration

Reference this file when writing blog posts for glvmarketing.ca.

---

## Database Schema

**Table:** `blog_posts`
**Supabase Project:** `sbixgdqaltsyzqqpvscf`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Auto-generated |
| title | TEXT | Not null |
| slug | TEXT | Unique, not null |
| excerpt | TEXT | Not null, used as meta description |
| content | TEXT | Markdown, not null |
| category | TEXT | Not null, must be from approved list |
| is_published | BOOLEAN | Default false |
| published_date | TIMESTAMP | Use `now()` for immediate publish |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated via trigger |

---

## SQL INSERT Template

```sql
INSERT INTO blog_posts (title, slug, excerpt, content, category, is_published, published_date)
VALUES (
  'TITLE HERE',
  'slug-here',
  'Excerpt / meta description here (under 155 characters)',
  E'MARKDOWN CONTENT HERE',
  'CATEGORY',
  true,
  now()
);
```

**Important:**
- Use `E'...'` for the content field so `\n` newlines work in PostgreSQL.
- Use single `\n` between elements (paragraphs, headings, list items). Do NOT use `\n\n` double newlines, as the blog renderer adds its own spacing and double newlines create visible blank lines.
- Escape any single quotes inside the content by doubling them (`''`).

---

## Categories

Use exactly one of these values:

1. `SEO`
2. `Digital Marketing`
3. `AI Automation`
4. `Social Media`
5. `Lead Generation`
6. `Web Design`
7. `GEO & AI Search`

---

## Brand Voice

### Tone
- Educational, direct, professional but approachable
- Write like a sharp local business owner explaining to a friend over coffee
- "Let's get this done to industry standard"
- Always local Northern Ontario context

### Language Rules
- **Canadian English** always: colour, favour, centre, analyse, optimise, etc.
- **Short sentences. Short paragraphs. No padding.**
- Never use em-dashes or en-dashes. Use commas, periods, or semicolons instead.
- No exclamation marks in headings.
- Do not start paragraphs with "So,", "Now,", or "Look,"

### Banned Words and Phrases

**Never use these words:**
comprehensive, leverage, unlock, elevate, game-changer, cutting-edge, robust, streamline, harness, delve, landscape, paradigm, synergy, holistic, revolutionize, empower, seamless

**Never use these phrases:**
- "in today's [anything]"
- "it's no secret"
- "here's the thing"
- "let's dive in" / "let's dive into"
- "in conclusion"
- "at the end of the day"
- "look no further"
- "the reality is"
- "whether you're a"
- "take your X to the next level"
- "the good news is"
- "but here's the kicker"
- "without breaking the bank"
- "navigate the [anything]"
- "in this blog post, we'll"
- "stay ahead of the curve"

### What Good GLV Copy Sounds Like
- "Most businesses in the Soo don't show up when someone searches for what they sell. That's not a branding problem. It's a visibility problem."
- "Google Business Profile is free. It takes 20 minutes to set up properly. And it's the single fastest way to show up in local search results."
- "You don't need a massive budget. You need the right pages, the right keywords, and someone who actually checks the data."

---

## Content Structure

### Format
- **Word count:** 900-1,400 words
- **Opening:** Short paragraph naming the problem. No rhetorical questions. No "in today's digital world."
- **Body:** 3-5 H2 sections with actionable content
- **FAQ section:** 2-3 H3 headings phrased as questions (these help with featured snippets)
- **Closing:** Natural 1-2 sentence CTA mentioning GLV Marketing and linking to `/contact`
- **Markdown:** Use `##` for H2, `###` for H3, **bold**, *italic*, bullets, numbered lists

### Heading Hierarchy
```
# [Title - only in the title field, not in content body]
## Section Heading
### Subsection or FAQ Question
```

---

## SEO Rules

### Keywords
- **Primary keyword pattern:** `[topic] Sault Ste. Marie`
- **Secondary keywords:** `[topic] Northern Ontario`, `digital marketing Sault Ste. Marie`
- **Long-tail pattern:** `best [topic] for small businesses in Sault Ste. Marie`

### Geographic Mentions
- Mention "Sault Ste. Marie" 3-5 times naturally throughout the post
- Mention "Northern Ontario" 2-3 times
- Never force keywords. If it reads awkwardly, rewrite the sentence.

### Title and Slug
- **Title:** Under 60 characters, includes location keyword
- **Slug:** Keyword-rich, lowercase, hyphens, under 60 characters
  - Example: `local-seo-tips-sault-ste-marie-2026`
- **Excerpt:** Under 155 characters, includes target keyword and location

### Statistics
- Do not hallucinate statistics. Only use widely known, verifiable facts.
- If citing a stat, mention the source inline (e.g., "according to Google").

---

## Internal Linking

Include 2-4 internal links per post using markdown syntax with relative URLs.

### Main Pages
- `/services` - Services overview
- `/about` - About GLV Marketing
- `/contact` - Contact / free consultation CTA
- `/blog` - Blog index

### Published Blog Posts
- `/blog/5-signs-your-business-is-invisible-online` - 5 Signs Your Business Is Invisible Online (And How to Fix It)
- `/blog/what-is-generative-engine-optimization-geo` - What Is Generative Engine Optimization (GEO)?

*(Update this list as new posts are published)*

### Link Examples
```markdown
[local SEO guide](/blog/5-signs-your-business-is-invisible-online)
[Book a free consultation](/contact)
[our services](/services)
```

### CTA Examples
- "GLV Marketing helps Sault Ste. Marie businesses get this right. [Book a free consultation](/contact) if you want a hand."
- "We covered this in our [guide to online visibility](/blog/5-signs-your-business-is-invisible-online)."
- "Need help with this? [Get in touch](/contact) and we'll walk you through it."

---

## Target Audience

- Small and mid-sized business owners in Sault Ste. Marie and Northern Ontario
- Industries: trades, professional services, hospitality, real estate, health/wellness, retail
- Decision-makers looking to grow online presence and generate local leads
- Comfort level: assumes basic digital literacy but not marketing expertise

---

## Business Contact (for CTAs)

- **Phone:** 705-975-0579
- **Email:** info@glvmarketing.ca
- **Website:** glvmarketing.ca

---

## Existing Post Cleanup

When fixing existing posts, use UPDATE statements:

```sql
-- Fix em-dashes
UPDATE blog_posts
SET content = REPLACE(content, '—', ', ')
WHERE content LIKE '%—%';

-- Fix en-dashes
UPDATE blog_posts
SET content = REPLACE(content, '–', '-')
WHERE content LIKE '%–%';
```

Review content manually for AI cliches from the banned list above and write targeted UPDATE statements for each post.

---

## Quick Reference Checklist

Before outputting a blog post SQL INSERT, verify:

- [ ] Title under 60 characters with location keyword
- [ ] Slug is lowercase, hyphenated, keyword-rich
- [ ] Excerpt under 155 characters with keyword and location
- [ ] Category is one of the 7 approved values
- [ ] Word count 900-1,400
- [ ] Canadian English throughout
- [ ] No banned words or phrases
- [ ] No em-dashes or en-dashes
- [ ] "Sault Ste. Marie" mentioned 3-5 times
- [ ] "Northern Ontario" mentioned 2-3 times
- [ ] 2-4 internal links included
- [ ] Ends with natural CTA linking to /contact
- [ ] 2-3 FAQ-style H3 headings
- [ ] No hallucinated statistics
- [ ] Single quotes in content are escaped (`''`)
