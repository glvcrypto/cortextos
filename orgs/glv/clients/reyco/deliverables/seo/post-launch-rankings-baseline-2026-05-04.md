# Reyco Marine — Post-Launch Rankings Baseline
**Purpose:** Day 0 post-launch anchor. Domain cutover landed ~16:50Z May 2, 2026. This snapshot establishes the true starting line for the May retainer — any position lift measured from here is attributable to retainer work.
**Prepared:** 2026-05-04 by seo agent
**Updated from:** baseline-rankings-snapshot.md (pre-retainer draft, 2026-04-22)
**Source when populated:** Google Search Console — reycomarine.com property

---

## Step 1 — GSC Site Verification Pre-Flight

Domain transferred to new WP site ~May 2. Confirm property status before pulling data.

### Check if property exists
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click the property selector (top left)
3. Look for `reycomarine.com` or `sc-domain:reycomarine.com`

**If it exists (from DealerSpike era):** Re-verify ownership — the old HTML tag/DNS record may have been on DealerSpike's infra, not ours. If verification shows "verified" but you're unsure, add a new verification method to be safe.

**If it doesn't exist:** Add property → choose "Domain" type (covers http/https/www/non-www) → verify via DNS TXT record.

### Preferred verification — DNS TXT record (recommended)
1. GSC will show a TXT record like: `google-site-verification=XXXXXXXX`
2. Add it to Cloudflare DNS for `reycomarine.com`
3. Cloudflare: DNS → Add record → Type: TXT → Name: `@` → Content: paste the value → Save
4. Back in GSC: click Verify — usually resolves within 1-2 minutes

### Alt verification — WordPress HTML tag
If DNS is inconvenient: GSC → HTML tag method → copy the `<meta name="google-site-verification">` tag
In WP Admin → RankMath → General Settings → Webmaster Tools → paste in the "Google Search Console" field → Save

---

## Step 2 — Pull Baseline CSV

Once property is verified:
1. GSC → Search results → set date range: **Custom: 2026-04-06 → 2026-05-04** (28 days, anchored to today)
2. Toggle ON: Clicks, Impressions, CTR, Position
3. Click **Export → Download CSV**
4. Send the CSV to seo agent (Telegram or agent message)

> **Data caveat:** Apr 6 → May 1 reflects DealerSpike's old reycomarine.com. May 2–4 reflects the new WP site. The "before" baseline for retainer measurement is effectively May 2 (day of cutover). First clean 28-day window will be June 1. Use this snapshot as the anchor and note the caveat in the summary.

---

## Step 3 — Agent Populates (on CSV receipt)

I'll parse the CSV, match against the 57-keyword tracking list below, fill in Position/Clicks/Impressions, and fire the `rankings_snapshot` event.

---

## Keyword Tracking List — Priority 5 (57 keywords)

> Covers service, dealer, parts, warranty clusters. KD and Vol from Semrush v4 (2026-04-25).
> All <10 SSM-local terms are real queries — Semrush blind spot for small cities; zero competition means any ranking page wins.

### Cluster A — Service & Repair (Highest Volume)

| Keyword | Vol (CA) | KD | GSC Pos | GSC Clicks | GSC Impr |
|---------|----------|----|---------|-----------|---------|
| small engine repair near me | 3,600 | 11 | — | — | — |
| small engine repair | 2,400 | 20 | — | — | — |
| lawn mower repair near me | 1,300 | 19 | — | — | — |
| lawn mower repair | 1,300 | 19 | — | — | — |
| snowblower repair near me | 1,600 | 25 | — | — | — |
| snowblower repair | 720 | 16 | — | — | — |
| boat repair near me | 590 | 9 | — | — | — |
| outboard motor repair | 260 | 21 | — | — | — |
| outboard engine repair | 210 | 5 | — | — | — |
| lawn mower service | 170 | 7 | — | — | — |
| boat winterization | 140 | 22 | — | — | — |
| boat winterization near me | 110 | 5 | — | — | — |
| how to winterize outboard motor | 90 | 10 | — | — | — |
| snowblower tune up | 90 | 14 | — | — | — |
| lawn mower tune up | 110 | 22 | — | — | — |
| how often to service outboard motor | 10 | 0 | — | — | — |

### Cluster B — Local SSM Service

