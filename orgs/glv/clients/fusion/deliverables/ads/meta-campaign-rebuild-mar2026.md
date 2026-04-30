# Fusion Financial — Meta Campaign Rebuild Plan
## March 2026 (Tax Season Push)

**Prepared:** 2026-03-01 (overnight)
**Urgency:** HIGH — Tax season is Jan-Apr. Campaign has been dark since Feb 23. Every week offline during this window is irreplaceable lost leads.
**For:** Aiden to execute + present to JB for budget approval

---

## What Happened

The Meta campaign launched Feb 20 with 11 ads, ~$17.56/day budget. Meta's algorithm picked SSM Day and Envelope as winners, the other 9 got almost nothing. By Feb 23, Paid Social sessions dropped to zero in GA4 and stayed there through Feb 28 — five consecutive dark days during the highest-converting window of the tax year.

The campaign was not a creative failure. The creative concepts (SSM Day, Envelope, Checklist) are solid. The failure was structural: too many ads for the budget, and either the budget depleted or the campaign was manually paused without resuming.

---

## The Fix: Three-Phase Plan

### Phase 1: Relaunch (Do This Week — March 2-3)

**Step 1: Pause these 8 ads immediately**

In Meta Ads Manager, set each of these to "Paused" (do NOT delete — keep data):
- CRA vs Monthly
- Before and After
- SSM Night
- HST w/o Headache
- Personal Tax Done Right
- Find Deductions
- Tax Season w/o Panic
- April30thCloser

These 8 ads spent a combined $14.76 over 5 days and generated zero leads. The budget they were consuming is better concentrated on the 3 that worked.

**Step 2: Keep these 3 ads active**

| Ad | Why Keep It |
|----|-------------|
| **SSM Day** | Generated the only lead. Highest spend ($44.43). Has a Quality Ranking. This is the campaign's best performer. |
| **Envelope** | Second highest spend ($28.62). 1,502 impressions. Meta is giving it real delivery — it deserves more runway at proper budget. |
| **Checklist** | Third highest delivery (238 impressions, $5.87). A lead-magnet angle (checklist resource) is a different hook than the others. Worth testing at scale. |

**Step 3: Restructure into 2 ad sets**

Instead of all 3 ads in one pool, split them:

- **Ad Set A — Tax Season (Higher Intent):** SSM Day + Envelope
  - Audience: Sault Ste. Marie area, 28-55, general interest targeting or broad
  - These hit people actively thinking about taxes now

- **Ad Set B — Ongoing Services (Awareness):** Checklist only
  - Audience: Slightly broader — people who might not be actively searching but would respond to a useful resource
  - If Checklist underperforms in 10 days, pause it and add budget to Ad Set A

**Step 4: Set budget to $50/day**

This is what was planned from the start. The original plan called for $50-75/day.

At $50/day split:
- Ad Set A: $35/day ($17.50 per ad)
- Ad Set B: $15/day (Checklist only)

Each ad now gets $15-17/day — enough for Meta's algorithm to learn within 7 days. At the previous $17.56/day total, the algorithm could never exit the learning phase.

**Call script for JB (before you touch the campaign):**

> "Hey JB — wanted to touch base on the Meta campaign. The ads went dark for about five days, which is a problem because we are right in the middle of tax season. The good news is I know exactly what to fix. We had too many ads for the budget — the algorithm picked two winners and ignored the rest. I want to cut it down to 3 ads and bring the budget up to $50/day, which is what we planned originally. That should have us generating 5-10 leads a week by the second week of March. Can you approve the budget increase so I can get this running by Monday?"

---

### Phase 2: Optimize (March 10-20)

Review performance after 7 days at the new structure.

**Metrics to check (March 10):**

| Metric | Target | Action if Missed |
|--------|--------|-----------------|
| Leads | 4-8 (total) | If under 4, check lead form load time and mobile UX |
| CPL | $37-75 | If over $75, assess whether SSM Day or Envelope is the drag |
| Impressions per ad | 1,500+ per week | If under, budget may need to increase |
| CTR | 1-3% | If under 1%, the creative or headline needs a refresh |

