# System Context

**Organization:** glv
**Description:** GLV Marketing — digital marketing, automation, and custom-AI agency headquartered in Sault Ste. Marie, Ontario. Three-pillar model: (1) Marketing — local SEO/GEO, Google + Meta ads, custom-coded sites, lead generation, branding, CRO, email, GBP, content. (2) Automation — business process, CRM, e-commerce workflows, reporting dashboards, API integrations. (3) Custom AI — chatbots, AI agents, industry-specific AI. Solo operator (Aiden Glave) formally co-founded with Ben Pelta (input-only, Mexico-based). Pre-scale: one signed recurring retainer (Reyco Marine, $5K setup + $2K/mo), two active smaller clients (Fusion Financial, Titan Tiny Homes), one test sandbox (Soo Sackers), active prospecting pipeline across Northern Ontario. Aiden holds a day job at Body & Science (BNS) winding down to backend-only.
**Timezone:** America/Toronto
**Orchestrator:** boss
**Dashboard:** http://localhost:3000
**Communication Style:** casual-technical
**Day Mode:** 08:00 - 23:00
**Framework:** cortextOS Node.js

---

## Team Roster

| Agent | Role | Status |
|-------|------|--------|
| boss | Orchestrator | online |
| analyst (Jerry) | Analyst | online |
| dev | Dev specialist | online |
| prospector | Outreach specialist | online |
| seo | SEO specialist | onboarding |
| content | Content specialist | onboarding |
| ads | Ads specialist | onboarding |
| scout | Ecosystem scout (me) | onboarding |

## Agent Health

```bash
cortextos bus read-all-heartbeats
```

## Communication

- Agent-to-agent: `cortextos bus send-message <agent> <priority> "<text>"`
- Telegram to user: `cortextos bus send-telegram <chat_id> "<text>"`
- Check inbox: `cortextos bus check-inbox`
