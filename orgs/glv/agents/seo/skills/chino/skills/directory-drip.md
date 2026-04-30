---
name: directory-drip
description: Automated 1-2 directory submissions per day for local SEO signal building. Drip, don't bulk. Mimics natural business owner behaviour.
---

# Directory Drip — Daily Citation Builder

> "A businessman is not going to sit for 5 hours on a Monday and sign up to 20 directories. He'll do one a day." — Ben Pelta

## Usage

`/chino:directory-drip <client> [action]`

Actions:
- `status` — Show progress (default)
- `next` — Submit next directory in queue
- `init` — Initialize directory queue from master list
- `add <url>` — Add a directory to the queue

## Context Detection

Read `projects/<client>/CONTEXT.md` for:
- Business name, address, phone (NAP)
- Website URL
- Business description
- Categories/services
- Hours of operation

Read `projects/<client>/seo/nap.md` for verified NAP (if exists).

Read `projects/<client>/seo/directory-queue.json` for submission state.

## Workflow

### Init (first run)

1. Check for existing directory master list at `projects/<client>/seo/directories/master-list.md`
2. If none exists, build one from:
   - Canadian general business directories (Yelp, Yellow Pages, Canpages, 411.ca, Hotfrog, etc.)
   - Industry-specific directories (from onboard research `pillar-d-market-landscape.md`)
   - Local/regional directories (from onboard research `pillar-g-local-media-community.md`)
   - Chamber of Commerce, tourism boards, BIA listings
3. Create `projects/<client>/seo/directory-queue.json`:

```json
{
  "client": "<client-slug>",
  "nap": {
    "name": "Business Name Ltd.",
    "address": "123 Queen St E, Sault Ste. Marie, ON P6A 1Y7",
    "phone": "(705) 555-1234",
    "website": "https://example.com"
  },
  "queue": [
    {
      "directory": "Google Business Profile",
      "url": "https://business.google.com",
      "tier": "critical",
      "status": "pending",
      "submitted_date": null,
      "notes": ""
    }
  ],
  "completed": [],
  "daily_limit": 2,
  "last_submission_date": null
}
```

4. Prioritize queue:
   - **Tier 1 (Critical):** Google Business Profile, Yelp, Yellow Pages, Facebook Business
   - **Tier 2 (Important):** Industry-specific directories, Chamber of Commerce
   - **Tier 3 (Good to Have):** General directories, local listings
   - **Tier 4 (Long Tail):** Niche directories, blog directories

### Next (daily run)

1. Load `directory-queue.json`
2. Check `last_submission_date` — if today, warn about daily limit
3. Pick next pending directory from queue (highest tier first)
4. Output submission instructions:
   - Directory name and URL
   - Exact NAP to use (copy-paste ready)
   - Business description (short and long versions)
   - Categories to select
   - Any special fields (hours, payment methods, etc.)
5. After user confirms submission:
   - Move entry from `queue` to `completed`
   - Set `submitted_date` to today
   - Update `last_submission_date`
6. If automatable (directory has API or simple form), provide step-by-step browser automation instructions

### Status

Show:
- Total directories: X
- Completed: Y (with dates)
- Remaining: Z
- Current streak: N days
- Estimated completion: ~Z days at 1-2/day
- Next up: [directory name]

## NAP Consistency Rules

**CRITICAL:** Every submission MUST use the EXACT same NAP. No variations.

- Name: Use the official business name. No abbreviations unless that IS the official name.
- Address: Use the exact format from Google Business Profile. Include suite/unit if applicable.
- Phone: Use the primary business phone. Format: (705) 555-1234

If NAP hasn't been verified yet, BLOCK all submissions and prompt user to run `/chino:nap-audit` first.

## Output

- State: `projects/<client>/seo/directory-queue.json`
- Log: `projects/<client>/seo/directories/submission-log.md`
- Master list: `projects/<client>/seo/directories/master-list.md`

## Scheduling

This skill is designed to be triggered daily via cron or heartbeat:
- Ideal time: 9:00 AM local time
- Can be added to morning review routine
- Post submission confirmation to `#internal-seo` Slack channel

## Anti-Patterns

- Never submit to more than 2 directories in one day
- Never vary the NAP between directories
- Never submit to spam/PBN directories
- Never pay for directory listings without user approval
- Never auto-submit without user reviewing the directory first
