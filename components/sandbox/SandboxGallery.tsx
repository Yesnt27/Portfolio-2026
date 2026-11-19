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

/*
  A shuffle gathers the pile into the middle, riffles it (splits it in two
  and pushes the halves back together in a new order), then deals every
  piece into one of the eight Figma places. The selected piece is dealt last,
  on top, into the top piece's place: centred and straight.

  The selection works like a shuffled playlist: each shuffle picks from the
  pieces that haven't been on top yet this round, and once all eight have had
  a turn, a new round starts without the piece that is already showing.
*/

/* Where a piece sits, in px on the 1512 frame, plus its tilt, scale and how
   long it waits before moving (so the deal lands one piece at a time). */
type Spot = { x: number; y: number; r: number; s: number; delay: number };
type Deck = {
  order: string[]; // bottom to top
  spots: Record<string, Spot>;
  bag: string[]; // pieces still to come up this round
};
type Phase = "gather" | "split" | "merge" | "deal";

const ALL_IDS = sandboxItems.map((item) => item.id);

/* The Figma places, top piece's first. */
const PLACES = [...pileOrder].reverse().map((id) => byId.get(id)!.pile);
const MIDDLE = { x: STAGE.width / 2, y: STAGE.top + STAGE.height / 2 };

/* Each step's move: how long it takes, and its easing. */
const MOVES: Record<Phase, { ms: number; ease: string }> = {
  gather: { ms: 260, ease: "cubic-bezier(0.45, 0, 0.2, 1)" },
  split: { ms: 190, ease: "cubic-bezier(0.3, 0, 0.2, 1)" },
  merge: { ms: 190, ease: "cubic-bezier(0.3, 0, 0.2, 1)" },
  deal: { ms: 520, ease: "var(--ease-snap)" },
};
/* The most a piece's start is staggered within a step, and the gap between dealt pieces. */
const STAGGER: Record<Phase, number> = { gather: 40, split: 30, merge: 20, deal: 24 };
/* Pieces are 80% size while gathered, so the bundle stays compact. */
const BUNDLE_SCALE = 0.8;
/* The selected (top) piece reads bigger than the rest: the pieces under it
   step back to 92% and the top one comes forward to 106%. */
const BACK_SCALE = 0.92;
const FRONT_SCALE = 1.06;
/* How far (frame px) a dealt piece may hang past the stage edge before it is scaled down. */
const EDGE = 36;

const jitter = (amount: number) => (Math.random() * 2 - 1) * amount;

function shuffled<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* Largest scale (up to 1) that keeps a tilted piece within EDGE of the stage. */
function fitScale(item: SandboxItem, x: number, y: number, r: number) {
  const angle = (r * Math.PI) / 180;
  const cos = Math.abs(Math.cos(angle));
  const sin = Math.abs(Math.sin(angle));
  const halfW = (item.pile.w * cos + item.pile.h * sin) / 2;
  const halfH = (item.pile.w * sin + item.pile.h * cos) / 2;
  const roomX = Math.min(x, STAGE.width - x) + EDGE;
  const roomY = Math.min(y - STAGE.top, STAGE.top + STAGE.height - y) + EDGE;
  return Math.min(1, roomX / halfW, roomY / halfH);
}

/* The pile as Figma draws it. Its top piece counts as this round's first turn. */
function figmaDeck(): Deck {
  const spots: Record<string, Spot> = {};
  for (const item of sandboxItems) {
    spots[item.id] = { x: item.pile.cx, y: item.pile.cy, r: item.pile.rotate, s: BACK_SCALE, delay: 0 };
  }
  const top = pileOrder[pileOrder.length - 1];
  spots[top].s = FRONT_SCALE;
  return { order: pileOrder, spots, bag: ALL_IDS.filter((id) => id !== top) };
}

/* Choose the next piece for the top, starting a new round when the bag is empty. */
function pickNext(deck: Deck) {
  const showing = deck.order[deck.order.length - 1];
  let bag = deck.bag.filter((id) => id !== showing);
  if (bag.length === 0) bag = ALL_IDS.filter((id) => id !== showing);
  const next = bag[Math.floor(Math.random() * bag.length)];
  return { next, bag: bag.filter((id) => id !== next) };
}

/* Every piece bunched near the middle, loosely squared up. */
function bundle(order: string[], spread: { x: number; y: number; r: number }, phase: Phase) {
  const spots: Record<string, Spot> = {};
  for (const id of order) {
    spots[id] = {
      x: MIDDLE.x + jitter(spread.x),
      y: MIDDLE.y + jitter(spread.y),
      r: jitter(spread.r),
      s: BUNDLE_SCALE,
      delay: Math.random() * STAGGER[phase],
    };
  }
  return spots;
}

/* The deck cut in two: bottom half to the left, top half to the right. */
function split(order: string[]) {
  const spots: Record<string, Spot> = {};
  order.forEach((id, z) => {
    const side = z < order.length / 2 ? -1 : 1;
    spots[id] = {
      x: MIDDLE.x + side * 180 + jitter(14),
      y: MIDDLE.y + jitter(14),
      r: side * 9 + jitter(3),
      s: BUNDLE_SCALE,
      delay: Math.random() * STAGGER.split,
    };
  });
  return spots;
}

