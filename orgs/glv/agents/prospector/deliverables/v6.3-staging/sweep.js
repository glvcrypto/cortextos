#!/usr/bin/env node
// v6.3 Step-1 sweep — Playwright-from-step-1 verification of all hooks across 5 fresh Peterborough HVAC candidates.
// Pattern follows cycle-19 pass2-sweep.js: page.goto + waitForLoadState('networkidle') + text-probes / HTTP-status / Bing surrogate.

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CANDS = path.join(__dirname, 'candidates.json');
const OUT_JSONL = path.join(__dirname, 'sweep-results.jsonl');
const OUT_SUMMARY = path.join(__dirname, 'sweep-summary.md');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

async function loadAndCheck(browser, url, texts) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, final_url: null, title: null, body_chars: 0, body_sample: null, texts_found: {}, error: null };
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
    if (texts && texts.length) {
      for (const t of texts) out.texts_found[t] = lc.includes(t.toLowerCase());
    }
    // Also extract any href on the page that looks like a contact link or email
    const links = await page.evaluate(() => {
      const out = { mailto: [], contact_pages: [] };
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      for (const a of anchors) {
        const h = a.getAttribute('href') || '';
        if (h.startsWith('mailto:')) out.mailto.push(h.slice(7).split('?')[0]);
        else if (/contact/i.test(h) && !h.startsWith('mailto:')) out.contact_pages.push(h);
      }
      return { mailto: Array.from(new Set(out.mailto)), contact_pages: Array.from(new Set(out.contact_pages)).slice(0, 5) };
    }).catch(() => ({ mailto: [], contact_pages: [] }));
    out.mailto_links = links.mailto;
    out.contact_page_hrefs = links.contact_pages;
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

async function fetchContactPage(browser, baseUrl, contactHref) {
  if (!contactHref) return null;
  let fullUrl = contactHref;
  if (!fullUrl.startsWith('http')) {
    try {
      fullUrl = new URL(contactHref, baseUrl).toString();
    } catch (e) { return null; }
  }
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url: fullUrl, mailto: [], body_emails: [], error: null };
  try {
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) {}
    await page.waitForTimeout(2000);
    out.mailto = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      return Array.from(new Set(anchors.map(a => (a.getAttribute('href') || '').slice(7).split('?')[0])));
    }).catch(() => []);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    out.body_emails = Array.from(new Set((bodyText.match(emailRe) || []).filter(e => !/example\.com|sentry|wixpress|@2x/i.test(e))));
  } catch (e) {
    out.error = e.message;
  } finally {
    await ctx.close().catch(() => {});
  }
  return out;
}

