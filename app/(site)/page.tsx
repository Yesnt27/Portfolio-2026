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

          {/* Theme switch beside the suit icons; on phones it drops under them
              (column-reverse) so the row fits next to the name. */}
          <div className="rise-in flex items-center gap-[clamp(16px,3vw,46px)] [--rise-delay:80ms] max-sm:flex-col-reverse max-sm:items-end max-sm:gap-[12px] md:-mt-[20px]">
            <ThemeToggle />
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

          {/* ASCII TV. To resize it on laptops/desktops, change the three
              settings at the start of the className below:
                --tv-size   how wide the TV's box is, as a % of the content
                            column (70% = this design; 50% was the original).
                --tv-bleed  how far the box runs past the window's right
                            edge, as a fraction of its own width. The TV sits
                            inside the box with empty margins, so 0.28 cuts off
                            only the TV's knob side; 0.22 shows the whole TV.
                --tv-lift   how far it's raised above the title row. Raise it
                            for a bigger TV so the legs stay on the first screen.
              On phones/tablets (below lg) it's max-w-[560px] instead.

              How it works: right = (100% - 100vw) / 2 lines the box up with
              the window's right edge (100% = column width), then
              size × bleed pushes it past. body has overflow-x: clip, so
              nothing scrolls sideways.
              z-20: the title and intro wrappers (z-10) are full-width blocks, so
              without it they sit over the TV and swallow the screen's hover.
              pointer-events-none: only the screen takes the pointer, so the
              box's empty margins never block the title. */}
          <div className="lg:[--tv-size:90%] lg:[--tv-bleed:0.28] lg:[--tv-lift:300px] rise-in pointer-events-none relative z-20 mx-auto my-10 aspect-[676.6/547.2] w-full max-w-[560px] [--rise-delay:400ms] lg:absolute lg:top-[calc(-1*var(--tv-lift))] lg:right-[calc((100%_-_100vw)/2_-_var(--tv-size)*var(--tv-bleed))] lg:my-0 lg:w-[var(--tv-size)] lg:max-w-none">
            <AsciiTV />
          </div>

          <div className="rise-in relative z-10 ml-[6px] mt-[29px] [--rise-delay:340ms] lg:mt-[20px]">
            <p className="font-serif text-[40px] leading-none text-copy">Hey!</p>
            <div className="mt-[33px] max-w-[222px] lg:mt-[20px] space-y-[20px] font-serif text-[16.5px] font-medium leading-[20px] text-copy">
              {/* Highlighted like selected text (::selection in globals.css): ink block, paper text,
                  so it inverts in dark mode. clone keeps each line's block whole if it wraps. */}
              <p>
                <mark className="bg-ink px-px text-paper [box-decoration-break:clone]">Kenny is a designer</mark> who uses
                stunning visuals and intuitive interactions to create thoughtful products.
              </p>
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
