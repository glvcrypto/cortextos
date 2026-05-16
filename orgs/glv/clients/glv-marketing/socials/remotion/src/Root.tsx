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
