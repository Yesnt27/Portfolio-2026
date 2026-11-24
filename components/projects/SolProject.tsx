import type { CSSProperties } from "react";
import { CaseHero, CaseShell, CropImage, Indent, LearningCard, MetaGrid, NextProject, TocSection } from "@/components/projects/case-parts";
import GlowySoul from "@/components/projects/GlowySoul";
import SiteHeader from "@/components/site/SiteHeader";
import Reveal from "@/components/ui/Reveal";
import { solImages } from "@/lib/sol-images";
import type { Project } from "@/lib/projects";

/*
  Sol / Figbuild 2026 — Figma frame 689:2028 (1512 x 9387).
  Copy column at x=286; "The Solution" and "Key Learnings" sit at x=292, their
  panels at x=294. Every phone, panel and render keeps its Figma geometry as
  percentages of its box, so the compositions scale as a unit.
*/

const { screens } = solImages;
const toc = [
  { id: "ideation", label: "Ideation" },
  { id: "research", label: "Research" },
  { id: "iteration", label: "Iteration" },
  { id: "solution", label: "The Solution" },
  { id: "learnings", label: "Key Learnings" },
];

/* Figma text styles: "Heading 1" (Bogart 24) and "geist body" (Geist Mono 16.5). */
const type = "font-serif text-[24px] leading-[normal]";
const heading = `${type} text-copy`;
const body = "font-mono text-[16.5px] leading-[normal] text-copy";

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

/*
  A screen inside a coloured panel (Figma 689:2136 / 689:2144): placed and
  rounded as percentages of the panel, with the frame's thin outline.
*/
type Box = { left: number; top: number; width: number; height: number };

function PanelScreen({ src, alt, box, panel, radius, outline }: {
  src: string;
  alt: string;
  box: Box;
  panel: { width: number; height: number };
  radius: number;
  outline: string;
}) {
  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute object-cover transition-transform duration-500 ease-snap hover:-translate-y-1.5"
      style={{
        left: pct(box.left, panel.width),
        top: pct(box.top, panel.height),
        width: pct(box.width, panel.width),
        height: pct(box.height, panel.height),
        borderRadius: `${pct(radius, box.width)} / ${pct(radius, box.height)}`,
        border: `1px solid ${outline}`,
      }}
    />
  );
}

/* Three Sol screens on the amber panel (Figma 689:2136, 964 x 648). */
function AmberPanel() {
  const panel = { width: 964, height: 648 };
  const screen = { panel, radius: 38.303, outline: "#4e4e4e" };
  return (
    <div className="relative aspect-[964/648] w-full max-w-[964px] overflow-hidden border-[1.277px] border-black bg-[#e4aa53]">
      <PanelScreen
        {...screen}
        src={screens.homeAlt}
        alt="Sol home screen with the day's orbit visual"
        box={{ left: 43.41, top: 31.13, width: 269.474, height: 585.872 }}
      />
      <PanelScreen
        {...screen}
        src={screens.home}
        alt="Sol home screen, evening state"
        box={{ left: 343.45, top: 26.03, width: 271.926, height: 591.201 }}
      />
      <PanelScreen
        {...screen}
        src={screens.insights}
        alt="Sol insights screen summarising behaviour patterns"
        box={{ left: 644.77, top: 26.03, width: 273.151, height: 593.866 }}
      />
    </div>
  );
}

/* Weekly + comparison screens (Figma 689:2144, 444 x 567) beside the earbuds
   floating over the sol4 gradient (689:2147, 484 x 567). */
