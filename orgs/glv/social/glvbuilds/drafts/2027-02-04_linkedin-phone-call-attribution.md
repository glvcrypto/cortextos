# Draft — Feb 4, 2027

**Platform:** LinkedIn + Instagram (static)
**Content type:** LinkedIn text post + IG static
**CTA:** open comment

---

## LinkedIn Post

Every client I work with wants to know if Google is sending them calls.

Most of them are tracking this with one number — GBP Insights call count — and nothing else.

One number isn't enough. GBP Insights counts calls made directly from the listing. It doesn't capture someone who found you on Google, loaded your website, and then called the number on the contact page. That's a different touchpoint, still from the same search.

**The three-layer call attribution system I use:**

**Layer 1: GBP Insights call count.**
GBP Manager → Performance → Calls. Monthly count of calls made directly from the map listing. This is your baseline for local pack visibility translating into phone contact. The trend matters more than the absolute number — up or down month over month.

**Layer 2: GA4 phone click events.**
If the website has a `tel:` click-to-call link (it should), GA4 tracks every tap on that number as an event. Go to GA4 → Reports → Engagement → Events, look for a `phone_call` or `click` event on the tel: link. Filter by source/medium to isolate google/organic. This captures the searcher who went to the website before calling.

**Layer 3: Ask new callers directly.**
"How did you find us?" — one question on intake. Most businesses don't ask it. The clients I've worked with who ask consistently are often surprised by how many new callers say Google, even before tracking shows it clearly.

Three sources, thirty minutes to set up. Together they give you a real picture of whether local SEO is driving phone contact — not just impressions.

---

## Instagram Static Graphic

**Suggested graphic text:**
"Where are your calls coming from?
3 places to check:
1. GBP Insights → Calls
2. GA4 phone_call event (tel: link taps)
3. Ask new callers directly"

---

## Instagram Caption

Most clients I work with track GBP Insights call count and stop there.

It misses calls that came through the website after a Google search — a different touchpoint, same source.

Three-layer check:

1. GBP Insights → Performance → Calls — direct listing calls, month over month trend.

2. GA4 phone_call event — `tel:` link taps on the website, filtered by google/organic source.

3. Ask new callers "how did you find us?" — simple and surprisingly underused.

All three together, 30 minutes to set up. Then you have an actual answer.

---

*New angle: multi-source call attribution for client reporting. Distinct from Aug 24 (conversion tracking — four free Google numbers, broader scope) and Oct 19 (call tracking vs NAP consistency — technical DNI setup). This post is about the reporting workflow: three data sources combined to answer "is Google sending us calls?" Defensible language throughout — no fabricated stats. Open comment.*
