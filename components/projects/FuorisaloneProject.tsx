import type { CSSProperties } from "react";
import { CaseHero, CaseShell, CaseVideo, CropImage, Indent, MetaGrid, NextProject, TocSection } from "@/components/projects/case-parts";
import PosterParallax from "@/components/projects/PosterParallax";
import SiteHeader from "@/components/site/SiteHeader";
import Reveal from "@/components/ui/Reveal";
import { fuorisaloneImages } from "@/lib/fuorisalone-images";
import { solImages } from "@/lib/sol-images";
import type { Project } from "@/lib/projects";

/*
  Fuorisalone Microsite — Figma frame 515:157 (1512 x 11784).
  The frame staggers its blocks across the page (x = 274, 395, 410, 478,
  415, 310); each block below keeps its own Figma x-offset via <Indent x>.
*/

const { media, webp } = fuorisaloneImages;
const toc = [
  { id: "ideation", label: "Ideation" },
  { id: "research", label: "Research" },
  { id: "iteration", label: "Iteration" },
  { id: "solution", label: "The Solution" },
  { id: "learnings", label: "Key Learnings" },
];

const heading = "font-serif text-[24px] leading-[normal] text-ink";
const body = "font-mono text-[16.5px] leading-[normal]";

/* 1 Figma px inside the 1195px-wide poster row (container query units). */
const u = (px: number) => `calc(${px} * var(--u))`;

type Orbit = { src: string; box: [number, number, number, number]; inner: [number, number]; inset: string };
const orbits: Orbit[] = [
  { src: fuorisaloneImages.orbits[0], box: [531, -15, 1031.466, 904.753], inner: [595.278, 859.831], inset: "-23.26% -33.6%" },
  { src: fuorisaloneImages.orbits[1], box: [-768, -291, 1623.582, 1424.13], inner: [937, 1353.42], inset: "-14.78% -21.34%" },
  { src: fuorisaloneImages.orbits[2], box: [182, -89.67, 782.139, 787.411], inner: [595.278, 584.272], inset: "-34.23% -33.6%" },
];

const rowPosters = [
  { src: webp.ahhhhh, alt: "Salone experimental poster", box: [20, 18, 355.527, 487] },
  { src: webp.showcase, alt: "Fuorisalone showcase poster", box: [407, 18, 375.315, 485.701] },
  { src: webp.frame100, alt: "Fuorisalone 2024 Milan Design Week poster", box: [816.6, 18, 355.318, 487] },
] as const;

