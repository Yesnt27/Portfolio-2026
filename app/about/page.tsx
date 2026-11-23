import type { Metadata } from "next";
import MusicPlayer from "@/components/about/MusicPlayer";
import SiteHeader from "@/components/site/SiteHeader";
import CaptionRule from "@/components/ui/CaptionRule";
import Reveal from "@/components/ui/Reveal";
import { aboutImages } from "@/lib/about-images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kenny Nguyen is a visual and product designer in Vancouver, BC, studying Interactive Arts and Technology at Simon Fraser University.",
};

/*
  About — Figma frame 493:5454 (1512 x 3432).
  Copy column starts at x=203 ("Hey!" hangs 36px left of it); the player sits
  at x=922; the photo box spans x=164–1348.
*/
const COPY = "px-5 md:pl-[clamp(20px,13.43vw,203px)] md:pr-[clamp(20px,12.17vw,184px)]";
const BOX = "px-4 md:px-[clamp(16px,10.85vw,164px)]";

/* Figma image-fill crops, expressed relative to each clip box. */
const crops = {
  vista: { width: "100.05%", height: "268.36%", left: "0%", top: "-103.0%" },
  beach: { width: "154.89%", height: "232.06%", left: "-22.30%", top: "-114.57%" },
};

function CroppedPhoto({
  src,
  alt,
  crop,
  ratio,
  delay,
}: {
  src: string;
  alt: string;
  crop: { width: string; height: string; left: string; top: string };
  ratio: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="relative w-full overflow-hidden bg-mat" style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute max-w-none transition-transform duration-[1.2s] ease-snap hover:scale-[1.03]"
        style={crop}
      />
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />

      <main id="main" className="mx-auto max-w-frame">
        <section aria-labelledby="about-heading" className={`${COPY} pt-[clamp(56px,6.9vw,105px)]`}>
          <h1
            id="about-heading"
            className="font-serif text-[clamp(30px,2.65vw,40px)] leading-none tracking-[-0.05em] text-ink"
          >
            <span className="rise-in block -ml-[clamp(0px,2.4vw,36px)]">Hey!</span>
            <span className="rise-in mt-[27px] block [--rise-delay:120ms]">Thanks for stopping by!</span>
          </h1>

          <div className="mt-[60px] flex flex-col gap-16 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
            <div className="min-w-0 max-w-[552px] flex-1">
              <div className="rise-in font-mono text-[16.5px] leading-[normal] text-copy [--rise-delay:200ms]">
                <p>I&rsquo;m a visual &amp; product designer based in Vancouver, BC.</p>
                <p className="mt-[42px]">
                  I am interested in bridging the gap between interactive design as a form of beauty. I
                  believe that good design is accompanied with fundamental understandings of how form is
                  implemented without negating function, and I&rsquo;m constantly learning to find the
                  balance.
                </p>
                <p className="mt-[21px]">
                  I care about the threshold of design where something starts <b className="font-bold">feeling</b>{" "}
                  right, and so I iterate, and build in code.
                </p>
                <p className="mt-[21px]">
                  I am currently pursuing a Bachelors of Science in interactive Arts and Technology at Simon
                  Fraser University, with a computing science minor.
                </p>
                <p className="mt-[21px]">
                  Outside of design, you can find me playing pickup basketball, struggling with non-natural
                  chords on guitar, or ARAM...
                </p>
              </div>

              <Reveal className="mt-[52px] font-serif text-[24px] font-medium leading-[normal] text-ink">
                <p>More importantly,</p>
                <p className="ml-[clamp(64px,16.5vw,249px)] mt-[22px] max-w-[184px]">I care about the little things,</p>
              </Reveal>

              <Reveal delay={150} className="ml-[clamp(120px,24.5vw,370px)] -mt-[8px] w-[min(267px,60%)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aboutImages.signature}
                  alt="Kenny's signature"
                  width={267}
                  height={128}
                  loading="lazy"
                  className="h-auto w-full dark:invert"
                />
              </Reveal>
            </div>

            <MusicPlayer className="rise-in mx-auto shrink-0 [--rise-delay:280ms] xl:mx-0 xl:-mt-[10px]" />
          </div>
        </section>

        <section aria-label="A collage of photos about me" className="mt-[clamp(28px,2.2vw,33px)]">
          <CaptionRule>A collage of photos about me</CaptionRule>

          <div className={`${BOX} mt-[clamp(48px,5.9vw,89px)]`}>
            <div className="border border-line bg-card px-[clamp(12px,1.52vw,23px)] pb-[clamp(16px,1.72vw,26px)] pt-[clamp(16px,1.72vw,26px)]">
              <div className="grid gap-[clamp(10px,1.24vw,18.7px)] md:grid-cols-[469.278fr_647fr]">
                <Reveal className="relative aspect-[469.278/661.585] overflow-hidden bg-mat">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutImages.portrait}
                    alt="Portrait of Kenny in a dark suit and patterned tie"
                    width={776}
                    height={1094}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-snap hover:scale-[1.03]"
                  />
                </Reveal>
                <div className="flex flex-col gap-[clamp(10px,1.18vw,17.9px)]">
                  <CroppedPhoto
                    src={aboutImages.vista}
                    alt="Kenny with arms raised on a mountain lookout above the ocean and islands"
                    crop={crops.vista}
                    ratio="647 / 321.613"
                    delay={120}
                  />
                  <CroppedPhoto
                    src={aboutImages.beach}
                    alt="A group of friends posing together on a wide sandy beach"
                    crop={crops.beach}
                    ratio="644 / 322.376"
                    delay={220}
                  />
                </div>
              </div>
            </div>

            <p className="mt-[36px] font-pixel text-[clamp(17px,1.6vw,24px)] leading-[normal] text-copy">
              Winter 2026 ~ Made w/ Figma and Next.js
            </p>
          </div>
        </section>

        <div aria-hidden="true" className="h-[clamp(56px,6vw,90px)]" />
      </main>
    </>
  );
}
