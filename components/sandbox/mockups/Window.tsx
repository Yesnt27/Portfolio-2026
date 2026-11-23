import type { CSSProperties } from "react";
import type { SandboxItem } from "@/lib/sandbox";

/*
  MOCKUP ONLY (branch claude/sandbox-window-mockups).
  One minimized sandbox box, after Figma 709:848: a white window with a grey
  title bar ("---") and the piece's media on a mat. Every window is the same
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
  demoHover = false,
  className = "",
  style,
}: {
  item: SandboxItem;
  /* Width / height of the whole window, title bar included. */
  ratio: number;
  titled?: boolean;
  /* Pin the hover state on, so a still mockup can show it. */
  demoHover?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <figure
      className={`mk-win ${className}`}
      data-demo-hover={demoHover ? "" : undefined}
      style={{ aspectRatio: ratio, ...style }}
    >
      <figcaption className="mk-bar">
        <span aria-hidden="true">---</span>
        {titled && (
          <>
            <span className="truncate">{item.title}</span>
            <span className="ml-auto text-muted">{item.year}</span>
          </>
        )}
      </figcaption>
      <div className="mk-body" style={item.mat ? { background: item.mat } : undefined}>
        {shots(item).map((shot) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={shot.src} src={shot.src} alt={shot.alt} />
        ))}
      </div>
    </figure>
  );
}
