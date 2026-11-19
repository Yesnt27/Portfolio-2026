import type { CSSProperties } from "react";
import { CaseHero, CaseShell, CropImage, Indent, MetaGrid, NextProject, TocSection } from "@/components/projects/case-parts";
import SiteHeader from "@/components/site/SiteHeader";
import Reveal from "@/components/ui/Reveal";
import { solImages } from "@/lib/sol-images";
import type { Project } from "@/lib/projects";

/*
  Sol / Figbuild 2026 — Figma frame 571:90 (1512 x 10765).
  Copy column at x=286; the final-app panels sit 10px further in (x=296).
  Every phone, panel and render keeps its Figma geometry as percentages of
  its box, so the compositions scale as a unit.
*/

const { screens } = solImages;
const toc = [
  { id: "ideation", label: "Ideation" },
  { id: "research", label: "Research" },
  { id: "iteration", label: "Iteration" },
  { id: "solution", label: "The Solution" },
  { id: "learnings", label: "Key Learnings" },
];

const heading = "font-mono text-[16.5px] font-bold leading-[normal] text-copy";
const body = "font-mono text-[16.5px] leading-[normal] text-copy";
const cta =
  "group inline-flex items-baseline gap-[0.25em] font-sans leading-[normal] text-copy transition-colors hover:text-ink";

type Layer = { src: string; box: CSSProperties; crop?: CSSProperties; radius?: string };

