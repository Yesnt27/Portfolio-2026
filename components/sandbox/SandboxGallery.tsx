"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SandboxMedia from "@/components/sandbox/SandboxMedia";
import Reveal from "@/components/ui/Reveal";
import { indexRows, pileOrder, sandboxItems, type SandboxItem } from "@/lib/sandbox";
import "./sandbox.css";

type View = "index" | "shuffle";
const VIEWS: View[] = ["index", "shuffle"];
const byId = new Map(sandboxItems.map((item) => [item.id, item]));

/* Shuffle stage: the pile's bounding box on the 1512 frame (y 380–1510). */
const STAGE = { top: 380, width: 1512, height: 1130 };

const caption = (item: SandboxItem) => `${item.title}, ${item.year}`;

/* ---------------------------------------------------------------- INDEX -- */

function IndexGrid({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-[clamp(16px,2.5vw,38px)]">
      {indexRows.map((row, rowIndex) => {
        const items = row.map((id) => byId.get(id)!);
        return (
          <div
            key={rowIndex}
            className="grid gap-[clamp(16px,2.5vw,38px)] md:[grid-template-columns:var(--cols)]"
            style={{ ["--cols" as string]: items.map((item) => `${item.index.card}fr`).join(" ") }}
          >
            {items.map((item, column) => (
              <Reveal key={item.id} delay={column * 90} className="h-full">
                <button
                  type="button"
                  onClick={() => onOpen(item.id)}
                  aria-label={`Open ${caption(item)}`}
                  className="sandbox-card group flex size-full flex-col rounded-[12px] bg-card pb-[30px] pt-[30px] text-left"
                >
                  {/* Media width is its Figma share of the whole card, centred. */}
                  <span className="flex flex-1 items-center justify-center">
                    <span
                      className="sandbox-piece block"
                      style={{
                        width: `${(item.index.w / item.index.card) * 100}%`,
                        aspectRatio: `${item.index.w} / ${item.index.h}`,
                      }}
                    >
                      <SandboxMedia
                        item={item}
                        mode="index"
                        sizes="(min-width: 768px) 40vw, 90vw"
                        className="size-full shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]"
                      />
                    </span>
                  </span>
                  <span className="mt-[clamp(24px,2.6vw,40px)] px-[clamp(16px,3.2vw,48px)] font-pixel text-[16.5px] leading-[normal] text-copy">
                    {caption(item)}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- SHUFFLE -- */

function ShufflePile() {
  const [order, setOrder] = useState(pileOrder);
  const [lifting, setLifting] = useState<string | null>(null);
  const busy = useRef(false);

  const shuffle = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const top = order[order.length - 1];
    setLifting(top);
    /* Halfway through the lift, tuck the card under the pile, then let it settle back. */
    window.setTimeout(() => {
      setOrder((current) => [top, ...current.filter((id) => id !== top)]);
      window.setTimeout(() => {
        setLifting(null);
        busy.current = false;
      }, 40);
    }, 320);
  }, [order]);

  const topId = order[order.length - 1];

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={shuffle}
        aria-label={`Shuffle the pile. Top piece: ${caption(byId.get(topId)!)}`}
        className="pile-stage relative w-full"
        style={{ aspectRatio: `${STAGE.width} / ${STAGE.height}` }}
      >
        {order.map((id, z) => {
          const item = byId.get(id)!;
          const { cx, cy, w, h, rotate } = item.pile;
          return (
            <span
              key={id}
              className="pile-card absolute block"
              data-top={id === topId ? "" : undefined}
              data-lift={id === lifting ? "" : undefined}
              style={{
                zIndex: z + 1,
                left: `${(cx / STAGE.width) * 100}%`,
                top: `${((cy - STAGE.top) / STAGE.height) * 100}%`,
                width: `${(w / STAGE.width) * 100}%`,
                aspectRatio: `${w} / ${h}`,
                ["--r" as string]: `${rotate}deg`,
              }}
            >
              <SandboxMedia
                item={item}
                mode="pile"
                playing={id === topId}
                sizes="40vw"
                className="size-full shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]"
              />
            </span>
          );
        })}
      </button>

      <p className="mt-[clamp(28px,4.9vw,74px)] flex flex-col items-center gap-2 font-pixel text-[clamp(17px,1.6vw,24px)] leading-[normal] text-muted">
        Click to shuffle
        <span aria-hidden="true" className="pile-hint">
          ↓
        </span>
      </p>
      <p className="sr-only" aria-live="polite">
        Now on top: {caption(byId.get(topId)!)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- LIGHTBOX -- */

function Lightbox({ openId, onClose, onStep }: { openId: string | null; onClose: () => void; onStep: (delta: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = openId ? byId.get(openId) : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onStep]);

  const ratio =
    item && item.media.kind !== "pair" ? item.media.width / item.media.height : item ? 638 / 419 : 1;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-label={item ? caption(item) : "Sandbox piece"}
      className="sandbox-lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-copy backdrop:bg-paper/90 backdrop:backdrop-blur-[6px]"
    >
      {item && (
        <div className="pointer-events-none flex size-full flex-col items-center justify-center gap-5 px-4 py-6">
          <div
            key={item.id}
            className="lightbox-media pointer-events-auto"
            style={{ aspectRatio: ratio, width: `min(92vw, calc((100dvh - 150px) * ${ratio}))` }}
          >
            <SandboxMedia item={item} mode="lightbox" className="size-full shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]" />
          </div>
          <div className="pointer-events-auto flex w-full max-w-[720px] items-center justify-between gap-4 font-pixel text-[16.5px] leading-[normal]">
            <button type="button" onClick={() => onStep(-1)} className="text-copy transition-colors hover:text-ink">
              ← PREV
            </button>
            <p className="text-center text-ink">{caption(item)}</p>
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => onStep(1)} className="text-copy transition-colors hover:text-ink">
                NEXT →
              </button>
              <button type="button" onClick={onClose} autoFocus className="text-copy transition-colors hover:text-ink">
                CLOSE ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

/* -------------------------------------------------------------- GALLERY -- */

export default function SandboxGallery() {
  const [view, setView] = useState<View>("index");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.hash === "#shuffle") setView("shuffle");
  }, []);

  const changeView = (next: View) => {
    setView(next);
    window.history.replaceState(null, "", next === "shuffle" ? "#shuffle" : window.location.pathname);
  };

  const order = indexRows.flat();
  const step = useCallback(
    (delta: number) =>
      setOpenId((current) => {
        if (!current) return current;
        const at = order.indexOf(current);
        return order[(at + delta + order.length) % order.length];
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const cycle = (delta: number) => changeView(VIEWS[(VIEWS.indexOf(view) + delta + VIEWS.length) % VIEWS.length]);

  return (
    <>
      {/* View switch (Figma 654:138 / 654:139): the arrow marks the current view. */}
      <nav aria-label="Sandbox view" className="pl-[clamp(20px,5.16vw,78px)] pt-[clamp(40px,6.2vw,93px)]">
        <ul className="flex flex-col gap-[21px] font-pixel text-[clamp(18px,1.6vw,24px)] leading-[normal] text-ink">
          {(["shuffle", "index"] as View[]).map((option) => (
            <li key={option}>
              <button
                type="button"
                aria-pressed={view === option}
                onClick={() => changeView(option)}
                className="view-switch flex items-center gap-[8px] uppercase"
              >
                <span aria-hidden="true" className={`text-[0.84em] transition-opacity duration-300 ${view === option ? "opacity-100" : "opacity-0"}`}>
                  →
                </span>
                <span className={`transition-transform duration-300 ease-snap ${view === option ? "" : "-translate-x-[1.1em]"}`}>
                  {option}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-[clamp(48px,8.9vw,134px)]" key={view}>
        {view === "index" ? (
          <div className="view-enter pl-[clamp(16px,7.94vw,120px)] pr-[clamp(16px,3.3vw,50px)]">
            <IndexGrid onOpen={setOpenId} />
          </div>
        ) : (
          <div className="view-enter px-[clamp(8px,2vw,30px)]">
            <ShufflePile />
          </div>
        )}
      </div>

      {/* Pager (Figma 645:2309 / 645:2526 / 645:2527) — steps between views. */}
      <div className="mt-[clamp(40px,5.4vw,82px)] flex items-center justify-center gap-[19px] font-pixel text-[24px] leading-[normal] text-ink">
        <button type="button" onClick={() => cycle(-1)} aria-label="Previous view" className="pager-key grid h-[64px] w-[80px] place-items-center bg-card">
          ←
        </button>
        <p className="grid h-[66px] min-w-[162px] place-items-center bg-card px-4 uppercase" aria-live="polite">
          {view}
        </p>
        <button type="button" onClick={() => cycle(1)} aria-label="Next view" className="pager-key grid h-[64px] w-[80px] place-items-center bg-card">
          →
        </button>
      </div>

      <Lightbox openId={openId} onClose={() => setOpenId(null)} onStep={step} />
    </>
  );
}
