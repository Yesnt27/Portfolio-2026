"use client";

import { useEffect, useRef } from "react";
import "./home.css";

/*
  Hero collage (Figma frame 483:143): the Frends Ga-lore puzzle mark (660:265,
  rotated -0.91deg) over a card of Clue phone screens (661:321, rotated
  7.68deg). All geometry is the Figma layout expressed as percentages of the
  collage box, so it scales as one piece.
*/
export default function HeroCollage({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = node.getBoundingClientRect();
        const x = (event.clientX - (box.left + box.width / 2)) / window.innerWidth;
        const y = (event.clientY - (box.top + box.height / 2)) / window.innerHeight;
        node.style.setProperty("--px", x.toFixed(3));
        node.style.setProperty("--py", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={`hero-collage relative aspect-[676.6/547.2] ${className}`} aria-hidden="true">
      {/* Clue phone screens: two columns that scroll past each other forever. */}
      <div className="hero-card absolute left-[25.29%] top-[11.9%] aspect-[505.47/482.05] w-[74.71%]">
        <div className="hero-card-face absolute left-[5.22%] top-[5.88%] h-[88.24%] w-[89.55%] overflow-hidden bg-[#f8f8f8] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]">
          <div className="clue-strip clue-up left-[-13.14%] top-[-30.83%] w-[48.89%]">
            {[0, 1, 2].map((copy) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={copy} src="/images/home/clue-map.webp" alt="" width={519} height={1024} style={{ top: `${copy * 100}%` }} />
            ))}
          </div>
          <div className="clue-strip clue-down left-[41.59%] top-[-75.74%] w-[48.74%]">
            {[0, 1, 2].map((copy) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={copy} src="/images/home/clue-filter.webp" alt="" width={526} height={1024} style={{ top: `${copy * 100}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Frends Ga-lore puzzle mark, on top. */}
      <div className="hero-icon absolute left-0 top-0 aspect-square w-[52.12%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/frends-galore-icon.svg"
          alt=""
          width={347}
          height={347}
          className="hero-icon-face absolute left-[0.77%] top-[0.77%] w-[98.45%]"
        />
      </div>
    </div>
  );
}
