# Mission Control → cortextOS Dashboard Port Audit
_Authored: dev agent — 2026-04-20 overnight_
_Directive: Plan-only. No code until morning brief approval._
_Schema verified 2026-04-20: leads and content_items tables MISSING from db.ts — flagged as P0 dependencies._

---

## A. Mission Control Feature Inventory

**Stack:** React 19 + Vite + TypeScript + Tailwind 4 + React Router v7 + React Query + Supabase (Postgres + Realtime + Auth)
**Auth:** Supabase email/password, JWT with `user_role` claim (`admin` / `client` / `client_readonly`). Admin → full dashboard; clients → `/portal` only.
**Realtime:** Supabase Realtime channels invalidate React Query keys on table changes.

### Admin Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | **HubPage** | Central dashboard aggregating all clients. KPI row (active clients, clicks, impressions, tasks, leads, content), client card grid, multi-client trend chart (Recharts), alert panel, activity timeline, Telegram command queue, goal tracker, activity heatmap. Realtime subscriptions to 8+ tables. |
| `/login` | **LoginPage** | Supabase email/password login. Routes admin to `/`, clients to `/portal`. |
| `/analytics/:client` | **AnalyticsPage** | Per-client deep analytics: GSC (clicks, impressions, CTR, position, top queries/pages), GA4 (users, sessions, pageviews, 30-day trend), Semrush (domain health, authority, backlinks), Meta Ads (campaigns, spend, ROAS). YoY comparison. PDF report download via @react-pdf/renderer. |
| `/leads` | **LeadsPage** | Full CRM pipeline. 7-stage Kanban (scouted → researched → contacted → responded → meeting → client → lost) with @dnd-kit drag-drop. KPI row (total leads, new this month, contacted, meetings, conversion rate). Status breakdown pills. |
| `/leads/map` | **ProspectingMapPage** | Geospatial lead visualization. react-simple-maps SVG map with clickable regions. Leads plotted by area/province/niche with sidebar legend. Stat cards: total leads, areas covered, niches tracked. |
| `/tasks` | **TasksPage** | Team task Kanban (inbox → todo → in_progress → done → archived). Stat badges with overdue counter. Create task modal (title, description, project, priority, assignee, due_date). @dnd-kit drag-drop. |
| `/content` | **ContentPage** | Content calendar for all clients (blog, social, email, GBP). Month-grid view color-coded by client. Multi-client filter toggle. Publishing stats (velocity, types). Content queue with next publish dates. |
| `/revenue` | **RevenuePage** | Financial KPIs (total revenue, MRR, ARR, avg contract value). Monthly revenue trend chart. Per-client revenue cards. Profitability table (margin %, profit per client). |
| `/finances` | **FinancesPage** | Full financial tracking: invoices (draft → sent → paid/overdue/void), time entries by category (seo/content/ads/dev/consulting/admin/internal) with billable flag, expenses by category, scope tracker (deliverables owed vs. delivered), client profitability table, utilization rate. |
| `/alerts` | **AlertsPage** | Two-tab monitoring center. Alert list with severity filters (critical/warning/info), status filters (active/read/dismissed), per-alert actions (mark-read, snooze 24h, dismiss). Alert rules table with metric/operator/threshold/cooldown, ON/OFF toggle. `evaluate_alert_rules` RPC button. Realtime. |
| `/approvals` | **ApprovalsPage** | Approval workflow for significant actions (content publish, client changes, financial). List of pending approvals with payload preview. Approve / reject / request more info actions with reviewer notes. |
| `/inbox` | **InboxPage** | Gmail-integrated email alert inbox. Emails from `email_alerts` table (synced by backend). Grouped by category. Mark read / archive / action. |
| `/commands` | **CommandsPage** | Telegram bot command queue. Chronological list with status (pending/running/completed/error), result/error message. Realtime subscription to `command_queue`. |
| `/system` | **SystemPage** | Five tabs: MCP Servers (integration health, usage counts), Skills (enable/disable with metrics), Schedule (cron jobs, next run, success rate), Data (source freshness/lag), Sessions (active Claude Code sessions with token usage + daily cost chart). |
| `/agents` | **AgentsPage** | Agent session monitoring. Left panel: active session cards (agent_name, status, start time, summary). Right panel: event feed (session_start/task_start/task_complete/error/heartbeat) with color-coded timeline. Realtime. |