(async () => {
  const data = JSON.parse(fs.readFileSync(CANDS, 'utf8'));
  const browser = await chromium.launch({ headless: true });
  fs.writeFileSync(OUT_JSONL, '');

  const results = [];

  for (const c of data.candidates) {
    process.stdout.write(`\n=== ${c.id} ${c.name} (${c.url}) ===\n`);
    const rec = { id: c.id, name: c.name, url: c.url, phone: c.phone, scout_score: c.scout_score, hypothesized_hook_angle: c.hypothesized_hook_angle, hooks: [], homepage: null, bing: null, contact: null, checked_at: new Date().toISOString() };

    // Step 1: load homepage and gather text-found across all hook texts
    const allTexts = [];
    for (const h of c.candidate_hooks) {
      if (h.type === 'playwright_text' && h.texts) {
        for (const t of h.texts) if (!allTexts.includes(t)) allTexts.push(t);
      }
    }
    process.stdout.write(`  Homepage probe (${allTexts.length} text targets)... `);
    rec.homepage = await loadAndCheck(browser, c.url, allTexts);
    process.stdout.write(`status=${rec.homepage.status} body=${rec.homepage.body_chars} err=${rec.homepage.error||'none'}\n`);

    // Bind text-found-results into each playwright_text hook
    for (const h of c.candidate_hooks) {
      const hr = { id: h.id, claim: h.claim, type: h.type };
      if (h.type === 'playwright_text') {
        hr.texts_required = h.texts;
        hr.texts_found = {};
        for (const t of h.texts) hr.texts_found[t] = rec.homepage.texts_found[t] || false;
        const allFound = h.texts.every(t => hr.texts_found[t]);
        const anyFound = h.texts.some(t => hr.texts_found[t]);
        hr.verdict = allFound ? 'VERIFIED_ALL' : (anyFound ? 'PARTIAL' : 'NOT_FOUND');
      } else if (h.type === 'bing_surrogate') {
        process.stdout.write(`  Bing surrogate "${h.search_query}"... `);
        const bp = await bingSearch(browser, h.search_query);
        hr.bing_blocked = bp.blocked;
        hr.bing_top_hosts = bp.results;
        hr.target_host = h.target_host;
        if (h.target_host) {
          const found = bp.results.some(host => host.includes(h.target_host));
          hr.target_on_page_1 = found;
          hr.verdict = bp.blocked ? 'BLOCKED' : (found ? 'TARGET_RANKS' : 'TARGET_INVISIBLE');
        } else {
          hr.verdict = bp.blocked ? 'BLOCKED' : 'BING_OK';
        }
        process.stdout.write(`${hr.verdict}\n`);
      }
      rec.hooks.push(hr);
    }

    // Contact-page fetch for email discovery
    if (rec.homepage.contact_page_hrefs && rec.homepage.contact_page_hrefs.length) {
      const cp = await fetchContactPage(browser, c.url, rec.homepage.contact_page_hrefs[0]);
      rec.contact = cp;
      process.stdout.write(`  Contact page: ${cp ? (cp.url + ' mailto=' + cp.mailto.length + ' body_emails=' + cp.body_emails.length) : 'NONE'}\n`);
    }

    // Bing visibility default (whether site appears for plain name query)
    process.stdout.write(`  Bing default visibility query... `);
    const defQ = `${c.name} ${c.city}`;
    const bd = await bingSearch(browser, defQ);
    rec.bing_default = { query: defQ, blocked: bd.blocked, top_hosts: bd.results, target_host_ranks: bd.results.some(h => {
      try { return new URL(c.url).hostname.replace(/^www\./, '').split('.')[0]; } catch (e) { return false; }
    }) };
    // Better target-on-page-1 check using actual URL host:
    try {
      const targetHost = new URL(c.url).hostname.replace(/^www\./, '');
      rec.bing_default.target_on_page_1 = bd.results.some(h => h.replace(/^www\./, '').includes(targetHost.split('.')[0]));
    } catch (e) { rec.bing_default.target_on_page_1 = null; }
    process.stdout.write(`blocked=${bd.blocked} hosts=${bd.results.length} target_ranks=${rec.bing_default.target_on_page_1}\n`);

    results.push(rec);
    fs.appendFileSync(OUT_JSONL, JSON.stringify(rec) + '\n');
  }

  await browser.close();

  // Summary MD
  let md = `# v6.3 Step-1 Sweep — Playwright verification of 5 Peterborough HVAC candidates\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Source:** ${path.relative(__dirname, CANDS)}\n`;
  md += `**Standard:** cycle-19 retool (Playwright-rendered probes, KILL-only on unverifiable specifics)\n\n`;
  for (const r of results) {
    md += `## ${r.id} ${r.name}\n`;
    md += `- **URL:** ${r.url} | scout: ${r.scout_score} | phone: ${r.phone || 'n/a'}\n`;
    md += `- **Homepage:** status=${r.homepage.status} body_chars=${r.homepage.body_chars} title="${(r.homepage.title || '').slice(0,80)}" err=${r.homepage.error || 'none'}\n`;
    md += `- **Hypothesized hook:** ${r.hypothesized_hook_angle}\n`;
    md += `- **Hook verifications:**\n`;
    for (const h of r.hooks) {
      md += `  - ${h.id} [${h.verdict}] ${h.claim}\n`;
      if (h.type === 'playwright_text') {
        const found = Object.entries(h.texts_found).filter(([k,v]) => v).map(([k]) => k);
        const missing = Object.entries(h.texts_found).filter(([k,v]) => !v).map(([k]) => k);
        md += `    - Found: [${found.join(', ')}]\n`;
        md += `    - Missing: [${missing.join(', ')}]\n`;
      } else if (h.type === 'bing_surrogate') {
        md += `    - Bing blocked: ${h.bing_blocked} | target "${h.target_host}" on page 1: ${h.target_on_page_1}\n`;
        md += `    - Bing top hosts: ${(h.bing_top_hosts || []).slice(0, 8).join(', ')}\n`;
      }
    }
    md += `- **Bing default visibility (${r.bing_default.query}):** target_on_page_1=${r.bing_default.target_on_page_1} | blocked=${r.bing_default.blocked} | hosts=${(r.bing_default.top_hosts || []).slice(0,8).join(', ')}\n`;
    md += `- **Contact discovery:** mailto_homepage=[${(r.homepage.mailto_links||[]).join(', ')}]\n`;
    if (r.contact) {
      md += `  - Contact page: ${r.contact.url}\n`;
      md += `    - mailto: [${r.contact.mailto.join(', ')}]\n`;
      md += `    - body emails: [${r.contact.body_emails.join(', ')}]\n`;
    }
    md += `\n`;
  }
  fs.writeFileSync(OUT_SUMMARY, md);
  console.log(`\nSweep complete. Results: ${OUT_JSONL}, Summary: ${OUT_SUMMARY}`);
})();
