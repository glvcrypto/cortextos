#!/usr/bin/env node
// PASS 1 sweep — Playwright-rendered site-state check across all staged prospects.
// Outputs JSON-lines results so downstream kill-list builder can consume.
//
// For each prospect:
//   - Skip if url == null (no-website hook — verify separately)
//   - chromium.launch → page.goto with networkidle → wait 2s for JS widgets
//   - Capture: HTTP status, final URL, title, body length, anti-bot markers, body text sample
//   - Classify: LOADS_OK | LOAD_FAILED | NAV_ERROR | ANTI_BOT_GATED | NO_URL

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const MANIFEST = path.join(__dirname, 'pass1-prospect-manifest.json');
const OUT_JSONL = path.join(__dirname, 'pass1-results.jsonl');
const OUT_SUMMARY = path.join(__dirname, 'pass1-summary.md');

// Markers that indicate a *challenge* page (vs incidental reCAPTCHA in a contact form)
const ANTI_BOT_CHALLENGE_MARKERS = [
  'sg-captcha', 'cf-challenge', 'cf-browser-verification', 'cf-chl-bypass',
  'just a moment', 'checking your browser', 'sgcaptcha',
  'access denied', 'attention required', 'sucuri',
];
// Strong evidence a challenge page is being served (rendered title)
const CHALLENGE_TITLE_FRAGMENTS = [
  'just a moment', 'attention required', 'access denied', 'checking your browser',
];
// Threshold: real content sites have >500 chars body; pure challenge pages have <500
const CHALLENGE_BODY_MAX_CHARS = 500;

async function checkProspect(browser, p) {
  const result = {
    id: p.id, name: p.name, url: p.url, hook: p.hook,
    site_state_claim: p.site_state_claim, claim_type: p.claim_type,
    verdict: null, status: null, final_url: null, title: null,
    body_chars: 0, body_sample: null, anti_bot: false, anti_bot_marker: null,
    error: null, checked_at: new Date().toISOString(),
  };

  if (!p.url) {
    result.verdict = 'NO_URL';
    return result;
  }

  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();

  try {
    const response = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    result.status = response ? response.status() : null;
    result.final_url = page.url();

    try {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (e) { /* networkidle timeout OK */ }
    await page.waitForTimeout(2000);

    result.title = await page.title().catch(() => null);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    result.body_chars = bodyText.length;
    result.body_sample = bodyText.slice(0, 400).replace(/\s+/g, ' ').trim();

    const html = await page.content().catch(() => '');
    const lcHtml = html.toLowerCase();
    const lcBody = bodyText.toLowerCase();
    const lcTitle = (result.title || '').toLowerCase();

    // Title-based detection (strongest signal — challenge pages have distinctive titles)
    for (const f of CHALLENGE_TITLE_FRAGMENTS) {
      if (lcTitle.includes(f)) {
        result.anti_bot = true;
        result.anti_bot_marker = `title:${f}`;
        break;
      }
    }
    // Body+marker detection — only flag if marker present AND body too small to be real content
    if (!result.anti_bot && result.body_chars < CHALLENGE_BODY_MAX_CHARS) {
      for (const m of ANTI_BOT_CHALLENGE_MARKERS) {
        if (lcHtml.includes(m) || lcBody.includes(m)) {
          result.anti_bot = true;
          result.anti_bot_marker = `low_content+${m}`;
          break;
        }
      }
    }

    if (result.anti_bot) {
      result.verdict = 'ANTI_BOT_GATED';
    } else if (result.status && result.status >= 200 && result.status < 400 && result.body_chars > 100) {
      result.verdict = 'LOADS_OK';
    } else if (result.status && result.status >= 300 && result.status < 400) {
      result.verdict = 'REDIRECT_NO_CONTENT';
    } else {
      result.verdict = 'LOAD_FAILED';
    }
  } catch (e) {
    result.error = e.message;
    if (/DNS|ENOTFOUND|getaddrinfo/i.test(e.message)) {
      result.verdict = 'DNS_NXDOMAIN';
    } else if (/timeout|TimeoutError/i.test(e.message)) {
      result.verdict = 'NAV_TIMEOUT';
    } else if (/SSL|cert|TLS/i.test(e.message)) {
      result.verdict = 'TLS_ERROR';
    } else {
      result.verdict = 'NAV_ERROR';
    }
  } finally {
    await ctx.close().catch(() => {});
  }
  return result;
}

(async () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const prospects = manifest.prospects;
  console.log(`PASS 1 starting: ${prospects.length} prospects`);

  const browser = await chromium.launch({ headless: true });
  fs.writeFileSync(OUT_JSONL, '');

  const results = [];
  for (const p of prospects) {
    process.stdout.write(`  ${p.id} ${p.name.padEnd(40)} ... `);
    const r = await checkProspect(browser, p);
    results.push(r);
    fs.appendFileSync(OUT_JSONL, JSON.stringify(r) + '\n');
    const tag = r.verdict + (r.status ? ` (${r.status})` : '');
    console.log(tag);
  }

  await browser.close();

  // Build summary
  const counts = {};
  for (const r of results) counts[r.verdict] = (counts[r.verdict] || 0) + 1;

  let md = `# PASS 1 Sweep — Playwright-rendered site-state check\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Total prospects:** ${prospects.length}\n\n`;
  md += `## Verdict counts\n\n`;
  for (const [v, c] of Object.entries(counts).sort((a,b) => b[1]-a[1])) {
    md += `- **${v}**: ${c}\n`;
  }
  md += `\n## Per-prospect results\n\n`;
  md += `| ID | Name | URL | v6 hook | Claim type | Playwright verdict | Status | Title | Body chars | Body sample (400) |\n`;
  md += `|---|---|---|---|---|---|---|---|---|---|\n`;
  for (const r of results) {
    const cell = s => (s || '').toString().replace(/\|/g, '\\|').replace(/\n/g, ' ');
    md += `| ${cell(r.id)} | ${cell(r.name)} | ${cell(r.url || '—')} | ${cell(r.hook)} | ${cell(r.claim_type)} | **${cell(r.verdict)}** | ${cell(r.status || '—')} | ${cell(r.title || '—')} | ${cell(r.body_chars)} | ${cell((r.body_sample || '').slice(0, 200))} |\n`;
  }

  fs.writeFileSync(OUT_SUMMARY, md);
  console.log(`\nPASS 1 done. Results: ${OUT_JSONL} + ${OUT_SUMMARY}`);
  console.log('Verdict counts:', counts);
})();
