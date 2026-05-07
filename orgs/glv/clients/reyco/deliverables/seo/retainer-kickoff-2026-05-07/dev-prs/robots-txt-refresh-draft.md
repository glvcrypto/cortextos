# Dev PR: robots.txt Refresh — AI Bot Stanzas
**Prepared:** 2026-05-07 by seo agent
**Target:** reycomarine.com/robots.txt (UPDATE existing file)
**Priority:** P1 — route to dev for update in Reyco repo

---

## Current robots.txt (approximate — WordPress default)

```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://reycomarine.com/sitemap_index.xml
```

---

## Updated robots.txt (Full Replacement)

Replace the entire robots.txt with this content:

```
# robots.txt — Reyco Marine & Small Engine
# reycomarine.com
# Last updated: 2026-05-07

# ============================
# Standard crawlers
# ============================

User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-login.php
Disallow: /wp-register.php
Disallow: /?s=
Disallow: /search/
Disallow: /cart/
Disallow: /checkout/
Disallow: /my-account/
Disallow: /order-tracking/

# ============================
# AI training crawlers — Disallowed
# These bots scrape content for AI model training.
# Allowing them to index content does not improve
# AI answer visibility; use llms.txt for that.
# ============================

# OpenAI GPTBot (training crawler)
User-agent: GPTBot
Disallow: /

# OpenAI ChatGPT-User (real-time browsing — allowed)
User-agent: ChatGPT-User
Allow: /

# Anthropic Claude training crawler
User-agent: anthropic-ai
Disallow: /

# Anthropic Claude browsing bot (real-time — allowed)
User-agent: Claude-Web
Allow: /

# Google Gemini / Bard training crawler
User-agent: Google-Extended
Disallow: /

# Common Crawl (used to train many AI models)
User-agent: CCBot
Disallow: /

# Amazon Alexa web crawler
User-agent: Amazonbot
Disallow: /

# Perplexity AI crawler
User-agent: PerplexityBot
Allow: /

# ByteDance/TikTok crawler
User-agent: Bytespider
Disallow: /

# Meta/Facebook external crawler
User-agent: FacebookBot
Disallow: /

# Apple's AI training crawler
User-agent: Applebot-Extended
Disallow: /

# Cohere AI crawler
User-agent: cohere-ai
Disallow: /

# ============================
# SEO and indexing bots — Allowed
# ============================

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: SemrushBot
Allow: /

User-agent: AhrefsBot
Allow: /

User-agent: MJ12bot
Allow: /

# ============================
# Sitemaps
# ============================

Sitemap: https://reycomarine.com/sitemap_index.xml

# ============================
# AI guidance
# See /llms.txt for how AI systems should represent this business.
# ============================
```

---

## Notes on AI Bot Policy Decisions

**Why disallow training crawlers but allow browsing bots:**

- **GPTBot** (training) vs **ChatGPT-User** (browsing): ChatGPT-User is the bot that fetches pages when users ask ChatGPT to browse the web. Allowing this bot means Reyco's pages can be cited in real-time ChatGPT answers. GPTBot is for model training only — no direct visibility benefit.

- **anthropic-ai** (training) vs **Claude-Web** (browsing): Same distinction. Claude-Web enables Claude AI to cite Reyco content; anthropic-ai is training-only.

- **PerplexityBot** (allowed): Perplexity is an AI search engine that cites sources directly — allowing it increases the chance Reyco appears in Perplexity answers, which are gaining market share.

- **Google-Extended** (disallowed): Used by Google for Gemini model training, not for Google Search rankings. Disallowing it has zero effect on Google Search rankings.

**Rule of thumb:** Allow bots that cite sources in real-time answers; disallow bots that only train models.

---

## Dev Instructions

1. Access WordPress root directory via SiteGround SSH:
   ```bash
   ssh giowm1155.siteground.biz -p 18765 -i ~/.ssh/sg-reyco
   ```
2. Locate current robots.txt:
   ```bash
   cat ~/www/reycomarine.com/public_html/robots.txt
   ```
3. Replace with the updated content above:
   ```bash
   # Via WP-CLI or direct file edit
   nano ~/www/reycomarine.com/public_html/robots.txt
   ```
4. Verify serving:
   ```bash
   curl -s https://reycomarine.com/robots.txt | head -20
   ```

**Alternative (via WordPress):** Some WordPress setups manage robots.txt via Rank Math. If Rank Math is generating robots.txt:
- Rank Math → General Settings → Edit robots.txt
- Paste the content above
- Save

**Verify which is active:** If `curl https://reycomarine.com/robots.txt` shows Rank Math's version (starts with a Rank Math comment), use the Rank Math editor. If it's a static file, edit directly.

---

## Verification After Deploy

```bash
curl -s https://reycomarine.com/robots.txt | grep -E "GPTBot|anthropic-ai|CCBot|PerplexityBot|Sitemap"
```

Expected output:
```
User-agent: GPTBot
User-agent: anthropic-ai
User-agent: CCBot
User-agent: PerplexityBot
Sitemap: https://reycomarine.com/sitemap_index.xml
```

---

## Related File

`llms.txt` is a companion file that provides positive guidance to AI crawlers. See:
`/dev-prs/llms-txt-draft.md`

Both files should be deployed in the same PR if possible.

---

*robots.txt refresh ready for dev deployment. Replaces WordPress default with full AI bot stanza set.*
