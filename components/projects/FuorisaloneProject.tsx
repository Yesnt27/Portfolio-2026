import Image from "next/image";
import Link from "next/link";
import ConnectFooter from "@/components/ConnectFooter";
import Navbar from "@/components/Navbar";
import PosterParallax from "@/components/projects/PosterParallax";
import ProjectMedia from "@/components/projects/ProjectMedia";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";
import { solImages } from "@/lib/sol-images";
import type { Project } from "@/lib/projects";

type FuorisaloneProjectProps = {
  project: Project;
};

/*
  Figma (node 309:95) insets the body column 277px into the 1920px frame and
  left-aligns it. The right side only needs enough room to keep the widest
  measure (1419px copy) off the edge, which is why the two paddings differ.
*/
const COLUMN = "mx-auto w-full max-w-page pl-content pr-gutter";
const EDGE = "mx-auto w-full max-w-page pl-edge pr-gutter";

/* Every screenshot and screen recording sits in the same 1267 x 713 frame. */
const MEDIA_FRAME = "relative w-full max-w-media overflow-hidden aspect-[1267/713]";

function SectionIntro({
  eyebrow,
  heading,
  headingId,
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
}) {
  return (
    <>
      <p className="font-body text-fuori-body font-bold text-fuori-grey">{eyebrow}</p>
      <h2
        id={headingId}
        className="mt-fuori-2xs max-w-copy font-body text-fuori-h2 font-bold leading-[1.25] text-white"
      >
        {heading}
      </h2>
    </>
  );
}

/* Captions are centered under the media column rather than the whole frame. */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-fuori-xs w-full max-w-media text-center font-body text-fuori-body font-medium text-fuori-grey">
      {children}
    </figcaption>
  );
}

