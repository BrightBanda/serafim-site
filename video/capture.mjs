#!/usr/bin/env node
/**
 * Frame-accurate capture of a Serafim video scene.
 *
 * Launches headless Chrome, loads the scene, then seeks every CSS animation
 * to an exact time and screenshots it. Because the timeline is driven by
 * `animation.currentTime` rather than wall-clock, the same input always
 * produces the same output — re-running a build never changes the video.
 *
 * Frames are streamed to ffmpeg as PNG over stdin, so nothing is written to
 * disk in between.
 *
 *   node capture.mjs --scene scene.html --out ../dist/video/chat.mp4 \
 *                    --duration 9 --fps 30 --width 1080 --height 1920
 */

import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------- args */

function parseArgs(argv) {
  const out = {
    scene: 'scene.html',
    out: 'out.mp4',
    duration: 9,
    fps: 30,
    width: 1080,
    height: 1920,
    crf: 18,
    preset: 'slow',
  };
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2);
    const value = argv[++i];
    if (name in out) out[name] = Number.isNaN(Number(value)) ? value : Number(value);
  }
  return out;
}

const args = parseArgs(process.argv);
const totalFrames = Math.round(args.duration * args.fps);

/* --------------------------------------------------------- chrome */

const profile = await mkdtemp(join(tmpdir(), 'serafim-cdp-'));
const port = 9222 + Math.floor(Math.random() * 500);

const chrome = spawn(
  'google-chrome',
  [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-lcd-text',
    '--force-color-profile=srgb',
    '--allow-file-access-from-files',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    `--window-size=${args.width},${args.height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

function cleanup() {
  chrome.kill('SIGTERM');
  rm(profile, { recursive: true, force: true }).catch(() => {});
}
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(1);
});

// Wait for the debugging endpoint to come up.
let wsUrl = null;
for (let i = 0; i < 100; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/version`);
    const info = await res.json();
    wsUrl = info.webSocketDebuggerUrl;
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}
if (!wsUrl) {
  console.error('Chrome did not expose a debugging endpoint');
  cleanup();
  process.exit(1);
}

/* ------------------------------------------------------ cdp client */

const ws = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const events = [];

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(msg.error.message));
    else resolve(msg.result);
  } else if (msg.method) {
    events.push(msg);
  }
});

function send(method, params = {}, sessionId) {
  const id = nextId++;
  const payload = { id, method, params };
  if (sessionId) payload.sessionId = sessionId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify(payload));
  });
}

/* --------------------------------------------------- page session */

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

const call = (method, params) => send(method, params, sessionId);

await call('Page.enable');
await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride', {
  width: args.width,
  height: args.height,
  deviceScaleFactor: 1,
  mobile: false,
});

const sceneUrl = 'file://' + resolve(here, args.scene);
await call('Page.navigate', { url: sceneUrl });
await new Promise((r) => setTimeout(r, 1200)); // let the document parse

// Wait for the scene to report that fonts are loaded and animations paused.
await call('Runtime.evaluate', {
  expression: 'window.__ready',
  awaitPromise: true,
  returnByValue: true,
});

/* --------------------------------------------------------- ffmpeg */

mkdirSync(dirname(resolve(args.out)), { recursive: true });

const ffmpeg = spawn(
  'ffmpeg',
  [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(args.fps),
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-preset', args.preset,
    '-crf', String(args.crf),
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-r', String(args.fps),
    resolve(args.out),
  ],
  { stdio: ['pipe', 'ignore', 'pipe'] },
);

let ffmpegErr = '';
ffmpeg.stderr.on('data', (d) => {
  ffmpegErr += d.toString();
});

const ffmpegDone = new Promise((resolve) => ffmpeg.on('close', resolve));

/* --------------------------------------------------------- frames */

const frameCount = totalFrames;
const started = Date.now();

for (let i = 0; i < frameCount; i++) {
  const t = i / args.fps;

  await call('Runtime.evaluate', {
    expression: `window.seek(${t})`,
    awaitPromise: true,
    returnByValue: true,
  });

  const { data } = await call('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    optimizeForSpeed: false,
  });

  const buf = Buffer.from(data, 'base64');
  if (!ffmpeg.stdin.write(buf)) {
    await new Promise((r) => ffmpeg.stdin.once('drain', r));
  }

  if ((i + 1) % 30 === 0 || i === frameCount - 1) {
    const pct = Math.round(((i + 1) / frameCount) * 100);
    process.stdout.write(`\r  frame ${i + 1}/${frameCount}  (${pct}%)   `);
  }
}

process.stdout.write('\n');
ffmpeg.stdin.end();
await ffmpegDone;

if (ffmpegErr.includes('Error') || ffmpegErr.includes('Invalid')) {
  console.error(ffmpegErr.split('\n').slice(-15).join('\n'));
}

const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`  wrote ${args.out}  (${frameCount} frames, ${args.fps}fps, ${seconds}s)`);

cleanup();
process.exit(0);
