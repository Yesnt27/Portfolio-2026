"use client";

/*
  DitherBackground — the site-wide paper: a full-screen, procedurally
  generated dither texture with a cursor wave. It is mounted once in the root
  layout, so it keeps running (and keeps its GPU context) across page
  navigations.

  Why procedural instead of the dithered PNG it replaced?
  - A PNG has edges and a fixed resolution. Tiled, its sides don't match;
    stretched, its pixels turn mushy. Here every pixel is computed from a
    noise function, so the clouds go on forever and the marks stay crisp.
  - It makes the cursor wave possible: the shader looks up the clouds and the
    dither grid from a displaced position (see lib/wave-field.ts).

  Rendering happens in two passes so it stays light on laptops:
    1. TONE pass — smoke-like clouds (domain-warped fbm noise) into a small
       texture at 1/4 resolution. Clouds are soft, so nothing is lost, and the
       expensive noise runs on 1/16 of the pixels. It only re-runs when the
       clouds actually change (ambient drift, scroll, resize).
    2. DITHER pass — full resolution, cheap. For each pixel: read the tone,
       compare it to an X-shaped threshold cell (dot → x → lattice → solid),
       paint ink or paper. The cursor wave shifts where this pass looks, so
       the marks around the cursor slide, squash and ripple, then settle.

  Keeping the motion clean (each of these used to show as tearing/shimmer):
  - Whole device pixels. A dither pixel always spans a whole number of device
    pixels, and the canvas is sized from the element's device-pixel box, so
    the browser never stretches it by a fraction. At 125%/150% display
    scaling or with browser zoom, a CSS-pixel canvas gets some rows and
    columns drawn twice, and those doubled lines crawl through the pattern
    whenever it moves.
  - Interpolated wave. The physics runs at a fixed 60 Hz. Each frame blends
    the last two physics steps on the GPU, so a 120/144 Hz screen gets a new
    wave position every frame instead of holding each one for 2–3 frames.
  - No blank frames. Resizing a canvas clears it, so a resize redraws right
    away instead of showing an empty canvas until the next frame.
  - No wasted frames. Nothing is uploaded or drawn unless it changed, and the
    loop stops completely when nothing is moving.
*/

import { useEffect, useRef } from "react";
import { DEFAULT_WAVE_OPTIONS, DIVERGENCE_RANGE, WaveField } from "@/lib/wave-field";

export type DitherBackgroundProps = {
  /** Size of one dither pixel in CSS px, snapped to whole device pixels. 1 = crisp, 2 = chunkier. */
  pixel?: number;
  /** Width of one X cell in dither pixels (as designed, at 1 dither pixel = `pixel` CSS px).
      Odd numbers give a 1px centre. */
  cell?: number;
  /** Rough diameter of a cloud, in CSS px. */
  scale?: number;
  /** Ambient smoke drift speed. 0 = still until the cursor moves. */
  drift?: number;
  /** How much the clouds follow page scroll (0 = fixed, 1 = locked to content). */
  parallax?: number;
  /** Cursor wave strength. 0 turns the effect off. */
  wave?: number;
  className?: string;
};

type Rgb = [number, number, number];
type Palette = { paper: Rgb; ink: Rgb };

/* ---------------------------------------------------------------- tuning */

/* Look of the clouds, matched by eye to the original dither texture:
   the lightest areas still carry small marks, clouds build up x's and
   lattice, and only the rare cores go dense.
   [lightest tone, darkest tone, noise low, noise high] — the noise values
   sit roughly between -0.15 and 0.17, so these edges put ~half the screen
   on light paper. */
const TONE = [0.12, 0.66, -0.05, 0.24] as const;
/* Marks get pushed fully (refraction), clouds slightly more for a smoky drag. */
const GRID_WARP = 1.0;
const TONE_WARP = 1.35;
/* Squashed areas darken a touch so ripples read even on flat paper. */
const SHADE = 0.35;
/* Tone texture: one texel per 4×4 CSS px, plus overscan so displaced
   lookups near the screen edge still land on real clouds. */
