import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Window from "@/components/sandbox/mockups/Window";
import "@/components/sandbox/mockups/mockups.css";
import SiteHeader from "@/components/site/SiteHeader";
import { sandboxItems, type SandboxItem } from "@/lib/sandbox";

/*
  MOCKUP ONLY (branch claude/sandbox-window-mockups) — not linked from the
  site. Three layouts for the sandbox SHUFFLE view where every piece sits in
  its own same-size window (Figma 709:127 layout, 709:848 window). All sizes
  below are on the 1512px frame and scale with the viewport.
*/

const FRAME = 1512;
const byId = new Map(sandboxItems.map((item) => [item.id, item]));
const pick = (ids: string[]) => ids.map((id) => byId.get(id)!) as SandboxItem[];

/* Mixed so neighbours differ in shape and colour. */
const ORDER = pick([
  "portals",
  "guernica",
  "concert-lights",
  "golden-sunrise",
  "palace",
  "vsa-intros",
  "river",
  "friends-galore",
]);

const VARIANTS = {
  a: { name: "Tilted rows", size: "every box 380 × 262" },
  b: { name: "Clean grid", size: "every box 314 × 217" },
  c: { name: "Staggered portrait", size: "every box 290 × 372" },
} as const;
type Variant = keyof typeof VARIANTS;

export const generateStaticParams = () => Object.keys(VARIANTS).map((variant) => ({ variant }));

type Props = { params: Promise<{ variant: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { variant } = await params;
  const v = VARIANTS[variant as Variant];
  return { title: v ? `Sandbox mockup ${variant.toUpperCase()}: ${v.name}` : "Sandbox mockup", robots: { index: false } };
}

/* A: two loose rows like Figma 709:127, but every window the same size. */
const A_STAGE = { w: FRAME, h: 720 };
const A_BOX = { w: 380, h: 262 };
const A_SPOTS = [
  { cx: 222, cy: 250, r: -3.5 },
  { cx: 578, cy: 236, r: 2 },
  { cx: 934, cy: 258, r: -1.5 },
  { cx: 1290, cy: 242, r: 3 },
  { cx: 268, cy: 520, r: 2.5 },
  { cx: 624, cy: 534, r: -3 },
  { cx: 980, cy: 512, r: 3.5 },
  { cx: 1336, cy: 528, r: -2 },
];

function TiltedRows() {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${A_STAGE.w} / ${A_STAGE.h}` }}>
      {ORDER.map((item, i) => {
        const s = A_SPOTS[i];
        return (
          <Window
            key={item.id}
            item={item}
            ratio={A_BOX.w / A_BOX.h}
            className="absolute"
            style={{
              width: `${(A_BOX.w / A_STAGE.w) * 100}%`,
              left: `${((s.cx - A_BOX.w / 2) / A_STAGE.w) * 100}%`,
              top: `${((s.cy - A_BOX.h / 2) / A_STAGE.h) * 100}%`,
              transform: `rotate(${s.r}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

/* B: a straight 4 x 2 grid; the title bar carries the caption. */
function CleanGrid() {
  return (
    <div className="mx-auto grid max-w-[1352px] grid-cols-2 gap-[clamp(16px,1.85vw,28px)] px-[clamp(16px,5.3vw,80px)] md:grid-cols-4">
      {ORDER.map((item, i) => (
        <Window
          key={item.id}
          item={item}
          ratio={314 / 217}
          titled
          className="mk-lift"
          demoHover={i === 1}
        />
      ))}
    </div>
  );
}

/* C: portrait windows; even columns drop down, each with a slight tilt. */
const C_TILT = [-1.5, 1.2, -0.8, 1.6, 1, -1.4, 1.5, -1];

function StaggeredPortrait() {
  return (
    <div className="mx-auto grid max-w-[1352px] grid-cols-2 gap-x-[clamp(16px,2.6vw,40px)] gap-y-[clamp(20px,2.6vw,40px)] px-[clamp(16px,7vw,106px)] pb-[clamp(30px,4vw,60px)] md:grid-cols-4">
      {ORDER.map((item, i) => (
        <Window
          key={item.id}
          item={item}
          ratio={290 / 372}
          style={{
            transform: `translateY(${i % 2 ? "clamp(20px, 4vw, 60px)" : "0px"}) rotate(${C_TILT[i]}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default async function SandboxMockupPage({ params }: Props) {
  const { variant } = await params;
  const v = VARIANTS[variant as Variant];
  if (!v) notFound();

  return (
    <>
      <SiteHeader active="sandbox" />
      <main id="main" className="mx-auto max-w-frame overflow-x-clip">
        <h1 className="flex flex-wrap items-baseline gap-x-4 px-[clamp(16px,2.98vw,45px)] pt-[clamp(24px,3vw,44px)] font-pixel text-[16px] text-ink">
          <span>MOCKUP {variant.toUpperCase()}</span>
          <span className="text-copy">{v.name}</span>
          <span className="text-muted">({v.size})</span>
        </h1>

        <div className="mt-[clamp(28px,4vw,60px)]">
          {variant === "a" && <TiltedRows />}
          {variant === "b" && <CleanGrid />}
          {variant === "c" && <StaggeredPortrait />}
        </div>

        {/* Shuffle control, after Figma 709:127. */}
        <div className="mt-[clamp(32px,4.5vw,68px)] flex flex-col items-center font-pixel text-ink">
          <p className="text-[16px] text-muted">Click to shuffle</p>
          <p aria-hidden="true" className="mt-2 text-[16px] text-muted">↓</p>
          <div className="mt-3 flex items-center gap-[19px] text-[24px] leading-[normal]">
            <span className="grid h-[64px] w-[80px] place-items-center bg-card">←</span>
            <span className="grid h-[66px] min-w-[162px] place-items-center bg-card px-4">SHUFFLE</span>
            <span className="grid h-[64px] w-[80px] place-items-center bg-card">→</span>
          </div>
        </div>
        <div aria-hidden="true" className="h-[clamp(56px,7.6vw,115px)]" />
      </main>
    </>
  );
}
