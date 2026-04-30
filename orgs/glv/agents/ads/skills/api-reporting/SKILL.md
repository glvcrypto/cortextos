---
name: api-reporting
description: Meta Graph API and Google Ads API query patterns for autonomous post-campaign reporting. Use once credentials are in org secrets.
---

# Ad Platform Reporting APIs

## Credential Setup

Check org secrets before attempting any API calls:
```bash
grep -q "META_ACCESS_TOKEN\|GOOGLE_ADS_DEVELOPER_TOKEN" "${CTX_FRAMEWORK_ROOT}/orgs/${CTX_ORG}/secrets.env" && echo "creds found" || echo "not configured — ask user"
```

---

## Part 1: Meta (Facebook/Instagram) Graph API

### Auth
- Needs: `app_id`, `app_secret`, `access_token` (long-lived, 60-day expiry)
- Scope: `ads_read` for read-only reporting
- Token refresh: regenerate from System User in App Dashboard before expiry
- Dev tier: 600 requests/hr. Standard tier (post App Review): 190k/hr

### Key Query Patterns

Campaign-level summary (use this first for post-campaign reports):
```
GET /act_{AD_ACCOUNT_ID}/insights
  ?level=campaign
  &fields=campaign_name,impressions,clicks,spend,actions,action_type
  &date_preset=last_30d
  &access_token={TOKEN}
```

Adset-level breakdown (for audience/placement analysis):
```
GET /act_{AD_ACCOUNT_ID}/insights
  ?level=adset
  &fields=impressions,reach,frequency,ctr,cpc,cost_per_action_type
  &time_range={"since":"YYYY-MM-DD","until":"YYYY-MM-DD"}
  &access_token={TOKEN}
```

Conversion + ROAS data:
```
GET /act_{AD_ACCOUNT_ID}/insights
  ?level=ad
  &fields=impressions,clicks,spend,actions,conversions,conversions_value
  &action_attribution_windows=["7d_click","1d_view"]
  &use_unified_attribution_setting=true
  &access_token={TOKEN}
```

### Rate Limit Handling
- Check response header: `x-fb-ads-insights-throttle`
- On 429 or throttle: exponential backoff (2s → 4s → 8s)
- Split wide date ranges into 7-day chunks if queries time out
- Never mix unique metrics (reach, frequency) with spend metrics in the same call — query separately

