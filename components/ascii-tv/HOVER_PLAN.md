# ASCII TV: objects on the screen, with Departure Mono's hover

Status: **plan only.** Waiting for the object components before building.

## 1. Reference: what departuremono.com does

Read from the site's CSS (`/assets/index-*.css`, Nov 2026). It's pure CSS, no JavaScript.

- **The "cards"** are three images in `#ephemera-items`: a boarding pass, a
  receipt and a bag tag. They're absolutely positioned and overlap a little.
- **The hover is on the group** (`#ephemera-items:hover`), so all three move at
  once, wherever the pointer is inside the group.
- **Each card moves away from the group's centre, with a small extra twist:**

  | Card | Hover transform | Direction |
  |---|---|---|
  | Boarding pass | `translate(20px, -24px) rotate(2deg)` | up and right |
  | Receipt | `rotate(-3deg) translate(-96px, 12px)` | left |
  | Bag tag | from `rotate(270deg)` to `translate(60px, 20px) rotate(275deg)` | right and down, +5° |

- **Timing:** `transition: transform 1s cubic-bezier(1, .05, .48, .99)`, using the same
  curve in and out, with no stagger.
- **The curve isn't a textbook ease-out.** It barely moves for the first ~30% of the
  second, then sweeps out and settles very softly. That "hesitate, then glide"
  is what gives it its feel.
- **No reduced-motion handling.** On phones their layout turns pointer events off.

## 2. The constraint: the screen is small in ASCII

At 1512×860 the screen is **39 × 15 character cells** (254 × 189 px), and one
cell is about 6.5 × 12.5 px. So:

- **Objects** need to read as bold silhouettes, roughly 8–15 cells wide.
- **Moves** must be at least 2 cells (about 13 px sideways, 25 px up or down) to
  visibly move. Departure's 2–3° twists won't register, so use 5–10°.
- **If the components need more detail,** either raise `resolution` (0.16 → ~0.22
  gives more, smaller characters everywhere), or use approach B below.

## 3. Two ways to put objects on the screen (pick when components arrive)

- **A. Recommended: draw them *into* the screen as ASCII.** The TV stays one
  coherent ASCII image, and the objects turn and tilt with the TV when it follows
  the mouse.
- **B. Alternative: an HTML layer over the screen.** It's warped with `matrix3d` to
  the screen's four corners every frame, so Departure's CSS can be reused as-is.
  Images stay crisp and the CSS transition is exact, but they'd look pasted on,
  not inside the ASCII TV.

## 4. Approach A, step by step

1. **Screen canvas.** Use an offscreen 2D canvas with the screen's aspect ratio (2.1 : 1.65,
   e.g. 420 × 330) and draw each object with `translate / rotate / drawImage`.
   Wrap it in a `THREE.CanvasTexture`.
2. **Screen material** (`buildTV.js`). Use a small `ShaderMaterial` that outputs
   `vec3(luminance, 0.0, 1.0)`.
   - Blue stays at full, so every screen pixel is still recognised as screen.
   - The red channel carries the brightness of whatever is drawn there.
3. **ASCII pass** (`AsciiScreenEffect.js`).
   - The screen test becomes `b > 200 && g < 60`.
   - Inside the screen, `r` is the content brightness. Below ~0.1 the cell is
     solid black (as now). Above that, it gets a character from `charSet`,
     drawn in a light "phosphor" colour (e.g. `#f3f1ef`) on the black.
   - Still one `<span>` per run of screen cells.
4. **Object data** (`screenObjects.js`). Each object is
   `{ src, x, y, rotate, hoverX, hoverY, hoverRotate, z }` in screen-canvas units.
   Start from Departure's directions (up-right, left, right-down), then scale the
   moves up to clear the 2-cell minimum.
5. **Hover = pointer over the TV**, matching Departure's group hover.
   - On `pointermove`, raycast (`THREE.Raycaster`) against the TV group, not
     the whole box, which has empty margins.
   - On touch, a tap toggles the spread.
   - For keyboard users, the container gets `tabIndex=0` and focus spreads the
     objects.
6. **Animation.** Keep one progress value `p`.
   - It moves toward 1 (hovered) or 0 at 1/1 s per second.
   - It's eased with `cubic-bezier(1, .05, .48, .99)` through a small solver
     (~20 lines, the same maths as CSS).
   - Each object = rest + ease(p) × its hover offset.
   - On un-hover mid-way, `p` just turns around and retraces its path. (CSS
     restarts the curve instead; we can match that exactly if preferred.)
7. **Cost.** Redraw the screen canvas only while `p` is changing
   (`texture.needsUpdate`), so nothing extra runs at rest.
8. **Reduced motion.** `p` snaps straight to 0 or 1.
9. **Optional: bring back click-to-power.** Off hides the objects (solid black
   screen); on shows them.
10. **Test** with screenshots at rest, mid-way and fully spread, in both themes.
    - Check each object moves at least 2 cells.
    - Try a phone tap, keyboard focus, and `prefers-reduced-motion`.

## 5. Needed from the components

- **Format.** For approach A they're drawn into a canvas, so SVG or PNG images (like
  Departure's three `<img>`s) are easiest. React components would have to be
  rendered to images first.
- **Which objects and how many.**
- **Contrast.** Light shapes on transparent backgrounds read best on the black screen.
