import React, { useMemo } from "react";
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
const HEADLINE_IN_SEC = 0.5;
const HEADLINE_DURATION_SEC = 2;
const CHUNK_SIZE = 5; // words per caption phrase

interface CaptionChunk {
  text: string;
  start: number;
  end: number;
}

function buildChunks(words: CaptionWord[], size: number): CaptionChunk[] {
  const chunks: CaptionChunk[] = [];
  for (let i = 0; i < words.length; i += size) {
    const group = words.slice(i, i + size);
    chunks.push({
      text: group.map((w) => w.word).join(" "),
      start: group[0].start,
      end: group[group.length - 1].end,
    });
  }
  return chunks;
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

  const chunks = useMemo(() => buildChunks(captions, CHUNK_SIZE), [captions]);
  const activeChunk = chunks.find((c) => nowSec >= c.start && nowSec <= c.end);
  const captionText = activeChunk?.text ?? "";

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

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Layer a: full-screen video */}
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(videoPath)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Layer b: caption burn — center horizontal, bottom third
          Column flexbox: justifyContent=main axis=vertical, alignItems=cross axis=horizontal */}
      {captionText.length > 0 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 200,
            paddingLeft: 64,
            paddingRight: 64,
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
              lineHeight: 1.25,
              maxWidth: "100%",
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
