import { chromium } from 'playwright';

const url = process.argv[2] || 'https://glvmarketing.ca';
const out = process.argv[3] || 'screenshots/smoke.png';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const start = Date.now();
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: out, fullPage: true });
const elapsed = Date.now() - start;

const title = await page.title();
console.log(JSON.stringify({ url, title, out, ms: elapsed }));

await browser.close();
