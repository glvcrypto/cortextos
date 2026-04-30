# cortextOS Dashboard — Expense Tracking Page UI/UX Spec

**Date:** 2026-04-25
**Route:** `/dashboard/accounting`
**Owners:** dev (build), analyst (schema + reporting), designer (this spec)
**Design system:** existing dashboard tokens (Sora font, oklch tokens in `globals.css`, shadcn "base-nova" + Tabler icons)
**Aligned with:** analyst's `expense-tracking-schema-and-reporting-spec.md` v1 (2026-04-25)
**Dev decisions confirmed:** Recharts, Sheet drawer, inline receipt upload, combined Combobox category picker

---

## Page goal

Single-page financial cockpit for GLV's internal books: log expenses + income, track subscriptions through their lifecycle, see burn / runway / outstanding invoices, export CRA-tax-line-mapped CSV for the accountant.

Internal-only. GLV-scoped (org=glv) for v1; multi-org schema-ready per analyst.

---

## Page structure (top → bottom)

```
┌─ HEADER ──────────────────────────────────────────────────────────┐
│  [Title + subtitle]                          [Export CSV] [+ Add] │
├─ TIME-WINDOW BAR ─────────────────────────────────────────────────┤
│  [YTD ▾] (presets + custom)         affects ALL charts + summary  │
├─ SUMMARY CARDS ROW (4 cards) ─────────────────────────────────────┤
│  [Burn /mo]  [Net (window)]  [Runway]  [Outstanding Invoices]     │
├─ CASH BALANCE PROMPT (conditional) ───────────────────────────────┤
│  Banner if last snapshot >7 days old: "Update cash balance"       │
├─ CHARTS GRID (2x2) ───────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐                              │
│  │ Burn rate    │  │ By category  │                              │
│  │ + 3-mo avg   │  │ pie          │                              │
│  └──────────────┘  └──────────────┘                              │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │ Income vs    │  │ Subscription │                              │
│  │ Expense      │  │ totals h-bar │                              │
│  └──────────────┘  └──────────────┘                              │
├─ TABS ────────────────────────────────────────────────────────────┤
│  [ Transactions | Subscriptions | Outstanding Invoices ]          │
├─ FILTERS BAR ─────────────────────────────────────────────────────┤
│  [Direction ▾] [Type ▾] [Category ▾] [Tag ▾] [Status ▾] [Search] │
├─ TABLE (varies per tab) ──────────────────────────────────────────┤
└───────────────────────────────────────────────────────────────────┘
```

Page wrapper mirrors existing `/clients` page: `<div className="flex flex-col gap-6 p-6">`. No new layout primitives.

---

## 1. Header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-xl font-semibold">Accounting</h1>
    <p className="text-sm text-muted-foreground mt-0.5">
      {txnCount} transactions · {activeSubsCount} active subscriptions
    </p>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" onClick={() => setExportSheetOpen(true)}>
      <IconDownload size={14} className="mr-1.5" />
      Export CSV
    </Button>
    <Button size="sm" onClick={() => setAddSheetOpen(true)}>
      <IconPlus size={14} className="mr-1.5" />
      Add Transaction
    </Button>
  </div>
</div>
```

Matches `/clients` header (text-xl semibold + muted subtitle). Add Transaction is the primary action. Export opens a Sheet with filter + format options (per analyst's CSV spec).

---

## 2. Time-window selector

Single global selector that drives all summary cards + all 4 charts simultaneously (per analyst reporting spec).

```tsx
<div className="flex items-center gap-2">
  <span className="text-xs text-muted-foreground uppercase tracking-wide">Window:</span>
  <Select value={window} onValueChange={setWindow}>
    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectItem value="ytd">Year to date</SelectItem>
      <SelectItem value="this-month">This month</SelectItem>
      <SelectItem value="last-month">Last month</SelectItem>
      <SelectItem value="last-3-months">Last 3 months</SelectItem>
      <SelectItem value="last-12-months">Last 12 months</SelectItem>
      <SelectItem value="this-quarter">This quarter</SelectItem>
      <SelectItem value="custom">Custom range...</SelectItem>
    </SelectContent>
  </Select>
  {window === 'custom' && <DateRangePicker value={range} onChange={setRange} />}
  <span className="text-xs text-muted-foreground ml-auto">
    {formatRange(resolvedRange)}
  </span>
