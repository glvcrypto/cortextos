#!/usr/bin/env node
// Sub-page reprobe for v63-E02 Dart and v63-E05 Boyle. Probes /about, /services, /credentials etc.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'subpage-reprobe-results.jsonl');
const SUMMARY = path.join(__dirname, 'subpage-reprobe-summary.md');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const TARGETS = [
  {
    id: 'v63-E02',
    name: 'Dart Heating',
    base: 'https://dartheating.ca/',
    sub_paths: ['about', 'about-us', 'services', 'credentials', 'team', 'company', 'memberships'],
    texts: ['Keeprite', 'Elite', 'TSSA', 'HRAI', 'WSIB', 'OCT', 'Bonnie', 'Brian'],
  },
  {
    id: 'v63-E05',
    name: 'Boyle Heating & Cooling',
    base: 'https://boylehvac.ca/',
    sub_paths: ['about', 'about-us', 'services', 'credentials', 'team'],
    texts: ['Trane', 'TSSA', 'Mike'],
  },
];

async function probe(browser, url, texts) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, body_chars: 0, body_sample: null, texts_found: {}, error: null };
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    out.status = response ? response.status() : null;
    if (out.status >= 400) {
      // skip text-check on 4xx/5xx
    } else {
      try { await page.waitForLoadState('networkidle', { timeout: 8000 }); } catch (e) {}
      await page.waitForTimeout(1500);
      const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
      out.body_chars = bodyText.length;
      out.body_sample = bodyText.slice(0, 500).replace(/\s+/g, ' ').trim();
      const lc = bodyText.toLowerCase();
      for (const t of texts) out.texts_found[t] = lc.includes(t.toLowerCase());
    }
  } catch (e) {
    out.error = e.message;
  } finally {
    await ctx.close().catch(() => {});
  }
  return out;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  fs.writeFileSync(OUT, '');
  const results = [];

  for (const t of TARGETS) {
    process.stdout.write(`\n=== ${t.id} ${t.name} ===\n`);
    const aggregate = {};
    for (const txt of t.texts) aggregate[txt] = { found: false, found_on: null };
    const rec = { id: t.id, name: t.name, base: t.base, probes: [], aggregate };

    for (const sub of t.sub_paths) {
      const url = new URL(sub, t.base).toString();
      process.stdout.write(`  ${url} ... `);
      const r = await probe(browser, url, t.texts);
      r.sub = sub;
      rec.probes.push(r);
      process.stdout.write(`status=${r.status} body=${r.body_chars}\n`);
      if (r.status >= 200 && r.status < 400 && r.body_chars > 100) {
        for (const txt of t.texts) {
          if (r.texts_found[txt] && !aggregate[txt].found) {
            aggregate[txt] = { found: true, found_on: url };
          }
        }
      }
    }

    results.push(rec);
    fs.appendFileSync(OUT, JSON.stringify(rec) + '\n');
  }

  await browser.close();

  let md = `# Sub-page Reprobe — v63-E02 + v63-E05\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  for (const r of results) {
    md += `## ${r.id} ${r.name}\n`;
    md += `Base: ${r.base}\n\n`;
    md += `**Aggregate text-found across all sub-pages:**\n`;
    for (const [txt, info] of Object.entries(r.aggregate)) {
      md += `- ${txt}: ${info.found ? `FOUND on ${info.found_on}` : 'NOT FOUND'}\n`;
    }
    md += `\n**Per-page detail:**\n`;
    for (const p of r.probes) {
      md += `- ${p.url} → status=${p.status} body=${p.body_chars}`;
      if (p.error) md += ` err="${p.error.slice(0, 100)}"`;
      md += `\n`;
    }
    md += `\n`;
  }
  fs.writeFileSync(SUMMARY, md);
  console.log(`\nReprobe done. ${SUMMARY}`);
})();
