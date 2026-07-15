import Image from "next/image";
import Link from "next/link";
import ConnectFooter from "@/components/ConnectFooter";
import Navbar from "@/components/Navbar";
import ProjectMedia from "@/components/projects/ProjectMedia";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";
import type { Project } from "@/lib/projects";

type FuorisaloneProjectProps = {
  project: Project;
};

const SECTION = "mx-auto max-w-[1920px] px-[clamp(1.5rem,5vw,6rem)]";

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
      className={`text-center font-body text-[clamp(2rem,4.2vw,5rem)] font-bold uppercase tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}

export default function FuorisaloneProject({ project }: FuorisaloneProjectProps) {
  const { posters, media } = fuorisaloneImages;
  const prototypeLink = project.links.find((link) => link.primary)?.href ?? "#";

  const collage = [
    { src: posters.p43, alt: "Design reference poster 1" },
    { src: posters.p47, alt: "Design reference poster 2" },
    { src: posters.p64, alt: "Design reference poster 3" },
    { src: posters.p56, alt: "Design reference poster 4" },
    { src: posters.p55, alt: "Design reference poster 5" },
    { src: posters.p46, alt: "Design reference poster 6" },
    { src: fuorisaloneImages.posterFrame100, alt: "Design reference poster 7" },
    { src: posters.p60, alt: "Design reference poster 8" },
    { src: posters.p61, alt: "Design reference poster 9" },
    { src: posters.p45, alt: "Design reference poster 10" },
    { src: posters.p54, alt: "Design reference poster 11" },
    { src: posters.p53, alt: "Design reference poster 12" },
    { src: posters.p62, alt: "Design reference poster 13" },
  ];

  return (
    <article className="min-h-screen bg-black text-white">
      <Navbar variant="inner" theme="dark" />

      {/* Hero */}
      <header className={`${SECTION} flex flex-col items-center pt-[clamp(3rem,6vw,7.5rem)] text-center`}>
        <h1 className="font-display text-[clamp(3.5rem,8.5vw,8.125rem)] font-medium leading-[1.05] tracking-[-0.02em] text-fuori-blue">
          Fuorisalone Microsite
          <br />
          2024
        </h1>

        <p className="mt-[clamp(1.5rem,3vw,3.125rem)] max-w-[1022px] font-body text-[clamp(1.25rem,2.6vw,3.125rem)] font-black leading-snug text-white">
          Experimental website for visitors of Fuorisalone design district 2024 and
          encapsulating all its exhibits with concise UX/UI design.
        </p>

        <div className="mt-[clamp(1.5rem,3vw,3rem)] font-body text-[clamp(1rem,1.5vw,1.875rem)] font-normal leading-relaxed text-white">
          <p className="text-[clamp(1.25rem,2vw,2.1875rem)]">Team</p>
          <p>5 design coordinators &middot; No designated roles &middot; Collaborative work</p>
        </div>

        <a
          href={prototypeLink}
          className="mt-[clamp(2rem,4vw,5rem)] font-body text-[clamp(1.5rem,4vw,5rem)] font-normal text-white transition-opacity hover:opacity-70"
        >
          final prototype →
        </a>

        <figure className="mt-[clamp(2rem,4vw,3rem)] w-full">
          <ProjectMedia
            kind="video"
            src={media.demoVideo}
            label="Fuorisalone demo video"
            aspectClass="aspect-[1932/942]"
            maxWidthClass="max-w-[1920px]"
            borderClass="border-[3px] border-white"
          />
        </figure>
      </header>

      {/* Intro */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)]`} aria-labelledby="intro-heading">
        <SectionHeading id="intro-heading">INTRO</SectionHeading>

        <p className="mx-auto mt-[clamp(2rem,4vw,3rem)] max-w-[1052px] text-center font-body text-[clamp(1.125rem,2vw,1.875rem)] font-medium leading-relaxed text-fuori-grey">
          Many modern day websites tend to overachieve on certain aspects including
          visual design, without emphasis on the overarching user experience that can
          enhance the navigation experience with minimal interruptions. We aimed to
          create an experience where we intend to create a distinctive brand identity
          for the annual Fuorisallone design festival while bridging the intersections
          of UX/UI to create a site that is largely experimental and unique.
        </p>

        {/* Featured posters row */}
        <div className="mx-auto mt-[clamp(3rem,6vw,5rem)] flex max-w-[1400px] flex-col items-center justify-center gap-6 sm:flex-row sm:items-start">
          <div className="relative aspect-[467/604] w-full max-w-[467px] overflow-hidden border border-fuori-grey bg-white">
            <Image
              src={fuorisaloneImages.posterMain}
              alt="Fuorisalone 2024 main poster design"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="relative aspect-[441/605] w-full max-w-[441px] overflow-hidden border border-fuori-grey">
            <Image
              src={fuorisaloneImages.posterFrame100}
              alt="Fuorisalone poster iteration"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="relative aspect-[441/604] w-full max-w-[441px] overflow-hidden border border-fuori-grey">
            <Image
              src={fuorisaloneImages.posterAhhhhh}
              alt="Fuorisalone experimental poster"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        </div>

        <p className="mt-[clamp(2rem,4vw,3rem)] text-center font-body text-[clamp(1.25rem,2.1vw,2.5rem)] font-medium text-fuori-grey">
          Exploring styles through initial iterations of high-fidelity posters
        </p>
      </section>

      {/* Collage */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)]`} aria-label="Design reference images and graphic assets">
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-5 [&>*]:mb-3">
          {collage.map((item) => (
            <div key={item.src} className="relative w-full break-inside-avoid overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                width={400}
                height={533}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </div>
          ))}
        </div>

        <p className="mt-[clamp(2rem,4vw,3rem)] text-center font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium text-fuori-grey">
          A snippet of our prototype work and graphic assets
        </p>
      </section>

      {/* Process */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)]`} aria-labelledby="process-heading">
        <SectionHeading id="process-heading">PROCESS</SectionHeading>

        <ol className="mx-auto mt-[clamp(2rem,4vw,3rem)] flex max-w-[900px] list-decimal flex-col gap-6 pl-8 text-center marker:text-fuori-grey">
          <li className="font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium leading-relaxed text-fuori-grey">
            Each group member worked collaboratively, aligning tasks with our
            respective strengths.
          </li>
          <li className="font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium leading-relaxed text-fuori-grey">
            Design process covered work on posters (more experimental), which then
            translated onto inspiration for our site which can be iterated on and
            narrowed in further.
          </li>
        </ol>

        <figure className="mt-[clamp(3rem,6vw,5rem)]">
          <div className="relative mx-auto aspect-[1512/1239] w-full max-w-[1512px] overflow-hidden border border-[#a8a8a8]">
            <Image
              src={fuorisaloneImages.figmaWorkspace}
              alt="Figma workspace showing mobile screen artboards connected by user flow lines"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1512px) 100vw, 1512px"
            />
          </div>
        </figure>
      </section>

      {/* Content Strategy */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)]`} aria-labelledby="content-strategy-heading">
        <SectionHeading id="content-strategy-heading">CONTENT STRATEGY</SectionHeading>

        <p className="mx-auto mt-[clamp(1.5rem,3vw,3.75rem)] max-w-[943px] text-center font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium leading-relaxed text-white">
          We realized that in order to create a concise and natural experience for
          visitors, we needed to define a scope for our site, which involved creating
          user flows to visualize what people would experience to determine what
          information goes on the site, where it goes etc. I would assist in creating
          the content directions that guided the information displayed.
        </p>

        <figure className="mt-[clamp(1.5rem,3vw,3.75rem)]">
          <div className="relative mx-auto aspect-[1006/566] w-full max-w-[1006px] overflow-hidden border border-fuori-border">
            <Image
              src={fuorisaloneImages.contentStrategy}
              alt="Content strategy diagram showing exhibition, artist, and detail user flow"
              fill
              className="object-cover"
              sizes="(max-width: 1006px) 100vw, 1006px"
            />
          </div>
          <figcaption className="mx-auto mt-4 max-w-[726px] text-center font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium text-fuori-grey-light">
            A slide from our presentation deck outlining our user information flow in
            website navigation.
          </figcaption>
        </figure>

        <figure className="mt-[clamp(2rem,4vw,5rem)]">
          <ProjectMedia
            kind="video"
            src={media.screenRecording}
            label="Screen recording of early prototype"
            aspectClass="aspect-[1418/801]"
            maxWidthClass="max-w-[1418px]"
          />
          <figcaption className="mt-4 text-center font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium text-fuori-grey">
            A preview of our district selection page from one of our earlier design
            iterations
          </figcaption>
        </figure>
      </section>

      {/* Implementation */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)]`} aria-labelledby="implementation-heading">
        <h2
          id="implementation-heading"
          className="mx-auto max-w-[976px] text-center font-body text-[clamp(2.5rem,5.2vw,6.25rem)] font-bold leading-tight text-white"
        >
          Implementation and Website flow
        </h2>

        <p className="mx-auto mt-[clamp(2rem,4vw,3rem)] max-w-[1232px] text-center font-body text-[clamp(1rem,1.5vw,1.875rem)] font-medium leading-relaxed text-white">
          After all ideations and directions were established, I set about implementing
          the design using Figma prototype mode. We set about creating 3 main flows for
          the website:
        </p>

        <nav
          className="mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center justify-center gap-x-[clamp(1rem,4vw,5rem)] gap-y-3 font-body text-[clamp(1.25rem,2.1vw,2.5rem)] font-medium text-white"
          aria-label="Website flow"
        >
          <span>Homepage</span>
          <span aria-hidden="true">→</span>
          <span>District Page</span>
          <span aria-hidden="true">→</span>
          <span>Exhibit Showcase</span>
        </nav>

        <div className="mt-[clamp(2rem,4vw,5rem)] flex flex-col items-center gap-[clamp(2rem,4vw,5rem)]">
          <ProjectMedia
            kind="image"
            src={media.districtSelection}
            label="District selection page mockup"
            aspectClass="aspect-[1520/950]"
            maxWidthClass="max-w-[1520px]"
          />
          <ProjectMedia
            kind="image"
            src={media.breraPage}
            label="Brera district page mockup"
            aspectClass="aspect-[1520/893]"
            maxWidthClass="max-w-[1520px]"
          />
          <ProjectMedia
            kind="image"
            src={media.exhibitPage}
            label="Exhibit page mockup"
            aspectClass="aspect-[1522/952]"
            maxWidthClass="max-w-[1522px]"
          />
        </div>
      </section>

      {/* Key Takeaways */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)]`} aria-labelledby="takeaways-heading">
        <SectionHeading id="takeaways-heading" className="font-black text-fuori-cyan">
          KEY TAKEAWAYS
        </SectionHeading>

        <p className="mx-auto mt-[clamp(2rem,3vw,3.75rem)] max-w-[1419px] text-center font-body text-[clamp(1.25rem,2.1vw,2.5rem)] font-medium leading-relaxed text-white">
          Designing interactions and site creation is a process. Working with new design
          features in Figma in tandem with brand identity and user flow across multiple
          weeks, It allows me to create a proper prototype showcasing experimental
          interactions with intention.
        </p>
      </section>

      {/* Next Project */}
      <section className={`${SECTION} mt-[clamp(4rem,8vw,8rem)] flex flex-col items-center`}>
        <Link
          href="/#projects"
          className="font-body text-[clamp(1.5rem,2.6vw,3.125rem)] font-medium text-white transition-opacity hover:opacity-70"
        >
          Next project →
        </Link>
        <div className="mt-6 w-full">
          <ProjectMedia
            kind="image"
            src={media.nextProject}
            label="Next project preview"
            aspectClass="aspect-[1567/778]"
            maxWidthClass="max-w-[1567px]"
            borderClass=""
          />
        </div>
      </section>

      <ConnectFooter />
    </article>
  );
}
