// Per-platform render variant registry for GLV social pipeline.
// Aiden directive 2026-05-18 21:14 UTC: visuals are platform-native, not one-size.
// Render-runner (dev side) maps `format` to actual remotion render flags.

import { SlideData } from "./types";

export type PlatformFormat =
  | "carousel-png"   // PNG sequence, multiple slides
  | "single-png"     // single PNG, one slide
  | "pdf-pages"      // PNG seq merged to PDF via dev pipeline
  | "video";         // remotion --codec h264 .mp4

export interface PlatformVariant {
  /** Suffix used in composition ID + output dir (e.g. "ig-portrait") */
  id: string;
  /** Human-readable label */
  label: string;
  width: number;
  height: number;
  format: PlatformFormat;
  /** Optional slide filter — defaults to all slides */
  slideFilter?: (slides: SlideData[]) => SlideData[];
}

const coverOnly = (s: SlideData[]) => s.slice(0, 1);
const firstFour = (s: SlideData[]) => s.slice(0, 4);

export const PLATFORM_VARIANTS: PlatformVariant[] = [
  { id: "ig-square",       label: "Instagram square (legacy)",   width: 1080, height: 1080, format: "carousel-png" },
  { id: "ig-portrait",     label: "Instagram portrait carousel", width: 1080, height: 1350, format: "carousel-png" },
  { id: "ig-reels",        label: "Instagram Reels (video)",     width: 1080, height: 1920, format: "video" },
  { id: "fb-square",       label: "Facebook square carousel (max 4)", width: 1080, height: 1080, format: "carousel-png", slideFilter: firstFour },
  { id: "fb-single",       label: "Facebook single image",       width: 1200, height: 630,  format: "single-png", slideFilter: coverOnly },
  { id: "linkedin-pdf",    label: "LinkedIn document (PDF)",     width: 1080, height: 1350, format: "pdf-pages" },
  { id: "linkedin-single", label: "LinkedIn single image",       width: 1200, height: 627,  format: "single-png", slideFilter: coverOnly },
  { id: "threads-single",  label: "Threads single image",        width: 1080, height: 1080, format: "single-png", slideFilter: coverOnly },
  { id: "x-horizontal",    label: "X / Twitter horizontal",      width: 1200, height: 675,  format: "single-png", slideFilter: coverOnly },
  { id: "tiktok-vertical", label: "TikTok vertical (video)",     width: 1080, height: 1920, format: "video" },
];

export function getVariant(id: string): PlatformVariant | undefined {
  return PLATFORM_VARIANTS.find((v) => v.id === id);
}

export function getVariantsByFormat(format: PlatformFormat): PlatformVariant[] {
  return PLATFORM_VARIANTS.filter((v) => v.format === format);
}