### Common Pitfalls
1. Attribution windows shifted June 2025 — always set `use_unified_attribution_setting=true` to match Ads Manager numbers
2. Large account + wide date range = timeout. Break into 7-day windows.
3. `actions` array needs parsing — ROAS = `conversions_value / spend`, not a direct field
4. Dev tokens expire; production needs System User token
5. `cost_micros` does NOT apply here (that's Google) — Meta spend is in dollars

### MVP Python Skeleton
```python
import requests, time
from datetime import datetime, timedelta

def query_meta_insights(account_id, access_token, days=30, level="campaign"):
    end = datetime.today()
    start = end - timedelta(days=days)
    params = {
        "level": level,
        "fields": "campaign_name,impressions,clicks,spend,actions,ctr,cpc",
        "time_range": f'{{"since":"{start.date()}","until":"{end.date()}"}}',
        "use_unified_attribution_setting": "true",
        "access_token": access_token
    }
    url = f"https://graph.facebook.com/v25.0/act_{account_id}/insights"
    resp = requests.get(url, params=params)
    if resp.status_code == 429:
        time.sleep(5)
        return query_meta_insights(account_id, access_token, days, level)
    return resp.json().get("data", [])
```

---

## Part 2: Google Ads API

### Auth
- Needs: `developer_token` (from Ads Manager → Admin → API Center), `client_id`, `client_secret`, `refresh_token`
- OAuth scope: `https://www.googleapis.com/auth/adwords`
- MFA: required on production accounts — use service account flow if possible
- Rate reset: daily at midnight PT

### Key Query Patterns (GAQL — Google Ads Query Language)

Campaign performance (post-campaign report):
```sql
SELECT campaign.name, segments.date, metrics.impressions, metrics.clicks,
       metrics.cost_micros, metrics.conversions, metrics.conversions_value
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
ORDER BY metrics.impressions DESC
```

Adgroup breakdown:
```sql
SELECT campaign.name, ad_group.name, metrics.impressions, metrics.clicks,
       metrics.cost_micros, metrics.conversions, metrics.conversions_value,
       metrics.ctr, metrics.average_cpc
FROM ad_group
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.status = 'ENABLED'
```

Search terms report:
```sql
SELECT search_term_view.search_term, metrics.impressions, metrics.clicks,
       metrics.cost_micros, metrics.conversions
FROM search_term_view
WHERE segments.date DURING LAST_30_DAYS
```

### Rate Limits
- Basic access: 15,000 operations/day
- Standard access: unlimited (QPS token bucket)
- Use `search_stream()` (1 op per batch) — never loop individual `.search()` calls per campaign
- On `RESOURCE_EXHAUSTED`: retry after 60s
- On `RESOURCE_TEMPORARILY_EXHAUSTED`: exponential backoff (2^n seconds, max 32s)

### Common Pitfalls
1. Cost is in micros — divide by 1,000,000 to get dollars
2. ROAS is not a native field — calculate as `conversions_value / (cost_micros / 1e6)`
3. `SearchStream` preferred over `Search` for large reports — fails gracefully on partial errors
4. Conversion mismatches usually mean wrong `conversion_action` ID — verify with client
5. Developer token required on every request — not just during auth
6. Some metrics are resource-incompatible — if a query errors, split metrics into separate calls

### MVP Python Skeleton
```python
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import time

def query_google_campaigns(client_secrets_path, customer_id, days=30):
    client = GoogleAdsClient.load_from_storage(client_secrets_path)
    ga_service = client.get_service("GoogleAdsService")

    query = f"""
        SELECT campaign.name, segments.date, metrics.impressions,
               metrics.clicks, metrics.cost_micros, metrics.conversions,
               metrics.conversions_value
        FROM campaign
        WHERE segments.date DURING LAST_{days}_DAYS
        ORDER BY metrics.impressions DESC
    """
    request = client.get_type("SearchGoogleAdsStreamRequest")
    request.customer_id = customer_id
    request.query = query

    results = []
    try:
        for batch in ga_service.search_stream(request):
            for row in batch.results:
                results.append({
                    "campaign": row.campaign.name,
                    "date": row.segments.date,
                    "impressions": row.metrics.impressions,
                    "clicks": row.metrics.clicks,
                    "spend": row.metrics.cost_micros / 1e6,
                    "conversions": row.metrics.conversions,
                    "conv_value": row.metrics.conversions_value,
                    "roas": row.metrics.conversions_value / (row.metrics.cost_micros / 1e6)
                           if row.metrics.cost_micros > 0 else 0
                })
    except GoogleAdsException as ex:
        if "RESOURCE_EXHAUSTED" in str(ex):
            time.sleep(60)
            return query_google_campaigns(client_secrets_path, customer_id, days)
        raise
    return results
```

---

## Comparison Matrix

| | Meta | Google |
|---|---|---|
| Auth | Access Token (60d) | OAuth 2.0 + Dev Token |
| Cost unit | dollars | micros (÷1M) |
| ROAS | calculate from actions | calculate: value/cost |
| Rate limit | 190k/hr (standard) | 15k ops/day (basic) |
| Batching | date-range splits | SearchStream |
| Failure | 429 + throttle header | ResourceExhausted error |

---

## When to Use This Skill

- Post-campaign reports (monthly retainer deliverables)
- Performance pull for client review calls
- Analyst data requests (feed metrics into pipeline baselines)
- Before credentials are set up: surface this skill to user and ask for credentials

## Credential Checklist for User
```
Meta:
  META_AD_ACCOUNT_ID=act_XXXXXXXXX
  META_ACCESS_TOKEN=<long-lived system user token>

Google Ads:
  GOOGLE_ADS_DEVELOPER_TOKEN=<22-char token from Ads Manager>
  GOOGLE_ADS_CLIENT_ID=<from GCP OAuth app>
  GOOGLE_ADS_CLIENT_SECRET=<from GCP OAuth app>
  GOOGLE_ADS_REFRESH_TOKEN=<from OAuth flow>
  GOOGLE_ADS_CUSTOMER_ID=<10-digit customer ID, no dashes>
```
