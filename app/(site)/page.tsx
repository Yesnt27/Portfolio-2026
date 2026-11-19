import Link from "next/link";
import HeroCollage from "@/components/home/HeroCollage";
import IndexMenu from "@/components/home/IndexMenu";
import WorkList from "@/components/home/WorkList";
import LocalClock from "@/components/site/LocalClock";
import SuitNav from "@/components/site/SuitNav";
import ThemeToggle from "@/components/site/ThemeToggle";

/*
  Home — Figma frame 483:143 (1512 x 4745).
  Left column at x=80: name, role, index menu, clock, hero title, intro.
  The collage sits at x=611 / y=535 and overlaps the end of the title the way
  the frame does (puzzle mark above the title, phone card beneath it).
*/
export default function HomePage() {
  return (
    <main id="main">
      <section className="relative mx-auto max-w-frame px-[clamp(20px,5.29vw,80px)] pt-[clamp(28px,4.43vw,67px)]">
        <header className="flex items-start justify-between gap-6">
          <div className="rise-in">
            <Link href="/" className="font-pixel text-[16.5px] leading-[normal] text-copy transition-colors hover:text-ink">
              Kenny Nguyen
            </Link>
            <Link href="/about" className="group mt-[17px] flex items-start gap-[17px]">
              <span aria-hidden="true" className="caret-blink -ml-[2px] block h-[42px] w-[17px] shrink-0 bg-line" />
              <span className="max-w-[218px] font-pixel text-[16.5px] leading-[normal] text-muted transition-colors group-hover:text-copy">
                Visual design &amp; Product Designer
              </span>
            </Link>
            <IndexMenu className="mt-[57px]" />
          </div>

          <div className="rise-in flex items-start gap-[clamp(20px,3.6vw,54px)] [--rise-delay:80ms] md:-mt-[20px]">
            <div className="pt-[7px] max-sm:hidden">
              <ThemeToggle size="sm" />
            </div>
            <SuitNav variant="icons" />
          </div>
        </header>

        <div className="relative mt-[clamp(48px,13.6vw,206px)] lg:min-h-[548px]">
          <div className="relative z-10 lg:pt-[100px]">
            <LocalClock variant="inline" className="rise-in [--rise-delay:160ms]" />
            <h1 className="rise-in mt-[30px] max-w-[729px] font-serif text-[clamp(36px,3.97vw,60px)] font-medium leading-[1.333] text-ink [--rise-delay:240ms]">
              Designing interactions with emphasis on creative storytelling
            </h1>
          </div>

          {/* No z-index on the collage itself: its card (z-0) slides under the
              title (z-10) while the puzzle mark (z-20) sits above it. */}
          <HeroCollage className="mx-auto my-10 w-full max-w-[560px] lg:absolute lg:left-[39.27%] lg:top-0 lg:my-0 lg:w-[50.04%] lg:max-w-none [&_.hero-card]:z-0 [&_.hero-icon]:z-20" />

          <div className="rise-in relative z-10 ml-[6px] mt-[29px] [--rise-delay:340ms]">
            <p className="font-serif text-[40px] leading-none text-copy">Hey!</p>
            <div className="mt-[33px] max-w-[222px] space-y-[20px] font-serif text-[16.5px] font-medium leading-[20px] text-copy">
              <p>Kenny is a designer who uses stunning visuals and intuitive interactions to create thoughtful products.</p>
              <p>Building things through disciplinary visual mediums in tandem with code.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-[clamp(72px,12.8vw,194px)]">
        <WorkList />
      </div>

      <div aria-hidden="true" className="h-[93px]" />
    </main>
  );
}
