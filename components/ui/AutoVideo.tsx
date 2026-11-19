"use client";

import { useEffect, useRef, useState } from "react";

export type VideoSource = { src: string; type?: string };

type AutoVideoProps = {
  sources: VideoSource[];
  poster?: string;
  label: string;
  className?: string;
  /* Start loading immediately (above-the-fold heroes) instead of on approach. */
  eager?: boolean;
};

/*
  Muted, looping preview video that only plays while on screen, so a page of
  previews never decodes more than what you can see. List AV1 first: browsers
  that can't decode it fall through to the H.264 source. With
  prefers-reduced-motion it shows the poster and plays only when clicked.
*/
export default function AutoVideo({ sources, poster, label, className = "", eager = false }: AutoVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [userPlaying, setUserPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay can be refused (e.g. data saver); the poster stays up */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload={eager ? "auto" : "metadata"}
        poster={poster}
        aria-label={label}
        className={className}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
      {reduced && !userPlaying && (
        <button
          type="button"
          onClick={() => {
            setUserPlaying(true);
            ref.current?.play().catch(() => {});
          }}
          className="absolute inset-0 grid place-items-center bg-black/20 font-pixel text-[16.5px] text-white"
        >
          <span className="bg-black/60 px-3 py-2">▶ Play preview</span>
        </button>
      )}
    </>
  );
}
