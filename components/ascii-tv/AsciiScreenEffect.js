// AsciiScreenEffect.js
// A trimmed copy of three.js's AsciiEffect (examples/jsm/effects/AsciiEffect.js,
// MIT, itself based on jsascii) with one addition: every cell where the 3D
// render shows the TV screen's key colour (see SCREEN_KEY in buildTV.js) is
// painted as a solid block of `screenColor` instead of a character.
//
// The sizing maths match AsciiEffect at scale 1 / 'low' string resolution,
// except the letter-spacing, which is measured so each character is exactly
// one image pixel wide (see below).

const htmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
const escapeHTML = (s) => s.replace(/[&<>]/g, (ch) => htmlEscapes[ch]);

// The screen is drawn pure blue (0, 0, 255). Edge cells are blended with the
// bezel when the image is shrunk, so test "much bluer than red and green"
// rather than an exact match.
function isScreenPixel(r, g, b) {
  return b - Math.max(r, g) > 100;
}

export class AsciiScreenEffect {
  constructor(renderer, charSet = ' .:-=+*#%@', options = {}) {
    const resolution = options.resolution ?? 0.15;
    const invert = options.invert ?? false;
    const screenColor = options.screenColor ?? '#000000';

    // Same character metrics as AsciiEffect: one character per image pixel
    // across, and one row per two image pixels down (characters are ~2:1 tall).
    const fontSize = 2 / resolution;
    const lineHeight = 2 / resolution;
    const font = 'courier new, monospace';
    // AsciiEffect uses a fixed -1px, which makes each character slightly wider
    // than the image pixel it stands for (~4% at this size), so the text drifts
    // right of the real 3D geometry. Measure the font instead, so a character
    // is exactly 1/resolution px wide and the HTML screen warped on top
    // (createAsciiTV.js) lines up with the ASCII one.
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = `${fontSize}px ${font}`;
    const letterSpacing = 1 / resolution - measure.measureText('M').width;

    const chars = charSet.split('').map(escapeHTML);
    const maxIdx = chars.length - 1;
    // One span per horizontal run of screen cells. Its background is a little
    // taller than the line height, so neighbouring rows overlap: no gaps.
    const screenOpen = `<span style="background:${screenColor}">`;

    const domElement = document.createElement('div');
    const grid = document.createElement('div');
    Object.assign(grid.style, {
      whiteSpace: 'pre',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      letterSpacing: `${letterSpacing}px`,
      fontFamily: font,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}px`,
      textAlign: 'left',
    });
    domElement.appendChild(grid);

    // Small 2D canvas the WebGL image is shrunk into, one pixel per cell.
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let cols = 0;
    let rows = 0;

    this.domElement = domElement;

    this.setSize = (w, h) => {
      renderer.setSize(w, h);
      cols = Math.floor(w * resolution);
      rows = Math.floor(h * resolution);
      canvas.width = cols;
      canvas.height = rows;
      grid.style.width = `${w}px`;
      grid.style.height = `${h}px`;
    };

    this.render = (scene, camera) => {
      renderer.render(scene, camera);
      if (!cols || !rows) return;

      ctx.clearRect(0, 0, cols, rows);
      ctx.drawImage(renderer.domElement, 0, 0, cols, rows);
      const data = ctx.getImageData(0, 0, cols, rows).data;

      let html = '';
      for (let y = 0; y < rows; y += 2) {
        let inScreen = false;
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          const screen = a > 0 && isScreenPixel(r, g, b);
          if (screen !== inScreen) {
            html += screen ? screenOpen : '</span>';
            inScreen = screen;
          }
          if (screen) {
            html += '&nbsp;';
            continue;
          }

          // Brightness → character, exactly as in AsciiEffect.
          const brightness = a === 0 ? 1 : (0.3 * r + 0.59 * g + 0.11 * b) / 255;
          let idx = Math.round((1 - brightness) * maxIdx);
          if (invert) idx = maxIdx - idx;
          const ch = chars[idx];
          html += ch === undefined || ch === ' ' ? '&nbsp;' : ch;
        }
        if (inScreen) html += '</span>';
        html += '<br/>';
      }
      grid.innerHTML = html;
    };
  }
}
