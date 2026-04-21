import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getClientDir } from '@/lib/config';

export const dynamic = 'force-dynamic';

interface CsvRow {
  sku: string;
  product_title: string;
  brand: string;
  image_url: string;
  image_alt: string;
  source_site: string;
  reyco_product_url?: string;
  status: string;
  notes: string;
}

export interface ProductImageRow {
  sku: string;
  product_title: string;
  brand: string;
  reyco_product_url: string | null;
  source_image_url: string;
  source_site: string;
  image_count: number;
  status: string;
}

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

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? '').trim(); });
    return row as unknown as CsvRow;
  });
}

export async function GET() {
  try {
    const csvPath = path.join(
      getClientDir('glv', 'reyco-marine'),
      'assets',
      'product-images',
      'phase1-image-map.csv',
    );

    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ rows: [], error: 'CSV not found', csv_path: csvPath });
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const rows = parseCsv(content);

    // Group by SKU — one row per product, count images
    const bySkuMap = new Map<string, ProductImageRow>();
    for (const row of rows) {
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

    const result = Array.from(bySkuMap.values());
    return NextResponse.json({ rows: result, total: result.length });
  } catch (err) {
    return NextResponse.json({ rows: [], error: String(err) }, { status: 500 });
  }
}
