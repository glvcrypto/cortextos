import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconExternalLink,
  IconPhoto,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { getClientDir } from '@/lib/config';

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur.trim());
  return fields;
}

interface CsvRow {
  sku: string;
  product_title: string;
  brand: string;
  image_url: string;
  source_site: string;
  reyco_product_url?: string;
  status: string;
}

interface ProductRow {
  sku: string;
  product_title: string;
  brand: string;
  reyco_product_url: string | null;
  source_image_url: string;
  source_site: string;
  image_count: number;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  ready: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  blocked: 'bg-red-100 text-red-700',
  uploaded: 'bg-blue-100 text-blue-700',
};

function loadProductRows(): { rows: ProductRow[]; error: string | null } {
  try {
    const csvPath = path.join(
      getClientDir('glv', 'reyco-marine'),
      'assets',
      'product-images',
      'phase1-image-map.csv',
    );
    if (!fs.existsSync(csvPath)) return { rows: [], error: `CSV not found: ${csvPath}` };

    const lines = fs.readFileSync(csvPath, 'utf-8').trim().split('\n');
    const headers = parseCsvLine(lines[0]);

    const rawRows: CsvRow[] = lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = (values[i] ?? '').trim(); });
      return row as unknown as CsvRow;
    });

    const bySkuMap = new Map<string, ProductRow>();
    for (const row of rawRows) {
      if (bySkuMap.has(row.sku)) {
        bySkuMap.get(row.sku)!.image_count += 1;
      } else {
        bySkuMap.set(row.sku, {
          sku: row.sku,
          product_title: row.product_title,
          brand: row.brand,
          reyco_product_url: row.reyco_product_url?.trim() || null,
          source_image_url: row.image_url,
          source_site: row.source_site,
          image_count: 1,
          status: row.status,
        });
      }
    }
    return { rows: Array.from(bySkuMap.values()), error: null };
  } catch (err) {
    return { rows: [], error: String(err) };
  }
}

export default function ReycoClientPage() {
  const { rows, error } = loadProductRows();
  const urlsMissing = rows.filter((r) => !r.reyco_product_url).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
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

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border -mt-3">
        <Link
          href="/clients"
          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          All Clients
        </Link>
        <span className="px-3 py-2 text-sm font-medium border-b-2 border-primary text-primary -mb-px">
          Reyco
        </span>
      </div>

      {/* Widget 1 — Product Images */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <IconPhoto size={16} className="text-muted-foreground" />
            <CardTitle className="text-base">Product Images</CardTitle>
            <span className="text-xs text-muted-foreground">
              {rows.length} product{rows.length !== 1 ? 's' : ''} · Phase 1
            </span>
          </div>

          {urlsMissing > 0 && (
            <div className="flex items-start gap-2 mt-2 rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
              <IconAlertTriangle size={13} className="shrink-0 mt-0.5 text-yellow-500" />
              <span>
                {urlsMissing} product{urlsMissing !== 1 ? 's are' : ' is'} missing a Reyco domain URL.
                Add a <code className="font-mono bg-yellow-100 px-1 rounded">reyco_product_url</code> column
                to <code className="font-mono bg-yellow-100 px-1 rounded">phase1-image-map.csv</code> to populate links.
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {error && <p className="text-sm text-red-500 py-4">Error: {error}</p>}
          {!error && (
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
                  {rows.map((row) => (
                    <tr key={row.sku} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-2.5">
                        <div className="font-medium text-foreground leading-snug">{row.product_title}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{row.sku}</div>
                      </td>
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
                      <td className="px-6 py-2.5">
                        <a
                          href={row.source_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {row.source_site}
                          <IconExternalLink size={10} className="shrink-0" />
                        </a>
                      </td>
                      <td className="px-6 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums">
                          <IconPhoto size={12} className="text-muted-foreground" />
                          {row.image_count}
                        </span>
                      </td>
                      <td className="px-6 py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_COLORS[row.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Future widgets */}
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
