"use client";

import { useState } from "react";
import GlitchCaption from "@/components/sandbox/mockups/GlitchCaption";
import Window from "@/components/sandbox/mockups/Window";
import type { SandboxItem } from "@/lib/sandbox";

/*
  MOCKUP ONLY (branch claude/sandbox-window-mockups).
  C2: two rows of four portrait windows, fanned like a hand of cards, the
  bottom row overlapping the top (styles: .mk-cell in mockups.css). Each
  window has the newer 709:848 label bar, kept at the top of the window.

  One box is "pulled out" at a time. Pointer, keyboard focus and a tap all
  set it, so the lift (data-active) and the title's glitch reveal always
  agree, including on touch screens where :hover sticks to the last tap.
  Rows are separate so a box's neighbours are only ever beside it.
*/
export default function FileDrawer({ items }: { items: SandboxItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const rows = [items.slice(0, 4), items.slice(4)];
  const release = (id: string) => setActive((current) => (current === id ? null : current));

  return (
    <div className="pb-[clamp(20px,3.97vw,60px)] pt-[clamp(40px,6vw,90px)]">
      {rows.map((row, r) => (
        <div key={r} className="mk-drawer-row">
          {row.map((item) => {
            const on = active === item.id;
            return (
              <div
                key={item.id}
                tabIndex={0}
                className="mk-cell"
                aria-label={`${item.title}, ${item.year}`}
                data-active={on ? "" : undefined}
                onPointerEnter={() => setActive(item.id)}
                onPointerLeave={(e) => e.pointerType !== "touch" && release(item.id)}
                onFocus={() => setActive(item.id)}
                onBlur={() => release(item.id)}
              >
                <Window
                  item={item}
                  ratio={300 / 385}
                  barAt="top"
                  labelBar
                  caption={<GlitchCaption title={item.title} year={item.year} on={on} />}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
