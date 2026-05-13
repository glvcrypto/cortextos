#!/usr/bin/env node
// PASS 2 RE-PROBE — targeted fixes for failed/blocked probes from initial PASS 2.
// 1. B2-E04 Exclusive Cooling: try redirect-following and www variant
// 2. Re-attempt SERP surrogates via Bing (Google blocked us)
// 3. Re-attempt review counts via Bing or direct GBP card link

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pass2-reprobe-results.jsonl');
const SUMMARY = path.join(__dirname, 'pass2-reprobe-summary.md');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const REPROBES = [
  // B2-E04 Exclusive Cooling — try multiple URL variants
  {id: 'B2-E04', name: 'Exclusive Cooling Ltd', kind: 'url_variants', urls: [
    'http://www.exclusivecooling.ca/',
    'http://exclusivecooling.ca/',
    'https://www.exclusivecooling.ca/',
  ], texts: ['2023', '2015', 'Lennox', 'Cooling']},
  // Bing SERP surrogates for the SEMrush "0 visibility" type claims
  {id: 'B1-E09-bing', name: 'Witherell Plumbing & Heating', kind: 'bing_surrogate', query: 'Witherell Plumbing Heating', target_host: 'witherellplumbing.com'},
  {id: 'B1-E14-bing', name: 'Harris Plumbing visibility surrogate', kind: 'bing_surrogate', query: 'Harris Plumbing Barrie', target_host: 'harrisplumbing.ca'},
  // Bing for the "no website" prospects
  {id: 'B1-E08-bing', name: 'Blue Sky Plumbing no-website', kind: 'bing_no_website', query: 'Blue Sky Plumbing Sault Ste Marie'},
  {id: 'B1-E10-bing', name: 'B. Gibson Mechanical no-website', kind: 'bing_no_website', query: 'B. Gibson Mechanical Sault Ste Marie'},
  {id: 'B1-E13-bing', name: 'Sunrise Roofing no-website', kind: 'bing_no_website', query: 'Sunrise Roofing Sault Ste Marie'},
  {id: 'B1-E15-bing', name: 'Bedard Plumbing no-website', kind: 'bing_no_website', query: 'Bedard Plumbing Sault Ste Marie'},
  // Bing review counts (likely will fail — Bing doesn't surface GBP cards reliably, but worth trying)
  {id: 'B1-E01-bing', name: 'Priest Plumbing review count', kind: 'bing_review_search', query: 'Priest Plumbing Sault Ste Marie Google reviews'},
];

async function checkUrl(browser, url, texts) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, final_url: null, title: null, body_chars: 0, texts_found: {}, body_sample: null, error: null };
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    out.status = response ? response.status() : null;
    out.final_url = page.url();
    try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
    await page.waitForTimeout(2000);
    out.title = await page.title().catch(() => null);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    out.body_chars = bodyText.length;
    out.body_sample = bodyText.slice(0, 800).replace(/\s+/g, ' ').trim();
    const lc = bodyText.toLowerCase();
    for (const t of texts) out.texts_found[t] = lc.includes(t.toLowerCase());
  } catch (e) {
    out.error = e.message;
  } finally {
    await ctx.close().catch(() => {});
  }
  return out;
}

