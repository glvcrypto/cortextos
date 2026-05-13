# glvmarketing.ca Technical SEO Audit — May 12, 2026

**Method:** Manual crawl (WebFetch) — robots.txt, sitemap, 10 key pages
**Pages checked:** Homepage, About, Blog, Contact, Services, /services/geo/, /services/local-seo/, 3 case studies, sitemap index + sub-sitemaps

---

## Top 10 Issues

### #1 — Site-wide missing meta descriptions
**Severity:** Error
**What it is:** Every page checked — homepage, about, blog, contact, all service pages, all case studies — has no custom meta description. Google writes its own, which is usually a clipped sentence and underperforms a handwritten one for click-through rate.
**Who fixes:** Aiden (WP Admin > Rank Math/Yoast, page by page — or batch via CSV import)
**ETA:** 2–4 hours for priority pages (homepage, services, contact, case studies)

---

### #2 — No canonical tags detected (site-wide)
**Severity:** Error
**What it is:** No `<link rel="canonical">` tags visible on any page. Without them, Google guesses which URL is the "real" one. This matters especially when paginated blog pages, URL parameters, or multiple paths could point at the same content.
**Who fixes:** Dev (should be auto-inserted by Rank Math/Yoast if the SEO plugin is active and configured — check plugin settings first before Dev touch)
**ETA:** 30 min (plugin config check by Aiden; Dev only if plugin is absent)

---

### #3 — WordPress user sitemap exposes admin username
**Severity:** Error (security + SEO)
**What it is:** `https://glvmarketing.ca/wp-sitemap-users-1.xml` is publicly indexed and exposes the WordPress username "glv". This lets anyone enumerate the login username (then only the password stands between them and the WP admin). The `/author/glv/` author archive page is also indexed in search.
**Who fixes:** Dev — disable user sitemap in WP sitemap settings (or via SEO plugin), add `Disallow: /author/` to robots.txt, noindex the author archive
**ETA:** 30 min

---

### #4 — 12 new service pages published today with no meta descriptions
**Severity:** Error (urgent)
**What it is:** 12 pages were created or updated today (May 12) per sitemap lastmod timestamps — including /services/local-seo/, /services/geo/, /services/google-business-profile/, /services/ai-automation/, and 7 automation/AI sub-pages. All are missing meta descriptions and canonicals. Googlebot will index them in their current bare state within 1–7 days.
**Who fixes:** Aiden — add meta descriptions today before Googlebot's next crawl
**ETA:** Tonight / first thing Wed May 13

---

### #5 — No LocalBusiness schema on Contact page
**Severity:** Warning
**What it is:** The Contact page has name, phone, email, hours, and location but no structured data (JSON-LD schema) telling Google what this business is. Without it, Google can't generate Knowledge Panel or rich result signals from the Contact page. Task #13 (LocalBusiness schema) was delivered as a dev spec — unclear if it was deployed.
**Who fixes:** Dev — verify task #13 schema was deployed; if not, deploy
**ETA:** 1 hour (if spec is staged, dev just needs to push)

---

### #6 — Blog page has weak H1 and no meta description
**Severity:** Warning
**What it is:** `/blog/` H1 is literally "Blog" — misses the keyword opportunity ("Digital Marketing Blog for Canadian Businesses" or similar). Also no meta description.
**Who fixes:** Aiden (WP Admin — edit page title/SEO fields)
**ETA:** 10 min

---

### #7 — Duplicate navigation in HTML (homepage)
**Severity:** Warning
**What it is:** The navigation menu appears twice in the HTML source. Wastes crawl budget on duplicate anchor links and could confuse crawlers about internal link equity. Usually a theme/template bug.
**Who fixes:** Dev — remove duplicate nav render from theme template
**ETA:** 1–2 hours

---

### #8 — Missing alt text on logo / key images
**Severity:** Warning
**What it is:** Logo images and client logo images on the homepage lack alt text. Google can't read images without alt text, so these contribute nothing to topical relevance signals and fail basic accessibility requirements.
**Who fixes:** Aiden (WP Media Library — add alt text to logos) or Dev (hardcode in theme)
**ETA:** 30 min

---

### #9 — Titan Tiny Homes case study has no metrics in Results section
**Severity:** Warning
**What it is:** The Titan case study reads well but has no quantifiable results — no traffic numbers, no ranking improvements, no lead volume. For a marketing agency, case studies without data are weak conversion assets and thin content from Google's perspective.
**Who fixes:** Aiden (get metrics from client; add GSC data, lead count, or ranking before/after)
**ETA:** When Titan data is available

---

### #10 — "2 Clients Served" stat on homepage
**Severity:** Notice
**What it is:** Homepage displays "2 Clients Served" as a featured stat. With Reyco live, Titan, and Fusion as active clients, this appears under-reported and may undermine credibility with prospects. Inaccurate social proof is worse than no social proof.
**Who fixes:** Aiden (WP Admin — update stat to current accurate count)
**ETA:** 10 min

---

## Quick-Win Summary

| Priority | Issue | Owner | Time |
|---|---|---|---|
| Do today | Meta descriptions on 12 new May 12 pages | Aiden | 2h |
| Do today | Update "2 Clients Served" stat | Aiden | 10min |
| This week | Meta descriptions site-wide (all pages) | Aiden | 4h |
| This week | Canonical tags — check SEO plugin config | Aiden → Dev | 30min |
| This week | Disable user sitemap + noindex author archive | Dev | 30min |
| This week | Blog H1 + meta | Aiden | 10min |
| This week | Verify LocalBusiness schema deployed | Dev | 1h |
| This week | Fix duplicate nav | Dev | 2h |
| This week | Add alt text to logos | Aiden | 30min |
| When data available | Titan case study metrics | Aiden | TBD |

