import React from "react";
import { Composition } from "remotion";
import { Carousel } from "./Carousel";
import { GBPCarousel } from "./GBPCarousel";
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
