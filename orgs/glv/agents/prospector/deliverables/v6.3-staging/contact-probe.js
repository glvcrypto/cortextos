#!/usr/bin/env node
// Contact-page probe for Neil Johnston + Tom's (no mailto found on homepage during main sweep)

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const OUT_SUMMARY = path.join(__dirname, 'contact-probe-summary.md');

const targets = [
  { id: 'v63-E01', name: 'Neil Johnston Heating', base: 'https://www.neiljohnstonheating.ca/', paths: ['contact', 'contact-us', 'about', 'about-us'] },
  { id: 'v63-E03', name: "Tom's Heating & Cooling", base: 'https://tomsheatingandcooling.ca/', paths: ['contact', 'contact-us', 'about', 'about-us'] }
];

async function probe(browser, url) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, title: null, body_chars: 0, mailto: [], body_emails: [], body_sample: '', error: null };
  try {
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    out.status = r ? r.status() : null;
    try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch (e) {}
    await page.waitForTimeout(2000);
    out.title = await page.title().catch(() => null);
    out.mailto = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      return Array.from(new Set(anchors.map(a => (a.getAttribute('href') || '').slice(7).split('?')[0])));
    }).catch(() => []);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    out.body_chars = bodyText.length;
    const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    out.body_emails = Array.from(new Set((bodyText.match(emailRe) || []).filter(e => !/example\.com|sentry|wixpress|@2x|godaddy|email-here|youremail/i.test(e))));
    out.body_sample = bodyText.slice(0, 400).replace(/\s+/g, ' ').trim();
  } catch (e) { out.error = e.message; }
  finally { await ctx.close().catch(() => {}); }
  return out;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let md = `# Contact-Page Probe — Neil Johnston + Tom's\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  for (const t of targets) {
    md += `## ${t.id} ${t.name}\n`;
    for (const p of t.paths) {
      const url = t.base + p;
      process.stdout.write(`  ${url}... `);
      const r = await probe(browser, url);
      process.stdout.write(`status=${r.status} mailto=${r.mailto.length} body_emails=${r.body_emails.length}\n`);
      md += `- ${url} → status=${r.status} title="${(r.title || '').slice(0,80)}" body_chars=${r.body_chars}\n`;
      md += `  - mailto: [${r.mailto.join(', ')}]\n`;
      md += `  - body_emails: [${r.body_emails.join(', ')}]\n`;
      if (r.body_sample) md += `  - body_sample: ${r.body_sample.slice(0, 200)}\n`;
    }
    md += `\n`;
  }
  await browser.close();
  fs.writeFileSync(OUT_SUMMARY, md);
  console.log(`\nDone. ${OUT_SUMMARY}`);
})();
