const socialLinksRow1 = [
  { label: "Github", href: "https://github.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Discord", href: "https://discord.com" },
];

const socialLinksRow2 = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@example.com" },
];

function SocialRow({ links }: { links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-[clamp(2rem,5vw,5.25rem)] gap-y-3">
      {links.map((link, index) => (
        <span key={link.label} className="flex items-center gap-[clamp(2rem,5vw,5.25rem)]">
          <a
            href={link.href}
            className="transition-opacity hover:opacity-70"
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
    <footer className="bg-black px-[clamp(1.5rem,5vw,6rem)] pb-[clamp(4rem,8vw,8rem)] pt-[clamp(4rem,10vw,10rem)] text-white">
      <h2 className="text-center font-display text-[clamp(3rem,8vw,7.5rem)] font-medium tracking-[-0.02em]">
        LETS CONNECT
      </h2>

      <nav
        className="mx-auto mt-[clamp(2rem,4vw,3.5rem)] flex max-w-4xl flex-col items-center gap-6 font-display text-[clamp(1.25rem,2.5vw,2.5rem)] font-light"
        aria-label="Social links"
      >
        <SocialRow links={socialLinksRow1} />
        <SocialRow links={socialLinksRow2} />
      </nav>
    </footer>
  );
}
