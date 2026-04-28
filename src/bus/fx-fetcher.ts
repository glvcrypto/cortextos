/**
 * FX Rates Fetcher
 *
 * Fetches the daily Bank of Canada noon rate for USD/CAD and writes
 * observations to a JSONL file under analytics/fx_rates.jsonl.
 *
 * The dashboard sync layer reads this JSONL into the fx_rates SQLite table.
 * Stores both directions (USD->CAD and CAD->USD) so chart queries don't need
 * to compute inverses.
 *
 * Idempotent: re-running on the same day no-ops if the rate already exists.
 */

import { existsSync, readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { ensureDir } from '../utils/atomic.js';

const BOC_VALET_URL = 'https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json';

export interface FxRateEntry {
  rate_date: string;          // YYYY-MM-DD (BoC observation date)
  base_currency: 'CAD' | 'USD';
  quote_currency: 'CAD' | 'USD';
  rate: number;               // 1 base = X quote
  source: 'boc_noon';
  fetched_at: string;         // ISO 8601 timestamp
}

export interface FetchResult {
  status: 'ok' | 'error' | 'no_new_data';
  fetched: number;            // count of new entries written this run
  skipped: number;            // count skipped due to (date, base, quote) already present
  observations_seen: number;  // total observations returned by BoC
  latest_date: string | null; // most recent rate_date in the data
  error?: string;
}

interface BocResponse {
  observations?: Array<{
    d: string;
    FXUSDCAD?: { v: string };
  }>;
}

function jsonlPath(ctxRoot: string): string {
  return join(ctxRoot, 'analytics', 'fx_rates.jsonl');
}

function readExistingKeys(path: string): Set<string> {
  if (!existsSync(path)) return new Set();
  const keys = new Set<string>();
  try {
    const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const e: FxRateEntry = JSON.parse(line);
        keys.add(`${e.rate_date}|${e.base_currency}|${e.quote_currency}`);
      } catch {
        // skip malformed line
      }
    }
  } catch {
    // file unreadable — treat as empty
  }
  return keys;
}

function appendEntries(path: string, entries: FxRateEntry[]): void {
  if (entries.length === 0) return;
  ensureDir(join(path, '..'));
  const payload = entries.map(e => JSON.stringify(e)).join('\n') + '\n';
  appendFileSync(path, payload, { encoding: 'utf-8', mode: 0o600 });
}

export async function fetchFxRates(
  ctxRoot: string,
  options: { recent?: number } = {}
): Promise<FetchResult> {
  const recent = options.recent ?? 1;
  const url = `${BOC_VALET_URL}?recent=${recent}`;

  let body: BocResponse;
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return {
        status: 'error',
        fetched: 0,
        skipped: 0,
        observations_seen: 0,
        latest_date: null,
        error: `BoC valet returned ${response.status} ${response.statusText}`,
      };
    }
    body = (await response.json()) as BocResponse;
  } catch (err) {
    return {
      status: 'error',
      fetched: 0,
      skipped: 0,
      observations_seen: 0,
      latest_date: null,
      error: `fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const observations = body.observations ?? [];
  if (observations.length === 0) {
    return {
      status: 'no_new_data',
      fetched: 0,
      skipped: 0,
      observations_seen: 0,
      latest_date: null,
    };
  }

  const path = jsonlPath(ctxRoot);
  const existing = readExistingKeys(path);
  const fetchedAt = new Date().toISOString();
  const toWrite: FxRateEntry[] = [];
  let skipped = 0;
  let latestDate: string | null = null;

  for (const obs of observations) {
    const date = obs.d;
    const valueStr = obs.FXUSDCAD?.v;
    if (!date || !valueStr) continue;
    const usdToCad = Number(valueStr);
    if (!Number.isFinite(usdToCad) || usdToCad <= 0) continue;

    if (!latestDate || date > latestDate) latestDate = date;

    // Forward: 1 USD -> X CAD
    const usdCadKey = `${date}|USD|CAD`;
    if (existing.has(usdCadKey)) {
      skipped++;
    } else {
      toWrite.push({
        rate_date: date,
        base_currency: 'USD',
        quote_currency: 'CAD',
        rate: usdToCad,
        source: 'boc_noon',
        fetched_at: fetchedAt,
      });
      existing.add(usdCadKey);
    }

    // Inverse: 1 CAD -> X USD
    const cadUsdKey = `${date}|CAD|USD`;
    if (existing.has(cadUsdKey)) {
      skipped++;
    } else {
      toWrite.push({
        rate_date: date,
        base_currency: 'CAD',
        quote_currency: 'USD',
        rate: 1 / usdToCad,
        source: 'boc_noon',
        fetched_at: fetchedAt,
      });
      existing.add(cadUsdKey);
    }
  }

  appendEntries(path, toWrite);

  return {
    status: toWrite.length > 0 ? 'ok' : 'no_new_data',
    fetched: toWrite.length,
    skipped,
    observations_seen: observations.length,
    latest_date: latestDate,
  };
}
