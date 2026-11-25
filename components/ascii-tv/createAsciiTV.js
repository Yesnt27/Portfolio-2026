import * as THREE from 'three';
import { AsciiScreenEffect } from './AsciiScreenEffect.js';
import { buildTV } from './buildTV.js';
import { createScreen, SCREEN_H, SCREEN_W } from './createScreen.js';

// CSS matrix3d that maps an element's w × h box onto the quad `pts`
// ([top-left, top-right, bottom-right, bottom-left], in px), perspective-
// correct. Heckbert's square-to-quad projective mapping, with the unit
// square's u and v columns divided by w and h. Use with transform-origin 0 0.
function quadTransform(w, h, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]) {
  const dx1 = x1 - x2, dx2 = x3 - x2, sx = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const k = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3;
  const d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
}

export function createAsciiTV(container, options = {}) {
  const {
    charSet = ' .:-=+*#%@^>',   // dark → bright
    resolution = 0.16,        // lower = bigger, fewer characters
    lightColor = '#333333',   // text color on the light theme (dark grey)
    darkColor = '#ffffff',    // text color on the dark theme (white)
    // Transparent so the TV sits on the site's dither paper in both themes.
    // (The old near-black value hid the dark-grey light-theme text.)
    background = 'transparent',
    screenColor = '#000000',  // the TV screen's glass, in both themes
  } = options;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  // Closer = bigger TV. At 8.5 the legs and antenna tips still fit the box
  // with a little room for the sway (10 was the original distance).
  camera.position.set(0, 0.3, 8.5);

  // The WebGL renderer draws the 3D image, but it is NOT added to the page.
  // The ASCII effect reads its pixels and shows text instead.
  const renderer = new THREE.WebGLRenderer({ antialias: false });

  // ---- STEP 2: The model --------------------------------------------------
  const { tv, screenRect } = buildTV();
  scene.add(tv);

  // Key light in front and to the upper left, so the cabinet's front, top and
  // side faces get different brightness (= different characters in ASCII).
  // The camera is at z = +8.5, so a light at negative z only lights the back.
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(-4, 4, 6);
  scene.add(key);

  // Rim light from behind/right, to separate the TV's edge from the background.
  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(5, 2, -4);
  scene.add(rim);

  // ---- STEP 5: The ASCII effect ------------------------------------------
  // invert: true → bright pixels get the "heavy" characters at the end of
  // charSet. Use it for light text on a dark background.
  // The screen's cells are painted as solid `screenColor` blocks instead.
  const effect = new AsciiScreenEffect(renderer, charSet, { invert: true, resolution, screenColor });
  const el = effect.domElement;
  el.style.backgroundColor = background;

  // Follow the site's theme switch (data-theme on <html>).
  function applyTheme() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    el.style.color = isDark ? darkColor : lightColor;
  }
  applyTheme();
  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  el.setAttribute('aria-hidden', 'true'); // screen readers skip the wall of symbols
  el.style.pointerEvents = 'none';        // only the screen (below) takes the pointer
  container.appendChild(el);

  // ---- The screen content (Figma 740:1094) --------------------------------
  // Real HTML (the dithered frames + video) laid over the ASCII screen.
  // Every frame, three.js projects the screen's four corners with the same
  // camera maths as the WebGL image the ASCII is made from, and a flat
  // perspective warp (quadTransform) pins the HTML onto those corners.
  //
  // (This replaced three's CSS3DRenderer, which leaves the projection to the
  // browser's 3D compositor: with this scene's scale its perspective divide
  // is ~0.009, and Safari placed the screen visibly off the TV while Chrome
  // didn't. Doing the projection here makes every browser agree.)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screen = createScreen({ reduceMotion });
  const overlay = document.createElement('div');
  Object.assign(overlay.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
  Object.assign(screen.element.style, { position: 'absolute', left: '0', top: '0', transformOrigin: '0 0' });
  overlay.appendChild(screen.element);
  container.appendChild(overlay);

  // The screen's corners in the TV's own space: top-left, top-right,
  // bottom-right, bottom-left (matching the element's corners).
  const { x: sx, y: sy, z: sz, width: sw, height: sh } = screenRect;
  const screenCorners = [
    new THREE.Vector3(sx - sw / 2, sy + sh / 2, sz),
    new THREE.Vector3(sx + sw / 2, sy + sh / 2, sz),
    new THREE.Vector3(sx + sw / 2, sy - sh / 2, sz),
    new THREE.Vector3(sx - sw / 2, sy - sh / 2, sz),
  ];
  const corner = new THREE.Vector3();
  let viewW = 0;
  let viewH = 0;

  function placeScreen() {
    if (!viewW || !viewH) return;
    const pts = screenCorners.map((c) => {
      corner.copy(c).applyMatrix4(tv.matrixWorld).project(camera);
      return [((corner.x + 1) / 2) * viewW, ((1 - corner.y) / 2) * viewH];
    });
    screen.element.style.transform = quadTransform(SCREEN_W, SCREEN_H, pts);
  }

  // ---- STEP 6b: Interaction ----------------------------------------------
  // Mouse position → a small target rotation. Each frame we ease toward it.
  const target = { x: 0, y: 0 };
  function onPointerMove(e) {
    const r = container.getBoundingClientRect();
    // Clamped: the listener is on the whole window, and without the clamp a
    // pointer far to the left (e.g. over the title) turned the TV ~70°.
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const nx = clamp(((e.clientX - r.left) / r.width) * 2 - 1);  // -1 … 1
    const ny = clamp(((e.clientY - r.top) / r.height) * 2 - 1);  // -1 … 1
    target.y = nx * 0.4;   // turn left/right
    target.x = ny * 0.15;  // tilt up/down (smaller, looks more natural)
  }
  window.addEventListener('pointermove', onPointerMove);

  // ---- STEP 7: Sizing -----------------------------------------------------
  // ResizeObserver follows the container (not the window), which suits
  // a component sitting inside a layout.
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    effect.setSize(w, h);
    viewW = w;
    viewH = h;

    // How big one design pixel of the screen ends up on the page (CSS px), so
    // the dither blocks never shrink below one CSS pixel.
    const distance = camera.position.z - screenRect.z;
    const pxPerUnit = h / (2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    screen.setScale((screenRect.width * pxPerUnit) / SCREEN_W);

    renderOnce();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ---- STEP 6c: The animation loop ---------------------------------------
  const timer = new THREE.Timer(); // keeps track of time between frames
  let frameId = null;

  function renderOnce() {
    effect.render(scene, camera); // also brings tv.matrixWorld and the camera up to date
    placeScreen();
  }

  function tick(timestamp) {
    frameId = requestAnimationFrame(tick);
    timer.update(timestamp);
    const t = timer.getElapsed();

    // Idle sway + mouse target, eased (lerp) so it moves smoothly instead of snapping.
    const idle = Math.sin(t * 0.4) * 0.2;
    tv.rotation.y += (target.y + idle - tv.rotation.y) * 0.06;
    tv.rotation.x += (target.x - tv.rotation.x) * 0.06;

    renderOnce();
  }

  function start() {
    if (frameId === null) {
      timer.reset(); // reset delta so the TV doesn't "jump" after a pause
      frameId = requestAnimationFrame(tick);
    }
    screen.play();
  }
  function stop() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    screen.pause();
  }

  // ---- STEP 7: Performance + accessibility --------------------------------
  // Respect "reduce motion" (read above): one still frame, no loop, and the
  // video shows its poster.

  // Pause rendering when the TV is scrolled off screen.
  const io = new IntersectionObserver(([entry]) => {
    if (reduceMotion) return;
    entry.isIntersecting ? start() : stop();
  });
  io.observe(container);

  resize();
  if (!reduceMotion) start();

  // ---- Cleanup: call this when the component unmounts --------------------
  return function dispose() {
    stop();
    io.disconnect();
    ro.disconnect();
    themeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    tv.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
      }
    });
    timer.dispose();
    renderer.dispose();
    screen.dispose();
    overlay.remove();
    el.remove();
  };
}
