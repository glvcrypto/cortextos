# Chino SEO Framework — 6-Level Nested URL Framework

> Distilled from 7-episode SEO training course. This is the knowledge base for all /chino skills.

---

## Framework Overview

SEO breaks down to **3 core components**:

1. **Links** — Each URL (especially money pages) is a link associated with keyword rankings. Link building externally and internally drives authority.
2. **Keyword Rankings** — Every money page targets keyword rankings. The goal is to get pages ranking for their target terms.
3. **Bloat Management** — Over time, websites accumulate bloat: index bloat, content bloat, URL bloat, crawl bloat, and code bloat (unused plugins, outdated themes, expired content). Bloat drags the site down and must be pruned.

The **6-level nested URL framework** approaches SEO from outside-in, like a bullseye. You start at the outermost level (external presence) and work inward to on-page optimisation. When auditing, identify which level an issue belongs to — sometimes you are trying to fix something at Level 6 when the root cause is at Level 2.

---

## Level 1: External (Online Presence & Link Building)

**Principle:** A website cannot exist on its own. It needs to be grounded in an ecosystem — primarily the Google ecosystem.

### Google Ecosystem Presence

Be present across every relevant Google property:

- **Google Business Profile (GBP)** — Required for any local business
- **Google Shopping** — If selling legitimate products (not grey-area)
- **Google Podcasts** — If producing podcast content
- **Google Play** — If you are a SaaS with extensions or plugins
- **Google Books** — If you are an author
- **Google SERPs** — Your pages must appear in search results

**Action:** From each Google property, link back to your main website. You are participating in the Google Network.

### Foundational Link Building

Build external authority through:

- **Social media profiles** — Choose platforms where your audience lives (e.g., Discord over Reddit for younger audiences, Facebook for older demographics)
- **Citations from reputable directories** — General directories plus local directories for your town/city
- **Reference sites** relevant to your niche
- **Press releases** on reputable digital PR / news sites
- **Review sites** (Google Reviews, niche-specific review platforms)

All of these point back to your site and build your **online presence** and **external authority**. You are not optimising anything on your site at this level — you are building the external authority for your site.

### Knowledge Panel

If you build enough presence (magazine features, news coverage, social profiles, Wikipedia references), Google rewards you with a **knowledge panel** — essentially an online business card.

- **For businesses:** Logo, site links, social media, Wikipedia reference, related items
- **For people:** Wikipedia link, biographical details, social profiles, books, affiliations

Knowledge panels are difficult to trigger for grey-area niches. Google will not readily grant a knowledge panel if the business is in a grey area.

### Brand SEO

- Unified messaging, voice, and branding colours across all platforms
- Consistent visual branding in video thumbnails, social media graphics
- Platform selection aligned to target audience
- Unified brand identity that Google can recognise as a single entity

---

## Level 2: Domain (Website Foundation)

**Principle:** This is where you decide what you are building, where it lives, and how it is powered.

### Niche Research via Google Trends

Before creating a new site or picking a niche, use **Google Trends** to understand trajectory:

- Set timeframe to 5 years to see long-term direction
- Filter by country (e.g., Canada)
- Compare niches head-to-head (e.g., CBD vs. peptides vs. magic mushroom)
- Compare products within a niche (e.g., golden teacher vs. albino penis envy)

**Key insight:** Invest in niches that are on an uptrend. Avoid niches in long-term decline. Google Trends also helps decide which products to prioritise.

### YMYL Considerations

Google treats different site types differently. **YMYL (Your Money or Your Life)** sites face more restrictions:

- Health supplement sites, financial sites, and medical sites have stricter scrutiny
- Legal restrictions by jurisdiction (e.g., in some U.S. states, you cannot claim CBD can "cure" conditions)
- Google holds YMYL sites to higher E-E-A-T standards

### Site Type Selection

Each type has a different setup and Google treats them differently:

| Site Type | Characteristics |
|-----------|----------------|
| Local business | Needs GBP, local citations, service area focus |
| E-commerce | Product catalogue on homepage, shopping integration |
| Service / Lead Gen | Forms, CTAs, service pages |
| SaaS | Subdomain for forums/support, extension/plugin listings |
| Affiliate | Affiliate plugins, comparison content |
| News / Forum | Fresh content cadence, community features |
| Educational / Travel | Generally fewer restrictions |

### Domain Purchasing

