---
name: chino
description: SEO Brain — 10-skill system for automated SEO audits, keyword research, content planning, and optimization across all GLV clients. Trigger with /chino:<skill> <client>.
---

# Chino — SEO Subagent System

> The SEO Brain for GLV Marketing. 10 modular skills covering the full 6-level SEO framework.

## Usage

`/chino:<skill> <client> [options]`

## Available Skills

| Skill | Command | Purpose | Frequency |
|-------|---------|---------|-----------|
| audit | `/chino:audit <client>` | Weekly site health audit | Weekly |
| keyword-research | `/chino:keyword-research <client> <topic>` | 5-step keyword research | As needed |
| content-plan | `/chino:content-plan <client>` | Siloed content calendar | Monthly |
| on-page | `/chino:on-page <client> <url>` | Group A-D page optimization | As needed |
| internal-linking | `/chino:internal-linking <client>` | Internal link audit | Monthly |
| index-check | `/chino:index-check <client>` | Indexation health check | Weekly |
| tech-stack | `/chino:tech-stack <client>` | Technical stack snapshot | Quarterly |
| competitor | `/chino:competitor <client>` | Competitor analysis | Monthly |
| ai-visibility | `/chino:ai-visibility <client>` | AI bot crawl + referral tracking | Monthly |
| launch-checklist | `/chino:launch-checklist <client>` | New client SEO readiness | On onboarding |
| directory-drip | `/chino:directory-drip <client>` | Daily citation builder (1-2/day) | Daily |
| nap-audit | `/chino:nap-audit <client>` | NAP consistency checker | Monthly |
| social-signals | `/chino:social-signals <client>` | Social proof builder (Reddit, LinkedIn, hubs) | Monthly |

## Client Resolution

Every skill reads `projects/<client>/CONTEXT.md` for the `seo:` config block.
Valid client slugs: `soo`, `soo-sackers`, `titan`, `titan-tiny-homes`, `fusion`, `fusion-financial`, `glv`, `glv-marketing`, `reyco`, `reyco-marine`.

Aliases: soo → soo-sackers, titan → titan-tiny-homes, fusion → fusion-financial, glv → glv-marketing, reyco → reyco-marine.

### Client Resolution Logic

When a skill receives a `<client>` parameter:

1. Normalize the input using the alias map:
   - `soo` → `soo-sackers`
   - `titan` → `titan-tiny-homes`
   - `fusion` → `fusion-financial`
   - `glv` → `glv-marketing`
   - `reyco` → `reyco-marine`
   - Full slugs pass through unchanged
2. Read `projects/<resolved-slug>/CONTEXT.md`
3. Extract the `seo:` YAML block for domain, GSC property, GA4 MCP server, etc.
4. If the `seo:` block is missing, fail with a clear error and link to the client config guide

**Onboard integration:** New clients added via `/onboard:scaffold` automatically create a valid CONTEXT.md with the `seo:` block, making them immediately usable with all chino skills. The onboard pipeline runs chino skills (launch-checklist, keyword-research, content-plan) as part of Stage 3.

## Research Integration (Optional)

All chino sub-skills check for onboard research at `projects/<client>/research/`. If research pillars exist (from the `/onboard` pipeline), skills read them and produce richer, research-informed output. If research doesn't exist (e.g., clients not onboarded through the pipeline, or legacy clients), all skills work exactly as before. Research is additive, not required. Each sub-skill documents which specific pillars it reads and how they enhance its output.

## Knowledge Base

Skills reference these shared documents (DO NOT duplicate this content into individual skills):
- `references/6-level-framework.md` — The 6-level nested URL framework
- `references/routine-audit-sop.md` — Weekly audit SOP
- `references/client-config-guide.md` — Client onboarding guide
- `references/modern-seo-philosophy.md` — Ben Pelta's modern SEO philosophy (entity-first, PR > keywords, social proof)

## Philosophy Override

All chino sub-skills operate under the Modern SEO Philosophy (`references/modern-seo-philosophy.md`). Key implications:

- **audit**: Flag missing social signals, NAP inconsistencies, and above-the-fold waste alongside technical issues
- **keyword-research**: Include "super-intent" keywords (finance, apply, order) even at 0 search volume. Note sub-funnel position (top/mid/bottom of BOFU)
- **content-plan**: Every content piece must have a named author from the business. No generic "10 things" framing.
- **on-page**: Check above-the-fold content density. Flag hero banners with no text. Check nav ordering (About Us first for local).
- **competitor**: Analyse competitor social signals and directory presence, not just keywords
- **launch-checklist**: Add NAP verification, social profile creation, and directory drip plan as launch requirements

## State Tracking

All runs update `.state/chino-state.json` with timestamps and issue counts.

After each skill run, update the relevant fields:
```json
{
  "lastAudit": "2026-02-27",
  "auditStreak": 1,
  "openIssues": 3,
  "runs": [
    {
      "skill": "audit",
      "date": "2026-02-27",
      "status": "complete",
      "issues_found": 3,
      "data_sources": ["gsc", "ga4", "semrush"]
    }
  ]
}
```

## Graceful Degradation

If an MCP tool fails (Semrush auth, GA4 permission denied, Sheets unavailable):
1. Complete the skill with whatever data IS available
2. Flag the missing data source in the output with a warning
3. Log the failure in chino-state.json
4. Do NOT fail the entire skill run

### Data Source Priority
1. **GSC** — Always available, primary data source
2. **GA4** — Available for Titan, Fusion, GLV (NOT Soo Sackers)
3. **Semrush** — Available when MCP is configured and auth works
4. **WebFetch** — Fallback for tech stack analysis, always available

## Output Convention

All outputs saved to: `projects/<client>/seo/<skill-type>/YYYY-MM-DD-<skill-type>.md`

Example paths:
- `projects/titan-tiny-homes/seo/audits/2026-02-27-audit.md`
- `projects/fusion-financial/seo/keyword-research/2026-02-27-bookkeeping-keywords.md`
- `projects/glv-marketing/seo/tech-stack/2026-02-27-tech-stack.md`

## Autonomy Boundaries

| Action | Level |
|--------|-------|
| Pull GSC/GA4/Semrush data | agent-autonomous |
| Generate audit/analysis reports | agent-autonomous |
| WebFetch client sites for analysis | agent-autonomous |
| Create/update files in projects/*/seo/ | agent-autonomous |
| Update .state/chino-state.json | agent-autonomous |
| Send reports to clients | user (Aiden sends) |
| Make changes to client websites | user (Aiden executes) |
| Modify client CONTEXT.md | agent-support |

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Embed framework content in individual skills | Reference `references/6-level-framework.md` |
| Skip client resolution | Always read CONTEXT.md for seo: config |
| Fail entirely if one MCP is down | Complete with available data, flag missing |
| Overwrite previous reports | Use dated filenames (YYYY-MM-DD) |
| Run skills without updating state | Always update chino-state.json after runs |
| Hardcode client domains or property IDs | Read from CONTEXT.md every time |
