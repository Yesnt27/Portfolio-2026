import Image from "next/image";
import Link from "next/link";
import ConnectFooter from "@/components/ConnectFooter";
import Navbar from "@/components/Navbar";
import ProjectMedia from "@/components/projects/ProjectMedia";
import { solImages } from "@/lib/sol-images";
import type { Project } from "@/lib/projects";

type SolProjectProps = {
  project: Project;
};

/*
  Figma Sol frame (node 240:3) uses the same left-aligned column as Fuorisalone
  (~286px inset on a 1920 frame). Reuse the shared fuori-* tokens so both case
  studies share one spacing/type rhythm.
*/
const COLUMN = "mx-auto w-full max-w-page pl-content pr-gutter";
const EDGE = "mx-auto w-full max-w-page pl-edge pr-gutter";

function SectionIntro({
  eyebrow,
  heading,
  headingId,
  large = false,
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
  large?: boolean;
}) {
  return (
    <>
      <p className="font-body text-fuori-body font-bold text-fuori-grey">{eyebrow}</p>
      <h2
        id={headingId}
        className={`mt-fuori-2xs max-w-copy font-body font-bold leading-[1.25] text-white ${
          large ? "text-fuori-lead" : "text-fuori-h2"
        }`}
      >
        {heading}
      </h2>
    </>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-fuori-xs w-full max-w-media text-center font-body text-fuori-body font-medium text-fuori-grey">
      {children}
    </figcaption>
  );
}