**Aged domains:**
- Already have rankings and are registered in Google
- Can potentially skip the sandbox period
- **Critical check:** Verify the domain has not been penalised by Google. A penalised domain will carry its penalty to your new site regardless of optimisation.

**New domains:**
- Clean slate, no penalty risk
- Subject to **sandbox period**: typically **3+ months** before Google will start awarding rankings, even with a fully optimised site

### Hosting Selection

**Server location:**
- Choose a server in the geographic area you operate in (e.g., Toronto for a Canadian business)
- Server IP reflects geography — helps with page speed and potentially rankings
- Closer server = faster load times for local users

**Key hosting features to evaluate:**
- **SSL certificate** support
- **Backup** availability (cheaper hosts may not provide backups)
- **Server capacity** — can it handle traffic spikes?
- **Security / DDoS protection** — ability to blacklist IPs, set request rate limits (e.g., limit to 200 requests per minute per IP)
- **Bot attack monitoring** — hosting dashboards that show bot traffic, peak hours, capacity usage
- **Plugin monitoring** — alerts if a plugin is compromised

**Hosting migration lesson:** Some hosts (SiteGround, Cloudways) crack down on grey-area niches. Have a fallback host identified. Payment failures on hosting can take a site offline — monitor billing.

### Subdomains

Subdomains are primarily used by SaaS companies:
- Main site: `www.example.com`
- Forum/support: `support.example.com`
- Guides: `guide.example.com`

Subdomains can be set as crawlable or not crawlable independently.

### HTTPS Setup

Ensure HTTP-to-HTTPS redirects are properly configured. Fix any mixed-content or redirect chain issues at the domain level.

### Log File Analysis

**Tool:** Screaming Frog Log File Analyser

**Purpose:**
- Analyse **crawl budget** — which pages Google is actually crawling
- Detect **bot attacks** — malicious IPs making thousands of requests
- Track **Googlebot behaviour** — what pages it visits, errors it encounters
- Track **AI bot crawling** — ChatGPT bot, Claude bot, Perplexity bot visits

**Example finding:** A single malicious IP made 31,000+ requests causing 8,000+ errors (404s), attacking backend URLs (e.g., `/wp-json`). This slowed the entire site. Solution: block the IP range and set up automated pattern-matching to block similar attacks.

**Key insight:** If caching plugins and speed optimisations are not working, check log files — you may be under attack.

### Security & DDoS Protection

- Use hosting-level IP blacklisting
- Set up automated rules to detect and block attack patterns
- Monitor log files for unusual request volumes from single IPs
- Backend URLs (not front-end pages) are common attack targets

### Site Launch Checklist

Before launching any new site, fulfil a comprehensive checklist:
- Contact information (phone, address, map link)
- Social account setup
- Analytics integration: GA4, GSC, GTM
- Template/theme configuration
- Plugin setup
- Compliance pages (privacy policy, disclaimer, terms)
- E-commerce setup (WooCommerce, payment gateway) if applicable

---

## Level 3: Navigation URLs (Site Architecture)

**Principle:** How bots and humans navigate your site determines what gets crawled, indexed, and ranked.

### Information Architecture

The site structure must cater to **two audiences**:

1. **Bots (Googlebot, AI bots):** Start at homepage, follow links to discover pages, go deeper through internal links. If a page cannot be reached through navigation links, it will not be crawled.
2. **Humans (UX):** Navigate via menus, categories, search, and internal links.

**Critical rule:** Even the best article is worthless if Google cannot reach it through the navigation.

### Click Depth

- **Best practice:** Important pages should be reachable in **1-2 clicks** from the homepage
- Pages requiring **4+ clicks** are unlikely to be crawled by Google and unlikely to be found by users
- Place the most important pages (money pages, key service pages) in the main navigation

### Subfolder Planning

- Plan subfolder structure before building (e.g., `/shop/`, `/blog/`, `/education/`)
- Use clean, logical URL hierarchies
- Consider future expansion when designing the structure

### Hreflang (Multi-language)

For bilingual markets (e.g., Canada with English and French):
- Use subfolder approach: `/en/page-url` and `/fr/page-url`
- Plan hreflang implementation ahead of build
- Serve the correct language version to the correct audience

### Themes & Plugins

- **Themes:** Choose based on site type — blog themes differ from e-commerce themes. Themes can degrade over time (e.g., Flavor theme became bloated and caused errors, requiring replacement).
- **Plugins:** Match to functionality needs:
  - Email marketing: Omnisend, Klaviyo, Mailchimp
  - Affiliate marketing: dedicated affiliate plugins
  - Caching/speed: appropriate caching plugin
  - SEO: Yoast, RankMath, etc.
