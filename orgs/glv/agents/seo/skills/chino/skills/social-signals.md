---
name: social-signals
description: Social proof and signal building for SEO — Reddit engagement, LinkedIn article repurposing, local hub strategy. Social signals > backlinks in modern SEO.
---

# Social Signals — SEO Social Proof Builder

> "Social proof and UGC are the most important thing right now for SEO. More than articles, more than content." — Ben Pelta

## Usage

`/chino:social-signals <client> [action]`

Actions:
- `audit` — Assess current social signal landscape (default)
- `reddit` — Reddit engagement strategy
- `linkedin` — LinkedIn article repurposing plan
- `hubs` — Local hub/community site strategy
- `plan` — Full social signal plan across all channels

## Context Detection

Read `projects/<client>/CONTEXT.md` for business details and location.
Read `projects/<client>/research/pillar-g-local-media-community.md` for local community context.
Read `projects/<client>/seo/content-plans/` for existing content to repurpose.
Read `projects/<client>/strategy/marketing-director-plan.md` for messaging framework.

## Why Social Signals Matter for SEO

Google evaluates business reputation through social proof:
- **Mentions** (not links) of your business name count as signals
- **Reddit** is treated as #1 UGC source since 2025 algorithm updates
- **LinkedIn** builds E-E-A-T (expertise, experience) for team members
- **Community engagement** signals that you're a real, active local business
- A business with zero social presence looks suspicious to Google in 2026

## Workflows

### Audit

Assess current social signal state:

1. **Reddit:** Search for business mentions, local subreddit activity, competitor presence
2. **LinkedIn:** Check if business owner / key staff have profiles, posting activity
3. **Facebook:** Business page status, group memberships, community engagement
4. **Local media:** Mentions on local news sites, community blogs, event listings
5. **Review sites:** Google Reviews count/rating, Yelp, industry-specific

Output: `projects/<client>/seo/social-signals/audit-YYYY-MM-DD.md`

### Reddit Strategy

1. **Identify relevant subreddits:**
   - Local city subreddit (e.g., r/SaultSteMarie)
   - Industry subreddits (e.g., r/boating, r/fishing, r/smallengines)
   - Regional subreddits (e.g., r/ontario, r/NorthernOntario)

2. **Assess subreddit ownership:**
   - Are moderators active? (check last mod activity)
   - If inactive: flag as takeover opportunity (request admin via r/redditrequest)
   - If active: plan engagement strategy within rules

3. **Engagement plan (NOT spam):**
   - Answer questions genuinely (mention business naturally when relevant)
   - Share expertise (e.g., "I run a marine shop — here's what I'd check...")
   - Post seasonal tips tied to local context
   - Never hard-sell or drop links unprompted
   - Aim: 2-3 genuine interactions per week

4. **Content cross-posting:**
   - Blog article summaries → relevant subreddit discussions
   - Seasonal guides → local subreddit
   - Always add unique Reddit-native commentary (don't just paste links)

Output: `projects/<client>/seo/social-signals/reddit-strategy.md`

### LinkedIn Strategy

1. **Profile audit:**
   - Business owner has complete LinkedIn profile?
   - Key staff (service managers, experts) have profiles?
   - Company page exists?

2. **Article repurposing pipeline:**
   - For every blog article published:
     1. Summarize key insight (2-3 paragraphs)
     2. Add personal angle ("In our 40 years of experience...")
     3. Post as LinkedIn article or post under team member's profile
     4. Tag relevant industry connections
   - Frequency: 1-2 posts per week per profile

3. **Automation potential:**
   - Article published → auto-generate LinkedIn summary
   - Can be integrated with n8n workflow
   - Post to Slack `#internal-agents` for review before publishing

Output: `projects/<client>/seo/social-signals/linkedin-strategy.md`

### Local Hub Strategy

> "Every city needs at least 2-3 hubs. If they're already in control and building it, we have to give a fight." — Ben

1. **Assess existing local hubs:**
   - Who controls local news? (e.g., SooToday)
   - Are there community blogs, event sites, business directories?
   - Are any inactive / abandonable?

2. **Hub building options (long-term):**
   - Community event calendar site
   - Local business directory (with YOUR business as the operator)
   - Industry-specific resource hub (e.g., "Northern Ontario Boating Guide")
   - Local news/tips blog

3. **Quick wins:**
   - Get featured/mentioned on existing hubs
   - Contribute guest content to local blogs
   - Sponsor local events for online mentions
   - Submit to community calendars

Output: `projects/<client>/seo/social-signals/hub-strategy.md`

## Integration

- **content-plan**: Every content piece should have a LinkedIn repurposing note
- **directory-drip**: Social profiles count as directory signals
- **audit**: Social signal score included in weekly audit
- **copywriting**: Content written with social repurposing in mind

## Anti-Patterns

- Never spam subreddits with promotional content
- Never create fake accounts or personas for engagement
- Never auto-post without human review
- Never ignore subreddit rules — read them first, always
- Never build a local hub without user commitment to maintain it
- Never post on LinkedIn under someone's name without their approval
