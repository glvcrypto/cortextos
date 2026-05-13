#!/usr/bin/env node
// PASS 2 sweep — per-claim Playwright probes for cycle-19 re-vet.
// Reads pass2-claim-probes.json, runs each probe, outputs results JSONL + summary MD.
//
// Probe types:
//   playwright_text: load url, check rendered body for substring (or negate)
//   playwright_selector: load url, check selector presence
//   playwright_http_status: load url, check response status code
//   playwright_nav_count: load url, enumerate <nav> / <a> links to count pages
//   google_serp_surrogate: load google search, check if prospect URL appears on page 1
//   google_serp_review_count: load google search, extract review count from knowledge panel
//   google_serp_no_website: load google search, check if knowledge panel has website link
//   manual_kill: pre-classified KILL per banked rule, no probe runs

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROBES = path.join(__dirname, 'pass2-claim-probes.json');
const OUT_JSONL = path.join(__dirname, 'pass2-results.jsonl');
const OUT_SUMMARY = path.join(__dirname, 'pass2-summary.md');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

async function loadAndCheck(browser, url, opts = {}) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { url, status: null, final_url: null, title: null, body_chars: 0, body_sample: null, text_found: null, error: null };
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    out.status = response ? response.status() : null;
    out.final_url = page.url();
    try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
    await page.waitForTimeout(2000);
    out.title = await page.title().catch(() => null);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    out.body_chars = bodyText.length;
    out.body_sample = bodyText.slice(0, 500).replace(/\s+/g, ' ').trim();
    if (opts.text) {
      out.text_found = bodyText.toLowerCase().includes(opts.text.toLowerCase());
    }
    if (opts.nav_count) {
      out.nav_links = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href]'));
        const set = new Set();
        for (const a of links) {
          const href = a.getAttribute('href');
          if (!href) continue;
          if (href.startsWith('http') && !href.includes(location.hostname)) continue;
          if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
          set.add(href.split('#')[0].split('?')[0]);
        }
        return Array.from(set).slice(0, 50);
      });
    }
  } catch (e) {
    out.error = e.message;
  } finally {
    await ctx.close().catch(() => {});
  }
  return out;
}

