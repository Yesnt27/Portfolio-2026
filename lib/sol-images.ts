const sol = "/images/sol";

export const solImages = {
  /* Redesign (Figma frames 571:90 and 689:2028). WebP derivatives of the
     Figma source fills, cropped as each box shows them. */
  appIcon: `${sol}/app-icon-final.webp`,
  useCases: `${sol}/use-cases.webp`,
  /* Glowy Soul loop for the "planet 1" slot (components/projects/GlowySoul.tsx):
     soft globs only; the rings and grain are drawn on the page. */
  glowySoul: {
    sources: [
      { src: `${sol}/glowy-soul.av1.mp4`, type: 'video/mp4; codecs="av01.0.04M.08"' },
      { src: `${sol}/glowy-soul.mp4`, type: "video/mp4" },
    ],
    poster: `${sol}/glowy-soul-poster.webp`,
  },
  glowWide: `${sol}/glow-wide.webp`,
  glowTall: `${sol}/glow-tall.webp`,
  earpieceSide: `${sol}/earpiece-side.webp`,
  earpiecePurple: `${sol}/earpiece-purple.webp`,
  earbudLeft: `${sol}/earbud-left.webp`,
  earbudRight: `${sol}/earbud-right.webp`,
  iphoneFrame: `${sol}/iphone-frame.webp`,
  iphoneFrame15: `${sol}/iphone-frame-15.webp`,
  phoneTabbar: `${sol}/phone-tabbar.webp`,
  screens: {
    weekly: `${sol}/screen-weekly.webp`,
    weeklyDark: `${sol}/screen-weekly-dark.webp`,
    comparison: `${sol}/screen-comparison.webp`,
    home: `${sol}/screen-home.webp`,
    homeAlt: `${sol}/screen-home-alt.webp`,
    insights: `${sol}/screen-insights.webp`,
    saved: `${sol}/screen-saved.webp`,
    engagement: `${sol}/screen-engagement.webp`,
  },
  demoVideo: `${sol}/demo-video.mp4`,
  preview: `${sol}/sol-preview.mp4`,
  previewPoster: `${sol}/sol-preview-poster.webp`,

  /* Previous layouts' assets (still on disk). */
  planet: `${sol}/planet-orbit.webp`,
  projectTitle: `${sol}/sol_project_title.png`,
  mindMap: `${sol}/mind-map.png`,
  researchDiagram1: `${sol}/research-diagram-1.png`,
  researchDiagram2: `${sol}/research-diagram-2.png`,
} as const;
