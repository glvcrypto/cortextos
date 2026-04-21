'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconExternalLink,
  IconPhoto,
  IconRefresh,
  IconAlertTriangle,
} from '@tabler/icons-react';
import type { ProductImageRow } from '@/app/api/clients/reyco-marine/product-images/route';

const STATUS_COLORS: Record<string, string> = {
  ready: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  blocked: 'bg-red-100 text-red-700',
  uploaded: 'bg-blue-100 text-blue-700',
};

export default function ReycoClientPage() {
  const [rows, setRows] = useState<ProductImageRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/clients/reyco-marine/product-images');
      const data = await res.json();
      if (data.error) setError(data.error);
      setRows(data.rows ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = rows.filter((r) =>
    !search ||
    r.product_title.toLowerCase().includes(search.toLowerCase()) ||
    r.sku.toLowerCase().includes(search.toLowerCase()) ||
    r.brand.toLowerCase().includes(search.toLowerCase()),
  );

  const urlsMissing = rows.filter((r) => !r.reyco_product_url).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reyco Marine</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Client workspace — all Reyco tasks, assets, and pipeline status in one place
          </p>
        </div>
        <a
          href="https://reyco.glvmarketing.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          reyco.glvmarketing.ca
          <IconExternalLink size={12} />
        </a>
      </div>

      {/* Widget 1 — Product Images */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconPhoto size={16} className="text-muted-foreground" />
              <CardTitle className="text-base">Product Images</CardTitle>
              {!loading && (
                <span className="text-xs text-muted-foreground">
                  {total} product{total !== 1 ? 's' : ''} · Phase 1
                </span>
              )}
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconRefresh size={13} />
              Refresh
            </button>
          </div>

          {/* URL gap notice */}
          {!loading && urlsMissing > 0 && (
            <div className="flex items-start gap-2 mt-2 rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
              <IconAlertTriangle size={13} className="shrink-0 mt-0.5 text-yellow-500" />
              <span>
                {urlsMissing} product{urlsMissing !== 1 ? 's are' : ' is'} missing a Reyco domain URL.
                Add a <code className="font-mono bg-yellow-100 px-1 rounded">reyco_product_url</code> column
                to <code className="font-mono bg-yellow-100 px-1 rounded">phase1-image-map.csv</code> to populate links.
              </span>
            </div>
          )}

          {/* Search */}
          <input
            type="search"
            placeholder="Search by product, SKU, or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </CardHeader>

        <CardContent className="pt-0">
          {loading && (
            <p className="text-sm text-muted-foreground py-4">Loading...</p>
          )}
          {error && (
            <p className="text-sm text-red-500 py-4">Error: {error}</p>
          )}
          {!loading && !error && (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="text-left px-6 py-2 font-medium">Product</th>
                    <th className="text-left px-6 py-2 font-medium">Reyco URL</th>
                    <th className="text-left px-6 py-2 font-medium">Source</th>
                    <th className="text-center px-6 py-2 font-medium">Images</th>
                    <th className="text-left px-6 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.sku}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-6 py-2.5">
                        <div className="font-medium text-foreground leading-snug">
                          {row.product_title}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          {row.sku}
                        </div>
                      </td>

                      {/* Reyco domain URL */}
                      <td className="px-6 py-2.5">
                        {row.reyco_product_url ? (
                          <a
                            href={row.reyco_product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline text-xs truncate max-w-[200px]"
                          >
                            {row.reyco_product_url.replace(/^https?:\/\/[^/]+/, '')}
                            <IconExternalLink size={11} className="shrink-0" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 italic">TBD</span>
                        )}
                      </td>

                      {/* Source image URL */}
                      <td className="px-6 py-2.5">
                        <div className="flex flex-col gap-0.5">
                          <a
                            href={row.source_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-[220px]"
                          >
                            {row.source_site}
                            <IconExternalLink size={10} className="shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Image count */}
                      <td className="px-6 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums">
                          <IconPhoto size={12} className="text-muted-foreground" />
                          {row.image_count}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-6 text-center text-sm text-muted-foreground">
                        No products match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for future widgets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 opacity-40 pointer-events-none select-none">
        {['Open Tasks', 'Blockers', 'Casey Asks'].map((label) => (
          <Card key={label} className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
