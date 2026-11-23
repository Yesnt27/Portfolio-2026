/*
  WaveField — the "jelly" behind the cursor wave on the dither background.

  Why a tiny physics grid instead of a CSS/SVG distortion?
  - The dither is drawn per-pixel in a shader, so the cleanest way to "move the
    background around" is to hand the shader a displacement map: for every
    point on screen, how many px the pattern there has been pushed.
  - That map comes from a coarse grid (one cell ≈ 14 CSS px) running a damped
    2D wave equation. The cursor drags the cells it passes over; each cell is
    springy, so the pattern wobbles back to rest; neighbouring cells are
    coupled, so the disturbance spreads outward as ripples.

  Per cell we store a displacement d (px) and its velocity v (px per step), for
  x and y. One step (fixed 60 Hz) does:

      v += c² · laplacian(d)   ← neighbours pull on each other → waves travel
         − k · d               ← spring back to rest
         − γ · v               ← friction so ripples die out
      d += v

  The grid is ~10k cells on a 1920×1080 screen, so a step costs well under a
  millisecond in plain JS and the shader only reads one small texture.
*/

export type WaveFieldOptions = {
  /** CSS px covered by one simulation cell. Bigger = smoother, cheaper. */
  cellSize: number;
  /** c² in cells²/step². Must stay ≤ 0.5 or the explicit solver explodes. */
  waveSpeed: number;
  /** Spring pulling every cell back to zero displacement. */
  stiffness: number;
  /** Friction on cell velocity (0–1 per step). */
  damping: number;
  /** Cursor influence radius in CSS px. */
  radius: number;
  /** How much of the cursor's own motion is passed on to the field. */
  force: number;
  /** Hard cap on displacement, in CSS px — keeps the effect "a little bit". */
  maxDisplacement: number;
};

/*
  Tuned headless, by replaying simulated cursor sweeps through this class, so that:
    slow move  (~240 px/s)  → pattern shifts ~4 px
    glide      (~600 px/s)  → ~11 px, with a ring of ripples behind it
    fast flick (~1500 px/s) → capped at 20 px
  and everything is back at rest within ~1–2 s of the cursor stopping.
*/
export const DEFAULT_WAVE_OPTIONS: WaveFieldOptions = {
  cellSize: 14,
  waveSpeed: 0.28,
  stiffness: 0.035,
  damping: 0.085,
  radius: 130,
  force: 0.045,
  maxDisplacement: 20,
};

/* Displacement in [-max, max] is packed into a byte as 128 ± 127 so that
   zero maps to exactly 128 and linear filtering between two resting cells
   stays exactly at rest. The shader decodes with the same constants. */
const ZERO = 128;
const RANGE = 127;
/* Divergence (local stretch/squash of the pattern) is packed the same way,
   normalised by this value. */
export const DIVERGENCE_RANGE = 0.5;
/* Fastest cursor speed the field reacts to, in CSS px per step. Stops a
   pointer that re-enters the window far away from flinging the page. */
const MAX_CURSOR_SPEED = 48;
/* Below this (px, summed over a cell's position + velocity) the field counts
   as settled and the render loop can sleep. A tenth of a pixel is invisible,
   so snapping to zero here never shows. */
const REST_EPSILON = 0.08;

export class WaveField {
  readonly options: WaveFieldOptions;
  cols = 0;
  rows = 0;
  /** RGBA bytes ready for texImage2D: R = dx, G = dy, B = divergence. */
  texture = new Uint8Array(0);
  /** True while anything is still moving. */
  awake = false;

