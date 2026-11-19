/*
  A caption flanked by hairlines that are darkest at the page edges and fade
  out toward the text, with the faint 4px drop shadow from the Figma line
  (masked "Line 497", e.g. nodes 637:1587 / 637:1607 on the about frame).
*/
export default function CaptionRule({ children, className = "" }: { children: string; className?: string }) {
  const line = "h-px min-w-6 flex-1 [filter:drop-shadow(0_4px_2px_rgb(0_0_0/0.25))]";
  return (
    <div className={`flex items-center gap-[28px] ${className}`}>
      <span
        aria-hidden="true"
        className={line}
        style={{
          background:
            "linear-gradient(90deg, var(--color-ink) 0%, var(--color-ink) 12.6%, color-mix(in srgb, var(--color-ink) 16%, transparent) 100%)",
        }}
      />
      <p className="shrink-0 text-center font-pixel text-[clamp(17px,1.6vw,24px)] leading-[normal] tracking-[-0.05em] text-muted">
        {children}
      </p>
      <span
        aria-hidden="true"
        className={line}
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 12%, transparent) 0%, var(--color-ink) 93%, var(--color-ink) 100%)",
        }}
      />
    </div>
  );
}
