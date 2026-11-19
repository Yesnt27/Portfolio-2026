const f = "/images/fuorisalone";

/* AV1 first (smaller/sharper where supported), H.264 fallback. */
const video = (name: string) => [
  { src: `${f}/${name}.av1.mp4`, type: 'video/mp4; codecs="av01.0.08M.08"' },
  { src: `${f}/${name}.web.mp4`, type: "video/mp4" },
];

export const fuorisaloneImages = {
  logo: `${f}/fuorisalone-logo.png`,
  contentStrategy: `${f}/content-strategy.webp`,
  figmaWorkspace: `${f}/figma-workspace.webp`,
  iconUser: `${f}/icon-user.png`,
  iconGear: `${f}/icon-gear.png`,

  /* WebP derivatives (~2.5x display size) of the original PNG posters. */
  posters: {
    p43: `${f}/poster-43.webp`,
    p45: `${f}/poster-45.webp`,
    p46: `${f}/poster-46.webp`,
    p47: `${f}/poster-47.webp`,
    p53: `${f}/poster-53.webp`,
    p54: `${f}/poster-54.webp`,
    p55: `${f}/poster-55.webp`,
    p56: `${f}/poster-56.webp`,
    p60: `${f}/poster-60.webp`,
    p61: `${f}/poster-61.webp`,
    p62: `${f}/poster-62.webp`,
    p64: `${f}/poster-64.webp`,
  },
  webp: {
    /* Flattened export of the composed "Poster 1" frame. */
    showcase: `${f}/poster-showcase.webp`,
    ahhhhh: `${f}/poster-ahhhhh.webp`,
    frame100: `${f}/poster-frame100.webp`,
  },
  orbits: [`${f}/orbit-a.svg`, `${f}/orbit-b.svg`, `${f}/orbit-c.svg`],

  media: {
    demo: [
      { src: `${f}/demo-video.av1.mp4`, type: 'video/mp4; codecs="av01.0.08M.08"' },
      { src: `${f}/demo-video.mp4`, type: "video/mp4" },
    ],
    demoPoster: `${f}/demo-video-poster.webp`,
    prototype: video("fuorisalone-prototype"),
    prototypePoster: `${f}/fuorisalone-prototype-poster.webp`,
    districtSelection: video("district-selection"),
    districtSelectionPoster: `${f}/district-selection-poster.webp`,
    districtShowcase: video("district-showcase"),
    districtShowcasePoster: `${f}/district-showcase-poster.webp`,
    exhibitShowcase: video("exhibit-showcase"),
    exhibitShowcasePoster: `${f}/exhibit-showcase-poster.webp`,
    preview: [
      { src: `${f}/fuorisalone-preview.av1.mp4`, type: 'video/mp4; codecs="av01.0.08M.08"' },
      { src: `${f}/fuorisalone-preview.mp4`, type: "video/mp4" },
    ],
    previewPoster: `${f}/fuorisalone-preview-poster.webp`,
  },
} as const;