  private dx = new Float32Array(0);
  private dy = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);

  constructor(options: Partial<WaveFieldOptions> = {}) {
    this.options = { ...DEFAULT_WAVE_OPTIONS, ...options };
  }

  /** Re-allocate for a new viewport size (CSS px). Resets all motion. */
  resize(width: number, height: number) {
    const { cellSize } = this.options;
    this.cols = Math.max(2, Math.ceil(width / cellSize) + 1);
    this.rows = Math.max(2, Math.ceil(height / cellSize) + 1);
    const n = this.cols * this.rows;
    this.dx = new Float32Array(n);
    this.dy = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.texture = new Uint8Array(n * 4).fill(ZERO);
    this.awake = false;
  }

  /**
   * Drag the field along one step of cursor travel, from (x0, y0) to
   * (x1, y1) in CSS px. Cells near the path get the cursor's velocity added
   * to theirs, weighted by a smooth falloff, so the pattern under the cursor
   * is carried along with it.
   */
  push(x0: number, y0: number, x1: number, y1: number) {
    let ux = x1 - x0;
    let uy = y1 - y0;
    const speed = Math.hypot(ux, uy);
    if (speed < 0.01 || this.cols === 0) return;
    if (speed > MAX_CURSOR_SPEED) {
      ux *= MAX_CURSOR_SPEED / speed;
      uy *= MAX_CURSOR_SPEED / speed;
    }

    const { cellSize, radius, force } = this.options;
    const r2 = radius * radius;
    const segX = x1 - x0;
    const segY = y1 - y0;
    const segLen2 = segX * segX + segY * segY;

    // Only visit cells inside the segment's bounding box (+ radius).
    const iMin = Math.max(0, Math.floor((Math.min(x0, x1) - radius) / cellSize));
    const iMax = Math.min(this.cols - 1, Math.ceil((Math.max(x0, x1) + radius) / cellSize));
    const jMin = Math.max(0, Math.floor((Math.min(y0, y1) - radius) / cellSize));
    const jMax = Math.min(this.rows - 1, Math.ceil((Math.max(y0, y1) + radius) / cellSize));

    for (let j = jMin; j <= jMax; j++) {
      const cy = (j + 0.5) * cellSize;
      for (let i = iMin; i <= iMax; i++) {
        const cx = (i + 0.5) * cellSize;
        // Distance from the cell centre to the cursor's path this step.
        let t = segLen2 > 0 ? ((cx - x0) * segX + (cy - y0) * segY) / segLen2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const ex = cx - (x0 + segX * t);
        const ey = cy - (y0 + segY * t);
        const d2 = ex * ex + ey * ey;
        if (d2 >= r2) continue;
        // (1 − (d/R)²)² — 1 under the cursor, 0 at the edge, smooth both ends.
        const falloff = 1 - d2 / r2;
        const w = falloff * falloff * force;
        const k = j * this.cols + i;
        this.vx[k] += ux * w;
        this.vy[k] += uy * w;
      }
    }
    this.awake = true;
  }

  /** Advance the simulation by one fixed step. */
  step() {
    if (!this.awake) return;
    const { waveSpeed: c2, stiffness: k, damping: g, maxDisplacement: max } =
      this.options;
    const { cols, rows, dx, dy, vx, vy } = this;
    const max2 = max * max;
    let peak = 0;

    // 1) Accelerate every cell from its neighbours, its spring and friction.
    //    Edge cells reuse themselves as the missing neighbour (no pull from
    //    outside the screen), which reflects waves softly at the borders.
    for (let j = 0; j < rows; j++) {
      const row = j * cols;
      const up = j > 0 ? -cols : 0;
      const down = j < rows - 1 ? cols : 0;
      for (let i = 0; i < cols; i++) {
        const c = row + i;
        const l = i > 0 ? c - 1 : c;
        const r = i < cols - 1 ? c + 1 : c;
        const u = c + up;
        const d = c + down;
        const lapX = dx[l] + dx[r] + dx[u] + dx[d] - 4 * dx[c];
        const lapY = dy[l] + dy[r] + dy[u] + dy[d] - 4 * dy[c];
        vx[c] += c2 * lapX - k * dx[c] - g * vx[c];
        vy[c] += c2 * lapY - k * dy[c] - g * vy[c];
      }
    }

    // 2) Move, clamp, and track the biggest motion left in the field.
    for (let c = 0; c < dx.length; c++) {
      let x = dx[c] + vx[c];
      let y = dy[c] + vy[c];
      const m2 = x * x + y * y;
      if (m2 > max2) {
        const s = max / Math.sqrt(m2);
        x *= s;
        y *= s;
      }
      dx[c] = x;
      dy[c] = y;
      const a = Math.abs(x) + Math.abs(y) + Math.abs(vx[c]) + Math.abs(vy[c]);
      if (a > peak) peak = a;
    }

    if (peak < REST_EPSILON) {
      // Snap to exact rest so the loop can sleep without a frozen offset.
      dx.fill(0);
      dy.fill(0);
      vx.fill(0);
      vy.fill(0);
      this.awake = false;
    }
  }

  /** Pack the current state into `texture` and return it. */
  encode() {
    const { cols, rows, dx, dy, texture } = this;
    const { maxDisplacement: max, cellSize } = this.options;
    const toByte = (v: number) => {
      const b = Math.round(ZERO + v * RANGE);
      return b < 1 ? 1 : b > 255 ? 255 : b;
    };
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const c = j * cols + i;
        const l = i > 0 ? c - 1 : c;
        const r = i < cols - 1 ? c + 1 : c;
        const u = j > 0 ? c - cols : c;
        const d = j < rows - 1 ? c + cols : c;
        // How much the pattern is being stretched (+) or squashed (−) here.
        const div = (dx[r] - dx[l] + dy[d] - dy[u]) / (2 * cellSize);
        const o = c * 4;
        texture[o] = toByte(dx[c] / max);
        texture[o + 1] = toByte(dy[c] / max);
        texture[o + 2] = toByte(div / DIVERGENCE_RANGE);
        texture[o + 3] = 255;
      }
    }
    return texture;
  }
}
