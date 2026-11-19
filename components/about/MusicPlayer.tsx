"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { playlist } from "@/lib/playlist";
import "./player.css";

const art = "/images/about";

/*
  "Now playing" card from Figma frame 493:5454 (nodes 652:108–652:137).
  406 x 413 panel in grey-2 with a #4e4e4e keyline; album art fades into the
  panel through the Figma gradient mask (Frame 155); the three slate bars,
  title and #acacac transport buttons sit on one row underneath.

  Plays 20-second snapshots from lib/playlist.ts:
  - Play/Pause starts and stops the current snapshot. Nothing downloads until
    the first press (preload="none"), so the About page stays light.
  - ◀ ▶ switch songs. The cover slides out and the next one slides in: the
    art and text swap at the midpoint of the 0.5 s slide (SWAP_MS), while the
    audio switches straight away.
  - When a snapshot ends, the next one starts; the list loops.
  - Media keys / lock screen controls work through the Media Session API.
*/

/* The skip slide hides the cover between 45% and 55% of its 0.5 s run. */
const SWAP_MS = 250;
/* Short volume ramps so play/pause never clicks. iOS ignores `volume`
   (it is fixed at 1); the fades baked into the files cover that case. */
const FADE_IN_MS = 240;
const FADE_OUT_MS = 160;

const ramps = new WeakMap<HTMLAudioElement, number>();

function rampVolume(audio: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  cancelAnimationFrame(ramps.get(audio) ?? 0);
  const from = audio.volume;
  const start = performance.now();
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    audio.volume = to;
    done?.();
  };
  const tick = (now: number) => {
    // rAF timestamps can predate `start` by a frame, so clamp both ends.
    const t = Math.min(1, Math.max(0, (now - start) / ms));
    audio.volume = Math.min(1, Math.max(0, from + (to - from) * t));
    if (t < 1) ramps.set(audio, requestAnimationFrame(tick));
    else finish();
  };
  ramps.set(audio, requestAnimationFrame(tick));
  // rAF doesn't run in background tabs; don't let a pause hang there.
  window.setTimeout(finish, ms + 80);
}

const label = (index: number) => {
  const track = playlist[index];
  return track.title ? `${track.title} by ${track.artist}` : track.artist;
};

