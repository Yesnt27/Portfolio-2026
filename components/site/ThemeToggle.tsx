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
  The "Light" switch from the Figma frames (component 501:6194), sized down to
  sit in the navbar: a card-grey track with a dark knob that carries the name
  of the current mode ("Light" on the left, "Dark" once it slides across).
  Knob geometry is the component's own insets (3.37% sides, 10.5% top/bottom,
  45.23% wide), so 106.1% of its width lands it the same inset from the right.

  Knob position and label follow html[data-theme] through the `dark:` variant,
  not React state: the head script in app/layout.tsx sets the saved theme
  before first paint, so a dark-mode visitor never sees the knob or the label
  start on "Light" and jump.
*/
export default function ThemeToggle({ className = "" }: { className?: string }) {
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
      className={`group relative block h-[26px] w-[86px] shrink-0 bg-card transition-colors duration-300 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[10.5%] bottom-[10.5%] left-[3.37%] grid w-[45.23%] translate-x-0 place-items-center bg-line font-pixel text-[11px] leading-none text-paper group-hover:scale-y-[0.86] group-active:scale-x-[1.08] dark:translate-x-[106.1%] dark:text-ink ${
          ready ? "transition-[translate,scale,background-color] duration-500 ease-snap" : ""
        }`}
      >
        <span className="dark:hidden">Light</span>
        <span className="hidden dark:inline">Dark</span>
      </span>
    </button>
  );
}
