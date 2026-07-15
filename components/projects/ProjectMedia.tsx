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
};

export default function ProjectMedia({
  kind,
  src,
  label,
  aspectClass,
  maxWidthClass = "max-w-[1520px]",
  borderClass = "border border-fuori-grey",
  poster,
}: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);

  const frameClass = `relative mx-auto w-full overflow-hidden ${maxWidthClass} ${borderClass} ${aspectClass}`;

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
          controls
          playsInline
          preload="metadata"
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
