"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";

/*
  Geometry comes straight from the Figma collage (file gp7T0cPbPep5VLlx1dSNk0,
  node 309:95). In the 1920px frame the collage spans x 77..1842 and
  y 3641..5631, so every poster is stored as its raw Figma rect and converted to
  a percentage of that 1765 x 1990 stage. Keeping the numbers in Figma units
  means the whole composition scales as one unit and stays true to the design at
  any stage size.
*/
const ORIGIN_X = 77;
const ORIGIN_Y = 3641;
const STAGE_W = 1765;
const STAGE_H = 1990;

type Poster = {
  src: string;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /*
    Total vertical travel, in px per 1000px of stage height, across a full
    scroll pass. Positive drifts down (reads as further away), negative drifts
    up (closer to the viewer). Every value is distinct so no two posters move
    together.
  */
  speed: number;
};

const { posters } = fuorisaloneImages;

/*
  Ordered bottom-to-top to match Figma's layer stack, so where posters overlap
  they occlude each other the same way they do in the design.
*/
const surrounding: Poster[] = [
  { src: posters.p45, alt: "Poster reference: Emigre 10", x: 77, y: 4674, w: 216, h: 294, speed: 165 },
  { src: posters.p53, alt: "Poster reference: Emigre cover study", x: 357, y: 5249, w: 305, h: 451, speed: 140 },
  { src: posters.p54, alt: "Poster reference: Emigre Mad", x: 726, y: 5158, w: 233, h: 341, speed: -60 },
  { src: posters.p55, alt: "Poster reference: Emigre travel accounts", x: 1499, y: 4114, w: 343, h: 511, speed: 130 },
  { src: posters.p61, alt: "Poster reference: brush lettering study", x: 1469, y: 4983, w: 203, h: 299, speed: 100 },
  { src: posters.p43, alt: "Poster reference: Rant", x: 145, y: 3924, w: 279, h: 439, speed: -95 },
  { src: posters.p46, alt: "Poster reference: Emigre 44", x: 222, y: 4406, w: 271, h: 348, speed: 85 },
  { src: posters.p47, alt: "Poster reference: Emigre Essential", x: 463, y: 3772, w: 217, h: 323, speed: 150 },
  { src: posters.p56, alt: "Poster reference: palm type study", x: 1514, y: 3671, w: 251, h: 370, speed: -70 },
  { src: posters.p60, alt: "Poster reference: Honey Barbara", x: 1315, y: 4432, w: 308, h: 434, speed: -120 },
  { src: posters.p62, alt: "Poster reference: layered exhibition sheet", x: 1275, y: 5329, w: 411, h: 302, speed: -105 },
  { src: posters.p64, alt: "Poster reference: Emigre Magazine spread", x: 1033, y: 3641, w: 411, h: 305, speed: 110 },
];

/* The main showcase piece. Never parallaxes and always sits above the rest. */
const centre = {
  src: fuorisaloneImages.posterFrame100,
  alt: "Fuorisalone 2024 Milan Design Week poster",
  x: 739,
  y: 4277,
  w: 441.411,
  h: 605,
};

const captionRect = { x: 758, y: 4903, w: 404 };

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
      // 0 as the stage's top edge reaches the bottom of the viewport, 1 once its
      // bottom edge has cleared the top. Recentring on 0 lets each poster travel
      // symmetrically either side of its designed position.
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      stage.style.setProperty("--p", String(clamped - 0.5));
      stage.style.setProperty("--u", String(rect.height / 1000));
    };

    const onScroll = () => {
      if (pending) return;
      pending = window.requestAnimationFrame(update);
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
      {/*
        The stage is capped three ways so the composition stays viewable on a
        desktop: by the column, by the 1180px design ceiling, and by viewport
        height. aspect-ratio then locks the Figma proportions, so posters shrink
        together rather than reflowing.
      */}
      <div
        ref={stageRef}
        className="@container relative mx-auto hidden aspect-[1765/1990] md:block"
        style={
          {
            "--p": "0",
            "--u": "1",
            width: "min(100%, 1180px, calc(100vh * 1765 / 1990))",
          } as React.CSSProperties
        }
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
            <Image
              src={poster.src}
              alt={poster.alt}
              fill
              sizes="(max-width: 1280px) 25vw, 320px"
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute z-10" style={frame(centre)}>
          <Image
            src={centre.src}
            alt={centre.alt}
            fill
            sizes="(max-width: 1280px) 30vw, 400px"
            className="object-cover"
          />
        </div>

        <p
          className="absolute z-10 text-center font-body font-medium text-fuori-grey"
          style={{
            left: pct(captionRect.x - ORIGIN_X, STAGE_W),
            top: pct(captionRect.y - ORIGIN_Y, STAGE_H),
            width: pct(captionRect.w, STAGE_W),
            fontSize: "clamp(0.6875rem, 1.7cqw, 1.875rem)",
          }}
        >
          {caption}
        </p>
      </div>

      {/*
        Absolute positioning would leave the posters unreadably small on a phone,
        so narrow screens get the same images as a plain grid with the showcase
        piece leading.
      */}
      <div className="grid grid-cols-2 gap-flow-xs md:hidden">
        <div className="col-span-2 mx-auto w-2/3">
          <Image
            src={centre.src}
            alt={centre.alt}
            width={centre.w}
            height={centre.h}
            className="h-auto w-full object-cover"
            sizes="66vw"
          />
        </div>
        <p className="col-span-2 text-center font-body text-[clamp(0.875rem,3.5vw,1.125rem)] font-medium text-fuori-grey">
          {caption}
        </p>
        {surrounding.map((poster) => (
          <Image
            key={poster.src}
            src={poster.src}
            alt={poster.alt}
            width={poster.w}
            height={poster.h}
            className="h-auto w-full object-cover"
            sizes="45vw"
          />
        ))}
      </div>
    </>
  );
}