async function googleSearch(browser, query) {
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const out = { query, results: [], knowledge_panel: null, review_count: null, has_website_link: null, body_sample: null, error: null };
  try {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&gl=ca&hl=en`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch (e) {}
    await page.waitForTimeout(3000);
    const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '').catch(() => '');
    out.body_sample = bodyText.slice(0, 1000).replace(/\s+/g, ' ').trim();
    // Extract organic result URLs from page-1
    out.results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      const set = new Set();
      for (const a of links) {
        const href = a.getAttribute('href');
        if (!href) continue;
        if (href.startsWith('/search') || href.includes('google.com/search') || href.startsWith('#')) continue;
        if (href.startsWith('http')) {
          try { const u = new URL(href); if (u.hostname !== 'www.google.com' && u.hostname !== 'google.com') set.add(u.hostname); } catch (e) {}
        }
      }
      return Array.from(set).slice(0, 30);
    });
    // Try to extract review count from knowledge panel
    const reviewMatch = bodyText.match(/(\d{1,4})\s*Google\s*reviews?/i) || bodyText.match(/(\d{1,4})\s*reviews?\s*·?\s*Google/i);
    if (reviewMatch) out.review_count = parseInt(reviewMatch[1], 10);
  } catch (e) {
    out.error = e.message;
  } finally {
    await ctx.close().catch(() => {});
  }
  return out;
}

function extractHostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return null; }
}

async function processClaim(browser, prospect, claim) {
  const r = {
    id: prospect.id, name: prospect.name, prospect_url: prospect.url,
    claim: claim.claim, type: claim.type, verdict: null, notes: null, evidence: null,
    checked_at: new Date().toISOString(),
  };
  try {
    if (claim.type === 'manual_kill') {
      r.verdict = 'KILL';
      r.notes = claim.reason;
      return r;
    }
    if (claim.type === 'playwright_text') {
      const probe = await loadAndCheck(browser, claim.url, { text: claim.text });
      r.evidence = { status: probe.status, title: probe.title, body_chars: probe.body_chars, text_found: probe.text_found, body_sample: probe.body_sample };
      if (probe.error) { r.verdict = 'KILL'; r.notes = `Probe error: ${probe.error}`; return r; }
      const expected = claim.negate ? !probe.text_found : probe.text_found;
      r.verdict = expected ? 'KEEP' : 'KILL';
      r.notes = expected ? `Text "${claim.text}" ${claim.negate ? 'absent' : 'present'} as claimed` : `Text "${claim.text}" ${claim.negate ? 'unexpectedly present' : 'NOT FOUND'}`;
      return r;
    }
    if (claim.type === 'playwright_http_status') {
      const probe = await loadAndCheck(browser, claim.url);
      r.evidence = { status: probe.status, title: probe.title };
      if (probe.error && !probe.status) { r.verdict = 'KILL'; r.notes = `Probe error: ${probe.error}`; return r; }
      r.verdict = probe.status === claim.expected_status ? 'KEEP' : 'KILL';
      r.notes = `HTTP ${probe.status} ${probe.status === claim.expected_status ? '== expected ' : '!= expected '} ${claim.expected_status}`;
      return r;
    }
    if (claim.type === 'playwright_nav_count') {
      const probe = await loadAndCheck(browser, claim.url, { nav_count: true });
      r.evidence = { status: probe.status, title: probe.title, nav_links: probe.nav_links, nav_count: probe.nav_links ? probe.nav_links.length : 0 };
      r.verdict = 'INFO';
      r.notes = `Found ${probe.nav_links ? probe.nav_links.length : 0} unique internal links: ${(probe.nav_links || []).slice(0, 15).join(', ')}`;
      return r;
    }
    if (claim.type === 'google_serp_review_count') {
      const probe = await googleSearch(browser, claim.search_query);
      r.evidence = { query: claim.search_query, review_count_extracted: probe.review_count, results: probe.results.slice(0, 10), body_sample: probe.body_sample };
      if (probe.review_count === null) {
        r.verdict = 'UNKNOWN';
        r.notes = `Could not extract review count from SERP. Body sample suggests: ${probe.body_sample.slice(0, 300)}`;
        return r;
      }
      if (claim.expected_count_range) {
        const [min, max] = claim.expected_count_range;
        r.verdict = probe.review_count >= min && probe.review_count <= max ? 'KEEP' : 'KILL';
        r.notes = `Extracted ${probe.review_count} reviews, expected range [${min}, ${max}]`;
      } else {
        r.verdict = 'INFO';
        r.notes = `Extracted ${probe.review_count} reviews — manual cross-check vs claim`;
      }
      return r;
    }
    if (claim.type === 'google_serp_surrogate') {
      const probe = await googleSearch(browser, claim.search_query);
      const host = extractHostname(prospect.url);
      const found = host ? probe.results.some(h => h.includes(host)) : false;
      r.evidence = { query: claim.search_query, prospect_hostname: host, found_on_page_1: found, top_hostnames: probe.results.slice(0, 10) };
      // For "0 organic visibility" claim: if found on page 1, claim is FALSE → KILL
      r.verdict = found ? 'KILL' : 'KEEP';
      r.notes = found ? `Prospect ${host} surfaces on Google page 1 — "0 visibility" claim FALSE` : `Prospect ${host} NOT on page 1 — surrogate supports claim direction`;
      return r;
    }
    if (claim.type === 'google_serp_no_website') {
      const probe = await googleSearch(browser, claim.search_query);
      // Check for website-like results in top hits
      const businessHosts = probe.results.filter(h => !h.includes('yelp') && !h.includes('facebook') && !h.includes('yellowpages') && !h.includes('google') && !h.includes('linkedin') && !h.includes('instagram') && !h.includes('mapquest') && !h.includes('bbb.org') && !h.includes('homestars') && !h.includes('houzz'));
      r.evidence = { query: claim.search_query, top_hostnames: probe.results.slice(0, 15), non_directory_hosts: businessHosts.slice(0, 10) };
      r.verdict = businessHosts.length === 0 ? 'KEEP' : 'INFO';
      r.notes = businessHosts.length === 0 ? 'No business-owned website on page 1 — supports "no website" claim' : `Possible website-like hosts found: ${businessHosts.slice(0, 5).join(', ')} — manual review needed`;
      return r;
    }
    if (claim.type === 'playwright_selector') {
      const probe = await loadAndCheck(browser, claim.url, { text: claim.text });
      r.evidence = { status: probe.status, title: probe.title, text_found: probe.text_found };
      r.verdict = probe.text_found ? 'KEEP' : 'KILL';
      r.notes = probe.text_found ? 'Text present' : 'Text not present';
      return r;
    }
    r.verdict = 'UNKNOWN';
    r.notes = `Unknown probe type: ${claim.type}`;
  } catch (e) {
    r.verdict = 'ERROR';
    r.notes = `Exception: ${e.message}`;
  }
  return r;
}

(async () => {
  const config = JSON.parse(fs.readFileSync(PROBES, 'utf8'));
  const prospects = config.prospects;
  const total = prospects.reduce((s, p) => s + p.claims.length, 0);
  console.log(`PASS 2 starting: ${prospects.length} prospects, ${total} claims`);

  const browser = await chromium.launch({ headless: true });
  fs.writeFileSync(OUT_JSONL, '');

  const results = [];
  for (const p of prospects) {
    for (const c of p.claims) {
      process.stdout.write(`  ${p.id} ${p.name.slice(0, 30).padEnd(30)} ${c.type.padEnd(28)} ... `);
      const r = await processClaim(browser, p, c);
      results.push(r);
      fs.appendFileSync(OUT_JSONL, JSON.stringify(r) + '\n');
      console.log(r.verdict);
    }
  }

  await browser.close();

  // Build summary: aggregate KEEP/KILL/INFO/UNKNOWN per prospect
  const byProspect = {};
  for (const r of results) {
    if (!byProspect[r.id]) byProspect[r.id] = { name: r.name, url: r.prospect_url, claims: [] };
    byProspect[r.id].claims.push(r);
  }

  let md = `# PASS 2 Sweep — Per-claim Playwright probe results\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n`;
  md += `**Total claims probed:** ${results.length}\n\n`;
  const counts = {};
  for (const r of results) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
  md += `## Claim-level verdict counts\n\n`;
  for (const [v, c] of Object.entries(counts).sort((a, b) => b[1] - a[1])) md += `- **${v}**: ${c}\n`;
  md += `\n## Per-prospect summary\n\n`;
  md += `| ID | Name | URL | KEEP | KILL | INFO | UNKNOWN | ERROR | Prospect verdict |\n`;
  md += `|---|---|---|---|---|---|---|---|---|\n`;
  for (const [id, p] of Object.entries(byProspect)) {
    const tally = { KEEP: 0, KILL: 0, INFO: 0, UNKNOWN: 0, ERROR: 0 };
    for (const c of p.claims) tally[c.verdict] = (tally[c.verdict] || 0) + 1;
    // Prospect verdict: if any KILL → KILL. Else if all KEEP → KEEP. Else INVESTIGATE.
    let prospectVerdict;
    if (tally.KILL > 0) prospectVerdict = 'KILL';
    else if (tally.UNKNOWN > 0 || tally.ERROR > 0) prospectVerdict = 'INVESTIGATE';
    else if (tally.KEEP > 0 && tally.INFO === 0) prospectVerdict = 'KEEP';
    else prospectVerdict = 'INVESTIGATE';
    md += `| ${id} | ${p.name} | ${p.url || '—'} | ${tally.KEEP} | ${tally.KILL} | ${tally.INFO} | ${tally.UNKNOWN} | ${tally.ERROR} | **${prospectVerdict}** |\n`;
  }

  md += `\n## Per-claim detail\n\n`;
  for (const r of results) {
    md += `### ${r.id} ${r.name} — ${r.claim}\n`;
    md += `- **Verdict:** ${r.verdict}\n`;
    md += `- **Type:** ${r.type}\n`;
    md += `- **Notes:** ${r.notes}\n`;
    if (r.evidence) md += `- **Evidence:** \`${JSON.stringify(r.evidence).slice(0, 400)}\`\n`;
    md += `\n`;
  }

  fs.writeFileSync(OUT_SUMMARY, md);
  console.log(`\nPASS 2 done. Results: ${OUT_JSONL} + ${OUT_SUMMARY}`);
  console.log('Verdict counts:', counts);
})();