async function bingSearch(browser, query) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { query, results: [], body_sample: null, error: null, blocked: false };
  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&cc=ca`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) {}
    await page.waitForTimeout(2000);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    out.body_sample = bodyText.slice(0, 1500).replace(/\s+/g, ' ').trim();
    if (/unusual\s+traffic|are you a robot|captcha/i.test(bodyText)) {
      out.blocked = true;
    }
    out.results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('li.b_algo h2 a, h2 a[href^="http"]'));
      const set = new Set();
      for (const a of links) {
        const href = a.getAttribute('href');
        if (!href) continue;
        if (!href.startsWith('http')) continue;
        try { const u = new URL(href); if (!u.hostname.includes('bing.com') && !u.hostname.includes('microsoft.com')) set.add(u.hostname); } catch (e) {}
      }
      return Array.from(set).slice(0, 30);
    });
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

  for (const r of REPROBES) {
    process.stdout.write(`  ${r.id} ${r.name.slice(0, 40).padEnd(40)} ${r.kind.padEnd(20)} ... `);
    const rec = { ...r, checked_at: new Date().toISOString() };
    try {
      if (r.kind === 'url_variants') {
        rec.variants = [];
        for (const u of r.urls) {
          const probe = await checkUrl(browser, u, r.texts);
          rec.variants.push(probe);
        }
        // Determine: did ANY variant load successfully?
        const working = rec.variants.find(v => v.status >= 200 && v.status < 400 && v.body_chars > 100);
        rec.working_variant = working ? working.url : null;
        rec.verdict = working ? 'LOADS_OK' : 'NONE_LOAD';
        if (working) {
          rec.text_results = working.texts_found;
        }
      } else if (r.kind === 'bing_surrogate') {
        const probe = await bingSearch(browser, r.query);
        rec.bing_results = probe.results;
        rec.bing_blocked = probe.blocked;
        const found = probe.results.some(h => h.includes(r.target_host));
        rec.target_found_page_1 = found;
        if (probe.blocked) rec.verdict = 'BLOCKED';
        else rec.verdict = found ? 'KILL' : 'KEEP';
        rec.body_sample = probe.body_sample.slice(0, 300);
      } else if (r.kind === 'bing_no_website') {
        const probe = await bingSearch(browser, r.query);
        rec.bing_results = probe.results;
        rec.bing_blocked = probe.blocked;
        const businessHosts = probe.results.filter(h => !h.includes('yelp') && !h.includes('facebook') && !h.includes('yellowpages') && !h.includes('google') && !h.includes('linkedin') && !h.includes('instagram') && !h.includes('mapquest') && !h.includes('bbb.org') && !h.includes('homestars') && !h.includes('houzz') && !h.includes('bing.com') && !h.includes('microsoft.com'));
        rec.non_directory_hosts = businessHosts;
        if (probe.blocked) rec.verdict = 'BLOCKED';
        else rec.verdict = businessHosts.length === 0 ? 'KEEP_NO_WEBSITE' : 'POSSIBLE_WEBSITE';
        rec.body_sample = probe.body_sample.slice(0, 300);
      } else if (r.kind === 'bing_review_search') {
        const probe = await bingSearch(browser, r.query);
        rec.bing_blocked = probe.blocked;
        rec.body_sample = probe.body_sample;
        const reviewMatch = probe.body_sample.match(/(\d{1,4})\s*(?:Google\s*)?reviews?/i);
        rec.review_count_extracted = reviewMatch ? parseInt(reviewMatch[1], 10) : null;
        rec.verdict = rec.review_count_extracted !== null ? 'COUNT_EXTRACTED' : 'NO_COUNT';
      }
    } catch (e) {
      rec.error = e.message;
      rec.verdict = 'ERROR';
    }
    results.push(rec);
    fs.appendFileSync(OUT, JSON.stringify(rec) + '\n');
    console.log(rec.verdict || 'DONE');
  }

  await browser.close();

  // Summary
  let md = `# PASS 2 Re-Probe — Targeted fixes for blocked/failed probes\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;
  for (const r of results) {
    md += `## ${r.id} ${r.name}\n`;
    md += `- **Kind:** ${r.kind}\n`;
    md += `- **Verdict:** ${r.verdict}\n`;
    if (r.kind === 'url_variants') {
      md += `- **Working variant:** ${r.working_variant || 'NONE'}\n`;
      md += `- **Text results (at working variant):** ${r.text_results ? JSON.stringify(r.text_results) : 'N/A'}\n`;
      md += `- **All variant attempts:**\n`;
      for (const v of r.variants) md += `  - ${v.url} → status=${v.status} body=${v.body_chars} chars title=${(v.title || '').slice(0, 60)} error=${v.error || 'none'}\n`;
    } else {
      md += `- **Query:** ${r.query}\n`;
      if (r.bing_blocked !== undefined) md += `- **Bing blocked:** ${r.bing_blocked}\n`;
      if (r.bing_results) md += `- **Bing top hostnames:** ${r.bing_results.slice(0, 10).join(', ')}\n`;
      if (r.target_found_page_1 !== undefined) md += `- **Target host found on page 1:** ${r.target_found_page_1}\n`;
      if (r.non_directory_hosts) md += `- **Non-directory hosts:** ${r.non_directory_hosts.slice(0, 5).join(', ') || 'none'}\n`;
      if (r.review_count_extracted !== undefined) md += `- **Review count extracted:** ${r.review_count_extracted}\n`;
      if (r.body_sample) md += `- **Body sample:** ${r.body_sample.slice(0, 200)}\n`;
    }
    md += `\n`;
  }
  fs.writeFileSync(SUMMARY, md);
  console.log(`\nRe-probe done.`);
})();
