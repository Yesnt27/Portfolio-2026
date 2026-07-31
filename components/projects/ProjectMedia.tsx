"use client";

import { useState } from "react";

type ProjectMediaProps = {
  kind: "image" | "video";
  src: string;
  label: string;
  aspectClass: string;
  maxWidthClass?: string;
  borderClass?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

export default function ProjectMedia({
  kind,
  src,
  label,
  aspectClass,
  maxWidthClass = "max-w-[1520px]",
  borderClass = "border border-fuori-grey",
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
}: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);

  /* No mx-auto: Figma left-aligns every media frame inside the content column,
     so callers decide alignment. */
  const frameClass = `relative w-full overflow-hidden ${maxWidthClass} ${borderClass} ${aspectClass}`;

  if (failed) {
    return (
      <div className={frameClass} role="img" aria-label={label}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-4 text-center">
          <span className="font-body text-[clamp(1rem,2vw,1.5rem)] font-medium text-fuori-grey">
            {label}
          </span>
          <code className="font-body text-[clamp(0.75rem,1.5vw,1rem)] text-fuori-grey/70">
            {src}
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      {kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          controls={!autoPlay}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted || autoPlay}
          playsInline
          preload={autoPlay ? "auto" : "metadata"}
          poster={poster}
          aria-label={label}
          onError={() => setFailed(true)}
        >
          <source src={src} />
        </video>
      )}
    </div>
  );
}
