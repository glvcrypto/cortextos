#!/usr/bin/env bash
# GLV Marketing — Reel editing pipeline
# Trigger: boss receives a Telegram video with caption matching 'reel:' or '#reel'
# Input:   VIDEO_PATH (local file from fast-checker)
# Output:  rendered .mp4 in reel-output/ + optional Blotato syndication
#
# Required installs (Aiden: sudo apt-get install -y ffmpeg cmake build-essential):
#   - ffmpeg        at ~/bin/ffmpeg or in $PATH
#   - whisper.cpp   at ~/whisper.cpp/build/bin/whisper-cli
#   - model         at ~/whisper.cpp/models/ggml-large-v3.bin

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"
REMOTION_DIR="$REPO_ROOT/orgs/glv/clients/glv-marketing/socials/remotion"
OUTPUT_DIR="$REPO_ROOT/orgs/glv/social/glvbuilds/reel-output"
WHISPER_BIN="${HOME}/whisper.cpp/build/bin/whisper-cli"
WHISPER_MODEL="${HOME}/whisper.cpp/models/ggml-large-v3.bin"
FFMPEG="${HOME}/bin/ffmpeg"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <video_path> [caption_text]"
  exit 1
fi

VIDEO_PATH="$1"
CAPTION_TEXT="${2:-}"
BASENAME="$(basename "${VIDEO_PATH%.*}")"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
RUN_DIR="$OUTPUT_DIR/${TIMESTAMP}_${BASENAME}"
mkdir -p "$RUN_DIR"

log() { echo "[reel-pipeline] $*"; }

log "Input: $VIDEO_PATH"
log "Output dir: $RUN_DIR"

# ── Step 1: Extract audio ────────────────────────────────────────────────────
log "Extracting audio..."
AUDIO_PATH="$RUN_DIR/audio.wav"
"$FFMPEG" -i "$VIDEO_PATH" -ar 16000 -ac 1 -f wav "$AUDIO_PATH" -y -loglevel error

# ── Step 2: Whisper transcription → word-level JSON ──────────────────────────
log "Transcribing with whisper.cpp (large-v3)..."
WHISPER_OUT="$RUN_DIR/transcript"
"$WHISPER_BIN" \
  -m "$WHISPER_MODEL" \
  -f "$AUDIO_PATH" \
  -ojf \
  -of "$WHISPER_OUT" \
  -np \
  2>/dev/null

WHISPER_JSON="${WHISPER_OUT}.json"
if [[ ! -f "$WHISPER_JSON" ]]; then
  log "ERROR: whisper did not produce $WHISPER_JSON"
  exit 1
fi
log "Transcript written to $WHISPER_JSON"

# ── Step 3: Parse word-level timestamps → captions JSON ──────────────────────
CAPTIONS_JSON="$RUN_DIR/captions.json"
python3 - "$WHISPER_JSON" "$CAPTIONS_JSON" << 'PYEOF'
import json, sys

with open(sys.argv[1]) as f:
    data = json.load(f)

# whisper.cpp -ojf format: data['transcription'][*]['tokens'][*]
# Each token: text, offsets.from (ms), offsets.to (ms)
# Skip special tokens (wrapped in [_ ... ] or empty after strip)
words = []
for segment in data.get("transcription", []):
    for tok in segment.get("tokens", []):
        text = tok.get("text", "").strip()
        if not text or text.startswith("[_") or text.startswith("<"):
            continue
        offsets = tok.get("offsets", {})
        start_ms = offsets.get("from", 0)
        end_ms = offsets.get("to", 0)
        words.append({
            "word": text,
            "start": round(start_ms / 1000.0, 3),
            "end": round(end_ms / 1000.0, 3),
        })

with open(sys.argv[2], "w") as f:
    json.dump(words, f, indent=2)

print(f"Parsed {len(words)} words")
PYEOF

log "Captions: $(python3 -c "import json; d=json.load(open('$CAPTIONS_JSON')); print(len(d), 'words')")"

# ── Step 4: Full transcript text for Claude ───────────────────────────────────
TRANSCRIPT_TEXT="$(python3 -c "
import json
d = json.load(open('$CAPTIONS_JSON'))
print(' '.join(w['word'] for w in d))
")"
log "Transcript: ${TRANSCRIPT_TEXT:0:120}..."

# ── Step 5: Claude generates headline + caption ───────────────────────────────
log "Generating headline via Claude CLI..."

