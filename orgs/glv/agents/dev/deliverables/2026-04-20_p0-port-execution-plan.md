# P0 Port Execution Plan — Morning Ready
_Pre-work by dev agent 2026-04-20. Awaiting user sign-off before any code starts._

---

## Branch Names (per feedback_dev_git_workflow: always feat/ prefix, no direct main commits)

| P0 # | Feature | Branch | Base |
|------|---------|--------|------|
| 1 | Leads Pipeline Kanban | `feat/leads-pipeline` | `main` |
| 2 | Content Calendar | `feat/content-calendar` | `main` |
| 3 | Approvals outreach gate | `feat/approvals-outreach-gate` | `main` |
| 4 | Commands view | `feat/commands-view` | `main` |

Each branch is independent — can be reviewed and merged separately.
PR order recommendation: #3 → #4 → #1 → #2 (easiest → hardest, validates workflow early).

---

## P0 #1 — Leads Pipeline Kanban (`feat/leads-pipeline`)

**Files to create/modify:**
```
dashboard/src/app/(dashboard)/leads/page.tsx          (new)
dashboard/src/app/api/leads/route.ts                   (new — GET list, POST create)
dashboard/src/app/api/leads/[id]/route.ts              (new — PATCH status, DELETE)
dashboard/src/lib/data/leads.ts                        (new — SQLite queries)
dashboard/src/lib/db.ts                                (modify — ADD leads table)
dashboard/src/components/leads/LeadsKanban.tsx         (new)
dashboard/src/components/leads/LeadCard.tsx            (new)
dashboard/src/components/leads/CreateLeadDialog.tsx    (new)
dashboard/src/components/layout/sidebar.tsx            (modify — add /leads nav item)
```

**Schema addition to db.ts:**
```sql
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL DEFAULT '',
  business_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  phone TEXT,
  niche TEXT,
  area TEXT,
  province TEXT,
  status TEXT NOT NULL DEFAULT 'scouted',
  priority TEXT NOT NULL DEFAULT 'normal',
  outreach_sent_at TEXT,
  notes TEXT,
  source TEXT DEFAULT 'manual',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_org ON leads(org);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
```

**Open question for morning brief:** Seed from existing outreach events (prospector already logs `email_sent` events with business_name/city in `data` JSON) or start blank?

**Kanban columns (matching Mission Control):**
`scouted` → `researched` → `contacted` → `responded` → `meeting` → `client` → `lost`

---

## P0 #2 — Content Calendar (`feat/content-calendar`)

**Files to create/modify:**
```
dashboard/src/app/(dashboard)/content/page.tsx         (new — replaces stub)
dashboard/src/app/api/content/route.ts                 (new — GET list, POST create)
dashboard/src/app/api/content/[id]/route.ts            (new — PATCH, DELETE)
dashboard/src/lib/data/content.ts                      (new — SQLite queries)
dashboard/src/lib/db.ts                                (modify — ADD content_items table)
dashboard/src/components/content/ContentCalendar.tsx   (new — month grid)
dashboard/src/components/content/ContentQueue.tsx      (new — list view)
dashboard/src/components/content/CreateContentDialog.tsx (new)
```

**Schema addition to db.ts:**
```sql
CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  org TEXT NOT NULL DEFAULT '',
  client_slug TEXT,
  title TEXT NOT NULL,
  platform TEXT,
  content_type TEXT DEFAULT 'blog',
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_date TEXT,
  published_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_content_org ON content_items(org);
CREATE INDEX IF NOT EXISTS idx_content_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_client ON content_items(client_slug);
```

**Open question for morning brief:** Who writes to content_items — SEO agent via bus, user manually in dashboard, or both?

---

## P0 #3 — Approvals Outreach Gate (`feat/approvals-outreach-gate`)

**Files to modify (no new tables — `approvals` already exists):**
```
dashboard/src/app/(dashboard)/approvals/page.tsx       (modify — add outreach tab/filter)
dashboard/src/app/api/approvals/route.ts               (modify — add category=outreach filter)
dashboard/src/components/approvals/ApprovalCard.tsx    (modify — show email preview for outreach category)
```

**No schema changes needed.** `approvals` table already has `category TEXT`. Prospector agent just needs to log approvals with `category='outreach'`. The dashboard filter is the only addition.

**Lowest risk P0 — touches existing code minimally, data model already supports it.**

---

## P0 #4 — Commands View (`feat/commands-view`)

**Files to create/modify:**
```
dashboard/src/app/(dashboard)/commands/page.tsx        (new)
dashboard/src/app/api/commands/route.ts                (new — reads events WHERE category='telegram')
dashboard/src/components/commands/CommandList.tsx      (new)
dashboard/src/components/layout/sidebar.tsx            (modify — add /commands nav item)
```

**No schema changes needed.** Commands surface from existing `events` table. Need to confirm prospector/boss agents log Telegram commands with consistent `category` or `type` values.

**Open question for morning brief:** Do agents currently log Telegram commands to events table? If yes, what `type`/`category` values? (Check activity feed for examples before building the filter.)

---

## Schema Dependency Summary (for morning brief)

| P0 Feature | Needs schema change? | Tables | Migrations needed |
|------------|---------------------|--------|-------------------|
| Leads Pipeline | YES | `leads` (new) | Add to `db.ts` auto-create block |
| Content Calendar | YES | `content_items` (new) | Add to `db.ts` auto-create block |
| Approvals gate | NO | uses `approvals` (exists) | None |
| Commands view | NO | uses `events` (exists) | None |

**Important:** cortextOS `db.ts` uses `CREATE TABLE IF NOT EXISTS` in the init block — no separate migration files needed. Schema changes are additive. Zero risk of breaking existing tables.

---

## Execution Order on Morning Approval

```
1. Merge/approve audit + this plan
2. git checkout -b feat/approvals-outreach-gate   # S effort, no schema change
3. git checkout -b feat/commands-view              # S effort, no schema change
4. git checkout -b feat/leads-pipeline             # M effort, needs leads table
5. git checkout -b feat/content-calendar           # M effort, needs content_items table
```

PRs #3 and #4 can be reviewed same-day. PRs #1 and #2 are the meatier builds.