const TONE_TEXEL = 4;
const TONE_MARGIN = 32;
/* Fixed simulation rate; extra frame time is caught up in up to 4 steps. */
const STEP_SECONDS = 1 / 60;
const MAX_STEPS = 4;
/* Ambient drift alone redraws the clouds at ~30 fps; cursor waves and scroll
   get every frame. The 2 ms of slack absorbs frame-timestamp jitter, so the
   cadence stays even (every 2nd frame at 60 Hz, every 5th at 144 Hz). */
const AMBIENT_FRAME_MS = 1000 / 30 - 2;
/* Theme switch: same duration and curve as body's colour transition. */
const THEME_FADE_MS = 400;

/* Colours are theme tokens (app/globals.css), so the paper follows the
   light/dark switch. The fallbacks are the light theme. */
const PAPER_TOKEN = "--color-paper";
const INK_TOKEN = "--color-dither";
const FALLBACK: Palette = {
  paper: [0xf3 / 255, 0xf1 / 255, 0xef / 255],
  ink: [0xcf / 255, 0xcd / 255, 0xcb / 255],
};

/* ---------------------------------------------------------------- shaders */

const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const PRECISION = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

const HASH = /* glsl */ `
// "Hash without Sine" (Dave Hoskins, MIT). Unlike fract(sin(x) * big), it
// gives the same result on every GPU, so nothing turns blocky.
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
`;

/* Pass 1: clouds → tone texture. Texture rows run DOWN the page (row 0 =
   top), matching CSS coordinates, so pass 2 can sample with plain CSS px. */
const TONE_SHADER = PRECISION + HASH + /* glsl */ `
uniform float uTime;    // seconds x drift
uniform float uScroll;  // CSS px the clouds have scrolled
uniform float uScale;   // cloud size, in CSS px
uniform float uTexel;   // CSS px per tone texel
uniform float uMargin;  // CSS px of overscan
uniform vec4 uTone;     // x,y = lightest/darkest tone; z,w = cloud edge

// 2D gradient noise, roughly in [-0.7, 0.7].
float gnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash22(i) * 2.0 - 1.0, f);
  float b = dot(hash22(i + vec2(1.0, 0.0)) * 2.0 - 1.0, f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)) * 2.0 - 1.0, f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)) * 2.0 - 1.0, f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Rotating each octave hides the square grid the noise is built on.
const mat2 ROT = mat2(0.8, 0.6, -0.6, 0.8);

float fbm3(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * gnoise(p);
    p = ROT * p * 2.03 + vec2(17.1, 3.7);
    a *= 0.5;
  }
  return v;
}

// Six octaves with a 0.6 gain keep plenty of small-scale mottling, which is
// what makes the original texture read as smoke rather than smooth blobs.
float fbm6(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * gnoise(p);
    p = ROT * p * 2.03 + vec2(17.1, 3.7);
    a *= 0.6;
  }
  return v;
}

// Smoke: one fbm pushed around by two slower ones (domain warping). Moving
// the warp over time makes the clouds curl and drift instead of sliding.
float clouds(vec2 p, float t) {
  vec2 q = vec2(
    fbm3(p + vec2(0.0, 0.050 * t)),
    fbm3(p + vec2(5.2, 1.3) - vec2(0.040 * t, 0.0))
  );
  return fbm6(p + 1.1 * q + vec2(0.012 * t, -0.008 * t));
}

void main() {
  vec2 css = gl_FragCoord.xy * uTexel - uMargin;
  float n = clouds((css + vec2(0.0, uScroll)) / uScale, uTime);
  float tone = mix(uTone.x, uTone.y, smoothstep(uTone.z, uTone.w, n));
  gl_FragColor = vec4(tone, 0.0, 0.0, 1.0);
}
`;

