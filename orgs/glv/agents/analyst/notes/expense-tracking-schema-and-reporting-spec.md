---
title: Expense Tracking — schema + reporting spec
author: analyst
date: 2026-04-25T22:50Z (v1.1 update 2026-04-25T23:05Z post-Aiden-answers)
status: SPEC v1.1 — for dev (build) + designer (UI) parallel build
context: cortextos.db dashboard accounting page; Aiden directive via boss msg 1777159242459; v1.1 deltas via boss msg 1777159743537
---

# v1.1 deltas (read this first if you've seen v1)

Aiden's answers locked in five v1 open questions + added e-transfer / issued-receipt requirement. Schema changes:

1. **Multi-currency**: USD + CAD only. NEW `fx_rates` table + daily BoC noon-rate fetch. Source currency stays per-row; rollups convert to CAD.
2. **Cash balance**: confirmed manual entry, weekly UI prompt.
3. **Invoices both directions**: already supported via `direction` enum + `transaction_type='invoice'`. Added `paid_at` column (vs existing `date` which is issue date).
4. **HST reserved**: `tax_cents` + `tax_rate` columns added, nullable, unused until $30K registration threshold.
5. **Multi-org from day 1**: `org TEXT NOT NULL DEFAULT 'glv'` added to transactions, recurring_schedules, categories, tags, receipts, cash_balance_snapshots, fx_rates. Indexes adjusted to lead on `org`.
6. **NEW: E-transfer tracking** — added `payment_reference` (e-transfer confirmation / cheque # / wire ref) + `counterparty_email` to `transactions`. No separate `payments` table for v1 (95% case fits one row per money movement; partial-pay → v2 `payment_allocations`).
7. **NEW: Issued receipts** — added `kind TEXT CHECK (kind IN ('vendor_receipt','issued_receipt'))` + `recipient_email` to `receipts`. Same upload/attach flow, kind disambiguates direction.

The full v1.1 schema below incorporates all of the above. v1 sections marked superseded.

---

# Expense Tracking — schema + reporting spec

## Scope (from boss dispatch)

- Business expenses + income tracking, manual entry primary
- Transaction types: subscriptions (recurring) vs one-time vs invoicing
- Categorization: 3 fixed (Software, Marketing, Travel) + custom tags
- Tags PERSISTENT for subscriptions (carry forward to each new billing instance)
- Receipt: file upload + email-receipt parsing from info@glvmarketing.ca (parser = stub for now, credential-gated)
- Reporting: charts + totals (burn, by-category, income vs expense, subscription totals, runway)
- CSV export for accountant
- CRA T2125 tax-line mapping (Aiden runs GLV Marketing in SSM Ontario; sole prop / self-employment T2125 schedule)

## Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Income table | **Unified transactions table with `direction` enum** | Simpler joins, single index strategy, single CSV export query |
| Subscription model | **Materialized rows** (daemon generates pending txn rows N days ahead from `recurring_schedules`) | Tags + category copy-forward at materialize, individual instance status, simpler reporting queries |
| Tag persistence | **Copy schedule's tags onto each materialized txn** | Carries forward automatically without runtime computation |
| Money type | **INTEGER cents** | Avoid float rounding errors |
| Currency | **CAD default, currency column for future-proofing** | Aiden may invoice USD clients eventually |
| Date type | **TEXT ISO-8601 (`YYYY-MM-DD` or full datetime)** | better-sqlite3 idiom, sortable, comparable |
| FK behavior | **`ON DELETE SET NULL` for category, CASCADE for tags + receipts** | Don't lose txn history when a category is removed; tag + receipt rows are subordinate |

## Schema

### `categories` (v1.1)

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org TEXT NOT NULL DEFAULT 'glv',
  name TEXT NOT NULL,
  cra_t2125_line TEXT,                              -- e.g. '8521'
  cra_t2125_label TEXT,                             -- 'Advertising'
  is_fixed INTEGER NOT NULL DEFAULT 0,              -- 1 = seeded fixed; 0 = user-created
  color TEXT,                                        -- hex for chart legend
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  archived_at TEXT,
  UNIQUE (org, name)
);
```

**Seed (per-org, glv first):**

```sql
INSERT INTO categories (org, name, cra_t2125_line, cra_t2125_label, is_fixed, color) VALUES
  ('glv', 'Software',  '8810', 'Office expenses', 1, '#3b82f6'),
  ('glv', 'Marketing', '8521', 'Advertising',     1, '#10b981'),
  ('glv', 'Travel',    '9200', 'Travel',          1, '#f59e0b');