function ScreensAndEarbuds() {
  const panel = { width: 444, height: 567 };
  const screen = { panel, radius: 18.449, outline: "#3a3a3a" };
  return (
    <div className="grid max-w-[965px] gap-[37px] sm:grid-cols-[444fr_484fr]">
      <div className="relative aspect-[444/567] overflow-hidden border-[0.615px] border-black bg-[#c47d58]">
        <PanelScreen
          {...screen}
          src={screens.weeklyDark}
          alt="Sol weekly cognitive chart screen"
          box={{ left: 21.53, top: 29.52, width: 187.572, height: 506.725 }}
        />
        <PanelScreen
          {...screen}
          src={screens.comparison}
          alt="Sol comparison screen with two weeks side by side"
          box={{ left: 233.69, top: 29.52, width: 187.572, height: 506.725 }}
        />
      </div>
      <div className="relative aspect-[484/567] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={solImages.glowTall} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={solImages.earbudLeft}
          alt="Sol earbud, front view"
          loading="lazy"
          className="earbud absolute"
          style={{ left: "0.839%", top: "10.037%", width: "54.658%", height: "79.429%" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={solImages.earbudRight}
          alt="Sol earbud, mirrored pair"
          loading="lazy"
          className="earbud absolute [animation-delay:-2.5s]"
          style={{ left: "46.525%", top: "4.302%", width: "55.09%", height: "88.031%" }}
        />
      </div>
    </div>
  );
}

/* Card copy block placement in the Sol frame (Figma 689:2343): "1." at x=68,
   y=82 of the 421 x 351 card; ▞ column and copy 22px below; copy at x=99. */
const SOL_CARD = { left: "16.152%", top: "23.362%", titleGap: 22, textGap: 21, textWidth: 259 };

export default function SolProject({ project }: { project: Project }) {
  return (
    <>
      <SiteHeader active="projects" compact />
      <main id="main">
        <CaseHero sources={[{ src: solImages.demoVideo, type: "video/mp4" }]} label="Sol demo video" />

        <CaseShell toc={toc}>
          <Indent x={286} as="header" reveal={false} className="pt-[clamp(56px,8.73vw,132px)]">
            <div className="flex flex-wrap items-start gap-x-[clamp(24px,7.4vw,112px)] gap-y-6">
              <h1 className="rise-in pt-[18px] font-serif text-[clamp(48px,5.3vw,80px)] leading-[1.522] tracking-[-0.01em] text-ink">
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
                template="405fr 295fr 313fr"
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
                      <span className="flex flex-col gap-[10px]">
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
            <Indent x={286} className="mt-[150px]">
              <h2 className={`${heading} max-w-[429px]`}>The Case for Quantification</h2>
              <p className={`${body} mt-[44px] max-w-[958px]`}>
                Industrial technology freed people from needing physical labour to survive, leading many to compensate by
                exercising at gyms and monitoring their fitness. A similar shift is now happening with mental labour as AI
                takes over cognitive tasks. Given this shift, we proposed a tool to help people monitor their mental
                activity and stay intentional about their cognitive habits.
              </p>
            </Indent>

            <Indent x={286} className="mt-[106px]">
              <figure className="max-w-[739px]">
                <figcaption className={`${body} max-w-[731px]`}>
                  Fig. The concept reflects the mind as a dynamic system of thoughts, emotions, and stress that shift in
                  patterns over time.
                </figcaption>
                <GlowySoul className="mt-[10px]" />
              </figure>
            </Indent>

            <Indent x={286} className="mt-[71px]">
              <h2 className={heading}>The Idea</h2>
              <p className={`${body} mt-[31px] max-w-[840px]`}>
                Sol is an app for tracking and logging various aspects of our mental state. It acts as an extension of our
                body&rsquo;s sensory experience of metacognition - our awareness of aspects of our thinking such as
                cognitive states, stress levels, and emotional intensity.
              </p>
            </Indent>
          </TocSection>

          <TocSection id="research" label="Research">
            <Indent x={286} className="mt-[122px]">
              <h2 className={heading}>Turning observations into verifiable insights</h2>
              <p className={`${body} mt-[29px] max-w-[678px]`}>
                Taking users feedback about usability of the app, I took the time to add real time changes that are
                observable insights to reinforce the idea of the quantified self. In turn it helps give the user a sense
                that solidifies their habit-building.
              </p>
            </Indent>
            <Indent x={286} className="mt-[35px]">
              <PhonesOverGlow />
            </Indent>
          </TocSection>

          <TocSection id="iteration" label="Iteration">
            <Indent x={286} className="mt-[131px]">
              <h2 className={heading}>Prototypes and testing</h2>
              <p className={`${body} mt-[23px] max-w-[893px]`}>
                I proposed a few ways that this solution could work in real-life, with considerations on practicality and
                mobility stances. We also asked a few users what they would like to see in what this product could look
                like based on its use cases.
              </p>
            </Indent>
            <Indent x={286} className="mt-[88px]">
              <CropImage
                src={solImages.useCases}
                alt="Case study scenarios showing how Sol fits into different people's days"
                ratio="1061 / 597"
                className="w-full max-w-[1061px] border border-line"
              />
            </Indent>

            <Indent x={286} className="mt-[67px]">
              <h2 className={heading}>Information management</h2>
              <ul className="mt-[27px] max-w-[1061px] font-mono text-[16.5px] leading-[30px] text-copy">
                <li>Serious analysis: Clear, consistent visualizations that reveal long-term behavioural patterns across time.</li>
                <li>Simple + deep views: Quick summaries for daily reflection with optional detailed analytics.</li>
                <li>Health alerts: Live tracking with notifications to flag positive progress or potential issues.</li>
              </ul>
            </Indent>

            <Indent x={286} className="mt-[128px]">
              {/* 1019 = the 1016 render row + its 3px shift right (x=289). */}
              <figure className="max-w-[1019px]">
                <figcaption className={body}>
                  Some 3D renders of our physical earpiece product as a physical representation.
                </figcaption>
                <div className="mt-[26px] grid gap-[38px] sm:ml-[3px] sm:grid-cols-[384fr_594fr]">
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
              </figure>
            </Indent>
          </TocSection>

          <TocSection id="solution" label="The Solution">
            <Indent x={292} className="mt-[93px]">
              <h2 className={`${heading} max-w-[976px]`}>Observations, verifiable insights and self-reflection</h2>
              <p className={`${body} mt-[24px] max-w-[939px]`}>
                To ground the product in real life use cases, I imagined how different users might interact with Sol
                day-to-day. We made sure to include a working digital prototype to bring everything together.
              </p>
            </Indent>

            <Indent x={294} className="mt-[138px]">
              <AmberPanel />
            </Indent>
            <Indent x={294} className="mt-[38px]">
              <ScreensAndEarbuds />
            </Indent>
          </TocSection>

          <TocSection id="learnings" label="Key Learnings">
            <Indent x={292} className="mt-[56px]">
              <h2 className={`${type} text-ink`}>Key Learnings</h2>
            </Indent>
            <Indent x={292} reveal={false} className="mt-[34px]">
              <div className="grid max-w-[892px] gap-x-[50px] gap-y-6 sm:grid-cols-2">
                <LearningCard index={0} title="Do the research!" glyphs={6} layout={SOL_CARD}>
                  The concepts explored in this project were far from my expertise, so we had to consult a huge amount of
                  academic sources to get the insights needed to build this project. This allowed for a research-backed
                  project with informed design decisions.
                </LearningCard>
                <LearningCard index={1} title="Be pragmatic!" glyphs={6} layout={SOL_CARD}>
                  Be pragmatic! Using real-world use cases and actionable feedback, we were able to use resources such as
                  Figma Make to create testable prototypes, focusing on what works best currently to adapt it in the future.
                </LearningCard>
              </div>
            </Indent>
          </TocSection>

          <div className="h-[88px]" />
        </CaseShell>

        <NextProject
          href="/projects/fuorisalone"
          title="Fuorisalone Microsite 2025"
          x={139}
          rails={{ left: "6.25%", right: "94.45%", above: 429, below: 341 }}
          sources={[
            { src: "/images/fuorisalone/fuorisalone-preview.av1.mp4", type: 'video/mp4; codecs="av01.0.08M.08"' },
            { src: "/images/fuorisalone/fuorisalone-preview.mp4", type: "video/mp4" },
          ]}
          poster="/images/fuorisalone/fuorisalone-preview-poster.webp"
        />
        <div aria-hidden="true" className="h-[67px]" />
      </main>
    </>
  );
}
