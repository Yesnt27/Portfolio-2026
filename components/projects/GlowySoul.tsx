import AutoVideo from "@/components/ui/AutoVideo";
import { solImages } from "@/lib/sol-images";

/*
  Glowy Soul (Figma 689:2123 "planet 1", 739 x 722): four soft colour globs
  that drift, morph and shift colour inside Sol's rings, as a seamless 12s
  loop.

  Three layers, so the page stays light:
  - the video holds only the soft globs (smooth gradients compress to ~100 KB);
  - the rings are drawn here, so they stay sharp at any size. They sit where
    the Figma frame has them: centred at (373, 360), radii 346 / 286 / 220;
  - film grain is a small noise tile blended over the top.
  The bright middle ring's highlight turns once every 12s, like the original.
*/
const RINGS = { cx: 373, cy: 360, outer: 346, middle: 286, inner: 220 };
const W = 739;
const H = 722;

export default function GlowySoul({ className = "" }: { className?: string }) {
  const { cx, cy, middle } = RINGS;
  return (
    <figure className={`glowy-soul relative isolate aspect-[739/722] w-full max-w-[739px] overflow-hidden bg-[#1b1b1b] ${className}`}>
      <AutoVideo
        sources={[...solImages.glowySoul.sources]}
        poster={solImages.glowySoul.poster}
        label="Sol's mind visual: soft colour globs drifting, morphing and changing colour inside three rings"
        className="absolute inset-0 size-full object-cover"
      />
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full mix-blend-screen">
        <circle cx={cx} cy={cy} r={RINGS.outer} fill="none" stroke="rgb(77 77 77)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <circle cx={cx} cy={cy} r={RINGS.inner} fill="none" stroke="rgb(41 41 41)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        aria-hidden="true"
        className="glowy-ring pointer-events-none absolute mix-blend-screen"
        style={{
          left: `${((cx - middle) / W) * 100}%`,
          top: `${((cy - middle) / H) * 100}%`,
          width: `${((middle * 2) / W) * 100}%`,
          height: `${((middle * 2) / H) * 100}%`,
        }}
      />
      <span aria-hidden="true" className="glowy-grain pointer-events-none absolute inset-0 mix-blend-overlay" />
    </figure>
  );
}
