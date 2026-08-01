"use client";

import { useEffect, useId, useRef, useState } from "react";

const RESUME_PATH = "/resume.pdf";
const DOWNLOAD_NAME = "Kenny-Resume.pdf";

export default function ResumeNavItem() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="transition-opacity hover:opacity-70"
        onClick={() => setOpen((current) => !current)}
      >
        Resume
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Resume options"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-[70] min-w-[12.5rem] border border-white/15 bg-page py-2 font-body text-[clamp(0.9375rem,calc(min(100vw,1920px)*22/1920),1.375rem)] font-medium shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <a
            href={RESUME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="block px-4 py-2 transition-opacity hover:opacity-70"
            onClick={() => setOpen(false)}
          >
            View resume
          </a>
          <a
            href={RESUME_PATH}
            download={DOWNLOAD_NAME}
            role="menuitem"
            className="block px-4 py-2 transition-opacity hover:opacity-70"
            onClick={() => setOpen(false)}
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
