import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  org: string;
  name: string;
  cra_t2125_line: string | null;
  cra_t2125_label: string | null;
  is_fixed: number;
  color: string | null;
  created_at: string;
  archived_at: string | null;
}

export interface Tag {
  id: number;
  org: string;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  org: string;
  date: string;
  paid_at: string | null;
  direction: 'income' | 'expense';
  transaction_type: 'one_time' | 'subscription' | 'invoice';
  amount_cents: number;
  currency: 'CAD' | 'USD';
  tax_cents: number | null;
  tax_rate: number | null;
  vendor: string | null;
  description: string | null;
  category_id: number | null;
  recurring_schedule_id: number | null;
  status: 'pending' | 'paid' | 'overdue' | 'void';
  payment_method: string | null;
  payment_reference: string | null;
  counterparty_email: string | null;
  invoice_number: string | null;
  invoice_due_date: string | null;
  notes: string | null;
  source: string;
  email_message_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields (optional, populated by listTransactions)
  category_name?: string | null;
  category_color?: string | null;
  cra_t2125_line?: string | null;
  cra_t2125_label?: string | null;
  tags?: string[];
}

export interface RecurringSchedule {
  id: number;
  org: string;
  vendor: string;
  description: string | null;
  amount_cents: number;
  currency: 'CAD' | 'USD';
  category_id: number | null;
  direction: 'income' | 'expense';
  cadence: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  cadence_interval_days: number | null;
  start_date: string;
  next_bill_date: string;
  end_date: string | null;
  active: number;
  payment_method: string | null;
  counterparty_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category_name?: string | null;
  category_color?: string | null;
  tags?: string[];
  monthly_equivalent_cents?: number;
}

// ── FX Rates sync ──────────────────────────────────────────────────────────

