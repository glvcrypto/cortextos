# New Lead Email Sequence - GLV Marketing

5-email welcome/nurture sequence for new leads (contact form submission or audit request).

**Sender:** Aiden Glave <info@glvmarketing.ca>
**Platform:** Resend (or n8n automation trigger)

---

## Email 1: Welcome + Confirmation

**Send timing:** Immediate (within 5 minutes of form submission)
**Goal:** Confirm receipt, set expectations, establish a human connection right away.

**Subject:** Got your message. Here's what happens next.
**Preview text:** You'll hear from me personally within 24 hours.

**Body:**

Hey [First Name],

Thanks for reaching out. I got your message and wanted to confirm it didn't disappear into the void.

I'm Aiden, the founder of GLV Marketing here in Sault Ste. Marie. I personally review every inquiry that comes in.

Here's what to expect:
- I'll review what you sent and do some initial research on your business
- You'll hear back from me within 24 hours (usually faster) with some initial thoughts
- No pressure, no hard sell. Just a straight conversation about what's working and what's not

If you need something sooner, call me directly at 705-975-0579 or reply to this email.

Talk soon,

Aiden Glave
Founder, GLV Marketing
glvmarketing.ca | 705-975-0579

---

## Email 2: Value Email (Free Tip)

**Send timing:** Day 3 (if no response/booking yet)
**Goal:** Deliver genuine value with zero ask. Build trust by proving competence before they pay a cent.

**Subject:** Quick win for your online presence
**Preview text:** This takes 10 minutes and most Northern Ontario businesses skip it.

**Body:**

Hey [First Name],

While I was looking into your business, I wanted to share something that helps nearly every local business in Northern Ontario.

**Check your Google Business Profile this week.**

Specifically:
- Make sure your hours are accurate (holiday hours too)
- Add 3-5 recent photos of your actual business, team, or work
- Write a business description that includes your city name and what you do
- Respond to every Google review, good or bad, within 48 hours

This is free, takes about 10 minutes, and it directly affects whether you show up in "near me" searches. Most businesses in the Sault set it up once and never touch it again. That's a missed opportunity.

If you want, I can take a quick look at yours and point out anything specific. No charge, no strings.

Aiden Glave
Founder, GLV Marketing
glvmarketing.ca | 705-975-0579

---

## Email 3: Social Proof (Case Study)

**Send timing:** Day 7
**Goal:** Show real results from real local work. Make the value tangible.

**Subject:** What we did for a local business in 30 days
**Preview text:** Real results from a real Northern Ontario company.

**Body:**

Hey [First Name],

I wanted to share a quick example of what this work actually looks like in practice.

We recently worked with a local Northern Ontario service business that had a website but wasn't getting any leads from it. Their site wasn't showing up in search results, their Google Business Profile was half-filled-out, and they had no system for capturing leads.

Within the first 30 days, we:
- Rebuilt their site so it actually loads fast and ranks
- Fixed their local SEO foundation (citations, schema markup, GBP optimization)
- Set up lead capture that routes inquiries straight to their inbox
- Got their pages indexed and climbing in Google

The difference between "having a website" and "having a website that works for you" is usually a handful of technical fixes and a real strategy behind the content.

That's the kind of work we do at GLV. Nothing flashy. Just the stuff that actually moves the needle for local businesses.

Aiden Glave
Founder, GLV Marketing
glvmarketing.ca | 705-975-0579

---

## Email 4: Address Objections

**Send timing:** Day 12
**Goal:** Tackle the real reasons people hesitate to hire an agency. Be honest about it.

**Subject:** "I'm not sure I need an agency."
**Preview text:** You might not. Here's how to know.

**Body:**

Hey [First Name],

Most business owners I talk to in the Sault have the same concerns about working with a marketing agency. I get it. Let me address them directly.

**"I can't afford it right now."**
Most local businesses lose more money from a broken online presence than they'd spend fixing it. We work with businesses at different stages and budgets. A conversation costs nothing.

**"I've been burned before."**
So have a lot of our clients. The difference is we're local, you know where to find me, and everything we do is measurable. No vague reports. You'll see exactly what changed and why.

**"I can do it myself."**
You probably can handle some of it. But between running your business, managing staff, and serving customers, marketing usually falls to the bottom of the list. We pick it up so you don't have to.

**"Does digital marketing even work for local businesses?"**
When people in Sault Ste. Marie search for what you do, you either show up or your competitor does. That's the entire game.

If any of this sounds familiar, I'm happy to chat. No pitch deck, just a straight conversation.

Aiden Glave
Founder, GLV Marketing
glvmarketing.ca | 705-975-0579

---

## Email 5: Soft CTA (Book a Call)

**Send timing:** Day 18
**Goal:** Create a clear next step. Light urgency without being pushy.

**Subject:** Still thinking it over?
**Preview text:** Happy to chat whenever you're ready. Or not. No hard feelings.

**Body:**

Hey [First Name],

I've sent a few emails your way and I want to be respectful of your time, so this will be the last one unless you want to keep the conversation going.

Here's where things stand on my end: I take on a limited number of clients at a time because I deliver the work personally. I'm not a big agency with 50 accounts and a junior running yours. When we work together, you get me.

If your online presence is something you want to sort out this quarter, I'd suggest we have a quick call. 15 minutes, no commitment. I'll tell you what I'd focus on if I were in your shoes, and you can decide if it makes sense to work together.

**Book a call:** Reply to this email or call 705-975-0579
**Browse our work:** glvmarketing.ca

Either way, I appreciate you taking the time to check us out. If the timing isn't right now, no hard feelings. You know where to find me.

Aiden Glave
Founder, GLV Marketing
info@glvmarketing.ca | 705-975-0579

---

## Implementation Notes

- **Trigger:** Contact form submission or audit request (Supabase insert -> n8n webhook)
- **Exit condition:** Lead replies to any email OR books a call (remove from sequence)
- **Tracking:** Tag each email in sequence for open/click tracking
- **Personalization:** Use first name from form submission. If business name available, reference it in Email 2.
- **Follow-up:** If lead completes full sequence with no response, add to monthly newsletter list (if/when created). Do not re-send the sequence.