| Keyword | Vol (CA) | KD | GSC Pos | GSC Clicks | GSC Impr |
|---------|----------|----|---------|-----------|---------|
| small engine repair sault ste marie | 40 | 0 | — | — | — |
| snowblower repair sault ste marie | 30 | 0 | — | — | — |
| lawn mower repair sault ste marie | 20 | 0 | — | — | — |
| boat repair sault ste marie | <10 | 0 | — | — | — |
| marine service sault ste marie | <10 | 0 | — | — | — |
| outboard motor repair sault ste marie | <10 | 0 | — | — | — |
| outboard engine repair sault ste marie | <10 | 0 | — | — | — |
| outboard tune up sault ste marie | <10 | 0 | — | — | — |
| marine engine repair sault ste marie | <10 | 0 | — | — | — |
| small engine mechanic sault ste marie | <10 | 0 | — | — | — |
| echo chainsaw repair sault ste marie | <10 | 0 | — | — | — |
| lawn mower service sault ste marie | <10 | 0 | — | — | — |
| lawn mower tune up sault ste marie | <10 | 0 | — | — | — |
| riding mower repair sault ste marie | <10 | 0 | — | — | — |
| snowblower service sault ste marie | <10 | 0 | — | — | — |
| snowblower tune up sault ste marie | <10 | 0 | — | — | — |
| cub cadet service sault ste marie | <10 | 0 | — | — | — |
| cub cadet snowblower service sault ste marie | <10 | 0 | — | — | — |
| toro lawn mower service sault ste marie | <10 | 0 | — | — | — |
| toro snowblower repair sault ste marie | <10 | 0 | — | — | — |
| spring tune up service sault ste marie | <10 | 0 | — | — | — |
| ATV repair sault ste marie | <10 | 0 | — | — | — |
| UTV repair sault ste marie | <10 | 0 | — | — | — |
| side by side repair sault ste marie | <10 | 0 | — | — | — |
| Hisun service sault ste marie | <10 | 0 | — | — | — |
| boat winterization sault ste marie | <10 | 0 | — | — | — |
| how to winterize a boat ontario | <10 | 0 | — | — | — |

### Cluster C — Dealer & Parts

| Keyword | Vol (CA) | KD | GSC Pos | GSC Clicks | GSC Impr |
|---------|----------|----|---------|-----------|---------|
| mercury outboard dealer sault ste marie | <10 | 0 | — | — | — |
| mercury outboard service sault ste marie | <10 | 0 | — | — | — |
| mercury outboard parts sault ste marie | <10 | 0 | — | — | — |
| marine parts sault ste marie | <10 | 0 | — | — | — |
| cub cadet authorized service near me | 10 | 0 | — | — | — |
| cub cadet parts sault ste marie | <10 | 0 | — | — | — |
| toro parts sault ste marie | <10 | 0 | — | — | — |

### Cluster D — Warranty

| Keyword | Vol (CA) | KD | GSC Pos | GSC Clicks | GSC Impr |
|---------|----------|----|---------|-----------|---------|
| mercury outboard warranty ontario | <10 | 0 | — | — | — |
| is regular service required for warranty | <10 | 0 | — | — | — |
| warranty repair sault ste marie | <10 | 0 | — | — | — |

---

## Baseline Summary (populate on CSV receipt)

| Metric | Value |
|--------|-------|
| Snapshot date | — |
| GSC date range | 2026-04-06 → 2026-05-04 |
| Domain cutover date | 2026-05-02 |
| Keywords tracked | 57 |
| Keywords with any impression | — |
| Keywords ranking top 3 | — |
| Keywords ranking top 10 | — |
| Keywords ranking top 20 | — |
| Keywords ranking top 100 | — |
| Avg position (tracked set) | — |
| Total site-wide clicks | — |
| Total site-wide impressions | — |
| Site-wide CTR | — |
| Data note | Apr 6–May 1 = DealerSpike era; May 2–4 = new WP site |

---

## Event to Fire After Populate

```bash
cortextos bus log-event action rankings_snapshot info --meta '{
  "client_slug": "reyco-marine",
  "source": "google_search_console",
  "sampled_at": "2026-05-04",
  "date_range": "2026-04-06_to_2026-05-04",
  "keywords_tracked": 57,
  "top3_count": N,
  "top10_count": N,
  "top20_count": N,
  "top100_count": N,
  "avg_position": N.N,
  "total_clicks": N,
  "total_impressions": N,
  "ctr_avg": "N.N%",
  "note": "post-launch anchor — May 2 domain cutover; Apr 6–May 1 is DealerSpike era data"
}'
```

---

## Q3 2026 Watch List (track lift against this baseline)

Highest-ROI movements to watch:
- `small engine repair sault ste marie` (KD=0, owned category)
- `boat repair sault ste marie` (KD=0, only SSM competitor)
- `snowblower repair sault ste marie` (KD=0, 30/mo volume)
- `mercury outboard dealer sault ste marie` (brand lock-in)
- `cub cadet authorized service near me` (10/mo, zero competition, high intent)
- `how to winterize outboard motor` (90/mo, KD=10, page doesn't exist yet — build by Sep)

---

*Template ready. Awaiting GSC CSV from Aiden to populate. File: post-launch-rankings-baseline-2026-05-04.md*