export default function SolProject({ project }: SolProjectProps) {
  const pitchLink = project.links.find((link) => link.label.toLowerCase().includes("pitch"))?.href
    ?? project.links.find((link) => link.primary)?.href
    ?? "#";
  const prototypeLink =
    project.links.find((link) => link.label.toLowerCase().includes("prototype"))?.href ?? "#";

  return (
    <article className="min-h-screen bg-page text-white">
      <Navbar variant="inner" theme="dark" />

      {/* Full-bleed opener — Figma: 1920 x 1080 Sol demo video */}
      <figure className="mx-auto w-full max-w-page">
        <ProjectMedia
          kind="video"
          src={solImages.demoVideo}
          label="Sol demo video"
          aspectClass="aspect-[1920/1080]"
          maxWidthClass="max-w-none"
          borderClass="border-[3px] border-white"
          autoPlay
          loop
          muted
        />
      </figure>

      {/* Hero */}
      <header className={`${COLUMN} mt-fuori-xl`}>
        <Image
          src={solImages.appIcon}
          alt="Sol app icon"
          width={185}
          height={185}
          className="h-auto w-[clamp(5.5rem,calc(min(100vw,1920px)*185/1920),11.5625rem)]"
          priority
        />

        <h1 className="mt-fuori-md font-display text-fuori-title font-medium leading-[1.15] tracking-[-0.01em] text-white">
          {project.title}
        </h1>

        <p className="mt-fuori-sm max-w-[903px] font-body text-fuori-body font-normal leading-[1.37] text-white">
          Sol is an app for tracking and logging various aspects of our mental state. It
          acts as an extension of our body&rsquo;s sensory experience of metacognition —
          our awareness of aspects of our thinking such as cognitive states, stress
          levels, and emotional intensity.
        </p>

        <p className="mt-fuori-sm font-body text-fuori-label font-bold text-white">Team</p>
        <div className="mt-fuori-xs font-body text-fuori-body font-normal leading-[1.37] text-white">
          <p>3 design coordinators</p>
          <p>2 designers (Me)</p>
        </div>

        <a
          href={pitchLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-fuori-md inline-block font-body text-cta-lg font-normal text-white transition-opacity hover:opacity-70"
        >
          View the pitch video →
        </a>
      </header>

      {/* The Problem */}
      <section className={`${COLUMN} mt-fuori-sm`} aria-labelledby="problem-heading">
        <SectionIntro
          eyebrow="The Problem"
          heading="The Case for Quantification"
          headingId="problem-heading"
        />
        <p className="mt-fuori-md max-w-[1052px] font-body text-fuori-sub font-medium leading-[1.75] text-white">
          Industrial technology freed people from needing physical labour to survive,
          leading many to compensate by exercising at gyms and monitoring their fitness.
          A similar shift is now happening with mental labour as AI takes over cognitive
          tasks. Given this shift, we proposed a tool to help people monitor their mental
          activity and stay intentional about their cognitive habits, much like a gym
          tracks physical ones.
        </p>
      </section>

      {/* The Inspiration */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="inspiration-heading">
        <SectionIntro
          eyebrow="The Inspiration"
          heading="Defining a theme"
          headingId="inspiration-heading"
        />
        <p className="mt-fuori-xs max-w-[1018px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          Sol takes its name from the sun, the soul, and the cyclical passage of time
          represented by sols on Mars. The concept reflects the mind as a dynamic system
          of thoughts, emotions, and stress that shift in patterns over time.
        </p>

        <figure className="mt-fuori-sm">
          <div className="relative aspect-[1018/995] w-full max-w-[1018px] overflow-hidden">
            <Image
              src={solImages.planet}
              alt="Solar-system inspired Sol homepage visualization"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1018px"
            />
          </div>
          <Caption>
            Our first visualization of the homepage, inspired by the solar system.
          </Caption>
        </figure>
      </section>

      {/* Design Decision */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="design-decision-heading">
        <SectionIntro
          eyebrow="Design Decision"
          heading="Information management"
          headingId="design-decision-heading"
        />

        <div className="mt-fuori-sm grid w-full max-w-[1366px] gap-fuori-md lg:grid-cols-2">
          <div>
            <h3 className="font-body text-fuori-body font-bold text-white">Content</h3>
            <div className="mt-fuori-xs flex flex-col gap-fuori-xs font-body text-fuori-sub font-medium leading-[1.37] text-white">
              <p>
                Serious analysis: Clear, consistent visualizations that reveal long-term
                behavioural patterns across time.
              </p>
              <p>
                Simple + deep views: Quick summaries for daily reflection with optional
                detailed analytics.
              </p>
              <p>
                Health alerts: Live tracking with notifications to flag positive progress
                or potential issues.
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-body text-fuori-body font-bold text-white">Quality of life</h3>
            <div className="mt-fuori-xs flex flex-col gap-fuori-xs font-body text-fuori-sub font-medium leading-[1.37] text-white">
              <p>
                Less noise, useful data: Automated insights with minimal clutter and
                reduced technical jargon.
              </p>
              <p>
                Manual logging: Users can record personal observations to support
                self-quantification.
              </p>
              <p>
                Shareability: QR/NFC reports allow easy sharing of summarized insights
                with professionals or peers.
              </p>
            </div>
          </div>
        </div>

        <figure className="mt-fuori-lg">
          <div className="relative aspect-[1296/1012] w-full max-w-[1296px] overflow-hidden border border-white">
            <Image
              src={solImages.mindMap}
              alt="Mind map of Sol app flow with insights for each section"
              fill
              className="object-cover"
              sizes="(max-width: 1300px) 100vw, 1296px"
            />
          </div>
          <Caption>
            An initial mind map of our app flow with insights for each section.
          </Caption>
        </figure>
      </section>

      {/* Research */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="research-heading">
        <SectionIntro
          eyebrow="Research"
          heading="Initial research and safeguards"
          headingId="research-heading"
        />
        <p className="mt-fuori-xs max-w-[1223px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          To make sure we didn&rsquo;t miss any considerations, We made sure to consult
          multiple peer reviewed sources on the field of cognitive science. I also made
          sure to cover the potential safeguards of the product, such as privacy and
          consent concerns, fail-safes for over-monitoring, and more.
        </p>

        <figure className="mt-fuori-sm">
          <div className="flex w-full max-w-[1223px] flex-col gap-fuori-sm sm:flex-row sm:items-start">
            <div className="relative aspect-[715/474] w-full flex-1 overflow-hidden">
              <Image
                src={solImages.researchDiagram1}
                alt="Data visualization research diagram"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 715px"
              />
            </div>
            <div className="relative aspect-square w-full max-w-[474px] overflow-hidden sm:w-[39%]">
              <Image
                src={solImages.researchDiagram2}
                alt="Cognitive science research figure"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 474px"
              />
            </div>
          </div>
          <Caption>Important diagrams of data visualization in research done.</Caption>
        </figure>
      </section>

      {/* Case Study 1 */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="case-study-heading">
        <SectionIntro
          eyebrow="Case Study 1"
          heading="Turning observations into verifiable insights"
          headingId="case-study-heading"
        />
        <p className="mt-fuori-xs max-w-[1085px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          Taking users feedback about usability of the app, I took the time to add real
          time changes that are observable insights to reinforce the idea of the
          quantified self. In turn it helps give the user a sense that solidifies their
          habit-building.
        </p>

        <div className="mt-fuori-sm flex flex-wrap items-end justify-start gap-[clamp(1rem,calc(min(100vw,1920px)*30/1920),1.875rem)]">
          {[
            { src: solImages.phoneWeekly, alt: "Sol weekly page phone mockup" },
            { src: solImages.phoneInsights, alt: "Sol insights page phone mockup" },
            { src: solImages.phoneHome, alt: "Sol home page phone mockup" },
          ].map((phone) => (
            <div key={phone.src} className="relative aspect-[238/481] w-[clamp(7rem,calc(min(100vw,1920px)*238/1920),14.875rem)]">
              <Image
                src={phone.src}
                alt={phone.alt}
                fill
                className="object-contain"
                sizes="240px"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Solution ideation — product definition */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="product-definition-heading">
        <SectionIntro
          eyebrow="Solution ideation"
          heading="Changing the product definition"
          headingId="product-definition-heading"
        />
        <p className="mt-fuori-xs max-w-[1115px] font-body text-fuori-sub font-medium leading-[1.37] text-white">
          Nowadays, the idea of self-quantification is encompassed by many companies and
          made in many different ways. Informed by this, I opted to make many revisions
          and iterations to how the self quantification would be implemented before
          finalizing the idea.
        </p>

        <figure className="mt-fuori-sm">
          <div className="relative aspect-[1314/739] w-full max-w-[1314px] overflow-hidden border border-white">
            <Image
              src={solImages.useCases}
              alt="Case study scenarios showing effects of Sol"
              fill
              className="object-cover"
              sizes="(max-width: 1314px) 100vw, 1314px"
            />
          </div>
          <Caption>
            A case study that our group did on the effects of Sol with scenarios.
          </Caption>
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
          I proposed a few ways that this solution could work in real-life, with
          considerations on practicality and mobility stances. We also asked a few users
          what they would like to see in what this product could look like based on its
          use cases.
        </p>

        <figure className="mt-fuori-sm">
          <div className="flex w-full max-w-[1410px] flex-col gap-fuori-sm lg:flex-row lg:items-stretch">
            <div className="relative aspect-[534/582] w-full max-w-[534px] overflow-hidden border border-white">
              <Image
                src={solImages.earpiece1}
                alt="3D render of Sol earpiece product"
                fill
                className="object-cover"
                sizes="534px"
              />
            </div>
            <div className="relative aspect-[824/582] w-full flex-1 overflow-hidden border border-white bg-[#4e3a6e]">
              <Image
                src={solImages.earpiece2}
                alt="3D renders of Sol earpiece from multiple angles"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 824px"
              />
            </div>
          </div>
          <Caption>
            Some 3D renders of our physical earpiece product as a physical placeholder.
          </Caption>
        </figure>
      </section>

      {/* Final Solution */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="final-solution-heading">
        <SectionIntro
          eyebrow="Final Solution"
          heading="Observations, verifiable insights and self-reflection"
          headingId="final-solution-heading"
        />
        <div className="mt-fuori-xs max-w-[1246px] font-body text-fuori-sub font-medium leading-[1.25] text-white">
          <p>
            To ground the product in real life use cases, I imagined how different users
            might interact with Sol day-to-day.
          </p>
          <p className="mt-fuori-2xs">
            We made sure to include a working digital prototype to bring everything
            together.
          </p>
        </div>

        <a
          href={prototypeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-fuori-sm inline-block font-body text-cta-md font-normal text-white transition-opacity hover:opacity-70"
        >
          View the final prototype →
        </a>

        <figure className="mt-fuori-md">
          {/*
            Figma canvas: 1506×958 — left 722×958 weekly, right 755×958 split
            into 755×526 home + 755×432 row with 358×431 earphones at bottom-left.
          */}
          <div className="relative hidden aspect-[1506/958] w-full max-w-[1506px] lg:block">
            <div className="absolute inset-0 grid grid-cols-[722fr_755fr] gap-fuori-gap">
              <div className="relative min-h-0 overflow-hidden border border-black bg-[#3a3a3a]">
                <Image
                  src={solImages.finalWeekly}
                  alt="Final Sol weekly and comparison screens"
                  fill
                  className="object-cover"
                  sizes="722px"
                />
              </div>
              <div className="relative min-h-0 grid grid-rows-[auto_1fr] gap-fuori-md">
                <div className="relative aspect-[755/480] w-full overflow-hidden border border-black bg-[#3a3a3a]">
                  <Image
                    src={solImages.finalHome}
                    alt="Final Sol home and insights screens"
                    fill
                    className="object-cover object-left-top"
                    sizes="755px"
                  />
                </div>
                <div className="relative min-h-0">
                  <div className="absolute bottom-0 left-0 aspect-[358/431] w-[47.42%]">
                    <Image
                      src={solImages.finalEarphones}
                      alt="Sol earphones with gradient background"
                      fill
                      className="object-cover object-bottom"
                      sizes="358px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-fuori-sm lg:hidden">
            <div className="relative aspect-[722/958] w-full overflow-hidden border border-black bg-[#3a3a3a]">
              <Image
                src={solImages.finalWeekly}
                alt="Final Sol weekly and comparison screens"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="relative aspect-[755/526] w-full overflow-hidden border border-black bg-[#3a3a3a]">
              <Image
                src={solImages.finalHome}
                alt="Final Sol home and insights screens"
                fill
                className="object-cover object-left-top"
                sizes="100vw"
              />
            </div>
            <div className="relative aspect-[358/431] w-[47.42%] overflow-hidden">
              <Image
                src={solImages.finalEarphones}
                alt="Sol earphones with gradient background"
                fill
                className="object-cover object-bottom"
                sizes="50vw"
              />
            </div>
          </div>
          <Caption>Our final app implementation.</Caption>
        </figure>
      </section>

      {/* Key Learnings */}
      <section className={`${COLUMN} mt-fuori-xl`} aria-labelledby="learnings-heading">
        <h2
          id="learnings-heading"
          className="font-body text-fuori-h2 font-black text-white"
        >
          Key Learnings
        </h2>
        <div className="mt-fuori-sm flex max-w-copy flex-col gap-fuori-sm font-body text-fuori-body font-medium leading-[1.37] text-white">
          <p>
            Learning to communicate your ideas with your partners and giving insights
            into what works became a habit that kept everyone in the loop and made things
            easier.
          </p>
          <p>
            Do the research! The concepts explored in this project were far from my
            expertise, so we had to consult a huge amount of academic sources to get the
            insights needed to build this project. This allowed for a research-backed
            project with rich content.
          </p>
          <p>
            Be pragmatic! Using real-world use cases and actionable feedback, we were
            able to use resources such as Figma Make to create testable prototypes,
            focusing on what works best currently to adapt it in the future.
          </p>
        </div>
      </section>

      {/* Next project — blank placeholder until the next case study exists */}
      <section className={`${EDGE} mt-fuori-lg`}>
        <Link
          href="/#projects"
          className="font-body text-cta-sm font-medium text-white transition-opacity hover:opacity-70"
        >
          Next project →
        </Link>
        <div
          className="relative mt-fuori-sm aspect-[1572/821] w-full max-w-next overflow-hidden bg-[#1a1a1a]"
          role="img"
          aria-label="Next project coming soon"
        />
      </section>

      <ConnectFooter />
    </article>
  );
}
