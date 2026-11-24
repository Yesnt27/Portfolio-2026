"use client";

import { useEffect, useRef, useState } from "react";

/*
  MOCKUP ONLY (branch claude/sandbox-window-mockups).
  C2's bar text: blank at rest. When the box is pulled out, the title and
  then the year type in from left to right, each character flickering
  through random Departure Mono symbols before it settles. Going inactive
  glitches the text back out, right to left and faster.

  Every glyph below is in fonts/DepartureMono-Regular.woff2 (checked against
  its cmap), so the flicker never falls back to another font.
*/

const GLYPHS = Array.from("░▒▓█▀▄▌▐▖▗▘▙▚▛▜▝▞▟■□▪▫◊◌▲►▼◄┼╋╬═║╔╗╚╝#$%&*+=<>/\\|~^@!?¤§¶±∆∑√∞≈≠←↑→↓✦✧♠♣♥♦");
const BLANK = " ";

const IN = { step: 28, scramble: 160, delay: 120 }; // ms per character, flicker length, wait for the lift
const OUT = { step: 10, scramble: 70, delay: 0 };
const FRAME = 45; // a new random glyph about 22 times a second: choppy on purpose

const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/* One frame of the text `chars`, `t` ms into the animation. `index` is each
   character's place in the whole bar, so the year carries on after the title. */
function frame(chars: string[], shown: string[], t: number, on: boolean, first: number, total: number) {
  const { step, scramble, delay } = on ? IN : OUT;
  return chars.map((ch, i) => {
    if (ch === " ") return " ";
    const order = on ? first + i : total - 1 - (first + i);
    const start = delay + order * step;
    if (t < start) return on ? BLANK : shown[i];
    if (t < start + scramble) return glyph();
    return on ? ch : BLANK;
  });
}

function useGlitch(text: string, on: boolean, first: number, total: number) {
  const chars = Array.from(text);
  const blank = () => chars.map((ch) => (ch === " " ? " " : BLANK));
  const [out, setOut] = useState<string[]>(blank);
  const shown = useRef(out);
  shown.current = out;
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      if (!on) return;
    }
    const target = on ? chars : blank();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(target);
      return;
    }
    const from = shown.current;
    const { step, scramble, delay } = on ? IN : OUT;
    const end = delay + total * step + scramble;
    const t0 = performance.now();
    let last = t0;
    setOut(frame(chars, from, 0, on, first, total)); // first frame now, not a frame later
    let raf = requestAnimationFrame(function tick(now) {
      const t = now - t0;
      if (t >= end) return setOut(target);
      if (now - last >= FRAME) {
        last = now;
        setOut(frame(chars, from, t, on, first, total));
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, text]);

  return out.join("");
}

export default function GlitchCaption({ title, year, on }: { title: string; year: string; on: boolean }) {
  const total = title.length + year.length;
  const t = useGlitch(title, on, 0, total);
  const y = useGlitch(year, on, title.length, total);
  return (
    <>
      <span aria-hidden="true" className="mk-glitch min-w-0 truncate">{t}</span>
      <span aria-hidden="true" className="mk-glitch ml-auto">{y}</span>
    </>
  );
}
