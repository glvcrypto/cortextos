# 2027-03-31 — LinkedIn Text Post + IG Static
**Topic:** Reading the GSC Core Web Vitals report for local service pages
**CTA:** Open comment (no automation)

---

## LinkedIn Post

GSC has a report most local business owners have never opened.

It's not in the Performance tab. It's under Experience → Core Web Vitals.

I check it before any page optimisation work. Here's what I look for.

---

**What the report shows**

Two tabs: Mobile and Desktop. Mobile is the one that matters for local search — most "near me" and service-area queries come from phones.

Three status bands per page: Good, Needs Improvement, Poor.

The report groups pages by issue type, not by page. Click an issue and it shows you every affected URL. Click a URL and it opens PageSpeed Insights with that specific page pre-loaded.

That's the entire workflow: issue → affected URLs → PageSpeed → fix.

---

**What I find on most local service sites**

LCP (Largest Contentful Paint) failures are the most common. The culprit is almost always the hero image — oversized, not compressed, no width/height attributes set in the HTML. PageSpeed flags it; Squoosh.app fixes it for free.

INP (Interaction to Next Paint) failures show up on contact pages with heavy third-party form scripts. The form works fine — it just takes long enough to respond to a tap that Google counts it as slow.

CLS (Cumulative Layout Shift) failures usually mean images without explicit dimensions. The page reflows when images load. Fix: add width and height attributes to every image tag.

---

**Why this matters before page optimisation**

If you're about to rewrite a service page and it has a Poor LCP rating, the ranking you're optimising for is already penalised by page experience signals.

Fix the technical problem first. Then optimise the content.

The report takes 90 seconds to check. Most people skip it entirely.

---

**Where to start**

GSC → Experience → Core Web Vitals → Mobile tab.

Sort by status. Fix Poor pages first.

If you have no Poor pages, check Needs Improvement. That's where most local service sites live.

---

## IG Static — Graphic Text Concept

**Headline:**
"GSC has a page experience report most local businesses never open."

**Body:**
Experience → Core Web Vitals → Mobile tab.
Poor = fix before optimising content.
Needs Improvement = next.
Good = protect it.

**Caption:**
The GSC Core Web Vitals report shows you which pages are failing Google's page experience thresholds — grouped by issue type, with affected URLs listed per issue.

Most local service sites have LCP failures on hero images. Fix: compress the image, add width/height attributes, check PageSpeed Insights Mobile tab for specifics.

Check this before rewriting any page you're trying to move up in search. A Poor rating on page experience is working against you regardless of how good the content is.

90 seconds. GSC → Experience → Core Web Vitals → Mobile tab.
