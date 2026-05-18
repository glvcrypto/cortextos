#!/usr/bin/env bash
# Render-runner-A: parametrized per-platform still renders.
# Usage: render-platform.sh <CompositionID> <output-dir-name> <slide-count> [<composite-cols> <composite-rows>]
#
# slide-count: 1 (single cover), 4 (fb-square firstFour), 9 (full carousel)
# Composite layout defaults:
#   1  → 1×1 (just the cover, sized to composition aspect)
#   4  → 2×2
#   9  → 3×3
#
# Aspect inferred from Composition (Remotion CLI reports w/h). Output PNGs match
# composition native size. Composite preview scales each tile to (compW/2 × compH/2)
# for 4-slide and (compW/3 × compH/3) for 9-slide; for 1-slide composite preview
# is just a copy of slide-01.

set -e

COMPOSITION="$1"
DIR_NAME="$2"
SLIDE_COUNT="${3:-9}"
COMPOSITE_COLS="${4:-}"
COMPOSITE_ROWS="${5:-}"

if [ -z "$COMPOSITION" ] || [ -z "$DIR_NAME" ]; then
  echo "Usage: $0 <CompositionID> <output-dir-name> <slide-count> [<composite-cols> <composite-rows>]"
  exit 1
fi

# Default composite grid based on slide-count
if [ -z "$COMPOSITE_COLS" ]; then
  case "$SLIDE_COUNT" in
    1) COMPOSITE_COLS=1; COMPOSITE_ROWS=1 ;;
    4) COMPOSITE_COLS=2; COMPOSITE_ROWS=2 ;;
    9) COMPOSITE_COLS=3; COMPOSITE_ROWS=3 ;;
    *) echo "Unsupported slide-count $SLIDE_COUNT (expected 1, 4, or 9). Pass composite-cols + composite-rows explicitly to override."; exit 1 ;;
  esac
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTION_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$REMOTION_DIR/renders/$DIR_NAME"

mkdir -p "$OUTPUT_DIR"
cd "$REMOTION_DIR"

echo "Rendering $COMPOSITION → $OUTPUT_DIR ($SLIDE_COUNT slides, composite ${COMPOSITE_COLS}×${COMPOSITE_ROWS})"

for i in $(seq 0 $((SLIDE_COUNT - 1))); do
  SLIDE_NUM=$(printf "%02d" $((i + 1)))
  FRAME=$((i * 150 + 30))
  OUT_FILE="$OUTPUT_DIR/slide-${SLIDE_NUM}.png"
  echo "  slide-${SLIDE_NUM} (frame ${FRAME})"
  npx remotion still "$COMPOSITION" --frame="$FRAME" --gl=swiftshader --output="$OUT_FILE" 2>&1 | tail -3
done

# Composite preview — tile size = native / cols × native / rows
python3 - "$OUTPUT_DIR" "$SLIDE_COUNT" "$COMPOSITE_COLS" "$COMPOSITE_ROWS" << 'PYEOF'
import sys
from PIL import Image

out_dir = sys.argv[1]
slide_count = int(sys.argv[2])
cols = int(sys.argv[3])
rows = int(sys.argv[4])

first = Image.open(f"{out_dir}/slide-01.png")
native_w, native_h = first.size

if slide_count == 1:
    # 1-slide composite is just the cover
    first.save(f"{out_dir}/composite-preview.png", optimize=True)
    print(f"composite (1×1 cover): {out_dir}/composite-preview.png ({native_w}×{native_h})")
else:
    tile_w = native_w // cols
    tile_h = native_h // rows
    comp_w = tile_w * cols
    comp_h = tile_h * rows
    composite = Image.new("RGB", (comp_w, comp_h))
    for idx in range(slide_count):
        slide = Image.open(f"{out_dir}/slide-{idx+1:02d}.png").resize((tile_w, tile_h), Image.LANCZOS)
        col = idx % cols
        row = idx // cols
        composite.paste(slide, (col * tile_w, row * tile_h))
    composite.save(f"{out_dir}/composite-preview.png", optimize=True)
    print(f"composite ({cols}×{rows}): {out_dir}/composite-preview.png ({comp_w}×{comp_h})")
PYEOF

echo "[$COMPOSITION] DONE"