/* A phone: screen, optional tab bar, then the device frame on top (Figma groups 571:291 / 295 / 315). */
function Phone({ frame, screen, bar, style }: { frame: string; screen: Layer; bar?: Layer; style: CSSProperties }) {
  const layer = (l: Layer, alt: string) => (
    <span className="absolute overflow-hidden" style={{ ...l.box, borderRadius: l.radius }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={l.src} alt={alt} loading="lazy" className="absolute max-w-none" style={l.crop ?? { inset: 0, width: "100%", height: "100%" }} />
    </span>
  );
  return (
    <span className="phone absolute block" style={style}>
      {layer(screen, "")}
      {bar && layer(bar, "")}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={frame} alt="" loading="lazy" className="pointer-events-none relative block h-auto w-full" />
    </span>
  );
}

function PhonesOverGlow() {
  return (
    <Reveal className="relative aspect-[922/607] w-full max-w-[922px]">
      {/* Flipped Figma gradient (sol1 4) as the backdrop. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={solImages.glowWide} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      <span className="sr-only">
        Three Sol screens on phones: the weekly cognitive chart, saved insights, and intellectual engagement analytics.
      </span>
      <Phone
        frame={solImages.iphoneFrame}
        style={{ left: "7.59%", top: "10.71%", width: "25.81%", aspectRatio: "238 / 480.835" }}
        screen={{
          src: screens.weekly,
          box: { left: "2%", top: "0.99%", width: "95.65%", height: "99.01%" },
          radius: "27.7% / 13.2%",
          crop: { left: 0, top: "-19.77%", width: "100%", height: "129.17%" },
        }}
        bar={{
          src: solImages.phoneTabbar,
          box: { left: "4.29%", top: "90.95%", width: "91.2%", height: "6.82%" },
          radius: "0 0 7.4% 7.4% / 0 0 48.8% 48.8%",
          crop: { left: "-3.96%", top: "-0.04%", width: "107.92%", height: "100.09%" },
        }}
      />
      <Phone
        frame={solImages.iphoneFrame}
        style={{ left: "36.77%", top: "10.71%", width: "25.82%", aspectRatio: "238.082 / 481" }}
        screen={{
          src: screens.saved,
          box: { left: "5.19%", top: "2.23%", width: "90.8%", height: "95.53%" },
          radius: "12.95% / 6.09%",
          crop: { left: 0, top: "-1.48%", width: "100%", height: "108.64%" },
        }}
        bar={{
          src: solImages.phoneTabbar,
          box: { left: "5.63%", top: "90.95%", width: "89.39%", height: "6.82%" },
          radius: "0 0 5.17% 5.17% / 0 0 33.6% 33.6%",
          crop: { left: "-7.32%", top: "-0.04%", width: "110.1%", height: "100.09%" },
        }}
      />
      <Phone
        frame={solImages.iphoneFrame15}
        style={{ left: "65.94%", top: "11.04%", width: "25.6%", aspectRatio: "236 / 476" }}
        screen={{
          src: screens.engagement,
          box: { left: "5.08%", top: "1.05%", width: "89.83%", height: "97.9%" },
          radius: "20.3% / 9.23%",
          crop: { left: "-11.73%", top: "-13.83%", width: "111.64%", height: "113.31%" },
        }}
      />
    </Reveal>
  );
}

function Screen({ src, alt, box, radius }: { src: string; alt: string; box: CSSProperties; radius: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute object-cover shadow-[0_14px_30px_-16px_rgba(0,0,0,0.7)] transition-transform duration-500 ease-snap hover:-translate-y-1.5"
      style={{ ...box, borderRadius: radius }}
    />
  );
}

export default function SolProject({ project }: { project: Project }) {
  const pitch = project.links.find((link) => link.label.toLowerCase().includes("pitch"))?.href ?? "#";
  const prototype = project.links.find((link) => link.label.toLowerCase().includes("prototype"))?.href ?? "#";

  return (
    <>
      <SiteHeader active="projects" compact />
      <main id="main">
        <CaseHero sources={[{ src: solImages.demoVideo, type: "video/mp4" }]} label="Sol demo video" />

        <CaseShell toc={toc}>
          <Indent x={286} as="header" reveal={false} className="pt-[clamp(64px,9.9vw,150px)]">
            <div className="flex flex-wrap items-start gap-x-[clamp(24px,7vw,136px)] gap-y-6">
              <h1 className="rise-in pt-[18px] font-serif text-[clamp(48px,5.3vw,80px)] leading-[1.522] tracking-[-0.01em] text-copy">
                {project.title}
              </h1>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={solImages.appIcon}
                alt="Sol app icon"
                width={135}
                height={135}
                className="rise-in size-[clamp(88px,8.9vw,135px)] rounded-[22%] [--rise-delay:120ms]"
              />
            </div>
            <div className="mt-[79px] max-w-[1061px]">
              <MetaGrid
                template="429fr 319fr 313fr"
                columns={[
                  {
                    label: "Team",
                    value: (
                      <>
                        <span className="block">3 design coordinators</span>
                        <span className="block">2 designers (Me)</span>
                      </>
                    ),
                  },
                  {
                    label: "Tools",
                    value: (
                      <span className="flex flex-col gap-[10px] text-ink">
                        <span>Figma</span>
                        <span>Figma Make</span>
                        <span>After Effects</span>
                        <span>Illustrator</span>
                      </span>
                    ),
                  },
                  {
                    label: "Timeline",
                    value: (
                      <>
                        <span className="block">3 day designathon</span>
                        <span className="block">March 2026</span>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          </Indent>

          <TocSection id="ideation" label="Ideation">
            <Indent x={286} className="mt-[155px]">
              <h2 className="max-w-[429px] font-serif text-[24px] leading-[normal] text-copy">The Case for Quantification</h2>
            </Indent>

            <Indent x={286} className="mt-[clamp(120px,23vw,347px)]">
              <p className="font-serif text-[24px] leading-[normal] text-faint">The Problem</p>
              <a href={pitch} target="_blank" rel="noopener noreferrer" className={`${cta} mt-[32px] text-[clamp(36px,4vw,60px)]`}>
                View the pitch video
                <span aria-hidden="true" className="transition-transform duration-300 ease-snap group-hover:translate-x-2">
                  →
                </span>
              </a>
              <p className={`${body} mt-[65px] max-w-[903px]`}>
                Sol is an app for tracking and logging various aspects of our mental state. It acts as an extension of our
                body&rsquo;s sensory experience of metacognition - our awareness of aspects of our thinking such as
                cognitive states, stress levels, and emotional intensity.
              </p>
              <p className={`${body} mt-[29px] max-w-[1052px]`}>
                Industrial technology freed people from needing physical labour to survive, leading many to compensate by
                exercising at gyms and monitoring their fitness. A similar shift is now happening with mental labour as AI
                takes over cognitive tasks. Given this shift, we proposed a tool to help people monitor their mental
                activity and stay intentional about their cognitive habits.
              </p>
            </Indent>

            <Indent x={286} className="mt-[clamp(120px,24.7vw,374px)]">
              <CropImage
                src={solImages.planet}
                alt="Sol's first homepage concept: a planet orbited by rings of thought"
                ratio="429 / 419"
                className="w-full max-w-[429px]"
              />
            </Indent>

            <Indent x={286} className="mt-[186px]">
              <h3 className={heading}>Defining a theme</h3>
              <p className={`${body} mt-[18px] max-w-[748px]`}>
                Sol takes its name from the sun, the soul, and the cyclical passage of time represented by sols on Mars.
                The concept reflects the mind as a dynamic system of thoughts, emotions, and stress that shift in patterns
                over time.
              </p>
            </Indent>
          </TocSection>

          <TocSection id="research" label="Research">
            <Indent x={286} className="mt-[200px]">
              <h3 className={heading}>Turning observations into verifiable insights</h3>
              <p className={`${body} mt-[32px] max-w-[678px]`}>
                Taking users feedback about usability of the app, I took the time to add real time changes that are
                observable insights to reinforce the idea of the quantified self. In turn it helps give the user a sense
                that solidifies their habit-building.
              </p>
            </Indent>
            <Indent x={286} className="mt-[59px]">
              <PhonesOverGlow />
            </Indent>
          </TocSection>

          <TocSection id="iteration" label="Iteration">
            <Indent x={286} className="mt-[39px]">
              <h3 className={heading}>Prototypes and testing</h3>
              <p className={`${body} mt-[11px] max-w-[893px]`}>
                I proposed a few ways that this solution could work in real-life, with considerations on practicality and
                mobility stances. We also asked a few users what they would like to see in what this product could look
                like based on its use cases.
              </p>
            </Indent>
            <Indent x={286} className="mt-[70px]">
              <CropImage
                src={solImages.useCases}
                alt="Case study scenarios showing how Sol fits into different people's days"
                ratio="1061 / 597"
                className="w-full max-w-[1061px] border border-line"
              />
            </Indent>

            <Indent x={286} className="mt-[43px]">
              <h3 className={heading}>Information management</h3>
              <ul className={`${body} mt-[8px] max-w-[1061px] leading-[30px]`}>
                <li>Serious analysis: Clear, consistent visualizations that reveal long-term behavioural patterns across time.</li>
                <li>Simple + deep views: Quick summaries for daily reflection with optional detailed analytics.</li>
                <li>Health alerts: Live tracking with notifications to flag positive progress or potential issues.</li>
              </ul>
            </Indent>

            <Indent x={286} className="mt-[200px]">
              <figure className="max-w-[1016px]">
                <div className="grid gap-[38px] sm:grid-cols-[384fr_594fr]">
                  <CropImage
                    src={solImages.earpieceSide}
                    alt="3D render of the Sol earpiece worn on a white mannequin head"
                    ratio="384.362 / 419.37"
                    className="border-[0.72px] border-line bg-[#d6d6d6]"
                  />
                  <CropImage
                    src={solImages.earpiecePurple}
                    alt="3D render of the Sol earpiece on a dark mannequin against purple"
                    ratio="593.747 / 419.37"
                    className="border-[0.72px] border-line bg-[#4e3a6e]"
                  />
                </div>
                <figcaption className={`${body} mt-[32px] text-center`}>
                  Some 3D renders of our physical earpiece product as a physical placeholder.
                </figcaption>
              </figure>
            </Indent>
          </TocSection>

          <TocSection id="solution" label="The Solution">
            <Indent x={286} className="mt-[49px]">
              <h3 className={`${heading} max-w-[976px]`}>Observations, verifiable insights and self-reflection</h3>
              <p className={`${body} mt-[27px] max-w-[939px]`}>
                To ground the product in real life use cases, I imagined how different users might interact with Sol
                day-to-day. We made sure to include a working digital prototype to bring everything together.
              </p>
            </Indent>

            <Indent x={296} className="mt-[140px]">
              <a href={prototype} target="_blank" rel="noopener noreferrer" className={`${cta} text-[clamp(28px,2.65vw,40px)]`}>
                View the final prototype
                <span aria-hidden="true" className="transition-transform duration-300 ease-snap group-hover:translate-x-2">
                  →
                </span>
              </a>

              <div className="mt-[43px] grid max-w-[1069px] gap-[25px] md:grid-cols-[500.426fr_543.794fr]">
                <div className="relative aspect-[500.426/664] overflow-hidden border-[0.693px] border-black bg-[#3a3a3a]">
                  <Screen
                    src={screens.weeklyDark}
                    alt="Sol weekly cognitive chart screen"
                    box={{ left: "4.85%", top: "5.01%", width: "42.24%", height: "86.01%" }}
                    radius="9.83% / 3.64%"
                  />
                  <Screen
                    src={screens.comparison}
                    alt="Sol comparison screen with two weeks side by side"
                    box={{ left: "52.63%", top: "5.01%", width: "42.24%", height: "86.01%" }}
                    radius="9.83% / 3.64%"
                  />
                </div>
                <div className="relative aspect-[543.794/664]">
                  <CropImage
                    src={solImages.glowTall}
                    alt=""
                    ratio="543.794 / 664"
                    className="absolute inset-0 rounded-[29px]"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={solImages.earbudLeft}
                    alt="Sol earbud, front view"
                    loading="lazy"
                    className="earbud absolute"
                    style={{ left: "0.84%", top: "9.63%", width: "54.66%", height: "76.2%" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={solImages.earbudRight}
                    alt="Sol earbud, mirrored pair"
                    loading="lazy"
                    className="earbud absolute [animation-delay:-2.5s]"
                    style={{ left: "46.53%", top: "4.13%", width: "55.09%", height: "84.46%" }}
                  />
                </div>
              </div>

              <div className="relative mt-[33px] aspect-[755/526] w-full max-w-[755px] overflow-hidden border border-black bg-[#3a3a3a]">
                <Screen
                  src={screens.homeAlt}
                  alt="Sol home screen with the day's orbit visual"
                  box={{ left: "4.5%", top: "6.27%", width: "27.95%", height: "87.26%" }}
                  radius="14% / 6.45%"
                />
                <Screen
                  src={screens.home}
                  alt="Sol home screen, evening state"
                  box={{ left: "35.63%", top: "5.51%", width: "28.21%", height: "88.02%" }}
                  radius="14% / 6.45%"
                />
                <Screen
                  src={screens.insights}
                  alt="Sol insights screen summarising behaviour patterns"
                  box={{ left: "66.89%", top: "5.51%", width: "28.34%", height: "88.4%" }}
                  radius="14% / 6.45%"
                />
              </div>
            </Indent>
          </TocSection>

          <TocSection id="learnings" label="Key Learnings">
            <Indent x={296} className="mt-[125px]">
              <h3 className={body}>Key Learnings</h3>
              <div className={`${body} mt-[77px] max-w-[980px] space-y-[21px]`}>
                <p>
                  Do the research! The concepts explored in this project were far from my expertise, so we had to consult
                  a huge amount of academic sources to get the insights needed to build this project. This allowed for a
                  research-backed project with informed design decisions.
                </p>
                <p>
                  Be pragmatic! Using real-world use cases and actionable feedback, we were able to use resources such as
                  Figma Make to create testable prototypes, focusing on what works best currently to adapt it in the
                  future.
                </p>
              </div>
            </Indent>
          </TocSection>

          <div className="h-[69px]" />
        </CaseShell>

        <NextProject
          href="/projects/fuorisalone"
          title="Fuorisalone Microsite 2025"
          sources={[
            { src: "/images/fuorisalone/fuorisalone-preview.av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
            { src: "/images/fuorisalone/fuorisalone-preview.mp4", type: "video/mp4" },
          ]}
          poster="/images/fuorisalone/fuorisalone-preview-poster.webp"
        />
        <div aria-hidden="true" className="h-[138px]" />
      </main>
    </>
  );
}