/* Lead poster row (Figma 520:236): three posters over the gradient orbit lines. */
function PosterRow() {
  return (
    <Reveal className="@container relative aspect-[1195/525] w-full max-w-[1195px] overflow-hidden border border-faint">
      <div className="absolute inset-0" style={{ ["--u" as string]: "calc(100cqw / 1195)" } as CSSProperties}>
        {orbits.map((orbit) => {
          const [x, y, w, h] = orbit.box;
          return (
            <div
              key={orbit.src}
              aria-hidden="true"
              className="absolute flex items-center justify-center"
              style={{ left: u(x), top: u(y), width: u(w), height: u(h) }}
            >
              <div className="relative flex-none rotate-[64.8deg]" style={{ width: u(orbit.inner[0]), height: u(orbit.inner[1]) }}>
                <div className="absolute" style={{ inset: orbit.inset }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={orbit.src} alt="" className="block size-full max-w-none" />
                </div>
              </div>
            </div>
          );
        })}
        {rowPosters.map((poster) => {
          const [x, y, w, h] = poster.box;
          return (
            <div
              key={poster.src}
              className="poster-row-item absolute overflow-hidden bg-mat"
              style={{ left: u(x), top: u(y), width: u(w), height: u(h) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster.src} alt={poster.alt} loading="lazy" decoding="async" className="size-full object-cover" />
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

function LearningCard({ index, title, glyphs, children }: { index: number; title: string; glyphs: number; children: string }) {
  return (
    <Reveal delay={index * 120} className="learning-card relative aspect-[421/351] w-full max-w-[421px] overflow-hidden border border-faint bg-card-soft">
      <div className="absolute left-[13%] top-[23%] right-[10%] flex flex-col">
        <p className="font-serif text-[16.5px] leading-[normal] text-ink">
          {index + 1}. {title}
        </p>
        <div className="mt-[12px] flex gap-[14px]">
          <span aria-hidden="true" className="whitespace-pre font-pixel text-[16.5px] leading-[normal] text-ink">
            {Array.from({ length: glyphs }, () => "▞").join("\n")}
          </span>
          <p className="max-w-[254px] pt-[2px] font-mono text-[12px] leading-[normal] text-copy">{children}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function FuorisaloneProject({ project }: { project: Project }) {
  return (
    <>
      <SiteHeader active="projects" compact />
      <main id="main">
        <CaseHero sources={[...media.demo]} poster={media.demoPoster} label="Fuorisalone microsite demo video" />

        <CaseShell toc={toc}>
          <Indent x={274} as="header" reveal={false} className="pt-[clamp(64px,10vw,152px)]">
            <div className="flex flex-wrap items-start gap-x-[clamp(24px,7.6vw,85px)] gap-y-6">
              <h1 className="rise-in max-w-[419px] pt-[14px] font-serif text-[clamp(38px,3.3vw,50px)] leading-[normal] tracking-[-0.06em] text-ink">
                {project.title}
              </h1>
              <div className="rise-in w-[254px] max-w-full bg-line p-[10px] [--rise-delay:120ms]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fuorisaloneImages.logo} alt="Fuorisalone logo" width={1269} height={555} className="aspect-[1269/555] w-full" />
              </div>
            </div>

            <div className="mt-[104px] max-w-[1195px]">
              <MetaGrid
                template="534fr 554fr 107fr"
                columns={[
                  {
                    label: "Team",
                    value: (
                      <span className="block leading-[35px] text-ink">
                        5 design coordinators (Me)
                        <br />
                        No designated roles
                        <br />
                        Collaborative work
                      </span>
                    ),
                  },
                  { label: "Timeline", value: <span className="text-ink">March 2026 - April 2026</span> },
                  { label: "Tools", value: <span className="text-ink">Figma</span> },
                ]}
              />
            </div>
          </Indent>

          <TocSection id="ideation" label="Ideation">
            <Indent x={274} className="mt-[63px]">
              <p className={`${body} max-w-[711px] text-ink`}>
                Experimental website for visitors of Fuorisalone design district 2024 and encapsulating all its exhibits with
                concise UX/UI design.
              </p>
              <div className="mt-[32px]">
                <PosterRow />
              </div>
            </Indent>

            <Indent x={395} className="mt-[113px]">
              <h2 className={heading}>The issue of overdesigning and missing the target audience</h2>
              <p className={`${body} mt-[30px] max-w-[495px] text-copy`}>
                We aimed to create an experience where we intend to create a distinctive brand identity for the annual
                Fuorisalone design festival while bridging the intersections of UX/UI to create a site that is largely
                experimental and unique.
              </p>
            </Indent>

            <section aria-label="Poster iterations" className="mt-[clamp(120px,20vw,300px)] px-5 md:pl-[clamp(20px,17.13vw,259px)] md:pr-[clamp(20px,3.8vw,57px)]">
              <PosterParallax caption="Exploring styles through initial iterations of high-fidelity posters" />
            </section>
          </TocSection>

          <TocSection id="research" label="Research">
            <Indent x={410} className="mt-[73px]">
              <CropImage
                src={fuorisaloneImages.contentStrategy}
                alt="Content strategy slide: the user flow from exhibitions to artists to detail pages"
                ratio="1023 / 575"
                className="w-full max-w-[1023px] border border-[#999]"
              />
            </Indent>
            <Indent x={478} className="mt-[61px]">
              <h2 className={heading}>Research</h2>
              <p className={`${body} mt-[4px] max-w-[966px] text-copy`}>
                Design process covered work on posters (more experimental), which then translated onto inspiration for our
                site which can be iterated on and narrowed in further.
              </p>
              <div className={`${body} mt-[38px] pl-[6px] text-copy`}>
                <p>Goals:</p>
                <ol className="list-decimal pl-[24.75px]">
                  <li>Understand personas to converge design decisions</li>
                  <li>Pinpoint important design principles to iterate on</li>
                </ol>
              </div>
            </Indent>
          </TocSection>

          <TocSection id="iteration" label="Iteration">
            <Indent x={410} className="mt-[39px]">
              <CaseVideo
                sources={[...media.prototype]}
                poster={media.prototypePoster}
                label="Early Fuorisalone prototype: the district transitions screen"
                ratio="1023 / 576"
                className="w-full max-w-[1023px] border border-faint"
              />
            </Indent>
            <Indent x={478} className="mt-[55px]">
              <h2 className={heading}>Prototypes and testing</h2>
              <p className={`${body} mt-[23px] max-w-[861px] text-ink`}>
                After many long hours of iteration and wireframes, building from our previous ideas, I consolidated our
                principles and brought them to life with an initial prototype, to see how things would look like in practice
                and prepared for feedback from users.
              </p>
            </Indent>
          </TocSection>

          <TocSection id="solution" label="The Solution">
            <Indent x={415} className="mt-[96px]">
              <div className="flex max-w-[1028px] flex-col gap-[50px]">
                <CaseVideo
                  sources={[...media.districtSelection]}
                  poster={media.districtSelectionPoster}
                  label="Refined district selection page"
                  className="border border-faint"
                />
                <CaseVideo
                  sources={[...media.districtShowcase]}
                  poster={media.districtShowcasePoster}
                  label="Brera design district showcase page"
                  className="border border-faint"
                />
                <CaseVideo
                  sources={[...media.exhibitShowcase]}
                  poster={media.exhibitShowcasePoster}
                  label="Exhibit page with booking details"
                  className="border border-faint"
                />
              </div>
            </Indent>
            <Indent x={415} className="mt-[37px]">
              <h2 className={`${heading} max-w-[976px]`}>Implementation and Website flow</h2>
              <div className={`${body} mt-[28px] max-w-[888px] space-y-[21px] text-ink`}>
                <p>
                  After taking in feedback about our initial prototype being the problem that users would have to figure out
                  which interactions to choose first and how to get to them easier, we had to find a way to make that
                  easier.
                </p>
                <p>
                  I chose to settle on a design that would use presentation principles to garner interest and not have the
                  user second guess which features they missed. After the district showcase, I let them explore the
                  different sections via interactive features.
                </p>
              </div>
            </Indent>
          </TocSection>

          <TocSection id="learnings" label="Key Learnings">
            <Indent x={310} className="mt-[90px]">
              <h2 className={`${heading} max-w-[160px]`}>Key Learnings</h2>
              <div className="mt-[25px] grid max-w-[892px] gap-[50px] sm:grid-cols-2">
                <LearningCard index={0} title="Take your time." glyphs={5}>
                  Styling and aesthetic are all aspects that take a good amount of time and research, and if you leave out the
                  people and interaction factors, you&rsquo;ll start to deviate from who you are designing for and for what
                  purpose.
                </LearningCard>
                <LearningCard index={1} title="Don’t be complacent." glyphs={6}>
                  Good design is a process that requires drawing inspiration and learning from previous works. As such, I could
                  not afford to be stagnant with my designs, but to always seek out and not assume that my design is “the
                  current best design” in my head.
                </LearningCard>
              </div>
            </Indent>
          </TocSection>

          <div className="h-[clamp(96px,10vw,150px)]" />
        </CaseShell>

        <NextProject
          href="/projects/sol"
          title="Figbuild 2026 (Sol)"
          sources={[{ src: solImages.preview, type: "video/mp4" }]}
          poster={solImages.previewPoster}
        />
        <div aria-hidden="true" className="h-[138px]" />
      </main>
    </>
  );
}
