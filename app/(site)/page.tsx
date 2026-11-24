import Link from "next/link";
import AsciiTV from "@/components/ascii-tv/AsciiTV";
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

  Vertically (lg+), the whole hero fits the first screen of a laptop
  (verified 1512x860, 1440x820, 1920x960): tighter gaps under the menu, two
  of them in vh so short screens shrink them. (The hero collage has since
  been removed; the right side is reserved for content to come.)
*/
export default function HomePage() {
  return (
    <main id="main">
      <section className="relative mx-auto max-w-frame px-[clamp(20px,5.29vw,80px)] pt-[clamp(28px,4.43vw,67px)] lg:pt-[clamp(28px,2.6vw,40px)]">
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
            <IndexMenu className="mt-[57px] lg:mt-[36px]" />
          </div>

          <div className="rise-in flex items-start gap-[clamp(20px,3.6vw,54px)] [--rise-delay:80ms] md:-mt-[20px]">
            <div className="pt-[7px] max-sm:hidden">
              <ThemeToggle size="sm" />
            </div>
            <SuitNav variant="icons" />
          </div>
        </header>

        <div className="relative mt-[clamp(48px,13.6vw,206px)] lg:mt-[clamp(8px,1.6vh,24px)] lg:min-h-[548px]">
          <div className="relative z-10">
            <LocalClock variant="inline" className="rise-in [--rise-delay:160ms]" />
            {/* 12.15em = the frame's 729px at 60px type; em keeps the same three
                lines as the font shrinks with the viewport. */}
            <h1 className="rise-in mt-[30px] lg:mt-[clamp(14px,2.2vh,30px)] max-w-[729px] font-serif lg:max-w-[12.15em] text-[clamp(36px,3.97vw,60px)] font-medium leading-[1.333] text-ink [--rise-delay:240ms]">
              Designing interactions with emphasis on creative storytelling
            </h1>
          </div>

          {/* ASCII TV (lg+): a 676.6 x 547.2-shaped box, 70% of the column
              wide, that bleeds off the right edge of the window.
              - right: (100% - 100vw) / 2 lines the box up with the window's
                right edge (100% = column width), then -19.6% (= 28% of the
                box) pushes it past. The TV sits inside the box with empty
                margins, so about the last 6% of the TV itself is cut off.
                body has overflow-x: clip, so nothing scrolls sideways.
              - top: -184px lifts it so the antenna rises beside the menu and
                the legs still land on the first screen of a laptop (1512x860).
              Below lg it sits in the flow between the title and the intro.
              z-20: the title and intro wrappers (z-10) are full-width blocks, so
              without it they sit over the TV and swallow the screen's hover.
              pointer-events-none: only the screen takes the pointer, so the
              box's empty margins never block the title. */}
          <div className="rise-in pointer-events-none relative z-20 mx-auto my-10 aspect-[676.6/547.2] w-full max-w-[560px] [--rise-delay:400ms] lg:absolute lg:top-[-184px] lg:right-[calc((100%_-_100vw)/2_-_19.6%)] lg:my-0 lg:w-[70%] lg:max-w-none">
            <AsciiTV />
          </div>

          <div className="rise-in relative z-10 ml-[6px] mt-[29px] [--rise-delay:340ms] lg:mt-[20px]">
            <p className="font-serif text-[40px] leading-none text-copy">Hey!</p>
            <div className="mt-[33px] max-w-[222px] lg:mt-[20px] space-y-[20px] font-serif text-[16.5px] font-medium leading-[20px] text-copy">
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