- **Maintenance:** Plugins that were good previously can become unmaintained. Monitor and replace as needed.
- **Plugin updates:** Back up before updating. Update weekly or monthly. Consult with developer before major plugin updates.

### Competitor Template Research

Before building, research competitors thoroughly:

1. **Identify 3-5 key competitors** using Ahrefs/Semrush
2. **Analyse their page templates** — for each page type (product, blog, category, dosage guide, etc.):
   - Do they have authors listed?
   - Reference/citation sections?
   - Tables, infographics, videos?
   - FAQ sections?
   - Table of contents?
   - Disclaimers?
   - Key takeaway sections?
   - Lead magnets?
   - Calculators?
3. **Screenshot elements you like** — build a database of design patterns and content elements
4. **Identify gaps** — what competitors are missing that you can add
5. **Monitor competitors ongoing** — maintain a surveillance document of competitor elements, updated regularly

### Sitemaps

Create and submit multiple sitemaps to GSC:
- **Post sitemap** (blog posts)
- **Page sitemap** (static pages)
- **Product sitemap** (e-commerce products)
- **Image sitemap** (if applicable)
- **News sitemap** (if applicable)

### Robots.txt

Define what should and should not be crawled:
- Block faceted navigation URLs
- Block URL parameters (e.g., `?add_to_cart`, filter parameters)
- Block admin/backend URLs
- Allow all important content URLs

### Web Speed Optimisation

Check for and resolve:
- **Code bloat** — unused CSS/JS from old plugins or themes
- **Image bloat** — unoptimised, oversized images
- **Theme bloat** — overloaded themes (e.g., Flavor theme was very overloaded)
- **Plugin bloat** — too many active plugins, especially unused ones

### E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trustworthiness)

Set up the site to project authority:

**Expertise & Authoritativeness:**
- Create author pages with credentials
- If the owner is a professional (e.g., doctor), reference certificates and credentials
- Link to professional directories that verify credentials
- Include work history and professional background

**Trustworthiness:**
- Privacy policy
- Terms and conditions
- Disclaimer (especially important for YMYL)
- Compliance documentation
- About us page (must be easily accessible — Google reads it to understand what the site is about)

### Tech Stack Cataloguing

Maintain a living document of the site's technical setup:
- Current hosting provider and server location
- IP address
- CMS (WordPress, Shopify, etc.)
- Theme name and version
- All active plugins with versions
- Tracking tools (GA4, GSC, GTM, etc.)
- CDN provider
- SSL status

**Purpose:**
- Track changes over time (before/after migration snapshots)
- Hand-over document for future SEOs
- Feed to AI (ChatGPT/Perplexity) for recommendations: "Based on this tech stack, what plugins should I add for [goal]?"
- Identify when someone changed something without notifying the team

### Keyword Mapping

For existing sites (new client onboarding):

1. List all important pages (homepage, service pages, product pages, category pages)
2. For each page, identify:
   - **Primary keyword** (the main target)
   - **Secondary keywords** (supporting terms)
   - **Non-relevant keywords** (listed but noted as not targeted)
3. Check for **cannibalization** — are multiple pages targeting the same keyword?
4. Get client confirmation: "This is the primary keyword for this page — agreed?"
5. Modify pages to align with agreed keyword targets

---

## Level 4: Crawlable vs Not-Crawlable URLs

**Principle:** Not every URL should be crawled by Googlebot or AI bots. Intentionally control what is and is not crawlable.

### What Should NOT Be Crawled

| Type | Reason | Solution |
|------|--------|----------|
| **Paywall content** | Subscriber-only content should not be freely available to bots | Block in robots.txt or use noindex |
| **Faceted navigation** | Filter parameters create duplicate URLs (e.g., `?colour=blue&size=large`) | Block URL parameters in robots.txt |
| **URL parameters** | Add-to-cart, sort, filter parameters are not real pages | Block in robots.txt |
| **Admin/backend URLs** | Not intended for public access | Block in robots.txt |
| **SaaS support subdomains** | Some companies restrict crawling of support docs | Subdomain-level robots.txt |

### 404s vs Soft 404s

**Hard 404:**
- Page does not exist (correct behaviour for truly non-existent URLs)
- Becomes a problem when a page that should exist returns 404

