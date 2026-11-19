/*
  The redesign is drawn on a 1512px frame. `fx(px)` turns a Figma x-offset
  into a length that equals `px` at 1512 wide and scales down with the
  viewport below that (never under `min`).
*/
export const FRAME = 1512;

export function fx(px: number, min = 20): string {
  return `clamp(${min}px, ${((px / FRAME) * 100).toFixed(3)}vw, ${px}px)`;
}