/* Pass 2: full-resolution dither, displaced by the cursor wave. */
const DITHER_SHADER = PRECISION + HASH + /* glsl */ `
uniform vec2 uRes;            // canvas size, in dither pixels
uniform float uPixel;         // CSS px per dither pixel
uniform float uScroll;        // CSS px the clouds have scrolled
uniform float uCell;          // X cell size, in dither pixels
uniform vec3 uPaper;
uniform vec3 uInk;
uniform sampler2D uToneMap;   // pass 1 output
uniform vec2 uToneSize;       // CSS px covered by the tone texture
uniform float uMargin;
uniform sampler2D uFlow;      // wave field after the latest physics step:
                              //   r,g = displacement, b = stretch
uniform sampler2D uFlowPrev;  // the same, one physics step earlier
uniform float uFlowMix;       // how far this frame is between the two (0-1)
uniform vec2 uFlowSize;       // CSS px covered by the wave texture
uniform float uMaxDisp;       // CSS px that a full-scale r/g value means
uniform float uStretchRange;
uniform float uGridWarp;      // how much the marks themselves get pushed
uniform float uToneWarp;      // how much the clouds get pushed
uniform float uShade;         // how much squash/stretch darkens/lightens

// Threshold map for one dither cell. As the tone rises, a dot grows into a
// small x, the x's arms reach the neighbouring cells to form a diagonal
// lattice, then the lattice thickens until only diamond holes are left.
float crossThreshold(vec2 q) {
  float c = (uCell - 1.0) * 0.5;
  vec2 d = abs(q - c);
  float off = abs(d.x - d.y);   // px away from the X's arms
  float r = max(d.x, d.y) / c;  // 0 at the centre, 1 in the corners
  if (off < 0.5) return mix(0.035, 0.42, r);
  return 0.42 + 0.58 * ((off - 1.0 + r) / c);
}

// A perfectly regular grid lines up into stiff rows and columns. Nudging the
// threshold per cell (marks grow at slightly different tones) and per pixel
// (scattered specks) gives the hand-printed irregularity of the original.
float threshold(vec2 g) {
  float t = crossThreshold(mod(g, uCell));
  t += (hash22(floor(g / uCell) + vec2(0.37, 0.71)).x - 0.5) * 0.12;
  t += (hash22(g + vec2(0.13, 0.57)).x - 0.5) * 0.16;
  return t;
}

void main() {
  // Top-left origin, in dither pixels (pixel centres sit on .5).
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 css = frag * uPixel;

  // Cursor wave: how far the pattern under this pixel has been pushed,
  // blended between the last two physics steps for smooth motion at any
  // refresh rate.
  vec2 flowAt = css / uFlowSize;
  vec3 flow = mix(texture2D(uFlowPrev, flowAt).rgb, texture2D(uFlow, flowAt).rgb, uFlowMix) * 255.0;
  vec2 disp = (flow.xy - 128.0) / 127.0 * uMaxDisp;
  float stretch = (flow.z - 128.0) / 127.0 * uStretchRange;

  // Tone, read from where this pixel's content was pushed from.
  vec2 toneAt = (css - disp * uToneWarp + uMargin) / uToneSize;
  float tone = texture2D(uToneMap, toneAt).r - stretch * uShade;

  // Dither grid, pushed by the same wave so the marks visibly move.
  vec2 g = floor(frag - disp * (uGridWarp / uPixel));
  g.y += floor(uScroll / uPixel + 0.5);
  float ink = step(threshold(g), tone);

  gl_FragColor = vec4(mix(uPaper, uInk, ink), 1.0);
}
`;

/* ---------------------------------------------------------------- helpers */

let colorProbe: CanvasRenderingContext2D | null = null;

