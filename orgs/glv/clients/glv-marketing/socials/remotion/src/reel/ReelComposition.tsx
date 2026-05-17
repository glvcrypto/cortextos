import React, { useMemo } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  spring,
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

const CAPTION_FONT = "'Inter', sans-serif";
// Bebas Neue loaded from public/fonts/ via @font-face in the style block below
const HEADLINE_FONT = "'BebasNeue', 'Arial Black', Impact, sans-serif";
const HEADLINE_IN_SEC = 0.5;
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

  // Headline: spring pop-in at 0.5s, hold for full video (no fade out)
  const headlineStartFrame = Math.round(HEADLINE_IN_SEC * fps);
  const framesAfterStart = Math.max(0, frame - headlineStartFrame);

  // Spring: natural overshoot 0 → ~1.15 → 1.0, settles ~250ms
  const headlineScale = spring({
    frame: framesAfterStart,
    fps,
    config: { damping: 8, stiffness: 280, mass: 0.55 },
  });
  const headlineVisible = frame >= headlineStartFrame;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Font face for Bebas Neue from public/fonts/ */}
      <style>{`
        @font-face {
          font-family: 'BebasNeue';
          src: url('${staticFile("fonts/bebas-neue.woff2")}') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
      `}</style>

      {/* Layer a: full-screen video */}
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(videoPath)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Layer b: caption burn — center horizontal, bottom third */}
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
              fontFamily: CAPTION_FONT,
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

      {/* Layer c: UGC-native headline — upper third, spring pop-in, slight tilt */}
      {headlineVisible && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-start",
            // Shift 6% left of true center for off-axis feel
            justifyContent: "center",
            paddingTop: 220,
            paddingLeft: 48,
            paddingRight: 48,
            transform: `scale(${headlineScale}) translateX(-65px) rotate(-3deg)`,
            transformOrigin: "center top",
          }}
        >
          {/* Option A: white text + black outline, chunky Bebas Neue */}
          <div
            style={{
              fontFamily: HEADLINE_FONT,
              fontSize: 96,
              fontWeight: 400, // Bebas Neue is display-weight at 400
              color: "#FFFFFF",
              // Black outline via text-stroke + multi-shadow
              WebkitTextStroke: "5px #000000",
              textShadow: "0px 3px 16px rgba(0,0,0,0.6)",
              textAlign: "center",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              maxWidth: "90%",
              textTransform: "uppercase",
            }}
          >
            {headline}
          </div>
        </AbsoluteFill>
      )}

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
              fontFamily: CAPTION_FONT,
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
