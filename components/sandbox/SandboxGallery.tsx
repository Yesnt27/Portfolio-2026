"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import GlitchCaption from "@/components/sandbox/GlitchCaption";
import LookalikeText from "@/components/sandbox/LookalikeText";
import SandboxMedia from "@/components/sandbox/SandboxMedia";
import Reveal from "@/components/ui/Reveal";
import { drawerOrder, indexRows, sandboxItems, type SandboxItem } from "@/lib/sandbox";
import "./sandbox.css";

type View = "index" | "shuffle";
const VIEWS: View[] = ["index", "shuffle"];
const byId = new Map(sandboxItems.map((item) => [item.id, item]));

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

/*
  The SHUFFLE view, a "file drawer" (Figma 709:127 layout, 709:848 window).
  Every piece sits in its own same-size window: a grey bar on top, the media
  cropped to fill a white mat below (the Palace pair shares it, split in two).
  The windows stand edge to edge in rows of four (two on phones), fanned like
  a hand of cards, the second row riding up over the first (sandbox.css).

  Hover, keyboard focus or a tap pulls one window out: it lifts out of the
  drawer along its tilt, its neighbours lean away, a video starts playing
  and the title glitches in after the bar's "_" (GlitchCaption). Clicking it
  opens the lightbox. SHUFFLE in the pager deals the windows into a new
  order: each glides and turns into its new place.
*/

/* Where a window sits on screen (its centre) and how it is turned. */
type Pose = { x: number; y: number; rotate: string };

function shuffled<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pose(el: HTMLElement): Pose {
  const box = el.getBoundingClientRect();
  const { rotate } = getComputedStyle(el);
  return { x: box.left + box.width / 2, y: box.top + box.height / 2, rotate: rotate === "none" ? "0deg" : rotate };
}

/* The window's media, cropped to fill it. Videos show their poster until the
   window is pulled out, then play muted (sound is for the lightbox). */