**Soft 404:**
- An active page that Google does not reward or crawl anymore
- **Causes:** Duplicate content, thin content, or out-of-stock products
- **Tactic for out-of-stock products:** Instead of marking as out-of-stock (which triggers soft 404), remove the pricing but keep the page live so Google continues to index it

### Robots.txt Directives

Use `robots.txt` to define crawl rules:
- Block URL parameters: `Disallow: /*?add_to_cart*`
- Block faceted navigation paths
- Block admin areas
- Allow all important content directories

### Noindex Settings

- Tags are typically noindexed on most sites
- Product pages are typically indexed (unlike tags)
- Set noindex via meta robots tag or plugin settings for pages that should not appear in search

### Canonical URLs

When product variations create multiple URLs (e.g., blue scarf, red scarf, brown scarf):
- Set the **main product** as the canonical URL
- Variations point their canonical tag to the main product
- Prevents Google from flagging duplicate content

### Desktop/Mobile Crawl Gap

- Check that all vital elements visible on desktop also appear on mobile
- Common issue: table of contents, sidebar links, or navigation elements removed on mobile view
- If desktop rankings are strong but mobile rankings are weak, investigate missing links/elements on mobile
- **Symptom:** Desktop ranks well, mobile does not — indicates a gap in mobile content or internal linking

---

## Level 5: Indexed URLs

**Principle:** A page that is not indexed cannot rank and cannot be found by Google or AI. Ensure the right pages are indexed.

### Checking Indexation via GSC Pages Tab

In Google Search Console, go to **Pages** and check:

1. **By sitemap:** Check each sitemap (products, pages, posts) individually
   - Example: 45 product pages total, only 38 indexed = 19 not indexed = problem
2. **By status bucket:** Review each status category for errors
3. **Blocked by robots.txt** — verify these should actually be blocked
4. **Individual error categories** — check each one and log issues

### Sitemap Status Monitoring

For each sitemap submitted to GSC:
- How many URLs are in the sitemap?
- How many are indexed?
- What percentage is indexed vs. not indexed?

**Target:** Aim for high indexation rates. If **76%+** of product pages are indexed, you are in reasonable shape but should optimise the remainder.

### Content Plan Development

Create a structured content plan spreadsheet:

| Field | Description |
|-------|-------------|
| **Content code** | Unique identifier (e.g., T0001, T0049) |
| **Tags** | Content tags/topics |
| **Category / Sub-category** | Where it fits in the site structure |
| **Target keywords** | Primary and secondary keywords |
| **Description** | Brief content description |
| **Status** | Draft, In Progress, Published, Needs Refresh |
| **Writer** | Assigned writer |
| **Link** | URL once published |

### Keyword Research Using Semrush

**Process for product page keywords:**
1. Enter the product name + synonyms + chemical name + colloquial name
2. Filter by intent (transactional for product pages: "buy", "order", "purchase")
3. Identify keywords with commercial intent

**Process for blog post keywords (using modifiers):**
1. Start with base keyword (e.g., "BPC 157")
2. Add modifiers: "for sale", "for men", "for women", "for arthritis", "for back pain", "for injury", "for beginners"
3. The longer the modifier chain, the more **long-tail** the keyword becomes
4. Long-tail keywords are less competitive and more specific

**Modifier categories:**
- Audience: for men, for women, for older people
- Condition: for arthritis, for back pain, for injury, for gut health, for nerve damage
- Action: how to inject, how to reconstitute, dosage guide
- Comparison: vs. [competitor compound]

### Siloing Strategy

**Siloing** = structuring the website so main pages are supported by related sub-content, all linked together.

**Structure:**
- **Hub page** (e.g., "BPC 157 for Injury" — a comprehensive, skyscraper-style guide)
  - Supporting articles: BPC for cartilage repair, BPC for ligament healing, BPC for tendon repair, BPC for surgery recovery, BPC for gut health, BPC for shoulder pain, BPC for nerve damage
  - **Target page:** All supporting articles link to the product page for BPC 157

**Purpose:** Page rank and authority flow from supporting content up to the money page, boosting its rankings.

### Internal Linking Framework

**Previous/Next Chain Method:**
1. Arrange all articles in a silo into a linear sequence
2. Each article links to the **previous** article and the **next** article in the chain
3. The first article in the chain has no "previous" — it only links to the next
4. Each article also links to the **target/money page**

