"use client";

import Link from "next/link";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";
import { solImages } from "@/lib/sol-images";

type ProjectCard = {
  id: string;
  title: string;
  href: string;
  videoSrc?: string;
  enabled?: boolean;
};

const cards: ProjectCard[] = [
  {
    id: "fuorisalone",
    title: "Fuorisalone 2025",
    href: "/projects/fuorisalone",
    videoSrc: fuorisaloneImages.media.demoVideo,
    enabled: true,
  },
  {
    id: "sol",
    title: "Figbuild 2026",
    href: "/projects/sol",
    videoSrc: solImages.demoVideo,
    enabled: true,
  },
];

function ProjectMediaCard({ card }: { card: ProjectCard }) {
  const media = (
    <div className="group relative block w-full">
      <div className="relative aspect-[586/330] w-full overflow-hidden border-[3px] border-white bg-black transition-transform duration-300 ease-out group-hover:scale-[1.04]">
        {card.videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={`${card.title} preview`}
          >
            <source src={card.videoSrc} />
          </video>
        ) : null}
      </div>
      <p className="mt-[clamp(0.75rem,calc(min(100vw,1920px)*19/1920),1.1875rem)] font-display text-[clamp(1.0625rem,calc(min(100vw,1920px)*30/1920),1.875rem)] font-normal leading-[0.92] text-white">
        {card.title}
      </p>
    </div>
  );

  if (!card.enabled) {
    return (
      <div className="opacity-80" aria-label={`${card.title} coming soon`}>
        {media}
      </div>
    );
  }

  return (
    <Link href={card.href} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      {media}
    </Link>
  );
}

export default function ProjectsGrid() {
  return (
    <section
      id="projects"
      className="mx-auto mt-[clamp(2.5rem,calc(min(100vw,1920px)*140/1920),8.75rem)] w-full max-w-page px-[clamp(1.25rem,calc(min(100vw,1920px)*59/1920),3.6875rem)]"
      aria-label="Projects"
    >
      <div className="grid grid-cols-1 gap-[clamp(1.25rem,calc(min(100vw,1920px)*29/1920),1.8125rem)] overflow-visible py-2 md:grid-cols-3">
        {cards.map((card) => (
          <ProjectMediaCard key={card.id} card={card} />
        ))}
        <div className="hidden md:block" aria-hidden="true" />
      </div>
    </section>
  );
}
