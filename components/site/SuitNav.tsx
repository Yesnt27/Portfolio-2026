"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { navItems, resume, type NavKey } from "@/lib/site";

type SuitNavProps = {
  active?: NavKey;
  /* "labels": glyph + word (inner pages). "icons": glyphs only (home header). */
  variant?: "labels" | "icons";
  className?: string;
};

function Glyph({ glyph, size }: { glyph: string; size: number }) {
  return (
    <span
      aria-hidden="true"
      className="suit-glyph inline-block font-pixel leading-[normal] text-ink"
      style={{ fontSize: size }}
    >
      {glyph}
    </span>
  );
}

function Label({ children, variant }: { children: string; variant: SuitNavProps["variant"] }) {
  if (variant === "icons") {
    return (
      <span className="suit-tip pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-pixel text-[12px] text-ink">
        {children}
      </span>
    );
  }
  return (
    <span className="suit-label max-md:sr-only font-pixel text-[16.5px] text-copy transition-colors duration-200">
      {children}
    </span>
  );
}

function ResumeItem({ variant }: { variant: SuitNavProps["variant"] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const menuId = useId();
  const item = navItems[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <li ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={variant === "icons" ? item.label : undefined}
        onClick={() => setOpen((current) => !current)}
        className="suit-link relative flex items-center gap-[17px]"
      >
        <Glyph glyph={item.glyph} size={item.glyphSize} />
        <Label variant={variant}>{item.label}</Label>
      </button>

      <div
        id={menuId}
        role="menu"
        aria-label="Resume"
        data-open={open ? "" : undefined}
        className="suit-menu absolute right-0 top-[calc(100%+14px)] z-50 min-w-[190px] border border-line bg-paper py-2 font-pixel text-[16.5px] text-copy shadow-[4px_4px_0_0_var(--color-line)]"
      >
        <a
          role="menuitem"
          href={resume.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
        >
          <span aria-hidden="true">→</span> View resume
        </a>
        <a
          role="menuitem"
          href={resume.href}
          download={resume.downloadName}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-ink hover:text-paper"
        >
          <span aria-hidden="true">↓</span> Download PDF
        </a>
      </div>
    </li>
  );
}

export default function SuitNav({ active, variant = "labels", className = "" }: SuitNavProps) {
  const gap = variant === "icons" ? "gap-[22px]" : "gap-[clamp(20px,4.3vw,65px)]";

  return (
    <nav aria-label="Main" className={className}>
      <ul className={`flex items-center ${gap}`}>
        <ResumeItem variant={variant} />
        {navItems.slice(1).map((item) => {
          const current = item.key === active;
          return (
            <li key={item.key} className="relative">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                aria-label={variant === "icons" ? item.label : undefined}
                className="suit-link relative flex items-center gap-[17px]"
              >
                <Glyph glyph={item.glyph} size={item.glyphSize} />
                <Label variant={variant}>{item.label}</Label>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
