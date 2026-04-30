# Ad Platform Credentials Setup Brief

Required when: Fusion Apr 30 campaign ends and real data pull is needed, or any paid client goes live.

## Platforms + Scope

### Meta Ads (Priority 1 — Fusion Financial active now)
- **Credential type:** Meta Business API access token (long-lived, 60-day, or system user token)
- **Scopes needed:** `ads_read`, `ads_management` (read-only sufficient for reporting)
- **Where to get it:** Meta Business Suite → Settings → System Users → Generate token
- **Where to store:** `orgs/glv/secrets.env` as `META_ADS_TOKEN`
- **Also needed:** Ad Account ID (format: `act_XXXXXXXXXX`) — add as `META_AD_ACCOUNT_FUSION` etc.
- **Refresh cadence:** System user tokens don't expire; standard user tokens expire 60 days (set a calendar reminder)

### Google Ads (Priority 2 — no active client yet)
- **Credential type:** OAuth2 refresh token + Google Ads Developer Token
- **Scopes needed:** `https://www.googleapis.com/auth/adwords` (read-only for reporting)
- **Where to get it:** Google Ads API Center → apply for developer token (basic access sufficient)
- **Where to store:** `orgs/glv/secrets.env` as `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`
- **Also needed:** Customer ID per client account (format: `XXX-XXX-XXXX`)
- **Refresh cadence:** OAuth2 refresh tokens are long-lived; developer token is permanent once approved

### TikTok Ads (Priority 3 — no active client)
- **Credential type:** TikTok Business API access token
- **Scopes needed:** `Ad Account Read`, `Report Read`
- **Where to store:** `orgs/glv/secrets.env` as `TIKTOK_ADS_TOKEN`, `TIKTOK_ADS_ADVERTISER_ID`
- **Refresh cadence:** 24-hour access tokens + long-lived refresh token; handle auto-refresh in script

### LinkedIn Ads (Priority 4 — no active client)
- **Credential type:** LinkedIn Marketing Developer Platform OAuth2
- **Scopes needed:** `r_ads`, `r_ads_reporting`
- **Where to store:** `orgs/glv/secrets.env` as `LINKEDIN_ADS_TOKEN`, `LINKEDIN_AD_ACCOUNT_ID`
- **Refresh cadence:** 60-day access tokens; requires refresh flow

## Immediate Action (Fusion)

Before Apr 30:
1. Add `META_ADS_TOKEN` + `META_AD_ACCOUNT_FUSION` to `orgs/glv/secrets.env`
2. OR Aiden exports CSV from Meta Ads Manager and drops at `orgs/glv/clients/fusion/data/meta-ads-export-apr2026.csv`

Option 2 (CSV export) is faster and zero setup. Option 1 unlocks automated future reporting.

## Notes
- All tokens live in `orgs/glv/secrets.env` (gitignored, shared across agents)
- Per-client account IDs should be namespaced: `META_AD_ACCOUNT_FUSION`, `META_AD_ACCOUNT_TITAN`, etc.
- Never store tokens in agent `.env` files — org secrets only for shared API keys
