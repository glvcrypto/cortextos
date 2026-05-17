import React from "react";
import { Composition } from "remotion";
import { Carousel } from "./Carousel";
import { GBPCarousel } from "./GBPCarousel";
import { GLVCarousel } from "./GLVCarousel";
import { ReelComposition, ReelProps } from "./reel/ReelComposition";
import { brand } from "./brand";
import { brandGLV } from "./brand-glvbuilds";
import { CarouselProps, SlideData } from "./types";

// ── Sample carousel: "5 reasons your business is invisible online" ──────────
const sampleSlides: SlideData[] = [
  {
    type: "hook",
    tag: "GLV Marketing",
    headline: "5 Reasons Your Business Is Invisible Online",
    body: "Fix these and watch your leads grow.",
  },
  {
    type: "content",
    tag: "Reason #1",
    headline: "No Google Business Profile",
    body: "46% of all Google searches have local intent. If you haven't claimed your GBP listing, you're invisible to half your potential customers before they even reach your website.",
  },
  {
    type: "content",
    tag: "Reason #2",
    headline: "Your Website Loads Too Slowly",
    body: "53% of mobile users abandon a page that takes more than 3 seconds to load. Every extra second costs you customers — and Google rankings.",
  },
  {
    type: "content",
    tag: "Reason #3",
    headline: "You're Not Showing Up in AI Search",
    body: "ChatGPT, Gemini, and Perplexity are replacing Google for local business searches. Without Generative Engine Optimization (GEO), your business doesn't exist to these tools.",
  },
  {
    type: "cta",
    tag: "Free Consultation",
    headline: "Let's Fix It Together",
    body: "Book a free 30-minute audit. We'll show you exactly what's holding your business back.",
  },
];

const defaultProps: CarouselProps = {
  slides: sampleSlides,
  showLogo: true,
  showCounter: true,
  variant: "vertical",
};

const squareProps: CarouselProps = {
  ...defaultProps,
  variant: "square",
};

const totalFrames = sampleSlides.length * brand.slideDuration;

// ── GBP pre-audit carousel: "6 things I check before I touch a client's Google listing" ──
// Source: orgs/glv/social/glvbuilds/drafts/2026-05-15_carousel-gbp-pre-audit-6-checks.md
// Brand: canonical light theme (bg #FFFFFF / fg #000000 / accent #B22222) from brand-glvbuilds.ts
const gbpSlides: SlideData[] = [
  {
    type: "hook",
    tag: "@glv.marketing",
    headline: "6 things I check before I touch a client's Google listing",
    body: "10 minutes. Every new client. Every time.",
  },
  {
    type: "content",
    tag: "Check 1",
    headline: "Who is the Primary Owner?",
    body: "Previous agency? Old personal account?\nIf you don't control Primary Owner, you don't control the listing.",
  },
  {
    type: "content",
    tag: "Check 2",
    headline: "Is there a duplicate listing?",
    body: "Private browser. Search the business name.\nTwo profiles suppresses the primary one and confuses customers.",
  },
  {
    type: "content",
    tag: "Check 3",
    headline: "Is the profile verified, flagged, or suspended?",
    body: "GBP doesn't always send an email when there's a problem.\nCheck the status in GBP Manager before assuming the profile is active.",
  },
  {
    type: "content",
    tag: "Check 4",
    headline: "Screenshot everything before you change anything.",
    body: "Primary category, hours, description, photo count.\nFive minutes of documentation prevents weeks of confusion.",
  },
  {
    type: "content",
    tag: "Check 5",
    headline: "Check for pending user-suggested edits.",
    body: "Google lets anyone suggest changes to your listing.\nKnow what's in the queue before you start adding to it.",
  },
  {
    type: "cta",
    tag: "Check 6",
    headline: "NAP match: GBP, website footer, schema.",
    body: "Name, address, phone. All three must match exactly.\nComment CHECKLIST for the template",
  },
];

const gbpTotalFrames = gbpSlides.length * brandGLV.slideDuration;

