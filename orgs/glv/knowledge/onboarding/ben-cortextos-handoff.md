# Ben → cortextOS handoff doc

**Purpose:** Get Ben's future boss-agent running on his own rig with the same system design Aiden is running today.

**Audience:** Ben's orchestrator-agent (future). This doc gets read at first boot so the agent understands the GLV Marketing operating model + how to replicate it.

**Status:** Draft — scaffold only. Fill in each `[TODO]` as Ben's rig comes online and we learn what diverges.

---

## 1. What you're inheriting

You are the orchestrator / chief-of-staff for Ben's half of GLV Marketing. Aiden's side runs the mirror of this system from Sault Ste. Marie, ON; you run yours from [TODO: Ben's city]. The two sides are peers — not parent/child. You coordinate your fleet + Ben's workstreams; Aiden's boss-agent coordinates his. You speak to Aiden's side via agent messages (`cortextos bus send-message`) when cross-coordination is needed.

**End-state division of labor** (per memory `project_ben_partner_authority`):
- Aiden: Canada operations, design ownership, client comms in ON/Soo
- Ben: USA operations, code-owner authority, ships code autonomously
- Shared: product direction, client roadmap, revenue goals

---

## 2. System design — what cortextOS is doing under the hood

**Stack:**
- cortextOS daemon: Node/TypeScript, runs 24/7 via systemd/launchd, auto-restarts on crash
- Dashboard: Next.js 14 at glv.marketing (via Cloudflare Tunnel for prod; localhost for dev)
- Communication bus: SQLite events table, agent↔agent messages + Telegram fast-checker daemon
- Memory: 3 layers (daily `memory/YYYY-MM-DD.md` + long-term `MEMORY.md` + auto-memory in `~/.claude/projects/...`)
- Knowledge base: `cortextos bus kb-query` / `kb-ingest` for RAG over org docs

**Fleet topology** (current):
- **boss** (you / orchestrator): coordinates, doesn't do specialist work
- **dev**: client-site engineering (only WP site = reyco-marine; rest React/Vite/Supabase on CF Pages)
- **designer**: visual QC, CDP browser sessions, logo / page-render review
- **seo**: on-page SEO, schema markup, tag taxonomy, GSC analysis
- **content**: blog drafts, social carousels/reels, brand voice
- **prospector**: cold outreach at 50 emails/day target (Canada-wide TAM)
- **scout**: ecosystem scan, trend surface, last30days skill
- **imagegen**: product image pipeline, CDP-based scrape, dealer-source verification
- **pentester**: security testing, credential hygiene, Convention-vs-Control ledger
- **analyst**: system-improvement theta-wave cycles, experiment tracking
- [TODO: does Ben spawn new agents, or replicate Aiden's fleet 1:1? lean = replicate + add Ben-specific]

**Critical infrastructure rules:**
- Never self-restart without user direction (memory: `feedback_no_autonomous_self_restart`)
- All spending AND all client deliverables require user approval before send (memory: `feedback_approvals`)
- Dev works on new branches; main auto-deploys to SiteGround prod via GHA (client repos)
- Pentester vets all credential asks before they reach user (memory: `feedback_credentials_routing`)

---

## 3. How the orchestrator actually operates

**Every heartbeat cycle** (4-hourly cron):
1. Read all fleet heartbeats (`cortextos bus read-all-heartbeats`)
2. Check inbox (`cortextos bus check-inbox`)
3. Update own heartbeat (`cortextos bus update-heartbeat "status"`)
4. Log KPI events for any coordination actions taken
5. Write to daily memory file

**Daily cadence:**
- Morning review (8 AM): goal cascade to fleet, AM brief to user, decision queue
- Evening review (11 PM): end-of-day synthesis, overnight task plan
- Weekly review (Sunday 8 AM): fleet metrics, next-week planning

**Communication patterns:**
- User ↔ boss: Telegram (BOT_TOKEN + CHAT_ID in `.env`)
- Agent ↔ agent: `cortextos bus send-message <agent> <priority> '<msg>' [reply_to]`
- Fleet updates paper trail: Slack `#internal-*` channels (one per agent or per client, per memory `feedback_slack_channel_scope_by_client_not_agent`)
- Client channels: `#c-<client>` — DO NOT post without explicit user authorization

**Decision routing:**
- Agent wants user-gated action → boss routes to user via Telegram with context + approval ask
- Never self-approve (memory: `feedback_no_agent_self_approve`)
- Credentials ask: dev → boss → pentester → user (never dev-direct)
- Client-facing deliverable: agent → user approval → user sends (for Reyco, user handles Casey comms directly; Jak deprecated)

---

## 4. What's live right now in GLV Marketing (as of 2026-04-23)

> This section is a time-stamped snapshot. If the date is more than 30 days old when you read this, treat it as historical and pull current state from: `orgs/glv/goals.json` (bottleneck field), `cortextos bus list-tasks --status in_progress`, `cortextos bus read-all-heartbeats`.

### Active clients

**Paying:**
- **BNS** — Aiden's day job, $6K/mo. Not a GLV retainer. Target is to replace this income with GLV client retainers so Aiden exits the day job.
- **Reyco Marine** (Casey Cryderman, owner) — Sault Ste. Marie marine/powersports dealer. $5K launch fee + $2K/mo SEO retainer starting May 2026. Launching Sun Apr 26. Channel: `#c-reyco-marine` (C0APQEXEL4V). User-owned Casey comms (Jak deprecated — see memory `project_jak_casey_routing`). Stack: WordPress 6.7 + WooCommerce + SiteGround (ONLY WP site in the fleet — see memory `project_glv_fleet_stack_map`).

**Non-paying, in-flight:**
- **Fusion Financial** — Meta ads engagement, ads agent owns.
- **Titan Tiny Homes** — Meta campaign build in progress (blocked on Meta BM + pixel per ads heartbeat).
- **Soosackers** — GSC canonical issues, dev-owned.
- **GLV Marketing own site** (glvmarketing-audit/) — React/Vite/Supabase on Cloudflare Pages. Positioning: "just landed first client" (memory `project_glvbuilds_positioning`).

### Revenue targets

- **North Star:** replace BNS income ($6K/mo) with GLV retainer book.
- **Top 3 goals** (from `orgs/glv/goals.json`):
  1. Ship glv-os MVP by Apr 20 ✓ — boss + analyst running 24/7, specialist spawn pattern proven.
  2. Reyco Marine SEO retainer active May 2026 — first $2K/mo invoice.
  3. Sign 2 new retainer clients by end Q3 2026 (~$2K/mo each, Canada-wide TAM per memory `project_prospecting_national_tam`).

### Current launch critical path (Reyco, Sun Apr 26)

As of 2026-04-23 23:52 EDT (T-3):
- **Product images:** 125 missing + 20 source-confirm across 13 brands (Mercury 50, Toro 23, R&J 15, Cub Cadet 10, Trailer 10, Cannon 5, Easy Hauler 4, Princecraft 4, Humminbird 3, Minnkota 1, source-confirm Hisun 16, Echo 3, Cub Cadet UTV 1). Casey-sourced only — AI generation abandoned (memory `feedback_image_generation_is_last_resort`).
- **Product tagging:** 4-tag taxonomy v2 landed (main_category / subcategory / brand / product_name). 205/205 mapped, 3 systemic ambiguities flagged.
- **Schema markup:** LocalBusiness + AboutPage/Person templates built, gated on Casey Fri EOD confirms (hours + social links + author bios).
- **Author bios:** Casey/Tyler/Aaron — templates drafted, bios pending Casey confirm.
- **Pricing sweep (T-3 blocker):** 250 SKUs, dev authorized by user override (23:52 EDT) to use WP admin creds for read-only export.
- **SEO metas:** 250 descriptions regenerated (avg 142 char, max 158), user-approved 23:52 EDT, awaiting WC REST key for batched write.
- **Prospector v6 batch 1:** ~14 emails staged with verify-claims hooks, approval filed 23:11 EDT.

### Live state snapshots

Always query these directly instead of trusting this section:

```bash
# Current bottleneck
jq -r '.bottleneck' orgs/glv/goals.json

# Fleet status
cortextos bus read-all-heartbeats

# Work in flight
cortextos bus list-tasks --status in_progress
cortextos bus list-tasks --status pending

# Approvals pending from user
cortextos bus list-approvals --format json
```

[TODO: Ben's boss should set up own goals.json pointer in its first cron batch]

---

## 5. Memory-first protocol

The user's auto-memory lives at `~/.claude/projects/-home-aiden-cortextos/memory/`. **Your equivalent will be a different path** on Ben's rig. You must:

1. Read `MEMORY.md` index at every boot
2. Follow memory pointers to the specific `.md` files when relevant context surfaces
3. WRITE new memories as you learn them (user preferences, feedback, project facts, references)
4. NEVER duplicate memories — update existing before writing new
5. Treat memory entries that name specific files/functions/flags as historical claims — verify with current state before recommending

Key memory categories (same as Aiden's):
- `user_*`: who Ben is, his role, how he thinks
- `feedback_*`: corrections and validations from Ben
- `project_*`: in-flight work, constraints, stakeholder context
- `reference_*`: pointers to external systems (Linear, Slack channels, dashboards)

**At first boot:** read Aiden's memory files for org-level context (GLV state, client details, tech stack). Ben-specific memories start empty and grow organically.

---

## 6. Where to find everything

### Repo layout

| What | Path |
|---|---|
| This doc | `orgs/glv/knowledge/onboarding/ben-cortextos-handoff.md` |
| Org knowledge base | `orgs/glv/knowledge.md` |
| Org goals (bottleneck + top 3) | `orgs/glv/goals.json` |
| Client repos | `orgs/glv/clients/<name>/` (reyco/, fusion/, titan/, soo/, glvmarketing-audit/) |
| Client deliverables staging | `orgs/glv/clients/<name>/deliverables/` |
| Client audit + evidence | `orgs/glv/clients/<name>/audit/` |
| Agent configs | `orgs/glv/agents/<name>/` |
| Per-agent skills | `orgs/glv/agents/<name>/.claude/skills/<skill-name>/SKILL.md` |
| Agent goals.json | `orgs/glv/agents/<name>/goals.json` |
| Agent bootstrap files | `orgs/glv/agents/<name>/{IDENTITY,SOUL,GUARDRAILS,GOALS,HEARTBEAT,MEMORY,USER,TOOLS,SYSTEM}.md` |
| Agent daily memory | `orgs/glv/agents/<name>/memory/YYYY-MM-DD.md` |
| Agent long-term memory | `orgs/glv/agents/<name>/MEMORY.md` |
| Shared onboarding scaffold | `orgs/glv/knowledge/onboarding/` |
| Templates (for spawning new agents) | `templates/agent/`, `templates/orchestrator/`, `templates/analyst/` |
| Dashboard (Next.js 14) | `dashboard/` |

### Logs + state (outside repo)

| What | Path |
|---|---|
| Agent activity log | `~/.cortextos/$CTX_INSTANCE_ID/logs/<agent>/activity.log` |
| Agent outbound (diagnose silence) | `~/.cortextos/$CTX_INSTANCE_ID/logs/<agent>/outbound-messages.jsonl` |
| Fast-checker (Telegram) | `~/.cortextos/$CTX_INSTANCE_ID/logs/<agent>/fast-checker.log` |
| Stdout/stderr | `~/.cortextos/$CTX_INSTANCE_ID/logs/<agent>/{stdout,stderr}.log` |
| User auto-memory (Aiden) | `~/.claude/projects/-home-aiden-cortextos/memory/` |
| Ben's user auto-memory | `~/.claude/projects/-home-ben-cortextos/memory/` (or wherever Ben's `$HOME` lands) |
| cortextOS bus DB | `~/.cortextos/$CTX_INSTANCE_ID/bus.db` (SQLite) |

### Running services

| What | Where |
|---|---|
| Dashboard | `glv.marketing` (Cloudflare Tunnel from Aiden's WSL box; shared, not per-rig) |
| Internal Slack workspace | grandlakevillage.slack.com |
| Client Slack channels | `#c-reyco-marine` (C0APQEXEL4V), `#c-fusion-financial` (C0AQ6RG4933), `#c-titan-tiny-homes` (C0APCF5S1HD) — NEVER post without explicit user authorization |
| Internal Slack channels | `#all-glv-marketing`, `#internal-reyco`, `#internal-dev`, `#internal-seo`, `#internal-ops`, `#internal-sales`, `#internal-agents`, `#overnight-proposals`, `#glv-life-os` |
| Dashboard domain | `glv.marketing` (memory `project_dashboard_domain`) |

### Credentials + secrets

| What | Where |
|---|---|
| GLV service account (Google Workspace) | `/mnt/c/Users/joshu/.claude/credentials/google-service-account.json` (Aiden's rig; Ben will have own path) |
| Share email for Google Docs | `glv-claude@root-bank-487505-e4.iam.gserviceaccount.com` |
| Credential routing protocol | dev → boss → pentester → user (memory `feedback_credentials_routing`) |
| Pentester authority | vets credential asks before they reach user (can be overridden by user on launch-urgency grounds — see Ledger case #3) |

---

## 7. Replication checklist (when Ben's rig boots)

### Phase A — cortextOS install + first boot

```bash
# 1. Clone + build
git clone https://github.com/grandamenium/cortextos.git
cd cortextos
npm install
npm run build
npm test  # must pass clean before proceeding

# 2. Verify CLI
cortextos --version
cortextos bus --help  # sanity-check bus subcommands wired
```

### Phase B — Org config

```bash
# 3. Pull Aiden's org config (NO agent state — memory/, state/, .db artifacts)
# Easiest: Ben clones cortextos fork that includes orgs/glv/ already checked in
# Then strip any Aiden-specific state:
rm -rf orgs/glv/agents/*/memory/         # regenerate Ben's own daily memory
rm -rf orgs/glv/agents/*/state/          # fresh state
rm -rf orgs/glv/agents/*/MEMORY.md       # regenerate MEMORY index on first session

# Shared (do NOT strip):
# - orgs/glv/knowledge/ (org-wide knowledge)
# - orgs/glv/clients/ (shared client files — both rigs can read)
# - orgs/glv/agents/*/CLAUDE.md (agent definitions)
# - orgs/glv/agents/*/.claude/skills/ (skill definitions)
```

### Phase C — Boss-agent bot setup (Ben's boss only; other agents come later)

```bash
# 4. @BotFather flow (done in Telegram by Ben):
#    - /newbot → name it (e.g. @Ben_GLV_Boss_bot)
#    - BotFather returns TOKEN
#
# 5. Ben sends /start to his new bot, then any message, then extracts chat_id:
curl -s "https://api.telegram.org/bot<TOKEN>/getUpdates?timeout=30" \
  | jq '.result[-1].message.chat.id'

# 6. Wire .env at orgs/glv/agents/boss/.env
cat > orgs/glv/agents/boss/.env <<EOF2
BOT_TOKEN=<from @BotFather>
CHAT_ID=<from step 5>
ALLOWED_USER=<Ben's Telegram user_id>
EOF2
```

### Phase D — First onboarding session

```bash
# 7. Start boss agent:
cortextos start boss

# 8. Ben sends first Telegram msg — agent will see NEEDS_ONBOARDING marker
#    In Telegram: /onboarding
#    Agent walks through identity + goals + memory setup.

# 9. Agent cascades goals from orgs/glv/goals.json (existing Aiden content)
#    Ben decides: cascade as-is, or edit for Ben-side scope first?
```

### Phase E — Cross-rig wiring (Aiden ↔ Ben)

```bash
# 10. Test agent-to-agent from Ben's boss to Aiden's boss:
cortextos bus send-message boss normal 'hello from ben-rig' --target-instance aiden

# 11. Reverse direction test: Aiden's boss sends test message, Ben confirms receipt.
# 12. Dashboard access: glv.marketing resolves for Ben (shared via CF Tunnel).
```

### Phase F — Cron bundle (8 crons)

In the first `/loop` session, set up these 8 crons (persisted to `config.json` on first session end):

| Cron | Interval | Skill invoked |
|---|---|---|
| heartbeat | 4h | HEARTBEAT.md |
| check-approvals | 2h | approvals/SKILL.md |
| morning-review | 08:00 daily | morning-review/SKILL.md |
| evening-review | 23:00 daily | evening-review/SKILL.md |
| weekly-review | 08:00 Sun | weekly-review/SKILL.md |
| slack-internal-digest | 30m | (inline digest prompt) |
| slack-client-digest | 4h | (inline digest prompt) |
| ben-transcripts-digest | 08:05 daily | (inline — Ben side may not need this; Aiden uses it for Ben meeting transcripts) |

### Phase G — Specialist fleet (spawn as work demands)

Don't spawn all 10 specialists on day 1. Order of spawn (same as Aiden did):
1. analyst — self-improvement + experiment tracking
2. dev — client-site engineering
3. seo, content — once a client deliverable needs them
4. prospector — once outreach pipeline is primed
5. scout, imagegen, designer, pentester — as-needed

Use: `cortextos add-agent <name> --template agent` (or `--template orchestrator` / `analyst`).

### Phase H — Cross-rig routing (to be decided by Ben + Aiden)

Open questions (see section 8):
- Which clients route to Ben's side vs Aiden's?
- Do Ben's specialists read/write the same `orgs/glv/clients/` directory, or mirror?
- Rollover rules if one rig is offline?

Don't hard-code these before Ben+Aiden align.

---

## 8. Open questions for Ben (to answer at onboarding)

[TODO: populate these as Ben + Aiden decide]
- Which clients route to Ben's side vs Aiden's?
- Are agents 1:1 replicas or Ben-specific variants?
- Cross-rig authority: who breaks ties if Aiden-boss and Ben-boss disagree on a dispatch?
- Dashboard + state: shared single-instance, or per-rig with sync?
- On-call rotation: who handles Telegram user-asks when the other is asleep?

---

**Last updated:** 2026-04-23 (scaffold)
**Owner:** Aiden's boss-agent (will hand off to Ben's boss-agent at first boot)
