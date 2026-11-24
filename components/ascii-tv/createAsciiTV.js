import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { AsciiScreenEffect } from './AsciiScreenEffect.js';
import { buildTV } from './buildTV.js';
import { createScreen, SCREEN_H, SCREEN_W } from './createScreen.js';

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
  // Real HTML (dithered canvases + video) on top of the ASCII. CSS3DRenderer
  // uses the same camera, and the screen is a child of the TV group, so it
  // sways and turns with the TV, sitting exactly on the 3D screen.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screen = createScreen({ reduceMotion });
  const screenObject = new CSS3DObject(screen.element);
  screenObject.position.set(screenRect.x, screenRect.y, screenRect.z);
  // 1 CSS px of the design → world units (the 418 × 325 frame fills the screen).
  screenObject.scale.set(screenRect.width / SCREEN_W, screenRect.height / SCREEN_H, 1);
  tv.add(screenObject);

  const cssRenderer = new CSS3DRenderer();
  Object.assign(cssRenderer.domElement.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
  container.appendChild(cssRenderer.domElement);

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
    cssRenderer.setSize(w, h);

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
    effect.render(scene, camera);
    cssRenderer.render(scene, camera);
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
    cssRenderer.domElement.remove();
    el.remove();
  };
}