export const RemotionRoot: React.FC = () => (
  <>
    {/* 1080×1350 portrait — IG/LI */}
    <Composition
      id="GLVCarousel"
      component={Carousel}
      durationInFrames={totalFrames}
      fps={brand.fps}
      width={brand.canvas.vertical.width}
      height={brand.canvas.vertical.height}
      defaultProps={defaultProps}
    />

    {/* 1080×1080 square — IG Feed / Threads / FB */}
    <Composition
      id="GLVCarouselSquare"
      component={Carousel}
      durationInFrames={totalFrames}
      fps={brand.fps}
      width={brand.canvas.square.width}
      height={brand.canvas.square.height}
      defaultProps={squareProps}
    />

    {/* 1080×1080 — @glvbuilds GBP pre-audit carousel */}
    <Composition
      id="GBPPreAudit"
      component={GBPCarousel}
      durationInFrames={gbpTotalFrames}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{ slides: gbpSlides }}
    />

    {/* 1080×1080 — First client story carousel */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-15_carousel-first-client-story.md */}
    <Composition
      id="FirstClientStory"
      component={GLVCarousel}
      durationInFrames={7 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          {
            type: "hook",
            tag: "@glv.marketing",
            headline: "What I told my first client when he asked why he wasn't showing up on Google",
            body: "The answer wasn't technical.",
          },
          {
            type: "content",
            headline: "He existed on Google. Just barely.",
            body: "Auto-generated profile. Wrong address. No hours. No photos.\nOne review from 2019.\nPrimary category set to the broad version.",
          },
          {
            type: "content",
            headline: "The root cause wasn't the website.",
            body: "The profile had never been claimed or verified. No activity signal.\nGoogle had no reason to surface him over a competitor with a complete, active profile.",
          },
          {
            type: "content",
            headline: "The first fix wasn't what he expected.",
            body: "I didn't touch the website first.\nClaimed the profile, corrected the address, set the right category, added photos, set hours.\nMap pack before organic.",
          },
          {
            type: "content",
            headline: "I was honest about the timeline.",
            body: "6 to 12 weeks before consistent improvement.\nDepends on reviews and local competition.\nNo page-one promises.",
          },
          {
            type: "content",
            headline: "The baseline lesson I learned from him.",
            body: "I didn't track call volume before we started.\nWhen calls increased, I couldn't prove by how much.\nNow I document the baseline on day one of every engagement.",
          },
          {
            type: "cta",
            headline: "What I tell every new client now.",
            body: "\"Before I look at your website, I need 20 minutes with your Google Business Profile.\nThat's where customers decide to call you or your competitor.\"\nDrop a comment if this matches what you found on your first audit. ↓",
          },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — GBP primary category carousel */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-15_carousel-gbp-primary-category.md */}
    <Composition
      id="GBPPrimaryCategory"
      component={GLVCarousel}
      durationInFrames={7 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          {
            type: "hook",
            tag: "@glv.marketing",
            headline: "The one Google Business Profile setting most businesses have wrong",
            body: "Set at signup. Never revisited. Quietly hurting local rankings.",
          },
          {
            type: "content",
            headline: "The setting: primary category.",
            body: "The highest-weight single field in GBP.\nGoogle uses it to decide which searches you're eligible to appear for.",
          },
          {
            type: "content",
            headline: "The mistake: choosing broad over specific.",
            body: "\"Contractor\" competes with roofers, painters, and landscapers.\n\"Plumbing Contractor\" competes with your actual competitors.",
          },
          {
            type: "content",
            headline: "The fix starts with competitor research.",
            body: "Private browser. Search your service + city.\nClick into the top 3 local pack results.\nWhat category are they using?",
          },
          {
            type: "content",
            headline: "Then check Google's full category list.",
            body: "Several hundred options. The specific category you need may exist.\n\"HVAC Contractor\" and \"Air Conditioning Contractor\" are different entries.",
          },
          {
            type: "content",
            headline: "The change takes 30 seconds.",
            body: "GBP Manager → Edit profile → Business information → Category.\nChange primary. Keep accurate secondaries.",
          },
          {
            type: "cta",
            headline: "Give it 30 days.",
            body: "Category changes take time to register.\nCheck map pack visibility before and after.\nPrivate browser or a rank grid tool.\nWhat's the biggest GBP mistake you've seen on a client audit? ↓",
          },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Rank #1 mindset carousel */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-15_carousel-rank-1-mindset.md */}
    <Composition
      id="Rank1Mindset"
      component={GLVCarousel}
      durationInFrames={7 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          {
            type: "hook",
            tag: "@glv.marketing",
            headline: "Why I stopped trying to rank #1 for my clients",
            body: "Broad rankings look good in reports.\nThese 6 shifts produce actual results.",
          },
          {
            type: "content",
            headline: "\"Rank #1\" means different things.",
            body: "Map pack, organic position one, broad keyword, specific phrase.\nThese are different systems.\nRanking in one doesn't guarantee the others.",
          },
          {
            type: "content",
            headline: "Broad keyword traffic doesn't equal qualified leads.",
            body: "I've seen clients on page one for a category term with zero calls.\nThe wrong traffic doesn't convert.",
          },
          {
            type: "content",
            headline: "Map pack beats organic position one for local intent.",
            body: "When someone searches on mobile with intent to act now, they call from the map pack.\nOrganic results are further down the screen.",
          },
          {
            type: "content",
            headline: "High-intent, specific searches convert better.",
            body: "\"Licensed electrician [city] weekend emergency\" converts at a different rate than \"electrician.\"\nTarget the phrase that matches buying intent.",
          },
          {
            type: "content",
            headline: "What I track instead.",
            body: "Map pack visibility + GBP calls + direction requests\n+ GSC service page clicks + form submissions.\nNot just rank position.",
          },
          {
            type: "cta",
            headline: "The question I ask every new client.",
            body: "\"When someone searches for what you do, what do you want to happen?\"\nThe answer is always \"I want them to call.\"\nThat's what I'm working toward.\nWhat do you track for local SEO success? Drop it in the comments ↓",
          },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Intro 1: Who Is GLV Marketing */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-16_carousel-intro-1-who-is-glv.md */}
    <Composition
      id="Intro1WhoIsGLV"
      component={GLVCarousel}
      durationInFrames={8 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          { type: "hook", tag: "@glv.marketing", headline: "I left a $6,000/month bank job to build this.", body: "This is GLV Marketing. Here's who we are, why we started, and what makes us different from every other agency in Northern Ontario." },
          { type: "content", headline: "I had a good job. I left anyway.", body: "I spent years at BNS pulling a stable salary. But I kept watching the same thing happen: small businesses spending real money on marketing that wasn't built to last. I knew I could build something better." },
          { type: "content", headline: "Most marketing is a treadmill.", body: "You pay, it runs. You stop paying, it stops. No foundation, no compounding, no lasting result. I wanted to build marketing that stacks over time, not resets every month." },
          { type: "content", headline: "GLV is a different kind of agency.", body: "Not a content mill. Not a freelancer piecing things together between clients. A focused operation built to deliver real marketing infrastructure for small and mid-size businesses." },
          { type: "content", headline: "Two founders. One direction.", body: "My partner Ben Pelta handles the technical build side of the operation. I handle strategy, SEO, and client relationships. Different skills, same standard." },
          { type: "content", headline: "Sault Ste. Marie built. Canada-wide capable.", body: "We're based in Sault Ste. Marie, Ontario. We work with businesses across Northern Ontario and take on clients from anywhere in Canada. Location has never been a barrier." },
          { type: "content", headline: "AI does the heavy lifting. We direct the outcome.", body: "Behind every deliverable at GLV is a fleet of specialized AI agents. They research, draft, audit, and flag. We review every output, direct every decision, and own every result." },
          { type: "cta", headline: "Follow to see how this actually works.", body: "We share the behind-the-scenes: what's working in local SEO, how we use AI in real client work, and what we're building as we grow. No filler. No fluff. Follow along." },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Intro 2: What GLV Marketing Does */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-16_carousel-intro-2-what-we-do.md */}
    <Composition
      id="Intro2WhatWeDo"
      component={GLVCarousel}
      durationInFrames={8 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          { type: "hook", tag: "@glv.marketing", headline: "We do six things. We do them in one place.", body: "Most small businesses patch together three or four vendors to cover their marketing. GLV handles it all with one strategy behind it." },
          { type: "content", headline: "We get you found when people search.", body: "Search engine optimization drives compounding traffic. We focus on Google Business Profile for local businesses and on-page SEO for service-area reach. This is where most of our clients see their biggest return." },
          { type: "content", headline: "Your website should work as hard as you do.", body: "We design and build on WordPress and Vite. Clean, fast, built for search. No bloated themes, no slow builders. A site that looks good and converts." },
          { type: "content", headline: "Your email list is the one thing you actually own.", body: "We set up and run email marketing for clients who want to stay in front of their customers between seasons. Newsletters, automations, and reactivation campaigns that bring people back." },
          { type: "content", headline: "Ads that pay for themselves.", body: "Meta and Google ads for businesses ready to accelerate. We build the campaigns, write the copy, and optimize based on what the data shows. We don't touch ad spend until the foundation is solid." },
          { type: "content", headline: "Want AI working inside your business?", body: "We set up Claude Code and AI workflows for small and mid-size businesses. If you've been curious about AI but don't know where to start, we show you how to use it for real work, not just demos." },
          { type: "content", headline: "AI that never leaves your building.", body: "For businesses in law, medicine, finance, or construction, cloud AI is a compliance risk. We deploy local AI systems that keep your data on your server. Built for Canadian regulated industries, PIPEDA-ready from day one." },
          { type: "cta", headline: "We work with businesses that have something to protect.", body: "Marine dealers, contractors, healthcare practices, financial services. If you're in a local or regulated industry and want marketing that compounds, send us a message." },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Intro 3: How We Work */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-16_carousel-intro-3-how-we-work.md */}
    <Composition
      id="Intro3HowWeWork"
      component={GLVCarousel}
      durationInFrames={8 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          { type: "hook", tag: "@glv.marketing", headline: "14 AI agents work on your account. Here's what that actually means.", body: "We're not hiding the AI. We're building with it, on purpose. Here's how it works and why it changes what's possible for small business marketing." },
          { type: "content", headline: "An AI agent is a specialist, not a chatbot.", body: "Each agent at GLV is trained for one job. One handles SEO content. One audits websites. One manages the research cycle. One tracks the calendar. They don't do everything. They do one thing well." },
          { type: "content", headline: "They pass the work between each other.", body: "When a new client comes in, the research agent goes first. The content agent drafts next. The audit agent flags issues before anything ships. Each one hands off to the next. The work compounds." },
          { type: "content", headline: "Faster turnaround. Same standard.", body: "A full site audit that used to take a week takes hours. Draft content that used to take a day is ready in an afternoon. The speed comes from the agents handling the volume. The quality comes from us reviewing every output before it leaves." },
          { type: "content", headline: "Lower overhead. Passed to you.", body: "We don't have a 12-person team billing hourly for research and first drafts. The agents handle the volume work. That keeps our costs lower and our pricing accessible to businesses that couldn't afford a full-service agency before." },
          { type: "content", headline: "Same quality on week 40 as on week 1.", body: "Agents don't have off days. They don't forget the brand voice or skip a checklist step. Every deliverable goes through the same process every time." },
          { type: "content", headline: "AI handles volume. We handle judgment.", body: "Every strategy call is us. Every client relationship is us. Every final approval before anything ships is us. The agents work. We think." },
          { type: "cta", headline: "If your business needs marketing that compounds, message us.", body: "We take a small number of clients at a time. If you want to know whether GLV is the right fit, start with a message." },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Intro 1 v2: Who Is GLV Marketing (BNS/Ben/AI-fleet removed) */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-16_carousel-intro-1-who-is-glv-v2.md */}
    <Composition
      id="Intro1WhoIsGLVv2"
      component={GLVCarousel}
      durationInFrames={8 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          { type: "hook", tag: "@glv.marketing", headline: "I walked away from a stable career to build this.", body: "This is GLV Marketing. Here's who we are, why we started, and what makes us different from every other agency in Northern Ontario." },
          { type: "content", headline: "I had stability. I left anyway.", body: "I spent years in corporate pulling a steady income. But I kept watching the same thing happen: small businesses spending real money on marketing that wasn't built to last. I knew I could build something better." },
          { type: "content", headline: "Most marketing is a treadmill.", body: "You pay, it runs. You stop paying, it stops. No foundation, no compounding, no lasting result. I wanted to build marketing that stacks over time, not resets every month." },
          { type: "content", headline: "GLV is a different kind of agency.", body: "Not a content mill. Not a freelancer piecing things together between clients. A focused operation built to deliver real marketing infrastructure for small and mid-size businesses." },
          { type: "content", headline: "We're built for the long game.", body: "Most agencies sell you a month-to-month relationship. We build systems that compound. The longer you work with us, the more your marketing does. That's the model." },
          { type: "content", headline: "Sault Ste. Marie built. Canada-wide capable.", body: "We're based in Sault Ste. Marie, Ontario. We work with businesses across Northern Ontario and take on clients from anywhere in Canada. Location has never been a barrier." },
          { type: "content", headline: "We run a tight process. The results compound.", body: "Every client goes through the same research cycle, strategy build, and ongoing execution review. That structure is what makes the results stack week over week, instead of starting over every month." },
          { type: "cta", headline: "Follow to see how this actually works.", body: "We share the behind-the-scenes: what's working in local SEO, how we approach real client work, and what we're building as we grow. No filler. No fluff. Follow along." },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Intro 3 v2: How We Work (process-forward, AI-fleet removed) */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-16_carousel-intro-3-how-we-work-v2.md */}
    <Composition
      id="Intro3HowWeWorkv2"
      component={GLVCarousel}
      durationInFrames={8 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          { type: "hook", tag: "@glv.marketing", headline: "Here's exactly how we work on your account. Step by step.", body: "We don't bill by the hour and guess as we go. Every GLV client goes through the same structured process. Here's what that looks like and why it works." },
          { type: "content", headline: "We start by researching your market.", body: "Before we write a word or build a page, we learn your competitive landscape, your target search terms, and where your customers are looking. That research drives every decision that follows." },
          { type: "content", headline: "Then we build the foundation.", body: "Website, content plan, SEO structure, local presence. We put the pieces in place in the right order. A strong foundation is what makes the next steps compound instead of reset." },
          { type: "content", headline: "Then we execute. Consistently.", body: "Content goes out on schedule. SEO work gets done weekly. Ads get monitored and adjusted. No gaps, no off weeks. Consistent execution is what separates marketing that compounds from marketing that coasts." },
          { type: "content", headline: "We review everything before it goes out.", body: "Every deliverable goes through a review step before it reaches your audience. Strategy calls, content sign-offs, campaign reports. Nothing ships without a check." },
          { type: "content", headline: "The work stacks over time.", body: "Month one builds the foundation. Month three, you start ranking. Month six, you're getting leads you didn't have before. This is what marketing looks like when it compounds instead of resets." },
          { type: "content", headline: "You get one team. One strategy. One direction.", body: "We handle the research, the planning, the execution, and the reporting. No juggling three agencies or briefing four different people. One relationship, one standard, consistent across everything." },
          { type: "cta", headline: "If your business needs marketing that compounds, message us.", body: "We take a small number of clients at a time. If you want to know whether GLV is the right fit, start with a message." },
        ] as SlideData[],
      }}
    />

    {/* 1080×1080 — Intro 1 v3: Who Is GLV Marketing (career-pivot framing removed) */}
    {/* Source: orgs/glv/social/glvbuilds/drafts/2026-05-17_carousel-intro-1-who-is-glv-v3.md */}
    <Composition
      id="Intro1WhoIsGLVv3"
      component={GLVCarousel}
      durationInFrames={8 * brandGLV.slideDuration}
      fps={brandGLV.fps}
      width={brandGLV.canvas.width}
      height={brandGLV.canvas.height}
      defaultProps={{
        slides: [
          { type: "hook", tag: "@glv.marketing", headline: "Most local marketing resets the moment you stop paying. GLV is built differently.", body: "This is GLV Marketing. Here's why we exist, what we do, and what makes us different from every other agency in Northern Ontario." },
          { type: "content", headline: "GLV started because local businesses deserve marketing that lasts.", body: "Most agencies hand over a report and move on. No foundation. No compounding. Businesses pay month after month and when they stop, it all resets. We built GLV to fix that." },
          { type: "content", headline: "Most marketing is a treadmill.", body: "You pay, it runs. You stop paying, it stops. No foundation, no compounding, no lasting result. We wanted to build marketing that stacks over time, not resets every month." },
          { type: "content", headline: "GLV is a different kind of agency.", body: "Not a content mill. Not a freelancer piecing things together between clients. A focused operation built to deliver real marketing infrastructure for small and mid-size businesses." },
          { type: "content", headline: "We're built for the long game.", body: "Most agencies sell you a month-to-month relationship. We build systems that compound. The longer you work with us, the more your marketing does. That's the model." },
          { type: "content", headline: "Sault Ste. Marie built. Canada-wide capable.", body: "We're based in Sault Ste. Marie, Ontario. We work with businesses across Northern Ontario and take on clients from anywhere in Canada. Location has never been a barrier." },
          { type: "content", headline: "We run a tight process. The results compound.", body: "Every client goes through the same research cycle, strategy build, and ongoing execution review. That structure is what makes the results stack week over week, instead of starting over every month." },
          { type: "cta", headline: "Follow to see how this actually works.", body: "We share the behind-the-scenes: what's working in local SEO, how we approach real client work, and what we're building as we grow. No filler. No fluff. Follow along." },
        ] as SlideData[],
      }}
    />

    {/* 1080×1920 — @glv.marketing reel with captions + headline overlay */}
    {/* durationInFrames/videoPath set at render time via --props */}
    <Composition
      id="Reel"
      component={ReelComposition}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        videoPath: "",
        captions: [],
        headline: "",
        showBrandTag: true,
      } as ReelProps}
    />
  </>
);
