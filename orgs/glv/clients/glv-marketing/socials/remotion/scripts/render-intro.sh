#!/usr/bin/env bash
# Usage: render-intro.sh <CompositionID> <output-dir-name>
# e.g.:  render-intro.sh Intro1WhoIsGLVv4 intro-1-who-is-glv-2026-05-18-v4
set -e

COMPOSITION="$1"
DIR_NAME="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTION_DIR="$(dirname "$SCRIPT_DIR")"
RENDERS_DIR="$REMOTION_DIR/renders"
OUTPUT_DIR="$RENDERS_DIR/$DIR_NAME"

if [ -z "$COMPOSITION" ] || [ -z "$DIR_NAME" ]; then
  echo "Usage: $0 <CompositionID> <output-dir-name>"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
echo "Rendering $COMPOSITION → $OUTPUT_DIR"

# 8 slides × 150 frames, capture at frame 30 into each slide
for i in $(seq 0 7); do
  SLIDE_NUM=$(printf "%02d" $((i + 1)))
  FRAME=$((i * 150 + 30))
  OUT_FILE="$OUTPUT_DIR/slide-${SLIDE_NUM}.png"
  echo "  slide-${SLIDE_NUM} (frame ${FRAME}) → ${OUT_FILE}"
  cd "$REMOTION_DIR" && npx remotion still "$COMPOSITION" --frame="$FRAME" --gl=swiftshader --output="$OUT_FILE"
done

# Composite: 4×2 grid of all 8 slides scaled to 540×540 = 2160×1080
echo "  Generating composite-preview.png..."
python3 - "$OUTPUT_DIR" << 'PYEOF'
import sys
from PIL import Image

out_dir = sys.argv[1]
slides = [Image.open(f"{out_dir}/slide-{i:02d}.png").resize((540, 540), Image.LANCZOS) for i in range(1, 9)]
composite = Image.new("RGB", (2160, 1080))
for idx, slide in enumerate(slides):
    col = idx % 4
    row = idx // 4
    composite.paste(slide, (col * 540, row * 540))
composite.save(f"{out_dir}/composite-preview.png", optimize=True)
print(f"  composite-preview.png saved ({composite.size})")
PYEOF

echo "DONE: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"
