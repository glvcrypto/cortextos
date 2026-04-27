import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fetchFxRates, type FxRateEntry } from '../../../src/bus/fx-fetcher';

function readJsonl(path: string): FxRateEntry[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

function jsonlPath(ctxRoot: string): string {
  return join(ctxRoot, 'analytics', 'fx_rates.jsonl');
}

function makeBocResponse(observations: Array<{ d: string; v: string }>) {
  return {
    observations: observations.map(({ d, v }) => ({
      d,
      FXUSDCAD: { v },
    })),
  };
}

function stubFetch(response: Response) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
}

function makeOkResponse(body: object): Response {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

function makeErrorResponse(status: number, statusText: string): Response {
  return {
    ok: false,
    status,
    statusText,
    json: () => Promise.resolve({}),
  } as unknown as Response;
}

describe('fx-fetcher', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'fx-fetcher-test-'));
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
    vi.unstubAllGlobals();
  });

  describe('fetchFxRates — successful fetch', () => {
    it('writes both USD→CAD and CAD→USD entries for a single observation', async () => {
      stubFetch(makeOkResponse(makeBocResponse([{ d: '2026-04-25', v: '1.3850' }])));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('ok');
      expect(result.fetched).toBe(2); // forward + inverse
      expect(result.skipped).toBe(0);
      expect(result.observations_seen).toBe(1);
      expect(result.latest_date).toBe('2026-04-25');

      const entries = readJsonl(jsonlPath(testDir));
      expect(entries).toHaveLength(2);

      const usdCad = entries.find(e => e.base_currency === 'USD' && e.quote_currency === 'CAD');
      const cadUsd = entries.find(e => e.base_currency === 'CAD' && e.quote_currency === 'USD');

      expect(usdCad).toBeDefined();
      expect(usdCad!.rate).toBe(1.385);
      expect(usdCad!.rate_date).toBe('2026-04-25');
      expect(usdCad!.source).toBe('boc_noon');

      expect(cadUsd).toBeDefined();
      expect(cadUsd!.rate).toBeCloseTo(1 / 1.385, 8);
      expect(cadUsd!.rate_date).toBe('2026-04-25');
    });

    it('handles multiple observations — writes all, returns latest_date', async () => {
      stubFetch(makeOkResponse(makeBocResponse([
        { d: '2026-04-23', v: '1.3800' },
        { d: '2026-04-24', v: '1.3820' },
        { d: '2026-04-25', v: '1.3850' },
      ])));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('ok');
      expect(result.fetched).toBe(6); // 2 per observation
      expect(result.observations_seen).toBe(3);
      expect(result.latest_date).toBe('2026-04-25');

      const entries = readJsonl(jsonlPath(testDir));
      expect(entries).toHaveLength(6);
    });

    it('tracks latest_date as max across all observations (not last in array)', async () => {
      stubFetch(makeOkResponse(makeBocResponse([
        { d: '2026-04-25', v: '1.3850' },
        { d: '2026-04-23', v: '1.3800' }, // earlier, listed last
      ])));

      const result = await fetchFxRates(testDir);
      expect(result.latest_date).toBe('2026-04-25');
    });
  });

  describe('fetchFxRates — deduplication', () => {
    it('skips entries already in the JSONL and returns no_new_data when all skipped', async () => {
      // First fetch — writes data
      stubFetch(makeOkResponse(makeBocResponse([{ d: '2026-04-25', v: '1.3850' }])));
      await fetchFxRates(testDir);

      // Second fetch — same date, should skip both
      stubFetch(makeOkResponse(makeBocResponse([{ d: '2026-04-25', v: '1.3850' }])));
      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('no_new_data');
      expect(result.fetched).toBe(0);
      expect(result.skipped).toBe(2);

      // File unchanged — still only 2 entries
      const entries = readJsonl(jsonlPath(testDir));
      expect(entries).toHaveLength(2);
    });

    it('writes only new dates when partially overlapping', async () => {
      stubFetch(makeOkResponse(makeBocResponse([{ d: '2026-04-24', v: '1.3820' }])));
      await fetchFxRates(testDir);

      stubFetch(makeOkResponse(makeBocResponse([
        { d: '2026-04-24', v: '1.3820' }, // already present
        { d: '2026-04-25', v: '1.3850' }, // new
      ])));
      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('ok');
      expect(result.fetched).toBe(2); // only 2026-04-25 pair
      expect(result.skipped).toBe(2); // 2026-04-24 pair
    });
  });

  describe('fetchFxRates — error handling', () => {
    it('returns error status on network failure', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('error');
      expect(result.error).toContain('ECONNREFUSED');
      expect(result.fetched).toBe(0);
      expect(existsSync(jsonlPath(testDir))).toBe(false);
    });

    it('returns error status on non-200 HTTP response', async () => {
      stubFetch(makeErrorResponse(503, 'Service Unavailable'));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('error');
      expect(result.error).toContain('503');
      expect(result.fetched).toBe(0);
    });

    it('returns no_new_data when BoC returns empty observations array', async () => {
      stubFetch(makeOkResponse({ observations: [] }));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('no_new_data');
      expect(result.fetched).toBe(0);
      expect(result.observations_seen).toBe(0);
      expect(result.latest_date).toBeNull();
    });

    it('returns no_new_data when BoC response has no observations key', async () => {
      stubFetch(makeOkResponse({}));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('no_new_data');
      expect(result.fetched).toBe(0);
    });

    it('silently skips observations with missing or non-positive rate', async () => {
      stubFetch(makeOkResponse(makeBocResponse([
        { d: '2026-04-25', v: '0' },         // zero — invalid
        { d: '2026-04-24', v: '-1.3820' },   // negative — invalid
        { d: '2026-04-23', v: '1.3800' },    // valid
      ])));

      const result = await fetchFxRates(testDir);

      expect(result.status).toBe('ok');
      expect(result.fetched).toBe(2); // only 2026-04-23 pair
      expect(result.observations_seen).toBe(3);
    });
  });

  describe('fetchFxRates — JSONL format', () => {
    it('each line is valid JSON with all required fields', async () => {
      stubFetch(makeOkResponse(makeBocResponse([{ d: '2026-04-25', v: '1.3850' }])));
      await fetchFxRates(testDir);

      const entries = readJsonl(jsonlPath(testDir));
      for (const entry of entries) {
        expect(entry).toMatchObject({
          rate_date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
          base_currency: expect.stringMatching(/^(USD|CAD)$/),
          quote_currency: expect.stringMatching(/^(USD|CAD)$/),
          rate: expect.any(Number),
          source: 'boc_noon',
          fetched_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
        expect(entry.base_currency).not.toBe(entry.quote_currency);
      }
    });

    it('uses recent=1 by default, passes recent option to URL', async () => {
      const mockFetch = vi.fn().mockResolvedValue(makeOkResponse({ observations: [] }));
      vi.stubGlobal('fetch', mockFetch);

      await fetchFxRates(testDir);
      expect(mockFetch.mock.calls[0][0]).toContain('recent=1');

      await fetchFxRates(testDir, { recent: 30 });
      expect(mockFetch.mock.calls[1][0]).toContain('recent=30');
    });
  });
});
