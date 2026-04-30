# Reyco SEO Audit Automation — Cron Design Spec

**Author:** Jerry (analyst)
**Date:** 2026-04-20
**Task:** task_1776658419291_069
**Trigger:** Boss overnight-dispatch (triage #21, user green-lit)
**Implementer:** dev (per boss — dev will build the cron, not analyst)
**Status:** Design spec. No external calls made. No GSC pulls. No data in this doc.

---

## 0. Principles

1. **One signal, one cron, one threshold.** Don't bundle unrelated signals into a single job. Bundling breaks when one signal needs a different cadence or sensitivity later.
2. **Noise is a bug.** Every alert that fires is a tax on Aiden's attention. If a rule produces a false positive twice in a row, the rule is wrong. Tighten or drop.
3. **Data before alerts.** Week 1 is a silent baselining week — collect the signal, do NOT send Aiden anything. Week 2+ turns on thresholds once we know the real variance.
4. **Proxy the latency.** Every event carries `collected_at` (data timestamp from source) and `logged_at` (event log timestamp). They are often different and both matter.
5. **Reyco-specific first, generalize later.** This spec is Reyco-scoped. If SEO agent replicates for Fusion/Titan/Soo, adapt client-by-client — don't assume thresholds port.

---

## 1. Signal Catalog

Each row is one scheduled pull. All events log `category=action` per bus constraint, with `client_slug="reyco"` on metadata.

| # | Signal | Source | Event name | Cadence | Severity defaults |
|---|---|---|---|---|---|
| 1 | GSC CTR (site-wide) | GSC API | `gsc_ctr_snapshot` | Daily at 08:07 local | info |
| 2 | GSC CTR (per-query, top 50) | GSC API | `gsc_query_snapshot` | Daily at 08:11 local | info |
| 3 | GSC impressions (site-wide) | GSC API | `gsc_impressions_snapshot` | Daily at 08:13 local | info |
| 4 | GSC indexed URL count | GSC API (Index Coverage) | `gsc_indexation_snapshot` | Daily at 08:17 local | info |
| 5 | GSC indexation errors (new) | GSC API (Index Coverage) | `gsc_indexation_error` | Daily at 08:17 local | warning |
| 6 | Core Web Vitals (LCP/INP/CLS) | CrUX + PageSpeed API | `cwv_snapshot` | Weekly Mon 07:23 local | info |
| 7 | 404s / broken links (site crawl) | Custom crawler or Screaming Frog CLI | `site_crawl_issues` | Weekly Tue 06:41 local | info+warning |
| 8 | Schema validation errors | GSC Rich Results + manual cross-check | `schema_error` | Daily at 08:23 local | warning |
| 9 | Sitemap freshness | Fetch sitemap.xml, compare `<lastmod>` | `sitemap_status` | Daily at 08:27 local | info |
| 10 | Keyword position changes (tracked set) | Semrush Position Tracking API | `keyword_change` | Daily at 08:33 local | info (fires only on cell crossings) |
| 11 | Backlink delta | Ahrefs or Semrush | `backlink_change` | Weekly Thu 06:53 local | info |
| 12 | Robots.txt diff | Fetch + diff vs last known | `robots_change` | Daily at 08:37 local | warning on any change |
| 13 | HTTPS / redirect health | Head request on canonical URLs | `site_reachability` | Hourly at :43 | warning on any non-2xx for 2+ consecutive hours |

**Off-minute scheduling:** All cadences use off-minute times (07, 11, 13, 17, 23, 27, 33, 37, 41, 43, 53) to prevent synchronized fleet fires — same convention as the agent crons.

---

## 2. Cadence Rationale

**Hourly — reachability only.** Site-down is existential. Detect in <2h.

**Daily — transactional signals.** CTR, impressions, indexation, 404s from sitemap diff, schema errors, sitemap freshness, robots diff, keyword cell crossings. Daily is the right cadence because:
- GSC updates daily (no point pulling hourly).
- Aiden is most likely to act on an issue the morning it surfaces.
- Batch of daily signals rolls into a single morning digest — low attention cost.

**Weekly — trend signals.** CWV, full-site crawl, backlinks. Weekly because:
- CrUX is a 28-day rolling window. Hourly/daily is lower-signal.
- Full-site crawls are expensive; weekly catches most breakage.
- Backlink changes are slow — weekly is ample.

**Never real-time.** No streaming. The cost of false positives from noisy streams exceeds the benefit.

---

## 3. Output Format

Three output lanes, picked by severity:

### 3.1 Daily Digest — `orgs/glv/clients/reyco/reports/seo-audit-YYYY-MM-DD.md`

Single markdown file per day. Appended to by each daily signal's cron run. Rolled up by the 08:55 local roll-up cron. Structure:

```markdown
# Reyco SEO Audit — 2026-MM-DD

## Headline
One-line summary. Auto-generated from the severity triage.

## Today's Signal
| Metric | Yesterday | Today | Delta | Status |
|---|---|---|---|---|
| Clicks (7d) | ... | ... | ... | ok/warn/alert |
| Impressions (7d) | ... | ... | ... | ... |
| CTR (7d) | ... | ... | ... | ... |
| Indexed URLs | ... | ... | ... | ... |

## Issues Detected (if any)
(list with links to GSC / page URL)

## Action Items for Aiden
(only populated if a threshold tripped)

## Data Sources
- GSC pulled at HH:MM:SS UTC
- Semrush pulled at HH:MM:SS UTC
- Crawl (weekly only) last run YYYY-MM-DD
```

**Never sent automatically.** Digest lives in-repo; Aiden reads it when he wants. Dashboard row surfaces the file with a summary.

### 3.2 Dashboard Row

Add a Reyco SEO row to the existing cortextOS dashboard (path TBD per dev). Fields:
- Last digest timestamp
- Today's headline (auto-gen)
- 7-day trend sparklines (CTR, impressions, indexed URLs)
- Open issue count

Dashboard-only surface. No push.

### 3.3 Telegram Ping (Aiden) — HARD SIGNALS ONLY

Immediate push only on:
- `severity=critical` events (see §4 threshold tables)
- Site unreachable for 2+ consecutive hourly checks
- Indexed URL count drops >15% in one day
- Robots.txt changes (any change — low false-positive rate, high-impact)
- Any 5xx error rate spike on canonical URLs

Format: single terse Telegram message, no AI cliches, no emojis.
> "Reyco SEO alert — robots.txt changed. Diff: <url or 3-line paste>. Check now. — Jerry"

Telegram AND boss in parallel per Aiden's standing preference.

---

## 4. Threshold Rules

### 4.1 CTR (signal #1)

Baseline: compute 28-day trailing mean and stddev after week 1 baselining period.

| Rule | Threshold | Severity |
|---|---|---|
| Daily CTR drops >2 stddev below 28-day mean | -2σ | warning (digest only) |
| Daily CTR drops >3 stddev below 28-day mean for 3 consecutive days | -3σ × 3d | alert (Telegram + digest) |
| Daily CTR at 28-day high | +2σ | info (digest only) |

No alerts during week 1.

### 4.2 Impressions (signal #3)

| Rule | Threshold | Severity |
|---|---|---|
| Daily impressions <70% of 7-day rolling mean | -30% | warning |
| Daily impressions <50% of 7-day rolling mean | -50% | alert (likely deindexation or manual action) |

Paired check: if impressions drop >50% AND indexed URL count drops >15% — send ONE combined alert, not two. Never spam.

### 4.3 Indexation (signals #4, #5)

| Rule | Threshold | Severity |
|---|---|---|
| Indexed URL count drops >15% in 1 day | -15% | alert (Telegram) |
| Indexed URL count drops >5% but <15% in 1 day | -5% to -15% | warning |
| New indexation error detected on a canonical URL | any | warning (digest) |
| New indexation error on the homepage | any | alert (Telegram) |

### 4.4 Core Web Vitals (signal #6, weekly)

| Rule | Threshold | Severity |
|---|---|---|
| LCP p75 crosses from "good" (<2.5s) into "needs improvement" (2.5-4s) | cell crossing | warning |
| LCP p75 crosses from any cell into "poor" (>4s) | cell crossing | alert |
| INP p75 crosses into "poor" (>500ms) | cell crossing | alert |
| CLS p75 crosses into "poor" (>0.25) | cell crossing | alert |

Cell-crossing only — don't alert on in-cell movement. CWV is noisy.

### 4.5 404s / Broken Links (signal #7, weekly)

| Rule | Threshold | Severity |
|---|---|---|
| New 404 on a page with inbound internal links | any | warning (digest) |
| New 404 on homepage or top-10 organic landing pages | any | alert (Telegram) |
| Broken external link count >5 net new | +5 | warning |

### 4.6 Schema Errors (signal #8)

| Rule | Threshold | Severity |
|---|---|---|
| New schema error on a page with existing rich result | any | alert (Telegram) — rich results break fast |
| New schema error on any page without prior rich result | any | warning (digest) |

### 4.7 Sitemap (signal #9)

| Rule | Threshold | Severity |
|---|---|---|
| Sitemap `<lastmod>` unchanged for 14+ days while site has recent content | 14d stale | warning |
| Sitemap returns 404 or 5xx | any fetch failure | alert |
| Sitemap URL count drops >10% in 1 day | -10% | alert |

### 4.8 Keyword Moves (signal #10)

| Rule | Threshold | Severity |
|---|---|---|
| Tracked keyword moves INTO top-3 | cell cross | info (digest celebration) |
| Tracked keyword moves OUT of top-10 (was in top-10 yesterday) | cell cross | warning |
| Tracked keyword drops by >20 positions in 1 day | -20 positions | alert |

### 4.9 Backlinks (signal #11, weekly)

| Rule | Threshold | Severity |
|---|---|---|
| Net new referring domains >5 in 1 week | +5 | info |
| Net loss of >3 referring domains in 1 week | -3 | warning |
| Loss of a DA-50+ referring domain | any | alert |

### 4.10 Robots.txt (signal #12)

| Rule | Threshold | Severity |
|---|---|---|
| Any diff vs previous day's fetch | any change | alert (Telegram always — robots changes are high-impact and rare) |

### 4.11 Site Reachability (signal #13)

| Rule | Threshold | Severity |
|---|---|---|
| 2 consecutive hourly checks return non-2xx | 2h | alert (Telegram + boss) |
| Any single check returns 5xx | 1 occurrence | warning (digest) |

---

## 5. Week-1 Silent Baselining

**Goal:** learn the real variance of each signal before turning on alerts.

Week 1 (first 7 days after cron activation):
- All crons RUN.
- All events LOG (so trends accumulate).
- Daily digest generates.
- **NO Telegram alerts fire.** All severity=alert events demote to severity=warning in the digest.
- End-of-week-1 task: analyst (me) reviews the signal variance, adjusts thresholds in this doc, and promotes alerts back to live.

Hard exceptions during week 1 (these always alert, even in silent mode):
- Site reachability (2h non-2xx)
- Sitemap returns 404/5xx
- Any 5xx error spike on canonical URLs

---

## 6. Escalation Tree

Any `severity=alert` event triggers:

1. **Log event** with `severity=alert` + full meta
2. **Send Telegram to Aiden** — terse, single-line, includes the specific URL or metric
3. **Send agent message to boss** in parallel (per Aiden's standing preference — boss does not gatekeep analyst alerts)
4. **Append to digest** with an "Action Items" entry

Any `severity=warning` event:

1. **Log event**
2. **Append to digest** under "Issues Detected"
3. NO push. Aiden reads it at his cadence.

Any `severity=info` event:

1. **Log event**
2. **Append to digest** under the metric table
3. No other surface.

---

## 7. Event Meta Schema (for dev)

All audit events share a base meta:

```json
{
  "client_slug": "reyco",
  "source": "gsc" | "semrush" | "ahrefs" | "crux" | "pagespeed" | "crawler" | "fetch",
  "collected_at": "2026-04-20T13:07:00Z",
  "logged_at": "2026-04-20T13:07:12Z",
  "severity_rule_id": "ctr_drop_2sigma_3d",
  "run_id": "reyco-seo-daily-2026-04-20"
}
```

Per-event additions go in the signal-specific meta.

---

## 8. Implementation Handoff to Dev

What dev owns:
- Cron wiring (13 crons per table in §1)
- API integrations per signal (GSC, Semrush, Ahrefs, CrUX, PageSpeed, custom crawler)
- Daily digest roll-up job at 08:55 local
- Threshold evaluation logic (takes §4 rules as input, emits severity)
- Telegram + boss push on severity=alert
- Dashboard row wiring

What analyst owns (ongoing):
- Week-1 baseline review and threshold tuning
- Quarterly threshold re-tuning
- New signal additions when identified
- Alert-rule precision/recall audit (monthly — false alert log review)

What SEO agent owns (parallel):
- Pre-retainer `rankings_snapshot` on Day 1 of Reyco retainer (per 2026-04-19 schema lock)
- Ongoing SEO deliverables tracked via their own schema (seo_deliverable events)
- This audit cron is a parallel observability layer, NOT a replacement for SEO work

---

## 9. Open Questions for Dev

1. **Screaming Frog vs custom crawler?** Screaming Frog CLI is mature but licensed. Custom in-house is free but more dev work. Pick one.
2. **GSC API rate limits?** Reyco property alone should be well under, but if this spec generalizes to 5 clients × 13 signals, quota math needs to be done.
3. **Ahrefs vs Semrush for backlinks?** We have Semrush MCP working. Ahrefs not confirmed. If Semrush covers backlinks adequately, drop Ahrefs.
4. **Dashboard — does it exist yet?** If not, delay §3.2 until dashboard ships; keep §3.1 (markdown digest) as the only surface until then.

---

## 10. Open Questions for Boss / Aiden

1. **Digest path** — confirm `orgs/glv/clients/reyco/reports/seo-audit-YYYY-MM-DD.md` is the right home. Alternatives: `clients/reyco/deliverables/...` or a separate `audits/` subdir.
2. **Telegram threshold aggressiveness** — this spec is calibrated CONSERVATIVE on alerts. Aiden can review week-1 baseline and tell me to tighten.
3. **Slack surface?** Boss mentioned Slack as a possible output channel. Currently not included — Aiden prefers Telegram. Add only if explicit ask.
4. **Retainer start date** — Reyco retainer is "May 2026." Cron activation should be Day 1 of retainer, with the week-1 silent baselining window running concurrently with the retainer's first week. Confirm timing.

---

*End of spec. Dev: over to you for implementation estimate. Analyst ready to iterate on any section.*