### Client Portal Routes (`/portal/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/portal` | **ClientDashboard** | Client-facing overview. Personalized welcome, performance KPIs with YoY comparison, recent updates from agency, "What We're Working On" summary. |
| `/portal/analytics` | **ClientAnalyticsPage** | Simplified read-only analytics (4 KPIs, 30-day trend, top 5 keywords). No drill-down, no comparison. |
| `/portal/reports` | **ClientReportsPage** | Monthly/quarterly PDF reports from agency. Download links. |
| `/portal/updates` | **ClientUpdatesPage** | Timeline of project milestones and deliverables. Pinned updates float to top. |
| `/portal/settings` | **ClientSettingsPage** | Client account info (org name, email) and agency support contacts. |

---

## B. cortextOS Dashboard Current State

**Stack:** Next.js 14 App Router + TypeScript + Tailwind + SQLite (better-sqlite3) via `/lib/db.ts`
**Auth:** NextAuth.js (email/password, custom credentials). Single admin tier — no client-facing portal.
**Realtime:** SSE via `/api/events/stream`. No table-level subscriptions.

### Pages Already Built

| Route | Page | Status |
|-------|------|--------|
| `/` | **Overview** | ✅ Built — agent health grid, metric cards, action required, live activity feed, today's progress, current focus |
| `/agents` | **Agents** | ✅ Built — agent roster with health/current task; detail page with identity/soul/goals/memory/logs |
| `/tasks` | **Tasks** | ✅ Built — Kanban + list view, drag-drop, filters, create/edit dialogs |
| `/activity` | **Activity** | ✅ Built — chronological event log with search + agent/type filters |
| `/approvals` | **Approvals** | ✅ Built — human tasks + pending approvals + history; approve/reject with notes |
| `/analytics` | **Analytics** | ✅ Built — fleet health, task throughput (30d), agent effectiveness, cost tracking, goal progress |
| `/clients` | **Clients** | ✅ Built — pipeline stages, MRR, deliverables progress, blockers, recent activity per client |
| `/comms` | **Comms** | ✅ Built — org-wide message feed + per-agent-pair conversation history |
| `/knowledge-base` | **Knowledge Base** | ✅ Built — markdown editor + full-text search + RAG |
| `/skills` | **Skills** | ✅ Built — skill catalog grid |
| `/settings` | **Settings** | ✅ Built — org config, Telegram, system env, users, appearance |
| `/strategy` | **Strategy** | ✅ Built — goals list + bottleneck editor + history timeline |
| `/outreach` | **Outreach** | ✅ Built — email pipeline stats (sent/replies/meetings/reply_rate), city/industry summary, email log |
| `/experiments` | **Experiments** | ✅ Built — autoresearch cycle tracking per agent |
| `/workflows` | **Workflows** | ✅ Built — cron management per agent (add/edit/delete) |
| `/(auth)/login` | **Login** | ✅ Built |

### SQLite Tables Available

`tasks`, `approvals`, `events`, `heartbeats`, `cost_entries`, `users`, `messages`, `sync_meta`, `clients`, `rate_limits`

---

## C. Gap Matrix

