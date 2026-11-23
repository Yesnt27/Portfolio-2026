"use client";

import { useEffect, useRef } from "react";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";

/*
  Poster collage from Figma frame 515:157. On the 1512 frame the collage spans
  x 259–1455, y 2954–4987; every poster is stored as its raw Figma rect and
  converted to a percentage of that 1196 x 2033 stage, so the composition
  scales as one unit.
*/
const ORIGIN_X = 259;
const ORIGIN_Y = 2954;
const STAGE_W = 1196;
const STAGE_H = 2033;

type Poster = {
  src: string;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /* Vertical travel per 1000px of stage height across a scroll pass.
     Positive drifts down (reads as further away), negative drifts up. */
  speed: number;
};

const { posters } = fuorisaloneImages;

/* Bottom-to-top, matching Figma's layer order, so overlaps occlude the same way. */
const surrounding: Poster[] = [
  { src: posters.p45, alt: "Poster reference: Emigre 10", x: 259, y: 4008, w: 181, h: 247, speed: 165 },
  { src: posters.p53, alt: "Poster reference: Emigre cover study", x: 357, y: 4609, w: 256, h: 378, speed: 140 },
  { src: posters.p54, alt: "Poster reference: Emigre Mad", x: 581, y: 4472, w: 196, h: 286, speed: -60 },
  { src: posters.p55, alt: "Poster reference: Emigre travel accounts", x: 1167, y: 3486, w: 288, h: 429, speed: 130 },
  { src: posters.p61, alt: "Poster reference: brush lettering study", x: 1148, y: 4315, w: 170, h: 251, speed: 100 },
  { src: posters.p43, alt: "Poster reference: Rant", x: 343, y: 3272, w: 234, h: 369, speed: -95 },
  { src: posters.p46, alt: "Poster reference: Emigre 44", x: 303, y: 3761, w: 227, h: 292, speed: 85 },
  { src: posters.p47, alt: "Poster reference: Emigre Essential", x: 489, y: 3111, w: 182, h: 271, speed: 150 },
  { src: posters.p56, alt: "Poster reference: palm type study", x: 1104, y: 3014, w: 211, h: 310, speed: -70 },
  { src: posters.p60, alt: "Poster reference: Honey Barbara", x: 960, y: 3780, w: 258, h: 364, speed: -120 },
  { src: posters.p62, alt: "Poster reference: layered exhibition sheet", x: 1038, y: 4661, w: 345, h: 254, speed: -105 },
  { src: posters.p64, alt: "Poster reference: Emigre Magazine spread", x: 796, y: 2954, w: 345, h: 256, speed: 110 },
];

/* The showcase piece: never parallaxes, always on top. */
const centre = {
  src: fuorisaloneImages.webp.frame100,
  alt: "Fuorisalone 2024 Milan Design Week poster",
  x: 668,
  y: 3639,
  w: 370,
  h: 507,
};

const captionRect = { x: 671, y: 4163, w: 371 };

const pct = (value: number, total: number) => `${(value / total) * 100}%`;
const frame = (rect: { x: number; y: number; w: number; h: number }) => ({
  left: pct(rect.x - ORIGIN_X, STAGE_W),
  top: pct(rect.y - ORIGIN_Y, STAGE_H),
  width: pct(rect.w, STAGE_W),
  aspectRatio: `${rect.w} / ${rect.h}`,
});

export default function PosterParallax({ caption }: { caption: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending = 0;
    const update = () => {
      pending = 0;
      const rect = stage.getBoundingClientRect();
      const viewport = window.innerHeight;
      /* 0 as the stage enters from below, 1 once it has left the top. */
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      stage.style.setProperty("--p", String(clamped - 0.5));
      stage.style.setProperty("--u", String(rect.height / 1000));
    };
    const onScroll = () => {
      if (!pending) pending = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (pending) window.cancelAnimationFrame(pending);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={stageRef}
        className="relative hidden aspect-[1196/2033] md:block"
        style={{ ["--p" as string]: "0", ["--u" as string]: "1", width: "min(100%, 1196px)" }}
      >
        {surrounding.map((poster) => (
          <div
            key={poster.src}
            className="absolute will-change-transform"
            style={{
              ...frame(poster),
              transform: `translate3d(0, calc(var(--p) * var(--u) * ${poster.speed} * 1px), 0)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster.src}
              alt={poster.alt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-500 ease-snap hover:scale-[1.04]"
            />
          </div>
        ))}

        <div className="absolute z-10" style={frame(centre)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={centre.src} alt={centre.alt} loading="lazy" decoding="async" className="size-full object-cover" />
        </div>

        <p
          className="absolute z-10 font-mono text-[clamp(12px,1.1vw,16.5px)] leading-[normal] text-copy"
          style={{
            left: pct(captionRect.x - ORIGIN_X, STAGE_W),
            top: pct(captionRect.y - ORIGIN_Y, STAGE_H),
            width: pct(captionRect.w, STAGE_W),
          }}
        >
          {caption}
        </p>
      </div>

      {/* Phones: the same posters as a plain grid, showcase piece first. */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        <div className="col-span-2 mx-auto w-2/3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={centre.src} alt={centre.alt} loading="lazy" className="h-auto w-full" />
        </div>
        <p className="col-span-2 text-center font-mono text-[14px] text-copy">{caption}</p>
        {surrounding.map((poster) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={poster.src} src={poster.src} alt={poster.alt} loading="lazy" className="h-auto w-full" />
        ))}
      </div>
    </>
  );
}
