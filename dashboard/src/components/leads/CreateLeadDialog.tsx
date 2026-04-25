'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconX, IconPlus } from '@tabler/icons-react';
import type { Lead } from '@/lib/types';

const STATUSES: Lead['status'][] = ['scouted', 'researched', 'contacted', 'responded', 'meeting', 'client', 'lost'];

interface CreateLeadDialogProps {
  org: string;
  defaultStatus?: Lead['status'];
  onClose: () => void;
  onCreated: (lead: Lead) => void;
}

export function CreateLeadDialog({ org, defaultStatus = 'scouted', onClose, onCreated }: CreateLeadDialogProps) {
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    contact_email: '',
    phone: '',
    niche: '',
    area: '',
    province: '',
    status: defaultStatus,
    priority: 'normal' as Lead['priority'],
    notes: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.business_name.trim()) { setError('Business name is required'); return; }
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, org }),
      });

      if (res.ok) {
        const lead: Lead = await res.json();
        onCreated(lead);
        onClose();
      } else {
        setError('Failed to create lead');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Add Lead</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <IconX size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Business Name *</label>
            <input className="input-field" value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="Acme Plumbing" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Name</label>
            <input className="input-field" value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} placeholder="John Smith" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
            <input className="input-field" type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} placeholder="john@acme.com" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
            <input className="input-field" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 (613) 555-0123" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Niche</label>
            <input className="input-field" value={form.niche} onChange={(e) => set('niche', e.target.value)} placeholder="Plumbing" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">City / Area</label>
            <input className="input-field" value={form.area} onChange={(e) => set('area', e.target.value)} placeholder="Ottawa" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Province</label>
            <input className="input-field" value={form.province} onChange={(e) => set('province', e.target.value)} placeholder="ON" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Stage</label>
            <select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
            <select className="input-field" value={form.priority} onChange={(e) => set('priority', e.target.value)}>
              {['critical','urgent','high','normal','low'].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes</label>
            <textarea className="input-field resize-none" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional context..." />
          </div>
        </div>

        {error && <p className="text-xs text-destructive mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            <IconPlus size={13} className="mr-1.5" />
            {saving ? 'Adding...' : 'Add Lead'}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-field:focus {
          ring: 1px;
          ring-color: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}
