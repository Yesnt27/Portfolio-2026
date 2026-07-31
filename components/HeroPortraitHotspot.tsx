"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { homeImages } from "@/lib/home-images";

const CURSOR_SIZE = 220;

export default function HeroPortraitHotspot() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current !== null) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, []);

  return (
    <>
      <Link
        href="/about"
        aria-label="About Me"
        className="absolute z-10 cursor-none"
        style={{
          /* Hotspot over the main figure in the 1920×1080 hero drawing */
          left: "40%",
          top: "8%",
          width: "20%",
          height: "90%",
        }}
        onMouseEnter={(event) => {
          if (hideTimer.current !== null) {
            window.clearTimeout(hideTimer.current);
            hideTimer.current = null;
          }
          setPos({ x: event.clientX, y: event.clientY });
          setActive(true);
          requestAnimationFrame(() => setVisible(true));
        }}
        onMouseLeave={() => {
          setVisible(false);
          hideTimer.current = window.setTimeout(() => {
            setActive(false);
            hideTimer.current = null;
          }, 720);
        }}
        onMouseMove={(event) => {
          setPos({ x: event.clientX, y: event.clientY });
        }}
      />

      {active && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[60] overflow-hidden rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-700 ease-in-out will-change-transform"
          style={{
            width: CURSOR_SIZE,
            height: CURSOR_SIZE,
            left: pos.x,
            top: pos.y,
            transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.88})`,
            opacity: visible ? 1 : 0,
          }}
        >
          <Image
            src={homeImages.kennySmile}
            alt=""
            width={CURSOR_SIZE}
            height={CURSOR_SIZE}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      )}
    </>
  );
}