export default function MusicPlayer({ className = "" }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  /* What the visitor asked for. The bars and button follow this, not raw
     media events, so switching tracks doesn't flicker the UI. */
  const [playing, setPlaying] = useState(false);
  /* `current` is the song loaded in <audio>; `shown` is the one whose art and
     text are on screen (it trails by SWAP_MS during a skip). */
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(0);
  const [skip, setSkip] = useState<"prev" | "next" | null>(null);

  const playingRef = useRef(false);
  const currentRef = useRef(0);
  const switching = useRef(false);
  const swapTimer = useRef<number | null>(null);
  playingRef.current = playing;
  currentRef.current = current;

  const visible = playlist[shown];

  const start = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        switching.current = false;
        rampVolume(audio, 1, FADE_IN_MS);
      })
      .catch((error: unknown) => {
        // AbortError = superseded by a newer skip or a pause; nothing to undo.
        if (error instanceof DOMException && error.name === "AbortError") return;
        // Blocked or failed to load: drop back to paused instead of lying.
        switching.current = false;
        setPlaying(false);
      });
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    rampVolume(audio, 0, FADE_OUT_MS, () => audio.pause());
  };

  const toggle = () => {
    if (playingRef.current) {
      setPlaying(false);
      stop();
    } else {
      setPlaying(true);
      start();
    }
  };

  const go = (direction: "prev" | "next") => {
    const step = direction === "next" ? 1 : -1;
    const next = (currentRef.current + step + playlist.length) % playlist.length;

    /* restart the animation even on repeated clicks */
    setSkip(null);
    requestAnimationFrame(() => setSkip(direction));

    if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) setShown(next);
    else swapTimer.current = window.setTimeout(() => setShown(next), SWAP_MS);

    // Changing src pauses the element; mark it so onPause doesn't read that
    // as the visitor stopping playback.
    switching.current = playingRef.current;
    setCurrent(next);
  };

  // A new song is loaded: keep playing if we were.
  useEffect(() => {
    if (playingRef.current) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Lock screen / media keys.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const track = playlist[current];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title ?? track.artist,
      artist: track.artist,
      artwork: [{ src: track.cover, sizes: "748x660", type: "image/webp" }],
    });
  }, [current]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    const handlers: [MediaSessionAction, () => void][] = [
      ["play", () => !playingRef.current && toggle()],
      ["pause", () => playingRef.current && toggle()],
      ["previoustrack", () => go("prev")],
      ["nexttrack", () => go("next")],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        /* action not supported in this browser */
      }
    }
    const audio = audioRef.current;
    return () => {
      for (const [action] of handlers) {
        try {
          session.setActionHandler(action, null);
        } catch {
          /* ignore */
        }
      }
      // Leaving the page stops the music.
      audio?.pause();
      if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Names longer than the ~125px title slot glide across (player.css). Measure
     how far they overflow so the glide stops exactly at the last letter. */
  const titleRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const box = titleRef.current;
    if (!box) return;
    const measure = () => {
      const over = box.scrollWidth - box.clientWidth;
      box.toggleAttribute("data-overflow", over > 1);
      box.style.setProperty("--marquee", `${-Math.max(0, over)}px`);
      box.style.setProperty("--marquee-time", `${Math.max(4, over / 22).toFixed(1)}s`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [shown]);

  // Warm the cache with every cover so a skip never shows a blank frame.
  useEffect(() => {
    for (const track of playlist) {
      const image = new Image();
      image.src = track.cover;
    }
  }, []);

  return (
    <figure
      className={`player w-full max-w-[406px] border border-line bg-muted px-[16px] pb-[15px] pt-[7px] ${className}`}
      data-playing={playing ? "" : undefined}
    >
      <audio
        ref={audioRef}
        src={playlist[current].src}
        preload="none"
        onEnded={() => go("next")}
        onPause={() => {
          // Paused by something other than us (OS, headphones unplugged…).
          const audio = audioRef.current;
          if (!switching.current && playingRef.current && audio && !audio.ended) setPlaying(false);
        }}
        onError={() => {
          switching.current = false;
          setPlaying(false);
        }}
      />

      <div
        className="player-art relative aspect-[374/330] w-full overflow-hidden"
        data-skip={skip ?? undefined}
        onAnimationEnd={() => setSkip(null)}
        style={{
          maskImage: `url("${art}/album-fade-mask.svg")`,
          WebkitMaskImage: `url("${art}/album-fade-mask.svg")`,
          maskSize: "152.4% 151.8%",
          WebkitMaskSize: "152.4% 151.8%",
          maskPosition: "51.5% 48.5%",
          WebkitMaskPosition: "51.5% 48.5%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${art}/album-backdrop.svg`} alt="" className="absolute inset-0 size-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visible.cover}
          alt={`Album art for ${label(shown)}`}
          width={748}
          height={660}
          className="player-cover absolute inset-0 size-full object-cover"
        />
      </div>

      <figcaption className="mt-[12.6px] flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-[15px] pl-[9px]">
          <span aria-hidden="true" className="player-bars relative block h-[35px] w-[46px] shrink-0">
            <span className="absolute left-0 top-0 h-[9px] w-[35px] bg-slate" />
            <span className="absolute left-[11px] top-[13px] h-[9px] w-[35px] bg-slate" />
            <span className="absolute left-0 top-[26px] h-[9px] w-[35px] bg-slate" />
          </span>
          {/* Announces the song after a skip for screen readers. */}
          <span className="min-w-0" aria-live="polite">
            <span ref={titleRef} className="player-title block font-serif text-[24px] font-medium leading-[normal] text-ink">
              <span>{visible.title ?? visible.artist}</span>
            </span>
            {visible.title && (
              <span className="block truncate font-sans text-[12px] leading-[normal] text-ink">{visible.artist}</span>
            )}
          </span>
        </div>

        <div className="flex shrink-0 gap-[7px]">
          <button
            type="button"
            aria-label="Previous song"
            onClick={() => go("prev")}
            className="player-btn grid h-[48px] w-[51px] place-items-center bg-control"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${art}/player-prev.svg`} alt="" width={18} height={16} className="-scale-x-100" />
          </button>
          <button
            type="button"
            aria-label={playing ? `Pause ${label(current)}` : `Play ${label(current)}`}
            aria-pressed={playing}
            onClick={toggle}
            className="player-btn grid h-[48px] w-[51px] place-items-center bg-control"
          >
            {playing ? (
              <span aria-hidden="true" className="flex h-[17px] gap-[5px]">
                <span className="w-[5px] bg-[#1c1c1c]" />
                <span className="w-[5px] bg-[#1c1c1c]" />
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${art}/player-play.svg`} alt="" width={21} height={17} className="rotate-90" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next song"
            onClick={() => go("next")}
            className="player-btn grid h-[48px] w-[51px] place-items-center bg-control"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${art}/player-next.svg`} alt="" width={18} height={16} />
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