/* Any CSS colour (hex, rgb(), oklch()…) → sRGB 0–1, parsed by a 1×1 canvas. */
function toRgb(value: string, fallback: Rgb): Rgb {
  if (!value || !CSS.supports("color", value)) return fallback;
  colorProbe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!colorProbe) return fallback;
  colorProbe.clearRect(0, 0, 1, 1);
  colorProbe.fillStyle = value;
  colorProbe.fillRect(0, 0, 1, 1);
  const [r, g, b] = colorProbe.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  return {
    paper: toRgb(style.getPropertyValue(PAPER_TOKEN).trim(), FALLBACK.paper),
    ink: toRgb(style.getPropertyValue(INK_TOKEN).trim(), FALLBACK.ink),
  };
}

function samePalette(a: Palette, b: Palette) {
  return a.paper.every((v, i) => v === b.paper[i]) && a.ink.every((v, i) => v === b.ink[i]);
}

function mixPalette(a: Palette, b: Palette, t: number): Palette {
  const lerp = (x: Rgb, y: Rgb): Rgb => [
    x[0] + (y[0] - x[0]) * t,
    x[1] + (y[1] - x[1]) * t,
    x[2] + (y[2] - x[2]) * t,
  ];
  return { paper: lerp(a.paper, b.paper), ink: lerp(a.ink, b.ink) };
}

/* CSS `ease`, i.e. cubic-bezier(0.25, 0.1, 0.25, 1): solve x(u) = t, return y(u). */
function cssEase(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let lo = 0;
  let hi = 1;
  let u = t;
  for (let i = 0; i < 16; i++) {
    u = (lo + hi) / 2;
    const x = 0.75 * u * (1 - u) * (1 - u) + 0.75 * u * u * (1 - u) + u * u * u;
    if (x < t) lo = u;
    else hi = u;
  }
  return 0.3 * u * (1 - u) * (1 - u) + 3 * u * u * (1 - u) + u * u * u;
}

/* Nearest odd whole number, at least 3: an X cell needs a centre pixel. */
function oddRound(x: number) {
  return Math.max(3, 2 * Math.round((x - 1) / 2) + 1);
}