**Example chain:**
```
BPC for Injury → BPC for Cartilage Repair → BPC for Ligament Healing → BPC for Tendon Repair → BPC for Surgery Recovery → BPC for Gut Health → BPC for Shoulder Pain → BPC for Nerve Damage
```

Each article links to:
- Previous article in the chain
- Next article in the chain
- The product page (target/money page)

**Anchor text:** Use the **primary keyword** of the target page as anchor text, or a keyword variation. Example: linking to "BPC for Cartilage Repair" uses that phrase (or a close variation) as the anchor text.

**Implementation:** Add a "You might be interested in" section to each post linking to adjacent articles in the silo.

### Cannibalization Checks

Before publishing content, run a cannibalization analysis:

1. **Create a keyword matrix** — plot all planned keywords against each other
2. **Identify overlaps:** If "NAD for aging", "NAD for healthy aging", and "NAD for age-related decline" all show high similarity (green in the matrix), they will compete for the same rankings
3. **Decision:** Only publish one article for cannibalizing keyword groups, or merge them into a single comprehensive article
4. **Safe keywords:** If a keyword shows no overlap with others (no green in the matrix), it is safe to publish as a standalone article

### Content Bloat Detection

Content bloat occurs when too many pages lose their index status:

**Index Status Progression (degradation path):**
```
Indexed → Crawled, Currently Not Indexed → Discovered, Currently Not Indexed → Limbo (date shows 1970-01-01)
```

- **Crawled, not indexed:** Google visited but decided not to index. You have approximately **130 days** before it drops to "discovered."
- **Discovered, not indexed:** Google knows the URL exists but has not crawled/indexed it. Next step is limbo.
- **Limbo (1970-01-01 date):** The page is effectively dead. Either re-optimise or prune.

### 76% Threshold

If **76%+** of pages in a sitemap are indexed, the site is in reasonable health. Focus on optimising the remaining pages.

### Content Refresh / Pruning Decisions

| Situation | Action |
|-----------|--------|
| Crawled, not indexed for < 3 months | Monitor, minor optimisation |
| Crawled, not indexed for 3+ months | Flag for content refresh |
| Discovered, not indexed for 3+ months | Flag for pruning or major rewrite |
| Date shows 1970-01-01 | Re-optimise if not yet attempted; otherwise prune |
| Combined not-indexed > 30-40% of total | **Content bloat alert** — urgent action needed |

**Content refresh options:**
- Update and expand the content
- Merge thin/duplicate articles into one comprehensive piece
- Improve internal linking to the page
- Request re-indexing via GSC

**Pruning options:**
- 301 redirect to a relevant live page
- Remove and let it 404 (if no redirect target exists)
- Noindex if you want to keep the page for users but remove from index

---

## Level 6: On-Page Optimisation

**Principle:** This is the innermost level — optimising individual money pages, vital pages, and important blog posts for maximum rankings and conversions.

### Money Pages

Money pages are your vital pages — the pages that directly generate revenue or conversions. They are composed of one URL associated with target keyword rankings.

### Group A-D On-Page Framework

#### Group A — Centerpiece (Primary Keyword Focus)

The most important on-page elements. These must feature the **primary keyword** prominently:

| Element | Requirement |
|---------|-------------|
| **Title tag** | Primary keyword included, ideally near the beginning |
| **H1 heading** | Primary keyword included, one H1 per page |
| **URL slug** | Primary keyword reflected in the URL |
| **Opening paragraph** | Primary keyword used naturally in the first paragraph |

**These are the "centerpiece annotation" — they collectively signal to Google what this page is about.**

#### Group B — Secondary Signals

| Element | Requirement |
|---------|-------------|
| **H2 headings** | Use secondary keywords and keyword variations |
| **Anchor text** | Internal links pointing to/from this page use keyword-rich anchor text |

#### Group C — Supporting Signals

| Element | Requirement |
|---------|-------------|
| **Image alt text** | Use the keyword or its variations in alt attributes |
| **Bold / Italic text** | Bold or italicise keyword variations within the body content |

#### Group D — Hidden Markup

| Element | Requirement |
|---------|-------------|
| **Schema markup (JSON-LD)** | Add structured data relevant to the page type (Product, FAQ, HowTo, Article, LocalBusiness, etc.) |
| **Semantic HTML** | Use proper HTML5 semantic elements (`<article>`, `<section>`, `<nav>`, `<aside>`, etc.) so bots can parse the page structure |

