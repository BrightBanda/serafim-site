#!/usr/bin/env bash
#
# Build a Serafim social video.
#
#   ./build.sh chat                        # scene.html -> out/chat.mp4
#   ./build.sh chat 9 30 1080 1920         # with explicit duration/size
#
# Requires: google-chrome, ffmpeg, node 18+ (uses the built-in WebSocket).
set -euo pipefail

cd "$(dirname "$0")"

SCENE="${1:-chat}"
DURATION="${2:-10}"
FPS="${3:-30}"
WIDTH="${4:-1080}"
HEIGHT="${5:-1920}"

SCENE_FILE="${SCENE}.html"
OUT_DIR="out"

if [[ ! -f "$SCENE_FILE" ]]; then
  echo "No such scene: $SCENE_FILE" >&2
  echo "Scenes: $(ls -1 *.html 2>/dev/null | tr '\n' ' ')" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

echo "Rendering $SCENE_FILE -> $OUT_DIR/$SCENE.mp4"
node capture.mjs \
  --scene "$SCENE_FILE" \
  --out "$OUT_DIR/$SCENE.mp4" \
  --duration "$DURATION" \
  --fps "$FPS" \
  --width "$WIDTH" \
  --height "$HEIGHT"

# A GIF preview is handy for pasting into a chat or a README.
if command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -v error -y -i "$OUT_DIR/$SCENE.mp4" -vf "fps=15,scale=540:-1:flags=lanczos" \
    -loop 0 "$OUT_DIR/$SCENE.gif"
  echo "  preview: $OUT_DIR/$SCENE.gif"
fi
