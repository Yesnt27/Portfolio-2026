import Image from "next/image";
import Navbar from "@/components/Navbar";
import ConnectFooter from "@/components/ConnectFooter";
import { aboutImages } from "@/lib/about-images";

export const metadata = {
  title: "About Me | Kenny Nguyen",
  description:
    "Multidisciplinary graphic designer and artist focused on practical design and creative storytelling.",
};

/*
  About page — Figma frame 291:185 (1920-wide).
  Left column inset ~125px; two-column copy; masonry collage measured off the frame.
*/
const PAGE =
  "mx-auto w-full max-w-page px-[clamp(1.25rem,calc(min(100vw,1920px)*125/1920),7.8125rem)]";

/* Crop positions derived from Figma image fills on frame 291:185 */
const collageTiles = [
  {
    src: aboutImages.headshot,
    alt: "Portrait of Kenny Nguyen",
    box: "left-0 top-0 w-[24.08%] aspect-[384/391]",
    position: "55% 35%",
  },
  {
    src: aboutImages.fireworks,
    alt: "Fireworks over a crowd at dusk",
    box: "left-[27.77%] top-[0.2%] w-[24.08%] aspect-[384/389]",
    position: "50% 62%",
  },
  {
    src: aboutImages.food,
    alt: "Shared meal tray with rice, meat, and sides",
    box: "left-[55.99%] top-[0.2%] w-[44.01%] aspect-[702/495]",
    position: "50% 53%",
  },
  {
    src: aboutImages.beach,
    alt: "Friends posing together on a beach",
    box: "left-[0.44%] top-[46.79%] w-[45.39%] aspect-[724/522]",
    position: "47% 64%",
  },
  {
    src: aboutImages.vista,
    alt: "Person overlooking the ocean from a high vantage point",
    box: "left-[50.09%] top-[56.98%] w-[49.91%] aspect-[796/422]",
    position: "50% 55%",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#111] text-white">
      <Navbar variant="inner" theme="dark" />

      <section
        className={`${PAGE} pt-[clamp(2rem,calc(min(100vw,1920px)*100/1920),6.25rem)]`}
      >
        <h1 className="max-w-[577px] font-display text-[clamp(2.5rem,calc(min(100vw,1920px)*80/1920),5rem)] font-bold leading-[0.92]">
          Thanks for stopping by!
        </h1>

        <div className="mt-[clamp(1.75rem,calc(min(100vw,1920px)*70/1920),4.375rem)] grid gap-[clamp(2rem,calc(min(100vw,1920px)*64/1920),4rem)] lg:grid-cols-[minmax(0,825fr)_minmax(0,683fr)] lg:gap-[clamp(2rem,calc(min(100vw,1920px)*106/1920),6.625rem)]">
          <div className="space-y-[1.1em] font-body text-[clamp(1.0625rem,calc(min(100vw,1920px)*30/1920),1.875rem)] font-medium leading-[1.1]">
            <p>
              From a young age, I was captivated by illustrative books and the
              power of influence that it carried. I remember roleplaying as a
              kid making various custom models of my LEGO Bionicle toys and
              imagining separate plotlines and battles for each and every one of
              them. I also remember spending countless hours trying to make a
              custom level in geometry dash.
            </p>
            <p>
              Now, I am interested in bridging the gap between interactive
              design with programming proficiency. I believe that good design is
              accompanied with fundamental understandings of how it is made at a
              digital level.
            </p>
          </div>

          <div className="font-body text-[clamp(1.0625rem,calc(min(100vw,1920px)*30/1920),1.875rem)] font-medium leading-[1.1]">
            <div className="space-y-[1.1em]">
              <p>
                Currently, I&apos;m a 2nd year student pursuing a Bachelor of
                Science in the school of Interactive Arts and Technology.
              </p>
              <p>
                Skills not listed on this portfolio, I am drawing cartoon
                characters on procreate, relearning how to read sheet music, and
                pushing my friends to try new sports every now and then.
              </p>
            </div>

            <p className="mt-[clamp(1.5rem,calc(min(100vw,1920px)*50/1920),3.125rem)] max-w-[442px]">
              Wherever I am in my design journey, there&apos;s something that
              always lingers in my mind
            </p>

            <p className="mt-[clamp(1.25rem,calc(min(100vw,1920px)*40/1920),2.5rem)] max-w-[724px] font-display text-[clamp(2rem,calc(min(100vw,1920px)*60/1920),3.75rem)] font-bold leading-[0.92] lg:ml-[clamp(1rem,calc(min(100vw,1920px)*88/1920),5.5rem)]">
              , I&apos;m still building.
            </p>
          </div>
        </div>
      </section>

      <section
        className={`${PAGE} mt-[clamp(3rem,calc(min(100vw,1920px)*120/1920),7.5rem)]`}
        aria-label="Photo collage"
      >
        {/* Desktop: Figma masonry positions as % of the 1595×981 collage box */}
        <div className="relative hidden aspect-[1595/981] w-full md:block">
          {collageTiles.map((tile) => (
            <div
              key={tile.src}
              className={`absolute overflow-hidden ${tile.box}`}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: tile.position }}
              />
            </div>
          ))}
        </div>

        {/* Mobile: stacked asymmetric pairs */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <div className="relative col-span-1 aspect-square overflow-hidden">
            <Image
              src={aboutImages.headshot}
              alt="Portrait of Kenny Nguyen"
              fill
              sizes="50vw"
              className="object-cover"
              style={{ objectPosition: "55% 35%" }}
            />
          </div>
          <div className="relative col-span-1 aspect-square overflow-hidden">
            <Image
              src={aboutImages.fireworks}
              alt="Fireworks over a crowd at dusk"
              fill
              sizes="50vw"
              className="object-cover"
              style={{ objectPosition: "50% 62%" }}
            />
          </div>
          <div className="relative col-span-2 aspect-[702/495] overflow-hidden">
            <Image
              src={aboutImages.food}
              alt="Shared meal tray with rice, meat, and sides"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "50% 53%" }}
            />
          </div>
          <div className="relative col-span-2 aspect-[724/522] overflow-hidden">
            <Image
              src={aboutImages.beach}
              alt="Friends posing together on a beach"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "47% 64%" }}
            />
          </div>
          <div className="relative col-span-2 aspect-[796/422] overflow-hidden">
            <Image
              src={aboutImages.vista}
              alt="Person overlooking the ocean from a high vantage point"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "50% 55%" }}
            />
          </div>
        </div>

        <p className="mt-[clamp(1rem,calc(min(100vw,1920px)*40/1920),2.5rem)] pl-[clamp(0.5rem,calc(min(100vw,1920px)*49/1920),3.0625rem)] font-body text-[clamp(1.125rem,calc(min(100vw,1920px)*40/1920),2.5rem)] font-normal leading-[0.92] text-fuori-grey">
          Fig 1. A collage of moments and memories that define me.
        </p>
      </section>

      <ConnectFooter variant="social" />
    </main>
  );
}
