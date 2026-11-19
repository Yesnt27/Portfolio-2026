import type { VideoSource } from "@/components/ui/AutoVideo";

/* Rows of the home "WORK" list (Figma frame 483:143). */
export type WorkItem = {
  id: string;
  title: string[];
  meta: string;
  tags: string[];
  description?: string;
  href?: string;
  media?: { sources: VideoSource[]; poster: string; label: string };
};

export const workItems: WorkItem[] = [
  {
    id: "sol",
    title: ["Figbuild"],
    meta: "Competition-Spring 2026",
    tags: ["Product design"],
    description: "A metacognitive tracking app for everyday users",
    href: "/projects/sol",
    media: {
      sources: [{ src: "/images/sol/sol-preview.mp4", type: "video/mp4" }],
      poster: "/images/sol/sol-preview-poster.webp",
      label: "Sol demo: soft colour fields shifting like a mind's moods",
    },
  },
  {
    id: "fuorisalone",
    title: ["Fuorisalone", "Design district"],
    meta: "Concept-Spring 2026",
    tags: ["Conceptual", "Product design"],
    description: "Experimental website for Fuorisalone visitors 2024",
    href: "/projects/fuorisalone",
    media: {
      sources: [
        { src: "/images/fuorisalone/fuorisalone-preview.av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
        { src: "/images/fuorisalone/fuorisalone-preview.mp4", type: "video/mp4" },
      ],
      poster: "/images/fuorisalone/fuorisalone-preview-poster.webp",
      label: "Fuorisalone microsite intro: the Milano Design Week logo resolving over a courtyard",
    },
  },
  {
    id: "enactus-renovo",
    title: ["Enactus-Renovo"],
    meta: "Curricular-Coming soon",
    tags: ["Brand design"],
    description: "Rebranding of the Renovo organization",
  },
  {
    id: "clue",
    title: ["Clue"],
    meta: "",
    tags: [],
  },
];
