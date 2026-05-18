#!/usr/bin/env bash
# Render-runner-B: still PNGs + PIL append_images -> multi-page PDF (LinkedIn-PDF).
# Wraps render-platform.sh (9 slides at composition native size) then combines
# the PNG sequence into a single PDF artifact alongside the PNGs.
#
# Usage: render-pdf.sh <CompositionID> <output-dir-name> <pdf-filename>
#
# Output: renders/<output-dir-name>/{slide-01..09.png, composite-preview.png, <pdf-filename>}

set -e

COMPOSITION="$1"
DIR_NAME="$2"
PDF_NAME="$3"

if [ -z "$COMPOSITION" ] || [ -z "$DIR_NAME" ] || [ -z "$PDF_NAME" ]; then
  echo "Usage: $0 <CompositionID> <output-dir-name> <pdf-filename>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTION_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$REMOTION_DIR/renders/$DIR_NAME"

echo "[render-pdf] $COMPOSITION -> $DIR_NAME (PDF: $PDF_NAME)"

# Step 1: render 9 stills + 3x3 composite via render-platform.sh
"$SCRIPT_DIR/render-platform.sh" "$COMPOSITION" "$DIR_NAME" 9

# Step 2: combine the 9 PNGs into a single multi-page PDF
python3 - "$OUTPUT_DIR" "$PDF_NAME" << 'PYEOF'
import sys
from PIL import Image

out_dir = sys.argv[1]
pdf_name = sys.argv[2]

slides = []
for i in range(1, 10):
    img = Image.open(f"{out_dir}/slide-{i:02d}.png").convert("RGB")
    slides.append(img)

pdf_path = f"{out_dir}/{pdf_name}"
first, rest = slides[0], slides[1:]
first.save(pdf_path, save_all=True, append_images=rest, format="PDF", resolution=150.0)
w, h = first.size
print(f"PDF saved: {pdf_path} ({len(slides)} pages, {w}x{h} each)")
PYEOF

echo "[$COMPOSITION] PDF DONE -> $OUTPUT_DIR/$PDF_NAME"