/** Sync fx_rates JSONL (written by analyst's fx-fetcher.ts) into SQLite */
export function syncFxRates(): void {
  const ctxRoot = process.env.CTX_ROOT;
  if (!ctxRoot) return;
  const jsonlPath = path.join(ctxRoot, 'analytics', 'fx_rates.jsonl');
  if (!fs.existsSync(jsonlPath)) return;

  const lines = fs.readFileSync(jsonlPath, 'utf8').split('\n').filter(Boolean);
  const upsert = db.prepare(`
    INSERT OR IGNORE INTO fx_rates (rate_date, base_currency, quote_currency, rate, source, fetched_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const syncAll = db.transaction(() => {
    for (const line of lines) {
      try {
        const r = JSON.parse(line) as {
          rate_date: string; base_currency: string; quote_currency: string;
          rate: number; source: string; fetched_at: string;
        };
        upsert.run(r.rate_date, r.base_currency, r.quote_currency, r.rate, r.source, r.fetched_at);
      } catch { /* skip malformed lines */ }
    }
  });
  syncAll();
}

// ── Categories ─────────────────────────────────────────────────────────────

export function listCategories(org: string): Category[] {
  return db.prepare(`
    SELECT * FROM categories WHERE org = ? AND archived_at IS NULL ORDER BY name
  `).all(org) as Category[];
}

export function createCategory(org: string, data: {
  name: string; color?: string; cra_t2125_line?: string; cra_t2125_label?: string;
}): Category {
  const result = db.prepare(`
    INSERT INTO categories (org, name, color, cra_t2125_line, cra_t2125_label, is_fixed)
    VALUES (?, ?, ?, ?, ?, 0)
  `).run(org, data.name, data.color ?? null, data.cra_t2125_line ?? null, data.cra_t2125_label ?? null);
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as Category;
}

// ── Tags ───────────────────────────────────────────────────────────────────

export function listTags(org: string): Tag[] {
  return db.prepare('SELECT * FROM tags WHERE org = ? ORDER BY name').all(org) as Tag[];
}

export function upsertTag(org: string, name: string): number {
  db.prepare('INSERT OR IGNORE INTO tags (org, name) VALUES (?, ?)').run(org, name);
  const row = db.prepare('SELECT id FROM tags WHERE org = ? AND name = ?').get(org, name) as { id: number };
  return row.id;
}

// ── Transactions ───────────────────────────────────────────────────────────

function hydrateTransaction(row: Record<string, unknown>): Transaction {
  const tagRows = db.prepare(`
    SELECT t.name FROM tags t
    JOIN transaction_tags tt ON tt.tag_id = t.id
    WHERE tt.transaction_id = ?
  `).all(row.id as number) as { name: string }[];
  return { ...row, tags: tagRows.map((r) => r.name) } as Transaction;
}

export function listTransactions(org: string, opts?: {
  direction?: 'income' | 'expense';
  transaction_type?: 'one_time' | 'subscription' | 'invoice';
  status?: string;
  category_id?: number;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}): Transaction[] {
  let sql = `
    SELECT t.*,
      c.name AS category_name, c.color AS category_color,
      c.cra_t2125_line, c.cra_t2125_label
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.org = ?
  `;
  const params: unknown[] = [org];
  if (opts?.direction) { sql += ' AND t.direction = ?'; params.push(opts.direction); }
  if (opts?.transaction_type) { sql += ' AND t.transaction_type = ?'; params.push(opts.transaction_type); }
  if (opts?.status) { sql += ' AND t.status = ?'; params.push(opts.status); }
  if (opts?.category_id) { sql += ' AND t.category_id = ?'; params.push(opts.category_id); }
  if (opts?.from) { sql += ' AND t.date >= ?'; params.push(opts.from); }
  if (opts?.to) { sql += ' AND t.date <= ?'; params.push(opts.to); }
  sql += ' ORDER BY t.date DESC, t.created_at DESC';
  if (opts?.limit) { sql += ' LIMIT ?'; params.push(opts.limit); }
  if (opts?.offset) { sql += ' OFFSET ?'; params.push(opts.offset); }
  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
  return rows.map(hydrateTransaction);
}

export function getTransaction(id: number): Transaction | null {
  const row = db.prepare(`
    SELECT t.*, c.name AS category_name, c.color AS category_color,
      c.cra_t2125_line, c.cra_t2125_label
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.id = ?
  `).get(id) as Record<string, unknown> | undefined;
  return row ? hydrateTransaction(row) : null;
}

export function createTransaction(data: {
  org: string;
  date: string;
  direction: 'income' | 'expense';
  transaction_type: 'one_time' | 'subscription' | 'invoice';
  amount_cents: number;
  currency?: 'CAD' | 'USD';
  vendor?: string | null;
  description?: string | null;
  category_id?: number | null;
  status?: 'pending' | 'paid' | 'overdue' | 'void';
  payment_method?: string | null;
  payment_reference?: string | null;
  counterparty_email?: string | null;
  invoice_number?: string | null;
  invoice_due_date?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  tags?: string[];
}): Transaction {
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO transactions
      (org, date, paid_at, direction, transaction_type, amount_cents, currency,
       vendor, description, category_id, status, payment_method, payment_reference,
       counterparty_email, invoice_number, invoice_due_date, notes, source, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', ?, ?)
  `).run(
    data.org, data.date, data.paid_at ?? null,
    data.direction, data.transaction_type, data.amount_cents,
    data.currency ?? 'CAD', data.vendor ?? null, data.description ?? null,
    data.category_id ?? null,
    data.status ?? (data.transaction_type === 'invoice' ? 'pending' : 'paid'),
    data.payment_method ?? null, data.payment_reference ?? null,
    data.counterparty_email ?? null, data.invoice_number ?? null,
    data.invoice_due_date ?? null, data.notes ?? null, now, now,
  );
  const id = result.lastInsertRowid as number;
  if (data.tags?.length) {
    const insertTag = db.prepare('INSERT INTO transaction_tags (transaction_id, tag_id) VALUES (?, ?)');
    db.transaction(() => {
      for (const name of data.tags!) {
        const tagId = upsertTag(data.org, name);
        insertTag.run(id, tagId);
      }
    })();
  }
  return getTransaction(id)!;
}