HEADLINE_PROMPT="You are writing hook-style social media copy for GLV Marketing (a Canadian digital marketing agency). Given this transcript, write a single punchy 1-line headline (max 10 words) for the reel. Rules: no em-dashes, no AI-tells (no leverage/elevate/unlock/transform/game-changer/dive-in), no hedging openers, no tricolons. Canadian English. Just output the headline text, nothing else.

Transcript: ${TRANSCRIPT_TEXT}"

HEADLINE="$(echo "$HEADLINE_PROMPT" | claude -p 2>/dev/null | tr -d '\n' | head -c 120)"
log "Headline: $HEADLINE"

CAPTION_PROMPT="Write a short social media caption (2-4 sentences) for this GLV Marketing reel. Hook first sentence. Then expand on value. End with a soft CTA (e.g. follow for more, comment your question, link in bio). No em-dashes. No AI-tells. Canadian English. No hashtags — just the caption body.

Transcript: ${TRANSCRIPT_TEXT}"

POST_CAPTION="$(echo "$CAPTION_PROMPT" | claude -p 2>/dev/null)"
log "Caption generated (${#POST_CAPTION} chars)"

# Save headline + caption
echo "$HEADLINE" > "$RUN_DIR/headline.txt"
echo "$POST_CAPTION" > "$RUN_DIR/caption.txt"

# ── Step 6: Get video duration for Remotion ───────────────────────────────────
DURATION_SECS="$("$FFMPEG" -i "$VIDEO_PATH" 2>&1 | grep Duration | awk '{print $2}' | tr -d , | awk -F: '{print $1*3600 + $2*60 + $3}' | python3 -c "import sys; print(round(float(sys.stdin.read().strip()), 2))")"
DURATION_FRAMES="$(python3 -c "import math; print(math.ceil($DURATION_SECS * 30))")"
log "Video duration: ${DURATION_SECS}s = ${DURATION_FRAMES} frames @ 30fps"

# ── Step 7: Build Remotion props ──────────────────────────────────────────────
# Copy video into Remotion public/ so staticFile() can serve it; delete after render
REMOTION_PUBLIC="$REMOTION_DIR/public"
mkdir -p "$REMOTION_PUBLIC"
VIDEO_STAGED="${REMOTION_PUBLIC}/reel-input-${TIMESTAMP}.mp4"
cp "$VIDEO_PATH" "$VIDEO_STAGED"
VIDEO_STAGED_NAME="reel-input-${TIMESTAMP}.mp4"
log "Staged video to Remotion public/: $VIDEO_STAGED_NAME"

PROPS_JSON="$RUN_DIR/props.json"
python3 - "$VIDEO_STAGED_NAME" "$CAPTIONS_JSON" "$HEADLINE" "$PROPS_JSON" << 'PYEOF'
import json, sys

video_basename = sys.argv[1]
captions_file = sys.argv[2]
headline = sys.argv[3]
out_file = sys.argv[4]

with open(captions_file) as f:
    captions = json.load(f)

props = {
    "videoPath": video_basename,
    "captions": captions,
    "headline": headline,
    "showBrandTag": True,
}

with open(out_file, "w") as f:
    json.dump(props, f, indent=2)

print(f"Props written: {len(captions)} caption words, headline: {headline[:60]}")
PYEOF

# ── Step 8: Render via Remotion ───────────────────────────────────────────────
OUTPUT_VIDEO="$RUN_DIR/reel-${TIMESTAMP}.mp4"
log "Rendering Remotion Reel composition..."
cd "$REMOTION_DIR"
npx remotion render Reel \
  --props="$(cat "$PROPS_JSON")" \
  --frames="0-$((DURATION_FRAMES - 1))" \
  --output="$OUTPUT_VIDEO" \
  --gl=swiftshader \
  2>&1 | tail -10

# Clean up staged video from public/
rm -f "$VIDEO_STAGED"
log "Cleaned up staged video"

log "Render complete: $OUTPUT_VIDEO"

# ── Step 9: Save run manifest ─────────────────────────────────────────────────
cat > "$RUN_DIR/manifest.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "video_input": "$VIDEO_PATH",
  "duration_sec": $DURATION_SECS,
  "duration_frames": $DURATION_FRAMES,
  "headline": $(python3 -c "import json, sys; print(json.dumps(sys.argv[1]))" "$HEADLINE"),
  "output_video": "$OUTPUT_VIDEO",
  "caption_file": "$RUN_DIR/caption.txt",
  "auto_post": false
}
EOF

log "Done. Output at: $OUTPUT_VIDEO"
log "Caption: $RUN_DIR/caption.txt"
log ""
log "Next step: review output, then run reel-post.sh to syndicate via Blotato."
