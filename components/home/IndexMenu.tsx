"use client";

import Link from "next/link";
import { useState } from "react";
import { resume } from "@/lib/site";

const items = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "/about" },
  { label: "RESUME", href: resume.href, external: true },
  { label: "SANDBOX", href: "/sandbox" },
];

const ROW = 33; /* Figma: items at y = 204, 237, 270, 303 */

/*
  Home index (Figma 507:6956–507:6960): "→" marks WORK, the section you are
  on. Hovering or focusing another item glides the arrow to it and nudges the
  label over, the same 26px indent WORK has in the frame.
*/
export default function IndexMenu({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);

  return (
    <nav aria-label="Index" className={className}>
      <ul className="relative font-pixel text-[20px] leading-[normal] text-ink" onMouseLeave={() => setActive(0)}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 transition-transform duration-300 ease-snap"
          style={{ transform: `translateY(${active * ROW}px)` }}
        >
          →
        </span>
        {items.map((item, index) => {
          const props = {
            onMouseEnter: () => setActive(index),
            onFocus: () => setActive(index),
            onBlur: () => setActive(0),
            className: "inline-block transition-transform duration-300 ease-snap",
            style: { transform: `translateX(${active === index ? 26 : 0}px)` },
          };
          return (
            <li key={item.label} style={{ height: ROW }}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" {...props}>
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} aria-current={index === 0 ? "location" : undefined} {...props}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
