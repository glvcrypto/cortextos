import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  staticFile,
} from "remotion";

export interface CaptionWord {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

export interface ReelProps {
  videoPath: string;
  captions: CaptionWord[];
  headline: string;
  showBrandTag?: boolean;
}

const FONT = "'Inter', sans-serif";
const ACCENT = "#B22222";
const HEADLINE_IN_SEC = 0.5; // headline animates in at 0.5s
const HEADLINE_DURATION_SEC = 2; // headline visible for 2s then fades

function useCaptionWords(captions: CaptionWord[], frame: number, fps: number) {
  const nowSec = frame / fps;
  return captions.filter((w) => nowSec >= w.start && nowSec <= w.end);
}

export const ReelComposition: React.FC<ReelProps> = ({
  videoPath,
  captions,
  headline,
  showBrandTag = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nowSec = frame / fps;

  // Headline: fade+slide in at 0.5s, hold 2s, fade out
  const headlineStartFrame = Math.round(HEADLINE_IN_SEC * fps);
  const headlineHoldFrame = Math.round((HEADLINE_IN_SEC + HEADLINE_DURATION_SEC) * fps);
  const headlineOutFrame = Math.round((HEADLINE_IN_SEC + HEADLINE_DURATION_SEC + 0.3) * fps);

  const headlineOpacity = interpolate(
    frame,
    [headlineStartFrame, headlineStartFrame + Math.round(0.25 * fps), headlineHoldFrame, headlineOutFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) }
  );
  const headlineY = interpolate(
    frame,
    [headlineStartFrame, headlineStartFrame + Math.round(0.25 * fps)],
    [-24, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) }
  );

  const activeWords = useCaptionWords(captions, frame, fps);
  const captionText = activeWords.map((w) => w.word).join(" ");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Layer a: full-screen video */}
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(videoPath)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Layer b: caption burn — bottom third */}
      {captionText.length > 0 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 160,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 700,
              color: "#FFFFFF",
              textAlign: "center",
              textShadow: "0px 2px 8px rgba(0,0,0,0.9), 0px 0px 24px rgba(0,0,0,0.7)",
              lineHeight: 1.2,
              maxWidth: "90%",
            }}
          >
            {captionText}
          </div>
        </AbsoluteFill>
      )}

      {/* Layer c: headline overlay — top third */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 96,
          paddingLeft: 48,
          paddingRight: 48,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 56,
            fontWeight: 800,
            color: "#FFFFFF",
            textAlign: "left",
            textShadow: "0px 2px 12px rgba(0,0,0,0.95)",
            lineHeight: 1.15,
            maxWidth: "88%",
            borderLeft: `6px solid ${ACCENT}`,
            paddingLeft: 20,
          }}
        >
          {headline}
        </div>
      </AbsoluteFill>

      {/* Layer d: brand corner tag — bottom right */}
      {showBrandTag && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: "0 28px 28px 0",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.04em",
              textShadow: "0px 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            @glv.marketing
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
