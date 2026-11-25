// dither.js
// Ordered (Bayer) dithering, ported from Figma's "Dither" shader effect
// (the one exported with Figma frame 740:1097) to WebGL 1, so it runs in
// every browser instead of only in experimental Chromium.
//
// It follows Figma's ordered pipeline step for step:
//   1. load    — sample the source at the centre of each block
//   2. dither  — contrast/brightness, then quantize each channel (or the luma,
//                in mono mode) to `levels` steps, nudged by the Bayer threshold
//                of the block
//   3. present — every block is one flat square: the target canvas has one
//                pixel per block and is scaled up with image-rendering: pixelated
//
// One shared WebGL context does the work and copies each result into the
// target's own 2D canvas, so the page doesn't gain a WebGL context per frame.

// ---- Bayer matrix: same construction as Figma's bayerMatrix() ----------------
function bayerMatrix(N) {
  if (N === 1) return [[0]];
  const small = bayerMatrix(N / 2);
  const m = N / 2;
  const out = [];
  for (let y = 0; y < N; y++) {
    out[y] = new Array(N);
    for (let x = 0; x < N; x++) {
      const v = small[y % m][x % m] * 4;
      const qx = Math.floor(x / m);
      const qy = Math.floor(y / m);
      const qoff = qy === 0 && qx === 0 ? 0 : qy === 0 && qx === 1 ? 2 : qy === 1 && qx === 0 ? 3 : 1;
      out[y][x] = v + qoff;
    }
  }
  return out;
}

// Rank m (0 … N²-1) per cell as bytes. The shader turns it into Figma's
// threshold (m + 0.5) / N² exactly, without 8-bit rounding.
function bayerBytes(N) {
  const m = bayerMatrix(N);
  const data = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) data[y * N + x] = m[y][x];
  return data;
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// One fragment per block (the canvas is blocksX × blocksY pixels).
const FRAG = `
precision highp float;
uniform sampler2D u_src;
uniform sampler2D u_bayer;
uniform vec2 u_blocks;     // blocks across / down
uniform vec2 u_cover;      // blocks × block size ÷ element size (>= 1 when the last block is partial)
uniform float u_tile;      // Bayer tile size (16)
uniform float u_levels;
uniform float u_bright;
uniform float u_contrast;
uniform float u_mono;      // 1 = mono, 0 = per-channel colour
uniform vec3 u_monoColor;

float quantize(float c, float t) {
  float L = u_levels - 1.0;
  float off = (t - 0.5) / L;
  return clamp(floor((c + off) * L + 0.5) / L, 0.0, 1.0);
}
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

void main() {
  // Block index, counted from the top-left like Figma's compute grid.
  vec2 cell = vec2(floor(gl_FragCoord.x), u_blocks.y - 1.0 - floor(gl_FragCoord.y));

  // 1. load: sample the source at the block centre.
  vec2 uv = clamp((cell + 0.5) / u_blocks * u_cover, 0.0, 1.0);
  vec4 s = texture2D(u_src, uv);
  vec3 c = s.rgb;

  // 2. dither.
  c = clamp((c - 0.5) * u_contrast + 0.5 + u_bright, 0.0, 1.0);
  vec2 t2 = (mod(cell, u_tile) + 0.5) / u_tile;
  float m = floor(texture2D(u_bayer, t2).r * 255.0 + 0.5);
  float th = (m + 0.5) / (u_tile * u_tile);
  vec3 q = u_mono > 0.5
    ? u_monoColor * quantize(luma(c), th)
    : vec3(quantize(c.r, th), quantize(c.g, th), quantize(c.b, th));

  // 3. present (premultiplied, like Figma's present pass).
  gl_FragColor = vec4(q * s.a, s.a);
}
`;

let shared = null;

function getShared() {
  if (shared) return shared;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn('[dither]', gl.getShaderInfoLog(sh));
    return sh;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const makeTex = (unit, filter) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };

  // Unit 1: the 16×16 Bayer ranks (nearest, never filtered).
  makeTex(1, gl.NEAREST);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 16, 16, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, bayerBytes(16));

  // Unit 0: the source (linear, like Figma's sampler).
  makeTex(0, gl.LINEAR);

  const u = (name) => gl.getUniformLocation(prog, name);
  gl.uniform1i(u('u_src'), 0);
  gl.uniform1i(u('u_bayer'), 1);
  gl.uniform1f(u('u_tile'), 16);

  shared = {
    canvas,
    gl,
    loc: {
      blocks: u('u_blocks'),
      cover: u('u_cover'),
      levels: u('u_levels'),
      bright: u('u_bright'),
      contrast: u('u_contrast'),
      mono: u('u_mono'),
      monoColor: u('u_monoColor'),
    },
  };
  return shared;
}

/**
 * Dither `source` (an image, canvas or video) into `target`, a 2D canvas whose
 * width/height are the block counts.
 *
 * params: Figma's shader params — { levels, mono, monoColor: {r,g,b},
 *         brightness (100 = unchanged), contrast }
 * cover:  [x, y] — blocks × block size ÷ element size (1 when blocks fit exactly)
 *
 * Returns false when WebGL isn't available (the caller shows the plain source).
 */
export function ditherInto(target, source, params, cover = [1, 1]) {
  const s = getShared();
  if (!s) return false;
  const { gl, canvas, loc } = s;
  const W = target.width;
  const H = target.height;
  if (!W || !H) return true;

  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  gl.viewport(0, 0, W, H);

  gl.activeTexture(gl.TEXTURE0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

  const mc = params.monoColor ?? { r: 1, g: 1, b: 1 };
  gl.uniform2f(loc.blocks, W, H);
  gl.uniform2f(loc.cover, cover[0], cover[1]);
  gl.uniform1f(loc.levels, params.levels);
  gl.uniform1f(loc.bright, ((params.brightness ?? 100) - 100) / 200);
  gl.uniform1f(loc.contrast, params.contrast ?? 1);
  gl.uniform1f(loc.mono, params.mono ? 1 : 0);
  gl.uniform3f(loc.monoColor, mc.r, mc.g, mc.b);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Copy out in the same task, before the drawing buffer is cleared.
  const ctx = target.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(canvas, 0, 0);
  return true;
}
