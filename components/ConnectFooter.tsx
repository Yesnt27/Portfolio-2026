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
    <div className="flex flex-wrap items-center justify-center gap-x-[clamp(2rem,calc(min(100vw,1920px)*84/1920),10rem)] gap-y-3">
      {links.map((link, index) => (
        <span key={link.label} className="flex items-center gap-[clamp(2rem,calc(min(100vw,1920px)*84/1920),10rem)]">
          <a
            href={link.href}
            className="transition-opacity hover:opacity-60"
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
          >
            {link.label}
          </a>
          {index < links.length - 1 && (
            <span aria-hidden="true">|</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function ConnectFooter() {
  return (
    <footer className="bg-black pb-flow-lg pt-section text-white">
      {/* Same centered page shell as the project sections. */}
      <div className="mx-auto w-full max-w-page px-gutter">
        <h2 className="text-center font-display text-[clamp(3rem,calc(min(100vw,2560px)*120/1920),10rem)] font-medium tracking-[-0.02em]">
          LETS CONNECT
        </h2>

        <nav
          className="mx-auto mt-flow-md flex max-w-4xl flex-col items-center gap-flow-sm font-display text-[clamp(1.25rem,calc(min(100vw,2560px)*40/1920),3.35rem)] font-light"
          aria-label="Social links"
        >
          <SocialRow links={socialLinksRow1} />
          <SocialRow links={socialLinksRow2} />
        </nav>
      </div>
    </footer>
  );
}
