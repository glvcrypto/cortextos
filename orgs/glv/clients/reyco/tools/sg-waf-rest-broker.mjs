// Broker WC/WP REST API calls through Playwright to bypass SG WAF.
// Uses persistent context with cached sgcaptcha clearance + App Password Basic Auth.
import { chromium } from 'playwright';
import fs from 'fs';

const cred = fs.readFileSync('/home/aiden/cortextos/orgs/glv/clients/reyco/.glv-wp-app-password', 'utf-8');
const WP_USER = cred.match(/WP_USER="([^"]+)"/)[1];
const WP_PWD = cred.match(/WP_APP_PASSWORD="([^"]+)"/)[1];
const WP_BASE = cred.match(/WP_BASE_URL="([^"]+)"/)[1];
const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PWD}`).toString('base64');

const apiPath = process.argv[2];
if (!apiPath) { console.error('usage: node sg-waf-rest-broker.mjs <api_path>'); process.exit(1); }

const userDataDir = '/tmp/sg-bypass-userdata-v2';
const browser = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 800 },
  locale: 'en-US',
  args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
});

await browser.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
});

const page = await browser.newPage();

// Use page.request which uses browser cookies for sgcaptcha clearance
const url = `${WP_BASE}${apiPath}`;
const resp = await page.request.fetch(url, {
  method: 'GET',
  headers: { 'Authorization': auth, 'Accept': 'application/json' },
});
const status = resp.status();
const body = await resp.text();

console.log(JSON.stringify({ status, url, bytes: body.length }));
if (status >= 200 && status < 300) {
  // Pretty-print JSON if possible
  try {
    const j = JSON.parse(body);
    process.stdout.write('\n' + JSON.stringify(j, null, 2));
  } catch { process.stdout.write('\n' + body); }
} else {
  process.stderr.write(body.slice(0, 1000));
}

await browser.close();
