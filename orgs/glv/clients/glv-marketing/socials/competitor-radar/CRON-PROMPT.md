<!-- skip-content-check -->
# Competitor Radar — Weekly Cron Prompt

This file defines the prompt used by the `competitor-radar` cron (fires Sunday 23:00 UTC).

---

## Prompt Template

```
Run the weekly GLV competitor radar. Today is [DATE]. Check all 4 targets below and produce a report at orgs/glv/clients/glv-marketing/socials/competitor-radar/weekly-[DATE].md

## Targets and handles

### 1. DIG / dig (digdeep.ca) — Direct local competitor
- LinkedIn: ca.linkedin.com/company/dig-inc- (~120 followers — confirmed baseline)
- Instagram: None confirmed active (baseline: zero active presence)
- Facebook: facebook.com/DigitalIntelligenceGroup (baseline: possibly defunct)
- Website: digdeep.ca (no blog found; site last updated ~2022)

### 2. Village Media / SooToday — Local media benchmark
- Facebook: facebook.com/SooToday (~30,200 followers — baseline)
- Instagram: @sootoday (~11,000 followers — baseline)
- X/Twitter: @SooToday (~8,300 followers — baseline)
- Website: sootoday.com

### 3. Neil Patel — National thought-leader benchmark
- YouTube: youtube.com/@NeilPatel (1.58M subscribers — baseline)
- LinkedIn: linkedin.com/in/neilkpatel (~600K followers — baseline)
- Instagram: @neilpatel (652K — baseline)
- X/Twitter: @neilpatel (475K — baseline)
- TikTok: @neilpatel (287.9K — baseline)

### 4. Search Engine Land — Industry signal
- LinkedIn: Search Engine Land company page (~161,700 followers — baseline)
- X/Twitter: @sengineland (454,500 followers — baseline; cadence declining, newsletter is primary signal)
- YouTube: Search Engine Land (~15,000 — baseline)
- Website: searchengineland.com (newsletter is primary signal — check email not just social)

## Per-target output (repeat for each)

**[Target name]**
- Posting cadence: X posts/week across [platforms]
- Top post this week: [topic/title] — [platform] — [approx engagement]
- Content categories hit: [from GLV's 9 categories]
- Hashtag patterns: [notable hashtags or keywords used]
- Engagement rate: [if calculable]
- New format experiments: [anything new vs prior week]
- GLV overlap/gap: [are they hitting topics we should own? gaps we can fill?]

## Report structure

1. Executive summary (3-5 bullets — biggest moves this week across all 4)
2. Per-target sections (format above)
3. GLV action items (1-3 concrete things GLV should post about or respond to based on this week's intel)

## Tools
Use agent-browser if needed for live page reads. Pull deep per-post data where accessible (deep-analytics-pull discipline applies per MEMORY). Commit the output file after writing. Notify boss via agent message when complete.
```

---

## Cron Config

- Name: `competitor-radar`
- Schedule: `0 23 * * 0` (Sunday 23:00 UTC)
- Agent: scout
