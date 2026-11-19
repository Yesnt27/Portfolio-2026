"use client";

import { useEffect, useRef } from "react";
import AutoVideo from "@/components/ui/AutoVideo";
import type { SandboxItem } from "@/lib/sandbox";

type VideoMedia = Extract<SandboxItem["media"], { kind: "video" }>;

/*
  The zoomed-in video, the only place a piece plays with sound. Opening the
  lightbox is a click, which lets browsers start it unmuted; if one still
  refuses, it plays muted instead of sitting paused, and the controls can
  turn the sound on.
*/
function LightboxVideo({ media }: { media: VideoMedia }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let live = true;
    video.muted = false;
    video.play().catch((error: DOMException) => {
      /* Only an autoplay refusal; a play() cut short by closing isn't one. */
      if (!live || error.name !== "NotAllowedError") return;
      video.muted = true;
      video.play().catch(() => {});
    });
    return () => {
      live = false;
      video.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      controls
      loop
      playsInline
      poster={media.poster}
      aria-label={media.alt}
      className="size-full bg-black object-contain"
    >
      {media.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}

type SandboxMediaProps = {
  item: SandboxItem;
  /* How the piece is shown: grid card, shuffle pile, or full-size lightbox. */
  mode: "index" | "pile" | "lightbox";
  /* Pile: only the top card's video runs, the rest show their poster. */
  playing?: boolean;
  sizes?: string;
  className?: string;
};

/*
  A sandbox piece in its mat. Figma draws every piece with a 15px white
  border (cream for the duotone River); the Palace pair shares one white mat.
*/
export default function SandboxMedia({ item, mode, playing = true, sizes = "50vw", className = "" }: SandboxMediaProps) {
  const { media } = item;
  const matColor = item.mat ? { borderColor: item.mat, backgroundColor: item.mat } : undefined;
  const mat = `border-[clamp(8px,1vw,15px)] ${item.mat ? "" : "border-mat bg-mat"}`;

  if (media.kind === "pair") {
    return (
      <div className={`grid grid-cols-2 gap-[2.98%] bg-mat p-[3.13%] ${className}`}>
        {media.images.map((image) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.src}
            src={image.src}
            srcSet={image.srcSet}
            sizes={mode === "lightbox" ? "45vw" : sizes}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={mode === "lightbox" ? "eager" : "lazy"}
            decoding="async"
            className="aspect-[286/382] size-full object-cover"
          />
        ))}
      </div>
    );
  }

  if (media.kind === "image") {
    return (
      <div className={`${mat} ${className}`} style={matColor}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          srcSet={media.srcSet}
          sizes={mode === "lightbox" ? "90vw" : sizes}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading={mode === "lightbox" ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
        />
      </div>
    );
  }

  if (mode === "lightbox") {
    return (
      <div className={`${mat} ${className}`}>
        <LightboxVideo media={media} />
      </div>
    );
  }

  /* Grid and pile previews are always muted (AutoVideo); sound is for the lightbox. */
  return (
    <div className={`relative ${mat} ${className}`}>
      {playing ? (
        <AutoVideo
          sources={media.sources}
          poster={media.poster}
          label={media.alt}
          className="absolute inset-0 size-full bg-black object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.poster} alt={media.alt} loading="lazy" className="absolute inset-0 size-full bg-black object-cover" />
      )}
    </div>
  );
}
