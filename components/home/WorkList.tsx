import Link from "next/link";
import AutoVideo from "@/components/ui/AutoVideo";
import Reveal from "@/components/ui/Reveal";
import { workItems, type WorkItem } from "@/lib/work";

/*
  Home "WORK" list (Figma frame 483:143, y=1402–3881).
  Each row: text column bottom-aligned on the left (copy at x=106), media
  starting at x=724 and running 983px wide, off the right edge of the frame.
  Rows are split by full-bleed hairlines (#616161 + 20% black), and a vertical
  hairline at x=73 runs the length of the list.
*/

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex h-[43px] min-w-[168px] items-center border border-ink bg-card px-[10px] font-pixel text-[16.5px] leading-[normal] text-ink shadow-[3px_4px_6px_rgba(0,0,0,0.28)]">
      {children}
    </span>
  );
}

function RowText({ item, linked }: { item: WorkItem; linked: boolean }) {
  return (
    <div className="flex h-full flex-col justify-end pb-1 pr-6 md:pl-[clamp(20px,7.01vw,106px)]">
      {item.tags.length > 0 && (
        <div className="flex flex-col items-start gap-[23px]">
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
      {item.meta && (
        <p className="mt-[26px] font-pixel text-[clamp(17px,1.59vw,24px)] leading-[normal] text-copy">{item.meta}</p>
      )}
      <h3 className="mt-[10px] font-pixel text-[clamp(32px,3.31vw,50px)] leading-[normal] text-ink">
        {item.title.map((line, index) => (
          <span key={line} className="block">
            {line}
            {linked && index === item.title.length - 1 && (
              <span
                aria-hidden="true"
                className="ml-[0.3em] inline-block -translate-x-2 opacity-0 transition-[opacity,translate] duration-300 ease-snap group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                →
              </span>
            )}
          </span>
        ))}
      </h3>
      {item.description && (
        <p className="mt-[41px] max-w-[465px] font-mono text-[clamp(17px,1.59vw,24px)] leading-[normal] text-ink">
          {item.description}
        </p>
      )}
    </div>
  );
}

function RowMedia({ item }: { item: WorkItem }) {
  const frame =
    "work-media relative aspect-[983/553] w-full overflow-hidden rounded-[12px] md:w-[65.01vw] md:max-w-[983px]";

  if (item.media) {
    return (
      <div className={`${frame} bg-black`}>
        <AutoVideo
          sources={item.media.sources}
          poster={item.media.poster}
          label={item.media.label}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-snap group-hover:scale-[1.025]"
        />
      </div>
    );
  }

  return (
    <div className={`${frame} grid place-items-center bg-card`}>
      <span className="font-pixel text-[16.5px] text-muted">
        coming soon<span className="caret-blink">_</span>
      </span>
    </div>
  );
}

export default function WorkList() {
  return (
    <section id="work" aria-labelledby="work-heading" className="relative scroll-mt-6">
      <h2 id="work-heading" className="sr-only">
        Work
      </h2>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-[109px] -top-[79px] max-md:hidden">
        <div className="relative mx-auto h-full max-w-frame">
          <span className="absolute inset-y-0 left-[4.83%] w-px bg-line" />
        </div>
      </div>

      <ul className="border-t border-line">
        {workItems.map((item, index) => {
          const body = (
            <>
              <Reveal className="order-2 md:order-1" delay={60}>
                <RowText item={item} linked={Boolean(item.href)} />
              </Reveal>
              <Reveal className="order-1 md:order-2" delay={index === 0 ? 0 : 120}>
                <RowMedia item={item} />
              </Reveal>
            </>
          );
          const grid =
            "mx-auto grid max-w-frame gap-y-6 px-4 py-[26px] md:grid-cols-[47.9%_1fr] md:px-0";
          return (
            <li key={item.id} className="border-b border-line">
              {item.href ? (
                <Link href={item.href} className={`group ${grid}`} aria-label={`${item.title.join(" ")}: ${item.description ?? "case study"}`}>
                  {body}
                </Link>
              ) : (
                <div className={grid}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
