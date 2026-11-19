"use client";

import { useEffect, useRef, useState } from "react";

type Part = { text: string; tone?: "amber" | "amber-soft" };
type Line = { parts: Part[]; indent?: boolean; dim?: boolean; gapBefore?: number };

/*
  The pseudo-code from the Figma footer (e.g. nodes 633:1549–633:1565), line
  for line. "Dim" lines are the 58%-opacity block; indented lines sit 40px in,
  matching the frame (braces at x=345, body at x=385).
*/
const LINES: Line[] = [
  { parts: [{ text: "enum ", tone: "amber" }, { text: "Activity", tone: "amber-soft" }], dim: true },
  { parts: [{ text: "{" }], gapBefore: 12 },
  { parts: [{ text: "Designing in Figma" }], indent: true, dim: true },
  { parts: [{ text: "time = null;" }], indent: true, dim: true },
  { parts: [{ text: "" }], indent: true },
  { parts: [{ text: "final String time;" }], indent: true, dim: true },
  { parts: [{ text: "Activity(String time) this.time = time;" }], indent: true, dim: true },
  { parts: [{ text: "}" }] },
  { parts: [{ text: "@Override" }], indent: true, gapBefore: 32 },
  { parts: [{ text: "public Product design(Product product) {" }], indent: true },
  { parts: [{ text: "Insight why = research(problem);" }], indent: true },
  { parts: [{ text: "Prototype draft = sketch(why);" }], indent: true },
  { parts: [{ text: "" }], indent: true },
  { parts: [{ text: "while (!draft.feelsIntuitive()) {" }], indent: true },
  { parts: [{ text: "draft = iterate(draft);" }], indent: true },
  { parts: [{ text: "}" }] },
];

const TOTAL = LINES.reduce((sum, line) => sum + line.parts.reduce((s, p) => s + p.text.length, 0) + 1, 0);
const MS_PER_CHAR = 16;

const toneClass = { amber: "text-amber", "amber-soft": "text-amber-soft" } as const;

export default function FooterCode({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(TOTAL);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Start hidden only once JS is here, so no-JS visitors still see the code. */
    setTyped(0);
    let frame = 0;
    let start = 0;

    const step = (time: number) => {
      if (!start) start = time;
      const next = Math.min(TOTAL, Math.floor((time - start) / MS_PER_CHAR));
      setTyped(next);
      if (next < TOTAL) frame = requestAnimationFrame(step);
      else setRunning(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setRunning(true);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const caret = (
    <span
      className={`ml-[0.1em] inline-block h-[1.05em] w-[0.58em] translate-y-[0.16em] bg-amber-soft ${
        running ? "" : "caret-blink"
      }`}
    />
  );

  /* Each line costs its characters plus one "newline" tick. */
  let cursor = 0;

  return (
    <div ref={rootRef} className={className}>
      <p className="sr-only">
        A pseudo-code take on how I design: research the problem, sketch, and iterate until the
        draft feels intuitive.
      </p>
      <pre
        aria-hidden="true"
        className="font-pixel text-[clamp(12px,1.1vw,16.5px)] leading-[1.27] text-white"
      >
        {LINES.map((line, index) => {
          const lineStart = cursor;
          const lineLength = line.parts.reduce((s, p) => s + p.text.length, 0);
          cursor += lineLength + 1;
          const last = index === LINES.length - 1;
          /* The caret lives on the line being typed (or the last line once done). */
          const caretHere = typed >= lineStart && (typed <= lineStart + lineLength || (last && typed >= TOTAL));
          let offset = lineStart;
          return (
            <span
              key={index}
              className={`block min-h-[1.27em] ${line.indent ? "pl-[2.4em]" : ""}`}
              style={line.gapBefore ? { marginTop: line.gapBefore } : undefined}
            >
              {line.parts.map((part, partIndex) => {
                const shown = Math.max(0, Math.min(part.text.length, typed - offset));
                const partEnd = offset + part.text.length;
                const isLastPart = partIndex === line.parts.length - 1;
                const done = last && typed >= TOTAL;
                const caretInPart =
                  caretHere &&
                  (done
                    ? isLastPart
                    : typed >= offset && typed - offset < part.text.length + (isLastPart ? 1 : 0));
                offset = partEnd;
                const tone = part.tone ? toneClass[part.tone] : "";
                return (
                  <span key={partIndex} className={`${tone} ${line.dim ? "opacity-58" : ""}`}>
                    {part.text.slice(0, shown)}
                    {caretInPart && caret}
                    <span className="invisible">{part.text.slice(shown)}</span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
