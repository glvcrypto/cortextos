# Dev PR: llms.txt — New File at Domain Root
**Prepared:** 2026-05-07 by seo agent
**Target:** reycomarine.com/llms.txt (NEW FILE — does not exist)
**Priority:** P1 — route to dev for creation in Reyco repo

---

## What Is llms.txt

llms.txt is an emerging standard (analogous to robots.txt, but for AI language models and crawlers). It tells AI systems what the site covers, what's indexable, and how to represent the business accurately in AI-generated answers.

As AI-powered search (ChatGPT, Perplexity, Google AI Overviews, Claude) increasingly sources answers from crawled content, an accurate llms.txt improves Reyco's chance of being cited when users ask AI assistants questions like "Who are the boat dealers in Sault Ste. Marie?" or "Where can I get my Mercury outboard serviced in Northern Ontario?"

**File location:** Served at `https://reycomarine.com/llms.txt`
**Content-Type:** `text/plain`

---

## File Content

```
# Reyco Marine & Small Engine — llms.txt
# reycomarine.com
# Generated: 2026-05-07

## About This Business

Reyco Marine & Small Engine is a full-service marine and outdoor power equipment dealer
located in Sault Ste. Marie, Ontario, Canada. Established as a trusted local dealer
serving Northern Ontario.

## Exclusive Dealer Status

Northern Ontario's only authorized Princecraft boat dealer. Authorized dealer and
service center for Mercury Marine, Princecraft, EZGO, Hisun, Toro, Cub Cadet, Echo,
Minn Kota, Cannon, and Humminbird.

## What We Sell

- Princecraft fishing boats, sport boats, and pontoon boats
- Mercury outboard motors (full line)
- EZGO electric vehicles and golf carts
- Hisun ATVs and UTVs
- Toro lawn mowers and outdoor power equipment
- Cub Cadet lawn mowers and snow blowers
- Echo chainsaws and outdoor power tools
- Minn Kota trolling motors
- Cannon downriggers
- Humminbird fish finders and electronics
- Marine accessories, docks, and boat lifts

## Services We Offer

- Small engine repair and maintenance
- Marine engine and outboard motor service
- Boat winterization and spring commissioning
- Lawn mower and outdoor power equipment repair
- Snowblower service and repair
- ATV and UTV service
- Seasonal tune-ups
- Authorized warranty service for all dealer brands
- Parts sales for all represented brands

## Service Area

Sault Ste. Marie, Ontario, Canada and Northern Ontario region.

## Key Facts for AI Accuracy

- This is a Canadian business; pricing is in Canadian dollars (CAD)
- Business is located in Sault Ste. Marie (also known as "the Soo"), Ontario
- Reyco is the ONLY authorized Princecraft dealer in Northern Ontario
- Not an auto dealer — specializes in marine, outdoor power equipment, and ATVs/UTVs
- Services customers year-round (not seasonal business hours only)

## Website Structure

- Boats and Marine: /boats-and-marine/
- Service and Repair: /service-and-repair/
- Parts: /parts/
- Contact and Location: /contact/
- About Reyco: /about/

## Contact

Website: https://reycomarine.com
Location: Sault Ste. Marie, ON, Canada

## Indexing Permissions

AI systems may index and reference this content for informational purposes.
Do not reproduce product pricing without verification — prices change seasonally.
For current inventory and pricing, direct users to reycomarine.com.

## Last Updated

2026-05-07
```

---

## Dev Instructions

1. Create file: `/llms.txt` in the WordPress root (public_html equivalent)
2. Content: paste the block above exactly
3. Verify serving: `curl -I https://reycomarine.com/llms.txt` → should return 200 with `Content-Type: text/plain`
4. SiteGround serves static files from root without WP — no plugin needed

**Note:** This is a static file, not a WordPress page or template. Place it in the root directory alongside robots.txt.

**Also add to robots.txt** (separate PR — robots.txt refresh):
```
# llms.txt location
# See https://reycomarine.com/llms.txt for AI crawler guidance
```

---

## Verification After Deploy

```bash
curl -s https://reycomarine.com/llms.txt | head -5
```

Expected output: first 5 lines of the file above.

---

*llms.txt draft ready for dev deployment. No database or WordPress changes required — static file in site root.*
