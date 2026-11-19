"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
  ScrollReveal — fades every block of content up into place the first time it
  scrolls into view, on every page, without wrapping each one in <Reveal>.
  Mounted once in app/layout.tsx; the look lives in app/globals.css
  ("Scroll reveal").

  How it picks what to animate (one pass per page, plus anything that mounts
  later):
  - Units are content blocks: headings, paragraphs, list items, images,
    video, figures, buttons, <Reveal> wrappers, and compositions (a box of
    absolutely positioned layers, like the footer's SkyTrain drawing).
  - A unit's children never animate on their own, so nothing animates twice.
  - Blocks taller than 90% of the screen are split into their children, so a
    long case-study section reveals piece by piece instead of all at once.
  - Elements that already move on their own (page-load .rise-in, their own
    animation, transform, filter or opacity) are left alone with everything
    inside them, as are fixed and sticky chrome, absolutely positioned layers
    of a composition, screen-reader-only text, and anything marked
    data-no-reveal.
  - Whatever is already on screen when the page loads stays put; only content
    below the fold waits to fade in. Blocks arriving together cascade ~90ms
    apart.
*/

const UNITS =
  "h1, h2, h3, h4, h5, h6, p, li, dt, dd, figure, picture, img, video, canvas, blockquote, pre, table, form, button, hr, [data-reveal]";
const ROOTS = "main, body > footer";
const TALL = 0.9;
const STAGGER_MS = 90;
const MAX_STAGGER_MS = 360;

function movesOnItsOwn(style: CSSStyleDeclaration) {
  return (
    style.animationName !== "none" ||
    style.transform !== "none" ||
    style.translate !== "none" ||
    style.filter !== "none" ||
    Number(style.opacity) < 1
  );
}

function hasLayers(el: HTMLElement) {
  for (const child of Array.from(el.children)) {
    if (getComputedStyle(child).position === "absolute") return true;
  }
  return false;
}

export default function ScrollReveal() {
  const pathname = usePathname();

  // An entrance that finished hands the element back to its own styles.
  useEffect(() => {
    const onEnd = (event: AnimationEvent) => {
      const el = event.target as HTMLElement;
      if (event.animationName === "reveal-in" && el.dataset?.reveal === "in") el.dataset.reveal = "done";
    };
    document.addEventListener("animationend", onEnd);
    return () => document.removeEventListener("animationend", onEnd);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hidden and waiting; un-hidden on cleanup so a navigation can't strand
    // anything (the footer survives route changes).
    const pending = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
        arriving.forEach((entry, order) => {
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          pending.delete(el);
          el.style.setProperty("--reveal-delay", `${Math.min(order * STAGGER_MS, MAX_STAGGER_MS)}ms`);
          el.dataset.reveal = "in";
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );

    const consider = (el: HTMLElement, viewport: number) => {
      if (el.matches(".rise-in, .sr-only, [data-no-reveal]")) return;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.position === "fixed" || style.position === "sticky") return;
      // Anything that moves on its own (marquees, parallax, hover tilts) keeps
      // its whole subtree: an entrance inside a moving thing would fight it.
      if (!el.hasAttribute("data-reveal") && movesOnItsOwn(style)) return;
      // Absolutely positioned layers belong to a composition (the SkyTrain
      // drawing, the hero collage); fading them one by one would look broken.
      if (style.position === "absolute") return;

      const rect = el.getBoundingClientRect();
      const tall = rect.height > viewport * TALL;

      // Already handled: a unit from an earlier pass, or a <Reveal> wrapper
      // running its own entrance. A wrapper too tall to read as one piece, or
      // one holding other <Reveal>s, is shown now (marked as a group) and its
      // contents revealed one by one, so nothing animates twice.
      if (el.hasAttribute("data-reveal")) {
        const nested = el.querySelector("[data-reveal]") !== null;
        if ((!tall && !nested) || el.hasAttribute("data-reveal-group")) return;
        el.setAttribute("data-reveal-group", "");
        if (el.dataset.reveal === "") el.dataset.reveal = "done";
        scan(el, viewport);
        return;
      }

      // A drawing or media frame built from absolutely positioned layers
      // reveals as one piece.
      const composition = !el.matches(UNITS) && hasLayers(el);

      // Containers, tall blocks, and anything holding an explicit <Reveal>
      // (those wrappers decide their own pieces) pass through to children.
      if ((!el.matches(UNITS) && !composition) || tall || el.querySelector("[data-reveal]")) {
        scan(el, viewport);
        return;
      }
      if (rect.height === 0 && rect.width === 0) return;

      if (rect.top < viewport) {
        el.dataset.reveal = "done"; // already on screen (or scrolled past): leave it be
      } else {
        el.dataset.reveal = "";
        pending.add(el);
        observer.observe(el);
      }
    };

    const scan = (parent: Element, viewport: number) => {
      for (const child of Array.from(parent.children)) {
        if (child instanceof HTMLElement) consider(child, viewport);
      }
    };

    const scanAll = () => {
      const viewport = window.innerHeight;
      document.querySelectorAll(ROOTS).forEach((root) => scan(root, viewport));
    };

    // Content that mounts after the first pass (client components, lazy rows).
    let queued: HTMLElement[] = [];
    let frame = 0;
    const flush = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const el of queued) {
        if (!el.isConnected) continue;
        // Inside a unit: it appears with its parent, not on its own.
        if (el.parentElement?.closest("[data-reveal]:not([data-reveal-group])")) continue;
        consider(el, viewport);
      }
      queued = [];
    };
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) queued.push(node);
        });
      }
      if (queued.length && !frame) frame = requestAnimationFrame(flush);
    });

    // Let the new page lay out before measuring it.
    const start = requestAnimationFrame(() => {
      scanAll();
      document.querySelectorAll(ROOTS).forEach((root) => mutations.observe(root, { childList: true, subtree: true }));
    });

    // At the very bottom of the page, the last blocks can sit inside the
    // trigger margin forever. Once the end is reached, bring in whatever is
    // on screen.
    const onScroll = () => {
      if (!pending.size) return;
      const end = document.documentElement.scrollHeight - 2;
      if (window.scrollY + window.innerHeight < end) return;
      let order = 0;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top >= window.innerHeight) return;
        observer.unobserve(el);
        pending.delete(el);
        el.style.setProperty("--reveal-delay", `${Math.min(order++ * STAGGER_MS, MAX_STAGGER_MS)}ms`);
        el.dataset.reveal = "in";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      mutations.disconnect();
      pending.forEach((el) => el.removeAttribute("data-reveal"));
    };
  }, [pathname]);

  return null;
}
