import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { buildTV } from './buildTV.js';
import { headers } from 'next/headers.js';

export function createAsciiTV(container, options = {}) {
  const {
    charSet = ' .:-=+*#%@^>',   // dark → bright
    resolution = 0.16,        // lower = bigger, fewer characters
    lightColor = '#333333',   // text color on the light theme (dark grey)
    darkColor = '#ffffff',    // text color on the dark theme (white)
    background = '#050805',
  } = options;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.3, 10);

  // The WebGL renderer draws the 3D image, but it is NOT added to the page.
  // The ASCII effect reads its pixels and shows text instead.
  const renderer = new THREE.WebGLRenderer({ antialias: false });

  // ---- STEP 2: The model --------------------------------------------------
  const { tv, screenMat } = buildTV();
  scene.add(tv);

  const key= new THREE.DirectionalLight(0xffffff,4);
  key.position.set(5,2,-4);

  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(5, 2, -4);
  scene.add(rim);

  // ---- STEP 5: The ASCII effect ------------------------------------------
  // invert: true → bright pixels get the "heavy" characters at the end of
  // charSet. Use it for light text on a dark background.
  const effect = new AsciiEffect(renderer, charSet, { invert: true, resolution });
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
  container.appendChild(el);

const noiseCanvas = document.createElement('canvas');
noiseCanvas.width=45;
noiseCanvas.height=36;
const nctx = noiseCanvas.getContext('2d');
const noiseImg = nctx.createImageData(noiseCanvas.width,noiseCanvas,height);

const noiseTex = new THREE.CanvasTexture(noiseCanvas);
  noiseTex.magFilter = THREE.NearestFilter;
  screenMat.emissiveMap = noiseTex;

  function drawStatic(time) {
    const { data, width, height } = noiseImg;
    // A brighter band that rolls down the screen, like an old CRT.
    const bandY = ((time * 0.25) % 1) * height;
    for (let y = 0; y < height; y++) {
      const band = Math.max(0, 1 - Math.abs(y - bandY) / 4) * 90;
      for (let x = 0; x < width; x++) {
        const v = Math.min(255, 60 + Math.random() * 170 + band);
        const i = (y * width + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 255;
      }
    }
    nctx.putImageData(noiseImg, 0, 0);
    noiseTex.needsUpdate = true;
  }
  drawStatic(0);

  // ---- STEP 6b: Interaction ----------------------------------------------
  // Mouse position → a small target rotation. Each frame we ease toward it.
  const target = { x: 0, y: 0 };
  function onPointerMove(e) {
    const r = container.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;  // -1 … 1
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;  // -1 … 1
    target.y = nx * 0.4;   // turn left/right
    target.x = ny * 0.15;  // tilt up/down (smaller, looks more natural)
  }
  window.addEventListener('pointermove', onPointerMove);

  // Click toggles the power. The screen brightness fades toward this value.
  let powerTarget = 1;
  let power = 1;
  function onClick() {
    powerTarget = powerTarget > 0 ? 0 : 1;
  }
  container.addEventListener('click', onClick);

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
    renderOnce();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ---- STEP 6c: The animation loop ---------------------------------------
  const timer = new THREE.Timer(); // keeps track of time between frames
  let frameId = null;
  let staticTimer = 0;

  function renderOnce() {
    effect.render(scene, camera);
  }

  function tick(timestamp) {
    frameId = requestAnimationFrame(tick);
    timer.update(timestamp);
    const dt = Math.min(timer.getDelta(), 0.05);
    const t = timer.getElapsed();

    // Idle sway + mouse target, eased (lerp) so it moves smoothly instead of snapping.
    const idle = Math.sin(t * 0.4) * 0.2;
    tv.rotation.y += (target.y + idle - tv.rotation.y) * 0.06;
    tv.rotation.x += (target.x - tv.rotation.x) * 0.06;

    // Refresh the static ~15 times a second (every frame is too busy in ASCII).
    staticTimer += dt;
    if (staticTimer > 1 / 15) {
      staticTimer = 0;
      drawStatic(t);
    }

    // Power fade + a little random flicker while on.
    power += (powerTarget - power) * 0.12;
    const flicker = 0.9 + Math.random() * 0.1;
    screenMat.emissiveIntensity = power * flicker;

    renderOnce();
  }

  function start() {
    if (frameId === null) {
      timer.reset(); // reset delta so the TV doesn't "jump" after a pause
      frameId = requestAnimationFrame(tick);
    }
  }
  function stop() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  }

  // ---- STEP 7: Performance + accessibility --------------------------------
  // Respect "reduce motion": show one still frame, no loop.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    container.removeEventListener('click', onClick);
    tv.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
      }
    });
    noiseTex.dispose();
    timer.dispose();
    renderer.dispose();
    el.remove();
  };
}