export function updateTransaction(id: number, data: Partial<Omit<Transaction, 'id' | 'org' | 'created_at' | 'source'>> & { tags?: string[] }): Transaction | null {
  const now = new Date().toISOString();
  const allowed = ['date','paid_at','direction','transaction_type','amount_cents','currency',
    'vendor','description','category_id','status','payment_method','payment_reference',
    'counterparty_email','invoice_number','invoice_due_date','notes'];
  const fields: string[] = [];
  const params: unknown[] = [];
  for (const key of allowed) {
    if (key in data) { fields.push(`${key} = ?`); params.push((data as Record<string,unknown>)[key] ?? null); }
  }
  if (!fields.length && !data.tags) return getTransaction(id);
  if (fields.length) {
    fields.push('updated_at = ?');
    params.push(now, id);
    db.prepare(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  }
  if (data.tags !== undefined) {
    const txn = db.prepare('SELECT org FROM transactions WHERE id = ?').get(id) as { org: string } | undefined;
    if (txn) {
      db.prepare('DELETE FROM transaction_tags WHERE transaction_id = ?').run(id);
      const insertTag = db.prepare('INSERT INTO transaction_tags (transaction_id, tag_id) VALUES (?, ?)');
      db.transaction(() => {
        for (const name of data.tags!) {
          const tagId = upsertTag(txn.org, name);
          insertTag.run(id, tagId);
        }
      })();
    }
  }
  return getTransaction(id);
}

export function deleteTransaction(id: number): void {
  db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
}

// ── Outstanding invoices helper ────────────────────────────────────────────

export function listOutstandingInvoices(org: string): Transaction[] {
  return listTransactions(org, { transaction_type: 'invoice', status: 'pending' });
}

// ── Recurring Schedules ────────────────────────────────────────────────────

function hydrateSchedule(row: Record<string, unknown>): RecurringSchedule {
  const tagRows = db.prepare(`
    SELECT t.name FROM tags t
    JOIN recurring_schedule_tags rst ON rst.tag_id = t.id
    WHERE rst.schedule_id = ?
  `).all(row.id as number) as { name: string }[];
  return { ...row, tags: tagRows.map((r) => r.name) } as RecurringSchedule;
}

export function listSchedules(org: string, opts?: { activeOnly?: boolean }): RecurringSchedule[] {
  let sql = `
    SELECT rs.*, c.name AS category_name, c.color AS category_color,
      CASE rs.cadence
        WHEN 'weekly'    THEN rs.amount_cents * 52 / 12
        WHEN 'monthly'   THEN rs.amount_cents
        WHEN 'quarterly' THEN rs.amount_cents / 3
        WHEN 'annual'    THEN rs.amount_cents / 12
        WHEN 'custom'    THEN rs.amount_cents * 365 / (rs.cadence_interval_days * 12)
      END AS monthly_equivalent_cents
    FROM recurring_schedules rs
    LEFT JOIN categories c ON c.id = rs.category_id
    WHERE rs.org = ?
  `;
  const params: unknown[] = [org];
  if (opts?.activeOnly) { sql += ' AND rs.active = 1'; }
  sql += ' ORDER BY rs.vendor ASC';
  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
  return rows.map(hydrateSchedule);
}

export function createSchedule(data: {
  org: string; vendor: string; description?: string | null;
  amount_cents: number; currency?: 'CAD' | 'USD';
  category_id?: number | null; direction: 'income' | 'expense';
  cadence: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  cadence_interval_days?: number | null;
  start_date: string; next_bill_date: string; end_date?: string | null;
  payment_method?: string | null; counterparty_email?: string | null;
  notes?: string | null; tags?: string[];
}): RecurringSchedule {
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO recurring_schedules
      (org, vendor, description, amount_cents, currency, category_id, direction,
       cadence, cadence_interval_days, start_date, next_bill_date, end_date,
       active, payment_method, counterparty_email, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
  `).run(
    data.org, data.vendor, data.description ?? null, data.amount_cents,
    data.currency ?? 'CAD', data.category_id ?? null, data.direction,
    data.cadence, data.cadence_interval_days ?? null,
    data.start_date, data.next_bill_date, data.end_date ?? null,
    data.payment_method ?? null, data.counterparty_email ?? null,
    data.notes ?? null, now, now,
  );
  const id = result.lastInsertRowid as number;
  if (data.tags?.length) {
    const insertTag = db.prepare('INSERT INTO recurring_schedule_tags (schedule_id, tag_id) VALUES (?, ?)');
    db.transaction(() => {
      for (const name of data.tags!) {
        const tagId = upsertTag(data.org, name);
        insertTag.run(id, tagId);
      }
    })();
  }
  return listSchedules(data.org).find((s) => s.id === id)!;
}

// ── Aggregates for charts ──────────────────────────────────────────────────

export interface MonthlySummary {
  month: string;
  income_cents: number;
  expense_cents: number;
  net_cents: number;
}

export function getMonthlySummaries(org: string, months = 12): MonthlySummary[] {
  return db.prepare(`
    SELECT
      strftime('%Y-%m', date) AS month,
      SUM(CASE WHEN direction='income'  AND status='paid' THEN amount_cents ELSE 0 END) AS income_cents,
      SUM(CASE WHEN direction='expense' AND status='paid' THEN amount_cents ELSE 0 END) AS expense_cents,
      SUM(CASE WHEN direction='income'  AND status='paid' THEN amount_cents ELSE 0 END) -
      SUM(CASE WHEN direction='expense' AND status='paid' THEN amount_cents ELSE 0 END) AS net_cents
    FROM transactions
    WHERE org = ? AND date >= date('now', ? || ' months')
    GROUP BY month
    ORDER BY month ASC
  `).all(org, `-${months}`) as MonthlySummary[];
}

export interface CategoryBreakdown {
  category_id: number | null;
  category: string;
  color: string | null;
  total_cents: number;
  count: number;
}

export function getCategoryBreakdown(org: string, direction: 'expense' | 'income' = 'expense', from?: string, to?: string): CategoryBreakdown[] {
  let sql = `
    SELECT c.id AS category_id, COALESCE(c.name, 'Uncategorized') AS category,
      c.color, SUM(t.amount_cents) AS total_cents, COUNT(*) AS count
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.org = ? AND t.direction = ? AND t.status = 'paid'
  `;
  const params: unknown[] = [org, direction];
  if (from) { sql += ' AND t.date >= ?'; params.push(from); }
  if (to) { sql += ' AND t.date <= ?'; params.push(to); }
  sql += ' GROUP BY c.id ORDER BY total_cents DESC';
  return db.prepare(sql).all(...params) as CategoryBreakdown[];
}

export function getSubscriptionBurnRate(org: string): number {
  const rows = db.prepare(`
    SELECT monthly_equivalent_cents FROM v_active_subscription_monthly WHERE org = ?
  `).all(org) as { monthly_equivalent_cents: number }[];
  return rows.reduce((sum, r) => sum + (r.monthly_equivalent_cents ?? 0), 0);
}

export interface RunwaySummary {
  cash_balance_cents: number;
  avg_monthly_burn_cents: number;
  runway_months: number | null;
  snapshot_date: string | null;
}

export function getRunway(org: string): RunwaySummary {
  const snapshot = db.prepare(`
    SELECT balance_cents, snapshot_date FROM cash_balance_snapshots
    WHERE org = ? ORDER BY snapshot_date DESC LIMIT 1
  `).get(org) as { balance_cents: number; snapshot_date: string } | undefined;

  const burnRows = db.prepare(`
    SELECT AVG(expense_cents) AS avg_burn FROM v_monthly_net
    WHERE month >= strftime('%Y-%m', date('now', '-3 months'))
  `).get() as { avg_burn: number } | undefined;

  const cash = snapshot?.balance_cents ?? 0;
  const burn = burnRows?.avg_burn ?? 0;
  return {
    cash_balance_cents: cash,
    avg_monthly_burn_cents: Math.round(burn),
    runway_months: burn > 0 ? Math.round((cash / burn) * 10) / 10 : null,
    snapshot_date: snapshot?.snapshot_date ?? null,
  };
}

export function getLastCashSnapshotAge(org: string): number | null {
  const row = db.prepare(`
    SELECT snapshot_date FROM cash_balance_snapshots
    WHERE org = ? ORDER BY snapshot_date DESC LIMIT 1
  `).get(org) as { snapshot_date: string } | undefined;
  if (!row) return null;
  const daysDiff = (Date.now() - new Date(row.snapshot_date).getTime()) / 86400000;
  return Math.floor(daysDiff);
}

export function updateCashBalance(org: string, balance_cents: number, notes?: string): void {
  const today = new Date().toISOString().slice(0, 10);
  db.prepare(`
    INSERT OR REPLACE INTO cash_balance_snapshots (org, snapshot_date, balance_cents, source, notes)
    VALUES (?, ?, ?, 'manual', ?)
  `).run(org, today, balance_cents, notes ?? null);
}
