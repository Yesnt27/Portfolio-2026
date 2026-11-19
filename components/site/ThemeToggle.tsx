"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode: the toggle still works for this visit */
  }
}

/*
  The "Light" switch from the Figma frames (component 501:6194): a #d9d9d9
  track with a dark knob parked on the left. Knob geometry is the component's
  own insets (5.5px sides, 10.5% top/bottom, 45% wide). Dark mode slides it
  across and swaps the palette tokens in globals.css.
*/
export default function ThemeToggle({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    /* Let the first paint settle before enabling the slide transition, so a
       saved dark theme doesn't animate in on every page load. */
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const dark = theme === "dark";
  const dims = size === "sm" ? "h-[35px] w-[118px]" : "h-[48px] w-[164px]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light" : "Switch to dark"}
      onClick={() => {
        const next: Theme = dark ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
      }}
      className={`group relative block shrink-0 bg-card transition-colors duration-300 ${dims} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[10.5%] bottom-[10.5%] left-[3.37%] w-[45.23%] bg-line group-hover:scale-y-[0.86] group-active:scale-x-[1.08] ${
          ready ? "transition-[translate,scale,background-color] duration-500 ease-snap" : ""
        }`}
        style={{ translate: dark ? "106.1% 0" : "0 0" }}
      />
    </button>
  );
}