function createProgram(gl: WebGLRenderingContext, fragmentSource: string) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("[DitherBackground] shader error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = vs && fs ? gl.createProgram() : null;
  if (program && vs && fs) {
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    // Same attribute slot in both programs, so one vertex setup serves both.
    gl.bindAttribLocation(program, 0, "aPos");
    gl.linkProgram(program);
  }
  if (vs) gl.deleteShader(vs);
  if (fs) gl.deleteShader(fs);
  if (program && !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[DitherBackground] link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function uniforms<T extends string>(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  names: readonly T[],
) {
  const out = {} as Record<T, WebGLUniformLocation | null>;
  for (const name of names) out[name] = gl.getUniformLocation(program, name);
  return out;
}

function createTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

const TONE_UNIFORMS = ["uTime", "uScroll", "uScale", "uTexel", "uMargin", "uTone"] as const;
const DITHER_UNIFORMS = [
  "uRes", "uPixel", "uScroll", "uCell", "uPaper", "uInk", "uToneMap", "uToneSize",
  "uMargin", "uFlow", "uFlowPrev", "uFlowMix", "uFlowSize", "uMaxDisp", "uStretchRange",
  "uGridWarp", "uToneWarp", "uShade",
] as const;

/* Texture units. The tone texture stays bound to its unit; the two wave
   textures swap roles, so they are re-bound before each draw. Uploads use a
   unit of their own so they never disturb those bindings. */
const UNIT_FLOW = 0;
const UNIT_TONE = 1;
const UNIT_FLOW_PREV = 2;
const UNIT_UPLOAD = 3;

/* ---------------------------------------------------------------- component */

export default function DitherBackground({
  pixel = 1,
  cell = 11,
  scale = 640,
  drift = 1,
  parallax = 0.25,
  wave = 1,
  className = "",
}: DitherBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const context = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // No WebGL: the wrapper's paper colour shows instead. Nothing breaks.
    if (!context) return;
    const gl = context;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const field = new WaveField({ force: DEFAULT_WAVE_OPTIONS.force * wave });
    const cellSize = field.options.cellSize;

    let toneProgram: WebGLProgram | null = null;
    let ditherProgram: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let toneTexture: WebGLTexture | null = null;
    let framebuffer: WebGLFramebuffer | null = null;
    /* The wave field after the latest physics step, and one step earlier. */
    let flowCur: WebGLTexture | null = null;
    let flowPrev: WebGLTexture | null = null;
    let tu = {} as ReturnType<typeof uniforms<(typeof TONE_UNIFORMS)[number]>>;
    let du = {} as ReturnType<typeof uniforms<(typeof DITHER_UNIFORMS)[number]>>;

    // Current size: the wrapper in CSS px, the canvas in dither pixels.
    let cssW = 0;
    let cssH = 0;
    let canvasW = 0;
    let canvasH = 0;
    let devicePerDot = 0; // device px per dither pixel
    let cellDots = 0; // X cell, in dither pixels
    let toneW = 1;
    let toneH = 1;

    let lost = false;
    let raf = 0;
    let running = false;
    let lastFrame = 0;
    let lastTone = -Infinity;
    let toneDirty = true; // clouds need re-rendering
    let ditherDirty = true; // screen needs redrawing even if the wave is still
    let accumulator = 0;
    let time = 0;
    let flowMix = 1; // 0 = previous step, 1 = latest step
    let flowActive = false; // a wave texture holds something other than rest
    let restSteps = 2; // physics steps since the field came to rest

    // Cached from the scroll event, so the frame loop never reads layout.
    let pageScroll = window.scrollY;

    let shown = readPalette(); // colours the shader is painting with
    let fade: { from: Palette; to: Palette; start: number } | null = null;

    // Viewport-relative pointer tracking (the canvas is fixed at 0,0).
    let originX = 0;
    let originY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;
    let trailX = 0;
    let trailY = 0;
    let hasTrail = false;

    /* -- GPU resources ----------------------------------------------------- */

    function init() {
      toneProgram = createProgram(gl, TONE_SHADER);
      ditherProgram = createProgram(gl, DITHER_SHADER);
      if (!toneProgram || !ditherProgram) return false;
      tu = uniforms(gl, toneProgram, TONE_UNIFORMS);
      du = uniforms(gl, ditherProgram, DITHER_UNIFORMS);

      // One oversized triangle covers the whole target.
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.activeTexture(gl.TEXTURE0 + UNIT_UPLOAD);
      flowCur = createTexture(gl);
      flowPrev = createTexture(gl);
      gl.activeTexture(gl.TEXTURE0 + UNIT_TONE);
      toneTexture = createTexture(gl);
      framebuffer = gl.createFramebuffer();

      gl.useProgram(toneProgram);
      gl.uniform1f(tu.uScale, scale);
      gl.uniform1f(tu.uTexel, TONE_TEXEL);
      gl.uniform1f(tu.uMargin, TONE_MARGIN);
      gl.uniform4f(tu.uTone, TONE[0], TONE[1], TONE[2], TONE[3]);

      gl.useProgram(ditherProgram);
      gl.uniform1i(du.uFlow, UNIT_FLOW);
      gl.uniform1i(du.uToneMap, UNIT_TONE);
      gl.uniform1i(du.uFlowPrev, UNIT_FLOW_PREV);
      gl.uniform1f(du.uMargin, TONE_MARGIN);
      gl.uniform1f(du.uMaxDisp, field.options.maxDisplacement);
      gl.uniform1f(du.uStretchRange, DIVERGENCE_RANGE);
      gl.uniform1f(du.uGridWarp, GRID_WARP);
      gl.uniform1f(du.uToneWarp, TONE_WARP);
      gl.uniform1f(du.uShade, SHADE);
      setPalette(shown);
      return true;
    }

    function setPalette(palette: Palette) {
      shown = palette;
      gl.useProgram(ditherProgram);
      gl.uniform3fv(du.uPaper, palette.paper);
      gl.uniform3fv(du.uInk, palette.ink);
      ditherDirty = true;
    }

    /* `device` is the wrapper's size in device pixels, when the browser
       reports it exactly (Chromium, Firefox). Otherwise it's rounded from
       CSS px. `force` re-creates everything (after a lost context). */
    function resize(device?: ResizeObserverSize, force = false) {
      if (lost || !ditherProgram) return;
      const rect = wrapper!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      let deviceW = Math.round(rect.width * dpr);
      let deviceH = Math.round(rect.height * dpr);
      // Prefer the exact count, but only when it agrees with the estimate:
      // DevTools device emulation reports the physical screen's box, which
      // would leave the canvas covering only part of the page.
      if (device && Math.abs(device.inlineSize - deviceW) <= 1 && Math.abs(device.blockSize - deviceH) <= 1) {
        deviceW = device.inlineSize;
        deviceH = device.blockSize;
      }
      // A dither pixel spans a whole number of device pixels, never a fraction.
      const k = Math.max(1, Math.round(pixel * dpr));
      const w = Math.max(1, Math.ceil(deviceW / k));
      const h = Math.max(1, Math.ceil(deviceH / k));
      // Keep the X cells close to their designed size in CSS px.
      const c = oddRound((cell * pixel * dpr) / k);
      const same =
        w === canvasW && h === canvasH && k === devicePerDot && c === cellDots &&
        rect.width === cssW && rect.height === cssH;
      if (same && !force) return;

      originX = rect.left;
      originY = rect.top;
      cssW = rect.width;
      cssH = rect.height;
      canvasW = w;
      canvasH = h;
      devicePerDot = k;
      cellDots = c;
      const dot = k / dpr; // CSS px per dither pixel
      if (canvas!.width !== w) canvas!.width = w;
      if (canvas!.height !== h) canvas!.height = h;
      // Exactly k device pixels per canvas pixel. It can overhang the wrapper
      // by less than one dither pixel; the wrapper clips that.
      canvas!.style.width = `${w * dot}px`;
      canvas!.style.height = `${h * dot}px`;

      // Tone texture: viewport + overscan, at 1/TONE_TEXEL resolution.
      toneW = Math.ceil((cssW + TONE_MARGIN * 2) / TONE_TEXEL);
      toneH = Math.ceil((cssH + TONE_MARGIN * 2) / TONE_TEXEL);
      gl.activeTexture(gl.TEXTURE0 + UNIT_TONE);
      gl.bindTexture(gl.TEXTURE_2D, toneTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, toneW, toneH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, toneTexture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      // Wave field: resets any motion, which is fine on a resize.
      resetFlow();

      gl.useProgram(ditherProgram);
      gl.uniform2f(du.uRes, w, h);
      gl.uniform1f(du.uPixel, dot);
      gl.uniform1f(du.uCell, c);
      gl.uniform2f(du.uToneSize, toneW * TONE_TEXEL, toneH * TONE_TEXEL);
      gl.uniform2f(du.uFlowSize, field.cols * cellSize, field.rows * cellSize);

      // Changing the canvas size cleared it. Draw now rather than on the next
      // frame: a ResizeObserver callback runs before the page is painted, so
      // the empty (black) canvas is never shown.
      hasTrail = false;
      toneDirty = true;
      render(performance.now());
      kick();
    }

    /* Put the wave at rest: reset the field (sized to the wrapper) and
       re-create both wave textures from it. */
    function resetFlow() {
      field.resize(cssW, cssH);
      const rest = field.encode();
      for (const texture of [flowCur, flowPrev]) {
        gl.activeTexture(gl.TEXTURE0 + UNIT_UPLOAD);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D, 0, gl.RGBA, field.cols, field.rows, 0,
          gl.RGBA, gl.UNSIGNED_BYTE, rest,
        );
      }
      flowActive = false;
      restSteps = 2;
      accumulator = 0;
      flowMix = 1;
      ditherDirty = true;
    }

    function uploadFlow(texture: WebGLTexture | null) {
      gl.activeTexture(gl.TEXTURE0 + UNIT_UPLOAD);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texSubImage2D(
        gl.TEXTURE_2D, 0, 0, 0, field.cols, field.rows,
        gl.RGBA, gl.UNSIGNED_BYTE, field.encode(),
      );
    }

    /* -- drawing ----------------------------------------------------------- */

    function render(now: number) {
      const scroll = pageScroll * parallax;
      if (toneDirty) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0, 0, toneW, toneH);
        gl.useProgram(toneProgram);
        gl.uniform1f(tu.uTime, time);
        gl.uniform1f(tu.uScroll, scroll);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        lastTone = now;
        toneDirty = false;
        ditherDirty = true;
      }
      // While the wave moves, every frame shows a new blend of the last two
      // physics steps; otherwise only redraw when something changed.
      if (!ditherDirty && !flowActive) return;
      gl.viewport(0, 0, canvasW, canvasH);
      gl.useProgram(ditherProgram);
      gl.activeTexture(gl.TEXTURE0 + UNIT_FLOW);
      gl.bindTexture(gl.TEXTURE_2D, flowCur);
      gl.activeTexture(gl.TEXTURE0 + UNIT_FLOW_PREV);
      gl.bindTexture(gl.TEXTURE_2D, flowPrev);
      gl.uniform1f(du.uFlowMix, flowMix);
      gl.uniform1f(du.uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      ditherDirty = false;
    }

    /* -- cursor wave --------------------------------------------------------
       Fixed 60 Hz physics, shown as a blend of the last two steps. The blend
       factor is how far the clock has run toward the next step, so the wave
       advances smoothly on every frame at any refresh rate (it trails the
       physics by at most one step, ~17 ms). Textures are only uploaded when a
       step actually happened. */

    function stepWave(dt: number) {
      accumulator += dt;
      let steps = Math.floor(accumulator / STEP_SECONDS);
      if (steps > MAX_STEPS) {
        steps = MAX_STEPS;
        accumulator = 0;
      } else {
        accumulator -= steps * STEP_SECONDS;
      }
      flowMix = accumulator / STEP_SECONDS;

      if (hasPointer && !hasTrail) {
        trailX = pointerX;
        trailY = pointerY;
        hasTrail = true;
      }
      const pointerMoved = hasTrail && (trailX !== pointerX || trailY !== pointerY);
      if (steps === 0 || !(flowActive || pointerMoved)) return;

      for (let s = 0; s < steps; s++) {
        if (hasTrail) {
          // Walk the trail toward the latest pointer position, one even
          // slice per step, so fast flicks still leave a continuous wake.
          const nx = trailX + (pointerX - trailX) / (steps - s);
          const ny = trailY + (pointerY - trailY) / (steps - s);
          field.push(trailX, trailY, nx, ny);
          trailX = nx;
          trailY = ny;
        }
        field.step();
        restSteps = field.awake ? 0 : restSteps + 1;
        // Several steps in one frame (a slow frame): the blend starts from
        // the second-to-last of them.
        if (s === steps - 2) uploadFlow(flowPrev);
      }
      // One step: the old "latest" becomes "previous".
      if (steps === 1) [flowPrev, flowCur] = [flowCur, flowPrev];
      uploadFlow(flowCur);
      // Once the field has rested for two steps, both textures are at rest.
      flowActive = restSteps < 2;
      ditherDirty = true;
    }

    /* -- frame loop ---------------------------------------------------------
       The loop only runs while something is changing: ambient drift, a wave
       that hasn't settled, a theme fade. Otherwise it stops completely and
       the next pointer move, scroll or theme change restarts it. */

    function kick() {
      if (running || lost) return;
      running = true;
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    }

    function frame(now: number) {
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : STEP_SECONDS;
      lastFrame = now;
      const animate = !reduceMotion.matches;

      const drifting = animate && drift > 0;
      if (drifting) {
        time += dt * drift;
        if (now - lastTone >= AMBIENT_FRAME_MS) toneDirty = true;
      }

      if (animate && wave > 0) stepWave(dt);
      else if (flowActive) resetFlow();

      if (fade) {
        const t = (now - fade.start) / THEME_FADE_MS;
        setPalette(t >= 1 ? fade.to : mixPalette(fade.from, fade.to, cssEase(t)));
        if (t >= 1) fade = null;
      }

      render(now);

      const pointerPending =
        animate && wave > 0 && hasTrail && (trailX !== pointerX || trailY !== pointerY);
      if (drifting || flowActive || pointerPending || fade) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    /* -- events ------------------------------------------------------------ */

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX - originX;
      pointerY = event.clientY - originY;
      hasPointer = true;
      if (wave > 0 && !reduceMotion.matches) kick();
    };
    // Forget the trail when the pointer leaves, so re-entering on the other
    // side of the window doesn't drag the whole page across.
    const onPointerLeave = () => {
      hasPointer = false;
      hasTrail = false;
    };
    const onScroll = () => {
      pageScroll = window.scrollY;
      toneDirty = true;
      kick();
    };
    const redraw = () => {
      toneDirty = true;
      kick();
    };
    // Theme switch: fade to the new tokens alongside body's own transition.
    const onThemeChange = () => {
      const next = readPalette();
      if (samePalette(next, fade ? fade.to : shown)) return;
      if (reduceMotion.matches) {
        fade = null;
        setPalette(next);
      } else {
        fade = { from: shown, to: next, start: performance.now() };
      }
      kick();
    };
    // devicePixelRatio changes (browser zoom, moving to another screen) don't
    // always change the device-pixel size, so watch the ratio itself too.
    let dprQuery: MediaQueryList | null = null;
    function watchDpr() {
      dprQuery?.removeEventListener("change", onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      dprQuery.addEventListener("change", onDprChange);
    }
    function onDprChange() {
      watchDpr();
      resize();
    }
    const onContextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      running = false;
      cancelAnimationFrame(raf);
    };
    const onContextRestored = () => {
      lost = false;
      if (init()) resize(undefined, true);
    };

    if (!init()) return;
    resize();

    const observer = new ResizeObserver((entries) => {
      resize(entries[entries.length - 1]?.devicePixelContentBoxSize?.[0]);
    });
    try {
      observer.observe(wrapper, { box: "device-pixel-content-box" });
    } catch {
      observer.observe(wrapper); // Safari: no device-pixel box; sizes are rounded instead
    }
    watchDpr();
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    if (parallax !== 0) window.addEventListener("scroll", onScroll, { passive: true });
    reduceMotion.addEventListener("change", redraw);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      observer.disconnect();
      themeObserver.disconnect();
      dprQuery?.removeEventListener("change", onDprChange);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      reduceMotion.removeEventListener("change", redraw);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      // Free GPU memory, but don't call loseContext(): React StrictMode
      // re-runs this effect on the same <canvas>, and a lost context can't
      // be reused.
      gl.deleteFramebuffer(framebuffer);
      gl.deleteTexture(toneTexture);
      gl.deleteTexture(flowCur);
      gl.deleteTexture(flowPrev);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(toneProgram);
      gl.deleteProgram(ditherProgram);
    };
  }, [pixel, cell, scale, drift, parallax, wave]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-paper transition-[background-color] duration-[400ms] ease-[ease] ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" style={{ imageRendering: "pixelated" }} />
    </div>
  );
}
