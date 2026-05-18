import React from "react";
import { brandGLV as b } from "../brand-glvbuilds";
import { SlideData } from "../types";

interface Props {
  slide: SlideData;
  slideIndex: number;
  totalSlides: number;
}

export const GLVSlide: React.FC<Props> = ({ slide, slideIndex, totalSlides }) => {
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

  if (slide.type === "cover") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: accent,
          fontFamily: font,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: `${padding.top}px ${padding.horizontal}px ${padding.bottom}px`,
          boxSizing: "border-box",
          color: bg,
        }}
      >
        {/* Top eyebrow — series label */}
        <div
          style={{
            fontSize: 28,
            fontWeight: weights.semibold,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.92,
          }}
        >
          Intro {slide.coverNumber} / {slide.coverTotal}
        </div>

        {/* Center stack: giant number + title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: 520,
              fontWeight: weights.extrabold,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              marginBottom: 36,
            }}
          >
            {slide.coverNumber}
          </div>

          <div
            style={{
              fontSize: 108,
              fontWeight: weights.extrabold,
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              maxWidth: "100%",
            }}
          >
            {slide.headline}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid rgba(255,255,255,0.28)`,
            paddingTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: weights.semibold,
              letterSpacing: "0.02em",
            }}
          >
            @glv.marketing
          </div>
          <div style={{ fontSize: 22, opacity: 0.88 }}>
            {slideNum} / {totalNum}
          </div>
        </div>
      </div>
    );
  }

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
      {/* Top accent bar */}
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

      {/* Main content */}
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
        {/* Tag — shown only on hook or when explicitly provided on content */}
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
            {slide.tag}
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

        {/* Hook-only swipe hint */}
        {isHook && (
          <div
            style={{
              marginTop: 44,
              fontSize: 18,
              color: muted,
              letterSpacing: "0.04em",
            }}
          >
            Swipe to read {"→"}
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
