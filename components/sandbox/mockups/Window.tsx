import type { CSSProperties, ReactNode } from "react";
import type { SandboxItem } from "@/lib/sandbox";

/*
  MOCKUP ONLY (branch claude/sandbox-window-mockups).
  One minimized sandbox box, after Figma 709:848: a white window with the
  piece's media on a mat and a grey bar. The bar sits on top with a "---"
  (A, B, C), or at the bottom holding the title and year (C2, the newer
  version of 709:848). Every window is the same
  size; the media is cropped (object-fit: cover) to fill it, and a pair (the
  Palace day/night set) splits the body into two halves like the Figma frame.
  Videos show their poster frame here.
*/

const shots = (item: SandboxItem) => {
  const m = item.media;
  if (m.kind === "pair") return m.images.map(({ src, alt }) => ({ src, alt }));
  return [{ src: m.kind === "video" ? m.poster : m.src, alt: m.alt }];
};

export default function Window({
  item,
  ratio,
  titled = false,
  barAt = "top",
  caption,
  demoHover = false,
  className = "",
  style,
}: {
  item: SandboxItem;
  /* Width / height of the whole window, title bar included. */
  ratio: number;
  titled?: boolean;
  /* "bottom": the bar sits under the media and drops the "---". */
  barAt?: "top" | "bottom";
  /* Replaces the bar's default title/year text (C2's glitch reveal). */
  caption?: ReactNode;
  /* Pin the hover state on, so a still mockup can show it. */
  demoHover?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const bar = (
    <figcaption className={barAt === "bottom" ? "mk-bar mk-bar-bottom" : "mk-bar"}>
      {barAt === "top" && <span aria-hidden="true">---</span>}
      {caption ??
        (titled && (
          <>
            <span className="mk-title truncate">{item.title}</span>
            <span className="mk-title ml-auto text-muted">{item.year}</span>
          </>
        ))}
    </figcaption>
  );

  return (
    <figure
      className={`mk-win ${className}`}
      data-demo-hover={demoHover ? "" : undefined}
      style={{ aspectRatio: ratio, ...style }}
    >
      {barAt === "top" && bar}
      <div className="mk-body" style={item.mat ? { background: item.mat } : undefined}>
        {shots(item).map((shot) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={shot.src} src={shot.src} alt={shot.alt} />
        ))}
      </div>
      {barAt === "bottom" && bar}
    </figure>
  );
}
