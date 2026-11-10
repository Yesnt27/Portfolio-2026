"use client";

import { useEffect, useRef, useState } from "react";

type ProcessStep = {
  label: string;
  /** id of the section where this step starts. */
  sectionId: string;
};

type ProcessSidebarProps = {
  steps: ProcessStep[];
  /** The last step stays lit until the bottom of this section scrolls past. */
  endSectionId: string;
};

const DURATION_MS = 500;
/* A section counts as "reached" once its top passes 40% down the viewport. */
const READ_LINE = 0.4;

/*
  Figma node 520:227: ✧ turns 45° (reading as ×), then becomes a solid ♦.
  One timeline drives both glyphs so reversing it plays the exact sequence
  backwards, even when it is reversed halfway through.
*/
const STAR_FRAMES: Keyframe[] = [
  { transform: "rotate(0deg)", opacity: 1, offset: 0 },
  { transform: "rotate(45deg)", opacity: 1, offset: 0.55 },
  { transform: "rotate(45deg)", opacity: 0, offset: 0.8 },
  { transform: "rotate(45deg)", opacity: 0, offset: 1 },
];
const DIAMOND_FRAMES: Keyframe[] = [
  { transform: "scale(0.6)", opacity: 0, offset: 0 },
  { transform: "scale(0.6)", opacity: 0, offset: 0.6 },
  { transform: "scale(1)", opacity: 1, offset: 1 },
];

function StepMarker({ active }: { active: boolean }) {
  const starRef = useRef<HTMLSpanElement>(null);
  const diamondRef = useRef<HTMLSpanElement>(null);
  const animations = useRef<Animation[]>([]);

  useEffect(() => {
    const star = starRef.current;
    const diamond = diamondRef.current;
    if (!star || !diamond) return;

    const timing: KeyframeAnimationOptions = {
      duration: DURATION_MS,
      easing: "ease-in",
      fill: "both",
    };
    const created = [star.animate(STAR_FRAMES, timing), diamond.animate(DIAMOND_FRAMES, timing)];
    created.forEach((animation) => animation.pause());
    animations.current = created;

    return () => created.forEach((animation) => animation.cancel());
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    animations.current.forEach((animation) => {
      if (reduceMotion) {
        animation.pause();
        animation.currentTime = active ? DURATION_MS : 0;
        return;
      }

      const time = typeof animation.currentTime === "number" ? animation.currentTime : 0;
      const alreadyThere = active ? time >= DURATION_MS : time <= 0;
      animation.playbackRate = active ? 1 : -1;
      // play() at the far end would rewind and replay, so only run it mid-way.
      if (!alreadyThere) animation.play();
    });
  }, [active]);

  return (
    <span aria-hidden="true" className="relative inline-block w-[1.333em] shrink-0">
      <span ref={starRef} className="inline-block text-black">
        ✧
      </span>
      <span ref={diamondRef} className="absolute left-0 top-0 inline-block text-step-active opacity-0">
        ♦
      </span>
    </span>
  );
}

export default function ProcessSidebar({ steps, endSectionId }: ProcessSidebarProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * READ_LINE;
      let next = -1;

      steps.forEach((step, index) => {
        const top = document.getElementById(step.sectionId)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) next = index;
      });

      const end = document.getElementById(endSectionId)?.getBoundingClientRect().bottom;
      if (end !== undefined && end < line) next = -1;

      setActiveIndex(next);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [steps, endSectionId]);

  return (
    <div className="pointer-events-none absolute inset-y-0 left-step-left hidden lg:block">
      <nav
        aria-label="Case study progress"
        className="pointer-events-auto sticky top-[40vh] font-mono text-sidebar leading-[1.82]"
      >
        <ol>
          {steps.map((step, index) => {
            const active = index === activeIndex;
            return (
              <li key={step.sectionId}>
                <a
                  href={`#${step.sectionId}`}
                  aria-current={active ? "step" : undefined}
                  className={`flex items-center transition-colors duration-500 ease-in hover:text-step-active ${
                    active ? "text-step-active" : "text-step-idle"
                  }`}
                >
                  <StepMarker active={active} />
                  {step.label}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
