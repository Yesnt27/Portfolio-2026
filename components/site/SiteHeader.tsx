"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SuitNav from "@/components/site/SuitNav";
import ThemeToggle from "@/components/site/ThemeToggle";
import type { NavKey } from "@/lib/site";

type SiteHeaderProps = {
  active?: NavKey;
  /* Case-study frames use the shorter 97px bar from the start. */
  compact?: boolean;
  /* Hide the theme switch where a page places its own. */
  showToggle?: boolean;
};

/*
  Figma frames 493:5454 / 645:2308: "Kenny Nguyen" (Departure Mono 30) left,
  card-suit nav right, a 2px #363636 rule at y=128. Fixed rather than sticky:
  the spacer below keeps its full height, so shrinking the bar on scroll never
  shifts the page underneath it.

  No backdrop-filter on the scrolled bar: blurring what's behind it makes the
  GPU re-read the full-screen dither canvas (which redraws while scrolling)
  on every frame. On some Windows GPU drivers that read goes stale and the
  page smears and ghosts while scrolling. A near-opaque paper fill reads the
  same without that cost.
*/
export default function SiteHeader({ active, compact = false, showToggle = true }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tight = compact || scrolled;

  return (
    <>
      <header
        data-scrolled={scrolled ? "" : undefined}
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color] duration-500 ${
          scrolled ? "bg-paper/95" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-frame items-center justify-between pl-[clamp(20px,4.1vw,62px)] pr-[clamp(20px,3.4vw,51px)] transition-[height] duration-500 ease-snap ${
            tight ? "h-[76px]" : "h-[126px]"
          }`}
        >
          <Link
            href="/"
            className={`rise-in font-pixel leading-[normal] text-copy transition-[font-size,color] duration-500 ease-snap hover:text-ink ${
              tight ? "text-[24px]" : "text-[clamp(22px,2vw,30px)]"
            }`}
          >
            Kenny Nguyen
          </Link>
          <SuitNav active={active} className="rise-in [--rise-delay:80ms]" />
        </div>
        <div className="h-[2px] bg-line-strong" />
      </header>

      <div aria-hidden="true" className={compact ? "h-[78px]" : "h-[128px]"} />

      {showToggle && (
        <div className="relative mx-auto max-w-frame">
          <div className="absolute right-[clamp(20px,3.4vw,51px)] top-[clamp(20px,4.1vw,62px)] z-10 max-sm:origin-top-right max-sm:scale-75">
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
