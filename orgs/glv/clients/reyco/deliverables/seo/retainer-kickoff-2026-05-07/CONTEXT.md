# Reyco Marine — SEO Retainer Client Context
**Created:** 2026-05-07 by seo agent (overnight kickoff)
**Retainer start:** 2026-05-07 (domain cutover ~21:00Z May 6)
**Retainer rate:** $2,000/mo

---

## seo: block

```yaml
seo:
  client: reyco-marine
  domain: reycomarine.com
  gsc_property: sc-domain:reycomarine.com
  gsc_verified: false  # DNS TXT verify pending — see GA4_GSC_wiring_plan.md
  ga4_mcp: null        # pending install
  ga4_property_id: null  # pending — free property under Aiden's Google account
  ga4_install_method: rank_math_analytics_module  # no GTM, no theme edits
  semrush_project: reycomarine.com
  semrush_status: blocked_overnight  # MCP not ported from life-os; WebFetch/v4 data used
  rank_math_tier: free
  output_path: orgs/glv/clients/reyco/deliverables/seo/
  geo_target_primary: Sault Ste. Marie, ON  # SSM only, first 90 days
  geo_target_expand: Northern Ontario, ON  # post-90d expansion
  retainer_phase: phase_1_foundation
  retainer_phase_end: 2026-08-06
```

---

## Site Configuration

| Property | Value |
|----------|-------|
| Domain | reycomarine.com |
| Platform | WordPress + WooCommerce |
| Theme | Divi (custom) |
| Hosting | SiteGround GrowBig |
| CDN/WAF | Cloudflare |
| SEO plugin | Rank Math (free tier) |
| Sitemaps | Live (Rank Math generated) |
| robots.txt | Basic — AI bot stanzas missing, needs refresh |
| llms.txt | ABSENT — needs creation |
| GSC | NOT verified |
| GA4 | NOT installed |
| Schema | LocalBusiness (filed via dev), Product schema (dev PR queue), Breadcrumbs (partial) |

---

## Business Profile

| Field | Value |
|-------|-------|
| Legal name | Reyco Marine & Small Engine Ltd. |
| GBP name | Reyco Marine & Small Engine |
| Address | Sault Ste. Marie, ON |
| Phone | (verify from GBP) |
| Hours | (verify from GBP) |
| Business type | Marine dealer + powersports + small engine service |
| Dealer brands | Mercury, Princecraft, EZGO, Hisun, Toro, Echo, Cub Cadet, Minn Kota, Cannon, Humminbird |
| Exclusive | Northern Ontario's only Princecraft dealer |
| GBP access | Aiden = Manager (no Casey blocker) |

---

## Silo Weighting

| Silo | Weight | Primary URL | Notes |
|------|--------|-------------|-------|
| Marine / Boats | 60% | /boats-and-marine/ | LEAD silo — Princecraft, Mercury focus |
| Service + Seasonal | 40% | /service-and-repair/ | Small engine, winterization, commissioning |

---

## Tracked Competitors

| Competitor | Type | Notes |
|-----------|------|-------|
| Northshore Sports & Auto | SSM local | Powersports, may overlap marine |
| Rivercity Motorsports & Marine | SSM local | Direct marine competitor |
| Loonie Toons Pontoons & Powersports | SSM local | Pontoons + powersports overlap |

---

## Key Personnel (for Person schema / author bios)

| Person | Role | Source |
|--------|------|--------|
| Casey | Owner / Sales | About page bio |
| Aaron | Co-Owner / Service Manager | About page bio |
| Lynn | Parts Manager | About page bio |
| Ron | Parts | About page bio |
| Kory | Sales | About page bio |
| Lee | Service Tech | About page bio |
| Damian | Service Tech | About page bio |

*Casey/Charlene 8+ day silence on bio data — generic placeholders authorized.*

---

## SEO Subfolder Structure

```
orgs/glv/clients/reyco/deliverables/seo/
├── retainer-kickoff-2026-05-07/   ← THIS FOLDER (foundation stack)
├── keyword-research/              ← existing + new research
├── on-page/                       ← page-level briefs
├── schema/                        ← schema templates
├── audit/                         ← tech/content audits
├── content-plan/                  ← monthly calendars
├── citations/                     ← directory/NAP tracking
└── reports/                       ← monthly retainer reports
```

---

## Open Questions / Flags

| Item | Status | Owner |
|------|--------|-------|
| Casey GBP involvement | TBD — assume GLV-delegated for planning | Flag to Aiden AM |
| GSC DNS TXT record | Pending Aiden action | See GA4_GSC_wiring_plan.md |
| GA4 install | Pending Aiden action | See GA4_GSC_wiring_plan.md |
| Semrush MCP port | Blocked overnight — use v4 data | Post-AM fix |
| Person schema bio data | 8+ day silence from Casey/Charlene | Generic placeholders until reply |
| robots.txt + llms.txt | Dev PR queued — boss merge AM | See dev PR |

---

*This file is the single source of truth for Reyco SEO retainer config. Update when any property changes.*
