'use client';

import { useEffect, useState, useCallback } from 'react';
import { useOrg } from '@/hooks/use-org';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  IconTrendingUp, IconTrendingDown, IconClock, IconAlertTriangle,
  IconPlus, IconDownload, IconRefresh, IconTrash, IconEdit,
  IconCreditCard, IconReceipt, IconCalendar, IconBuilding,
  IconTag, IconChevronDown, IconCheck, IconX,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Transaction, RecurringSchedule, Category, MonthlySummary, CategoryBreakdown } from '@/lib/data/expenses';

// ── Types ──────────────────────────────────────────────────────────────────

interface Summary {
  subscription_burn_cents: number;
  month_expenses_cents: number;
  month_income_cents: number;
  net_cents: number;
  cash_snapshot_age_days: number | null;
  runway: { runway_months: number | null; cash_balance_cents: number; avg_monthly_burn_cents: number; snapshot_date: string | null };
}

type TimeWindow = 'this_month' | 'last_month' | 'last_3_months' | 'last_12_months' | 'ytd' | 'all';

// ── Helpers ────────────────────────────────────────────────────────────────

function cents(n: number) {
  return `$${(n / 100).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeWindowToRange(tw: TimeWindow): { from?: string; to?: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  if (tw === 'this_month') {
    return { from: fmt(new Date(today.getFullYear(), today.getMonth(), 1)) };
  }
  if (tw === 'last_month') {
    const f = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const t = new Date(today.getFullYear(), today.getMonth(), 0);
    return { from: fmt(f), to: fmt(t) };
  }
  if (tw === 'last_3_months') {
    const f = new Date(today); f.setMonth(f.getMonth() - 3);
    return { from: fmt(f) };
  }
  if (tw === 'last_12_months') {
    const f = new Date(today); f.setFullYear(f.getFullYear() - 1);
    return { from: fmt(f) };
  }
  if (tw === 'ytd') {
    return { from: `${today.getFullYear()}-01-01` };
  }
  return {};
}

function statusColor(status: string) {
  if (status === 'paid') return 'bg-emerald-100 text-emerald-800';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (status === 'overdue') return 'bg-red-100 text-red-800';
  if (status === 'void') return 'bg-gray-100 text-gray-500';
  return 'bg-gray-100 text-gray-700';
}

function directionIcon(direction: string) {
  return direction === 'income'
    ? <IconTrendingUp className="w-4 h-4 text-emerald-600" />
    : <IconTrendingDown className="w-4 h-4 text-red-500" />;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, icon, alert }: {
  label: string; value: string; sub?: string; icon?: React.ReactNode; alert?: boolean;
}) {
  return (
    <Card className={alert ? 'border-yellow-300' : ''}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div style={{ height: 240 }}>{children}</div>
      </CardContent>
    </Card>
  );
}

// ── Add Transaction Sheet ──────────────────────────────────────────────────

function AddTransactionSheet({
  open, onClose, categories, org,
  onCreated,
}: {
  open: boolean; onClose: () => void;
  categories: Category[]; org: string;
  onCreated: () => void;
}) {
  const [direction, setDirection] = useState<'expense' | 'income'>('expense');
  const [txnType, setTxnType] = useState<'one_time' | 'subscription' | 'invoice'>('one_time');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [currency, setCurrency] = useState<'CAD' | 'USD'>('CAD');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [counterpartyEmail, setCounterpartyEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org, direction, transaction_type: txnType,
          amount, date, vendor: vendor || null, description: description || null,
          category_id: categoryId ? parseInt(categoryId) : null,
          currency, payment_method: paymentMethod || null,
          payment_reference: paymentRef || null,
          counterparty_email: counterpartyEmail || null,
          invoice_number: invoiceNumber || null,
          invoice_due_date: invoiceDueDate || null,
          notes: notes || null,
          tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        }),
      });
      onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Transaction</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type + Direction toggles */}
          <div className="flex gap-2 flex-wrap">
            {(['one_time', 'subscription', 'invoice'] as const).map((t) => (
              <button key={t} type="button"
                onClick={() => setTxnType(t)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${txnType === t ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted'}`}>
                {t === 'one_time' ? 'One-time' : t === 'subscription' ? 'Subscription' : 'Invoice'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(['expense', 'income'] as const).map((d) => (
              <button key={d} type="button"
                onClick={() => setDirection(d)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${direction === d ? (d === 'expense' ? 'bg-red-600 text-white border-red-600' : 'bg-emerald-600 text-white border-emerald-600') : 'bg-background text-muted-foreground hover:bg-muted'}`}>
                {direction === d ? (d === 'expense' ? '↓ Expense' : '↑ Income') : (d === 'expense' ? 'Expense' : 'Income')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="txn-amount">Amount</Label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-2 border border-r-0 rounded-l-md text-sm text-muted-foreground bg-muted">$</span>
                <Input id="txn-amount" type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-l-none" placeholder="0.00" />
              </div>
            </div>
            <div>
              <Label htmlFor="txn-currency">Currency</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as 'CAD' | 'USD')}>
                <SelectTrigger id="txn-currency" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="txn-date">Date</Label>
            <Input id="txn-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="txn-vendor">{direction === 'income' ? 'Payer / Client' : 'Vendor / Payee'}</Label>
            <Input id="txn-vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} className="mt-1" placeholder={direction === 'income' ? 'e.g. Reyco Marine' : 'e.g. Stripe'} />
          </div>

          <div>
            <Label htmlFor="txn-desc">Description</Label>
            <Input id="txn-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="txn-cat">Category</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')}>
              <SelectTrigger id="txn-cat" className="mt-1"><SelectValue placeholder="Uncategorized" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    <span className="flex items-center gap-2">
                      {c.color && <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />}
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="txn-tags">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
            <Input id="txn-tags" value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1" placeholder="e.g. reyco, q2-2026" />
          </div>

          <div>
            <Label htmlFor="txn-pay-method">Payment Method</Label>
            <Input id="txn-pay-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1" placeholder="e.g. e_transfer, credit_card" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="txn-pay-ref">Payment Reference</Label>
              <Input id="txn-pay-ref" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="mt-1" placeholder="e-transfer #, cheque #" />
            </div>
            <div>
              <Label htmlFor="txn-cpty">{direction === 'income' ? 'Client Email' : 'Vendor Email'}</Label>
              <Input id="txn-cpty" type="email" value={counterpartyEmail} onChange={(e) => setCounterpartyEmail(e.target.value)} className="mt-1" />
            </div>
          </div>

          {txnType === 'invoice' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="txn-inv-num">Invoice #</Label>
                <Input id="txn-inv-num" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="txn-inv-due">Due Date</Label>
                <Input id="txn-inv-due" type="date" value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} className="mt-1" />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="txn-notes">Notes</Label>
            <Textarea id="txn-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" rows={2} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving…' : 'Add Transaction'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ── Cash Balance Sheet ─────────────────────────────────────────────────────

function CashBalanceSheet({ open, onClose, org, onUpdated }: {
  open: boolean; onClose: () => void; org: string; onUpdated: () => void;
}) {
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'update_cash_balance', org, balance, notes }),
      });
      onUpdated();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[360px]">
        <SheetHeader>
          <SheetTitle>Update Cash Balance</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="cash-balance">Current balance (CAD)</Label>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-2 border border-r-0 rounded-l-md text-sm text-muted-foreground bg-muted">$</span>
              <Input id="cash-balance" type="number" step="0.01" min="0" required value={balance} onChange={(e) => setBalance(e.target.value)} className="rounded-l-none" placeholder="0.00" />
            </div>
          </div>
          <div>
            <Label htmlFor="cash-notes">Notes</Label>
            <Input id="cash-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" placeholder="e.g. RBC chequing as of Apr 25" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving…' : 'Update Balance'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AccountingPage() {
  const { currentOrg } = useOrg();
  const org = currentOrg !== 'all' ? currentOrg : 'glv';

  const [timeWindow, setTimeWindow] = useState<TimeWindow>('ytd');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<MonthlySummary[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [cashOpen, setCashOpen] = useState(false);
  const [cashDismissed, setCashDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [dirFilter, setDirFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'one_time' | 'subscription' | 'invoice'>('all');

  const { from, to } = timeWindowToRange(timeWindow);

  const loadData = useCallback(async () => {
    setLoading(true);
    const qs = `org=${encodeURIComponent(org)}`;
    const rangeQs = (from ? `&from=${from}` : '') + (to ? `&to=${to}` : '');
    try {
      const [sumRes, monthRes, catRes, txnRes, catListRes] = await Promise.all([
        fetch(`/api/expenses?view=summary&${qs}`),
        fetch(`/api/expenses?view=monthly&months=12&${qs}`),
        fetch(`/api/expenses?view=categories&direction=expense&${qs}${rangeQs}`),
        fetch(`/api/expenses?${qs}${rangeQs}&limit=500`),
        fetch(`/api/expenses?view=category-list&${qs}`),
      ]);
      const [sum, mon, cat, txns, catList] = await Promise.all([
        sumRes.json(), monthRes.json(), catRes.json(), txnRes.json(), catListRes.json(),
      ]);
      setSummary(sum);
      setMonthly(mon.monthly ?? []);
      setCategoryBreakdown(cat.categories ?? []);
      setTransactions(txns.transactions ?? []);
      setCategories(catList.categories ?? []);
    } finally {
      setLoading(false);
    }
  }, [org, from, to]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredTransactions = transactions.filter((t) => {
    if (dirFilter !== 'all' && t.direction !== dirFilter) return false;
    if (typeFilter !== 'all' && t.transaction_type !== typeFilter) return false;
    return true;
  });

  const outstandingInvoices = transactions.filter(
    (t) => t.transaction_type === 'invoice' && (t.status === 'pending' || t.status === 'overdue')
  );

  const cashAge = summary?.cash_snapshot_age_days;
  const showCashBanner = !cashDismissed && cashAge !== null && cashAge !== undefined && cashAge > 7;
  const cashBannerUrgent = cashAge !== null && cashAge !== undefined && cashAge > 14;

  async function handleDelete(id: number) {
    if (!confirm('Delete this transaction?')) return;
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    loadData();
  }

  const timeWindowLabels: Record<TimeWindow, string> = {
    this_month: 'This Month', last_month: 'Last Month',
    last_3_months: 'Last 3 Months', last_12_months: 'Last 12 Months',
    ytd: 'Year to Date', all: 'All Time',
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Accounting</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? 'Loading…' : `${transactions.length} transactions · ${categories.length} categories`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open(`/api/expenses?view=csv&org=${org}`, '_blank')}>
            <IconDownload className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <IconPlus className="w-4 h-4 mr-1.5" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Time-window selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Showing:</span>
        {(Object.keys(timeWindowLabels) as TimeWindow[]).map((tw) => (
          <button key={tw} onClick={() => setTimeWindow(tw)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${timeWindow === tw ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}>
            {timeWindowLabels[tw]}
          </button>
        ))}
      </div>

      {/* Cash balance banner */}
      {showCashBanner && (
        <div className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${cashBannerUrgent ? 'bg-red-50 border-red-300 text-red-800' : 'bg-yellow-50 border-yellow-300 text-yellow-800'}`}>
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">
              Cash balance snapshot is {cashAge} days old — runway estimate may be stale.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setCashOpen(true)}>
              Update balance
            </Button>
            {!cashBannerUrgent && (
              <button onClick={() => setCashDismissed(true)} className="text-yellow-600 hover:text-yellow-800">
                <IconX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Subscription Burn"
          value={loading ? '—' : cents(summary?.subscription_burn_cents ?? 0)}
          sub="/mo active subscriptions"
          icon={<IconCreditCard className="w-5 h-5" />}
        />
        <SummaryCard
          label={`Net (${timeWindowLabels[timeWindow]})`}
          value={loading ? '—' : cents(summary?.net_cents ?? 0)}
          sub={summary?.net_cents != null ? (summary.net_cents >= 0 ? '▲ surplus' : '▼ deficit') : undefined}
          icon={summary?.net_cents != null && summary.net_cents >= 0
            ? <IconTrendingUp className="w-5 h-5 text-emerald-600" />
            : <IconTrendingDown className="w-5 h-5 text-red-500" />}
        />
        <SummaryCard
          label="Runway"
          value={loading ? '—' : (summary?.runway.runway_months != null ? `${summary.runway.runway_months} mo` : 'N/A')}
          sub={summary?.runway.snapshot_date ? `Balance: ${cents(summary.runway.cash_balance_cents)}` : 'No balance snapshot'}
          icon={<IconClock className="w-5 h-5" />}
          alert={!!(summary?.runway.runway_months != null && summary.runway.runway_months < 6)}
        />
        <SummaryCard
          label="Outstanding Invoices"
          value={loading ? '—' : String(outstandingInvoices.length)}
          sub={outstandingInvoices.filter((t) => t.status === 'overdue').length > 0
            ? `${outstandingInvoices.filter((t) => t.status === 'overdue').length} overdue`
            : 'none overdue'}
          icon={<IconReceipt className="w-5 h-5" />}
          alert={outstandingInvoices.some((t) => t.status === 'overdue')}
        />
      </div>

      {/* Charts 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Burn rate */}
        <ChartCard title="Monthly Expenses" subtitle="Paid expenses by month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: 0, right: 8 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} width={52} />
              <Tooltip formatter={(v) => cents(Number(v))} />
              <Bar dataKey="expense_cents" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* By category */}
        <ChartCard title="By Category" subtitle="Expense breakdown">
          {categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="total_cents" nameKey="category"
                  cx="50%" cy="50%" outerRadius={90} label={(props) => (props as { category?: string }).category ?? ''}>

                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color ?? `hsl(${i * 60}, 60%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => cents(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No expense data
            </div>
          )}
        </ChartCard>

        {/* Income vs Expense */}
        <ChartCard title="Income vs Expense" subtitle="Monthly comparison">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly} margin={{ left: 0, right: 8 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} width={52} />
              <Tooltip formatter={(v) => cents(Number(v))} />
              <Legend />
              <Bar dataKey="income_cents" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense_cents" name="Expense" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Net trend */}
        <ChartCard title="Net (Monthly)" subtitle="Income minus expenses">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly} margin={{ left: 0, right: 8 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} width={52} />
              <Tooltip formatter={(v) => cents(Number(v))} />
              <Line type="monotone" dataKey="net_cents" name="Net" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="transactions">
            Transactions
            <Badge variant="secondary" className="ml-1.5 text-xs">{filteredTransactions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="outstanding">
            Outstanding
            {outstandingInvoices.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 text-xs">{outstandingInvoices.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Filters bar */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <Select value={dirFilter} onValueChange={(v) => setDirFilter(v as typeof dirFilter)}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All directions</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="one_time">One-time</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={loadData}>
            <IconRefresh className="w-3.5 h-3.5 mr-1" />Refresh
          </Button>
        </div>

        {/* Transactions tab */}
        <TabsContent value="transactions" className="mt-3">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-xs text-muted-foreground">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Vendor</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Type</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Status</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="w-8 p-3" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">Loading…</td></tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">No transactions</td></tr>
                ) : filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-3 tabular-nums text-xs">{t.date}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        {directionIcon(t.direction)}
                        <span className="font-medium truncate max-w-[140px]">{t.vendor || t.description || '—'}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      {t.category_name ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          {t.category_color && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.category_color }} />}
                          {t.category_name}
                        </span>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground capitalize">{t.transaction_type.replace('_', ' ')}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className={`p-3 text-right tabular-nums font-semibold ${t.direction === 'income' ? 'text-emerald-600' : ''}`}>
                      {t.direction === 'income' ? '+' : ''}{cents(t.amount_cents)}
                      {t.currency !== 'CAD' && <span className="ml-1 text-xs text-muted-foreground">{t.currency}</span>}
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Outstanding invoices tab */}
        <TabsContent value="outstanding" className="mt-3">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-xs text-muted-foreground">
                  <th className="text-left p-3 font-medium">Invoice #</th>
                  <th className="text-left p-3 font-medium">Payer</th>
                  <th className="text-left p-3 font-medium">Issued</th>
                  <th className="text-left p-3 font-medium">Due</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {outstandingInvoices.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">No outstanding invoices</td></tr>
                ) : outstandingInvoices.map((t) => {
                  const daysLate = t.invoice_due_date
                    ? Math.floor((Date.now() - new Date(t.invoice_due_date).getTime()) / 86400000)
                    : null;
                  return (
                    <tr key={t.id} className="border-t hover:bg-muted/30">
                      <td className="p-3 font-mono text-xs">{t.invoice_number || '—'}</td>
                      <td className="p-3">{t.vendor || t.counterparty_email || '—'}</td>
                      <td className="p-3 text-xs tabular-nums">{t.date}</td>
                      <td className="p-3 text-xs tabular-nums">{t.invoice_due_date || '—'}</td>
                      <td className="p-3">
                        {daysLate != null && daysLate > 0 ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${daysLate > 30 ? 'bg-red-100 text-red-800' : daysLate > 7 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {daysLate}d late
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">pending</span>
                        )}
                      </td>
                      <td className="p-3 text-right tabular-nums font-semibold text-emerald-600">
                        +{cents(t.amount_cents)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sheets */}
      <AddTransactionSheet
        open={addOpen} onClose={() => setAddOpen(false)}
        categories={categories} org={org}
        onCreated={loadData}
      />
      <CashBalanceSheet
        open={cashOpen} onClose={() => setCashOpen(false)}
        org={org} onUpdated={loadData}
      />
    </div>
  );
}