function DrawerMedia({ item, playing }: { item: SandboxItem; playing: boolean }) {
  const { media } = item;
  const sizes = "(min-width: 768px) 20vw, 45vw";
  if (media.kind === "pair") {
    return media.images.map((image) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={image.src} src={image.src} srcSet={image.srcSet} sizes="(min-width: 768px) 10vw, 22vw" alt={image.alt} loading="lazy" decoding="async" className="drawer-img" />
    ));
  }
  if (media.kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={media.src} srcSet={media.srcSet} sizes={sizes} alt={media.alt} loading="lazy" decoding="async" className="drawer-img" />;
  }
  if (playing) {
    return (
      <video muted loop playsInline autoPlay poster={media.poster} aria-label={media.alt} className="drawer-img bg-black">
        {media.sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.poster} alt={media.alt} loading="lazy" decoding="async" className="drawer-img bg-black" />;
}

function ShuffleDrawer({
  order,
  setOrder,
  shuffleRef,
  onOpen,
}: {
  order: string[];
  setOrder: (next: string[]) => void;
  /* The pager's SHUFFLE key calls this. */
  shuffleRef: { current: (() => void) | null };
  onOpen: (id: string) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [still, setStill] = useState(false);
  const [shuffles, setShuffles] = useState(0);
  const cells = useRef(new Map<string, HTMLElement>());
  const before = useRef<Map<string, Pose> | null>(null);
  const release = (id: string) => setActive((current) => (current === id ? null : current));

  useEffect(() => setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  /* Note where every window is, then reorder; the layout effect below glides
     each one from its old place and tilt to its new ones. */
  useEffect(() => {
    shuffleRef.current = () => {
      before.current = new Map([...cells.current].map(([id, el]) => [id, pose(el)]));
      let next = order;
      while (next.every((id, i) => id === order[i])) next = shuffled(order);
      setActive(null);
      setOrder(next);
      setShuffles((count) => count + 1);
    };
    return () => {
      shuffleRef.current = null;
    };
  });

  useLayoutEffect(() => {
    const from = before.current;
    before.current = null;
    if (!from || still) return;
    order.forEach((id, i) => {
      const el = cells.current.get(id);
      const a = from.get(id);
      if (!el || !a) return;
      const b = pose(el);
      el.animate(
        [
          { translate: `${a.x - b.x}px ${a.y - b.y}px`, rotate: a.rotate },
          { translate: "0px 0px", rotate: b.rotate },
        ],
        { duration: 620, easing: "cubic-bezier(0.2, 0.9, 0.1, 1)", delay: i * 35, fill: "backwards" },
      );
    });
  }, [order, still]);

  return (
    <div className="flex flex-col items-center">
      <div className="drawer">
        {order.map((id) => {
          const item = byId.get(id)!;
          const on = active === id;
          return (
            <button
              key={id}
              ref={(el) => {
                if (el) cells.current.set(id, el);
                else cells.current.delete(id);
              }}
              type="button"
              className="drawer-cell"
              data-active={on ? "" : undefined}
              aria-label={`Open ${caption(item)}`}
              onPointerEnter={() => setActive(id)}
              onPointerLeave={(event) => event.pointerType !== "touch" && release(id)}
              onFocus={() => setActive(id)}
              onBlur={() => release(id)}
              onClick={() => onOpen(id)}
            >
              <span className="drawer-win">
                <span className="drawer-bar">
                  <GlitchCaption title={item.title} year={item.year} on={on} />
                </span>
                <span className="drawer-body" style={item.mat ? { background: item.mat } : undefined}>
                  <DrawerMedia item={item} playing={on && !still} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {shuffles > 0 && `Shuffled. First: ${caption(byId.get(order[0])!)}`}
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
  /* The drawer's order survives switching to INDEX and back. */
  const [drawer, setDrawer] = useState(drawerOrder);
  const shuffleRef = useRef<(() => void) | null>(null);
  /* Each SHUFFLE click also makes its label swap in look-alike letters. */
  const [shuffleClicks, setShuffleClicks] = useState(0);

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
            <ShuffleDrawer order={drawer} setOrder={setDrawer} shuffleRef={shuffleRef} onOpen={setOpenId} />
          </div>
        )}
      </div>

      {/* Pager (Figma 645:2309 / 645:2526 / 645:2527) — steps between views.
          In SHUFFLE its middle key shuffles the drawer, and its label
          briefly swaps in look-alike letters (LookalikeText). Sticky: it rides the bottom of the
          screen while you scroll the gallery, then settles in place above
          the footer at the end. */}
      <div className="pointer-events-none sticky bottom-[clamp(12px,1.6vw,24px)] z-40 mt-[clamp(40px,5.4vw,82px)] flex items-center justify-center gap-[19px] font-pixel text-[24px] leading-[normal] text-ink [&>*]:pointer-events-auto [&>*]:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]">
        <button type="button" onClick={() => cycle(-1)} aria-label="Previous view" className="pager-key grid h-[64px] w-[80px] place-items-center bg-card">
          ←
        </button>
        {view === "shuffle" ? (
          <button
            type="button"
            onClick={() => {
              shuffleRef.current?.();
              setShuffleClicks((count) => count + 1);
            }}
            aria-label="Shuffle the sandbox"
            className="pager-key grid h-[66px] min-w-[162px] place-items-center bg-card px-4 uppercase"
          >
            <LookalikeText text="SHUFFLE" trigger={shuffleClicks} />
          </button>
        ) : (
          <p className="!pointer-events-none grid h-[66px] min-w-[162px] place-items-center bg-card px-4 uppercase">{view}</p>
        )}
        <p className="sr-only" aria-live="polite">
          {view} view
        </p>
        <button type="button" onClick={() => cycle(1)} aria-label="Next view" className="pager-key grid h-[64px] w-[80px] place-items-center bg-card">
          →
        </button>
      </div>

      <Lightbox openId={openId} onClose={() => setOpenId(null)} onStep={step} />
    </>
  );
}
