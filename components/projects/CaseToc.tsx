"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/*
  Case-study contents rail (Figma 571:352 / 571:353). The glyph strip in the
  frame is Departure Mono's own ♦ (current) and ✧ (others), so the markers are
  live text: the diamond follows whichever section crosses the middle of the
  viewport.
*/
export default function CaseToc({ items, className = "" }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    /* The current section is the last one whose top has passed mid-screen;
       above the first section (title block) the first item stays current. */
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let current = items[0]?.id;
      for (const item of items) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className={className}>
      <ul className="flex flex-col gap-[9px] font-pixel text-[16.5px] leading-[normal]">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`group flex items-center gap-[11px] transition-colors duration-300 ${
                  current ? "text-ink" : "text-copy hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block w-[11px] text-ink transition-transform duration-300 ease-snap ${
                    current ? "scale-110" : "group-hover:rotate-45"
                  }`}
                >
                  {current ? "♦" : "✧"}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