**Schema can be added as an additional section in the on-page optimisation document for each page.**

### Per-Page Tracking Metrics

For each money page, track:
- Number of keywords ranking
- Keyword positions / rankings
- Bounce rate
- Page views
- Conversions (lead form submissions, purchases, sign-ups)
- Conversion rate optimisation (CRO) metrics

### Competitor Gap Analysis Per Page

For each money page:
- What keywords are competitors ranking for that you are not?
- What CTAs and messaging are competitors using?
- What content elements do competitor pages have that yours lack?

### SERP Feature Tracking

Monitor whether your pages appear in special SERP features:

| SERP Feature | Relevance |
|--------------|-----------|
| **Map Pack** | Local service pages — is your business showing in the 3-pack? |
| **People Also Ask (PAA)** | Are your pages answering PAA questions? Can you optimise for them? |
| **Video results** | Are your videos showing in the SERP? |
| **Featured snippets** | Are you capturing position zero? |
| **Social media results** | Are your social profiles appearing for brand searches? |

### Internal Linking To/From Page

For each money page, document:
- Which pages link TO this page (and their anchor text)
- Which pages this page links OUT to
- Whether the linking pages are indexed (if linking pages are "crawled, not indexed" the link value is diminished)
- Notes on linking strategy and planned improvements

### Conversion Optimisation

At this level, optimise for business outcomes:
- Lead capture forms
- CTAs (calls to action) placement and messaging
- Landing page design
- A/B testing elements
- Checkout flow testing (for e-commerce)

### AI Visibility (AIO / GEO)

Regardless of the acronym (AIO, GEO, LLM SEO), it breaks down to **two metrics to monitor:**

#### 1. AI Visibility (Bot Crawling)

**What it is:** How often AI bots (ChatGPT bot, Claude bot, Perplexity bot) are crawling your pages.

**How to measure:** Use **log file analysis** (Screaming Frog Log File Analyser):
- Filter by bot user agent (e.g., ChatGPT)
- Check which pages are being crawled and how frequently
- Example finding: ChatGPT crawled "RAD 140 blog post" 14 times, "Mr. Olympia article" 13 times, "YK-11 Dosage" 18 times
- Check for errors: Out of 600 AI bot events, 400+ may be errors (404s) indicating crawlable/uncrawlable issues that need fixing

#### 2. AI Referral (Traffic from AI Platforms)

**What it is:** Traffic sent to your site from AI platforms (ChatGPT, Perplexity, SearchWave, etc.).

**How to measure:** In **GA4**:
- Go to **Traffic Acquisition > Source / Medium**
- Look for AI platform sources: `chatgpt.com`, `perplexity.ai`, `searchwave`, etc.
- Track number of sessions from each AI source
- Drill deeper to identify which specific pages AI platforms are sending traffic to

**Optimisation loop:**
1. Identify pages that AI platforms are already linking to (via GA4 source/medium)
2. Identify pages that AI bots are already crawling (via log files)
3. Modify content on those pages to be more "AI-recommendable" — clear, factual, well-structured
4. A/B test content changes and monitor whether AI referral traffic increases

---

## Routine Audit SOP

**Principle:** Regular audits catch issues before they compound. Use the 6-level framework to diagnose where problems originate.

### Tools Required

- **Semrush or Ahrefs** — automated weekly crawl/audit (set to run every Wednesday or chosen day)
- **Google Search Console** — Pages tab, sitemaps, index coverage, validation requests
- **GA4** — traffic trends, AI referral tracking (source/medium)
- **Screaming Frog Log File Analyser** — crawl budget analysis, bot attack detection, AI bot monitoring
- **Hosting dashboard** (Cloudways, SiteGround, Alexhost, etc.) — capacity monitoring, bot blocking, plugin alerts

### Weekly Audit Checklist

1. **Run or review Semrush/Ahrefs site audit**
   - Check the latest automated crawl (set to auto-crawl weekly)
   - Can also trigger a manual crawl if needed
   - Review the audit history to track improvement over time

2. **Review GSC Pages tab**
   - Check each status bucket (indexed, crawled not indexed, discovered not indexed, blocked by robots.txt, etc.)
   - Verify blocked pages should actually be blocked

3. **Review GSC sitemaps**
   - Check each sitemap: products, pages, posts
   - Are all expected URLs indexed? Calculate indexed percentage.