export default function FuorisaloneProject({ project }: FuorisaloneProjectProps) {
  const { media } = fuorisaloneImages;
  const prototypeLink = project.links.find((link) => link.primary)?.href ?? "#";

  /*
    The three lead posters run as a grid whose columns carry their Figma widths,
    so the 29px gutters and relative sizes survive at any screen width.
  */
  const leadPosters = [
    { src: fuorisaloneImages.posterShowcase, alt: "Fuorisalone showcase poster", ratio: "467/604" },
    { src: fuorisaloneImages.posterFrame100, alt: "Fuorisalone 2024 Milan Design Week poster", ratio: "441/605" },
    { src: fuorisaloneImages.posterAhhhhh, alt: "Salone experimental poster", ratio: "441/604" },
  ];

  return (
    <article className="min-h-screen bg-black text-white">
      <Navbar variant="inner" theme="dark" />

      {/* Full-bleed opener: Figma runs it to x:-6 w:1932 so it overhangs the frame. */}
      <figure className="mx-auto w-full max-w-page">
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
      <header className={`${COLUMN} mt-fuori-xl`}>
        <Image
          src={fuorisaloneImages.logo}
          alt="Fuorisalone logo"
          width={234}
          height={102}
          className="h-auto w-full max-w-logo"
          priority
        />

        <h1 className="mt-fuori-md font-display text-fuori-title font-medium leading-[1.15] tracking-[-0.01em] text-white">
          {project.title}
        </h1>

        <p className="mt-fuori-sm max-w-[1022px] font-body text-fuori-body font-normal leading-[1.37] text-white">
          Experimental website for visitors of Fuorisalone design district 2024 and
          encapsulating all its exhibits with concise UX/UI design.
        </p>

        <p className="mt-fuori-sm font-body text-fuori-label font-bold text-white">Team</p>
        <div className="mt-fuori-sm font-body text-fuori-body font-normal leading-[1.37] text-white">
          <p>5 design coordinators (Me)</p>
          <p>No designated roles</p>
          <p>Collaborative work</p>
        </div>

        <a
          href={prototypeLink}
          className="mt-fuori-md inline-block font-body text-fuori-lead font-normal text-white transition-opacity hover:opacity-70"
        >
          View the final prototype →
        </a>
      </header>

      {/* The Problem */}
      <section className={`${COLUMN} mt-fuori-sm`} aria-labelledby="problem-heading">
        <SectionIntro
          eyebrow="The Problem"
          heading="The issue of overdesigning and missing the target audience"
          headingId="problem-heading"
        />

        <p className="mt-fuori-md max-w-[1236px] font-body text-fuori-body font-medium leading-[1.37] text-white">
          Many modern day websites tend to overachieve on certain aspects including
          visual design, without emphasis on the overarching user experience that can
          enhance the navigation experience with minimal interruptions. We aimed to
          create an experience where we intend to create a distinctive brand identity
          for the annual Fuorisalone design festival while bridging the intersections
          of UX/UI to create a site that is largely experimental and unique.
        </p>

        {/* Lead posters. Column tracks carry the Figma widths so the relative
            sizes and 29px gutters hold at any screen width. */}
        <div
          className="mt-fuori-sm grid w-full max-w-posters gap-fuori-gap"
          style={{ gridTemplateColumns: "467fr 441fr 441fr" }}
        >
          {leadPosters.map((poster) => (
            <div
              key={poster.src}
              className="relative border border-fuori-grey bg-white"
              style={{ aspectRatio: poster.ratio }}
            >
              <Image
                src={poster.src}
                alt={poster.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 470px"
              />
            </div>
          ))}
        </div>

        <p className="mt-fuori-xs w-full max-w-posters text-center font-body text-fuori-body font-medium text-fuori-grey">
          Exploring styles through initial iterations of high-fidelity posters
        </p>
      </section>

      {/* Poster collage — scroll-driven parallax, centre poster held still.
          Unlike the rest of the page this block is centered: Figma runs it from
          x:77 to x:1842, so it sits evenly inside the frame. */}
      <section
        className="mx-auto mt-fuori-lg w-full max-w-page px-gutter"
        aria-label="Poster iterations and graphic references"
      >
        <PosterParallax caption="Many, many poster iterations.." />
      </section>

      {/* Research */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="research-heading">
        <SectionIntro
          eyebrow="Research"
          heading="Catering to user personas and iterative design principles"
          headingId="research-heading"
        />

        <p className="mt-fuori-xs max-w-[966px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          Design process covered work on posters (more experimental), which then
          translated onto inspiration for our site which can be iterated on and
          narrowed in further.
        </p>

        <div className="mt-fuori-xs font-body text-fuori-sub font-medium leading-[1.37] text-fuori-grey">
          <p>Goals:</p>
          <ol className="mt-fuori-2xs list-decimal pl-[1.5em]">
            <li>Understand personas to converge design decisions</li>
            <li>Pinpoint important design principles to iterate on</li>
          </ol>
        </div>

        <figure className="mt-fuori-sm">
          {/* Figma clips this screenshot to the frame from the top edge. */}
          <div className={`${MEDIA_FRAME} border border-[#a8a8a8] bg-white`}>
            <Image
              src={fuorisaloneImages.figmaWorkspace}
              alt="Figma workspace showing mobile screen artboards connected by user flow lines"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1280px) 100vw, 1267px"
            />
          </div>
          <Caption>A snippet of our prototype work and graphic assets</Caption>
        </figure>
      </section>

      {/* Content strategy */}
      <section className={`${COLUMN} mt-fuori-lg`} aria-labelledby="content-strategy-heading">
        <SectionIntro
          eyebrow="Solution ideation"
          heading="Defining content strategy for implementation"
          headingId="content-strategy-heading"
        />

        <p className="mt-fuori-xs max-w-[943px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          We realized that in order to create a concise and natural experience for
          visitors, we needed to define a scope for our site, which involved creating
          user flows to visualize what people would experience to determine what
          information goes on the site, where it goes etc. I would assist in creating
          the content directions that guided the information displayed.
        </p>

        <figure className="mt-fuori-md">
          <div className={`${MEDIA_FRAME} border border-fuori-border`}>
            <Image
              src={fuorisaloneImages.contentStrategy}
              alt="Content strategy diagram showing exhibition, artist, and detail user flow"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1267px"
            />
          </div>
          <figcaption className="mt-fuori-xs w-full max-w-media text-center font-body text-fuori-body font-medium text-fuori-grey-light">
            A slide from our presentation deck outlining our user information flow in
            website navigation.
          </figcaption>
        </figure>
      </section>

      {/* Prototypes and testing */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="prototypes-heading">
        <SectionIntro
          eyebrow="Solution ideation"
          heading="Prototypes and testing"
          headingId="prototypes-heading"
        />

        <p className="mt-fuori-xs max-w-[1050px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          After many long hours of iteration and wireframes, building from our previous
          ideas, I consolidated our principles and brought them to life with an initial
          prototype, to see how things would look like in practice and prepared for
          feedback from users.
        </p>

        <figure className="mt-fuori-sm">
          <ProjectMedia
            kind="video"
            src={media.prototypeVideo}
            label="Fuorisalone prototype walkthrough"
            aspectClass="aspect-[1267/713]"
            maxWidthClass="max-w-media"
            borderClass="border border-fuori-grey"
            autoPlay
            loop
            muted
          />
          <Caption>
            A preview of our district selection page from one of our earlier design
            iterations
          </Caption>
        </figure>
      </section>

      {/* Final solution */}
      <section className={`${COLUMN} mt-fuori-lg`} aria-labelledby="implementation-heading">
        <SectionIntro
          eyebrow="Final Solution"
          heading="Implementation and Website flow"
          headingId="implementation-heading"
        />

        <div className="mt-fuori-xs flex max-w-media flex-col gap-fuori-xs font-body text-fuori-body font-medium leading-[1.37] text-white">
          <p>
            After taking in feedback about our initial prototype being the problem that
            users would have to figure out which interactions to choose first and how to
            get to them easier, we had to find a way to make that easier.
          </p>
          <p>
            I chose to settle on a design that would use presentation principles to
            garner interest and not have the user second guess which features they
            missed. After the district showcase, I let them explore the different
            sections via interactive features.
          </p>
        </div>

        <nav
          className="mt-fuori-md flex w-full max-w-media flex-wrap items-center justify-center gap-x-fuori-md gap-y-3 font-body text-fuori-body font-medium text-white"
          aria-label="Website flow"
        >
          <span>Homepage</span>
          <span aria-hidden="true" className="text-fuori-h2">
            →
          </span>
          <span>District Page</span>
          <span aria-hidden="true" className="text-fuori-h2">
            →
          </span>
          <span>Exhibit Showcase</span>
        </nav>

        <figure className="mt-fuori-lg">
          <ProjectMedia
            kind="video"
            src={media.districtSelection}
            label="District selection page prototype"
            aspectClass="aspect-[1267/713]"
            maxWidthClass="max-w-media"
            borderClass="border border-fuori-grey"
            autoPlay
            loop
            muted
          />
          <Caption>Updated and refined district selection page</Caption>
        </figure>

        <figure className="mt-fuori-lg">
          <ProjectMedia
            kind="video"
            src={media.districtShowcase}
            label="District showcase prototype"
            aspectClass="aspect-[1267/713]"
            maxWidthClass="max-w-media"
            borderClass="border border-fuori-grey"
            autoPlay
            loop
            muted
          />
          <Caption>Preview of district showcase and specific exhibits</Caption>
        </figure>

        <figure className="mt-fuori-lg">
          <ProjectMedia
            kind="video"
            src={media.exhibitShowcase}
            label="Exhibit page prototype"
            aspectClass="aspect-[1267/713]"
            maxWidthClass="max-w-media"
            borderClass="border border-fuori-grey"
            autoPlay
            loop
            muted
          />
          <Caption>Specific exhibit features and booking details page</Caption>
        </figure>
      </section>

      {/* Key learnings */}
      <section className={`${COLUMN} mt-fuori-md`} aria-labelledby="learnings-heading">
        <h2
          id="learnings-heading"
          className="font-body text-fuori-h2 font-black text-white"
        >
          Key Learnings
        </h2>

        <div className="mt-fuori-sm flex max-w-copy flex-col gap-fuori-xs font-body text-fuori-body font-medium leading-[1.37] text-white">
          <p>
            Designing interactions with constraints sharpens decisions. Working with new
            design features in Figma in tandem with brand identity and user flow across
            multiple weeks, It allows me to create from a set of trials that allows me to
            find the best designs to iterate towards.
          </p>
          <p>
            Don&rsquo;t be complacent with design. Good design is a process that requires
            drawing inspiration and learning from previous works. As such, I could not
            afford to be stagnant with my designs, but to always seek out and not assume
            that my design is &ldquo;the current best design&rdquo; in my head.
          </p>
          <p>
            Take your time. Styling and aesthetic are all aspects that take a good amount
            of time and research, and if you leave out the people and interaction factors,
            you&rsquo;ll start to deviate from who you are designing for and for what
            purpose.
          </p>
        </div>
      </section>

      {/* Next project — breaks out to the shallower 173px inset */}
      <section className={`${EDGE} mt-fuori-lg`}>
        <Link
          href="/#projects"
          className="font-body text-fuori-next font-medium text-white transition-opacity hover:opacity-70"
        >
          Next project →
        </Link>

        <Link
          href="/projects/sol"
          className="relative mt-fuori-sm block aspect-[1572/821] w-full max-w-next overflow-hidden transition-opacity hover:opacity-90"
          aria-label="Go to Sol / Figbuild 2026 project"
        >
          <Image
            src={solImages.projectTitle}
            alt="Next project preview: Sol"
            fill
            className="object-cover"
            sizes="(max-width: 1600px) 100vw, 1572px"
          />
        </Link>
      </section>

      <ConnectFooter />
    </article>
  );
}