</div>
```

**Default = YTD** per analyst. Resolved range printed on the right so the user always knows the actual window the page is reporting on.

---

## 3. Summary cards (4 cards)

Aligned to analyst's reporting spec: burn rate, net, runway big number, outstanding invoices count.

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <SummaryCard
    label="Burn (current /mo)"
    value="$1,287"
    delta={`${activeSubsCount} active subs`}
    deltaTone="muted"
    icon={IconRefresh}
  />
  <SummaryCard
    label="Net (window)"
    value="-$4,450"
    delta="trending negative"
    deltaTone={net < 0 ? 'destructive' : 'success'}
    icon={IconScale}
  />
  <SummaryCard
    label="Runway"
    value="4.2 mo"
    delta="at current burn"
    deltaTone={runway < 3 ? 'destructive' : runway < 6 ? 'warning' : 'success'}
    icon={IconRoadOff}
    tooltip="latest cash balance ÷ avg net burn (last 3 mo)"
  />
  <SummaryCard
    label="Outstanding Invoices"
    value={`$${outstandingTotal.toLocaleString()}`}
    delta={`${overdueCount} overdue`}
    deltaTone={overdueCount > 0 ? 'warning' : 'muted'}
    icon={IconFileInvoice}
    onClick={() => setActiveTab('outstanding-invoices')}
  />
</div>
```

`<SummaryCard>` pattern:

```tsx
<Card className={onClick ? 'cursor-pointer' : ''} onClick={onClick}>
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      {tooltip ? (
        <Tooltip><TooltipTrigger><Icon size={14} className="text-muted-foreground" /></TooltipTrigger><TooltipContent>{tooltip}</TooltipContent></Tooltip>
      ) : (
        <Icon size={14} className="text-muted-foreground" />
      )}
    </div>
  </CardHeader>
  <CardContent className="pt-0">
    <div className="text-2xl font-semibold tabular-nums">{value}</div>
    <p className={cn(
      "text-xs mt-1",
      deltaTone === 'warning' && 'text-yellow-600',
      deltaTone === 'destructive' && 'text-red-600',
      deltaTone === 'success' && 'text-green-600',
      deltaTone === 'muted' && 'text-muted-foreground'
    )}>
      {delta}
    </p>
  </CardContent>
</Card>
```

`tabular-nums` aligns dollar amounts column-to-column. Runway threshold colors are intentional: <3mo = destructive (alarm), <6mo = warning (heads-up), ≥6mo = success (healthy).

The Outstanding Invoices card is clickable — jumps the user straight to the Outstanding Invoices tab, since that's the actionable surface.

---

## 4. Cash balance prompt (conditional banner)

Shown above charts only when `latest cash_balance_snapshot.snapshot_date < today - 7 days`.

```tsx
{cashStale && !dismissedThisSession && (
  <Card className={cn(
    daysSinceSnapshot > 14
      ? "border-red-300 bg-red-50 dark:bg-red-950/20"
      : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20"
  )}>
    <CardContent className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <IconAlertCircle size={16} className={daysSinceSnapshot > 14 ? "text-red-600" : "text-yellow-600"} />
        <span className="text-sm">
          Cash balance is {daysSinceSnapshot} days old. Runway calculation may be stale.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setCashSheetOpen(true)}>
          Update balance
        </Button>
        {daysSinceSnapshot <= 14 && (
          <button onClick={() => dismissThisSession()} className="text-muted-foreground hover:text-foreground">
            <IconX size={14} />
          </button>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

Click "Update balance" → opens a small Sheet with one number input (current cash balance, CAD) + Save. Writes to `cash_balance_snapshots`.

**Banner aggression** (per analyst v1.1):
- 7-14d stale: yellow, dismissible per session
- >14d stale: red, **non-dismissible** until user updates (runway data is too unreliable to ignore)

---

## 5. Charts grid (2x2 layout)

Per analyst's canonical chart set. All 4 charts respect the global time window.

```tsx
<div>
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
    Insights
  </h2>
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <ChartCard title="Burn rate" subtitle="Monthly expenses + 3-mo rolling avg">
      <BurnChart data={burnData} />
    </ChartCard>
    <ChartCard title="By category" subtitle="Expense breakdown for window">
      <CategoryPie data={categoryData} />
    </ChartCard>
    <ChartCard title="Income vs Expense" subtitle="Monthly comparison + net">
      <IncomeVsExpenseChart data={ieData} />
    </ChartCard>
    <ChartCard title="Subscriptions" subtitle="Top vendors by monthly equivalent">
      <SubscriptionBars data={subsData} />
    </ChartCard>
  </div>
