import Link from "next/link";
import IndexMenu from "@/components/home/IndexMenu";
import WorkList from "@/components/home/WorkList";
import LocalClock from "@/components/site/LocalClock";
import SuitNav from "@/components/site/SuitNav";
import ThemeToggle from "@/components/site/ThemeToggle";

/*
  Home — Figma frame 483:143 (1512 x 4745).
  Left column at x=80: name, role, index menu, clock, hero title, intro.

  Hero collage: moved right of the frame's x=611. In the frame it covered the
  end of the title ("interacti|ons"). It is now flush with the column's right
  edge, lining up with the nav icons above it, and the title is capped in em
  so it always wraps into the frame's three lines. Title and collage both
  scale with the viewport, so the gap between them holds at every lg width
  (~36px at 1512, ~22px at 1024) instead of the title growing into the
  collage on smaller laptops.
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
            {/* 12.15em = the frame's 729px at 60px type; em keeps the same three
                lines as the font shrinks with the viewport. */}
            <h1 className="rise-in mt-[30px] max-w-[729px] font-serif lg:max-w-[12.15em] text-[clamp(36px,3.97vw,60px)] font-medium leading-[1.333] text-ink [--rise-delay:240ms]">
              Designing interactions with emphasis on creative storytelling
            </h1>
          </div>

          {/* Right side intentionally left blank for now (the hero collage was
              removed; content to come). lg:min-h above keeps the space reserved. */}

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
