# Reyco Marine — Pre-Retainer Rankings Baseline
**Purpose:** Anchor snapshot BEFORE any retainer work begins. Establishes true Day 0 position for all tracked keywords so Q3 lift is measurable.
**Prepared:** 2026-04-22 by seo agent
**Target fire date:** Before May 1, 2026 (retainer start)
**Source:** Google Search Console — Performance report, Last 28 days

---

## How to Pull This in GSC

1. Go to [Google Search Console](https://search.google.com/search-console) → select `reycomarine.com`
2. Click **Search results** (left sidebar)
3. Set date range: **Last 28 days** (captures pre-retainer baseline)
4. Export → Download CSV (includes all queries, impressions, clicks, avg position)
5. Send CSV to seo agent — will parse, match against tracking list, and fire `rankings_snapshot` event

Alternatively: filter by each keyword below in GSC > Queries > filter, capture position/impressions/clicks manually. CSV export is faster.

---

## Tracked Keyword List — Priority 5 (Build First)

~45 keywords. These are the highest-priority targets across all 11 clusters. Baseline position for these dictates month-1 retainer focus.

### Cluster 1 — Princecraft (Dealer Monopoly)

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| princecraft boats canada | 500–1,000 | — | — | — |
| princecraft dealer near me | 200–500 | — | — | — |
| princecraft dealer sault ste marie | 50–100 | — | — | — |
| which princecraft model should i buy | 50–100 | — | — | — |
| best pontoon boat for northern ontario lakes | 50–100 | — | — | — |
| first time boat buyer guide ontario | 100–200 | — | — | — |

### Cluster 2 — Mercury Outboards

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| mercury outboard dealer sault ste marie | 50–100 | — | — | — |
| mercury outboard service near me sault ste marie | 50–100 | — | — | — |
| how often to service outboard motor | 200–500 | — | — | — |

### Cluster 3 — Minn Kota

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| minnkota dealer sault ste marie | ~50 | — | — | — |
| minnkota repair near me sault ste marie | ~50 | — | — | — |

### Cluster 4 — Humminbird

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| humminbird dealer sault ste marie | ~50 | — | — | — |
| best electronics for princecraft fishing boat | ~50 | — | — | — |

### Cluster 5 — Toro

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| toro dealer sault ste marie | 50–100 | — | — | — |
| best snowblower for northern ontario winter | 100–200 | — | — | — |
| snowblower repair sault ste marie | 100–200 | — | — | — |

### Cluster 6 — Cub Cadet

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| cub cadet dealer sault ste marie | 50–100 | — | — | — |

### Cluster 7 — Echo

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| echo dealer sault ste marie | ~50 | — | — | — |
| echo chainsaw repair near me sault ste marie | ~50 | — | — | — |

### Cluster 8 — Bercomac

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| bercomac dealer sault ste marie | <50 | — | — | — |
| best tractor attachment for northern ontario | 50–100 | — | — | — |

### Cluster 9 — Service & Repair (Fastest Quick Win)

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| small engine repair near me | 3,600 (CA) | — | — | — |
| small engine repair sault ste marie | 200–400 | — | — | — |
| boat repair sault ste marie | 100–200 | — | — | — |
| marine service sault ste marie | 100–200 | — | — | — |
| outboard motor repair sault ste marie | 50–100 | — | — | — |
| snowblower repair sault ste marie | 100–200 | — | — | — |
| boat winterization sault ste marie | 50–100 | — | — | — |
| how to winterize a boat ontario | 500–1,000 | — | — | — |

### Cluster 10 — Financing (Highest Conversion Value)

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| boat financing ontario | 500–1,000 | — | — | — |
| marine financing sault ste marie | 50–100 | — | — | — |
| boat monthly payment calculator | 200–500 | — | — | — |

### Cluster 11 — Local & Dealer (Geo Anchors)

| Keyword | Est. Vol/mo | GSC Baseline Pos | GSC Clicks | GSC Impressions |
|---------|------------|-----------------|------------|-----------------|
| boat dealer sault ste marie | 100–200 | — | — | — |
| boat dealer northern ontario | 100–200 | — | — | — |
| marine dealer algoma district | ~50 | — | — | — |
| fishing boat dealer near sault ste marie | 50–100 | — | — | — |

---

## Baseline Snapshot Summary (fill after GSC pull)

| Metric | Value |
|--------|-------|
| Snapshot date | — |
| GSC date range | Last 28 days (pre-retainer) |
| Keywords tracked | 44 |
| Keywords with any impression | — |
| Keywords ranking top 3 | — |
| Keywords ranking top 10 | — |
| Keywords ranking top 20 | — |
| Keywords ranking top 100 | — |
| Avg position (across tracked set) | — |
| Total clicks (all queries, site-wide) | — |
| Total impressions (all queries, site-wide) | — |
| Site-wide CTR | — |

---

## Event to Fire After GSC Pull

```bash
cortextos bus log-event action rankings_snapshot info --meta '{
  "client_slug": "reyco-marine",
  "source": "google_search_console",
  "sampled_at": "YYYY-MM-DD",
  "date_range": "last_28_days",
  "keywords_tracked": 44,
  "top3_count": N,
  "top10_count": N,
  "top20_count": N,
  "top100_count": N,
  "avg_position": N.N,
  "total_clicks": N,
  "total_impressions": N,
  "ctr_avg": "N.N%",
  "note": "pre-retainer baseline anchor — fired before any retainer work"
}'
```

---

## What to Watch at End of Q3 2026

Priority 5 targets to move from unranked / >50 → top 10:
- `small engine repair sault ste marie` — KD ~8, highest ROI
- `princecraft dealer sault ste marie` — brand monopoly, should rank fast
- `boat dealer sault ste marie` — local geo anchor
- `mercury outboard dealer sault ste marie` — fight Northshore Sports
- All `[brand] dealer sault ste marie` variants — dealer pages, low competition

---

*Awaiting GSC CSV from user to populate baseline values and fire rankings_snapshot event.*
