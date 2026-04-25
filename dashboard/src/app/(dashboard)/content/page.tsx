'use client';

import { useEffect, useState, useCallback } from 'react';
import { useOrg } from '@/hooks/use-org';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IconCalendar, IconList, IconPlus, IconRefresh, IconX } from '@tabler/icons-react';
import { TimeAgo } from '@/components/shared';
import { cn } from '@/lib/utils';
import type { ContentItem, ContentStatus, ContentType } from '@/lib/types';

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft:     'bg-slate-400/20 text-slate-600 dark:text-slate-300',
  scheduled: 'bg-blue-400/20 text-blue-600 dark:text-blue-300',
  published: 'bg-green-400/20 text-green-600 dark:text-green-300',
  archived:  'bg-muted text-muted-foreground',
};

const CONTENT_TYPES: ContentType[] = ['blog', 'social', 'email', 'video', 'other'];
const STATUSES: ContentStatus[] = ['draft', 'scheduled', 'published', 'archived'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ── Dialog ────────────────────────────────────────────────────────────────────

interface CreateDialogProps {
  org: string;
  defaultDate?: string;
  onClose: () => void;
  onCreated: (item: ContentItem) => void;
}

function CreateContentDialog({ org, defaultDate = '', onClose, onCreated }: CreateDialogProps) {
  const [form, setForm] = useState({
    title: '',
    platform: '',
    content_type: 'blog' as ContentType,
    status: 'draft' as ContentStatus,
    scheduled_date: defaultDate,
    client_slug: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSubmit() {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, org }),
      });
      if (res.ok) { onCreated(await res.json()); onClose(); }
      else setError('Failed to create');
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">New Content Item</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><IconX size={16} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
            <input className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Blog post title..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
              <select className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none" value={form.content_type} onChange={(e) => set('content_type', e.target.value)}>
                {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform</label>
              <input className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none" value={form.platform} onChange={(e) => set('platform', e.target.value)} placeholder="LinkedIn, website..." />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Scheduled Date</label>
              <input type="date" className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none" value={form.scheduled_date} onChange={(e) => set('scheduled_date', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Client Slug</label>
            <input className="w-full rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none" value={form.client_slug} onChange={(e) => set('client_slug', e.target.value)} placeholder="reyco, glv..." />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
            <textarea className="w-full resize-none rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </div>
        </div>

        {error && <p className="text-xs text-destructive mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            <IconPlus size={13} className="mr-1.5" />
            {saving ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Calendar Grid ─────────────────────────────────────────────────────────────

function CalendarGrid({ items, year, month, onDateClick }: {
  items: ContentItem[];
  year: number;
  month: number;
  onDateClick: (date: string) => void;
}) {
  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const byDate = new Map<string, ContentItem[]>();
  for (const item of items) {
    if (!item.scheduled_date) continue;
    const d = item.scheduled_date.slice(0, 10);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(item);
  }

  const cells: (null | number)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="bg-card min-h-[80px]" />;

          const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const dayItems = byDate.get(dateStr) ?? [];
          const today = new Date().toISOString().slice(0, 10) === dateStr;

          return (
            <div
              key={dateStr}
              className="bg-card min-h-[80px] p-1.5 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onDateClick(dateStr)}
            >
              <div className={cn(
                'mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium',
                today ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayItems.slice(0, 3).map((item) => (
                  <div key={item.id} className={cn('rounded px-1 py-0.5 text-[9px] font-medium truncate', STATUS_COLORS[item.status])}>
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 3 && (
                  <div className="text-[9px] text-muted-foreground/60">+{dayItems.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContentPage() {
  const { currentOrg } = useOrg();

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const orgParam = currentOrg !== 'all' ? `?org=${currentOrg}` : '';
      const res = await fetch(`/api/content${orgParam}`);
      if (res.ok) setItems(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [currentOrg]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = statusFilter === 'all' ? items : items.filter((i) => i.status === statusFilter);

  function prevMonth() { if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); } else setCalMonth((m) => m - 1); }
  function nextMonth() { if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); } else setCalMonth((m) => m + 1); }

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Content Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} item{items.length !== 1 ? 's' : ''} · SEO agent writes here automatically
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchItems} disabled={loading}>
            <IconRefresh size={15} className={cn('mr-1.5', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => { setDialogDate(''); setDialogOpen(true); }}>
            <IconPlus size={14} className="mr-1.5" />
            Add
          </Button>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-1.5">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              statusFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {s} {s !== 'all' && `(${items.filter((i) => i.status === s).length})`}
          </button>
        ))}
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar"><IconCalendar size={13} className="mr-1.5" />Calendar</TabsTrigger>
          <TabsTrigger value="queue"><IconList size={13} className="mr-1.5" />Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-3">
          {/* Month nav */}
          <div className="flex items-center gap-3 mb-3">
            <Button variant="outline" size="sm" onClick={prevMonth}>‹</Button>
            <span className="text-sm font-medium w-36 text-center">
              {MONTH_NAMES[calMonth]} {calYear}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>›</Button>
          </div>

          {loading ? (
            <div className="h-96 rounded-lg bg-muted/30 animate-pulse" />
          ) : (
            <CalendarGrid
              items={filtered}
              year={calYear}
              month={calMonth}
              onDateClick={(date) => { setDialogDate(date); setDialogOpen(true); }}
            />
          )}
        </TabsContent>

        <TabsContent value="queue" className="mt-3">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted/30 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No content items yet.</p>
          ) : (
            <div className="grid gap-2 max-w-2xl">
              {filtered.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-start justify-between py-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_COLORS[item.status])}>
                          {item.status}
                        </span>
                        {item.content_type && <span>{item.content_type}</span>}
                        {item.platform && <span>· {item.platform}</span>}
                        {item.client_slug && <span>· {item.client_slug}</span>}
                        {item.scheduled_date && <span>· {item.scheduled_date.slice(0, 10)}</span>}
                        <TimeAgo date={item.created_at} className="text-xs ml-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {dialogOpen && (
        <CreateContentDialog
          org={currentOrg !== 'all' ? currentOrg : 'glv'}
          defaultDate={dialogDate}
          onClose={() => setDialogOpen(false)}
          onCreated={(item) => setItems((prev) => [item, ...prev])}
        />
      )}
    </div>
  );
}
