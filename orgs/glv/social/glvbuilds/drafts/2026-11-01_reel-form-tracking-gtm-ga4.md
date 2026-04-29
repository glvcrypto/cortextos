# @glvbuilds — Reel

**Date:** 2026-11-01
**Platform(s):** LinkedIn, Instagram
**Content type:** Reel (~35s)
**CTA:** Comment FORMS — I'll DM you the GTM form tracking setup guide (manual DM)

---

## Script

**[Hook — on screen + voiceover]**
"A client had been running local SEO for six months. They had no idea if their contact form was generating leads. One GTM tag — and now they know exactly how many form submissions came from organic Google every month."

**[Step 1]**
"In Google Tag Manager, create a trigger: Trigger Type = Form Submission. Set it to fire on All Forms, or add a filter on form ID if you have multiple forms."

**[Step 2]**
"Create a GA4 Event tag linked to that trigger. Event name: form_submit — or whatever name you want to see in GA4."

**[Step 3]**
"In GA4, go to Configure → Events → Mark it as a conversion. Now it shows up in your Conversions report."

**[Step 4]**
"Filter by Source / Medium in GA4 to see how many of those form conversions came from organic search. That's your SEO ROI number."

**[CTA]**
"Comment FORMS and I'll send you the step-by-step GTM setup guide — tag config, trigger settings, and the GA4 conversion mark."

---

## Production notes

- Screen recording workflow: GTM UI (trigger creation → tag creation) → GA4 (mark as conversion → Conversions report → Source/Medium breakdown)
- Blur any real client data in the screen recordings — use a test GTM container or a demo property
- On-screen text overlays: one bullet per step, keep it tight
- Under 35 seconds — each step is one sentence; cut between screens efficiently

---

## LinkedIn caption

Most local SEO clients I take on have GA4 set up. Almost none of them are tracking form submissions as conversions.

They can see their organic traffic going up — but they can't connect the traffic to actual leads. The contact form is a black box.

This is a 20-minute fix with Google Tag Manager.

**Step 1 — GTM trigger:**

In your GTM container, create a new trigger. Trigger Type: Form Submission. Fire on: All Forms (or add a CSS selector filter for a specific form ID if you have multiple forms on your site).

**Step 2 — GA4 event tag:**

Create a GA4 Event tag and link it to the form submission trigger. Event name: `form_submit` (or whatever you want to see in GA4). Add event parameters if you want to track which form or which page it came from — `form_id` and `page_location` are the useful ones.

**Step 3 — Mark as conversion in GA4:**

In GA4: Configure → Events → find `form_submit` → toggle "Mark as conversion." It takes up to 24 hours to appear in the Conversions report after the first event fires.

**Step 4 — Attribute to organic search:**

In GA4: Reports → Acquisition → Traffic acquisition → filter by Session source / medium → look for `google / organic`. That's how many form submissions came from local SEO in any given period.

**What this unlocks:**

When a client asks "is the SEO working?" you can now answer with: "Organic search sent 34 form submissions last month, up from 18 the month before." That's a different conversation than "your traffic is up 12%."

Comment FORMS and I'll send you the full GTM setup guide — tag config, trigger settings, conversion mark, and the GA4 filter path.

---

## IG caption

Tracking organic traffic is easy. Tracking whether that traffic fills out your contact form is where most local businesses stop.

GTM + GA4 fix in 20 minutes:

1. GTM: Create a Form Submission trigger (All Forms or filter by form ID)
2. GTM: Create a GA4 Event tag — event name: form_submit — link to the trigger
3. GA4: Configure → Events → mark form_submit as a conversion
4. GA4: Traffic acquisition report → filter google / organic → see form conversions from SEO

Now when a client asks "is it working?" — you have a lead number, not just a traffic number.

Comment FORMS for the setup guide.

#LocalSEO #GoogleTagManager #GA4 #ConversionTracking #LocalMarketing
