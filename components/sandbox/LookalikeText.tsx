"use client";

import { useEffect, useRef, useState } from "react";

/*
  Text whose letters briefly trade places with look-alike glyphs, like the
  title of the Departure Mono site: a 2 for an R, a Ξ for an E. It stays put
  until `trigger` changes (each SHUFFLE click), then for about a second one or
  two letters at a time swap out, hold for a few beats and snap back, and the
  word settles on its real spelling. Reduced motion: it never changes.

  Every look-alike below is in fonts/DepartureMono-Regular.woff2 (checked
  against its cmap and rendered beside the real letter), and the font is
  monospaced, so a swap never changes the word's width.
*/

const LOOKALIKES: Record<string, string[]> = {
  A: ["Λ"],
  E: ["Ξ", "€", "Σ"],
  F: ["Ғ", "₣"],
  H: ["Ħ", "Ӈ"],
  L: ["Ł", "£"],
  N: ["Ŋ"],
  O: ["0"],
  R: ["2"],
  S: ["5", "$"],
  T: ["7"],
  U: ["Ʉ", "Ц"],
};

const RUN = 1000; // ms of swapping per trigger, about as long as a shuffle takes
const TICK = 120; // ms between changes
const HOLD = [2, 4]; // a swapped letter stays for 2–4 ticks

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export default function LookalikeText({ text, trigger }: { text: string; trigger: number }) {
  const [shown, setShown] = useState(text);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const real = Array.from(text);
    const swappable = real.map((ch, i) => (LOOKALIKES[ch.toUpperCase()] ? i : -1)).filter((i) => i >= 0);
    if (swappable.length === 0) return;

    const now = [...real];
    const until = real.map(() => 0); // tick at which each swapped letter snaps back
    let tick = 0;

    const step = () => {
      tick += 1;
      real.forEach((ch, i) => {
        if (now[i] !== ch && tick >= until[i]) now[i] = ch;
      });
      /* One or two fresh swaps, among letters that are showing their real self. */
      const free = swappable.filter((i) => now[i] === real[i]);
      const count = Math.min(free.length, Math.random() < 0.35 ? 2 : 1);
      for (let n = 0; n < count; n++) {
        const i = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        now[i] = pick(LOOKALIKES[real[i].toUpperCase()]);
        until[i] = tick + HOLD[0] + Math.floor(Math.random() * (HOLD[1] - HOLD[0] + 1));
      }
      setShown(now.join(""));
    };

    step();
    const timer = window.setInterval(step, TICK);
    const stop = window.setTimeout(() => {
      window.clearInterval(timer);
      setShown(text);
    }, RUN);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
      setShown(text);
    };
  }, [trigger, text]);

  return <>{shown}</>;
}
