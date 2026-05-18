export type SlideType = "hook" | "content" | "cta" | "cover";

export interface SlideData {
  type: SlideType;
  /** Main headline or hook text. For cover slides: the series title (e.g. "Who is GLV") */
  headline: string;
  /** Optional subtext / body copy */
  body?: string;
  /** Optional accent colour override (hex) — defaults to brand.primary */
  accent?: string;
  /** Optional background image URL */
  bgImage?: string;
  /** Slide-level tag/label shown above headline (e.g. "TIP #1") */
  tag?: string;
  /** Cover-only: position in series (e.g. 1 in "1 OF 3") */
  coverNumber?: number;
  /** Cover-only: series total (e.g. 3 in "1 OF 3") */
  coverTotal?: number;
}

export interface CarouselProps {
  slides: SlideData[];
  /** Show logo on every slide (default: true) */
  showLogo?: boolean;
  /** Show slide counter (default: true) */
  showCounter?: boolean;
  /** Canvas variant */
  variant?: "vertical" | "square";
}
