// SG WAF bypass via Playwright JS-challenge solve
// Loads homepage first to acquire sgcaptcha clearance, then fetches target URL
import { chromium } from 'playwright';
import fs from 'fs';

const url = process.argv[2];
if (!url) { console.error('usage: node sg-waf-page-fetch.mjs <url>'); process.exit(1); }

const ctxFile = '/tmp/sg-clearance-ctx.json';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  storageState: fs.existsSync(ctxFile) ? ctxFile : undefined,
  viewport: { width: 1280, height: 800 }
});
const page = await ctx.newPage();

// Warm-up: hit homepage to acquire sgcaptcha clearance cookie if not cached
if (!fs.existsSync(ctxFile)) {
  await page.goto('https://reyco.glvmarketing.ca/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000); // let JS challenge settle
  await ctx.storageState({ path: ctxFile });
}

// Navigate to target
const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
const status = resp ? resp.status() : 0;
const finalUrl = page.url();
const title = await page.title().catch(() => '');
const html = await page.content();

console.log(JSON.stringify({ status, finalUrl, title, htmlBytes: html.length }));
// Save full HTML to /tmp/page-{slug}.html for inspection
const slug = url.replace(/^https?:\/\/[^/]+/, '').replace(/[^a-z0-9]/gi, '_').slice(0, 80) || 'home';
fs.writeFileSync(`/tmp/page-${slug}.html`, html);
console.error(`html_saved:/tmp/page-${slug}.html`);

await browser.close();