</div>
```

### ChartCard wrapper

```tsx
<Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-semibold">{title}</CardTitle>
    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
  </CardHeader>
  <CardContent className="h-[260px]">
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </CardContent>
</Card>
```

Fixed 260px height keeps the grid balanced.

### Chart color contract — uses `categories.color` from DB

Per analyst: the by-category pie + subscription bars + any series grouped by category MUST use `categories.color` (hex) from the DB. This keeps the legend consistent across charts and across page reloads when categories are added/edited.

Seeded category colors (from analyst):
- Software → `#3b82f6` (blue)
- Marketing → `#10b981` (green)
- Travel → `#f59e0b` (amber)

For non-category series:
- Income (in income-vs-expense) → `var(--chart-5)` (green ≈ #16a34a) — matches the success token
- Expense (in income-vs-expense) → `var(--destructive)` — signals red intentionally
- Burn rate line → `var(--chart-1)` (gold) — primary metric token
- 3-mo rolling avg overlay → `var(--muted-foreground)` (gray, dashed)

### Drill-down behavior (per analyst spec)

- Click a category pie segment → sets `category` filter + scrolls to Transactions tab
- Click a burn-rate month bar → sets time window to that month + Transactions tab
- Click a subscription vendor bar → opens Subscription detail Sheet (history of materialized billings)
- Click a stacked income/expense bar → sets month + direction filter + Transactions tab

Implement with Recharts `onClick` handlers on the relevant `<Bar>`, `<Pie>`, `<Cell>` elements.

---

## 6. Tabs

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="transactions">
      Transactions <Badge variant="secondary" className="ml-2">{counts.txns}</Badge>
    </TabsTrigger>
    <TabsTrigger value="subscriptions">
      Subscriptions <Badge variant="secondary" className="ml-2">{counts.subs}</Badge>
    </TabsTrigger>
    <TabsTrigger value="outstanding-invoices">
      Outstanding <Badge variant="destructive" className="ml-2">{counts.overdue}</Badge>
      <Badge variant="secondary" className="ml-1">{counts.outstanding}</Badge>
    </TabsTrigger>
  </TabsList>
  <TabsContent value="transactions">{/* table A */}</TabsContent>
  <TabsContent value="subscriptions">{/* table B */}</TabsContent>
  <TabsContent value="outstanding-invoices">{/* table C */}</TabsContent>
</Tabs>
```

Subscriptions and Outstanding Invoices are their own tabs (not just filtered views) per analyst — different lifecycle states + different sort defaults + different action affordances.

The Outstanding tab shows TWO badges: red destructive count of overdue, plus muted secondary count of all outstanding. Visually triages "is anything on fire" at a glance.

---

## 7. Filters bar

Above the table, applies to whichever tab is active. Filter visibility adapts to tab:

```tsx
<div className="flex flex-wrap items-center gap-2">
  {tab === 'transactions' && (
    <>
      <Select value={direction} onValueChange={setDirection}>
        <SelectTrigger className="w-[130px]"><SelectValue placeholder="All" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </SelectContent>
      </Select>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Types" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="one_time">One-time</SelectItem>
          <SelectItem value="subscription">Subscription</SelectItem>
          <SelectItem value="invoice">Invoice</SelectItem>
        </SelectContent>
      </Select>
    </>
  )}
  {tab === 'subscriptions' && (
    <Select value={subStatus} onValueChange={setSubStatus}>
      <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="paused">Paused</SelectItem>
        <SelectItem value="ended">Ended</SelectItem>
        <SelectItem value="all">All</SelectItem>
      </SelectContent>
    </Select>
  )}
  <CategorySelect value={category} onChange={setCategory} />  {/* options from categories table */}
  <TagPicker value={tags} onChange={setTags} placeholder="Tags" />
  {tab === 'transactions' && (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="overdue">Overdue</SelectItem>
        <SelectItem value="void">Void</SelectItem>
      </SelectContent>
    </Select>
  )}
  <Input
    placeholder="Search vendor or description..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-[240px] ml-auto"
  />
</div>
```

Time window is the global selector at the top — not duplicated here. Filters bar = "scope within window."

---

## 8. Tab A — Transactions table

Columns:
| Date | Vendor | Description | Type | Direction | Category | Tags | Status | Amount | Receipt | ⋮ |

### Type column = colored badge

```tsx
const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  subscription: { label: 'Subscription', cls: 'bg-purple-100 text-purple-700' },
  one_time:     { label: 'One-time',     cls: 'bg-blue-100 text-blue-700' },
  invoice:      { label: 'Invoice',      cls: 'bg-amber-100 text-amber-700' },
};
```

### Direction column = arrow icon

- expense → `IconArrowUpRight` muted (money out)
- income → `IconArrowDownLeft` text-green-600 (money in)

Visual differentiation without taking column width.

### Category column

Inline color dot from `categories.color` + name:

```tsx
<div className="flex items-center gap-1.5">
  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color ?? '#6b7280' }} />
  <span className="text-sm">{category.name ?? '—'}</span>
