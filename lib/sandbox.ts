import type { VideoSource } from "@/components/ui/AutoVideo";

/*
  Sandbox pieces. Media are re-exported from the highest-resolution originals:
  photos from the Figma source fills (2160-2880px), videos from the original
  renders/recordings (Portals 1080x1080, Friends Ga-lore 1080p, VSA 1080x1350),
  each as AV1 (smaller, sharper) with an H.264 fallback.

  `index`: card in the INDEX grid (Figma 645:2308) — card width on the 1512
  frame and the media's on-screen size inside its 15px white mat.
  `pile`: placement in the SHUFFLE pile (Figma 510:6986) — centre point on the
  frame, media size and rotation.
*/

type Image = { kind: "image"; src: string; srcSet: string; width: number; height: number; alt: string };
type Video = { kind: "video"; sources: VideoSource[]; poster: string; width: number; height: number; alt: string };
type Pair = { kind: "pair"; images: [Image, Image] };

export type SandboxItem = {
  id: string;
  title: string;
  year: string;
  media: Image | Video | Pair;
  /* River carries the Figma duotone, which tints its mat cream as well. */
  mat?: string;
  index: { card: number; w: number; h: number };
  pile: { cx: number; cy: number; w: number; h: number; rotate: number };
};

const s = "/images/sandbox";

const photo = (name: string, widths: [number, number], width: number, height: number, alt: string): Image => ({
  kind: "image",
  src: `${s}/${name}-${widths[0]}.webp`,
  srcSet: `${s}/${name}-${widths[0]}.webp ${widths[0]}w, ${s}/${name}-${widths[1]}.webp ${widths[1]}w`,
  width,
  height,
  alt,
});

const av1 = (file: string, level = "08") => ({ src: `${s}/${file}.av1.mp4`, type: `video/mp4; codecs="av01.0.${level}M.08"` });
const h264 = (file: string) => ({ src: `${s}/${file}.mp4`, type: "video/mp4" });

export const sandboxItems: SandboxItem[] = [
  {
    id: "portals",
    title: "Portals",
    year: "2023",
    media: {
      kind: "video",
      sources: [av1("portals"), h264("portals")],
      poster: `${s}/portals-poster.webp`,
      width: 1080,
      height: 1080,
      alt: "Blender animation of a figure standing inside rings of pink and blue neon light",
    },
    index: { card: 517, w: 424, h: 424 },
    pile: { cx: 756, cy: 979, w: 632, h: 632, rotate: 0 },
  },
  {
    id: "friends-galore",
    title: "Friends Ga-lore",
    year: "2026",
    media: {
      kind: "video",
      sources: [av1("friends-galore"), h264("friends-galore")],
      poster: `${s}/friends-galore-poster.webp`,
      width: 1920,
      height: 1080,
      alt: "Product video for Friends Ga-lore, a playful book-of-friends app with hobby and connection cards",
    },
    index: { card: 786, w: 691, h: 389 },
    pile: { cx: 510, cy: 686, w: 691, h: 389, rotate: -18.25 },
  },
  {
    id: "vsa-intros",
    title: "VSA team intros",
    year: "2026",
    media: {
      kind: "video",
      sources: [av1("vsa-intros", "09"), h264("vsa-intros")],
      poster: `${s}/vsa-intros-poster.webp`,
      width: 1080,
      height: 1350,
      alt: "Animated Vietnamese Student Association team introduction cards cycling through members",
    },
    index: { card: 615, w: 357, h: 447 },
    pile: { cx: 376, cy: 1199, w: 357, h: 447, rotate: -17.67 },
  },
  {
    id: "golden-sunrise",
    title: "Golden Sunrise",
    year: "2026",
    media: photo("golden-sunrise", [1200, 2400], 2880, 2160, "The Golden Gate Bridge from the beach under a pink dawn sky"),
    index: { card: 693, w: 581, h: 436 },
    pile: { cx: 839, cy: 1229, w: 581, h: 436, rotate: 10.84 },
  },
  {
    id: "palace",
    title: "Palace day and night",
    year: "2026",
    media: {
      kind: "pair",
      images: [
        photo("palace-night", [800, 1600], 2160, 2880, "The Palace of Fine Arts rotunda glowing gold at night"),
        photo("palace-day", [800, 1600], 2160, 2880, "The Palace of Fine Arts colonnade in bright daylight"),
      ],
    },
    index: { card: 742, w: 638, h: 419 },
    pile: { cx: 732, cy: 891.5, w: 638, h: 419, rotate: 0 },
  },
  {
    id: "concert-lights",
    title: "Concert lights",
    year: "2026",
    media: photo("concert-lights", [900, 1800], 2160, 2880, "Cyan laser beams fanning over a dark arena crowd"),
    index: { card: 546, w: 305, h: 407 },
    pile: { cx: 1047, cy: 748, w: 371, h: 495, rotate: 20.58 },
  },
  {
    id: "river",
    title: "River",
    year: "2026",
    media: photo("river-duotone", [900, 1800], 2160, 2880, "A rocky river running between evergreen banks, printed in a navy and cream duotone"),
    mat: "#fff2d9",
    index: { card: 546, w: 340, h: 454 },
    pile: { cx: 456, cy: 1101, w: 340, h: 454, rotate: 0 },
  },
  {
    id: "guernica",
    title: "A twist on Guernica",
    year: "2022",
    media: photo("guernica", [1300, 2360], 2360, 1640, "Black and white painting of overlapping figures, an eye and repeated 7:43 numerals"),
    index: { card: 756, w: 611, h: 425 },
    pile: { cx: 1085, cy: 1040, w: 611, h: 425, rotate: 16.85 },
  },
];

/* Index grid rows, left to right (Figma 645:2308). */
export const indexRows: string[][] = [
  ["portals", "friends-galore"],
  ["vsa-intros", "golden-sunrise"],
  ["palace", "concert-lights"],
  ["river", "guernica"],
];

/* Shuffle pile stacking order, bottom to top (Figma 510:6986 layer order). */
export const pileOrder = [
  "friends-galore",
  "river",
  "palace",
  "vsa-intros",
  "guernica",
  "golden-sunrise",
  "concert-lights",
  "portals",
];
