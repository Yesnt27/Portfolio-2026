// createScreen.js
// The TV's screen content, built from Figma frame 740:1094 ("Frame 163",
// 418 × 325, inside Group 228 / 740:1097):
//   - app icon (Frends Ga-lore), tilted −9.46°, dithered (3 levels, 1px blocks)
//   - peakprep-walkthrough video, tilted 9.79°, dithered (3 levels, 1px blocks)
// The design's dithered #333 background (Rectangle 784) is left out: the
// screen keeps the ASCII TV's own solid black glass behind the frames.
// Hovering the screen eases both frames in toward the centre (ascii-tv.css),
// with Departure Mono's card timing.
//
// Coordinates are the design's own pixels. createAsciiTV.js warps this
// element onto the TV's screen.

import { ditherInto } from './dither.js';

export const SCREEN_W = 418;
export const SCREEN_H = 325;

// Dither params copied from the Figma shader effects on the two frames.
const FRAME_DITHER = { levels: 3, mono: false, brightness: 100, contrast: 1 };

const ICON_SRC = '/images/home/frends-galore-icon.svg';
const VIDEO = {
  sources: [
    { src: '/images/home/peakprep-walkthrough.av1.mp4', type: 'video/mp4; codecs="av01.0.08M.08"' },
    { src: '/images/home/peakprep-walkthrough.mp4', type: 'video/mp4' },
  ],
  poster: '/images/home/peakprep-walkthrough-poster.webp',
};

function el(tag, className, style = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.assign(node.style, style);
  return node;
}

// A dithered layer: a canvas with one pixel per block, stretched over the
// element (see .tv-dither in ascii-tv.css).
function ditherLayer(width, height, pixelSize, params) {
  const canvas = el('canvas', 'tv-dither');
  let source = null;
  let cssScale = 1;

  function size() {
    // Figma's block grid, but a block is never smaller than one CSS pixel on
    // the page. The TV shows the design at ~0.6×, so Figma's 1px blocks would
    // shrink below a screen pixel and the dither would blur away; 1 CSS px
    // blocks look like Figma's frame does at 100%.
    const fx = Math.ceil(width / pixelSize);
    const fy = Math.ceil(height / pixelSize);
    const bx = Math.min(fx, Math.max(1, Math.ceil(width * cssScale)));
    const by = Math.min(fy, Math.max(1, Math.ceil(height * cssScale)));
    canvas.width = bx;
    canvas.height = by;
    // Full Figma grid: the last block can hang past the edge, as in Figma.
    canvas.style.width = `${bx === fx ? fx * pixelSize : width}px`;
    canvas.style.height = `${by === fy ? fy * pixelSize : height}px`;
    return [bx === fx ? (fx * pixelSize) / width : 1, by === fy ? (fy * pixelSize) / height : 1];
  }
  let cover = size();

  return {
    canvas,
    setSource(s) {
      source = s;
    },
    setScale(s) {
      cssScale = s;
      cover = size();
    },
    draw() {
      if (source) ditherInto(canvas, source, params, cover);
    },
  };
}

// A tilted frame, laid out like Figma's: a flex-centred bounding box at
// (left, top) with the rotated content inside.
function frame(modifier, box, inner, layer) {
  const wrap = el('div', `tv-frame tv-frame--${modifier}`, {
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
  });
  const tilt = el('div', 'tv-frame__tilt', {
    width: `${inner.width}px`,
    height: `${inner.height}px`,
    rotate: `${inner.rotate}deg`,
  });
  tilt.appendChild(layer.canvas);
  wrap.appendChild(tilt);
  return wrap;
}

export function createScreen({ reduceMotion = false } = {}) {
  const root = el('div', 'tv-screen', { width: `${SCREEN_W}px`, height: `${SCREEN_H}px` });
  root.setAttribute('aria-hidden', 'true');

  // Layer order as in Figma: the video, then the app icon on top of it.

  // ---- peakprep-walkthrough video (740:1092) ----------------------------
  const video = ditherLayer(194.913, 421.952, 1, FRAME_DITHER);
  root.appendChild(
    frame('video', { left: 174, top: 24, width: 263.809, height: 448.945 }, { width: 194.913, height: 421.952, rotate: 9.79 }, video),
  );

  // ---- app icon (736:1036) ----------------------------------------------
  const icon = ditherLayer(224.927, 224.927, 1, FRAME_DITHER);
  root.appendChild(
    frame('icon', { left: -80.78, top: 34.09, width: 258.826, height: 258.826 }, { width: 224.927, height: 224.927, rotate: -9.46 }, icon),
  );

  // The <video> only feeds the dither; it stays in the DOM (so browsers keep
  // decoding it) but is invisible.
  const videoEl = el('video', 'tv-screen__source');
  Object.assign(videoEl, { muted: true, loop: true, playsInline: true, preload: reduceMotion ? 'none' : 'auto' });
  videoEl.setAttribute('muted', '');
  videoEl.setAttribute('playsinline', '');
  for (const s of VIDEO.sources) {
    const source = document.createElement('source');
    source.src = s.src;
    source.type = s.type;
    videoEl.appendChild(source);
  }
  root.appendChild(videoEl);

  // ---- Sources ----------------------------------------------------------
  let disposed = false;
  const drawAll = () => {
    icon.draw();
    video.draw();
  };

  // Icon: rasterise the SVG at 2× so the block centres sample a crisp image.
  const iconImg = new Image();
  iconImg.src = ICON_SRC;
  iconImg.decode().then(() => {
    if (disposed) return;
    const c = el('canvas');
    c.width = c.height = 450;
    c.getContext('2d').drawImage(iconImg, 0, 0, 450, 450);
    icon.setSource(c);
    icon.draw();
  }, () => {});

  // Video: the poster first (and only, with reduced motion), then live frames.
  const poster = new Image();
  poster.src = VIDEO.poster;
  poster.decode().then(() => {
    if (disposed || video.hasFrames) return;
    video.setSource(poster);
    video.draw();
  }, () => {});

  let wantPlaying = false;
  let frameHandle = null;
  const useVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

  function onFrame() {
    frameHandle = null;
    if (disposed || !wantPlaying) return;
    video.draw();
    schedule();
  }
  function schedule() {
    if (frameHandle !== null) return;
    frameHandle = useVFC ? videoEl.requestVideoFrameCallback(onFrame) : requestAnimationFrame(onFrame);
  }
  function cancel() {
    if (frameHandle === null) return;
    if (useVFC) videoEl.cancelVideoFrameCallback(frameHandle);
    else cancelAnimationFrame(frameHandle);
    frameHandle = null;
  }

  videoEl.addEventListener('loadeddata', () => {
    if (disposed) return;
    video.hasFrames = true;
    video.setSource(videoEl);
    video.draw();
  });

  return {
    element: root,

    // CSS pixels per design pixel, as the screen is shown on the page.
    setScale(s) {
      for (const layer of [icon, video]) layer.setScale(s);
      drawAll();
    },

    play() {
      if (reduceMotion || disposed) return;
      wantPlaying = true;
      videoEl.play().then(schedule, () => {
        /* autoplay refused (e.g. data saver): the poster stays up */
      });
    },

    pause() {
      wantPlaying = false;
      cancel();
      videoEl.pause();
    },

    dispose() {
      disposed = true;
      this.pause();
      videoEl.removeAttribute('src');
      videoEl.replaceChildren();
      videoEl.load();
      root.remove();
    },
  };
}
