"use client";

import { useState } from "react";
import "./player.css";

const art = "/images/about";

/*
  "Now playing" card from Figma frame 493:5454 (nodes 652:108–652:137).
  406 x 413 panel in grey-2 with a #4e4e4e keyline; album art fades into the
  panel through the Figma gradient mask (Frame 155); the three slate bars,
  title and #acacac transport buttons sit on one row underneath.
  Visual only: no audio ships with the site.
*/
export default function MusicPlayer({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const [skip, setSkip] = useState<"prev" | "next" | null>(null);

  const skipTo = (direction: "prev" | "next") => {
    setSkip(null);
    /* restart the animation even on repeated clicks */
    requestAnimationFrame(() => setSkip(direction));
  };

  return (
    <figure
      className={`player w-full max-w-[406px] border border-line bg-muted px-[16px] pb-[15px] pt-[7px] ${className}`}
      data-playing={playing ? "" : undefined}
    >
      <div
        className="player-art relative aspect-[374/330] w-full overflow-hidden"
        data-skip={skip ?? undefined}
        onAnimationEnd={() => setSkip(null)}
        style={{
          maskImage: `url("${art}/album-fade-mask.svg")`,
          WebkitMaskImage: `url("${art}/album-fade-mask.svg")`,
          maskSize: "152.4% 151.8%",
          WebkitMaskSize: "152.4% 151.8%",
          maskPosition: "51.5% 48.5%",
          WebkitMaskPosition: "51.5% 48.5%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${art}/album-backdrop.svg`} alt="" className="absolute inset-0 size-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${art}/album-love.webp`}
          alt="Album art for Love. by wave to earth"
          width={748}
          height={660}
          className="player-cover absolute inset-0 size-full object-cover"
        />
      </div>

      <figcaption className="mt-[12.6px] flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-[15px] pl-[9px]">
          <span aria-hidden="true" className="player-bars relative block h-[35px] w-[46px] shrink-0">
            <span className="absolute left-0 top-0 h-[9px] w-[35px] bg-slate" />
            <span className="absolute left-[11px] top-[13px] h-[9px] w-[35px] bg-slate" />
            <span className="absolute left-0 top-[26px] h-[9px] w-[35px] bg-slate" />
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-[24px] font-medium leading-[normal] text-ink">Love.</span>
            <span className="block truncate font-sans text-[12px] leading-[normal] text-ink">Wave to earth</span>
          </span>
        </div>

        <div className="flex shrink-0 gap-[7px]">
          <button
            type="button"
            aria-label="Previous track"
            onClick={() => skipTo("prev")}
            className="player-btn grid h-[48px] w-[51px] place-items-center bg-control"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${art}/player-prev.svg`} alt="" width={18} height={16} className="-scale-x-100" />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            aria-pressed={playing}
            onClick={() => setPlaying((value) => !value)}
            className="player-btn grid h-[48px] w-[51px] place-items-center bg-control"
          >
            {playing ? (
              <span aria-hidden="true" className="flex h-[17px] gap-[5px]">
                <span className="w-[5px] bg-[#1c1c1c]" />
                <span className="w-[5px] bg-[#1c1c1c]" />
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${art}/player-play.svg`} alt="" width={21} height={17} className="rotate-90" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={() => skipTo("next")}
            className="player-btn grid h-[48px] w-[51px] place-items-center bg-control"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${art}/player-next.svg`} alt="" width={18} height={16} />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