**If SSM Day is clearly winning:** Move Envelope budget to SSM Day. One dominant ad at $35-40/day outperforms two equal-budget ads during the learning phase.

**If Envelope starts generating leads:** Keep both. Look at which audience segments are responding and narrow targeting.

**If Checklist underperforms (under 1 lead by March 10):** Pause it. Move its $15/day to Ad Set A.

**The February 26 spike:** GA4 showed 139 Direct sessions in one day — likely an organic Facebook post by JB or Tony that got shared. Ask JB what was posted. If it was good content, it can be boosted as a paid post. Organic viral moments are the cheapest leads you will ever get.

---

### Phase 3: Retargeting (March 17+)

Once the core campaign has 10-14 days of data, layer in retargeting.

**Custom audiences to build:**

1. **Website visitors (last 30 days):** Anyone who visited fusionfinancialssm.com. These people know who Fusion Financial is. A retargeting ad for them should be much softer — not "Get a Quote," more like "Questions? We Handle CRA So You Don't Have To."

2. **Video viewers (if any video ads are running):** People who watched 50%+ of a video. Strong intent signal.

3. **Lead form openers who did not submit:** People who opened the form but bounced. An ad with a simpler ask (one-click call-to-action or a reduced-field form) can recover these.

**Retargeting budget:** Start at $10-15/day. Retargeting audiences are small in a market the size of Sault Ste. Marie. You do not need much budget to reach them all.

**Retargeting creative:** Do NOT run the same ads as the cold campaign. Use a different message. Something like:
- "Still thinking about getting your books sorted? We're local, we're fast, and tax season doesn't wait."
- "You visited our site — let's talk. [Call Now]"

---

## Lead Form Audit (Do This Before Relaunching)

Before touching the budget, spend 5 minutes checking the lead form:

**On mobile (use your phone):**
1. Click on one of the active Meta ads from your phone
2. Does the lead form load within 2 seconds?
3. How many fields does it ask for? (Target: 3 or fewer — Name, Phone, Email)
4. Is the confirmation message clear after submitting?
5. Does the phone number field trigger a number keyboard (not letter keyboard)?

**Check Meta Events Manager:**
- Is the Lead event firing when the form is submitted?
- Is there a separate ViewContent event for the landing page?
- Are events deduplicating correctly between the pixel and the conversions API?

If the form has more than 3 fields, simplify it. Every additional field costs you roughly 10% of leads.

---

## 30-Day Projection (After Fixes)

| Period | Expected Leads | CPL Target | Cumulative Spend |
|--------|---------------|------------|-----------------|
| March 2-8 (Week 1) | 3-6 | $60-80 (still learning) | ~$350 |
| March 9-15 (Week 2) | 6-10 | $40-60 (optimizing) | ~$700 |
| March 16-22 (Week 3) | 8-14 | $35-55 (optimized) | ~$1,050 |
| March 23-31 (Week 4+) | 10-16 | $30-50 (scaling) | ~$1,450 |
| **Total** | **27-46 leads** | **~$31-54 avg CPL** | **~$1,500** |

Compare to current trajectory (doing nothing): ~3-5 leads, $527 spend, CPL $105-175.

**Tax season context:** April 30 is the personal tax filing deadline in Canada. The period March 1-April 15 is the highest-intent window for CRA-adjacent services. After April 30, leads drop sharply. The campaign needs to be at full speed by March 10 to capture this window.

---

## Summary: What to Do Monday

1. **Call JB** — Get verbal approval to increase to $50/day before touching anything
2. **Audit the lead form** — mobile UX check, field count, pixel verification
3. **Pause 8 ads** — keep SSM Day, Envelope, Checklist
4. **Restructure into 2 ad sets** — Tax Season ($35/day) + Awareness ($15/day)
5. **Set budget to $50/day** — once JB approves
6. **Set a March 10 review** — calendar it now

---

*Prepared overnight 2026-03-01 by GLV Marketing AI.*
*Based on: meta-campaign-analysis-feb26.md + Feb 28 chino audit (Fusion Financial).*
