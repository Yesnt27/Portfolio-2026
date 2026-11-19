import FooterCode from "@/components/site/FooterCode";
import LocalClock from "@/components/site/LocalClock";
import SkyTrainDrawing from "@/components/site/SkyTrainDrawing";
import SkyTrainScene from "@/components/site/SkyTrainScene";
import { contactEmail, socialLinks } from "@/lib/site";

/*
  Pixel-block clusters behind "Say Hi!" (Departure Mono 60px, white @27%).
  Offsets are from the Figma footer, relative to the "Say Hi!" row.
*/
const blocks = [
  { glyphs: "▟\n░\n▒\n▓", x: -58, y: 8 },
  { glyphs: "▟\n░\n▒\n▓", x: 143, y: 95 },
  { glyphs: "▜\n▝\n▞", x: -19, y: 19 },
  { glyphs: "▜\n▝\n▞", x: 19, y: -10, mirror: true },
];

/*
  Site footer, shared by every page (Figma: e.g. 633:1547 on frame 493:5454).
  On the 1512 frame the three top columns start at x=83 (socials), 345 (code)
  and 909 (drawing); the fr ratios below reproduce those exactly at 1512 and
  scale them proportionally below it.
*/
export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-night text-white" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-frame pb-[clamp(56px,5.7vw,86px)] pl-[clamp(20px,5.49vw,83px)] pr-[clamp(20px,3.7vw,56px)] pt-[clamp(48px,4.9vw,74px)]">
        <div className="grid gap-y-12 lg:grid-cols-[minmax(0,262fr)_minmax(0,564fr)_minmax(0,547fr)]">
          <nav aria-label="Social links">
            <ul className="flex flex-wrap gap-x-6 gap-y-[13px] font-pixel text-[16.5px] leading-[normal] lg:flex-col">
              {socialLinks.map((link) => {
                const external = !link.href.startsWith("mailto:");
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-2 transition-colors hover:text-amber-soft"
                    >
                      <span className="w-0 overflow-hidden text-amber-soft transition-[width] duration-300 ease-snap group-hover:w-[1ch]" aria-hidden="true">
                        →
                      </span>
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <FooterCode className="lg:pt-[34px]" />

          <SkyTrainScene className="max-w-[547px] lg:max-w-none">
            <SkyTrainDrawing />
          </SkyTrainScene>
        </div>

        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between lg:mt-0">
          <div className="relative min-h-[198px] pt-[54px]">
            {blocks.map((block, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="pointer-events-none absolute whitespace-pre font-pixel text-[60px] leading-[normal] text-white opacity-27"
                style={{
                  left: block.x,
                  top: block.y,
                  transform: block.mirror ? "scaleX(-1)" : undefined,
                }}
              >
                {block.glyphs}
              </span>
            ))}
            <h2 id="footer-heading" className="relative ml-[42px] font-serif text-[50px] leading-[normal] text-white">
              Say Hi!
            </h2>
            <a
              href={`mailto:${contactEmail}`}
              className="relative ml-[42px] mt-[38px] inline-block font-serif sm:ml-[201px] text-[24px] leading-[normal] underline decoration-1 underline-offset-4 transition-colors hover:text-amber-soft"
            >
              {contactEmail}
            </a>
          </div>

          <LocalClock variant="footer" className="sm:pt-[24px] max-sm:items-start" />
        </div>
      </div>
    </footer>
  );
}
