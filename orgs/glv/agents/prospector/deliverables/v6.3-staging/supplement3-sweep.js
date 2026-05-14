#!/usr/bin/env node
// Supplemental sweep #3 — Randle + Hitchon's (Peterborough plumbing)

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CANDS = path.join(__dirname, 'candidates-supplement3.json');
const OUT_JSONL = path.join(__dirname, 'supplement3-results.jsonl');
const OUT_SUMMARY = path.join(__dirname, 'supplement3-summary.md');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

async function loadAndCheck(browser, url, texts) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, final_url: null, title: null, body_chars: 0, body_sample: null, texts_found: {}, mailto_links: [], contact_page_hrefs: [], error: null };
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
    if (texts && texts.length) for (const t of texts) out.texts_found[t] = lc.includes(t.toLowerCase());
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
  } catch (e) { out.error = e.message; }
  finally { await ctx.close().catch(() => {}); }
  return out;
}

async function fetchContactPage(browser, baseUrl, contactHref) {
  if (!contactHref) return null;
  let fullUrl = contactHref;
  if (!fullUrl.startsWith('http')) {
    try { fullUrl = new URL(contactHref, baseUrl).toString(); } catch (e) { return null; }
  }
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url: fullUrl, mailto: [], body_emails: [], error: null };
  try {
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) {}
    await page.waitForTimeout(2000);
    out.mailto = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      return Array.from(new Set(a.map(x => (x.getAttribute('href') || '').slice(7).split('?')[0])));
    }).catch(() => []);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    out.body_emails = Array.from(new Set((bodyText.match(emailRe) || []).filter(e => !/example\.com|sentry|wixpress|@2x|johndoe|company\.com/i.test(e))));
  } catch (e) { out.error = e.message; }
  finally { await ctx.close().catch(() => {}); }
  return out;
}

(async () => {
  const data = JSON.parse(fs.readFileSync(CANDS, 'utf8'));
  const browser = await chromium.launch({ headless: true });
  fs.writeFileSync(OUT_JSONL, '');
  const results = [];

  for (const c of data.candidates) {
    process.stdout.write(`\n=== ${c.id} ${c.name} (${c.url}) ===\n`);
    const allTexts = [];
    for (const h of c.candidate_hooks) {
      if (h.type === 'playwright_text' && h.texts) for (const t of h.texts) if (!allTexts.includes(t)) allTexts.push(t);
    }
    process.stdout.write(`  Homepage probe (${allTexts.length} text targets)... `);
    const homepage = await loadAndCheck(browser, c.url, allTexts);
    process.stdout.write(`status=${homepage.status} body=${homepage.body_chars} err=${homepage.error||'none'}\n`);
    const rec = { id: c.id, name: c.name, url: c.url, phone: c.phone, scout_score: c.scout_score, hypothesized_hook_angle: c.hypothesized_hook_angle, homepage, hooks: [], contact: null, checked_at: new Date().toISOString() };

    for (const h of c.candidate_hooks) {
      const hr = { id: h.id, claim: h.claim, type: h.type, texts_required: h.texts, texts_found: {} };
      for (const t of h.texts) hr.texts_found[t] = homepage.texts_found[t] || false;
      const anyFound = h.texts.some(t => hr.texts_found[t]);
      const allFound = h.texts.every(t => hr.texts_found[t]);
      hr.verdict = allFound ? 'VERIFIED_ALL' : (anyFound ? 'PARTIAL' : 'NOT_FOUND');
      rec.hooks.push(hr);
    }

    if (homepage.contact_page_hrefs && homepage.contact_page_hrefs.length) {
      const cp = await fetchContactPage(browser, c.url, homepage.contact_page_hrefs[0]);
      rec.contact = cp;
      process.stdout.write(`  Contact page: ${cp ? (cp.url + ' mailto=' + cp.mailto.length + ' body_emails=' + cp.body_emails.length) : 'NONE'}\n`);
    }

    results.push(rec);
    fs.appendFileSync(OUT_JSONL, JSON.stringify(rec) + '\n');
  }

  await browser.close();

  let md = `# v6.3 Supplement Sweep #3 — Randle + Hitchon's\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  for (const r of results) {
    md += `## ${r.id} ${r.name}\n`;
    md += `- URL: ${r.url} | scout: ${r.scout_score} | phone: ${r.phone || 'n/a'}\n`;
    md += `- Homepage: status=${r.homepage.status} body_chars=${r.homepage.body_chars} title="${(r.homepage.title || '').slice(0,80)}"\n`;
    md += `- Hypothesized hook: ${r.hypothesized_hook_angle}\n`;
    for (const h of r.hooks) {
      md += `  - ${h.id} [${h.verdict}] ${h.claim}\n`;
      const found = Object.entries(h.texts_found).filter(([k,v]) => v).map(([k]) => k);
      const missing = Object.entries(h.texts_found).filter(([k,v]) => !v).map(([k]) => k);
      md += `    - Found: [${found.join(', ')}] | Missing: [${missing.join(', ')}]\n`;
    }
    md += `- mailto_homepage: [${(r.homepage.mailto_links||[]).join(', ')}]\n`;
    if (r.contact) {
      md += `- Contact page (${r.contact.url}): mailto=[${r.contact.mailto.join(', ')}] body_emails=[${r.contact.body_emails.join(', ')}]\n`;
    }
    md += `- Body sample (first 300): ${(r.homepage.body_sample||'').slice(0, 300)}\n\n`;
  }
  fs.writeFileSync(OUT_SUMMARY, md);
  console.log(`\nDone. ${OUT_SUMMARY}`);
})();
