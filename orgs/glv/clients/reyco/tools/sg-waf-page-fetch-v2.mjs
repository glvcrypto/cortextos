// SG WAF bypass v2 — longer JS-challenge wait + stealth-like overrides
import { chromium } from 'playwright';
import fs from 'fs';

const url = process.argv[2];
if (!url) { console.error('usage: node sg-waf-page-fetch-v2.mjs <url>'); process.exit(1); }

const ctxFile = '/tmp/sg-clearance-ctx-v2.json';
const userDataDir = '/tmp/sg-bypass-userdata-v2';

const browser = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 800 },
  locale: 'en-US',
  timezoneId: 'America/Toronto',
  args: [
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
  ],
});

await browser.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  window.chrome = { runtime: {} };
});

const page = await browser.newPage();

// Warmup at homepage with extended JS challenge wait
console.error('warmup:homepage');
const warm = await page.goto('https://reyco.glvmarketing.ca/', { waitUntil: 'domcontentloaded', timeout: 60000 });
console.error(`warmup_status:${warm ? warm.status() : 'null'} ${page.url()}`);

// Wait for sgcaptcha clearance — JS challenge can take 5-15s
let attempts = 0;
while (attempts < 6) {
  await page.waitForTimeout(5000);
  attempts++;
  const t = await page.title();
  console.error(`wait_${attempts}:title="${t}" url=${page.url()}`);
  if (!t.toLowerCase().includes('robot') && !t.toLowerCase().includes('challenge') && !page.url().includes('sgcaptcha')) break;
}

// Now navigate to target
console.error(`target:${url}`);
const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
const status = resp ? resp.status() : 0;
const finalUrl = page.url();
const title = await page.title().catch(() => '');
const html = await page.content();

console.log(JSON.stringify({ status, finalUrl, title, htmlBytes: html.length }));
const slug = url.replace(/^https?:\/\/[^/]+/, '').replace(/[^a-z0-9]/gi, '_').slice(0, 80) || 'home';
fs.writeFileSync(`/tmp/page-${slug}-v2.html`, html);
console.error(`html_saved:/tmp/page-${slug}-v2.html`);

// Save screenshot
await page.screenshot({ path: `/tmp/page-${slug}-v2.png`, fullPage: true });
console.error(`screenshot:/tmp/page-${slug}-v2.png`);

await browser.close();
