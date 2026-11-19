"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./skytrain.css";

/* Native size of the Figma "drawing" node. */
const W = 547.106;
const H = 320;

/*
  16x16 Bayer threshold tile, generated with the same recursion as the Figma
  dither shader (CodeComponentId_55a4ca85…: bayerMatrix(), values (m + 0.5) / 256),
  stored 2x so one tile maps 1:1 onto device pixels on retina screens.
*/
const BAYER_16 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAAZElEQVR42u3SMQqDAAADwKstuLh16NJH9A8OLm4OQvEBjn1CntKn9GldnAR1c9FACFlCCLkQXzFO+p75wgZuP7HG7YSPeIkl3aPDUwyiEq2Y+6PsUIpGPEQvrqIWd9GdfzjaH/5HWYKwmwdFbwAAAABJRU5ErkJggg==";

type SkyTrainSceneProps = {
  children: ReactNode;
  className?: string;
};

/*
  Figma renders this drawing through its dither ShaderEffect (Bayer 16x16,
  4 levels per channel, brightness 65, contrast 1). That runtime needs the
  experimental HTML-in-Canvas API, so the same maths runs here as an SVG
  filter instead, which every current browser supports:

    lit   = clamp(c + (65 - 100) / 200)          brightness -> -0.175
    out   = round((lit + (t - 0.5) / 3) * 3) / 3  ordered quantise, 4 levels

  The drawing keeps its Figma geometry in a fixed 547x320 box; this wrapper
  scales that box to the column and pauses the loop while it is off-screen.
*/
export default function SkyTrainScene({ children, className = "" }: SkyTrainSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const resize = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / W);
    });
    const view = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "160px 0px",
    });

    resize.observe(frame);
    view.observe(frame);
    return () => {
      resize.disconnect();
      view.disconnect();
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="pointer-events-none absolute">
        <defs>
          <filter
            id="skytrain-dither"
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feComponentTransfer in="SourceGraphic" result="lit">
              <feFuncR type="linear" slope="1" intercept="-0.175" />
              <feFuncG type="linear" slope="1" intercept="-0.175" />
              <feFuncB type="linear" slope="1" intercept="-0.175" />
            </feComponentTransfer>
            <feImage
              href={BAYER_16}
              x="0"
              y="0"
              width="16"
              height="16"
              preserveAspectRatio="none"
              result="cell"
              style={{ imageRendering: "pixelated" }}
            />
            <feTile in="cell" result="bayer" />
            <feComposite
              in="lit"
              in2="bayer"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="0.333333"
              k4="-0.166667"
              result="biased"
            />
            <feComponentTransfer in="biased">
              <feFuncR type="discrete" tableValues="0 0.333333 0.333333 0.666667 0.666667 1" />
              <feFuncG type="discrete" tableValues="0 0.333333 0.333333 0.666667 0.666667 1" />
              <feFuncB type="discrete" tableValues="0 0.333333 0.333333 0.666667 0.666667 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div
        ref={frameRef}
        role="img"
        aria-label="Animated pixel drawing of Kenny riding the SkyTrain through Vancouver at dusk"
        data-skytrain-paused={visible ? undefined : ""}
        className={`relative w-full overflow-hidden ${className}`}
        style={{ aspectRatio: `${W} / ${H}`, filter: "url(#skytrain-dither)" }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
