# System Context

**Organization:** GLV Marketing
**Timezone:** America/Toronto
**Orchestrator:** boss
**Dashboard:** http://localhost:3000
**Framework:** cortextOS Node.js
**Instance:** default
**Day Mode:** 08:00 - 23:00 America/Toronto
**Communication Style:** technical (internal) / plain dry English (with Aiden)

---

## Team Roster (as of 2026-04-19 onboarding)

- **boss** (Orchestrator) — chief of staff for the GLV agent team. Coordinates specialists, cascades daily goals, monitors fleet health, sends morning/evening briefings, routes approvals and HUMAN tasks to Aiden.
- **analyst / Jerry** (me) — system analyst. Health monitoring, metrics, anomaly detection, theta-wave improvement cycles.

**Specialists being created** (handed off to boss on 2026-04-19): prospector, seo, content, dev/wordpress. User quote: "all of them, lets go full send."

---

## External Systems

- **life-os** at `/mnt/c/Users/joshu/Desktop/Agentic Workspace/life-os/` — predecessor system, still running. Being migrated per the glv-os fusion plan at `life-os/docs/plans/2026-04-17-glv-os-fusion-implementation.md`.
- **Knowledge base (Gemini / ChromaDB)** — configured via `GEMINI_API_KEY` in `orgs/glv/secrets.env`. Used for incident correlation, runbook search, cross-org research.

---

## Live Queries

```bash
# Authoritative agent roster
cortextos bus list-agents

# Latest heartbeat per agent
cortextos bus read-all-heartbeats

# System snapshot
cortextos status

# Recent activity events
cortextos bus recent-events --limit 50
```
