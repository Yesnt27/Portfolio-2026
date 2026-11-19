"use client";

import { useEffect, useRef } from "react";

/*
  Outline-free square cursor. See the "Outline-free cursor" notes in
  app/globals.css for why it is a DOM element instead of a cursor image.

  Only runs when a mouse is the main pointer; touch devices never see it,
  and without JS the native square cursors still apply.
*/

/* Same targets that get the pointer cursor in globals.css. */
const INTERACTIVE =
  'a, button, summary, label[for], select, [role="button"], [role="menuitem"], [role="tab"], .cursor-pointer';
const TEXT = 'input, textarea, [contenteditable="true"]';

/* Relative luminance (WCAG) of an sRGB colour, 0 = black, 1 = white. */
function luminance(r: number, g: number, b: number) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/* Computed colours arrive as rgb()/rgba(), as color(srgb …) when they come
   from color-mix() (the player's button hover), or as oklab()/oklch() while a
   hover transition is mid-way. Returns [luminance 0–1, alpha]. */
function parseColor(value: string): [number, number] | null {
  const legacy = value.match(/^rgba?\(([^)]+)\)$/);
  if (legacy) {
    const [r, g, b, a = 1] = legacy[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return [luminance(r, g, b), a];
  }
  const srgb = value.match(/^color\(srgb ([^)]+)\)$/);
  if (srgb) {
    const [r, g, b, a = 1] = srgb[1].split(/[\s/]+/).filter(Boolean).map(Number);
    return [luminance(r * 255, g * 255, b * 255), a];
  }
  const ok = value.match(/^okl(?:ab|ch)\(([^)]+)\)$/);
  if (ok) {
    const [l, , , a = "1"] = ok[1].split(/[\s/]+/).filter(Boolean);
    const lightness = l.endsWith("%") ? parseFloat(l) / 100 : parseFloat(l);
    // OKLab lightness is roughly the cube root of luminance.
    return [lightness ** 3, a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a)];
  }
  return null;
}

/*
  Difference blending turns a flat mid grey into the same grey, so the square
  would vanish there. Look at the nearest solid background under the pointer:
  if it's a flat mid grey, paint the square solid black or white instead.
  Images, video, gradients and the dither keep the blend, which handles them.
*/
function toneFor(target: Element): "blend" | "dark" | "light" {
  for (let node: Element | null = target; node && node !== document.documentElement; node = node.parentElement) {
    if (node instanceof HTMLImageElement || node instanceof HTMLVideoElement || node instanceof HTMLCanvasElement) {
      // Photos and video: blend. Small icons: look at what's behind them.
      const box = node.getBoundingClientRect();
      if (box.width >= 64 && box.height >= 64) return "blend";
      continue;
    }
    const style = getComputedStyle(node);
    if (style.backgroundImage !== "none") return "blend";
    const colour = parseColor(style.backgroundColor);
    if (!colour) {
      if (style.backgroundColor === "transparent") continue;
      return "blend"; // a colour space we don't parse; the blend is a safe default
    }
    const [lum, alpha] = colour;
    if (alpha < 0.5) continue;
    if (lum > 0.15 && lum < 0.6) return lum > 0.3 ? "dark" : "light";
    return "blend";
  }
  return "blend";
}

export default function BlendCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-blend-cursor");

    let x = -100;
    let y = -100;
    let last: Element | null = null;
    let recheck = 0;

    const classify = (target: Element | null) => {
      if (target === last) return;
      last = target;
      window.clearTimeout(recheck);
      if (!target || target.closest("iframe")) {
        cursor.dataset.mode = "hidden";
        return;
      }
      cursor.dataset.mode = target.closest(TEXT) ? "text" : target.closest(INTERACTIVE) ? "pointer" : "default";
      cursor.dataset.tone = toneFor(target);
      // Hover styles fade in over ~0.15s; look again once they've landed.
      recheck = window.setTimeout(() => {
        if (last === target) cursor.dataset.tone = toneFor(target);
      }, 200);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      cursor.style.translate = `${x}px ${y}px`;
      cursor.toggleAttribute("data-visible", true);
      classify(event.target as Element);
    };
    const onLeave = () => cursor.toggleAttribute("data-visible", false);
    // Scrolling moves content under a still pointer; re-check what's there.
    const onScroll = () => classify(document.elementFromPoint(x, y));
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") cursor.toggleAttribute("data-down", true);
    };
    const onUp = () => cursor.toggleAttribute("data-down", false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", onLeave);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearTimeout(recheck);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onLeave);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-blend-cursor");
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="blend-cursor" data-mode="default" data-tone="blend">
      <span />
    </div>
  );
}
