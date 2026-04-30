---
name: research
description: Protocol for gathering information, analyzing data, and synthesizing findings. Use when user asks to research a topic or needs information gathering.
---

# Research Skill

> Protocol for gathering information, analyzing data, and synthesizing findings.

## Trigger

- User asks to research a topic
- Task requires information gathering
- Meeting prep needs background
- Manual: "research [topic]" or "find out about [subject]"

---

## Research Depth Levels

### Quick (5-10 min)
- Basic facts and definitions
- Single source verification
- Surface-level overview

### Moderate (15-30 min)
- Multiple source cross-reference
- Key players and context
- Summary with sources

### Deep (30-60 min) - Default
- Comprehensive analysis
- Historical context
- Multiple perspectives
- Detailed source documentation
- Competitive landscape where relevant
- Local Northern Ontario context where applicable

---

## Research Protocol

1. **Clarify Scope**
   - What specific question(s) need answering?
   - What depth is appropriate?
   - What format for output?

2. **Gather Information**
   - Web search for current information
   - Use Semrush for SEO/competitive data
   - Use GSC for site performance data
   - Use GA4 for analytics insights
   - Check authoritative sources
   - Cross-reference multiple sources

3. **Synthesize Findings**
   - Summarize key points
   - Note conflicting information
   - Identify gaps
   - Draw actionable conclusions

4. **Deliver Results**
   - Clear summary
   - Sources cited
   - Recommended next steps
   - Flag anything that needs Aiden's judgement

---

## Output Format

### Quick Research

```
Research: [TOPIC]

Key Points:
- [Point 1]
- [Point 2]
- [Point 3]

Source: [URL or source name]
```

### Moderate Research

```
Research: [TOPIC]

Summary:
[2-3 sentence overview]

Key Findings:
1. [Finding with context]
2. [Finding with context]
3. [Finding with context]

Sources:
- [Source 1]
- [Source 2]

Notes:
[Any caveats or gaps]
```

### Deep Research

```
Research Report: [TOPIC]

Executive Summary:
[Paragraph overview]

Background:
[Context and history]

Key Findings:
[Detailed findings with evidence]

Analysis:
[Interpretation and implications]

Sources:
[Full citation list]

Recommendations:
[Suggested next steps]
```

---

## MCP Tools for Research

```yaml
seo_research:
  - Semrush: keyword research, backlink analysis, organic research, site audit
  - Google Search Console: search analytics, indexing status, quick wins
  - GA4: page views, user behaviour, events, active users

competitive_research:
  - Semrush: domain overview, competitor comparison
  - Google Search Console: performance benchmarking

local_research:
  - Focus on Northern Ontario market context
  - Canadian regulations and standards (CRA, HST, etc.)
  - Local business landscape
```

---

## Configuration

```yaml
research:
  default_depth: deep
  max_sources: 10
  always_cite: true
  local_context: true
  region: "Northern Ontario, Canada"

timeouts:
  quick: 10 min
  moderate: 30 min
  deep: 60 min
```

---

*Good research enables good decisions. Always cite sources and note uncertainties.*