/* The selected piece on top in the centre; the rest in random places and order. */
function deal(top: string): Pick<Deck, "order" | "spots"> {
  const rest = shuffled(ALL_IDS.filter((id) => id !== top));
  const places = shuffled(PLACES.slice(1));
  const spots: Record<string, Spot> = {};
  rest.forEach((id, i) => {
    const place = places[i];
    const x = place.cx + jitter(14);
    const y = place.cy + jitter(14);
    const r = place.rotate + jitter(4);
    spots[id] = { x, y, r, s: fitScale(byId.get(id)!, x, y, r) * BACK_SCALE, delay: i * STAGGER.deal };
  });
  const centre = PLACES[0];
  spots[top] = {
    x: centre.cx,
    y: centre.cy,
    r: 0,
    s: fitScale(byId.get(top)!, centre.cx, centre.cy, 0) * FRONT_SCALE,
    delay: rest.length * STAGGER.deal,
  };
  return { order: [...rest, top], spots };
}

const pct = (value: number) => ((value / STAGE.width) * 100).toFixed(3);

function ShufflePile({ memory }: { memory: { current: Deck | null } }) {
  const [deck, setDeck] = useState<Deck>(() => memory.current ?? figmaDeck());
  const [phase, setPhase] = useState<Phase>("deal");
  const timers = useRef<number[]>([]);
  /* Clicks are ignored until the riffle is done; once the deal starts, a
     click starts the next shuffle from wherever the pieces are in flight. */
  const busy = phase !== "deal";

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const shuffle = () => {
    if (busy) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];

    const { next, bag } = pickNext(deck);
    const dealt = { ...deal(next), bag };
    memory.current = dealt;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const spot of Object.values(dealt.spots)) spot.delay = 0;
      setDeck(dealt);
      return;
    }

    /* Each step starts once the slowest piece of the previous one has landed. */
    const steps: [Phase, Deck][] = [
      ["gather", { ...deck, spots: bundle(deck.order, { x: 40, y: 26, r: 12 }, "gather") }],
      ["split", { ...deck, spots: split(deck.order) }],
      ["merge", { ...dealt, spots: bundle(dealt.order, { x: 10, y: 8, r: 5 }, "merge") }],
      ["deal", dealt],
    ];
    let at = 0;
    for (const [step, layout] of steps) {
      const run = () => {
        setPhase(step);
        setDeck(layout);
      };
      if (at === 0) run();
      else timers.current.push(window.setTimeout(run, at));
      at += MOVES[step].ms + STAGGER[step];
    }
  };

  const topId = deck.order[deck.order.length - 1];
  const move = MOVES[phase];

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={shuffle}
        aria-label={`Shuffle the pile. Top piece: ${caption(byId.get(topId)!)}`}
        data-busy={busy ? "" : undefined}
        className="pile-stage relative w-full"
        style={{
          aspectRatio: `${STAGE.width} / ${STAGE.height}`,
          ["--move-ms" as string]: `${move.ms}ms`,
          ["--move-ease" as string]: move.ease,
        }}
      >
        {/* Rendered in a fixed order and stacked with z-index: moving the
            elements in the DOM would cut their transitions short. */}
        {sandboxItems.map((item) => {
          const { id } = item;
          const { w, h } = item.pile;
          const spot = deck.spots[id];
          return (
            <span
              key={id}
              className="pile-card absolute block"
              data-top={id === topId ? "" : undefined}
              style={{
                zIndex: deck.order.indexOf(id) + 1,
                width: `${(w / STAGE.width) * 100}%`,
                aspectRatio: `${w} / ${h}`,
                ["--x" as string]: pct(spot.x),
                ["--y" as string]: pct(spot.y - STAGE.top),
                ["--r" as string]: `${spot.r.toFixed(2)}deg`,
                ["--s" as string]: spot.s.toFixed(3),
                ["--delay" as string]: `${Math.round(spot.delay)}ms`,
              }}
            >
              <span className="pile-face block size-full">
                <SandboxMedia
                  item={item}
                  mode="pile"
                  playing={id === topId}
                  sizes="40vw"
                  className="size-full shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]"
                />
              </span>
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
  /* The pile and its round survive switching to INDEX and back. */
  const pileMemory = useRef<Deck | null>(null);

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
            <ShufflePile memory={pileMemory} />
          </div>
        )}
      </div>

      {/* Pager (Figma 645:2309 / 645:2526 / 645:2527) — steps between views.
          Sticky: it rides the bottom of the screen while you scroll the
          gallery, then settles in place above the footer at the end. */}
      <div className="pointer-events-none sticky bottom-[clamp(12px,1.6vw,24px)] z-40 mt-[clamp(40px,5.4vw,82px)] flex items-center justify-center gap-[19px] font-pixel text-[24px] leading-[normal] text-ink [&>*]:pointer-events-auto [&>*]:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]">
        <button type="button" onClick={() => cycle(-1)} aria-label="Previous view" className="pager-key grid h-[64px] w-[80px] place-items-center bg-card">
          ←
        </button>
        <p className="!pointer-events-none grid h-[66px] min-w-[162px] place-items-center bg-card px-4 uppercase" aria-live="polite">
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
