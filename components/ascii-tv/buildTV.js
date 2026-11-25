// buildTV.js
// STEP 3 — Build the old TV out of simple shapes.
// Every part is a basic Three.js shape (box, cylinder, sphere).
// At ASCII resolution small details vanish, so the parts are chunky on purpose.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Pure blue: nothing else in the scene (wood, grey plastic, metal) comes close.
export const SCREEN_KEY = 0x0000ff;

export function buildTV() {
  const tv = new THREE.Group();

  // ---- Materials ---------------------------------------------------------
  // Lit materials (Standard) so the light creates contrast between faces.
  const wood = new THREE.MeshStandardMaterial({ color: 0xd8a56c, roughness: 0.8 });
  const darkPlastic = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.6, roughness: 0.3 });

  // The screen is drawn in a pure "key" colour. MeshBasicMaterial is unlit, so
  // the lights never change it. AsciiScreenEffect.js looks for this colour and
  // paints those cells as solid black glass instead of characters.
  const screenMat = new THREE.MeshBasicMaterial({ color: SCREEN_KEY });

  // ---- 1. Cabinet (the main body) ---------------------------------------
  const W = 3.2, H = 2.4, D = 2.2; // width, height, depth
  const cabinet = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 4, 0.18), wood);
  tv.add(cabinet);

  const front = D / 2; // z position of the front face

  // ---- 2. Screen + bezel (left side of the front face) -------------------
  const screenW = 2.1, screenH = 1.65, screenX = -0.4;

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH), screenMat);
  screen.position.set(screenX, 0, front + 0.01);
  tv.add(screen);

  // Bezel = 4 thick bars around the screen. They stick out from the front,
  // which makes the screen look recessed — a deep inset reads well in ASCII.
  const bezelT = 0.16, bezelDepth = 0.18;
  const bars = [
    [screenW + bezelT * 2, bezelT, 0, screenH / 2 + bezelT / 2],   // top
    [screenW + bezelT * 2, bezelT, 0, -screenH / 2 - bezelT / 2],  // bottom
    [bezelT, screenH, -screenW / 2 - bezelT / 2, 0],               // left
    [bezelT, screenH, screenW / 2 + bezelT / 2, 0],                // right
  ];
  for (const [w, h, x, y] of bars) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, bezelDepth), darkPlastic);
    bar.position.set(screenX + x, y, front + bezelDepth / 2);
    tv.add(bar);
  }

  // ---- 3. Control panel: 2 knobs + speaker grille (right side) ----------
  const panelX = 1.17;
  const knobGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.2, 24);
  knobGeo.rotateX(Math.PI / 2); // turn the cylinder so it points out of the front
  for (const y of [0.55, 0.0]) {
    const knob = new THREE.Mesh(knobGeo, darkPlastic);
    knob.position.set(panelX, y, front + 0.1);
    tv.add(knob);
  }

  for (let i = 0; i < 5; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), darkPlastic);
    slat.position.set(panelX, -0.45 - i * 0.12, front + 0.02);
    tv.add(slat);
  }

  // ---- 4. Rabbit-ear antenna --------------------------------------------
  const base = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), // half dome
    darkPlastic
  );
  base.position.set(0, H / 2, -0.2);
  tv.add(base);

  // Length of each rod. Shorter = a lower antenna (2.0 was the original;
  // the tips follow automatically). The cabinet doesn't move when this
  // changes, so a shorter antenna just leaves more room above the TV.
  const rodLength = 1.3;
  for (const side of [-1, 1]) {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, rodLength, 8), metal);
    // Move the rod's pivot to its bottom end so it rotates around the base.
    rod.geometry.translate(0, rodLength / 2, 0);
    rod.position.set(0, H / 2 + 0.15, -0.2);
    rod.rotation.z = side * 0.55; // spread into a V
    tv.add(rod);

    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), metal);
    tip.position.set(0, rodLength, 0);
    rod.add(tip); // child of the rod, so it follows the rod's angle
  }

  // ---- 5. Legs -----------------------------------------------------------
  const legGeo = new THREE.CylinderGeometry(0.08, 0.04, 0.6, 8);
  for (const x of [-1.3, 1.3]) {
    for (const z of [-0.8, 0.8]) {
      const leg = new THREE.Mesh(legGeo, wood);
      leg.position.set(x, -H / 2 - 0.3, z);
      tv.add(leg);
    }
  }

  // Lift the whole TV so it's visually centred (antenna on top makes it top-heavy).
  tv.position.y = -0.4;

  // Where the screen sits inside the TV group, so the HTML screen content
  // (createScreen.js) can be pinned on top of it.
  const screenRect = { x: screenX, y: 0, z: front + 0.01, width: screenW, height: screenH };

  return { tv, screenMat, screenRect };
}