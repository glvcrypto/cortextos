#!/usr/bin/env node
// Deeper contact probe — Neil Johnston (.php) + Tom's full-site grep

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const OUT = path.join(__dirname, 'contact-probe2-summary.md');

const probes = [
  { id: 'v63-E01-contact', url: 'https://neiljohnstonheating.ca/contact.php' },
  { id: 'v63-E01-www-contact', url: 'https://www.neiljohnstonheating.ca/contact.php' },
  { id: 'v63-E01-homepage-deep', url: 'https://neiljohnstonheating.ca/' },
  { id: 'v63-E03-homepage-deep', url: 'https://tomsheatingandcooling.ca/' },
  { id: 'v63-E03-contact', url: 'https://tomsheatingandcooling.ca/contact' },
  { id: 'v63-E03-about', url: 'https://tomsheatingandcooling.ca/about' }
];

async function deep(browser, url) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, title: null, body_chars: 0, mailto: [], body_emails: [], html_emails: [], all_anchors: [], body_sample: '', error: null };
  try {
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    out.status = r ? r.status() : null;
    try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch (e) {}
    await page.waitForTimeout(2500);
    out.title = await page.title().catch(() => null);
    out.mailto = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
      return Array.from(new Set(a.map(x => (x.getAttribute('href') || '').slice(7).split('?')[0])));
    }).catch(() => []);
    const html = await page.content().catch(() => '');
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    out.body_chars = bodyText.length;
    out.body_sample = bodyText.slice(0, 600).replace(/\s+/g, ' ').trim();
    const emailRe = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    out.body_emails = Array.from(new Set((bodyText.match(emailRe) || []).filter(e => !/example\.com|sentry|wixpress|@2x|godaddy|email-here|youremail/i.test(e))));
    out.html_emails = Array.from(new Set((html.match(emailRe) || []).filter(e => !/example\.com|sentry|wixpress|@2x|godaddy|email-here|youremail|w3\.org|schemas|gstatic|googleapis/i.test(e))));
    out.all_anchors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')).filter(h => h).slice(0, 80);
    }).catch(() => []);
  } catch (e) { out.error = e.message; }
  finally { await ctx.close().catch(() => {}); }
  return out;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  let md = `# Contact Probe v2 — Deep email scan\n\n**Generated:** ${new Date().toISOString()}\n\n`;
  for (const p of probes) {
    process.stdout.write(`${p.id} ${p.url}... `);
    const r = await deep(browser, p.url);
    process.stdout.write(`status=${r.status} mailto=${r.mailto.length} body_emails=${r.body_emails.length} html_emails=${r.html_emails.length}\n`);
    md += `## ${p.id}\n- URL: ${r.url}\n- status=${r.status} title="${(r.title||'').slice(0,80)}" body_chars=${r.body_chars}\n`;
    md += `- mailto: [${r.mailto.join(', ')}]\n`;
    md += `- body_emails: [${r.body_emails.join(', ')}]\n`;
    md += `- html_emails: [${r.html_emails.join(', ')}]\n`;
    if (r.body_sample) md += `- body_sample: ${r.body_sample.slice(0, 250)}\n`;
    md += `- anchor_sample: ${(r.all_anchors||[]).filter(h => /contact|about|mail|@/i.test(h)).slice(0,10).join(' | ')}\n\n`;
  }
  await browser.close();
  fs.writeFileSync(OUT, md);
  console.log(`Done. ${OUT}`);
})();
