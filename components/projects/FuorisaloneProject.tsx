import Image from "next/image";
import Link from "next/link";
import ConnectFooter from "@/components/ConnectFooter";
import Navbar from "@/components/Navbar";
import ProjectMedia from "@/components/projects/ProjectMedia";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";
import { solImages } from "@/lib/sol-images";
import type { Project } from "@/lib/projects";

type FuorisaloneProjectProps = {
  project: Project;
};

/* max-w-page = --container-page. w-full is required so the box still fills up
   to that cap; mx-auto then centers the leftover space on wide monitors. */
const SECTION = "mx-auto w-full max-w-page px-gutter";



function SectionHeading({
  children,
  id,
  className = "text-white",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`text-center font-body text-[clamp(1.75rem,3.4vw,4rem)] font-bold uppercase tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}

export default function FuorisaloneProject({ project }: FuorisaloneProjectProps) {
  const { posters, media } = fuorisaloneImages;
  const prototypeLink = project.links.find((link) => link.primary)?.href ?? "#";

  // Widths/heights are the intrinsic sizes from Figma. Carrying them through
  // keeps each poster's aspect ratio correct and caps it at its designed size
  // instead of stretching every image to the full column.
  const collage = [
    { src: posters.p43, alt: "Design reference poster 1", w: 279, h: 439 },
    { src: posters.p47, alt: "Design reference poster 2", w: 217, h: 323 },
    { src: posters.p64, alt: "Design reference poster 3", w: 411, h: 305 },
    { src: posters.p56, alt: "Design reference poster 4", w: 251, h: 370 },
    { src: posters.p55, alt: "Design reference poster 5", w: 343, h: 511 },
    { src: posters.p46, alt: "Design reference poster 6", w: 271, h: 348 },
    { src: fuorisaloneImages.posterFrame100, alt: "Design reference poster 7", w: 441, h: 605 },
    { src: posters.p60, alt: "Design reference poster 8", w: 308, h: 434 },
    { src: posters.p61, alt: "Design reference poster 9", w: 203, h: 299 },
    { src: posters.p45, alt: "Design reference poster 10", w: 216, h: 294 },
    { src: posters.p54, alt: "Design reference poster 11", w: 233, h: 341 },
    { src: posters.p53, alt: "Design reference poster 12", w: 305, h: 451 },
    { src: posters.p62, alt: "Design reference poster 13", w: 411, h: 302 },
  ];

  return (
    <article className="min-h-screen bg-black text-white">
      <Navbar variant="inner" theme="dark" />

      {/* Figma opens on the video at y:254, directly under the 167px navbar, at
          x:-6 w:1932 so it overhangs the gutter rather than sitting inside it. */}
      <figure className="mx-auto mt-flow-md w-full max-w-page">
        <ProjectMedia
          kind="video"
          src={media.demoVideo}
          label="Fuorisalone demo video"
          aspectClass="aspect-[1932/942]"
          maxWidthClass="max-w-none"
          borderClass="border-[3px] border-white"
        />
      </figure>

      {/* Hero */}
      <header className={`${SECTION} mt-flow-md`}>
        {/* The title runs full width, then the year drops into a row it shares
            with the summary: "2024" ends near x:420 and the paragraph starts at
            x:550, so the two sit side by side under a full-width first line.
            display:contents puts both heading lines directly on the grid while
            keeping them inside a single h1. */}
        <div className="lg:grid lg:grid-cols-[auto_1fr] lg:items-start lg:gap-x-flow-lg lg:gap-y-flow-md">
          <h1 className="contents font-display text-[clamp(4rem,9.5vw,9.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-fuori-blue">
            <span className="block lg:col-span-2">Fuorisalone Microsite</span>
            <span className="block">2024</span>
          </h1>

          <p className="mt-flow-md max-w-[1022px] font-body text-[clamp(1.125rem,2.1vw,2.5rem)] font-black leading-snug text-white lg:mt-0">
            Experimental website for visitors of Fuorisalone design district 2024 and
            encapsulating all its exhibits with concise UX/UI design.
          </p>
        </div>

        {/* Right-aligned to the gutter in Figma (details end at x:1746). */}
        <div className="mt-flow-md flex flex-col items-end gap-flow-xs text-right font-body font-normal leading-relaxed text-white">
          <p className="text-[clamp(1rem,1.45vw,1.75rem)]">Team</p>
          <p className="text-[clamp(0.875rem,1.25vw,1.5rem)]">
            5 design coordinators &middot; No designated roles &middot; Collaborative work
          </p>
        </div>

        <a
          href={prototypeLink}
          className="mt-flow-lg inline-block font-body text-[clamp(1.25rem,3vw,3.5rem)] font-normal text-white transition-opacity hover:opacity-70"
        >
          final prototype →
        </a>
      </header>

      {/* Intro */}
      <section className={`${SECTION} mt-section`} aria-labelledby="intro-heading">
        <SectionHeading id="intro-heading">INTRO</SectionHeading>

        <p className="mx-auto mt-flow-sm max-w-[1052px] text-center font-body text-[clamp(1rem,1.35vw,1.5rem)] font-medium leading-relaxed text-fuori-grey">
          Many modern day websites tend to overachieve on certain aspects including
          visual design, without emphasis on the overarching user experience that can
          enhance the navigation experience with minimal interruptions. We aimed to
          create an experience where we intend to create a distinctive brand identity
          for the annual Fuorisalone design festival while bridging the intersections
          of UX/UI to create a site that is largely experimental and unique.
        </p>

        {/* Featured posters row */}
        <div className="mx-auto mt-flow-md flex flex-col items-center justify-center gap-flow-sm sm:flex-row sm:items-start">
          <div className="relative aspect-[441/605] w-full max-w-[360px] overflow-hidden border border-fuori-grey">
            <Image
              src={fuorisaloneImages.posterMain}
              alt="Fuorisalone 2024 main poster design"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="relative aspect-[441/605] w-full max-w-[360px] overflow-hidden border border-fuori-grey">
            <Image
              src={fuorisaloneImages.posterFrame100}
              alt="Fuorisalone poster iteration"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="relative aspect-[441/604] w-full max-w-[360px] overflow-hidden border border-fuori-grey">
            <Image
              src={fuorisaloneImages.posterAhhhhh}
              alt="Fuorisalone experimental poster"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        </div>

        <p className="mt-flow-sm text-center font-body text-[clamp(1rem,1.4vw,1.5rem)] font-medium text-fuori-grey">
          Exploring styles through initial iterations of high-fidelity posters
        </p>
      </section>

      {/* Collage */}
      <section className={`${SECTION} mt-section-lg`} aria-label="Design reference images and graphic assets">
        <div className="columns-2 gap-flow-sm sm:columns-3 lg:columns-5 [&>*]:mb-flow-sm">
          {collage.map((item) => (
            <div
              key={item.src}
              className="relative mx-auto w-full break-inside-avoid overflow-hidden"
              style={{ maxWidth: item.w }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={item.h}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 285px"
              />
            </div>
          ))}
        </div>

        <p className="mt-flow-sm text-center font-body text-[clamp(0.875rem,1.15vw,1.25rem)] font-medium text-fuori-grey">
          A snippet of our prototype work and graphic assets
        </p>
      </section>

      {/* Process */}
      <section className={`${SECTION} mt-section`} aria-labelledby="process-heading">
        <SectionHeading id="process-heading">PROCESS</SectionHeading>

        <ol className="mx-auto mt-flow-sm flex max-w-[860px] list-decimal flex-col gap-flow-sm pl-8 text-center marker:text-fuori-grey">
          <li className="font-body text-[clamp(0.9375rem,1.25vw,1.375rem)] font-medium leading-relaxed text-fuori-grey">
            Each group member worked collaboratively, aligning tasks with our
            respective strengths.
          </li>
          <li className="font-body text-[clamp(0.9375rem,1.25vw,1.375rem)] font-medium leading-relaxed text-fuori-grey">
            Design process covered work on posters (more experimental), which then
            translated onto inspiration for our site which can be iterated on and
            narrowed in further.
          </li>
        </ol>

        <figure className="mt-flow-md">
          <div className="relative mx-auto aspect-[1512/1239] w-full max-w-[1120px] overflow-hidden border border-[#a8a8a8]">
            <Image
              src={fuorisaloneImages.figmaWorkspace}
              alt="Figma workspace showing mobile screen artboards connected by user flow lines"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1120px) 100vw, 1120px"
            />
          </div>
        </figure>
      </section>

      {/* Content Strategy */}
      <section className={`${SECTION} mt-section`} aria-labelledby="content-strategy-heading">
        <SectionHeading id="content-strategy-heading">CONTENT STRATEGY</SectionHeading>

        <p className="mx-auto mt-flow-sm max-w-[860px] text-center font-body text-[clamp(0.9375rem,1.2vw,1.375rem)] font-medium leading-relaxed text-white">
          We realized that in order to create a concise and natural experience for
          visitors, we needed to define a scope for our site, which involved creating
          user flows to visualize what people would experience to determine what
          information goes on the site, where it goes etc. I would assist in creating
          the content directions that guided the information displayed.
        </p>

        <figure className="mt-flow-md">
          <div className="relative mx-auto aspect-[1006/566] w-full max-w-[820px] overflow-hidden border border-fuori-border">
            <Image
              src={fuorisaloneImages.contentStrategy}
              alt="Content strategy diagram showing exhibition, artist, and detail user flow"
              fill
              className="object-cover"
              sizes="(max-width: 820px) 100vw, 820px"
            />
          </div>
          <figcaption className="mx-auto mt-flow-xs max-w-[680px] text-center font-body text-[clamp(0.875rem,1.15vw,1.25rem)] font-medium text-fuori-grey-light">
            A slide from our presentation deck outlining our user information flow in
            website navigation.
          </figcaption>
        </figure>

        <figure className="mt-flow-md">
          <ProjectMedia
            kind="video"
            src={media.screenRecording}
            label="Screen recording of early prototype"
            aspectClass="aspect-[1418/801]"
            maxWidthClass="max-w-[1120px]"
          />
          <figcaption className="mt-flow-sm text-center font-body text-[clamp(0.875rem,1.15vw,1.25rem)] font-medium text-fuori-grey">
            A preview of our district selection page from one of our earlier design
            iterations
          </figcaption>
        </figure>
      </section>

      {/* Implementation */}
      <section className={`${SECTION} mt-section-lg`} aria-labelledby="implementation-heading">
        <h2
          id="implementation-heading"
          className="mx-auto max-w-[860px] text-center font-body text-[clamp(1.875rem,3.4vw,4rem)] font-bold leading-tight text-white"
        >
          Implementation and Website flow
        </h2>

        <p className="mx-auto mt-flow-sm max-w-[1000px] text-center font-body text-[clamp(0.9375rem,1.2vw,1.375rem)] font-medium leading-relaxed text-white">
          After all ideations and directions were established, I set about implementing
          the design using Figma prototype mode. We set about creating 3 main flows for
          the website:
        </p>

        <nav
          className="mt-flow-sm flex flex-wrap items-center justify-center gap-x-[clamp(0.75rem,2.8vw,3.5rem)] gap-y-3 font-body text-[clamp(1rem,1.5vw,1.75rem)] font-medium text-white"
          aria-label="Website flow"
        >
          <span>Homepage</span>
          <span aria-hidden="true">→</span>
          <span>District Page</span>
          <span aria-hidden="true">→</span>
          <span>Exhibit Showcase</span>
        </nav>

        <div className="mt-flow-sm flex flex-col items-center gap-flow-md">
          <ProjectMedia
            kind="video"
            src={media.districtSelection}
            label="District selection page prototype"
            aspectClass="aspect-[1520/950]"
            maxWidthClass="max-w-[1120px]"
            autoPlay
            loop
            muted
          />
          <ProjectMedia
            kind="video"
            src={media.districtShowcase}
            label="Brera district page prototype"
            aspectClass="aspect-[1520/893]"
            maxWidthClass="max-w-[1120px]"
            autoPlay
            loop
            muted
          />
          <ProjectMedia
            kind="video"
            src={media.exhibitShowcase}
            label="Exhibit page prototype"
            aspectClass="aspect-[1522/952]"
            maxWidthClass="max-w-[1120px]"
            autoPlay
            loop
            muted
          />
        </div>
      </section>

      {/* Key Takeaways */}
      <section className={`${SECTION} mt-section-lg`} aria-labelledby="takeaways-heading">
        <SectionHeading id="takeaways-heading" className="font-black text-fuori-cyan">
          KEY TAKEAWAYS
        </SectionHeading>

        <p className="mx-auto mt-flow-sm max-w-[1200px] text-center font-body text-[clamp(1rem,1.5vw,1.75rem)] font-medium leading-relaxed text-white">
          Designing interactions and site creation is a process. Working with new design
          features in Figma in tandem with brand identity and user flow across multiple
          weeks, It allows me to create a proper prototype showcasing experimental
          interactions with intention.
        </p>
      </section>

      {/* Next Project */}
      <section className={`${SECTION} mt-section flex flex-col items-center`}>
        <Link
          href="/#projects"
          className="font-body text-[clamp(1.25rem,2vw,2.5rem)] font-medium text-white transition-opacity hover:opacity-70"
        >
          Next project →
        </Link>
        <div className="mt-flow-sm w-full">
          <ProjectMedia
            kind="image"
            src={solImages.projectTitle}
            label="Next project preview"
            aspectClass="aspect-[2245/1295]"
            maxWidthClass="max-w-[1200px]"
            borderClass=""
          />
        </div>
      </section>

      <ConnectFooter />
    </article>
  );
}
