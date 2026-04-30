# Chino Client Configuration Guide

> How to onboard a new client to the /chino SEO subagent system.

## How to Onboard a New Client

### 1. Add `seo:` block to `projects/<client>/CONTEXT.md`

Add this YAML block to the Resources section of the client's CONTEXT.md:

```yaml
seo:
  domain: example.com
  gsc_property: "sc-domain:example.com"
  ga4_mcp: mcp__ga4-<shortname>       # null if no GA4 property
  ga4_property_id: "123456789"          # null if no GA4 property
  semrush_project: example.com
  output_path: projects/<client-slug>/seo
```

**Field reference:**

| Field | Description | Example |
|-------|-------------|---------|
| `domain` | The bare domain (no protocol) | `titantinyhomes.ca` |
| `gsc_property` | GSC property identifier (domain property format) | `sc-domain:titantinyhomes.ca` |
| `ga4_mcp` | The MCP server name for this client's GA4 property | `mcp__ga4-titan` or `null` |
| `ga4_property_id` | The GA4 property ID (numeric string) | `"524826894"` or `null` |
| `semrush_project` | The Semrush project domain | `titantinyhomes.ca` |
| `output_path` | Relative path for SEO deliverables | `projects/titan-tiny-homes/seo` |

### 2. Create folder structure

Run this to create the 8 required subfolders:

```bash
mkdir -p projects/<client-slug>/seo/{audits,keyword-research,content-plans,on-page,internal-linking,index-tracking,issue-tracker,tech-stack}
```

### 3. Add to chino-state.json

Add a new client entry to `.state/chino-state.json`:

```json
"<client-slug>": {
  "domain": "example.com",
  "lastAudit": null,
  "lastKeywordResearch": null,
  "lastContentPlan": null,
  "lastIndexCheck": null,
  "lastTechStack": null,
  "auditStreak": 0,
  "openIssues": 0,
  "issueCounter": 0,
  "runs": []
}
```

### 4. Run `/chino:launch-checklist <client>`

This validates the full setup by checking:
- CONTEXT.md has valid `seo:` block
- All 8 SEO subfolders exist
- Client entry exists in chino-state.json
- GSC property is accessible
- GA4 property is accessible (if configured)
- Semrush can pull data for the domain

Fix any issues flagged before running other /chino skills.

### 5. Add to AGENTS.md skill table

No additional rows needed for individual clients. The /chino skills resolve clients automatically from the `projects/<client>/CONTEXT.md` file.

## Current Clients

| Client Slug | Domain | Short Aliases |
|-------------|--------|---------------|
| `soo-sackers` | soosackers.com | `soo` |
| `titan-tiny-homes` | titantinyhomes.ca | `titan` |
| `fusion-financial` | fusionfinancialssm.com | `fusion` |
| `glv-marketing` | glvmarketing.ca | `glv` |

## Client Alias Resolution

Skills accept both full slugs and short aliases:

| Input | Resolves To |
|-------|-------------|
| `soo` | `soo-sackers` |
| `soo-sackers` | `soo-sackers` |
| `titan` | `titan-tiny-homes` |
| `titan-tiny-homes` | `titan-tiny-homes` |
| `fusion` | `fusion-financial` |
| `fusion-financial` | `fusion-financial` |
| `glv` | `glv-marketing` |
| `glv-marketing` | `glv-marketing` |