```

CRA T2125 line reference (for adding more custom categories later): 8523 Meals & entertainment, 8690 Insurance, 8710 Interest/bank charges, 8811 Supplies, 8860 Professional fees, 9220 Telephone & utilities, 9281 Vehicle expenses.

### `tags` (v1.1)

```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org TEXT NOT NULL DEFAULT 'glv',
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (org, name)
);
```

### `recurring_schedules` (v1.1)

```sql
CREATE TABLE recurring_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org TEXT NOT NULL DEFAULT 'glv',
  vendor TEXT NOT NULL,
  description TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency IN ('CAD','USD')),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  direction TEXT NOT NULL CHECK (direction IN ('income','expense')),
  cadence TEXT NOT NULL CHECK (cadence IN ('weekly','monthly','quarterly','annual','custom')),
  cadence_interval_days INTEGER,                    -- when cadence = 'custom'
  start_date TEXT NOT NULL,
  next_bill_date TEXT NOT NULL,
  end_date TEXT,                                     -- nullable = open-ended
  active INTEGER NOT NULL DEFAULT 1,
  payment_method TEXT,
  counterparty_email TEXT,                          -- v1.1: for income retainers / vendor contact
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE recurring_schedule_tags (
  schedule_id INTEGER NOT NULL REFERENCES recurring_schedules(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (schedule_id, tag_id)
);

CREATE INDEX idx_recurring_next_bill ON recurring_schedules(org, next_bill_date, active);
```

### `transactions` (unified income + expense, v1.1)

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org TEXT NOT NULL DEFAULT 'glv',
  date TEXT NOT NULL,                                -- issue/booking date (YYYY-MM-DD)
  paid_at TEXT,                                      -- v1.1: when payment cleared (for invoices: actual settlement date)
  direction TEXT NOT NULL CHECK (direction IN ('income','expense')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('one_time','subscription','invoice')),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency IN ('CAD','USD')),
  tax_cents INTEGER,                                 -- v1.1: RESERVED, nullable (HST tracking deferred until $30K threshold)
  tax_rate REAL,                                     -- v1.1: RESERVED, nullable (e.g. 0.13 for 13% HST)
  vendor TEXT,                                       -- payee (expense) or payer (income)
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  recurring_schedule_id INTEGER REFERENCES recurring_schedules(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'paid'
    CHECK (status IN ('pending','paid','overdue','void')),
  payment_method TEXT,                               -- 'e_transfer','cheque','cash','wire','credit_card','debit','direct_deposit', etc.
  payment_reference TEXT,                            -- v1.1: e-transfer confirmation # / cheque # / wire reference
  counterparty_email TEXT,                           -- v1.1: client email (income) or vendor billing email (expense), enables cross-payment client matching
  invoice_number TEXT,                               -- only when transaction_type = 'invoice'
  invoice_due_date TEXT,                             -- only when transaction_type = 'invoice'
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual','email_parser','recurring_materializer','csv_import')),
  email_message_id TEXT,                             -- when source = 'email_parser'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- v1.1: indexes lead with org for multi-org filtering
CREATE INDEX idx_transactions_org_date            ON transactions(org, date);
CREATE INDEX idx_transactions_org_direction_date  ON transactions(org, direction, date);
CREATE INDEX idx_transactions_org_category_date   ON transactions(org, category_id, date);
CREATE INDEX idx_transactions_org_type_date       ON transactions(org, transaction_type, date);
CREATE INDEX idx_transactions_org_status          ON transactions(org, status);
CREATE INDEX idx_transactions_schedule            ON transactions(recurring_schedule_id);
CREATE INDEX idx_transactions_counterparty        ON transactions(counterparty_email)
  WHERE counterparty_email IS NOT NULL;
CREATE UNIQUE INDEX uq_txn_schedule_date
  ON transactions(recurring_schedule_id, date)
  WHERE recurring_schedule_id IS NOT NULL;

CREATE TABLE transaction_tags (
  transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);
```

### `receipts` (v1.1)

```sql
CREATE TABLE receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org TEXT NOT NULL DEFAULT 'glv',
  transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'vendor_receipt'
    CHECK (kind IN ('vendor_receipt','issued_receipt')),  -- v1.1: vendor sent it (expense) or you sent to client (income)
  file_path TEXT,                                    -- relative to ${CTX_ROOT}/dashboard/uploads/receipts/
  file_size_bytes INTEGER,
  file_mime TEXT,
  source TEXT NOT NULL DEFAULT 'manual_upload'
    CHECK (source IN ('manual_upload','email_attachment','manual_paste','generated')),
  email_message_id TEXT,                             -- when source = 'email_attachment'
  recipient_email TEXT,                              -- v1.1: only for kind = 'issued_receipt' — who you sent it to
  parsed_vendor TEXT,                                -- populated by email parser (v2)
  parsed_amount_cents INTEGER,
  parsed_date TEXT,
  parsed_raw_text TEXT,                              -- audit: raw text the parser saw
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_receipts_transaction ON receipts(transaction_id);
CREATE INDEX idx_receipts_org_kind ON receipts(org, kind);
```

### `cash_balance_snapshots` (for runway calc, v1.1)

```sql
CREATE TABLE cash_balance_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  org TEXT NOT NULL DEFAULT 'glv',
  snapshot_date TEXT NOT NULL,
  balance_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency IN ('CAD','USD')),
  source TEXT NOT NULL DEFAULT 'manual'
    CHECK (source IN ('manual','bank_csv','plaid_future')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_cash_balance_org_date ON cash_balance_snapshots(org, snapshot_date DESC);
```

### `fx_rates` (v1.1, NEW)

Daily Bank of Canada noon rate. Used to roll up multi-currency transactions to a CAD-denominated reporting view.

```sql
CREATE TABLE fx_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rate_date TEXT NOT NULL,                           -- YYYY-MM-DD (BoC publishes one per business day)
  base_currency TEXT NOT NULL CHECK (base_currency IN ('CAD','USD')),
  quote_currency TEXT NOT NULL CHECK (quote_currency IN ('CAD','USD')),
  rate REAL NOT NULL,                                -- 1 base = X quote (e.g. base=USD, quote=CAD, rate=1.37 → 1 USD = 1.37 CAD)
  source TEXT NOT NULL DEFAULT 'boc_noon',
  fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (rate_date, base_currency, quote_currency)
);

CREATE INDEX idx_fx_rates_date ON fx_rates(rate_date DESC);
```

**Daily fetch cron** (suggest 14:00 UTC = post-BoC publish window):
- Endpoint: `https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1` (free, no auth)
- Parse latest observation date + value, INSERT OR IGNORE on `(rate_date, base, quote)` UNIQUE
- For weekend/holiday gaps: most recent rate carries forward in queries (`SELECT rate FROM fx_rates WHERE base=? AND quote=? AND rate_date <= ? ORDER BY rate_date DESC LIMIT 1`)

**Conversion helper view (v1.1):**

```sql
-- one row per transaction with CAD-equivalent amount for cross-currency rollups
CREATE VIEW v_transactions_cad AS
SELECT
  t.*,
  CASE
    WHEN t.currency = 'CAD' THEN t.amount_cents
    ELSE CAST(t.amount_cents *
      (SELECT rate FROM fx_rates fx
       WHERE fx.base_currency = t.currency AND fx.quote_currency = 'CAD'
       AND fx.rate_date <= t.date
       ORDER BY fx.rate_date DESC LIMIT 1) AS INTEGER)
  END AS amount_cents_cad
FROM transactions t;
```

All chart queries should use `v_transactions_cad` instead of `transactions` directly when displaying aggregated totals.

## Subscription materializer

A daemon job (suggest hourly cron) walks `recurring_schedules WHERE active = 1 AND next_bill_date <= date('now', '+7 days')` and:

1. Inserts a new `transactions` row with `transaction_type = 'subscription'`, `status = 'pending'`, `source = 'recurring_materializer'`, `recurring_schedule_id = <schedule.id>`, copying `vendor`, `description`, `amount_cents`, `currency`, `category_id`, `direction`, `payment_method` from the schedule.
2. Copies all `recurring_schedule_tags` rows into `transaction_tags` for the new txn.
3. Updates `recurring_schedules.next_bill_date` to the next cycle (cadence-aware: `+7 days` for weekly, `+1 month` for monthly, `+3 months` for quarterly, `+1 year` for annual, `+cadence_interval_days` for custom).
4. If `end_date IS NOT NULL AND next_bill_date > end_date`, set `active = 0`.

User then marks pending → paid (or void) via the UI; the bank-side reconciliation can come later (Plaid or CSV import).

**Idempotency**: schedule materializer should `INSERT OR IGNORE` keyed on `(recurring_schedule_id, date)` — UNIQUE constraint to prevent double-billing if cron fires twice.

```sql
CREATE UNIQUE INDEX uq_txn_schedule_date
  ON transactions(recurring_schedule_id, date)
  WHERE recurring_schedule_id IS NOT NULL;
```

## Reporting spec

### Charts (canonical set, all support time-window selector: M / Q / YTD / custom)

| Chart | SQL aggregation | Designer note |
|---|---|---|
| **Burn rate** | `SELECT strftime('%Y-%m', date) AS month, SUM(amount_cents) FROM transactions WHERE direction='expense' AND status IN ('paid') AND date >= ? GROUP BY month ORDER BY month` | Line chart, monthly bars; show 3-mo rolling avg overlay |
| **By-category** | `SELECT c.name, c.color, SUM(t.amount_cents) FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.direction='expense' AND t.status='paid' AND t.date BETWEEN ? AND ? GROUP BY c.id` | Pie or stacked bar; uses `categories.color` |
| **Income vs expense** | Two series same x-axis: monthly SUM grouped by `direction` | Side-by-side bars per month, net line on top |
| **Subscription totals** | `SELECT vendor, SUM(amount_cents), MIN(date) AS started, COUNT(*) AS billings FROM transactions WHERE transaction_type='subscription' AND direction='expense' AND date BETWEEN ? AND ? GROUP BY vendor ORDER BY SUM DESC` | Horizontal bar list with vendor + monthly equivalent |
| **Runway** | `(latest cash_balance) / (avg last 3 months net burn)` → months remaining | Single big number + "X months runway at current burn" sublabel |
| **Outstanding invoices** (table, not chart) | `SELECT * FROM transactions WHERE transaction_type='invoice' AND status IN ('pending','overdue') ORDER BY invoice_due_date` | Aged-receivable table, color-code by overdue days |

### Aggregations (re-usable views)

```sql
-- monthly net (income - expense) for runway calc
CREATE VIEW v_monthly_net AS
SELECT
  strftime('%Y-%m', date) AS month,
  SUM(CASE WHEN direction='income'  AND status='paid' THEN amount_cents ELSE 0 END) AS income_cents,
  SUM(CASE WHEN direction='expense' AND status='paid' THEN amount_cents ELSE 0 END) AS expense_cents,
  SUM(CASE WHEN direction='income'  AND status='paid' THEN amount_cents ELSE 0 END) -
  SUM(CASE WHEN direction='expense' AND status='paid' THEN amount_cents ELSE 0 END) AS net_cents
FROM transactions
GROUP BY month;

-- active subscription monthly equivalent (annualize then /12)
CREATE VIEW v_active_subscription_monthly AS
SELECT
  rs.id, rs.vendor, rs.amount_cents, rs.cadence,
  CASE rs.cadence
    WHEN 'weekly'    THEN rs.amount_cents * 52 / 12
    WHEN 'monthly'   THEN rs.amount_cents
    WHEN 'quarterly' THEN rs.amount_cents / 3
    WHEN 'annual'    THEN rs.amount_cents / 12
    WHEN 'custom'    THEN rs.amount_cents * 365 / (rs.cadence_interval_days * 12)
  END AS monthly_equivalent_cents
FROM recurring_schedules rs
WHERE rs.active = 1 AND rs.direction = 'expense';
```

### Drill-down behaviour

- Clicking any chart segment / category → filter the transactions table below by that scope (date range, category, type, etc.)
- Clicking a transaction row → modal with full detail + receipt thumbnails + edit
- Clicking a subscription row → schedule edit + history of all materialized billings

### Time-window selector

Default: **YTD**. Other presets: this month, last month, last 3 months, last 12 months, this quarter, custom date range. Selector affects ALL charts on the page simultaneously.

## CSV export (for accountant)

One file per export request (no zips), columns:

```
date, direction, transaction_type, amount_cad, currency, vendor, description, category, cra_t2125_line, cra_t2125_label, tags, payment_method, invoice_number, invoice_due_date, status, notes, has_receipt
```

- `tags` = pipe-separated (`reyco|seo|q2-2026`)
- `has_receipt` = `Y` / `N`
- `amount_cad` = converted from `currency` if not CAD (use stored rate; for v1 just dump amount + currency, conversion later)
- Filename pattern: `glv-expenses-{start}-to-{end}.csv`
- Filter UI: same time-window selector as reporting page; optional category + direction filters

## Email-receipt parser direction (stub for v1, build for v2)

**Source**: info@glvmarketing.ca inbox. **Trigger**: receipt forwarded TO info@ from Aiden's vendor inboxes, OR vendor sends receipts directly.

**Recommended approach (v2 build)**:

1. **Polling vs IMAP IDLE**: start with polling (every 15 min) via Microsoft Graph API or IMAP — Aiden runs Proton Mail (per his amglvdigital@pm.me address); Proton has IMAP via Bridge but no Graph API. Polling is simpler. **Credential ask**: Proton Bridge IMAP credentials → routes via dev → boss → pentester → user per `feedback_credentials_routing`.

2. **Field extraction (in priority order)**:
   - `vendor` — From: header domain (e.g. `noreply@stripe.com` → `Stripe`); fallback to subject parsing
   - `amount` — regex on body text: `(?:\$|CAD|USD|€)\s*(\d+[,.]?\d*\.\d{2})` (also catches `Total: $12.99`)
   - `date` — Date: header (always present)
   - `currency` — symbol/code from amount match
   - `payment_method` — line containing "ending in" or "card ending" → last 4 digits
   - `invoice_number` — regex on subject/body: `(?:invoice|receipt|order)[\s#:]*([A-Z0-9-]+)`

3. **Library suggestion**: For v2 build, use **`mailparser`** (npm, parses MIME) + custom regex chain. Skip an LLM call for structured receipts — they're 90% regex-tractable. Reserve an LLM fallback (one Claude Haiku call per email, ~$0.001) only for emails where regex extraction yields zero amount.

4. **Match-vs-create heuristic**:
   - Compute fingerprint = `(vendor_domain, amount_cents, currency, ±3 days from receipt date)`
   - Query `transactions WHERE vendor LIKE ? AND amount_cents = ? AND date BETWEEN ? AND ?`
   - Match found → attach receipt to existing txn, fill `parsed_*` columns, mark txn `status='paid'` if pending
   - No match → create new `transactions` row with `source='email_parser'`, `email_message_id` populated, status='paid' (assume sent receipts = settled)

5. **PII / safety**: store `parsed_raw_text` (not full email) for audit; never store email body in plaintext beyond what extraction needed; never auto-reply to sender. All parsed txns flagged in UI for human review for first 4 weeks.

**For v1 (this build)**: leave `email_message_id`, `parsed_*` columns nullable; don't wire the parser. Reserve `source = 'email_parser'` enum value so v2 doesn't need a migration. Receipts table already supports `source = 'email_attachment'` for the parser path.

## Build coordination notes

**For dev:**
- Schema is your source of truth — implement `initializeSchema()` in `dashboard/src/lib/db.ts` adding these tables alongside the existing ones; respect WAL mode + busy_timeout setup already in place
- Materializer cron lives in `src/cli/ecosystem.ts` (or a new daemon module) — fires hourly, idempotent via `(recurring_schedule_id, date)` UNIQUE
- Status field default 'paid' for one_time; 'pending' for subscription materializer + invoice
- Endpoints needed: GET /api/transactions (filterable), POST/PUT/DELETE /api/transactions, same for /api/recurring_schedules + /api/categories + /api/tags, POST /api/receipts (multipart), GET /api/reports/{burn|category|income-expense|subscriptions|runway}
- Receipt uploads: store under `${CTX_ROOT}/dashboard/uploads/receipts/{YYYY}/{MM}/{uuid}.{ext}`; validate mime (image/* + application/pdf), max 10 MB

**For designer:**
- Page route: `/accounting` (or `/expenses` — your call)
- Layout: top = time-window selector + summary numbers (burn, runway, MTD net); middle = chart grid (2x2 for burn / by-category / income-vs-expense / subscriptions); bottom = transactions table with inline filtering + add-transaction CTA
- Modal flows: add-transaction (radio for one_time / subscription / invoice; conditional fields), edit-subscription (cadence + tags + status), upload-receipt (drag-drop attached to a txn)
- Color palette uses `categories.color` for chart consistency
- Subscriptions panel is its own tab/section since it has different lifecycle (active/paused/ended)
- Outstanding invoices = own table view, sortable by due date with overdue badges

## Open questions for boss/Aiden

All v1 open questions ANSWERED 2026-04-25T23:00Z via boss msg 1777159743537. See top-of-doc "v1.1 deltas" for the locks.

Outstanding (designer queue, lower priority — boss to surface to Aiden):
1. Category color picker UX — answered: 8 curated WCAG-passing swatches (not full picker)
2. Cash balance banner aggression — answered: once per session at 7d stale (yellow, dismissible); 14d stale → red non-dismissible
3. Email-parser review queue UI — answered: defer to v2 (route stub only in v1)
4. Subscription "Ended" terminal? — answered: NOT terminal; Active ↔ Paused ↔ Ended freely

## Status / next steps

- [x] Schema v1 drafted
- [x] Reporting spec drafted
- [x] Email-parser direction drafted (v2 stub)
- [x] Sent to dev (msg 1777159362512)
- [x] Sent to designer (msg 1777159514912)
- [x] Boss surfaced to Aiden (msg 1777159522031)
- [x] Aiden's 5 answers locked (msg 1777159743537)
- [x] Schema v1.1 incorporating all deltas (this doc, current revision)
- [ ] Re-dispatch to dev with v1.1 deltas
- [ ] Re-confirm to designer the v1.1 field surfaces
- [ ] Confirm complete back to boss
