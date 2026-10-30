# Serafim social videos

Code-driven 2D animations for Serafim's social media. Each video is a static
HTML scene rendered frame by frame in headless Chrome and encoded with
ffmpeg — no video editor, no stock footage, no AI-generated artefacts.

```
./build.sh chat          # renders out/chat.mp4 and out/chat.gif
```

## Why this way

The scenes are written in HTML and CSS, which means:

- **Text is real text.** Rendered by the same fonts as the app and the
  website, so it stays crisp and correctly spelled.
- **The design system is shared.** Colours, fonts and the logo come from
  the app (`app_colors.dart`, `serafim_mark.dart`) and the site
  (`src/styles/global.css`), so a video never drifts from the product.
- **Output is deterministic.** The timeline is driven by
  `animation.currentTime`, not wall-clock time, so re-running a build gives
  a byte-identical result. A clip can be re-rendered months later and still
  match.
- **It is editable.** Change a line of CSS, re-run, done.

## How the capture works

`capture.mjs` talks to Chrome over the DevTools Protocol using Node's
built-in `WebSocket` — no npm dependencies at all.

1. Chrome starts headless with a debugging port.
2. The scene loads; `window.__ready` resolves once the fonts are loaded and
   every animation is paused.
3. For each frame, the script calls `window.seek(t)`, which sets
   `currentTime` on every animation in the document, then screenshots.
4. PNG frames are streamed straight into ffmpeg over stdin — nothing hits
   disk in between.

Rendering 300 frames takes roughly two minutes. That is fine for a
one-off, and it means the output is not dependent on how fast your machine
happens to be.

## Layout

```
video/
├── build.sh          Build entry point
├── capture.mjs       CDP frame capture + ffmpeg encode
├── scene.html        The "real-time chat" scene
├── fonts/            Bangers, Inter, JetBrains Mono (local, for determinism)
└── out/              Rendered videos (gitignored)
```

## Scenes

| Scene       | Length | Shows                                        |
| ----------- | ------ | -------------------------------------------- |
| `chat`      | 10s    | A message arriving, typing indicator, read receipts |

## Adding a scene

Copy `scene.html`, change the markup, and give each animated element a
class with a timing rule:

```css
.t-msg3 {
  animation: in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 2.9s both;
}
```

`in-up`, `in-left`, `in-right`, `in-scale` and `fade-in` are defined in the
scene. The delay is the start time in seconds; `both` fill mode holds the
final state.

Then:

```
./build.sh my-scene
```

## Sizes

The default is 1080×1920 — vertical, for TikTok, Reels and Shorts. Pass
different dimensions for other platforms:

```
./build.sh chat 10 30 1920 1080    # landscape
./build.sh chat 10 30 1080 1080    # square
```

## Notes

- The font files in `fonts/` are the same ones the app and site use, so a
  clip matches the product exactly. They are local on purpose: a render
  must not depend on a font CDN being reachable.
- If a clip needs to show a real screen from the app, build the Flutter
  Linux desktop target and screenshot it — the toolchain is installed.
