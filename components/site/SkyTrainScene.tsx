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

/*
  The same tile at quarter strength (each value x 0.25, so 0–64), for the
  blend path below. It is painted as an ordinary CSS background and added to
  the drawing with mix-blend-mode: plus-lighter, instead of being loaded
  inside the filter with feImage + feTile.
*/
const BAYER_16_QUARTER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAAn0lEQVR42pWSLQ/CQBBE5wAJAQOhYM6U8GEgrYTA//eQAuYMDaV/AnPqmc2u2YyZZPJekKK+inrl/0AeyLhwVNJWSav8F8h2w1hRjaJ++bfIdsNZSUsl7fPfINsNQ+x/I9sNFfavke2GKfb3yHbDFfsPyHZDAP+724cT+M/dPkzA/+P24QL+pduHEfg/3T7U4F+4fZiBf+f24Qb+O68Pf+a+ei3zI/3xAAAAAElFTkSuQmCC";

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

  Safari doesn't render feImage / feTile inside a filter on HTML content, so
  there the drawing showed with no dither at all. Where the browser supports
  mix-blend-mode: plus-lighter (Safari, Chrome, Edge), the threshold tile is
  instead a CSS background added on top of the drawing, and the filters only
  use feComponentTransfer, which Safari handles:

    scene  = 0.75 * c                      (scale filter, leaves room to add)
    sum    = scene + 0.25 * t              (plus-lighter overlay, never > 1)
    out    = quantise(sum * 4/3 - 0.341667)
           = quantise(c + t / 3 - 0.175 - 1/6)   the same maths as above

  Other browsers keep the original single filter.

  The drawing keeps its Figma geometry in a fixed 547x320 box; this wrapper
  scales that box to the column and pauses the loop while it is off-screen.
*/
export default function SkyTrainScene({ children, className = "" }: SkyTrainSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const [blend, setBlend] = useState(false);

  useEffect(() => {
    setBlend(CSS.supports("mix-blend-mode", "plus-lighter"));
  }, []);

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

          {/* Blend path, step 1: scale the drawing to 75% so the tile can be
              added on top without clipping. */}
          <filter id="skytrain-dither-scale" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.75" />
              <feFuncG type="linear" slope="0.75" />
              <feFuncB type="linear" slope="0.75" />
            </feComponentTransfer>
          </filter>

          {/* Blend path, step 2: undo the scale, apply the brightness and
              dither offset, then round to 4 levels. */}
          <filter id="skytrain-dither-quantize" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feComponentTransfer result="biased">
              <feFuncR type="linear" slope="1.333333" intercept="-0.341667" />
              <feFuncG type="linear" slope="1.333333" intercept="-0.341667" />
              <feFuncB type="linear" slope="1.333333" intercept="-0.341667" />
            </feComponentTransfer>
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
        style={{
          aspectRatio: `${W} / ${H}`,
          filter: blend ? "url(#skytrain-dither-quantize)" : "url(#skytrain-dither)",
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            filter: blend ? "url(#skytrain-dither-scale)" : undefined,
          }}
        >
          {children}
        </div>
        {blend && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url("${BAYER_16_QUARTER}")`,
              backgroundSize: "16px 16px",
              imageRendering: "pixelated",
              mixBlendMode: "plus-lighter",
            }}
          />
        )}
      </div>
    </>
  );
}
