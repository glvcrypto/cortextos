// cortextOS Dashboard - SQLite database singleton
// Read cache for JSON/JSONL files on disk. WAL mode for concurrent reads.

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const instanceId = process.env.CTX_INSTANCE_ID ?? 'default';
const ctxRoot = process.env.CTX_ROOT;
const DB_PATH = ctxRoot
  ? path.join(ctxRoot, 'dashboard', `cortextos-${instanceId}.db`)
  : path.join(process.cwd(), '.data', `cortextos-${instanceId}.db`);

function createDatabase(): Database.Database {
  // Ensure .data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH, { timeout: 10000 });

  // Set busy_timeout BEFORE attempting any schema or pragma changes that
  // require write locks (e.g. WAL switch, CREATE TABLE). Without this, parallel
  // processes (like Next.js build workers) hit SQLITE_BUSY immediately.
  db.pragma('busy_timeout = 10000');

  // Switch to WAL mode (requires exclusive lock on the DB file).
  // Guard against SQLITE_BUSY when multiple Next.js build workers open the DB
  // simultaneously: if the switch fails, check whether another worker already
  // succeeded. If so, continue; otherwise re-throw.
  try {
    db.pragma('journal_mode = WAL');
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException & { code?: string }).code !== 'SQLITE_BUSY') throw err;
    const rows = db.pragma('journal_mode') as { journal_mode: string }[];
    if (rows[0]?.journal_mode !== 'wal') throw err;
    // Another worker already switched to WAL — we're fine.
  }
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');

  // Run schema initialization
  initializeSchema(db);

  return db;
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'normal',
      assignee TEXT,
      org TEXT NOT NULL DEFAULT '',
      project TEXT,
      needs_approval INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      completed_at TEXT,
      notes TEXT,
      source_file TEXT
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      agent TEXT NOT NULL,
      org TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      resolved_at TEXT,
      resolved_by TEXT,
      resolution_note TEXT,
      source_file TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      agent TEXT NOT NULL,
      org TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL,
      category TEXT,
      severity TEXT NOT NULL DEFAULT 'info',
      data TEXT,
      message TEXT,
      source_file TEXT
    );

    CREATE TABLE IF NOT EXISTS heartbeats (
      agent TEXT PRIMARY KEY,
      org TEXT NOT NULL DEFAULT '',
      status TEXT,
      current_task TEXT,
      mode TEXT,
      last_heartbeat TEXT,
      loop_interval INTEGER,
      uptime_seconds INTEGER
    );

    CREATE TABLE IF NOT EXISTS cost_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      agent TEXT NOT NULL,
      org TEXT NOT NULL DEFAULT '',
      model TEXT NOT NULL,
      input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      total_tokens INTEGER NOT NULL DEFAULT 0,
      cost_usd REAL NOT NULL DEFAULT 0,
      source_file TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      from_agent TEXT NOT NULL,
      to_agent TEXT NOT NULL,
      org TEXT NOT NULL DEFAULT '',
      timestamp TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unread',
      source_file TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_meta (
      file_path TEXT PRIMARY KEY,
      mtime REAL NOT NULL,
      last_synced TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      org TEXT NOT NULL DEFAULT '',
      display_name TEXT,
      stage TEXT NOT NULL DEFAULT 'prospect',
      retainer_mrr INTEGER NOT NULL DEFAULT 0,
      retainer_health TEXT NOT NULL DEFAULT 'none',
      contract TEXT,
      deliverables TEXT,
      blockers TEXT,
      notes TEXT,
      updated_at TEXT,
      source_file TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_clients_org ON clients(org);
    CREATE INDEX IF NOT EXISTS idx_clients_stage ON clients(stage);

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

    -- Rate limit table: persists across server restarts so limits survive hot-reloads
    -- and intentional restarts. reset_at is a Unix timestamp in milliseconds.
    CREATE TABLE IF NOT EXISTS rate_limits (
      ip TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      reset_at INTEGER NOT NULL
    );

    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(org);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

    CREATE INDEX IF NOT EXISTS idx_approvals_org ON approvals(org);
    CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
    CREATE INDEX IF NOT EXISTS idx_approvals_agent ON approvals(agent);

    CREATE INDEX IF NOT EXISTS idx_events_org ON events(org);
    CREATE INDEX IF NOT EXISTS idx_events_agent ON events(agent);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
    CREATE INDEX IF NOT EXISTS idx_events_severity ON events(severity);

    CREATE INDEX IF NOT EXISTS idx_cost_entries_timestamp ON cost_entries(timestamp);
    CREATE INDEX IF NOT EXISTS idx_cost_entries_agent ON cost_entries(agent);
    CREATE INDEX IF NOT EXISTS idx_cost_entries_org ON cost_entries(org);

    CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_agent);
    CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_agent);
    CREATE INDEX IF NOT EXISTS idx_messages_org ON messages(org);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);

    -- ── Accounting / Expense + Income tracking (analyst schema v1.1, 2026-04-25) ──

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL DEFAULT 'glv',
      name TEXT NOT NULL,
      cra_t2125_line TEXT,
      cra_t2125_label TEXT,
      is_fixed INTEGER NOT NULL DEFAULT 0,
      color TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      archived_at TEXT,
      UNIQUE (org, name)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL DEFAULT 'glv',
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (org, name)
    );

    CREATE TABLE IF NOT EXISTS recurring_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL DEFAULT 'glv',
      vendor TEXT NOT NULL,
      description TEXT,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency IN ('CAD','USD')),
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      direction TEXT NOT NULL CHECK (direction IN ('income','expense')),
      cadence TEXT NOT NULL CHECK (cadence IN ('weekly','monthly','quarterly','annual','custom')),
      cadence_interval_days INTEGER,
      start_date TEXT NOT NULL,
      next_bill_date TEXT NOT NULL,
      end_date TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      payment_method TEXT,
      counterparty_email TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS recurring_schedule_tags (
      schedule_id INTEGER NOT NULL REFERENCES recurring_schedules(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (schedule_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL DEFAULT 'glv',
      date TEXT NOT NULL,
      paid_at TEXT,
      direction TEXT NOT NULL CHECK (direction IN ('income','expense')),
      transaction_type TEXT NOT NULL CHECK (transaction_type IN ('one_time','subscription','invoice')),
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency IN ('CAD','USD')),
      tax_cents INTEGER,
      tax_rate REAL,
      vendor TEXT,
      description TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      recurring_schedule_id INTEGER REFERENCES recurring_schedules(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending','paid','overdue','void')),
      payment_method TEXT,
      payment_reference TEXT,
      counterparty_email TEXT,
      invoice_number TEXT,
      invoice_due_date TEXT,
      notes TEXT,
      source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','email_parser','recurring_materializer','csv_import')),
      email_message_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS uq_txn_schedule_date
      ON transactions(recurring_schedule_id, date)
      WHERE recurring_schedule_id IS NOT NULL;

    CREATE TABLE IF NOT EXISTS transaction_tags (
      transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (transaction_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL DEFAULT 'glv',
      transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      kind TEXT NOT NULL DEFAULT 'vendor_receipt' CHECK (kind IN ('vendor_receipt','issued_receipt')),
      file_path TEXT,
      file_size_bytes INTEGER,
      file_mime TEXT,
      source TEXT NOT NULL DEFAULT 'manual_upload' CHECK (source IN ('manual_upload','email_attachment','manual_paste','generated')),
      email_message_id TEXT,
      recipient_email TEXT,
      parsed_vendor TEXT,
      parsed_amount_cents INTEGER,
      parsed_date TEXT,
      parsed_raw_text TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cash_balance_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      org TEXT NOT NULL DEFAULT 'glv',
      snapshot_date TEXT NOT NULL,
      balance_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'CAD' CHECK (currency IN ('CAD','USD')),
      source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','bank_csv','plaid_future')),
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS fx_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rate_date TEXT NOT NULL,
      base_currency TEXT NOT NULL CHECK (base_currency IN ('CAD','USD')),
      quote_currency TEXT NOT NULL CHECK (quote_currency IN ('CAD','USD')),
      rate REAL NOT NULL,
      source TEXT NOT NULL DEFAULT 'boc_noon',
      fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (rate_date, base_currency, quote_currency)
    );

    -- Indexes (org-leading for multi-org filtering)
    CREATE INDEX IF NOT EXISTS idx_categories_org ON categories(org);
    CREATE INDEX IF NOT EXISTS idx_tags_org ON tags(org);
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_org ON recurring_schedules(org);
    CREATE INDEX IF NOT EXISTS idx_recurring_next_bill ON recurring_schedules(org, next_bill_date, active);
    CREATE INDEX IF NOT EXISTS idx_transactions_org_date ON transactions(org, date);
    CREATE INDEX IF NOT EXISTS idx_transactions_org_direction_date ON transactions(org, direction, date);
    CREATE INDEX IF NOT EXISTS idx_transactions_org_category_date ON transactions(org, category_id, date);
    CREATE INDEX IF NOT EXISTS idx_transactions_org_type_date ON transactions(org, transaction_type, date);
    CREATE INDEX IF NOT EXISTS idx_transactions_org_status ON transactions(org, status);
    CREATE INDEX IF NOT EXISTS idx_transactions_schedule ON transactions(recurring_schedule_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_counterparty ON transactions(counterparty_email)
      WHERE counterparty_email IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_receipts_transaction ON receipts(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_receipts_org_kind ON receipts(org, kind);
    CREATE INDEX IF NOT EXISTS idx_cash_balance_org_date ON cash_balance_snapshots(org, snapshot_date);
    CREATE INDEX IF NOT EXISTS idx_fx_rates_date ON fx_rates(rate_date);

    -- Views for reporting
    CREATE VIEW IF NOT EXISTS v_transactions_cad AS
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

    CREATE VIEW IF NOT EXISTS v_monthly_net AS
    SELECT
      strftime('%Y-%m', date) AS month,
      SUM(CASE WHEN direction='income'  AND status='paid' THEN amount_cents ELSE 0 END) AS income_cents,
      SUM(CASE WHEN direction='expense' AND status='paid' THEN amount_cents ELSE 0 END) AS expense_cents,
      SUM(CASE WHEN direction='income'  AND status='paid' THEN amount_cents ELSE 0 END) -
      SUM(CASE WHEN direction='expense' AND status='paid' THEN amount_cents ELSE 0 END) AS net_cents
    FROM transactions
    GROUP BY month;

    CREATE VIEW IF NOT EXISTS v_active_subscription_monthly AS
    SELECT
      rs.id, rs.org, rs.vendor, rs.amount_cents, rs.cadence,
      CASE rs.cadence
        WHEN 'weekly'    THEN rs.amount_cents * 52 / 12
        WHEN 'monthly'   THEN rs.amount_cents
        WHEN 'quarterly' THEN rs.amount_cents / 3
        WHEN 'annual'    THEN rs.amount_cents / 12
        WHEN 'custom'    THEN rs.amount_cents * 365 / (rs.cadence_interval_days * 12)
      END AS monthly_equivalent_cents
    FROM recurring_schedules rs
    WHERE rs.active = 1 AND rs.direction = 'expense';
  `);

  // Seed fixed categories (INSERT OR IGNORE — idempotent)
  const seedCategories = db.prepare(`
    INSERT OR IGNORE INTO categories (org, name, cra_t2125_line, cra_t2125_label, is_fixed, color)
    VALUES (?, ?, ?, ?, 1, ?)
  `);
  const seedMany = db.transaction(() => {
    seedCategories.run('glv', 'Software',  '8810', 'Office expenses', '#3b82f6');
    seedCategories.run('glv', 'Marketing', '8521', 'Advertising',     '#10b981');
    seedCategories.run('glv', 'Travel',    '9200', 'Travel',          '#f59e0b');
  });
  seedMany();
}

// globalThis singleton survives Next.js hot reload
const globalForDb = globalThis as unknown as {
  __cortextos_db: Database.Database | undefined;
};

export const db = globalForDb.__cortextos_db ?? createDatabase();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__cortextos_db = db;
}

/** Re-export for explicit initialization (idempotent - db is created on import) */
export function initializeDb(): Database.Database {
  return db;
}

/** Check if the database connection is healthy */
export function isDatabaseReady(): boolean {
  try {
    db.prepare('SELECT 1').get();
    return true;
  } catch {
    return false;
  }
}

/** Get row counts for all tables (useful for diagnostics) */
export function getTableCounts(): Record<string, number> {
  const tables = [
    'tasks',
    'approvals',
    'events',
    'heartbeats',
    'cost_entries',
    'users',
    'messages',
    'sync_meta',
  ];
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as {
      count: number;
    };
    counts[table] = row.count;
  }
  return counts;
}

export default db;