| Mission Control Feature | cortextOS Equivalent | Gap | Port Effort | Data Dependencies |
|------------------------|---------------------|-----|-------------|-------------------|
| **HubPage** (multi-client KPI hub) | Overview (agent-focused) | Partial — cortextOS Overview is agent health, not client marketing KPIs | S | clients table exists; add marketing KPI aggregation |
| **LeadsPage** (7-stage Kanban CRM) | Outreach page (stats only) | **Full gap** — no visual pipeline, no drag-drop stages | M | ⚠️ `leads` table **MISSING** from db.ts — must add to init block. Outreach events in `events` table are a seeding candidate (email_sent events have business_name/city in data JSON). |
| **ProspectingMapPage** | None | **Full gap** | L | leads table with city/province; react-simple-maps package |
| **AnalyticsPage** (per-client GSC/GA4) | Analytics (fleet/agent-focused) | **Full gap** — cortextOS Analytics tracks agent cost/throughput, not client SEO | L | External API integrations (GSC, GA4, Semrush); or populate from SEO agent KB |
| **ContentPage** (content calendar) | None (sidebar stub) | **Full gap** | M | ⚠️ `content_items` table **MISSING** from db.ts — must add to init block. No seeding path exists yet. |
| **RevenuePage** | Clients page (has MRR) | Partial — Clients page shows MRR per client, no trend/ARR/profitability | M | New `invoices` table; MRR already in clients |
| **FinancesPage** (full P&L) | None | **Full gap** | L | New `invoices`, `time_entries`, `expenses` tables |
| **AlertsPage** (rules + history) | None | **Full gap** — cortextOS has no alert engine | M | New `alerts` + `alert_rules` tables; alert eval runs on bus events |
| **ApprovalsPage** | Approvals | ✅ **Covered** — comparable feature already exists | — | — |
| **InboxPage** (Gmail) | Comms (agent messages only) | **Full gap** — no email integration | L | Gmail API backend + `email_alerts` table |
| **CommandsPage** (Telegram queue) | Activity feed (partial) | Partial — Telegram commands appear in events but no dedicated view | S | Filter events where category='telegram' or add `command_queue` table |
| **SystemPage** (MCP/skills/sessions) | Analytics (cost) + Settings | Partial — cost tracking exists; MCP/skill health not surfaced | S | `system_status` table; already have heartbeats + cost_entries |
| **AgentsPage** | Agents | ✅ **Covered** — comparable feature; cortextOS has more agent detail | — | — |
| **TasksPage** | Tasks | ✅ **Covered** — comparable feature | — | — |
| **Client Portal** (/portal/*) | None | **Full gap** — no client-facing tier | L | New auth role; client_reports + client_updates tables; separate layout |
| **LoginPage** | Login | ✅ **Covered** | — | — |

---

## D. Recommended Port Order

### P0 — High value, low effort, directly supports booked-meetings metric

> Per `feedback_client_acquisition_priority`: fleet subordinates to booked-meetings metric. These features directly track or accelerate client acquisition.

| # | Feature | Rationale | Effort |
|---|---------|-----------|--------|
| 1 | **Leads Pipeline Kanban** (`/leads`) | Primary client-acquisition tracker. Makes pipeline stages (contacted → meeting → client) visible on the dashboard. Currently only stats in `/outreach` — no visual pipeline, no drag-to-advance. **Direct booked-meetings visibility.** | M |
| 2 | **Content Calendar** (`/content`) | Client deliverable visibility. Clients ask "what are you doing for me?" — this page answers that. Also enables SEO agent to surface content to dashboard. Need for retainer health. | M |
| 3 | **Approvals enhancement — outreach gate** | Approvals page exists but isn't wired to outreach send approvals. Adding `category='outreach'` filtering + per-email approve/reject surfaces the user-approval-before-send flow on dashboard. The data model is already there (`approvals` table). | S |
| 4 | **Commands view** (`/commands`) | Currently Telegram commands buried in activity feed. Dedicated view with status badges gives visibility into what agents are doing for the user without digging through logs. | S |

### P1 — High value, medium effort, supports ops visibility

| # | Feature | Rationale | Effort |
|---|---------|-----------|--------|
| 5 | **Revenue page** (`/revenue`) | MRR already in clients table. Adding trend + per-client profitability makes financial health visible. Critical as retainers grow. | M |
| 6 | **Alerts + Rules** (`/alerts`) | Proactive monitoring of client health metrics. Flags drops in SEO performance, missed deliverables. Prevents churn. | M |
| 7 | **System/Integration health** (`/system`) | MCP server status, skill health, Claude session costs. Partially covered but needs a unified view. Important for agent reliability confidence. | S |
| 8 | **Prospecting Map** (`/leads/map`) | Geographic visualization for SSM prospecting. Requires leads table (P0#1) first. Meaningful once leads table has 20+ entries. | L |

### P2 — Important but complex; defer until P0/P1 stable

| # | Feature | Rationale | Effort |
|---|---------|-----------|--------|
| 9 | **Finances full P&L** (`/finances`) | Time tracking, expense recording, invoice workflow. Valuable but not blocking client acquisition. | L |
| 10 | **Per-client SEO Analytics** (`/analytics/:client`) | GSC/GA4/Semrush data requires external API keys per client. Can start with data SEO agent already writes to KB. | L |
| 11 | **Client Portal** (`/portal`) | Separate client-facing auth tier. High-effort, medium-urgency — clients are satisfied with Telegram updates for now. | L |
| 12 | **Inbox (Gmail)** (`/inbox`) | Requires Gmail OAuth backend. Low urgency vs. Telegram-first workflow. | L |

---

## E. Port Strategy

### Approach: Copy-and-Adapt (not rebuild from scratch)

Mission Control's UI patterns are highly compatible with cortextOS:
- Both use Tailwind 4 — token/class names are directly portable
- Both use TypeScript with similar component patterns
- Recharts is already used in cortextOS analytics — Mission Control charts port directly
- @dnd-kit is already in Mission Control — add to cortextOS package.json

**What needs adaptation:**

| Concern | Mission Control | cortextOS equivalent | Adaptation |
|---------|-----------------|---------------------|------------|
| **Data layer** | Supabase `supabase.from('leads').select()` | SQLite via `db.prepare().all()` in API route | Rewrite data hooks as `fetch('/api/leads')` calling SQLite instead of Supabase |
| **Realtime** | `supabase.channel()` Postgres change events | SSE `/api/events/stream` | Replace `useRealtime()` with polling (`useCallback` + `setInterval`) or SSE subscription |
| **Auth** | Supabase JWT with `user_role` claim | NextAuth.js session | Replace `useAuth()` with `useSession()` from next-auth |
| **State** | React Query (`useQuery`/`useMutation`) | `useState` + `useCallback` + `fetch` | Keep React Query pattern — add `@tanstack/react-query` to dashboard if not present; or use existing fetch pattern |
| **Routing** | React Router v7 (`useParams`, `useNavigate`) | Next.js App Router (`useSearchParams`, `useRouter`) | Minor — update link/navigate calls |
| **Drag/drop** | @dnd-kit (already in MC) | Not yet in dashboard | Add `@dnd-kit/core` + `@dnd-kit/sortable` to dashboard |

### New SQLite Tables Required (per feature)

```sql
-- P0 #1: Leads pipeline
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  phone TEXT,
  niche TEXT,
  area TEXT,
  province TEXT,
  status TEXT NOT NULL DEFAULT 'scouted',
  priority TEXT DEFAULT 'normal',
  outreach_sent_at TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- P0 #2: Content calendar
CREATE TABLE content_items (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL,
  client_slug TEXT,
  title TEXT NOT NULL,
  platform TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_date TEXT,
  published_date TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- P1 #5: Invoices
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL,
  client_slug TEXT,
  status TEXT DEFAULT 'draft',
  amount REAL,
  due_date TEXT,
  paid_date TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- P1 #6: Alerts
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  client_slug TEXT,
  is_read INTEGER DEFAULT 0,
  is_dismissed INTEGER DEFAULT 0,
  snoozed_until TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE alert_rules (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL,
  metric TEXT NOT NULL,
  operator TEXT NOT NULL,
  threshold REAL,
  severity TEXT NOT NULL DEFAULT 'warning',
  cooldown_hours INTEGER DEFAULT 24,
  enabled INTEGER DEFAULT 1,
  client_slug TEXT
);
```

### Design lock reminder (per `feedback_dev_design_lock`)

Every component ported from Mission Control must:
- Preserve the UX decisions user already made (layout, color semantics, Kanban column order, status labels)
- Be flagged with `Design impact: [description]` in the PR if any visual change from Mission Control's version is proposed
- Not introduce new visual patterns without user approval

---

## Open Questions (do not guess — flag for morning brief)

1. **Leads data seeding**: Should leads table be pre-seeded from existing outreach events (which have business_name, city, status fields)? Or start blank? The `outreach` events table has enough data to infer ~initial scouted/contacted leads.

2. **Content items source**: Who writes to `content_items` — SEO agent, user manually, or both? Need to know before building the write path.

3. **Alerts evaluation**: In Mission Control, `evaluate_alert_rules` is a Supabase RPC. In cortextOS, should this be a cron on the bus, a dashboard API route, or an agent skill?

4. **Client portal urgency**: Is there a client who needs portal access in the near term, or is this genuinely P2?

5. **Revenue/Finances data**: Are invoices currently tracked anywhere (spreadsheet, external tool)? Need initial data source before building the table.

6. **Prospecting Map geo data**: Leads in outreach events have `city` field but no lat/lng. Need geocoding step or a city→coordinates lookup table.

---

_Deliverable complete. Ready for morning brief review._
