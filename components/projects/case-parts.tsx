import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import CaseToc, { type TocItem } from "@/components/projects/CaseToc";
import AutoVideo, { type VideoSource } from "@/components/ui/AutoVideo";
import Reveal from "@/components/ui/Reveal";
import { fx } from "@/lib/frame";
import "./case.css";

/*
  Building blocks shared by the case studies (Figma frames 571:90 sol and
  515:157 fuorisalone).
*/

/* Full-bleed opener. Figma draws it wider than the 1512 frame, so at 1512 you
   see a 1512 x ~965 window onto it; past 1716px it stops and gets a border. */
export function CaseHero({
  sources,
  poster,
  label,
}: {
  sources: VideoSource[];
  poster?: string;
  label: string;
}) {
  return (
    <figure className="relative mx-auto aspect-[1512/965] w-full overflow-hidden border-y-[3px] border-white bg-black min-[1716px]:aspect-[1716/965] min-[1716px]:max-w-[1716px] min-[1716px]:border-x-[3px]">
      <AutoVideo eager sources={sources} poster={poster} label={label} className="absolute inset-0 size-full object-cover" />
    </figure>
  );
}

/* Content area with the sticky contents rail in the left margin (xl and up). */
export function CaseShell({ toc, children }: { toc: TocItem[]; children: ReactNode }) {
  return (
    <div className="relative mx-auto max-w-frame">
      <aside className="pointer-events-none absolute inset-y-0 left-0 hidden w-[200px] xl:block">
        <CaseToc items={toc} className="pointer-events-auto sticky top-[118px] ml-[34px] mt-[38px]" />
      </aside>
      {children}
    </div>
  );
}

/* A contents-rail section: the rail tracks it while it crosses mid-screen. */
export function TocSection({ id, label, children }: { id: string; label?: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-28">
      {children}
    </section>
  );
}

/* A block that starts at a Figma x-offset on desktop and a plain gutter on phones. */
export function Indent({
  x,
  children,
  className = "",
  as: Tag = "div",
  reveal = true,
}: {
  x: number;
  children: ReactNode;
  className?: string;
  as?: "div" | "header";
  reveal?: boolean;
}) {
  const style = { ["--x" as string]: fx(x) } as CSSProperties;
  const classes = `px-5 md:pl-(--x) md:pr-[clamp(20px,6vw,96px)] ${className}`;
  if (!reveal) {
    return (
      <Tag className={classes} style={style}>
        {children}
      </Tag>
    );
  }
  return (
    <Reveal as={Tag} className={classes} style={style}>
      {children}
    </Reveal>
  );
}

export function MetaGrid({
  columns,
  template,
}: {
  columns: { label: string; value: ReactNode }[];
  /* Column starts from the Figma frame, e.g. "429fr 319fr 1fr". */
  template: string;
}) {
  return (
    <dl className="grid gap-x-6 gap-y-8 sm:[grid-template-columns:var(--meta)]" style={{ ["--meta" as string]: template }}>
      {columns.map((column) => (
        <div key={column.label}>
          <dt className="font-pixel text-[16.5px] leading-[normal] text-muted">{column.label}</dt>
          <dd className="mt-[34px] font-mono text-[16.5px] leading-[normal] text-copy">{column.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* An image cropped exactly like its Figma image fill (percent offsets of the box). */
export function CropImage({
  src,
  alt,
  ratio,
  crop,
  className = "",
  imgClassName = "",
  sizes,
  width,
  height,
}: {
  src: string;
  alt: string;
  ratio: string;
  crop?: { left: string; top: string; width: string; height: string };
  className?: string;
  imgClassName?: string;
  sizes?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`absolute max-w-none ${crop ? "" : "inset-0 size-full object-cover"} ${imgClassName}`}
        style={crop}
      />
    </div>
  );
}

/* Section video in a light frame (Fuorisalone flows) or bare. */
export function CaseVideo({
  sources,
  poster,
  label,
  ratio = "1028 / 579",
  className = "",
}: {
  sources: VideoSource[];
  poster?: string;
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-mat ${className}`} style={{ aspectRatio: ratio }}>
      <AutoVideo sources={sources} poster={poster} label={label} className="absolute inset-0 size-full object-cover" />
    </div>
  );
}

/* Hairline that fades out at both ends, as in the Figma "Mask group" lines. */
function FadeLine({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute w-px [filter:drop-shadow(0_4px_2px_rgb(0_0_0/0.25))] ${className}`}
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, var(--color-ink) 37.5%, var(--color-ink) 64.4%, transparent 100%)",
      }}
    />
  );
}

/*
  "Next project" (Figma 571:169–571:185 / 561:140–562:166): label at x=127,
  a full-bleed rule, a 1245 x 650 white card with the next case study playing
  in it, another rule. Two fading hairlines frame the block at x=78 / x=1412.
*/
export function NextProject({
  href,
  title,
  sources,
  poster,
}: {
  href: string;
  title: string;
  sources: VideoSource[];
  poster?: string;
}) {
  return (
    <section aria-labelledby="next-project" className="relative">
      <div aria-hidden="true" className="absolute inset-x-0 -top-[430px] bottom-[-120px] max-md:hidden">
        <div className="relative mx-auto h-full max-w-frame">
          <FadeLine className="inset-y-0 left-[5.16%]" />
          <FadeLine className="inset-y-0 left-[93.39%]" />
        </div>
      </div>

      <div className="mx-auto max-w-frame px-5 md:pl-[clamp(20px,8.4vw,127px)]">
        <Link
          id="next-project"
          href={href}
          className="group inline-flex items-center gap-2 font-pixel text-[16.5px] leading-[normal] text-ink"
        >
          Next project
          <span aria-hidden="true" className="transition-transform duration-300 ease-snap group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
      <div className="mt-[34px] border-t border-line" />
      <div className="mx-auto max-w-frame px-5 py-[34px] md:pl-[clamp(20px,8.4vw,127px)]">
        <Link
          href={href}
          aria-label={`Next project: ${title}`}
          className="group relative block aspect-[1245/650] w-full max-w-[1245px] overflow-hidden rounded-[12px] bg-mat"
        >
          <AutoVideo
            sources={sources}
            poster={poster}
            label={`${title} preview`}
            className="absolute inset-0 size-full scale-[1.04] object-cover transition-transform duration-700 ease-snap group-hover:scale-[1.07]"
          />
          <span className="absolute bottom-4 left-4 bg-paper px-3 py-2 font-pixel text-[16.5px] leading-[normal] text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            {title} →
          </span>
        </Link>
      </div>
      <div className="border-t border-line" />
    </section>
  );
}
