const socialLinksRow1 = [
  { label: "Github", href: "https://github.com/Yesnt27" },
  { label: "Instagram", href: "https://www.instagram.com/kennynguyen27/" },
  { label: "Discord", href: "https://discord.com" },
];

const socialLinksRow2 = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kenny-nguyen-3ab52622a/" },
  { label: "Email", href: "mailto:kennynguyen2726@gmail.com" },
];

function SocialRow({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-nav-gap gap-y-3">
      {links.map((link, index) => (
        <span key={link.label} className="flex items-center gap-nav-gap">
          <a
            href={link.href}
            className="transition-opacity hover:opacity-60"
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          >
            {link.label}
          </a>
          {index < links.length - 1 && <span aria-hidden="true">|</span>}
        </span>
      ))}
    </div>
  );
}

type ConnectFooterProps = {
  variant?: "default" | "landing" | "social";
};

export default function ConnectFooter({ variant = "default" }: ConnectFooterProps) {
  const isLanding = variant === "landing";
  const isSocial = variant === "social";
  const hideHeading = isLanding || isSocial;

  return (
    <footer
      className={`bg-black text-white ${
        isLanding || isSocial
          ? "pb-[clamp(2rem,calc(min(100vw,1920px)*80/1920),5rem)] pt-[clamp(3rem,calc(min(100vw,1920px)*150/1920),9.375rem)]"
          : "pb-flow-lg pt-section"
      }`}
    >
      <div className="mx-auto w-full max-w-page px-gutter">
        {!hideHeading && (
          <h2 className="text-center font-display text-[clamp(3rem,calc(min(100vw,1920px)*120/1920),10rem)] font-medium tracking-[-0.02em]">
            LETS CONNECT
          </h2>
        )}

        <nav
          className={`mx-auto flex max-w-4xl flex-col items-center gap-flow-sm font-display text-nav font-light ${
            hideHeading ? "" : "mt-flow-md"
          }`}
          aria-label="Social links"
        >
          <SocialRow links={socialLinksRow1} />
          <SocialRow links={socialLinksRow2} />
        </nav>

        {isLanding && (
          <div className="mt-[clamp(2.5rem,calc(min(100vw,1920px)*120/1920),7.5rem)] flex flex-col gap-4 font-body text-[clamp(0.875rem,calc(min(100vw,1920px)*25/1920),1.5625rem)] font-medium leading-[0.92] text-white sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[767px]">
              Living and working on the ancestral lands of the xʷməθkʷəy̓əm
              (Musqueam), Sḵwx̱wú7mesh (Squamish), and Səlilwətaɬ (Tsleil-Waututh)
              Nations.
            </p>
            <p className="shrink-0 sm:text-right">Made with Next.js and Figma</p>
          </div>
        )}
      </div>
    </footer>
  );
}