4. **Check for new 404s, soft 404s, and server errors (500s)**
   - In Ahrefs/Semrush audit: filter for 4xx and 5xx errors
   - In GSC: check error reports
   - **Red errors = priority.** Fix first.
   - **Yellow warnings = secondary.** Fix after reds.
   - **Blue/informational = low priority.** Fix if time allows; some are not necessary to fix.

5. **Log all issues in issue tracker (FIX-NNNN format)**
   - Sequential numbering (FIX-0001, FIX-0002, ...)
   - Record: date found, level (L1-L6), category, description, status, date fixed
   - Historical record enables looking back to understand what was changed and when

6. **Visual spot-check**
   - Homepage
   - Key landing/money pages
   - Product page template
   - Shop/category pages
   - Checkout process (manually attempt a purchase)
   - Look for: missing elements, broken carousels, removed plugins, changed layouts
   - Rotate: check one page type per day

7. **Check hosting dashboard**
   - Bot attack alerts
   - Capacity / load monitoring (peak hours graph)
   - Plugin compromise alerts
   - Billing status (payment failures can take a site offline)

8. **Review Ahrefs/Semrush explanations**
   - Each error in Ahrefs comes with documentation on how to fix it
   - Cross-reference errors with the 6-level framework: "Is this a Level 2 hosting issue or a Level 4 crawlability issue?"
   - Example: Orphan pages in Ahrefs may be caused by 500 errors at the hosting level (Level 2), not an actual orphan page problem (Level 3)

### Issue Tracker Format

| Fix ID | Date Found | Level | Category | Description | Status | Date Fixed |
|--------|-----------|-------|----------|-------------|--------|-----------|
| FIX-0001 | YYYY-MM-DD | L2 | 500 Error | Server returning 500 on /wp-json endpoint | done | YYYY-MM-DD |
| FIX-0002 | YYYY-MM-DD | L4 | 404 | Broken product page /product/xyz | done | YYYY-MM-DD |
| FIX-0003 | YYYY-MM-DD | L5 | Index | 19 product pages not indexed in GSC | pending | — |

**Numbering continues sequentially.** If tabs in the spreadsheet become overcrowded, create a new sheet and continue the sequence.

**Purpose of historical tracking:** If a past fix turns out to have been incorrect, you can go back to the tracker, find the date and details, and reverse or modify the fix.

### Content Health Check (Monthly)

- Calculate **% of pages indexed** vs. total for each sitemap
- Pages in **"crawled, not indexed"** for **3+ months** → flag for content refresh or refurbishing
- Pages in **"discovered, not indexed"** for **3+ months** → flag for pruning or major rewrite
- Pages showing **1970-01-01 date** → effectively in limbo; re-optimise if not yet attempted, otherwise prune
- If combined not-indexed exceeds **30-40% of total** → **content bloat alert**, urgent action needed
- Track **76% indexation threshold** per sitemap as a health benchmark

### GSC Annotations

Leave annotations in Google Search Console for major events:
- Site migrations
- Google algorithm updates
- Theme or plugin changes
- Hosting changes
- Major content updates or pruning

**Purpose:** Compare site performance before and after the event to assess impact.

### Plugin Update Cadence

- **Frequency:** Once a week or once a month
- **Always back up** before updating plugins
- **Consult with developer** before major plugin updates
- If a plugin update breaks functionality (e.g., carousel stops working), the issue may not show in Ahrefs/GSC but will be visible in visual checks

### Tech Stack Catalogue Updates

Update the tech stack document:
- Before and after any migration
- When themes or plugins are changed
- When hosting is changed
- When multiple departments are managing the site (to track who changed what)
- Feed updated tech stack to AI for recommendations

### Cross-Level Diagnosis

When an error appears, use the 6-level framework to find the root cause:

| Symptom | Likely Level | Investigation |
|---------|-------------|--------------|
| 500 errors | L2 (Domain/Hosting) | Check hosting dashboard, server logs |
| Orphan pages in Ahrefs | Could be L2 (500s preventing crawl) or L3 (navigation) | Check if 500 errors are blocking the crawl path |
| Pages not indexed | L4 (robots.txt blocking) or L5 (content quality) | Check robots.txt, then content quality |
| Rankings dropping | L5 (content bloat) or L6 (on-page) or L1 (lost backlinks) | Check index status, then on-page, then backlink profile |
| Slow page speed | L2 (hosting) or L3 (code bloat, theme bloat) | Check hosting capacity, then theme/plugin bloat |
