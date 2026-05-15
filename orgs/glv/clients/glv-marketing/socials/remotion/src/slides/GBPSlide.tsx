import React from "react";
import { brandGLV as b } from "../brand-glvbuilds";
import { SlideData } from "../types";

interface Props {
  slide: SlideData;
  slideIndex: number;
  totalSlides: number;
}

export const GBPSlide: React.FC<Props> = ({ slide, slideIndex, totalSlides }) => {
  const isHook = slide.type === "hook";
  const { padding, accent, bg, fg, font, weights, muted, divider } = {
    padding: b.padding,
    accent: b.accent,
    bg: b.bg,
    fg: b.fg,
    font: b.font,
    weights: b.weights,
    muted: b.muted,
    divider: b.divider,
  };

  const slideNum = String(slideIndex + 1).padStart(2, "0");
  const totalNum = String(totalSlides).padStart(2, "0");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bg,
        fontFamily: font,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: `${padding.top}px ${padding.horizontal}px ${padding.bottom}px`,
        boxSizing: "border-box",
      }}
    >
      {/* Top accent: full-width for hook, 64px rule for content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isHook ? 0 : padding.horizontal,
          width: isHook ? "100%" : 64,
          height: 4,
          background: accent,
        }}
      />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: isHook ? "center" : "flex-start",
          alignItems: isHook ? "center" : "flex-start",
          textAlign: isHook ? "center" : "left",
          paddingTop: isHook ? 0 : 36,
        }}
      >
        {/* Tag / badge */}
        {slide.tag && (
          <div
            style={{
              fontSize: 15,
              fontWeight: weights.semibold,
              color: accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: isHook ? 24 : 18,
            }}
          >
            {isHook ? slide.tag : `CHECK ${slideNum}`}
          </div>
        )}

        {/* Headline */}
        <div
          style={{
            fontSize: isHook ? 68 : 56,
            fontWeight: weights.extrabold,
            color: fg,
            lineHeight: 1.1,
            marginBottom: slide.body ? 28 : 0,
            maxWidth: "100%",
          }}
        >
          {slide.headline}
        </div>

        {/* Body */}
        {slide.body && (
          <div
            style={{
              fontSize: 30,
              fontWeight: weights.regular,
              color: "#333333",
              lineHeight: 1.55,
              whiteSpace: "pre-line",
              maxWidth: "100%",
            }}
          >
            {slide.body}
          </div>
        )}

        {/* Hook-only: swipe hint */}
        {isHook && (
          <div
            style={{
              marginTop: 44,
              fontSize: 18,
              color: muted,
              letterSpacing: "0.04em",
            }}
          >
            Swipe for the checklist {"→"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${divider}`,
          paddingTop: 20,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: weights.semibold,
            color: fg,
            letterSpacing: "0.02em",
          }}
        >
          @glv.marketing
        </div>
        <div style={{ fontSize: 22, color: muted }}>
          {slideNum} / {totalNum}
        </div>
      </div>
    </div>
  );
};
