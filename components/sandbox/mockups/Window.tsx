import type { CSSProperties, ReactNode } from "react";
import type { SandboxItem } from "@/lib/sandbox";

/*
  MOCKUP ONLY (branch claude/sandbox-window-mockups).
  One minimized sandbox box, after Figma 709:848: a white window with the
  piece's media on a mat and a grey bar. A, B and C use the first version
  of the bar: thin, with a "---". C2 uses the newer "label" bar from
  709:848: taller, no "---", holding the title and year. Either can sit on
  top or at the bottom (barAt). Every window is the same
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
  labelBar = false,
  caption,
  demoHover = false,
  className = "",
  style,
}: {
  item: SandboxItem;
  /* Width / height of the whole window, title bar included. */
  ratio: number;
  titled?: boolean;
  /* Where the bar sits: above the media (default) or under it. */
  barAt?: "top" | "bottom";
  /* The newer 709:848 bar: taller, no "---", holds the title and year. */
  labelBar?: boolean;
  /* Replaces the bar's default title/year text (C2's glitch reveal). */
  caption?: ReactNode;
  /* Pin the hover state on, so a still mockup can show it. */
  demoHover?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const bar = (
    <figcaption className={labelBar ? "mk-bar mk-bar-label" : "mk-bar"}>
      {!labelBar && <span aria-hidden="true">---</span>}
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
