---
name: local-ai-canada
description: Research angles, vendor shortlist, and regulatory triggers for GLV's local-AI / Canadian-hosted AI service offering. Scout use only — prospector-specific outreach logic lives in prospector's skills.
---

# Local AI Canada — Scout Research Reference

## When to Use This Skill

Run this as a supplementary section on every ecosystem scan. Tag any finding as `priority:local-ai-canada` if it touches:
- Canadian data sovereignty / PIPEDA compliance
- On-premise or Canadian-hosted AI deployment
- PHIPA / health privacy + AI intersection
- Law firm AI governance
- Federal/provincial privacy reform

## Regulatory Watch Items

Check these on each scan for updates:
- **PIPEDA reform** — is a new federal privacy bill being tabled? Bill C-27 died Jan 2025 but may be reintroduced.
- **Ontario IPC guidance** — any new AI-specific advisories (last major: AI scribe PIA requirement, Feb 2026)
- **Alberta PIPA / Quebec Law 25** — provincial equivalents, may move faster than federal
- **SCIP program** (Sovereign AI Compute Infrastructure) — C$1B program, watch for vendor announcements or funding recipients

## Vendor Shortlist (for deeper research when needed)

| Vendor | Type | Status | Notes |
|---|---|---|---|
| Ollama | On-prem LLM runtime | v0.18.0 (Mar 2026) | 165k stars, zero egress, runs Llama/Mistral/Gemma locally |
| LM Studio | On-prem GUI | Active | Non-technical staff interface |
| Cohere | Canadian cloud LLM | Active | Toronto-founded, govt-piloted, SAP partnership |
| Canadian Web Hosting | Managed GPU infra | Active | Vancouver + Toronto DCs, runs Ollama in production |

When researching a vendor: check latest version, any new Canadian customer case studies, pricing changes, and whether they have PIPEDA/PHIPA compliance documentation available.

## Regulatory Trigger Phrases (for scan filtering)

Surface any article or release mentioning:
- "Canadian data residency"
- "PIPEDA AI" / "CPPA AI"
- "PHIPA AI" / "AI scribe Ontario"
- "sovereign AI Canada"
- "on-premise LLM" in Canadian context
- "CLOUD Act exposure Canada"
- "local AI law firm" / "local AI clinic"

## Scan Output Format

When findings are relevant to this vertical, include a dedicated section in the #internal-dev digest.

**Tagging:** Add `local-ai-update` to any finding that is a Canadian-hosted AI vendor news item or a regulatory update (PIPEDA, PHIPA, provincial equivalents, SCIP). Boss uses this tag to route to: user learning, prospector pipeline, or content pillar.

```
LOCAL AI / PIPEDA (GLV service offering)
- [finding]: [1-line summary] | relevance: [law/medical/financial/all] | tag: local-ai-update
- Vendor update: [name] [version/news] | tag: local-ai-update
- Regulatory: [any new guidance or bills] | tag: local-ai-update
```

## KB Query for Prospector Context

Before messaging prospector about a local-AI candidate, query KB first:
```bash
cortextos bus kb-query "PIPEDA local AI Canadian deployment" --org glv --scope shared
```
The shared-glv KB has the full regulatory brief ingested (Apr 20, 2026). Prospector can pull it for pitch framing.