</div>
```

Same color from DB that drives the by-category pie — visual continuity across surfaces.

### Tags column — chip cluster, max 2 visible

```tsx
<div className="flex flex-wrap gap-1">
  {tags.slice(0, 2).map((t) => (
    <span key={t} className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
      {t}
    </span>
  ))}
  {tags.length > 2 && (
    <Tooltip><TooltipTrigger>
      <span className="text-[10px] text-muted-foreground">+{tags.length - 2}</span>
    </TooltipTrigger><TooltipContent>{tags.slice(2).join(', ')}</TooltipContent></Tooltip>
  )}
</div>
```

### Status column = colored badge

```tsx
const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  paid:     { label: 'Paid',     cls: 'bg-green-100 text-green-700' },
  pending:  { label: 'Pending',  cls: 'bg-yellow-100 text-yellow-700' },
  overdue:  { label: 'Overdue',  cls: 'bg-red-100 text-red-700' },
  void:     { label: 'Void',     cls: 'bg-gray-100 text-gray-500 line-through' },
};
```

### Amount column

Right-aligned, `tabular-nums`. Income shows green `+` prefix; subscription shows `/cycle` suffix in muted text. Non-CAD currency shows currency badge inline; CAD value (rolled up via BoC rate) shown directly.

```tsx
<td className="text-right font-medium tabular-nums">
  {direction === 'income' && <span className="text-green-600">+</span>}
  ${(amount_cad_cents / 100).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
  {currency !== 'CAD' && (
    <Tooltip><TooltipTrigger>
      <span className="ml-1 text-[10px] font-normal text-muted-foreground border rounded px-1 py-px">{currency}</span>
    </TooltipTrigger><TooltipContent>{`Original: ${currency} ${(amount_cents / 100).toFixed(2)} @ BoC rate ${fx_rate}`}</TooltipContent></Tooltip>
  )}
  {transaction_type === 'subscription' && (
    <span className="text-xs text-muted-foreground ml-0.5">/{cadenceShort}</span>
  )}
</td>
```

### Receipt column = icon-only, 3 states

| State | Icon | Tooltip |
|---|---|---|
| Has receipt (manual upload) | `IconPaperclip` (foreground) | "Receipt attached" |
| Email-imported (auto-attached) | `IconMail` (text-blue-500) | "Imported from email receipt" |
| No receipt | `IconPaperclip` (text-muted-foreground/30) | "No receipt — click to upload" |

Click receipt-present → opens preview modal (image inline, PDF embed). Click receipt-missing → opens upload dialog scoped to that txn.

### Actions column (⋮)

DropdownMenu: View / Edit / Mark as paid (if pending) / Duplicate / Delete. Delete uses destructive variant + Dialog confirm.

### Row click

Opens transaction detail Sheet from-right (read-only by default with Edit button to flip to form mode). Per analyst: "Clicking a transaction row → modal with full detail + receipt thumbnails + edit."

### Empty state

Centered block with `IconReceiptOff`, "No transactions yet — log your first one." + primary "Add Transaction" button.

---

## 9. Tab B — Subscriptions table

Columns:
| Vendor | Description | Cadence | Monthly Equiv | Category | Tags | Next Bill | Status | ⋮ |

Pulls from `recurring_schedules` (NOT `transactions` — schedules are the source of truth for active recurring lifecycle).

### Status column

| Status | Badge |
|---|---|
| Active | green pulse-dot + "Active" |
| Paused | yellow + "Paused" |
| Ended | gray + "Ended" |

(Status derived from `active` flag + `end_date`.)

### Monthly Equiv column

From the `v_active_subscription_monthly` view in analyst's schema. Right-aligned, `tabular-nums`, e.g. `$87.50/mo`.

### Next Bill column

Date relative + absolute: `in 3 days · 2026-04-28`. Red text if `next_bill_date < today` (overdue/missed materialization).

### Row click

Opens Subscription detail Sheet (cadence + tags + history of all materialized billings via `transactions WHERE recurring_schedule_id = ?`). Per analyst.

### Actions column (⋮)

DropdownMenu: Edit / Pause / Resume / End (sets `end_date` = today, `active = 0`) / Materialize next bill manually / Delete.

---

## 10. Tab C — Outstanding Invoices table

Columns:
| Invoice # | Payer | Amount | Issued | Due | Days Late | Status | ⋮ |

Filter scope: `transactions WHERE transaction_type='invoice' AND status IN ('pending','overdue')`. Default sort: `invoice_due_date ASC` (most overdue first).

### Days Late column = color-coded badge

```tsx
function DaysLateBadge({ daysLate }: { daysLate: number }) {
  if (daysLate <= 0) return <span className="text-xs text-muted-foreground">on time</span>;
  if (daysLate <= 7)  return <Badge className="bg-yellow-100 text-yellow-700">{daysLate}d late</Badge>;
  if (daysLate <= 30) return <Badge className="bg-orange-100 text-orange-700">{daysLate}d late</Badge>;
  return <Badge variant="destructive">{daysLate}d late</Badge>;
}
```

Three tiers: 1-7d yellow, 8-30d orange, 30+d destructive red. Visually triages aged-receivable severity at a glance.

### Actions column (⋮)

DropdownMenu: View / Edit / Mark as paid (sets `status='paid'`, `date=today`) / Send reminder (stub for v2 — log only) / Delete.

### Empty state

`IconCheck` green + "No outstanding invoices." (Good news — keep it cheerful.)

---

## 11. Add Transaction Sheet (drawer)

shadcn `Sheet` from-right. Width: `w-[480px]` desktop, full-width mobile. Per analyst — radio for transaction_type with conditional fields.

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-full sm:max-w-[480px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Add Transaction</SheetTitle>
      <SheetDescription>Log a one-time expense, subscription, or invoice.</SheetDescription>
    </SheetHeader>

    <form className="flex flex-col gap-5 mt-6">
      {/* Type — 3-button toggle */}
      <div>
        <Label>Type</Label>
        <ToggleGroup type="single" value={type} onValueChange={setType} className="mt-1.5 grid grid-cols-3">
          <ToggleGroupItem value="one_time">One-time</ToggleGroupItem>
          <ToggleGroupItem value="subscription">Subscription</ToggleGroupItem>
          <ToggleGroupItem value="invoice">Invoice</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Direction — 2-button toggle */}
      <div>
        <Label>Direction</Label>
        <ToggleGroup type="single" value={direction} onValueChange={setDirection} className="mt-1.5 grid grid-cols-2">
          <ToggleGroupItem value="expense">Expense (out)</ToggleGroupItem>
          <ToggleGroupItem value="income">Income (in)</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Vendor + Description */}
      <div>
        <Label htmlFor="vendor">{direction === 'income' ? 'Payer' : 'Vendor'}</Label>
        <Input id="vendor" placeholder={direction === 'income' ? 'Reyco Marine' : 'Anthropic'} required />
      </div>
      <div>
        <Label htmlFor="desc">Description</Label>
        <Input id="desc" placeholder="API usage — April" />
      </div>

      {/* Amount + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input id="amount" type="number" step="0.01" className="pl-7" required />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">CAD</span>
          </div>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" required defaultValue={today()} />
        </div>
      </div>

      {/* Conditional: subscription cadence */}
      {type === 'subscription' && (
        <div>
          <Label>Billing cadence</Label>
          <Select defaultValue="monthly">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="custom">Custom (every N days)...</SelectItem>
            </SelectContent>
          </Select>
          {cadence === 'custom' && (
            <div className="mt-2">
              <Label htmlFor="cadence-days">Every N days</Label>
              <Input id="cadence-days" type="number" min="1" />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Materializer creates pending transactions ahead of next bill date. Burn-rate card normalizes to /mo.
          </p>
        </div>
      )}

      {/* Conditional: invoice fields */}
      {type === 'invoice' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="invoice-number">Invoice number</Label>
            <Input id="invoice-number" placeholder="INV-2026-001" required />
          </div>
          <div>
            <Label htmlFor="due-date">Due date</Label>
            <Input id="due-date" type="date" required />
          </div>
        </div>
      )}

      {/* Category — Combobox (uses analyst's seeded 3 + create-new) */}
      <div>
        <Label>Category</Label>
        <CategoryCombobox value={category} onChange={setCategory} />
      </div>

      {/* Tags — multi-input chips */}
      <div>
        <Label>Tags <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
        <TagInput value={tags} onChange={setTags} placeholder="reyco, q2-2026..." />
        <p className="text-xs text-muted-foreground mt-1">
          {type === 'subscription' && 'Tags carry forward to each materialized billing. '}
          Press Enter to add.
        </p>
      </div>

      {/* Currency (USD/CAD only per analyst v1.1) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Currency</Label>
          <Select defaultValue="CAD" value={currency} onValueChange={setCurrency}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CAD">CAD</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment-method">Payment method <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="payment-method" placeholder="Visa, Wise, e-transfer..." />
        </div>
      </div>

      {/* Payment reference + counterparty email (e-transfer / cheque / client tracking) */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="payment-ref">Reference <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="payment-ref" placeholder="e-transfer ID, cheque #" />
        </div>
        <div>
          <Label htmlFor="counterparty-email">{direction === 'income' ? 'Payer email' : 'Vendor email'} <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="counterparty-email" type="email" placeholder="contact@..." />
        </div>
      </div>

      {/* Status (only one_time + invoice; subscription always materializes as pending) */}
      {type !== 'subscription' && (
        <div>
          <Label>Status</Label>
          <Select defaultValue={type === 'invoice' ? 'pending' : 'paid'}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              {type === 'invoice' && <SelectItem value="overdue">Overdue</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Receipt drop zone — kind-aware per analyst v1.1 */}
      <div>
        <Label>Receipt <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
        {/* Receipt kind selector — only when uploading; auto-defaults from direction */}
        <ToggleGroup type="single" value={receiptKind} onValueChange={setReceiptKind} className="grid grid-cols-2 mb-2">
          <ToggleGroupItem value="vendor_receipt">
            {direction === 'income' ? 'Vendor receipt' : 'Vendor receipt (default)'}
          </ToggleGroupItem>
          <ToggleGroupItem value="issued_receipt">
            {direction === 'income' ? 'Issued (default)' : 'Issued receipt'}
          </ToggleGroupItem>
        </ToggleGroup>
        <ReceiptDropZone file={receipt} onChange={setReceipt} />
        {receiptKind === 'issued_receipt' && (
          <div className="mt-2">
            <Label htmlFor="recipient-email">Recipient email</Label>
            <Input id="recipient-email" type="email" placeholder="client@..." required />
            <p className="text-xs text-muted-foreground mt-1">Who you sent this receipt to.</p>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
        <Textarea id="notes" rows={2} placeholder="Anything worth remembering..." />
      </div>

      <SheetFooter className="mt-2">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit">Save Transaction</Button>
      </SheetFooter>
    </form>
  </SheetContent>
</Sheet>
```

Conditional fields per type are critical — analyst's schema constrains invoice → invoice_number + due_date, subscription → cadence. Form mirrors schema constraints so dev can validate client-side before POST.

### CategoryCombobox

shadcn `Command` inside `Popover`. Pulls from `/api/categories`; fixed seeds + user-created appear together; create-new at the bottom.

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" className="w-full justify-between">
      {category ? (
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
          {category.name}
        </span>
      ) : (
        "Select category..."
      )}
      <IconChevronDown size={14} />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[400px] p-0">
    <Command>
      <CommandInput placeholder="Search or create..." />
      <CommandList>
        <CommandEmpty>
          <button className="text-sm text-primary px-3 py-2" onClick={() => createCategory(query)}>
            + Create "{query}"
          </button>
        </CommandEmpty>
        <CommandGroup heading="Categories">
          {categories.map((cat) => (
            <CommandItem key={cat.id} onSelect={() => { setCategory(cat); setOpen(false); }}>
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cat.color ?? '#6b7280' }} />
              {cat.name}
              {cat.is_fixed === 0 && <span className="ml-2 text-[10px] text-muted-foreground">custom</span>}
              {category?.id === cat.id && <IconCheck size={14} className="ml-auto" />}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

When user creates a new category, prompt for color in a follow-up mini-dialog (color picker — use simple shadcn-compatible swatch grid; 8 preset colors + custom hex input). Color is stored on `categories.color` and reused everywhere (chart, table dot).

### ReceiptDropZone

```tsx
<label
  htmlFor="receipt-input"
  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-input rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
>
  {file ? (
    <div className="flex items-center gap-3 w-full">
      <IconFileText size={32} className="text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
      </div>
      <button onClick={(e) => { e.preventDefault(); setFile(null); }} className="text-muted-foreground hover:text-destructive">
        <IconX size={16} />
      </button>
    </div>
  ) : (
    <>
      <IconUpload size={24} className="text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">Drop receipt or click to browse</p>
        <p className="text-xs text-muted-foreground mt-0.5">PDF, PNG, JPG up to 10MB</p>
      </div>
    </>
  )}
  <input id="receipt-input" type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
</label>
```

POSTs as multipart to `/api/receipts` (per analyst) once parent transaction saves; receipts table FK back to transaction.

---

## 12. Subscription edit Sheet

Triggered by clicking a Subscription row. Reuses the Add Transaction form template with subscription-specific fields pre-filled and an additional **History** panel below the form.

History panel:

```tsx
<div className="mt-6">
  <h3 className="text-sm font-semibold mb-2">Materialized billings</h3>
  <div className="border rounded-lg divide-y">
    {history.map((txn) => (
      <div key={txn.id} className="flex items-center justify-between p-3 text-sm">
        <div>
          <div className="font-medium">{txn.date}</div>
          <div className="text-xs text-muted-foreground">{txn.notes ?? '—'}</div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={STATUS_BADGE[txn.status].cls}>{STATUS_BADGE[txn.status].label}</Badge>
          <span className="font-medium tabular-nums">${(txn.amount_cents / 100).toFixed(2)}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

Clicking a history row → opens that specific transaction in a nested Sheet (or navigates to it on the Transactions tab).

---

## 13. CSV Export Sheet

Triggered by the header Export CSV button. Small Sheet from-right with filter selectors + download button.

```tsx
<Sheet open={exportOpen} onOpenChange={setExportOpen}>
  <SheetContent side="right" className="w-full sm:max-w-[420px]">
    <SheetHeader>
      <SheetTitle>Export CSV</SheetTitle>
      <SheetDescription>For your accountant. CRA T2125 lines included.</SheetDescription>
    </SheetHeader>

    <div className="flex flex-col gap-4 mt-6">
      <div>
        <Label>Date range</Label>
        <Select value={exportRange} onValueChange={setExportRange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ytd">Year to date</SelectItem>
            <SelectItem value="last-tax-year">Last tax year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="custom">Custom...</SelectItem>
          </SelectContent>
        </Select>
        {exportRange === 'custom' && <DateRangePicker value={customRange} onChange={setCustomRange} />}
      </div>

      <div>
        <Label>Direction (optional)</Label>
        <Select value={exportDirection} onValueChange={setExportDirection}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Both income + expense</SelectItem>
            <SelectItem value="expense">Expenses only</SelectItem>
            <SelectItem value="income">Income only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Categories (optional)</Label>
        <MultiSelect options={categories} value={exportCategories} onChange={setExportCategories} placeholder="All categories" />
      </div>

      <div className="text-xs text-muted-foreground">
        Includes columns: date, direction, type, amount, vendor, description, category, CRA T2125 line + label, tags, payment method, invoice #, due date, status, notes, has_receipt.
      </div>

      <SheetFooter>
        <Button variant="ghost" onClick={() => setExportOpen(false)}>Cancel</Button>
        <Button onClick={handleExport}>
          <IconDownload size={14} className="mr-1.5" />
          Download CSV
        </Button>
      </SheetFooter>
    </div>
  </SheetContent>
</Sheet>
```

Filename pattern (per analyst): `glv-expenses-{start}-to-{end}.csv`.
On success: toast "Exported N transactions". On error: destructive toast.

---

## 14. Mobile (≤640px)

- Header: title row stays; action buttons collapse — Export becomes icon-only, Add Transaction stays labeled (it's the most-used button)
- Time-window bar: select stays full-width at top
- Summary cards: 1-col stack
- Cash balance prompt: stacks (text above, button below)
- Charts grid: 1-col stack, 260px height each
- Tabs: stay horizontal, can scroll horizontally if labels overflow
- Filters bar: collapses to a "Filters" button that opens a Sheet from-bottom with all filter controls
- Tables: switch to **card list** (one card per row) — table columns don't fit. Card layout per tab:
  - **Transaction card:** Vendor (bold) + type badge top-right; Description below muted; Date + Category dot bottom-left; Amount right-aligned with status badge below
  - **Subscription card:** Vendor (bold) + status pulse-dot top-right; Cadence + monthly equiv below; Next bill date bottom-left; Tags chips below
  - **Invoice card:** Invoice # (bold) + days-late badge top-right; Payer below muted; Due date + amount bottom row

Pattern:

```tsx
<div className="hidden md:block"><Table /></div>
<div className="md:hidden flex flex-col gap-2">
  {rows.map((r) => <RowCard key={r.id} row={r} />)}
</div>
```

---

## 15. Accessibility

- All form inputs have `<Label htmlFor>` pairing
- Type/Direction toggle groups are keyboard-navigable (shadcn ToggleGroup handles ARIA)
- Receipt drop zone is also click-to-browse via `<label htmlFor>` — keyboard users get same flow
- Color is never the only signal: type column has color + text label; status column has color + text label; category has color dot + text name; days-late has color + number + "late" suffix
- Destructive actions (delete) use Dialog confirm, not toast-only
- Runway tooltip + summary card icons get tooltip text for screen-readers
- Charts: ensure Recharts `<Legend>` is present + `aria-label` on each `<ResponsiveContainer>` describing what the chart shows

---

## 16. Coordination notes

**Dev (build path):**
- Page route: `/dashboard/accounting`. Add to nav in `dashboard/src/components/layout/sidebar.tsx` (probably under a new "Internal" section, or alongside existing nav items — check existing sidebar grouping)
- All shadcn primitives already in `dashboard/src/components/ui/`
- Recharts: `npm i recharts`
- Reuse `useOrg` hook for org-scoping (expenses are GLV-internal so org="glv" hardcoded for v1, but pattern matches fleet)
- API endpoints (per analyst): `/api/transactions` (CRUD + filters), `/api/recurring_schedules` (CRUD), `/api/categories` (CRUD), `/api/tags` (CRUD), `/api/receipts` (multipart POST), `/api/cash_balance_snapshots` (POST + GET latest), `/api/reports/{burn|category|income-expense|subscriptions|runway|outstanding-invoices}`, `/api/export/csv?...filters`
- Toast notifications: use existing dashboard toast lib (sonner if installed, else shadcn toast)
- Multipart upload: receipt files stored under `${CTX_ROOT}/dashboard/uploads/receipts/{YYYY}/{MM}/{uuid}.{ext}` per analyst; validate mime + size 10MB

**Analyst (data contract):**
- Schema is authoritative — this UI spec follows it
- Chart data shapes: provide `categories.color` in the by-category + subscription series so chart legends are DB-driven
- Materializer: hourly cron, idempotent via UNIQUE (recurring_schedule_id, date) — UI displays pending materialized rows in Transactions tab with status='pending' badge; user can transition to paid manually
- Reports endpoint shapes (suggested): `{ burn: [{month, total, rolling_avg_3mo}], category: [{name, color, total}], incomeExpense: [{month, income, expense, net}], subscriptions: [{vendor, monthly_equiv, started}], runway: {months, basis, cash_balance, avg_burn}, outstanding: [{invoice_number, payer, amount, issued, due, days_late, status}] }`

**Designer (me):**
- This spec is the contract for visual + interaction
- I'll QC the rendered page once dev ships a preview URL
- Open question for boss/Aiden on category color picker UX — simple swatch grid sufficient or want a full color picker?

---

## 17. What I am NOT specifying

- Auth / RBAC (internal tool, single GLV admin for v1)
- QuickBooks/Wave sync (out of scope)
- Multi-currency FX conversion (analyst v2)
- Email-receipt parser UI surfacing for "review queue" — analyst notes parsed txns should be flagged for human review for first 4 weeks; UI for that review surface is v2 (or surface as a top-of-Transactions banner: "N parsed receipts need review →")
- HST/tax-collected tracking (analyst v2)
- Multi-org scoping UI (currently GLV only; nav scopes via `useOrg` hook)
- Invoice PDF generation / send-to-client
- Plaid / bank CSV import for cash balance auto-sync (analyst v2)

---

## 18. Open questions for boss/Aiden (UI-side)

1. Category color picker UX: 8 preset swatches sufficient, or want a hex input + native color picker too?
2. Cash balance prompt: aggressive (banner appears every page load until updated) or gentle (banner once per session)? Default = aggressive since runway accuracy depends on it.
3. Subscription paused vs ended: paused = `active=0` but no `end_date`; ended = `active=0` + `end_date` set. UI shows both as "inactive" subsets — confirm Aiden wants the distinction surfaced as 2 states or 1.
4. Outstanding Invoices "Send reminder" action: stub for v2 (logs intent only)? Or hide button until v2 built?

---

## 19. Implementation order suggestion

Roughly parallel-able with analyst's schema/API work:

1. Page scaffold + header + time-window selector + summary cards (skeleton data) — 45 min
2. Cash balance prompt + Sheet — 20 min
3. Charts grid (4 ChartCards with Recharts placeholder series) — 60 min
4. Tabs scaffold + filters bar — 30 min
5. Transactions table with badges, type/status/direction columns — 60 min
6. Subscriptions table + edit Sheet with history panel — 60 min
7. Outstanding Invoices table with days-late badges — 30 min
8. Add Transaction Sheet with conditional fields + CategoryCombobox + ReceiptDropZone — 90 min
9. CSV Export Sheet + endpoint wiring — 30 min
10. Mobile responsive (table → card list, filter Sheet) — 45 min
11. Designer QC pass — 20 min

**Total dev time: ~8 hours.** Analyst's API endpoints + materializer cron are the parallel critical path.
